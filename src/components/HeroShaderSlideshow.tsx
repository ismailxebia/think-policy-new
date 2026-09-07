"use client";

import { useEffect, useRef } from "react";

interface HeroShaderSlideshowProps {
  images: string[];
  intervalSeconds?: number;
  transitionDurationSeconds?: number;
  scrollY?: number;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2((a_position.x + 1.0) * 0.5, (1.0 - a_position.y) * 0.5);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_tex0;
  uniform sampler2D u_tex1;
  uniform float u_progress;
  uniform vec2 u_resolution;
  uniform vec2 u_image_res0;
  uniform vec2 u_image_res1;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_vel;
  uniform float u_hover;
  uniform float u_motion; // 1.0 = actively moving, 0.0 = resting / stationary
  uniform float u_time;

  // --- HASH & PROCEDURAL NOISE ---
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // --- 3-OCTAVE FRACTAL BROWNIAN MOTION (FBM) ---
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 3; ++i) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(10.0);
      a *= 0.5;
    }
    return v;
  }

  // --- CURL NOISE VECTOR FIELD FOR FLUID SWIRLS ---
  vec2 curlNoise(vec2 p) {
    const float eps = 0.01;
    float n1 = noise(p + vec2(0.0, eps));
    float n2 = noise(p - vec2(0.0, eps));
    float n3 = noise(p + vec2(eps, 0.0));
    float n4 = noise(p - vec2(eps, 0.0));
    float dy = (n1 - n2) / (2.0 * eps);
    float dx = (n3 - n4) / (2.0 * eps);
    return vec2(dy, -dx);
  }

  // --- EXACT OBJECT-FIT COVER UV CALCULATION ---
  vec2 getCoverUV(vec2 uv, vec2 screenRes, vec2 imgRes) {
    float screenAspect = screenRes.x / screenRes.y;
    float imgAspect = imgRes.x / imgRes.y;
    vec2 scale = vec2(1.0);
    if (screenAspect > imgAspect) {
      scale.y = imgAspect / screenAspect;
    } else {
      scale.x = screenAspect / imgAspect;
    }
    return vec2(
      uv.x * scale.x + (1.0 - scale.x) * 0.5,
      uv.y * scale.y + (1.0 - scale.y) * 0.5
    );
  }

  void main() {
    // 1. Aspect-Ratio Corrected UVs for texture sampling
    vec2 uv0 = getCoverUV(v_uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(v_uv, u_resolution, u_image_res1);

    // 2. Aspect-Ratio Corrected Coordinates for Isotropic Radius
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p_aspect = vec2(v_uv.x * aspect, v_uv.y);
    vec2 mouse_aspect = vec2(u_mouse.x * aspect, u_mouse.y);
    vec2 d_vec = p_aspect - mouse_aspect;
    float d_raw = length(d_vec);

    // Motion factor: 1.0 when moving rapidly, decays to 0.0 when resting
    float m = clamp(u_motion, 0.0, 1.0);

    // 3. Fluid Domain Warping: dynamic boundary that softens to a clean circle when still
    vec2 curl = curlNoise(p_aspect * 3.5 + u_time * 0.3);
    float turb = fbm(p_aspect * 4.0 - vec2(u_time * 0.25, u_time * 0.15));
    float warp_amplitude = 0.012 + 0.065 * m;

    // Comet velocity wake stretch along movement direction
    vec2 vel_aspect = vec2(u_mouse_vel.x * aspect, u_mouse_vel.y);
    float vel_len = length(vel_aspect);
    vec2 vel_dir = vel_len > 0.0001 ? vel_aspect / vel_len : vec2(0.0);
    float vel_dot = dot(normalize(d_vec + 0.0001), -vel_dir);
    float wake_stretch = clamp(vel_len * 0.25, 0.0, 0.10) * smoothstep(0.0, 1.0, vel_dot) * m;

    // Fluid warped distance with breathing harmonic
    float breathing = 0.012 * sin(u_time * 2.0 + d_raw * 8.0) * m;
    float warped_dist = d_raw - ((turb * 0.65 + curl.x * 0.35) * warp_amplitude + breathing - wake_stretch);

    // Lens radius with smooth falloff
    float base_radius = 0.38;
    float reveal_mask = smoothstep(base_radius, base_radius * 0.20, warped_dist) * u_hover;

    // 4. Dynamic Water Surface Ripple Wave (ripples when moving, settles when still)
    float ripple = sin(warped_dist * 24.0 - u_time * 5.0) * exp(-warped_dist * 3.8) * 0.012 * m * u_hover;

    // 5. Optical Refraction + Chromatic Dispersion Math:
    vec2 radial_dir = d_raw > 0.001 ? normalize(d_vec) : vec2(0.0);

    // Physical lens displacement (refracts and ripples while moving)
    vec2 lens_refract = (radial_dir * (reveal_mask * 0.009 + ripple) + curl * 0.004 * m) * m;

    // Subtle chromatic dispersion fringe along the refraction gradient
    vec2 chromatic_split = radial_dir * (0.0045 * reveal_mask * m);

    // Sample color textures: when m -> 0, offsets are exactly 0 (crystal clear original photo!)
    vec2 uv0_r = uv0 + lens_refract + chromatic_split;
    vec2 uv0_g = uv0 + lens_refract;
    vec2 uv0_b = uv0 + lens_refract - chromatic_split;

    vec4 col0_r = texture2D(u_tex0, uv0_r);
    vec4 col0_g = texture2D(u_tex0, uv0_g);
    vec4 col0_b = texture2D(u_tex0, uv0_b);
    vec3 col0_color = vec3(col0_r.r, col0_g.g, col0_b.b);

    vec2 uv1_r = uv1 + lens_refract + chromatic_split;
    vec2 uv1_g = uv1 + lens_refract;
    vec2 uv1_b = uv1 + lens_refract - chromatic_split;

    vec4 col1_r = texture2D(u_tex1, uv1_r);
    vec4 col1_g = texture2D(u_tex1, uv1_g);
    vec4 col1_b = texture2D(u_tex1, uv1_b);
    vec3 col1_color = vec3(col1_r.r, col1_g.g, col1_b.b);

    // 6. Dust particle slideshow sweep transition
    float n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (n * 0.22 + grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(grain * 0.05 + dustZone * 0.03, (grain - 0.5) * 0.03) * dustZone;

    // Monochrome base sample
    vec4 col0_base = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1_base = texture2D(u_tex1, uv1);

    float gray0 = dot(col0_base.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1_base.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = grain * dustZone * 0.3;

    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);
    vec3 active_color = mix(col1_color, col0_color, slide_mask);

    // Subtle edge caustics rim light
    float rim_zone = abs(warped_dist - base_radius * 0.76);
    float rim_glow = exp(-pow(rim_zone / 0.04, 2.0)) * 0.28 * u_hover * (0.2 + 0.8 * m);
    vec3 rim_light = vec3(1.0, 0.98, 0.95) * rim_glow;

    // Blend between monochrome and full color photograph
    vec3 final_rgb = mix(base_mono, active_color, reveal_mask) + rim_light;

    // Dynamically increase opacity within reveal bubble so the true photograph shines
    float final_alpha = mix(0.28, 0.95, reveal_mask);

    gl_FragColor = vec4(final_rgb, final_alpha);
  }
`;

export default function HeroShaderSlideshow({
  images,
  intervalSeconds = 5,
  transitionDurationSeconds = 1.6,
  scrollY = 0,
}: HeroShaderSlideshowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    function createShader(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex0 = gl.getUniformLocation(program, "u_tex0");
    const uTex1 = gl.getUniformLocation(program, "u_tex1");
    const uProgress = gl.getUniformLocation(program, "u_progress");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uImageRes0 = gl.getUniformLocation(program, "u_image_res0");
    const uImageRes1 = gl.getUniformLocation(program, "u_image_res1");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseVel = gl.getUniformLocation(program, "u_mouse_vel");
    const uHover = gl.getUniformLocation(program, "u_hover");
    const uMotion = gl.getUniformLocation(program, "u_motion");
    const uTime = gl.getUniformLocation(program, "u_time");

    const textures: WebGLTexture[] = [];
    const imageResolutions: [number, number][] = images.map(() => [1920, 1080]);
    let loadedCount = 0;

    images.forEach((src, idx) => {
      const tex = gl.createTexture()!;
      textures[idx] = tex;
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const handleLoad = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        imageResolutions[idx] = [img.naturalWidth, img.naturalHeight];
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        loadedCount++;
      };

      img.onload = handleLoad;
      img.src = src;
      if (img.complete && img.naturalWidth > 0) {
        handleLoad();
      }
    });

    let currentIndex = 0;
    let nextIndex = (currentIndex + 1) % images.length;
    let isTransitioning = false;
    let transitionStartTime = 0;
    let lastSwitchTime = performance.now();
    let animationFrameId: number;

    // --- Interactive Mouse Physics & Motion Decay State ---
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let prevMouseX = 0.5;
    let prevMouseY = 0.5;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let targetHover = 0.0;
    let currentHover = 0.0;
    let currentMotion = 0.0;
    let lastMoveTime = 0;
    let hasEntered = false;
    let lastPhysicsTime = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const section = canvas.closest("section");
      const sRect = section ? section.getBoundingClientRect() : canvas.getBoundingClientRect();
      const cRect = canvas.getBoundingClientRect();

      if (
        e.clientX >= sRect.left &&
        e.clientX <= sRect.right &&
        e.clientY >= sRect.top &&
        e.clientY <= sRect.bottom
      ) {
        const nx = (e.clientX - cRect.left) / cRect.width;
        const ny = (e.clientY - cRect.top) / cRect.height;
        targetMouseX = Math.max(0.0, Math.min(1.0, nx));
        targetMouseY = Math.max(0.0, Math.min(1.0, ny));
        targetHover = 1.0;
        lastMoveTime = performance.now();

        if (!hasEntered) {
          currentMouseX = targetMouseX;
          currentMouseY = targetMouseY;
          prevMouseX = targetMouseX;
          prevMouseY = targetMouseY;
          hasEntered = true;
        }
      } else {
        targetHover = 0.0;
      }
    };

    const handlePointerLeave = () => {
      targetHover = 0.0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    const intervalMs = intervalSeconds * 1000;
    const transitionMs = transitionDurationSeconds * 1000;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = (canvas.clientWidth || window.innerWidth) * dpr;
      const height = (canvas.clientHeight || 600) * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function render(now: number) {
      if (!gl || loadedCount < images.length) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      resize();

      // Damped spring physics for cursor tracking
      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.1);
      lastPhysicsTime = now;

      currentMouseX += (targetMouseX - currentMouseX) * 0.16;
      currentMouseY += (targetMouseY - currentMouseY) * 0.16;

      const vx = (currentMouseX - prevMouseX) / (dt || 0.016);
      const vy = (currentMouseY - prevMouseY) / (dt || 0.016);
      prevMouseX = currentMouseX;
      prevMouseY = currentMouseY;

      mouseVelX += (vx - mouseVelX) * 0.25;
      mouseVelY += (vy - mouseVelY) * 0.25;

      const speed = Math.hypot(vx, vy);

      currentHover += (targetHover - currentHover) * 0.10;

      // Dynamic motion energy calculation:
      // When cursor moves, motion increases proportionally to speed.
      // When stationary for > 150ms, target motion drops to 0.0.
      const idleTime = now - lastMoveTime;
      let targetMotion = 0.0;
      if (idleTime < 180 && targetHover > 0.05) {
        targetMotion = Math.min(speed * 2.2 + 0.35, 1.0);
      }

      // Responsive attack (0.28) when moving, smooth water-settling decay (0.038) when still
      const motionRate = targetMotion > currentMotion ? 0.28 : 0.038;
      currentMotion += (targetMotion - currentMotion) * motionRate;

      let smoothProgress = 0.0;

      if (!isTransitioning) {
        if (now - lastSwitchTime >= intervalMs) {
          isTransitioning = true;
          transitionStartTime = now;
          nextIndex = (currentIndex + 1) % images.length;
        }
      }

      if (isTransitioning) {
        const elapsed = now - transitionStartTime;
        const progress = Math.min(Math.max(elapsed / transitionMs, 0.0), 1.0);
        
        // Smoothstep cubic interpolation
        smoothProgress = progress * progress * (3.0 - 2.0 * progress);

        if (progress >= 1.0) {
          isTransitioning = false;
          currentIndex = nextIndex;
          nextIndex = (currentIndex + 1) % images.length;
          lastSwitchTime = now;
          smoothProgress = 0.0;
        }
      }

      gl.useProgram(program);

      // Texture 0 = Current front image
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
      gl.uniform1i(uTex0, 0);

      // Texture 1 = Incoming background image to be revealed
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[nextIndex]);
      gl.uniform1i(uTex1, 1);

      gl.uniform1f(uProgress, smoothProgress);
      gl.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl.uniform2f(uImageRes0, imageResolutions[currentIndex][0], imageResolutions[currentIndex][1]);
      gl.uniform2f(uImageRes1, imageResolutions[nextIndex][0], imageResolutions[nextIndex][1]);
      gl.uniform2f(uMouse, currentMouseX, currentMouseY);
      gl.uniform2f(uMouseVel, mouseVelX, mouseVelY);
      gl.uniform1f(uHover, currentHover);
      gl.uniform1f(uMotion, currentMotion);
      gl.uniform1f(uTime, (now * 0.001) % 1000.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
      textures.forEach((tex) => gl.deleteTexture(tex));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [images, intervalSeconds, transitionDurationSeconds]);

  return (
    <div
      className="absolute inset-x-0 -top-24 -bottom-24 z-0 pointer-events-none will-change-transform transition-transform duration-100 ease-out"
      style={{
        transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(1.08)`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ display: "block" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

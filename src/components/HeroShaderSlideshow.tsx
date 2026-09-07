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
  uniform float u_speed;
  uniform float u_hover;
  uniform float u_time;

  // --- PROCEDURAL HASH & NOISE ---
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

  // --- 4-OCTAVE FRACTAL BROWNIAN MOTION (FBM) ---
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(10.0);
      a *= 0.5;
    }
    return v;
  }

  // --- 2D CURL NOISE FOR VISCOUS FLUID BOUNDARY ---
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

  // --- EXACT OBJECT-FIT COVER UV ---
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
    // 1. Precise, undistorted UVs for texture sampling
    vec2 uv0 = getCoverUV(v_uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(v_uv, u_resolution, u_image_res1);

    // 2. Aspect-ratio corrected space for isotropic fluid metric
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(v_uv.x * aspect, v_uv.y);
    vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
    vec2 d = p - m;

    // 3. Unified Hydrodynamic Teardrop Deformation (Single Continuous Mathematical Lens)
    vec2 v = vec2(u_mouse_vel.x * aspect, u_mouse_vel.y);
    float vel_len = length(v);
    vec2 v_dir = vel_len > 0.0001 ? v / vel_len : vec2(0.0);

    // Project distance along the motion vector
    float proj_v = dot(d, v_dir);
    // Behind cursor (proj_v < 0): pull the fluid coordinate to form a continuous teardrop wake
    float tail_pull = min(0.0, proj_v) * clamp(u_speed * 1.6, 0.0, 0.75);
    vec2 d_hydro = d - v_dir * tail_pull;

    // Seamless viscous edge curl & organic turbulence
    vec2 fluid_curl = curlNoise(p * 3.5 + u_time * 0.35);
    float fluid_turb = fbm(p * 4.5 - u_time * 0.2);
    float boundary_noise = (fluid_curl.x * 0.035 + fluid_turb * 0.045) * (1.0 + u_speed * 0.5);

    // Distance to single unified liquid droplet
    float r = length(d_hydro) - boundary_noise;

    // Smooth Hermite liquid mask (generous lens radius ~0.33)
    float base_radius = 0.33;
    float liquid_mask = smoothstep(base_radius, base_radius * 0.25, r) * u_hover;

    // 4. Subtle Physical Water Meniscus Refraction:
    // Meniscus is zero in center (mask = 1), zero outside (mask = 0), and peaks smoothly only at the liquid edge!
    float meniscus = liquid_mask * (1.0 - liquid_mask) * 4.0;
    vec2 r_dir = length(d_hydro) > 0.001 ? normalize(d_hydro) : vec2(0.0);
    // Refraction activates gracefully with movement speed, zero when still
    vec2 refr_offset = r_dir * meniscus * 0.008 * u_speed;

    // 5. Slideshow Transition Wavefront
    float n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (n * 0.22 + grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(grain * 0.05 + dustZone * 0.03, (grain - 0.5) * 0.03) * dustZone;

    // 6. Base Monochrome Texture Samples
    vec4 col0_mono = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1_mono = texture2D(u_tex1, uv1);

    float gray0 = dot(col0_mono.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1_mono.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = grain * dustZone * 0.3;
    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);

    // 7. Color Texture Sample with Meniscus Refraction:
    // Center is 100% pin-sharp original photo; edge has subtle liquid refraction
    vec4 col0_color = texture2D(u_tex0, uv0 + refr_offset);
    vec4 col1_color = texture2D(u_tex1, uv1 + refr_offset);
    vec3 original_color = mix(col1_color.rgb, col0_color.rgb, slide_mask);

    // 8. Delicate Surface Tension Caustic Glow at Edge
    float edge_highlight = pow(meniscus, 2.5) * 0.16 * u_hover;

    // Final Composition
    vec3 final_rgb = mix(base_mono, original_color, liquid_mask) + vec3(edge_highlight);
    float final_alpha = mix(0.28, 0.95, liquid_mask);

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
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uHover = gl.getUniformLocation(program, "u_hover");
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

    // --- Interactive Mouse Physics State ---
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let prevMouseX = 0.5;
    let prevMouseY = 0.5;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let smoothSpeed = 0.0;
    let targetHover = 0.0;
    let currentHover = 0.0;
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

      currentMouseX += (targetMouseX - currentMouseX) * 0.15;
      currentMouseY += (targetMouseY - currentMouseY) * 0.15;

      const vx = (currentMouseX - prevMouseX) / (dt || 0.016);
      const vy = (currentMouseY - prevMouseY) / (dt || 0.016);
      prevMouseX = currentMouseX;
      prevMouseY = currentMouseY;

      mouseVelX += (vx - mouseVelX) * 0.22;
      mouseVelY += (vy - mouseVelY) * 0.22;

      const rawSpeed = Math.min(Math.hypot(vx, vy) * 0.22, 1.0);
      smoothSpeed += (rawSpeed - smoothSpeed) * 0.14;

      currentHover += (targetHover - currentHover) * 0.08;

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
      gl.uniform1f(uSpeed, smoothSpeed);
      gl.uniform1f(uHover, currentHover);
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

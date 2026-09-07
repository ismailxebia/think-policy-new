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
  uniform vec2 u_mouse_lead;
  uniform vec2 u_mouse_lag;
  uniform float u_wobble;
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

  // --- POLYNOMIAL SMOOTH MINIMUM FOR LIQUID METABALL FUSION ---
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
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

    // 2. Isotropic Coordinates for Liquid Droplet
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(v_uv.x * aspect, v_uv.y);
    vec2 m_lead = vec2(u_mouse_lead.x * aspect, u_mouse_lead.y);
    vec2 m_lag = vec2(u_mouse_lag.x * aspect, u_mouse_lag.y);

    float m = clamp(u_motion, 0.0, 1.0);
    float wobble = clamp(u_wobble, -0.5, 1.2);

    // 3. Dual-Center Fluid Metaball Math (Elastic Liquid Droplet):
    // Lead droplet (main body around cursor)
    vec2 d1_vec = p - m_lead;
    float dist1 = length(d1_vec);

    // Lag droplet (trailing liquid tail that creates viscous stretching)
    vec2 d2_vec = p - m_lag;
    float dist2 = length(d2_vec);

    // Harmonic multipole surface wobble (jelly jiggle oscillation)
    float theta = atan(d1_vec.y, d1_vec.x);
    float jiggle = wobble * 0.042 * (sin(3.0 * theta + u_time * 7.5) + cos(2.0 * theta - u_time * 5.0));

    // Dynamic radii: generous lead droplet + viscous trailing droplet
    float r1 = 0.46 + jiggle;
    float r2 = 0.38;

    // Organic liquid edge turbulence
    float turb = fbm(p * 3.5 - u_time * 0.2) * (0.010 + 0.045 * m);

    // Smooth minimum fuses the lead and lag points into an organic, elastic water droplet
    float fluid_dist = smin(dist1 - r1, dist2 - r2, 0.24) - turb;

    // 4. Silky-Smooth, Halo-Free Color Bleed:
    // Seamless Hermite transition blending color into monochrome with zero white halo ring
    float reveal_mask = smoothstep(0.06, -0.26, fluid_dist) * u_hover;

    // 5. Elastic Water Refraction (cohesive, subtle, and settles when still)
    vec2 radial_dir = dist1 > 0.001 ? normalize(d1_vec) : vec2(0.0);
    float ripple = sin(fluid_dist * 18.0 - u_time * 5.0) * exp(-max(0.0, fluid_dist + 0.25) * 2.8) * 0.007 * m;
    vec2 water_refract = radial_dir * (reveal_mask * 0.006 * m + ripple + wobble * 0.003);

    vec2 final_uv0 = uv0 + water_refract;
    vec2 final_uv1 = uv1 + water_refract;

    // 6. Dust particle slideshow sweep transition
    float n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (n * 0.22 + grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(grain * 0.05 + dustZone * 0.03, (grain - 0.5) * 0.03) * dustZone;

    // Single-pass sampling: no ghost shadows, no double layering
    vec4 col0 = texture2D(u_tex0, final_uv0 + dustOffset);
    vec4 col1 = texture2D(u_tex1, final_uv1);

    // Compute monochrome tone
    float gray0 = dot(col0.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = grain * dustZone * 0.3;

    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);
    vec3 active_color = mix(col1.rgb, col0.rgb, slide_mask);

    // 7. Pure, Soft, Velvety Transition:
    // Completely halo-free — color seamlessly diffuses into monochrome without harsh rims
    vec3 final_rgb = mix(base_mono, active_color, reveal_mask);

    // Smooth opacity curve
    float final_alpha = mix(0.28, 0.96, reveal_mask);

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
    const uMouseLead = gl.getUniformLocation(program, "u_mouse_lead");
    const uMouseLag = gl.getUniformLocation(program, "u_mouse_lag");
    const uWobble = gl.getUniformLocation(program, "u_wobble");
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

    // --- Elastic Water Physics (Metaball & Damped Harmonic Jiggle) ---
    let targetX = 0.5;
    let targetY = 0.5;
    let leadX = 0.5;
    let leadY = 0.5;
    let lagX = 0.5;
    let lagY = 0.5;
    let prevLeadX = 0.5;
    let prevLeadY = 0.5;
    let wobble = 0.0;
    let wobbleVel = 0.0;
    let targetHover = 0.0;
    let currentHover = 0.0;
    let targetMotion = 0.0;
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
        targetX = Math.max(0.0, Math.min(1.0, nx));
        targetY = Math.max(0.0, Math.min(1.0, ny));
        targetHover = 1.0;
        lastMoveTime = performance.now();

        if (!hasEntered) {
          leadX = targetX;
          leadY = targetY;
          lagX = targetX;
          lagY = targetY;
          prevLeadX = targetX;
          prevLeadY = targetY;
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

      // Elastic water physics update
      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.05);
      lastPhysicsTime = now;

      // Lead point tracks cursor with responsive spring
      leadX += (targetX - leadX) * 0.22;
      leadY += (targetY - leadY) * 0.22;

      // Lag point trails behind with viscous fluid drag (stretches droplet into fluid teardrop)
      lagX += (leadX - lagX) * 0.11;
      lagY += (leadY - lagY) * 0.11;

      const vx = (leadX - prevLeadX) / (dt || 0.016);
      const vy = (leadY - prevLeadY) / (dt || 0.016);
      prevLeadX = leadX;
      prevLeadY = leadY;
      const speed = Math.hypot(vx, vy);

      // Distance between lead and lag points (fluid stretch tension)
      const stretchDist = Math.hypot(leadX - lagX, leadY - lagY);

      // Damped harmonic oscillator for jelly bounce / wobble:
      // Accelerates on movement, bounces elastically on release
      const kSpring = 42.0;
      const cDamping = 6.0;
      const impulse = stretchDist * 16.0;
      const accel = impulse - kSpring * wobble - cDamping * wobbleVel;
      wobbleVel += accel * dt;
      wobble += wobbleVel * dt;
      wobble = Math.max(-0.4, Math.min(1.2, wobble));

      currentHover += (targetHover - currentHover) * 0.10;

      // Motion energy computation
      const idleTime = now - lastMoveTime;
      let targetMotion = 0.0;
      if (idleTime < 220 && targetHover > 0.05) {
        targetMotion = Math.min(speed * 2.8 + stretchDist * 4.5 + 0.35, 1.0);
      }

      // Responsive fluid attack, smooth settling decay
      const motionRate = targetMotion > currentMotion ? 0.26 : 0.038;
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
      gl.uniform2f(uMouseLead, leadX, leadY);
      gl.uniform2f(uMouseLag, lagX, lagY);
      gl.uniform1f(uWobble, wobble);
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

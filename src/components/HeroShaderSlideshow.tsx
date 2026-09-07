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
  uniform vec2 u_trail[8];
  uniform float u_trail_radii[8];
  uniform float u_hover;
  uniform float u_time;

  // --- PROCEDURAL NOISE & FBM ---
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

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.04 + vec2(11.3);
      a *= 0.5;
    }
    return v;
  }

  // Incompressible 2D Curl Noise for fluid stream bleeding
  vec2 curlNoise(vec2 p) {
    const float eps = 0.015;
    float n1 = noise(p + vec2(0.0, eps));
    float n2 = noise(p - vec2(0.0, eps));
    float n3 = noise(p + vec2(eps, 0.0));
    float n4 = noise(p - vec2(eps, 0.0));
    float dy = (n1 - n2) / (2.0 * eps);
    float dx = (n3 - n4) / (2.0 * eps);
    return vec2(dy, -dx);
  }

  // Exact object-fit cover UV calculation
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

  // Exact Signed Distance to a Tapered Capsule / Fluid Brush Segment
  float distToTaperedSegment(vec2 p, vec2 a, vec2 b, float ra, float rb) {
    vec2 ba = b - a;
    vec2 pa = p - a;
    float l2 = dot(ba, ba);
    if (l2 < 0.00001) return length(pa) - ra;
    float t = clamp(dot(pa, ba) / l2, 0.0, 1.0);
    vec2 closest = a + ba * t;
    float r = mix(ra, rb, t);
    return length(p - closest) - r;
  }

  void main() {
    // 1. Exact, pin-sharp UV coordinates (zero blur on image)
    vec2 uv0 = getCoverUV(v_uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(v_uv, u_resolution, u_image_res1);

    // 2. Aspect-Ratio Corrected Metric Space
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(v_uv.x * aspect, v_uv.y);

    // 3. Mathematical Union of Fluid Brush Stroke Segments
    vec2 p0 = vec2(u_trail[0].x * aspect, u_trail[0].y);
    float min_dist = length(p - p0) - u_trail_radii[0];

    for (int i = 0; i < 7; i++) {
      vec2 a = vec2(u_trail[i].x * aspect, u_trail[i].y);
      vec2 b = vec2(u_trail[i + 1].x * aspect, u_trail[i + 1].y);
      float d_seg = distToTaperedSegment(p, a, b, u_trail_radii[i], u_trail_radii[i + 1]);
      min_dist = min(min_dist, d_seg);
    }

    // 4. Fluid Ink Bleed & Capillary Diffusion Dynamics
    vec2 fluid_curl = curlNoise(p * 3.2 + u_time * 0.25);
    float ink_bleed = fbm(p * 5.2 - fluid_curl * 0.5 + u_time * 0.12) * 0.055;
    float d_fluid_ink = min_dist - ink_bleed;

    // 5. Painterly Ink Wash Opacity Falloff
    // u_hover naturally scales to 0 when idle so it closes completely
    float ink_reveal = smoothstep(0.06, -0.04, d_fluid_ink) * u_hover;

    // Subtle watercolor wash edge highlight
    float wash_rim = smoothstep(0.0, 0.45, ink_reveal) * smoothstep(0.92, 0.45, ink_reveal);
    vec3 wash_tone = vec3(0.98, 0.96, 0.92) * (wash_rim * 0.12 * u_hover);

    // 6. Slideshow Transition Wavefront
    float slide_n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float slide_grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (slide_n * 0.22 + slide_grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(slide_grain * 0.05 + dustZone * 0.03, (slide_grain - 0.5) * 0.03) * dustZone;

    // 7. Base Monochrome Texture
    vec4 col0_mono = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1_mono = texture2D(u_tex1, uv1);

    float gray0 = dot(col0_mono.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1_mono.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = slide_grain * dustZone * 0.3;
    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);

    // 8. 100% PURE, PIN-SHARP ORIGINAL PHOTOGRAPH COLORS
    vec4 col0_color = texture2D(u_tex0, uv0);
    vec4 col1_color = texture2D(u_tex1, uv1);
    vec3 pure_original_color = mix(col1_color.rgb, col0_color.rgb, slide_mask);

    // 9. Final Composition
    vec3 final_rgb = mix(base_mono, pure_original_color, ink_reveal) + wash_tone;
    float final_alpha = mix(0.28, 0.96, ink_reveal);

    gl_FragColor = vec4(final_rgb, final_alpha);
  }
`;

const TRAIL_COUNT = 8;

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
    const uTrail = gl.getUniformLocation(program, "u_trail");
    const uTrailRadii = gl.getUniformLocation(program, "u_trail_radii");
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

    // --- Dynamic Fluid Calligraphy Trail Physics ---
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0.5, y: 0.5 }));
    const trailBuffer = new Float32Array(TRAIL_COUNT * 2);
    const trailRadiiBuffer = new Float32Array(TRAIL_COUNT);

    let prevHeadX = 0.5;
    let prevHeadY = 0.5;
    let smoothSpeed = 0.0;
    let targetHover = 0.0;
    let currentHover = 0.0;
    let motionEnergy = 0.0; // Dynamic motion energy: 0 when idle/stopped, ramps up to 1 when moving
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
          for (let i = 0; i < TRAIL_COUNT; i++) {
            trail[i].x = targetMouseX;
            trail[i].y = targetMouseY;
          }
          prevHeadX = targetMouseX;
          prevHeadY = targetMouseY;
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

      // Fluid Spring Physics for Calligraphy Ribbon
      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.1);
      lastPhysicsTime = now;

      // Head chases target with fluid ease
      trail[0].x += (targetMouseX - trail[0].x) * 0.24;
      trail[0].y += (targetMouseY - trail[0].y) * 0.24;

      // Trailing nodes flow along trajectory with fluid viscosity
      for (let i = 1; i < TRAIL_COUNT; i++) {
        const lag = Math.max(0.14, 0.36 - i * 0.032);
        trail[i].x += (trail[i - 1].x - trail[i].x) * lag;
        trail[i].y += (trail[i - 1].y - trail[i].y) * lag;
      }

      // Velocity calculation
      const vx = (trail[0].x - prevHeadX) / (dt || 0.016);
      const vy = (trail[0].y - prevHeadY) / (dt || 0.016);
      prevHeadX = trail[0].x;
      prevHeadY = trail[0].y;

      const rawSpeed = Math.hypot(vx, vy);
      smoothSpeed += (Math.min(rawSpeed * 0.25, 1.0) - smoothSpeed) * 0.16;

      // --- Kinetic Motion Energy & Idle Decay Math ---
      // When moving: motionEnergy quickly ramps up to 1.0
      // When stationary (idle): motionEnergy progressively decays and shrinks to 0 (closes completely)
      if (rawSpeed > 0.012 && targetHover > 0) {
        // Active movement: energize reveal area
        const boost = Math.min(rawSpeed * 3.5, 1.0);
        motionEnergy = Math.min(1.0, motionEnergy + boost * 0.25 + 0.06);
      } else {
        // Idle / stationary: gracefully shrink and close over ~1.4 seconds
        motionEnergy = Math.max(0.0, motionEnergy - dt * 0.72);
      }

      currentHover += (targetHover - currentHover) * 0.1;
      const effectiveHover = currentHover * motionEnergy;

      // Balanced reveal radius (not too large, focused and elegant)
      // When cursor stops, baseRadius shrinks to 0 along with motionEnergy
      const baseRadius = (0.22 + smoothSpeed * 0.06) * motionEnergy;

      for (let i = 0; i < TRAIL_COUNT; i++) {
        const t = i / (TRAIL_COUNT - 1);
        trailRadiiBuffer[i] = Math.max(0.0, baseRadius * (1.0 - Math.pow(t, 1.35) * 0.65));
        trailBuffer[i * 2] = trail[i].x;
        trailBuffer[i * 2 + 1] = trail[i].y;
      }

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
      gl.uniform2fv(uTrail, trailBuffer);
      gl.uniform1fv(uTrailRadii, trailRadiiBuffer);
      gl.uniform1f(uHover, effectiveHover);
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

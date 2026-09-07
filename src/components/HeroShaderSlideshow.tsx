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
  uniform vec2 u_trail[6];
  uniform float u_speed;
  uniform float u_hover;
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

  // --- DISTANCE TO CAPSULE LINE SEGMENT (SDF) ---
  float distToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / (dot(ba, ba) + 0.00001), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    // 1. Exact, pin-sharp UV coordinates for texture sampling
    vec2 uv0 = getCoverUV(v_uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(v_uv, u_resolution, u_image_res1);

    // 2. Aspect-Ratio Corrected Space
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p_aspect = vec2(v_uv.x * aspect, v_uv.y);

    // 3. Cursor Head & Multi-Segment Trail Field Calculation
    vec2 head_pos = vec2(u_trail[0].x * aspect, u_trail[0].y);
    float d_head = length(p_aspect - head_pos);

    // Organic noise on head contour
    float head_turb = fbm(p_aspect * 5.0 + u_time * 0.25) * 0.05;
    float head_mask = smoothstep(0.34, 0.16, d_head - head_turb);

    float total_reveal = head_mask;
    float tail_distortion = 0.0;
    vec2 tail_flow_dir = vec2(0.0);

    // Evaluate trailing ribbon segments
    for (int i = 0; i < 5; i++) {
      vec2 a = vec2(u_trail[i].x * aspect, u_trail[i].y);
      vec2 b = vec2(u_trail[i + 1].x * aspect, u_trail[i + 1].y);
      float d_seg = distToSegment(p_aspect, a, b);

      // Tapering width from 0.32 at head down to 0.08 at tail tip
      float t = float(i) / 5.0;
      float seg_rad = mix(0.30, 0.08, t);
      float seg_turb = noise(p_aspect * (6.0 + float(i) * 2.0) - u_time * 1.2) * 0.03 * (1.0 - t);
      float seg_mask = smoothstep(seg_rad, seg_rad * 0.25, d_seg - seg_turb) * (1.0 - t * 0.65);

      total_reveal = max(total_reveal, seg_mask);

      // Tail distortion is focused on segments behind the head
      if (i >= 1) {
        float seg_wake = seg_mask * smoothstep(seg_rad, 0.0, d_seg);
        tail_distortion += seg_wake;
        tail_flow_dir += (a - b) * seg_wake;
      }
    }

    total_reveal *= u_hover;

    // Distortion activates strictly during motion (u_speed), vanishing when stationary!
    float active_tail = clamp(tail_distortion * u_speed * 3.2, 0.0, 1.0) * u_hover;

    // 4. Subtle, Sweet Liquid Refraction Ripple along the moving tail
    vec2 flow_norm = length(tail_flow_dir) > 0.001 ? normalize(tail_flow_dir) : vec2(1.0, 0.0);
    vec2 perp_flow = vec2(-flow_norm.y, flow_norm.x);
    float ripple = sin(d_head * 28.0 - u_time * 7.0) * 0.007;
    vec2 tail_uv_disp = (perp_flow * ripple + flow_norm * 0.003) * active_tail;

    // Delicate sweet chromatic refraction strictly on the tail ribbon
    vec2 disp_r = tail_uv_disp * 1.18;
    vec2 disp_g = tail_uv_disp;
    vec2 disp_b = tail_uv_disp * 0.82;

    // 5. Slideshow Transition Wavefront
    float n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (n * 0.22 + grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(grain * 0.05 + dustZone * 0.03, (grain - 0.5) * 0.03) * dustZone;

    // Base texture samples
    vec4 col0 = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1 = texture2D(u_tex1, uv1);

    // Monochrome base tone
    float gray0 = dot(col0.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = grain * dustZone * 0.3;
    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);

    // Pure, crystal-clear original photograph colors
    vec3 pure_color = mix(col1.rgb, col0.rgb, slide_mask);

    // Sweet distorted tail color sample
    vec3 tail_color;
    tail_color.r = mix(texture2D(u_tex1, uv1 + disp_r).r, texture2D(u_tex0, uv0 + disp_r).r, slide_mask);
    tail_color.g = mix(texture2D(u_tex1, uv1 + disp_g).g, texture2D(u_tex0, uv0 + disp_g).g, slide_mask);
    tail_color.b = mix(texture2D(u_tex1, uv1 + disp_b).b, texture2D(u_tex0, uv0 + disp_b).b, slide_mask);

    // Head remains crystal-clear; tail trail has the sweet distortion
    vec3 active_reveal_color = mix(pure_color, tail_color, active_tail * 0.85);

    // Subtle luminous shimmer on the reveal boundary
    float rim_zone = abs(d_head - 0.32);
    float rim_glow = exp(-pow(rim_zone / 0.018, 2.0)) * 0.18 * u_hover;

    // Final color blend
    vec3 final_rgb = mix(base_mono, active_reveal_color, total_reveal) + vec3(rim_glow);
    float final_alpha = mix(0.28, 0.95, total_reveal);

    gl_FragColor = vec4(final_rgb, final_alpha);
  }
`;

const TRAIL_LENGTH = 6;

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

    // --- Interactive Multi-Segment Trail State ---
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    const trail = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0.5, y: 0.5 }));
    const trailBuffer = new Float32Array(TRAIL_LENGTH * 2);

    let prevHeadX = 0.5;
    let prevHeadY = 0.5;
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
          for (let i = 0; i < TRAIL_LENGTH; i++) {
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

      // Multi-point fluid trail physics simulation
      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.1);
      lastPhysicsTime = now;

      // Head point chases cursor target
      trail[0].x += (targetMouseX - trail[0].x) * 0.24;
      trail[0].y += (targetMouseY - trail[0].y) * 0.24;

      // Trailing points progressively lag behind previous point
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const lag = Math.max(0.12, 0.32 - i * 0.04);
        trail[i].x += (trail[i - 1].x - trail[i].x) * lag;
        trail[i].y += (trail[i - 1].y - trail[i].y) * lag;
      }

      // Compute velocity & speed
      const vx = (trail[0].x - prevHeadX) / (dt || 0.016);
      const vy = (trail[0].y - prevHeadY) / (dt || 0.016);
      prevHeadX = trail[0].x;
      prevHeadY = trail[0].y;

      const rawSpeed = Math.min(Math.hypot(vx, vy) * 0.22, 1.0);
      smoothSpeed += (rawSpeed - smoothSpeed) * 0.15;

      currentHover += (targetHover - currentHover) * 0.08;

      // Flatten trail data into Float32Array buffer for shader uniform
      for (let i = 0; i < TRAIL_LENGTH; i++) {
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

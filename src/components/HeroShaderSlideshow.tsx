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
  uniform vec2 u_head_pos;
  uniform float u_head_rad;
  uniform vec2 u_splats_pos[8];
  uniform float u_splats_rad[8];
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

  void main() {
    // 1. Exact, pin-sharp UV coordinates (zero blur on image)
    vec2 uv0 = getCoverUV(v_uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(v_uv, u_resolution, u_image_res1);

    // 2. Aspect-Ratio Corrected Metric Space
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(v_uv.x * aspect, v_uv.y);

    // 3. Distance to Active Cursor Head
    vec2 head_aspect = vec2(u_head_pos.x * aspect, u_head_pos.y);
    float min_dist = length(p - head_aspect) - u_head_rad;

    // 4. Distance to Static Deposited Ink Stamps in Space (Pinned where drawn)
    for (int i = 0; i < 8; i++) {
      if (u_splats_rad[i] > 0.001) {
        vec2 s_aspect = vec2(u_splats_pos[i].x * aspect, u_splats_pos[i].y);
        float d_s = length(p - s_aspect) - u_splats_rad[i];
        min_dist = min(min_dist, d_s);
      }
    }

    // 5. Fluid Ink Bleed & Capillary Diffusion Dynamics
    vec2 fluid_curl = curlNoise(p * 3.2 + u_time * 0.25);
    float ink_bleed = fbm(p * 4.8 - fluid_curl * 0.4 + u_time * 0.12) * 0.055;
    float d_fluid_ink = min_dist - ink_bleed;

    // 6. Painterly Ink Wash Opacity Falloff
    float ink_reveal = smoothstep(0.06, -0.05, d_fluid_ink) * u_hover;

    // Subtle watercolor wash edge highlight
    float wash_rim = smoothstep(0.0, 0.45, ink_reveal) * smoothstep(0.92, 0.45, ink_reveal);
    vec3 wash_tone = vec3(0.98, 0.96, 0.92) * (wash_rim * 0.12 * u_hover);

    // 7. Slideshow Transition Wavefront
    float slide_n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float slide_grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (slide_n * 0.22 + slide_grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(slide_grain * 0.05 + dustZone * 0.03, (slide_grain - 0.5) * 0.03) * dustZone;

    // 8. Base Monochrome Texture
    vec4 col0_mono = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1_mono = texture2D(u_tex1, uv1);

    float gray0 = dot(col0_mono.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1_mono.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = slide_grain * dustZone * 0.3;
    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);

    // 9. 100% PURE, PIN-SHARP ORIGINAL PHOTOGRAPH COLORS
    vec4 col0_color = texture2D(u_tex0, uv0);
    vec4 col1_color = texture2D(u_tex1, uv1);
    vec3 pure_original_color = mix(col1_color.rgb, col0_color.rgb, slide_mask);

    // 10. Final Composition
    vec3 final_rgb = mix(base_mono, pure_original_color, ink_reveal) + wash_tone;
    float final_alpha = mix(0.28, 0.96, ink_reveal);

    gl_FragColor = vec4(final_rgb, final_alpha);
  }
`;

const MAX_SPLATS = 8;

interface Splat {
  x: number;
  y: number;
  birth: number;
  radius: number;
}

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
    const uHeadPos = gl.getUniformLocation(program, "u_head_pos");
    const uHeadRad = gl.getUniformLocation(program, "u_head_rad");
    const uSplatsPos = gl.getUniformLocation(program, "u_splats_pos");
    const uSplatsRad = gl.getUniformLocation(program, "u_splats_rad");
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

    // --- Deposited Ink Wash Physics State ---
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let prevHeadX = 0.5;
    let prevHeadY = 0.5;
    let lastPlacedPos = { x: 0.5, y: 0.5 };
    let lastMoveTime = performance.now();

    const splats: Splat[] = [];
    const splatsPosBuffer = new Float32Array(MAX_SPLATS * 2);
    const splatsRadBuffer = new Float32Array(MAX_SPLATS);

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
        lastMoveTime = performance.now();

        if (!hasEntered) {
          currentMouseX = targetMouseX;
          currentMouseY = targetMouseY;
          prevHeadX = targetMouseX;
          prevHeadY = targetMouseY;
          lastPlacedPos = { x: targetMouseX, y: targetMouseY };
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

      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.1);
      lastPhysicsTime = now;

      // Cursor head follows target smoothly
      currentMouseX += (targetMouseX - currentMouseX) * 0.22;
      currentMouseY += (targetMouseY - currentMouseY) * 0.22;

      const vx = currentMouseX - prevHeadX;
      const vy = currentMouseY - prevHeadY;
      prevHeadX = currentMouseX;
      prevHeadY = currentMouseY;

      const distMoved = Math.hypot(vx, vy);
      if (distMoved > 0.0015 && targetHover > 0) {
        lastMoveTime = now;
      }

      // Deposit a new ink splat at the current position if cursor moved enough
      // Ink stays pinned where deposited! (Never slithers like a snake)
      const distFromLastSplat = Math.hypot(currentMouseX - lastPlacedPos.x, currentMouseY - lastPlacedPos.y);
      if (distFromLastSplat > 0.035 && targetHover > 0) {
        splats.unshift({
          x: currentMouseX,
          y: currentMouseY,
          birth: now,
          radius: 0.20,
        });
        if (splats.length > MAX_SPLATS) {
          splats.pop();
        }
        lastPlacedPos = { x: currentMouseX, y: currentMouseY };
      }

      // 1-second delay before fading:
      // If idle <= 1.0s: fully open (idleFade = 1.0)
      // If idle > 1.0s: slowly fade and shrink over 2.2 seconds
      const idleDuration = (now - lastMoveTime) / 1000;
      let idleFade = 1.0;
      if (idleDuration > 1.0) {
        const fadeProgress = Math.min((idleDuration - 1.0) / 2.2, 1.0);
        // Smooth cubic ease-out
        idleFade = 1.0 - fadeProgress * fadeProgress * (3.0 - 2.0 * fadeProgress);
      }

      currentHover += (targetHover - currentHover) * 0.12;
      const effectiveHover = currentHover * idleFade;

      // Base radius of the active brush under cursor (tasteful and balanced)
      const headRadius = 0.22 * idleFade;

      // Update static deposited splats (each splat ages in place and gently diffuses)
      for (let i = 0; i < MAX_SPLATS; i++) {
        if (i < splats.length) {
          const age = (now - splats[i].birth) / 1000;
          // Splat naturally lives for ~2.0s
          const splatLife = Math.max(0.0, 1.0 - age / 2.0) * idleFade;
          splatsPosBuffer[i * 2] = splats[i].x;
          splatsPosBuffer[i * 2 + 1] = splats[i].y;
          splatsRadBuffer[i] = splats[i].radius * splatLife;
        } else {
          splatsPosBuffer[i * 2] = 0.5;
          splatsPosBuffer[i * 2 + 1] = 0.5;
          splatsRadBuffer[i] = 0.0;
        }
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
      
      gl.uniform2f(uHeadPos, currentMouseX, currentMouseY);
      gl.uniform1f(uHeadRad, headRadius);
      gl.uniform2fv(uSplatsPos, splatsPosBuffer);
      gl.uniform1fv(uSplatsRad, splatsRadBuffer);
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

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

  // --- HASH & NOISE FUNCTIONS ---
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
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
      p = rot * p * 2.04 + vec2(11.3);
      a *= 0.5;
    }
    return v;
  }

  // --- 2D CURL NOISE FOR FLUID WIND EDDIES ---
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

  // --- 3x3 CELLULAR NOISE FOR DISCRETE SAND GRAINS ---
  float voronoiGrains(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 8.0;
    for (int j = -1; j <= 1; ++j) {
      for (int i = -1; i <= 1; ++i) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash22(n + g);
        vec2 r = g + o - f;
        float d = dot(r, r);
        md = min(md, d);
      }
    }
    return sqrt(md);
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
    // 1. Exact, pin-sharp texture UV coordinates (zero distortion on image content!)
    vec2 uv0 = getCoverUV(v_uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(v_uv, u_resolution, u_image_res1);

    // 2. Aspect-Ratio Corrected Space
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(v_uv.x * aspect, v_uv.y);
    vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
    vec2 delta = p - m;

    // 3. Dynamic Fluid Wind & Swirling Eddy Vector Field
    vec2 vel = vec2(u_mouse_vel.x * aspect, u_mouse_vel.y);
    float speed = clamp(u_speed, 0.0, 1.0);

    // Fluid turbulence eddies blowing the sand
    vec2 curl = curlNoise(p * 3.8 + u_time * 0.4);
    float turb1 = fbm(p * 5.0 - vec2(u_time * 0.3, u_time * 0.2));
    float turb2 = fbm(p * 12.0 + curl * 0.5 + u_time * 0.5);

    // Directional wind wake from cursor movement
    vec2 wind = vel * (0.25 + speed * 0.45) + curl * (0.08 + speed * 0.12);
    
    // Deform coordinate space against blowing wind
    vec2 p_blown = delta - wind;
    float dist_blown = length(p_blown);

    // Fluid sand density threshold (expands naturally with speed)
    float base_radius = 0.34 + speed * 0.14;
    float fluid_density = smoothstep(base_radius, 0.04, dist_blown);

    // 4. Multi-Scale Stochastic Sand & Dust Particles
    // Macro sand grain clusters:
    float grain_macro = voronoiGrains(p * 28.0 + curl * 1.5 - u_time * 0.2);
    // Micro sand dust specks:
    float grain_micro = hash(floor(p * 420.0 + u_time * 8.0));
    // Mid-frequency fluid dust plumes:
    float dust_plumes = turb1 * 0.6 + turb2 * 0.4;

    // Total granular dispersion metric
    float sand_dispersion = fluid_density * 1.6
      - (dust_plumes * 0.65)
      - (grain_macro * 0.35)
      - (grain_micro * 0.25);

    // Reveal mask: smoothly transitions as sand grains blow away
    // (Notice: no rigid circle! It disperses organically grain by grain!)
    float reveal_mask = smoothstep(0.15, 0.85, sand_dispersion) * u_hover;

    // 5. Blowing Sand Grains & Golden Dust Sparkles along the dispersion boundary
    float edge_zone = smoothstep(0.05, 0.55, sand_dispersion) * smoothstep(1.05, 0.55, sand_dispersion);
    float sand_particles = pow(grain_micro, 5.0) * edge_zone * 2.2 * u_hover;
    float sand_dust_cloud = pow(grain_macro, 2.0) * edge_zone * 0.45 * u_hover;

    // 6. Base Slideshow Particle Transition Math
    float slide_n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float slide_grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (slide_n * 0.22 + slide_grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(slide_grain * 0.05 + dustZone * 0.03, (slide_grain - 0.5) * 0.03) * dustZone;

    // 7. Texture Samples:
    // Pure, pin-sharp samples with zero pixel distortion!
    vec4 col0_mono = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1_mono = texture2D(u_tex1, uv1);

    // Monochrome base tone
    float gray0 = dot(col0_mono.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1_mono.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono0 = vec3(gray0 * 1.15, gray0 * 1.12, gray0 * 1.08);
    vec3 mono1 = vec3(gray1 * 1.15, gray1 * 1.12, gray1 * 1.08);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = slide_grain * dustZone * 0.3;
    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);

    // 8. 100% PURE, CRISP, ORIGINAL PHOTOGRAPH COLOR
    vec4 col0_color = texture2D(u_tex0, uv0);
    vec4 col1_color = texture2D(u_tex1, uv1);
    vec3 pure_original_color = mix(col1_color.rgb, col0_color.rgb, slide_mask);

    // 9. Sand / Dust Color Accents at the dispersing boundary
    vec3 dust_tone = vec3(0.92, 0.86, 0.78) * sand_dust_cloud;
    vec3 sparkle_tone = vec3(1.0, 0.98, 0.92) * sand_particles;

    // Final Composition:
    // - Black & white hero background
    // - Sand grains & fluid dust blowing at the edge
    // - Pure, crystal-clear color revealed where sand has cleared!
    vec3 final_rgb = mix(base_mono, pure_original_color, reveal_mask) + dust_tone + sparkle_tone;
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

      // Fluid spring physics for cursor tracking
      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.1);
      lastPhysicsTime = now;

      currentMouseX += (targetMouseX - currentMouseX) * 0.18;
      currentMouseY += (targetMouseY - currentMouseY) * 0.18;

      const vx = (currentMouseX - prevMouseX) / (dt || 0.016);
      const vy = (currentMouseY - prevMouseY) / (dt || 0.016);
      prevMouseX = currentMouseX;
      prevMouseY = currentMouseY;

      mouseVelX += (vx - mouseVelX) * 0.25;
      mouseVelY += (vy - mouseVelY) * 0.25;

      const rawSpeed = Math.min(Math.hypot(vx, vy) * 0.25, 1.0);
      smoothSpeed += (rawSpeed - smoothSpeed) * 0.16;

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

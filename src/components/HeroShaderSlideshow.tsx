"use client";

import { useEffect, useRef, useState } from "react";

interface HeroShaderSlideshowProps {
  images: string[];
  intervalSeconds?: number;
  transitionDurationSeconds?: number;
  scrollY?: number;
}

const VERTEX_SHADER_SRC = `
  precision highp float;
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2((a_position.x + 1.0) * 0.5, (1.0 - a_position.y) * 0.5);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_tex0;
  uniform sampler2D u_tex1;
  uniform float u_progress;
  uniform vec2 u_resolution;
  uniform vec2 u_image_res0;
  uniform vec2 u_image_res1;
  uniform float u_zoom;    // slow Ken Burns breathing

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
    for (int i = 0; i < 3; ++i) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(10.0);
      a *= 0.5;
    }
    return v;
  }

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
    // Breathing zoom around center
    vec2 uv = (v_uv - 0.5) / u_zoom + 0.5;

    vec2 uv0 = getCoverUV(uv, u_resolution, u_image_res0);
    vec2 uv1 = getCoverUV(uv, u_resolution, u_image_res1);

    // Dust particle slideshow sweep transition
    float n = fbm(v_uv * 18.0 + vec2(u_progress * 1.5, 0.0));
    float grain = hash(v_uv * 600.0 + u_progress * 40.0);
    float sweep = u_progress * 1.4 - 0.2;
    float edgeProgress = v_uv.x + (n * 0.22 + grain * 0.08) - 0.15;
    float distToEdge = abs(v_uv.x - u_progress);
    float dustZone = smoothstep(0.18, 0.0, distToEdge) * sin(u_progress * 3.14159265);
    vec2 dustOffset = vec2(grain * 0.05 + dustZone * 0.03, (grain - 0.5) * 0.03) * dustZone;

    vec4 col0 = texture2D(u_tex0, uv0 + dustOffset);
    vec4 col1 = texture2D(u_tex1, uv1);

    // Bright, airy monochrome (light warm gray, never muddy dark)
    float gray0 = dot(col0.rgb, vec3(0.299, 0.587, 0.114));
    float gray1 = dot(col1.rgb, vec3(0.299, 0.587, 0.114));
    float g0 = min(gray0 * 1.32 + 0.08, 1.0);
    float g1 = min(gray1 * 1.32 + 0.08, 1.0);
    vec3 mono0 = vec3(g0 * 1.08, g0 * 1.06, g0 * 1.03);
    vec3 mono1 = vec3(g1 * 1.08, g1 * 1.06, g1 * 1.03);

    float slide_mask = smoothstep(sweep - 0.06, sweep + 0.06, edgeProgress);
    float spark = grain * dustZone * 0.3;

    vec3 base_mono = mix(mono1, mono0, slide_mask) + vec3(spark);

    gl_FragColor = vec4(base_mono, 0.55);
  }
`;

export default function HeroShaderSlideshow({
  images,
  intervalSeconds = 5,
  transitionDurationSeconds = 1.6,
  scrollY = 0,
}: HeroShaderSlideshowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const gl = (canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false })) as
      WebGL2RenderingContext | WebGLRenderingContext | null;

    if (!gl) {
      setSupported(false);
      return;
    }

    function compileShader(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) { setSupported(false); return; }

    const program = gl.createProgram();
    if (!program) { setSupported(false); return; }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "a_position");
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = {
      tex0: gl.getUniformLocation(program, "u_tex0"),
      tex1: gl.getUniformLocation(program, "u_tex1"),
      progress: gl.getUniformLocation(program, "u_progress"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      imageRes0: gl.getUniformLocation(program, "u_image_res0"),
      imageRes1: gl.getUniformLocation(program, "u_image_res1"),
      zoom: gl.getUniformLocation(program, "u_zoom"),
    };

    const textures: WebGLTexture[] = [];
    const imageResolutions: [number, number][] = images.map(() => [1920, 1080]);
    let loadedCount = 0;

    images.forEach((src, idx) => {
      const tex = gl!.createTexture()!;
      textures[idx] = tex;
      let hasLoaded = false;
      const img = new Image();
      img.crossOrigin = "anonymous";
      const handleLoad = () => {
        if (hasLoaded || !img.naturalWidth || !img.naturalHeight) return;
        hasLoaded = true;
        imageResolutions[idx] = [img.naturalWidth, img.naturalHeight];
        gl!.bindTexture(gl!.TEXTURE_2D, tex);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
        loadedCount++;
      };
      img.onload = handleLoad;
      img.src = src;
      if (img.complete && img.naturalWidth > 0) handleLoad();
    });

    /* --- Render gating: skip drawing while hero is off-screen (anti-lag) --- */
    let heroVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => { heroVisible = entries[0].isIntersecting; },
      { rootMargin: "100px" }
    );
    const observedSection = canvas!.closest("section") || canvas;
    visibilityObserver.observe(observedSection);

    let currentIndex = 0;
    let nextIndex = images.length > 1 ? 1 : 0;
    let isTransitioning = false;
    let transitionStartTime = 0;
    let lastSwitchTime = performance.now();
    let animationFrameId = 0;

    const intervalMs = intervalSeconds * 1000;
    const transitionMs = transitionDurationSeconds * 1000;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = (canvas!.clientWidth || window.innerWidth) * dpr;
      const height = (canvas!.clientHeight || 600) * dpr;
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        gl!.viewport(0, 0, width, height);
      }
    }

    function render(now: number) {
      animationFrameId = requestAnimationFrame(render);
      if (loadedCount < images.length || !heroVisible) return;

      resize();

      let smoothProgress = 0.0;
      if (!isTransitioning && now - lastSwitchTime >= intervalMs) {
        isTransitioning = true;
        transitionStartTime = now;
      }
      if (isTransitioning) {
        const progress = Math.min(Math.max((now - transitionStartTime) / transitionMs, 0.0), 1.0);
        smoothProgress = progress * progress * (3.0 - 2.0 * progress);
        if (progress >= 1.0) {
          isTransitioning = false;
          currentIndex = nextIndex;
          nextIndex = (currentIndex + 1) % images.length;
          lastSwitchTime = now;
          smoothProgress = 0.0;
        }
      }

      // Slow Ken Burns breathing (never resets = zero pops)
      const zoom = 1.04 + 0.02 * Math.sin(now * 0.00025);

      gl!.useProgram(program);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, textures[currentIndex]);
      gl!.uniform1i(u.tex0, 0);

      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, textures[nextIndex]);
      gl!.uniform1i(u.tex1, 1);

      gl!.uniform1f(u.progress, smoothProgress);
      gl!.uniform2f(u.resolution, canvas!.width, canvas!.height);
      gl!.uniform2f(u.imageRes0, imageResolutions[currentIndex][0], imageResolutions[currentIndex][1]);
      gl!.uniform2f(u.imageRes1, imageResolutions[nextIndex][0], imageResolutions[nextIndex][1]);
      gl!.uniform1f(u.zoom, zoom);

      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      gl!.disable(gl!.BLEND);
    }

    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      visibilityObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      textures.forEach((tex) => gl.deleteTexture(tex));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [images, intervalSeconds, transitionDurationSeconds]);

  if (!supported) {
    return (
      <div className="absolute inset-x-0 -top-24 -bottom-24 z-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt=""
          className="w-full h-full object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
      </div>
    );
  }

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

"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function CountUpNumber({
  value,
  decimals = 0,
  suffix = "",
  duration = 2200,
  delay = 0,
  className,
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        let rafId: number;
        const start = performance.now() + delay;
        const tick = (now: number) => {
          const t = Math.min(Math.max((now - start) / duration, 0), 1);
          // easeOutExpo — fast start, soft landing
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setProgress(eased);
          if (t < 1) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [duration, delay]);

  const current = (value * progress).toFixed(decimals);
  const blur = (1 - progress) * 10;
  const opacity = 0.15 + progress * 0.85;

  return (
    <span
      ref={ref}
      className={className}
      style={{
        filter: `blur(${blur.toFixed(2)}px)`,
        opacity,
        willChange: "filter, opacity",
      }}
    >
      {current}
      {suffix}
    </span>
  );
}

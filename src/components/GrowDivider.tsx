"use client";

import { useEffect, useRef, useState } from "react";

interface GrowDividerProps {
  className?: string;
  delay?: number;
}

export default function GrowDivider({ className = "", delay = 0 }: GrowDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${className} origin-top transition-transform duration-[1200ms] ease-out ${
        visible ? "scale-y-100" : "scale-y-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    />
  );
}

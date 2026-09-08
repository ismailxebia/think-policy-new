"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
}

export default function Reveal({ children, className = "", delay = 0, blur = false }: RevealProps) {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const state = visible
    ? "opacity-100 translate-y-0 blur-[0px]"
    : blur
      ? "opacity-0 translate-y-6 blur-[10px]"
      : "opacity-0 translate-y-6";

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${state}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

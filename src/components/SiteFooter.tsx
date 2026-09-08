"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50 font-inter block">
      {children}
    </span>
  );
}

export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const updateScroll = () => {
      if (!footerRef.current || !bgImageRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the footer has scrolled into view
      // 0 = top of footer enters bottom of viewport
      // 1 = bottom of footer reaches bottom of viewport
      const totalDistance = rect.height;
      const currentDistance = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

      // Smooth easing curve
      const eased = Math.pow(progress, 0.85);

      // Opacity transition from 95% (0.95) down to 30% (0.30)
      const imageOpacity = 0.95 - progress * (0.95 - 0.30);

      // Deep, noticeable parallax effect: shifts by 120px across scroll with 1.08 scale
      const translateY = (progress - 0.5) * 120;
      const scale = 1.08;

      bgImageRef.current.style.opacity = imageOpacity.toFixed(3);
      bgImageRef.current.style.transform = `scale(${scale}) translateY(${translateY.toFixed(1)}px)`;

      if (overlayRef.current) {
        // Overlay smoothly darkens as user scrolls to ensure contact & legal text legibility
        const overlayOpacity = 0.12 + progress * 0.38;
        overlayRef.current.style.opacity = overlayOpacity.toFixed(3);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-[#120F0D] text-white relative overflow-hidden">
      {/* Full-bleed monochrome photo — scroll-driven parallax & 95% -> 30% opacity */}
      <div
        ref={bgImageRef}
        aria-hidden="true"
        className="absolute -top-[10%] -bottom-[10%] inset-x-0 z-0 pointer-events-none will-change-transform will-change-opacity"
        style={{ opacity: 0.95 }}
      >
        <Image
          src="/footer-background.png"
          alt=""
          fill
          className="object-cover object-center mix-blend-luminosity"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay that adapts with scroll */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-black transition-opacity duration-75"
        style={{ opacity: 0.12 }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0"
      />

      {/* Full-height vertical hairlines — same grid geometry as the content,
          so every column's text hugs its line */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
        <div className="w-full max-w-[1280px] h-full mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-4 gap-x-8 h-full">
            <div className="border-l border-white/[0.07]" />
            <div className="border-l border-white/[0.07]" />
            <div className="border-l border-white/[0.07]" />
            <div className="border-l border-r border-white/[0.07]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 min-h-[92vh] flex flex-col">
        {/* -------------------------------------------------- */}
        {/* MIDDLE — giant two-line CTA block, left-aligned    */}
        {/* -------------------------------------------------- */}
        <div className="flex-1 flex flex-col items-start justify-center text-left py-16">
          <h2 className="font-iowan text-[32px] sm:text-[40px] lg:text-[48px] font-normal leading-[1.1] text-white">
            Ready to create impact?
          </h2>
          <a
            href="mailto:hello@thinkpolicy.id"
            className="mt-5 font-inter text-[20px] leading-[1.3] text-white/60 hover:text-white transition-colors"
          >
            hello@thinkpolicy.id
          </a>
        </div>

        {/* -------------------------------------------------- */}
        {/* BOTTOM ROW — (a.) address + (b.) legal on the grid */}
        {/* -------------------------------------------------- */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 py-14">
            {/* (a.) CONTACT */}
            <div>
              <ColumnLabel>(a.) Contact</ColumnLabel>
              <div className="mt-8 text-[13px] leading-[20px] text-white/75 font-inter">
                <p>
                  Gedung Victoria, Level 3, Jalan Sultan Hasanudin No. 47–51,
                  Melawai, Kebayoran Baru, Jakarta Selatan 12160, Indonesia
                </p>
              </div>
            </div>

            {/* (b.) LEGAL */}
            <div className="lg:col-start-4">
              <ColumnLabel>(b.) Legal</ColumnLabel>
              <div className="mt-8 space-y-1 text-[13px] leading-[20px] text-white/75 font-inter">
                <p>© 2026 Think Policy.</p>
                <p>Independent. Nonpartisan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { X, Share2, Flag, Layers, BookOpen } from "lucide-react";
import HeroShaderSlideshow from "@/components/HeroShaderSlideshow";

const HERO_IMAGES = [
  "/c40/c40-photo1.png",
  "/c40/c40-photo3.png",
  "/ca/ca-foto-utama.png",
];

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#18181B] antialiased flex flex-col font-inter selection:bg-[#E5E7EB] selection:text-[#18181B]">
      {/* ========================================================= */}
      {/* TOP ANNOUNCEMENT BANNER */}
      {/* ========================================================= */}
      {showBanner && (
        <div className="bg-[#18181B] text-white text-xs py-2 px-4 flex items-center justify-between z-50 border-b border-black font-inter">
          <div className="w-6" />
          <div className="text-center font-medium tracking-wide">
            Try out ThinkPolicy : Ready to create impact?
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN NAVBAR */}
      {/* ========================================================= */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-40 font-inter">
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 h-14 flex items-center justify-between">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Think Policy Home">
              <Image
                src="/logo-symbol.svg"
                alt="Think Policy Logo"
                width={18}
                height={18}
                priority
                className="w-[18px] h-[18px] object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#4B5563]">
              <Link href="/product" className="hover:text-[#18181B] transition-colors">Product</Link>
              <Link href="/publication" className="hover:text-[#18181B] transition-colors">Publication</Link>
              <Link href="/community" className="hover:text-[#18181B] transition-colors">Community</Link>
              <Link href="/newsletter" className="hover:text-[#18181B] transition-colors">Newsletter</Link>
              <Link href="/about-us" className="hover:text-[#18181B] transition-colors">About Us</Link>
            </nav>
          </div>

          {/* Right: Portfolio, Join Us */}
          <div className="flex items-center gap-[12px]">
            <Link
              href="/use-case/c40"
              className="px-3.5 py-1.5 rounded-md border border-[#E5E7EB] text-xs font-semibold text-[#18181B] hover:bg-[#F9FAFB] transition-colors"
            >
              Portfolio
            </Link>

            <Link
              href="/join"
              className="px-3.5 py-1.5 rounded-md bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition-colors font-manrope"
            >
              Join Us
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SECTION 1: HERO (Edge-to-Edge Panoramic Shader Slideshow) */}
      {/* ========================================================= */}
      <section className="w-full relative border-b border-[#E5E7EB] overflow-hidden bg-white">
        {/* Full-width Panoramic Dust/Particle Shader Slideshow */}
        <HeroShaderSlideshow
          images={HERO_IMAGES}
          intervalSeconds={5}
          transitionDurationSeconds={1.4}
          scrollY={scrollY}
        />

        {/* 3-Column Grid Aligned to Container Width */}
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:h-[calc(100dvh-92px)] lg:min-h-[540px] lg:max-h-[660px]">
            {/* ----------------------------------------------------- */}
            {/* Column 1 (Left 1/3) - Flush Left Alignment           */}
            {/* ----------------------------------------------------- */}
            <div className="flex flex-col justify-end pb-8 sm:pb-12 pr-6 lg:border-r border-[#E5E7EB] min-h-[220px] lg:min-h-auto">
              <p className="font-inter text-[15px] sm:text-[16px] font-normal text-[#151515] max-w-[210px] leading-snug">
                Moving complex policy challenges forward
              </p>
            </div>

            {/* ----------------------------------------------------- */}
            {/* Column 2 (Center 1/3) - Pure Solid White Column      */}
            {/* ----------------------------------------------------- */}
            <div className="bg-white flex flex-col justify-between px-6 sm:px-10 py-8 sm:py-12 lg:border-r border-[#E5E7EB] z-10 min-h-[360px] lg:min-h-auto shadow-xs">
              {/* Top Half */}
              <div className="space-y-3 pt-2 sm:pt-6">
                <h1 className="font-iowan text-[26px] sm:text-[30px] lg:text-[32px] text-[#151515] font-normal leading-[120%] tracking-tight">
                  What&apos;s the next policy challenge you&apos;re trying to solve?
                </h1>
                <p className="font-inter text-[13.5px] sm:text-[14px] text-[#52525B] leading-[21px]">
                  The hard ones never fit neatly into a single sector, institution, or mandate.
                </p>
              </div>

              {/* Bottom Half: 36% Stat */}
              <div className="space-y-3 pb-2 pt-6 border-t border-[#E5E7EB]">
                <span className="font-iowan text-[32px] sm:text-[36px] text-[#151515] font-normal leading-none block">
                  36%
                </span>
                <p className="font-inter text-[13px] sm:text-[13.5px] text-[#52525B] leading-[19px]">
                  Evidence, relationships, capabilities, and momentum for lasting impact.
                </p>
              </div>
            </div>

            {/* ----------------------------------------------------- */}
            {/* Column 3 (Right 1/3) - Right Side Overlay            */}
            {/* ----------------------------------------------------- */}
            <div className="flex flex-col justify-end pb-8 sm:pb-12 pl-6 sm:pl-10 min-h-[220px] lg:min-h-auto">
              {/* Bottom Right: 12% Stat */}
              <div className="space-y-3 pb-2">
                <span className="font-iowan text-[32px] sm:text-[36px] text-[#151515] font-normal leading-none block">
                  12%
                </span>
                <p className="font-inter text-[13px] sm:text-[13.5px] text-[#52525B] leading-[19px] max-w-[270px]">
                  Working across institutions and sectors to make change possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: OUR PRODUCTS (Strict Left Alignment)          */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Header Block - Aligned flush with Column 1 left margin */}
        <div className="space-y-3 mb-14 sm:mb-18">
          <span className="text-[11px] font-extrabold uppercase tracking-[1.08px] text-[#6B7280] font-manrope block">
            Our Products
          </span>
          <h2 className="font-iowan text-[28px] sm:text-[34px] text-[#151515] font-normal leading-[120%] max-w-[480px]">
            Opportunities become impact when they meet readiness.
          </h2>
        </div>

        {/* 4 Pillars Grid with Vertical Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Pillar 1: Solutioning - Flush left */}
          <div className="py-6 pr-6 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-5">
              <div className="w-6 h-6 flex items-center text-[#18181B]">
                <Share2 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#18181B] font-inter">
                Solutioning
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#52525B] leading-[21px] font-inter pt-6">
              Turning promising ideas into implementable solutions through grounded pathways.
            </p>
          </div>

          {/* Pillar 2: Convening */}
          <div className="py-6 px-6 lg:border-l border-[#E5E7EB] flex flex-col justify-between min-h-[220px]">
            <div className="space-y-5">
              <div className="w-6 h-6 flex items-center text-[#18181B]">
                <Flag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#18181B] font-inter">
                Convening
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#52525B] leading-[21px] font-inter pt-6">
              Building the trust, relationships, and coalitions needed for action.
            </p>
          </div>

          {/* Pillar 3: (Un)learning */}
          <div className="py-6 px-6 lg:border-l border-[#E5E7EB] flex flex-col justify-between min-h-[220px]">
            <div className="space-y-5">
              <div className="w-6 h-6 flex items-center text-[#18181B]">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#18181B] font-inter">
                (Un)learning
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#52525B] leading-[21px] font-inter pt-6">
              Equipping people with the capacity to drive change.
            </p>
          </div>

          {/* Pillar 4: Storytelling */}
          <div className="py-6 pl-6 lg:border-l border-[#E5E7EB] flex flex-col justify-between min-h-[220px]">
            <div className="space-y-5">
              <div className="w-6 h-6 flex items-center text-[#18181B]">
                <BookOpen className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#18181B] font-inter">
                Storytelling
              </h3>
            </div>
            <p className="text-[13.5px] sm:text-[14px] text-[#52525B] leading-[21px] font-inter pt-6">
              Creating shared understanding around complex issues through narratives.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="border-t border-[#E5E7EB] py-8 text-center text-xs text-[#6B7280]">
        © 2026 Think Policy. All rights reserved.
      </footer>
    </div>
  );
}

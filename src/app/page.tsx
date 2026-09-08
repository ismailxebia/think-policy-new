"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Share2, Flag, Layers, BookOpen } from "lucide-react";
import HeroShaderSlideshow from "@/components/HeroShaderSlideshow";
import PartnerLogos from "@/components/PartnerLogos";
import CountUpNumber from "@/components/CountUpNumber";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const HERO_IMAGES = [
  "/c40/c40-photo1.png",
  "/c40/c40-photo3.png",
  "/ca/ca-foto-utama.png",
];

export default function HomePage() {
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
      <SiteHeader />

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

        {/* 3-Column Grid Aligned to Container Width (Center column widened by ~40px) */}
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr_1fr] lg:h-[calc(100dvh-92px)] lg:min-h-[540px] lg:max-h-[660px]">
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

      {/* ========================================================= */}
      {/* SECTION 3: TRUSTED BY THE PUBLIC POLICY ECOSYSTEM        */}
      {/* ========================================================= */}
      <section className="w-full border-t border-[#E5E7EB] bg-white py-16 sm:py-24">
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12">
          <h2 className="font-iowan text-[28px] sm:text-[34px] lg:text-[36px] text-[#151515] font-normal text-center leading-[120%] tracking-tight mb-12 sm:mb-16">
            Trusted by the public policy ecosystem
          </h2>
          <PartnerLogos />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: OUR IMPACT IN 2025 (Benchmark)                 */}
      {/* ========================================================= */}
      <section className="w-full bg-[#1A1614] text-white py-[96px]">
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12">
          {/* Section Header */}
          <div className="text-center space-y-2.5 mb-[48px]">
            <span className="text-[13px] sm:text-[14px] text-[#A8A29E] font-inter block font-normal tracking-wide">
              Our Impact in 2025
            </span>
            <h2 className="font-iowan text-[32px] sm:text-[40px] lg:text-[44px] text-white font-normal leading-[120%] tracking-tight">
              100x Scaling up our impact sustainably
            </h2>
          </div>

          {/* 4 Metrics Card Container — Double Div Pemanis matching Figma Frame 2147260431 */}
          <div className="w-full max-w-[1036px] mx-auto p-1 rounded-[10px] border border-white/10 bg-[#26201C] shadow-2xl">
            {/* Inner Card Frame */}
            <div className="w-full rounded-[6px] border border-white/10 bg-[#1E1916] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {/* Metric 1: 8M */}
              <div className="group relative p-6 flex flex-col justify-between items-start min-h-[280px] sm:min-h-[314px] overflow-hidden transition-colors duration-300 hover:bg-white/[0.02]">
                {/* Hover Background Graphic with Fade In/Out */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                >
                  <Image
                    src="/background-hover-data.svg"
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="relative z-10">
                  <CountUpNumber
                    value={8}
                    suffix="M"
                    delay={0}
                    className="font-iowan text-[44px] sm:text-[50px] lg:text-[54px] text-white font-normal leading-none block tracking-tight"
                  />
                </div>

                <div className="relative z-10 pt-12">
                  <p className="text-[14px] font-semibold text-white font-inter">
                    Times Read
                  </p>
                  <p className="text-[13px] text-[#A8A29E] font-inter mt-1">
                    The Reformist and Insights
                  </p>
                </div>
              </div>

              {/* Metric 2: 372 */}
              <div className="group relative p-6 flex flex-col justify-between items-start min-h-[280px] sm:min-h-[314px] overflow-hidden transition-colors duration-300 hover:bg-white/[0.02]">
                {/* Hover Background Graphic with Fade In/Out */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                >
                  <Image
                    src="/background-hover-data.svg"
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="relative z-10">
                  <CountUpNumber
                    value={372}
                    delay={150}
                    className="font-iowan text-[44px] sm:text-[50px] lg:text-[54px] text-white font-normal leading-none block tracking-tight"
                  />
                </div>

                <div className="relative z-10 pt-12">
                  <p className="text-[14px] font-semibold text-white font-inter">
                    Participant
                  </p>
                  <p className="text-[13px] text-[#A8A29E] font-inter mt-1">
                    Public Policy Professionals
                  </p>
                </div>
              </div>

              {/* Metric 3: 3.9M */}
              <div className="group relative p-6 flex flex-col justify-between items-start min-h-[280px] sm:min-h-[314px] overflow-hidden transition-colors duration-300 hover:bg-white/[0.02]">
                {/* Hover Background Graphic with Fade In/Out */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                >
                  <Image
                    src="/background-hover-data.svg"
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="relative z-10">
                  <CountUpNumber
                    value={3.9}
                    decimals={1}
                    suffix="M"
                    delay={300}
                    className="font-iowan text-[44px] sm:text-[50px] lg:text-[54px] text-white font-normal leading-none block tracking-tight"
                  />
                </div>

                <div className="relative z-10 pt-12">
                  <p className="text-[14px] font-semibold text-white font-inter">
                    Accounts Reached
                  </p>
                  <p className="text-[13px] text-[#A8A29E] font-inter mt-1">
                    Across all platforms
                  </p>
                </div>
              </div>

              {/* Metric 4: 8.5/10 */}
              <div className="group relative p-6 flex flex-col justify-between items-start min-h-[280px] sm:min-h-[314px] overflow-hidden transition-colors duration-300 hover:bg-white/[0.02]">
                {/* Hover Background Graphic with Fade In/Out */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                >
                  <Image
                    src="/background-hover-data.svg"
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="relative z-10">
                  <CountUpNumber
                    value={8.5}
                    decimals={1}
                    suffix="/10"
                    delay={450}
                    className="font-iowan text-[44px] sm:text-[50px] lg:text-[54px] text-white font-normal leading-none block tracking-tight"
                  />
                </div>

                <div className="relative z-10 pt-12">
                  <p className="text-[14px] font-semibold text-white font-inter">
                    Average Score
                  </p>
                  <p className="text-[13px] text-[#A8A29E] font-inter mt-1">
                    Public Policy Professionals
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary Text & Download CTA */}
          <div className="mt-[48px] text-center">
            <p className="text-[13.5px] sm:text-[14px] text-[#A8A29E] font-inter max-w-[620px] mx-auto leading-relaxed mb-6">
              Since 2021, we have continued to grow. Expanding our reach, deepening our partnerships, and building momentum through each milestone.
            </p>
            <button
              className="inline-flex items-center justify-center bg-white text-[#18181B] text-xs font-semibold px-5 py-2.5 rounded-md hover:bg-[#F5F5F4] transition-colors font-manrope shadow-xs cursor-pointer"
            >
              Download Our Report
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: THE REFORMIST (Video Spotlight)               */}
      {/* ========================================================= */}
      <section className="w-full bg-[#0E0E0E] text-white">
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-20 sm:py-24">
          <div className="text-center space-y-4">
            <h2 className="font-iowan italic text-[32px] sm:text-[40px] font-normal leading-[120%] text-white">
              The Reformist
            </h2>
            <p className="text-[14px] text-[#9CA3AF] font-inter">
              Spotlighting the people, ideas, and stories reshaping the system.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-[840px]">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src="https://www.youtube.com/embed/VK--1mZgQdY"
                title="The Reformist — YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

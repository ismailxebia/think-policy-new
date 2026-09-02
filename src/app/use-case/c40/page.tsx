"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Link2, Check, X, Undo2 } from "lucide-react";

const TOC_SECTIONS = [
  { id: "impact-in-numbers", label: "Impact in numbers" },
  { id: "background-problem", label: "Background" },
  { id: "the-approach", label: "The approach" },
  { id: "solution", label: "Solution" },
  { id: "capability-and-systemic-change", label: "Capability & systemic change" },
  { id: "a-replicable-model", label: "A replicable model" },
];

export default function C40UseCasePage() {
  const [copied, setCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [activeSection, setActiveSection] = useState("impact-in-numbers");

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Track active section for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      let current = TOC_SECTIONS[0].id;
      for (const section of TOC_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPosition) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#18181B] antialiased flex flex-col font-inter">
      {/* ========================================================= */}
      {/* TOP ANNOUNCEMENT BANNER */}
      {/* ========================================================= */}
      {showBanner && (
        <div className="bg-[#18181B] text-white text-xs py-2 px-4 flex items-center justify-between z-50 border-b border-black font-inter">
          <div className="w-6" /> {/* Optical centering spacer */}
          <div className="text-center font-medium tracking-wide">
            Try out ThinkPolicy : Ready to create impact?
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-neutral-400 hover:text-white transition-colors p-1"
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
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
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
              href="/portfolio"
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
      {/* 3-COLUMN MAIN LAYOUT */}
      {/* ========================================================= */}
      <div className="flex-1 w-full flex justify-center border-b border-[#E5E7EB] relative items-start">
        {/* ------------------------------------------------------- */}
        {/* LEFT SIDEBAR: Fixed/Sticky Home link */}
        {/* ------------------------------------------------------- */}
        <aside className="hidden lg:flex flex-1 justify-end sticky top-14 h-[calc(100vh-3.5rem)] p-8 pr-10 overflow-hidden">
          <div className="w-40 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#4B5563] hover:text-[#18181B] transition-colors font-inter"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </aside>

        {/* ------------------------------------------------------- */}
        {/* CENTER COLUMN: EXACT 660px, padding 48px 24px, gap 56px */}
        {/* ------------------------------------------------------- */}
        <main className="w-full max-w-[660px] shrink-0 border-x border-[#E5E7EB] px-6 pt-12 pb-16 flex flex-col gap-[56px]">
          {/* Section 1: Header & Hero */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              <span>Jan 28, 2026</span>
              <span>·</span>
              <span>Case Study</span>
            </div>

            <h1 className="font-iowan text-3xl sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px]">
              Building a more inclusive climate governance that works for everyone in Jakarta
            </h1>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal">
              <p>
                Climate change does not affect everyone equally. Low-income communities, informal workers, women, older people, and persons with disabilities often face the greatest risks while having the least influence over climate decision-making.
              </p>
              <p>
                Recognizing this challenge, the Jakarta government partnered with Think Policy and the C40 Cities network to strengthen inclusive climate governance across its regional agencies. The collaboration focused on embedding equity considerations throughout the policymaking process, from planning and budgeting to monitoring and evaluation, so that climate action can better respond to the needs of all residents.
              </p>
            </div>

            <figure className="space-y-2 pt-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <Image
                  src="/c40/c40-photo3.png"
                  alt="Jakarta regional government civil servants and Think Policy - C40 Cities team at the Inclusive Climate Action framework workshop"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 660px"
                />
              </div>
              <figcaption className="font-inter text-[13px] text-[#6B7280] leading-snug">
                Inclusive climate action connects community experience with the systems that shape public decisions.
              </figcaption>
            </figure>
          </section>

          {/* Section 2: At a Glance (Metrics) */}
          <section id="impact-in-numbers" className="scroll-mt-24">
            <div className="border-t border-black py-[13px] flex items-center justify-between text-[11px] font-extrabold tracking-[1.08px] uppercase text-[#6B7280] font-manrope">
              <span>at a glance</span>
              <span>2025–2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E5E7EB]">
              {/* Col 1 */}
              <div className="py-6 pr-6 space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  36%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  increase in participants knowledge on inclusive climate action
                </p>
              </div>

              {/* Col 2 */}
              <div className="py-6 px-6 md:border-l border-[#E5E7EB] space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  84%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  participants from Jakarta’s regional government agencies
                </p>
              </div>

              {/* Col 3 */}
              <div className="py-6 pl-6 md:border-l border-[#E5E7EB] space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  4%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  institutional adoption pathways created through collaboration
                </p>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 text-[13px] text-[#6B7280] font-inter">
              Participants represented 25 regional government agencies across Jakarta.
            </div>
          </section>

          {/* Section 3: Problem & Opportunity */}
          <section id="background-problem" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              The problem and opportunity
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Creating a more equitable climate action for Jakarta citizens
            </h2>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              <p>
                In 2025, the Jakarta government was in the early stage of implementing its climate action agenda. Through Governor Regulation No. 90/2021, the city had set ambitious emission-reduction and climate-resilience targets and established the Climate Disaster Mitigation and Adaptation team.
              </p>
              <p>
                Yet the people most affected by climate hazards had not been meaningfully engaged in planning and budgeting. Low-income households, informal workers, women, older people, and persons with disabilities were among the communities whose lived experience was too often absent from decision-making.
              </p>
              <p>
                Progress was also constrained by fragmented governance, limited opportunities for public participation, and insufficient attention to the needs of the most affected communities. As Jakarta reviewed its climate governance framework, a timely opening emerged:
              </p>
              <p>
                In partnership with C40 Cities, Think Policy worked with regional government stakeholders to introduce the Inclusive Climate Action framework. The collaboration also reviewed Jakarta’s Monitoring, Evaluation, and Reporting framework to strengthen the overall climate policymaking process.
              </p>
            </div>
          </section>

          {/* Section 4: Three Pillars Card (Figma padding: 24px, gap: 32px) */}
          <section id="the-approach" className="rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] p-6 flex flex-col gap-[32px] scroll-mt-24">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] block font-manrope">
                The approach
              </span>
              <h2 className="font-iowan text-2xl sm:text-[30px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px]">
                Three pillars for more inclusive climate policymaking
              </h2>
            </div>

            <div className="flex flex-col gap-[32px]">
              {/* Pillar 01 */}
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">01</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Build trust and surface aspirations
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Create direct dialogue with civil servants across Jakarta’s regional agencies to understand constraints, priorities, and institutional opportunities.
                </p>
              </div>

              {/* Pillar 02 */}
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">02</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Make learning human-centered
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Use an andragogy approach so training is grounded in the experience, context, and practical needs of participating government professionals.
                </p>
              </div>

              {/* Pillar 03 */}
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">03</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Institutionalize the change
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Translate inclusive climate action into the planning, budgeting, monitoring, and evaluation processes that shape everyday government work.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Strengthening Governance */}
          <section id="solution" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              From shared understanding to adoption
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Strengthening climate governance across regional agencies
            </h2>

            <p className="font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              Jakarta’s climate action challenges were rooted in fragmented governance across sectoral regional agencies. Knowledge of equitable climate action was uneven, while changing political priorities made long-term institutionalization difficult.
            </p>

            {/* 3 Step items with top border and uppercase labels */}
            <div className="flex flex-col gap-[20px] pt-3">
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">01</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Inclusive Musrenbang
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Integrate climate resilience into district-level planning and ensure frontline communities have a direct voice in budget allocation.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">02</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Cross-Agency Coordination
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Break down sectoral silos between environmental, social welfare, and economic planning agencies through unified vulnerability mapping.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">03</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Institutional Accountability
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Incorporate social equity criteria directly into the regional monitoring and evaluation system to track real benefits for vulnerable populations.
                </p>
              </div>
            </div>

            <figure className="space-y-2 py-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <Image
                  src="/c40/c40-photo2.png"
                  alt="Civil servants from 25 regional agencies collaborating in the Inclusive Climate Action workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 660px"
                />
              </div>
              <figcaption className="font-inter text-[13px] text-[#6B7280] leading-snug">
                Civil servants from 25 regional agencies collaborating during an interactive climate governance workshop in Jakarta.
              </figcaption>
            </figure>

            {/* Sub-block: Where the framework began to take root */}
            <div className="pt-6 space-y-4">
              <h2 className="font-iowan text-[28px] sm:text-[32px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px]">
                Where the framework began to take root
              </h2>

              <div className="border-t border-black divide-y divide-[#E5E7EB]">
                {/* Agency 1: Bappeda */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">Bappeda</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Developed technical guidelines for an inclusive Development Planning Forum.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>

                {/* Agency 2: HR Bureau */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">HR Bureau</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Adopted the Inclusive Climate Action framework into government training materials.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>

                {/* Agency 3: Biro PLH */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">Biro PLH</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Explored adopting the structural recommendations in the revision of Governor Regulation No. 90/2021.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>

                {/* Agency 4: DLH */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">DLH</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Explored alignment of the data collection platform for climate action impacts.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>
              </div>
            </div>
          </section>

          {/* Quote Callout Box (Figma padding: 24px, font-size: 30px, font-style: normal) */}
          <section className="rounded-lg bg-[#18181B] text-white p-6 space-y-4 shadow-sm">
            <blockquote className="font-iowan text-[26px] sm:text-[30px] leading-[110%] text-white tracking-[-0.5px] font-normal not-italic">
              “Many of the recommendations and solutions already exist and have started, but they are scattered. If there was something that brought them together, we could finally see the whole picture.”
            </blockquote>
            <cite className="block text-[11px] font-extrabold text-[#71717A] not-italic tracking-[1.08px] uppercase font-manrope pt-1">
              KSD, Bureau of Development and Environment (Biro PLH)
            </cite>
          </section>

          {/* Section 6: Inclusive Outcomes */}
          <section id="capability-and-systemic-change" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Capability and systemic change
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Toward more equitable and inclusive climate outcomes
            </h2>

            <p className="font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              The interventions helped move inclusive climate governance from an idea toward repeatable public-sector practice. Agencies gained a shared language, civil servants strengthened their capability, and institutional owners began to carry the work forward.
            </p>

            {/* 4 Numbered items matching pillar style */}
            <div className="flex flex-col gap-[20px] pt-3">
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">01</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Inclusive Governance Embedded
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Inclusive governance principles embedded into Jakarta&apos;s climate planning process as standard operating procedures.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">02</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Inclusive Musrenbang Conducted
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Inclusive Musrenbang conducted across administrative areas of Jakarta.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">03</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    36% Knowledge Increase
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  A 36% increase in inclusive climate action knowledge across 84 participants from 25 regional agencies.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">04</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Early Institutional Acceptance
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Early institutional acceptance demonstrated by Bappeda, Biro PLH, and DLH.
                </p>
              </div>
            </div>

            <p className="font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              The combined integration of Inclusive Climate Action and review of the MER framework produced three recommendations for Jakarta’s next phase. Together, they connect public participation, institutional accountability, and consistent evidence.
            </p>
          </section>

          {/* Section 7: A Replicable Model (Figma padding: 24px 0, gap: 16px) */}
          <section id="a-replicable-model" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              A replicable model
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Three moves that turn inclusion into infrastructure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black">
              {/* Move 01 */}
              <div className="py-6 pr-6 md:border-r border-[#E5E7EB] flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">01</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Inclusive Musrenbang
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Bring affected communities into planning and budgeting decisions.
                </p>
              </div>

              {/* Move 02 */}
              <div className="py-6 px-6 md:border-r border-[#E5E7EB] flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">02</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Governance transformation
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Connect responsibilities across agencies and formalize inclusive practices.
                </p>
              </div>

              {/* Move 03 */}
              <div className="py-6 pl-6 flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">03</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Climate impact dashboard
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Create a shared system for consistent climate action and GHG data.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: References */}
          <section className="border-t border-black pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-5 space-y-1.5">
                <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] block font-manrope">References</span>
                <h2 className="font-iowan text-2xl sm:text-[28px] text-[#26251E] font-normal leading-[110%] tracking-[-0.5px]">
                  Read the source material
                </h2>
              </div>

              <div className="md:col-span-7 divide-y divide-[#E5E7EB] border-t md:border-t-0 border-[#E5E7EB]">
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>C40 MER &amp; ICA case study deck</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>C40 MER &amp; ICA reports folder</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>Project photo folder</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>McKinsey case study reference</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
              </div>
            </div>
          </section>

          {/* Section 9: Share Case Study */}
          <section className="space-y-3 pt-3 border-t border-black">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] block font-manrope">Share Case Study</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                title="Copy Link"
                className="p-2 rounded-full border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#18181B] transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
              </button>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                title="Share on X"
                className="p-2 rounded-full border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#18181B] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                title="Share on LinkedIn"
                className="p-2 rounded-full border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#18181B] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.37 9.74v-8.37H5.1v8.37h2.73z" />
                </svg>
              </a>
            </div>
          </section>

          {/* Section 10: You May Also Like */}
          <section className="space-y-5 pt-3 border-t border-black">
            <h2 className="font-iowan text-2xl sm:text-[28px] text-[#26251E] font-normal leading-[110%] tracking-[-0.5px]">
              You may also like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Card 1: Citizens' Assembly */}
              <Link href="/citizens-assembly" className="space-y-2.5 group cursor-pointer font-inter block">
                <article>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                    <Image
                      src="/c40/c40-photo1.png"
                      alt="Mending Runding: Jakarta’s First Citizens’ Assembly on Public Housing"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </div>
                  <div className="space-y-1 pt-2.5">
                    <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] block font-manrope">
                      Case Study
                    </span>
                    <h3 className="text-[13px] font-semibold text-[#18181B] leading-snug group-hover:underline">
                      Mending Runding: Jakarta’s First Citizens’ Assembly on Public Housing
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="w-4 h-4 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[9px] font-bold text-[#4B5563] font-manrope">
                        T
                      </div>
                      <span className="text-[11px] text-[#6B7280]">Think Policy Lab</span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Card 2: The Reformist Bootcamp */}
              <Link href="/use-case/reformist" className="space-y-2.5 group cursor-pointer font-inter block">
                <article>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                    <Image
                      src="/reformist/reformist-foto-utama.png"
                      alt="The Reformist Bootcamp: Why unlearning is the first step for policy professionals"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </div>
                  <div className="space-y-1 pt-2.5">
                    <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] block font-manrope">
                      Case Study
                    </span>
                    <h3 className="text-[13px] font-semibold text-[#18181B] leading-snug group-hover:underline">
                      The Reformist Bootcamp: Why unlearning is the first step for policy professionals
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="w-4 h-4 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[9px] font-bold text-[#4B5563] font-manrope">
                        R
                      </div>
                      <span className="text-[11px] text-[#6B7280]">The Reformist</span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Card 3: Urban Health & Clean Air */}
              <article className="space-y-2.5 group cursor-pointer font-inter">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                  <Image
                    src="/urban_health_resilience.jpg"
                    alt="Strengthening Primary Healthcare Governance for Clean Air"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] block font-manrope">
                    Case Study
                  </span>
                  <h3 className="text-[13px] font-semibold text-[#18181B] leading-snug group-hover:underline">
                    Strengthening Primary Healthcare Governance for Clean Air in Greater Jakarta
                  </h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="w-4 h-4 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[9px] font-bold text-[#4B5563] font-manrope">
                      D
                    </div>
                    <span className="text-[11px] text-[#6B7280]">Dina Kusuma</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>

        {/* ------------------------------------------------------- */}
        {/* RIGHT SIDEBAR: Fixed/Sticky "On this page" TOC */}
        {/* ------------------------------------------------------- */}
        <aside className="hidden lg:flex flex-1 justify-start sticky top-14 h-[calc(100vh-3.5rem)] p-8 pl-10 overflow-y-auto">
          <div className="w-60 pt-4 space-y-4">
            <h4 className="text-[13px] font-semibold text-[#18181B] tracking-tight font-inter">
              On this page
            </h4>

            <nav className="space-y-2.5 font-inter">
              {TOC_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`block text-[13px] transition-all leading-snug ${
                      isActive
                        ? "border-l-2 border-[#18181B] pl-3 font-medium text-[#18181B]"
                        : "pl-3.5 text-[#6B7280] hover:text-[#18181B]"
                    }`}
                  >
                    {sec.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

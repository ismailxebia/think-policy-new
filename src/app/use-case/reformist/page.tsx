"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Link2, Check, X, Undo2 } from "lucide-react";

const TOC_SECTIONS = [
  { id: "impact-in-numbers", label: "Impact in numbers" },
  { id: "background-opportunity", label: "Background" },
  { id: "the-model", label: "The model" },
  { id: "capability-and-community", label: "Solution" },
  { id: "institutional-ecosystem-change", label: "Impact" },
  { id: "lessons-for-indonesia", label: "A replicable model" },
];

export default function ReformistUseCasePage() {
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
          <div className="w-6" />
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
              The Reformist Bootcamp: Why unlearning is the first step to take by the next generation of policy professionals
            </h1>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal">
              <p>
                Across Indonesia’s ministries, local governments, and public institutions, many professionals already know what is not working in policymaking. The challenge is not always a lack of knowledge, but the difficulty of questioning long-held assumptions and introducing new ways of working within large and complex bureaucracies.
              </p>
              <p>
                Through The Reformist Bootcamp, Think Policy helps public servants and professionals practice unlearning before learning. By combining reflection, applied learning, and a community of peers, the program equips reform-minded individuals with the momentum and support needed to transform ideas and individual conviction into institutional practice.
              </p>
            </div>

            <figure className="space-y-2 pt-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <Image
                  src="/reformist/reformist-foto-utama.png"
                  alt="The Reformist Bootcamp participants collaborating in a policy workshop"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 660px"
                />
              </div>
              <figcaption className="font-inter text-[13px] text-[#6B7280] leading-snug">
                Reformist Bootcamp participants engaging in systems thinking and applied policy problem-solving.
              </figcaption>
            </figure>
          </section>

          {/* Section 2: At a Glance (Impact in Numbers) */}
          <section id="impact-in-numbers" className="scroll-mt-24">
            <div className="border-t border-black py-[13px] flex items-center justify-between text-[11px] font-extrabold tracking-[1.08px] uppercase text-[#6B7280] font-manrope">
              <span>at a glance</span>
              <span>2025–2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E5E7EB]">
              {/* Col 1 */}
              <div className="py-6 pr-6 space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  ~450
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  alumni have completed the Reformist Bootcamp
                </p>
              </div>

              {/* Col 2 */}
              <div className="py-6 px-6 md:border-l border-[#E5E7EB] space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  ~275
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  institutions represented across sectors
                </p>
              </div>

              {/* Col 3 */}
              <div className="py-6 pl-6 md:border-l border-[#E5E7EB] space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  43%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  avg. increase in the Core Knowledge component
                </p>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 text-[13px] text-[#6B7280] font-inter">
              Along with 22% avg. increase in Core Competency &amp; 13% avg. increase in Efficacy to Change across cohorts.
            </div>
          </section>

          {/* Section 3: Background · The Opportunity */}
          <section id="background-opportunity" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Background · The opportunity
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Bridging the gap between individual conviction and institutional change
            </h2>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              <p>
                Across Indonesian ministries, subnational governments, state-owned enterprises, and other institutions, many professionals already understand that some of the ways policies are designed and implemented are no longer sufficient for increasingly complex challenges. Issues such as climate adaptation, food systems, and demographic transition cannot always be addressed through linear plans or conventional solutions. They require policymakers and professionals to work across sectors, question assumptions, respond to uncertainty, and adapt their approaches as new information emerges.
              </p>
              <p>
                Yet bringing evidence and new ideas into practice can be difficult within a bureaucratic system that has, over time, developed a risk-averse culture. Innovation is not always rewarded, while performance indicators can be less legible than they are in the private sector. Policy priorities can also be determined from the top, leaving limited room for participatory or iterative approaches. The result is a gap between knowing that change is needed and feeling able to make that change happen.
              </p>
              <p>
                For professionals with high agency, this can be particularly discouraging. When the institutional incentives to experiment are weak and the risks of doing something differently are more visible than the benefits, reform-minded individuals can quickly lose momentum.
              </p>
              <p>
                Existing pathways to developing a different paradigm also tend to come with high barriers. A master&apos;s degree, professional certification, or long-term apprenticeship can provide valuable learning, but requires significant investments of time and money.
              </p>
              <p>
                This created an opportunity for a different kind of learning intervention: one that does not simply teach professionals more technical knowledge, but helps them question existing assumptions, practice new ways of working, and build the relationships needed to keep acting when they return to their desks.
              </p>
              <p>
                This is the premise behind The Reformist Bootcamp, Think Policy&apos;s flagship program for public servants and professionals. Rather than treating participants as people who simply need to acquire more knowledge, the program starts from the belief that many potential reformers are already inside the system. What they need is the momentum and allies to turn their conviction into institutional practice.
              </p>
            </div>

            {/* Aside Callout Box matching exact Figma styling */}
            <aside className="border-l-4 border-[#DBD8D4] bg-[#F5F4F1] p-6 flex flex-col md:flex-row gap-[30px] items-start mt-4">
              <div className="md:w-1/3 shrink-0">
                <h3 className="font-iowan text-xl sm:text-[24px] text-[#26251E] leading-snug">
                  Why unlearning first?
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="font-inter text-[14px] leading-[22px] text-[#18181B]">
                  Changing institutions starts with changing how the people inside them think and act. Before introducing new tools, participants examine the assumptions and biases that shape how they understand a policy problem.
                </p>
              </div>
            </aside>
          </section>

          {/* Section 4: The Model (3 principles for building reform capability) */}
          <section id="the-model" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              The model
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              3 principles for building reform capability
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black mt-4">
              {/* Principle 01 */}
              <div className="py-6 pr-6 md:border-r border-[#E5E7EB] flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">01</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Unlearning before learning
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Surface the assumptions that make current practices feel inevitable before introducing new tools and frameworks.
                </p>
              </div>

              {/* Principle 02 */}
              <div className="py-6 px-6 md:border-r border-[#E5E7EB] flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">02</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  High-touch, applied andragogy
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Adults learn by engaging directly with instructors, mentors, peers, and real-world problems, with feedback applied to their own work.
                </p>
              </div>

              {/* Principle 03 */}
              <div className="py-6 pl-6 flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">03</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Measure behavior, not satisfaction
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Go beyond participant satisfaction and knowledge acquisition to assess whether learning is actually applied in the workplace.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Solution · Building Capability and Community */}
          <section id="capability-and-community" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Solution · Building capability and community
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Building the capability and community to make reform possible
            </h2>

            <p className="font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              The Reformist Bootcamp is designed around a simple premise: changing institutions starts with changing how the people inside them think and act. To do that, the program combines three approaches.
            </p>

            {/* 3 Step Items with specific Reformist Bootcamp client content */}
            <div className="flex flex-col gap-[20px] pt-3">
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">01</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Unlearning comes before learning
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Reformists rarely need new information first. Before introducing another policy framework or technical tool, the Bootcamp creates space for participants to examine the assumptions, biases, and beliefs that shape how they understand a problem. The curriculum moves between inner work—such as agency, bias, and ego—and outer work, including systems thinking, influence, storytelling, program design, budgeting, and innovation.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">02</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    High-touch learning that connects directly to real work
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Unlike self-paced courses or conventional technical training, the Bootcamp is deliberately designed around high-touch andragogy: adult learning through direct engagement, discussion, experimentation, and feedback. The approach has produced an average 43% increase in core knowledge, 22% increase in core competencies, and 13% increase in efficacy to change.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">03</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Building a community that keeps reformers moving
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Even when individuals have the capability and motivation to change, institutional reform rarely happens alone. Across approximately 450 alumni from 275 institutions, participants have built relationships across central and subnational government, civil society, academia, the private sector, SOEs, and international organizations.
                </p>
              </div>
            </div>

            {/* In-content photo */}
            <figure className="space-y-2 py-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <Image
                  src="/reformist/reformist-foto-2.png"
                  alt="Bootcamp participants collaborating closely during policy case study analysis"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 660px"
                />
              </div>
              <figcaption className="font-inter text-[13px] text-[#6B7280] leading-snug">
                Participants engaging in peer-to-peer discussions and real-world policy problem solving.
              </figcaption>
            </figure>
          </section>

          {/* Pull Quote 1: Dark Quote Callout Box */}
          <section className="rounded-lg bg-[#18181B] text-white p-6 space-y-4 shadow-sm">
            <blockquote className="font-iowan text-[26px] sm:text-[28px] leading-[120%] text-white tracking-[-0.5px] font-normal not-italic">
              “Through tangible case studies, we learn how to get involved and identify the root of the problems, so we can empathize and set policies in real life.”
            </blockquote>
            <cite className="block text-[11px] font-extrabold text-[#71717A] not-italic tracking-[1.08px] uppercase font-manrope pt-1">
              Putri H. L, Bootcamp alumna
            </cite>
          </section>

          {/* Pull Quote 2: Secondary Light Quote Box */}
          <section className="rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] p-6 space-y-3">
            <blockquote className="font-iowan text-[24px] sm:text-[26px] leading-[120%] text-[#26251E] tracking-[-0.5px] font-normal not-italic">
              “Think Policy Bootcamp helps provide new thinking frameworks in addressing public policy for significant and sustainable change.”
            </blockquote>
            <cite className="block text-[11px] font-extrabold text-[#6B7280] not-italic tracking-[1.08px] uppercase font-manrope">
              Civil Servant, Bootcamp alumnus
            </cite>
          </section>

          {/* Section 6: From Individual Capability to Institutional and Ecosystem Change */}
          <section id="institutional-ecosystem-change" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Impact · Systemic change
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              From individual capability to institutional and ecosystem change
            </h2>

            <p className="font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              The Reformist Bootcamp&apos;s impact is not simply measured by how many professionals it has trained. Its more significant test is what the alumni do with what they have learned once they return to their own working environments.
            </p>

            {/* 3 Levels of Change */}
            <div className="flex flex-col gap-[20px] pt-3">
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">01</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Individual Level
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Alumni bring new frameworks and capabilities into their work. The increases in knowledge, competency, and efficacy to change indicate that participants leave not only knowing more, but feeling better equipped to navigate complex policy problems.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">02</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Institutional Level
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Several alumni from the same organization work together to replicate what they learned within their own working ecosystems, turning an individual learning experience into a shared institutional practice.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">03</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Ecosystem Level
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Alumni go on to influence formal policy instruments, pass regional regulations, and establish new internal learning spaces that outlast any individual cohort.
                </p>
              </div>
            </div>

            {/* Sub-block: When learning becomes policy practice */}
            <div className="pt-6 space-y-4">
              <h2 className="font-iowan text-[28px] sm:text-[32px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px]">
                When learning becomes policy practice
              </h2>

              <div className="border-t border-black divide-y divide-[#E5E7EB]">
                {/* Case 1: Pohuwato Regency */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">Pohuwato Regency, Gorontalo</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Alumnus helped draft and pass a regional regulation (Perda) on data-based local governance in December 2025.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>

                {/* Case 2: Ministry of Agriculture */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">Ministry of Agriculture</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Ridho (Cohort 10) applied Bootcamp tools to build climate-based planting calendars, winning 1st prize at KOICA South Korea.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>

                {/* Case 3: Bappenas Muda */}
                <div className="py-[14px] flex items-center justify-between gap-4 group">
                  <div className="space-y-0.5">
                    <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] font-manrope">Ministry of National Development Planning (Bappenas)</h3>
                    <p className="font-inter text-[13px] text-[#4B5563] leading-relaxed">
                      Alumni Prita, Fikri, and Riski initiated Bappenas Muda to foster internal champions and adaptive development planning.
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors shrink-0" />
                </div>
              </div>
            </div>
          </section>

          {/* Pull Quote 3: Community Quote Box */}
          <section className="rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] p-6 space-y-3">
            <blockquote className="font-iowan text-[24px] sm:text-[26px] leading-[120%] text-[#26251E] tracking-[-0.5px] font-normal not-italic">
              “Through this community, I get the chance to build a network, get timely information, job openings, and even scholarship opportunities.”
            </blockquote>
            <cite className="block text-[11px] font-extrabold text-[#6B7280] not-italic tracking-[1.08px] uppercase font-manrope">
              Samuel Leivy Opa, Bootcamp alumnus
            </cite>
          </section>

          {/* Section 7: Lessons for Indonesia */}
          <section id="lessons-for-indonesia" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              A replicable model · Lessons learned
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              What Indonesia can learn from building reform capability
            </h2>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              <p>
                The Reformist Bootcamp demonstrates that strengthening Indonesia&apos;s policymaking capacity is not only about producing more technically proficient professionals. It is also about empowering and enabling the people already inside public institutions to challenge assumptions, navigate constraints, build alliances, and act on what they know.
              </p>
              <p>
                This matters because many of Indonesia&apos;s most difficult policy challenges will not be solved by a single new technical solution. They require people who can work across institutional boundaries, respond to uncertainty, and keep adapting even when existing incentives favour the status quo.
              </p>
              <p>
                The reformers do not need to be brought into the system. Many of them are already there. The challenge lies in how to provide them with the capability, momentum, and allies to change the system from within.
              </p>
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
                  href="https://docs.google.com/document/d/1UMYDNKXv4-gce9GHQLNPrfQ1-aQLi7ZWnzSR3JUjjW4/edit?usp=drivesdk"
                  target="_blank"
                  rel="noreferrer"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>The Reformist Bootcamp case study deck</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="https://www.mckinsey.com/industries/chemicals/how-we-help-clients/how-socar-transformed-a-fertilizer-leader-in-azerbaijan-with-industrial-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>McKinsey case study</span>
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
              {/* Card 1: C40 Climate Governance Case Study */}
              <Link href="/use-case/c40" className="space-y-2.5 group cursor-pointer font-inter block">
                <article>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                    <Image
                      src="/c40/c40-photo3.png"
                      alt="Building a more inclusive climate governance that works for everyone in Jakarta"
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
                      Building a more inclusive climate governance that works for everyone in Jakarta
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="w-4 h-4 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[9px] font-bold text-[#4B5563] font-manrope">
                        C
                      </div>
                      <span className="text-[11px] text-[#6B7280]">C40 &amp; Think Policy</span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Card 2: Citizens' Assembly */}
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

              {/* Card 3: Just Energy Transition */}
              <article className="space-y-2.5 group cursor-pointer font-inter">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                  <Image
                    src="/just_energy_transition.jpg"
                    alt="Accelerating Indonesia’s Just Energy Transition"
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
                    Accelerating Indonesia’s Just Energy Transition Through Regional Coalitions
                  </h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="w-4 h-4 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[9px] font-bold text-[#4B5563] font-manrope">
                      A
                    </div>
                    <span className="text-[11px] text-[#6B7280]">Alia Noor</span>
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

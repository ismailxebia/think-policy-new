"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Link2, Check, X, Undo2 } from "lucide-react";

const TOC_SECTIONS = [
  { id: "impact-in-numbers", label: "Impact in numbers" },
  { id: "background-opportunity", label: "Background" },
  { id: "the-model", label: "The model" },
  { id: "inclusive-policymaking", label: "Solution" },
  { id: "impact-participation", label: "Impact" },
  { id: "replicable-model", label: "A replicable model" },
];

export default function CitizensAssemblyPage() {
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
              Mending Runding gathered Jakarta’s diverse citizens to deliberate and shape the policy directly affecting their lives
            </h1>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal">
              <p>
                In a city as diverse as Jakarta, many residents rarely have the opportunity to discuss public issues with people whose lives, experiences, and perspectives differ significantly from their own. Yet policymaking often requires balancing exactly these different needs and priorities.
              </p>
              <p>
                Through the city’s first-ever citizens’ assembly, Mending Runding (roughly translates to “It’s better to deliberate”), Think Policy in collaboration with Bappeda Jakarta brought together randomly selected residents who reflected the city&apos;s demographic composition. As they learned about Jakarta&apos;s public housing challenges and deliberated on possible solutions, participants discovered that meaningful policy discussions become possible when citizens are given the information and space to understand one another&apos;s perspectives.
              </p>
            </div>

            <figure className="space-y-2 pt-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <Image
                  src="/ca/ca-foto-utama.png"
                  alt="Sixty Jakarta residents gathered to turn lived experience into public-housing recommendations"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 660px"
                />
              </div>
              <figcaption className="font-inter text-[13px] text-[#6B7280] leading-snug">
                Sixty Jakarta residents gathered to turn lived experience into public-housing recommendations.
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
                  92%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  accuracy of the participant composition against the demography of Jakarta
                </p>
              </div>

              {/* Col 2 */}
              <div className="py-6 px-6 md:border-l border-[#E5E7EB] space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  64%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  participants viewed their recommendations are useful for Jakarta’s government
                </p>
              </div>

              {/* Col 3 */}
              <div className="py-6 pl-6 md:border-l border-[#E5E7EB] space-y-3">
                <span className="font-iowan text-[44px] leading-none text-[#26251E] font-normal tracking-[-0.5px] block">
                  100%
                </span>
                <p className="font-inter text-[13px] text-[#4B5563] leading-[1.45]">
                  participants are interested to take part in more citizens’ assembly sessions
                </p>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 text-[13px] text-[#6B7280] font-inter">
              Participants represented a representative mini-public across Jakarta’s diverse demographic profile.
            </div>
          </section>

          {/* Section 3: Background · The Opportunity */}
          <section id="background-opportunity" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Background · The opportunity
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Empowering the public from mere observers to active participants
            </h2>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              <p>
                The policymaking process in Jakarta normally sees the residents as mere observers—or even “objects”—for whom the policy is formulated, instead of as active participants who might have valuable insights on how the policy affects their livelihoods and well-being.
              </p>
              <p>
                Indeed, there have been forums where the public can discuss the development of policy in Jakarta, such as musrenbang (a multi-stakeholder forum for development and planning) and public consultation forums—but they are often attended by the same participants again and again while favoring one-way presentations from policymakers. As such, there is not enough space for the residents of Jakarta to actually deliberate on policy options, resulting in many policy decisions being contested by the public after its implementation by the regional government.
              </p>
              <p>
                This is where our 2025 initiative, Mending Runding, came in. As the city’s first citizens’ assembly, we randomly selected participants with a lottery that represented the real composition of Jakarta’s residents. In collaboration with the city’s Regional Planning and Development Agency (Bappeda), we invited the public to answer the question: <em className="italic">Who should be prioritized in Jakarta’s public housing programs?</em>
              </p>
              <p>
                From stay-at-home mothers to motorcycle taxi drivers to white-collar professionals, the selected participants were empowered to take part in formulating the city’s public housing policy.
              </p>
            </div>

            {/* Aside Callout: Why a citizens' assembly? (Figma: border-left 4px #DBD8D4, bg #F5F4F1, p-6, gap-30px) */}
            <aside className="border-l-4 border-[#DBD8D4] bg-[#F5F4F1] p-6 flex flex-col md:flex-row gap-[30px] items-start mt-4">
              <div className="md:w-1/3 shrink-0">
                <h3 className="font-iowan text-xl sm:text-[24px] text-[#26251E] leading-snug">
                  Why a citizens’ assembly?
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="font-inter text-[14px] leading-[22px] text-[#18181B]">
                  It reimagines Indonesia’s tradition of <em className="italic">musyawarah</em> for today: a mini-public represents the city, learns about a policy dilemma, and deliberates toward recommendations for policymakers.
                </p>
              </div>
            </aside>
          </section>

          {/* Section 4: The Model (3 principles behind Mending Runding) */}
          <section id="the-model" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              The model
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              3 principles behind the Mending Runding citizens’ assembly
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black mt-4">
              {/* Principle 01 */}
              <div className="py-6 pr-6 md:border-r border-[#E5E7EB] flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">01</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Deliberative
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Participants are encouraged to reason toward a common ground, navigating complex policy and societal trade-offs through empathy and data.
                </p>
              </div>

              {/* Principle 02 */}
              <div className="py-6 px-6 md:border-r border-[#E5E7EB] flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">02</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Representative
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  Participants are randomly selected by lottery against the city’s demographic composition, ensuring that the people in the forum reflect the voice on the streets.
                </p>
              </div>

              {/* Principle 03 */}
              <div className="py-6 pl-6 flex flex-col gap-[16px]">
                <span className="text-[12px] font-extrabold text-black block font-manrope">03</span>
                <h3 className="text-[16px] font-semibold text-[#18181B] leading-[140%] font-inter">
                  Participatory
                </h3>
                <p className="text-[14px] text-[#18181B] leading-[20px] font-inter">
                  It is a co-creation process that starts with a policy dilemma presented by the government and concludes with a set of recommendations deliberated by the citizens.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Solution · Inclusive Policymaking */}
          <section id="inclusive-policymaking" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Solution · Inclusive policymaking
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              An inclusive safe space for policymaking
            </h2>

            <p className="font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              Through Mending Runding, we aimed to create an inclusive safe space where deliberation about a policy dilemma and the resulting recommendations could happen among the participants—something that could be achieved via the following methods:
            </p>

            {/* 3 Step Items with specific Mending Runding client content */}
            <div className="flex flex-col gap-[20px] pt-3">
              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">01</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    Randomly selected participants that reflected the city
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  Different from usual policy forums that are usually dominated by certain groups—hence creating an echo chamber—we implemented a random sortition (lottery) that matched Jakarta’s demographic profile. From 95 incoming applicants, we sorted 60 members of the assembly, also known as the citizen juries, which represented the demography of Jakarta with a 92% level of accuracy. Our assembly members were diverse, from stay-at-home parents, motorcycle taxi drivers, to casual workers, aged 18 to over 50 years old.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">02</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    A policy dilemma to deliberate on
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  In other forums, citizens were usually asked to only react to a set of policy options already pre-determined by a group of politicians and bureaucrats. What’s different for Mending Runding was that we asked Bappeda Jakarta to present a policy dilemma to the public (“Who should be prioritized for public housing in Jakarta?”) so that the participants could deliberate and come up with policy recommendations stemming from their lived-in experiences.
                </p>
              </div>

              <div>
                <div className="border-t border-black py-[13px] flex items-center gap-[12px]">
                  <span className="text-[12px] font-extrabold text-black font-manrope">03</span>
                  <span className="w-px h-[15.5px] bg-black/10" />
                  <h3 className="text-[12px] font-extrabold text-black uppercase tracking-[1.08px] leading-[18px] font-manrope">
                    An inclusive approach to deliberation
                  </h3>
                </div>
                <p className="font-inter text-[14px] leading-[22px] text-[#374151]">
                  A very diverse set of participants with starkly different backgrounds could lead to more complex discussions, especially as everyone brought their own experiences. This is where an inclusive approach to deliberation took place, including small-group deliberation format which helped the assembly to bring forth a consensus in the form of recommendations that Bappeda Jakarta found useful to further formulate the public housing policy.
                </p>
              </div>
            </div>

            {/* In-content photo */}
            <figure className="space-y-2 py-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <Image
                  src="/ca/ca-foto2.png"
                  alt="Think Policy facilitator and government representatives engaging in open dialogue with citizen jurors"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 660px"
                />
              </div>
              <figcaption className="font-inter text-[13px] text-[#6B7280] leading-snug">
                Facilitators and government stakeholders exchanging insights during the public housing citizen deliberation session.
              </figcaption>
            </figure>
          </section>

          {/* Pull Quote 1: Dark Quote Callout Box */}
          <section className="rounded-lg bg-[#18181B] text-white p-6 space-y-4 shadow-sm">
            <blockquote className="font-iowan text-[26px] sm:text-[28px] leading-[120%] text-white tracking-[-0.5px] font-normal not-italic">
              “The most captivating thing is the creation of an inclusive dialogue space without barriers. In the Mending Runding forum, we felt empathy and openness from all participants to truly understand the Deaf community’s perspective, so that the solutions formulated were genuinely fair and answered actual needs.”
            </blockquote>
            <cite className="block text-[11px] font-extrabold text-[#71717A] not-italic tracking-[1.08px] uppercase font-manrope pt-1">
              Bambang, Central Jakarta resident
            </cite>
          </section>

          {/* Pull Quote 2: Secondary Light Quote Box */}
          <section className="rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] p-6 space-y-3">
            <blockquote className="font-iowan text-[24px] sm:text-[26px] leading-[120%] text-[#26251E] tracking-[-0.5px] font-normal not-italic">
              “This experience made me realize that my existence, thoughts, and experiences are actually important to be heard and considered.”
            </blockquote>
            <cite className="block text-[11px] font-extrabold text-[#6B7280] not-italic tracking-[1.08px] uppercase font-manrope">
              Brigitta, West Jakarta resident
            </cite>
          </section>

          {/* Section 6: Impact on Participation */}
          <section id="impact-participation" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              Impact
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Bringing public participation in policymaking process one step ahead
            </h2>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              <p>
                After organizing the first Mending Runding in 2025, we realized that we had brought public participation in the policymaking process one step ahead: not only for the public or citizens to just be passively informed and consulted about policy options, but to also actively co-create policy with the government within an inclusive safe space.
              </p>
              <p>
                If previously citizens were detached from the process, citizens’ assembly initiatives like Mending Runding enable them to deepen their knowledge on the policy dilemma presented by the government, meet and discuss with fellow citizens, and learn how to deliberate before finally reaching a consensus.
              </p>
              <p>
                As a result, the citizens gained insights on the specific policy as they emerged with a more profound shift in civic identity. The government also garnered credibility and legitimacy through a set of recommendations both formulated and endorsed by the citizens themselves.
              </p>
            </div>
          </section>

          {/* Section 7: Replicating Lessons Learned Across Indonesia */}
          <section id="replicable-model" className="space-y-4 scroll-mt-24">
            <div className="border-t border-black pt-[13px] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-[1.08px] font-manrope">
              A replicable model · Lessons learned
            </div>

            <h2 className="font-iowan text-[32px] sm:text-[38px] leading-[110%] text-[#26251E] font-normal tracking-[-0.5px] pt-1">
              Replicating the lessons learned across Indonesia
            </h2>

            <div className="space-y-4 font-inter text-[16px] leading-[24px] text-[#18181B] font-normal pt-2">
              <p>
                Mending Runding has proven that as long as citizens are empowered and given the safe space, they are able to collaborate and co-create more inclusive and representative policy options together with the government. The first citizens’ assembly with Bappeda Jakarta showed that a group of randomly sorted residents of the city could deliberate and come up with recommendations for the city’s public housing policy, which was accepted readily by the government agency.
              </p>
              <p>
                We expect that Mending Runding can serve as a model of how the public across Indonesia can reimagine their participation within the policymaking process—that they are empowered to create policy recommendations based on their own lived-in experiences without having to rely first on the politicians. All it takes is the right amount of information and the chance to have conversations with fellow citizens to assemble, deliberate, and create the policy that benefits everyone.
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
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>Mending Runding Citizens’ Assembly Full Report</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>Bappeda Jakarta Public Housing Policy Brief</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>Think Policy Deliberative Democracy Playbook</span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#references"
                  className="py-[13px] flex items-center justify-between text-[14px] font-medium text-[#18181B] hover:underline group font-inter"
                >
                  <span>OECD Deliberative Democracy &amp; Mini-Publics Guide</span>
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

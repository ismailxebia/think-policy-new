"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface PillarCase {
  title: string;
  partner?: string;
}

interface Pillar {
  id: string;
  number: string;
  name: string;
  statement: string;
  body: string;
  approach: { title: string; description: string }[];
  services?: string[];
  cases: PillarCase[];
}

const PILLARS: Pillar[] = [
  {
    id: "unlearning",
    number: "01",
    name: "(Un)learning",
    statement:
      "Most institutional challenges are not caused by a lack of information — they persist because people approach new problems with old assumptions.",
    body: "Through the (Un)Learning pillar, Think Policy helps leaders and institutions deliberately question longstanding norms and practices to see problems freshly rather than through inherited defaults. We create spaces where participants surface their assumptions, identify blind spots, and rebuild their understanding of the systems they seek to influence. Unlearning is a cycle: it begins with the individual, moves into community finding, and turns outward into institutionalization.",
    approach: [
      {
        title: "Discoveries",
        description:
          "Participants independently and actively seek knowledge, connecting new insights to personal and professional challenges.",
      },
      {
        title: "Experience",
        description:
          "The wealth of experience participants bring enriches discussions and deepens theories and frameworks.",
      },
      {
        title: "Experiment",
        description:
          "Real-world simulations, prototyping, and reflections as part of a meaningful learning experience.",
      },
    ],
    services: [
      "Bootcamps & intensive training",
      "Executive education",
      "Customized workshops & learning journeys",
      "Curriculum & learning design advisory",
      "Facilitation & mentoring",
      "Online learning platforms & digital courses",
      "Monitoring, Evaluation, and Learning (MEL) support",
      "Knowledge products & learning handbooks",
    ],
    cases: [
      {
        title: "Strengthening Indonesia's health planning capabilities",
        partner: "Bureau of Planning and Budgeting",
      },
      {
        title: "Climate-responsive infrastructure financing for Jakarta",
        partner: "Jakarta Regional Government",
      },
      {
        title: "Building local leadership for Indonesia's green workforce transition",
      },
    ],
  },
  {
    id: "storytelling",
    number: "02",
    name: "Storytelling",
    statement:
      "Many of the issues that shape our lives fail to move people — not because they do not matter, but because meaning gets lost in translation.",
    body: "Our approach brings together two complementary practices: documenting impact and translating meaning. We follow change as it unfolds, looking beyond outcomes to understand how and why it happens — then turn it into narratives that people can understand, trust, and act on.",
    approach: [
      {
        title: "Documenting impact",
        description:
          "We follow change as it unfolds, looking beyond outcomes to understand how and why it happens.",
      },
      {
        title: "Translating meaning",
        description:
          "We turn evidence and lived experience into narratives people can understand, trust, and act on.",
      },
    ],
    cases: [
      {
        title: "Building cross-sector ownership of Indonesia's carbon pricing agenda",
      },
      {
        title: "Reframing the energy transition around finance",
        partner: "Fair Finance Asia (FFA)",
      },
      {
        title: "Sustaining public legitimacy for Indonesia's climate ambitions",
      },
    ],
  },
  {
    id: "convening",
    number: "03",
    name: "Convening",
    statement:
      "Many reform actors across government, civil society, philanthropy, media, and communities work toward similar goals — but fragmentation keeps collective impact out of reach.",
    body: "Meaningful convening requires more than bringing people into the same room. Our approach combines technical rigor with grounded political economy understanding, turning fragmented perspectives into actionable recommendations and stronger foundations for coordination.",
    approach: [
      {
        title: "Technical rigor",
        description:
          "Substance-first agendas that respect the expertise in the room and move it toward decisions.",
      },
      {
        title: "Political economy understanding",
        description:
          "Grounded reading of incentives, mandates, and relationships so dialogue lands where change actually sits.",
      },
    ],
    cases: [
      {
        title:
          "Carbon Dialogue — a platform for government, industry, finance, development partners, academics, and civil society",
      },
      {
        title: "Bridging the sustainability talent gap toward Net Zero 2060",
        partner: "Monash University Indonesia",
      },
      {
        title: "Building shared understanding of AI's impact on Indonesia's economy and public institutions",
      },
      {
        title: "Mentorship, peer learning, and leadership development for reform leaders",
      },
    ],
  },
  {
    id: "advisory",
    number: "04",
    name: "Advisory",
    statement:
      "Many public policy challenges already have known solutions. What is often missing is the ability to make those solutions happen.",
    body: "We do not believe in delivering perfect recommendations from a distance. Our approach is grounded in co-design: we work alongside institutions, practitioners, and stakeholders to strengthen the people, institutions, and relationships needed to make reform stick.",
    approach: [
      {
        title: "Co-design",
        description:
          "Solutions built with the institutions that will own them, not handed over from a distance.",
      },
      {
        title: "Strategic facilitation",
        description:
          "Structured processes that move stakeholders from analysis to aligned action.",
      },
      {
        title: "Capacity building",
        description:
          "Strengthening the people and relationships that keep reform working after we leave.",
      },
    ],
    cases: [
      {
        title: "Indonesia's first regulatory sandbox for health technology",
        partner: "Ministry of Health · Instellar · British Embassy Jakarta",
      },
      {
        title: "Life-Cycle Public Service Playbook — formally adopted",
        partner: "KemenPANRB · Komdigi · Bappenas",
      },
      {
        title: "Roadmap for Indonesia's digital health transformation",
        partner: "British Embassy Jakarta · Ministry of Health",
      },
      {
        title: "Strengthening the enabling environment for carbon pricing",
      },
    ],
  },
];

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-t border-[#E5E7EB] pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280] font-inter">
      {children}
    </p>
  );
}

export default function ProductPage() {
  const [activeSection, setActiveSection] = useState(PILLARS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 240;
      let current = PILLARS[0].id;
      for (const pillar of PILLARS) {
        const el = document.getElementById(pillar.id);
        if (el && el.offsetTop <= scrollPosition) {
          current = pillar.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#18181B] antialiased flex flex-col font-inter selection:bg-[#E5E7EB] selection:text-[#18181B]">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-24 pb-14 sm:pb-20">
          <span className="text-[11px] font-extrabold uppercase tracking-[1.08px] text-[#6B7280] font-manrope block">
            Our Products
          </span>
          <h1 className="mt-4 font-iowan text-[30px] sm:text-[38px] lg:text-[44px] text-[#151515] font-normal leading-[120%] tracking-tight max-w-[760px]">
            Opportunities become impact when they meet readiness.
          </h1>
          <p className="mt-6 text-[14px] sm:text-[15px] leading-[24px] text-[#52525B] font-inter max-w-[560px]">
            Four practices, one purpose: moving complex policy challenges
            forward. Each pillar works on its own — and compounds when combined.
          </p>
        </section>

        {/* PILLARS — sticky nav + content */}
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-12">
            {/* Sticky pillar nav */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280] font-inter block mb-5">
                  Pillars
                </span>
                <ul className="space-y-4">
                  {PILLARS.map((pillar) => (
                    <li key={pillar.id}>
                      <Link
                        href={`#${pillar.id}`}
                        className={
                          activeSection === pillar.id
                            ? "flex items-baseline gap-3 border-l-2 border-[#18181B] pl-3 text-[13px] font-medium text-[#18181B]"
                            : "flex items-baseline gap-3 border-l-2 border-transparent pl-3 text-[13px] text-[#6B7280] hover:text-[#18181B] transition-colors"
                        }
                      >
                        <span className="text-[10px] font-semibold text-[#9CA3AF]">
                          {pillar.number}
                        </span>
                        {pillar.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Pillar sections */}
            <div>
              {PILLARS.map((pillar) => (
                <section
                  key={pillar.id}
                  id={pillar.id}
                  className="scroll-mt-28 py-14 sm:py-20 first:pt-0"
                >
                  {/* Pillar header — top rule + label pair (c40 "at a glance" pattern) */}
                  <div className="border-t border-[#18181B] pt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#18181B] font-inter">
                      Pillar {pillar.number}
                    </span>
                    <span className="text-xs font-semibold text-[#18181B] font-inter">
                      Our Products
                    </span>
                  </div>
                  <h2 className="mt-6 font-iowan text-[32px] text-[#151515] font-normal leading-[115%] tracking-tight">
                    {pillar.name}
                  </h2>

                  {/* THE CHALLENGE */}
                  <div className="mt-12">
                    <SectionKicker>The Challenge</SectionKicker>
                    <p className="mt-6 font-iowan text-[22px] sm:text-[26px] leading-[130%] text-[#151515] max-w-[720px]">
                      {pillar.statement}
                    </p>
                    <p className="mt-6 text-[14px] sm:text-[15px] leading-[24px] text-[#52525B] font-inter max-w-[640px]">
                      {pillar.body}
                    </p>
                  </div>

                  {/* OUR APPROACH — divided columns (c40 stats pattern) */}
                  <div className="mt-14">
                    <SectionKicker>Our Approach</SectionKicker>
                    <div
                      className={`mt-6 grid grid-cols-1 sm:grid-cols-2 ${
                        pillar.approach.length >= 3 ? "lg:grid-cols-3" : ""
                      } sm:divide-x sm:divide-[#E5E7EB] border-y border-[#E5E7EB]`}
                    >
                      {pillar.approach.map((item, index) => (
                        <div
                          key={item.title}
                          className={index === 0 ? "py-8 sm:pr-8" : "py-8 sm:px-8"}
                        >
                          <span className="text-[11px] font-semibold text-[#9CA3AF] font-inter">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="mt-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#18181B] font-inter">
                            {item.title}
                          </h3>
                          <p className="mt-4 text-[13px] leading-[20px] text-[#52525B] font-inter">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KEY SERVICES (optional) */}
                  {pillar.services && (
                    <div className="mt-14">
                      <SectionKicker>Key Services</SectionKicker>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {pillar.services.map((service) => (
                          <li
                            key={service}
                            className="text-[12.5px] text-[#18181B] font-inter border border-[#E5E7EB] rounded-full px-4 py-1.5 hover:border-[#18181B] transition-colors"
                          >
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* SELECTED WORK */}
                  <div className="mt-14">
                    <SectionKicker>Selected Work</SectionKicker>
                    <ul className="mt-6 border-t border-[#E5E7EB]">
                      {pillar.cases.map((item) => (
                        <li key={item.title}>
                          <Link
                            href="/use-case/c40"
                            className="group flex items-start justify-between gap-6 border-b border-[#E5E7EB] py-5 hover:bg-[#F9FAFB] transition-colors -mx-3 px-3"
                          >
                            <div>
                              <h3 className="text-[14px] font-semibold leading-[20px] text-[#18181B] font-inter">
                                {item.title}
                              </h3>
                              {item.partner && (
                                <p className="mt-1.5 text-[12.5px] text-[#6B7280] font-inter">
                                  {item.partner}
                                </p>
                              )}
                            </div>
                            <ArrowUpRight
                              size={16}
                              strokeWidth={2}
                              className="mt-1 shrink-0 text-[#9CA3AF] transition-all duration-200 group-hover:text-[#18181B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

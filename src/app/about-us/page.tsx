import Image from "next/image";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Us | Think Policy",
  description:
    "We are an interdisciplinary team committed to transforming Indonesia's public policy landscape for the better.",
};

interface Person {
  name: string;
  role: string;
  photo: string;
}

const LEADERSHIP: Person[] = [
  {
    name: "Andhyta F. Utami",
    role: "Chief Experiment Officer",
    photo: "/team/andhyta-f-utami.png",
  },
  {
    name: "Florida Andriana",
    role: "Co Founder & Chief Growth Officer, Private Sector Principal",
    photo: "/team/florida-andriana.png",
  },
  {
    name: "Adrian Maulana",
    role: "Fraction-Chief Operating Officer (COO)",
    photo: "/team/adrian-maulana.png",
  },
];

const BRAINSTRUST: Person[] = [
  {
    name: "Chatib Basri",
    role: "Former Minister of Finance, Republik Indonesia",
    photo: "/team/chatib-basri.webp",
  },
  {
    name: "Mari Elka Pangestu",
    role: "Former Managing Director of Development Policy & Partnerships, World Bank",
    photo: "/team/mari-elka-pangestu.webp",
  },
  {
    name: "Yanuar Nugroho",
    role: "Former Deputy Chief of Staff of President",
    photo: "/team/yanuar-nugroho.webp",
  },
  {
    name: "Najeela Shihab",
    role: "Education Expert",
    photo: "/team/najeela-shihab.webp",
  },
  {
    name: "Vivi Alatas",
    role: "Leading Poverty Economist",
    photo: "/team/vivi-alatas.webp",
  },
  {
    name: "Sofyan Djalil",
    role: "CEO Indonesian Business Council",
    photo: "/team/sofyan-djalil.webp",
  },
];

const TEAM_GROUPS: { unit: string; members: Person[] }[] = [
  {
    unit: "(Un)learning",
    members: [
      { name: "Hanna Vanya", role: "Head of Learning Community", photo: "/team/hanna-vanya.png" },
      { name: "Hasnaa Naila", role: "Academy Lead", photo: "/team/hasnaa-naila.png" },
    ],
  },
  {
    unit: "Storytelling",
    members: [
      { name: "Nathaniel Rayestu", role: "Head of Media", photo: "/team/nathaniel-rayestu.png" },
      { name: "Nea Ningtyas", role: "Creative & Editorial Lead", photo: "/team/nea-ningtyas.png" },
      { name: "Yosifebi Ramadhani", role: "Strategic Communications Lead", photo: "/team/yosifebi-ramadhani.png" },
      { name: "Adji P. I. Pratama", role: "Video and Social Media Lead", photo: "/team/adji-pratama.png" },
    ],
  },
  {
    unit: "Convening",
    members: [
      { name: "Gigay Citta A.", role: "Head of Convening", photo: "/team/gigay-citta.png" },
      { name: "Aloysius Efraim Leonard", role: "Deputy Head of Convening", photo: "/team/aloysius-efraim.png" },
    ],
  },
  {
    unit: "Advisory",
    members: [
      { name: "Try Luthfi Nugroho", role: "Head of Advisory", photo: "/team/try-luthfi.png" },
      { name: "Talitha Dwitiyasih", role: "Climate Advisory Lead", photo: "/team/talitha-dwitiyasih.png" },
    ],
  },
  {
    unit: "Partnership",
    members: [
      { name: "Aditya Purnomo Aji", role: "Head of Project & Partnership", photo: "/team/aditya-purnomo.png" },
    ],
  },
  {
    unit: "PMEL",
    members: [
      { name: "Hanindita A. Putri", role: "Senior Planning, Monitoring, Evaluation, and Learning (PMEL) Coordinator", photo: "/team/hanindita-putri.png" },
      { name: "Archandra V. Sugama", role: "Senior Partnership Coordinator", photo: "/team/archandra-sugama.png" },
    ],
  },
  {
    unit: "Finance",
    members: [
      { name: "Ursula A. Stephania", role: "Finance Lead", photo: "/team/ursula-stephania.png" },
    ],
  },
  {
    unit: "HR",
    members: [
      { name: "Aphrodita Kuncoro", role: "Human Resources (HR) Lead", photo: "/team/aphrodita-kuncoro.png" },
    ],
  },
];

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="group">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F4F5F3]">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-4 text-[14px] font-semibold text-[#18181B] font-inter">
        {person.name}
      </h3>
      <p className="mt-1 text-[12.5px] leading-[18px] text-[#6B7280] font-inter">
        {person.role}
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-extrabold uppercase tracking-[1.08px] text-[#6B7280] font-manrope block">
      {children}
    </span>
  );
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-[#18181B] antialiased flex flex-col font-inter selection:bg-[#E5E7EB] selection:text-[#18181B]">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-24 pb-14 sm:pb-16">
          <SectionLabel>About Us</SectionLabel>
          <h1 className="mt-4 font-iowan text-[30px] sm:text-[38px] lg:text-[44px] text-[#151515] font-normal leading-[120%] tracking-tight max-w-[840px]">
            We are an interdisciplinary team committed to transforming
            Indonesia&apos;s public policy landscape for the better.
          </h1>
        </section>

        {/* MEET OUR TEAM — BOARD OF LEADERSHIP */}
        <section className="w-full border-t border-[#E5E7EB]">
          <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-14 sm:py-16">
            <SectionLabel>Meet Our Team</SectionLabel>
            <h2 className="mt-4 font-iowan text-[26px] sm:text-[32px] text-[#151515] font-normal leading-[120%] tracking-tight">
              Board of Leadership
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {LEADERSHIP.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </div>
          </div>
        </section>

        {/* OUR BRAINSTRUST */}
        <section className="w-full border-t border-[#E5E7EB]">
          <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-14 sm:py-16">
            <SectionLabel>Our Brainstrust</SectionLabel>
            <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="font-iowan text-[26px] sm:text-[32px] text-[#151515] font-normal leading-[120%] tracking-tight">
                Independent advice, on tap.
              </h2>
              <p className="text-[13px] leading-[20px] text-[#6B7280] font-inter max-w-[380px]">
                Distinguished experts who provide independent advice to our
                leadership. Non-executive, non-operational, and non-voting.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {BRAINSTRUST.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </div>
          </div>
        </section>

        {/* OUR TEAM — GROUPED BY UNIT */}
        <section className="w-full border-t border-[#E5E7EB]">
          <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-14 sm:py-16">
            <SectionLabel>Our Team</SectionLabel>
            <h2 className="mt-4 font-iowan text-[26px] sm:text-[32px] text-[#151515] font-normal leading-[120%] tracking-tight">
              The people behind the practice.
            </h2>

            <div className="mt-10">
              {TEAM_GROUPS.map((group) => (
                <div
                  key={group.unit}
                  className="border-t border-[#E5E7EB] py-10 first:mt-0 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-8"
                >
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#18181B] font-inter">
                      {group.unit}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {group.members.map((person) => (
                      <PersonCard key={person.name} person={person} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

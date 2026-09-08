import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Publications | Think Policy",
  description:
    "Ideas, evidence, and stories from the field — reports, policy briefs, and handbooks by Think Policy.",
};

const PUBLICATIONS = [
  {
    title: "Think Policy 2025 Recap: What we talk about when we talk about impact",
    subtitle:
      "Reflections from the desk of Planning, Monitoring, Evaluation, and Learning (PMEL) team",
    cover: "/publications/2025-recap.png",
  },
  {
    title: "How democratic is Indonesia's policy making process?",
    subtitle: "An analysis through the lens of supply and demand",
    cover: "/publications/democratic-policy-making.webp",
  },
  {
    title: "Co-Creating Indonesia's AI Future",
    subtitle:
      "Advancing Adaptive and Inclusive AI Governance Through Meaningful Policy Dialogues",
    cover: "/publications/ai-future.webp",
  },
  {
    title: "Menyelaraskan Arah Kebijakan dalam Mendukung Aksi Akar Rumput",
    subtitle:
      "Rekomendasi Kebijakan untuk Mendorong Literasi, Digitalisasi, dan Pembiayaan UMKM Ultra-Mikro",
    cover: "/publications/menyelaraskan-arah.webp",
  },
  {
    title: "Bijak Memantau: Ruang Partisipasi Kelas Menengah",
    subtitle: "Mengevaluasi Demokrasi Indonesia Melalui Lensa Ekosistem",
    cover: "/publications/bijak-memantau.webp",
  },
  {
    title: "GIZ x Think Policy Flagship Report: Indonesia in Transition",
    subtitle:
      "A Critical Overview of Indonesia's Climate Policy and Governance Post-2024 Election",
    cover: "/publications/giz-indonesia-in-transition.webp",
  },
  {
    title: "Menuju Transformasi Digital yang Bermakna",
    subtitle:
      "Refleksi Satu Dekade 2014–2024 dalam Perjalanan Digital Indonesia",
    cover: "/publications/transformasi-digital.webp",
  },
  {
    title: "Mainstreaming Inclusive Climate Action in Jakarta",
    subtitle:
      "A Policy Brief on Institutionalizing Equity in Jakarta's Climate Governance",
    cover: "/publications/inclusive-climate-jakarta.webp",
  },
  {
    title: "Think Policy Handbook",
    subtitle: "The Art of Understanding Public Policy for Beginners",
    cover: "/publications/think-policy-handbook.webp",
  },
];

export default function PublicationPage() {
  return (
    <div className="min-h-screen bg-white text-[#18181B] antialiased flex flex-col font-inter selection:bg-[#E5E7EB] selection:text-[#18181B]">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-24 pb-14 sm:pb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-[1.08px] text-[#6B7280] font-manrope block">
            Publications
          </span>
          <h1 className="mt-4 font-iowan text-[30px] sm:text-[38px] lg:text-[44px] text-[#151515] font-normal leading-[120%] tracking-tight max-w-[720px]">
            Ideas, evidence, and stories from the field.
          </h1>
          <p className="mt-6 text-[14px] sm:text-[15px] leading-[24px] text-[#52525B] font-inter max-w-[560px]">
            Reports, policy briefs, and handbooks — written to be used, not
            just read.
          </p>
        </section>

        {/* PUBLICATION GRID — homepage hairline language */}
        <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 pb-20 sm:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {PUBLICATIONS.map((pub) => (
              <div
                key={pub.title}
                className="relative pt-6 border-t border-[#E5E7EB] flex flex-col"
              >
                <Link href="#" className="group flex flex-col h-full">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F5F3] border border-[#E5E7EB]/60">
                    <Image
                      src={pub.cover}
                      alt={pub.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h2 className="mt-5 text-[15px] font-semibold leading-[21px] text-[#18181B] font-inter">
                    {pub.title}
                  </h2>
                  <p className="mt-2 text-[13px] leading-[19px] text-[#6B7280] font-inter">
                    {pub.subtitle}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

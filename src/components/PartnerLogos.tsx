import Image from "next/image";

interface LogoItem {
  src: string;
  alt: string;
  w: number;
  h: number;
}

// Real partner logos pulled from thinkpolicy.id ("Trusted by the public policy ecosystem")
const PARTNERS: LogoItem[] = [
  { src: "/partners/tular-nalar.png", alt: "Tular Nalar", w: 460, h: 304 },
  { src: "/partners/knowledge-sector-initiative.png", alt: "Knowledge Sector Initiative", w: 1020, h: 396 },
  { src: "/partners/karsa-city-lab.png", alt: "Karsa City Lab", w: 436, h: 436 },
  { src: "/partners/commslab.png", alt: "CommsLab", w: 968, h: 236 },
  { src: "/partners/bbbc.png", alt: "BBBC", w: 580, h: 380 },
  { src: "/partners/climate-imperative.png", alt: "Climate Imperative", w: 532, h: 356 },
  { src: "/partners/bicara-udara.png", alt: "Bicara Udara", w: 356, h: 304 },
  { src: "/partners/mindworks.png", alt: "Mindworks", w: 1072, h: 388 },
  { src: "/partners/unesco.png", alt: "UNESCO", w: 1828, h: 460 },
  { src: "/partners/monash-university.webp", alt: "Monash University", w: 892, h: 272 },
  { src: "/partners/instellar-impact.png", alt: "Instellar Impact", w: 1984, h: 880 },
  { src: "/partners/ideafest.png", alt: "IdeaFest", w: 1304, h: 468 },
  { src: "/partners/goto.png", alt: "Goto", w: 656, h: 272 },
  { src: "/partners/new-energy-nexus.webp", alt: "New Energy Nexus Indonesia", w: 266, h: 248 },
  { src: "/partners/who.webp", alt: "World Health Organization", w: 629, h: 192 },
  { src: "/partners/publish-what-you-pay.webp", alt: "Publish What You Pay", w: 642, h: 192 },
  { src: "/partners/ojk.webp", alt: "Otoritas Jasa Keuangan", w: 444, h: 192 },
  { src: "/partners/jsc.webp", alt: "Jakarta Smart City", w: 285, h: 192 },
  { src: "/partners/greenpeace.webp", alt: "Greenpeace", w: 487, h: 192 },
  { src: "/partners/data-science-indonesia.webp", alt: "Data Science Indonesia", w: 192, h: 192 },
  { src: "/partners/partner-lightbulb.webp", alt: "Think Policy partner", w: 199, h: 192 },
  { src: "/partners/setjen-dpr-ri.webp", alt: "Setjen DPR RI", w: 200, h: 192 },
  { src: "/partners/wri-indonesia.webp", alt: "WRI Indonesia", w: 982, h: 192 },
  { src: "/partners/pln.webp", alt: "PLN", w: 537, h: 192 },
  { src: "/partners/indonesian-youth-diplomacy.webp", alt: "Indonesian Youth Diplomacy", w: 442, h: 192 },
  { src: "/partners/ideafest-2023.webp", alt: "IdeaFest 2023", w: 191, h: 192 },
  { src: "/partners/google.webp", alt: "Google", w: 565, h: 192 },
  { src: "/partners/development-dialogue-asia.webp", alt: "Development Dialogue Asia", w: 344, h: 192 },
  { src: "/partners/british-council.webp", alt: "British Council", w: 670, h: 192 },
];

function LogoItems({ logos, keyPrefix }: { logos: LogoItem[]; keyPrefix: string }) {
  // Rendered twice so the -50% translateX loop is seamless
  const doubled = [...logos, ...logos];
  return (
    <>
      {doubled.map((logo, index) => (
        <Image
          key={`${keyPrefix}-${index}`}
          src={logo.src}
          alt={index < logos.length ? logo.alt : ""}
          aria-hidden={index >= logos.length}
          width={logo.w}
          height={logo.h}
          className="h-7 sm:h-8 w-auto shrink-0 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300"
        />
      ))}
    </>
  );
}

export default function PartnerLogos() {
  const half = Math.ceil(PARTNERS.length / 2);
  const rowTop = PARTNERS.slice(0, half);
  const rowBottom = PARTNERS.slice(half);

  return (
    <div className="w-full space-y-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      {/* Top row — scrolls left */}
      <div className="overflow-hidden">
        <div className="animate-marquee-left flex w-max items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
          <LogoItems logos={rowTop} keyPrefix="top" />
        </div>
      </div>

      {/* Bottom row — scrolls right */}
      <div className="overflow-hidden">
        <div className="animate-marquee-right flex w-max items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
          <LogoItems logos={rowBottom} keyPrefix="bottom" />
        </div>
      </div>
    </div>
  );
}

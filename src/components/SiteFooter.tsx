import Image from "next/image";
import Link from "next/link";

const PRESS_LINKS = ["The New York Times", "Forbes", "Al Jazeera", "Tempo"];
const SOCIAL_LINKS = ["Instagram", "LinkedIn", "X", "YouTube", "TikTok"];

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50 font-inter block">
      {children}
    </span>
  );
}

export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#120F0D] text-white relative overflow-hidden">
      {/* Full-bleed monochrome photo — clearly visible like the reference */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/footer-background.png"
          alt=""
          fill
          className="object-cover object-center opacity-45 mix-blend-luminosity"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Full-height vertical hairlines (column grid, the reference's signature) */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full max-w-[1280px] h-full mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 h-full">
            <div className="border-l border-white/[0.07]" />
            <div className="border-l border-white/[0.07]" />
            <div className="border-l border-white/[0.07] hidden lg:block" />
            <div className="border-l border-white/[0.07] border-r hidden lg:block" />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 min-h-[92vh] flex flex-col">
        {/* -------------------------------------------------- */}
        {/* TOP ROW — aligned to the same 4-column grid        */}
        {/* -------------------------------------------------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 py-10">
          <div>
            <Link href="/" aria-label="Think Policy Home" className="inline-block">
              <Image
                src="/logo-symbol.svg"
                alt="Think Policy Logo"
                width={22}
                height={22}
                className="w-[22px] h-[22px] object-contain brightness-0 invert"
              />
            </Link>
          </div>
          <div>
            <p className="text-[13px] leading-[19px] text-white/80 font-inter max-w-[220px]">
              Moving complex policy challenges forward.
            </p>
          </div>
          <div className="hidden lg:block" />
          <div className="hidden lg:block">
            <div className="text-[13px] leading-[19px] text-white/80 font-inter">
              <p>hello@thinkpolicy.id</p>
              <p>Jakarta, EST 2021©</p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* MIDDLE — giant two-line CTA block, centered        */}
        {/* -------------------------------------------------- */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <h2 className="font-iowan text-[36px] sm:text-[52px] lg:text-[64px] font-normal leading-[1.05] text-white">
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
        {/* BOTTOM ROW — 4 lettered columns on the same grid   */}
        {/* -------------------------------------------------- */}
        <div className="border-t border-white/10">
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
            <div>
              <ColumnLabel>(b.) Legal</ColumnLabel>
              <div className="mt-8 space-y-1 text-[13px] leading-[20px] text-white/75 font-inter">
                <p>© 2026 Think Policy.</p>
                <p>Independent. Nonpartisan.</p>
              </div>
            </div>

            {/* (c.) NEWSLETTER */}
            <div>
              <ColumnLabel>(c.) Newsletter</ColumnLabel>
              <p className="mt-8 text-[13px] leading-[20px] text-white/75 font-inter max-w-[260px]">
                Get public policy insights in your inbox. No spam, just
                relevant stories.
              </p>
              <form action="#" className="mt-5 max-w-[260px]">
                <input
                  type="email"
                  placeholder="enter your email"
                  aria-label="Email address"
                  className="w-full bg-transparent border border-white/25 px-3 py-2.5 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors font-inter"
                />
                <button
                  type="submit"
                  className="mt-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white hover:text-white/60 transition-colors font-inter cursor-pointer"
                >
                  Join Now
                </button>
              </form>
            </div>

            {/* (d.) PRESS */}
            <div>
              <ColumnLabel>(d.) Press</ColumnLabel>
              <ul className="mt-8 space-y-1 text-[13px] leading-[20px] text-white/75 font-inter">
                {PRESS_LINKS.map((label) => (
                  <li key={label}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-6 space-y-1 text-[13px] leading-[20px] text-white/50 font-inter">
                {SOCIAL_LINKS.map((label) => (
                  <li key={label}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

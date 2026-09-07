import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#120F0D] text-white relative overflow-hidden">
      {/* Background Image: cinematic audience looking upward */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/footer-background.png"
          alt=""
          fill
          priority={false}
          className="object-cover object-bottom opacity-40 mix-blend-luminosity"
        />
        {/* Cinematic gradient overlay ensuring text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/70 to-[#120F0D]/90" />
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        {/* CTA Block */}
        <div className="pt-20 sm:pt-24 pb-16 text-center space-y-10">
          <h2 className="font-iowan text-[32px] sm:text-[44px] font-normal leading-[115%] text-white">
            Ready to create{" "}
            <em className="italic text-[#A9CBA4]">impact?</em>
          </h2>
          <div>
            <Link
              href="#"
              className="inline-block bg-white px-10 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#18181B] hover:bg-neutral-200 transition-colors font-inter rounded-xs"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Address Block */}
        <div className="border-t border-white/10 py-14 text-center space-y-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9CA3AF] font-inter block">
            Think Policy
          </span>
          <p className="mx-auto max-w-[560px] text-[14px] leading-[24px] text-[#C9C4BF] font-inter">
            Gedung Victoria, Level 3, Jalan Sultan Hasanudin No. 47–51,
            RT.6/RW.2, Melawai, Kec. Kebayoran Baru, Kota Jakarta Selatan,
            Daerah Khusus Ibukota Jakarta 12160, Indonesia
          </p>
        </div>

        {/* Brand + Socials */}
        <div className="border-t border-white/10 py-10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Think Policy Home">
            <Image
              src="/logo-symbol.svg"
              alt="Think Policy Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain brightness-0 invert"
            />
            <span className="font-iowan text-[18px] text-white">Think Policy</span>
          </Link>

          <div className="flex items-center gap-3">
            {[
              { label: "X", href: "#" },
              { label: "in", href: "#" },
              { label: "IG", href: "#" },
              { label: "YT", href: "#" },
              { label: "TT", href: "#" },
            ].map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-[11px] font-medium text-white/80 hover:text-white hover:border-white/40 transition-colors font-inter"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-6">
          <p className="text-[12px] text-[#9CA3AF] font-inter">
            © 2026 Think Policy. Independent. Nonpartisan.
          </p>
        </div>
      </div>
    </footer>
  );
}

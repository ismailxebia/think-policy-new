"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

export default function SiteHeader() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {/* TOP ANNOUNCEMENT BANNER */}
      {showBanner && (
        <div className="bg-[#18181B] text-white text-xs py-2 px-4 flex items-center justify-between z-50 border-b border-black font-inter">
          <div className="w-6" />
          <div className="text-center font-medium tracking-wide">
            Try out ThinkPolicy : Ready to create impact?
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN NAVBAR */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-40 font-inter">
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 h-14 flex items-center justify-between">
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
              href="/use-case/c40"
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
    </>
  );
}

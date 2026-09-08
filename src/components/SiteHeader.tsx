"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/Button";

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
              <Link href="/where-we-work" className="hover:text-[#18181B] transition-colors">Where We Work</Link>
              <Link href="/reformist" className="inline-flex items-center gap-1.5 hover:text-[#18181B] transition-colors">
                <span>The Reformist</span>
                <span className="px-[4px] py-[3px] text-[9.5px] font-bold font-inter tracking-wider uppercase text-[#18181B] bg-[#f6c194] rounded-full leading-none">
                  NEW
                </span>
              </Link>
              <Link href="/about-us" className="hover:text-[#18181B] transition-colors">About Us</Link>
            </nav>
          </div>

          {/* Right: Portfolio, Join Us */}
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="sm" href="/use-case/c40">
              Portfolio
            </Button>

            <Button variant="primary" size="sm" href="/join">
              Join Us
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

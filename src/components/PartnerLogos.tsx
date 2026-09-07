import React from "react";

interface LogoItemProps {
  name: string;
  icon?: React.ReactNode;
  customRender?: React.ReactNode;
}

export default function PartnerLogos() {
  return (
    <div className="w-full max-w-[1180px] mx-auto">
      {/* Row 1 */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 md:gap-x-16 gap-y-7 mb-7 text-[#71717A]">
        {/* Runlayer */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 0L14 9L23 7L16 13L21 21L12 16L3 21L8 13L1 7L10 9L12 0Z" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight">Runlayer</span>
        </div>

        {/* Omnea */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 stroke-current fill-none stroke-2 shrink-0" viewBox="0 0 24 24">
            <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" strokeLinecap="round" />
            <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4" strokeLinecap="round" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight">Omnea</span>
        </div>

        {/* Rho */}
        <div className="flex items-center text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-serif font-bold text-[19px] tracking-tight italic pr-0.5">Rho</span>
        </div>

        {/* Antimetal */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <circle cx="12" cy="4" r="2.5" />
            <circle cx="5" cy="16" r="2.5" />
            <circle cx="19" cy="16" r="2.5" />
            <circle cx="12" cy="13" r="2.5" />
          </svg>
          <span className="font-medium text-[15px] tracking-tight">Antimetal</span>
        </div>

        {/* AgentMail */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.5 1.5l6.5 4.875 6.5-4.875H5.5zm14.5 1.5l-8 6-8-6V18h16V9z" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight">AgentMail</span>
        </div>

        {/* Finch */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M21.5 6.5c-2 .5-4 0-5.5-.5-1.5 2-4.5 3.5-7.5 3-1.5-.2-2.8-.8-3.5-1.5C3.5 10 3 13 4 16c1.5 4.5 6 6.5 10.5 5 4.5-1.5 7-5.5 7-14.5z" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight">Finch</span>
        </div>

        {/* Warp */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-[15px] tracking-tight">warp</span>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 md:gap-x-16 gap-y-7 mb-7 text-[#71717A]">
        {/* David AI */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-extrabold text-[15px] tracking-tight">David AI</span>
        </div>

        {/* Affiniti */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <div className="w-4 h-4 rounded-xs border border-current flex items-center justify-center overflow-hidden">
            <div className="w-5 h-0.5 bg-current rotate-45" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight">Affiniti</span>
        </div>

        {/* Warp repeated */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-[15px] tracking-tight">warp</span>
        </div>

        {/* Endex */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <rect x="2" y="2" width="8" height="8" rx="1.5" />
            <rect x="14" y="2" width="8" height="8" rx="1.5" />
            <rect x="2" y="14" width="8" height="8" rx="1.5" />
            <rect x="14" y="14" width="8" height="8" rx="1.5" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight">Endex</span>
        </div>

        {/* Liquid */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-3.5 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span className="font-bold text-[15px] tracking-tight">Liquid</span>
        </div>

        {/* Liquid */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-3.5 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span className="font-bold text-[15px] tracking-tight">Liquid</span>
        </div>

        {/* Default */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 stroke-current fill-none stroke-2 shrink-0" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 15L15 9M15 9H9M15 9V15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight">Default</span>
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 md:gap-x-16 gap-y-7 text-[#71717A]">
        {/* Conduit Health */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 stroke-current fill-none stroke-2 shrink-0" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeDasharray="14 6" />
          </svg>
          <span className="font-medium text-[15px] tracking-tight">Conduit Health</span>
        </div>

        {/* AUCTOR */}
        <div className="flex items-center text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-serif font-black text-[15px] tracking-[2px] uppercase">AUCTOR</span>
        </div>

        {/* VINESIGHT */}
        <div className="flex items-center text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-sans font-semibold text-[14px] tracking-[2.5px] uppercase">VINESIGHT</span>
        </div>

        {/* Harmonic */}
        <div className="flex items-center gap-2 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <circle cx="8" cy="8" r="3.5" />
            <circle cx="16" cy="8" r="3.5" />
            <circle cx="12" cy="16" r="3.5" />
          </svg>
          <span className="font-medium text-[15px] tracking-tight">Harmonic</span>
        </div>

        {/* zingage */}
        <div className="flex items-center text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-sans font-bold text-[16px] tracking-tight lowercase">zingage</span>
        </div>

        {/* Footprint */}
        <div className="flex items-center gap-1.5 text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-black text-[17px] font-sans">F</span>
          <span className="font-semibold text-[15px] tracking-tight">Footprint</span>
        </div>

        {/* hud */}
        <div className="flex items-center text-[#71717A] hover:text-[#18181B] transition-colors duration-200">
          <span className="font-serif font-bold text-[17px] tracking-tight lowercase">hud</span>
        </div>
      </div>
    </div>
  );
}

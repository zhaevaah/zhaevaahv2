"use client";

import React from "react";

export default function HeroSkeleton() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#FAF9F7] skeleton-shimmer min-h-[560px] sm:min-h-[600px] md:min-h-[640px] lg:min-h-[700px] flex flex-col justify-end md:justify-center animate-pulse"
      aria-hidden="true"
    >
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:py-20">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow */}
          <div className="h-3 sm:h-3.5 w-44 bg-[#E5DFD4] rounded-xs mb-3 sm:mb-4 skeleton-shimmer" />

          {/* Title */}
          <div className="h-8 sm:h-12 md:h-14 w-full sm:w-4/5 bg-[#DFD8CB] rounded-xs mb-2 sm:mb-3 skeleton-shimmer" />
          <div className="h-8 sm:h-12 md:h-14 w-3/4 sm:w-2/3 bg-[#DFD8CB] rounded-xs mb-4 sm:mb-6 skeleton-shimmer" />

          {/* Subtitle */}
          <div className="h-3.5 sm:h-4 w-4/5 bg-[#E8E2D6] rounded-xs mb-2 skeleton-shimmer" />
          <div className="h-3.5 sm:h-4 w-1/2 bg-[#E8E2D6] rounded-xs mb-6 sm:mb-8 skeleton-shimmer" />

          {/* Button */}
          <div className="h-10 sm:h-12 w-36 sm:w-44 bg-[#D6CEBF] rounded-xs skeleton-shimmer" />
        </div>
      </div>
    </section>
  );
}

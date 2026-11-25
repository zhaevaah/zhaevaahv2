"use client";

import React from "react";

export default function CategoryGridSkeleton() {
  return (
    <section className="w-full py-6 sm:py-10 md:py-16 bg-white animate-pulse" aria-hidden="true">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
          
          {/* Left Tall Card Skeleton */}
          <div className="md:col-span-6 bg-[#F5F2EB] skeleton-shimmer rounded-xs min-h-[190px] sm:min-h-[280px] md:min-h-[480px] p-6 sm:p-10 flex flex-col justify-end">
            <div className="h-3 w-28 bg-[#E5DFD4] rounded-xs mb-3 skeleton-shimmer" />
            <div className="h-6 sm:h-8 w-3/4 bg-[#DFD8CB] rounded-xs mb-4 skeleton-shimmer" />
            <div className="h-4 w-24 bg-[#E5DFD4] rounded-xs skeleton-shimmer" />
          </div>

          {/* Right Column: 2 stacked landscape card skeletons */}
          <div className="md:col-span-6 flex flex-col gap-3 sm:gap-6">
            <div className="bg-[#F5F2EB] skeleton-shimmer rounded-xs min-h-[140px] sm:min-h-[190px] md:min-h-[228px] p-6 flex flex-col justify-center">
              <div className="h-3 w-24 bg-[#E5DFD4] rounded-xs mb-2 skeleton-shimmer" />
              <div className="h-5 sm:h-7 w-2/3 bg-[#DFD8CB] rounded-xs mb-3 skeleton-shimmer" />
              <div className="h-3.5 w-20 bg-[#E5DFD4] rounded-xs skeleton-shimmer" />
            </div>

            <div className="bg-[#F5F2EB] skeleton-shimmer rounded-xs min-h-[140px] sm:min-h-[190px] md:min-h-[228px] p-6 flex flex-col justify-center">
              <div className="h-3 w-24 bg-[#E5DFD4] rounded-xs mb-2 skeleton-shimmer" />
              <div className="h-5 sm:h-7 w-2/3 bg-[#DFD8CB] rounded-xs mb-3 skeleton-shimmer" />
              <div className="h-3.5 w-20 bg-[#E5DFD4] rounded-xs skeleton-shimmer" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";

interface ProductCardSkeletonProps {
  className?: string;
}

export default function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col bg-white text-center rounded-xl sm:rounded-2xl overflow-hidden border border-[#EAE3D5] animate-pulse shadow-none ${className}`}
      aria-hidden="true"
    >
      {/* ── Image Area Skeleton: Touches Top, Left, and Right Borders ── */}
      <div className="relative aspect-square w-full bg-[#FAF9F7] flex items-center justify-center p-2.5">
        {/* Placeholder Percentage Offer Badge Top-Left */}
        <div className="absolute top-2 left-2 z-10">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E5DFD4] border border-[#DDD5C7]/40 shadow-none" />
        </div>

        {/* Placeholder Floating Actions Top-Right */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 sm:gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E5DFD4] shadow-none" />
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E5DFD4] shadow-none" />
        </div>

        {/* Center Jewellery Silhouette Icon */}
        <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#E8E2D6]/60 border border-[#E0D8CB]/50" />
      </div>

      {/* ── Product Info Skeleton ── */}
      <div className="p-2 sm:p-2.5 pb-2.5 flex flex-col items-center w-full">
        {/* Title Line 1 */}
        <div className="h-3 sm:h-3.5 w-4/5 bg-[#E8E2D7] rounded-xs mb-1 skeleton-shimmer" />
        {/* Title Line 2 */}
        <div className="h-2.5 sm:h-3 w-3/5 bg-[#E8E2D7] rounded-xs mb-1.5 hidden sm:block skeleton-shimmer" />

        {/* Stars */}
        <div className="h-2 sm:h-2.5 w-14 sm:w-16 bg-[#E8E2D7] rounded-xs mb-1.5 skeleton-shimmer" />

        {/* Price & Original Price */}
        <div className="flex items-center justify-center gap-1.5 mb-1 w-full">
          <div className="h-3 sm:h-3.5 w-16 sm:w-20 bg-[#E0D7C8] rounded-xs skeleton-shimmer" />
          <div className="h-2.5 sm:h-3 w-10 bg-[#EBE5D9] rounded-xs skeleton-shimmer hidden xs:block" />
        </div>

        {/* Stock Status Indicator */}
        <div className="h-2 sm:h-2.5 w-20 sm:w-24 bg-[#E5DFD4] rounded-xs skeleton-shimmer mt-0.5" />

        {/* Mobile Button Skeleton */}
        <div className="mt-2 w-full sm:hidden">
          <div className="h-5 w-full bg-[#E8E2D6] rounded-xs skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface ProductCardSkeletonProps {
  className?: string;
}

export default function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col bg-white text-center rounded-xs overflow-hidden border border-[#F2ECE4] animate-pulse ${className}`}
      aria-hidden="true"
    >
      {/* ── Image Area Skeleton ── */}
      <div className="relative aspect-square w-full bg-[#F3EFE8] skeleton-shimmer flex items-center justify-center p-3">
        {/* Placeholder Percentage Offer Badge Top-Left */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#E5DFD4] border border-[#DDD5C7]/40 shadow-xs" />
        </div>

        {/* Placeholder Floating Actions Top-Right */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex flex-col gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E5DFD4] shadow-xs" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E5DFD4] shadow-xs" />
        </div>

        {/* Center Jewellery Silhouette Icon */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#E8E2D6]/60 border border-[#E0D8CB]/50" />
      </div>

      {/* ── Product Info Skeleton ── */}
      <div className="pt-3 sm:pt-4 pb-2.5 sm:pb-3 px-2 flex flex-col items-center w-full">
        {/* Title Line 1 */}
        <div className="h-3 sm:h-3.5 w-4/5 bg-[#E8E2D7] rounded-xs mb-1.5 skeleton-shimmer" />
        {/* Title Line 2 */}
        <div className="h-2.5 sm:h-3 w-3/5 bg-[#E8E2D7] rounded-xs mb-2 hidden sm:block skeleton-shimmer" />

        {/* Stars */}
        <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-[#E8E2D7] rounded-xs mb-2 skeleton-shimmer" />

        {/* Price & Original Price */}
        <div className="flex items-center justify-center gap-2 mb-1.5 w-full">
          <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-[#E0D7C8] rounded-xs skeleton-shimmer" />
          <div className="h-2.5 sm:h-3 w-12 bg-[#EBE5D9] rounded-xs skeleton-shimmer hidden xs:block" />
        </div>

        {/* Stock Status Indicator */}
        <div className="h-2.5 sm:h-3 w-24 sm:w-28 bg-[#E5DFD4] rounded-xs skeleton-shimmer mt-0.5" />

        {/* Mobile Button Skeleton */}
        <div className="mt-2 w-full sm:hidden">
          <div className="h-6 w-full bg-[#E8E2D6] rounded-xs skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

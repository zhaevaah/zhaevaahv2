import React from "react";
import ProductGridSkeleton from "../../components/skeletons/ProductGridSkeleton";

export default function TopDealsLoading() {
  return (
    <div className="w-full min-h-screen bg-[#FAF9F7]" aria-busy="true">
      {/* Top Banner Skeleton Bar */}
      <div className="w-full h-9 bg-[#B8933F]/90" />

      {/* Header Skeleton Bar */}
      <div className="w-full h-16 md:h-[72px] bg-white border-b border-[#F0ECE5] flex items-center justify-between px-4 sm:px-8">
        <div className="h-8 w-32 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
        <div className="hidden lg:flex gap-6">
          <div className="h-4 w-14 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
          <div className="h-4 w-16 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
          <div className="h-4 w-20 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
        </div>
        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-[#EAE4D6] skeleton-shimmer" />
          <div className="w-6 h-6 rounded-full bg-[#EAE4D6] skeleton-shimmer" />
        </div>
      </div>

      {/* Top Deals Hero Banner Skeleton */}
      <div className="bg-[#1C1208] text-white py-12 sm:py-16 border-b border-[#3D2E20] animate-pulse">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="h-6 w-48 bg-[#33251A] rounded-full skeleton-shimmer" />
              <div className="h-10 sm:h-14 w-4/5 bg-[#33251A] rounded-xs skeleton-shimmer" />
              <div className="h-4 w-full max-w-lg bg-[#2A1D13] rounded-xs skeleton-shimmer" />
              <div className="h-24 w-full max-w-md bg-[#251A10] rounded-xs skeleton-shimmer" />
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="h-56 w-full max-w-md bg-[#251A10] border border-[#B8933F]/30 rounded-xs skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-full bg-[#EAE4D6] skeleton-shimmer" />
          ))}
        </div>

        {/* Product Cards Skeleton */}
        <ProductGridSkeleton count={8} cols={4} />
      </div>
    </div>
  );
}

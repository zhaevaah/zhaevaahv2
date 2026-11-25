import React from "react";
import HeroSkeleton from "../components/skeletons/HeroSkeleton";
import CategoryGridSkeleton from "../components/skeletons/CategoryGridSkeleton";
import ProductGridSkeleton from "../components/skeletons/ProductGridSkeleton";

export default function HomeLoading() {
  return (
    <div className="w-full min-h-screen bg-white animate-pulse" aria-busy="true">
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

      {/* Hero Section Skeleton */}
      <HeroSkeleton />

      {/* Category Grid Section Skeleton */}
      <CategoryGridSkeleton />

      {/* Latest Products Skeleton */}
      <section className="w-full py-10 sm:py-16 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <div className="h-7 sm:h-9 w-48 bg-[#DFD8CB] rounded-xs mx-auto mb-2 skeleton-shimmer" />
            <div className="h-3.5 w-64 bg-[#EAE4D6] rounded-xs mx-auto skeleton-shimmer" />
          </div>
          <ProductGridSkeleton count={4} cols={4} />
        </div>
      </section>

      {/* Top Products Skeleton */}
      <section className="w-full py-10 sm:py-16 bg-[#FAF9F7] border-t border-[#F0ECE5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <div className="h-7 sm:h-9 w-44 bg-[#DFD8CB] rounded-xs mx-auto mb-2 skeleton-shimmer" />
            <div className="h-3.5 w-56 bg-[#EAE4D6] rounded-xs mx-auto skeleton-shimmer" />
          </div>
          <ProductGridSkeleton count={4} cols={4} />
        </div>
      </section>
    </div>
  );
}

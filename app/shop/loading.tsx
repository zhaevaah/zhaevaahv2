import React from "react";
import ProductGridSkeleton from "../../components/skeletons/ProductGridSkeleton";

export default function ShopLoading() {
  return (
    <div className="w-full min-h-screen bg-white" aria-busy="true">
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

      {/* Main Shop Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Filter Sidebar Skeleton (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 animate-pulse">
            <div className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-5 space-y-4">
              <div className="h-4 w-24 bg-[#DFD8CB] rounded-xs skeleton-shimmer mb-4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 w-32 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
                  <div className="h-3 w-6 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
                </div>
              ))}
            </div>

            <div className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-5 space-y-4">
              <div className="h-4 w-20 bg-[#DFD8CB] rounded-xs skeleton-shimmer mb-4" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 w-28 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
                  <div className="h-3 w-6 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-9">
            {/* Top Bar Skeleton */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#EAE3D5]">
              <div className="h-4 w-40 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
              <div className="h-8 w-36 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs skeleton-shimmer" />
            </div>

            {/* Product Card Skeletons */}
            <ProductGridSkeleton count={8} cols={4} />
          </div>

        </div>
      </div>
    </div>
  );
}

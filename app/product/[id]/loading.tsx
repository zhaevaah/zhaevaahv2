import React from "react";
import ProductDetailSkeleton from "../../../components/skeletons/ProductDetailSkeleton";

export default function ProductLoading() {
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

      {/* Product Detail Skeleton View */}
      <main className="flex-1">
        <ProductDetailSkeleton />
      </main>
    </div>
  );
}

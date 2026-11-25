"use client";

import React from "react";

export default function ProductDetailSkeleton() {
  return (
    <div className="w-full bg-white pt-6 pb-12 animate-pulse" aria-hidden="true">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Gallery & Value Strip Skeleton */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-2.5 order-2 sm:order-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xs bg-[#F5F2EB] skeleton-shimmer border border-[#EAE3D5]"
                  />
                ))}
              </div>

              {/* Main Preview Image */}
              <div className="order-1 sm:order-2 flex-1 w-full bg-[#FAF8F5] skeleton-shimmer rounded-xs border border-[#EAE6DF] aspect-square flex items-center justify-center p-8">
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-[#EAE4D6]/60" />
              </div>
            </div>

            {/* Value Strip */}
            <div className="mt-6 grid grid-cols-3 border border-[#EAE3D5] rounded-xs divide-x divide-[#EAE3D5] py-3.5 px-2 bg-[#FAF8F5]">
              <div className="h-4 bg-[#EAE4D6] rounded-xs mx-3 skeleton-shimmer" />
              <div className="h-4 bg-[#EAE4D6] rounded-xs mx-3 skeleton-shimmer" />
              <div className="h-4 bg-[#EAE4D6] rounded-xs mx-3 skeleton-shimmer" />
            </div>
          </div>

          {/* Right Column: Product Info & Actions Skeleton */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Brand */}
            <div className="h-3 w-24 bg-[#E5DFD4] rounded-xs mb-2 skeleton-shimmer" />

            {/* Title */}
            <div className="h-7 sm:h-9 w-4/5 bg-[#DFD8CB] rounded-xs mb-2 skeleton-shimmer" />
            <div className="h-7 sm:h-9 w-3/5 bg-[#DFD8CB] rounded-xs mb-4 skeleton-shimmer" />

            {/* Price & Rating */}
            <div className="flex items-center gap-4 mb-3">
              <div className="h-8 w-36 bg-[#E0D7C8] rounded-xs skeleton-shimmer" />
              <div className="h-4 w-28 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
            </div>

            {/* Stock status badge */}
            <div className="h-6 w-52 bg-[#E8F5E9] rounded-full mb-4 skeleton-shimmer" />

            {/* Short specs */}
            <div className="space-y-2 mb-6">
              <div className="h-3 w-full bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
              <div className="h-3 w-5/6 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
              <div className="h-3 w-3/4 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
            </div>

            {/* Swatches */}
            <div className="mb-5">
              <div className="h-3 w-28 bg-[#E5DFD4] rounded-xs mb-2 skeleton-shimmer" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-xs bg-[#EAE4D6] skeleton-shimmer" />
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="h-12 w-full sm:w-32 bg-[#EAE4D6] rounded-xs skeleton-shimmer" />
              <div className="h-12 flex-1 bg-[#D6CEBF] rounded-xs skeleton-shimmer" />
            </div>

            {/* Buy Now Button */}
            <div className="h-12 w-full bg-[#33281D] rounded-xs mb-6 skeleton-shimmer" />

            {/* Vault Meter */}
            <div className="h-16 w-full bg-[#FAF8F5] border border-[#EAE3D5] rounded-xs skeleton-shimmer" />
          </div>

        </div>
      </div>
    </div>
  );
}

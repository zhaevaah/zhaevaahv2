"use client";

import React from "react";

export default function HeroSkeleton() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#FAF9F7] aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] skeleton-shimmer animate-pulse"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#EFECE6]" />
    </section>
  );
}

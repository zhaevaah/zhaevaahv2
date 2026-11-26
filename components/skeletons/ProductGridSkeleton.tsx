"use client";

import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridSkeletonProps {
  count?: number;
  cols?: 3 | 4 | 5;
  className?: string;
}

export default function ProductGridSkeleton({
  count = 8,
  cols = 4,
  className = "",
}: ProductGridSkeletonProps) {
  return (
    <div
      className={`grid gap-2.5 sm:gap-3.5 lg:gap-4 ${
        cols === 3
          ? "grid-cols-2 lg:grid-cols-3"
          : cols === 5
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      } ${className}`}
      aria-label="Loading products"
      aria-busy="true"
    >
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

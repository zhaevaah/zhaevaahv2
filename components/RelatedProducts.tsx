"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../redux/hooks";

export default function RelatedProducts() {
  const allProducts = useAppSelector((state) => state.products.items);
  const relatedProducts = useAppSelector((state) => state.products.relatedProducts);
  const productsToDisplay = relatedProducts.length > 0 ? relatedProducts : allProducts.slice(0, 4);

  // If no real products are available from the database, do not render dummy data
  if (productsToDisplay.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-white border-t border-[#EAE6DF]">
      <div className="max-w-[1360px] mx-auto px-2.5 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#B8933F] font-semibold block mb-1">
            Curated For You
          </span>
          <h2 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1208]">
            Related Products
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
          {productsToDisplay.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}

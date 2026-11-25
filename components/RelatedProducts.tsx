"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { LATEST_PRODUCTS } from "../data/products";

export default function RelatedProducts() {
  return (
    <section className="w-full py-14 sm:py-16 bg-[#FAF9F7] border-t border-[#EAE6DF]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#B8933F] font-semibold block mb-1">
            Curated For You
          </span>
          <h2 className="font-montserrat text-2xl sm:text-3xl font-medium text-[#1C1208]">
            Related Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {LATEST_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}


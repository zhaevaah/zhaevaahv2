"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";

export default function TopProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);

  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 20 }));
    }
  }, [dispatch, products.length]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    setIsLoading(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setIsLoading(false);
    }, 240);
  };

  function tabIdToCategory(id: string) {
    if (id === "necklace") return "necklace";
    if (id === "ring") return "ring";
    if (id === "bracelet") return "bracelet";
    if (id === "pendant") return "pendant";
    return id;
  }

  const filtered =
    activeTab === "all"
      ? products.slice(0, 10)
      : products.filter((p) =>
          p.category?.toLowerCase().includes(tabIdToCategory(activeTab))
        ).slice(0, 10);

  return (
    <section id="top-products" className="w-full py-8 sm:py-12 lg:py-20 bg-[#FAF9F7] border-t border-[#f0ece5]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#1C1208] tracking-tight mb-1.5 sm:mb-2.5">
            Top Products
          </h2>
          <p className="font-poppins text-xs sm:text-sm text-[#767069] font-light tracking-wide">
            Discover our most sought-after certified diamond and gold creations
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mt-4 sm:mt-6">
            {[
              { id: "all", label: "All Items" },
              { id: "necklace", label: "Necklaces" },
              { id: "ring", label: "Rings" },
              { id: "bracelet", label: "Bracelets" },
              { id: "pendant", label: "Pendants" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`text-[11px] sm:text-xs uppercase tracking-wider py-1 px-3 sm:py-1.5 sm:px-4 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#B8933F] text-white font-medium shadow-xs"
                    : "bg-white text-[#6E675F] border border-[#E5DFD5] hover:border-[#B8933F] hover:text-[#B8933F]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Mobile, 3-Col Tablet, 5-Column Desktop Product Grid */}
        {isLoading || (status === "loading" && products.length === 0) ? (
          <ProductGridSkeleton count={10} cols={5} />
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#767069]">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id || (product as any).slug} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

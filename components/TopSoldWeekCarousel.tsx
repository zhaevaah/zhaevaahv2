"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";

export default function TopSoldWeekCarousel() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 20 }));
    }
  }, [dispatch, products.length]);

  const weekProducts = products.length >= 8 ? products.slice(4, 12) : products;

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section id="top-sold-week" className="w-full py-8 sm:py-12 md:py-16 bg-[#FBF9F6]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Main Highlight Banner */}
        <div className="relative w-full bg-white rounded-xs border border-[#eae6de] overflow-hidden min-h-[220px] sm:min-h-[340px] md:min-h-[440px] flex items-center mb-8 sm:mb-12 shadow-xs">
          <div className="absolute inset-0">
            <Image
              src="/images/drop_cut_blue_banner.jpg"
              alt="Drop Cut Blue Necklace With Earrings Set"
              fill
              className="object-cover object-left md:object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-white/95 md:to-white/90" />
          </div>

          <div className="relative z-10 ml-auto w-full max-w-[240px] sm:max-w-[380px] lg:max-w-[480px] p-4 sm:p-8 lg:p-14 text-right md:text-left flex flex-col justify-center">
            <span className="font-poppins text-[10px] sm:text-xs uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1.5 sm:mb-3">
              THIS WEEK&apos;S HIGHLIGHTS
            </span>
            <h2 className="font-serif-luxury text-base sm:text-2xl lg:text-[40px] font-bold text-[#1C1208] leading-[1.2] mb-2 sm:mb-4 tracking-tight">
              Drop Cut Blue Necklace With Earrings Set
            </h2>
            <p className="font-poppins text-[11px] sm:text-xs md:text-sm text-[#6E675F] font-light max-w-sm mb-4 sm:mb-7 leading-relaxed line-clamp-2 sm:line-clamp-none">
              Awesome Products For The Dynamic Urban Lifestyle
            </p>
            <div className="flex justify-end md:justify-start">
              <Link
                href="/shop?category=Necklaces%20%26%20Pendants"
                className="inline-flex items-center gap-2 bg-[#B8933F] hover:bg-[#9E792B] text-white font-poppins text-[10px] sm:text-xs uppercase font-medium tracking-[0.18em] px-4 py-2 sm:px-7 sm:py-3.5 rounded-xs transition-colors shadow-sm"
              >
                <span>SHOP NOW</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Carousel Header & Carousel Controls */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <span className="font-poppins text-[10px] sm:text-xs uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1">
              CURATED WEEKLY SELECTION
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1208] tracking-tight">
              Top Sold Product Of This Week
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous slide"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D6CEC1] bg-white text-[#1C1208] hover:bg-[#B8933F] hover:text-white hover:border-[#B8933F] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next slide"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D6CEC1] bg-white text-[#1C1208] hover:bg-[#B8933F] hover:text-white hover:border-[#B8933F] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 3. Horizontal Scrollable Product Track */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {status === "loading" && weekProducts.length === 0
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[200px] sm:min-w-[260px] md:min-w-[280px] flex-shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))
            : weekProducts.map((product) => (
                <div
                  key={product.id || (product as any).slug}
                  className="min-w-[200px] sm:min-w-[260px] md:min-w-[280px] flex-shrink-0 flex"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}

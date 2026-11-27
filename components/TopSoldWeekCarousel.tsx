"use client";

import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <section id="top-sold-week" className="w-full py-8 sm:py-12 md:py-16 bg-[#FAF9F7] border-y border-[#EAE3D5]/80">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curated Carousel Header & Navigation Controls */}
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
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D6CEC1] bg-white text-[#1C1208] hover:bg-[#B8933F] hover:text-white hover:border-[#B8933F] flex items-center justify-center transition-all cursor-pointer shadow-none active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next slide"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D6CEC1] bg-white text-[#1C1208] hover:bg-[#B8933F] hover:text-white hover:border-[#B8933F] flex items-center justify-center transition-all cursor-pointer shadow-none active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Product Track (Scrollbars completely hidden) */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-3 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
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

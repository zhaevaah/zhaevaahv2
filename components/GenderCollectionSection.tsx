"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "./icons/GenderIcons";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchWomensProducts, fetchMensProducts } from "../redux/slices/productsSlice";

export default function GenderCollectionSection() {
  const dispatch = useAppDispatch();
  const womensList = useAppSelector((state) => state.products.womensItems);
  const mensList = useAppSelector((state) => state.products.mensItems);
  const status = useAppSelector((state) => state.products.status);

  useEffect(() => {
    if (womensList.length === 0) {
      dispatch(fetchWomensProducts({ limit: 8 }));
    }
    if (mensList.length === 0) {
      dispatch(fetchMensProducts({ limit: 8 }));
    }
  }, [dispatch, womensList.length, mensList.length]);

  const womenTrending = womensList.slice(0, 4);
  const menTrending = mensList.slice(0, 4);

  return (
    <section className="w-full py-10 sm:py-16 lg:py-20 bg-[#FAF9F7] border-y border-[#EAE3D5]/70">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================== */}
        {/* 1. WOMEN'S TRENDING PRODUCTS                                  */}
        {/* ============================================================== */}
        <div className="mb-14 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 border-b border-[#EAE3D5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B8933F]/10 border border-[#B8933F]/30 text-[#8C6D23] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-2">
                <FemaleSymbolIcon className="w-3.5 h-3.5 text-[#B8933F]" />
                <span>CURATED FOR HER</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208] tracking-tight">
                Trending in Women&apos;s Atelier
              </h2>
              <p className="text-xs sm:text-sm text-[#767069] font-light mt-1">
                Handcrafted with hallmarked BIS gold &amp; natural certified diamonds
              </p>
            </div>

            <Link
              href="/women"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8933F] hover:text-[#8C6D23] transition-colors group cursor-pointer shrink-0"
            >
              <span>Explore Women&apos;s Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {status === "loading" && womenTrending.length === 0 ? (
            <ProductGridSkeleton count={4} cols={4} />
          ) : womenTrending.length === 0 ? (
            <ProductGridSkeleton count={4} cols={4} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {womenTrending.map((product) => (
                <ProductCard key={product.id || (product as any).slug} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 2. MEN'S TRENDING PRODUCTS                                    */}
        {/* ============================================================== */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 border-b border-[#EAE3D5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1C1208]/10 border border-[#1C1208]/20 text-[#1C1208] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-2">
                <MaleSymbolIcon className="w-3.5 h-3.5 text-[#B8933F]" />
                <span>CURATED FOR HIM</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208] tracking-tight">
                Trending in Men&apos;s Collection
              </h2>
              <p className="text-xs sm:text-sm text-[#767069] font-light mt-1">
                Architectural silhouettes forged in hallmarked 18kt gold, platinum &amp; diamonds
              </p>
            </div>

            <Link
              href="/men"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8933F] hover:text-[#8C6D23] transition-colors group cursor-pointer shrink-0"
            >
              <span>Explore Men&apos;s Vault</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {status === "loading" && menTrending.length === 0 ? (
            <ProductGridSkeleton count={4} cols={4} />
          ) : menTrending.length === 0 ? (
            <ProductGridSkeleton count={4} cols={4} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {menTrending.map((product) => (
                <ProductCard key={product.id || (product as any).slug} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";

export default function LatestProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 12 }));
    }
  }, [dispatch, products.length]);

  const latestProducts = products.slice(0, 5);

  return (
    <section id="latest-products" className="w-full py-10 sm:py-14 md:py-18 bg-[#FAF9F7] border-y border-[#EAE3D5]/80">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#1C1208] tracking-tight mb-1.5 sm:mb-2.5">
            Latest Products
          </h2>
          <p className="text-xs sm:text-sm text-[#767069] font-light tracking-wide">
            Handcrafted luxury jewellery from our master artisans
          </p>
        </div>

        {/* 2-Column Mobile, 3-Col Tablet, 5-Column Desktop Grid */}
        {status === "loading" && latestProducts.length === 0 ? (
          <ProductGridSkeleton count={5} cols={5} />
        ) : latestProducts.length === 0 ? (
          <ProductGridSkeleton count={5} cols={5} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {latestProducts.map((product) => (
              <ProductCard key={product.id || (product as any).slug} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

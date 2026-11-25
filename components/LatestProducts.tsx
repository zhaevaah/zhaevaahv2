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

  const latestProducts = products.slice(0, 4);

  return (
    <section id="latest-products" className="w-full py-8 sm:py-12 lg:py-20 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 lg:mb-14">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#1C1208] tracking-tight mb-1.5 sm:mb-2.5">
            Latest Products
          </h2>
          <p className="text-xs sm:text-sm text-[#767069] font-light tracking-wide">
            Handcrafted luxury jewellery from our master artisans
          </p>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop Grid */}
        {status === "loading" && latestProducts.length === 0 ? (
          <ProductGridSkeleton count={4} cols={4} />
        ) : latestProducts.length === 0 ? (
          <ProductGridSkeleton count={4} cols={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {latestProducts.map((product) => (
              <ProductCard key={product.id || (product as any).slug} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

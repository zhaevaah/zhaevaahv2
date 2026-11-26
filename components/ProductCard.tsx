"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Check,
} from "lucide-react";
import { Product, useStore } from "../context/StoreContext";
import { getProductDiscountPercentage, getProductStock } from "../data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productLink = `/product/${(product as any).slug || product.id}`;
  const comparePrice = product.originalPrice || (product as any).compareAtPrice;

  const images = (product.additionalImages && product.additionalImages.length > 0)
    ? product.additionalImages
    : [product.primaryImage, product.hoverImage || product.primaryImage].filter(Boolean);

  const wishlisted = isInWishlist(product.id);
  const discountBadge = getProductDiscountPercentage(product);
  const stockCount = getProductStock(product);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Render 5 stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center justify-center gap-0.5 text-[#E69C24]">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = rating >= star;
          const isHalf = rating >= star - 0.5 && rating < star;
          return (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                isFull
                  ? "fill-[#E69C24] text-[#E69C24]"
                  : isHalf
                  ? "fill-[#E69C24]/50 text-[#E69C24]"
                  : "text-[#E69C24] stroke-[1.5]"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="group flex flex-col bg-white text-center transition-all duration-300 border border-[#EAE3D5] hover:border-[#B8933F] rounded-xl sm:rounded-2xl overflow-hidden relative shadow-none hover:shadow-md"
      onMouseEnter={() => {
        setIsHovered(true);
        if (currentImageIndex === 0) {
          setCurrentImageIndex(1); // Auto-show next image on hover!
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0); // Return to primary image on mouse leave
      }}
    >
      {/* ── Image & Action Area: Touches the Top, Left, and Right Borders ── */}
      <div className="relative aspect-square w-full bg-[#FAF9F7] overflow-hidden flex items-center justify-center">
        
        {/* Percentage Offer Badge (Always visible on every card) */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#B8933F] text-white text-[9px] sm:text-[10px] font-semibold flex items-center justify-center shadow-xs">
            {discountBadge}
          </span>
        </div>

        {/* Primary and Hover Images */}
        <Link href={productLink} className="block w-full h-full relative">
          {images.map((imgSrc, idx) => {
            const isVisible =
              idx === currentImageIndex ||
              (isHovered && idx === 1 && currentImageIndex === 1) ||
              (!isHovered && idx === 0 && currentImageIndex === 0);

            return (
              <div
                key={imgSrc + idx}
                className={`absolute inset-0 p-1.5 sm:p-2.5 transition-all duration-500 ease-out flex items-center justify-center ${
                  isVisible
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-95 z-0 pointer-events-none"
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={imgSrc}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            );
          })}
        </Link>

        {/* Image Carousel Arrows (< and > on hover, matching Image 4) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D5] text-[#1C1208] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D5] text-[#1C1208] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
            </button>
          </>
        )}

        {/* Floating Action Buttons on Top-Right (Wishlist, Quick View - Compare removed) */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          
          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D5] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
              wishlisted ? "text-[#B8933F]" : "text-[#333] hover:text-[#B8933F]"
            }`}
          >
            <Heart
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                wishlisted ? "fill-[#B8933F] stroke-[#B8933F]" : "stroke-[1.6]"
              }`}
            />
          </button>

          {/* View Product Details (Direct Link - No Modal) */}
          <Link
            href={productLink}
            title="View Product Details"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D5] text-[#333] hover:text-[#B8933F] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[1.6]" />
          </Link>
        </div>

        {/* Hover Action Button (Add to Cart / Select Options) sliding up */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 z-20 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="w-full py-1.5 sm:py-2 px-3 bg-[#B8933F] hover:bg-[#9E792B] text-white text-[9.5px] sm:text-[11px] uppercase font-semibold tracking-[0.14em] sm:tracking-[0.16em] rounded-full shadow-none flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 stroke-[1.8]" />
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>

      {/* ── Product Info Below Image (Compact & Proportional) ── */}
      <div className="p-2 sm:p-2.5 pb-2.5 flex flex-col items-center justify-between flex-1">
        {/* Title */}
        <Link href={productLink} className="block w-full">
          <h4 className="text-[11px] sm:text-[13px] text-[#1C1208] font-semibold leading-snug line-clamp-1 max-w-[220px] mx-auto text-center group-hover:text-[#B8933F] transition-colors mb-1">
            {product.title}
          </h4>
        </Link>

        {/* Rating Stars */}
        <div className="mb-1 scale-75 sm:scale-85 origin-center">
          {renderStars(product.rating)}
        </div>

        {/* Indian Price */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[11.5px] sm:text-[13.5px] font-semibold text-[#B8933F] tracking-tight">
            {product.price}
          </span>
          {comparePrice && (
            <span className="text-[9px] sm:text-[11px] text-[#9E9790] line-through">
              {comparePrice}
            </span>
          )}
        </div>

        {/* Stock Count Display */}
        <div className="mt-1 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-medium text-[#2E7D32]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
          <span>
            {stockCount <= 5 ? `Only ${stockCount} left` : `In Stock: ${stockCount} units`}
          </span>
        </div>

        {/* Mobile-only visible Add to Cart button */}
        <div className="mt-2 w-full sm:hidden">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="w-full py-1 px-2 bg-[#B8933F] hover:bg-[#9E792B] text-white text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 transition-all rounded-full shadow-none active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
}


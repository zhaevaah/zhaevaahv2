"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Coins,
  Truck,
  Flame,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  SlidersHorizontal,
  Heart,
  HelpCircle,
  Share2,
  Eye,
  Clock,
  RotateCcw,
  Check,
} from "lucide-react";
import { DetailedProduct, FEATURED_DETAILED_PRODUCT, getProductStock } from "../data/products";
import { useStore } from "../context/StoreContext";

interface ProductDetailViewProps {
  product?: DetailedProduct;
}

export default function ProductDetailView({
  product = FEATURED_DETAILED_PRODUCT,
}: ProductDetailViewProps) {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useStore();

  const [productData, setProductData] = useState(product);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(`zhaevaah_product_override_${product.id}`) ||
        localStorage.getItem(`zhaevaah_product_override_${product.slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProductData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, [product.id, product.slug]);

  const p = { ...product, ...productData };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPurity, setSelectedPurity] = useState(
    p.purityOptions?.[1] || p.purityOptions?.[0] || "18KT"
  );
  const [selectedSize, setSelectedSize] = useState(
    (p.ringSizes && p.ringSizes[2]) ||
      (p.sizes && p.sizes[0]) ||
      "14"
  );
  const [selectedColor, setSelectedColor] = useState(
    p.stoneColors?.[0]?.name || "Yellow Gold"
  );
  const [selectedShape, setSelectedShape] = useState(
    p.stoneShapes?.[0]?.shapeId || "round"
  );
  const [quantity, setQuantity] = useState(1);
  const [isCompared, setIsCompared] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const wishlisted = isInWishlist(p.id);
  const gallery = p.galleryImages?.length ? p.galleryImages : (p.additionalImages?.length ? p.additionalImages : [p.primaryImage]);
  const stockCount = p.stock !== undefined ? p.stock : getProductStock(p);

  const variantConfig = p.variantConfig || {
    enablePurity: p.purityOptions ? p.purityOptions.length > 0 : true,
    purityLabel: "GOLD PURITY",
    enableSize: (p.ringSizes?.length || p.sizes?.length) ? true : true,
    sizeLabel: p.category?.toLowerCase().includes("ring") ? "INDIAN RING SIZE" : "SIZE",
    enableColor: p.stoneColors ? p.stoneColors.length > 0 : true,
    colorLabel: "COLOR",
    enableShape: p.stoneShapes ? p.stoneShapes.length > 0 : true,
    shapeLabel: "STONE SHAPE",
  };

  const handleNextThumb = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevThumb = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleColorSelect = (colorName: string, imageSrc?: string) => {
    setSelectedColor(colorName);
    if (imageSrc) {
      const idx = gallery.indexOf(imageSrc);
      if (idx !== -1) setActiveImageIndex(idx);
    }
  };

  const handleClearSelection = () => {
    setSelectedPurity(p.purityOptions?.[1] || p.purityOptions?.[0] || "18KT");
    setSelectedSize((p.ringSizes && p.ringSizes[2]) || (p.sizes && p.sizes[0]) || "14");
    setSelectedColor(p.stoneColors?.[0]?.name || "Yellow Gold");
    setSelectedShape(p.stoneShapes?.[0]?.shapeId || "round");
    setActiveImageIndex(0);
    showToast("Selections reset to default.");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!");
    } else {
      showToast("Product URL ready to share!");
    }
  };

  const handleToggleCompare = () => {
    setIsCompared(!isCompared);
    showToast(!isCompared ? "Added to compare list." : "Removed from compare list.");
  };

  return (
    <div className="w-full bg-white pt-6 pb-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main Product Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── Left Column: Sticky Gallery & Value Strip ── */}
          <div className="lg:col-span-6 flex flex-col lg:sticky lg:top-[88px] lg:self-start z-10">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              
              {/* Vertical Thumbnail Scroller (Left on sm+) */}
              <div className="flex sm:flex-col items-center gap-2 order-2 sm:order-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={handlePrevThumb}
                  aria-label="Previous thumbnail"
                  className="hidden sm:flex w-16 h-6 items-center justify-center text-[#767069] hover:text-[#1C1208] transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[380px] lg:max-h-[440px] no-scrollbar">
                  {gallery.map((img, idx) => (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 bg-[#F8F7F5] rounded-xs border-2 overflow-hidden transition-all ${
                        activeImageIndex === idx
                          ? "border-[#B8933F] shadow-sm scale-102"
                          : "border-transparent hover:border-[#D1CBC3] opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumbnail ${idx + 1}`}
                        fill
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextThumb}
                  aria-label="Next thumbnail"
                  className="hidden sm:flex w-16 h-6 items-center justify-center text-[#767069] hover:text-[#1C1208] transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Main Large Preview Image */}
              <div className="order-1 sm:order-2 flex-1 w-full bg-[#FBF9F7] rounded-xs border border-[#EAE6DF] aspect-square max-h-[calc(100vh-220px)] lg:max-h-[520px] relative overflow-hidden flex items-center justify-center group">
                {product.discountBadge && (
                  <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full bg-[#B8933F] text-white flex items-center justify-center text-xs font-bold shadow-md tracking-tight">
                    {product.discountBadge}
                  </div>
                )}
                <div className="relative w-full h-full p-6 sm:p-8">
                  <Image
                    src={gallery[activeImageIndex] || product.primaryImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-108"
                    priority
                  />
                </div>
              </div>

            </div>

            {/* Value Propositions Strip (Matching Reference Image 1) */}
            <div className="mt-6 grid grid-cols-3 border border-[#EAE3D5] rounded-xs divide-x divide-[#EAE3D5] py-3.5 px-2 bg-[#FAF8F5] text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#1C1208]">
                <ShieldCheck className="w-4 h-4 text-[#B8933F] flex-shrink-0" />
                <span className="truncate">101% Original</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#1C1208]">
                <Coins className="w-4 h-4 text-[#B8933F] flex-shrink-0" />
                <span className="truncate">Lowest Price</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#1C1208]">
                <Truck className="w-4 h-4 text-[#B8933F] flex-shrink-0" />
                <span className="truncate">Free Shipping</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Product Info & Actions ── */}
          <div className="lg:col-span-6 flex flex-col font-poppins">
            
            {/* Title */}
            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1C1208] leading-tight mb-3">
              {p.title}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center flex-wrap gap-3 mb-2">
              <span className="font-montserrat text-2xl sm:text-[26px] font-bold text-[#B8933F]">
                {p.price}
              </span>
              {p.originalPrice && (
                <span className="font-montserrat text-base text-[#9A9287] line-through">
                  {p.originalPrice}
                </span>
              )}
              {p.discountBadge && (
                <span className="px-2 py-0.5 rounded-full bg-[#B8933F]/15 text-[#B8933F] text-xs font-bold">
                  {p.discountBadge}
                </span>
              )}
              <div className="flex items-center gap-1 text-[#E69C24] ml-auto sm:ml-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(p.rating || 5)
                        ? "fill-[#E69C24]"
                        : "stroke-[1.6]"
                    }`}
                  />
                ))}
                <span className="text-xs text-[#767069] ml-1">
                  ({p.reviewsCount || 18} customer reviews)
                </span>
              </div>
            </div>

            {/* Stock Count Status Badge (Matching Reference Screenshot) */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                • In Stock: Only {stockCount} items left in vault
              </span>
              <span className="text-xs text-[#767069] hidden sm:inline">
                (Ready for insured express dispatch)
              </span>
            </div>

            {/* Urgency Badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#D9534F] bg-[#FFF5F5] border border-[#FFE0E0] px-3 py-1.5 rounded-xs w-fit mb-4">
              <Flame className="w-4 h-4 fill-[#D9534F]" />
              <span>{p.soldCount || 5} products sold in last {p.soldHours || 19} hours</span>
            </div>

            {/* Short Specs / Description */}
            <p className="text-xs sm:text-[13px] text-[#6E675F] leading-relaxed mb-5 font-light">
              {p.description}
            </p>

            {/* ── 1. GOLD PURITY SELECTOR (Configurable from Admin) ── */}
            {variantConfig.enablePurity !== false && p.purityOptions && p.purityOptions.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1208]">
                    {variantConfig.purityLabel || "GOLD PURITY"}: <span className="text-[#B8933F] font-bold">{selectedPurity}</span>
                  </label>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {p.purityOptions.map((purity) => {
                    const isSelected = selectedPurity === purity;
                    return (
                      <button
                        key={purity}
                        type="button"
                        onClick={() => setSelectedPurity(purity)}
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all ${
                          isSelected
                            ? "border-[#B8933F] bg-[#FAF6EC] text-[#B8933F] ring-1 ring-[#B8933F] shadow-xs"
                            : "border-[#D6CEC1] bg-white text-[#5C5349] hover:border-[#1C1208] hover:text-[#1C1208]"
                        }`}
                      >
                        {purity}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── 2. SIZE / DIMENSIONS SELECTOR (Configurable from Admin) ── */}
            {variantConfig.enableSize !== false && (p.ringSizes?.length || p.sizes?.length) ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1208]">
                    {variantConfig.sizeLabel || (p.category?.toLowerCase().includes("ring") ? "INDIAN RING SIZE" : "SIZE")}:{" "}
                    <span className="text-[#1C1208] font-bold">{selectedSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast("Standard BIS jewellery sizes. Crafted to perfection.")}
                    className="text-[11px] text-[#B8933F] hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(p.ringSizes || p.sizes || []).map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-10 h-10 px-3 flex items-center justify-center text-xs rounded-xs border transition-all ${
                          isSelected
                            ? "bg-[#1C1208] text-white border-[#1C1208] font-bold shadow-xs scale-102"
                            : "bg-white text-[#4A4238] border-[#D6CEC1] hover:border-[#1C1208] hover:text-[#1C1208]"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* ── 3. STONE COLOR SWATCHES (Configurable from Admin) ── */}
            {variantConfig.enableColor !== false && p.stoneColors && p.stoneColors.length > 0 && (
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1208] block mb-2">
                  {variantConfig.colorLabel || "COLOR"}: <span className="text-[#B8933F] font-bold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {p.stoneColors.map((sc) => {
                    const isSelected = selectedColor === sc.name;
                    return (
                      <button
                        key={sc.name}
                        type="button"
                        onClick={() => handleColorSelect(sc.name, sc.image)}
                        title={`${sc.name} (${sc.hex})`}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border transition-all ${
                          isSelected
                            ? "border-[#B8933F] bg-[#FAF6EC] ring-1 ring-[#B8933F] shadow-xs"
                            : "border-[#E5DFD5] bg-white hover:border-[#1C1208]"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-2xs shrink-0"
                          style={{ backgroundColor: sc.hex }}
                        />
                        <span className="text-xs text-[#1C1208] font-medium">{sc.name}</span>
                        <span className="text-[10px] text-[#767069] font-mono uppercase">{sc.hex}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── 4. STONE SHAPE SELECTOR (Configurable from Admin) ── */}
            {variantConfig.enableShape !== false && p.stoneShapes && p.stoneShapes.length > 0 && (
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1208] block mb-2">
                  {variantConfig.shapeLabel || "STONE SHAPE"}: <span className="text-[#B8933F] font-bold">{selectedShape}</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {p.stoneShapes.map((shape) => {
                    const isSelected = selectedShape === shape.shapeId || selectedShape === shape.name;
                    return (
                      <button
                        key={shape.shapeId}
                        type="button"
                        onClick={() => setSelectedShape(shape.shapeId)}
                        className={`px-3 py-2 border rounded-xs flex items-center gap-2 transition-all ${
                          isSelected
                            ? "border-[#B8933F] ring-1 ring-[#B8933F] bg-[#FAF6EC] text-[#1C1208] font-medium shadow-xs"
                            : "border-[#E5DFD5] bg-white text-[#5C5349] hover:border-[#1C1208]"
                        }`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center text-[#B8933F]">
                          {shape.shapeId === "cushion" ? (
                            <div className="w-3.5 h-3.5 rounded-xs border-2 border-current rotate-45" />
                          ) : shape.shapeId === "emerald" ? (
                            <div className="w-3 h-4 border-2 border-current" />
                          ) : shape.shapeId === "oval" ? (
                            <div className="w-3 h-4 rounded-full border-2 border-current" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                          )}
                        </div>
                        <span className="text-xs">{shape.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clear Selection Link */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs text-[#767069] hover:text-[#1C1208] underline transition-colors"
              >
                × Clear & Reset Selections
              </button>
            </div>

            {/* Selected Item Price & Stock status */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-montserrat text-2xl font-bold text-[#1C1208]">
                ₹{(p.priceNum || 24999).toLocaleString("en-IN")}
              </span>
              <span className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold rounded-xs border border-[#C8E6C9] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                {stockCount} in stock
              </span>
            </div>

            {/* Quantity Stepper & Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#DDD5C7] rounded-xs px-2 bg-[#FAF8F5] justify-between h-12 w-full sm:w-32">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-[#555] hover:text-[#1C1208]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-semibold text-[#1C1208]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 text-[#555] hover:text-[#1C1208]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => {
                  addToCart(
                    p,
                    quantity,
                    variantConfig.enableSize !== false ? selectedSize : undefined,
                    variantConfig.enableColor !== false ? selectedColor : undefined,
                    variantConfig.enableShape !== false ? selectedShape : undefined,
                    variantConfig.enablePurity !== false ? selectedPurity : undefined,
                    {
                      sizeLabel: variantConfig.sizeLabel || (p.category?.toLowerCase().includes("ring") ? "INDIAN RING SIZE" : "SIZE"),
                      colorLabel: variantConfig.colorLabel || "COLOR",
                      shapeLabel: variantConfig.shapeLabel || "STONE SHAPE",
                      purityLabel: variantConfig.purityLabel || "GOLD PURITY",
                    }
                  );
                  showToast(`Added ${quantity} × ${p.title} to your shopping bag.`);
                }}
                className="flex-1 h-12 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all flex items-center justify-center active:scale-98 gap-2"
              >
                <span>ADD TO CART</span>
              </button>
            </div>

            {/* Buy Now Full Width Dark Button */}
            <button
              type="button"
              onClick={() => {
                addToCart(
                  p,
                  quantity,
                  variantConfig.enableSize !== false ? selectedSize : undefined,
                  variantConfig.enableColor !== false ? selectedColor : undefined,
                  variantConfig.enableShape !== false ? selectedShape : undefined,
                  variantConfig.enablePurity !== false ? selectedPurity : undefined,
                  {
                    sizeLabel: variantConfig.sizeLabel || (p.category?.toLowerCase().includes("ring") ? "INDIAN RING SIZE" : "SIZE"),
                    colorLabel: variantConfig.colorLabel || "COLOR",
                    shapeLabel: variantConfig.shapeLabel || "STONE SHAPE",
                    purityLabel: variantConfig.purityLabel || "GOLD PURITY",
                  }
                );
                window.location.href = "/checkout";
              }}
              className="w-full h-12 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all mb-4 active:scale-98"
            >
              BUY NOW
            </button>

            {/* Trust Badges matching screenshot */}
            <div className="flex items-center justify-around py-3 border-y border-[#EAE3D5] text-xs font-medium text-[#767069] mb-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B8933F]" />
                BIS Hallmarked
              </span>
              <span className="flex items-center gap-1.5">
                <Image src="/favicon-32x32.png" alt="•" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                Certified Natural Diamonds
              </span>
            </div>

            {/* Live Vault Stock Counter */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3D5] rounded-xs mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#1C1208] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#B8933F] fill-[#B8933F]" />
                  Vault Stock Availability
                </span>
                <span className="font-bold text-[#B8933F]">{stockCount} pieces available</span>
              </div>
              <div className="w-full bg-[#EAE3D5] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#B8933F] h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(25, (stockCount / 10) * 100))}%` }}
                />
              </div>
              <p className="text-[11px] text-[#767069] mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B8933F] flex-shrink-0" />
                <span>Handcrafted limited release. Only {stockCount} units remaining in stock.</span>
              </p>
            </div>

            {/* Secondary Action Strip (Compare, Wishlist, Ask Us, Share) */}
            <div className="flex items-center justify-between text-xs text-[#6E675F] border-t border-b border-[#EAE3D5] py-3 mb-6">
              <button
                type="button"
                onClick={handleToggleCompare}
                className="flex items-center gap-1.5 hover:text-[#B8933F] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>COMPARE</span>
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-[#B8933F] transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-[#B8933F] text-[#B8933F]" : ""}`} />
                <span>BROWSE WISHLIST</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAsking(!isAsking)}
                className="flex items-center gap-1.5 hover:text-[#B8933F] transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>ASK US</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-[#B8933F] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE</span>
              </button>
            </div>

            {/* Ask Us Inquiry Mini Drawer */}
            {isAsking && (
              <div className="mb-6 p-4 bg-[#FAF8F5] border border-[#EAE3D5] rounded-xs space-y-3">
                <h4 className="text-xs font-semibold text-[#1C1208] uppercase tracking-wider">
                  Have a question about this ring?
                </h4>
                <p className="text-[11px] text-[#767069]">
                  Our master gemologists are available on WhatsApp and call at (+91) 9876-543-210.
                </p>
                <input
                  type="text"
                  placeholder="Your question or custom carat request..."
                  className="w-full text-xs p-2.5 bg-white border border-[#DDD] rounded-xs focus:outline-none focus:border-[#B8933F]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsAsking(false);
                    showToast("Inquiry submitted! Our stylist will contact you shortly.");
                  }}
                  className="px-4 py-2 bg-[#B8933F] text-white text-[11px] uppercase tracking-wider font-medium"
                >
                  Send Inquiry
                </button>
              </div>
            )}

            {/* Live Social Proof & Delivery Info (Matching Image 2) */}
            <div className="space-y-2.5 text-xs text-[#6E675F] mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#B8933F]" />
                <span>{p.viewingCount || 20} people are viewing this right now</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B8933F]" />
                <span>Estimated Delivery : Up to 4 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#B8933F]" />
                <span>Free Shipping & Returns : On all orders over ₹4,999</span>
              </div>
              <div className="flex items-center gap-2 text-[#B8933F] font-medium pt-0.5">
                <Image
                  src="/favicon-32x32.png"
                  alt="•"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 object-contain"
                />
                <span>Certified Natural Diamond Guarantee • 100% BIS Hallmarked</span>
              </div>
            </div>

            {/* Guaranteed Safe And Secure Checkout Card */}
            <div className="border border-[#EAE3D5] rounded-xs p-4 bg-[#FAF9F7] text-center space-y-2">
              <span className="text-xs font-medium text-[#1C1208] block tracking-wide">
                Guaranteed Safe And Secure Checkout
              </span>
              <div className="flex items-center justify-center flex-wrap gap-2 text-[10px] font-bold text-[#444]">
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#1A1F71]">VISA</span>
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#EB001B]">MASTERCARD</span>
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#007AC1]">AMEX</span>
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#F97000]">DISCOVER</span>
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#003087]">PAYPAL</span>
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#000]">APPLE PAY</span>
                <span className="px-2 py-0.5 bg-white border border-[#DDD] rounded text-[#097939]">UPI</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


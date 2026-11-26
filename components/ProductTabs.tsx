"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";
import { DetailedProduct } from "../data/products";

interface ProductTabsProps {
  product: DetailedProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "reviews" | "shipping">("desc");
  const [productData, setProductData] = useState<any>(product);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(`zhaevaah_product_override_${product.id}`) ||
        localStorage.getItem(`zhaevaah_product_override_${product.slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProductData((prev: any) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, [product.id, product.slug]);

  const p = { ...product, ...productData };

  const hallmarkHighlights: string[] = p.hallmarkHighlights?.length
    ? p.hallmarkHighlights
    : [
        "100% BIS Hallmarked Pure Gold & IGI Certified Natural Diamonds",
        "Complimentary Royal Heirloom Velvet Gift Box & Certificate",
        "Artisanal Prong Setting Crafted by Master Indian Goldsmiths",
        "Armored Insured Doorstep Delivery & 15-Day Free Returns",
      ];

  const specifications: { label: string; value: string }[] = p.specifications?.length
    ? p.specifications
    : product.specifications || [];

  return (
    <section className="w-full bg-white border-t border-[#EAE6DF] py-12 lg:py-16 font-poppins">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Headers */}
        <div className="border-b border-[#EAE3D5] mb-8 sm:mb-12">
          <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-6 md:gap-10 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1 sm:px-0">
            {[
              { id: "desc", fullLabel: "Description", shortLabel: "Description" },
              { id: "info", fullLabel: "Additional Information", shortLabel: "Specifications" },
              { id: "reviews", fullLabel: `Reviews (${p.reviewsCount || 1})`, shortLabel: `Reviews (${p.reviewsCount || 1})` },
              { id: "shipping", fullLabel: "Shipping & Return", shortLabel: "Shipping" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 pt-1 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider font-semibold transition-all whitespace-nowrap border-b-2 -mb-px flex-shrink-0 cursor-pointer ${
                    isActive
                      ? "text-[#B8933F] border-[#B8933F]"
                      : "text-[#767069] border-transparent hover:text-[#1C1208] hover:border-[#D6CEC1]"
                  }`}
                >
                  <span className="inline sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Description */}
        {activeTab === "desc" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-[13.5px] text-[#6E675F] leading-relaxed font-light">
              <h3 className="font-montserrat text-lg sm:text-xl font-semibold text-[#1C1208] mb-3">
                {p.aboutTitle || "About this item"}
              </h3>
              {p.aboutItem ? (
                <div className="whitespace-pre-line leading-relaxed space-y-3">
                  {p.aboutItem}
                </div>
              ) : (
                <>
                  <p>
                    {p.description || "Indulge in the allure of timeless elegance with our Diamond & Gemstone Ring Collection. Whether worn as a symbol of love, a celebration of achievements, or simply as a daily indulgence, this handcrafted piece is a testament to enduring beauty and refined style."}
                  </p>
                  <p>
                    {p.secondaryDescription || "Your ZHAEVAAH jewelry arrives in an elegant royal gift box, making it a perfect gift for a loved one or a treasured addition to your own heirloom collection. Each piece is accompanied by a certificate of authenticity, guaranteeing the quality of the diamonds and hallmarked gold."}
                  </p>
                </>
              )}

              {/* Luxury Hallmark Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {hallmarkHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 bg-[#FAF8F5] rounded-xs border border-[#EAE3D5]">
                    <Image
                      src="/favicon-32x32.png"
                      alt="•"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain flex-shrink-0"
                    />
                    <span className="text-xs text-[#2c2621] font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Banner */}
            <div className="pt-8">
              <div className="bg-[#FAF9F7] rounded-xs border border-[#EAE3D5] p-6 sm:p-10 text-center overflow-hidden">
                <h3 className="font-montserrat text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#1C1208] tracking-tight mb-8">
                  {p.spotlightTitle || "Sterling Silver Rose Gold Love Beckons Ring"}
                </h3>
                <div className="relative w-full aspect-[21/9] max-h-[360px] mx-auto">
                  <Image
                    src={p.spotlightImage || "/images/ring_beckons_banner.jpg"}
                    alt={p.spotlightTitle || "Sterling Silver Rose Gold Love Beckons Ring Collection"}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Additional information */}
        {activeTab === "info" && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <h3 className="font-montserrat text-lg font-semibold text-[#1C1208] mb-4">
              {p.specificationsTitle || "Specifications & Metallurgy"}
            </h3>
            <div className="border border-[#EAE3D5] rounded-xl overflow-hidden divide-y divide-[#EAE3D5] text-xs">
              {specifications.map((spec, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 py-3 px-4 bg-white even:bg-[#FAF8F5]">
                  <span className="font-medium text-[#1C1208]">{spec.label}</span>
                  <span className="sm:col-span-2 text-[#6E675F]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="max-w-3xl mx-auto animate-fadeIn space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-4">
              <div>
                <h3 className="font-montserrat text-lg font-semibold text-[#1C1208]">
                  Customer Reviews ({p.reviewsCount || 1})
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-[#E69C24]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E69C24]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#767069]">
                    {p.rating || "4.8"} out of 5 based on {p.reviewsCount || 24} verified buyers
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("Write a review form dialog")}
                className="px-4 py-2 border border-[#B8933F] text-[#B8933F] hover:bg-[#B8933F] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                Write A Review
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D5] rounded-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1C1208]">Pooja Singhania</span>
                    <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded">Verified Buyer</span>
                  </div>
                  <span className="text-[11px] text-[#888]">November 2026</span>
                </div>
                <div className="flex text-[#E69C24] mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#E69C24]" />
                  ))}
                </div>
                <p className="text-xs text-[#6E675F]">
                  Absolutely breathtaking sparkle! The natural blue topaz is rich in color and the halo diamonds have immense fire. Arrived securely packed with certificate in 3 days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Shipping & Return */}
        {activeTab === "shipping" && (
          <div className="max-w-3xl mx-auto animate-fadeIn space-y-6 text-xs text-[#6E675F] leading-relaxed">
            <h3 className="font-montserrat text-lg font-semibold text-[#1C1208] mb-2">
              {p.shippingTitle || "Complimentary Insured Shipping & Return Policy"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D5] rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1208]">
                  <Truck className="w-4 h-4 text-[#B8933F]" />
                  <span>{p.deliveryTitle || "Doorstep Delivery Across India"}</span>
                </div>
                <p>
                  {p.deliveryText || "Every ZHAEVAAH order is dispatched via armored tamper-evident courier with full transit insurance. Expected delivery within 3 to 5 business days."}
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D5] rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1208]">
                  <RotateCcw className="w-4 h-4 text-[#B8933F]" />
                  <span>{p.returnTitle || "15-Day Hassle-Free Returns"}</span>
                </div>
                <p>
                  {p.returnText || "We offer a 15-day 100% money-back guarantee with complimentary return pickup if you are not fully enchanted with your jewellery."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}


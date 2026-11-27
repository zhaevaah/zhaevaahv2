"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, ArrowRight, Sparkles } from "lucide-react";

interface MarqueeItem {
  id: string;
  categoryTag?: string;
  headline: string;
  couponCode?: string;
  linkLabel?: string;
  linkHref: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  {
    id: "m1",
    categoryTag: "PURITY GUARANTEE",
    headline: "100% BIS Hallmarked 18KT/22KT Gold & IGI Certified Natural Diamonds",
    linkLabel: "View Certifications",
    linkHref: "/women",
  },
  {
    id: "m2",
    categoryTag: "DIWALI FESTIVE SALE",
    headline: "Flat 20% OFF On Solitaire Diamond Rings",
    couponCode: "DIWALI20",
    linkLabel: "Shop Solitaires",
    linkHref: "/women?category=Solitaire%20Rings",
  },
  {
    id: "m3",
    categoryTag: "WELCOME OFFER",
    headline: "Save Flat ₹2,500 On Your First Luxury Purchase",
    couponCode: "ZHAEVAAH",
    linkLabel: "Claim Offer",
    linkHref: "/women",
  },
  {
    id: "m4",
    categoryTag: "WEDDING SPECIAL",
    headline: "Complimentary 24KT Gold Coin On Orders Over ₹50,000",
    couponCode: "GOLDCOIN",
    linkLabel: "Bridal Sets",
    linkHref: "/women?category=Diamond%20Rings",
  },
  {
    id: "m5",
    categoryTag: "PAN-INDIA COURIER",
    headline: "Free Fully Insured Doorstep Delivery With Real-time BlueDart Tracking",
    linkLabel: "Track Orders",
    linkHref: "/profile?tab=orders",
  },
  {
    id: "m6",
    categoryTag: "LIFETIME VALUE",
    headline: "15-Day Easy Returns & 100% Lifetime Buyback Policy",
    linkLabel: "Our Guarantee",
    linkHref: "/women",
  },
  {
    id: "m7",
    categoryTag: "LUXURY GIFTING",
    headline: "Complimentary Royal Velvet Packaging & Personal Handwritten Letter",
    linkLabel: "Customize Gift",
    linkHref: "/checkout",
  },
  {
    id: "m8",
    categoryTag: "NEW SEASON 2026",
    headline: "Handcrafted Luxury Pendants & Eternity Bracelets Just Dropped",
    linkLabel: "Explore New Arrivals",
    linkHref: "/women?category=Diamond%20Bracelets",
  },
];

export default function MarqueePromoStrip() {
  const [items, setItems] = useState<MarqueeItem[]>(MARQUEE_ITEMS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_custom_marquee");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-home-updated", loadCustom);
  }, []);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2200);
    }
  };

  const renderItem = (item: MarqueeItem, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${item.id}`}
      className="inline-flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5 px-2.5 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap text-[#1C1208] group/item"
    >
      {/* Decorative Brand Favicon Emblem Bullet Point Separator */}
      <span className="flex items-center justify-center select-none flex-shrink-0">
        <Image
          src="/favicon-32x32.png"
          alt="•"
          width={14}
          height={14}
          className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 object-contain drop-shadow-2xs"
        />
      </span>

      {/* Category Tag */}
      {item.categoryTag && (
        <span className="bg-[#B8933F]/12 text-[#9E7B2F] font-semibold text-[7.5px] sm:text-[8.5px] md:text-[9.5px] tracking-[0.1em] uppercase px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-xs border border-[#B8933F]/25 select-none leading-none">
          {item.categoryTag}
        </span>
      )}

      {/* Main Headline */}
      <span className="font-medium tracking-[0.02em] text-[#2C241D] leading-none">
        {item.headline}
      </span>

      {/* Coupon Chip (Clickable Copy) */}
      {item.couponCode && (
        <button
          type="button"
          onClick={(e) => handleCopy(item.couponCode!, e)}
          className="inline-flex items-center gap-1 bg-white hover:bg-[#FAF8F5] text-[#B8933F] border border-[#B8933F]/40 hover:border-[#B8933F] px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-xs text-[9px] sm:text-[10px] md:text-[11px] font-mono font-bold tracking-wider transition-all shadow-2xs cursor-pointer active:scale-95 leading-none"
          title={`Click to copy coupon code "${item.couponCode}"`}
        >
          <span>{item.couponCode}</span>
          {copiedCode === item.couponCode ? (
            <span className="inline-flex items-center text-[7.5px] sm:text-[8.5px] font-bold text-emerald-600 ml-0.5">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
              <span className="hidden sm:inline">COPIED</span>
            </span>
          ) : (
            <Copy className="w-2.2 h-2.2 sm:w-2.8 sm:h-2.8 text-[#B8933F]/80 stroke-[2] ml-0.5" />
          )}
        </button>
      )}

      {/* Action Link */}
      {item.linkLabel && (
        <Link
          href={item.linkHref}
          className="inline-flex items-center gap-0.5 font-semibold text-[#B8933F] hover:text-[#9E7B2F] underline underline-offset-2 decoration-[#B8933F]/40 hover:decoration-[#B8933F] transition-all ml-0.5 text-[9.5px] sm:text-[11px] md:text-xs leading-none"
        >
          <span>{item.linkLabel}</span>
          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2] transition-transform group-hover/item:translate-x-0.5" />
        </Link>
      )}
    </div>
  );

  return (
    <div
      className="relative w-full bg-[#FAF9F7] border-y border-[#EAE3D5] overflow-hidden select-none py-0.5 sm:py-1 group"
      aria-label="Promotional announcements and coupons"
    >
      {/* Left Gradient Mask for smooth entry fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-20 bg-gradient-to-r from-[#FAF9F7] to-transparent z-10" />

      {/* Right Gradient Mask for smooth exit fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-20 bg-gradient-to-l from-[#FAF9F7] to-transparent z-10" />

      {/* Continuous Marquee Track (Double loop for seamless scroll) */}
      <div className="animate-marquee-scroll flex items-center">
        {items.map((item) => renderItem(item, "first"))}
        {items.map((item) => renderItem(item, "second"))}
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Check, Copy } from "lucide-react";
import { apiGetBanners } from "../lib/api";

interface PromoOffer {
  id: string;
  badge?: string;
  headline: string;
  shortHeadline?: string;
  promoCode?: string;
  link: string;
}

const DEFAULT_PROMOS: PromoOffer[] = [
  {
    id: "welcome-offer",
    badge: "SPECIAL OFFER",
    headline: "Save 10% When You Join ZHAEVAAH, Use Promo",
    shortHeadline: "Save 10% With Code",
    promoCode: "ZHAEVAAH10",
    link: "/shop",
  },
  {
    id: "diwali-festive",
    badge: "DIWALI SALE",
    headline: "Save 20% on Festive Diamond Jewellery, Use Promo",
    shortHeadline: "Save 20% On Diamonds",
    promoCode: "DIWALI20",
    link: "/shop?category=Diamond%20Rings",
  },
  {
    id: "wedding-rush",
    badge: "WEDDING SPECIAL",
    headline: "Free 24KT Gold Coin on Orders Over ₹50,000, Use Promo",
    shortHeadline: "Free 24KT Gold Coin > ₹50K",
    promoCode: "GOLDCOIN",
    link: "/top-deals",
  },
  {
    id: "insured-shipping",
    badge: "FESTIVE BENEFIT",
    headline: "Complimentary Insured Express Delivery Across India",
    shortHeadline: "Free Insured Express Delivery",
    promoCode: "FREESHIP",
    link: "/shipping",
  },
];

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [promos, setPromos] = useState<PromoOffer[]>(DEFAULT_PROMOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Check if previously dismissed in this session
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("zhaevaah_top_strip_dismissed");
      if (dismissed === "true") {
        setIsVisible(false);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const loadCustom = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_custom_top_banner");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPromos(parsed);
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-home-updated", loadCustom);
  }, []);

  // Fetch dynamic PROMO_TOP banners from backend if configured
  useEffect(() => {
    let isMounted = true;
    apiGetBanners("PROMO_TOP")
      .then((res) => {
        if (!isMounted) return;
        const bannerList = res?.banners?.promoTop || res?.banners?.all?.filter((b: any) => b.type === "PROMO_TOP");
        if (bannerList && bannerList.length > 0) {
          const dynamicPromos: PromoOffer[] = bannerList.map((b: any, index: number) => ({
            id: b.id || `promo-db-${index}`,
            badge: b.badge || "SPECIAL SALE",
            headline: b.title || "EXQUISITE FINE JEWELLERY PROMOTION",
            promoCode: b.discount ? b.discount.replace(/[^A-Za-z0-9]/g, "").toUpperCase() : "ZHAEVAAH",
            link: b.link || "/shop",
          }));
          setPromos([...dynamicPromos, ...DEFAULT_PROMOS]);
        }
      })
      .catch(() => {
        // Fallback to rich default festive promotions
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-rotate promotional messages every 4.5 seconds
  useEffect(() => {
    if (promos.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [promos.length, isPaused]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("zhaevaah_top_strip_dismissed", "true");
    } catch {
      // Ignore storage errors
    }
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  if (!isVisible || promos.length === 0) {
    return null;
  }

  const activePromo = promos[currentIndex];

  return (
    <div
      className="relative w-full bg-[#B8933F] text-white z-50 select-none border-b border-[#9E7B2F]/40 shadow-xs transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative max-w-[1400px] mx-auto px-8 sm:px-12 md:px-14 min-h-[36px] sm:min-h-[38px] py-1.5 sm:py-1 flex items-center justify-center text-[10.5px] sm:text-xs font-montserrat">
        {/* Left Arrow Controls (Desktop subtle preview) */}
        {promos.length > 1 && (
          <div className="hidden md:flex items-center absolute left-3 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 text-white/70 hover:text-white hover:bg-black/10 rounded-full transition-colors"
              aria-label="Previous promotional offer"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Center: Main Promotional Headline & Underlined Promo Code */}
        <div className="w-full flex items-center justify-center text-center">
          <div className="flex items-center justify-center flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-center leading-tight sm:leading-normal max-w-full">
            {/* Brand Favicon Bullet Point */}
            <span className="hidden sm:inline-flex items-center justify-center flex-shrink-0">
              <Image
                src="/favicon-32x32.png"
                alt="•"
                width={13}
                height={13}
                className="w-3 sm:w-3.5 h-3 sm:h-3.5 object-contain drop-shadow-xs"
              />
            </span>

            {/* Optional Small Badge */}
            {activePromo.badge && (
              <span className="hidden md:inline-block bg-white/20 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider border border-white/20 uppercase">
                {activePromo.badge}
              </span>
            )}

            {/* Headline text */}
            <span className="text-white drop-shadow-xs font-medium uppercase text-[10px] sm:text-[11.5px] tracking-[0.04em] sm:tracking-[0.12em]">
              <span className="sm:hidden">{activePromo.shortHeadline || activePromo.headline}</span>
              <span className="hidden sm:inline">{activePromo.headline}</span>
            </span>

            {/* Promo Code Link (Click to Copy or Go to Shop) */}
            {activePromo.promoCode && (
              <span className="inline-flex items-center gap-1 font-bold whitespace-nowrap text-[10px] sm:text-[11.5px]">
                <Link
                  href={activePromo.link}
                  className="text-white underline underline-offset-2 sm:underline-offset-4 decoration-white/80 hover:decoration-white font-bold tracking-wider transition-all"
                  title="Click to browse promotional collection"
                >
                  {activePromo.promoCode}
                </Link>

                <button
                  type="button"
                  onClick={(e) => handleCopyCode(activePromo.promoCode!, e)}
                  className="inline-flex items-center text-[9px] sm:text-[10px] bg-black/20 hover:bg-black/35 border border-white/30 text-white px-1.5 py-0.5 rounded-xs ml-0.5 transition-colors cursor-pointer active:scale-95"
                  title="Copy coupon code"
                >
                  {copiedCode === activePromo.promoCode ? (
                    <span className="flex items-center gap-0.5 text-white font-bold">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                      <span>COPIED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-white/95 font-medium">
                      <Copy className="w-2.5 h-2.5 sm:w-2.8 sm:h-2.8 stroke-[2]" />
                      <span>COPY</span>
                    </span>
                  )}
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls & Dismiss Button */}
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {promos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="hidden md:inline-flex p-1 text-white/70 hover:text-white hover:bg-black/10 rounded-full transition-colors"
              aria-label="Next promotional offer"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          )}

          {/* Dismiss ✕ Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 sm:p-1.5 text-white/90 hover:text-white hover:bg-black/10 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss promotional strip banner"
            title="Close"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
}

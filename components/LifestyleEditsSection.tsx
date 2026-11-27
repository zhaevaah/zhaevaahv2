"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface LifestyleEdit {
  id: string;
  number: string;
  title: string;
  tagline: string;
  image: string;
  overlayGradient: string;
  href?: string;
}

const LIFESTYLE_EDITS: LifestyleEdit[] = [
  {
    id: "college",
    number: "01",
    title: "The College Edit",
    tagline: "Don't forget your everyday sparkle.",
    image: "/images/product_2_hover.jpg",
    overlayGradient: "from-black/80 via-black/40 to-black/15",
    href: "/women",
  },
  {
    id: "office",
    number: "02",
    title: "The Office Edit",
    tagline: "Your 9-to-5 deserves a little shine.",
    image: "/images/auth_model_1.jpg",
    overlayGradient: "from-black/80 via-black/40 to-black/15",
    href: "/women",
  },
  {
    id: "date-night",
    number: "03",
    title: "The Date Night Edit",
    tagline: "Let your jewellery do the talking.",
    image: "/images/ring_beckons_banner.jpg",
    overlayGradient: "from-black/80 via-black/40 to-black/15",
    href: "/women",
  },
  {
    id: "weekend",
    number: "04",
    title: "The Weekend Edit",
    tagline: "Casual days, beautiful details.",
    image: "/images/bracelet_hotsell_banner.jpg",
    overlayGradient: "from-black/80 via-black/40 to-black/15",
    href: "/women",
  },
  {
    id: "party",
    number: "05",
    title: "The Party Edit",
    tagline: "Make an entrance. Leave a sparkle.",
    image: "/images/hero_woman_hd.jpg",
    overlayGradient: "from-black/80 via-black/40 to-black/15",
    href: "/women",
  },
  {
    id: "travel",
    number: "06",
    title: "The Travel Edit",
    tagline: "Take a little elegance everywhere.",
    image: "/images/collection.webp",
    overlayGradient: "from-black/80 via-black/40 to-black/15",
    href: "/women",
  },
];

export default function LifestyleEditsSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to "The Office Edit"
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const total = LIFESTYLE_EDITS.length;

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch Swipe Handlers for Mobile Screens
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setIsPaused(false);
      return;
    }
    const diffX = touchStartX.current - touchEndX.current;
    if (diffX > 40) {
      nextCard();
    } else if (diffX < -40) {
      prevCard();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  // Continuous auto-scroll: cycles cards smoothly every 4 seconds
  useEffect(() => {
    if (isPaused) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      nextCard();
    }, 4000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, nextCard]);

  const handleCardHover = (index: number) => {
    setIsPaused(true);
    setActiveIndex(index);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section
      aria-label="Lifestyle Edits - Wear It Where Life Happens"
      className="w-full py-12 sm:py-16 md:py-20 bg-white overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="font-montserrat text-xs sm:text-[13px] font-bold text-[#B8933F] tracking-[0.2em] uppercase block mb-2">
            02 | WEAR IT WHERE LIFE HAPPENS
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#1C1208] tracking-tight leading-tight">
            Discover jewellery styled for every moment of your day
          </h2>
          <p className="font-poppins text-xs sm:text-sm text-[#767069] mt-2 font-light leading-relaxed">
            Lifestyle-led edits that help customers find jewellery for the moments in their day.
          </p>
        </div>

        {/* ── MOBILE VIEW: Smooth Responsive Swipeable Showcase (< md) ── */}
        <div
          className="relative md:hidden w-full flex flex-col items-center select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Card Stage */}
          <div className="relative w-full h-[390px] sm:h-[430px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#EAE3D5] bg-[#1C1208]">
            {LIFESTYLE_EDITS.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isActive
                      ? "opacity-100 translate-x-0 pointer-events-auto z-10 scale-100"
                      : index < activeIndex
                      ? "opacity-0 -translate-x-10 pointer-events-none z-0 scale-95"
                      : "opacity-0 translate-x-10 pointer-events-none z-0 scale-95"
                  }`}
                >
                  {/* Background Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority={index === 1}
                  />

                  {/* Dark Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${item.overlayGradient}`}
                  />

                  {/* Top Counter & Category Pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-montserrat font-semibold text-white tracking-widest uppercase">
                      {item.number} / 06
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#B8933F]/85 backdrop-blur-md text-[10px] font-montserrat font-bold text-white tracking-wider uppercase">
                      LIFESTYLE EDIT
                    </span>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-20">
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="font-serif-luxury text-base sm:text-lg text-[#F4E3C1] italic mt-1.5 drop-shadow-sm leading-snug">
                      &ldquo;{item.tagline}&rdquo;
                    </p>
                    <div className="mt-4">
                      <Link
                        href={item.href || "/women"}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-[#1C1208] text-xs font-montserrat font-semibold tracking-wider uppercase shadow-md transition-all active:scale-95"
                      >
                        <span>Explore Edit</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#B8933F]" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevCard();
              }}
              aria-label="Previous lifestyle edit"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/25 flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextCard();
              }}
              aria-label="Next lifestyle edit"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/25 flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Bottom Navigation Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {LIFESTYLE_EDITS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCardClick(idx)}
                aria-label={`Select ${item.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? "w-7 h-2 bg-[#B8933F]"
                    : "w-2 h-2 bg-[#DDD5C7] hover:bg-[#B8933F]/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP VIEW: Interactive Expanding Accordion (md: and above) ── */}
        <div className="hidden md:flex relative w-full flex-row items-stretch gap-3 sm:gap-4 md:h-[460px] lg:h-[500px] select-none">
          {LIFESTYLE_EDITS.map((item, index) => {
            const isExpanded = index === activeIndex;

            return (
              <div
                key={item.id}
                onMouseEnter={() => handleCardHover(index)}
                onClick={() => handleCardClick(index)}
                className={`group relative rounded-[28px] lg:rounded-[32px] overflow-hidden transition-all duration-700 ease-out cursor-pointer ${
                  isExpanded
                    ? "md:flex-[5] lg:flex-[6] h-full shadow-2xl ring-1 ring-[#B8933F]/30"
                    : "md:flex-1 h-full shadow-sm hover:shadow-md hover:brightness-105"
                }`}
                style={{
                  backgroundColor: "#1C1208",
                }}
              >
                {/* Background Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={isExpanded ? "(max-width: 1024px) 100vw, 65vw" : "160px"}
                  className={`object-cover object-center transition-transform duration-700 ease-out ${
                    isExpanded ? "scale-105" : "scale-100 group-hover:scale-110"
                  }`}
                  priority={index === 1}
                />

                {/* Gradient Dark Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${item.overlayGradient} transition-opacity duration-500`}
                />

                {/* ── 1. EXPANDED CARD VIEW (Clean Title, Tagline & Explore Link) ── */}
                <div
                  className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-end transition-all duration-500 ${
                    isExpanded
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="max-w-xl">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-montserrat font-medium text-white tracking-widest uppercase mb-3">
                      {item.number} / 06
                    </span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="font-serif-luxury text-base sm:text-xl lg:text-2xl text-[#F4E3C1] italic mt-2 drop-shadow-sm">
                      &ldquo;{item.tagline}&rdquo;
                    </p>
                    <div className="mt-5">
                      <Link
                        href={item.href || "/women"}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C1208] text-xs font-montserrat font-semibold tracking-wider uppercase shadow-md transition-all hover:scale-105"
                      >
                        <span>Explore Edit</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#B8933F]" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── 2. COLLAPSED CARD VIEW (Vertical Rotated Title Only) ── */}
                <div
                  className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-500 ${
                    !isExpanded
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full w-full py-6 text-white">
                    <div className="[writing-mode:vertical-rl] rotate-180 flex items-center justify-center">
                      <span className="text-xs sm:text-[13px] lg:text-sm font-bold uppercase tracking-[0.2em] text-white whitespace-nowrap drop-shadow-md">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

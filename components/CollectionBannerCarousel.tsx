"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BannerSlide } from "../lib/collectionPageConfig";

interface CollectionBannerCarouselProps {
  slides?: BannerSlide[];
  fallbackImage?: string;
  autoPlayInterval?: number;
}

export default function CollectionBannerCarousel({
  slides,
  fallbackImage = "/images/drop_cut_blue_banner.jpg",
  autoPlayInterval = 5000,
}: CollectionBannerCarouselProps) {
  // Normalize slides
  const activeSlides: BannerSlide[] =
    slides && slides.length > 0
      ? slides
      : [
          {
            id: "fallback-slide",
            image: fallbackImage,
            alt: "Luxury Fine Jewellery Collection",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = activeSlides.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [total, isPaused, autoPlayInterval, goToNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      goToNext();
    } else if (diff < -45) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="mb-4 sm:mb-6 relative w-full group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Carousel"
    >
      {/* Sleek Compact Banner Container - Image Only (Reduced Height) */}
      <div className="relative w-full h-[125px] sm:h-[170px] md:h-[200px] lg:h-[230px] xl:h-[250px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#181512] border border-[#EAE3D5] shadow-xs">
        {activeSlides.map((slide, idx) => {
          const isCurrent = idx === currentIndex;
          const content = (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt || `Promotional Banner ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                className="object-cover object-center w-full h-full"
              />
            </div>
          );

          if (slide.link) {
            return (
              <Link
                key={slide.id || idx}
                href={slide.link}
                className={isCurrent ? "cursor-pointer" : "pointer-events-none"}
              >
                {content}
              </Link>
            );
          }

          return content;
        })}

        {/* Navigation Arrows (shown if > 1 slide) */}
        {total > 1 && (
          <>
            {/* ── Big Transparent Nav Arrow: Left (Hover Only & Subtle) ── */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous slide"
              className="absolute left-1 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 text-white/30 hover:text-white/95 opacity-20 sm:opacity-0 sm:group-hover:opacity-70 hover:!opacity-100 transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-0"
            >
              <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11" strokeWidth={1.3} />
            </button>

            {/* ── Big Transparent Nav Arrow: Right (Hover Only & Subtle) ── */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next slide"
              className="absolute right-1 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 text-white/30 hover:text-white/95 opacity-20 sm:opacity-0 sm:group-hover:opacity-70 hover:!opacity-100 transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-0"
            >
              <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11" strokeWidth={1.3} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-4 sm:w-5 bg-[#B8933F]"
                      : "w-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

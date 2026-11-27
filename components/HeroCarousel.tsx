"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchBanners } from "../redux/slices/bannersSlice";

interface Slide {
  id: number | string;
  image: string;
  mobileImage?: string;
  link: string;
  title?: string;
  imageAlt?: string;
  // Legacy backward-compat fields:
  eyebrow?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/images/hero_woman_hd.jpg",
    mobileImage: "/images/hero_woman.jpg",
    link: "/women",
    title: "Woman In Golden Rings And Necklaces",
    imageAlt: "Woman In Golden Rings And Necklaces",
  },
  {
    id: 2,
    image: "/images/ZhaevaahHero.jpg",
    mobileImage: "/images/ZhaevaahHero-800.webp",
    link: "/women?category=Solitaire%20Rings",
    title: "Pure Brilliance Solitaire Collection",
    imageAlt: "Pure Brilliance Solitaire Collection",
  },
  {
    id: 3,
    image: "/images/collection.webp",
    mobileImage: "/images/collection.webp",
    link: "/women?category=Wedding%20%26%20Bridal%20Sets",
    title: "Handcrafted Royal Jewellery Symphony",
    imageAlt: "Handcrafted Royal Jewellery Symphony",
  },
];

export default function HeroCarousel() {
  const dispatch = useAppDispatch();
  const dbBanners = useAppSelector((state) => state.banners.items);

  const [slides, setSlides] = useState<Slide[]>(SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    dispatch(fetchBanners("HERO"));
  }, [dispatch]);

  useEffect(() => {
    if (dbBanners && dbBanners.length > 0) {
      const heroBanners = dbBanners.filter((b) => b.type === "HERO");
      if (heroBanners.length > 0) {
        setSlides(
          heroBanners.map((b: any, i: number) => ({
            id: b.id || i + 1,
            image: b.image || "/images/hero_woman_hd.jpg",
            mobileImage: b.mobileImage || b.image || "/images/hero_woman_hd.jpg",
            link: (b.link ? b.link.replace("/shop", "/women") : "") || b.buttonLink || "/women",
            title: b.title || `Hero Slide ${i + 1}`,
            imageAlt: b.title || `Hero Slide ${i + 1}`,
          }))
        );
      }
    }
  }, [dbBanners]);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_custom_hero_slides");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(
              parsed.map((s: any, i: number) => ({
                id: s.id || i + 1,
                image: s.image || "/images/hero_woman_hd.jpg",
                mobileImage: s.mobileImage || s.image || "/images/hero_woman.jpg",
                link: (s.link ? s.link.replace("/shop", "/women") : "") || s.buttonLink || "/women",
                title: s.title || `Hero Slide ${i + 1}`,
                imageAlt: s.title || `Hero Slide ${i + 1}`,
              }))
            );
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    window.addEventListener("zhaevaah-hero-updated", loadCustom);
    return () => {
      window.removeEventListener("zhaevaah-home-updated", loadCustom);
      window.removeEventListener("zhaevaah-hero-updated", loadCustom);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlide, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[#FAF9F7] select-none group -mt-16 md:-mt-[72px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Storefront Hero Showcase"
    >
      {/* ── Responsive Dual-Ratio Container: Mobile 4:3 / Tablet 16:9 / Desktop 21:9 Widescreen (Image Only, Clickable) ── */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] overflow-hidden bg-[#181512]">
        {slides.map((slide, index) => {
          const isCurrent = index === currentSlide;
          const slideHref = slide.link || slide.buttonLink || "/women";

          return (
            <Link
              key={slide.id}
              href={slideHref}
              aria-label={slide.title || `Hero banner slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full block transition-opacity duration-700 ease-in-out cursor-pointer ${
                isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Separate Mobile Image if available for small screen ratio */}
              {slide.mobileImage && slide.mobileImage !== slide.image ? (
                <>
                  <div className="block md:hidden relative w-full h-full">
                    <Image
                      src={slide.mobileImage}
                      alt={slide.imageAlt || slide.title || "Jewellery Collection Banner"}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 1px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="hidden md:block relative w-full h-full">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt || slide.title || "Jewellery Collection Banner"}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 769px) 100vw, 1px"
                      className="object-cover object-center"
                    />
                  </div>
                </>
              ) : (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt || slide.title || "Jewellery Collection Banner"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )}
            </Link>
          );
        })}

        {/* ── Navigation Arrows ── */}
        {slides.length > 1 && (
          <>
            {/* ── Big Transparent Nav Arrow: Left (Hover Only & Subtle) ── */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous slide"
              className="absolute left-1 sm:left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white/95 opacity-20 sm:opacity-0 sm:group-hover:opacity-70 hover:!opacity-100 transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-0"
            >
              <ChevronLeft className="w-9 h-9 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20" strokeWidth={1.2} />
            </button>

            {/* ── Big Transparent Nav Arrow: Right (Hover Only & Subtle) ── */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next slide"
              className="absolute right-1 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white/95 opacity-20 sm:opacity-0 sm:group-hover:opacity-70 hover:!opacity-100 transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-0"
            >
              <ChevronRight className="w-9 h-9 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20" strokeWidth={1.2} />
            </button>

            {/* ── Dot Indicators ── */}
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 sm:space-x-2 bg-black/40 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    index === currentSlide
                      ? "w-4 sm:w-5 h-1 sm:h-1.5 bg-[#B8933F]"
                      : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/60 hover:bg-white"
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

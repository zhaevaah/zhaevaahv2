"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchBanners } from "../redux/slices/bannersSlice";

interface Slide {
  id: number | string;
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    eyebrow: "THIS WEEK'S HIGHLIGHTS",
    title: "Woman In Golden Rings And Necklaces",
    subtitle: "Awesome products for the dynamic urban lifestyle",
    buttonText: "SHOP NOW",
    buttonLink: "/shop",
    image: "/images/hero_woman_hd.jpg",
    imageAlt: "Woman In Golden Rings And Necklaces",
  },
  {
    id: 2,
    eyebrow: "EXCLUSIVE SOLITAIRE EDIT",
    title: "Pure Brilliance In Every Facet & Curve",
    subtitle: "Certified natural diamonds handset in 18kt hallmarked yellow gold",
    buttonText: "EXPLORE NOW",
    buttonLink: "/shop?category=Solitaire%20Rings",
    image: "/images/ZhaevaahHero.jpg",
    imageAlt: "Pure Brilliance Solitaire Collection",
  },
  {
    id: 3,
    eyebrow: "HERITAGE & ROYAL LUXURY",
    title: "Timeless Symphony Of Gold & Gems",
    subtitle: "Intricately crafted artisanal masterpieces celebrating golden memories",
    buttonText: "VIEW COLLECTION",
    buttonLink: "/shop?category=Wedding%20%26%20Bridal%20Sets",
    image: "/images/collection.webp",
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
            eyebrow: b.badge || "THIS WEEK'S HIGHLIGHTS",
            title: b.title,
            subtitle: b.subtitle || "",
            buttonText: b.ctaText || "SHOP NOW",
            buttonLink: b.link || "/shop",
            image: b.image || "/images/hero_woman_hd.jpg",
            imageAlt: b.title,
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
            setSlides(parsed);
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-home-updated", loadCustom);
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
      }, 3000);
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

  const active = slides[currentSlide] || slides[0] || SLIDES[0];

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[#FAF9F7] -mt-16 md:-mt-[72px] pt-16 md:pt-[72px] min-h-[560px] sm:min-h-[600px] md:min-h-[640px] lg:min-h-[700px] xl:min-h-[760px] flex flex-col justify-end md:justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Full Width & Full Height Background Slide Images ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt || slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-right"
            />
          </div>
        ))}
      </div>

      {/* ── Slide Text Content & CTA (Positioned at bottom on mobile, responsive text & button) ── */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <div key={active.id} className="animate-fadeIn transition-all duration-500">
            {/* Eyebrow */}
            <span className="text-[10px] sm:text-xs md:text-[13px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.22em] text-[#B8933F] block mb-2 sm:mb-3">
              {active.eyebrow}
            </span>

            {/* Title - Responsive typography */}
            <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-5xl lg:text-[54px] xl:text-[58px] font-bold text-[#1C1208] leading-[1.18] sm:leading-[1.14] mb-2 sm:mb-4 tracking-tight">
              {active.title}
            </h1>

            {/* Subtitle - Responsive */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#524B43] font-normal max-w-sm sm:max-w-md md:max-w-lg mb-5 sm:mb-7 md:mb-8 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {active.subtitle}
            </p>

            {/* CTA Button - Responsive */}
            <div>
              <Link
                href={active.buttonLink}
                className="inline-flex items-center justify-center px-6 py-2.5 sm:px-8 sm:py-3.5 md:px-9 md:py-4 bg-[#B8933F] hover:bg-[#9E792B] text-white text-[11px] sm:text-xs md:text-sm uppercase font-bold tracking-[0.18em] sm:tracking-[0.2em] rounded-xs shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
              >
                {active.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-2.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-[#B8933F]"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#D1CBC3] hover:bg-[#A89F95]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_GRID = [
  {
    subtitle: "DIAMOND RINGS",
    title: "Yellow Gold & Diamond Ring",
    image: "/images/category_rings.jpg",
    link: "/shop?category=Diamond%20Rings",
    cta: "SHOP NOW",
  },
  {
    subtitle: "DIAMOND BRACELETS",
    title: "Infinity Diamond Bracelet",
    image: "/images/category_bracelet.jpg",
    link: "/shop?category=Diamond%20Bracelets",
    cta: "SHOP NOW",
  },
  {
    subtitle: "DIAMOND PENDANT",
    title: "Teardrop Diamond Pendant",
    image: "/images/category_pendant.jpg",
    link: "/shop?category=Diamond%20Pendant",
    cta: "SHOP NOW",
  },
];

export default function CategoryGrid() {
  const [grid, setGrid] = useState(DEFAULT_GRID);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_custom_category_grid");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setGrid(parsed);
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-home-updated", loadCustom);
  }, []);

  const card1 = grid[0] || DEFAULT_GRID[0];
  const card2 = grid[1] || DEFAULT_GRID[1];
  const card3 = grid[2] || DEFAULT_GRID[2];

  return (
    <section id="categories" className="w-full py-6 sm:py-10 md:py-16 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
          
          {/* 1. Left Tall Banner: Diamond Rings */}
          <div className="md:col-span-6 group relative bg-[#F7F6F4] overflow-hidden min-h-[190px] sm:min-h-[280px] md:min-h-[480px] flex items-center">
            {/* Background / Side Image */}
            <div className="absolute inset-0">
              <Image
                src={card1.image}
                alt={card1.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-left-bottom sm:object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7F6F4]/40 to-[#F7F6F4]/95 md:to-[#F7F6F4]/90" />
            </div>

            {/* Content overlay on right */}
            <div className="relative z-10 ml-auto w-full max-w-[210px] sm:max-w-[280px] md:max-w-[320px] p-4 sm:p-7 md:p-10 text-right md:text-left flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1 sm:mb-2 md:mb-3">
                {card1.subtitle}
              </span>
              <h3 className="font-serif-luxury text-lg sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1C1208] leading-tight mb-2 sm:mb-4 group-hover:text-[#B8933F] transition-colors">
                {card1.title}
              </h3>
              <div>
                <Link
                  href={card1.link}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase font-medium tracking-[0.16em] text-[#1C1208] group-hover:text-[#B8933F] transition-colors border-b border-[#1C1208] group-hover:border-[#B8933F] pb-0.5 sm:pb-1"
                >
                  <span>{card1.cta || "SHOP NOW"}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: 2 stacked landscape banners */}
          <div className="md:col-span-6 flex flex-col gap-3 sm:gap-6">
            
            {/* 2. Top Right Banner: Diamond Bracelets */}
            <div className="group relative bg-[#F7F6F4] overflow-hidden min-h-[140px] sm:min-h-[190px] md:min-h-[228px] flex items-center">
              <div className="absolute inset-0">
                <Image
                  src={card2.image}
                  alt={card2.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-left sm:object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7F6F4]/30 to-[#F7F6F4]/90" />
              </div>

              <div className="relative z-10 ml-auto w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] p-4 sm:p-6 md:p-8 text-right md:text-left flex flex-col justify-center">
                <span className="text-[10px] sm:text-[11px] uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1 sm:mb-2">
                  {card2.subtitle}
                </span>
                <h3 className="font-serif-luxury text-base sm:text-xl md:text-2xl font-bold text-[#1C1208] leading-snug mb-2 sm:mb-3 group-hover:text-[#B8933F] transition-colors">
                  {card2.title}
                </h3>
                <div>
                  <Link
                    href={card2.link}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase font-medium tracking-[0.16em] text-[#1C1208] group-hover:text-[#B8933F] transition-colors border-b border-[#1C1208] group-hover:border-[#B8933F] pb-0.5 sm:pb-1"
                  >
                    <span>{card2.cta || "SHOP NOW"}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Bottom Right Banner: Diamond Pendant */}
            <div className="group relative bg-[#F7F6F4] overflow-hidden min-h-[140px] sm:min-h-[190px] md:min-h-[228px] flex items-center">
              <div className="absolute inset-0">
                <Image
                  src={card3.image}
                  alt={card3.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-left sm:object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7F6F4]/30 to-[#F7F6F4]/90" />
              </div>

              <div className="relative z-10 ml-auto w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] p-4 sm:p-6 md:p-8 text-right md:text-left flex flex-col justify-center">
                <span className="text-[10px] sm:text-[11px] uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1 sm:mb-2">
                  {card3.subtitle}
                </span>
                <h3 className="font-serif-luxury text-base sm:text-xl md:text-2xl font-bold text-[#1C1208] leading-snug mb-2 sm:mb-3 group-hover:text-[#B8933F] transition-colors">
                  {card3.title}
                </h3>
                <div>
                  <Link
                    href={card3.link}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase font-medium tracking-[0.16em] text-[#1C1208] group-hover:text-[#B8933F] transition-colors border-b border-[#1C1208] group-hover:border-[#B8933F] pb-0.5 sm:pb-1"
                  >
                    <span>{card3.cta || "SHOP NOW"}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}


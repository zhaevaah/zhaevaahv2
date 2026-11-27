"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface CircularCategoryItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  link: string;
  badge?: string;
}

const CIRCULAR_CATEGORIES: CircularCategoryItem[] = [
  {
    id: "rings",
    name: "Rings",
    tagline: "Diamond & Gold",
    image: "/category/ring.webp",
    link: "/women?category=Diamond%20Rings",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    tagline: "Tennis & Charm",
    image: "/category/bracelet.webp",
    link: "/women?category=Diamond%20Bracelets",
  },
  {
    id: "neck-chains",
    name: "Neck Chains",
    tagline: "Pendants & Chains",
    image: "/category/chain.webp",
    link: "/women?category=Necklaces%20%26%20Pendants",
  },
  {
    id: "necklace-sets",
    name: "Necklace Sets",
    tagline: "Bridal & Heritage",
    image: "/category/necklace.webp",
    link: "/women?category=Wedding%20%26%20Bridal%20Sets",
  },
  {
    id: "bangles",
    name: "Bangles",
    tagline: "Artisanal 18kt",
    image: "/category/bangles.webp",
    link: "/women?category=Diamond%20Bracelets",
  },
  {
    id: "mens-rings",
    name: "Men's Rings",
    tagline: "Signets & Bands",
    image: "/category/men_ring.webp",
    link: "/men?category=Men%27s%20Rings",
    badge: "MEN",
  },
  {
    id: "mens-bracelets",
    name: "Men's Bracelets",
    tagline: "Cuban & Kadas",
    image: "/category/men_bracelet.webp",
    link: "/men?category=Men%27s%20Bracelets%20%26%20Kadas",
    badge: "MEN",
  },
  {
    id: "mens-chains",
    name: "Men's Chains",
    tagline: "Solid Gold Links",
    image: "/category/men_chain.webp",
    link: "/men?category=Chains%20%26%20Pendants",
    badge: "MEN",
  },
];

const DEFAULT_GRID = [
  {
    subtitle: "DIAMOND RINGS",
    title: "Yellow Gold & Diamond Ring",
    image: "/images/category_rings.jpg",
    link: "/women?category=Diamond%20Rings",
    cta: "SHOP NOW",
  },
  {
    subtitle: "DIAMOND BRACELETS",
    title: "Infinity Diamond Bracelet",
    image: "/images/category_bracelet.jpg",
    link: "/women?category=Diamond%20Bracelets",
    cta: "SHOP NOW",
  },
  {
    subtitle: "DIAMOND PENDANT",
    title: "Teardrop Diamond Pendant",
    image: "/images/category_pendant.jpg",
    link: "/women?category=Necklaces%20%26%20Pendants",
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
            const sanitized = parsed.map((item: any) => ({
              ...item,
              link: item.link ? item.link.replace("/shop", "/women") : "/women",
            }));
            setGrid(sanitized);
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-home-updated", loadCustom);
  }, []);

  const promoCards = [
    grid[0] || DEFAULT_GRID[0],
    grid[1] || DEFAULT_GRID[1],
    grid[2] || DEFAULT_GRID[2],
  ];

  return (
    <section id="categories" className="w-full pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Circular Categories Full Width Ribbon ── */}
        <div className="w-full mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-start justify-start md:justify-between gap-3 sm:gap-5 md:gap-4 lg:gap-6 xl:gap-8 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-1 px-1 -mx-4 px-4 sm:mx-0 sm:px-1">
            {CIRCULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer w-[72px] sm:w-[84px] md:w-[94px] lg:w-[108px]"
              >
                {/* Outer Ring with subtle gold gradient & hover shine */}
                <div className="relative w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] lg:w-[94px] lg:h-[94px] rounded-full p-[2px] bg-gradient-to-tr from-[#EAE3D5] via-[#B8933F]/40 to-[#EAE3D5] group-hover:from-[#B8933F] group-hover:via-[#E8D9B5] group-hover:to-[#9E792B] transition-all duration-300 shadow-none group-hover:shadow-md flex items-center justify-center">
                  {/* Inner Image Container */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF7F2] relative">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 64px, 94px"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Optional Badge for Men's Collection */}
                  {cat.badge && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1C1208] text-[#E8D9B5] text-[7.5px] sm:text-[8.5px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-[#B8933F]/40 shadow-xs z-10 leading-none">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Category Title */}
                <span className="font-montserrat text-[11px] sm:text-xs font-semibold text-[#1C1208] group-hover:text-[#B8933F] text-center mt-2 block leading-tight tracking-tight transition-colors line-clamp-1 max-w-[72px] sm:max-w-[84px] md:max-w-[94px] lg:max-w-[108px]">
                  {cat.name}
                </span>

                {/* Tagline */}
                <span className="font-poppins text-[9px] sm:text-[10px] text-[#8C827A] text-center block mt-0.5 leading-tight tracking-tight line-clamp-1 max-w-[72px] sm:max-w-[84px] md:max-w-[94px] lg:max-w-[108px]">
                  {cat.tagline}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── 3. Editorial Promo 3-Tile Banner Cards (Pure Image-Only: Horizontal Scroll Slider on Mobile, 3-Column on Big Screen) ── */}
        <div className="relative w-full">
          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth gap-3 sm:gap-4 md:gap-5 lg:gap-6 md:grid-cols-3 -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0">
            {promoCards.map((card, idx) => (
              <Link
                key={card.link + idx}
                href={card.link}
                aria-label={card.title || `Category Banner ${idx + 1}`}
                className="group relative block shrink-0 w-[82vw] sm:w-[320px] md:w-auto snap-center aspect-[2.4/1] sm:aspect-[2.4/1] md:aspect-[2.3/1] rounded-xl sm:rounded-2xl overflow-hidden border border-[#EAE3D5]/80 bg-[#FAF9F7] shadow-xs hover:shadow-md transition-all duration-300 active:scale-[0.99]"
              >
                <Image
                  src={card.image}
                  alt={card.title || `Promotional banner ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 82vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>

          {/* Mobile Swipe Indicator Dots */}
          <div className="flex md:hidden justify-center items-center gap-1.5 mt-2.5">
            {promoCards.map((_, idx) => (
              <span
                key={idx}
                className="w-1.5 h-1.5 rounded-full bg-[#D6CEC1]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


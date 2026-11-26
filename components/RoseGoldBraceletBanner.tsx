"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_BRACELET_BANNER = {
  subtitle: "DIAMOND BRACELETS",
  title: "Rose Gold With Diamond Hotsell Bracelet",
  image: "/images/bracelet_hotsell_banner.jpg",
  link: "/shop?category=Diamond%20Bracelets",
  cta: "SHOP NOW",
};

export default function RoseGoldBraceletBanner() {
  const [banner, setBanner] = useState(DEFAULT_BRACELET_BANNER);

  useEffect(() => {
    const loadCustom = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_custom_bracelet_banner");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.title) {
            setBanner(parsed);
          }
        }
      } catch {}
    };
    loadCustom();

    window.addEventListener("zhaevaah-home-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-home-updated", loadCustom);
  }, []);

  return (
    <section className="w-full pb-8 sm:pb-14 md:pb-20 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="group relative bg-[#F7F6F4] rounded-xs border border-[#eae6de]/70 overflow-hidden min-h-[140px] sm:min-h-[200px] md:min-h-[280px] flex items-center">
          
          {/* Left Content */}
          <div className="relative z-10 w-full sm:w-3/5 md:w-1/2 p-4 sm:p-8 lg:p-14 flex flex-col justify-center">
            <span className="font-poppins text-[10px] sm:text-xs uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1.5 sm:mb-3">
              {banner.subtitle}
            </span>
            <h3 className="font-serif-luxury text-base sm:text-2xl md:text-3xl lg:text-[34px] font-bold text-[#1C1208] leading-tight mb-2 sm:mb-4 group-hover:text-[#B8933F] transition-colors">
              {banner.title}
            </h3>
            <div>
              <Link
                href={banner.link}
                className="inline-flex items-center gap-1.5 font-poppins text-[11px] sm:text-xs uppercase font-medium tracking-[0.16em] text-[#1C1208] group-hover:text-[#B8933F] transition-colors border-b border-[#1C1208] group-hover:border-[#B8933F] pb-0.5 sm:pb-1"
              >
                <span>{banner.cta || "SHOP NOW"}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Product Image */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-2/5 md:w-1/2 flex items-center justify-end pr-2 sm:pr-4 lg:pr-8">
            <div className="relative w-full h-full max-h-[140px] sm:max-h-[200px] md:max-h-[260px]">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 40vw, 350px"
                className="object-contain object-right transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


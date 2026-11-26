"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdBannerDouble() {
  return (
    <section className="w-full py-6 sm:py-10 md:py-14 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          
          {/* Left Banner: Women's Rose Gold Necklace */}
          <div className="group relative bg-[#F7F6F4] rounded-xs overflow-hidden min-h-[160px] sm:min-h-[220px] md:min-h-[280px] flex items-center p-4 sm:p-7 lg:p-10 transition-shadow hover:shadow-md">
            {/* Left Content */}
            <div className="relative z-10 w-3/5 sm:w-1/2 flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1.5 sm:mb-3 font-poppins">
                STYLISH NECKLACE
              </span>
              <h3 className="font-serif-luxury text-base sm:text-xl md:text-2xl lg:text-[28px] font-bold text-[#1C1208] leading-tight mb-3 sm:mb-5 group-hover:text-[#B8933F] transition-colors">
                Women's Rose Gold Necklace
              </h3>
              <div>
                <Link
                  href="/shop?category=Necklaces%20%26%20Pendants"
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-[#B8933F] hover:bg-[#9E792B] text-white text-[10px] sm:text-xs uppercase font-medium tracking-[0.16em] rounded-xs shadow-xs transition-all active:scale-95"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 flex items-center justify-center p-2 sm:p-4">
              <div className="relative w-full h-full max-h-[150px] sm:max-h-[200px] md:max-h-[240px]">
                <Image
                  src="/images/ad_necklace.png"
                  alt="Women's Rose Gold Necklace"
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 240px"
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>
            </div>
          </div>

          {/* Right Banner: Rose Gold Ring For Women */}
          <div className="group relative bg-[#F7F6F4] rounded-xs overflow-hidden min-h-[160px] sm:min-h-[220px] md:min-h-[280px] flex items-center p-4 sm:p-7 lg:p-10 transition-shadow hover:shadow-md">
            {/* Left Content */}
            <div className="relative z-10 w-3/5 sm:w-1/2 flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs uppercase font-medium tracking-[0.2em] text-[#767069] block mb-1.5 sm:mb-3 font-poppins">
                BEST WEDDING RING
              </span>
              <h3 className="font-serif-luxury text-base sm:text-xl md:text-2xl lg:text-[28px] font-bold text-[#1C1208] leading-tight mb-3 sm:mb-5 group-hover:text-[#B8933F] transition-colors">
                Rose Gold Ring For Women
              </h3>
              <div>
                <Link
                  href="/shop?category=Necklaces%20%26%20Pendants"
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-[#B8933F] hover:bg-[#9E792B] text-white text-[10px] sm:text-xs uppercase font-medium tracking-[0.16em] rounded-xs shadow-xs transition-all active:scale-95"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 flex items-center justify-center p-2 sm:p-4">
              <div className="relative w-full h-full max-h-[150px] sm:max-h-[200px] md:max-h-[240px]">
                <Image
                  src="/images/ad_ring.png"
                  alt="Rose Gold Ring For Women"
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 240px"
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


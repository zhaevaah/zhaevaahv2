"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";
import { Sparkles, ShieldCheck, Gem, Award, HeartHandshake, ArrowRight, Check } from "lucide-react";

function AboutPageContent() {
  return (
    <div className="w-full bg-white font-poppins">
      
      {/* ── 1. Brand Hero Banner ── */}
      <section className="relative w-full bg-[#FAF9F7] py-14 sm:py-20 lg:py-24 border-b border-[#EAE3D5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-3">
            OUR STORY & HERITAGE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] leading-tight mb-5">
            The Soul of Elegance: Handcrafting Timeless Brilliance
          </h1>
          <p className="text-xs sm:text-base text-[#6E675F] font-light leading-relaxed max-w-2xl mx-auto">
            Founded with an enduring passion for authentic beauty, ZHAEVAAH blends generational goldsmith heritage with precision modern design to create heirloom jewellery celebrating life’s greatest milestones.
          </p>
        </div>
      </section>

      {/* ── 2. Brand Narrative Grid ── */}
      <section className="w-full py-12 sm:py-18 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative rounded-xs overflow-hidden min-h-[320px] sm:min-h-[420px] bg-[#F5EFE6]">
              <Image
                src="/images/collection.webp"
                alt="ZHAEVAAH Handcrafted Jewellery Masterpiece"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6C673] block mb-1">
                  100% BIS HALLMARKED & IGI CERTIFIED
                </span>
                <p className="font-serif-luxury text-xl sm:text-2xl font-bold leading-snug">
                  Every stone is individually hand-selected for extraordinary fire and clarity.
                </p>
              </div>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B8933F] block">
                BORN FROM PASSION
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1208] leading-tight">
                Where Artisanal Heritage Meets Modern Perfection
              </h2>
              <p className="text-xs sm:text-sm text-[#5A524A] leading-relaxed">
                At ZHAEVAAH, we believe fine jewellery is more than an adornment; it is an intimate expression of individuality and love. Every ring, bracelet, necklace, and earring begins with conflict-free natural diamonds, handset by master artisans whose families have shaped royal jewellery for generations.
              </p>
              <p className="text-xs sm:text-sm text-[#5A524A] leading-relaxed">
                We operate on an ethos of uncompromising purity. Every gram of gold is rigorously tested for BIS hallmarked authenticity, and every diamond carries certified gemological credentials guaranteeing color, cut, clarity, and carat weight.
              </p>

              {/* 3 Value Points */}
              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#B8933F]/10 text-[#B8933F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#1C1208] font-medium">
                    100% Conflict-Free Natural Diamonds compliant with the Kimberley Process
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#B8933F]/10 text-[#B8933F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#1C1208] font-medium">
                    Government BIS Hallmarked 18kt & 22kt Gold with laser hallmark engraving
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#B8933F]/10 text-[#B8933F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#1C1208] font-medium">
                    Complimentary lifetime inspection, ultrasonic cleaning & 100% gold exchange
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-bold tracking-[0.18em] rounded-xs shadow-md transition-all active:scale-95"
                >
                  <span>Explore The Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Four Core Pillars of Excellence ── */}
      <section className="w-full py-14 sm:py-18 bg-[#FAF9F7] border-t border-b border-[#EAE3D5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208] tracking-tight mb-2">
              The ZHAEVAAH Standards of Purity
            </h2>
            <p className="text-xs sm:text-sm text-[#767069] font-light">
              Crafted without shortcuts, certified without exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
                <Gem className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-2">
                Certified Diamonds
              </h3>
              <p className="text-xs text-[#6E675F] leading-relaxed">
                Certified by renowned global laboratories (IGI & GIA) detailing exact cut, color, clarity, and carat weight.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-2">
                BIS Hallmarked Gold
              </h3>
              <p className="text-xs text-[#6E675F] leading-relaxed">
                Government registered BIS 750 (18kt) and 916 (22kt) purity hallmarking stamped on each creation.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
                <Award className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-2">
                Master Craftsmanship
              </h3>
              <p className="text-xs text-[#6E675F] leading-relaxed">
                Hand-finished by third-generation master jewelers with microscope prong setting and flawless polish.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-2">
                100% Guaranteed Buyback
              </h3>
              <p className="text-xs text-[#6E675F] leading-relaxed">
                Complete lifetime peace of mind with guaranteed 100% prevailing gold value on exchange and buyback.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default function AboutPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <AboutPageContent />
        </main>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <Toast />
      </div>
    </StoreProvider>
  );
}


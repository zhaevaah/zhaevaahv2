"use client";

import React from "react";
import Link from "next/link";
import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";
import { RefreshCw, ShieldCheck, BadgePercent, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

function RefundPageContent() {
  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            100% PEACE OF MIND GUARANTEE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Returns, Refunds & Lifetime Buyback
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Every creation purchased from ZHAEVAAH comes with a 15-day no-questions-asked return policy and an unconditional lifetime exchange & buyback guarantee.
          </p>
        </div>

        {/* 3 Core Guarantee Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1208] mb-2">
              15-Day 100% Return
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              If you are not thoroughly captivated by your jewellery, return it within 15 days for a 100% full refund with zero restocking fees.
            </p>
          </div>

          <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <BadgePercent className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1208] mb-2">
              100% Gold Value Buyback
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              Lifetime exchange of 100% prevailing net gold rate and 90% prevailing diamond market value against any future piece.
            </p>
          </div>

          <div className="bg-white p-7 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1208] mb-2">
              Free Insured Reverse Pickup
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              We arrange an armored courier pickup directly from your doorstep under full transit insurance at no cost to you.
            </p>
          </div>

        </div>

        {/* Detailed Sections */}
        <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-10 space-y-8">
          
          {/* Section 1: 3-Step Return Process */}
          <div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208] mb-4">
              How to Initiate a 15-Day Return
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#FAF9F7] p-5 rounded-xs border border-[#EAE3D5]">
                <span className="text-xs font-bold text-[#B8933F] uppercase tracking-wider block mb-1">
                  Step 1
                </span>
                <h4 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
                  Request a Return
                </h4>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  Log in to your account under <Link href="/profile?tab=orders" className="text-[#B8933F] font-semibold underline">My Orders</Link> and select &ldquo;Request Return&rdquo;, or email <a href="mailto:concierge@zhaevaah.com" className="text-[#B8933F] underline">concierge@zhaevaah.com</a>.
                </p>
              </div>

              <div className="bg-[#FAF9F7] p-5 rounded-xs border border-[#EAE3D5]">
                <span className="text-xs font-bold text-[#B8933F] uppercase tracking-wider block mb-1">
                  Step 2
                </span>
                <h4 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
                  Armored Pickup
                </h4>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  Our logistics partner will arrive at your address with a tamper-proof security bag. Hand over the unworn piece with original certification.
                </p>
              </div>

              <div className="bg-[#FAF9F7] p-5 rounded-xs border border-[#EAE3D5]">
                <span className="text-xs font-bold text-[#B8933F] uppercase tracking-wider block mb-1">
                  Step 3
                </span>
                <h4 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
                  Fast 48-Hour Refund
                </h4>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  Once our gemologists verify authenticity at the vault, 100% of your funds are credited directly to your bank account or card within 48 hours.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Lifetime Exchange & Buyback Policy */}
          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208] mb-3">
              Lifetime Exchange & Buyback Terms
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#5A524A] leading-relaxed">
              <p>
                Fine jewellery is an enduring investment. ZHAEVAAH offers a transparent, market-linked Lifetime Exchange and Buyback policy on all authentic jewellery stamped with our hallmark:
              </p>
              <ul className="space-y-2.5 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8933F] flex-shrink-0 mt-0.5" />
                  <span><strong>Gold Value:</strong> 100% value of the gold weight based on the prevailing benchmark gold rate on the day of exchange/buyback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8933F] flex-shrink-0 mt-0.5" />
                  <span><strong>Diamond Value:</strong> 90% of prevailing market diamond value on exchange against a new creation (80% on pure cash buyback).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8933F] flex-shrink-0 mt-0.5" />
                  <span><strong>Certification Required:</strong> Original IGI / GIA / SGL certificate and purchase invoice must accompany the piece during valuation.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function RefundPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <RefundPageContent />
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


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
import { Truck, ShieldCheck, Lock, Clock, PackageCheck, Globe, CheckCircle2 } from "lucide-react";

function ShippingContent() {
  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            DELIVERY POLICIES & SECURITY
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Insured Shipping & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Every creation is dispatched under 100% transit insurance in tamper-evident security packaging, ensuring safe transit from our vault directly to your hands.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
              100% Transit Insured
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              Every shipment is fully insured by national carriers against theft, loss, or transit damage until verified delivery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
              Tamper-Evident Box
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              Packaged in discrete, non-descript outer security cartons with reinforced holographic security seals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
              Armored Couriers
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              Handled via specialized high-value carriers: Sequel Logistics, BVC Armored, and Blue Dart Apex express.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xs border border-[#EAE3D5] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mb-4">
              <PackageCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1.5">
              OTP & ID Verification
            </h3>
            <p className="text-xs text-[#6E675F] leading-relaxed">
              Delivered exclusively against an encrypted one-time SMS password (OTP) and recipient signature verification.
            </p>
          </div>

        </div>

        {/* Detailed Guidelines Section */}
        <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-10 space-y-8">
          
          <div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208] mb-3">
              Delivery Timelines & Order Processing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#5A524A] leading-relaxed">
              <div className="bg-[#FAF9F7] p-5 rounded-xs border border-[#EAE3D5]/80 space-y-2">
                <div className="flex items-center gap-2 text-[#B8933F] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Ready-To-Ship Designs (2 to 4 Days)</span>
                </div>
                <p>
                  Products in stock undergo pre-dispatch gemological verification and are handed over to express armored couriers within 24 hours. Typical transit time to major metro cities is 48 to 72 hours.
                </p>
              </div>

              <div className="bg-[#FAF9F7] p-5 rounded-xs border border-[#EAE3D5]/80 space-y-2">
                <div className="flex items-center gap-2 text-[#B8933F] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Bespoke & Custom Sizes (7 to 10 Days)</span>
                </div>
                <p>
                  Special ring sizes, personalized laser engravings, and bespoke bridal pieces are handcrafted from molten gold, set under microscopes, and submitted for government BIS hallmarking prior to armored dispatch.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208] mb-3">
              Shipping Rates & Coverage
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-[#5A524A]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <span><strong>Complimentary Pan-India Shipping:</strong> All domestic orders above ₹4,999 qualify for 100% free doorstep delivery with complete transit insurance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <span><strong>International Delivery:</strong> We ship worldwide across USA, UK, UAE, Australia, and Singapore via FedEx Priority Armored Service. Customs duties and taxes are calculated transparently at checkout.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <span><strong>Real-Time Tracking:</strong> As soon as your order leaves our vault, an SMS and Email notification with the live tracking link (Air Waybill Number) is instantly dispatched.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif-luxury text-base font-bold text-[#1C1208]">
                Need to track an ongoing shipment?
              </p>
              <p className="text-xs text-[#767069]">
                Enter your order number on our live tracking page.
              </p>
            </div>
            <Link
              href="/order-status"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-bold tracking-wider rounded-xs transition-colors"
            >
              Track Order Status →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ShippingPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <ShippingContent />
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


"use client";

import React, { useState } from "react";
import Link from "next/link";
import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";
import { Package, Search, CheckCircle2, Truck, ShieldCheck, Clock, MapPin, ArrowRight } from "lucide-react";

function OrderStatusContent() {
  const [orderId, setOrderId] = useState("ZH-89421");
  const [contact, setContact] = useState("user@example.com");
  const [isSearched, setIsSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearched(true);
  };

  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            REAL-TIME VAULT & ARMORED LOGISTICS
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Enter your unique Order Reference Number and registered email or phone to view live production and insured dispatch progress.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ZH-89421"
                className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                Phone Number or Email *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="registered@email.com"
                className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-bold tracking-wider rounded-xs shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Timeline Result Display */}
        {isSearched && (
          <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-10 shadow-xs space-y-8 animate-fadeIn">
            
            {/* Top Order Details Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D5] pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8933F] bg-[#B8933F]/10 px-2 py-0.5 rounded-xs">
                  IN TRANSIT · ARMORED COURIER
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208] mt-1.5">
                  Order #{orderId || "ZH-89421"}
                </h3>
                <p className="text-xs text-[#767069]">
                  Courier: <strong>Sequel Logistics Secure Armored</strong> · AWB: <strong>SQL-982410294</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#767069] block">Estimated Delivery:</span>
                <span className="text-sm sm:text-base font-bold text-[#1C1208]">
                  Tomorrow, by 6:00 PM
                </span>
              </div>
            </div>

            {/* Step-by-Step Progress Bar */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#B8933F]/40 space-y-8 my-4">
              
              {/* Step 1: Placed */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#B8933F] text-white flex items-center justify-center text-xs ring-4 ring-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#1C1208]">
                  Order Placed & Payment Confirmed
                </h4>
                <p className="text-xs text-[#767069] mt-0.5">
                  100% verified via Razorpay Secure Gateway · Order assigned to senior master jeweler.
                </p>
                <span className="text-[11px] text-[#A89F95] mt-1 block">Nov 12, 2026 at 02:45 PM</span>
              </div>

              {/* Step 2: Quality & Hallmarking */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#B8933F] text-white flex items-center justify-center text-xs ring-4 ring-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#1C1208]">
                  BIS Hallmarking & IGI Gemological Inspection Passed
                </h4>
                <p className="text-xs text-[#767069] mt-0.5">
                  Assaying completed with laser HUID stamping · Diamond certified under gemological microscope.
                </p>
                <span className="text-[11px] text-[#A89F95] mt-1 block">Nov 13, 2026 at 11:20 AM</span>
              </div>

              {/* Step 3: Vault Packing & Handover */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#B8933F] text-white flex items-center justify-center text-xs ring-4 ring-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#1C1208]">
                  Vault Packaged in Tamper-Proof Security Box
                </h4>
                <p className="text-xs text-[#767069] mt-0.5">
                  Dispatched under 100% full transit insurance with holographic security seal intact.
                </p>
                <span className="text-[11px] text-[#A89F95] mt-1 block">Nov 13, 2026 at 06:15 PM</span>
              </div>

              {/* Step 4: In Transit (Active) */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center text-xs ring-4 ring-white shadow-xs animate-pulse">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#2A9D8F]">
                  In Transit · In Armored Hub
                </h4>
                <p className="text-xs text-[#5A524A] mt-0.5">
                  Package arrived at local armored distribution hub. Scheduled for secure doorstep OTP handover.
                </p>
                <span className="text-[11px] text-[#2A9D8F] font-semibold mt-1 block">Expected by Tomorrow 6:00 PM</span>
              </div>

              {/* Step 5: Doorstep Delivery */}
              <div className="relative opacity-60">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#E5DFD5] text-[#767069] flex items-center justify-center text-xs ring-4 ring-white shadow-xs">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#767069]">
                  Delivered Against Recipient OTP
                </h4>
                <p className="text-xs text-[#767069] mt-0.5">
                  Doorstep handover after one-time password (OTP) verification and physical signature.
                </p>
              </div>

            </div>

            {/* Quick Link into Profile Orders */}
            <div className="pt-4 border-t border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#767069]">
                Are you signed in to your ZHAEVAAH account?
              </span>
              <Link
                href="/profile?tab=orders"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8933F] hover:underline uppercase tracking-wider"
              >
                <span>View All Orders In Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <OrderStatusContent />
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


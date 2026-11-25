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
import { ShieldCheck, Lock, Eye } from "lucide-react";

function PrivacyContent() {
  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            DATA SECURITY & TRUST
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Your trust is our most treasured asset. Learn how ZHAEVAAH protects your confidential details and purchase privacy.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#524B43] leading-relaxed">
          
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              1. Information We Collect
            </h2>
            <p>
              When you purchase fine jewellery or create an account with ZHAEVAAH, we collect essential details to fulfill your orders securely: your full name, shipping and billing address, email address, phone number, and transaction identifiers.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              2. Bank-Grade Payment Security
            </h2>
            <p>
              All online financial transactions are processed through PCI-DSS Level 1 certified payment infrastructure (Razorpay). ZHAEVAAH does not store or process your credit card numbers, CVV codes, or net banking passwords on our servers. All exchanges occur over secure, 256-bit SSL encrypted channels.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              3. Purpose of Processing & Strict Confidentiality
            </h2>
            <p>
              Your data is utilized solely for processing orders, generating authentic IGI/GIA certificates, arranging insured armored doorstep delivery, issuing GST tax invoices, and administering your VIP loyalty points. We never sell, rent, or monetize your personal information to third-party marketers.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              4. Armored Logistics Sharing
            </h2>
            <p>
              To ensure safe doorstep delivery, verified shipping details (recipient name, address, and mobile number) are shared strictly with our contracted armored carriers (Sequel Logistics, BVC Logistics, or Blue Dart Apex) for OTP verification and transit tracking.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              5. Your Privacy Rights & Contact
            </h2>
            <p>
              You have the right to inspect, update, or request the deletion of your personal account data at any time. For privacy inquiries or data requests, contact our Data Protection Officer at <a href="mailto:privacy@zhaevaah.com" className="text-[#B8933F] font-semibold underline">privacy@zhaevaah.com</a> or reach out through our <Link href="/contact" className="text-[#B8933F] font-semibold underline">Contact Us</Link> portal.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <PrivacyContent />
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


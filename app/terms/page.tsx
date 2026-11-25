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
import { Shield, FileText } from "lucide-react";

function TermsContent() {
  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            LEGAL & COMPLIANCE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Terms & Conditions of Sale
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Please read these terms and conditions carefully before placing orders on the ZHAEVAAH digital boutique.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#524B43] leading-relaxed">
          
          <div>
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              1. Introduction & Acceptance
            </h2>
            <p>
              Welcome to ZHAEVAAH (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing our website, purchasing products, or commissioning bespoke jewellery, you agree to be bound by these Terms and Conditions. All sales are governed by the Consumer Protection Act and applicable regulations in India.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              2. Diamond Certification & Hallmark Authenticity
            </h2>
            <p>
              Every diamond jewellery piece offered on ZHAEVAAH features natural, conflict-free diamonds verified through leading gemological laboratories (IGI, GIA, or SGL). Every gold creation is strictly compliant with the Bureau of Indian Standards (BIS) hallmarking regulations, carrying an authentic 6-digit HUID laser inscription. Certificates issued are unique to the specific item purchased.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              3. Pricing, Gold Volatility & Invoicing
            </h2>
            <p>
              Prices displayed on the website are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). Due to daily fluctuations in international benchmark gold and bullion rates, prices of creations may adjust periodically without prior notice. Once an order is confirmed and payment captured, the quoted price is locked and guaranteed.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              4. Made-to-Order & Bespoke Commissions
            </h2>
            <p>
              Customized ring sizes, engraved jewels, and bespoke commissions require standard manufacturing lead times of 7 to 10 business days. Custom orders cannot be canceled once gold casting and diamond laser-setting have commenced.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              5. Insured Shipping & Title Transfer
            </h2>
            <p>
              All shipments remain 100% insured by ZHAEVAAH until formal delivery to the recipient against an OTP and signature. Title and risk of loss pass to the customer upon successful handover by our armored logistics personnel.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              6. Returns, Lifetime Buyback & Exchanges
            </h2>
            <p>
              Unworn pieces with intact security tags qualify for our 15-day 100% return policy. Authentic ZHAEVAAH jewellery is also eligible for our Lifetime Exchange (100% gold benchmark value, 90% diamond value) and Buyback guarantee subject to gemological inspection at our vault. Full details are outlined in our <Link href="/refund" className="text-[#B8933F] font-semibold underline">Shipping & Refund Policy</Link>.
            </p>
          </div>

          <div className="border-t border-[#EAE3D5] pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2.5">
              7. Intellectual Property & Governing Law
            </h2>
            <p>
              All designs, branding trademarks, photographs, CAD models, and website content are the exclusive intellectual property of ZHAEVAAH. Any disputes arising out of purchases shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <TermsContent />
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


"use client";

import React, { useState } from "react";
import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";
import { ChevronDown, HelpCircle, Phone, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    category: "Purity & Certification",
    question: "Are ZHAEVAAH diamonds certified by recognized gemological institutes?",
    answer:
      "Yes, 100% of our natural diamonds are independently certified by globally recognized institutes such as IGI (International Gemological Institute), GIA (Gemological Institute of America), or SGL. Every certified piece arrives with a tamper-evident physical grading certificate validating the diamond's 4Cs (Cut, Color, Clarity, Carat Weight) and unique laser inscription.",
  },
  {
    id: 2,
    category: "Purity & Certification",
    question: "How can I verify the BIS hallmark on my gold jewellery?",
    answer:
      "All ZHAEVAAH gold jewellery is 100% government BIS hallmarked. Each piece features the official BIS triangular logo, the gold purity mark (750 for 18kt, 916 for 22kt), the assaying center's mark, and a unique 6-digit alphanumeric HUID (Hallmark Unique Identification Number) laser-stamped inside the ring band or clasp, verifiable via the BIS Care mobile app.",
  },
  {
    id: 3,
    category: "Orders & Payments",
    question: "What payment methods are supported on ZHAEVAAH?",
    answer:
      "We accept all major credit and debit cards (Visa, MasterCard, American Express, RuPay), UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across 50+ banks, and flexible zero-cost EMI plans via Razorpay. All transactions are protected by bank-grade 256-bit SSL encryption.",
  },
  {
    id: 4,
    category: "Orders & Payments",
    question: "Can I place a bespoke or customized bridal order?",
    answer:
      "Absolutely. Our master designers and CAD artisans craft bespoke engagement rings, solitaire necklaces, and custom bridal sets. You can book an appointment or send your requirements via our Contact page, and a dedicated jewellery concierge will guide you from 3D CAD render to final creation.",
  },
  {
    id: 5,
    category: "Shipping & Transit",
    question: "How is high-value fine jewellery safely delivered to my doorstep?",
    answer:
      "Every parcel travels under 100% complimentary transit insurance in discreet, tamper-proof security lockbox packaging through trusted logistics partners like Sequel Logistics, BVC Armored, and Blue Dart Apex. The delivery executive requires a verified OTP and recipient signature before handing over the vault box.",
  },
  {
    id: 6,
    category: "Shipping & Transit",
    question: "How long does shipping and delivery take?",
    answer:
      "Ready-to-ship items are dispatched within 24 to 48 hours and typically arrive within 2 to 4 business days. Made-to-order, personalized engraving, or bespoke items require 7 to 10 business days for casting, hallmarking, and certification prior to armored dispatch.",
  },
  {
    id: 7,
    category: "Sizing & Maintenance",
    question: "What if the ring I order does not fit my finger?",
    answer:
      "We offer one complimentary ring resizing within 30 days of purchase for all solitaire and standard diamond rings. Simply contact our support team to schedule a free insured reverse pickup from your address.",
  },
  {
    id: 8,
    category: "Returns & Lifetime Guarantee",
    question: "What is the ZHAEVAAH 15-day return and lifetime buyback policy?",
    answer:
      "We provide a 15-day, no-questions-asked, 100% money-back guarantee for unworn jewellery with intact security tags. Furthermore, every ZHAEVAAH piece is eligible for our Lifetime Exchange & Buyback Guarantee: receive 100% of the prevailing gold rate value and 90% of prevailing diamond value at any time.",
  },
];

function FAQsContent() {
  const [openIds, setOpenIds] = useState<number[]>([1, 2]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Purity & Certification", "Orders & Payments", "Shipping & Transit", "Sizing & Maintenance", "Returns & Lifetime Guarantee"];

  const toggle = (id: number) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filtered = activeCategory === "All"
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            HELP & CONCIERGE ASSISTANCE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Everything you need to know about certified diamond grading, hallmark verification, insured shipping, and lifetime care.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs uppercase tracking-wider py-1.5 px-4 rounded-full transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#B8933F] text-white font-semibold shadow-xs"
                  : "bg-white text-[#6E675F] border border-[#E5DFD5] hover:border-[#B8933F] hover:text-[#B8933F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-[#EAE3D5] rounded-xs overflow-hidden transition-shadow hover:shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif-luxury text-sm sm:text-base font-bold text-[#1C1208] hover:text-[#B8933F] transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B8933F] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#665E54] font-light leading-relaxed border-t border-[#F5EFE6]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Concierge Contact Banner */}
        <div className="mt-12 bg-white border border-[#EAE3D5] rounded-xs p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#B8933F] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208]">
            Still have a question?
          </h3>
          <p className="text-xs sm:text-sm text-[#767069] max-w-md mx-auto leading-relaxed">
            Our luxury jewellery concierge is ready to assist you via phone or personal consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="tel:+910123456789"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-semibold uppercase tracking-wider text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#B8933F]" />
              <span>Call (+91) 0123-456-789</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B8933F] hover:bg-[#9E792B] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Concierge Desk</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function FAQsPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <FAQsContent />
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


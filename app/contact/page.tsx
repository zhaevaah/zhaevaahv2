"use client";

import React, { useState } from "react";
import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider, useStore } from "../../context/StoreContext";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2 } from "lucide-react";

function ContactPageContent() {
  const { showToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Bespoke Bridal Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message received! A concierge advisor will reach out within 4 hours.");
  };

  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-16 font-poppins">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-2">
            CONCIERGE & BOUTIQUE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1208] tracking-tight mb-3">
            Contact ZHAEVAAH
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed">
            Our luxury jewellery concierge is at your service for bespoke bridal commissions, private boutique appointments, and certified diamond consultations.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Flagship Atelier */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-center text-[#B8933F] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1">
                    Flagship Boutique Studio
                  </h3>
                  <p className="text-xs text-[#767069] leading-relaxed mb-2">
                    60 29th Street San Francisco, 507-Union Trade Center, CA 94110
                  </p>
                  <p className="text-xs text-[#767069] leading-relaxed">
                    Atelier Annex: Bandra West, Mumbai, MH - 400050, India
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-center text-[#B8933F] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1">
                    VIP Phone & WhatsApp
                  </h3>
                  <p className="text-xs text-[#767069] leading-relaxed mb-1">
                    Toll-Free Concierge: <a href="tel:+910123456789" className="text-[#B8933F] font-semibold hover:underline">(+91) 0123-456-789</a>
                  </p>
                  <p className="text-xs text-[#767069] leading-relaxed">
                    Direct Studio: <a href="tel:+919876543210" className="text-[#1C1208] font-medium hover:underline">(+91) 9876-543-210</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Email */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-center text-[#B8933F] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1">
                    Dedicated Concierge Email
                  </h3>
                  <p className="text-xs text-[#767069] leading-relaxed mb-1">
                    Consultations: <a href="mailto:concierge@zhaevaah.com" className="text-[#B8933F] font-semibold hover:underline">concierge@zhaevaah.com</a>
                  </p>
                  <p className="text-xs text-[#767069] leading-relaxed">
                    General Inquiries: <a href="mailto:demo@example.com" className="text-[#1C1208] hover:underline">demo@example.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-center text-[#B8933F] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-[#1C1208] mb-1">
                    Atelier Opening Hours
                  </h3>
                  <p className="text-xs text-[#767069] leading-relaxed mb-1">
                    Monday – Saturday: <strong>10:00 AM – 8:00 PM IST</strong>
                  </p>
                  <p className="text-xs text-[#767069] leading-relaxed">
                    Sunday: <strong>Exclusive Private Appointment Only</strong>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="lg:col-span-7 bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EAF7EC] text-[#2E7D32] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1208]">
                  Thank You for Reaching Out
                </h3>
                <p className="text-xs sm:text-sm text-[#767069] max-w-md mx-auto leading-relaxed">
                  Your inquiry has been routed to our senior certified diamond advisor. We will connect with you shortly via phone or email with full details.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", inquiryType: "Bespoke Bridal Inquiry", message: "" });
                  }}
                  className="mt-4 inline-flex items-center justify-center px-6 py-2.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-bold tracking-wider rounded-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#EAE3D5] pb-4 mb-5">
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1208]">
                    Send a Message to Our Concierge
                  </h2>
                  <p className="text-xs text-[#767069] mt-1">
                    Fill out the form below and an advisor will respond within 4 business hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="radhika@example.com"
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F]"
                    >
                      <option value="Bespoke Bridal Inquiry">Bespoke Bridal Commission</option>
                      <option value="Solitaire Engagement Ring Consultation">Solitaire Ring Consultation</option>
                      <option value="Private Studio Appointment">Private Studio Appointment</option>
                      <option value="Order Tracking & Support">Order Tracking & Delivery</option>
                      <option value="Lifetime Exchange & Certification">Lifetime Exchange & Hallmarks</option>
                      <option value="General Question">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1208] mb-1.5 uppercase tracking-wider">
                    Your Message & Requirements *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the diamond carat, metal preference (18kt Yellow Gold / Rose Gold / Platinum), budget, or desired appointment date..."
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#DDD5C7] rounded-xs focus:outline-none focus:border-[#B8933F] leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-bold tracking-[0.18em] rounded-xs shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Advisor</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        <TopBanner />
        <Header />
        <main className="flex-1">
          <ContactPageContent />
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


"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import PaymentMethodsStrip from "./PaymentMethodsStrip";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#1C1208]">
      
      {/* ── 1. Pre-Footer Brand Story Banner ── */}
      <div className="relative w-full overflow-hidden border-t border-b border-[#B8933F]/30 bg-[#C8A360]">
        {/* Background Image: Model on the right, golden luxury warm tone across */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="/images/footer_banner.webp"
            alt="ZHAEVAAH Artisanal Fine Jewellery"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          {/* Subtle gradient overlay on the left for crisp typography while keeping the model 100% clear and vibrant */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8A360]/85 via-[#C8A360]/35 to-transparent md:from-[#C8A360]/65 md:via-[#C8A360]/15 md:to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
          <div className="max-w-xl lg:max-w-2xl">
            <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#54380B] font-semibold block mb-2 font-montserrat">
              The Essence of Radiance
            </span>
            <h3 className="font-montserrat text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1C1208] mb-3 leading-tight tracking-tight">
              Celebrating Every Woman’s Unique Beauty
            </h3>
            <p className="font-poppins text-xs sm:text-sm text-[#38260E] font-medium leading-relaxed mb-6 max-w-lg">
              Every woman embodies a rare and distinctive grace. Our bespoke fine jewellery is sculpted not merely to adorn, but to celebrate your inner radiance and the timeless stories you hold dear.
            </p>

            <Link
              href="/women"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1C1208] hover:bg-[#8C6D23] text-white text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md hover:shadow-lg group active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Main 5-Column Footer with Signature Brand Watermark ── */}
      <div className="relative w-full overflow-hidden bg-white">
        {/* Luxury Logo Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
          aria-hidden="true"
        >
          <div className="relative w-[500px] sm:w-[750px] md:w-[1000px] lg:w-[1250px] max-w-none opacity-[0.045] pointer-events-none">
            <Image
              src="/brand/ZHAEVAAH_LOGO.webp"
              alt="ZHAEVAAH Watermark"
              width={7124}
              height={1697}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: About Our Store (Brand Logo on Left) */}
          <div className="space-y-4">
            
            
            {/* Brand Logo (Only Image - Bigger & Crisp) */}
            <div className="flex items-center pt-1">
              <Link href="/" aria-label="ZHAEVAAH Home" className="block group">
                <Image
                  src="/brand/ZHAEVAAH_LOGO.webp"
                  alt="ZHAEVAAH"
                  width={265}
                  height={67}
                  className="h-12 sm:h-14 md:h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </Link>
            </div>

            <p className="font-poppins text-xs text-[#6E675F] leading-relaxed">
              Welcome to our store, where we pride ourselves on providing exceptional products and unparalleled customer service our store style, and innovation
            </p>

         
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-[#1C1208] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-poppins text-xs text-[#6E675F]">
              <li><Link href="/women" className="hover:text-[#B8933F] transition-colors">Women's Collection</Link></li>
              <li><Link href="/men" className="hover:text-[#B8933F] transition-colors">Men's Collection</Link></li>
              <li><Link href="/top-deals" className="hover:text-[#B8933F] transition-colors">Top Deals</Link></li>
              <li><Link href="/contact" className="hover:text-[#B8933F] transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-[#B8933F] transition-colors">Shipping</Link></li>
              <li><Link href="/faqs" className="hover:text-[#B8933F] transition-colors">FAQs</Link></li>
              <li><Link href="/about" className="hover:text-[#B8933F] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-[#1C1208] mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 font-poppins text-xs text-[#6E675F]">
              <li><Link href="/order-status" className="hover:text-[#B8933F] transition-colors">Order Status</Link></li>
              <li><Link href="/terms" className="hover:text-[#B8933F] transition-colors">Terms Conditions</Link></li>
              <li><Link href="/refund" className="hover:text-[#B8933F] transition-colors">Shipping & Refund</Link></li>
              <li><Link href="/privacy" className="hover:text-[#B8933F] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Your Account */}
          <div>
            <h4 className="font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-[#1C1208] mb-4">
              Your Account
            </h4>
            <ul className="space-y-2.5 font-poppins text-xs text-[#6E675F]">
              <li><Link href="/profile" className="hover:text-[#B8933F] transition-colors">My Profile</Link></li>
              <li><Link href="/profile?tab=orders" className="hover:text-[#B8933F] transition-colors">Order Tracking</Link></li>
              <li><Link href="/profile?tab=addresses" className="hover:text-[#B8933F] transition-colors">Delivery Addresses</Link></li>
              <li><Link href="/profile?tab=privilege" className="hover:text-[#B8933F] transition-colors">Privilege Rewards</Link></li>
             
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div>
            <h4 className="font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-[#1C1208] mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 font-poppins text-xs text-[#6E675F]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B8933F] flex-shrink-0 mt-0.5" />
                <span>60 29th Street San Francisco, 507-Union Trade Center, United States America - 94110</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8933F] flex-shrink-0" />
                <span>(+91) 0123-456-789</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8933F] flex-shrink-0" />
                <span>(+91) 9876-543-210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8933F] flex-shrink-0" />
                <span>demo@example.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3. Bottom Bar (Social, Copyright, Payment Icons) ── */}
        <div className="mt-14 pt-8 border-t border-[#EAE6DF] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#767069] pb-16 sm:pb-20 lg:pb-0">
          
          {/* Social Icons */}
          <div className="flex items-center space-x-3 text-[#1C1208]">
            <a href="#" className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#B8933F] hover:text-white flex items-center justify-center transition-colors" aria-label="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#B8933F] hover:text-white flex items-center justify-center transition-colors" aria-label="X">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#B8933F] hover:text-white flex items-center justify-center transition-colors" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#B8933F] hover:text-white flex items-center justify-center transition-colors" aria-label="Pinterest">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.155-1.499-.696-2.435-2.88-2.435-4.637 0-3.774 2.743-7.24 7.906-7.24 4.15 0 7.377 2.956 7.377 6.91 0 4.124-2.6 7.441-6.208 7.441-1.213 0-2.354-.63-2.744-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#B8933F] hover:text-white flex items-center justify-center transition-colors" aria-label="Google">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.067 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="font-poppins text-center text-[#767069]">
            Copyright © {new Date().getFullYear()} Zhaevaah. All rights reserved.

          </p>

          {/* Payment Gateway Badges */}
          <div className="w-full md:w-auto">
            <PaymentMethodsStrip
              compact
              className="max-w-[360px] sm:max-w-[390px] mx-auto md:mx-0 border-[#EAE3D5] bg-[#FAF9F7]"
            />
          </div>

        </div>
      </div>
      </div>
    </footer>
  );
}

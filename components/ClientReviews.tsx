"use client";

import React from "react";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: number;
  headline: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating?: number;
  verified?: boolean;
  product?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    headline: "Reliable Product, Consistently Delivers.",
    quote:
      "The finish of the 18kt gold band and diamond setting exceeded my expectations. Delivered in secure tamper-evident insured packing.",
    name: "Donald Duck",
    role: "Verified Patron • Mumbai",
    avatar: "/images/avatar_donald.jpg",
    rating: 5,
    verified: true,
    product: "Solitaire Diamond Ring",
  },
  {
    id: 2,
    headline: "Great Product Price Delivery Perfect",
    quote:
      "Authentic BIS hallmarking with IGI certification card included. Exceptional value compared to traditional high-street boutiques.",
    name: "Augusta Wind",
    role: "Verified Patron • Bengaluru",
    avatar: "/images/avatar_augusta.jpg",
    rating: 5,
    verified: true,
    product: "Tennis Diamond Bracelet",
  },
  {
    id: 3,
    headline: "Impressive Quality, & Reliable",
    quote:
      "Bespoke craftsmanship at its finest. The prong setting is flawless and the sparkle of natural diamonds under natural light is mesmerizing.",
    name: "John Doe",
    role: "Verified Patron • New Delhi",
    avatar: "/images/avatar_john.jpg",
    rating: 5,
    verified: true,
    product: "Emerald Solitaire Signet",
  },
  {
    id: 4,
    headline: "Exquisite Bridal Craftsmanship",
    quote:
      "Ordered the Jadau bridal set for my wedding reception. The concierge team assisted with custom sizing and dispatched it in 48 hours.",
    name: "Priya Sharma",
    role: "Verified Patron • Jaipur",
    avatar: "/images/avatar_augusta.jpg",
    rating: 5,
    verified: true,
    product: "Royal Nizam Bridal Set",
  },
  {
    id: 5,
    headline: "Flawless Hallmarking & Packaging",
    quote:
      "The velvet presentation box, laser authenticity card, and express BlueDart air delivery made unboxing a truly royal celebration.",
    name: "Vikram Kapoor",
    role: "Verified Patron • Hyderabad",
    avatar: "/images/avatar_donald.jpg",
    rating: 5,
    verified: true,
    product: "Executive Platinum Band",
  },
  {
    id: 6,
    headline: "Pure Elegance & Transparent Pricing",
    quote:
      "Zero hidden gold making charges. Clear purity breakdown and certified gemological report. Will definitely commission again.",
    name: "Rohini Singhania",
    role: "Verified Patron • Pune",
    avatar: "/images/avatar_john.jpg",
    rating: 5,
    verified: true,
    product: "Diamond Promise Ring",
  },
];

function ReviewCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-[280px] sm:w-[320px] md:w-[340px] flex-shrink-0 bg-[#FAF9F7] hover:bg-white p-3.5 sm:p-4 rounded-xs border border-[#EAE3D5] hover:border-[#B8933F]/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between select-none">
      <div>
        {/* Top Header: Stars & Verified Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-0.5 text-[#E69C24]">
            {[...Array(item.rating || 5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#E69C24]" />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-[#2A9D8F] font-semibold bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#2A9D8F]" />
            Verified
          </span>
        </div>

        {/* Headline Quote */}
        <h4 className="font-montserrat text-xs sm:text-[13px] font-semibold text-[#1C1208] mb-1.5 leading-snug line-clamp-1">
          &ldquo;{item.headline}&rdquo;
        </h4>

        {/* Review Excerpt */}
        <p className="font-poppins text-[11px] sm:text-xs text-[#6E675F] font-light leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3">
          {item.quote}
        </p>
      </div>

      {/* Author Footer */}
      <div className="flex items-center gap-2.5 pt-2.5 border-t border-[#EAE3D5]/80">
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D1CBC3] bg-white flex-shrink-0">
          <Image
            src={item.avatar}
            alt={item.name}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="font-montserrat text-xs font-semibold text-[#1C1208] leading-tight truncate">
            {item.name}
          </h5>
          <p className="font-poppins text-[10px] text-[#8C827A] truncate">
            {item.role}
          </p>
        </div>
        {item.product && (
          <span className="hidden sm:inline-block text-[9px] text-[#B8933F] font-medium bg-[#FAF6EE] px-1.5 py-0.5 rounded-xs border border-[#B8933F]/20 truncate max-w-[100px]">
            {item.product}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ClientReviews() {
  return (
    <section id="reviews" className="w-full py-6 sm:py-10 bg-white overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-1">
            Verified Atelier Experiences
          </span>
          <h2 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold text-[#1C1208] tracking-tight mb-1">
            What Our Clients Say
          </h2>
          <p className="font-poppins text-[11px] sm:text-xs text-[#767069] font-light tracking-wide">
            Treasured moments & verified reviews from our patrons across India
          </p>
        </div>

      </div>

      {/* Infinite Horizontal Smooth Marquee Track */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Left Edge Gradient Fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

        {/* Right Edge Gradient Fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Continuous Dual Track */}
        <div className="animate-marquee-reviews flex items-stretch gap-3 sm:gap-4 px-2">
          {TESTIMONIALS.map((item, idx) => (
            <ReviewCard key={`rev-a-${item.id}-${idx}`} item={item} />
          ))}
          {TESTIMONIALS.map((item, idx) => (
            <ReviewCard key={`rev-b-${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

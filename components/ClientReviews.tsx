"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  headline: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    headline: "Reliable Product, Consistently Delivers.",
    quote:
      "The point of using lorem Ipsum is that it has a more is normal they always wash up well no matter how many versions of lorem Ipsum.",
    name: "Donald Duck",
    role: "Web Designer",
    avatar: "/images/avatar_donald.jpg",
  },
  {
    id: 2,
    headline: "Great Product Price Delivery Perfect",
    quote:
      "The point of using lorem Ipsum is that it has a more is normal they always wash up well no matter how many versions of lorem Ipsum.",
    name: "Augusta Wind",
    role: "Founder",
    avatar: "/images/avatar_augusta.jpg",
  },
  {
    id: 3,
    headline: "Impressive Quality, & Reliable",
    quote:
      "The point of using lorem Ipsum is that it has a more is normal they always wash up well no matter how many versions of lorem Ipsum.",
    name: "John Doe",
    role: "Manager",
    avatar: "/images/avatar_john.jpg",
  },
];

export default function ClientReviews() {
  return (
    <section id="reviews" className="w-full py-8 sm:py-14 lg:py-20 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 lg:mb-16">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1208] tracking-tight mb-1.5 sm:mb-2.5">
            What Our Clients Say
          </h2>
          <p className="font-poppins text-xs sm:text-sm text-[#767069] font-light tracking-wide">
            There are many variations of passages of lorem Ipsum available
          </p>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8F7F5] p-5 sm:p-7 lg:p-9 rounded-xs border border-[#eae6de]/60 flex flex-col justify-between hover:shadow-sm transition-shadow duration-300"
            >
              <div>
                {/* 5 Rating Stars */}
                <div className="flex items-center gap-1 text-[#E69C24] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#E69C24]" />
                  ))}
                </div>

                {/* Headline Quote */}
                <h4 className="font-montserrat text-base sm:text-lg font-semibold text-[#1C1208] mb-3 leading-snug">
                  &ldquo;{item.headline}&rdquo;
                </h4>

                {/* Body Text */}
                <p className="font-poppins text-xs sm:text-[13px] text-[#6E675F] font-light leading-relaxed mb-6">
                  {item.quote}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#eae6de]/80">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#d1cbc3] bg-white flex-shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-montserrat text-sm font-semibold text-[#1C1208] leading-tight">
                    {item.name}
                  </h5>
                  <p className="font-poppins text-[11px] text-[#767069]">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


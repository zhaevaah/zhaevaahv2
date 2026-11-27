"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface CustomerStory {
  id: number;
  headline: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  mediaImage: string;
  videoUrl?: string;
  rating?: number;
}

const STORIES: CustomerStory[] = [
  {
    id: 1,
    headline: "100% Certified Fire & Fit",
    quote:
      "Adding this diamond solitaire ring to my collection didn’t just elevate my style — it changed how confident I feel walking into every room. The brilliance under warm lights is captivating.",
    name: "Pooja Hegde",
    role: "Patron • Mumbai",
    avatar: "/images/avatar_augusta.jpg",
    mediaImage: "/images/auth_model_1.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rating: 5,
  },
  {
    id: 2,
    headline: "Bespoke Bridal Perfection",
    quote:
      "Ordered the Nizam Jadau necklace set for my wedding reception. The concierge team assisted with custom neckline fitting and insured express dispatch within 48 hours.",
    name: "Ananya Sharma",
    role: "Bridal Patron • New Delhi",
    avatar: "/images/avatar_donald.jpg",
    mediaImage: "/images/hero_woman_hd.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    rating: 5,
  },
  {
    id: 3,
    headline: "Zero Hidden Gold Charges",
    quote:
      "Authentic BIS hallmarking with IGI certification card included. Exceptional value, total transparency on gold weight, and craftsmanship that rivals the world’s top jewelers.",
    name: "Vikramaditya Singhania",
    role: "Patron • Bengaluru",
    avatar: "/images/avatar_john.jpg",
    mediaImage: "/images/bracelet_hotsell_banner.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    rating: 5,
  },
  {
    id: 4,
    headline: "Exquisite 18KT Rose Gold Finish",
    quote:
      "The mirror-polish finish and prong security on the diamond eternity band exceeded all expectations. Delivered in a luxurious tamper-evident velvet presentation box.",
    name: "Meera Nambiar",
    role: "Patron • Chennai",
    avatar: "/images/avatar_augusta.jpg",
    mediaImage: "/images/collection.webp",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    rating: 5,
  },
  {
    id: 5,
    headline: "Heirloom Quality for Generations",
    quote:
      "Our family has collected fine jewels for decades. Zhaevaah's solitaire signet and craftsmanship are truly timeless. It has become my everyday signature piece.",
    name: "Devendra & Sunita Roy",
    role: "Patron • Kolkata",
    avatar: "/images/avatar_donald.jpg",
    mediaImage: "/images/drop_cut_blue_banner.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    rating: 5,
  },
];

// Tripled list allows seamless circular sliding without wrap-around teleportation artifacts
const TRIPLED_STORIES = [
  ...STORIES.map((s) => ({ ...s, cloneKey: `prev-${s.id}` })),
  ...STORIES.map((s) => ({ ...s, cloneKey: `main-${s.id}` })),
  ...STORIES.map((s) => ({ ...s, cloneKey: `next-${s.id}` })),
];

export default function ClientReviews() {
  const [virtualIndex, setVirtualIndex] = useState(5); // base index 5 is STORIES[0] in main block
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Mobile Touch Swipe Handlers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    if (diffX > 45) {
      nextSlide();
    } else if (diffX < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const total = STORIES.length;
  const activeStoryIndex = ((virtualIndex % total) + total) % total;

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev - 1);
  }, []);

  const goToCard = (diff: number) => {
    if (diff === 0) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev + diff);
  };

  // Seamless invisible boundary normalization: keeps virtualIndex in [5..9]
  useEffect(() => {
    if (virtualIndex >= 10 || virtualIndex < 5) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        const normalized = ((virtualIndex % total) + total) % total + 5;
        setVirtualIndex(normalized);

        // Re-enable smooth transition for subsequent user or auto actions
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 720); // triggers right after 700ms slide animation finishes

      return () => clearTimeout(timer);
    }
  }, [virtualIndex, total]);

  // Continuous auto-scroll every 4.5 seconds
  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, nextSlide]);

  // Video autoplay management: play active center card only, pause all others
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === virtualIndex) {
        if (v.paused) {
          const playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              v.muted = true;
              v.play().catch(() => {});
            });
          }
        }
      } else {
        if (!v.paused) {
          v.pause();
        }
      }
    });
  }, [virtualIndex]);

  return (
    <section
      id="reviews"
      aria-label="Customer Reviews and Stories"
      className="relative w-full pt-12 sm:pt-16 md:pt-20 pb-14 sm:pb-18 md:pb-22 lg:pb-26 overflow-hidden bg-[#FAF9F7] border-t border-b border-[#EAE3D5]/80 text-[#1C1208] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header (Simple & Clean) ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#B8933F] block mb-1.5 font-montserrat">
            CUSTOMER DIARIES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-[#1C1208] leading-tight font-serif-luxury">
            Customer Diaries — Real Customer Stories
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#767069] font-light max-w-lg mx-auto">
            Timeless moments, verified experiences, and handcrafted elegance celebrated by our patrons.
          </p>
        </div>

        {/* ── Fluid Coverflow Stage with Floating Arrows & Mobile Touch Swipe ── */}
        <div
          className="relative w-full py-4 flex items-center justify-center min-h-[500px] sm:min-h-[500px] md:min-h-[540px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Subtle Horizontal Connecting Guideline (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-[1.5px] bg-[#EAE3D5] -translate-y-1/2 pointer-events-none z-0" />

          {/* ── Left Floating Arrow Button (Desktop Only) ── */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous customer story"
            className="hidden sm:flex absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#1C1208] border border-[#DDD5C7] shadow-xl hover:shadow-2xl items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-[#B8933F]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* ── Right Floating Arrow Button (Desktop Only) ── */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next customer story"
            className="hidden sm:flex absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#1C1208] border border-[#DDD5C7] shadow-xl hover:shadow-2xl items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-[#B8933F]"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* ── Carousel Track: Continuous unidirectional gliding without teleport jumps ── */}
          <div className="relative w-full flex items-center justify-center h-full">
            {TRIPLED_STORIES.map((story, idx) => {
              const diff = idx - virtualIndex;
              const absDiff = Math.abs(diff);

              // Render active center card, 2 cards on left, 2 cards on right, and buffer cards
              if (absDiff > 3) return null;

              const isCenter = diff === 0;

              // Compute smooth metrics
              let width = "135px";
              let height = "310px";
              let translateX = 0;
              let scale = 0.78;
              let opacity = 0;
              let zIndex = 5;
              let pointerEvents: "auto" | "none" = "none";

              if (diff === 0) {
                // Center active card
                width = "min(92vw, 920px)";
                height = "480px";
                translateX = 0;
                scale = 1;
                opacity = 1;
                zIndex = 30;
                pointerEvents = "auto";
              } else if (diff === -1) {
                // Left pill 1
                width = "180px";
                height = "375px";
                translateX = -470;
                scale = 0.92;
                opacity = 0.8;
                zIndex = 20;
                pointerEvents = "auto";
              } else if (diff === 1) {
                // Right pill 1
                width = "180px";
                height = "375px";
                translateX = 470;
                scale = 0.92;
                opacity = 0.8;
                zIndex = 20;
                pointerEvents = "auto";
              } else if (diff === -2) {
                // Far left pill 2
                width = "135px";
                height = "310px";
                translateX = -610;
                scale = 0.78;
                opacity = 0.45;
                zIndex = 10;
                pointerEvents = "auto";
              } else if (diff === 2) {
                // Far right pill 2
                width = "135px";
                height = "310px";
                translateX = 610;
                scale = 0.78;
                opacity = 0.45;
                zIndex = 10;
                pointerEvents = "auto";
              } else if (diff === -3) {
                // Off-screen left buffer
                width = "100px";
                height = "260px";
                translateX = -750;
                scale = 0.6;
                opacity = 0;
                zIndex = 1;
                pointerEvents = "none";
              } else if (diff === 3) {
                // Off-screen right buffer
                width = "100px";
                height = "260px";
                translateX = 750;
                scale = 0.6;
                opacity = 0;
                zIndex = 1;
                pointerEvents = "none";
              }

              // Card inner width distribution:
              // Side card: media fills 100%, text is 0px
              // Center card: media is 390px, text is calc(100% - 390px)
              const mediaWidth = isCenter
                ? "min(390px, 44%)"
                : absDiff === 1
                ? "180px"
                : "135px";

              return (
                <div
                  key={story.cloneKey}
                  onClick={() => goToCard(diff)}
                  style={{
                    zIndex,
                    transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
                    opacity,
                    pointerEvents,
                    width,
                    height,
                  }}
                  className={`absolute top-1/2 left-1/2 rounded-[28px] sm:rounded-[36px] bg-white border border-[#EAE3D5] shadow-2xl overflow-hidden cursor-pointer ${
                    diff !== 0 ? "hidden sm:block" : "block"
                  } ${
                    isTransitioning
                      ? "transition-[transform,opacity,width,height] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      : "transition-none"
                  }`}
                >
                  <div className="relative w-full h-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between overflow-hidden">
                    
                    {/* ── Media/Video Area: Top on mobile, right on desktop ── */}
                    <div
                      style={{
                        width: isCenter ? undefined : mediaWidth,
                      }}
                      className={`relative w-full h-[210px] sm:h-full sm:order-2 shrink-0 overflow-hidden bg-slate-900 rounded-t-[26px] sm:rounded-t-none sm:rounded-[28px] sm:m-3 ${
                        isCenter ? "sm:w-[42%]" : ""
                      } ${
                        isTransitioning
                          ? "transition-[width,margin] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                          : "transition-none"
                      }`}
                    >
                      {/* Video element mounted with fallback poster image for zero flash */}
                      {story.videoUrl ? (
                        <video
                          ref={(el) => {
                            videoRefs.current[idx] = el;
                          }}
                          src={story.videoUrl}
                          poster={story.mediaImage}
                          muted={isMuted}
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={story.mediaImage}
                          alt={story.name}
                          fill
                          sizes="400px"
                          className="object-cover object-center"
                        />
                      )}

                      {/* Subtle hover shading & patron name label on side cards */}
                      {!isCenter && (
                        <div className="absolute inset-0 bg-black/25 hover:bg-black/10 transition-colors flex items-end justify-center p-2.5">
                          <div className="bg-black/65 backdrop-blur-xs py-1 px-2.5 rounded-md max-w-full text-center">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-white truncate">
                              {story.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Sound Toggle Button (Center card only) */}
                      {isCenter && story.videoUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-md"
                          title={isMuted ? "Unmute audio" : "Mute audio"}
                          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4 text-white" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-[#E6C673]" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* ── Content Area: Bottom on mobile, left on desktop ── */}
                    <div
                      className={`w-full sm:order-1 sm:w-[58%] flex-1 flex flex-col justify-between overflow-hidden min-w-0 ${
                        isCenter
                          ? "p-4 sm:p-7 md:p-8 lg:p-10 pointer-events-auto"
                          : "p-0 pointer-events-none hidden sm:flex"
                      }`}
                    >
                      <div className="w-full max-w-full min-w-0">
                        {/* 5 Stars */}
                        <div className="flex items-center gap-1 text-[#E69C24] mb-1.5 sm:mb-3">
                          {[...Array(story.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#E69C24]" />
                          ))}
                        </div>

                        {/* Bold Headline */}
                        <h3 className="font-montserrat text-sm sm:text-xl lg:text-[23px] font-bold text-[#1C1208] leading-tight line-clamp-2">
                          {story.headline}
                        </h3>

                        {/* Patron Quote */}
                        <p className="font-serif-luxury text-xs sm:text-sm lg:text-base text-[#3D352E] italic leading-relaxed sm:leading-loose mt-1.5 sm:mt-3 line-clamp-3 sm:line-clamp-4">
                          &ldquo;{story.quote}&rdquo;
                        </p>
                      </div>

                      {/* Author Info Chip */}
                      <div className="w-full pt-2 sm:pt-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#FAF9F7] border border-[#EAE3D5] text-[11px] sm:text-xs max-w-full">
                          <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white border border-[#DDD] shrink-0">
                            <Image
                              src={story.avatar}
                              alt={story.name}
                              fill
                              sizes="20px"
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-[#1C1208] truncate">
                            {story.name}
                          </span>
                          <span className="text-[#8C827A]">•</span>
                          <span className="text-[#767069] text-[10px] sm:text-[11px] truncate">
                            {story.role}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile Navigation Controls (Below Card) ── */}
        <div className="flex sm:hidden items-center justify-center gap-3.5 mt-5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous customer story"
            className="w-9 h-9 rounded-full bg-white text-[#1C1208] border border-[#DDD5C7] shadow-sm flex items-center justify-center active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDD5C7] rounded-full shadow-xs">
            {STORIES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const targetDiff = i - activeStoryIndex;
                  goToCard(targetDiff);
                }}
                className={`transition-all duration-300 rounded-full ${
                  i === activeStoryIndex
                    ? "w-4 h-1.5 bg-[#B8933F]"
                    : "w-1.5 h-1.5 bg-[#DDD5C7]"
                }`}
                aria-label={`Story ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next customer story"
            className="w-9 h-9 rounded-full bg-white text-[#1C1208] border border-[#DDD5C7] shadow-sm flex items-center justify-center active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}

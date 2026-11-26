"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Clock,
  Tag,
  Copy,
  Check,
  Percent,
  ShieldCheck,
  Coins,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Gift,
  ArrowRight,
} from "lucide-react";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { CatalogProduct } from "../data/products";
import { useStore } from "../context/StoreContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";
import { apiGetBanners } from "../lib/api";
import {
  FESTIVAL_THEMES,
  DEFAULT_DEALS_CONFIG,
  TopDealsConfig,
  DealsFestivalTheme,
} from "../data/dealsConfig";

type DealTab =
  | "all"
  | "biggest"
  | "under-25k"
  | "rings"
  | "solitaires"
  | "necklaces"
  | "bracelets";

export default function TopDealsPageContent() {
  const { showToast } = useStore();
  const dispatch = useAppDispatch();
  const allProductsFromStore = useAppSelector((state) => state.products.items);
  const productsStatus = useAppSelector((state) => state.products.status);
  const isProductsLoading = productsStatus === "loading";

  const [dealsConfig, setDealsConfig] = useState<TopDealsConfig>(DEFAULT_DEALS_CONFIG);
  const [activeTab, setActiveTab] = useState<DealTab>("all");
  const [sortBy, setSortBy] = useState<string>("discount");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    dispatch(fetchProducts({ limit: 100 }));

    const loadCustom = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_custom_top_deals");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.headline) {
            setDealsConfig(parsed);
          }
        }
      } catch {}
    };
    loadCustom();

    // Fetch promotional banners to sync active voucher codes from backend
    apiGetBanners().then((res) => {
      if (res.success && res.banners) {
        const promoBanners = res.banners.promoTop || (Array.isArray(res.banners) ? res.banners.filter((b: any) => b.type === "PROMO_TOP") : []);
        if (Array.isArray(promoBanners) && promoBanners.length > 0) {
          setDealsConfig((prev) => {
            const existingCodes = new Set((prev.codes || []).map((c) => c.code.toUpperCase()));
            const newCodes = [...(prev.codes || [])];
            promoBanners.forEach((b: any) => {
              const code = (b.discount || b.badge || "").trim().toUpperCase();
              if (code && !existingCodes.has(code) && code.length >= 4) {
                newCodes.push({
                  code: code,
                  discount: b.badge || "SPECIAL DEAL",
                  description: b.title || "Promotional festive discount voucher",
                  minSpend: "Atelier Special",
                });
                existingCodes.add(code);
              }
            });
            return { ...prev, codes: newCodes };
          });
        }
      }
    }).catch(() => {});

    window.addEventListener("zhaevaah-deals-updated", loadCustom);
    return () => window.removeEventListener("zhaevaah-deals-updated", loadCustom);
  }, [dispatch]);

  // Skeleton loading shimmer when switching tabs or sort order
  useEffect(() => {
    if (!isHydrated) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 260);
    return () => clearTimeout(timer);
  }, [activeTab, sortBy, isHydrated]);

  // Live countdown timer: ends in 2 days, 14 hours, 48 mins, 22 secs
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 48,
    seconds: 22,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Coupon code "${code}" copied to clipboard! Extra 5% off applied at checkout.`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const parsePriceNumber = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Helper to extract discount number for sorting & badges from backend product
  const getDiscountValue = (p: any): number => {
    if (p.discountBadge) {
      const match = String(p.discountBadge).match(/\d+/);
      if (match) {
        const val = parseInt(match[0], 10);
        if (!isNaN(val) && val > 0) return val;
      }
    }
    const curr = p.priceNum || parsePriceNumber(p.price);
    const orig = parsePriceNumber(p.compareAtPrice || p.originalPrice);
    if (orig > curr && curr > 0) {
      return Math.round(((orig - curr) / orig) * 100);
    }
    return 0;
  };

  // Filter and sort products from backend database
  const dealProducts = useMemo(() => {
    if (!allProductsFromStore || allProductsFromStore.length === 0) {
      return [];
    }

    let list = [...allProductsFromStore];

    // Filter by tab
    if (activeTab === "biggest") {
      const highDiscount = list.filter((p) => getDiscountValue(p) >= 15);
      list = highDiscount.length > 0 ? highDiscount : list.filter((p) => getDiscountValue(p) > 0);
    } else if (activeTab === "under-25k") {
      list = list.filter((p) => {
        const price = p.priceNum || parsePriceNumber(p.price);
        return price > 0 && price < 25000;
      });
    } else if (activeTab === "rings") {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return cat.includes("ring") && !cat.includes("solitaire");
      });
    } else if (activeTab === "solitaires") {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return cat.includes("solitaire");
      });
    } else if (activeTab === "necklaces") {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return cat.includes("necklace") || cat.includes("pendant") || cat.includes("choker") || cat.includes("sets");
      });
    } else if (activeTab === "bracelets") {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return cat.includes("bracelet") || cat.includes("earring") || cat.includes("bangle");
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "discount") {
        return getDiscountValue(b) - getDiscountValue(a);
      }
      if (sortBy === "price-low") {
        const priceA = a.priceNum || parsePriceNumber(a.price);
        const priceB = b.priceNum || parsePriceNumber(b.price);
        return priceA - priceB;
      }
      if (sortBy === "price-high") {
        const priceA = a.priceNum || parsePriceNumber(a.price);
        const priceB = b.priceNum || parsePriceNumber(b.price);
        return priceB - priceA;
      }
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

    return list;
  }, [allProductsFromStore, activeTab, sortBy]);

  // Dynamic top spotlight cards selected from backend products
  const spotlightProducts = useMemo(() => {
    if (!allProductsFromStore || allProductsFromStore.length === 0) return [];
    const sorted = [...allProductsFromStore].sort((a, b) => {
      const discDiff = getDiscountValue(b) - getDiscountValue(a);
      if (discDiff !== 0) return discDiff;
      return (b.rating || 0) - (a.rating || 0);
    });
    return sorted.slice(0, 2);
  }, [allProductsFromStore]);

  const currentTheme = FESTIVAL_THEMES[dealsConfig.themeId] || FESTIVAL_THEMES["royal-gold"];

  return (
    <div className="w-full bg-[#FAF9F7] text-[#1C1208]">
      
      {/* ── 1. Hero Deals Banner Section (Themeable by Admin) ── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${currentTheme.bgGradient} text-white pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 border-b border-black/40 transition-colors duration-700`}>
        {/* Subtle Luxury Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8933F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentTheme.badgeBg} border ${currentTheme.badgeBorder} ${currentTheme.badgeText} text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-4 shadow-xs`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{dealsConfig.badge || "LIMITED TIME VAULT PRIVILEGE"}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#FAF9F7] leading-[1.15] mb-3 sm:mb-4">
                {dealsConfig.headline} <br className="hidden sm:inline" />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.accentTextGradient}`}>
                  {dealsConfig.headlineHighlight || "Exclusive Top Deals"}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#D4C9BC] font-light max-w-xl mb-6 leading-relaxed">
                {dealsConfig.subtitle}
              </p>

              {/* Live Countdown Timer */}
              <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-sm p-4 mb-6">
                <div className="flex items-center justify-between text-xs text-[#E5C278] font-medium uppercase tracking-wider mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {dealsConfig.festivalVibe || "Festive Deals"} Refresh In:
                  </span>
                  <span className="text-white/80 font-mono text-[11px]">LIVE COUNTER</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#1C1208]/80 border border-white/15 rounded-xs py-2 px-1">
                    <div className="font-montserrat font-bold text-lg sm:text-2xl text-white">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#A89F95]">Days</div>
                  </div>
                  <div className="bg-[#1C1208]/80 border border-white/15 rounded-xs py-2 px-1">
                    <div className="font-montserrat font-bold text-lg sm:text-2xl text-white">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#A89F95]">Hours</div>
                  </div>
                  <div className="bg-[#1C1208]/80 border border-white/15 rounded-xs py-2 px-1">
                    <div className="font-montserrat font-bold text-lg sm:text-2xl text-white">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#A89F95]">Mins</div>
                  </div>
                  <div className="bg-[#1C1208]/80 border border-white/15 rounded-xs py-2 px-1">
                    <div className="font-montserrat font-bold text-lg sm:text-2xl text-[#E5C278] animate-pulse">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#A89F95]">Secs</div>
                  </div>
                </div>
              </div>

              {/* Fast Trust Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-[#C5BCB1]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B8933F]" />
                  <span>100% BIS Hallmarked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#B8933F]" />
                  <span>Free Gold Coin &gt; ₹50k</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#B8933F]" />
                  <span>Armored Insured Delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Luxury Voucher Card (Themeable) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className={`w-full max-w-md bg-gradient-to-b ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-sm p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group transition-all duration-700`}>
                {/* Decorative Glow */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#E5C278] block">
                      {dealsConfig.festivalVibe || "FESTIVE VAULT PRIVILEGE"}
                    </span>
                    <h3 className="font-serif-luxury text-xl font-bold text-white">
                      {dealsConfig.primaryVoucherDiscount || "Extra 5% Privilege Code"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#E5C278]">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-[#D1CBC3] mb-5 leading-relaxed font-light">
                  {dealsConfig.primaryVoucherDesc || "Apply code at checkout for an instant reduction on all marked-down top deal jewellery items."}
                </p>

                {/* Voucher Code Box with Copy */}
                <div className="flex items-center justify-between bg-black/40 border border-white/20 rounded-xs p-2.5 mb-4">
                  <div className="pl-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#A89F95] block">
                      FEATURED COUPON CODE
                    </span>
                    <span className="font-mono text-base sm:text-lg font-bold tracking-widest text-[#E5C278]">
                      {dealsConfig.primaryVoucherCode || "FESTIVEGOLD"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(dealsConfig.primaryVoucherCode || "FESTIVEGOLD")}
                    className={`px-3.5 py-2 ${currentTheme.primaryButtonBg} text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors active:scale-95 shadow-sm`}
                  >
                    {copiedCode === (dealsConfig.primaryVoucherCode || "FESTIVEGOLD") ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Free Coin Promo inside Voucher */}
                <div className="flex items-center gap-2.5 text-xs text-[#FAF8F5] bg-white/10 border border-white/20 p-2.5 rounded-xs">
                  <Gift className="w-4 h-4 text-[#E5C278] flex-shrink-0" />
                  <span className="text-[11px] leading-tight">
                    {dealsConfig.freeGiftText || "Complimentary 24K Hallmarked Gold Coin included automatically on orders above ₹50,000!"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 1.5. Dynamic Festival Coupon Codes Strip ── */}
      {dealsConfig.codes && dealsConfig.codes.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 mb-8">
          <div className="bg-white rounded-sm border border-[#EAE3D5] p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F0ECE5] pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#B8933F]" />
                <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-[#1C1208]">
                  {dealsConfig.festivalVibe || "Festive"} Exclusive Privilege Codes
                </h3>
                <span className="text-[10px] font-bold bg-[#B8933F]/15 text-[#B8933F] px-2 py-0.5 rounded-full uppercase">
                  Active Vouchers
                </span>
              </div>
              <span className="text-[11px] text-[#767069]">
                Click any code to copy and apply directly at checkout
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dealsConfig.codes.map((item) => {
                const isCopied = copiedCode === item.code;
                return (
                  <div
                    key={item.code}
                    className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-3 flex flex-col justify-between hover:border-[#B8933F] hover:shadow-xs transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#1C1208] tracking-wider bg-white px-2 py-0.5 rounded-xs border border-[#DDD5C7] group-hover:border-[#B8933F] group-hover:text-[#B8933F] transition-colors">
                          {item.code}
                        </span>
                        <span className="text-[10px] font-bold text-[#B8933F] bg-[#B8933F]/10 px-1.5 py-0.5 rounded-xs">
                          {item.discount}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#554E46] leading-snug line-clamp-2 mb-2 font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE5] text-[10px] text-[#767069]">
                      <span>{item.minSpend || "No min spend"}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.code)}
                        className="font-semibold text-[#B8933F] hover:text-[#9E792B] flex items-center gap-1 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 2. Promotional Spotlight Banners (From Backend Database) ── */}
      {isProductsLoading && spotlightProducts.length === 0 ? (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-sm bg-white border border-[#EAE3D5] p-6 h-60 flex flex-col justify-between shadow-md">
                <div className="space-y-3">
                  <div className="h-4 bg-[#EAE3D5] rounded w-1/4" />
                  <div className="h-6 bg-[#EAE3D5] rounded w-3/4" />
                  <div className="h-3 bg-[#EAE3D5] rounded w-1/2" />
                </div>
                <div className="h-4 bg-[#EAE3D5] rounded w-1/3" />
              </div>
            ))}
          </div>
        </section>
      ) : spotlightProducts.length > 0 ? (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {spotlightProducts.map((p, idx) => {
              const discountVal = getDiscountValue(p);
              const origPrice = p.compareAtPrice || p.originalPrice;
              const productUrl = `/product/${p.slug || p.id}`;
              const badgeLabel = idx === 0 ? "ROYAL BRIDAL SPOTLIGHT" : "SOLITAIRE & VAULT EDIT";
              const tagCategory = (p.category || "FINE JEWELLERY").toUpperCase();

              return (
                <div
                  key={p.id || idx}
                  className="relative overflow-hidden rounded-sm bg-white border border-[#EAE3D5] shadow-md group flex flex-col sm:flex-row"
                >
                  <div className="relative w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto min-h-[220px] bg-[#F5F2EB] overflow-hidden">
                    <Image
                      src={p.primaryImage || "/images/drop_cut_blue_banner.jpg"}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {discountVal > 0 && (
                      <span className="absolute top-3 left-3 bg-[#B8933F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        SAVE {discountVal}%
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B8933F] block">
                          {tagCategory}
                        </span>
                        <span className="text-[9px] uppercase font-bold bg-[#B8933F]/10 text-[#B8933F] px-1.5 py-0.5 rounded-xs">
                          {badgeLabel}
                        </span>
                      </div>
                      <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1208] mb-2 leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#6E675F] line-clamp-2 mb-3">
                        {p.description || "Handcrafted with certified natural gemstones and BIS 916 hallmarked pure gold."}
                      </p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-[#B8933F]">{p.price}</span>
                        {origPrice && (
                          <span className="text-xs text-[#9E9790] line-through">{origPrice}</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={productUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1208] group-hover:text-[#B8933F] uppercase tracking-wider transition-colors"
                    >
                      <span>Claim This Deal</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* ── 3. Deals Listing Header & Filter Bar ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D5] pb-5 mb-6">
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-1">
              ZHAEVAAH VAULT SELECTIONS
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208]">
              All Top Deals & Marked-Down Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#767069] mt-1 font-light">
              Showing <strong>{dealProducts.length} handcrafted pieces</strong> with live percentage discount badges.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#767069] uppercase tracking-wider font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#DDD5C7] rounded-xs px-3 py-1.5 text-xs font-medium text-[#1C1208] focus:outline-none focus:border-[#B8933F] shadow-xs cursor-pointer"
            >
              <option value="discount">Biggest Discount First (%)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {[
            { id: "all", label: "All Top Deals" },
            { id: "biggest", label: "🔥 Biggest Offers (15%+ Off)" },
            { id: "under-25k", label: "Under ₹25,000" },
            { id: "rings", label: "Diamond Rings" },
            { id: "solitaires", label: "Solitaire Rings" },
            { id: "necklaces", label: "Necklaces & Pendants" },
            { id: "bracelets", label: "Bracelets & Earrings" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as DealTab)}
              className={`px-3.5 py-1.5 text-xs whitespace-nowrap rounded-full transition-all border ${
                activeTab === tab.id
                  ? "bg-[#1C1208] text-white border-[#1C1208] font-semibold shadow-xs"
                  : "bg-white text-[#524B43] border-[#E5DFD5] hover:border-[#B8933F] hover:text-[#B8933F]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </section>

      {/* ── 4. Products Grid (With Skeleton Loading Effect) ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading || (isProductsLoading && allProductsFromStore.length === 0) ? (
          <ProductGridSkeleton count={8} cols={4} />
        ) : dealProducts.length === 0 ? (
          <div className="bg-white border border-[#EAE3D5] rounded-xs p-12 text-center my-8">
            <Tag className="w-10 h-10 text-[#B8933F] mx-auto mb-3" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#1C1208] mb-1">
              No deals match your selected filter
            </h3>
            <p className="text-xs text-[#767069] mb-4">
              Try resetting your deal category filter to view all available vault offers.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="px-5 py-2.5 bg-[#B8933F] text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
            >
              View All Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── 5. Value Trust Guarantees ── */}
      <section className="border-t border-[#EAE3D5] bg-white py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EE] text-[#B8933F] flex items-center justify-center mb-3">
                <Coins className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#1C1208] mb-1">Complimentary Gold Coin</h4>
              <p className="text-xs text-[#767069] leading-relaxed">
                Free 24K hallmarked gold coin on every order exceeding ₹50,000.
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EE] text-[#B8933F] flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#1C1208] mb-1">100% Certified Diamonds</h4>
              <p className="text-xs text-[#767069] leading-relaxed">
                Every gemstone certified by international gemological laboratories (IGI / SGL).
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EE] text-[#B8933F] flex items-center justify-center mb-3">
                <RotateCcw className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#1C1208] mb-1">15-Day Hassle-Free Returns</h4>
              <p className="text-xs text-[#767069] leading-relaxed">
                100% full money-back guarantee with complimentary doorstep armored pickup.
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6EE] text-[#B8933F] flex items-center justify-center mb-3">
                <Truck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#1C1208] mb-1">Express Armored Transit</h4>
              <p className="text-xs text-[#767069] leading-relaxed">
                Fully insured delivery to 19,000+ PIN codes across India in tamper-proof boxes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. Deal FAQs ── */}
      <section className="bg-[#FAF9F7] py-12 sm:py-16 border-t border-[#EAE3D5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-[#B8933F] block mb-1">
              QUESTIONS & POLICIES
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208]">
              Frequently Asked Deal Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Are the marked-down deal items authentic and certified?",
                a: "Yes, absolutely. Every piece in our Top Deals selection is crafted from genuine BIS hallmarked 18kt or 22kt gold and certified natural diamonds. Each shipment includes an official IGI or SGL Certificate of Authenticity.",
              },
              {
                q: "How do I claim the free 24K Gold Coin?",
                a: "Any order containing jewellery with a net cart value of ₹50,000 or more automatically qualifies for our complimentary 24K BIS hallmarked gold coin. It is packaged securely inside your velvet presentation case.",
              },
              {
                q: "Can I combine the coupon code FESTIVEGOLD with deal prices?",
                a: "Yes! You can enter coupon code FESTIVEGOLD during checkout to receive an instant additional 5% off your entire order, stacked right on top of our existing vault discounts.",
              },
              {
                q: "What is the return policy for Top Deals jewellery?",
                a: "All items purchased during our Top Deals privilege sale carry our standard 15-day 100% full money-back guarantee. Zero restocking fees, with free insured reverse pickup from your doorstep.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-[#EAE3D5] rounded-xs p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#1C1208] group-hover:text-[#B8933F] transition-colors">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-[#767069] transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-xs sm:text-[13px] text-[#6E675F] leading-relaxed font-light border-t border-[#F2ECE4] pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}


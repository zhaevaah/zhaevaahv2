"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Gift,
  ArrowRight,
  Plus,
  Trash2,
  Settings,
  X,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { useStore } from "../context/StoreContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";
import {
  apiGetBanners,
  apiGetCoupons,
  apiCreateCoupon,
  apiUpdateCoupon,
  apiDeleteCoupon,
  apiCreateBanner,
  apiDeleteBanner,
  CouponItem,
} from "../lib/api";
import { FESTIVAL_THEMES, DealsFestivalTheme } from "../data/dealsConfig";

type DealTab =
  | "all"
  | "biggest"
  | "under-25k"
  | "rings"
  | "solitaires"
  | "necklaces"
  | "bracelets";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  ctaText?: string;
  badge?: string;
  discount?: string;
}

const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "slide-1",
    title: "Royal Diwali Fine Gold & Solitaire Edit",
    subtitle: "Up to 35% Off on BIS 916 Hallmarked Gold & Natural Diamonds",
    image: "/images/ZhaevaahHero.jpg",
    link: "/women",
    ctaText: "EXPLORE OFFERS",
    badge: "FESTIVAL EXCLUSIVE",
    discount: "UP TO 35% OFF",
  },
  {
    id: "slide-2",
    title: "Bespoke Royal Nizam Bridal Suites",
    subtitle: "Complimentary 24K Gold Coin with insured express delivery",
    image: "/images/collection.webp",
    link: "/women",
    ctaText: "CLAIM PRIVILEGE",
    badge: "LIMITED PRIVILEGE",
    discount: "FREE 24K COIN",
  },
  {
    id: "slide-3",
    title: "Certified Solitaire Diamond Rings",
    subtitle: "IGI & SGL Certified natural solitaires crafted in 18kt pure gold",
    image: "/images/hero_woman_hd.jpg",
    link: "/women",
    ctaText: "VIEW COLLECTION",
    badge: "ATELIER SELECTION",
    discount: "EXTRA 5% CODE",
  },
  {
    id: "slide-4",
    title: "Everyday Luxury Tennis Bracelets",
    subtitle: "Handcrafted 18KT rose gold with prong-set brilliance",
    image: "/images/bracelet_hotsell_banner.jpg",
    link: "/women",
    ctaText: "DISCOVER NOW",
    badge: "HOTSELL FAVORITE",
    discount: "EXTRA 20% OFF",
  },
];

const PRESET_CAROUSEL_IMAGES = [
  { label: "Hero Solitaire Gold", url: "/images/ZhaevaahHero.jpg" },
  { label: "Royal Bridal Suite", url: "/images/collection.webp" },
  { label: "Fine Jewelry Model", url: "/images/hero_woman_hd.jpg" },
  { label: "Rose Gold Bracelet", url: "/images/bracelet_hotsell_banner.jpg" },
  { label: "Blue Sapphire Drop", url: "/images/drop_cut_blue_banner.jpg" },
  { label: "Diamond Ring Spotlight", url: "/images/ad_banner_ring_full.jpg" },
];

export default function TopDealsPageContent() {
  const { showToast } = useStore();
  const dispatch = useAppDispatch();
  const allProductsFromStore = useAppSelector((state) => state.products.items);
  const productsStatus = useAppSelector((state) => state.products.status);
  const isProductsLoading = productsStatus === "loading";

  // Deals & Coupons state from backend
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(DEFAULT_CAROUSEL_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Filter & sort
  const [activeTab, setActiveTab] = useState<DealTab>("all");
  const [sortBy, setSortBy] = useState<string>("discount");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Admin Management Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<"coupons" | "carousel">("coupons");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon Creation Form
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponScope, setNewCouponScope] = useState<"festival" | "general">("festival");
  const [newCouponFestival, setNewCouponFestival] = useState("Diwali Festival of Lights");
  const [newCouponDiscountType, setNewCouponDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [newCouponDiscountValue, setNewCouponDiscountValue] = useState<number>(20);
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState<string>("5000");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<string>("10000");
  const [newCouponUsageUser, setNewCouponUsageUser] = useState<number>(1);
  const [newCouponUsageTotal, setNewCouponUsageTotal] = useState<string>("500");
  const [newCouponEndDate, setNewCouponEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 16);
  });
  const [newCouponBadge, setNewCouponBadge] = useState("Extra 20% OFF");
  const [newCouponShowInDeals, setNewCouponShowInDeals] = useState(true);

  // Carousel Slide Creation Form
  const [newSlideTitle, setNewSlideTitle] = useState("");
  const [newSlideSubtitle, setNewSlideSubtitle] = useState("");
  const [newSlideImage, setNewSlideImage] = useState("/images/ZhaevaahHero.jpg");
  const [newSlideLink, setNewSlideLink] = useState("/women");
  const [newSlideBadge, setNewSlideBadge] = useState("FESTIVE PRIVILEGE");
  const [newSlideDiscount, setNewSlideDiscount] = useState("UP TO 30% OFF");
  const [newSlideCta, setNewSlideCta] = useState("SHOP THIS DEAL");

  // Load products and backend data
  const loadCouponsAndBanners = async () => {
    try {
      // 1. Fetch backend coupons
      const cRes = await apiGetCoupons({ topDealsOnly: true });
      if (cRes.success && Array.isArray(cRes.coupons) && cRes.coupons.length > 0) {
        setCoupons(cRes.coupons);
      } else {
        // Fallback fetch all coupons
        const allRes = await apiGetCoupons();
        if (allRes.success && Array.isArray(allRes.coupons) && allRes.coupons.length > 0) {
          setCoupons(allRes.coupons);
        }
      }

      // 2. Fetch promotional/deals carousel banners
      const bRes = await apiGetBanners("TOP_DEALS");
      if (bRes.success && bRes.banners) {
        const list = Array.isArray(bRes.banners.topDeals)
          ? bRes.banners.topDeals
          : Array.isArray(bRes.banners)
          ? bRes.banners.filter((b: any) => b.type === "TOP_DEALS")
          : [];

        if (list.length > 0) {
          setCarouselSlides(
            list.map((b: any) => ({
              id: b.id || b._id,
              title: b.title,
              subtitle: b.subtitle,
              image: b.image,
              link: b.link || "/women",
              ctaText: b.ctaText || "SHOP NOW",
              badge: b.badge || "LIMITED DEAL",
              discount: b.discount || "SPECIAL OFFER",
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Could not load backend coupons or banners:", err);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    dispatch(fetchProducts({ limit: 100 }));
    loadCouponsAndBanners();
  }, [dispatch]);

  // Featured coupon: prefer active festival-specific coupon with highest discount
  const featuredCoupon = useMemo(() => {
    if (!coupons || coupons.length === 0) return null;
    const festivalCoupons = coupons.filter((c) => c.isFestivalSpecific && c.isActive);
    if (festivalCoupons.length > 0) return festivalCoupons[0];
    return coupons[0];
  }, [coupons]);

  // Dynamic live countdown timeline synchronized with featured coupon endDate
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 48,
    seconds: 4,
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (featuredCoupon?.endDate) {
        const diff = new Date(featuredCoupon.endDate).getTime() - Date.now();
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          });
          return;
        }
      }

      // Decrement fallback timer second-by-second
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 2, hours: 14, minutes: 48, seconds: 4 };
      });
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [featuredCoupon]);

  // Auto-cycle carousel every 5s if not paused
  useEffect(() => {
    if (carouselSlides.length <= 1 || isCarouselPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselSlides.length, isCarouselPaused]);

  // Shimmer skeleton when filtering or sorting
  useEffect(() => {
    if (!isHydrated) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 260);
    return () => clearTimeout(timer);
  }, [activeTab, sortBy, isHydrated]);

  const handleCopyCode = (code: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Coupon code "${code}" copied to clipboard! Applied at checkout.`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const parsePriceNumber = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

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

  // Filter and prioritize all store products for Top Deals
  const dealProducts = useMemo(() => {
    if (!allProductsFromStore || allProductsFromStore.length === 0) return [];

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
        return (
          cat.includes("necklace") ||
          cat.includes("pendant") ||
          cat.includes("choker") ||
          cat.includes("sets")
        );
      });
    } else if (activeTab === "bracelets") {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return cat.includes("bracelet") || cat.includes("earring") || cat.includes("bangle");
      });
    }

    // Sort: default to biggest percentage discount first
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

  // Spotlight cards
  const spotlightProducts = useMemo(() => {
    if (!allProductsFromStore || allProductsFromStore.length === 0) return [];
    const sorted = [...allProductsFromStore].sort((a, b) => {
      const discDiff = getDiscountValue(b) - getDiscountValue(a);
      if (discDiff !== 0) return discDiff;
      return (b.rating || 0) - (a.rating || 0);
    });
    return sorted.slice(0, 2);
  }, [allProductsFromStore]);

  // Admin: Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponTitle.trim()) {
      showToast("Coupon Code and Title are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiCreateCoupon({
        code: newCouponCode.trim().toUpperCase(),
        title: newCouponTitle.trim(),
        description: newCouponDesc.trim() || undefined,
        isFestivalSpecific: newCouponScope === "festival",
        festivalName: newCouponScope === "festival" ? newCouponFestival.trim() : "General",
        discountType: newCouponDiscountType,
        discountValue: Number(newCouponDiscountValue) || 10,
        maxDiscountAmount: newCouponMaxDiscount ? Number(newCouponMaxDiscount) : null,
        minOrderValue: newCouponMinOrder ? Number(newCouponMinOrder) : 0,
        usageLimitPerUser: Number(newCouponUsageUser) || 1,
        usageLimitTotal: newCouponUsageTotal ? Number(newCouponUsageTotal) : null,
        endDate: newCouponEndDate ? new Date(newCouponEndDate).toISOString() : null,
        badge: newCouponBadge.trim() || undefined,
        showInTopDeals: newCouponShowInDeals,
        isActive: true,
      });

      if (res.success) {
        showToast(`Coupon ${newCouponCode.toUpperCase()} created successfully!`);
        setNewCouponCode("");
        setNewCouponTitle("");
        setNewCouponDesc("");
        loadCouponsAndBanners();
      } else {
        showToast(res.message || "Failed to create coupon.");
      }
    } catch (err: any) {
      showToast(err.message || "Network error creating coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin: Delete Coupon
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      const res = await apiDeleteCoupon(id);
      if (res.success) {
        showToast(`Coupon "${code}" deleted.`);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        showToast(res.message || "Failed to delete coupon.");
      }
    } catch (err: any) {
      showToast(err.message || "Error deleting coupon.");
    }
  };

  // Admin: Toggle Coupon Active
  const handleToggleCouponActive = async (coupon: CouponItem) => {
    try {
      const res = await apiUpdateCoupon(coupon.id, { isActive: !coupon.isActive });
      if (res.success) {
        showToast(`Coupon "${coupon.code}" ${!coupon.isActive ? "activated" : "deactivated"}.`);
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch {
      showToast("Error updating coupon status.");
    }
  };

  // Admin: Create Carousel Slide
  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle.trim() || !newSlideImage.trim()) {
      showToast("Slide Title and Image URL are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiCreateBanner({
        title: newSlideTitle.trim(),
        subtitle: newSlideSubtitle.trim() || undefined,
        image: newSlideImage.trim(),
        link: newSlideLink.trim() || "/women",
        ctaText: newSlideCta.trim() || "SHOP NOW",
        badge: newSlideBadge.trim() || undefined,
        discount: newSlideDiscount.trim() || undefined,
        type: "TOP_DEALS",
        position: carouselSlides.length + 1,
        isActive: true,
      });

      if (res.success) {
        showToast("New carousel banner slide added!");
        setNewSlideTitle("");
        setNewSlideSubtitle("");
        loadCouponsAndBanners();
      } else {
        showToast(res.message || "Failed to create slide.");
      }
    } catch (err: any) {
      showToast(err.message || "Error creating slide.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin: Delete Carousel Slide
  const handleDeleteSlide = async (id: string, title: string) => {
    if (!confirm(`Delete carousel slide "${title}"?`)) return;
    try {
      const res = await apiDeleteBanner(id);
      if (res.success) {
        showToast("Carousel slide deleted.");
        setCarouselSlides((prev) => prev.filter((s) => s.id !== id));
      } else {
        showToast(res.message || "Failed to delete slide.");
      }
    } catch (err: any) {
      showToast(err.message || "Error deleting slide.");
    }
  };

  // Mobile Touch Swipe Handlers for Full-Screen Carousel
  const carouselTouchStartX = useRef<number | null>(null);
  const carouselTouchEndX = useRef<number | null>(null);

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    setIsCarouselPaused(true);
    carouselTouchStartX.current = e.targetTouches[0].clientX;
  };

  const handleCarouselTouchMove = (e: React.TouchEvent) => {
    carouselTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleCarouselTouchEnd = () => {
    if (carouselTouchStartX.current === null || carouselTouchEndX.current === null) {
      setIsCarouselPaused(false);
      return;
    }
    const diffX = carouselTouchStartX.current - carouselTouchEndX.current;
    if (diffX > 40) {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    } else if (diffX < -40) {
      setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    }
    carouselTouchStartX.current = null;
    carouselTouchEndX.current = null;
    setIsCarouselPaused(false);
  };

  const activeSlideData = carouselSlides[currentSlide] || carouselSlides[0] || DEFAULT_CAROUSEL_SLIDES[0];

  return (
    <div className="w-full bg-[#FAF9F7] text-[#1C1208]">

      {/* ── 1. Full-Screen Grand Carousel Banner with Centered "Ends In" Timing ── */}
      <section
        className="relative w-full h-[62vh] sm:h-[68vh] md:h-[74vh] min-h-[500px] max-h-[720px] overflow-hidden select-none bg-[#120305]"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onTouchStart={handleCarouselTouchStart}
        onTouchMove={handleCarouselTouchMove}
        onTouchEnd={handleCarouselTouchEnd}
      >
        {/* Full Screen Carousel Image Background */}
        <div className="absolute inset-0">
          <Image
            src={activeSlideData.image}
            alt={activeSlideData.title}
            fill
            priority
            className="object-cover object-center transition-all duration-700 ease-out"
            sizes="100vw"
          />
        </div>

        {/* Subtle Bottom Vignette so Lower Bottom Timing is Perfectly Legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

        {/* Clickable Full-Banner Link to Collection */}
        <Link
          href={activeSlideData.link || "/women"}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={activeSlideData.title || "Explore Deals"}
        />

        {/* ── Lower Bottom Timing Countdown Only (No Middle Text or Buttons) ── */}
        <div className="absolute bottom-9 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md border border-[#E5C278]/40 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-1.5 text-[#E5C278] text-[10px] sm:text-xs font-montserrat font-bold tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5 animate-pulse text-[#E5C278]" />
            <span>ENDS IN:</span>
          </div>

          {/* Countdown Digits */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-white text-xs sm:text-sm font-semibold tracking-wider">
            <div className="flex items-baseline gap-0.5">
              <span className="font-bold text-sm sm:text-base text-white">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-[#A89F95] uppercase">d</span>
            </div>
            <span className="text-[#E5C278] font-bold">:</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-bold text-sm sm:text-base text-white">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-[#A89F95] uppercase">h</span>
            </div>
            <span className="text-[#E5C278] font-bold">:</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-bold text-sm sm:text-base text-white">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-[#A89F95] uppercase">m</span>
            </div>
            <span className="text-[#E5C278] font-bold">:</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-bold text-sm sm:text-base text-[#E5C278] animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-[#A89F95] uppercase">s</span>
            </div>
          </div>
        </div>

        {/* Floating Chevrons: Large, Transparent & Less Visible */}
        {carouselSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(
                  (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
                );
              }}
              className="absolute left-1 sm:left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center p-2 sm:p-3 bg-transparent text-white/25 hover:text-white/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 stroke-[1]" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
              }}
              className="absolute right-1 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center p-2 sm:p-3 bg-transparent text-white/25 hover:text-white/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 stroke-[1]" />
            </button>
          </>
        )}

        {/* Minimal Bottom Indicators */}
        {carouselSlides.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-md">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? "w-6 bg-[#E5C278]"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Clean Luxury Trust Strip ── */}
      <div className="w-full bg-[#180508] border-b border-[#3D141C] py-3.5 px-4 text-white/90">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs tracking-wider uppercase font-medium text-[#E5D7C3]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B8933F]" />
            <span>100% BIS Hallmarked</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#B8933F]" />
            <span>Armored Insured Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#B8933F]" />
            <span>Complimentary 24K Gold Coin &gt; ₹50k</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#B8933F]" />
            <span>15-Day Guaranteed Exchange</span>
          </div>
        </div>
      </div>

      {/* ── 2. Dynamic Festival Coupon Codes Strip (Fetched from Backend Database) ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-sm border border-[#EAE3D5] p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#F0ECE5] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#B8933F]" />
              <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-[#1C1208]">
                Exclusive Privilege Vouchers from Backend
              </h3>
              <span className="text-[10px] font-bold bg-[#B8933F]/15 text-[#B8933F] px-2 py-0.5 rounded-full uppercase">
                {coupons.length} Active Codes
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#767069]">
                Click any code to copy and apply directly at checkout
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {coupons.map((item) => {
              const isCopied = copiedCode === item.code;
              const discountText =
                item.badge ||
                (item.discountType === "PERCENTAGE"
                  ? `${item.discountValue}% OFF`
                  : `₹${item.discountValue.toLocaleString()} FLAT`);

              return (
                <div
                  key={item.id || item.code}
                  className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-3.5 flex flex-col justify-between hover:border-[#B8933F] hover:shadow-xs transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#1C1208] tracking-wider bg-white px-2 py-0.5 rounded-xs border border-[#DDD5C7] group-hover:border-[#B8933F] group-hover:text-[#B8933F] transition-colors">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#B8933F] bg-[#B8933F]/10 px-1.5 py-0.5 rounded-xs">
                        {discountText}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#1C1208] mb-1 line-clamp-1">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-[11px] text-[#554E46] leading-snug line-clamp-2 mb-2 font-light">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE5] text-[10px] text-[#767069]">
                    <span>
                      {item.minOrderValue && item.minOrderValue > 0
                        ? `Min ₹${item.minOrderValue.toLocaleString()}`
                        : "No min spend"}
                    </span>
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

      {/* ── 3. Promotional Spotlight Cards (From Store Database) ── */}
      {isProductsLoading && spotlightProducts.length === 0 ? (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-8">
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
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-8">
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

      {/* ── 4. Deals Listing Header & Filter Bar ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D5] pb-5 mb-6">
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#B8933F] block mb-1">
              ZHAEVAAH VAULT SELECTIONS
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208]">
              All Top Deals &amp; Marked-Down Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#767069] mt-1 font-light">
              Showing <strong>{dealProducts.length} handcrafted pieces</strong> sorted by highest percentage discounts.
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

      {/* ── 5. Products Grid (With Skeleton Loading Effect) ── */}
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

      {/* ── 6. Value Trust Guarantees ── */}
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

      {/* ── 7. Deal FAQs ── */}
      <section className="bg-[#FAF9F7] py-12 sm:py-16 border-t border-[#EAE3D5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-[#B8933F] block mb-1">
              QUESTIONS &amp; POLICIES
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
                q: "Can I combine backend discount coupons with deal prices?",
                a: "Yes! You can apply active coupon codes during checkout to receive an instant extra reduction on your order, stacked right on top of our existing vault discounts.",
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

      {/* ── 8. ADMIN DEALS & COUPON MANAGEMENT MODAL ── */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-[#EAE3D5] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#1C1208]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE3D5] bg-[#FAF9F7]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#B8933F]/15 text-[#B8933F] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#1C1208]">
                    Deals &amp; Coupons Manager (Admin)
                  </h3>
                  <p className="text-xs text-[#767069]">
                    Create festival-specific &amp; general coupons, set limits, and add promotional carousel slides.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#EAE3D5] text-[#767069] hover:text-[#1C1208] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#EAE3D5] bg-[#F5F2EB] px-6">
              <button
                type="button"
                onClick={() => setAdminTab("coupons")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  adminTab === "coupons"
                    ? "border-[#B8933F] text-[#B8933F] bg-white"
                    : "border-transparent text-[#767069] hover:text-[#1C1208]"
                }`}
              >
                1. Coupons &amp; Festival Vouchers ({coupons.length})
              </button>
              <button
                type="button"
                onClick={() => setAdminTab("carousel")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  adminTab === "carousel"
                    ? "border-[#B8933F] text-[#B8933F] bg-white"
                    : "border-transparent text-[#767069] hover:text-[#1C1208]"
                }`}
              >
                2. Top Deals Carousel Slides ({carouselSlides.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: COUPONS */}
              {adminTab === "coupons" && (
                <div className="space-y-8">
                  
                  {/* Create Coupon Form */}
                  <form onSubmit={handleCreateCoupon} className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-5">
                    <h4 className="font-serif-luxury font-bold text-base text-[#1C1208] mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#B8933F]" />
                      <span>Create New Festival or General Coupon</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      
                      {/* Code */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Coupon Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. DIWALI25"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Title / Headline *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCouponTitle}
                          onChange={(e) => setNewCouponTitle(e.target.value)}
                          placeholder="e.g. Diwali Grand Solitaire Rush"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Scope: Festival vs General */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Coupon Scope *
                        </label>
                        <select
                          value={newCouponScope}
                          onChange={(e) => setNewCouponScope(e.target.value as "festival" | "general")}
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        >
                          <option value="festival">Festival Specific Coupon</option>
                          <option value="general">General Store Coupon</option>
                        </select>
                      </div>

                      {/* Festival Name (if festival specific) */}
                      {newCouponScope === "festival" && (
                        <div>
                          <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                            Festival / Occasion Name
                          </label>
                          <input
                            type="text"
                            value={newCouponFestival}
                            onChange={(e) => setNewCouponFestival(e.target.value)}
                            placeholder="e.g. Diwali Festival of Lights, Akshaya Tritiya"
                            className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Discount Type */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Discount Type
                        </label>
                        <select
                          value={newCouponDiscountType}
                          onChange={(e) => setNewCouponDiscountType(e.target.value as "PERCENTAGE" | "FLAT")}
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        >
                          <option value="PERCENTAGE">Percentage Discount (%)</option>
                          <option value="FLAT">Flat Price Cut (₹)</option>
                        </select>
                      </div>

                      {/* Discount Value */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Discount Value ({newCouponDiscountType === "PERCENTAGE" ? "%" : "₹"}) *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={newCouponDiscountValue}
                          onChange={(e) => setNewCouponDiscountValue(Number(e.target.value))}
                          placeholder={newCouponDiscountType === "PERCENTAGE" ? "20" : "2000"}
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Max Discount Cap */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Max Discount Cap (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newCouponMaxDiscount}
                          onChange={(e) => setNewCouponMaxDiscount(e.target.value)}
                          placeholder="e.g. 5000 (leaves blank for no cap)"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Min Order Value */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Minimum Order Value (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newCouponMinOrder}
                          onChange={(e) => setNewCouponMinOrder(e.target.value)}
                          placeholder="e.g. 10000"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Usage Limit Per User */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Usage Limit Per User
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newCouponUsageUser}
                          onChange={(e) => setNewCouponUsageUser(Number(e.target.value))}
                          placeholder="e.g. 1"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Total Usage Limit */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Total Global Usage Limit
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newCouponUsageTotal}
                          onChange={(e) => setNewCouponUsageTotal(e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Expiry Date / Timeline End */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Offer Expiry Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={newCouponEndDate}
                          onChange={(e) => setNewCouponEndDate(e.target.value)}
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Badge Text */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={newCouponBadge}
                          onChange={(e) => setNewCouponBadge(e.target.value)}
                          placeholder="e.g. Extra 20% OFF"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                        Voucher Description
                      </label>
                      <input
                        type="text"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        placeholder="e.g. Valid on all diamond solitaire rings and certified wedding bands"
                        className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                      />
                    </div>

                    {/* Checkbox: Show In Top Deals */}
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="showInTopDeals"
                        checked={newCouponShowInDeals}
                        onChange={(e) => setNewCouponShowInDeals(e.target.checked)}
                        className="w-4 h-4 text-[#B8933F] border-[#DDD5C7] rounded"
                      />
                      <label htmlFor="showInTopDeals" className="text-xs font-medium text-[#1C1208] cursor-pointer">
                        Display this coupon prominently on the Top Deals page vouchers strip
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#B8933F] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmitting ? "Creating..." : "Save & Activate Coupon"}</span>
                    </button>
                  </form>

                  {/* Existing Coupons Table */}
                  <div>
                    <h4 className="font-serif-luxury font-bold text-base text-[#1C1208] mb-3">
                      Active Store &amp; Festival Coupons ({coupons.length})
                    </h4>

                    <div className="border border-[#EAE3D5] rounded-xs overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F7] border-b border-[#EAE3D5] text-[#767069] uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3 font-semibold">Code</th>
                            <th className="py-2.5 px-3 font-semibold">Title</th>
                            <th className="py-2.5 px-3 font-semibold">Type &amp; Discount</th>
                            <th className="py-2.5 px-3 font-semibold">Min Order</th>
                            <th className="py-2.5 px-3 font-semibold">Scope</th>
                            <th className="py-2.5 px-3 font-semibold">Used</th>
                            <th className="py-2.5 px-3 font-semibold">Status</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0ECE5]">
                          {coupons.map((c) => (
                            <tr key={c.id || c.code} className="hover:bg-[#FAF9F7]/70">
                              <td className="py-2.5 px-3 font-mono font-bold text-[#1C1208]">
                                {c.code}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-[#1C1208] max-w-[180px] truncate">
                                {c.title}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="bg-[#B8933F]/10 text-[#B8933F] font-bold px-1.5 py-0.5 rounded-xs text-[10px]">
                                  {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `₹${c.discountValue}`} OFF
                                </span>
                                {c.maxDiscountAmount && (
                                  <span className="text-[10px] text-[#767069] block">
                                    (Max ₹{c.maxDiscountAmount})
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-[#554E46]">
                                {c.minOrderValue && c.minOrderValue > 0 ? `₹${c.minOrderValue}` : "₹0"}
                              </td>
                              <td className="py-2.5 px-3">
                                {c.isFestivalSpecific ? (
                                  <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-xs text-[10px] font-semibold">
                                    {c.festivalName || "Festival"}
                                  </span>
                                ) : (
                                  <span className="text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-xs text-[10px]">
                                    General
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-[#767069]">
                                {c.usedCount || 0}
                              </td>
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCouponActive(c)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    c.isActive
                                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  }`}
                                >
                                  {c.isActive ? "ACTIVE" : "INACTIVE"}
                                </button>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCoupon(c.id, c.code)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                  title="Delete coupon"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CAROUSEL SLIDES */}
              {adminTab === "carousel" && (
                <div className="space-y-8">
                  
                  {/* Create Carousel Slide Form */}
                  <form onSubmit={handleCreateSlide} className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-5">
                    <h4 className="font-serif-luxury font-bold text-base text-[#1C1208] mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#B8933F]" />
                      <span>Add New Top Deals Carousel Slide</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      
                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Slide Headline *
                        </label>
                        <input
                          type="text"
                          required
                          value={newSlideTitle}
                          onChange={(e) => setNewSlideTitle(e.target.value)}
                          placeholder="e.g. Auspicious Dhanteras Solitaire Rush"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Subtitle / Offer Description
                        </label>
                        <input
                          type="text"
                          value={newSlideSubtitle}
                          onChange={(e) => setNewSlideSubtitle(e.target.value)}
                          placeholder="e.g. Up to 40% Off on Certified Solitaires + Free Gold Coin"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Badge */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={newSlideBadge}
                          onChange={(e) => setNewSlideBadge(e.target.value)}
                          placeholder="e.g. LIMITED EDITION"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Discount text */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Discount Callout
                        </label>
                        <input
                          type="text"
                          value={newSlideDiscount}
                          onChange={(e) => setNewSlideDiscount(e.target.value)}
                          placeholder="e.g. UP TO 40% OFF"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* CTA text */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={newSlideCta}
                          onChange={(e) => setNewSlideCta(e.target.value)}
                          placeholder="e.g. SHOP NOW"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                      {/* Link */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                          Target Redirect Link
                        </label>
                        <input
                          type="text"
                          value={newSlideLink}
                          onChange={(e) => setNewSlideLink(e.target.value)}
                          placeholder="e.g. /women or /men"
                          className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none"
                        />
                      </div>

                    </div>

                    {/* Image URL & Presets */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-[#1C1208] mb-1">
                        Background Image URL *
                      </label>
                      <input
                        type="text"
                        required
                        value={newSlideImage}
                        onChange={(e) => setNewSlideImage(e.target.value)}
                        placeholder="Image URL or choose a preset below"
                        className="w-full bg-white border border-[#DDD5C7] rounded-xs px-3 py-2 text-xs text-[#1C1208] focus:border-[#B8933F] focus:outline-none mb-2"
                      />

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-[#767069] mr-1">Quick Presets:</span>
                        {PRESET_CAROUSEL_IMAGES.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setNewSlideImage(preset.url)}
                            className={`px-2 py-1 rounded-xs border text-[10px] font-medium transition-colors ${
                              newSlideImage === preset.url
                                ? "bg-[#B8933F] text-white border-[#B8933F]"
                                : "bg-white text-[#554E46] border-[#DDD5C7] hover:border-[#B8933F]"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#B8933F] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmitting ? "Adding Slide..." : "Add Slide to Carousel"}</span>
                    </button>
                  </form>

                  {/* Existing Carousel Slides Grid */}
                  <div>
                    <h4 className="font-serif-luxury font-bold text-base text-[#1C1208] mb-3">
                      Current Carousel Banner Slides ({carouselSlides.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {carouselSlides.map((slide, idx) => (
                        <div
                          key={slide.id || idx}
                          className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs p-3.5 flex flex-col justify-between"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="relative w-20 h-16 rounded-xs overflow-hidden flex-shrink-0 bg-black/10">
                              <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] uppercase font-bold text-[#B8933F] block">
                                Slide #{idx + 1} • {slide.badge || "PROMO"}
                              </span>
                              <h5 className="font-serif-luxury font-bold text-xs text-[#1C1208] truncate">
                                {slide.title}
                              </h5>
                              <p className="text-[11px] text-[#767069] line-clamp-1">
                                {slide.subtitle || "No subtitle"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE5] text-[10px]">
                            <span className="text-[#767069] truncate">
                              Link: {slide.link || "/women"}
                            </span>
                            {carouselSlides.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSlide(slide.id, slide.title)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#EAE3D5] bg-[#FAF9F7] flex items-center justify-between">
              <span className="text-[11px] text-[#767069]">
                ZHAEVAAH Luxury Atelier • Changes sync in real-time with database
              </span>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="px-4 py-1.5 bg-[#1C1208] text-white text-xs font-semibold rounded-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

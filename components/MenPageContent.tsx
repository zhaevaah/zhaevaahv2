"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  X,
  Star,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Check,
  Copy,
} from "lucide-react";
import CollectionBannerCarousel from "./CollectionBannerCarousel";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { MENS_CATEGORIES, CatalogProduct } from "../data/products";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMensProducts, fetchCategories } from "../redux/slices/productsSlice";
import {
  CollectionPageConfig,
  DEFAULT_MENS_PAGE_CONFIG,
} from "../lib/collectionPageConfig";

const ITEMS_PER_PAGE = 20;

const METALS = [
  "All Metals",
  "18kt Yellow Gold",
  "22kt Yellow Gold",
  "Platinum 950",
  "18kt White Gold",
  "14kt White Gold",
];

const GEMSTONES = [
  "All Gemstones",
  "Natural Diamond",
  "Solitaire Diamond",
  "Black Onyx",
  "Emerald",
  "Ruby",
];

function MenContentInner() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const mensProducts = useAppSelector((state) => state.products.mensItems);
  const productsStatus = useAppSelector((state) => state.products.status);
  const backendCategories = useAppSelector((state) => state.products.categories);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedMetal, setSelectedMetal] = useState("All Metals");
  const [selectedGemstone, setSelectedGemstone] = useState("All Gemstones");
  const [priceBracket, setPriceBracket] = useState("all");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Admin Customization Dynamic States
  const [collectionConfig, setCollectionConfig] = useState<CollectionPageConfig>(DEFAULT_MENS_PAGE_CONFIG);
  const [customCategories, setCustomCategories] = useState<any[]>([]);
  const [couponCopied, setCouponCopied] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    dispatch(fetchMensProducts({ limit: 100 }));
    dispatch(fetchCategories("men"));

    const loadConfig = () => {
      try {
        const saved = localStorage.getItem("zhaevaah_mens_page_config");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.hero) setCollectionConfig(parsed);
        }
        const savedCats = localStorage.getItem("zhaevaah_custom_categories");
        if (savedCats) {
          const parsedCats = JSON.parse(savedCats);
          if (Array.isArray(parsedCats) && parsedCats.length > 0) setCustomCategories(parsedCats);
        }
      } catch {}
    };

    loadConfig();

    window.addEventListener("zhaevaah-collection-updated", loadConfig);
    window.addEventListener("zhaevaah-categories-updated", loadConfig);
    return () => {
      window.removeEventListener("zhaevaah-collection-updated", loadConfig);
      window.removeEventListener("zhaevaah-categories-updated", loadConfig);
    };
  }, [dispatch]);

  const productsList = mensProducts;

  // Trigger skeleton loader briefly when filters, page, or sort change
  useEffect(() => {
    if (!isHydrated) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [
    selectedCategory,
    selectedMetal,
    selectedGemstone,
    priceBracket,
    minRating,
    sortBy,
    currentPage,
    isHydrated,
  ]);

  // Sync initial state from URL query parameters if present
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      const matchInDb = activeBackendCategories.find(
        (c) => c.slug?.toLowerCase() === cat.toLowerCase() || c.name.toLowerCase() === cat.toLowerCase()
      );
      if (matchInDb) {
        setSelectedCategory(matchInDb.name);
      } else if (availableCategories.includes(cat) || cat === "All Categories") {
        setSelectedCategory(cat);
      }
    }
    const metal = searchParams.get("metal");
    if (metal && (METALS.includes(metal) || metal === "All Metals")) {
      setSelectedMetal(metal);
    }
    const gem = searchParams.get("gemstone");
    if (gem && (GEMSTONES.includes(gem) || gem === "All Gemstones")) {
      setSelectedGemstone(gem);
    }
    const price = searchParams.get("price");
    if (price) {
      setPriceBracket(price);
    }
    const rating = searchParams.get("rating");
    if (rating) {
      const parsedRating = parseFloat(rating);
      if (!isNaN(parsedRating)) setMinRating(parsedRating);
    }
    const sort = searchParams.get("sort");
    if (sort) {
      setSortBy(sort);
    }
    const page = searchParams.get("page");
    if (page) {
      const parsedPage = parseInt(page, 10);
      if (!isNaN(parsedPage) && parsedPage >= 1) setCurrentPage(parsedPage);
    }
  }, [searchParams]);

  // All baseline men's items for counting
  const baseMenProducts = useMemo(() => {
    return productsList.filter(
      (p) =>
        p.gender === "men" ||
        p.category.toLowerCase().includes("men") ||
        p.title.toLowerCase().includes("men")
    );
  }, [productsList]);

  // Active Categories from backend DB
  const activeBackendCategories = useMemo(() => {
    return backendCategories.filter(
      (c) =>
        c.gender?.toLowerCase() === "men" ||
        c.gender?.toLowerCase() === "all" ||
        !c.gender
    );
  }, [backendCategories]);

  // Curated Categories Showcase Ribbon (Matching User Admin Screenshot)
  const showcaseCategories = useMemo(() => {
    if (activeBackendCategories.length > 0) {
      return activeBackendCategories.map((c) => ({
        id: c.id || c.slug || c.name,
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image: c.image || "/images/product_4_main.png",
        badge: c.badge || undefined,
        itemCount: c.itemCount || `${c.count || 0} Designs`,
      }));
    }
    return collectionConfig.curatedCategories || [];
  }, [activeBackendCategories, collectionConfig.curatedCategories]);

  // Dynamic categories merging backend DB with admin custom categories
  const availableCategories = useMemo(() => {
    if (activeBackendCategories.length > 0) {
      return ["All Categories", ...activeBackendCategories.map((c) => c.name)];
    }
    const list = [...MENS_CATEGORIES];
    customCategories
      .filter((c) => c.gender === "men" || c.gender === "all")
      .forEach((c) => {
        if (!list.includes(c.name)) {
          list.push(c.name);
        }
      });
    return list;
  }, [activeBackendCategories, customCategories]);

  // Filter logic (identical to Shop)
  const filteredProducts = useMemo(() => {
    return baseMenProducts
      .filter((product) => {
        // Category filter (support matching DB name and slug)
        if (selectedCategory !== "All Categories") {
          const selNorm = selectedCategory.toLowerCase().trim();
          const prodCatNorm = (product.category || "").toLowerCase().trim();
          const targetInDb = activeBackendCategories.find(
            (b) => b.name.toLowerCase() === selNorm || b.slug?.toLowerCase() === selNorm
          );
          const matches =
            prodCatNorm === selNorm ||
            (targetInDb && prodCatNorm === targetInDb.name.toLowerCase()) ||
            prodCatNorm.includes(selNorm) ||
            selNorm.includes(prodCatNorm);
          if (!matches) {
            return false;
          }
        }

        // Metal filter
        if (
          selectedMetal !== "All Metals" &&
          product.metal !== selectedMetal
        ) {
          return false;
        }

        // Gemstone filter
        if (
          selectedGemstone !== "All Gemstones" &&
          product.gemstone !== selectedGemstone
        ) {
          return false;
        }

        // Price filter
        if (priceBracket === "under-20k" && product.priceNum >= 20000) return false;
        if (
          priceBracket === "20k-40k" &&
          (product.priceNum < 20000 || product.priceNum > 40000)
        )
          return false;
        if (
          priceBracket === "40k-70k" &&
          (product.priceNum < 40000 || product.priceNum > 70000)
        )
          return false;
        if (priceBracket === "above-70k" && product.priceNum <= 70000) return false;

        // Rating filter
        if (minRating !== null && product.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.priceNum - b.priceNum;
        if (sortBy === "price-high") return b.priceNum - a.priceNum;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // featured/default
      });
  }, [
    baseMenProducts,
    selectedCategory,
    selectedMetal,
    selectedGemstone,
    priceBracket,
    minRating,
    sortBy,
  ]);

  // Pagination calculations: 20 per page
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedMetal("All Metals");
    setSelectedGemstone("All Gemstones");
    setPriceBracket("all");
    setMinRating(null);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== "All Categories" ||
    selectedMetal !== "All Metals" ||
    selectedGemstone !== "All Gemstones" ||
    priceBracket !== "all" ||
    minRating !== null;

  return (
    <div className="w-full bg-[#FAF9F7] py-10 font-poppins">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Bar */}
        <div className="mb-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[#767069]">
            <Link href="/" className="hover:text-[#B8933F] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1C1208]">
              Men&apos;s Collection
            </span>
            {selectedCategory !== "All Categories" && (
              <>
                <span>/</span>
                <span className="text-[#B8933F]">{selectedCategory}</span>
              </>
            )}
          </nav>
        </div>

        {/* 16:9 Image-Only Promotional Carousel */}
        {collectionConfig.promoBanner?.enabled !== false && (
          <CollectionBannerCarousel
            slides={
              collectionConfig.promoBanner?.slides && collectionConfig.promoBanner.slides.length > 0
                ? collectionConfig.promoBanner.slides
                : [
                    {
                      id: "m-slide-1",
                      image: collectionConfig.promoBanner?.bgImage || "/images/bracelet_hotsell_banner.jpg",
                      link: "/men?category=mens-bracelets-kadas",
                      alt: "Men's Luxury Bracelet & Kada",
                    },
                    {
                      id: "m-slide-2",
                      image: "/images/ring_beckons_banner.jpg",
                      link: "/men?category=mens-rings",
                      alt: "Imperial Vault Signet Rings",
                    },
                    {
                      id: "m-slide-3",
                      image: "/images/ad_banner_ring_full.jpg",
                      link: "/men?category=chains-pendants",
                      alt: "Handcrafted 18kt Vault Accents",
                    },
                  ]
            }
            fallbackImage="/images/bracelet_hotsell_banner.jpg"
          />
        )}

        {/* Header Title & Section Marker */}
        <div id="catalog-section" className="mb-4 sm:mb-6 pt-1 sm:pt-4">
          <div className="flex items-baseline justify-between border-b border-[#EAE3D5] pb-2 sm:pb-4">
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-3xl font-bold text-[#1C1208] tracking-tight">
                {collectionConfig.pageTitle || "Men's Luxury Fine Jewellery & Vault"}
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm text-[#767069] font-light mt-1">
                Filter and explore our complete certified hallmarked creations.
              </p>
            </div>
            
            <span className="hidden sm:inline-block text-xs text-[#767069]">
              {totalProducts} Total Items
            </span>
          </div>

          {/* Compact Mobile Filter & Sort Toolbar (Single Row, ultra space-saving) */}
          <div className="lg:hidden flex items-center justify-between gap-2 pt-2.5">
            {/* Compact Filter Pill Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F7] hover:bg-[#F2ECE2] active:scale-95 border border-[#DDD5C7] rounded-full text-xs font-medium text-[#1C1208] shadow-2xs transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8933F]" />
              )}
            </button>

            {/* Product Counter */}
            <span className="text-[11px] text-[#767069] font-medium truncate">
              {totalProducts} products
            </span>

            {/* Compact Sort Select */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-white border border-[#DDD5C7] rounded-full pl-2.5 pr-6 py-1.5 text-[#1C1208] focus:outline-none focus:border-[#B8933F] cursor-pointer appearance-none shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#767069] absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Sidebar Filters (Desktop) ── */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-xs border border-[#EAE3D5] shadow-xs space-y-7 sticky top-28">
            
            {/* Header + Reset */}
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B8933F]" />
                <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                  Filters
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#C38B75] hover:underline font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* 1. Category Filter */}
            <div>
              <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-3">
                Categories
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {availableCategories.map((cat) => {
                  const count =
                    cat === "All Categories"
                      ? baseMenProducts.length
                      : baseMenProducts.filter((p) => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-xs transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#FAF6EE] text-[#B8933F] font-semibold"
                          : "text-[#6E675F] hover:bg-[#FAF9F7] hover:text-[#1C1208]"
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className="text-[11px] text-[#A89F95]">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Filter */}
            <div className="border-t border-[#f0ece5] pt-5">
              <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-3">
                Price (INR)
              </h4>
              <div className="space-y-2 text-xs text-[#6E675F]">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-20k", label: "Under ₹20,000" },
                  { id: "20k-40k", label: "₹20,000 – ₹40,000" },
                  { id: "40k-70k", label: "₹40,000 – ₹70,000" },
                  { id: "above-70k", label: "Above ₹70,000" },
                ].map((bracket) => (
                  <label
                    key={bracket.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-[#1C1208]"
                  >
                    <input
                      type="radio"
                      name="price-men"
                      checked={priceBracket === bracket.id}
                      onChange={() => {
                        setPriceBracket(bracket.id);
                        setCurrentPage(1);
                      }}
                      className="accent-[#B8933F] w-3.5 h-3.5"
                    />
                    <span>{bracket.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Customer Ratings Filter */}
            <div className="border-t border-[#f0ece5] pt-5">
              <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-3">
                Ratings
              </h4>
              <div className="space-y-2 text-xs">
                {[5, 4.5, 4.0].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => {
                      setMinRating(minRating === starVal ? null : starVal);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-xs transition-colors cursor-pointer ${
                      minRating === starVal
                        ? "bg-[#FAF6EE] text-[#B8933F]"
                        : "hover:bg-[#FAF9F7] text-[#6E675F]"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[#E69C24]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.floor(starVal)
                              ? "fill-[#E69C24]"
                              : "stroke-[1.5]"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-[#1C1208] ml-1.5 font-medium">
                        {starVal === 5 ? "5.0 only" : `${starVal} & above`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Metal & Purity Filter */}
            <div className="border-t border-[#f0ece5] pt-5">
              <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-3">
                Metal / Gold Purity
              </h4>
              <div className="space-y-1.5">
                {METALS.map((metal) => (
                  <button
                    key={metal}
                    type="button"
                    onClick={() => {
                      setSelectedMetal(metal);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors cursor-pointer ${
                      selectedMetal === metal
                        ? "bg-[#FAF6EE] text-[#B8933F] font-semibold"
                        : "text-[#6E675F] hover:bg-[#FAF9F7]"
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Gemstone Filter */}
            <div className="border-t border-[#f0ece5] pt-5">
              <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-3">
                Gemstone
              </h4>
              <div className="space-y-1.5">
                {GEMSTONES.map((gem) => (
                  <button
                    key={gem}
                    type="button"
                    onClick={() => {
                      setSelectedGemstone(gem);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors cursor-pointer ${
                      selectedGemstone === gem
                        ? "bg-[#FAF6EE] text-[#B8933F] font-semibold"
                        : "text-[#6E675F] hover:bg-[#FAF9F7]"
                    }`}
                  >
                    {gem}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* ── Right Content: Product Grid & Pagination ── */}
          <main className="lg:col-span-9 flex flex-col">
            
            {/* Top Controls Bar (Desktop) */}
            <div className="hidden lg:flex bg-white p-4 rounded-xs border border-[#EAE3D5] items-center justify-between gap-4 mb-6 shadow-xs">
              
              {/* Product counter */}
              <div className="text-xs text-[#767069]">
                Showing{" "}
                <span className="font-semibold text-[#1C1208]">
                  {totalProducts === 0 ? 0 : startIndex + 1}–{endIndex}
                </span>{" "}
                of <span className="font-semibold text-[#1C1208]">{totalProducts}</span> products{" "}
                <span className="text-[#B8933F] font-medium">(20 per page)</span>
              </div>

              {/* Controls on right: Sort & View Toggle */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Sort Dropdown */}
                <div className="relative flex items-center">
                  <span className="text-xs text-[#767069] mr-2 hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs px-3 py-2 text-[#1C1208] focus:outline-none focus:border-[#B8933F] cursor-pointer"
                  >
                    <option value="featured">Featured Collection</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Grid Cols Toggle */}
                <div className="hidden sm:flex items-center border border-[#DDD5C7] rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    title="3 Columns"
                    className={`p-2 transition-colors cursor-pointer ${
                      gridCols === 3 ? "bg-[#1C1208] text-white" : "bg-white text-[#767069]"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    title="4 Columns"
                    className={`p-2 transition-colors cursor-pointer ${
                      gridCols === 4 ? "bg-[#1C1208] text-white" : "bg-white text-[#767069]"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Active Filters Badges Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 border border-[#EAE3D5] rounded-xs">
                <span className="text-xs text-[#767069] font-medium mr-1">Active:</span>

                {selectedCategory !== "All Categories" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory("All Categories")} className="cursor-pointer">
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {priceBracket !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    Price: {priceBracket}
                    <button type="button" onClick={() => setPriceBracket("all")} className="cursor-pointer">
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {minRating !== null && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    Rating: {minRating}★+
                    <button type="button" onClick={() => setMinRating(null)} className="cursor-pointer">
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {selectedMetal !== "All Metals" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    {selectedMetal}
                    <button type="button" onClick={() => setSelectedMetal("All Metals")} className="cursor-pointer">
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {selectedGemstone !== "All Gemstones" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    {selectedGemstone}
                    <button type="button" onClick={() => setSelectedGemstone("All Gemstones")} className="cursor-pointer">
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#C38B75] underline ml-auto hover:text-[#1C1208] cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* ── Products Grid (With Skeleton Loading Effect) ── */}
            {isLoading ? (
              <ProductGridSkeleton count={gridCols === 3 ? 6 : 8} cols={gridCols} />
            ) : currentProducts.length === 0 ? (
              <div className="bg-white rounded-xs border border-[#EAE3D5] p-16 text-center">
                <SlidersHorizontal className="w-12 h-12 text-[#d1cbc3] mx-auto mb-3 stroke-[1.2]" />
                <h3 className="font-montserrat text-lg font-semibold text-[#1C1208] mb-1">
                  No matching jewellery found
                </h3>
                <p className="text-xs text-[#767069] mb-5">
                  Try adjusting or clearing your filters to explore more luxury designs.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-3 sm:gap-6 ${
                  gridCols === 3
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* ── Pagination: Exactly 20 products per page ── */}
            {totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#767069]">
                  Page <strong className="text-[#1C1208]">{activePage}</strong> of{" "}
                  <strong className="text-[#1C1208]">{totalPages}</strong> ({totalProducts} items, 20 per page)
                </span>

                <div className="flex items-center space-x-1.5">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(activePage - 1)}
                    disabled={activePage <= 1}
                    aria-label="Previous Page"
                    className="px-3 py-2 border border-[#DDD5C7] rounded-xs bg-white text-xs uppercase font-medium text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F] disabled:opacity-40 disabled:hover:border-[#DDD5C7] disabled:hover:text-[#1C1208] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center text-xs rounded-xs border transition-colors cursor-pointer ${
                          activePage === pageNum
                            ? "bg-[#B8933F] border-[#B8933F] text-white font-semibold shadow-xs"
                            : "bg-white border-[#DDD5C7] text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(activePage + 1)}
                    disabled={activePage >= totalPages}
                    aria-label="Next Page"
                    className="px-3 py-2 border border-[#DDD5C7] rounded-xs bg-white text-xs uppercase font-medium text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F] disabled:opacity-40 disabled:hover:border-[#DDD5C7] disabled:hover:text-[#1C1208] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* ── Mobile Filter Slide-Over Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
                <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                  Filter Men's Vault
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#767069] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-2.5">
                  Categories
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-1.5 px-2 rounded-xs flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#FAF6EE] text-[#B8933F] font-semibold"
                          : "text-[#6E675F]"
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-[#f0ece5] pt-4">
                <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-2.5">
                  Price (INR)
                </h4>
                <div className="space-y-2 text-xs text-[#6E675F]">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-20k", label: "Under ₹20,000" },
                    { id: "20k-40k", label: "₹20,000 – ₹40,000" },
                    { id: "40k-70k", label: "₹40,000 – ₹70,000" },
                    { id: "above-70k", label: "Above ₹70,000" },
                  ].map((bracket) => (
                    <label key={bracket.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-price-men"
                        checked={priceBracket === bracket.id}
                        onChange={() => {
                          setPriceBracket(bracket.id);
                          setCurrentPage(1);
                        }}
                        className="accent-[#B8933F]"
                      />
                      <span>{bracket.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="border-t border-[#f0ece5] pt-4">
                <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-2.5">
                  Ratings
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[5, 4.5, 4.0].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => {
                        setMinRating(minRating === starVal ? null : starVal);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-xs cursor-pointer ${
                        minRating === starVal ? "bg-[#FAF6EE] text-[#B8933F]" : "text-[#6E675F]"
                      }`}
                    >
                      <span>{starVal}★ & above</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metal */}
              <div className="border-t border-[#f0ece5] pt-4">
                <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-2.5">
                  Metal
                </h4>
                <div className="space-y-1 max-h-36 overflow-y-auto text-xs">
                  {METALS.map((metal) => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => {
                        setSelectedMetal(metal);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-1.5 px-2 rounded-xs cursor-pointer ${
                        selectedMetal === metal
                          ? "bg-[#FAF6EE] text-[#B8933F] font-semibold"
                          : "text-[#6E675F]"
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemstone */}
              <div className="border-t border-[#f0ece5] pt-4">
                <h4 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-2.5">
                  Gemstone
                </h4>
                <div className="space-y-1 max-h-36 overflow-y-auto text-xs">
                  {GEMSTONES.map((gem) => (
                    <button
                      key={gem}
                      type="button"
                      onClick={() => {
                        setSelectedGemstone(gem);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-1.5 px-2 rounded-xs cursor-pointer ${
                        selectedGemstone === gem
                          ? "bg-[#FAF6EE] text-[#B8933F] font-semibold"
                          : "text-[#6E675F]"
                      }`}
                    >
                      {gem}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-[#EAE3D5] flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#B8933F] text-white text-xs uppercase font-medium rounded-xs cursor-pointer"
              >
                Apply ({totalProducts})
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 border border-[#DDD5C7] text-[#1C1208] text-xs uppercase font-medium rounded-xs cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function MenPageContent() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1360px] mx-auto px-4 py-16">
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <MenContentInner />
    </Suspense>
  );
}

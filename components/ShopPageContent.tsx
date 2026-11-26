"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  X,
  ChevronDown,
  Star,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./skeletons/ProductGridSkeleton";
import { CatalogProduct } from "../data/products";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";

const ITEMS_PER_PAGE = 20;

const CATEGORIES = [
  "All Categories",
  "Diamond Rings",
  "Solitaire Rings",
  "Necklaces & Pendants",
  "Diamond Bracelets",
  "Bangles",
  "Earrings",
  "Wedding & Bridal Sets",
  "Men's Rings",
  "Men's Bracelets & Kadas",
  "Chains & Pendants",
];

const METALS = [
  "All Metals",
  "18kt Yellow Gold",
  "18kt Rose Gold",
  "14kt White Gold",
  "22kt Yellow Gold",
  "Platinum 950",
];

const GEMSTONES = [
  "All Gemstones",
  "Natural Diamond",
  "Swiss Blue Topaz",
  "Royal Sapphire",
  "Emerald",
  "Ruby",
];

function ShopContentInner() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.items);

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

  useEffect(() => {
    setIsHydrated(true);
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  // Trigger skeleton loader briefly when filters, page, or sort change
  useEffect(() => {
    if (!isHydrated) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedMetal, selectedGemstone, priceBracket, minRating, sortBy, currentPage, isHydrated]);

  // Sync initial state from URL query parameters if present
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && (CATEGORIES.includes(cat) || cat === "All Categories")) {
      setSelectedCategory(cat);
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

  // Filter logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== "All Categories") {
        if (selectedCategory === "Bangles") {
          const isBangle =
            product.category === "Diamond Bracelets" ||
            product.title.toLowerCase().includes("bangle");
          if (!isBangle) return false;
        } else if (product.category !== selectedCategory) {
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
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.priceNum - b.priceNum;
      if (sortBy === "price-high") return b.priceNum - a.priceNum;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured/default
    });
  }, [
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

  // Reset to page 1 if filter makes current page out of bounds
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
        
        {/* Header Title */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EAE3D5] pb-5">
            <div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1C1208] tracking-tight">
                Fine Jewellery Collection
              </h1>
              <p className="text-xs sm:text-sm text-[#767069] font-light mt-1">
                Explore our certified natural diamonds and 18kt hallmarked gold creations.
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DDD5C7] rounded-xs text-xs uppercase font-medium tracking-wider text-[#1C1208]"
            >
              <Filter className="w-4 h-4 text-[#B8933F]" />
              <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
            </button>
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
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#C38B75] hover:underline font-medium"
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
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === "All Categories"
                      ? allProducts.length
                      : allProducts.filter((p) => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-xs transition-colors ${
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
                      name="price"
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
                    className={`w-full flex items-center justify-between p-1.5 rounded-xs transition-colors ${
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
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors ${
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
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-xs transition-colors ${
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
            
            {/* Top Controls Bar */}
            <div className="bg-white p-4 rounded-xs border border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-xs">
              
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
                    className="text-xs bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs px-3 py-2 text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
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
                    className={`p-2 transition-colors ${
                      gridCols === 3 ? "bg-[#1C1208] text-white" : "bg-white text-[#767069]"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    title="4 Columns"
                    className={`p-2 transition-colors ${
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
                    <button type="button" onClick={() => setSelectedCategory("All Categories")}>
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {priceBracket !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    Price: {priceBracket}
                    <button type="button" onClick={() => setPriceBracket("all")}>
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {minRating !== null && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    Rating: {minRating}★+
                    <button type="button" onClick={() => setMinRating(null)}>
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {selectedMetal !== "All Metals" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    {selectedMetal}
                    <button type="button" onClick={() => setSelectedMetal("All Metals")}>
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                {selectedGemstone !== "All Gemstones" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] text-[#B8933F] text-xs rounded-xs border border-[#B8933F]/30">
                    {selectedGemstone}
                    <button type="button" onClick={() => setSelectedGemstone("All Gemstones")}>
                      <X className="w-3 h-3 hover:text-black" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#C38B75] underline ml-auto hover:text-[#1C1208]"
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
                  className="px-6 py-2.5 bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider"
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
                    className="px-3 py-2 border border-[#DDD5C7] rounded-xs bg-white text-xs uppercase font-medium text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F] disabled:opacity-40 disabled:hover:border-[#DDD5C7] disabled:hover:text-[#1C1208] transition-colors flex items-center gap-1"
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
                        className={`w-9 h-9 flex items-center justify-center text-xs rounded-xs border transition-colors ${
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
                    className="px-3 py-2 border border-[#DDD5C7] rounded-xs bg-white text-xs uppercase font-medium text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F] disabled:opacity-40 disabled:hover:border-[#DDD5C7] disabled:hover:text-[#1C1208] transition-colors flex items-center gap-1"
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
                  Filter Catalog
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#767069]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#1C1208] mb-2">Category</h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                        setMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                        selectedCategory === cat ? "bg-[#FAF6EE] text-[#B8933F] font-semibold" : "text-[#6E675F]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#1C1208] mb-2">Price Bracket</h4>
                <div className="space-y-1.5 text-xs text-[#6E675F]">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-20k", label: "Under ₹20,000" },
                    { id: "20k-40k", label: "₹20,000 – ₹40,000" },
                    { id: "40k-70k", label: "₹40,000 – ₹70,000" },
                    { id: "above-70k", label: "Above ₹70,000" },
                  ].map((bracket) => (
                    <label key={bracket.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mob-price"
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
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#1C1208] mb-2">Customer Rating</h4>
                <div className="space-y-1.5 text-xs text-[#6E675F]">
                  {[5, 4.5, 4.0].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => {
                        setMinRating(minRating === starVal ? null : starVal);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-1 px-2 rounded flex items-center justify-between ${
                        minRating === starVal ? "bg-[#FAF6EE] text-[#B8933F] font-semibold" : ""
                      }`}
                    >
                      <span>{starVal === 5 ? "5.0 Stars only" : `${starVal} Stars & above`}</span>
                      <span className="text-[#E69C24]">★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metal */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#1C1208] mb-2">Metal / Purity</h4>
                <div className="space-y-1">
                  {METALS.map((metal) => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => {
                        setSelectedMetal(metal);
                        setCurrentPage(1);
                      }}
                      className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                        selectedMetal === metal ? "bg-[#FAF6EE] text-[#B8933F] font-semibold" : "text-[#6E675F]"
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemstone */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#1C1208] mb-2">Gemstone</h4>
                <div className="space-y-1">
                  {GEMSTONES.map((gem) => (
                    <button
                      key={gem}
                      type="button"
                      onClick={() => {
                        setSelectedGemstone(gem);
                        setCurrentPage(1);
                      }}
                      className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                        selectedGemstone === gem ? "bg-[#FAF6EE] text-[#B8933F] font-semibold" : "text-[#6E675F]"
                      }`}
                    >
                      {gem}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3D5] space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2 text-xs text-[#C38B75] uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ShopPageContent() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1360px] mx-auto px-4 py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#B8933F] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest text-[#767069]">
            Loading ZHAEVAAH Luxury Collection...
          </p>
        </div>
      }
    >
      <ShopContentInner />
    </Suspense>
  );
}

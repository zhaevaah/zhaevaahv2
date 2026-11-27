"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productsSlice";
import { CatalogProduct } from "../data/products";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useStore();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.items);
  const [query, setQuery] = useState("");

  // Ensure real products are loaded from database when modal is active
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      dispatch(fetchProducts({ limit: 50 }));
    }
  }, [isSearchOpen, allProducts.length, dispatch]);

  if (!isSearchOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  // Search dynamically across real products from database only
  const filtered: CatalogProduct[] = normalizedQuery
    ? allProducts.filter((p) => {
        return (
          p.title?.toLowerCase().includes(normalizedQuery) ||
          p.category?.toLowerCase().includes(normalizedQuery) ||
          p.description?.toLowerCase().includes(normalizedQuery) ||
          p.metal?.toLowerCase().includes(normalizedQuery) ||
          p.gemstone?.toLowerCase().includes(normalizedQuery)
        );
      })
    : [];

  // Trending suggestions derived strictly from real store products
  const suggestions = allProducts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative min-h-screen flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
        <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl p-6 sm:p-8 z-10">
          
          {/* Close */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-4 right-4 p-2 text-[#767069] hover:text-[#1C1208] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Search Input */}
          <div className="relative border-b-2 border-[#1C1208] pb-2 mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 text-[#B8933F] mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rings, bracelets, solitaire, gold..."
                autoFocus
                className="w-full text-base sm:text-lg text-[#1C1208] placeholder:text-[#9E9790] focus:outline-none bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs text-[#767069] hover:text-[#1c1208] ml-2 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#767069]">Popular:</span>
            {["Diamond Rings", "Solitaire", "18kt Gold", "Bracelets", "Necklaces"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 text-xs bg-[#F7F5F0] hover:bg-[#B8933F] hover:text-white rounded-xs text-[#555] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Results Section */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#767069] font-medium mb-3">
              {query
                ? `Results for "${query}" (${filtered.length})`
                : suggestions.length > 0
                ? "Trending Vault Creations"
                : ""}
            </h4>

            <div className="divide-y divide-[#f0ece5] max-h-[340px] overflow-y-auto">
              {query.trim() && filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#767069]">
                  No matching jewelry pieces found for &ldquo;{query}&rdquo;. Try searching for &ldquo;Diamond&rdquo;, &ldquo;Gold&rdquo;, or &ldquo;Ring&rdquo;.
                </div>
              ) : !query.trim() && suggestions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#9E9790] font-light">
                  Type to search our fine jewellery collections...
                </div>
              ) : (
                (query.trim() ? filtered : suggestions).map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] px-2 rounded-xs transition-colors"
                  >
                    <Link
                      href={`/product/${(item as any).slug || item.id}`}
                      className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0 mr-3"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="relative w-12 h-12 bg-[#F6F6F6] rounded-xs flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.primaryImage || "/images/ZhaevaahHero.jpg"}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-contain p-1 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-[#1C1208] group-hover:text-[#B8933F] transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-xs font-semibold text-[#B8933F]">
                          {item.price}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item);
                        setIsSearchOpen(false);
                      }}
                      className="text-xs uppercase tracking-wider text-[#B8933F] hover:underline font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Add to Bag</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { LATEST_PRODUCTS } from "../data/products";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart, setQuickViewProduct } = useStore();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? LATEST_PRODUCTS.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : LATEST_PRODUCTS;

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
            className="absolute top-4 right-4 p-2 text-[#767069] hover:text-[#1C1208] transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Search Input */}
          <div className="relative border-b-2 border-[#1C1208] pb-2 mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 text-[#B8933F] mr-3" />
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
                  className="text-xs text-[#767069] hover:text-[#1c1208] ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#767069]">Popular:</span>
            {["Diamond Rings", "Solitaire", "18kt Gold", "Infinity Bracelet", "Pendant"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 text-xs bg-[#F7F5F0] hover:bg-[#B8933F] hover:text-white rounded-xs text-[#555] transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Results */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#767069] font-medium mb-3">
              {query ? `Results for "${query}" (${filtered.length})` : "Featured Suggestions"}
            </h4>

            <div className="divide-y divide-[#f0ece5] max-h-[340px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#767069]">
                  No matching jewelry pieces found. Try searching for "Diamond", "Gold", or "Ring".
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] px-2 rounded-xs transition-colors"
                  >
                    <Link
                      href={`/product/${item.id}`}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="relative w-12 h-12 bg-[#F6F6F6] rounded-xs flex-shrink-0">
                        <Image
                          src={item.primaryImage}
                          alt={item.title}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-[#1C1208] group-hover:text-[#B8933F] transition-colors line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs font-semibold text-[#C38B75]">
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
                      className="text-xs uppercase tracking-wider text-[#B8933F] hover:underline font-medium flex items-center gap-1"
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


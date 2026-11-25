"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  ShoppingBag,
  X,
  Sparkles,
  LogOut,
  Package,
  MapPin,
  Shield,
  LogIn,
  Home,
  Flame,
} from "lucide-react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "./icons/GenderIcons";
import { useStore } from "../context/StoreContext";
import MobileBottomNav from "./MobileBottomNav";

export default function Header() {
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    user,
    isLoggedIn,
    logout,
  } = useStore();

  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";
  const isHomeActive = isHomePage;
  const isWomenActive = pathname.startsWith("/women");
  const isMenActive = pathname.startsWith("/men");
  const isShopActive =
    (pathname.startsWith("/shop") &&
      !pathname.includes("Top%20Deals") &&
      !pathname.includes("deals")) ||
    pathname.startsWith("/product");
  const isDealsActive =
    pathname.includes("Top%20Deals") || pathname.includes("deals");

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "sticky top-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-[#eae6de]/60"
            : isHomePage
            ? "sticky top-0 bg-transparent border-transparent"
            : "sticky top-0 bg-white/90 backdrop-blur-sm border-b border-[#f0ece5]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 md:h-[72px] flex items-center justify-between">
            {/* Left: Brand Logo (Shifted to Left on Mobile & Desktop) */}
            <div className="flex items-center -ml-1 sm:ml-0">
              <Link href="/" className="flex items-center group py-1" aria-label="ZHAEVAAH Home">
                <Image
                  src="/brand/ZHAEVAAH_LOGO.webp"
                  alt="ZHAEVAAH"
                  width={280}
                  height={67}
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                  priority
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation Bar with Hover Icon Reveals */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {/* HOME */}
              <Link
                href="/"
                className={`group flex items-center text-[13px] tracking-[0.14em] uppercase transition-colors relative py-2 ${
                  isHomeActive
                    ? "font-semibold text-[#1c1208] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#B8933F]"
                    : "font-medium text-[#1c1208] hover:text-[#B8933F]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`transition-all duration-300 ease-out flex items-center justify-center overflow-hidden shrink-0 text-[#B8933F] ${
                      isHomeActive
                        ? "w-4 max-w-[18px] opacity-100 translate-x-0"
                        : "w-0 max-w-0 opacity-0 -translate-x-1.5 group-hover:w-4 group-hover:max-w-[18px] group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                  </span>
                  <span>HOME</span>
                </span>
              </Link>

              {/* WOMEN (with Female Logo Symbol ♀ on hover/active) */}
              <Link
                href="/women"
                className={`group flex items-center text-[13px] tracking-[0.14em] uppercase transition-colors relative py-2 ${
                  isWomenActive
                    ? "font-semibold text-[#1c1208] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#B8933F]"
                    : "font-medium text-[#1c1208] hover:text-[#B8933F]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`transition-all duration-300 ease-out flex items-center justify-center overflow-hidden shrink-0 text-[#B8933F] ${
                      isWomenActive
                        ? "w-4 max-w-[18px] opacity-100 translate-x-0"
                        : "w-0 max-w-0 opacity-0 -translate-x-1.5 group-hover:w-4 group-hover:max-w-[18px] group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    <FemaleSymbolIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>WOMEN</span>
                </span>
              </Link>

              {/* MEN (with Male Logo Symbol ♂ on hover/active) */}
              <Link
                href="/men"
                className={`group flex items-center text-[13px] tracking-[0.14em] uppercase transition-colors relative py-2 ${
                  isMenActive
                    ? "font-semibold text-[#1c1208] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#B8933F]"
                    : "font-medium text-[#1c1208] hover:text-[#B8933F]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`transition-all duration-300 ease-out flex items-center justify-center overflow-hidden shrink-0 text-[#B8933F] ${
                      isMenActive
                        ? "w-4 max-w-[18px] opacity-100 translate-x-0"
                        : "w-0 max-w-0 opacity-0 -translate-x-1.5 group-hover:w-4 group-hover:max-w-[18px] group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    <MaleSymbolIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>MEN</span>
                </span>
              </Link>

              {/* TOP DEALS [SALE] (with Deals Flame icon on hover/active) */}
              <Link
                href="/top-deals"
                className={`group flex items-center gap-1.5 text-[13px] tracking-[0.14em] uppercase transition-colors relative py-2 ${
                  isDealsActive
                    ? "font-semibold text-[#1c1208] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#B8933F]"
                    : "font-medium text-[#1c1208] hover:text-[#B8933F]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`transition-all duration-300 ease-out flex items-center justify-center overflow-hidden shrink-0 text-[#2a9d8f] ${
                      isDealsActive
                        ? "w-4 max-w-[18px] opacity-100 translate-x-0"
                        : "w-0 max-w-0 opacity-0 -translate-x-1.5 group-hover:w-4 group-hover:max-w-[18px] group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 fill-[#2a9d8f]" />
                  </span>
                  <span>TOP DEALS</span>
                  <span className="bg-[#2a9d8f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider uppercase ml-0.5">
                    SALE
                  </span>
                </span>
              </Link>
            </nav>

            {/* Right: Icons (Search, User Account / Profile Image, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-5 text-[#1c1208]">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 hover:text-[#B8933F] transition-colors"
                aria-label="Search jewelry"
              >
                <Search className="w-5 h-5 stroke-[1.7]" />
              </button>

              {/* User Account / Profile Image (Desktop Only - Mobile uses Bottom Nav) */}
              <div className="relative group hidden lg:block">
                {isLoggedIn && user ? (
                  /* Logged-In User Profile Avatar */
                  <Link
                    href="/profile"
                    className="p-0.5 rounded-full block transition-transform group-hover:scale-105"
                    aria-label={`Account of ${user.name}`}
                  >
                    {user.avatar || user.picture || user.image ? (
                      <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-[#B8933F] shadow-xs">
                        <Image
                          src={user.avatar || user.picture || user.image!}
                          alt={user.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#9E7B2F] via-[#B8933F] to-[#E6C673] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center ring-2 ring-white/90 shadow-xs tracking-wider">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </Link>
                ) : (
                  /* Logged-Out Standard User Icon */
                  <Link
                    href="/auth"
                    className="p-1.5 hover:text-[#B8933F] transition-colors block"
                    aria-label="Sign in to your account"
                  >
                    <User className="w-5 h-5 stroke-[1.7]" />
                  </Link>
                )}

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md border border-[#eae6de] shadow-xl py-3 rounded-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {isLoggedIn && user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-[#eae6de] mb-1">
                        <div className="flex items-center gap-2.5">
                          {user.avatar || user.picture || user.image ? (
                            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-[#B8933F]/50 flex-shrink-0">
                              <Image
                                src={user.avatar || user.picture || user.image!}
                                alt={user.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9E7B2F] to-[#B8933F] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="truncate">
                            <p className="text-xs font-semibold text-[#1c1208] truncate">{user.name}</p>
                            <p className="text-[10px] text-[#767069] truncate">{user.email}</p>
                            <span className="inline-block mt-0.5 text-[9px] uppercase font-bold tracking-wider text-[#B8933F] bg-[#B8933F]/10 px-1.5 py-0.2 rounded-xs">
                              {user.vipTier || "Gold VIP Member"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#2c2621] hover:text-[#B8933F] hover:bg-[#FAF8F5]"
                      >
                        <User className="w-3.5 h-3.5 text-[#B8933F]" />
                        <span>Dashboard Overview</span>
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#2c2621] hover:text-[#B8933F] hover:bg-[#FAF8F5]"
                      >
                        <Package className="w-3.5 h-3.5 text-[#B8933F]" />
                        <span>My Orders & Tracking</span>
                      </Link>
                      <Link
                        href="/profile?tab=addresses"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#2c2621] hover:text-[#B8933F] hover:bg-[#FAF8F5]"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#B8933F]" />
                        <span>Saved Addresses</span>
                      </Link>
                      <Link
                        href="/profile?tab=edit-profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#2c2621] hover:text-[#B8933F] hover:bg-[#FAF8F5]"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#B8933F]" />
                        <span>Edit Personal Info</span>
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-[#C38B75] hover:text-red-700 hover:bg-[#FFF5F2] border-t border-[#f2ede6] mt-1 pt-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-[#eae6de] mb-1">
                        <p className="text-[11px] font-semibold text-[#1c1208]">Welcome to ZHAEVAAH</p>
                        <p className="text-[10px] text-[#767069]">
                          Sign in for insured tracking, saved items & luxury benefits
                        </p>
                      </div>
                      <Link
                        href="/auth"
                        className="flex items-center justify-center gap-1.5 mx-4 my-2 py-2 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors shadow-xs"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In / Register</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Cart Icon with Counter Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-1.5 hover:text-[#B8933F] transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.7]" />
                <span className="absolute -top-1 -right-1 bg-[#B8933F] text-white text-[10px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="p-5 flex items-center justify-between border-b border-[#eae6de]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                  aria-label="ZHAEVAAH Home"
                >
                  <Image
                    src="/brand/ZHAEVAAH_LOGO.webp"
                    alt="ZHAEVAAH"
                    width={200}
                    height={48}
                    className="h-8 sm:h-9 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#767069] hover:text-[#1c1208]"
                >
                  <X className="w-6 h-6 stroke-[1.5]" />
                </button>
              </div>

              {/* User Bar in Mobile Menu */}
              <div className="p-4 bg-[#FAF9F7] border-b border-[#eae6de]">
                {isLoggedIn && user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      {user.avatar || user.picture || user.image ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#B8933F] flex-shrink-0">
                          <Image
                            src={user.avatar || user.picture || user.image!}
                            alt={user.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#B8933F] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[#1c1208] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#767069] truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="p-1.5 text-xs text-[#C38B75] hover:text-red-700"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#1c1208]">
                      <User className="w-4 h-4 text-[#B8933F]" />
                      <span>Guest User</span>
                    </div>
                    <Link
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-semibold text-[#B8933F] hover:underline"
                    >
                      Sign In →
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 text-sm font-semibold tracking-wider uppercase transition-colors ${
                    isHomeActive ? "text-[#B8933F]" : "text-[#1c1208] hover:text-[#B8933F]"
                  }`}
                >
                  <Home className="w-4 h-4 text-[#B8933F]" />
                  <span>HOME</span>
                </Link>
                <Link
                  href="/women"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-sm font-semibold tracking-wider uppercase transition-colors ${
                    isWomenActive ? "text-[#B8933F]" : "text-[#1c1208] hover:text-[#B8933F]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FemaleSymbolIcon className="w-4 h-4 text-[#B8933F]" />
                    <span>WOMEN&apos;S COLLECTION</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
                    ♀
                  </span>
                </Link>
                <Link
                  href="/men"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-sm font-semibold tracking-wider uppercase transition-colors ${
                    isMenActive ? "text-[#B8933F]" : "text-[#1c1208] hover:text-[#B8933F]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MaleSymbolIcon className="w-4 h-4 text-[#B8933F]" />
                    <span>MEN&apos;S COLLECTION</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                    ♂
                  </span>
                </Link>
                <Link
                  href="/top-deals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-semibold tracking-wider uppercase text-[#1c1208] hover:text-[#B8933F]"
                >
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-[#2a9d8f] fill-[#2a9d8f]" />
                    <span>TOP DEALS</span>
                  </div>
                  <span className="bg-[#2a9d8f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    SALE
                  </span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-wider uppercase text-[#B8933F] hover:text-[#1c1208]"
                >
                  MY ACCOUNT & ORDERS
                </Link>
              </div>
            </div>

            <div className="p-5 border-t border-[#eae6de] bg-[#FAF8F5] text-xs text-[#767069] space-y-2">
              <div className="flex items-center gap-2 text-[#1c1208] font-medium">
                <Sparkles className="w-4 h-4 text-[#B8933F]" />
                <span>Certified Natural Diamonds</span>
              </div>
              <p>Free shipping across India on orders over ₹4,999</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Rounded Bottom Navigation Bar on Mobile / Small Screens */}
      <MobileBottomNav />
    </>
  );
}

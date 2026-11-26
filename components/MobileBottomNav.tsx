"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Shield, Tag, User, LogIn } from "lucide-react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "./icons/GenderIcons";
import { useStore } from "../context/StoreContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useStore();

  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show near the very top of the page
      if (currentScrollY < 60) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling DOWN by > 8px: hide smoothly
      if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      }
      // Scrolling UP by > 8px: reveal smoothly
      else if (currentScrollY < lastScrollY.current - 8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomeActive = pathname === "/" || pathname === "";
  const isWomenActive = pathname.startsWith("/women");
  const isMenActive = pathname.startsWith("/men");
  const isDealsActive = pathname.includes("deals") || pathname.includes("Top%20Deals");
  const isProfileActive = pathname === "/profile" || pathname === "/auth";

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={`fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[440px] bg-white/95 backdrop-blur-md border border-[#EAE3D5] shadow-[0_12px_32px_-4px_rgba(28,18,8,0.18)] rounded-full px-2 py-1.5 flex items-center justify-between lg:hidden transition-all duration-300 ease-in-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      {/* 1. HOME */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-colors ${
          isHomeActive
            ? "text-[#B8933F] font-semibold"
            : "text-[#6E675F] hover:text-[#B8933F]"
        }`}
      >
        <Home className={`w-4.5 h-4.5 ${isHomeActive ? "stroke-[2.2]" : "stroke-[1.7]"}`} />
        <span className="text-[9px] tracking-wider uppercase mt-0.5 font-medium">Home</span>
      </Link>

      {/* 2. WOMEN */}
      <Link
        href="/women"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-colors ${
          isWomenActive
            ? "text-[#B8933F] font-semibold"
            : "text-[#6E675F] hover:text-[#B8933F]"
        }`}
      >
        <FemaleSymbolIcon
          className={`w-4.5 h-4.5 ${isWomenActive ? "text-[#B8933F]" : "text-[#6E675F]"}`}
          strokeWidth={isWomenActive ? 2.5 : 2}
        />
        <span className="text-[9px] tracking-wider uppercase mt-0.5 font-medium flex items-center gap-0.5">
          <span>Women</span>
          <span className="text-[8px] font-bold">♀</span>
        </span>
      </Link>

      {/* 3. MEN */}
      <Link
        href="/men"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-colors ${
          isMenActive
            ? "text-[#B8933F] font-semibold"
            : "text-[#6E675F] hover:text-[#B8933F]"
        }`}
      >
        <MaleSymbolIcon
          className={`w-4.5 h-4.5 ${isMenActive ? "text-[#B8933F]" : "text-[#6E675F]"}`}
          strokeWidth={isMenActive ? 2.5 : 2}
        />
        <span className="text-[9px] tracking-wider uppercase mt-0.5 font-medium flex items-center gap-0.5">
          <span>Men</span>
          <span className="text-[8px] font-bold">♂</span>
        </span>
      </Link>

      {/* 4. TOP DEALS with SALE badge */}
      <Link
        href="/top-deals"
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-colors ${
          isDealsActive
            ? "text-[#B8933F] font-semibold"
            : "text-[#6E675F] hover:text-[#B8933F]"
        }`}
      >
        <div className="relative">
          <Tag className={`w-4.5 h-4.5 ${isDealsActive ? "stroke-[2.2]" : "stroke-[1.7]"}`} />
          <span className="absolute -top-1.5 -right-3.5 bg-[#2A9D8F] text-white text-[7px] font-bold px-1 py-0.2 rounded-xs uppercase tracking-wider shadow-xs">
            SALE
          </span>
        </div>
        <span className="text-[9px] tracking-wider uppercase mt-0.5 font-medium">Top Deals</span>
      </Link>

      {/* 5. USER PROFILE (if logged in) else LOGIN */}
      {mounted && isLoggedIn && user ? (
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-colors ${
            pathname === "/profile"
              ? "text-[#B8933F] font-semibold"
              : "text-[#6E675F] hover:text-[#B8933F]"
          }`}
        >
          {user.avatar || user.picture || user.image ? (
            <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1.5 ring-[#B8933F] shadow-2xs">
              <Image
                src={user.avatar || user.picture || user.image!}
                alt={user.name || "User"}
                fill
                sizes="20px"
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9E7B2F] to-[#B8933F] text-white font-bold text-[9px] flex items-center justify-center ring-1 ring-white/80">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
            </div>
          )}
          <span className="text-[10px] tracking-wider uppercase mt-0.5 truncate max-w-[50px]">
            Profile
          </span>
        </Link>
      ) : (
        <Link
          href="/auth"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-colors ${
            pathname === "/auth"
              ? "text-[#B8933F] font-semibold"
              : "text-[#6E675F] hover:text-[#B8933F]"
          }`}
        >
          <LogIn className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-wider uppercase mt-0.5">Login</span>
        </Link>
      )}
    </nav>
  );
}


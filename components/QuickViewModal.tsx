"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, Heart, ShoppingBag, ShieldCheck, Sparkles, Check } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { getProductDiscountPercentage, getProductStock } from "../data/products";

export default function QuickViewModal() {
  // Modal disabled: User explicitly requested to directly open the full product details page instead of showing any modal
  return null;
}


"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Truck,
  Heart,
  Repeat,
  Gift,
  CheckCircle2,
  Tag,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function CartPageContent() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"free" | "pickup" | "flat">("free");
  const [shippingDestination, setShippingDestination] = useState("Maharashtra, India");
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [tempCity, setTempCity] = useState("Mumbai");
  const [tempState, setTempState] = useState("Maharashtra");
  const [tempPincode, setTempPincode] = useState("400053");

  // Coupon calculation
  const discountRate = appliedCoupon === "GET20OFF" ? 0.2 : 0;
  const discountAmount = Math.round(cartTotal * discountRate);

  const shippingCost =
    shippingMethod === "free" ? 0 : shippingMethod === "pickup" ? 150 : 300;

  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (code === "GET20OFF") {
      setAppliedCoupon("GET20OFF");
      setCouponInput("GET20OFF");
      showToast("Coupon GET20OFF applied! 20% discount added.");
    } else {
      alert("Invalid coupon code. Try using GET20OFF for 20% off.");
    }
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingDestination(`${tempState}, India (${tempPincode})`);
    setIsChangingAddress(false);
    showToast("Shipping destination updated.");
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#FAF9F7] py-20 font-poppins min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 bg-white border border-[#EAE3D5] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShoppingBag className="w-10 h-10 text-[#C38B75] stroke-[1.4]" />
          </div>
          <h1 className="font-montserrat text-2xl sm:text-3xl font-semibold text-[#1C1208] mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#767069] mb-8 font-light leading-relaxed">
            Discover timeless 18kt hallmarked gold creations and certified natural diamond jewelry designed for your dynamic lifestyle.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#B8933F] hover:bg-[#A37E2E] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors shadow-xs"
          >
            <span>Explore Fine Jewellery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-14 font-poppins">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1208] tracking-tight">
            Cart Summary
          </h1>
        </div>

        {/* ── Two-Column Layout matching Image 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: Table + Coupon + 3 Trust Cards (approx 8 cols) ── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Green Coupon Announcement Banner (Image 1 Match) */}
            <div className="bg-[#EAF7EC] border border-[#CDEBD0] rounded-xs p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#276738]">
                <Tag className="w-4 h-4 flex-shrink-0 text-[#2E7D32]" />
                <span>
                  Use <strong className="font-semibold underline tracking-wide">GET20OFF</strong> coupon code to get 20% off on minimum order above ₹10,000
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyCoupon("GET20OFF")}
                className="px-4 py-2 bg-transparent hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white border border-[#2E7D32] rounded-xs text-xs uppercase font-medium tracking-wider transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                {appliedCoupon === "GET20OFF" ? "COUPON APPLIED ✓" : "APPLY COUPON"}
              </button>
            </div>

            {/* Product Table Container */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAE3D5] bg-[#FAF9F7] text-[11px] sm:text-xs uppercase font-semibold text-[#1C1208] tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Product</th>
                      <th className="py-3.5 px-4 text-center">Price</th>
                      <th className="py-3.5 px-4 text-center">Quantity</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0ECE5]">
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF9F7]/60 transition-colors">
                        {/* Product Column */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {/* Red cross remove button (Image 1 Match) */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#C38B75] hover:text-red-700 p-1 flex-shrink-0"
                              title="Remove item"
                            >
                              <X className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            {/* Thumbnail */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs flex-shrink-0 p-1.5">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain"
                              />
                            </div>

                            {/* Title & Size */}
                            <div className="min-w-0">
                              <Link
                                href={`/product/${item.id}`}
                                className="font-montserrat text-xs sm:text-sm font-medium text-[#1C1208] hover:text-[#B8933F] transition-colors line-clamp-2"
                              >
                                {item.title}
                              </Link>
                              {/* Dynamic Selected Variants */}
                              <div className="mt-1 flex items-center gap-1.5 flex-wrap text-[11px] text-[#767069]">
                                {item.selectedPurity && (
                                  <span className="bg-[#FAF6EC] text-[#B8933F] px-1.5 py-0.5 rounded-xs border border-[#B8933F]/30 font-medium">
                                    {item.selectedPurity}
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="bg-stone-100 text-[#1C1208] px-1.5 py-0.5 rounded-xs font-medium">
                                    {item.sizeLabel || "Size"}: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedColor && (
                                  <span className="bg-stone-100 text-[#1C1208] px-1.5 py-0.5 rounded-xs font-medium">
                                    {item.colorLabel || "Color"}: {item.selectedColor}
                                  </span>
                                )}
                                {item.selectedShape && (
                                  <span className="bg-stone-100 text-[#1C1208] px-1.5 py-0.5 rounded-xs font-medium">
                                    {item.shapeLabel || "Shape"}: {item.selectedShape}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price Column */}
                        <td className="py-4 px-4 text-center text-xs sm:text-sm text-[#C38B75] font-semibold whitespace-nowrap">
                          ₹{item.priceNum.toLocaleString("en-IN")}
                        </td>

                        {/* Quantity Stepper Column (Image 1 Match: - 1 +) */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center border border-[#DDD5C7] rounded-xs bg-[#FAF9F7]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2.5 py-1 text-[#666] hover:text-black hover:bg-[#EAE3D5] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-[#1C1208]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2.5 py-1 text-[#666] hover:text-black hover:bg-[#EAE3D5] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Subtotal Column */}
                        <td className="py-4 px-4 sm:px-6 text-right text-xs sm:text-sm text-[#C38B75] font-bold whitespace-nowrap">
                          ₹{(item.priceNum * item.quantity).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Actions Row under Table (Image 1 Match) */}
              <div className="p-4 sm:p-5 border-t border-[#EAE3D5] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Coupon Code Input + Button */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none focus:border-[#B8933F] w-full sm:w-48"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-5 py-2.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-medium tracking-wider rounded-xs whitespace-nowrap transition-colors active:scale-95"
                  >
                    APPLY COUPON
                  </button>
                </div>

                {/* Update Cart link on right */}
                <button
                  type="button"
                  onClick={() => showToast("Cart recalculated and up to date.")}
                  className="text-xs uppercase font-semibold text-[#1C1208] hover:text-[#B8933F] tracking-wider underline transition-colors"
                >
                  UPDATE CART
                </button>
              </div>
            </div>

            {/* 3 Trust Feature Value Cards (Image 1 Bottom Left Match) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Card 1: Loved by Thousands */}
              <div className="bg-[#FAF9F7] border border-[#EAE3D5] p-6 rounded-xs text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-[#1C1208] mb-1">
                  <Heart className="w-5 h-5 fill-[#C38B75] text-[#C38B75]" />
                </div>
                <h4 className="font-montserrat text-sm font-semibold text-[#1C1208]">
                  Loved by Thousands
                </h4>
                <p className="text-xs text-[#767069] font-light leading-relaxed">
                  Join Thousands of Happy and Satisfied Customers!
                </p>
              </div>

              {/* Card 2: Easy Returns */}
              <div className="bg-[#FAF9F7] border border-[#EAE3D5] p-6 rounded-xs text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-[#1C1208] mb-1">
                  <Repeat className="w-5 h-5 text-[#B8933F]" />
                </div>
                <h4 className="font-montserrat text-sm font-semibold text-[#1C1208]">
                  Easy Returns
                </h4>
                <p className="text-xs text-[#767069] font-light leading-relaxed">
                  Enjoy Hassle-Free Returns and Exchanges – Shop Now!
                </p>
              </div>

              {/* Card 3: Order Now & Get Gift! */}
              <div className="bg-[#FAF9F7] border border-[#EAE3D5] p-6 rounded-xs text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-[#1C1208] mb-1">
                  <Gift className="w-5 h-5 text-[#B8933F]" />
                </div>
                <h4 className="font-montserrat text-sm font-semibold text-[#1C1208]">
                  Order Now & Get Gift!
                </h4>
                <p className="text-xs text-[#767069] font-light leading-relaxed">
                  Order & Receive a Special Gift. Limited Time Only!
                </p>
              </div>
            </div>

          </div>

          {/* ── Right Column: Free Delivery Progress + Cart Totals (approx 4 cols) ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Free Delivery Bar Card (Image 1 Top Right Match) */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs p-5 shadow-xs">
              <div className="relative w-full h-1.5 bg-[#E2EBDD] rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#48BB78] rounded-full w-full" />
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#2F855A] text-center">
                <span>Congratulations! Your order is eligible for <strong>FREE Delivery</strong>.</span>
                <span className="w-5 h-5 rounded-full bg-[#48BB78] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                  <Truck className="w-3 h-3 stroke-[2.2]" />
                </span>
              </div>
            </div>

            {/* Cart Totals Card (Image 1 Right Column Match) */}
            <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 shadow-xs space-y-5">
              <h3 className="font-montserrat text-lg font-bold text-[#1C1208] border-b border-[#EAE3D5] pb-3">
                Cart totals
              </h3>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6E675F] font-medium">Subtotal</span>
                <span className="font-semibold text-[#C38B75]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Coupon Discount if applied */}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs sm:text-sm text-[#2E7D32]">
                  <span className="font-medium">Coupon (20% OFF)</span>
                  <span className="font-bold">-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Shipping section with Radio options */}
              <div className="border-t border-[#F0ECE5] pt-4 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1208] block">
                  Shipping
                </span>

                <div className="space-y-2 text-xs text-[#6E675F]">
                  <label className="flex items-center justify-between cursor-pointer hover:text-[#1C1208]">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "free"}
                        onChange={() => setShippingMethod("free")}
                        className="accent-[#B8933F] w-3.5 h-3.5"
                      />
                      <span>Free shipping</span>
                    </div>
                    <span className="text-[#2E7D32] font-semibold">FREE</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-[#1C1208]">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "pickup"}
                        onChange={() => setShippingMethod("pickup")}
                        className="accent-[#B8933F] w-3.5 h-3.5"
                      />
                      <span>Local pickup:</span>
                    </div>
                    <span>₹150</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-[#1C1208]">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "flat"}
                        onChange={() => setShippingMethod("flat")}
                        className="accent-[#B8933F] w-3.5 h-3.5"
                      />
                      <span>Flat rate:</span>
                    </div>
                    <span>₹300</span>
                  </label>
                </div>

                {/* Destination info + Change address */}
                <div className="pt-2 text-xs text-[#767069]">
                  <p>Shipping to <strong className="text-[#1C1208]">{shippingDestination}</strong>.</p>
                  
                  {!isChangingAddress ? (
                    <button
                      type="button"
                      onClick={() => setIsChangingAddress(true)}
                      className="text-[#C38B75] hover:underline font-semibold mt-1 block"
                    >
                      Change address
                    </button>
                  ) : (
                    <form onSubmit={handleUpdateAddress} className="mt-3 space-y-2 bg-[#FAF9F7] p-3 border border-[#EAE3D5] rounded-xs">
                      <input
                        type="text"
                        placeholder="City / District"
                        value={tempCity}
                        onChange={(e) => setTempCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#DDD5C7] rounded-xs"
                      />
                      <input
                        type="text"
                        placeholder="State (e.g. Maharashtra)"
                        value={tempState}
                        onChange={(e) => setTempState(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#DDD5C7] rounded-xs"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={tempPincode}
                        onChange={(e) => setTempPincode(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#DDD5C7] rounded-xs"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-[#B8933F] text-white text-[11px] uppercase font-semibold rounded-xs"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsChangingAddress(false)}
                          className="text-[11px] text-[#767069]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Total line (Image 1 Match) */}
              <div className="border-t border-[#F0ECE5] pt-4 flex items-center justify-between">
                <span className="font-montserrat text-base font-semibold text-[#1C1208]">
                  Total
                </span>
                <span className="font-montserrat text-xl sm:text-2xl font-bold text-[#B8933F]">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* PROCEED TO CHECKOUT button */}
              <Link
                href="/checkout"
                className="w-full py-3.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-xs text-center block transition-all active:scale-95"
              >
                PROCEED TO CHECKOUT
              </Link>

              {/* Guaranteed Safe And Secure Checkout with payment icons */}
              <div className="pt-2 text-center space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#767069] block font-medium">
                  Guaranteed Safe And Secure Checkout
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap opacity-90">
                  <span className="px-2 py-1 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-[10px] font-bold text-[#1A1F71]">
                    VISA
                  </span>
                  <span className="px-2 py-1 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-[10px] font-bold text-[#EB001B]">
                    Mastercard
                  </span>
                  <span className="px-2 py-1 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-[10px] font-bold text-[#006FCF]">
                    AMEX
                  </span>
                  <span className="px-2 py-1 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-[10px] font-bold text-[#2A9D8F]">
                    UPI
                  </span>
                  <span className="px-2 py-1 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-[10px] font-bold text-[#1C1208]">
                    NetBanking
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE3D5] flex items-center justify-between">
            <h3 className="font-montserrat text-base sm:text-lg font-semibold text-[#1C1208]">
              Shopping Cart
            </h3>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#767069] hover:text-[#1C1208] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Green Free Delivery Eligibility Bar (Image 2 Match) */}
          <div className="border-b border-[#E8F2E6] bg-[#F7FCF5] px-5 py-3">
            <div className="relative w-full h-1 bg-[#D8E8D5] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#48BB78] rounded-full w-full" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11.5px] font-medium text-[#2F855A] text-center">
              <span>Congratulations! Your order is eligible for <strong>FREE Delivery</strong>.</span>
              <span className="w-5 h-5 rounded-full bg-[#48BB78] text-white flex items-center justify-center text-[10px]">
                <Truck className="w-3 h-3 stroke-[2.2]" />
              </span>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F0ECE5]">
            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-[#D1CBC3] mx-auto mb-3 stroke-[1.2]" />
                <p className="font-montserrat text-base font-semibold text-[#1C1208] mb-1">
                  Your cart is empty
                </p>
                <p className="text-xs text-[#767069] mb-6">
                  Explore our fine diamond and 18kt gold collection.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-[#FAF9F7] border border-[#EAE3D5] flex-shrink-0 rounded-xs overflow-hidden p-1.5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-medium text-[#1C1208] leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#C38B75] hover:text-red-700 p-0.5"
                        title="Remove item"
                      >
                        <X className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>

                    {/* Chosen Variants */}
                    {(item.selectedPurity || item.selectedSize || item.selectedColor || item.selectedShape) && (
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap text-[10px] text-[#767069]">
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
                    )}

                    <div className="mt-2 text-xs text-[#767069]">
                      <span>{item.quantity} × </span>
                      <span className="font-semibold text-[#C38B75]">
                        ₹{item.priceNum.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center border border-[#DDD5C7] rounded-xs w-fit">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 hover:bg-[#FAF9F7] text-[#555]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#1C1208]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 hover:bg-[#FAF9F7] text-[#555]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout (Image 2 Match) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#EAE3D5] bg-white space-y-4">
              {/* Subtotal line */}
              <div className="flex items-center justify-between text-sm sm:text-base border-b border-[#F0ECE5] pb-3">
                <span className="font-montserrat text-sm font-semibold text-[#1C1208]">
                  Subtotal:
                </span>
                <span className="font-montserrat text-lg font-bold text-[#B8933F]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Dual Action Buttons matching Image 2 */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 bg-[#1C1208] hover:bg-[#333] text-white text-xs uppercase font-semibold tracking-wider rounded-xs text-center transition-colors"
                >
                  VIEW CART
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 bg-[#B8933F] hover:bg-[#9E792B] text-white text-xs uppercase font-semibold tracking-wider rounded-xs text-center transition-colors shadow-xs"
                >
                  CHECKOUT
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

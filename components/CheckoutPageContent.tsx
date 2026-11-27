"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  Gift,
  CreditCard,
  QrCode,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { apiPlaceOrder, apiGetAddresses, apiValidateCoupon } from "../lib/api";
import GoogleSignInButton from "./GoogleSignInButton";
import { initiateRazorpayCheckout } from "../lib/razorpay";
import PaymentMethodsStrip from "./PaymentMethodsStrip";

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Gujarat",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Rajasthan",
  "Uttar Pradesh",
  "Kerala",
  "Punjab",
  "Haryana",
];

export default function CheckoutPageContent() {
  const { cart, cartTotal, showToast, clearCart, user, isLoggedIn } = useStore();

  const [step, setStep] = useState<"checkout" | "confirmed">("checkout");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("");

  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Sync user info if logged in
  React.useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.name) {
        const parts = user.name.trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
    }
  }, [user]);

  // Load user saved address from backend if available
  React.useEffect(() => {
    const loadSavedAddress = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_token") : null;
      if (!token) return;
      try {
        const res = await apiGetAddresses();
        if (res.success && Array.isArray(res.addresses) && res.addresses.length > 0) {
          const defaultAddr = res.addresses.find((a: any) => a.isDefault) || res.addresses[0];
          if (defaultAddr) {
            if (defaultAddr.name) {
              const nameParts = defaultAddr.name.trim().split(" ");
              setFirstName((prev) => prev || nameParts[0] || "");
              setLastName((prev) => prev || nameParts.slice(1).join(" ") || "");
            }
            if (defaultAddr.phone) setPhone((prev) => prev || defaultAddr.phone);
            if (defaultAddr.street) setAddress((prev) => prev || defaultAddr.street);
            if (defaultAddr.locality) setApartment((prev) => prev || defaultAddr.locality);
            if (defaultAddr.city) setCity((prev) => prev || defaultAddr.city);
            if (defaultAddr.state) setState((prev) => prev || defaultAddr.state);
            if (defaultAddr.pincode) setPincode((prev) => prev || defaultAddr.pincode);
          }
        }
      } catch {
        // ignore
      }
    };
    loadSavedAddress();
  }, [isLoggedIn]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const discountRate =
    appliedCoupon === "GET20OFF" || appliedCoupon === "DIWALI20"
      ? 0.2
      : appliedCoupon === "FESTIVEGOLD" || appliedCoupon === "ZHAEVAAH10"
      ? 0.1
      : 0;

  const discountAmount = Math.round(cartTotal * discountRate);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "GET20OFF" || cleanCode === "DIWALI20") {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon ${cleanCode} applied! 20% discount granted.`);
      return;
    }
    if (cleanCode === "FESTIVEGOLD" || cleanCode === "ZHAEVAAH10") {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon ${cleanCode} applied! Special privilege discount granted.`);
      return;
    }

    try {
      const res = await apiValidateCoupon(cleanCode, cartTotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(cleanCode);
        showToast(`Coupon ${cleanCode} applied successfully!`);
      } else {
        alert(res.message || "Invalid coupon code. Try entering GET20OFF or FESTIVEGOLD.");
      }
    } catch {
      alert("Invalid coupon code. Try entering GET20OFF or FESTIVEGOLD.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your shopping bag is empty.");
      return;
    }

    setIsProcessing(true);
    const newId = `ZH-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderPayload = {
      orderNumber: newId,
      customerName: `${firstName} ${lastName}`.trim(),
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: {
        name: `${firstName} ${lastName}`.trim(),
        street: address,
        locality: apartment,
        city,
        state,
        pincode,
      },
      items: cart.map((item) => {
        const specParts: string[] = [];
        if (item.selectedPurity) specParts.push(`${item.purityLabel || "Purity"}: ${item.selectedPurity}`);
        if (item.selectedSize) specParts.push(`${item.sizeLabel || "Size"}: ${item.selectedSize}`);
        if (item.selectedColor) specParts.push(`${item.colorLabel || "Color"}: ${item.selectedColor}`);
        if (item.selectedShape) specParts.push(`${item.shapeLabel || "Shape"}: ${item.selectedShape}`);
        return {
          productId: item.id,
          title: item.title,
          price: item.priceNum,
          quantity: item.quantity,
          specs: specParts.length ? specParts.join(" • ") : (item.selectedSize ? `Size: ${item.selectedSize}` : undefined),
          selectedVariants: {
            purity: item.selectedPurity,
            purityLabel: item.purityLabel,
            size: item.selectedSize,
            sizeLabel: item.sizeLabel,
            color: item.selectedColor,
            colorLabel: item.colorLabel,
            shape: item.selectedShape,
            shapeLabel: item.shapeLabel,
          },
        };
      }),
      subtotal: cartTotal,
      discount: discountAmount,
      couponCode: appliedCoupon || undefined,
      shippingFee: 0,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod === "razorpay" ? "RAZORPAY" : "CASH_ON_DELIVERY",
      giftPackaging: isGift,
      giftNote: isGift ? (giftMessage.trim() || undefined) : (orderNote.trim() || undefined),
      orderNote: orderNote.trim() || undefined,
    };

    if (paymentMethod === "razorpay") {
      try {
        await initiateRazorpayCheckout({
          amount: finalTotal,
          orderDetails: orderPayload,
          onSuccess: (verifyRes, paymentDetails) => {
            const finalOrderNum = verifyRes.order?.orderNumber || newId;
            setConfirmedOrderId(finalOrderNum);
            setConfirmedPaymentId(paymentDetails.razorpay_payment_id);
            setStep("confirmed");
            clearCart();
            setIsProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            showToast(`✓ Payment Confirmed via Razorpay Webhook! Order #${finalOrderNum}`);
          },
          onError: (errMsg) => {
            setIsProcessing(false);
            alert(`Payment could not be completed: ${errMsg}`);
          },
          onDismiss: () => {
            setIsProcessing(false);
            showToast("Payment window closed. You can re-attempt whenever ready.");
          },
        });
      } catch (err: any) {
        setIsProcessing(false);
        alert(err.message || "Failed to initialize payment gateway.");
      }
    } else {
      // Cash on Delivery
      try {
        const res = await apiPlaceOrder({
          ...orderPayload,
          paymentMethod: "CASH_ON_DELIVERY",
        });
        const finalOrderNum = res.order?.orderNumber || newId;
        setConfirmedOrderId(finalOrderNum);
        setStep("confirmed");
        clearCart();
        setIsProcessing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast(`Order #${finalOrderNum} placed via Pay on Delivery.`);
      } catch (err: any) {
        setIsProcessing(false);
        alert("Failed to record order. Please try again.");
      }
    }
  };

  // ── Reusable Order Review Box (Used both in Mobile sequence and Desktop sidebar) ──
  const renderOrderReviewBox = () => (
    <div className="bg-white border border-[#EAE3D5] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
        <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#1C1208] flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#B8933F]" />
          <span>Order Review ({cart.length} {cart.length === 1 ? "Item" : "Items"})</span>
        </h3>
        <span className="text-xs text-[#2A9D8F] font-semibold bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
          Free Insured Delivery
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-[#F0ECE5]">
        {cart.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3.5">
            <div className="relative w-16 h-16 bg-[#FAF9F7] border border-[#EAE3D5] rounded-xl p-1 flex-shrink-0 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="64px"
                className="object-contain"
              />
              <span className="absolute -top-1 -right-1 bg-[#1C1208] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-montserrat text-xs font-semibold text-[#1C1208] truncate">
                {item.title}
              </h4>
              <div className="text-[11px] text-[#767069] mt-0.5 flex items-center gap-1.5 flex-wrap">
                {item.selectedPurity && (
                  <span className="text-[#B8933F] font-medium">{item.selectedPurity}</span>
                )}
                {item.selectedSize && (
                  <span>• {item.sizeLabel || "Size"}: {item.selectedSize}</span>
                )}
                {item.selectedColor && (
                  <span>• {item.selectedColor}</span>
                )}
                {item.selectedShape && (
                  <span>• {item.selectedShape}</span>
                )}
              </div>
            </div>

            <span className="font-semibold text-xs text-[#C38B75] whitespace-nowrap">
              ₹{(item.priceNum * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon Input Box */}
      <div className="pt-3 border-t border-[#EAE3D5] flex gap-2">
        <input
          type="text"
          placeholder="Discount code (try GET20OFF)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApplyCoupon();
            }
          }}
          className="flex-1 px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none focus:border-[#B8933F]"
        />
        <button
          type="button"
          onClick={() => handleApplyCoupon()}
          className="px-4 sm:px-5 py-2.5 bg-[#1C1208] hover:bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider rounded-xl transition-colors whitespace-nowrap cursor-pointer active:scale-95"
        >
          Apply
        </button>
      </div>

      {/* Price Calculation Lines */}
      <div className="pt-3 border-t border-[#EAE3D5] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#6E675F]">
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex items-center justify-between text-[#6E675F]">
          <span>Insured Express Shipping</span>
          <span className="text-[#2A9D8F] font-semibold">FREE (Covered by ZHAEVAAH)</span>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-[#2E7D32] font-semibold">
            <span>Coupon Discount ({appliedCoupon})</span>
            <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D5] text-sm sm:text-base font-bold text-[#1C1208]">
          <span>Total Amount</span>
          <span className="text-[#C38B75] text-lg sm:text-xl font-bold">
            ₹{finalTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );

  // ── Reusable Authenticity & Trust Card ──
  const renderAuthenticityCard = () => (
    <div className="bg-white border border-[#EAE3D5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
      <div className="flex items-start gap-3">
        <BadgeCheck className="w-5 h-5 text-[#B8933F] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-montserrat text-xs font-bold text-[#1C1208] uppercase tracking-wider">
            100% BIS Hallmarked &amp; IGI Certified
          </h4>
          <p className="text-[11px] text-[#767069] leading-relaxed">
            Every piece carries government-certified BIS hallmark stamp and international lab certificates verifying diamond clarity and color.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-montserrat text-xs font-bold text-[#1C1208] uppercase tracking-wider">
            Full Value Transit Insurance
          </h4>
          <p className="text-[11px] text-[#767069] leading-relaxed">
            Your package is 100% insured until signed by you in person with delivery OTP verification.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#C38B75] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-montserrat text-xs font-bold text-[#1C1208] uppercase tracking-wider">
            15-Day Money Back &amp; Lifetime Exchange
          </h4>
          <p className="text-[11px] text-[#767069] leading-relaxed">
            Enjoy complete peace of mind with our transparent buyback and hassle-free return policy.
          </p>
        </div>
      </div>
    </div>
  );

  // ── Order Confirmed State ──
  if (step === "confirmed") {
    return (
      <div className="w-full bg-[#FAF9F7] py-16 sm:py-20 font-poppins min-h-[70vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white border border-[#EAE3D5] rounded-2xl p-8 sm:p-10 shadow-sm text-center">
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#FAF6EE] border-2 border-[#B8933F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-[#B8933F] stroke-[2.2]" />
            </div>

            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B8933F] block mb-2">
              Order Confirmed &amp; Insured
            </span>

            <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#1C1208] mb-3">
              Thank You, {firstName}!
            </h1>

            <p className="text-xs sm:text-sm text-[#767069] font-light leading-relaxed mb-6">
              Your order <strong className="text-[#1C1208]">#{confirmedOrderId}</strong> has been received and scheduled for BIS hallmark verification and insured packaging.
            </p>

            {/* Order Details Receipt Box */}
            <div className="bg-[#FAF9F7] border border-[#EAE3D5] rounded-xl p-5 text-left text-xs text-[#6E675F] space-y-2.5 mb-8">
              <div className="flex justify-between border-b border-[#EAE3D5] pb-2">
                <span>Estimated Doorstep Delivery:</span>
                <strong className="text-[#2A9D8F]">3–4 Business Days (Insured Air)</strong>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D5] pb-2">
                <span>Shipping Address:</span>
                <span className="text-[#1C1208] text-right truncate max-w-[240px]">
                  {address}, {city}, {state} – {pincode}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#EAE3D5] pb-2">
                <span>Payment Method:</span>
                <strong className="text-[#1C1208] uppercase">
                  {paymentMethod === "razorpay" ? "Razorpay (Online Payment)" : "Pay on Delivery (COD)"}
                </strong>
              </div>
              {confirmedPaymentId && (
                <div className="flex justify-between border-b border-[#EAE3D5] pb-2">
                  <span>Razorpay Payment ID:</span>
                  <strong className="text-[#B8933F] font-mono text-[11px]">{confirmedPaymentId}</strong>
                </div>
              )}
              {paymentMethod === "razorpay" && (
                <div className="flex justify-between border-b border-[#EAE3D5] pb-2 items-center">
                  <span>Payment Verification:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Confirmed by Razorpay Webhook (PAID)
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-sm font-bold text-[#1C1208]">
                <span>Total Amount Paid:</span>
                <span className="text-[#C38B75]">₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Notification note */}
            <p className="text-xs text-[#767069] mb-8">
              A detailed GST tax invoice &amp; digital IGI diamond authenticity certificate have been dispatched to <strong className="text-[#1C1208]">{email}</strong> and via WhatsApp to <strong className="text-[#1C1208]">{phone}</strong>.
            </p>

            {/* Dual CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/profile?tab=orders"
                className="px-6 py-3 bg-[#1C1208] hover:bg-[#333] text-white text-xs uppercase font-medium tracking-wider rounded-xl transition-colors"
              >
                Track Live Order in Profile
              </Link>
              <Link
                href="/women"
                className="px-6 py-3 bg-[#B8933F] hover:bg-[#A37E2E] text-white text-xs uppercase font-medium tracking-wider rounded-xl transition-colors"
              >
                Continue Browsing Collection
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F7] py-10 sm:py-14 font-poppins min-h-screen">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Header */}
        <div className="mb-8">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208] tracking-tight">
            Secure Jewellery Checkout
          </h1>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: Checkout Sequence (approx 7 cols) ── */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* 1. Contact Information Card */}
            <div className="bg-white border border-[#EAE3D5] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
                <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208] flex items-center gap-2">
                  <span>1. Contact Information</span>
                </h2>
                {!isLoggedIn && (
                  <Link
                    href="/auth"
                    className="text-xs text-[#B8933F] hover:underline font-medium"
                  >
                    Log In for VIP Perks
                  </Link>
                )}
              </div>

              {/* Google Quick Sign-In or Logged In Status Banner */}
              {!isLoggedIn ? (
                <div className="p-3.5 bg-[#FAF6EE] border border-[#B8933F]/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#B8933F] shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-[#1C1208] block">
                        Fast Checkout with Google
                      </span>
                      <span className="text-[11px] text-[#767069]">
                        1-click address autofill &amp; automatic VIP rewards enrollment
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto shrink-0">
                    <GoogleSignInButton
                      text="continue_with"
                      onSuccess={(googleUser) => {
                        showToast(`Welcome, ${googleUser.name}! Contact details autofilled.`);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#F0F8F5] border border-[#C8E6C9] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#2E7D32]">
                    <BadgeCheck className="w-4 h-4 text-[#2E7D32]" />
                    <span>
                      Ordering as <strong>{user?.name || "VIP Customer"}</strong> ({user?.email})
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8933F] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#B8933F]/30">
                    {user?.vipTier || "Gold VIP Member"}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  />
                  <span className="text-[10px] text-[#767069] mt-1 block">
                    Order invoice &amp; IGI certificate will be sent here
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 54321"
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  />
                  <span className="text-[10px] text-[#767069] mt-1 block">
                    For delivery OTP and insured courier updates
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Insured Delivery Address Card */}
            <div className="bg-white border border-[#EAE3D5] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
                <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B8933F]" />
                  <span>2. Delivery Address (India)</span>
                </h2>
                <span className="text-xs text-[#2A9D8F] font-semibold flex items-center gap-1 bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Insured Transit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                  Street Address &amp; House / Flat No. *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 1402, Tower B, Oberoi Sky Heights"
                  className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                  Apartment, Suite, Landmark
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="e.g. Near Infinity Mall, Lokhandwala"
                  className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400053"
                    className="w-full px-4 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                  />
                </div>
              </div>

              {/* Gift Option Box */}
              <div className="pt-3 border-t border-[#F0ECE5]">
                <label className="flex items-center gap-2.5 text-xs text-[#6E675F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="accent-[#B8933F] w-4 h-4 rounded"
                  />
                  <span className="flex items-center gap-1.5 font-medium text-[#1C1208]">
                    <Gift className="w-4 h-4 text-[#B8933F]" />
                    This is a surprise gift — Include complimentary velvet presentation box &amp; custom card
                  </span>
                </label>

                {isGift && (
                  <div className="mt-3">
                    <textarea
                      rows={2}
                      placeholder="Write your personal gift message to be handwritten on luxury parchment..."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full p-3.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                    />
                  </div>
                )}

                {/* Order Note & Special Customization Instructions */}
                <div className="mt-4 pt-3 border-t border-[#F0ECE5]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1208]">
                      Order Note &amp; Special Instructions (Optional)
                    </label>
                    <span className="text-[10px] text-[#767069]">Atelier notes</span>
                  </div>
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="e.g. Custom engraving message (e.g. 'Forever Yours 2026'), special wrist/chain length fit instructions, or preferred delivery timing..."
                    className="w-full p-3.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xl text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F] transition-colors"
                  />
                  <p className="text-[10px] text-[#767069] mt-1">
                    Your note will be securely stored with this order and shared with our master goldsmiths.
                  </p>
                </div>
              </div>
            </div>

            {/* ── MOBILE ONLY: Order Review & Pricing (Appears before Payment Options on Mobile so user reviews their bag first!) ── */}
            <div className="block lg:hidden">
              {renderOrderReviewBox()}
            </div>

            {/* ── 3. (Desktop) / 4. (Mobile) Payment Options Card — AT THE VERY LAST! ── */}
            <div className="bg-white border border-[#EAE3D5] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
                <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#B8933F]" />
                  <span>3. Payment Options</span>
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] text-[#2E7D32] font-semibold bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit Bank Encryption</span>
                </div>
              </div>

              {/* Radio options */}
              <div className="space-y-3.5">
                
                {/* Razorpay Online Instant Checkout */}
                <label
                  className={`block p-4 sm:p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-[#B8933F] bg-[#FAF6EE] shadow-xs"
                      : "border-[#EAE3D5] bg-white hover:border-[#DDD5C7]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-[#B8933F] w-4 h-4 mt-1 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#1C1208] uppercase tracking-wider">
                          Razorpay Instant Checkout
                        </span>
                        <span className="text-[9px] font-bold text-white bg-[#B8933F] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E675F] mt-1 leading-relaxed">
                        Pay securely with UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking (50+ Banks), Wallets &amp; EMI.
                      </p>

                      {/* Supported Badges (Fixed layout without border overflow) */}
                      <div className="mt-3.5 w-full max-w-full overflow-hidden">
                        <PaymentMethodsStrip compact />
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`block p-4 sm:p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#B8933F] bg-[#FAF6EE] shadow-xs"
                      : "border-[#EAE3D5] bg-white hover:border-[#DDD5C7]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#B8933F] w-4 h-4 mt-1 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-[#1C1208] uppercase tracking-wider block">
                        Pay on Delivery (Cash / UPI at Doorstep)
                      </span>
                      <p className="text-[11px] text-[#6E675F] mt-1 leading-relaxed">
                        Available on orders up to ₹50,000 across India. Verified via OTP at delivery.
                      </p>
                    </div>
                  </div>
                </label>

              </div>
            </div>

            {/* ── Place Order CTA Button — DIRECTLY AFTER PAYMENT OPTIONS! ── */}
            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              className="w-full py-4 sm:py-4.5 bg-gradient-to-r from-[#B8933F] via-[#C59F4E] to-[#B8933F] hover:from-[#A8832F] hover:to-[#B8933F] text-white text-xs sm:text-sm uppercase font-bold tracking-[0.2em] rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? "INITIALIZING PAYMENT..."
                  : paymentMethod === "razorpay"
                  ? `PAY VIA RAZORPAY • ₹${finalTotal.toLocaleString("en-IN")}`
                  : `CONFIRM ORDER (COD) • ₹${finalTotal.toLocaleString("en-IN")}`}
              </span>
            </button>

            {/* MOBILE ONLY: Authenticity & Trust Guarantees */}
            <div className="block lg:hidden">
              {renderAuthenticityCard()}
            </div>

          </div>

          {/* ── Right Column: Desktop Sticky Order Summary & Certifications (approx 5 cols) ── */}
          <div className="hidden lg:block lg:col-span-5 space-y-6 sticky top-24">
            {renderOrderReviewBox()}
            {renderAuthenticityCard()}
          </div>

        </form>

      </div>
    </div>
  );
}

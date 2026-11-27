"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  ShieldCheck,
  Crown,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Download,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import OrderInvoiceModal from "./OrderInvoiceModal";
import {
  apiGetProfile,
  apiUpdateProfile,
  apiGetAddresses,
  apiCreateAddress,
  apiUpdateAddress,
  apiDeleteAddress,
  apiGetMyOrders,
  apiChangePassword,
} from "../lib/api";
import { formatAutoDate } from "../lib/formatters";

type ProfileTab =
  | "overview"
  | "orders"
  | "edit-profile"
  | "addresses"
  | "security"
  | "privilege";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  specs: string;
  price: string;
  qty: number;
}

interface Order {
  id: string;
  orderNumber?: string;
  date: string;
  total: string;
  totalAmount: number;
  paymentMethod: string;
  status: "In Transit" | "Delivered" | "Processing";
  orderStatus?: string;
  carrier?: string;
  deliveryEstimate?: string;
  trackingNumber: string;
  shippingAddress?: any;
  orderNote?: string;
  giftNote?: string;
  items: OrderItem[];
  trackingSteps: {
    title: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

interface Address {
  id: string;
  type: "Home" | "Office" | "Other";
  name: string;
  phone: string;
  street: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface SavedCard {
  id: string;
  bank: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
  isDefault?: boolean;
}

interface SavedUpi {
  id: string;
  handle: string;
  label?: string;
  isDefault?: boolean;
}

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

function formatDbOrder(dbOrder: any): Order {
  const dateStr = dbOrder.createdAt
    ? new Date(dbOrder.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recent Order";

  const rawItems = Array.isArray(dbOrder.items) ? dbOrder.items : [];
  const normalizedItems: OrderItem[] = rawItems.map((item: any, idx: number) => ({
    id: item.id || item.productId || `item-${idx}`,
    name: item.title || item.name || "Handcrafted Jewellery",
    image: item.image || item.primaryImage || "/images/product_1_main.png",
    specs:
      item.specs ||
      `${item.selectedPurity || "18kt Gold"}${item.selectedSize ? ` • Size ${item.selectedSize}` : ""}${
        item.selectedColor ? ` • ${item.selectedColor}` : ""
      }`,
    price:
      typeof item.price === "number"
        ? `₹${item.price.toLocaleString("en-IN")}`
        : item.price || "₹0",
    qty: item.quantity || item.qty || 1,
  }));

  // Map tracking steps
  let trackingSteps: { title: string; date: string; completed: boolean; current?: boolean }[] = [];
  if (Array.isArray(dbOrder.trackingTimeline) && dbOrder.trackingTimeline.length > 0) {
    trackingSteps = dbOrder.trackingTimeline.map((step: any) => ({
      title: step.title || step.status,
      date: step.timestamp
        ? new Date(step.timestamp).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : step.date || "",
      completed: Boolean(step.completed),
      current: Boolean(step.current),
    }));
  } else {
    const status = (dbOrder.orderStatus || "CONFIRMED").toUpperCase();
    const isConfirmed = true;
    const isProcessing = ["PROCESSING", "HALLMARKED", "SHIPPED", "IN_TRANSIT", "DELIVERED"].includes(
      status
    );
    const isShipped = ["SHIPPED", "IN_TRANSIT", "DELIVERED"].includes(status);
    const isDelivered = status === "DELIVERED";

    trackingSteps = [
      { title: "Order Placed & Verified", date: dateStr, completed: isConfirmed },
      {
        title: "BIS Hallmarking & Quality Check",
        date: isProcessing ? "Completed" : "Pending",
        completed: isProcessing,
      },
      {
        title: "Dispatched via Insured Air",
        date: isShipped ? "Dispatched" : "Pending",
        completed: isShipped,
        current: isShipped && !isDelivered,
      },
      {
        title: "Delivered to Doorstep",
        date: isDelivered ? "Delivered" : dbOrder.deliveryEstimate || "Expected in 3-4 days",
        completed: isDelivered,
      },
    ];
  }

  let displayStatus: "In Transit" | "Delivered" | "Processing" = "Processing";
  const stUpper = (dbOrder.orderStatus || "").toUpperCase();
  if (stUpper === "DELIVERED") {
    displayStatus = "Delivered";
  } else if (stUpper === "IN_TRANSIT" || stUpper === "SHIPPED") {
    displayStatus = "In Transit";
  } else {
    displayStatus = "Processing";
  }

  return {
    id: dbOrder.orderNumber || dbOrder.id,
    orderNumber: dbOrder.orderNumber || dbOrder.id,
    date: dateStr,
    total:
      typeof dbOrder.totalAmount === "number"
        ? `₹${dbOrder.totalAmount.toLocaleString("en-IN")}`
        : `₹${dbOrder.totalAmount || "0"}`,
    totalAmount: Number(dbOrder.totalAmount) || 0,
    paymentMethod: dbOrder.paymentMethod || "Online Payment",
    status: displayStatus,
    orderStatus: dbOrder.orderStatus,
    carrier: dbOrder.carrier || "BlueDart Air Priority",
    deliveryEstimate: dbOrder.deliveryEstimate || "3-4 Business Days",
    trackingNumber:
      dbOrder.trackingNumber || `AWB-${(dbOrder.orderNumber || dbOrder.id || "").slice(-8)}`,
    shippingAddress: dbOrder.shippingAddress,
    orderNote: dbOrder.orderNote || dbOrder.giftNote || null,
    giftNote: dbOrder.giftNote || null,
    items: normalizedItems,
    trackingSteps,
  };
}

function ProfileContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, user: storeUser, isLoggedIn, logout } = useStore();

  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  // Route Protection: If not logged in, redirect to home (/)
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_user") : null;

    if (token === "demo-token-12345") {
      localStorage.removeItem("zhaevaah_token");
      localStorage.removeItem("zhaevaah_user");
      router.replace("/");
      return;
    }

    if (!token && !isLoggedIn && !storedUser) {
      router.replace("/");
      return;
    }

    setAuthChecked(true);
  }, [isLoggedIn, router]);

  // User Profile Form State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    anniversary: "",
    gender: "Female",
    whatsappUpdates: true,
    smsAlerts: true,
    catalogNewsletter: false,
    loyaltyPoints: 4850,
    tier: "Gold Privilege Tier",
    avatar: "",
    isVerified: false,
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    type: "Home",
    name: "",
    phone: "",
    street: "",
    locality: "",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "",
    isDefault: false,
  });

  // Password / Security State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Fetch real user data from backend DB
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile
      const profRes = await apiGetProfile();
      if (profRes.success && profRes.profile) {
        const u = profRes.profile;
        const nameParts = (u.name || "").trim().split(" ");
        const fName = nameParts[0] || "";
        const lName = nameParts.slice(1).join(" ") || "";

        setProfile({
          firstName: fName,
          lastName: lName,
          email: u.email || "",
          phone: u.phone || "",
          dob: formatAutoDate(u.dateOfBirth || ""),
          anniversary: formatAutoDate(u.anniversary || ""),
          gender: u.gender || "Female",
          whatsappUpdates: u.whatsappUpdates ?? true,
          smsAlerts: u.smsAlerts ?? true,
          catalogNewsletter: u.catalogNewsletter ?? false,
          loyaltyPoints: u.loyaltyPoints ?? 4850,
          tier: u.tier || "Gold Privilege Tier",
          avatar: u.avatar || "",
          isVerified: Boolean(u.isVerified),
        });

        setTwoFactorEnabled(u.twoFactorEnabled ?? true);

        if (Array.isArray(u.addresses)) {
          setAddresses(u.addresses);
        }
      } else {
        const msg = (profRes.message || "").toLowerCase();
        if (msg.includes("token") || msg.includes("authentication required") || msg.includes("no longer exists")) {
          logout();
          router.replace("/");
          return;
        }
        if (storeUser) {
          // Fallback to storeUser if profile endpoint returned no profile
          const nameParts = (storeUser.name || "").trim().split(" ");
          setProfile((prev) => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: storeUser.email || "",
            phone: storeUser.phone || "",
            avatar: storeUser.avatar || storeUser.picture || "",
            isVerified: Boolean(storeUser.isVerified),
          }));
        }
      }

      // 2. Fetch User Orders
      const orderRes = await apiGetMyOrders();
      if (orderRes.success && Array.isArray(orderRes.orders)) {
        const formatted = orderRes.orders.map(formatDbOrder);
        setOrders(formatted);
      }
    } catch (err) {
      console.error("[Profile Load Error]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [storeUser]);

  // Sync initial tab from URL query param
  useEffect(() => {
    const tab = searchParams.get("tab") as ProfileTab | null;
    if (
      tab &&
      [
        "overview",
        "orders",
        "edit-profile",
        "addresses",
        "security",
        "privilege",
      ].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handle Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    try {
      const res = await apiUpdateProfile({
        name: fullName,
        phone: profile.phone,
        gender: profile.gender,
        dateOfBirth: profile.dob,
        anniversary: profile.anniversary,
        whatsappUpdates: profile.whatsappUpdates,
        smsAlerts: profile.smsAlerts,
        catalogNewsletter: profile.catalogNewsletter,
      });

      if (res.success) {
        showToast("Profile details updated successfully!");
        // Update local stored user for header and other components
        const stored = localStorage.getItem("zhaevaah_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              "zhaevaah_user",
              JSON.stringify({
                ...parsed,
                name: fullName,
                phone: profile.phone,
                gender: profile.gender,
                dateOfBirth: profile.dob,
              })
            );
            window.dispatchEvent(new Event("zhaevaah-auth-changed"));
          } catch {
            // ignore
          }
        }
      } else {
        showToast(res.message || "Failed to update profile.");
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode) {
      alert("Please fill in the street address and valid 6-digit pincode.");
      return;
    }

    try {
      if (editingAddressId) {
        const res = await apiUpdateAddress(editingAddressId, newAddress);
        if (res.success && res.address) {
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.id === editingAddressId
                ? res.address
                : newAddress.isDefault
                ? { ...addr, isDefault: false }
                : addr
            )
          );
          showToast("Address modified successfully!");
        } else {
          showToast(res.message || "Failed to update address.");
        }
      } else {
        const res = await apiCreateAddress(newAddress);
        if (res.success && res.address) {
          if (newAddress.isDefault) {
            setAddresses((prev) => [
              ...prev.map((a) => ({ ...a, isDefault: false })),
              res.address,
            ]);
          } else {
            setAddresses((prev) => [...prev, res.address]);
          }
          showToast("New address added to your address book!");
        } else {
          showToast(res.message || "Failed to add address.");
        }
      }

      setIsAddressModalOpen(false);
      setEditingAddressId(null);
      setNewAddress({
        type: "Home",
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        phone: profile.phone,
        street: "",
        locality: "",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "",
        isDefault: false,
      });
    } catch (err: any) {
      showToast(err.message || "Error saving address.");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await apiUpdateAddress(id, { isDefault: true });
      if (res.success) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          }))
        );
        showToast("Default delivery address updated.");
      } else {
        showToast(res.message || "Failed to update default address.");
      }
    } catch (err: any) {
      showToast(err.message || "Error setting default address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;
    try {
      const res = await apiDeleteAddress(id);
      if (res.success) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        showToast("Address removed.");
      } else {
        showToast(res.message || "Failed to remove address.");
      }
    } catch (err: any) {
      showToast(err.message || "Error removing address.");
    }
  };

  const handleToggle2FA = async () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    try {
      const res = await apiUpdateProfile({ twoFactorEnabled: nextVal });
      if (res.success) {
        showToast(
          nextVal
            ? "Two-factor authentication enabled."
            : "Two-factor authentication disabled."
        );
      } else {
        showToast(res.message || "Failed to update 2FA setting.");
      }
    } catch (err: any) {
      showToast(err.message || "Error updating 2FA.");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await apiChangePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (res.success) {
        showToast("Your password was updated securely.");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(res.message || "Failed to update password.");
      }
    } catch (err: any) {
      showToast(err.message || "Error updating password.");
    }
  };

  // Calculations for VIP Tier and metrics
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const availablePoints =
    profile.loyaltyPoints ?? (totalSpent > 0 ? Math.round(totalSpent * 0.05) : 4850);
  const inTransitOrders = orders.filter(
    (o) => o.status === "In Transit" || o.orderStatus === "IN_TRANSIT" || o.orderStatus === "SHIPPED"
  );
  const activeShipment = inTransitOrders[0] || orders[0];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || storeUser?.name || "ZHAEVAAH Client";
  const userInitials =
    `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() ||
    (fullName?.[0] || "Z").toUpperCase();

  if (!authChecked) {
    return (
      <div className="w-full bg-[#FAF9F7] py-28 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] font-poppins">
        <Loader2 className="w-8 h-8 text-[#B8933F] animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#767069]">Verifying Atelier Access...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F7] py-8 sm:py-10 font-poppins min-h-[calc(100vh-140px)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top VIP User Header Bar ── */}
        <div className="bg-white border border-[#EAE3D5] rounded-xs p-6 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Monogram / Profile Avatar */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#1C1208] to-[#3A2A1A] text-white flex items-center justify-center font-montserrat font-bold text-2xl sm:text-3xl border-2 border-[#B8933F] shadow-sm flex-shrink-0 overflow-hidden">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={fullName}
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  className="object-cover rounded-full"
                />
              ) : (
                <span>{userInitials}</span>
              )}
              <div className="absolute -bottom-1 -right-1 bg-[#B8933F] text-white p-1 rounded-full shadow-xs">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-montserrat text-xl sm:text-2xl font-bold text-[#1C1208] tracking-tight">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAF6EE] text-[#B8933F] border border-[#B8933F]/30 text-[11px] font-semibold uppercase tracking-wider rounded-xs">
                  <Crown className="w-3 h-3 fill-[#B8933F]" />
                  {profile.tier}
                </span>
                {profile.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider rounded-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Email
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold uppercase tracking-wider rounded-xs">
                    <AlertCircle className="w-3 h-3" />
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-[#767069] mt-1 flex items-center gap-3 flex-wrap">
                {profile.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#B8933F]" />
                    {profile.email}
                  </span>
                )}
                {profile.phone && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#B8933F]" />
                      {profile.phone}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-[#EAE3D5] pt-4 md:pt-0 md:pl-8">
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase font-semibold text-[#767069] tracking-wider block">
                Reward Points
              </span>
              <span className="font-montserrat text-lg font-bold text-[#B8933F]">
                {availablePoints.toLocaleString("en-IN")} pts
              </span>
              <span className="text-[10px] text-[#A89F95] block">
                Worth ₹{availablePoints.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="h-8 w-px bg-[#EAE3D5]" />
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase font-semibold text-[#767069] tracking-wider block">
                Total Orders
              </span>
              <span className="font-montserrat text-lg font-bold text-[#1C1208]">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
              <span className="text-[10px] text-[#2A9D8F] block font-medium">
                {inTransitOrders.length > 0
                  ? `${inTransitOrders.length} In Transit`
                  : orders.length > 0
                  ? "All Delivered"
                  : "No Orders Yet"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Sticky Horizontal Navigation Bar for Small Screens ── */}
        <div className="lg:hidden sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 bg-[#FAF9F7]/95 backdrop-blur-md border-y border-[#EAE3D5] shadow-xs mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {/* Overview */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#1C1208] text-white shadow-xs font-semibold"
                  : "bg-white text-[#524B43] hover:text-[#1C1208] border border-[#DDD5C7]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Overview</span>
            </button>

            {/* Orders */}
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#1C1208] text-white shadow-xs font-semibold"
                  : "bg-white text-[#524B43] hover:text-[#1C1208] border border-[#DDD5C7]"
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Orders</span>
              <span className="bg-[#B8933F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {orders.length}
              </span>
            </button>

            {/* Personal Info */}
            <button
              type="button"
              onClick={() => setActiveTab("edit-profile")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "edit-profile"
                  ? "bg-[#1C1208] text-white shadow-xs font-semibold"
                  : "bg-white text-[#524B43] hover:text-[#1C1208] border border-[#DDD5C7]"
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Personal Info</span>
            </button>

            {/* Saved Addresses */}
            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-[#1C1208] text-white shadow-xs font-semibold"
                  : "bg-white text-[#524B43] hover:text-[#1C1208] border border-[#DDD5C7]"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Addresses ({addresses.length})</span>
            </button>

            {/* Privilege Club */}
            <button
              type="button"
              onClick={() => setActiveTab("privilege")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "privilege"
                  ? "bg-[#1C1208] text-white shadow-xs font-semibold"
                  : "bg-white text-[#524B43] hover:text-[#1C1208] border border-[#DDD5C7]"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Privilege Club</span>
            </button>

            {/* Security */}
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#1C1208] text-white shadow-xs font-semibold"
                  : "bg-white text-[#524B43] hover:text-[#1C1208] border border-[#DDD5C7]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8933F]" />
              <span>Security</span>
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 text-[#C38B75] bg-[#FFF5F2] hover:bg-[#FFEAE3] border border-[#F5D5CB] transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Sidebar Navigation (Desktop) ── */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#EAE3D5] rounded-xs p-4 shadow-xs space-y-1 sticky top-28">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs uppercase font-medium tracking-wider transition-colors ${
                activeTab === "overview"
                  ? "bg-[#1C1208] text-white"
                  : "text-[#1C1208] hover:bg-[#FAF9F7] hover:text-[#B8933F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#B8933F]" />
                <span>Dashboard Overview</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs uppercase font-medium tracking-wider transition-colors ${
                activeTab === "orders"
                  ? "bg-[#1C1208] text-white"
                  : "text-[#1C1208] hover:bg-[#FAF9F7] hover:text-[#B8933F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#B8933F]" />
                <span>My Orders & Tracking</span>
              </div>
              <span className="bg-[#B8933F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("edit-profile")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs uppercase font-medium tracking-wider transition-colors ${
                activeTab === "edit-profile"
                  ? "bg-[#1C1208] text-white"
                  : "text-[#1C1208] hover:bg-[#FAF9F7] hover:text-[#B8933F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#B8933F]" />
                <span>Personal Info</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs uppercase font-medium tracking-wider transition-colors ${
                activeTab === "addresses"
                  ? "bg-[#1C1208] text-white"
                  : "text-[#1C1208] hover:bg-[#FAF9F7] hover:text-[#B8933F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#B8933F]" />
                <span>Saved Addresses</span>
              </div>
              <span className="text-[11px] text-[#A89F95] font-normal">({addresses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("privilege")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs uppercase font-medium tracking-wider transition-colors ${
                activeTab === "privilege"
                  ? "bg-[#1C1208] text-white"
                  : "text-[#1C1208] hover:bg-[#FAF9F7] hover:text-[#B8933F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-[#B8933F]" />
                <span>Privilege Club</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs uppercase font-medium tracking-wider transition-colors ${
                activeTab === "security"
                  ? "bg-[#1C1208] text-white"
                  : "text-[#1C1208] hover:bg-[#FAF9F7] hover:text-[#B8933F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#B8933F]" />
                <span>Security & Password</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <div className="pt-3 border-t border-[#EAE3D5]">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/");
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase font-medium tracking-wider text-[#C38B75] hover:bg-[#FFF5F2] rounded-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* ── Right Content Area ── */}
          <main className="lg:col-span-9 bg-white border border-[#EAE3D5] rounded-xs p-6 sm:p-8 shadow-xs">
            {isLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 text-[#B8933F] animate-spin mx-auto mb-3" />
                <p className="text-xs uppercase tracking-widest text-[#767069]">
                  Loading Atelier Account Data...
                </p>
              </div>
            ) : (
              <>
                {/* ═════════ TAB 1: OVERVIEW ═════════ */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-montserrat text-2xl font-semibold text-[#1C1208]">
                        Account Overview
                      </h2>
                      <p className="text-xs text-[#767069] mt-1 font-light">
                        Manage your certified orders, delivery destinations, and privilege benefits.
                      </p>
                    </div>

                    {/* Active Order Spotlight */}
                    {activeShipment ? (
                      <div className="border border-[#B8933F]/40 bg-[#FAF6EE] rounded-xs p-5 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D5] pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#B8933F]" />
                            <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                              Active Shipment: Order #{activeShipment.orderNumber || activeShipment.id}
                            </h3>
                          </div>
                          <span className="text-xs font-semibold text-[#2A9D8F] bg-white px-3 py-1 rounded-xs border border-[#2A9D8F]/30 w-fit">
                            {activeShipment.status} • {activeShipment.deliveryEstimate || "Expected Soon"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="md:col-span-2 space-y-2">
                            <p className="text-xs text-[#6E675F]">
                              <strong className="text-[#1C1208]">Courier:</strong>{" "}
                              {activeShipment.carrier || "BlueDart Apex Insured Air"} •{" "}
                              <strong className="text-[#1C1208]">Tracking ID:</strong>{" "}
                              {activeShipment.trackingNumber}
                            </p>
                            <p className="text-xs text-[#6E675F]">
                              <strong className="text-[#1C1208]">Destination:</strong>{" "}
                              {activeShipment.shippingAddress?.street
                                ? `${activeShipment.shippingAddress.street}, ${
                                    activeShipment.shippingAddress.city || ""
                                  }`
                                : defaultAddress
                                ? `${defaultAddress.street}, ${defaultAddress.city}`
                                : "Primary Registered Address"}
                            </p>
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => setActiveTab("orders")}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8933F] hover:underline uppercase tracking-wider"
                              >
                                <span>View Full Tracking Timeline</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {activeShipment.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="relative w-14 h-14 bg-white border border-[#EAE3D5] rounded-xs p-1"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="56px"
                                  className="object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-[#DDD5C7] bg-[#FAF9F7] rounded-xs p-8 text-center">
                        <Truck className="w-8 h-8 text-[#B8933F] mx-auto mb-2 opacity-70" />
                        <h4 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                          No Active Shipments
                        </h4>
                        <p className="text-xs text-[#767069] mt-1 max-w-md mx-auto">
                          You have no pending shipments. Place an order to enjoy insured door-to-door delivery with BIS hallmark verification.
                        </p>
                        <Link
                          href="/women"
                          className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#B8933F] hover:bg-[#A37E2E] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors"
                        >
                          <span>Explore Collections</span>
                        </Link>
                      </div>
                    )}

                    {/* 3 Overview Quick Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border border-[#EAE3D5] p-5 rounded-xs bg-[#FAF9F7]">
                        <div className="flex items-center justify-between mb-3">
                          <Crown className="w-5 h-5 text-[#B8933F]" />
                          <button
                            type="button"
                            onClick={() => setActiveTab("privilege")}
                            className="text-[11px] text-[#B8933F] hover:underline font-medium"
                          >
                            Redeem
                          </button>
                        </div>
                        <span className="text-xs text-[#767069] block">Available Points</span>
                        <span className="font-montserrat text-xl font-bold text-[#1C1208] block mt-0.5">
                          {availablePoints.toLocaleString("en-IN")} Pts
                        </span>
                        <span className="text-[11px] text-[#A89F95] mt-1 block">
                          Worth ₹{availablePoints.toLocaleString("en-IN")} discount
                        </span>
                      </div>

                      <div className="border border-[#EAE3D5] p-5 rounded-xs bg-[#FAF9F7]">
                        <div className="flex items-center justify-between mb-3">
                          <MapPin className="w-5 h-5 text-[#B8933F]" />
                          <button
                            type="button"
                            onClick={() => setActiveTab("addresses")}
                            className="text-[11px] text-[#B8933F] hover:underline font-medium"
                          >
                            Manage
                          </button>
                        </div>
                        <span className="text-xs text-[#767069] block">Default Address</span>
                        <span className="font-montserrat text-sm font-semibold text-[#1C1208] block mt-0.5 truncate">
                          {defaultAddress ? defaultAddress.street : "No address saved"}
                        </span>
                        <span className="text-[11px] text-[#A89F95] mt-1 block">
                          {defaultAddress
                            ? `${defaultAddress.city}, ${defaultAddress.pincode}`
                            : "Add an address"}
                        </span>
                      </div>

                      <div className="border border-[#EAE3D5] p-5 rounded-xs bg-[#FAF9F7]">
                        <div className="flex items-center justify-between mb-3">
                          <ShieldCheck className="w-5 h-5 text-[#B8933F]" />
                          <button
                            type="button"
                            onClick={() => setActiveTab("security")}
                            className="text-[11px] text-[#B8933F] hover:underline font-medium"
                          >
                            Settings
                          </button>
                        </div>
                        <span className="text-xs text-[#767069] block">Account Security</span>
                        <span
                          className={`font-montserrat text-sm font-semibold block mt-0.5 flex items-center gap-1 ${
                            twoFactorEnabled ? "text-[#2A9D8F]" : "text-[#767069]"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />{" "}
                          {twoFactorEnabled ? "2FA Active" : "2FA Disabled"}
                        </span>
                        <span className="text-[11px] text-[#A89F95] mt-1 block">
                          Protected via SMS OTP
                        </span>
                      </div>
                    </div>

                    {/* Concierge Assistance Banner */}
                    <div className="border border-[#EAE3D5] bg-white p-6 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                          Need Ring Resizing or Authenticity Verification?
                        </h4>
                        <p className="text-xs text-[#767069]">
                          Your dedicated luxury concierge is available 7 days a week for certified appraisals, custom engraving, and insured home visits.
                        </p>
                      </div>
                      <a
                        href="tel:+919820154321"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1C1208] hover:bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors whitespace-nowrap"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Concierge</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* ═════════ TAB 2: MY ORDERS & TRACKING ═════════ */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-montserrat text-2xl font-semibold text-[#1C1208]">
                        My Orders & Tracking
                      </h2>
                      <p className="text-xs text-[#767069] mt-1 font-light">
                        Track the live journey of your hallmarked jewellery, view invoices, and request certificates.
                      </p>
                    </div>

                    {orders.length === 0 ? (
                      <div className="border border-dashed border-[#DDD5C7] rounded-xs p-12 text-center bg-[#FAF9F7]">
                        <Package className="w-12 h-12 text-[#B8933F] mx-auto mb-3 opacity-60" />
                        <h3 className="font-montserrat text-base font-semibold text-[#1C1208]">
                          No Orders Found
                        </h3>
                        <p className="text-xs text-[#767069] mt-1 max-w-md mx-auto">
                          You haven't placed any certified jewellery orders yet. Discover our latest collections and enjoy insured white-glove delivery across India.
                        </p>
                        <Link
                          href="/women"
                          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-[#B8933F] hover:bg-[#A37E2E] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Explore Collections</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-[#EAE3D5] rounded-xs p-6 bg-white hover:border-[#B8933F]/40 transition-colors shadow-xs"
                          >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D5] pb-4 mb-5">
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className="font-montserrat text-base font-bold text-[#1C1208]">
                                    Order #{order.orderNumber || order.id}
                                  </h3>
                                  <span
                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-xs uppercase tracking-wider ${
                                      order.status === "In Transit"
                                        ? "bg-[#FAF6EE] text-[#B8933F] border border-[#B8933F]/30"
                                        : order.status === "Delivered"
                                        ? "bg-[#EBF7F2] text-[#2A9D8F] border border-[#2A9D8F]/30"
                                        : "bg-[#F3F4F6] text-[#4B5563] border border-[#D1D5DB]"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-[#767069] mt-1">
                                  Placed on {order.date} • Paid via {order.paymentMethod}
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <span className="text-[11px] text-[#767069] uppercase tracking-wider block">
                                  Order Total
                                </span>
                                <span className="font-montserrat text-lg font-bold text-[#1C1208]">
                                  {order.total}
                                </span>
                              </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4 mb-6">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="relative w-16 h-16 bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs flex-shrink-0 p-1">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      sizes="64px"
                                      className="object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-montserrat text-xs sm:text-sm font-semibold text-[#1C1208] truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-[11px] text-[#767069] mt-0.5 truncate">
                                      {item.specs}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-semibold text-[#B8933F]">
                                        {item.price}
                                      </span>
                                      <span className="text-[11px] text-[#A89F95]">
                                        Qty: {item.qty}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Note if present */}
                            {order.orderNote && (
                              <div className="bg-[#FAF6EC] p-3 rounded-xs border border-[#B8933F]/30 mb-5 text-xs">
                                <span className="font-semibold text-[#B8933F] block uppercase tracking-wider text-[10px] mb-0.5">
                                  Your Custom Order Note:
                                </span>
                                <p className="text-[#1C1208] italic">&ldquo;{order.orderNote}&rdquo;</p>
                              </div>
                            )}

                            {/* Tracking Timeline Bar */}
                            <div className="bg-[#FAF9F7] p-5 rounded-xs border border-[#EAE3D5] mb-5">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1208]">
                                  Delivery Progress
                                </span>
                                <span className="text-xs text-[#B8933F] font-medium">
                                  Tracking: {order.trackingNumber}
                                </span>
                              </div>

                              <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-4 gap-2 space-y-4 sm:space-y-0">
                                {order.trackingSteps.map((step, idx) => (
                                  <div key={idx} className="relative flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                          step.completed
                                            ? "bg-[#B8933F] text-white"
                                            : "bg-[#EAE3D5] text-[#767069]"
                                        } ${
                                          step.current
                                            ? "ring-4 ring-[#B8933F]/20 animate-pulse"
                                            : ""
                                        }`}
                                      >
                                        {step.completed ? (
                                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        ) : (
                                          <span>{idx + 1}</span>
                                        )}
                                      </div>
                                      <span className="text-xs font-medium text-[#1C1208] sm:hidden">
                                        {step.title}
                                      </span>
                                    </div>
                                    <div className="mt-2 hidden sm:block">
                                      <span className="text-xs font-semibold text-[#1C1208] block leading-tight">
                                        {step.title}
                                      </span>
                                      <span className="text-[10px] text-[#767069] mt-0.5 block">
                                        {step.date}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoiceOrder(order)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDD5C7] hover:border-[#B8933F] rounded-full text-xs font-semibold text-[#1C1208] hover:text-[#B8933F] transition-colors cursor-pointer shadow-none active:scale-95"
                                >
                                  <Download className="w-3.5 h-3.5 text-[#B8933F]" />
                                  <span>Download Tax Invoice (PDF)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast("IGI Diamond Certificate requested. Sent to your email.")
                                  }
                                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDD5C7] rounded-xs text-xs font-medium text-[#1C1208] hover:border-[#B8933F] hover:text-[#B8933F] transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>IGI Certificate</span>
                                </button>
                              </div>

                              <Link
                                href="/women"
                                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#B8933F] hover:bg-[#A37E2E] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Shop More Designs</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ═════════ TAB 3: EDIT PERSONAL INFO ═════════ */}
                {activeTab === "edit-profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-montserrat text-2xl font-semibold text-[#1C1208]">
                        Personal Information
                      </h2>
                      <p className="text-xs text-[#767069] mt-1 font-light">
                        Update your personal contact details, anniversary dates, and communication preferences.
                      </p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* First Name */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            First Name <span className="text-[#C38B75]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile({ ...profile, firstName: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                          />
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            Last Name <span className="text-[#C38B75]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile({ ...profile, lastName: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            Email Address <span className="text-[#C38B75]">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              disabled
                              value={profile.email}
                              className="w-full px-3.5 py-2.5 bg-[#F0EDE8] border border-[#DDD5C7] rounded-xs text-xs text-[#6E675F] cursor-not-allowed"
                            />
                            {profile.isVerified ? (
                              <span className="absolute right-3 top-2.5 text-[10px] text-[#2A9D8F] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="absolute right-3 top-2.5 text-[10px] text-[#D9534F] font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> Unverified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#A89F95] mt-1 block">
                            Primary registered login email
                          </span>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            Mobile Number <span className="text-[#C38B75]">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={profile.phone}
                              onChange={(e) =>
                                setProfile({ ...profile, phone: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                            />
                            {profile.phone ? (
                              <span className="absolute right-3 top-2.5 text-[10px] text-[#2A9D8F] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                              </span>
                            ) : (
                              <span className="absolute right-3 top-2.5 text-[10px] text-[#A89F95] font-normal flex items-center gap-1">
                                Optional
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            Date of Birth
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={profile.dob}
                            onChange={(e) =>
                              setProfile({ ...profile, dob: formatAutoDate(e.target.value, profile.dob) })
                            }
                            placeholder="DOB (DD / MM / YYYY)"
                            maxLength={14}
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] placeholder:text-[#A89F95] focus:outline-none focus:border-[#B8933F]"
                          />
                          <span className="text-[10px] text-[#A89F95] mt-1 block">
                            Receive exclusive 15% birthday anniversary perks
                          </span>
                        </div>

                        {/* Wedding Anniversary */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            Wedding / Milestone Anniversary
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={profile.anniversary}
                            onChange={(e) =>
                              setProfile({ ...profile, anniversary: formatAutoDate(e.target.value, profile.anniversary) })
                            }
                            placeholder="Anniversary (DD / MM / YYYY)"
                            maxLength={14}
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] placeholder:text-[#A89F95] focus:outline-none focus:border-[#B8933F]"
                          />
                          <span className="text-[10px] text-[#A89F95] mt-1 block">
                            Complimentary gift upgrade on your special date
                          </span>
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1.5">
                            Gender
                          </label>
                          <select
                            value={profile.gender}
                            onChange={(e) =>
                              setProfile({ ...profile, gender: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208] focus:outline-none focus:border-[#B8933F]"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other / Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      {/* Notification Checkboxes */}
                      <div className="pt-4 border-t border-[#EAE3D5] space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1208]">
                          Notification Preferences
                        </h4>

                        <label className="flex items-center gap-2.5 text-xs text-[#6E675F] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.whatsappUpdates}
                            onChange={(e) =>
                              setProfile({ ...profile, whatsappUpdates: e.target.checked })
                            }
                            className="accent-[#B8933F] w-4 h-4"
                          />
                          <span>Receive real-time order tracking and dispatch alerts on WhatsApp</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-[#6E675F] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.smsAlerts}
                            onChange={(e) =>
                              setProfile({ ...profile, smsAlerts: e.target.checked })
                            }
                            className="accent-[#B8933F] w-4 h-4"
                          />
                          <span>Receive SMS OTP security notifications for transactions</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-[#6E675F] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.catalogNewsletter}
                            onChange={(e) =>
                              setProfile({ ...profile, catalogNewsletter: e.target.checked })
                            }
                            className="accent-[#B8933F] w-4 h-4"
                          />
                          <span>Subscribe to the private quarterly ZHAEVAAH lookbook and festive preview</span>
                        </label>
                      </div>

                      <div className="pt-4 flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-8 py-3 bg-[#B8933F] hover:bg-[#A37E2E] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors shadow-xs active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
                        >
                          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>Save Profile Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ═════════ TAB 4: SAVED ADDRESSES ═════════ */}
                {activeTab === "addresses" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-montserrat text-2xl font-semibold text-[#1C1208]">
                          Saved Addresses
                        </h2>
                        <p className="text-xs text-[#767069] mt-1 font-light">
                          Manage your primary delivery locations for insured jewellery shipments across India.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressId(null);
                          setNewAddress({
                            type: "Home",
                            name: `${profile.firstName} ${profile.lastName}`.trim(),
                            phone: profile.phone,
                            street: "",
                            locality: "",
                            city: "Mumbai",
                            state: "Maharashtra",
                            pincode: "",
                            isDefault: addresses.length === 0,
                          });
                          setIsAddressModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1208] hover:bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Address</span>
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="border border-dashed border-[#DDD5C7] rounded-xs p-10 text-center bg-[#FAF9F7]">
                        <MapPin className="w-10 h-10 text-[#B8933F] mx-auto mb-2 opacity-60" />
                        <h4 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                          No Saved Addresses
                        </h4>
                        <p className="text-xs text-[#767069] mt-1">
                          You haven't saved any delivery destinations yet. Add an address for rapid, one-click checkout.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`border p-6 rounded-xs bg-white relative flex flex-col justify-between ${
                              addr.isDefault
                                ? "border-[#B8933F] shadow-xs"
                                : "border-[#EAE3D5]"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[#1C1208] uppercase tracking-wider">
                                    {addr.type}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="px-2 py-0.5 bg-[#FAF6EE] text-[#B8933F] text-[10px] font-semibold uppercase tracking-wider rounded-xs border border-[#B8933F]/30">
                                      Default Delivery
                                    </span>
                                  )}
                                </div>
                              </div>

                              <h4 className="font-montserrat text-sm font-semibold text-[#1C1208]">
                                {addr.name}
                              </h4>
                              <p className="text-xs text-[#6E675F] mt-2 leading-relaxed">
                                {addr.street}
                                {addr.locality ? `, ${addr.locality}` : ""}
                                <br />
                                {addr.city}, {addr.state} –{" "}
                                <strong className="text-[#1C1208]">{addr.pincode}</strong>
                              </p>
                              <p className="text-xs text-[#767069] mt-2 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-[#B8933F]" />
                                <span>{addr.phone}</span>
                              </p>
                            </div>

                            <div className="pt-5 border-t border-[#f2ede6] mt-5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAddressId(addr.id);
                                    setNewAddress({
                                      type: addr.type,
                                      name: addr.name,
                                      phone: addr.phone,
                                      street: addr.street,
                                      locality: addr.locality || "",
                                      city: addr.city,
                                      state: addr.state,
                                      pincode: addr.pincode,
                                      isDefault: addr.isDefault,
                                    });
                                    setIsAddressModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-xs text-[#767069] hover:text-[#B8933F] font-medium"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="inline-flex items-center gap-1 text-xs text-[#C38B75] hover:text-red-700 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>

                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-xs text-[#B8933F] hover:underline font-semibold"
                                >
                                  Set as Default
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add/Edit Address Modal */}
                    {isAddressModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <div className="bg-white max-w-lg w-full rounded-xs shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
                          <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-4 mb-5">
                            <h3 className="font-montserrat text-lg font-bold text-[#1C1208]">
                              {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                            </h3>
                            <button
                              type="button"
                              onClick={() => setIsAddressModalOpen(false)}
                              className="p-1 text-[#767069] hover:text-black"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                            {/* Address Type */}
                            <div>
                              <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                Address Tag
                              </label>
                              <div className="flex items-center gap-3">
                                {(["Home", "Office", "Other"] as const).map((t) => (
                                  <label
                                    key={t}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xs cursor-pointer ${
                                      newAddress.type === t
                                        ? "bg-[#FAF6EE] border-[#B8933F] text-[#B8933F] font-semibold"
                                        : "border-[#DDD5C7] text-[#6E675F]"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="addrType"
                                      checked={newAddress.type === t}
                                      onChange={() => setNewAddress({ ...newAddress, type: t })}
                                      className="hidden"
                                    />
                                    <span>{t}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Name & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                  Recipient Full Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={newAddress.name}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                                />
                              </div>
                              <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                  Mobile Number *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={newAddress.phone}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, phone: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                                />
                              </div>
                            </div>

                            {/* Flat / Building / Street */}
                            <div>
                              <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                Flat, Building, Street Address *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Flat 1402, Tower B, Oberoi Sky Heights"
                                value={newAddress.street}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, street: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                              />
                            </div>

                            {/* Locality / Area */}
                            <div>
                              <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                Area, Sector, Locality
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Lokhandwala Complex, Andheri West"
                                value={newAddress.locality}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, locality: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                              />
                            </div>

                            {/* City, State, Pincode */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                  City *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={newAddress.city}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, city: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                  State *
                                </label>
                                <select
                                  value={newAddress.state}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, state: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                                >
                                  {INDIAN_STATES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                                  Pincode *
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength={6}
                                  placeholder="6 digits"
                                  value={newAddress.pincode}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, pincode: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs"
                                />
                              </div>
                            </div>

                            <label className="flex items-center gap-2 pt-2 cursor-pointer text-[#6E675F]">
                              <input
                                type="checkbox"
                                checked={newAddress.isDefault}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                                }
                                className="accent-[#B8933F] w-4 h-4"
                              />
                              <span>Make this my default delivery address</span>
                            </label>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EAE3D5]">
                              <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(false)}
                                className="px-4 py-2 border border-[#DDD5C7] rounded-xs uppercase tracking-wider text-[#767069]"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2 bg-[#B8933F] text-white rounded-xs uppercase tracking-wider font-semibold hover:bg-[#A37E2E]"
                              >
                                Save Address
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ═════════ TAB 6: PRIVILEGE CLUB ═════════ */}
                {activeTab === "privilege" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-montserrat text-2xl font-semibold text-[#1C1208]">
                        ZHAEVAAH Privilege Club
                      </h2>
                      <p className="text-xs text-[#767069] mt-1 font-light">
                        Exclusive tier privileges, bespoke jewellery concierge access, and anniversary rewards.
                      </p>
                    </div>

                    {/* Tier Card */}
                    <div className="bg-gradient-to-r from-[#1C1208] via-[#2F2113] to-[#1C1208] border border-[#B8933F] text-white p-8 rounded-xs shadow-md relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
                        <Crown className="w-64 h-64 text-[#B8933F]" />
                      </div>

                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Crown className="w-6 h-6 text-[#B8933F]" />
                            <span className="text-sm uppercase tracking-[0.2em] font-semibold text-[#B8933F]">
                              {profile.tier}
                            </span>
                          </div>
                          <span className="text-xs px-3 py-1 bg-[#B8933F]/20 text-[#B8933F] border border-[#B8933F]/40 rounded-xs font-semibold">
                            Active Membership
                          </span>
                        </div>

                        <div>
                          <span className="text-xs text-[#A89F95] block">
                            Available Reward Points Balance
                          </span>
                          <span className="font-montserrat text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            {availablePoints.toLocaleString("en-IN")} Points
                          </span>
                          <span className="text-xs text-[#B8933F] block mt-1">
                            1 Point = ₹1.00 • Redeemable on any online or salon purchase
                          </span>
                        </div>

                        {/* Progress to Platinum */}
                        <div className="pt-3">
                          <div className="flex items-center justify-between text-xs text-[#DDD5C7] mb-1.5">
                            <span>Progress to Platinum Tier</span>
                            <span>
                              ₹{totalSpent.toLocaleString("en-IN")} / ₹1,00,000 spent
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#B8933F] rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.round((totalSpent / 100000) * 100))}%`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] text-[#A89F95] mt-1 block">
                            {totalSpent >= 100000
                              ? "Congratulations! You have reached Platinum Tier privileges."
                              : `Spend ₹${(100000 - totalSpent).toLocaleString(
                                  "en-IN"
                                )} more this fiscal year to unlock lifetime Platinum perks`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Benefits Grid */}
                    <div className="space-y-4 pt-4">
                      <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                        Your Included Gold Privileges
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            title: "Complimentary Annual Diamond Polishing",
                            desc: "Send up to 3 ZHAEVAAH rings each year for free deep sonic cleaning and claw inspection.",
                          },
                          {
                            title: "Priority Air Express Delivery",
                            desc: "100% insured courier transit across India dispatched within 24 hours of hallmark inspection.",
                          },
                          {
                            title: "Private Festive Collections Preview",
                            desc: "72-hour early access to Akshaya Tritiya, Diwali, and Wedding seasonal collections.",
                          },
                          {
                            title: "Bespoke Master Jeweller Hotline",
                            desc: "Direct tele-consultation with our lead gemologist for custom cuts and certifications.",
                          },
                        ].map((b, i) => (
                          <div
                            key={i}
                            className="p-4 border border-[#EAE3D5] rounded-xs bg-[#FAF9F7] space-y-1.5"
                          >
                            <h4 className="font-montserrat text-xs font-bold text-[#1C1208] flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-[#B8933F]" />
                              <span>{b.title}</span>
                            </h4>
                            <p className="text-xs text-[#6E675F] leading-relaxed">
                              {b.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═════════ TAB 7: SECURITY & PASSWORD ═════════ */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-montserrat text-2xl font-semibold text-[#1C1208]">
                        Security & Password
                      </h2>
                      <p className="text-xs text-[#767069] mt-1 font-light">
                        Manage your credentials, 2-factor authentication, and connected device sessions.
                      </p>
                    </div>

                    {/* 2FA Toggle Card */}
                    <div className="border border-[#EAE3D5] bg-[#FAF9F7] p-5 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#2A9D8F]" />
                          <h4 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                            Two-Factor Authentication (2FA)
                          </h4>
                        </div>
                        <p className="text-xs text-[#767069]">
                          Require a 6-digit SMS verification code to your registered phone (
                          {profile.phone ? `${profile.phone.slice(0, 6)}•••••` : "+91 •••••"}
                          ) on every login and checkout above ₹50,000.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggle2FA}
                        className={`px-4 py-2 rounded-xs text-xs uppercase font-semibold tracking-wider transition-colors whitespace-nowrap ${
                          twoFactorEnabled
                            ? "bg-[#2A9D8F] text-white"
                            : "bg-[#DDD5C7] text-[#1C1208]"
                        }`}
                      >
                        {twoFactorEnabled ? "2FA Enabled" : "Enable 2FA"}
                      </button>
                    </div>

                    {/* Password Form */}
                    <form
                      onSubmit={handlePasswordUpdate}
                      className="space-y-4 pt-4 border-t border-[#EAE3D5]"
                    >
                      <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                        Update Password
                      </h3>

                      <div className="space-y-3 max-w-md">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            placeholder="Leave blank if using Google Sign-In"
                            value={passwords.currentPassword}
                            onChange={(e) =>
                              setPasswords({ ...passwords, currentPassword: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                            New Password *
                          </label>
                          <input
                            type="password"
                            required
                            minLength={8}
                            value={passwords.newPassword}
                            onChange={(e) =>
                              setPasswords({ ...passwords, newPassword: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208]"
                          />
                          <span className="text-[10px] text-[#767069] mt-0.5 block">
                            Must contain at least 8 characters
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1208] mb-1">
                            Confirm New Password *
                          </label>
                          <input
                            type="password"
                            required
                            minLength={8}
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                              setPasswords({ ...passwords, confirmPassword: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#DDD5C7] rounded-xs text-xs text-[#1C1208]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1C1208] hover:bg-[#B8933F] text-white text-xs uppercase font-medium tracking-wider rounded-xs transition-colors"
                      >
                        Update Password
                      </button>
                    </form>

                    {/* Active Sessions */}
                    <div className="pt-6 border-t border-[#EAE3D5] space-y-3">
                      <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-[#1C1208]">
                        Active Sessions
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-[#FAF9F7] border border-[#EAE3D5] rounded-xs text-xs">
                          <div>
                            <span className="font-semibold text-[#1C1208] block">
                              Active Web Browser Session
                            </span>
                            <span className="text-[11px] text-[#2A9D8F]">
                              Current Session • Active Now
                            </span>
                          </div>
                          <span className="text-[11px] text-[#767069]">
                            {typeof window !== "undefined" ? window.navigator.userAgent.slice(0, 30) : "Browser"}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Official Tax Invoice & Certification Modal */}
      <OrderInvoiceModal
        order={selectedInvoiceOrder}
        user={storeUser || profile}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}

export default function UserProfileView() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1360px] mx-auto px-4 py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#B8933F] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest text-[#767069]">
            Loading Your Account Details...
          </p>
        </div>
      }
    >
      <ProfileContentInner />
    </Suspense>
  );
}

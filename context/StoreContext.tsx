"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addToCart as reduxAddToCart,
  removeFromCart as reduxRemoveFromCart,
  updateQuantity as reduxUpdateQuantity,
  setCartOpen as reduxSetCartOpen,
  clearCart as reduxClearCart,
} from "../redux/slices/cartSlice";
import { toggleWishlist as reduxToggleWishlist } from "../redux/slices/wishlistSlice";
import {
  logoutUser as reduxLogoutUser,
  setUser as reduxSetUser,
  clearAuth as reduxClearAuth,
} from "../redux/slices/authSlice";

export interface ProductVariantConfig {
  enablePurity?: boolean;
  purityLabel?: string;
  enableSize?: boolean;
  sizeLabel?: string;
  enableColor?: boolean;
  colorLabel?: string;
  enableShape?: boolean;
  shapeLabel?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  sizeLabel?: string;
  selectedColor?: string;
  colorLabel?: string;
  selectedShape?: string;
  shapeLabel?: string;
  selectedPurity?: string;
  purityLabel?: string;
}

export interface Product {
  id: string;
  slug?: string;
  title: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  compareAtPrice?: string;
  discountBadge?: string;
  stock?: number;
  brand?: string;
  rating: number;
  reviewsCount?: number;
  primaryImage: string;
  hoverImage: string;
  additionalImages?: string[];
  category: string;
  gender?: "men" | "women" | "unisex" | string;
  metal?: string;
  gemstone?: string;
  description?: string;
  isAvailable?: boolean;
  stoneColors?: { name: string; hex: string; image?: string }[];
  stoneShapes?: { name: string; shapeId: string }[];
  ringSizes?: string[];
  sizes?: string[];
  purityOptions?: string[];
  variantConfig?: ProductVariantConfig;
  specifications?: { label: string; value: string }[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  picture?: string;
  image?: string;
  role?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  anniversary?: string;
  whatsappUpdates?: boolean;
  smsAlerts?: boolean;
  catalogNewsletter?: boolean;
  loyaltyPoints?: number;
  tier?: string;
  vipTier?: string;
  twoFactorEnabled?: boolean;
  isVerified?: boolean;
  savedPaymentMethods?: any;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  toastMessage: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string,
    selectedShape?: string,
    selectedPurity?: string,
    variantLabels?: {
      sizeLabel?: string;
      colorLabel?: string;
      shapeLabel?: string;
      purityLabel?: string;
    }
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  showToast: (msg: string) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const isCartOpen = useAppSelector((state) => state.cart.isOpen);
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const setIsCartOpen = (open: boolean) => {
    dispatch(reduxSetCartOpen(open));
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize = "14",
    selectedColor?: string,
    selectedShape?: string,
    selectedPurity?: string,
    variantLabels?: {
      sizeLabel?: string;
      colorLabel?: string;
      shapeLabel?: string;
      purityLabel?: string;
    }
  ) => {
    dispatch(
      reduxAddToCart({
        product,
        quantity,
        selectedSize,
        selectedColor,
        selectedShape,
        selectedPurity,
        sizeLabel: variantLabels?.sizeLabel,
        colorLabel: variantLabels?.colorLabel,
        shapeLabel: variantLabels?.shapeLabel,
        purityLabel: variantLabels?.purityLabel,
      })
    );
    showToast(`Added "${product.title}" to your shopping bag.`);
  };

  const removeFromCart = (id: string) => {
    dispatch(reduxRemoveFromCart(id));
  };

  const updateQuantity = (id: string, delta: number) => {
    dispatch(reduxUpdateQuantity({ id, delta }));
  };

  const clearCart = () => {
    dispatch(reduxClearCart());
  };

  const toggleWishlist = (id: string) => {
    const exists = wishlist.includes(id);
    dispatch(reduxToggleWishlist(id));
    if (exists) {
      showToast("Removed from your wishlist");
    } else {
      showToast("Saved to your wishlist");
    }
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const logout = () => {
    dispatch(reduxClearAuth());
    showToast("Signed out successfully");
  };

  const setUser = (user: UserProfile | null) => {
    dispatch(reduxSetUser(user));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.priceNum * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        isSearchOpen,
        quickViewProduct,
        toastMessage,
        user,
        isLoggedIn,
        setUser,
        logout,
        setIsCartOpen,
        setIsSearchOpen,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        showToast,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

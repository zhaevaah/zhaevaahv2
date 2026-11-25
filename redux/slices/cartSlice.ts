import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../context/StoreContext";

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const getInitialCart = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("zhaevaah_cart");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return [
    {
      id: "prod-1",
      title: "Real Diamond Jewellery Gold Diamond Ring",
      price: "₹24,999",
      priceNum: 24999,
      image: "/images/product_1_main.png",
      quantity: 1,
      selectedSize: "14",
    },
  ];
};

const initialState: CartState = {
  items: getInitialCart(),
  isOpen: false,
};

const persistCart = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("zhaevaah_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        selectedSize?: string;
        selectedColor?: string;
        selectedShape?: string;
        selectedPurity?: string;
        sizeLabel?: string;
        colorLabel?: string;
        shapeLabel?: string;
        purityLabel?: string;
      }>
    ) => {
      const {
        product,
        quantity = 1,
        selectedSize = "14",
        selectedColor,
        selectedShape,
        selectedPurity,
        sizeLabel,
        colorLabel,
        shapeLabel,
        purityLabel,
      } = action.payload;

      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor &&
          item.selectedPurity === selectedPurity &&
          item.selectedShape === selectedShape
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          priceNum: product.priceNum,
          image: product.primaryImage,
          quantity,
          selectedSize,
          sizeLabel,
          selectedColor,
          colorLabel,
          selectedShape,
          shapeLabel,
          selectedPurity,
          purityLabel,
        });
      }
      persistCart(state.items);
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistCart(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; delta: number }>
    ) => {
      const { id, delta } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const newQty = item.quantity + delta;
        if (newQty > 0) {
          item.quantity = newQty;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
        persistCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      persistCart(state.items);
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      persistCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;

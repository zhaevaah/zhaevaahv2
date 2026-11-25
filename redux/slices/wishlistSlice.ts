import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
  items: string[];
}

const getInitialWishlist = (): string[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("zhaevaah_wishlist");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return ["prod-1", "prod-2", "prod-4"];
};

const initialState: WishlistState = {
  items: getInitialWishlist(),
};

const persistWishlist = (items: string[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("zhaevaah_wishlist", JSON.stringify(items));
    } catch {
      // ignore
    }
  }
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.items.indexOf(id);
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(id);
      }
      persistWishlist(state.items);
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
      persistWishlist(state.items);
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

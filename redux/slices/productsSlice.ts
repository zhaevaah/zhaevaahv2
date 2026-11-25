import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiGetProducts,
  apiGetMensProducts,
  apiGetWomensProducts,
  apiGetProduct,
  apiGetCategories,
  apiGetRelatedProducts,
} from "../../lib/api";
import {
  CatalogProduct,
  DetailedProduct,
} from "../../data/products";

export interface ProductsState {
  items: CatalogProduct[];
  womensItems: CatalogProduct[];
  mensItems: CatalogProduct[];
  currentProduct: DetailedProduct | CatalogProduct | null;
  relatedProducts: CatalogProduct[];
  categories: {
    id?: string;
    name: string;
    slug?: string;
    count?: number;
    image?: string;
    badge?: string;
    gender?: string;
    itemCount?: string;
  }[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  womensItems: [],
  mensItems: [],
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  status: "idle",
  error: null,
};

// Async Thunks calling centralized API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: Parameters<typeof apiGetProducts>[0] = {}) => {
    const res = await apiGetProducts(params);
    if (res.success && Array.isArray(res.products)) {
      return res.products as CatalogProduct[];
    }
    return [];
  }
);

export const fetchWomensProducts = createAsyncThunk(
  "products/fetchWomensProducts",
  async (params: Parameters<typeof apiGetWomensProducts>[0] = {}) => {
    const res = await apiGetWomensProducts(params);
    if (res.success && Array.isArray(res.products)) {
      return res.products as CatalogProduct[];
    }
    return [];
  }
);

export const fetchMensProducts = createAsyncThunk(
  "products/fetchMensProducts",
  async (params: Parameters<typeof apiGetMensProducts>[0] = {}) => {
    const res = await apiGetMensProducts(params);
    if (res.success && Array.isArray(res.products)) {
      return res.products as CatalogProduct[];
    }
    return [];
  }
);

export const fetchProductBySlugOrId = createAsyncThunk(
  "products/fetchProductBySlugOrId",
  async (idOrSlug: string) => {
    const res = await apiGetProduct(idOrSlug);
    if (res.success && res.product) {
      return res.product as DetailedProduct;
    }
    return null;
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (idOrSlug: string) => {
    const res = await apiGetRelatedProducts(idOrSlug);
    if (res.success && Array.isArray(res.related)) {
      return res.related as CatalogProduct[];
    }
    return [];
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (gender?: string) => {
    const res = await apiGetCategories(gender);
    if (res.success && Array.isArray(res.categories)) {
      return res.categories;
    }
    return [];
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentProduct: (
      state,
      action: PayloadAction<DetailedProduct | CatalogProduct | null>
    ) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load products";
      })
      // fetchWomensProducts
      .addCase(fetchWomensProducts.fulfilled, (state, action) => {
        state.womensItems = action.payload;
      })
      // fetchMensProducts
      .addCase(fetchMensProducts.fulfilled, (state, action) => {
        state.mensItems = action.payload;
      })
      // fetchProductBySlugOrId
      .addCase(fetchProductBySlugOrId.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      // fetchRelatedProducts
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      // fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;

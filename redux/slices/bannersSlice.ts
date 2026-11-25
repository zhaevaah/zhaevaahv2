import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetBanners } from "../../lib/api";

export interface BannersState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BannersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (type?: string) => {
    const res = await apiGetBanners(type);
    if (res.success && Array.isArray(res.banners)) {
      return res.banners;
    }
    return [];
  }
);

export const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load banners";
      });
  },
});

export default bannersSlice.reducer;

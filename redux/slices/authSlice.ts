import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiLogin,
  apiRegister,
  apiGoogleLogin,
  apiLogout,
  apiGetMe,
} from "../../lib/api";
import { UserProfile } from "../../context/StoreContext";

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("zhaevaah_token");
      if (token === "demo-token-12345") {
        localStorage.removeItem("zhaevaah_token");
        localStorage.removeItem("zhaevaah_user");
        return null;
      }
      return token;
    } catch {
      // ignore
    }
  }
  return null;
};

const getInitialUser = (): UserProfile | null => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("zhaevaah_token");
      if (!token || token === "demo-token-12345") {
        localStorage.removeItem("zhaevaah_token");
        localStorage.removeItem("zhaevaah_user");
        return null;
      }
      const stored = localStorage.getItem("zhaevaah_user");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialUser(),
  status: "idle",
  error: null,
};

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await apiLogin(email, password);
    if (!res.success) {
      throw new Error(res.message || "Login failed");
    }
    return { user: res.user, token: res.token };
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const res = await apiRegister(userData);
    if (!res.success) {
      throw new Error(res.message || "Registration failed");
    }
    return { user: res.user, token: res.token };
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (credential: string) => {
    const res = await apiGoogleLogin(credential);
    if (!res.success) {
      throw new Error(res.message || "Google sign-in failed");
    }
    return { user: res.user, token: res.token };
  }
);

export const checkCurrentUser = createAsyncThunk("auth/checkCurrentUser", async () => {
  const res = await apiGetMe();
  if (res.success && res.user) {
    return res.user as UserProfile;
  }
  return null;
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await apiLogout();
  return null;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("zhaevaah_user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("zhaevaah_user");
        }
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("zhaevaah_token");
        localStorage.removeItem("zhaevaah_user");
        window.dispatchEvent(new Event("zhaevaah-auth-changed"));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // loginWithEmail
      .addCase(loginWithEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })
      // registerWithEmail
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      // loginWithGoogle
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      // checkCurrentUser
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

// Helper to make API requests with credentials and token
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network request failed. Ensure backend is running.",
    };
  }
}

// ==========================================
// 1. AUTHENTICATION & GOOGLE LOGIN
// ==========================================

export const apiGoogleLogin = async (credential: string) => {
  const res = await request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  if (res.success && res.token) {
    localStorage.setItem("zhaevaah_token", res.token);
    localStorage.setItem("zhaevaah_user", JSON.stringify(res.user));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zhaevaah-auth-changed"));
    }
  }
  return res;
};

export const apiLogin = async (email: string, password: string) => {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.success && res.token) {
    localStorage.setItem("zhaevaah_token", res.token);
    localStorage.setItem("zhaevaah_user", JSON.stringify(res.user));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zhaevaah-auth-changed"));
    }
  }
  return res;
};

export const apiRegister = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}) => {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  if (res.success && res.token) {
    localStorage.setItem("zhaevaah_token", res.token);
    localStorage.setItem("zhaevaah_user", JSON.stringify(res.user));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zhaevaah-auth-changed"));
    }
  }
  return res;
};

export const apiCompleteProfile = async (data: {
  email?: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}) => {
  const res = await request("/auth/complete-profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.success && res.user) {
    localStorage.setItem("zhaevaah_user", JSON.stringify(res.user));
    if (res.token) {
      localStorage.setItem("zhaevaah_token", res.token);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zhaevaah-auth-changed"));
    }
  }
  return res;
};

export const apiVerifyRegistrationOtp = async (data: { email: string; otp: string }) => {
  const res = await request("/auth/verify-registration-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.success && res.token) {
    localStorage.setItem("zhaevaah_token", res.token);
    localStorage.setItem("zhaevaah_user", JSON.stringify(res.user));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zhaevaah-auth-changed"));
    }
  }
  return res;
};

export const apiVerifyLoginOtp = async (data: { email: string; otp: string }) => {
  const res = await request("/auth/verify-login-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.success && res.token) {
    localStorage.setItem("zhaevaah_token", res.token);
    localStorage.setItem("zhaevaah_user", JSON.stringify(res.user));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zhaevaah-auth-changed"));
    }
  }
  return res;
};

export const apiResendLoginOtp = async (email: string) => {
  return request("/auth/resend-login-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const apiResendVerificationOtp = async (email: string) => {
  return request("/auth/resend-verification-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const apiForgotPassword = async (email: string) => {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const apiVerifyResetOtp = async (data: { email: string; otp: string }) => {
  return request("/auth/verify-reset-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const apiResetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const apiGetMe = async () => {
  return request("/auth/me");
};

export const apiLogout = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("zhaevaah_token");
    localStorage.removeItem("zhaevaah_user");
    window.dispatchEvent(new Event("zhaevaah-auth-changed"));
  }
  return request("/auth/logout", { method: "POST" });
};

// ==========================================
// 2. USER PROFILE & ADDRESSES
// ==========================================

export const apiGetProfile = async () => {
  return request("/users/profile");
};

export const apiUpdateProfile = async (profileData: any) => {
  return request("/users/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const apiChangePassword = async (passwords: {
  currentPassword?: string;
  newPassword: string;
}) => {
  return request("/users/change-password", {
    method: "POST",
    body: JSON.stringify(passwords),
  });
};

export const apiGetAddresses = async () => {
  return request("/users/addresses");
};

export const apiCreateAddress = async (addressData: any) => {
  return request("/users/addresses", {
    method: "POST",
    body: JSON.stringify(addressData),
  });
};

export const apiUpdateAddress = async (id: string, addressData: any) => {
  return request(`/users/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(addressData),
  });
};

export const apiDeleteAddress = async (id: string) => {
  return request(`/users/addresses/${id}`, {
    method: "DELETE",
  });
};

// ==========================================
// 3. PRODUCTS & CATALOG
// ==========================================

export const apiGetProducts = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  metal?: string;
  gemstone?: string;
  sort?: string;
  q?: string;
} = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.gender) query.set("gender", params.gender);
  if (params.minPrice) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice) query.set("maxPrice", String(params.maxPrice));
  if (params.rating) query.set("rating", String(params.rating));
  if (params.metal) query.set("metal", params.metal);
  if (params.gemstone) query.set("gemstone", params.gemstone);
  if (params.sort) query.set("sort", params.sort);
  if (params.q) query.set("q", params.q);

  return request(`/products?${query.toString()}`);
};

export const apiGetMensProducts = async (params: Parameters<typeof apiGetProducts>[0] = {}) => {
  return apiGetProducts({ ...params, gender: "men" });
};

export const apiGetWomensProducts = async (params: Parameters<typeof apiGetProducts>[0] = {}) => {
  return apiGetProducts({ ...params, gender: "women" });
};

export const apiGetProduct = async (idOrSlug: string) => {
  return request(`/products/${idOrSlug}`);
};

export const apiGetRelatedProducts = async (idOrSlug: string) => {
  return request(`/products/${idOrSlug}/related`);
};

export const apiGetCategories = async (gender?: string) => {
  const query = gender ? `?gender=${encodeURIComponent(gender)}` : "";
  return request(`/products/categories${query}`);
};

// ==========================================
// 4. BANNERS & ADS
// ==========================================

export const apiGetBanners = async (type?: string) => {
  const query = type ? `?type=${type}` : "";
  return request(`/banners${query}`);
};

// ==========================================
// 5. RAZORPAY PAYMENT & ORDERS
// ==========================================

export const apiCreateRazorpayOrder = async (amount: number) => {
  return request("/orders/razorpay/create", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
};

export const apiPlaceOrder = async (orderData: {
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  items: any[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  shippingFee?: number;
  totalAmount: number;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  giftPackaging?: boolean;
  giftNote?: string;
}) => {
  return request("/orders/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const apiGetMyOrders = async () => {
  return request("/orders/my-orders");
};

export const apiGetOrder = async (idOrNumber: string) => {
  return request(`/orders/${idOrNumber}`);
};

export const apiCheckPaymentStatus = async (idOrNumber: string, razorpayOrderId?: string) => {
  const query = razorpayOrderId ? `?razorpayOrderId=${encodeURIComponent(razorpayOrderId)}` : "";
  return request(`/orders/payment-status/${encodeURIComponent(idOrNumber)}${query}`);
};

export const apiGetWebhookInfo = async () => {
  return request("/webhook/razorpay");
};

// ==========================================
// 6. IMAGEKIT UPLOAD & WEBP OPTIMIZATION
// ==========================================

export const apiUploadImage = async (file: File, folder = "/zhaevaah/products") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const token = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers,
      body: formData,
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to upload and optimize image to ImageKit.",
    };
  }
};

export const apiUploadImages = async (files: File[], folder = "/zhaevaah/products") => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("folder", folder);

  const token = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}/upload/images`, {
      method: "POST",
      headers,
      body: formData,
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to upload and optimize images.",
    };
  }
};

export const apiDeleteImage = async (fileId: string) => {
  return request(`/upload/${fileId}`, { method: "DELETE" });
};



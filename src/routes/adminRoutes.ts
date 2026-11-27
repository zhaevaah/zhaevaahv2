import { Router } from "express";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getAdminOrders,
  updateOrderStatus,
  updateOrderTracking,
  getAdminUsers,
  getAdminUserDetails,
  updateAdminUser,
  getAdminAuditLogs,
  getAdminTransactions,
  getAdminAnalytics,
  getAdminSettings,
  updateAdminOrderMailSettings,
  sendTestEmail,
} from "../controllers/adminController";
import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// Protect all admin routes
router.use(protect, adminOnly);

// Analytics
router.get("/analytics", getAdminAnalytics);

// Product Management
router.get("/products", getAdminProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories Management (Front-end menu sync)
router.get("/categories", getAdminCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Banner & Ads Management
router.get("/banners", getAdminBanners);
router.post("/banners", createBanner);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

// Coupon & Voucher Management
router.get("/coupons", getAdminCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Order & Tracking Management
router.get("/orders", getAdminOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/tracking", updateOrderTracking);

// Users List & Profile Management
router.get("/users", getAdminUsers);
router.get("/users/:id", getAdminUserDetails);
router.put("/users/:id", updateAdminUser);

// Audit Logs & Transactions
router.get("/audit-logs", getAdminAuditLogs);
router.get("/transactions", getAdminTransactions);

// Store Settings & Order Email Receivers
router.get("/settings", getAdminSettings);
router.put("/settings/order-mail", updateAdminOrderMailSettings);
router.post("/settings/test-email", sendTestEmail);

export default router;

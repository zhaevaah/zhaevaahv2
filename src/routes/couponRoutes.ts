import { Router } from "express";
import {
  getCoupons,
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController";

const router = Router();

// Public routes
router.get("/", getCoupons);
router.post("/validate", validateCoupon);

// Admin / Management routes (supports both direct API and panel)
router.get("/admin", getAdminCoupons);
router.post("/admin", createCoupon);
router.put("/admin/:id", updateCoupon);
router.delete("/admin/:id", deleteCoupon);

export default router;

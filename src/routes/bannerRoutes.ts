import { Router } from "express";
import {
  getBanners,
  createBannerDirect,
  deleteBannerDirect,
} from "../controllers/bannerController";

const router = Router();

router.get("/", getBanners);
router.post("/admin", createBannerDirect);
router.delete("/admin/:id", deleteBannerDirect);

export default router;


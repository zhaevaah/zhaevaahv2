import { Request, Response } from "express";
import prisma from "../config/prisma";

// Default initial coupons if database is empty
const SEED_COUPONS = [
  {
    code: "FESTIVEGOLD",
    title: "Diwali Festival of Lights Privilege",
    description: "Extra 5% instant discount on all marked-down vault deals",
    festivalName: "Diwali Festival of Lights",
    isFestivalSpecific: true,
    discountType: "PERCENTAGE",
    discountValue: 5,
    maxDiscountAmount: 3000,
    minOrderValue: 0,
    usageLimitPerUser: 1,
    usageLimitTotal: 1000,
    badge: "Extra 5% OFF",
    showInTopDeals: true,
    isActive: true,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
  },
  {
    code: "DIWALI20",
    title: "Diwali Solitaire & Bridal Special",
    description: "Flat 20% discount on Solitaire Diamond Rings and Couture Wedding Pavé Sets",
    festivalName: "Diwali Festival of Lights",
    isFestivalSpecific: true,
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscountAmount: 10000,
    minOrderValue: 25000,
    usageLimitPerUser: 1,
    usageLimitTotal: 500,
    badge: "Flat 20% OFF",
    showInTopDeals: true,
    isActive: true,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
  },
  {
    code: "GOLDCOIN",
    title: "Auspicious Dhanteras Free Gold Coin",
    description: "1-gram BIS Hallmarked 24K pure gold coin shipped free with order",
    festivalName: "Diwali Festival of Lights",
    isFestivalSpecific: true,
    discountType: "FLAT",
    discountValue: 7500,
    maxDiscountAmount: 7500,
    minOrderValue: 50000,
    usageLimitPerUser: 1,
    usageLimitTotal: 300,
    badge: "Free 24K Gold Coin",
    showInTopDeals: true,
    isActive: true,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
  },
  {
    code: "ZHAEVAAH10",
    title: "Atelier Welcome Privilege",
    description: "First purchase privilege for new atelier club members",
    festivalName: "General",
    isFestivalSpecific: false,
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountAmount: 5000,
    minOrderValue: 10000,
    usageLimitPerUser: 1,
    usageLimitTotal: 2000,
    badge: "10% Welcome Offer",
    showInTopDeals: true,
    isActive: true,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
  {
    code: "AKSHAYA15",
    title: "Akshaya Tritiya Gold Rush",
    description: "On all BIS hallmarked fine gold and bridal jewellery",
    festivalName: "Akshaya Tritiya",
    isFestivalSpecific: true,
    discountType: "PERCENTAGE",
    discountValue: 15,
    maxDiscountAmount: 8000,
    minOrderValue: 20000,
    usageLimitPerUser: 1,
    usageLimitTotal: 500,
    badge: "Flat 15% OFF",
    showInTopDeals: false,
    isActive: true,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
  },
  {
    code: "WEDDING5000",
    title: "Royal Wedding Season Privilege",
    description: "Direct price deduction on couture bridal jewelry suites",
    festivalName: "Royal Wedding Season",
    isFestivalSpecific: true,
    discountType: "FLAT",
    discountValue: 5000,
    maxDiscountAmount: 5000,
    minOrderValue: 45000,
    usageLimitPerUser: 1,
    usageLimitTotal: 400,
    badge: "Flat ₹5,000 OFF",
    showInTopDeals: false,
    isActive: true,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
];

// Helper to seed initial coupons if none exist
async function ensureSeedCoupons() {
  try {
    const count = await prisma.coupon.count();
    if (count === 0) {
      for (const c of SEED_COUPONS) {
        await prisma.coupon.create({ data: c }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn("[ensureSeedCoupons] Warning:", err);
  }
}

// GET /api/coupons - Public active coupons for Top Deals & checkout
export const getCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureSeedCoupons();

    const { festivalOnly, topDealsOnly } = req.query;

    const where: any = { isActive: true };

    if (festivalOnly === "true") {
      where.isFestivalSpecific = true;
    }
    if (topDealsOnly === "true") {
      where.showInTopDeals = true;
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error: any) {
    console.error("[getCoupons Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
};

// GET /api/admin/coupons - Admin: fetch all coupons
export const getAdminCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureSeedCoupons();

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error: any) {
    console.error("[getAdminCoupons Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin coupons",
      error: error.message,
    });
  }
};

// POST /api/admin/coupons - Admin: create new coupon
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      title,
      description,
      festivalName,
      isFestivalSpecific,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderValue,
      usageLimitPerUser,
      usageLimitTotal,
      startDate,
      endDate,
      isActive,
      showInTopDeals,
      badge,
    } = req.body;

    if (!code || !title || discountValue === undefined) {
      res.status(400).json({
        success: false,
        message: "Code, title, and discount value are required.",
      });
      return;
    }

    const upperCode = String(code).trim().toUpperCase();

    // Check existing
    const existing = await prisma.coupon.findUnique({
      where: { code: upperCode },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Coupon with code "${upperCode}" already exists.`,
      });
      return;
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: upperCode,
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        festivalName: festivalName ? String(festivalName).trim() : "General",
        isFestivalSpecific: Boolean(isFestivalSpecific),
        discountType: discountType === "FLAT" ? "FLAT" : "PERCENTAGE",
        discountValue: Number(discountValue) || 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
        usageLimitPerUser: usageLimitPerUser ? Number(usageLimitPerUser) : 1,
        usageLimitTotal: usageLimitTotal ? Number(usageLimitTotal) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        showInTopDeals: showInTopDeals !== undefined ? Boolean(showInTopDeals) : true,
        badge: badge
          ? String(badge).trim()
          : discountType === "FLAT"
          ? `Flat ₹${discountValue} OFF`
          : `${discountValue}% OFF`,
      },
    });

    res.status(201).json({
      success: true,
      message: `Coupon "${upperCode}" created successfully.`,
      coupon: newCoupon,
    });
  } catch (error: any) {
    console.error("[createCoupon Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

// PUT /api/admin/coupons/:id - Admin: update coupon
export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.code) {
      data.code = String(data.code).trim().toUpperCase();
    }
    if (data.discountValue !== undefined) {
      data.discountValue = Number(data.discountValue);
    }
    if (data.minOrderValue !== undefined) {
      data.minOrderValue = Number(data.minOrderValue);
    }
    if (data.maxDiscountAmount !== undefined) {
      data.maxDiscountAmount = data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null;
    }
    if (data.usageLimitPerUser !== undefined) {
      data.usageLimitPerUser = data.usageLimitPerUser ? Number(data.usageLimitPerUser) : 1;
    }
    if (data.usageLimitTotal !== undefined) {
      data.usageLimitTotal = data.usageLimitTotal ? Number(data.usageLimitTotal) : null;
    }
    if (data.startDate) {
      data.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      data.endDate = new Date(data.endDate);
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: "Coupon updated successfully.",
      coupon: updated,
    });
  } catch (error: any) {
    console.error("[updateCoupon Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

// DELETE /api/admin/coupons/:id - Admin: delete coupon
export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.coupon.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error: any) {
    console.error("[deleteCoupon Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

// POST /api/coupons/validate - Public: validate coupon for checkout
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      res.status(400).json({
        success: false,
        message: "Coupon code and subtotal are required.",
      });
      return;
    }

    const upperCode = String(code).trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: upperCode },
    });

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: `Coupon code "${upperCode}" is invalid.`,
      });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({
        success: false,
        message: `Coupon "${upperCode}" is no longer active.`,
      });
      return;
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      res.status(400).json({
        success: false,
        message: `Coupon "${upperCode}" is not yet active.`,
      });
      return;
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      res.status(400).json({
        success: false,
        message: `Coupon "${upperCode}" has expired.`,
      });
      return;
    }

    const numSubtotal = Number(subtotal) || 0;
    if (coupon.minOrderValue && numSubtotal < coupon.minOrderValue) {
      res.status(400).json({
        success: false,
        message: `Minimum order value for "${upperCode}" is ₹${coupon.minOrderValue.toLocaleString("en-IN")}.`,
      });
      return;
    }

    if (coupon.usageLimitTotal && coupon.usedCount >= coupon.usageLimitTotal) {
      res.status(400).json({
        success: false,
        message: `Coupon "${upperCode}" has reached its maximum total usage limit.`,
      });
      return;
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (numSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Discount cannot exceed subtotal
    if (discountAmount > numSubtotal) {
      discountAmount = numSubtotal;
    }

    res.json({
      success: true,
      message: `Coupon "${upperCode}" applied successfully! You saved ₹${Math.round(discountAmount).toLocaleString("en-IN")}.`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        title: coupon.title,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        badge: coupon.badge,
        festivalName: coupon.festivalName,
      },
      discountAmount: Math.round(discountAmount),
      finalTotal: Math.max(0, Math.round(numSubtotal - discountAmount)),
    });
  } catch (error: any) {
    console.error("[validateCoupon Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate coupon",
      error: error.message,
    });
  }
};

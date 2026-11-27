import { Request, Response } from "express";
import prisma from "../config/prisma";

const FALLBACK_BANNERS = [
  {
    id: "hero-1",
    title: "Woman In Golden Rings And Necklaces",
    type: "HERO",
    image: "/images/hero_woman_hd.jpg",
    mobileImage: "/images/hero_woman.jpg",
    link: "/shop",
    position: 1,
    isActive: true,
  },
  {
    id: "hero-2",
    title: "Pure Brilliance Solitaire Collection",
    type: "HERO",
    image: "/images/ZhaevaahHero.jpg",
    mobileImage: "/images/ZhaevaahHero-800.webp",
    link: "/shop?category=Solitaire%20Rings",
    position: 2,
    isActive: true,
  },
  {
    id: "hero-3",
    title: "Timeless Symphony Of Gold & Gems",
    type: "HERO",
    image: "/images/collection.webp",
    mobileImage: "/images/collection.webp",
    link: "/shop?category=Wedding%20%26%20Bridal%20Sets",
    position: 3,
    isActive: true,
  },
  {
    id: "promo-1",
    title: "Save 10% When You Join ZHAEVAAH, Use Promo",
    type: "PROMO_TOP",
    discount: "ZHAEVAAH10",
    badge: "SPECIAL OFFER",
    link: "/shop",
    position: 1,
    isActive: true,
  },
  {
    id: "promo-2",
    title: "Save 20% on Festive Diamond Jewellery, Use Promo",
    type: "PROMO_TOP",
    discount: "DIWALI20",
    badge: "DIWALI SALE",
    link: "/shop?category=Diamond%20Rings",
    position: 2,
    isActive: true,
  },
  {
    id: "ad-double-1",
    title: "Yellow Gold & Diamond Ring",
    subtitle: "Diamond Rings",
    type: "AD_DOUBLE",
    image: "/images/ad_banner_ring_full.jpg",
    link: "/shop?category=Diamond%20Rings",
    position: 1,
    isActive: true,
  },
  {
    id: "ad-double-2",
    title: "Infinity Diamond Bracelet",
    subtitle: "Diamond Bracelets",
    type: "AD_DOUBLE",
    image: "/images/ad_banner_double_source.jpg",
    link: "/women",
    position: 2,
    isActive: true,
  },
  {
    id: "top-deal-1",
    title: "Diwali Fine Gold & Solitaire Edit",
    subtitle: "Up to 35% Off on BIS 916 Hallmarked Gold & Natural Diamonds",
    type: "TOP_DEALS",
    image: "/images/ZhaevaahHero.jpg",
    mobileImage: "/images/ZhaevaahHero-800.webp",
    link: "/women",
    ctaText: "EXPLORE OFFERS",
    badge: "FESTIVE SPOTLIGHT",
    discount: "UP TO 35% OFF",
    position: 1,
    isActive: true,
  },
  {
    id: "top-deal-2",
    title: "Bespoke Royal Nizam Bridal Suites",
    subtitle: "Complimentary 24K Gold Coin with insured express delivery",
    type: "TOP_DEALS",
    image: "/images/collection.webp",
    mobileImage: "/images/collection.webp",
    link: "/women",
    ctaText: "CLAIM PRIVILEGE",
    badge: "LIMITED PRIVILEGE",
    discount: "FREE 24K COIN",
    position: 2,
    isActive: true,
  },
  {
    id: "top-deal-3",
    title: "Certified Solitaire Diamond Rings",
    subtitle: "IGI & SGL Certified natural solitaires crafted in 18kt pure gold",
    type: "TOP_DEALS",
    image: "/images/hero_woman_hd.jpg",
    mobileImage: "/images/hero_woman.jpg",
    link: "/women",
    ctaText: "VIEW COLLECTION",
    badge: "ATELIER SELECTION",
    discount: "EXTRA 5% CODE",
    position: 3,
    isActive: true,
  },
];

export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;

    const where: any = { isActive: true };
    if (type) {
      where.type = String(type).toUpperCase();
    }

    let banners: any[] = [];
    try {
      banners = await prisma.banner.findMany({
        where,
        orderBy: { position: "asc" },
      });
    } catch (dbErr: any) {
      console.warn("[Database Banner Query Warning, using fallback]:", dbErr.message);
      banners = FALLBACK_BANNERS.filter((b: any) => {
        if (type) return b.type === String(type).toUpperCase();
        return b.isActive;
      });
    }

    if (!banners || banners.length === 0) {
      banners = FALLBACK_BANNERS.filter((b: any) => {
        if (type) return b.type === String(type).toUpperCase();
        return b.isActive;
      });
    }

    // Group banners by type for easy frontend consumption
    const topDealsList = banners.filter((b: any) => b.type === "TOP_DEALS");
    const grouped = {
      hero: banners.filter((b: any) => b.type === "HERO"),
      adDouble: banners.filter((b: any) => b.type === "AD_DOUBLE"),
      adSingle: banners.filter((b: any) => b.type === "AD_SINGLE"),
      promoTop: banners.filter((b: any) => b.type === "PROMO_TOP"),
      braceletHotsell: banners.filter((b: any) => b.type === "BRACELET_HOTSELL"),
      dropCut: banners.filter((b: any) => b.type === "DROP_CUT"),
      topDeals: topDealsList.length > 0 ? topDealsList : FALLBACK_BANNERS.filter((b: any) => b.type === "TOP_DEALS"),
      all: banners,
    };

    res.status(200).json({ success: true, banners: grouped });
  } catch (error: any) {
    console.error("[Get Banners Error]:", error);
    // Return fallback grouped banners to prevent storefront 500 crashes
    const fallbackGrouped = {
      hero: FALLBACK_BANNERS.filter((b: any) => b.type === "HERO"),
      adDouble: FALLBACK_BANNERS.filter((b: any) => b.type === "AD_DOUBLE"),
      adSingle: [],
      promoTop: FALLBACK_BANNERS.filter((b: any) => b.type === "PROMO_TOP"),
      braceletHotsell: [],
      dropCut: [],
      topDeals: FALLBACK_BANNERS.filter((b: any) => b.type === "TOP_DEALS"),
      all: FALLBACK_BANNERS,
    };
    res.status(200).json({ success: true, banners: fallbackGrouped, isFallback: true });
  }
};

export const createBannerDirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      subtitle,
      type = "TOP_DEALS",
      image,
      mobileImage,
      link = "/women",
      ctaText = "SHOP NOW",
      badge,
      discount,
      position = 0,
      isActive = true,
    } = req.body;

    if (!title || !image) {
      res.status(400).json({ success: false, message: "Title and Image are required for banner slide." });
      return;
    }

    const banner = await prisma.banner.create({
      data: {
        title: String(title).trim(),
        subtitle: subtitle ? String(subtitle).trim() : null,
        type: String(type).toUpperCase(),
        image: String(image).trim(),
        mobileImage: mobileImage ? String(mobileImage).trim() : null,
        link: String(link).trim(),
        ctaText: String(ctaText).trim(),
        badge: badge ? String(badge).trim() : null,
        discount: discount ? String(discount).trim() : null,
        position: Number(position) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    res.status(201).json({ success: true, message: "Banner slide created successfully.", banner });
  } catch (error: any) {
    console.error("[Create Banner Direct Error]:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create banner slide." });
  }
};

export const deleteBannerDirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Banner slide deleted successfully." });
  } catch (error: any) {
    console.error("[Delete Banner Direct Error]:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete banner slide." });
  }
};


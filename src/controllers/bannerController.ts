import { Request, Response } from "express";
import prisma from "../config/prisma";

const FALLBACK_BANNERS = [
  {
    id: "hero-1",
    title: "Woman In Golden Rings And Necklaces",
    subtitle: "Awesome products for the dynamic urban lifestyle",
    type: "HERO",
    image: "/images/hero_woman_hd.jpg",
    link: "/shop",
    badge: "THIS WEEK'S HIGHLIGHTS",
    position: 1,
    isActive: true,
  },
  {
    id: "hero-2",
    title: "Pure Brilliance In Every Facet & Curve",
    subtitle: "Certified natural diamonds handset in 18kt hallmarked yellow gold",
    type: "HERO",
    image: "/images/ZhaevaahHero.jpg",
    link: "/shop?category=Solitaire%20Rings",
    badge: "EXCLUSIVE SOLITAIRE EDIT",
    position: 2,
    isActive: true,
  },
  {
    id: "hero-3",
    title: "Timeless Symphony Of Gold & Gems",
    subtitle: "Intricately crafted artisanal masterpieces celebrating golden memories",
    type: "HERO",
    image: "/images/collection.webp",
    link: "/shop?category=Wedding%20%26%20Bridal%20Sets",
    badge: "HERITAGE & ROYAL LUXURY",
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
    link: "/shop?category=Diamond%20Bracelets",
    position: 2,
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
    const grouped = {
      hero: banners.filter((b: any) => b.type === "HERO"),
      adDouble: banners.filter((b: any) => b.type === "AD_DOUBLE"),
      adSingle: banners.filter((b: any) => b.type === "AD_SINGLE"),
      promoTop: banners.filter((b: any) => b.type === "PROMO_TOP"),
      braceletHotsell: banners.filter((b: any) => b.type === "BRACELET_HOTSELL"),
      dropCut: banners.filter((b: any) => b.type === "DROP_CUT"),
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
      all: FALLBACK_BANNERS,
    };
    res.status(200).json({ success: true, banners: fallbackGrouped, isFallback: true });
  }
};

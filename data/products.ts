import { Product } from "../context/StoreContext";

export interface CatalogProduct extends Product {
  metal: string;
  gemstone: string;
}

export interface DetailedProduct extends Product {
  brand: string;
  metal?: string;
  gemstone?: string;
  soldCount: number;
  soldHours: number;
  stock: number;
  viewingCount: number;
  stoneColors: { name: string; hex: string; image?: string }[];
  stoneShapes: { name: string; shapeId: string }[];
  galleryImages: string[];
  ringSizes?: string[];
  sizes?: string[];
  purityOptions: string[];
  specifications: { label: string; value: string }[];
}

// Real data is dynamically loaded from backend database API.
// All mock/dummy product records have been deleted as requested.
export const ALL_PRODUCTS: CatalogProduct[] = [];
export const MENS_PRODUCTS: CatalogProduct[] = [];
export const WOMENS_PRODUCTS: CatalogProduct[] = [];
export const LATEST_PRODUCTS: CatalogProduct[] = [];
export const TOP_PRODUCTS: CatalogProduct[] = [];
export const TOP_WEEK_PRODUCTS: CatalogProduct[] = [];

export const WOMENS_CATEGORIES = [
  "All Categories",
  "Diamond Rings",
  "Solitaire Rings",
  "Necklaces & Pendants",
  "Diamond Bracelets",
  "Earrings",
  "Wedding & Bridal Sets",
];

export const MENS_CATEGORIES = [
  "All Categories",
  "Men's Rings",
  "Diamond Bracelets & Kadas",
  "Chains & Pendants",
  "Cufflinks & Accents",
];

export const ALL_CATEGORIES = [
  "All Categories",
  "Diamond Rings",
  "Solitaire Rings",
  "Necklaces & Pendants",
  "Diamond Bracelets",
  "Earrings",
  "Wedding & Bridal Sets",
];

export const FEATURED_DETAILED_PRODUCT: DetailedProduct = {
  id: "",
  title: "",
  brand: "ZHAEVAAH",
  price: "",
  priceNum: 0,
  rating: 5.0,
  reviewsCount: 0,
  soldCount: 0,
  soldHours: 0,
  stock: 0,
  viewingCount: 0,
  category: "",
  primaryImage: "/images/ZhaevaahHero.jpg",
  hoverImage: "/images/ZhaevaahHero.jpg",
  galleryImages: [],
  description: "",
  stoneColors: [],
  stoneShapes: [],
  purityOptions: ["14KT", "18KT", "22KT", "Platinum 950"],
  specifications: [],
};

export function getProductDiscountPercentage(product: Product): string {
  if (product.discountBadge && product.discountBadge.includes("%")) {
    return product.discountBadge.startsWith("-")
      ? product.discountBadge
      : `-${product.discountBadge}`;
  }

  const origPriceStr = product.originalPrice || (product as any).compareAtPrice;
  if (origPriceStr) {
    const orig = parseInt(String(origPriceStr).replace(/[^0-9]/g, ""), 10);
    const curr = product.priceNum || parseInt(String(product.price).replace(/[^0-9]/g, ""), 10);
    if (orig > 0 && curr > 0 && orig > curr) {
      const pct = Math.round(((orig - curr) / orig) * 100);
      if (pct > 0 && pct < 90) {
        return `-${pct}%`;
      }
    }
  }

  const defaultPcts = ["-10%", "-12%", "-15%", "-18%", "-20%", "-14%"];
  const charSum = (product.id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return defaultPcts[charSum % defaultPcts.length];
}

export function getProductStock(product: Product | { id?: string; stock?: number }): number {
  if (typeof product.stock === "number" && product.stock > 0 && product.stock <= 25) {
    return product.stock;
  }
  const charSum = ((product.id || "default") + "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (charSum % 7) + 3; // Returns 3 to 9
}

export function getProductById(id: string): DetailedProduct | null {
  const found = ALL_PRODUCTS.find((p) => p.id === id || (p as any).slug === id);
  if (!found) return null;

  const stockCount = getProductStock(found);
  return {
    ...FEATURED_DETAILED_PRODUCT,
    id: found.id,
    title: found.title,
    brand: found.brand || "ZHAEVAAH FINE JEWELLERY",
    price: found.price,
    priceNum: found.priceNum,
    originalPrice: found.originalPrice,
    discountBadge: getProductDiscountPercentage(found),
    rating: found.rating || 5.0,
    reviewsCount: found.reviewsCount || 18,
    category: found.category,
    metal: found.metal || "18kt Yellow Gold",
    gemstone: found.gemstone || "Natural Diamond",
    stock: stockCount,
    soldCount: (found as any).soldCount || 7,
    soldHours: (found as any).soldHours || 24,
    viewingCount: (found as any).viewingCount || 16,
    primaryImage: found.primaryImage,
    hoverImage: found.hoverImage,
    galleryImages: found.additionalImages || [found.primaryImage],
    description: found.description || "Exquisite fine jewellery piece handcrafted with 100% natural certified diamonds and hallmarked gold.",
    stoneColors: (found as any).stoneColors || [],
    stoneShapes: (found as any).stoneShapes || [],
    purityOptions: ["14KT", "18KT", "22KT", "Platinum 950"],
    specifications: (found as any).specifications || [],
  };
}

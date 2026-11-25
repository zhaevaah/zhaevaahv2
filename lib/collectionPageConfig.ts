export interface CollectionCategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  badge?: string;
  itemCount?: string | number;
}

export interface CollectionPageConfig {
  gender: "women" | "men";
  pageTitle: string;
  hero: {
    badge: string;
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    bgImage: string;
    ctaText: string;
    ctaLink: string;
  };
  curatedCategories: CollectionCategoryItem[];
  featuredProductIds: string[];
  promoBanner: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    discountCode: string;
    discountText: string;
    bgImage: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const DEFAULT_WOMENS_PAGE_CONFIG: CollectionPageConfig = {
  gender: "women",
  pageTitle: "Women's Fine Jewellery Collection",
  hero: {
    badge: "HAUTE JOAILLERIE ATELIER",
    headline: "Women's Fine Jewellery",
    headlineHighlight: "Couture Collection",
    subtitle:
      "Explore our certified natural diamonds, solitaire rings, necklaces, and bespoke 18kt gold creations.",
    bgImage: "/images/hero_woman.jpg",
    ctaText: "EXPLORE COLLECTION",
    ctaLink: "#catalog-section",
  },
  curatedCategories: [
    {
      id: "w-cat-1",
      name: "Diamond Rings",
      slug: "diamond-rings",
      image: "/images/category_rings.jpg",
      badge: "HOT",
      itemCount: "4 Designs",
    },
    {
      id: "w-cat-2",
      name: "Solitaire Rings",
      slug: "solitaire-rings",
      image: "/images/product_3_main.png",
      badge: "ICONIC",
      itemCount: "2 Designs",
    },
    {
      id: "w-cat-3",
      name: "Diamond Bracelets",
      slug: "diamond-bracelets",
      image: "/images/category_bracelet.jpg",
      badge: "SALE",
      itemCount: "2 Designs",
    },
    {
      id: "w-cat-4",
      name: "Necklaces & Pendants",
      slug: "diamond-pendant",
      image: "/images/category_pendant.jpg",
      badge: "POPULAR",
      itemCount: "3 Designs",
    },
    {
      id: "w-cat-5",
      name: "Earrings & Drops",
      slug: "earrings",
      image: "/images/ring_blue_topaz_main.jpg",
      badge: "NEW",
      itemCount: "3 Designs",
    },
  ],
  featuredProductIds: ["prod-topaz", "prod-1", "prod-2", "prod-3"],
  promoBanner: {
    enabled: true,
    badge: "FESTIVE ATELIER PRIVILEGE",
    title: "The Solitaire Symphony Celebration",
    subtitle:
      "Complimentary BIS hallmarking certification, insured pan-India white-glove courier & special diamond rates.",
    discountCode: "SOLITAIRE15",
    discountText: "15% OFF",
    bgImage: "/images/banner_weekly_special.jpg",
    buttonText: "CLAIM FESTIVE PRIVILEGE",
    buttonLink: "/women?sort=featured",
  },
};

export const DEFAULT_MENS_PAGE_CONFIG: CollectionPageConfig = {
  gender: "men",
  pageTitle: "Men's Luxury Fine Jewellery & Vault",
  hero: {
    badge: "IMPERIAL ATELIER & VAULT",
    headline: "Men's Luxury Fine",
    headlineHighlight: "Vault & Accents",
    subtitle:
      "Commanding signet rings, handcrafted 18kt solid Cuban kadas, heavy curb chains, and onyx cufflinks.",
    bgImage: "/images/product_4_main.png",
    ctaText: "EXPLORE MEN'S VAULT",
    ctaLink: "#catalog-section",
  },
  curatedCategories: [
    {
      id: "m-cat-1",
      name: "Men's Rings",
      slug: "mens-rings",
      image: "/images/product_4_main.png",
      badge: "BESTSELLER",
      itemCount: "2 Designs",
    },
    {
      id: "m-cat-2",
      name: "Bracelets & Kadas",
      slug: "mens-bracelets-kadas",
      image: "/images/category_bracelet.jpg",
      badge: "SOLID GOLD",
      itemCount: "2 Designs",
    },
    {
      id: "m-cat-3",
      name: "Chains & Pendants",
      slug: "chains-pendants",
      image: "/images/category_pendant.jpg",
      badge: "HEAVY 18KT",
      itemCount: "2 Designs",
    },
    {
      id: "m-cat-4",
      name: "Cufflinks & Accents",
      slug: "cufflinks-accents",
      image: "/images/product_3_main.png",
      badge: "ONYX",
      itemCount: "1 Design",
    },
  ],
  featuredProductIds: ["prod-4", "prod-2"],
  promoBanner: {
    enabled: true,
    badge: "SOVEREIGN VAULT PASS",
    title: "Commanding Sovereign Signet & Kada Sets",
    subtitle:
      "Complimentary hand-engraved initials, bespoke sizing consultation, and priority safe delivery.",
    discountCode: "VAULT10",
    discountText: "10% OFF",
    bgImage: "/images/banner_weekly_special.jpg",
    buttonText: "ACCESS MEN'S VAULT",
    buttonLink: "/men?sort=featured",
  },
};

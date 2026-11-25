export interface DealsFestivalTheme {
  id: string;
  name: string;
  accentLabel: string;
  bgGradient: string; // Tailwind background gradient classes
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentTextGradient: string;
  cardBg: string;
  cardBorder: string;
  highlightColor: string;
  primaryButtonBg: string;
}

export interface FestivalCouponCode {
  code: string;
  discount: string;
  description: string;
  minSpend?: string;
}

export interface TopDealsConfig {
  festivalVibe: string;
  themeId: string;
  badge: string;
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  primaryVoucherCode: string;
  primaryVoucherDiscount: string;
  primaryVoucherDesc: string;
  freeGiftText: string;
  codes: FestivalCouponCode[];
}

export const FESTIVAL_THEMES: Record<string, DealsFestivalTheme> = {
  "royal-gold": {
    id: "royal-gold",
    name: "Royal Gold & Obsidian (Classic Luxury)",
    accentLabel: "Royal Gold",
    bgGradient: "from-[#1C1208] via-[#2A1D13] to-[#140C04]",
    badgeBg: "bg-[#B8933F]/20",
    badgeText: "text-[#E5C278]",
    badgeBorder: "border-[#B8933F]/50",
    accentTextGradient: "from-[#E5C278] via-[#B8933F] to-[#F3DC9B]",
    cardBg: "from-[#2E2014] to-[#1C1208]",
    cardBorder: "border-[#B8933F]/60",
    highlightColor: "#B8933F",
    primaryButtonBg: "bg-[#B8933F] hover:bg-[#9E792B]",
  },
  "crimson-ruby": {
    id: "crimson-ruby",
    name: "Festive Crimson & Ruby Red (Diwali / Wedding Special)",
    accentLabel: "Crimson Ruby",
    bgGradient: "from-[#38060A] via-[#290407] to-[#150204]",
    badgeBg: "bg-[#E63946]/25",
    badgeText: "text-[#FFC2C7]",
    badgeBorder: "border-[#E63946]/60",
    accentTextGradient: "from-[#FFD700] via-[#FFA500] to-[#FF8C00]",
    cardBg: "from-[#470B10] to-[#240306]",
    cardBorder: "border-[#FFD700]/70",
    highlightColor: "#FFD700",
    primaryButtonBg: "bg-[#C9182B] hover:bg-[#A31221]",
  },
  "emerald-royale": {
    id: "emerald-royale",
    name: "Emerald Royale (Akshaya Tritiya & Prosperity)",
    accentLabel: "Emerald Royale",
    bgGradient: "from-[#082618] via-[#051A10] to-[#020D08]",
    badgeBg: "bg-[#10B981]/20",
    badgeText: "text-[#A7F3D0]",
    badgeBorder: "border-[#10B981]/50",
    accentTextGradient: "from-[#FBBF24] via-[#F59E0B] to-[#D97706]",
    cardBg: "from-[#0F3C26] to-[#061E13]",
    cardBorder: "border-[#FBBF24]/70",
    highlightColor: "#FBBF24",
    primaryButtonBg: "bg-[#1B8354] hover:bg-[#146641]",
  },
  "sunset-rose": {
    id: "sunset-rose",
    name: "Sunset Rose Gold (Valentine & Modern Couture)",
    accentLabel: "Rose Gold",
    bgGradient: "from-[#2C1018] via-[#1E080F] to-[#110307]",
    badgeBg: "bg-[#F43F5E]/20",
    badgeText: "text-[#FECDD3]",
    badgeBorder: "border-[#F43F5E]/50",
    accentTextGradient: "from-[#FDA4AF] via-[#F43F5E] to-[#FB7185]",
    cardBg: "from-[#3D1422] to-[#1F0710]",
    cardBorder: "border-[#FDA4AF]/70",
    highlightColor: "#F472B6",
    primaryButtonBg: "bg-[#B76E79] hover:bg-[#9C5A64]",
  },
  "midnight-sapphire": {
    id: "midnight-sapphire",
    name: "Midnight Sapphire (Royal Gala & Solitaire Pavilion)",
    accentLabel: "Midnight Sapphire",
    bgGradient: "from-[#0A1832] via-[#050D1C] to-[#02050D]",
    badgeBg: "bg-[#38BDF8]/20",
    badgeText: "text-[#BAE6FD]",
    badgeBorder: "border-[#38BDF8]/50",
    accentTextGradient: "from-[#BAE6FD] via-[#38BDF8] to-[#0284C7]",
    cardBg: "from-[#112447] to-[#081224]",
    cardBorder: "border-[#38BDF8]/70",
    highlightColor: "#38BDF8",
    primaryButtonBg: "bg-[#0284C7] hover:bg-[#0369A1]",
  },
};

export const FESTIVAL_PRESETS = [
  {
    name: "Diwali Festival of Lights",
    vibe: "DIWALI FESTIVAL OF LIGHTS",
    themeId: "crimson-ruby",
    badge: "AUSPICIOUS DIWALI DHANTERAS VAULT",
    headline: "Diwali Festive Fine Jewellery",
    headlineHighlight: "Exclusive Top Deals",
    subtitle:
      "Illuminate your festivities with certified natural diamond solitaire rings & 22kt hallmarked temple gold. Enjoy flat 20% off plus an assured 24K pure gold coin.",
    primaryVoucherCode: "DIWALI20",
    primaryVoucherDiscount: "Flat 20% Privilege Code",
    primaryVoucherDesc:
      "Apply code DIWALI20 at checkout for an instant 20% reduction on all marked-down solitaire and bridal jewellery.",
    freeGiftText:
      "Complimentary 1-gram 24K BIS Hallmarked Gold Coin automatically included on orders over ₹50,000!",
    codes: [
      {
        code: "DIWALI20",
        discount: "Flat 20% OFF",
        description: "Special Diwali festive code for Solitaire rings & Bridal sets",
        minSpend: "Min ₹25,000",
      },
      {
        code: "FESTIVEGOLD",
        discount: "Extra 5% OFF",
        description: "Extra instant discount on all marked-down vault deals",
        minSpend: "No minimum spend",
      },
      {
        code: "GOLDCOIN",
        discount: "Free 24K Gold Coin",
        description: "1-gram BIS Hallmarked 24K pure gold coin shipped free with order",
        minSpend: "Min ₹50,000",
      },
      {
        code: "ZHAEVAAH10",
        discount: "10% Welcome Offer",
        description: "First purchase privilege for new atelier club members",
        minSpend: "Min ₹10,000",
      },
    ],
  },
  {
    name: "Akshaya Tritiya Gold Rush",
    vibe: "AKSHAYA TRITIYA PROSPERITY",
    themeId: "emerald-royale",
    badge: "AUSPICIOUS SHUBH MUHURAT VAULT",
    headline: "Akshaya Tritiya Gold & Diamond",
    headlineHighlight: "Eternal Prosperity Deals",
    subtitle:
      "Invest in timeless prosperity with 100% BIS hallmarked 18kt and 22kt gold creations. Zero making charges on select solitaire bridal pavé rings.",
    primaryVoucherCode: "AKSHAYA15",
    primaryVoucherDiscount: "Flat 15% Gold Privilege",
    primaryVoucherDesc:
      "Special Akshaya Tritiya code for flat 15% off on fine gold and diamond pieces.",
    freeGiftText:
      "Complimentary Lakshmi 24K Gold Coin & certified gemstone packaging on orders above ₹40,000!",
    codes: [
      {
        code: "AKSHAYA15",
        discount: "Flat 15% OFF",
        description: "On all BIS hallmarked fine gold and bridal jewellery",
        minSpend: "Min ₹20,000",
      },
      {
        code: "PROSPERITY",
        discount: "Zero Making Charges",
        description: "100% waiver on making charges for selected gold rings",
        minSpend: "Min ₹30,000",
      },
      {
        code: "GOLDCOIN",
        discount: "Free 24K Gold Coin",
        description: "Complimentary 24K gold coin shipped with insured courier",
        minSpend: "Min ₹50,000",
      },
    ],
  },
  {
    name: "Royal Wedding Season",
    vibe: "ROYAL WEDDING & BRIDAL COUTURE",
    themeId: "royal-gold",
    badge: "ROYAL BRIDAL ATELIER PRIVILEGE",
    headline: "Grand Bridal & Solitaire Suites",
    headlineHighlight: "Couture Wedding Edits",
    subtitle:
      "Curate your dream trousseau with heirloom bridal sets, diamond chokers, and handcrafted engagement solitaires. Handcrafted for a lifetime of golden memories.",
    primaryVoucherCode: "WEDDING5000",
    primaryVoucherDiscount: "Flat ₹5,000 Off",
    primaryVoucherDesc:
      "Instant ₹5,000 voucher reduction on wedding necklaces, chandelier earrings, and bridal sets.",
    freeGiftText:
      "Complimentary Velvet Bridal Jewelry Trunk & LED Illumination Box on orders above ₹75,000!",
    codes: [
      {
        code: "WEDDING5000",
        discount: "Flat ₹5,000 OFF",
        description: "Direct price deduction on couture bridal jewelry suites",
        minSpend: "Min ₹45,000",
      },
      {
        code: "SOLITAIRE10",
        discount: "10% Off Solitaires",
        description: "Valid across all certified engagement solitaire rings",
        minSpend: "No min spend",
      },
      {
        code: "GOLDCOIN",
        discount: "Free 24K Gold Coin",
        description: "Complimentary 24K gold coin included automatically",
        minSpend: "Min ₹50,000",
      },
    ],
  },
  {
    name: "Valentine & Anniversary Couture",
    vibe: "VALENTINE & FOREVER LOVE",
    themeId: "sunset-rose",
    badge: "ROMANTIC SOLITAIRE & ROSE GOLD EDIT",
    headline: "Romantic Rose Gold & Diamond",
    headlineHighlight: "Forever Love Privileges",
    subtitle:
      "Celebrate timeless devotion with interlocking diamond infinity bands, rose gold clover pendants, and heart solitaire rings. Engraved with your personal message.",
    primaryVoucherCode: "FOREVERLOVE",
    primaryVoucherDiscount: "Extra 12% Love Privilege",
    primaryVoucherDesc:
      "Special Valentine discount code on all rose gold and diamond heart pieces.",
    freeGiftText:
      "Complimentary Personalized Laser Ring Engraving & Luxury Red Rose Bouquet Box included!",
    codes: [
      {
        code: "FOREVERLOVE",
        discount: "Extra 12% OFF",
        description: "On all rose gold necklaces, rings, and romantic pieces",
        minSpend: "Min ₹15,000",
      },
      {
        code: "FREEENGRAVE",
        discount: "Free Engraving",
        description: "Personalized text inside any diamond wedding or proposal band",
        minSpend: "No min spend",
      },
    ],
  },
];

export const DEFAULT_DEALS_CONFIG: TopDealsConfig = {
  festivalVibe: "DIWALI FESTIVAL OF LIGHTS",
  themeId: "crimson-ruby",
  badge: "LIMITED TIME VAULT PRIVILEGE",
  headline: "Festive Fine Jewellery",
  headlineHighlight: "Exclusive Top Deals",
  subtitle:
    "Save up to 35% off on hallmarked 18kt gold creations & certified natural diamond solitaire rings. Receive a complimentary BIS hallmarked 24K gold coin on orders over ₹50,000.",
  primaryVoucherCode: "FESTIVEGOLD",
  primaryVoucherDiscount: "Extra 5% Privilege Code",
  primaryVoucherDesc:
    "Apply code at checkout for an instant extra 5% reduction on all marked-down top deal jewellery items.",
  freeGiftText:
    "Complimentary 24K Hallmarked Gold Coin included automatically on orders above ₹50,000!",
  codes: [
    {
      code: "FESTIVEGOLD",
      discount: "Extra 5% OFF",
      description: "Applies instantly to all marked-down vault deals at checkout",
      minSpend: "No minimum spend",
    },
    {
      code: "DIWALI20",
      discount: "Flat 20% OFF",
      description: "On Solitaire Diamond Rings and Couture Wedding Pavé Sets",
      minSpend: "Min ₹25,000",
    },
    {
      code: "GOLDCOIN",
      discount: "Free 24K Gold Coin",
      description: "1-gram BIS Hallmarked 24K pure gold coin shipped free with order",
      minSpend: "Min ₹50,000",
    },
    {
      code: "ZHAEVAAH10",
      discount: "10% Welcome Offer",
      description: "First purchase privilege for new atelier club members",
      minSpend: "Min ₹10,000",
    },
  ],
};

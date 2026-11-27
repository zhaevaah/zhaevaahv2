import TopBanner from "../components/TopBanner";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import MarqueePromoStrip from "../components/MarqueePromoStrip";
import CategoryGrid from "../components/CategoryGrid";
import GenderCollectionSection from "../components/GenderCollectionSection";
import LatestProducts from "../components/LatestProducts";
import TopProducts from "../components/TopProducts";
import AdBannerDouble from "../components/AdBannerDouble";
import TopSoldWeekCarousel from "../components/TopSoldWeekCarousel";
import LifestyleEditsSection from "../components/LifestyleEditsSection";
import ClientReviews from "../components/ClientReviews";
import RoseGoldBraceletBanner from "../components/RoseGoldBraceletBanner";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import QuickViewModal from "../components/QuickViewModal";
import SearchModal from "../components/SearchModal";
import Toast from "../components/Toast";
import { StoreProvider } from "../context/StoreContext";

export default function Home() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* 1. Upper Banner Bar */}
        <TopBanner />

        {/* 2. Main Header with ZHAEVAAH Brand Logo & Luxury Navigation */}
        <Header />

        <main className="flex-1">
          {/* 3. Hero Carousel */}
          <HeroCarousel />

          {/* Continuous Luxury Promotional & Trust Marquee */}
          <MarqueePromoStrip />

          {/* 4. Category Section (3-tile promo banner grid) */}
          <CategoryGrid />

          {/* 5. Latest Products Section */}
          <LatestProducts />

          {/* Dedicated Men's & Women's Trending Products Section (Women first, then Men) */}
          <GenderCollectionSection />

          {/* 6. Top Products Section (with categories & separate ProductCard UI) */}
          <TopProducts />

          {/* 7. Ad Banner (as in Image 1: Women's Rose Gold Necklace & Rose Gold Ring For Women) */}
          <AdBannerDouble />

          {/* 8. Top Sold Product of This Week with Carousel (as in Image 2) */}
          <TopSoldWeekCarousel />

          {/* 02 | Wear It Where Life Happens - Lifestyle Expanding Edits */}
          <LifestyleEditsSection />

          {/* 9. Clients Review Section (What Our Clients Say as in Image 3) */}
          <ClientReviews />

          {/* 10. Banner Again (Rose Gold With Diamond Hotsell Bracelet as in Image 3) */}
          <RoseGoldBraceletBanner />
        </main>

        {/* 11. Similar Footer with Brand Logo in Left, Shop Now Button, App Badges, & Contact (as in Image 4) */}
        <Footer />

        {/* Global Interactive Overlays */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <Toast />
      </div>
    </StoreProvider>
  );
}

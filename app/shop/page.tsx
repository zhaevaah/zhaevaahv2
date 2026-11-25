import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ShopPageContent from "../../components/ShopPageContent";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "Shop All Fine Jewellery | ZHAEVAAH",
  description:
    "Filter through certified natural diamond rings, solitaire engagement rings, pendants, and bracelets with doorstep delivery across India.",
};

export default function ShopPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Header */}
        <Header />

        {/* Shop Listing with Left-Side Filters & 20-product Pagination */}
        <main className="flex-1">
          <ShopPageContent />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Overlays */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <Toast />
      </div>
    </StoreProvider>
  );
}


import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WomenPageContent from "../../components/WomenPageContent";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "Women's High Fine Jewellery Collection | ZHAEVAAH",
  description:
    "Explore ZHAEVAAH Women's Collection: Ethereal diamond solitaire engagement rings, rose gold necklaces, articulated tennis bracelets, and bespoke bridal masterpieces crafted in hallmarked 18kt gold.",
};

export default function WomenPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Promotional Banner */}
        <TopBanner />

        {/* Brand Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          <WomenPageContent />
        </main>

        {/* Brand Footer */}
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

import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import TopDealsPageContent from "../../components/TopDealsPageContent";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "Top Deals & Exclusive Vault Privileges | ZHAEVAAH",
  description:
    "Save up to 35% on certified natural diamond rings, necklaces, solitaire jewellery, and bridal sets with a complimentary BIS hallmarked gold coin on orders over ₹50,000.",
};

export default function TopDealsPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Header (No dropdowns on shop & deals) */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          <TopDealsPageContent />
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


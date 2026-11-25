import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MenPageContent from "../../components/MenPageContent";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "Men's Luxury Fine Jewellery & High Accents | ZHAEVAAH",
  description:
    "Explore ZHAEVAAH Men's Sovereign Vault: Commanding signet rings, handcrafted 18kt solid Cuban kadas, heavy diamond curb chains, and onyx tuxedo cufflinks forged for enduring distinction.",
};

export default function MenPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Promotional Banner */}
        <TopBanner />

        {/* Brand Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          <MenPageContent />
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

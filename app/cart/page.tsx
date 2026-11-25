import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartPageContent from "../../components/CartPageContent";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "Shopping Cart Summary | ZHAEVAAH Fine Jewellery",
  description:
    "Review your certified natural diamond and 18kt gold items in your bag, apply discount coupons, and proceed to insured doorstep delivery across India.",
};

export default function CartPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Header */}
        <Header />

        {/* Main Cart Summary Page */}
        <main className="flex-1">
          <CartPageContent />
        </main>

        {/* Footer */}
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


import Script from "next/script";
import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CheckoutPageContent from "../../components/CheckoutPageContent";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "Secure Checkout | ZHAEVAAH Fine Jewellery",
  description:
    "Complete your fine jewellery order with 256-bit bank encryption, insured express air delivery across India, and certified authenticity.",
};

export default function CheckoutPage() {
  return (
    <StoreProvider>
      <Script
        id="razorpay-checkout-sdk"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Main Header */}
        <Header />

        {/* Main Checkout Experience */}
        <main className="flex-1">
          <CheckoutPageContent />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Overlays */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <Toast />
      </div>
    </StoreProvider>
  );
}


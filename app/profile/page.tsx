import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UserProfileView from "../../components/UserProfileView";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";

export const metadata = {
  title: "My Account & Orders | ZHAEVAAH Fine Jewellery",
  description:
    "Manage your fine jewellery orders, live insured shipment tracking, saved delivery addresses, and personal profile details.",
};

export default function ProfilePage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Main Header */}
        <Header />

        {/* User Account / Profile Main Content */}
        <main className="flex-1">
          <UserProfileView />
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


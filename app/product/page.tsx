import TopBanner from "../../components/TopBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetailView from "../../components/ProductDetailView";
import ProductTabs from "../../components/ProductTabs";
import RelatedProducts from "../../components/RelatedProducts";
import CartDrawer from "../../components/CartDrawer";
import QuickViewModal from "../../components/QuickViewModal";
import SearchModal from "../../components/SearchModal";
import Toast from "../../components/Toast";
import { StoreProvider } from "../../context/StoreContext";
import { FEATURED_DETAILED_PRODUCT } from "../../data/products";

export default function ProductPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Main Header */}
        <Header />

        {/* Main Product Details */}
        <main className="flex-1">
          <ProductDetailView product={FEATURED_DETAILED_PRODUCT} />
          <ProductTabs product={FEATURED_DETAILED_PRODUCT} />
          <RelatedProducts />
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


import TopBanner from "../../../components/TopBanner";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductDetailView from "../../../components/ProductDetailView";
import ProductTabs from "../../../components/ProductTabs";
import RelatedProducts from "../../../components/RelatedProducts";
import CartDrawer from "../../../components/CartDrawer";
import QuickViewModal from "../../../components/QuickViewModal";
import SearchModal from "../../../components/SearchModal";
import Toast from "../../../components/Toast";
import { StoreProvider } from "../../../context/StoreContext";
import { getProductById } from "../../../data/products";

export function generateStaticParams() {
  return [
    { id: "blue-topaz-ring" },
    { id: "prod-1" },
    { id: "prod-2" },
    { id: "prod-3" },
    { id: "prod-4" },
    { id: "top-1" },
    { id: "top-2" },
    { id: "top-3" },
    { id: "top-4" },
    { id: "week-1" },
    { id: "week-2" },
    { id: "week-3" },
    { id: "week-4" },
  ];
}

export default async function DynamicProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Header */}
        <Header />

        {/* Dynamic Product Detail Content */}
        <main className="flex-1">
          <ProductDetailView product={product} />
          <ProductTabs product={product} />
          <RelatedProducts />
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

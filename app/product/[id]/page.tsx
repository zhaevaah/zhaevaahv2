import TopBanner from "../../../components/TopBanner";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductDetailView from "../../../components/ProductDetailView";
import ProductTabs from "../../../components/ProductTabs";
import LifestyleEditsSection from "../../../components/LifestyleEditsSection";
import ClientReviews from "../../../components/ClientReviews";
import RelatedProducts from "../../../components/RelatedProducts";
import CartDrawer from "../../../components/CartDrawer";
import QuickViewModal from "../../../components/QuickViewModal";
import SearchModal from "../../../components/SearchModal";
import Toast from "../../../components/Toast";
import { StoreProvider } from "../../../context/StoreContext";
import { apiGetProduct } from "../../../lib/api";
import { DetailedProduct } from "../../../data/products";

export default async function DynamicProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product: DetailedProduct | null = null;

  try {
    const res = await apiGetProduct(id);
    if (res.success && res.product) {
      product = res.product as DetailedProduct;
    }
  } catch (err) {
    console.warn("Could not fetch product from backend API:", err);
  }

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#1C1208] font-poppins selection:bg-[#B8933F]/20 selection:text-[#1C1208]">
        {/* Upper Banner */}
        <TopBanner />

        {/* Header */}
        <Header />

        {/* Dynamic Product Detail Content */}
        <main className="flex-1">
          {product ? (
            <>
              <ProductDetailView product={product} />
              <ProductTabs product={product} />
              <LifestyleEditsSection />
              <ClientReviews />
              <RelatedProducts />
            </>
          ) : (
            <div className="max-w-xl mx-auto py-24 px-4 text-center">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1208] mb-3">
                Product Not Found
              </h2>
              <p className="text-sm text-[#767069] mb-6 font-light">
                The requested jewellery piece does not exist in our active vault or has been removed.
              </p>
              <a
                href="/women"
                className="px-6 py-3 bg-[#B8933F] hover:bg-[#D4AF37] text-white text-xs font-semibold uppercase tracking-wider rounded-full inline-block transition-all shadow-md"
              >
                Explore Women&apos;s Collection
              </a>
            </div>
          )}
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

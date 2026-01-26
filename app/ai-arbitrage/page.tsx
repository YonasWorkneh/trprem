"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import AutomatedTradingCard from "@/app/components/arbitrage/AutomatedTradingCard";
import ArbitrageProductCard from "@/app/components/arbitrage/ArbitrageProductCard";
import LoadingState from "@/app/components/market/LoadingState";
import ErrorState from "@/app/components/market/ErrorState";
import { fetchArbitrageProducts } from "@/lib/services/arbitrageService";
import type { ArbitrageProduct } from "@/lib/types/arbitrage";
import { toast } from "sonner";

export default function AIArbitragePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ArbitrageProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchArbitrageProducts();
    if (result.error) {
      setError(result.error);
    } else {
      setProducts(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await loadProducts();
    };
    fetchProducts();
  }, []);


  const handleStartHosting = (productId: string) => {
    // TODO: Implement hosting logic
    toast.success(`Starting hosting for product ${productId}`);
    // router.push(`/ai-arbitrage/${productId}/host`);
  };

  const handleMyHosting = () => {
    router.push("/ai-arbitrage/my-hosting");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">AI Arbitrage</h1>
            </div>
            <button
              onClick={handleMyHosting}
              className="bg-[#F4D03F] text-yellow-900 px-4 py-2 rounded-xl font-semibold hover:bg-[#F1C40F] transition-colors text-sm"
            >
              My Hosting
            </button>
          </div>

          {/* Automated Trading Card */}
          <AutomatedTradingCard />

          {/* Products List */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error.message || "Failed to load arbitrage products"}
              onRetry={loadProducts}
            />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No arbitrage products available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ArbitrageProductCard
                  key={product.id}
                  product={product}
                  onStartHosting={handleStartHosting}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

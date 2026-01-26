"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import HostingTabs from "@/app/components/hosting/HostingTabs";
import EmptyHostingState from "@/app/components/hosting/EmptyHostingState";
import LoadingState from "@/app/components/market/LoadingState";
import ErrorState from "@/app/components/market/ErrorState";
import { fetchHostingOrders } from "@/lib/services/hostingService";
import type { HostingOrder } from "@/lib/types/hosting";

export default function MyHostingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"running" | "ended">("running");
  const [orders, setOrders] = useState<HostingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchHostingOrders(activeTab);
    if (result.error) {
      setError(result.error);
    } else {
      setOrders(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 py-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Hosting</h1>
          </div>

          {/* Tabs */}
          <HostingTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error.message || "Failed to load hosting orders"}
              onRetry={loadOrders}
            />
          ) : orders.length === 0 ? (
            <EmptyHostingState status={activeTab} />
          ) : (
            <div className="space-y-4">
              {/* TODO: Add HostingOrderCard component when orders are available */}
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                >
                  <p className="text-sm text-gray-600">
                    Order: {order.productCode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Wallet, TrendingUp } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileData } from "@/lib/services/profileService";
import { toast } from "sonner";

export default function AssetsPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [assetCount, setAssetCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [portfolioChange, setPortfolioChange] = useState(0);

  const loadPortfolioData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await getProfileData(user.id);
      if (result.success && result.data) {
        setTotalPortfolioValue(result.data.balance.totalBalance);
        // TODO: Fetch actual asset count from API
        setAssetCount(0);
        // TODO: Fetch actual portfolio change from API
        setPortfolioChange(0);
      }
    } catch (error) {
      console.error("Failed to load portfolio data:", error);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchPortfolioData = async () => {
        await loadPortfolioData();
      };
      fetchPortfolioData();
    }
  }, [isAuthenticated, user, loadPortfolioData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPortfolioData();
    setIsRefreshing(false);
    toast.success("Portfolio refreshed");
  };

  const handleStartTrading = () => {
    router.push("/transactions");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Please log in to view your assets</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Assets</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-700 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {/* Total Portfolio Value Card */}
          <div className="bg-(--theme-primary-bg-5) rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-theme-primary" />
                  <span className="text-sm font-medium text-gray-700">
                    Total Portfolio Value
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${totalPortfolioValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm text-gray-600">
                  {assetCount} {assetCount === 1 ? "asset" : "assets"}
                </div>
              </div>
            </div>
          </div>

          {/* Assets Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Assets</h2>
              <p className="text-sm text-gray-600">
                View and manage your cryptocurrency holdings
              </p>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-(--theme-primary-bg-10) flex items-center justify-center mb-4">
                <Wallet className="w-10 h-10 text-theme-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No assets yet
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
                Start trading to build your portfolio
              </p>
              <button
                onClick={handleStartTrading}
                className="bg-theme-primary text-theme-primary-text px-6 py-3 rounded-xl font-medium hover:bg-theme-primary-hover transition-colors cursor-pointer"
              >
                Start Trading
              </button>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

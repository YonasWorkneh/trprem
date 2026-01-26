"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileData } from "@/lib/services/profileService";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import TradingTypeTabs from "@/app/components/transactions/TradingTypeTabs";
import OrderTabs from "@/app/components/transactions/OrderTabs";
import BalanceSummaryCard from "@/app/components/transactions/BalanceSummaryCard";
import ProfitCard from "@/app/components/transactions/ProfitCard";
import { toast } from "sonner";
import type { Profile } from "@/lib/types/auth";

export default function TransactionsPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTradingType, setActiveTradingType] = useState<"contract" | "option" | "spot">("contract");
  const [activeOrderTab, setActiveOrderTab] = useState<"positions" | "historical">("positions");
  const [totalBalance, setTotalBalance] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileData();
    }
  }, [isAuthenticated, user]);

  const loadProfileData = async () => {
    if (!user?.id) return;

    try {
      const result = await getProfileData(user.id);
      if (result.success && result.data) {
        setProfile(result.data.profile);
        setTotalBalance(result.data.balance.totalBalance);
        // TODO: Fetch actual profit data from API
        setTodayProfit(0);
        setTotalProfit(0);
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProfileData();
    setIsRefreshing(false);
    toast.success("Balance refreshed");
  };

  const handleStartContractTrade = () => {
    // TODO: Navigate to contract trading page
    toast.info("Contract trading feature coming soon");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#F4D03F] border-t-transparent rounded-full animate-spin"></div>
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
            <p className="text-gray-500 mb-4">Please log in to view transactions</p>
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
        <div className="px-4 max-w-7xl mx-auto">
          {/* Trading Type Tabs */}
          <div className="pt-4 pb-2">
            <TradingTypeTabs
              activeTab={activeTradingType}
              onTabChange={setActiveTradingType}
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <BalanceSummaryCard
              totalBalance={totalBalance}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
            <ProfitCard title="Today's Profit" value={todayProfit} />
            <ProfitCard title="Total Profit" value={totalProfit} />
          </div>

          {/* Start Contract Trade Button */}
          <button
            onClick={handleStartContractTrade}
            className="w-full bg-[#F4D03F] text-yellow-900 py-4 rounded-xl font-semibold hover:bg-[#F1C40F] transition-colors mb-6"
          >
            Start Contract Trade
          </button>

          {/* Order Tabs */}
          <OrderTabs
            activeTab={activeOrderTab}
            onTabChange={setActiveOrderTab}
          />

          {/* Content Area */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[200px]">
            {activeOrderTab === "positions" ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">No open positions</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">No historical orders</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ContentFilters from "./components/ContentFilters";
import BottomNavigation from "./components/BottomNavigation";
import BalanceCard from "./components/home/BalanceCard";
import FeatureGrid from "./components/home/FeatureGrid";
import MarketTabs from "./components/home/MarketTabs";
import PromoCarousel from "./components/home/PromoCarousel";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileData } from "@/lib/services/profileService";

export default function Page() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadBalance = async () => {
        setLoading(true);
        const result = await getProfileData(user.id);
        if (result.success && result.data) {
          setBalance(result.data.balance.totalBalance);
        }
        setLoading(false);
      };
      loadBalance();
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }, [isAuthenticated, user]);

  const handleRefresh = async () => {
    if (user && !isRefreshing) {
      setIsRefreshing(true);
      const result = await getProfileData(user.id);
      if (result.success && result.data) {
        setBalance(result.data.balance.totalBalance);
      }
      setIsRefreshing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 px-4 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        {isAuthenticated ? (
          <>
            <BalanceCard
              totalBalance={balance}
              todayChange={0}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
            <FeatureGrid />
            <MarketTabs />
            <PromoCarousel />
          </>
        ) : (
          <>
            <HeroSection />
            <ContentFilters />
          </>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
}
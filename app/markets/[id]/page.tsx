"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import CoinDetailHeader from "@/app/components/market/CoinDetailHeader";
import AboutSection from "@/app/components/market/AboutSection";
import WatchTradeActions from "@/app/components/market/WatchTradeActions";
import TradingViewChart from "@/app/components/market/TradingViewChart";
import { fetchCoinById } from "@/lib/services/marketService";
import type { MarketData } from "@/lib/types/market";

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coinId = params.id as string;
  const [coin, setCoin] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState<string>("15");

  useEffect(() => {
    const loadCoin = async () => {
      setLoading(true);
      const result = await fetchCoinById(coinId);
      if (result.data) {
        setCoin(result.data);
      }
      setLoading(false);
    };

    if (coinId) {
      void loadCoin();
    }
  }, [coinId]);

  if (loading) {
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

  if (!coin) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 px-4 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Coin Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The coin you&apos;re looking for doesn&apos;t exist or is no longer available.
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Go Back
            </button>
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
        <CoinDetailHeader coin={coin} />
        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <TradingViewChart symbol={coin.symbol} interval={activeTimeframe} />
          </div>
        </div>
        <AboutSection coin={coin} />
        <WatchTradeActions coinId={coinId} />
      </main>
      <BottomNavigation />
    </div>
  );
}

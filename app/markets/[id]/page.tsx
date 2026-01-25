"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import CoinDetailHeader from "@/app/components/market/CoinDetailHeader";
import ChartControls from "@/app/components/market/ChartControls";
import OHLCData from "@/app/components/market/OHLCData";
import AboutSection from "@/app/components/market/AboutSection";
import WatchTradeActions from "@/app/components/market/WatchTradeActions";
import TradingViewChart from "@/app/components/market/TradingViewChart";
import { fetchCoinById } from "@/lib/services/marketService";
import type { MarketData } from "@/lib/types/market";

export default function MarketDetailPage() {
  const params = useParams();
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
          <div className="text-center">
            <p className="text-gray-500 mb-4">Coin not found</p>
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

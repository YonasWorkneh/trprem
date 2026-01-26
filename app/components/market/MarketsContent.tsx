"use client";

import { useState } from "react";
import { useMarketData } from "@/lib/hooks/useMarketData";
import type { MarketFilter } from "@/lib/types/market";
import MarketsCoinItem from "./MarketsCoinItem";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

interface Tab {
  id: MarketFilter;
  label: string;
}

const tabs: Tab[] = [
  { id: "hot", label: "Hot" },
  { id: "24h-list", label: "24h list" },
  { id: "rise", label: "Rise" },
  { id: "loss", label: "Loss" },
];

export default function MarketsContent() {
  const [activeTab, setActiveTab] = useState<MarketFilter>("hot");
  const { data, loading, error, refetch } = useMarketData(activeTab);

  return (
    <div className="w-full">
      <div className="px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <button className="bg-[#F4D03F] text-yellow-900 px-4 py-2 rounded-full text-sm font-normal hover:bg-[#F1C40F]">
              Crypto
            </button>
          </div>
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 font-normal text-sm cursor-pointer ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-[#F4D03F]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full px-4 pb-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {data.slice(0, 50).map((item) => (
                  <MarketsCoinItem key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

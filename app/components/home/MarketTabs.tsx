"use client";

import { useState, useEffect } from "react";
import type { MarketFilter, MarketData } from "@/lib/types/market";
import MarketDataList from "../market/MarketDataList";
import MarketDataItem from "../market/MarketDataItem";
import { fetchGoldData, fetchForexData, fetchNFTData } from "@/lib/services/marketService";
import LoadingState from "../market/LoadingState";
import ErrorState from "../market/ErrorState";
import EmptyState from "../market/EmptyState";

type MarketCategory = "crypto" | "gold" | "forex" | "nft";

interface CategoryTab {
  id: MarketCategory;
  label: string;
}

interface FilterTab {
  id: MarketFilter;
  label: string;
}

const categories: CategoryTab[] = [
  { id: "crypto", label: "Crypto" },
  { id: "gold", label: "GOLD" },
  { id: "forex", label: "Forex" },
  { id: "nft", label: "NFT" },
];

const cryptoFilters: FilterTab[] = [
  { id: "hot", label: "Hot" },
  { id: "24h-list", label: "24h list" },
  { id: "rise", label: "Rise" },
  { id: "loss", label: "Loss" },
];

export default function MarketTabs() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>("crypto");
  const [activeFilter, setActiveFilter] = useState<MarketFilter>("hot");
  const [otherCategoryData, setOtherCategoryData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (activeCategory === "crypto") return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      let result;

      if (activeCategory === "gold") {
        result = await fetchGoldData();
      } else if (activeCategory === "forex") {
        result = await fetchForexData();
      } else if (activeCategory === "nft") {
        result = await fetchNFTData();
      } else {
        setLoading(false);
        return;
      }

      if (result.error) {
        setError(result.error);
      } else {
        setOtherCategoryData(result.data);
      }
      setLoading(false);
    };

    void loadData();
  }, [activeCategory]);

  return (
    <div className="w-full">
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  if (category.id === "crypto") setOtherCategoryData([]);
                }}
                className={`px-4 py-2 rounded-full text-sm font-normal transition-colors cursor-pointer ${
                  activeCategory === category.id
                    ? "bg-[var(--theme-primary)] text-[var(--theme-primary-text)]"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          {activeCategory === "crypto" && (
            <nav className="flex gap-6">
              {cryptoFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`pb-2 font-normal text-sm cursor-pointer transition-colors ${
                    activeFilter === filter.id
                      ? "text-gray-900 border-b-2 border-[var(--theme-primary)]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
      {activeCategory === "crypto" && (
        <div className="mt-4">
          <MarketDataList filter={activeFilter} />
        </div>
      )}
      {activeCategory !== "crypto" && (
        <div className="mt-4">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error.message} onRetry={() => {
              setActiveCategory(activeCategory);
            }} />
          ) : otherCategoryData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="w-full px-4 pb-4">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {otherCategoryData.map((item) => (
                    <MarketDataItem key={item.id} data={item} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

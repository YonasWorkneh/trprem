"use client";

import { useState } from "react";
import type { MarketFilter } from "@/lib/types/market";
import MarketDataList from "../market/MarketDataList";

type MarketCategory = "crypto" | "gold" | "forex" | "stock";

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
  { id: "stock", label: "Stock" },
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

  return (
    <div className="w-full">
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-normal transition-colors ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white"
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
                      ? "text-gray-900 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </nav>
          )}
          {activeCategory !== "crypto" && (
            <div className="py-8 text-center">
              <p className="text-gray-500 text-sm">
                {categories.find((c) => c.id === activeCategory)?.label} market
                data coming soon
              </p>
            </div>
          )}
        </div>
      </div>
      {activeCategory === "crypto" && (
        <div className="mt-4">
          <MarketDataList filter={activeFilter} />
        </div>
      )}
    </div>
  );
}

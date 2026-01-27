"use client";

import { useState } from "react";
import type { MarketFilter } from "@/lib/types/market";
import MarketDataList from "./market/MarketDataList";

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

export default function ContentFilters() {
  const [activeTab, setActiveTab] = useState<MarketFilter>("hot");

  return (
    <div className="w-full">
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <button className="bg-[#F4D03F] text-yellow-900 px-4 py-2 rounded-full text-sm font-normal hover:bg-[#F1C40F] cursor-pointer">
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
        <MarketDataList filter={activeTab} />
      </div>
    </div>
  );
}

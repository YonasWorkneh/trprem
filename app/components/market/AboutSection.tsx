"use client";

import type { MarketData } from "@/lib/types/market";

interface AboutSectionProps {
  coin: MarketData;
}

export default function AboutSection({ coin }: AboutSectionProps) {
  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
        About {coin.symbol.toUpperCase()}
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Track the latest price and market data for {coin.symbol.toUpperCase()}. This asset
        is available for trading on our platform with competitive spreads and instant
        execution.
      </p>
      </div>
    </div>
  );
}

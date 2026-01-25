"use client";

import type { MarketData } from "@/lib/types/market";

interface OHLCDataProps {
  coin: MarketData;
}

export default function OHLCData({ coin }: OHLCDataProps) {
  const priceChange = coin.priceChangePercentage24h || 0;
  const isPositive = priceChange >= 0;

  // Use actual 24h data from CoinGecko
  const close = coin.currentPrice;
  const high = coin.high24h;
  const low = coin.low24h;
  // Calculate open from price change
  const open = close - coin.priceChange24h;

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {coin.name} / U.S. Dollar
          </span>
          <span className="text-gray-500">15</span>
          <span className="text-gray-500">OANDA</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
        <span>
          O {formatPrice(open)}
        </span>
        <span>
          H {formatPrice(high)}
        </span>
        <span>
          L {formatPrice(low)}
        </span>
        <span>
          C {formatPrice(close)}
        </span>
        <span
          className={`font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {formatPrice(close - open)} ({isPositive ? "+" : ""}
          {priceChange.toFixed(2)}%)
        </span>
      </div>
      </div>
    </div>
  );
}

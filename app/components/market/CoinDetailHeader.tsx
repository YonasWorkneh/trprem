"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import type { MarketData } from "@/lib/types/market";

interface CoinDetailHeaderProps {
  coin: MarketData;
}

export default function CoinDetailHeader({ coin }: CoinDetailHeaderProps) {
  const router = useRouter();
  const [isWatched, setIsWatched] = useState(false);

  const category = "Crypto"; // Could be determined from coin data

  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWatched(!isWatched)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star
              className={`w-5 h-5 ${
                isWatched ? "fill-yellow-400 text-yellow-400" : "text-gray-700"
              }`}
            />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{coin.symbol.toUpperCase()}</h1>
        <span className="px-2 py-1 bg-yellow-100 text-gray-700 text-xs font-medium rounded">
          {category}
        </span>
      </div>
      </div>
    </div>
  );
}

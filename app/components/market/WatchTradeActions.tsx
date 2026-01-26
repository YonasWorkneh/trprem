"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface WatchTradeActionsProps {
  coinId: string;
}

export default function WatchTradeActions({ coinId }: WatchTradeActionsProps) {
  const router = useRouter();
  const [isWatched, setIsWatched] = useState(false);

  const handleWatch = () => {
    setIsWatched(!isWatched);
    // TODO: Implement watchlist functionality
  };

  const handleTrade = () => {
    router.push(`/trade/${coinId}`);
  };

  return (
    <div className="px-4 py-4 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex gap-3">
        <button
          onClick={handleWatch}
          className="flex-1 bg-white border border-gray-300 cursor-pointer text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>Watch</span>
        </button>
        <button
          onClick={handleTrade}
          className="flex-1 bg-[#F4D03F] cursor-pointer text-yellow-900 py-3 rounded-xl font-medium hover:bg-[#F1C40F] transition-colors"
        >
          Trade
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff, RefreshCw, ArrowUpDown } from "lucide-react";

interface SpotBalanceCardProps {
  totalBalance: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function SpotBalanceCard({
  totalBalance,
  onRefresh,
  isRefreshing = false,
}: SpotBalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Available Balance</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-gray-900">$</span>
            <span className="text-2xl font-bold text-gray-900 min-w-[120px]">
              {isBalanceVisible
                ? totalBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "*****"}
            </span>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
            >
              {isBalanceVisible ? (
                <EyeOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh balance"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-600 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      <button
        className="w-10 h-10 bg-[#F4D03F] rounded-lg flex items-center justify-center hover:bg-[#F1C40F] transition-colors"
        aria-label="Exchange"
      >
        <ArrowUpDown className="w-5 h-5 text-yellow-900" />
      </button>
    </div>
  );
}

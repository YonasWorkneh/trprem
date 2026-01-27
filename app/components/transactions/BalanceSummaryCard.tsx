"use client";

import { useState } from "react";
import { Wallet, Eye, EyeOff, RefreshCw } from "lucide-react";

interface BalanceSummaryCardProps {
  totalBalance: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function BalanceSummaryCard({
  totalBalance,
  onRefresh,
  isRefreshing = false,
}: BalanceSummaryCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Wallet className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Total Balance</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">
          {isBalanceVisible
            ? `$${totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "$*****"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
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
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
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
  );
}

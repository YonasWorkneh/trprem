"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Eye, EyeOff, Link as LinkIcon, ArrowUpRight, Plus } from "lucide-react";

interface BalanceCardProps {
  totalBalance: number;
  todayChange?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function BalanceCard({
  totalBalance,
  todayChange = 0,
  onRefresh,
  isRefreshing = false,
}: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  const formattedBalance = isVisible
    ? `$${totalBalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "$****";

  const formattedChange = isVisible
    ? `${todayChange >= 0 ? "+" : ""}${todayChange.toFixed(2)}%`
    : "****";

  return (
    <div className="w-full px-4 pt-6 pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm text-gray-600">Total Balance</span>
          <LinkIcon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl font-bold text-gray-900">{formattedBalance}</span>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            aria-label={isVisible ? "Hide balance" : "Show balance"}
          >
            {isVisible ? (
              <EyeOff className="w-5 h-5 text-gray-600" />
            ) : (
              <Eye className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mb-6">
          {todayChange >= 0 ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
          <span
            className={`text-sm font-medium ${
              todayChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formattedChange} Today
          </span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/deposit"
            className="flex-1 bg-[var(--theme-primary)] text-yellow-900 py-4 rounded-xl font-medium hover:bg-[#F1C40F] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Deposit</span>
          </Link>
          <Link
            href="/withdraw"
            className="flex-1 bg-white border border-gray-300 text-gray-900 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

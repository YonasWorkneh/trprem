"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, DollarSign, Search, FileText } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";

type TransactionFilter = "all" | "deposit" | "withdraw" | "trades" | "fees";

export default function TransactionHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const summaryCards = [
    {
      id: "deposits",
      label: "DEPOSITS",
      amount: 0,
      count: 0,
      icon: ArrowDown,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "withdrawals",
      label: "WITHDRAWALS",
      amount: 0,
      count: 0,
      icon: ArrowUp,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      id: "trades",
      label: "TRADES",
      amount: 0,
      count: 0,
      icon: ArrowUpDown,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "fees",
      label: "FEES",
      amount: 0,
      count: 0,
      icon: DollarSign,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const filters: { id: TransactionFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "deposit", label: "Deposit" },
    { id: "withdraw", label: "Withdraw" },
    { id: "trades", label: "Trades" },
    { id: "fees", label: "Fees" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-7xl mx-auto">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-6">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`${card.bgColor} rounded-xl p-4 border border-gray-200`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    <span className="text-xs font-medium text-gray-700 uppercase">
                      {card.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${card.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {card.count} {card.id === "trades" ? "trades" : "transactions"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter Tabs and Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`pb-2 text-sm font-normal transition-colors cursor-pointer ${
                    activeFilter === filter.id
                      ? "text-[var(--theme-primary-text)] border-b-2 border-[var(--theme-primary)]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
              />
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                You haven&apos;t made any transactions in this category yet.
              </p>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

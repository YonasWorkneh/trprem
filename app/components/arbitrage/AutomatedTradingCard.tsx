"use client";

import { TrendingUp } from "lucide-react";

export default function AutomatedTradingCard() {
  return (
     <div className="bg-[var(--theme-primary-bg-5)] rounded-2xl p-4 py-8 border border-gray-200 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white border border-[var(--theme-primary)] flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-[var(--theme-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--theme-primary-text)] mb-1">
            Automated Trading
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered arbitrage strategies earning daily returns on your crypto
          </p>
        </div>
      </div>
    </div>
  );
}

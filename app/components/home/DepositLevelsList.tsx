"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface DepositLevel {
  id: string;
  name: string;
  minDeposit: number;
  maxDeposit: number;
  returnRate: number;
}

const levels: DepositLevel[] = [
  { id: "level1", name: "Level 1", minDeposit: 500, maxDeposit: 5000, returnRate: 12 },
  { id: "level2", name: "Level 2", minDeposit: 3000, maxDeposit: 10000, returnRate: 15 },
  { id: "level3", name: "Level 3", minDeposit: 20000, maxDeposit: 50000, returnRate: 18 },
  { id: "level4", name: "Level 4", minDeposit: 50000, maxDeposit: 80000, returnRate: 22 },
  { id: "level5", name: "Level 5", minDeposit: 80000, maxDeposit: 150000, returnRate: 26 },
  { id: "level6", name: "Level 6", minDeposit: 150000, maxDeposit: 500000, returnRate: 30 },
  { id: "level7", name: "Level 7", minDeposit: 500000, maxDeposit: 1000000, returnRate: 35 },
];

function formatRange(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
  return `${fmt(min)} - ${fmt(max)}`;
}

export default function DepositLevelsList() {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit levels</h2>
        <div className="space-y-3">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/deposit?level=${level.id}`}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-white)] hover:bg-[var(--theme-primary-bg-10)] active:bg-[var(--theme-primary-bg-16)] transition-colors cursor-pointer group"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-semibold text-gray-900">{level.name}</span>
                <div className="flex flex-col gap-0.5 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span>Return Rate</span>
                    <span className="font-medium text-[var(--theme-primary-text)]">
                      {level.returnRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Capital</span>
                    <span className="font-medium text-[var(--theme-primary-text)]">
                      {formatRange(level.minDeposit, level.maxDeposit)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] flex items-center justify-center group-hover:bg-[var(--theme-primary-hover)] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

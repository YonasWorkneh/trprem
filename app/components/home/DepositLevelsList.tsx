"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface DepositLevel {
  id: string;
  name: string;
  minDeposit: number;
  description?: string;
}

const levels: DepositLevel[] = [
  { id: "level1", name: "Level 1", minDeposit: 100 },
  { id: "level2", name: "Level 2", minDeposit: 250 },
  { id: "level3", name: "Level 3", minDeposit: 500 },
  { id: "level4", name: "Level 4", minDeposit: 1000 },
  { id: "level5", name: "Level 5", minDeposit: 2500 },
  { id: "level6", name: "Level 6", minDeposit: 5000 },
  { id: "level7", name: "Level 7", minDeposit: 10000 },
];

function formatDeposit(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `$${amount}`;
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
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-semibold text-gray-900">{level.name}</span>
                <span className="text-sm text-[var(--theme-primary-text)] font-medium">
                  Min. deposit {formatDeposit(level.minDeposit)}
                </span>
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

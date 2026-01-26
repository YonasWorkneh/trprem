"use client";

import Link from "next/link";
import { Cpu, Layers, DollarSign, Landmark, LayoutGrid, WalletMinimal, List, Zap } from "lucide-react";

interface Feature {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const features: Feature[] = [
  {
    id: "ai-arbitrage",
    label: "AI Arbitrage",
    icon: <Cpu className="w-6 h-6" />,
    href: "/ai-arbitrage",
  },
  {
    id: "mining-pool",
    label: "Mining pool",
    icon: <Layers className="w-6 h-6" />,
    href: "/mining-pool",
  },
  {
    id: "deposit",
    label: "Deposit",
    icon: <DollarSign className="w-6 h-6" />,
    href: "/deposit",
  },
  {
    id: "loans",
    label: "Loans",
    icon: <Landmark className="w-6 h-6" />,
    href: "/loans",
  },
  {
    id: "options",
    label: "Options",
    icon: <LayoutGrid className="w-6 h-6" />,
    href: "/options",
  },
  {
    id: "withdraw",
    label: "Withdraw",
    icon: <WalletMinimal className="w-6 h-6" />,
    href: "/withdraw",
  },
  {
    id: "assets",
    label: "Assets",
    icon: <List className="w-6 h-6" />,
    href: "/assets",
  },
  {
    id: "fast-trade",
    label: "Fast Trade",
    icon: <Zap className="w-6 h-6" />,
    href: "/fast-trade",
  },
];

export default function FeatureGrid() {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="flex flex-col items-center gap-2 p-4 bg-[rgba(244,208,63,0.1)] rounded-2xl border border-gray-200 hover:bg-[rgba(244,208,63,0.2)] transition-colors"
            >
              <div className="text-yellow-500">{feature.icon}</div>
              <span className="text-xs text-yellow-700 text-center font-medium">
                {feature.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

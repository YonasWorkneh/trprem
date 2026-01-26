"use client";

import { TrendingUp } from "lucide-react";

interface ProfitCardProps {
  title: string;
  value: number;
}

export default function ProfitCard({ title, value }: ProfitCardProps) {
  const isPositive = value >= 0;
  const displayValue = isPositive ? `+$${value.toFixed(2)}` : `$${value.toFixed(2)}`;

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">{title}</span>
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>
      <span className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {displayValue}
      </span>
    </div>
  );
}

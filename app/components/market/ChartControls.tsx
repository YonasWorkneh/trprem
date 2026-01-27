"use client";

import { useState, useEffect } from "react";
import { BarChart3, LineChart, TrendingUp, Pencil, Plus } from "lucide-react";

type Timeframe = "1m" | "15m" | "30m" | "1h";

const timeframes: Timeframe[] = ["1m", "15m", "30m", "1h"];

interface ChartControlsProps {
  onTimeframeChange?: (timeframe: string) => void;
}

export default function ChartControls({ onTimeframeChange }: ChartControlsProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("15m");

  useEffect(() => {
    // Convert timeframe to TradingView format
    // "1m" -> "1", "15m" -> "15", "30m" -> "30", "1h" -> "60"
    let interval: string;
    if (activeTimeframe === "1h") {
      interval = "60";
    } else {
      interval = activeTimeframe.replace("m", "");
    }
    onTimeframeChange?.(interval);
  }, [activeTimeframe, onTimeframeChange]);

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setActiveTimeframe(tf);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTimeframe === tf
                  ? "bg-[var(--theme-primary)] text-[var(--theme-primary-text)]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Candlestick chart"
          >
            <BarChart3 className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Bar chart"
          >
            <TrendingUp className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Line chart"
          >
            <LineChart className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Drawing tools"
          >
            <Pencil className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
            aria-label="Indicators"
          >
            <Plus className="w-4 h-4 text-gray-700" />
            <span className="text-xs text-gray-700">Indicators</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

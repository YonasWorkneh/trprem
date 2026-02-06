"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchNFTChartData } from "@/lib/services/marketService";

interface NFTChartProps {
  nftId: string;
  days?: number;
}

interface ChartDataPoint {
  timestamp: number;
  price: number;
  date: string;
}

export default function NFTChart({ nftId, days = 7 }: NFTChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchNFTChartData(nftId, days);

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setError("No chart data available");
        setLoading(false);
        return;
      }

      // Transform data for recharts
      const transformedData: ChartDataPoint[] = result.data.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return {
          timestamp,
          price: Number(price),
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };
      });

      setChartData(transformedData);
      setLoading(false);
    };

    if (nftId) {
      void loadChartData();
    }
  }, [nftId, days]);

  if (loading) {
    return (
      <div className="w-full h-[400px] rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (error || chartData.length === 0) {
    const isProAPIError = error?.includes("Pro API");
    return (
      <div className="w-full h-[400px] rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
        <div className="text-center px-4">
          <div className="text-gray-500 mb-2 font-medium">Chart data unavailable</div>
          <div className="text-sm text-gray-400">
            {isProAPIError
              ? "NFT historical chart data requires CoinGecko Pro API subscription"
              : error || "Historical data not available for this NFT"}
          </div>
        </div>
      </div>
    );
  }

  // Format price for tooltip
  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full h-[400px] rounded-lg border border-gray-200 bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(1)}k`;
              }
              return `$${value.toFixed(0)}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#374151", fontWeight: 600, marginBottom: "4px" }}
            formatter={(value) => (value != null ? formatPrice(value) : "")}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--theme-primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "var(--theme-primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

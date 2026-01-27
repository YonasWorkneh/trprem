"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { MarketData } from "@/lib/types/market";

interface MarketDataItemProps {
  data: MarketData;
}

function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toFixed(2);
  }
  return price.toFixed(6);
}

function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return `$${(volume / 1000000000).toFixed(2)}B`;
  }
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(2)}K`;
  }
  return `$${volume.toFixed(2)}`;
}

function getShortenedName(name: string): string {
  // Get first 2-3 characters, uppercase
  const cleaned = name.trim().replace(/[^a-zA-Z0-9]/g, "");
  if (cleaned.length <= 2) {
    return cleaned.toUpperCase();
  }
  return cleaned.substring(0, 2).toUpperCase();
}

function CoinIcon({ data }: { data: MarketData }) {
  const [imageError, setImageError] = React.useState(false);
  const hasImage = data.image && data.image.trim() !== "" && !imageError;

  if (hasImage) {
    return (
      <Image
        src={data.image}
        alt={data.name}
        width={32}
        height={32}
        className="rounded-full shrink-0"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="rounded-full w-8 h-8 flex items-center justify-center bg-[var(--theme-primary)] text-[var(--theme-primary-text)] font-semibold text-xs shrink-0">
      {getShortenedName(data.name)}
    </div>
  );
}

export default function MarketDataItem({ data }: MarketDataItemProps) {
  const isPositive = data.priceChangePercentage24h >= 0;

  return (
    <Link
      href={`/markets/${data.id}`}
      className="flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <CoinIcon data={data} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{data.symbol}</span>
          </div>
          <div className="text-xs text-gray-500">
            Vol: {formatVolume(data.totalVolume)}
          </div>
        </div>
      </div>
      <div className="flex-1 text-right">
        <div className="font-medium text-gray-900 mb-1">
          ${formatPrice(data.currentPrice)}
        </div>
        <div
          className={`text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {data.priceChangePercentage24h.toFixed(2)}%
        </div>
      </div>
    </Link>
  );
}

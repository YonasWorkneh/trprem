import Image from "next/image";
import type { MarketData } from "@/lib/types/market";

interface MarketsCoinItemProps {
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

export default function MarketsCoinItem({ data }: MarketsCoinItemProps) {
  const isPositive = data.priceChangePercentage24h >= 0;

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Image
          src={data.image}
          alt={data.name}
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{data.symbol}</span>
          </div>
          <div className="text-xs text-gray-500 truncate">
            Vol: {formatVolume(data.totalVolume)}
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
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
    </div>
  );
}

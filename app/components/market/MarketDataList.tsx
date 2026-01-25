"use client";

import { useMarketData } from "@/lib/hooks/useMarketData";
import type { MarketFilter } from "@/lib/types/market";
import MarketDataItem from "./MarketDataItem";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

interface MarketDataListProps {
  filter: MarketFilter;
}

export default function MarketDataList({ filter }: MarketDataListProps) {
  const { data, loading, error, refetch } = useMarketData(filter);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  const displayData = data.slice(0, 50);

  return (
    <div className="w-full px-4 pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {displayData.map((item) => (
            <MarketDataItem key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

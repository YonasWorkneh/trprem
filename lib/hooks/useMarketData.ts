"use client";

import { useEffect, useState } from "react";
import { fetchMarketData, filterMarketData } from "../services/marketService";
import type { MarketData, MarketFilter } from "../types/market";

interface UseMarketDataResult {
  data: MarketData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMarketData(filter: MarketFilter): UseMarketDataResult {
  const [allData, setAllData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchMarketData();
    if (result.error) {
      setError(result.error);
      setAllData([]);
    } else {
      setAllData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = filterMarketData(allData, filter);

  return {
    data: filteredData,
    loading,
    error,
    refetch: loadData,
  };
}

import type { CoinGeckoMarketData, MarketData } from "../types/market";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export interface FetchMarketDataResult {
  data: MarketData[];
  error: Error | null;
}

export async function fetchMarketData(): Promise<FetchMarketDataResult> {
  try {
    const url = new URL(`${COINGECKO_API_BASE}/coins/markets`);
    url.searchParams.append("vs_currency", "usd");
    url.searchParams.append("order", "volume_desc");
    url.searchParams.append("per_page", "250");
    url.searchParams.append("page", "1");
    url.searchParams.append("sparkline", "true");
    url.searchParams.append("price_change_percentage", "24h");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.statusText}`);
    }

    const rawData: CoinGeckoMarketData[] = await response.json();

    const marketData: MarketData[] = rawData
      .filter((item) => item.total_volume > 0)
      .map((item) => ({
        id: item.id,
        symbol: item.symbol.toUpperCase(),
        name: item.name,
        image: item.image,
        currentPrice: item.current_price,
        priceChange24h: item.price_change_24h,
        priceChangePercentage24h: item.price_change_percentage_24h,
        high24h: item.high_24h,
        low24h: item.low_24h,
        totalVolume: item.total_volume,
        marketCap: item.market_cap,
        marketCapRank: item.market_cap_rank,
        sparklineData: item.sparkline_in_7d?.price || [],
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume);

    return { data: marketData, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export function filterMarketData(
  data: MarketData[],
  filter: "hot" | "24h-list" | "rise" | "loss"
): MarketData[] {
  switch (filter) {
    case "hot":
      return data.slice(0, 20);
    case "24h-list":
      return data;
    case "rise":
      return data
        .filter((item) => item.priceChangePercentage24h > 0)
        .sort(
          (a, b) =>
            b.priceChangePercentage24h - a.priceChangePercentage24h
        );
    case "loss":
      return data
        .filter((item) => item.priceChangePercentage24h < 0)
        .sort(
          (a, b) =>
            a.priceChangePercentage24h - b.priceChangePercentage24h
        );
    default:
      return data;
  }
}

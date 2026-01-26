import type {
  ArbitrageProduct,
  FetchArbitrageProductsResult,
} from "../types/arbitrage";

// Mock API endpoint - replace with actual API endpoint when available
const ARBITRAGE_API_BASE = process.env.NEXT_PUBLIC_ARBITRAGE_API_BASE || "";

export async function fetchArbitrageProducts(): Promise<FetchArbitrageProductsResult> {
  try {
    // If API endpoint is configured, fetch from API
    if (ARBITRAGE_API_BASE) {
      const response = await fetch(`${ARBITRAGE_API_BASE}/products`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch arbitrage products: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const products: ArbitrageProduct[] = Array.isArray(rawData)
        ? rawData.map((item: any) => ({
            id: item.id || item.code,
            code: item.code || item.id,
            name: item.name || item.code,
            dailyReturn: Number(item.dailyReturn || item.daily_return || 0),
            duration: Number(item.duration || item.duration_days || 1),
            minLimit: Number(item.minLimit || item.min_limit || 0),
            maxLimit: Number(item.maxLimit || item.max_limit || 0),
            supportedCurrencies: Array.isArray(item.supportedCurrencies)
              ? item.supportedCurrencies
              : Array.isArray(item.supported_currencies)
              ? item.supported_currencies
              : ["USDT", "BTC", "ETH"],
            icon: item.icon || item.code,
          }))
        : [];

      return { data: products, error: null };
    }

    // Fallback to mock data for development
    const mockProducts: ArbitrageProduct[] = [
      {
        id: "a100",
        code: "A100",
        name: "A100",
        dailyReturn: 0.5,
        duration: 1,
        minLimit: 1000,
        maxLimit: 2999,
        supportedCurrencies: ["USDT", "BTC", "ETH"],
        icon: "A100",
      },
      {
        id: "h200",
        code: "H200",
        name: "H200",
        dailyReturn: 0.87,
        duration: 1,
        minLimit: 1000,
        maxLimit: 2999,
        supportedCurrencies: ["USDT", "BTC", "ETH"],
        icon: "H200",
      },
      {
        id: "gh350",
        code: "GH350",
        name: "GH350",
        dailyReturn: 0.99,
        duration: 7,
        minLimit: 8000,
        maxLimit: 19999,
        supportedCurrencies: ["USDT", "BTC", "ETH"],
        icon: "GH350",
      },
      {
        id: "v1",
        code: "V1",
        name: "V1",
        dailyReturn: 1.2,
        duration: 7,
        minLimit: 20000,
        maxLimit: 50001,
        supportedCurrencies: ["USDT", "BTC", "ETH"],
        icon: "V1",
      },
    ];

    return { data: mockProducts, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

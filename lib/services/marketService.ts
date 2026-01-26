import type {
  CoinGeckoMarketData,
  MarketData,
  FetchMarketDataResult,
} from "../types/market";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

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

export async function fetchCoinById(
  coinId: string
): Promise<{ data: MarketData | null; error: Error | null }> {
  try {
    const url = new URL(`${COINGECKO_API_BASE}/coins/markets`);
    url.searchParams.append("vs_currency", "usd");
    url.searchParams.append("ids", coinId);
    url.searchParams.append("sparkline", "true");
    url.searchParams.append("price_change_percentage", "24h");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch coin data: ${response.statusText}`);
    }

    const rawData: CoinGeckoMarketData[] = await response.json();

    if (rawData.length === 0) {
      return { data: null, error: null };
    }

    const item = rawData[0];
    const marketData: MarketData = {
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
    };

    return { data: marketData, error: null };
  } catch (error) {
    return {
      data: null,
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

// GOLD API - Using freegoldprice.org API
export async function fetchGoldData(): Promise<FetchMarketDataResult> {
  try {
    // Fetch current gold price from free API
    const response = await fetch(
      "https://api.freegoldprice.org/v1/gold/USD",
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      // Fallback to alternative API
      const altResponse = await fetch(
        "https://api.metals.live/v1/spot/gold",
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!altResponse.ok) {
        throw new Error("Failed to fetch gold price from all sources");
      }

      const altData = await altResponse.json();
      const currentPrice = altData.price || 0;
      const priceChange24h = altData.change || 0;
      const priceChangePercentage24h = altData.changePercent || 0;

      return {
        data: [
          {
            id: "gold-oz",
            symbol: "XAU",
            name: "Gold (Ounce)",
            image: "https://assets.coingecko.com/coins/images/1/large/gold.png",
            currentPrice,
            priceChange24h,
            priceChangePercentage24h,
            high24h: currentPrice * 1.01,
            low24h: currentPrice * 0.99,
            totalVolume: 0,
            marketCap: 0,
            marketCapRank: 1,
            sparklineData: [],
          },
        ],
        error: null,
      };
    }

    const data = await response.json();
    const currentPrice = data.price || data.rate || 0;
    
    // Calculate 24h change if available
    const priceChange24h = data.change || data.change24h || 0;
    const priceChangePercentage24h = data.changePercent || data.changePercent24h || 0;
    const high24h = data.high24h || data.high || currentPrice * 1.01;
    const low24h = data.low24h || data.low || currentPrice * 0.99;

    const marketData: MarketData[] = [
      {
        id: "gold-oz",
        symbol: "XAU",
        name: "Gold (Ounce)",
        image: "https://assets.coingecko.com/coins/images/1/large/gold.png",
        currentPrice,
        priceChange24h,
        priceChangePercentage24h,
        high24h,
        low24h,
        totalVolume: 0,
        marketCap: 0,
        marketCapRank: 1,
        sparklineData: [],
      },
    ];

    return { data: marketData, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Failed to fetch gold data"),
    };
  }
}

// Forex API - Using exchangerate-api.com free tier
export async function fetchForexData(): Promise<FetchMarketDataResult> {
  try {
    // Fetch current rates
    const currentResponse = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      {
        cache: "no-store",
      }
    );

    if (!currentResponse.ok) {
      throw new Error("Failed to fetch forex data");
    }

    const currentData = await currentResponse.json();
    const currentRates = currentData.rates || {};

    // Fetch historical rates (24h ago) for change calculation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    let historicalRates: Record<string, number> = {};

    try {
      const historicalResponse = await fetch(
        `https://api.exchangerate-api.com/v4/historical/USD/${dateStr}`,
        {
          cache: "no-store",
        }
      );

      if (historicalResponse.ok) {
        const historicalData = await historicalResponse.json();
        historicalRates = historicalData.rates || {};
      }
    } catch {
      // If historical data fails, continue without 24h change data
    }

    // Major forex pairs
    const majorPairs = [
      { symbol: "EUR", name: "Euro" },
      { symbol: "GBP", name: "British Pound" },
      { symbol: "JPY", name: "Japanese Yen" },
      { symbol: "AUD", name: "Australian Dollar" },
      { symbol: "CAD", name: "Canadian Dollar" },
      { symbol: "CHF", name: "Swiss Franc" },
      { symbol: "CNY", name: "Chinese Yuan" },
      { symbol: "INR", name: "Indian Rupee" },
    ];

    const marketData: MarketData[] = majorPairs
      .filter((pair) => currentRates[pair.symbol])
      .map((pair, index) => {
        const currentPrice = currentRates[pair.symbol];
        const historicalPrice = historicalRates[pair.symbol] || currentPrice;
        const priceChange24h = currentPrice - historicalPrice;
        const priceChangePercentage24h = (priceChange24h / historicalPrice) * 100;
        const high24h = Math.max(currentPrice, historicalPrice * 1.005);
        const low24h = Math.min(currentPrice, historicalPrice * 0.995);

        return {
          id: `forex-${pair.symbol.toLowerCase()}`,
          symbol: `${pair.symbol}/USD`,
          name: pair.name,
          image: `https://flagcdn.com/w40/${getCountryCode(pair.symbol)}.png`,
          currentPrice,
          priceChange24h,
          priceChangePercentage24h,
          high24h,
          low24h,
          totalVolume: 0,
          marketCap: 0,
          marketCapRank: index + 1,
          sparklineData: [],
        };
      });

    return { data: marketData, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Failed to fetch forex data"),
    };
  }
}

function getCountryCode(currency: string): string {
  const map: Record<string, string> = {
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    CNY: "cn",
    INR: "in",
  };
  return map[currency] || "us";
}

// NFT API - Using CoinGecko NFT collections with market data
export async function fetchNFTData(): Promise<FetchMarketDataResult> {
  try {
    // Use the /nfts endpoint which returns market data (free tier)
    const url = new URL(`${COINGECKO_API_BASE}/nfts`);
    url.searchParams.append("order", "floor_price_usd_desc");
    url.searchParams.append("per_page", "50");
    url.searchParams.append("page", "1");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch NFT data");
    }

    const rawData = await response.json();

    // CoinGecko NFT API returns an array directly
    const nftsArray = Array.isArray(rawData) ? rawData : [];

    if (nftsArray.length === 0) {
      return {
        data: [],
        error: null,
      };
    }

    interface CoinGeckoNFTData {
      id: string;
      contract_address: string;
      name: string;
      asset_platform_id: string;
      symbol: string;
      image?: {
        small?: string;
        thumb?: string;
      };
      floor_price?: {
        usd?: number;
      };
      floor_price_in_usd_24h_percentage_change?: number;
      volume_24h?: {
        usd?: number;
      };
      market_cap?: {
        usd?: number;
      };
    }

    const marketData: MarketData[] = nftsArray
      .slice(0, 50)
      .map((nft: CoinGeckoNFTData, index: number) => {
        const floorPrice = nft.floor_price?.usd || 0;
        const priceChangePercentage24h = nft.floor_price_in_usd_24h_percentage_change || 0;
        const priceChange24h = (floorPrice * priceChangePercentage24h) / 100;
        const volume = nft.volume_24h?.usd || 0;
        const marketCap = nft.market_cap?.usd || 0;

        return {
          id: nft.id || `nft-${index}`,
          symbol: nft.symbol?.toUpperCase() || "NFT",
          name: nft.name || "Unknown NFT",
          image: nft.image?.small || nft.image?.thumb || "https://via.placeholder.com/64",
          currentPrice: floorPrice,
          priceChange24h,
          priceChangePercentage24h,
          high24h: floorPrice * 1.1,
          low24h: floorPrice * 0.9,
          totalVolume: volume,
          marketCap,
          marketCapRank: index + 1,
          sparklineData: [],
        };
      });

    return { data: marketData, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Failed to fetch NFT data"),
    };
  }
}

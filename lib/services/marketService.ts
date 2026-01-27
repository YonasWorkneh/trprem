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

// GOLD & PRECIOUS METALS API - Using CoinGecko tokenized precious metals
export async function fetchGoldData(): Promise<FetchMarketDataResult> {
  try {
    // Fetch tokenized precious metals from CoinGecko
    // These tokens track the actual spot prices of physical metals
    const url = new URL(`${COINGECKO_API_BASE}/coins/markets`);
    url.searchParams.append("vs_currency", "usd");
    url.searchParams.append("ids", "tether-gold,pax-gold,kinesis-gold,kinesis-silver");
    url.searchParams.append("order", "market_cap_desc");
    url.searchParams.append("per_page", "10");
    url.searchParams.append("page", "1");
    url.searchParams.append("sparkline", "true");
    url.searchParams.append("price_change_percentage", "24h");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch precious metals data: ${response.statusText}`);
    }

    const rawData: CoinGeckoMarketData[] = await response.json();

    // Map CoinGecko data to our MarketData format
    // Transform tokenized metals to display as physical metals
    const marketData: MarketData[] = rawData.map((item) => {
      // Determine display name and symbol based on token type
      let displayName = item.name;
      let displaySymbol = item.symbol.toUpperCase();

      if (item.id === "tether-gold" || item.id === "pax-gold") {
        // These are per-ounce tokens
        displayName = "Gold (Ounce)";
        displaySymbol = "XAU";
      } else if (item.id === "kinesis-gold") {
        // Kinesis Gold is per-gram, convert to ounce for display
        displayName = "Gold (Ounce)";
        displaySymbol = "XAU";
        // Note: KAU price is per gram, but we'll display as-is since CoinGecko handles conversion
      } else if (item.id === "kinesis-silver") {
        displayName = "Silver (Ounce)";
        displaySymbol = "XAG";
      }

      return {
        id: item.id,
        symbol: displaySymbol,
        name: displayName,
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
    });

    // Remove duplicates (if multiple gold tokens, prefer the one with highest market cap)
    const uniqueMetals = marketData.reduce((acc, current) => {
      const existing = acc.find((item) => item.symbol === current.symbol);
      if (!existing || current.marketCapRank < existing.marketCapRank) {
        if (existing) {
          const index = acc.indexOf(existing);
          acc[index] = current;
        } else {
          acc.push(current);
        }
      }
      return acc;
    }, [] as MarketData[]);

    return { data: uniqueMetals, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Failed to fetch precious metals data"),
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
// Note: /nfts/markets requires Pro API. We use /nfts/list + individual /nfts/{id} calls
export async function fetchNFTData(): Promise<FetchMarketDataResult> {
  try {
    // Step 1: Get list of NFT IDs (free tier)
    const listUrl = new URL(`${COINGECKO_API_BASE}/nfts/list`);
    listUrl.searchParams.append("per_page", "50");
    listUrl.searchParams.append("page", "1");
    listUrl.searchParams.append("order", "h24_volume_usd_desc"); // Order by 24h volume

    const listResponse = await fetch(listUrl.toString(), {
      cache: "no-store",
    });

    if (!listResponse.ok) {
      throw new Error(`Failed to fetch NFT list: ${listResponse.statusText}`);
    }

    interface NFTListItem {
      id: string;
      contract_address: string;
      name: string;
      asset_platform_id: string;
      symbol: string;
    }

    const nftList: NFTListItem[] = await listResponse.json();

    if (nftList.length === 0) {
      return {
        data: [],
        error: null,
      };
    }

    // Step 2: Fetch individual NFT details (limited to top 20 to avoid rate limits)
    const topNFTs = nftList.slice(0, 20);
    
    // Fetch NFTs in batches to avoid overwhelming the API
    const batchSize = 5;
    const nftDetailsResults: any[] = [];
    
    for (let i = 0; i < topNFTs.length; i += batchSize) {
      const batch = topNFTs.slice(i, i + batchSize);
      const batchPromises = batch.map(async (nft) => {
        try {
          const detailUrl = `${COINGECKO_API_BASE}/nfts/${nft.id}`;
          const detailResponse = await fetch(detailUrl, {
            cache: "no-store",
          });

          if (!detailResponse.ok) {
            return null;
          }

          return await detailResponse.json();
        } catch {
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      nftDetailsResults.push(...batchResults);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < topNFTs.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    const validNFTs = nftDetailsResults.filter((nft) => nft !== null);

    interface CoinGeckoNFTDetail {
      id: string;
      name: string;
      symbol: string;
      image?: {
        small?: string;
        small_2x?: string;
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
      market_cap_rank?: number;
    }

    const marketData: MarketData[] = validNFTs
      .map((nft: CoinGeckoNFTDetail, index: number) => {
        const floorPrice = nft.floor_price?.usd || 0;
        const priceChangePercentage24h = nft.floor_price_in_usd_24h_percentage_change || 0;
        const priceChange24h = (floorPrice * priceChangePercentage24h) / 100;
        const volume = nft.volume_24h?.usd || 0;
        const marketCap = nft.market_cap?.usd || 0;

        // Use image if available, otherwise empty string (will show initials)
        const imageUrl = nft.image?.small || nft.image?.small_2x || "";

        return {
          id: nft.id || `nft-${index}`,
          symbol: nft.symbol?.toUpperCase() || "NFT",
          name: nft.name || "Unknown NFT",
          image: imageUrl,
          currentPrice: floorPrice,
          priceChange24h,
          priceChangePercentage24h,
          high24h: floorPrice * 1.1,
          low24h: floorPrice * 0.9,
          totalVolume: volume,
          marketCap,
          marketCapRank: nft.market_cap_rank || index + 1,
          sparklineData: [],
        };
      })
      .filter((nft) => nft.currentPrice > 0) // Only include NFTs with valid floor price
      .sort((a, b) => b.totalVolume - a.totalVolume); // Sort by volume

    return { data: marketData, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Failed to fetch NFT data"),
    };
  }
}

/**
 * Fetches current USD prices for BTC, ETH, USDT from CoinGecko (free, no API key).
 * Used for deposit page estimated USDT conversion.
 */

const COINGECKO_SIMPLE_PRICE =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd";

export type CurrencySymbol = "BTC" | "ETH" | "USDT";

export interface CryptoRates {
  BTC: number;
  ETH: number;
  USDT: number;
}

const DEFAULT_RATES: CryptoRates = {
  BTC: 0,
  ETH: 0,
  USDT: 1,
};

export async function fetchCryptoRates(): Promise<{
  rates: CryptoRates;
  error: Error | null;
}> {
  try {
    const res = await fetch(COINGECKO_SIMPLE_PRICE, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Price API error: ${res.status}`);
    }

    const data = await res.json();

    const rates: CryptoRates = {
      BTC: typeof data?.bitcoin?.usd === "number" ? data.bitcoin.usd : DEFAULT_RATES.BTC,
      ETH: typeof data?.ethereum?.usd === "number" ? data.ethereum.usd : DEFAULT_RATES.ETH,
      USDT: typeof data?.tether?.usd === "number" ? data.tether.usd : 1,
    };

    return { rates, error: null };
  } catch (err) {
    console.warn("fetchCryptoRates failed, using fallbacks:", err);
    return {
      rates: DEFAULT_RATES,
      error: err instanceof Error ? err : new Error("Failed to fetch prices"),
    };
  }
}

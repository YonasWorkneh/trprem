export interface ArbitrageProduct {
  id: string;
  code: string;
  name: string;
  dailyReturn: number; // percentage (e.g., 0.5 for 0.5%)
  duration: number; // in days
  minLimit: number;
  maxLimit: number;
  supportedCurrencies: string[]; // e.g., ["USDT", "BTC", "ETH"]
  icon?: string; // optional icon text/code
}

export interface FetchArbitrageProductsResult {
  data: ArbitrageProduct[];
  error: Error | null;
}

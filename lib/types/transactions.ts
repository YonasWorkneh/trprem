export interface Transaction {
  id: string;
  type: "contract" | "option" | "spot";
  orderType: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  status: "open" | "closed" | "pending";
  profit?: number;
  profitPercentage?: number;
  openDate: string;
  closeDate?: string;
}

export interface TransactionSummary {
  totalBalance: number;
  todayProfit: number;
  totalProfit: number;
}

export interface FetchTransactionsResult {
  data: Transaction[];
  error: Error | null;
}

export interface HostingOrder {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  amount: number;
  dailyReturn: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: "running" | "ended";
  totalEarned?: number;
}

export interface FetchHostingOrdersResult {
  data: HostingOrder[];
  error: Error | null;
}

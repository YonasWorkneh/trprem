import type {
  HostingOrder,
  FetchHostingOrdersResult,
} from "../types/hosting";

// Mock API endpoint - replace with actual API endpoint when available
const HOSTING_API_BASE = process.env.NEXT_PUBLIC_HOSTING_API_BASE || "";

export async function fetchHostingOrders(
  status?: "running" | "ended"
): Promise<FetchHostingOrdersResult> {
  try {
    // If API endpoint is configured, fetch from API
    if (HOSTING_API_BASE) {
      const url = new URL(`${HOSTING_API_BASE}/orders`);
      if (status) {
        url.searchParams.append("status", status);
      }

      const response = await fetch(url.toString(), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hosting orders: ${response.statusText}`);
      }

      const rawData = await response.json();

      const orders: HostingOrder[] = Array.isArray(rawData)
        ? rawData.map((item: any) => ({
            id: item.id,
            productId: item.productId || item.product_id,
            productCode: item.productCode || item.product_code,
            productName: item.productName || item.product_name,
            amount: Number(item.amount || 0),
            dailyReturn: Number(item.dailyReturn || item.daily_return || 0),
            duration: Number(item.duration || 0),
            startDate: item.startDate || item.start_date,
            endDate: item.endDate || item.end_date,
            status: item.status || "running",
            totalEarned: item.totalEarned
              ? Number(item.totalEarned)
              : item.total_earned
              ? Number(item.total_earned)
              : undefined,
          }))
        : [];

      return { data: orders, error: null };
    }

    // Fallback to empty array for development (no mock data to show empty state)
    return { data: [], error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

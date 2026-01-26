import type {
  Loan,
  FetchLoansResult,
  LoanApplication,
} from "../types/loans";

// Mock API endpoint - replace with actual API endpoint when available
const LOANS_API_BASE = process.env.NEXT_PUBLIC_LOANS_API_BASE || "";

export async function fetchLoans(): Promise<FetchLoansResult> {
  try {
    // If API endpoint is configured, fetch from API
    if (LOANS_API_BASE) {
      const response = await fetch(`${LOANS_API_BASE}/loans`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch loans: ${response.statusText}`);
      }

      const rawData = await response.json();

      const loans: Loan[] = Array.isArray(rawData)
        ? rawData.map((item: any) => ({
            id: item.id,
            amount: Number(item.amount || 0),
            collateralAmount: Number(item.collateralAmount || item.collateral_amount || 0),
            collateralCurrency: item.collateralCurrency || item.collateral_currency || "BTC",
            interestRate: Number(item.interestRate || item.interest_rate || 0),
            duration: Number(item.duration || 0),
            startDate: item.startDate || item.start_date,
            endDate: item.endDate || item.end_date,
            status: item.status || "active",
            monthlyPayment: item.monthlyPayment
              ? Number(item.monthlyPayment)
              : item.monthly_payment
              ? Number(item.monthly_payment)
              : undefined,
            remainingBalance: item.remainingBalance
              ? Number(item.remainingBalance)
              : item.remaining_balance
              ? Number(item.remaining_balance)
              : undefined,
          }))
        : [];

      return { data: loans, error: null };
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

export async function applyForLoan(
  application: LoanApplication
): Promise<{ success: boolean; error?: string }> {
  try {
    if (LOANS_API_BASE) {
      const response = await fetch(`${LOANS_API_BASE}/loans/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to apply for loan: ${response.statusText}`
        );
      }

      return { success: true };
    }

    // Mock success for development
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export interface Loan {
  id: string;
  amount: number;
  collateralAmount: number;
  collateralCurrency: string;
  interestRate: number;
  duration: number; // in days
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "completed" | "defaulted";
  monthlyPayment?: number;
  remainingBalance?: number;
}

export interface FetchLoansResult {
  data: Loan[];
  error: Error | null;
}

export interface LoanApplication {
  collateralCurrency: string;
  collateralAmount: number;
  loanAmount: number;
  duration: number;
}

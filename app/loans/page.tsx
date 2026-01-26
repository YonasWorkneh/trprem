"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import LoansTabs from "@/app/components/loans/LoansTabs";
import LoanApplicationForm from "@/app/components/loans/LoanApplicationForm";
import EmptyLoansState from "@/app/components/loans/EmptyLoansState";
import LoadingState from "@/app/components/market/LoadingState";
import ErrorState from "@/app/components/market/ErrorState";
import { fetchLoans } from "@/lib/services/loansService";
import type { Loan } from "@/lib/types/loans";
import { toast } from "sonner";

export default function LoansPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"my-loans" | "apply">("my-loans");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (activeTab === "my-loans") {
      loadLoans();
    }
  }, [activeTab]);

  const loadLoans = async () => {
    if (isRefreshing) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    const result = await fetchLoans();
    if (result.error) {
      setError(result.error);
    } else {
      setLoans(result.data);
    }
    setLoading(false);
    setIsRefreshing(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLoans();
    toast.success("Loans refreshed");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Crypto Loans
                </h1>
                <p className="text-sm text-gray-600">
                  Get instant liquidity backed by your crypto assets.
                </p>
              </div>
            </div>
            {activeTab === "my-loans" && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                aria-label="Refresh loans"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-700 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Tabs */}
          <LoansTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          {activeTab === "my-loans" ? (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                My Loans
              </h2>
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState
                  message={error.message || "Failed to load loans"}
                  onRetry={loadLoans}
                />
              ) : loans.length === 0 ? (
                <EmptyLoansState />
              ) : (
                <div className="space-y-4">
                  {/* TODO: Add LoanCard component when loans are available */}
                  {loans.map((loan) => (
                    <div
                      key={loan.id}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                    >
                      <p className="text-sm text-gray-600">
                        Loan: {loan.amount} USD
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <LoanApplicationForm
              onSuccess={() => {
                // Optionally switch to "My Loans" tab after successful application
                // setActiveTab("my-loans");
              }}
            />
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

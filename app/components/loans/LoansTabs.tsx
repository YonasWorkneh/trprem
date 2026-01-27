"use client";

interface LoansTabsProps {
  activeTab: "my-loans" | "apply";
  onTabChange: (tab: "my-loans" | "apply") => void;
}

export default function LoansTabs({
  activeTab,
  onTabChange,
}: LoansTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
      <button
        onClick={() => onTabChange("my-loans")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          activeTab === "my-loans"
            ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        My Loans
      </button>
      <button
        onClick={() => onTabChange("apply")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          activeTab === "apply"
            ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Apply for Loan
      </button>
    </div>
  );
}

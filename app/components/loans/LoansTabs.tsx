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
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "my-loans"
            ? "bg-[rgba(244,208,63,0.16)] border border-[#F4D03F] text-yellow-900"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        My Loans
      </button>
      <button
        onClick={() => onTabChange("apply")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "apply"
            ? "bg-[rgba(244,208,63,0.16)] border border-[#F4D03F] text-yellow-900"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Apply for Loan
      </button>
    </div>
  );
}

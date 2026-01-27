"use client";

interface TradingTypeTabsProps {
  activeTab: "contract" | "option" | "spot";
  onTabChange: (tab: "contract" | "option" | "spot") => void;
}

export default function TradingTypeTabs({
  activeTab,
  onTabChange,
}: TradingTypeTabsProps) {
  return (
    <div className="flex items-center gap-6 mb-6">
      <button
        onClick={() => onTabChange("contract")}
        className={`pb-2 text-sm font-normal transition-colors cursor-pointer ${
          activeTab === "contract"
            ? "text-[var(--theme-primary-text)] border-b-2 border-[var(--theme-primary)]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Contract
      </button>
      <button
        onClick={() => onTabChange("option")}
        className={`pb-2 text-sm font-normal transition-colors cursor-pointer ${
          activeTab === "option"
            ? "text-[var(--theme-primary-text)] border-b-2 border-[var(--theme-primary)]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Option
      </button>
      <button
        onClick={() => onTabChange("spot")}
        className={`pb-2 text-sm font-normal transition-colors cursor-pointer ${
          activeTab === "spot"
            ? "text-[var(--theme-primary-text)] border-b-2 border-[var(--theme-primary)]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Spot
      </button>
    </div>
  );
}

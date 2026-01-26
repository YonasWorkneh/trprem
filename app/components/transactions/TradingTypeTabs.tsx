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
        className={`pb-2 text-sm font-normal transition-colors ${
          activeTab === "contract"
            ? "text-yellow-900 border-b-2 border-[#F4D03F]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Contract
      </button>
      <button
        onClick={() => onTabChange("option")}
        className={`pb-2 text-sm font-normal transition-colors ${
          activeTab === "option"
            ? "text-yellow-900 border-b-2 border-[#F4D03F]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Option
      </button>
      <button
        onClick={() => onTabChange("spot")}
        className={`pb-2 text-sm font-normal transition-colors ${
          activeTab === "spot"
            ? "text-yellow-900 border-b-2 border-[#F4D03F]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Spot
      </button>
    </div>
  );
}

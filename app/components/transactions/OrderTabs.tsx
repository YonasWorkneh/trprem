"use client";

interface OrderTabsProps {
  activeTab: "positions" | "historical";
  onTabChange: (tab: "positions" | "historical") => void;
}

export default function OrderTabs({
  activeTab,
  onTabChange,
}: OrderTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => onTabChange("positions")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "positions"
            ? "bg-[rgba(244,208,63,0.16)] border border-[#F4D03F] text-yellow-900"
            : "bg-white text-gray-600 hover:text-gray-900"
        }`}
      >
        Positions
      </button>
      <button
        onClick={() => onTabChange("historical")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "historical"
            ? "bg-[rgba(244,208,63,0.16)] border border-[#F4D03F] text-yellow-900"
            : "bg-white text-gray-600 hover:text-gray-900"
        }`}
      >
        Historical Order
      </button>
    </div>
  );
}

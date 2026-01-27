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
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          activeTab === "positions"
            ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "bg-white text-gray-600 hover:text-gray-900"
        }`}
      >
        Positions
      </button>
      <button
        onClick={() => onTabChange("historical")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          activeTab === "historical"
            ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "bg-white text-gray-600 hover:text-gray-900"
        }`}
      >
        Historical Order
      </button>
    </div>
  );
}

"use client";

interface HostingTabsProps {
  activeTab: "running" | "ended";
  onTabChange: (tab: "running" | "ended") => void;
}

export default function HostingTabs({
  activeTab,
  onTabChange,
}: HostingTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6">
      <button
        onClick={() => onTabChange("running")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "running"
            ? "bg-[rgba(244,208,63,0.16)] border border-[#F4D03F] text-yellow-900"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Running
      </button>
      <button
        onClick={() => onTabChange("ended")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "ended"
            ? "bg-[rgba(244,208,63,0.16)] border border-[#F4D03F] text-yellow-900"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Ended
      </button>
    </div>
  );
}

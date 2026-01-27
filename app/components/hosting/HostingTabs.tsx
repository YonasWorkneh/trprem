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
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          activeTab === "running"
            ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Running
      </button>
      <button
        onClick={() => onTabChange("ended")}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          activeTab === "ended"
            ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Ended
      </button>
    </div>
  );
}

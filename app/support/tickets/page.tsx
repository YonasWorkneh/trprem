"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Plus } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import CreateTicketModal from "@/app/components/support/CreateTicketModal";

type TicketFilter = "all" | "open" | "active" | "pending" | "closed";

export default function SupportTicketsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TicketFilter>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filters: { id: TicketFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "open", label: "Open" },
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "closed", label: "Closed" },
  ];

  const handleCreateTicket = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your support requests and conversations
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateTicket}
              className="bg-[var(--theme-primary)] text-[var(--theme-primary-text)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Ticket</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-6 mb-6">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`pb-2 text-sm font-normal transition-colors cursor-pointer ${
                  activeFilter === filter.id
                    ? "text-[var(--theme-primary-text)] border-b-2 border-[var(--theme-primary)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md">
                You haven&apos;t created any support tickets yet.
              </p>
              <button
                onClick={handleCreateTicket}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Create your first ticket
              </button>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // TODO: Refresh tickets list
        }}
      />
    </div>
  );
}

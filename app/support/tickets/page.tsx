"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import CreateTicketModal from "@/app/components/support/CreateTicketModal";
import TicketSkeleton from "@/app/components/support/TicketSkeleton";
import TicketChat from "@/app/components/support/TicketChat";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSupportTickets } from "@/lib/hooks/useSupportTickets";
import { SupportTicket } from "@/lib/services/supportService";

type TicketFilter = "all" | "open" | "active" | "pending" | "closed";

export default function SupportTicketsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<TicketFilter>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );

  const { tickets, isLoading, error, refetch } = useSupportTickets({
    userId: user?.id,
    filter: activeFilter,
    enabled: !!user?.id,
  });

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

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Support Tickets
                </h1>
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

          {/* Tickets List */}
          <div className="space-y-3">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <TicketSkeleton key={index} />
              ))
            ) : error ? (
              // Error state
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Failed to load tickets</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            ) : tickets && tickets.length > 0 ? (
              // Tickets list
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleTicketClick(ticket)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {ticket.page_context}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.status === "open"
                            ? "bg-blue-100 text-blue-700"
                            : ticket.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : ticket.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : ticket.status === "closed"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : ticket.priority === "normal"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Created {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      Updated {new Date(ticket.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="bg-white rounded-xl border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tickets found
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-md">
                    {activeFilter === "all"
                      ? "You haven&apos;t created any support tickets yet."
                      : `No ${activeFilter} tickets found.`}
                  </p>
                  <button
                    onClick={handleCreateTicket}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Create your first ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNavigation />

      {/* Chat UI Overlay */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-white">
          <TicketChat ticket={selectedTicket} onBack={handleBackToList} />
        </div>
      )}

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // TODO: Refresh tickets list
        }}
        userId={user?.id || ""}
      />
    </div>
  );
}

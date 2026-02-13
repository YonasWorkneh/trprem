"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSupportTickets,
  SupportTicket,
} from "@/lib/services/supportService";

type TicketFilter = "all" | "open" | "active" | "pending" | "closed";

export interface UseSupportTicketsOptions {
  userId?: string;
  filter?: TicketFilter;
  enabled?: boolean;
}

export interface UseSupportTicketsReturn {
  tickets: SupportTicket[] | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isError: boolean;
  isPending: boolean;
  isLoadingError: boolean;
  isRefetchError: boolean;
  isFetching: boolean;
  isSuccess: boolean;
}

export function useSupportTickets({
  userId,
  filter = "all",
  enabled = true,
}: UseSupportTicketsOptions = {}): UseSupportTicketsReturn {
  const query = useQuery({
    queryKey: ["support-tickets", userId, filter],
    queryFn: async () => {
      const result = await getSupportTickets(userId);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch support tickets");
      }

      return result.data || [];
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Filter tickets based on the selected filter
  const filteredTickets = query.data?.filter((ticket) => {
    switch (filter) {
      case "open":
        return ticket.status === "open";
      case "active":
        return ticket.status === "open" || ticket.status === "in_progress";
      case "pending":
        return ticket.status === "pending";
      case "closed":
        return ticket.status === "closed" || ticket.status === "resolved";
      case "all":
      default:
        return true;
    }
  });

  return {
    tickets: filteredTickets,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: () => query.refetch(),
    isError: query.isError,
    isPending: query.isPending,
    isLoadingError: query.isLoadingError,
    isRefetchError: query.isRefetchError,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

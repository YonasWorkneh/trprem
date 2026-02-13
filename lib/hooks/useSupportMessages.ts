"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupportTicketMessages, SupportMessage } from "@/lib/services/supportService";

export interface UseSupportMessagesOptions {
  ticketId?: string;
  enabled?: boolean;
}

export interface UseSupportMessagesReturn {
  messages: SupportMessage[] | undefined;
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

export function useSupportMessages({
  ticketId,
  enabled = true,
}: UseSupportMessagesOptions = {}): UseSupportMessagesReturn {
  const query = useQuery({
    queryKey: ["support-messages", ticketId],
    queryFn: async () => {
      if (!ticketId) {
        throw new Error("Ticket ID is required");
      }

      const result = await getSupportTicketMessages(ticketId);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch support messages");
      }
      
      return result.data || [];
    },
    enabled: enabled && !!ticketId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  return {
    messages: query.data,
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

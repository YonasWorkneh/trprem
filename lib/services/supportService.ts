"use client";

import { supabase } from "../supabase";

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  page_context?: string;
  status: "open" | "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high";
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    name: string;
  };
  messages?: SupportMessage[];
  _count?: {
    messages: number;
  };
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  image_url?: string;
  is_admin_reply: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface CreateTicketData {
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high";
  page_context?: string;
}

export interface CreateMessageData {
  ticket_id: string;
  message: string;
  image?: File;
}

export async function createSupportTicket(
  userId: string,
  ticketData: CreateTicketData,
): Promise<{ success: boolean; data?: SupportTicket; error?: string }> {
  console.log("user_id", userId);
  try {
    // Create ticket first
    const { data: ticketDataResult, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        user_id: userId,
        subject: ticketData.subject,
        page_context: ticketData.page_context,
        status: "open",
        priority: ticketData.priority || "normal",
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Create ticket error:", ticketError);
      return {
        success: false,
        error: ticketError.message,
      };
    }

    // Create initial message separately to avoid complex joins
    const { error: messageError } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: ticketDataResult.id,
        user_id: userId,
        message: ticketData.message,
        is_admin_reply: false,
      });

    if (messageError) {
      console.error("Create initial message error:", messageError);
      // Don't fail the ticket creation if message fails
      // The ticket is created, we can add message later
    }

    return {
      success: true,
      data: ticketDataResult as SupportTicket,
    };
  } catch (error) {
    console.error("Create ticket error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getSupportTickets(
  userId?: string,
): Promise<{ success: boolean; data?: SupportTicket[]; error?: string }> {
  try {
    // Simple query without complex joins to avoid recursion
    let query = supabase
      .from("support_tickets")
      .select("*")
      .order("updated_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      // Admin view - get all tickets
      query = query;
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get tickets error:", error);

      // If it's a stack depth error, provide specific guidance
      if (error.message.includes("stack depth")) {
        return {
          success: false,
          error:
            "Database recursion error. Please check RLS policies for support tables.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as SupportTicket[],
    };
  } catch (error) {
    console.error("Get tickets error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getSupportTicketMessages(
  ticketId: string,
): Promise<{ success: boolean; data?: SupportMessage[]; error?: string }> {
  try {
    // Simple query without complex joins
    const { data, error } = await supabase
      .from("support_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Get messages error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as SupportMessage[],
    };
  } catch (error) {
    console.error("Get messages error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function addSupportMessage(
  userId: string,
  messageData: CreateMessageData,
): Promise<{ success: boolean; data?: SupportMessage; error?: string }> {
  try {
    let imageUrl: string | undefined;

    // Upload image if provided (bucket: customer_support)
    if (messageData.image) {
      const fileExt = messageData.image.name.split(".").pop() ?? "jpg";
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("customer_support")
        .upload(fileName, messageData.image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("customer_support").getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: messageData.ticket_id,
        user_id: userId,
        message: messageData.message,
        image_url: imageUrl,
        is_admin_reply: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Add message error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as SupportMessage,
    };
  } catch (error) {
    console.error("Add message error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: SupportTicket["status"],
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("support_tickets")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticketId);

    if (error) {
      console.error("Update ticket status error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update ticket status error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

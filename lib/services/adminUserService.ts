"use client";

import { supabase } from "../supabase";

export interface UserData {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  phone: string | null;
  kyc_status: "not_started" | "pending" | "verified" | "rejected";
  role: "user" | "admin";
  trading_balance: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function getUsersForAdmin(): Promise<{
  success: boolean;
  data?: UserData[];
  error?: string;
}> {
  try {
    // Use regular client with admin-specific query
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get users error:", error);

      // If it's a permission error, provide helpful message
      if (
        error.message.includes("permission") ||
        error.message.includes("denied")
      ) {
        return {
          success: false,
          error: "Permission denied. Make sure you have admin privileges.",
        };
      }

      // If it's the stack depth error, provide specific guidance
      if (error.message.includes("stack depth")) {
        return {
          success: false,
          error:
            "Database recursion error. Please check RLS policies and triggers.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as UserData[],
    };
  } catch (error) {
    console.error("Get users error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

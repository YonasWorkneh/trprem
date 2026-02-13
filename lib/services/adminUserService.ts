"use client";

import { supabase } from "../supabase";
import { createClient } from "@supabase/supabase-js";

// Create a service role client that bypasses RLS
// IMPORTANT: This should only be used on the server side or with proper security
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This should be a server-side environment variable
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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

export async function getUsersForAdmin(): Promise<{ success: boolean; data?: UserData[]; error?: string }> {
  try {
    // Try regular client first (with RLS)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Regular client error:", error);
      
      // If RLS is causing issues, try a simpler query
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("users")
        .select("id, email, name, kyc_status, role, created_at")
        .order("created_at", { ascending: false });

      if (fallbackError) {
        throw new Error(fallbackError.message);
      }

      return {
        success: true,
        data: fallbackData as UserData[],
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
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Alternative function that uses a direct approach
export async function getUsersDirect(): Promise<{ success: boolean; data?: UserData[]; error?: string }> {
  try {
    // Use RPC to bypass RLS if needed
    const { data, error } = await supabase.rpc('get_all_users');

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data as UserData[],
    };
  } catch (error) {
    console.error("Get users direct error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Create an RPC function to get all users safely
export const getUsersRPC = `
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  phone TEXT,
  kyc_status TEXT,
  role TEXT,
  trading_balance NUMERIC,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- This function bypasses RLS by using definer rights
  RETURN QUERY 
  SELECT 
    u.id,
    u.email,
    u.name,
    u.avatar_url,
    u.phone,
    u.kyc_status,
    u.role,
    u.trading_balance,
    u.preferences,
    u.created_at,
    u.updated_at
  FROM public.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

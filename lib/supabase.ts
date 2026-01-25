import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase credentials missing. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "sb-auth-token",
    flowType: "pkce",
  },
  global: {
    headers: {
      "x-client-info": "tradeprememium",
    },
  },
});

// Database types matching the actual schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          kyc_status?: "not_started" | "pending" | "verified" | "rejected";
          role?: "user" | "admin";
          trading_balance?: number;
          preferences?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          kyc_status?: "not_started" | "pending" | "verified" | "rejected";
          role?: "user" | "admin";
          trading_balance?: number;
          preferences?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      usdt_wallets: {
        Row: {
          id: string;
          user_id: string;
          address: string;
          network: string;
          balance: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address: string;
          network?: string;
          balance?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          address?: string;
          network?: string;
          balance?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      trades: {
        Row: {
          id: string;
          user_id: string;
          asset: string;
          quantity: number;
          price: number;
          type: "buy" | "sell";
          is_demo: boolean;
          timestamp: string;
          exit_price: number | null;
          payout: number | null;
          profit: number | null;
          status: "open" | "win" | "loss" | "tie" | null;
          open_time: string | null;
          close_time: string | null;
          contract_data: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset: string;
          quantity: number;
          price: number;
          type: "buy" | "sell";
          is_demo?: boolean;
          timestamp?: string;
          exit_price?: number | null;
          payout?: number | null;
          profit?: number | null;
          status?: "open" | "win" | "loss" | "tie" | null;
          open_time?: string | null;
          close_time?: string | null;
          contract_data?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          asset?: string;
          quantity?: number;
          price?: number;
          type?: "buy" | "sell";
          is_demo?: boolean;
          timestamp?: string;
          exit_price?: number | null;
          payout?: number | null;
          profit?: number | null;
          status?: "open" | "win" | "loss" | "tie" | null;
          open_time?: string | null;
          close_time?: string | null;
          contract_data?: Record<string, unknown> | null;
        };
      };
    };
  };
}

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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          full_name: string | null;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string | null;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string | null;
          is_verified?: boolean;
          created_at?: string;
        };
      };
      trades: {
        Row: {
          id: string;
          user_id: string;
          base_coin_id: string;
          quote_coin_id: string;
          side: "buy" | "sell";
          price: number;
          quantity: number;
          fee: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          base_coin_id: string;
          quote_coin_id: string;
          side: "buy" | "sell";
          price: number;
          quantity: number;
          fee?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          base_coin_id?: string;
          quote_coin_id?: string;
          side?: "buy" | "sell";
          price?: number;
          quantity?: number;
          fee?: number;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          coin_id: string;
          type: "deposit" | "withdraw";
          amount: number;
          tx_hash: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coin_id: string;
          type: "deposit" | "withdraw";
          amount: number;
          tx_hash?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          coin_id?: string;
          type?: "deposit" | "withdraw";
          amount?: number;
          tx_hash?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

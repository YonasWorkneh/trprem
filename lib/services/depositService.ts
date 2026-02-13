"use client";

import { supabase } from "../supabase";

export interface CryptoDeposit {
  id: string;
  user_id: string;
  deposit_code?: string;
  currency: string;
  deposit_address: string;
  transaction_hash: string;
  user_reported_amount?: number;
  admin_verified_amount?: number;
  amount: number;
  amount_usd?: number;
  status: "pending" | "reported" | "confirmed" | "credited" | "rejected";
  confirmations?: number;
  blockchain_explorer_url?: string;
  screenshot_url?: string;
  notes?: string;
  verification_notes?: string;
  verified_by?: string;
  reported_at: string;
  verified_at?: string;
  credited_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DepositResult {
  success: boolean;
  data?: CryptoDeposit | null;
  error?: string;
}

export async function createDepositRequest(
  userId: string,
  depositData: {
    currency: string;
    deposit_address: string;
    amount: number;
    amount_usd: number;
    transaction_hash?: string;
    screenshot_url?: string;
    notes?: string;
  },
): Promise<DepositResult> {
  try {
    // Generate unique deposit code
    const depositCode = `DEP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from("crypto_deposits")
      .insert({
        user_id: userId,
        deposit_code: depositCode,
        currency: depositData.currency,
        deposit_address: depositData.deposit_address,
        transaction_hash:
          depositData.transaction_hash || `PENDING-${Date.now()}`,
        user_reported_amount: depositData.amount,
        amount: depositData.amount,
        amount_usd: depositData.amount_usd,
        status: "reported",
        screenshot_url: depositData.screenshot_url,
        notes: depositData.notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Deposit creation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as CryptoDeposit,
    };
  } catch (error) {
    console.error("Deposit creation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getUserDeposits(
  userId: string,
): Promise<{ success: boolean; data?: CryptoDeposit[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("crypto_deposits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get deposits error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as CryptoDeposit[],
    };
  } catch (error) {
    console.error("Get deposits error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function uploadDepositProof(
  file: File,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `deposit-proof-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `deposit-proofs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("deposit")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("deposit").getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Upload proof error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

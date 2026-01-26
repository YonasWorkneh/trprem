"use client";

import { supabase } from "../supabase";
import type { KycSubmission, KycResult } from "../types/kyc";

export async function getKycSubmission(
  userId: string
): Promise<KycResult> {
  try {
    const { data, error } = await supabase
      .from("kyc_submissions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as KycSubmission | null,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

"use client";

import { supabase } from "../supabase";
import type { Profile } from "../types/auth";

export interface WalletBalance {
  totalBalance: number;
  assetsValue: number;
}

export interface ProfileDataResult {
  success: boolean;
  data?: {
    profile: Profile;
    balance: WalletBalance;
  };
  error?: string;
}

export async function getProfileData(
  userId: string
): Promise<ProfileDataResult> {
  try {
    const profileResult = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileResult.error) {
      return {
        success: false,
        error: profileResult.error.message,
      };
    }

    // Get wallet balance from usdt_wallets table
    const walletResult = await supabase
      .from("usdt_wallets")
      .select("balance")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    let totalBalance = 0;
    let assetsValue = 0;

    if (!walletResult.error && walletResult.data) {
      totalBalance = Number(walletResult.data.balance || 0);
      assetsValue = totalBalance;
    }

    return {
      success: true,
      data: {
        profile: profileResult.data as Profile,
        balance: {
          totalBalance,
          assetsValue,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

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
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileResult.error) {
      return {
        success: false,
        error: profileResult.error.message,
      };
    }

    const walletResult = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", userId)
      .single();

    let totalBalance = 0;
    let assetsValue = 0;

    if (!walletResult.error && walletResult.data) {
      const balancesResult = await supabase
        .from("wallet_balances")
        .select("available_balance")
        .eq("wallet_id", walletResult.data.id);

      if (!balancesResult.error && balancesResult.data) {
        totalBalance = balancesResult.data.reduce(
          (sum, balance) => sum + Number(balance.available_balance || 0),
          0
        );
        assetsValue = totalBalance;
      }
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

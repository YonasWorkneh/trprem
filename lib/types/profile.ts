export interface WalletBalance {
  totalBalance: number;
  assetsValue: number;
}

export interface ProfileDataResult {
  success: boolean;
  data?: {
    profile: import("./auth").Profile;
    balance: WalletBalance;
  };
  error?: string;
}

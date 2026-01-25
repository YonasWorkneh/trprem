export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  invitationCode?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: {
    user: {
      id: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface Profile {
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

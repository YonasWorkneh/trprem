"use client";

const AUTH_TOKEN_KEY = "tp_auth_token";
const AUTH_USER_KEY = "tp_auth_user";
const AUTH_PROFILE_KEY = "tp_auth_profile";
const AUTH_TIMESTAMP_KEY = "tp_auth_timestamp";

interface StoredUser {
  id: string;
  email?: string;
  phone?: string;
}

interface StoredProfile {
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

export function getStoredAuth(): {
  token: string | null;
  user: StoredUser | null;
  profile: StoredProfile | null;
} {
  if (typeof window === "undefined") {
    return { token: null, user: null, profile: null };
  }

  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    const profileStr = localStorage.getItem(AUTH_PROFILE_KEY);

    const user = userStr ? (JSON.parse(userStr) as StoredUser) : null;
    const profile = profileStr ? (JSON.parse(profileStr) as StoredProfile) : null;

    return { token, user, profile };
  } catch {
    return { token: null, user: null, profile: null };
  }
}

export function setStoredAuth(
  token: string | null,
  user: StoredUser | null,
  profile: StoredProfile | null
): void {
  if (typeof window === "undefined") return;

  try {
    if (token && user) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    }

    if (profile) {
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(AUTH_PROFILE_KEY);
    }
  } catch (error) {
    console.error("Failed to store auth data:", error);
  }
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_PROFILE_KEY);
  localStorage.removeItem(AUTH_TIMESTAMP_KEY);
}

export function isStoredAuthValid(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    if (!timestamp) return false;

    // Consider stored auth valid for 24 hours
    const storedTime = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    return now - storedTime < maxAge;
  } catch {
    return false;
  }
}

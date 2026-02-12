"use client";

import { supabase } from "../supabase";
import { setStoredAuth } from "../utils/authStorage";
import type { AuthResult } from "../types/auth";

const ADMIN_SESSION_KEY = "admin_session";
const ADMIN_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface AdminSession {
  userId: string;
  email: string;
  expiresAt: number;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<AuthResult & { isAdmin?: boolean }> {
  try {
    // First authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    // Check if user has admin role in database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      // Sign out the user since we can't verify their role
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Failed to verify admin privileges",
      };
    }

    if (!profile || profile.role !== "admin") {
      // Sign out the user since they're not an admin
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Access denied. Admin privileges required.",
        isAdmin: false,
      };
    }

    // Store admin session in localStorage
    const adminSession: AdminSession = {
      userId: data.user.id,
      email: data.user.email || email,
      expiresAt: Date.now() + ADMIN_SESSION_DURATION,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));

    // Store regular auth data as well
    setStoredAuth(
      data.session.access_token,
      {
        id: data.user.id,
        email: data.user.email || undefined,
        phone: data.user.phone || undefined,
      },
      {
        id: profile?.id || data.user.id,
        email: profile?.email || data.user.email || "",
        name: profile?.name || null,
        avatar_url: profile?.avatar_url || null,
        phone: profile?.phone || data.user.phone || null,
        kyc_status: profile?.kyc_status || "not_started",
        role: profile?.role || "user",
        trading_balance: profile?.trading_balance || 0,
        preferences: profile?.preferences || {},
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: profile?.updated_at || new Date().toISOString(),
      },
    );

    return {
      success: true,
      isAdmin: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || undefined,
          phone: data.user.phone || undefined,
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

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!storedSession) return null;

    const session: AdminSession = JSON.parse(storedSession);

    // Check if session is still valid
    if (session.expiresAt > Date.now()) {
      return session;
    } else {
      // Session expired, remove it
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export async function adminLogout(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Clear Supabase session
    const { error } = await supabase.auth.signOut();

    // Clear admin session
    clearAdminSession();

    // Clear regular auth storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("tp_auth_token");
      localStorage.removeItem("tp_auth_user");
      localStorage.removeItem("tp_auth_profile");
      localStorage.removeItem("tp_auth_timestamp");
    }

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

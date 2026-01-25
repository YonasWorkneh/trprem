"use client";

import { supabase } from "../supabase";
import type {
  RegisterCredentials,
  AuthResult,
  Profile,
} from "../types/auth";
import { setStoredAuth } from "../utils/authStorage";

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
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

    // Store auth in localStorage
    setStoredAuth(
      data.session.access_token,
      {
        id: data.user.id,
        email: data.user.email || undefined,
        phone: data.user.phone || undefined,
      },
      null
    );

    return {
      success: true,
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

export async function loginWithPhone(
  phone: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
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

    // Store auth in localStorage
    setStoredAuth(
      data.session.access_token,
      {
        id: data.user.id,
        email: data.user.email || undefined,
        phone: data.user.phone || undefined,
      },
      null
    );

    return {
      success: true,
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

export async function registerWithEmail(
  credentials: RegisterCredentials
): Promise<AuthResult> {
  try {
    if (credentials.password !== credentials.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    if (!credentials.email) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.fullName,
          phone: credentials.phone || null,
        },
        emailRedirectTo:"https://trprem.vercel.app"
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Registration failed",
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || undefined,
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

export async function registerWithPhone(
  credentials: RegisterCredentials
): Promise<AuthResult> {
  try {
    if (credentials.password !== credentials.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    if (!credentials.phone) {
      return {
        success: false,
        error: "Phone number is required",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      phone: credentials.phone,
      password: credentials.password,
      options: {
        data: {
          name: credentials.fullName,
          phone: credentials.phone,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Registration failed",
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
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

export async function resendConfirmationEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

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

export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    // Clear localStorage on logout
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

export async function getProfile(userId: string): Promise<{
  success: boolean;
  data?: Profile;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data) {
      // User record doesn't exist yet (might be created by trigger)
      return {
        success: false,
        error: "User profile not found",
      };
    }

    return {
      success: true,
      data: data as Profile,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

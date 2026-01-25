"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerWithEmail,
  registerWithPhone,
  type RegisterCredentials,
  type AuthResult,
} from "../services/authService";

type RegisterMethod = "email" | "mobile";

interface UseRegisterResult {
  register: (
    credentials: RegisterCredentials,
    method: RegisterMethod
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useRegister(): UseRegisterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (
    credentials: RegisterCredentials,
    method: RegisterMethod
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let result: AuthResult;

      if (method === "email") {
        result = await registerWithEmail(credentials);
      } else {
        result = await registerWithPhone(credentials);
      }

      if (result.success && result.data) {
        // Redirect to confirmation page with email or phone
        const email = credentials.email;
        const phone = credentials.phone;
        
        if (email) {
          router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
        } else if (phone) {
          router.push(`/confirm-email?phone=${encodeURIComponent(phone)}`);
        } else {
          router.push("/login");
        }
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerWithEmail,
  registerWithPhone,
} from "../services/authService";
 import type { RegisterCredentials, AuthResult } from "../types/auth";

type RegisterMethod = "email" | "mobile";

interface UseRegisterResult {
  register: (
    credentials: RegisterCredentials,
    method: RegisterMethod
  ) => Promise<boolean>;
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
  ): Promise<boolean> => {
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
        return true;
      } else {
        setError(result.error || "Registration failed");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

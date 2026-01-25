"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loginWithEmail,
  loginWithPhone,
  type LoginCredentials,
  type AuthResult,
} from "../services/authService";

type LoginMethod = "email" | "mobile";

interface UseLoginResult {
  login: (credentials: LoginCredentials, method: LoginMethod) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (
    credentials: LoginCredentials,
    method: LoginMethod
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let result: AuthResult;

      if (method === "email") {
        if (!credentials.email) {
          setError("Email is required");
          setLoading(false);
          return;
        }
        result = await loginWithEmail(credentials.email, credentials.password);
      } else {
        if (!credentials.phone) {
          setError("Phone number is required");
          setLoading(false);
          return;
        }
        result = await loginWithPhone(credentials.phone, credentials.password);
      }

      if (result.success && result.data) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

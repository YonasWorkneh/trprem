"use client";

import { useEffect, useState } from "react";
import { getKycSubmission } from "../services/kycService";
import type { KycSubmission } from "../types/kyc";

interface UseKycResult {
  data: KycSubmission | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useKyc(userId: string | undefined): UseKycResult {
  const [data, setData] = useState<KycSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const result = await getKycSubmission(userId);
    if (result.error) {
      setError(new Error(result.error));
      setData(null);
    } else {
      setData(result.data || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Use setTimeout to defer synchronous setState calls
    const timeoutId = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [userId]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}

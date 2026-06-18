"use client";
import { useState, useEffect, useCallback } from "react";
import { addressesService } from "../services/addresses.service";
import { useAuthStore } from "../store/auth.store";
import type { Address } from "../types";

export function useAddresses() {
  const { token } = useAuthStore();
  const [data, setData] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await addressesService.getAll(token);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
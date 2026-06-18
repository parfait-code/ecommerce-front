"use client";
import { useState, useEffect, useCallback } from "react";
import { paymentsService } from "../services/payments.service";
import { useAuthStore } from "../store/auth.store";
import type { Payment, PaginatedResponse } from "../types";

export function usePayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  order_id?: string;
}) {
  const { token } = useAuthStore();
  const [data, setData] = useState<PaginatedResponse<Payment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsService.getAll(token, params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token, params?.page, params?.status, params?.method, params?.order_id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
"use client";
import { useState, useEffect, useCallback } from "react";
import { ordersService } from "../services/orders.service";
import { useAuthStore } from "../store/auth.store";
import type { Order, PaginatedResponse } from "../types";

export function useOrders(params?: { status?: string; page?: number; limit?: number }) {
  const { token } = useAuthStore();
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ordersService.getAll(token, params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token, params?.status, params?.page, params?.limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useOrder(id: string) {
  const { token } = useAuthStore();
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    ordersService.getById(id, token)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [token, id]);

  return { data, loading, error };
}
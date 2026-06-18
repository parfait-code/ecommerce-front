"use client";
import { useState, useEffect, useCallback } from "react";
import { productsService } from "../services/products.service";
import { useAuthStore } from "../store/auth.store";
import type { Product, PaginatedResponse } from "../types";

export function useProducts(page = 1, limit = 20) {
  const { token } = useAuthStore();
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await productsService.getAll(token, page, limit);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token, page, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useProduct(id: number | string) {
  const { token } = useAuthStore();
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    productsService.getById(id, token)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [token, id]);

  return { data, loading, error };
}
"use client";
import { useState, useEffect, useCallback } from "react";
import { warehousesService } from "../services/warehouses.service";
import { useAuthStore } from "../store/auth.store";
import type { Warehouse } from "../types";

export function useWarehouses() {
  const { token } = useAuthStore();
  const [data, setData] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await warehousesService.getAll(token);
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

export function useWarehouse(id: string) {
  const { token } = useAuthStore();
  const [data, setData] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    warehousesService.getById(id, token)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [token, id]);

  return { data, loading, error };
}
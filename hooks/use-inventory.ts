"use client";
import { useState, useEffect, useCallback } from "react";
import { inventoryService } from "../services/inventory.service";
import { useAuthStore } from "../store/auth.store";
import type { InventoryItem, PaginatedResponse } from "../types";

export function useInventory(params?: {
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}) {
  const { token } = useAuthStore();
  const [data, setData] = useState<PaginatedResponse<InventoryItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getAll(token, params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token, params?.category, params?.location, params?.page, params?.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useInventoryItem(id: string) {
  const { token } = useAuthStore();
  const [data, setData] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    inventoryService
      .getById(id, token)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [token, id]);

  return { data, loading, error };
}
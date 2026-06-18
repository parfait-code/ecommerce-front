"use client";
import { useState, useEffect, useCallback } from "react";
import { shipmentsService } from "../services/shipments.service";
import { useAuthStore } from "../store/auth.store";
import type { Shipment, PaginatedResponse } from "../types";

export function useShipments(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const { token } = useAuthStore();
  const [data, setData] = useState<PaginatedResponse<Shipment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await shipmentsService.getAll(token, params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token, params?.page, params?.status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
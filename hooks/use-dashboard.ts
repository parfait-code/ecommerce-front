"use client";
import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboard.service";
import { useAuthStore } from "../store/auth.store";
import type { DashboardStats, SalesChartData } from "../types";

export function useDashboardStats() {
  const { token } = useAuthStore();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getStats(token);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useSalesChart(params?: { year?: number; period?: string }) {
  const { token } = useAuthStore();
  const [data, setData] = useState<SalesChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getSalesChart(token, params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token, params?.year, params?.period]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
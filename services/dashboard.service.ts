import { apiClient } from "./api-client";
import type { DashboardStats, SalesChartData } from "../types";

export const dashboardService = {
  // Nouvelle route 7.1
  getStats: (token: string) =>
    apiClient.get<DashboardStats>("/dashboard/stats", token),

  // Nouvelle route 7.2
  getSalesChart: (
    token: string,
    params?: { year?: number; period?: string }
  ) => {
    const q = new URLSearchParams();
    if (params?.year) q.set("year", String(params.year));
    if (params?.period) q.set("period", params.period);
    return apiClient.get<SalesChartData>(
      `/dashboard/sales-chart?${q.toString()}`,
      token
    );
  },
};
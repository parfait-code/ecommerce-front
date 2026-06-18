import { apiClient } from "./api-client";
import type { Payment, PaginatedResponse } from "../types";

export const paymentsService = {
  getAll: (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      method?: string;
      order_id?: string;
    }
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    if (params?.method) q.set("method", params.method);
    if (params?.order_id) q.set("order_id", params.order_id);
    return apiClient.get<PaginatedResponse<Payment>>(
      `/payments?${q.toString()}`,
      token
    );
  },

  getById: (id: string, token: string) =>
    apiClient.get<Payment>(`/payments/${id}`, token),

  create: (
    data: { order_id: string; method: string; notes?: string },
    token: string
  ) => apiClient.post<Payment>("/payments", data, token),
};
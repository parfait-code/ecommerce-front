import { apiClient } from "./api-client";
import type { Order, PaginatedResponse, Payment } from "../types";

export const ordersService = {
  getAll: (token: string, params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return apiClient.get<PaginatedResponse<Order>>(`/orders?${q.toString()}`, token);
  },

  getById: (id: string, token: string) =>
    apiClient.get<Order>(`/orders/${id}`, token),

  getStatus: (id: string, token: string) =>
    apiClient.get<{ id: string; status: string }>(`/orders/${id}/status`, token),

  updateStatus: (
    id: string,
    data: { status: string; shippingCarrier?: string; trackingNumber?: string; estimatedDeliveryDate?: string },
    token: string
  ) => apiClient.put<Order>(`/orders/${id}/status`, data, token),

  cancel: (id: string, token: string) =>
    apiClient.delete<{ message: string }>(`/orders/${id}`, token),

  getPayments: (orderId: string, token: string) =>
    apiClient.get<Payment[]>(`/orders/${orderId}/payments`, token),
};
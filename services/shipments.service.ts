import { apiClient } from "./api-client";
import type { Shipment, PaginatedResponse } from "../types";

export const shipmentsService = {
  // Nouvelle route 4.1
  getAll: (
    token: string,
    params?: { page?: number; limit?: number; status?: string }
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    return apiClient.get<PaginatedResponse<Shipment>>(
      `/shipments?${q.toString()}`,
      token
    );
  },

  getById: (id: string, token: string) =>
    apiClient.get<Shipment>(`/shipments/${id}`, token),

  create: (
    data: {
      sender_name: string;
      sender_address: string;
      recipient_name: string;
      recipient_address: string;
      weight: number;
      dimensions?: { length: number; width: number; height: number };
      order_id: string;
    },
    token: string
  ) => apiClient.post<Shipment>("/shipments", data, token),

  addTrackingEvent: (
    id: string,
    data: { status: string; location: string },
    token: string
  ) => apiClient.post(`/shipments/${id}/track`, data, token),

  getTracking: (id: string, token: string) =>
    apiClient.get(`/shipments/${id}/track`, token),

  cancel: (id: string, token: string) =>
    apiClient.post(`/shipments/${id}/cancel`, {}, token),
};
import { apiClient } from "./api-client";
import type { Shipment } from "../types";

export const shipmentsService = {
  // ⚠️ API manquante — GET /shipments liste globale non disponible
  // À créer côté backend

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
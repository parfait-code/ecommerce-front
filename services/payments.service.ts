import { apiClient } from "./api-client";
import type { Payment } from "../types";

export const paymentsService = {
  // ⚠️ API manquante — GET /payments liste globale non disponible
  // À créer côté backend

  getById: (id: string, token: string) =>
    apiClient.get<Payment>(`/payments/${id}`, token),

  create: (
    data: { order_id: string; method: string; notes?: string },
    token: string
  ) => apiClient.post<Payment>("/payments", data, token),
};
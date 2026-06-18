import { apiClient } from "./api-client";
import type { Address } from "../types";

export const addressesService = {
  getAll: (token: string) =>
    apiClient.get<Address[]>("/addresses", token),

  getById: (id: string, token: string) =>
    apiClient.get<Address>(`/addresses/${id}`, token),

  create: (
    data: { street: string; city: string; country: string; postalCode: string; isDefault?: boolean },
    token: string
  ) => apiClient.post<Address>("/addresses", data, token),

  update: (
    id: string,
    data: Partial<{ street: string; city: string; country: string; postalCode: string; isDefault: boolean }>,
    token: string
  ) => apiClient.patch<Address>(`/addresses/${id}`, data, token),

  delete: (id: string, token: string) =>
    apiClient.delete<{ message: string }>(`/addresses/${id}`, token),
};
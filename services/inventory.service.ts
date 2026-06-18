import { apiClient } from "./api-client";
import type { InventoryItem } from "../types";

export const inventoryService = {
  getAll: (token: string, params?: { category?: string; location?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.location) q.set("location", params.location);
    return apiClient.get<InventoryItem[]>(`/inventory?${q.toString()}`, token);
  },

  getLowStock: (token: string, threshold = 10) =>
    apiClient.get<InventoryItem[]>(`/inventory/low-stock?threshold=${threshold}`, token),

  getOutOfStock: (token: string) =>
    apiClient.get<InventoryItem[]>("/inventory/out-of-stock", token),

  search: (keyword: string, token: string) =>
    apiClient.get<InventoryItem[]>(`/inventory/search?keyword=${keyword}`, token),

  getById: (id: string, token: string) =>
    apiClient.get<InventoryItem>(`/inventory/${id}`, token),

  create: (data: { product_id: number; warehouse_id: string; quantity: number }, token: string) =>
    apiClient.post<InventoryItem>("/inventory", data, token),

  update: (id: string, quantity: number, token: string) =>
    apiClient.put<InventoryItem>(`/inventory/${id}`, { quantity }, token),

  delete: (id: string, token: string) =>
    apiClient.delete<{ message: string }>(`/inventory/${id}`, token),

  transfer: (data: { item_id: string; from_warehouse: string; to_warehouse: string; quantity: number }, token: string) =>
    apiClient.post("/inventory/transfer", data, token),
};
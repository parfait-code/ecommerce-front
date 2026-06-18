import { apiClient } from "./api-client";
import type { Warehouse, InventoryItem } from "../types";

export interface WarehouseInventoryResponse {
  warehouse: Warehouse & { totalUnits: number };
  items: InventoryItem[];
}

export const warehousesService = {
  getAll: (token: string) =>
    apiClient.get<Warehouse[]>("/warehouses", token),

  getById: (id: string, token: string) =>
    apiClient.get<Warehouse>(`/warehouses/${id}`, token),

  // Nouvelle route 6.1
  getInventory: (id: string, token: string) =>
    apiClient.get<WarehouseInventoryResponse>(
      `/warehouses/${id}/inventory`,
      token
    ),

  create: (
    data: { name: string; location: string; capacity: number },
    token: string
  ) => apiClient.post<Warehouse>("/warehouses", data, token),

  update: (
    id: string,
    data: Partial<{ name: string; location: string; capacity: number }>,
    token: string
  ) => apiClient.put<Warehouse>(`/warehouses/${id}`, data, token),

  delete: (id: string, token: string) =>
    apiClient.delete<{ message: string }>(`/warehouses/${id}`, token),
};
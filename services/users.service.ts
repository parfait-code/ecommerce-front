import { apiClient } from "./api-client";
import type { User, Order, PaginatedResponse } from "../types";

export const usersService = {
  getAll: (token: string) =>
    apiClient.get<User[]>("/user/all", token),

  // Nouvelle route 1.1
  create: (
    data: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      age: number;
      role?: string;
    },
    token: string
  ) => apiClient.post<User>("/user", data, token),

  // Nouvelle route 1.2
  getById: (userId: number, token: string) =>
    apiClient.get<User>(`/user/${userId}`, token),

  // Nouvelle route 1.3
  getOrders: (
    userId: number,
    token: string,
    params?: { page?: number; limit?: number }
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return apiClient.get<PaginatedResponse<Order>>(
      `/user/${userId}/orders?${q.toString()}`,
      token
    );
  },

  changeRole: (userId: number, role: string, token: string) =>
    apiClient.patch<User>(`/user/change-role/${userId}`, { role }, token),

  delete: (userId: number, token: string) =>
    apiClient.delete<{ numberOfUsersDeleted: number }>(`/user/${userId}`, token),
};
import { apiClient } from "./api-client";
import type { User } from "../types";

export const usersService = {
  getAll: (token: string) =>
    apiClient.get<User[]>("/user/all", token),

  changeRole: (userId: number, role: string, token: string) =>
    apiClient.patch<User>(`/user/change-role/${userId}`, { role }, token),

  delete: (userId: number, token: string) =>
    apiClient.delete<{ numberOfUsersDeleted: number }>(`/user/${userId}`, token),
};
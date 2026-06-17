import { apiClient } from "./api-client";
import type { AuthResponse } from "../types";

export const authService = {
  login: (username: string, password: string) =>
    apiClient.post<AuthResponse>("/login", { username, password }),

  signup: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age?: number;
  }) => apiClient.post<AuthResponse>("/signup", data),

  getProfile: (token: string) => apiClient.get("/user", token),
};
import { apiClient } from "./api-client";
import type { Product, PaginatedResponse } from "../types";

export const productsService = {
  getAll: (token: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<Product>>(
      `/product?page=${page}&limit=${limit}`,
      token
    ),

  getById: (id: number | string, token: string) =>
    apiClient.get<Product>(`/product/${id}`, token),

  create: (
    data: { name: string; description: string; price: number; category: string; stock: number },
    token: string
  ) => apiClient.post<Product>("/product", data, token),

  update: (
    id: number | string,
    data: Partial<{ name: string; description: string; price: number; category: string; stock: number }>,
    token: string
  ) => apiClient.patch<Product>(`/product/${id}`, data, token),

  delete: (id: number | string, token: string) =>
    apiClient.delete<{ numberOfProductsDeleted: number }>(`/product/${id}`, token),

  uploadImages: async (id: number | string, files: File[], token: string) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/product/${id}/images`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const data = await res.json();
    if (!res.ok || !data.status) throw new Error(data?.error?.message);
    return data.data as Product;
  },

  deleteImage: (id: number | string, imageUrl: string, token: string) =>
    apiClient.delete<Product>(`/product/${id}/images`, token),
};
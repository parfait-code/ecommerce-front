// services/product.service.ts
import { apiClient } from "./api-client";
import type { Product } from "../types";

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productService = {
  // Récupérer la liste des produits paginés
  getProducts: (page: number = 1, limit: number = 10) =>
    apiClient.get<PaginatedResponse<Product>>(
      `/products`
    ),

  // Récupérer un produit par son ID
  getProductById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`),

  // Créer un nouveau produit
  createProduct: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<Product>("/products", data),

  // Mettre à jour un produit
  updateProduct: (id: number, data: Partial<Product>) =>
    apiClient.patch<Product>(`/products/${id}`, data),

  // Supprimer un produit
  deleteProduct: (id: number) =>
    apiClient.delete<{ message: string }>(`/products/${id}`),
};
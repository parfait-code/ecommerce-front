// page.tsx (ProductsPage)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ConfirmDialog } from "../../../components/ui/confirm-dialog";
import { formatCurrency } from "../../../lib/utils";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Product } from "../../../types";
import { productService } from "../../../services/product.service";
import { useAuthStore } from "../../../store/auth.store";

// Constantes de pagination
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Types pour la réponse API paginée
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Composant de badge de stock
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Rupture</Badge>;
  if (stock < 10) return <Badge variant="warning">{stock} restants</Badge>;
  return <Badge variant="success">{stock} en stock</Badge>;
}

export default function ProductsPage() {
  // États
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Récupération du token pour les appels API
  const { token } = useAuthStore();

  // Récupération des produits
  const fetchProducts = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      // Utilisation du productService comme pour authService
      const data = await productService.getProducts(page, DEFAULT_LIMIT);
      
      setProducts(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial et changement de page
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Suppression d'un produit
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      // Utilisation du productService pour la suppression
      await productService.deleteProduct(productToDelete.id);
      
      // Recharger la page courante
      await fetchProducts(currentPage);

      // Ajuster la page si la dernière page est vide
      const remainingItems = totalItems - 1;
      const maxPage = Math.max(1, Math.ceil(remainingItems / DEFAULT_LIMIT));
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  };

  // Colonnes du tableau
  const columns = [
    {
      key: "name",
      label: "Produit",
      render: (product: Product) => (
        <div>
          <p className="font-medium text-(--text-primary)">{product.name}</p>
          <p className="text-xs text-(--text-muted)">ID #{product.id}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (product: Product) => (
        <Badge variant="default">{product.category}</Badge>
      ),
    },
    {
      key: "price",
      label: "Prix",
      render: (product: Product) => (
        <span className="tabular-nums font-medium">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (product: Product) => <StockBadge stock={product.stock} />,
    },
    {
      key: "images",
      label: "Images",
      render: (product: Product) => (
        <span className="text-sm text-(--text-muted)">
          {product.images?.length || 0} image(s)
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (product: Product) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/products/${product.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="ghost" size="sm" icon={<Pencil size={13} />} />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={13} />}
            className="hover:text-(--danger)"
            onClick={() => setProductToDelete(product)}
          />
        </div>
      ),
    },
  ];

  // État de chargement
  if (loading && currentPage === DEFAULT_PAGE) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-(--primary)" />
          <p className="text-(--text-muted)">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-(--danger) text-lg font-medium mb-2">
            Erreur de chargement
          </div>
          <p className="text-(--text-muted)">{error}</p>
          <Button
            className="mt-4"
            onClick={() => fetchProducts(currentPage)}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produits"
        description={`${totalItems} produit${totalItems > 1 ? "s" : ""} au catalogue`}
        createHref="/products/create"
        createLabel="Nouveau produit"
      />

      <DataTable
        columns={columns}
        data={products}
        keyExtractor={(product) => product.id}
        emptyMessage="Aucun produit trouvé"
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          pageSize: DEFAULT_LIMIT,
          onPageChange: setCurrentPage,
        }}
      />

      <ConfirmDialog
        open={productToDelete !== null}
        title="Supprimer ce produit ?"
        description={
          productToDelete
            ? `Le produit "${productToDelete.name}" sera définitivement supprimé. Cette action est irréversible.`
            : undefined
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={deleting}
        onConfirm={handleDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
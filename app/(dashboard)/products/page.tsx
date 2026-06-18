"use client";

import Link from "next/link";
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { formatCurrency } from "../../../lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "../../../hooks/use-products";
import { productsService } from "../../../services/products.service";
import { useAuthStore } from "../../../store/auth.store";
import { useState } from "react";
import type { Product } from "../../../types";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Rupture</Badge>;
  if (stock < 10) return <Badge variant="warning">{stock} restants</Badge>;
  return <Badge variant="success">{stock} en stock</Badge>;
}

export default function ProductsPage() {
  const { data, loading, error, refetch } = useProducts();
  const { token } = useAuthStore();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!token || !confirm("Supprimer ce produit ?")) return;
    setDeletingId(id);
    try {
      await productsService.delete(id, token);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Produit",
      render: (p: Product) => (
        <div>
          <p className="font-medium text-(--text-primary)">{p.name}</p>
          <p className="text-xs text-(--text-muted)">ID #{p.id}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (p: Product) => <Badge variant="default">{p.category}</Badge>,
    },
    {
      key: "price",
      label: "Prix",
      render: (p: Product) => (
        <span className="tabular-nums font-medium">{formatCurrency(p.price)}</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (p: Product) => <StockBadge stock={p.stock} />,
    },
    {
      key: "actions",
      label: "",
      render: (p: Product) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/products/${p.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Link href={`/products/${p.id}/edit`}>
            <Button variant="ghost" size="sm" icon={<Pencil size={13} />} />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={13} />}
            className="hover:text-(--danger)"
            loading={deletingId === p.id}
            onClick={() => handleDelete(p.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produits"
        description={data ? `${data.total} produits au catalogue` : ""}
        createHref="/products/create"
        createLabel="Nouveau produit"
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun produit trouvé"
        />
      )}
    </div>
  );
}
"use client";

import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useWarehouses } from "../../../hooks/use-warehouses";
import { warehousesService } from "../../../services/warehouses.service";
import { useAuthStore } from "../../../store/auth.store";
import { useState } from "react";
import type { Warehouse } from "../../../types";

export default function WarehousesPage() {
  const { data, loading, error, refetch } = useWarehouses();
  const { token } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!token || !confirm("Supprimer cet entrepôt ?")) return;
    setDeletingId(id);
    try {
      await warehousesService.delete(id, token);
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
      label: "Nom",
      render: (w: Warehouse) => <p className="font-medium text-(--text-primary)">{w.name}</p>,
    },
    {
      key: "location",
      label: "Localisation",
      render: (w: Warehouse) => <span className="text-(--text-secondary)">{w.location}</span>,
    },
    {
      key: "capacity",
      label: "Capacité",
      render: (w: Warehouse) => <span className="tabular-nums text-(--text-secondary)">{w.capacity.toLocaleString()} unités</span>,
    },
    {
      key: "actions",
      label: "",
      render: (w: Warehouse) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/warehouses/${w.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Link href={`/warehouses/${w.id}`}>
            <Button variant="ghost" size="sm" icon={<Pencil size={13} />} />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={13} />}
            className="hover:text-(--danger)"
            loading={deletingId === w.id}
            onClick={() => handleDelete(w.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entrepôts"
        description={data ? `${data.length} entrepôts` : ""}
        createHref="/warehouses/create"
        createLabel="Nouvel entrepôt"
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable columns={columns} data={data} keyExtractor={(w) => w.id} emptyMessage="Aucun entrepôt" />
      )}
    </div>
  );
}
"use client";

import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { Trash2 } from "lucide-react";
import { useAddresses } from "../../../hooks/use-addresses";
import { addressesService } from "../../../services/addresses.service";
import { useAuthStore } from "../../../store/auth.store";
import { useState } from "react";
import type { Address } from "../../../types";

export default function AddressesPage() {
  const { data, loading, error, refetch } = useAddresses();
  const { token } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!token || !confirm("Supprimer cette adresse ?")) return;
    setDeletingId(id);
    try {
      await addressesService.delete(id, token);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    {
      key: "street",
      label: "Adresse",
      render: (a: Address) => (
        <div>
          <p className="font-medium text-(--text-primary)">{a.street}</p>
          <p className="text-xs text-(--text-muted)">{a.city}, {a.country} — {a.postalCode}</p>
        </div>
      ),
    },
    {
      key: "userId",
      label: "Utilisateur",
      render: (a: Address) => <span className="text-(--text-secondary)">User #{a.userId}</span>,
    },
    {
      key: "isDefault",
      label: "Défaut",
      render: (a: Address) =>
        a.isDefault
          ? <Badge variant="accent">Principale</Badge>
          : <span className="text-(--text-muted) text-xs">—</span>,
    },
    {
      key: "actions",
      label: "",
      render: (a: Address) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={13} />}
            className="hover:text-(--danger)"
            loading={deletingId === a.id}
            onClick={() => handleDelete(a.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Adresses" description={data ? `${data.length} adresses enregistrées` : ""} />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable columns={columns} data={data} keyExtractor={(a) => a.id} emptyMessage="Aucune adresse" />
      )}
    </div>
  );
}
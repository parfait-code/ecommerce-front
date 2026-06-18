"use client";

import Link from "next/link";
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { Eye } from "lucide-react";
import { useOrders } from "../../../hooks/use-orders";
import type { Order } from "../../../types";

const statusConfig: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
  DELIVERED: { label: "Livrée", variant: "success" },
  SHIPPED: { label: "Expédiée", variant: "accent" },
  PROCESSING: { label: "En traitement", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "default" },
  PENDING: { label: "En attente", variant: "warning" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export default function OrdersPage() {
  const { data, loading, error, refetch } = useOrders({ page: 1, limit: 20 });

  const columns = [
    {
      key: "id",
      label: "Numéro",
      render: (o: Order) => <span className="font-mono text-xs text-(--accent)">{o.id}</span>,
    },
    {
      key: "customer",
      label: "Client",
      // ⚠️ L'API retourne uniquement userId, pas le nom du client
      // À enrichir côté backend avec user: { firstName, lastName }
      render: (o: Order) => <span className="text-(--text-secondary)">Client #{o.userId}</span>,
    },
    {
      key: "totalAmount",
      label: "Montant",
      render: (o: Order) => <span className="tabular-nums font-medium">{formatCurrency(o.totalAmount)}</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (o: Order) => {
        const s = statusConfig[o.status];
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (o: Order) => <span className="text-xs text-(--text-muted)">{formatDate(o.createdAt!)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (o: Order) => (
        <div className="flex justify-end">
          <Link href={`/orders/${o.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commandes"
        description={data ? `${data.total} commandes` : ""}
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          keyExtractor={(o) => o.id}
          emptyMessage="Aucune commande trouvée"
        />
      )}
    </div>
  );
}
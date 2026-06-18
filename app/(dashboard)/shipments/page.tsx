"use client";

import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { formatDate } from "../../../lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useShipments } from "../../../hooks/use-shipments";
import type { Shipment } from "../../../types";

const statusMap: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
  DELIVERED: { label: "Livré", variant: "success" },
  IN_TRANSIT: { label: "En transit", variant: "accent" },
  PENDING: { label: "En attente", variant: "warning" },
  CANCELLED: { label: "Annulé", variant: "danger" },
};

export default function ShipmentsPage() {
  const { data, loading, error, refetch } = useShipments({ page: 1, limit: 20 });

  const columns = [
    {
      key: "trackingNumber",
      label: "Numéro de suivi",
      render: (s: Shipment) => (
        <span className="font-mono text-sm text-(--accent)">{s.trackingNumber}</span>
      ),
    },
    {
      key: "recipient",
      label: "Destinataire",
      render: (s: Shipment) => (
        <div>
          <p className="font-medium text-(--text-primary)">{s.recipientName}</p>
          <p className="text-xs text-(--text-muted) truncate max-w-50">
            {s.recipientAddress}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (s: Shipment) => {
        const m = statusMap[s.status] ?? { label: s.status, variant: "default" as const };
        return <Badge variant={m.variant}>{m.label}</Badge>;
      },
    },
    {
      key: "estimatedDeliveryDate",
      label: "Livraison estimée",
      render: (s: Shipment) => (
        <span className="text-xs text-(--text-muted)">
          {formatDate(s.estimatedDeliveryDate)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (s: Shipment) => (
        <div className="flex justify-end">
          <Link href={`/shipments/${s.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expéditions"
        description={data ? `${data.total} expéditions` : ""}
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          keyExtractor={(s) => s.id}
          emptyMessage="Aucune expédition"
          pagination={
            data && data.totalPages > 1
              ? {
                  currentPage: data.page,
                  totalPages: data.totalPages,
                  totalItems: data.total,
                  pageSize: data.limit,
                  onPageChange: () => {},
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
"use client";

import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { usePayments } from "../../../hooks/use-payments";
import type { Payment } from "../../../types";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  COMPLETED: { label: "Complété", variant: "success" },
  PENDING: { label: "En attente", variant: "warning" },
  FAILED: { label: "Échoué", variant: "danger" },
  REFUNDED: { label: "Remboursé", variant: "default" },
  CANCELLED: { label: "Annulé", variant: "danger" },
};

const methodLabels: Record<string, string> = {
  CASH_ON_DELIVERY: "Paiement à la livraison",
  PAYPAL: "PayPal",
  STRIPE: "Stripe",
  CINETPAY: "CinetPay",
};

export default function PaymentsPage() {
  const { data, loading, error, refetch } = usePayments({ page: 1, limit: 20 });

  const columns = [
    {
      key: "id",
      label: "Référence",
      render: (p: Payment) => (
        <span className="font-mono text-xs text-(--accent)">{p.id}</span>
      ),
    },
    {
      key: "user",
      label: "Client",
      render: (p: Payment) =>
        p.user ? (
          <div>
            <p className="text-sm font-medium text-(--text-primary)">
              {p.user.firstName} {p.user.lastName}
            </p>
            <p className="text-xs text-(--text-muted)">{p.user.email}</p>
          </div>
        ) : (
          <span className="text-(--text-muted) text-xs">Client #{p.userId}</span>
        ),
    },
    {
      key: "orderId",
      label: "Commande",
      render: (p: Payment) => (
        <span className="font-mono text-xs text-(--text-muted)">{p.orderId}</span>
      ),
    },
    {
      key: "amount",
      label: "Montant",
      render: (p: Payment) => (
        <span className="tabular-nums font-medium">
          {formatCurrency(p.amount, p.currency)}
        </span>
      ),
    },
    {
      key: "method",
      label: "Méthode",
      render: (p: Payment) => (
        <span className="text-(--text-secondary) text-xs">
          {methodLabels[p.method]}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (p: Payment) => {
        const s = statusMap[p.status] ?? { label: p.status, variant: "default" as const };
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (p: Payment) => (
        <span className="text-xs text-(--text-muted)">
          {p.createdAt ? formatDate(p.createdAt) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paiements"
        description={data ? `${data.total} paiements` : ""}
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun paiement"
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
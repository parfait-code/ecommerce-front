import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { formatCurrency, formatDate } from "../../../lib/utils";
import type { Payment } from "../../../types";

const mockPayments: Payment[] = [
  { id: "ck_payment_1", orderId: "ck_order_001", userId: 1, method: "CASH_ON_DELIVERY", status: "COMPLETED", amount: 45000, currency: "XAF", createdAt: "2026-06-15T10:00:00Z" },
  { id: "ck_payment_2", orderId: "ck_order_002", userId: 2, method: "CASH_ON_DELIVERY", status: "PENDING", amount: 12990, currency: "XAF", createdAt: "2026-06-14T09:00:00Z" },
  { id: "ck_payment_3", orderId: "ck_order_003", userId: 3, method: "CASH_ON_DELIVERY", status: "FAILED", amount: 89900, currency: "XAF", createdAt: "2026-06-13T14:00:00Z" },
];

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  COMPLETED: { label: "Complété", variant: "success" },
  PENDING: { label: "En attente", variant: "warning" },
  FAILED: { label: "Échoué", variant: "danger" },
  REFUNDED: { label: "Remboursé", variant: "default" },
};

const methodLabels: Record<string, string> = {
  CASH_ON_DELIVERY: "Paiement à la livraison",
  PAYPAL: "PayPal",
  STRIPE: "Stripe",
  CINETPAY: "CinetPay",
};

export default function PaymentsPage() {
  const columns = [
    {
      key: "id",
      label: "Référence",
      render: (p: Payment) => <span className="font-mono text-xs text-[var(--accent)]">{p.id}</span>,
    },
    {
      key: "orderId",
      label: "Commande",
      render: (p: Payment) => <span className="font-mono text-xs text-[var(--text-muted)]">{p.orderId}</span>,
    },
    {
      key: "amount",
      label: "Montant",
      render: (p: Payment) => <span className="tabular-nums font-medium">{formatCurrency(p.amount, p.currency)}</span>,
    },
    {
      key: "method",
      label: "Méthode",
      render: (p: Payment) => <span className="text-[var(--text-secondary)] text-xs">{methodLabels[p.method]}</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (p: Payment) => {
        const s = statusMap[p.status];
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (p: Payment) => <span className="text-xs text-[var(--text-muted)]">{formatDate(p.createdAt!)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Paiements" description={`${mockPayments.length} paiements`} />
      <DataTable columns={columns} data={mockPayments} keyExtractor={(p) => p.id} emptyMessage="Aucun paiement" />
    </div>
  );
}
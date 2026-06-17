import Link from "next/link";
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { Eye } from "lucide-react";
import type { Order } from "../../../types";

const mockOrders: Order[] = [
  {
    id: "ck_order_001",
    userId: 1,
    status: "DELIVERED",
    totalAmount: 45000,
    shippingAddress: { street: "12 Rue de la Paix", city: "Yaoundé", country: "CM", postalCode: "00237" },
    items: [],
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "ck_order_002",
    userId: 2,
    status: "SHIPPED",
    totalAmount: 12990,
    shippingAddress: { street: "5 Av. Kennedy", city: "Douala", country: "CM", postalCode: "00237" },
    items: [],
    createdAt: "2026-06-14T09:00:00Z",
  },
  {
    id: "ck_order_003",
    userId: 3,
    status: "PENDING",
    totalAmount: 89900,
    shippingAddress: { street: "8 Bd. de l'Indépendance", city: "Bafoussam", country: "CM", postalCode: "00237" },
    items: [],
    createdAt: "2026-06-13T14:00:00Z",
  },
];

const statusConfig: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
  DELIVERED: { label: "Livrée", variant: "success" },
  SHIPPED: { label: "Expédiée", variant: "accent" },
  PROCESSING: { label: "En traitement", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "default" },
  PENDING: { label: "En attente", variant: "warning" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export default function OrdersPage() {
  const columns = [
    {
      key: "id",
      label: "Numéro",
      render: (o: Order) => (
        <span className="font-mono text-xs text-[var(--accent)]">{o.id}</span>
      ),
    },
    {
      key: "customer",
      label: "Client",
      render: (o: Order) => (
        <span className="text-[var(--text-secondary)]">User #{o.userId}</span>
      ),
    },
    {
      key: "totalAmount",
      label: "Montant",
      render: (o: Order) => (
        <span className="tabular-nums font-medium">{formatCurrency(o.totalAmount)}</span>
      ),
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
      render: (o: Order) => (
        <span className="text-xs text-[var(--text-muted)]">
          {formatDate(o.createdAt!)}
        </span>
      ),
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
        description={`${mockOrders.length} commandes`}
      />
      <DataTable
        columns={columns}
        data={mockOrders}
        keyExtractor={(o) => o.id}
        emptyMessage="Aucune commande trouvée"
      />
    </div>
  );
}
// recent-orders-widget.tsx
import Link from "next/link";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ArrowRight } from "lucide-react";

const recentOrders = [
  {
    id: "ck_order_001",
    customer: "Jean Dupont",
    amount: 45000,
    status: "DELIVERED",
    date: "2026-06-15",
    items: 3,
  },
  {
    id: "ck_order_002",
    customer: "Marie Nkomo",
    amount: 12990,
    status: "SHIPPED",
    date: "2026-06-15",
    items: 1,
  },
  {
    id: "ck_order_003",
    customer: "Paul Biya",
    amount: 89900,
    status: "PROCESSING",
    date: "2026-06-14",
    items: 5,
  },
  {
    id: "ck_order_004",
    customer: "Aminata Diallo",
    amount: 9990,
    status: "PENDING",
    date: "2026-06-14",
    items: 1,
  },
  {
    id: "ck_order_005",
    customer: "Stéphane Mvondo",
    amount: 34500,
    status: "CANCELLED",
    date: "2026-06-13",
    items: 2,
  },
];

const statusConfig: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
  DELIVERED: { label: "Livrée", variant: "success" },
  SHIPPED: { label: "Expédiée", variant: "accent" },
  PROCESSING: { label: "En traitement", variant: "warning" },
  PENDING: { label: "En attente", variant: "default" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export function RecentOrdersWidget() {
  return (
    <Card padding="none">
      <div className="flex items-center justify-between border-b border-(--border) px-5 py-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">
          Dernières commandes
        </h3>
        <Link href="/orders">
          <Button variant="ghost" size="sm" icon={<ArrowRight size={13} />}>
            Voir tout
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border-subtle)">
              {["ID", "Client", "Montant", "Articles", "Statut", "Date"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const s = statusConfig[order.status];
              return (
                <tr
                  key={order.id}
                  className="border-b border-(--border-subtle) transition-colors hover:bg-(--bg-hover) last:border-0"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs font-mono text-(--accent) hover:underline"
                    >
                      {order.id.slice(0, 14)}…
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-(--text-primary)">
                    {order.customer}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-(--text-primary)">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-5 py-3 text-sm text-(--text-secondary)">
                    {order.items}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-(--text-muted)">
                    {formatDate(order.date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
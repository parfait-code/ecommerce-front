import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Package,
  CreditCard,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Circle,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { formatCurrency, formatDateTime } from "../../../../lib/utils";
import type { Order } from "../../../../types";

// ── Mock data ──────────────────────────────────────────────────────────────────

const mockOrder: Order = {
  id: "ck_order_001",
  userId: 1,
  status: "SHIPPED",
  totalAmount: 45000,
  shippingAddress: {
    street: "12 Rue de la Paix",
    city: "Yaoundé",
    country: "CM",
    postalCode: "00237",
  },
  notes: "Livrer après 18h de préférence.",
  items: [
    {
      id: "ck_oi_1",
      productId: 1,
      quantity: 2,
      price: 9990,
      product: {
        id: 1,
        name: "T-shirt en coton",
        description: "",
        price: 9990,
        category: "Vêtements",
        stock: 50,
        images: [],
        createdAt: "",
        updatedAt: "",
      },
    },
    {
      id: "ck_oi_2",
      productId: 2,
      quantity: 1,
      price: 24990,
      product: {
        id: 2,
        name: "Sac à dos Sport",
        description: "",
        price: 24990,
        category: "Bagagerie",
        stock: 10,
        images: [],
        createdAt: "",
        updatedAt: "",
      },
    },
  ],
  createdAt: "2026-06-10T09:00:00Z",
  updatedAt: "2026-06-12T14:00:00Z",
};

const mockPayment = {
  id: "ck_payment_1",
  method: "CASH_ON_DELIVERY",
  status: "PENDING",
  amount: 45000,
  currency: "XAF",
};

const timeline = [
  {
    status: "PENDING",
    label: "Commande passée",
    date: "2026-06-10T09:00:00Z",
    done: true,
  },
  {
    status: "CONFIRMED",
    label: "Commande confirmée",
    date: "2026-06-10T09:45:00Z",
    done: true,
  },
  {
    status: "PROCESSING",
    label: "En préparation",
    date: "2026-06-11T08:00:00Z",
    done: true,
  },
  {
    status: "SHIPPED",
    label: "Expédiée",
    date: "2026-06-12T14:00:00Z",
    done: true,
  },
  { status: "DELIVERED", label: "Livrée", date: null, done: false },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "success" | "accent" | "warning" | "danger" | "default";
  }
> = {
  DELIVERED: { label: "Livrée", variant: "success" },
  SHIPPED: { label: "Expédiée", variant: "accent" },
  PROCESSING: { label: "En traitement", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "default" },
  PENDING: { label: "En attente", variant: "warning" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

const methodLabels: Record<string, string> = {
  CASH_ON_DELIVERY: "Paiement à la livraison",
  PAYPAL: "PayPal",
  STRIPE: "Stripe",
  CINETPAY: "CinetPay",
};

const paymentStatusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "default" }
> = {
  COMPLETED: { label: "Payé", variant: "success" },
  PENDING: { label: "En attente", variant: "warning" },
  FAILED: { label: "Échoué", variant: "danger" },
  REFUNDED: { label: "Remboursé", variant: "default" },
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = mockOrder;
  const s = statusConfig[order.status];
  const ps = paymentStatusConfig[mockPayment.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/orders">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
              Commandes
            </Button>
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)] font-mono">
              {order.id}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Passée le {formatDateTime(order.createdAt!)}
            </p>
          </div>
        </div>
        <Badge variant={s.variant}>{s.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 xl:col-span-2">
          {/* Articles */}
          <Card padding="none">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-4">
              <Package size={15} className="text-[var(--accent)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Articles commandés
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-hover)] text-[var(--text-muted)]">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {item.product?.name ?? `Produit #${item.productId}`}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Qté : {item.quantity} ×{" "}
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-hover)] px-5 py-3">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Total commande
              </span>
              <span className="text-base font-bold text-[var(--text-primary)] tabular-nums">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[var(--accent)]" />
                <CardTitle>Historique & statut</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-0">
              {timeline.map((step, i) => {
                const isLast = i === timeline.length - 1;
                return (
                  <div key={step.status} className="flex gap-3">
                    {/* Icône + ligne */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          step.done
                            ? "bg-[var(--success)] text-white"
                            : "border-2 border-[var(--border)] text-[var(--text-muted)]"
                        }`}
                      >
                        {step.done ? (
                          order.status === "CANCELLED" ? (
                            <XCircle size={12} />
                          ) : (
                            <CheckCircle2 size={12} />
                          )
                        ) : (
                          <Circle size={12} />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`mt-0.5 w-0.5 flex-1 min-h-[24px] ${
                            step.done
                              ? "bg-[var(--success)]"
                              : "bg-[var(--border)]"
                          }`}
                        />
                      )}
                    </div>
                    {/* Contenu */}
                    <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                      <p
                        className={`text-sm font-medium ${
                          step.done
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {formatDateTime(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Client & adresse */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--accent)]" />
                <CardTitle>Livraison</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Client #{order.userId}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {order.shippingAddress.street}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {order.shippingAddress.postalCode}
              </p>
            </div>
            {order.notes && (
              <div className="mt-3 rounded-lg bg-[var(--bg-hover)] p-3">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Note client
                </p>
                <p className="text-sm text-[var(--text-secondary)] italic">
                  &ldquo;{order.notes}&rdquo;
                </p>
              </div>
            )}
          </Card>

          {/* Paiement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-[var(--accent)]" />
                <CardTitle>Paiement</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Méthode</span>
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {methodLabels[mockPayment.method]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Statut</span>
                <Badge variant={ps.variant}>{ps.label}</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                <span className="text-xs text-[var(--text-muted)]">Montant</span>
                <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                  {formatCurrency(mockPayment.amount, mockPayment.currency)}
                </span>
              </div>
            </div>
          </Card>

          {/* Expédition */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[var(--accent)]" />
                <CardTitle>Expédition</CardTitle>
              </div>
            </CardHeader>
            <Link href={`/shipments/ck_shipment_1`}>
              <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 hover:border-[var(--accent)] transition-colors cursor-pointer">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Numéro de suivi
                  </p>
                  <p className="text-sm font-mono font-medium text-[var(--accent)]">
                    K3J9XQ2P1A
                  </p>
                </div>
                <Badge variant="accent">En transit</Badge>
              </div>
            </Link>
          </Card>

          {/* Actions */}
          <Card>
            <CardTitle className="mb-3">Actions</CardTitle>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full">
                Mettre à jour le statut
              </Button>
              <Button variant="danger" size="sm" className="w-full">
                Annuler la commande
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
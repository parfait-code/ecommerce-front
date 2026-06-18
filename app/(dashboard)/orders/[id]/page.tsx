"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Package, CreditCard, Clock, CheckCircle2, XCircle, Circle } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { LoadingState, ErrorState } from "../../../../components/shared/loading-state";
import { formatCurrency, formatDateTime } from "../../../../lib/utils";
import { useOrder } from "../../../../hooks/use-orders";
import { ordersService } from "../../../../services/orders.service";
import { useAuthStore } from "../../../../store/auth.store";
import { useState, useEffect } from "react";
import type { Payment } from "../../../../types";

const ORDER_STEPS = [
  { status: "PENDING", label: "Commande passée" },
  { status: "CONFIRMED", label: "Commande confirmée" },
  { status: "PROCESSING", label: "En préparation" },
  { status: "SHIPPED", label: "Expédiée" },
  { status: "DELIVERED", label: "Livrée" },
];

const STATUS_ORDER = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const statusConfig: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
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

const paymentStatusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  COMPLETED: { label: "Payé", variant: "success" },
  PENDING: { label: "En attente", variant: "warning" },
  FAILED: { label: "Échoué", variant: "danger" },
  REFUNDED: { label: "Remboursé", variant: "default" },
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order, loading, error } = useOrder(params.id);
  const { token } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!token || !params.id) return;
    ordersService.getPayments(params.id, token)
      .then(setPayments)
      .catch(() => {});
  }, [token, params.id]);

  async function handleCancel() {
    if (!token || !confirm("Annuler cette commande ?")) return;
    setCancelling(true);
    try {
      await ordersService.cancel(params.id, token);
      window.location.reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
      setCancelling(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error || !order) return <ErrorState message={error ?? "Commande introuvable"} />;

  const s = statusConfig[order.status];
  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";
  const payment = payments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/orders">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Commandes</Button>
          </Link>
          <span className="text-(--text-muted)">/</span>
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) font-mono">{order.id}</h1>
            <p className="text-xs text-(--text-muted) mt-0.5">Passée le {formatDateTime(order.createdAt!)}</p>
          </div>
        </div>
        <Badge variant={s.variant}>{s.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {/* Articles */}
          <Card padding="none">
            <div className="flex items-center gap-2 border-b border-(--border) px-5 py-4">
              <Package size={15} className="text-(--accent)" />
              <h2 className="text-sm font-semibold text-(--text-primary)">Articles commandés</h2>
            </div>
            <div className="divide-y divide-(--border-subtle)">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--bg-hover) text-(--text-muted)">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-(--text-primary)">
                        {item.product?.name ?? `Produit #${item.productId}`}
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        Qté : {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-(--text-primary) tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-(--border) bg-(--bg-hover) px-5 py-3">
              <span className="text-sm font-medium text-(--text-secondary)">Total commande</span>
              <span className="text-base font-bold text-(--text-primary) tabular-nums">{formatCurrency(order.totalAmount)}</span>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-(--accent)" />
                <CardTitle>Historique & statut</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-0">
              {ORDER_STEPS.map((step, i) => {
                const done = isCancelled ? false : currentStatusIndex >= i;
                const isLast = i === ORDER_STEPS.length - 1;
                return (
                  <div key={step.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-(--success) text-white" : "border-2 border-(--border) text-(--text-muted)"}`}>
                        {done ? <CheckCircle2 size={12} /> : isCancelled && i === 0 ? <XCircle size={12} /> : <Circle size={12} />}
                      </div>
                      {!isLast && (
                        <div className={`mt-0.5 w-0.5 flex-1 min-h-6 ${done ? "bg-(--success)" : "bg-(--border)"}`} />
                      )}
                    </div>
                    <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                      <p className={`text-sm font-medium ${done ? "text-(--text-primary)" : "text-(--text-muted)"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              {isCancelled && (
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--danger) text-white">
                    <XCircle size={12} />
                  </div>
                  <p className="text-sm font-medium text-(--danger)">Commande annulée</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Livraison */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-(--accent)" />
                <CardTitle>Livraison</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-1">
              <p className="text-sm font-medium text-(--text-primary)">Client #{order.userId}</p>
              <p className="text-sm text-(--text-secondary)">{order.shippingAddress.street}</p>
              <p className="text-sm text-(--text-secondary)">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p className="text-sm text-(--text-secondary)">{order.shippingAddress.postalCode}</p>
            </div>
            {order.notes && (
              <div className="mt-3 rounded-lg bg-(--bg-hover) p-3">
                <p className="text-xs text-(--text-muted) mb-1">Note client</p>
                <p className="text-sm text-(--text-secondary) italic">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}
          </Card>

          {/* Paiement */}
          {payment && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-(--accent)" />
                  <CardTitle>Paiement</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-(--text-muted)">Méthode</span>
                  <span className="text-xs font-medium text-(--text-primary)">{methodLabels[payment.method]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-(--text-muted)">Statut</span>
                  <Badge variant={paymentStatusConfig[payment.status].variant}>
                    {paymentStatusConfig[payment.status].label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-t border-(--border-subtle) pt-3">
                  <span className="text-xs text-(--text-muted)">Montant</span>
                  <span className="text-sm font-bold text-(--text-primary) tabular-nums">{formatCurrency(payment.amount, payment.currency)}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardTitle className="mb-3">Actions</CardTitle>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full">
                Mettre à jour le statut
              </Button>
              {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                <Button variant="danger" size="sm" className="w-full" loading={cancelling} onClick={handleCancel}>
                  Annuler la commande
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
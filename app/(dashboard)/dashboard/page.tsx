"use client";

import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { StatCard } from "../../../components/cards/stat-card";
import { LowStockWidget } from "../../../features/dashboard/low-stock-widget";
import { SalesChartWidget } from "../../../features/dashboard/sales-chart-widget";
import { RecentOrdersWidget } from "../../../features/dashboard/recent-orders-widget";
import { useDashboardStats } from "../../../hooks/use-dashboard";

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M XAF`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K XAF`;
  return `${amount} XAF`;
}

export default function DashboardPage() {
  const { data: stats, loading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-(--text-primary)">Dashboard</h1>
        <p className="mt-0.5 text-sm text-(--text-muted)">
          Vue d&apos;ensemble de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Produits"
          value={loading ? "—" : (stats?.products.total ?? "—").toString()}
          subtitle={
            stats ? `${stats.products.addedThisMonth} ajoutés ce mois` : "Chargement…"
          }
          icon={Package}
          color="accent"
        />
        <StatCard
          title="Commandes"
          value={loading ? "—" : (stats?.orders.thisMonth ?? "—").toString()}
          subtitle="ce mois"
          icon={ShoppingCart}
          trend={stats?.orders.trend}
          color="success"
        />
        <StatCard
          title="Clients"
          value={loading ? "—" : (stats?.users.total ?? "—").toString()}
          subtitle="comptes actifs"
          icon={Users}
          color="accent"
        />
        <StatCard
          title="Paiements"
          value={
            loading
              ? "—"
              : stats
              ? formatAmount(stats.payments.totalAmountThisMonth)
              : "—"
          }
          subtitle="ce mois"
          icon={CreditCard}
          trend={stats?.payments.trend}
          color="warning"
        />
        <StatCard
          title="Stocks faibles"
          value={loading ? "—" : (stats?.inventory.lowStockCount ?? "—").toString()}
          subtitle="articles sous seuil"
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="Expéditions"
          value={loading ? "—" : (stats?.shipments.inProgress ?? "—").toString()}
          subtitle="en cours"
          icon={Truck}
          trend={stats?.shipments.trend}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChartWidget />
        </div>
        <div>
          <LowStockWidget />
        </div>
      </div>

      <RecentOrdersWidget />
    </div>
  );
}
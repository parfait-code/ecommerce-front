import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { StatCard } from "../../../components/cards/stat-card";
import { RecentOrdersWidget } from "../../../features/dashboard/recent-orders-widget";
import { LowStockWidget } from "../../../features/dashboard/low-stock-widget";
import { SalesChartWidget } from "../../../features/dashboard/sales-chart-widget";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-[var(--text-muted)]">
          Vue d&apos;ensemble de la plateforme
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Produits"
          value="248"
          subtitle="12 ajoutés ce mois"
          icon={Package}
          trend={8}
          color="accent"
        />
        <StatCard
          title="Commandes"
          value="1 284"
          subtitle="ce mois"
          icon={ShoppingCart}
          trend={12}
          color="success"
        />
        <StatCard
          title="Clients"
          value="3 429"
          subtitle="actifs"
          icon={Users}
          trend={5}
          color="accent"
        />
        <StatCard
          title="Paiements"
          value="4,2M XAF"
          subtitle="ce mois"
          icon={CreditCard}
          trend={-3}
          color="warning"
        />
        <StatCard
          title="Stocks faibles"
          value="14"
          subtitle="articles sous seuil"
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="Expéditions"
          value="67"
          subtitle="en cours"
          icon={Truck}
          trend={21}
          color="success"
        />
      </div>

      {/* Charts + widgets */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChartWidget />
        </div>
        <div>
          <LowStockWidget />
        </div>
      </div>

      {/* Recent orders */}
      <RecentOrdersWidget />
    </div>
  );
}
// page.tsx (UserDetailPage)
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  ShoppingCart,
  MapPin,
  CreditCard,
  Pencil,
  Ban,
  Trash2,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { formatCurrency, formatDate, formatDateTime, getInitials } from "../../../../lib/utils";
import type { User, Order, Address } from "../../../../types";

// ── Mock data ──────────────────────────────────────────────────────────────────

const mockUser: User = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  age: 28,
  role: "user",
  createdAt: "2026-01-10T10:00:00Z",
  updatedAt: "2026-06-15T08:30:00Z",
};

const mockOrders: Order[] = [
  {
    id: "ck_order_001",
    userId: 1,
    status: "DELIVERED",
    totalAmount: 45000,
    shippingAddress: { street: "12 Rue de la Paix", city: "Yaoundé", country: "CM", postalCode: "00237" },
    items: [],
    createdAt: "2026-06-10T09:00:00Z",
  },
  {
    id: "ck_order_002",
    userId: 1,
    status: "SHIPPED",
    totalAmount: 12990,
    shippingAddress: { street: "12 Rue de la Paix", city: "Yaoundé", country: "CM", postalCode: "00237" },
    items: [],
    createdAt: "2026-06-14T09:00:00Z",
  },
];

const mockAddresses: Address[] = [
  {
    id: "ck_address_1",
    userId: 1,
    street: "12 Rue de la Paix",
    city: "Yaoundé",
    country: "CM",
    postalCode: "00237",
    isDefault: true,
  },
  {
    id: "ck_address_2",
    userId: 1,
    street: "5 Av. Kennedy",
    city: "Douala",
    country: "CM",
    postalCode: "00237",
    isDefault: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const roleColors: Record<string, "accent" | "success" | "warning" | "default"> = {
  user: "default",
  admin: "accent",
  SUPER_ADMIN: "success",
  MANAGER: "warning",
  ANALYST: "default",
};

const roleLabels: Record<string, string> = {
  user: "Utilisateur",
  admin: "Administrateur",
  SUPER_ADMIN: "Super Admin",
  MANAGER: "Manager",
  ANALYST: "Analyste",
};

const orderStatusConfig: Record<string, { label: string; variant: "success" | "accent" | "warning" | "danger" | "default" }> = {
  DELIVERED: { label: "Livrée", variant: "success" },
  SHIPPED: { label: "Expédiée", variant: "accent" },
  PROCESSING: { label: "En traitement", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "default" },
  PENDING: { label: "En attente", variant: "warning" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = mockUser;
  const totalSpent = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/users">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
              Utilisateurs
            </Button>
          </Link>
          <span className="text-(--text-muted)">/</span>
          <h1 className="text-xl font-semibold text-(--text-primary)">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/users/${params.id}/edit`}>
            <Button variant="secondary" size="sm" icon={<Pencil size={13} />}>
              Modifier
            </Button>
          </Link>
          <Button variant="secondary" size="sm" icon={<Ban size={13} />}>
            Bloquer
          </Button>
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 xl:col-span-2">
          {/* Profil */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-(--accent-muted) text-xl font-bold text-(--accent)">
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-(--text-primary)">
                    {user.firstName} {user.lastName}
                  </h2>
                  <Badge variant={roleColors[user.role] || "default"}>
                    {roleLabels[user.role] || user.role}
                  </Badge>
                </div>
                <p className="text-sm text-(--text-muted) mt-0.5">
                  @{user.username}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                    <Mail size={13} className="text-(--text-muted)" />
                    {user.email}
                  </div>
                  {user.age && (
                    <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                      <Phone size={13} className="text-(--text-muted)" />
                      {user.age} ans
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
                    <Shield size={13} className="text-(--text-muted)" />
                    Inscrit le {formatDate(user.createdAt!)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Commandes */}
          <Card padding="none">
            <div className="flex items-center gap-2 border-b border-(--border) px-5 py-4">
              <ShoppingCart size={14} className="text-(--accent)" />
              <h2 className="text-sm font-semibold text-(--text-primary)">
                Commandes ({mockOrders.length})
              </h2>
            </div>
            <div className="divide-y divide-(--border-subtle)">
              {mockOrders.map((order) => {
                const s = orderStatusConfig[order.status];
                return (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <div className="flex items-center justify-between px-5 py-3 hover:bg-(--bg-hover) transition-colors">
                      <div>
                        <p className="text-sm font-mono text-(--accent)">
                          {order.id}
                        </p>
                        <p className="text-xs text-(--text-muted) mt-0.5">
                          {formatDate(order.createdAt!)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums text-(--text-primary)">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Adresses */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-(--accent)" />
                <CardTitle>Adresses ({mockAddresses.length})</CardTitle>
              </div>
            </CardHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              {mockAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`rounded-lg border p-3 ${
                    addr.isDefault
                      ? "border-(--accent) bg-(--accent-muted)"
                      : "border-(--border) bg-(--bg-hover)"
                  }`}
                >
                  {addr.isDefault && (
                    <Badge variant="accent" className="mb-2">
                      Principale
                    </Badge>
                  )}
                  <p className="text-sm text-(--text-primary)">
                    {addr.street}
                  </p>
                  <p className="text-xs text-(--text-muted) mt-0.5">
                    {addr.city}, {addr.country} — {addr.postalCode}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Stats */}
          <Card>
            <CardTitle className="mb-4">Statistiques</CardTitle>
            <div className="space-y-3">
              {[
                {
                  icon: ShoppingCart,
                  label: "Commandes",
                  value: mockOrders.length.toString(),
                  color: "text-(--accent)",
                  bg: "bg-(--accent-muted)",
                },
                {
                  icon: CreditCard,
                  label: "Total dépensé",
                  value: formatCurrency(totalSpent),
                  color: "text-(--success)",
                  bg: "bg-(--success-muted)",
                },
                {
                  icon: MapPin,
                  label: "Adresses",
                  value: mockAddresses.length.toString(),
                  color: "text-(--warning)",
                  bg: "bg-(--warning-muted)",
                },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg bg-(--bg-hover) p-3"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                    <Icon size={14} className={color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-(--text-muted)">{label}</p>
                    <p className="text-sm font-semibold text-(--text-primary)">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Infos compte */}
          <Card>
            <CardTitle className="mb-3">Informations compte</CardTitle>
            <div className="space-y-2">
              {[
                { label: "ID", value: `#${user.id}` },
                { label: "Rôle", value: roleLabels[user.role] || user.role },
                { label: "Inscription", value: formatDate(user.createdAt!) },
                { label: "Dernière MAJ", value: formatDate(user.updatedAt!) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-1.5 border-b border-(--border-subtle) last:border-0"
                >
                  <span className="text-xs text-(--text-muted)">{label}</span>
                  <span className="text-xs font-medium text-(--text-primary)">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Changer rôle */}
          <Card>
            <CardTitle className="mb-3">Changer le rôle</CardTitle>
            <div className="space-y-2">
              {["user", "admin", "MANAGER", "ANALYST"].map((role) => (
                <button
                  key={role}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    user.role === role
                      ? "border-(--accent) bg-(--accent-muted) text-(--accent)"
                      : "border-(--border) text-(--text-secondary) hover:border-(--accent) hover:text-(--accent)"
                  }`}
                >
                  {roleLabels[role] || role}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Boxes, MapPin, BarChart3 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import type { Warehouse, InventoryItem, Product } from "../../../../types";

// ── Mock data ──────────────────────────────────────────────────────────────────

const mockWarehouse: Warehouse = {
  id: "ck_warehouse_1",
  name: "Entrepôt Yaoundé",
  location: "Yaoundé, Cameroun",
  capacity: 1000,
};

type StockRow = Omit<InventoryItem, "product"> & { product: Product };

const mockStock: StockRow[] = [
  {
    id: "ck_inv_1",
    productId: 1,
    warehouseId: "ck_warehouse_1",
    quantity: 50,
    product: { id: 1, name: "T-shirt en coton", description: "", price: 9990, category: "Vêtements", stock: 50, images: [], createdAt: "", updatedAt: "" },
  },
  {
    id: "ck_inv_2",
    productId: 2,
    warehouseId: "ck_warehouse_1",
    quantity: 3,
    product: { id: 2, name: "Casquette noire", description: "", price: 5990, category: "Accessoires", stock: 3, images: [], createdAt: "", updatedAt: "" },
  },
  {
    id: "ck_inv_3",
    productId: 3,
    warehouseId: "ck_warehouse_1",
    quantity: 0,
    product: { id: 3, name: "Sac à dos Sport", description: "", price: 24990, category: "Bagagerie", stock: 0, images: [], createdAt: "", updatedAt: "" },
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const wh = mockWarehouse;
  const totalUnits = mockStock.reduce((s, i) => s + i.quantity, 0);
  const occupancy = Math.round((totalUnits / wh.capacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/warehouses">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Entrepôts</Button>
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{wh.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Pencil size={13} />}>Modifier</Button>
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>Supprimer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 xl:col-span-2">
          {/* Inventaire */}
          <Card padding="none">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-4">
              <Boxes size={14} className="text-[var(--accent)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Inventaire ({mockStock.length} produits)
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {mockStock.map((item) => {
                const pct = Math.min((item.quantity / 100) * 100, 100);
                const color = item.quantity === 0 ? "var(--danger)" : item.quantity < 10 ? "var(--warning)" : "var(--success)";
                return (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">{item.product.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                      <span className="w-16 text-right text-sm font-semibold tabular-nums" style={{ color }}>
                        {item.quantity} u.
                      </span>
                      {item.quantity === 0 ? (
                        <Badge variant="danger">Rupture</Badge>
                      ) : item.quantity < 10 ? (
                        <Badge variant="warning">Bas</Badge>
                      ) : (
                        <Badge variant="success">OK</Badge>
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
          {/* Infos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--accent)]" />
                <CardTitle>Informations</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-2">
              {[
                { label: "ID", value: wh.id },
                { label: "Nom", value: wh.name },
                { label: "Localisation", value: wh.location },
                { label: "Capacité max", value: `${wh.capacity.toLocaleString()} u.` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                  <span className="text-xs text-[var(--text-muted)]">{label}</span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Occupation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-[var(--accent)]" />
                <CardTitle>Occupation</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>{totalUnits} unités stockées</span>
                <span>{wh.capacity} max</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${occupancy}%`,
                    backgroundColor: occupancy > 80 ? "var(--danger)" : occupancy > 60 ? "var(--warning)" : "var(--success)",
                  }}
                />
              </div>
              <p className="text-center text-2xl font-bold text-[var(--text-primary)]">
                {occupancy}%
                <span className="text-sm font-normal text-[var(--text-muted)] ml-1">occupé</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
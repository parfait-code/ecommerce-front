"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Boxes, MapPin, BarChart3 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { LoadingState, ErrorState } from "../../../../components/shared/loading-state";
import { useWarehouse } from "../../../../hooks/use-warehouses";
import { warehousesService } from "../../../../services/warehouses.service";
import { useAuthStore } from "../../../../store/auth.store";
import { useState, useEffect } from "react";
import type { InventoryItem } from "../../../../types";

export default function WarehouseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: wh, loading, error } = useWarehouse(params.id);
  const { token } = useAuthStore();
  const [stock, setStock] = useState<InventoryItem[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);

  useEffect(() => {
    if (!token || !params.id) return;
    warehousesService.getInventory(params.id, token).then((res) => {
      setStock(res.items);
      setTotalUnits(res.warehouse.totalUnits);
    }).catch(() => {});
  }, [token, params.id]);

  if (loading) return <LoadingState />;
  if (error || !wh) return <ErrorState message={error ?? "Entrepôt introuvable"} />;

  const occupancy = Math.round((totalUnits / wh.capacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/warehouses">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
              Entrepôts
            </Button>
          </Link>
          <span className="text-(--text-muted)">/</span>
          <h1 className="text-xl font-semibold text-(--text-primary)">{wh.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Pencil size={13} />}>
            Modifier
          </Button>
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Inventaire */}
        <div className="space-y-4 xl:col-span-2">
          <Card padding="none">
            <div className="flex items-center gap-2 border-b border-(--border) px-5 py-4">
              <Boxes size={14} className="text-(--accent)" />
              <h2 className="text-sm font-semibold text-(--text-primary)">
                Inventaire ({stock.length} produits)
              </h2>
            </div>
            {stock.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-(--text-muted)">
                Aucun produit dans cet entrepôt
              </p>
            ) : (
              <div className="divide-y divide-(--border-subtle)">
                {stock.map((item) => {
                  const pct = Math.min((item.quantity / 100) * 100, 100);
                  const color =
                    item.quantity === 0
                      ? "var(--danger)"
                      : item.quantity < 10
                      ? "var(--warning)"
                      : "var(--success)";
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-(--text-primary)">
                          {item.product?.name ?? `Produit #${item.productId}`}
                        </p>
                        <p className="text-xs text-(--text-muted)">
                          {item.product?.category ?? "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--border)">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                        <span
                          className="w-16 text-right text-sm font-semibold tabular-nums"
                          style={{ color }}
                        >
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
            )}
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-(--accent)" />
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
                <div
                  key={label}
                  className="flex justify-between py-1.5 border-b border-(--border-subtle) last:border-0"
                >
                  <span className="text-xs text-(--text-muted)">{label}</span>
                  <span className="text-xs font-medium text-(--text-primary)">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-(--accent)" />
                <CardTitle>Occupation</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-(--text-muted)">
                <span>{totalUnits} unités stockées</span>
                <span>{wh.capacity} max</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-(--border)">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${occupancy}%`,
                    backgroundColor:
                      occupancy > 80
                        ? "var(--danger)"
                        : occupancy > 60
                        ? "var(--warning)"
                        : "var(--success)",
                  }}
                />
              </div>
              <p className="text-center text-2xl font-bold text-(--text-primary)">
                {occupancy}%
                <span className="text-sm font-normal text-(--text-muted) ml-1">
                  occupé
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
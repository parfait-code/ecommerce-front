"use client";

import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useInventory } from "../../../hooks/use-inventory";
import type { InventoryItem } from "../../../types";

function QuantityBadge({ qty }: { qty: number }) {
  if (qty === 0) return <Badge variant="danger">Rupture</Badge>;
  if (qty < 10) return <Badge variant="warning">Stock bas · {qty}</Badge>;
  return <Badge variant="success">{qty} unités</Badge>;
}

export default function InventoryPage() {
  const { data, loading, error, refetch } = useInventory();

  const columns = [
    {
      key: "product",
      label: "Produit",
      render: (i: InventoryItem) => (
        <div>
          <p className="font-medium text-(--text-primary)">{i.product?.name ?? `Produit #${i.productId}`}</p>
          <p className="text-xs text-(--text-muted)">{i.product?.category ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "warehouse",
      label: "Entrepôt",
      render: (i: InventoryItem) => (
        <div>
          <p className="text-sm text-(--text-secondary)">{i.warehouse?.name ?? `Entrepôt #${i.warehouseId}`}</p>
          <p className="text-xs text-(--text-muted)">{i.warehouse?.location ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantité",
      render: (i: InventoryItem) => <QuantityBadge qty={i.quantity} />,
    },
    {
      key: "actions",
      label: "",
      render: (i: InventoryItem) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/inventory/${i.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventaire"
        description={data ? `${data.length} entrées de stock` : ""}
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable columns={columns} data={data} keyExtractor={(i) => i.id} emptyMessage="Inventaire vide" />
      )}
    </div>
  );
}
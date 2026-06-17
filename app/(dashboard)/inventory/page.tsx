// page.tsx (InventoryPage)
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { InventoryItem } from "../../../types";

type InventoryRow = Omit<InventoryItem, "product" | "warehouse"> & {
  product: { id: number; name: string; category: string };
  warehouse: { id: string; name: string; location: string };
};

const mockInventory: InventoryRow[] = [
  {
    id: "ck_inv_1",
    productId: 1,
    warehouseId: "ck_warehouse_1",
    quantity: 50,
    product: { id: 1, name: "T-shirt en coton", category: "Vêtements" },
    warehouse: { id: "ck_warehouse_1", name: "Entrepôt Yaoundé", location: "Yaoundé" },
  },
  {
    id: "ck_inv_2",
    productId: 2,
    warehouseId: "ck_warehouse_1",
    quantity: 3,
    product: { id: 2, name: "Casquette noire", category: "Accessoires" },
    warehouse: { id: "ck_warehouse_1", name: "Entrepôt Yaoundé", location: "Yaoundé" },
  },
  {
    id: "ck_inv_3",
    productId: 3,
    warehouseId: "ck_warehouse_2",
    quantity: 0,
    product: { id: 3, name: "Sac à dos Sport", category: "Bagagerie" },
    warehouse: { id: "ck_warehouse_2", name: "Entrepôt Douala", location: "Douala" },
  },
];

function QuantityBadge({ qty }: { qty: number }) {
  if (qty === 0) return <Badge variant="danger">Rupture</Badge>;
  if (qty < 10) return <Badge variant="warning">Stock bas · {qty}</Badge>;
  return <Badge variant="success">{qty} unités</Badge>;
}

export default function InventoryPage() {
  const columns = [
    {
      key: "product",
      label: "Produit",
      render: (i: InventoryRow) => (
        <div>
          <p className="font-medium text-(--text-primary)">{i.product.name}</p>
          <p className="text-xs text-(--text-muted)">{i.product.category}</p>
        </div>
      ),
    },
    {
      key: "warehouse",
      label: "Entrepôt",
      render: (i: InventoryRow) => (
        <div>
          <p className="text-sm text-(--text-secondary)">{i.warehouse.name}</p>
          <p className="text-xs text-(--text-muted)">{i.warehouse.location}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantité",
      render: (i: InventoryRow) => <QuantityBadge qty={i.quantity} />,
    },
    {
      key: "actions",
      label: "",
      render: (i: InventoryRow) => (
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
        description={`${mockInventory.length} entrées de stock`}
      />
      <DataTable
        columns={columns}
        data={mockInventory}
        keyExtractor={(i) => i.id}
        emptyMessage="Inventaire vide"
      />
    </div>
  );
}
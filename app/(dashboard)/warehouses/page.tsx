import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Button } from "../../../components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Warehouse } from "../../../types";

const mockWarehouses: Warehouse[] = [
  { id: "ck_warehouse_1", name: "Entrepôt Yaoundé", location: "Yaoundé, Cameroun", capacity: 1000 },
  { id: "ck_warehouse_2", name: "Entrepôt Douala", location: "Douala, Cameroun", capacity: 2000 },
];

export default function WarehousesPage() {
  const columns = [
    {
      key: "name",
      label: "Nom",
      render: (w: Warehouse) => (
        <p className="font-medium text-[var(--text-primary)]">{w.name}</p>
      ),
    },
    {
      key: "location",
      label: "Localisation",
      render: (w: Warehouse) => <span className="text-[var(--text-secondary)]">{w.location}</span>,
    },
    {
      key: "capacity",
      label: "Capacité",
      render: (w: Warehouse) => (
        <span className="tabular-nums text-[var(--text-secondary)]">{w.capacity.toLocaleString()} unités</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (w: Warehouse) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/warehouses/${w.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Link href={`/warehouses/${w.id}`}>
            <Button variant="ghost" size="sm" icon={<Pencil size={13} />} />
          </Link>
          <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} className="hover:text-[var(--danger)]" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entrepôts"
        description={`${mockWarehouses.length} entrepôts`}
        createHref="/warehouses/create"
        createLabel="Nouvel entrepôt"
      />
      <DataTable columns={columns} data={mockWarehouses} keyExtractor={(w) => w.id} emptyMessage="Aucun entrepôt" />
    </div>
  );
}
import Link from "next/link";
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { formatCurrency } from "../../../lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../../types";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "T-shirt en coton",
    description: "T-shirt 100% coton, coupe regular",
    price: 9990,
    category: "Vêtements",
    stock: 50,
    images: [],
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Casquette noire",
    description: "Casquette snapback",
    price: 5990,
    category: "Accessoires",
    stock: 3,
    images: [],
    createdAt: "2026-06-05T10:00:00Z",
    updatedAt: "2026-06-05T10:00:00Z",
  },
  {
    id: 3,
    name: "Sac à dos Sport",
    description: "Sac à dos 30L",
    price: 24990,
    category: "Bagagerie",
    stock: 0,
    images: [],
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-10T10:00:00Z",
  },
];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Rupture</Badge>;
  if (stock < 10) return <Badge variant="warning">{stock} restants</Badge>;
  return <Badge variant="success">{stock} en stock</Badge>;
}

export default function ProductsPage() {
  const columns = [
    {
      key: "name",
      label: "Produit",
      render: (p: Product) => (
        <div>
          <p className="font-medium text-[var(--text-primary)]">{p.name}</p>
          <p className="text-xs text-[var(--text-muted)]">ID #{p.id}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (p: Product) => (
        <Badge variant="default">{p.category}</Badge>
      ),
    },
    {
      key: "price",
      label: "Prix",
      render: (p: Product) => (
        <span className="tabular-nums font-medium">{formatCurrency(p.price)}</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (p: Product) => <StockBadge stock={p.stock} />,
    },
    {
      key: "actions",
      label: "",
      render: (p: Product) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/products/${p.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Link href={`/products/${p.id}`}>
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
        title="Produits"
        description={`${mockProducts.length} produits au catalogue`}
        createHref="/products/create"
        createLabel="Nouveau produit"
      />
      <DataTable
        columns={columns}
        data={mockProducts}
        keyExtractor={(p) => p.id}
        emptyMessage="Aucun produit trouvé"
      />
    </div>
  );
}
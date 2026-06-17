// page.tsx (ProductDetailPage)
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Package, Star, ImageOff } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { formatCurrency, formatDateTime } from "../../../../lib/utils";
import type { Product, Review } from "../../../../types";

// ── Mock data ──────────────────────────────────────────────────────────────────

const mockProduct: Product = {
  id: 1,
  name: "T-shirt en coton",
  description:
    "T-shirt 100% coton, coupe regular. Disponible en plusieurs coloris. Tissu doux et respirant, idéal pour un usage quotidien.",
  price: 9990,
  category: "Vêtements",
  stock: 50,
  images: [],
  createdAt: "2026-06-01T10:00:00Z",
  updatedAt: "2026-06-15T08:30:00Z",
};

const mockReviews: Review[] = [
  {
    id: "ck_review_1",
    productId: 1,
    userId: 1,
    rating: 5,
    comment: "Excellent produit, très bonne qualité !",
    user: { id: 1, username: "johndoe", firstName: "John", lastName: "Doe" },
  },
  {
    id: "ck_review_2",
    productId: 1,
    userId: 2,
    rating: 4,
    comment: "Bonne qualité, livraison rapide. Je recommande.",
    user: { id: 2, username: "marienk", firstName: "Marie", lastName: "Nkomo" },
  },
  {
    id: "ck_review_3",
    productId: 1,
    userId: 3,
    rating: 3,
    comment: "Correct mais un peu cher pour ce que c'est.",
    user: { id: 3, username: "paulb", firstName: "Paul", lastName: "Biya" },
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Rupture de stock</Badge>;
  if (stock < 10) return <Badge variant="warning">{stock} restants</Badge>;
  return <Badge variant="success">{stock} en stock</Badge>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= rating
              ? "fill-(--warning) text-(--warning)"
              : "text-(--border)"
          }
        />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = mockProduct;
  const avgRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
              Produits
            </Button>
          </Link>
          <span className="text-(--text-muted)">/</span>
          <h1 className="text-xl font-semibold text-(--text-primary)">
            {product.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/products/${params.id}/edit`}>
            <Button variant="secondary" size="sm" icon={<Pencil size={13} />}>
              Modifier
            </Button>
          </Link>
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne gauche — infos principales */}
        <div className="space-y-4 xl:col-span-2">
          {/* Images */}
          <Card padding="none">
            <div className="border-b border-(--border) px-5 py-4">
              <h2 className="text-sm font-semibold text-(--text-primary)">
                Images
              </h2>
            </div>
            <div className="p-5">
              {product.images.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-(--border) text-(--text-muted)">
                  <ImageOff size={24} />
                  <p className="text-sm">Aucune image</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg border border-(--border) bg-(--bg-hover)"
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Informations */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: "Nom", value: product.name },
                { label: "Catégorie", value: product.category },
                {
                  label: "Prix",
                  value: formatCurrency(product.price),
                },
                {
                  label: "Stock",
                  value: <StockBadge stock={product.stock} />,
                },
                {
                  label: "Créé le",
                  value: formatDateTime(product.createdAt),
                },
                {
                  label: "Mis à jour",
                  value: formatDateTime(product.updatedAt),
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-(--text-muted)">{label}</p>
                  <div className="mt-1 text-sm font-medium text-(--text-primary)">
                    {value}
                  </div>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs text-(--text-muted)">Description</p>
                <p className="mt-1 text-sm text-(--text-secondary) leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Avis */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-(--border) px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-(--text-primary)">
                  Avis clients
                </h2>
                <p className="text-xs text-(--text-muted) mt-0.5">
                  {mockReviews.length} avis · moyenne{" "}
                  <span className="text-(--warning) font-medium">
                    {avgRating.toFixed(1)}/5
                  </span>
                </p>
              </div>
            </div>
            <div className="divide-y divide-(--border-subtle)">
              {mockReviews.map((review) => (
                <div key={review.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--accent-muted) text-[10px] font-semibold text-(--accent)">
                        {review.user?.firstName[0]}
                        {review.user?.lastName[0]}
                      </div>
                      <span className="text-sm font-medium text-(--text-primary)">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-(--text-secondary) leading-relaxed pl-9">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Colonne droite — résumé */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-(--bg-hover) p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--accent-muted)">
                  <Package size={16} className="text-(--accent)" />
                </div>
                <div>
                  <p className="text-xs text-(--text-muted)">Prix de vente</p>
                  <p className="text-lg font-bold text-(--text-primary) tabular-nums">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "ID Produit", value: `#${product.id}` },
                  { label: "Catégorie", value: product.category },
                  {
                    label: "Stock disponible",
                    value: `${product.stock} unités`,
                  },
                  {
                    label: "Note moyenne",
                    value: `${avgRating.toFixed(1)} / 5 (${mockReviews.length})`,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5 border-b border-(--border-subtle) last:border-0"
                  >
                    <span className="text-xs text-(--text-muted)">
                      {label}
                    </span>
                    <span className="text-xs font-medium text-(--text-primary)">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-3">Statut stock</CardTitle>
            <StockBadge stock={product.stock} />
            <div className="mt-3">
              <div className="flex justify-between text-xs text-(--text-muted) mb-1">
                <span>0</span>
                <span>100</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-(--border)">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                    backgroundColor:
                      product.stock === 0
                        ? "var(--danger)"
                        : product.stock < 10
                        ? "var(--warning)"
                        : "var(--success)",
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-(--text-muted)">
                {product.stock} unités disponibles
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
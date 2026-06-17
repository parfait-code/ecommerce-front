"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <option value="">Sélectionner…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "Vêtements", label: "Vêtements" },
  { value: "Accessoires", label: "Accessoires" },
  { value: "Bagagerie", label: "Bagagerie" },
  { value: "Chaussures", label: "Chaussures" },
  { value: "Électronique", label: "Électronique" },
];

export default function ProductCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState<string[]>([]);

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: appel API
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/products");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={14} />}
            >
              Produits
            </Button>
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Nouveau produit
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button type="button" variant="secondary" size="sm">
              Annuler
            </Button>
          </Link>
          <Button type="submit" size="sm" loading={loading}>
            Créer le produit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 xl:col-span-2">
          <FormSection title="Informations générales">
            <Input
              label="Nom du produit *"
              placeholder="Ex: T-shirt en coton"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              required
            />
            <Textarea
              label="Description *"
              placeholder="Décrivez le produit en détail…"
              value={form.description}
              onChange={set("description")}
              rows={5}
            />
          </FormSection>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {/* Zone upload */}
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                <Upload size={20} />
                <span className="text-sm">
                  Glisser-déposer ou{" "}
                  <span className="font-medium text-[var(--accent)]">
                    parcourir
                  </span>
                </span>
                <span className="text-xs">PNG, JPG jusqu&apos;à 5 Mo</span>
                <input type="file" className="hidden" accept="image/*" multiple />
              </label>

              {/* Aperçu images */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-hover)]"
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-[var(--danger)] text-white group-hover:flex"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          <FormSection title="Prix & Stock">
            <Input
              label="Prix (en centimes XAF) *"
              type="number"
              placeholder="Ex: 9990"
              value={form.price}
              onChange={(e) => set("price")(e.target.value)}
              required
              min="0"
            />
            <p className="text-xs text-[var(--text-muted)] -mt-2">
              {form.price
                ? `= ${(parseInt(form.price) / 100).toFixed(0)} XAF`
                : "Saisir en centimes (9990 = 99,90 XAF)"}
            </p>
            <Input
              label="Stock initial *"
              type="number"
              placeholder="Ex: 50"
              value={form.stock}
              onChange={(e) => set("stock")(e.target.value)}
              required
              min="0"
            />
          </FormSection>

          <FormSection title="Organisation">
            <Select
              label="Catégorie *"
              options={CATEGORIES}
              value={form.category}
              onChange={set("category")}
            />
          </FormSection>

          {/* Résumé */}
          {(form.name || form.price) && (
            <Card>
              <CardTitle className="mb-3">Aperçu</CardTitle>
              <div className="space-y-2">
                {form.name && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Nom</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {form.name}
                    </p>
                  </div>
                )}
                {form.price && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Prix</p>
                    <p className="text-sm font-bold text-[var(--accent)]">
                      {(parseInt(form.price) / 100).toFixed(0)} XAF
                    </p>
                  </div>
                )}
                {form.category && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Catégorie</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {form.category}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { productsService } from "../../../../services/products.service";
import { useAuthStore } from "../../../../store/auth.store";

const CATEGORIES = [
  { value: "Vêtements", label: "Vêtements" },
  { value: "Accessoires", label: "Accessoires" },
  { value: "Bagagerie", label: "Bagagerie" },
  { value: "Chaussures", label: "Chaussures" },
  { value: "Électronique", label: "Électronique" },
];

function Textarea({ label, placeholder, value, onChange, rows = 4 }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-(--text-secondary)">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-lg border border-(--border) bg-(--bg-card) px-3 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)"
      />
    </div>
  );
}

function Select({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-(--text-secondary)">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-(--border) bg-(--bg-card) px-3 text-sm text-(--text-primary) focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)"
      >
        <option value="">Sélectionner…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function ProductCreatePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "", stock: "",
  });

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }

  function removeImage(i: number) {
    setImageFiles((prev) => prev.filter((_, j) => j !== i));
    setImagePreviews((prev) => prev.filter((_, j) => j !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const product = await productsService.create({
        name: form.name,
        description: form.description,
        price: parseInt(form.price),
        category: form.category,
        stock: parseInt(form.stock),
      }, token);

      if (imageFiles.length > 0) {
        await productsService.uploadImages(product.id, imageFiles, token);
      }

      router.push(`/products/${product.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button type="button" variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Produits</Button>
          </Link>
          <span className="text-(--text-muted)">/</span>
          <h1 className="text-xl font-semibold text-(--text-primary)">Nouveau produit</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button type="button" variant="secondary" size="sm">Annuler</Button>
          </Link>
          <Button type="submit" size="sm" loading={loading}>Créer le produit</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-(--danger-muted) px-4 py-3 text-sm text-(--danger)">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
            <div className="space-y-4">
              <Input label="Nom du produit *" placeholder="Ex: T-shirt en coton" value={form.name} onChange={(e) => set("name")(e.target.value)} required />
              <Textarea label="Description *" placeholder="Décrivez le produit en détail…" value={form.description} onChange={set("description")} rows={5} />
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Images</CardTitle></CardHeader>
            <div className="space-y-3">
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-(--border) text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--accent)">
                <Upload size={20} />
                <span className="text-sm">Glisser-déposer ou <span className="font-medium text-(--accent)">parcourir</span></span>
                <span className="text-xs">PNG, JPG jusqu&apos;à 5 Mo</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
              </label>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-(--border) bg-(--bg-hover)">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-(--danger) text-white group-hover:flex">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Prix & Stock</CardTitle></CardHeader>
            <div className="space-y-4">
              <Input label="Prix (en centimes XAF) *" type="number" placeholder="Ex: 9990" value={form.price} onChange={(e) => set("price")(e.target.value)} required min="0" />
              <p className="text-xs text-(--text-muted) -mt-2">
                {form.price ? `= ${parseInt(form.price).toLocaleString()} XAF` : "Saisir en centimes"}
              </p>
              <Input label="Stock initial *" type="number" placeholder="Ex: 50" value={form.stock} onChange={(e) => set("stock")(e.target.value)} required min="0" />
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
            <Select label="Catégorie *" options={CATEGORIES} value={form.category} onChange={set("category")} />
          </Card>

          {form.name && (
            <Card>
              <CardTitle className="mb-3">Aperçu</CardTitle>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-(--text-muted)">Nom</p>
                  <p className="text-sm font-medium text-(--text-primary)">{form.name}</p>
                </div>
                {form.price && (
                  <div>
                    <p className="text-xs text-(--text-muted)">Prix</p>
                    <p className="text-sm font-bold text-(--accent)">{parseInt(form.price).toLocaleString()} XAF</p>
                  </div>
                )}
                {form.category && (
                  <div>
                    <p className="text-xs text-(--text-muted)">Catégorie</p>
                    <p className="text-sm text-(--text-secondary)">{form.category}</p>
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
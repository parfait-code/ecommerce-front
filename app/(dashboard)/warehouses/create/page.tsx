"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import { warehousesService } from "../../../../services/warehouses.service";
import { useAuthStore } from "../../../../store/auth.store";

export default function WarehouseCreatePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", location: "", capacity: "" });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await warehousesService.create({
        name: form.name,
        location: form.location,
        capacity: parseInt(form.capacity),
      }, token);
      router.push("/warehouses");
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
          <Link href="/warehouses">
            <Button type="button" variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Entrepôts</Button>
          </Link>
          <span className="text-(--text-muted)">/</span>
          <h1 className="text-xl font-semibold text-(--text-primary)">Nouvel entrepôt</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/warehouses">
            <Button type="button" variant="secondary" size="sm">Annuler</Button>
          </Link>
          <Button type="submit" size="sm" loading={loading}>Créer</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-(--danger-muted) px-4 py-3 text-sm text-(--danger)">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <div className="space-y-4">
              <Input label="Nom de l'entrepôt *" placeholder="Ex: Entrepôt Douala Nord" value={form.name} onChange={set("name")} required />
              <Input label="Localisation *" placeholder="Ex: Douala, Cameroun" value={form.location} onChange={set("location")} required />
              <Input label="Capacité maximale (unités) *" type="number" placeholder="Ex: 2000" value={form.capacity} onChange={set("capacity")} required min="1" />
              <p className="text-xs text-(--text-muted) -mt-2">Nombre maximum d&apos;unités stockables.</p>
            </div>
          </Card>
        </div>

        <div>
          {(form.name || form.location || form.capacity) && (
            <Card>
              <CardTitle className="mb-3">Aperçu</CardTitle>
              <div className="space-y-2">
                {form.name && <div><p className="text-xs text-(--text-muted)">Nom</p><p className="text-sm font-medium text-(--text-primary)">{form.name}</p></div>}
                {form.location && <div><p className="text-xs text-(--text-muted)">Localisation</p><p className="text-sm text-(--text-secondary)">{form.location}</p></div>}
                {form.capacity && <div><p className="text-xs text-(--text-muted)">Capacité</p><p className="text-sm font-semibold text-(--accent)">{parseInt(form.capacity).toLocaleString()} unités</p></div>}
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";

const ROLES = [
  { value: "user", label: "Utilisateur", desc: "Accès client standard" },
  { value: "ANALYST", label: "Analyste", desc: "Lecture des données et rapports" },
  { value: "MANAGER", label: "Manager", desc: "Gestion produits, commandes, stocks" },
  { value: "admin", label: "Administrateur", desc: "Accès complet au backoffice" },
];

export default function UserCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: appel API
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/users");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/users">
            <Button type="button" variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
              Utilisateurs
            </Button>
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Nouvel utilisateur
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/users">
            <Button type="button" variant="secondary" size="sm">Annuler</Button>
          </Link>
          <Button type="submit" size="sm" loading={loading}>
            Créer l&apos;utilisateur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom *" placeholder="John" value={form.firstName} onChange={set("firstName")} required />
                <Input label="Nom *" placeholder="Doe" value={form.lastName} onChange={set("lastName")} required />
              </div>
              <Input label="Nom d'utilisateur *" placeholder="johndoe" value={form.username} onChange={set("username")} required />
              <Input label="Email *" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} required />
              <Input label="Âge" type="number" placeholder="28" value={form.age} onChange={set("age")} min="18" />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input label="Mot de passe *" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
              <Input
                label="Confirmer le mot de passe *"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                required
                error={
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? "Les mots de passe ne correspondent pas"
                    : undefined
                }
              />
            </div>
          </Card>
        </div>

        {/* Colonne droite — rôle */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rôle & permissions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedRole === role.value
                      ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                      : "border-[var(--border)] hover:border-[var(--accent)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      selectedRole === role.value
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-primary)]"
                    }`}>
                      {role.label}
                    </p>
                    {selectedRole === role.value && (
                      <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {role.desc}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Aperçu */}
          {form.firstName && (
            <Card>
              <CardTitle className="mb-3">Aperçu</CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-muted)] font-bold text-[var(--accent)]">
                  {form.firstName[0]}{form.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {form.firstName} {form.lastName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    @{form.username || "—"} · {ROLES.find(r => r.value === selectedRole)?.label}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
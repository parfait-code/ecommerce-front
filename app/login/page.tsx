"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../../services/auth.service";
import { User, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      setAuth(data.user, data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] p-4">
      {/* Background subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
            <span className="text-lg font-bold text-white">BO</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Backoffice
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-[var(--danger-muted)] px-3 py-2.5 text-sm text-[var(--danger)]">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <Input
              label="Identifiant"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User size={14} />}
              required
              autoComplete="username"
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={14} />}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--text-muted)]">
                <input type="checkbox" className="accent-[var(--accent)]" />
                Se souvenir de moi
              </label>
              <button
                type="button"
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
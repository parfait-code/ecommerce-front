// page.tsx (LandingPage)
import Link from "next/link";
import { Package, ShoppingCart, Users, BarChart3, Truck, Shield, Zap, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";

const features = [
  { icon: Package, title: "Gestion des produits", desc: "Catalogue complet, images, prix, catégories." },
  { icon: ShoppingCart, title: "Suivi des commandes", desc: "De la commande à la livraison, visibilité totale." },
  { icon: Users, title: "Gestion des clients", desc: "Profils, historiques, rôles et permissions." },
  { icon: BarChart3, title: "Analytics", desc: "KPIs en temps réel, graphiques de ventes." },
  { icon: Truck, title: "Logistique", desc: "Expéditions, entrepôts et suivi de livraison." },
  { icon: Shield, title: "Sécurité", desc: "Authentification JWT, RBAC, audit trail." },
];
const stats = [
  { value: "99.9%", label: "Disponibilité" },
  { value: "< 200ms", label: "Temps de réponse" },
  { value: "12", label: "Modules intégrés" },
  { value: "4", label: "Niveaux de rôles" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary)">
      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-(--border) bg-(--bg-base)/80 px-8 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--accent)">
            <span className="text-xs font-bold text-white">BO</span>
          </div>
          <span className="font-semibold">Backoffice</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" size="sm">Se connecter</Button></Link>
          <Link href="/login"><Button size="sm">Accéder au dashboard</Button></Link>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-14 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 70%)" }} />
        <div className="relative">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-(--accent-muted) bg-(--accent-muted) px-3 py-1 text-xs font-medium text-(--accent)">
            <Zap size={10} /> Plateforme e-commerce · Backoffice v1.0
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Gérez votre commerce<br />
            <span className="text-(--accent)">en toute clarté</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-(--text-muted)">
            Un backoffice complet pour piloter vos produits, commandes, paiements, stocks et expéditions depuis une seule interface.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login"><Button size="lg" icon={<ArrowRight size={15} />}>Accéder au backoffice</Button></Link>
            <Link href="/login"><Button size="lg" variant="secondary">Découvrir la plateforme</Button></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-(--border) bg-(--bg-surface) py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold tabular-nums text-(--accent)">{s.value}</p>
              <p className="mt-1 text-sm text-(--text-muted)">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold">Tout ce dont vous avez besoin</h2>
          <p className="mt-2 text-sm text-(--text-muted)">Des modules conçus pour la gestion quotidienne de votre activité</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-xl border border-(--border) bg-(--bg-card) p-5 transition-colors hover:border-(--border)">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-(--accent-muted)">
                  <Icon size={16} className="text-(--accent)" />
                </div>
                <h3 className="font-semibold text-(--text-primary)">{f.title}</h3>
                <p className="mt-1 text-sm text-(--text-muted)">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-(--border) bg-(--bg-surface) py-20">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-2xl font-bold">Pourquoi ce backoffice ?</h2>
          <ul className="mt-8 space-y-3 text-left">
            {["Interface rapide et réactive, pensée pour les gestionnaires", "Accès basé sur les rôles (RBAC) avec 4 niveaux de permission", "API RESTful documentée avec exemples complets", "Prêt pour l'observabilité : Grafana, ELK, OpenTelemetry (Phase 2)", "Déployable en production avec Next.js 15 et TypeScript"].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-(--text-secondary)">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-(--success)" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="mx-auto max-w-md px-8">
          <Globe size={32} className="mx-auto mb-4 text-(--accent)" />
          <h2 className="text-2xl font-bold">Prêt à démarrer ?</h2>
          <p className="mt-2 text-sm text-(--text-muted)">Connectez-vous et prenez le contrôle de votre plateforme e-commerce.</p>
          <div className="mt-6">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto" icon={<ArrowRight size={15} />}>Se connecter maintenant</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-(--border) py-6 text-center text-xs text-(--text-muted)">
        © 2026 Backoffice E-Commerce · Construit avec Next.js 15 & TypeScript
      </footer>
    </div>
  );
}
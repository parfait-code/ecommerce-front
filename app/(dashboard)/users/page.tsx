"use client";

import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LoadingState, ErrorState } from "../../../components/shared/loading-state";
import { formatDate } from "../../../lib/utils";
import { Eye, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useUsers } from "../../../hooks/use-users";
import { usersService } from "../../../services/users.service";
import { useAuthStore } from "../../../store/auth.store";
import { useState } from "react";
import type { User } from "../../../types";

const roleColors: Record<string, "accent" | "success" | "warning" | "default"> = {
  user: "default", admin: "accent", SUPER_ADMIN: "success", MANAGER: "warning", ANALYST: "default",
};
const roleLabels: Record<string, string> = {
  user: "Utilisateur", admin: "Admin", SUPER_ADMIN: "Super Admin", MANAGER: "Manager", ANALYST: "Analyste",
};

export default function UsersPage() {
  const { data, loading, error, refetch } = useUsers();
  const { token } = useAuthStore();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!token || !confirm("Supprimer cet utilisateur ?")) return;
    setDeletingId(id);
    try {
      await usersService.delete(id, token);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Utilisateur",
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--accent-muted) text-xs font-semibold text-(--accent)">
            {u.firstName[0]}{u.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-(--text-primary)">{u.firstName} {u.lastName}</p>
            <p className="text-xs text-(--text-muted)">@{u.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (u: User) => <span className="text-(--text-secondary)">{u.email}</span>,
    },
    {
      key: "role",
      label: "Rôle",
      render: (u: User) => <Badge variant={roleColors[u.role] || "default"}>{roleLabels[u.role] || u.role}</Badge>,
    },
    {
      key: "createdAt",
      label: "Inscription",
      // ⚠️ createdAt non retourné par GET /user/all — à ajouter côté backend
      render: (u: User) => (
        <span className="text-xs text-(--text-muted)">
          {u.createdAt ? formatDate(u.createdAt) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (u: User) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/users/${u.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye size={13} />} />
          </Link>
          <Button variant="ghost" size="sm" icon={<Shield size={13} />} />
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={13} />}
            className="hover:text-(--danger)"
            loading={deletingId === u.id}
            onClick={() => handleDelete(u.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description={data ? `${data.length} utilisateurs` : ""}
        createHref="/users/create"
        createLabel="Nouvel utilisateur"
      />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <DataTable columns={columns} data={data} keyExtractor={(u) => u.id} emptyMessage="Aucun utilisateur trouvé" />
      )}
    </div>
  );
}
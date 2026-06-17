// page.tsx (UsersPage)
import { PageHeader } from "../../../components/shared/page-header";
import { DataTable } from "../../../components/tables/data-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { formatDate } from "../../../lib/utils";
import { Eye, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import type { User } from "../../../types";

const mockUsers: User[] = [
  { id: 1, username: "johndoe", email: "john@example.com", firstName: "John", lastName: "Doe", role: "user", createdAt: "2026-01-10T10:00:00Z" },
  { id: 2, username: "admin", email: "admin@example.com", firstName: "Admin", lastName: "Super", role: "admin", createdAt: "2026-01-01T10:00:00Z" },
  { id: 3, username: "marienk", email: "marie@example.com", firstName: "Marie", lastName: "Nkomo", role: "MANAGER", createdAt: "2026-03-15T10:00:00Z" },
];

const roleColors: Record<string, "accent" | "success" | "warning" | "default"> = {
  user: "default",
  admin: "accent",
  SUPER_ADMIN: "success",
  MANAGER: "warning",
  ANALYST: "default",
};

const roleLabels: Record<string, string> = {
  user: "Utilisateur",
  admin: "Admin",
  SUPER_ADMIN: "Super Admin",
  MANAGER: "Manager",
  ANALYST: "Analyste",
};

export default function UsersPage() {
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
      render: (u: User) => (
        <Badge variant={roleColors[u.role] || "default"}>
          {roleLabels[u.role] || u.role}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Inscription",
      render: (u: User) => (
        <span className="text-xs text-(--text-muted)">{formatDate(u.createdAt!)}</span>
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
          <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} className="hover:text-(--danger)" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description={`${mockUsers.length} utilisateurs`}
        createHref="/users/create"
        createLabel="Nouvel utilisateur"
      />
      <DataTable
        columns={columns}
        data={mockUsers}
        keyExtractor={(u) => u.id}
        emptyMessage="Aucun utilisateur trouvé"
      />
    </div>
  );
}
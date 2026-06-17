"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../../constants";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/auth.store";
import { LogOut, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[var(--border)] px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]">
          <span className="text-xs font-bold text-white">BO</span>
        </div>
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          Backoffice
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                    isActive
                      ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--accent)]" />
                  )}
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight
                      size={12}
                      className="ml-auto text-[var(--accent)] opacity-60"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-muted)] text-xs font-semibold text-[var(--accent)]">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[var(--text-primary)]">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-[10px] text-[var(--text-muted)]">
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--danger-muted)] hover:text-[var(--danger)]"
            title="Se déconnecter"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
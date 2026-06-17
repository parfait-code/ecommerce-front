// sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "../../constants";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/auth.store";
import { LogOut, ChevronRight, X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Overlay (mobile uniquement) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-(--border) bg-(--bg-surface)",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between gap-2.5 border-b border-(--border) px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--accent)">
              <span className="text-xs font-bold text-white">BO</span>
            </div>
            <span className="text-sm font-semibold text-(--text-primary)">
              Backoffice
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary) lg:hidden"
            aria-label="Fermer le menu"
          >
            <X size={16} />
          </button>
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
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                      isActive
                        ? "bg-(--accent-muted) text-(--accent)"
                        : "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-(--accent)" />
                    )}
                    <Icon
                      size={16}
                      className={cn(
                        "shrink-0",
                        isActive
                          ? "text-(--accent)"
                          : "text-(--text-muted) group-hover:text-(--text-secondary)"
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <ChevronRight
                        size={12}
                        className="ml-auto text-(--accent) opacity-60"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div className="border-t border-(--border) p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--accent-muted) text-xs font-semibold text-(--accent)">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-(--text-primary)">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[10px] text-(--text-muted)">
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-md p-1.5 text-(--text-muted) transition-colors hover:bg-(--danger-muted) hover:text-(--danger)"
              title="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
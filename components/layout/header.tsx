// header.tsx
"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../../constants";
import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const current = NAV_ITEMS.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  const breadcrumbs = [
    { label: "Backoffice", href: "/dashboard" },
    ...(current ? [{ label: current.label, href: current.href }] : []),
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-(--border) bg-(--bg-surface) px-4 sm:px-6 lg:left-60">
      <div className="flex min-w-0 items-center gap-3">
        {/* Bouton menu (mobile/tablette) */}
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary) lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex min-w-0 items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-(--text-muted)">/</span>}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "truncate font-medium text-(--text-primary)"
                    : "hidden text-(--text-muted) sm:inline"
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary)">
          <Search size={16} />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary)">
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-(--accent)" />
        </button>
      </div>
    </header>
  );
}
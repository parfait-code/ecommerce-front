// header.tsx
"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../../constants";
import { Bell, Search } from "lucide-react";

export function Header() {
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
    <header className="fixed right-0 left-60 top-0 z-30 flex h-14 items-center justify-between border-b border-(--border) bg-(--bg-surface) px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-(--text-muted)">/</span>
            )}
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "font-medium text-(--text-primary)"
                  : "text-(--text-muted)"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
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
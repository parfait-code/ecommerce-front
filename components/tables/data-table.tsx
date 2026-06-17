// data-table.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  pagination?: PaginationConfig;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const delta = 1;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return pages;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "Aucun résultat",
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border) bg-(--bg-card)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border)">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-(--text-muted)"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-(--border-subtle) transition-colors hover:bg-(--bg-hover) last:border-0"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-5 py-3 text-sm text-(--text-primary)", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalItems > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-(--border) px-5 py-3 sm:flex-row">
          <p className="text-xs text-(--text-muted)">
            Affichage{" "}
            <span className="font-medium text-(--text-secondary)">
              {(pagination.currentPage - 1) * pagination.pageSize + 1}
            </span>
            {" - "}
            <span className="font-medium text-(--text-secondary)">
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
            </span>
            {" sur "}
            <span className="font-medium text-(--text-secondary)">{pagination.totalItems}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={14} />
            </button>

            {getPageNumbers(pagination.currentPage, pagination.totalPages).map((page, i) =>
              page === "ellipsis" ? (
                <span key={`ellipsis-${i}`} className="px-1 text-xs text-(--text-muted)">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => pagination.onPageChange(page)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    page === pagination.currentPage
                      ? "bg-(--accent-muted) text-(--accent)"
                      : "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)"
                  )}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
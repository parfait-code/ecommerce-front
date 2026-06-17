import { cn } from "../../lib/utils";

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "Aucun résultat",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]",
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
                className="px-5 py-12 text-center text-sm text-[var(--text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-hover)] last:border-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-5 py-3 text-sm text-[var(--text-primary)]", col.className)}
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
  );
}
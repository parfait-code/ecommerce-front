// stat-card.tsx
import { cn } from "../../lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color?: "accent" | "success" | "warning" | "danger";
}

const colorMap = {
  accent: {
    icon: "bg-(--accent-muted) text-(--accent)",
  },
  success: {
    icon: "bg-(--success-muted) text-(--success)",
  },
  warning: {
    icon: "bg-(--warning-muted) text-(--warning)",
  },
  danger: {
    icon: "bg-(--danger-muted) text-(--danger)",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "accent",
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-card) p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-(--text-muted) uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-(--text-primary) tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-(--text-muted)">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-(--success)" : "text-(--danger)"
              )}
            >
              {isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {Math.abs(trend)}% ce mois
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", colorMap[color].icon)}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
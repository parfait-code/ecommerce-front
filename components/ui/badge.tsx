import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "accent" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-hover)] text-[var(--text-secondary)]",
  success: "bg-[var(--success-muted)] text-[var(--success)]",
  danger: "bg-[var(--danger-muted)] text-[var(--danger)]",
  warning: "bg-[var(--warning-muted)] text-[var(--warning)]",
  accent: "bg-[var(--accent-muted)] text-[var(--accent)]",
  muted: "bg-[var(--border-subtle)] text-[var(--text-muted)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
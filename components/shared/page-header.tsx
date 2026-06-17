import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  createHref,
  createLabel = "Nouveau",
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {createHref && (
          <Link href={createHref}>
            <Button icon={<Plus size={14} />}>{createLabel}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
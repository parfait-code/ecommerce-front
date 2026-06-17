// confirm-dialog.tsx
"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-card) p-5 shadow-xl shadow-black/30">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary)"
          aria-label="Fermer"
        >
          <X size={14} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--danger-muted)">
          <AlertTriangle size={18} className="text-(--danger)" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-(--text-primary)">{title}</h2>
        {description && (
          <p className="mt-1.5 text-sm text-(--text-muted)">{description}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
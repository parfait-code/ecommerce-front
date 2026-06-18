export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--border) border-t-(--accent)" />
        <p className="text-sm text-(--text-muted)">Chargement…</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-(--danger)">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-(--accent) hover:underline"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
import type { CSSProperties, ReactNode } from "react";

export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div className={`shimmer ${className}`} style={style} aria-hidden="true" />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <Skeleton className="h-3.5 w-1/3 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3" style={{ width: `${70 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonKpi() {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-7 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-1">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-7 w-56" />
      </div>
      <table className="w-full text-sm">
        <thead className="bg-surface-sunken">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-3 py-2.5"><Skeleton className="h-3 w-20" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-t border-border-subtle">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-3 py-2.5">
                  <Skeleton className="h-3.5" style={{ width: `${50 + ((r + c) % 4) * 10}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonChart({ height = 220 }: { height?: number }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}

export function SkeletonInsight() {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
      <Skeleton className="h-4 w-4/5 mb-2" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}

export function ErrorState({ title, description, onRetry, action }: { title: string; description?: string; onRetry?: () => void; action?: ReactNode }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-8 shadow-1 text-center">
      <div className="mx-auto size-9 grid place-items-center rounded-full bg-danger-50 text-danger-600 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-sm font-medium text-ink-primary">{title}</div>
      {description && <div className="text-xs text-ink-tertiary mt-1 max-w-md mx-auto">{description}</div>}
      <div className="mt-3 flex items-center justify-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:underline"
          >
            Retry
          </button>
        )}
        {action}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-8 shadow-1 text-center">
      <div className="mx-auto size-9 grid place-items-center rounded-full bg-neutral-100 text-ink-tertiary mb-3">
        {icon ?? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h12" />
          </svg>
        )}
      </div>
      <div className="text-sm font-medium text-ink-primary">{title}</div>
      {description && <div className="text-xs text-ink-tertiary mt-1 max-w-md mx-auto">{description}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

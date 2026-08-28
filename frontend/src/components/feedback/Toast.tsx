import { useEffect, useState, type ReactNode } from "react";
import { Check as CircleCheck, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastTone = "success" | "error" | "info" | "warning";
export interface Toast { id: string; tone: ToastTone; title: string; description?: ReactNode; ttl?: number; }

const icons: Record<ToastTone, ReactNode> = {
  success: <CircleCheck className="size-4 text-success-600" />,
  error:   <AlertCircle  className="size-4 text-danger-600" />,
  info:    <Info         className="size-4 text-info-600" />,
  warning: <AlertTriangle className="size-4 text-warning-600" />,
};

let listeners: Array<(t: Toast) => void> = [];
let id = 0;

export function pushToast(t: Omit<Toast, "id"> & { id?: string }) {
  const toast: Toast = { id: t.id ?? `t${++id}`, ttl: 4500, ...t };
  listeners.forEach((l) => l(toast));
  if (toast.ttl) {
    setTimeout(() => dismissToast(toast.id), toast.ttl);
  }
}

export function dismissToast(id: string) {
  listeners.forEach((l) => l({ id, tone: "info", title: "" } as any)); // sentinel: handled in store
  // simpler: keep a separate dismiss stream
  dismissListeners.forEach((l) => l(id));
}

let dismissListeners: Array<(id: string) => void> = [];

export function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const onAdd = (t: Toast) => setToasts((cur) => (t.title ? [...cur, t] : cur));
    const onDismiss = (id: string) => setToasts((cur) => cur.filter((x) => x.id !== id));
    listeners.push(onAdd);
    dismissListeners.push(onDismiss);
    return () => {
      listeners = listeners.filter((l) => l !== onAdd);
      dismissListeners = dismissListeners.filter((l) => l !== onDismiss);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-surface border border-border-default rounded-lg shadow-3 p-3 flex items-start gap-2.5 fade-in"
        >
          <div className="mt-0.5 shrink-0">{icons[t.tone]}</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-ink-primary">{t.title}</div>
            {t.description && <div className="text-xs text-ink-tertiary mt-0.5">{t.description}</div>}
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(t.id)}
            className="size-6 grid place-items-center rounded text-ink-tertiary hover:bg-neutral-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

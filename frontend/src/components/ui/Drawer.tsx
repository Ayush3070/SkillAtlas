import { useEffect, type ReactNode } from "react";
import {X} from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
  side?: "right" | "left";
}

const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl", xl: "max-w-3xl" };

export function Drawer({ open, onClose, title, description, size = "md", children, footer, side = "right" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-drawer flex" role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}>
      <div
        className="flex-1 bg-[var(--overlay)] fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={[
          "h-full w-full bg-surface border-l border-border-default shadow-pop flex flex-col",
          side === "left" ? "border-l-0 border-r" : "",
          sizes[size],
          "fade-in",
        ].join(" ")}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border-subtle shrink-0">
            <div className="min-w-0">
              {title && <div className="text-sm font-semibold text-ink-primary">{title}</div>}
              {description && <div className="text-xs text-ink-tertiary mt-0.5">{description}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="size-7 grid place-items-center rounded-md text-ink-tertiary hover:bg-neutral-100 hover:text-ink-primary transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border-subtle bg-surface-sunken px-5 py-3 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, type ReactNode } from "react";
import {X} from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
}

const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl", xl: "max-w-2xl" };

export function Modal({ open, onClose, title, description, size = "md", children, footer }: ModalProps) {
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
    <div className="fixed inset-0 z-modal grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}>
      <div className="absolute inset-0 bg-[var(--overlay)] fade-in" onClick={onClose} aria-hidden="true" />
      <div className={["relative w-full bg-surface border border-border-subtle rounded-lg shadow-pop fade-in", sizes[size]].join(" ")}>
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border-subtle">
            <div className="min-w-0">
              {title && <div className="text-sm font-semibold text-ink-primary">{title}</div>}
              {description && <div className="text-xs text-ink-tertiary mt-0.5">{description}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="size-7 grid place-items-center rounded-md text-ink-tertiary hover:bg-neutral-100 hover:text-ink-primary transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="border-t border-border-subtle bg-surface-sunken px-5 py-3 flex items-center justify-end gap-2 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

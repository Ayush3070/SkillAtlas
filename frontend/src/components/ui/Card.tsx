import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

type Padding = "none" | "sm" | "md" | "lg";

const padMap: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  padding?: Padding;
  flush?: boolean;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { title, description, actions, padding = "md", flush, interactive, className = "", children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        flush ? "bg-transparent" : "bg-surface",
        flush ? "" : "border border-border-subtle",
        "rounded-lg",
        flush ? "" : "shadow-1",
        interactive ? "transition-colors duration-fast hover:border-border-default hover:bg-surface-sunken cursor-pointer" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-border-subtle">
          <div className="min-w-0">
            {title && <div className="text-sm font-semibold text-ink-primary truncate">{title}</div>}
            {description && <div className="text-xs text-ink-tertiary mt-0.5 line-clamp-2">{description}</div>}
          </div>
          {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={padMap[padding]}>{children}</div>
    </div>
  );
});

export function CardRow({ label, value, hint }: { label: ReactNode; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div>
        <div className="text-xs text-ink-tertiary">{label}</div>
        {hint && <div className="text-[11px] text-ink-muted mt-0.5">{hint}</div>}
      </div>
      <div className="text-sm font-medium text-ink-primary text-right tabular">{value}</div>
    </div>
  );
}

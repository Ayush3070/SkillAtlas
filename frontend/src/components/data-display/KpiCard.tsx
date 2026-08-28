import { type ReactNode } from "react";
import {TrendingUp, TrendingDown, Minus} from "lucide-react";
import type { KpiDelta } from "../../types/domain";

interface KpiCardProps {
  label: string;
  delta: KpiDelta;
  /** Optional icon shown on top right. */
  icon?: ReactNode;
  /** Adds a small inline sparkline element under the value. */
  spark?: ReactNode;
  /** Card emphasizes one of the KPIs (e.g. critical). */
  emphasis?: "default" | "critical" | "positive";
  footer?: ReactNode;
  /** A11y label override. */
  ariaLabel?: string;
}

const trendIcon = (t: KpiDelta["trend"]) => {
  if (t === "rising" || t === "emerging") return <TrendingUp className="size-3" />;
  if (t === "declining" || t === "declining-fast") return <TrendingDown className="size-3" />;
  return <Minus className="size-3" />;
};

const trendTone = (t: KpiDelta["trend"]) => {
  if (t === "rising" || t === "emerging") return "text-success-600";
  if (t === "declining" || t === "declining-fast") return "text-danger-600";
  return "text-ink-tertiary";
};

export function KpiCard({ label, delta, icon, spark, emphasis = "default", footer, ariaLabel }: KpiCardProps) {
  const isPositive = delta.change > 0;
  return (
    <div
      className={[
        "bg-surface border rounded-lg p-4 shadow-1 flex flex-col gap-3",
        emphasis === "critical" ? "border-danger-100 bg-danger-50/40" : "border-border-subtle",
      ].join(" ")}
      role="group"
      aria-label={ariaLabel ?? label}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs text-ink-tertiary font-medium uppercase tracking-wider">{label}</div>
        {icon && <div className="text-ink-tertiary">{icon}</div>}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[28px] leading-none font-semibold text-ink-primary tabular">{delta.value}</span>
          {delta.unit && <span className="text-sm text-ink-tertiary font-medium">{delta.unit}</span>}
        </div>
        <div className={`inline-flex items-center gap-0.5 text-[11.5px] font-medium ${isPositive ? "text-success-600" : delta.change < 0 ? "text-danger-600" : "text-ink-tertiary"}`}>
          {isPositive ? "▲" : delta.change < 0 ? "▼" : "—"}
          {Math.abs(delta.change).toFixed(1)}%
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-ink-tertiary">
        <span className="inline-flex items-center gap-1">
          <span className={trendTone(delta.trend)}>{trendIcon(delta.trend)}</span>
          {delta.comparison}
        </span>
        {spark}
      </div>

      {footer && <div className="pt-2 border-t border-border-subtle -mx-4 px-4 -mb-4 pb-3">{footer}</div>}
    </div>
  );
}

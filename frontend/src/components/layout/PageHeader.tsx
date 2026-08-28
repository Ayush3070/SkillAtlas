import type { ReactNode } from "react";
import {Info} from "lucide-react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Slot for filters / controls on the right. */
  controls?: ReactNode;
  /** Optional secondary line, e.g. breadcrumb-like district context. */
  meta?: ReactNode;
  /** Show "Demo data" indicator. */
  demo?: boolean;
  /** Optional small tag next to title. */
  tag?: ReactNode;
  /** Optional small toolbar above the title. */
  toolbar?: ReactNode;
}

export function PageHeader({ title, description, controls, meta, demo, tag, toolbar }: PageHeaderProps) {
  return (
    <div className="mb-4">
      {toolbar && <div className="mb-2 flex items-center gap-2">{toolbar}</div>}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-[22px] font-semibold text-ink-primary tracking-tight">{title}</h1>
            {tag}
            {demo && (
              <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-pill bg-info-50 text-info-700 border border-info-100 text-[10.5px] font-medium">
                <Info className="size-3" /> Demo data
              </span>
            )}
          </div>
          {description && <p className="text-sm text-ink-tertiary mt-1 max-w-3xl">{description}</p>}
          {meta && <div className="mt-2 text-[11.5px] text-ink-muted">{meta}</div>}
        </div>
        {controls && <div className="flex items-center gap-2 flex-wrap shrink-0">{controls}</div>}
      </div>
    </div>
  );
}

export function DataFreshnessStrip({ updatedAt, coverageFrom, coverageTo, confidence, source, label }: { updatedAt: string; coverageFrom: string; coverageTo: string; confidence: string; source: string; label?: string }) {
  const confTone = confidence === "High" ? "text-success-700 bg-success-50 border-success-100"
    : confidence === "Medium" ? "text-warning-700 bg-warning-50 border-warning-100"
    : "text-danger-700 bg-danger-50 border-danger-100";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-ink-tertiary">
      {label && <span className="font-medium text-ink-secondary">{label}</span>}
      <span>Updated <span className="text-ink-secondary">{updatedAt}</span></span>
      <span>Coverage <span className="text-ink-secondary">{coverageFrom} → {coverageTo}</span></span>
      <span>Source <span className="text-ink-secondary">{source}</span></span>
      <span className={`inline-flex items-center h-5 px-1.5 rounded-pill border text-[10.5px] font-medium ${confTone}`}>
        Confidence: {confidence}
      </span>
    </div>
  );
}

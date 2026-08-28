import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowRight, CircleCheck, AlertCircle, AlertTriangle, Info, Sparkles } from "lucide-react";
import { SeverityChip } from "../ui/Badge";

interface EvidenceItem { id: string; label: string; value?: string; }
interface InsightCardProps {
  severity: "info" | "success" | "warning" | "critical";
  title: string;
  body: string;
  evidence: EvidenceItem[];
  recommendation?: ReactNode;
  ctaTo?: string;
  ctaLabel?: string;
  secondaryCtaTo?: string;
  secondaryCtaLabel?: string;
  confidence?: number;
  expectedImpact?: "High" | "Medium" | "Low";
}

const icon = (s: InsightCardProps["severity"]) => {
  if (s === "critical") return <AlertCircle className="size-4 text-danger-600" />;
  if (s === "warning") return <AlertTriangle className="size-4 text-warning-600" />;
  if (s === "success") return <CircleCheck className="size-4 text-success-600" />;
  return <Info className="size-4 text-info-600" />;
};

export function InsightCard({ severity, title, body, evidence, recommendation, ctaTo, ctaLabel, secondaryCtaTo, secondaryCtaLabel, confidence, expectedImpact }: InsightCardProps) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-1 overflow-hidden">
      <div className="p-4 flex items-start gap-3">
        <div className="mt-0.5 size-7 grid place-items-center rounded-md bg-neutral-100 shrink-0">
          {icon(severity)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityChip severity={severity} />
            {expectedImpact && (
              <span className="inline-flex items-center h-5 px-1.5 rounded-pill bg-neutral-100 text-ink-secondary text-[10.5px] font-medium border border-border-subtle">
                Impact: {expectedImpact}
              </span>
            )}
            {confidence !== undefined && (
              <span className="inline-flex items-center h-5 px-1.5 rounded-pill bg-primary-50 text-primary-700 text-[10.5px] font-medium border border-primary-100">
                Confidence: {confidence}%
              </span>
            )}
          </div>
          <div className="mt-2 text-sm font-semibold text-ink-primary leading-snug">{title}</div>
          <p className="text-[13px] text-ink-secondary mt-1 leading-relaxed">{body}</p>

          {evidence.length > 0 && (
            <ul className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {evidence.map(e => (
                <li key={e.id} className="rounded-md border border-border-subtle bg-surface-sunken px-2.5 py-1.5">
                  <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">{e.label}</div>
                  <div className="text-[12.5px] font-semibold text-ink-primary tabular">{e.value}</div>
                </li>
              ))}
            </ul>
          )}

          {recommendation && (
            <div className="mt-3 rounded-md border border-primary-100 bg-primary-50/40 p-2.5">
              <div className="text-[10.5px] uppercase tracking-wider text-primary-700 font-semibold">Recommendation</div>
              <div className="text-[12.5px] text-ink-primary mt-0.5">{recommendation}</div>
            </div>
          )}

          {(ctaTo || secondaryCtaTo) && (
            <div className="mt-3 flex items-center gap-2">
              {ctaTo && (
                <Link
                  to={ctaTo}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary-600 hover:underline"
                >
                  {ctaLabel ?? "View details"} <ArrowRight className="size-3.5" />
                </Link>
              )}
              {secondaryCtaTo && (
                <Link
                  to={secondaryCtaTo}
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-tertiary hover:text-ink-primary"
                >
                  {secondaryCtaLabel ?? "See evidence"}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InsightEmpty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-6 shadow-1 text-center">
      <div className="mx-auto size-9 grid place-items-center rounded-full bg-success-50 text-success-600 mb-2">
        <Sparkles className="size-4" />
      </div>
      <div className="text-sm font-medium text-ink-primary">{title}</div>
      {description && <div className="text-xs text-ink-tertiary mt-1 max-w-md mx-auto">{description}</div>}
    </div>
  );
}

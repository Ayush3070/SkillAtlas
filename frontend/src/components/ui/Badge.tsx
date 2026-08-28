import type { HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";
type Variant = "soft" | "solid" | "outline";

const toneSoft: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
  primary: "bg-primary-50 text-primary-700 border-primary-100",
  success: "bg-success-50 text-success-700 border-success-100",
  warning: "bg-warning-50 text-warning-700 border-warning-100",
  danger:  "bg-danger-50 text-danger-700 border-danger-100",
  info:    "bg-info-50 text-info-700 border-info-100",
};
const toneSolid: Record<Tone, string> = {
  neutral: "bg-neutral-700 text-white border-neutral-700",
  primary: "bg-primary-500 text-white border-primary-500",
  success: "bg-success-500 text-white border-success-500",
  warning: "bg-warning-500 text-white border-warning-500",
  danger:  "bg-danger-500 text-white border-danger-500",
  info:    "bg-info-500 text-white border-info-500",
};
const toneOutline: Record<Tone, string> = {
  neutral: "bg-transparent text-neutral-700 border-border-default",
  primary: "bg-transparent text-primary-700 border-primary-200",
  success: "bg-transparent text-success-700 border-success-100",
  warning: "bg-transparent text-warning-700 border-warning-100",
  danger:  "bg-transparent text-danger-700 border-danger-100",
  info:    "bg-transparent text-info-700 border-info-100",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: Variant;
  size?: "sm" | "md";
  leadingIcon?: ReactNode;
}

export function Badge({
  tone = "neutral",
  variant = "soft",
  size = "sm",
  leadingIcon,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const palette = variant === "solid" ? toneSolid : variant === "outline" ? toneOutline : toneSoft;
  const sizing = size === "sm"
    ? "h-5 px-1.5 text-[10.5px]"
    : "h-6 px-2 text-[11.5px]";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-pill border font-medium leading-none",
        palette[tone], sizing, className,
      ].join(" ")}
      {...rest}
    >
      {leadingIcon}
      {children}
    </span>
  );
}

/** Semantic status badge — used widely. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: Tone; variant: Variant; label?: string }> = {
    Aligned:      { tone: "success", variant: "soft" },
    "Needs Update":{ tone: "warning", variant: "soft" },
    Oversupplied: { tone: "warning", variant: "soft" },
    Obsolete:     { tone: "danger",  variant: "soft" },
    Emerging:     { tone: "info",    variant: "soft" },
    Validated:    { tone: "success", variant: "soft" },
    Pending:      { tone: "warning", variant: "soft" },
    "Needs Review":{tone: "warning", variant: "soft" },
    Rejected:     { tone: "danger",  variant: "soft" },
    Approved:     { tone: "success", variant: "soft" },
    "In Review":   { tone: "info",    variant: "soft" },
    "In Progress": { tone: "info",    variant: "soft" },
    Proposed:     { tone: "neutral", variant: "soft" },
    Done:         { tone: "success", variant: "soft" },
    Ready:        { tone: "success", variant: "soft" },
    Generating:   { tone: "info",    variant: "soft" },
    Scheduled:    { tone: "neutral", variant: "soft" },
    Failed:       { tone: "danger",  variant: "soft" },
  };
  const cfg = map[status] ?? { tone: "neutral" as Tone, variant: "soft" as Variant };
  return <Badge tone={cfg.tone} variant={cfg.variant}>{cfg.label ?? status}</Badge>;
}

/** Severity chip used on insights. */
export function SeverityChip({ severity }: { severity: "info" | "success" | "warning" | "critical" }) {
  const map = {
    info:     { tone: "info"    as Tone, label: "Info" },
    success:  { tone: "success" as Tone, label: "Aligned" },
    warning:  { tone: "warning" as Tone, label: "Attention" },
    critical: { tone: "danger"  as Tone, label: "Critical" },
  };
  const c = map[severity];
  return <Badge tone={c.tone} variant="solid" size="md">{c.label}</Badge>;
}

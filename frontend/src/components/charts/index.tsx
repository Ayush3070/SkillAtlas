import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart,
  Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Pie, PieChart } from "recharts";
import type { ReactNode } from "react";

const chartColors = {
  primary: "var(--chart-1)",
  success: "var(--chart-2)",
  warning: "var(--chart-3)",
  violet:  "var(--chart-4)",
  cyan:    "var(--chart-5)",
  danger:  "var(--chart-6)",
  slate:   "var(--chart-7)",
  teal:    "var(--chart-8)" };

export const palette = ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)","var(--chart-7)","var(--chart-8)"];
export const namedColors = chartColors;

/* ---------------- Time series area ---------------- */
interface TimeSeriesProps {
  data: { x: string; a: number; b?: number; c?: number }[];
  series: { key: "a" | "b" | "c"; label: string; color?: string; type?: "line" | "area" }[];
  height?: number;
  yLabel?: string;
  showGrid?: boolean;
  yFormatter?: (v: number) => string;
}

export function TimeSeries({ data, series, height = 240, yLabel, showGrid = true, yFormatter }: TimeSeriesProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && <CartesianGrid stroke="var(--border-subtle)" vertical={false} />}
          <XAxis dataKey="x" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "var(--text-tertiary)" } } : undefined} tickFormatter={yFormatter} width={42} />
          <Tooltip
            formatter={yFormatter as ((value: unknown, name: unknown) => ReactNode) | undefined}
            cursor={{ stroke: "var(--border-default)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
          {series.map((s, i) => {
            const color = s.color ?? ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"][i] ?? "var(--chart-1)";
            if (s.type === "line") {
              return <Line key={s.key} dataKey={s.key} name={s.label} type="monotone" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />;
            }
            return (
              <Area
                key={s.key} dataKey={s.key} name={s.label} type="monotone"
                stroke={color} fill={`url(#grad-${s.key})`} strokeWidth={2} activeDot={{ r: 4 }}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- Bar chart ---------------- */
interface BarSeriesProps {
  data: any[];
  bars: { key: string; label: string; color?: string; stackId?: string }[];
  height?: number;
  yLabel?: string;
  layout?: "horizontal" | "vertical";
  showLegend?: boolean;
  yFormatter?: (v: number) => string;
}

export function BarSeries({ data, bars, height = 260, yLabel, layout = "horizontal", showLegend = false, yFormatter }: BarSeriesProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout={layout === "vertical" ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {layout === "horizontal" && showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />}
          <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
          {layout === "horizontal" ? (
            <>
              <XAxis dataKey={layout === "horizontal" ? "name" : "value"} type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={yFormatter} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={120} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={yFormatter} width={42} label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "var(--text-tertiary)" } } : undefined} />
            </>
          )}
          <Tooltip
            formatter={yFormatter as ((value: unknown, name: unknown) => ReactNode) | undefined}
            cursor={{ fill: "rgba(11,18,32,0.04)" }}
          />
          {bars.map((b, i) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.label}
              fill={b.color ?? ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)"][i] ?? "var(--chart-1)"}
              radius={[4, 4, 0, 0]}
              stackId={b.stackId}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- Line chart (multi-series) ---------------- */
interface LineSeriesProps {
  data: any[];
  series: { key: string; label: string; color: string }[];
  height?: number;
  xKey?: string;
  yFormatter?: (v: number) => string;
}

export function LineSeries({ data, series, height = 260, xKey = "x", yFormatter }: LineSeriesProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={yFormatter} width={42} />
          <Tooltip
            formatter={yFormatter as ((value: unknown, name: unknown) => ReactNode) | undefined}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
          {series.map(s => (
            <Line key={s.key} dataKey={s.key} name={s.label} type="monotone" stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- Donut ---------------- */
interface DonutProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: { primary: string; secondary?: string };
}

export function Donut({ data, height = 240, innerRadius = 60, outerRadius = 90, showLegend = true, centerLabel }: DonutProps) {
  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={1.5} stroke="var(--surface)">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          {showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-lg font-semibold text-ink-primary tabular">{centerLabel.primary}</div>
            {centerLabel.secondary && <div className="text-[11px] text-ink-tertiary">{centerLabel.secondary}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sparkline ---------------- */
export function Sparkline({ data, color = "var(--chart-1)", height = 28 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((v, i) => ({ x: i, y: v }));
  return (
    <div style={{ width: 80, height }}>
      <ResponsiveContainer>
        <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.32} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area dataKey="y" type="monotone" stroke={color} fill="url(#spark-grad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- Progress / capacity bars ---------------- */
export function ProgressBar({ value, max = 100, tone = "primary" }: { value: number; max?: number; tone?: "primary" | "success" | "warning" | "danger" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "success" ? "var(--success-500)" : tone === "warning" ? "var(--warning-500)" : tone === "danger" ? "var(--danger-500)" : "var(--primary-500)";
  return (
    <div className="w-full h-1.5 rounded-pill bg-neutral-100 overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="h-full rounded-pill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

/* ---------------- Heatmap cell (semantic) ---------------- */
export function severityToTone(score: number): "success" | "info" | "warning" | "danger" {
  if (score < 25) return "success";
  if (score < 45) return "info";
  if (score < 65) return "warning";
  return "danger";
}

export function HeatCell({ score, label }: { score: number; label?: string }) {
  const tone = severityToTone(score);
  const map = {
    success: "bg-success-50 text-success-700 border-success-100",
    info:    "bg-info-50 text-info-700 border-info-100",
    warning: "bg-warning-50 text-warning-700 border-warning-100",
    danger:  "bg-danger-50 text-danger-700 border-danger-100" } as const;
  // intensity via background saturation
  const intensity = Math.min(1, score / 80);
  const op = 0.18 + intensity * 0.55;
  return (
    <div
      className={["h-9 rounded-md border grid place-items-center text-[11.5px] font-medium tabular", map[tone]].join(" ")}
      style={{ background: `color-mix(in srgb, currentColor ${op * 12}%, var(--surface))` }}
      aria-label={label ?? `severity ${score}`}
      title={label ?? `Severity ${score}`}
    >
      {score}
    </div>
  );
}

/* ---------------- ChartCard wrapper ---------------- */
interface ChartCardProps {
  title: ReactNode;
  description?: ReactNode;
  controls?: ReactNode;
  height?: number;
  children: ReactNode;
  legend?: ReactNode;
  footer?: ReactNode;
}

export function ChartCard({ title, description, controls, children, legend, footer }: ChartCardProps) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-1">
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-border-subtle">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-ink-primary truncate">{title}</div>
          {description && <div className="text-xs text-ink-tertiary mt-0.5">{description}</div>}
        </div>
        {controls && <div className="flex items-center gap-1 shrink-0">{controls}</div>}
      </div>
      <div className="p-3">
        {children}
        {legend && <div className="mt-2 text-[11px] text-ink-tertiary">{legend}</div>}
      </div>
      {footer && <div className="border-t border-border-subtle px-4 py-2.5 text-[11.5px] text-ink-tertiary">{footer}</div>}
    </div>
  );
}

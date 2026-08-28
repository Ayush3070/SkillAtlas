import { useMemo } from "react";
import { Link } from "react-router-dom";
import {Sparkles, TrendingUp, TrendingDown} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { DataTable, type Column } from "../../components/data-display/DataTable";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { ChartCard, BarSeries, Donut } from "../../components/charts";
import { Badge } from "../../components/ui/Badge";
import { SkeletonTable, SkeletonChart, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness, skillGapBySector } from "../../data/mock/series";
import { useFilters as _useFilters } from "../../components/data-display/FilterBar";
import type { Skill, SkillLifecycle } from "../../types/domain";

const CATEGORIES = ["Technical","Domain","Tool","Soft","Certification","Process"] as const;
const LIFECYCLES: SkillLifecycle[] = ["critical","emerging","stable","oversupplied","declining"];

export default function SkillsPage() {
  const { values, set, reset } = useFilters([
    { id: "category", label: "Category", type: "select", options: CATEGORIES.map(c => ({ value: c, label: c })) },
    { id: "lifecycle", label: "Lifecycle", type: "select", options: LIFECYCLES.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) })) },
  ]);
  const { data, loading, error, refetch } = useAsync(() => api.skills().then(r => r.data.skills), []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(s => {
      if (values.category && s.category !== values.category) return false;
      if (values.lifecycle && s.lifecycle !== values.lifecycle) return false;
      return true;
    });
  }, [data, values]);

  // Synthetic demand vs supply for visualization
  const summaryData = useMemo(() => {
    return (data ?? []).slice(0, 12).map(s => ({
      name: s.name.length > 22 ? s.name.slice(0, 22) + "…" : s.name,
      demand: 60 + Math.round(Math.random() * 30),
      supply: 30 + Math.round(Math.random() * 50) }));
  }, [data]);

  const lifecycleData = useMemo(() => {
    if (!data) return [];
    const m: Record<string, number> = {};
    data.forEach(s => { m[s.lifecycle] = (m[s.lifecycle] ?? 0) + 1; });
    return Object.entries(m).map(([k, v], i) => ({ name: k, value: v, color: ["var(--danger-500)","var(--info-500)","var(--neutral-500)","var(--warning-500)","var(--success-500)"][i % 5] }));
  }, [data]);

  const cols: Column<Skill>[] = [
    { id: "name", header: "Skill", sortable: true, sortValue: s => s.name,
      cell: s => (
        <Link to={`/skills/${s.id}`} className="flex items-center gap-2 min-w-0">
          <span className="size-7 grid place-items-center rounded-md bg-primary-50 text-primary-700 text-[10.5px] font-semibold">{s.name.split(" ").slice(0,2).map(w => w[0]).join("")}</span>
          <span className="min-w-0">
            <span className="text-ink-primary font-medium truncate block">{s.name}</span>
            <span className="text-[11px] text-ink-tertiary truncate block">{s.category}</span>
          </span>
        </Link>
      ) },
    { id: "lifecycle", header: "Lifecycle", sortable: true, sortValue: s => s.lifecycle,
      cell: s => <LifecycleChip lifecycle={s.lifecycle} /> },
    { id: "demand", header: "Demand", align: "right", sortable: true, sortValue: s => s.lifecycle === "critical" ? 90 : s.lifecycle === "emerging" ? 80 : 60,
      cell: s => <span className="tabular font-semibold">{s.lifecycle === "critical" ? "92%" : s.lifecycle === "emerging" ? "84%" : "62%"}</span> },
    { id: "supply", header: "Supply", align: "right", sortable: true, sortValue: () => 50,
      cell: s => <span className="tabular">{s.lifecycle === "oversupplied" ? "82%" : s.lifecycle === "declining" ? "44%" : "55%"}</span> },
    { id: "gap", header: "Gap", align: "right", sortable: true, sortValue: s => s.lifecycle === "critical" ? 80 : 40,
      cell: s => <Badge tone={s.lifecycle === "critical" ? "danger" : s.lifecycle === "emerging" ? "warning" : s.lifecycle === "oversupplied" ? "info" : "neutral"}>{s.lifecycle === "critical" ? "Critical" : s.lifecycle === "emerging" ? "High" : s.lifecycle === "oversupplied" ? "Surplus" : s.lifecycle === "declining" ? "Low" : "Moderate"}</Badge> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Skills Intelligence"
        description="Why skills are missing — demand, supply, growth and required proficiency across Maharashtra's labour market."
        demo
        meta={<DataFreshnessStrip label="Skills view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        tag={<Badge tone="primary" variant="soft" leadingIcon={<Sparkles className="size-3" />}>Skill gap matrix available</Badge>}
        controls={<Link to="/curriculum" className="text-[12px] text-primary-600 hover:underline">Open curriculum alignment →</Link>}
      />

      <FilterBar
        filters={[
          { id: "category", label: "Category", type: "select", options: CATEGORIES.map(c => ({ value: c, label: c })) },
          { id: "lifecycle", label: "Lifecycle", type: "select", options: LIFECYCLES.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) })) },
          { id: "q", label: "Search", type: "search", placeholder: "Search skills…" },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(Boolean).length}
      />

      {error && <ErrorState title="Skills could not be loaded" description={error} onRetry={refetch} />}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading && (<><SkeletonChart height={260} /><SkeletonChart height={260} /><SkeletonChart height={260} /></>)}
        {!loading && (
          <>
            <ChartCard title="Demand vs supply — top skills" description="Illustrative indexed view for the top 12 skills." height={260}>
              <BarSeries
                data={summaryData}
                bars={[
                  { key: "demand", label: "Demand", color: "var(--chart-1)" },
                  { key: "supply", label: "Supply", color: "var(--chart-3)" },
                ]}
                showLegend
              />
            </ChartCard>
            <ChartCard title="Skill gap by sector" description="Composite 0–100 (higher = larger gap)." height={260}>
              <BarSeries
                data={skillGapBySector}
                bars={[{ key: "gap", label: "Gap", color: "var(--chart-6)" }]}
                yFormatter={(v) => `${v}`}
              />
            </ChartCard>
            <ChartCard title="Skill lifecycle mix" description="Distribution across lifecycle stages." height={260}>
              <Donut data={lifecycleData} centerLabel={{ primary: String(data?.length ?? 0), secondary: "skills" }} />
            </ChartCard>
          </>
        )}
      </section>

      {loading ? <SkeletonTable rows={6} cols={5} /> : (
        <DataTable
          data={filtered}
          columns={cols}
          rowKey={s => s.id}
          caption="Skills intelligence"
          onRowClick={s => { window.location.href = `/skills/${s.id}`; }}
          searchable={false}
          columnToggle
          onExport={() => {}}
        />
      )}
    </div>
  );
}

function LifecycleChip({ lifecycle }: { lifecycle: SkillLifecycle }) {
  const map: Record<SkillLifecycle, { tone: "danger" | "info" | "warning" | "success" | "neutral"; label: string; icon?: React.ReactNode }> = {
    critical:    { tone: "danger",  label: "Critical",    icon: <TrendingUp className="size-3" /> },
    emerging:    { tone: "info",    label: "Emerging",    icon: <Sparkles className="size-3" /> },
    stable:      { tone: "neutral", label: "Stable" },
    oversupplied:{ tone: "info",    label: "Oversupplied" },
    declining:   { tone: "warning", label: "Declining",   icon: <TrendingDown className="size-3" /> } };
  const c = map[lifecycle];
  return <Badge tone={c.tone} variant="soft" leadingIcon={c.icon}>{c.label}</Badge>;
}

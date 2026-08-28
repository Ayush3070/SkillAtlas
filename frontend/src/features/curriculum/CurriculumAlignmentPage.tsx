import { Link } from "react-router-dom";
import {ArrowUpRight, Sparkles, GitCompareArrows} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { DataTable, type Column } from "../../components/data-display/DataTable";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";

import { StatusBadge } from "../../components/ui/Badge";
import { SkeletonTable, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import type { Course, Sector } from "../../types/domain";
import { Button } from "../../components/ui/Button";
import { ChartCard, BarSeries, Donut } from "../../components/charts";


import { pushToast } from "../../components/feedback/Toast";

const SECTORS: Sector[] = ["Automotive & EV","Manufacturing","IT & Software","BFSI & FinTech","Healthcare","Construction & Real Estate","Retail & E-commerce","Logistics & Warehousing","Hospitality","Agriculture & Food Processing","Renewable Energy","Telecommunications","Cross-sector"];

export default function CurriculumAlignmentPage() {
  const { values, set, reset } = useFilters([
    { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
    { id: "status", label: "Status", type: "select", options: [
      { value: "Aligned", label: "Aligned" },
      { value: "Needs Update", label: "Needs Update" },
      { value: "Oversupplied", label: "Oversupplied" },
      { value: "Obsolete", label: "Obsolete" },
      { value: "Emerging", label: "Emerging" },
    ]},
  ]);

  const { data, loading, error, refetch } = useAsync(() => api.curriculum().then(r => r.data), []);

  const filtered = (data?.courses ?? []).filter((c: Course) => {
    if (values.sector && c.sector !== values.sector) return false;
    if (values.status && c.status !== values.status) return false;
    return true;
  });

  const cols: Column<Course>[] = [
    {
      id: "name", header: "Course", sortable: true, sortValue: c => c.name,
      cell: c => (
        <Link to={`/curriculum/${c.id}`} className="text-ink-primary font-medium hover:text-primary-600">
          {c.name}
          <div className="text-[10.5px] text-ink-tertiary font-normal">{c.sector} · NSQF L{c.nsqfLevel}</div>
        </Link>
      ) },
    { id: "alignment", header: "Alignment score", align: "right", sortable: true, sortValue: c => c.alignmentScore, cell: c => (
      <div className="inline-flex items-center gap-2 justify-end">
        <div className="w-16 h-1.5 rounded-pill bg-neutral-100 overflow-hidden">
          <div className={["h-full", c.alignmentScore >= 80 ? "bg-success-500" : c.alignmentScore >= 60 ? "bg-warning-500" : "bg-danger-500"].join(" ")} style={{ width: `${c.alignmentScore}%` }} />
        </div>
        <span className="text-[12px] font-semibold tabular w-8 text-right">{c.alignmentScore}</span>
      </div>
    )},
    { id: "relevance", header: "Industry relevance", align: "right", cell: c => <span className="tabular">{c.placementRate}%</span> },
    { id: "freshness", header: "Curriculum freshness", align: "right", cell: () => <span className="text-ink-tertiary">12 mo</span> },
    { id: "validation", header: "Employer validation", align: "right", cell: c => <span className="tabular">{Math.round(c.alignmentScore * 0.8)}%</span> },
    { id: "placement", header: "Placement", align: "right", sortable: true, sortValue: c => c.placementRate, cell: c => <span className="tabular">{c.placementRate}%</span> },
    { id: "status", header: "Status", sortable: true, sortValue: c => c.status, cell: c => <StatusBadge status={c.status} /> },
    { id: "actions", header: "", align: "right", cell: c => <Link to={`/curriculum/${c.id}`} className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 text-[12px]">Open <ArrowUpRight className="size-3" /></Link> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Curriculum Alignment"
        description="Course → Skills → Job Roles — see where curricula drift from industry and get actionable recommendations."
        demo
        meta={<DataFreshnessStrip label="Curriculum view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline" leadingIcon={<Sparkles className="size-3.5" />} onClick={() => pushToast({ tone: "info", title: "Bulk analysis queued", description: "Re-running alignment across 36 courses." })}>Re-run analysis</Button>
            <Button leadingIcon={<GitCompareArrows className="size-3.5" />}>Generate report</Button>
          </>
        }
      />

      <FilterBar
        filters={[
          { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
          { id: "status", label: "Status", type: "select", options: [
            { value: "Aligned", label: "Aligned" },
            { value: "Needs Update", label: "Needs Update" },
            { value: "Oversupplied", label: "Oversupplied" },
            { value: "Obsolete", label: "Obsolete" },
            { value: "Emerging", label: "Emerging" },
          ]},
          { id: "q", label: "Search", type: "search", placeholder: "Search course…" },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(Boolean).length}
      />

      {error && <ErrorState title="Curriculum data could not be loaded" description={error} onRetry={refetch} />}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading ? (<>
          <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
          <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
          <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
        </>) : (
          <>
            <ChartCard title="Alignment score distribution" description="0–100 scale across 36 courses." height={260}>
              <BarSeries
                data={[
                  { name: "0–20", courses: 2 },
                  { name: "20–40", courses: 4 },
                  { name: "40–60", courses: 7 },
                  { name: "60–80", courses: 14 },
                  { name: "80–100", courses: 9 },
                ]}
                bars={[{ key: "courses", label: "Courses", color: "var(--chart-1)" }]}
              />
            </ChartCard>
            <ChartCard title="Status mix" description="Across 36 courses." height={260}>
              <Donut
                data={[
                  { name: "Aligned", value: 9, color: "var(--success-500)" },
                  { name: "Needs Update", value: 6, color: "var(--warning-500)" },
                  { name: "Oversupplied", value: 2, color: "var(--info-500)" },
                  { name: "Obsolete", value: 1, color: "var(--danger-500)" },
                  { name: "Emerging", value: 6, color: "var(--primary-500)" },
                ]}
                centerLabel={{ primary: "36", secondary: "courses" }}
              />
            </ChartCard>
            <ChartCard title="Top 5 courses needing change" description="By alignment × employer validation." height={260}>
              <BarSeries
                data={[
                  { name: "EV Tech", score: 62 },
                  { name: "Diesel", score: 38 },
                  { name: "BIM", score: 68 },
                  { name: "GDA", score: 80 },
                  { name: "Soft Skills", score: 42 },
                ]}
                bars={[{ key: "score", label: "Alignment", color: "var(--chart-3)" }]}
                yFormatter={(v) => `${v}`}
              />
            </ChartCard>
          </>
        )}
      </section>

      {loading ? <SkeletonTable rows={8} cols={7} /> : (
        <DataTable
          data={filtered}
          columns={cols}
          rowKey={c => c.id}
          caption="Curriculum alignment overview"
          onRowClick={c => { window.location.href = `/curriculum/${c.id}`; }}
          searchable={false}
          columnToggle
          onExport={() => {}}
        />
      )}
    </div>
  );
}

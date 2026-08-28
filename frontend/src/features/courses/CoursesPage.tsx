import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { DataTable, type Column } from "../../components/data-display/DataTable";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { SkeletonTable, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import type { Course, Sector } from "../../types/domain";

import { Button } from "../../components/ui/Button";

const SECTORS: Sector[] = ["Automotive & EV","Manufacturing","IT & Software","BFSI & FinTech","Healthcare","Construction & Real Estate","Retail & E-commerce","Logistics & Warehousing","Hospitality","Agriculture & Food Processing","Renewable Energy","Telecommunications","Cross-sector"];
const STATUSES = ["Aligned","Needs Update","Oversupplied","Obsolete","Emerging"] as const;

export default function CoursesPage() {
  const { values, set, reset } = useFilters([
    { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
    { id: "status", label: "Status", type: "select", options: STATUSES.map(s => ({ value: s, label: s })) },
    { id: "q", label: "Search", type: "search", placeholder: "Search course name…" },
  ]);
  const { data, loading, error, refetch } = useAsync(() => api.courses().then(r => r.data.courses), []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(c => {
      if (values.sector && c.sector !== values.sector) return false;
      if (values.status && c.status !== values.status) return false;
      if (values.q && !c.name.toLowerCase().includes(values.q.toLowerCase())) return false;
      return true;
    });
  }, [data, values]);

  const cols: Column<Course>[] = [
    {
      id: "name", header: "Course", sortable: true, sortValue: c => c.name,
      cell: c => (
        <Link to={`/courses/${c.id}`} className="min-w-0">
          <div className="text-ink-primary font-medium truncate">{c.name}</div>
          <div className="text-[11px] text-ink-tertiary">{c.sector} · NSQF L{c.nsqfLevel}</div>
        </Link>
      ) },
    { id: "duration", header: "Duration", align: "right", sortable: true, sortValue: c => c.durationWeeks, cell: c => <span className="tabular">{c.durationWeeks}w</span> },
    { id: "demand", header: "Demand", align: "right", sortable: true, sortValue: c => c.alignmentScore, cell: c => <span className="tabular">{c.alignmentScore}/100</span> },
    { id: "alignment", header: "Skill alignment", align: "right", sortable: true, sortValue: c => c.alignmentScore, cell: c => (
        <div className="inline-flex items-center gap-2 justify-end">
          <div className="w-16 h-1.5 rounded-pill bg-neutral-100 overflow-hidden">
            <div className={["h-full", c.alignmentScore >= 80 ? "bg-success-500" : c.alignmentScore >= 60 ? "bg-warning-500" : "bg-danger-500"].join(" ")} style={{ width: `${c.alignmentScore}%` }} />
          </div>
          <span className="text-[12px] font-semibold tabular w-8 text-right">{c.alignmentScore}</span>
        </div>
      )},
    { id: "placement", header: "Placement", align: "right", sortable: true, sortValue: c => c.placementRate, cell: c => <span className="tabular">{c.placementRate}%</span> },
    { id: "enrolment", header: "Enrolment", align: "right", sortable: true, sortValue: c => c.enrolled, cell: c => <span className="tabular">{c.enrolled}/{c.capacity}</span> },
    { id: "capacity", header: "Capacity", align: "right", sortable: true, sortValue: c => c.capacity, cell: c => <span className="tabular">{c.capacity}</span> },
    { id: "status", header: "Status", sortable: true, sortValue: c => c.status, cell: c => <StatusBadge status={c.status} /> },
  ];

  // Summary cards
  const summary = useMemo(() => {
    if (!data) return null;
    const byStatus: Record<string, number> = {};
    data.forEach(c => { byStatus[c.status] = (byStatus[c.status] ?? 0) + 1; });
    return byStatus;
  }, [data]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Courses"
        description="What is being trained — course catalogue with industry alignment, placement outcomes and curriculum health."
        demo
        meta={<DataFreshnessStrip label="Course view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline">Compare</Button>
            <Button>Create course</Button>
          </>
        }
      />

      <FilterBar
        filters={[
          { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
          { id: "status", label: "Status", type: "select", options: STATUSES.map(s => ({ value: s, label: s })) },
          { id: "q", label: "Search", type: "search", placeholder: "Search course name…" },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(v => v && v !== "all").length}
      />

      {error && <ErrorState title="Courses could not be loaded" description={error} onRetry={refetch} />}

      {!loading && summary && (
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {STATUSES.map(s => (
            <Card key={s} padding="sm">
              <div className="text-[11px] uppercase tracking-wider text-ink-tertiary font-semibold">{s}</div>
              <div className="text-xl font-semibold text-ink-primary tabular mt-0.5">{summary[s] ?? 0}</div>
            </Card>
          ))}
        </section>
      )}

      {loading ? <SkeletonTable rows={8} cols={8} /> : (
        <DataTable
          data={filtered}
          columns={cols}
          rowKey={c => c.id}
          caption="Course catalogue"
          onRowClick={c => { window.location.href = `/courses/${c.id}`; }}
          searchable={false}
          columnToggle
          onExport={() => {}}
        />
      )}
    </div>
  );
}

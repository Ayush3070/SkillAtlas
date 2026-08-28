import { useMemo } from "react";
import { Link } from "react-router-dom";
import {ArrowUpRight, ArrowDownRight} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { ChartCard, BarSeries, Donut, LineSeries } from "../../components/charts";
import { DataTable, type Column } from "../../components/data-display/DataTable";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { StatusBadge } from "../../components/ui/Badge";
import { SkeletonTable, SkeletonChart, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import {
  monthLabels, roleDemandSeries, sectorGrowth, demandVsSupply, geoDemand, sourceMix, freshness,
} from "../../data/mock/series";
import { findDistrict } from "../../data/mock/districts";
import type { JobRole, Sector } from "../../types/domain";

const SECTORS: Sector[] = ["Automotive & EV","Manufacturing","IT & Software","BFSI & FinTech","Healthcare","Construction & Real Estate","Retail & E-commerce","Logistics & Warehousing","Hospitality","Agriculture & Food Processing","Renewable Energy","Telecommunications"];

export default function LabourMarketPage() {
  const { values, set, reset } = useFilters([
    { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
    { id: "trend", label: "Trend", type: "select", options: [
      { value: "rising", label: "Rising" },
      { value: "stable", label: "Stable" },
      { value: "declining", label: "Declining" },
      { value: "emerging", label: "Emerging" },
    ]},
    { id: "level", label: "Level", type: "select", options: [
      { value: "Entry", label: "Entry" }, { value: "Junior", label: "Junior" }, { value: "Mid", label: "Mid" }, { value: "Senior", label: "Senior" }, { value: "Lead", label: "Lead" },
    ]},
  ]);

  const { data, loading, error, refetch } = useAsync(() => api.jobRoles().then(r => r.data.roles), []);
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
      if (values.sector && r.sector !== values.sector) return false;
      if (values.trend && r.trend !== values.trend) return false;
      if (values.level && r.level !== values.level) return false;
      return true;
    });
  }, [data, values]);

  // Charts
  const trendData = monthLabels.map((m, i) => ({
    x: m,
    "EV Technician": roleDemandSeries["rl-ev-technician"]?.[i] ?? 0,
    "Cloud Engineer": roleDemandSeries["rl-cloud-engineer"]?.[i] ?? 0,
    "GenAI Engineer": roleDemandSeries["rl-genai-engineer"]?.[i] ?? 0,
    "Solar Installer": roleDemandSeries["rl-solar-installer"]?.[i] ?? 0,
  }));

  const topRoles = (data ?? [])
    .filter(r => r.monthlyOpenings > 0)
    .sort((a, b) => b.monthlyOpenings - a.monthlyOpenings)
    .slice(0, 8);

  const cols: Column<JobRole>[] = [
    {
      id: "title", header: "Job role", sortable: true,
      sortValue: r => r.title,
      cell: r => (
        <Link to={`/labour-market/${r.id}`} className="flex items-center gap-2 min-w-0">
          <span className="size-7 grid place-items-center rounded-md bg-primary-50 text-primary-700 text-[10.5px] font-semibold">{r.title.split(" ").slice(0,2).map(w => w[0]).join("")}</span>
          <span className="min-w-0">
            <span className="text-ink-primary font-medium truncate block">{r.title}</span>
            <span className="text-[11px] text-ink-tertiary truncate block">{r.sector} · {r.level}</span>
          </span>
        </Link>
      ),
    },
    { id: "openings", header: "Monthly openings", align: "right", sortable: true, sortValue: r => r.monthlyOpenings,
      cell: r => <span className="tabular font-semibold">{r.monthlyOpenings.toLocaleString("en-IN")}</span> },
    { id: "growth", header: "YoY growth", align: "right", sortable: true, sortValue: r => r.growthYoY,
      cell: r => {
        const isUp = r.growthYoY >= 0;
        return (
          <span className={`inline-flex items-center gap-0.5 tabular font-medium ${isUp ? "text-success-600" : "text-danger-600"}`}>
            {isUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(r.growthYoY).toFixed(1)}%
          </span>
        );
      },
    },
    { id: "trend", header: "Trend", sortable: true, sortValue: r => r.trend,
      cell: r => <StatusBadge status={r.trend === "rising" ? "Aligned" : r.trend === "emerging" ? "Emerging" : r.trend === "declining" || r.trend === "declining-fast" ? "Obsolete" : "Needs Update"} /> },
    { id: "salary", header: "Avg salary (₹/mo)", align: "right", sortable: true, sortValue: r => r.avgSalaryINR,
      cell: r => <span className="tabular">₹{(r.avgSalaryINR/1000).toFixed(0)}k</span> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Labour Market"
        description="What is happening — sector demand, job-role growth, employer requirements and emerging signals across Maharashtra."
        demo
        meta={<DataFreshnessStrip label="Market view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
      />

      <FilterBar
        filters={[
          { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
          { id: "trend", label: "Trend", type: "select", options: [
            { value: "rising", label: "Rising" }, { value: "stable", label: "Stable" },
            { value: "declining", label: "Declining" }, { value: "emerging", label: "Emerging" },
          ]},
          { id: "level", label: "Level", type: "select", options: [
            { value: "Entry", label: "Entry" }, { value: "Junior", label: "Junior" }, { value: "Mid", label: "Mid" }, { value: "Senior", label: "Senior" },
          ]},
          { id: "q", label: "Search", type: "search", placeholder: "Search roles, employers, sectors…" },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(v => v && v !== "12m").length}
      />

      {error && <ErrorState title="Labour-market data could not be loaded" description={error} onRetry={refetch} />}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading && (<><SkeletonChart height={280} /><SkeletonChart height={280} /><SkeletonChart height={280} /></>)}
        {!loading && (
          <>
            <ChartCard title="Demand trend by job role" description="Indexed monthly openings for top-priority roles." height={280}>
              <LineSeries
                data={trendData}
                series={[
                  { key: "EV Technician",   label: "EV Technician",  color: "var(--chart-1)" },
                  { key: "Cloud Engineer",  label: "Cloud Engineer", color: "var(--chart-5)" },
                  { key: "GenAI Engineer",  label: "GenAI Engineer", color: "var(--chart-4)" },
                  { key: "Solar Installer", label: "Solar Installer",color: "var(--chart-2)" },
                ]}
              />
            </ChartCard>

            <ChartCard title="Top job roles by monthly openings" description="August 2026 — current demand." height={280}>
              <BarSeries
                data={topRoles.map(r => ({ name: r.title, openings: r.monthlyOpenings }))}
                bars={[{ key: "openings", label: "Openings", color: "var(--chart-1)" }]}
              />
            </ChartCard>

            <ChartCard title="Sector YoY growth" description="Top movers by % change vs. previous year." height={280}>
              <BarSeries
                data={[...sectorGrowth].sort((a, b) => b.growth - a.growth)}
                bars={[{ key: "growth", label: "YoY %", color: "var(--chart-2)" }]}
                yFormatter={(v) => `${v}%`}
              />
            </ChartCard>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading && (<><SkeletonChart height={260} /><SkeletonChart height={260} /><SkeletonChart height={260} /></>)}
        {!loading && (
          <>
            <ChartCard title="Demand vs supply by sector" description="Indexed demand against current training supply." height={260}>
              <BarSeries
                data={demandVsSupply}
                bars={[
                  { key: "demand", label: "Demand", color: "var(--chart-1)" },
                  { key: "supply", label: "Supply", color: "var(--chart-3)" },
                ]}
                showLegend
                yFormatter={(v) => `${v}`}
              />
            </ChartCard>

            <ChartCard title="Geographical demand" description="Top districts by monthly openings." height={260}>
              <BarSeries
                data={geoDemand.map(g => ({ name: findDistrict(g.districtId)?.name ?? g.districtId, openings: g.openings }))}
                bars={[{ key: "openings", label: "Openings", color: "var(--chart-1)" }]}
                yFormatter={(v) => v.toLocaleString("en-IN")}
              />
            </ChartCard>

            <ChartCard title="Signal source mix" description="Provenance of the platform's intelligence." height={260}>
              <Donut
                data={sourceMix.map((s, i) => ({ name: s.source, value: s.count, color: ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)"][i] }))}
                centerLabel={{ primary: "2,356", secondary: "signals" }}
              />
            </ChartCard>
          </>
        )}
      </section>

      <section>
        {loading ? <SkeletonTable rows={6} cols={5} /> : (
          <DataTable
            data={filtered}
            columns={cols}
            rowKey={r => r.id}
            caption="Job roles"
            searchable={false}
            columnToggle
            onExport={() => {}}
            onRowClick={r => { window.location.href = `/labour-market/${r.id}`; }}
          />
        )}
      </section>
    </div>
  );
}

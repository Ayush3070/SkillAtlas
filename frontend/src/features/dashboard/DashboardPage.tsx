import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Signal, Activity, Briefcase, Building2, BookOpen, BarChart3, Map as MapIcon, ArrowUpRight, FileText, GitBranch, Layers } from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { KpiCard } from "../../components/data-display/KpiCard";
import { ChartCard, Donut, Sparkline, ProgressBar, BarSeries } from "../../components/charts";
import { InsightCard } from "../../components/data-display/InsightCard";
import { EvidenceDrawer } from "../../components/data-display/EvidenceDrawer";
import { Card } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Skeleton, SkeletonKpi, SkeletonChart, SkeletonInsight, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { sectorGrowth, monthLabels, geoDemand, sourceMix, demandVsSupply, roleDemandSeries, sectorDemandIndex, freshness } from "../../data/mock/series";
import { districts as allDistricts } from "../../data/mock/districts";
import { findDistrict } from "../../data/mock/districts";

import { useFilters } from "../../components/data-display/FilterBar";
import { FilterBar } from "../../components/data-display/FilterBar";
import type { Sector } from "../../types/domain";
import { pushToast } from "../../components/feedback/Toast";
import { Button } from "../../components/ui/Button";

import type { Recommendation } from "../../types/domain";

const SECTORS: Sector[] = ["Automotive & EV","Manufacturing","IT & Software","BFSI & FinTech","Healthcare","Construction & Real Estate","Retail & E-commerce","Logistics & Warehousing","Hospitality","Agriculture & Food Processing","Renewable Energy","Telecommunications"];

export default function DashboardPage() {
  const { values, set, reset } = useFilters([
    { id: "period", label: "Period", type: "segmented", defaultValue: "12m", options: [
      { value: "3m", label: "3M" }, { value: "6m", label: "6M" }, { value: "12m", label: "12M" }, { value: "ytd", label: "YTD" },
    ]},
    { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
  ]);
  const { data, loading, error, refetch } = useAsync(() => api.dashboard().then(r => r.data), []);
  const [evidenceRec, setEvidenceRec] = useState<Recommendation | null>(null);

  const evRolesTrend = useMemo(() => roleDemandSeries["rl-ev-technician"] ?? [], []);
  const cloudTrend = useMemo(() => roleDemandSeries["rl-cloud-engineer"] ?? [], []);

  return (
    <div className="space-y-5">
      <PageHeader
        tag={<Badge tone="primary" variant="soft">Maharashtra</Badge>}
        demo
        title="Labour Market Intelligence"
        description="Understand demand, identify skill gaps and take evidence-based training decisions across districts, sectors and courses."
        meta={<DataFreshnessStrip label="State view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline" leadingIcon={<FileText className="size-3.5" />} onClick={() => pushToast({ tone: "info", title: "Report queued", description: "Maharashtra Labour Market Pulse — Aug 2026" })}>Generate report</Button>
            <Button leadingIcon={<BarChart3 className="size-3.5" />} onClick={() => pushToast({ tone: "success", title: "Filter snapshot saved" })}>Save view</Button>
          </>
        }
      />

      <FilterBar
        filters={[
          { id: "period", label: "Period", type: "segmented", defaultValue: "12m", options: [{ value: "3m", label: "3M" }, { value: "6m", label: "6M" }, { value: "12m", label: "12M" }, { value: "ytd", label: "YTD" }] },
          { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
          { id: "district", label: "District", type: "select", defaultValue: "pune", options: allDistricts.map(d => ({ value: d.id, label: d.name })) },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
      />

      {error && <ErrorState title="Dashboard data could not be loaded" description={error} onRetry={refetch} />}

      {/* KPIs — not all identical: each has its own visual */}
      <section aria-label="Key performance indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {loading && Array.from({length:5}).map((_,i) => <SkeletonKpi key={i} />)}
        {!loading && data && (
          <>
            <KpiCard
              label="Active job signals"
              delta={data.kpis.activeSignals}
              icon={<Signal className="size-4" />}
              spark={<Sparkline data={evRolesTrend} />}
              footer={<span className="text-[11px] text-ink-tertiary">Pune EV demand is the largest contributor.</span>}
            />
            <KpiCard
              label="Skill gap index"
              delta={data.kpis.skillGapIndex}
              icon={<Activity className="size-4" />}
              emphasis="critical"
              spark={<Sparkline data={roleDemandSeries["rl-genai-engineer"] ?? []} color="var(--chart-3)" />}
              footer={<span className="text-[11px] text-ink-tertiary">Index 0–100. Lower is better.</span>}
            />
            <KpiCard
              label="Placement rate"
              delta={data.kpis.placementRate}
              icon={<Briefcase className="size-4" />}
              spark={<Sparkline data={roleDemandSeries["rl-cnc-operator"] ?? []} color="var(--chart-2)" />}
              footer={<ProgressBar value={data.kpis.placementRate.rawValue} max={100} tone="success" />}
            />
            <KpiCard
              label="Employer satisfaction"
              delta={data.kpis.employerSatisfaction}
              icon={<Building2 className="size-4" />}
              spark={<Sparkline data={roleDemandSeries["rl-cloud-engineer"] ?? []} color="var(--chart-5)" />}
              footer={<span className="text-[11px] text-ink-tertiary">From 36 validated employer requirements.</span>}
            />
            <KpiCard
              label="Course alignment"
              delta={data.kpis.courseAlignment}
              icon={<BookOpen className="size-4" />}
              spark={<Sparkline data={roleDemandSeries["rl-solar-installer"] ?? []} color="var(--chart-4)" />}
              footer={<span className="text-[11px] text-ink-tertiary">Across 36 courses.</span>}
            />
          </>
        )}
      </section>

      {/* Key Insights — decision support */}
      <section aria-label="Executive insights" className="space-y-2.5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink-primary">Key insights</h2>
            <p className="text-xs text-ink-tertiary">Evidence-backed observations ranked by impact.</p>
          </div>
          <Link to="/reports" className="text-[12px] text-primary-600 hover:underline inline-flex items-center gap-1">
            View all <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <SkeletonInsight /><SkeletonInsight />
          </div>
        )}

        {!loading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.insights.map((rec, i) => {
              const sev: "info" | "success" | "warning" | "critical" = i === 0 ? "critical" : i === 1 ? "warning" : i === 2 ? "info" : "success";
              return (
                <InsightCard
                  key={rec.id}
                  severity={sev}
                  title={rec.title}
                  body={rec.summary}
                  evidence={[
                    { id: "e1", label: "Demand", value: rec.why.find(w => w.includes("demand"))?.replace(/.*?([+-]?\d+%).*/, "$1") ?? "—" },
                    { id: "e2", label: "Employers", value: String(rec.why.filter(w => w.toLowerCase().includes("employer")).length || 12) },
                    { id: "e3", label: "Capacity", value: rec.why.find(w => w.toLowerCase().includes("capacity"))?.replace(/.*?([+-]?\d+%).*/, "$1") ?? "—22%" },
                    { id: "e4", label: "Confidence", value: `${rec.confidence}%` },
                  ]}
                  recommendation={rec.why[0]}
                  confidence={rec.confidence}
                  expectedImpact={rec.expectedImpact}
                  ctaTo={rec.scope.type === "course" ? `/curriculum/${rec.scope.id}` : rec.scope.type === "district" ? `/district-planning/${rec.scope.id}` : `/skills`}
                  ctaLabel="Open recommendation"
                  secondaryCtaTo="#"
                  secondaryCtaLabel="View evidence"
                  // The "View evidence" pseudo-link is replaced by clicking the card:
                />
              );
            })}
            <button
              type="button"
              onClick={() => setEvidenceRec(data.insights[0])}
              className="text-left"
              aria-label="View evidence for first insight"
            >
              <span className="sr-only">Open evidence</span>
            </button>
          </div>
        )}
      </section>

      {/* Charts grid */}
      <section aria-label="Trends" className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading && (
          <>
            <SkeletonChart height={260} />
            <SkeletonChart height={260} />
            <SkeletonChart height={260} />
          </>
        )}
        {!loading && data && (
          <>
            <ChartCard
              title="Demand index by sector"
              description="Indexed monthly demand across Maharashtra (Sep '25 = 100)."
              height={260}
            >
              <BarSeries
                data={monthLabels.map((m, i) => ({ x: m, "Automotive & EV": sectorDemandIndex["Automotive & EV"]?.[i] ?? 0 }))}
                bars={[{ key: "Automotive & EV", label: "Auto & EV", color: "var(--chart-1)" }]}
                yFormatter={(v) => `${v}`}
                showLegend={false}
              />
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-tertiary">
                {SECTORS.slice(0, 4).map((s, i) => (
                  <span key={s} className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-sm" style={{ background: ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-5)"][i] }} />
                    {s}
                  </span>
                ))}
                <Link to="/labour-market" className="ml-auto text-primary-600 hover:underline">Open labour market →</Link>
              </div>
            </ChartCard>

            <ChartCard
              title="Top sectors by YoY growth"
              description="Year-over-year change in monthly job openings."
              height={260}
            >
              <BarSeries
                data={[...sectorGrowth].sort((a, b) => b.growth - a.growth)}
                bars={[{ key: "growth", label: "YoY %", color: "var(--chart-1)" }]}
                yFormatter={(v) => `${v}%`}
              />
            </ChartCard>

            <ChartCard
              title="Demand vs supply by sector"
              description="Indexed demand against training supply."
              height={260}
            >
              <BarSeries
                data={demandVsSupply}
                bars={[
                  { key: "demand", label: "Demand", color: "var(--chart-1)" },
                  { key: "supply", label: "Supply", color: "var(--chart-3)" },
                ]}
                yFormatter={(v) => `${v}`}
                showLegend
              />
            </ChartCard>
          </>
        )}
      </section>

      {/* District + Pipeline */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading && <Skeleton className="h-[300px] col-span-1 xl:col-span-2" />}

        {!loading && data && (
          <Card
            title={<span className="inline-flex items-center gap-2"><MapIcon className="size-3.5 text-ink-tertiary" /> Top districts by monthly openings</span>}
            description="Aggregated openings across all sectors."
            actions={<Link to="/district-planning" className="text-[12px] text-primary-600 hover:underline">Open district planning →</Link>}
            padding="none"
          >
            <ul className="divide-y divide-border-subtle">
              {geoDemand.slice(0, 6).map((g) => {
                const d = findDistrict(g.districtId);
                if (!d) return null;
                const max = Math.max(...geoDemand.map(x => x.openings));
                return (
                  <li key={g.districtId} className="px-4 py-2.5 flex items-center gap-3">
                    <div className="size-7 grid place-items-center rounded-md bg-neutral-100 text-ink-tertiary text-[10.5px] font-semibold">{d.name.slice(0, 3).toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm text-ink-primary truncate">{d.name}</span>
                        <span className="text-[12.5px] font-semibold text-ink-primary tabular">{g.openings.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="mt-1.5"><ProgressBar value={(g.openings / max) * 100} tone="primary" /></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        <Card
          title={<span className="inline-flex items-center gap-2"><Layers className="size-3.5 text-ink-tertiary" /> Signal source mix</span>}
          description="Last 6 months."
          padding="none"
        >
          <div className="p-3">
            <Donut
              data={sourceMix.map((s, i) => ({ name: s.source, value: s.count, color: ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--chart-6)"][i] }))}
              centerLabel={{ primary: "2,356", secondary: "total signals" }}
            />
          </div>
        </Card>
      </section>

      {/* Recent signals */}
      <Card
        title={<span className="inline-flex items-center gap-2"><GitBranch className="size-3.5 text-ink-tertiary" /> Recent labour-market signals</span>}
        description="Newest items from the platform's intelligence pipeline."
        actions={<Link to="/labour-market" className="text-[12px] text-primary-600 hover:underline">Open labour market →</Link>}
        padding="none"
      >
        <ul className="divide-y divide-border-subtle">
          {[
            { id: "ls-001", source: "Employer Survey", sector: "Automotive & EV", date: "2026-08-12", text: "Tata Motors: 31% YoY growth in EV service roles at Pune plant.", value: "+31%" },
            { id: "ls-011", source: "Employer Survey", sector: "IT & Software",   date: "2026-08-20", text: "Jio Platforms & TCS to onboard 280+ applied GenAI engineers in next 6 months.", value: "280" },
            { id: "ls-030", source: "Government Portal", sector: "Renewable Energy", date: "2026-08-03", text: "PM Surya Ghar push drives 21% YoY demand for rooftop PV installers in Nashik.", value: "+21%" },
            { id: "ls-040", source: "Employer Survey", sector: "Healthcare", date: "2026-08-05", text: "Apollo Hospitals report MRI tech hiring constraint; AERB-L2 cert pipeline thin.", value: "84%" },
            { id: "ls-080", source: "Job Portal", sector: "Automotive & EV", date: "2026-08-07", text: "Diesel mechanic postings in Nashik down 8% YoY as fleets electrify.", value: "-8%" },
          ].map(s => (
            <li key={s.id} className="px-4 py-2.5 flex items-center gap-3">
              <StatusBadge status={s.source === "Employer Survey" ? "Validated" : s.source === "Government Portal" ? "In Review" : "Pending"} />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] text-ink-primary truncate">{s.text}</div>
                <div className="text-[11px] text-ink-tertiary">{s.sector} · {s.source} · {s.date}</div>
              </div>
              <div className="text-[12.5px] font-semibold text-ink-primary tabular">{s.value}</div>
            </li>
          ))}
        </ul>
      </Card>

      <EvidenceDrawer open={!!evidenceRec} onClose={() => setEvidenceRec(null)} rec={evidenceRec} />
    </div>
  );
}

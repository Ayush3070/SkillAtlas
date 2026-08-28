import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {ArrowLeft, ArrowUpRight, Building2, FileText, GraduationCap} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { LineSeries, ProgressBar } from "../../components/charts";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Skeleton, ErrorState, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { findSkill } from "../../data/mock/skills";
import { findEmployer } from "../../data/mock/employers";
import { Button } from "../../components/ui/Button";

export default function RoleDetailPage() {
  const { roleId = "" } = useParams();
  const { data, loading, error, refetch } = useAsync(() => api.roleDetails(roleId).then(r => r.data), [roleId]);
  const [tab, setTab] = useState<"overview" | "evidence" | "curriculum">("overview");

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  if (error || !data) return <ErrorState title="Role not found" description={error ?? "We couldn't find this role."} onRetry={refetch} action={<Link className="text-primary-600 text-xs hover:underline" to="/labour-market">Back to labour market</Link>} />;

  const { role, series, months, signals, cells } = data as any;
  const dataArr = months.map((m: string, i: number) => ({ x: m, openings: series[i] ?? 0 }));

  return (
    <div className="space-y-5">
      <Link to="/labour-market" className="text-[12px] text-ink-tertiary hover:text-ink-primary inline-flex items-center gap-1"><ArrowLeft className="size-3" /> Labour Market</Link>
      <PageHeader
        title={role.title}
        description={role.description}
        demo
        meta={<DataFreshnessStrip label="Role view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        tag={<Badge tone="primary" variant="soft">{role.sector}</Badge>}
        controls={
          <>
            <Button variant="outline" leadingIcon={<FileText className="size-3.5" />}>Add to report</Button>
            <Link to="/curriculum"><Button leadingIcon={<GraduationCap className="size-3.5" />}>Map to curriculum</Button></Link>
          </>
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBlock label="Monthly openings" value={role.monthlyOpenings.toLocaleString("en-IN")} sub="Aug 2026" />
        <KpiBlock label="YoY growth" value={`${role.growthYoY >= 0 ? "+" : ""}${role.growthYoY.toFixed(1)}%`} sub="vs previous year" tone={role.growthYoY >= 0 ? "success" : "danger"} />
        <KpiBlock label="Avg salary" value={`₹${(role.avgSalaryINR/1000).toFixed(0)}k`} sub="per month" />
        <KpiBlock label="Level" value={role.level} sub="Career stage" />
      </section>

      {/* Tabs */}
      <div className="border-b border-border-subtle flex items-center gap-1 -mb-px">
        {(["overview", "evidence", "curriculum"] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "px-3 h-9 text-sm border-b-2 transition-colors capitalize",
              tab === t ? "border-primary-500 text-primary-700 font-semibold" : "border-transparent text-ink-tertiary hover:text-ink-primary",
            ].join(" ")}
            role="tab"
            aria-selected={tab === t}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <Card title="Demand trend" description="Last 12 months of monthly openings." className="xl:col-span-2">
            <LineSeries data={dataArr} series={[{ key: "openings", label: "Openings", color: "var(--chart-1)" }]} yFormatter={v => v.toLocaleString("en-IN")} />
          </Card>
          <Card title="Skill gap heatmap" description="Severity of skill gap for this role.">
            <ul className="space-y-1.5">
              {Object.entries(cells).map(([skillId, score]) => {
                const s = findSkill(skillId);
                if (!s) return null;
                return (
                  <li key={skillId} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] text-ink-primary truncate">{s.name}</div>
                      <div className="text-[10.5px] text-ink-tertiary">{s.category}</div>
                    </div>
                    <div className="w-32"><ProgressBar value={Number(score)} tone={Number(score) > 60 ? "danger" : Number(score) > 40 ? "warning" : "success"} /></div>
                    <div className="w-9 text-right text-[12px] font-semibold tabular text-ink-primary">{Number(score)}</div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Primary skills" className="xl:col-span-2">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {role.primarySkillIds.map((id: string) => {
                const s = findSkill(id);
                if (!s) return null;
                return (
                  <li key={id}>
                    <Link to={`/skills/${id}`} className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle hover:border-border-default hover:bg-neutral-50 transition-colors">
                      <span className="size-7 grid place-items-center rounded-md bg-primary-50 text-primary-700 text-[10.5px] font-semibold">{s.name.split(" ").slice(0,2).map(w => w[0]).join("")}</span>
                      <span className="flex-1 min-w-0">
                        <span className="text-[12.5px] text-ink-primary font-medium truncate block">{s.name}</span>
                        <span className="text-[10.5px] text-ink-tertiary">{s.category} · {s.lifecycle}</span>
                      </span>
                      <ArrowUpRight className="size-3.5 text-ink-tertiary" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Emerging skills" description="Optional, but increasingly expected.">
            {role.emergingSkillIds.length === 0 ? <div className="text-sm text-ink-tertiary">None specified for this role.</div> : (
              <ul className="space-y-1.5">
                {role.emergingSkillIds.map((id: string) => {
                  const s = findSkill(id);
                  if (!s) return null;
                  return (
                    <li key={id}>
                      <Link to={`/skills/${id}`} className="text-[12.5px] text-primary-600 hover:underline">{s.name}</Link>
                      <span className="text-[11px] text-ink-tertiary"> · {s.category}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      )}

      {tab === "evidence" && (
        <Card title="Underlying signals" description="Real labour-market signals referenced for this role.">
          {signals.length === 0 ? <EmptyState title="No signals yet" description="Evidence will appear as employer surveys, job-portal aggregations and placement data accumulate." /> : (
            <ul className="space-y-2">
              {signals.map((s: any) => (
                <li key={s.id} className="rounded-md border border-border-subtle bg-surface-sunken p-3">
                  <div className="flex items-center gap-2 text-[11px] text-ink-tertiary">
                    <span className="inline-flex h-5 items-center px-1.5 rounded-pill bg-neutral-100 border border-border-subtle font-medium uppercase tracking-wider text-[10px]">{s.source}</span>
                    <span>{s.date}</span>
                    <span>· {s.sector}</span>
                    <span className="ml-auto">Strength: {s.strength}/5</span>
                  </div>
                  <div className="text-[13px] text-ink-primary mt-1.5">{s.description}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {tab === "curriculum" && (
        <Card title="Map to curriculum" description="Courses and modules aligned with this role." actions={<Link to="/curriculum" className="text-[12px] text-primary-600 hover:underline">Open curriculum alignment →</Link>}>
          <div className="text-sm text-ink-tertiary">Open the curriculum alignment page to inspect specific module-level coverage for this role.</div>
        </Card>
      )}

      <Card title={<span className="inline-flex items-center gap-2"><Building2 className="size-3.5 text-ink-tertiary" /> Top employers hiring for this role</span>}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {role.employerIds.slice(0, 6).map((id: string) => {
            const e = findEmployer(id);
            if (!e) return null;
            return (
              <li key={id}>
                <Link to={`/employers/${id}`} className="block p-2.5 rounded-md border border-border-subtle hover:border-border-default hover:bg-neutral-50 transition-colors">
                  <div className="text-[12.5px] font-medium text-ink-primary">{e.name}</div>
                  <div className="text-[10.5px] text-ink-tertiary">{e.sector} · {e.size}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function KpiBlock({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "success" | "danger" }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <div className="text-[11px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className={["text-2xl font-semibold mt-1 tabular", tone === "success" ? "text-success-600" : tone === "danger" ? "text-danger-600" : "text-ink-primary"].join(" ")}>{value}</div>
      {sub && <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>}
    </div>
  );
}

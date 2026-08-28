
import { Link, useParams } from "react-router-dom";
import {ArrowLeft, BookOpen, Briefcase, Building2, FileText, Sparkles, GraduationCap} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { LineSeries, BarSeries, ProgressBar, Sparkline } from "../../components/charts";
import { Card, CardRow } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Skeleton, ErrorState, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";

import { districts } from "../../data/mock/districts";
import { findEmployer } from "../../data/mock/employers";
import { Button } from "../../components/ui/Button";

export default function SkillDetailPage() {
  const { skillId = "" } = useParams();
  const { data, loading, error, refetch } = useAsync(() => api.skillDetails(skillId).then(r => r.data), [skillId]);
  if (loading) return <div className="space-y-3"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (error || !data) return <ErrorState title="Skill not found" description={error ?? "We couldn't find this skill."} onRetry={refetch} action={<Link className="text-primary-600 text-xs hover:underline" to="/skills">Back to skills</Link>} />;

  const { skill, months, demand, supply, gap, roles, courses } = data as any;
  const trendData = months.map((m: string, i: number) => ({ x: m, Demand: demand[i], Supply: supply[i], Gap: gap[i] }));
  const districtData = districts.slice(0, 8).map((d, i) => ({ name: d.name, demand: 60 + ((i * 7) % 30), supply: 35 + ((i * 5) % 25) }));
  const proficiencyData = [
    { name: "None", value: 8 },
    { name: "Basic", value: 22 },
    { name: "Intermediate", value: 36 },
    { name: "Advanced", value: 24 },
    { name: "Expert", value: 10 },
  ];

  return (
    <div className="space-y-5">
      <Link to="/skills" className="text-[12px] text-ink-tertiary hover:text-ink-primary inline-flex items-center gap-1"><ArrowLeft className="size-3" /> Skills</Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5 min-w-0">
          <PageHeader
            title={skill.name}
            description={skill.description}
            demo
            tag={<Badge tone={skill.lifecycle === "critical" ? "danger" : skill.lifecycle === "emerging" ? "info" : "neutral"} variant="soft">{skill.lifecycle}</Badge>}
            meta={<DataFreshnessStrip label="Skill view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
            controls={<Button variant="outline" leadingIcon={<FileText className="size-3.5" />}>Add to report</Button>}
          />

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Demand index" value="92" sub="↑ vs prev year" tone="success" spark={<Sparkline data={demand} color="var(--chart-2)" />} />
            <Kpi label="Supply index" value="55" sub="Current cohort" spark={<Sparkline data={supply} color="var(--chart-5)" />} />
            <Kpi label="Gap index" value="37" sub="0–100 scale" tone="warning" spark={<Sparkline data={gap} color="var(--chart-3)" />} />
            <Kpi label="Open roles" value={String(roles.length)} sub="With this skill as primary" />
          </section>

          <Card title="Demand vs supply" description="Last 12 months of indexed demand and supply.">
            <LineSeries
              data={trendData}
              series={[
                { key: "Demand", label: "Demand", color: "var(--chart-1)" },
                { key: "Supply", label: "Supply", color: "var(--chart-2)" },
                { key: "Gap", label: "Gap", color: "var(--chart-3)" },
              ]}
            />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card title="Top job roles" description="Where this skill is required as primary.">
              {roles.length === 0 ? <EmptyState title="No job roles" description="No roles reference this skill as primary yet." /> : (
                <ul className="space-y-1.5">
                  {roles.map((r: any) => (
                    <li key={r.id}>
                      <Link to={`/labour-market/${r.id}`} className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle hover:bg-neutral-50">
                        <Briefcase className="size-3.5 text-ink-tertiary" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] text-ink-primary font-medium truncate">{r.title}</div>
                          <div className="text-[10.5px] text-ink-tertiary">{r.sector} · {r.level}</div>
                        </div>
                        <div className="text-[12px] text-ink-primary tabular font-semibold">{r.monthlyOpenings.toLocaleString("en-IN")}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Top districts" description="Where demand is highest.">
              <BarSeries
                data={districtData}
                bars={[
                  { key: "demand", label: "Demand", color: "var(--chart-1)" },
                  { key: "supply", label: "Supply", color: "var(--chart-3)" },
                ]}
                showLegend
              />
            </Card>
          </div>

          <Card title="Proficiency distribution" description="How candidates self-assess.">
            <div className="space-y-2">
              {proficiencyData.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-24 text-[12.5px] text-ink-secondary">{p.name}</div>
                  <div className="flex-1"><ProgressBar value={p.value} max={50} tone={p.name === "Advanced" || p.name === "Expert" ? "success" : p.name === "Intermediate" ? "primary" : "warning"} /></div>
                  <div className="w-10 text-right text-[12px] text-ink-primary tabular">{p.value}%</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={<span className="inline-flex items-center gap-2"><BookOpen className="size-3.5 text-ink-tertiary" /> Associated courses</span>}>
            {courses.length === 0 ? <EmptyState title="No associated courses" description="No active course references this skill yet." /> : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {courses.map((c: any) => (
                  <li key={c.id}>
                    <Link to={`/courses/${c.id}`} className="block p-2.5 rounded-md border border-border-subtle hover:bg-neutral-50">
                      <div className="text-[12.5px] text-ink-primary font-medium">{c.name}</div>
                      <div className="text-[10.5px] text-ink-tertiary">{c.sector} · {c.durationWeeks} weeks</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={<span className="inline-flex items-center gap-2"><Building2 className="size-3.5 text-ink-tertiary" /> Employer requirements referencing this skill</span>}>
            <ul className="space-y-1.5">
              {["emp-tata-motors","emp-infosys","emp-bosch-india","emp-apollo"].map(id => {
                const e = findEmployer(id);
                if (!e) return null;
                return (
                  <li key={id}>
                    <Link to={`/employers/${id}`} className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle hover:bg-neutral-50">
                      <div className="size-7 grid place-items-center rounded-md bg-neutral-100 text-ink-tertiary text-[10.5px] font-semibold">{e.name.split(" ").slice(0,2).map(w => w[0]).join("")}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] text-ink-primary font-medium truncate">{e.name}</div>
                        <div className="text-[10.5px] text-ink-tertiary">{e.sector} · {e.districtId}</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* Right summary panel */}
        <aside className="space-y-3">
          <Card title="Summary">
            <CardRow label="Category" value={<span className="text-[12.5px]">{skill.category}</span>} />
            <CardRow label="Lifecycle" value={<LifecycleChip lifecycle={skill.lifecycle} />} />
            <CardRow label="Required proficiency" value="Advanced" hint="Across most job roles" />
            <CardRow label="Top sector" value="Automotive & EV" />
            <CardRow label="Top district" value="Pune" />
            <CardRow label="Last updated" value="2026-08-22" />
          </Card>
          <Card title={<span className="inline-flex items-center gap-2"><Sparkles className="size-3.5 text-ink-tertiary" /> Recommendations</span>}>
            <ul className="space-y-2 text-[12.5px] text-ink-secondary">
              <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" aria-hidden="true" /> Expand curriculum coverage in 3 courses.</li>
              <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" aria-hidden="true" /> Launch a 12-week short course in Pune & Nashik.</li>
              <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" aria-hidden="true" /> Co-design with 4 employers (already validated).</li>
            </ul>
            <div className="mt-3">
              <Link to="/curriculum"><Button fullWidth variant="outline" leadingIcon={<GraduationCap className="size-3.5" />}>Open in curriculum</Button></Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, tone, spark }: { label: string; value: string; sub?: string; tone?: "success" | "warning" | "danger"; spark?: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <div className="text-[11px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className="flex items-end justify-between gap-2 mt-1">
        <div className={["text-2xl font-semibold tabular", tone === "success" ? "text-success-600" : tone === "warning" ? "text-warning-600" : tone === "danger" ? "text-danger-600" : "text-ink-primary"].join(" ")}>{value}</div>
        {spark}
      </div>
      {sub && <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>}
    </div>
  );
}

import { Sparkles as _S } from "lucide-react";
function LifecycleChip({ lifecycle }: { lifecycle: any }) {
  const map: any = {
    critical:    { tone: "danger",  label: "Critical" },
    emerging:    { tone: "info",    label: "Emerging" },
    stable:      { tone: "neutral", label: "Stable" },
    oversupplied:{ tone: "info",    label: "Oversupplied" },
    declining:   { tone: "warning", label: "Declining" } };
  const c = map[lifecycle] ?? { tone: "neutral", label: lifecycle };
  return <Badge tone={c.tone} variant="soft">{c.label}</Badge>;
}

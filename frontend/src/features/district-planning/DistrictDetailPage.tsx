import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {ArrowLeft, FileText, Sparkles, MapPin, Building2, GraduationCap, Briefcase, Download} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card, CardRow } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Skeleton, ErrorState, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";

import { findRole } from "../../data/mock/jobRoles";


import { Button } from "../../components/ui/Button";
import { LineSeries, ProgressBar } from "../../components/charts";
import { pushToast } from "../../components/feedback/Toast";

const PRIORITY_TONE: any = { P1: "danger", P2: "warning", P3: "info" };

export default function DistrictDetailPage() {
  const { districtId = "" } = useParams();
  const { data, loading, error, refetch } = useAsync(() => api.districtDetails(districtId).then(r => r.data), [districtId]);
  const [genOpen, setGenOpen] = useState(false);
  const [horizon, setHorizon] = useState<3 | 6 | 12>(12);

  if (loading) return <div className="space-y-3"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (error || !data) return <ErrorState title="District not found" description={error ?? "We couldn't find this district."} onRetry={refetch} action={<Link className="text-primary-600 text-xs hover:underline" to="/district-planning">Back</Link>} />;

  const { district, insight, actions, capacities, centres, employers: emps, evSeries, months } = data as any;

  return (
    <div className="space-y-5">
      <Link to="/district-planning" className="text-[12px] text-ink-tertiary hover:text-ink-primary inline-flex items-center gap-1"><ArrowLeft className="size-3" /> District Planning</Link>

      <PageHeader
        title={district.name}
        description={`${insight ? `Top sectors: ${insight.topSectors.join(", ")}` : "District overview"}`}
        demo
        tag={<Badge tone="neutral" variant="soft"><MapPin className="size-3" /> Tier {district.tier}</Badge>}
        meta={<DataFreshnessStrip label="District view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline" leadingIcon={<FileText className="size-3.5" />} onClick={() => setGenOpen(true)}>Generate training plan</Button>
            <Button leadingIcon={<Download className="size-3.5" />}>Export PDF</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Priority score" value={insight ? `${insight.priorityScore}` : "—"} sub="0–100 scale" tone={insight && insight.priorityScore >= 70 ? "danger" : insight && insight.priorityScore >= 50 ? "warning" : "success"} />
        <Kpi label="Placement rate" value={insight ? `${insight.placementRate}%` : "—"} />
        <Kpi label="Employers" value={String(insight?.employerCount ?? 0)} />
        <Kpi label="Training centres" value={String(insight?.trainingCentres ?? 0)} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5 min-w-0">
          {evSeries && evSeries.length > 0 && (
            <Card title="EV technician demand · 12 months" description="Top emerging occupation in this district.">
              <LineSeries
                data={evSeries.map((v: number, i: number) => ({ x: months[i], Openings: v }))}
                series={[{ key: "Openings", label: "Openings", color: "var(--chart-1)" }]}
                yFormatter={v => v.toString()}
              />
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card title="Top sectors" description="By labour-market demand.">
              <ul className="space-y-2">
                {(insight?.topSectors ?? []).map((s: string) => (
                  <li key={s} className="flex items-center gap-2 text-[12.5px] text-ink-primary">
                    <span className="size-1.5 rounded-full bg-primary-500" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Top occupations">
              <ul className="space-y-2">
                {(insight?.topRoleIds ?? []).map((id: string) => {
                  const r = findRole(id);
                  if (!r) return null;
                  return (
                    <li key={id}>
                      <Link to={`/labour-market/${id}`} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-neutral-50">
                        <Briefcase className="size-3.5 text-ink-tertiary" />
                        <span className="text-[12.5px] text-ink-primary">{r.title}</span>
                        <span className="ml-auto text-[12px] text-ink-tertiary tabular">{r.monthlyOpenings}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <Card title="Recommended actions" description="Prioritised by impact and urgency.">
            {actions.length === 0 ? <EmptyState title="No actions proposed yet" description="Run 'Generate training plan' to produce recommendations for this district." /> : (
              <ul className="space-y-2">
                {actions.map((a: any) => (
                  <li key={a.id} className="rounded-md border border-border-subtle p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={PRIORITY_TONE[a.priority]} variant="solid">{a.priority}</Badge>
                      <span className="text-sm font-semibold text-ink-primary">{a.title}</span>
                      <StatusBadge status={a.status} />
                      <span className="ml-auto text-[11px] text-ink-tertiary">Owner: {a.owner}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px] text-ink-secondary">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1">Problem</div>
                        {a.problem}
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1">Evidence</div>
                        <ul className="space-y-0.5">
                          {a.evidence.map((e: string) => <li key={e}>· {e}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1">Recommendation</div>
                        {a.recommendation}
                        <div className="mt-1.5"><Badge tone={a.expectedImpact === "High" ? "danger" : a.expectedImpact === "Medium" ? "warning" : "info"} variant="soft">Impact: {a.expectedImpact}</Badge></div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Training capacity" description="Demand vs supply by sector." padding="none">
            {capacities.length === 0 ? <div className="p-6 text-sm text-ink-tertiary">No capacity data for this district.</div> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11.5px] uppercase tracking-wider text-ink-tertiary">
                    <th className="px-3 py-2 font-semibold">Sector</th>
                    <th className="px-3 py-2 font-semibold text-right">Demand</th>
                    <th className="px-3 py-2 font-semibold text-right">Capacity</th>
                    <th className="px-3 py-2 font-semibold">Gap</th>
                    <th className="px-3 py-2 font-semibold">Top role</th>
                  </tr>
                </thead>
                <tbody>
                  {capacities.map((c: any) => {
                    const gapPct = Math.round((c.gap / c.seatsRequired) * 100);
                    return (
                      <tr key={c.id} className="border-t border-border-subtle">
                        <td className="px-3 py-2.5 text-ink-primary font-medium">{c.sector}</td>
                        <td className="px-3 py-2.5 text-right tabular font-semibold">{c.seatsRequired.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2.5 text-right tabular">{c.seatsAvailable.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2.5 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1"><ProgressBar value={Math.max(0, gapPct)} tone={c.gap > 0 ? "danger" : "success"} /></div>
                            <span className={["text-[12px] font-semibold tabular w-12 text-right", c.gap > 0 ? "text-danger-600" : "text-success-600"].join(" ")}>{c.gap > 0 ? `+${c.gap}` : c.gap}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-ink-secondary text-[12.5px]">{findRole(c.topRoleId)?.title ?? c.topRoleId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <aside className="space-y-3">
          <Card title="Summary">
            <CardRow label="Population" value={`${district.population_lakhs}L`} />
            <CardRow label="Tier" value={`Tier ${district.tier}`} />
            <CardRow label="Placement" value={insight ? `${insight.placementRate}%` : "—"} />
            <CardRow label="Priority" value={insight ? `${insight.priorityScore}/100` : "—"} />
            <CardRow label="Critical skills" value={String(insight?.criticalSkillIds.length ?? 0)} />
          </Card>
          <Card title={<span className="inline-flex items-center gap-2"><Building2 className="size-3.5 text-ink-tertiary" /> Employers</span>}>
            <ul className="space-y-1.5">
              {emps.map((e: any) => (
                <li key={e.id}>
                  <Link to={`/employers/${e.id}`} className="block p-2 rounded-md border border-border-subtle hover:bg-neutral-50">
                    <div className="text-[12.5px] text-ink-primary truncate">{e.name}</div>
                    <div className="text-[10.5px] text-ink-tertiary">{e.sector} · {e.size}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={<span className="inline-flex items-center gap-2"><GraduationCap className="size-3.5 text-ink-tertiary" /> Training centres</span>}>
            <ul className="space-y-1.5">
              {centres.length === 0 ? <li className="text-[12.5px] text-ink-tertiary">No training centres in this district.</li> :
                centres.map((c: any) => (
                  <li key={c.id} className="text-[12.5px] text-ink-primary">
                    <span className="font-medium">{c.name}</span>
                    <div className="text-[10.5px] text-ink-tertiary">Util {c.utilization}% · Plcmt {c.placementRate}%</div>
                  </li>
                ))
              }
            </ul>
          </Card>
        </aside>
      </div>

      <GeneratePlanModal open={genOpen} onClose={() => setGenOpen(false)} districtId={districtId} horizon={horizon} setHorizon={setHorizon} />
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "success" | "warning" | "danger" }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <div className="text-[11px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className={["text-2xl font-semibold mt-1 tabular", tone === "success" ? "text-success-600" : tone === "warning" ? "text-warning-600" : tone === "danger" ? "text-danger-600" : "text-ink-primary"].join(" ")}>{value}</div>
      {sub && <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>}
    </div>
  );
}

import { Modal } from "../../components/ui/Modal";
import { recommendations as allRecs } from "../../data/mock/districtPlanning";
function GeneratePlanModal({ open, onClose, districtId, horizon, setHorizon }: { open: boolean; onClose: () => void; districtId: string; horizon: 3 | 6 | 12; setHorizon: (n: 3 | 6 | 12) => void }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function start() {
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); pushToast({ tone: "success", title: "District training plan ready", description: "Saved to reports." }); }, 1100);
  }
  function close() { onClose(); setTimeout(() => { setDone(false); setGenerating(false); }, 200); }

  return (
    <Modal open={open} onClose={close} title="Generate district training plan" description={`${districtId} · ${horizon}-month horizon`} size="md"
      footer={
        <>
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button onClick={start} loading={generating} leadingIcon={<Sparkles className="size-3.5" />}>Generate plan</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="text-[11.5px] font-medium text-ink-secondary mb-1.5">Horizon</div>
          <div className="inline-flex items-center bg-neutral-100 rounded-md p-0.5">
            {[3, 6, 12].map(n => (
              <button key={n} type="button" onClick={() => setHorizon(n as any)}
                className={["h-8 px-3 text-xs rounded-[5px] transition-colors", horizon === n ? "bg-surface text-ink-primary shadow-1" : "text-ink-tertiary hover:text-ink-primary"].join(" ")}>
                {n} months
              </button>
            ))}
          </div>
        </div>
        <ul className="text-[12.5px] text-ink-secondary space-y-1.5">
          <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5" /> Aggregate validated employer requirements</li>
          <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5" /> Map role-level demand to existing courses</li>
          <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5" /> Compute seat gap and priority score</li>
          <li className="flex items-start gap-1.5"><span className="size-1.5 rounded-full bg-primary-500 mt-1.5" /> Generate prioritised actions with evidence</li>
        </ul>
        {done && (
          <div className="rounded-md border border-success-100 bg-success-50/40 p-3 text-[12.5px] text-ink-primary">
            Plan ready. Open <Link to="/reports" className="text-primary-600 hover:underline">Reports</Link> to view or share.
          </div>
        )}
      </div>
    </Modal>
  );
}

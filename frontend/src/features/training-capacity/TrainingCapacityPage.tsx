import { Link } from "react-router-dom";
import {Wrench} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";

import { Skeleton, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { findDistrict } from "../../data/mock/districts";
import { findRole } from "../../data/mock/jobRoles";
import { ChartCard, BarSeries, Donut, ProgressBar } from "../../components/charts";

import { Button } from "../../components/ui/Button";

export default function TrainingCapacityPage() {
  const { data, loading, error, refetch } = useAsync(() => api.capacity().then(r => r.data), []);
  if (error) return <ErrorState title="Training capacity data could not be loaded" description={error} onRetry={refetch} />;

  const caps = data?.capacities ?? [];
  const centres = data?.centres ?? [];
  const totalAvail = caps.reduce((s, c) => s + c.seatsAvailable, 0);
  const totalReq = caps.reduce((s, c) => s + c.seatsRequired, 0);
  const gap = totalReq - totalAvail;
  const trainerAvg = caps.length ? Math.round(caps.reduce((s, c) => s + c.trainerAvailability, 0) / caps.length) : 0;
  const equipAvg = caps.length ? Math.round(caps.reduce((s, c) => s + c.equipmentAvailability, 0) / caps.length) : 0;
  const utilAvg = caps.length ? Math.round(caps.reduce((s, c) => s + c.utilization, 0) / caps.length) : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Training Capacity"
        description="Do we have enough training capacity for current demand?"
        demo
        meta={<DataFreshnessStrip label="Capacity view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={<Link to="/district-planning"><Button variant="outline">Open district planning →</Button></Link>}
      />

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi label="Seats available" value={totalAvail.toLocaleString("en-IN")} sub="across all sectors" />
        <Kpi label="Seats required" value={totalReq.toLocaleString("en-IN")} sub="current demand" />
        <Kpi label="Capacity gap" value={gap.toLocaleString("en-IN")} sub={gap > 0 ? "Shortfall" : "Surplus"} tone={gap > 0 ? "danger" : "success"} />
        <Kpi label="Trainer availability" value={`${trainerAvg}%`} tone={trainerAvg >= 75 ? "success" : "warning"} />
        <Kpi label="Equipment availability" value={`${equipAvg}%`} tone={equipAvg >= 75 ? "success" : "warning"} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {loading ? (
          <>
            <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
            <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
            <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
          </>
        ) : (
          <>
            <ChartCard title="Demand vs capacity by sector × district" description="Seats required vs available." height={280}>
              <BarSeries
                data={caps.map(c => ({ name: `${c.sector.slice(0,8)} · ${c.districtId}`, demand: c.seatsRequired, supply: c.seatsAvailable }))}
                bars={[
                  { key: "demand", label: "Required", color: "var(--chart-1)" },
                  { key: "supply", label: "Available", color: "var(--chart-3)" },
                ]}
                showLegend
              />
            </ChartCard>
            <ChartCard title="Utilization" description="Average across training centres." height={280}>
              <Donut
                data={[
                  { name: "High (>85%)", value: centres.filter(c => c.utilization > 85).length, color: "var(--danger-500)" },
                  { name: "Moderate (65–85%)", value: centres.filter(c => c.utilization >= 65 && c.utilization <= 85).length, color: "var(--warning-500)" },
                  { name: "Low (<65%)", value: centres.filter(c => c.utilization < 65).length, color: "var(--success-500)" },
                ]}
                centerLabel={{ primary: `${utilAvg}%`, secondary: "utilization" }}
              />
            </ChartCard>
            <ChartCard title="Trainer score vs equipment score" description="By training centre." height={280}>
              <BarSeries
                data={centres.map(c => ({ name: c.name.slice(0, 18), trainer: c.trainerScore, equipment: c.equipmentScore }))}
                bars={[
                  { key: "trainer", label: "Trainer", color: "var(--chart-5)" },
                  { key: "equipment", label: "Equipment", color: "var(--chart-4)" },
                ]}
                showLegend
              />
            </ChartCard>
          </>
        )}
      </section>

      <Card title={<span className="inline-flex items-center gap-2"><Wrench className="size-3.5 text-ink-tertiary" /> Sector × district capacity</span>} description="Live demand vs capacity and the gap to close." padding="none">
        {loading ? <div className="p-6"><Skeleton className="h-40" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11.5px] uppercase tracking-wider text-ink-tertiary">
                  <th className="px-3 py-2 font-semibold">Sector</th>
                  <th className="px-3 py-2 font-semibold">District</th>
                  <th className="px-3 py-2 font-semibold text-right">Demand</th>
                  <th className="px-3 py-2 font-semibold text-right">Capacity</th>
                  <th className="px-3 py-2 font-semibold">Gap</th>
                  <th className="px-3 py-2 font-semibold text-right">Trainer</th>
                  <th className="px-3 py-2 font-semibold text-right">Equipment</th>
                  <th className="px-3 py-2 font-semibold">Top role</th>
                </tr>
              </thead>
              <tbody>
                {caps.map(c => {
                  const gapPct = Math.round((c.gap / c.seatsRequired) * 100);
                  return (
                    <tr key={c.id} className="border-t border-border-subtle">
                      <td className="px-3 py-2.5 text-ink-primary font-medium">{c.sector}</td>
                      <td className="px-3 py-2.5 text-ink-secondary">{findDistrict(c.districtId)?.name ?? c.districtId}</td>
                      <td className="px-3 py-2.5 text-right tabular font-semibold">{c.seatsRequired.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2.5 text-right tabular">{c.seatsAvailable.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2.5 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1"><ProgressBar value={Math.max(0, gapPct)} tone={c.gap > 0 ? "danger" : "success"} /></div>
                          <span className={["text-[12px] font-semibold tabular w-14 text-right", c.gap > 0 ? "text-danger-600" : "text-success-600"].join(" ")}>{c.gap > 0 ? `+${c.gap}` : c.gap}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular">{c.trainerAvailability}%</td>
                      <td className="px-3 py-2.5 text-right tabular">{c.equipmentAvailability}%</td>
                      <td className="px-3 py-2.5 text-[12.5px] text-ink-secondary">
                        {findRole(c.topRoleId)?.title ?? c.topRoleId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Training centres" description="Where capacity lives." padding="none">
        {loading ? <div className="p-6"><Skeleton className="h-32" /></div> : (
          <ul className="divide-y divide-border-subtle">
            {centres.map(c => (
              <li key={c.id} className="px-4 py-3 flex items-center gap-3">
                <div className="size-9 grid place-items-center rounded-md bg-primary-50 text-primary-700 text-[10.5px] font-semibold">{c.name.split(" ").slice(0,2).map(w => w[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-primary truncate">{c.name}</div>
                  <div className="text-[11px] text-ink-tertiary truncate">{findDistrict(c.districtId)?.name ?? c.districtId} · {c.sectors.join(" · ")}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12.5px] text-ink-primary font-semibold tabular">{c.totalSeats.toLocaleString("en-IN")} seats</div>
                  <div className="text-[10.5px] text-ink-tertiary">Est. {c.establishedYear}</div>
                </div>
                <div className="w-40 grid grid-cols-3 gap-1.5 text-right">
                  <Mini label="Util" value={`${c.utilization}%`} tone={c.utilization > 85 ? "danger" : c.utilization >= 65 ? "warning" : "success"} />
                  <Mini label="Trn" value={`${c.trainerScore}`} />
                  <Mini label="Eqp" value={`${c.equipmentScore}`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
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

function Mini({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" | "danger" }) {
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className={["text-[12px] font-semibold tabular", tone === "success" ? "text-success-600" : tone === "warning" ? "text-warning-600" : tone === "danger" ? "text-danger-600" : "text-ink-primary"].join(" ")}>{value}</div>
    </div>
  );
}

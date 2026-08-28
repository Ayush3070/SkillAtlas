import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Map as MapIcon, Sparkles } from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { Skeleton, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { districts, findDistrict } from "../../data/mock/districts";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/charts";
import { pushToast } from "../../components/feedback/Toast";

export default function DistrictPlanningPage() {
  const { values, set, reset } = useFilters([
    { id: "tier", label: "Tier", type: "segmented", defaultValue: "all", options: [
      { value: "all", label: "All" },
      { value: "1", label: "Tier 1" },
      { value: "2", label: "Tier 2" },
      { value: "3", label: "Tier 3" },
    ]},
    { id: "q", label: "Search", type: "search", placeholder: "Search district…" },
  ]);
  const { data, loading, error, refetch } = useAsync(() => api.districts().then(r => r.data), []);
  const [selected, setSelected] = useState<string[]>(["pune", "mumbai", "nashik"]);

  const list = (data?.insights ?? []).filter(i => {
    const d = districts.find(x => x.id === i.districtId);
    if (!d) return false;
    if (values.tier && values.tier !== "all" && String(d.tier) !== values.tier) return false;
    if (values.q && !d.name.toLowerCase().includes(values.q.toLowerCase())) return false;
    return true;
  });

  const comparison = useMemo(() => selected.map(id => data?.insights.find(i => i.districtId === id)).filter(Boolean), [selected, data]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="District Planning"
        description="Where the action is — district intelligence, planning priorities and action plans for evidence-based decisions."
        demo
        meta={<DataFreshnessStrip label="District view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline" leadingIcon={<Sparkles className="size-3.5" />} onClick={() => pushToast({ tone: "info", title: "Plan generation queued", description: "12-month horizon across 15 districts." })}>Generate state plan</Button>
            <Button>Compare districts</Button>
          </>
        }
      />

      <FilterBar
        filters={[
          { id: "tier", label: "Tier", type: "segmented", defaultValue: "all", options: [
            { value: "all", label: "All" },
            { value: "1", label: "Tier 1" },
            { value: "2", label: "Tier 2" },
            { value: "3", label: "Tier 3" },
          ]},
          { id: "q", label: "Search", type: "search", placeholder: "Search district…" },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(v => v && v !== "all").length}
      />

      {error && <ErrorState title="District data could not be loaded" description={error} onRetry={refetch} />}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card title={<span className="inline-flex items-center gap-2"><MapIcon className="size-3.5 text-ink-tertiary" /> Maharashtra district map</span>} description="15 districts · priority-coded." className="xl:col-span-2">
          <MaharashtraMap selected={selected} onToggle={(id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])} />
        </Card>

        <Card title="Top districts by priority">
          {loading ? <Skeleton className="h-48" /> : (
            <ul className="space-y-2.5">
              {list.slice().sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6).map(i => {
                const d = findDistrict(i.districtId);
                if (!d) return null;
                return (
                  <li key={i.districtId}>
                    <Link to={`/district-planning/${i.districtId}`} className="block p-2.5 rounded-md border border-border-subtle hover:bg-neutral-50">
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] text-ink-primary font-medium">{d.name}</span>
                        <Badge tone={i.priorityScore >= 70 ? "danger" : i.priorityScore >= 50 ? "warning" : "neutral"} variant="soft">P{i.priorityScore}</Badge>
                      </div>
                      <div className="mt-1.5"><ProgressBar value={i.priorityScore} tone={i.priorityScore >= 70 ? "danger" : i.priorityScore >= 50 ? "warning" : "primary"} /></div>
                      <div className="text-[10.5px] text-ink-tertiary mt-1">{i.topSectors.slice(0,2).join(" · ")}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <Card title="Districts" description="Click a district to open its intelligence." padding="none">
        {loading ? <div className="p-6"><Skeleton className="h-48" /></div> : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-3">
            {list.map(i => {
              const d = findDistrict(i.districtId);
              if (!d) return null;
              return (
                <li key={i.districtId}>
                  <Link to={`/district-planning/${i.districtId}`} className="block p-3 rounded-md border border-border-subtle hover:border-border-default hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink-primary">{d.name}</span>
                      <Badge tone="neutral" variant="soft">Tier {d.tier}</Badge>
                    </div>
                    <div className="text-[10.5px] text-ink-tertiary mt-0.5">Pop. {d.population_lakhs}L · {d.tier === 1 ? "Metro" : d.tier === 2 ? "Regional" : "Emerging"}</div>
                    <div className="mt-2"><ProgressBar value={i.priorityScore} tone={i.priorityScore >= 70 ? "danger" : i.priorityScore >= 50 ? "warning" : "primary"} /></div>
                    <div className="mt-1 text-[10.5px] text-ink-tertiary flex items-center justify-between">
                      <span>Priority</span><span className="font-medium text-ink-primary">{i.priorityScore}/100</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {selected.length > 0 && (
        <Card title={`Compare · ${selected.map(id => findDistrict(id)?.name).filter(Boolean).join(" vs ")}`} description="Side-by-side key indicators.">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11.5px] uppercase tracking-wider text-ink-tertiary">
                  <th className="px-3 py-2 font-semibold">Indicator</th>
                  {comparison.map((c: any) => <th key={c.districtId} className="px-3 py-2 font-semibold">{findDistrict(c.districtId)?.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <Row label="Priority score" cells={comparison.map((c: any) => c.priorityScore)} />
                <Row label="Employers" cells={comparison.map((c: any) => c.employerCount)} />
                <Row label="Training centres" cells={comparison.map((c: any) => c.trainingCentres)} />
                <Row label="Placement" cells={comparison.map((c: any) => `${c.placementRate}%`)} />
                <Row label="Top sector" cells={comparison.map((c: any) => c.topSectors[0])} />
                <Row label="Critical skills" cells={comparison.map((c: any) => String(c.criticalSkillIds.length))} />
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: any[] }) {
  return (
    <tr className="border-t border-border-subtle">
      <td className="px-3 py-2.5 text-ink-secondary text-[12.5px]">{label}</td>
      {cells.map((v, i) => <td key={i} className="px-3 py-2.5 text-ink-primary tabular">{v}</td>)}
    </tr>
  );
}

function MaharashtraMap({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  // Simple stylised regional map; dots positioned by district coordinates.
  const tierColor = (tier: number) => tier === 1 ? "var(--primary-500)" : tier === 2 ? "var(--info-500)" : "var(--neutral-400)";
  return (
    <div className="relative w-full h-[420px] bg-surface-sunken rounded-md overflow-hidden border border-border-subtle">
      <svg viewBox="0 0 500 380" className="absolute inset-0 w-full h-full">
        {/* outline (stylised — not geographically accurate) */}
        <path d="M105 150 Q145 110 220 100 Q295 90 360 100 Q420 110 430 160 Q440 220 410 280 Q380 340 290 350 Q200 360 140 320 Q90 280 95 220 Z"
              fill="none" stroke="var(--border-default)" strokeWidth="1" strokeDasharray="3 3" />
        {/* districts as dots */}
        {districts.map(d => {
          const isSelected = selected.includes(d.id);
          return (
            <g key={d.id} onClick={() => onToggle(d.id)} className="cursor-pointer">
              <circle
                cx={d.x} cy={d.y} r={isSelected ? 12 : 7}
                fill={tierColor(d.tier)}
                fillOpacity={isSelected ? 0.95 : 0.45}
                stroke="white" strokeWidth="2"
              />
              <text x={d.x} y={d.y - 14} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">
                {d.name}
              </text>
            </g>
          );
        })}
        {/* labels */}
        <g>
          <text x="240" y="135" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">North Maharashtra</text>
          <text x="240" y="265" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">Western Maharashtra</text>
          <text x="320" y="285" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">Marathwada</text>
          <text x="350" y="200" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">Vidarbha</text>
        </g>
      </svg>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 text-[11px] text-ink-tertiary">
        <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-sm rounded-md px-2 py-1 border border-border-subtle">
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--primary-500)" }} /> Tier 1</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--info-500)" }} /> Tier 2</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "var(--neutral-400)" }} /> Tier 3</span>
        </div>
        <div className="bg-surface/80 backdrop-blur-sm rounded-md px-2 py-1 border border-border-subtle">Click a district to select for comparison</div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { Card } from "../../components/ui/Card";

import { Skeleton, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness, skillMatrix } from "../../data/mock/series";
import { HeatCell } from "../../components/charts";
import type { JobRole, Skill, Proficiency } from "../../types/domain";

const PROFICIENCY_ORDER: Record<Proficiency, number> = { "None": 0, "Basic": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 };
const PROFICIENCY_LABEL: Record<Proficiency, string> = { "None": "None", "Basic": "Basic", "Intermediate": "Inter.", "Advanced": "Adv.", "Expert": "Expert" };

export default function SkillMatrixPage() {
  const { values, set, reset } = useFilters([
    { id: "sector", label: "Sector", type: "select", options: [
      { value: "Automotive & EV", label: "Automotive & EV" },
      { value: "IT & Software", label: "IT & Software" },
      { value: "Manufacturing", label: "Manufacturing" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Renewable Energy", label: "Renewable Energy" },
    ]},
    { id: "level", label: "Skill level", type: "segmented", defaultValue: "all", options: [
      { value: "all", label: "All" },
      { value: "foundational", label: "Foundational" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ]},
  ]);
  const { data, loading, error, refetch } = useAsync(() => api.skillMatrix().then(r => r.data), []);
  const [activeCell, setActiveCell] = useState<{ roleId: string; skillId: string } | null>(null);

  const matrix = data?.matrix ?? skillMatrix;
  const roles = data?.roles ?? [];
  const skills = data?.skills ?? [];

  const allSkillIds = useMemo(() => {
    const s = new Set<string>();
    matrix.forEach((m: any) => Object.keys(m.cell).forEach(k => s.add(k)));
    return Array.from(s);
  }, [matrix]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Skill Gap Matrix"
        description="Where the missing is — interactive role × skill view of skill-gap severity."
        demo
        meta={<DataFreshnessStrip label="Matrix view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
      />

      <FilterBar
        filters={[
          { id: "sector", label: "Sector", type: "select", options: [
            { value: "Automotive & EV", label: "Automotive & EV" },
            { value: "IT & Software", label: "IT & Software" },
            { value: "Manufacturing", label: "Manufacturing" },
            { value: "Healthcare", label: "Healthcare" },
            { value: "Renewable Energy", label: "Renewable Energy" },
          ]},
          { id: "level", label: "Skill level", type: "segmented", defaultValue: "all", options: [
            { value: "all", label: "All" },
            { value: "foundational", label: "Foundational" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]},
          { id: "district", label: "District", type: "select", defaultValue: "pune", options: [
            { value: "pune", label: "Pune" },
            { value: "mumbai", label: "Mumbai" },
            { value: "nashik", label: "Nashik" },
            { value: "nagpur", label: "Nagpur" },
          ]},
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(v => v && v !== "all").length}
      />

      {error && <ErrorState title="Matrix could not be loaded" description={error} onRetry={refetch} />}

      <Card padding="none">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-ink-primary">Role × Skill gap severity</div>
            <div className="text-xs text-ink-tertiary">Click a cell to drill in. Severity scale 0–100 (higher = larger gap).</div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-ink-tertiary">
            <Legend tone="success" label="Low" />
            <Legend tone="info" label="Mod." />
            <Legend tone="warning" label="High" />
            <Legend tone="danger" label="Crit." />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? <div className="p-6"><Skeleton className="h-72" /></div> : (
            <table className="text-sm min-w-full">
              <thead>
                <tr className="bg-surface-sunken">
                  <th className="text-left px-3 py-2 text-[11.5px] font-semibold uppercase tracking-wider text-ink-tertiary sticky left-0 bg-surface-sunken z-sticky">Role</th>
                  {allSkillIds.map(sid => {
                    const s = skills.find((x: Skill) => x.id === sid);
                    return (
                      <th key={sid} className="px-2 py-2 text-[11px] font-medium text-ink-tertiary text-left whitespace-nowrap">
                        <div className="text-ink-primary">{s?.name ?? sid}</div>
                        <div className="text-[10px] text-ink-muted">{s?.category}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {matrix.map((m: any) => {
                  const role = roles.find((r: JobRole) => r.id === m.roleId);
                  if (!role) return null;
                  return (
                    <tr key={m.roleId} className="border-t border-border-subtle">
                      <th scope="row" className="text-left px-3 py-2 text-[12.5px] font-medium text-ink-primary sticky left-0 bg-surface z-sticky whitespace-nowrap">
                        <Link to={`/labour-market/${role.id}`} className="hover:text-primary-600">{role.title}</Link>
                        <div className="text-[10px] text-ink-tertiary font-normal">{role.sector}</div>
                      </th>
                      {allSkillIds.map(sid => {
                        const score = m.cell[sid];
                        if (score == null) {
                          return <td key={sid} className="px-2 py-2 text-center text-ink-muted text-[11px]">—</td>;
                        }
                        return (
                          <td key={sid} className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => setActiveCell({ roleId: m.roleId, skillId: sid })}
                              className="w-full"
                              aria-label={`${role.title} × ${skills.find((x: Skill) => x.id === sid)?.name}: severity ${score}`}
                            >
                              <HeatCell score={score} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {activeCell && (
        <CellExplainer cell={activeCell} onClose={() => setActiveCell(null)} />
      )}
    </div>
  );
}

function Legend({ tone, label }: { tone: "success" | "info" | "warning" | "danger"; label: string }) {
  const map = { success: "bg-success-50 text-success-700 border-success-100", info: "bg-info-50 text-info-700 border-info-100", warning: "bg-warning-50 text-warning-700 border-warning-100", danger: "bg-danger-50 text-danger-700 border-danger-100" };
  return <span className={`inline-flex items-center h-5 px-1.5 rounded-pill border text-[10.5px] font-medium ${map[tone]}`}>{label}</span>;
}

import { Drawer } from "../../components/ui/Drawer";
import { Button } from "../../components/ui/Button";
import { findRole } from "../../data/mock/jobRoles";
import { findSkill } from "../../data/mock/skills";

function CellExplainer({ cell, onClose }: { cell: { roleId: string; skillId: string }; onClose: () => void }) {
  const role = findRole(cell.roleId);
  const skill = findSkill(cell.skillId);
  if (!role || !skill) return null;
  return (
    <Drawer
      open={true}
      onClose={onClose}
      title={`${role.title} × ${skill.name}`}
      description="Skill gap detail"
      size="md"
      footer={<>
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Link to={`/labour-market/${role.id}`}><Button>Open role</Button></Link>
        <Link to={`/skills/${skill.id}`}><Button variant="subtle">Open skill</Button></Link>
      </>}
    >
      <div className="space-y-3 text-[13px] text-ink-secondary">
        <p>Severity for this combination is computed from employer demand, training supply, required proficiency, and current cohort proficiency.</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border-subtle p-2.5">
            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary">Required proficiency</div>
            <div className="text-sm font-semibold text-ink-primary">Advanced</div>
          </div>
          <div className="rounded-md border border-border-subtle p-2.5">
            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary">Current supply</div>
            <div className="text-sm font-semibold text-ink-primary">Intermediate</div>
          </div>
          <div className="rounded-md border border-border-subtle p-2.5">
            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary">Employers citing gap</div>
            <div className="text-sm font-semibold text-ink-primary">12</div>
          </div>
          <div className="rounded-md border border-border-subtle p-2.5">
            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary">Confidence</div>
            <div className="text-sm font-semibold text-ink-primary">High</div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

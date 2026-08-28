import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {ArrowLeft, Wrench, GraduationCap, FileText} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card, CardRow } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Skeleton, ErrorState, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { findRole } from "../../data/mock/jobRoles";
import { findSkill } from "../../data/mock/skills";
import { Button } from "../../components/ui/Button";

export default function EmployerDetailPage() {
  const { employerId = "" } = useParams();
  const { data, loading, error, refetch } = useAsync(() => api.employerDetails(employerId).then(r => r.data), [employerId]);
  const [tab, setTab] = useState<"requirements" | "feedback" | "validation">("requirements");

  if (loading) return <div className="space-y-3"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (error || !data) return <ErrorState title="Employer not found" description={error ?? "We couldn't find this employer."} onRetry={refetch} action={<Link className="text-primary-600 text-xs hover:underline" to="/employers">Back to employers</Link>} />;

  const { employer, requirements } = data as any;
  const validatedCount = requirements.filter((r: any) => r.status === "Validated").length;
  const pendingCount = requirements.filter((r: any) => r.status === "Pending").length;
  const needsReview = requirements.filter((r: any) => r.status === "Needs Review").length;
  const rejected = requirements.filter((r: any) => r.status === "Rejected").length;

  return (
    <div className="space-y-5">
      <Link to="/employers" className="text-[12px] text-ink-tertiary hover:text-ink-primary inline-flex items-center gap-1"><ArrowLeft className="size-3" /> Employers</Link>

      <PageHeader
        title={employer.name}
        description={`${employer.sector} · ${employer.size} · ${findRole as any ? "" : ""}${employer.contact.name} (${employer.contact.designation})`}
        demo
        meta={<DataFreshnessStrip label="Employer view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline" leadingIcon={<FileText className="size-3.5" />}>Export</Button>
            <Button>Add to outreach</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi label="Hiring / yr" value={employer.hiringVolumeAnnual.toLocaleString("en-IN")} />
        <Kpi label="Validated roles" value={String(employer.validatedRoles)} tone="success" />
        <Kpi label="Survey participation" value={`${employer.surveyParticipation}%`} tone={employer.surveyParticipation >= 80 ? "success" : "warning"} />
        <Kpi label="Satisfaction" value={`${employer.satisfaction}%`} tone={employer.satisfaction >= 80 ? "success" : "warning"} />
        <Kpi label="Last updated" value={employer.lastUpdated} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-3 min-w-0">
          <div className="border-b border-border-subtle flex items-center gap-1 -mb-px">
            {(["requirements","feedback","validation"] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={["px-3 h-9 text-sm border-b-2 transition-colors capitalize", tab === t ? "border-primary-500 text-primary-700 font-semibold" : "border-transparent text-ink-tertiary hover:text-ink-primary"].join(" ")}>
                {t}
              </button>
            ))}
          </div>

          {tab === "requirements" && (
            <Card title="Validated requirements" description="Job roles, skills and proficiency levels expected from this employer." padding="none">
              {requirements.length === 0 ? <EmptyState title="No requirements yet" description="This employer has not submitted requirements." /> : (
                <ul className="divide-y divide-border-subtle">
                  {requirements.map((r: any) => {
                    const role = findRole(r.roleId);
                    return (
                      <li key={r.id} className="p-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="min-w-0">
                            <Link to={role ? `/labour-market/${role.id}` : "#"} className="text-sm font-semibold text-ink-primary hover:text-primary-600">{role?.title ?? r.roleId}</Link>
                            <div className="text-[11px] text-ink-tertiary">Submitted {r.submittedAt} {r.validatedAt ? `· Validated ${r.validatedAt}` : ""}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <StatusBadge status={r.status} />
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1.5">Required skills</div>
                            <ul className="space-y-1 text-[12.5px] text-ink-secondary">
                              {r.requiredSkills.map((k: any) => {
                                const s = findSkill(k.skillId);
                                return (
                                  <li key={k.skillId} className="flex items-center gap-1.5">
                                    <span className={["size-1.5 rounded-full", k.critical ? "bg-danger-500" : "bg-ink-tertiary"].join(" ")} aria-hidden="true" />
                                    <span>{s?.name ?? k.skillId}</span>
                                    <span className="ml-auto text-ink-tertiary">{k.proficiency}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1.5">Equipment & certifications</div>
                            <ul className="space-y-1 text-[12.5px] text-ink-secondary">
                              {r.equipment.map((e: string) => <li key={e}>· {e}</li>)}
                            </ul>
                            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mt-2 mb-1.5">Certifications</div>
                            <div className="flex flex-wrap gap-1.5">
                              {r.certificationsPreferred.map((c: string) => <Badge key={c} tone="info" variant="soft">{c}</Badge>)}
                            </div>
                          </div>
                        </div>
                        {r.notes && <div className="mt-2 text-[12px] text-ink-secondary bg-neutral-50 border border-border-subtle rounded-md p-2">{r.notes}</div>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          )}

          {tab === "feedback" && (
            <Card title="Employer feedback" description="Open qualitative feedback for the platform.">
              <ul className="space-y-2">
                {[
                  { id: 1, text: "Curriculum refresh on CAN-bus is overdue. We've said this three times.", date: "2026-08-12" },
                  { id: 2, text: "Equipment score at Pune is now 72/100 — adequate but not strong.", date: "2026-08-08" },
                  { id: 3, text: "Happy with placement; would like 1-week OEM internship pre-hire.", date: "2026-07-26" },
                ].map(f => (
                  <li key={f.id} className="rounded-md border border-border-subtle p-2.5">
                    <div className="text-[12.5px] text-ink-primary">{f.text}</div>
                    <div className="text-[11px] text-ink-tertiary mt-1">{f.date}</div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {tab === "validation" && (
            <Card title="Validation history" description="How requirements have moved through validation.">
              <ul className="space-y-2">
                {requirements.map((r: any) => (
                  <li key={r.id} className="rounded-md border border-border-subtle p-2.5 flex items-center gap-2">
                    <div className="text-[12.5px] text-ink-primary flex-1">{r.roleId}</div>
                    <StatusBadge status={r.status} />
                    <div className="text-[11px] text-ink-tertiary w-24 text-right">{r.submittedAt}</div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <aside className="space-y-3">
          <Card title="Summary">
            <CardRow label="Status" value={employer.surveyParticipation >= 80 ? <Badge tone="success" variant="soft">Active</Badge> : <Badge tone="warning" variant="soft">In onboarding</Badge>} />
            <CardRow label="Hiring / yr" value={employer.hiringVolumeAnnual.toLocaleString("en-IN")} />
            <CardRow label="Validated roles" value={String(employer.validatedRoles)} />
            <CardRow label="Satisfaction" value={`${employer.satisfaction}%`} />
            <CardRow label="Contact" value={employer.contact.name} />
            <CardRow label="Designation" value={employer.contact.designation} />
          </Card>
          <Card title={<span className="inline-flex items-center gap-2"><Wrench className="size-3.5 text-ink-tertiary" /> Equipment expectations</span>}>
            <ul className="space-y-1.5 text-[12.5px] text-ink-secondary">
              <li>· OEM-aligned tooling (Hi-pot, diagnostic)</li>
              <li>· Live service-bay access for internships</li>
              <li>· EV lab with CCS2 charger</li>
            </ul>
          </Card>
          <Card title={<span className="inline-flex items-center gap-2"><GraduationCap className="size-3.5 text-ink-tertiary" /> Trainer expectations</span>}>
            <ul className="space-y-1.5 text-[12.5px] text-ink-secondary">
              <li>· OEM certification preferred</li>
              <li>· 3+ years industry experience</li>
              <li>· Live industry project exposure</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" | "danger" }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
      <div className="text-[11px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className={["text-2xl font-semibold mt-1 tabular", tone === "success" ? "text-success-600" : tone === "warning" ? "text-warning-600" : tone === "danger" ? "text-danger-600" : "text-ink-primary"].join(" ")}>{value}</div>
    </div>
  );
}

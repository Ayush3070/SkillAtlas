import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {ArrowLeft, FileText, Sparkles, Wrench, GraduationCap} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Donut, ProgressBar } from "../../components/charts";
import { Card, CardRow } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Skeleton, ErrorState, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { findRole } from "../../data/mock/jobRoles";
import { findSkill } from "../../data/mock/skills";
import { findCentre } from "../../data/mock/trainingCentres";
import { Button } from "../../components/ui/Button";
import { pushToast } from "../../components/feedback/Toast";

const TONE = { covered: "success", partial: "warning", missing: "danger", obsolete: "danger" } as const;

export default function CourseDetailPage() {
  const { courseId = "" } = useParams();
  const { data, loading, error, refetch } = useAsync(() => api.courseDetails(courseId).then(r => r.data), [courseId]);
  const [tab, setTab] = useState<"overview" | "curriculum" | "placement" | "employers">("overview");

  if (loading) return <div className="space-y-3"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (error || !data) return <ErrorState title="Course not found" description={error ?? "We couldn't find this course."} onRetry={refetch} action={<Link className="text-primary-600 text-xs hover:underline" to="/courses">Back to courses</Link>} />;

  const { course, courseSkills: skills_, requirements } = data as any;
  const coveredCount = skills_.filter((c: any) => c.coverage === "covered").length;
  const partialCount = skills_.filter((c: any) => c.coverage === "partial").length;
  const missingCount = skills_.filter((c: any) => c.coverage === "missing").length;

  return (
    <div className="space-y-5">
      <Link to="/courses" className="text-[12px] text-ink-tertiary hover:text-ink-primary inline-flex items-center gap-1"><ArrowLeft className="size-3" /> Courses</Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5 min-w-0">
          <PageHeader
            title={course.name}
            description={course.description}
            demo
            tag={<StatusBadge status={course.status} />}
            meta={<DataFreshnessStrip label="Course view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
            controls={
              <>
                <Button variant="outline" leadingIcon={<FileText className="size-3.5" />}>Export PDF</Button>
                <Button leadingIcon={<Sparkles className="size-3.5" />} onClick={() => pushToast({ tone: "success", title: "Curriculum recommendation queued" })}>Generate recommendation</Button>
              </>
            }
          />

          <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Kpi label="Alignment score" value={`${course.alignmentScore}`} sub="0–100 scale" tone={course.alignmentScore >= 80 ? "success" : course.alignmentScore >= 60 ? "warning" : "danger"} />
            <Kpi label="Placement rate" value={`${course.placementRate}%`} tone={course.placementRate >= 80 ? "success" : course.placementRate >= 65 ? "warning" : "danger"} />
            <Kpi label="Capacity" value={String(course.capacity)} sub="seats" />
            <Kpi label="Enrolled" value={String(course.enrolled)} sub={`${Math.round((course.enrolled/course.capacity)*100)}% utilisation`} />
            <Kpi label="NSQF Level" value={`L${course.nsqfLevel}`} sub={`${course.durationWeeks} weeks`} />
          </section>

          <div className="border-b border-border-subtle flex items-center gap-1 -mb-px">
            {(["overview","curriculum","placement","employers"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={["px-3 h-9 text-sm border-b-2 transition-colors capitalize", tab === t ? "border-primary-500 text-primary-700 font-semibold" : "border-transparent text-ink-tertiary hover:text-ink-primary"].join(" ")}
                role="tab"
                aria-selected={tab === t}
              >{t}</button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Card title="Skill coverage" description="Breakdown of curriculum skills.">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <CoverageStat label="Covered" value={coveredCount} tone="success" />
                  <CoverageStat label="Partial" value={partialCount} tone="warning" />
                  <CoverageStat label="Missing" value={missingCount} tone="danger" />
                </div>
                <div className="mt-3">
                  <ProgressBar value={(coveredCount / Math.max(1, skills_.length)) * 100} tone="success" />
                </div>
                <div className="text-[11px] text-ink-tertiary mt-1.5">{coveredCount} of {skills_.length} skills fully covered.</div>
              </Card>

              <Card title="Industry demand" description="Top job roles that hire this course.">
                {course.primaryRoleIds.length === 0 ? <EmptyState title="No primary roles" description="This course does not yet map to any job role." /> : (
                  <ul className="space-y-1.5">
                    {course.primaryRoleIds.slice(0, 4).map((id: string) => {
                      const r = findRole(id);
                      if (!r) return null;
                      return (
                        <li key={id}>
                          <Link to={`/labour-market/${r.id}`} className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle hover:bg-neutral-50">
                            <div className="size-7 grid place-items-center rounded-md bg-primary-50 text-primary-700 text-[10.5px] font-semibold">{r.title.split(" ").slice(0,2).map(w => w[0]).join("")}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12.5px] text-ink-primary font-medium truncate">{r.title}</div>
                              <div className="text-[10.5px] text-ink-tertiary">{r.monthlyOpenings.toLocaleString("en-IN")} openings / mo</div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>

              <Card title="Training centres" description="Where this course is offered.">
                <ul className="space-y-1.5">
                  {course.trainingCentreIds.map((id: string) => {
                    const c = findCentre(id);
                    if (!c) return null;
                    return (
                      <li key={id} className="flex items-center gap-2.5 p-2 rounded-md border border-border-subtle">
                        <div className="size-7 grid place-items-center rounded-md bg-neutral-100 text-ink-tertiary text-[10.5px] font-semibold">{c.name.split(" ").slice(0,2).map(w => w[0]).join("")}</div>
                        <div className="min-w-0">
                          <div className="text-[12.5px] text-ink-primary truncate">{c.name}</div>
                          <div className="text-[10.5px] text-ink-tertiary">{c.districtId} · {c.utilization}% util.</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>
          )}

          {tab === "curriculum" && (
            <Card title={<span className="inline-flex items-center gap-2"><GraduationCap className="size-3.5 text-ink-tertiary" /> Curriculum vs industry requirement</span>} description="Each skill's coverage and required proficiency.">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11.5px] uppercase tracking-wider text-ink-tertiary">
                    <th className="px-3 py-2 font-semibold">Skill</th>
                    <th className="px-3 py-2 font-semibold">Coverage</th>
                    <th className="px-3 py-2 font-semibold text-right">Hours</th>
                    <th className="px-3 py-2 font-semibold text-right">Practical</th>
                    <th className="px-3 py-2 font-semibold">Industry requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {skills_.map((cs: any) => {
                    const s = findSkill(cs.skillId);
                    if (!s) return null;
                    return (
                      <tr key={cs.skillId} className="border-t border-border-subtle">
                        <td className="px-3 py-2.5">
                          <Link to={`/skills/${cs.skillId}`} className="text-ink-primary font-medium hover:text-primary-600">{s.name}</Link>
                          <div className="text-[10.5px] text-ink-tertiary">{s.category}</div>
                        </td>
                        <td className="px-3 py-2.5"><CoverageBadge coverage={cs.coverage} /></td>
                        <td className="px-3 py-2.5 text-right tabular">{cs.hours}</td>
                        <td className="px-3 py-2.5 text-right tabular">{cs.practicalHours}</td>
                        <td className="px-3 py-2.5 text-ink-secondary text-[12.5px]">Advanced</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {requirements.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-tertiary mb-2">Recommended curriculum changes</div>
                  <ul className="space-y-2">
                    {requirements.map((r: any) => {
                      const s = findSkill(r.skillId);
                      if (!s) return null;
                      return (
                        <li key={r.id} className="rounded-md border border-border-subtle bg-surface-sunken p-2.5">
                          <div className="flex items-center gap-2">
                            <Badge tone={r.expectedImpact === "High" ? "danger" : r.expectedImpact === "Medium" ? "warning" : "info"} variant="soft">Impact: {r.expectedImpact}</Badge>
                            <span className="text-[12.5px] text-ink-primary font-medium">{s.name}</span>
                            <span className="ml-auto text-[11px] text-ink-tertiary">{r.employerBacking} employer signals</span>
                          </div>
                          <div className="text-[12px] text-ink-secondary mt-1">{r.recommendedAction} · Required: <span className="font-medium">{r.requiredLevel}</span> · Current: <span className="font-medium">{r.currentLevel}</span></div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {tab === "placement" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card title="Placement rate trend" description="Last 6 cohorts.">
                <div className="space-y-2">
                  {["Cohort Jan","Cohort Mar","Cohort May","Cohort Jul","Cohort Sep","Cohort Nov"].map((c, i) => (
                    <div key={c} className="flex items-center gap-2">
                      <div className="w-20 text-[12px] text-ink-tertiary">{c}</div>
                      <div className="flex-1"><ProgressBar value={course.placementRate - 4 + (i % 3) * 2} tone={course.placementRate >= 80 ? "success" : "warning"} /></div>
                      <div className="w-10 text-right text-[12px] tabular">{Math.round(course.placementRate - 4 + (i % 3) * 2)}%</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Sector distribution" description="Where placed candidates go.">
                <Donut
                  data={[
                    { name: "Automotive & EV", value: 38, color: "var(--chart-1)" },
                    { name: "Manufacturing", value: 22, color: "var(--chart-2)" },
                    { name: "Energy", value: 18, color: "var(--chart-5)" },
                    { name: "Other", value: 22, color: "var(--chart-7)" },
                  ]}
                  centerLabel={{ primary: `${course.placementRate}%`, secondary: "placement" }}
                />
              </Card>
            </div>
          )}

          {tab === "employers" && (
            <Card title="Employer feedback" description="Validated requirements and feedback on this course.">
              <ul className="space-y-2">
                {[
                  { id: "emp-tata-motors", rating: 4, comment: "Solid foundation; CAN-bus needs expansion." },
                  { id: "emp-bosch-india", rating: 5, comment: "Strong shop-floor preparation." },
                  { id: "emp-infosys", rating: 4, comment: "Add GenAI basics to stay current." },
                ].map(f => (
                  <li key={f.id} className="rounded-md border border-border-subtle p-2.5">
                    <div className="flex items-center gap-2">
                      <div className="size-7 grid place-items-center rounded-md bg-neutral-100 text-ink-tertiary text-[10.5px] font-semibold">{f.id.split("-").slice(1).map(w => w[0]).join("")}</div>
                      <div className="text-[12.5px] text-ink-primary font-medium">{f.id.replace("emp-","").replace(/-/g," ")}</div>
                      <div className="ml-auto text-[11px] text-ink-tertiary">Rating: {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</div>
                    </div>
                    <p className="text-[12.5px] text-ink-secondary mt-1.5">{f.comment}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <aside className="space-y-3">
          <Card title="Summary">
            <CardRow label="Status" value={<StatusBadge status={course.status} />} />
            <CardRow label="Sector" value={course.sector} />
            <CardRow label="NSQF Level" value={`L${course.nsqfLevel}`} />
            <CardRow label="Duration" value={`${course.durationWeeks} weeks`} />
            <CardRow label="Centres" value={String(course.trainingCentreIds.length)} />
            <CardRow label="Last updated" value="2026-08-20" />
          </Card>
          <Card title={<span className="inline-flex items-center gap-2"><Wrench className="size-3.5 text-ink-tertiary" /> Equipment & trainer requirements</span>}>
            <ul className="space-y-1.5 text-[12.5px] text-ink-secondary">
              <li>· Insulated tools (1000V)</li>
              <li>· Diagnostic tablets (OEM)</li>
              <li>· Hi-pot tester</li>
              <li>· Trainer: 3+ yrs OEM experience</li>
              <li>· 1 trainer per 30 students</li>
            </ul>
          </Card>
        </aside>
      </div>
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

function CoverageStat({ label, value, tone }: { label: string; value: number; tone: "success" | "warning" | "danger" }) {
  return (
    <div className={["rounded-md border p-2", tone === "success" ? "bg-success-50/40 border-success-100" : tone === "warning" ? "bg-warning-50/40 border-warning-100" : "bg-danger-50/40 border-danger-100"].join(" ")}>
      <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className={["text-lg font-semibold tabular", tone === "success" ? "text-success-700" : tone === "warning" ? "text-warning-700" : "text-danger-700"].join(" ")}>{value}</div>
    </div>
  );
}

function CoverageBadge({ coverage }: { coverage: "covered" | "partial" | "missing" | "obsolete" }) {
  const map: any = {
    covered:  { tone: "success", label: "Covered" },
    partial:  { tone: "warning", label: "Partial" },
    missing:  { tone: "danger",  label: "Missing" },
    obsolete: { tone: "danger",  label: "Obsolete" } };
  const c = map[coverage];
  return <Badge tone={c.tone} variant="soft">{c.label}</Badge>;
}

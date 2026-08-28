import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CircleCheck, Sparkles, Loader2, BookOpen, FileText } from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Skeleton, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { findSkill } from "../../data/mock/skills";

import { Button } from "../../components/ui/Button";
import { pushToast } from "../../components/feedback/Toast";

type Stage = "collecting" | "mapping" | "comparing" | "validating" | "calculating" | "preparing" | "done";

const STAGES: { id: Stage; label: string }[] = [
  { id: "collecting", label: "Collecting industry signals" },
  { id: "mapping", label: "Mapping job roles" },
  { id: "comparing", label: "Comparing skill requirements" },
  { id: "validating", label: "Checking employer validation" },
  { id: "calculating", label: "Calculating gap" },
  { id: "preparing", label: "Preparing recommendation" },
];

export default function CurriculumDetailPage() {
  const { courseId = "" } = useParams();
  const { data, loading, error, refetch } = useAsync(() => api.curriculumDetails(courseId).then(r => r.data), [courseId]);

  // simulation
  const [stage, setStage] = useState<Stage | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => { setStage(null); setProgress(0); }, [courseId]);

  function startAnalysis() {
    setStage("collecting");
    setProgress(0);
    let i = 0;
    const total = STAGES.length;
    const tick = () => {
      i += 1;
      setProgress(Math.min(100, (i / total) * 100));
      if (i < total) {
        setStage(STAGES[i].id);
        setTimeout(tick, 700 + Math.random() * 400);
      } else {
        setStage("done");
        pushToast({ tone: "success", title: "Curriculum recommendation generated", description: "3 changes queued for review." });
      }
    };
    setTimeout(tick, 400);
  }

  if (loading) return <div className="space-y-3"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (error || !data) return <ErrorState title="Course not found" description={error ?? "We couldn't find this course."} onRetry={refetch} action={<Link className="text-primary-600 text-xs hover:underline" to="/curriculum">Back to curriculum</Link>} />;

  const { course, courseSkills: skills_, requirements } = data as any;

  return (
    <div className="space-y-5">
      <Link to="/curriculum" className="text-[12px] text-ink-tertiary hover:text-ink-primary inline-flex items-center gap-1"><ArrowLeft className="size-3" /> Curriculum</Link>

      <PageHeader
        title={course.name}
        description="Compare current curriculum against industry requirement and generate recommendations."
        demo
        tag={<StatusBadge status={course.status} />}
        meta={<DataFreshnessStrip label="Course view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <>
            <Button variant="outline" leadingIcon={<FileText className="size-3.5" />}>Export comparison</Button>
            <Button leadingIcon={<Sparkles className="size-3.5" />} onClick={startAnalysis} loading={stage !== null && stage !== "done"}>Create curriculum recommendation</Button>
          </>
        }
      />

      {/* Comparison: current vs required */}
      <Card
        title={<span className="inline-flex items-center gap-2"><BookOpen className="size-3.5 text-ink-tertiary" /> Curriculum vs industry requirement</span>}
        description="Skill-level comparison with current coverage and required proficiency."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-wider text-ink-tertiary">
                <th className="px-3 py-2 font-semibold">Skill</th>
                <th className="px-3 py-2 font-semibold">Current level</th>
                <th className="px-3 py-2 font-semibold">Required level</th>
                <th className="px-3 py-2 font-semibold">Gap</th>
                <th className="px-3 py-2 font-semibold">Action</th>
                <th className="px-3 py-2 font-semibold text-right">Employer signals</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...skills_.map((cs: any) => {
                  const s = findSkill(cs.skillId);
                  if (!s) return null;
                  if (cs.coverage === "covered" && cs.hours >= 30) {
                    return { skillId: cs.skillId, name: s.name, current: "Advanced", required: "Advanced", gap: "Aligned", action: "No action", emp: 0 };
                  }
                  if (cs.coverage === "covered") {
                    return { skillId: cs.skillId, name: s.name, current: "Intermediate", required: "Advanced", gap: "High", action: "Upgrade module", emp: 4 };
                  }
                  if (cs.coverage === "partial") {
                    return { skillId: cs.skillId, name: s.name, current: "Basic", required: "Advanced", gap: "Critical", action: "Expand practical training", emp: 6 };
                  }
                  return { skillId: cs.skillId, name: s.name, current: "None", required: "Intermediate", gap: "Critical", action: "Add module", emp: 8 };
                }).filter(Boolean),
                ...requirements.map((r: any) => {
                  const s = findSkill(r.skillId);
                  if (!s) return null;
                  return { skillId: r.skillId, name: s.name, current: r.currentLevel, required: r.requiredLevel, gap: r.expectedImpact, action: r.recommendedAction, emp: r.employerBacking, _reco: true };
                }),
              ].map((row: any, i: number) => {
                const gapTone = row.gap === "Critical" ? "danger" : row.gap === "High" ? "warning" : row.gap === "Aligned" ? "success" : "info";
                return (
                  <tr key={row.skillId + "-" + i} className="border-t border-border-subtle">
                    <td className="px-3 py-2.5">
                      <Link to={`/skills/${row.skillId}`} className="text-ink-primary font-medium hover:text-primary-600">{row.name}</Link>
                    </td>
                    <td className="px-3 py-2.5"><span className="text-ink-secondary">{row.current}</span></td>
                    <td className="px-3 py-2.5"><span className="text-ink-primary font-medium">{row.required}</span></td>
                    <td className="px-3 py-2.5"><Badge tone={gapTone} variant="soft">{row.gap}</Badge></td>
                    <td className="px-3 py-2.5 text-ink-secondary text-[12.5px]">{row.action}</td>
                    <td className="px-3 py-2.5 text-right tabular">{row.emp || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analysis / Result */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card title="Simulated analysis" description="Step-by-step pipeline producing this recommendation.">
          {stage === null && (
            <div className="text-[13px] text-ink-secondary">
              <p>Click <span className="font-medium text-ink-primary">Create curriculum recommendation</span> to run a real-time analysis against industry signals.</p>
              <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink-tertiary">
                {STAGES.map(s => <li key={s.id} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-neutral-300" /> {s.label}</li>)}
              </ul>
            </div>
          )}
          {stage !== null && stage !== "done" && (
            <div>
              <div className="flex items-center gap-2 text-[12.5px] text-ink-secondary mb-2">
                <Loader2 className="size-3.5 animate-spin text-primary-500" /> Running analysis…
              </div>
              <div className="h-1.5 rounded-pill bg-neutral-100 overflow-hidden">
                <div className="h-full bg-primary-500 transition-[width] duration-base" style={{ width: `${progress}%` }} />
              </div>
              <ul className="mt-3 space-y-1.5 text-[12.5px]">
                {STAGES.map(s => {
                  const done = STAGES.findIndex(x => x.id === stage) >= STAGES.findIndex(x => x.id === s.id);
                  return (
                    <li key={s.id} className={["flex items-center gap-2", done ? "text-ink-primary" : "text-ink-tertiary"].join(" ")}>
                      {done ? <CircleCheck className="size-3.5 text-success-600" /> : <span className="size-3.5 grid place-items-center"><span className="size-1.5 rounded-full bg-neutral-300" /></span>}
                      {s.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {stage === "done" && (
            <div>
              <div className="rounded-md border border-success-100 bg-success-50/40 p-3">
                <div className="flex items-center gap-2 text-[12.5px] text-success-700 font-semibold"><CircleCheck className="size-3.5" /> Analysis complete</div>
                <p className="text-[12.5px] text-ink-secondary mt-1">3 curriculum changes recommended. See right.</p>
              </div>
              <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink-tertiary">
                {STAGES.map(s => (
                  <li key={s.id} className="flex items-center gap-2"><CircleCheck className="size-3.5 text-success-600" /> {s.label}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card title="Recommended changes" description="Generated by the analysis pipeline." className="xl:col-span-2">
          {stage !== "done" ? (
            <div className="text-sm text-ink-tertiary">Run the analysis to see recommendations.</div>
          ) : (
            <ul className="space-y-2">
              {requirements.slice(0, 3).map((r: any, i: number) => {
                const s = findSkill(r.skillId);
                if (!s) return null;
                return (
                  <li key={r.id} className="rounded-md border border-border-subtle p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={r.expectedImpact === "High" ? "danger" : "warning"} variant="solid">P{i+1}</Badge>
                      <Badge tone="primary" variant="soft">Confidence 87%</Badge>
                      <span className="text-sm font-semibold text-ink-primary">Upgrade {s.name} module</span>
                      <span className="ml-auto text-[11px] text-ink-tertiary">Impact: {r.expectedImpact}</span>
                    </div>
                    <p className="text-[12.5px] text-ink-secondary mt-1.5">
                      Move {s.name} from <span className="font-medium">{r.currentLevel}</span> to <span className="font-medium">{r.requiredLevel}</span>. {r.employerBacking} employer signals support this change.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[12px]">
                      <Link to={`/skills/${r.skillId}`} className="text-primary-600 hover:underline">Open skill</Link>
                      <span className="text-ink-muted">·</span>
                      <button type="button" className="text-ink-tertiary hover:text-ink-primary" onClick={() => pushToast({ tone: "info", title: "Recommendation archived" })}>Archive</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

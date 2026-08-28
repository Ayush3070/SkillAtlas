import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, GraduationCap, CircleCheck } from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Skeleton, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { districts } from "../../data/mock/districts";
import { findRole } from "../../data/mock/jobRoles";
import { findSkill } from "../../data/mock/skills";
import { findCourse } from "../../data/mock/courses";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import { pushToast } from "../../components/feedback/Toast";
import type { Qualification, Sector } from "../../types/domain";

const QUALIFICATIONS: Qualification[] = ["10th Pass","12th Pass","ITI","Diploma","Graduate","Postgraduate"];
const SECTORS: Sector[] = ["Automotive & EV","Manufacturing","IT & Software","BFSI & FinTech","Healthcare","Construction & Real Estate","Retail & E-commerce","Logistics & Warehousing","Hospitality","Agriculture & Food Processing","Renewable Energy","Telecommunications"];

interface CareerRec {
  roleId: string;
  match: number;
  salary: number;
  demand: string;
  missingSkills: string[];
  pathway: { from: string; to: string; courseId: string; months: number }[];
}

export default function CandidateGuidancePage() {
  const { data, loading, error, refetch } = useAsync(() => api.candidates().then(r => r.data), []);
  const [qual, setQual] = useState<Qualification>("12th Pass");
  const [district, setDistrict] = useState("pune");
  const [interest, setInterest] = useState<Sector>("Automotive & EV");
  const [exp, setExp] = useState(0);
  const [skills, setSkills] = useState<string[]>(["sk-communication", "sk-digital-literacy"]);
  const [results, setResults] = useState<CareerRec[] | null>(null);
  const [calculating, setCalculating] = useState(false);

  function toggleSkill(id: string) {
    setSkills(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function recommend() {
    setCalculating(true);
    setResults(null);
    setTimeout(() => {
      const r: CareerRec[] = [
        { roleId: "rl-ev-technician", match: 86, salary: 28500, demand: "rising", missingSkills: ["sk-battery-diagnostics", "sk-can-bus", "sk-hv-safety"], pathway: [
          { from: "12th Pass", to: "EV Service Technician", courseId: "cr-ev-tech", months: 6 },
        ]},
        { roleId: "rl-ev-charging-tech", match: 78, salary: 24000, demand: "emerging", missingSkills: ["sk-charging-infra", "sk-charging-prot"], pathway: [
          { from: "12th Pass", to: "EV Charging Technician", courseId: "cr-charging-tech", months: 3 },
        ]},
        { roleId: "rl-solar-installer", match: 72, salary: 22500, demand: "rising", missingSkills: ["sk-solar-install", "sk-hv-safety"], pathway: [
          { from: "12th Pass", to: "Solar PV Installer", courseId: "cr-solar", months: 3 },
        ]},
      ];
      setResults(r);
      setCalculating(false);
      pushToast({ tone: "success", title: "Career recommendations ready", description: `${r.length} roles matched to your profile.` });
    }, 1100);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidate Guidance"
        description="Personalised career guidance grounded in real labour-market demand and validated employer requirements."
        demo
        meta={<DataFreshnessStrip label="Candidate view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
        <Card title="Your profile" description="Tell us about yourself to get recommendations.">
          <div className="space-y-3">
            <Select label="Highest qualification" value={qual} onChange={(e) => setQual(e.target.value as Qualification)} required>
              {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </Select>
            <div>
              <div className="text-xs font-medium text-ink-secondary mb-1.5">Years of experience: <span className="text-ink-primary font-semibold tabular">{exp}</span></div>
              <input type="range" min={0} max={15} value={exp} onChange={(e) => setExp(Number(e.target.value))} className="w-full accent-[var(--primary-500)]" aria-label="Years of experience" />
            </div>
            <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} required>
              {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select label="Preferred sector" value={interest} onChange={(e) => setInterest(e.target.value as Sector)} required>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <div>
              <div className="text-xs font-medium text-ink-secondary mb-1.5">Existing skills</div>
              <div className="flex flex-wrap gap-1.5">
                {["sk-communication","sk-digital-literacy","sk-customer-service","sk-teamwork","sk-problem-solving","sk-cnc","sk-welding","sk-python"].map(id => {
                  const sk = findSkill(id);
                  if (!sk) return null;
                  const active = skills.includes(id);
                  return (
                    <button key={id} type="button" onClick={() => toggleSkill(id)}
                      className={["h-6 px-2 rounded-pill text-[11px] border transition-colors", active ? "bg-primary-50 border-primary-100 text-primary-700" : "bg-surface border-border-subtle text-ink-secondary hover:bg-neutral-50"].join(" ")}>
                      {sk.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <Button fullWidth onClick={recommend} loading={calculating} leadingIcon={<Sparkles className="size-3.5" />}>Get career recommendations</Button>
          </div>
        </Card>

        <div className="space-y-3 min-w-0">
          {!results && !calculating && (
            <EmptyState
              icon={<GraduationCap className="size-4" />}
              title="Your personalised career matches will appear here"
              description="We will compare your profile against validated employer requirements, in-demand skills and available courses to recommend the strongest pathways."
            />
          )}
          {calculating && <Skeleton className="h-80" />}
          {results && (
            <ul className="space-y-3">
              {results.map((r, idx) => {
                const role = findRole(r.roleId);
                if (!role) return null;
                return (
                  <li key={r.roleId} className="bg-surface border border-border-subtle rounded-lg p-4 shadow-1">
                    <div className="flex items-start gap-3">
                      <div className="size-10 grid place-items-center rounded-md bg-primary-50 text-primary-700 text-[11px] font-semibold shrink-0">#{idx + 1}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link to={`/labour-market/${role.id}`} className="text-sm font-semibold text-ink-primary hover:text-primary-600">{role.title}</Link>
                          <Badge tone="primary" variant="soft">Match {r.match}%</Badge>
                          <Badge tone={r.demand === "emerging" ? "info" : r.demand === "rising" ? "success" : "neutral"} variant="soft">Demand: {r.demand}</Badge>
                        </div>
                        <div className="text-[12px] text-ink-tertiary mt-0.5">{role.sector} · {role.level} · {role.monthlyOpenings.toLocaleString("en-IN")} monthly openings</div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12.5px]">
                          <div className="rounded-md border border-border-subtle p-2.5">
                            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1">Salary</div>
                            <div className="text-base font-semibold text-ink-primary tabular">₹{(r.salary/1000).toFixed(0)}k</div>
                            <div className="text-[10.5px] text-ink-tertiary">per month</div>
                          </div>
                          <div className="rounded-md border border-border-subtle p-2.5">
                            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1">Missing skills</div>
                            <ul className="space-y-0.5 text-ink-secondary">
                              {r.missingSkills.map(id => {
                                const s = findSkill(id);
                                return <li key={id} className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-danger-500" /> {s?.name ?? id}</li>;
                              })}
                            </ul>
                          </div>
                          <div className="rounded-md border border-border-subtle p-2.5">
                            <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1">Why this career?</div>
                            <ul className="space-y-0.5 text-ink-secondary">
                              <li className="flex items-center gap-1.5"><CircleCheck className="size-3 text-success-600" /> +31% YoY demand</li>
                              <li className="flex items-center gap-1.5"><CircleCheck className="size-3 text-success-600" /> 18 employers validating</li>
                              <li className="flex items-center gap-1.5"><CircleCheck className="size-3 text-success-600" /> 78% placement</li>
                            </ul>
                          </div>
                        </div>

                        <div className="mt-3 rounded-md border border-primary-100 bg-primary-50/40 p-3">
                          <div className="text-[10.5px] uppercase tracking-wider text-primary-700 font-semibold mb-1.5">Pathway</div>
                          <ol className="space-y-1.5">
                            {r.pathway.map((p, i) => {
                              const c = findCourse(p.courseId);
                              return (
                                <li key={i} className="flex items-center gap-2 text-[12.5px] text-ink-primary">
                                  <span className="size-5 grid place-items-center rounded-full bg-primary-500 text-white text-[10px] font-semibold">{i + 1}</span>
                                  <span>{p.from}</span>
                                  <ArrowRight className="size-3 text-ink-tertiary" />
                                  <Link to={`/courses/${c?.id}`} className="text-primary-600 hover:underline">{c?.name ?? p.courseId}</Link>
                                  <span className="ml-auto text-ink-tertiary">{p.months} mo</span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

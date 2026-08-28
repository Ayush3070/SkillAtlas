import { Card } from "../../components/ui/Card";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Link } from "react-router-dom";
import {ArrowRight, Search, GraduationCap, Building2, BarChart3} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Help & documentation"
        description="Get the most out of SkillPulse."
        demo
        meta={<DataFreshnessStrip label="Help" updatedAt="2026-08-26" coverageFrom="2026-01-01" coverageTo="2026-08-26" confidence="High" source="SkillPulse documentation" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card title="Keyboard shortcuts">
          <ul className="space-y-1.5 text-[12.5px] text-ink-secondary">
            <li className="flex items-center justify-between"><span>Open command palette</span><span className="kbd">⌘ K</span></li>
            <li className="flex items-center justify-between"><span>Close drawer / modal</span><span className="kbd">esc</span></li>
            <li className="flex items-center justify-between"><span>Navigate search results</span><span className="kbd">↑ ↓</span></li>
            <li className="flex items-center justify-between"><span>Open selected result</span><span className="kbd">↵</span></li>
            <li className="flex items-center justify-between"><span>Toggle sidebar</span><span className="kbd">[</span></li>
          </ul>
        </Card>
        <Card title="How data flows">
          <ol className="space-y-1.5 text-[12.5px] text-ink-secondary list-decimal pl-4">
            <li>Industry signals are collected (employer surveys, job portals, placement cells, training centres, government portals).</li>
            <li>The platform analyses labour-market demand and job-role growth.</li>
            <li>Skill demand is derived from validated job roles.</li>
            <li>Skill gaps are computed against training supply.</li>
            <li>Curriculum alignment, employer validation and capacity planning feed back into district action plans.</li>
          </ol>
        </Card>
        <Card title="Glossary">
          <ul className="space-y-1.5 text-[12.5px] text-ink-secondary">
            <li><span className="font-medium text-ink-primary">NSQF</span> — National Skills Qualifications Framework</li>
            <li><span className="font-medium text-ink-primary">Alignment score</span> — 0–100 score of curriculum coverage vs. industry requirements</li>
            <li><span className="font-medium text-ink-primary">Validated</span> — employer requirement reviewed and approved by the platform</li>
            <li><span className="font-medium text-ink-primary">Confidence</span> — qualitative likelihood that a recommendation is correct</li>
          </ul>
        </Card>
      </div>

      <Card title="Frequently asked">
        <div className="divide-y divide-border-subtle">
          {[
            { q: "Where does the data come from?", a: "In the demo build, all data is mocked and clearly labelled. In production, the same abstractions would consume authorised labour-market datasets, employer surveys and placement records." },
            { q: "Can I export data?", a: "Yes — tables, charts and reports all support exports via the dedicated button. CSVs follow a standard format aligned with NSQF reporting." },
            { q: "How are recommendations generated?", a: "Recommendations are produced by combining validated employer requirements, role-skill demand, training capacity, and curriculum alignment into prioritised, evidence-backed actions." },
            { q: "Does SkillPulse work offline?", a: "The frontend is built to bundle assets locally and render cached snapshots when network is unavailable. Real-time features will gracefully degrade." },
            { q: "Is my data safe?", a: "No secrets, tokens or credentials are stored in the frontend. All API calls will go through an authenticated backend with proper session management." },
          ].map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer text-sm font-medium text-ink-primary flex items-center gap-2">
                <span className="size-4 grid place-items-center text-ink-tertiary group-open:rotate-90 transition-transform"><ArrowRight className="size-3" /></span>
                {f.q}
              </summary>
              <p className="text-[12.5px] text-ink-secondary mt-2 pl-6">{f.a}</p>
            </details>
          ))}
        </div>
      </Card>

      <Card title="Quick links">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { to: "/dashboard", label: "Overview", icon: BarChart3 },
            { to: "/labour-market", label: "Labour Market", icon: Search },
            { to: "/curriculum", label: "Curriculum", icon: GraduationCap },
            { to: "/employers", label: "Employers", icon: Building2 },
          ].map(l => (
            <Link key={l.to} to={l.to} className="flex items-center gap-2 p-2.5 rounded-md border border-border-subtle hover:bg-neutral-50">
              <l.icon className="size-3.5 text-ink-tertiary" />
              <span className="text-[12.5px] text-ink-primary">{l.label}</span>
              <ArrowRight className="size-3.5 text-ink-tertiary ml-auto" />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

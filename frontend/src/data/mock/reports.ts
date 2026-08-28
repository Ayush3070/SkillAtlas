import type { Report } from "../../types/domain";

export { freshness } from "./series";

export const reports: Report[] = [
  { id: "rpt-001", title: "Maharashtra Labour Market Pulse — Aug 2026", category: "State Labour Market", description: "Monthly executive summary of demand, supply and emerging signals across Maharashtra.", lastGeneratedAt: "2026-08-25", status: "Ready",     pages: 38, coverage: "Jan 2025 – Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-002", title: "Pune District Skill Gap — Deep Dive",      category: "District Skill Gap",     description: "Skill-level gap analysis for Pune with role×skill matrix, employer validation, and training capacity.", lastGeneratedAt: "2026-08-24", status: "Ready",     pages: 24, coverage: "Jan 2025 – Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-003", title: "EV Sector Demand — Maharashtra",            category: "Sector Demand",          description: "Sector demand study for Automotive & EV covering jobs, salaries and required skills.", lastGeneratedAt: "2026-08-22", status: "Ready",     pages: 28, coverage: "Apr 2024 – Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-004", title: "Curriculum Alignment — NSQF L4/L5 ITI",     category: "Curriculum Alignment",   description: "Industry vs. curriculum alignment analysis for all NSQF L4/L5 ITI courses in Maharashtra.", lastGeneratedAt: "2026-08-21", status: "Ready",     pages: 64, coverage: "Jan 2024 – Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-005", title: "Training Capacity & Utilisation",           category: "Training Capacity",      description: "District-wise seat availability, trainer capacity, equipment scores, and utilisation.", lastGeneratedAt: "2026-08-23", status: "Ready",     pages: 32, coverage: "Jan 2025 – Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-006", title: "Emerging Skills Watch — H2 2026",           category: "Emerging Skills",        description: "Quarterly emerging skills report with demand velocity and employer validation signals.", lastGeneratedAt: "2026-08-19", status: "Generating",pages: 18, coverage: "Jan 2025 – Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-007", title: "Nashik District Action Plan — Q4 2026",     category: "District Skill Gap",     description: "Auto-generated district action plan based on validated signals and capacity data.", lastGeneratedAt: "2026-08-25", status: "Ready",     pages: 14, coverage: "Aug 2026", author: "SkillPulse Analytics" },
  { id: "rpt-008", title: "Solar Sector Pipeline — Maharashtra",       category: "Sector Demand",          description: "Pipeline of solar projects mapped to installer demand and training capacity by district.", lastGeneratedAt: "2026-08-12", status: "Scheduled",  pages: 22, coverage: "Jan 2025 – Aug 2026", author: "SkillPulse Analytics" },
];

export const reportCategories: { id: Report["category"]; description: string }[] = [
  { id: "State Labour Market",     description: "Executive view of demand, supply and emerging trends across the state." },
  { id: "District Skill Gap",      description: "Role × skill gap analysis for a specific district with action plan support." },
  { id: "Sector Demand",           description: "Sector-level demand study including salaries, openings and required skills." },
  { id: "Curriculum Alignment",    description: "Industry requirement vs. curriculum coverage with action recommendations." },
  { id: "Training Capacity",       description: "Seat availability, trainer and equipment readiness across districts." },
  { id: "Emerging Skills",         description: "Skills with the highest demand velocity and employer validation." },
];

// Domain models for SkillPulse — Labour Market Intelligence Platform

export type ISODate = string;
export type Percent = number;          // 0..100
export type Ratio   = number;          // 0..1
export type ID      = string;

/* ------------------------------ Geography ------------------------------ */
export type State = "Maharashtra";

export interface District {
  id: ID;
  name: string;
  /** Pin coordinates for SVG map */
  x: number;
  y: number;
  tier: 1 | 2 | 3;                 // economic tier
  population_lakhs: number;
}

/* ------------------------------ Industry signals ------------------------------ */
export type SignalSource =
  | "Employer Survey"
  | "Job Portal"
  | "Placement Cell"
  | "Training Centre"
  | "Industry Body"
  | "Government Portal";

export interface LabourSignal {
  id: ID;
  source: SignalSource;
  sector: Sector;
  districtId: ID;
  roleId?: ID;
  skillIds: ID[];
  strength: 1 | 2 | 3 | 4 | 5;     // qualitative weight
  date: ISODate;
  description: string;
}

export type Sector =
  | "Automotive & EV"
  | "Manufacturing"
  | "IT & Software"
  | "BFSI & FinTech"
  | "Healthcare"
  | "Construction & Real Estate"
  | "Retail & E-commerce"
  | "Logistics & Warehousing"
  | "Hospitality"
  | "Agriculture & Food Processing"
  | "Renewable Energy"
  | "Telecommunications"
  | "Cross-sector"
  | (string & {});  // allow additional sector labels without losing autocomplete

/* ------------------------------ Job roles ------------------------------ */
export type DemandTrend = "rising" | "stable" | "declining" | "emerging" | "declining-fast";
export type JobLevel = "Entry" | "Junior" | "Mid" | "Senior" | "Lead";

export interface JobRole {
  id: ID;
  title: string;
  sector: Sector;
  level: JobLevel;
  /** Open roles per month in target geography (illustrative) */
  monthlyOpenings: number;
  growthYoY: Percent;               // year-over-year change
  trend: DemandTrend;
  /** Average monthly salary in INR (illustrative) */
  avgSalaryINR: number;
  description: string;
  primarySkillIds: ID[];
  emergingSkillIds: ID[];
  employerIds: ID[];
}

/* ------------------------------ Skills ------------------------------ */
export type SkillCategory =
  | "Technical"
  | "Domain"
  | "Tool"
  | "Soft"
  | "Certification"
  | "Process";

export type SkillLifecycle = "emerging" | "critical" | "stable" | "oversupplied" | "declining";

export interface Skill {
  id: ID;
  name: string;
  category: SkillCategory;
  lifecycle: SkillLifecycle;
  description: string;
}

export type Proficiency = "None" | "Basic" | "Intermediate" | "Advanced" | "Expert";

export interface SkillDemand {
  skillId: ID;
  roleId: ID;
  /** % of vacancies requiring this skill */
  requiredBy: Percent;
  requiredProficiency: Proficiency;
  /** % of candidates assessed as proficient in current cohort */
  supply: Percent;
  growthYoY: Percent;
}

export interface SkillGap {
  skillId: ID;
  scope: { type: "role" | "sector" | "district"; id: ID };
  /** 0..100 — higher means larger gap */
  severity: number;
  required: Proficiency;
  current: Proficiency;
  evidence: string[];
  confidence: 0 | 1 | 2 | 3 | 4; // 0 = low, 4 = very high
}

/* ------------------------------ Courses & curriculum ------------------------------ */
export type CourseStatus = "Aligned" | "Needs Update" | "Oversupplied" | "Obsolete" | "Emerging";

export interface Course {
  id: ID;
  name: string;
  sector: Sector;
  durationWeeks: number;
  nsqfLevel: 3 | 4 | 5 | 6 | 7;
  /** Total seats per cohort */
  capacity: number;
  enrolled: number;
  /** Average placements % across last 3 cohorts */
  placementRate: Percent;
  status: CourseStatus;
  /** Composite skill alignment vs industry requirement */
  alignmentScore: number; // 0..100
  description: string;
  trainingCentreIds: ID[];
  primaryRoleIds: ID[];
}

export interface CourseSkill {
  courseId: ID;
  skillId: ID;
  coverage: "covered" | "partial" | "missing" | "obsolete";
  hours: number;
  practicalHours: number;
}

export interface CurriculumRequirement {
  id: ID;
  courseId: ID;
  skillId: ID;
  requiredLevel: Proficiency;
  currentLevel: Proficiency;
  recommendedAction:
    | "Upgrade module"
    | "Add module"
    | "Expand practical training"
    | "Refresh content"
    | "Retire"
    | "No action";
  expectedImpact: "High" | "Medium" | "Low";
  employerBacking: number; // count of employers requesting
}

/* ------------------------------ Employers ------------------------------ */
export type EmployerSize = "Micro" | "Small" | "Medium" | "Large" | "Enterprise";

export interface Employer {
  id: ID;
  name: string;
  sector: Sector;
  districtId: ID;
  size: EmployerSize;
  hiringVolumeAnnual: number;
  contact: { name: string; designation: string };
  validatedRoles: number;
  surveyParticipation: Percent;
  satisfaction: Percent;
  lastUpdated: ISODate;
}

export interface EmployerRequirement {
  id: ID;
  employerId: ID;
  roleId: ID;
  requiredSkills: { skillId: ID; proficiency: Proficiency; critical: boolean }[];
  equipment: string[];
  certificationsPreferred: string[];
  trainerExpectations: string[];
  status: "Pending" | "Validated" | "Needs Review" | "Rejected";
  submittedAt: ISODate;
  validatedAt?: ISODate;
  notes?: string;
}

/* ------------------------------ Training capacity ------------------------------ */
export interface TrainingCentre {
  id: ID;
  name: string;
  districtId: ID;
  sectors: Sector[];
  totalSeats: number;
  utilization: Percent;
  equipmentScore: number;     // 0..100
  trainerScore: number;       // 0..100
  placementRate: Percent;
  establishedYear: number;
}

export interface TrainingCapacity {
  id: ID;
  sector: Sector;
  districtId: ID;
  seatsAvailable: number;
  seatsRequired: number;
  trainerAvailability: Percent;
  equipmentAvailability: Percent;
  utilization: Percent;
  placementRate: Percent;
  /** Top role shortfall in this capacity slice */
  topRoleId: ID;
  /** Gap = required - available, may be negative */
  gap: number;
}

/* ------------------------------ District planning ------------------------------ */
export interface DistrictInsight {
  districtId: ID;
  topSectors: Sector[];
  topRoleIds: ID[];
  criticalSkillIds: ID[];
  employerCount: number;
  trainingCentres: number;
  placementRate: Percent;
  /** Composite priority 0..100, higher = more action needed */
  priorityScore: number;
}

export type ActionPriority = "P1" | "P2" | "P3";

export interface DistrictAction {
  id: ID;
  districtId: ID;
  priority: ActionPriority;
  title: string;
  problem: string;
  evidence: string[];
  recommendation: string;
  expectedImpact: "High" | "Medium" | "Low";
  owner: string;
  status: "Proposed" | "In Review" | "Approved" | "In Progress" | "Done";
}

export interface TrainingPlan {
  id: ID;
  districtId: ID;
  generatedAt: ISODate;
  horizonMonths: 3 | 6 | 12;
  actions: DistrictAction[];
  estimatedImpact: { placements: number; gapReductionPct: number };
}

/* ------------------------------ Candidates ------------------------------ */
export type Qualification =
  | "10th Pass"
  | "12th Pass"
  | "ITI"
  | "Diploma"
  | "Graduate"
  | "Postgraduate";

export interface CandidateProfile {
  id: ID;
  name: string;
  qualification: Qualification;
  experienceYears: number;
  districtId: ID;
  interests: Sector[];
  skills: { skillId: ID; proficiency: Proficiency }[];
}

export interface CareerPath {
  id: ID;
  fromRoleId: ID;
  toRoleId: ID;
  requiredTraining: { courseId: ID; skillIds: ID[] }[];
  estimatedMonths: number;
}

export interface Recommendation {
  id: ID;
  type:
    | "Increase Capacity"
    | "Update Curriculum"
    | "Add Module"
    | "Retire Course"
    | "Employer Outreach"
    | "Trainer Upskill"
    | "Equipment Investment"
    | "Candidate Career";
  title: string;
  summary: string;
  why: string[];
  evidenceIds: ID[];
  confidence: Percent;
  expectedImpact: "High" | "Medium" | "Low";
  status: "Proposed" | "In Review" | "Approved" | "In Progress" | "Done";
  scope: { type: "role" | "sector" | "district" | "course" | "candidate"; id: ID };
  createdAt: ISODate;
}

export interface Evidence {
  id: ID;
  kind: "signal" | "survey" | "placement" | "capacity" | "employer" | "training";
  source: string;
  date: ISODate;
  summary: string;
  value?: string;
}

/* ------------------------------ Reports ------------------------------ */
export type ReportCategory =
  | "State Labour Market"
  | "District Skill Gap"
  | "Sector Demand"
  | "Curriculum Alignment"
  | "Training Capacity"
  | "Emerging Skills";

export interface Report {
  id: ID;
  title: string;
  category: ReportCategory;
  description: string;
  lastGeneratedAt: ISODate;
  status: "Ready" | "Generating" | "Scheduled" | "Failed";
  pages: number;
  coverage: string;
  author: string;
}

/* ------------------------------ Common API ------------------------------ */
export type Severity = "info" | "success" | "warning" | "critical";

export interface DataFreshness {
  updatedAt: ISODate;
  coverageFrom: ISODate;
  coverageTo: ISODate;
  confidence: "Low" | "Medium" | "High";
  source: string;
}

export interface KpiDelta {
  value: string;
  rawValue: number;
  unit?: "%" | "₹" | "k" | "L" | "" ;
  change: number;                 // % delta
  comparison: string;             // e.g., "vs previous year"
  trend: DemandTrend;
}

export interface DashboardOverview {
  asOf: ISODate;
  kpis: {
    activeSignals: KpiDelta;
    skillGapIndex: KpiDelta;
    placementRate: KpiDelta;
    employerSatisfaction: KpiDelta;
    courseAlignment: KpiDelta;
  };
  insights: Recommendation[];
  freshness: DataFreshness;
}

export interface ApiResponse<T> {
  data: T;
  meta?: { total?: number; page?: number; pageSize?: number };
}

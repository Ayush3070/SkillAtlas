import { districts, findDistrict } from "../../data/mock/districts";
import { skills, findSkill } from "../../data/mock/skills";
import { jobRoles, findRole } from "../../data/mock/jobRoles";
import { courses, courseSkills, curriculumRequirements, findCourse } from "../../data/mock/courses";
import { employers, employerRequirements, findEmployer } from "../../data/mock/employers";
import { trainingCentres, trainingCapacities } from "../../data/mock/trainingCentres";
import { districtInsights, districtActions, trainingPlans, recommendations, evidence } from "../../data/mock/districtPlanning";
import { labourSignals } from "../../data/mock/signals";
import { reports, reportCategories } from "../../data/mock/reports";
import {
  monthLabels, roleDemandSeries, districtEvSeries,
  geoDemand, skillMatrix,
  sourceMix, freshness } from "../../data/mock/series";
import { net } from "../api/client";
import type {
  Course, 
  EmployerRequirement, TrainingPlan, 
  ApiResponse,
  DashboardOverview, KpiDelta } from "../../types/domain";

/* -------------------- Dashboard -------------------- */
async function getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
  const kpis: DashboardOverview["kpis"] = {
    activeSignals: {
      value: "2,356", rawValue: 2356, change: 18.4, comparison: "vs previous 6 months",
      trend: "rising" } as KpiDelta,
    skillGapIndex: {
      value: "32.6", rawValue: 32.6, unit: "", change: -4.1, comparison: "vs previous year",
      trend: "stable" } as KpiDelta,
    placementRate: {
      value: "76.4", rawValue: 76.4, unit: "%", change: 3.2, comparison: "vs previous year",
      trend: "rising" } as KpiDelta,
    employerSatisfaction: {
      value: "82.1", rawValue: 82.1, unit: "%", change: 1.8, comparison: "vs previous survey",
      trend: "stable" } as KpiDelta,
    courseAlignment: {
      value: "78.3", rawValue: 78.3, unit: "", change: 2.6, comparison: "vs previous review",
      trend: "rising" } as KpiDelta };
  const overview: DashboardOverview = {
    asOf: "2026-08-26",
    kpis,
    insights: recommendations.filter(r => r.confidence >= 75).slice(0, 4),
    freshness };
  return net.get(overview);
}

/* -------------------- Labour market -------------------- */
async function getLabourMarketSignals() {
  return net.get({ signals: labourSignals, sourceMix, freshness });
}
async function getJobRoles() {
  return net.get({ roles: jobRoles, freshness });
}
async function getRoleDetails(roleId: string) {
  const role = findRole(roleId);
  if (!role) throw new Error("Role not found");
  const series = roleDemandSeries[roleId] ?? [];
  const cells = skillMatrix.find(c => c.roleId === roleId)?.cell ?? {};
  const linkedSignals = labourSignals.filter(s => s.roleId === roleId);
  return net.get({ role, series, months: monthLabels, cells, signals: linkedSignals });
}

/* -------------------- Skills -------------------- */
async function getSkills() {
  return net.get({ skills, freshness });
}
async function getSkillDetails(skillId: string) {
  const skill = findSkill(skillId);
  if (!skill) throw new Error("Skill not found");
  // build a synthetic supply / demand trend per skill
  const base = (skill.lifecycle === "critical" || skill.lifecycle === "emerging") ? 95 : 60;
  const demand = monthLabels.map((_, i) => Math.round(base + i * 2.2 + (skill.lifecycle === "emerging" ? i * 0.8 : 0)));
  const supply = monthLabels.map((_, i) => Math.round(46 + i * 0.7));
  const gap = monthLabels.map((_, i) => Math.max(0, Math.round((demand[i] - supply[i]) * 1.1)));
  const roles = jobRoles.filter(r => r.primarySkillIds.includes(skillId) || r.emergingSkillIds.includes(skillId));
  const courses = (() => {
    const cs = courseSkills.filter(c => c.skillId === skillId).map(c => c.courseId);
    return cs.map(id => findCourse(id)).filter(Boolean) as Course[];
  })();
  return net.get({ skill, months: monthLabels, demand, supply, gap, roles, courses, freshness });
}
async function getSkillMatrix() {
  return net.get({ matrix: skillMatrix, roles: jobRoles, skills, freshness });
}

/* -------------------- Courses -------------------- */
async function getCourses() {
  return net.get({ courses, freshness });
}
async function getCourseDetails(courseId: string) {
  const course = findCourse(courseId);
  if (!course) throw new Error("Course not found");
  const skills_ = courseSkills.filter(c => c.courseId === courseId);
  const requirements = curriculumRequirements.filter(c => c.courseId === courseId);
  return net.get({ course, courseSkills: skills_, requirements, freshness });
}
async function getCurriculumAlignment() {
  return net.get({ courses, courseSkills, requirements: curriculumRequirements, freshness });
}
async function getCurriculumDetails(courseId: string) {
  const course = findCourse(courseId);
  if (!course) throw new Error("Course not found");
  const skills_ = courseSkills.filter(c => c.courseId === courseId);
  const requirements = curriculumRequirements.filter(c => c.courseId === courseId);
  return net.get({ course, courseSkills: skills_, requirements, freshness });
}

/* -------------------- Employers -------------------- */
async function getEmployerData() {
  return net.get({ employers, requirements: employerRequirements, freshness });
}
async function getEmployerDetails(employerId: string) {
  const employer = findEmployer(employerId);
  if (!employer) throw new Error("Employer not found");
  const requirements = employerRequirements.filter(r => r.employerId === employerId);
  return net.get({ employer, requirements, freshness });
}
async function submitEmployerRequirement(payload: Omit<EmployerRequirement, "id" | "status" | "submittedAt">) {
  const req: EmployerRequirement = {
    ...payload,
    id: `er-${Date.now()}`,
    status: "Pending",
    submittedAt: net.iso() };
  return net.post(req);
}

/* -------------------- Training capacity -------------------- */
async function getTrainingCapacity() {
  return net.get({ centres: trainingCentres, capacities: trainingCapacities, freshness });
}

/* -------------------- District planning -------------------- */
async function getDistrictInsights() {
  return net.get({ districts, insights: districtInsights, geo: geoDemand, freshness });
}
async function getDistrictDetails(districtId: string) {
  const district = findDistrict(districtId);
  if (!district) throw new Error("District not found");
  const insight = districtInsights.find(d => d.districtId === districtId);
  const actions = districtActions.filter(a => a.districtId === districtId);
  const capacities = trainingCapacities.filter(c => c.districtId === districtId);
  const centres = trainingCentres.filter(c => c.districtId === districtId);
  const employers_ = employers.filter(e => e.districtId === districtId);
  const evSeries = districtEvSeries[districtId] ?? [];
  return net.get({
    district, insight, actions, capacities, centres, employers: employers_,
    evSeries, months: monthLabels, freshness });
}
async function getTrainingPlan(districtId: string): Promise<ApiResponse<TrainingPlan>> {
  const plan = trainingPlans.find(t => t.districtId === districtId)
    ?? {
      id: `tp-${districtId}-${Date.now()}`,
      districtId, generatedAt: net.iso(), horizonMonths: 12 as const,
      actions: districtActions.filter(a => a.districtId === districtId),
      estimatedImpact: { placements: 0, gapReductionPct: 0 } };
  return net.get(plan);
}

/* -------------------- Candidate guidance -------------------- */
async function getCandidateRecommendations() {
  return net.get({ jobRoles, skills, courses, freshness });
}

/* -------------------- Reports -------------------- */
async function getReports() {
  return net.get({ reports, categories: reportCategories, freshness });
}

/* -------------------- Recommendations / Evidence -------------------- */
async function getRecommendations() {
  return net.get({ recommendations, freshness });
}
async function getEvidence() {
  return net.get({ evidence });
}

/* -------------------- Global search -------------------- */
async function globalSearch(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return net.get({ roles: [], skills: [], courses: [], employers: [], districts: [] });

  const roles = jobRoles.filter(r => r.title.toLowerCase().includes(q) || r.sector.toLowerCase().includes(q)).slice(0, 6);
  const skills_ = skills.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 6);
  const courses_ = courses.filter(c => c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q)).slice(0, 6);
  const employers_ = employers.filter(e => e.name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q)).slice(0, 6);
  const districts_ = districts.filter(d => d.name.toLowerCase().includes(q)).slice(0, 4);
  return net.get({ roles, skills: skills_, courses: courses_, employers: employers_, districts: districts_ });
}

export const repository = {
  getDashboardOverview,
  getLabourMarketSignals,
  getJobRoles,
  getRoleDetails,
  getSkills,
  getSkillDetails,
  getSkillMatrix,
  getCourses,
  getCourseDetails,
  getCurriculumAlignment,
  getCurriculumDetails,
  getEmployerData,
  getEmployerDetails,
  submitEmployerRequirement,
  getTrainingCapacity,
  getDistrictInsights,
  getDistrictDetails,
  getTrainingPlan,
  getCandidateRecommendations,
  getReports,
  getRecommendations,
  getEvidence,
  globalSearch };

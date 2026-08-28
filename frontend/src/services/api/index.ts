/**
 * Service layer.
 * Components should import from here (not directly from repositories).
 * When a real backend is connected, only these functions need to be re-pointed
 * to live fetch() calls — the rest of the UI stays untouched.
 */
import { repository } from "../repositories";

export const api = {
  dashboard:        () => repository.getDashboardOverview(),
  labourMarket:     () => repository.getLabourMarketSignals(),
  jobRoles:         () => repository.getJobRoles(),
  roleDetails:      (id: string) => repository.getRoleDetails(id),
  skills:           () => repository.getSkills(),
  skillDetails:     (id: string) => repository.getSkillDetails(id),
  skillMatrix:      () => repository.getSkillMatrix(),
  courses:          () => repository.getCourses(),
  courseDetails:    (id: string) => repository.getCourseDetails(id),
  curriculum:       () => repository.getCurriculumAlignment(),
  curriculumDetails:(id: string) => repository.getCurriculumDetails(id),
  employers:        () => repository.getEmployerData(),
  employerDetails:  (id: string) => repository.getEmployerDetails(id),
  submitEmployer:   (p: Parameters<typeof repository.submitEmployerRequirement>[0]) => repository.submitEmployerRequirement(p),
  capacity:         () => repository.getTrainingCapacity(),
  districts:        () => repository.getDistrictInsights(),
  districtDetails:  (id: string) => repository.getDistrictDetails(id),
  trainingPlan:     (id: string) => repository.getTrainingPlan(id),
  candidates:       () => repository.getCandidateRecommendations(),
  reports:          () => repository.getReports(),
  recommendations:  () => repository.getRecommendations(),
  evidence:         () => repository.getEvidence(),
  search:           (q: string) => repository.globalSearch(q),
};

import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { SkeletonCard } from "../../components/feedback/States";
import { ROUTE_LABELS } from "./labels";

const LoginPage              = lazy(() => import("../../features/auth/LoginPage"));
const DashboardPage          = lazy(() => import("../../features/dashboard/DashboardPage"));
const LabourMarketPage       = lazy(() => import("../../features/labour-market/LabourMarketPage"));
const RoleDetailPage         = lazy(() => import("../../features/labour-market/RoleDetailPage"));
const SkillsPage             = lazy(() => import("../../features/skills/SkillsPage"));
const SkillDetailPage        = lazy(() => import("../../features/skills/SkillDetailPage"));
const SkillMatrixPage        = lazy(() => import("../../features/skills/SkillMatrixPage"));
const CoursesPage            = lazy(() => import("../../features/courses/CoursesPage"));
const CourseDetailPage       = lazy(() => import("../../features/courses/CourseDetailPage"));
const CurriculumAlignmentPage= lazy(() => import("../../features/curriculum/CurriculumAlignmentPage"));
const CurriculumDetailPage   = lazy(() => import("../../features/curriculum/CurriculumDetailPage"));
const EmployersPage          = lazy(() => import("../../features/employers/EmployersPage"));
const EmployerDetailPage     = lazy(() => import("../../features/employers/EmployerDetailPage"));
const TrainingCapacityPage   = lazy(() => import("../../features/training-capacity/TrainingCapacityPage"));
const DistrictPlanningPage   = lazy(() => import("../../features/district-planning/DistrictPlanningPage"));
const DistrictDetailPage     = lazy(() => import("../../features/district-planning/DistrictDetailPage"));
const CandidateGuidancePage  = lazy(() => import("../../features/candidate-guidance/CandidateGuidancePage"));
const ReportsPage            = lazy(() => import("../../features/reports/ReportsPage"));
const SettingsPage           = lazy(() => import("../../features/settings/SettingsPage"));
const HelpPage               = lazy(() => import("../../features/settings/HelpPage"));
const NotFoundPage           = lazy(() => import("./NotFoundPage"));

function PageFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <SkeletonCard lines={4} />
      <SkeletonCard lines={4} />
      <SkeletonCard lines={4} />
    </div>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

const crumb = (m: { pathname: string }) => {
  const parts = m.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return ROUTE_LABELS[last] ?? (last.charAt(0).toUpperCase() + last.slice(1));
};

const routes: RouteObject[] = [
  { path: "/login", element: <Page><LoginPage /></Page> },
  {
    path: "/",
    element: <AppShell><Outlet /></AppShell>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard",         element: <Page><DashboardPage /></Page>,         handle: { crumb } },
      { path: "labour-market",     element: <Page><LabourMarketPage /></Page>,      handle: { crumb } },
      { path: "labour-market/:roleId", element: <Page><RoleDetailPage /></Page>,    handle: { crumb } },
      { path: "skills",            element: <Page><SkillsPage /></Page>,            handle: { crumb } },
      { path: "skills/matrix",     element: <Page><SkillMatrixPage /></Page>,       handle: { crumb } },
      { path: "skills/:skillId",   element: <Page><SkillDetailPage /></Page>,       handle: { crumb } },
      { path: "courses",           element: <Page><CoursesPage /></Page>,           handle: { crumb } },
      { path: "courses/:courseId", element: <Page><CourseDetailPage /></Page>,      handle: { crumb } },
      { path: "curriculum",        element: <Page><CurriculumAlignmentPage /></Page>, handle: { crumb } },
      { path: "curriculum/:courseId", element: <Page><CurriculumDetailPage /></Page>, handle: { crumb } },
      { path: "employers",         element: <Page><EmployersPage /></Page>,         handle: { crumb } },
      { path: "employers/:employerId", element: <Page><EmployerDetailPage /></Page>, handle: { crumb } },
      { path: "training-capacity", element: <Page><TrainingCapacityPage /></Page>,  handle: { crumb } },
      { path: "district-planning", element: <Page><DistrictPlanningPage /></Page>,  handle: { crumb } },
      { path: "district-planning/:districtId", element: <Page><DistrictDetailPage /></Page>, handle: { crumb } },
      { path: "candidate-guidance",element: <Page><CandidateGuidancePage /></Page>, handle: { crumb } },
      { path: "reports",           element: <Page><ReportsPage /></Page>,           handle: { crumb } },
      { path: "settings",          element: <Page><SettingsPage /></Page>,          handle: { crumb } },
      { path: "help",              element: <Page><HelpPage /></Page>,              handle: { crumb } },
      { path: "*",                 element: <Page><NotFoundPage /></Page> },
    ],
  },
];

import { Outlet } from "react-router-dom";

export const router = createBrowserRouter(routes);

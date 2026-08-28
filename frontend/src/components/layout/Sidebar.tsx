import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {LayoutDashboard, BarChart3, Sparkles, BookOpen, GitCompareArrows, Building2, Wrench, Map, GraduationCap, FileText, Settings, HelpCircle, ChevronsLeft, ChevronsRight, LifeBuoy, LogOut} from "lucide-react";
import { useAuth, type Role } from "../../services/api/auth";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "primary" | "secondary";
  roles?: Role[];
  end?: boolean;
}

const PRIMARY: NavItem[] = [
  { to: "/dashboard",          label: "Overview",              icon: LayoutDashboard,    group: "primary", end: true },
  { to: "/labour-market",      label: "Labour Market",         icon: BarChart3,          group: "primary" },
  { to: "/skills",             label: "Skills Intelligence",   icon: Sparkles,           group: "primary" },
  { to: "/courses",            label: "Courses",               icon: BookOpen,           group: "primary" },
  { to: "/curriculum",         label: "Curriculum Alignment",  icon: GitCompareArrows,   group: "primary" },
  { to: "/employers",          label: "Employers",             icon: Building2,          group: "primary" },
  { to: "/training-capacity",  label: "Training Capacity",     icon: Wrench,             group: "primary" },
  { to: "/district-planning",  label: "District Planning",     icon: Map,                group: "primary" },
  { to: "/candidate-guidance", label: "Candidate Guidance",    icon: GraduationCap,      group: "primary", roles: ["Candidate","Government Administrator","Training Institute"] },
  { to: "/reports",            label: "Reports",               icon: FileText,           group: "primary" },
];

const SECONDARY: NavItem[] = [
  { to: "/settings", label: "Settings", icon: Settings,   group: "secondary" },
  { to: "/help",     label: "Help",     icon: HelpCircle, group: "secondary" },
];

const COLLAPSE_KEY = "skillpulse:sidebar:collapsed";

export function Sidebar() {
  const { user, signOut, switchRole } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(COLLAPSE_KEY) === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  const loc = useLocation();
  useEffect(() => {
    // close any open tooltips on route change
  }, [loc.pathname]);

  const visible = (i: NavItem) => !i.roles || i.roles.includes(user.role);

  return (
    <aside
      className={[
        "bg-surface border-r border-border-subtle flex flex-col shrink-0 transition-[width] duration-base ease-standard",
        collapsed ? "w-[60px]" : "w-[244px]",
        "h-screen sticky top-0 z-sticky",
      ].join(" ")}
      aria-label="Primary"
    >
      <div className="h-14 flex items-center justify-between gap-2 px-3 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-7 grid place-items-center rounded-md bg-primary-500 text-white shrink-0">
            <BrandMark />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-primary leading-none">SkillPulse</div>
              <div className="text-[10.5px] text-ink-tertiary mt-0.5 leading-none">Labour Market Intelligence</div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="size-7 grid place-items-center rounded-md text-ink-tertiary hover:bg-neutral-100 hover:text-ink-primary transition-colors"
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2" role="navigation">
        <ul className="px-2 space-y-0.5">
          {PRIMARY.filter(visible).map(i => <NavRow key={i.to} item={i} collapsed={collapsed} />)}
        </ul>
        <div className="mt-4 px-3">
          {!collapsed && <div className="text-[10.5px] uppercase tracking-wider text-ink-muted font-medium px-2 mb-1">Workspace</div>}
          <ul className="px-2 space-y-0.5">
            {SECONDARY.filter(visible).map(i => <NavRow key={i.to} item={i} collapsed={collapsed} />)}
          </ul>
        </div>
      </nav>

      <div className="border-t border-border-subtle p-3 shrink-0">
        <RoleSwitcher value={user.role} onChange={switchRole} collapsed={collapsed} />
        <div className={["mt-2 flex items-center gap-2.5", collapsed ? "justify-center" : ""].join(" ")}>
          <div className="size-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white grid place-items-center text-[11px] font-semibold shrink-0">
            {user.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium text-ink-primary truncate">{user.name}</div>
              <div className="text-[10.5px] text-ink-tertiary truncate">{user.organization}</div>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              aria-label="Sign out"
              title="Sign out"
              onClick={signOut}
              className="size-7 grid place-items-center rounded-md text-ink-tertiary hover:bg-neutral-100 hover:text-ink-primary"
            >
              <LogOut className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) => [
          "flex items-center gap-2.5 rounded-md transition-colors text-sm",
          collapsed ? "justify-center h-9 w-full" : "h-8 px-2.5",
          isActive
            ? "bg-primary-50 text-primary-700 font-semibold"
            : "text-ink-secondary hover:bg-neutral-100 hover:text-ink-primary",
        ].join(" ")}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="size-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    </li>
  );
}

function RoleSwitcher({ value, onChange, collapsed }: { value: Role; onChange: (r: Role) => void; collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const roles: Role[] = ["Government Administrator", "Training Institute", "Employer", "Candidate"];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={[
          "w-full inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface-sunken text-[11.5px] text-ink-secondary hover:bg-neutral-50 transition-colors",
          collapsed ? "h-9 justify-center" : "h-8 px-2.5 justify-between",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Switch role (demo)"
      >
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <LifeBuoy className="size-3.5" />
          {!collapsed && <span className="truncate">{value}</span>}
        </span>
        {!collapsed && <span className="text-ink-muted">▾</span>}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 right-0 mb-1 bg-surface border border-border-default rounded-md shadow-3 p-1 z-overlay"
        >
          {roles.map(r => (
            <li key={r}>
              <button
                type="button"
                role="option"
                aria-selected={r === value}
                onClick={() => { onChange(r); setOpen(false); }}
                className={[
                  "w-full text-left text-[12px] rounded px-2 py-1.5 transition-colors",
                  r === value ? "bg-primary-50 text-primary-700 font-medium" : "text-ink-secondary hover:bg-neutral-100",
                ].join(" ")}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BrandMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17 L9 7 L13 13 L17 9 L21 17" />
      <circle cx="13" cy="13" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

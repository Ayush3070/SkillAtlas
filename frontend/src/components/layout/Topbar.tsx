import { useEffect, useState } from "react";
import { Link, useMatches, type UIMatch } from "react-router-dom";
import { ChevronRight, Search, Bell, MapPin, Calendar, Menu, Clock, Sun, Moon } from "lucide-react";
import { districts } from "../../data/mock/districts";
import { useCmdKey } from "../../hooks/useCmdKey";
import { openCommandPalette } from "./CommandPalette";
import { useTheme } from "../../services/api/theme";

interface CrumbMeta { crumb?: (m: UIMatch) => string | null; }

function useCrumbs() {
  const matches = useMatches() as (UIMatch & { handle?: CrumbMeta })[];
  return matches
    .filter((m) => m.handle?.crumb)
    .map((m) => ({ pathname: m.pathname, label: m.handle!.crumb!(m) }));
}

export function Topbar({ onMobileMenu }: { onMobileMenu?: () => void }) {
  const crumbs = useCrumbs();
  const cmd = useCmdKey();
  const { theme, toggle } = useTheme();

  // Simple district selector — persists to localStorage.
  const [district, setDistrict] = useState<string>(() => {
    try { return localStorage.getItem("skillpulse:district") ?? "pune"; } catch { return "pune"; }
  });
  useEffect(() => { try { localStorage.setItem("skillpulse:district", district); } catch {} }, [district]);

  const now = new Date("2026-08-26T10:30:00");
  const time = now.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  const date = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <header className="h-14 bg-surface border-b border-border-subtle sticky top-0 z-sticky px-3 lg:px-5 flex items-center gap-3">
      <button
        type="button"
        onClick={onMobileMenu}
        aria-label="Open menu"
        className="lg:hidden size-8 grid place-items-center rounded-md text-ink-tertiary hover:bg-neutral-100"
      >
        <Menu className="size-4" />
      </button>

      <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-sm text-ink-tertiary min-w-0">
        <Link to="/dashboard" className="hover:text-ink-primary">SkillPulse</Link>
        {crumbs.map((c, i) => (
          <span key={c.pathname} className="flex items-center gap-1 min-w-0">
            <ChevronRight className="size-3.5 text-ink-muted" />
            {i === crumbs.length - 1
              ? <span className="text-ink-primary font-medium truncate">{c.label}</span>
              : <Link to={c.pathname} className="hover:text-ink-primary truncate">{c.label}</Link>}
          </span>
        ))}
      </nav>

      <button
        type="button"
        onClick={openCommandPalette}
        className="hidden md:flex items-center gap-2 h-8 px-2.5 rounded-md border border-border-default bg-surface-sunken text-ink-tertiary text-[12.5px] w-72 hover:bg-neutral-50 transition-colors"
        aria-label="Open search (Command palette)"
      >
        <Search className="size-3.5" />
        <span className="truncate">Search jobs, skills, courses…</span>
        <span className="ml-auto inline-flex items-center gap-0.5">
          <span className="kbd">{cmd.symbol}</span>
          <span className="kbd">K</span>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <DistrictSelector value={district} onChange={setDistrict} />
        <div className="hidden xl:flex items-center gap-1.5 text-[11.5px] text-ink-tertiary px-2 h-8 rounded-md border border-border-subtle bg-surface-sunken">
          <Calendar className="size-3.5" />
          <span className="tabular">{date}</span>
          <Clock className="size-3.5 ml-1.5" />
          <span className="tabular">{time}</span>
        </div>
        <ThemeToggle theme={theme} onToggle={toggle} />
        <NotificationButton />
      </div>
    </header>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light" : "Switch to dark"}
      className="size-8 grid place-items-center rounded-md border border-border-default bg-surface text-ink-tertiary hover:text-ink-primary hover:bg-neutral-50 transition-colors"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function DistrictSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border-default bg-surface text-[12.5px] text-ink-primary">
      <MapPin className="size-3.5 text-ink-tertiary" />
      <span className="text-ink-tertiary">District</span>
      <select
        className="bg-transparent focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="District selector"
      >
        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
    </label>
  );
}

function NotificationButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Notifications"
        className="size-8 grid place-items-center rounded-md border border-border-default bg-surface text-ink-tertiary hover:text-ink-primary hover:bg-neutral-50"
      >
        <Bell className="size-4" />
        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary-500 ring-2 ring-surface" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-surface border border-border-default rounded-md shadow-3 p-2 z-overlay">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">Recent</div>
          <ul className="text-sm">
            <li className="px-2 py-2 rounded hover:bg-neutral-50 cursor-pointer">
              <div className="text-ink-primary">Pune EV demand crossed 1,800 monthly openings</div>
              <div className="text-[11px] text-ink-tertiary">2 hours ago</div>
            </li>
            <li className="px-2 py-2 rounded hover:bg-neutral-50 cursor-pointer">
              <div className="text-ink-primary">Mahindra EV validated 180 EV Technician requirements</div>
              <div className="text-[11px] text-ink-tertiary">Yesterday</div>
            </li>
            <li className="px-2 py-2 rounded hover:bg-neutral-50 cursor-pointer">
              <div className="text-ink-primary">Nashik action plan ready for review</div>
              <div className="text-[11px] text-ink-tertiary">2 days ago</div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Search, Briefcase, Sparkles, BookOpen, Building2, MapPin, ArrowRight, Loader2} from "lucide-react";
import { api } from "../../services/api";
import { useAsync } from "../../hooks/useAsync";

type Hit = { id: string; label: string; sub?: string; to: string; group: "Roles" | "Skills" | "Courses" | "Employers" | "Districts" };

let externalOpener: (() => void) | null = null;
export function openCommandPalette() { externalOpener?.(); }

const groupIcon: Record<Hit["group"], React.ComponentType<{ className?: string }>> = {
  Roles:     Briefcase,
  Skills:    Sparkles,
  Courses:   BookOpen,
  Employers: Building2,
  Districts: MapPin,
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    externalOpener = () => setOpen(true);
    return () => { externalOpener = null; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ(""); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const { data, loading } = useAsync(async () => {
    const r = await api.search(q);
    const hits: Hit[] = [
      ...r.data.roles.map(x => ({ id: x.id, label: x.title, sub: x.sector, to: `/labour-market/${x.id}`, group: "Roles" as const })),
      ...r.data.skills.map(x => ({ id: x.id, label: x.name, sub: x.category, to: `/skills/${x.id}`, group: "Skills" as const })),
      ...r.data.courses.map(x => ({ id: x.id, label: x.name, sub: x.sector, to: `/courses/${x.id}`, group: "Courses" as const })),
      ...r.data.employers.map(x => ({ id: x.id, label: x.name, sub: x.sector, to: `/employers/${x.id}`, group: "Employers" as const })),
      ...r.data.districts.map(x => ({ id: x.id, label: x.name, sub: "District", to: `/district-planning/${x.id}`, group: "Districts" as const })),
    ];
    return hits;
  }, [q, open]);

  const hits = useMemo(() => data ?? [], [data]);

  const grouped = useMemo(() => {
    const m: Record<string, Hit[]> = {};
    hits.forEach(h => { (m[h.group] ||= []).push(h); });
    return m;
  }, [hits]);

  const flat = hits;
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(flat.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && flat[active]) {
      navigate(flat[active].to);
      setOpen(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-cmd flex items-start justify-center pt-[10vh] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-[var(--overlay)] fade-in" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl bg-surface border border-border-default rounded-xl shadow-pop overflow-hidden fade-in">
        <div className="flex items-center gap-2 px-3 h-12 border-b border-border-subtle">
          <Search className="size-4 text-ink-tertiary" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search jobs, skills, courses, employers, districts…"
            className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
            aria-label="Search"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-6 flex items-center gap-2 text-ink-tertiary text-sm">
              <Loader2 className="size-3.5 animate-spin" /> Searching…
            </div>
          )}
          {!loading && flat.length === 0 && (
            <div className="p-6 text-center text-sm text-ink-tertiary">
              {q ? `No results for "${q}"` : "Type to search across roles, skills, courses, employers and districts."}
            </div>
          )}
          {!loading && Object.entries(grouped).map(([group, items]) => {
            const Icon = groupIcon[group as Hit["group"]];
            return (
              <div key={group} className="py-1">
                <div className="px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted">{group}</div>
                <ul>
                  {items.map((h) => {
                    const idx = flat.indexOf(h);
                    const isActive = idx === active;
                    return (
                      <li key={h.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => { navigate(h.to); setOpen(false); }}
                          className={[
                            "w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                            isActive ? "bg-primary-50 text-primary-700" : "text-ink-primary hover:bg-neutral-50",
                          ].join(" ")}
                        >
                          <Icon className={["size-3.5 shrink-0", isActive ? "text-primary-600" : "text-ink-tertiary"].join(" ")} />
                          <span className="truncate flex-1">{h.label}</span>
                          {h.sub && <span className={["text-[11.5px] truncate", isActive ? "text-primary-600" : "text-ink-tertiary"].join(" ")}>{h.sub}</span>}
                          {isActive && <ArrowRight className="size-3.5 text-primary-600" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-border-subtle text-[11px] text-ink-tertiary bg-surface-sunken">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><span className="kbd">↑</span><span className="kbd">↓</span> Navigate</span>
            <span className="inline-flex items-center gap-1"><span className="kbd">↵</span> Open</span>
            <span className="inline-flex items-center gap-1"><span className="kbd">esc</span> Close</span>
          </div>
          <span>Search by SkillPulse</span>
        </div>
      </div>
    </div>
  );
}

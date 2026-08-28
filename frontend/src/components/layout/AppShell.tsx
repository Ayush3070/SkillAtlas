import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { ToastViewport } from "../feedback/Toast";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-drawer flex">
          <div className="absolute inset-0 bg-[var(--overlay)]" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 min-w-0 px-4 lg:px-6 py-4 lg:py-6">
          <div className="max-w-[1480px] mx-auto fade-in">{children}</div>
        </main>
        <footer className="border-t border-border-subtle bg-surface">
          <div className="max-w-[1480px] mx-auto px-4 lg:px-6 py-3 text-[11.5px] text-ink-tertiary flex flex-wrap items-center justify-between gap-2">
            <div>
              SkillPulse · Labour Market Intelligence · Demo build · SIH PS 134
            </div>
            <div className="inline-flex items-center gap-3">
              <span>Data labelled as <span className="text-ink-secondary font-medium">demo labour-market signal</span></span>
              <span className="text-ink-muted">·</span>
              <span>Updated 2 days ago</span>
            </div>
          </div>
        </footer>
      </div>

      <CommandPalette />
      <ToastViewport />
    </div>
  );
}

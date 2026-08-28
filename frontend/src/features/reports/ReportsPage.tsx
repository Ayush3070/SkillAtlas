import { useState } from "react";
import {FileText, Download, Sparkles, Play, Eye} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { SkeletonCard, ErrorState, EmptyState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness, reportCategories } from "../../data/mock/reports";
import { Button } from "../../components/ui/Button";
import { pushToast } from "../../components/feedback/Toast";
import type { Report } from "../../types/domain";
import { Drawer } from "../../components/ui/Drawer";

export default function ReportsPage() {
  const { values, set, reset } = useFilters([
    { id: "category", label: "Category", type: "select", options: reportCategories.map(c => ({ value: c.id, label: c.id })) },
    { id: "status", label: "Status", type: "select", options: [
      { value: "Ready", label: "Ready" },
      { value: "Generating", label: "Generating" },
      { value: "Scheduled", label: "Scheduled" },
      { value: "Failed", label: "Failed" },
    ]},
  ]);

  const { data, loading, error, refetch } = useAsync(() => api.reports().then(r => r.data), []);
  const [open, setOpen] = useState<Report | null>(null);

  const filtered = (data?.reports ?? []).filter((r: Report) => {
    if (values.category && r.category !== values.category) return false;
    if (values.status && r.status !== values.status) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Generate, browse and share authoritative labour-market intelligence reports."
        demo
        meta={<DataFreshnessStrip label="Reports view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={<Button leadingIcon={<Sparkles className="size-3.5" />} onClick={() => pushToast({ tone: "info", title: "Custom report queued" })}>New report</Button>}
      />

      <FilterBar
        filters={[
          { id: "category", label: "Category", type: "select", options: reportCategories.map(c => ({ value: c.id, label: c.id })) },
          { id: "status", label: "Status", type: "select", options: [
            { value: "Ready", label: "Ready" },
            { value: "Generating", label: "Generating" },
            { value: "Scheduled", label: "Scheduled" },
            { value: "Failed", label: "Failed" },
          ]},
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(Boolean).length}
      />

      {error && <ErrorState title="Reports could not be loaded" description={error} onRetry={refetch} />}

      <section>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-tertiary mb-2">Categories</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {reportCategories.map(c => (
            <button key={c.id} type="button" onClick={() => set("category", c.id)}
              className="text-left bg-surface border border-border-subtle rounded-lg p-3 hover:border-border-default hover:bg-neutral-50 transition-colors">
              <div className="text-sm font-semibold text-ink-primary">{c.id}</div>
              <div className="text-[11.5px] text-ink-tertiary mt-0.5">{c.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-tertiary">All reports</div>
          <span className="text-[11px] text-ink-tertiary">{filtered.length} report{filtered.length === 1 ? "" : "s"}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({length: 6}).map((_, i) => <SkeletonCard key={i} lines={4} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No reports" description="Adjust your filters or generate a new report." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(r => (
              <Card key={r.id} padding="md" className="hover:border-border-default transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="size-9 grid place-items-center rounded-md bg-primary-50 text-primary-700 shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-2.5 text-sm font-semibold text-ink-primary line-clamp-2">{r.title}</div>
                <p className="mt-1 text-[12px] text-ink-tertiary line-clamp-2">{r.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-ink-tertiary">
                  <div><span className="block">Pages</span><span className="text-ink-primary font-semibold">{r.pages}</span></div>
                  <div><span className="block">Coverage</span><span className="text-ink-primary font-semibold truncate">{r.coverage}</span></div>
                  <div className="col-span-2"><span className="block">Last generated</span><span className="text-ink-primary font-semibold">{r.lastGeneratedAt}</span></div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Button size="sm" variant="outline" leadingIcon={<Eye className="size-3.5" />} onClick={() => setOpen(r)}>Preview</Button>
                  {r.status === "Ready" ? (
                    <Button size="sm" leadingIcon={<Download className="size-3.5" />} onClick={() => pushToast({ tone: "info", title: "Report export started" })}>Download</Button>
                  ) : r.status === "Generating" ? (
                    <Button size="sm" disabled>Generating…</Button>
                  ) : (
                    <Button size="sm" leadingIcon={<Play className="size-3.5" />} onClick={() => pushToast({ tone: "info", title: "Report generation queued" })}>Generate</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.title} description={open?.description} size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(null)}>Close</Button>
            <Button leadingIcon={<Download className="size-3.5" />}>Download PDF</Button>
          </>
        }
      >
        {open && (
          <div className="space-y-3">
            <div className="rounded-md border border-border-subtle p-3 bg-surface-sunken">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold mb-1.5">Report preview</div>
              <div className="text-[12.5px] text-ink-secondary">
                {open.description} Pages: {open.pages}. Coverage: {open.coverage}.
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11.5px]">
                <Stat label="Sector coverage" value="12" />
                <Stat label="Districts" value="15" />
                <Stat label="Employers" value="36" />
              </div>
            </div>
            <ul className="space-y-1.5 text-[12.5px] text-ink-secondary">
              <li>· Executive summary</li>
              <li>· Top demand drivers</li>
              <li>· Skill gap findings</li>
              <li>· Curriculum alignment snapshot</li>
              <li>· District action recommendations</li>
              <li>· Appendix: methodology & glossary</li>
            </ul>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold">{label}</div>
      <div className="text-base font-semibold text-ink-primary tabular">{value}</div>
    </div>
  );
}

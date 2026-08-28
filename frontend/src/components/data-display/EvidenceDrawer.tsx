import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { Skeleton } from "../feedback/States";
import {ExternalLink} from "lucide-react";
import type { Evidence, Recommendation } from "../../types/domain";

export function EvidenceDrawer({ open, onClose, rec }: { open: boolean; onClose: () => void; rec: Recommendation | null }) {
  const { data, loading } = useAsync(async (): Promise<{ all: Evidence[]; matched: Evidence[] }> => {
    if (!rec) return { all: [], matched: [] };
    const r = await api.evidence();
    const all = r.data.evidence as Evidence[];
    const matched = rec.evidenceIds.map(id => all.find(e => e.id === id)).filter(Boolean) as Evidence[];
    return { all, matched };
  }, [rec?.id, open]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={rec ? `Evidence — ${rec.title}` : "Evidence"}
      description="Underlying signals that support this recommendation."
      size="lg"
    >
      {!rec && <div className="text-sm text-ink-tertiary">No recommendation selected.</div>}
      {rec && (
        <div className="space-y-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-tertiary">Recommendation</div>
            <div className="text-sm font-semibold text-ink-primary mt-0.5">{rec.title}</div>
            <p className="text-[13px] text-ink-secondary mt-1">{rec.summary}</p>
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-tertiary mb-1.5">Why this recommendation</div>
              <ul className="space-y-1">
                {rec.why.map((w, i) => (
                  <li key={i} className="text-[12.5px] text-ink-secondary flex items-start gap-1.5">
                    <span className="size-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" aria-hidden="true" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px]">
              <Badge tone="primary" variant="soft">Confidence {rec.confidence}%</Badge>
              <Badge tone="neutral" variant="soft">Impact: {rec.expectedImpact}</Badge>
              <Badge tone="neutral" variant="soft">Scope: {rec.scope.type}</Badge>
              <Badge tone="neutral" variant="soft">Created: {rec.createdAt}</Badge>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-tertiary">Underlying evidence</div>
              <span className="text-[11px] text-ink-muted">{data?.matched.length ?? 0} signals</span>
            </div>
            {loading && (
              <div className="space-y-2">
                {Array.from({length:3}).map((_,i) => <Skeleton key={i} className="h-14" />)}
              </div>
            )}
            {!loading && data && data.matched.length === 0 && (
              <div className="text-sm text-ink-tertiary">No direct evidence referenced.</div>
            )}
            {!loading && data && data.matched.length > 0 && (
              <ul className="space-y-2">
                {data.matched.map(e => (
                  <li key={e.id} className="rounded-md border border-border-subtle bg-surface-sunken p-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-ink-tertiary">
                      <span className="inline-flex h-5 items-center px-1.5 rounded-pill bg-neutral-100 border border-border-subtle font-medium uppercase tracking-wider text-[10px]">{e.kind}</span>
                      <span>{e.source}</span>
                      <span className="ml-auto">{e.date}</span>
                    </div>
                    <div className="text-[12.5px] text-ink-primary mt-1.5 flex items-start justify-between gap-2">
                      <span>{e.summary}</span>
                      {e.value && <span className="text-[12px] font-semibold text-ink-primary tabular shrink-0">{e.value}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-border-subtle pt-3 text-[11.5px] text-ink-tertiary flex items-center gap-1.5">
            <ExternalLink className="size-3" />
            Evidence originates from the platform's labour-market intelligence pipeline. For demo, all values are labelled as
            <span className="font-medium text-ink-secondary"> demo labour-market signals</span>.
          </div>
        </div>
      )}
    </Drawer>
  );
}

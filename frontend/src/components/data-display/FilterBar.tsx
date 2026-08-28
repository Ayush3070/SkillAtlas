import { useState, type ReactNode } from "react";
import {X} from "lucide-react";
import {Search, SlidersHorizontal} from "lucide-react";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";

export interface FilterOption { value: string; label: string; }

export interface FilterDefinition {
  id: string;
  label: string;
  type: "search" | "select" | "segmented";
  options?: FilterOption[];
  placeholder?: string;
  /** default value */
  defaultValue?: string;
}

interface FilterBarProps {
  filters: FilterDefinition[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onReset: () => void;
  activeCount?: number;
  trailing?: ReactNode;
}

export function FilterBar({ filters, values, onChange, onReset, activeCount, trailing }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-surface border border-border-subtle rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-ink-tertiary pr-1">
        <SlidersHorizontal className="size-3.5" />
        <span className="text-[11.5px] font-medium uppercase tracking-wider">Filters</span>
      </div>
      {filters.map(f => {
        const v = values[f.id] ?? f.defaultValue ?? "";
        if (f.type === "search") {
          return (
            <div key={f.id} className="w-56">
              <Input
                placeholder={f.placeholder ?? "Search…"}
                value={v}
                onChange={(e) => onChange(f.id, e.target.value)}
                leadingIcon={<Search className="size-3.5" />}
                aria-label={f.label}
              />
            </div>
          );
        }
        if (f.type === "select") {
          return (
            <div key={f.id} className="w-44">
              <Select
                value={v}
                onChange={(e) => onChange(f.id, e.target.value)}
                aria-label={f.label}
              >
                <option value="">All {f.label}</option>
                {(f.options ?? []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
          );
        }
        if (f.type === "segmented") {
          return (
            <div key={f.id} className="inline-flex items-center bg-neutral-100 rounded-md p-0.5">
              {(f.options ?? []).map(o => {
                const active = (v || f.defaultValue || "") === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(f.id, o.value)}
                    className={[
                      "h-7 px-2.5 text-xs rounded-[5px] transition-colors",
                      active ? "bg-surface text-ink-primary shadow-1" : "text-ink-tertiary hover:text-ink-primary",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          );
        }
        return null;
      })}
      {(activeCount ?? 0) > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-ink-tertiary hover:text-ink-primary"
        >
          <X className="size-3" /> Clear all ({activeCount})
        </button>
      )}
      {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
    </div>
  );
}

/** Active-filter chips row shown below a FilterBar. */
export function ActiveFilterChips({ chips, onRemove }: { chips: { id: string; label: string; value: string }[]; onRemove: (id: string) => void }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map(c => (
        <span key={c.id} className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-pill bg-neutral-100 text-ink-secondary text-[11.5px] border border-border-subtle">
          <span className="text-ink-tertiary">{c.label}:</span>
          <span className="font-medium">{c.value}</span>
          <button
            type="button"
            aria-label={`Remove ${c.label} ${c.value}`}
            className="size-4 grid place-items-center rounded-full hover:bg-neutral-200"
            onClick={() => onRemove(c.id)}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <Button variant="ghost" size="sm" onClick={() => chips.forEach(c => onRemove(c.id))}>Clear all</Button>
    </div>
  );
}

/** Helper hook for managing filter state with default values. */
export function useFilters(defs: FilterDefinition[]) {
  const init: Record<string, string> = {};
  defs.forEach(d => { init[d.id] = d.defaultValue ?? ""; });
  const [values, setValues] = useState<Record<string, string>>(init);
  const set = (id: string, v: string) => setValues(s => ({ ...s, [id]: v }));
  const reset = () => setValues(init);
  return { values, set, reset };
}

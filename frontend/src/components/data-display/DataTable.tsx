import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {ChevronDown, ChevronUp, ChevronsUpDown, Search, ChevronLeft, ChevronRight, Inbox, AlertCircle, RefreshCw, Columns3, Download} from "lucide-react";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";

export interface Column<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Right-align for numeric columns. */
  align?: "left" | "right" | "center";
  width?: string;     // e.g. "160px" or "20%"
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
  /** If false, hidden in default view (and toggleable via Columns). */
  defaultVisible?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  stickyHeader?: boolean;
  /** Stable initial sort. */
  initialSort?: { id: string; dir: "asc" | "desc" };
  onRowClick?: (row: T) => void;
  /** Toolbar slot above the table. */
  toolbar?: ReactNode;
  /** Selection */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Density */
  density?: "compact" | "comfortable";
  /** Optional column visibility toggle. */
  columnToggle?: boolean;
  /** Optional export button. */
  onExport?: () => void;
  /** Caption used for screen readers. */
  caption?: string;
}

type SortState = { id: string; dir: "asc" | "desc" } | null;

export function DataTable<T>({
  data, columns, rowKey, loading, error, emptyTitle = "No results", emptyDescription,
  onRetry, searchable, searchPlaceholder = "Search…", pageSize = 10, stickyHeader,
  initialSort, onRowClick, toolbar, selectable, selectedIds, onSelectedChange,
  density = "comfortable", columnToggle, onExport, caption }: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(initialSort ?? null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map(c => [c.id, c.defaultVisible !== false])),
  );
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const colMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setPage(1); }, [query, size, data]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!colMenuRef.current) return;
      if (!colMenuRef.current.contains(e.target as Node)) setColMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    // Search across all stringified cells; this is robust for moderate datasets.
    return data.filter((row) => {
      const s = JSON.stringify(row).toLowerCase();
      return s.includes(q);
    });
  }, [data, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find(c => c.id === sort.id);
    if (!col || !col.sortValue) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ?  1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort, columns]);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const pageStart = (page - 1) * size;
  const pageRows = sorted.slice(pageStart, pageStart + size);

  const visibleColumns = columns.filter(c => visibleCols[c.id]);
  const allSelected = selectable && pageRows.length > 0 && pageRows.every(r => selectedIds?.includes(rowKey(r)));
  const someSelected = selectable && pageRows.some(r => selectedIds?.includes(rowKey(r))) && !allSelected;

  function toggleSort(col: Column<T>) {
    if (!col.sortable) return;
    setSort((s) => {
      if (!s || s.id !== col.id) return { id: col.id, dir: "asc" };
      if (s.dir === "asc") return { id: col.id, dir: "desc" };
      return null;
    });
  }

  function toggleAll() {
    if (!onSelectedChange) return;
    if (allSelected) {
      onSelectedChange((selectedIds ?? []).filter(id => !pageRows.some(r => rowKey(r) === id)));
    } else {
      const next = new Set(selectedIds ?? []);
      pageRows.forEach(r => next.add(rowKey(r)));
      onSelectedChange(Array.from(next));
    }
  }

  const rowPadY = density === "compact" ? "py-2" : "py-2.5";
  const headerPadY = density === "compact" ? "py-2" : "py-2.5";

  return (
    <div className="bg-surface border border-border-subtle rounded-lg shadow-1 overflow-hidden">
      {(toolbar || searchable || columnToggle || onExport) && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {toolbar}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {searchable && (
              <div className="w-56">
                <Input
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leadingIcon={<Search className="size-3.5" />}
                  aria-label="Search table"
                />
              </div>
            )}
            {columnToggle && (
              <div className="relative" ref={colMenuRef}>
                <Button variant="outline" size="sm" leadingIcon={<Columns3 className="size-3.5" />} onClick={() => setColMenuOpen(v => !v)}>
                  Columns
                </Button>
                {colMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-surface border border-border-default rounded-md shadow-3 p-1 z-overlay">
                    {columns.map(c => (
                      <label key={c.id} className="flex items-center gap-2 px-2 py-1.5 text-xs text-ink-primary hover:bg-neutral-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="size-3.5 accent-[var(--primary-500)]"
                          checked={!!visibleCols[c.id]}
                          onChange={(e) => setVisibleCols(v => ({ ...v, [c.id]: e.target.checked }))}
                        />
                        <span className="truncate">{typeof c.header === "string" ? c.header : c.id}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {onExport && (
              <Button variant="outline" size="sm" leadingIcon={<Download className="size-3.5" />} onClick={onExport}>
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular" role="table" aria-label={caption}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="bg-surface-sunken text-ink-secondary">
              {selectable && (
                <th className={`${headerPadY} pl-4 pr-2 w-9`}>
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    className="size-3.5 accent-[var(--primary-500)]"
                    checked={!!allSelected}
                    ref={(el) => { if (el) el.indeterminate = !!someSelected; }}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {visibleColumns.map((c) => {
                const isSorted = sort?.id === c.id;
                const align = c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left";
                return (
                  <th
                    key={c.id}
                    scope="col"
                    className={`${headerPadY} px-3 text-[11.5px] font-semibold uppercase tracking-wider text-ink-tertiary ${align} ${c.className ?? ""} ${stickyHeader ? "sticky top-0 z-sticky bg-surface-sunken" : ""}`}
                    style={c.width ? { width: c.width } : undefined}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 select-none ${c.sortable ? "hover:text-ink-primary cursor-pointer" : "cursor-default"} ${align === "text-right" ? "flex-row-reverse" : ""}`}
                      onClick={() => toggleSort(c)}
                      aria-sort={isSorted ? (sort?.dir === "asc" ? "ascending" : "descending") : "none"}
                    >
                      <span>{c.header}</span>
                      {c.sortable && (
                        isSorted
                          ? (sort?.dir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)
                          : <ChevronsUpDown className="size-3 opacity-50" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t border-border-subtle">
                  {selectable && <td className={`${rowPadY} pl-4 pr-2`}><div className="shimmer h-3.5 w-3.5" /></td>}
                  {visibleColumns.map(c => (
                    <td key={c.id} className={`${rowPadY} px-3`}>
                      <div className="shimmer h-3.5" style={{ width: `${40 + ((i + c.id.length) % 5) * 8}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            )}
            {!loading && error && (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="py-12">
                  <div className="flex flex-col items-center text-center px-6">
                    <div className="size-9 grid place-items-center rounded-full bg-danger-50 text-danger-600 mb-2">
                      <AlertCircle className="size-4" />
                    </div>
                    <div className="text-sm font-medium text-ink-primary">{error}</div>
                    {onRetry && (
                      <button onClick={onRetry} className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-600 hover:underline">
                        <RefreshCw className="size-3" /> Retry
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {!loading && !error && pageRows.length === 0 && (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="py-12">
                  <div className="flex flex-col items-center text-center px-6">
                    <div className="size-9 grid place-items-center rounded-full bg-neutral-100 text-ink-tertiary mb-2">
                      <Inbox className="size-4" />
                    </div>
                    <div className="text-sm font-medium text-ink-primary">{emptyTitle}</div>
                    {emptyDescription && <div className="text-xs text-ink-tertiary mt-0.5 max-w-md">{emptyDescription}</div>}
                  </div>
                </td>
              </tr>
            )}
            {!loading && !error && pageRows.map((row) => {
              const id = rowKey(row);
              const selected = selectable && selectedIds?.includes(id);
              return (
                <tr
                  key={id}
                  className={[
                    "border-t border-border-subtle transition-colors",
                    onRowClick ? "cursor-pointer hover:bg-neutral-50" : "",
                    selected ? "bg-primary-50/40 hover:bg-primary-50/60" : "",
                  ].join(" ")}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className={`${rowPadY} pl-4 pr-2`} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        className="size-3.5 accent-[var(--primary-500)]"
                        checked={!!selected}
                        onChange={(e) => {
                          const next = new Set(selectedIds ?? []);
                          if (e.target.checked) next.add(id); else next.delete(id);
                          onSelectedChange?.(Array.from(next));
                        }}
                      />
                    </td>
                  )}
                  {visibleColumns.map(c => {
                    const align = c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left";
                    return (
                      <td key={c.id} className={`${rowPadY} px-3 text-ink-primary ${align} ${c.className ?? ""}`}>
                        {c.cell(row)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border-subtle bg-surface-sunken text-xs text-ink-tertiary">
          <div>
            {total === 0 ? "0 results" : <>Showing <span className="text-ink-primary font-medium">{pageStart + 1}</span>–<span className="text-ink-primary font-medium">{Math.min(total, pageStart + size)}</span> of <span className="text-ink-primary font-medium">{total}</span></>}
          </div>
          <div className="flex items-center gap-2">
            <Select
              aria-label="Rows per page"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              containerClassName="w-[110px]"
            >
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
            </Select>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" leadingIcon={<ChevronLeft className="size-3.5" />} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <span className="px-2 tabular text-ink-primary">Page {page} of {pageCount}</span>
              <Button size="sm" variant="outline" trailingIcon={<ChevronRight className="size-3.5" />} onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

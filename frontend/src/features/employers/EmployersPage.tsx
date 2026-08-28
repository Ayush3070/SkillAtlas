import { useState } from "react";
import { Link } from "react-router-dom";
import {Plus, Sparkles} from "lucide-react";
import { PageHeader, DataFreshnessStrip } from "../../components/layout/PageHeader";
import { DataTable, type Column } from "../../components/data-display/DataTable";
import { FilterBar, useFilters } from "../../components/data-display/FilterBar";
import { Badge } from "../../components/ui/Badge";
import { SkeletonTable, ErrorState } from "../../components/feedback/States";
import { useAsync } from "../../hooks/useAsync";
import { api } from "../../services/api";
import { freshness } from "../../data/mock/series";
import { findDistrict } from "../../data/mock/districts";
import type { Employer, Sector } from "../../types/domain";
import { Button } from "../../components/ui/Button";
import { ChartCard, BarSeries, Donut } from "../../components/charts";
import { Modal } from "../../components/ui/Modal";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { pushToast } from "../../components/feedback/Toast";

const SECTORS: Sector[] = ["Automotive & EV","Manufacturing","IT & Software","BFSI & FinTech","Healthcare","Construction & Real Estate","Retail & E-commerce","Logistics & Warehousing","Hospitality","Agriculture & Food Processing","Renewable Energy","Telecommunications"];

export default function EmployersPage() {
  const { values, set, reset } = useFilters([
    { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
    { id: "size", label: "Size", type: "select", options: [
      { value: "Micro", label: "Micro" },
      { value: "Small", label: "Small" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
      { value: "Enterprise", label: "Enterprise" },
    ]},
  ]);
  const { data, loading, error, refetch } = useAsync(() => api.employers().then(r => r.data), []);
  const [submitOpen, setSubmitOpen] = useState(false);

  const filtered = (data?.employers ?? []).filter((e: Employer) => {
    if (values.sector && e.sector !== values.sector) return false;
    if (values.size && e.size !== values.size) return false;
    return true;
  });

  const cols: Column<Employer>[] = [
    { id: "name", header: "Employer", sortable: true, sortValue: e => e.name,
      cell: e => (
        <Link to={`/employers/${e.id}`} className="flex items-center gap-2 min-w-0">
          <span className="size-7 grid place-items-center rounded-md bg-neutral-100 text-ink-tertiary text-[10.5px] font-semibold">{e.name.split(" ").slice(0,2).map(w => w[0]).join("")}</span>
          <span className="min-w-0">
            <span className="text-ink-primary font-medium truncate block">{e.name}</span>
            <span className="text-[11px] text-ink-tertiary truncate block">{e.sector} · {e.size}</span>
          </span>
        </Link>
      ) },
    { id: "district", header: "District", cell: e => <span className="text-ink-secondary">{findDistrict(e.districtId)?.name ?? e.districtId}</span> },
    { id: "hiring", header: "Hiring / yr", align: "right", sortable: true, sortValue: e => e.hiringVolumeAnnual, cell: e => <span className="tabular font-semibold">{e.hiringVolumeAnnual.toLocaleString("en-IN")}</span> },
    { id: "roles", header: "Validated roles", align: "right", cell: e => <span className="tabular">{e.validatedRoles}</span> },
    { id: "validation", header: "Validation", align: "right", cell: e => <div className="inline-flex items-center gap-1.5 justify-end"><div className="w-16 h-1.5 rounded-pill bg-neutral-100"><div className="h-full bg-primary-500 rounded-pill" style={{ width: `${e.surveyParticipation}%` }} /></div><span className="tabular text-[12px]">{e.surveyParticipation}%</span></div> },
    { id: "satisfaction", header: "Satisfaction", align: "right", cell: e => <Badge tone={e.satisfaction >= 80 ? "success" : e.satisfaction >= 70 ? "warning" : "danger"}>{e.satisfaction}%</Badge> },
    { id: "updated", header: "Last updated", cell: e => <span className="text-ink-tertiary">{e.lastUpdated}</span> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employers"
        description="Demand-side truth — what employers actually need, validated and ready to inform curriculum."
        demo
        meta={<DataFreshnessStrip label="Employer view" updatedAt={freshness.updatedAt} coverageFrom={freshness.coverageFrom} coverageTo={freshness.coverageTo} confidence={freshness.confidence} source={freshness.source} />}
        controls={
          <Button leadingIcon={<Plus className="size-3.5" />} onClick={() => setSubmitOpen(true)}>Submit requirement</Button>
        }
      />

      <FilterBar
        filters={[
          { id: "sector", label: "Sector", type: "select", options: SECTORS.map(s => ({ value: s, label: s })) },
          { id: "size", label: "Size", type: "select", options: [
            { value: "Micro", label: "Micro" },
            { value: "Small", label: "Small" },
            { value: "Medium", label: "Medium" },
            { value: "Large", label: "Large" },
            { value: "Enterprise", label: "Enterprise" },
          ]},
          { id: "q", label: "Search", type: "search", placeholder: "Search employer…" },
        ]}
        values={values}
        onChange={set}
        onReset={reset}
        activeCount={Object.values(values).filter(Boolean).length}
      />

      {error && <ErrorState title="Employer data could not be loaded" description={error} onRetry={refetch} />}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {loading ? (<>
          <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
          <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
          <div className="h-64 rounded-lg bg-surface border border-border-subtle animate-pulse" />
        </>) : (
          <>
            <ChartCard title="Employer count by sector" description="Across 36 validated employers." height={260}>
              <BarSeries
                data={Object.entries(
                  (data?.employers ?? []).reduce<Record<string, number>>((acc, e) => { acc[e.sector] = (acc[e.sector] ?? 0) + 1; return acc; }, {})
                ).map(([sector, count]) => ({ name: sector, count }))}
                bars={[{ key: "count", label: "Employers", color: "var(--chart-1)" }]}
              />
            </ChartCard>
            <ChartCard title="Validation rate" description="Average across employers." height={260}>
              <Donut
                data={[
                  { name: "Validated", value: 22, color: "var(--success-500)" },
                  { name: "Pending", value: 9, color: "var(--warning-500)" },
                  { name: "Needs review", value: 4, color: "var(--info-500)" },
                  { name: "Rejected", value: 1, color: "var(--danger-500)" },
                ]}
                centerLabel={{ primary: "78%", secondary: "validated" }}
              />
            </ChartCard>
            <ChartCard title="Satisfaction distribution" description="Self-reported by employers." height={260}>
              <BarSeries
                data={[
                  { name: "<60", count: 2 },
                  { name: "60–70", count: 4 },
                  { name: "70–80", count: 11 },
                  { name: "80–90", count: 16 },
                  { name: "≥90", count: 3 },
                ]}
                bars={[{ key: "count", label: "Employers", color: "var(--chart-2)" }]}
              />
            </ChartCard>
          </>
        )}
      </section>

      {loading ? <SkeletonTable rows={6} cols={7} /> : (
        <DataTable
          data={filtered}
          columns={cols}
          rowKey={e => e.id}
          caption="Employers"
          onRowClick={e => { window.location.href = `/employers/${e.id}`; }}
          searchable={false}
          columnToggle
          onExport={() => {}}
        />
      )}

      <SubmitRequirementModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
}

function SubmitRequirementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [employer, setEmployer] = useState("emp-tata-motors");
  const [role, setRole] = useState("rl-ev-technician");
  const [skill, setSkill] = useState("sk-battery-diagnostics");
  const [proficiency, setProficiency] = useState("Advanced");
  const [equipment, setEquipment] = useState("Insulated tools 1000V, Hi-pot tester");
  const [certifications, setCertifications] = useState("NSQF, EV Service L4");

  function submit() {
    onClose();
    pushToast({ tone: "success", title: "Requirement submitted", description: "Validation workflow has started." });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Submit employer requirement"
      description="Capture hiring expectations, skill needs and equipment expectations from the employer."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} leadingIcon={<Sparkles className="size-3.5" />}>Submit for validation</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select label="Employer" value={employer} onChange={(e) => setEmployer(e.target.value)} required>
          <option value="emp-tata-motors">Tata Motors Ltd.</option>
          <option value="emp-infosys">Infosys</option>
          <option value="emp-apollo">Apollo Hospitals</option>
        </Select>
        <Select label="Job role" value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="rl-ev-technician">EV Service Technician</option>
          <option value="rl-cloud-engineer">Cloud / DevOps Engineer</option>
          <option value="rl-mri-tech">MRI Technician</option>
        </Select>
        <Select label="Primary skill" value={skill} onChange={(e) => setSkill(e.target.value)} required>
          <option value="sk-battery-diagnostics">Battery Diagnostics</option>
          <option value="sk-can-bus">CAN Bus</option>
          <option value="sk-cloud-aws">AWS Cloud</option>
        </Select>
        <Select label="Required proficiency" value={proficiency} onChange={(e) => setProficiency(e.target.value)} required>
          <option>Basic</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Expert</option>
        </Select>
        <Input label="Equipment expectations" value={equipment} onChange={(e) => setEquipment(e.target.value)} containerClassName="sm:col-span-2" />
        <Input label="Certifications preferred" value={certifications} onChange={(e) => setCertifications(e.target.value)} containerClassName="sm:col-span-2" />
        <Textarea label="Notes (optional)" placeholder="Any additional context…" containerClassName="sm:col-span-2" />
      </div>
    </Modal>
  );
}

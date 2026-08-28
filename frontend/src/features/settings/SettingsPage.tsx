import { useState } from "react";
import { Card, CardRow } from "../../components/ui/Card";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { useAuth, type Role } from "../../services/api/auth";
import { pushToast } from "../../components/feedback/Toast";
import { Badge } from "../../components/ui/Badge";
import { useTheme, type Theme } from "../../services/api/theme";
import { Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { user, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user.name);
  const [org, setOrg] = useState(user.organization);
  const [email, setEmail] = useState("a.kulkarni@maharashtra.gov.in");
  const [district, setDistrict] = useState(user.districtId ?? "pune");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" description="Personalise your SkillPulse workspace." demo />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card title="Profile">
          <div className="space-y-3">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Organization" value={org} onChange={(e) => setOrg(e.target.value)} />
            <Select label="Default district" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="pune">Pune</option>
              <option value="mumbai">Mumbai</option>
              <option value="nashik">Nashik</option>
            </Select>
            <div className="flex items-center gap-2">
              <Button onClick={() => pushToast({ tone: "success", title: "Profile saved" })}>Save changes</Button>
              <Button variant="outline" onClick={() => { setName(user.name); setOrg(user.organization); }}>Reset</Button>
            </div>
          </div>
        </Card>

        <Card title="Role & access">
          <div className="space-y-3">
            <div>
              <div className="text-[11.5px] font-medium text-ink-secondary mb-1.5">Current role</div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="primary" variant="soft">{user.role}</Badge>
                <span className="text-[11.5px] text-ink-tertiary">You can switch role for the demo. Real RBAC will be enforced by the backend.</span>
              </div>
            </div>
            <div>
              <div className="text-[11.5px] font-medium text-ink-secondary mb-1.5">Switch role</div>
              <div className="grid grid-cols-2 gap-2">
                {(["Government Administrator","Training Institute","Employer","Candidate"] as Role[]).map(r => (
                  <button key={r} type="button" onClick={() => switchRole(r)}
                    className={["text-left rounded-md border p-2.5 text-[12.5px] transition-colors", user.role === r ? "border-primary-500 bg-primary-50/40 text-primary-700 font-semibold" : "border-border-default hover:bg-neutral-50 text-ink-primary"].join(" ")}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-info-100 bg-info-50/40 p-2.5 text-[12px] text-info-700">
              Backend integration deferred — the role here influences navigation in the demo and prepares the architecture for authenticated API calls later.
            </div>
          </div>
        </Card>

        <Card title="Display & accessibility">
          <div className="space-y-2.5">
            <Toggle label="Reduce motion" description="Honour the OS-level preference and minimise transitions." value={reduceMotion} onChange={setReduceMotion} />
            <Toggle label="Compact density" description="Tighter table rows and reduced padding." value={compact} onChange={setCompact} />
            <Toggle label="High contrast" description="Increase contrast for accessibility." value={false} onChange={() => {}} />
          </div>
        </Card>

        <Card title="Notifications">
          <div className="space-y-2.5">
            <Toggle label="Email digests" description="Weekly labour-market intelligence digest." value={true} onChange={() => {}} />
            <Toggle label="Signal alerts" description="Notify when critical demand signals fire for selected districts." value={true} onChange={() => {}} />
            <Toggle label="Validation updates" description="Notify when employer validations change status." value={false} onChange={() => {}} />
            <Toggle label="Plan generation" description="Notify when district training plans complete." value={true} onChange={() => {}} />
          </div>
        </Card>

        <Card title="Data preferences">
          <CardRow label="Coverage" value="Maharashtra" />
          <CardRow label="Default period" value="Last 12 months" />
          <CardRow label="Currency" value="INR" />
          <CardRow label="Time zone" value="Asia / Kolkata (UTC+5:30)" />
        </Card>

        <Card title="About">
          <div className="text-[12.5px] text-ink-secondary space-y-1.5">
            <p><span className="font-medium text-ink-primary">SkillPulse</span> · Labour Market Intelligence Platform</p>
            <p>SIH 2026 · Problem 134 · Demo build</p>
            <p>All values are labelled as <span className="font-medium text-ink-primary">demo labour-market signals</span> until connected to a real backend.</p>
            <Button variant="outline" onClick={() => pushToast({ tone: "info", title: "Demo data reset queued" })}>Reset demo data</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={["relative shrink-0 w-9 h-5 rounded-pill transition-colors", value ? "bg-primary-500" : "bg-neutral-300"].join(" ")}
      >
        <span className={["absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-1 transition-transform", value ? "translate-x-4" : "translate-x-0"].join(" ")} />
      </button>
      <div className="min-w-0">
        <div className="text-sm text-ink-primary">{label}</div>
        {description && <div className="text-[11.5px] text-ink-tertiary">{description}</div>}
      </div>
    </label>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth, type Role } from "../../services/api/auth";
import {Lock, Mail, ShieldCheck, Building2, GraduationCap, Briefcase} from "lucide-react";

const ROLES: { id: Role; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { id: "Government Administrator", icon: ShieldCheck,  description: "Plan, monitor and act on labour-market intelligence." },
  { id: "Training Institute",       icon: Building2,     description: "Update curricula, allocate seats and manage placements." },
  { id: "Employer",                 icon: Briefcase,     description: "Validate roles, signal demand and shape programmes." },
  { id: "Candidate",                icon: GraduationCap, description: "Explore careers, courses and personalised pathways." },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [role, setRole] = useState<Role>("Government Administrator");
  const [email, setEmail] = useState("a.kulkarni@maharashtra.gov.in");
  const [password, setPassword] = useState("••••••••");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    signIn(role);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-surface-inverse text-white p-10 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="size-8 grid place-items-center rounded-md bg-primary-500 text-white">
            <BrandMark />
          </div>
          <div>
            <div className="text-sm font-semibold">SkillPulse</div>
            <div className="text-[11px] text-white/60">Labour Market Intelligence</div>
          </div>
        </div>

        <div className="max-w-md">
          <div className="text-[10.5px] uppercase tracking-wider text-white/50 font-semibold">SIH 2026 · Problem 134</div>
          <h1 className="text-3xl font-semibold mt-2 leading-tight tracking-tight">From labour-market evidence to training decisions.</h1>
          <p className="text-white/70 text-sm mt-3 leading-relaxed">
            SkillPulse turns industry signals into skill-gap detection, curriculum alignment and district action plans for
            Maharashtra's skill-development authorities.
          </p>
          <ul className="mt-5 space-y-1.5 text-[12.5px] text-white/75">
            <li className="flex items-center gap-2"><Dot /> 2,300+ active labour-market signals</li>
            <li className="flex items-center gap-2"><Dot /> 36 validated employer requirements</li>
            <li className="flex items-center gap-2"><Dot /> 15 districts · 12 sectors · 36 courses</li>
          </ul>
        </div>

        <div className="text-[11px] text-white/50">
          Demo build · Mock authentication · Backend integration deferred to production
        </div>

        {/* Subtle decorative line */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute -right-24 -bottom-24 opacity-20" width="600" height="600" viewBox="0 0 600 600" fill="none">
            <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="220" stroke="white" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="160" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-tertiary font-semibold">Sign in</div>
          <h2 className="text-2xl font-semibold text-ink-primary mt-1">Welcome back</h2>
          <p className="text-sm text-ink-tertiary mt-1">Choose a role to explore the demo experience. No real credentials required.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <div className="text-xs font-medium text-ink-secondary mb-2">Choose role</div>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={[
                        "text-left rounded-md border p-2.5 transition-colors",
                        active ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/30" : "border-border-default hover:border-border-strong hover:bg-neutral-50",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={["size-3.5", active ? "text-primary-600" : "text-ink-tertiary"].join(" ")} />
                        <span className={["text-[12.5px] font-medium", active ? "text-primary-700" : "text-ink-primary"].join(" ")}>{r.id}</span>
                      </div>
                      <div className="text-[10.5px] text-ink-tertiary mt-1 leading-snug">{r.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leadingIcon={<Mail className="size-3.5" />}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leadingIcon={<Lock className="size-3.5" />}
              required
            />

            <div className="flex items-center justify-between text-[11.5px] text-ink-tertiary">
              <label className="inline-flex items-center gap-1.5">
                <input type="checkbox" defaultChecked className="size-3.5 accent-[var(--primary-500)]" /> Remember me
              </label>
              <a className="hover:text-ink-primary" href="#">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth>Continue to SkillPulse</Button>
            <div className="text-[11px] text-ink-muted text-center">
              By continuing, you agree to the demo terms. No real authentication is performed.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dot() { return <span className="size-1.5 rounded-full bg-primary-400" aria-hidden="true" />; }
function BrandMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17 L9 7 L13 13 L17 9 L21 17" />
      <circle cx="13" cy="13" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

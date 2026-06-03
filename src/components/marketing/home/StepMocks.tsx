import { Check, ShieldCheck, FileText, GitBranch, Sparkles, Lock, Coins, Database, Cpu } from "lucide-react";

/**
 * Lightweight UI mocks used inside GetStartedPlan to show what LIZA
 * actually looks/feels like at each step. Pure CSS, no real data.
 */

function MockChrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background shadow-[0_8px_32px_-12px_hsl(var(--primary)/0.18)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/40">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 text-[10px] font-mono text-muted-foreground tracking-tight">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ── Step 1: Org boundaries / control plane ── */
export function MockStandardEditor() {
  const rules = [
    {
      icon: Database,
      label: "Data access",
      value: "GTM data: Sales + RevOps only",
      pill: "Enforced",
    },
    {
      icon: Lock,
      label: "PII handling",
      value: "Redacted before any external model",
      pill: "Enforced",
    },
    {
      icon: Cpu,
      label: "Approved models",
      value: "GPT-5 · Claude 4 · Internal Llama",
      pill: "3 active",
    },
    {
      icon: Coins,
      label: "Token budget",
      value: "€2,500 / team / month · hard cap",
      pill: "On",
    },
  ];
  return (
    <MockChrome title="liza · org / boundaries">
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold">Org control plane</span>
          </div>
          <span
            className="text-[9px] font-black tracking-[0.15em] uppercase px-1.5 py-0.5 rounded"
            style={{ background: "hsl(var(--brand-green) / 0.15)", color: "hsl(var(--brand-green))" }}
          >
            Live
          </span>
        </div>
        {rules.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--primary) / 0.08)" }}
              >
                <Icon className="w-3 h-3 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground leading-tight">
                  {r.label}
                </p>
                <p className="text-[11px] text-foreground/85 leading-tight truncate">
                  {r.value}
                </p>
              </div>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                style={{ background: "hsl(var(--muted) / 0.5)", color: "hsl(var(--foreground) / 0.7)" }}
              >
                {r.pill}
              </span>
            </div>
          );
        })}
        <div className="pt-2 mt-1 border-t border-border/60 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Sparkles className="w-3 h-3 text-primary" />
          Applied to every prompt across every AI surface
        </div>
      </div>
    </MockChrome>
  );
}

/* ── Step 2: A run with traceable lineage ── */
export function MockRun() {
  return (
    <MockChrome title="liza · runs / acme-discovery-2026-06-03">
      <div className="space-y-3">
        <div className="rounded-md bg-muted/40 p-2.5">
          <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
            Prompt
          </p>
          <p className="text-[11px] text-foreground/80">
            Summarise today's call with Acme. Surface budget and decision timeline.
          </p>
        </div>
        <div
          className="rounded-md p-2.5 border"
          style={{
            borderColor: "hsl(var(--brand-green) / 0.3)",
            background: "hsl(var(--brand-green) / 0.05)",
          }}
        >
          <p className="text-[9px] font-bold tracking-wider uppercase mb-1" style={{ color: "hsl(var(--brand-green))" }}>
            Output · signed
          </p>
          <p className="text-[11px] text-foreground/80 leading-snug">
            Problem: manual NPS reporting eats 6h/week. Budget: 40k Q3.
            Decision: VP Ops + CFO, sign-off by July 12.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { icon: ShieldCheck, label: "Standard #03 v3" },
            { icon: GitBranch, label: "gpt-5 · 1.2k tok" },
            { icon: Check, label: "Replayable" },
          ].map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground) / 0.7)",
                background: "hsl(var(--muted) / 0.3)",
              }}
            >
              <b.icon className="w-2.5 h-2.5" />
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </MockChrome>
  );
}

/* ── Step 3: KPIs dashboard ── */
export function MockDashboard() {
  const tiles = [
    { label: "Workflows live", value: "12", delta: "+9" },
    { label: "Token spend / outcome", value: "€0.18", delta: "-62%" },
    { label: "Standard adherence", value: "94%", delta: "+38pt" },
    { label: "Replayable outputs", value: "100%", delta: "" },
  ];
  // simple sparkline path
  const points = [4, 8, 7, 12, 14, 13, 18, 22, 21, 28, 31, 36];
  const max = Math.max(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - (p / max) * 28;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <MockChrome title="liza · dashboard / rollout-q3">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-md border border-border bg-muted/20 p-2.5">
              <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
                {t.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black">{t.value}</span>
                {t.delta && (
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "hsl(var(--brand-green))" }}
                  >
                    {t.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border bg-muted/20 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
              Governed workflows · 90 days
            </p>
            <span className="text-[9px] font-bold" style={{ color: "hsl(var(--brand-green))" }}>
              +800%
            </span>
          </div>
          <svg viewBox="0 0 100 32" className="w-full h-10" preserveAspectRatio="none">
            <path
              d={`${path} L 100 32 L 0 32 Z`}
              fill="hsl(var(--brand-green) / 0.15)"
            />
            <path d={path} fill="none" stroke="hsl(var(--brand-green))" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </MockChrome>
  );
}
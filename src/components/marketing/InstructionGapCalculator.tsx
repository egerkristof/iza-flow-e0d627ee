import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Calculator,
  TrendingDown,
  Copy,
  UserMinus,
  Split,
  GraduationCap,
  Layers,
  Zap,
  Brain,
  ArrowUpRight,
  Network,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { DEPARTMENTS } from "./calculator/departments";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const TEAM_TAX_CARDS = [
  {
    key: "duplication",
    icon: Copy,
    label: "Duplication Tax",
    desc: "Team members independently solving problems a colleague already figured out.",
  },
  {
    key: "inconsistency",
    icon: Split,
    label: "Inconsistency Tax",
    desc: "Cross-checking and aligning different AI outputs across the team.",
  },
  {
    key: "attrition",
    icon: UserMinus,
    label: "Attrition Tax",
    desc: "Rebuilding AI expertise lost when team members leave.",
  },
  {
    key: "onboarding",
    icon: GraduationCap,
    label: "Onboarding Tax",
    desc: "New hires building AI workflows from scratch with no codified processes.",
  },
] as const;

const ORG_TAX_CARDS = [
  {
    key: "handoff",
    icon: Network,
    label: "Handoff Friction Tax",
    desc: "Adjacent teams re-contextualizing AI outputs that cross boundaries without shared standards.",
  },
  {
    key: "shadowGovernance",
    icon: ShieldCheck,
    label: "Shadow Governance Tax",
    desc: "Each department independently building its own AI review and QA processes.",
  },
] as const;

const FORWARD_METRICS = [
  {
    icon: Brain,
    label: "Knowledge Capture Rate",
    getValue: () => "~0%",
    contrast: "AI-native teams: 60-80%",
    desc: "Percentage of AI interactions that become reusable organizational intelligence.",
  },
  {
    icon: Zap,
    label: "Execution Cycle Time",
    getValue: (deptHours: number) => `~${Math.round(deptHours * 1.5)}h`,
    contrast: "AI-native teams: 3-4× faster",
    desc: "Average time from decision to governed AI execution.",
  },
  {
    icon: ArrowUpRight,
    label: "Delegation Capacity",
    getValue: (_: number, teamSize: number) =>
      `~${Math.min(25, Math.round(10 + teamSize * 0.15))}%`,
    contrast: "AI-native teams: 60-75%",
    desc: "Percentage of expert work safely delegatable to junior team members + AI.",
  },
] as const;

export default function InstructionGapCalculator() {
  const [teamSize, setTeamSize] = useState(25);
  const [department, setDepartment] = useState("operations");
  const [hourlyCost, setHourlyCost] = useState(75);

  const dept = DEPARTMENTS.find((d) => d.value === department)!;
  const p = dept.taxProfile;

  const calc = useMemo(() => {
    const reworkAnnual = teamSize * dept.hours * hourlyCost * 52;

    // Team-level taxes (department-specific rates)
    const duplication = reworkAnnual * p.duplication;
    const inconsistency = reworkAnnual * p.inconsistency;
    const attrition = teamSize * p.turnover * (dept.hours * hourlyCost * p.attritionWeeks);
    const onboarding = teamSize * p.turnover * (dept.hours * hourlyCost * p.onboardingWeeks);
    const teamSubtotal = duplication + inconsistency + attrition + onboarding;

    // Organizational taxes (scale with assumed 3 adjacent teams)
    const adjacentTeams = 3;
    const handoff = reworkAnnual * p.handoffFriction * adjacentTeams;
    const shadowGovernance = adjacentTeams * p.shadowGovernanceHours * hourlyCost * 52;
    const orgSubtotal = handoff + shadowGovernance;

    const totalGap = reworkAnnual + teamSubtotal + orgSubtotal;

    return {
      reworkAnnual,
      reworkMonthly: reworkAnnual / 12,
      reworkRecoverable: reworkAnnual * 0.65,
      duplication,
      inconsistency,
      attrition,
      onboarding,
      teamSubtotal,
      handoff,
      shadowGovernance,
      orgSubtotal,
      totalGap,
      recoverable: totalGap * 0.65,
      taxes: { duplication, inconsistency, attrition, onboarding, handoff, shadowGovernance } as Record<string, number>,
    };
  }, [teamSize, dept.hours, hourlyCost, p]);

  return (
    <section className="pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border"
            style={{
              color: "hsl(var(--primary))",
              borderColor: "hsl(var(--primary) / 0.25)",
              background: "hsl(var(--primary) / 0.06)",
            }}
          >
            <Calculator className="w-3.5 h-3.5" />
            Instruction Gap Tax
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Adjust the inputs. Sources: Zapier (n=1,100), Workday 2026.
          </p>
        </div>

        {/* Main calculator card */}
        <div
          className="rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Team members using AI: <span className="text-primary">{teamSize}</span>
                </Label>
                <Slider
                  value={[teamSize]}
                  onValueChange={([v]) => setTeamSize(v)}
                  min={5}
                  max={200}
                  step={1}
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>5</span>
                  <span>200</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Department
                </Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label} — {d.hours}h rework/wk
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Rework hours sourced from Zapier AI Workslop Report, Jan 2026
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  Fully-loaded hourly cost: <span className="text-primary">€{hourlyCost}</span>
                </Label>
                <Slider
                  value={[hourlyCost]}
                  onValueChange={([v]) => setHourlyCost(v)}
                  min={40}
                  max={150}
                  step={5}
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>€40</span>
                  <span>€150</span>
                </div>
              </div>
            </div>

            {/* Anchor output */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Direct AI rework cost
                </p>
                <p className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-1">
                  {formatCurrency(calc.reworkMonthly)}
                  <span className="text-lg font-medium text-muted-foreground">/month</span>
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-3">
                  {formatCurrency(calc.reworkAnnual)}/year
                </p>
                <div
                  className="rounded-lg px-3 py-2.5 mb-4"
                  style={{ background: "hsl(var(--primary) / 0.08)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                    <p className="text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>
                      Recoverable: {formatCurrency(calc.reworkRecoverable)}/year
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Teams with governed AI instruction sets typically reclaim ~65% of rework cost by replacing ad-hoc prompting with reusable, standardized patterns.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  This is only the visible cost. The structural taxes below compound underneath.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team-level taxes — progressive disclosure */}
        <ProgressiveSection
          eyebrow="Department-level taxes"
          summary="Hidden costs compounding inside your team"
          summaryValue={calc.teamSubtotal}
          opacity={0.85}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {TEAM_TAX_CARDS.map((tax) => (
              <TaxCard key={tax.key} tax={tax} value={calc.taxes[tax.key]} />
            ))}
          </div>
          <div
            className="mt-3 rounded-lg px-4 py-2.5 flex items-center justify-between"
            style={{ background: "hsl(var(--muted) / 0.4)" }}
          >
            <p className="text-xs font-semibold text-muted-foreground">Department subtotal</p>
            <p className="text-sm font-black text-foreground">{formatCurrency(calc.teamSubtotal)}/year</p>
          </div>
        </ProgressiveSection>

        {/* Organizational taxes — progressive disclosure, lighter still */}
        <ProgressiveSection
          eyebrow="Organizational ripple"
          summary="Costs that spread across adjacent teams"
          summaryValue={calc.orgSubtotal}
          opacity={0.7}
        >
          <p className="text-[11px] text-muted-foreground mt-3 mb-4 max-w-md">
            These costs compound across team boundaries. Estimates assume ~3 adjacent departments interacting with yours.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ORG_TAX_CARDS.map((tax) => (
              <TaxCard key={tax.key} tax={tax} value={calc.taxes[tax.key]} isOrg />
            ))}
          </div>
          <div
            className="mt-3 rounded-lg px-4 py-2.5 flex items-center justify-between"
            style={{ background: "hsl(var(--muted) / 0.4)" }}
          >
            <p className="text-xs font-semibold text-muted-foreground">Organizational subtotal</p>
            <p className="text-sm font-black text-foreground">{formatCurrency(calc.orgSubtotal)}/year</p>
          </div>
        </ProgressiveSection>

        {/* Total Instruction Gap Tax */}
        <div
          className="mt-6 rounded-2xl border p-6"
          style={{
            borderColor: "hsl(var(--primary) / 0.3)",
            background: "hsl(var(--primary) / 0.04)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">
                  Total Instruction Gap Tax
                </p>
              </div>
              <p className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                {formatCurrency(calc.totalGap)}
                <span className="text-base font-medium text-muted-foreground">/year</span>
              </p>
            </div>
            <div
              className="rounded-xl p-4 md:max-w-xs"
              style={{ background: "hsl(var(--primary) / 0.08)" }}
            >
              <div className="flex items-start gap-3">
                <TrendingDown
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "hsl(var(--primary))" }}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Recoverable: {formatCurrency(calc.recoverable)}/year
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Organizations with governed AI instruction sets report 60-70% reduction across all dimensions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forward-looking AI-native metrics */}
        <div className="mt-10">
          <div className="text-center mb-5">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2">
              What AI-native organizations measure instead
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              The metrics that don't exist in your organization yet.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FORWARD_METRICS.map((metric) => {
              const Icon = metric.icon;
              const currentValue = metric.getValue(dept.hours, teamSize);
              return (
                <div
                  key={metric.label}
                  className="rounded-xl border p-4 text-center"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: "hsl(var(--primary) / 0.08)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    {currentValue}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">Your estimated current state</p>
                  <div
                    className="rounded-lg px-3 py-1.5 inline-block"
                    style={{ background: "hsl(var(--primary) / 0.08)" }}
                  >
                    <p className="text-[11px] font-semibold" style={{ color: "hsl(var(--primary))" }}>
                      {metric.contrast}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-2">
                    {metric.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnotes */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Department-specific tax profiles. Recovery rate based on 65% midpoint reported with structured governance. Full methodology above.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Tax Card ─── */

function TaxCard({
  tax,
  value,
  isOrg,
}: {
  tax: { key: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; desc: string };
  value: number;
  isOrg?: boolean;
}) {
  const Icon = tax.icon;
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--primary) / 0.08)" }}
        >
          <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground">{tax.label}</p>
            {isOrg && (
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  color: "hsl(var(--primary))",
                  background: "hsl(var(--primary) / 0.08)",
                }}
              >
                Org
              </span>
            )}
          </div>
          <p className="text-xl font-black text-foreground tracking-tight mt-0.5">
            {formatCurrency(value)}
            <span className="text-xs font-medium text-muted-foreground">/year</span>
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
            {tax.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Progressive Section (collapsible, opacity-attenuated) ─── */

function ProgressiveSection({
  eyebrow,
  summary,
  summaryValue,
  opacity,
  children,
}: {
  eyebrow: string;
  summary: string;
  summaryValue: number;
  opacity: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4" style={{ opacity: open ? 1 : opacity, transition: "opacity 0.3s ease" }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className="w-full rounded-xl border px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors text-left group"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ChevronDown className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                {eyebrow}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">{summary}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-black text-foreground tracking-tight">
              {formatCurrency(summaryValue)}
              <span className="text-[11px] font-medium text-muted-foreground">/yr</span>
            </p>
            <p className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
              {open ? "Hide details" : "Show details"}
            </p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible>
    </div>
  );
}

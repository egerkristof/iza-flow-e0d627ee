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
} from "lucide-react";

const DEPARTMENTS = [
  { value: "engineering", label: "Engineering / IT / Data", hours: 5.0 },
  { value: "finance", label: "Finance & Accounting", hours: 4.6 },
  { value: "bizdev", label: "Business Development", hours: 3.9 },
  { value: "operations", label: "Operations & Supply Chain", hours: 3.9 },
  { value: "hr", label: "Human Resources", hours: 3.8 },
  { value: "product", label: "Product Development", hours: 3.8 },
  { value: "legal", label: "Legal", hours: 3.6 },
  { value: "marketing", label: "Marketing", hours: 3.3 },
  { value: "sales", label: "Sales & Support", hours: 3.0 },
  { value: "pm", label: "Project Management", hours: 2.8 },
] as const;

const RECOVERY_RATE = 0.65;
const DUPLICATION_RATE = 0.25;
const INCONSISTENCY_RATE = 0.20;
const TURNOVER_RATE = 0.15;
const ATTRITION_RAMP_WEEKS = 8;
const ONBOARDING_RAMP_WEEKS = 6;
const ADJACENT_TEAMS = 3;
const HANDOFF_FRICTION_RATE = 0.18;
const SHADOW_GOVERNANCE_HOURS = 3;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const TAX_CARDS = [
  {
    key: "duplication",
    icon: Copy,
    label: "Duplication Tax",
    desc: "Team members independently solving problems a colleague already figured out.",
    assumption: "~25% of rework is redundant effort across team members",
  },
  {
    key: "inconsistency",
    icon: Split,
    label: "Inconsistency Tax",
    desc: "Cross-checking and aligning different AI outputs across the team.",
    assumption: "~20% of rework hours spent reconciling divergent outputs",
  },
  {
    key: "attrition",
    icon: UserMinus,
    label: "Attrition Tax",
    desc: "Rebuilding AI expertise lost when team members leave. Knowledge walks out the door.",
    assumption: "~15% annual turnover × 8-week expertise reconstruction",
  },
  {
    key: "onboarding",
    icon: GraduationCap,
    label: "Onboarding Tax",
    desc: "New hires building AI workflows from scratch with no codified processes to inherit.",
    assumption: "~15% turnover-driven hires × 6-week ramp to baseline",
  },
  {
    key: "handoff",
    icon: ArrowUpRight,
    label: "Handoff Friction Tax",
    desc: "Adjacent teams re-contextualizing and re-prompting AI outputs that cross team boundaries without shared standards.",
    assumption: "~3 adjacent teams × 18% of rework baseline lost in translation per boundary",
  },
  {
    key: "shadowGovernance",
    icon: Layers,
    label: "Shadow Governance Tax",
    desc: "Each department independently building its own AI review and QA processes. Legal, Marketing, Product all reinventing the same quality gates.",
    assumption: "~3h/week per adjacent team in duplicated governance effort",
  },
] as const;

const FORWARD_METRICS = [
  {
    icon: Brain,
    label: "Knowledge Capture Rate",
    getValue: () => "~0%",
    contrast: "AI-native teams: 60-80%",
    desc: "Percentage of AI interactions that become reusable organizational intelligence. Currently, learnings die in individual chat histories.",
  },
  {
    icon: Zap,
    label: "Execution Cycle Time",
    getValue: (deptHours: number) => `~${Math.round(deptHours * 1.5)}h`,
    contrast: "AI-native teams: 3-4× faster",
    desc: "Average time from decision to governed AI execution. Without playbooks, every task starts from a blank prompt.",
  },
  {
    icon: ArrowUpRight,
    label: "Delegation Capacity",
    getValue: (_, teamSize: number) => `~${Math.min(25, Math.round(10 + teamSize * 0.15))}%`,
    contrast: "AI-native teams: 60-75%",
    desc: "Percentage of expert work that can be safely delegated to junior team members + AI. Without governed standards, seniors must review everything.",
  },
] as const;

export default function InstructionGapCalculator() {
  const [teamSize, setTeamSize] = useState(25);
  const [department, setDepartment] = useState("operations");
  const [hourlyCost, setHourlyCost] = useState(75);

  const dept = DEPARTMENTS.find((d) => d.value === department)!;

  const calculations = useMemo(() => {
    const reworkAnnual = teamSize * dept.hours * hourlyCost * 52;
    const duplication = reworkAnnual * DUPLICATION_RATE;
    const inconsistency = reworkAnnual * INCONSISTENCY_RATE;
    const attrition = (teamSize * TURNOVER_RATE) * (dept.hours * hourlyCost * ATTRITION_RAMP_WEEKS);
    const onboarding = (teamSize * TURNOVER_RATE) * (dept.hours * hourlyCost * ONBOARDING_RAMP_WEEKS);
    const handoff = reworkAnnual * HANDOFF_FRICTION_RATE * ADJACENT_TEAMS;
    const shadowGovernance = ADJACENT_TEAMS * SHADOW_GOVERNANCE_HOURS * hourlyCost * 52;
    const totalGap = reworkAnnual + duplication + inconsistency + attrition + onboarding + handoff + shadowGovernance;

    return {
      reworkAnnual,
      reworkMonthly: reworkAnnual / 12,
      duplication,
      inconsistency,
      attrition,
      onboarding,
      handoff,
      shadowGovernance,
      totalGap,
      recoverable: totalGap * RECOVERY_RATE,
      taxes: { duplication, inconsistency, attrition, onboarding, handoff, shadowGovernance } as Record<string, number>,
    };
  }, [teamSize, dept.hours, hourlyCost]);

  return (
    <section className="pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-4"
            style={{
              color: "hsl(var(--primary))",
              borderColor: "hsl(var(--primary) / 0.25)",
              background: "hsl(var(--primary) / 0.06)",
            }}
          >
            <Calculator className="w-3.5 h-3.5" />
            Instruction Gap Tax
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            What is unstructured AI costing your team?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Based on published research from Zapier (n=1,100) and Workday (2026). Adjust the inputs to see your estimate.
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
                  {formatCurrency(calculations.reworkMonthly)}
                  <span className="text-lg font-medium text-muted-foreground">/month</span>
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-4">
                  {formatCurrency(calculations.reworkAnnual)}/year
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  This is only the visible cost. The structural taxes below compound underneath.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Taxes Section */}
        <div className="mt-6">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-4 text-center">
            The structural taxes you are not tracking
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TAX_CARDS.map((tax) => {
              const Icon = tax.icon;
              const value = calculations.taxes[tax.key];
              return (
                <div
                  key={tax.key}
                  className="rounded-xl border p-4 group"
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
                      <p className="text-sm font-bold text-foreground">{tax.label}</p>
                      <p className="text-xl font-black text-foreground tracking-tight mt-0.5">
                        {formatCurrency(value)}
                        <span className="text-xs font-medium text-muted-foreground">/year</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                        {tax.desc}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 italic">
                        {tax.assumption}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                {formatCurrency(calculations.totalGap)}
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
                    Recoverable: {formatCurrency(calculations.recoverable)}/year
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Organizations with governed AI instruction sets report 60-70% reduction across all five dimensions.
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
              These are the metrics that don't exist yet in your organization. They will define the next generation of operational performance.
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
            Sources: Zapier AI Workslop Report, Jan 2026 (n=1,100 enterprise users) · Workday Global AI Impact Study, 2026 · CIO.com, Apr 2026.
            Rework calculation: Team size × department-specific rework hours/week × hourly cost × 52 weeks.
            Structural taxes derived from rework baseline using stated assumptions (duplication 25%, inconsistency 20%, turnover 15%, reconstruction 8 weeks, onboarding 6 weeks).
            Recovery rate based on 65% midpoint of reported reduction with structured governance.
            AI-native benchmarks are directional estimates based on organizations with governed AI instruction infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
}

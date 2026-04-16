import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
  Network,
  ShieldCheck,
  Plus,
  X,
  Building2,
} from "lucide-react";
import { DEPARTMENTS } from "./calculator/departments";
import { useCalculator } from "./calculator/useCalculator";
import type { DepartmentEntry } from "./calculator/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const TAX_CARDS = [
  {
    key: "totalDuplication",
    icon: Copy,
    label: "Duplication Tax",
    desc: "Team members independently solving problems a colleague already figured out.",
  },
  {
    key: "totalInconsistency",
    icon: Split,
    label: "Inconsistency Tax",
    desc: "Cross-checking and aligning different AI outputs across the team.",
  },
  {
    key: "totalAttrition",
    icon: UserMinus,
    label: "Attrition Tax",
    desc: "Rebuilding AI expertise lost when team members leave.",
  },
  {
    key: "totalOnboarding",
    icon: GraduationCap,
    label: "Onboarding Tax",
    desc: "New hires building AI workflows from scratch with no codified processes.",
  },
  {
    key: "totalHandoff",
    icon: Network,
    label: "Handoff Friction Tax",
    desc: "Adjacent teams re-contextualizing AI outputs that cross boundaries without shared standards.",
    crossOrg: true,
  },
  {
    key: "totalShadowGovernance",
    icon: ShieldCheck,
    label: "Shadow Governance Tax",
    desc: "Each department independently building its own AI review and QA processes.",
    crossOrg: true,
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

let entryIdCounter = 0;
function newEntryId() {
  return `dept-${++entryIdCounter}`;
}

export default function InstructionGapCalculator() {
  const [hourlyCost, setHourlyCost] = useState(75);
  const [multiMode, setMultiMode] = useState(false);
  const [entries, setEntries] = useState<DepartmentEntry[]>([
    { id: newEntryId(), department: "operations", teamSize: 25 },
  ]);

  const addDepartment = useCallback(() => {
    if (entries.length >= 5) return;
    const used = new Set(entries.map((e) => e.department));
    const next = DEPARTMENTS.find((d) => !used.has(d.value))?.value || "engineering";
    setEntries((prev) => [...prev, { id: newEntryId(), department: next, teamSize: 15 }]);
  }, [entries]);

  const removeDepartment = useCallback((id: string) => {
    setEntries((prev) => (prev.length <= 1 ? prev : prev.filter((e) => e.id !== id)));
  }, []);

  const updateEntry = useCallback(
    (id: string, patch: Partial<DepartmentEntry>) => {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    },
    []
  );

  const activeEntries = multiMode ? entries : [entries[0]];
  const calc = useCalculator(activeEntries, hourlyCost, multiMode);
  const primaryDept = DEPARTMENTS.find((d) => d.value === entries[0].department)!;
  const totalTeamSize = activeEntries.reduce((s, e) => s + e.teamSize, 0);

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
            What is unstructured AI costing your {multiMode ? "organization" : "team"}?
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
              {/* Primary department */}
              <DepartmentInputCard
                entry={entries[0]}
                onUpdate={updateEntry}
                canRemove={false}
                onRemove={() => {}}
                label={multiMode ? "Primary Department" : "Department"}
              />

              {/* Multi-department toggle */}
              <div
                className="rounded-xl border p-4 flex items-center justify-between gap-3"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Cross-department impact</p>
                    <p className="text-[11px] text-muted-foreground">Add departments to see organizational cost</p>
                  </div>
                </div>
                <Switch
                  checked={multiMode}
                  onCheckedChange={setMultiMode}
                />
              </div>

              {/* Additional departments */}
              {multiMode && (
                <div className="space-y-3">
                  {entries.slice(1).map((entry) => (
                    <DepartmentInputCard
                      key={entry.id}
                      entry={entry}
                      onUpdate={updateEntry}
                      canRemove
                      onRemove={removeDepartment}
                    />
                  ))}
                  {entries.length < 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={addDepartment}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add Department
                    </Button>
                  )}
                </div>
              )}

              {/* Hourly cost */}
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
                  Direct AI rework cost{multiMode && ` (${activeEntries.length} departments)`}
                </p>
                <p className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-1">
                  {formatCurrency(calc.totalRework / 12)}
                  <span className="text-lg font-medium text-muted-foreground">/month</span>
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-4">
                  {formatCurrency(calc.totalRework)}/year
                  {multiMode && (
                    <span className="text-sm font-normal"> · {totalTeamSize} people</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  This is only the visible cost. The structural taxes below compound underneath
                  {multiMode
                    ? " — cross-department taxes now reflect actual organizational boundaries."
                    : "."}
                </p>
              </div>

              {/* Per-department breakdown in multi mode */}
              {multiMode && calc.departments.length > 1 && (
                <div className="mt-4 space-y-1.5">
                  {calc.departments.map((d) => (
                    <div
                      key={d.id}
                      className="flex justify-between text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: "hsl(var(--muted) / 0.3)" }}
                    >
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(d.reworkAnnual)}/yr
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
              const value = calc[tax.key as keyof typeof calc] as number;
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{tax.label}</p>
                        {"crossOrg" in tax && tax.crossOrg && multiMode && (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{
                              color: "hsl(var(--primary))",
                              background: "hsl(var(--primary) / 0.08)",
                            }}
                          >
                            Cross-Org
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
              These are the metrics that don't exist yet in your organization. They will define the next generation of operational performance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FORWARD_METRICS.map((metric) => {
              const Icon = metric.icon;
              const currentValue = metric.getValue(primaryDept.hours, totalTeamSize);
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
            Tax profiles are department-specific: duplication, inconsistency, turnover, and governance rates are tailored to each function's structural characteristics.
            {multiMode && " Cross-department taxes (handoff friction, shadow governance) scale with the number of organizational boundaries."}
            {" "}Recovery rate based on 65% midpoint of reported reduction with structured governance.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Department Input Card ─── */

function DepartmentInputCard({
  entry,
  onUpdate,
  canRemove,
  onRemove,
  label,
}: {
  entry: DepartmentEntry;
  onUpdate: (id: string, patch: Partial<DepartmentEntry>) => void;
  canRemove: boolean;
  onRemove: (id: string) => void;
  label?: string;
}) {
  const dept = DEPARTMENTS.find((d) => d.value === entry.department)!;

  return (
    <div
      className="rounded-xl border p-4 space-y-4"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
    >
      {(label || canRemove) && (
        <div className="flex items-center justify-between">
          {label && (
            <p className="text-xs font-bold tracking-[0.1em] uppercase text-muted-foreground">
              {label}
            </p>
          )}
          {canRemove && (
            <button
              onClick={() => onRemove(entry.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div>
        <Label className="text-sm font-semibold text-foreground mb-2 block">
          Team members: <span className="text-primary">{entry.teamSize}</span>
        </Label>
        <Slider
          value={[entry.teamSize]}
          onValueChange={([v]) => onUpdate(entry.id, { teamSize: v })}
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
        <Select
          value={entry.department}
          onValueChange={(v) => onUpdate(entry.id, { department: v })}
        >
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
          {dept.hours}h/wk rework · Duplication {Math.round(dept.taxProfile.duplication * 100)}% · Inconsistency {Math.round(dept.taxProfile.inconsistency * 100)}%
        </p>
      </div>
    </div>
  );
}

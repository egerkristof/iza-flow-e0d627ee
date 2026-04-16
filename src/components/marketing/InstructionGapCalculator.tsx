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
import { Calculator, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InstructionGapCalculator() {
  const [teamSize, setTeamSize] = useState(25);
  const [department, setDepartment] = useState("operations");
  const [hourlyCost, setHourlyCost] = useState(75);

  const dept = DEPARTMENTS.find((d) => d.value === department)!;

  const { weekly, monthly, annual, recoverable } = useMemo(() => {
    const w = teamSize * dept.hours * hourlyCost;
    const a = w * 52;
    return {
      weekly: w,
      monthly: a / 12,
      annual: a,
      recoverable: a * RECOVERY_RATE,
    };
  }, [teamSize, dept.hours, hourlyCost]);

  return (
    <section className="pb-16 px-6">
      <div className="max-w-4xl mx-auto">
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

            {/* Output */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Your estimated Instruction Gap Tax
                </p>
                <p className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-1">
                  {formatCurrency(monthly)}
                  <span className="text-lg font-medium text-muted-foreground">/month</span>
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-6">
                  {formatCurrency(annual)}/year
                </p>

                <div
                  className="rounded-xl p-4 mb-4"
                  style={{ background: "hsl(var(--primary) / 0.06)" }}
                >
                  <div className="flex items-start gap-3">
                    <TrendingDown
                      className="w-5 h-5 mt-0.5 shrink-0"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Recoverable: {formatCurrency(recoverable)}/year
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Teams with structured AI governance (context, orchestration, QA) report 60-70% less rework.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-4 italic">
                This is a research-based estimate. Scroll down to see how structured governance reduces this cost.
              </p>
            </div>
          </div>

          {/* Footnotes */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Sources: Zapier AI Workslop Report, Jan 2026 (n=1,100 enterprise users) · Workday Global AI Impact Study, 2026 · CIO.com, Apr 2026.
              Calculation: Team size × department-specific rework hours/week × hourly cost × 52 weeks. Recovery rate based on 65% midpoint of reported reduction with structured governance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

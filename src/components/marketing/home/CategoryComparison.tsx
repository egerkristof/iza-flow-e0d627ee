import { SectionTag, GradientText } from "./shared";
import { X, Minus, Check, GitCompare } from "lucide-react";

const ROWS = [
  { feature: "Turn domain expertise into executable capabilities", legacy: false, automation: "partial", km: false, liza: true },
  { feature: "Governance enforced in execution, not just on paper", legacy: false, automation: false, km: false, liza: true },
  { feature: "Departments self-sufficient, not dependent on central team", legacy: false, automation: "partial", km: false, liza: true },
  { feature: "Cross-team learning compounds automatically", legacy: false, automation: false, km: "partial", liza: true },
  { feature: "Measurable adoption across all workflows", legacy: "partial", automation: "partial", km: false, liza: true },
  { feature: "Auditing happens in execution, not after", legacy: false, automation: false, km: false, liza: true },
];

function CellIcon({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />;
  if (value === "partial")
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  return <X className="w-4 h-4" style={{ color: "hsl(var(--destructive) / 0.4)" }} />;
}

export function CategoryComparison() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Why existing approaches fall short" icon={<GitCompare className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            You have the tools.{" "}
            <GradientText>You're missing the governance layer.</GradientText>
          </h2>
        </div>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-5 gap-0 text-[10px] md:text-xs font-bold tracking-wide uppercase"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="px-3 md:px-4 py-3 text-muted-foreground" />
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">Legacy Processes</span>
              <span className="md:hidden">Legacy</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">SOPs, training, wikis</span>
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">Automation Platforms</span>
              <span className="md:hidden">Automation</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Zapier, Make, n8n</span>
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">Knowledge Mgmt</span>
              <span className="md:hidden">KM</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Notion, Confluence</span>
            </div>
            <div
              className="px-2 md:px-4 py-3 text-center font-black border-l"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.06)" }}
            >
              LIZA OS
              <span className="block text-[9px] md:text-[10px] font-semibold normal-case opacity-70">Governance layer</span>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-0 border-t text-xs md:text-sm"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="px-3 md:px-4 py-3 text-foreground/80">{r.feature}</div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.legacy} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.automation} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.km} />
              </div>
              <div
                className="px-2 md:px-4 py-3 flex items-center justify-center border-l"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--primary) / 0.03)" }}
              >
                <CellIcon value={r.liza} />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5 max-w-lg mx-auto">
          Legacy processes don't scale. Automation platforms don't govern quality. Knowledge management doesn't execute. LIZA OS is the layer that connects expertise to execution — with governance built in.
        </p>
      </div>
    </section>
  );
}

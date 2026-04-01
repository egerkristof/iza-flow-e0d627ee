import { SectionTag, GradientText } from "./shared";
import { X, Minus, Check, GitCompare } from "lucide-react";

const COLS: { key: "legacy" | "ai" | "automation" | "km" | "liza"; label: string; sub: string; isLiza?: boolean }[] = [
  { key: "legacy", label: "Legacy Processes", sub: "SOPs, training, wikis" },
  { key: "ai", label: "AI Tools", sub: "ChatGPT, Claude, Copilot" },
  { key: "automation", label: "Automation", sub: "Zapier, Make, n8n" },
  { key: "km", label: "Knowledge Mgmt", sub: "Notion, Confluence" },
  { key: "liza", label: "LIZA OS", sub: "Governance layer", isLiza: true },
];

const ROWS: { feature: string; legacy: boolean | string; ai: boolean | string; automation: boolean | string; km: boolean | string; liza: boolean | string }[] = [
  { feature: "Turn domain expertise into executable capabilities", legacy: false, ai: false, automation: "partial", km: false, liza: true },
  { feature: "Governance enforced where AI actually executes", legacy: false, ai: false, automation: false, km: false, liza: true },
  { feature: "Collective knowledge shared across teams", legacy: false, ai: false, automation: false, km: "partial", liza: true },
  { feature: "Cross-team learning compounds automatically", legacy: false, ai: "partial", automation: false, km: "partial", liza: true },
  { feature: "Measurable adoption across all workflows", legacy: "partial", ai: false, automation: "partial", km: false, liza: true },
  { feature: "Auditing happens in execution, not after", legacy: false, ai: false, automation: false, km: false, liza: true },
  { feature: "Your knowledge is portable. Zero lock-in", legacy: false, ai: false, automation: false, km: false, liza: true },
];

function CellIcon({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />;
  if (value === "partial")
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  return <X className="w-4 h-4" style={{ color: "hsl(var(--destructive) / 0.4)" }} />;
}

/* ── Mobile: stacked cards ─────────────────────────────────────── */
function MobileComparison() {
  return (
    <div className="space-y-3 md:hidden">
      {ROWS.map((r, i) => (
        <div
          key={i}
          className="rounded-xl border p-4"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          <p className="text-sm font-semibold text-foreground mb-3">{r.feature}</p>
          <div className="grid grid-cols-2 gap-2">
            {COLS.map((col) => {
              const val = r[col.key];
              return (
                <div
                  key={col.key}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                  style={
                    col.isLiza
                      ? { background: "hsl(var(--primary) / 0.06)" }
                      : { background: "hsl(var(--muted) / 0.5)" }
                  }
                >
                  <CellIcon value={val} />
                  <span
                    className="text-[11px] font-medium"
                    style={col.isLiza ? { color: "hsl(var(--primary))" } : { color: "hsl(var(--muted-foreground))" }}
                  >
                    {col.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Desktop: table grid ───────────────────────────────────────── */
function DesktopComparison() {
  return (
    <div
      className="hidden md:block rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      {/* Header */}
      <div
        className="grid grid-cols-6 gap-0 text-xs font-bold tracking-wide uppercase"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="px-4 py-3 text-muted-foreground" />
        {COLS.map((col) => (
          <div
            key={col.key}
            className={`px-4 py-3 text-center border-l ${col.isLiza ? "font-black" : "text-muted-foreground"}`}
            style={{
              borderColor: "hsl(var(--border))",
              ...(col.isLiza ? { color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.06)" } : {}),
            }}
          >
            {col.label}
            <span className={`block text-[10px] font-normal normal-case ${col.isLiza ? "font-semibold opacity-70" : "opacity-60"}`}>{col.sub}</span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {ROWS.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-0 border-t text-sm"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="px-4 py-3 text-foreground/80">{r.feature}</div>
          {COLS.map((col) => (
            <div
              key={col.key}
              className="px-4 py-3 flex items-center justify-center border-l"
              style={{
                borderColor: "hsl(var(--border))",
                ...(col.isLiza ? { background: "hsl(var(--primary) / 0.03)" } : {}),
              }}
            >
              <CellIcon value={r[col.key]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
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

        <DesktopComparison />
        <MobileComparison />

        <p className="text-center text-xs text-muted-foreground mt-5 max-w-lg mx-auto">
          Legacy processes don't scale. Automation platforms don't govern quality. Knowledge management doesn't execute. LIZA OS connects expertise to execution, with governance built in.
        </p>
      </div>
    </section>
  );
}

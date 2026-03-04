import { SectionTag, GradientText } from "./shared";
import { X, Minus, Check, GitCompare } from "lucide-react";

const ROWS = [
  { feature: "Define & enforce execution standards", wiki: "partial", prompts: "partial", agents: false, liza: true },
  { feature: "Standards update continuously from real work", wiki: false, prompts: false, agents: false, liza: true },
  { feature: "Execution quality consistent across team", wiki: false, prompts: "partial", agents: false, liza: true },
  { feature: "Knowledge persists across sessions & tools", wiki: "partial", prompts: false, agents: "partial", liza: true },
  { feature: "Insights transfer between team members", wiki: "partial", prompts: false, agents: false, liza: true },
  { feature: "Leadership visibility into execution quality", wiki: false, prompts: false, agents: false, liza: true },
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
          <SectionTag label="Why not just…" icon={<GitCompare className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Wikis store. Prompts copy. AI tools execute individually.{" "}
            <GradientText>None of them manage execution.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Managing execution means defining standards, enforcing them consistently, and updating them from real work. No existing tool does all three.
          </p>
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
              Wikis & Docs
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              Prompt Libraries
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">ChatGPT / Claude</span>
              <span className="md:hidden">AI Tools</span>
            </div>
            <div
              className="px-2 md:px-4 py-3 text-center font-black border-l"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.06)" }}
            >
              LIZA OS
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
                <CellIcon value={r.wiki} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.prompts} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.agents} />
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

        {/* Punchline */}
        <p className="text-center text-xs text-muted-foreground mt-5 max-w-lg mx-auto">
          AI tools are powerful executors, but they don't manage execution. That's the gap LIZA fills.
        </p>
      </div>
    </section>
  );
}

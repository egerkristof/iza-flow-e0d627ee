import { SectionTag, GradientText } from "./shared";
import { X, Minus, Check, GitCompare } from "lucide-react";

const ROWS = [
  { feature: "Define & enforce execution standards", wikis: false, prompts: false, ai: "partial", liza: true },
  { feature: "Standards update continuously from real work", wikis: false, prompts: false, ai: false, liza: true },
  { feature: "Execution quality consistent across team", wikis: false, prompts: "partial", ai: false, liza: true },
  { feature: "Knowledge persists across sessions & tools", wikis: true, prompts: "partial", ai: false, liza: true },
  { feature: "Captures un-externalized expert judgment", wikis: false, prompts: false, ai: false, liza: true },
  { feature: "Leadership visibility into execution quality", wikis: false, prompts: false, ai: false, liza: true },
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
          <SectionTag label="Why existing tools fall short" icon={<GitCompare className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            You already have the tools.{" "}
            <GradientText>You're missing the governance.</GradientText>
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
              <span className="hidden md:inline">Wikis & Docs</span>
              <span className="md:hidden">Wikis</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Notion, Confluence</span>
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">Prompt Libraries</span>
              <span className="md:hidden">Prompts</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Custom GPTs, Templates</span>
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">AI Assistants</span>
              <span className="md:hidden">AI Tools</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">ChatGPT, Claude</span>
            </div>
            <div
              className="px-2 md:px-4 py-3 text-center font-black border-l"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.06)" }}
            >
              LIZA OS
              <span className="block text-[9px] md:text-[10px] font-semibold normal-case opacity-70">Governance</span>
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
                <CellIcon value={r.wikis} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.prompts} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.ai} />
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
          Wikis store knowledge. Prompts encode shortcuts. AI assistants execute in silos. Only LIZA governs how your team executes together, continuously.
        </p>
      </div>
    </section>
  );
}

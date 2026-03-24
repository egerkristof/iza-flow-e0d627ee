import { SectionTag, GradientText } from "./shared";
import { X, Minus, Check, GitCompare } from "lucide-react";

const ROWS = [
  { feature: "Define & enforce execution standards", mining: false, memory: false, theory: "partial", liza: true },
  { feature: "Standards update continuously from real work", mining: "partial", memory: false, theory: false, liza: true },
  { feature: "Execution quality consistent across team", mining: false, memory: false, theory: false, liza: true },
  { feature: "Knowledge persists across sessions & tools", mining: "partial", memory: true, theory: false, liza: true },
  { feature: "Captures un-externalized expert judgment", mining: false, memory: false, theory: "partial", liza: true },
  { feature: "Leadership visibility into execution quality", mining: false, memory: false, theory: "partial", liza: true },
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
          <SectionTag label="$80M+ invested into this category" icon={<GitCompare className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Three funded approaches.{" "}
            <GradientText>None of them close the gap.</GradientText>
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
              <span className="hidden md:inline">Process Mining</span>
              <span className="md:hidden">Mining</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Edra · $30M</span>
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">Agent Memory</span>
              <span className="md:hidden">Memory</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Mem0 · $24M</span>
            </div>
            <div className="px-2 md:px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              <span className="hidden md:inline">Org Alignment</span>
              <span className="md:hidden">Alignment</span>
              <span className="block text-[9px] md:text-[10px] font-normal normal-case opacity-60">Paradox · ~$26M</span>
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
                <CellIcon value={r.mining} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.memory} />
              </div>
              <div className="px-2 md:px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.theory} />
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
          They mine the past, remember sessions, and theorize about alignment. Only LIZA governs how your team executes together, continuously.
        </p>
      </div>
    </section>
  );
}

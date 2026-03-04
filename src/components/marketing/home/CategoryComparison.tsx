import { SectionTag, GradientText } from "./shared";
import { X, Minus, Check } from "lucide-react";

const ROWS = [
  { feature: "Team standards enforced in AI sessions", wiki: false, prompts: false, liza: true },
  { feature: "Knowledge compounds from real work", wiki: "partial", prompts: false, liza: true },
  { feature: "Leadership visibility into execution", wiki: false, prompts: false, liza: true },
  { feature: "Onboarding accelerated to weeks", wiki: "partial", prompts: false, liza: true },
  { feature: "Methodology evolves continuously", wiki: false, prompts: false, liza: true },
  { feature: "Works inside AI workflows", wiki: false, prompts: "partial", liza: true },
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Why not just…" icon={<Minus className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Wikis document. Prompt libraries copy.{" "}
            <GradientText>LIZA compounds.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            The difference isn't features — it's whether your team gets smarter with every engagement.
          </p>
        </div>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-4 gap-0 text-xs font-bold tracking-wide uppercase"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="px-4 py-3 text-muted-foreground" />
            <div className="px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              Wikis & Docs
            </div>
            <div className="px-4 py-3 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              Prompt Libraries
            </div>
            <div
              className="px-4 py-3 text-center font-black border-l"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.06)" }}
            >
              LIZA OS
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-0 border-t text-sm"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="px-4 py-3 text-foreground/80">{r.feature}</div>
              <div className="px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.wiki} />
              </div>
              <div className="px-4 py-3 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <CellIcon value={r.prompts} />
              </div>
              <div
                className="px-4 py-3 flex items-center justify-center border-l"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--primary) / 0.03)" }}
              >
                <CellIcon value={r.liza} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

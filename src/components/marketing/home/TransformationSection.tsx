import { SectionTag, GradientText } from "./shared";
import { ArrowRight, X, Check } from "lucide-react";

const ROWS = [
  { before: "Context lives in people's heads", after: "Context lives in the system" },
  { before: "Every meeting starts with catch-up", after: "Every session starts with full live context" },
  { before: "New hires shadow for months before contributing", after: "New hires execute at senior level from day one" },
  { before: "When experts leave, knowledge disappears", after: "Expertise compounds — permanently" },
  { before: "AI tools work in silos, each with partial data", after: "One AI, connected to all your systems and your team's knowledge" },
  { before: "You carry the system in your head", after: "The system carries itself — and gets smarter every session" },
];

export function TransformationSection() {
  return (
    <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="The shift" icon={<ArrowRight className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            From scattered tools to{" "}
            <GradientText>shared intelligence.</GradientText>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            This is what changes when your team's AI is built on knowledge infrastructure instead of data infrastructure.
          </p>
        </div>

        {/* Two-column contrast grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Before column header */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 mb-1">
            <X className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive))" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">Without LIZA</span>
          </div>
          {/* After column header */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 mb-1">
            <Check className="w-3.5 h-3.5" style={{ color: "hsl(var(--success))" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(var(--success))" }}>With LIZA</span>
          </div>

          {ROWS.map((r, i) => (
            <div key={i} className="contents">
              {/* Before */}
              <div
                className="rounded-lg border px-4 py-3 flex items-start gap-3"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
              >
                <X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "hsl(var(--destructive) / 0.5)" }} />
                <p className="text-sm text-muted-foreground line-through decoration-1">{r.before}</p>
              </div>
              {/* After */}
              <div
                className="rounded-lg border px-4 py-3 flex items-start gap-3 mb-1 md:mb-0"
                style={{ borderColor: "hsl(var(--success) / 0.2)", background: "hsl(var(--success) / 0.04)" }}
              >
                <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "hsl(var(--success))" }} />
                <p className="text-sm font-medium">{r.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

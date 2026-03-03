import { SectionTag, GradientText } from "./shared";
import { ArrowRight, X, Check } from "lucide-react";

const ROWS = [
  { before: "Everyone executes with their own context", after: "Everyone executes with the team's full context" },
  { before: "What you learn stays in your head", after: "What you learn feeds back to the whole team" },
  { before: "Best practices exist on paper, not in practice", after: "Best practices are built into every session" },
  { before: "New hires shadow seniors for months", after: "New hires deliver at your standard from week one" },
  { before: "When someone leaves, you start over", after: "Knowledge compounds — it never leaves" },
  { before: "5 AI tools, none know how your team works", after: "One system, your team's full knowledge, every session" },
];

export function TransformationSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The shift" icon={<ArrowRight className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            From individual AI to{" "}
            <GradientText>collaborative intelligence.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2">
            <X className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive))" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">Today</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2">
            <Check className="w-3.5 h-3.5" style={{ color: "hsl(var(--success))" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(var(--success))" }}>With LIZA</span>
          </div>

          {ROWS.map((r, i) => (
            <div key={i} className="contents">
              <div
                className="rounded-lg border px-4 py-2.5 flex items-start gap-3"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "hsl(var(--destructive) / 0.5)" }} />
                <p className="text-sm text-muted-foreground line-through decoration-1">{r.before}</p>
              </div>
              <div
                className="rounded-lg border px-4 py-2.5 flex items-start gap-3 mb-1 md:mb-0"
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

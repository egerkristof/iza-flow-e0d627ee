import { SectionTag, GradientText } from "./shared";
import { ArrowRight, X, Check } from "lucide-react";

const ROWS = [
  { before: "You carry the methodology in your head", after: "The methodology lives in the system" },
  { before: "Every client engagement starts from scratch", after: "Every session starts with full context — live" },
  { before: "New hires shadow seniors for months", after: "New hires deliver at your standard from week one" },
  { before: "When your best person leaves, you start over", after: "Expertise compounds — it never leaves" },
  { before: "5 AI tools, none know how your firm works", after: "One system, your full knowledge, every session" },
  { before: "Quality depends on who's doing the work", after: "Quality is consistent — regardless of who delivers" },
];

export function TransformationSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The shift" icon={<ArrowRight className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            From depending on people to{" "}
            <GradientText>building on intelligence.</GradientText>
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

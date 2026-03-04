import { SectionTag, GradientText } from "./shared";
import { ArrowRight, X, Check } from "lucide-react";

const ROWS = [
  {
    before: "Quality depends on who's doing the work",
    after: "Standards enforced in every session, automatically",
  },
  {
    before: "Best practices rot in docs nobody reads",
    after: "Living playbook, always current, always followed",
  },
  {
    before: "You find out something drifted when a client complains",
    after: "You see execution patterns and drift as they happen",
  },
  {
    before: "AI usage is invisible. Everyone has their own prompts",
    after: "AI usage is governed, shared, and continuously improving",
  },
  {
    before: "Onboarding takes 9 months before someone stops needing a senior",
    after: "New hires execute at team standard from week one",
  },
];

export function TransformationSection() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="What changes" icon={<ArrowRight className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            From scattered individuals to{" "}
            <GradientText>compounding team.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2">
            <X className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive))" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">Without LIZA</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2">
            <Check className="w-3.5 h-3.5" style={{ color: "hsl(var(--success))" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(var(--success))" }}>With LIZA</span>
          </div>

          {ROWS.map((r, i) => (
            <div key={i} className="contents">
              <div
                className="rounded-lg border px-4 py-2.5 flex items-start gap-3"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
              >
                <X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "hsl(var(--destructive) / 0.5)" }} />
                <p className="text-sm text-muted-foreground">{r.before}</p>
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

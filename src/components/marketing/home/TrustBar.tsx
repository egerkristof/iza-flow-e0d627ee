import { Briefcase, Target, TrendingUp, Lightbulb } from "lucide-react";

const PERSONAS = [
  { label: "Senior Partners", icon: <Briefcase className="w-4 h-4" />, sub: "Boutique Consulting" },
  { label: "Practice Leads", icon: <Target className="w-4 h-4" />, sub: "Professional Services" },
  { label: "GTM Leaders", icon: <TrendingUp className="w-4 h-4" />, sub: "B2B Sales & Strategy" },
  { label: "Innovation Heads", icon: <Lightbulb className="w-4 h-4" />, sub: "Strategy & R&D" },
];

export function TrustBar() {
  return (
    <section className="py-14 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-black text-foreground mb-2 leading-tight">
          Your team already uses AI.
        </h2>
        <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
          But you can't scale it reliably, because every person does their own thing. That's the gap.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {PERSONAS.map((p) => (
            <div
              key={p.label}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-sm font-semibold"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground) / 0.85)",
                background: "hsl(var(--background))",
              }}
            >
              <span style={{ color: "hsl(var(--primary))" }}>{p.icon}</span>
              <span>{p.label}</span>
              <span className="text-[10px] font-medium text-muted-foreground hidden sm:inline">
                · {p.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

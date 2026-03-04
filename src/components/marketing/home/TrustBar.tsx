import { Briefcase, TrendingUp, Lightbulb, Target } from "lucide-react";

const AUDIENCES = [
  { label: "Boutique Consulting", icon: <Briefcase className="w-4 h-4" /> },
  { label: "B2B Sales Teams", icon: <Target className="w-4 h-4" /> },
  { label: "Go-to-Market Teams", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Strategy & Innovation", icon: <Lightbulb className="w-4 h-4" /> },
];

export function TrustBar() {
  return (
    <section className="py-8 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-5">
          Designed for teams where execution quality is the product
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {AUDIENCES.map((a) => (
            <div
              key={a.label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--muted-foreground))",
                background: "hsl(var(--background))",
              }}
            >
              <span style={{ color: "hsl(var(--primary))" }}>{a.icon}</span>
              {a.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

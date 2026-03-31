import { Brain, Layers, Zap } from "lucide-react";

const PILLARS = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Subject matter expertise at the center",
    desc: "Your standards, SOPs, and senior judgment become living playbooks that AI follows, not ignores.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Context that compounds",
    desc: "Every session builds a living record of decisions, outcomes, and why things worked. Knowledge accumulates.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI scales judgment, not just tasks",
    desc: "Automate lower-order work. Scale the higher-order thinking that makes your team irreplaceable.",
  },
];

export function CoreValueStrip() {
  return (
    <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div key={p.title} className="text-center md:text-left">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto md:mx-0"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                }}
              >
                {p.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

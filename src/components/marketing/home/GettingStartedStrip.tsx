import { Play, Sparkles, Users } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const STEPS = [
  {
    num: "1",
    icon: <Play className="w-5 h-5" />,
    title: "Start working",
    desc: "Begin with a blank session or upload existing docs. LIZA extracts structure automatically, or you define rules as you go.",
  },
  {
    num: "2",
    icon: <Sparkles className="w-5 h-5" />,
    title: "Define your rules",
    desc: "As you work, capture what matters: best practices, edge cases, quality criteria. Set enforcement levels so nothing slips.",
  },
  {
    num: "3",
    icon: <Users className="w-5 h-5" />,
    title: "Your team compounds",
    desc: "Every session makes your standards sharper. New hires execute at team level from week one. The whole team gets smarter together.",
  },
];

export function GettingStartedStrip() {
  return (
    <section id="getting-started" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Getting started" />
          <h2 className="text-2xl md:text-3xl font-black">
            Live in <GradientText>three steps.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="relative rounded-xl border p-6 text-center"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
              >
                <span className="text-sm font-black">{s.num}</span>
              </div>
              <div className="flex justify-center mb-3" style={{ color: "hsl(var(--primary))" }}>
                {s.icon}
              </div>
              <h3 className="text-sm font-bold mb-1.5">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

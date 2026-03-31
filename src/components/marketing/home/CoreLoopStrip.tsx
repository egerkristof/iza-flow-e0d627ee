import { Layers, ArrowRight, BookOpen, Zap, RefreshCw } from "lucide-react";
import { SectionTag } from "./shared";

const STEPS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    label: "Define",
    desc: "Capture your standards, SOPs, and tribal knowledge into living, structured playbooks.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Execute",
    desc: "Run AI sessions with your playbooks enforced. Same quality, every person, every time.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    label: "Compound",
    desc: "Every session feeds back. Playbooks sharpen. Your organisation gets smarter automatically.",
  },
];

export function CoreLoopStrip() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The engine" icon={<Layers className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Three core functions.
            <br />
            <span className="text-muted-foreground">One compounding loop.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Regardless of team size or industry, this is what LIZA does.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center relative">
              {/* Connector arrow (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-3 md:-right-4 top-10 z-10">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                }}
              >
                {step.icon}
              </div>

              <div
                className="text-xs font-black tracking-[0.15em] uppercase mb-2"
                style={{ color: "hsl(var(--primary))" }}
              >
                {step.label}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Loop indicator */}
        <div className="flex justify-center mt-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{
              background: "hsl(var(--primary) / 0.06)",
              color: "hsl(var(--primary))",
              border: "1px solid hsl(var(--primary) / 0.15)",
            }}
          >
            <RefreshCw className="w-3 h-3" />
            Continuous loop: every execution feeds back into your playbooks
          </div>
        </div>
      </div>
    </section>
  );
}

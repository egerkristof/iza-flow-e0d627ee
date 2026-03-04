import { SectionTag, GradientText } from "./shared";
import { AlertTriangle, Zap, Eye, Brain, Shield } from "lucide-react";

const PROBLEM_LAYERS = [
  {
    icon: <Eye className="w-5 h-5" />,
    layer: "External problem",
    label: "Inconsistent output",
    description:
      "Two people on your team give the same client different answers. A junior delivers something a senior would never have approved. Quality depends entirely on who's doing the work — and whether someone senior happens to be looking.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    layer: "Internal problem",
    label: "You're flying blind",
    description:
      "You have no real visibility into how your team executes. What's working? What's drifting? Which lessons from last quarter actually reached this quarter's team? You feel it when something goes wrong — but you can't see it coming.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    layer: "Philosophical problem",
    label: "The team should compound",
    description:
      "Every engagement should make the whole team smarter — not just the person who ran it. The junior who found a workaround, the senior who spotted a pattern, the new hire who asked the right question. That learning should flow to everyone. It doesn't.",
  },
];

const SCENARIOS = [
  "Two consultants give the same client contradictory recommendations. Neither knows the other spoke to them.",
  "A senior leaves. Within a month you realise half your methodology was in their head, not in any system.",
  "You onboard someone new. It takes 9 months before they stop needing a senior on every call.",
];

export function ProblemSection() {
  return (
    <section id="the-problem" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionTag label="The age-old problem" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Managing a team that should execute and learn{" "}
            <GradientText>together.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            This problem has always existed. You need your team aligned, learning from each other, and continuously improving. But you've never had the infrastructure to see it or govern it.
          </p>
        </div>

        {/* Three problem layers */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {PROBLEM_LAYERS.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border p-5 space-y-3"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {p.icon}
                </div>
                <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{p.label}</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* AI twist */}
        <div
          className="rounded-xl border-2 px-6 py-5 mb-10"
          style={{ borderColor: "hsl(var(--destructive) / 0.25)", background: "hsl(var(--destructive) / 0.04)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
            <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: "hsl(var(--destructive))" }}>
              Then AI made it worse
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            AI gave every individual superpowers — but it shattered the "together" part.
            Now everyone has their own prompts, their own shortcuts, their own version of "how we do it."
            The team is faster, but more fragmented than ever.
            Execute, learn, manage — all happening, but only at the individual level.
            As the person responsible for output, you've lost even more visibility.
          </p>
        </div>

        {/* Sound familiar? */}
        <div className="mb-10">
          <p className="text-sm font-black tracking-[0.15em] uppercase text-center mb-4" style={{ color: "hsl(var(--destructive))" }}>
            Sound familiar?
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border px-5 py-4 text-sm text-foreground/80 leading-relaxed"
                style={{ borderColor: "hsl(var(--destructive) / 0.2)", background: "hsl(var(--destructive) / 0.04)" }}
              >
                "{s}"
              </div>
            ))}
          </div>
        </div>

        {/* What's missing */}
        <div
          className="rounded-2xl border-2 px-8 py-8 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <p className="text-xl md:text-2xl font-black leading-snug">
            You need infrastructure that lets your team execute, learn, and manage
            <br className="hidden md:block" />
            as one — with you at the helm.
          </p>
        </div>
      </div>
    </section>
  );
}

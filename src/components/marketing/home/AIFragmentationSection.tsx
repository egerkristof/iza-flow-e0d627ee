import { SectionTag } from "./shared";
import { Flame, Database, Sparkles } from "lucide-react";

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="The oldest problem" icon={<Flame className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            Wisdom has always been the bottleneck.
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Knowing what to do, when, and how — <em>practical wisdom</em> — is what separates great teams from average ones. It's also the hardest thing to scale.
          </p>
        </div>

        {/* Three-column visual cards — not paragraphs */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* 1. The age-old need */}
          <div className="rounded-xl border p-5" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "hsl(var(--destructive) / 0.1)" }}>
              <Flame className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
            </div>
            <p className="font-semibold text-sm mb-1">The judgment gap</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your best people carry the system in their heads. When they leave, years of hard-won judgment — the unwritten rules, the pattern recognition — disappear overnight.
            </p>
          </div>

          {/* 2. Why tech always failed */}
          <div className="rounded-xl border p-5" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "hsl(var(--warning) / 0.1)" }}>
              <Database className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
            </div>
            <p className="font-semibold text-sm mb-1">Tech started from data, not knowledge</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every tool — wikis, SOPs, knowledge bases — started from what's <em>already documented</em>. But wisdom lives in the unknown: tacit knowledge that people can't easily articulate.
            </p>
          </div>

          {/* 3. LLMs change the game */}
          <div className="rounded-xl border p-5" style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.04)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "hsl(var(--primary) / 0.1)" }}>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm mb-1">LLMs change everything — if used right</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For the first time, AI can <em>read how you think</em> — not just your data. It can interpret language, surface tacit patterns, and turn them into executable knowledge. But most teams use it for the wrong things.
            </p>
          </div>
        </div>

        {/* Bridge */}
        <div
          className="mt-8 rounded-xl border px-6 py-4 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.03)" }}
        >
          <p className="text-sm text-muted-foreground">
            The question isn't whether your team uses AI. It's <strong className="text-foreground">how mature your context is</strong> when they do.
          </p>
        </div>
      </div>
    </section>
  );
}

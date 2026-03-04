import { SectionTag } from "./shared";
import { AlertTriangle, Zap } from "lucide-react";

const SCENARIOS = [
  "Your senior consultant is on vacation — the junior delivers something the client pushes back on.",
  "You onboard someone new and spend 3 weeks just getting them to 'how we do things here.'",
  "A key person leaves and you realize half your methodology walked out with them.",
];

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The age-old demand" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            Every team wants the same thing:
            <br />
            <em>standardize what works, and scale it.</em>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            The challenge has never been the work itself — it's capturing the judgment, the timing, the edge cases, and making them available to everyone.
          </p>
        </div>

        {/* Three escalating layers */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <ProblemCard
            number="1"
            headline="Always been hard"
            body="Best practices live in people's heads. You can write SOPs, run trainings, shadow seniors — but the real know-how doesn't transfer. It never has."
            accent="var(--destructive)"
          />
          <ProblemCard
            number="2"
            headline="AI made it feel solvable"
            body="LLMs gave individuals a superpower: personal context, real-time reasoning, instant execution. For a moment it felt like the answer."
            accent="hsl(38 92% 50%)"
          />
          <ProblemCard
            number="3"
            headline="But not for the team"
            body="Each person's AI is a silo. No shared standards. No shared learning. The same gap — now accelerating. Wikis, Trainual, Gong reviews — none of them close it."
            accent="hsl(var(--primary))"
          />
        </div>

        {/* Struggling moments — "Does this sound familiar?" */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground text-center mb-3">
            Sound familiar?
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="rounded-lg border px-4 py-3 text-sm text-muted-foreground italic leading-relaxed"
                style={{ borderColor: "hsl(var(--destructive) / 0.15)", background: "hsl(var(--destructive) / 0.03)" }}
              >
                "{s}"
              </div>
            ))}
          </div>
        </div>

        {/* The core insight */}
        <div
          className="rounded-2xl border-2 px-8 py-10 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">What's missing</span>
          </div>
          <p className="text-2xl md:text-3xl font-black mb-3 leading-snug">
            A system where your best practices
            <br className="hidden md:block" />
            stay current and run in every session.
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Not a wiki. Not a training deck. A live layer that captures what your best people know, keeps it evolving, and makes it available to everyone — at the moment of execution.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ number, headline, body, accent }: {
  number: string; headline: string; body: string; accent: string;
}) {
  return (
    <div className="rounded-xl border p-5 relative" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background: `${accent}20`, color: accent }}
        >
          {number}
        </div>
        <span className="text-xs font-black tracking-[0.1em] uppercase" style={{ color: accent }}>{headline}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

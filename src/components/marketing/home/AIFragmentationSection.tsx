import { SectionTag } from "./shared";
import { AlertTriangle, Zap } from "lucide-react";

const SCENARIOS = [
  "Your senior consultant is on vacation. The junior delivers something the client pushes back on immediately.",
  "You onboard someone new and spend 3 weeks just getting them to 'how we do things here.'",
  "A key person leaves and you realize half your methodology walked out with them.",
];

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <SectionTag label="The age-old demand" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            Every team wants the same thing:
            <br />
            <em>make the know-how transferable.</em>
          </h2>
        </div>

        {/* Sound familiar? — PROMOTED to top, larger, bolder */}
        <div className="mb-10">
          <p className="text-sm font-black tracking-[0.15em] uppercase text-center mb-4" style={{ color: "hsl(var(--destructive))" }}>
            Sound familiar?
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border px-5 py-4 text-base text-foreground/80 leading-relaxed"
                style={{ borderColor: "hsl(var(--destructive) / 0.2)", background: "hsl(var(--destructive) / 0.04)" }}
              >
                "{s}"
              </div>
            ))}
          </div>
        </div>

        {/* Three escalating layers — rewritten as struggling moments */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <ProblemCard
            number="1"
            headline="The judgment gap"
            body="Your best consultant handles it instinctively. Everyone else follows a checklist that misses the point. The real know-how has never transferred. Not through SOPs, not through shadowing."
            accent="var(--destructive)"
          />
          <ProblemCard
            number="2"
            headline="AI solved it. For one person"
            body="LLMs gave individuals a superpower: personal context, real-time reasoning, instant output. It felt like the answer. Then you looked at the team."
            accent="hsl(38 92% 50%)"
          />
          <ProblemCard
            number="3"
            headline="Now it's getting worse"
            body="Everyone has their own AI, their own shortcuts, their own version of 'how we do things.' The gap isn't closing. It's multiplying. Faster."
            accent="hsl(var(--primary))"
          />
        </div>

        {/* The core insight — surfaced, bigger */}
        <div
          className="rounded-2xl border-2 px-8 py-10 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">What's missing</span>
          </div>
          <p className="text-2xl md:text-3xl font-black mb-3 leading-snug">
            A system where your team's know-how
            <br className="hidden md:block" />
            stays current and runs in every session.
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Not a wiki. Not a training deck. A living layer that captures what your best people do, keeps it sharp, and gives it to everyone, right when they need it.
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

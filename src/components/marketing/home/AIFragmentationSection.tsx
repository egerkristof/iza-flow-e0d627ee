import { SectionTag } from "./shared";
import { AlertTriangle, User, Users, Zap } from "lucide-react";

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
            The challenge has never been the work itself — it's capturing the judgment, the timing, the edge cases, and making them available to everyone. While keeping it all flexible enough to evolve.
          </p>
        </div>

        {/* Three escalating layers */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <ProblemCard
            number="1"
            headline="Always been hard"
            body="Best practices live in people's heads. You can write SOPs, run trainings, shadow seniors — but the real know-how doesn't transfer. It never has."
            accent="var(--destructive)"
          />
          <ProblemCard
            number="2"
            headline="AI solved it for one"
            body="LLMs gave individuals a superpower: personal memory, real-time reasoning, instant execution. One person with AI can operate at a new level."
            accent="hsl(38 92% 50%)"
          />
          <ProblemCard
            number="3"
            headline="Not for the team"
            body="But each person's AI is a silo. No shared standards. No shared learning. No way to evolve best practices together. The team problem accelerates."
            accent="hsl(var(--primary))"
          />
        </div>

        {/* The core insight — big and unmissable */}
        <div
          className="rounded-2xl border-2 px-8 py-10 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">What's missing</span>
          </div>
          <p className="text-2xl md:text-3xl font-black mb-3 leading-snug">
            An infrastructure where best practices
            <br className="hidden md:block" />
            live as evolving code — not static docs.
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            LLMs run on instruction sets. Your team's knowledge can be encoded the same way — co-built, co-executed, and continuously evolved. That's the layer nobody has built. Until now.
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

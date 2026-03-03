import { SectionTag } from "./shared";
import { AlertTriangle, User, Users, Zap } from "lucide-react";

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The real problem" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            You know how to do great work.
            <br />
            You just can't do it <em>together</em>.
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            The hardest part of scaling a team was never the work itself — it's sharing the judgment behind it.
          </p>
        </div>

        {/* Three escalating layers */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <ProblemCard
            number="1"
            icon={<AlertTriangle className="w-4 h-4" />}
            headline="The age-old problem"
            body="How do you share what you know — the instinct, the timing, the edge cases — with people who weren't in the room?"
            accent="var(--destructive)"
          />
          <ProblemCard
            number="2"
            icon={<User className="w-4 h-4" />}
            headline="AI solved it individually"
            body="LLMs let you execute brilliantly on your own. They learn your style, hold some memory, reason with you in real time."
            accent="hsl(38 92% 50%)"
          />
          <ProblemCard
            number="3"
            icon={<Users className="w-4 h-4" />}
            headline="But not as a team"
            body="The moment you need shared context, shared learning, shared best practices — every AI tool breaks down. There's no team layer."
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
            <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">The missing infrastructure</span>
          </div>
          <p className="text-2xl md:text-3xl font-black mb-3 leading-snug">
            How do you execute, learn, and build
            <br className="hidden md:block" />
            best practices — together?
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Not a better chatbot. Not another wiki. An infrastructure where your team's knowledge lives, evolves, and shows up in every work session — automatically.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ number, icon, headline, body, accent }: {
  number: string; icon: React.ReactNode; headline: string; body: string; accent: string;
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

import { SectionTag, GradientText } from "./shared";
import { AlertTriangle, Zap, Users, BookOpen, Settings } from "lucide-react";

const THREE_PILLARS = [
  {
    icon: <Users className="w-5 h-5" />,
    pillar: "Execute together",
    problem: "Everyone runs their own prompts, their own way. Same client, different answers. Quality depends on who's doing the work.",
    aiTwist: "AI made individuals faster. But now every person has their own shortcuts, their own context, their own version of 'how we do it.'",
    col: "var(--primary)",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    pillar: "Learn together",
    problem: "Lessons from last quarter's project never reach next quarter's team. Insights stay in one person's head or buried in a recap nobody reads.",
    aiTwist: "AI chats are personal. The edge case your colleague solved yesterday? It's locked in their ChatGPT history. The team learns nothing.",
    col: "var(--primary)",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    pillar: "Manage together",
    problem: "Your methodology lead wrote the playbook once. It was good. Now it's 18 months old, and nobody follows it.",
    aiTwist: "There's no way to govern how AI is used across the team. No visibility, no standards, no evolution. Just hope.",
    col: "var(--primary)",
  },
];

const SCENARIOS = [
  "Two consultants give the same client contradictory recommendations. Neither knows the other spoke to them.",
  "A senior leaves. Within a month you realise half your methodology was in their head, not in any system.",
  "You onboard someone new. It takes 9 months before they stop needing a senior on every call.",
];

export function MaturityLadder() {
  return (
    <section id="the-problem" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionTag label="The Togetherness Gap" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Teams need to execute, learn, and manage{" "}
            <GradientText>together.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            AI gave everyone individual superpowers. But it didn't solve the hard part: making the team operate as one. That's the gap.
          </p>
        </div>

        {/* Three pillars — problem + AI twist */}
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {THREE_PILLARS.map((p) => (
            <div
              key={p.pillar}
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
                <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{p.pillar}</span>
              </div>

              {/* The core problem */}
              <p className="text-sm text-foreground/80 leading-relaxed">{p.problem}</p>

              {/* AI twist */}
              <div
                className="rounded-lg px-3 py-2.5 border"
                style={{ borderColor: "hsl(var(--destructive) / 0.2)", background: "hsl(var(--destructive) / 0.04)" }}
              >
                <p className="text-xs font-semibold mb-0.5" style={{ color: "hsl(var(--destructive))" }}>With AI, it gets worse</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.aiTwist}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sound familiar? — felt scenarios */}
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

        {/* What's missing callout */}
        <div
          className="rounded-2xl border-2 px-8 py-8 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">What's missing</span>
          </div>
          <p className="text-xl md:text-2xl font-black leading-snug">
            Infrastructure that makes your team execute, learn,
            <br className="hidden md:block" />
            and manage quality as one. Not as scattered individuals.
          </p>
        </div>
      </div>
    </section>
  );
}

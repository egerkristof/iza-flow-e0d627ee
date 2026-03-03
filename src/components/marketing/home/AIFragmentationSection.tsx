import { SectionTag } from "./shared";
import { AlertTriangle, Database, Brain, HelpCircle } from "lucide-react";

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="The problem" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            Everyone has AI.{" "}
            <span className="text-muted-foreground">Nobody shares context.</span>
          </h2>
        </div>

        {/* Narrative escalation — External → Internal → Philosophical */}
        <div className="space-y-10">
          {/* External: the visible mess */}
          <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--destructive) / 0.1)" }}>
              <Database className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
            </div>
            <div>
              <p className="font-semibold mb-1">Your tools don't talk to each other.</p>
              <p className="text-muted-foreground leading-relaxed">
                Every person on your team trains their own ChatGPT, their own Claude, their own Notion — and none of it connects. Your project management system, your CRM, your emails, your calendars — all isolated silos of static data. AI operates on fragments, never on the full picture.
              </p>
            </div>
          </div>

          {/* Internal: the emotional weight */}
          <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--warning) / 0.1)" }}>
              <Brain className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
            </div>
            <div>
              <p className="font-semibold mb-1">You've become the bottleneck.</p>
              <p className="text-muted-foreground leading-relaxed">
                You're the one who repeats context in every meeting, every onboarding, every handoff. Not just what to do — but <em>how</em> you do it. The judgment calls, the pattern recognition, the intuition built over years. You carry the system in your head, and the team can't move without you.
              </p>
            </div>
          </div>

          {/* Philosophical: the deeper stakes */}
          <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">You don't know what you don't know — and neither does your AI.</p>
              <p className="text-muted-foreground leading-relaxed">
                Every AI tool starts from what's already documented — the <em>known</em>. But the real value in teams lives in the unknown: the tacit knowledge, the unwritten rules, the hard-won judgment that experienced people carry but can't easily articulate. When someone leaves, all of it disappears overnight. No tool was ever built to capture this. They all start from data infrastructure — not knowledge infrastructure. Not what actually happens in people's heads.
              </p>
            </div>
          </div>
        </div>

        {/* Bridge to the solution */}
        <div
          className="mt-14 rounded-xl border px-6 py-5 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.03)" }}
        >
          <p className="text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>
            What if your AI started from the unknown — and built up from there?
          </p>
        </div>
      </div>
    </section>
  );
}

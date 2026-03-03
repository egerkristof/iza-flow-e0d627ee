import { SectionTag } from "./shared";
import { AlertTriangle, Users, Clock, BrainCircuit } from "lucide-react";

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="Sound familiar?" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            Your expertise doesn't scale. Your AI doesn't help.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <PainCard
            icon={<Users className="w-4 h-4" />}
            iconBg="hsl(var(--destructive) / 0.1)"
            iconColor="hsl(var(--destructive))"
            title="You're in every meeting"
            body="Because nobody else has the full picture. Every handoff, every onboarding, every client call — you're the one providing context that should already be in the system."
          />
          <PainCard
            icon={<Clock className="w-4 h-4" />}
            iconBg="hsl(var(--warning) / 0.1)"
            iconColor="hsl(var(--warning))"
            title="New hires take 6–9 months to ramp"
            body="Not because they're slow — because your methodology lives in your head, in scattered Notion pages, in tribal knowledge that nobody wrote down properly."
          />
          <PainCard
            icon={<BrainCircuit className="w-4 h-4" />}
            iconBg="hsl(var(--destructive) / 0.1)"
            iconColor="hsl(var(--destructive))"
            title="When someone leaves, their knowledge leaves"
            body="That senior consultant who just resigned? 14 months of client-specific judgment, pricing intuition, and relationship context — gone overnight."
          />
          <PainCard
            icon={<AlertTriangle className="w-4 h-4" />}
            iconBg="hsl(var(--warning) / 0.1)"
            iconColor="hsl(var(--warning))"
            title="Everyone has AI — none of it connects"
            body="Your team uses ChatGPT, Claude, Copilot. Each person trains their own, with their own prompts. Same question, different answers. No shared methodology. No consistency."
          />
        </div>

        {/* Bridge */}
        <div
          className="mt-8 rounded-xl border px-6 py-4 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.03)" }}
        >
          <p className="text-sm text-muted-foreground">
            The problem isn't your people or your AI tools. It's that <strong className="text-foreground">nobody built the layer that connects them</strong> — your team's actual knowledge, live, in every session.
          </p>
        </div>
      </div>
    </section>
  );
}

function PainCard({ icon, iconBg, iconColor, title, body }: {
  icon: React.ReactNode; iconBg: string; iconColor: string; title: string; body: string;
}) {
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: iconBg }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <p className="font-semibold text-sm mb-1">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

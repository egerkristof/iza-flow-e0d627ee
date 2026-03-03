import { SectionTag } from "./shared";
import { AlertTriangle, TrendingUp, Users, Briefcase, Megaphone, ShieldCheck } from "lucide-react";

export function AIFragmentationSection() {
  return (
    <section id="the-problem" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The problem" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            Your best people's expertise
            <br />
            is trapped in their heads.
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            And no tool — not your wiki, not your AI, not your SOPs — has ever captured the judgment that actually makes them good.
          </p>
        </div>

        {/* The big insight — prominent */}
        <div
          className="rounded-2xl border-2 px-8 py-8 text-center mb-10"
          style={{ borderColor: "hsl(var(--primary) / 0.3)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <p className="text-xl md:text-2xl font-black mb-2">
            Nobody built the missing layer.
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Your team's actual knowledge — how they think, how they decide, how they handle edge cases — <strong className="text-foreground">live in every AI session, updated after every engagement.</strong>
          </p>
        </div>

        {/* How this shows up in specific teams */}
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground text-center mb-4">
          How this shows up in your team
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <TeamPainCard
            icon={<TrendingUp className="w-4 h-4" />}
            col="38 92% 50%"
            team="Sales"
            pain="Your top seller wins deals on instinct. Everyone else follows a script that doesn't work."
          />
          <TeamPainCard
            icon={<Users className="w-4 h-4" />}
            col="200 90% 52%"
            team="Onboarding"
            pain="New hires take 6–9 months because your methodology isn't in any system — it's in people."
          />
          <TeamPainCard
            icon={<Briefcase className="w-4 h-4" />}
            col="262 80% 55%"
            team="Delivery"
            pain="Quality depends on who's assigned. Junior consultants can't access senior judgment."
          />
          <TeamPainCard
            icon={<Megaphone className="w-4 h-4" />}
            col="340 75% 55%"
            team="Account Mgmt"
            pain="Client history lives in one person's head. When they move on, you start the relationship over."
          />
        </div>
      </div>
    </section>
  );
}

function TeamPainCard({ icon, col, team, pain }: {
  icon: React.ReactNode; col: string; team: string; pain: string;
}) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `hsl(${col} / 0.12)`, color: `hsl(${col})` }}
        >
          {icon}
        </div>
        <span className="text-xs font-black tracking-[0.1em] uppercase" style={{ color: `hsl(${col})` }}>{team}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{pain}</p>
    </div>
  );
}

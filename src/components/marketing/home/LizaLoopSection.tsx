import { useState } from "react";
import { Layers, TrendingUp, Users, Briefcase, Megaphone } from "lucide-react";
import { SectionTag } from "./shared";
import loopCollaborate from "@/assets/loop-collaborate.png";
import loopLearn from "@/assets/loop-learn.png";
import loopExecute from "@/assets/loop-execute.png";

const STEPS = [
  {
    key: "collaborate",
    tag: "Execute together",
    headline: "One workspace. Your whole team. AI included.",
    line: "Everyone works from the same live context — your methodology, your standards, your accumulated judgment. No more copying context between tools or meetings.",
    before: "Everyone brings their own context to every session",
    after: "Everyone starts with the team's full knowledge — automatically",
    img: loopCollaborate,
  },
  {
    key: "learn",
    tag: "Learn together",
    headline: "Every session makes the standards better.",
    line: "What your team learns in practice — the edge cases, the client patterns, the better approaches — feeds back into the shared context. Standards evolve as the team evolves.",
    before: "Lessons learned stay in one person's head",
    after: "Every insight upgrades the whole team's playbook",
    img: loopLearn,
  },
  {
    key: "execute",
    tag: "Scale together",
    headline: "Your best practices, built into every session.",
    line: "Your methodology and quality standards aren't on a shelf — they're assembled and injected into every work session. Anyone can execute at your standard, from day one.",
    before: "6–9 months to ramp, seniors always the bottleneck",
    after: "New hire, day one, senior-level output",
    img: loopExecute,
  },
];

const TEAM_USES = [
  { icon: <TrendingUp className="w-4 h-4" />, col: "38 92% 50%", team: "Sales", use: "Every rep runs your best seller's playbook — evolving with every deal, not frozen in a training deck." },
  { icon: <Users className="w-4 h-4" />, col: "200 90% 52%", team: "Onboarding", use: "New hires get the team's accumulated judgment built into every task — not a static checklist from last quarter." },
  { icon: <Briefcase className="w-4 h-4" />, col: "262 80% 55%", team: "Delivery", use: "Junior consultants deliver at senior quality because your standards are live in the session, not buried in a wiki." },
  { icon: <Megaphone className="w-4 h-4" />, col: "340 75% 55%", team: "Account Mgmt", use: "Full client history, relationship context, and evolving playbooks — available to anyone, not just the original AM." },
];

export function LizaLoopSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <section id="liza-loop" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag label="How it works" icon={<Layers className="w-3 h-3" />} />
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Co-build. Co-execute. Co-evolve.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Best practices that standardize without becoming rigid — because the team keeps improving them.
            </p>
          </div>

          <div className="space-y-12">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-center`}
              >
                <div
                  className="md:w-1/2 rounded-xl border overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onClick={() => setLightbox(s.img)}
                >
                  <img src={s.img} alt={`LIZA — ${s.tag}`} className="w-full h-auto block" loading="lazy" />
                </div>

                <div className="md:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{s.tag}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{s.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.line}</p>

                  <div
                    className="rounded-lg border px-4 py-2.5 space-y-0.5"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
                  >
                    <p className="text-xs text-muted-foreground line-through decoration-1">{s.before}</p>
                    <p className="text-xs font-semibold" style={{ color: "hsl(var(--success))" }}>→ {s.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How teams use LIZA */}
          <div className="mt-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground text-center mb-4">
              How teams use LIZA
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEAM_USES.map((t) => (
                <div key={t.team} className="rounded-xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `hsl(${t.col} / 0.12)`, color: `hsl(${t.col})` }}
                    >
                      {t.icon}
                    </div>
                    <span className="text-xs font-black tracking-[0.1em] uppercase" style={{ color: `hsl(${t.col})` }}>{t.team}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 cursor-pointer animate-fade-in"
          style={{ background: "hsla(0 0% 0% / 0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="LIZA OS"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

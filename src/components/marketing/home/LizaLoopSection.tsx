import { useState } from "react";
import { MessageSquare, Brain, Play, Layers } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import loopCollaborate from "@/assets/loop-collaborate.png";
import loopLearn from "@/assets/loop-learn.png";
import loopExecute from "@/assets/loop-execute.png";

const STEPS = [
  {
    key: "collaborate",
    icon: <MessageSquare className="w-4 h-4" />,
    tag: "Collaborate",
    headline: "Work together — AI included.",
    description:
      "Whether you're working alone or with your team, LIZA is in the session with you. Co-work with colleagues, co-prompt with AI — everything happens in one shared workspace connected to your full context.",
    before: "You repeat yourself in every meeting, every handoff",
    after: "The system brings full context automatically — every time",
    img: loopCollaborate,
  },
  {
    key: "learn",
    icon: <Brain className="w-4 h-4" />,
    tag: "Learn",
    headline: "It learns how you think, not just what you type.",
    description:
      "Every session feeds the system. LIZA captures not just what you do, but how you do it — the judgment calls, the patterns, the preferences. Your knowledge doesn't live in separate documents anymore. It lives inside the system, like code lives in software.",
    before: "Knowledge trapped in one person's head, lost when they leave",
    after: "Every session feeds the shared knowledge graph — permanently",
    img: loopLearn,
  },
  {
    key: "execute",
    icon: <Play className="w-4 h-4" />,
    tag: "Execute",
    headline: "Execute with full live context.",
    description:
      "When you work in LIZA, you don't start from zero. The system assembles everything you need — best practices, team preferences, project history, connected data from your tools — so anyone on the team can execute at the level of your best people, from day one.",
    before: "New hires take months to ramp, seniors stay bottlenecked",
    after: "Day-one execution with full organisational memory",
    img: loopExecute,
  },
];

export function LizaLoopSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <section id="liza-loop" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag label="How LIZA works" icon={<Layers className="w-3 h-3" />} />
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              An infrastructure that starts from{" "}
              <GradientText>what you actually know.</GradientText>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              LIZA is built on three principles: you collaborate with your team and AI in one place, the system learns from every session, and you execute with the full weight of your team's accumulated intelligence.
            </p>
          </div>

          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
              >
                {/* Screenshot */}
                <div
                  className="md:w-1/2 rounded-xl border overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onClick={() => setLightbox(s.img)}
                >
                  <img src={s.img} alt={`LIZA — ${s.tag}`} className="w-full h-auto block" loading="lazy" />
                </div>

                {/* Content */}
                <div className="md:w-1/2">
                  {/* Step badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{s.tag}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{s.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.description}</p>

                  {/* Before → After micro-transformation */}
                  <div
                    className="rounded-lg border px-4 py-3 space-y-1"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  >
                    <p className="text-sm text-muted-foreground">
                      <span className="line-through decoration-1">{s.before}</span>
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "hsl(var(--success))" }}>
                      → {s.after}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
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

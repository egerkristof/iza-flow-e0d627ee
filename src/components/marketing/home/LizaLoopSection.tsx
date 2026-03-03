import { useState } from "react";
import { MessageSquare, Brain, Layers, Play, ArrowRight } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import loopCollaborate from "@/assets/loop-collaborate.png";
import loopLearn from "@/assets/loop-learn.png";
import loopExecute from "@/assets/loop-execute.png";

const STEPS = [
  {
    key: "collaborate",
    icon: <MessageSquare className="w-5 h-5" />,
    tag: "Collaborate",
    title: "Two people co-prompt. The AI is in the room.",
    desc: "Sarah and Marcus run a discovery debrief together. LIZA detects objection patterns, cross-references your playbooks, and flags learnings — live, in the conversation.",
    outcome: "Everyone works with the same intelligence, not their own memory.",
    img: loopCollaborate,
    col: "var(--primary)",
  },
  {
    key: "learn",
    icon: <Brain className="w-5 h-5" />,
    tag: "Learn",
    title: "The system extracts what matters. Automatically.",
    desc: "From that single conversation, LIZA crystallises 4 knowledge items: a best practice, a timing guideline, a buying signal, and a cross-reference — tagged, categorised, and linked to your playbooks.",
    outcome: "Knowledge doesn't live in someone's head. It's live infrastructure.",
    img: loopLearn,
    col: "var(--warning)",
  },
  {
    key: "execute",
    icon: <Play className="w-5 h-5" />,
    tag: "Execute",
    title: "Next session. Everything is already loaded.",
    desc: "James starts a new pursuit with a similar prospect. LIZA pre-loads the sovereignty objection response, the Meridian case study, and the 6-week procurement timeline. He works at senior-level judgment from minute one.",
    outcome: "Your methodology runs itself. New hires execute like veterans.",
    img: loopExecute,
    col: "var(--success)",
  },
];

export function LizaLoopSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <section id="liza-loop" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag label="The LIZA Loop" icon={<Layers className="w-3 h-3" />} />
            <h2 className="text-4xl font-black mb-4">
              Work together. <GradientText>The system gets smarter.</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every interaction teaches the system. Every session after that is faster, more accurate, more consistent. This is the loop.
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {STEPS.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={s.key}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
                >
                  {/* Screenshot */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="rounded-2xl border overflow-hidden shadow-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                      style={{
                        borderColor: `hsl(${s.col.includes("--") ? s.col.replace("var(", "").replace(")", "") : s.col} / 0.25)`,
                        boxShadow: `0 8px 40px -12px hsl(${s.col.includes("--") ? s.col.replace("var(", "").replace(")", "") : s.col} / 0.15)`,
                      }}
                      onClick={() => setLightbox(s.img)}
                    >
                      <img src={s.img} alt={`LIZA Loop — ${s.tag}`} className="w-full h-auto block" loading="lazy" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-shrink-0 md:w-[360px] text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                        style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                      >
                        {i + 1}
                      </div>
                      <span
                        className="text-[11px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
                        style={{
                          color: `hsl(${s.col.includes("--") ? s.col.replace("var(", "").replace(")", "") : s.col})`,
                          borderColor: `hsl(${s.col.includes("--") ? s.col.replace("var(", "").replace(")", "") : s.col} / 0.3)`,
                          background: `hsl(${s.col.includes("--") ? s.col.replace("var(", "").replace(")", "") : s.col} / 0.08)`,
                        }}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mb-3 leading-tight">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                    <p className="text-sm font-semibold" style={{ color: `hsl(${s.col.includes("--") ? s.col.replace("var(", "").replace(")", "") : s.col})` }}>
                      → {s.outcome}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loop arrow */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border" style={{ background: "hsl(var(--card))" }}>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground">
                Then the loop repeats. Every cycle, the system knows more. Your team executes faster.
              </span>
            </div>
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

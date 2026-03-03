import { useState } from "react";
import { MessageSquare, Brain, Play, ArrowRight, Layers } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import loopCollaborate from "@/assets/loop-collaborate.png";
import loopLearn from "@/assets/loop-learn.png";
import loopExecute from "@/assets/loop-execute.png";

const STEPS = [
  {
    key: "collaborate",
    icon: <MessageSquare className="w-5 h-5" />,
    tag: "Collaborate",
    title: "Sarah handles the objection exactly the way you would.",
    desc: "Sarah and Marcus run a discovery debrief together — in the same shared AI environment. Sarah brings up the sovereignty objection. LIZA surfaces your proven response from last quarter's Meridian deal, the pricing precedent, and the 6-week procurement timeline. Sarah doesn't guess. She executes with your judgment.",
    outcome: "Your methodology is in the room. Even when you're not.",
    img: loopCollaborate,
    col: "var(--primary)",
  },
  {
    key: "learn",
    icon: <Brain className="w-5 h-5" />,
    tag: "Learn",
    title: "The system captures what no one would have documented.",
    desc: "From that single conversation, LIZA crystallises what Marcus said about CTO engagement being a high-intent signal, the timing pattern Sarah spotted, and the objection response that actually landed. Four knowledge items — tagged, categorised, linked to your playbooks. Not because someone wrote a wiki article, but because the system was listening.",
    outcome: "Your best thinking doesn't walk out the door. It becomes infrastructure.",
    img: loopLearn,
    col: "var(--warning)",
  },
  {
    key: "execute",
    icon: <Play className="w-5 h-5" />,
    tag: "Execute",
    title: "James starts a new deal. Everything is already loaded.",
    desc: "James is two months in. He picks up a similar enterprise pursuit. Before he types a word, LIZA has pre-loaded the sovereignty objection response, the Meridian case study, and the procurement timeline pattern. He handles his first complex deal the way a 10-year veteran would — because the system gave him your context, not just a template.",
    outcome: "New hires execute like veterans. From day one.",
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
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
    headline: "One workspace. Your whole team. AI included.",
    line: "Stop copying context between tools. Work with colleagues and AI in the same session — with your full methodology already loaded.",
    before: "You repeat context in every meeting and handoff",
    after: "Everyone starts with the full picture — automatically",
    img: loopCollaborate,
  },
  {
    key: "learn",
    icon: <Brain className="w-4 h-4" />,
    tag: "Learn",
    headline: "Every session makes the system smarter.",
    line: "LIZA captures how your team actually works — the judgment calls, the client patterns, the unwritten rules. Not as static docs, but as living, executable knowledge.",
    before: "Senior leaves → years of client knowledge gone overnight",
    after: "Expertise stays in the system and compounds over time",
    img: loopLearn,
  },
  {
    key: "execute",
    icon: <Play className="w-4 h-4" />,
    tag: "Execute",
    headline: "New hire, day one, senior-level output.",
    line: "Your methodology, your client history, your quality standards — assembled and injected into every work session. Connected to your CRM, your email, your project tools.",
    before: "6–9 months to ramp, seniors still the bottleneck",
    after: "Anyone executes at your standard from week one",
    img: loopExecute,
  },
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
              Your team's knowledge,{" "}
              <GradientText>live in every session.</GradientText>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Three things happen when you work in LIZA. Together, they turn scattered expertise into shared, compounding team intelligence.
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

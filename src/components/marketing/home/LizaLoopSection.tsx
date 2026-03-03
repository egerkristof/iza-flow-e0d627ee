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
    before: "You repeat yourself in every meeting",
    after: "The system brings full context automatically",
    img: loopCollaborate,
  },
  {
    key: "learn",
    icon: <Brain className="w-4 h-4" />,
    tag: "Learn",
    before: "Knowledge trapped in one person's head",
    after: "Every session feeds the shared graph",
    img: loopLearn,
  },
  {
    key: "execute",
    icon: <Play className="w-4 h-4" />,
    tag: "Execute",
    before: "New hires take months to ramp up",
    after: "Day-one execution with full organizational memory",
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
            <SectionTag label="How it works" icon={<Layers className="w-3 h-3" />} />
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Work together. <GradientText>The system gets smarter.</GradientText>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-col">
                {/* Screenshot */}
                <div
                  className="rounded-xl border overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02] mb-4"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onClick={() => setLightbox(s.img)}
                >
                  <img src={s.img} alt={`LIZA — ${s.tag}`} className="w-full h-auto block" loading="lazy" />
                </div>

                {/* Step label */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{s.tag}</span>
                </div>

                {/* Before → After */}
                <div className="space-y-1.5">
                  <p className="text-sm leading-relaxed">
                    <span className="text-muted-foreground line-through decoration-1">{s.before}</span>
                  </p>
                  <p className="text-sm font-semibold leading-relaxed" style={{ color: "hsl(var(--success))" }}>
                    → {s.after}
                  </p>
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

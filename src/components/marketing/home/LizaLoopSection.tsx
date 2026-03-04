import { useState } from "react";
import { Layers, ArrowRight, Shield, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTag } from "./shared";
import loopCollaborate from "@/assets/loop-collaborate.png";
import loopLearn from "@/assets/loop-learn.png";

const STEPS = [
  {
    key: "define",
    tag: "Define & enforce",
    icon: <Shield className="w-4 h-4" />,
    headline: "Set the standard. Make sure it's followed.",
    line: "Define your team's best practices, edge cases, and quality criteria in one living system. LIZA enforces them in every AI session, automatically.",
    before: "Best practices live in docs nobody reads",
    after: "Standards are enforced in every session, automatically",
    img: "/images/product-define-enforce.png",
  },
  {
    key: "execute",
    tag: "Execute together",
    icon: <Users className="w-4 h-4" />,
    headline: "Where best practices build themselves.",
    line: "Your team works in live, collaborative sessions — grounded in your latest standards. Every conversation naturally enriches what your team knows, so your weakest performer operates from your strongest insight.",
    before: "Everyone brings their own context, their own prompts",
    after: "Best practices compound from real work, automatically",
    img: loopCollaborate,
  },
  {
    key: "learn",
    tag: "Learn together",
    icon: <Brain className="w-4 h-4" />,
    headline: "Every engagement makes your standards sharper.",
    line: "When someone finds a better approach or handles an edge case, it feeds back into shared knowledge. Not as a meeting recap — as a structured upgrade to how your whole team operates.",
    before: "Lessons stay in one person's head or chat history",
    after: "Every insight upgrades the entire team's standards",
    img: loopLearn,
  },
];

export function LizaLoopSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <section id="liza-loop" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag label="How it works" icon={<Layers className="w-3 h-3" />} />
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Define. Execute. Learn.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A continuous loop where your team's knowledge compounds, and you hold the reins.
            </p>
          </div>

          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
              >
                <div
                  className="md:w-[55%] rounded-xl border overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onClick={() => setLightbox(s.img)}
                >
                  <img src={s.img} alt={`LIZA — ${s.tag}`} className="w-full h-auto block" loading="lazy" />
                </div>

                <div className="md:w-[45%]">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{s.tag}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{s.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.line}</p>

                  <div
                    className="rounded-lg border px-4 py-2.5 space-y-0.5"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  >
                    <p className="text-xs text-muted-foreground line-through decoration-1">{s.before}</p>
                    <p className="text-xs font-semibold" style={{ color: "hsl(var(--success))" }}>→ {s.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-page CTA with value recap */}
          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              One system. Standards enforced, knowledge compounding, leadership in control.
            </p>
            <Link
              to="/beta"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.3)",
              }}
            >
              Join the Private Beta <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
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

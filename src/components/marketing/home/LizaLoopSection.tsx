import { useState } from "react";
import { Layers, ArrowRight, Shield, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTag } from "./shared";

const STEPS = [
  {
    key: "define",
    tag: "Define & enforce",
    icon: <Shield className="w-4 h-4" />,
    headline: "Your standards, live in every session.",
    line: "Custom GPTs and Claude Projects give you per-conversation memory. LIZA gives you team-wide enforcement — playbooks, edge cases, and quality gates that run automatically, not just when someone remembers to paste them.",
    before: "Everyone pastes their own system prompts and hopes for the best",
    after: "Team standards enforced automatically — no copy-paste, no drift",
    img: "/images/product-define-enforce.png",
  },
  {
    key: "execute",
    tag: "Execute together",
    icon: <Users className="w-4 h-4" />,
    headline: "From individual chat histories to shared intelligence.",
    line: "Right now, your team's best insights live in private chat threads. One person discovers a better approach — nobody else benefits. LIZA captures what works and makes it available to the whole team, live.",
    before: "Breakthroughs stay in one person's ChatGPT history",
    after: "Every insight becomes available to every team member, instantly",
    img: "/images/product-execute-session.png",
  },
  {
    key: "learn",
    tag: "Learn together",
    icon: <Brain className="w-4 h-4" />,
    headline: "AI memories forget. Team knowledge compounds.",
    line: "ChatGPT memories are personal and fragile. Claude Projects reset. Your team's accumulated judgment shouldn't depend on which tool someone used last Tuesday. LIZA turns execution into structured learning that upgrades everyone.",
    before: "AI 'memories' are personal, fragile, and reset between tools",
    after: "Structured learning from every engagement — owned by the team, not the tool",
    img: "/images/product-learn-extraction.png",
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
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              You've given your team AI tools. Now give them the system that makes those tools work <em>as a team</em>.
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

          {/* Mid-page CTA */}
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

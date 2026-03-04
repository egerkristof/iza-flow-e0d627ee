import { useState } from "react";
import { Layers, ArrowRight, Shield, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTag } from "./shared";

const STEPS = [
  {
    key: "define",
    tag: "Define & enforce",
    icon: <Shield className="w-4 h-4" />,
    headline: "Build playbooks that actually get followed.",
    line: "Your best practices need to evolve as fast as your team's AI usage. LIZA turns scattered prompts and tribal knowledge into living playbooks: enforced in every session, updated continuously. Not a static doc. A working standard.",
    before: "Best practices update quarterly. AI workflows change weekly.",
    after: "Living playbooks evolve with every engagement. Always current, always enforced.",
    img: "/images/product-define-enforce.png",
  },
  {
    key: "execute",
    tag: "Execute together",
    icon: <Users className="w-4 h-4" />,
    headline: "From individual AI speed to team-level intelligence.",
    line: "Your team is fast. Each person has their own ChatGPT setup, their own Claude projects. But breakthroughs stay in individual silos. LIZA connects the dots: one person's insight becomes the whole team's advantage in the next session.",
    before: "Everyone's fast individually, but insights stay in personal chat histories",
    after: "Every team member executes with the team's latest, best playbook",
    img: "/images/product-execute-protocol.png",
  },
  {
    key: "learn",
    tag: "Learn together",
    icon: <Brain className="w-4 h-4" />,
    headline: "Your playbooks get sharper with every engagement.",
    line: "AI lets your team work more granularly and across more touchpoints than ever. That means more learning opportunities, but only if you capture them. LIZA turns execution into structured feedback that upgrades your shared playbooks automatically.",
    before: "Great insights discovered in Tuesday's session are forgotten by Thursday",
    after: "Every engagement feeds back into living playbooks. The team compounds",
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
              From wildly different to consistently excellent.
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Three steps. One loop. Your team's best thinking becomes the default for everyone.
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
                  <img src={s.img} alt={`LIZA - ${s.tag}`} className="w-full h-auto block" loading="lazy" />
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
              One system. Living playbooks, team-wide enforcement, continuous learning.
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

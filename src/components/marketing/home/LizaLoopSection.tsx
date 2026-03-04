import { useState } from "react";
import { Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTag } from "./shared";
import loopCollaborate from "@/assets/loop-collaborate.png";
import loopLearn from "@/assets/loop-learn.png";

const STEPS = [
  {
    key: "execute",
    tag: "Execute together",
    headline: "Every session starts with the team's full knowledge.",
    line: "Your accumulated judgment — standards, edge cases, client patterns — is assembled and injected into every AI session automatically. Nobody starts from scratch. The weakest performer benefits from the strongest insight.",
    before: "Everyone brings their own context, their own prompts",
    after: "Everyone executes from the team's best, up-to-date standard",
    img: loopCollaborate,
  },
  {
    key: "learn",
    tag: "Learn together",
    headline: "Every engagement makes the playbook sharper.",
    line: "When someone finds a better approach, handles an edge case, or gets a surprising result — it feeds back into the shared knowledge. Not as a meeting recap. As a living, structured upgrade to how the whole team operates.",
    before: "Lessons stay in one person's head or chat history",
    after: "Every insight upgrades the entire team's playbook",
    img: loopLearn,
  },
  {
    key: "manage",
    tag: "Manage together",
    headline: "You see what's working and shape what's next.",
    line: "As the person responsible for output, you finally have the bird's-eye view. See execution patterns, spot drift, curate the methodology. Your team's living standard evolves under your governance — not by accident.",
    before: "You find out when something goes wrong — not before",
    after: "You see, shape, and govern how your team operates",
    img: "/images/product-oversight.png",
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
              Execute. Learn. Manage.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A continuous loop where your team's knowledge compounds — and you hold the reins.
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

          {/* Mid-page CTA */}
          <div className="mt-12 text-center">
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

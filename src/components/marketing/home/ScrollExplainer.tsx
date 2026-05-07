import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Workflow, Sparkles, Network, Target } from "lucide-react";

/* 5-frame scroll-driven explainer that lives in the hero.
   Each frame snaps in as the visitor scrolls. Builds the architecture
   metaphor before the buyer ever sees the architecture diagram.

   Frames:
   1. Today: every AI tool answers from generic training data.
   2. The cost: same question, three different answers.
   3. The shift: write the standard once.
   4. The standard reaches every surface.
   5. The loop closes: standards sharpen weekly.
*/

const FRAMES = [
  {
    kicker: "01 · Today",
    headline: "Every AI tool answers from generic training data.",
    sub: "Copilot, Claude, Glean. None of them know how your company decides.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    kicker: "02 · The cost",
    headline: "Same question. Three different answers.",
    sub: "Inconsistency is structural, not user error. It's how the stack is built today.",
    icon: <Network className="w-5 h-5" />,
  },
  {
    kicker: "03 · The shift",
    headline: "Write the standard once. Govern it like code.",
    sub: "Mandates, playbooks, decision logic. Versioned, owned, enforced.",
    icon: <Workflow className="w-5 h-5" />,
  },
  {
    kicker: "04 · Every surface inherits it",
    headline: "Copilot, Claude, in-house agents read from the same standard.",
    sub: "Same answer in every tool, in every region, in every team.",
    icon: <Database className="w-5 h-5" />,
  },
  {
    kicker: "05 · The loop closes",
    headline: "Strategy ships in days. Standards sharpen every week.",
    sub: "Execution telemetry feeds back. The business model becomes a tuned object.",
    icon: <Target className="w-5 h-5" />,
  },
];

export function ScrollExplainer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -rect.top;
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      const idx = Math.min(FRAMES.length - 1, Math.floor(ratio * FRAMES.length));
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative"
      style={{ height: `${FRAMES.length * 100}vh` }}
      aria-label="What Liza does, in five frames"
    >
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center px-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--primary) / 0.07) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.3]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Animated frame */}
        <div className="relative z-10 max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border"
                style={{
                  background: "hsl(var(--primary) / 0.08)",
                  borderColor: "hsl(var(--primary) / 0.3)",
                  color: "hsl(var(--primary))",
                }}
              >
                {FRAMES[active].icon}
                <span className="text-[11px] font-black tracking-[0.22em] uppercase">
                  {FRAMES[active].kicker}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.08] tracking-tight mb-5">
                {FRAMES[active].headline}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {FRAMES[active].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Frame dots */}
          <div className="mt-12 flex items-center justify-center gap-2">
            {FRAMES.map((_, i) => (
              <div
                key={i}
                className="h-[3px] rounded-full transition-all"
                style={{
                  width: i === active ? 36 : 14,
                  background:
                    i === active
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground) / 0.15)",
                  boxShadow: i === active ? "0 0 10px hsl(var(--primary) / 0.6)" : "none",
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <p className="mt-6 text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground/60">
            {active < FRAMES.length - 1 ? "Scroll to continue" : "Continue below"}
          </p>
        </div>
      </div>
    </section>
  );
}
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, X, Play } from "lucide-react";

/* 6-step guided tour for the LizaOSStack.
   Mirrors the homepage Stories arc (Hero → Problem → Stakes → Guide → Plan → Success)
   but mapped onto real anatomy on /os. */

export type TourStep = {
  /** data-tour value on the target wrapper. */
  target: string;
  kicker: string;
  title: string;
  body: string;
};

export const TOUR_STEPS: TourStep[] = [
  {
    target: "tools",
    kicker: "01 · The tools you bought",
    title: "Copilot, Claude, Glean. None of them know how you decide.",
    body: "Every AI tool you shipped reads from generic training data. They each invent a different answer to the same question. This is where the inconsistency comes from.",
  },
  {
    target: "records",
    kicker: "02 · The knowledge you have",
    title: "Your standards exist. They're just trapped in silos.",
    body: "SharePoint, Salesforce, ELN, ERP, senior interviews. The judgment is in there. No tool reads across them, and nothing gets enforced.",
  },
  {
    target: "core",
    kicker: "03 · The Decision Standard",
    title: "Liza writes how your company decides. Versioned, owned, governed.",
    body: "Two graphs in lockstep. One holds the standards (decisions, mandates, playbooks). One holds the artifacts those standards produce. Edit a rule, every dependent artifact knows.",
  },
  {
    target: "workspace",
    kicker: "04 · Where work happens",
    title: "One workspace. Your AI agents run inside, against the standard.",
    body: "Teams stop bouncing between vendor chats and wikis. Every output cites the rule it came from. Capture happens automatically as work flows.",
  },
  {
    target: "leadership",
    kicker: "05 · The loop closes",
    title: "Strategy pushes down. Signal flows up. Same week, not next quarter.",
    body: "Leaders edit the standard. Every surface inherits it the moment it ships. Drift, win/loss, transcripts flow back. The business model becomes a tuned object.",
  },
  {
    target: "fabric",
    kicker: "06 · The result",
    title: "Same answer, every tool. Standards that sharpen every week.",
    body: "The Decision Standard is the asset. The model is a runtime choice. Swap providers without rewriting a single rule.",
  },
];

export function GuidedTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset on open/close
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Scroll to target + measure
  useEffect(() => {
    if (!open) return;
    const target = document.querySelector<HTMLElement>(`[data-tour="${TOUR_STEPS[step].target}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    // Measure after scroll settles
    const measure = () => setRect(target.getBoundingClientRect());
    const t1 = window.setTimeout(measure, 450);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearTimeout(t1);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step]);

  // ESC + arrow keys
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setStep((s) => Math.min(TOUR_STEPS.length - 1, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const s = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[60] pointer-events-none">
      {/* Spotlight ring around the target */}
      <AnimatePresence>
        {rect && (
          <motion.div
            key={`ring-${step}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute rounded-2xl pointer-events-none"
            style={{
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              border: "2px solid hsl(var(--primary))",
              boxShadow:
                "0 0 0 9999px hsl(var(--background) / 0.55), 0 0 40px -4px hsl(var(--primary) / 0.6)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Step card — bottom-center, fixed */}
      <motion.div
        key={`card-${step}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-xl rounded-2xl border-2 p-5 pointer-events-auto"
        style={{
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--primary) / 0.55)",
          boxShadow: "0 30px 80px -20px hsl(var(--primary) / 0.5)",
        }}
      >
        {/* Progress bars */}
        <div className="flex gap-1 mb-3">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded-full"
              style={{
                background:
                  i < step
                    ? "hsl(var(--primary))"
                    : i === step
                    ? "hsl(var(--primary))"
                    : "hsl(var(--foreground) / 0.12)",
                opacity: i <= step ? 1 : 1,
              }}
            />
          ))}
        </div>

        <div className="flex items-start justify-between gap-3 mb-1.5">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "hsl(var(--primary))" }}>
            {s.kicker}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tour"
            className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h4 className="text-lg md:text-xl font-black leading-tight text-foreground mb-2">
          {s.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.body}</p>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep((v) => Math.max(0, v - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {step + 1} / {TOUR_STEPS.length}
          </span>
          {isLast ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((v) => Math.min(TOUR_STEPS.length - 1, v + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Click-catcher to close on backdrop click (only outside the card + ring) */}
      <button
        type="button"
        aria-label="Close tour"
        onClick={onClose}
        className="absolute inset-0 cursor-default pointer-events-auto -z-10"
        style={{ background: "transparent" }}
      />
    </div>
  );
}

export function PlayTourButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-black tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--gradient-brand-btn)",
        color: "hsl(var(--primary-foreground))",
        boxShadow: "0 8px 24px -8px hsl(var(--primary) / 0.55)",
      }}
    >
      <Play className="w-3.5 h-3.5" />
      Play 6-step tour
    </button>
  );
}
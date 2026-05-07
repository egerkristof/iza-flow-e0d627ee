import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, X, Play, GripHorizontal } from "lucide-react";

/* 6-step guided tour for the LizaOSStack.
   Mirrors the homepage Stories arc (Hero → Problem → Stakes → Guide → Plan → Success)
   but mapped onto real anatomy on /os. */

export type TourStep = {
  /** data-tour value on the target wrapper. */
  target: string;
  kicker: string;
  title: string;
  body: string;
  /** Short bullet annotations — render as arrow-tagged callouts inside the card. */
  highlights?: string[];
};

export const TOUR_STEPS: TourStep[] = [
  {
    target: "tools",
    kicker: "01 · The tools you bought",
    title: "Copilot, Claude, Glean. None of them know how you decide.",
    body: "Every AI tool you shipped reads from generic training data. They each invent a different answer to the same question. This is where the inconsistency comes from.",
    highlights: [
      "Each tool sits in its own silo",
      "No shared source of truth",
      "Output drifts team by team",
    ],
  },
  {
    target: "records",
    kicker: "02 · The knowledge you have",
    title: "Your standards exist. They're just trapped in silos.",
    body: "SharePoint, Salesforce, ELN, ERP, senior interviews. The judgment is in there. No tool reads across them, and nothing gets enforced.",
    highlights: [
      "Records, docs, transcripts, ERP",
      "Read by humans, not by AI",
      "Nothing enforces the rule",
    ],
  },
  {
    target: "core",
    kicker: "03 · The Decision Standard",
    title: "Liza writes how your company decides. Versioned, owned, governed.",
    body: "Two graphs in lockstep. One holds the standards (decisions, mandates, playbooks). One holds the artifacts those standards produce. Edit a rule, every dependent artifact knows.",
    highlights: [
      "Standards graph: rules, mandates, playbooks",
      "Artifacts graph: every output linked back",
      "Edit once, propagate everywhere",
    ],
  },
  {
    target: "workspace",
    kicker: "04 · Where work happens",
    title: "One workspace. Your AI agents run inside, against the standard.",
    body: "Teams stop bouncing between vendor chats and wikis. Every output cites the rule it came from. Capture happens automatically as work flows.",
    highlights: [
      "Native surfaces for daily work",
      "Every output cites the rule",
      "Capture is automatic",
    ],
  },
  {
    target: "leadership",
    kicker: "05 · The loop closes",
    title: "Strategy pushes down. Signal flows up. Same week, not next quarter.",
    body: "Leaders edit the standard. Every surface inherits it the moment it ships. Drift, win/loss, transcripts flow back. The business model becomes a tuned object.",
    highlights: [
      "Leaders edit the standard directly",
      "Drift and signal feed back up",
      "Strategy ships in days, not quarters",
    ],
  },
  {
    target: "fabric",
    kicker: "06 · The result",
    title: "Same answer, every tool. Standards that sharpen every week.",
    body: "The Decision Standard is the asset. The model is a runtime choice. Swap providers without rewriting a single rule.",
    highlights: [
      "Standards are the durable asset",
      "Model is a runtime choice",
      "Swap providers without rewrites",
    ],
  },
];

export function GuidedTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vp, setVp] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1200, h: typeof window !== "undefined" ? window.innerHeight : 800 });
  // Drag offset applied to the card so users can move it out of the way.
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset on open/close
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Reset drag offset whenever the step changes — new anchor, fresh placement.
  useEffect(() => {
    setDrag({ x: 0, y: 0 });
  }, [step]);

  // Scroll to target + measure. Several layouts (tablet vs desktop) render
  // duplicate `data-tour` nodes; pick the one that's actually visible.
  useEffect(() => {
    if (!open) return;
    const findVisible = (): HTMLElement | null => {
      const all = document.querySelectorAll<HTMLElement>(`[data-tour="${TOUR_STEPS[step].target}"]`);
      let best: { el: HTMLElement; r: DOMRect } | null = null;
      all.forEach((el) => {
        // `display: contents` wrappers report 0×0 — descend to the first real child.
        let probe: HTMLElement = el;
        if (el.getBoundingClientRect().width === 0 && el.firstElementChild) {
          probe = el.firstElementChild as HTMLElement;
        }
        if (probe.offsetParent === null && probe.tagName !== "BODY") return; // hidden
        const r = probe.getBoundingClientRect();
        if (r.width < 20 || r.height < 20) return;
        if (!best || r.width * r.height > best.r.width * best.r.height) {
          best = { el: probe, r };
        }
      });
      return best?.el ?? null;
    };
    const target = findVisible();
    if (!target) {
      setRect(null);
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    const measure = () => {
      const t = findVisible();
      if (t) setRect(t.getBoundingClientRect());
      setVp({ w: window.innerWidth, h: window.innerHeight });
    };
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

  // Side-card geometry: pick the side with more room. On narrow viewports, fall back to bottom.
  const PAD = 16;
  const CARD_W = 380;
  const targetCenterX = rect ? rect.left + rect.width / 2 : vp.w / 2;
  const useBottom = vp.w < 900 || !rect;
  const placeRight = !useBottom && rect ? targetCenterX < vp.w / 2 : true;

  // Card vertical position — clamp to viewport
  const desiredTop = rect ? Math.max(PAD + 24, Math.min(vp.h - 360, rect.top + rect.height / 2 - 180)) : 80;

  // Connector line from card to spotlight edge (desktop only). Recomputed
  // every render so it follows the card while it's being dragged.
  let connector: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (!useBottom && rect) {
    const baseLeft = placeRight ? vp.w - CARD_W - PAD : PAD;
    const cardLeft = baseLeft + drag.x;
    const cardTop = desiredTop + drag.y;
    // Target a sensible point on the card (the side closest to the anchor).
    const targetCenterY = rect.top + rect.height / 2;
    const cardEdgeX = cardLeft + (placeRight ? 0 : CARD_W);
    // Anchor the line near the title row, but follow the card vertically.
    const cardEdgeY = Math.max(cardTop + 40, Math.min(cardTop + 200, targetCenterY));
    const targetEdgeX = cardEdgeX < rect.left ? rect.left - 10 : rect.right + 10;
    const targetEdgeY = Math.min(vp.h - 24, Math.max(24, targetCenterY));
    connector = { x1: cardEdgeX, y1: cardEdgeY, x2: targetEdgeX, y2: targetEdgeY };
  }

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[60] pointer-events-none">
      {/* Dim backdrop with cut-out for the target via box-shadow trick */}
      <AnimatePresence>
        {rect && (
          <motion.div
            key={`ring-${step}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute rounded-2xl pointer-events-none"
            style={{
              top: rect.top - 12,
              left: rect.left - 12,
              width: rect.width + 24,
              height: rect.height + 24,
              border: "2.5px solid hsl(var(--primary))",
              boxShadow:
                "0 0 0 9999px hsl(var(--background) / 0.78), 0 0 60px 0 hsl(var(--primary) / 0.55), inset 0 0 24px -8px hsl(var(--primary) / 0.35)",
              background: "hsl(var(--primary) / 0.04)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Connector line from card to spotlight (desktop) */}
      {connector && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <marker id="tour-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
            </marker>
          </defs>
          <motion.path
            key={`conn-${step}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            d={`M ${connector.x1} ${connector.y1} C ${(connector.x1 + connector.x2) / 2} ${connector.y1}, ${(connector.x1 + connector.x2) / 2} ${connector.y2}, ${connector.x2} ${connector.y2}`}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="5 4"
            fill="none"
            markerEnd="url(#tour-arrow)"
          />
        </svg>
      )}

      {/* Step card — side-anchored on desktop, bottom on narrow.
          Draggable so the viewer can shove it aside to inspect the diagram. */}
      <motion.div
        key={`card-${step}`}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={(_, info) =>
          setDrag((d) => ({ x: d.x + info.offset.x, y: d.y + info.offset.y }))
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: drag.x, y: drag.y }}
        transition={{ duration: 0.3 }}
        className={
          useBottom
            ? "absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-xl rounded-2xl border-2 p-5 pointer-events-auto"
            : "absolute rounded-2xl border-2 p-5 pointer-events-auto"
        }
        style={{
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--primary) / 0.55)",
          boxShadow: "0 30px 80px -20px hsl(var(--primary) / 0.5)",
          ...(useBottom
            ? {}
            : {
                top: desiredTop,
                [placeRight ? "right" : "left"]: PAD,
                width: CARD_W,
              }),
        }}
      >
        {/* Drag handle */}
        <div className="flex items-center justify-center -mt-1 mb-1.5 cursor-grab active:cursor-grabbing text-muted-foreground/50">
          <GripHorizontal className="w-4 h-4" />
        </div>
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
        <h4 className="text-lg md:text-[20px] font-black leading-tight text-foreground mb-2">
          {s.title}
        </h4>
        <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-3">{s.body}</p>

        {s.highlights && s.highlights.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {s.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12.5px] font-semibold text-foreground/85 leading-snug"
              >
                <span
                  className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full"
                  style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}
                >
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>
        )}

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

      {/* No backdrop click-catcher — the rest of the page stays interactive
          so the viewer can click into highlighted blocks while the tour is open.
          Use Esc or the close button to dismiss. */}
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
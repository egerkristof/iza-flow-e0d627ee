/**
 * FactoryDiagram — the cross-section visual contract.
 *
 * Visual reference: docs/storyboards/factory-floor-v2.svg (Frame 1 / Frame 2).
 * Council notes baked in:
 *  1. Stations build progressively (controlled by `answers` prop).
 *  2. Grid-paper background is non-negotiable (note 9).
 *  3. Weakest station gets the only red accent (note 7 / Sales).
 *  4. "Missing" reads as ghost outline, not a colored block.
 *  5. Verdict-shift handled by parent rendering two diagrams side-by-side.
 *  6. No icon zoo — one technical-illustration register across all 4 stations.
 */
import { motion } from "framer-motion";

export type StationKey = "standard" | "line" | "qa" | "meter";
export type StationState = "unanswered" | "yes" | "partial" | "no";

export type FactoryAnswers = Record<StationKey, StationState>;

export const EMPTY_ANSWERS: FactoryAnswers = {
  standard: "unanswered",
  line: "unanswered",
  qa: "unanswered",
  meter: "unanswered",
};

const STATIONS: { key: StationKey; n: string; label: string; sub: Record<StationState, string> }[] = [
  {
    key: "standard", n: "01", label: "STANDARD",
    sub: { unanswered: "Spec sheet", yes: "Written. Used.", partial: "In heads.", no: "No spec." },
  },
  {
    key: "line", n: "02", label: "LINE",
    sub: { unanswered: "Template", yes: "Templated.", partial: "Depends on person.", no: "Bespoke." },
  },
  {
    key: "qa", n: "03", label: "QA",
    sub: { unanswered: "Inline check", yes: "Automated check.", partial: "Human reviewer.", no: "Whoever notices." },
  },
  {
    key: "meter", n: "04", label: "METER",
    sub: { unanswered: "Cost & rework", yes: "Both known.", partial: "One known.", no: "Unknown." },
  },
];

function stateInkClass(s: StationState, isWeakest: boolean) {
  if (s === "unanswered") return "text-muted-foreground/50";
  if (isWeakest) return "text-destructive";
  return "text-foreground";
}

function stateStrokeClass(s: StationState, isWeakest: boolean) {
  if (s === "unanswered") return "stroke-muted-foreground/30";
  if (isWeakest) return "stroke-destructive";
  return "stroke-foreground";
}

function StationStamp({ state, isWeakest }: { state: StationState; isWeakest: boolean }) {
  // The visual "fill" of the station card, drawn small + abstract.
  if (state === "unanswered") {
    return <rect x="14" y="14" width="92" height="40" fill="none" className="stroke-muted-foreground/30" strokeDasharray="3 3" />;
  }
  if (state === "yes") {
    return (
      <g>
        <circle cx="60" cy="34" r="14" className={isWeakest ? "fill-destructive" : "fill-foreground"} />
        <path d="M54,34 L58,38 L66,30" stroke="hsl(var(--background))" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  if (state === "partial") {
    return (
      <g>
        <rect x="20" y="18" width="80" height="6" className={isWeakest ? "fill-destructive" : "fill-foreground"} />
        <rect x="20" y="30" width="80" height="6" className={isWeakest ? "fill-destructive" : "fill-foreground"} />
        <rect x="20" y="42" width="80" height="6" fill="url(#ff-hatch)" stroke={isWeakest ? "hsl(var(--destructive))" : "hsl(var(--foreground))"} strokeDasharray="2 2" strokeWidth="0.8" />
      </g>
    );
  }
  // no — leak
  return (
    <g>
      <text x="60" y="32" textAnchor="middle" fontSize="22" fontWeight="800" className="fill-destructive" letterSpacing="2">. . .</text>
      <text x="60" y="50" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-destructive" letterSpacing="1.5">MISSING</text>
    </g>
  );
}

function LeakDrops() {
  // Irregular teardrops (council note 5), not circles.
  return (
    <g className="fill-destructive">
      <path d="M-18,4 q3,-6 6,0 q-3,5 -6,0 z" />
      <path d="M-2,9 q4,-9 8,0 q-4,7 -8,0 z" />
      <path d="M18,3 q2,-5 5,0 q-2,4 -5,0 z" />
    </g>
  );
}

export function FactoryDiagram({
  answers,
  weakest,
  futureState = false,
  size = "lg",
}: {
  answers: FactoryAnswers;
  weakest: StationKey | null;
  futureState?: boolean; // Frame 2 right pane — adds leak drops on missing stations
  size?: "lg" | "md" | "sm";
}) {
  const W = size === "lg" ? 960 : size === "md" ? 700 : 520;
  const H = size === "lg" ? 320 : size === "md" ? 260 : 220;
  const beltY = H - 70;
  const gap = (W - 80) / 4;

  return (
    <div
      className="relative w-full rounded-lg border border-border bg-background"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.6) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="ff-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="stroke-muted-foreground" strokeWidth="1" />
          </pattern>
          <marker id="ff-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground" />
          </marker>
        </defs>

        {/* Conveyor belt */}
        <line x1="40" y1={beltY} x2={W - 40} y2={beltY} className="stroke-foreground" strokeWidth="1.5" />
        <line x1="40" y1={beltY + 10} x2={W - 40} y2={beltY + 10} className="stroke-foreground" strokeWidth="1.5" />
        <rect x="40" y={beltY} width={W - 80} height="10" fill="url(#ff-hatch)" />
        <text x="40" y={beltY + 32} fontSize="9" letterSpacing="2" className="fill-muted-foreground">INPUT</text>
        <text x={W - 40} y={beltY + 32} textAnchor="end" fontSize="9" letterSpacing="2" className="fill-muted-foreground">OUTPUT</text>
        <line x1={W - 70} y1={beltY - 20} x2={W - 40} y2={beltY - 20} className="stroke-foreground" strokeWidth="1.2" markerEnd="url(#ff-arrow)" />

        {STATIONS.map((st, i) => {
          const cx = 60 + gap * i + gap / 2 - 60;
          const state = answers[st.key];
          const isWeakest = weakest === st.key && state !== "unanswered";
          const showLeak = futureState && (state === "no" || state === "partial");

          return (
            <motion.g
              key={st.key}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              transform={`translate(${cx}, 40)`}
            >
              {/* Weakest part frame */}
              {isWeakest && (
                <>
                  <rect x="-10" y="-10" width="140" height="100" fill="none" className="stroke-destructive" strokeWidth="1.2" />
                  <text x="-10" y="-16" fontSize="8" letterSpacing="2" className="fill-destructive" fontWeight="700">
                    WEAKEST PART
                  </text>
                </>
              )}
              {/* Station card */}
              <rect
                x="0" y="0" width="120" height="80"
                fill={state === "unanswered" ? "transparent" : "hsl(var(--background))"}
                className={stateStrokeClass(state, isWeakest)}
                strokeWidth="1.5"
                strokeDasharray={state === "unanswered" ? "4 3" : undefined}
              />
              <text x="10" y="14" fontSize="9" letterSpacing="1.5" fontWeight="700" className={isWeakest ? "fill-destructive" : "fill-foreground"}>
                {st.n} {st.label}
              </text>
              <StationStamp state={state} isWeakest={isWeakest} />

              {/* Dropline to belt */}
              <line x1="60" y1="80" x2="60" y2={beltY - 40} strokeDasharray="3 3" className="stroke-foreground" strokeWidth="1" />

              {/* Label under belt */}
              <text x="60" y={beltY - 22} textAnchor="middle" fontSize="10" className={stateInkClass(state, isWeakest)}>
                {st.sub[state]}
              </text>

              {/* Future-state leak */}
              {showLeak && (
                <motion.g
                  transform={`translate(60, ${beltY - 35})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <LeakDrops />
                </motion.g>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
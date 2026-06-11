/**
 * FactoryDiagram. Rebuilt per Council Review #2.
 *  - Station NAMES above, NUMBERS inside. No overlaps.
 *  - Leak teardrops fall in the GAP between stations on a broken connector.
 *  - Grid 24px, 0.5px, ~6% opacity. Recedes.
 *  - Diagram is a payoff (shown at verdict), not a running companion.
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
  { key: "standard", n: "01", label: "STANDARD",
    sub: { unanswered: "Spec sheet", yes: "Written. Used.", partial: "In heads.", no: "No spec." } },
  { key: "line", n: "02", label: "LINE",
    sub: { unanswered: "Template", yes: "Templated.", partial: "Person dependent.", no: "Bespoke." } },
  { key: "qa", n: "03", label: "QA",
    sub: { unanswered: "Inline check", yes: "Automated check.", partial: "Human reviewer.", no: "Whoever notices." } },
  { key: "meter", n: "04", label: "METER",
    sub: { unanswered: "Cost and rework", yes: "Both known.", partial: "One known.", no: "Unknown." } },
];

function strokeClass(s: StationState, weak: boolean) {
  if (s === "unanswered") return "stroke-muted-foreground/30";
  if (weak) return "stroke-destructive";
  return "stroke-foreground";
}

function Stamp({ state, weak }: { state: StationState; weak: boolean }) {
  if (state === "unanswered") {
    return <rect x="20" y="22" width="80" height="28" fill="none" className="stroke-muted-foreground/30" strokeDasharray="3 3" />;
  }
  if (state === "yes") {
    return (
      <g>
        <circle cx="60" cy="36" r="12" className={weak ? "fill-destructive" : "fill-foreground"} />
        <path d="M54,36 L58,40 L66,32" stroke="hsl(var(--background))" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  if (state === "partial") {
    return (
      <g>
        <rect x="22" y="25" width="76" height="4" className={weak ? "fill-destructive" : "fill-foreground"} />
        <rect x="22" y="34" width="76" height="4" className={weak ? "fill-destructive" : "fill-foreground"} />
        <rect x="22" y="43" width="76" height="4" fill="url(#ff-hatch)" stroke={weak ? "hsl(var(--destructive))" : "hsl(var(--foreground))"} strokeDasharray="2 2" strokeWidth="0.6" />
      </g>
    );
  }
  return (
    <g>
      <rect x="22" y="22" width="76" height="28" fill="none" className="stroke-destructive" strokeDasharray="2 3" strokeWidth="1" />
      <text x="60" y="41" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-destructive" letterSpacing="1.5">MISSING</text>
    </g>
  );
}

function LeakDrops() {
  return (
    <g className="fill-destructive">
      <path d="M-10,2 q2.5,-7 5,0 q-2.5,6 -5,0 z" />
      <path d="M2,8 q3,-9 6,0 q-3,7 -6,0 z" />
      <path d="M14,4 q2,-6 4,0 q-2,5 -4,0 z" />
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
  futureState?: boolean;
  size?: "lg" | "md" | "sm";
}) {
  const W = size === "lg" ? 960 : size === "md" ? 720 : 540;
  const H = size === "lg" ? 340 : size === "md" ? 300 : 260;
  const beltY = H - 70;
  const STATION_W = 120;
  const padX = 56;
  const cellW = (W - padX * 2) / 4;
  const stationY = 56;

  return (
    <div
      className="relative w-full rounded-lg border border-border bg-background overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--foreground) / 0.06) 0.5px, transparent 0.5px), linear-gradient(90deg, hsl(var(--foreground) / 0.06) 0.5px, transparent 0.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="ff-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="stroke-muted-foreground" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Conveyor */}
        <line x1={padX} y1={beltY} x2={W - padX} y2={beltY} className="stroke-foreground" strokeWidth="1.5" />
        <line x1={padX} y1={beltY + 10} x2={W - padX} y2={beltY + 10} className="stroke-foreground" strokeWidth="1.5" />
        <rect x={padX} y={beltY} width={W - padX * 2} height="10" fill="url(#ff-hatch)" />
        <text x={padX} y={beltY + 30} fontSize="9" letterSpacing="2" className="fill-muted-foreground">INPUT</text>
        <text x={W - padX} y={beltY + 30} textAnchor="end" fontSize="9" letterSpacing="2" className="fill-muted-foreground">OUTPUT</text>

        {STATIONS.map((st, i) => {
          const cellLeft = padX + cellW * i;
          const cx = cellLeft + (cellW - STATION_W) / 2;
          const state = answers[st.key];
          const weak = weakest === st.key && state !== "unanswered";
          const isMissing = state === "no";

          return (
            <motion.g
              key={st.key}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
              transform={`translate(${cx}, ${stationY})`}
            >
              {/* NAME above */}
              <text x="60" y="-22" textAnchor="middle" fontSize="10" letterSpacing="2" fontWeight="700"
                className={weak ? "fill-destructive" : "fill-foreground"}>
                {st.label}
              </text>
              <text x="60" y="-9" textAnchor="middle" fontSize="8" letterSpacing="1"
                className="fill-muted-foreground">
                {st.sub[state]}
              </text>

              {weak && (
                <rect x="-8" y="-4" width="136" height="80" fill="none" className="stroke-destructive" strokeWidth="1" strokeDasharray="4 3" />
              )}

              <rect
                x="0" y="0" width={STATION_W} height="72"
                fill={state === "unanswered" ? "transparent" : "hsl(var(--background))"}
                className={strokeClass(state, weak)}
                strokeWidth="1.5"
                strokeDasharray={state === "unanswered" ? "4 3" : undefined}
              />
              {/* NUMBER inside */}
              <text x="10" y="15" fontSize="9" letterSpacing="1.5" fontWeight="700"
                className={weak ? "fill-destructive" : "fill-muted-foreground"}>
                {st.n}
              </text>
              <Stamp state={state} weak={weak} />

              {/* Dropline to belt */}
              <line
                x1="60" y1="72" x2="60" y2={beltY - stationY}
                strokeDasharray={isMissing ? "2 5" : "3 3"}
                className={isMissing ? "stroke-destructive" : "stroke-foreground"}
                strokeWidth="1"
              />
            </motion.g>
          );
        })}

        {/* Leaks in GAPS between stations (future state only) */}
        {futureState && STATIONS.slice(0, -1).map((st, i) => {
          const next = STATIONS[i + 1];
          const a = answers[st.key];
          const b = answers[next.key];
          const broken = a !== "yes" || b !== "yes";
          if (!broken) return null;
          const cellLeftA = padX + cellW * i + (cellW - STATION_W) / 2;
          const cellLeftB = padX + cellW * (i + 1) + (cellW - STATION_W) / 2;
          const midX = (cellLeftA + STATION_W + cellLeftB) / 2;
          return (
            <motion.g
              key={`leak-${i}`}
              transform={`translate(${midX}, ${beltY - 18})`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            >
              <path d="M-14,-2 q14,-10 28,0" fill="none" className="stroke-destructive" strokeWidth="1" strokeDasharray="2 3" />
              <LeakDrops />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

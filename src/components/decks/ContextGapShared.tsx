/**
 * Shared "Context Gap" narrative slides for all vertical investor decks.
 *
 * Three configurable slide components, mirroring the new spine of /investor:
 *  1. <IcebergContextGap />            — replaces the old artifact-triptych Slide02
 *  2. <ExemplifiedArtifact />          — new "show, don't tell" annotated artifact
 *  3. <SinglePyramid />                — replaces the old gap-cases Slide03 with one
 *                                        large vertical-specific iceberg pyramid
 *  4. <OrgIntelligenceUnpacked />      — new "what lives inside the substrate" slide
 *
 * Each deck supplies a small VerticalContextConfig and renders these.
 * Palette HSL constants (TEAL/WARM/GREEN/RED/ACCENT) are passed through so
 * each deck keeps its own brand colors without forking the layout.
 */

import {
  AlertTriangle, Sparkles, Database, Brain, Users, RefreshCw,
  Target, Globe, GitBranch,
} from "lucide-react";
import type { ReactNode } from "react";

// ─── Shared shell helpers (each deck has identical SlideGrid/SlideBar) ──────

const NEUTRAL_GRID_LINE = "hsl(215 15% 75%)";
const NEUTRAL_BG = "hsl(0 0% 100%)";
const NEUTRAL_TEXT = "hsl(222 20% 10%)";
const NEUTRAL_MUTED = "hsl(215 15% 42%)";

function SharedGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${NEUTRAL_GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${NEUTRAL_GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    }} />
  );
}

function SharedBar({ from, to }: { from: string; to: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

// ─── Shared palette type ────────────────────────────────────────────────────

export type DeckPalette = {
  TEAL: string;
  WARM: string;
  GREEN: string;
  RED: string;
  ACCENT: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. ICEBERG CONTEXT GAP  (replaces old Slide02 artifact triptych)
// ═══════════════════════════════════════════════════════════════════════════

export type IcebergContextGapConfig = {
  palette: DeckPalette;
  /** UPPER label kicker, e.g. "The Category" */
  kicker?: string;
  /** Headline (default: "The Context Gap.") */
  headline?: string;
  /** Subheadline body */
  subheadline?: ReactNode;
  /** Above-waterline artifact chips, vertical-tailored (3-4 items) */
  above: string[];
  /** Below-waterline buckets — 4 categories, each with 3 items */
  buckets: { title: string; items: string[] }[];
  /** Bottom punchline (default: "Whatever you don't define, AI invents.") */
  punchline?: ReactNode;
};

export function IcebergContextGap({ config }: { config: IcebergContextGapConfig }) {
  const { palette, kicker = "The Category", headline = "The Context Gap.", subheadline, above, buckets, punchline } = config;
  const { WARM, GREEN } = palette;

  // Spread above-waterline chips evenly across the 4 anchor x-positions
  const xs = [720, 870, 1050, 1210];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: NEUTRAL_BG }}>
      <SharedGrid />

      <div className="relative z-20 px-28 pt-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          {kicker}
        </p>
        <h2 className="font-black mb-3" style={{ fontSize: 78, color: NEUTRAL_TEXT, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          {headline}
        </h2>
        {subheadline && (
          <p className="font-medium" style={{ fontSize: 26, color: NEUTRAL_MUTED, lineHeight: 1.35, maxWidth: 1500 }}>
            {subheadline}
          </p>
        )}
      </div>

      <div className="relative z-10 flex-1 mt-2">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 760" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="cgWaterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${WARM} / 0.04)`} />
              <stop offset="40%" stopColor={`hsl(${WARM} / 0.10)`} />
              <stop offset="100%" stopColor={`hsl(${WARM} / 0.22)`} />
            </linearGradient>
            <linearGradient id="cgIceTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${GREEN} / 0.20)`} />
              <stop offset="100%" stopColor={`hsl(${GREEN} / 0.36)`} />
            </linearGradient>
            <linearGradient id="cgIceBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${WARM} / 0.30)`} />
              <stop offset="100%" stopColor={`hsl(${WARM} / 0.55)`} />
            </linearGradient>
          </defs>

          <rect x="0" y="220" width="1920" height="540" fill="url(#cgWaterGrad)" />
          <line x1="0" y1="220" x2="1920" y2="220" stroke={`hsl(${WARM} / 0.45)`} strokeWidth="1.5" strokeDasharray="6 6" />

          <text x="1840" y="178" textAnchor="end" style={{ fontSize: 28, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 2 }}>~10% FORMALLY DEFINED</text>
          <text x="1840" y="206" textAnchor="end" style={{ fontSize: 16, fontWeight: 700, fill: NEUTRAL_TEXT }}>What AI is given today</text>
          <text x="1840" y="262" textAnchor="end" style={{ fontSize: 28, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 2 }}>~90% ORGANIZATIONAL INTELLIGENCE</text>
          <text x="1840" y="290" textAnchor="end" style={{ fontSize: 16, fontWeight: 700, fill: NEUTRAL_TEXT }}>What AI needs to work to your standards</text>
          <text x="1840" y="312" textAnchor="end" style={{ fontSize: 13, fontWeight: 500, fill: NEUTRAL_MUTED }}>Lives in people, calls, decisions, exceptions</text>

          <polygon points="870,220 960,90 1050,220" fill="url(#cgIceTop)" stroke={`hsl(${GREEN} / 0.7)`} strokeWidth="1.5" />
          <polygon points="870,220 480,740 1440,740 1050,220" fill="url(#cgIceBot)" stroke={`hsl(${WARM} / 0.55)`} strokeWidth="1.5" />

          {above.slice(0, 4).map((label, i) => (
            <g key={`a-${i}`}>
              <rect x={xs[i] - 70} y={140 - (i % 2) * 14} width="140" height="28" rx="6"
                fill={NEUTRAL_BG} stroke={`hsl(${GREEN} / 0.6)`} strokeWidth="1" />
              <text x={xs[i]} y={159 - (i % 2) * 14} textAnchor="middle"
                style={{ fontSize: 13, fontWeight: 700, fill: NEUTRAL_TEXT }}>{label}</text>
            </g>
          ))}
          <text x="960" y="58" textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 2 }}>WHAT AI IS GIVEN TODAY</text>

          {buckets.slice(0, 4).map((bucket, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const bw = 360, bh = 168;
            const bx = 580 + col * 410;
            const by = 305 + row * 195;
            return (
              <g key={`bk-${i}`}>
                <rect x={bx} y={by} width={bw} height={bh} rx="10"
                  fill={NEUTRAL_BG} stroke={`hsl(${WARM} / 0.55)`} strokeWidth="1.2" opacity="0.96" />
                <rect x={bx} y={by} width={bw} height="34" rx="10" fill={`hsl(${WARM} / 0.18)`} />
                <rect x={bx} y={by + 24} width={bw} height="10" fill={`hsl(${WARM} / 0.18)`} />
                <text x={bx + 18} y={by + 23}
                  style={{ fontSize: 16, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 1.5 }}>
                  {bucket.title.toUpperCase()}
                </text>
                {bucket.items.slice(0, 3).map((item, j) => (
                  <g key={`it-${j}`}>
                    <circle cx={bx + 24} cy={by + 66 + j * 34} r="3.5" fill={`hsl(${WARM})`} />
                    <text x={bx + 36} y={by + 70 + j * 34}
                      style={{ fontSize: 16, fontWeight: 600, fill: NEUTRAL_TEXT }}>{item}</text>
                  </g>
                ))}
              </g>
            );
          })}

          <text x="960" y="725" textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 2 }}>WHAT AI NEEDS TO WORK TO YOUR STANDARDS</text>
        </svg>
      </div>

      <div className="relative z-20 px-28 pb-8">
        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${WARM} / 0.08)`, border: `1.5px solid hsl(${WARM} / 0.28)` }}>
          <p className="font-black" style={{ fontSize: 24, color: NEUTRAL_TEXT }}>
            {punchline ?? (<>Whatever you don't define, <span style={{ color: `hsl(${WARM})` }}>AI invents.</span></>)}
          </p>
        </div>
      </div>

      <SharedBar from={GREEN} to={WARM} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. EXEMPLIFIED ARTIFACT  (new — annotated artifact specimen)
// ═══════════════════════════════════════════════════════════════════════════

export type ExemplifiedArtifactConfig = {
  palette: DeckPalette;
  /** UPPER label kicker, e.g. "The Context Gap, exemplified" */
  kicker?: string;
  /** Headline lead */
  headlineLead: string;
  /** Headline trailing emphasis */
  headlineEmphasis: string;
  /** Live signals chip text on top-right */
  liveChip?: string;
  /** Artifact metadata (renders in artifact "chrome") */
  artifact: {
    typeLabel: string;       // e.g. "DEVIATION REPORT · ready for QA review"
    timestamp: string;       // e.g. "09:41 · Mon"
    headers: { label: string; value: ReactNode }[];
    /** Body lines. Each segment is either string or { mark, n } where mark is highlighted */
    body: BodyLine[];
    verdict: string;         // bottom strip, e.g. "Procedurally correct. Factually wrong. Audit-fragile."
  };
  /** 4 annotations matching the 4 marked phrases in the body */
  annotations: { n: number; nature: string; title: string; body: string }[];
  /** "What AI had" footer card body */
  hadBody: string;
  /** "What closes the gap" footer card body */
  closesBody: ReactNode;
};

export type BodyLine = (string | { mark: string; n: number })[];

export function ExemplifiedArtifact({ config }: { config: ExemplifiedArtifactConfig }) {
  const { palette, kicker = "The Context Gap, exemplified", headlineLead, headlineEmphasis, liveChip = "Live signals · not in any document", artifact, annotations, hadBody, closesBody } = config;
  const { TEAL, WARM, ACCENT } = palette;

  const Pin = ({ n }: { n: number }) => (
    <sup className="inline-flex items-center justify-center rounded-full font-black align-super ml-0.5"
      style={{
        width: 18, height: 18, fontSize: 11, lineHeight: 1,
        background: `hsl(${WARM})`, color: NEUTRAL_BG,
        boxShadow: `0 0 0 2px hsl(${WARM} / 0.18)`,
        verticalAlign: "super",
      }}>{n}</sup>
  );

  const Mark = ({ children, n }: { children: ReactNode; n: number }) => (
    <span style={{
      background: `hsl(${WARM} / 0.14)`,
      borderBottom: `2px solid hsl(${WARM})`,
      padding: "0 2px",
      borderRadius: 2,
      color: NEUTRAL_TEXT,
      fontWeight: 600,
    }}>{children}<Pin n={n} /></span>
  );

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: NEUTRAL_BG }}>
      <SharedGrid />
      <div className="relative z-10 flex flex-col h-full px-16 pt-9 pb-7">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              {kicker}
            </p>
            <h2 className="font-black" style={{ fontSize: 46, color: NEUTRAL_TEXT, lineHeight: 1.05 }}>
              {headlineLead}{' '}
              <span style={{ color: `hsl(${WARM})` }}>{headlineEmphasis}</span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 shrink-0 ml-8 px-4 py-2 rounded-full"
            style={{ border: `1.5px solid hsl(${WARM} / 0.35)`, background: `hsl(${WARM} / 0.06)` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${WARM})` }} />
            <span className="font-bold tracking-[0.18em] uppercase" style={{ fontSize: 11, color: `hsl(${WARM})` }}>
              {liveChip}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid gap-7" style={{ gridTemplateColumns: "7fr 5fr" }}>

          {/* Artifact (hero) */}
          <div className="relative rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: NEUTRAL_BG,
              border: `1px solid hsl(${TEAL} / 0.20)`,
              boxShadow: `0 18px 60px -24px hsl(222 30% 20% / 0.18), 0 2px 0 hsl(${TEAL} / 0.06)`,
            }}>
            <div className="px-7 py-3 flex items-center gap-2 border-b"
              style={{ borderColor: `hsl(${TEAL} / 0.12)`, background: `hsl(${TEAL} / 0.03)` }}>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 70% 65%)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(45 90% 60%)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(140 50% 55%)" }} />
              </div>
              <div className="flex items-center gap-2 ml-3">
                <Sparkles size={14} style={{ color: `hsl(${ACCENT})` }} />
                <span className="font-bold tracking-[0.14em] uppercase" style={{ fontSize: 10.5, color: `hsl(${ACCENT})` }}>
                  {artifact.typeLabel}
                </span>
              </div>
              <span className="ml-auto font-mono" style={{ fontSize: 10.5, color: NEUTRAL_MUTED }}>
                {artifact.timestamp}
              </span>
            </div>

            <div className="px-9 pt-6 pb-3" style={{ borderBottom: `1px dashed hsl(${TEAL} / 0.18)` }}>
              <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                {artifact.headers.map((h, i) => (
                  <div key={i} className={i > 0 ? "mt-1" : ""}>
                    <span style={{ color: NEUTRAL_MUTED, width: 80, display: "inline-block" }}>{h.label}</span>
                    <span style={{ color: NEUTRAL_TEXT }}>{h.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 px-9 py-7"
              style={{ fontSize: 22, color: NEUTRAL_TEXT, lineHeight: 1.7, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {artifact.body.map((line, i) => (
                <p key={i} className={i < artifact.body.length - 1 ? "mb-6" : ""}
                  style={i === artifact.body.length - 1 ? { color: NEUTRAL_MUTED } : undefined}>
                  {line.map((seg, j) =>
                    typeof seg === "string"
                      ? <span key={j}>{seg}</span>
                      : <Mark key={j} n={seg.n}>{seg.mark}</Mark>
                  )}
                </p>
              ))}
            </div>

            <div className="px-9 py-3.5 flex items-center gap-3"
              style={{ borderTop: `1px solid hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.06)` }}>
              <AlertTriangle size={18} style={{ color: `hsl(${WARM})` }} />
              <p className="font-black" style={{ fontSize: 15, color: NEUTRAL_TEXT }}>
                {artifact.verdict}
              </p>
            </div>
          </div>

          {/* Margin notes */}
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-black tracking-[0.18em] uppercase" style={{ fontSize: 14, color: `hsl(${WARM})` }}>
                What AI couldn&apos;t see
              </p>
              <p className="font-semibold" style={{ fontSize: 13, color: NEUTRAL_MUTED }}>
                Lives in heads, threads, hallway calls.
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {annotations.map((a) => (
                <div key={a.n} className="relative rounded-xl px-4 py-3.5 flex gap-3"
                  style={{
                    background: NEUTRAL_BG,
                    border: `1px solid hsl(${WARM} / 0.30)`,
                    boxShadow: `0 1px 0 hsl(${WARM} / 0.08)`,
                  }}>
                  <div className="shrink-0 flex flex-col items-center" style={{ width: 28 }}>
                    <span className="inline-flex items-center justify-center rounded-full font-black"
                      style={{
                        width: 26, height: 26, fontSize: 13,
                        background: `hsl(${WARM})`, color: NEUTRAL_BG,
                        boxShadow: `0 0 0 3px hsl(${WARM} / 0.15)`,
                      }}>{a.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black tracking-[0.14em] uppercase rounded-sm px-1.5 py-0.5"
                        style={{ fontSize: 11, color: `hsl(${WARM})`, background: `hsl(${WARM} / 0.12)` }}>
                        {a.nature}
                      </span>
                    </div>
                    <p className="font-black mb-1" style={{ fontSize: 16, color: NEUTRAL_TEXT, lineHeight: 1.25 }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: 14, color: NEUTRAL_MUTED, lineHeight: 1.5 }}>{a.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg px-4 py-3"
                style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.20)` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Database size={14} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 11.5, color: `hsl(${TEAL})` }}>
                    What AI had
                  </p>
                </div>
                <p style={{ fontSize: 13.5, color: NEUTRAL_TEXT, lineHeight: 1.4 }}>{hadBody}</p>
                <p className="mt-1 font-semibold" style={{ fontSize: 12, color: NEUTRAL_MUTED }}>
                  Indexable. RAG-friendly. Insufficient.
                </p>
              </div>
              <div className="rounded-lg px-4 py-3"
                style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.30)` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} style={{ color: `hsl(${ACCENT})` }} />
                  <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 11.5, color: `hsl(${ACCENT})` }}>
                    What closes the gap
                  </p>
                </div>
                <p style={{ fontSize: 13.5, color: NEUTRAL_TEXT, lineHeight: 1.4 }}>{closesBody}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SharedBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SINGLE PYRAMID  (replaces old Slide03 — one big vertical iceberg)
// ═══════════════════════════════════════════════════════════════════════════

export type SinglePyramidConfig = {
  palette: DeckPalette;
  kicker: string;
  headlineLead: string;
  headlineEmphasis: string;
  /** Above-waterline (what AI sees) — vertical artifacts */
  above: string[];
  /** Below-waterline (what AI misses) — organizational intelligence in vertical language */
  below: string[];
  /** Red strip "what breaks" */
  breaks: string;
  /** Same pattern in… */
  alsoApplies: string[];
};

export function SinglePyramid({ config }: { config: SinglePyramidConfig }) {
  const { palette, kicker, headlineLead, headlineEmphasis, above, below, breaks, alsoApplies } = config;
  const { GREEN, RED, ACCENT } = palette;
  const colorBelow = palette.WARM;

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: NEUTRAL_BG }}>
      <SharedGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>
          {kicker}
        </p>
        <h2 className="font-black mb-3" style={{ fontSize: 50, color: NEUTRAL_TEXT, lineHeight: 1.05 }}>
          {headlineLead}{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>{headlineEmphasis}</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 18, color: NEUTRAL_MUTED, maxWidth: 1500, lineHeight: 1.4 }}>
          The artifacts on top of the waterline are what AI sees. The Organizational Intelligence below the waterline is what determines whether the output is correct, safe, and ready for sign-off.
        </p>

        <div className="flex-1 min-h-0 grid grid-cols-[5fr_7fr] gap-8 items-stretch">
          {/* LEFT: One big iceberg */}
          <div className="relative rounded-2xl border flex items-center justify-center"
            style={{ borderColor: `hsl(${colorBelow} / 0.25)`, background: `hsl(${colorBelow} / 0.025)` }}>
            <svg viewBox="0 0 500 600" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
              <defs>
                <linearGradient id="spIceTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(${GREEN} / 0.18)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0.36)`} />
                </linearGradient>
                <linearGradient id="spIceBot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(${colorBelow} / 0.14)`} />
                  <stop offset="100%" stopColor={`hsl(${colorBelow} / 0.32)`} />
                </linearGradient>
                <linearGradient id="spWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(${colorBelow} / 0.04)`} />
                  <stop offset="100%" stopColor={`hsl(${colorBelow} / 0.10)`} />
                </linearGradient>
              </defs>
              <rect x="0" y="200" width="500" height="400" fill="url(#spWater)" />
              <line x1="20" y1="200" x2="480" y2="200"
                stroke={`hsl(${colorBelow} / 0.55)`} strokeWidth="1.6" strokeDasharray="8 7" />
              <polygon points="160,200 250,40 340,200" fill="url(#spIceTop)"
                stroke={`hsl(${GREEN} / 0.85)`} strokeWidth="1.8" strokeLinejoin="round" />
              <polygon points="160,200 50,560 450,560 340,200" fill="url(#spIceBot)"
                stroke={`hsl(${colorBelow} / 0.75)`} strokeWidth="1.8" strokeLinejoin="round" />
              <text x="250" y="32" textAnchor="middle"
                style={{ fontSize: 14, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 1.5 }}>~10%</text>
              <text x="250" y="585" textAnchor="middle"
                style={{ fontSize: 16, fontWeight: 900, fill: `hsl(${colorBelow})`, letterSpacing: 1.5 }}>~90% ORGANIZATIONAL INTELLIGENCE</text>
            </svg>
          </div>

          {/* RIGHT: above + below content */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="rounded-xl border-2 px-6 py-4"
              style={{ borderColor: `hsl(${GREEN} / 0.35)`, background: `hsl(${GREEN} / 0.05)` }}>
              <p className="font-black tracking-[0.16em] uppercase mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
                What AI sees today (above the waterline)
              </p>
              <div className="flex flex-wrap gap-2">
                {above.map((a) => (
                  <span key={a} className="rounded-full px-4 py-1.5 font-bold border"
                    style={{ fontSize: 15, color: NEUTRAL_TEXT, background: NEUTRAL_BG, borderColor: `hsl(${GREEN} / 0.5)` }}>{a}</span>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 rounded-xl border-2 px-6 py-4 flex flex-col"
              style={{ borderColor: `hsl(${colorBelow} / 0.40)`, background: `hsl(${colorBelow} / 0.05)` }}>
              <p className="font-black tracking-[0.16em] uppercase mb-3" style={{ fontSize: 13, color: `hsl(${colorBelow})` }}>
                What AI misses (organizational intelligence, below the waterline)
              </p>
              <div className="flex-1 grid grid-cols-1 gap-2.5 content-start overflow-hidden">
                {below.map((b) => (
                  <div key={b} className="rounded-md border px-3 py-2 flex gap-2"
                    style={{ background: NEUTRAL_BG, borderColor: `hsl(${colorBelow} / 0.25)` }}>
                    <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: `hsl(${colorBelow})` }} />
                    <p className="font-semibold" style={{ fontSize: 15, color: NEUTRAL_TEXT, lineHeight: 1.35 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border px-5 py-3 flex items-center gap-3"
              style={{ borderColor: `hsl(${RED} / 0.35)`, background: `hsl(${RED} / 0.06)` }}>
              <AlertTriangle size={18} style={{ color: `hsl(${RED})` }} />
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${RED})` }}>{breaks}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-2 mt-5">
          <p className="font-bold shrink-0" style={{ fontSize: 16, color: NEUTRAL_MUTED }}>Same pattern in:</p>
          <div className="flex flex-wrap gap-2.5">
            {alsoApplies.map(a => (
              <span key={a} className="rounded-full px-4 py-1.5 font-semibold border" style={{ fontSize: 15, color: NEUTRAL_MUTED, borderColor: `hsl(215 15% 85%)`, background: `hsl(220 15% 98%)` }}>{a}</span>
            ))}
          </div>
        </div>
      </div>
      <SharedBar from={ACCENT} to={RED} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. ORGANIZATIONAL INTELLIGENCE UNPACKED  (new — knowledge-graph + 6 facets)
// ═══════════════════════════════════════════════════════════════════════════

export type OrgIntelligenceUnpackedConfig = {
  palette: DeckPalette;
  kicker?: string;
  headlineLead: string;
  headlineEmphasis: string;
  intro: string;
  /** 6 facet cards. Defaults provided if omitted. */
  facets?: { title: string; body: string }[];
  /** Bottom punchline */
  punchline: ReactNode;
};

const DEFAULT_FACETS = [
  { icon: <Brain size={26} />, title: "Personal Expertise",
    body: "What seniors actually know: judgment calls, exceptions, the way they decide under pressure. Today: trapped in heads." },
  { icon: <Users size={26} />, title: "Team & Account Memory",
    body: "How this client is run, what was promised verbally, who owns what, what was tried last quarter and why it failed." },
  { icon: <RefreshCw size={26} />, title: "Changing Dynamics",
    body: "Markets, regulation, supply, competitors — context that drifted last week and rewrote the right answer." },
  { icon: <Target size={26} />, title: "New Goals & Strategy",
    body: "What leadership decided this quarter, what's now in scope, what's been deprioritized. Most AI never gets told." },
  { icon: <Globe size={26} />, title: "External Inputs",
    body: "Regulator updates, partner changes, market signals, supplier notices — facts from the outside the org has to react to." },
  { icon: <GitBranch size={26} />, title: "Decisions & Exceptions",
    body: "Sign-off thresholds, escalations still open, the rules that override the rules. The connective tissue between docs." },
];

export function OrgIntelligenceUnpacked({ config }: { config: OrgIntelligenceUnpackedConfig }) {
  const { palette, kicker = "Organizational Intelligence — Unpacked", headlineLead, headlineEmphasis, intro, facets, punchline } = config;
  const { TEAL, GREEN } = palette;

  // Build facet list: when caller provides custom titles/body, default icons reused by index.
  const items = (facets ?? DEFAULT_FACETS.map(f => ({ title: f.title, body: f.body }))).slice(0, 6).map((f, i) => ({
    ...f,
    icon: DEFAULT_FACETS[i]?.icon ?? <Brain size={26} />,
  }));

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: NEUTRAL_BG }}>
      <SharedGrid />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col h-full px-20 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>
          {kicker}
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 56, color: NEUTRAL_TEXT, lineHeight: 1.04 }}>
          {headlineLead}{' '}
          <span style={{ color: `hsl(${GREEN})` }}>{headlineEmphasis}</span>
        </h2>
        <p className="font-medium mb-7" style={{ fontSize: 20, color: NEUTRAL_MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
          {intro}
        </p>

        <div className="flex-1 min-h-0 grid gap-8 items-center" style={{ gridTemplateColumns: "5fr 7fr" }}>
          <div className="relative h-full rounded-2xl border-2 flex items-center justify-center"
            style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `linear-gradient(135deg, hsl(${TEAL} / 0.04), hsl(${GREEN} / 0.06))` }}>
            <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="oiHaloShared" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                </radialGradient>
              </defs>
              <circle cx="250" cy="250" r="220" fill="url(#oiHaloShared)" />
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const r = 170;
                const x = 250 + r * Math.cos(angle);
                const y = 250 + r * Math.sin(angle);
                return (
                  <g key={i}>
                    <line x1="250" y1="250" x2={x} y2={y}
                      stroke={`hsl(${TEAL} / 0.40)`} strokeWidth="1.5" />
                    {Array.from({ length: 6 }).map((_, j) => {
                      if (j <= i) return null;
                      const a2 = (j / 6) * Math.PI * 2 - Math.PI / 2;
                      const x2 = 250 + r * Math.cos(a2);
                      const y2 = 250 + r * Math.sin(a2);
                      return (
                        <line key={`p-${j}`} x1={x} y1={y} x2={x2} y2={y2}
                          stroke={`hsl(${TEAL} / 0.15)`} strokeWidth="0.8" />
                      );
                    })}
                    <circle cx={x} cy={y} r="22" fill={NEUTRAL_BG}
                      stroke={`hsl(${GREEN})`} strokeWidth="2" />
                    <circle cx={x} cy={y} r="6" fill={`hsl(${GREEN})`} />
                  </g>
                );
              })}
              <circle cx="250" cy="250" r="58" fill={NEUTRAL_BG} stroke={`hsl(${GREEN})`} strokeWidth="3" />
              <text x="250" y="245" textAnchor="middle"
                style={{ fontSize: 13, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 1.5 }}>
                ORGANIZATIONAL
              </text>
              <text x="250" y="265" textAnchor="middle"
                style={{ fontSize: 13, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 1.5 }}>
                INTELLIGENCE
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4 h-full content-center">
            {items.map((f, i) => (
              <div key={i} className="rounded-xl border-2 px-5 py-4"
                style={{
                  borderColor: `hsl(${GREEN} / 0.30)`,
                  background: NEUTRAL_BG,
                  boxShadow: `0 2px 0 hsl(${GREEN} / 0.10)`,
                }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: `hsl(${TEAL})` }}>{f.icon}</span>
                  <p className="font-black" style={{ fontSize: 19, color: NEUTRAL_TEXT }}>{f.title}</p>
                </div>
                <p className="font-medium" style={{ fontSize: 14, color: NEUTRAL_MUTED, lineHeight: 1.45 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border px-8 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `hsl(${GREEN} / 0.06)` }}>
          <Sparkles size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p className="font-bold" style={{ fontSize: 21, color: NEUTRAL_TEXT, lineHeight: 1.4 }}>
            {punchline}
          </p>
        </div>
      </div>
      <SharedBar from={TEAL} to={GREEN} />
    </div>
  );
}
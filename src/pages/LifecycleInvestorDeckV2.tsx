import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, Check, CheckCircle2,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
  Layers, Eye, Workflow, Lightbulb, Award, Database, Brain, Cpu, Clock, Rocket, FileText, Car,
  User, GitBranch, Sparkles,
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";
import zoltanPhoto from "@/assets/zoltan-kauker.png";

// ─── Scaled slide container ──────────────────────────────────────────────────

function ScaledSlide({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min(width / 1920, height / 1080));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full h-full">
      <div style={{
        position: "absolute", width: 1920, height: 1080,
        left: "50%", top: "50%", marginLeft: -960, marginTop: -540,
        transform: `scale(${scale})`, transformOrigin: "center center",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";
const WARM = "15 85% 55%";
const RED = "0 72% 50%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";
const SEAFOAM = "170 100% 33%";
const GOLD = "45 95% 42%";
const ACCENT = "200 90% 42%";

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}


function SlideBar({ from = TEAL, to = MINT }: { from?: string; to?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-14 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>
            LIZA OS · Seed Round
          </span>
        </div>

        <h1 className="font-black mb-6" style={{ fontSize: 82, lineHeight: 1.05, color: TEXT }}>
          The Operating System for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organizations.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Your experts know what good looks like. AI doesn't.<br />
          <span style={{ color: `hsl(${TEAL})` }}>We turn your Organizational Intelligence into the runtime AI executes on.</span>
        </p>

        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; €2M Seed &nbsp;·&nbsp; Early Revenue
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE SHAPE — THE SHAPE OF THE COMPANY (Horizontal framing)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideShape() {
  const verticals = [
    { label: "Prof. Services", sub: "Live · reference deployment", color: GOLD, status: "LIVE" },
    { label: "AEC", sub: "Entering · Nemetschek path", color: TEAL, status: "NEXT" },
    { label: "Pharma", sub: "In build · lighthouse recruiting", color: BLUE, status: "NEXT" },
    { label: "Automotive", sub: "In build · cross-border R&D", color: MINT, status: "NEXT" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <div className="px-3 py-1 rounded-md text-xs font-bold tracking-[0.2em]" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
            02 · THE SHAPE OF THE COMPANY
          </div>
        </div>
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          One OS. <span style={{ color: `hsl(${TEAL})` }}>Verticals as proof of compounding.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          We build a single context layer and deploy it vertical-by-vertical. Each vertical funds the platform; the platform compounds across all of them. The horizontal round funds the OS underneath.
        </p>

        {/* Horizontal platform bar — leading position */}
        <div className="rounded-xl p-7 border-2 mb-2" style={{
          background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`,
          borderColor: `hsl(${TEAL})`,
        }}>
          <div className="flex items-center justify-between gap-8">
            <div>
              <div className="px-2 py-0.5 rounded text-xs font-bold tracking-[0.2em] inline-block mb-2"
                style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                YOUR ROUND
              </div>
              <div className="font-black" style={{ fontSize: 32, color: "white" }}>LIZA OS · The Context Layer</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                Knowledge ingestion · Governance · Execution loop · Audit trail
              </div>
            </div>
            <div className="flex gap-3">
              {["Ingest", "Govern", "Execute", "Audit"].map(p => (
                <div key={p} className="px-3 py-1.5 rounded-md font-bold" style={{
                  background: "rgba(255,255,255,0.18)", color: "white", fontSize: 16
                }}>{p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center my-2" style={{ color: SUBTLE }}>
          <div className="text-3xl leading-none">▴ ▴ ▴ ▴</div>
        </div>

        {/* Vertical pillars */}
        <div className="grid grid-cols-4 gap-6 flex-1">
          {verticals.map(v => (
            <div key={v.label} className="rounded-xl border-2 p-6 flex flex-col" style={{
              borderColor: CHROME_BORDER,
              background: CARD_ALT,
            }}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-black" style={{ fontSize: 24, color: TEXT }}>{v.label}</div>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.18em]" style={{
                  background: `hsl(${v.color} / 0.12)`, color: `hsl(${v.color})`
                }}>{v.status}</div>
              </div>
              <div style={{ fontSize: 15, color: MUTED }}>{v.sub}</div>
            </div>
          ))}
        </div>

        {/* Investor message */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${TEAL})` }}>WHAT YOU OWN</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              The horizontal context layer. The OS that compounds across every vertical we land.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${BLUE})` }}>WHAT FUNDS IT</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Vertical investors and strategic partners co-fund deployment, sharing CAC and signal.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${GOLD})` }}>HOW WE STRUCTURE IT</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Vertical investors take standard equity in the parent. No IP carve-outs. Multiple at the OS.
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE CONTEXT GAP
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  // Iceberg in enterprise vocabulary.
  // ABOVE waterline = formally defined, machine-readable.
  // BELOW waterline = tacit operating knowledge, grouped into 4 buckets
  // (no overlap, plenty of breathing room).
  const above = [
    { x: 720,  label: "Policies" },
    { x: 870,  label: "Procedures" },
    { x: 1050, label: "Specifications" },
    { x: 1210, label: "Records" },
  ];
  const buckets: { title: string; items: string[] }[] = [
    { title: "Operating Reasoning",
      items: ["How we actually price this segment", "The exceptions to the SOP", "Senior pricing & sign-off calls"] },
    { title: "Account & Client Memory",
      items: ["How this client is run", "What was promised verbally", "Past disputes and resolutions"] },
    { title: "Cross-Functional Decisions",
      items: ["What changed in last review", "Sign-off thresholds and owners", "Open escalations and flags"] },
    { title: "Regulatory & Legal Practice",
      items: ["Region-specific clauses", "Audit findings still in scope", "Rules that override the rule"] },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />

      {/* Header */}
      <div className="relative z-20 px-28 pt-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          The Category
        </p>
        <h2 className="font-black mb-3" style={{ fontSize: 78, color: TEXT, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          The Context Gap.
        </h2>
        <p className="font-medium" style={{ fontSize: 26, color: MUTED, lineHeight: 1.35, maxWidth: 1500 }}>
          AI doesn&apos;t fail because the model is weak. It fails because <span style={{ color: TEXT, fontWeight: 700 }}>most of how your enterprise actually operates was never formally defined.</span>
        </p>
      </div>

      {/* Iceberg canvas */}
      <div className="relative z-10 flex-1 mt-2">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 760" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${WARM} / 0.04)`} />
              <stop offset="40%" stopColor={`hsl(${WARM} / 0.10)`} />
              <stop offset="100%" stopColor={`hsl(${WARM} / 0.22)`} />
            </linearGradient>
            <linearGradient id="icebergTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${GREEN} / 0.20)`} />
              <stop offset="100%" stopColor={`hsl(${GREEN} / 0.36)`} />
            </linearGradient>
            <linearGradient id="icebergBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${WARM} / 0.30)`} />
              <stop offset="100%" stopColor={`hsl(${WARM} / 0.55)`} />
            </linearGradient>
          </defs>

          {/* Water below waterline */}
          <rect x="0" y="220" width="1920" height="540" fill="url(#waterGrad)" />

          {/* Waterline + enterprise-vocabulary labels (right-aligned to avoid header collision) */}
          <line x1="0" y1="220" x2="1920" y2="220" stroke={`hsl(${WARM} / 0.45)`} strokeWidth="1.5" strokeDasharray="6 6" />
          {/* Right-side stack: oversized, hierarchy-leading labels */}
          <text x="1840" y="178" textAnchor="end" style={{ fontSize: 28, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 2 }}>~10% FORMALLY DEFINED</text>
          <text x="1840" y="206" textAnchor="end" style={{ fontSize: 16, fontWeight: 700, fill: TEXT }}>What AI is given today</text>
          <text x="1840" y="262" textAnchor="end" style={{ fontSize: 28, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 2 }}>~90% ORGANIZATIONAL INTELLIGENCE</text>
          <text x="1840" y="290" textAnchor="end" style={{ fontSize: 16, fontWeight: 700, fill: TEXT }}>What AI needs to work to your standards</text>
          <text x="1840" y="312" textAnchor="end" style={{ fontSize: 13, fontWeight: 500, fill: MUTED }}>Lives in people, calls, decisions, exceptions</text>

          {/* Iceberg — above waterline (small) */}
          <polygon points="870,220 960,90 1050,220" fill="url(#icebergTop)" stroke={`hsl(${GREEN} / 0.7)`} strokeWidth="1.5" />
          {/* Iceberg — below waterline (massive — wider so buckets fit) */}
          <polygon points="870,220 480,740 1440,740 1050,220" fill="url(#icebergBot)" stroke={`hsl(${WARM} / 0.55)`} strokeWidth="1.5" />

          {/* Above-water artifact labels */}
          {above.map((a, i) => (
            <g key={`a-${i}`}>
              <rect x={a.x - 60} y={140 - (i % 2) * 14} width="120" height="28" rx="6"
                fill={BG} stroke={`hsl(${GREEN} / 0.6)`} strokeWidth="1" />
              <text x={a.x} y={159 - (i % 2) * 14} textAnchor="middle"
                style={{ fontSize: 13, fontWeight: 700, fill: TEXT }}>{a.label}</text>
            </g>
          ))}
          <text x="960" y="58" textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 2 }}>WHAT AI IS GIVEN TODAY</text>

          {/* Below-water — 4 categorized buckets, 2x2, no overlap */}
          {buckets.map((bucket, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const bw = 360, bh = 168;
            const bx = 580 + col * 410;
            const by = 305 + row * 195;
            return (
              <g key={`bk-${i}`}>
                {/* Bucket panel */}
                <rect x={bx} y={by} width={bw} height={bh} rx="10"
                  fill={BG} stroke={`hsl(${WARM} / 0.55)`} strokeWidth="1.2" opacity="0.96" />
                {/* Bucket title bar */}
                <rect x={bx} y={by} width={bw} height="34" rx="10"
                  fill={`hsl(${WARM} / 0.18)`} />
                <rect x={bx} y={by + 24} width={bw} height="10"
                  fill={`hsl(${WARM} / 0.18)`} />
                <text x={bx + 18} y={by + 23}
                  style={{ fontSize: 16, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 1.5 }}>
                  {bucket.title.toUpperCase()}
                </text>
                {/* Bucket items */}
                {bucket.items.map((item, j) => (
                  <g key={`it-${j}`}>
                    <circle cx={bx + 24} cy={by + 66 + j * 34} r="3.5" fill={`hsl(${WARM})`} />
                    <text x={bx + 36} y={by + 70 + j * 34}
                      style={{ fontSize: 16, fontWeight: 600, fill: TEXT }}>{item}</text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* Bottom caption */}
          <text x="960" y="725" textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 2 }}>WHAT AI NEEDS TO WORK TO YOUR STANDARDS</text>
        </svg>
      </div>

      {/* Bottom punchline strip */}
      <div className="relative z-20 px-28 pb-8">
        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${WARM} / 0.08)`, border: `1.5px solid hsl(${WARM} / 0.28)` }}>
          <p className="font-black" style={{ fontSize: 24, color: TEXT }}>
            Whatever you don&apos;t define, <span style={{ color: `hsl(${WARM})` }}>AI invents.</span>
          </p>
        </div>
      </div>

      <SlideBar from={GREEN} to={WARM} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02b — THE CONTEXT GAP, EXEMPLIFIED (one specimen, given vs. not given)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideContextGapExemplified() {
  // ───────────────────────────────────────────────────────────────────────────
  // SHOW, DON'T TELL — Annotated email.
  // The email is the hero of the slide. Specific phrases are flagged with
  // numbered pins. The right column holds the corresponding margin notes —
  // the unwritten / contradictory / just-changed reality each pin depends on.
  // A small footer strip frames what AI *had* vs. what closes the gap.
  // ───────────────────────────────────────────────────────────────────────────

  // Each annotation pin maps to a phrase in the email. The phrase is rendered
  // inline with a warm underline + numbered superscript, and the right rail
  // shows the matching note.
  const annotations = [
    {
      n: 1,
      nature: "JUST CHANGED",
      title: "Decided 40 minutes ago",
      body: "Integration milestone moved to Nov 14 in Tuesday's steerco. No document captures it yet. The next index refresh is tonight.",
    },
    {
      n: 2,
      nature: "OPEN ISSUE",
      title: "Live commercial dispute",
      body: "Open since July. Tone must acknowledge it. Status changes weekly. Lives in a Slack thread, not the CRM.",
    },
    {
      n: 3,
      nature: "CONTRADICTION",
      title: "Two pricing rules disagree",
      body: "Rate card says €X. The 2024 NorthBank framework says €Y. The framework wins — but RAG retrieves both with no way to pick.",
    },
    {
      n: 4,
      nature: "UNWRITTEN RULE",
      title: "Sarah skips this line",
      body: "Formal, Monday 7am. Ignores anything ending in \"happy to discuss.\" Nobody writes this down. The team just knows.",
    },
  ];

  // Small superscript pin used inline with email text.
  const Pin = ({ n }: { n: number }) => (
    <sup
      className="inline-flex items-center justify-center rounded-full font-black align-super ml-0.5"
      style={{
        width: 18, height: 18, fontSize: 11, lineHeight: 1,
        background: `hsl(${WARM})`, color: BG,
        boxShadow: `0 0 0 2px hsl(${WARM} / 0.18)`,
        verticalAlign: "super",
      }}
    >{n}</sup>
  );

  // Underlined "this phrase is wrong because…" treatment.
  const Mark = ({ children, n }: { children: React.ReactNode; n: number }) => (
    <span style={{
      background: `hsl(${WARM} / 0.14)`,
      borderBottom: `2px solid hsl(${WARM})`,
      padding: "0 2px",
      borderRadius: 2,
      color: TEXT,
      fontWeight: 600,
    }}>{children}<Pin n={n} /></span>
  );

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-16 pt-9 pb-7">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              The Context Gap, exemplified
            </p>
            <h2 className="font-black" style={{ fontSize: 46, color: TEXT, lineHeight: 1.05 }}>
              The email AI drafted looks fine.{' '}
              <span style={{ color: `hsl(${WARM})` }}>Every highlighted phrase is wrong.</span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 shrink-0 ml-8 px-4 py-2 rounded-full"
            style={{ border: `1.5px solid hsl(${WARM} / 0.35)`, background: `hsl(${WARM} / 0.06)` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${WARM})` }} />
            <span className="font-bold tracking-[0.18em] uppercase" style={{ fontSize: 11, color: `hsl(${WARM})` }}>
              Live signals · not in any document
            </span>
          </div>
        </div>

        {/* Stage: email (hero) + margin notes */}
        <div className="flex-1 min-h-0 grid gap-7" style={{ gridTemplateColumns: "7fr 5fr" }}>

          {/* ─── EMAIL — the hero ─── */}
          <div className="relative rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: BG,
              border: `1px solid hsl(${TEAL} / 0.20)`,
              boxShadow: `0 18px 60px -24px hsl(222 30% 20% / 0.18), 0 2px 0 hsl(${TEAL} / 0.06)`,
            }}>
            {/* Mail chrome */}
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
                  Drafted by AI · ready to send
                </span>
              </div>
              <span className="ml-auto font-mono" style={{ fontSize: 10.5, color: MUTED }}>
                09:41 · Mon
              </span>
            </div>

            {/* Headers */}
            <div className="px-9 pt-6 pb-3" style={{ borderBottom: `1px dashed hsl(${TEAL} / 0.18)` }}>
              <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                <div><span style={{ color: MUTED, width: 64, display: "inline-block" }}>To</span>
                  <span style={{ color: TEXT, fontWeight: 600 }}>Sarah Chen</span>
                  <span style={{ color: MUTED }}> · Client Lead, NorthBank</span>
                </div>
                <div><span style={{ color: MUTED, width: 64, display: "inline-block" }}>From</span>
                  <span style={{ color: TEXT }}>atlas-team@company.com</span>
                </div>
                <div className="mt-1"><span style={{ color: MUTED, width: 64, display: "inline-block" }}>Subject</span>
                  <span style={{ color: TEXT, fontWeight: 800, fontSize: 16 }}>Project Atlas — Weekly Update</span>
                </div>
              </div>
            </div>

            {/* Body — annotated */}
            <div className="flex-1 px-9 py-7"
              style={{ fontSize: 22, color: TEXT, lineHeight: 1.7, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              <p className="mb-6">Hi Sarah,</p>
              <p className="mb-6">
                Quick update on Atlas. Phase 2 is on track and the integration milestone
                is expected{' '}
                <Mark n={1}>next Friday</Mark>.
              </p>
              <p className="mb-6">
                <Mark n={2}>Open risks were reviewed this week — all manageable.</Mark>{' '}
                Pricing follows the{' '}
                <Mark n={3}>standard rate card</Mark>.
              </p>
              <p className="mb-6">
                <Mark n={4}>Let me know if you'd like to discuss.</Mark>
              </p>
              <p style={{ color: MUTED }}>Best,<br/>The Atlas Team</p>
            </div>

            {/* Verdict strip */}
            <div className="px-9 py-3.5 flex items-center gap-3"
              style={{ borderTop: `1px solid hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.06)` }}>
              <AlertTriangle size={18} style={{ color: `hsl(${WARM})` }} />
              <p className="font-black" style={{ fontSize: 15, color: TEXT }}>
                Grammatically correct. Factually wrong. Relationally damaging.
              </p>
            </div>
          </div>

          {/* ─── MARGIN NOTES — the missing reality ─── */}
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-black tracking-[0.18em] uppercase" style={{ fontSize: 14, color: `hsl(${WARM})` }}>
                What AI couldn&apos;t see
              </p>
              <p className="font-semibold" style={{ fontSize: 13, color: MUTED }}>
                Lives in heads, threads, hallway calls.
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {annotations.map((a) => (
                <div key={a.n} className="relative rounded-xl px-4 py-3.5 flex gap-3"
                  style={{
                    background: BG,
                    border: `1px solid hsl(${WARM} / 0.30)`,
                    boxShadow: `0 1px 0 hsl(${WARM} / 0.08)`,
                  }}>
                  <div className="shrink-0 flex flex-col items-center" style={{ width: 28 }}>
                    <span className="inline-flex items-center justify-center rounded-full font-black"
                      style={{
                        width: 26, height: 26, fontSize: 13,
                        background: `hsl(${WARM})`, color: BG,
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
                    <p className="font-black mb-1" style={{ fontSize: 16, color: TEXT, lineHeight: 1.25 }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{a.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer micro-strip: had vs. closes the gap */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg px-4 py-3"
                style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.20)` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Database size={14} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 11.5, color: `hsl(${TEAL})` }}>
                    What AI had
                  </p>
                </div>
                <p style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }}>
                  Rate card. CRM record. Contracts. Templates. Project plan. Policy wiki.
                </p>
                <p className="mt-1 font-semibold" style={{ fontSize: 12, color: MUTED }}>
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
                <p style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }}>
                  An <span style={{ fontWeight: 800 }}>Organizational Intelligence</span> layer that captures the live, unwritten signals — and resolves them at draft time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — WHAT THAT COSTS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  // Council pass: keep three clear pyramids, make the pyramid geometry proportional,
  // and keep all copy in HTML overlays so labels wrap cleanly and never turn dark.
  const verticals = [
    {
      id: "life-sciences",
      name: "Life Sciences",
      icon: <Shield size={22} style={{ color: `hsl(${RED})` }} />,
      color: RED,
      above: ["Batch records", "SOPs", "Validation protocols"],
      below: [
        "Annex 7 vs Annex 1 applicability",
        "Open deviation context from last batch",
        "Senior QA judgment on edge cases",
      ],
      breaks: "Safety risk. Audit failure.",
    },
    {
      id: "automotive",
      name: "Automotive",
      icon: <Car size={22} style={{ color: `hsl(${WARM})` }} />,
      color: WARM,
      above: ["ECU specs", "Homologation files", "Supplier change notices"],
      below: [
        "Variant-specific homologation constraint",
        "Supplier validation status this week",
        "Platform reuse rules and exceptions",
      ],
      breaks: "Recall risk. Launch delay.",
    },
    {
      id: "aec",
      name: "AEC",
      icon: <Building2 size={22} style={{ color: `hsl(${GOLD})` }} />,
      color: GOLD,
      above: ["RFIs", "Submittals", "Spec packages"],
      below: [
        "Spec amendment from yesterday",
        "Drawing revision in coordination",
        "Owner-specific standard overriding the spec",
      ],
      breaks: "Rework. Claims exposure. Project delay.",
    },
  ];

  const alsoApplies = ["Space Engineering", "Financial Services", "Professional Services", "Sales & GTM", "Legal & Compliance", "Supply Chain"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>
          Where Missing Context Shows Up
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 50, color: TEXT, lineHeight: 1.05 }}>
          The same iceberg, in every vertical. <span style={{ color: `hsl(${ACCENT})` }}>What is captured is dwarfed by what runs the work.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.4 }}>
          The systems on top of the waterline are what AI sees. The Organizational Intelligence below the waterline is what determines whether the output is correct.
        </p>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 mb-4">
          {verticals.map((v) => (
            <div key={v.name} className="rounded-xl border flex flex-col overflow-hidden"
              style={{ borderColor: `hsl(${v.color} / 0.24)`, background: `hsl(${v.color} / 0.025)` }}>
              <div className="px-5 py-3 flex items-center gap-3 border-b"
                style={{ borderColor: `hsl(${v.color} / 0.16)`, background: `hsl(${v.color} / 0.055)` }}>
                {v.icon}
                <p className="font-black" style={{ fontSize: 22, color: TEXT }}>{v.name}</p>
              </div>

              <div className="flex-1 px-4 pt-4 pb-3 flex items-center justify-center min-h-0">
                <div className="relative w-full max-w-[420px] aspect-[1/1.04]">
                  <svg viewBox="0 0 360 374" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id={`ice-top-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${GREEN} / 0.16)`} />
                        <stop offset="100%" stopColor={`hsl(${GREEN} / 0.32)`} />
                      </linearGradient>
                      <linearGradient id={`ice-bot-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${v.color} / 0.12)`} />
                        <stop offset="100%" stopColor={`hsl(${v.color} / 0.24)`} />
                      </linearGradient>
                      <linearGradient id={`water-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${v.color} / 0.035)`} />
                        <stop offset="100%" stopColor={`hsl(${v.color} / 0.09)`} />
                      </linearGradient>
                    </defs>

                    <rect x="0" y="132" width="360" height="242" fill={`url(#water-${v.id})`} />
                    <line x1="18" y1="132" x2="342" y2="132"
                      stroke={`hsl(${v.color} / 0.55)`} strokeWidth="1.35" strokeDasharray="7 6" />
                    <polygon points="112,132 180,24 248,132" fill={`url(#ice-top-${v.id})`}
                      stroke={`hsl(${GREEN} / 0.9)`} strokeWidth="1.7" strokeLinejoin="round" />
                    <polygon points="112,132 28,344 332,344 248,132" fill={`url(#ice-bot-${v.id})`}
                      stroke={`hsl(${v.color} / 0.76)`} strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>

                  <div className="absolute left-0 right-0 top-[4%] text-center font-black tracking-[0.14em] uppercase"
                    style={{ fontSize: 12.5, color: `hsl(${GREEN})` }}>
                    What AI sees
                  </div>

                  <div className="absolute left-[8%] right-[8%] top-[24%] grid grid-cols-3 gap-1.5">
                    {v.above.map((label) => (
                      <div key={label} className="min-h-[34px] rounded-md border px-1.5 py-1 flex items-center justify-center text-center font-extrabold"
                        style={{ fontSize: 11, lineHeight: 1.18, color: TEXT, background: `hsl(0 0% 100% / 0.95)`, borderColor: `hsl(${GREEN} / 0.48)` }}>
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="absolute left-0 right-0 top-[39%] text-center font-black tracking-[0.14em] uppercase"
                    style={{ fontSize: 12.5, color: `hsl(${v.color})` }}>
                    What AI misses
                  </div>

                  <div className="absolute left-[16%] right-[12%] top-[49%] space-y-2.5">
                    {v.below.map((item) => (
                      <div key={item} className="rounded-md border px-2.5 py-2 flex gap-2"
                        style={{ background: `hsl(0 0% 100% / 0.92)`, borderColor: `hsl(${v.color} / 0.22)` }}>
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: `hsl(${v.color})` }} />
                        <p className="font-bold" style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.3 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t flex items-center gap-2"
                style={{ borderColor: `hsl(${RED} / 0.15)`, background: `hsl(${RED} / 0.05)` }}>
                <AlertTriangle size={14} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 14, color: `hsl(${RED})` }}>{v.breaks}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-2">
          <p className="font-bold shrink-0" style={{ fontSize: 16, color: MUTED }}>Same pattern in:</p>
          <div className="flex flex-wrap gap-2.5">
            {alsoApplies.map(a => (
              <span key={a} className="rounded-full px-4 py-1.5 font-semibold border" style={{ fontSize: 15, color: MUTED, borderColor: `hsl(215 15% 85%)`, background: `hsl(220 15% 98%)` }}>{a}</span>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={ACCENT} to={RED} />
    </div>
  );
}

function Slide03Cost() {
  // Methodology inputs, compact one-row strip
  const inputs = [
    { stat: "100", label: "people / team" },
    { stat: "58%", label: "touch AI cleanup weekly" },
    { stat: "4.5h", label: "lost per affected person" },
    { stat: "€40/h", label: "blended review cost" },
  ];

  // Vertical ceiling proofs — kept in native units, not converted to €.
  // 5 tiles max (council guidance). Order: highest-stakes first.
  const verticals = [
    {
      vertical: "Life Sciences",
      stat: "$2.6B",
      unit: "avg cost per approved drug",
      consequence: "30–40% deviation repeat rate. ~10% Phase I to approval. Each missed signal compounds the next program.",
      color: RED,
      href: "/investor-pharma",
      source: "Tufts CSDD; FDA",
    },
    {
      vertical: "Automotive R&D",
      stat: "$2.3M",
      unit: "per engineer ramp at a new R&D site",
      consequence: "9–12 months to productivity. HQ design intent and chassis-control IP re-derived at every greenfield site.",
      color: TEAL,
      href: "/investor-automotive",
      source: "Industry benchmarks; ISO 26262 onboarding norms",
    },
    {
      vertical: "AEC",
      stat: "9% of project value",
      unit: "lost to rework on a typical build",
      consequence: "$280B / yr in US construction rework alone. Spec amendments and RFI history get missed inside generated work.",
      color: GOLD,
      href: "/investor-aec",
      source: "FMI; Get It Right Initiative",
    },
    {
      vertical: "Banking",
      stat: "$10–50M",
      unit: "per consumer-protection finding",
      consequence: "Brand book, product rules and regulator guidance interpreted differently each time. EBA, DORA, Consumer Duty exposure compounds.",
      color: ACCENT,
      href: "/sales-banking",
      source: "EBA enforcement actions 2023–2024",
    },
    {
      vertical: "Satcom",
      stat: "$50M+",
      unit: "per fleet renewal cycle",
      consequence: "Operator judgment and procurement learning don't survive across mission cycles. SLA exposure rises with every handover.",
      color: WARM,
      href: "/satcom",
      source: "Operator capex benchmarks",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-10 pb-8">
        {/* Header */}
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          What Missing Context Costs
        </p>
        <h2 className="font-black mb-6" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          One root cause. <span style={{ color: `hsl(${WARM})` }}>Different units of pain.</span>
        </h2>

        {/* TOP BAND — the floor */}
        <div className="grid grid-cols-[0.95fr_1.45fr] gap-6 mb-5">
          <div className="rounded-2xl px-8 py-7 flex flex-col justify-center"
            style={{ background: `hsl(${WARM} / 0.06)`, border: `2px solid hsl(${WARM} / 0.22)` }}>
            <p className="font-bold tracking-[0.18em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${WARM})` }}>
              The floor
            </p>
            <p className="font-black" style={{ fontSize: 88, color: `hsl(${WARM})`, lineHeight: 0.95 }}>€550K</p>
            <p className="font-bold mt-2" style={{ fontSize: 22, color: TEXT }}>per year / 100 people</p>
            <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>
              The annual labor cost every knowledge org pays when context does not travel with the work.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-bold tracking-[0.18em] uppercase" style={{ fontSize: 13, color: SUBTLE }}>
              How the number is built
            </p>
            <div className="grid grid-cols-4 gap-3">
              {inputs.map((i) => (
                <div key={i.label} className="rounded-xl px-4 py-4 flex flex-col justify-between"
                  style={{ background: `hsl(${WARM} / 0.05)`, border: `1px solid hsl(${WARM} / 0.14)` }}>
                  <p className="font-black" style={{ fontSize: 30, color: `hsl(${WARM})`, lineHeight: 1 }}>{i.stat}</p>
                  <p className="font-semibold mt-2" style={{ fontSize: 14, color: TEXT, lineHeight: 1.35 }}>{i.label}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.4 }}>
              Sources: Zapier AI at Work Report 2026 (cleanup frequency, hours lost). Team size and blended labor rate are illustrative.
            </p>
          </div>
        </div>

        {/* BRIDGE — the thesis line */}
        <div className="rounded-2xl px-6 py-4 mb-5"
          style={{ background: `hsl(${ACCENT} / 0.05)`, border: `1px solid hsl(${ACCENT} / 0.16)` }}>
          <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.4 }}>
            The same Context Gap shows up as <span style={{ color: `hsl(${WARM})` }}>€550K</span> in a 100-person team,{" "}
            <span style={{ color: `hsl(${RED})` }}>$2.6B</span> in a drug program,{" "}
            <span style={{ color: `hsl(${TEAL})` }}>$2.3M</span> per engineer ramp, and{" "}
            <span style={{ color: `hsl(${GOLD})` }}>9% of project value</span> on a build. Different units. One root cause.
          </p>
        </div>

        {/* BOTTOM BAND — the ceiling: 5 verticals, native units */}
        <p className="font-bold tracking-[0.18em] uppercase mb-2" style={{ fontSize: 13, color: SUBTLE }}>
          The ceiling — what it costs in each vertical, in their own units
        </p>
        <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
          {verticals.map((v) => (
            <div key={v.vertical} className="rounded-2xl border px-5 py-5 flex flex-col h-full"
              style={{ borderColor: `hsl(${v.color} / 0.22)`, background: `hsl(${v.color} / 0.05)` }}>
              <p className="font-bold" style={{ fontSize: 13, color: `hsl(${v.color})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {v.vertical}
              </p>
              <p className="font-black mt-3" style={{ fontSize: 32, color: TEXT, lineHeight: 1.05 }}>{v.stat}</p>
              <p className="font-semibold mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{v.unit}</p>
              <p className="mt-4" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>{v.consequence}</p>
              <p className="mt-3" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.4, fontStyle: "italic" }}>
                Source: {v.source}
              </p>
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-4 font-bold inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                style={{ fontSize: 14, color: `hsl(${v.color})`, letterSpacing: "0.04em" }}
              >
                Full thesis <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

function Slide03WorkflowProof() {
  const workflows = [
    {
      persona: "Sales Manager",
      icon: <Target size={30} />,
      color: ACCENT,
      flow: ["Call notes", "CRM history", "MEDDIC criteria"],
      before: "AI drafts a plausible account plan, but misses the hidden blocker in the buying committee and pushes the team into the wrong deal motion.",
      after: "The system carries forward political context, deal history, and qualification standards so the next action reflects actual deal risk.",
      critical: "Without context, pipeline looks healthy until the quarter slips.",
    },
    {
      persona: "Engineering Lead",
      icon: <Cpu size={30} />,
      color: GREEN,
      flow: ["System diagrams", "Incident history", "Code conventions"],
      before: "AI generates a credible implementation path, but ignores the architecture constraint, failure pattern, or dependency trade-off the lead already knows.",
      after: "The team executes against the real system constraints, known incident patterns, and engineering standards before code is shipped.",
      critical: "Without context, velocity rises first and reliability breaks later.",
    },
    {
      persona: "Project Manager",
      icon: <Building2 size={30} />,
      color: GOLD,
      flow: ["RFIs", "Submittals", "Spec revisions"],
      before: "AI drafts a plausible project response, but misses the drawing revision, submittal condition, or owner standard that changes what is actually buildable.",
      after: "The response inherits project memory, approvals, and known exceptions before it reaches the field or client.",
      critical: "Without context, a plausible answer becomes rework on site.",
    },
    {
      persona: "Pharma Researcher",
      icon: <Shield size={30} />,
      color: RED,
      flow: ["Study protocols", "Lab records", "Quality requirements"],
      before: "AI summarizes the study plausibly, but misses the protocol edge case or regulated quality implication that determines whether the next step is safe.",
      after: "The recommendation inherits protocol logic, quality thresholds, and prior deviations before research decisions move forward.",
      critical: "Without context, plausibility can push regulated science in the wrong direction.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <h2 className="font-black mb-5" style={{ fontSize: 58, color: TEXT, lineHeight: 1.08 }}>
          The same failure repeats across core roles.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Systems exist. Organizational Intelligence still lives in people.</span>
        </h2>

        <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
          {workflows.map(({ persona, icon, color, flow, before, after, critical }) => (
            <div
              key={persona}
              className="rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.22)`, background: `hsl(${color} / 0.04)` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>
                  {icon}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: 28, color: TEXT }}>{persona}</p>
                  <p style={{ fontSize: 15, color: `hsl(${color})`, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Typical workflow</p>
                </div>
              </div>

              <div className="rounded-xl px-5 py-4 mb-4" style={{ background: `hsl(${color} / 0.06)`, border: `1px solid hsl(${color} / 0.12)` }}>
                <p className="font-bold mb-3" style={{ fontSize: 15, color: TEXT }}>Known inputs</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {flow.map((item) => (
                    <span key={item} className="rounded-full px-3 py-1.5 font-semibold" style={{ fontSize: 13, color: TEXT, background: `hsl(${color} / 0.1)` }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-3 mb-4 items-start">
                <p className="font-black" style={{ fontSize: 14, color: `hsl(${RED})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>Before</p>
                <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{before}</p>
                <p className="font-black" style={{ fontSize: 14, color: `hsl(${GREEN})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>After</p>
                <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.45 }}>{after}</p>
              </div>

              <div className="mt-auto rounded-xl px-5 py-4" style={{ background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.14)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 13, color: `hsl(${RED})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Why this is critical</p>
                <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>{critical}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={ACCENT} to={RED} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03B — WHY NOW
// ═══════════════════════════════════════════════════════════════════════════════

function SlideWhyNow() {
  const signals = [
    {
      metric: "85%",
      label: "of enterprises adopted AI tools in 2025",
      insight: "Adoption is done. The quality crisis just started.",
      color: WARM,
      source: "McKinsey State of AI, 2025",
    },
    {
      metric: "40%",
      label: "of AI productivity gains lost to rework",
      insight: "The faster AI generates, the faster orgs lose control.",
      color: RED,
      source: "Workday, Jan 2026",
    },
    {
      metric: "Shift",
      label: "from AI access to AI governance",
      insight: "The market moved from asking whether teams use AI to asking how outputs stay consistent, traceable, and safe.",
      color: TEAL,
      source: "Observed across enterprise deployments and regulated workflows",
    },
  ];

  const shifts = [
    { shift: "AI tools became commodities", result: "Differentiation moved from 'which tool' to 'what knowledge runs through it'" },
    { shift: "Regulators started asking 'how'", result: "EU AI Act, DORA, FDA AI guidance. Governance is now mandatory, not optional" },
    { shift: "The senior talent bottleneck hit", result: "Companies can't hire enough experts. They need to scale the ones they have." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Why Now</p>

        <h2 className="font-black mb-2" style={{ fontSize: 56, color: TEXT, lineHeight: 1.08 }}>
          AI adoption is done.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>The governance crisis just started.</span>
        </h2>

        {/* Three signal cards — centered content, no flex-1 stretch */}
        <div className="flex gap-6 mb-6">
          {signals.map(({ metric, label, insight, color, source }) => (
            <div key={label} className="flex-1 rounded-2xl border p-7 flex flex-col items-center text-center"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.06)` }}>
              <p className="font-black" style={{ fontSize: 72, color: `hsl(${color})`, lineHeight: 1 }}>{metric}</p>
              <p className="font-bold mt-3 mb-3" style={{ fontSize: 20, color: TEXT, lineHeight: 1.3 }}>{label}</p>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>{insight}</p>
              <p className="mt-3" style={{ fontSize: 13, color: SUBTLE }}>{source}</p>
            </div>
          ))}
        </div>

        {/* Three structural shifts — more prominent */}
        <div className="rounded-2xl border p-7" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
          <p className="font-bold tracking-[0.15em] uppercase mb-5" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Three structural shifts converging</p>
          <div className="flex gap-6">
            {shifts.map(({ shift, result }, i) => (
              <div key={i} className="flex-1 rounded-xl p-5 flex items-start gap-4"
                style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                <span className="font-black shrink-0 mt-0.5" style={{ fontSize: 32, color: `hsl(${TEAL} / 0.4)` }}>{i + 1}</span>
                <div>
                  <p className="font-bold mb-1.5" style={{ fontSize: 20, color: TEXT }}>{shift}</p>
                  <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={TEAL} to={MINT} />
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — THE CONTEXT LAYER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  const domainSurfaces = [
    { icon: <Car size={24} />, title: "Automotive", sub: "ECU specs, homologation files, supplier change notices", color: WARM },
    { icon: <Shield size={24} />, title: "Life Sciences", sub: "Deviation reports, validation packs, review gates", color: RED },
    { icon: <Building2 size={24} />, title: "AEC", sub: "Architecture, Engineering & Construction: RFIs, submittals, drawing revisions", color: GOLD },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Context Layer
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          Organizational Intelligence is the substrate. <span style={{ color: `hsl(${TEAL})` }}>The Context Layer is the runtime AI executes on.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 19, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          One horizontal infrastructure on the left. The runtime in the middle. Domain experience layers on the right. Built once. Portable across every vertical.
        </p>

        {/* Three-column flow */}
        <div className="flex-1 flex items-center gap-0">
          {/* LEFT — What companies feed AI */}
          <div className="w-[360px] shrink-0 flex flex-col gap-4">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${BLUE})` }}>Horizontal infrastructure</p>
            {[
              { icon: <Database size={24} />, title: "Knowledge Graph", sub: "Standards, exceptions, decisions" },
              { icon: <Cpu size={24} />, title: "Context Engine", sub: "Intent-locking, injection, drift" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border px-6 py-5 flex items-center gap-4"
                style={{ borderColor: `hsl(${BLUE} / 0.18)`, background: `hsl(${BLUE} / 0.04)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${BLUE} / 0.1)`, color: `hsl(${BLUE})` }}>{item.icon}</div>
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>{item.title}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{item.sub}</p>
                </div>
              </div>
            ))}
            <p className="text-center font-semibold mt-1" style={{ fontSize: 14, color: `hsl(${BLUE})` }}>
              Built once. Portable across domains.
            </p>
          </div>

          {/* Arrow in */}
          <div className="shrink-0 flex items-center justify-center px-5">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL} / 0.35)` }} />
          </div>

          {/* CENTER — LIZA OS */}
          <div className="flex-1 rounded-2xl p-8 flex flex-col items-center justify-center"
            style={{ background: `hsl(${TEAL} / 0.05)`, border: `3px solid hsl(${TEAL} / 0.3)`, boxShadow: `0 0 80px hsl(${TEAL} / 0.08)` }}>
            <div className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `hsl(${GOLD} / 0.12)`, border: `1px solid hsl(${GOLD} / 0.28)` }}>
              <Shield size={14} style={{ color: `hsl(${GOLD})` }} />
              <p className="font-bold" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>Your knowledge stays portable</p>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `hsl(${TEAL} / 0.15)` }}>
              <Brain size={34} style={{ color: `hsl(${TEAL})` }} />
            </div>
            <p className="font-black mb-1" style={{ fontSize: 32, color: `hsl(${TEAL})` }}>LIZA OS</p>
            <p className="font-semibold mb-6" style={{ fontSize: 16, color: MUTED }}>Horizontal knowledge infrastructure</p>

            {/* Compact loop */}
            <div className="flex items-center gap-3">
              {[
                { label: "Encode", icon: <BookOpen size={18} /> },
                { label: "Govern", icon: <Shield size={18} /> },
                { label: "Execute", icon: <Zap size={18} /> },
                { label: "Evolve", icon: <RefreshCw size={18} /> },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                    style={{ background: `hsl(${TEAL} / 0.1)` }}>
                    <span style={{ color: `hsl(${MINT})` }}>{step.icon}</span>
                    <span className="font-bold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{step.label}</span>
                  </div>
                  {i < 3 && <ArrowRight size={14} style={{ color: `hsl(${TEAL} / 0.3)` }} />}
                </div>
              ))}
            </div>

            {/* Loop-back indicator */}
            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg"
              style={{ background: `hsl(${MINT} / 0.06)`, border: `1px dashed hsl(${MINT} / 0.25)` }}>
              <RefreshCw size={13} style={{ color: `hsl(${MINT})` }} />
              <p className="font-semibold" style={{ fontSize: 13, color: `hsl(${MINT})` }}>
                Continuous loop: your organization gets smarter with every execution
              </p>
            </div>
            <p className="mt-4 text-center" style={{ fontSize: 14, color: MUTED, maxWidth: 520, lineHeight: 1.45 }}>
              The reasoning engine runs on LIZA. <span style={{ color: `hsl(${GOLD})`, fontWeight: 700 }}>Your standards, exceptions, and Organizational Intelligence remain your asset.</span>
            </p>
          </div>

          {/* Arrow out */}
          <div className="shrink-0 flex items-center justify-center px-5">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL} / 0.35)` }} />
          </div>

          {/* RIGHT — Domain Experience Layers */}
          <div className="w-[390px] shrink-0 flex flex-col gap-3">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Domain Experience Layers</p>
              {domainSurfaces.map((item) => (
              <div key={item.title} className="rounded-2xl border px-6 py-5 flex items-center gap-4"
                style={{ borderColor: `hsl(${item.color} / 0.18)`, background: `hsl(${item.color} / 0.04)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${item.color} / 0.1)`, color: `hsl(${item.color})` }}>{item.icon}</div>
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>{item.title}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{item.sub}</p>
                </div>
              </div>
            ))}
            <p className="text-center font-bold mt-1" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>
              Same core. Different domain experience.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-6 rounded-xl px-8 py-3 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1.5px solid hsl(${TEAL} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>
            Capture Organizational Intelligence once. <span style={{ color: `hsl(${TEAL})` }}>Run it across every domain experience.</span>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 05B — ARCHITECTURE (Blueprint + Nervous System)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideArchitecture() {
  const existingSystems = [
    { name: "Confluence / Wiki", layer: "Knowledge", color: BLUE },
    { name: "JIRA / Monday", layer: "Project Mgmt", color: BLUE },
    { name: "Salesforce / HubSpot", layer: "CRM", color: BLUE },
    { name: "DOORS / Polarion", layer: "Requirements", color: BLUE },
    { name: "Veeva / SAP", layer: "Compliance", color: BLUE },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>Architecture</p>

        <h2 className="font-black mb-2" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05 }}>
          We build your organization's <span style={{ color: `hsl(${GOLD})` }}>Blueprint.</span>{" "}
          <span style={{ color: MUTED }}>It stays yours.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 18, color: MUTED, maxWidth: 1200 }}>
          LIZA extracts your collective intelligence into a versioned, portable asset: your Blueprint.
          Our platform provides the reasoning engine. Your IP never leaves.
        </p>

        <div className="flex-1 flex flex-col gap-3 justify-center">
          {/* Layer 3: Output Artifacts */}
          <div className="rounded-2xl border px-8 py-4 text-center"
            style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Governed Output</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Any LLM · Any Workflow · Any Team. All governed by your expertise</p>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2.5" style={{ background: `hsl(${TEAL} / 0.3)` }} />
              <div className="w-3 h-3 rotate-45 -mt-1.5" style={{ borderRight: `2px solid hsl(${TEAL})`, borderBottom: `2px solid hsl(${TEAL})` }} />
            </div>
          </div>

          {/* Layer 2: LIZA OS — Blueprint + Nervous System TOGETHER */}
          <div className="rounded-3xl p-5 relative"
            style={{ background: `hsl(${TEAL} / 0.03)`, border: `3px solid hsl(${TEAL} / 0.3)`,
              boxShadow: `0 0 80px hsl(${TEAL} / 0.06)` }}>
            {/* LIZA OS header — makes it unmistakable */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.15)` }}>
                  <Brain size={26} style={{ color: `hsl(${TEAL})` }} />
                </div>
                <div>
                  <p className="font-black" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>LIZA OS</p>
                  <p className="font-semibold" style={{ fontSize: 13, color: MUTED }}>The Context Layer</p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                <p className="font-bold" style={{ fontSize: 12, color: `hsl(${TEAL})` }}>Blueprint + Nervous System = LIZA OS</p>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Blueprint — YOUR IP */}
              <div className="flex-[3] rounded-2xl p-5 relative overflow-hidden"
                style={{ background: `hsl(${GOLD} / 0.06)`, border: `2px solid hsl(${GOLD} / 0.35)` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(${GOLD} / 0.15)` }}>
                      <Layers size={24} style={{ color: `hsl(${GOLD})` }} />
                    </div>
                    <div>
                      <p className="font-black" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>Your Blueprint</p>
                      <p className="font-semibold" style={{ fontSize: 12, color: MUTED }}>Your organization's IP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `hsl(${GOLD} / 0.12)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
                    <Shield size={12} style={{ color: `hsl(${GOLD})` }} />
                    <p className="font-bold" style={{ fontSize: 11, color: `hsl(${GOLD})` }}>PORTABLE · SOVEREIGN</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-[140px] shrink-0 rounded-xl flex flex-col items-center justify-center p-2"
                    style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px dashed hsl(${GOLD} / 0.25)` }}>
                    <svg width="120" height="85" viewBox="0 0 140 100">
                      <line x1="70" y1="15" x2="25" y2="50" stroke={`hsl(${GOLD})`} strokeWidth="1.5" opacity="0.3" />
                      <line x1="70" y1="15" x2="115" y2="50" stroke={`hsl(${GOLD})`} strokeWidth="1.5" opacity="0.3" />
                      <line x1="25" y1="50" x2="50" y2="85" stroke={`hsl(${GOLD})`} strokeWidth="1.5" opacity="0.3" />
                      <line x1="115" y1="50" x2="90" y2="85" stroke={`hsl(${GOLD})`} strokeWidth="1.5" opacity="0.3" />
                      <line x1="50" y1="85" x2="90" y2="85" stroke={`hsl(${GOLD})`} strokeWidth="1.5" opacity="0.3" />
                      <circle cx="70" cy="15" r="7" fill={`hsl(${GOLD})`} fillOpacity="0.2" stroke={`hsl(${GOLD})`} strokeWidth="2" />
                      <circle cx="25" cy="50" r="5" fill={`hsl(${GOLD})`} fillOpacity="0.15" stroke={`hsl(${GOLD})`} strokeWidth="1.5" />
                      <circle cx="115" cy="50" r="5" fill={`hsl(${GOLD})`} fillOpacity="0.15" stroke={`hsl(${GOLD})`} strokeWidth="1.5" />
                      <circle cx="50" cy="85" r="4" fill={`hsl(${GOLD})`} fillOpacity="0.12" stroke={`hsl(${GOLD})`} strokeWidth="1.5" />
                      <circle cx="90" cy="85" r="4" fill={`hsl(${GOLD})`} fillOpacity="0.12" stroke={`hsl(${GOLD})`} strokeWidth="1.5" />
                    </svg>
                    <p className="font-black" style={{ fontSize: 12, color: `hsl(${GOLD})`, letterSpacing: "0.1em" }}>KNOWLEDGE GRAPH</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Standards & SOPs", desc: "Versioned, governed" },
                      { label: "Expert Reasoning", desc: "Encoded as rules" },
                      { label: "Decision Exceptions", desc: "Context-specific" },
                      { label: "Accumulated Memory", desc: "Grows with usage" },
                    ].map(item => (
                      <div key={item.label} className="rounded-lg px-3 py-2" style={{ background: `hsl(${GOLD} / 0.08)` }}>
                        <p className="font-bold" style={{ fontSize: 13.5, color: `hsl(${GOLD})` }}>{item.label}</p>
                        <p style={{ fontSize: 12, color: MUTED }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bidirectional connector */}
              <div className="shrink-0 flex flex-col items-center justify-center gap-1 px-1">
                <RefreshCw size={16} style={{ color: `hsl(${TEAL} / 0.4)` }} />
                <div className="w-px flex-1" style={{ background: `hsl(${TEAL} / 0.2)` }} />
                <RefreshCw size={16} style={{ color: `hsl(${TEAL} / 0.4)` }} />
              </div>

              {/* Nervous System */}
              <div className="flex-[2] rounded-2xl p-4 relative"
                style={{ background: `hsl(${TEAL} / 0.06)`, border: `2px solid hsl(${TEAL} / 0.25)` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.15)` }}>
                    <Cpu size={20} style={{ color: `hsl(${TEAL})` }} />
                  </div>
                  <div>
                    <p className="font-black" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Nervous System</p>
                    <p style={{ fontSize: 13, color: MUTED }}>Reasoning & orchestration</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Protocol Engine", desc: "Playbooks → guided workflows" },
                    { label: "Drift Detection", desc: "Flags deviations from standards" },
                    { label: "Propagation", desc: "One update cascades everywhere" },
                    { label: "Feedback Loop", desc: "Every execution teaches the system" },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg px-3 py-2" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                      <div className="flex items-center gap-2">
                        <p className="font-bold" style={{ fontSize: 13.5, color: `hsl(${TEAL})` }}>{item.label}</p>
                        <span style={{ fontSize: 12, color: MUTED }}>— {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2.5" style={{ background: `hsl(${BLUE} / 0.3)` }} />
              <div className="w-3 h-3 rotate-45 -mt-1.5" style={{ borderRight: `2px solid hsl(${BLUE})`, borderBottom: `2px solid hsl(${BLUE})` }} />
            </div>
          </div>

          {/* Layer 1: Existing Systems */}
          <div className="rounded-2xl border px-8 py-4"
            style={{ borderColor: `hsl(${BLUE} / 0.15)`, background: `hsl(${BLUE} / 0.03)` }}>
            <p className="font-black tracking-[0.15em] uppercase mb-2.5" style={{ fontSize: 12, color: `hsl(${BLUE})` }}>
              Your Existing Systems · Inputs · Unchanged
            </p>
            <div className="flex gap-3">
              {existingSystems.map(s => (
                <div key={s.name} className="flex-1 rounded-lg px-4 py-2 text-center"
                  style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${BLUE} / 0.12)` }}>
                  <p className="font-bold" style={{ fontSize: 13, color: TEXT }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: MUTED }}>{s.layer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl px-8 py-3 text-center"
          style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>
            No rip-and-replace. LIZA builds your Blueprint from your existing systems.{" "}
            <span style={{ color: `hsl(${GOLD})` }}>Your intelligence, your asset. Zero lock-in.</span>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — CATEGORY VALIDATION + MOAT
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  const players = [
    { name: "Edra", funding: "$30M", round: "Series A · 2024", what: "Process mining → executable SOPs for AI agents", color: GREEN },
    { name: "Mem0.ai", funding: "$24M", round: "Series A · 2024", what: "AI memory layer. Persistent context across sessions", color: SEAFOAM },
    { name: "Interloom", funding: "$16.5M", round: "Series A · 2023", what: "Tacit knowledge capture for operations teams", color: BLUE },
    { name: "Paradox.ai", funding: "Undisclosed", round: "Speedinvest-backed · 2025", what: "Organizational intelligence and alignment layer", color: GOLD },
  ];

  const moatLayers = [
    {
      layer: "AACE v3.1 Specification",
      desc: "Encode, govern, execute, and evolve as one repeatable system for human knowledge.",
      proof: "The spec makes Organizational Intelligence operational, not just searchable.",
      icon: <Cpu size={20} />,
    },
    {
      layer: "Human Experience Layer",
      desc: "Industry workflows designed around how experts actually decide, coach, review, and execute.",
      proof: "Built from business model innovation, workflow orientation, and executive coaching expertise.",
      icon: <Users size={20} />,
    },
    {
      layer: "Cross-team Network Effect",
      desc: "Every team execution feeds the shared blueprint, improving standards across departments.",
      proof: "The loop compounds as more teams encode, reuse, and improve Organizational Intelligence.",
      icon: <Network size={20} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>Category Thesis & Moat</p>

        <h2 className="font-black mb-5" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Competitors index documents and remember chats.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>LIZA is the Context Layer that runs Organizational Intelligence at execution time.</span>
        </h2>

        {/* Top: 4 competitor cards */}
        <div className="flex gap-4 mb-5">
          {players.map(({ name, funding, round, what, color }) => (
            <div key={name} className="flex-1 rounded-xl border px-5 py-4"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
              <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{name}</p>
              <p className="font-black" style={{ fontSize: 16, color: `hsl(${color})` }}>{funding}</p>
              <p className="mb-2" style={{ fontSize: 13, color: SUBTLE }}>{round}</p>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{what}</p>
            </div>
          ))}
        </div>

        {/* LIZA OS — big differentiation box */}
        <div className="rounded-2xl border-2 px-8 py-5 mb-5 flex items-center gap-6"
          style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)`, boxShadow: `0 0 60px hsl(${TEAL} / 0.06)` }}>
          <div className="shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.15)` }}>
                <Brain size={26} style={{ color: `hsl(${TEAL})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>LIZA OS</p>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>€2M Seed</p>
              </div>
            </div>
          </div>
          <div className="w-px h-16 shrink-0" style={{ background: `hsl(${TEAL} / 0.2)` }} />
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35 }}>
              Others sit beside the work.{" "}
              <span style={{ color: `hsl(${TEAL})` }}>LIZA sits inside it — as the runtime that resolves Organizational Intelligence at draft time.</span>
            </p>
            <p className="mt-1" style={{ fontSize: 17, color: MUTED }}>
              Retrieval finds documents. Memory remembers chats. The Context Layer encodes, governs, and executes the standards, exceptions, and live decisions that determine whether AI output is correct in your domain.
            </p>
          </div>
        </div>

        {/* Bottom: Market + 3 Moat columns */}
        <div className="grid grid-cols-[0.95fr_1fr_1fr_1fr] gap-5 items-stretch">
          {/* Market Size */}
          <div className="rounded-2xl border p-5 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Market Definition</p>
            <p className="mb-4 font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>
              Anchor to the closest credible market, then define the precise wedge.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Closest market", value: "$8.7B", desc: "The nearest sourceable category is AI governance. That is the cleanest external market anchor." },
                { label: "Where we enter", value: "Vertical execution", desc: "Targeted lifecycles in life sciences, AEC, automotive, and space engineering, where plausible AI creates expensive rework. Professional services functions (sales, marketing, delivery) are our generalist entry where we know the work best." },
              { label: "What LIZA is", value: "Human CX", desc: "We turn Organizational Intelligence into governed action through industry experience layers." },
              ].map(({ label, value, desc }) => (
                <div key={label} className="rounded-xl px-5 py-2.5" style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-black" style={{ fontSize: 12, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>{label}</span>
                    <span className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.1 }}>{value}</span>
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.35 }}>{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-auto pt-4" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.45 }}>
              Credible framing: anchor to AI governance as the sourceable market, then define LIZA as the execution interface that activates vertical work.
            </p>
          </div>

          {/* Defensibility — 3 moat layers */}
          {moatLayers.map(({ layer, desc, proof, icon }) => (
            <div key={layer} className="rounded-2xl border p-5 flex flex-col"
              style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `hsl(${GOLD} / 0.15)`, color: `hsl(${GOLD})` }}>
                {icon}
              </div>
              <p className="font-black mb-2" style={{ fontSize: 21, color: `hsl(${GOLD})`, lineHeight: 1.2 }}>{layer}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
              <div className="mt-4 rounded-xl px-4 py-3" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.14)` }}>
                <p className="font-semibold" style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>{proof}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

function Slide06Shift() {
  // ───────────────────────────────────────────────────────────────────────────
  // ORGANIZATIONAL INTELLIGENCE — UNPACKED
  // Replaces the old 4-layer "Strategic Shift" framing. The shift itself is
  // already explained on the prior slide (Document → Agent → Org. Intelligence).
  // This slide opens up the Organizational Intelligence box and shows what
  // actually goes into it. It is the bridge to the vertical-CX slides that follow.
  // ───────────────────────────────────────────────────────────────────────────
  const facets = [
    {
      icon: <Brain size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Personal Expertise",
      body: "What seniors actually know: pricing calls, exceptions, the way they decide under pressure. Today: trapped in heads.",
    },
    {
      icon: <Users size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Team & Account Memory",
      body: "How this client is run, what was promised verbally, who owns what, what was tried last quarter and why it failed.",
    },
    {
      icon: <RefreshCw size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Changing Dynamics",
      body: "Markets, regulation, pricing, supply, competitors — context that drifted last week and rewrote the right answer.",
    },
    {
      icon: <Target size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "New Goals & Strategy",
      body: "What leadership decided this quarter, what's now in scope, what's been deprioritized. Most AI never gets told.",
    },
    {
      icon: <Globe size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "External Inputs",
      body: "Regulator updates, partner changes, market signals, supplier notices — facts from the outside the org has to react to.",
    },
    {
      icon: <GitBranch size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Decisions & Exceptions",
      body: "Sign-off thresholds, escalations still open, the rules that override the rules. The connective tissue between docs.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col h-full px-20 pt-12 pb-10">
        {/* Header */}
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>
          Organizational Intelligence — Unpacked
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 56, color: TEXT, lineHeight: 1.04 }}>
          What actually lives inside{' '}
          <span style={{ color: `hsl(${GREEN})` }}>the substrate.</span>
        </h2>
        <p className="font-medium mb-7" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
          The 90% the iceberg points at. The substrate the shift slide named. Up close, it is six interacting layers — and a knowledge graph is what holds them together.
        </p>

        {/* Center: knowledge graph diagram */}
        <div className="flex-1 min-h-0 grid gap-8 items-center" style={{ gridTemplateColumns: "5fr 7fr" }}>

          {/* LEFT — abstract "knowledge graph" visualization */}
          <div className="relative h-full rounded-2xl border-2 flex items-center justify-center"
            style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `linear-gradient(135deg, hsl(${TEAL} / 0.04), hsl(${GREEN} / 0.06))` }}>
            <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="oiHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                </radialGradient>
              </defs>
              <circle cx="250" cy="250" r="220" fill="url(#oiHalo)" />
              {/* Six facet nodes evenly distributed */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const r = 170;
                const x = 250 + r * Math.cos(angle);
                const y = 250 + r * Math.sin(angle);
                return (
                  <g key={i}>
                    {/* spokes to center */}
                    <line x1="250" y1="250" x2={x} y2={y}
                      stroke={`hsl(${TEAL} / 0.40)`} strokeWidth="1.5" />
                    {/* peripheral connections */}
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
                    <circle cx={x} cy={y} r="22" fill={BG}
                      stroke={`hsl(${GREEN})`} strokeWidth="2" />
                    <circle cx={x} cy={y} r="6" fill={`hsl(${GREEN})`} />
                  </g>
                );
              })}
              {/* Center node — the OI core */}
              <circle cx="250" cy="250" r="58" fill={BG} stroke={`hsl(${GREEN})`} strokeWidth="3" />
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

          {/* RIGHT — six facets that compose Organizational Intelligence */}
          <div className="grid grid-cols-2 gap-4 h-full content-center">
            {facets.map((f, i) => (
              <div key={i} className="rounded-xl border-2 px-5 py-4"
                style={{
                  borderColor: `hsl(${GREEN} / 0.30)`,
                  background: BG,
                  boxShadow: `0 2px 0 hsl(${GREEN} / 0.10)`,
                }}>
                <div className="flex items-center gap-3 mb-2">
                  {f.icon}
                  <p className="font-black" style={{ fontSize: 19, color: TEXT }}>{f.title}</p>
                </div>
                <p className="font-medium" style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom punchline — bridges into the vertical-CX slides */}
        <div className="mt-6 rounded-xl border px-8 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `hsl(${GREEN} / 0.06)` }}>
          <Sparkles size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p className="font-bold" style={{ fontSize: 21, color: TEXT, lineHeight: 1.4 }}>
            This substrate looks different in pharma than in AEC than in financial services. <span style={{ color: `hsl(${GREEN})` }}>Which is why execution has to be vertical — next slides.</span>
          </p>
        </div>
      </div>
      <SlideBar from={TEAL} to={GREEN} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE — PEOPLE AS NODES (Scale the Senior / Person-as-Node network)
// ═══════════════════════════════════════════════════════════════════════════════

function SlidePeopleAsNodes() {
  // 3-stage progression: Artifacts (today) → Named Person-Nodes → Living weighted network.
  // Uses a real team (Bob/Marketing, George/Sales, Maria/Research, Anna/Ops, Tom/Eng).
  // The SAME five people appear in stage 2 and stage 3, so the viewer sees the evolution.
  const team = [
    { name: "Bob",   role: "Marketing" },
    { name: "George", role: "Sales" },
    { name: "Maria", role: "Research" },
    { name: "Anna",  role: "Ops" },
    { name: "Tom",   role: "Eng" },
  ];
  // Pentagon layout for stages 2 and 3 (same coords)
  const cx = 200, cy = 200, r = 130;
  const positions = team.map((p, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / team.length;
    return { ...p, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  // Edge weights for stage 3 (some thicker, some thinner — the "living, weighted" point)
  const edges = [
    { a: 0, b: 1, w: 3.5 }, // Bob ↔ George (marketing-sales)
    { a: 1, b: 2, w: 1.2 }, // George ↔ Maria
    { a: 2, b: 3, w: 2.4 }, // Maria ↔ Anna
    { a: 3, b: 4, w: 1.8 }, // Anna ↔ Tom
    { a: 4, b: 0, w: 1.0 }, // Tom ↔ Bob
    { a: 0, b: 2, w: 2.8 }, // Bob ↔ Maria
    { a: 1, b: 3, w: 1.5 }, // George ↔ Anna
    { a: 2, b: 4, w: 2.2 }, // Maria ↔ Tom
  ];

  // Stage 1 — old artifacts
  const artifacts = [
    { label: "Docs",         x: 70,  y: 60 },
    { label: "CRM",          x: 240, y: 50 },
    { label: "Wiki",         x: 90,  y: 170 },
    { label: "Email",        x: 250, y: 180 },
    { label: "Slides",       x: 60,  y: 280 },
    { label: "Tickets",      x: 240, y: 300 },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-12 pb-10">
        {/* Header */}
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Shift
        </p>
        <h2 className="font-black mb-6" style={{ fontSize: 56, color: TEXT, lineHeight: 1.04 }}>
          From documents, to static agents, to a{' '}
          <span style={{ color: `hsl(${GREEN})` }}>living Organizational Intelligence.</span>
        </h2>

        {/* 3-stage progression */}
        <div className="flex-1 min-h-0 grid grid-cols-3 gap-6">

          {/* STAGE 1 — Documents */}
          <div className="rounded-2xl border-2 flex flex-col overflow-hidden"
            style={{ borderColor: `hsl(${RED} / 0.30)`, background: `hsl(${RED} / 0.03)` }}>
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: `hsl(${RED} / 0.20)`, background: `hsl(${RED} / 0.06)` }}>
              <span className="font-black w-7 h-7 rounded-full flex items-center justify-center"
                style={{ fontSize: 13, color: BG, background: `hsl(${RED})` }}>1</span>
              <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 14, color: `hsl(${RED})` }}>Document Era</p>
            </div>
            <div className="px-5 pt-5">
              <p className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>
                Work lives in documents. Execution lives in people.
              </p>
              <p className="font-semibold mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>
                Documents define <em>what</em>. Human intelligence defines <em>how to actually execute</em>. Nothing scales — and AI inherits none of it.
              </p>
            </div>
            <div className="flex-1 px-4 py-3 mt-3 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <svg className="w-full h-full" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
                {/* Two documents with an undefined gap between them, patched by a tiny human silhouette */}
                {artifacts.map((a, i) => (
                  <g key={i}>
                    <rect x={a.x} y={a.y} width="80" height="42" rx="6"
                      fill={`hsl(${RED} / 0.08)`} stroke={`hsl(${RED} / 0.35)`} strokeWidth="1" />
                    <text x={a.x + 40} y={a.y + 27} textAnchor="middle"
                      style={{ fontSize: 13, fontWeight: 700, fill: TEXT }}>{a.label}</text>
                  </g>
                ))}
                {/* "?" gaps floating between docs — what happens between them is undefined */}
                {[
                  { x: 180, y: 80 },
                  { x: 180, y: 195 },
                  { x: 180, y: 305 },
                ].map((g, i) => (
                  <g key={`gap-${i}`}>
                    <circle cx={g.x} cy={g.y} r="14"
                      fill={`hsl(${RED} / 0.10)`} stroke={`hsl(${RED} / 0.55)`} strokeDasharray="3 2" strokeWidth="1.2" />
                    <text x={g.x} y={g.y + 5} textAnchor="middle"
                      style={{ fontSize: 14, fontWeight: 900, fill: `hsl(${RED})` }}>?</text>
                  </g>
                ))}
                <text x="180" y="350" textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 800, fill: `hsl(${RED})`, letterSpacing: 1 }}>
                  EXECUTION BETWEEN DOCS IS UNDEFINED.
                </text>
              </svg>
            </div>
          </div>

          {/* STAGE 2 — Static agents on top of documents */}
          <div className="rounded-2xl border-2 flex flex-col overflow-hidden"
            style={{ borderColor: `hsl(${TEAL} / 0.30)`, background: `hsl(${TEAL} / 0.03)` }}>
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: `hsl(${TEAL} / 0.20)`, background: `hsl(${TEAL} / 0.06)` }}>
              <span className="font-black w-7 h-7 rounded-full flex items-center justify-center"
                style={{ fontSize: 13, color: BG, background: `hsl(${TEAL})` }}>2</span>
              <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Agent Era</p>
            </div>
            <div className="px-5 pt-5">
              <p className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>
                Agents are statically defined snapshots in time.
              </p>
              <p className="font-semibold mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>
                Each role gets wrapped as an agent. Frozen the moment the work changes. Re-prompt forever.
              </p>
            </div>
            <div className="flex-1 px-4 py-3 mt-3 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ background: BG, border: `1px solid hsl(${TEAL} / 0.15)` }}>
              <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                {/* Background: faded documents still underneath */}
                {artifacts.map((a, i) => (
                  <rect key={`bg-${i}`} x={a.x * 1.05 + 10} y={a.y * 1.05 + 10} width="60" height="32" rx="4"
                    fill={`hsl(${TEAL} / 0.03)`} stroke={`hsl(${TEAL} / 0.15)`} strokeWidth="0.8"
                    strokeDasharray="2 2" />
                ))}
                {/* Static agent boxes (square, locked) wrapping each person */}
                {positions.map((p, i) => (
                  <g key={i}>
                    {/* Locked square frame around the node — signals "static / snapshot" */}
                    <rect x={p.x - 40} y={p.y - 40} width="80" height="80" rx="6"
                      fill={`hsl(${TEAL} / 0.05)`} stroke={`hsl(${TEAL} / 0.55)`} strokeWidth="1.2"
                      strokeDasharray="4 3" />
                    <circle cx={p.x} cy={p.y} r="26" fill={BG}
                      stroke={`hsl(${TEAL})`} strokeWidth="2" />
                    <text x={p.x} y={p.y - 2} textAnchor="middle"
                      style={{ fontSize: 12, fontWeight: 800, fill: TEXT }}>{p.name}</text>
                    <text x={p.x} y={p.y + 11} textAnchor="middle"
                      style={{ fontSize: 8, fontWeight: 700, fill: `hsl(${TEAL})`, letterSpacing: 0.5 }}>
                      {p.role.toUpperCase()}
                    </text>
                    {/* Tiny "agent" badge attached to the locked frame */}
                    <rect x={p.x + 14} y={p.y - 44} width="32" height="12" rx="2"
                      fill={`hsl(${TEAL})`} />
                    <text x={p.x + 30} y={p.y - 35} textAnchor="middle"
                      style={{ fontSize: 7, fontWeight: 900, fill: BG, letterSpacing: 0.6 }}>
                      AGENT
                    </text>
                  </g>
                ))}
                <text x="200" y="390" textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 800, fill: `hsl(${TEAL})`, letterSpacing: 1 }}>
                  AGENTS ARE STATIC SNAPSHOTS OF PEOPLE.
                </text>
              </svg>
            </div>
          </div>

          {/* STAGE 3 — Living context infrastructure */}
          <div className="rounded-2xl border-2 flex flex-col overflow-hidden"
            style={{ borderColor: `hsl(${GREEN} / 0.40)`,
              background: `linear-gradient(135deg, hsl(${TEAL} / 0.04), hsl(${GREEN} / 0.05))` }}>
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: `hsl(${GREEN} / 0.25)`, background: `hsl(${GREEN} / 0.08)` }}>
              <span className="font-black w-7 h-7 rounded-full flex items-center justify-center"
                style={{ fontSize: 13, color: BG, background: `hsl(${GREEN})` }}>3</span>
              <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Organizational Intelligence</p>
            </div>
            <div className="px-5 pt-5">
              <p className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>
                The fluid, semantic knowledge of the company is the substrate.
              </p>
              <p className="font-semibold mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>
                Define how the org thinks. Agents become downstream surfaces. AI inherits standards, exceptions, and intent, live.
              </p>
            </div>
            <div className="flex-1 px-4 py-3 mt-3 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ background: BG, border: `1px solid hsl(${GREEN} / 0.20)` }}>
              <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="aiHaloGreen" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                    <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                  </radialGradient>
                  <radialGradient id="contextField" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`hsl(${GREEN} / 0.10)`} />
                    <stop offset="70%" stopColor={`hsl(${TEAL} / 0.06)`} />
                    <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                  </radialGradient>
                </defs>

                {/* Continuous semantic context field that fills the space BETWEEN nodes */}
                <circle cx="200" cy="200" r="180" fill="url(#contextField)" />
                {/* Context tokens anchored to specific strong edges — knowledge flows between named pairs */}
                {(() => {
                  const edgeLabels: Record<string, string> = {
                    "0-1": "pricing logic",
                    "0-2": "decision context",
                    "2-3": "sign-off rules",
                    "2-4": "exception memory",
                  };
                  return edges.map((e, i) => {
                    const key = `${e.a}-${e.b}`;
                    const label = edgeLabels[key];
                    if (!label) return null;
                    const a = positions[e.a], b = positions[e.b];
                    const mx = (a.x + b.x) / 2;
                    const my = (a.y + b.y) / 2;
                    return (
                      <g key={`lbl-${i}`}>
                        <rect x={mx - label.length * 3 - 4} y={my - 18} width={label.length * 6 + 8} height="14" rx="3"
                          fill={BG} stroke={`hsl(${GREEN} / 0.55)`} strokeWidth="0.8" />
                        <text x={mx} y={my - 8} textAnchor="middle"
                          style={{ fontSize: 8.5, fontWeight: 800, fill: `hsl(${GREEN})`, letterSpacing: 0.3 }}>
                          {label}
                        </text>
                      </g>
                    );
                  });
                })()}

                {/* Weighted edges */}
                {edges.map((e, i) => {
                  const a = positions[e.a], b = positions[e.b];
                  return (
                    <line key={`e-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={`hsl(${TEAL} / ${0.25 + e.w * 0.12})`} strokeWidth={e.w} />
                  );
                })}

                {/* Pulse dots traveling on the strongest edge — implied via layered circles */}
                {edges.filter(e => e.w >= 2.4).map((e, i) => {
                  const a = positions[e.a], b = positions[e.b];
                  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                  return (
                    <circle key={`pulse-${i}`} cx={mx} cy={my} r="3.5"
                      fill={`hsl(${GREEN})`} stroke={BG} strokeWidth="1.5" />
                  );
                })}

                {/* Nodes with AI halos */}
                {positions.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="48" fill="url(#aiHaloGreen)" />
                    <circle cx={p.x} cy={p.y} r="32" fill={BG}
                      stroke={`hsl(${TEAL})`} strokeWidth="2.5" />
                    <text x={p.x} y={p.y - 2} textAnchor="middle"
                      style={{ fontSize: 12, fontWeight: 800, fill: TEXT }}>{p.name}</text>
                    <text x={p.x} y={p.y + 11} textAnchor="middle"
                      style={{ fontSize: 8, fontWeight: 700, fill: `hsl(${TEAL})`, letterSpacing: 0.5 }}>
                      {p.role.toUpperCase()}
                    </text>
                  </g>
                ))}

                <text x="200" y="390" textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 800, fill: `hsl(${GREEN})`, letterSpacing: 1 }}>
                  CONTEXT FILLS THE SPACE BETWEEN PEOPLE.
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom punchline */}
        <div className="mt-5 rounded-xl border px-8 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `hsl(${GREEN} / 0.06)` }}>
          <Sparkles size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p className="font-bold" style={{ fontSize: 21, color: TEXT, lineHeight: 1.4 }}>
            Documents froze the page. Agents froze the role. <span style={{ color: `hsl(${GREEN})` }}>Organizational Intelligence keeps how the company thinks alive.</span>
          </p>
        </div>
      </div>
      <SlideBar from={TEAL} to={GREEN} />
    </div>
  );
}

function _Slide06Shift() {
  const layers = [
    { layer: "Systems of Record", role: "Store documents and data", examples: "CRM, ERP, Veeva, BIM, LIMS", color: BLUE, width: "w-[280px]", height: "h-[66%]" },
    { layer: "Data Layer", role: "Define the 'what to do'", examples: "Static process inputs, outputs, and end points", color: GOLD, width: "w-[330px]", height: "h-[76%]" },
    { layer: "LIZA OS", role: "Encode how to do things", examples: "Fluid expertise in changing conditions and team settings", color: TEAL, width: "w-[405px]", height: "h-[88%]" },
    { layer: "Vertical CX Layers", role: "Make work executable", examples: "AEC, Life Sciences, Automotive, Space Engineering", color: GREEN, width: "flex-1", height: "h-full" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>Strategic Shift</p>
        <h2 className="font-black mb-5" style={{ fontSize: 54, color: TEXT, lineHeight: 1.05 }}>
          The market is moving from data retrieval to operating logic.{' '}
          <span style={{ color: `hsl(${TEAL})` }}>LIZA turns knowledge into governed action.</span>
        </h2>

        <div className="relative flex items-center gap-5 flex-1 min-h-0">
          <div className="absolute z-30 left-[900px] top-[54%] -translate-y-1/2 w-[350px] rounded-2xl border px-6 py-5"
            style={{
              borderColor: `hsl(${TEAL} / 0.34)`,
              background: `linear-gradient(135deg, hsl(${TEAL} / 0.96), hsl(${GREEN} / 0.9))`,
              boxShadow: `0 26px 70px hsl(${TEAL} / 0.24)`,
            }}>
            <div className="absolute -left-14 top-1/2 h-px w-14" style={{ background: `hsl(${TEAL} / 0.55)` }} />
            <div className="absolute -right-14 top-1/2 h-px w-14" style={{ background: `hsl(${GREEN} / 0.55)` }} />
            <p className="font-black tracking-[0.16em] uppercase mb-2" style={{ fontSize: 13, color: BG }}>
              Current investment focus
            </p>
            <p className="font-black" style={{ fontSize: 22, color: BG, lineHeight: 1.18 }}>
              Where encoded know-how becomes vertical human experience.
            </p>
            <p className="mt-2 font-semibold" style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.82)`, lineHeight: 1.35 }}>
              Product effort sits in the bridge between LIZA OS and repeatable industry execution.
            </p>
          </div>
          {layers.map(({ layer, role, examples, color, width, height }, i) => (
            <div key={layer} className={cn(
              "relative rounded-2xl border p-6 flex flex-col justify-between shrink-0",
              width,
              height,
              i === 2 && "z-20",
              i === 3 && "-ml-12 z-10 pl-14"
            )}
              style={{
                borderColor: `hsl(${color} / ${i === 3 ? 0.28 : 0.22})`,
                background: `hsl(${color} / 0.04)`,
                boxShadow: i >= 2 ? `0 22px 60px hsl(${color} / 0.10)` : undefined,
              }}>
              <div>
                <p className="font-black mb-3" style={{ fontSize: i === 0 ? 42 : 52, color: `hsl(${color} / 0.18)`, lineHeight: 1 }}>0{i + 1}</p>
                <p className="font-black mb-3" style={{ fontSize: i === 0 ? 24 : 28, color: TEXT, lineHeight: 1.12 }}>{layer}</p>
                <p className="font-bold mb-4" style={{ fontSize: i === 0 ? 18 : 20, color: `hsl(${color})`, lineHeight: 1.25 }}>{role}</p>
                <p style={{ fontSize: i === 0 ? 15 : 17, color: MUTED, lineHeight: 1.45 }}>{examples}</p>
              </div>
              <div className="mt-6 rounded-xl px-4 py-4" style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.14)` }}>
                <p className="font-bold" style={{ fontSize: i === 0 ? 14 : 16, color: TEXT, lineHeight: 1.35 }}>
                  {i === 0 ? "Enterprise foundation" : i === 1 ? "Today’s market maps starts and ends" : i === 2 ? "Core seed investment: dynamic know-how" : "Expansion surface"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border px-8 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${TEAL} / 0.22)`, background: `hsl(${TEAL} / 0.06)` }}>
          <Workflow size={24} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />
          <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }}>
            This round funds the horizontal core. Vertical experience layers become the repeatable expansion model through internal productization, partners, and selected joint ventures.
          </p>
        </div>
      </div>
      <SlideBar from={TEAL} to={GREEN} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — HOW IT WORKS (Horizontal flow, diagram-style, no screenshots)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    {
      num: "01", title: "Encode", icon: <BookOpen size={28} />,
      desc: "Documents, SOPs and tribal know-how are parsed into atomic units of judgment: standards, decision rules, exceptions. Experts confirm and fill the structural gaps the parser surfaces.",
      flow: ["Parse docs into atomic rules", "Classify by decision type", "Experts confirm & close gaps"],
      output: "Versioned playbooks ready",
      color: GOLD,
    },
    {
      num: "02", title: "Govern", icon: <Shield size={28} />,
      desc: "The AACE framework binds each rule to a capability, scope and owner, then resolves conflicts between layers (org, domain, team) so only one source of truth is enforceable at runtime.",
      flow: ["Bind rules to scope & owner", "Resolve cross-layer conflicts", "Version, sign & publish"],
      output: "Governed knowledge graph",
      color: TEAL,
    },
    {
      num: "03", title: "Execute", icon: <Zap size={28} />,
      desc: "At runtime, the relevant playbook is locked into context and injected into every model call. The output is constrained by your rules, not the model's defaults, and is fully traceable.",
      flow: ["Lock playbook into context", "Inject rules into model call", "Trace output to source rule"],
      output: "Expert-quality output",
      color: GREEN,
    },
    {
      num: "04", title: "Evolve", icon: <RefreshCw size={28} />,
      desc: "Every edit, override and exception is captured as a signal. Clusters of recurring deviations are surfaced as proposed rule changes for experts to approve, so the standard sharpens with use.",
      flow: ["Capture overrides as signals", "Cluster recurring deviations", "Promote to versioned update"],
      output: "Standards auto-improve",
      color: MINT,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>How LIZA OS Works</p>

        <h2 className="font-black mb-2" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Four steps.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>One compounding loop.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 20, color: MUTED, maxWidth: 1000 }}>
          Each cycle compounds your organization's collective intelligence.
        </p>

        {/* Horizontal flow */}
        <div className="flex-1 flex items-stretch gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex-1 flex items-stretch">
              <div className="flex-1 rounded-2xl border flex flex-col p-5"
                style={{ borderColor: `hsl(${s.color} / 0.2)`, background: `hsl(${s.color} / 0.03)` }}>
                {/* Step header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `hsl(${s.color} / 0.12)`, color: `hsl(${s.color})` }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-black tracking-[0.2em]" style={{ fontSize: 12, color: `hsl(${s.color})` }}>STEP {s.num}</p>
                    <p className="font-black" style={{ fontSize: 24, color: TEXT }}>{s.title}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>{s.desc}</p>

                {/* Mini diagram */}
                <div className="flex-1 flex flex-col items-center justify-center px-2 py-3">
                  <svg width="100%" height="100%" viewBox="0 0 300 220" style={{ maxWidth: 300, maxHeight: 220 }}>
                    {/* Flow nodes */}
                    {s.flow.map((f, j) => {
                      const y = 20 + j * 75;
                      return (
                        <g key={j}>
                          {/* Connector line from previous */}
                          {j > 0 && (
                            <line x1="150" y1={y - 40} x2="150" y2={y - 4}
                              stroke={`hsl(${s.color})`} strokeWidth="2" strokeDasharray="4 3" opacity="0.35" />
                          )}
                          {j > 0 && (
                            <polygon points={`145,${y - 6} 155,${y - 6} 150,${y}`}
                              fill={`hsl(${s.color})`} opacity="0.5" />
                          )}
                          {/* Node */}
                          <rect x="30" y={y} width="240" height="36" rx="10"
                            fill={`hsl(${s.color})`} fillOpacity="0.08"
                            stroke={`hsl(${s.color})`} strokeOpacity="0.3" strokeWidth="1.5" />
                          {/* Number badge */}
                          <circle cx="52" cy={y + 18} r="10"
                            fill={`hsl(${s.color})`} fillOpacity="0.18" />
                          <text x="52" y={y + 22} textAnchor="middle"
                            fill={`hsl(${s.color})`} fontSize="11" fontWeight="800">{j + 1}</text>
                          {/* Label */}
                          <text x="72" y={y + 22} fill={TEXT} fontSize="14" fontWeight="600">{f}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Output */}
                <div className="mt-2 px-3 py-2.5 rounded-lg flex items-center gap-2"
                  style={{ background: `hsl(${s.color} / 0.1)`, border: `1px solid hsl(${s.color} / 0.2)` }}>
                  <CheckCircle2 size={14} style={{ color: `hsl(${s.color})` }} />
                  <p className="font-bold" style={{ fontSize: 13, color: `hsl(${s.color})` }}>{s.output}</p>
                </div>
              </div>

              {/* Connector arrow */}
              {i < 3 && (
                <div className="flex items-center px-2">
                  <ArrowRight size={18} style={{ color: `hsl(${TEAL} / 0.3)` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loop indicator */}
        <div className="mt-4 flex items-center justify-center gap-3 px-6 py-3 rounded-xl mx-auto"
          style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px dashed hsl(${TEAL} / 0.25)` }}>
          <RefreshCw size={16} style={{ color: `hsl(${TEAL})` }} />
          <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>
            Step 4 feeds back into Step 1. Your playbooks sharpen with every cycle
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — PROOF (Validation with outcome metrics)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08() {
  const cases = [
    {
      title: "Global AEC Software Company",
      subtitle: "Paid engagement",
      scope: "R&D, HR & Engineering",
      color: TEAL,
      outcome: "CTO-sponsored, multi-department rollout",
      metric: "3 depts",
      metricLabel: "Active",
      points: [
        "Encoding core workflows across R&D, HR, and Engineering",
        "Working directly with the CTO on organizational rollout",
      ],
    },
    {
      title: "Top-Tier Swiss Executive Search Firm",
      subtitle: "Design partnership",
      scope: "Candidate evaluation",
      color: GREEN,
      outcome: "3-day senior task → 30 minutes",
      metric: "60×",
      metricLabel: "Faster",
      points: [
        "Encoded senior partner's C-level candidate evaluation reasoning",
        "Maintained senior-level quality with junior staff execution",
      ],
    },
    {
      title: "Professional Services Consultancy",
      subtitle: "Multi-team deployment",
      scope: "Sales, PM & Marketing",
      color: GOLD,
      outcome: "75% faster proposal creation",
      metric: "75%",
      metricLabel: "Faster",
      points: [
        "Codified workflows across sales, project management & marketing",
        "25% improvement in deal velocity across the team",
      ],
    },
    {
      title: "Cybersecurity Audit Firm",
      subtitle: "Automation engagement",
      scope: "800+ audit questions",
      color: ACCENT,
      outcome: "Audit cycle: 18 days → 1 day",
      metric: "95%",
      metricLabel: "Reduction",
      points: [
        "800+ audit questions processed through governed execution",
        "Full compliance traceability maintained throughout",
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>Early Validation</p>
            <h2 className="font-black" style={{ fontSize: 46, color: TEXT, lineHeight: 1.05 }}>
              Paid engagements.{" "}
              <span style={{ color: `hsl(${GREEN})` }}>Measurable outcomes.</span>
            </h2>
          </div>
          <div className="rounded-xl px-5 py-3 text-right" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.2)` }}>
            <p className="font-black" style={{ fontSize: 32, color: `hsl(${GREEN})`, lineHeight: 1 }}>4</p>
            <p style={{ fontSize: 13, color: MUTED }}>Active engagements</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 flex-1">
          {cases.map(({ title, subtitle, scope, color, outcome, metric, metricLabel, points }) => (
            <div key={title} className="rounded-2xl border flex overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              {/* Metric side */}
              <div className="w-[140px] shrink-0 flex flex-col items-center justify-center px-4"
                style={{ borderRight: `1px solid hsl(${color} / 0.12)`, background: `hsl(${color} / 0.06)` }}>
                <p className="font-black" style={{ fontSize: 44, color: `hsl(${color})`, lineHeight: 1 }}>{metric}</p>
                <p className="font-bold mt-1" style={{ fontSize: 13, color: `hsl(${color})` }}>{metricLabel}</p>
              </div>
              {/* Content */}
              <div className="flex-1 px-6 py-5 flex flex-col">
                <p className="font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.25 }}>{title}</p>
                <p className="mt-1" style={{ fontSize: 13, color: `hsl(${color})` }}>{subtitle} · {scope}</p>
                <div className="rounded-lg px-3 py-2 mt-3" style={{ background: `hsl(${color} / 0.1)` }}>
                  <p className="font-bold" style={{ fontSize: 15, color: `hsl(${color})`, lineHeight: 1.3 }}>{outcome}</p>
                </div>
                <div className="flex flex-col gap-2 mt-3 flex-1">
                  {points.map((p, i) => (
                    <p key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: `hsl(${color})` }} /> {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom proof bar */}
        <div className="mt-4 rounded-xl px-6 py-3 flex items-center justify-between"
          style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.12)` }}>
          <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>
            All pre-product-market-fit. All with the current platform.
          </p>
          <div className="flex gap-6">
            {[
              { n: "4", l: "Paid clients" },
              { n: "3", l: "Industries" },
              { n: "€0", l: "Paid acquisition" },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <p className="font-black" style={{ fontSize: 22, color: `hsl(${GREEN})`, lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 11, color: MUTED }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — VERTICALS (Expansion path — industries + functions)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09() {
  const beachheads = [
    {
      vertical: "Professional Services", status: "Beachhead", color: GREEN,
      icon: <Users size={24} style={{ color: `hsl(${GREEN})` }} />,
      problem: "Delivery expertise is trapped in senior operators. AI makes juniors faster but not reliably better.",
      result: "Client delivery CX layer for proposals, workshops, research, and advisory deliverables.",
      proof: "Paid proof. Consultancy and digital agency active.",
    },
    {
      vertical: "Pharma & Life Sciences", status: "Regulated wedge", color: GOLD,
      icon: <Shield size={24} style={{ color: `hsl(${GOLD})` }} />,
      problem: "GxP execution depends on traceable protocol nuance. Generic AI creates audit and safety risk.",
      result: "Regulated lifecycle CX layer for validation, deviations, quality review, and audit-ready execution.",
      proof: "Audit use case validated. Pharma next.",
    },
    {
      vertical: "AEC", status: "Architecture, Engineering & Construction", color: TEAL,
      icon: <Building2 size={24} style={{ color: `hsl(${TEAL})` }} />,
      problem: "Project memory fragments across RFIs, submittals, specs, drawings, and handover.",
      result: "AEC project CX layer for RFIs, submittals, drawing revisions, coordination, and handover.",
      proof: "Strategic AEC conversation. Vertical deck live.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Expansion Path</p>

        <div className="mb-6 flex items-start justify-between gap-8">
          <h2 className="font-black max-w-[1180px]" style={{ fontSize: 56, color: TEXT, lineHeight: 1.02 }}>
            Horizontal core.{" "}
            <span style={{ color: `hsl(${GREEN})` }}>Vertical CX layers.</span>
          </h2>
          <div className="w-[280px] rounded-2xl px-5 py-4 shrink-0"
            style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 11, color: MUTED }}>
              Pattern
            </p>
            <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})`, lineHeight: 1.2 }}>
              Same infrastructure. Domain-specific interface, workflows, outputs, personas, and protocols.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr_0.92fr] gap-5 flex-1">
          {beachheads.map(({ vertical, status, color, icon, problem, result, proof }) => (
            <div key={vertical} className="rounded-[26px] border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.1 }}>{vertical}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full font-bold shrink-0" style={{ fontSize: 11, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{status}</span>
              </div>

              <div className="rounded-xl px-4 py-4 mb-4" style={{ background: `hsl(${WARM} / 0.05)`, border: `1px solid hsl(${WARM} / 0.12)` }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} style={{ color: `hsl(${WARM})`, flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p className="font-bold mb-1" style={{ fontSize: 12, color: `hsl(${WARM})`, textTransform: "uppercase", letterSpacing: "0.12em" }}>Where we start</p>
                    <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>{problem}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl px-4 py-4 mb-4" style={{ background: `hsl(${color} / 0.07)`, border: `1px solid hsl(${color} / 0.16)` }}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p className="font-bold mb-1" style={{ fontSize: 12, color: `hsl(${color})`, textTransform: "uppercase", letterSpacing: "0.12em" }}>What we unlock</p>
                    <p className="font-semibold" style={{ fontSize: 17, color: `hsl(${color})`, lineHeight: 1.35 }}>{result}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto rounded-xl px-4 py-3" style={{ background: `hsl(${color} / 0.05)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Proof</p>
                <p style={{ fontSize: 13, color: MUTED, fontStyle: "italic", lineHeight: 1.35 }}>{proof}</p>
              </div>
            </div>
          ))}

          <div className="rounded-[26px] border p-5 flex flex-col"
            style={{ borderColor: `hsl(${ACCENT} / 0.14)`, background: `hsl(${ACCENT} / 0.03)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 12, color: MUTED }}>
              What changes by vertical
            </p>
            <div className="grid gap-3">
              {[
                { name: "Input documents", col: TEAL },
                { name: "Output deliverables", col: GREEN },
                { name: "Personas", col: GOLD },
                { name: "Review flows", col: ACCENT },
                { name: "Compliance language", col: WARM },
                { name: "Protocol libraries", col: SEAFOAM },
              ].map(({ name, col }) => (
                <div key={name} className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: `hsl(${col} / 0.05)`, border: `1px solid hsl(${col} / 0.15)` }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: `hsl(${col})` }} />
                  <p className="font-semibold" style={{ fontSize: 16, color: TEXT, lineHeight: 1.2 }}>{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border px-6 py-3 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={20} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 16, color: MUTED }}>
            <strong style={{ color: TEXT }}>One horizontal engine. Vertical CX layers on top.</strong>{" "}
            Each vertical can be built internally, with partners, or through selected joint ventures while the core remains LIZA OS.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — WHAT'S BUILT (Product is live)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10() {
  const features = [
    {
      layer: "Knowledge Graph", color: ACCENT,
      icon: <Layers size={28} />,
      desc: "The substrate of Organizational Intelligence. Versioned, auditable, propagated across teams.",
      screenshot: "/images/product-define-enforce.png",
    },
    {
      layer: "Protocol Workbooks", color: GOLD,
      icon: <Target size={28} />,
      desc: "Where the Context Layer runs. Model-agnostic execution with standards, exceptions, and live signals applied at draft time.",
      screenshot: "/images/product-execute-protocol.png",
    },
    {
      layer: "Context Engine (AACE v3.1)", color: GREEN,
      icon: <Workflow size={28} />,
      desc: "The runtime spec. Intent-locking and Organizational Intelligence injection. The IP moat.",
      screenshot: "/images/product-mission-control.png",
    },
    {
      layer: "Governance Loop", color: ACCENT,
      icon: <Eye size={28} />,
      desc: "Drift detection, compliance scoring, and after-action synthesis. Every execution feeds the substrate back.",
      screenshot: "/images/product-oversight.png",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Product Status</p>
        <h2 className="font-bold mb-6" style={{ fontSize: 56, color: TEXT, lineHeight: 1.1 }}>
          The Context Layer is live.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>Not a prototype.</span>
        </h2>

        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
          {features.map(({ layer, color, icon, desc, screenshot }) => (
            <div key={layer} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.03)` }}>
              {/* Product screenshot */}
              <div className="h-[200px] overflow-hidden" style={{ borderBottom: `1px solid hsl(${color} / 0.12)` }}>
                <img src={screenshot} alt={layer} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div className="flex gap-4 p-5 flex-1">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${color} / 0.1)`, color: `hsl(${color})` }}>{icon}</div>
                <div>
                  <p className="font-bold mb-1" style={{ fontSize: 20, color: TEXT }}>{layer}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 mt-4">
          {[
            { label: "AI Standards Diagnostic", desc: "Live lead-gen tool. Teams self-assess AI maturity.", color: GOLD },
            { label: "Full Marketing Site", desc: "Positioning, 7 use cases, industries live at lizaos.ai.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-5 py-3 flex items-center gap-3"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <Lightbulb size={22} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 14, color: MUTED }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — BUSINESS MODEL
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Business Model</p>

        <h2 className="font-black mb-6" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Core infrastructure base. <span style={{ color: `hsl(${GREEN})` }}>Vertical CX scales usage.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Revenue Streams</p>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Platform Base</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Annual infrastructure fee</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                Recurring access to the knowledge graph, workbooks, governance, permissions, and orchestration layer.
                This is the durable horizontal core investors fund in the seed round.
              </p>
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>AI Credits</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>Usage-based execution</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                Customers pay for high-intensity actions like extraction, governed runs, simulations, and output generation.
                Vertical CX layers create repeated review, execution, and reporting events that compound usage.
              </p>
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Guided Kickstart</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>Fixed-fee onboarding</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                Transitional entry offer to stand up the first workflows fast, prove ROI, and convert accounts into recurring platform plus credits customers.
                Partners and selected JVs can accelerate domain-specific experience layers without fragmenting the core platform.
              </p>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-4">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Why this model wins</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Sticky base", value: "High", desc: "Infrastructure sits inside core workflows" },
                { label: "Usage upside", value: "Direct", desc: "Revenue scales with execution volume" },
                { label: "Margin logic", value: "Better", desc: "Credits absorb rising AI compute cost" },
                { label: "Expansion", value: ">120%", desc: "More teams, more workflows, more usage" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="rounded-xl px-5 py-5 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <p className="font-black" style={{ fontSize: 36, color: TEXT }}>{value}</p>
                  <p className="font-bold mt-1" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{label}</p>
                  <p style={{ fontSize: 13, color: MUTED }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 17, color: `hsl(${ACCENT})` }}>Pricing transition</p>
              <div className="flex flex-col gap-2">
                {[
                  "Today: guided kickstarts accelerate learning and onboarding",
                  "Near term: recurring platform base becomes the account anchor",
                  "Strategic state: vertical CX and protocol packs drive repeatable credit-based execution",
                  "Result: pricing compounds with adoption instead of flattening into seat-based ceilings",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-black" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>{i + 1}.</span>
                    <span style={{ fontSize: 15, color: MUTED }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11B — 30-DAY EXECUTION CHALLENGE (GTM Wedge)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideExecutionChallenge() {
  const phases = [
    {
      week: "Week 1",
      title: "Extract",
      icon: <BookOpen size={24} />,
      color: TEAL,
      actions: [
        "Client selects one high-value process (e.g. proposal writing, deal qualification)",
        "Platform guides structured knowledge capture from 2-3 senior experts",
        "LIZA auto-generates executable playbooks from the input",
      ],
      output: "3-5 executable playbooks ready",
    },
    {
      week: "Week 2-3",
      title: "Execute",
      icon: <Zap size={24} />,
      color: SEAFOAM,
      actions: [
        "Team members self-serve: run playbooks with AI guidance",
        "Real work, real clients, real outputs",
        "Platform tracks drift and captures feedback automatically",
      ],
      output: "Measurable quality comparison: before vs. after",
    },
    {
      week: "Week 4",
      title: "Prove",
      icon: <TrendingUp size={24} />,
      color: GREEN,
      actions: [
        "Automated review: time saved, quality delta, rework reduction",
        "Knowledge graph self-improves from execution feedback",
        "Business case for full self-serve deployment with real numbers",
      ],
      output: "ROI proven. Expansion decision with data.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${GREEN})` }}>Go-To-Market Wedge</p>

        <h2 className="font-black mb-6" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Self-serve by design.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Co-built with our first enterprise cohort.</span>
        </h2>

        <div className="flex gap-6 flex-1 min-h-0">
          {phases.map((p, i) => (
            <div key={p.week} className="flex-1 rounded-2xl border flex flex-col overflow-hidden"
              style={{ borderColor: `hsl(${p.color} / 0.25)`, background: `hsl(${p.color} / 0.03)` }}>
              {/* Header */}
              <div className="px-7 py-5 flex items-center gap-4" style={{ borderBottom: `1px solid hsl(${p.color} / 0.15)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${p.color} / 0.12)`, color: `hsl(${p.color})` }}>
                  {p.icon}
                </div>
                <div>
                  <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${p.color})` }}>{p.week}</p>
                  <p className="font-black" style={{ fontSize: 28, color: TEXT }}>{p.title}</p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex-1 px-7 py-5 flex flex-col gap-4">
                {p.actions.map((a, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className="font-bold shrink-0 mt-0.5" style={{ fontSize: 18, color: `hsl(${p.color})` }}>→</span>
                    <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{a}</p>
                  </div>
                ))}
              </div>
              {/* Output */}
              <div className="px-7 py-4 mt-auto" style={{ background: `hsl(${p.color} / 0.06)` }}>
                <p className="font-bold" style={{ fontSize: 17, color: `hsl(${p.color})` }}>
                  ✓ {p.output}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom metrics */}
        <div className="mt-6 grid grid-cols-4 gap-5">
          {[
            { metric: "€5-15K", label: "Sprint cost", sub: "Low-friction entry" },
            { metric: "1 workflow", label: "Starting scope", sub: "Narrow and measurable" },
            { metric: "30 days", label: "Time to proof", sub: "Not a six-month rollout" },
            { metric: "Go / no-go", label: "Decision point", sub: "Expand only if ROI is proven" },
          ].map(m => (
            <div key={m.label} className="rounded-xl px-5 py-5 text-center" style={{ background: `hsl(${GREEN} / 0.04)`, border: `1px solid hsl(${GREEN} / 0.12)` }}>
              <p className="font-black" style={{ fontSize: 34, color: TEXT }}>{m.metric}</p>
              <p className="font-bold mt-1" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>{m.label}</p>
              <p style={{ fontSize: 14, color: MUTED }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Team</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          15+ years in AI & data transformation.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>200+ enterprise engagements globally.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>FOUNDING TEAM</p>
            {[
              { name: "István Boscha", role: "Product & CEO", note: "Founder of Aliz.ai (Google Cloud Partner). 15+ years AI transformation globally.", photo: istvanPhoto, color: TEAL },
              { name: "Kristóf Éger", role: "Enterprise GTM", note: "Category creation, executive positioning, AI-driven business strategy.", photo: kristofPhoto, color: SEAFOAM },
              { name: "Zoltán Kauker", role: "AI Architecture", note: "Deep-tech AI/data engineering. Knowledge systems & scalable infrastructure.", photo: zoltanPhoto, color: MINT },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-5 rounded-xl border p-5"
                style={{ borderColor: `hsl(${t.color} / 0.2)`, background: `hsl(${t.color} / 0.03)` }}>
                <img src={t.photo} alt={t.name} className="w-16 h-16 rounded-full object-cover" style={{ border: `2px solid hsl(${t.color} / 0.3)` }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{t.name}</p>
                  <p style={{ fontSize: 16, color: `hsl(${t.color})` }}>{t.role}</p>
                  <p style={{ fontSize: 15, color: MUTED }}>{t.note}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border p-5 mt-auto"
              style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 16, color: `hsl(${GOLD})`, letterSpacing: "0.12em", textTransform: "uppercase" }}>Advisory Board</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                    style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})`, fontSize: 14 }}>TR</div>
                  <div>
                    <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>Tom Ray</p>
                    <p style={{ fontSize: 14, color: MUTED }}>Chairman, Aliz.ai · Founding CEO, EdgeCore Data Centers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                    style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})`, fontSize: 14 }}>VP</div>
                  <div>
                    <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>Enterprise VP Product Advisor</p>
                    <p style={{ fontSize: 14, color: MUTED }}>Enterprise software · 15+ years in Product</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>WHY US</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: "200+", label: "Enterprise engagements", icon: <Users size={20} /> },
                { stat: "8", label: "Countries", icon: <Globe size={20} /> },
                { stat: "15+ yrs", label: "AI consulting", icon: <Briefcase size={20} /> },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="text-center rounded-xl px-3 py-4" style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                  <div className="flex justify-center mb-2" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black" style={{ fontSize: 30, color: TEXT }}>{stat}</p>
                  <p style={{ fontSize: 13, color: MUTED }}>{label}</p>
                </div>
              ))}
            </div>
            {[
              { title: "We lived this problem", desc: "Built AI practices at enterprise scale. Saw the expertise gap firsthand across industries, countries, and team sizes.", color: GREEN },
              { title: "Capital efficient & committed", desc: "15 months of self-funded development. Full product, marketing site, diagnostic tool, and enterprise pipeline. Built on a fraction of what funded competitors raised. We ship more with less.", color: TEAL },
              { title: "Proprietary IP", desc: "AACE v3.1: the context specification. Intent-locking, knowledge injection, drift detection. Hard to replicate.", color: GREEN },
            ].map(({ title, desc, color }) => (
              <div key={title} className="rounded-xl border p-4"
                style={{ borderColor: `hsl(${color} / 0.15)`, background: `hsl(${color} / 0.03)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 17, color: `hsl(${color})` }}>{title}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK (€2M + milestones + use of funds)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-8">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${GREEN} / 0.8)` }}>Seed Round</p>
          <h2 className="font-black mb-3" style={{ fontSize: 96, color: TEXT }}>€2M</h2>
          <p style={{ fontSize: 24, color: MUTED }}>
            Post-money SAFE &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A readiness
          </p>
        </div>

        {/* Use of funds */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Core Infrastructure", pct: "40%", amt: "€800K", desc: "Knowledge graph, governance, scale", color: ACCENT },
            { label: "Vertical CX", pct: "25%", amt: "€500K", desc: "Protocol packs and domain workflows", color: GREEN },
            { label: "GTM", pct: "25%", amt: "€500K", desc: "Cohort, partners, case studies", color: GOLD },
            { label: "Operations", pct: "10%", amt: "€200K", desc: "Legal, IP, compliance", color: MUTED },
          ].map(({ label, pct, amt, desc, color }) => (
            <div key={label} className="rounded-xl border px-5 py-4 text-center"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
              <p className="font-black" style={{ fontSize: 32, color: TEXT }}>{pct}</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${color})` }}>{label}</p>
              <p style={{ fontSize: 14, color: MUTED }}>{amt}: {desc}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { month: "Month 1-6", target: "Core hardened", milestone: "Knowledge graph, governance, billing, and first self-serve flows production-ready.", color: TEAL },
            { month: "Month 7-12", target: "3 vertical layers", milestone: "Professional Services, Pharma, and AEC protocol packs live with partner pathways.", color: SEAFOAM },
            { month: "Month 13-18", target: "Series A ready", milestone: "Usage engine proven across vertical CX layers with repeatable expansion economics.", color: MINT },
          ].map(({ month, target, milestone, color }) => (
            <div key={month} className="rounded-xl border px-5 py-4"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{month}</p>
              <p className="font-black mt-1" style={{ fontSize: 28, color: TEXT }}>{target}</p>
              <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{milestone}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 22, color: TEXT, lineHeight: 1.5 }}>
            This round funds the horizontal core.{" "}
            <strong style={{ color: `hsl(${TEAL})` }}>Vertical CX layers become the expansion model.</strong>
          </p>
        </div>

        <p className="mt-5 text-center" style={{ fontSize: 18, color: SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential
        </p>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

function SlideAppendixDivider() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 text-center">
        <p className="font-semibold tracking-[0.3em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${TEAL} / 0.6)` }}>
          LIZA OS
        </p>
        <h1 className="font-black" style={{ fontSize: 80, color: TEXT, lineHeight: 1.1 }}>
          Appendix
        </h1>
        <p className="mt-4" style={{ fontSize: 22, color: SUBTLE }}>
          Supporting detail &amp; technical depth
        </p>
      </div>
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "The Context Gap", component: <Slide02 /> },
  { id: 3, title: "The Context Gap, Exemplified", component: <SlideContextGapExemplified /> },
  { id: 4, title: "Where Missing Context Shows Up", component: <Slide03 /> },
  { id: 5, title: "What Missing Context Costs", component: <Slide03Cost /> },
  { id: 6, title: "Persona-Level Reality", component: <Slide03WorkflowProof /> },
  { id: 7, title: "Early Validation", component: <Slide08 /> },
  { id: 8, title: "Why Now", component: <SlideWhyNow /> },
  { id: 9, title: "The Context Layer", component: <Slide05 /> },
  { id: 10, title: "People as Nodes", component: <SlidePeopleAsNodes /> },
  { id: 11, title: "Organizational Intelligence", component: <Slide06Shift /> },
  { id: 12, title: "Category Thesis & Moat", component: <Slide06 /> },
  { id: 13, title: "Expansion Path", component: <Slide09 /> },
  { id: 14, title: "Shape of the Company", component: <SlideShape /> },
  { id: 15, title: "What's Built", component: <Slide10 /> },
  { id: 16, title: "Business Model", component: <Slide11 /> },
  { id: 17, title: "30-Day Challenge", component: <SlideExecutionChallenge /> },
  { id: 18, title: "Team", component: <Slide12 /> },
  { id: 19, title: "The Ask", component: <Slide13 /> },
  { id: 20, title: "Appendix", component: <SlideAppendixDivider /> },
  { id: 21, title: "Appendix: How It Works", component: <Slide07 /> },
  { id: 22, title: "Appendix: Architecture", component: <SlideArchitecture /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function LifecycleInvestorDeckV2() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(SLIDES.length - 1, idx)));
    setShowGrid(false);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  useSwipe(next, prev);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
      if (e.key === "Escape") { setIsFullscreen(false); setShowGrid(false); }
      if (e.key === "g" || e.key === "G") setShowGrid(v => !v);
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); enterFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
  };

  useEffect(() => {
    const onFsc = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", onFsc);
    return () => document.removeEventListener("fullscreenchange", onFsc);
  }, []);

  useEffect(() => {
    if (!isFullscreen) { setShowNav(true); return; }
    let timer: ReturnType<typeof setTimeout>;
    const show = () => { setShowNav(true); clearTimeout(timer); timer = setTimeout(() => setShowNav(false), 2500); };
    window.addEventListener("mousemove", show);
    show();
    return () => { window.removeEventListener("mousemove", show); clearTimeout(timer); };
  }, [isFullscreen]);

  const slide = SLIDES[current];

  const [mobileControlsVisible, setMobileControlsVisible] = useState(true);
  const mobileTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const showMobileControls = useCallback(() => {
    setMobileControlsVisible(true);
    clearTimeout(mobileTimerRef.current);
    mobileTimerRef.current = setTimeout(() => setMobileControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    if (isMobile && !isPortrait) showMobileControls();
    return () => clearTimeout(mobileTimerRef.current);
  }, [isMobile, isPortrait, showMobileControls]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: BG }}
        onClick={() => { if (!isPortrait) showMobileControls(); }}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${TEAL})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: TEXT }}>Rotate your device to landscape</p>
            <p className="text-center" style={{ fontSize: 14, color: MUTED }}>for the best viewing experience</p>
          </div>
        )}

        <ScaledSlide>{slide.component}</ScaledSlide>

        {!isPortrait && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }} disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Previous">
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next">
              <ChevronRight size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
          style={{
            background: "hsl(0 0% 100% / 0.9)", border: `1px solid ${CHROME_BORDER}`, backdropFilter: "blur(8px)",
            opacity: mobileControlsVisible ? 1 : 0, pointerEvents: mobileControlsVisible ? "auto" : "none",
          }}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronLeft size={18} style={{ color: TEXT }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
        </div>

        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999]" style={{ cursor: showNav ? "default" : "none" }}>
        <ScaledSlide>{slide.component}</ScaledSlide>
        {showNav && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full shadow-lg"
            style={{ background: "hsl(0 0% 100% / 0.95)", border: `1px solid ${CHROME_BORDER}` }}>
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20 hover:bg-gray-100">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20 hover:bg-gray-100">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={18} style={{ color: MUTED }} />
            </button>
          </div>
        )}
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto" style={{ background: CHROME_BG }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS Investor Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} />
            <Button variant="outline" size="sm" onClick={() => setShowGrid(false)}>
              <X size={16} className="mr-1.5" /> Close
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-5 p-6">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg text-left",
                i === current ? "ring-2 ring-offset-2" : "")}
              style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER, aspectRatio: "16/9" }}>
              <div className="w-full h-full relative">
                <ScaledSlide>{s.component}</ScaledSlide>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "hsl(0 0% 100% / 0.9)" }}>
                  <p className="font-semibold truncate" style={{ fontSize: 13, color: TEXT }}>
                    {i + 1}. {s.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
        <div className="flex items-center gap-4">
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS Investor Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} />
          <Button variant="ghost" size="sm" onClick={() => setShowGrid(true)}>
            <Grid3x3 size={16} className="mr-1.5" /> Grid
          </Button>
          <Button variant="ghost" size="sm" onClick={enterFullscreen}>
            <Maximize2 size={16} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button onClick={prev} disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full disabled:opacity-10 hover:bg-white/80 transition-opacity z-10">
          <ChevronLeft size={24} style={{ color: MUTED }} />
        </button>

        <div className="w-full h-full max-w-[1200px] rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: CHROME_BORDER, aspectRatio: "16/9" }}>
          <ScaledSlide>{slide.component}</ScaledSlide>
        </div>

        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full disabled:opacity-10 hover:bg-white/80 transition-opacity z-10">
          <ChevronRight size={24} style={{ color: MUTED }} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-4">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i === current ? `hsl(${TEAL})` : `hsl(215 10% 80%)` }} />
        ))}
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}

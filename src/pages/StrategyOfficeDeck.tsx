import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import { AlertTriangle, ArrowRight, Award, BookOpen, Brain, Briefcase, Building2, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock, Cpu, Database, DollarSign, Eye, Factory, FileCheck, FileText, FlaskConical, GitBranch, Globe, Grid3x3, HeartPulse, Layers, Lightbulb, Maximize2, Microscope, Network, Pill, RefreshCw, Rocket, Shield, Sparkles, Target, TrendingUp, Users, Workflow, X, Zap } from "lucide-react";
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

// Satcom-operator palette: cyan/teal axis distinct from /space (builder green-teal)
const TEAL = "220 65% 32%";
const MINT = "38 92% 50%";
const WARM = "15 85% 55%";
const RED = "0 72% 50%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";
const SEAFOAM = "200 70% 38%";
const GOLD = "45 95% 42%";
const ACCENT = "220 60% 38%";

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
            LIZA OS · M&As · Strategic Conversation
          </span>
        </div>

        <h1 className="font-black mb-6" style={{ fontSize: 82, lineHeight: 1.05, color: TEXT }}>
          The Deal Memory Layer<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            for corporate development teams.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1180, lineHeight: 1.5 }}>
          M&A teams need a bit of everything: fleet, regulatory, financials, market. Not engineer-deep on any one of them. LIZA OS gives corp dev a single 360° company view, and routes the deep questions to the right internal expert team.<br />
          <span style={{ color: `hsl(${TEAL})` }}>360° Company View · Expert Routing · Deal & Partnership Memory</span>
        </p>

        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; Prepared for corporate development & M&A teams (Hispasat · OTP · KKR-class acquirers) &nbsp;·&nbsp; Pilot + Open-Canvas Partnership Conversation
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE SHAPE — THE SHAPE OF THE COMPANY (Pharma framing)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideShape() {
  const verticals = [
    { label: "Corp Dev / M&A", sub: "360° view · Expert routing · Deal memory", active: true, color: TEAL },
    { label: "Satcom Operators", sub: "Fleet ops · Procurement · ITU & SLAs", active: false, color: MUTED },
    { label: "Pharma", sub: "GxP · Deviations · CSRs", active: false, color: MUTED },
    { label: "AEC", sub: "RFI · Submittals · Handover", active: false, color: MUTED },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <div className="px-3 py-1 rounded-md text-xs font-bold tracking-[0.2em]" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
            12 · THE SHAPE OF THE COMPANY
          </div>
        </div>
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          One OS. <span style={{ color: `hsl(${TEAL})` }}>Corp dev is the next spear.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Corp dev teams sit on top of fleet, regulatory, and finance experts. They need a bit of everything to form a view on a target or a partnership, and the routing rails to ask the deep questions of the right internal team. LIZA OS gives them both, on top of platform leverage already proven inside satcom, pharma, and AEC.
        </p>

        {/* Diagram */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Vertical pillars */}
          <div className="grid grid-cols-4 gap-6 mb-0">
            {verticals.map(v => (
              <div key={v.label} className="rounded-xl border-2 p-6 relative" style={{
                borderColor: v.active ? `hsl(${v.color})` : CHROME_BORDER,
                background: v.active ? `hsl(${v.color} / 0.06)` : CARD_ALT,
              }}>
                {v.active && (
                  <div className="absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-bold tracking-[0.2em]"
                    style={{ background: `hsl(${v.color})`, color: "white" }}>
                    TODAY'S CONVERSATION
                  </div>
                )}
                <div className="font-black mb-1" style={{ fontSize: 28, color: v.active ? `hsl(${v.color})` : TEXT }}>{v.label}</div>
                <div style={{ fontSize: 16, color: MUTED }}>{v.sub}</div>
              </div>
            ))}
          </div>

          {/* Connector */}
          <div className="flex justify-center my-2" style={{ color: SUBTLE }}>
            <div className="text-3xl leading-none">▾ ▾ ▾ ▾</div>
          </div>

          {/* Horizontal platform bar */}
          <div className="rounded-xl p-7 border-2" style={{
            background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`,
            borderColor: `hsl(${TEAL})`,
          }}>
            <div className="flex items-center justify-between gap-8">
              <div>
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
        </div>

        {/* Investor message */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${TEAL})` }}>WHAT YOU OWN</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              A dealmaker-native memory layer for diligence, post-merger integration, and continuous market scanning. Codifies sector know-how and prior-deal lessons faster than your bench can rotate.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${BLUE})` }}>WHAT COMPOUNDS</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Investment from adjacent verticals (AEC, Pharma, Satcom) accelerates the platform; your M&A team inherits a hardened core, not a v1.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${GOLD})` }}>HOW WE STRUCTURE IT</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Phase 1: 30-day pilot on a live PMI workstream or sector scan. Phase 2: extend across the deal lifecycle. Phase 3: optional strategic stake.
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
  const above: { x: number; label: string }[] = ["Diligence checklists","SPA templates","Synergy models","Integration playbooks"].map((label: string, i: number) => ({
    x: 720 + i * 165,
    label,
  }));
  const buckets: { title: string; items: string[] }[] = [
    {
      "title": "Senior Dealmaker Judgment",
      "items": [
        "Per-target quirks not in the playbook",
        "Deal precedent the senior partner remembers",
        "Valuation rule-of-thumb for this sector and cycle"
      ]
    },
    {
      "title": "Regulator & Antitrust Memory",
      "items": [
        "Antitrust history with this competition authority",
        "National regulator precedent and remedies",
        "Prior clearance conditions and the rationale"
      ]
    },
    {
      "title": "Target Operator & Integration Practice",
      "items": [
        "Reps & warranties patterns by sector",
        "SPA trade-offs settled in the last deal",
        "Past target-management signals not in the data room"
      ]
    },
    {
      "title": "Cross-Function Deal Decisions",
      "items": [
        "Live integration escalations and seller posture",
        "Sector-strategy moves not yet logged",
        "Sign-off thresholds across IC, legal, and ops"
      ]
    }
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />

      {/* Header */}
      <div className="relative z-20 px-28 pt-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          The Context Gap in M&A
        </p>
        <h2 className="font-black mb-3" style={{ fontSize: 72, color: TEXT, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          The Context Gap.
        </h2>
        <p className="font-medium" style={{ fontSize: 24, color: MUTED, lineHeight: 1.35, maxWidth: 1500 }}>
          AI doesn&apos;t miss because the model is weak. It misses because <span style={{ color: TEXT, fontWeight: 700 }}>most of how an M&A organization actually decides was never formally defined.</span>
        </p>
      </div>

      {/* Iceberg canvas */}
      <div className="relative z-10 flex-1 mt-2">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 760" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="ice-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${WARM} / 0.04)`} />
              <stop offset="40%" stopColor={`hsl(${WARM} / 0.10)`} />
              <stop offset="100%" stopColor={`hsl(${WARM} / 0.22)`} />
            </linearGradient>
            <linearGradient id="ice-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${GREEN} / 0.20)`} />
              <stop offset="100%" stopColor={`hsl(${GREEN} / 0.36)`} />
            </linearGradient>
            <linearGradient id="ice-bot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${WARM} / 0.30)`} />
              <stop offset="100%" stopColor={`hsl(${WARM} / 0.55)`} />
            </linearGradient>
          </defs>

          <rect x="0" y="220" width="1920" height="540" fill="url(#ice-water)" />
          <line x1="0" y1="220" x2="1920" y2="220" stroke={`hsl(${WARM} / 0.45)`} strokeWidth="1.5" strokeDasharray="6 6" />

          <text x="1840" y="178" textAnchor="end" style={{ fontSize: 26, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 2 }}>~10% FORMALLY DEFINED</text>
          <text x="1840" y="206" textAnchor="end" style={{ fontSize: 16, fontWeight: 700, fill: TEXT }}>What AI is given today</text>
          <text x="1840" y="262" textAnchor="end" style={{ fontSize: 26, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 2 }}>~90% ORGANIZATIONAL INTELLIGENCE</text>
          <text x="1840" y="290" textAnchor="end" style={{ fontSize: 16, fontWeight: 700, fill: TEXT }}>What ai needs to run a fleet to sla</text>
          <text x="1840" y="312" textAnchor="end" style={{ fontSize: 13, fontWeight: 500, fill: MUTED }}>Lives in experts, reviewers, prior decisions, and live escalations</text>

          <polygon points="870,220 960,90 1050,220" fill="url(#ice-top)" stroke={`hsl(${GREEN} / 0.7)`} strokeWidth="1.5" />
          <polygon points="870,220 480,740 1440,740 1050,220" fill="url(#ice-bot)" stroke={`hsl(${WARM} / 0.55)`} strokeWidth="1.5" />

          {above.map((a, i) => (
            <g key={`a-${i}`}>
              <rect x={a.x - 64} y={140 - (i % 2) * 14} width="128" height="28" rx="6"
                fill={BG} stroke={`hsl(${GREEN} / 0.6)`} strokeWidth="1" />
              <text x={a.x} y={159 - (i % 2) * 14} textAnchor="middle"
                style={{ fontSize: 13, fontWeight: 700, fill: TEXT }}>{a.label}</text>
            </g>
          ))}
          <text x="960" y="58" textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 900, fill: `hsl(${GREEN})`, letterSpacing: 2 }}>WHAT AI IS GIVEN TODAY</text>

          {buckets.map((bucket, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const bw = 360, bh = 168;
            const bx = 580 + col * 410;
            const by = 305 + row * 195;
            return (
              <g key={`bk-${i}`}>
                <rect x={bx} y={by} width={bw} height={bh} rx="10"
                  fill={BG} stroke={`hsl(${WARM} / 0.55)`} strokeWidth="1.2" opacity="0.96" />
                <rect x={bx} y={by} width={bw} height="34" rx="10"
                  fill={`hsl(${WARM} / 0.18)`} />
                <rect x={bx} y={by + 24} width={bw} height="10"
                  fill={`hsl(${WARM} / 0.18)`} />
                <text x={bx + 18} y={by + 23}
                  style={{ fontSize: 15, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 1.5 }}>
                  {bucket.title.toUpperCase()}
                </text>
                {bucket.items.map((item, j) => (
                  <g key={`it-${j}`}>
                    <circle cx={bx + 24} cy={by + 66 + j * 34} r="3.5" fill={`hsl(${WARM})`} />
                    <text x={bx + 36} y={by + 70 + j * 34}
                      style={{ fontSize: 15, fontWeight: 600, fill: TEXT }}>{item}</text>
                  </g>
                ))}
              </g>
            );
          })}

          <text x="960" y="725" textAnchor="middle"
            style={{ fontSize: 18, fontWeight: 900, fill: `hsl(${WARM})`, letterSpacing: 2 }}>WHAT AI NEEDS TO RUN A DEAL TO CLOSE</text>
        </svg>
      </div>

      {/* Bottom punchline */}
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
// SLIDE 03 — WHAT THAT COSTS
// ═══════════════════════════════════════════════════════════════════════════════

const SATCOM_GAP_CASES = [
  {
    name: "360° Company View",
    icon: <Shield size={22} style={{ color: `hsl(${RED})` }} />,
    accent: RED,
    records: ["Fleet & assets", "Regulatory filings", "Financials & ownership"],
    output: "One overview per target · IC-ready brief",
    gap: "Corp dev needs a bit of everything — fleet, regulatory, financials — but is not engineer-deep on any of it. Today that overview is hand-stitched from PDFs, web search, and emails to the mission and regulatory teams.",
    cost: "Days lost per target. Half the questions never reach the expert team in time.",
  },
  {
    name: "Expert Routing",
    icon: <Briefcase size={22} style={{ color: `hsl(${WARM})` }} />,
    accent: WARM,
    records: ["Mission ops know-how", "Regulatory specialists", "Finance & legal desks"],
    output: "Routed questions · Expert answers attached to the deal",
    gap: "Corp dev's job is to ask the right deep question of the right internal team — can this satellite move to that orbit, does it have fuel, will the regulator allow it. Today those answers live in Slack threads and inboxes, not on the deal.",
    cost: "Expert answers re-asked every cycle. Senior bandwidth burned on the same questions.",
  },
  {
    name: "Market & Partnership Memory",
    icon: <DollarSign size={22} style={{ color: `hsl(${GOLD})` }} />,
    accent: GOLD,
    records: ["Sector maps", "Prior conversations", "Passed-on targets & partnerships"],
    output: "Live market view · Partnership candidates surfaced",
    gap: "Corp dev is also scanning for collaboration, not just acquisition. The conversation a colleague had with that operator last year, the partnership that almost happened, the targets the team passed on — none of it is queryable.",
    cost: "Partnerships missed. Strategy lags the market. Same scan repeated next quarter.",
  },
];

const SATCOM_COST_BENCHMARKS = [
  {
    value: "15–20 yrs",
    label: "of deal memory locked in the senior partners and heads of M&A who remember why every prior deal was won, lost, or passed on. It walks out the door when they move firm.",
    source: "Corporate development and PE field engagements, 2022-2024",
  },
  {
    value: "6–18 mo",
    label: "to ramp a new associate, integration lead, or sector analyst to fluency on a live portfolio. The playbooks live in heads, not in queryable systems.",
    source: "Corp dev / PE onboarding benchmarks; industry HR studies",
  },
  {
    value: "$M / hr",
    label: "of expected synergies that miss in the average post-merger integration, often because integration teams cannot access prior PMI lessons across the portfolio.",
    source: "KPMG / Bain post-merger integration benchmarks",
  },
];

const __VERTICAL_PERSONAS = [
  {
    "id": "ops",
    "name": "360° Company View",
    "color": "RED",
    "iconName": "Briefcase",
    "above": [
      "Fleet & asset summary",
      "Regulatory & licence overview",
      "Financials & ownership"
    ],
    "below": [
      "Which experts already covered this sector internally",
      "What we learned about this target the last time we looked",
      "Soft signals the analyst hasn't surfaced yet"
    ],
    "breaks": "Overview hand-stitched per target. Half the picture is missing on day one."
  },
  {
    "id": "proc",
    "name": "Expert Routing",
    "color": "WARM",
    "iconName": "Shield",
    "above": [
      "Mission ops team",
      "Regulatory specialists",
      "Finance & legal desks"
    ],
    "below": [
      "Can this satellite move to that orbit, does it have fuel",
      "Will the regulator allow this transfer",
      "Did we already answer this on a prior deal"
    ],
    "breaks": "Expert answers re-asked every cycle. Senior bandwidth burned twice."
  },
  {
    "id": "reg",
    "name": "Market & Partnership Memory",
    "color": "GOLD",
    "iconName": "Database",
    "above": [
      "Sector maps",
      "Competitor & partner moves",
      "Banker and broker pitches"
    ],
    "below": [
      "The partnership that almost happened last year",
      "Conversations a colleague had with this operator",
      "Targets the team passed on and why"
    ],
    "breaks": "Partnerships missed. Strategy lags the market."
  }
] as const;

function Slide03() {
  const alsoApplies = ["Sector mapping","Carve-outs","Founder outreach","Synergy tracking","Cyber diligence","JV & partnerships"];
  const renderIcon = (name: string, color: string) => {
    const props = { size: 20, style: { color: `hsl(${color})` } };
    if (name === "Briefcase") return <Briefcase {...props} />;
    if (name === "Shield") return <Shield {...props} />;
    if (name === "Database") return <Database {...props} />;
    return <Shield {...props} />;
  };
  const colorVal = (k: string) => (k === "RED" ? RED : k === "WARM" ? WARM : k === "GOLD" ? GOLD : k === "GREEN" ? GREEN : TEAL);

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Where Missing Context Shows Up in M&A
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          The same iceberg, in every persona. <span style={{ color: `hsl(${TEAL})` }}>What is captured is dwarfed by what runs the work.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.4 }}>
          The artifacts above the waterline are what AI sees. The Organizational Intelligence below the waterline is the dealmaker judgment that determines whether the output is usable.
        </p>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 mb-4">
          {__VERTICAL_PERSONAS.map((v) => {
            const c = colorVal(v.color);
            return (
            <div key={v.id} className="rounded-xl border flex flex-col overflow-hidden"
              style={{ borderColor: `hsl(${c} / 0.24)`, background: `hsl(${c} / 0.025)` }}>
              <div className="px-5 py-3 flex items-center gap-3 border-b"
                style={{ borderColor: `hsl(${c} / 0.16)`, background: `hsl(${c} / 0.055)` }}>
                {renderIcon(v.iconName, c)}
                <p className="font-black" style={{ fontSize: 19, color: TEXT, lineHeight: 1.15 }}>{v.name}</p>
              </div>

              <div className="flex-1 px-4 pt-4 pb-3 flex items-center justify-center min-h-0">
                <div className="relative w-full max-w-[420px] aspect-[1/1.04]">
                  <svg viewBox="0 0 360 374" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id={`vt-top-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${GREEN} / 0.16)`} />
                        <stop offset="100%" stopColor={`hsl(${GREEN} / 0.32)`} />
                      </linearGradient>
                      <linearGradient id={`vt-bot-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${c} / 0.12)`} />
                        <stop offset="100%" stopColor={`hsl(${c} / 0.24)`} />
                      </linearGradient>
                      <linearGradient id={`vt-water-${v.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${c} / 0.035)`} />
                        <stop offset="100%" stopColor={`hsl(${c} / 0.09)`} />
                      </linearGradient>
                    </defs>

                    <rect x="0" y="132" width="360" height="242" fill={`url(#vt-water-${v.id})`} />
                    <line x1="18" y1="132" x2="342" y2="132"
                      stroke={`hsl(${c} / 0.55)`} strokeWidth="1.35" strokeDasharray="7 6" />
                    <polygon points="112,132 180,24 248,132" fill={`url(#vt-top-${v.id})`}
                      stroke={`hsl(${GREEN} / 0.9)`} strokeWidth="1.7" strokeLinejoin="round" />
                    <polygon points="112,132 28,344 332,344 248,132" fill={`url(#vt-bot-${v.id})`}
                      stroke={`hsl(${c} / 0.76)`} strokeWidth="1.7" strokeLinejoin="round" />
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
                    style={{ fontSize: 12.5, color: `hsl(${c})` }}>
                    What AI misses
                  </div>

                  <div className="absolute left-[16%] right-[12%] top-[49%] space-y-2.5">
                    {v.below.map((item) => (
                      <div key={item} className="rounded-md border px-2.5 py-2 flex gap-2"
                        style={{ background: `hsl(0 0% 100% / 0.92)`, borderColor: `hsl(${c} / 0.22)` }}>
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: `hsl(${c})` }} />
                        <p className="font-bold" style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.3 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t flex items-center gap-2"
                style={{ borderColor: `hsl(${RED} / 0.15)`, background: `hsl(${RED} / 0.05)` }}>
                <AlertTriangle size={14} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 13.5, color: `hsl(${RED})`, lineHeight: 1.3 }}>{v.breaks}</p>
              </div>
            </div>
          );})}
        </div>

        <div className="flex items-center gap-4 px-2">
          <p className="font-bold shrink-0" style={{ fontSize: 16, color: MUTED }}>Same pattern in:</p>
          <div className="flex flex-wrap gap-2.5">
            {alsoApplies.map((item) => (
              <span key={item} className="rounded-full px-4 py-1.5 font-semibold border" style={{ fontSize: 15, color: MUTED, borderColor: `hsl(215 15% 85%)`, background: `hsl(220 15% 98%)` }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={TEAL} to={WARM} />
    </div>
  );
}

function Slide04Cost() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          What Missing Context Costs an M&A Team
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 48, color: TEXT, lineHeight: 1.08, maxWidth: 1640 }}>
          Missing context becomes expensive because it slows diligence, weakens integration, and triggers <span style={{ color: `hsl(${WARM})` }}>avoidable IC rework, missed synergies, and value leakage.</span>
        </h2>

        <div className="grid grid-cols-[360px_1fr] gap-5 mb-4">
          <div className="rounded-[28px] border px-7 py-7" style={{ borderColor: `hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.05)` }}>
            <p className="font-black" style={{ fontSize: 64, color: `hsl(${WARM})`, lineHeight: 0.95 }}>hours</p>
            <p className="font-bold mt-2" style={{ fontSize: 23, color: TEXT, lineHeight: 1.18 }}>
              of senior-partner time burned re-litigating questions that have been answered on prior deals
            </p>
            <p className="mt-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>
              This is what AI amplifies if it runs without prior IC memos, integration lessons, sector heuristics, or senior-partner judgment.
            </p>
            <p className="mt-4" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.45 }}>
              Qualitative pattern from corp dev and PE field engagements; industry-level, not customer data
            </p>
          </div>

          <div className="rounded-[28px] border px-7 py-6" style={{ borderColor: `hsl(${TEAL} / 0.18)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {SATCOM_COST_BENCHMARKS.map((item) => (
                <div key={item.label} className="rounded-xl px-4 py-4 min-h-[172px]" style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                  <p className="font-black" style={{ fontSize: 31, color: `hsl(${TEAL})`, lineHeight: 1 }}>{item.value}</p>
                  <p className="font-bold mt-2" style={{ fontSize: 13, color: TEXT, lineHeight: 1.35 }}>{item.label}</p>
                  <p className="mt-2" style={{ fontSize: 11, color: SUBTLE, lineHeight: 1.45 }}>{item.source}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl px-5 py-5" style={{ background: `hsl(${WARM} / 0.05)`, border: `1px solid hsl(${WARM} / 0.12)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 16, color: `hsl(${WARM})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Why this matters for AI
              </p>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
                If AI produces a plausible answer inside a diligence summary, IC memo, integration plan, or market brief <span className="font-bold">without the full deal and portfolio context</span>, the senior partner or head of integration still has to catch it, correct it, and re-route it through review.
              </p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                On a live deal or post-merger integration, a missed precedent or weak clause translates into <span className="font-bold" style={{ color: TEXT }}>missed synergies, value leakage</span>, and knock-on effects on the next deal in the pipeline.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          {[
            { label: "Deal velocity", value: "exposed", desc: "Senior partners and integration leads burn cycles fixing AI-assisted work instead of running the next deal or closing the integration.", color: RED },
            { label: "PMI & antitrust", value: "exposed", desc: "Wrong outputs in integration plans, antitrust filings, or synergy reports create rework loops, audit risk, and weakened position with regulators and the seller.", color: WARM },
            { label: "AI usage", value: "cannot scale safely", desc: "Without dealmaker-grade governance, the Head of M&A and General Counsel limit adoption because every output creates IC, regulatory, and reputational exposure.", color: GOLD },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl px-7 py-7 h-full flex flex-col justify-center" style={{ background: `hsl(${item.color} / 0.06)`, border: `2px solid hsl(${item.color} / 0.18)` }}>
              <p className="font-black" style={{ fontSize: 15, color: `hsl(${item.color})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</p>
              <p className="font-black mt-3" style={{ fontSize: 34, color: TEXT, lineHeight: 1.04 }}>{item.value}</p>
              <p className="mt-4" style={{ fontSize: 18, color: MUTED, lineHeight: 1.42 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
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
      metric: "Now",
      label: "Acquisition pace accelerating + AI inside diligence is now baseline",
      insight: "Acquirers are running more parallel processes than ever, and bankers, regulators, and ICs expect traceability for AI-assisted memos, models, and integration plans.",
      color: TEAL,
      source: "Mergermarket; PitchBook activity benchmarks, 2024",
    },
  ];

  const shifts = [
    { shift: "GenAI moved into M&A workflows", result: "Corp dev and PE teams piloted LLMs inside diligence, IC memos, and integration plans. The audit trail did not follow." },
    { shift: "ICs and regulators ask 'how was this output governed?'", result: "Investment committees, sellers, and antitrust regulators expect traceability for AI-assisted deal and integration outputs." },
    { shift: "Senior dealmakers and PMI leads rotate faster than knowledge transfers", result: "Diligence and integration cycles are senior-talent-bound. Every hour a senior partner spends correcting AI is an hour not spent on the next deal." },
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
  const verticalSurfaces = [
    { title: "Dealmaker roles", items: "Head of M&A, corp dev associate, integration lead, sector analyst, GC", color: TEAL },
    { title: "M&A workflows", items: "Diligence, IC memo, antitrust filing, integration plan, market brief", color: GOLD },
    { title: "M&A language", items: "SPA / APA, EBITDA bridges, antitrust thresholds, synergy models, Day-1 / Day-100 playbooks", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Horizontal Core · Vertical Surface
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          The platform is horizontal. <span style={{ color: `hsl(${TEAL})` }}>Adoption happens through a dealmaker-native experience.</span>
        </h2>
        <div className="grid grid-cols-[1fr_60px_1.1fr_60px_1fr] gap-3 items-stretch mb-1">
          <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `hsl(${BLUE} / 0.16)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${BLUE})` }}>Input</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Prior IC memos, SPA templates, synergy models, antitrust filings, integration playbooks, sector research, deal-room exhausts</p>
          </div>
          <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${TEAL} / 0.4)` }} /></div>
          <div className="rounded-2xl border-2 px-6 py-4 text-center" style={{ borderColor: `hsl(${TEAL} / 0.32)`, background: `hsl(${TEAL} / 0.07)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${TEAL})` }}>LIZA OS</p>
            <p className="font-black" style={{ fontSize: 21, color: TEXT }}>The in-between operating layer that turns raw context into governed execution</p>
          </div>
          <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${TEAL} / 0.4)` }} /></div>
          <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `hsl(${GREEN} / 0.16)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Output</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>AI work that follows deal memory, validated playbooks, prior-cycle precedent, and senior-partner judgment</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_60px_1.1fr_60px_1fr] gap-3 items-center mb-1 h-10">
          <div className="flex justify-center">
            <ArrowRight size={30} style={{ color: `hsl(${BLUE} / 0.5)`, transform: "rotate(105deg)" }} />
          </div>
          <div />
          <div className="flex justify-center">
            <ArrowRight size={30} style={{ color: `hsl(${TEAL} / 0.55)`, transform: "rotate(90deg)" }} />
          </div>
          <div />
          <div className="flex justify-center">
            <ArrowRight size={30} style={{ color: `hsl(${GREEN} / 0.5)`, transform: "rotate(75deg)" }} />
          </div>
        </div>

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
            <p className="font-semibold mb-6" style={{ fontSize: 16, color: MUTED }}>The Context Layer</p>

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

          <p className="mt-4 text-center" style={{ fontSize: 14, color: MUTED, maxWidth: 560, lineHeight: 1.45 }}>
              LIZA provides the reusable knowledge loop. <span style={{ color: `hsl(${GOLD})`, fontWeight: 700 }}>A satcom-operator pilot makes it a fleet-native operating experience.</span>
            </p>
          </div>

          {/* Arrow out */}
          <div className="shrink-0 flex items-center justify-center px-5">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL} / 0.35)` }} />
          </div>

          {/* RIGHT — Governed Output */}
          <div className="w-[390px] shrink-0 flex flex-col gap-3">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Operator-native experience</p>
            {verticalSurfaces.map((item) => (
              <div key={item.title} className="rounded-2xl border px-6 py-5 flex items-center gap-4"
                style={{ borderColor: `hsl(${item.color} / 0.18)`, background: `hsl(${item.color} / 0.04)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${item.color} / 0.1)`, color: `hsl(${item.color})` }}><Workflow size={24} /></div>
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>{item.title}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{item.items}</p>
                </div>
              </div>
            ))}
            <p className="text-center font-bold mt-1" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>
              Specific enough for adoption. General enough to scale.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-6 rounded-xl px-8 py-3 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1.5px solid hsl(${TEAL} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>
            Horizontal infrastructure plus vertical UX. <span style={{ color: `hsl(${TEAL})` }}>That is how the loop becomes an industry standard.</span>
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
    { name: "Kratos OpenSpace / EPOCH", layer: "Fleet C2 / SOCC", color: BLUE },
    { name: "SpaceLogistics / SES Adaptive", layer: "Mission planning", color: BLUE },
    { name: "Salesforce / SAP", layer: "CRM / ERP", color: BLUE },
    { name: "OSS/BSS stack", layer: "Service ops & billing", color: BLUE },
    { name: "ITU SNS / Spectrum DBs", layer: "Regulatory & filings", color: BLUE },
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
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Governed Output Artifacts</p>
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
                    <p className="font-black" style={{ fontSize: 10, color: `hsl(${GOLD})`, letterSpacing: "0.1em" }}>KNOWLEDGE GRAPH</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Standards & SOPs", desc: "Versioned, governed" },
                      { label: "Expert Judgment", desc: "Encoded as rules" },
                      { label: "Decision Exceptions", desc: "Context-specific" },
                      { label: "Accumulated Memory", desc: "Grows with usage" },
                    ].map(item => (
                      <div key={item.label} className="rounded-lg px-2.5 py-1.5" style={{ background: `hsl(${GOLD} / 0.08)` }}>
                        <p className="font-bold" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>{item.label}</p>
                        <p style={{ fontSize: 10, color: MUTED }}>{item.desc}</p>
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
                    <p style={{ fontSize: 11, color: MUTED }}>Reasoning & orchestration</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Protocol Engine", desc: "Playbooks → guided workflows" },
                    { label: "Drift Detection", desc: "Flags deviations from standards" },
                    { label: "Propagation", desc: "One update cascades everywhere" },
                    { label: "Feedback Loop", desc: "Every execution teaches the system" },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg px-3 py-1.5" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                      <div className="flex items-center gap-2">
                        <p className="font-bold" style={{ fontSize: 12, color: `hsl(${TEAL})` }}>{item.label}</p>
                        <span style={{ fontSize: 10, color: MUTED }}>— {item.desc}</span>
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
              Your Existing Systems · Input Artifacts · Unchanged
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
    { name: "Kratos / SES Adaptive / GS-class C2", funding: "Public / strategic", round: "Fleet C2 incumbents", what: "AI features layered onto SOCC and ground segment. System of record for telemetry and commanding, not a reasoning layer for operator judgment.", color: GREEN },
    { name: "Palantir Foundry / Skywise-class", funding: "Public", round: "Operator data ops", what: "Data integration and analytics across the fleet. Reads telemetry and contracts; doesn't encode senior-controller, procurement, or regulatory judgment.", color: SEAFOAM },
    { name: "Salesforce / SAP / OSS-BSS AI", funding: "Public", round: "CRM / ERP / service ops", what: "Workflow + document AI inside customer, billing, and service systems. No cross-fleet anomaly memory or vendor-precedent loop.", color: BLUE },
    { name: "Generic LLM stacks (OpenAI / Anthropic)", funding: "Mega-cap", round: "In every operator pilot", what: "General reasoning. No ITU/SLA context, no fleet-heritage grounding, no audit-grade trail for regulators or customers.", color: GOLD },
  ];

  const moatLayers = [
    { layer: "AACE v3.1 Specification", desc: "Proprietary context engine: intent-locking, ITU/SLA-aware injection, drift detection. The plumbing every operator-grade AI workflow will need.", icon: <Cpu size={20} /> },
    { layer: "Compounding Fleet Memory", desc: "Anomaly precedent, vendor outcomes, validated SOPs, regulatory feedback — graph deepens satellite-by-satellite and contract-by-contract. Switching cost grows organically.", icon: <Layers size={20} /> },
    { layer: "Audit-Grade Trail by Design", desc: "Every AI output is versioned, traceable, and tied to the source instruction. The default substrate for SLA-, ITU-, and gov-defense-grade AI.", icon: <Network size={20} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>Category Thesis & Moat</p>

        <h2 className="font-black mb-5" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Satcom AI tools surface telemetry and draft reports.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>No one has shipped the operator memory layer that encodes how your senior controllers, procurement leads, and regulatory team actually decide.</span>
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
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Customer Pilot + Strategic Path</p>
              </div>
            </div>
          </div>
          <div className="w-px h-16 shrink-0" style={{ background: `hsl(${TEAL} / 0.2)` }} />
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35 }}>
              Others read telemetry and dashboards.{" "}
              <span style={{ color: `hsl(${TEAL})` }}>LIZA encodes how your senior controllers, procurement leads, and ITU specialists decide.</span>
            </p>
            <p className="mt-1" style={{ fontSize: 17, color: MUTED }}>
              The instruction layer every satcom AI stack will need: SLA tailoring, anomaly precedent, vendor and regulatory feedback, operator-specific standards — versioned, validated, and queryable. Same architecture validated across regulated industries, now being applied to satellite operators.
            </p>
          </div>
        </div>

        {/* Bottom: Market + 3 Moat columns */}
        <div className="flex gap-5">
          {/* Market Size */}
          <div className="flex-1 rounded-2xl border p-5" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Market Size</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "TAM", value: "$10B+", desc: "Satcom operator software & services by 2030 (fleet C2, OSS/BSS, planning, regulatory, CRM/ERP for operators)" },
                { label: "SAM", value: "$2-3B", desc: "AI governance layer across fleet ops, procurement, ITU/spectrum, SLAs, and service operations" },
                { label: "SOM", value: "$80-150M", desc: "EU sovereign-satcom wedge: regional operators + government / defense customers + IFC and broadcast SLAs" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="rounded-xl px-5 py-2.5" style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
                  <div className="flex items-baseline gap-3 mb-0.5">
                    <span className="font-black" style={{ fontSize: 12, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>{label}</span>
                    <span className="font-black" style={{ fontSize: 34, color: TEXT }}>{value}</span>
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.3 }}>{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3" style={{ fontSize: 10.5, color: SUBTLE, lineHeight: 1.35 }}>
              Sources: Euroconsult & NSR satellite-operator software / services reports 2024-2030; ITU & EUSPA market reports. SAM/SOM are LIZA OS estimates of the AI governance and reasoning layer inside these markets.
            </p>
          </div>

          {/* Defensibility — 3 moat layers */}
          {moatLayers.map(({ layer, desc, icon }) => (
            <div key={layer} className="flex-1 rounded-2xl border p-5 flex flex-col justify-center"
              style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: `hsl(${GOLD} / 0.15)`, color: `hsl(${GOLD})` }}>
                {icon}
              </div>
              <p className="font-black mb-2" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>{layer}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08B — STRATEGIC PIVOT
// ═══════════════════════════════════════════════════════════════════════════════

function SlideVerticalization() {
  const rows = [
    { old: "Teams buy one use case because C2, OSS/BSS, and CRM tools trained them to buy point solutions", now: "LIZA creates one governed operator knowledge loop that powers anomaly response, vendor acceptance, ITU filings, and SLA reporting together", color: TEAL },
    { old: "Generic AI tools ignore how senior controllers, procurement leads, and ITU specialists actually work", now: "The experience becomes native to operator roles, SLA / ITU language, and fleet-handover gates", color: GOLD },
    { old: "Anomaly notes and vendor lessons stay static, so every satellite and contract cycle relearns from zero", now: "Fleet, procurement, and regulatory memory is versioned, validated, and reused after every execution", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${GOLD})` }}>Strategic Pivot</p>
        <h2 className="font-black mb-5" style={{ fontSize: 56, color: TEXT, lineHeight: 1.05 }}>
          LIZA is not selling another satcom point tool. <span style={{ color: `hsl(${GOLD})` }}>It is verticalizing the knowledge loop for operators.</span>
        </h2>

        <div className="grid grid-cols-[0.92fr_1.08fr] gap-7 flex-1 min-h-0">
          <div className="rounded-[28px] border p-7 flex flex-col justify-center" style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.05)`, boxShadow: `0 0 70px hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-black tracking-[0.16em] uppercase" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>LIZA OS · Context Layer</p>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: `hsl(${GOLD} / 0.12)`, border: `1px solid hsl(${GOLD} / 0.28)` }}>
                <Shield size={14} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>Your knowledge stays portable</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: `1px solid hsl(${TEAL} / 0.14)` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `hsl(${TEAL} / 0.15)` }}>
                <Brain size={34} style={{ color: `hsl(${TEAL})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 30, color: `hsl(${TEAL})`, lineHeight: 1 }}>The same operating loop</p>
                <p className="font-semibold mt-1" style={{ fontSize: 16, color: MUTED }}>Now explained as the strategic pivot from satcom point software to reusable operator memory across fleet, procurement, and regulatory.</p>
              </div>
            </div>
            {[
              { label: "Define", desc: "Experts encode standards, exceptions, decision logic", icon: <BookOpen size={22} /> },
              { label: "Execute", desc: "AI applies that context inside live workflows", icon: <Zap size={22} /> },
              { label: "Capture", desc: "Anomaly outcomes, vendor lessons, regulatory feedback are structured", icon: <Eye size={22} /> },
              { label: "Update", desc: "Operator memory improves and propagates across the fleet", icon: <RefreshCw size={22} /> },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4 mb-4 last:mb-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>{item.icon}</div>
                <div>
                  <p className="font-black" style={{ fontSize: 24, color: TEXT }}>{i + 1}. {item.label}</p>
                  <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.35 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <div className="grid grid-cols-[1fr_52px_1.2fr] gap-4 items-center">
              <p className="font-black tracking-[0.18em] uppercase text-center" style={{ fontSize: 13, color: `hsl(${RED})` }}>Old software logic</p>
              <div />
              <p className="font-black tracking-[0.18em] uppercase text-center" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>AI-native logic</p>
            </div>
            {rows.map((row) => (
              <div key={row.old} className="grid grid-cols-[1fr_52px_1.2fr] gap-4 items-stretch">
                <div className="rounded-2xl px-5 py-5 flex items-center" style={{ background: `hsl(${RED} / 0.035)`, border: `1px solid hsl(${RED} / 0.12)` }}>
                  <p className="font-bold" style={{ fontSize: 18, color: MUTED, lineHeight: 1.28 }}>{row.old}</p>
                </div>
                <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${row.color})` }} /></div>
                <div className="rounded-2xl px-6 py-5 flex items-center" style={{ background: `hsl(${row.color} / 0.07)`, border: `1.5px solid hsl(${row.color} / 0.2)` }}>
                  <p className="font-black" style={{ fontSize: 21, color: TEXT, lineHeight: 1.24 }}>{row.now}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={TEAL} />
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
      desc: "Upload documents, AI extracts structure. A copilot guides experts to fill what's missing for full AI intelligence.",
      flow: ["Upload existing artifacts", "AI extracts judgment & rules", "Copilot fills the gaps"],
      output: "Versioned playbooks ready",
      color: GOLD,
    },
    {
      num: "02", title: "Govern", icon: <Shield size={28} />,
      desc: "The AACE framework auto-structures knowledge into governed bundles by capability, scope, and domain.",
      flow: ["Auto-classify by capability", "Set scope & ownership", "Version & publish"],
      output: "Governed knowledge graph",
      color: TEAL,
    },
    {
      num: "03", title: "Execute", icon: <Zap size={28} />,
      desc: "Any team member runs AI with full organizational intelligence. Same quality, every time.",
      flow: ["Select protocol", "AI applies your rules", "Output is governed"],
      output: "Expert-quality output",
      color: GREEN,
    },
    {
      num: "04", title: "Evolve", icon: <RefreshCw size={28} />,
      desc: "Every execution feeds back. Drift is detected. Standards improve automatically.",
      flow: ["Track deviations", "Surface patterns", "Update playbooks"],
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
      title: "AEC Industry Vertical",
      subtitle: "Horizontal proof across departments",
      scope: "GC/PM · A&E · Owner",
      color: TEAL,
      outcome: "Same loop validated across 3 departments of one regulated industry",
      metric: "3 / 3",
      metricLabel: "Departments",
      points: [
        "Project memory loop proven across General Contractor, Architecture/Engineering, and Owner/Developer workflows",
        "Strategic distribution path opened through the Nemetschek ecosystem (Bluebeam, Allplan, Graphisoft)",
      ],
      featured: true,
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
        "Encoded senior partner's C-level candidate evaluation judgment",
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
        "800+ audit questions processed through governed, traceable execution",
        "The same audit-grade pattern that GMP, GCP, and PV teams require",
      ],
      featured: false,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <div className="mb-8">
          <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>Horizontal Proof · Vertical Gap</p>
          <h2 className="font-black max-w-[1480px]" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
            The infrastructure is proven horizontally. <span style={{ color: `hsl(${GREEN})` }}>Now we want to vertically integrate into M&A. With a lighthouse acquirer.</span>
          </h2>
          <p className="mt-3" style={{ fontSize: 20, color: MUTED, maxWidth: 1320, lineHeight: 1.45 }}>
            Across AEC departments and adjacent regulated work, the same loop holds: expert judgment must be captured, enforced, and updated. The next milestone for satcom is one operator-grade lighthouse partner — an acquirer like Hispasat, OTP, or a mid-market PE platform — to make this experience native under IC, antitrust, and PMI audit conditions.
          </p>
        </div>

        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-4 gap-5 w-full">
            {cases.map(({ title, subtitle, scope, color, outcome, metric, metricLabel, points, featured }) => (
              <div
                key={title}
                className="rounded-[24px] border px-5 py-5 flex flex-col min-h-[560px] justify-center"
                style={{
                  borderColor: `hsl(${color} / ${featured ? 0.3 : 0.18})`,
                  background: featured
                    ? `linear-gradient(180deg, hsl(${color} / 0.11), hsl(${color} / 0.04))`
                    : `linear-gradient(180deg, hsl(${color} / 0.05), hsl(${color} / 0.02))`,
                  boxShadow: featured ? `0 0 0 2px hsl(${color} / 0.08)` : "none",
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-black" style={{ fontSize: 25, color: TEXT, lineHeight: 1.12 }}>{title}</p>
                    <p className="mt-2" style={{ fontSize: 14, color: `hsl(${color})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {subtitle} · {scope}
                    </p>
                  </div>
                  <div className="rounded-2xl px-4 py-3 text-right shrink-0"
                    style={{ background: `hsl(${color} / 0.1)`, border: `1px solid hsl(${color} / 0.18)` }}>
                    <p className="font-black" style={{ fontSize: 38, color: `hsl(${color})`, lineHeight: 1 }}>{metric}</p>
                    <p className="font-bold mt-1" style={{ fontSize: 12, color: `hsl(${color})`, textTransform: "uppercase", letterSpacing: "0.08em" }}>{metricLabel}</p>
                  </div>
                </div>

                <div className="rounded-xl px-4 py-3 mb-3"
                  style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.12)` }}>
                  <p className="font-bold mb-1" style={{ fontSize: 12, color: `hsl(${color})`, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Outcome
                  </p>
                  <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.28 }}>{outcome}</p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {points.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3"
                      style={{ background: `hsl(${BG === "hsl(0 0% 100%)" ? color : GREEN} / 0.035)` }}>
                      <CheckCircle2 size={17} className="shrink-0 mt-0.5" style={{ color: `hsl(${color})` }} />
                      <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.42 }}>{p}</p>
                    </div>
                  ))}
                </div>
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
      vertical: "Post-Merger Integration", status: "Expansion", color: GREEN,
      icon: <FileText size={24} style={{ color: `hsl(${GREEN})` }} />,
      problem: "The market moves every week, but sector know-how, prior conversations with founders and bankers, and reasons for past passes live in senior heads. Junior analysts inherit fragments.",
      result: "Continuous market memory. Sharper sector briefs. A pipeline that compounds across cycles instead of restarting every quarter.",
      proof: "Adjacent to CRM, deal-tracking, and sourcing workflows",
    },
    {
      vertical: "Post-Merger Integration", status: "Wedge", color: TEAL,
      icon: <Workflow size={24} style={{ color: `hsl(${TEAL})` }} />,
      problem: "Day-1 / Day-100 playbooks, integration trackers, and synergy models live in disconnected PM tools and senior heads. AI cannot reason across them. PMI knowledge dies when the integration team rotates or the deal closes.",
      result: "Unified integration lifecycle. Every AI response grounded in this target's specifics, your PMI standards, and prior integration precedent.",
      proof: "Target embedding path across Smartsheet, ServiceNow, and PMI tooling",
    },
    {
      vertical: "Diligence & Investment Committee", status: "Expansion", color: GOLD,
      icon: <Shield size={24} style={{ color: `hsl(${GOLD})` }} />,
      problem: "Diligence checklists and IC memos drift between deals. Prior-deal precedent evaporates between cycles. New associates inherit fragmented templates and re-discover red flags from scratch.",
      result: "Standard-aware diligence. Living IC memory. Audit-grade artifacts for the IC, the seller, and antitrust regulators, every cycle.",
      proof: "Diligence & IC extension path once PMI and sourcing integrations are in place",
    },
  ];

  const expandInto = [
    { name: "Antitrust & regulatory filings", col: TEAL },
    { name: "IC memos & deal reviews", col: "215 25% 50%" },
    { name: "Carve-outs & divestitures", col: GOLD },
    { name: "Day-1 readiness & cutover", col: GREEN },
    { name: "Synergy tracking & PMO reporting", col: ACCENT },
    { name: "JV, partnerships & strategic stakes", col: "330 70% 55%" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Deal Lifecycle Expansion Path</p>

        <div className="mb-6 flex items-start justify-between gap-8">
          <h2 className="font-black max-w-[1180px]" style={{ fontSize: 56, color: TEXT, lineHeight: 1.02 }}>
            One deal memory layer.{" "}
            <span style={{ color: `hsl(${GREEN})` }}>Every phase of the deal lifecycle.</span>
          </h2>
          <div className="w-[280px] rounded-2xl px-5 py-4 shrink-0"
            style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 11, color: MUTED }}>
              The thesis
            </p>
            <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})`, lineHeight: 1.2 }}>
              The missing connective tissue underneath the M&A AI stack.
            </p>
            <p className="mt-2" style={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
              Current signal: AEC vertical proven across 3 departments; pharma, satcom, and banking verticals in conversation. M&A lighthouse partner being recruited. This conversation is one of the active threads.
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
              The pattern applies to every function
            </p>
            <div className="grid gap-3">
              {expandInto.map(({ name, col }) => (
                <div key={name} className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: `hsl(${col} / 0.05)`, border: `1px solid hsl(${col} / 0.15)` }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: `hsl(${col})` }} />
                  <p className="font-semibold" style={{ fontSize: 16, color: TEXT, lineHeight: 1.2 }}>{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border-2 p-5"
          style={{ borderColor: `hsl(${TEAL} / 0.22)`, background: `hsl(${TEAL} / 0.04)` }}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-black tracking-[0.18em] uppercase mb-2" style={{ fontSize: 11, color: `hsl(${TEAL})` }}>
                Strategic path
              </p>
              <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.2 }}>
                Expansion across the deal & integration lifecycle. Partnership path on the next slide.
              </p>
            </div>
            <div className="rounded-xl px-5 py-4 shrink-0"
              style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.18)` }}>
              <p className="font-black" style={{ fontSize: 18, color: `hsl(${GREEN})`, lineHeight: 1.15 }}>
                Capital + channel + product
              </p>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.35 }}>
                The round works because the commercial journey is joint.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 09B — STRATEGIC PARTNERSHIP PATH
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09Partnership() {
  const ladder = [
    {
      phase: "Month 1",
      title: "30-Day M&A Pilot",
      color: GREEN,
      desc: "Co-design pilot with your corp dev, PMI, or sector-research team. We codify one workflow (live PMI workstream, sector scan, or IC memo template) and ship a measurable delta. Low commitment, fast signal.",
    },
    {
      phase: "Months 2-6",
      title: "Deal Memory Layer",
      color: TEAL,
      desc: "Expand to a second deal or sector: encode senior-partner and PMI-lead judgment, codify recurring red flags and integration patterns, and build the deal memory layer that survives senior turnover.",
    },
    {
      phase: "Months 6-18",
      title: "M&A Standard · Open Canvas",
      color: GOLD,
      desc: "LIZA OS + a lighthouse acquirer jointly define the M&A knowledge standard for the category. Optional strategic stake. Pathway to a reference architecture adopted by other acquirers and PE platforms.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-12">
        <div className="mb-10 text-center">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            M&A Partnership Mechanic
          </p>
          <h2 className="font-black max-w-[1440px] mx-auto" style={{ fontSize: 62, color: TEXT, lineHeight: 1.02 }}>
            An 18-month path from <span style={{ color: `hsl(${TEAL})` }}>30-day pilot</span> to <span style={{ color: `hsl(${GOLD})` }}>M&A standard</span>.
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)_72px_minmax(0,1fr)] gap-4 items-center w-full max-w-[1600px]">
            {ladder.map(({ phase, title, color, desc }, index) => (
              <div key={title} className="contents">
                <div className="rounded-[30px] border px-8 py-10 flex flex-col justify-center min-h-[470px]"
                  style={{ borderColor: `hsl(${color} / 0.2)`, background: `linear-gradient(180deg, hsl(${color} / 0.07), hsl(${color} / 0.03))` }}>
                  <div className="flex flex-col gap-4 text-center">
                    <p className="font-black tracking-[0.16em] uppercase" style={{ fontSize: 13, color: `hsl(${color})` }}>
                      {phase}
                    </p>
                    <p className="font-black" style={{ fontSize: 38, color: TEXT, lineHeight: 1.04 }}>
                      {title}
                    </p>
                    <p style={{ fontSize: 21, color: MUTED, lineHeight: 1.5 }}>
                      {desc}
                    </p>
                  </div>
                </div>
                {index < ladder.length - 1 && (
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, hsl(${color} / 0.35), hsl(${ACCENT} / 0.75))` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={TEAL} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — WHAT'S BUILT (Product is live)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10() {
  const features = [
    {
      layer: "Knowledge Graph", color: ACCENT,
      icon: <Layers size={28} />,
      desc: "Living organizational memory. Versioned, auditable, propagated.",
      screenshot: "/images/product-define-enforce.png",
    },
    {
      layer: "Protocol Workbooks", color: GOLD,
      icon: <Target size={28} />,
      desc: "Model-agnostic AI execution. Group collaboration in one workspace.",
      screenshot: "/images/product-execute-protocol.png",
    },
    {
      layer: "Context Engine (AACE v3.1)", color: GREEN,
      icon: <Workflow size={28} />,
      desc: "Proprietary spec. Intent-locking, knowledge injection. The IP moat.",
      screenshot: "/images/product-mission-control.png",
    },
    {
      layer: "Governance Loop", color: ACCENT,
      icon: <Eye size={28} />,
      desc: "Drift detection, compliance scoring, after-action synthesis.",
      screenshot: "/images/product-oversight.png",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Product Status</p>
        <h2 className="font-bold mb-6" style={{ fontSize: 56, color: TEXT, lineHeight: 1.1 }}>
          The infrastructure is live.{" "}
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
            Guided pilot. Self-serve product. Credit upside.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>The durable model is usage-aligned.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Pricing */}
            <div className="flex-1 flex flex-col gap-4">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Revenue Streams</p>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Platform Base</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Annual infrastructure fee</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                The base fee anchors the knowledge graph, governance layer, and workflow infrastructure inside the account. The next investment phase turns that infrastructure into a repeatable self-serve product surface.
              </p>
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>AI Credits</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>Metered usage</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                Extraction, research, and execution-heavy workflows should be billed on credit consumption. That aligns pricing with customer value while protecting margin as AI inference cost keeps rising.
              </p>
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Guided Kickstart</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>€5,000–15,000</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                The wedge remains a low-friction pilot. We codify one workflow, prove ROI, then productize the experience into self-serve rollout plus platform base and usage.
              </p>
            </div>
          </div>

          {/* Unit economics */}
          <div className="w-[420px] flex flex-col gap-4">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Early Signals → Target Economics</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ACV", value: "€18K", desc: "Current blended value" },
                { label: "CAC", value: "€3K", desc: "Diagnostic-to-pilot funnel" },
                { label: "LTV:CAC", value: "6:1", desc: "Target at steady state" },
                { label: "NRR", value: ">120%", desc: "Expansion via base + credits" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="rounded-xl px-5 py-5 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <p className="font-black" style={{ fontSize: 36, color: TEXT }}>{value}</p>
                  <p className="font-bold mt-1" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{label}</p>
                  <p style={{ fontSize: 13, color: MUTED }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 17, color: `hsl(${ACCENT})` }}>Revenue Logic</p>
              <div className="flex flex-col gap-2">
                {[
                  "Diagnostic identifies workflow pain and creates urgency",
                  "Guided kickstart proves one workflow with minimal adoption friction",
                  "Self-serve UX turns expert workflows into repeatable product usage",
                  "Platform base anchors the knowledge system inside the account",
                  "Credits scale revenue as AI execution becomes mission-critical",
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
        "Your team selects one high-value workflow (e.g. live PMI workstream, sector scan, IC memo template, antitrust prep)",
        "Platform guides structured capture from 2-3 senior partners, integration leads, or sector specialists",
        "LIZA auto-generates IC- and antitrust-aware playbooks grounded in your standards, prior deals, and integration precedent",
      ],
      output: "3-5 dealmaker-grade playbooks ready",
    },
    {
      week: "Week 2-3",
      title: "Execute",
      icon: <Zap size={24} />,
      color: SEAFOAM,
      actions: [
        "Corp dev / PMI team self-serves: run playbooks against live deals, integrations, and sector scans",
        "Real deals, real integrations, real audit-grade deliverables",
        "Platform tracks drift and captures feedback automatically",
      ],
      output: "Measurable quality delta: senior partner vs. AI-with-LIZA vs. AI-alone",
    },
    {
      week: "Week 4",
      title: "Prove",
      icon: <TrendingUp size={24} />,
      color: GREEN,
      actions: [
        "Automated review: hours saved per memo, IC rework reduced, integration risk cut",
        "Deal memory self-improves from every execution; full traceability preserved",
        "Business case for portfolio-wide rollout across deals and integrations with real numbers",
      ],
      output: "ROI proven. Expansion decision with audit-grade data.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${GREEN})` }}>Go-To-Market Wedge</p>

          <h2 className="font-black mb-6" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          The wedge is one workflow. The product is the operator-native knowledge loop.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Co-built with a lighthouse acquirer.</span>
        </h2>

        <div className="flex gap-6 flex-1 min-h-0">
          {phases.map((p) => (
            <div key={p.week} className="flex-1 rounded-[26px] border flex flex-col overflow-hidden"
              style={{ borderColor: `hsl(${p.color} / 0.25)`, background: `linear-gradient(180deg, hsl(${p.color} / 0.05), hsl(${p.color} / 0.025))` }}>
              <div className="px-7 py-6 flex items-center gap-4" style={{ borderBottom: `1px solid hsl(${p.color} / 0.15)` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${p.color} / 0.12)`, color: `hsl(${p.color})` }}>
                  {p.icon}
                </div>
                <div>
                  <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${p.color})` }}>{p.week}</p>
                  <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1.05 }}>{p.title}</p>
                </div>
              </div>

              <div className="flex-1 px-7 py-6 flex flex-col gap-4 justify-between">
                {p.actions.map((a, j) => (
                  <div key={j} className="flex items-start gap-3 rounded-xl px-4 py-4 flex-1"
                    style={{ background: `hsl(${p.color} / 0.055)`, border: `1px solid hsl(${p.color} / 0.1)` }}>
                    <span className="font-bold shrink-0 mt-0.5" style={{ fontSize: 18, color: `hsl(${p.color})` }}>→</span>
                    <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{a}</p>
                  </div>
                ))}
              </div>

              <div className="px-7 py-5" style={{ background: `hsl(${p.color} / 0.07)`, borderTop: `1px solid hsl(${p.color} / 0.12)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 12, color: `hsl(${p.color})`, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Output
                </p>
                <p className="font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>
                  {p.output}
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
            { metric: "Operator-native", label: "Product direction", sub: "Role, workflow, and IC / antitrust audit fit" },
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
  const founders = [
    { name: "István Boscha", role: "Product Vision & Capital-Efficient CEO", bio: "Founder of Aliz.ai, a Google Cloud Professional Services Partner. 15 years in AI transformation globally.", photo: istvanPhoto, initials: "IB", color: ACCENT },
    { name: "Kristóf Éger", role: "Enterprise Narrative & Go-to-Market", bio: "AI-driven business strategist, embedding AI into decision-making workflows.", photo: kristofPhoto, initials: "KÉ", color: GREEN },
    { name: "Zoltán Kauker", role: "Scalable AI Architecture & Enterprise Security", bio: "Deep-tech AI and data engineering expert, leading AI-driven decision systems.", photo: zoltanPhoto, initials: "ZK", color: GOLD },
  ];


  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Team</p>
        <h2 className="font-bold mb-6" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Built by practitioners.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Validated by enterprise leaders.</span>
        </h2>

        <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})`, letterSpacing: "0.15em", textTransform: "uppercase" }}>Founding Team</p>
        <div className="grid grid-cols-3 gap-7 mb-8">
          {founders.map((f) => (
            <div key={f.name} className="flex flex-col gap-4 rounded-2xl border p-7"
              style={{ borderColor: `hsl(${f.color} / 0.2)`, background: `hsl(${f.color} / 0.04)` }}>
              <div className="flex items-center gap-4">
                {f.photo ? (
                  <img src={f.photo} alt={f.name} className="w-16 h-16 rounded-full object-cover shrink-0"
                    style={{ border: `2px solid hsl(${f.color} / 0.4)` }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shrink-0"
                    style={{ background: `hsl(${f.color} / 0.15)`, color: `hsl(${f.color})`, border: `2px solid hsl(${f.color} / 0.4)` }}>
                    {f.initials}
                  </div>
                )}
                <div>
                  <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>{f.name}</p>
                  <p style={{ fontSize: 18, color: `hsl(${f.color})` }}>{f.role}</p>
                </div>
              </div>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{f.bio}</p>
            </div>
          ))}
        </div>

      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK (€3M + milestones + use of funds)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-8">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${GREEN} / 0.8)` }}>Two-Door Conversation</p>
          <h2 className="font-black mb-3" style={{ fontSize: 72, color: TEXT, lineHeight: 1.05 }}>Pilot first.<br/><span style={{ color: `hsl(${TEAL})` }}>Strategic stake optional.</span></h2>
          <p style={{ fontSize: 24, color: MUTED }}>
            Door 1: 30-day M&A pilot &nbsp;·&nbsp; Door 2: co-define the M&A standard (open canvas) &nbsp;·&nbsp; Sequence: customer first, strategic stake later if it fits
          </p>
        </div>

        {/* Use of funds */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "30-Day M&A Pilot", pct: "Phase 1", amt: "€25-50K", desc: "Codify one operator-critical workflow end-to-end (anomaly, handover, vendor acceptance, or ITU filing). Measurable delta in 30 days. No long commitment.", color: ACCENT },
            { label: "Deal Memory Rollout", pct: "Phase 2", amt: "Annual base + credits", desc: "Expand across the deal and integration cycle. Platform base anchors deal memory; credits scale with execution.", color: GREEN },
            { label: "M&A Standard · Open Canvas", pct: "Phase 3", amt: "Strategic stake", desc: "Optional: a lighthouse operator co-defines the operator-knowledge standard and takes a strategic position in the satcom vertical of LIZA OS.", color: GOLD },
            { label: "European M&A Standard", pct: "Roadmap", amt: "Joint GTM", desc: "Use the joint case study to open doors across regional acquirers, PE platforms, and corporate dev teams.", color: MUTED },
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
            { month: "Month 1", target: "30-day pilot live", milestone: "One workflow codified end-to-end. Measurable hours-saved and quality delta delivered to a senior partner or head of integration.", color: TEAL },
            { month: "Months 2-6", target: "Deal memory layer", milestone: "Expansion to a second deal or integration. Deal memory captured. Onboarding time for new associates and PMI leads measurably down.", color: SEAFOAM },
            { month: "Months 6-18", target: "M&A standard live", milestone: "Joint case study with the lighthouse acquirer. Open-canvas / strategic-stake conversation opens (optional). Doors open to other acquirers, PE, and corp dev teams.", color: MINT },
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
            LIZA has built the horizontal knowledge loop.{" "}
            <strong style={{ color: `hsl(${TEAL})` }}>A lighthouse acquirer can turn it into the dealmaker-grade control layer for European M&A.</strong>
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


// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE — THE CONTEXT GAP, EXEMPLIFIED (Satellite Communications)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideContextGapExemplified() {
  const annotations = [
    {
      n: 1,
      nature: "JUST CHANGED",
      title: "Target lost a top-3 customer last week",
      body: "The target's largest German customer issued a non-renewal notice on Friday. The IC memo still cites the trailing-twelve-month revenue as committed. The IC sits in three hours.",
    },
    {
      n: 2,
      nature: "OPEN ISSUE",
      title: "Open antitrust query from BNetzA",
      body: "The German competition authority filed a follow-up question two weeks ago. Not yet answered. The memo cannot claim 'standard clearance pathway' until that closes.",
    },
    {
      n: 3,
      nature: "CONTRADICTION",
      title: "Two synergy models disagree",
      body: "The deal team's synergy model assumes one cost base. The integration team's Day-100 plan references another. Both retrievable. Only one matches what was committed in the LOI.",
    },
    {
      n: 4,
      nature: "UNWRITTEN RULE",
      title: "Head of M&A blocks blanket synergy claims",
      body: "When the target carries customer concentration risk, the head of M&A always requires a per-customer revenue breakdown. Memos without it have been pulled at IC. Nobody wrote the rule down.",
    },
  ];

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
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              The Context Gap, exemplified
            </p>
            <h2 className="font-black" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05 }}>
              The mission ops brief AI drafted reads cleanly.{' '}
              <span style={{ color: `hsl(${WARM})` }}>Every highlighted phrase is wrong.</span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 shrink-0 ml-8 px-4 py-2 rounded-full"
            style={{ border: `1.5px solid hsl(${WARM} / 0.35)`, background: `hsl(${WARM} / 0.06)` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${WARM})` }} />
            <span className="font-bold tracking-[0.18em] uppercase" style={{ fontSize: 11, color: `hsl(${WARM})` }}>
              Live signals · not in any indexed document
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid gap-7" style={{ gridTemplateColumns: "7fr 5fr" }}>
          <div className="relative rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: BG,
              border: `1px solid hsl(${TEAL} / 0.20)`,
              boxShadow: `0 18px 60px -24px hsl(222 30% 20% / 0.18), 0 2px 0 hsl(${TEAL} / 0.06)`,
            }}>
            <div className="px-7 py-3 flex items-center gap-2 border-b"
              style={{ borderColor: `hsl(${TEAL} / 0.12)`, background: `hsl(${TEAL} / 0.03)` }}>
              <FileText size={14} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold tracking-[0.14em] uppercase" style={{ fontSize: 10.5, color: `hsl(${TEAL})` }}>
                Corporate Development · Project Atlas · IC memo
              </span>
              <div className="flex items-center gap-2 ml-3 pl-3 border-l" style={{ borderColor: `hsl(${TEAL} / 0.18)` }}>
                <Sparkles size={14} style={{ color: `hsl(${ACCENT})` }} />
                <span className="font-bold tracking-[0.14em] uppercase" style={{ fontSize: 10.5, color: `hsl(${ACCENT})` }}>
                  Drafted by AI · ready for review
                </span>
              </div>
              <span className="ml-auto font-mono" style={{ fontSize: 10.5, color: MUTED }}>
                IC Memo · current cycle
              </span>
            </div>

            <div className="px-9 pt-6 pb-3" style={{ borderBottom: `1px dashed hsl(${TEAL} / 0.18)` }}>
              <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                <div className="mt-1"><span style={{ color: MUTED, width: 90, display: "inline-block" }}>Target</span>
                  <span style={{ color: TEXT, fontWeight: 800, fontSize: 16 }}>Project Atlas · DACH SaaS</span>
                  <span style={{ color: MUTED }}> · €120M ARR · founder-led</span>
                </div>
                <div><span style={{ color: MUTED, width: 90, display: "inline-block" }}>Sponsor</span>
                  <span style={{ color: TEXT, fontWeight: 600 }}>Head of M&amp;A · IC review</span>
                </div>
                <div><span style={{ color: MUTED, width: 90, display: "inline-block" }}>Audience</span>
                  <span style={{ color: TEXT, fontWeight: 600 }}>Investment committee · GC · integration lead</span>
                </div>
              </div>
            </div>

            <div className="flex-1 px-9 py-7"
              style={{ fontSize: 20, color: TEXT, lineHeight: 1.7, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              <p className="mb-5">Revenue projections are anchored on <Mark n={1}>the target&apos;s committed customer base</Mark> as captured in the data room.</p>
              <p className="mb-5">Antitrust clearance follows <Mark n={2}>the standard pathway for transactions of this size</Mark>.</p>
              <p className="mb-5">Cost synergies were modelled using <Mark n={3}>our standard SaaS integration playbook</Mark>.</p>
              <p style={{ color: MUTED }}><Mark n={4}>Deal economics are expected to remain within IC thresholds.</Mark></p>
            </div>

            <div className="px-9 py-3.5 flex items-center gap-3"
              style={{ borderTop: `1px solid hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.06)` }}>
              <AlertTriangle size={18} style={{ color: `hsl(${WARM})` }} />
              <p className="font-black" style={{ fontSize: 15, color: TEXT }}>
                IC-ready? No. Re-work loop. Reputation risk with the seller.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-black tracking-[0.18em] uppercase" style={{ fontSize: 14, color: `hsl(${WARM})` }}>
                What AI couldn&apos;t see
              </p>
              <p className="font-semibold" style={{ fontSize: 13, color: MUTED }}>
                Lives in deal-room threads, prior-IC memos, and senior partners' heads.
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
                    <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.5 }}>{a.body}</p>
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
                <p style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }}>
                  CIM. Data room. SPA template. Comp tables. Prior memos.
                </p>
                <p className="mt-1 font-semibold" style={{ fontSize: 12, color: MUTED }}>
                  Indexable. RAG-friendly. Insufficient for an IC or an antitrust regulator.
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
                <p style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: "An <strong>Organizational Intelligence</strong> layer that captures live deal state, open antitrust queries, and head-of-M&A conventions and resolves them at memo-write time." }} />
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
// SLIDE — PEOPLE AS NODES (Satellite Communications)
// ═══════════════════════════════════════════════════════════════════════════════

function SlidePeopleAsNodes() {
  const team = [
    { name: "Eva", role: "Head of M&A" },
    { name: "Raj", role: "Diligence" },
    { name: "Maria", role: "PMI Lead" },
    { name: "Anna", role: "GC / Antitrust" },
    { name: "Tom", role: "Sector Analyst" },
  ];
  const cx = 200, cy = 200, r = 130;
  const positions = team.map((p, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / team.length;
    return { ...p, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const edges = [
    { a: 0, b: 1, w: 3.5 },
    { a: 1, b: 2, w: 1.2 },
    { a: 2, b: 3, w: 2.4 },
    { a: 3, b: 4, w: 1.8 },
    { a: 4, b: 0, w: 1.0 },
    { a: 0, b: 2, w: 2.8 },
    { a: 1, b: 3, w: 1.5 },
    { a: 2, b: 4, w: 2.2 },
  ];

  const artifacts = [
    { label: "IC memos", x: 60, y: 60 },
    { label: "SPA template", x: 240, y: 50 },
    { label: "Synergy model", x: 80, y: 170 },
    { label: "Antitrust", x: 240, y: 180 },
    { label: "Data room", x: 50, y: 280 },
    { label: "PMI tracker", x: 240, y: 300 },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Shift
        </p>
        <h2 className="font-black mb-6" style={{ fontSize: 52, color: TEXT, lineHeight: 1.04 }}>
          From documents, to static agents, to a{' '}
          <span style={{ color: `hsl(${GREEN})` }}>living Organizational Intelligence.</span>
        </h2>

        <div className="flex-1 min-h-0 grid grid-cols-3 gap-6">
          <div className="rounded-2xl border-2 flex flex-col overflow-hidden"
            style={{ borderColor: `hsl(${RED} / 0.30)`, background: `hsl(${RED} / 0.03)` }}>
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: `hsl(${RED} / 0.20)`, background: `hsl(${RED} / 0.06)` }}>
              <span className="font-black w-7 h-7 rounded-full flex items-center justify-center"
                style={{ fontSize: 13, color: BG, background: `hsl(${RED})` }}>1</span>
              <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 14, color: `hsl(${RED})` }}>Document Era</p>
            </div>
            <div className="px-5 pt-5">
              <p className="font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>
                IC memos and SPAs define what. Heads of M&A, GCs, and PMI leads define how.
              </p>
              <p className="font-semibold mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
                Documents are versioned. Judgment is not. Nothing scales and AI inherits none of it.
              </p>
            </div>
            <div className="flex-1 px-4 py-3 mt-3 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <svg className="w-full h-full" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
                {artifacts.map((a, i) => (
                  <g key={i}>
                    <rect x={a.x} y={a.y} width="80" height="42" rx="6"
                      fill={`hsl(${RED} / 0.08)`} stroke={`hsl(${RED} / 0.35)`} strokeWidth="1" />
                    <text x={a.x + 40} y={a.y + 27} textAnchor="middle"
                      style={{ fontSize: 12, fontWeight: 700, fill: TEXT }}>{a.label}</text>
                  </g>
                ))}
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

          <div className="rounded-2xl border-2 flex flex-col overflow-hidden"
            style={{ borderColor: `hsl(${TEAL} / 0.30)`, background: `hsl(${TEAL} / 0.03)` }}>
            <div className="px-5 py-3 border-b flex items-center gap-2"
              style={{ borderColor: `hsl(${TEAL} / 0.20)`, background: `hsl(${TEAL} / 0.06)` }}>
              <span className="font-black w-7 h-7 rounded-full flex items-center justify-center"
                style={{ fontSize: 13, color: BG, background: `hsl(${TEAL})` }}>2</span>
              <p className="font-black tracking-[0.14em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Agent Era</p>
            </div>
            <div className="px-5 pt-5">
              <p className="font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>
                Agents are statically defined snapshots in time.
              </p>
              <p className="font-semibold mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
                Each role gets wrapped as an agent. Frozen the moment policy shifts or the world changes. Re-prompt forever.
              </p>
            </div>
            <div className="flex-1 px-4 py-3 mt-3 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ background: BG, border: `1px solid hsl(${TEAL} / 0.15)` }}>
              <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                {artifacts.map((a, i) => (
                  <rect key={`bg-${i}`} x={a.x * 1.05 + 10} y={a.y * 1.05 + 10} width="60" height="32" rx="4"
                    fill={`hsl(${TEAL} / 0.03)`} stroke={`hsl(${TEAL} / 0.15)`} strokeWidth="0.8"
                    strokeDasharray="2 2" />
                ))}
                {positions.map((p, i) => (
                  <g key={i}>
                    <rect x={p.x - 40} y={p.y - 40} width="80" height="80" rx="6"
                      fill={`hsl(${TEAL} / 0.05)`} stroke={`hsl(${TEAL} / 0.55)`} strokeWidth="1.2"
                      strokeDasharray="4 3" />
                    <circle cx={p.x} cy={p.y} r="26" fill={BG}
                      stroke={`hsl(${TEAL})`} strokeWidth="2" />
                    <text x={p.x} y={p.y - 2} textAnchor="middle"
                      style={{ fontSize: 12, fontWeight: 800, fill: TEXT }}>{p.name}</text>
                    <text x={p.x} y={p.y + 11} textAnchor="middle"
                      style={{ fontSize: 7.5, fontWeight: 700, fill: `hsl(${TEAL})`, letterSpacing: 0.5 }}>
                      {p.role.toUpperCase()}
                    </text>
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
              <p className="font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>
                The fluid, semantic knowledge of the company is the substrate.
              </p>
              <p className="font-semibold mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
                Define how the org thinks. Agents become downstream surfaces. AI inherits standards, exceptions, and intent, live.
              </p>
            </div>
            <div className="flex-1 px-4 py-3 mt-3 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ background: BG, border: `1px solid hsl(${GREEN} / 0.20)` }}>
              <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="sat-aiHaloGreen" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                    <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                  </radialGradient>
                  <radialGradient id="sat-contextField" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`hsl(${GREEN} / 0.10)`} />
                    <stop offset="70%" stopColor={`hsl(${TEAL} / 0.06)`} />
                    <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                  </radialGradient>
                </defs>

                <circle cx="200" cy="200" r="180" fill="url(#sat-contextField)" />

                {(() => {
                  const edgeLabels: Record<string, string> = {"0-1":"deal posture","0-2":"integration plan","2-3":"antitrust strategy","2-4":"sector memory"};
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

                {edges.map((e, i) => {
                  const a = positions[e.a], b = positions[e.b];
                  return (
                    <line key={`e-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={`hsl(${TEAL} / ${0.25 + e.w * 0.12})`} strokeWidth={e.w} />
                  );
                })}

                {edges.filter(e => e.w >= 2.4).map((e, i) => {
                  const a = positions[e.a], b = positions[e.b];
                  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                  return (
                    <circle key={`pulse-${i}`} cx={mx} cy={my} r="3.5"
                      fill={`hsl(${GREEN})`} stroke={BG} strokeWidth="1.5" />
                  );
                })}

                {positions.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="48" fill="url(#sat-aiHaloGreen)" />
                    <circle cx={p.x} cy={p.y} r="32" fill={BG}
                      stroke={`hsl(${TEAL})`} strokeWidth="2.5" />
                    <text x={p.x} y={p.y - 2} textAnchor="middle"
                      style={{ fontSize: 12, fontWeight: 800, fill: TEXT }}>{p.name}</text>
                    <text x={p.x} y={p.y + 11} textAnchor="middle"
                      style={{ fontSize: 7.5, fontWeight: 700, fill: `hsl(${TEAL})`, letterSpacing: 0.5 }}>
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

        <div className="mt-5 rounded-xl border px-8 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `hsl(${GREEN} / 0.06)` }}>
          <Sparkles size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }}>
            Documents froze the policy. Agents froze the role. <span style={{ color: `hsl(${GREEN})` }}>Organizational Intelligence keeps how the company decides alive.</span>
          </p>
        </div>
      </div>
      <SlideBar from={TEAL} to={GREEN} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE — ORGANIZATIONAL INTELLIGENCE UNPACKED (Satellite Communications)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideOrgIntelligence() {
  const facets = [
    {
      icon: <Brain size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Senior Partner Judgment",
      body: "How experienced heads of M&A, GCs, and PMI directors actually decide: which red flag matters, when to walk, when to pay up, when a synergy is real. Today: trapped in heads.",
    },
    {
      icon: <Users size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Seller & Founder Memory",
      body: "How this target was approached: prior conversations with the founder, banker history, what was hinted in the last meeting, who owns each open thread.",
    },
    {
      icon: <RefreshCw size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Moving Markets & Standards",
      body: "Sector dynamics shift weekly, comp tables move, antitrust thresholds change, accounting standards update. Context that drifted last quarter and rewrote the right answer for today's memo.",
    },
    {
      icon: <Target size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Investment Strategy",
      body: "What the IC locked this cycle, which sectors are priority, which targets get first look, which capital is reserved. Most AI never gets told.",
    },
    {
      icon: <Globe size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Regulator & Market Signals",
      body: "Antitrust authorities, BaFin / FCA / SEC actions, competitor M&A moves, sector news. Facts from outside the firm the team must react to.",
    },
    {
      icon: <GitBranch size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Decisions & Exceptions",
      body: "Sign-off thresholds, open antitrust queries, deal-specific carve-outs, the rules that override the rules. The connective tissue between policy and the live deal.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col h-full px-20 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>
          Organizational Intelligence — Unpacked
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 50, color: TEXT, lineHeight: 1.04 }}>
          What actually lives inside{' '}
          <span style={{ color: `hsl(${GREEN})` }}>the substrate.</span>
        </h2>
        <p className="font-medium mb-7" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
          The 90% the iceberg points at. Up close, it is six interacting layers. An M&A knowledge graph is what holds them together.
        </p>

        <div className="flex-1 min-h-0 grid gap-8 items-center" style={{ gridTemplateColumns: "5fr 7fr" }}>
          <div className="relative h-full rounded-2xl border-2 flex items-center justify-center"
            style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `linear-gradient(135deg, hsl(${TEAL} / 0.04), hsl(${GREEN} / 0.06))` }}>
            <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="sat-oiHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                </radialGradient>
              </defs>
              <circle cx="250" cy="250" r="220" fill="url(#sat-oiHalo)" />
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
                    <circle cx={x} cy={y} r="22" fill={BG}
                      stroke={`hsl(${GREEN})`} strokeWidth="2" />
                    <circle cx={x} cy={y} r="6" fill={`hsl(${GREEN})`} />
                  </g>
                );
              })}
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
                  <p className="font-black" style={{ fontSize: 18, color: TEXT }}>{f.title}</p>
                </div>
                <p className="font-medium" style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.45 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border px-8 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `hsl(${GREEN} / 0.06)` }}>
          <Sparkles size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: "This substrate looks different in PE diligence than in corporate PMI than in sector scanning. <strong>Which is why execution has to be sub-vertical.</strong>" }} />
        </div>
      </div>
      <SlideBar from={TEAL} to={GREEN} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "The Context Gap", component: <Slide02 /> },
  { id: 3, title: "The Context Gap, Exemplified", component: <SlideContextGapExemplified /> },
  { id: 4, title: "Where Missing Context Shows Up in M&A", component: <Slide03 /> },
  { id: 5, title: "What Missing Context Costs in M&A", component: <Slide04Cost /> },
  { id: 6, title: "Early Validation", component: <Slide08 /> },
  { id: 7, title: "Why Now", component: <SlideWhyNow /> },
  { id: 8, title: "The Context Layer", component: <Slide05 /> },
  { id: 9, title: "People as Nodes", component: <SlidePeopleAsNodes /> },
  { id: 10, title: "Organizational Intelligence", component: <SlideOrgIntelligence /> },
  { id: 11, title: "Strategic Pivot", component: <SlideVerticalization /> },
  { id: 12, title: "Category Thesis & Moat", component: <Slide06 /> },
  { id: 13, title: "Expansion Path", component: <Slide09 /> },
  { id: 14, title: "Strategic Partnership Path", component: <Slide09Partnership /> },
  { id: 15, title: "Shape of the Company", component: <SlideShape /> },
  { id: 16, title: "What's Built", component: <Slide10 /> },
  { id: 17, title: "Business Model", component: <Slide11 /> },
  { id: 18, title: "30-Day Challenge", component: <SlideExecutionChallenge /> },
  { id: 19, title: "Team", component: <Slide12 /> },
  { id: 20, title: "Two-Door Partnership Path", component: <Slide13 /> },
  { id: 21, title: "Appendix", component: <SlideAppendixDivider /> },
  { id: 22, title: "Appendix: Architecture", component: <SlideArchitecture /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function StrategyOfficeDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Strategy-Office-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20" style={{ background: showNav ? "transparent" : undefined }}>
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20" style={{ background: showNav ? "transparent" : undefined }}>
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg" style={{ background: showNav ? "transparent" : undefined }}>
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS · M&A Strategic Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Strategy-Office-Deck" slideCount={SLIDES.length} />
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS · M&A Strategic Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Strategy-Office-Deck" slideCount={SLIDES.length} />
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

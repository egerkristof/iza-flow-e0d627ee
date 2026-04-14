import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, CheckCircle2, DollarSign,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
  Layers, Eye, Workflow, Lightbulb, Award, Database, Brain, Cpu, Clock, Rocket, FileText,
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
const DARK_BG = "hsl(200 30% 6%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(200 15% 60%)";
const DARK_SUBTLE = "hsl(200 10% 45%)";
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

function DarkGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.08]" style={{
      backgroundImage: `linear-gradient(hsl(200 15% 20%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 15% 20%) 1px, transparent 1px)`,
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
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
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

        <h1 className="font-black mb-6" style={{ fontSize: 82, lineHeight: 1.05, color: DARK_TEXT }}>
          The Operating System for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organizations.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          The infrastructure layer that turns organizational intelligence<br />
          into <span style={{ color: `hsl(${TEAL})` }}>governed AI execution.</span>
        </p>

        <p style={{ fontSize: 20, color: DARK_SUBTLE }}>
          Confidential &nbsp;·&nbsp; €1.5M Seed &nbsp;·&nbsp; Pre-Revenue
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE INSTRUCTION GAP
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
          The Instruction Gap
        </p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.08 }}>
          Companies have inputs. AI generates outputs.<br />
          <span style={{ color: `hsl(${WARM})` }}>What is missing is the system for human intelligence in between.</span>
        </h2>

        {/* Instruction gap map */}
        <div className="flex-1 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 1400 560" style={{ maxWidth: 1400, maxHeight: 560 }}>
            <defs>
              <linearGradient id="instruction-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={`hsl(${TEAL})`} stopOpacity="0.6" />
                <stop offset="50%" stopColor={`hsl(${WARM})`} stopOpacity="0.7" />
                <stop offset="100%" stopColor={`hsl(${GREEN})`} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Top journey bar */}
            <line x1="220" y1="72" x2="1180" y2="72" stroke="url(#instruction-line)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <circle cx="220" cy="72" r="7" fill={`hsl(${TEAL})`} />
            <circle cx="1180" cy="72" r="7" fill={`hsl(${GREEN})`} />
            <polygon points="1178,66 1194,72 1178,78" fill={`hsl(${GREEN})`} />

            <g>
              <rect x="70" y="44" width="250" height="54" rx="16" fill={`hsl(${TEAL})`} fillOpacity="0.12" stroke={`hsl(${TEAL})`} strokeOpacity="0.32" />
              <text x="195" y="66" textAnchor="middle" fill={`hsl(${TEAL})`} fontSize="13" fontWeight="900" letterSpacing="0.14em">START HERE</text>
              <text x="195" y="86" textAnchor="middle" fill={DARK_TEXT} fontSize="16" fontWeight="800">Companies already have inputs</text>
            </g>

            <g>
              <rect x="458" y="45" width="166" height="50" rx="25" fill={`hsl(${WARM})`} fillOpacity="0.12" stroke={`hsl(${WARM})`} strokeOpacity="0.34" />
              <text x="541" y="75" textAnchor="middle" fill={`hsl(${WARM})`} fontSize="15" fontWeight="900" letterSpacing="0.08em">WORK GETS MESSY</text>
            </g>

            <g>
              <rect x="700" y="45" width="194" height="50" rx="25" fill={`hsl(${WARM})`} fillOpacity="0.12" stroke={`hsl(${WARM})`} strokeOpacity="0.34" />
              <text x="797" y="75" textAnchor="middle" fill={`hsl(${WARM})`} fontSize="15" fontWeight="900" letterSpacing="0.08em">EXPERTS MAKE DECISIONS</text>
            </g>

            <g>
              <rect x="1080" y="44" width="250" height="54" rx="16" fill={`hsl(${GREEN})`} fillOpacity="0.12" stroke={`hsl(${GREEN})`} strokeOpacity="0.32" />
              <text x="1205" y="66" textAnchor="middle" fill={`hsl(${GREEN})`} fontSize="13" fontWeight="900" letterSpacing="0.14em">END HERE</text>
              <text x="1205" y="86" textAnchor="middle" fill={DARK_TEXT} fontSize="16" fontWeight="800">AI already generates outputs</text>
            </g>

            {/* Input box */}
            <rect x="70" y="138" width="280" height="302" rx="28" fill={`hsl(${TEAL})`} fillOpacity="0.1" stroke={`hsl(${TEAL})`} strokeWidth="2.5" strokeOpacity="0.42" />
            <text x="210" y="186" textAnchor="middle" fill={`hsl(${TEAL})`} fontSize="30" fontWeight="900">Input Artifacts</text>
            <text x="210" y="212" textAnchor="middle" fill={DARK_MUTED} fontSize="14" fontWeight="800" letterSpacing="0.08em">COMPANIES ALREADY HAVE THESE</text>

            {[
              { label: "SOPs", x: 145, y: 266, width: 74 },
              { label: "Requirements", x: 270, y: 266, width: 126 },
              { label: "Policies", x: 145, y: 318, width: 90 },
              { label: "Templates", x: 270, y: 318, width: 104 },
              { label: "Data", x: 145, y: 370, width: 74 },
              { label: "Records", x: 270, y: 370, width: 92 },
            ].map((item) => (
              <g key={item.label}>
                <rect
                  x={item.x - item.width / 2}
                  y={item.y - 17}
                  width={item.width}
                  height="34"
                  rx="17"
                  fill={`hsl(${TEAL})`}
                  fillOpacity="0.18"
                  stroke={`hsl(${TEAL})`}
                  strokeOpacity="0.12"
                />
                <text x={item.x} y={item.y + 5} textAnchor="middle" fill={DARK_TEXT} fontSize="14" fontWeight="800">{item.label}</text>
              </g>
            ))}

            {/* Output box */}
            <rect x="1050" y="138" width="280" height="302" rx="28" fill={`hsl(${GREEN})`} fillOpacity="0.1" stroke={`hsl(${GREEN})`} strokeWidth="2.5" strokeOpacity="0.42" />
            <text x="1190" y="186" textAnchor="middle" fill={`hsl(${GREEN})`} fontSize="30" fontWeight="900">Output Artifacts</text>
            <text x="1190" y="212" textAnchor="middle" fill={DARK_MUTED} fontSize="14" fontWeight="800" letterSpacing="0.08em">AI ALREADY GENERATES THESE</text>

            {[
              { label: "Reports", x: 1125, y: 266, width: 92 },
              { label: "Proposals", x: 1250, y: 266, width: 106 },
              { label: "Decisions", x: 1125, y: 318, width: 102 },
              { label: "Deliverables", x: 1250, y: 318, width: 122 },
              { label: "Actions", x: 1125, y: 370, width: 86 },
              { label: "Answers", x: 1250, y: 370, width: 92 },
            ].map((item) => (
              <g key={item.label}>
                <rect
                  x={item.x - item.width / 2}
                  y={item.y - 17}
                  width={item.width}
                  height="34"
                  rx="17"
                  fill={`hsl(${GREEN})`}
                  fillOpacity="0.18"
                  stroke={`hsl(${GREEN})`}
                  strokeOpacity="0.12"
                />
                <text x={item.x} y={item.y + 5} textAnchor="middle" fill={DARK_TEXT} fontSize="14" fontWeight="800">{item.label}</text>
              </g>
            ))}

            {/* Flow wedges */}
            <polygon
              points="350,289 520,165 520,413"
              fill={`hsl(${TEAL})`}
              fillOpacity="0.05"
              stroke={`hsl(${TEAL})`}
              strokeWidth="2"
              strokeOpacity="0.24"
              strokeDasharray="7 5"
              strokeLinejoin="round"
            />
            <polygon
              points="520,165 660,289 520,413"
              fill={`hsl(${WARM})`}
              fillOpacity="0.05"
              stroke={`hsl(${WARM})`}
              strokeWidth="2"
              strokeOpacity="0.32"
              strokeDasharray="7 4"
              strokeLinejoin="round"
            />
            <polygon
              points="740,289 880,165 880,413"
              fill={`hsl(${WARM})`}
              fillOpacity="0.05"
              stroke={`hsl(${WARM})`}
              strokeWidth="2"
              strokeOpacity="0.32"
              strokeDasharray="7 4"
              strokeLinejoin="round"
            />
            <polygon
              points="880,165 1050,289 880,413"
              fill={`hsl(${GREEN})`}
              fillOpacity="0.05"
              stroke={`hsl(${GREEN})`}
              strokeWidth="2"
              strokeOpacity="0.24"
              strokeDasharray="7 5"
              strokeLinejoin="round"
            />

            {/* Messy intelligence field */}
            <ellipse cx="700" cy="289" rx="210" ry="156" fill={`hsl(${WARM})`} fillOpacity="0.05" stroke={`hsl(${WARM})`} strokeOpacity="0.12" strokeDasharray="5 8" />
            <text x="700" y="126" textAnchor="middle" fill={DARK_MUTED} fontSize="14" fontWeight="800" letterSpacing="0.14em">THIS IS WHERE IT MAKES OR BREAKS</text>

            {[
              { label: "Interpret context", x: 535, y: 204, width: 148, rotate: -9 },
              { label: "Apply judgment", x: 630, y: 185, width: 136, rotate: 8 },
              { label: "Handle exceptions", x: 768, y: 214, width: 154, rotate: -7 },
              { label: "Remember precedent", x: 563, y: 348, width: 168, rotate: 10 },
              { label: "Resolve trade-offs", x: 747, y: 346, width: 152, rotate: -8 },
              { label: "Choose the standard", x: 646, y: 392, width: 156, rotate: 6 },
              { label: "Approve direction", x: 815, y: 397, width: 142, rotate: -5 },
            ].map((item) => (
              <g key={item.label} transform={`rotate(${item.rotate} ${item.x} ${item.y})`}>
                <rect
                  x={item.x - item.width / 2}
                  y={item.y - 17}
                  width={item.width}
                  height="34"
                  rx="17"
                  fill={`hsl(${WARM})`}
                  fillOpacity="0.14"
                  stroke={`hsl(${WARM})`}
                  strokeOpacity="0.26"
                />
                <text x={item.x} y={item.y + 5} textAnchor="middle" fill={DARK_TEXT} fontSize="13" fontWeight="800">{item.label}</text>
              </g>
            ))}

            {/* Center missing layer */}
            <rect
              x="600"
              y="198"
              width="200"
              height="182"
              rx="26"
              fill={`hsl(${WARM})`}
              fillOpacity="0.14"
              stroke={`hsl(${WARM})`}
              strokeWidth="2.8"
              strokeOpacity="0.5"
              strokeDasharray="8 4"
            />
            <circle cx="700" cy="242" r="25" fill={`hsl(${WARM})`} fillOpacity="0.18" />
            <text x="700" y="250" textAnchor="middle" fill={`hsl(${WARM})`} fontSize="22" fontWeight="900">!</text>
            <text x="700" y="286" textAnchor="middle" fill={`hsl(${WARM})`} fontSize="24" fontWeight="900">Missing System of</text>
            <text x="700" y="316" textAnchor="middle" fill={`hsl(${WARM})`} fontSize="24" fontWeight="900">Intelligence</text>
            <text x="700" y="345" textAnchor="middle" fill={DARK_TEXT} fontSize="14" fontWeight="800">Humans bridge this manually today.</text>
            <text x="700" y="366" textAnchor="middle" fill={DARK_MUTED} fontSize="13" fontWeight="700">This is where AI quality breaks or compounds.</text>
          </svg>
        </div>

        {/* Bottom: the punchline */}
        <div className="mt-5 rounded-xl px-10 py-5 text-center" style={{ background: `hsl(${WARM} / 0.08)`, border: `1.5px solid hsl(${WARM} / 0.25)` }}>
          <p className="font-black" style={{ fontSize: 24, color: DARK_TEXT }}>
            Whatever you don't define, <span style={{ color: `hsl(${WARM})` }}>AI invents.</span>
          </p>
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
  const industries = [
    {
      name: "Life Sciences",
      icon: <Shield size={22} style={{ color: `hsl(${RED})` }} />,
      accent: RED,
      records: ["Batch records", "SOPs", "Validation protocols"],
      gap: "AI applies the standard procedure — but the context demands Annex 7. Nobody told it.",
      outputs: ["Deviation reports", "Submission docs"],
      cost: "Safety risk. Audit failure.",
    },
    {
      name: "Professional Services",
      icon: <Briefcase size={22} style={{ color: `hsl(${WARM})` }} />,
      accent: WARM,
      records: ["Methodologies", "Client briefs", "Proposals"],
      gap: "A junior has the template, not the partner's judgment. AI applies the average, not the exception.",
      outputs: ["Deliverables", "Advisory memos"],
      cost: "Margin erosion. Client escalation.",
    },
    {
      name: "Financial Services",
      icon: <DollarSign size={22} style={{ color: `hsl(${GOLD})` }} />,
      accent: GOLD,
      records: ["Risk policies", "Case files", "Compliance docs"],
      gap: "Context changes mid-case. AI prices risk using the average. Two analysts, same case — different outcomes.",
      outputs: ["Risk assessments", "Advisory reports"],
      cost: "Regulatory exposure. Inconsistent pricing.",
    },
    {
      name: "Engineering",
      icon: <Layers size={22} style={{ color: `hsl(${TEAL})` }} />,
      accent: TEAL,
      records: ["Requirements", "Architecture docs", "Test specs"],
      gap: "AI generates code that compiles — but violates architectural decisions made 6 months ago. No one documented why.",
      outputs: ["Code", "Design reviews"],
      cost: "Tech debt. Rework cycles.",
    },
    {
      name: "Sales & GTM",
      icon: <TrendingUp size={22} style={{ color: `hsl(${GREEN})` }} />,
      accent: GREEN,
      records: ["Pricing guides", "Battlecards", "Account plans"],
      gap: "AI drafts the proposal using last quarter's positioning. The strategic pivot hasn't reached the tools.",
      outputs: ["Proposals", "Sequences"],
      cost: "Lost deals. Brand inconsistency.",
    },
    {
      name: "Legal & Compliance",
      icon: <FileText size={22} style={{ color: `hsl(215 25% 50%)` }} />,
      accent: "215 25% 50%",
      records: ["Contracts", "Regulatory filings", "Clause libraries"],
      gap: "AI applies standard clause library — but misses jurisdiction-specific exceptions the senior partner knows.",
      outputs: ["Contract drafts", "Opinions"],
      cost: "Liability. Compliance gaps.",
    },
  ];

  const alsoApplies = ["Supply Chain", "HR & People Ops", "Marketing"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 20, color: `hsl(${WARM})` }}>
          What That Costs
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 44, color: TEXT, lineHeight: 1.08 }}>
          Same gap. Every industry.
        </h2>

        {/* Industry rows — Records → GAP → Output → Cost */}
        <div className="flex flex-col gap-1.5 mb-3">
          {industries.map((ind) => (
            <div key={ind.name} className="flex items-stretch gap-0 rounded-[14px] overflow-hidden border"
              style={{ borderColor: `hsl(${ind.accent} / 0.15)`, minHeight: 72 }}>

              {/* RECORDS */}
              <div className="w-[230px] shrink-0 px-4 py-3 flex flex-col justify-center"
                style={{ background: `hsl(${TEAL} / 0.05)`, borderRight: `1.5px solid hsl(${TEAL} / 0.12)` }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Database size={14} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-bold" style={{ fontSize: 11, color: `hsl(${TEAL})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Input Artifacts</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ind.records.map(r => (
                    <span key={r} className="rounded-full px-2.5 py-0.5 font-semibold" style={{ fontSize: 12, background: `hsl(${TEAL} / 0.08)`, color: TEXT }}>{r}</span>
                  ))}
                </div>
              </div>

              {/* THE GAP */}
              <div className="flex-1 px-5 py-3 flex flex-col justify-center"
                style={{ background: `hsl(${WARM} / 0.05)`, borderRight: `1.5px solid hsl(${WARM} / 0.1)`, borderLeft: `1.5px solid hsl(${WARM} / 0.1)` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  {ind.icon}
                  <p className="font-black" style={{ fontSize: 18, color: TEXT }}>{ind.name}</p>
                  <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: `hsl(${WARM} / 0.1)` }}>
                    <AlertTriangle size={11} style={{ color: `hsl(${WARM})` }} />
                    <span className="font-bold" style={{ fontSize: 10, color: `hsl(${WARM})` }}>THE GAP</span>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.4 }}>{ind.gap}</p>
              </div>

              {/* OUTPUT */}
              <div className="w-[160px] shrink-0 px-3.5 py-3 flex flex-col justify-center"
                style={{ background: `hsl(${GREEN} / 0.04)`, borderRight: `1.5px solid hsl(215 15% 92%)` }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Zap size={14} style={{ color: `hsl(${GREEN})` }} />
                  <p className="font-bold" style={{ fontSize: 11, color: `hsl(${GREEN})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Output Artifacts</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ind.outputs.map(o => (
                    <span key={o} className="rounded-full px-2.5 py-0.5 font-semibold" style={{ fontSize: 12, background: `hsl(${GREEN} / 0.08)`, color: TEXT }}>{o}</span>
                  ))}
                </div>
              </div>

              {/* COST */}
              <div className="w-[185px] shrink-0 px-4 py-3 flex flex-col justify-center"
                style={{ background: `hsl(${RED} / 0.04)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 11, color: `hsl(${RED})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>The cost</p>
                <p className="font-bold" style={{ fontSize: 15, color: `hsl(${RED})`, lineHeight: 1.35 }}>{ind.cost}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Also applies strip */}
        <div className="flex items-center gap-3 mb-4 px-2">
          <p className="font-bold shrink-0" style={{ fontSize: 14, color: MUTED }}>Same pattern in:</p>
          <div className="flex flex-wrap gap-2">
            {alsoApplies.map(a => (
              <span key={a} className="rounded-full px-3.5 py-1 font-semibold border" style={{ fontSize: 13, color: MUTED, borderColor: `hsl(215 15% 85%)`, background: `hsl(220 15% 98%)` }}>{a}</span>
            ))}
          </div>
        </div>

        {/* Cost callout — sourced */}
        <div className="rounded-2xl px-8 py-5 flex items-stretch gap-8"
          style={{ background: `hsl(${WARM} / 0.05)`, border: `2px solid hsl(${WARM} / 0.2)` }}>

          {/* Left: the number + label */}
          <div className="flex flex-col justify-center shrink-0">
            <p className="font-black" style={{ fontSize: 56, color: `hsl(${WARM})`, lineHeight: 1 }}>€550K</p>
            <p className="font-bold mt-1" style={{ fontSize: 16, color: TEXT }}>per year / 100 people</p>
            <p className="mt-0.5" style={{ fontSize: 13, color: MUTED }}>The "Instruction Gap Tax"</p>
          </div>

          {/* Divider */}
          <div className="w-px shrink-0" style={{ background: `hsl(${WARM} / 0.15)` }} />

          {/* Right: sourced breakdown */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: `hsl(${WARM})` }} />
              <div>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>
                  <span className="font-bold">40% of AI productivity gains lost to rework</span> — employees fixing outputs AI got wrong
                </p>
                <p style={{ fontSize: 12, color: SUBTLE }}>Workday Global AI Impact Study, Jan 2026</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: `hsl(${WARM})` }} />
              <div>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>
                  <span className="font-bold">4.5 hours/week per employee</span> cleaning up AI mistakes — 58% of enterprise workers affected
                </p>
                <p style={{ fontSize: 12, color: SUBTLE }}>Zapier AI Workslop Report, Jan 2026</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: `hsl(${WARM})` }} />
              <div>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>
                  <span className="font-bold">Only 14% of workers</span> achieve net-positive AI productivity once rework is accounted for
                </p>
                <p style={{ fontSize: 12, color: SUBTLE }}>Workday, 2026</p>
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
// SLIDE 04 — THE INSTRUCTION LAYER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  const steps = [
    { num: "1", label: "Encode", icon: <BookOpen size={26} />, desc: "Extract expert judgment from documents, interviews, and existing workflows into governed playbooks.", who: "Experts + LIZA", whoColor: GOLD },
    { num: "2", label: "Govern", icon: <Shield size={26} />, desc: "Version, enforce, and trace every instruction. One update propagates across all teams and AI workflows.", who: "LIZA", whoColor: TEAL },
    { num: "3", label: "Execute", icon: <Zap size={26} />, desc: "Orchestrate any LLM with full organizational context — not just documents, but judgment, exceptions, and rules.", who: "AI + Teams", whoColor: GREEN },
    { num: "4", label: "Evolve", icon: <RefreshCw size={26} />, desc: "Every execution generates feedback. Drift is detected. Standards improve. Your organization gets smarter.", who: "Feedback Loop", whoColor: MINT },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Instruction Layer
        </p>
        <h2 className="font-black mb-1" style={{ fontSize: 48, color: TEXT, lineHeight: 1.08 }}>
          LIZA OS fills the gap.
        </h2>
        <p className="mb-4" style={{ fontSize: 20, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          A system that sits between your input artifacts and your output artifacts — encoding, governing, and evolving your organization's collective judgment.
        </p>

        {/* Main flow: Input Artifacts → LIZA (horizontal rows) → Output Artifacts */}
        <div className="flex-1 flex items-stretch gap-0">
          {/* Left: Input Artifacts */}
          <div className="w-[200px] shrink-0 flex flex-col gap-3 justify-center">
            <div className="rounded-2xl border px-5 py-5 text-center" style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.05)` }}>
              <Database size={30} className="mx-auto mb-2" style={{ color: `hsl(${BLUE})` }} />
              <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Input Artifacts</p>
              <p style={{ fontSize: 13, color: MUTED }}>SOPs, requirements, policies</p>
            </div>
            <div className="rounded-2xl border px-5 py-5 text-center" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.05)` }}>
              <Users size={30} className="mx-auto mb-2" style={{ color: `hsl(${GOLD})` }} />
              <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Expert Judgment</p>
              <p style={{ fontSize: 13, color: MUTED }}>Decisions, exceptions, rules</p>
            </div>
          </div>

          {/* Arrow in */}
          <div className="shrink-0 flex items-center justify-center px-4">
            <ArrowRight size={30} style={{ color: `hsl(${TEAL} / 0.4)` }} />
          </div>

          {/* Center: LIZA — 4 HORIZONTAL ROWS */}
          <div className="flex-1 rounded-2xl p-6 flex flex-col" style={{ background: `hsl(${TEAL} / 0.05)`, border: `3px solid hsl(${TEAL} / 0.3)`, boxShadow: `0 0 60px hsl(${TEAL} / 0.08)` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.15)` }}>
                <Brain size={26} style={{ color: `hsl(${TEAL})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>LIZA OS</p>
                <p className="font-semibold" style={{ fontSize: 14, color: MUTED }}>The Instruction Layer</p>
              </div>
            </div>

            {/* 4 horizontal step rows */}
            <div className="flex flex-col gap-2 flex-1">
              {steps.map((step, i) => (
                <div key={step.label} className="flex-1 flex items-center rounded-xl px-5 gap-4" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <span className="font-black shrink-0" style={{ fontSize: 32, color: `hsl(${TEAL} / 0.2)`, width: 30 }}>{step.num}</span>
                  <div className="shrink-0" style={{ color: `hsl(${MINT})` }}>{step.icon}</div>
                  <p className="font-black shrink-0" style={{ fontSize: 20, color: `hsl(${TEAL})`, width: 90 }}>{step.label}</p>
                  <p className="flex-1" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{step.desc}</p>
                  <span className="shrink-0 px-3 py-1 rounded-full" style={{ background: `hsl(${step.whoColor} / 0.12)` }}>
                    <span className="font-bold" style={{ fontSize: 12, color: `hsl(${step.whoColor})` }}>{step.who}</span>
                  </span>
                  {i < 3 && <div className="absolute" />}
                </div>
              ))}
            </div>

            {/* Feedback loop */}
            <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-lg" style={{ background: `hsl(${MINT} / 0.06)`, border: `1px dashed hsl(${MINT} / 0.2)` }}>
              <RefreshCw size={15} style={{ color: `hsl(${MINT})` }} />
              <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${MINT})` }}>
                Step 4 feeds back into Step 1 — your organization gets smarter with every execution
              </p>
            </div>
          </div>

          {/* Arrow out */}
          <div className="shrink-0 flex items-center justify-center px-4">
            <ArrowRight size={30} style={{ color: `hsl(${TEAL} / 0.4)` }} />
          </div>

          {/* Right: Output Artifacts */}
          <div className="w-[200px] shrink-0 flex flex-col justify-center">
            <div className="rounded-2xl border px-5 py-8 text-center h-full flex flex-col justify-center" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.05)` }}>
              <Zap size={30} className="mx-auto mb-2" style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Output Artifacts</p>
              <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>Proposals, reports, workflows — governed by your expertise</p>
              <p className="mt-3 font-bold" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>Consistent. Traceable.</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl px-8 py-3 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1.5px solid hsl(${TEAL} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>
            Other tools give AI your documents. <span style={{ color: `hsl(${TEAL})` }}>LIZA gives AI your judgment.</span>
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
          LIZA extracts your collective intelligence into a versioned, portable asset — your Blueprint.
          Our platform provides the reasoning engine. Your IP never leaves.
        </p>

        <div className="flex-1 flex flex-col gap-3 justify-center">
          {/* Layer 3: Output Artifacts */}
          <div className="rounded-2xl border px-8 py-4 text-center"
            style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Governed Output Artifacts</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Any LLM · Any Workflow · Any Team — all governed by your expertise</p>
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
                  <p className="font-semibold" style={{ fontSize: 13, color: MUTED }}>The Instruction Layer</p>
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
              Your Existing Systems — Input Artifacts — Unchanged
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
// SLIDE 06 — CATEGORY VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  const players = [
    { name: "Edra", funding: "$30M", round: "Series A · 2024", what: "Process mining → executable SOPs for AI agents", color: GREEN },
    { name: "Mem0.ai", funding: "$24M", round: "Series A · 2024", what: "AI memory layer — persistent context across sessions", color: SEAFOAM },
    { name: "Interloom", funding: "$16.5M", round: "Series A · 2023", what: "Tacit knowledge capture for operations teams", color: BLUE },
    { name: "Paradox.ai", funding: "~$3.8M", round: "Seed · 2024", what: "Knowledge governance for regulated industries", color: GOLD },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Category Validation</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          We're not alone.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>$90M+ invested in 24 months.</span>
        </h2>

        <div className="flex gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4">
            {players.map(({ name, funding, round, what, color }) => (
              <div key={name} className="flex items-center gap-5 rounded-xl border px-6 py-4"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
                <div className="w-[160px] shrink-0">
                  <p className="font-bold" style={{ fontSize: 20, color: DARK_TEXT }}>{name}</p>
                  <p className="font-black" style={{ fontSize: 16, color: `hsl(${color})` }}>{funding}</p>
                  <p style={{ fontSize: 13, color: DARK_SUBTLE }}>{round}</p>
                </div>
                <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.4 }}>{what}</p>
              </div>
            ))}

            <div className="rounded-xl border-2 px-6 py-5 mt-auto"
              style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)` }}>
              <div className="flex items-center gap-5">
                <div className="w-[160px] shrink-0">
                  <p className="font-black" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>LIZA OS</p>
                  <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>€1.5M Seed</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ fontSize: 18, color: DARK_TEXT }}>
                    The Instruction Layer — governs <strong>judgment-heavy</strong> expertise where stakes are highest.
                  </p>
                  <p className="mt-1" style={{ fontSize: 15, color: DARK_MUTED }}>
                    They automate the predictable. We govern what isn't.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[400px] rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-5" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Market Size</p>
            <div className="flex flex-col gap-5 flex-1 justify-center">
              {[
                { label: "TAM", value: "$28B", desc: "Global AI governance & knowledge management infrastructure", size: "w-full" },
                { label: "SAM", value: "$8.5B", desc: "Knowledge-intensive orgs (50-5000 employees) in target verticals", size: "w-[85%]" },
                { label: "SOM", value: "$340M", desc: "EU professional services, consulting, pharma & regulated industries", size: "w-[60%]" },
              ].map(({ label, value, desc, size }) => (
                <div key={label}>
                  <div className={`${size} rounded-xl px-6 py-4`} style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-black" style={{ fontSize: 14, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>{label}</span>
                      <span className="font-black" style={{ fontSize: 32, color: DARK_TEXT }}>{value}</span>
                    </div>
                    <p style={{ fontSize: 14, color: DARK_MUTED, lineHeight: 1.4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 py-2.5 rounded-lg" style={{ background: `hsl(${GREEN} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>
                Wedge: Professional services → Regulated → Enterprise
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — HOW IT WORKS (Horizontal flow, diagram-style, no screenshots)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    {
      num: "01", title: "Capture", icon: <BookOpen size={28} />,
      desc: "Upload documents, AI extracts structure. A copilot guides experts to fill what's missing for full AI intelligence.",
      flow: ["Upload existing artifacts", "AI extracts judgment & rules", "Copilot fills the gaps"],
      output: "Versioned playbooks ready",
      color: GOLD,
    },
    {
      num: "02", title: "Organize", icon: <Network size={28} />,
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
      num: "04", title: "Learn", icon: <RefreshCw size={28} />,
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
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>How It Works</p>

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
            Step 4 feeds back into Step 1 — your playbooks sharpen with every cycle
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
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Early Validation</p>

        <h2 className="font-black mb-8" style={{ fontSize: 50, color: DARK_TEXT, lineHeight: 1.05 }}>
          Real organizations.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Real outcomes.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              title: "Global AEC Software Company",
              subtitle: "€6B Group · 200+ employees",
              color: TEAL,
              outcome: "VP Product now serves as Strategic Advisor",
              points: [
                "16 VP-level attendees in first session (107 min)",
                "Post-merger governance across 4 departments",
                "AI learned governance rules live — in real time",
              ],
            },
            {
              title: "Executive Search Firm",
              subtitle: "Boutique · Senior partner engagement",
              color: GREEN,
              outcome: "New associates at senior quality from week 2",
              points: [
                "Encoded senior partner's candidate evaluation judgment",
                "Associates running searches at expert quality immediately",
                "Onboarding time compressed from months to days",
              ],
            },
            {
              title: "Professional Services Consultancy",
              subtitle: "Mid-market · Multi-team deployment",
              color: GOLD,
              outcome: "Client escalations reduced measurably",
              points: [
                "Delivery methodology encoded into executable protocols",
                "Client communication standardized across all consultants",
                "Quality consistency regardless of seniority",
              ],
            },
            {
              title: "B2B Sales Organization",
              subtitle: "SaaS · Sales team pilot",
              color: TEAL,
              outcome: "Entire team executing top seller's playbook",
              points: [
                "Best seller's deal qualification judgment encoded",
                "Competitive positioning updates from live deal feedback",
                "Ramp time for new hires cut significantly",
              ],
            },
          ].map(({ title, subtitle, color, outcome, points }) => (
            <div key={title} className="rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-bold" style={{ fontSize: 20, color: DARK_TEXT }}>{title}</p>
              <p className="mb-2" style={{ fontSize: 15, color: `hsl(${color})` }}>{subtitle}</p>
              <div className="rounded-lg px-4 py-2 mb-3" style={{ background: `hsl(${color} / 0.1)` }}>
                <p className="font-bold" style={{ fontSize: 16, color: `hsl(${color})` }}>🎯 {outcome}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {points.map((p, i) => (
                  <p key={i} className="flex items-start gap-2" style={{ fontSize: 16, color: DARK_MUTED }}>
                    <span className="font-bold shrink-0" style={{ color: `hsl(${color})` }}>→</span> {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — VERTICALS (Expansion path — 3 verticals)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Expansion Path</p>

        <h2 className="font-black mb-6" style={{ fontSize: 50, color: TEXT, lineHeight: 1.05 }}>
          Same engine.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Three beachheads. One pattern.</span>
        </h2>

        <div className="flex gap-6 flex-1 min-h-0">
          {[
            {
              vertical: "Professional Services", status: "Deployed", color: GREEN,
              icon: <Users size={28} style={{ color: `hsl(${GREEN})` }} />,
              problem: "Senior consultants carry methodology in their heads. Juniors can't replicate quality. AI makes it worse — everyone prompts differently.",
              result: "New consultants deliver at senior quality from week 2. Every engagement governed by the firm's collective judgment.",
              proof: "Executive search firm, mid-market consultancy — live deployments",
            },
            {
              vertical: "Pharma & Life Sciences", status: "Validated", color: GOLD,
              icon: <Shield size={28} style={{ color: `hsl(${GOLD})` }} />,
              problem: "GxP compliance requires traceable expertise at every step. Tribal knowledge doesn't survive audits. AI without governance is a regulatory liability.",
              result: "Audit preparation compressed from weeks to hours. Full provenance trails. Every AI output traceable to a versioned standard.",
              proof: "GMP/GxP lifecycle validated with pharma domain experts",
            },
            {
              vertical: "Financial Services", status: "Next", color: ACCENT,
              icon: <DollarSign size={28} style={{ color: `hsl(${ACCENT})` }} />,
              problem: "Underwriting, advisory, and compliance judgment is person-dependent. AI generates confident recommendations without institutional risk context.",
              result: "Risk assessment, compliance checks, and advisory output governed by institutional standards. Judgment-consistent across every analyst.",
              proof: "$28B TAM intersection — compliance + knowledge-intensive ops",
            },
          ].map(({ vertical, status, color, icon, problem, result, proof }) => (
            <div key={vertical} className="flex-1 rounded-2xl border p-7 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {icon}
                  <p className="font-black" style={{ fontSize: 22, color: TEXT }}>{vertical}</p>
                </div>
                <span className="px-3 py-1.5 rounded-full font-bold" style={{ fontSize: 13, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{status}</span>
              </div>
              <div className="flex items-start gap-2.5 mb-4">
                <AlertTriangle size={18} style={{ color: `hsl(${WARM})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.5 }}>{problem}</p>
              </div>
              <div className="flex items-start gap-2.5 mb-4 flex-1">
                <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 3 }} />
                <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${color})`, lineHeight: 1.5 }}>{result}</p>
              </div>
              <div className="rounded-lg px-4 py-2.5 mt-auto" style={{ background: `hsl(${color} / 0.06)` }}>
                <p style={{ fontSize: 14, color: MUTED, fontStyle: "italic" }}>{proof}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border px-7 py-4 flex items-center gap-5"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={24} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 18, color: MUTED }}>
            <strong style={{ color: TEXT }}>One core engine. Industry-specific expertise packs.</strong>{" "}
            Each vertical deepens the moat. Capital-efficient expansion from a single codebase.
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
      desc: "Living organizational memory — versioned, auditable, propagated.",
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
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Business Model</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          Land with diagnostics.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Expand with expertise packs.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Pricing */}
          <div className="flex-1 flex flex-col gap-5">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Revenue Streams</p>

            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>Platform SaaS</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>€500–2,000/mo per team</span>
              </div>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.5 }}>
                Core platform access. Knowledge graph, workbooks, protocol execution, governance.
                Usage-based AI execution on top.
              </p>
            </div>

            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>Expertise Packs</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>€2,000–10,000 one-time</span>
              </div>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.5 }}>
                Industry-specific pre-built playbooks. Consulting frameworks, compliance templates,
                sales methodologies. High-margin, deepens lock-in.
              </p>
            </div>

            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>Onboarding Sprint</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>€5,000–15,000</span>
              </div>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.5 }}>
                White-glove extraction. We encode your organization's collective judgment into the platform.
                Converts to long-term SaaS.
              </p>
            </div>
          </div>

          {/* Unit economics */}
          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Unit Economics Target</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ACV", value: "€18K", desc: "Average contract value" },
                { label: "CAC", value: "€3K", desc: "Diagnostic-to-pilot funnel" },
                { label: "LTV:CAC", value: "6:1", desc: "Target at steady state" },
                { label: "NRR", value: ">120%", desc: "Expansion via teams + packs" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="rounded-xl px-5 py-5 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <p className="font-black" style={{ fontSize: 36, color: DARK_TEXT }}>{value}</p>
                  <p className="font-bold mt-1" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{label}</p>
                  <p style={{ fontSize: 13, color: DARK_MUTED }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 17, color: `hsl(${ACCENT})` }}>GTM Motion</p>
              <div className="flex flex-col gap-2">
                {[
                  "Free diagnostic → identifies gaps",
                  "Pilot sprint → encodes first playbooks",
                  "Platform subscription → ongoing execution",
                  "Expansion → more teams, more packs",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-black" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>{i + 1}.</span>
                    <span style={{ fontSize: 15, color: DARK_MUTED }}>{step}</span>
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
        "Identify one high-value process (e.g. proposal writing, deal qualification)",
        "Interview 2-3 senior experts (90 min each)",
        "LIZA extracts judgment into structured playbooks",
      ],
      output: "3-5 executable playbooks ready",
    },
    {
      week: "Week 2-3",
      title: "Execute",
      icon: <Zap size={24} />,
      color: SEAFOAM,
      actions: [
        "Junior team members run playbooks with AI guidance",
        "Real work, real clients, real outputs",
        "LIZA tracks drift, captures feedback automatically",
      ],
      output: "Measurable quality comparison: before vs. after",
    },
    {
      week: "Week 4",
      title: "Prove",
      icon: <TrendingUp size={24} />,
      color: GREEN,
      actions: [
        "Review: time saved, quality delta, rework reduction",
        "Knowledge graph auto-improved from execution feedback",
        "Business case for full deployment with real numbers",
      ],
      output: "ROI proven. Expansion decision with data.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>Go-To-Market Wedge</p>

        <h2 className="font-black mb-2" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          The 30-Day Execution Challenge.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Prove value before you commit.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 19, color: MUTED, maxWidth: 1100 }}>
          One process. One team. 30 days. Measurable results — or walk away.
        </p>

        <div className="flex gap-5 flex-1 min-h-0">
          {phases.map((p, i) => (
            <div key={p.week} className="flex-1 rounded-2xl border flex flex-col overflow-hidden"
              style={{ borderColor: `hsl(${p.color} / 0.25)`, background: `hsl(${p.color} / 0.03)` }}>
              {/* Header */}
              <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid hsl(${p.color} / 0.15)` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${p.color} / 0.12)`, color: `hsl(${p.color})` }}>
                  {p.icon}
                </div>
                <div>
                  <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 12, color: `hsl(${p.color})` }}>{p.week}</p>
                  <p className="font-black" style={{ fontSize: 24, color: TEXT }}>{p.title}</p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex-1 px-6 py-4 flex flex-col gap-2.5">
                {p.actions.map((a, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <span className="font-bold shrink-0 mt-0.5" style={{ color: `hsl(${p.color})` }}>→</span>
                    <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{a}</p>
                  </div>
                ))}
              </div>
              {/* Output */}
              <div className="px-6 py-3 mt-auto" style={{ background: `hsl(${p.color} / 0.06)` }}>
                <p className="font-bold" style={{ fontSize: 15, color: `hsl(${p.color})` }}>
                  ✓ {p.output}
                </p>
              </div>
              {i < 2 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden">
                  <ArrowRight size={20} style={{ color: `hsl(${TEAL} / 0.3)` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom metrics */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {[
            { metric: "€5-15K", label: "Sprint cost", sub: "Self-funding from savings" },
            { metric: "1 team", label: "Starting scope", sub: "5-15 people" },
            { metric: "30 days", label: "To measurable ROI", sub: "Not 6 months" },
            { metric: "85%+", label: "Conversion rate", sub: "Sprint → annual contract" },
          ].map(m => (
            <div key={m.label} className="rounded-xl px-5 py-3 text-center" style={{ background: `hsl(${GREEN} / 0.04)`, border: `1px solid hsl(${GREEN} / 0.12)` }}>
              <p className="font-black" style={{ fontSize: 28, color: TEXT }}>{m.metric}</p>
              <p className="font-bold" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>{m.label}</p>
              <p style={{ fontSize: 12, color: MUTED }}>{m.sub}</p>
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
          Built by practitioners.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>Not first-time founders.</span>
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
            <div className="rounded-xl border p-4 flex items-center gap-4 mt-auto"
              style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
              <Shield size={20} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
              <p style={{ fontSize: 15, color: MUTED }}>
                <strong style={{ color: TEXT }}>Advisory:</strong> Tom Ray (Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers)
                + Enterprise VP Product Advisor
              </p>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>WHY US</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: "15+", label: "Clients served", icon: <Users size={20} /> },
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
              { title: "We lived this problem", desc: "Built AI practices at enterprise scale. Saw the expertise gap firsthand — across industries, countries, team sizes.", color: GREEN },
              { title: "Capital efficient", desc: "Entire product, marketing site, diagnostic tool, and enterprise pipeline built with near-zero burn.", color: TEAL },
              { title: "Proprietary IP", desc: "AACE v3.1 — the context specification. Intent-locking, knowledge injection, drift detection. Hard to replicate.", color: GREEN },
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
// SLIDE 12 — THE ASK (€1.5M + milestones + use of funds)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-8">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${GREEN} / 0.8)` }}>Seed Round</p>
          <h2 className="font-black mb-3" style={{ fontSize: 96, color: DARK_TEXT }}>€1.5M</h2>
          <p style={{ fontSize: 24, color: DARK_MUTED }}>
            Post-money SAFE &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A readiness
          </p>
        </div>

        {/* Use of funds */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Customer Acq.", pct: "40%", amt: "€600K", desc: "15-20 paying pilots", color: ACCENT },
            { label: "Product", pct: "30%", amt: "€450K", desc: "Production hardening", color: GREEN },
            { label: "GTM", pct: "20%", amt: "€300K", desc: "Case studies + channels", color: GOLD },
            { label: "Operations", pct: "10%", amt: "€150K", desc: "Legal, IP, compliance", color: MUTED },
          ].map(({ label, pct, amt, desc, color }) => (
            <div key={label} className="rounded-xl border px-5 py-4 text-center"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
              <p className="font-black" style={{ fontSize: 32, color: DARK_TEXT }}>{pct}</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${color})` }}>{label}</p>
              <p style={{ fontSize: 14, color: DARK_MUTED }}>{amt} — {desc}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { month: "Month 1-6", target: "€200-400K ARR", milestone: "5-8 paying customers. First case studies.", color: TEAL },
            { month: "Month 7-12", target: "€600K-1M ARR", milestone: "15+ customers, 3+ verticals. NRR >120%.", color: SEAFOAM },
            { month: "Month 13-18", target: "€1-1.5M ARR", milestone: "25+ customers. Series A raise.", color: MINT },
          ].map(({ month, target, milestone, color }) => (
            <div key={month} className="rounded-xl border px-5 py-4"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{month}</p>
              <p className="font-black mt-1" style={{ fontSize: 28, color: DARK_TEXT }}>{target}</p>
              <p className="mt-2" style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.4 }}>{milestone}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>
            Your organization's collective intelligence is your competitive advantage.{" "}
            <strong style={{ color: `hsl(${TEAL})` }}>We make it run the company.</strong>
          </p>
        </div>

        <p className="mt-5 text-center" style={{ fontSize: 18, color: DARK_SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential
        </p>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "The Instruction Gap", component: <Slide02 /> },
  { id: 3, title: "What That Costs", component: <Slide03 /> },
  { id: 4, title: "The Instruction Layer", component: <Slide05 /> },
  { id: 5, title: "Category Validation", component: <Slide06 /> },
  { id: 6, title: "How It Works", component: <Slide07 /> },
  { id: 7, title: "Where LIZA Sits", component: <SlideArchitecture /> },
  { id: 8, title: "Early Validation", component: <Slide08 /> },
  { id: 9, title: "Expansion Path", component: <Slide09 /> },
  { id: 10, title: "What's Built", component: <Slide10 /> },
  { id: 11, title: "Business Model", component: <Slide11 /> },
  { id: 12, title: "30-Day Challenge", component: <SlideExecutionChallenge /> },
  { id: 13, title: "Team", component: <Slide12 /> },
  { id: 14, title: "The Ask", component: <Slide13 /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function LifecycleInvestorDeck() {
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS — Investor Deck</h2>
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS — Investor Deck</span>
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

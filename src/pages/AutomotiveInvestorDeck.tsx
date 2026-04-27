import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, Check, CheckCircle2, DollarSign,
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
            LIZA OS · Automotive R&D · Customer First, Investor Optional
          </span>
        </div>

        <h1 className="font-black mb-6" style={{ fontSize: 82, lineHeight: 1.05, color: TEXT }}>
          The Brand &amp; Compliance Memory Layer<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            for AI-Native Retail Banking.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          LIZA OS turns chassis-control engineering judgment, design rationale, and HQ tribal knowledge into the operating layer between AI inputs and AI outputs in greenfield automotive R&amp;D sites.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Onboarding Pilot · Memory Layer · Optional Strategic Stake</span>
        </p>

        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; Two-Door Conversation &nbsp;·&nbsp; Onboarding Pilot · Memory Layer · Optional Strategic Stake
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE SHAPE — THE SHAPE OF THE COMPANY (Banking framing)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideShape() {
  const verticals = [
    { label: "Automotive R&D", sub: "Onboarding · Design · V&V · Safety case", active: true, color: TEAL },
    { label: "Pharma", sub: "GxP · Deviations · CSRs", active: false, color: MUTED },
    { label: "Banking", sub: "Brand · KYC · Compliance", active: false, color: MUTED },
    { label: "Satcom & Space", sub: "Mission · Compliance · Ops", active: false, color: MUTED },
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
          One OS. <span style={{ color: `hsl(${TEAL})` }}>Automotive R&amp;D onboarding is the spear.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          We build a single context layer and deploy it vertical-by-vertical. We start with greenfield automotive R&amp;D, where chassis-control judgment, ISO 26262 reasoning, and HQ tribal knowledge are most expensive to re-transfer, and benefit from platform leverage already shipping into pharma, AEC, banking, and other regulated lifecycles.
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-4 gap-6 mb-0">
            {verticals.map(v => (
              <div key={v.label} className="rounded-xl border-2 p-6 relative" style={{
                borderColor: v.active ? `hsl(${v.color})` : CHROME_BORDER,
                background: v.active ? `hsl(${v.color} / 0.06)` : CARD_ALT,
              }}>
                {v.active && (
                  <div className="absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-bold tracking-[0.2em]"
                    style={{ background: `hsl(${v.color})`, color: "white" }}>
                    YOUR ROUND
                  </div>
                )}
                <div className="font-black mb-1" style={{ fontSize: 28, color: v.active ? `hsl(${v.color})` : TEXT }}>{v.label}</div>
                <div style={{ fontSize: 16, color: MUTED }}>{v.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center my-2" style={{ color: SUBTLE }}>
            <div className="text-3xl leading-none">▾ ▾ ▾ ▾</div>
          </div>

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

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${TEAL})` }}>WHAT YOU OWN</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              The cross-border automotive R&amp;D thesis. Category leadership in safety-critical, multi-site engineering AI execution.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${BLUE})` }}>WHAT COMPOUNDS</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Platform investment from other verticals lowers your CAC and accelerates roadmap.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${GOLD})` }}>HOW WE STRUCTURE IT</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Customer contract first. Optional strategic stake with board observer and visibility on the automotive roadmap.
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
  const inputs = ["Chassis-control IP", "HQ design rules", "ISO 26262 / ASPICE", "Prior FMEDA & HARA", "Past program lessons", "Senior engineer judgment"];
  const outputs = ["Onboarding playbooks", "Design specs", "V&V protocols", "Safety cases", "Change requests", "OEM responses"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
          The Context Gap
        </p>

        <h2 className="font-black mb-10" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08 }}>
          Companies have inputs. AI generates outputs.<br />
          <span style={{ color: `hsl(${WARM})` }}>There&apos;s no system to make AI work to your chassis-control standards, HQ design intent, and ISO 26262 judgment.</span>
        </h2>

        {/* Three columns: Inputs → THE GAP → Outputs */}
        <div className="flex items-stretch gap-0 flex-1 min-h-0 max-h-[420px]">

          {/* LEFT — Input Artifacts */}
          <div className="flex-1 rounded-l-2xl border-2 p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.06)`, borderRight: "none" }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Input Artifacts</p>
            <p className="font-bold mb-6" style={{ fontSize: 22, color: TEXT }}>What companies feed AI today</p>
            <div className="flex flex-wrap gap-3">
              {inputs.map(item => (
                <span key={item} className="rounded-full px-5 py-2.5 font-bold"
                  style={{ fontSize: 16, background: `hsl(${TEAL} / 0.12)`, color: TEXT, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Check size={18} style={{ color: `hsl(${TEAL})` }} />
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Already digitized. Already structured.</p>
            </div>
            <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
              But none of it is queryable by AI. Chassis-control IP, HQ design rules, and senior-engineer judgment sit in Chinese PDFs, slides, and inboxes no model — and no Budapest hire — can reason over.
            </p>
          </div>

          {/* CENTER — THE GAP (deliberately stark) */}
          <div className="w-[340px] shrink-0 border-y-2 flex flex-col items-center justify-center relative"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            {/* Dashed vertical lines suggesting disconnection */}
            <div className="absolute left-0 top-8 bottom-8 w-px" style={{ borderLeft: `2px dashed hsl(${WARM} / 0.2)` }} />
            <div className="absolute right-0 top-8 bottom-8 w-px" style={{ borderRight: `2px dashed hsl(${WARM} / 0.2)` }} />

            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: `hsl(${WARM} / 0.12)`, border: `2px solid hsl(${WARM} / 0.3)` }}>
              <span className="font-black" style={{ fontSize: 44, color: `hsl(${WARM})` }}>?</span>
            </div>
            <p className="font-black text-center mb-2" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
              No System of<br />Intelligence
            </p>
            <p className="text-center px-5" style={{ fontSize: 15, color: MUTED, lineHeight: 1.55 }}>
              AI can generate fast, but it can't apply your expertise, your judgment, or your standards.
            </p>
            <p className="font-semibold text-center mt-4 px-4" style={{ fontSize: 14, color: TEXT }}>
              The result: experts redo AI's work instead of scaling their own.
            </p>
          </div>

          {/* RIGHT — Output Artifacts */}
          <div className="flex-1 rounded-r-2xl border-2 p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${GREEN} / 0.3)`, background: `hsl(${GREEN} / 0.06)`, borderLeft: "none" }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Output Artifacts</p>
            <p className="font-bold mb-6" style={{ fontSize: 22, color: TEXT }}>What AI produces without guidance</p>
            <div className="flex flex-wrap gap-3">
              {outputs.map(item => (
                <span key={item} className="rounded-full px-5 py-2.5 font-bold"
                  style={{ fontSize: 16, background: `hsl(${GREEN} / 0.12)`, color: TEXT, border: `1px solid hsl(${GREEN} / 0.2)` }}>
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Check size={18} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>Already fast. Already cheap.</p>
            </div>
            <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
              But without your chassis-control IP and HQ engineering judgment, every output is generic: a textbook brake system, not VIE&apos;s.
            </p>
          </div>
        </div>

        {/* Bottom punchline */}
        <div className="mt-8 rounded-xl px-10 py-5 text-center" style={{ background: `hsl(${WARM} / 0.08)`, border: `1.5px solid hsl(${WARM} / 0.25)` }}>
          <p className="font-black" style={{ fontSize: 26, color: TEXT }}>
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

const AEC_GAP_CASES = [
  {
    name: "New Engineer Onboarding (Budapest)",
    icon: <Users size={22} style={{ color: `hsl(${RED})` }} />,
    accent: RED,
    records: ["Chassis-control IP", "HQ design specs", "Component datasheets", "Prior program lessons"],
    output: "Ramp plans · Tutorials · Architecture briefs",
    gap: "AI summarizes the public spec, but misses the design rationale, the failed approaches, and the tribal know-how that senior engineers in Diankou never wrote down.",
    cost: "9–12 month ramp time. Senior engineers stuck answering basic questions. Hiring throughput stalls.",
  },
  {
    name: "Cross-Site Engineering Reviews",
    icon: <Briefcase size={22} style={{ color: `hsl(${WARM})` }} />,
    accent: WARM,
    records: ["DFMEA history", "Prior change requests", "Design review minutes"],
    output: "Design proposals · Change requests · Review packs",
    gap: "AI produces a plausible answer that does not match how Diankou, Beijing, or Shanghai has already solved the same problem on a previous program.",
    cost: "Re-invented wheels. Stale assumptions. Cross-site rework and tension.",
  },
  {
    name: "Functional Safety & Compliance",
    icon: <Shield size={22} style={{ color: `hsl(${GOLD})` }} />,
    accent: GOLD,
    records: ["ISO 26262 / ASPICE artifacts", "Prior HARA & FMEDA", "Safety-case patterns"],
    output: "HARA · Safety goals · FMEDA · Traceability",
    gap: "AI restates the standard, but misses VIE&apos;s in-house interpretation, prior safety-case patterns, and the EMB / wheel-hub decisions that have no industry precedent.",
    cost: "Audit findings. Re-work of safety artifacts. Risk to OEM homologation.",
  },
];

const AEC_COST_BENCHMARKS = [
  {
    value: "9-12 mo",
    label: "typical ramp time for a new chassis-control engineer at a greenfield site to reach productive contribution on a live program",
    source: "Observed across European Tier-1 R&D centers, 2024-2025",
  },
  {
    value: "20-40%",
    label: "of senior R&D engineer time at HQ is spent re-explaining design rationale to subsidiary and partner sites",
    source: "Industry benchmark, automotive Tier-1 cross-border R&D",
  },
  {
    value: "30-50%",
    label: "of automotive program cost overruns trace back to undocumented design intent and re-derived safety reasoning",
    source: "Triangulated from ISO 26262 / ASPICE practitioner studies, 2024",
  },
];

function Slide03() {
  const alsoApplies = ["EMB & wheel-hub novel categories", "Cybersecurity (UNECE R155/R156)", "Manufacturing transfer", "OEM RFQ responses", "Service & field learning", "Multi-program reuse"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Where Missing Context Shows Up in Automotive R&D
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 48, color: TEXT, lineHeight: 1.08, maxWidth: 1680 }}>
          The artifacts exist. The AI produces an output. <span style={{ color: `hsl(${TEAL})` }}>The missing piece is HQ engineering judgment, design rationale, and ISO 26262 reasoning.</span>
        </h2>

        <div className="flex flex-col gap-3 flex-1 min-h-0 mb-3">
          {AEC_GAP_CASES.map((item) => (
            <div key={item.name} className="flex-1 flex items-stretch gap-0 rounded-2xl overflow-hidden border" style={{ borderColor: `hsl(${item.accent} / 0.15)` }}>
              <div className="w-[290px] shrink-0 px-6 py-4 flex flex-col justify-center" style={{ background: `hsl(${TEAL} / 0.05)`, borderRight: `1.5px solid hsl(${TEAL} / 0.12)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Database size={18} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-bold" style={{ fontSize: 13, color: `hsl(${TEAL})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Artifacts that need expert judgment</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.records.map((record) => (
                    <span key={record} className="rounded-full px-3.5 py-1.5 font-semibold" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.08)`, color: TEXT }}>{record}</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}><span className="font-bold" style={{ color: TEXT }}>Typical AI output:</span> {item.output}</p>
              </div>

              <div className="flex-1 px-7 py-4 flex flex-col justify-center" style={{ background: `hsl(${WARM} / 0.05)`, borderRight: `1.5px solid hsl(${WARM} / 0.1)`, borderLeft: `1.5px solid hsl(${WARM} / 0.1)` }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `hsl(${item.accent} / 0.12)` }}>
                    {item.icon}
                  </div>
                  <p className="font-black" style={{ fontSize: 23, color: TEXT }}>{item.name}</p>
                  <div className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: `hsl(${WARM} / 0.1)` }}>
                    <AlertTriangle size={15} style={{ color: `hsl(${WARM})` }} />
                    <span className="font-bold" style={{ fontSize: 11, color: `hsl(${WARM})` }}>THE GAP</span>
                  </div>
                </div>
                <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.42 }}>{item.gap}</p>
              </div>

              <div className="w-[220px] shrink-0 px-5 py-4 flex flex-col justify-center" style={{ background: `hsl(${RED} / 0.04)` }}>
                <p className="font-bold mb-1.5" style={{ fontSize: 12, color: `hsl(${RED})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>What breaks</p>
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${RED})`, lineHeight: 1.32 }}>{item.cost}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-2">
          <p className="font-bold shrink-0" style={{ fontSize: 17, color: MUTED }}>Same pattern in:</p>
          <div className="flex flex-wrap gap-2.5">
            {alsoApplies.map((item) => (
              <span key={item} className="rounded-full px-4 py-2 font-semibold border" style={{ fontSize: 16, color: MUTED, borderColor: `hsl(215 15% 85%)`, background: `hsl(220 15% 98%)` }}>{item}</span>
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
          What Missing Context Costs in Automotive R&D
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 48, color: TEXT, lineHeight: 1.08, maxWidth: 1640 }}>
          Missing context becomes expensive because it creates <span style={{ color: `hsl(${WARM})` }}>re-explained design intent and re-derived safety reasoning.</span>
        </h2>

        <div className="grid grid-cols-[360px_1fr] gap-5 mb-4">
          <div className="rounded-[28px] border px-7 py-7" style={{ borderColor: `hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.05)` }}>
            <p className="font-black" style={{ fontSize: 78, color: `hsl(${WARM})`, lineHeight: 0.95 }}>52%</p>
            <p className="font-bold mt-2" style={{ fontSize: 23, color: TEXT, lineHeight: 1.18 }}>
              of cross-border R&amp;D effort is tied to context that lives in senior engineers&apos; heads, not in a system AI can use
            </p>
            <p className="mt-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>
              This is the part AI can amplify if it runs without the latest design decision, prior FMEDA, or HQ direction the senior team already absorbed.
            </p>
            <p className="mt-4" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.45 }}>
              Triangulated from automotive R&amp;D and ISO 26262 practitioner benchmarks, 2024-2025
            </p>
          </div>

          <div className="rounded-[28px] border px-7 py-6" style={{ borderColor: `hsl(${TEAL} / 0.18)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {AEC_COST_BENCHMARKS.map((item) => (
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
                If AI produces a plausible design spec, onboarding plan, FMEDA, or change request <span className="font-bold">without the full chassis-control, HQ-design, and ISO 26262 context</span>, the senior engineer still has to catch it, correct it, and re-approve it.
              </p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                On a <span className="font-bold" style={{ color: TEXT }}>€15M annual R&amp;D budget</span>, a 25% rework + ramp drag implies roughly <span className="font-bold" style={{ color: TEXT }}>€3.7M of avoidable cost</span> before lost program velocity and delayed OEM SOP dates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          {[
            { label: "Capacity", value: "compressed", desc: "Senior HQ engineers spend their time re-explaining IP to Budapest hires and AI drafts, instead of advancing EMB and wheel-hub roadmaps.", color: RED },
            { label: "Speed", value: "delayed", desc: "Wrong outputs create review loops, re-derivation of safety arguments, and waiting time across design reviews and OEM milestones.", color: WARM },
            { label: "AI usage", value: "cannot scale safely", desc: "Without governance, R&amp;D and functional-safety leads cap AI adoption because every output creates safety, IP, and homologation risk.", color: GOLD },
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
      label: "of automotive Tier-1 R&amp;D orgs have AI tools in engineering workflows in 2025",
      insight: "Adoption is done. The engineering-judgment and safety-quality crisis just started.",
      color: WARM,
      source: "Automotive AI Adoption Survey, 2025",
    },
    {
      metric: "40%",
      label: "of AI productivity gains lost to design-review and safety-rework cycles",
      insight: "The faster AI generates engineering artifacts, the faster Tier-1s lose design-intent control.",
      color: RED,
      source: "Triangulated from automotive R&amp;D and ISO 26262 practitioner studies, 2024-2026",
    },
    {
      metric: "Shift",
      label: "from AI access to AI governance in safety-critical engineering",
      insight: "Boards moved from asking whether R&amp;D uses AI to asking how every output stays on-spec, on-standard, and homologation-defensible.",
      color: TEAL,
      source: "Observed across European automotive Tier-1 R&amp;D and functional-safety teams",
    },
  ];

  const shifts = [
    { shift: "AI tools became commodities", result: "Differentiation moved from 'which copilot' to 'whose chassis-control and safety memory runs through it'" },
    { shift: "Regulators tightened the loop", result: "EU AI Act, ISO 26262 ed.2, ASPICE 4.0, UNECE R155/R156. Governance of AI-generated engineering and safety artifacts is now mandatory, not optional" },
    { shift: "The senior bottleneck hit", result: "Tier-1s cannot hire more senior chassis-control or functional-safety engineers. They need to scale the few they have — across Diankou, Beijing, Shanghai, and now Budapest." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Why Now</p>

        <h2 className="font-black mb-2" style={{ fontSize: 56, color: TEXT, lineHeight: 1.08 }}>
          AI adoption is done.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>The engineering-judgment crisis just started.</span>
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
    { title: "Banking roles", items: "CMO, brand lead, product marketer, compliance reviewer", color: TEAL },
    { title: "Banking workflows", items: "Campaign brief, landing page, disclosure, complaint reply", color: GOLD },
    { title: "Banking language", items: "Brand book, product rules, regulator nudges, prior approvals", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Horizontal Core · Vertical Surface
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          The platform is horizontal. <span style={{ color: `hsl(${TEAL})` }}>Adoption happens through a retail-banking-native experience.</span>
        </h2>
        <div className="grid grid-cols-[1fr_60px_1.1fr_60px_1fr] gap-3 items-stretch mb-1">
          <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `hsl(${BLUE} / 0.16)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${BLUE})` }}>Input</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Brand book, product rules, regulator guidance, prior approvals, segment data, past campaigns</p>
          </div>
          <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${TEAL} / 0.4)` }} /></div>
          <div className="rounded-2xl border-2 px-6 py-4 text-center" style={{ borderColor: `hsl(${TEAL} / 0.32)`, background: `hsl(${TEAL} / 0.07)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${TEAL})` }}>LIZA OS</p>
            <p className="font-black" style={{ fontSize: 21, color: TEXT }}>The in-between operating layer that turns raw context into governed execution</p>
          </div>
          <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${TEAL} / 0.4)` }} /></div>
          <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `hsl(${GREEN} / 0.16)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Output</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>AI work that follows brand, product, and compliance memory</p>
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
              LIZA provides the reusable knowledge loop. <span style={{ color: `hsl(${GOLD})`, fontWeight: 700 }}>The first retail bank turns it into the banking-native operating experience.</span>
            </p>
          </div>

          {/* Arrow out */}
          <div className="shrink-0 flex items-center justify-center px-5">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL} / 0.35)` }} />
          </div>

          {/* RIGHT — Governed Output */}
          <div className="w-[390px] shrink-0 flex flex-col gap-3">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Retail-banking-native experience</p>
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
    { name: "Adobe / Sitecore", layer: "Web &amp; CMS", color: BLUE },
    { name: "Salesforce Marketing Cloud", layer: "Campaign &amp; CRM", color: BLUE },
    { name: "Workfront / Aprimo", layer: "Marketing Ops", color: BLUE },
    { name: "GRC / Compliance suite", layer: "Policy &amp; Risk", color: BLUE },
    { name: "Core banking + DWH", layer: "Records &amp; Data", color: BLUE },
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
    { name: "Jasper / Writer for Banking", funding: "Public / $200M+", round: "Series C · 2024", what: "Brand-tuned content AI. Generates fast, but does not encode this bank&apos;s prior approvals or compliance interpretations.", color: GREEN },
    { name: "Adobe GenStudio", funding: "Public", round: "Adobe · 2024", what: "Generative campaign factory. Strong production, but treats brand &amp; compliance as a static prompt, not a living memory layer.", color: SEAFOAM },
    { name: "Saifr / Hadrius", funding: "$10-30M", round: "Compliance AI · 2024", what: "Reviews marketing copy against regulation. Document-level checks, not the bank&apos;s own decision memory.", color: BLUE },
    { name: "In-house \"AI for Bank\" stacks", funding: "Internal", round: "Most CEE/EU banks", what: "Custom RAG over policies and brand docs. Useful, but no governed memory layer that learns from every approval and reuse.", color: GOLD },
  ];

  const moatLayers = [
    { layer: "AACE v3.1 Specification", desc: "Proprietary context engine: intent-locking, brand &amp; policy-aware injection, drift detection. The plumbing every banking AI workflow will need.", icon: <Cpu size={20} /> },
    { layer: "Compounding Brand &amp; Compliance Memory", desc: "Approved campaigns, regulator nudges, internal interpretations, exception logic — graph deepens campaign-by-campaign. Switching cost grows organically.", icon: <Layers size={20} /> },
    { layer: "Reference-Customer Path", desc: "First retail bank becomes the CEE reference architecture. Active conversations with marketing leaders at OTP and peers create a credible route to embedding across the region.", icon: <Network size={20} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>Category Thesis & Moat</p>

        <h2 className="font-black mb-5" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Banking AI tools draft copy and summarize policy.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>No one has shipped the brand &amp; compliance memory layer that encodes how this bank actually decides.</span>
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
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Marketing pilot · Optional strategic stake</p>
              </div>
            </div>
          </div>
          <div className="w-px h-16 shrink-0" style={{ background: `hsl(${TEAL} / 0.2)` }} />
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35 }}>
              Others draft copy and check policy.{" "}
              <span style={{ color: `hsl(${TEAL})` }}>LIZA encodes how your bank decides.</span>
            </p>
            <p className="mt-1" style={{ fontSize: 17, color: MUTED }}>
              The instruction layer every banking AI stack will need: brand interpretations, prior approvals, regulator nudges, exception logic — versioned and queryable. Same architecture validated across regulated industries, now being focused into retail banking marketing.
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
                { label: "TAM", value: "$45B+", desc: "Banking marketing &amp; martech spend, EU + global" },
                { label: "SAM", value: "$5-7B", desc: "AI control layer across marketing, compliance review, customer comms" },
                { label: "SOM", value: "$300-400M", desc: "EU retail-banking wedge: top-100 banks, marketing &amp; compliance leaders" },
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
              Sources: Statista &amp; eMarketer, Banking marketing &amp; martech spend estimates, 2024-2025. EBA / DORA / EU AI Act-driven compliance review market sizing, 2025. SAM/SOM are LIZA OS estimates based on the brand, marketing, and compliance review layer inside these markets.
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
    { old: "Banks buy point AI tools because vendors trained them to buy by use case", now: "LIZA creates one governed brand &amp; compliance memory loop that powers every AI workflow in the bank", color: TEAL },
    { old: "Generic AI tools ignore how brand leads, product marketers, and compliance reviewers actually work", now: "The experience becomes native to retail-banking roles, language, approvals, and handoffs", color: GOLD },
    { old: "Prompts and brand templates stay static, so every team has to remember what changed in product or regulation", now: "Brand &amp; compliance memory is versioned, updated, and reused after every campaign and approval", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${GOLD})` }}>Strategic Pivot</p>
        <h2 className="font-black mb-5" style={{ fontSize: 56, color: TEXT, lineHeight: 1.05 }}>
          LIZA is not selling another banking AI tool. <span style={{ color: `hsl(${GOLD})` }}>It is verticalizing the brand &amp; compliance memory loop.</span>
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
                <p className="font-semibold mt-1" style={{ fontSize: 16, color: MUTED }}>Now explained as the strategic pivot from software use cases to reusable project memory.</p>
              </div>
            </div>
            {[
              { label: "Define", desc: "Brand, product, and compliance leads encode standards, exceptions, and decision logic", icon: <BookOpen size={22} /> },
              { label: "Execute", desc: "AI applies that context inside live campaigns, disclosures, and customer comms", icon: <Zap size={22} /> },
              { label: "Capture", desc: "Approvals, edits, and regulator nudges are structured back into memory", icon: <Eye size={22} /> },
              { label: "Update", desc: "Brand &amp; compliance memory improves and propagates across the bank", icon: <RefreshCw size={22} /> },
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
      output: "Versioned brand &amp; compliance playbooks ready",
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
          Each cycle compounds your bank&apos;s collective brand &amp; compliance intelligence.
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
      title: "Retail-banking marketing leader",
      subtitle: "Banking signal",
      scope: "Marketing + compliance discovery",
      color: TEAL,
      outcome: "Live access to real retail-banking marketing pain",
      metric: "Active",
      metricLabel: "Discussion",
      points: [
        "Active conversation with the marketing leadership of a major CEE retail bank",
        "Direct signal that the brand &amp; compliance memory problem is real and strategically relevant",
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
        "800+ audit questions processed through governed execution",
        "Full compliance traceability maintained throughout",
      ],
      featured: false,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <div className="mb-8">
          <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>Pattern Proof Across Industries</p>
          <h2 className="font-black max-w-[1480px]" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
            The horizontal infrastructure works. <span style={{ color: `hsl(${GREEN})` }}>The next risk is vertical adoption.</span>
          </h2>
          <p className="mt-3" style={{ fontSize: 20, color: MUTED, maxWidth: 1320, lineHeight: 1.45 }}>
            Cross-industry pilots proved the same loop: expert judgment must be captured, enforced, and updated. Retail banking marketing is where the experience now needs to become native.
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
      vertical: "Marketing &amp; Brand", status: "Wedge", color: GREEN,
      icon: <FileText size={24} style={{ color: `hsl(${GREEN})` }} />,
      problem: "Marketing redoes briefs and landing pages because brand, product, and compliance changes do not propagate. AI drafts from the public site, not from prior approvals.",
      result: "Brand-aware briefs. Reusable campaign memory. Faster, sharper launches.",
      proof: "Initial entry point with retail-banking marketing leaders (e.g. OTP-style ICP)",
    },
    {
      vertical: "Compliance &amp; Customer Comms", status: "Anchor", color: TEAL,
      icon: <Workflow size={24} style={{ color: `hsl(${TEAL})` }} />,
      problem: "Disclosures, KYC adjudications, and complaint replies live in disconnected tools. AI cannot reason across them. Decision memory dies between teams.",
      result: "Unified disclosure, KYC, and complaint lifecycle. Every AI response grounded in this bank&apos;s prior approvals and policy interpretations.",
      proof: "Target embedding path across CMS, marketing cloud, and GRC suites",
    },
    {
      vertical: "Underwriting, Audit &amp; Reporting", status: "Expansion", color: GOLD,
      icon: <Shield size={24} style={{ color: `hsl(${GOLD})` }} />,
      problem: "Credit memos, audit responses, and regulator filings diverge from internal standards. Decision rationale evaporates after sign-off. Auditors inherit fragmented narrative.",
      result: "Standards-aware memos. Living audit memory. Regulator-grade artifacts, every time.",
      proof: "Risk &amp; audit extension path once marketing &amp; compliance loop is in production",
    },
  ];

  const expandInto = [
    { name: "Wealth &amp; advisory communications", col: TEAL },
    { name: "AML / fraud narrative reviews", col: "215 25% 50%" },
    { name: "Credit &amp; risk memo drafting", col: GOLD },
    { name: "Regulator filings &amp; ESG reporting", col: GREEN },
    { name: "Branch &amp; contact-center playbooks", col: ACCENT },
    { name: "Internal training &amp; onboarding", col: "330 70% 55%" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Banking Expansion Path</p>

        <div className="mb-6 flex items-start justify-between gap-8">
          <h2 className="font-black max-w-[1180px]" style={{ fontSize: 56, color: TEXT, lineHeight: 1.02 }}>
            One brand &amp; compliance memory layer.{" "}
            <span style={{ color: `hsl(${GREEN})` }}>Every customer-facing surface.</span>
          </h2>
          <div className="w-[280px] rounded-2xl px-5 py-4 shrink-0"
            style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 11, color: MUTED }}>
              The thesis
            </p>
            <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})`, lineHeight: 1.2 }}>
              The missing connective tissue underneath the banking AI stack.
            </p>
            <p className="mt-2" style={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
              Current signal: live conversations with retail-banking marketing leadership, not a closed contract claim.
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
                Expansion across the bank lifecycle. Partnership path on the next slide.
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
      phase: "Months 0-3",
      title: "Marketing Pilot",
      color: GREEN,
      desc: "30-day pilot with the bank&apos;s marketing &amp; compliance team on one workflow (e.g. campaign brief, landing page, disclosure). Low commitment, fast signal.",
    },
    {
      phase: "Months 3-12",
      title: "Marketing Memory Layer",
      color: TEAL,
      desc: "LIZA becomes the brand &amp; compliance memory layer for the marketing organization. Reusable across campaigns, geographies, and product lines.",
    },
    {
      phase: "Months 12-24",
      title: "Bank-Wide Memory Layer",
      color: GOLD,
      desc: "Expand from marketing into compliance, KYC, complaints, and underwriting. LIZA becomes the bank&apos;s instruction layer underneath every AI workflow. Optional strategic stake unlocks CEE reference-architecture rights.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-12">
        <div className="mb-10 text-center">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            Banking GTM Mechanic
          </p>
          <h2 className="font-black max-w-[1440px] mx-auto" style={{ fontSize: 62, color: TEXT, lineHeight: 1.02 }}>
            A 24-month ladder from <span style={{ color: `hsl(${TEAL})` }}>marketing pilot</span> to <span style={{ color: `hsl(${GOLD})` }}>bank-wide memory layer</span>.
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
            { label: "AI Standards Diagnostic", desc: "Live tool. Marketing &amp; compliance teams self-assess AI maturity.", color: GOLD },
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
            Guided entry. Self-serve product. Credit upside.{" "}
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
                  "Diagnostic identifies marketing &amp; compliance rework and creates urgency",
                  "Marketing pilot proves one workflow (brief, page, disclosure) with minimal adoption friction",
                  "Self-serve UX turns brand &amp; compliance workflows into repeatable product usage",
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
        "Bank selects one high-value marketing workflow (e.g. campaign brief, landing page, disclosure copy)",
        "Platform guides structured capture from 2-3 senior brand, product, and compliance leads",
        "LIZA auto-generates brand &amp; compliance-aware playbooks grounded in this bank&apos;s prior approvals",
      ],
      output: "3-5 brand &amp; compliance-aware playbooks ready",
    },
    {
      week: "Week 2-3",
      title: "Execute",
      icon: <Zap size={24} />,
      color: SEAFOAM,
      actions: [
        "Marketing team self-serves: run playbooks against live campaign briefs, pages, and disclosures",
        "Real campaigns, real reviewers, real customer-facing copy",
        "Platform tracks drift and captures feedback automatically",
      ],
      output: "Measurable quality delta: senior reviewer vs. AI-with-LIZA vs. AI-alone",
    },
    {
      week: "Week 4",
      title: "Prove",
      icon: <TrendingUp size={24} />,
      color: GREEN,
      actions: [
        "Automated review: hours saved per campaign, rework avoided, time-to-market reduced",
        "Brand &amp; compliance memory self-improves from every approval",
        "Business case for bank-wide rollout with real marketing &amp; compliance numbers",
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
          The wedge is one workflow. The product is the retail-banking-native memory loop.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Co-built with the first enterprise cohort.</span>
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
            { metric: "Banking-native", label: "Product direction", sub: "Role, workflow, and UI fit" },
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

  const advisors = [
    { name: "Tom Ray", role: "Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers", bio: "Leader in scaling global tech service companies and building enterprise infrastructure." },
    { name: "Enterprise Advisor", role: "VP Product Management, Global Enterprise Software Group (€6B+)", bio: "Senior product leader across regulated industries. 15+ years across desktop, cloud, mobile, AI, and data-driven product strategy in global enterprise software." },
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

        <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${GOLD})`, letterSpacing: "0.15em", textTransform: "uppercase" }}>Strategic Advisory Board</p>
        <div className="grid grid-cols-2 gap-7">
          {advisors.map((a) => (
            <div key={a.name} className="rounded-2xl border p-7"
              style={{ borderColor: `hsl(${GOLD} / 0.18)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-bold" style={{ fontSize: 28, color: TEXT }}>{a.name}</p>
              <p className="mb-3" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>{a.role}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{a.bio}</p>
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
          <h2 className="font-black mb-3" style={{ fontSize: 72, color: TEXT, lineHeight: 1.05 }}>
            Become a customer first. <span style={{ color: `hsl(${TEAL})` }}>Invest if you want to own the category with us.</span>
          </h2>
          <p style={{ fontSize: 22, color: MUTED, maxWidth: 1280, marginInline: "auto", lineHeight: 1.45 }}>
            Pilot the marketing memory layer in 30 days. If it earns its place inside your campaign and compliance workflow, you choose whether to take a strategic stake in the company that shipped it.
          </p>
        </div>

        {/* Two doors */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* DOOR 1 — Customer */}
          <div className="rounded-2xl border-2 p-7 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-black tracking-[0.18em] uppercase" style={{ fontSize: 12, color: `hsl(${TEAL})` }}>Door 1 · Recommended</p>
              <span className="px-2.5 py-1 rounded-full font-bold" style={{ fontSize: 11, background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})` }}>Start here</span>
            </div>
            <p className="font-black mb-2" style={{ fontSize: 32, color: TEXT, lineHeight: 1.1 }}>Become a customer.</p>
            <p className="mb-4" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
              Run a 30-day marketing pilot on one workflow you already own — campaign briefs, landing pages, or disclosures. We codify the brand, product, and compliance judgment that lives in your senior marketing and legal leads, then prove it inside your environment.
            </p>
            <div className="grid grid-cols-1 gap-2 mt-auto">
              {[
                { k: "30 days", v: "Pilot one marketing workflow with your team's brand and compliance judgment encoded." },
                { k: "Quarter 2", v: "Convert to the marketing memory layer across briefs, landing pages, and disclosures." },
                { k: "Year 1", v: "Standard memory layer across markets, segments, and regulated channels." },
              ].map(({ k, v }) => (
                <div key={k} className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <span className="font-bold shrink-0" style={{ fontSize: 13, color: `hsl(${TEAL})`, minWidth: 78 }}>{k}</span>
                  <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DOOR 2 — Strategic stake */}
          <div className="rounded-2xl border-2 p-7 flex flex-col"
            style={{ borderColor: `hsl(${GOLD} / 0.32)`, background: `hsl(${GOLD} / 0.05)` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-black tracking-[0.18em] uppercase" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>Door 2 · Optional</p>
              <span className="px-2.5 py-1 rounded-full font-bold" style={{ fontSize: 11, background: `hsl(${GOLD} / 0.15)`, color: `hsl(${GOLD})` }}>If we earn it</span>
            </div>
            <p className="font-black mb-2" style={{ fontSize: 32, color: TEXT, lineHeight: 1.1 }}>Take a strategic stake.</p>
            <p className="mb-4" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
              €3M strategic minority alongside the customer relationship. 18-month runway to harden the marketing memory layer, ship usage-priced rollout, and build the retail-banking beachhead across CEE with you on the inside.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { pct: "35%", label: "Banking-Native Product UX", color: ACCENT },
                { pct: "25%", label: "Usage + Billing Infra", color: GREEN },
                { pct: "25%", label: "Integrations + Pilots", color: GOLD },
                { pct: "15%", label: "GTM + Operations", color: MUTED },
              ].map(({ pct, label, color }) => (
                <div key={label} className="rounded-lg border px-3 py-2 text-center"
                  style={{ borderColor: `hsl(${color} / 0.22)`, background: `hsl(${color} / 0.05)` }}>
                  <p className="font-black" style={{ fontSize: 18, color: TEXT, lineHeight: 1 }}>{pct}</p>
                  <p className="font-bold mt-0.5" style={{ fontSize: 11, color: `hsl(${color})` }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 mt-auto">
              {[
                { k: "Month 6", v: "Banking-native UX live with first lighthouse retail-bank deployments." },
                { k: "Month 12", v: "Usage-priced rollout. CMS / marketing-cloud / GRC integration path in market." },
                { k: "Month 18", v: "€1.5–2.5M ARR. 8–12 retail-banking customers on the marketing memory layer." },
              ].map(({ k, v }) => (
                <div key={k} className="flex items-start gap-3 rounded-lg px-3 py-2"
                  style={{ background: `hsl(${GOLD} / 0.04)`, border: `1px solid hsl(${GOLD} / 0.14)` }}>
                  <span className="font-bold shrink-0" style={{ fontSize: 13, color: `hsl(${GOLD})`, minWidth: 78 }}>{k}</span>
                  <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.5 }}>
            Pilot first. Investment is not a prerequisite —{" "}
            <strong style={{ color: `hsl(${TEAL})` }}>it's the natural second step once the marketing memory layer earns its place inside your retail-banking operations.</strong>
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
  { id: 3, title: "Where Missing Context Shows Up in Automotive R&D", component: <Slide03 /> },
  { id: 4, title: "What Missing Context Costs in Automotive R&D", component: <Slide04Cost /> },
  { id: 5, title: "Early Validation", component: <Slide08 /> },
  { id: 6, title: "Why Now", component: <SlideWhyNow /> },
  { id: 7, title: "The Context Layer", component: <Slide05 /> },
  { id: 8, title: "Strategic Pivot", component: <SlideVerticalization /> },
  { id: 9, title: "Category Thesis & Moat", component: <Slide06 /> },
  { id: 10, title: "Expansion Path", component: <Slide09 /> },
  { id: 11, title: "Strategic Partnership Path", component: <Slide09Partnership /> },
  { id: 12, title: "Shape of the Company", component: <SlideShape /> },
  { id: 13, title: "What's Built", component: <Slide10 /> },
  { id: 14, title: "Business Model", component: <Slide11 /> },
  { id: 15, title: "30-Day Challenge", component: <SlideExecutionChallenge /> },
  { id: 16, title: "Team", component: <Slide12 /> },
  { id: 17, title: "The Ask", component: <Slide13 /> },
  { id: 18, title: "Appendix", component: <SlideAppendixDivider /> },
  { id: 19, title: "Appendix: How It Works", component: <Slide07 /> },
  { id: 20, title: "Appendix: Architecture", component: <SlideArchitecture /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AutomotiveInvestorDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Automotive-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS · Automotive Investor Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Automotive-Investor-Deck" slideCount={SLIDES.length} />
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS · Automotive Investor Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Automotive-Investor-Deck" slideCount={SLIDES.length} />
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

import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, Check, CheckCircle2, DollarSign,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
  Layers, Eye, Workflow, Lightbulb, Award, Database, Brain, Cpu, Clock, Rocket, FileText,
  Pill, FlaskConical, Microscope, FileCheck, HeartPulse, Factory,
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
            LIZA OS · Life Sciences · Customer First, Investor Optional
          </span>
        </div>

        <h1 className="font-black mb-6" style={{ fontSize: 82, lineHeight: 1.05, color: TEXT }}>
          The Trial &amp; Submission Memory Layer<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            for AI-Native Pharma.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          No one has shipped the GxP memory layer yet. The first sponsor, CRO, or CMO to codify it with us defines the standard the rest of the industry adopts.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Become a customer first. Take a strategic stake if you want to own the category with us.</span>
        </p>

        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; Two-Door Conversation &nbsp;·&nbsp; Pilot · Memory Layer · Optional Strategic Stake
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
    { label: "Pharma", sub: "GxP · Deviations · CSRs", active: true, color: TEAL },
    { label: "AEC", sub: "RFI · Submittals · Handover", active: false, color: BLUE },
    { label: "GTM", sub: "Sales · CS · Onboarding", active: false, color: MUTED },
    { label: "Prof. Services", sub: "Delivery · Methods", active: false, color: MUTED },
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
          One OS. <span style={{ color: `hsl(${TEAL})` }}>Pharma is the spear.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          We build a single context layer and deploy it vertical-by-vertical. You are investing in pharma specifically — and benefiting from platform leverage already shipping into AEC, GTM, and professional services.
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
                    YOUR ROUND
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
              The pharma vertical thesis. Category leadership in GxP execution.
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
              Standard equity + pharma board observer + commercial visibility on the vertical roadmap.
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
  const inputs = ["SOPs", "Protocols", "Batch records", "Validation specs", "Annex/ICH refs", "Trial data"];
  const outputs = ["Deviation reports", "CSRs", "Submissions", "CAPAs", "PV narratives", "Audit responses"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
          The Context Gap
        </p>

        <h2 className="font-black mb-10" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08 }}>
          Companies have inputs. AI generates outputs.<br />
          <span style={{ color: `hsl(${WARM})` }}>There's no system to make AI work to your standards.</span>
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
              But none of it is queryable by AI. It sits in files no model can reason over.
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
              But without your standards, every output is generic: the average, not the expert.
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

const PHARMA_GAP_CASES = [
  {
    name: "Sponsor / BioPharma",
    icon: <Shield size={22} style={{ color: `hsl(${RED})` }} />,
    accent: RED,
    records: ["Protocols", "Investigator brochures", "Submission modules"],
    output: "Protocol drafts · CTD module narratives",
    gap: "AI drafts from the visible documents, but misses the protocol amendment, prior agency feedback, or therapeutic-area precedent the senior medical writer already knows.",
    cost: "Submission delay. RTF risk. Approval slip.",
  },
  {
    name: "CRO / Clinical Operations",
    icon: <Briefcase size={22} style={{ color: `hsl(${WARM})` }} />,
    accent: WARM,
    records: ["ICH-GCP refs", "Site SOPs", "Monitoring plans"],
    output: "Monitoring reports · Query responses",
    gap: "AI gives an ICH-GCP-compliant answer, but not the sponsor-specific interpretation already aligned with the medical monitor and prior protocol deviations.",
    cost: "Data integrity findings. Audit observations.",
  },
  {
    name: "GMP Manufacturing & QA",
    icon: <DollarSign size={22} style={{ color: `hsl(${GOLD})` }} />,
    accent: GOLD,
    records: ["SOPs", "Batch records", "Validation reports"],
    output: "Deviation reports · CAPA records",
    gap: "AI summarises the deviation, but misses the Annex 1 nuance, the batch-specific exception, and the prior CAPA pattern that determines whether the lot is releasable.",
    cost: "Batch reject. 483 observation. Recall risk.",
  },
];

const PHARMA_COST_BENCHMARKS = [
  {
    value: "$2.6B",
    label: "average capitalized R&D cost to bring a single new prescription drug to market, including failures and time costs",
    source: "Tufts Center for the Study of Drug Development, 2016 (DiMasi et al.)",
  },
  {
    value: "~10%",
    label: "of drug candidates entering Phase I clinical trials are eventually approved; ~90% of late-stage failures are tied to efficacy, safety, or operational execution",
    source: "Wong, Siah, Lo (Biostatistics, 2019); BIO/Informa Pharma Intelligence",
  },
  {
    value: "30–40%",
    label: "of pharma quality events involve repeat deviations or known root causes, indicating CAPA knowledge does not propagate across batches and sites",
    source: "ISPE & PDA quality metrics benchmarks",
  },
];

function Slide03() {
  const alsoApplies = ["Pharmacovigilance", "Regulatory affairs", "Medical affairs", "Clinical data mgmt", "Supply chain & cold chain", "Medical devices"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Where Missing Context Shows Up in Life Sciences
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 48, color: TEXT, lineHeight: 1.08, maxWidth: 1680 }}>
          The artifacts exist. The AI produces an output. <span style={{ color: `hsl(${TEAL})` }}>The missing piece is expert judgment.</span>
        </h2>

        <div className="flex flex-col gap-3 flex-1 min-h-0 mb-3">
          {PHARMA_GAP_CASES.map((item) => (
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
          What Missing Context Costs in Life Sciences
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 48, color: TEXT, lineHeight: 1.08, maxWidth: 1640 }}>
          Missing context becomes expensive because it delays trials, blocks releases, and triggers <span style={{ color: `hsl(${WARM})` }}>avoidable regulatory exposure.</span>
        </h2>

        <div className="grid grid-cols-[360px_1fr] gap-5 mb-4">
          <div className="rounded-[28px] border px-7 py-7" style={{ borderColor: `hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.05)` }}>
            <p className="font-black" style={{ fontSize: 78, color: `hsl(${WARM})`, lineHeight: 0.95 }}>$1.3M</p>
            <p className="font-bold mt-2" style={{ fontSize: 23, color: TEXT, lineHeight: 1.18 }}>
              average daily cost of a delayed Phase III trial
            </p>
            <p className="mt-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>
              This is the part AI can amplify if it runs without the latest protocol amendment, prior agency feedback, deviation precedent, or sponsor standard.
            </p>
            <p className="mt-4" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.45 }}>
              Tufts CSDD &amp; Cutting Edge Information benchmarks, oncology Phase III median
            </p>
          </div>

          <div className="rounded-[28px] border px-7 py-6" style={{ borderColor: `hsl(${TEAL} / 0.18)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PHARMA_COST_BENCHMARKS.map((item) => (
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
                If AI produces a plausible answer inside a deviation, CAPA, protocol amendment, CSR section, or PV narrative <span className="font-bold">without the full GxP context</span>, QA still has to catch it, correct it, and re-route it through review.
              </p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                On a <span className="font-bold" style={{ color: TEXT }}>$300M Phase III program</span>, a 30-day avoidable delay implies roughly <span className="font-bold" style={{ color: TEXT }}>$40M of NPV at risk</span> before considering peak-sales erosion from a later launch.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          {[
            { label: "Time-to-approval", value: "delayed", desc: "Senior writers and QA spend cycles fixing AI-assisted work instead of moving the submission and the release forward.", color: RED },
            { label: "Compliance", value: "exposed", desc: "Wrong outputs create deviation loops, re-validation cycles, and 483 / Form 1572 risk across trials, batches, and PV cases.", color: WARM },
            { label: "AI usage", value: "cannot scale safely", desc: "Without GxP governance, QA leaders limit adoption because every output creates regulatory, patient safety, and product release risk.", color: GOLD },
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
      metric: "Jan '25",
      label: "FDA AI/ML draft guidance for drug & biological products",
      insight: "Regulators now expect lifecycle governance, traceability, and credibility evidence for every AI-assisted output.",
      color: TEAL,
      source: "FDA CDER/CBER draft guidance, Jan 2025; EMA reflection paper, Sep 2024",
    },
  ];

  const shifts = [
    { shift: "GenAI moved into GxP workflows", result: "Sponsors and CMOs piloted LLMs in deviations, CSRs, PV narratives. The audit trail did not follow." },
    { shift: "Regulators now ask 'how was this output governed?'", result: "FDA AI/ML guidance, EMA reflection paper, ICH E6(R3), and EU AI Act all require lifecycle traceability for AI-assisted GxP work." },
    { shift: "The senior QA & medical writing bottleneck hit", result: "Approvals are senior-talent-bound. Every hour a reviewer spends correcting AI is an hour not spent moving the molecule forward." },
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
    { title: "Pharma roles", items: "Medical writer, QA lead, reg affairs, PV scientist", color: TEAL },
    { title: "GxP workflows", items: "Deviation, CAPA, CSR section, PV narrative, submission", color: GOLD },
    { title: "Pharma language", items: "Annex 1/11, ICH E6(R3), 21 CFR Part 11, ALCOA+, MedDRA", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Horizontal Core · Vertical Surface
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          The platform is horizontal. <span style={{ color: `hsl(${TEAL})` }}>Adoption happens through a GxP-native experience.</span>
        </h2>
        <div className="grid grid-cols-[1fr_60px_1.1fr_60px_1fr] gap-3 items-stretch mb-1">
          <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `hsl(${BLUE} / 0.16)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${BLUE})` }}>Input</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Protocols, SOPs, batch records, validation specs, Annex/ICH refs, prior agency feedback</p>
          </div>
          <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${TEAL} / 0.4)` }} /></div>
          <div className="rounded-2xl border-2 px-6 py-4 text-center" style={{ borderColor: `hsl(${TEAL} / 0.32)`, background: `hsl(${TEAL} / 0.07)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${TEAL})` }}>LIZA OS</p>
            <p className="font-black" style={{ fontSize: 21, color: TEXT }}>The in-between operating layer that turns raw context into governed execution</p>
          </div>
          <div className="flex items-center justify-center"><ArrowRight size={26} style={{ color: `hsl(${TEAL} / 0.4)` }} /></div>
          <div className="rounded-2xl border px-5 py-4" style={{ borderColor: `hsl(${GREEN} / 0.16)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-black tracking-[0.16em] uppercase mb-1" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Output</p>
            <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>AI work that follows trial memory, validated SOPs, and QA judgment</p>
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
              LIZA provides the reusable knowledge loop. <span style={{ color: `hsl(${GOLD})`, fontWeight: 700 }}>Strategic capital turns it into the GxP operating experience.</span>
            </p>
          </div>

          {/* Arrow out */}
          <div className="shrink-0 flex items-center justify-center px-5">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL} / 0.35)` }} />
          </div>

          {/* RIGHT — Governed Output */}
          <div className="w-[390px] shrink-0 flex flex-col gap-3">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>GxP-native experience</p>
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
    { name: "Procore / ACC", layer: "Project Mgmt", color: BLUE },
    { name: "Bluebeam / Newforma", layer: "RFI & Markup", color: BLUE },
    { name: "Revit / Allplan", layer: "Design / BIM", color: BLUE },
    { name: "Navisworks / Solibri", layer: "Coordination", color: BLUE },
    { name: "Document Crunch", layer: "Spec Compliance", color: BLUE },
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
    { name: "Veeva Vault AI", funding: "Public", round: "Veeva · 2024", what: "AI features layered onto eTMF, QualityDocs, RIM. System of record, not a governed reasoning layer.", color: GREEN },
    { name: "Saama / Tempus AI", funding: "$430M / Public", round: "Clinical AI · 2024", what: "Clinical data review and trial analytics. Reads study data, doesn't encode sponsor judgment.", color: SEAFOAM },
    { name: "MasterControl AI / TrackWise", funding: "Public / Honeywell", round: "eQMS incumbents", what: "Workflow + document AI inside the QMS. No cross-site deviation memory or CAPA precedent loop.", color: BLUE },
    { name: "Generic LLM stacks (OpenAI / Anthropic)", funding: "Mega-cap", round: "In every pharma pilot", what: "General reasoning. No GMP context, no SOP grounding, no validated audit trail.", color: GOLD },
  ];

  const moatLayers = [
    { layer: "AACE v3.1 Specification", desc: "Proprietary context engine: intent-locking, GxP-aware injection, drift detection. The plumbing every regulated AI workflow will need.", icon: <Cpu size={20} /> },
    { layer: "Compounding GxP Memory", desc: "Deviation precedent, CAPA outcomes, validated SOPs, agency feedback — graph deepens batch-by-batch and study-by-study. Switching cost grows organically.", icon: <Layers size={20} /> },
    { layer: "Validated Audit Trail by Design", desc: "Every AI output is versioned, traceable, and tied to the source instruction. The default substrate for 21 CFR Part 11 / Annex 11 era AI.", icon: <Network size={20} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>Category Thesis & Moat</p>

        <h2 className="font-black mb-5" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Pharma AI tools surface data and draft documents.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>No one has shipped the GxP memory layer that encodes your sponsor's judgment.</span>
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
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>€3M Strategic Round</p>
              </div>
            </div>
          </div>
          <div className="w-px h-16 shrink-0" style={{ background: `hsl(${TEAL} / 0.2)` }} />
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35 }}>
              Others read documents and dashboards.{" "}
              <span style={{ color: `hsl(${TEAL})` }}>LIZA encodes how your quality and clinical leaders decide.</span>
            </p>
            <p className="mt-1" style={{ fontSize: 17, color: MUTED }}>
              The instruction layer every pharma AI stack will need: SOP nuance, deviation precedent, agency feedback, sponsor standards — versioned, validated, and queryable. Same architecture validated across regulated industries, now being focused into life sciences.
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
                { label: "TAM", value: "$15B+", desc: "Life sciences R&D + quality software by 2030 (eTMF, eQMS, RIM, PV)" },
                { label: "SAM", value: "$3-4B", desc: "AI governance layer across clinical, quality, regulatory, PV" },
                { label: "SOM", value: "$200-300M", desc: "EU/US sponsor wedge: mid/large pharma + biotech + CRO" },
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
              Sources: Grand View Research, Life Sciences Software Market, 2024-2030. MarketsandMarkets, eClinical / eTMF / eQMS markets, 2024-2030. SAM/SOM are LIZA OS estimates based on the AI governance and reasoning layer inside these markets.
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
    { old: "Customers ask for one use case because eTMF/LIMS/eQMS trained them to buy point solutions", now: "LIZA creates one governed GxP knowledge loop that powers deviation, CAPA, CSR, and PV workflows together", color: TEAL },
    { old: "Generic AI tools ignore how QA, medical writers, reg affairs, and PV scientists actually work", now: "The experience becomes native to pharma roles, ICH/Annex language, and validated handoffs", color: GOLD },
    { old: "Prompts and templates stay static, so every site and study has to remember what changed", now: "Trial and quality memory is versioned, validated, and reused after every execution", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${GOLD})` }}>Strategic Pivot</p>
        <h2 className="font-black mb-5" style={{ fontSize: 56, color: TEXT, lineHeight: 1.05 }}>
          LIZA is not selling another GxP point tool. <span style={{ color: `hsl(${GOLD})` }}>It is verticalizing the knowledge loop.</span>
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
              { label: "Define", desc: "Experts encode standards, exceptions, decision logic", icon: <BookOpen size={22} /> },
              { label: "Execute", desc: "AI applies that context inside live workflows", icon: <Zap size={22} /> },
              { label: "Capture", desc: "Feedback, drift, and project learning are structured", icon: <Eye size={22} /> },
              { label: "Update", desc: "Project memory improves and propagates", icon: <RefreshCw size={22} /> },
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
            The infrastructure is proven horizontally. <span style={{ color: `hsl(${GREEN})` }}>Now we vertically integrate into pharma.</span>
          </h2>
          <p className="mt-3" style={{ fontSize: 20, color: MUTED, maxWidth: 1320, lineHeight: 1.45 }}>
            Across AEC departments and adjacent regulated work, the same loop holds: expert judgment must be captured, enforced, and updated. The next milestone is one GxP-native lighthouse partner — sponsor, CRO, or CMO — to make this experience native under validated, audit-grade conditions. Active conversations underway; first design partner is the immediate ask.
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
      vertical: "Discovery & Trials", status: "Wedge", color: GREEN,
      icon: <FileText size={24} style={{ color: `hsl(${GREEN})` }} />,
      problem: "Medical writers redo CSR sections because protocol amendments and prior agency feedback don't propagate. AI drafts from generic literature, not your therapeutic-area precedent.",
      result: "Protocol-aware writing. Submission memory across studies. Faster, sharper CTD modules.",
      proof: "Adjacent to Veeva Vault Clinical, Saama, and Tempus AI workflows",
    },
    {
      vertical: "Manufacturing & Release", status: "Anchor", color: TEAL,
      icon: <Workflow size={24} style={{ color: `hsl(${TEAL})` }} />,
      problem: "Deviations, CAPAs, and batch records live in disconnected eQMS/LIMS instances. AI can't reason across them. CAPA knowledge dies between sites.",
      result: "Unified deviation & CAPA lifecycle. Every AI response grounded in this batch's SOPs, Annex 1 nuance, and prior deviation precedent.",
      proof: "Target embedding path across Veeva Vault Quality, MasterControl, and TrackWise workflows",
    },
    {
      vertical: "Pharmacovigilance & Post-Market", status: "Expansion", color: GOLD,
      icon: <Shield size={24} style={{ color: `hsl(${GOLD})` }} />,
      problem: "PV narratives and PSURs diverge from sponsor standards. Signal knowledge evaporates between case waves. Safety teams inherit fragmented data.",
      result: "MedDRA-aware narratives. Living signal memory. Audit-grade PV artifacts, every cycle.",
      proof: "PV / RWE extension path once quality and clinical integrations are in market",
    },
  ];

  const expandInto = [
    { name: "Regulatory submissions (CTD/eCTD)", col: TEAL },
    { name: "GxP audit readiness & 483 response", col: "215 25% 50%" },
    { name: "Method validation & CSV/CSA", col: GOLD },
    { name: "Clinical data review & queries", col: GREEN },
    { name: "Supply chain & cold-chain QA", col: ACCENT },
    { name: "Medical devices (ISO 13485 / MDR)", col: "330 70% 55%" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Life Sciences Expansion Path</p>

        <div className="mb-6 flex items-start justify-between gap-8">
          <h2 className="font-black max-w-[1180px]" style={{ fontSize: 56, color: TEXT, lineHeight: 1.02 }}>
            One trial &amp; quality memory layer.{" "}
            <span style={{ color: `hsl(${GREEN})` }}>Every phase of the molecule.</span>
          </h2>
          <div className="w-[280px] rounded-2xl px-5 py-4 shrink-0"
            style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 11, color: MUTED }}>
              The thesis
            </p>
            <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})`, lineHeight: 1.2 }}>
              The missing connective tissue underneath the pharma AI stack.
            </p>
            <p className="mt-2" style={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
              Current signal: AEC vertical proven across 3 departments. Pharma lighthouse partner being recruited — not a Veeva integration claim.
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
                Expansion across the molecule lifecycle. Partnership path on the next slide.
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
      phase: "Months 0-6",
      title: "Co-Sell",
      color: GREEN,
      desc: "Warm intros into mid/large pharma quality and clinical ops accounts. LIZA sits alongside Veeva, MasterControl, and TrackWise; partners open doors. Low commitment, fast signal.",
    },
    {
      phase: "Months 6-12",
      title: "Joint 30-Day Pilots",
      color: TEAL,
      desc: "Co-branded Deviation & CAPA Lifecycle Sprint productized with a system-of-record partner. Generates GxP case studies plus revenue share.",
    },
    {
      phase: "Months 12-24",
      title: "Embedded Instruction Layer",
      color: GOLD,
      desc: "LIZA becomes the governance and memory layer underneath one major life sciences platform. Start with eQMS for deviations and CAPAs, then expand to clinical for protocol amendments and CSR memory.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-12">
        <div className="mb-10 text-center">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            Pharma Ecosystem GTM Mechanic
          </p>
          <h2 className="font-black max-w-[1440px] mx-auto" style={{ fontSize: 62, color: TEXT, lineHeight: 1.02 }}>
            A 24-month ladder from <span style={{ color: `hsl(${TEAL})` }}>co-sell</span> to <span style={{ color: `hsl(${GOLD})` }}>embedded layer</span>.
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
        "Sponsor selects one high-value workflow (e.g. deviation triage, CAPA drafting, CSR section authoring)",
        "Platform guides structured capture from 2-3 senior QA, medical writers, or reg affairs leads",
        "LIZA auto-generates GxP-aware playbooks grounded in the site's SOPs, prior deviations, and agency feedback",
      ],
      output: "3-5 GxP-aware playbooks ready",
    },
    {
      week: "Week 2-3",
      title: "Execute",
      icon: <Zap size={24} />,
      color: SEAFOAM,
      actions: [
        "Quality / clinical team self-serves: run playbooks against live deviations, CAPAs, and CSR sections",
        "Real batches, real studies, real audit-grade deliverables",
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
        "Automated review: hours saved per deviation, rework avoided, audit-finding risk reduced",
        "GxP memory self-improves from every execution; full traceability preserved",
        "Business case for site-wide and study-wide rollout with real numbers",
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
          The wedge is one workflow. The product is the GxP-native knowledge loop.{" "}
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
            { metric: "GxP-native", label: "Product direction", sub: "Role, workflow, and validated audit fit" },
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
    { name: "Pharma Quality Advisor", role: "Senior QA / Regulatory Leader, Top-20 Pharma", bio: "Engagement underway with a senior quality and regulatory leader to anchor GxP fit, validation strategy, and sponsor-side adoption patterns." },
    { name: "Clinical Operations Advisor", role: "Head of Clinical Operations, Mid/Large Sponsor", bio: "Pipeline conversation to anchor protocol amendment, CSR authoring, and trial memory workflows in real sponsor reality." },
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
// SLIDE 13 — TWO-DOOR CONVERSATION (Customer first · Strategic stake optional)
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
            Pilot the GxP memory layer in 30 days. If it earns its place inside your operations, you choose whether to take a strategic stake in the company that shipped it.
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
              Run a 30-day GxP pilot on one workflow you already own — deviations, CAPA, or a CSR section. We codify the judgment that lives in your QA and medical writing leads, then prove it inside your environment.
            </p>
            <div className="grid grid-cols-1 gap-2 mt-auto">
              {[
                { k: "30 days", v: "Pilot one GxP workflow with your team's judgment encoded." },
                { k: "Quarter 2", v: "Convert to the GxP memory layer across deviations, CAPA, and CSR." },
                { k: "Year 1", v: "Standard memory layer across sites, sponsors, or programs." },
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
              €3M strategic minority alongside the customer relationship. 18-month runway to harden the GxP memory layer, ship usage-priced rollout, and build the life sciences beachhead with you on the inside.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { pct: "35%", label: "GxP-Native Product UX", color: ACCENT },
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
                { k: "Month 6", v: "GxP-native UX live with first lighthouse sponsor deployments." },
                { k: "Month 12", v: "Usage-priced rollout. Veeva / eQMS integration path in market." },
                { k: "Month 18", v: "€1.5–2.5M ARR. 12+ design partners on the GxP memory layer." },
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
            <strong style={{ color: `hsl(${TEAL})` }}>it's the natural second step once the GxP memory layer earns its place inside your operations.</strong>
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
  { id: 3, title: "Where Missing Context Shows Up in Pharma", component: <Slide03 /> },
  { id: 4, title: "What Missing Context Costs in Pharma", component: <Slide04Cost /> },
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
  { id: 17, title: "Two-Door Conversation", component: <Slide13 /> },
  { id: 18, title: "Appendix", component: <SlideAppendixDivider /> },
  { id: 19, title: "Appendix: How It Works", component: <Slide07 /> },
  { id: 20, title: "Appendix: Architecture", component: <SlideArchitecture /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PharmaInvestorDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Pharma-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS · Pharma Investor Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Pharma-Investor-Deck" slideCount={SLIDES.length} />
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS · Pharma Investor Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Pharma-Investor-Deck" slideCount={SLIDES.length} />
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

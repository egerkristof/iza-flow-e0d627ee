import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, RefreshCw,
  AlertTriangle, Check, Shield, Database, Satellite, Radio, Globe,
  Briefcase, Layers, Workflow, Award, Brain, Clock, FileText, Users,
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
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

// ─── Palette (cyan/teal axis distinct from /space) ───────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const TEAL = "200 95% 38%";    // satcom-cyan (deck primary)
const MINT = "180 90% 42%";    // accent
const WARM = "15 85% 55%";
const RED = "0 72% 50%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";
const GOLD = "45 95% 42%";

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
            LIZA OS · Satcom Operators · Strategic Conversation
          </span>
        </div>

        <h1 className="font-black mb-6" style={{ fontSize: 78, lineHeight: 1.05, color: TEXT }}>
          The Operator Memory Layer<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            for AI-Native Satellite Fleets.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          LIZA OS turns fleet operations playbooks, procurement governance, and spectrum precedent into the governed layer between AI inputs and AI outputs.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Customer Pilot · Co-Define the Standard · Reference Architecture</span>
        </p>

        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; For satellite operators &amp; fleet groups &nbsp;·&nbsp; Pilot + Open-Canvas Partnership
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE CONTEXT GAP (operator framing)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  const inputs = ["Anomaly playbooks", "Station-keeping SOPs", "ITU filings", "Vendor SOWs", "SLA frameworks", "EOL plans"];
  const outputs = ["Anomaly RCAs", "Procurement reviews", "Regulatory responses", "Acceptance reports", "Customer briefs", "Audit responses"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
          The Context Gap
        </p>

        <h2 className="font-black mb-10" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08 }}>
          Operators have inputs. AI generates outputs.<br />
          <span style={{ color: `hsl(${WARM})` }}>There's no system to make AI work to your fleet's standards.</span>
        </h2>

        <div className="flex items-stretch gap-0 flex-1 min-h-0 max-h-[420px]">
          <div className="flex-1 rounded-l-2xl border-2 p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.06)`, borderRight: "none" }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Input Artifacts</p>
            <p className="font-bold mb-6" style={{ fontSize: 22, color: TEXT }}>What operators feed AI today</p>
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
              But none of it is queryable by AI. It sits in OCC binders, vendor folders, and senior heads.
            </p>
          </div>

          <div className="w-[340px] shrink-0 border-y-2 flex flex-col items-center justify-center relative"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <div className="absolute left-0 top-8 bottom-8 w-px" style={{ borderLeft: `2px dashed hsl(${WARM} / 0.2)` }} />
            <div className="absolute right-0 top-8 bottom-8 w-px" style={{ borderRight: `2px dashed hsl(${WARM} / 0.2)` }} />

            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: `hsl(${WARM} / 0.12)`, border: `2px solid hsl(${WARM} / 0.3)` }}>
              <span className="font-black" style={{ fontSize: 44, color: `hsl(${WARM})` }}>?</span>
            </div>
            <p className="font-black text-center mb-2" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
              No Operator<br />Memory Layer
            </p>
            <p className="text-center px-5" style={{ fontSize: 15, color: MUTED, lineHeight: 1.55 }}>
              AI can draft fast, but it can't apply your fleet's anomaly history, vendor scars, or regulatory commitments.
            </p>
            <p className="font-semibold text-center mt-4 px-4" style={{ fontSize: 14, color: TEXT }}>
              The result: senior ops engineers redo AI's work instead of scaling their own.
            </p>
          </div>

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
              But without your fleet's standards, every output is generic — the average operator, not yours.
            </p>
          </div>
        </div>

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
// SLIDE 03 — WHERE IT SHOWS UP IN A SATCOM OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════

const SATCOM_GAP_CASES = [
  {
    name: "Anomaly response",
    icon: <AlertTriangle size={20} style={{ color: `hsl(${WARM})` }} />,
    accent: WARM,
    records: ["Telemetry alerts", "Past RCAs", "Workaround logs"],
    output: "RCA draft, customer comms, mitigation plan",
    gap: "AI doesn't know which anomaly is normal for this satellite, which is precedent for an EOL risk, or which one will be on the regulator's desk by morning.",
    cost: "Minutes-to-recovery dictate SLA penalties and contract retention.",
  },
  {
    name: "Procurement & acceptance",
    icon: <Briefcase size={20} style={{ color: `hsl(${BLUE})` }} />,
    accent: BLUE,
    records: ["Vendor SOWs", "Acceptance test plans", "Past CDR/PDR notes"],
    output: "Review checklists, deviation calls, change-order responses",
    gap: "AI doesn't know which clause your last prime tried to walk back, which acceptance criteria gave you trouble in orbit, or what your sign-off authority demands.",
    cost: "Repeat procurement mistakes carried for the next 15 years.",
  },
  {
    name: "Regulatory & spectrum",
    icon: <Radio size={20} style={{ color: `hsl(${GREEN})` }} />,
    accent: GREEN,
    records: ["ITU filings", "Coordination agreements", "National licenses"],
    output: "Filing drafts, coordination responses, license renewals",
    gap: "AI doesn't know your filing precedent, which administrations push back hardest, or which slot has live coordination disputes you're managing.",
    cost: "Missed coordination windows and protected status that quietly degrades.",
  },
];

function Slide03() {
  const alsoApplies = ["Mission planning", "Fleet handover", "Customer SLA", "EOL & deorbit", "Cyber & sovereignty", "Insurance & claims"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Where Missing Context Shows Up in a Satcom Operator
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 46, color: TEXT, lineHeight: 1.08, maxWidth: 1680 }}>
          The artifacts exist. AI produces an output. <span style={{ color: `hsl(${TEAL})` }}>The missing piece is operator-grade judgment.</span>
        </h2>

        <div className="flex flex-col gap-3 flex-1 min-h-0 mb-3">
          {SATCOM_GAP_CASES.map((item) => (
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

              <div className="w-[230px] shrink-0 px-5 py-4 flex flex-col justify-center" style={{ background: `hsl(${RED} / 0.04)` }}>
                <p className="font-bold mb-1.5" style={{ fontSize: 12, color: `hsl(${RED})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>What breaks</p>
                <p className="font-bold" style={{ fontSize: 17, color: `hsl(${RED})`, lineHeight: 1.32 }}>{item.cost}</p>
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

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — WHAT MISSING CONTEXT COSTS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  const benchmarks = [
    { value: "15–20 yrs", label: "Each satellite's operating memory", source: "Typical GEO design life and operator history" },
    { value: "6–18 mo", label: "Onboarding new ops engineers", source: "Operator HR benchmarks" },
    { value: "$M / hr", label: "SLA exposure per outage minute", source: "Broadcast & gov-satcom SLA frameworks" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          What Missing Context Costs an Operator
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 46, color: TEXT, lineHeight: 1.08, maxWidth: 1640 }}>
          Missing context becomes expensive because it slows recovery, weakens vendor leverage, and triggers <span style={{ color: `hsl(${WARM})` }}>avoidable service risk.</span>
        </h2>

        <div className="grid grid-cols-[360px_1fr] gap-5 mb-4">
          <div className="rounded-[28px] border px-7 py-7" style={{ borderColor: `hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.05)` }}>
            <p className="font-black" style={{ fontSize: 60, color: `hsl(${WARM})`, lineHeight: 0.95 }}>minutes</p>
            <p className="font-bold mt-2" style={{ fontSize: 22, color: TEXT, lineHeight: 1.18 }}>
              of recovery slip per anomaly that loses its precedent
            </p>
            <p className="mt-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>
              This is what AI amplifies if it runs without your fleet's anomaly history, station-keeping context, or operations procedures.
            </p>
            <p className="mt-4" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.45 }}>
              Pattern from satcom operations literature; industry-level, not customer data
            </p>
          </div>

          <div className="rounded-[28px] border px-7 py-6" style={{ borderColor: `hsl(${TEAL} / 0.18)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {benchmarks.map((item) => (
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
                If AI produces a plausible answer inside an anomaly RCA, vendor review, or ITU filing <span className="font-bold">without your operator context</span>, the senior ops engineer still has to catch it, correct it, and re-route it through review.
              </p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                On a service-critical satellite, recovery slip translates directly into <span className="font-bold" style={{ color: TEXT }}>SLA penalties, customer-trust erosion</span>, and regulatory exposure across the affected coverage.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          {[
            { label: "Service continuity", value: "weakened", desc: "Senior ops spend cycles fixing AI-assisted work instead of compressing recovery and protecting SLAs.", color: RED },
            { label: "Vendor leverage", value: "lost", desc: "Without procurement memory, the next contract repeats the last contract's mistakes — for another 15 years.", color: WARM },
            { label: "AI usage", value: "cannot scale safely", desc: "Without operator-grade governance, ops directors limit adoption because every output creates customer-facing risk.", color: GOLD },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl px-7 py-7 h-full flex flex-col justify-center" style={{ background: `hsl(${item.color} / 0.06)`, border: `2px solid hsl(${item.color} / 0.18)` }}>
              <p className="font-black" style={{ fontSize: 15, color: `hsl(${item.color})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</p>
              <p className="font-black mt-3" style={{ fontSize: 32, color: TEXT, lineHeight: 1.04 }}>{item.value}</p>
              <p className="mt-4" style={{ fontSize: 17, color: MUTED, lineHeight: 1.42 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — WHY NOW
// ═══════════════════════════════════════════════════════════════════════════════

function SlideWhyNow() {
  const drivers = [
    { Icon: Users, title: "Generational handover", desc: "Ops engineers, contract managers, and spectrum specialists with 20+ years of fleet memory are exiting in the next 5 years." },
    { Icon: Satellite, title: "Fleet renewal cycles", desc: "GEO operators are entering replacement procurement cycles for satellites bought before any of the current AI tools existed." },
    { Icon: Globe, title: "LEO + sovereignty pressure", desc: "Mega-constellations, dual-use mandates, and sovereignty requirements are reshaping how operators must govern operations and vendors." },
    { Icon: Brain, title: "AI is already in the building", desc: "Ops, procurement, and regulatory teams are already pasting into ChatGPT. Without governance, that becomes an audit and SLA problem." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Why Now
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08, maxWidth: 1640 }}>
          Four forces are converging on the satcom operator at the same time.
        </h2>
        <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }} className="mb-10">
          Each one is solvable. The first operator to codify across all four owns the reference architecture for the category.
        </p>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {drivers.map((d) => {
            const Icon = d.Icon;
            return (
              <div key={d.title} className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.18)`, background: `hsl(${TEAL} / 0.04)` }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.12)` }}>
                    <Icon size={28} style={{ color: `hsl(${TEAL})` }} />
                  </div>
                  <p className="font-black" style={{ fontSize: 28, color: TEXT }}>{d.title}</p>
                </div>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — THE CONTEXT LAYER (the product picture)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Context Layer
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08, maxWidth: 1640 }}>
          LIZA OS sits between your inputs and AI's outputs — and applies your fleet's standards.
        </h2>
        <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }} className="mb-8">
          A governed operating layer that ingests operator knowledge, enforces it on every AI output, and improves with each cycle.
        </p>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
          {[
            { Icon: BookOpen, title: "Ingest", body: "Anomaly playbooks, SOPs, vendor SOWs, ITU filings, OCC procedures — captured as governed, queryable rules." },
            { Icon: Shield, title: "Govern", body: "Every AI output is gated against your operations standards, contractual commitments, and regulatory precedent before it reaches an engineer." },
            { Icon: RefreshCw, title: "Improve", body: "Each anomaly, procurement cycle, and filing feeds the layer. The next event starts smarter, not from zero." },
          ].map((b) => {
            const Icon = b.Icon;
            return (
              <div key={b.title} className="rounded-2xl border-2 p-8 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: `hsl(${TEAL})`, color: "white" }}>
                  <Icon size={30} />
                </div>
                <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT }}>{b.title}</p>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{b.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl px-8 py-5 flex items-center gap-5" style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))` }}>
          <Network size={32} color="white" />
          <p className="font-bold" style={{ fontSize: 22, color: "white", lineHeight: 1.4 }}>
            The result: AI that operates inside your operator standards — not around them.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — OPEN CANVAS (signature operator slide)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideOpenCanvas() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 rounded-md font-bold tracking-[0.2em]" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
            07 · OPEN CANVAS
          </div>
        </div>
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.05 }}>
          There is no defined standard for operator memory.<br />
          <span style={{ color: `hsl(${TEAL})` }}>The first operator to codify it owns the reference.</span>
        </h2>
        <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }} className="mb-8">
          ECSS exists for builders. ITIL exists for IT. There is no governed knowledge standard for satellite fleet operations, procurement, or spectrum. Whoever steps in first defines it.
        </p>

        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          <div className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${BLUE} / 0.25)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-black tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${BLUE})`, textTransform: "uppercase" }}>What exists today</p>
            <p className="font-black mt-3" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>Standards for builders</p>
            <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>
              ECSS, AS9100, MIL specs — designed around how a satellite is built and qualified, not how it is flown for 15 years afterwards.
            </p>
          </div>
          <div className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.05)` }}>
            <p className="font-black tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${WARM})`, textTransform: "uppercase" }}>What's missing</p>
            <p className="font-black mt-3" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>An operator standard</p>
            <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>
              Each operator codifies its own playbooks, in its own folders, lost on retirement. There is no governed layer the category shares.
            </p>
          </div>
          <div className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)` }}>
            <p className="font-black tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${TEAL})`, textTransform: "uppercase" }}>What we're proposing</p>
            <p className="font-black mt-3" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>Define it together</p>
            <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>
              We co-build the operator memory standard with the first operator who steps in. They anchor it for their fleet and own a strategic position in the category as it forms.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl px-8 py-5" style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))` }}>
          <p className="font-bold text-center" style={{ fontSize: 24, color: "white", lineHeight: 1.4 }}>
            The first operator becomes the reference customer for every operator that follows.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — HOW IT WORKS (4-step loop)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    { n: 1, title: "Codify", desc: "Capture anomaly playbooks, SOPs, vendor SOWs, ITU precedent, and senior judgment as governed rules.", Icon: BookOpen },
    { n: 2, title: "Govern", desc: "Every AI draft — RCA, vendor review, filing, customer comm — checked against your operator standards.", Icon: Shield },
    { n: 3, title: "Apply", desc: "Ops engineers, contract managers, and analysts work inside the same governed standard. Onboarding compresses.", Icon: Workflow },
    { n: 4, title: "Improve", desc: "Each event, contract, and filing feeds new learning back. The next satellite, vendor, and slot starts smarter.", Icon: RefreshCw },
  ];
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          How LIZA OS Works
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08 }}>
          A four-step loop that compounds every cycle.
        </h2>

        <div className="relative flex-1 min-h-0">
          <div className="absolute top-[60px] left-[8%] right-[8%] h-px" style={{ background: `hsl(${TEAL} / 0.3)` }} />
          <div className="relative grid grid-cols-4 gap-8">
            {steps.map((s) => {
              const Icon = s.Icon;
              return (
                <div key={s.n} className="flex flex-col items-center text-center">
                  <div className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center border-2 bg-white" style={{ borderColor: `hsl(${TEAL})`, color: `hsl(${TEAL})` }}>
                    <Icon size={48} />
                    <span className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-black" style={{ background: `hsl(${TEAL})`, fontSize: 22 }}>{s.n}</span>
                  </div>
                  <p className="mt-6 font-black" style={{ fontSize: 32, color: TEXT }}>{s.title}</p>
                  <p className="mt-3" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45, maxWidth: 280 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3" style={{ color: MUTED }}>
          <RefreshCw size={20} />
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: 16 }}>Each cycle makes the next anomaly, contract, and filing smarter</p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — STRATEGIC PIVOT (vertical leverage)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideVerticalization() {
  const verticals = [
    { label: "Satcom Operators", sub: "Fleet · Procurement · Spectrum", active: true, color: TEAL },
    { label: "Space Builders", sub: "ECSS · MAIT · Mission Memory", active: false, color: MUTED },
    { label: "AEC", sub: "RFI · Submittals · Handover", active: false, color: MUTED },
    { label: "Pharma", sub: "GxP · Deviations · CSRs", active: false, color: MUTED },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <div className="px-3 py-1 rounded-md font-bold tracking-[0.2em]" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
            09 · SHAPE OF THE COMPANY
          </div>
        </div>
        <h2 className="font-black mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          One OS. <span style={{ color: `hsl(${TEAL})` }}>Satcom operators are the next spear.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          We build a single context layer and deploy it vertical-by-vertical. The conversation today is about satellite fleet operators — and you benefit from platform leverage already proven inside AEC and adjacent regulated work.
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-4 gap-6 mb-0">
            {verticals.map(v => (
              <div key={v.label} className="rounded-xl border-2 p-6 relative" style={{
                borderColor: v.active ? `hsl(${v.color})` : CHROME_BORDER,
                background: v.active ? `hsl(${v.color} / 0.06)` : CARD_ALT,
              }}>
                {v.active && (
                  <div className="absolute -top-3 left-4 px-2 py-0.5 rounded font-bold tracking-[0.2em]"
                    style={{ fontSize: 12, background: `hsl(${v.color})`, color: "white" }}>
                    TODAY'S CONVERSATION
                  </div>
                )}
                <div className="font-black mb-1" style={{ fontSize: 26, color: v.active ? `hsl(${v.color})` : TEXT }}>{v.label}</div>
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
            <div className="font-bold tracking-[0.2em] mb-1.5" style={{ fontSize: 12, color: `hsl(${TEAL})` }}>WHAT YOU OWN</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              An operator-native layer for fleet ops, procurement, and spectrum — codifying expertise faster than retirements drain it.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="font-bold tracking-[0.2em] mb-1.5" style={{ fontSize: 12, color: `hsl(${BLUE})` }}>WHAT COMPOUNDS</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Investment from adjacent verticals (AEC, Pharma, Space builders) accelerates the platform; you inherit a hardened core, not a v1.
            </div>
          </div>
          <div className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="font-bold tracking-[0.2em] mb-1.5" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>HOW WE STRUCTURE IT</div>
            <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              Phase 1: 30-day operator-memory pilot. Phase 2: open-canvas partnership and reference-architecture position.
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — 30-DAY EXECUTION CHALLENGE
// ═══════════════════════════════════════════════════════════════════════════════

function SlideExecutionChallenge() {
  const phases = [
    { week: "Week 1", title: "Scope & ingest", desc: "Pick one workflow — anomaly response, vendor acceptance, or filing review. Ingest the artifacts and senior judgment behind it." },
    { week: "Week 2", title: "Codify & govern", desc: "Turn the workflow into governed rules. Wire AI drafts through the gate. Senior engineer signs off the standard." },
    { week: "Week 3", title: "Run live", desc: "Real ops engineers use it on real work. We measure hours saved, errors caught, and onboarding compression." },
    { week: "Week 4", title: "Decide", desc: "Clear before-and-after. Audit trail. You decide whether to extend to the next workflow or move to open-canvas partnership." },
  ];
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-12 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 rounded-md font-bold tracking-[0.2em]" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
            10 · 30-DAY CHALLENGE
          </div>
        </div>
        <h2 className="font-black mb-3" style={{ fontSize: 56, color: TEXT, lineHeight: 1.05 }}>
          One workflow. One satellite. <span style={{ color: `hsl(${TEAL})` }}>30 days.</span>
        </h2>
        <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }} className="mb-10">
          Fixed scope, fixed price. You only continue if the savings are real.
        </p>

        <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
          {phases.map((p, i) => (
            <div key={p.week} className="rounded-2xl border-2 p-6 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: i === phases.length - 1 ? `hsl(${TEAL} / 0.08)` : `hsl(${TEAL} / 0.03)` }}>
              <p className="font-black tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${TEAL})`, textTransform: "uppercase" }}>{p.week}</p>
              <p className="font-black mt-3" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>{p.title}</p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl px-8 py-6 flex items-center justify-between gap-6" style={{ background: `hsl(${TEAL} / 0.06)`, border: `2px solid hsl(${TEAL} / 0.2)` }}>
          <div>
            <p className="font-bold tracking-[0.2em] uppercase mb-2" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>What you walk away with</p>
            <p className="font-black" style={{ fontSize: 24, color: TEXT, lineHeight: 1.3 }}>
              A governed workflow, an audit trail, hours-saved data, and a clear path to extend across the fleet.
            </p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12() {
  const team = [
    { photo: kristofPhoto, name: "Kristóf Eger", role: "Founder · CEO", bio: "15+ years building enterprise AI and data infrastructure. Former Aliz." },
    { photo: istvanPhoto, name: "István Boscha", role: "Co-Founder · Architecture", bio: "Engineering leadership across regulated and infrastructure software." },
    { photo: zoltanPhoto, name: "Zoltán Kauker", role: "Co-Founder · Delivery", bio: "Delivery and customer leadership across enterprise transformation programs." },
  ];
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          Team
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 56, color: TEXT, lineHeight: 1.05 }}>
          The team behind LIZA OS.
        </h2>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border p-7 flex flex-col items-start" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <div className="w-32 h-32 rounded-full overflow-hidden mb-5" style={{ border: `3px solid hsl(${TEAL} / 0.3)` }}>
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-black" style={{ fontSize: 30, color: TEXT }}>{m.name}</p>
              <p className="font-bold mt-1" style={{ fontSize: 17, color: `hsl(${TEAL})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.role}</p>
              <p className="mt-4" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — TWO-DOOR ASK
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full w-full px-24 pt-14 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Ask
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 60, color: TEXT, lineHeight: 1.05 }}>
          Two doors. <span style={{ color: `hsl(${TEAL})` }}>Pick the one that fits.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="rounded-2xl p-10 flex flex-col" style={{ background: TEXT, color: BG }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-3" style={{ fontSize: 14, color: `hsl(${MINT})` }}>Door A</p>
            <p className="font-black mb-4" style={{ fontSize: 38, lineHeight: 1.1 }}>30-Day Pilot</p>
            <p className="opacity-85" style={{ fontSize: 19, lineHeight: 1.5 }}>
              One workflow on one satellite. Fixed scope, fixed price. We codify it, run it live, and hand you the data and audit trail. You decide whether to extend.
            </p>
            <div className="mt-auto pt-6 border-t border-white/15">
              <p className="opacity-70" style={{ fontSize: 14 }}>Best fit: ops director or CIO who wants proof before scope.</p>
            </div>
          </div>

          <div className="rounded-2xl p-10 flex flex-col text-white" style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-3" style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>Door B</p>
            <p className="font-black mb-4" style={{ fontSize: 38, lineHeight: 1.1 }}>Open-Canvas Partnership</p>
            <p style={{ fontSize: 19, lineHeight: 1.5 }}>
              Co-define the operator memory standard with us. Anchor it for your fleet, take a strategic position, and own a reference architecture the rest of the category will follow.
            </p>
            <div className="mt-auto pt-6 border-t border-white/30">
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>Best fit: strategic ownership, partnership, or sovereign-satcom mandate.</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-10" style={{ fontSize: 18, color: SUBTLE }}>
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
  { id: 2, title: "The Context Gap", component: <Slide02 /> },
  { id: 3, title: "Where Missing Context Shows Up", component: <Slide03 /> },
  { id: 4, title: "What Missing Context Costs", component: <Slide04 /> },
  { id: 5, title: "Why Now", component: <SlideWhyNow /> },
  { id: 6, title: "The Context Layer", component: <Slide05 /> },
  { id: 7, title: "Open Canvas", component: <SlideOpenCanvas /> },
  { id: 8, title: "How LIZA OS Works", component: <Slide07 /> },
  { id: 9, title: "Shape of the Company", component: <SlideVerticalization /> },
  { id: 10, title: "30-Day Challenge", component: <SlideExecutionChallenge /> },
  { id: 11, title: "Team", component: <Slide12 /> },
  { id: 12, title: "Two-Door Ask", component: <Slide13 /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SatcomDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Satcom-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg">
              <X size={20} style={{ color: TEXT }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: CARD_ALT }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b" style={{ background: BG, borderColor: CHROME_BORDER }}>
        <div className="flex items-center gap-3">
          <span className="block w-7 h-1 rounded-full" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-tight" style={{ color: TEXT }}>LIZA OS</span>
          <span className="text-xs tracking-widest uppercase" style={{ color: MUTED }}>Satcom · Strategic Deck</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGrid(v => !v)} className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold border" style={{ borderColor: CHROME_BORDER, color: TEXT }}>
            <Grid3x3 size={16} /> Grid
          </button>
          <button onClick={enterFullscreen} className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold text-white" style={{ background: `hsl(${TEAL})` }}>
            <Maximize2 size={16} /> Present
          </button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Satcom-Deck" slideCount={SLIDES.length} />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex">
        {/* Sidebar thumbnails */}
        <aside className="w-[280px] shrink-0 border-r overflow-y-auto" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <div className="p-3 flex flex-col gap-2">
            {SLIDES.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)}
                className={cn("rounded-lg border-2 overflow-hidden text-left transition-all", i === current ? "" : "hover:opacity-80")}
                style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER }}>
                <div className="aspect-[16/9] relative" style={{ background: BG }}>
                  <ScaledSlide>{s.component}</ScaledSlide>
                </div>
                <div className="px-2 py-1.5 flex items-center gap-2 text-xs" style={{ color: MUTED }}>
                  <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold truncate" style={{ color: TEXT }}>{s.title}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main canvas */}
        <main className="flex-1 flex items-center justify-center p-6 relative">
          {showGrid ? (
            <div className="grid grid-cols-3 gap-4 w-full max-h-full overflow-y-auto p-2">
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => goTo(i)} className="rounded-xl border-2 overflow-hidden text-left" style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER, background: BG }}>
                  <div className="aspect-[16/9] relative">
                    <ScaledSlide>{s.component}</ScaledSlide>
                  </div>
                  <div className="px-3 py-2 flex items-center gap-2" style={{ color: MUTED }}>
                    <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-semibold text-sm truncate" style={{ color: TEXT }}>{s.title}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full h-full max-w-[1600px] aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden" style={{ background: BG }}>
              <ScaledSlide>{slide.component}</ScaledSlide>
            </div>
          )}

          {/* Nav pills */}
          {!showGrid && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full shadow-lg" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
              <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20"><ChevronLeft size={18} style={{ color: TEXT }} /></button>
              <span className="font-mono text-sm min-w-[55px] text-center" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
              <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20"><ChevronRight size={18} style={{ color: TEXT }} /></button>
            </div>
          )}
        </main>
      </div>

      {/* Hidden export render */}
      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}

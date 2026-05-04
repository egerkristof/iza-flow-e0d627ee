import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, Check, CheckCircle2, DollarSign,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
  Layers, Eye, Workflow, Lightbulb, Award, Database, Brain, Cpu, Clock, Rocket, FileText,
, Sparkles , GitBranch } from "lucide-react";
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
            LIZA OS · LCV Partners
          </span>
        </div>

        <h1 className="font-black mb-6" style={{ fontSize: 82, lineHeight: 1.05, color: TEXT }}>
          The operating layer for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            operational continuity.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          When tacit operating knowledge lives in people, integrations stall and margins leak.<br />
          <span style={{ color: `hsl(${TEAL})` }}>We turn expert judgment into executable protocols across audits, integrations, and workflow transitions.</span>
        </p>

        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; Strategic investor variant &nbsp;·&nbsp; LCV Partners
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE CONTEXT GAP
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  const inputs = ["SOPs", "Policies", "Templates", "Requirements", "Data", "Records"];
  const outputs = ["Reports", "Proposals", "Decisions", "Deliverables", "Actions", "Answers"];

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

function Slide03() {
  const industries = [
    {
      name: "Life Sciences",
      icon: <Shield size={22} style={{ color: `hsl(${RED})` }} />,
      accent: RED,
      records: ["Batch records", "SOPs", "Validation protocols"],
      gap: "AI attempts to draft a deviation report based on its general training data. But this batch falls under Annex 7, not Annex 1. A senior QA lead recognizes that instantly. The AI cannot, because nobody encoded that judgment.",
      outputs: ["Deviation reports", "Submission docs"],
      cost: "Safety risk. Audit failure.",
    },
    {
      name: "Professional Services",
      icon: <Briefcase size={22} style={{ color: `hsl(${WARM})` }} />,
      accent: WARM,
      records: ["Methodologies", "Client briefs", "Proposals"],
      gap: "AI produces a generic proposal based on publicly available best practices. But the client's CEO just changed strategy mid-engagement. A senior partner would reframe the entire approach. The AI delivers a textbook response because it has no access to the partner's instinct.",
      outputs: ["Deliverables", "Advisory memos"],
      cost: "Margin erosion. Client escalation.",
    },
    {
      name: "Financial Services",
      icon: <DollarSign size={22} style={{ color: `hsl(${GOLD})` }} />,
      accent: GOLD,
      records: ["Risk policies", "Case files", "Compliance docs"],
      gap: "AI struggles to price risk beyond historical averages. But this client's exposure profile shifted after a recent acquisition. Two analysts using the same AI arrive at different outputs because neither has encoded the firm's evolving risk posture.",
      outputs: ["Risk assessments", "Advisory reports"],
      cost: "Regulatory exposure. Inconsistent pricing.",
    },
  ];

  const alsoApplies = ["Engineering", "Sales & GTM", "Legal & Compliance", "Supply Chain", "HR & People Ops", "Marketing"];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-20 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>
          Where Missing Context Shows Up
        </p>
        <h2 className="font-black mb-5" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08 }}>
          The artifacts exist. The AI produces an output. <span style={{ color: `hsl(${ACCENT})` }}>The missing piece is expert judgment.</span>
        </h2>

        <div className="flex flex-col gap-3 flex-1 min-h-0 mb-4">
          {industries.map((ind) => (
            <div key={ind.name} className="flex-1 flex items-stretch gap-0 rounded-2xl overflow-hidden border"
              style={{ borderColor: `hsl(${ind.accent} / 0.15)` }}>
              <div className="w-[260px] shrink-0 px-6 py-4 flex flex-col justify-center"
                style={{ background: `hsl(${TEAL} / 0.05)`, borderRight: `1.5px solid hsl(${TEAL} / 0.12)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Database size={16} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-bold" style={{ fontSize: 12, color: `hsl(${TEAL})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Artifacts that need expert judgment</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ind.records.map(r => (
                    <span key={r} className="rounded-full px-3 py-1 font-semibold" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.08)`, color: TEXT }}>{r}</span>
                  ))}
                </div>
              </div>
              <div className="flex-1 px-7 py-4 flex flex-col justify-center"
                style={{ background: `hsl(${ACCENT} / 0.05)`, borderRight: `1.5px solid hsl(${ACCENT} / 0.1)`, borderLeft: `1.5px solid hsl(${ACCENT} / 0.1)` }}>
                <div className="flex items-center gap-2 mb-2">
                  {ind.icon}
                  <p className="font-black" style={{ fontSize: 22, color: TEXT }}>{ind.name}</p>
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `hsl(${ACCENT} / 0.1)` }}>
                    <AlertTriangle size={12} style={{ color: `hsl(${ACCENT})` }} />
                    <span className="font-bold" style={{ fontSize: 11, color: `hsl(${ACCENT})` }}>THE GAP</span>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.45 }}>{ind.gap}</p>
              </div>
              <div className="w-[200px] shrink-0 px-6 py-4 flex flex-col justify-center"
                style={{ background: `hsl(${RED} / 0.04)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 12, color: `hsl(${RED})`, letterSpacing: "0.1em", textTransform: "uppercase" }}>What breaks</p>
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${RED})`, lineHeight: 1.35 }}>{ind.cost}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="flex items-center gap-4">
            <p className="font-bold shrink-0" style={{ fontSize: 16, color: MUTED }}>Same pattern in:</p>
            <div className="flex flex-wrap gap-2.5">
              {alsoApplies.map(a => (
                <span key={a} className="rounded-full px-4 py-1.5 font-semibold border" style={{ fontSize: 15, color: MUTED, borderColor: `hsl(215 15% 85%)`, background: `hsl(220 15% 98%)` }}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={ACCENT} to={RED} />
    </div>
  );
}

function Slide03Cost() {
  const benchmarkInputs = [
    {
      stat: "100",
      title: "people in the benchmark team",
      source: "Illustrative benchmark cohort",
    },
    {
      stat: "58%",
      title: "touch AI cleanup weekly",
      source: "Source: Zapier AI at Work Report, 2026",
    },
    {
      stat: "4.5 hrs",
      title: "lost per affected person",
      source: "Source: Zapier AI at Work Report, 2026",
    },
    {
      stat: "€40/hr",
      title: "blended review cost",
      source: "Illustrative blended labor rate",
    },
  ];

  const consequences = [
    {
      title: "Life Sciences",
      kicker: "Safety and release risk",
      body: "Plausible output still fails if it misses the protocol nuance that determines whether work is safe or releasable.",
      result: "More QA loops. Slower release. Real compliance exposure.",
      color: RED,
    },
    {
      title: "Professional Services",
      kicker: "Margin erosion",
      body: "Output can look convincing and still miss the judgment clients actually pay for.",
      result: "Senior experts spend time correcting AI instead of scaling expertise.",
      color: ACCENT,
    },
    {
      title: "Financial Services",
      kicker: "Governance risk",
      body: "A clean answer is still wrong if the exception path, approval logic, or exposure context is missing.",
      result: "Mispriced decisions. Broken approvals. Fast loss of trust.",
      color: GOLD,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-10 pb-8">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${WARM})` }}>
          What Missing Context Costs
        </p>
        <h2 className="font-black mb-5" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          AI output is cheap. <span style={{ color: `hsl(${WARM})` }}>Rework is not.</span>
        </h2>

        <div className="grid grid-cols-[0.9fr_1.5fr] gap-5 mb-5">
          <div className="rounded-2xl px-8 py-7 flex flex-col justify-center"
            style={{ background: `hsl(${WARM} / 0.06)`, border: `2px solid hsl(${WARM} / 0.2)` }}>
            <p className="font-black" style={{ fontSize: 76, color: `hsl(${WARM})`, lineHeight: 1 }}>€550K</p>
            <p className="font-bold mt-2" style={{ fontSize: 22, color: TEXT }}>per year / 100 people</p>
            <p className="mt-1" style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>
              The annual labor cost of reviewing, correcting, and rerouting AI output when context does not travel with the work.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
              {benchmarkInputs.map((item) => (
                <div key={item.title} className="rounded-xl px-4 py-4"
                  style={{ background: `hsl(${WARM} / 0.05)`, border: `1px solid hsl(${WARM} / 0.12)` }}>
                  <p className="font-black mb-2" style={{ fontSize: 32, color: `hsl(${WARM})`, lineHeight: 1 }}>{item.stat}</p>
                  <p className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>{item.title}</p>
                  <p className="mt-2" style={{ fontSize: 11, color: SUBTLE, lineHeight: 1.4 }}>{item.source}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl px-5 py-4 flex items-start gap-4"
              style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.14)` }}>
              <AlertTriangle size={20} style={{ color: `hsl(${RED})`, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>
                  Prompts are getting more expensive. Context is the only real control point.
                </p>
                <p className="mt-1" style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>
                  As frontier AI shifts toward metered usage, every vague prompt, retry loop, and weak handoff compounds both human rework and model spend. Better context is the optimization layer you control.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl px-6 py-5 mb-4" style={{ background: `hsl(${ACCENT} / 0.05)`, border: `1px solid hsl(${ACCENT} / 0.14)` }}>
          <p className="font-bold" style={{ fontSize: 15, color: `hsl(${ACCENT})`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            What "plausible" means
          </p>
          <p className="mt-2 font-bold" style={{ fontSize: 21, color: TEXT, lineHeight: 1.45 }}>
            AI output looks right enough at first glance, but misses the domain-specific context, exception, or judgment that makes it actually correct.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {consequences.map((item) => (
            <div key={item.title} className="rounded-2xl border px-5 py-5 flex flex-col"
              style={{ borderColor: `hsl(${item.color} / 0.18)`, background: `hsl(${item.color} / 0.04)` }}>
              <p style={{ fontSize: 14, color: `hsl(${item.color})`, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
                {item.title}
              </p>
              <p className="font-black mt-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1 }}>{item.kicker}</p>
              <p className="mt-4" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>{item.body}</p>
              <div className="mt-auto rounded-xl px-4 py-4" style={{ background: `hsl(${item.color} / 0.08)`, border: `1px solid hsl(${item.color} / 0.12)` }}>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT, lineHeight: 1.4 }}>{item.result}</p>
              </div>
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
      persona: "Plant Director",
      icon: <Building2 size={30} />,
      color: ACCENT,
      flow: ["Shift notes", "Maintenance history", "Escalation rules"],
      before: "The incoming operator sees the plant documentation, but not the unwritten workarounds that actually keep uptime stable during handover.",
      after: "The system carries forward site-specific exception handling, failure patterns, and operator judgment so continuity survives the transition.",
      critical: "Without context, uptime looks stable until the first real exception hits.",
    },
    {
      persona: "Integration Lead",
      icon: <Cpu size={30} />,
      color: GREEN,
      flow: ["Org maps", "SOP deltas", "Dependency constraints"],
      before: "Two acquired teams appear to run the same process, but hidden approval logic and local exceptions break the rollout once systems are merged.",
      after: "The integration team executes against the real operating differences, exception logic, and control points before workflows are unified.",
      critical: "Without context, PMI looks on track until execution fractures on the ground.",
    },
    {
      persona: "Audit Partner",
      icon: <DollarSign size={30} />,
      color: GOLD,
      flow: ["Control library", "Evidence trails", "Prior findings"],
      before: "AI assembles a plausible audit pack, but misses the evidence sequence, control nuance, or historical exception that determines whether the file stands up.",
      after: "The system preserves control logic, evidence order, and review standards so audit preparation compresses without losing defensibility.",
      critical: "Without context, faster audit prep becomes fragile audit prep.",
    },
    {
      persona: "Portfolio Operator",
      icon: <Shield size={30} />,
      color: RED,
      flow: ["Board packs", "Operating KPIs", "Playbook updates"],
      before: "The portfolio team gets dashboards and meeting notes, but not the operating judgment needed to intervene early across multiple companies.",
      after: "The system turns local operating knowledge into reusable protocols that can be pushed across the portfolio with traceability.",
      critical: "Without context, value creation stays dependent on a few people instead of becoming a repeatable operating model.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
          <h2 className="font-black mb-5" style={{ fontSize: 58, color: TEXT, lineHeight: 1.08 }}>
          The same continuity risk repeats across every acquisition.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Artifacts transfer. Operating judgment usually does not.</span>
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
      metric: "PMI",
      label: "is where tacit knowledge loss becomes visible",
      insight: "The integration plan exists. The operating know-how usually does not move with it.",
      color: WARM,
      source: "Observed in every buy-and-build operating model",
    },
    {
      metric: "18 days → 1 day",
      label: "audit cycle compression already proven",
      insight: "When operating knowledge is structured, diligence and audit workflows compress without losing traceability.",
      color: RED,
      source: "Cybersecurity audit engagement",
    },
    {
      metric: "Shift",
      label: "from software buyer to portfolio operator",
      insight: "For firms like LCV, the question is not tool adoption. It is whether operating rigor can be transferred across assets fast enough to expand EBITDA.",
      color: TEAL,
      source: "The strategic lens for buy-and-build deployment",
    },
  ];

  const shifts = [
    { shift: "Buy-and-build depends on repeatable operating playbooks", result: "Every acquisition tests whether local know-how can be translated into portfolio-wide execution fast enough." },
    { shift: "Operational continuity is now a value-creation lever", result: "If audits, transitions, and escalations can be standardized, portfolio EBITDA expands faster and with less integration drag." },
    { shift: "AI only matters when it carries judgment", result: "Generic copilots accelerate activity. They do not preserve the unwritten knowledge that makes industrial operations actually work." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Why Now</p>

          <h2 className="font-black mb-2" style={{ fontSize: 56, color: TEXT, lineHeight: 1.08 }}>
          In buy-and-build, value leaks when operating judgment does not transfer.<br />
          <span style={{ color: `hsl(${TEAL})` }}>That is the opening for LIZA.</span>
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
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
          The Context Layer
        </p>
        <h2 className="font-black mb-2" style={{ fontSize: 50, color: TEXT, lineHeight: 1.08 }}>
          The missing category is a <span style={{ color: `hsl(${TEAL})` }}>system of intelligence.</span>
        </h2>

        {/* Three-column flow */}
        <div className="flex-1 flex items-center gap-0">
          {/* LEFT — What companies feed AI */}
          <div className="w-[340px] shrink-0 flex flex-col gap-4">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${BLUE})` }}>What companies feed AI</p>
            {[
              { icon: <Database size={24} />, title: "Documents & Data", sub: "SOPs, policies, CRM records" },
              { icon: <Users size={24} />, title: "Templates & Prompts", sub: "Formats, checklists, scripts" },
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
            <p className="text-center font-semibold mt-1" style={{ fontSize: 14, color: `hsl(${RED})` }}>
              Missing: judgment, exceptions, standards
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
            <p className="mt-4 text-center" style={{ fontSize: 14, color: MUTED, maxWidth: 520, lineHeight: 1.45 }}>
              The reasoning engine runs on LIZA. <span style={{ color: `hsl(${GOLD})`, fontWeight: 700 }}>Your standards, exceptions, and institutional memory remain your asset.</span>
            </p>
          </div>

          {/* Arrow out */}
          <div className="shrink-0 flex items-center justify-center px-5">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL} / 0.35)` }} />
          </div>

          {/* RIGHT — Governed Output */}
          <div className="w-[340px] shrink-0 flex flex-col gap-4">
            <p className="font-black tracking-[0.2em] uppercase text-center mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>What AI produces</p>
            {[
              { icon: <Zap size={24} />, title: "Governed Output", sub: "Proposals, reports, workflows" },
              { icon: <Shield size={24} />, title: "Traceable Decisions", sub: "Audit trail, version history" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border px-6 py-5 flex items-center gap-4"
                style={{ borderColor: `hsl(${GREEN} / 0.18)`, background: `hsl(${GREEN} / 0.04)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>{item.icon}</div>
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>{item.title}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{item.sub}</p>
                </div>
              </div>
            ))}
            <p className="text-center font-bold mt-1" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>
              Consistent. Traceable. Expert-quality.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-6 rounded-xl px-8 py-3 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1.5px solid hsl(${TEAL} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>
            Encode judgment once. <span style={{ color: `hsl(${TEAL})` }}>Govern every execution.</span>
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
    { name: "Edra", funding: "$30M", round: "Series A · 2024", what: "Process mining → executable SOPs for AI agents", color: GREEN },
    { name: "Mem0.ai", funding: "$24M", round: "Series A · 2024", what: "AI memory layer. Persistent context across sessions", color: SEAFOAM },
    { name: "Interloom", funding: "$16.5M", round: "Series A · 2023", what: "Tacit knowledge capture for operations teams", color: BLUE },
    { name: "Paradox.ai", funding: "Undisclosed", round: "Speedinvest-backed · 2025", what: "Organizational intelligence and alignment layer", color: GOLD },
  ];

  const moatLayers = [
    {
      layer: "AACE v3.1 Specification",
      desc: "Intent-locking, knowledge injection, and drift detection built into one context engine.",
      proof: "Hard to copy because the logic sits in the operating model, not a prompt library.",
      icon: <Cpu size={20} />,
    },
    {
      layer: "Compounding Blueprint",
      desc: "Every customer deployment deepens the knowledge graph and sharpens the governed context layer.",
      proof: "Value increases with usage because judgment becomes more reusable over time.",
      icon: <Layers size={20} />,
    },
    {
      layer: "Cross-team Network Effect",
      desc: "Standards propagate across teams, so every new department increases consistency and system value.",
      proof: "The more workflows onboarded, the harder it becomes to rip the layer back out.",
      icon: <Network size={20} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-2" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>Category Thesis & Moat</p>

        <h2 className="font-black mb-5" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          $70M+ recently funded in adjacent layers.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>No one owns the center.</span>
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
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>€1.5M Seed</p>
              </div>
            </div>
          </div>
          <div className="w-px h-16 shrink-0" style={{ background: `hsl(${TEAL} / 0.2)` }} />
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35 }}>
              Others mine, remember, or capture.{" "}
              <span style={{ color: `hsl(${TEAL})` }}>LIZA operationalizes.</span>
            </p>
            <p className="mt-1" style={{ fontSize: 17, color: MUTED }}>
              The only platform that makes organizational judgment queryable, versionable, and executable.
              Other tools give AI your documents. We give AI your judgment.
            </p>
          </div>
        </div>

          {/* Bottom: Market + 3 moat columns */}
        <div className="grid grid-cols-[0.95fr_1fr_1fr_1fr] gap-5 items-stretch">
          {/* Market Size */}
          <div className="rounded-2xl border p-5 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Market Definition</p>
            <p className="mb-4 font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>
                For LCV, the wedge is not generic AI software spend. It is portfolio operating leverage.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                  { label: "Closest market", value: "$8.7B", desc: "The nearest sourceable market remains AI governance. It is the clean external anchor, not the whole strategic story." },
                  { label: "LCV entry point", value: "Portfolio operations", desc: "Deploy where audit compression, operating continuity, and PMI speed directly influence EBITDA expansion." },
                  { label: "What LIZA is", value: "The execution governance layer", desc: "We make operating judgment portable, traceable, and reusable across assets so the build phase scales." },
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
                Credible framing: anchor to AI governance for market credibility, then position LIZA as the execution governance layer for buy-and-build portfolios.
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
      title: "Global AEC Software Group",
      subtitle: "Design partnership",
      scope: "Post-merger workflow governance",
      color: TEAL,
      outcome: "Managing workflow continuity across acquired operating units",
      metric: "PMI",
      metricLabel: "Live use case",
      points: [
        "Working with enterprise leadership on how standards propagate after acquisition",
        "The same operating model LCV needs across portfolio integrations",
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
      subtitle: "Audit automation engagement",
      scope: "800+ audit questions",
      color: ACCENT,
      outcome: "Audit cycle: 18 days → 1 day with full traceability",
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
               Proof in the exact motions LCV cares about.{" "}
               <span style={{ color: `hsl(${GREEN})` }}>Audit, continuity, rollout.</span>
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
      vertical: "Audit & Diligence", status: "Deployed", color: GREEN,
      icon: <Users size={24} style={{ color: `hsl(${GREEN})` }} />,
      problem: "Audit quality depends on hidden reviewer logic, prior findings, and evidence sequencing that generic AI cannot carry forward.",
      result: "Audit workflows compress dramatically when evidence standards, question logic, and review patterns are encoded.",
      proof: "18 days to 1 day in live audit workflow",
    },
    {
      vertical: "Post-Merger Integration", status: "Strategic wedge", color: TEAL,
      icon: <Cpu size={24} style={{ color: `hsl(${TEAL})` }} />,
      problem: "Acquired teams look aligned on paper while critical operating exceptions remain trapped in people, local documents, and unwritten handoffs.",
      result: "LIZA captures local operating judgment as executable protocols so the build phase scales across acquired entities.",
      proof: "Global AEC software group design partnership",
    },
    {
      vertical: "Industrial Operations", status: "Target fit", color: GOLD,
      icon: <Shield size={24} style={{ color: `hsl(${GOLD})` }} />,
      problem: "Aging operators hold the real knowledge on uptime, exceptions, vendor workarounds, and escalation logic in fragmented heavy-industry environments.",
      result: "The same context engine can preserve operating continuity across manufacturing, utilities, transport, and data centre assets.",
      proof: "Direct match to LCV's portfolio operating model",
    },
  ];

  const expandInto = [
    { name: "Legal & Compliance", col: "215 25% 50%" },
    { name: "Engineering & Architecture", col: TEAL },
    { name: "Sales & Revenue Ops", col: GREEN },
    { name: "Marketing & Positioning", col: "330 70% 55%" },
    { name: "Supply Chain & Procurement", col: GOLD },
    { name: "HR & People Operations", col: ACCENT },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-24 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Expansion Path</p>

        <div className="mb-6 flex items-start justify-between gap-8">
          <h2 className="font-black max-w-[1180px]" style={{ fontSize: 56, color: TEXT, lineHeight: 1.02 }}>
            Same engine.{" "}
            <span style={{ color: `hsl(${GREEN})` }}>Three portfolio value-creation motions.</span>
          </h2>
          <div className="w-[280px] rounded-2xl px-5 py-4 shrink-0"
            style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 11, color: MUTED }}>
              Pattern
            </p>
            <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})`, lineHeight: 1.2 }}>
               One engine governs every workflow where tacit operating knowledge must survive scale, diligence, or integration.
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

        <div className="mt-3 rounded-xl border px-6 py-3 flex items-center gap-4"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={20} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 16, color: MUTED }}>
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
          Strategic account land. <span style={{ color: `hsl(${GREEN})` }}>Portfolio rollout expand.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Revenue Streams</p>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Platform Base</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Per operating company</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                Recurring infrastructure fee for the governance layer inside one operating company or business unit.
                Once embedded in core workflows, it becomes the durable operating memory for that asset.
              </p>
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Execution Usage</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>Audit, workflow, and run volume</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                Usage scales with governed executions such as audits, workflow runs, extraction, and portfolio-wide rollouts.
                The more LCV standardizes across assets, the more usage compounds with measurable operating value.
              </p>
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: TEXT }}>Strategic Deployment</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>Fixed-fee first rollout</span>
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>
                The first deployment proves EBITDA logic in one workflow, one site, or one portfolio company before broader rollout.
              </p>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-4">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Why this model wins</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Stickiness", value: "High", desc: "Lives inside core operating workflows" },
                { label: "Portfolio upside", value: "Direct", desc: "Each new asset expands contract value" },
                { label: "Proof path", value: "Fast", desc: "One workflow can prove the model quickly" },
                { label: "Expansion", value: "Multi-asset", desc: "Land one company, expand across the portfolio" },
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
                  "Start with one strategic deployment in a high-friction audit or integration workflow",
                  "Convert that proof into recurring platform infrastructure for the operating company",
                  "Expand usage as more governed workflows and business units come online",
                  "Use portfolio rollout economics to turn one customer into a strategic channel",
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
      title: "Capture",
      icon: <BookOpen size={24} />,
      color: TEAL,
      actions: [
        "Pick one integration-critical workflow such as audit prep, escalation handling, or site transition",
        "Capture tacit operating logic from the people who currently keep the process stable",
        "LIZA converts that knowledge into governed, executable protocols",
      ],
      output: "First critical workflow encoded",
    },
    {
      week: "Week 2-3",
      title: "Run",
      icon: <Zap size={24} />,
      color: SEAFOAM,
      actions: [
        "Operators use the protocol in live audit, diligence, or transition work",
        "Execution stays traceable while throughput increases",
        "The system tracks drift, gaps, and exception patterns automatically",
      ],
      output: "Live proof under real operating conditions",
    },
    {
      week: "Week 4",
      title: "Expand",
      icon: <TrendingUp size={24} />,
      color: GREEN,
      actions: [
        "Review measurable compression in prep time, rework, and continuity risk",
        "Turn the workflow into a repeatable operating asset",
        "Decide whether to deploy the same model across additional assets or workflows",
      ],
      output: "Portfolio rollout decision with evidence.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-12 pb-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 26, color: `hsl(${GREEN})` }}>Strategic Deployment Motion</p>

        <h2 className="font-black mb-6" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Start narrow. Prove continuity. Then roll across the portfolio.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Exactly how a PE-backed deployment should work.</span>
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
              { metric: "1 workflow", label: "Starting scope", sub: "Narrow and critical" },
              { metric: "30 days", label: "Time to proof", sub: "Fast enough for operators" },
              { metric: "1 asset → many", label: "Expansion path", sub: "Portfolio replication" },
              { metric: "Go / scale", label: "Decision point", sub: "Expand only with hard evidence" },
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
              { title: "Capital efficient & committed", desc: "15 months of self-funded development. Full product, marketing site, diagnostic tool, and enterprise pipeline — built on a fraction of what funded competitors raised. We ship more with less.", color: TEAL },
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
// SLIDE 12 — THE ASK (€1.5M + milestones + use of funds)
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
          <h2 className="font-black mb-3" style={{ fontSize: 96, color: TEXT }}>€1.5M</h2>
          <p style={{ fontSize: 24, color: MUTED }}>
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
              <p className="font-black" style={{ fontSize: 32, color: TEXT }}>{pct}</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${color})` }}>{label}</p>
              <p style={{ fontSize: 14, color: MUTED }}>{amt}: {desc}</p>
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
              <p className="font-black mt-1" style={{ fontSize: 28, color: TEXT }}>{target}</p>
              <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{milestone}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 22, color: TEXT, lineHeight: 1.5 }}>
            Your organization's collective intelligence is your competitive advantage.{" "}
            <strong style={{ color: `hsl(${TEAL})` }}>We make it run the company.</strong>
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
// SLIDE — THE CONTEXT GAP, EXEMPLIFIED (Portfolio Operations)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideContextGapExemplified() {
  const annotations = [
    {
      n: 1,
      nature: "JUST CHANGED",
      title: "Operating thesis revised at last IC",
      body: "IC re-anchored the thesis from cost synergies to commercial expansion last Friday. The 100-day plan still leads with the cost case. The CEO update goes out on Monday.",
    },
    {
      n: 2,
      nature: "OPEN ISSUE",
      title: "Open carve-out TSA dispute",
      body: "The seller flagged an unresolved TSA scope question two weeks ago. No final answer. The plan cannot claim a 'standard' working-capital trajectory until it closes.",
    },
    {
      n: 3,
      nature: "CONTRADICTION",
      title: "Two dashboards disagree",
      body: "The CFO's working-capital view assumes one cash conversion. The ops dashboard assumes another. Both retrievable. Only one matches the thesis the IC actually approved.",
    },
    {
      n: 4,
      nature: "UNWRITTEN RULE",
      title: "Operating partner blocks generic plans",
      body: "On industrial services assets, the operating partner requires a customer-concentration callout in every 100-day plan. Past plans without it were sent back. Nobody wrote the rule down.",
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
              The 100-day plan AI drafted reads cleanly.{' '}
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
                100-Day plan · Asset Δ · Operating thesis
              </span>
              <div className="flex items-center gap-2 ml-3 pl-3 border-l" style={{ borderColor: `hsl(${TEAL} / 0.18)` }}>
                <Sparkles size={14} style={{ color: `hsl(${ACCENT})` }} />
                <span className="font-bold tracking-[0.14em] uppercase" style={{ fontSize: 10.5, color: `hsl(${ACCENT})` }}>
                  Drafted by AI · ready for review
                </span>
              </div>
              <span className="ml-auto font-mono" style={{ fontSize: 10.5, color: MUTED }}>
                100-Day Plan · cycle current
              </span>
            </div>

            <div className="px-9 pt-6 pb-3" style={{ borderBottom: `1px dashed hsl(${TEAL} / 0.18)` }}>
              <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                <div className="mt-1"><span style={{ color: MUTED, width: 90, display: "inline-block" }}>Asset</span>
                  <span style={{ color: TEXT, fontWeight: 800, fontSize: 16 }}>Project Atlas · industrial services</span>
                  <span style={{ color: MUTED }}> · mid-market · DACH</span>
                </div>
                <div><span style={{ color: MUTED, width: 90, display: "inline-block" }}>Sponsor</span>
                  <span style={{ color: TEXT, fontWeight: 600 }}>LCV Partners · Ops team</span>
                </div>
                <div><span style={{ color: MUTED, width: 90, display: "inline-block" }}>Audience</span>
                  <span style={{ color: TEXT, fontWeight: 600 }}>Portfolio CEO · LP update · IC</span>
                </div>
              </div>
            </div>

            <div className="flex-1 px-9 py-7"
              style={{ fontSize: 20, color: TEXT, lineHeight: 1.7, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              <p className="mb-5">The integration plan was set against <Mark n={1}>the standard cost-synergy template</Mark> as established in diligence.</p>
              <p className="mb-5">Working capital actions follow <Mark n={2}>the firm's standard 100-day playbook.</Mark>.</p>
              <p className="mb-5">Reporting cadence will follow <Mark n={3}>the standard portfolio dashboard</Mark>.</p>
              <p style={{ color: MUTED }}><Mark n={4}>The asset is on track to hit its operating thesis.</Mark></p>
            </div>

            <div className="px-9 py-3.5 flex items-center gap-3"
              style={{ borderTop: `1px solid hsl(${WARM} / 0.22)`, background: `hsl(${WARM} / 0.06)` }}>
              <AlertTriangle size={18} style={{ color: `hsl(${WARM})` }} />
              <p className="font-black" style={{ fontSize: 15, color: TEXT }}>
                IC-ready? No. CEO-update-blocking. Thesis-misaligned.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-black tracking-[0.18em] uppercase" style={{ fontSize: 14, color: `hsl(${WARM})` }}>
                What AI couldn&apos;t see
              </p>
              <p className="font-semibold" style={{ fontSize: 13, color: MUTED }}>
                Lives in IC notes, TSA threads, operating partners' heads.
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
                  IM. CDD. Diligence reports. Standard playbook. Dashboards.
                </p>
                <p className="mt-1 font-semibold" style={{ fontSize: 12, color: MUTED }}>
                  Indexable. RAG-friendly. Insufficient for an IC or an LP.
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
                <p style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: "An <strong>Organizational Intelligence</strong> layer that captures live thesis revisions, open TSA disputes, and operating-partner conventions and resolves them at plan-write time." }} />
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
// SLIDE — PEOPLE AS NODES (Portfolio Operations)
// ═══════════════════════════════════════════════════════════════════════════════

function SlidePeopleAsNodes() {
  const team = [
    { name: "Eva", role: "Deal Lead" },
    { name: "Raj", role: "Ops Partner" },
    { name: "Maria", role: "Portfolio CFO" },
    { name: "Anna", role: "Value Creation" },
    { name: "Tom", role: "IR / LP" },
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
    { label: "IM", x: 60, y: 60 },
    { label: "CDD", x: 240, y: 50 },
    { label: "Playbook", x: 80, y: 170 },
    { label: "Dashboards", x: 240, y: 180 },
    { label: "IC memos", x: 50, y: 280 },
    { label: "LP letters", x: 240, y: 300 },
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
                Memos and playbooks define what. Deal leads, operating partners and portfolio CEOs define how.
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
                  <radialGradient id="lcv-aiHaloGreen" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                    <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                  </radialGradient>
                  <radialGradient id="lcv-contextField" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={`hsl(${GREEN} / 0.10)`} />
                    <stop offset="70%" stopColor={`hsl(${TEAL} / 0.06)`} />
                    <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                  </radialGradient>
                </defs>

                <circle cx="200" cy="200" r="180" fill="url(#lcv-contextField)" />

                {(() => {
                  const edgeLabels: Record<string, string> = {"0-1":"thesis alignment","0-2":"value-creation plan","2-3":"covenant memory","2-4":"LP narrative"};
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
                    <circle cx={p.x} cy={p.y} r="48" fill="url(#lcv-aiHaloGreen)" />
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
// SLIDE — ORGANIZATIONAL INTELLIGENCE UNPACKED (Portfolio Operations)
// ═══════════════════════════════════════════════════════════════════════════════

function SlideOrgIntelligence() {
  const facets = [
    {
      icon: <Brain size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Senior Operating Judgment",
      body: "How experienced deal leads, operating partners and portfolio CEOs actually decide: which lever pulls first, when to swap CEOs, when 'on track' is acceptable. Today: trapped in heads.",
    },
    {
      icon: <Users size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Asset & LP Memory",
      body: "How this asset is run: prior IC commitments, LP sensitivities, what was promised at the last AGM, who owns each open value-creation initiative.",
    },
    {
      icon: <RefreshCw size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Changing Theses & Markets",
      body: "Thesis revisions, market resets, multiple compression, sector outlook shifts. Context that drifted last week and rewrote the right answer for this quarter's update.",
    },
    {
      icon: <Target size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Fund & Cycle Strategy",
      body: "What the partnership locked this vintage, which assets are exit-ready, which are double-down, which are write-down candidates. Most AI never gets told.",
    },
    {
      icon: <Globe size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "LP & External Signals",
      body: "LP feedback, regulator letters, lender covenant resets, sector benchmarks, M&A signals. Facts from outside the firm the team must react to.",
    },
    {
      icon: <GitBranch size={26} style={{ color: `hsl(${TEAL})` }} />,
      title: "Decisions & Exceptions",
      body: "IC thresholds, open covenants, asset-specific waivers, the rules that override the rules. The connective tissue between playbook and portfolio.",
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
          The 90% the iceberg points at. Up close, it is six interacting layers. A lcv knowledge graph is what holds them together.
        </p>

        <div className="flex-1 min-h-0 grid gap-8 items-center" style={{ gridTemplateColumns: "5fr 7fr" }}>
          <div className="relative h-full rounded-2xl border-2 flex items-center justify-center"
            style={{ borderColor: `hsl(${GREEN} / 0.30)`, background: `linear-gradient(135deg, hsl(${TEAL} / 0.04), hsl(${GREEN} / 0.06))` }}>
            <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="lcv-oiHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={`hsl(${GREEN} / 0.35)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                </radialGradient>
              </defs>
              <circle cx="250" cy="250" r="220" fill="url(#lcv-oiHalo)" />
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
          <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: "This substrate looks different in industrial services than in software than in healthcare. <strong>Which is why execution has to be sub-sector.</strong>" }} />
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
  { id: 4, title: "Where Missing Context Shows Up", component: <Slide03 /> },
  { id: 5, title: "What Missing Context Costs", component: <Slide03Cost /> },
  { id: 6, title: "Early Validation", component: <Slide08 /> },
  { id: 7, title: "Why Now", component: <SlideWhyNow /> },
  { id: 8, title: "The Context Layer", component: <Slide05 /> },
  { id: 9, title: "People as Nodes", component: <SlidePeopleAsNodes /> },
  { id: 10, title: "Organizational Intelligence", component: <SlideOrgIntelligence /> },
  { id: 11, title: "Category Thesis & Moat", component: <Slide06 /> },
  { id: 12, title: "Expansion Path", component: <Slide09 /> },
  { id: 13, title: "What's Built", component: <Slide10 /> },
  { id: 14, title: "Business Model", component: <Slide11 /> },
  { id: 15, title: "30-Day Challenge", component: <SlideExecutionChallenge /> },
  { id: 16, title: "Team", component: <Slide12 /> },
  { id: 17, title: "The Ask", component: <Slide13 /> },
  { id: 18, title: "Appendix", component: <SlideAppendixDivider /> },
  { id: 19, title: "Appendix: Architecture", component: <SlideArchitecture /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function LCVInvestorDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-LCV-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20 hover:bg-muted/70">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20 hover:bg-muted/70">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg hover:bg-muted/70">
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS · LCV Partners</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-LCV-Investor-Deck" slideCount={SLIDES.length} />
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS · LCV Partners</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-LCV-Investor-Deck" slideCount={SLIDES.length} />
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

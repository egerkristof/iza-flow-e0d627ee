import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  ArrowRight, CheckCircle2, AlertTriangle, Clock, Users,
  Shield, Pill, FileCheck, Activity, ShieldCheck, Sparkles,
  CircleDot, Crosshair, Map, Trophy, Wrench, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";

// ─── Scale container ──────────────────────────────────────────────────────────

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

// ─── Design tokens ───────────────────────────────────────────────────────────

const BG     = "hsl(0 0% 100%)";
const BG2    = "hsl(195 15% 97%)";
const C      = "200 35% 12%";
const MUT    = "200 12% 42%";
const ACCENT = "195 80% 35%";
const TEAL   = "170 65% 32%";
const GOLD   = "42 85% 45%";
const RED    = "0 72% 45%";
const DARK   = "200 35% 8%";
const CORAL  = "12 75% 55%";

function GridBg() {
  return (
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `linear-gradient(hsl(195 15% 85%) 1px, transparent 1px), linear-gradient(90deg, hsl(195 15% 85%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function Bar() {
  return <div className="absolute bottom-0 left-0 right-0 h-1"
    style={{ background: `linear-gradient(90deg, hsl(${ACCENT}), hsl(${TEAL}))` }} />;
}

// ─── Journey progress (6 steps) ──────────────────────────────────────────────

const STEPS = [
  { num: 1, label: "Problem", color: ACCENT, icon: <Crosshair size={18} /> },
  { num: 2, label: "Why Now", color: ACCENT, icon: <Map size={18} /> },
  { num: 3, label: "Options", color: ACCENT, icon: <CircleDot size={18} /> },
  { num: 4, label: "Results", color: ACCENT, icon: <Trophy size={18} /> },
  { num: 5, label: "How", color: CORAL, icon: <Wrench size={18} /> },
  { num: 6, label: "Summary", color: CORAL, icon: <Package size={18} /> },
];

function StepBar({ activeStep }: { activeStep: number }) {
  return (
    <div className="absolute top-[40px] left-1/2 -translate-x-1/2 flex items-center gap-0 z-20">
      {STEPS.map((step, i) => {
        const isActive = step.num === activeStep;
        const isPast = activeStep > step.num;
        return (
          <div key={step.num} className="flex items-center">
            {i > 0 && (
              <div className="w-[60px] h-[2px]" style={{
                background: isPast ? `hsl(${ACCENT} / 0.5)` : `hsl(${MUT} / 0.15)`
              }} />
            )}
            <div className="flex flex-col items-center" style={{ width: 100 }}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1.5"
                style={{
                  borderColor: isActive ? `hsl(${step.color})` : isPast ? `hsl(${ACCENT} / 0.4)` : `hsl(${MUT} / 0.15)`,
                  background: isActive ? `hsl(${step.color} / 0.12)` : `transparent`,
                  color: isActive ? `hsl(${step.color})` : isPast ? `hsl(${ACCENT} / 0.5)` : `hsl(${MUT} / 0.25)`,
                  ...(isActive ? { boxShadow: `0 0 20px hsl(${step.color} / 0.25)` } : {}),
                }}>
                {isPast ? <span style={{ fontSize: 14, fontWeight: 700 }}>✓</span> : <span className="font-bold" style={{ fontSize: 14 }}>{step.num}</span>}
              </div>
              <p className="font-bold" style={{
                fontSize: isActive ? 14 : 12,
                color: isActive ? `hsl(${step.color})` : isPast ? `hsl(${MUT} / 0.6)` : `hsl(${MUT} / 0.3)`,
              }}>{step.label}</p>
            </div>
          </div>
        );
      })}
      {/* Demand / Supply labels */}
      <div className="absolute -top-[28px] left-[30px]" style={{ width: 460 }}>
        <div className="rounded-full px-4 py-1 text-center" style={{ background: `hsl(${ACCENT} / 0.08)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
          <span className="font-semibold" style={{ fontSize: 11, color: `hsl(${ACCENT})`, letterSpacing: "0.1em" }}>THE CHALLENGE — What research shows</span>
        </div>
      </div>
      <div className="absolute -top-[28px] right-[10px]" style={{ width: 280 }}>
        <div className="rounded-full px-4 py-1 text-center" style={{ background: `hsl(${CORAL} / 0.08)`, border: `1px solid hsl(${CORAL} / 0.2)` }}>
          <span className="font-semibold" style={{ fontSize: 11, color: `hsl(${CORAL})`, letterSpacing: "0.1em" }}>THE SOLUTION — LIZA OS</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — THE PROJECT
// "What was this organisation trying to accomplish?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01Project() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={1} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full pt-[80px]">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <Pill size={22} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <div>
              <p className="font-bold" style={{ fontSize: 14, color: `hsl(${MUT})`, letterSpacing: "0.12em" }}>ONE REAL CUSTOMER · THEIR POV</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>Mid-Sized Pharma · EU Specialty & Biosimilars</p>
            </div>
          </div>

          <h2 className="font-black mb-6" style={{ fontSize: 60, color: `hsl(${C})`, lineHeight: 1.05 }}>
            "Get our first biosimilar
            <br /><span style={{ color: `hsl(${ACCENT})` }}>from Phase III to EMA approval
            <br />in under 18 months."</span>
          </h2>

          <p className="mb-8" style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            A €400M-revenue specialty pharma company had completed Phase III for their first biosimilar.
            Now they needed to assemble a regulatory dossier, navigate EMA scientific advice,
            and launch in 12+ EU markets — <strong style={{ color: `hsl(${C})` }}>with a regulatory affairs team of 9 people</strong>.
          </p>

          <div className="flex gap-4">
            {[
              { v: "€400M", l: "Revenue" },
              { v: "9", l: "RA team members" },
              { v: "12+", l: "Target markets" },
              { v: "18 mo", l: "Timeline to approval" },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-5 py-4 text-center" style={{ background: BG2, border: `1px solid hsl(${ACCENT} / 0.12)`, minWidth: 120 }}>
                <p className="font-black" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>{s.v}</p>
                <p style={{ fontSize: 13, color: `hsl(${MUT})` }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: "hsl(0 0% 100%)" }}>The Project</p>
          <p className="mb-6" style={{ fontSize: 19, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.55 }}>
            Take a completed Phase III biosimilar through the full regulatory gauntlet — eCTD assembly, EMA submission, national variation filings — and get it to market before the patent window closed.
          </p>
          <div className="space-y-3">
            {["Assemble CTD Modules 2–5", "File EMA centralised procedure", "Prepare 12 national dossier variations", "Train 4 junior RA associates simultaneously"].map(t => (
              <div key={t} className="flex items-start gap-3">
                <ArrowRight size={16} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 4 }} />
                <p style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.8)` }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE CONTEXT
// "Why was this on their critical path vs everything else?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02Context() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={2} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Why <span style={{ color: `hsl(${RED})` }}>this</span> project,
            <br />why <span style={{ color: `hsl(${RED})` }}>now</span>?
          </h2>

          <div className="space-y-5 mb-8">
            <div className="rounded-xl p-6" style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={22} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${RED})` }}>The Patent Clock</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                The originator's SPC expires in 22 months. Every month of delay costs an estimated <strong style={{ color: `hsl(${C})` }}>€8M in lost first-mover advantage</strong>. Three competitors are also in late-stage development.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${GOLD} / 0.04)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Clock size={22} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>The Knowledge Bottleneck</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                Only <strong style={{ color: `hsl(${C})` }}>2 of their 9 RA team members</strong> had ever filed a centralised EMA procedure. The head of RA was 14 months from retirement. If this filing failed, the institutional knowledge to fix it would be gone.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Users size={22} style={{ color: `hsl(${ACCENT})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>The Scale Problem</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                12 national variation dossiers. Each slightly different. They couldn't hire 12 senior RA specialists — and outsourcing to a CRO for all 12 would cost <strong style={{ color: `hsl(${C})` }}>€3M+ and take longer</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[400px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${RED})` }}>What was at stake</p>
          <div className="space-y-5">
            {[
              { v: "€96M+", l: "Potential revenue loss from 12-month delay", color: RED },
              { v: "22 mo", l: "Until patent window closes", color: GOLD },
              { v: "3", l: "Competitors in parallel development", color: CORAL },
              { v: "14 mo", l: "Until Head of RA retires", color: ACCENT },
            ].map(s => (
              <div key={s.l} className="flex items-baseline gap-4">
                <span className="font-black" style={{ fontSize: 32, color: `hsl(${s.color})`, flexShrink: 0 }}>{s.v}</span>
                <span style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.4 }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE OPTIONS
// "What options did they consider?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03Options() {
  const options = [
    {
      label: "Option A",
      title: "Hire Senior RA Staff",
      verdict: "Too slow",
      color: RED,
      points: [
        "6–9 month recruitment cycle for experienced RA leads",
        "Salary cost: €120K–180K × 3 hires = €450K+/yr",
        "Still depends on tacit knowledge transfer from Head of RA",
      ],
    },
    {
      label: "Option B",
      title: "Outsource to a CRO",
      verdict: "Too expensive, too disconnected",
      color: GOLD,
      points: [
        "Full-service CRO quote: €3.2M for 12-market dossier",
        "Timeline: 20–24 months (longer than in-house)",
        "No knowledge retained internally — next product starts from zero",
      ],
    },
    {
      label: "Option C",
      title: "Use Generic AI Tools",
      verdict: "Too risky",
      color: CORAL,
      points: [
        "ChatGPT / Copilot can draft — but can't enforce GxP judgment",
        "No audit trail, no gate enforcement, no versioning",
        "\"AI-generated\" regulatory text is a red flag for assessors",
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={3} />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[80px]">
        <h2 className="font-black mb-3" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Three options. <span style={{ color: `hsl(${MUT})` }}>None of them worked.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 900 }}>
          Every conventional path either took too long, cost too much, or left the knowledge locked in people's heads.
        </p>

        <div className="grid grid-cols-3 gap-7">
          {options.map(opt => (
            <div key={opt.label} className="rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${opt.color} / 0.2)`, background: `hsl(${opt.color} / 0.03)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 14, color: `hsl(${opt.color})` }}>{opt.label}</p>
              <h3 className="font-black mb-2" style={{ fontSize: 28, color: `hsl(${C})` }}>{opt.title}</h3>
              <div className="rounded-full px-4 py-1 mb-5 self-start" style={{ background: `hsl(${opt.color} / 0.1)`, border: `1px solid hsl(${opt.color} / 0.3)` }}>
                <span className="font-bold" style={{ fontSize: 14, color: `hsl(${opt.color})` }}>{opt.verdict}</span>
              </div>
              <div className="space-y-3 flex-1">
                {opt.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <X size={16} style={{ color: `hsl(${opt.color})`, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl p-5 text-center" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
          <p style={{ fontSize: 22, color: `hsl(${C})`, fontWeight: 700 }}>
            They needed a way to <span style={{ color: `hsl(${ACCENT})` }}>encode their Head of RA's judgment</span> so 7 junior associates could execute at senior level — <em>before she retired</em>.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE RESULTS
// "What did success look like? How did they know they accomplished it?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04Results() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={4} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Approved in <span style={{ color: `hsl(${TEAL})` }}>14 months</span>.
            <br />Zero major deficiencies.
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {[
              { v: "14 mo", l: "From Phase III completion to EMA positive opinion", color: TEAL, sub: "vs. 18-month target" },
              { v: "0", l: "Major deficiency letters", color: TEAL, sub: "First-cycle approval" },
              { v: "12", l: "National dossier variations filed within 6 weeks of centralised approval", color: ACCENT, sub: "vs. typical 4–6 months" },
              { v: "€2.1M", l: "Saved vs. CRO outsourcing quote", color: GOLD, sub: "67% cost reduction" },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-6" style={{ background: `hsl(${s.color} / 0.04)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                <p className="font-black mb-1" style={{ fontSize: 44, color: `hsl(${s.color})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 18, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 20, color: `hsl(${C})`, fontWeight: 600, lineHeight: 1.5 }}>
              "The EMA assessor commented that the dossier was <span style={{ color: `hsl(${TEAL})` }}>unusually consistent across modules</span> — they could trace every clinical decision back to documented rationale. That's never happened to us before."
            </p>
            <p className="mt-2" style={{ fontSize: 15, color: `hsl(${MUT})`, fontStyle: "italic" }}>— VP Regulatory Affairs</p>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>The Hidden Win</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.55 }}>
            When the Head of RA retired 3 months after approval, the team didn't skip a beat. Her judgment was encoded. The next biosimilar filing started immediately — with the <strong style={{ color: "hsl(0 0% 100%)" }}>same playbooks, same consistency</strong>.
          </p>
          <div className="space-y-4">
            {[
              "Knowledge survived personnel transition",
              "2nd biosimilar filing started 2 weeks after retirement",
              "Junior associates now operate at senior level",
            ].map(t => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.8)`, lineHeight: 1.4 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — THE "HOW"
// "How exactly did they complete the project?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05How() {
  const phases = [
    {
      week: "Weeks 1–3",
      title: "Knowledge Extraction",
      desc: "Sat with the Head of RA and encoded her judgment into LIZA Playbooks — how she decides CTD module structure, what triggers a Type II variation, how she reads deficiency letters.",
      color: ACCENT,
      icon: <Sparkles size={22} />,
    },
    {
      week: "Weeks 4–8",
      title: "Protocol Execution",
      desc: "Junior associates began executing eCTD assembly using gate-enforced playbooks. Every section had encoded quality checks, cross-reference validation, and compliance gates.",
      color: GOLD,
      icon: <ShieldCheck size={22} />,
    },
    {
      week: "Weeks 9–14",
      title: "Dossier Assembly",
      desc: "Context Bundles mapped directly to CTD modules. Module 2.5 (Clinical Overview) pulled from governed clinical data. Full audit trail built automatically.",
      color: TEAL,
      icon: <FileCheck size={22} />,
    },
    {
      week: "Months 5–14",
      title: "Submission & Variations",
      desc: "Centralised EMA filing + 12 national variations executed in parallel by the same 9-person team. Playbooks encoded which markets need specific adaptations.",
      color: CORAL,
      icon: <Activity size={22} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={5} />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[80px]">
        <h2 className="font-black mb-3" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
          How they did it — <span style={{ color: `hsl(${CORAL})` }}>with LIZA</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 900 }}>
          The Head of RA's 25 years of judgment, encoded into executable playbooks. Her team ran them — with full gate enforcement and audit trails.
        </p>

        <div className="grid grid-cols-4 gap-6">
          {phases.map((p, i) => (
            <div key={p.title} className="rounded-2xl border p-6 flex flex-col relative" style={{ borderColor: `hsl(${p.color} / 0.2)`, background: `hsl(${p.color} / 0.03)` }}>
              {i < phases.length - 1 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10" style={{ color: `hsl(${MUT} / 0.3)` }}>
                  <ArrowRight size={20} />
                </div>
              )}
              <div className="rounded-full px-3 py-1 mb-4 self-start" style={{ background: `hsl(${p.color} / 0.1)`, border: `1px solid hsl(${p.color} / 0.25)` }}>
                <span className="font-bold" style={{ fontSize: 13, color: `hsl(${p.color})` }}>{p.week}</span>
              </div>
              <div className="flex items-center gap-2 mb-3" style={{ color: `hsl(${p.color})` }}>
                {p.icon}
                <h3 className="font-black" style={{ fontSize: 22, color: `hsl(${C})` }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          {[
            { icon: <Shield size={18} />, t: "Full GxP audit trail" },
            { icon: <ShieldCheck size={18} />, t: "21 CFR Part 11 aligned" },
            { icon: <CheckCircle2 size={18} />, t: "ICH E6(R3) compliant execution" },
          ].map(b => (
            <div key={b.t} className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <span style={{ color: `hsl(${ACCENT})` }}>{b.icon}</span>
              <span className="font-semibold" style={{ fontSize: 15, color: `hsl(${ACCENT})` }}>{b.t}</span>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — THE "WHAT"
// "What did they buy? (Your packaging, positioning, pricing, offer)"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06What() {
  const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

  return (
    <div className="w-full h-full flex relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <StepBar activeStep={6} />

      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 56, color: "hsl(0 0% 100%)", lineHeight: 1.05 }}>
            What they got:
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              LIZA OS for Pharma
            </span>
          </h2>

          <div className="space-y-4 mb-8">
            {[
              { t: "Knowledge Extraction Sprint", d: "2-week engagement to encode your senior experts' judgment into executable playbooks", icon: <Sparkles size={20} /> },
              { t: "LIZA OS Platform", d: "Context Bundles, Protocol Execution, Gate Enforcement, Audit Trails — your regulatory operating system", icon: <Shield size={20} /> },
              { t: "Pharma Compliance Architecture", d: "GxP-ready, 21 CFR Part 11 aligned, ICH E6(R3) compliant execution framework", icon: <ShieldCheck size={20} /> },
              { t: "Ongoing Knowledge Refinement", d: "Every filing, every deficiency response, every variation — feeds back and makes your playbooks smarter", icon: <Activity size={20} /> },
            ].map(item => (
              <div key={item.t} className="flex items-start gap-4 rounded-xl p-5"
                style={{ background: `hsl(0 0% 100% / 0.05)`, border: `1px solid hsl(0 0% 100% / 0.08)` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${ACCENT} / 0.15)`, color: `hsl(${ACCENT})` }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ fontSize: 20, color: "hsl(0 0% 100%)" }}>{item.t}</p>
                  <p style={{ fontSize: 17, color: `hsl(0 0% 100% / 0.6)`, lineHeight: 1.45 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 rounded-full font-bold transition-transform hover:scale-[1.03]"
              style={{ fontSize: 20, height: 58, background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, color: "hsl(0 0% 100%)" }}>
              Book a Diagnostic Call <ArrowRight size={20} />
            </a>
            <a href="/diagnostic" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 rounded-full font-bold border-2 transition-transform hover:scale-[1.03]"
              style={{ fontSize: 20, height: 58, borderColor: `hsl(0 0% 100% / 0.25)`, color: `hsl(0 0% 100% / 0.9)` }}>
              Take the Self-Diagnostic
            </a>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(0 0% 100% / 0.06)`, border: `1px solid hsl(0 0% 100% / 0.1)` }}>
          <p className="font-extrabold mb-5" style={{ fontSize: 22, color: `hsl(${CORAL})` }}>Clone this story.</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.55 }}>
            This isn't a one-off. It's a <strong style={{ color: "hsl(0 0% 100%)" }}>repeatable pattern</strong>. Every pharma company has senior experts whose judgment isn't encoded. Every team has the same bottleneck.
          </p>
          <div className="space-y-3">
            {[
              "Your SOPs exist. Your people don't follow them consistently.",
              "Your experts will retire. Their judgment doesn't have to.",
              "Your next filing can be as consistent as your best filing.",
            ].map(t => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle2 size={16} style={{ color: `hsl(${CORAL})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 15, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.4 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDES ARRAY & SHELL
// ═══════════════════════════════════════════════════════════════════════════════

const SLIDES = [
  { id: "project", title: "1 · The Project", component: <Slide01Project /> },
  { id: "context", title: "2 · The Context", component: <Slide02Context /> },
  { id: "options", title: "3 · The Options", component: <Slide03Options /> },
  { id: "results", title: "4 · The Results", component: <Slide04Results /> },
  { id: "how",     title: '5 · The "How"', component: <Slide05How /> },
  { id: "what",    title: '6 · The "What"', component: <Slide06What /> },
];

const CHROME_BG = "hsl(210 15% 97%)";
const CHROME_BORDER = "hsl(210 12% 90%)";

export default function PharmaDeck() {
  const [current, setCurrent] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const navTimer = useRef<ReturnType<typeof setTimeout>>();
  const exportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();
  const [mobileControlsVisible, setMobileControlsVisible] = useState(true);
  const mobileTimer = useRef<ReturnType<typeof setTimeout>>();

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);
  const goTo = useCallback((i: number) => { setCurrent(i); setShowGrid(false); }, []);

  const showMobileControls = useCallback(() => {
    setMobileControlsVisible(true);
    if (mobileTimer.current) clearTimeout(mobileTimer.current);
    mobileTimer.current = setTimeout(() => setMobileControlsVisible(false), 3000);
  }, []);

  useSwipe(next, prev);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && isFullscreen) { document.exitFullscreen?.(); setIsFullscreen(false); }
      if (e.key === "f" || e.key === "F") enterFullscreen();
      if (e.key === "g" || e.key === "G") setShowGrid(v => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const move = () => { setShowNav(true); clearTimeout(navTimer.current); navTimer.current = setTimeout(() => setShowNav(false), 2500); };
    window.addEventListener("mousemove", move);
    move();
    return () => { window.removeEventListener("mousemove", move); clearTimeout(navTimer.current); };
  }, [isFullscreen]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.();
    setIsFullscreen(true);
  };

  // ── Mobile layout ──
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50" style={{ background: "#000" }} onClick={showMobileControls}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <Pill size={32} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: `hsl(${C})` }}>Rotate your device to landscape</p>
            <p className="text-center" style={{ fontSize: 14, color: `hsl(${MUT})` }}>for the best viewing experience</p>
          </div>
        )}
        <ScaledSlide>{SLIDES[current].component}</ScaledSlide>
        {!isPortrait && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }} disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Previous slide">
              <ChevronLeft size={32} style={{ color: "hsl(195 15% 42% / 0.5)" }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next slide">
              <ChevronRight size={32} style={{ color: "hsl(195 15% 42% / 0.5)" }} />
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
            <ChevronLeft size={18} style={{ color: `hsl(${C})` }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: `hsl(${MUT})` }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: `hsl(${C})` }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-CaseStudy" slideCount={SLIDES.length} variant="mobile" iconColor={`hsl(${MUT})`} />
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  // ── Fullscreen ──
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50" style={{ background: "#000" }}>
        <ScaledSlide>{SLIDES[current].component}</ScaledSlide>
        <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 rounded-full border backdrop-blur-xl transition-opacity duration-500",
          showNav ? "opacity-100" : "opacity-0 pointer-events-none")}
          style={{ background: "hsl(220 20% 10% / 0.85)", borderColor: "hsl(220 15% 25%)" }}>
          <Button variant="ghost" size="icon" onClick={prev} disabled={current === 0} className="text-white/70 hover:text-white hover:bg-white/10">
            <ChevronLeft size={20} />
          </Button>
          <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: "hsl(0 0% 70%)" }}>
            {current + 1} / {SLIDES.length}
          </span>
          <Button variant="ghost" size="icon" onClick={next} disabled={current === SLIDES.length - 1} className="text-white/70 hover:text-white hover:bg-white/10">
            <ChevronRight size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }} className="text-white/70 hover:text-white hover:bg-white/10">
            <X size={18} />
          </Button>
        </div>
      </div>
    );
  }

  // ── Grid ──
  if (showGrid) {
    return (
      <div className="min-h-screen p-8" style={{ background: CHROME_BG }}>
        <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold" style={{ color: `hsl(${C})` }}>All Slides</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowGrid(false)} style={{ color: `hsl(${MUT})` }}>
            <X size={18} className="mr-1" /> Close
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {SLIDES.map((slide, i) => (
            <button key={slide.id} onClick={() => goTo(i)}
              className={cn("rounded-xl overflow-hidden border transition-all hover:scale-[1.02]",
                i === current ? "ring-2" : "")}
              style={{ borderColor: CHROME_BORDER, ...(i === current ? { ringColor: `hsl(${ACCENT})` } : {}) }}>
              <div className="aspect-video"><ScaledSlide>{slide.component}</ScaledSlide></div>
              <div className="p-2 text-left" style={{ background: CHROME_BG }}>
                <p className="text-[10px] font-mono" style={{ color: `hsl(${MUT})` }}>{slide.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Default editor layout ──
  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-4 h-12 border-b flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>Pharma Case Study</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-CaseStudy" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
          <Button size="sm" variant="ghost" onClick={enterFullscreen} style={{ color: `hsl(${MUT})` }}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="w-44 flex flex-col gap-2 p-3 overflow-y-auto border-r shrink-0"
            style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
            {SLIDES.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)}
                className={cn("rounded-lg overflow-hidden border transition-all text-left",
                  i === current ? "ring-2 shadow-sm" : "hover:border-gray-300")}
                style={{ borderColor: i === current ? `hsl(${ACCENT})` : CHROME_BORDER, ...(i === current ? { ringColor: `hsl(${ACCENT} / 0.3)` } : {}) }}>
                <div className="aspect-video"><ScaledSlide>{s.component}</ScaledSlide></div>
                <div className="px-2 py-1.5" style={{ background: CHROME_BG }}>
                  <p className="text-[9px] font-mono truncate" style={{ color: `hsl(${MUT})` }}>{s.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-xl border" style={{ borderColor: CHROME_BORDER }}>
              <ScaledSlide>{SLIDES[current].component}</ScaledSlide>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 pb-4">
            <Button variant="outline" size="icon" onClick={prev} disabled={current === 0}><ChevronLeft size={18} /></Button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: `hsl(${MUT})` }}>{current + 1} / {SLIDES.length}</span>
            <Button variant="outline" size="icon" onClick={next} disabled={current === SLIDES.length - 1}><ChevronRight size={18} /></Button>
          </div>
        </div>
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}

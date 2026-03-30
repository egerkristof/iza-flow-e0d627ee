import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  ArrowRight, CheckCircle2, AlertTriangle, Clock, Users,
  Shield, FileSearch, FileCheck, Activity, ShieldCheck, Sparkles,
  CircleDot, Crosshair, Map, Trophy, Wrench, Package,
  ClipboardCheck, FileSpreadsheet, Search, RefreshCw, Zap, Brain, Target
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
const ACCENT = "210 75% 38%";
const TEAL   = "170 65% 32%";
const GOLD   = "42 85% 45%";
const RED    = "0 72% 45%";
const DARK   = "210 35% 8%";
const CORAL  = "12 75% 55%";

function GridBg() {
  return (
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `linear-gradient(hsl(210 15% 85%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 15% 85%) 1px, transparent 1px)`,
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
      <div className="absolute -top-[28px] left-[30px]" style={{ width: 460 }}>
        <div className="rounded-full px-4 py-1 text-center" style={{ background: `hsl(${ACCENT} / 0.08)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
          <span className="font-semibold" style={{ fontSize: 11, color: `hsl(${ACCENT})`, letterSpacing: "0.1em" }}>THE CHALLENGE — Pharma audit reality</span>
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
// SLIDE 1 — THE PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01Problem() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={1} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full pt-[80px]">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <ClipboardCheck size={22} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <div>
              <p className="font-bold" style={{ fontSize: 14, color: `hsl(${MUT})`, letterSpacing: "0.12em" }}>THE AUDIT EXECUTION CRISIS</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>GxP, GMP, GDP & Vendor Audits</p>
            </div>
          </div>

          <h2 className="font-black mb-6" style={{ fontSize: 54, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Pharma audits are still
            <br /><span style={{ color: `hsl(${RED})` }}>manually assembled,
            <br />one question at a time.</span>
          </h2>

          <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            Whether it's a GMP site inspection, a vendor qualification, or an internal quality audit — the execution pattern is the same: <strong style={{ color: `hsl(${C})` }}>search, read, draft, format, repeat</strong>. Hundreds of times per audit.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "18 days", l: "Average time to complete a complex pharma audit manually", src: "Industry benchmark" },
              { v: "500–3,800", l: "Questions per GxP or vendor qualification audit", src: "Audit firm data" },
              { v: "40%", l: "Of auditor time spent on document search and evidence matching", src: "Deloitte, 2023" },
              { v: "84%", l: "First-pass accuracy with LIZA vs ~40% with generic AI tools", src: "LIZA pilot data" },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-5 py-4" style={{ background: BG2, border: `1px solid hsl(${ACCENT} / 0.12)` }}>
                <p className="font-black" style={{ fontSize: 32, color: `hsl(${ACCENT})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 15, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 12, color: `hsl(${MUT})`, fontStyle: "italic" }}>{s.src}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: "hsl(0 0% 100%)" }}>The manual audit loop</p>
          <div className="space-y-4 mb-6">
            {[
              { icon: <FileSpreadsheet size={18} />, text: "Open Excel audit checklist" },
              { icon: <Search size={18} />, text: "Read question, search client docs" },
              { icon: <Target size={18} />, text: "Find and match evidence" },
              { icon: <FileCheck size={18} />, text: "Draft structured answer" },
              { icon: <RefreshCw size={18} />, text: "Repeat 500 to 3,800 times" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 rounded-lg px-4 py-3"
                style={{ background: `hsl(0 0% 100% / 0.06)`, border: `1px solid hsl(0 0% 100% / 0.08)` }}>
                <span style={{ color: `hsl(${RED})` }}>{item.icon}</span>
                <p style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.8)` }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3" style={{ background: `hsl(${RED} / 0.15)`, border: `1px solid hsl(${RED} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 14, color: `hsl(${RED})` }}>
              Senior auditors spend more time assembling than analysing.
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — WHY NOW
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02WhyNow() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={2} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 54, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Three forces making pharma
            <br /><span style={{ color: `hsl(${RED})` }}>audits unsustainable</span>
          </h2>

          <div className="space-y-5 mb-8">
            <div className="rounded-xl p-6" style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={22} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${RED})` }}>Regulatory Complexity Is Accelerating</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                ICH E6(R3), EU GMP Annex 11 revisions, FDA's evolving data integrity guidance — audit scopes are expanding while the <strong style={{ color: `hsl(${C})` }}>frameworks auditors must cover multiply</strong>. A single vendor qualification now touches 5–8 regulatory domains.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${GOLD} / 0.04)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Users size={22} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>The Auditor Shortage</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                Experienced GxP auditors are retiring faster than replacements are trained. Firms increasingly rely on <strong style={{ color: `hsl(${C})` }}>subcontractors at premium rates</strong>, with variable quality and no institutional memory.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={22} style={{ color: `hsl(${ACCENT})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>The Generic AI Trap</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                Teams experimenting with ChatGPT get faster drafts — but <strong style={{ color: `hsl(${C})` }}>no evidence traceability, no audit trail, and hallucinated citations</strong>. In a regulated environment, that's worse than slow.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>The compounding pressure</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.55 }}>
            More audits, more questions, fewer qualified auditors, stricter expectations. <strong style={{ color: "hsl(0 0% 100%)" }}>Something has to give.</strong>
          </p>
          <div className="space-y-5">
            {[
              { v: "3×", l: "Increase in regulatory audit scope since 2019", color: RED },
              { v: "35%", l: "Auditor workforce gap projected by 2028", color: GOLD },
              { v: "0%", l: "Of generic AI tools provide evidence traceability", color: ACCENT },
            ].map(s => (
              <div key={s.l} className="flex items-baseline gap-4">
                <span className="font-black" style={{ fontSize: 32, color: `hsl(${s.color})`, flexShrink: 0 }}>{s.v}</span>
                <span style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.4 }}>{s.l}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg p-4" style={{ background: `hsl(${RED} / 0.15)`, border: `1px solid hsl(${RED} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 15, color: `hsl(${RED})` }}>
              The current model doesn't scale. The question is what replaces it.
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03Options() {
  const options = [
    {
      label: "Option A",
      title: "Hire More Auditors",
      verdict: "Unscalable economics",
      color: RED,
      points: [
        "Experienced GxP auditors command £800–1,500/day",
        "Training a junior to 'audit-ready' takes 12–18 months",
        "Subcontractors lack institutional context and produce inconsistent output",
      ],
    },
    {
      label: "Option B",
      title: "Generic AI / ChatGPT",
      verdict: "Speed without traceability",
      color: GOLD,
      points: [
        "Produces plausible-sounding answers — but no evidence citations",
        "No audit trail, no confidence scoring, no GxP alignment",
        "Every session starts from scratch — zero institutional memory",
      ],
    },
    {
      label: "Option C",
      title: "LIZA Audit Engine",
      verdict: "Purpose-built for pharma audits",
      color: TEAL,
      isHighlighted: true,
      points: [
        "Structured answers with traceable evidence from your client documentation",
        "Confidence scoring and quality validation on every response",
        "Full audit trail — designed to support GxP requirements from day one",
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={3} />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[80px]">
        <h2 className="font-black mb-3" style={{ fontSize: 54, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Current options — <span style={{ color: `hsl(${MUT})` }}>and what's missing.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 950 }}>
          Pharma audit teams face a trilemma: speed, quality, or cost. Existing solutions force a trade-off. The LIZA Audit Engine removes it.
        </p>

        <div className="grid grid-cols-3 gap-7">
          {options.map(opt => (
            <div key={opt.label} className="rounded-2xl border p-7 flex flex-col relative"
              style={{
                borderColor: opt.isHighlighted ? `hsl(${opt.color} / 0.5)` : `hsl(${opt.color} / 0.2)`,
                background: opt.isHighlighted ? `hsl(${opt.color} / 0.06)` : `hsl(${opt.color} / 0.03)`,
                ...(opt.isHighlighted ? { boxShadow: `0 0 40px hsl(${opt.color} / 0.1)` } : {}),
              }}>
              {opt.isHighlighted && (
                <div className="absolute -top-3 right-6 rounded-full px-4 py-1"
                  style={{ background: `hsl(${TEAL})`, color: "hsl(0 0% 100%)" }}>
                  <span className="font-bold" style={{ fontSize: 12 }}>PURPOSE-BUILT</span>
                </div>
              )}
              <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 14, color: `hsl(${opt.color})` }}>{opt.label}</p>
              <h3 className="font-black mb-2" style={{ fontSize: 28, color: `hsl(${C})` }}>{opt.title}</h3>
              <div className="rounded-full px-4 py-1 mb-5 self-start" style={{ background: `hsl(${opt.color} / 0.1)`, border: `1px solid hsl(${opt.color} / 0.3)` }}>
                <span className="font-bold" style={{ fontSize: 14, color: `hsl(${opt.color})` }}>{opt.verdict}</span>
              </div>
              <div className="space-y-3 flex-1">
                {opt.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {opt.isHighlighted
                      ? <CheckCircle2 size={16} style={{ color: `hsl(${opt.color})`, flexShrink: 0, marginTop: 3 }} />
                      : <X size={16} style={{ color: `hsl(${opt.color})`, flexShrink: 0, marginTop: 3 }} />
                    }
                    <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl p-5 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <p style={{ fontSize: 22, color: `hsl(${C})`, fontWeight: 700 }}>
            The answer isn't more people or faster AI. It's <span style={{ color: `hsl(${TEAL})` }}>a purpose-built engine that handles the mechanical layer</span> — so auditors can focus on judgment.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04Results() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={4} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 54, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Proven on <span style={{ color: `hsl(${TEAL})` }}>real audits.</span>
            <br />Measured results.
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {[
              { v: "18 → 1.5", l: "Days reduced to hours for first-pass generation", color: TEAL, sub: "Proven on ~800-question cybersecurity audits" },
              { v: "84%", l: "First-pass accuracy — vs ~40% with generic AI", color: TEAL, sub: "Structured, traceable answers ready for senior review" },
              { v: "10×", l: "Throughput increase per senior auditor", color: ACCENT, sub: "One senior can supervise multiple parallel audits" },
              { v: "Full", l: "Evidence traceability on every answer", color: GOLD, sub: "Every response cites source documentation and page references" },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-6" style={{ background: `hsl(${s.color} / 0.04)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                <p className="font-black mb-1" style={{ fontSize: 42, color: `hsl(${s.color})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 18, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 20, color: `hsl(${C})`, fontWeight: 600, lineHeight: 1.5 }}>
              Senior auditors <span style={{ color: `hsl(${TEAL})` }}>review and sign off</span>. The engine handles question search, evidence matching, answer drafting, and formatting. Expertise stays with your team — repetition moves to the engine.
            </p>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>What auditors say</p>
          <div className="space-y-5">
            {[
              { q: "I used to spend 3 days just finding and matching evidence. Now I spend 3 hours reviewing what the engine found.", who: "Lead GMP Auditor" },
              { q: "The confidence scoring tells me exactly where to focus my time. I'm not re-reading — I'm validating.", who: "Senior Quality Auditor" },
              { q: "We ran two vendor qualifications in parallel. That was physically impossible before.", who: "QA Director" },
            ].map(item => (
              <div key={item.q} className="border-l-2 pl-4" style={{ borderColor: `hsl(${TEAL} / 0.5)` }}>
                <p className="italic mb-1" style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.85)`, lineHeight: 1.45 }}>"{item.q}"</p>
                <p style={{ fontSize: 13, color: `hsl(${TEAL})` }}>{item.who}</p>
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
// SLIDE 5 — HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05How() {
  const phases = [
    {
      step: "Step 1",
      title: "Ingest",
      desc: "Upload your audit question set (Excel/spreadsheet) and client evidence documentation. The engine indexes and maps everything automatically.",
      color: ACCENT,
      icon: <FileSearch size={22} />,
    },
    {
      step: "Step 2",
      title: "Execute",
      desc: "The engine processes every question: searches evidence, matches relevant documentation, drafts structured answers with source citations and confidence scores.",
      color: GOLD,
      icon: <Zap size={22} />,
    },
    {
      step: "Step 3",
      title: "Validate",
      desc: "Built-in quality assurance pass flags low-confidence answers, missing evidence, and potential gaps. Auditors review and sign off — not re-do.",
      color: TEAL,
      icon: <ShieldCheck size={22} />,
    },
    {
      step: "Step 4",
      title: "Compound",
      desc: "Every completed audit feeds institutional memory. Future audits leverage past evidence patterns, client-specific context, and cross-engagement intelligence.",
      color: CORAL,
      icon: <Brain size={22} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={5} />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[80px]">
        <h2 className="font-black mb-3" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
          How the Audit Engine works — <span style={{ color: `hsl(${CORAL})` }}>in practice</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 900 }}>
          Not a chatbot. Not a GRC suite. A purpose-built execution engine that handles the mechanical layer of pharma audits — so your experts can focus on judgment.
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
                <span className="font-bold" style={{ fontSize: 13, color: `hsl(${p.color})` }}>{p.step}</span>
              </div>
              <div className="flex items-center gap-2 mb-3" style={{ color: `hsl(${p.color})` }}>
                {p.icon}
                <h3 className="font-black" style={{ fontSize: 24, color: `hsl(${C})` }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          {[
            { icon: <FileSpreadsheet size={18} />, t: "Works with your existing Excel workflow" },
            { icon: <Shield size={18} />, t: "Full audit trail on every answer" },
            { icon: <CheckCircle2 size={18} />, t: "No platform migration required" },
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
// SLIDE 6 — SUMMARY & CTA
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06Summary() {
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
          <h2 className="font-black mb-8" style={{ fontSize: 54, color: "hsl(0 0% 100%)", lineHeight: 1.05 }}>
            Your auditors have expertise.
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Let them use it.
            </span>
          </h2>

          <div className="space-y-4 mb-8">
            {[
              { num: "1", t: "The problem is mechanical", d: "Auditors spend 80% of their time on search, matching, and formatting — not on the judgment calls that actually matter." },
              { num: "2", t: "Generic AI makes it worse", d: "Faster drafts without evidence traceability create new regulatory risk in a GxP environment." },
              { num: "3", t: "Hiring can't keep up", d: "The auditor talent gap is widening. The answer isn't more people — it's augmenting the ones you have." },
              { num: "4", t: "LIZA handles the mechanical layer", d: "Purpose-built for pharma audits: evidence matching, structured answers, confidence scoring, full audit trail." },
            ].map(item => (
              <div key={item.num} className="flex items-start gap-4 rounded-xl p-4"
                style={{ background: `hsl(0 0% 100% / 0.05)`, border: `1px solid hsl(0 0% 100% / 0.08)` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${ACCENT} / 0.2)`, color: `hsl(${ACCENT})` }}>
                  <span className="font-black" style={{ fontSize: 16 }}>{item.num}</span>
                </div>
                <div>
                  <p className="font-bold mb-0.5" style={{ fontSize: 20, color: "hsl(0 0% 100%)" }}>{item.t}</p>
                  <p style={{ fontSize: 17, color: `hsl(0 0% 100% / 0.6)`, lineHeight: 1.45 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 rounded-full font-bold transition-transform hover:scale-[1.03]"
              style={{ fontSize: 20, height: 58, background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, color: "hsl(0 0% 100%)" }}>
              Book a 20-Min Demo <ArrowRight size={20} />
            </a>
            <a href="/diagnostic" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 rounded-full font-bold border-2 transition-transform hover:scale-[1.03]"
              style={{ fontSize: 20, height: 58, borderColor: `hsl(0 0% 100% / 0.25)`, color: `hsl(0 0% 100% / 0.9)` }}>
              Take the Self-Diagnostic
            </a>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(0 0% 100% / 0.06)`, border: `1px solid hsl(0 0% 100% / 0.1)` }}>
          <p className="font-extrabold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>Pilot in 3 steps</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.55 }}>
            See the engine run on a <strong style={{ color: "hsl(0 0% 100%)" }}>real audit question set</strong> with your actual client documentation. Measure the time saved before you commit.
          </p>
          <div className="space-y-5">
            {[
              { num: "1", label: "20-minute intro call", desc: "We understand your audit workflow and answer your questions." },
              { num: "2", label: "Live walkthrough", desc: "See the engine process a real audit question set in real time." },
              { num: "3", label: "Pilot on one real audit", desc: "Measure the time saved on your actual workload." },
            ].map(step => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${ACCENT} / 0.2)`, color: `hsl(${ACCENT})` }}>
                  <span className="font-black" style={{ fontSize: 14 }}>{step.num}</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ fontSize: 16, color: "hsl(0 0% 100%)" }}>{step.label}</p>
                  <p style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.55)`, lineHeight: 1.4 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-6">
            {[
              { v: "GxP", l: "Designed for" },
              { v: "GMP", l: "Audit-ready" },
              { v: "GDP", l: "Supported" },
            ].map(s => (
              <div key={s.v} className="text-center">
                <p className="font-black" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>{s.v}</p>
                <p style={{ fontSize: 11, color: `hsl(0 0% 100% / 0.4)` }}>{s.l}</p>
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
  { id: "problem", title: "1 · The Problem", component: <Slide01Problem /> },
  { id: "why-now", title: "2 · Why Now", component: <Slide02WhyNow /> },
  { id: "options", title: "3 · The Options", component: <Slide03Options /> },
  { id: "results", title: "4 · The Results", component: <Slide04Results /> },
  { id: "how",     title: "5 · How It Works", component: <Slide05How /> },
  { id: "summary", title: "6 · Summary", component: <Slide06Summary /> },
];

const CHROME_BG = "hsl(210 15% 97%)";
const CHROME_BORDER = "hsl(210 12% 90%)";

export default function PharmaAuditDeck() {
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

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50" style={{ background: "#000" }} onClick={showMobileControls}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <ClipboardCheck size={32} style={{ color: `hsl(${ACCENT})` }} />
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
              <ChevronLeft size={32} style={{ color: "hsl(210 15% 42% / 0.5)" }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next slide">
              <ChevronRight size={32} style={{ color: "hsl(210 15% 42% / 0.5)" }} />
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-PharmaAudit-Pitch" slideCount={SLIDES.length} variant="mobile" iconColor={`hsl(${MUT})`} />
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

  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-4 h-12 border-b flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>Pharma Audit Pitch</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-PharmaAudit-Pitch" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
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

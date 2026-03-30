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
// SLIDE 1 — THE PROBLEM
// "What does the research say? What are people telling us?"
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
              <Pill size={22} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <div>
              <p className="font-bold" style={{ fontSize: 14, color: `hsl(${MUT})`, letterSpacing: "0.12em" }}>WHAT THE RESEARCH SHOWS</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>The Standards Gap in Life Sciences</p>
            </div>
          </div>

          <h2 className="font-black mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Every pharma company has SOPs.
            <br /><span style={{ color: `hsl(${RED})` }}>Nobody follows them
            <br />the same way.</span>
          </h2>

          <p className="mb-8" style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            Research consistently shows the same pattern: organisations invest heavily in documenting processes, but <strong style={{ color: `hsl(${C})` }}>execution varies wildly between teams, sites, and individuals</strong>. The documents exist. The consistency doesn't.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "€2.6B", l: "Average cost to bring one drug to market — inconsistent execution is a major contributor", src: "Deloitte, 2023" },
              { v: "90%", l: "Of clinical candidates fail before approval", src: "FDA, 2022" },
              { v: "42%", l: "Of deviations traced to inconsistent SOP interpretation", src: "PDA Survey" },
              { v: "68%", l: "Of pharma leaders say knowledge transfer is their top operational risk", src: "McKinsey" },
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
          <p className="font-bold mb-5" style={{ fontSize: 22, color: "hsl(0 0% 100%)" }}>What we keep hearing</p>
          <div className="space-y-5">
            {[
              { q: "Our SOPs are world-class. Our execution isn't.", who: "VP Quality, Top-20 Pharma" },
              { q: "We have the same process in 8 sites. We get 8 different outcomes.", who: "Head of Clinical Ops" },
              { q: "When our best people leave, years of judgment walk out the door.", who: "Chief Scientific Officer" },
              { q: "AI gives us speed. But without domain-specific gate enforcement, it's just faster non-compliance.", who: "Head of Regulatory Affairs" },
            ].map(item => (
              <div key={item.q} className="border-l-2 pl-4" style={{ borderColor: `hsl(${ACCENT} / 0.5)` }}>
                <p className="italic mb-1" style={{ fontSize: 17, color: `hsl(0 0% 100% / 0.85)`, lineHeight: 1.45 }}>"{item.q}"</p>
                <p style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>{item.who}</p>
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
// SLIDE 2 — WHY NOW
// "Why is this the urgent problem? Why treat it now?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02WhyNow() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={2} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Three forces making this
            <br /><span style={{ color: `hsl(${RED})` }}>unsolvable with current tools</span>
          </h2>

          <div className="space-y-5 mb-8">
            <div className="rounded-xl p-6" style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={22} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${RED})` }}>The AI Acceleration Trap</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                Teams are adopting AI tools that generate outputs <em>faster</em> — but without encoded judgment, they're producing <strong style={{ color: `hsl(${C})` }}>inconsistent work at higher speed</strong>. The hallucination problem in pharma isn't a bug — it's a regulatory catastrophe waiting to happen.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${GOLD} / 0.04)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Clock size={22} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>The Expertise Cliff</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                The most experienced regulatory, clinical, and quality professionals are retiring. Industry research shows <strong style={{ color: `hsl(${C})` }}>40% of senior pharma expertise will turn over by 2030</strong>. When they leave, decades of judgment leave with them — and it's not in the SOPs.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Users size={22} style={{ color: `hsl(${ACCENT})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>The Compliance Squeeze</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
                Regulators are tightening expectations — ICH E6(R3), EU GMP Annex 11 updates, FDA's evolving AI guidance. They want <strong style={{ color: `hsl(${C})` }}>demonstrable consistency and traceability</strong>, not just documented procedures.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>The gap is widening</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.55 }}>
            Each of these forces is accelerating independently. Together, they create a compounding problem: <strong style={{ color: "hsl(0 0% 100%)" }}>more AI, fewer experts, stricter regulators</strong>.
          </p>
          <div className="space-y-5">
            {[
              { v: "3×", l: "Faster output velocity with AI tools", color: RED },
              { v: "40%", l: "Senior expertise turnover by 2030", color: GOLD },
              { v: "2024", l: "ICH E6(R3) effective date", color: ACCENT },
            ].map(s => (
              <div key={s.l} className="flex items-baseline gap-4">
                <span className="font-black" style={{ fontSize: 32, color: `hsl(${s.color})`, flexShrink: 0 }}>{s.v}</span>
                <span style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.4 }}>{s.l}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg p-4" style={{ background: `hsl(${RED} / 0.15)`, border: `1px solid hsl(${RED} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 15, color: `hsl(${RED})` }}>
              The window to encode senior judgment before it's lost is closing.
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
// "What prevents people from solving this? What are the current options?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03Options() {
  const options = [
    {
      label: "Option A",
      title: "More Documentation",
      verdict: "Necessary but insufficient",
      color: RED,
      points: [
        "SOPs, work instructions, and training manuals already exist",
        "Documents describe what to do — not how to think about edge cases",
        "Usage audits consistently show 'read and understood' ≠ consistent execution",
      ],
    },
    {
      label: "Option B",
      title: "Generic AI / Copilots",
      verdict: "Speed without judgment",
      color: GOLD,
      points: [
        "ChatGPT / Copilot generate faster — but can't enforce your standards",
        "No audit trail, no gate enforcement, no GxP compliance",
        "Hallucinations in pharma aren't bugs — they're regulatory events",
      ],
    },
    {
      label: "Option C",
      title: "LIZA OS",
      verdict: "Encoded judgment at scale",
      color: TEAL,
      isHighlighted: true,
      points: [
        "Encode how your best people think — not just what they document",
        "Gate-enforced playbooks ensure every person executes at senior level",
        "Full audit trail, GxP-ready, ICH-compliant architecture",
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={3} />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[80px]">
        <h2 className="font-black mb-3" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Why budgets don't move — <span style={{ color: `hsl(${MUT})` }}>and what changes.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 950 }}>
          Organisations recognise the problem, but existing approaches either address the wrong layer or create new risks. Here's what the market currently offers — and what's missing.
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
                  <span className="font-bold" style={{ fontSize: 12 }}>THE MISSING LAYER</span>
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
            The problem isn't documentation or AI speed. It's that <span style={{ color: `hsl(${TEAL})` }}>nobody has encoded how the best people think</span> — and made it the default for everyone else.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE RESULTS
// "What would success look like? What should people expect?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04Results() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <StepBar activeStep={4} />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[80px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.05 }}>
            What <span style={{ color: `hsl(${TEAL})` }}>success</span> looks like
            <br />when judgment is encoded.
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {[
              { v: "100%", l: "Consistent execution across teams and sites", color: TEAL, sub: "Same playbook, same quality — regardless of who runs it" },
              { v: "0", l: "Knowledge lost when senior experts leave", color: TEAL, sub: "Judgment is encoded, not trapped in people's heads" },
              { v: "60–70%", l: "Reduction in onboarding time for new hires", color: ACCENT, sub: "Junior staff execute at senior level from day one" },
              { v: "Full", l: "Audit trail for every decision and gate", color: GOLD, sub: "GxP-ready, regulator-friendly provenance" },
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
              The goal isn't to replace your experts. It's to make their <span style={{ color: `hsl(${TEAL})` }}>judgment the organisational default</span> — so that when anyone executes a process, they execute it the way your best person would.
            </p>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>The shift</p>
          <div className="space-y-6">
            {[
              { from: "SOPs as static PDFs", to: "Living, executable playbooks" },
              { from: "Training = 'read and sign'", to: "Training = guided execution with gates" },
              { from: "Knowledge in people's heads", to: "Judgment encoded in the system" },
              { from: "AI generates plausible text", to: "AI governed by your standards" },
            ].map(s => (
              <div key={s.from}>
                <p className="line-through mb-1" style={{ fontSize: 15, color: `hsl(0 0% 100% / 0.4)` }}>{s.from}</p>
                <div className="flex items-center gap-2">
                  <ArrowRight size={14} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>{s.to}</p>
                </div>
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
// SLIDE 5 — HOW LIZA SOLVES IT
// "How does this actually work?"
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05How() {
  const phases = [
    {
      step: "Step 1",
      title: "Extract",
      desc: "We sit with your senior experts and extract their judgment — not just what they do, but how they decide. The criteria, the edge cases, the 'taste' that separates good from great.",
      color: ACCENT,
      icon: <Sparkles size={22} />,
    },
    {
      step: "Step 2",
      title: "Encode",
      desc: "That judgment becomes executable Playbooks with gate enforcement. Every step has quality checks, compliance gates, and encoded decision criteria — not just instructions.",
      color: GOLD,
      icon: <ShieldCheck size={22} />,
    },
    {
      step: "Step 3",
      title: "Execute",
      desc: "Your entire team — senior and junior alike — runs the same playbooks. The system guides, enforces gates, and captures a full audit trail. Consistency becomes the default.",
      color: TEAL,
      icon: <FileCheck size={22} />,
    },
    {
      step: "Step 4",
      title: "Evolve",
      desc: "Every execution generates feedback. Deviations are detected, patterns surfaced, and playbooks improve. Your organisational judgment compounds — it gets smarter with use.",
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
          How LIZA OS works — <span style={{ color: `hsl(${CORAL})` }}>in practice</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 900 }}>
          Not another document management system. Not another AI chatbot. A management layer that turns your best people's judgment into your organisation's operating standard.
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
            { icon: <Shield size={18} />, t: "GxP audit trail built-in" },
            { icon: <ShieldCheck size={18} />, t: "21 CFR Part 11 aligned" },
            { icon: <CheckCircle2 size={18} />, t: "ICH E6(R3) compliant" },
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
          <h2 className="font-black mb-8" style={{ fontSize: 56, color: "hsl(0 0% 100%)", lineHeight: 1.05 }}>
            Your SOPs exist.
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Make them actually work.
            </span>
          </h2>

          <div className="space-y-4 mb-8">
            {[
              { num: "1", t: "The problem is real", d: "Inconsistent execution costs billions and kills drugs that should have succeeded." },
              { num: "2", t: "The window is closing", d: "Senior experts are retiring, AI is accelerating outputs without judgment, and regulators want proof of consistency." },
              { num: "3", t: "More docs and generic AI won't fix it", d: "You need to encode how your best people think — and make it executable." },
              { num: "4", t: "LIZA OS is the missing layer", d: "Extract judgment → Encode it → Execute consistently → Evolve with every use." },
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
          <p className="font-extrabold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>Start here</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.55 }}>
            A <strong style={{ color: "hsl(0 0% 100%)" }}>20-minute Diagnostic Debrief</strong> to assess your organisation's Standards Gap — where judgment is encoded, where it isn't, and where the highest-ROI opportunities are.
          </p>
          <div className="space-y-4">
            {[
              "Map your consistency gaps across teams",
              "Identify which expert judgment is most at risk",
              "Get a prioritised roadmap for encoding",
              "No commitment — just clarity",
            ].map(t => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle2 size={16} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 15, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.4 }}>{t}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-6">
            {[
              { v: "GxP", l: "Ready" },
              { v: "21 CFR", l: "Aligned" },
              { v: "ICH", l: "Compliant" },
            ].map(s => (
              <div key={s.l} className="text-center">
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

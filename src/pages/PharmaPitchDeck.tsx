import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  ArrowRight, CheckCircle2, AlertTriangle, Clock, Users,
  Shield, Pill, FileCheck, Activity, ShieldCheck, Sparkles,
  CircleDot, Crosshair, Map, Trophy, Wrench, Package,
  ClipboardCheck, FileSpreadsheet, Search, RefreshCw, Zap, Brain, Target,
  FileSearch, Layers, Building2
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
const BG2    = "hsl(200 15% 97%)";
const C      = "200 35% 12%";
const MUT    = "200 12% 42%";
const ACCENT = "200 75% 36%";
const TEAL   = "170 65% 32%";
const GOLD   = "42 85% 45%";
const RED    = "0 72% 45%";
const DARK   = "200 35% 8%";
const CORAL  = "12 75% 55%";

function GridBg() {
  return (
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `linear-gradient(hsl(200 15% 85%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 15% 85%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function Bar() {
  return <div className="absolute bottom-0 left-0 right-0 h-1"
    style={{ background: `linear-gradient(90deg, hsl(${ACCENT}), hsl(${TEAL}))` }} />;
}

// ─── Act indicator (replaces StepBar) ────────────────────────────────────────

const ACTS = [
  { num: 1, label: "Audit Engine", color: GOLD },
  { num: 2, label: "The Platform", color: ACCENT },
  { num: 3, label: "Lifecycle", color: CORAL },
];

function ActBar({ activeAct, slideLabel }: { activeAct: number; slideLabel: string }) {
  return (
    <div className="absolute top-[36px] left-1/2 -translate-x-1/2 flex items-center gap-0 z-20">
      {ACTS.map((act, i) => {
        const isActive = act.num === activeAct;
        const isPast = activeAct > act.num;
        return (
          <div key={act.num} className="flex items-center">
            {i > 0 && (
              <div className="w-[100px] h-[2px]" style={{
                background: isPast ? `hsl(${ACCENT} / 0.5)` : `hsl(${MUT} / 0.15)`
              }} />
            )}
            <div className="flex flex-col items-center" style={{ width: 160 }}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1.5"
                style={{
                  borderColor: isActive ? `hsl(${act.color})` : isPast ? `hsl(${ACCENT} / 0.4)` : `hsl(${MUT} / 0.15)`,
                  background: isActive ? `hsl(${act.color} / 0.12)` : `transparent`,
                  color: isActive ? `hsl(${act.color})` : isPast ? `hsl(${ACCENT} / 0.5)` : `hsl(${MUT} / 0.25)`,
                  ...(isActive ? { boxShadow: `0 0 20px hsl(${act.color} / 0.25)` } : {}),
                }}>
                {isPast ? <span style={{ fontSize: 14, fontWeight: 700 }}>✓</span> : <span className="font-bold" style={{ fontSize: 14 }}>{act.num}</span>}
              </div>
              <p className="font-bold" style={{
                fontSize: isActive ? 14 : 12,
                color: isActive ? `hsl(${act.color})` : isPast ? `hsl(${MUT} / 0.6)` : `hsl(${MUT} / 0.3)`,
              }}>Act {act.num}: {act.label}</p>
            </div>
          </div>
        );
      })}
      <div className="absolute -bottom-[22px] left-1/2 -translate-x-1/2">
        <span className="font-semibold" style={{ fontSize: 12, color: `hsl(${MUT} / 0.5)`, letterSpacing: "0.08em" }}>{slideLabel}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TITLE SLIDE
// ═══════════════════════════════════════════════════════════════════════════════

function SlideTitle() {
  return (
    <div className="w-full h-full flex relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 flex h-full items-center px-[140px] w-full">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.15)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <Pill size={28} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <span className="font-bold tracking-[0.15em]" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>LIZA OS FOR PHARMA</span>
          </div>

          <h1 className="font-black mb-6" style={{ fontSize: 72, color: "hsl(0 0% 100%)", lineHeight: 1.0 }}>
            The Operating System
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              for Pharma Intelligence
            </span>
          </h1>

          <p className="mb-10" style={{ fontSize: 26, color: `hsl(0 0% 100% / 0.6)`, lineHeight: 1.55, maxWidth: 750 }}>
            From audit execution to medicine lifecycle management — encode how your best people think and make it your organisation's default.
          </p>

          <div className="flex gap-6">
            {ACTS.map(act => (
              <div key={act.num} className="flex items-center gap-3 rounded-xl px-5 py-3"
                style={{ background: `hsl(${act.color} / 0.1)`, border: `1px solid hsl(${act.color} / 0.25)` }}>
                <span className="font-black" style={{ fontSize: 28, color: `hsl(${act.color})` }}>{act.num}</span>
                <div>
                  <p className="font-bold" style={{ fontSize: 16, color: `hsl(${act.color})` }}>{act.label}</p>
                  <p style={{ fontSize: 12, color: `hsl(0 0% 100% / 0.4)` }}>
                    {act.num === 1 ? "Why pharma needs a new layer" : act.num === 2 ? "Purpose-built audit capabilities" : "Full lifecycle vision"}
                  </p>
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
// SECTION DIVIDERS
// ═══════════════════════════════════════════════════════════════════════════════

function SectionDivider({ actNum, title, subtitle, icon, color }: {
  actNum: number; title: string; subtitle: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="w-full h-full flex relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: `radial-gradient(circle, hsl(${color}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-[120px]">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: `hsl(${color} / 0.15)`, border: `1px solid hsl(${color} / 0.3)`, boxShadow: `0 0 60px hsl(${color} / 0.2)` }}>
          <span style={{ color: `hsl(${color})` }}>{icon}</span>
        </div>
        <p className="font-bold tracking-[0.2em] uppercase mb-4" style={{ fontSize: 18, color: `hsl(${color})` }}>ACT {actNum}</p>
        <h2 className="font-black mb-4" style={{ fontSize: 72, color: "hsl(0 0% 100%)", lineHeight: 1.0, textShadow: `0 4px 30px hsl(${color} / 0.3)` }}>
          {title}
        </h2>
        <p style={{ fontSize: 24, color: `hsl(0 0% 100% / 0.55)`, maxWidth: 700, lineHeight: 1.5 }}>{subtitle}</p>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 1 — THE PLATFORM
// ═══════════════════════════════════════════════════════════════════════════════

function Act1_Problem() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="THE STANDARDS GAP" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 54, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Every pharma company has SOPs.
            <br /><span style={{ color: `hsl(${RED})` }}>Nobody follows them
            <br />the same way.</span>
          </h2>

          <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            Research consistently shows the same pattern: organisations invest heavily in documenting processes, but <strong style={{ color: `hsl(${C})` }}>execution varies wildly between teams, sites, and individuals</strong>. The documents exist. The consistency doesn't.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "€2.6B", l: "Average cost to bring one drug to market", src: "Deloitte, 2023" },
              { v: "42%", l: "Of deviations traced to inconsistent SOP interpretation", src: "PDA Survey" },
              { v: "90%", l: "Of clinical candidates fail before approval", src: "FDA, 2022" },
              { v: "68%", l: "Of pharma leaders say knowledge transfer is their top risk", src: "McKinsey" },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-5 py-4" style={{ background: BG2, border: `1px solid hsl(${ACCENT} / 0.12)` }}>
                <p className="font-black" style={{ fontSize: 30, color: `hsl(${ACCENT})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 14, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 11, color: `hsl(${MUT})`, fontStyle: "italic" }}>{s.src}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[400px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: "hsl(0 0% 100%)" }}>What we keep hearing</p>
          <div className="space-y-5">
            {[
              { q: "Our SOPs are world-class. Our execution isn't.", who: "VP Quality, Top-20 Pharma" },
              { q: "We have the same process in 8 sites. We get 8 different outcomes.", who: "Head of Clinical Ops" },
              { q: "When our best people leave, years of judgment walk out the door.", who: "Chief Scientific Officer" },
            ].map(item => (
              <div key={item.q} className="border-l-2 pl-4" style={{ borderColor: `hsl(${ACCENT} / 0.5)` }}>
                <p className="italic mb-1" style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.85)`, lineHeight: 1.45 }}>"{item.q}"</p>
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

function Act1_WhyNow() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="WHY NOW" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 54, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Three forces making this
            <br /><span style={{ color: `hsl(${RED})` }}>unsolvable with current tools</span>
          </h2>

          <div className="space-y-5">
            <div className="rounded-xl p-6" style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={20} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 19, color: `hsl(${RED})` }}>The AI Acceleration Trap</p>
              </div>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Teams adopting AI tools generate outputs <em>faster</em> — but without encoded judgment, they produce <strong style={{ color: `hsl(${C})` }}>inconsistent work at higher speed</strong>. Without gate enforcement, AI in pharma is a regulatory event waiting to happen.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${GOLD} / 0.04)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 19, color: `hsl(${GOLD})` }}>The Expertise Cliff</p>
              </div>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                <strong style={{ color: `hsl(${C})` }}>40% of senior pharma expertise will turn over by 2030</strong>. When they leave, decades of judgment leave with them — and it's not in the SOPs.
              </p>
            </div>

            <div className="rounded-xl p-6" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} style={{ color: `hsl(${ACCENT})` }} />
                <p className="font-bold" style={{ fontSize: 19, color: `hsl(${ACCENT})` }}>The Compliance Squeeze</p>
              </div>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                ICH E6(R3), EU GMP Annex 11, FDA's evolving AI guidance — regulators want <strong style={{ color: `hsl(${C})` }}>demonstrable consistency and traceability</strong>, not just documented procedures.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[360px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>The gap is widening</p>
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

function Act1_Options() {
  const options = [
    {
      label: "Option A", title: "More Documentation", verdict: "Necessary but insufficient", color: RED,
      points: [
        "SOPs and work instructions already exist",
        "Documents describe what to do — not how to think about edge cases",
        "'Read and understood' ≠ consistent execution",
      ],
    },
    {
      label: "Option B", title: "Generic AI / Copilots", verdict: "Speed without enforcement", color: GOLD,
      points: [
        "ChatGPT / Copilot generate faster — but lack gate enforcement",
        "No audit trail, no compliance checks, no path to GxP",
        "Outputs require the same expert review they were meant to replace",
      ],
    },
    {
      label: "Option C", title: "LIZA OS", verdict: "Encoded judgment at scale", color: TEAL, isHighlighted: true,
      points: [
        "Encode how your best people think — not just what they document",
        "Gate-enforced playbooks ensure every person executes at senior level",
        "Full audit trail, architected for GxP and ICH alignment",
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="THE OPTIONS" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-3" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Why budgets don't move — <span style={{ color: `hsl(${MUT})` }}>and what changes.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, maxWidth: 900 }}>
          Existing approaches either address the wrong layer or create new risks.
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
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 2 — THE AUDIT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function Act2_AuditProblem() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={2} slideLabel="THE AUDIT CRISIS" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Pharma audits are still
            <br /><span style={{ color: `hsl(${RED})` }}>manually assembled,
            <br />one question at a time.</span>
          </h2>

          <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            Whether it's a GMP site inspection, vendor qualification, or internal quality audit — the execution pattern is the same: <strong style={{ color: `hsl(${C})` }}>search, read, draft, format, repeat</strong>. Hundreds of times per audit.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "18 days", l: "Average time to complete a complex pharma audit manually", src: "Industry benchmark" },
              { v: "500–3,800", l: "Questions per GxP or vendor qualification audit", src: "Audit firm data" },
              { v: "40%", l: "Of auditor time spent on document search and evidence matching", src: "Deloitte, 2023" },
              { v: "84%", l: "First-pass accuracy with LIZA vs ~40% with generic AI", src: "LIZA pilot data" },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-5 py-4" style={{ background: BG2, border: `1px solid hsl(${GOLD} / 0.12)` }}>
                <p className="font-black" style={{ fontSize: 30, color: `hsl(${GOLD})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 14, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 11, color: `hsl(${MUT})`, fontStyle: "italic" }}>{s.src}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[400px] flex-shrink-0 rounded-2xl p-8" style={{ background: `hsl(${DARK})` }}>
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

function Act2_Capabilities() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={2} slideLabel="WHAT THE ENGINE DOES" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-3" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
          The LIZA <span style={{ color: `hsl(${GOLD})` }}>Audit Engine</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, maxWidth: 900 }}>
          Purpose-built for pharma audits. Not a chatbot. Not a GRC suite. An execution engine that handles the mechanical layer so auditors can focus on judgment.
        </p>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { step: "1", title: "Ingest", desc: "Upload audit question set (Excel) and client documentation. Engine indexes and maps everything automatically.", color: ACCENT, icon: <FileSearch size={22} /> },
            { step: "2", title: "Execute", desc: "Processes every question: searches evidence, matches documentation, drafts structured answers with citations and confidence scores.", color: GOLD, icon: <Zap size={22} /> },
            { step: "3", title: "Validate", desc: "Quality assurance pass flags low-confidence answers, missing evidence, and gaps. Auditors review and sign off — not re-do.", color: TEAL, icon: <ShieldCheck size={22} /> },
            { step: "4", title: "Compound", desc: "Every completed audit feeds institutional memory. Future audits leverage past evidence patterns and cross-engagement intelligence.", color: CORAL, icon: <Brain size={22} /> },
          ].map((p, i) => (
            <div key={p.title} className="rounded-2xl border p-6 flex flex-col relative" style={{ borderColor: `hsl(${p.color} / 0.2)`, background: `hsl(${p.color} / 0.03)` }}>
              {i < 3 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10" style={{ color: `hsl(${MUT} / 0.3)` }}>
                  <ArrowRight size={20} />
                </div>
              )}
              <div className="rounded-full px-3 py-1 mb-4 self-start" style={{ background: `hsl(${p.color} / 0.1)`, border: `1px solid hsl(${p.color} / 0.25)` }}>
                <span className="font-bold" style={{ fontSize: 13, color: `hsl(${p.color})` }}>Step {p.step}</span>
              </div>
              <div className="flex items-center gap-2 mb-3" style={{ color: `hsl(${p.color})` }}>
                {p.icon}
                <h3 className="font-black" style={{ fontSize: 24, color: `hsl(${C})` }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {[
            { icon: <FileSpreadsheet size={18} />, t: "Works with your existing Excel workflow" },
            { icon: <Shield size={18} />, t: "Full audit trail on every answer" },
            { icon: <CheckCircle2 size={18} />, t: "No platform migration required" },
          ].map(b => (
            <div key={b.t} className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <span style={{ color: `hsl(${GOLD})` }}>{b.icon}</span>
              <span className="font-semibold" style={{ fontSize: 15, color: `hsl(${GOLD})` }}>{b.t}</span>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act2_Results() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={2} slideLabel="PROVEN RESULTS" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Proven on <span style={{ color: `hsl(${TEAL})` }}>real audits.</span>
            <br />Measured results.
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {[
              { v: "18 → 1.5", l: "Days reduced to hours for first-pass generation", color: TEAL, sub: "Proven on ~800-question cybersecurity audits" },
              { v: "84%", l: "First-pass accuracy — vs ~40% with generic AI", color: TEAL, sub: "Structured, traceable answers ready for senior review" },
              { v: "10×", l: "Throughput increase per senior auditor", color: GOLD, sub: "One senior can supervise multiple parallel audits" },
              { v: "Full", l: "Evidence traceability on every answer", color: GOLD, sub: "Every response cites source documentation and page references" },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-6" style={{ background: `hsl(${s.color} / 0.04)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                <p className="font-black mb-1" style={{ fontSize: 42, color: `hsl(${s.color})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 17, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 19, color: `hsl(${C})`, fontWeight: 600, lineHeight: 1.5 }}>
              Senior auditors <span style={{ color: `hsl(${TEAL})` }}>review and sign off</span>. The engine handles question search, evidence matching, answer drafting, and formatting.
            </p>
          </div>
        </div>

        <div className="w-[360px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>What auditors say</p>
          <div className="space-y-5">
            {[
              { q: "I used to spend 3 days just finding and matching evidence. Now I spend 3 hours reviewing what the engine found.", who: "Lead GMP Auditor" },
              { q: "The confidence scoring tells me exactly where to focus my time.", who: "Senior Quality Auditor" },
              { q: "We ran two vendor qualifications in parallel. That was physically impossible before.", who: "QA Director" },
            ].map(item => (
              <div key={item.q} className="border-l-2 pl-4" style={{ borderColor: `hsl(${TEAL} / 0.5)` }}>
                <p className="italic mb-1" style={{ fontSize: 15, color: `hsl(0 0% 100% / 0.85)`, lineHeight: 1.45 }}>"{item.q}"</p>
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
// ACT 3 — MEDICINE LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

function Act3_LifecycleVision() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={3} slideLabel="BEYOND AUDITS" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Audits are the entry point.
            <br /><span style={{ color: `hsl(${CORAL})` }}>The platform goes
            <br />much further.</span>
          </h2>

          <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            LIZA OS is the <strong style={{ color: `hsl(${C})` }}>System of Reasoning</strong> that sits alongside your Systems of Record. It manages the judgment behind every process — from audit to submission to post-market surveillance.
          </p>

          <div className="grid grid-cols-2 gap-5">
            {[
              { title: "Clinical Operations", desc: "Protocol execution, site monitoring, investigator consistency — guided by encoded expert judgment", color: ACCENT, icon: <Activity size={20} /> },
              { title: "Regulatory Affairs", desc: "Dossier assembly, submission readiness, agency response management with full traceability", color: TEAL, icon: <FileCheck size={20} /> },
              { title: "Quality & Compliance", desc: "Deviation handling, CAPA management, GMP execution — consistent across sites and teams", color: GOLD, icon: <ShieldCheck size={20} /> },
              { title: "Pharmacovigilance", desc: "Signal detection, case processing, PSUR preparation — enforced by domain-specific playbooks", color: CORAL, icon: <Shield size={20} /> },
            ].map(d => (
              <div key={d.title} className="rounded-xl p-5" style={{ background: `hsl(${d.color} / 0.04)`, border: `1px solid hsl(${d.color} / 0.15)` }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${d.color})` }}>
                  {d.icon}
                  <h3 className="font-bold" style={{ fontSize: 19, color: `hsl(${C})` }}>{d.title}</h3>
                </div>
                <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[360px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${CORAL})` }}>How it compounds</p>
          <p className="mb-6" style={{ fontSize: 17, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.55 }}>
            Every domain you encode feeds the same intelligence layer. Judgment from audit improves clinical ops. Quality insights inform regulatory submissions. <strong style={{ color: "hsl(0 0% 100%)" }}>The system gets smarter across functions</strong>.
          </p>
          <div className="space-y-4">
            {[
              { from: "Siloed expertise per department", to: "Cross-functional judgment layer" },
              { from: "Static SOPs per function", to: "Living playbooks that evolve" },
              { from: "Expert knowledge in people", to: "Encoded in the system" },
            ].map(s => (
              <div key={s.from}>
                <p className="line-through mb-1" style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.35)` }}>{s.from}</p>
                <div className="flex items-center gap-2">
                  <ArrowRight size={14} style={{ color: `hsl(${CORAL})` }} />
                  <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${CORAL})` }}>{s.to}</p>
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

function Act3_Results() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={3} slideLabel="THE OUTCOMES" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            What <span style={{ color: `hsl(${TEAL})` }}>success</span> looks like
            <br />when judgment is encoded.
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {[
              { v: "↑ 90%+", l: "Consistency across teams and sites", color: TEAL, sub: "Same playbook, same quality gates — regardless of who runs it" },
              { v: "Near 0", l: "Critical knowledge loss on expert turnover", color: TEAL, sub: "Judgment is encoded in the system, not trapped in people's heads" },
              { v: "60–70%", l: "Reduction in onboarding time for new hires", color: CORAL, sub: "Junior staff execute at senior level from day one" },
              { v: "Full", l: "Audit trail for every decision and gate", color: GOLD, sub: "Designed to support GxP and regulatory requirements" },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-6" style={{ background: `hsl(${s.color} / 0.04)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                <p className="font-black mb-1" style={{ fontSize: 42, color: `hsl(${s.color})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 17, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 19, color: `hsl(${C})`, fontWeight: 600, lineHeight: 1.5 }}>
              The goal isn't to replace your experts. It's to make their <span style={{ color: `hsl(${TEAL})` }}>judgment the organisational default</span>.
            </p>
          </div>
        </div>

        <div className="w-[360px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>The shift</p>
          <div className="space-y-6">
            {[
              { from: "SOPs as static PDFs", to: "Living, executable playbooks" },
              { from: "Training = 'read and sign'", to: "Training = guided execution with gates" },
              { from: "Knowledge in people's heads", to: "Judgment encoded in the system" },
              { from: "AI generates plausible text", to: "AI governed by your standards" },
            ].map(s => (
              <div key={s.from}>
                <p className="line-through mb-1" style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.4)` }}>{s.from}</p>
                <div className="flex items-center gap-2">
                  <ArrowRight size={14} style={{ color: `hsl(${TEAL})` }} />
                  <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{s.to}</p>
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

function Act3_Summary() {
  const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

  return (
    <div className="w-full h-full flex relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <ActBar activeAct={3} slideLabel="NEXT STEPS" />

      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-8" style={{ fontSize: 54, color: "hsl(0 0% 100%)", lineHeight: 1.05 }}>
            Your SOPs exist.
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Make them actually work.
            </span>
          </h2>

          <div className="space-y-3 mb-8">
            {[
              { num: "1", t: "The Standards Gap is real", d: "Inconsistent execution costs billions — and the research confirms it." },
              { num: "2", t: "Audit is the fastest proof point", d: "18 days → 1.5 hours. 84% first-pass accuracy. Measurable from day one." },
              { num: "3", t: "The platform compounds across functions", d: "From audit to clinical ops to regulatory — every domain you encode makes the system smarter." },
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
          <p className="font-extrabold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>Recommended path</p>
          <div className="space-y-5">
            {[
              { num: "1", label: "20-minute intro call", desc: "We understand your audit workflow and answer your questions." },
              { num: "2", label: "Live audit demo", desc: "See the engine process a real audit question set in real time." },
              { num: "3", label: "Pilot on one real audit", desc: "Measure the time saved on your actual workload." },
              { num: "4", label: "Expand across functions", desc: "Roll out to clinical ops, regulatory, quality — compound the value." },
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
              { v: "21 CFR", l: "Architected for" },
              { v: "ICH", l: "Targeting" },
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
  { id: "title",        title: "Title",                     component: <SlideTitle /> },
  // Act 1 — The Platform
  { id: "act1-divider", title: "Act 1 · The Platform",      component: <SectionDivider actNum={1} title="The Platform" subtitle="Why pharma needs a new management layer — the Standards Gap, the forces driving it, and why current tools can't solve it." icon={<Building2 size={36} />} color={ACCENT} /> },
  { id: "a1-problem",   title: "Standards Gap",              component: <Act1_Problem /> },
  { id: "a1-why-now",   title: "Why Now",                    component: <Act1_WhyNow /> },
  { id: "a1-options",   title: "The Options",                component: <Act1_Options /> },
  // Act 2 — Audit Engine
  { id: "act2-divider", title: "Act 2 · Audit Engine",      component: <SectionDivider actNum={2} title="The Audit Engine" subtitle="Purpose-built for pharma audits: GxP, GMP, vendor qualifications. Capabilities, proof points, and how it works." icon={<ClipboardCheck size={36} />} color={GOLD} /> },
  { id: "a2-problem",   title: "Audit Crisis",               component: <Act2_AuditProblem /> },
  { id: "a2-caps",      title: "How It Works",               component: <Act2_Capabilities /> },
  { id: "a2-results",   title: "Audit Results",              component: <Act2_Results /> },
  // Act 3 — Lifecycle
  { id: "act3-divider", title: "Act 3 · Lifecycle",          component: <SectionDivider actNum={3} title="Medicine Lifecycle" subtitle="From audit entry point to full lifecycle management — clinical ops, regulatory, quality, pharmacovigilance." icon={<Pill size={36} />} color={CORAL} /> },
  { id: "a3-vision",    title: "Lifecycle Vision",           component: <Act3_LifecycleVision /> },
  { id: "a3-results",   title: "Lifecycle Outcomes",         component: <Act3_Results /> },
  { id: "a3-summary",   title: "Summary & CTA",             component: <Act3_Summary /> },
];

const CHROME_BG = "hsl(200 15% 97%)";
const CHROME_BORDER = "hsl(200 12% 90%)";

export default function PharmaPitchDeck() {
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
              <ChevronLeft size={32} style={{ color: "hsl(200 15% 42% / 0.5)" }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next slide">
              <ChevronRight size={32} style={{ color: "hsl(200 15% 42% / 0.5)" }} />
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-Pitch" slideCount={SLIDES.length} variant="mobile" iconColor={`hsl(${MUT})`} />
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
          <h2 className="text-xl font-bold" style={{ color: `hsl(${C})` }}>All Slides — Pharma Pitch</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowGrid(false)} style={{ color: `hsl(${MUT})` }}>
            <X size={18} className="mr-1" /> Close
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
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
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>Pharma Pitch — 3-Act Deck</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-Pitch" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
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

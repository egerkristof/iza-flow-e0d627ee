import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Users, BarChart3, Shield, Workflow, FlaskConical, Search,
  Pill, Code, HeartHandshake, Microscope, FileCheck, Activity,
  Stethoscope, TestTubes, ClipboardList, Eye, Dna, Factory,
  ShieldCheck, FileText, GitBranch, Sparkles, CircleDot
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

// ─── Design tokens (pharma palette — deep teal/medical) ──────────────────────

const BG     = "hsl(0 0% 100%)";
const BG2    = "hsl(195 15% 97%)";
const BG3    = "hsl(195 12% 94%)";
const C      = "200 35% 12%";
const MUT    = "200 12% 42%";
const ACCENT = "195 80% 35%";   // medical teal
const TEAL   = "170 65% 32%";   // research green
const GOLD   = "42 85% 45%";    // clinical amber
const RED    = "0 72% 45%";
const PURPLE = "280 55% 48%";   // regulatory purple
const DARK   = "200 35% 8%";
const EMERALD = "155 60% 38%";

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

function Tag({ label, color = ACCENT }: { label: string; color?: string }) {
  return (
    <p className="font-bold tracking-[0.22em] uppercase mb-6"
      style={{ fontSize: 22, color: `hsl(${color})` }}>{label}</p>
  );
}

function Chip({ children, color = ACCENT }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-5 rounded-full border font-semibold"
      style={{ fontSize: 21, lineHeight: "44px", height: 44, borderColor: `hsl(${color} / 0.45)`, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>
      {children}
    </span>
  );
}

// ─── Lifecycle phases for progress bar ────────────────────────────────────────

const LIFECYCLE_PHASES = [
  { key: "discover", label: "Discover", subtitle: "Research", color: ACCENT, icon: <Microscope size={18} /> },
  { key: "develop", label: "Develop", subtitle: "Clinical", color: GOLD, icon: <TestTubes size={18} /> },
  { key: "deliver", label: "Deliver", subtitle: "Regulatory", color: PURPLE, icon: <ShieldCheck size={18} /> },
  { key: "defend", label: "Defend", subtitle: "Post-Market", color: EMERALD, icon: <Eye size={18} /> },
];

function PartDivider({ part, title, color = ACCENT, activePhase }: { part: string; title: string; color?: string; activePhase: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${color}), transparent 70%)` }} />

      {/* Lifecycle progress bar */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 flex items-center gap-0">
        {LIFECYCLE_PHASES.map((phase, i) => {
          const isActive = phase.key === activePhase;
          const isPast = LIFECYCLE_PHASES.findIndex(p => p.key === activePhase) > i;
          return (
            <div key={phase.key} className="flex items-center">
              {i > 0 && (
                <div className="w-[80px] h-[3px] rounded-full" style={{
                  background: isPast ? `hsl(0 0% 100% / 0.5)` : isActive ? `linear-gradient(90deg, hsl(0 0% 100% / 0.4), hsl(${phase.color} / 0.6))` : `hsl(0 0% 100% / 0.12)`
                }} />
              )}
              <div className="flex flex-col items-center gap-3 relative" style={{ width: 160 }}>
                <div className="flex items-center justify-center w-14 h-14 rounded-full border-[3px] transition-all"
                  style={{
                    borderColor: isActive ? `hsl(${phase.color})` : isPast ? `hsl(0 0% 100% / 0.4)` : `hsl(0 0% 100% / 0.15)`,
                    background: isActive ? `hsl(${phase.color} / 0.3)` : isPast ? `hsl(0 0% 100% / 0.06)` : `hsl(0 0% 100% / 0.04)`,
                    color: isActive ? `hsl(${phase.color})` : isPast ? `hsl(0 0% 100% / 0.5)` : `hsl(0 0% 100% / 0.18)`,
                    ...(isActive ? { boxShadow: `0 0 32px hsl(${phase.color} / 0.45), 0 0 60px hsl(${phase.color} / 0.15)` } : {}),
                  }}>
                  {isPast ? (
                    <span style={{ fontSize: 18, fontWeight: 700 }}>✓</span>
                  ) : (
                    <span style={{ fontSize: 20 }}>{phase.icon}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-extrabold tracking-wide" style={{
                    fontSize: isActive ? 18 : 15,
                    color: isActive ? `hsl(${phase.color})` : isPast ? `hsl(0 0% 100% / 0.5)` : `hsl(0 0% 100% / 0.22)`,
                    textShadow: isActive ? `0 0 20px hsl(${phase.color} / 0.4)` : 'none',
                  }}>
                    {phase.label}
                  </p>
                  {isActive && (
                    <p style={{ fontSize: 13, color: `hsl(${phase.color} / 0.85)`, fontWeight: 500, marginTop: 2 }}>{phase.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 text-center mt-12">
        <p className="font-extrabold tracking-[0.4em] uppercase mb-8"
          style={{ fontSize: 26, color: `hsl(${color})`, textShadow: `0 0 30px hsl(${color} / 0.4)` }}>{part}</p>
        <h2 className="font-black" style={{ fontSize: 88, color: "hsl(0 0% 100%)", lineHeight: 1.05, textShadow: '0 2px 40px hsl(0 0% 0% / 0.5)' }}>{title}</h2>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[5px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${color}), transparent)` }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — TITLE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01Title() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <GridBg />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-10 px-7 rounded-full border"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.1)`, height: 52 }}>
          <Pill size={22} style={{ color: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>
            Medicine Lifecycle Management
          </span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 90, lineHeight: 1.0, color: `hsl(${C})` }}>
          From Medical Need
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            to Medicine Released
          </span>
        </h1>

        <p style={{ fontSize: 28, color: `hsl(${MUT})`, maxWidth: 1050, lineHeight: 1.55 }}>
          Veeva manages your documents and your CRM.
          <br />LIZA manages the <strong style={{ color: `hsl(${C})` }}>judgment behind them</strong>.
        </p>

        <div className="mt-14 flex items-center gap-5">
          <div className="flex items-center gap-2 px-6 rounded-full"
            style={{ height: 48, background: `hsl(${ACCENT} / 0.08)`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
            <FlaskConical size={18} style={{ color: `hsl(${ACCENT})` }} />
            <span style={{ fontSize: 18, color: `hsl(${ACCENT})`, fontWeight: 600 }}>LIZA OS for Pharma & Biotech</span>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE CONSISTENCY CRISIS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02ConsistencyCrisis() {
  const failures = [
    { icon: <AlertTriangle size={28} />, stat: "€2.6B", label: "Average cost of bringing one drug to market", color: RED },
    { icon: <Clock size={28} />, stat: "10-15 yrs", label: "Average development timeline", color: GOLD },
    { icon: <Users size={28} />, stat: "90%", label: "Of drugs fail in clinical trials", color: PURPLE },
    { icon: <FileText size={28} />, stat: "1000s", label: "SOPs per organisation, inconsistently followed", color: ACCENT },
  ];
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] w-full">
        <Tag label="The Problem" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.05 }}>
          The Consistency Crisis
          <br /><span style={{ color: `hsl(${RED})` }}>in Life Sciences</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: `hsl(${MUT})`, maxWidth: 900, lineHeight: 1.55 }}>
          Your SOPs exist. Your people don't follow them consistently. In pharma, that inconsistency doesn't just cost revenue — it <strong style={{ color: `hsl(${C})` }}>costs lives and years</strong>.
        </p>

        <div className="grid grid-cols-4 gap-6">
          {failures.map(f => (
            <div key={f.label} className="rounded-2xl border p-7 text-center" style={{ borderColor: `hsl(${f.color} / 0.2)`, background: `hsl(${f.color} / 0.04)` }}>
              <div className="flex justify-center mb-4" style={{ color: `hsl(${f.color})` }}>{f.icon}</div>
              <p className="font-black mb-2" style={{ fontSize: 40, color: `hsl(${f.color})` }}>{f.stat}</p>
              <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{f.label}</p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — WHY AI CONFIDENTLY GETS IT WRONG
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03AIFails() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full">
        <div className="flex-1">
          <Tag label="The AI Trap" color={RED} />
          <h2 className="font-black mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Why AI Confidently
            <br /><span style={{ color: `hsl(${RED})` }}>Gets Pharma Wrong</span>
          </h2>
          <div className="space-y-5">
            <div className="rounded-xl p-6" style={{ background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${RED})` }}>The Hallucination Problem</p>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Generic AI generates plausible-sounding protocols that violate GxP requirements. In software, a hallucination is a bug. In pharma, it's a <strong style={{ color: `hsl(${C})` }}>regulatory catastrophe</strong>.
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: `hsl(${GOLD} / 0.05)`, border: `1px solid hsl(${GOLD} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>The Judgment Gap</p>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Your senior regulatory affairs director knows which formulation triggers a Type II variation vs. a line extension. No foundation model carries that judgment.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[500px] flex-shrink-0 rounded-2xl border p-8" style={{ background: `hsl(${ACCENT} / 0.04)`, borderColor: `hsl(${ACCENT} / 0.2)` }}>
          <p className="font-bold mb-6" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>What pharma needs isn't AI.</p>
          <p className="mb-6" style={{ fontSize: 22, color: `hsl(${C})`, fontWeight: 800, lineHeight: 1.3 }}>
            It's AI governed by the encoded judgment of your best scientists, clinicians, and regulatory experts.
          </p>
          <div className="space-y-4 mt-8">
            {["Standards Engineering, not prompt engineering", "Encoded SOPs, not static documents", "Auditable decisions, not black-box outputs"].map(t => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle2 size={20} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{t}</p>
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
// SLIDE 04 — THE ALM ANALOGY
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04ALMAnalogy() {
  const rows = [
    { alm: "Requirements", pharma: "Unmet Medical Need", liza: "Knowledge Extraction", icon: <Search size={20} /> },
    { alm: "Design & Architecture", pharma: "Target Validation", liza: "Expert Playbooks", icon: <Dna size={20} /> },
    { alm: "Development & Testing", pharma: "Pre-Clinical / Clinical", liza: "Protocol Execution", icon: <TestTubes size={20} /> },
    { alm: "Quality Assurance", pharma: "Phase I–III Trials", liza: "Gate Enforcement", icon: <ShieldCheck size={20} /> },
    { alm: "Release & Deployment", pharma: "Regulatory Submission", liza: "Context Bundles (Dossiers)", icon: <FileCheck size={20} /> },
    { alm: "Monitoring & Support", pharma: "Post-Market Surveillance", liza: "Nerve Center / Signals", icon: <Activity size={20} /> },
  ];
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Frame" />
        <h2 className="font-black mb-3" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Software has ALM.
          <br /><span style={{ color: `hsl(${ACCENT})` }}>Your Drug Lifecycle Deserves the Same.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: `hsl(${MUT})`, maxWidth: 900 }}>
          Application Lifecycle Management transformed software from chaos to engineering discipline. LIZA does the same for medicine development.
        </p>

        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `hsl(${ACCENT} / 0.2)` }}>
          <div className="grid grid-cols-4 gap-0" style={{ background: `hsl(${DARK})` }}>
            <div className="px-6 py-4"><p className="font-bold" style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.5)` }}>ALM Stage</p></div>
            <div className="px-6 py-4"><p className="font-bold" style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.5)` }}>Pharma Equivalent</p></div>
            <div className="px-6 py-4 col-span-2"><p className="font-bold" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>LIZA OS Capability</p></div>
          </div>
          {rows.map((r, i) => (
            <div key={r.alm} className="grid grid-cols-4 gap-0 border-t" style={{ borderColor: `hsl(${ACCENT} / 0.1)`, background: i % 2 === 0 ? BG : BG2 }}>
              <div className="px-6 py-4 flex items-center"><p style={{ fontSize: 18, color: `hsl(${MUT})` }}>{r.alm}</p></div>
              <div className="px-6 py-4 flex items-center"><p className="font-semibold" style={{ fontSize: 18, color: `hsl(${C})` }}>{r.pharma}</p></div>
              <div className="px-6 py-4 col-span-2 flex items-center gap-3">
                <span style={{ color: `hsl(${ACCENT})` }}>{r.icon}</span>
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>{r.liza}</p>
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
// SLIDE 05 — DIVIDER: DISCOVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05Divider() {
  return <PartDivider part="Phase 1 · Discover" title="Research & Target Validation" color={ACCENT} activePhase="discover" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — KNOWLEDGE EXTRACTION FOR DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06Discovery() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={ACCENT}>Discover</Chip>
          <h2 className="font-black mt-5 mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Encode Senior
            <br /><span style={{ color: `hsl(${ACCENT})` }}>Research Judgment</span>
          </h2>
          <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.55, maxWidth: 650 }}>
            Your principal scientists have decades of pattern recognition for viable targets. That judgment currently transfers through years of mentorship — or doesn't transfer at all.
          </p>
          <div className="space-y-4">
            {[
              { t: "Target Validation Playbooks", d: "Encode the criteria your best researchers use to evaluate therapeutic targets — mechanism plausibility, druggability signals, competitive landscape reads." },
              { t: "Literature Intelligence Protocols", d: "Structured extraction from publications, patents, and clinical databases — connected to your internal knowledge graph, not isolated in someone's head." },
              { t: "Go/No-Go Decision Frameworks", d: "Encode the judgment that determines which candidates progress — reproducibility standards, toxicology red flags, commercial viability thresholds." },
            ].map(({ t, d }) => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle2 size={20} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 19, color: `hsl(${C})` }}>{t}</p>
                  <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[480px] flex-shrink-0 space-y-5">
          <div className="rounded-2xl border p-7" style={{ background: `hsl(${ACCENT} / 0.04)`, borderColor: `hsl(${ACCENT} / 0.2)` }}>
            <p className="font-bold mb-3" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>The Knowledge Retention Crisis</p>
            <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              When your head of R&D retires, 30 years of <strong style={{ color: `hsl(${C})` }}>implicit target selection judgment</strong> walks out the door. LIZA encodes it before they leave.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
            <p className="font-bold mb-4" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>Impact</p>
            <div className="space-y-3">
              {[
                { v: "Weeks", l: "Not months to onboard new researchers" },
                { v: "100%", l: "Consistent target evaluation criteria" },
                { v: "Living", l: "Playbooks that update with every discovery" },
              ].map(s => (
                <div key={s.l} className="flex items-baseline gap-3">
                  <span className="font-black" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>{s.v}</span>
                  <span style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.7)` }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — DIVIDER: DEVELOP
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07Divider() {
  return <PartDivider part="Phase 2 · Develop" title="Clinical Development" color={GOLD} activePhase="develop" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — PROTOCOL EXECUTION FOR CLINICAL TRIALS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08ClinicalTrials() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={GOLD}>Develop</Chip>
          <h2 className="font-black mt-5 mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Clinical Trial Execution
            <br /><span style={{ color: `hsl(${GOLD})` }}>with Encoded Judgment</span>
          </h2>
          <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.55, maxWidth: 650 }}>
            Phase I–III trials are protocol-driven by definition. But the <em>judgment</em> behind protocol amendments, site selection, and safety signal interpretation varies wildly between teams.
          </p>

          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: <ClipboardList size={22} />, t: "Protocol Execution Engine", d: "Every CRA follows the same gate-enforced process. Deviations are flagged in real-time, not discovered in audit." },
              { icon: <Activity size={22} />, t: "Safety Signal Detection", d: "Encode senior medical monitor judgment for adverse event classification — consistency across every site." },
              { icon: <GitBranch size={22} />, t: "Amendment Playbooks", d: "When protocol amendments are needed, encode the decision framework: which changes require a substantial amendment vs. administrative notification." },
              { icon: <Users size={22} />, t: "Site Selection Intelligence", d: "Encode your best clinical ops lead's judgment for site feasibility — enrollment capacity, investigator track record, regulatory readiness." },
            ].map(({ icon, t, d }) => (
              <div key={t} className="rounded-xl p-5" style={{ background: BG2, border: `1px solid hsl(${GOLD} / 0.15)` }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${GOLD})` }}>
                  {icon}
                  <p className="font-bold" style={{ fontSize: 17, color: `hsl(${C})` }}>{t}</p>
                </div>
                <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>GxP Compliance, Built In</p>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.5 }}>
            Every decision, every gate passage, every deviation — captured with full provenance. Your regulatory dossier builds itself.
          </p>
          <div className="space-y-4">
            {[
              "Full audit trail per ICH E6(R3)",
              "Automated deviation detection",
              "21 CFR Part 11 ready architecture",
              "Real-time CAPA integration",
            ].map(t => (
              <div key={t} className="flex items-center gap-3">
                <ShieldCheck size={18} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
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
// SLIDE 09 — DIVIDER: DELIVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09Divider() {
  return <PartDivider part="Phase 3 · Deliver" title="Regulatory & Release" color={PURPLE} activePhase="deliver" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — REGULATORY SUBMISSION AS CONTEXT BUNDLES
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10Regulatory() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={PURPLE}>Deliver</Chip>
          <h2 className="font-black mt-5 mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Regulatory Dossiers
            <br /><span style={{ color: `hsl(${PURPLE})` }}>That Build Themselves</span>
          </h2>
          <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.55, maxWidth: 650 }}>
            Every decision made during discovery and development was captured with provenance. Your CTD modules aren't assembled from scratch — they're <strong style={{ color: `hsl(${C})` }}>compiled from governed execution data</strong>.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl p-6" style={{ background: `hsl(${PURPLE} / 0.05)`, border: `1px solid hsl(${PURPLE} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${PURPLE})` }}>Context Bundles = Regulatory Modules</p>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                LIZA's Context Bundles map directly to CTD structure. Module 2.5 (Clinical Overview) pulls from governed clinical execution data. Module 2.7 (Clinical Summary) aggregates gate-enforced trial outcomes. Every reference is traceable.
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: `hsl(${ACCENT} / 0.05)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>Variation & Lifecycle Management</p>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Encode your regulatory affairs team's judgment: which changes require Type IA, IB, or II variations. Which markets require country-specific dossier modifications. The playbook knows — every RA associate executes consistently.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 space-y-5">
          {[
            { label: "EMA / FDA / PMDA", desc: "Multi-market submission playbooks with jurisdiction-specific requirements encoded", color: PURPLE },
            { label: "eCTD Assembly", desc: "Structured output mapping from LIZA Bundles to eCTD modules — governed, versioned, auditable", color: ACCENT },
            { label: "Deficiency Response", desc: "When regulators ask questions, your response playbook is already encoded from prior submissions", color: TEAL },
          ].map(c => (
            <div key={c.label} className="rounded-xl border p-5" style={{ borderColor: `hsl(${c.color} / 0.25)`, background: `hsl(${c.color} / 0.04)` }}>
              <p className="font-bold mb-1" style={{ fontSize: 18, color: `hsl(${c.color})` }}>{c.label}</p>
              <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — DIVIDER: DEFEND
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11Divider() {
  return <PartDivider part="Phase 4 · Defend" title="Post-Market Vigilance" color={EMERALD} activePhase="defend" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — PHARMACOVIGILANCE & POST-MARKET
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12PostMarket() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={EMERALD}>Defend</Chip>
          <h2 className="font-black mt-5 mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Pharmacovigilance
            <br /><span style={{ color: `hsl(${EMERALD})` }}>as Living Intelligence</span>
          </h2>
          <p className="mb-8" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.55, maxWidth: 650 }}>
            Post-market surveillance isn't a reporting obligation — it's the feedback loop that makes your entire organisation smarter. Every signal, every PSUR, every risk-benefit reassessment feeds back into your knowledge graph.
          </p>

          <div className="grid grid-cols-2 gap-5">
            {[
              { t: "Signal Detection Protocols", d: "Encode your senior PV scientist's judgment for causality assessment — consistent CIOMS classification across every case." },
              { t: "PSUR/PBRER Playbooks", d: "Periodic safety reports built from governed data, not manual document archaeology." },
              { t: "Risk Management Plans", d: "EU-RMP updates driven by accumulated signal intelligence — every additional minimisation measure is traceable to data." },
              { t: "Feedback to Discovery", d: "Post-market insights flow back to R&D — adverse event patterns inform next-generation compound design." },
            ].map(({ t, d }) => (
              <div key={t} className="rounded-xl p-5" style={{ background: BG2, border: `1px solid hsl(${EMERALD} / 0.15)` }}>
                <p className="font-bold mb-2" style={{ fontSize: 17, color: `hsl(${C})` }}>{t}</p>
                <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${EMERALD})` }}>The Complete Loop</p>
          <div className="space-y-6">
            {LIFECYCLE_PHASES.map((p, i) => (
              <div key={p.key} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `hsl(${p.color} / 0.2)`, color: `hsl(${p.color})` }}>
                  {p.icon}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: 17, color: `hsl(${p.color})` }}>{p.label}</p>
                  <p style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.5)` }}>{p.subtitle}</p>
                </div>
                {i < LIFECYCLE_PHASES.length - 1 && (
                  <ArrowRight size={16} style={{ color: `hsl(0 0% 100% / 0.2)`, marginLeft: "auto" }} />
                )}
              </div>
            ))}
            <div className="rounded-lg p-3 mt-2" style={{ background: `hsl(${EMERALD} / 0.1)`, border: `1px solid hsl(${EMERALD} / 0.3)` }}>
              <p className="text-center font-semibold" style={{ fontSize: 14, color: `hsl(${EMERALD})` }}>
                Every phase feeds the next — and post-market feeds back to discovery
              </p>
            </div>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — CTA / NEXT STEPS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13CTA() {
  const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[900px] h-[900px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <Pill size={48} style={{ color: `hsl(${ACCENT})`, marginBottom: 24 }} />

        <h2 className="font-black mb-6" style={{ fontSize: 72, color: "hsl(0 0% 100%)", lineHeight: 1.05 }}>
          Ready to Engineer
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Your Drug Lifecycle?
          </span>
        </h2>

        <p className="mb-12" style={{ fontSize: 26, color: `hsl(0 0% 100% / 0.65)`, maxWidth: 800, lineHeight: 1.55 }}>
          Start with a <strong style={{ color: `hsl(0 0% 100% / 0.9)` }}>diagnostic assessment</strong> of your current lifecycle operations.
          <br />We'll map your consistency gaps and show you exactly where encoded judgment creates the highest ROI.
        </p>

        <div className="flex items-center gap-6">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 rounded-full font-bold transition-transform hover:scale-[1.03]"
            style={{ fontSize: 22, height: 64, background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, color: "hsl(0 0% 100%)" }}>
            Book a Diagnostic Call <ArrowRight size={22} />
          </a>
          <a href="/diagnostic" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 rounded-full font-bold border-2 transition-transform hover:scale-[1.03]"
            style={{ fontSize: 22, height: 64, borderColor: `hsl(0 0% 100% / 0.3)`, color: `hsl(0 0% 100% / 0.9)` }}>
            Take the Self-Diagnostic
          </a>
        </div>

        <div className="mt-16 flex items-center gap-8">
          {[
            { v: "GxP", l: "Compliance-ready architecture" },
            { v: "21 CFR", l: "Part 11 aligned" },
            { v: "ICH", l: "E6(R3) protocol execution" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <p className="font-black" style={{ fontSize: 32, color: `hsl(${ACCENT})` }}>{s.v}</p>
              <p style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.45)` }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDES ARRAY & SHELL
// ═══════════════════════════════════════════════════════════════════════════════

const SLIDES = [
  { id: "title", title: "Medicine Lifecycle Management", component: <Slide01Title /> },
  { id: "crisis", title: "The Consistency Crisis", component: <Slide02ConsistencyCrisis /> },
  { id: "ai-fails", title: "Why AI Gets Pharma Wrong", component: <Slide03AIFails /> },
  { id: "alm", title: "The ALM Analogy", component: <Slide04ALMAnalogy /> },
  { id: "div-discover", title: "Phase 1: Discover", component: <Slide05Divider /> },
  { id: "discovery", title: "Research & Target Validation", component: <Slide06Discovery /> },
  { id: "div-develop", title: "Phase 2: Develop", component: <Slide07Divider /> },
  { id: "clinical", title: "Clinical Trial Execution", component: <Slide08ClinicalTrials /> },
  { id: "div-deliver", title: "Phase 3: Deliver", component: <Slide09Divider /> },
  { id: "regulatory", title: "Regulatory Dossiers", component: <Slide10Regulatory /> },
  { id: "div-defend", title: "Phase 4: Defend", component: <Slide11Divider /> },
  { id: "post-market", title: "Pharmacovigilance", component: <Slide12PostMarket /> },
  { id: "cta", title: "Next Steps", component: <Slide13CTA /> },
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
      <div className="fixed inset-0 z-50"
        style={{ background: "#000" }}
        onClick={showMobileControls}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${ACCENT})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-MLM" slideCount={SLIDES.length} variant="mobile" iconColor={`hsl(${MUT})`} />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {SLIDES.map((slide, i) => (
            <button key={slide.id} onClick={() => goTo(i)}
              className={cn("rounded-xl overflow-hidden border transition-all hover:scale-[1.02]",
                i === current ? "ring-2" : "")}
              style={{ borderColor: CHROME_BORDER, ...(i === current ? { ringColor: `hsl(${ACCENT})` } : {}) }}>
              <div className="aspect-video"><ScaledSlide>{slide.component}</ScaledSlide></div>
              <div className="p-2 text-left" style={{ background: CHROME_BG }}>
                <p className="text-[10px] font-mono" style={{ color: `hsl(${MUT})` }}>{i + 1}. {slide.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Default editor layout ──
  const slide = SLIDES[current];

  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-4 h-12 border-b flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>Medicine Lifecycle Management</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")} style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-MLM" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
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
                className={cn("w-full rounded-lg overflow-hidden border-2 transition-all text-left shrink-0 flex flex-col",
                  i === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"
                )}>
                <div className="w-full" style={{ aspectRatio: "16/9", pointerEvents: "none" }}>
                  <ScaledSlide>{s.component}</ScaledSlide>
                </div>
                <p className="text-[10px] px-1.5 py-1" style={{ color: `hsl(${MUT})` }}>
                  {i + 1}. {s.title}
                </p>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 overflow-hidden">
          <div className="w-full max-w-6xl" style={{ aspectRatio: "16/9" }}>
            <ScaledSlide>{slide.component}</ScaledSlide>
          </div>

          <div className="flex items-center gap-4 px-5 py-2 rounded-full border"
            style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
            <Button variant="ghost" size="icon" onClick={prev} disabled={current === 0} className="h-8 w-8">
              <ChevronLeft size={16} />
            </Button>
            <span className="font-mono text-xs min-w-[50px] text-center" style={{ color: `hsl(${MUT})` }}>
              {current + 1} / {SLIDES.length}
            </span>
            <Button variant="ghost" size="icon" onClick={next} disabled={current === SLIDES.length - 1} className="h-8 w-8">
              <ChevronRight size={16} />
            </Button>
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

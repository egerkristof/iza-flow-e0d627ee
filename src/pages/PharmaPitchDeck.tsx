import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  ArrowRight, CheckCircle2, AlertTriangle, Clock, Users,
  Shield, Pill, FileCheck, Activity, ShieldCheck, Sparkles,
  CircleDot, Crosshair, Map, Trophy, Wrench, Package,
  ClipboardCheck, FileSpreadsheet, Search, RefreshCw, Zap, Brain, Target,
  FileSearch, Layers, Building2, Lock, Key, Database, Eye, GitBranch,
  BarChart3, Server, Workflow, BookOpen, Monitor, Radio, Gauge,
  Microscope, FlaskConical, Truck, Factory, HeartPulse, Globe, Cable
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

// ─── Act indicator ────────────────────────────────────────────────────────────

const ACTS = [
  { num: 1, label: "The GxP Challenge", color: ACCENT },
  { num: 2, label: "The Audit Engine", color: GOLD },
  { num: 3, label: "Operating Model", color: CORAL },
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
// TITLE SLIDE - LIZA as the GxP Operating System
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

          <h1 className="font-black mb-6" style={{ fontSize: 64, color: "hsl(0 0% 100%)", lineHeight: 1.0 }}>
            The Operating System
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              for Medicine Lifecycle
            </span>
            <br /><span style={{ fontSize: 52, color: "hsl(0 0% 100% / 0.7)" }}>Management</span>
          </h1>

          <p className="mb-10" style={{ fontSize: 22, color: `hsl(0 0% 100% / 0.6)`, lineHeight: 1.55, maxWidth: 750 }}>
            From research to release, encode the judgment that makes
            <br />good practice <em>actually</em> practiced. Across every team, site, and function.
          </p>

          <div className="flex gap-6">
            {ACTS.map(act => (
              <div key={act.num} className="flex items-center gap-3 rounded-xl px-5 py-3"
                style={{ background: `hsl(${act.color} / 0.1)`, border: `1px solid hsl(${act.color} / 0.25)` }}>
                <span className="font-black" style={{ fontSize: 28, color: `hsl(${act.color})` }}>{act.num}</span>
                <div>
                  <p className="font-bold" style={{ fontSize: 16, color: `hsl(${act.color})` }}>{act.label}</p>
                  <p style={{ fontSize: 12, color: `hsl(0 0% 100% / 0.4)` }}>
                    {act.num === 1 ? "The problem & our platform response" : act.num === 2 ? "Audit as the first proof point" : "From audit to lifecycle operating model"}
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
// ACT 1 - THE GxP CHALLENGE (Problem + Platform Response)
// ═══════════════════════════════════════════════════════════════════════════════

function Act1_LifecycleChallenge() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="THE MEDICINE LIFECYCLE" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-5" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
            From research to release:
            <br /><span style={{ color: `hsl(${RED})` }}>one lifecycle, a thousand
            <br />points of judgment.</span>
          </h2>

          <p className="mb-6" style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            Every stage of the medicine lifecycle, from discovery through manufacturing to post-market surveillance, depends on <strong style={{ color: `hsl(${C})` }}>expert judgment executed consistently</strong> across teams, sites, and regulatory jurisdictions. Today, that judgment lives in people's heads.
          </p>

          <div className="flex items-center gap-1 mb-6">
            {[
              { icon: <Microscope size={18} />, label: "Discovery", color: ACCENT },
              { icon: <FlaskConical size={18} />, label: "Development", color: TEAL },
              { icon: <FileCheck size={18} />, label: "Clinical Trials", color: GOLD },
              { icon: <Shield size={18} />, label: "Regulatory", color: CORAL },
              { icon: <Factory size={18} />, label: "Manufacturing", color: RED },
              { icon: <Truck size={18} />, label: "Supply Chain", color: ACCENT },
              { icon: <HeartPulse size={18} />, label: "Pharmacovigilance", color: TEAL },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center">
                <div className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg"
                  style={{ background: `hsl(${s.color} / 0.06)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                  <span style={{ color: `hsl(${s.color})` }}>{s.icon}</span>
                  <span className="font-semibold" style={{ fontSize: 11, color: `hsl(${s.color})` }}>{s.label}</span>
                </div>
                {i < 6 && <ArrowRight size={14} style={{ color: `hsl(${MUT} / 0.3)`, flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "EUR 2.6B", l: "Average cost to bring one drug to market", src: "Deloitte Centre for Regulatory Strategy, 2023" },
              { v: "~90%", l: "Of clinical candidates fail before approval", src: "FDA Clinical Trial Analysis, 2022" },
              { v: "40%+", l: "Senior expertise projected to turn over by 2030", src: "BLS workforce aging projections" },
              { v: "3x", l: "Faster AI output, but inconsistency scales faster too", src: "Industry observation" },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-5 py-3.5" style={{ background: BG2, border: `1px solid hsl(${ACCENT} / 0.12)` }}>
                <p className="font-black" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>{s.v}</p>
                <p className="font-semibold mb-0.5" style={{ fontSize: 13, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 11, color: `hsl(${MUT})`, fontStyle: "italic" }}>{s.src}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[360px] flex-shrink-0 rounded-2xl p-6" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-4" style={{ fontSize: 18, color: "hsl(0 0% 100%)" }}>GxP: "Good Practice" standards</p>
          <p className="mb-5" style={{ fontSize: 15, color: `hsl(0 0% 100% / 0.65)`, lineHeight: 1.5 }}>
            GMP, GCP, GLP, GDP, GVP: each governs a lifecycle stage. Each demands consistent execution of documented procedures. Each is ultimately a <strong style={{ color: `hsl(${ACCENT})` }}>judgment management problem</strong>.
          </p>
          <div className="space-y-2.5">
            {[
              { code: "GMP", full: "Good Manufacturing Practice" },
              { code: "GCP", full: "Good Clinical Practice" },
              { code: "GLP", full: "Good Laboratory Practice" },
              { code: "GDP", full: "Good Distribution Practice" },
              { code: "GVP", full: "Good Pharmacovigilance Practice" },
            ].map(g => (
              <div key={g.code} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ background: `hsl(${ACCENT} / 0.08)` }}>
                <span className="font-black" style={{ fontSize: 14, color: `hsl(${ACCENT})`, width: 38 }}>{g.code}</span>
                <span style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.7)` }}>{g.full}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act1_StandardsGap() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="THE STANDARDS GAP" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Everyone has SOPs.
            <br /><span style={{ color: `hsl(${RED})` }}>Nobody has consistency.</span>
          </h2>

          <p className="mb-6" style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            Pharma companies invest heavily in documenting processes. But documents describe <em>what</em> to do, not <em>how</em> to think. The gap between the SOP and the decision is where <strong style={{ color: `hsl(${C})` }}>quality failures, audit findings, and inconsistency</strong> live.
          </p>

          <p className="mb-8" style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700, fontStyle: "italic" }}>
            Audits fail not for lack of documents, but for lack of decision-evidence linkage.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: "Document", desc: "SOPs, policies, guidelines exist everywhere. Read-and-understood signatures prove nothing about execution quality.", color: RED, icon: <BookOpen size={20} /> },
              { title: "Judgment Gap", desc: "How your best QA lead interprets an ambiguous deviation vs. a junior analyst. That is what determines outcomes.", color: GOLD, icon: <Brain size={20} /> },
              { title: "Inconsistency", desc: "Same process, 8 sites, 8 different outcomes. The variation isn't in the document. It is in the interpretation.", color: RED, icon: <BarChart3 size={20} /> },
            ].map(b => (
              <div key={b.title} className="rounded-xl p-5" style={{ background: `hsl(${b.color} / 0.04)`, border: `1px solid hsl(${b.color} / 0.15)` }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${b.color})` }}>
                  {b.icon}
                  <h3 className="font-bold" style={{ fontSize: 18, color: `hsl(${C})` }}>{b.title}</h3>
                </div>
                <p style={{ fontSize: 14, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[360px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: "hsl(0 0% 100%)" }}>What we keep hearing</p>
          <div className="space-y-5">
            {[
              { q: "Our SOPs are world-class. Our execution isn't.", who: "VP Quality, Top-20 Pharma" },
              { q: "We have the same process in 8 sites. We get 8 different outcomes.", who: "Head of Clinical Ops" },
              { q: "When our best people leave, years of judgment walk out the door.", who: "Chief Scientific Officer" },
            ].map(item => (
              <div key={item.q} className="border-l-2 pl-4" style={{ borderColor: `hsl(${ACCENT} / 0.5)` }}>
                <p className="italic mb-1" style={{ fontSize: 15, color: `hsl(0 0% 100% / 0.85)`, lineHeight: 1.45 }}>"{item.q}"</p>
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
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Three forces making this
            <br /><span style={{ color: `hsl(${RED})` }}>unsolvable with current tools</span>
          </h2>

          <div className="space-y-5">
            <div className="rounded-xl p-5" style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={20} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${RED})` }}>The AI Acceleration Trap</p>
              </div>
              <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Teams adopting AI tools generate outputs <em>faster</em>, but without encoded judgment, they produce <strong style={{ color: `hsl(${C})` }}>inconsistent work at higher speed</strong>. Without gate enforcement, AI in pharma is a regulatory event waiting to happen.
              </p>
            </div>

            <div className="rounded-xl p-5" style={{ background: `hsl(${GOLD} / 0.04)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>The Expertise Cliff</p>
              </div>
              <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Senior pharma expertise is projected to see <strong style={{ color: `hsl(${C})` }}>significant turnover by 2030</strong>. When they leave, decades of judgment leave with them, and none of it is in the SOPs. The window to encode that judgment is closing.
              </p>
            </div>

            <div className="rounded-xl p-5" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} style={{ color: `hsl(${ACCENT})` }} />
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>The Continuous Readiness Shift</p>
              </div>
              <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Emerging expectations under ICH E6(R3), EU GMP Annex 11, and FDA's evolving AI guidance are pushing from point-in-time audits to <strong style={{ color: `hsl(${C})` }}>continuous, evidence-led inspection readiness</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>The undeniable shift</p>
          <p className="mb-5" style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.55 }}>
            Regulators and customers are moving from point-in-time audits to continuous, evidence-led inspection readiness. Headcount and experience are shrinking. Document sprawl is exploding.
          </p>
          <div className="rounded-lg p-4" style={{ background: `hsl(${RED} / 0.15)`, border: `1px solid hsl(${RED} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 14, color: `hsl(${RED})` }}>
              The question isn't whether to encode judgment. It's whether you do it before or after the next inspection finding.
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
      label: "Option A", title: "More Documentation", verdict: "Increases divergence risk", color: RED,
      points: [
        "More SOPs = more places for inconsistent interpretation",
        "Documents describe what to do, not how to think",
        "'Read and understood' signatures prove nothing about execution quality",
      ],
    },
    {
      label: "Option B", title: "Generic AI Tools", verdict: "Lacks governance & traceability", color: RED,
      points: [
        "ChatGPT and copilots have no concept of 'correct' in your context",
        "No audit trail, no versioning, no gate enforcement",
        "Hallucination risk in regulated decisions is unacceptable",
      ],
    },
    {
      label: "Option C", title: "GRC / QMS Platforms", verdict: "Manages records, not judgment", color: GOLD,
      points: [
        "Track what happened. Does not guide what should happen",
        "Excellent at compliance documentation, weak at decision support",
        "No mechanism to encode expert reasoning into execution",
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="WHY CURRENT APPROACHES FAIL" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-3" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Three approaches. <span style={{ color: `hsl(${RED})` }}>None sufficient.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 20, color: `hsl(${MUT})`, maxWidth: 900 }}>
          The industry has tried documentation, AI tools, and compliance platforms. None solves the fundamental problem: encoding how your best people think into how your whole organisation executes.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {options.map(opt => (
            <div key={opt.label} className="rounded-2xl border p-6" style={{ borderColor: `hsl(${opt.color} / 0.2)`, background: `hsl(${opt.color} / 0.03)` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold rounded-full px-3 py-1" style={{ fontSize: 12, background: `hsl(${opt.color} / 0.1)`, color: `hsl(${opt.color})` }}>{opt.label}</span>
                <X size={16} style={{ color: `hsl(${opt.color})` }} />
              </div>
              <h3 className="font-black mb-2" style={{ fontSize: 22, color: `hsl(${C})` }}>{opt.title}</h3>
              <p className="font-semibold mb-4" style={{ fontSize: 14, color: `hsl(${opt.color})` }}>{opt.verdict}</p>
              <div className="space-y-3">
                {opt.points.map(p => (
                  <div key={p} className="flex items-start gap-2">
                    <AlertTriangle size={13} style={{ color: `hsl(${opt.color})`, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 14, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-xl px-6 py-3 self-center"
          style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
          <Sparkles size={16} style={{ color: `hsl(${ACCENT})` }} />
          <p className="font-semibold" style={{ fontSize: 17, color: `hsl(${ACCENT})` }}>
            What's needed: a system that encodes judgment, enforces it at execution, and learns from exceptions.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act1_Architecture() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="THE GxP OPERATING SYSTEM" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-2" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
          LIZA: The <span style={{ color: `hsl(${ACCENT})` }}>System of Reasoning</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 19, color: `hsl(${MUT})`, maxWidth: 900, lineHeight: 1.55 }}>
          Software development has ALM (Application Lifecycle Management) to govern how code moves from design to production. LIZA does the same for the medicine lifecycle: it turns expert judgment into governed, repeatable workflows that every team can execute consistently.
        </p>

        {/* Architecture flow */}
        <div className="grid grid-cols-4 gap-5 mb-5">
          {[
            { step: "Capture", desc: "Record how your senior QA leads, regulatory experts, and process owners actually make decisions. Turn tribal knowledge into documented, reusable decision logic.", color: ACCENT, icon: <Search size={20} /> },
            { step: "Organise", desc: "Group related procedures, quality standards, reference documents, and decision criteria into governed sets. Version-controlled, role-scoped, and audit-ready.", color: TEAL, icon: <Layers size={20} /> },
            { step: "Execute", desc: "Run step-by-step workflows with built-in quality gates. AI prepares drafts and evidence; qualified staff review and approve. Full traceability on every action.", color: GOLD, icon: <Zap size={20} /> },
            { step: "Learn", desc: "Each completed workflow feeds back into the system. Evidence gaps, process exceptions, and successful patterns update the knowledge base automatically.", color: CORAL, icon: <Brain size={20} /> },
          ].map((p, i) => (
            <div key={p.step} className="rounded-2xl border p-5 flex flex-col relative" style={{ borderColor: `hsl(${p.color} / 0.2)`, background: `hsl(${p.color} / 0.03)` }}>
              {i < 3 && (
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-10" style={{ color: `hsl(${MUT} / 0.3)` }}>
                  <ArrowRight size={18} />
                </div>
              )}
              <div className="rounded-full px-3 py-1 mb-3 self-start" style={{ background: `hsl(${p.color} / 0.1)`, border: `1px solid hsl(${p.color} / 0.25)` }}>
                <span className="font-bold" style={{ fontSize: 12, color: `hsl(${p.color})` }}>Step {i + 1}</span>
              </div>
              <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${p.color})` }}>
                {p.icon}
                <h3 className="font-black" style={{ fontSize: 22, color: `hsl(${C})` }}>{p.step}</h3>
              </div>
              <p style={{ fontSize: 14, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* What a governed set contains */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl px-5 py-3" style={{ background: `hsl(${DARK})` }}>
            <p className="font-bold mb-1.5" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>What a governed set contains</p>
            <div className="flex gap-2">
              {["Process workflows", "Quality standards", "Decision criteria", "Reference documents", "Training materials"].map(t => (
                <span key={t} className="rounded-full px-3 py-1 font-semibold" style={{ fontSize: 11, background: `hsl(${ACCENT} / 0.15)`, color: `hsl(${ACCENT})` }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl px-5 py-3 flex-1" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>
              Human-in-the-loop always: AI prepares, qualified personnel review and approve. Full audit trail with e-signature.
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act1_TrustCompliance() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="TRUST & COMPLIANCE BY DESIGN" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-3" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Built for trust. <span style={{ color: `hsl(${TEAL})` }}>Designed for qualification.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 19, color: `hsl(${MUT})`, maxWidth: 900, lineHeight: 1.55 }}>
          LIZA is architected from the ground up in line with modern data protection and security standards. Our design thinking anticipates the specific compliance requirements of regulated industries, with a clear path to formal qualification.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-5">
          {/* Foundation: What we have */}
          <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.03)` }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={20} style={{ color: `hsl(${TEAL})` }} />
              <h3 className="font-black" style={{ fontSize: 18, color: `hsl(${C})` }}>Platform Security</h3>
            </div>
            <p className="font-semibold mb-3" style={{ fontSize: 12, color: `hsl(${TEAL})` }}>DESIGNED & IN PROGRESS</p>
            <div className="space-y-2.5">
              {[
                "SOC 2 Type II aligned security posture",
                "Encryption at rest and in transit (AES-256/TLS 1.3)",
                "SSO / SAML authentication",
                "Role-based access control (RBAC)",
                "EU data residency available",
                "Immutable audit trails with timestamps",
              ].map(p => (
                <div key={p} className="flex items-start gap-2">
                  <CheckCircle2 size={13} style={{ color: `hsl(${TEAL})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 13, color: `hsl(${MUT})`, lineHeight: 1.35 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pharma-specific: Our roadmap */}
          <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.03)` }}>
            <div className="flex items-center gap-2 mb-3">
              <Lock size={20} style={{ color: `hsl(${ACCENT})` }} />
              <h3 className="font-black" style={{ fontSize: 18, color: `hsl(${C})` }}>GxP Qualification Path</h3>
            </div>
            <p className="font-semibold mb-3" style={{ fontSize: 12, color: `hsl(${ACCENT})` }}>ARCHITECTED FOR</p>
            <div className="space-y-2.5">
              {[
                "GAMP 5 (2nd ed) risk-based approach",
                "Computer Software Assurance (CSA) aligned validation",
                "21 CFR Part 11 / EU Annex 11 electronic records",
                "Electronic signatures with identity verification",
                "Change control workflow with approvals",
                "IQ/OQ/PQ traceability matrix template",
              ].map(p => (
                <div key={p} className="flex items-start gap-2">
                  <CircleDot size={13} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 13, color: `hsl(${MUT})`, lineHeight: 1.35 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Governance */}
          <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.03)` }}>
            <div className="flex items-center gap-2 mb-3">
              <Key size={20} style={{ color: `hsl(${GOLD})` }} />
              <h3 className="font-black" style={{ fontSize: 18, color: `hsl(${C})` }}>AI Governance</h3>
            </div>
            <p className="font-semibold mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>BUILT IN</p>
            <div className="space-y-2.5">
              {[
                "AI proposes, human decides, always",
                "ALCOA+ data integrity principles embedded",
                "AI model versioning and change control",
                "Training data provenance and explainability",
                "Confidence scoring on every AI output",
                "Intended use documentation for validation",
              ].map(p => (
                <div key={p} className="flex items-start gap-2">
                  <CheckCircle2 size={13} style={{ color: `hsl(${GOLD})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 13, color: `hsl(${MUT})`, lineHeight: 1.35 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl px-6 py-3" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${C})`, lineHeight: 1.5 }}>
            <span style={{ color: `hsl(${TEAL})` }}>Our approach:</span> Build with compliance DNA from day one. The architecture decisions that matter most (immutable trails, role enforcement, versioned outputs) are foundation, not afterthought. Formal GxP qualification is a structured path on existing architecture, not a rebuild.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act1_Integrations() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={1} slideLabel="INTEGRATION ARCHITECTURE" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-4" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Connects to your stack.
            <br /><span style={{ color: `hsl(${ACCENT})` }}>No migration.</span>
          </h2>
          <p className="mb-6" style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 650 }}>
            LIZA integrates through the <strong style={{ color: `hsl(${C})` }}>Model Context Protocol (MCP)</strong>, an open standard for tool connectivity. Today we connect to a broad range of enterprise tools. Pharma-specific system connectors are on our near-term roadmap.
          </p>

          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* What we have now */}
            <div className="rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.04)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>Connected today via MCP</p>
              <div className="space-y-2">
                {[
                  "Document stores (SharePoint, Box, Google Drive)",
                  "Collaboration (Teams, Slack, Zoom)",
                  "Data sources (Excel, CSV, PDF, Word)",
                  "Enterprise platforms (ServiceNow, Jira)",
                  "Version control and CI/CD tools",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={14} style={{ color: `hsl(${TEAL})` }} />
                    <span style={{ fontSize: 14, color: `hsl(${MUT})` }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pharma roadmap */}
            <div className="rounded-xl p-5" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>Pharma connectors on roadmap</p>
              <div className="space-y-2">
                {[
                  "Veeva Vault (QMS, RIM, eTMF)",
                  "TrackWise / Pilgrim (CAPA, deviations)",
                  "SAP QM / EHS",
                  "MasterControl (document control)",
                  "LMS platforms (Cornerstone, etc.)",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CircleDot size={14} style={{ color: `hsl(${ACCENT})` }} />
                    <span style={{ fontSize: 14, color: `hsl(${MUT})` }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl px-5 py-3" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.15)` }}>
            <div className="flex items-center gap-2 mb-1">
              <Cable size={16} style={{ color: `hsl(${ACCENT})` }} />
              <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>Model Context Protocol (MCP)</p>
            </div>
            <p style={{ fontSize: 14, color: `hsl(${MUT})`, lineHeight: 1.45 }}>
              MCP is an open standard for connecting AI systems to tools and data sources. It means we can add new connectors rapidly without custom integration work, including pharma-specific systems as demand crystallises.
            </p>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>Data flow principles</p>
          <div className="space-y-4">
            {[
              { icon: <Database size={16} />, title: "Read", desc: "Controlled copies, versioned SOPs, audit checklists" },
              { icon: <FileCheck size={16} />, title: "Produce", desc: "Governed outputs: draft answers, evidence maps, readiness scores" },
              { icon: <Eye size={16} />, title: "Trace", desc: "Every output links back to source document, page, and version" },
              { icon: <Lock size={16} />, title: "Snapshot", desc: "Immutable evidence snapshots with timestamps for audit trail" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <span style={{ color: `hsl(${ACCENT})`, marginTop: 2 }}>{item.icon}</span>
                <div>
                  <p className="font-bold" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>{item.title}</p>
                  <p style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.65)`, lineHeight: 1.35 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg p-3" style={{ background: `hsl(${ACCENT} / 0.15)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>
              LIZA augments your QMS. It does not replace it
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 2 - THE AUDIT ENGINE (Specific proof point)
// ═══════════════════════════════════════════════════════════════════════════════

function Act2_AuditCrisis() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={2} slideLabel="THE AUDIT CRISIS" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-16 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-6" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Audit: the quality edge
            <br /><span style={{ color: `hsl(${GOLD})` }}>that's still manual.</span>
          </h2>

          <p className="mb-6" style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 700 }}>
            In every regulated industry (pharma, security, finance), audits are the mechanism that protects quality at the edges of the operation. And in every industry, they follow the same pattern: <strong style={{ color: `hsl(${C})` }}>search, read, draft, format, repeat</strong>. Hundreds of times per audit.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "18 days", l: "Average time to complete a complex audit manually", src: "Subcontractor baseline, ~800-question audits" },
              { v: "500-3,800", l: "Questions per GxP or vendor qualification audit", src: "Audit firm operational data" },
              { v: "40%", l: "Of auditor time spent on document search & evidence matching", src: "Deloitte Centre for Regulatory Strategy, 2023" },
              { v: "84%", l: "First-pass accuracy with LIZA vs ~40% with generic AI", src: "LIZA pilot data, N=3 audits, ~800 Qs each" },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-5 py-4" style={{ background: BG2, border: `1px solid hsl(${GOLD} / 0.12)` }}>
                <p className="font-black" style={{ fontSize: 30, color: `hsl(${GOLD})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 14, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 11, color: `hsl(${MUT})`, fontStyle: "italic" }}>{s.src}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-5" style={{ fontSize: 20, color: "hsl(0 0% 100%)" }}>Cost of inaction</p>
          <div className="space-y-4 mb-6">
            {[
              { v: "12-18", l: "Person-days per complex audit", color: RED },
              { v: "$15-40K", l: "Fully loaded cost per audit cycle", color: GOLD },
              { v: "3-6 mo", l: "Typical vendor qualification backlog", color: RED },
            ].map(s => (
              <div key={s.l} className="flex items-baseline gap-3 rounded-lg px-4 py-3"
                style={{ background: `hsl(${s.color} / 0.1)`, border: `1px solid hsl(${s.color} / 0.2)` }}>
                <span className="font-black" style={{ fontSize: 24, color: `hsl(${s.color})`, flexShrink: 0 }}>{s.v}</span>
                <span style={{ fontSize: 14, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.3 }}>{s.l}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3" style={{ background: `hsl(${GOLD} / 0.15)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
              This is where LIZA's architecture proves itself first, then extends across the lifecycle.
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act2_DualCapability() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={2} slideLabel="TWO CAPABILITIES, ONE ENGINE" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-3" style={{ fontSize: 50, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Two capabilities. <span style={{ color: `hsl(${GOLD})` }}>One engine.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 20, color: `hsl(${MUT})`, maxWidth: 900 }}>
          LIZA does not just run audits faster. It keeps you inspection-ready every day. Both capabilities share the same knowledge graph and compound over time.
        </p>

        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* PREPARE */}
          <div className="rounded-2xl border p-7" style={{ borderColor: `hsl(${ACCENT} / 0.3)`, background: `hsl(${ACCENT} / 0.03)` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `hsl(${ACCENT} / 0.12)` }}>
                <Shield size={24} style={{ color: `hsl(${ACCENT})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 24, color: `hsl(${ACCENT})` }}>Prepare</p>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${MUT})` }}>Continuous Audit Readiness</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {[
                "Connect to knowledge graph and score current state vs audit scope",
                "Identify gaps: missing evidence, obsolete documents, weak coverage",
                "Confidence scoring by clause and requirement area",
                "Continuous monitoring: readiness score updates as evidence changes",
              ].map(p => (
                <div key={p} className="flex items-start gap-2">
                  <CheckCircle2 size={15} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{p}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${ACCENT} / 0.08)` }}>
                <p className="font-bold" style={{ fontSize: 12, color: `hsl(${ACCENT})` }}>Owner</p>
                <p style={{ fontSize: 13, color: `hsl(${MUT})` }}>QA / Quality Lead</p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${ACCENT} / 0.08)` }}>
                <p className="font-bold" style={{ fontSize: 12, color: `hsl(${ACCENT})` }}>KPI</p>
                <p style={{ fontSize: 13, color: `hsl(${MUT})` }}>Readiness score %</p>
              </div>
            </div>
          </div>

          {/* RUN */}
          <div className="rounded-2xl border p-7" style={{ borderColor: `hsl(${GOLD} / 0.3)`, background: `hsl(${GOLD} / 0.03)` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `hsl(${GOLD} / 0.12)` }}>
                <Zap size={24} style={{ color: `hsl(${GOLD})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 24, color: `hsl(${GOLD})` }}>Run</p>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${MUT})` }}>Audit Execution Engine</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {[
                "Ingest audit question sets (Excel) and client documentation",
                "Auto-match evidence, draft structured answers with citations",
                "Confidence scoring flags where human review matters most",
                "Full traceability: every answer links to source documentation",
              ].map(p => (
                <div key={p} className="flex items-start gap-2">
                  <CheckCircle2 size={15} style={{ color: `hsl(${GOLD})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{p}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${GOLD} / 0.08)` }}>
                <p className="font-bold" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>Owner</p>
                <p style={{ fontSize: 13, color: `hsl(${MUT})` }}>Audit Team / GMP Auditor</p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${GOLD} / 0.08)` }}>
                <p className="font-bold" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>KPI</p>
                <p style={{ fontSize: 13, color: `hsl(${MUT})` }}>Time / Accuracy / Throughput</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-6 py-3 self-center"
          style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <Lock size={16} style={{ color: `hsl(${TEAL})` }} />
          <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
            Human-in-the-loop: AI drafts, qualified personnel review and approve with e-signature
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act2_HowItWorks() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={2} slideLabel="HOW THE ENGINE WORKS" />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px] pt-[90px]">
        <h2 className="font-black mb-3" style={{ fontSize: 50, color: `hsl(${C})`, lineHeight: 1.05 }}>
          The LIZA <span style={{ color: `hsl(${GOLD})` }}>Audit Engine</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 20, color: `hsl(${MUT})`, maxWidth: 900 }}>
          The same Extract → Structure → Execute → Remember architecture, applied specifically to audit. Not a chatbot. Not a GRC suite. An execution engine with institutional memory.
        </p>

        <div className="grid grid-cols-4 gap-5 mb-6">
          {[
            { step: "1", title: "Ingest", desc: "Upload audit question set (Excel) and client documentation. Engine indexes, maps, and cross-references automatically.", color: ACCENT, icon: <FileSearch size={20} /> },
            { step: "2", title: "Execute", desc: "Processes every question: searches evidence, matches documentation, drafts structured answers with citations and confidence scores.", color: GOLD, icon: <Zap size={20} /> },
            { step: "3", title: "Validate", desc: "QA pass flags low-confidence answers and missing evidence. Auditors review and sign off, not re-do. Immutable evidence snapshots.", color: TEAL, icon: <ShieldCheck size={20} /> },
            { step: "4", title: "Compound", desc: "Evidence gaps become Directives in the knowledge graph. Future audits leverage past patterns. Readiness score improves continuously.", color: CORAL, icon: <Brain size={20} /> },
          ].map((p, i) => (
            <div key={p.title} className="rounded-2xl border p-5 flex flex-col relative" style={{ borderColor: `hsl(${p.color} / 0.2)`, background: `hsl(${p.color} / 0.03)` }}>
              {i < 3 && (
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-10" style={{ color: `hsl(${MUT} / 0.3)` }}>
                  <ArrowRight size={18} />
                </div>
              )}
              <div className="rounded-full px-3 py-1 mb-3 self-start" style={{ background: `hsl(${p.color} / 0.1)`, border: `1px solid hsl(${p.color} / 0.25)` }}>
                <span className="font-bold" style={{ fontSize: 12, color: `hsl(${p.color})` }}>Step {p.step}</span>
              </div>
              <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${p.color})` }}>
                {p.icon}
                <h3 className="font-black" style={{ fontSize: 22, color: `hsl(${C})` }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: 14, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {[
            { icon: <FileSpreadsheet size={16} />, t: "Works with your existing Excel workflow" },
            { icon: <Shield size={16} />, t: "GxP-compliant audit trail" },
            { icon: <CheckCircle2 size={16} />, t: "No platform migration required" },
            { icon: <Database size={16} />, t: "Versioned SOPs and controlled documents" },
          ].map(b => (
            <div key={b.t} className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.15)` }}>
              <span style={{ color: `hsl(${GOLD})` }}>{b.icon}</span>
              <span className="font-semibold" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>{b.t}</span>
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
          <h2 className="font-black mb-6" style={{ fontSize: 50, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Proven on <span style={{ color: `hsl(${TEAL})` }}>real audits.</span>
            <br />Measured results.
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {[
              { v: "18 → 1.5", l: "Days reduced to hours for first-pass generation", color: TEAL, sub: "N=3 cybersecurity audits, ~800 questions each. Baseline: senior subcontractor working alone." },
              { v: "84%", l: "First-pass accuracy, vs ~40% with generic AI", color: TEAL, sub: "Measured by qualified reviewer accept rate. 16% required revision (0% critical errors, 16% minor edits)." },
              { v: "10x", l: "Throughput increase per senior auditor", color: GOLD, sub: "One senior can supervise multiple parallel audits simultaneously." },
              { v: "62→89%", l: "Readiness score improvement over 6 weeks", color: GOLD, sub: "Continuous gap detection identifies evidence decay before it becomes an inspection risk." },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-5" style={{ background: `hsl(${s.color} / 0.04)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                <p className="font-black mb-1" style={{ fontSize: 38, color: `hsl(${s.color})` }}>{s.v}</p>
                <p className="font-semibold mb-1" style={{ fontSize: 16, color: `hsl(${C})` }}>{s.l}</p>
                <p style={{ fontSize: 13, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 17, color: `hsl(${C})`, fontWeight: 600, lineHeight: 1.5 }}>
              <span style={{ color: `hsl(${TEAL})` }}>AI drafts. Qualified personnel decide.</span> Every response cites source documentation and page references. Immutable evidence snapshots with timestamps.
            </p>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 rounded-2xl p-6" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-4" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Pilot methodology</p>
          <div className="space-y-3 mb-5">
            {[
              { l: "Audit type", v: "Cybersecurity compliance (~800 Qs)" },
              { l: "Sample", v: "N=3 full audit cycles" },
              { l: "Baseline", v: "Senior subcontractor, 18 days" },
              { l: "Accuracy measure", v: "Qualified reviewer accept rate" },
              { l: "Error taxonomy", v: "0% critical, 16% minor revision" },
              { l: "Validation", v: "QA function sign-off on methodology" },
            ].map(item => (
              <div key={item.l} className="flex justify-between items-start gap-3">
                <span style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.5)`, flexShrink: 0 }}>{item.l}</span>
                <span className="text-right font-semibold" style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.85)` }}>{item.v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3" style={{ background: `hsl(${ACCENT} / 0.15)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 12, color: `hsl(${ACCENT})` }}>
              GxP pharma pilot planned: same methodology, GMP/vendor qualification audit types
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 3 - OPERATING MODEL EXPANSION
// ═══════════════════════════════════════════════════════════════════════════════

function Act3_ExpansionMap() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={3} slideLabel="FROM AUDIT TO OPERATING MODEL" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-4" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
            From audit to
            <br /><span style={{ color: `hsl(${CORAL})` }}>lifecycle operating model.</span>
          </h2>
          <p className="mb-6" style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55, maxWidth: 650 }}>
            Audit is the entry point. The same architecture that runs audits handles any judgment-heavy process across the medicine lifecycle. Each step builds on the knowledge graph from the previous one.
          </p>

          <div className="space-y-5">
            {[
              {
                step: "Step 1", title: "Audit as Proof Point", timeline: "Month 1-3",
                desc: "Continuous readiness scoring, audit execution engine, evidence gap detection. Prove the architecture on the most measurable GxP domain.",
                outcomes: ["Readiness score by clause/site", "18 days → 1.5 hours", "84% first-pass accuracy"],
                color: GOLD,
              },
              {
                step: "Step 2", title: "Protocol Execution", timeline: "Month 3-6",
                desc: "Encode top 3 high-variance protocols: Deviation/CAPA handling, eTMF QC checklists, vendor qualification. Gate-enforced, auditable.",
                outcomes: ["25%+ deviation rate reduction target", "CAPA on-time closure", "Cross-site consistency"],
                color: ACCENT,
              },
              {
                step: "Step 3", title: "Lifecycle Expansion", timeline: "Month 6-12",
                desc: "PV ICSR triage and case QA. Clinical ops monitoring consistency. Regulatory submission readiness. Each domain's learning enriches the others.",
                outcomes: ["PV case consistency", "Clinical monitoring adherence", "Knowledge compounding"],
                color: CORAL,
              },
            ].map((s, i) => (
              <div key={s.step} className="flex gap-5 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `hsl(${s.color} / 0.15)`, border: `1px solid hsl(${s.color} / 0.3)` }}>
                    <span className="font-black" style={{ fontSize: 16, color: `hsl(${s.color})` }}>{i + 1}</span>
                  </div>
                  {i < 2 && <div className="w-[2px] h-8 mt-1" style={{ background: `hsl(${s.color} / 0.2)` }} />}
                </div>
                <div className="rounded-xl p-5 flex-1" style={{ background: `hsl(${s.color} / 0.03)`, border: `1px solid hsl(${s.color} / 0.15)` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold" style={{ fontSize: 14, color: `hsl(${s.color})` }}>{s.step}</span>
                    <span style={{ fontSize: 13, color: `hsl(${MUT})` }}>{s.timeline}</span>
                  </div>
                  <h3 className="font-black mb-1" style={{ fontSize: 20, color: `hsl(${C})` }}>{s.title}</h3>
                  <p className="mb-2" style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.outcomes.map(o => (
                      <span key={o} className="rounded-full px-3 py-1" style={{ background: `hsl(${s.color} / 0.08)`, fontSize: 12, color: `hsl(${s.color})`, fontWeight: 600 }}>{o}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[320px] flex-shrink-0 rounded-2xl p-6" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-4" style={{ fontSize: 18, color: `hsl(${CORAL})` }}>The compounding loop</p>
          <div className="space-y-3 mb-5">
            {[
              "Audit execution identifies evidence gaps",
              "Gaps become Directives in Context Bundles",
              "Bundles deployed as Protocols across teams",
              "Protocol executions capture new learning",
              "Learning updates Bundles and Readiness scores",
              "Next audit is faster, more accurate",
            ].map((s, i) => (
              <div key={s} className="flex items-start gap-2">
                <span className="font-bold" style={{ fontSize: 12, color: `hsl(${CORAL})`, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                <p style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.7)`, lineHeight: 1.4 }}>{s}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3" style={{ background: `hsl(${CORAL} / 0.15)`, border: `1px solid hsl(${CORAL} / 0.3)` }}>
            <p className="text-center font-semibold" style={{ fontSize: 13, color: `hsl(${CORAL})` }}>
              Every domain you encode makes every other domain smarter
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Act3_DriftOversight() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <ActBar activeAct={3} slideLabel="OVERSIGHT & DRIFT DETECTION" />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full pt-[90px]">
        <div className="flex-1">
          <h2 className="font-black mb-4" style={{ fontSize: 48, color: `hsl(${C})`, lineHeight: 1.05 }}>
            Detect drift.
            <br /><span style={{ color: `hsl(${ACCENT})` }}>Sense exceptions.</span>
            <br />Evolve protocols.
          </h2>
          <p className="mb-6" style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55, maxWidth: 650 }}>
            LIZA does not just enforce. It senses when enforcement falls short: when operators deviate for good reasons, the system captures that intelligence and proposes protocol updates.
          </p>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {[
              { title: "Drift Heatmap", desc: "Execution consistency by site, team, and protocol step. Instantly see where adherence drops and why.", color: RED, icon: <Gauge size={20} /> },
              { title: "Exception Capture", desc: "When operators deviate, the system captures narrative context, not just the fact of deviation, but the reasoning.", color: GOLD, icon: <Radio size={20} /> },
              { title: "Pattern Clustering", desc: "Repeated exceptions in the same area surface as signals. The system proposes new heuristic variants for governed trial.", color: ACCENT, icon: <GitBranch size={20} /> },
              { title: "Re-encoding Queue", desc: "Protocols that show persistent drift get flagged for expert review and update, keeping the system alive and adaptive.", color: TEAL, icon: <RefreshCw size={20} /> },
            ].map(d => (
              <div key={d.title} className="rounded-xl p-5" style={{ background: `hsl(${d.color} / 0.04)`, border: `1px solid hsl(${d.color} / 0.15)` }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${d.color})` }}>
                  {d.icon}
                  <h3 className="font-bold" style={{ fontSize: 18, color: `hsl(${C})` }}>{d.title}</h3>
                </div>
                <p style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-5 py-4" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
            <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${C})`, lineHeight: 1.5 }}>
              <span style={{ color: `hsl(${ACCENT})` }}>Enabling constraints, not rigid enforcement.</span> The system provides structure while sensing when that structure needs to evolve, turning exceptions into organisational intelligence.
            </p>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 rounded-2xl p-6" style={{ background: `hsl(${DARK})` }}>
          <p className="font-bold mb-4" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>Exception as signal</p>
          <div className="space-y-3">
            {[
              { step: "1", label: "Operator deviates from protocol step", color: RED },
              { step: "2", label: "System captures context and reasoning", color: GOLD },
              { step: "3", label: "Patterns clustered across executions", color: ACCENT },
              { step: "4", label: "New heuristic variant proposed", color: TEAL },
              { step: "5", label: "Expert reviews and approves update", color: CORAL },
              { step: "6", label: "Protocol evolves: governed, versioned", color: TEAL },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-3 rounded-lg px-4 py-2.5"
                style={{ background: `hsl(${item.color} / 0.1)`, border: `1px solid hsl(${item.color} / 0.2)` }}>
                <span className="font-black" style={{ fontSize: 16, color: `hsl(${item.color})` }}>{item.step}</span>
                <p style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.75)`, lineHeight: 1.3 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

const CAL_URL = "https://cal.com/liza-os/20min";

function Act3_Summary() {
  return (
    <div className="w-full h-full flex relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.06] top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.15)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <Pill size={24} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <span className="font-bold tracking-[0.15em]" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>LIZA OS FOR PHARMA</span>
          </div>

          <h2 className="font-black mb-8" style={{ fontSize: 52, color: "hsl(0 0% 100%)", lineHeight: 1.05 }}>
            The operating system
            <br />for medicine lifecycle
            <br /><span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>management.</span>
          </h2>

          <div className="space-y-3 mb-8">
            {[
              { num: "1", t: "The standards gap is real, and widening", d: "Inconsistent execution costs billions. AI without governance makes it worse." },
              { num: "2", t: "Audit is the fastest proof point", d: "18 days to 1.5 hours. 84% first-pass accuracy. Measurable from day one." },
              { num: "3", t: "The platform compounds across the lifecycle", d: "Same architecture handles any judgment-heavy GxP process. Every domain encoded makes the system smarter." },
            ].map(item => (
              <div key={item.num} className="flex items-start gap-4 rounded-xl p-4"
                style={{ background: `hsl(0 0% 100% / 0.05)`, border: `1px solid hsl(0 0% 100% / 0.08)` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${ACCENT} / 0.2)`, color: `hsl(${ACCENT})` }}>
                  <span className="font-black" style={{ fontSize: 16 }}>{item.num}</span>
                </div>
                <div>
                  <p className="font-bold mb-0.5" style={{ fontSize: 19, color: "hsl(0 0% 100%)" }}>{item.t}</p>
                  <p style={{ fontSize: 16, color: `hsl(0 0% 100% / 0.6)`, lineHeight: 1.45 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 rounded-full font-bold transition-transform hover:scale-[1.03]"
              style={{ fontSize: 20, height: 58, background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, color: "hsl(0 0% 100%)" }}>
              Book a 20-Min Call <ArrowRight size={20} />
            </a>
            <a href="/diagnostic" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 rounded-full font-bold border-2 transition-transform hover:scale-[1.03]"
              style={{ fontSize: 20, height: 58, borderColor: `hsl(0 0% 100% / 0.25)`, color: `hsl(0 0% 100% / 0.9)` }}>
              Take the Self-Diagnostic
            </a>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 rounded-2xl p-7" style={{ background: `hsl(0 0% 100% / 0.06)`, border: `1px solid hsl(0 0% 100% / 0.1)` }}>
          <p className="font-extrabold mb-5" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>90-day pilot path</p>
          <div className="space-y-4">
            {[
              { num: "1", label: "Week 1-2: Live audit pilot", desc: "One real audit with your documents and questions. Success criteria: ≥80% reviewer acceptance." },
              { num: "2", label: "Week 3-4: Readiness baseline", desc: "Knowledge graph scoring against your audit scope. Gap prioritisation and evidence aging." },
              { num: "3", label: "Week 5-8: Encode 3 protocols", desc: "Top high-variance protocols with gate enforcement. Validation support included." },
              { num: "4", label: "Week 9-12: Measure outcomes", desc: "70%+ doc search reduction. Zero critical errors. Readiness score improvement tracked." },
            ].map(step => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${ACCENT} / 0.2)`, color: `hsl(${ACCENT})` }}>
                  <span className="font-black" style={{ fontSize: 14 }}>{step.num}</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ fontSize: 15, color: "hsl(0 0% 100%)" }}>{step.label}</p>
                  <p style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.55)`, lineHeight: 1.4 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-5">
            {[
              { v: "GxP", l: "Designed for" },
              { v: "Part 11", l: "Architected for" },
              { v: "CSA", l: "Validation approach" },
            ].map(s => (
              <div key={s.v} className="text-center">
                <p className="font-black" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>{s.v}</p>
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
  { id: "title",       title: "Title",                    component: <SlideTitle /> },
  // Act 1 - The GxP Challenge (7 slides)
  { id: "act1-divider", title: "Act 1 · The GxP Challenge", component: <SectionDivider actNum={1} title="The GxP Challenge" subtitle="From research to release: why the medicine lifecycle needs an operating system for judgment." icon={<Globe size={36} />} color={ACCENT} /> },
  { id: "a1-lifecycle", title: "Medicine Lifecycle",        component: <Act1_LifecycleChallenge /> },
  { id: "a1-gap",      title: "The Standards Gap",         component: <Act1_StandardsGap /> },
  { id: "a1-why-now",  title: "Why Now",                   component: <Act1_WhyNow /> },
  { id: "a1-options",  title: "The Options",               component: <Act1_Options /> },
  { id: "a1-arch",     title: "System of Reasoning",       component: <Act1_Architecture /> },
  { id: "a1-trust",    title: "Trust & Compliance",        component: <Act1_TrustCompliance /> },
  { id: "a1-int",      title: "Integration Architecture",  component: <Act1_Integrations /> },
  // Act 2 - The Audit Engine (5 slides)
  { id: "act2-divider", title: "Act 2 · The Audit Engine", component: <SectionDivider actNum={2} title="The Audit Engine" subtitle="Audit protects the edges of quality in every regulated industry. Here's how LIZA makes it 10x faster." icon={<ClipboardCheck size={36} />} color={GOLD} /> },
  { id: "a2-crisis",   title: "Audit Crisis",              component: <Act2_AuditCrisis /> },
  { id: "a2-dual",     title: "Prepare + Run",             component: <Act2_DualCapability /> },
  { id: "a2-how",      title: "How It Works",              component: <Act2_HowItWorks /> },
  { id: "a2-results",  title: "Proven Results",            component: <Act2_Results /> },
  // Act 3 - Operating Model (4 slides)
  { id: "act3-divider", title: "Act 3 · Operating Model",  component: <SectionDivider actNum={3} title="Operating Model" subtitle="From audit entry point to cross-functional medicine lifecycle management." icon={<Pill size={36} />} color={CORAL} /> },
  { id: "a3-expand",   title: "Expansion Map",             component: <Act3_ExpansionMap /> },
  { id: "a3-drift",    title: "Drift & Oversight",         component: <Act3_DriftOversight /> },
  { id: "a3-summary",  title: "Summary & CTA",            component: <Act3_Summary /> },
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
          <h2 className="text-xl font-bold" style={{ color: `hsl(${C})` }}>All Slides: Pharma MLM Pitch</h2>
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
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>Medicine Lifecycle Management, 3-Act Deck ({SLIDES.length} slides)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-Pharma-MLM" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
          <Button size="sm" variant="ghost" onClick={enterFullscreen} style={{ color: `hsl(${MUT})` }}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-[200px] border-r flex-shrink-0 overflow-y-auto p-3 space-y-2"
          style={{ borderColor: CHROME_BORDER }}>
          {SLIDES.map((slide, i) => (
            <button key={slide.id} onClick={() => setCurrent(i)}
              className={cn("w-full rounded-lg overflow-hidden border transition-all",
                i === current ? "ring-2" : "hover:border-gray-300")}
              style={{ borderColor: i === current ? `hsl(${ACCENT})` : CHROME_BORDER,
                ...(i === current ? { boxShadow: `0 0 0 2px hsl(${ACCENT} / 0.3)` } : {}) }}>
              <div className="aspect-video"><ScaledSlide>{slide.component}</ScaledSlide></div>
              <div className="p-1.5 text-left" style={{ background: CHROME_BG }}>
                <p className="text-[9px] font-mono truncate" style={{ color: `hsl(${MUT})` }}>{i + 1}. {slide.title}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full h-full max-w-[1200px] rounded-xl overflow-hidden border"
            style={{ borderColor: CHROME_BORDER, boxShadow: "0 4px 24px hsl(200 15% 70% / 0.15)" }}>
            <ScaledSlide>{SLIDES[current].component}</ScaledSlide>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 h-12 border-t flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <Button variant="ghost" size="sm" onClick={prev} disabled={current === 0} style={{ color: `hsl(${MUT})` }}>
          <ChevronLeft size={16} />
        </Button>
        <span className="font-mono text-xs min-w-[80px] text-center" style={{ color: `hsl(${MUT})` }}>
          {current + 1} / {SLIDES.length}
        </span>
        <Button variant="ghost" size="sm" onClick={next} disabled={current === SLIDES.length - 1} style={{ color: `hsl(${MUT})` }}>
          <ChevronRight size={16} />
        </Button>
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}

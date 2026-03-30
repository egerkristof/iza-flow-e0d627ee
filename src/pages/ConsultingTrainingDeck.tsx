import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Users, BarChart3, Shield, Workflow, GraduationCap,
  Lightbulb, Search, Puzzle, Code, HeartHandshake,
  Briefcase, LineChart, MessageSquare, Rocket, Building2,
  ArrowDown, Factory, Landmark, Scale, Crosshair, Gauge,
  Cog, Network, UserCheck, Sparkles, GitBranch, FileText,
  Activity, CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";
import zoltanPhoto from "@/assets/zoltan-kauker.png";

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

// ─── Design tokens ────────────────────────────────────────────────────────────

const BG     = "hsl(0 0% 100%)";
const BG2    = "hsl(210 20% 97%)";
const BG3    = "hsl(210 18% 94%)";
const C      = "222 47% 11%";
const MUT    = "215 14% 40%";
const ACCENT = "200 90% 40%";
const TEAL   = "155 72% 36%";
const GOLD   = "38 92% 42%";
const RED    = "0 72% 45%";
const PURPLE = "260 60% 48%";
const DARK   = "222 47% 8%";

function GridBg() {
  return (
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `linear-gradient(hsl(215 15% 85%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 85%) 1px, transparent 1px)`,
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

const JOURNEY_PHASES = [
  { key: "assess", label: "Assess", subtitle: "Diagnosis", color: ACCENT, icon: <BarChart3 size={18} /> },
  { key: "align", label: "Align", subtitle: "Training", color: TEAL, icon: <GraduationCap size={18} /> },
  { key: "apply", label: "Apply", subtitle: "Consulting", color: GOLD, icon: <Rocket size={18} /> },
  { key: "anchor", label: "Anchor", subtitle: "Platform", color: PURPLE, icon: <Lock size={18} /> },
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

      {/* Journey progress bar at top */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 flex items-center gap-0">
        {JOURNEY_PHASES.map((phase, i) => {
          const isActive = phase.key === activePhase;
          const isPast = JOURNEY_PHASES.findIndex(p => p.key === activePhase) > i;
          const isSkipped = phase.key === "assess";
          return (
            <div key={phase.key} className="flex items-center">
              {i > 0 && (
                <div className="w-[60px] h-[2px]" style={{
                  background: isPast ? `hsl(0 0% 100% / 0.4)` : `hsl(0 0% 100% / 0.1)`
                }} />
              )}
              <div className="flex flex-col items-center gap-2 relative" style={{ width: 140 }}>
                <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all"
                  style={{
                    borderColor: isActive ? `hsl(${phase.color})` : isPast ? `hsl(0 0% 100% / 0.3)` : `hsl(0 0% 100% / 0.12)`,
                    background: isActive ? `hsl(${phase.color} / 0.25)` : `hsl(0 0% 100% / 0.04)`,
                    color: isActive ? `hsl(${phase.color})` : isPast ? `hsl(0 0% 100% / 0.4)` : `hsl(0 0% 100% / 0.15)`,
                    ...(isActive ? { boxShadow: `0 0 24px hsl(${phase.color} / 0.3)` } : {}),
                  }}>
                  {isSkipped && !isActive ? (
                    <span style={{ fontSize: 14, fontWeight: 700 }}>—</span>
                  ) : (
                    phase.icon
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold" style={{
                    fontSize: isActive ? 16 : 14,
                    color: isActive ? `hsl(${phase.color})` : isPast ? `hsl(0 0% 100% / 0.4)` : `hsl(0 0% 100% / 0.18)`,
                  }}>
                    {phase.label}
                  </p>
                  {isActive && (
                    <p style={{ fontSize: 12, color: `hsl(${phase.color} / 0.7)` }}>{phase.subtitle}</p>
                  )}
                  {isSkipped && !isActive && (
                    <p style={{ fontSize: 11, color: `hsl(0 0% 100% / 0.2)`, fontStyle: "italic" }}>Pre-engagement</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 text-center mt-8">
        <p className="font-bold tracking-[0.35em] uppercase mb-6"
          style={{ fontSize: 20, color: `hsl(${color})` }}>{part}</p>
        <h2 className="font-black" style={{ fontSize: 80, color: "hsl(0 0% 100%)", lineHeight: 1.1 }}>{title}</h2>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `hsl(${color})` }} />
    </div>
  );
}

// ─── Reusable track deep-dive layout ──────────────────────────────────────────

function TrackDeepDive({ chipColor, icon, title, subtitle, challenge, transformation, implementations }: {
  chipColor: string; icon: React.ReactNode; title: string; subtitle: string;
  challenge: React.ReactNode; transformation: React.ReactNode;
  implementations: { title: string; desc: string }[];
}) {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <div className="flex items-center gap-3 mb-6">
          <Chip color={chipColor}>Track Deep Dive</Chip>
          <span style={{ color: `hsl(${chipColor})` }}>{icon}</span>
        </div>
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: `hsl(${C})`, lineHeight: 1.1 }}>
          {title}:
          <br /><span style={{ color: `hsl(${chipColor})` }}>{subtitle}</span>
        </h2>

        <div className="grid grid-cols-2 gap-8 mt-4">
          <div>
            <div className="rounded-2xl border p-7 mb-5" style={{ background: `hsl(${RED} / 0.05)`, borderColor: `hsl(${RED} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 21, color: `hsl(${RED})` }}>The Challenge</p>
              <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{challenge}</p>
            </div>
            <div className="rounded-2xl border p-7" style={{ background: `hsl(${TEAL} / 0.05)`, borderColor: `hsl(${TEAL} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 21, color: `hsl(${TEAL})` }}>The Transformation</p>
              <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{transformation}</p>
            </div>
          </div>

          <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${chipColor} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${chipColor})` }} />
            <p className="font-bold mb-5" style={{ fontSize: 21, color: `hsl(${chipColor})` }}>Typical Implementations</p>
            <div className="space-y-4">
              {implementations.map(({ title: t, desc }) => (
                <div key={t} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${chipColor})`, flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p className="font-bold" style={{ fontSize: 19, color: `hsl(${C})` }}>{t}</p>
                    <p style={{ fontSize: 17, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{desc}</p>
                  </div>
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

// ─── Reusable module deep-dive layout ─────────────────────────────────────────

function ModuleDeepDive({ chipColor, moduleNum, title, subtitle, audience, concept, conceptDesc, applicationTitle, applicationDesc, rightContent }: {
  chipColor: string; moduleNum: string; title: string; subtitle: string; audience: string;
  concept: string; conceptDesc: React.ReactNode; applicationTitle: string; applicationDesc: React.ReactNode;
  rightContent: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={chipColor}>Training Module {moduleNum}</Chip>
          <h2 className="font-black mt-5 mb-2" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.1 }}>
            {title}:
            <br /><span style={{ color: `hsl(${chipColor})` }}>{subtitle}</span>
          </h2>
          <p className="mb-6" style={{ fontSize: 18, color: `hsl(${chipColor})` }}>
            Target: {audience}
          </p>

          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{ background: `hsl(${chipColor} / 0.06)`, border: `1px solid hsl(${chipColor} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 19, color: `hsl(${chipColor})` }}>{concept}</p>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{conceptDesc}</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 19, color: `hsl(${ACCENT})` }}>{applicationTitle}</p>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{applicationDesc}</p>
            </div>
          </div>
        </div>

        <div className="w-[540px] flex-shrink-0">
          {rightContent}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1: THE STRATEGIC WEDGE
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
          <GraduationCap size={22} style={{ color: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>
            Executive Education & Operational Consulting
          </span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 96, lineHeight: 1.0, color: `hsl(${C})` }}>
          Architecting the
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organization
          </span>
        </h1>

        <p style={{ fontSize: 30, color: `hsl(${MUT})`, maxWidth: 1000, lineHeight: 1.55 }}>
          A comprehensive program for leaders who understand that AI transformation
          <br />is <strong style={{ color: `hsl(${C})` }}>80% human architecture</strong> and <strong style={{ color: `hsl(${C})` }}>20% tooling</strong>.
        </p>

        <div className="mt-14 flex items-center gap-5">
          <Chip color={ACCENT}>Assess</Chip>
          <ArrowRight size={20} style={{ color: `hsl(${MUT} / 0.4)` }} />
          <Chip color={TEAL}>Align</Chip>
          <ArrowRight size={20} style={{ color: `hsl(${MUT} / 0.4)` }} />
          <Chip color={GOLD}>Apply</Chip>
          <ArrowRight size={20} style={{ color: `hsl(${MUT} / 0.4)` }} />
          <Chip color={PURPLE}>Anchor</Chip>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Slide02InfraGap() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Core Problem" color={RED} />
        <h2 className="font-black mb-12" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.1 }}>
          You bought the models.
          <br />
          <span style={{ color: `hsl(${RED})` }}>But you lack the management layer.</span>
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-2xl border p-10" style={{ background: `hsl(${RED} / 0.06)`, borderColor: `hsl(${RED} / 0.2)` }}>
            <div className="flex items-center gap-4 mb-5">
              <AlertTriangle size={36} style={{ color: `hsl(${RED})` }} />
              <p className="font-bold" style={{ fontSize: 28, color: `hsl(${RED})` }}>The Current State</p>
            </div>
            <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
              Your teams have access to powerful AI. Usage is high, but work happens in
              <strong style={{ color: `hsl(${C})` }}> individual silos</strong> with inconsistent outputs
              requiring heavy manual rework. Enterprise-grade governance is missing.
            </p>
          </div>

          <div className="rounded-2xl border p-10" style={{ background: `hsl(${GOLD} / 0.06)`, borderColor: `hsl(${GOLD} / 0.2)` }}>
            <div className="flex items-center gap-4 mb-5">
              <Brain size={36} style={{ color: `hsl(${GOLD})` }} />
              <p className="font-bold" style={{ fontSize: 28, color: `hsl(${GOLD})` }}>The Hidden Cost: Semantic Debt</p>
            </div>
            <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
              Rapid AI adoption without shared standards <strong style={{ color: `hsl(${C})` }}>amplifies existing ambiguity</strong>.
              When a junior employee types a vague prompt, the AI executes literally — exposing the lack of clear internal alignment.
            </p>
          </div>
        </div>

        <div className="mt-8 px-8 py-5 rounded-xl border" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>Standard "Prompt Engineering" is a dead end.</strong>{" "}
            The future requires an Operating Model built on Continuous Context Engineering.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Slide03ContextStarvation() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Tag label="The Root Cause" color={GOLD} />
          <h2 className="font-black mb-8" style={{ fontSize: 60, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Hallucination is rarely
            <br />a technical flaw.
            <br /><span style={{ color: `hsl(${GOLD})` }}>It is missing human judgment.</span>
          </h2>
          <p className="mb-6" style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            When AI fails, it is <strong style={{ color: `hsl(${C})` }}>"Context Starved"</strong> — it lacks the unwritten
            rules your senior experts hold in their heads.
          </p>
          <div className="rounded-xl p-6" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
            <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>The Shift</p>
            <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              Move from passing <strong style={{ color: `hsl(${C})` }}>Lower-Order Knowledge</strong> (raw data, documents)
              to encoding <strong style={{ color: `hsl(${C})` }}>Higher-Order Knowledge</strong> (strategic intent, ethical guardrails, decision frameworks).
            </p>
          </div>
        </div>

        <div className="w-[560px] flex-shrink-0 relative" style={{ height: 700 }}>
          <div className="absolute left-0 right-0" style={{ top: 180, height: 2, background: `hsl(${ACCENT} / 0.3)` }} />
          <p className="absolute right-4 font-mono font-bold" style={{ top: 165, fontSize: 14, color: `hsl(${ACCENT})` }}>WATERLINE</p>
          <div className="absolute left-[120px] right-[120px] rounded-t-[40px] flex flex-col items-center justify-center"
            style={{ top: 40, height: 140, background: `hsl(${ACCENT} / 0.12)`, border: `1px solid hsl(${ACCENT} / 0.3)`, borderBottom: "none" }}>
            <p className="font-bold text-center" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>The Prompt</p>
            <p style={{ fontSize: 16, color: `hsl(${MUT})` }}>The immediate task</p>
          </div>
          <div className="absolute left-4 right-4 rounded-b-[60px] flex flex-col items-center justify-center gap-3 px-10"
            style={{ top: 182, bottom: 0, background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.2)`, borderTop: "none" }}>
            <p className="font-bold text-center" style={{ fontSize: 24, color: `hsl(${GOLD})` }}>Missing Context</p>
            {["Organizational DNA", "Brand tone & voice", "Guardrails", "Negative constraints", "Historical failures", "Decision frameworks", "etc."].map(item => (
              <p key={item} style={{ fontSize: 18, color: `hsl(${MUT})` }}>{item}</p>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 04 — The Workforce Spectrum (REFINED) ──────────────────────────────

function Slide04Transformation() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Philosophy" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          80% Human Mindset.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>20% Tooling.</span>
        </h2>
        <div className="mb-10" style={{ height: 8 }} />

        {/* 3-tier spectrum */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Today */}
          <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: `hsl(${RED} / 0.05)`, borderColor: `hsl(${RED} / 0.2)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${RED} / 0.5)` }} />
            <p className="font-bold mb-1" style={{ fontSize: 16, color: `hsl(${RED})` }}>TODAY</p>
            <p className="font-black mb-3" style={{ fontSize: 30, color: `hsl(${C})` }}>System Executors</p>
            <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
              Everyone performs tasks manually. AI is bolted on as a productivity hack. The bottleneck is <strong style={{ color: `hsl(${C})` }}>manual capacity</strong>.
            </p>
            <p className="mt-3 font-semibold" style={{ fontSize: 16, color: `hsl(${RED})` }}>100% of workforce</p>
          </div>

          {/* AI-Augmented Operators */}
          <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: `hsl(${GOLD} / 0.05)`, borderColor: `hsl(${GOLD} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${GOLD})` }} />
            <p className="font-bold mb-1" style={{ fontSize: 16, color: `hsl(${GOLD})` }}>THE NEW MAJORITY</p>
            <p className="font-black mb-3" style={{ fontSize: 30, color: `hsl(${C})` }}>AI-Augmented Operators</p>
            <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
              Frontline workers executing through <strong style={{ color: `hsl(${C})` }}>governed AI workflows</strong> designed by others. Higher output, lower friction, guided by playbooks.
            </p>
            <p className="mt-3 font-semibold" style={{ fontSize: 16, color: `hsl(${GOLD})` }}>~70-80% of workforce</p>
          </div>

          {/* System Designers */}
          <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: `hsl(${TEAL} / 0.06)`, borderColor: `hsl(${TEAL} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${TEAL})` }} />
            <p className="font-bold mb-1" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>THE NEW ELITE</p>
            <p className="font-black mb-3" style={{ fontSize: 30, color: `hsl(${C})` }}>System Designers</p>
            <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
              Architects who <strong style={{ color: `hsl(${C})` }}>codify expert judgment</strong> into playbooks, govern AI agents, and design the systems that operators execute through.
            </p>
            <p className="mt-3 font-semibold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>~20-30% of workforce</p>
          </div>
        </div>

        <div className="px-8 py-5 rounded-xl border" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <p style={{ fontSize: 22, color: `hsl(${MUT})` }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>The HR challenge of the AI era:</strong>{" "}
            Identify who can become a System Designer. Upskill everyone else into AI-Augmented Operators. The transition path is what this program builds.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function Slide05Journey() {
  const phases = [
    { step: "01", icon: <BarChart3 size={36} />, color: ACCENT, title: "Assess", subtitle: "Diagnosis",
      body: "Map operational bottlenecks via our AI Execution Maturity Diagnostic. Quantify readiness per department." },
    { step: "02", icon: <GraduationCap size={36} />, color: TEAL, title: "Align", subtitle: "Training",
      body: "Shift mindsets through the Training Curriculum. 5 executive-grade modules building the shared vocabulary." },
    { step: "03", icon: <Rocket size={36} />, color: GOLD, title: "Apply", subtitle: "Consulting",
      body: "Half-day departmental deep-dives to extract tacit knowledge and build real AI workflows." },
    { step: "04", icon: <Lock size={36} />, color: PURPLE, title: "Anchor", subtitle: "Infrastructure",
      body: "Codify knowledge permanently as executable code in the LIZA OS simulation environment." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Transformation Journey" />
        <h2 className="font-black mb-10" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Assess <span style={{ color: `hsl(${MUT} / 0.3)` }}>→</span> Align <span style={{ color: `hsl(${MUT} / 0.3)` }}>→</span> Apply <span style={{ color: `hsl(${MUT} / 0.3)` }}>→</span> Anchor
        </h2>

        <div className="grid grid-cols-4 gap-5">
          {phases.map(({ step, icon, color, title, subtitle, body }) => (
            <div key={title} className="rounded-2xl border p-7 flex flex-col gap-4 relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.3)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div className="flex items-center gap-3">
                <span className="font-black" style={{ fontSize: 42, color: `hsl(${color} / 0.25)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 30, color: `hsl(${C})` }}>{title}</p>
                <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${color})` }}>{subtitle}</p>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2: THE CURRICULUM [ALIGN]
// ═══════════════════════════════════════════════════════════════════════════════

function SlideCurriculumOverview() {
  const modules = [
    { n: "01", icon: <Crosshair size={26} />, color: ACCENT, title: "The Execution Gap",
      audience: "All Staff & Leadership",
      core: "Cynefin Framework — map work complexity to identify automation targets vs. human-oversight areas.",
    },
    { n: "02", icon: <Brain size={26} />, color: TEAL, title: "The Human Engine",
      audience: "Managers & Senior Experts",
      core: "Naturalistic Decision Making — how experts decide under pressure. The System Executor → System Designer shift.",
    },
    { n: "03", icon: <Workflow size={26} />, color: GOLD, title: "Active Context",
      audience: "Frontline & Knowledge Workers",
      core: "The Knowledge Extraction Protocol — translate tacit 'how-we-do-things-here' into explicit AI instructions.",
    },
    { n: "04", icon: <Shield size={26} />, color: PURPLE, title: "Safe Infrastructure",
      audience: "Engineering, IT & Operations",
      core: "Separation of Logic from the LLM — business rules live in your systems, not inside the AI model.",
    },
    { n: "05", icon: <Landmark size={26} />, color: RED, title: "The AI-Native Business Model",
      audience: "C-Suite & Strategy",
      core: "Governance as Enterprise Valuation — restructuring for the economy where judgment compounds, not just labor.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Chip color={TEAL}>Align · Training</Chip>
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, color: `hsl(${C})`, lineHeight: 1.1 }}>
          The Training Curriculum
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: `hsl(${MUT})` }}>
          5 modular, executive-grade education modules. Ratio: <strong style={{ color: `hsl(${C})` }}>80% Mindset / 20% Application</strong>.
        </p>

        <div className="space-y-3">
          {modules.map(({ n, icon, color, title, audience, core }) => (
            <div key={n} className="flex items-center gap-5 rounded-xl border px-6 py-4"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.2)` }}>
              <span className="font-black w-10 text-right" style={{ fontSize: 28, color: `hsl(${color} / 0.35)` }}>{n}</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <p className="font-bold" style={{ fontSize: 24, color: `hsl(${C})` }}>{title}</p>
                  <p style={{ fontSize: 16, color: `hsl(${color})` }}>{audience}</p>
                </div>
                <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{core}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Module 1 Deep Dive ──────────────────────────────────────────────────────

function SlideModule1() {
  return (
    <ModuleDeepDive
      chipColor={ACCENT}
      moduleNum="1"
      title="The Execution Gap"
      subtitle="Why AI Fails at Complex Work"
      audience="All Staff & Leadership"
      concept="The Cynefin Framework"
      conceptDesc={<>A visual map of organizational work. We teach teams that AI easily automates <strong style={{ color: `hsl(${C})` }}>predictable workflows</strong> (Simple/Complicated), but struggles with <strong style={{ color: `hsl(${C})` }}>unpredictable strategy</strong> (Complex/Chaotic). This becomes the shared vocabulary for every subsequent decision.</>}
      applicationTitle="Work Mapping Exercise"
      applicationDesc={<>Teams physically plot their department's daily tasks on the Cynefin board. The result: a clear map of <strong style={{ color: `hsl(${C})` }}>immediate automation targets</strong> vs. areas requiring human oversight and judgment.</>}
      rightContent={
        <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${ACCENT} / 0.3)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${ACCENT})` }} />
          <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>
            The Cynefin Board
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { zone: "Simple", color: TEAL, desc: "Best practices. Fully automatable.", icon: "✓" },
              { zone: "Complicated", color: ACCENT, desc: "Expert analysis. AI-assisted with guardrails.", icon: "⚙" },
              { zone: "Complex", color: GOLD, desc: "Emergent strategy. Human judgment essential.", icon: "?" },
              { zone: "Chaotic", color: RED, desc: "Crisis response. Act first, sense later.", icon: "!" },
            ].map(({ zone, color, desc, icon }) => (
              <div key={zone} className="rounded-xl p-5 text-center" style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.2)` }}>
                <p className="text-3xl mb-2">{icon}</p>
                <p className="font-bold mb-1" style={{ fontSize: 20, color: `hsl(${color})` }}>{zone}</p>
                <p style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-4 flex items-center gap-4" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <Lightbulb size={22} style={{ color: `hsl(${TEAL})` }} />
            <p style={{ fontSize: 17, color: `hsl(${MUT})` }}>
              <strong style={{ color: `hsl(${TEAL})` }}>Key insight:</strong> Most orgs automate the wrong quadrant first
            </p>
          </div>
        </div>
      }
    />
  );
}

// ─── Module 2 Deep Dive ──────────────────────────────────────────────────────

function SlideModule2() {
  return (
    <ModuleDeepDive
      chipColor={TEAL}
      moduleNum="2"
      title="The Human Engine"
      subtitle="Judgment in the Age of AI"
      audience="Managers, Leaders & Senior Experts"
      concept="Naturalistic Decision Making (NDM)"
      conceptDesc={<>How human experts <strong style={{ color: `hsl(${C})` }}>actually make decisions</strong> under pressure — through pattern recognition, core values, and accumulated experience. This is the knowledge AI cannot replicate but can be governed by.</>}
      applicationTitle="The Identity Shift Exercise"
      applicationDesc={<>Participants map their own work: what's lower-order (automatable) vs. higher-order (their unique value). The result: a personal clarity on <strong style={{ color: `hsl(${C})` }}>where their career value now lives</strong> in the AI-native economy.</>}
      rightContent={
        <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.3)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${TEAL})` }} />
          <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
            The Value Shift
          </p>
          {[
            { label: "Execute the task", old: true, desc: "Write the report, run the analysis, draft the email" },
            { label: "Design the system", old: false, desc: "Define what 'good' looks like, set the constraints, govern the output" },
            { label: "Govern the ecosystem", old: false, desc: "Manage networks of AI agents, curate organizational knowledge" },
          ].map(({ label, old, desc }, i) => (
            <div key={label} className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: old ? `hsl(${RED} / 0.12)` : `hsl(${TEAL} / 0.15)`, color: old ? `hsl(${RED})` : `hsl(${TEAL})` }}>
                {old ? <X size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <div>
                <p className="font-bold" style={{ fontSize: 19, color: old ? `hsl(${RED})` : `hsl(${C})` }}>
                  {old ? "Commoditized: " : ""}{label}
                </p>
                <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
          <div className="rounded-lg p-4" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.2)` }}>
            <p style={{ fontSize: 17, color: `hsl(${MUT})` }}>
              <strong style={{ color: `hsl(${GOLD})` }}>Key takeaway:</strong> You are no longer paid to execute. You are paid to design the system that executes.
            </p>
          </div>
        </div>
      }
    />
  );
}

// ─── Module 3 Deep Dive ──────────────────────────────────────────────────────

function SlideModule3() {
  return (
    <ModuleDeepDive
      chipColor={GOLD}
      moduleNum="3"
      title="Active Context"
      subtitle="The End of Prompt Engineering"
      audience="Frontline & Knowledge Workers"
      concept="The Knowledge Extraction Protocol"
      conceptDesc={<>A structured method for translating the invisible "how-we-do-things-here" knowledge held by senior staff into <strong style={{ color: `hsl(${C})` }}>clear, persistent rules</strong> for AI. Moving tacit knowledge to explicit, executable instructions.</>}
      applicationTitle="Interactive Sandbox Workshop"
      applicationDesc={<>We reverse-engineer frustrating AI failures from participants' real work and build structured <strong style={{ color: `hsl(${C})` }}>"Smart Briefs"</strong> (Context + Purpose + Constraints) to fix the output permanently.</>}
      rightContent={
        <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${GOLD} / 0.3)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${GOLD})` }} />
          <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 16, color: `hsl(${GOLD})` }}>
            Knowledge Extraction Protocol
          </p>
          {[
            { step: "1", label: "Identify", desc: "Surface a recurring AI failure from real workflows" },
            { step: "2", label: "Diagnose", desc: "Map which tacit knowledge the AI was missing" },
            { step: "3", label: "Extract", desc: "Interview the expert; structure the 'Mindflow'" },
            { step: "4", label: "Codify", desc: "Build the Context Bundle in LIZA OS sandbox" },
            { step: "5", label: "Validate", desc: "Re-run the task — measure improvement live" },
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `hsl(${GOLD} / 0.15)`, color: `hsl(${GOLD})`, fontSize: 18, fontWeight: 800 }}>{step}</div>
              <div className="flex-1">
                <p className="font-bold" style={{ fontSize: 19, color: `hsl(${C})` }}>{label}</p>
                <p style={{ fontSize: 16, color: `hsl(${MUT})` }}>{desc}</p>
              </div>
            </div>
          ))}
          <div className="mt-3 rounded-lg p-4 flex items-center gap-4" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <Gauge size={22} style={{ color: `hsl(${TEAL})` }} />
            <p style={{ fontSize: 17, color: `hsl(${MUT})` }}>
              <strong style={{ color: `hsl(${TEAL})` }}>Typical result:</strong> 40-60% quality improvement on first iteration
            </p>
          </div>
        </div>
      }
    />
  );
}

// ─── Module 4 Deep Dive ──────────────────────────────────────────────────────

function SlideModule4() {
  return (
    <ModuleDeepDive
      chipColor={PURPLE}
      moduleNum="4"
      title="Safe Infrastructure"
      subtitle="Building Governed AI Systems"
      audience="Engineering, IT, Operations & Product Architecture"
      concept="Separation of Logic from the LLM"
      conceptDesc={<>The critical architectural rule: <strong style={{ color: `hsl(${C})` }}>business rules and compliance constraints must live in the infrastructure</strong> (your systems), not inside the AI model itself. The model is the engine; your rules are the steering wheel.</>}
      applicationTitle="Architecture Whiteboard Session"
      applicationDesc={<>Teams design a safe automation architecture for their own use case — achieving both <strong style={{ color: `hsl(${C})` }}>high computer automation</strong> and <strong style={{ color: `hsl(${C})` }}>high human control</strong> simultaneously. No black boxes.</>}
      rightContent={
        <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${PURPLE} / 0.3)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${PURPLE})` }} />
          <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 16, color: `hsl(${PURPLE})` }}>
            The Architecture Principle
          </p>
          <div className="space-y-4">
            {[
              { title: "Context Layer", desc: "Organizational rules, constraints, domain knowledge", icon: <Layers size={20} />, color: ACCENT },
              { title: "Orchestration Layer", desc: "Workflow logic, routing, approval gates", icon: <Network size={20} />, color: TEAL },
              { title: "Execution Layer", desc: "LLM generates within governed boundaries", icon: <Cog size={20} />, color: GOLD },
              { title: "Audit Layer", desc: "Every decision traceable, every output governed", icon: <Shield size={20} />, color: PURPLE },
            ].map(({ title: t, desc, icon, color }) => (
              <div key={t} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{icon}</div>
                <div>
                  <p className="font-bold" style={{ fontSize: 19, color: `hsl(${C})` }}>{t}</p>
                  <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-4" style={{ background: `hsl(${RED} / 0.06)`, border: `1px solid hsl(${RED} / 0.15)` }}>
            <p style={{ fontSize: 16, color: `hsl(${MUT})` }}>
              <strong style={{ color: `hsl(${RED})` }}>Anti-pattern:</strong> Embedding compliance rules inside prompts = zero auditability
            </p>
          </div>
        </div>
      }
    />
  );
}

// ─── Module 5 Deep Dive ──────────────────────────────────────────────────────

function SlideModule5() {
  return (
    <ModuleDeepDive
      chipColor={RED}
      moduleNum="5"
      title="The AI-Native Business Model"
      subtitle="Restructuring for the New Economy"
      audience="C-Suite, Board & Strategy Teams"
      concept="Governance as Enterprise Valuation"
      conceptDesc={<>The death of selling billable hours. The shift to selling <strong style={{ color: `hsl(${C})` }}>guaranteed, high-quality outcomes</strong> scaled by AI. Companies that codify judgment create compounding intellectual capital — which directly drives enterprise valuation.</>}
      applicationTitle="Business Model Canvas Redesign"
      applicationDesc={<>Leadership teams redesign their value delivery model: what shifts from effort-based to outcome-based? Where does <strong style={{ color: `hsl(${C})` }}>AI governance become a competitive moat</strong> rather than a cost center?</>}
      rightContent={
        <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${RED} / 0.3)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${RED})` }} />
          <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 16, color: `hsl(${RED})` }}>
            The Strategic Shift
          </p>
          <div className="space-y-5">
            {[
              { before: "Sell hours of expert labor", after: "Sell governed outcomes at scale", icon: <TrendingUp size={20} /> },
              { before: "Deep human hierarchies", after: "Small elite teams + AI agent networks", icon: <Users size={20} /> },
              { before: "Knowledge in people's heads", after: "Codified IP = compounding asset", icon: <BookOpen size={20} /> },
              { before: "Governance as compliance cost", after: "Governance as valuation driver", icon: <Landmark size={20} /> },
            ].map(({ before, after, icon }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${RED} / 0.12)`, color: `hsl(${RED})` }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 16, color: `hsl(${MUT})`, textDecoration: "line-through" }}>{before}</p>
                  <p className="font-bold" style={{ fontSize: 18, color: `hsl(${C})` }}>{after}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg p-4" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 17, color: `hsl(${MUT})` }}>
              <strong style={{ color: `hsl(${TEAL})` }}>The question:</strong> What is your organization's judgment worth when it compounds?
            </p>
          </div>
        </div>
      }
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 3: DEPARTMENTAL CONSULTING [APPLY]
// ═══════════════════════════════════════════════════════════════════════════════

function SlideDepartmentGrid() {
  const tracks = [
    { icon: <Briefcase size={28} />, color: ACCENT, title: "Sales & GTM",
      line: "Scale your best closer's strategies as infrastructure" },
    { icon: <Code size={28} />, color: TEAL, title: "Product & Engineering",
      line: "Protect architectural intent from prompt to production" },
    { icon: <Landmark size={28} />, color: GOLD, title: "Strategy & Leadership",
      line: "Build the Executive Control Tower for agentic governance" },
    { icon: <Scale size={28} />, color: PURPLE, title: "Finance & Risk",
      line: "Automate narrative, enforce control with Guardrail Agents" },
    { icon: <Factory size={28} />, color: RED, title: "Operations & Supply Chain",
      line: "Turn dead SOPs into executable, living knowledge" },
    { icon: <Users size={28} />, color: TEAL, title: "HR & Talent Management",
      line: "Scale cultural DNA and codify institutional empathy" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Chip color={GOLD}>Apply Phase</Chip>
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 58, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Departmental Operating Model Design
        </h2>
        <p className="mb-3" style={{ fontSize: 23, color: `hsl(${MUT})` }}>
          Half-day consulting deep-dives. Every implementation is precision-tailored to your department's reality.
        </p>
        <p className="mb-8" style={{ fontSize: 19, color: `hsl(${ACCENT})` }}>
          3-step process: Map the "Mindflow" → Codify the Instruction Set → Deploy the Agentic Workflow
        </p>

        <div className="grid grid-cols-3 gap-5">
          {tracks.map(({ icon, color, title, line }) => (
            <div key={title} className="rounded-xl border p-6 flex items-start gap-4 relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{icon}</div>
              <div>
                <p className="font-bold mb-1" style={{ fontSize: 24, color: `hsl(${C})` }}>{title}</p>
                <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

function SlideTrackSales() {
  return (
    <TrackDeepDive
      chipColor={ACCENT}
      icon={<Briefcase size={24} />}
      title="Sales & GTM"
      subtitle="Scaling the Consultative Edge"
      challenge={<>The <strong style={{ color: `hsl(${C})` }}>"Consistency Crisis"</strong> — top reps win on nuance; the rest rely on generic AI outreach. From deal qualification to account management to proposal cycles, <strong style={{ color: `hsl(${C})` }}>the entire revenue engine lacks codified strategy</strong>.</>}
      transformation={<>Turn your best performers' unwritten strategies into <strong style={{ color: `hsl(${C})` }}>scalable infrastructure</strong> across the full customer lifecycle — from first contact to long-term account growth.</>}
      implementations={[
        { title: "Deal Qualification Gatekeeper", desc: "MEDDPICC enforcement as an active agent — not a checklist" },
        { title: "Account Management Playbooks", desc: "Codified relationship strategies, renewal workflows, and expansion triggers" },
        { title: "Proposal Generation Engine", desc: "Proprietary value prop + compliance guardrails baked into every output" },
      ]}
    />
  );
}

function SlideTrackProduct() {
  return (
    <TrackDeepDive
      chipColor={TEAL}
      icon={<Code size={24} />}
      title="Product & Engineering"
      subtitle="Protecting Architectural Intent"
      challenge={<>Application Lifecycle Management is broken. Strategic intent evaporates between requirements and code. <strong style={{ color: `hsl(${C})` }}>"Vibe coding"</strong> with generic Copilots generates technical debt at scale.</>}
      transformation={<>Governing the <strong style={{ color: `hsl(${C})` }}>full ALM pipeline</strong>, from requirement analysis to the last piece of code, with context-aware AI that carries architectural intent through every stage.</>}
      implementations={[
        { title: "Requirements Traceability Engine", desc: "Ensuring strategic intent flows from business requirements through architecture into implementation without loss" },
        { title: "Stakeholder Communication Governance", desc: "Codified review and approval workflows that maintain alignment between business and engineering teams" },
        { title: "ALM Drift Detection", desc: "Continuous monitoring of requirement coverage, change impact, and architectural decision compliance across the full lifecycle" },
      ]}
    />
  );
}

function SlideTrackStrategy() {
  return (
    <TrackDeepDive
      chipColor={GOLD}
      icon={<Landmark size={24} />}
      title="Strategy & Leadership"
      subtitle="Governing the Agentic Organization"
      challenge={<>Leaders lack the systems to govern an AI-native organization. <strong style={{ color: `hsl(${C})` }}>How do you implement improvement, transformation, and innovation initiatives</strong> when every department runs agentic workflows?</>}
      transformation={<>Building the <strong style={{ color: `hsl(${C})` }}>"Executive Control Tower"</strong> — connecting departmental AI implementations into a unified value tree from vision to initiative execution.</>}
      implementations={[
        { title: "Scenario Builder & Strategy Radar", desc: "Stress-test strategic decisions and model future skill alignment across the organization" },
        { title: "Cross-Department Value Tree", desc: "How all departmental AI implementations connect — from top-level vision down to initiative execution" },
        { title: "Execution Drift Radar", desc: "Real-time monitoring of strategic initiative alignment across all agentic workflows" },
      ]}
    />
  );
}

function SlideTrackFinance() {
  return (
    <TrackDeepDive
      chipColor={PURPLE}
      icon={<Scale size={24} />}
      title="Finance & Risk"
      subtitle="Automating Narrative, Enforcing Control"
      challenge={<>Finance spends <strong style={{ color: `hsl(${C})` }}>80% of time aggregating data</strong>. Commodity AI hallucinates numbers or fails to apply strict internal policy constraints.</>}
      transformation={<>Building <strong style={{ color: `hsl(${C})` }}>"Guardrail Agents"</strong> with hard-coded reporting standards. AI that generates within your exact compliance framework.</>}
      implementations={[
        { title: "Customized Based on Need", desc: "Finance implementations are precision-tailored to your specific reporting, compliance, and governance requirements" },
      ]}
    />
  );
}

function SlideTrackOperations() {
  return (
    <TrackDeepDive
      chipColor={RED}
      icon={<Factory size={24} />}
      title="Operations & Supply Chain"
      subtitle="From Dead SOPs to Active Infrastructure"
      challenge={<>SOPs live in <strong style={{ color: `hsl(${C})` }}>static PDFs that nobody reads</strong> during a crisis. Incident resolution is inconsistent and relies on tribal knowledge.</>}
      transformation={<>Turning passive documentation into <strong style={{ color: `hsl(${C})` }}>"Executable Knowledge"</strong> that sits inside the operator's workflow — active during the moment of need.</>}
      implementations={[
        { title: "Incident Response Orchestration", desc: "Step-by-step guided resolution with real-time context injection" },
        { title: "Dynamic Capacity Planning", desc: "Scenario simulation with codified operational constraints" },
        { title: "Supplier Risk Assessment Engine", desc: "Continuous monitoring with automated alert escalation protocols" },
      ]}
    />
  );
}

function SlideTrackHR() {
  return (
    <TrackDeepDive
      chipColor={TEAL}
      icon={<Users size={24} />}
      title="HR & Talent Management"
      subtitle="Scaling Cultural DNA"
      challenge={<>Organizational culture is <strong style={{ color: `hsl(${C})` }}>trapped in the heads of senior leaders</strong>. Onboarding is inconsistent, and institutional empathy doesn't scale with headcount.</>}
      transformation={<>Codifying your organization's <strong style={{ color: `hsl(${C})` }}>cultural values, decision principles, and institutional knowledge</strong> into AI-governed onboarding and development systems.</>}
      implementations={[
        { title: "AI-Governed Onboarding Accelerator", desc: "New hires onboard through codified organizational context, not PowerPoint" },
        { title: "System Designer Identification", desc: "Assessment framework for mapping workforce transition readiness" },
        { title: "Cultural DNA Playbooks", desc: "Codified values and decision principles that govern all AI interactions" },
      ]}
    />
  );
}

function SlideValueTree() {
  const departments = [
    { icon: <Briefcase size={20} />, color: ACCENT, title: "Sales & GTM", output: "Deal intelligence, account playbooks" },
    { icon: <Code size={20} />, color: TEAL, title: "Product & Eng", output: "ALM governance, architectural intent" },
    { icon: <Scale size={20} />, color: PURPLE, title: "Finance & Risk", output: "Guardrail agents, compliance frameworks" },
    { icon: <Factory size={20} />, color: RED, title: "Operations", output: "Executable SOPs, incident protocols" },
    { icon: <Users size={20} />, color: TEAL, title: "HR & Talent", output: "Cultural DNA, onboarding systems" },
  ];

  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={GOLD}>The Bigger Picture</Chip>
          <h2 className="font-black mt-5 mb-3" style={{ fontSize: 52, color: `hsl(${C})`, lineHeight: 1.1 }}>
            From Vision to Execution:
            <br /><span style={{ color: `hsl(${GOLD})` }}>The Value Tree</span>
          </h2>
          <p className="mb-6" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
            Each department doesn't operate in isolation. When implemented together, they form a <strong style={{ color: `hsl(${C})` }}>unified value tree</strong> — from top-level strategic vision down to agentic initiative execution.
          </p>

          <div className="rounded-xl p-5 mb-4" style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.2)` }}>
            <p className="font-bold mb-2" style={{ fontSize: 19, color: `hsl(${GOLD})` }}>Why This Matters</p>
            <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              This is how you turn an AI-native organization into a <strong style={{ color: `hsl(${C})` }}>governed operating model</strong> — where improvement, transformation, and innovation initiatives are traceable from boardroom decisions to frontline execution.
            </p>
          </div>
        </div>

        <div className="w-[560px] flex-shrink-0">
          <div className="rounded-2xl border p-7 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${GOLD} / 0.3)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${GOLD})` }} />

            {/* Vision */}
            <div className="rounded-xl p-4 mb-4 text-center" style={{ background: `hsl(${GOLD} / 0.1)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
              <Landmark size={24} style={{ color: `hsl(${GOLD})`, margin: "0 auto 8px" }} />
              <p className="font-black" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>Strategic Vision & Leadership</p>
              <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>Executive Control Tower</p>
            </div>

            <div className="flex justify-center mb-3">
              <ArrowDown size={20} style={{ color: `hsl(${GOLD} / 0.5)` }} />
            </div>

            {/* Departments */}
            <div className="space-y-2 mb-4">
              {departments.map(({ icon, color, title, output }) => (
                <div key={title} className="flex items-center gap-3 rounded-lg px-4 py-2" style={{ background: `hsl(${color} / 0.06)`, border: `1px solid hsl(${color} / 0.15)` }}>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold" style={{ fontSize: 15, color: `hsl(${C})` }}>{title}</p>
                    <p style={{ fontSize: 13, color: `hsl(${MUT})` }}>{output}</p>
                  </div>
                  <ArrowRight size={14} style={{ color: `hsl(${color} / 0.4)`, flexShrink: 0 }} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-3">
              <ArrowDown size={20} style={{ color: `hsl(${TEAL} / 0.5)` }} />
            </div>

            {/* Execution */}
            <div className="rounded-xl p-4 text-center" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
              <p className="font-bold" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>Governed Agentic Execution</p>
              <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>Traceable from vision → initiative → workflow → outcome</p>
            </div>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 4: PLATFORM & DELIVERABLES
// ═══════════════════════════════════════════════════════════════════════════════

function SlideAnchor() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        <div className="flex-1">
          <Chip color={PURPLE}>Anchor · Platform</Chip>
          <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.1 }}>
            The Simulation
            <br />
            <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Environment
            </span>
          </h2>
          <p className="mb-8" style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            Standard AI tools operate as "black boxes." You cannot effectively teach Context Engineering when the
            system hides how memory and organizational rules are applied. <strong style={{ color: `hsl(${C})` }}>LIZA OS</strong> is purpose-built to make this transparent — every rule, every context layer, every decision is visible and governable.
          </p>

          <div className="space-y-4">
            {[
              "Teams see exactly how extracting their 'Mindflow' into a rule changes AI behavior instantly",
              "Managed, isolated environment — zero IT overhead, browser-based",
              "Everything built during training becomes your operational starter kit",
              "Architectural principles learned here transfer to any internal system",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <CheckCircle2 size={20} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[580px] flex-shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              style={{ background: `hsl(${DARK})`, minHeight: 300 }}>
              <div className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center" style={{ background: "hsl(0 0% 20%)" }}>
                <Lock size={28} style={{ color: "hsl(0 0% 50%)" }} />
              </div>
              <p className="font-bold mb-2" style={{ fontSize: 22, color: "hsl(0 0% 60%)" }}>Standard AI / Copilot</p>
              <p style={{ fontSize: 16, color: "hsl(0 0% 40%)", lineHeight: 1.4 }}>
                Hidden context. No visibility into rules. No organizational memory.
              </p>
            </div>

            <div className="rounded-2xl border p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={{ background: `hsl(${ACCENT} / 0.06)`, borderColor: `hsl(${ACCENT} / 0.3)`, minHeight: 300 }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, hsl(${ACCENT}), hsl(${TEAL}))` }} />
              <div className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center" style={{ background: `hsl(${ACCENT} / 0.15)` }}>
                <Layers size={28} style={{ color: `hsl(${ACCENT})` }} />
              </div>
              <p className="font-bold mb-2" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>LIZA OS Context Engine</p>
              <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.4 }}>
                Transparent layers. Visible rules. Organizational DNA encoded.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
            <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              <strong style={{ color: `hsl(${TEAL})` }}>What stays with you:</strong> All knowledge assets, playbooks, and
              organizational context built during the program remain yours.
            </p>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function SlideDeliverables() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="What You Walk Away With" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Not just a report.
          <br /><span style={{ color: `hsl(${ACCENT})` }}>A running system.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: `hsl(${MUT})` }}>
          Three tangible deliverables that outlast the engagement.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: <BarChart3 size={28} />, color: ACCENT, title: "AI-Native Maturity Report",
              items: [
                "Comprehensive executive diagnostic per department",
                "Cultural friction points mapped",
                "Prioritized roadmap with immediate next steps",
              ] },
            { icon: <Users size={28} />, color: TEAL, title: 'Identified "System Designers"',
              items: [
                "Mapped cohort of internal talent equipped to lead",
                "Role transition recommendations",
                "Training path for continued development",
              ] },
            { icon: <BookOpen size={28} />, color: GOLD, title: "Codified Playbooks",
              items: [
                "Context Bundles built during departmental workshops",
                "Instruction Sets ready for deployment",
                "Operational starter kit in LIZA OS",
              ] },
          ].map(({ icon, color, title, items }) => (
            <div key={title} className="rounded-2xl border p-8 relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div className="flex items-center gap-3 mb-5">
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
                <p className="font-bold" style={{ fontSize: 23, color: `hsl(${color})` }}>{title}</p>
              </div>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item}</p>
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

function SlidePricing() {
  const tiers = [
    { color: ACCENT, title: "Sprint", duration: "3 Days", price: "€10,500",
      items: ["Foundation Keynote (1 day)", "1 Departmental Track (half-day)", "AI Maturity Diagnostic", "LIZA OS sandbox access"],
      label: "Ideal for leadership off-sites" },
    { color: TEAL, title: "Program", duration: "5–7 Days", price: "€17,500 – €24,500",
      items: ["Full Foundation Curriculum", "3 Departmental Tracks", "Maturity Report + System Designer mapping", "LIZA OS environment + starter kit"],
      label: "Most popular", highlight: true },
    { color: GOLD, title: "Transformation", duration: "Quarterly Retainer", price: "Custom",
      items: ["Everything in Program", "All 6 Departmental Tracks", "Ongoing Anchor phase support", "Quarterly progress reviews + iteration"],
      label: "Full organizational rollout" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Engagement Models" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Modular scope.
          <br /><span style={{ color: `hsl(${ACCENT})` }}>Transparent investment.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: `hsl(${MUT})` }}>
          Standard unit: <strong style={{ color: `hsl(${C})` }}>€3,500 / day</strong>. Choose the shape that fits your timeline.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {tiers.map(({ color, title, duration, price, items, label, highlight }) => (
            <div key={title} className="rounded-2xl border p-8 flex flex-col relative overflow-hidden"
              style={{
                background: highlight ? `hsl(${color} / 0.06)` : BG2,
                borderColor: `hsl(${color} / ${highlight ? 0.4 : 0.25})`,
                ...(highlight ? { boxShadow: `0 0 0 1px hsl(${color} / 0.2)` } : {}),
              }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              {highlight && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full font-bold"
                  style={{ fontSize: 13, background: `hsl(${color} / 0.15)`, color: `hsl(${color})` }}>Most Popular</span>
              )}
              <p className="font-black mb-1" style={{ fontSize: 32, color: `hsl(${C})` }}>{title}</p>
              <p className="font-semibold mb-1" style={{ fontSize: 18, color: `hsl(${color})` }}>{duration}</p>
              <p className="font-black mb-5" style={{ fontSize: 36, color: `hsl(${C})` }}>{price}</p>

              <div className="space-y-2 flex-1">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 pt-4 border-t text-center" style={{ fontSize: 16, color: `hsl(${color})`, borderColor: `hsl(${color} / 0.2)` }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

function SlideProofPoint() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Proven in Practice" color={TEAL} />
        <h2 className="font-black mb-10" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          From theory to measurable impact.
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-2xl border p-10 relative overflow-hidden"
            style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${TEAL})` }} />
            <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
              Case: European Professional Services Firm
            </p>
            <p className="font-black mb-5" style={{ fontSize: 28, color: `hsl(${C})` }}>
              "We went from 4 hours of proposal prep to 45 minutes — and the quality improved."
            </p>
            <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.6, marginBottom: 20 }}>
              A mid-market consulting firm deployed the Sales & GTM track.
              Within 3 weeks, the team had codified their top partner's deal qualification methodology
              into a persistent Context Bundle — eliminating the "blank page" problem for junior consultants.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { stat: "82%", label: "Faster proposal first draft" },
                { stat: "3x", label: "More proposals per consultant/week" },
                { stat: "40%", label: "Higher win rate on qualified deals" },
              ].map(({ stat, label }) => (
                <div key={label} className="text-center">
                  <p className="font-black" style={{ fontSize: 36, color: `hsl(${TEAL})` }}>{stat}</p>
                  <p style={{ fontSize: 15, color: `hsl(${MUT})` }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border p-8" style={{ background: BG2, borderColor: `hsl(${ACCENT} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>Executive Education</p>
              <div className="space-y-2">
                {[
                  { name: "BGE Budapest", desc: "Executive AI Transformation Program" },
                  { name: "University of Vienna", desc: "Guest Lecture Series: AI-Native Organizations" },
                  { name: "University of Lviv", desc: "Applied AI & Knowledge Engineering Workshop" },
                ].map(({ name, desc }) => (
                  <div key={name} className="flex items-center gap-3">
                    <GraduationCap size={18} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
                    <div>
                      <p className="font-bold" style={{ fontSize: 17, color: `hsl(${C})` }}>{name}</p>
                      <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: `1px solid hsl(${TEAL} / 0.2)` }}>
                <p className="font-bold mb-3" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>Consulting Clients</p>
                <div className="space-y-2">
                  {[
                    { name: "aliz.ai", desc: "Data & AI professional services firm" },
                  ].map(({ name, desc }) => (
                    <div key={name} className="flex items-center gap-3">
                      <Briefcase size={18} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />
                      <div>
                        <p className="font-bold" style={{ fontSize: 17, color: `hsl(${C})` }}>{name}</p>
                        <p style={{ fontSize: 14, color: `hsl(${MUT})` }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 mt-2">
                    <Lock size={18} style={{ color: `hsl(${MUT} / 0.5)`, flexShrink: 0 }} />
                    <p style={{ fontSize: 15, color: `hsl(${MUT})`, fontStyle: "italic" }}>Additional clients: Confidential</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-8 flex-1" style={{ background: BG2, borderColor: `hsl(${GOLD} / 0.2)` }}>
              <p className="font-bold mb-4" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>By the Numbers</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "200+", label: "Consulting engagements" },
                  { n: "15+", label: "Years transformation" },
                  { n: "8", label: "Countries" },
                  { n: "3", label: "University programs" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <p className="font-black" style={{ fontSize: 32, color: `hsl(${GOLD})` }}>{n}</p>
                    <p style={{ fontSize: 16, color: `hsl(${MUT})` }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Team Slide (UPDATED) ─────────────────────────────────────────────────────

function SlideTeam() {
  const team = [
    {
      name: "István Boscha", role: "Product Vision & Capital-Efficient CEO",
      bio: "15 years in global AI transformation. Founder of a Google Cloud Professional Services Partner firm. Architect of LIZA OS.",
      photo: istvanPhoto, color: ACCENT,
    },
    {
      name: "Kristóf Éger", role: "Enterprise Narrative & Go-to-Market",
      bio: "AI business strategist and executive coach. Embedding AI into decision workflows across enterprise consulting engagements.",
      photo: kristofPhoto, color: TEAL,
    },
    {
      name: "Zoltán Kauker", role: "Scalable AI Architecture & Enterprise Security",
      bio: "Deep-tech AI and data engineering expert. Leading AI-driven decision systems with enterprise-grade security.",
      photo: zoltanPhoto, color: GOLD,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Your Transformation Partners" />
        <h2 className="font-black mb-3" style={{ fontSize: 60, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Program designed and led by
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})` }}>
          Practitioners, not theorists.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {team.map((p) => (
            <div key={p.name} className="rounded-2xl border p-7 flex flex-col gap-5 relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${p.color} / 0.3)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${p.color})` }} />
              <div className="flex items-center gap-4">
                <img src={p.photo} alt={p.name} className="w-16 h-16 rounded-full object-cover shrink-0"
                  style={{ border: `2px solid hsl(${p.color} / 0.4)` }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 24, color: `hsl(${C})` }}>{p.name}</p>
                  <p className="font-semibold" style={{ fontSize: 17, color: `hsl(${p.color})` }}>{p.role}</p>
                </div>
              </div>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{p.bio}</p>
            </div>
          ))}
        </div>

        <div className="px-8 py-5 rounded-xl border flex items-center gap-4" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <Users size={22} style={{ color: `hsl(${ACCENT})` }} />
          <p style={{ fontSize: 21, color: `hsl(${MUT})` }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>Supported by additional specialist consultants</strong> depending on engagement scope and departmental focus areas.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

function SlideNextSteps() {
  const steps = [
    { n: "01", title: "Align on engagement shape", desc: "Confirm the Sprint, Program, or Transformation model that fits your timeline and ambition.", color: ACCENT },
    { n: "02", title: "Select target departments", desc: "Choose the initial departments for Phase 1 based on strategic priority and readiness.", color: TEAL },
    { n: "03", title: "Deploy the Diagnostic", desc: "Roll out the AI Execution Maturity Diagnostic to participants ahead of the engagement.", color: GOLD },
    { n: "04", title: "Schedule the Keynote", desc: "Set the date for the Foundation Keynote that kicks off the transformation journey.", color: PURPLE },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Next Steps" />
        <h2 className="font-black mb-10" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Initiating the partnership.
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {steps.map(({ n, title, desc, color }) => (
            <div key={n} className="flex items-start gap-5 rounded-2xl border p-7"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.2)` }}>
              <span className="font-black flex-shrink-0" style={{ fontSize: 52, lineHeight: 1, color: `hsl(${color} / 0.25)` }}>{n}</span>
              <div>
                <p className="font-bold mb-2" style={{ fontSize: 26, color: `hsl(${C})` }}>{title}</p>
                <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p style={{ fontSize: 22, color: `hsl(${MUT})` }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>kristof.eger@lizaos.ai</strong>
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDES ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

const SLIDES = [
  // Part 1: Strategic Wedge
  { id: 1, title: "Title", component: <Slide01Title /> },
  { id: 2, title: "The Infrastructure Gap", component: <Slide02InfraGap /> },
  { id: 3, title: "Context Starvation", component: <Slide03ContextStarvation /> },
  { id: 4, title: "The Workforce Spectrum", component: <Slide04Transformation /> },
  { id: 5, title: "The Journey", component: <Slide05Journey /> },
  // Part 2: Curriculum
  { id: 6, title: "Part 2: Training", component: <PartDivider part="Part 2 · Align" title="The Training Curriculum" color={TEAL} activePhase="align" /> },
  { id: 7, title: "Curriculum Overview", component: <SlideCurriculumOverview /> },
  { id: 8, title: "Module 1: Execution Gap", component: <SlideModule1 /> },
  { id: 9, title: "Module 2: Human Engine", component: <SlideModule2 /> },
  { id: 10, title: "Module 3: Active Context", component: <SlideModule3 /> },
  { id: 11, title: "Module 4: Safe Infrastructure", component: <SlideModule4 /> },
  { id: 12, title: "Module 5: AI-Native Business", component: <SlideModule5 /> },
  // Part 3: Departmental Consulting
  { id: 13, title: "Part 3: Consulting", component: <PartDivider part="Part 3 · Apply" title="Departmental Consulting" color={GOLD} activePhase="apply" /> },
  { id: 14, title: "Department Tracks", component: <SlideDepartmentGrid /> },
  { id: 15, title: "Track: Sales & GTM", component: <SlideTrackSales /> },
  { id: 16, title: "Track: Product & Eng", component: <SlideTrackProduct /> },
  { id: 17, title: "Track: Strategy", component: <SlideTrackStrategy /> },
  { id: 18, title: "Track: Finance & Risk", component: <SlideTrackFinance /> },
  { id: 19, title: "Track: Operations", component: <SlideTrackOperations /> },
  { id: 20, title: "Track: HR & Talent", component: <SlideTrackHR /> },
  { id: 21, title: "The Value Tree", component: <SlideValueTree /> },
  // Part 4: Platform & Deliverables
  { id: 22, title: "Part 4: Anchor", component: <PartDivider part="Part 4 · Anchor" title="Platform & Deliverables" color={PURPLE} activePhase="anchor" /> },
  { id: 23, title: "The Simulation Environment", component: <SlideAnchor /> },
  { id: 24, title: "Deliverables", component: <SlideDeliverables /> },
  { id: 25, title: "Engagement & Pricing", component: <SlidePricing /> },
  { id: 26, title: "Proven in Practice", component: <SlideProofPoint /> },
  { id: 27, title: "The Team", component: <SlideTeam /> },
  { id: 28, title: "Next Steps", component: <SlideNextSteps /> },
];

// ─── Shell ────────────────────────────────────────────────────────────────────

const CHROME_BG = "hsl(210 18% 97%)";
const CHROME_BORDER = "hsl(214 18% 88%)";

export default function ConsultingTrainingDeck() {
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
    setIsFullscreen(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

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

  useEffect(() => {
    if (!isFullscreen) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => { setShowNav(true); clearTimeout(timer); timer = setTimeout(() => setShowNav(false), 2500); };
    show();
    window.addEventListener("mousemove", show);
    return () => { window.removeEventListener("mousemove", show); clearTimeout(timer); };
  }, [isFullscreen]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: BG }}
        onClick={() => { if (!isPortrait) showMobileControls(); }}>
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
              <ChevronLeft size={32} style={{ color: "hsl(215 15% 42% / 0.5)" }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next slide">
              <ChevronRight size={32} style={{ color: "hsl(215 15% 42% / 0.5)" }} />
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-AI-Native-Organization" slideCount={SLIDES.length} variant="mobile" iconColor={`hsl(${MUT})`} />
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

  const slide = SLIDES[current];

  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-4 h-12 border-b flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>AI-Native Organization Program</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")} style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-AI-Native-Organization" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
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

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Users, BarChart3, Shield, Workflow, GraduationCap,
  Lightbulb, Search, Puzzle, Code, HeartHandshake,
  Briefcase, LineChart, MessageSquare, Rocket, Building2,
  ArrowDown, Factory, Landmark, Scale, Crosshair, Gauge
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

function PartDivider({ part, title, color = ACCENT }: { part: string; title: string; color?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: `hsl(${DARK})` }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
      }} />
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${color}), transparent 70%)` }} />
      <div className="relative z-10 text-center">
        <p className="font-bold tracking-[0.35em] uppercase mb-6"
          style={{ fontSize: 20, color: `hsl(${color})` }}>{part}</p>
        <h2 className="font-black" style={{ fontSize: 80, color: "hsl(0 0% 100%)", lineHeight: 1.1 }}>{title}</h2>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `hsl(${color})` }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1: THE STRATEGIC WEDGE
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 01 — Title ─────────────────────────────────────────────────────────

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

// ─── Slide 02 — The Infrastructure Gap ────────────────────────────────────────

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

// ─── Slide 03 — Context Starvation (Iceberg) ─────────────────────────────────

function Slide03ContextStarvation() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        {/* Left */}
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

        {/* Right — Iceberg visual */}
        <div className="w-[560px] flex-shrink-0 relative" style={{ height: 700 }}>
          {/* Water line */}
          <div className="absolute left-0 right-0" style={{ top: 180, height: 2, background: `hsl(${ACCENT} / 0.3)` }} />
          <p className="absolute right-4 font-mono font-bold" style={{ top: 165, fontSize: 14, color: `hsl(${ACCENT})` }}>WATERLINE</p>

          {/* Above water */}
          <div className="absolute left-[120px] right-[120px] rounded-t-[40px] flex flex-col items-center justify-center"
            style={{ top: 40, height: 140, background: `hsl(${ACCENT} / 0.12)`, border: `1px solid hsl(${ACCENT} / 0.3)`, borderBottom: "none" }}>
            <p className="font-bold text-center" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>The Prompt</p>
            <p style={{ fontSize: 16, color: `hsl(${MUT})` }}>The immediate task</p>
          </div>

          {/* Below water */}
          <div className="absolute left-4 right-4 rounded-b-[60px] flex flex-col items-center justify-center gap-3 px-10"
            style={{ top: 182, bottom: 0, background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.2)`, borderTop: "none" }}>
            <p className="font-bold text-center" style={{ fontSize: 24, color: `hsl(${GOLD})` }}>Missing Context</p>
            {["Organizational DNA", "Brand tone & voice", "Negative constraints", "Historical failures", "Decision frameworks"].map(item => (
              <p key={item} style={{ fontSize: 18, color: `hsl(${MUT})` }}>{item}</p>
            ))}
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 04 — 80/20 Transformation ──────────────────────────────────────────

function Slide04Transformation() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Philosophy" />
        <h2 className="font-black mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          80% Human Mindset.
          <br /><span style={{ color: `hsl(${ACCENT})` }}>20% Tooling.</span>
        </h2>

        <div className="grid grid-cols-2 gap-10">
          {/* System Executors */}
          <div className="rounded-2xl border p-10 relative overflow-hidden" style={{ background: `hsl(${RED} / 0.05)`, borderColor: `hsl(${RED} / 0.2)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${RED} / 0.5)` }} />
            <p className="font-bold mb-2" style={{ fontSize: 18, color: `hsl(${RED})` }}>BEFORE</p>
            <p className="font-black mb-4" style={{ fontSize: 36, color: `hsl(${C})` }}>System Executors</p>
            <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
              Humans performing repetitive tasks, fearing AI will replace their output.
              The bottleneck is <strong style={{ color: `hsl(${C})` }}>manual capacity</strong>.
            </p>
          </div>

          {/* System Designers */}
          <div className="rounded-2xl border p-10 relative overflow-hidden" style={{ background: `hsl(${TEAL} / 0.06)`, borderColor: `hsl(${TEAL} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${TEAL})` }} />
            <p className="font-bold mb-2" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>AFTER</p>
            <p className="font-black mb-4" style={{ fontSize: 36, color: `hsl(${C})` }}>System Designers</p>
            <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
              Humans codifying expert judgment. Leaders designing micro-products and agentic ecosystems.
              The bottleneck is <strong style={{ color: `hsl(${C})` }}>the quality of judgment</strong>.
            </p>
          </div>
        </div>

        <div className="mt-8 px-8 py-5 rounded-xl border" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>Becoming AI-Native isn't about working less.</strong>{" "}
            It's about pushing the human boundary to achieve exponentially higher quality and strategic value.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 05 — The Journey (Assess-Align-Apply-Anchor) ──────────────────────

function Slide05Journey() {
  const phases = [
    { step: "01", icon: <BarChart3 size={36} />, color: ACCENT, title: "Assess", subtitle: "Diagnosis",
      body: "Map operational bottlenecks via our AI Execution Maturity Diagnostic. Quantify readiness per department." },
    { step: "02", icon: <HeartHandshake size={36} />, color: TEAL, title: "Align", subtitle: "Education",
      body: "Shift mindsets through foundational curriculum modules. 5 modules, executive-grade." },
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

// ─── Slide 07 — Curriculum Overview (5 modules on 1 slide) ───────────────────

function Slide07CurriculumOverview() {
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
        <Chip color={TEAL}>Align Phase</Chip>
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, color: `hsl(${C})`, lineHeight: 1.1 }}>
          The Foundation Curriculum
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

// ─── Slide 08 — Curriculum Deep Dive (Module 3 showcase) ─────────────────────

function Slide08CurriculumDeepDive() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        {/* Left */}
        <div className="flex-1">
          <Chip color={GOLD}>Module 3 Deep Dive</Chip>
          <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Active Context:
            <br /><span style={{ color: `hsl(${GOLD})` }}>The End of Prompt Engineering</span>
          </h2>
          <p className="mb-8" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            The most hands-on module. Teams learn our <strong style={{ color: `hsl(${C})` }}>Knowledge Extraction Protocol</strong> — a
            structured method for translating the invisible "how-we-do-things-here" knowledge held by senior staff
            into clear, persistent rules for AI.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>Interactive Sandbox Workshop</p>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                We reverse-engineer frustrating AI failures from participants' real work and build structured
                "Smart Briefs" (Context + Purpose + Constraints) to fix the output permanently.
              </p>
            </div>
            <div className="rounded-xl p-5" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${ACCENT})` }}>What Teams Build</p>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                Their first real "Context Bundle" — a living, executable instruction set that immediately
                improves AI output quality by 40-60% on their own work tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Right — visual */}
        <div className="w-[560px] flex-shrink-0">
          <div className="rounded-2xl border p-8 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${GOLD} / 0.3)` }}>
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
            ].map(({ step, label, desc }, i) => (
              <div key={step} className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${GOLD} / 0.15)`, color: `hsl(${GOLD})`, fontSize: 18, fontWeight: 800 }}>{step}</div>
                <div className="flex-1">
                  <p className="font-bold" style={{ fontSize: 20, color: `hsl(${C})` }}>{label}</p>
                  <p style={{ fontSize: 17, color: `hsl(${MUT})` }}>{desc}</p>
                </div>
                {i < 4 && <ArrowDown size={16} style={{ color: `hsl(${GOLD} / 0.3)`, position: "absolute", right: 40, marginTop: 50 }} />}
              </div>
            ))}

            <div className="mt-4 rounded-lg p-4 flex items-center gap-4" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
              <Gauge size={24} style={{ color: `hsl(${TEAL})` }} />
              <p style={{ fontSize: 18, color: `hsl(${MUT})` }}>
                <strong style={{ color: `hsl(${TEAL})` }}>Typical result:</strong> 40-60% quality improvement on first iteration
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
// PART 3: DEPARTMENTAL CONSULTING [APPLY]
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 10 — Departmental Grid ────────────────────────────────────────────

function Slide10DepartmentGrid() {
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

// ─── Slide 11 — Hero Track: Sales & GTM ──────────────────────────────────────

function Slide11SalesTrack() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <div className="flex items-center gap-3 mb-6">
          <Chip color={ACCENT}>Track Deep Dive</Chip>
          <Briefcase size={24} style={{ color: `hsl(${ACCENT})` }} />
        </div>
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Sales & GTM:
          <br /><span style={{ color: `hsl(${ACCENT})` }}>Scaling the Consultative Edge</span>
        </h2>

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <div className="rounded-2xl border p-8 mb-5" style={{ background: `hsl(${RED} / 0.05)`, borderColor: `hsl(${RED} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 22, color: `hsl(${RED})` }}>The Challenge</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
                The <strong style={{ color: `hsl(${C})` }}>"Consistency Crisis"</strong> — top reps win on nuance;
                the rest rely on generic AI outreach. Margin bleeds in proposal review cycles.
              </p>
            </div>
            <div className="rounded-2xl border p-8" style={{ background: `hsl(${TEAL} / 0.05)`, borderColor: `hsl(${TEAL} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>The Transformation</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
                Turn your best closer's unwritten strategies into <strong style={{ color: `hsl(${C})` }}>scalable infrastructure</strong> that
                every team member operates through.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border p-8 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${ACCENT} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${ACCENT})` }} />
            <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>Typical Implementations</p>
            <div className="space-y-4">
              {[
                { title: "Deal Qualification Gatekeeper", desc: "MEDDPICC enforcement as an active agent — not a checklist" },
                { title: "Proposal Generation Engine", desc: "Proprietary value prop + compliance guardrails baked into every output" },
                { title: "Competitive Positioning Agent", desc: "Win/loss intelligence codified as persistent battle cards" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p className="font-bold" style={{ fontSize: 20, color: `hsl(${C})` }}>{title}</p>
                    <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{desc}</p>
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

// ─── Slide 12 — Hero Track: Product & Engineering ────────────────────────────

function Slide12ProductTrack() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <div className="flex items-center gap-3 mb-6">
          <Chip color={TEAL}>Track Deep Dive</Chip>
          <Code size={24} style={{ color: `hsl(${TEAL})` }} />
        </div>
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Product & Engineering:
          <br /><span style={{ color: `hsl(${TEAL})` }}>Protecting Architectural Intent</span>
        </h2>

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <div className="rounded-2xl border p-8 mb-5" style={{ background: `hsl(${RED} / 0.05)`, borderColor: `hsl(${RED} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 22, color: `hsl(${RED})` }}>The Challenge</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
                Strategic product intent evaporates when translated into execution.
                <strong style={{ color: `hsl(${C})` }}> "Vibe coding"</strong> with generic Copilots generates technical debt at scale.
              </p>
            </div>
            <div className="rounded-2xl border p-8" style={{ background: `hsl(${TEAL} / 0.05)`, borderColor: `hsl(${TEAL} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>The Transformation</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
                Move from flat Jira tickets to <strong style={{ color: `hsl(${C})` }}>context-aware "Smart Briefs"</strong> that carry
                architectural intent, security constraints, and API contracts into every developer interaction.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border p-8 relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${TEAL})` }} />
            <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>Typical Implementations</p>
            <div className="space-y-4">
              {[
                { title: "PRD-to-Code Context Bridges", desc: "Enforce API contracts, security constraints, and design system rules at generation time" },
                { title: '"Critic Agent" Design Reviews', desc: "Automated architectural review against codified team standards" },
                { title: "Sprint Health Intelligence", desc: "Drift detection against product intent — before it reaches production" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${TEAL})`, flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p className="font-bold" style={{ fontSize: 20, color: `hsl(${C})` }}>{title}</p>
                    <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{desc}</p>
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

// ═══════════════════════════════════════════════════════════════════════════════
// PART 4: THE PLATFORM & DELIVERABLES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 14 — Why LIZA OS (Anchor) ─────────────────────────────────────────

function Slide14Anchor() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        {/* Left */}
        <div className="flex-1">
          <Chip color={PURPLE}>Anchor Phase</Chip>
          <h2 className="font-black mt-5 mb-6" style={{ fontSize: 56, color: `hsl(${C})`, lineHeight: 1.1 }}>
            The Simulation
            <br />
            <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Environment
            </span>
          </h2>
          <p className="mb-8" style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            Standard AI tools operate as "black boxes." You cannot effectively teach Context Engineering when the
            system hides how memory and organizational rules are applied.
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

        {/* Right — visual */}
        <div className="w-[580px] flex-shrink-0">
          <div className="grid grid-cols-2 gap-4">
            {/* Black box */}
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

            {/* Transparent */}
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

// ─── Slide 15 — Deliverables ──────────────────────────────────────────────────

function Slide15Deliverables() {
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

// ─── Slide 16 — Engagement Tiers & Pricing ───────────────────────────────────

function Slide16Pricing() {
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

// ─── Slide 17 — Proof Point ──────────────────────────────────────────────────

function Slide17ProofPoint() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Proven in Practice" color={TEAL} />
        <h2 className="font-black mb-10" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          From theory to measurable impact.
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Case study */}
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

          {/* Credentials */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border p-8" style={{ background: BG2, borderColor: `hsl(${ACCENT} / 0.2)` }}>
              <p className="font-bold mb-4" style={{ fontSize: 22, color: `hsl(${ACCENT})` }}>Delivered At</p>
              <div className="space-y-3">
                {[
                  { name: "BGE Budapest", desc: "Executive AI Transformation Program" },
                  { name: "University of Vienna", desc: "Guest Lecture Series: AI-Native Organizations" },
                  { name: "University of Lviv", desc: "Applied AI & Knowledge Engineering Workshop" },
                ].map(({ name, desc }) => (
                  <div key={name} className="flex items-center gap-3">
                    <Award size={20} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
                    <div>
                      <p className="font-bold" style={{ fontSize: 19, color: `hsl(${C})` }}>{name}</p>
                      <p style={{ fontSize: 16, color: `hsl(${MUT})` }}>{desc}</p>
                    </div>
                  </div>
                ))}
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

// ─── Slide 18 — The Team ──────────────────────────────────────────────────────

function Slide18Team() {
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
        <h2 className="font-black mb-10" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Practitioners, not theorists.
        </h2>

        <div className="grid grid-cols-3 gap-6">
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
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 19 — Next Steps ────────────────────────────────────────────────────

function Slide19NextSteps() {
  const steps = [
    { n: "01", title: "Align on engagement shape", desc: "Confirm the Sprint, Program, or Transformation model that fits your timeline and ambition.", color: ACCENT },
    { n: "02", title: "Select target departments", desc: "Choose the initial departments for Phase 1 based on strategic priority and readiness.", color: TEAL },
    { n: "03", title: "Deploy the Diagnostic", desc: "Roll out the AI Execution Maturity Diagnostic to participants before training begins.", color: GOLD },
    { n: "04", title: "Schedule the Foundation", desc: "Kick off with the company-wide keynote to establish the shared vocabulary.", color: PURPLE },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <GridBg />
      <div className="absolute w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 text-center px-40 max-w-[1500px]">
        <Tag label="Next Steps" />
        <h2 className="font-black mb-4" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Initiating the Partnership
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: `hsl(${MUT})` }}>
          Four clear steps to move from conversation to transformation.
        </p>

        <div className="grid grid-cols-4 gap-5 mb-12 text-left">
          {steps.map(({ n, title, desc, color }) => (
            <div key={n} className="rounded-2xl border p-7 flex flex-col gap-4 relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.3)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <span className="font-black" style={{ fontSize: 40, color: `hsl(${color} / 0.3)`, lineHeight: 1 }}>{n}</span>
              <p className="font-bold" style={{ fontSize: 24, color: `hsl(${C})` }}>{title}</p>
              <p style={{ fontSize: 19, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9" target="_blank" rel="noopener noreferrer"
            className="px-10 py-5 rounded-2xl border font-bold inline-block hover:opacity-90 transition-opacity"
            style={{ fontSize: 28, background: `hsl(${ACCENT} / 0.15)`, borderColor: `hsl(${ACCENT} / 0.4)`, color: `hsl(${ACCENT})` }}>
            Book a Discovery Call
          </a>
          <span style={{ fontSize: 22, color: `hsl(${MUT})` }}>kristof.eger@lizaos.ai</span>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  // Part 1: The Strategic Wedge
  { id: 1, title: "Title", component: <Slide01Title /> },
  { id: 2, title: "The Infrastructure Gap", component: <Slide02InfraGap /> },
  { id: 3, title: "Context Starvation", component: <Slide03ContextStarvation /> },
  { id: 4, title: "80/20 Transformation", component: <Slide04Transformation /> },
  { id: 5, title: "The Journey", component: <Slide05Journey /> },
  // Part 2: The Curriculum
  { id: 6, title: "Part 2: The Curriculum", component: <PartDivider part="Part 2" title="The Curriculum" color={TEAL} /> },
  { id: 7, title: "Curriculum Overview", component: <Slide07CurriculumOverview /> },
  { id: 8, title: "Deep Dive: Active Context", component: <Slide08CurriculumDeepDive /> },
  // Part 3: Departmental Consulting
  { id: 9, title: "Part 3: Consulting", component: <PartDivider part="Part 3" title="Departmental Consulting" color={GOLD} /> },
  { id: 10, title: "Department Tracks", component: <Slide10DepartmentGrid /> },
  { id: 11, title: "Track: Sales & GTM", component: <Slide11SalesTrack /> },
  { id: 12, title: "Track: Product & Eng", component: <Slide12ProductTrack /> },
  // Part 4: Platform & Deliverables
  { id: 13, title: "Part 4: Anchor", component: <PartDivider part="Part 4" title="Platform & Deliverables" color={PURPLE} /> },
  { id: 14, title: "The Simulation Environment", component: <Slide14Anchor /> },
  { id: 15, title: "Deliverables", component: <Slide15Deliverables /> },
  { id: 16, title: "Engagement & Pricing", component: <Slide16Pricing /> },
  { id: 17, title: "Proven in Practice", component: <Slide17ProofPoint /> },
  { id: 18, title: "The Team", component: <Slide18Team /> },
  { id: 19, title: "Next Steps", component: <Slide19NextSteps /> },
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

  // ─── Mobile controls auto-hide ──────────────────────────────────────
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

  // ─── Mobile view ────────────────────────────────────────────────────
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

  // ─── Fullscreen ─────────────────────────────────────────────────────
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

  // ─── Grid view ──────────────────────────────────────────────────────
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

  // ─── Default ────────────────────────────────────────────────────────
  const slide = SLIDES[current];

  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      {/* Toolbar */}
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
        {/* Sidebar thumbnails */}
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

        {/* Main canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 overflow-hidden">
          <div className="w-full max-w-6xl" style={{ aspectRatio: "16/9" }}>
            <ScaledSlide>{slide.component}</ScaledSlide>
          </div>

          {/* Bottom controls */}
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

      {/* Export container */}
      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}

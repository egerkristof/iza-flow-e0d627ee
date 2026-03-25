import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Users, BarChart3, Shield, Workflow, GraduationCap,
  Lightbulb, Search, Puzzle, Code, HeartHandshake,
  Briefcase, LineChart, MessageSquare, Rocket, Building2
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

function GridBg() {
  return (
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `linear-gradient(hsl(215 15% 40%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 40%) 1px, transparent 1px)`,
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
            Executive Education & Transformation
          </span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 96, lineHeight: 1.0, color: `hsl(${C})` }}>
          Architecting the
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organization
          </span>
        </h1>

        <p style={{ fontSize: 32, color: `hsl(${MUT})`, maxWidth: 1000, lineHeight: 1.55 }}>
          Executive education & operational transformation.
          <br />
          <strong style={{ color: `hsl(${C})` }}>80% preparing humans for their new role. 20% mastering the tools.</strong>
        </p>

        <div className="mt-14 flex items-center gap-6">
          <Chip color={ACCENT}>Assess</Chip>
          <ArrowRight size={20} style={{ color: `hsl(${MUT} / 0.4)` }} />
          <Chip color={TEAL}>Align</Chip>
          <ArrowRight size={20} style={{ color: `hsl(${MUT} / 0.4)` }} />
          <Chip color={GOLD}>Apply</Chip>
        </div>

        <p className="mt-10" style={{ fontSize: 20, color: `hsl(${MUT} / 0.6)` }}>
          Delivered by Aliz / LizaOS
        </p>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 02 — The Execution Gap ─────────────────────────────────────────────

function Slide02Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Core Problem" color={RED} />
        <h2 className="font-black mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Everyone has AI.
          <br />
          <span style={{ color: `hsl(${RED})` }}>Very few have an AI Operating System.</span>
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-2xl border p-10" style={{ background: `hsl(${RED} / 0.08)`, borderColor: `hsl(${RED} / 0.25)` }}>
            <div className="flex items-center gap-4 mb-5">
              <AlertTriangle size={36} style={{ color: `hsl(${RED})` }} />
              <p className="font-bold" style={{ fontSize: 28, color: `hsl(${RED})` }}>The Symptom: The Consistency Crisis</p>
            </div>
            <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
              Rapid AI adoption without shared standards amplifies existing ambiguity.
              Vague instructions passed to AI result in <strong style={{ color: `hsl(${C})` }}>wildly inconsistent outputs</strong> across your team.
            </p>
          </div>

          <div className="rounded-2xl border p-10" style={{ background: `hsl(${GOLD} / 0.08)`, borderColor: `hsl(${GOLD} / 0.25)` }}>
            <div className="flex items-center gap-4 mb-5">
              <Brain size={36} style={{ color: `hsl(${GOLD})` }} />
              <p className="font-bold" style={{ fontSize: 28, color: `hsl(${GOLD})` }}>The Root Cause: Context Starvation</p>
            </div>
            <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
              When AI fails in business, it's rarely a technical limitation.
              It's <strong style={{ color: `hsl(${C})` }}>starving for the tacit knowledge</strong> and unwritten rules
              your best people hold in their heads.
            </p>
          </div>
        </div>

        <div className="mt-8 px-8 py-5 rounded-xl border" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>The era of basic "Prompt Engineering" is over.</strong>{" "}
            The future is an Operating Model built on Continuous Context Engineering.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 03 — Outcomes ──────────────────────────────────────────────────────

function Slide03Outcomes() {
  const outcomes = [
    {
      icon: <Shield size={44} />, color: ACCENT,
      title: "Eradicate AI Anxiety",
      body: "Dismantle the false \"AI vs. Me\" paradigm. Shift your team from fearing replacement to stepping up as the System Designers who govern AI.",
    },
    {
      icon: <Search size={44} />, color: TEAL,
      title: "Identify Your \"Architects\"",
      body: "Map and identify the specific talent profiles in your organization who possess the systems-thinking required to lead the AI-native era.",
    },
    {
      icon: <Code size={44} />, color: GOLD,
      title: "Deploy \"Knowledge as Code\"",
      body: "Transition from executing one-off prompts in isolated silos to collaboratively engineering continuous context — turning judgment into scalable assets.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="What This Program Achieves" />
        <h2 className="font-black mb-4" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          The 80/20 Transformation
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: `hsl(${MUT})` }}>
          80% preparing the human for their new role. 20% mastering the tools.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {outcomes.map(({ icon, color, title, body }) => (
            <div key={title} className="rounded-2xl border p-8 flex flex-col gap-5 relative overflow-hidden"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold" style={{ fontSize: 30, color: `hsl(${C})` }}>{title}</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 04 — Methodology ───────────────────────────────────────────────────

function Slide04Methodology() {
  const pillars = [
    {
      step: "01", icon: <BarChart3 size={36} />, color: ACCENT,
      title: "Assess", subtitle: "Organizational Diagnosis",
      body: "We deploy our AI Execution Maturity Diagnostic across your departments to map actual operational bottlenecks and capture real data before training begins.",
    },
    {
      step: "02", icon: <HeartHandshake size={36} />, color: TEAL,
      title: "Align", subtitle: "Mindset & Coaching",
      body: "Grounded in Cognitive Architecture and Decision Systems Design. Executive and team coaching to help humans transition from task-executors to system-designers.",
    },
    {
      step: "03", icon: <Rocket size={36} />, color: GOLD,
      title: "Apply", subtitle: "Departmental Implementation",
      body: "We move into every specific department — not just tech — to translate their real-world problems into working AI ecosystems.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Delivery Methodology" />
        <h2 className="font-black mb-4" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.1 }}>
          The Assess–Align–Apply Model
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: `hsl(${MUT})` }}>
          A fully modular, customizable approach to organizational transformation.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {pillars.map(({ step, icon, color, title, subtitle, body }) => (
            <div key={title} className="rounded-2xl border p-8 flex flex-col gap-5 relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.3)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div className="flex items-center gap-4">
                <span className="font-black" style={{ fontSize: 48, color: `hsl(${color} / 0.3)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 34, color: `hsl(${C})` }}>{title}</p>
                <p className="font-semibold" style={{ fontSize: 20, color: `hsl(${color})` }}>{subtitle}</p>
              </div>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 05 — Foundation Keynote ────────────────────────────────────────────

function Slide05Foundation() {
  const modules = [
    {
      icon: <Users size={32} />, color: ACCENT,
      title: "The New Role of the Human",
      body: "Moving from System Executors to System Designers. Elevating the human boundary to achieve higher value.",
    },
    {
      icon: <Brain size={32} />, color: TEAL,
      title: "Why AI Confidently Gets It Wrong",
      body: "What happens under the hood when LLM probabilities meet enterprise context — and why \"just prompt better\" doesn't fix it.",
    },
    {
      icon: <Workflow size={32} />, color: GOLD,
      title: "Mindflow vs. Workflow",
      body: "What AI automates (lower-order knowledge, data retrieval) vs. what requires human judgment (higher-order knowledge, principles).",
    },
    {
      icon: <Lightbulb size={32} />, color: PURPLE,
      title: "Product Thinking in AI",
      body: "Why every leader must now treat internal processes and knowledge as dynamic \"products\" that evolve continuously.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Chip color={ACCENT}>Phase 1</Chip>
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          The Foundation
        </h2>
        <p className="mb-3" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Company-Wide Keynote</p>
        <p className="mb-8" style={{ fontSize: 24, color: `hsl(${MUT})` }}>Establishing the shared vocabulary across the entire organization.</p>

        <div className="grid grid-cols-2 gap-5">
          {modules.map(({ icon, color, title, body }) => (
            <div key={title} className="flex items-start gap-5 rounded-xl border p-7"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="flex-shrink-0 mt-1 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(${color} / 0.15)`, color: `hsl(${color})` }}>{icon}</div>
              <div className="flex-1">
                <p className="font-bold mb-2" style={{ fontSize: 26, color: `hsl(${C})` }}>{title}</p>
                <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 06 — Departmental Tracks ───────────────────────────────────────────

function Slide06Tracks() {
  const tracks = [
    {
      icon: <Code size={24} />, color: ACCENT,
      title: "Engineering & R&D",
      concept: "Automate low-order coding tasks; enable high-order architectural judgment.",
      examples: "API Constraints, CI/CD Context Injection, Sprint Health Check Agents",
    },
    {
      icon: <Users size={24} />, color: TEAL,
      title: "HR & Talent",
      concept: "Automate low-order policy retrieval; scale high-order empathy and cultural DNA.",
      examples: "HRBP Advisory Agents, Onboarding Planners, Change Management Guardrails",
    },
    {
      icon: <Lightbulb size={24} />, color: GOLD,
      title: "Product & Strategy",
      concept: "Automate data synthesis; enable complex decision framing.",
      examples: "Risk Trackers, \"Critic Agents\" for roadmap stress-testing, Persona Simulations",
    },
    {
      icon: <Briefcase size={24} />, color: PURPLE,
      title: "Sales & GTM",
      concept: "Automate account research; scale consultative value proposition pitching.",
      examples: "Deal Qualification Frameworks, Proposal Engines, Competitive Positioning",
    },
    {
      icon: <HeartHandshake size={24} />, color: ACCENT,
      title: "Customer Success",
      concept: "Automate ticket resolution; enable relationship management and expansion.",
      examples: "Escalation Triage Agents, QBR Prep Ecosystems",
    },
    {
      icon: <LineChart size={24} />, color: TEAL,
      title: "Operations & Finance",
      concept: "Automate reporting; enable strategic forecasting and risk mitigation.",
      examples: "Vendor Risk Assessments, Financial Narrative Synthesis",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Chip color={TEAL}>Phase 2</Chip>
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 58, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Applied Context Engineering
        </h2>
        <p className="mb-2" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>Departmental Tracks — Turning Strategy into Executable Knowledge</p>
        <p className="mb-7" style={{ fontSize: 19, color: `hsl(${MUT})` }}>
          Every track is strictly tailored to the specific problems surfaced during the Assess phase.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {tracks.map(({ icon, color, title, concept, examples }) => (
            <div key={title} className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ background: BG2, borderColor: `hsl(${color} / 0.2)` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${color} / 0.15)`, color: `hsl(${color})` }}>{icon}</div>
                <p className="font-bold" style={{ fontSize: 22, color: `hsl(${C})` }}>{title}</p>
              </div>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{concept}</p>
              <p className="mt-auto pt-2 border-t" style={{ fontSize: 16, color: `hsl(${color})`, borderColor: `hsl(${color} / 0.15)` }}>
                {examples}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 07 — The Sandbox ───────────────────────────────────────────────────

function Slide07Sandbox() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <GridBg />
      <div className="absolute right-0 top-0 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)`, transform: "translate(20%, -20%)" }} />

      <div className="relative z-10 flex h-full items-center px-[120px] gap-14 w-full">
        {/* Left */}
        <div className="flex-1">
          <Tag label="Training Environment" />
          <h2 className="font-black mb-6" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Learn by building.
            <br />
            <span style={{ color: `hsl(${ACCENT})` }}>Zero IT overhead.</span>
          </h2>
          <p className="mb-8" style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            Standard AI tools operate as "black boxes," making it impossible to teach
            <strong style={{ color: `hsl(${C})` }}> how organizational memory and rules are applied</strong>.
          </p>

          <div className="space-y-4">
            {[
              "Teams build with realistic scenarios in a safe, isolated simulation environment",
              "Visually see how adding a strategic rule instantly changes the AI's behavior",
              "Zero data risk — your live data is never required",
              "Architectural principles transfer to whichever internal systems you choose",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <CheckCircle2 size={22} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — visual */}
        <div className="w-[650px] flex-shrink-0">
          <div className="rounded-2xl border p-10 relative overflow-hidden"
            style={{ background: BG2, borderColor: `hsl(${ACCENT} / 0.3)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, hsl(${ACCENT}), hsl(${TEAL}))` }} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
              <span className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>LizaOS Simulation</span>
            </div>

            <div className="space-y-4 mb-6">
              {["Strategic Rule", "Tonal Guideline", "Process Playbook"].map((label, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `hsl(${[ACCENT, TEAL, GOLD][i]} / 0.15)` }}>
                    {[<Shield size={20} />, <MessageSquare size={20} />, <BookOpen size={20} />][i]}
                  </div>
                  <div className="flex-1 h-3 rounded-full" style={{ background: `hsl(${[ACCENT, TEAL, GOLD][i]} / 0.2)` }}>
                    <div className="h-full rounded-full" style={{ width: `${85 - i * 15}%`, background: `hsl(${[ACCENT, TEAL, GOLD][i]})` }} />
                  </div>
                  <span style={{ fontSize: 16, color: `hsl(${MUT})` }}>{label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: `hsl(${ACCENT} / 0.08)`, border: `1px solid hsl(${ACCENT} / 0.2)` }}>
              <p style={{ fontSize: 18, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
                <strong style={{ color: `hsl(${C})` }}>The goal:</strong> We teach the architectural principles of AI operations.
                Once mastered here, your teams deploy "knowledge as code" across your chosen systems.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 08 — Deliverables ──────────────────────────────────────────────────

function Slide08Deliverables() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Deliverable" />
        <h2 className="font-black mb-4" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.1 }}>
          The Organizational Snapshot
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: `hsl(${MUT})` }}>
          This program concludes with strategic feedback for your executive team.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {/* Left */}
          <div className="rounded-2xl border p-9 relative overflow-hidden"
            style={{ background: BG2, borderColor: `hsl(${ACCENT} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${ACCENT})` }} />
            <p className="font-bold mb-6" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>Continuous Data Gathering</p>
            <div className="space-y-4">
              {[
                "Real-time insight capture during Discovery and Application phases",
                "Department-level readiness scoring across all participating teams",
                "Talent mapping: identified \"System Designer\" profiles",
                "Cultural friction points and adoption barriers documented",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="rounded-2xl border p-9 relative overflow-hidden"
            style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.25)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${TEAL})` }} />
            <p className="font-bold mb-6" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>AI-Native Maturity Report</p>
            <div className="space-y-4">
              {[
                "Final comprehensive report delivered to leadership",
                "Departmental readiness heatmap with specific scores",
                "Immediate opportunities for scaled AI deployment",
                "Clear roadmap with prioritized next steps",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${TEAL})`, flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item}</p>
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

// ─── Slide 09 — The Team ──────────────────────────────────────────────────────

function Slide09Team() {
  const team = [
    {
      name: "István Boscha", role: "AI Infrastructure · 15 Years",
      bio: "Founder of Aliz.ai, a Google Cloud Professional Services Partner. 15 years implementing data and AI solutions for digital transformation globally.",
      photo: istvanPhoto, initials: "IB", color: ACCENT,
    },
    {
      name: "Kristóf Éger", role: "Enterprise Strategy & GTM",
      bio: "Business model innovation advisor and executive coach. Years of experience defining, scaling, and embedding AI into decision-making workflows.",
      photo: kristofPhoto, initials: "KÉ", color: TEAL,
    },
    {
      name: "Zoltán Kauker", role: "AI Architecture & Engineering",
      bio: "Deep-tech AI and data engineering expert. Leading AI-driven decision systems with enterprise-grade security and scalable architecture.",
      photo: zoltanPhoto, initials: "ZK", color: GOLD,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <GridBg />
      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Your Transformation Partners" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Practitioners, not theorists.
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: `hsl(${MUT})` }}>
          We've delivered this at <strong style={{ color: `hsl(${C})` }}>BGE Budapest</strong>,{" "}
          <strong style={{ color: `hsl(${C})` }}>University of Vienna</strong>, and{" "}
          <strong style={{ color: `hsl(${C})` }}>University of Lviv</strong> — and across enterprise consulting engagements for the last 4 years.
        </p>

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

        <div className="mt-6 flex items-center gap-8">
          {[
            { n: "15+", label: "Years in AI transformation" },
            { n: "200+", label: "Consulting engagements" },
            { n: "8", label: "Countries" },
            { n: "3", label: "University programs" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="font-black" style={{ fontSize: 32, color: `hsl(${ACCENT})` }}>{s.n}</span>
              <span style={{ fontSize: 18, color: `hsl(${MUT})` }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 10 — Next Steps ────────────────────────────────────────────────────

function Slide10NextSteps() {
  const steps = [
    { n: "01", title: "Align on modular structure", desc: "Define which combination of Assess, Align, and Apply fits your organization.", color: ACCENT },
    { n: "02", title: "Select target departments", desc: "Choose the initial departments for Phase 1 based on strategic priority.", color: TEAL },
    { n: "03", title: "Deploy the Diagnostic", desc: "Roll out the AI Execution Maturity Diagnostic to participants before training.", color: GOLD },
    { n: "04", title: "Schedule the Foundation Keynote", desc: "Kick off with the company-wide session to establish shared vocabulary.", color: ACCENT },
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
  { id: 1, title: "Title", component: <Slide01Title /> },
  { id: 2, title: "The Execution Gap", component: <Slide02Problem /> },
  { id: 3, title: "The 80/20 Transformation", component: <Slide03Outcomes /> },
  { id: 4, title: "Assess–Align–Apply", component: <Slide04Methodology /> },
  { id: 5, title: "Foundation Keynote", component: <Slide05Foundation /> },
  { id: 6, title: "Departmental Tracks", component: <Slide06Tracks /> },
  { id: 7, title: "Training Environment", component: <Slide07Sandbox /> },
  { id: 8, title: "Deliverables", component: <Slide08Deliverables /> },
  { id: 9, title: "The Team", component: <Slide09Team /> },
  { id: 10, title: "Next Steps", component: <Slide10NextSteps /> },
];

// ─── Shell ────────────────────────────────────────────────────────────────────

const CHROME_BG = "hsl(220 18% 5%)";
const CHROME_BORDER = "hsl(220 15% 16%)";

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

  useEffect(() => {
    if (!isFullscreen) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => { setShowNav(true); clearTimeout(timer); timer = setTimeout(() => setShowNav(false), 2500); };
    show();
    window.addEventListener("mousemove", show);
    return () => { window.removeEventListener("mousemove", show); clearTimeout(timer); };
  }, [isFullscreen]);

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
                <p className="text-xs font-mono" style={{ color: `hsl(${MUT})` }}>{i + 1}. {slide.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Default ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 h-12 border-b flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
          <span className="text-xs" style={{ color: `hsl(${MUT})` }}>Consulting & Training</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setShowGrid(true)} className="hover:bg-white/5" style={{ color: `hsl(${MUT})` }}>
            <Grid3x3 size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={enterFullscreen} className="hover:bg-white/5" style={{ color: `hsl(${MUT})` }}>
            <Maximize2 size={18} />
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-Consulting-Training" slideCount={SLIDES.length} accentColor={`hsl(${ACCENT})`} />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
        <div ref={exportRef} className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden border shadow-2xl"
          style={{ borderColor: CHROME_BORDER }}>
          <ScaledSlide>{SLIDES[current].component}</ScaledSlide>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 px-4 h-14 border-t flex-shrink-0"
        style={{ background: CHROME_BG, borderColor: CHROME_BORDER }}>
        <Button variant="ghost" size="icon" onClick={prev} disabled={current === 0} className="hover:bg-white/5" style={{ color: `hsl(${MUT})` }}>
          <ChevronLeft size={20} />
        </Button>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 24 : 8, height: 8,
                background: i === current ? `hsl(${ACCENT})` : `hsl(${MUT} / 0.3)`,
              }} />
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={next} disabled={current === SLIDES.length - 1} className="hover:bg-white/5" style={{ color: `hsl(${MUT})` }}>
          <ChevronRight size={20} />
        </Button>
        <span className="font-mono text-xs ml-4" style={{ color: `hsl(${MUT} / 0.6)` }}>
          {current + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
}

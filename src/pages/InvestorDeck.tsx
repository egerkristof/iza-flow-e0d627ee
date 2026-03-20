import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Brain, Zap, Target, BarChart3,
  DollarSign, Shield, CheckCircle2, ArrowRight, Globe, Layers, Award, Briefcase,
  Download, Loader2, AlertTriangle, Building2, Workflow, Eye, Lightbulb, BookOpen
} from "lucide-react";
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

// ─── Shared layout helpers ───────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";
const ACCENT = "200 90% 42%";
const GREEN = "155 72% 38%";
const GOLD = "45 95% 42%";
const RED = "0 72% 50%";
const DARK_BG = "hsl(222 25% 8%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(215 15% 60%)";
const DARK_SUBTLE = "hsl(215 10% 45%)";
const DARK_CARD = "hsl(222 20% 13%)";

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function DarkGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.08]" style={{
      backgroundImage: `linear-gradient(hsl(215 15% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 25%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function SlideBar({ from = ACCENT, to = GREEN }: { from?: string; to?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

function Tag({ label, color = ACCENT }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color})` }}>{label}</p>
  );
}

function DarkTag({ label, color = ACCENT }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color} / 0.8)` }}>{label}</p>
  );
}

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-12 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>LIZA OS · Series Seed</span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 100, lineHeight: 1.0, color: DARK_TEXT }}>
          The Operating System for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organizations.
          </span>
        </h1>

        <p style={{ fontSize: 36, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          Every team uses AI. No one manages how.<br />
          LIZA is the management layer that turns fragmented AI usage<br />
          into coordinated organizational intelligence.
        </p>

        <div className="mt-20 flex items-center gap-20">
          {[
            ["83%", "of enterprises report inconsistent AI outputs across teams"],
            ["$0", "spent on the management layer that fixes it"],
            ["LIZA OS", "is building that layer"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2 max-w-[320px]">
              <span className="font-black" style={{ fontSize: 48, color: DARK_TEXT }}>{k}</span>
              <span className="text-center" style={{ fontSize: 22, color: DARK_SUBTLE }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 02 — The End of SaaS Thesis ───────────────────────────────────────

function Slide02Thesis() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Investment Thesis" color={GOLD} />
        <h2 className="font-black mb-14" style={{ fontSize: 78, color: DARK_TEXT, lineHeight: 1.05 }}>
          Every AI startup is building<br />
          <span style={{ color: `hsl(${GOLD})` }}>the same thing.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 mb-10">
          {[
            { icon: "💬", label: "Chats", desc: "Every tool has a conversation interface with an LLM." },
            { icon: "🤖", label: "Agents", desc: "Every tool lets you build autonomous workflows." },
            { icon: "📄", label: "Context", desc: "Every tool offers RAG, memory, and document grounding." },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="rounded-2xl border p-8 text-center"
              style={{ borderColor: "hsl(0 0% 100% / 0.08)", background: DARK_CARD }}>
              <p style={{ fontSize: 56 }}>{icon}</p>
              <p className="font-bold mt-4 mb-2" style={{ fontSize: 32, color: DARK_TEXT }}>{label}</p>
              <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-10 flex-1 flex flex-col justify-center"
          style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.06)` }}>
          <p className="font-black mb-4" style={{ fontSize: 40, color: DARK_TEXT }}>
            These features are commoditizing in real-time.
          </p>
          <p style={{ fontSize: 28, color: DARK_MUTED, lineHeight: 1.6 }}>
            The defensible layer isn't the tool. It's the <strong style={{ color: `hsl(${GOLD})` }}>organizational knowledge</strong> that makes the tool work consistently.
            LIZA is the infrastructure that captures, governs, and operationalizes that knowledge.
            We're not building a better SaaS product. We're building the <strong style={{ color: `hsl(${GOLD})` }}>management layer underneath all of them.</strong>
          </p>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 03 — Problem ──────────────────────────────────────────────────────

function Slide03Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Problem" color={RED} />
        <h2 className="font-bold mb-14" style={{ fontSize: 76, color: TEXT, lineHeight: 1.1 }}>
          Same prompt. Same tool. Five people.<br />
          <span style={{ color: `hsl(${RED})` }}>Five different outputs.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {[
            {
              icon: <Layers size={56} />, color: RED,
              title: "No coordination layer",
              body: "Every team picks their own AI tools, prompts, and workflows. The organization has no shared intelligence. No standards. No consistency."
            },
            {
              icon: <Users size={56} />, color: "38 92% 42%",
              title: "Knowledge stays in heads",
              body: "Your best people's judgment never becomes organizational capability. When they leave, capability vanishes. Every resignation is a knowledge loss event."
            },
            {
              icon: <Zap size={56} />, color: RED,
              title: "AI amplifies chaos",
              body: "Generic AI gives everyone content generation with zero organizational context. Teams get faster at producing outputs that don't match your standards."
            },
          ].map(({ icon, color, title, body }) => (
            <div key={title} className="flex flex-col gap-6 rounded-2xl border p-10"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold" style={{ fontSize: 34, color: TEXT }}>{title}</p>
              <p style={{ fontSize: 24, color: MUTED, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={RED} to="38 92% 42%" />
    </div>
  );
}

// ─── Slide 04 — Market ───────────────────────────────────────────────────────

function Slide04Market() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="The Infrastructure Gap" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          Massive spend on AI tools.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Zero infrastructure to make them work.</span>
        </h2>

        <div className="flex gap-10 mb-10 flex-1 min-h-0">
          {/* Left: The gap visualization */}
          <div className="w-1/2 flex flex-col gap-4 justify-center">
            <div className="rounded-2xl border p-8"
              style={{ borderColor: `hsl(${RED} / 0.2)`, background: `hsl(${RED} / 0.04)` }}>
              <p className="font-black mb-2" style={{ fontSize: 56, color: `hsl(${RED})`, lineHeight: 1 }}>$180B</p>
              <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>Spent on enterprise software licenses</p>
              <p style={{ fontSize: 20, color: MUTED }}>Gartner 2025</p>
            </div>

            <div className="rounded-2xl border-2 border-dashed p-8 flex items-center gap-6"
              style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.06)` }}>
              <AlertTriangle size={48} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
              <div>
                <p className="font-black mb-1" style={{ fontSize: 44, color: `hsl(${GOLD})`, lineHeight: 1 }}>$0</p>
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>Spent on the management layer that makes AI work consistently across teams</p>
              </div>
            </div>

            <div className="rounded-2xl border p-8"
              style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
              <p className="font-black mb-2" style={{ fontSize: 56, color: `hsl(${ACCENT})`, lineHeight: 1 }}>LIZA OS</p>
              <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>is building that management layer</p>
              <p style={{ fontSize: 20, color: MUTED }}>The OS between people and their AI tools</p>
            </div>
          </div>

          {/* Right: market context */}
          <div className="w-1/2 flex flex-col gap-5 justify-center">
            <p className="font-semibold mb-2" style={{ fontSize: 22, color: SUBTLE, letterSpacing: "0.15em", textTransform: "uppercase" }}>Why Now</p>
            {[
              { trend: "AI commoditization", desc: "ChatGPT, Copilot, Gemini: every employee has access to powerful AI. The bottleneck shifted from access to coordination.", color: ACCENT },
              { trend: "Workforce mobility", desc: "Average tenure is 2.3 years and falling. Institutional memory evaporates with every departure.", color: GREEN },
              { trend: "End of SaaS moats", desc: "Features are copied in weeks. The only defensible asset is organizational knowledge. No tool captures it.", color: GOLD },
              { trend: "Regulation pressure", desc: "EU AI Act, SOC2, ISO 27001: enterprises need governance over AI usage. No infrastructure exists.", color: RED },
            ].map(({ trend, desc, color }) => (
              <div key={trend} className="rounded-xl border p-5 flex gap-4"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <TrendingUp size={24} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{trend}</p>
                  <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 05 — Solution ─────────────────────────────────────────────────────

function Slide05Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-14">
          <Tag label="The Solution" color={ACCENT} />
          <h2 className="font-black" style={{ fontSize: 88, color: TEXT, lineHeight: 1.05 }}>
            LIZA OS
          </h2>
          <p className="mt-4" style={{ fontSize: 34, color: MUTED }}>
            The Management Layer for AI-Native Teams
          </p>
        </div>

        <div className="flex gap-10 justify-center mb-10">
          {[
            {
              icon: <BookOpen size={52} />, color: ACCENT, step: "01",
              title: "Standards",
              desc: "Encode how your best people think. Playbooks, guardrails, cultural principles become executable knowledge that guides every AI interaction.",
            },
            {
              icon: <Target size={52} />, color: GREEN, step: "02",
              title: "Execution",
              desc: "AI follows your standards in every interaction, across every team, with every model. Protocol-driven workflows replace blank-page guessing.",
            },
            {
              icon: <Brain size={52} />, color: GOLD, step: "03",
              title: "Learning",
              desc: "The system learns from real work. When a senior corrects the AI, that correction becomes organizational knowledge. The loop compounds.",
            },
          ].map(({ icon, color, step, title, desc }) => (
            <div key={title} className="flex-1 rounded-2xl border p-10 flex flex-col gap-6"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div className="flex items-center gap-5">
                <span className="font-black" style={{ fontSize: 64, color: `hsl(${color} / 0.15)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <p className="font-bold" style={{ fontSize: 42, color: TEXT }}>{title}</p>
              <p style={{ fontSize: 25, color: MUTED, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 px-10 py-6 rounded-xl border"
          style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <Brain size={32} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 26, color: MUTED }}>
            Built on the <strong style={{ color: TEXT }}>SECI model</strong> (Nonaka & Takeuchi): a 40-year proven theory of organizational learning,
            operationalized for the first time through LLMs.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 06 — Architecture ─────────────────────────────────────────────────

function Slide06Architecture() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="How It Works" color={ACCENT} />
        <h2 className="font-bold mb-8" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Infrastructure, not features.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>The system underneath your AI tools.</span>
        </h2>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Architecture layers */}
          <div className="flex-1 flex flex-col gap-4">
            {[
              {
                layer: "Knowledge Graph", color: ACCENT,
                icon: <Layers size={36} />,
                desc: "Living organizational memory. Standards, playbooks, cultural principles, governance rules. Versioned, auditable, propagated in real-time.",
                detail: "Not static docs. Executable knowledge.",
              },
              {
                layer: "Context Engine (AACE v3.1)", color: GREEN,
                icon: <Workflow size={36} />,
                desc: "Proprietary specification. Intent-locking ensures AI stays on-task. Hierarchical injection delivers the right knowledge at the right step.",
                detail: "Competitors need 18-24 months to replicate.",
              },
              {
                layer: "Execution Layer", color: GOLD,
                icon: <Target size={36} />,
                desc: "Protocol-driven workbooks. Model-agnostic (GPT, Gemini, Claude). Group collaboration with AI and humans in the same workspace.",
                detail: "Real-time context propagation across teams.",
              },
              {
                layer: "Governance & Learning", color: ACCENT,
                icon: <Eye size={36} />,
                desc: "Drift detection, compliance scoring, after-action synthesis. Every execution feeds the knowledge graph. The organization compounds.",
                detail: "Process owners see where standards aren't being followed.",
              },
            ].map(({ layer, color, icon, desc, detail }) => (
              <div key={layer} className="flex gap-5 rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <div className="flex flex-col items-center gap-2 shrink-0 w-14">
                  <div style={{ color: `hsl(${color})` }}>{icon}</div>
                </div>
                <div className="flex-1">
                  <p className="font-bold mb-1" style={{ fontSize: 26, color: TEXT }}>{layer}</p>
                  <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
                  <p className="font-semibold mt-1" style={{ fontSize: 18, color: `hsl(${color})` }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data flow */}
          <div className="w-[380px] shrink-0 flex flex-col justify-center items-center gap-3">
            <p className="font-semibold mb-3" style={{ fontSize: 20, color: SUBTLE, letterSpacing: "0.15em", textTransform: "uppercase" }}>Data Flow</p>
            {[
              { label: "Senior corrects AI", sub: "in a workbook session", color: GOLD },
              { label: "System captures learning", sub: "structured as knowledge item", color: GREEN },
              { label: "Process owner reviews", sub: "approves or refines", color: ACCENT },
              { label: "Knowledge graph updates", sub: "versioned, auditable", color: ACCENT },
              { label: "All future executions", sub: "inherit the new standard", color: GREEN },
            ].map(({ label, sub, color }, i) => (
              <div key={label} className="w-full">
                <div className="rounded-xl border px-5 py-4 flex items-center gap-3"
                  style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
                  <span className="font-black shrink-0" style={{ fontSize: 28, color: `hsl(${color} / 0.25)`, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{label}</p>
                    <p style={{ fontSize: 16, color: MUTED }}>{sub}</p>
                  </div>
                </div>
                {i < 4 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4" style={{ background: `hsl(${ACCENT} / 0.2)` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 07 — Case Study (Graphisoft) ──────────────────────────────────────

function Slide07CaseStudy() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="Enterprise Validation" color={GREEN} />
        <h2 className="font-bold mb-6" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Live demo with a Global AEC Software Company<br />
          <span style={{ color: `hsl(${GREEN})` }}>(part of a €6B Technology Group, 200+ employees)</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Scenario */}
          <div className="w-[55%] flex flex-col gap-4">
            <div className="rounded-xl border p-6"
              style={{ borderColor: `hsl(${ACCENT} / 0.18)`, background: `hsl(${ACCENT} / 0.04)` }}>
              <p className="font-semibold mb-2" style={{ fontSize: 20, color: `hsl(${ACCENT})`, letterSpacing: "0.1em" }}>SCENARIO</p>
              <p className="font-bold mb-2" style={{ fontSize: 28, color: TEXT }}>Post-merger integration across 4 departments</p>
              <p style={{ fontSize: 21, color: MUTED, lineHeight: 1.5 }}>
                Product line merger into flagship platform. Leadership changes, team restructuring,
                CI/CD pipeline unification, travel budget reallocation.
              </p>
            </div>

            <div className="rounded-xl border p-6"
              style={{ borderColor: `hsl(${GREEN} / 0.18)`, background: `hsl(${GREEN} / 0.04)` }}>
              <p className="font-semibold mb-3" style={{ fontSize: 20, color: `hsl(${GREEN})`, letterSpacing: "0.1em" }}>WHAT HAPPENED</p>
              {[
                "Strategic decision propagated in real-time from Strategy → HR → R&D",
                "AI generated change management comms following the company's playbook",
                "AI leaked a sensitive personnel change in the all-hands draft",
                "Senior corrected the AI. System learned the governance rule instantly.",
                "Next execution: AI automatically enforced the rule. No reminder needed.",
              ].map((point, i) => (
                <p key={i} className="flex items-start gap-3 mb-2" style={{ fontSize: 21, color: MUTED }}>
                  <span className="font-bold shrink-0" style={{ color: `hsl(${GREEN})` }}>→</span> {point}
                </p>
              ))}
            </div>
          </div>

          {/* Proof points */}
          <div className="w-[45%] flex flex-col gap-4 justify-center">
            <div className="rounded-xl border p-6"
              style={{ borderColor: `hsl(${GOLD} / 0.18)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-semibold mb-3" style={{ fontSize: 20, color: `hsl(${GOLD})`, letterSpacing: "0.1em" }}>WHAT THIS PROVES</p>
              <p className="font-bold mb-3" style={{ fontSize: 26, color: TEXT }}>This isn't a tool problem. It's an infrastructure problem.</p>
              <p style={{ fontSize: 21, color: MUTED, lineHeight: 1.5 }}>
                The demo covered Strategy, HR, Change Management, and R&D Sprint Planning
                in a single session. No other platform connects these workflows through a shared,
                learning knowledge graph.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "4", sub: "Departments covered", color: ACCENT },
                { label: "16", sub: "Attendees (VP, Dev, HR, PM)", color: GREEN },
                { label: "107", sub: "Minutes of live demo", color: GOLD },
                { label: "Real", sub: "Use cases, not simulated", color: ACCENT },
              ].map(({ label, sub, color }) => (
                <div key={sub} className="rounded-xl border p-5 text-center"
                  style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                  <p className="font-black" style={{ fontSize: 36, color: `hsl(${color})`, lineHeight: 1 }}>{label}</p>
                  <p className="mt-1" style={{ fontSize: 17, color: MUTED }}>{sub}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5 flex items-center gap-4"
              style={{ borderColor: `hsl(${ACCENT} / 0.18)`, background: `hsl(${ACCENT} / 0.04)` }}>
              <Building2 size={28} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
              <p style={{ fontSize: 19, color: MUTED }}>
                <strong style={{ color: TEXT }}>VP Product at the company</strong> now serves as Strategic Advisor to LIZA OS
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 08 — Traction ─────────────────────────────────────────────────────

function Slide08Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Traction & Validation" color={GREEN} />
        <h2 className="font-bold mb-12" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          Built on real-world signal.<br />
          <span style={{ color: `hsl(${GREEN})` }}>Not theoretical demand.</span>
        </h2>

        <div className="grid grid-cols-4 gap-7 mb-10">
          {[
            { stat: "Live Product", sub: "Functional platform with AI edge functions, role-based modes, protocol execution, and knowledge graph.", color: ACCENT },
            { stat: "Enterprise Pilot", sub: "Full-day demo with a global AEC software company (€6B group). VP-level engagement across 4 departments.", color: GREEN },
            { stat: "Multi-Vertical", sub: "Validated across exec search, architecture, sales operations, marketing, and professional services.", color: ACCENT },
            { stat: "AACE v3.1", sub: "Proprietary AI context specification. Intent-locking, hierarchical knowledge injection, drift detection. The IP moat.", color: GREEN },
          ].map(({ stat, sub, color }) => (
            <div key={stat} className="rounded-2xl border p-8 flex flex-col gap-4"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.18)` }}>
              <p className="font-black" style={{ fontSize: 34, color: `hsl(${color})`, lineHeight: 1.1 }}>{stat}</p>
              <p style={{ fontSize: 21, color: MUTED, lineHeight: 1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-8 flex-1">
          <div className="flex-1 rounded-2xl border p-10"
            style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
            <Award size={44} style={{ color: `hsl(${GOLD})` }} className="mb-5" />
            <p className="font-bold mb-4" style={{ fontSize: 32, color: TEXT }}>Diagnostic Tool Live</p>
            <p style={{ fontSize: 23, color: MUTED, lineHeight: 1.55 }}>
              Online AI Standards Diagnostic generating qualified enterprise leads. Teams self-assess their AI maturity
              across 5 dimensions. Team leaders receive aggregate reports. Conversion channel into LIZA OS pilots.
            </p>
          </div>
          <div className="flex-1 rounded-2xl border p-10"
            style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
            <Lightbulb size={44} style={{ color: `hsl(${ACCENT})` }} className="mb-5" />
            <p className="font-bold mb-4" style={{ fontSize: 32, color: TEXT }}>Universal Pain Point</p>
            <p style={{ fontSize: 23, color: MUTED, lineHeight: 1.55 }}>
              Every vertical validated the same core problem: scaling senior judgment beyond the individuals who carry it.
              Not a feature request. An infrastructure gap that every organization with 50+ people faces.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 09 — Category Map ─────────────────────────────────────────────────

function Slide09CategoryMap() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Category Creation" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          We're not competing with these tools.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>We're the layer underneath.</span>
        </h2>

        {/* Concentric rings visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring - AI Tools */}
            <div className="rounded-full flex items-center justify-center"
              style={{ width: 700, height: 700, background: `hsl(${RED} / 0.04)`, border: `2px solid hsl(${RED} / 0.15)` }}>
              {/* Middle ring - Knowledge Platforms */}
              <div className="rounded-full flex items-center justify-center"
                style={{ width: 470, height: 470, background: `hsl(${GOLD} / 0.06)`, border: `2px solid hsl(${GOLD} / 0.2)` }}>
                {/* Center - LIZA */}
                <div className="rounded-full flex flex-col items-center justify-center"
                  style={{ width: 240, height: 240, background: `linear-gradient(135deg, hsl(${ACCENT} / 0.12), hsl(${GREEN} / 0.12))`, border: `3px solid hsl(${ACCENT} / 0.4)` }}>
                  <p className="font-black" style={{ fontSize: 32, color: `hsl(${ACCENT})` }}>LIZA OS</p>
                  <p className="text-center px-6" style={{ fontSize: 15, color: MUTED, lineHeight: 1.3 }}>Management<br />Layer</p>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
              <p className="font-bold" style={{ fontSize: 22, color: `hsl(${RED})` }}>AI Tools</p>
              <p style={{ fontSize: 16, color: MUTED }}>They generate outputs</p>
            </div>
            <div className="absolute top-[130px] left-1/2 -translate-x-1/2 text-center">
              <p className="font-bold" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>Knowledge Platforms</p>
              <p style={{ fontSize: 15, color: MUTED }}>They store information</p>
            </div>

            {/* Tool labels around the rings */}
            <p className="absolute font-semibold" style={{ fontSize: 18, color: `hsl(${RED} / 0.6)`, top: 60, left: -10 }}>ChatGPT</p>
            <p className="absolute font-semibold" style={{ fontSize: 18, color: `hsl(${RED} / 0.6)`, top: 60, right: -20 }}>Copilot</p>
            <p className="absolute font-semibold" style={{ fontSize: 18, color: `hsl(${RED} / 0.6)`, bottom: 60, left: 20 }}>Gemini</p>
            <p className="absolute font-semibold" style={{ fontSize: 18, color: `hsl(${RED} / 0.6)`, bottom: 60, right: 10 }}>Claude</p>

            <p className="absolute font-semibold" style={{ fontSize: 17, color: `hsl(${GOLD} / 0.7)`, top: 170, left: 50 }}>Notion</p>
            <p className="absolute font-semibold" style={{ fontSize: 17, color: `hsl(${GOLD} / 0.7)`, top: 170, right: 40 }}>Confluence</p>
            <p className="absolute font-semibold" style={{ fontSize: 17, color: `hsl(${GOLD} / 0.7)`, bottom: 170, left: 80 }}>Guru</p>
            <p className="absolute font-semibold" style={{ fontSize: 17, color: `hsl(${GOLD} / 0.7)`, bottom: 170, right: 80 }}>Glean</p>
          </div>

          {/* Right side explanation */}
          <div className="flex flex-col gap-6 ml-16 max-w-[500px]">
            {[
              { ring: "AI Tools", desc: "Generate text, code, images. No organizational context. No consistency. No governance.", color: RED },
              { ring: "Knowledge Platforms", desc: "Store documents and search them. Static. Don't drive execution. Don't learn from usage.", color: GOLD },
              { ring: "LIZA OS", desc: "The management layer. Makes organizational knowledge executable. Governs AI usage. Learns from every interaction. Compounds over time.", color: ACCENT },
            ].map(({ ring, desc, color }) => (
              <div key={ring} className="flex gap-4">
                <div className="w-4 h-4 rounded-full mt-1.5 shrink-0" style={{ background: `hsl(${color})` }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{ring}</p>
                  <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 10 — Business Model ───────────────────────────────────────────────

function Slide10BusinessModel() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="Business Model" color={ACCENT} />
        <h2 className="font-bold mb-6" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Infrastructure pricing. Not per-seat SaaS.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Land with one team. Expand org-wide.</span>
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-6 flex-1 min-h-0">
          {[
            {
              tier: "Team", price: "€60k/yr", seats: "Single team",
              desc: "Core workbooks, protocol execution, knowledge bundles. One team adopts. Proves value. Others follow.", color: MUTED,
              features: ["Unlimited workbooks", "Protocol execution", "Knowledge bundles", "Model-agnostic AI"],
            },
            {
              tier: "Department", price: "€180k/yr", seats: "Multi-team",
              desc: "Cross-team knowledge propagation. Smart ingestion. Drift detection. After-action synthesis.", color: ACCENT,
              features: ["Everything in Team", "Cross-team knowledge graph", "Drift scoring + alerts", "After-action AI synthesis", "Document ingestion"],
            },
            {
              tier: "Enterprise", price: "€300k+/yr", seats: "Organisation-wide",
              desc: "Full organizational OS. White-glove onboarding. Custom playbook library. SSO. Governance dashboards.", color: GOLD,
              features: ["Everything in Department", "Custom playbook authoring", "SSO + SCIM", "Governance dashboards", "Dedicated CSM + SLA"],
            },
          ].map(({ tier, price, seats, desc, color, features }) => (
            <div key={tier} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.04)` }}>
              <div className="px-7 py-5 border-b" style={{ borderColor: `hsl(${color} / 0.15)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 26, color: `hsl(${color})` }}>{tier}</p>
                <p className="font-black" style={{ fontSize: 40, color: TEXT, lineHeight: 1 }}>{price}</p>
                <p style={{ fontSize: 19, color: MUTED }}>{seats}</p>
              </div>
              <div className="px-7 py-5 flex flex-col gap-2 flex-1">
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45, marginBottom: 4 }}>{desc}</p>
                {features.map(f => (
                  <p key={f} className="flex items-center gap-2.5" style={{ fontSize: 19, color: "hsl(222 15% 30%)" }}>
                    <CheckCircle2 size={16} style={{ color: `hsl(${color})`, flexShrink: 0 }} /> {f}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {[
            { label: "Switching Cost = Moat", desc: "The longer teams use LIZA, the deeper the knowledge graph. Moving away means losing institutional memory.", color: GREEN },
            { label: "AI Usage Layer", desc: "+usage-based AI consumption above tier limits. Expands ARR naturally as adoption deepens.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-6 py-5 flex items-center gap-5"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <Shield size={30} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 19, color: MUTED }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 11 — GTM ──────────────────────────────────────────────────────────

function Slide11GTM() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="Go-To-Market" color={ACCENT} />
        <h2 className="font-bold mb-8" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Enter with one team's pain.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Expand as the knowledge graph grows.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="w-3/5 flex flex-col gap-4">
            {[
              {
                phase: "Phase 1: 0–12 months", color: ACCENT,
                headline: "Product-led enterprise sales",
                points: [
                  "Target: EU organizations 50–500 people with AI adoption pressure",
                  "Entry via AI Standards Diagnostic (free) → pilot conversion",
                  "Expert-driven onboarding: seniors build playbooks in the platform",
                  "Deploy into one team. Prove ROI. Expand cross-department.",
                ],
              },
              {
                phase: "Phase 2: 12–30 months", color: GREEN,
                headline: "Cross-department expansion + channel",
                points: [
                  "Expand within accounts via knowledge graph network effects",
                  "Partner with framework owners (MEDDIC, ESG, ISO specialists)",
                  "Distribution via HR tech and professional services ecosystems",
                ],
              },
              {
                phase: "Phase 3: 30+ months", color: GOLD,
                headline: "Platform + API layer",
                points: [
                  "AACE as a service: enterprise workflows plug into the context engine",
                  "Template marketplace for domain-specific playbook packs",
                  "White-label for firms to deploy under their own brand",
                ],
              },
            ].map(({ phase, color, headline, points }) => (
              <div key={phase} className="rounded-xl border p-5"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <p className="font-semibold mb-0.5" style={{ fontSize: 20, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{phase}</p>
                <p className="font-bold mb-2" style={{ fontSize: 27, color: TEXT }}>{headline}</p>
                <div className="flex flex-col gap-1">
                  {points.map(p => (
                    <p key={p} style={{ fontSize: 20, color: MUTED }}>→ {p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-2/5 flex flex-col gap-4">
            <p className="font-semibold" style={{ fontSize: 24, color: SUBTLE, letterSpacing: "0.2em", textTransform: "uppercase" }}>Target Metrics — Year 3</p>
            {[
              { label: "ARR", val: "€8M+", color: ACCENT },
              { label: "Customers", val: "65", color: GREEN },
              { label: "NRR", val: ">120%", color: ACCENT },
              { label: "Gross Margin", val: "78%", color: GREEN },
              { label: "CAC Payback", val: "<12 mo", color: ACCENT },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border px-7 py-5"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <span style={{ fontSize: 26, color: MUTED }}>{label}</span>
                <span className="font-black" style={{ fontSize: 38, color: `hsl(${color})` }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 12 — Team ─────────────────────────────────────────────────────────

function Slide12Team() {
  const founders = [
    { name: "István Boscha", role: "Product Vision & Capital-Efficient CEO", bio: "Founder of Aliz.ai, a Google Cloud Professional Services Partner. 15 years in AI transformation globally.", photo: istvanPhoto, initials: "IB", color: ACCENT },
    { name: "Kristóf Éger", role: "Enterprise Narrative & Go-to-Market", bio: "AI-driven business strategist, embedding AI into decision-making workflows.", photo: kristofPhoto, initials: "KÉ", color: GREEN },
    { name: "Zoltán Kauker", role: "Scalable AI Architecture & Enterprise Security", bio: "Deep-tech AI and data engineering expert, leading AI-driven decision systems.", photo: zoltanPhoto, initials: "ZK", color: GOLD },
  ];
  const advisors = [
    { name: "Tom Ray", role: "Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers", bio: "Leader in scaling global tech service companies and building enterprise infrastructure." },
    { name: "Enterprise Advisor", role: "VP Product Management, Global AEC Software Company (€6B Group)", bio: "Customer-advisor. Led the full-day enterprise demo. 15+ years product strategy across global enterprise software." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Team" color={ACCENT} />
        <h2 className="font-bold mb-6" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Built by practitioners.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Validated by enterprise leaders.</span>
        </h2>

        <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})`, letterSpacing: "0.15em", textTransform: "uppercase" }}>Founding Team</p>
        <div className="grid grid-cols-3 gap-7 mb-8">
          {founders.map(f => (
            <div key={f.name} className="flex flex-col gap-4 rounded-2xl border p-7"
              style={{ borderColor: `hsl(${f.color} / 0.2)`, background: `hsl(${f.color} / 0.04)` }}>
              <div className="flex items-center gap-4">
                {f.photo ? (
                  <img src={f.photo} alt={f.name} className="w-16 h-16 rounded-full object-cover shrink-0"
                    style={{ border: `2px solid hsl(${f.color} / 0.4)` }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shrink-0"
                    style={{ background: `hsl(${f.color} / 0.15)`, color: `hsl(${f.color})`, border: `2px solid hsl(${f.color} / 0.4)` }}>
                    {f.initials}
                  </div>
                )}
                <div>
                  <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>{f.name}</p>
                  <p style={{ fontSize: 18, color: `hsl(${f.color})` }}>{f.role}</p>
                </div>
              </div>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{f.bio}</p>
            </div>
          ))}
        </div>

        <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${GOLD})`, letterSpacing: "0.15em", textTransform: "uppercase" }}>Strategic Advisory Board</p>
        <div className="grid grid-cols-2 gap-7">
          {advisors.map(a => (
            <div key={a.name} className="rounded-2xl border p-7"
              style={{ borderColor: `hsl(${GOLD} / 0.18)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-bold" style={{ fontSize: 28, color: TEXT }}>{a.name}</p>
              <p className="mb-3" style={{ fontSize: 20, color: `hsl(${GOLD})` }}>{a.role}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{a.bio}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ─── Slide 13 — Financials ───────────────────────────────────────────────────

function Slide13Financials() {
  const quarters = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"];
  const arr = [50, 120, 250, 500, 800, 1400, 2200, 3500, 4800, 6200, 7400, 8200];
  const maxArr = 10000;

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="Financial Projections" color={ACCENT} />
        <h2 className="font-bold mb-6" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          €8M+ ARR by Year 3.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Driven by expansion, not just new logos.</span>
        </h2>

        <div className="flex-1 relative rounded-2xl border p-8"
          style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between">
            {[10000, 8000, 6000, 4000, 2000, 1000, 0].map(v => (
              <span key={v} style={{ fontSize: 20, color: SUBTLE, fontFamily: "monospace" }}>
                €{v > 0 ? (v >= 1000 ? (v / 1000).toFixed(1) + "M" : v + "k") : "0"}
              </span>
            ))}
          </div>

          <div className="flex-1 flex items-end gap-2 pl-16 pb-8">
            {quarters.map((q, i) => {
              const h = (arr[i] / maxArr) * 320;
              const color = i < 4 ? `hsl(${ACCENT} / 0.7)` : i < 8 ? `hsl(${GREEN} / 0.8)` : `hsl(${GOLD} / 0.9)`;
              return (
                <div key={q} className="flex flex-col items-center gap-2 flex-1">
                  <span style={{ fontSize: 18, color: `hsl(${ACCENT})`, fontFamily: "monospace" }}>
                    {arr[i] > 0 ? "€" + (arr[i] >= 1000 ? (arr[i] / 1000).toFixed(1) + "M" : arr[i] + "k") : ""}
                  </span>
                  <div className="w-full rounded-t-lg" style={{ height: Math.max(h, 4), background: color, minWidth: 60 }} />
                  <span style={{ fontSize: 20, color: SUBTLE }}>{q}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8 mt-6">
          {[
            { phase: "Phase 1 (Q1–Q4)", goal: "€500k ARR", note: "6 customers, mostly Team tier. Direct product-led sales. Prove retention + expansion.", color: ACCENT },
            { phase: "Phase 2 (Q5–Q8)", goal: "€3.5M ARR", note: "30 customers. Channel partners live. Series A at month 18.", color: GREEN },
            { phase: "Phase 3 (Q9–Q12)", goal: "€8.2M ARR", note: "65 customers. NRR >120%. Platform API + white-label.", color: GOLD },
          ].map(({ phase, goal, note, color }) => (
            <div key={phase} className="flex-1 rounded-xl border p-6"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <p style={{ fontSize: 20, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{phase}</p>
              <p className="font-black" style={{ fontSize: 36, color: TEXT }}>{goal}</p>
              <p style={{ fontSize: 20, color: MUTED }}>{note}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 14 — Use of Funds ─────────────────────────────────────────────────

function Slide14UseOfFunds() {
  const allocations = [
    { label: "Product & Engineering", pct: 45, amt: "€675k", desc: "Core team (2 senior engineers + 1 AI specialist). Complete the SECI flywheel: after-action synthesis, smart ingestion, drift detection.", color: ACCENT },
    { label: "Sales & GTM", pct: 30, amt: "€450k", desc: "First 2 enterprise sales hires + marketing. Diagnostic-to-pilot conversion funnel. Channel partner program.", color: GREEN },
    { label: "Research & AI Infrastructure", pct: 15, amt: "€225k", desc: "AACE v4 spec + LLM inference costs. Academic partnership on SECI-AI validation.", color: GOLD },
    { label: "Operations & Legal", pct: 10, amt: "€150k", desc: "EU AI Act compliance, IP protection, financial runway management.", color: MUTED },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Use of Funds" color={ACCENT} />
        <h2 className="font-bold mb-12" style={{ fontSize: 76, color: TEXT, lineHeight: 1.1 }}>
          €1.5M seed. 18-month runway.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Series A ready by month 18.</span>
        </h2>

        <div className="flex gap-12 flex-1">
          <div className="flex flex-col items-center justify-center w-[380px] shrink-0">
            <svg width="340" height="340" viewBox="0 0 340 340">
              {(() => {
                const total = 100; let startAngle = -90;
                const colors = [`hsl(${ACCENT})`, `hsl(${GREEN})`, `hsl(${GOLD})`, "hsl(215 10% 65%)"];
                return allocations.map(({ pct, label }, i) => {
                  const angle = (pct / total) * 360;
                  const endAngle = startAngle + angle;
                  const r = 150; const cx = 170; const cy = 170; const inner = 90;
                  const toRad = (deg: number) => (deg * Math.PI) / 180;
                  const x1 = cx + r * Math.cos(toRad(startAngle));
                  const y1 = cy + r * Math.sin(toRad(startAngle));
                  const x2 = cx + r * Math.cos(toRad(endAngle));
                  const y2 = cy + r * Math.sin(toRad(endAngle));
                  const xi1 = cx + inner * Math.cos(toRad(startAngle));
                  const yi1 = cy + inner * Math.sin(toRad(startAngle));
                  const xi2 = cx + inner * Math.cos(toRad(endAngle));
                  const yi2 = cy + inner * Math.sin(toRad(endAngle));
                  const largeArc = angle > 180 ? 1 : 0;
                  const d = `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${largeArc},0 ${xi1},${yi1} Z`;
                  startAngle = endAngle;
                  return <path key={label} d={d} fill={colors[i]} opacity={0.8} />;
                });
              })()}
              <text x="170" y="162" textAnchor="middle" fill={TEXT} fontSize="36" fontWeight="900">€1.5M</text>
              <text x="170" y="192" textAnchor="middle" fill={MUTED} fontSize="22">Seed Round</text>
            </svg>
            <div className="flex flex-col gap-2 mt-2">
              {allocations.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${color})` }} />
                  <span style={{ fontSize: 20, color: MUTED }}>{pct}% {label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            {allocations.map(({ label, pct, amt, desc, color }) => (
              <div key={label} className="flex gap-6 rounded-xl border p-7"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <div className="shrink-0 flex flex-col items-center gap-1 w-24">
                  <span className="font-black" style={{ fontSize: 38, color: `hsl(${color})`, lineHeight: 1 }}>{pct}%</span>
                  <span className="font-bold" style={{ fontSize: 24, color: `hsl(${color} / 0.7)` }}>{amt}</span>
                </div>
                <div>
                  <p className="font-bold mb-2" style={{ fontSize: 28, color: TEXT }}>{label}</p>
                  <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 15 — The Ask ──────────────────────────────────────────────────────

function Slide15TheAsk() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-16">
          <Tag label="The Ask" color={GOLD} />
          <h2 className="font-black" style={{ fontSize: 96, color: TEXT, lineHeight: 1.0 }}>
            €1.5M Seed Round
          </h2>
          <p style={{ fontSize: 36, color: MUTED, marginTop: 16 }}>
            Target close: Q3 2026 &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A at 18 months
          </p>
        </div>

        <div className="grid grid-cols-3 gap-10 mb-14">
          {[
            { label: "Round Structure", val: "€1.5M Seed", sub: "SAFE or priced round. Flexible to lead investor preference.", color: GOLD },
            { label: "What We're Looking For", val: "Strategic LP", sub: "Investors who understand that the next platform company won't look like a SaaS tool.", color: ACCENT },
            { label: "Milestones Unlocked", val: "Series A Ready", sub: "€1.5M ARR, 15 customers, NRR>110%. Reached at month 18 per operating model.", color: GREEN },
          ].map(({ label, val, sub, color }) => (
            <div key={label} className="rounded-2xl border p-10 flex flex-col gap-4"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.05)` }}>
              <p className="font-semibold" style={{ fontSize: 24, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{label}</p>
              <p className="font-black" style={{ fontSize: 44, color: TEXT, lineHeight: 1.1 }}>{val}</p>
              <p style={{ fontSize: 23, color: MUTED, lineHeight: 1.45 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-10 flex items-center gap-10"
          style={{ borderColor: `hsl(${ACCENT} / 0.25)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <Globe size={52} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <div>
            <p className="font-bold mb-3" style={{ fontSize: 32, color: TEXT }}>Why this is a safer long-term bet</p>
            <p style={{ fontSize: 26, color: MUTED, lineHeight: 1.55 }}>
              SaaS features commoditize. Infrastructure compounds. LIZA is not another AI tool competing for attention.
              It is the management layer that <strong style={{ color: "hsl(222 15% 25%)" }}>every organization with 50+ people will need</strong> as
              AI becomes the default way teams work.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 16 — Closing ──────────────────────────────────────────────────────

function Slide16Closing() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="mb-12 px-8 py-3.5 rounded-full border flex items-center gap-3"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>LIZA OS</span>
        </div>

        <h2 className="font-black mb-10" style={{ fontSize: 88, color: DARK_TEXT, lineHeight: 1.0 }}>
          The best organizations won't have<br />
          the best AI tools.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            They'll have the best knowledge systems.
          </span>
        </h2>

        <p style={{ fontSize: 34, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.6, marginBottom: 56 }}>
          LIZA is the infrastructure that makes organizational intelligence
          a compounding asset, not a human-dependent liability.
        </p>

        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))` }}>
            <Briefcase size={36} style={{ color: "white" }} />
            <span className="font-bold" style={{ fontSize: 28, color: "white" }}>Schedule a Founder Call</span>
          </div>
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl border"
            style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.08)` }}>
            <Shield size={36} style={{ color: `hsl(${ACCENT})` }} />
            <span className="font-bold" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Request Data Room</span>
          </div>
        </div>

        <p className="mt-14" style={{ fontSize: 26, color: DARK_SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential · Not for distribution
        </p>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01Cover /> },
  { id: 2, title: "Investment Thesis", component: <Slide02Thesis /> },
  { id: 3, title: "The Problem", component: <Slide03Problem /> },
  { id: 4, title: "Infrastructure Gap", component: <Slide04Market /> },
  { id: 5, title: "The Solution", component: <Slide05Solution /> },
  { id: 6, title: "How It Works", component: <Slide06Architecture /> },
  { id: 7, title: "Enterprise Validation", component: <Slide07CaseStudy /> },
  { id: 8, title: "Traction", component: <Slide08Traction /> },
  { id: 9, title: "Category Map", component: <Slide09CategoryMap /> },
  { id: 10, title: "Business Model", component: <Slide10BusinessModel /> },
  { id: 11, title: "Go-To-Market", component: <Slide11GTM /> },
  { id: 12, title: "Team", component: <Slide12Team /> },
  { id: 13, title: "Financials", component: <Slide13Financials /> },
  { id: 14, title: "Use of Funds", component: <Slide14UseOfFunds /> },
  { id: 15, title: "The Ask", component: <Slide15TheAsk /> },
  { id: 16, title: "Closing", component: <Slide16Closing /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function InvestorDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [exporting, setExporting] = useState(false);
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

  const handleExportPdf = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 200));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined))));
    await new Promise(r => setTimeout(r, 300));
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const container = exportRef.current;
      if (!container) return;
      const slideEls = Array.from(container.children) as HTMLElement[];
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
      for (let i = 0; i < slideEls.length; i++) {
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        const gradientEls = slideEls[i].querySelectorAll<HTMLElement>('span');
        const origStyles: string[] = [];
        const affected: HTMLElement[] = [];
        gradientEls.forEach((el) => {
          const cs = el.style.cssText;
          if (cs.includes('background-clip') || cs.includes('BackgroundClip') || cs.includes('text-fill-color') || cs.includes('TextFillColor')) {
            origStyles.push(cs);
            affected.push(el);
            el.style.cssText = `color: hsl(${ACCENT}); font: inherit;`;
          }
        });
        const canvas = await html2canvas(slideEls[i], { width: 1920, height: 1080, scale: 2, useCORS: true, backgroundColor: null });
        affected.forEach((el, j) => { el.style.cssText = origStyles[j]; });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 1920, 1080);
      }
      pdf.save('LIZA-OS-Investor-Deck.pdf');
    } finally {
      setExporting(false);
    }
  };

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
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${ACCENT})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: TEXT }}>
              Rotate your device to landscape
            </p>
            <p className="text-center" style={{ fontSize: 14, color: MUTED }}>
              for the best viewing experience
            </p>
          </div>
        )}

        <ScaledSlide>{slide.component}</ScaledSlide>

        {!isPortrait && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }}
              disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }}
              disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }}
              aria-label="Next slide"
            >
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
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>
            {current + 1}/{SLIDES.length}
          </span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <button onClick={handleExportPdf} disabled={exporting} className="p-1.5 rounded-lg disabled:opacity-50">
            {exporting ? <Loader2 size={16} className="animate-spin" style={{ color: MUTED }} /> : <Download size={16} style={{ color: MUTED }} />}
          </button>
        </div>

        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
              {s.component}
            </div>
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="text-sm font-mono px-2" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <button onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }} className="p-2 rounded-lg hover:bg-black/5 ml-2">
              <X size={20} style={{ color: MUTED }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: CARD_ALT }}>
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GOLD})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Investor Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.1)`, color: `hsl(${GOLD})` }}>
            Series Seed · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <Button size="sm" variant="ghost" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Download size={15} className="mr-1.5" />}
            {exporting ? "Exporting..." : "PDF"}
          </Button>
          <Button size="sm" variant="ghost" onClick={enterFullscreen}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
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
              <p className="text-[10px] px-1.5 py-1" style={{ color: SUBTLE }}>
                {String(i + 1).padStart(2, "0")} {s.title}
              </p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-3 gap-6">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("flex flex-col gap-2 rounded-xl overflow-hidden border-2 transition-all",
                      i === current ? "border-primary" : "border-transparent hover:border-border"
                    )}>
                    <div className="w-full" style={{ aspectRatio: "16/9" }}>
                      <ScaledSlide>{s.component}</ScaledSlide>
                    </div>
                    <p className="text-xs px-2 pb-2" style={{ color: MUTED }}>
                      <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> — {s.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden p-6">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border"
                style={{ borderColor: CHROME_BORDER }}>
                <ScaledSlide>{slide.component}</ScaledSlide>
              </div>
            </div>
          )}

          {!showGrid && (
            <div className="flex items-center justify-between px-8 py-3 border-t shrink-0"
              style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${GOLD})` : CHROME_BORDER,
                    }} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={prev} disabled={current === 0}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-xs font-mono" style={{ color: MUTED }}>
                  {current + 1} / {SLIDES.length}
                </span>
                <Button size="sm" variant="outline" onClick={next} disabled={current === SLIDES.length - 1}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <p className="text-xs" style={{ color: SUBTLE }}>← → navigate &nbsp; G grid &nbsp; F present</p>
            </div>
          )}
        </div>
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
            {s.component}
          </div>
        ))}
      </div>
    </div>
  );
}

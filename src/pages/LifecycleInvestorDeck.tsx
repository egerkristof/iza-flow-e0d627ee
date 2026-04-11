import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Zap, Target, BarChart3,
  Shield, ArrowRight, Layers, Briefcase,
  RefreshCw, BookOpen, AlertTriangle,
  Network, FileText, Eye, CheckCircle2,
  Brain, GitBranch, Workflow, Database,
  DollarSign, Rocket, Globe, Cog,
  Link2, GitMerge, Settings2, Box,
  ArrowDown, Sparkles, Split, CircleDot
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
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

// ─── Teal Trust palette ──────────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const TEAL = "174 97% 28%";
const SEAFOAM = "170 100% 33%";
const MINT = "160 96% 39%";
const WARM = "15 85% 55%";
const DARK_BG = "hsl(200 30% 6%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(200 15% 60%)";
const DARK_SUBTLE = "hsl(200 10% 45%)";
const DARK_CARD = "hsl(200 25% 10%)";
const RED = "0 72% 50%";
const GOLD = "45 95% 42%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";

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
      backgroundImage: `linear-gradient(hsl(200 15% 20%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 15% 20%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function SlideBar({ from = TEAL, to = MINT }: { from?: string; to?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

function Tag({ label, color = TEAL }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color})` }}>{label}</p>
  );
}

function DarkTag({ label, color = TEAL }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color} / 0.8)` }}>{label}</p>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-10 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>
            LIZA OS
          </span>
        </div>

        <h1 className="font-black mb-8" style={{ fontSize: 76, lineHeight: 1.05, color: DARK_TEXT }}>
          What happens when AI executes<br />
          faster than your organization<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            can think?
          </span>
        </h1>

        <p className="mb-10" style={{ fontSize: 30, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          AI scales execution. Nothing scales the judgment behind it.<br />
          <strong style={{ color: DARK_TEXT }}>We're building the infrastructure that does.</strong>
        </p>

        <div className="flex items-center gap-16">
          {[
            ["The How Layer", "The missing infrastructure for how organizations think and deliver"],
            ["LLMs", "Created the problem and finally made the solution possible"],
            ["LIZA OS", "Where knowledge stays live, connected, and executable"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2 max-w-[360px]">
              <span className="font-black" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>{k}</span>
              <span className="text-center" style={{ fontSize: 19, color: DARK_SUBTLE }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE TWO LAYERS: What vs How
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02TwoLayers() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 1 · The Shift" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          Every company has two layers.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Only one has infrastructure.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          "The What" — what you produce and sell — has $100B+ in tooling.
          "The How" — the knowledge and judgment that shapes those outputs — has Confluence and hope.
        </p>

        <div className="flex-1 flex gap-10">
          {/* The What */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col"
            style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: CARD_ALT }}>
            <div className="flex items-center gap-3 mb-5">
              <Layers size={28} style={{ color: `hsl(${BLUE})` }} />
              <span className="font-bold" style={{ fontSize: 30, color: TEXT }}>The What</span>
              <span className="ml-auto px-3 py-1 rounded-lg font-bold" style={{ fontSize: 16, background: `hsl(${BLUE} / 0.1)`, color: `hsl(${BLUE})` }}>$100B+ in tooling</span>
            </div>
            <p className="mb-5" style={{ fontSize: 20, color: MUTED }}>What you produce. Your artifacts, deliverables, outputs.</p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: "Code", system: "ALM — $34B", color: BLUE },
                { label: "Physical products", system: "PLM — $65B", color: GREEN },
                { label: "Regulated documents", system: "GxP — $18B", color: SEAFOAM },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4 rounded-lg"
                  style={{ background: `hsl(${item.color} / 0.06)`, border: `1px solid hsl(${item.color} / 0.12)` }}>
                  <span style={{ fontSize: 20, color: TEXT }}>{item.label}</span>
                  <span className="font-semibold px-3 py-1 rounded-md" style={{ fontSize: 16, color: `hsl(${item.color})`, background: `hsl(${item.color} / 0.1)` }}>{item.system}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>Version-controlled. Traceable. Governed.</p>
            </div>
          </div>

          {/* The How */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <div className="flex items-center gap-3 mb-5">
              <Brain size={28} style={{ color: `hsl(${WARM})` }} />
              <span className="font-bold" style={{ fontSize: 30, color: TEXT }}>The How</span>
              <span className="ml-auto px-3 py-1 rounded-lg font-bold" style={{ fontSize: 16, background: `hsl(${WARM} / 0.1)`, color: `hsl(${WARM})` }}>~$0 in infrastructure</span>
            </div>
            <p className="mb-5" style={{ fontSize: 20, color: MUTED }}>How you produce it. Your knowledge, judgment, methodology.</p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: "Sales methodology", system: "A wiki page nobody reads" },
                { label: "Onboarding expertise", system: "Tribal knowledge in someone's head" },
                { label: "Quality standards", system: "A PDF from 2019" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4 rounded-lg"
                  style={{ background: `hsl(${WARM} / 0.06)`, border: `1px solid hsl(${WARM} / 0.1)` }}>
                  <span style={{ fontSize: 20, color: TEXT }}>{item.label}</span>
                  <span className="italic" style={{ fontSize: 16, color: `hsl(${WARM})` }}>{item.system}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${WARM})` }}>Undocumented. Disconnected. Improvised.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — THE BOTTLENECK FLIP
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03BottleneckFlip() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 1 · The Bottleneck Flip" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.05 }}>
          AI made execution instant.<br />
          <span style={{ color: `hsl(${WARM})` }}>Now "the how" is the constraint.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          When execution was slow, imperfect knowledge was fine. AI removed the friction buffer.
          Now disconnected judgment compounds errors at machine speed.
        </p>

        <div className="flex-1 flex gap-10 items-center">
          {/* Old world */}
          <div className="flex-1 rounded-2xl border p-8" style={{ borderColor: `hsl(200 15% 16%)`, background: DARK_CARD }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: DARK_SUBTLE }}>Before AI</p>
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <p className="font-black mb-2" style={{ fontSize: 48, color: DARK_MUTED }}>Slow</p>
                <p style={{ fontSize: 18, color: DARK_SUBTLE }}>Execution speed</p>
              </div>
              <div className="text-center">
                <p className="font-black mb-2" style={{ fontSize: 48, color: `hsl(${GREEN})` }}>Fine</p>
                <p style={{ fontSize: 18, color: DARK_SUBTLE }}>Knowledge quality</p>
              </div>
            </div>
            <p className="mt-6 text-center" style={{ fontSize: 18, color: DARK_SUBTLE }}>
              Humans caught errors because they worked slowly enough to notice them.
            </p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-3">
            <Zap size={36} style={{ color: `hsl(${WARM})` }} />
            <p className="font-bold" style={{ fontSize: 18, color: `hsl(${WARM})` }}>AI arrives</p>
          </div>

          {/* New world */}
          <div className="flex-1 rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${WARM} / 0.4)`, background: `hsl(${WARM} / 0.06)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${WARM})` }}>After AI</p>
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <p className="font-black mb-2" style={{ fontSize: 48, color: `hsl(${GREEN})` }}>Instant</p>
                <p style={{ fontSize: 18, color: DARK_SUBTLE }}>Execution speed</p>
              </div>
              <div className="text-center">
                <p className="font-black mb-2" style={{ fontSize: 48, color: `hsl(${WARM})` }}>Bottleneck</p>
                <p style={{ fontSize: 18, color: DARK_SUBTLE }}>Knowledge quality</p>
              </div>
            </div>
            <p className="mt-6 text-center font-semibold" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              Each person prompts differently. 50 AI-generated proposals, 50 versions of "correct."
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl px-10 py-5 text-center"
          style={{ background: `hsl(${WARM} / 0.08)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
          <p style={{ fontSize: 24, color: DARK_TEXT }}>
            In 1995, a developer changing one module could break 50 others. That created ALM.<br />
            In 2025, a sales leader changing one pricing principle can break 50 AI-generated proposals.
            <strong style={{ color: `hsl(${WARM})` }}> Same problem. New layer.</strong>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — "WHAT" TOOLS FOR A "HOW" PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04WhatToolsHowProblem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 2 · The Problem" color={WARM} />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          We've been using "what" tools<br />
          <span style={{ color: `hsl(${WARM})` }}>for a "how" problem.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          A wiki page <em>about</em> your sales methodology is an artifact. A Confluence doc <em>describing</em>
          your onboarding process is an artifact. The "how" was always flattened into a "what" — a static document
          someone had to read, interpret, and manually apply.
        </p>

        <div className="flex-1 flex gap-8">
          {/* 2x2 matrix */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
            <div className="rounded-xl border p-6 flex flex-col items-center justify-center text-center"
              style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: SUBTLE }}>Static Knowledge</p>
              <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT }}>Confluence</p>
              <p style={{ fontSize: 17, color: MUTED }}>Write it once. Hope people find it. Pray they follow it.</p>
            </div>
            <div className="rounded-xl border p-6 flex flex-col items-center justify-center text-center"
              style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: SUBTLE }}>Static Knowledge</p>
              <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT }}>Notion</p>
              <p style={{ fontSize: 17, color: MUTED }}>Better filing cabinet. Still nobody reads it before prompting AI.</p>
            </div>
            <div className="rounded-xl border p-6 flex flex-col items-center justify-center text-center"
              style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: SUBTLE }}>Static Knowledge</p>
              <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT }}>SharePoint</p>
              <p style={{ fontSize: 17, color: MUTED }}>Documents go in. They never come back out in a useful form.</p>
            </div>
            <div className="rounded-xl border-2 p-6 flex flex-col items-center justify-center text-center"
              style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>Connected Knowledge</p>
              <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT }}>LIZA OS</p>
              <p style={{ fontSize: 17, color: MUTED }}>Knowledge stays live. Change one principle, everything downstream knows.</p>
            </div>
          </div>

          {/* Right: the key insight */}
          <div className="w-[480px] rounded-2xl border p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold mb-6" style={{ fontSize: 24, color: TEXT }}>The difference:</p>
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-bold mb-1" style={{ fontSize: 20, color: `hsl(${WARM})` }}>Documented How</p>
                <p style={{ fontSize: 18, color: MUTED }}>Write a doc → hope people read it → pray they apply it correctly → no way to know if they did</p>
              </div>
              <div className="w-full h-px" style={{ background: `hsl(${TEAL} / 0.15)` }} />
              <div>
                <p className="font-bold mb-1" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>Connected How</p>
                <p style={{ fontSize: 18, color: MUTED }}>Define a principle → it's automatically injected into execution → change it, everything updates → full traceability</p>
              </div>
            </div>
            <div className="mt-8 px-5 py-4 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
              <p className="font-semibold text-center" style={{ fontSize: 19, color: `hsl(${TEAL})` }}>
                "Notion is where knowledge goes to rest.<br />LIZA is where knowledge goes to work."
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — THE PROPAGATION CRISIS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05PropagationCrisis() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 2 · The Propagation Crisis" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.05 }}>
          When you update a principle in Confluence,<br />
          <span style={{ color: `hsl(${WARM})` }}>nothing happens.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          No downstream system knows. No proposal updates. No training deck gets flagged.
          In aviation, that's a grounded fleet. In knowledge work? "Just how things are."
        </p>

        <div className="flex-1 flex gap-10 items-center">
          {/* Without propagation */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col items-center" style={{ borderColor: `hsl(${RED} / 0.25)`, background: `hsl(${RED} / 0.06)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${RED})` }}>Today</p>
            <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-4" style={{ background: `hsl(${RED} / 0.15)` }}>
              <Settings2 size={36} style={{ color: `hsl(${RED})` }} />
            </div>
            <p className="font-bold mb-2 text-center" style={{ fontSize: 22, color: DARK_TEXT }}>Pricing model updated</p>
            <ArrowDown size={24} className="my-3" style={{ color: `hsl(${RED} / 0.5)` }} />
            <div className="flex flex-col gap-2 w-full">
              {["23 proposals", "8 training decks", "4 client contracts", "12 AI prompt templates"].map((item) => (
                <div key={item} className="flex items-center justify-between px-4 py-2 rounded-lg" style={{ background: `hsl(${RED} / 0.08)` }}>
                  <span style={{ fontSize: 18, color: DARK_MUTED }}>{item}</span>
                  <X size={16} style={{ color: `hsl(${RED})` }} />
                </div>
              ))}
            </div>
            <p className="mt-4 font-semibold" style={{ fontSize: 17, color: `hsl(${RED})` }}>Still using old version. Nobody flagged.</p>
          </div>

          {/* With LIZA */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col items-center" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>With LIZA OS</p>
            <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-4" style={{ background: `hsl(${TEAL} / 0.15)` }}>
              <Settings2 size={36} style={{ color: `hsl(${TEAL})` }} />
            </div>
            <p className="font-bold mb-2 text-center" style={{ fontSize: 22, color: DARK_TEXT }}>Pricing model updated</p>
            <ArrowDown size={24} className="my-3" style={{ color: `hsl(${TEAL} / 0.6)` }} />
            <div className="flex flex-col gap-2 w-full">
              {["23 proposals flagged", "8 training decks queued", "4 contracts version-bumped", "12 prompts auto-synced"].map((item) => (
                <div key={item} className="flex items-center justify-between px-4 py-2 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <span style={{ fontSize: 18, color: DARK_TEXT }}>{item}</span>
                  <CheckCircle2 size={16} style={{ color: `hsl(${TEAL})` }} />
                </div>
              ))}
            </div>
            <p className="mt-4 font-semibold" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>One change. Automatic propagation.</p>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — THE WAVE INTERSECTION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06WaveIntersection() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 3 · The Insight" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          Artifacts are where knowledge<br />
          <span style={{ color: `hsl(${TEAL})` }}>and execution meet.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Think of two waves: the flow of knowledge (how you think) and the flow of work (what you produce).
          Artifacts — proposals, SOPs, deliverables — are where these waves intersect.
          In an AI-native world, they become inseparable.
        </p>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Visual wave diagram */}
          <div className="w-full max-w-[1400px] relative">
            {/* Knowledge wave */}
            <div className="flex items-center gap-4 mb-3">
              <Brain size={24} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>Knowledge Flow</span>
              <span style={{ fontSize: 18, color: MUTED }}>— methodologies, standards, expertise, judgment</span>
            </div>
            <div className="w-full h-16 rounded-xl relative overflow-hidden mb-2" style={{ background: `hsl(${TEAL} / 0.08)` }}>
              <svg viewBox="0 0 1400 64" className="w-full h-full">
                <path d="M0 32 Q175 0 350 32 Q525 64 700 32 Q875 0 1050 32 Q1225 64 1400 32" fill="none" stroke={`hsl(${TEAL})`} strokeWidth="3" opacity="0.6" />
              </svg>
            </div>

            {/* Intersection points */}
            <div className="flex justify-around my-3">
              {["Proposal", "Training Deck", "SOP", "Client Brief"].map((item) => (
                <div key={item} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, hsl(${TEAL} / 0.2), hsl(${SEAFOAM} / 0.2))`, border: `2px solid hsl(${TEAL} / 0.4)` }}>
                    <CircleDot size={20} style={{ color: `hsl(${TEAL})` }} />
                  </div>
                  <span className="font-semibold" style={{ fontSize: 16, color: TEXT }}>{item}</span>
                  <span style={{ fontSize: 13, color: SUBTLE }}>Artifact</span>
                </div>
              ))}
            </div>

            {/* Execution wave */}
            <div className="w-full h-16 rounded-xl relative overflow-hidden mt-2" style={{ background: `hsl(${SEAFOAM} / 0.08)` }}>
              <svg viewBox="0 0 1400 64" className="w-full h-full">
                <path d="M0 32 Q175 64 350 32 Q525 0 700 32 Q875 64 1050 32 Q1225 0 1400 32" fill="none" stroke={`hsl(${SEAFOAM})`} strokeWidth="3" opacity="0.6" />
              </svg>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <Workflow size={24} style={{ color: `hsl(${SEAFOAM})` }} />
              <span className="font-bold" style={{ fontSize: 22, color: `hsl(${SEAFOAM})` }}>Execution Flow</span>
              <span style={{ fontSize: 18, color: MUTED }}>— workflows, tasks, AI-assisted production, delivery</span>
            </div>
          </div>

          <div className="mt-10 rounded-xl px-10 py-5 text-center max-w-[1200px]"
            style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
            <p style={{ fontSize: 23, color: TEXT }}>
              In the old world, these waves were slow enough to sync manually.
              AI accelerated execution; knowledge waves can't keep up.
              <strong style={{ color: `hsl(${TEAL})` }}> LIZA synchronizes them.</strong>
            </p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — LLMs: CAUSE AND CURE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07LLMsCauseCure() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 3 · Cause and Cure" color={TEAL} />
        <h2 className="font-black mb-6" style={{ fontSize: 58, color: DARK_TEXT, lineHeight: 1.05 }}>
          The same technology that broke<br />knowledge management
          <span style={{ color: `hsl(${TEAL})` }}> can fix it.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          LLMs are the first technology that can synthesize and understand semantic knowledge at scale.
          That's what makes a "How Layer" possible for the first time in history.
        </p>

        <div className="flex-1 flex gap-10">
          {/* Cause */}
          <div className="flex-1 rounded-2xl border p-8" style={{ borderColor: `hsl(${WARM} / 0.25)`, background: `hsl(${WARM} / 0.06)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${WARM})` }}>LLMs as the Cause</p>
            <div className="flex flex-col gap-4">
              {[
                "Removed the human 'friction buffer' — execution is now instant",
                "Everyone prompts differently — 50 people, 50 versions of 'correct'",
                "Drift compounds at machine speed — errors scale faster than reviews",
                "Tribal knowledge can't keep up — seniors can't review 100x more output",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3 rounded-lg" style={{ background: `hsl(${WARM} / 0.08)` }}>
                  <AlertTriangle size={18} style={{ color: `hsl(${WARM})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cure */}
          <div className="flex-1 rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>LLMs as the Cure</p>
            <div className="flex flex-col gap-4">
              {[
                "Semantic dependency tracking — understand what depends on what",
                "Automatic change impact analysis across unstructured knowledge",
                "Knowledge extraction from conversations, docs, and interactions",
                "Continuous integrity checks between standards and live outputs",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: DARK_TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl px-10 py-5 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <p style={{ fontSize: 23, color: DARK_TEXT }}>
            Configuration Management worked for code because code has imports and type systems.
            <strong style={{ color: `hsl(${TEAL})` }}> LLMs give human knowledge the same thing.</strong>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — LIZA OS: The Four-Step Loop
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08LizaOS() {
  const steps = [
    {
      icon: <BookOpen size={32} />, step: "01", title: "Capture",
      desc: "Your best people's expertise — playbooks, standards, tribal knowledge — becomes structured, versionable, and alive. Source control for judgment.",
    },
    {
      icon: <Network size={32} />, step: "02", title: "Organize",
      desc: "Knowledge organized into governed bundles scoped to roles, teams, and workflows. Dependencies mapped. A requirements graph for expertise.",
    },
    {
      icon: <Zap size={32} />, step: "03", title: "Execute",
      desc: "AI-assisted work runs with your team's best judgment built in. Quality gates ensure review at critical points. CI/CD for knowledge work.",
    },
    {
      icon: <RefreshCw size={32} />, step: "04", title: "Propagate",
      desc: "When knowledge changes, every connected artifact updates. When artifacts reveal patterns, knowledge improves. Connected Change, automated.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 4 · The Solution" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          LIZA: The How Layer<br />
          <span style={{ color: `hsl(${TEAL})` }}>for AI-native organizations.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          Four steps. One loop. The disciplines that made aviation safe, software reliable, and pharma
          compliant — now applied to how organizations think, decide, and deliver.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="rounded-2xl border p-7 flex flex-col relative"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: i === 3 ? `hsl(${TEAL} / 0.06)` : CARD_ALT }}>
              <span className="font-black tracking-[0.2em] mb-4" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
                STEP {s.step}
              </span>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                {s.icon}
              </div>
              <p className="font-bold mb-3" style={{ fontSize: 28, color: TEXT }}>{s.title}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.55 }}>{s.desc}</p>
              {i < 3 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={22} style={{ color: `hsl(${TEAL} / 0.4)` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — THE LOVABLE PROOF
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09LovableProof() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 4 · The Proof of Concept" color={SEAFOAM} />
        <h2 className="font-black mb-6" style={{ fontSize: 58, color: DARK_TEXT, lineHeight: 1.05 }}>
          From documented how<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>to connected how.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          This already works in code. When you change a component in Lovable, 15 pages update automatically.
          We do the same thing for knowledge.
        </p>

        <div className="flex-1 flex gap-10 items-center">
          <div className="flex-1 rounded-2xl border p-8 flex flex-col gap-6" style={{ borderColor: `hsl(${BLUE} / 0.25)`, background: `hsl(${BLUE} / 0.06)` }}>
            <div className="flex items-center gap-3">
              <GitBranch size={28} style={{ color: `hsl(${BLUE})` }} />
              <span className="font-bold" style={{ fontSize: 26, color: DARK_TEXT }}>In Code (ALM)</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Change a component → dependent pages update",
                "Update an API → consuming services get flagged",
                "Modify a type → compiler catches every reference",
                "Version control tracks every change, every author",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-4 py-3 rounded-lg" style={{ background: `hsl(${BLUE} / 0.08)` }}>
                  <CheckCircle2 size={16} style={{ color: `hsl(${BLUE})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="font-semibold text-center" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>Solved. $34B market.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ArrowRight size={36} style={{ color: `hsl(${TEAL})` }} />
            <p className="font-bold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>Same discipline</p>
            <p className="font-bold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>New layer</p>
          </div>

          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col gap-6" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center gap-3">
              <Brain size={28} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold" style={{ fontSize: 26, color: DARK_TEXT }}>In Knowledge (LIZA)</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Change a methodology → dependent proposals update",
                "Update a standard → affected training decks flagged",
                "Modify a principle → every AI prompt that uses it syncs",
                "Version control tracks every knowledge change, every author",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-4 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <CheckCircle2 size={16} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: DARK_TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="font-semibold text-center" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Building it. Whitespace.</p>
          </div>
        </div>
      </div>
      <SlideBar from={BLUE} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — FROM DOCUMENTED TO CONNECTED
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10DocumentedToConnected() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 4 · The Experience" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          What changes in practice.<br />
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Three personas, one system. Knowledge flows from experts to operators to leaders — and back.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-6">
          {[
            {
              role: "The Architect", persona: "Expert / T-Shaped Professional",
              before: "Writes methodologies in Confluence. Nobody follows them consistently.",
              after: "Defines live playbooks that automatically shape AI execution across every team.",
              color: TEAL,
            },
            {
              role: "The Operator", persona: "Frontline Worker",
              before: "Prompts AI with personal guesses. Different output every time.",
              after: "Opens a workbook with pre-loaded context. AI executes with the organization's best judgment.",
              color: SEAFOAM,
            },
            {
              role: "The Manager", persona: "Leader / M-Shaped",
              before: "Asks 'Is the team following the methodology?' Gets a shrug.",
              after: "Sees live drift scores, compliance rates, and knowledge health across all workbooks.",
              color: MINT,
            },
          ].map((item) => (
            <div key={item.role} className="rounded-2xl border p-7 flex flex-col"
              style={{ borderColor: `hsl(${item.color} / 0.2)`, background: CARD_ALT }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold" style={{ fontSize: 26, color: TEXT }}>{item.role}</span>
              </div>
              <p className="mb-5" style={{ fontSize: 17, color: `hsl(${item.color})` }}>{item.persona}</p>

              <div className="mb-4 px-4 py-3 rounded-lg" style={{ background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.1)` }}>
                <p className="font-semibold mb-1" style={{ fontSize: 15, color: `hsl(${RED} / 0.7)` }}>Before</p>
                <p style={{ fontSize: 18, color: MUTED }}>{item.before}</p>
              </div>

              <div className="px-4 py-3 rounded-lg flex-1" style={{ background: `hsl(${item.color} / 0.06)`, border: `1px solid hsl(${item.color} / 0.15)` }}>
                <p className="font-semibold mb-1" style={{ fontSize: 15, color: `hsl(${item.color})` }}>With LIZA</p>
                <p style={{ fontSize: 18, color: TEXT }}>{item.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — CATEGORY EVOLUTION + COMPETITIVE LANDSCAPE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11MarketAndCompetition() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 5 · The Market" color={TEAL} />
        <h2 className="font-black mb-4" style={{ fontSize: 56, color: DARK_TEXT, lineHeight: 1.05 }}>
          The category evolution.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Same discipline. New layer.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: DARK_MUTED, maxWidth: 1050 }}>
          Every time an industry applied lifecycle governance to its core artifacts, a multi-billion dollar category formed.
          Knowledge work is next.
        </p>

        <div className="flex-1 flex flex-col gap-5">
          {/* Evolution timeline */}
          <div className="flex gap-4 mb-2">
            {[
              { era: "1990s", name: "ALM", layer: "Code", market: "$34B", color: BLUE },
              { era: "2000s", name: "PLM", layer: "Products", market: "$65B", color: GREEN },
              { era: "2010s", name: "GxP", layer: "Regulated docs", market: "$18B", color: SEAFOAM },
              { era: "Now", name: "The How Layer", layer: "Knowledge & Judgment", market: "Whitespace", color: TEAL, highlight: true },
            ].map((item, i) => (
              <div key={item.name} className="flex-1 flex items-center gap-3">
                <div className="rounded-xl px-5 py-4 flex-1 text-center" style={{
                  background: item.highlight ? `hsl(${item.color} / 0.12)` : `hsl(${item.color} / 0.06)`,
                  border: item.highlight ? `2px solid hsl(${item.color} / 0.4)` : `1px solid hsl(${item.color} / 0.15)`,
                }}>
                  <p className="font-bold mb-1" style={{ fontSize: 14, color: `hsl(${item.color})` }}>{item.era}</p>
                  <p className="font-black" style={{ fontSize: 24, color: DARK_TEXT }}>{item.name}</p>
                  <p style={{ fontSize: 15, color: DARK_MUTED }}>{item.layer}</p>
                  <p className="font-bold mt-1" style={{ fontSize: 16, color: `hsl(${item.color})` }}>{item.market}</p>
                </div>
                {i < 3 && <ArrowRight size={20} style={{ color: DARK_SUBTLE, flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          {/* Competitors */}
          <div className="flex gap-4 flex-1">
            {[
              { name: "Edra", raised: "$30M", focus: "Repeatable ops automation", gap: "No judgment, no expertise capture" },
              { name: "Mem0", raised: "$44.5M", focus: "Memory for AI agents", gap: "Stores history, doesn't govern knowledge" },
              { name: "Interloom", raised: "$16.5M", focus: "Knowledge graph mapping", gap: "Captures knowledge, no change propagation" },
            ].map((c) => (
              <div key={c.name} className="flex-1 rounded-xl p-5 flex flex-col" style={{ background: DARK_CARD, border: `1px solid hsl(200 15% 16%)` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>{c.name}</span>
                  <span className="px-2 py-1 rounded font-bold" style={{ fontSize: 14, background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>{c.raised}</span>
                </div>
                <p className="mb-2" style={{ fontSize: 17, color: DARK_MUTED }}>{c.focus}</p>
                <p className="mt-auto flex items-start gap-2" style={{ fontSize: 16, color: DARK_SUBTLE }}>
                  <X size={14} style={{ color: `hsl(${RED})`, marginTop: 3, flexShrink: 0 }} />{c.gap}
                </p>
              </div>
            ))}

            <div className="flex-1 rounded-xl p-5 flex flex-col border-2" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>LIZA OS</span>
                <span className="px-2 py-1 rounded font-bold" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})` }}>Full Loop</span>
              </div>
              <p className="mb-2" style={{ fontSize: 17, color: DARK_MUTED }}>Capture, govern, execute, propagate</p>
              <p className="mt-auto flex items-start gap-2" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
                <CheckCircle2 size={14} style={{ marginTop: 3, flexShrink: 0 }} />The only full knowledge lifecycle system
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={TEAL} to={MINT} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — TRACTION & GTM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Traction & Go-to-Market" color={SEAFOAM} />
        <h2 className="font-black mb-6" style={{ fontSize: 58, color: TEXT, lineHeight: 1.1 }}>
          Consulting as the wedge.<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>Platform as the moat.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          We land with consulting — solving real knowledge lifecycle problems.
          We expand with the platform — making the solution permanent and self-improving.
        </p>

        <div className="flex-1 flex gap-10">
          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-5">
              {[
                { stat: "15+", label: "Clients across industries", icon: <Users size={24} /> },
                { stat: "8", label: "Countries served", icon: <Globe size={24} /> },
                { stat: "15+", label: "Years consulting expertise", icon: <Briefcase size={24} /> },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="rounded-xl p-6 flex flex-col items-center text-center"
                  style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <div className="mb-3" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black mb-1" style={{ fontSize: 40, color: TEXT }}>{stat}</p>
                  <p style={{ fontSize: 17, color: MUTED }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: CARD_ALT, border: `1px solid hsl(215 10% 90%)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 20, color: TEXT }}>Named Clients</p>
              <div className="flex gap-4">
                {["aliz.ai (AI Consulting)", "Alverad (Cybersecurity)"].map((c) => (
                  <div key={c} className="px-4 py-2 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                    <span style={{ fontSize: 18, color: MUTED }}>{c}</span>
                  </div>
                ))}
                <div className="px-4 py-2 rounded-lg" style={{ background: CARD_ALT, border: `1px solid hsl(215 10% 90%)` }}>
                  <span style={{ fontSize: 18, color: SUBTLE }}>+ confidential enterprise clients</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-4">
            <p className="font-bold mb-1" style={{ fontSize: 20, color: TEXT }}>Vertical Expansion</p>
            {[
              { vertical: "Professional Services", stage: "Active", color: GREEN },
              { vertical: "Pharma — Medicine Lifecycle", stage: "Pilot", color: SEAFOAM },
              { vertical: "AEC — Architecture & Engineering", stage: "Design Partner", color: TEAL },
              { vertical: "Enterprise GTM", stage: "Pipeline", color: GOLD },
            ].map((v) => (
              <div key={v.vertical} className="flex items-center justify-between rounded-xl px-6 py-4"
                style={{ background: CARD_ALT, border: `1px solid hsl(215 10% 90%)` }}>
                <span style={{ fontSize: 20, color: TEXT }}>{v.vertical}</span>
                <span className="px-3 py-1 rounded-lg font-semibold" style={{ fontSize: 16, background: `hsl(${v.color} / 0.1)`, color: `hsl(${v.color})` }}>{v.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — TEAM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13Team() {
  const team = [
    {
      name: "István Boscha", role: "Product & CEO",
      bio: "Product leader who has spent 15+ years at the intersection of consulting and technology. Built and scaled teams across enterprise software, AI, and digital transformation.",
      photo: istvanPhoto,
    },
    {
      name: "Kristóf Éger", role: "Enterprise Narrative & GTM",
      bio: "Enterprise strategist with deep experience in category creation, go-to-market, and positioning complex B2B platforms for executive audiences.",
      photo: kristofPhoto,
    },
    {
      name: "Zoltán Kauker", role: "Scalable AI Architecture",
      bio: "Engineering leader specializing in AI infrastructure, knowledge systems, and scalable architectures for enterprise-grade applications.",
      photo: zoltanPhoto,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Team" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          Practitioners who've lived the problem.
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          We've spent our careers helping organizations standardize expertise and scale quality.
          LIZA is the How Layer we wished existed for the work we do every day.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {team.map((t) => (
            <div key={t.name} className="rounded-2xl border p-8 flex flex-col items-center text-center"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: DARK_CARD }}>
              <img src={t.photo} alt={t.name}
                className="w-32 h-32 rounded-full object-cover mb-6"
                style={{ border: `3px solid hsl(${TEAL} / 0.3)` }} />
              <p className="font-bold mb-1" style={{ fontSize: 28, color: DARK_TEXT }}>{t.name}</p>
              <p className="font-semibold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>{t.role}</p>
              <p style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.55 }}>{t.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p style={{ fontSize: 20, color: DARK_SUBTLE }}>
            Core team supported by specialist consultants depending on engagement scope.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — THE ASK
// ═══════════════════════════════════════════════════════════════════════════════

function Slide14TheAsk() {
  const allocation = [
    { label: "Product & Engineering", pct: "50%", color: TEAL },
    { label: "Design Partnerships", pct: "25%", color: SEAFOAM },
    { label: "GTM & Category Building", pct: "15%", color: MINT },
    { label: "Operations", pct: "10%", color: GOLD },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-8 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <DollarSign size={22} style={{ color: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            Seed Round
          </span>
        </div>

        <h2 className="font-black mb-6" style={{ fontSize: 88, color: DARK_TEXT }}>
          €300K
        </h2>
        <p className="mb-10" style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 900, lineHeight: 1.5 }}>
          To complete the platform, onboard design partners,<br />and establish the category.
        </p>

        <div className="flex gap-6 mb-14">
          {allocation.map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl"
              style={{ background: `hsl(${a.color} / 0.08)`, border: `1px solid hsl(${a.color} / 0.2)`, minWidth: 200 }}>
              <span className="font-black" style={{ fontSize: 36, color: `hsl(${a.color})` }}>{a.pct}</span>
              <span style={{ fontSize: 18, color: DARK_MUTED }}>{a.label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-12 py-6 mb-10"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.5 }}>
            $100B+ governs what companies produce.<br />
            Zero governs how they produce it.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>We're building The How Layer.</strong>
          </p>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-3 px-14 py-6 rounded-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))` }}>
            <span className="font-bold" style={{ fontSize: 26, color: "white" }}>Schedule a Founder Call</span>
          </div>
          <div className="flex flex-col items-center gap-3 px-14 py-6 rounded-2xl border"
            style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.08)` }}>
            <span className="font-bold" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>Request Data Room</span>
          </div>
        </div>

        <p className="mt-10" style={{ fontSize: 22, color: DARK_SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential
        </p>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01Cover /> },
  { id: 2, title: "The Two Layers", component: <Slide02TwoLayers /> },
  { id: 3, title: "The Bottleneck Flip", component: <Slide03BottleneckFlip /> },
  { id: 4, title: "What Tools, How Problem", component: <Slide04WhatToolsHowProblem /> },
  { id: 5, title: "The Propagation Crisis", component: <Slide05PropagationCrisis /> },
  { id: 6, title: "The Wave Intersection", component: <Slide06WaveIntersection /> },
  { id: 7, title: "LLMs: Cause & Cure", component: <Slide07LLMsCauseCure /> },
  { id: 8, title: "LIZA OS", component: <Slide08LizaOS /> },
  { id: 9, title: "The Lovable Proof", component: <Slide09LovableProof /> },
  { id: 10, title: "The Experience", component: <Slide10DocumentedToConnected /> },
  { id: 11, title: "Market & Competition", component: <Slide11MarketAndCompetition /> },
  { id: 12, title: "Traction & GTM", component: <Slide12Traction /> },
  { id: 13, title: "Team", component: <Slide13Team /> },
  { id: 14, title: "The Ask", component: <Slide14TheAsk /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function LifecycleInvestorDeck() {
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
              style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${TEAL})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: TEXT }}>Rotate your device to landscape</p>
            <p className="text-center" style={{ fontSize: 14, color: MUTED }}>for the best viewing experience</p>
          </div>
        )}
        <ScaledSlide>{slide.component}</ScaledSlide>
        {!isPortrait && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }} disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Previous slide">
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next slide">
              <ChevronRight size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
          style={{ background: "hsl(0 0% 100% / 0.9)", border: `1px solid ${CHROME_BORDER}`, backdropFilter: "blur(8px)",
            opacity: mobileControlsVisible ? 1 : 0, pointerEvents: mobileControlsVisible ? "auto" : "none" }}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronLeft size={18} style={{ color: TEXT }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-How-Layer-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${TEAL})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — The How Layer</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${TEAL} / 0.1)`, color: `hsl(${TEAL})` }}>
            {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-How-Layer-Deck" slideCount={SLIDES.length} variant="desktop" />
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
              <button onClick={prev} disabled={current === 0}
                className="flex items-center gap-1 text-sm disabled:opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: MUTED }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm font-mono" style={{ color: SUBTLE }}>
                {current + 1} / {SLIDES.length}
              </span>
              <button onClick={next} disabled={current === SLIDES.length - 1}
                className="flex items-center gap-1 text-sm disabled:opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: MUTED }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
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

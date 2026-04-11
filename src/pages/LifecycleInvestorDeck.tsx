import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Zap, Target, BarChart3,
  Shield, ArrowRight, Layers, Briefcase,
  RefreshCw, BookOpen, AlertTriangle,
  Network, FileText, Eye, CheckCircle2,
  Brain, GitBranch, Workflow, Database,
  DollarSign, Rocket, Globe
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
// ACT 1 — THE SHIFT
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────

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

        <h1 className="font-black mb-8" style={{ fontSize: 88, lineHeight: 1.0, color: DARK_TEXT }}>
          AI is beginning to<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            scale judgment.
          </span>
        </h1>

        <p style={{ fontSize: 34, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          The infrastructure to govern it is just forming.<br />
          <strong style={{ color: DARK_TEXT }}>We're building the complete version.</strong>
        </p>

        <div className="mt-16 flex items-center gap-16">
          {[
            ["The Problem", "AI produces faster than organizations can govern"],
            ["The Shift", "A new category is forming — $98M+ already invested"],
            ["Our Edge", "We govern the full chain, not just memory or context"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2 max-w-[360px]">
              <span className="font-black" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>{k}</span>
              <span className="text-center" style={{ fontSize: 21, color: DARK_SUBTLE }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 02 — The AI Stack Is Commoditizing ────────────────────────────────

function Slide02Commoditization() {
  const layers = [
    { label: "Chat Interfaces", desc: "Every tool has one. ChatGPT, Copilot, Gemini — it's table stakes.", color: DARK_SUBTLE, opacity: 0.3 },
    { label: "AI Agents", desc: "Thousands of startups building task-specific agents. Rapidly commoditizing.", color: DARK_SUBTLE, opacity: 0.5 },
    { label: "Context & Memory", desc: "Emerging category. Edra, Mem0, Interloom — $98M+ raised to solve this.", color: SEAFOAM, opacity: 0.8 },
    { label: "Governed Execution", desc: "Where judgment meets production. Almost nobody is here yet.", color: TEAL, opacity: 1 },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 1 · The Shift" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Every AI startup is building<br />
          <span style={{ color: `hsl(${TEAL})` }}>the same three things.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          Chats, Agents, Context. These are being commoditized in real-time.
          The value is moving up the stack — to where AI meets human judgment.
        </p>

        <div className="flex-1 flex items-center gap-10">
          <div className="flex-1 flex flex-col gap-4">
            {layers.map((l, i) => (
              <div key={l.label} className="flex items-center gap-6 rounded-2xl border p-7"
                style={{
                  borderColor: i < 2 ? `hsl(215 10% 85%)` : `hsl(${l.color} / 0.3)`,
                  background: i < 2 ? `hsl(220 15% 97%)` : `hsl(${l.color} / 0.06)`,
                }}>
                <div className="w-10 font-black" style={{ fontSize: 24, color: i < 2 ? SUBTLE : `hsl(${l.color})` }}>
                  L{i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold mb-1" style={{
                    fontSize: 28,
                    color: i < 2 ? MUTED : TEXT,
                    textDecoration: i < 2 ? "line-through" : "none",
                    textDecorationColor: i < 2 ? `hsl(215 10% 80%)` : undefined,
                  }}>{l.label}</p>
                  <p style={{ fontSize: 20, color: MUTED }}>{l.desc}</p>
                </div>
                {i === 3 && (
                  <div className="px-5 py-2 rounded-lg font-bold" style={{ fontSize: 18, background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})` }}>
                    LIZA OS
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-[360px] flex flex-col items-center gap-3">
            <div className="w-full rounded-2xl p-8 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `2px dashed hsl(${TEAL} / 0.25)` }}>
              <p className="font-black mb-2" style={{ fontSize: 56, color: `hsl(${TEAL})` }}>$98M+</p>
              <p style={{ fontSize: 20, color: MUTED }}>raised in the emerging<br />"Context & Memory" category</p>
            </div>
            <div className="w-full rounded-xl p-5 text-center" style={{ background: CARD_ALT }}>
              <p style={{ fontSize: 18, color: SUBTLE }}>The value isn't in building<br />another chatbot — it's in what<br /><strong style={{ color: TEXT }}>governs what the chatbot does.</strong></p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 03 — Three Waves ──────────────────────────────────────────────────

function Slide03ThreeWaves() {
  const waves = [
    {
      wave: "Wave 1", label: "Stateless Assistants", period: "2022–2023",
      examples: "ChatGPT · Copilot · Jasper",
      desc: "One question, one answer. No memory of who you are, what you've done, or what matters to your business.",
      color: DARK_SUBTLE, bg: `hsl(200 10% 12%)`,
    },
    {
      wave: "Wave 2", label: "Stateful — Category Forming", period: "2023–now",
      examples: "Edra ($30M) · Mem0 ($44.5M) · Interloom ($16.5M)",
      desc: "AI that remembers. These tools capture preferences, history, and organizational knowledge. But they stop at memory.",
      color: SEAFOAM, bg: `hsl(${SEAFOAM} / 0.08)`,
    },
    {
      wave: "LIZA", label: "The Complete Version", period: "Now",
      examples: "Capture + Govern + Execute + Propagate",
      desc: "Not just memory — the system that connects what your people know to what they produce. And keeps both in sync.",
      color: TEAL, bg: `hsl(${TEAL} / 0.12)`,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Market Evolution" color={SEAFOAM} />
        <h2 className="font-black mb-6" style={{ fontSize: 64, color: DARK_TEXT, lineHeight: 1.05 }}>
          Three waves of AI infrastructure.
          <br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>We're building for the third.</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          Each wave solves a deeper problem. Wave 1 gave everyone an assistant. Wave 2 gave the assistant memory.
          LIZA gives it judgment — and connects it to real work.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {waves.map((w) => (
            <div key={w.wave} className="rounded-2xl border p-8 flex flex-col"
              style={{
                borderColor: `hsl(${w.color} / 0.3)`,
                background: w.bg,
              }}>
              <div className="flex items-center justify-between mb-5">
                <span className="font-black tracking-[0.2em] uppercase" style={{ fontSize: 22, color: `hsl(${w.color})` }}>{w.wave}</span>
                <span className="font-mono" style={{ fontSize: 18, color: `hsl(${w.color} / 0.6)` }}>{w.period}</span>
              </div>
              <p className="font-bold mb-4" style={{ fontSize: 32, color: DARK_TEXT }}>{w.label}</p>
              <p className="mb-6" style={{ fontSize: 20, color: DARK_MUTED, lineHeight: 1.55 }}>{w.desc}</p>
              <div className="mt-auto pt-5 border-t" style={{ borderColor: `hsl(${w.color} / 0.15)` }}>
                <p className="font-mono" style={{ fontSize: 17, color: `hsl(${w.color} / 0.7)` }}>{w.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={SEAFOAM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 2 — THE CONSEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 04 — The Propagation Crisis ───────────────────────────────────────

function Slide04PropagationCrisis() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 2 · The Consequence" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          AI scales output 100×.<br />
          <span style={{ color: `hsl(${WARM})` }}>But nothing is connected.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          The more AI produces, the more artifacts exist. Proposals, reports, training materials, client briefs —
          all created faster than ever. But when something changes, none of them know about it.
        </p>

        <div className="flex-1 flex gap-10 items-center">
          {/* Fan-out diagram */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[700px] h-[400px]">
              {/* Center node */}
              <div className="absolute left-[300px] top-[160px] w-[120px] h-[80px] rounded-xl flex items-center justify-center font-bold"
                style={{ fontSize: 20, background: `hsl(${WARM} / 0.15)`, color: `hsl(${WARM})`, border: `2px solid hsl(${WARM} / 0.3)` }}>
                <AlertTriangle size={20} className="mr-2" /> Change
              </div>

              {/* Artifact nodes */}
              {[
                { label: "Proposal A", x: 0, y: 0 },
                { label: "Training Deck", x: 0, y: 120 },
                { label: "Client Brief", x: 0, y: 240 },
                { label: "SOP v4.2", x: 0, y: 340 },
                { label: "Onboarding", x: 560, y: 0 },
                { label: "Pricing Sheet", x: 560, y: 120 },
                { label: "Audit Report", x: 560, y: 240 },
                { label: "Board Memo", x: 560, y: 340 },
              ].map((node) => (
                <div key={node.label} className="absolute flex items-center gap-2 px-5 py-3 rounded-lg"
                  style={{
                    left: node.x, top: node.y, fontSize: 18, color: MUTED,
                    background: `hsl(${RED} / 0.04)`, border: `1px dashed hsl(${RED} / 0.2)`,
                  }}>
                  <FileText size={16} style={{ color: `hsl(${RED} / 0.5)` }} />
                  {node.label}
                  <X size={14} style={{ color: `hsl(${RED} / 0.4)` }} />
                </div>
              ))}
            </div>
            <p className="text-center mt-4" style={{ fontSize: 22, color: SUBTLE }}>
              One methodology update should reach every connected artifact.<br />
              <strong style={{ color: `hsl(${WARM})` }}>Today, it reaches zero.</strong>
            </p>
          </div>

          {/* Stats */}
          <div className="w-[380px] flex flex-col gap-6">
            {[
              { stat: "47", unit: "artifacts", label: "touched by an average methodology change", color: WARM },
              { stat: "0", unit: "of them", label: "update automatically when the methodology evolves", color: RED },
              { stat: "100×", unit: "speed", label: "more output means 100× more things that fall out of sync", color: TEAL },
            ].map(({ stat, unit, label, color }) => (
              <div key={stat} className="rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-black" style={{ fontSize: 44, color: `hsl(${color})` }}>{stat}</span>
                  <span className="font-semibold" style={{ fontSize: 20, color: `hsl(${color} / 0.7)` }}>{unit}</span>
                </div>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ─── Slide 05 — Sound Familiar? ──────────────────────────────────────────────

function Slide05SoundFamiliar() {
  const scenarios = [
    {
      icon: <Users size={32} />,
      title: "Your best person left.",
      desc: "They took 8 years of know-how with them. The wiki they wrote is outdated. New hires make the same mistakes for months.",
      color: WARM,
    },
    {
      icon: <Zap size={32} />,
      title: "AI made everyone faster — and more inconsistent.",
      desc: "Each team member prompts differently, uses different shortcuts, gets different results. Output volume is up. Quality consistency is down.",
      color: TEAL,
    },
    {
      icon: <AlertTriangle size={32} />,
      title: "A regulation changed. Nobody knows which deliverables are wrong.",
      desc: "The compliance team updated the standard. But the 23 proposals, 8 training decks, and 4 client contracts that reference it? Still using the old version.",
      color: RED,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Sound Familiar?" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 64, color: DARK_TEXT, lineHeight: 1.1 }}>
          These aren't edge cases.<br />
          <span style={{ color: `hsl(${WARM})` }}>They happen every week.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 950 }}>
          Every organization we talk to recognizes at least two of these. Most recognize all three.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {scenarios.map((s) => (
            <div key={s.title} className="rounded-2xl border p-8 flex flex-col"
              style={{ borderColor: `hsl(${s.color} / 0.25)`, background: `hsl(${s.color} / 0.06)` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `hsl(${s.color} / 0.15)`, color: `hsl(${s.color})` }}>
                {s.icon}
              </div>
              <p className="font-bold mb-4" style={{ fontSize: 30, color: DARK_TEXT }}>{s.title}</p>
              <p className="flex-1" style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.55 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl px-10 py-6 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <p style={{ fontSize: 24, color: DARK_TEXT }}>
            The common thread: <strong style={{ color: `hsl(${TEAL})` }}>what people know and what they produce are disconnected.</strong>
            <br />
            <span style={{ color: DARK_MUTED }}>No system keeps them in sync. LIZA does.</span>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 3 — THE INSIGHT
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 06 — Two Layers ───────────────────────────────────────────────────

function Slide06TwoLayers() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 3 · The Insight" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: TEXT, lineHeight: 1.05 }}>
          Every organization runs on<br />
          <span style={{ color: `hsl(${TEAL})` }}>two layers of intelligence.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          There's <strong style={{ color: TEXT }}>how your best people do things</strong> — their expertise, playbooks, standards.
          And there's <strong style={{ color: TEXT }}>what actually gets produced</strong> — proposals, reports, deliverables.
          Today these live in completely different systems.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          {/* Layer 1 */}
          <div className="rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.15)` }}>
                <BookOpen size={28} style={{ color: `hsl(${TEAL})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 32, color: TEXT }}>What People Know</p>
                <p style={{ fontSize: 20, color: `hsl(${TEAL})` }}>Expertise, standards, best practices</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {["How your top consultant runs a discovery call", "The quality standards your team agreed on last quarter",
                "The pricing logic that took 3 years to develop", "The onboarding playbook your best manager created"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 20, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2 */}
          <div className="rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${SEAFOAM} / 0.3)`, background: `hsl(${SEAFOAM} / 0.04)` }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `hsl(${SEAFOAM} / 0.15)` }}>
                <FileText size={28} style={{ color: `hsl(${SEAFOAM})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 32, color: TEXT }}>What Gets Produced</p>
                <p style={{ fontSize: 20, color: `hsl(${SEAFOAM})` }}>Documents, decisions, deliverables</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {["The 47 active proposals in your pipeline right now", "Training decks used across 12 offices",
                "SOPs that govern how every project is delivered", "Client reports that reference your latest methodology"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3 rounded-lg" style={{ background: `hsl(${SEAFOAM} / 0.06)` }}>
                  <FileText size={18} style={{ color: `hsl(${SEAFOAM})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 20, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="font-bold" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
            Today these two layers live in different tools — Notion, Google Drive, Confluence, SharePoint — with zero connection between them.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 07 — Decision-Chain Integrity ─────────────────────────────────────

function Slide07DecisionChain() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Missing Infrastructure" color={TEAL} />
        <h2 className="font-black mb-6" style={{ fontSize: 64, color: DARK_TEXT, lineHeight: 1.05 }}>
          When knowledge changes,<br />
          <span style={{ color: `hsl(${TEAL})` }}>every artifact should know.</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          And when an artifact reveals something new — a client insight, a project learning — the knowledge base should update too.
          This bidirectional sync is what we call <strong style={{ color: DARK_TEXT }}>Decision-Chain Integrity.</strong>
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {/* Left: Knowledge layer */}
            <div className="w-[520px] rounded-2xl p-10" style={{ background: `hsl(${TEAL} / 0.1)`, border: `2px solid hsl(${TEAL} / 0.3)` }}>
              <div className="flex items-center gap-3 mb-6">
                <Brain size={28} style={{ color: `hsl(${TEAL})` }} />
                <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>What People Know</span>
              </div>
              <div className="flex flex-col gap-3">
                {["Methodology updated", "New compliance rule", "Pricing model changed", "Best practice discovered"].map((item) => (
                  <div key={item} className="px-5 py-3 rounded-lg flex items-center gap-3"
                    style={{ background: `hsl(${TEAL} / 0.08)` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${TEAL})` }} />
                    <span style={{ fontSize: 20, color: DARK_TEXT }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowRight size={36} style={{ color: `hsl(${MINT})` }} />
              </div>
              <div className="px-4 py-2 rounded-lg" style={{ background: `hsl(${MINT} / 0.15)` }}>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${MINT})` }}>PROPAGATE</span>
              </div>
              <div className="flex items-center gap-2 rotate-180">
                <ArrowRight size={36} style={{ color: `hsl(${SEAFOAM})` }} />
              </div>
              <div className="px-4 py-2 rounded-lg" style={{ background: `hsl(${SEAFOAM} / 0.15)` }}>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${SEAFOAM})` }}>LEARN</span>
              </div>
            </div>

            {/* Right: Artifact layer */}
            <div className="w-[520px] rounded-2xl p-10" style={{ background: `hsl(${SEAFOAM} / 0.1)`, border: `2px solid hsl(${SEAFOAM} / 0.3)` }}>
              <div className="flex items-center gap-3 mb-6">
                <Layers size={28} style={{ color: `hsl(${SEAFOAM})` }} />
                <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>What Gets Produced</span>
              </div>
              <div className="flex flex-col gap-3">
                {["Proposals auto-updated", "Training decks flagged", "SOPs version-bumped", "Client briefs synced"].map((item) => (
                  <div key={item} className="px-5 py-3 rounded-lg flex items-center gap-3"
                    style={{ background: `hsl(${SEAFOAM} / 0.08)` }}>
                    <CheckCircle2 size={18} style={{ color: `hsl(${SEAFOAM})` }} />
                    <span style={{ fontSize: 20, color: DARK_TEXT }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={TEAL} to={SEAFOAM} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 4 — THE SOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 08 — LIZA: The Operating System ───────────────────────────────────

function Slide08LizaOS() {
  const steps = [
    {
      icon: <BookOpen size={32} />, step: "01", title: "Capture",
      desc: "Your best people's expertise — playbooks, standards, tribal knowledge — becomes structured, reusable, and alive.",
    },
    {
      icon: <Network size={32} />, step: "02", title: "Organize",
      desc: "Knowledge is organized into governed bundles scoped to roles, teams, and workflows. Always current.",
    },
    {
      icon: <Zap size={32} />, step: "03", title: "Execute",
      desc: "AI-assisted work runs with your team's best judgment built in. Quality gates ensure human review at critical steps.",
    },
    {
      icon: <RefreshCw size={32} />, step: "04", title: "Propagate",
      desc: "When knowledge changes, every connected artifact updates. When artifacts reveal patterns, knowledge improves.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 4 · The Solution" />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: TEXT, lineHeight: 1.05 }}>
          LIZA: The Operating System for<br />
          <span style={{ color: `hsl(${TEAL})` }}>AI-Native Organizations.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          Four steps. One loop. The system that keeps what your people know and what they produce connected, governed, and always improving.
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
              <p className="font-bold mb-3" style={{ fontSize: 30, color: TEXT }}>{s.title}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.55 }}>{s.desc}</p>
              {i < 3 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={24} style={{ color: `hsl(${TEAL} / 0.4)` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <RefreshCw size={20} style={{ color: `hsl(${MINT})` }} />
          <p style={{ fontSize: 22, color: MUTED }}>
            Step 4 feeds back into Step 1 — <strong style={{ color: TEXT }}>the system compounds over time.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 09 — How It Actually Works ────────────────────────────────────────

function Slide09HowItWorks() {
  const steps = [
    { num: "1", title: "Your consulting methodology changes.",
      desc: "Maybe a new framework is adopted, a compliance rule shifts, or a senior partner develops a better approach to client discovery.", color: TEAL },
    { num: "2", title: "LIZA detects what's connected.",
      desc: "It knows which proposals, training decks, client briefs, and SOPs reference or depend on that methodology.", color: SEAFOAM },
    { num: "3", title: "Artifacts update — with human review.",
      desc: "Connected documents are flagged, updated, or queued for review. Nothing changes silently — every update is traceable and governed.", color: MINT },
    { num: "4", title: "The team gets smarter.",
      desc: "Project-level discoveries — what worked, what didn't — feed back into the knowledge base. The methodology itself improves.", color: TEAL },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="In Practice" color={MINT} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          A real example — start to finish.
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          Here's what happens inside LIZA when something changes in your organization.
        </p>

        <div className="flex-1 flex flex-col gap-5">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-start gap-6 rounded-2xl border px-8 py-6"
              style={{ borderColor: `hsl(${s.color} / 0.25)`, background: `hsl(${s.color} / 0.06)` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `hsl(${s.color} / 0.2)` }}>
                <span className="font-black" style={{ fontSize: 28, color: `hsl(${s.color})` }}>{s.num}</span>
              </div>
              <div>
                <p className="font-bold mb-2" style={{ fontSize: 28, color: DARK_TEXT }}>{s.title}</p>
                <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
              {i < 3 && (
                <div className="ml-auto flex items-center self-center">
                  <ArrowRight size={24} style={{ color: `hsl(${s.color} / 0.4)` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 5 — THE PROOF
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 10 — Competitive Landscape ────────────────────────────────────────

function Slide10Competition() {
  const competitors = [
    {
      name: "Edra", raised: "$30M", focus: "Repeatable Ops",
      desc: "Automates predictable, back-office processes. Think: payroll, onboarding, procurement.",
      limitation: "Operates only in the Complicated domain — standardized tasks with clear rules.",
    },
    {
      name: "Mem0", raised: "$44.5M", focus: "Memory Plumbing",
      desc: "Provides persistent memory for AI agents. Remembers preferences and history across sessions.",
      limitation: "Memory without governance. Stores what happened — doesn't ensure quality of what happens next.",
    },
    {
      name: "Interloom", raised: "$16.5M", focus: "Knowledge Graphs",
      desc: "Maps tacit knowledge into navigable graphs. Good for discovery and institutional memory.",
      limitation: "Captures knowledge but doesn't connect it to live execution or production artifacts.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 5 · The Proof" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.1 }}>
          $98M+ validates the category.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Nobody bridges both layers yet.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          Every competitor solves part of the problem. None connect what people know to what gets produced.
        </p>

        <div className="flex-1 flex gap-6">
          {competitors.map((c) => (
            <div key={c.name} className="flex-1 rounded-2xl border p-7 flex flex-col"
              style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold" style={{ fontSize: 28, color: TEXT }}>{c.name}</span>
                <span className="px-3 py-1 rounded-lg font-bold" style={{ fontSize: 18, background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>{c.raised}</span>
              </div>
              <span className="font-semibold mb-3 px-3 py-1 rounded-lg self-start"
                style={{ fontSize: 16, background: `hsl(${TEAL} / 0.08)`, color: `hsl(${TEAL})` }}>{c.focus}</span>
              <p className="mb-4" style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{c.desc}</p>
              <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(215 10% 90%)` }}>
                <p className="flex items-start gap-2" style={{ fontSize: 18, color: SUBTLE }}>
                  <X size={16} style={{ color: `hsl(${RED})`, marginTop: 3, flexShrink: 0 }} />
                  {c.limitation}
                </p>
              </div>
            </div>
          ))}

          {/* LIZA */}
          <div className="flex-1 rounded-2xl border-2 p-7 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold" style={{ fontSize: 28, color: TEXT }}>LIZA OS</span>
              <span className="px-3 py-1 rounded-lg font-bold" style={{ fontSize: 18, background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})` }}>The Complete Version</span>
            </div>
            <span className="font-semibold mb-3 px-3 py-1 rounded-lg self-start"
              style={{ fontSize: 16, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>Full Governance Loop</span>
            <p className="mb-4" style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>
              Captures expertise, governs it, executes with it, and propagates changes across all connected artifacts.
            </p>
            <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(${TEAL} / 0.2)` }}>
              <p className="flex items-start gap-2" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
                <CheckCircle2 size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                Only system bridging both the knowledge layer and the artifact layer.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 11 — Traction & Wedge ─────────────────────────────────────────────

function Slide11Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Traction & Go-to-Market" color={SEAFOAM} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          Consulting as the wedge.<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>Platform as the moat.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          We land with consulting engagements — solving real problems. We expand with the platform — making the solution permanent.
        </p>

        <div className="flex-1 flex gap-10">
          {/* Left: Traction */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-5">
              {[
                { stat: "15+", label: "Clients across industries", icon: <Users size={24} /> },
                { stat: "8", label: "Countries served", icon: <Globe size={24} /> },
                { stat: "15+", label: "Years of consulting expertise", icon: <Briefcase size={24} /> },
              ].map(({ stat, label, icon }) => (
                <div key={stat} className="rounded-xl p-6 flex flex-col items-center text-center"
                  style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                  <div className="mb-3" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black mb-1" style={{ fontSize: 40, color: DARK_TEXT }}>{stat}</p>
                  <p style={{ fontSize: 17, color: DARK_MUTED }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6" style={{ background: DARK_CARD, border: `1px solid hsl(200 15% 16%)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 22, color: DARK_TEXT }}>Named Clients</p>
              <div className="flex gap-4">
                {["aliz.ai (AI Consulting)", "Alverad (Cybersecurity)"].map((c) => (
                  <div key={c} className="px-4 py-2 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                    <span style={{ fontSize: 18, color: DARK_MUTED }}>{c}</span>
                  </div>
                ))}
                <div className="px-4 py-2 rounded-lg" style={{ background: `hsl(200 10% 12%)` }}>
                  <span style={{ fontSize: 18, color: DARK_SUBTLE }}>+ confidential enterprise clients</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vertical expansion */}
          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-bold mb-1" style={{ fontSize: 22, color: DARK_TEXT }}>Vertical Expansion</p>
            {[
              { vertical: "Professional Services", stage: "Active", color: GREEN },
              { vertical: "Pharma — Medicine Lifecycle", stage: "Pilot", color: SEAFOAM },
              { vertical: "AEC — Architecture & Engineering", stage: "Design Partner", color: TEAL },
              { vertical: "Enterprise GTM", stage: "Pipeline", color: GOLD },
            ].map((v) => (
              <div key={v.vertical} className="flex items-center justify-between rounded-xl px-6 py-4"
                style={{ background: DARK_CARD, border: `1px solid hsl(200 15% 16%)` }}>
                <span style={{ fontSize: 20, color: DARK_TEXT }}>{v.vertical}</span>
                <span className="px-3 py-1 rounded-lg font-semibold" style={{ fontSize: 16, background: `hsl(${v.color} / 0.15)`, color: `hsl(${v.color})` }}>{v.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={SEAFOAM} to={MINT} />
    </div>
  );
}

// ─── Slide 12 — Team ─────────────────────────────────────────────────────────

function Slide12Team() {
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
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Team" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.1 }}>
          Practitioners who've lived the problem.
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          We've spent our careers helping organizations standardize expertise and scale quality.
          LIZA is the system we wished existed.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {team.map((t) => (
            <div key={t.name} className="rounded-2xl border p-8 flex flex-col items-center text-center"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: CARD_ALT }}>
              <img src={t.photo} alt={t.name}
                className="w-32 h-32 rounded-full object-cover mb-6"
                style={{ border: `3px solid hsl(${TEAL} / 0.3)` }} />
              <p className="font-bold mb-1" style={{ fontSize: 28, color: TEXT }}>{t.name}</p>
              <p className="font-semibold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>{t.role}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.55 }}>{t.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p style={{ fontSize: 20, color: SUBTLE }}>
            Core team supported by specialist consultants depending on engagement scope.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACT 6 — THE ASK
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Slide 13 — Business Model ───────────────────────────────────────────────

function Slide13BusinessModel() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 6 · The Ask" color={GOLD} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          Land with consulting.<br />
          <span style={{ color: `hsl(${GOLD})` }}>Expand with the platform.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          Consulting builds trust, captures real institutional knowledge, and proves value.
          The platform makes it permanent, scalable, and self-improving.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          {/* Consulting */}
          <div className="rounded-2xl border p-8 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={28} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>Consulting Wedge</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "4-week Assess → Align → Apply engagement",
                "Captures institutional knowledge firsthand",
                "Builds trust through measurable outcomes",
                "Natural expansion: more teams, more use cases",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 21, color: DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <p className="font-bold" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>Revenue from day one.</p>
            </div>
          </div>

          {/* Platform */}
          <div className="rounded-2xl border p-8 flex flex-col"
            style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.06)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Rocket size={28} style={{ color: `hsl(${GOLD})` }} />
              <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>Platform Moat</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "SaaS per-seat + usage-based pricing",
                "Knowledge compounds — switching cost grows over time",
                "Network effects within organizations",
                "Vertical expansion: same system, new industries",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} style={{ color: `hsl(${GOLD})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 21, color: DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <p className="font-bold" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>Compounding retention.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={TEAL} />
    </div>
  );
}

// ─── Slide 14 — The Ask ──────────────────────────────────────────────────────

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
            AI is beginning to scale judgment.<br />
            The infrastructure to govern it is just forming.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>We're building the complete version.</strong>
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
  { id: 2, title: "The Stack Is Commoditizing", component: <Slide02Commoditization /> },
  { id: 3, title: "Three Waves", component: <Slide03ThreeWaves /> },
  { id: 4, title: "The Propagation Crisis", component: <Slide04PropagationCrisis /> },
  { id: 5, title: "Sound Familiar?", component: <Slide05SoundFamiliar /> },
  { id: 6, title: "Two Layers", component: <Slide06TwoLayers /> },
  { id: 7, title: "Decision-Chain Integrity", component: <Slide07DecisionChain /> },
  { id: 8, title: "LIZA OS", component: <Slide08LizaOS /> },
  { id: 9, title: "How It Works", component: <Slide09HowItWorks /> },
  { id: 10, title: "Competitive Landscape", component: <Slide10Competition /> },
  { id: 11, title: "Traction & GTM", component: <Slide11Traction /> },
  { id: 12, title: "Team", component: <Slide12Team /> },
  { id: 13, title: "Business Model", component: <Slide13BusinessModel /> },
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Unified-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Unified Investor Deck</span>
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Unified-Investor-Deck" slideCount={SLIDES.length} variant="desktop" />
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
                      background: i === current ? `hsl(${TEAL})` : CHROME_BORDER,
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

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}

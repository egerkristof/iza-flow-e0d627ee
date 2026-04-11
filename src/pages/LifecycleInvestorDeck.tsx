import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, CheckCircle2, DollarSign,
  Users, Globe, Briefcase,
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

// ─── Palette ─────────────────────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";
const WARM = "15 85% 55%";
const DARK_BG = "hsl(200 30% 6%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(200 15% 60%)";
const DARK_SUBTLE = "hsl(200 10% 45%)";
const RED = "0 72% 50%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";
const SEAFOAM = "170 100% 33%";
const GOLD = "45 95% 42%";

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

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-12 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>
            LIZA OS
          </span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 84, lineHeight: 1.05, color: DARK_TEXT }}>
          AI can execute anything.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Who tells it how?
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 32, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          The first infrastructure for how organizations think, decide, and deliver.
        </p>

        <p style={{ fontSize: 20, color: DARK_SUBTLE }}>
          Confidential &nbsp;·&nbsp; Seed Round &nbsp;·&nbsp; €300K
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE SHIFT (Balance → Break)
// ═══════════════════════════════════════════════════════════════════════════════

function BarPair({ execPct, knowPct, execColor, knowColor, execLabel, knowLabel }: {
  execPct: number; knowPct: number; execColor: string; knowColor: string; execLabel: string; knowLabel: string;
}) {
  return (
    <div className="flex gap-6 items-end h-full">
      <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
        <p className="font-bold" style={{ fontSize: 20, color: `hsl(${execColor})` }}>{execLabel}</p>
        <div className="w-full rounded-t-xl relative" style={{
          height: `${execPct}%`, background: `linear-gradient(180deg, hsl(${execColor}), hsl(${execColor} / 0.6))`,
          transition: "height 0.6s ease",
        }} />
        <p className="font-semibold" style={{ fontSize: 16, color: SUBTLE }}>Execution Speed</p>
      </div>
      <div className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
        <p className="font-bold" style={{ fontSize: 20, color: `hsl(${knowColor})` }}>{knowLabel}</p>
        <div className="w-full rounded-t-xl relative" style={{
          height: `${knowPct}%`, background: `linear-gradient(180deg, hsl(${knowColor}), hsl(${knowColor} / 0.6))`,
          transition: "height 0.6s ease",
        }} />
        <p className="font-semibold" style={{ fontSize: 16, color: SUBTLE }}>Knowledge Readiness</p>
      </div>
    </div>
  );
}

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Shift</p>

        <h2 className="font-black mb-4" style={{ fontSize: 62, color: TEXT, lineHeight: 1.05 }}>
          AI broke the balance.
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Execution and knowledge used to move at the same speed. Seniors bridged the gaps.
          AI made execution instant — but knowledge stayed where it was.
        </p>

        <div className="flex-1 flex gap-12">
          {/* BEFORE */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col" style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-3" style={{ fontSize: 18, color: SUBTLE }}>Before AI</p>
            <p className="mb-6" style={{ fontSize: 18, color: MUTED }}>Balanced — both slow, both manageable</p>
            <div className="flex-1">
              <BarPair execPct={35} knowPct={40} execColor={BLUE} knowColor={GREEN} execLabel="Slow" knowLabel="Adequate" />
            </div>
            <div className="mt-5 px-4 py-3 rounded-lg text-center" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.15)` }}>
              <p style={{ fontSize: 18, color: `hsl(${GREEN})` }}>✓ Seniors compensated for knowledge gaps</p>
            </div>
          </div>

          {/* AI ARRIVES */}
          <div className="flex flex-col items-center justify-center gap-4 px-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `hsl(${WARM} / 0.12)` }}>
              <Zap size={28} style={{ color: `hsl(${WARM})` }} />
            </div>
            <p className="font-bold text-center" style={{ fontSize: 18, color: `hsl(${WARM})` }}>AI<br/>arrives</p>
            <div className="w-px h-24" style={{ background: `hsl(${WARM} / 0.3)` }} />
          </div>

          {/* AFTER */}
          <div className="flex-1 rounded-2xl border-2 p-10 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-3" style={{ fontSize: 18, color: `hsl(${WARM})` }}>After AI</p>
            <p className="mb-6" style={{ fontSize: 18, color: MUTED }}>Broken — execution rockets, knowledge stays flat</p>
            <div className="flex-1">
              <BarPair execPct={92} knowPct={35} execColor={GREEN} knowColor={WARM} execLabel="Instant" knowLabel="Still a PDF" />
            </div>
            <div className="mt-5 px-4 py-3 rounded-lg text-center" style={{ background: `hsl(${WARM} / 0.06)`, border: `1px solid hsl(${WARM} / 0.15)` }}>
              <p style={{ fontSize: 18, color: `hsl(${WARM})` }}>✗ AI can't compensate. It executes literally.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE GAP (Why PDFs were fine — and why they're fatal now)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Gap</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          A PDF works when a human reads it.<br/>
          <span style={{ color: `hsl(${WARM})` }}>It fails when an AI agent executes from it.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Your Whats (artifacts) are governed by $100B+ of infrastructure. Your Hows (knowledge) live in wikis, PDFs, and senior people's heads.
          That was fine — until AI became the consumer.
        </p>

        <div className="flex-1 flex gap-10">
          {/* Before: Human bridge */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>Before AI — The Human Bridge</p>
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <div className="flex items-center gap-4">
                <div className="px-5 py-4 rounded-xl flex-1 text-center" style={{ background: `hsl(200 15% 12%)`, border: `1px solid hsl(200 10% 18%)` }}>
                  <p style={{ fontSize: 18, color: DARK_MUTED }}>📄 PDF from 2019</p>
                  <p className="font-bold" style={{ fontSize: 16, color: DARK_TEXT }}>Incomplete. Outdated.</p>
                </div>
                <ArrowRight size={20} style={{ color: DARK_MUTED }} />
                <div className="px-5 py-4 rounded-xl flex-1 text-center" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.2)` }}>
                  <p style={{ fontSize: 22 }}>🧠</p>
                  <p className="font-bold" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>Senior colleague</p>
                  <p style={{ fontSize: 14, color: DARK_MUTED }}>"I know what's in there and what's not"</p>
                </div>
                <ArrowRight size={20} style={{ color: DARK_MUTED }} />
                <div className="px-5 py-4 rounded-xl flex-1 text-center" style={{ background: `hsl(200 15% 12%)`, border: `1px solid hsl(200 10% 18%)` }}>
                  <p style={{ fontSize: 18, color: DARK_MUTED }}>✅ Correct output</p>
                  <p className="font-bold" style={{ fontSize: 16, color: DARK_TEXT }}>Human judgment fills the gap</p>
                </div>
              </div>
              <p className="text-center mt-3" style={{ fontSize: 17, color: `hsl(${GREEN})` }}>Knowledge was "good enough" because humans compensated in real time</p>
            </div>
          </div>

          {/* After: No bridge */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${WARM})` }}>After AI — No Bridge</p>
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <div className="flex items-center gap-4">
                <div className="px-5 py-4 rounded-xl flex-1 text-center" style={{ background: `hsl(200 15% 12%)`, border: `1px solid hsl(200 10% 18%)` }}>
                  <p style={{ fontSize: 18, color: DARK_MUTED }}>📄 Same PDF</p>
                  <p className="font-bold" style={{ fontSize: 16, color: DARK_TEXT }}>Still incomplete. Still outdated.</p>
                </div>
                <ArrowRight size={20} style={{ color: DARK_MUTED }} />
                <div className="px-5 py-4 rounded-xl flex-1 text-center" style={{ background: `hsl(${WARM} / 0.08)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
                  <p style={{ fontSize: 22 }}>🤖</p>
                  <p className="font-bold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>AI agent</p>
                  <p style={{ fontSize: 14, color: DARK_MUTED }}>"I execute exactly what I'm given"</p>
                </div>
                <ArrowRight size={20} style={{ color: DARK_MUTED }} />
                <div className="px-5 py-4 rounded-xl flex-1 text-center" style={{ background: `hsl(${RED} / 0.08)`, border: `1px solid hsl(${RED} / 0.2)` }}>
                  <p style={{ fontSize: 18, color: DARK_MUTED }}>❌ 50 wrong outputs</p>
                  <p className="font-bold" style={{ fontSize: 16, color: `hsl(${RED})` }}>At machine speed. No judgment.</p>
                </div>
              </div>
              <p className="text-center mt-3" style={{ fontSize: 17, color: `hsl(${WARM})` }}>AI needs fully executable, continuously updated knowledge — not a PDF</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center px-20">
          <p style={{ fontSize: 22, color: DARK_MUTED }}>
            <span className="font-bold" style={{ color: `hsl(${BLUE})` }}>$100B+</span> governs your artifacts (ALM, PLM, GxP).
            <span className="font-bold" style={{ color: `hsl(${WARM})` }}> $0</span> governs the knowledge AI actually executes from.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE PROPAGATION CRISIS (Dual crisis: source + propagation)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Propagation Crisis</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Two problems. One cause: AI executes faster than knowledge can keep up.
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          The source knowledge was never machine-ready. And when it changes, nothing propagates.
          AI turns both gaps into organizational risk — at machine speed.
        </p>

        <div className="flex-1 flex gap-10">
          {/* Crisis 1: Source quality */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${RED} / 0.2)`, background: `hsl(${RED} / 0.03)` }}>
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle size={22} style={{ color: `hsl(${RED})` }} />
              <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 16, color: `hsl(${RED})` }}>Crisis 1 — The Source Was Never Ready</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {[
                "Your best salesperson's method lives in their head",
                "The onboarding process is a wiki from 2021",
                "Quality standards are a PDF no one reads anymore",
                "AI executes from all of these — literally, uncritically",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-lg" style={{ background: `hsl(${RED} / 0.04)` }}>
                  <X size={16} style={{ color: `hsl(${RED})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 font-semibold" style={{ fontSize: 17, color: `hsl(${RED})` }}>
              Knowledge was never encoded for machine execution
            </p>
          </div>

          {/* Crisis 2: Propagation */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.2)`, background: `hsl(${WARM} / 0.03)` }}>
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle size={22} style={{ color: `hsl(${WARM})` }} />
              <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 16, color: `hsl(${WARM})` }}>Crisis 2 — Nothing Propagates</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {[
                "You update your pricing model — 47 AI outputs still use the old one",
                "A compliance rule changes — 12 prompts still enforce the previous version",
                "A best practice evolves — none of the AI-generated training reflects it",
                "The How changes constantly. The What never updates.",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-lg" style={{ background: `hsl(${WARM} / 0.04)` }}>
                  <X size={16} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 font-semibold" style={{ fontSize: 17, color: `hsl(${WARM})` }}>
              AI generates perfectly — from stale, disconnected knowledge
            </p>
          </div>
        </div>

        <div className="mt-6 px-10 py-4 rounded-xl text-center" style={{ background: CARD_ALT, border: `1px solid hsl(215 10% 90%)` }}>
          <p style={{ fontSize: 22, color: TEXT }}>
            <span className="font-bold">The result:</span> AI generates all your <span className="font-bold" style={{ color: `hsl(${BLUE})` }}>Whats</span> from
            loosely defined <span className="font-bold" style={{ color: `hsl(${WARM})` }}>Hows</span> — and when either changes, the other doesn't follow.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — THE SOLUTION (Encode + Connect + Unite)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "AI extracts tribal knowledge from your best people and turns it into structured, executable knowledge.",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Knowledge becomes governed, versioned, connected. The How is encoded for machines, not just humans.",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "AI executes with your best judgment built in. The How becomes the What — continuously, automatically.",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Propagate",
      desc: "When knowledge changes, every output updates. When outputs reveal patterns, knowledge improves. How and What stay unified.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Solution</p>

        <h2 className="font-black mb-3" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          AI caused the crisis.{" "}
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI is also the cure.
          </span>
        </h2>
        <p className="mb-5" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          LIZA continuously encodes expert judgment into executable knowledge that AI agents consume —
          and keeps every artifact synchronized when that knowledge evolves. The How and the What, unified.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-7">
          {steps.map((s, i) => (
            <div key={s.num} className="rounded-2xl border p-8 flex flex-col relative"
              style={{ borderColor: i === 3 ? `hsl(${TEAL} / 0.4)` : `hsl(200 15% 16%)`, background: i === 3 ? `hsl(${TEAL} / 0.08)` : `hsl(200 25% 10%)` }}>
              <span className="font-black tracking-[0.2em] mb-5" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
                STEP {s.num}
              </span>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                {s.icon}
              </div>
              <p className="font-black mb-3" style={{ fontSize: 30, color: DARK_TEXT }}>{s.title}</p>
              <p style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.55 }}>{s.desc}</p>
              {i < 3 && (
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={24} style={{ color: `hsl(${TEAL} / 0.4)` }} />
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
// SLIDE 6 — THE MARKET
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Market</p>

        <h2 className="font-black mb-10" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          Every layer that got governance<br />
          <span style={{ color: `hsl(${TEAL})` }}>created a multi-billion dollar category.</span>
        </h2>

        <div className="flex gap-5 mb-10">
          {[
            { era: "1990s", name: "ALM", layer: "Code", market: "$34B", color: BLUE },
            { era: "2000s", name: "PLM", layer: "Physical Products", market: "$65B", color: GREEN },
            { era: "2010s", name: "GxP Systems", layer: "Regulated Documents", market: "$18B", color: SEAFOAM },
            { era: "Now", name: "The How Layer", layer: "Knowledge & Judgment", market: "Whitespace", color: TEAL, highlight: true },
          ].map((item, i) => (
            <div key={item.name} className="flex-1 flex items-center gap-3">
              <div className="rounded-xl px-5 py-5 flex-1 text-center" style={{
                background: item.highlight ? `hsl(${item.color} / 0.08)` : CARD_ALT,
                border: item.highlight ? `2px solid hsl(${item.color} / 0.35)` : `1px solid hsl(215 10% 90%)`,
              }}>
                <p className="font-bold mb-1" style={{ fontSize: 15, color: `hsl(${item.color})` }}>{item.era}</p>
                <p className="font-black" style={{ fontSize: 26, color: TEXT }}>{item.name}</p>
                <p style={{ fontSize: 17, color: MUTED }}>{item.layer}</p>
                <p className="font-bold mt-2" style={{ fontSize: 18, color: `hsl(${item.color})` }}>{item.market}</p>
              </div>
              {i < 3 && <ArrowRight size={22} style={{ color: SUBTLE, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div className="flex-1 flex gap-8">
          <div className="flex-1 rounded-2xl border p-7" style={{ borderColor: `hsl(215 10% 90%)`, background: CARD_ALT }}>
            <p className="font-bold mb-5" style={{ fontSize: 22, color: TEXT }}>Traction</p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { stat: "15+", label: "Clients", icon: <Users size={20} /> },
                { stat: "8", label: "Countries", icon: <Globe size={20} /> },
                { stat: "15+ yrs", label: "Consulting depth", icon: <Briefcase size={20} /> },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="text-center rounded-xl px-3 py-4" style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                  <div className="flex justify-center mb-2" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black" style={{ fontSize: 32, color: TEXT }}>{stat}</p>
                  <p style={{ fontSize: 15, color: MUTED }}>{label}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 17, color: MUTED }}>Consulting as the wedge. Platform as the moat. Named clients include aliz.ai and Alverad.</p>
          </div>

          <div className="w-[580px] rounded-2xl border p-7" style={{ borderColor: `hsl(215 10% 90%)`, background: CARD_ALT }}>
            <p className="font-bold mb-5" style={{ fontSize: 22, color: TEXT }}>Team</p>
            <div className="flex flex-col gap-4">
              {[
                { name: "István Boscha", role: "Product & CEO", note: "15+ years consulting × technology", photo: istvanPhoto },
                { name: "Kristóf Éger", role: "Enterprise GTM", note: "Category creation & executive positioning", photo: kristofPhoto },
                { name: "Zoltán Kauker", role: "AI Architecture", note: "Knowledge systems & scalable infrastructure", photo: zoltanPhoto },
              ].map((t) => (
                <div key={t.name} className="flex items-center gap-4">
                  <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid hsl(${TEAL} / 0.2)` }} />
                  <div>
                    <p className="font-bold" style={{ fontSize: 19, color: TEXT }}>{t.name}</p>
                    <p style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{t.role}</p>
                    <p style={{ fontSize: 14, color: MUTED }}>{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — THE ASK
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <p className="font-semibold tracking-[0.25em] uppercase mb-6" style={{ fontSize: 24, color: `hsl(${TEAL} / 0.8)` }}>Seed Round</p>

        <h2 className="font-black mb-8" style={{ fontSize: 96, color: DARK_TEXT }}>€300K</h2>

        <p className="mb-12" style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 900, lineHeight: 1.5 }}>
          To complete the platform, onboard design partners,<br />and establish the category.
        </p>

        <div className="flex gap-6 mb-14">
          {[
            { pct: "50%", label: "Product & Engineering", color: TEAL },
            { pct: "30%", label: "GTM & Category", color: SEAFOAM },
            { pct: "20%", label: "Design Partners", color: MINT },
          ].map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2 px-8 py-5 rounded-xl"
              style={{ background: `hsl(${a.color} / 0.08)`, border: `1px solid hsl(${a.color} / 0.2)`, minWidth: 220 }}>
              <span className="font-black" style={{ fontSize: 40, color: `hsl(${a.color})` }}>{a.pct}</span>
              <span style={{ fontSize: 19, color: DARK_MUTED }}>{a.label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-14 py-7 mb-12"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 28, color: DARK_TEXT, lineHeight: 1.5 }}>
            $100B+ governs what companies produce.<br />
            Zero governs how they produce it.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>We're building The How Layer.</strong>
          </p>
        </div>

        <div className="flex gap-8">
          <div className="px-14 py-6 rounded-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))` }}>
            <span className="font-bold" style={{ fontSize: 26, color: "white" }}>Schedule a Founder Call</span>
          </div>
          <div className="px-14 py-6 rounded-2xl border"
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
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "The Shift", component: <Slide02 /> },
  { id: 3, title: "The Gap", component: <Slide03 /> },
  { id: 4, title: "The Propagation Crisis", component: <Slide04 /> },
  { id: 5, title: "LIZA: The Solution", component: <Slide05 /> },
  { id: 6, title: "Market & Team", component: <Slide06 /> },
  { id: 7, title: "The Ask", component: <Slide07 /> },
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
              className={cn("rounded-lg overflow-hidden border text-left transition-all", i === current ? "ring-2" : "hover:border-gray-300")}
              style={{
                borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER,
                ...(i === current ? { boxShadow: `0 0 0 2px hsl(${TEAL} / 0.25)` } : {}),
              }}>
              <div className="aspect-video w-full relative">
                <ScaledSlide>{s.component}</ScaledSlide>
              </div>
              <p className="text-[10px] font-medium px-2 py-1 truncate" style={{ color: MUTED }}>{i + 1}. {s.title}</p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg", i === current ? "ring-2" : "")}
                    style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER }}>
                    <div className="aspect-video relative"><ScaledSlide>{s.component}</ScaledSlide></div>
                    <p className="text-xs font-medium px-3 py-2" style={{ color: MUTED, background: CHROME_BG }}>{i + 1}. {s.title}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-xl border" style={{ borderColor: CHROME_BORDER }}>
                <ScaledSlide>{slide.component}</ScaledSlide>
              </div>
            </div>
          )}

          {!showGrid && (
            <div className="flex items-center justify-center gap-4 py-3 border-t shrink-0" style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
                <ChevronLeft size={18} style={{ color: TEXT }} />
              </button>
              <span className="text-sm font-mono" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
              <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
                <ChevronRight size={18} style={{ color: TEXT }} />
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

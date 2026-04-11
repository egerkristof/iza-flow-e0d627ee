import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, CheckCircle2, DollarSign,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
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
// SLIDE 2 — THE FOUNDATION (Organizations produce Whats from Hows)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Foundation</p>

        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          Every organization produces{" "}
          <span style={{ color: `hsl(${BLUE})` }}>Whats</span>{" "}
          from{" "}
          <span style={{ color: `hsl(${TEAL})` }}>Hows.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Artifacts — proposals, contracts, code, training materials — are the <strong>Whats</strong>. 
          The judgment, methodology, and expertise that shape them are the <strong>Hows</strong>.
        </p>

        <div className="flex-1 flex gap-10 items-stretch">
          {/* THE HOWS */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col justify-center" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>The Hows — Expertise</p>
            <div className="flex flex-col gap-4">
              {[
                "How we qualify a lead",
                "How we price a complex deal",
                "How we onboard a new hire",
                "How we handle a regulatory audit",
                "How we write production-ready code",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${TEAL})` }} />
                  <span className="font-medium" style={{ fontSize: 21, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ARROW */}
          <div className="flex flex-col items-center justify-center gap-3 px-2">
            <p className="font-bold" style={{ fontSize: 16, color: SUBTLE }}>shapes</p>
            <ArrowRight size={32} style={{ color: MUTED }} />
          </div>

          {/* THE WHATS */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col justify-center" style={{ borderColor: `hsl(${BLUE} / 0.25)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>The Whats — Artifacts</p>
            <div className="flex flex-col gap-4">
              {[
                "Proposals & SOWs",
                "Training materials",
                "Contracts & compliance docs",
                "Code & architecture",
                "Reports & presentations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: `hsl(${BLUE} / 0.06)` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${BLUE})` }} />
                  <span className="font-medium" style={{ fontSize: 21, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p style={{ fontSize: 24, color: MUTED }}>
            The quality of every <span className="font-bold" style={{ color: `hsl(${BLUE})` }}>What</span> is determined by the quality of the <span className="font-bold" style={{ color: `hsl(${TEAL})` }}>How</span> behind it.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE HUMAN ERA (Seniors were the bridge)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>The Human Era</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          This worked — because <span style={{ color: `hsl(${GREEN})` }}>humans were the bridge.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Execution was slow, manual, one-at-a-time. The <strong>Hows</strong> didn't need to be written down perfectly —
          senior colleagues carried the judgment and filled the gaps in real time.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-6 w-full max-w-[1400px]">
            {/* Source */}
            <div className="flex-1 rounded-2xl border p-8 text-center" style={{ borderColor: `hsl(200 15% 16%)`, background: `hsl(200 25% 10%)` }}>
              <p style={{ fontSize: 48 }}>📄</p>
              <p className="font-bold mt-3" style={{ fontSize: 22, color: DARK_TEXT }}>Static How</p>
              <p className="mt-1" style={{ fontSize: 17, color: DARK_MUTED }}>PDFs, wikis, tribal knowledge</p>
              <p className="mt-2" style={{ fontSize: 15, color: DARK_SUBTLE }}>Incomplete. Outdated. Implicit.</p>
            </div>

            <ArrowRight size={28} style={{ color: DARK_MUTED, flexShrink: 0 }} />

            {/* The Bridge */}
            <div className="flex-1 rounded-2xl border-2 p-8 text-center" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.08)` }}>
              <p style={{ fontSize: 48 }}>🧠</p>
              <p className="font-bold mt-3" style={{ fontSize: 24, color: `hsl(${GREEN})` }}>The Human Bridge</p>
              <p className="mt-2" style={{ fontSize: 18, color: DARK_TEXT }}>Senior colleague interprets,</p>
              <p style={{ fontSize: 18, color: DARK_TEXT }}>compensates, adapts in real time</p>
              <div className="mt-4 px-4 py-2 rounded-lg inline-block" style={{ background: `hsl(${GREEN} / 0.12)` }}>
                <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>"I know what's in there — and what's not"</p>
              </div>
            </div>

            <ArrowRight size={28} style={{ color: DARK_MUTED, flexShrink: 0 }} />

            {/* Output */}
            <div className="flex-1 rounded-2xl border p-8 text-center" style={{ borderColor: `hsl(200 15% 16%)`, background: `hsl(200 25% 10%)` }}>
              <p style={{ fontSize: 48 }}>✅</p>
              <p className="font-bold mt-3" style={{ fontSize: 22, color: DARK_TEXT }}>Correct What</p>
              <p className="mt-1" style={{ fontSize: 17, color: DARK_MUTED }}>Slow but accurate</p>
              <p className="mt-2" style={{ fontSize: 15, color: DARK_SUBTLE }}>One artifact at a time</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center px-20">
          <p style={{ fontSize: 22, color: DARK_MUTED }}>
            Execution speed was <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>slow</span>. Knowledge quality was <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>good enough</span>. 
            The system was <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>in balance</span>.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE LLM SHIFT (Hows and Whats FUSE)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The LLM Shift</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          LLMs don't just turn <span style={{ color: `hsl(${TEAL})` }}>Hows</span> into <span style={{ color: `hsl(${BLUE})` }}>Whats</span>.<br/>
          They <span style={{ color: `hsl(${WARM})` }}>fuse them</span> into a new kind of artifact.
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Every AI-generated artifact is <strong>simultaneously</strong> a What (the output) and an encoded How (the judgment that shaped it).
          This fusion creates a new category of asset that no existing tool manages.
        </p>

        <div className="flex-1 flex gap-10 items-stretch">
          {/* The Fusion */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.35)`, background: `hsl(${WARM} / 0.04)` }}>
            <div className="flex items-center gap-3 mb-5">
              <Zap size={22} style={{ color: `hsl(${WARM})` }} />
              <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 17, color: `hsl(${WARM})` }}>The Fusion Problem</p>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {[
                "AI writes a proposal → it encodes your pricing logic, deal structure, positioning",
                "AI generates training → it encodes your onboarding methodology, cultural norms",
                "AI drafts compliance docs → it encodes your interpretation of regulations",
                "Every output is now a carrier of organizational judgment",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-lg" style={{ background: i === 3 ? `hsl(${WARM} / 0.08)` : `hsl(${WARM} / 0.04)` }}>
                  {i < 3 ? <ArrowRight size={18} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} /> : <AlertTriangle size={18} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} />}
                  <span style={{ fontSize: 20, color: TEXT, fontWeight: i === 3 ? 700 : 400 }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-5 font-semibold" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              And nobody is managing any of it.
            </p>
          </div>

          {/* The Analogy */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="flex items-center gap-3 mb-5">
              <BookOpen size={22} style={{ color: `hsl(${TEAL})` }} />
              <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>We've Seen This Before</p>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { era: "Code", what: "Developers wrote software", tool: "Git gave it version control", market: "$34B ALM" },
                { era: "Products", what: "Engineers designed parts", tool: "PLM gave it change management", market: "$65B PLM" },
                { era: "Regulations", what: "Teams wrote compliance docs", tool: "GxP gave it audit trails", market: "$18B GxP" },
                { era: "AI Artifacts", what: "LLMs generate everything", tool: "??? gives it governance", market: "Whitespace" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-lg" style={{ background: i === 3 ? `hsl(${TEAL} / 0.08)` : `hsl(${TEAL} / 0.04)`, border: i === 3 ? `1px solid hsl(${TEAL} / 0.25)` : "none" }}>
                  <span className="font-black w-28 shrink-0" style={{ fontSize: 14, color: i === 3 ? `hsl(${TEAL})` : SUBTLE }}>{item.era}</span>
                  <span className="flex-1" style={{ fontSize: 17, color: i === 3 ? TEXT : MUTED }}>{item.tool}</span>
                  <span className="font-bold shrink-0" style={{ fontSize: 15, color: i === 3 ? `hsl(${WARM})` : `hsl(${TEAL})` }}>{item.market}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-5 font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
              Every critical layer that got governance created a $B category.
            </p>
          </div>
        </div>

        <div className="mt-6 px-10 py-4 rounded-xl text-center" style={{ background: CARD_ALT, border: `1px solid hsl(215 10% 90%)` }}>
          <p style={{ fontSize: 22, color: TEXT }}>
            <span className="font-bold" style={{ color: `hsl(${BLUE})` }}>$100B+</span> of infrastructure governs the <strong>Whats</strong>. 
            <span className="font-bold" style={{ color: `hsl(${WARM})` }}> $0</span> governs the <strong>AI artifacts</strong> that now fuse Whats and Hows together.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — THE PROPAGATION CRISIS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Propagation Crisis</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          When a <span style={{ color: `hsl(${TEAL})` }}>How</span> changes, every <span style={{ color: `hsl(${BLUE})` }}>What</span> should follow.<br/>
          <span style={{ color: `hsl(${WARM})` }}>Today, nothing does.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          LLMs don't just have a source quality problem. They have a <strong>change propagation</strong> problem.
          When expertise evolves, every AI-generated artifact downstream is instantly stale.
        </p>

        <div className="flex-1 flex gap-8 items-stretch">
          {/* The cascade */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${WARM})` }}>A single How changes...</p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                "Pricing model updated by the VP of Sales",
                "→ 47 AI-generated proposals still use the old model",
                "→ 12 training decks teach the wrong methodology",
                "→ 8 onboarding scripts reference deprecated terms",
                "→ Every downstream What is now wrong",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-lg" style={{ background: i === 0 ? `hsl(${TEAL} / 0.08)` : `hsl(${WARM} / 0.06)` }}>
                  {i === 0 ? <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} /> : <X size={18} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} />}
                  <span style={{ fontSize: 19, color: i === 0 ? DARK_TEXT : DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The insight */}
          <div className="w-[500px] flex flex-col gap-6 justify-center">
            <div className="rounded-2xl border p-8" style={{ borderColor: `hsl(${WARM} / 0.25)`, background: `hsl(200 25% 10%)` }}>
              <p className="font-black mb-3" style={{ fontSize: 28, color: DARK_TEXT }}>This is Configuration Management for knowledge.</p>
              <p style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.55 }}>
                Software has version control. Physical products have PLM. Regulated docs have GxP.
                Organizational knowledge has <strong style={{ color: `hsl(${WARM})` }}>nothing</strong>.
              </p>
            </div>
            <div className="rounded-2xl border p-8" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
              <p className="font-black mb-3" style={{ fontSize: 28, color: DARK_TEXT }}>The How Layer needs infrastructure.</p>
              <p style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.55 }}>
                Not just encoding. Not just organizing. <strong style={{ color: `hsl(${TEAL})` }}>Connected change propagation</strong> — so when
                knowledge evolves, every artifact follows.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — THE INFRASTRUCTURE GAP ($100B Whats vs $0 Hows)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Infrastructure Gap</p>

        <h2 className="font-black mb-6" style={{ fontSize: 55, color: TEXT, lineHeight: 1.05 }}>
          Every layer that got governance<br />
          <span style={{ color: `hsl(${TEAL})` }}>created a multi-billion dollar category.</span>
        </h2>

        <div className="flex gap-4 mb-8">
          {[
            { era: "1990s", name: "ALM", layer: "Code", market: "$34B", color: BLUE, desc: "Version control, CI/CD, testing" },
            { era: "2000s", name: "PLM", layer: "Physical Products", market: "$65B", color: GREEN, desc: "Bill of materials, change orders" },
            { era: "2010s", name: "GxP", layer: "Regulated Docs", market: "$18B", color: SEAFOAM, desc: "Compliance, audit trails" },
            { era: "Now", name: "The How Layer", layer: "Knowledge & Judgment", market: "Whitespace", color: TEAL, highlight: true, desc: "No infrastructure exists" },
          ].map((item, i) => (
            <div key={item.name} className="flex-1 flex items-center gap-3">
              <div className="rounded-xl px-5 py-4 flex-1 text-center" style={{
                background: item.highlight ? `hsl(${item.color} / 0.08)` : CARD_ALT,
                border: item.highlight ? `2px solid hsl(${item.color} / 0.35)` : `1px solid hsl(215 10% 90%)`,
              }}>
                <p className="font-bold mb-1" style={{ fontSize: 14, color: `hsl(${item.color})` }}>{item.era}</p>
                <p className="font-black" style={{ fontSize: 26, color: TEXT }}>{item.name}</p>
                <p style={{ fontSize: 16, color: MUTED }}>{item.layer}</p>
                <p className="font-bold mt-1" style={{ fontSize: 17, color: `hsl(${item.color})` }}>{item.market}</p>
                <p className="mt-1" style={{ fontSize: 13, color: SUBTLE }}>{item.desc}</p>
              </div>
              {i < 3 && <ArrowRight size={20} style={{ color: SUBTLE, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div className="flex-1 flex gap-8">
          <div className="flex-1 rounded-2xl border-2 border-dashed p-8 flex items-center gap-8"
            style={{ borderColor: `hsl(${WARM} / 0.4)`, background: `hsl(${WARM} / 0.04)` }}>
            <AlertTriangle size={48} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} />
            <div>
              <p className="font-black mb-2" style={{ fontSize: 48, color: `hsl(${WARM})`, lineHeight: 1 }}>$0</p>
              <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>governs the Hows that LLMs now execute from</p>
              <p className="mt-2" style={{ fontSize: 18, color: MUTED }}>Every AI tool generates Whats. No infrastructure governs the Hows behind them.</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>The pattern is clear</p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.6 }}>
              Every time a critical layer of organizational output got version control, governance, and change propagation,
              it created a multi-billion dollar infrastructure category.
              <strong style={{ color: TEXT }}> The How Layer is next.</strong>
            </p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — THE SOLUTION (LIZA's 4-step loop)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "Extract how your best people actually work — from documents, conversations, and execution patterns.",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Structure Hows into governed, versioned bundles — machine-readable and human-trustworthy.",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "LLMs generate Whats with organizational judgment built in — the semantic engine gets a proper fuel source.",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Propagate",
      desc: "When a How evolves, every downstream What updates. When execution reveals drift, the How improves.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Solution</p>

        <h2 className="font-black mb-3" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          LIZA is the infrastructure for the{" "}
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            How Layer.
          </span>
        </h2>
        <p className="mb-5" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          The next big frontier isn't better LLMs — it's encoding and scaling the <strong>Hows</strong> that LLMs execute from.
          LIZA makes organizational expertise machine-ready, governed, and alive.
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
// SLIDE 8 — CATEGORY VALIDATION ($98M+ invested)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Category Validation</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          $98M+ invested into this category.<br />
          <span style={{ color: `hsl(${GREEN})` }}>Four approaches. One missing layer.</span>
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-6 flex-1 min-h-0">
          {[
            {
              name: "Interloom", funding: "$19.5M", investors: "DN Capital, Air Street",
              approach: "Back-Office Automation", color: BLUE,
              desc: "Context graphs for repeatable ops. Facility mgmt, insurance, banking.",
              gap: "Handles the predictable. Not judgment.",
            },
            {
              name: "Edra.ai", funding: "$30M", investors: "Sequoia, 8VC, HubSpot",
              approach: "Process Mining", color: GREEN,
              desc: "Ex-Palantir. Mines IT tickets and data exhaust to auto-generate SOPs.",
              gap: "Mines what happened. Doesn't govern what should.",
            },
            {
              name: "Mem0.ai", funding: "$44.5M", investors: "Basis Set, YC, Peak XV",
              approach: "Memory Infrastructure", color: SEAFOAM,
              desc: "Developer tooling. Gives AI agents persistent memory across sessions.",
              gap: "Remembers what was said. Doesn't encode expertise.",
            },
            {
              name: "Paradox", funding: "~$3.8M", investors: "Speedinvest",
              approach: "Organizational Theory", color: GOLD,
              desc: "Copenhagen. Researches strategic drift and shared world models. Pre-product.",
              gap: "Studies why alignment breaks. Doesn't fix it.",
            },
          ].map(({ name, funding, investors, approach, color, desc, gap }) => (
            <div key={name} className="rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{name}</p>
                <span className="font-black" style={{ fontSize: 18, color: `hsl(${color})` }}>{funding}</span>
              </div>
              <p style={{ fontSize: 13, color: SUBTLE, marginBottom: 6 }}>{investors}</p>
              <p className="font-semibold mb-2" style={{ fontSize: 15, color: `hsl(${color})` }}>{approach}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4, flex: 1 }}>{desc}</p>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: `hsl(${color} / 0.15)` }}>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${WARM})` }}>{gap}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-6 flex items-center gap-8"
          style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.04)` }}>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <p className="font-black" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>LIZA OS</p>
              <span className="font-semibold px-3 py-1 rounded-full" style={{ fontSize: 13, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>The Governance Layer</span>
            </div>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
              Only LIZA governs the messy reality — encoding judgment, propagating changes, and ensuring every LLM-generated What
              is grounded in the latest How. <strong style={{ color: TEXT }}>Infrastructure, not features.</strong>
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-1 px-6 py-4 rounded-xl" style={{ background: `hsl(${GREEN} / 0.06)` }}>
            <p className="font-black" style={{ fontSize: 36, color: `hsl(${GREEN})` }}>$98M+</p>
            <p style={{ fontSize: 14, color: MUTED }}>Category investment</p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — ENTERPRISE PROOF (Graphisoft case study)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Enterprise Validation</p>

        <h2 className="font-black mb-6" style={{ fontSize: 50, color: DARK_TEXT, lineHeight: 1.05 }}>
          Design partnership with a Global AEC Software Company<br />
          <span style={{ color: `hsl(${GREEN})` }}>(part of a €6B Technology Group)</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-4">
            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
              <p className="font-semibold mb-2" style={{ fontSize: 16, color: `hsl(${TEAL})`, letterSpacing: "0.1em" }}>ENGAGEMENT</p>
              <p className="font-bold mb-2" style={{ fontSize: 24, color: DARK_TEXT }}>Post-merger integration across 4 departments</p>
              <p style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.5 }}>
                Product line merger into flagship platform. Leadership changes, team restructuring,
                CI/CD pipeline unification. First design partnership to validate multi-departmental deployment.
              </p>
            </div>
            <div className="rounded-xl border p-6 flex-1" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
              <p className="font-semibold mb-3" style={{ fontSize: 16, color: `hsl(${GREEN})`, letterSpacing: "0.1em" }}>WHAT HAPPENED IN THE FIRST SESSION</p>
              {[
                "Strategic decision propagated in real-time: Strategy → HR → R&D",
                "AI generated change comms following the company's playbook",
                "AI leaked a sensitive personnel change in the draft",
                "Senior corrected the AI. System learned the rule instantly.",
                "Next execution: AI automatically enforced it. No reminder.",
              ].map((point, i) => (
                <p key={i} className="flex items-start gap-3 mb-2" style={{ fontSize: 18, color: DARK_MUTED }}>
                  <span className="font-bold shrink-0" style={{ color: `hsl(${GREEN})` }}>→</span> {point}
                </p>
              ))}
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-4 justify-center">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "4", sub: "Departments", color: TEAL },
                { label: "16", sub: "VP-level attendees", color: GREEN },
                { label: "107", sub: "Minutes, first session", color: GOLD },
                { label: "Real", sub: "Live data, live cases", color: TEAL },
              ].map(({ label, sub, color }) => (
                <div key={sub} className="rounded-xl border p-5 text-center"
                  style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
                  <p className="font-black" style={{ fontSize: 32, color: `hsl(${color})`, lineHeight: 1 }}>{label}</p>
                  <p className="mt-1" style={{ fontSize: 15, color: DARK_MUTED }}>{sub}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5 flex items-center gap-4"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
              <Building2 size={24} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />
              <p style={{ fontSize: 16, color: DARK_MUTED }}>
                <strong style={{ color: DARK_TEXT }}>VP Product</strong> now serves as Strategic Advisor to LIZA OS
              </p>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: `hsl(${WARM} / 0.2)`, background: `hsl(${WARM} / 0.04)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 18, color: DARK_TEXT }}>What this proves</p>
              <p style={{ fontSize: 16, color: DARK_MUTED, lineHeight: 1.5 }}>
                This isn't a tool problem. It's an infrastructure problem. No other platform connects
                Strategy, HR, Change Management, and R&D through a shared, learning knowledge graph.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — VERTICAL EXPANSION (ALM pattern repeats)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Vertical Expansion</p>

        <h2 className="font-black mb-6" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          One engine. Every industry where <span style={{ color: `hsl(${BLUE})` }}>Whats</span> are governed<br/>
          <span style={{ color: `hsl(${TEAL})` }}>but Hows are not.</span>
        </h2>

        <div className="flex gap-5 flex-1 min-h-0">
          <div className="w-[38%] flex flex-col gap-4 justify-center">
            <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
              <p className="font-semibold mb-2" style={{ fontSize: 16, color: `hsl(${TEAL})`, letterSpacing: "0.1em" }}>THE PATTERN</p>
              <p className="font-bold mb-2" style={{ fontSize: 24, color: TEXT }}>Wherever $B infrastructure governs Whats, a How Layer is missing.</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
                LIZA becomes the "System of Reasoning" above existing Systems of Record. Each vertical uses the same engine
                with industry-specific playbook packs.
              </p>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-semibold mb-2" style={{ fontSize: 16, color: `hsl(${GOLD})`, letterSpacing: "0.1em" }}>EXPANSION STRATEGY</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
                Land horizontally with AI-native teams. Expand vertically with industry-specific compliance frameworks.
                Each vertical deepens the moat.
              </p>
            </div>
          </div>

          <div className="w-[62%] grid grid-cols-2 gap-4">
            {[
              {
                vertical: "Pharma & Biotech", status: "Live", color: GREEN,
                label: "Medicine Lifecycle Management",
                whatSystem: "Veeva Vault, LIMS ($65B PLM)",
                example: "Audit execution: 18-day process → 1.5 hours",
              },
              {
                vertical: "Professional Services", status: "Live", color: GREEN,
                label: "Delivery Lifecycle Management",
                whatSystem: "Salesforce, HubSpot, Notion",
                example: "Senior judgment encoded into delivery protocols",
              },
              {
                vertical: "Food Safety & Manufacturing", status: "Validated", color: TEAL,
                label: "Quality Lifecycle Management",
                whatSystem: "SAP QM, TraceGains ($18B GxP)",
                example: "Supplier audit judgment scaled to junior inspectors",
              },
              {
                vertical: "Lab Governance", status: "Validated", color: GOLD,
                label: "Lab Lifecycle Management",
                whatSystem: "LabWare, Benchling",
                example: "Method validation judgment scaled across labs",
              },
            ].map(({ vertical, status, color, label, whatSystem, example }) => (
              <div key={vertical} className="rounded-xl border p-5 flex flex-col"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{vertical}</p>
                  <span className="px-2 py-0.5 rounded-full font-semibold" style={{ fontSize: 12, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{status}</span>
                </div>
                <p className="font-semibold mb-2" style={{ fontSize: 15, color: `hsl(${color})` }}>{label}</p>
                <p className="mb-1" style={{ fontSize: 14, color: MUTED }}>Sits above: {whatSystem}</p>
                <p className="italic mt-auto" style={{ fontSize: 14, color: SUBTLE }}>"{example}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border px-6 py-4 flex items-center gap-5"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={24} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 18, color: MUTED }}>
            <strong style={{ color: TEXT }}>Each vertical is a separate wedge into a multi-billion-dollar compliance market.</strong>{" "}
            Same core engine. Industry-specific playbooks. Capital-efficient expansion.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM & TRACTION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Team & Traction</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Built by practitioners.<br/>
          <span style={{ color: `hsl(${TEAL})` }}>Validated by enterprise leaders.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Team */}
          <div className="flex-1 flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>FOUNDING TEAM</p>
            {[
              { name: "István Boscha", role: "Product & CEO", note: "Founder of Aliz.ai (Google Cloud Partner). 15+ years AI transformation globally.", photo: istvanPhoto, color: TEAL },
              { name: "Kristóf Éger", role: "Enterprise GTM", note: "Category creation, executive positioning, AI-driven business strategy.", photo: kristofPhoto, color: SEAFOAM },
              { name: "Zoltán Kauker", role: "AI Architecture", note: "Deep-tech AI/data engineering. Knowledge systems & scalable infrastructure.", photo: zoltanPhoto, color: MINT },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-5 rounded-xl border p-5"
                style={{ borderColor: `hsl(${t.color} / 0.2)`, background: `hsl(${t.color} / 0.03)` }}>
                <img src={t.photo} alt={t.name} className="w-16 h-16 rounded-full object-cover" style={{ border: `2px solid hsl(${t.color} / 0.3)` }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{t.name}</p>
                  <p style={{ fontSize: 16, color: `hsl(${t.color})` }}>{t.role}</p>
                  <p style={{ fontSize: 15, color: MUTED }}>{t.note}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border p-4 flex items-center gap-4 mt-auto"
              style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
              <Shield size={20} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
              <p style={{ fontSize: 15, color: MUTED }}>
                <strong style={{ color: TEXT }}>Advisory:</strong> Tom Ray (Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers)
                + Enterprise VP Product Advisor
              </p>
            </div>
          </div>

          {/* Traction */}
          <div className="w-[480px] flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>TRACTION</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: "15+", label: "Clients", icon: <Users size={20} /> },
                { stat: "8", label: "Countries", icon: <Globe size={20} /> },
                { stat: "15+ yrs", label: "Consulting depth", icon: <Briefcase size={20} /> },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="text-center rounded-xl px-3 py-4" style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                  <div className="flex justify-center mb-2" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black" style={{ fontSize: 32, color: TEXT }}>{stat}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{label}</p>
                </div>
              ))}
            </div>
            {[
              { title: "Live Product", desc: "Platform with AI edge functions, role-based modes, protocol execution, and knowledge graph.", color: TEAL },
              { title: "Design Partnership", desc: "Active engagement with global AEC software company (€6B group). VP-level across 4 departments.", color: GREEN },
              { title: "Multi-Vertical", desc: "Validated across pharma, professional services, sales operations, marketing, and executive search.", color: TEAL },
              { title: "AACE v3.1", desc: "Proprietary context specification. Intent-locking, hierarchical knowledge injection, drift detection. The IP moat.", color: GREEN },
            ].map(({ title, desc, color }) => (
              <div key={title} className="rounded-xl border p-4"
                style={{ borderColor: `hsl(${color} / 0.15)`, background: `hsl(${color} / 0.03)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 17, color: `hsl(${color})` }}>{title}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
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
// SLIDE 12 — THE ASK
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <p className="font-semibold tracking-[0.25em] uppercase mb-6" style={{ fontSize: 24, color: `hsl(${TEAL} / 0.8)` }}>Seed Round</p>

        <h2 className="font-black mb-8" style={{ fontSize: 96, color: DARK_TEXT }}>€300K</h2>

        <p className="mb-10" style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 900, lineHeight: 1.5 }}>
          To complete the platform, onboard design partners,<br />and establish the category.
        </p>

        <div className="flex gap-6 mb-12">
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
            $100B+ governs the <strong>Whats</strong> companies produce.<br />
            Zero governs the <strong>Hows</strong> behind them.<br />
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
  { id: 2, title: "The Foundation", component: <Slide02 /> },
  { id: 3, title: "The Human Era", component: <Slide03 /> },
  { id: 4, title: "The LLM Shift", component: <Slide04 /> },
  { id: 5, title: "The Propagation Crisis", component: <Slide05 /> },
  { id: 6, title: "The Infrastructure Gap", component: <Slide06 /> },
  { id: 7, title: "The Solution", component: <Slide07 /> },
  { id: 8, title: "Category Validation", component: <Slide08 /> },
  { id: 9, title: "Enterprise Proof", component: <Slide09 /> },
  { id: 10, title: "Vertical Expansion", component: <Slide10 /> },
  { id: 11, title: "Team & Traction", component: <Slide11 /> },
  { id: 12, title: "The Ask", component: <Slide12 /> },
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

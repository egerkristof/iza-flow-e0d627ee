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
// SLIDE 2 — THE SHIFT
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Shift</p>

        <h2 className="font-black mb-6" style={{ fontSize: 62, color: TEXT, lineHeight: 1.05 }}>
          AI removed the friction buffer.
        </h2>
        <p className="mb-14" style={{ fontSize: 26, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          When execution was slow, imperfect knowledge was manageable.
          Humans caught errors because they worked slowly enough to notice them.
          AI changed this.
        </p>

        <div className="flex-1 flex gap-12 items-stretch">
          <div className="flex-1 rounded-2xl border p-10 flex flex-col justify-center" style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-8" style={{ fontSize: 18, color: SUBTLE }}>Before AI</p>
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-black" style={{ fontSize: 52, color: MUTED }}>Slow</p>
                <p style={{ fontSize: 20, color: SUBTLE }}>Execution speed — weeks per deliverable</p>
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 52, color: `hsl(${GREEN})` }}>Fine</p>
                <p style={{ fontSize: 20, color: SUBTLE }}>Knowledge quality — seniors catch errors in reviews</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <Zap size={40} style={{ color: `hsl(${WARM})` }} />
            <p className="font-bold" style={{ fontSize: 20, color: `hsl(${WARM})` }}>AI arrives</p>
          </div>

          <div className="flex-1 rounded-2xl border-2 p-10 flex flex-col justify-center" style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-8" style={{ fontSize: 18, color: `hsl(${WARM})` }}>After AI</p>
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-black" style={{ fontSize: 52, color: `hsl(${GREEN})` }}>Instant</p>
                <p style={{ fontSize: 20, color: SUBTLE }}>Execution speed — minutes per deliverable</p>
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 52, color: `hsl(${WARM})` }}>Bottleneck</p>
                <p style={{ fontSize: 20, color: SUBTLE }}>Knowledge quality — 50 people, 50 versions of "correct"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE GAP
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Gap</p>

        <h2 className="font-black mb-4" style={{ fontSize: 58, color: DARK_TEXT, lineHeight: 1.05 }}>
          $100B+ governs what you produce.<br />
          <span style={{ color: `hsl(${WARM})` }}>Nothing governs how — and AI makes that fatal.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          AI now generates proposals, training decks, and contracts from your organizational knowledge.
          But that knowledge has no infrastructure. Every AI output inherits unmanaged, ungoverned "how."
        </p>

        <div className="flex-1 flex gap-10">
          <div className="flex-1 rounded-2xl border p-9 flex flex-col" style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.05)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>The What — Your Artifacts</p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { label: "Code", system: "ALM", market: "$34B", desc: "Version-controlled, CI/CD, traceable" },
                { label: "Products", system: "PLM", market: "$65B", desc: "BOM-managed, change-controlled, auditable" },
                { label: "Regulated docs", system: "GxP", market: "$18B", desc: "Validated, signed-off, compliant" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-5 px-6 py-5 rounded-xl" style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${BLUE} / 0.12)` }}>
                  <div className="flex-1">
                    <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>{item.label}</p>
                    <p style={{ fontSize: 17, color: DARK_MUTED }}>{item.desc}</p>
                  </div>
                  <span className="font-black px-4 py-2 rounded-lg" style={{ fontSize: 18, background: `hsl(${BLUE} / 0.1)`, color: `hsl(${BLUE})` }}>{item.market}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-5 font-semibold" style={{ fontSize: 20, color: `hsl(${BLUE})` }}>Governed. Traceable. Mature.</p>
          </div>

          <div className="flex-1 rounded-2xl border-2 p-9 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.05)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${WARM})` }}>The How — Your Knowledge</p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { label: "Sales methodology", where: "A wiki page — now fed to 12 AI agents", icon: "📄" },
                { label: "Onboarding expertise", where: "Tribal knowledge — now AI generates from it", icon: "🧠" },
                { label: "Quality standards", where: "A PDF from 2019 — now in 50 AI prompts", icon: "📋" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-5 px-6 py-5 rounded-xl" style={{ background: `hsl(${WARM} / 0.06)`, border: `1px solid hsl(${WARM} / 0.1)` }}>
                  <span style={{ fontSize: 32 }}>{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>{item.label}</p>
                    <p className="italic" style={{ fontSize: 17, color: DARK_MUTED }}>{item.where}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center mt-5 font-semibold" style={{ fontSize: 20, color: `hsl(${WARM})` }}>Ungoverned. AI amplifies every gap.</p>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE CRISIS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Propagation Crisis</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: TEXT, lineHeight: 1.05 }}>
          AI generates 50 outputs from one stale source.<br />
          <span style={{ color: `hsl(${WARM})` }}>None of them know it changed.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          You update a pricing model. AI has already generated 47 proposals, 8 decks, and 12 prompts from the old one.
          In code, changing a component updates every page. In AI-powered knowledge work, nothing connects.
        </p>

        <div className="flex-1 flex gap-10">
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${RED} / 0.2)`, background: `hsl(${RED} / 0.03)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${RED})` }}>Today — AI Amplifies the Problem</p>
            <div className="flex flex-col gap-3 flex-1">
              <div className="text-center py-4 rounded-xl mb-3" style={{ background: `hsl(${RED} / 0.06)` }}>
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>Pricing model updated</p>
              </div>
              {["AI generated 23 proposals — all using old pricing", "AI created 8 training decks — teaching wrong model", "AI drafted 4 contracts — inconsistent terms", "12 AI prompts — still embedding stale knowledge"].map((item) => (
                <div key={item} className="flex items-center gap-3 px-5 py-3 rounded-lg" style={{ background: `hsl(${RED} / 0.04)` }}>
                  <X size={16} style={{ color: `hsl(${RED})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 font-semibold" style={{ fontSize: 18, color: `hsl(${RED})` }}>AI executed perfectly — from the wrong source.</p>
          </div>

          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.03)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>With LIZA — AI Becomes the Solution</p>
            <div className="flex flex-col gap-3 flex-1">
              <div className="text-center py-4 rounded-xl mb-3" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>Pricing model updated</p>
              </div>
              {["23 proposals — flagged for review automatically", "8 training decks — queued for regeneration", "4 contracts — version-bumped with audit trail", "12 AI prompts — synced to new knowledge in real time"].map((item) => (
                <div key={item} className="flex items-center gap-3 px-5 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.04)` }}>
                  <CheckCircle2 size={16} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>Same AI. Connected knowledge. Automatic propagation.</p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — THE SOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "Expert knowledge becomes structured, versionable, and alive. AI extracts and organizes what was tribal.",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Knowledge organized into governed bundles. The How and the What become one connected graph.",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "AI executes with your best judgment built in. The gap between knowing and doing collapses.",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Propagate",
      desc: "When knowledge changes, every AI output updates. When outputs reveal patterns, knowledge improves.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Solution</p>

        <h2 className="font-black mb-4" style={{ fontSize: 58, color: DARK_TEXT, lineHeight: 1.05 }}>
          AI caused the crisis.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI is also the cure.
          </span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          LLMs make semantic synthesis cheap and fast for the first time. LIZA uses this to collapse the gap between what you know and what you produce — the first unified governance layer for the How and the What.
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
              <p style={{ fontSize: 20, color: DARK_MUTED, lineHeight: 1.55 }}>{s.desc}</p>
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

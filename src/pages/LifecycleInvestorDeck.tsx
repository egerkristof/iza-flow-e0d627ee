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
// SLIDE 01 — COVER: Connected Change
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

        <h1 className="font-black mb-8" style={{ fontSize: 78, lineHeight: 1.05, color: DARK_TEXT }}>
          When something changes,<br />
          does everything that depends on it<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            change too?
          </span>
        </h1>

        <p className="mb-6" style={{ fontSize: 30, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          AI is beginning to scale judgment. The infrastructure to govern it is just forming.
        </p>
        <p style={{ fontSize: 28, color: DARK_TEXT, maxWidth: 1100, lineHeight: 1.5 }}>
          <strong>We're building the complete version.</strong>
        </p>

        <div className="mt-14 flex items-center gap-16">
          {[
            ["Connected Change", "The universal discipline behind every reliable complex system"],
            ["LLMs", "Created the problem — and finally made the solution possible"],
            ["LIZA OS", "The platform that governs how knowledge becomes action"],
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
// SLIDE 02 — THE UNIVERSAL PROBLEM: Connected Change
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02ConnectedChange() {
  const examples = [
    {
      domain: "Aviation",
      icon: <Globe size={24} />,
      change: "Engine spec updated",
      deps: "Maintenance procedures, pilot training, spare parts inventory, compliance docs",
      system: "PLM + Configuration Management",
    },
    {
      domain: "Software",
      icon: <GitBranch size={24} />,
      change: "API contract changed",
      deps: "All consuming services, tests, documentation, deployment configs",
      system: "ALM + Version Control",
    },
    {
      domain: "Pharma",
      icon: <Shield size={24} />,
      change: "Dosing guideline revised",
      deps: "Clinical protocols, training materials, labeling, regulatory submissions",
      system: "GxP + Document Control",
    },
    {
      domain: "Knowledge Work",
      icon: <Brain size={24} />,
      change: "Methodology updated",
      deps: "Proposals, training decks, client briefs, SOPs, onboarding guides",
      system: "???",
      highlight: true,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 1 · The Universal Problem" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.05 }}>
          Every reliable system solves<br />
          <span style={{ color: `hsl(${TEAL})` }}>the same fundamental problem.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Configuration Management — maintaining consistency across interconnected parts when something changes —
          is the discipline behind every trillion-dollar industry that works.
        </p>

        <div className="flex-1 flex flex-col gap-4">
          {examples.map((e) => (
            <div key={e.domain} className="flex items-center gap-6 rounded-xl border px-7 py-5"
              style={{
                borderColor: e.highlight ? `hsl(${WARM} / 0.4)` : `hsl(215 10% 90%)`,
                background: e.highlight ? `hsl(${WARM} / 0.06)` : CARD_ALT,
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: e.highlight ? `hsl(${WARM} / 0.15)` : `hsl(${TEAL} / 0.1)`, color: e.highlight ? `hsl(${WARM})` : `hsl(${TEAL})` }}>
                {e.icon}
              </div>
              <div className="w-[140px] shrink-0">
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{e.domain}</p>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 18, color: MUTED }}>
                  <strong style={{ color: TEXT }}>{e.change}</strong> → {e.deps}
                </p>
              </div>
              <div className="w-[240px] shrink-0 text-right">
                <span className="px-4 py-2 rounded-lg font-semibold" style={{
                  fontSize: 17,
                  background: e.highlight ? `hsl(${WARM} / 0.15)` : `hsl(${TEAL} / 0.08)`,
                  color: e.highlight ? `hsl(${WARM})` : `hsl(${TEAL})`,
                }}>{e.system}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p style={{ fontSize: 24, color: MUTED }}>
            Aviation, software, pharma all solved this.
            <strong style={{ color: `hsl(${WARM})` }}> Knowledge work never did.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — LLMs: THE ACCELERANT (Cause)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03LLMsAccelerant() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 2 · The Cause" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 62, color: DARK_TEXT, lineHeight: 1.05 }}>
          LLMs didn't break knowledge management.<br />
          <span style={{ color: `hsl(${WARM})` }}>They revealed it was never managed.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          Before AI, humans were the "friction buffer" — slow enough to occasionally catch inconsistencies.
          AI removed that buffer. Now disconnected outputs compound at machine speed.
        </p>

        <div className="flex-1 flex gap-10">
          {/* Left: The old friction buffer */}
          <div className="flex-1 rounded-2xl border p-8" style={{ borderColor: `hsl(200 15% 16%)`, background: DARK_CARD }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: DARK_SUBTLE }}>
              Before AI — The Friction Buffer
            </p>
            <div className="flex flex-col gap-5">
              {[
                { label: "Slow execution", detail: "Humans wrote slowly enough to sometimes notice drift" },
                { label: "Tribal knowledge", detail: "Senior people caught errors because they 'just knew'" },
                { label: "Manual reviews", detail: "Bottleneck reviews accidentally caught some inconsistencies" },
              ].map((item) => (
                <div key={item.label} className="px-5 py-4 rounded-lg" style={{ background: `hsl(200 10% 14%)` }}>
                  <p className="font-semibold mb-1" style={{ fontSize: 20, color: DARK_MUTED }}>{item.label}</p>
                  <p style={{ fontSize: 17, color: DARK_SUBTLE }}>{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center" style={{ fontSize: 18, color: DARK_SUBTLE }}>Fragile. Unscalable. But it sort-of worked.</p>
          </div>

          {/* Right: AI removed the buffer */}
          <div className="flex-1 rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${WARM} / 0.4)`, background: `hsl(${WARM} / 0.06)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              With AI — Buffer Removed
            </p>
            <div className="flex flex-col gap-5">
              {[
                { label: "100× output speed", detail: "Every team member produces more — all disconnected from source standards", icon: <Zap size={20} /> },
                { label: "No shared source of truth", detail: "Each person prompts their own way, creates their own version of 'correct'", icon: <Split size={20} /> },
                { label: "Drift at machine speed", detail: "Errors compound faster than anyone can review", icon: <AlertTriangle size={20} /> },
              ].map((item) => (
                <div key={item.label} className="px-5 py-4 rounded-lg flex items-start gap-4" style={{ background: `hsl(${WARM} / 0.08)` }}>
                  <div className="mt-1 shrink-0" style={{ color: `hsl(${WARM})` }}>{item.icon}</div>
                  <div>
                    <p className="font-semibold mb-1" style={{ fontSize: 20, color: DARK_TEXT }}>{item.label}</p>
                    <p style={{ fontSize: 17, color: DARK_MUTED }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center font-semibold" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
              AI scales execution. Nothing scales the judgment behind it.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — LLMs: THE ENABLER (Cure)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04LLMsEnabler() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 2 · The Cure" color={TEAL} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: TEXT, lineHeight: 1.05 }}>
          But LLMs also made the<br />
          <span style={{ color: `hsl(${TEAL})` }}>solution possible for the first time.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          Configuration Management worked for code because code has explicit imports and type systems.
          Human knowledge never had that. Until now.
        </p>

        <div className="flex-1 flex gap-10">
          {/* Why it was impossible */}
          <div className="flex-1 flex flex-col">
            <p className="font-bold mb-5" style={{ fontSize: 22, color: SUBTLE }}>Why this was impossible before</p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                "Knowledge is unstructured — no imports, no type system",
                "Dependencies between concepts are implicit and contextual",
                "Expertise lives in people's heads, not in formal graphs",
                "Changes in judgment can't be tracked with traditional diffs",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3 rounded-lg"
                  style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.1)` }}>
                  <X size={18} style={{ color: `hsl(${RED} / 0.6)`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: MUTED }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `hsl(${TEAL} / 0.12)` }}>
              <Sparkles size={28} style={{ color: `hsl(${TEAL})` }} />
            </div>
            <p className="font-bold text-center" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
              LLMs unlock<br />semantic linking
            </p>
          </div>

          {/* What LLMs enable */}
          <div className="flex-1 flex flex-col">
            <p className="font-bold mb-5" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>What LLMs now make possible</p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                "Semantic dependency tracking across unstructured knowledge",
                "Automatic detection of what depends on what",
                "Change impact analysis across living business artifacts",
                "Continuous integrity checks between standards and outputs",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3 rounded-lg"
                  style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 19, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl px-10 py-5 text-center"
          style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
          <p style={{ fontSize: 23, color: TEXT }}>
            For the first time in history, we can build <strong style={{ color: `hsl(${TEAL})` }}>Configuration Management for human judgment.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — SOUND FAMILIAR?
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05SoundFamiliar() {
  const scenarios = [
    {
      icon: <Users size={32} />,
      title: "Your best person left.",
      desc: "They took 8 years of expertise with them. New hires make the same mistakes for months. There was no system to capture their judgment — or propagate it.",
      color: WARM,
    },
    {
      icon: <Zap size={32} />,
      title: "AI made everyone faster — and less consistent.",
      desc: "Each team member prompts differently, gets different results. Output volume is up. Quality consistency is down. There's no connected standard to enforce.",
      color: TEAL,
    },
    {
      icon: <AlertTriangle size={32} />,
      title: "A standard changed. Nothing else did.",
      desc: "Compliance updated the methodology. The 23 proposals, 8 training decks, and 4 contracts that depend on it? Still using the old version. No system flagged them.",
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
          In aviation, an untracked change is a grounded fleet. In software, it's a production outage.
          In knowledge work? "Just how things are."
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {scenarios.map((s) => (
            <div key={s.title} className="rounded-2xl border p-8 flex flex-col"
              style={{ borderColor: `hsl(${s.color} / 0.25)`, background: `hsl(${s.color} / 0.06)` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `hsl(${s.color} / 0.15)`, color: `hsl(${s.color})` }}>
                {s.icon}
              </div>
              <p className="font-bold mb-4" style={{ fontSize: 28, color: DARK_TEXT }}>{s.title}</p>
              <p className="flex-1" style={{ fontSize: 21, color: DARK_MUTED, lineHeight: 1.55 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl px-10 py-6 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <p style={{ fontSize: 24, color: DARK_TEXT }}>
            Connected Change has a name for this: <strong style={{ color: `hsl(${TEAL})` }}>a configuration defect.</strong>
            <br />Every other critical industry has solved it. Knowledge work is next.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — MARKET VALIDATION: $100B+ in Configuration Management
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06MarketValidation() {
  const markets = [
    {
      name: "ALM",
      full: "Application Lifecycle Management",
      market: "$34B",
      domain: "Software",
      what: "Traceability from requirements → code → tests. Change propagation across codebases.",
      players: "IBM, PTC, Siemens, Microsoft",
      color: BLUE,
    },
    {
      name: "PLM",
      full: "Product Lifecycle Management",
      market: "$65B",
      domain: "Manufacturing",
      what: "Bill-of-materials integrity. Change orders cascade from design to factory floor.",
      players: "Siemens Teamcenter, PTC Windchill, Dassault",
      color: GREEN,
    },
    {
      name: "GxP",
      full: "Good Practice Management",
      market: "$18B",
      domain: "Pharma & Life Sciences",
      what: "Document control for clinical trials. Every protocol change traced end-to-end.",
      players: "Veeva, MasterControl, Documentum",
      color: SEAFOAM,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 3 · Market Validation" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
          This discipline creates<br />
          <span style={{ color: `hsl(${TEAL})` }}>$100B+ categories. Every time.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          ALM, PLM, and GxP are all domain-specific implementations of the same principle:
          <strong style={{ color: TEXT }}> when something changes, everything that depends on it must be traced, flagged, and updated.</strong>
        </p>

        <div className="flex-1 grid grid-cols-3 gap-6">
          {markets.map((m) => (
            <div key={m.name} className="rounded-2xl border p-7 flex flex-col"
              style={{ borderColor: `hsl(${m.color} / 0.2)`, background: CARD_ALT }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black" style={{ fontSize: 32, color: TEXT }}>{m.name}</span>
                <span className="font-black px-3 py-1 rounded-lg" style={{ fontSize: 22, background: `hsl(${m.color} / 0.1)`, color: `hsl(${m.color})` }}>{m.market}</span>
              </div>
              <p className="font-semibold mb-4" style={{ fontSize: 17, color: `hsl(${m.color})` }}>{m.full}</p>
              <p className="font-bold mb-2" style={{ fontSize: 18, color: SUBTLE }}>{m.domain}</p>
              <p className="mb-5 flex-1" style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{m.what}</p>
              <div className="pt-4 border-t" style={{ borderColor: `hsl(215 10% 90%)` }}>
                <p style={{ fontSize: 16, color: SUBTLE }}>{m.players}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
          <p style={{ fontSize: 22, color: TEXT }}>
            None of these cover <strong style={{ color: `hsl(${TEAL})` }}>judgment-driven, knowledge-intensive work</strong> — consulting, professional services, enterprise GTM, compliance.
            <strong style={{ color: `hsl(${TEAL})` }}> That's the whitespace.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — TWO LAYERS: Knowledge ↔ Artifacts
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07TwoLayers() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Act 4 · The Architecture" color={TEAL} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.05 }}>
          When knowledge changes,<br />
          <span style={{ color: `hsl(${TEAL})` }}>every artifact should know.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          And when an artifact reveals something new — a client insight, a project learning —
          the knowledge base should update too. Connected Change flows both ways.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {/* Left: Knowledge layer */}
            <div className="w-[520px] rounded-2xl p-10" style={{ background: `hsl(${TEAL} / 0.1)`, border: `2px solid hsl(${TEAL} / 0.3)` }}>
              <div className="flex items-center gap-3 mb-6">
                <Brain size={28} style={{ color: `hsl(${TEAL})` }} />
                <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>What People Know</span>
              </div>
              <p className="mb-4" style={{ fontSize: 18, color: DARK_SUBTLE }}>Standards, expertise, methodologies</p>
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
              <p className="mb-4" style={{ fontSize: 18, color: DARK_SUBTLE }}>Proposals, deliverables, SOPs, training</p>
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
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.05 }}>
          LIZA: Connected Change<br />
          <span style={{ color: `hsl(${TEAL})` }}>for everything AI produces.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          Four steps. One loop. The same disciplines that made aviation safe, software reliable, and pharma compliant — now applied to how organizations think, decide, and deliver.
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
                  <ArrowRight size={24} style={{ color: `hsl(${TEAL} / 0.4)` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <RefreshCw size={20} style={{ color: `hsl(${MINT})` }} />
          <p style={{ fontSize: 22, color: MUTED }}>
            Step 4 feeds back into Step 1 — <strong style={{ color: TEXT }}>the system compounds, just like a well-maintained codebase.</strong>
          </p>
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
        <DarkTag label="You've Already Seen This" color={MINT} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          This deck was built with<br />
          <span style={{ color: `hsl(${MINT})` }}>a primitive version of what we're building.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          Modern AI coding tools already demonstrate Connected Change for code:
          change one component, and the system identifies 15 other files that need updating.
          LIZA does this for everything else an organization produces.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          <div className="rounded-2xl border p-8" style={{ borderColor: `hsl(${BLUE} / 0.3)`, background: `hsl(${BLUE} / 0.06)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Box size={28} style={{ color: `hsl(${BLUE})` }} />
              <span className="font-bold" style={{ fontSize: 26, color: DARK_TEXT }}>AI Coding Tools (Today)</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "Change a component → system flags impacted files",
                "Dependency graph tracks what connects to what",
                "Automated propagation across the codebase",
                "Version history for every change",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-4 py-3 rounded-lg"
                  style={{ background: `hsl(${BLUE} / 0.08)` }}>
                  <CheckCircle2 size={18} style={{ color: `hsl(${BLUE})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 20, color: DARK_TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 px-4 py-3 rounded-lg" style={{ background: `hsl(${BLUE} / 0.12)` }}>
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>
                Connected Change for code. Only code.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Network size={28} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold" style={{ fontSize: 26, color: DARK_TEXT }}>LIZA OS (What We're Building)</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "Change a standard → system flags impacted deliverables",
                "Knowledge graph tracks expertise dependencies",
                "Governed propagation across all living artifacts",
                "Version history for every piece of expertise",
                "Feedback loop: artifacts improve the knowledge base",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 px-4 py-3 rounded-lg"
                  style={{ background: `hsl(${TEAL} / 0.1)` }}>
                  <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 20, color: DARK_TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 px-4 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.15)` }}>
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
                Connected Change for everything your organization produces.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — COMPETITIVE LANDSCAPE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10Competition() {
  const competitors = [
    {
      name: "Edra", raised: "$30M", focus: "Repeatable Ops",
      desc: "Automates predictable, back-office processes. Payroll, onboarding, procurement.",
      limitation: "Only handles standardized tasks. No judgment, no expertise capture.",
    },
    {
      name: "Mem0", raised: "$44.5M", focus: "Memory Plumbing",
      desc: "Persistent memory for AI agents. Remembers preferences and history.",
      limitation: "Memory without governance. Stores what happened — doesn't manage what should happen.",
    },
    {
      name: "Interloom", raised: "$16.5M", focus: "Knowledge Graphs",
      desc: "Maps tacit knowledge into navigable graphs for discovery.",
      limitation: "Captures knowledge but doesn't connect it to live artifacts or propagate changes.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Act 5 · The Proof" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.1 }}>
          $98M+ validates the category.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Nobody is building Connected Change.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          Every competitor solves one piece. None deliver the full lifecycle — capture, govern, execute, propagate.
        </p>

        <div className="flex-1 flex gap-5">
          {competitors.map((c) => (
            <div key={c.name} className="flex-1 rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold" style={{ fontSize: 26, color: TEXT }}>{c.name}</span>
                <span className="px-3 py-1 rounded-lg font-bold" style={{ fontSize: 16, background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>{c.raised}</span>
              </div>
              <span className="font-semibold mb-3 px-3 py-1 rounded-lg self-start"
                style={{ fontSize: 15, background: `hsl(${TEAL} / 0.08)`, color: `hsl(${TEAL})` }}>{c.focus}</span>
              <p className="mb-4" style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{c.desc}</p>
              <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(215 10% 90%)` }}>
                <p className="flex items-start gap-2" style={{ fontSize: 17, color: SUBTLE }}>
                  <X size={16} style={{ color: `hsl(${RED})`, marginTop: 3, flexShrink: 0 }} />
                  {c.limitation}
                </p>
              </div>
            </div>
          ))}

          <div className="flex-1 rounded-2xl border-2 p-6 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold" style={{ fontSize: 26, color: TEXT }}>LIZA OS</span>
              <span className="px-3 py-1 rounded-lg font-bold" style={{ fontSize: 16, background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})` }}>Full Loop</span>
            </div>
            <span className="font-semibold mb-3 px-3 py-1 rounded-lg self-start"
              style={{ fontSize: 15, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>Connected Change</span>
            <p className="mb-4" style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>
              Captures expertise, governs it, executes with it, and propagates changes across all connected artifacts.
            </p>
            <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(${TEAL} / 0.2)` }}>
              <p className="flex items-start gap-2" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>
                <CheckCircle2 size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                The only system managing the full knowledge lifecycle.
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
// SLIDE 11 — TRACTION & GTM
// ═══════════════════════════════════════════════════════════════════════════════

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
          We land with consulting — solving real Connected Change problems. We expand with the platform — making the solution permanent and self-improving.
        </p>

        <div className="flex-1 flex gap-10">
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

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — TEAM
// ═══════════════════════════════════════════════════════════════════════════════

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
          LIZA is the Connected Change system we wished existed for the work we do every day.
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
// SLIDE 13 — BUSINESS MODEL
// ═══════════════════════════════════════════════════════════════════════════════

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
          Consulting captures real institutional knowledge and proves value.
          The platform makes Connected Change permanent, scalable, and self-improving.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          <div className="rounded-2xl border p-8 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={28} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>Consulting Wedge</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "4-week Assess, Align, Apply engagement",
                "Captures institutional knowledge firsthand",
                "Builds trust through measurable outcomes",
                "Natural expansion: more teams, more lifecycles",
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
                "Vertical expansion: same Connected Change, new industries",
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
            Connected Change created $100B+ in markets where it was applied.<br />
            Knowledge work — the largest category of all — has never had it.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>LIZA is the platform that changes that.</strong>
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
  { id: 2, title: "Connected Change", component: <Slide02ConnectedChange /> },
  { id: 3, title: "LLMs: The Accelerant", component: <Slide03LLMsAccelerant /> },
  { id: 4, title: "LLMs: The Enabler", component: <Slide04LLMsEnabler /> },
  { id: 5, title: "Sound Familiar?", component: <Slide05SoundFamiliar /> },
  { id: 6, title: "Market Validation", component: <Slide06MarketValidation /> },
  { id: 7, title: "Two Layers", component: <Slide07TwoLayers /> },
  { id: 8, title: "LIZA OS", component: <Slide08LizaOS /> },
  { id: 9, title: "The Lovable Proof", component: <Slide09LovableProof /> },
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Connected-Change-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Connected Change Platform</span>
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Connected-Change-Deck" slideCount={SLIDES.length} variant="desktop" />
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

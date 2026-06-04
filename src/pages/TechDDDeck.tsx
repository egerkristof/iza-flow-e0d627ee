import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  Database, Cpu, Layers, GitBranch, Workflow, ShieldCheck, Coins, TrendingDown,
  Gauge, Brain, Lock, Network, ArrowRight, ArrowDown, ChevronLeft, ChevronRight,
  Maximize2, X, Grid3x3, AlertCircle, Sparkles, FileText, Boxes, Radio, Zap,
  Eye, Activity, Users, GraduationCap, MessageSquare, Globe, Compass,
  GitPullRequest, CheckCircle2, AlertTriangle, Send, UserCheck,
  Leaf, HeartHandshake, LineChart, HelpCircle,
  User, Building2, KeyRound, FileSignature, ArrowLeftRight, Package, Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";

// ─── Scaled slide container ──────────────────────────────────────────────────
export function ScaledSlide({ children }: { children: React.ReactNode }) {
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
      }}>{children}</div>
    </div>
  );
}

// ─── Tokens ──────────────────────────────────────────────────────────────────
export const BG = "hsl(0 0% 100%)";
export const TEXT = "hsl(222 20% 10%)";
export const MUTED = "hsl(215 15% 42%)";
export const SUBTLE = "hsl(215 10% 56%)";
export const CARD_ALT = "hsl(220 15% 97%)";
export const GRID_LINE = "hsl(215 15% 75%)";
export const CHROME_BG = "hsl(220 15% 97%)";
export const CHROME_BORDER = "hsl(220 12% 90%)";
export const ACCENT = "200 90% 42%";
export const GREEN = "155 72% 38%";
export const GOLD = "45 95% 42%";
export const RED = "0 72% 50%";
export const PURPLE = "265 60% 52%";
export const DARK_BG = "hsl(222 25% 8%)";
export const DARK_TEXT = "hsl(0 0% 95%)";
export const DARK_MUTED = "hsl(215 15% 60%)";

export function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}
export function DarkGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.08]" style={{
      backgroundImage: `linear-gradient(hsl(215 15% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 25%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}
export function SlideBar({ from = ACCENT, to = GREEN }: { from?: string; to?: string }) {
  return <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />;
}
export function Tag({ label, color = ACCENT }: { label: string; color?: string }) {
  return <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 24, color: `hsl(${color})` }}>{label}</p>;
}
export function PhaseChip({ phase, color = ACCENT }: { phase: string; color?: string }) {
  return (
    <div className="absolute top-10 right-12 flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.25)` }}>
      <span className="font-mono tracking-[0.15em] uppercase font-semibold" style={{ fontSize: 13, color: `hsl(${color})` }}>{phase}</span>
    </div>
  );
}
// Slide index context — drives page numbers from SLIDES array position so
// we cannot drift out of sync as slides get added, removed, or reordered.
const SlideIndexContext = createContext<{ index: number; total: number } | null>(null);
export function SlideIndexProvider({ index, total, children }: { index: number; total: number; children: React.ReactNode }) {
  return <SlideIndexContext.Provider value={{ index, total }}>{children}</SlideIndexContext.Provider>;
}
export function PageNumber({ n, total, dark = false }: { n?: number; total?: number; dark?: boolean }) {
  const ctx = useContext(SlideIndexContext);
  const num = ctx ? ctx.index + 1 : (n ?? 1);
  const tot = ctx ? ctx.total : (total ?? 1);
  return (
    <div className="absolute top-10 left-12 font-mono" style={{ fontSize: 14, color: dark ? DARK_MUTED : SUBTLE, letterSpacing: "0.15em" }}>
      {String(num).padStart(2, "0")} / {String(tot).padStart(2, "0")}
    </div>
  );
}
export function Footer({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div className="absolute left-28 right-28 bottom-7 flex items-center gap-3"
      style={{ color: dark ? DARK_MUTED : SUBTLE, fontSize: 15, letterSpacing: "0.02em" }}>
      <span style={{ width: 32, height: 1, background: dark ? "hsl(0 0% 100% / 0.2)" : CHROME_BORDER }} />
      <span>{text}</span>
    </div>
  );
}

// Persistent arc stepper used across the four-slide architecture spine.
// Each step is the verb that names the slide's job.
const ARC_STEPS = [
  { n: "01", label: "Compile" },
  { n: "02", label: "Defend" },
  { n: "03", label: "Commit" },
  { n: "04", label: "Compound" },
] as const;

function ArcStepper({ current, next }: { current: 1 | 2 | 3 | 4; next?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700, marginRight: 6 }}>
        The arc
      </span>
      {ARC_STEPS.map((s, i) => {
        const isCurrent = i + 1 === current;
        const isPast = i + 1 < current;
        const color = isCurrent ? `hsl(${GREEN})` : isPast ? TEXT : SUBTLE;
        const bg = isCurrent ? `hsl(${GREEN} / 0.10)` : "white";
        const border = isCurrent ? `hsl(${GREEN} / 0.55)` : CHROME_BORDER;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border"
              style={{ background: bg, borderColor: border }}>
              <span className="font-mono" style={{ fontSize: 10, fontWeight: 800, color }}>{s.n}</span>
              <span className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: 10, color }}>{s.label}</span>
              {isCurrent && <span className="rounded-full" style={{ width: 5, height: 5, background: `hsl(${GREEN})` }} />}
            </div>
            {i < ARC_STEPS.length - 1 && (
              <span style={{ width: 12, height: 1, background: CHROME_BORDER }} />
            )}
          </div>
        );
      })}
      {next && (
        <span className="ml-3 font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10, color: SUBTLE }}>
          next: <span style={{ color: TEXT, fontWeight: 700 }}>{next}</span>
        </span>
      )}
    </div>
  );
}

const TOTAL = 20;

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER
// ═════════════════════════════════════════════════════════════════════════════
function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-10" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>
          LIZA OS · Tech Due Diligence · Confidential
        </p>
        <h1 className="font-bold leading-[1.02]" style={{ fontSize: 104, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          The AI Governance Loop.
        </h1>
        <p className="mt-10 mx-auto" style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 1400, lineHeight: 1.35 }}>
          <span style={{ color: DARK_TEXT, fontWeight: 600 }}>Safeguard what is most valuable. Scale what is best about you.</span> Continuously, at the speed of AI. AACE compiles every prompt against typed org knowledge.
        </p>
        <div className="mt-10 flex items-center justify-center gap-8" style={{ fontSize: 22, color: DARK_TEXT }}>
          <span><b style={{ color: `hsl(${GREEN})` }}>$0.40</b> per decision</span>
          <span style={{ color: "hsl(0 0% 100% / 0.25)" }}>·</span>
          <span><b style={{ color: `hsl(${GREEN})` }}>95%</b> gross margin</span>
          <span style={{ color: "hsl(0 0% 100% / 0.25)" }}>·</span>
          <span><b style={{ color: `hsl(${GREEN})` }}>€23</b> manual cost displaced</span>
        </div>
      </div>
      <div className="absolute bottom-16 flex items-center gap-8" style={{ color: DARK_MUTED, fontSize: 16, letterSpacing: "0.15em" }}>
        <span className="uppercase font-semibold">Phase 1 · Paradigm</span>
        <span style={{ color: "hsl(0 0% 100% / 0.3)" }}>·</span>
        <span className="uppercase font-semibold">Phase 2 · Architecture</span>
        <span style={{ color: "hsl(0 0% 100% / 0.3)" }}>·</span>
        <span className="uppercase font-semibold">Phase 3 · Commercial</span>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE THREE HORIZONS COLLAPSE
// ═════════════════════════════════════════════════════════════════════════════
function S02Horizons() {
  const past = [
    { h: "H3 · Transform", sub: "5+ yr bets", w: "55%", color: PURPLE },
    { h: "H2 · Improve", sub: "1-3 yr programmes", w: "75%", color: ACCENT },
    { h: "H1 · Run", sub: "Quarter to quarter", w: "100%", color: GREEN },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={2} total={TOTAL} />
      <PhaseChip phase="Phase 1 · Paradigm" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="The Context We Operate In" />
        <h2 className="font-bold leading-[1.05]" style={{ fontSize: 64, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          Sequential planning cycles cannot hold this state. <span style={{ color: `hsl(${ACCENT})` }}>A runtime can.</span>
        </h2>
        <p className="mt-3" style={{ fontSize: 22, color: MUTED, maxWidth: 1500 }}>
          Run, improve, and transform now collapse into the same calendar week. Static SOPs and quarterly reviews were built for a staircase that no longer exists.
        </p>

        <div className="grid grid-cols-2 gap-10 mt-12">
          {/* PAST */}
          <div className="rounded-2xl border p-10" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 520 }}>
            <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 14, color: SUBTLE }}>The past · sequential</p>
            <p className="font-bold mb-8" style={{ fontSize: 32, color: TEXT }}>Staircase of horizons</p>
            <div className="flex flex-col gap-4 items-start">
              {past.map(p => (
                <div key={p.h} className="rounded-xl border-2 px-6 py-4 flex items-center justify-between"
                  style={{
                    width: p.w, borderColor: `hsl(${p.color} / 0.4)`,
                    background: `linear-gradient(90deg, hsl(${p.color} / 0.06), hsl(${p.color} / 0.14))`,
                  }}>
                  <span className="font-bold" style={{ fontSize: 22, color: TEXT }}>{p.h}</span>
                  <span style={{ fontSize: 16, color: MUTED }}>{p.sub}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 italic" style={{ fontSize: 16, color: MUTED }}>
              Run today. Improve next year. Transform on the five-year plan.
            </p>
          </div>

          {/* TODAY */}
          <div className="rounded-2xl border-2 p-10 relative overflow-hidden"
            style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.04)`, height: 520 }}>
            <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>Today · collapsed</p>
            <p className="font-bold mb-8" style={{ fontSize: 32, color: TEXT }}>Permanent edge state</p>

            <div className="relative mx-auto" style={{ width: 360, height: 280 }}>
              {/* three overlapping rings */}
              <div className="absolute rounded-full border-2"
                style={{ width: 220, height: 220, left: 0, top: 30, borderColor: `hsl(${GREEN} / 0.55)`, background: `hsl(${GREEN} / 0.10)` }} />
              <div className="absolute rounded-full border-2"
                style={{ width: 220, height: 220, left: 140, top: 30, borderColor: `hsl(${ACCENT} / 0.55)`, background: `hsl(${ACCENT} / 0.10)` }} />
              <div className="absolute rounded-full border-2"
                style={{ width: 220, height: 220, left: 70, top: 0, borderColor: `hsl(${PURPLE} / 0.55)`, background: `hsl(${PURPLE} / 0.10)` }} />
              {/* labels */}
              <span className="absolute font-bold" style={{ left: 18, top: 236, fontSize: 18, color: `hsl(${GREEN})` }}>H1 Run</span>
              <span className="absolute font-bold" style={{ left: 256, top: 236, fontSize: 18, color: `hsl(${ACCENT})` }}>H2 Improve</span>
              <span className="absolute font-bold text-center" style={{ left: 130, top: -26, fontSize: 18, color: `hsl(${PURPLE})`, width: 120 }}>H3 Transform</span>
              {/* center label */}
              <div className="absolute flex items-center justify-center text-center font-bold"
                style={{ left: 130, top: 110, width: 120, height: 60, fontSize: 16, color: TEXT, lineHeight: 1.2 }}>
                same week<br />same team
              </div>
            </div>

            <p className="mt-6 italic" style={{ fontSize: 16, color: MUTED }}>
              Every business now runs, improves, and transforms on the same calendar week.
            </p>
          </div>
        </div>
      </div>
      <Footer text="That runtime is the cognitive infrastructure on the next slide." />
      <SlideBar from={GREEN} to={PURPLE} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 02b — THE AI GOVERNANCE LOOP (Thesis spine)
// Five surfaces every org must safeguard AND scale at the speed of AI.
// Reclaims "governance" from model-governance vendors (Credo, Fiddler, Arthur).
// ═════════════════════════════════════════════════════════════════════════════
export function S03GovernanceLoop() {
  const surfaces = [
    { k: "Standards", safeguard: "Your quality bar from drift and dilution",      scale: "Consistent execution at AI velocity",          icon: ShieldCheck },
    { k: "Judgment",  safeguard: "Senior expertise from attrition and averaging",  scale: "Decisions that reflect your best people",      icon: Brain },
    { k: "Memory",    safeguard: "Institutional knowledge from leaking into LLMs", scale: "Compounding context, owned not rented",        icon: Database },
    { k: "Spend",     safeguard: "AI budget from unanchored token consumption",    scale: "Every token tied to a named outcome",          icon: Coins },
    { k: "Exposure",  safeguard: "IP, audit trail, regulatory surface",            scale: "Provable lineage for every AI decision",       icon: Lock },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <PhaseChip phase="Phase 1 · Thesis" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="The Thesis · AI Governance Loop" />
        <h2 className="font-bold leading-[1.05]" style={{ fontSize: 60, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1760 }}>
          <span style={{ color: `hsl(${RED})` }}>Whatever you do not govern, AI invents.</span>{" "}
          <span style={{ color: TEXT }}>Whatever you do not safeguard,</span>{" "}
          <span style={{ color: `hsl(${RED})` }}>AI dissolves.</span>
        </h2>
        <p className="mt-3" style={{ fontSize: 22, color: MUTED, maxWidth: 1600 }}>
          Model governance watches the AI. <b style={{ color: TEXT }}>LIZA governs the moment of decision.</b> Five organizational surfaces, safeguarded from the speed of AI and compounded into your edge.
        </p>

        {/* Header row */}
        <div className="grid mt-9" style={{ gridTemplateColumns: "260px 1fr 1fr", gap: 0 }}>
          <div />
          <div className="px-6 py-3" style={{ background: `hsl(${RED} / 0.06)`, borderTopLeftRadius: 12, borderTop: `1px solid hsl(${RED} / 0.3)`, borderLeft: `1px solid hsl(${RED} / 0.3)`, borderRight: `1px solid hsl(${RED} / 0.15)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 14, color: `hsl(${RED})` }}>Safeguard · without it, AI is dangerous</p>
          </div>
          <div className="px-6 py-3" style={{ background: `hsl(${GREEN} / 0.06)`, borderTopRightRadius: 12, borderTop: `1px solid hsl(${GREEN} / 0.35)`, borderRight: `1px solid hsl(${GREEN} / 0.35)`, borderLeft: `1px solid hsl(${GREEN} / 0.15)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Scale · without it, AI is meaningless</p>
          </div>
        </div>

        {/* Rows */}
        <div style={{ borderLeft: `1px solid ${CHROME_BORDER}`, borderRight: `1px solid ${CHROME_BORDER}`, borderBottom: `1px solid ${CHROME_BORDER}`, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: "hidden" }}>
          {surfaces.map((s, i) => {
            const Icon = s.icon;
            const altBg = i % 2 === 0 ? "white" : CARD_ALT;
            return (
              <div key={s.k} className="grid items-stretch" style={{ gridTemplateColumns: "260px 1fr 1fr", background: altBg, borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}` }}>
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderRight: `1px solid ${CHROME_BORDER}` }}>
                  <div className="rounded-md flex items-center justify-center" style={{ width: 36, height: 36, background: `hsl(${ACCENT} / 0.10)`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
                    <Icon size={20} color={`hsl(${ACCENT})`} />
                  </div>
                  <span className="font-bold" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.01em" }}>{s.k}</span>
                </div>
                <div className="px-6 py-4 flex items-center" style={{ borderRight: `1px solid ${CHROME_BORDER}`, background: `hsl(${RED} / 0.025)` }}>
                  <span style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>{s.safeguard}</span>
                </div>
                <div className="px-6 py-4 flex items-center" style={{ background: `hsl(${GREEN} / 0.035)` }}>
                  <span style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>{s.scale}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex items-center gap-3 px-5 py-3 rounded-xl" style={{ background: `hsl(${ACCENT} / 0.05)`, border: `1px solid hsl(${ACCENT} / 0.2)`, maxWidth: 1600 }}>
          <Workflow size={20} color={`hsl(${ACCENT})`} />
          <span style={{ fontSize: 17, color: TEXT }}>
            A <b>loop</b>, not an audit. Every decision feeds the standard. Every standard governs the next decision. AI-native means <b>governed</b>; ungoverned AI is just exposure at scale.
          </span>
        </div>
      </div>
      <Footer text="The rest of this deck is the loop, broken into its parts." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — INFRASTRUCTURE SHIFT (Data → Cognitive)
// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — PRODUCTION SYSTEM (Just-in-Time Knowledge Manufacturing)
// ═════════════════════════════════════════════════════════════════════════════
export function S04ProductionSystem() {
  const columns = [
    {
      kicker: "Pull, not push",
      title: "Just-in-time, not just-in-case",
      body: "Work pulls the exact standard, judgment and context at the moment of decision. No generic copilot spray. No WIP knowledge sitting in wikis.",
      vs: "Glean / Guru / Copilot push everything, hope something sticks.",
      icon: GitPullRequest,
      color: ACCENT,
    },
    {
      kicker: "Jidoka, not inspection",
      title: "Stop the line, not audit the wreck",
      body: "Defects stop execution the moment they appear. The standard is enforced before the decision ships, not reviewed weeks later in a report.",
      vs: "Credo / Fiddler / Arthur watch the model after it runs.",
      icon: ShieldCheck,
      color: GREEN,
    },
    {
      kicker: "Takt, not annual review",
      title: "Cadence matched to AI velocity",
      body: "Standards, judgment and context update at the rate the business moves, not the rate the policy committee meets. Every decision feeds the next.",
      vs: "Every legacy KM tool: annual refresh, static page.",
      icon: Gauge,
      color: GOLD,
    },
  ];

  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <PhaseChip phase="Phase 1 · Thesis" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="The Production System · How the Loop scales" />
        <h2 className="font-bold leading-[1.05]" style={{ fontSize: 64, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          AI is the machine.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>LIZA is the production system around it.</span>
        </h2>
        <p className="mt-4" style={{ fontSize: 22, color: MUTED, maxWidth: 1640 }}>
          Toyota did not win because they had better machines. They won because they built a production system around them. Enterprises about to industrialize cognitive work will fail for the same reason early adopters failed: <b style={{ color: TEXT }}>machines without a system.</b>
        </p>

        <div className="grid mt-10" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {columns.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.kicker}
                className="rounded-2xl p-7 flex flex-col"
                style={{
                  background: "white",
                  border: `1px solid hsl(${c.color} / 0.28)`,
                  boxShadow: `0 1px 0 hsl(${c.color} / 0.04), 0 12px 32px -20px hsl(${c.color} / 0.35)`,
                  minHeight: 380,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-lg flex items-center justify-center"
                    style={{ width: 44, height: 44, background: `hsl(${c.color} / 0.10)`, border: `1px solid hsl(${c.color} / 0.25)` }}
                  >
                    <Icon size={22} color={`hsl(${c.color})`} />
                  </div>
                  <span className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 13, color: `hsl(${c.color})` }}>
                    {c.kicker}
                  </span>
                </div>
                <h3 className="font-bold mt-4" style={{ fontSize: 26, color: TEXT, letterSpacing: "-0.015em", lineHeight: 1.15 }}>
                  {c.title}
                </h3>
                <p className="mt-3" style={{ fontSize: 17, color: TEXT, lineHeight: 1.45 }}>
                  {c.body}
                </p>
                <div
                  className="mt-auto pt-4 flex items-start gap-2"
                  style={{ borderTop: `1px dashed ${CHROME_BORDER}` }}
                >
                  <span className="font-mono uppercase tracking-[0.14em] font-bold flex-shrink-0" style={{ fontSize: 11, color: MUTED, paddingTop: 2 }}>
                    vs.
                  </span>
                  <span style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{c.vs}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-7 flex items-center gap-3 px-5 py-4 rounded-xl"
          style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.28)`, maxWidth: 1700 }}
        >
          <Coins size={20} color={`hsl(${GOLD})`} />
          <span style={{ fontSize: 17, color: TEXT }}>
            <b>By 2027, AI shifts from flat seats to metered tokens.</b> Without a production system, every token is unaccountable spend. With one, every token ties to a named standard and a named outcome.
          </span>
        </div>
      </div>
      <Footer text="The Governance Loop is the quality mechanism. The Production System is how it scales." />
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — INFRASTRUCTURE SHIFT (Data → Cognitive)
// ═════════════════════════════════════════════════════════════════════════════
function S03Shift() {
  const past = [
    { icon: Database, label: "Database", sub: "Rows, tables, schema" },
    { icon: Layers, label: "ORM / Logic", sub: "Hibernate, services" },
    { icon: Boxes, label: "Application", sub: "Deterministic UI" },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={3} total={TOTAL} />
      <PhaseChip phase="Phase 1 · Paradigm" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="The Infrastructure Shift" />
        <h2 className="font-bold leading-[1.05]" style={{ fontSize: 76, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1600 }}>
          Yesterday infrastructure stored data. <span style={{ color: `hsl(${ACCENT})` }}>Today it stores reasoning.</span>
        </h2>

        <div className="grid grid-cols-2 gap-10 mt-14">
          {/* Past */}
          <div className="rounded-2xl border p-10" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 14, color: SUBTLE }}>The past</p>
            <p className="font-bold mb-8" style={{ fontSize: 36, color: TEXT }}>Data Infrastructure</p>
            <div className="flex flex-col gap-4">
              {past.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center gap-5 p-5 rounded-xl bg-white border" style={{ borderColor: CHROME_BORDER }}>
                    <s.icon size={32} style={{ color: SUBTLE }} />
                    <div>
                      <p className="font-semibold" style={{ fontSize: 22, color: TEXT }}>{s.label}</p>
                      <p style={{ fontSize: 17, color: MUTED }}>{s.sub}</p>
                    </div>
                  </div>
                  {i < past.length - 1 && <div className="flex justify-center my-1"><ArrowDown size={20} style={{ color: SUBTLE }} /></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Present — topology, not a stack. LLM runs vertically through all layers. */}
          <div className="rounded-2xl border-2 p-8 relative" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.04)` }}>
            <p className="font-mono uppercase tracking-[0.18em] mb-1.5" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>The AI era</p>
            <p className="font-bold mb-5" style={{ fontSize: 32, color: TEXT }}>Cognitive Infrastructure</p>

            <div className="flex gap-4 items-stretch">
              {/* Three layers */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Top — Knowledge Plane */}
                <div className="p-4 rounded-xl bg-white border-2" style={{ borderColor: `hsl(${ACCENT} / 0.3)` }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Compass size={22} style={{ color: `hsl(${ACCENT})` }} />
                    <p className="font-semibold" style={{ fontSize: 20, color: TEXT }}>Knowledge Plane</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Database, label: "Governed data" },
                      { icon: ShieldCheck, label: "Intent · policy · judgment" },
                      { icon: Globe, label: "External & live research" },
                    ].map((c) => (
                      <div key={c.label} className="rounded-lg border px-2.5 py-2 flex flex-col gap-1.5"
                        style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                        <c.icon size={14} style={{ color: `hsl(${ACCENT})` }} />
                        <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{c.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center -my-1"><ArrowDown size={16} style={{ color: `hsl(${ACCENT})` }} /></div>
                {/* Middle — Semantic Layer */}
                <div className="p-4 rounded-xl bg-white border-2" style={{ borderColor: `hsl(${ACCENT} / 0.3)` }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Network size={22} style={{ color: `hsl(${ACCENT})` }} />
                    <p className="font-semibold" style={{ fontSize: 20, color: TEXT }}>Semantic Layer · LIZA OS</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Zap, label: "Executable knowledge" },
                      { icon: Lock, label: "State-locked Playbooks" },
                      { icon: FileText, label: "Artifact Store" },
                    ].map((c) => (
                      <div key={c.label} className="rounded-lg border px-2.5 py-2 flex flex-col gap-1.5"
                        style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                        <c.icon size={14} style={{ color: `hsl(${ACCENT})` }} />
                        <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{c.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center -my-1"><ArrowDown size={16} style={{ color: `hsl(${ACCENT})` }} /></div>
                {/* Bottom — Conversational Surface (collaborative) */}
                <div className="p-4 rounded-xl bg-white border-2" style={{ borderColor: `hsl(${ACCENT} / 0.3)` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare size={22} style={{ color: `hsl(${ACCENT})` }} />
                      <p className="font-semibold" style={{ fontSize: 20, color: TEXT }}>Collaborative Surface</p>
                    </div>
                    {/* avatar dots — signals collaboration */}
                    <div className="flex -space-x-1.5">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="rounded-full border-2 border-white"
                          style={{ width: 18, height: 18,
                            background: i === 3 ? `hsl(${ACCENT})` : `hsl(${ACCENT} / ${0.25 + i*0.15})` }} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.3 }}>
                    Chat · copilots · agent UI. Humans and agents collaborate in the same thread.
                  </p>
                </div>
              </div>

              {/* Vertical LLM spine — label on top, rail with nodes, no overlap */}
              <div className="relative flex flex-col items-center" style={{ width: 56 }}>
                {/* top cap pill */}
                <div className="px-2.5 py-1.5 rounded-md font-mono uppercase tracking-[0.16em] text-center leading-tight"
                  style={{
                    fontSize: 10,
                    color: `hsl(${ACCENT})`,
                    background: `hsl(${ACCENT} / 0.08)`,
                    border: `1px solid hsl(${ACCENT} / 0.3)`,
                    minWidth: 48,
                  }}>
                  LLM<br/>runtime
                </div>
                {/* rail */}
                <div className="relative flex-1 w-full mt-2">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 rounded-full"
                    style={{ width: 3, background: `linear-gradient(180deg, hsl(${ACCENT}) 0%, hsl(${GREEN}) 100%)`, opacity: 0.5 }} />
                  {/* 3 nodes evenly spaced to align with layer centers */}
                  <div className="absolute inset-0 flex flex-col justify-around items-center">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="rounded-full border-2 bg-white relative z-10"
                        style={{ width: 16, height: 16, borderColor: `hsl(${ACCENT})` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer text="You cannot separate business strategy from backend architecture anymore." />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — THE CONTEXT GAP (Iceberg)
// ═════════════════════════════════════════════════════════════════════════════
export function S03Iceberg() {
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={4} total={TOTAL} />
      <PhaseChip phase="Phase 1 · Paradigm" color={ACCENT} />
      <div className="relative z-10 grid grid-cols-[1fr_900px] gap-16 items-center">
        <div>
          <Tag label="The Context Gap" />
          <h2 className="font-bold leading-[1.05]" style={{ fontSize: 72, color: TEXT, letterSpacing: "-0.025em" }}>
            Data infrastructure is the 10%. <br />
            <span style={{ color: `hsl(${ACCENT})` }}>Cognitive infrastructure is the 90%.</span>
          </h2>
          <p className="mt-10" style={{ fontSize: 26, color: MUTED, lineHeight: 1.4, maxWidth: 720 }}>
            Above the waterline sits the data infrastructure RAG and search tools index:
            policies, records, documents. Below sits the operating reasoning that actually
            runs the company. LIZA OS turns that 90% into executable cognitive infrastructure.
          </p>
        </div>

        {/* Iceberg */}
        <div className="relative h-[720px] w-full">
          {/* waterline */}
          <div className="absolute left-0 right-0 top-[26%] h-px" style={{ background: `hsl(${ACCENT} / 0.4)` }} />
          <div className="absolute right-0 top-[26%] -translate-y-1/2 px-3 py-1 rounded-full font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: 12, background: `hsl(${ACCENT} / 0.1)`, color: `hsl(${ACCENT})` }}>waterline</div>

          {/* Above water */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[420px] h-[180px] rounded-t-2xl border-2 p-6 flex flex-col items-center justify-center text-center"
            style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: "white" }}>
            <p className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 13, color: SUBTLE }}>Above water · 10%</p>
            <p className="font-bold mt-2" style={{ fontSize: 28, color: TEXT }}>Data Infrastructure</p>
            <p style={{ fontSize: 16, color: MUTED, marginTop: 6 }}>Documents · records · policies — what RAG retrieves</p>
          </div>

          {/* Below water */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[26%] w-[760px] bottom-0 rounded-b-[40px] border-2 p-10 flex flex-col items-center justify-center text-center"
            style={{
              borderColor: `hsl(${ACCENT} / 0.4)`,
              background: `linear-gradient(180deg, hsl(${ACCENT} / 0.08), hsl(${ACCENT} / 0.18))`,
              clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
            }}>
            <p className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>Below water · 90%</p>
            <p className="font-bold mt-3" style={{ fontSize: 36, color: TEXT, lineHeight: 1.15 }}>Cognitive Infrastructure</p>
            <p style={{ fontSize: 18, color: MUTED, marginTop: 4 }}>Operating reasoning · operational intelligence</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-[520px]">
              {["Client Memory", "Exceptions", "Regulatory Practice", "Tacit Judgment", "Routing Rules", "Escalation Logic"].map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-white/80 border"
                  style={{ fontSize: 15, color: TEXT, borderColor: `hsl(${ACCENT} / 0.3)` }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 17, color: MUTED, marginTop: 18 }}>What actually runs the company</p>
          </div>
        </div>
      </div>
      <Footer text="The cognitive infrastructure LIZA OS encodes as Playbooks, Procedures, Directives, Knowledge and Preferences." />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — THE OS MAP (System Architecture)
// ═════════════════════════════════════════════════════════════════════════════
function S04OSMap() {
  const surfaceItems = [
    { icon: Workflow, l: "Workbooks", s: "Guided rooms where teams execute" },
    { icon: Users, l: "Collaboration", s: "Humans + agents in the same thread" },
    { icon: Sparkles, l: "Knowledge Capture", s: "Tacit expertise becomes structured" },
    { icon: Eye, l: "Oversight", s: "Drift, telemetry, live governance" },
  ];
  const sourceItems = [
    { l: "CRM · ERP" }, { l: "Veeva · LIMS" }, { l: "Drive · SharePoint" },
    { l: "Docs · Wikis" }, { l: "Email · Tickets" }, { l: "Senior interviews" },
  ];
  const toolItems = [
    { l: "Microsoft Copilot" }, { l: "ChatGPT Enterprise" },
    { l: "Glean" }, { l: "Veeva · NesGPT" }, { l: "Custom agents" },
  ];
  const core = [
    { l: "Sense & Classify", s: "Routes inbound to the right standard + decision class" },
    { l: "Standard Resolver", s: "Locks the playbook, procedure, directive bundle at execution" },
    { l: "Knowledge Graph", s: "Entities, relations, provenance across artifacts" },
    { l: "Conflict & Drift Detector", s: "Flags contradictions vs locked standard, semantic debt" },
    { l: "Rationale Synthesizer", s: "Builds the audit-grade why behind every output" },
    { l: "Versioning & Audit", s: "Bundle · version · mandate per execution, full diff history" },
    { l: "Access & Role Gate", s: "Author · execute · override, scoped by tenant & role" },
    { l: "Mandate Engine", s: "Carries leadership intent into every job downstream" },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={5} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />
      <div className="relative z-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <Tag label="The LIZA OS System Architecture" color={GREEN} />
            <h2 className="font-bold leading-[1.05] mt-3" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em" }}>
              Decision Core at the centre. <span style={{ color: `hsl(${GREEN})` }}>Our surfaces, your stack, any model.</span>
            </h2>
          </div>
          <div className="rounded-lg border px-3 py-2 text-right" style={{ borderColor: `hsl(${GREEN} / 0.35)`, background: `hsl(${GREEN} / 0.06)` }}>
            <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Full interactive version</p>
            <p className="font-semibold" style={{ fontSize: 16, color: TEXT }}>lizaos.ai / os</p>
          </div>
        </div>

        {/* OS Map */}
        <div className="relative rounded-3xl border-2 p-6" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 700 }}>
          {/* Top — Leadership / Control Tower */}
          <div className="rounded-xl border-2 p-3 flex items-center justify-between"
            style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.08)` }}>
            <div className="flex items-center gap-2.5">
              <Sparkles size={20} style={{ color: `hsl(${GOLD})` }} />
              <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>Leadership · Control Tower</p>
            </div>
            <p style={{ fontSize: 14, color: MUTED }}>Strategy, mandates, sensing jobs ↓ &nbsp;·&nbsp; Execution telemetry ↑</p>
          </div>

          {/* Middle: 3-column surfaces row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* Source systems */}
            <div className="rounded-xl border-2 p-4" style={{ borderColor: CHROME_BORDER, background: "white" }}>
              <div className="flex items-center gap-2 mb-2">
                <Database size={18} style={{ color: SUBTLE }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>Systems of Record</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {sourceItems.map(s => (
                  <div key={s.l} className="px-2 py-1.5 rounded-md border" style={{ fontSize: 12, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}>{s.l}</div>
                ))}
              </div>
            </div>

            {/* Native surfaces — OUR UIs (highlighted) */}
            <div className="rounded-xl border-2 p-4" style={{ borderColor: `hsl(${ACCENT} / 0.5)`, background: `hsl(${ACCENT} / 0.06)` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Boxes size={18} style={{ color: `hsl(${ACCENT})` }} />
                  <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA Native Surfaces</p>
                </div>
                <span className="px-1.5 py-0.5 rounded font-mono uppercase tracking-[0.12em]"
                  style={{ fontSize: 9, background: `hsl(${ACCENT} / 0.15)`, color: `hsl(${ACCENT})` }}>ours</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {surfaceItems.map(s => (
                  <div key={s.l} className="px-2 py-1.5 rounded-md border bg-white" style={{ borderColor: `hsl(${ACCENT} / 0.25)` }}>
                    <div className="flex items-center gap-1.5"><s.icon size={11} style={{ color: `hsl(${ACCENT})` }} /><p className="font-semibold" style={{ fontSize: 12, color: TEXT }}>{s.l}</p></div>
                    <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.2, marginTop: 1 }}>{s.s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected AI tools */}
            <div className="rounded-xl border-2 p-4" style={{ borderColor: CHROME_BORDER, background: "white" }}>
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={18} style={{ color: SUBTLE }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>Connected AI Tools</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {toolItems.map(s => (
                  <div key={s.l} className="px-2 py-1.5 rounded-md border" style={{ fontSize: 12, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}>{s.l}</div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: MUTED, marginTop: 6, fontStyle: "italic" }}>
              Addition layer, not replacement. We make Copilot, Gemini, Glean read the same locked standard.
              </p>
            </div>
          </div>

          {/* Vertical connectors hint */}
          <div className="flex justify-around mt-2" style={{ color: SUBTLE }}>
            <ArrowDown size={16} /><ArrowDown size={16} style={{ color: `hsl(${ACCENT})` }} /><ArrowDown size={16} />
          </div>

          {/* Decision Core — centerpiece */}
          <div className="mt-2 rounded-xl border-2 p-4" style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: `hsl(${GREEN} / 0.06)` }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <Brain size={22} style={{ color: `hsl(${GREEN})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA Decision Core</p>
                <span className="px-2 py-0.5 rounded font-mono uppercase tracking-[0.15em]"
                  style={{ fontSize: 10, background: `hsl(${GREEN} / 0.15)`, color: `hsl(${GREEN})` }}>AACE v3.1 runtime</span>
              </div>
              <p style={{ fontSize: 13, color: MUTED }}>State-locked · audit-traceable · model-agnostic</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {core.map(c => (
                <div key={c.l} className="px-2.5 py-2 rounded-lg border bg-white" style={{ borderColor: `hsl(${GREEN} / 0.3)` }}>
                  <p className="font-semibold" style={{ fontSize: 13, color: TEXT }}>{c.l}</p>
                  <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.25, marginTop: 1 }}>{c.s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — LLM Fabric */}
          <div className="mt-3 rounded-xl border-2 p-3 flex items-center justify-between"
            style={{ borderColor: `hsl(${PURPLE} / 0.4)`, background: `hsl(${PURPLE} / 0.06)` }}>
            <div className="flex items-center gap-2.5">
              <Cpu size={20} style={{ color: `hsl(${PURPLE})` }} />
              <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>Model Fabric</p>
              <span className="px-2 py-0.5 rounded font-mono uppercase tracking-[0.15em]"
                style={{ fontSize: 10, background: `hsl(${PURPLE} / 0.15)`, color: `hsl(${PURPLE})` }}>on-prem deployable</span>
            </div>
            <p style={{ fontSize: 13, color: MUTED }}>OpenAI · Anthropic · Google · Mistral · open-source · on-prem</p>
          </div>
        </div>
      </div>
      <Footer text="Full interactive version at lizaos.ai/os. Decision Core decoupled from any single model; native surfaces sit next to your existing AI tools." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — AACE 4-STEP LOOP
// ═════════════════════════════════════════════════════════════════════════════
function S05Loop() {
  const steps = [
    { icon: Radio, label: "Sense", sub: "Intent classifier reads the request, signals, and Playbook Registry triggers." },
    { icon: Lock, label: "Decide", sub: "State-Lock. A Playbook is selected; the generalist LLM exits the loop; routing locks the locked_playbook_id.", highlight: true },
    { icon: Zap, label: "Execute", sub: "A restricted micro-agent runs with only the approved Directives, Knowledge, Procedures injected as XML.", highlight: true },
    { icon: GitBranch, label: "Propagate", sub: "Outputs become versioned Artifacts; downstream nodes are flagged; the Rationale Log is written." },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={6} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />
      <div className="relative z-10">
        <Tag label="AACE v3.1 · The 4-Step Orchestration Loop" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-12" style={{ fontSize: 60, color: TEXT, letterSpacing: "-0.025em" }}>
          State-Locking is how we eliminate hallucinations in enterprise deployments.
        </h2>

        <div className="grid grid-cols-4 gap-5 relative">
          {steps.map((s, i) => (
            <div key={s.label} className="relative">
              <div className="rounded-2xl border-2 p-7 h-[460px] flex flex-col"
                style={{
                  borderColor: s.highlight ? `hsl(${GREEN} / 0.5)` : CHROME_BORDER,
                  background: s.highlight ? `hsl(${GREEN} / 0.05)` : "white",
                }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: s.highlight ? `hsl(${GREEN} / 0.15)` : CARD_ALT }}>
                    <s.icon size={28} style={{ color: s.highlight ? `hsl(${GREEN})` : SUBTLE }} />
                  </div>
                  <span className="font-mono font-bold" style={{ fontSize: 32, color: s.highlight ? `hsl(${GREEN})` : SUBTLE }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="font-bold mb-3" style={{ fontSize: 32, color: TEXT }}>{s.label}</p>
                <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>{s.sub}</p>
                {s.highlight && (
                  <p className="mt-auto font-mono uppercase tracking-[0.15em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
                    ★ DD focus
                  </p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                  style={{ right: -20, width: 20, height: 20 }}>
                  <ArrowRight size={20} style={{ color: SUBTLE }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer text="Locked State persists until STOP / RESET. Full content fidelity. Just-in-time XML injection." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — ARTIFACT PROPAGATION & OBSERVABILITY
// ═════════════════════════════════════════════════════════════════════════════
function PropagationTree() {
  // All positions in % of container — SVG uses the same coordinate system so lines always line up.
  const ROOT = { cx: 50, cy: 10 };
  const REQS = [
    { cx: 27, cy: 30, label: "Requirement A" },
    { cx: 73, cy: 30, label: "Requirement B" },
  ];
  const SPECS = [
    { cx: 13, cy: 54, label: "Spec A1", parent: 0 },
    { cx: 38, cy: 54, label: "Spec A2", parent: 0 },
    { cx: 62, cy: 54, label: "Spec B1", parent: 1 },
    { cx: 87, cy: 54, label: "Spec B2", parent: 1 },
  ];
  const REPORTS = [
    { cx: 11, cy: 86, label: "Report-1", parent: 0 },
    { cx: 37, cy: 86, label: "Report-2", parent: 1 },
    { cx: 63, cy: 86, label: "Report-3", parent: 2 },
    { cx: 89, cy: 86, label: "Report-4", parent: 3 },
  ];
  // Vertical half-heights of each tier (in % of container) — lines start/end at node edges, not centres.
  const H_ROOT = 7, H_REQ = 5, H_SPEC = 4;

  return (
    <div className="rounded-2xl border relative overflow-hidden" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 580 }}>
      {/* Lines first, behind nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke={`hsl(${RED} / 0.4)`} strokeWidth="0.2" fill="none">
          {REQS.map((r, i) => (
            <line key={`r-${i}`} x1={ROOT.cx} y1={ROOT.cy + H_ROOT} x2={r.cx} y2={r.cy - H_REQ} />
          ))}
          {SPECS.map((s, i) => {
            const p = REQS[s.parent];
            return <line key={`s-${i}`} x1={p.cx} y1={p.cy + H_REQ} x2={s.cx} y2={s.cy - H_SPEC} />;
          })}
          {REPORTS.map((rep, i) => {
            const p = SPECS[rep.parent];
            return <line key={`rep-${i}`} x1={p.cx} y1={p.cy + H_SPEC} x2={rep.cx} y2={rep.cy - H_SPEC} />;
          })}
        </g>
      </svg>

      {/* Root */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-xl border-2 flex items-center gap-3 whitespace-nowrap"
        style={{ left: `${ROOT.cx}%`, top: `${ROOT.cy}%`, borderColor: `hsl(${RED} / 0.5)`, background: `hsl(${RED} / 0.1)`, zIndex: 2 }}>
        <ShieldCheck size={22} style={{ color: `hsl(${RED})` }} />
        <div className="text-left">
          <p className="font-bold leading-tight" style={{ fontSize: 17, color: TEXT }}>Standard · GxP Deviation</p>
          <p style={{ fontSize: 12, color: `hsl(${RED})` }}>Rule v2.1 published</p>
        </div>
      </div>

      {REQS.map(r => (
        <div key={r.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl border-2 flex items-center gap-2 whitespace-nowrap"
          style={{ left: `${r.cx}%`, top: `${r.cy}%`, borderColor: `hsl(${RED} / 0.45)`, background: `hsl(${RED} / 0.06)`, zIndex: 2 }}>
          <AlertCircle size={16} style={{ color: `hsl(${RED})` }} />
          <p className="font-semibold" style={{ fontSize: 15, color: TEXT }}>{r.label}</p>
        </div>
      ))}

      {SPECS.map(s => (
        <div key={s.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap"
          style={{ left: `${s.cx}%`, top: `${s.cy}%`, borderColor: `hsl(${RED} / 0.35)`, background: `hsl(${RED} / 0.05)`, zIndex: 2 }}>
          <AlertCircle size={12} style={{ color: `hsl(${RED})` }} />
          <p className="font-medium" style={{ fontSize: 13, color: TEXT }}>{s.label}</p>
        </div>
      ))}

      {REPORTS.map(rep => (
        <div key={rep.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap"
          style={{ left: `${rep.cx}%`, top: `${rep.cy}%`, borderColor: `hsl(${RED} / 0.3)`, background: "white", zIndex: 2 }}>
          <FileText size={12} style={{ color: `hsl(${RED})` }} />
          <p style={{ fontSize: 13, color: TEXT }}>{rep.label}</p>
        </div>
      ))}
    </div>
  );
}

function S06Propagation() {
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={7} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Artifact Graph · State Management · Observability" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-10" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          One rule change. <span style={{ color: `hsl(${RED})` }}>Every downstream artifact instantly flagged.</span>
        </h2>

        <div className="grid grid-cols-[1.3fr_1fr] gap-12 items-start">
          {/* Tree */}
          <PropagationTree />

          {/* Rationale Log */}
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.04)`, height: 580 }}>
            <div className="flex items-center gap-3 mb-5">
              <Activity size={26} style={{ color: `hsl(${ACCENT})` }} />
              <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>Unified Rationale Log</p>
            </div>
            <p style={{ fontSize: 17, color: MUTED, marginBottom: 20 }}>
              Every node change is logged. Full auditability across the stack.
            </p>
            <div className="space-y-3 font-mono" style={{ fontSize: 14 }}>
              {[
                { k: "input", v: "deviation_001.draft.md" },
                { k: "rule_applied", v: "GxP-Deviation v2.1" },
                { k: "playbook_id", v: "pb_deviation_intake" },
                { k: "model", v: "claude-3.7-sonnet" },
                { k: "tokens", v: "4,812 in · 1,209 out" },
                { k: "output", v: "deviation_001.v2.md" },
                { k: "downstream", v: "4 artifacts flagged" },
                { k: "actor", v: "user:142 @ 14:22:03" },
              ].map(r => (
                <div key={r.k} className="flex gap-3 px-3 py-2 rounded bg-white border" style={{ borderColor: CHROME_BORDER }}>
                  <span style={{ color: `hsl(${ACCENT})`, minWidth: 140 }}>{r.k}</span>
                  <span style={{ color: TEXT }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — THE PRICING INVERSION → VALUE-BASED METERING (merged)
// ═════════════════════════════════════════════════════════════════════════════
export function S08PricingMetering() {
  const vendors = [
    { l: "OpenAI", s: "Tokens + minutes + tools" },
    { l: "Anthropic", s: "Tokens + tool calls" },
    { l: "Google", s: "Tokens + media units" },
    { l: "Microsoft", s: "Copilot → metered AI units" },
  ];
  const tiers = [
    { mult: "25×", label: "Strategic Simulation", color: PURPLE, w: "60%",
      human: "Partner hour", example: "War-game a market pivot. Scenario-stress a thesis." },
    { mult: "5×", label: "Process Design & Governance", color: ACCENT, w: "80%",
      human: "Senior hour", example: "Update a Playbook. Run drift detection. Change a Standard." },
    { mult: "1×", label: "Operational Execution", color: GREEN, w: "100%",
      human: "Junior hour", example: "Draft a memo. Summarise a meeting. Fill a template." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={9} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" color={GOLD} />
      <div className="relative z-10">
        <Tag label="The Pricing Inversion · Value-Based Metering" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-8" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          Every AI vendor is converging on usage-based pricing. <span style={{ color: `hsl(${GOLD})` }}>The question is what you meter.</span>
        </h2>

        <div className="grid grid-cols-[1fr_1.35fr] gap-10 items-start">
          {/* LEFT — Pricing Inversion */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border p-7" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-mono uppercase tracking-[0.15em] mb-3" style={{ fontSize: 12, color: SUBTLE }}>Industry trajectory</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-2 rounded-lg border" style={{ fontSize: 15, color: TEXT, borderColor: CHROME_BORDER, background: "white" }}>Per-seat SaaS</span>
                <ArrowRight size={18} style={{ color: SUBTLE }} />
                <span className="px-3 py-2 rounded-lg border" style={{ fontSize: 15, color: TEXT, borderColor: CHROME_BORDER, background: "white" }}>Hybrid</span>
                <ArrowRight size={18} style={{ color: `hsl(${GOLD})` }} />
                <span className="px-3 py-2 rounded-lg border-2 font-semibold"
                  style={{ fontSize: 15, color: `hsl(${GOLD})`, borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.08)` }}>Usage-based API</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {vendors.map(v => (
                  <div key={v.l} className="px-3 py-2 rounded-lg border bg-white" style={{ borderColor: CHROME_BORDER }}>
                    <p className="font-semibold" style={{ fontSize: 14, color: TEXT }}>{v.l}</p>
                    <p style={{ fontSize: 12, color: MUTED }}>{v.s}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${RED} / 0.4)`, background: `hsl(${RED} / 0.05)` }}>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={22} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>The failure mode: unanchored consumption</p>
              </div>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>
                Per-token billing aligns cost with consumption. Good. But raw tokens are not a business unit. A CFO cannot defend a line item that does not name the decision it bought.
              </p>
            </div>

            <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.06)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: TEXT }}>The labour-market analogy</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>
                A company already prices a junior hour differently from a senior hour differently from a partner hour. Not because of electricity. Because of the weight of the decision being made. LIZA reproduces the same structure for machine work.
              </p>
            </div>
          </div>

          {/* RIGHT — Pyramid with example inline (no duplication) */}
          <div>
            <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>Value-based semantic metering</p>
            <div className="flex flex-col items-center gap-3 mb-5">
              {tiers.map(t => (
                <div key={t.label} className="rounded-2xl border-2 px-6 py-4"
                  style={{
                    width: t.w,
                    borderColor: `hsl(${t.color} / 0.5)`,
                    background: `linear-gradient(90deg, hsl(${t.color} / 0.08), hsl(${t.color} / 0.18))`,
                  }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-bold font-mono" style={{ fontSize: 34, color: `hsl(${t.color})`, lineHeight: 1 }}>{t.mult}</span>
                      <span className="font-bold" style={{ fontSize: 19, color: TEXT }}>{t.label}</span>
                    </div>
                    <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 12, color: MUTED }}>≈ {t.human}</span>
                  </div>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.35 }}>{t.example}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border-2 p-5" style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.08)` }}>
              <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
                <span className="font-bold">State is locked to a Playbook.</span> So we know the decision class of every execution. We charge for the weight of the decision, not the weight of the tokens. Revenue tracks strategic ROI, not API price.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={PURPLE} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 07b — WHAT MAKES US UNIQUE · THE MOMENT OF WORK
// ═════════════════════════════════════════════════════════════════════════════
export function S07bUnique() {
  // Four semantic streams that must converge at the moment of work.
  // Position in % of the diagram canvas.
  const STREAMS = {
    strategy: { color: PURPLE, label: "Strategy", sub: "Mandates. OKRs. Policy. Risk.", icon: Compass, x: 50, y: 6 },
    market:   { color: GOLD,   label: "Market",   sub: "External signals. Regulation. Best practice.", icon: Globe,   x: 5,  y: 50 },
    state:    { color: ACCENT, label: "State",    sub: "Artifacts. Dependencies. Prior decisions.",    icon: Package, x: 95, y: 50 },
    signal:   { color: GREEN,  label: "Signal",   sub: "KPIs. Drift. Anomalies. Incidents.",           icon: Gauge,   x: 50, y: 94 },
  } as const;
  type StreamKey = keyof typeof STREAMS;

  // Competitors clustered around the perimeter, each tagged with the streams they actually touch.
  // Honest mapping. Most touch one. A few touch two. None touch all four.
  const COMPETITORS: { id: string; l: string; s: string; covers: StreamKey[]; x: number; y: number }[] = [
    // Strategy zone (top)
    { id: "okr",    l: "Cascade · Quantive",            s: "OKR & strategy tooling",     covers: ["strategy"],         x: 28, y: 16 },
    { id: "decks",  l: "Strategy decks · static plans", s: "Slide-ware, no runtime hook", covers: ["strategy"],        x: 72, y: 16 },
    // Market zone (left)
    { id: "mi",     l: "Crayon · Klue · AlphaSense",    s: "Market intelligence feeds",   covers: ["market"],           x: 14, y: 30 },
    { id: "rag",    l: "Perplexity · web RAG",           s: "External retrieval, no governance", covers: ["market"],   x: 14, y: 70 },
    // State zone (right)
    { id: "chat",   l: "Copilot · ChatGPT · Gemini",    s: "Foundation chat. Black-box graph.", covers: ["state","market"], x: 86, y: 22 },
    { id: "search", l: "Glean · Guru",                   s: "Enterprise search & retrieval", covers: ["state"],         x: 86, y: 42 },
    { id: "kg",     l: "Cognee · Mem0",                  s: "Autonomous KGs. Drift risk.",   covers: ["state"],         x: 86, y: 58 },
    { id: "agent",  l: "Cognition · Devin · agents",    s: "Agent builders. No org model.", covers: ["state"],         x: 86, y: 78 },
    // Signal zone (bottom)
    { id: "bi",     l: "Tableau · Power BI · Looker",   s: "Dashboards. Read-only.",         covers: ["signal"],         x: 28, y: 84 },
    { id: "erp",    l: "Workday · Salesforce · Palantir", s: "Rigid ontology. Signal + records.", covers: ["signal","state"], x: 72, y: 84 },
  ];

  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredStream, setHoveredStream] = useState<StreamKey | null>(null);

  const isDimmed = (compId: string, covers: StreamKey[]) => {
    if (hovered) return hovered !== compId;
    if (hoveredStream) return !covers.includes(hoveredStream);
    return false;
  };

  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={8} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />
      <div className="relative z-10">
        <Tag label="What makes us unique · The moment of work" color={GREEN} />
        <h2 className="font-bold leading-[1.02] mb-5" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.028em", maxWidth: 1760 }}>
          What is the value of an <span style={{ color: `hsl(${GREEN})` }}>operator</span> in the age of AI?
        </h2>

        {/* Two-answer kicker bar */}
        <div className="flex gap-4 mb-5">
          <div className="rounded-xl border-2 px-5 py-3 flex-1" style={{ borderColor: `hsl(${ACCENT} / 0.45)`, background: `hsl(${ACCENT} / 0.05)` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>ANSWER 01</span>
              <span style={{ fontSize: 14, color: SUBTLE }}>Why keep humans in the loop at all</span>
            </div>
            <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.35 }}>
              The world changes faster than any model. Someone must <b>synthesise four streams of change into one governed decision</b>, semantically, in real time. AI cannot fully automate what the world has not yet declared.
            </p>
          </div>
          <div className="rounded-xl border-2 px-5 py-3 flex-1" style={{ borderColor: `hsl(${GOLD} / 0.45)`, background: `hsl(${GOLD} / 0.05)` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>ANSWER 02</span>
              <span style={{ fontSize: 14, color: SUBTLE }}>Why the leader is also an operator</span>
            </div>
            <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.35 }}>
              Strategy is execution at the edge. Every leader becomes an operator the instant a market shifts. We unify both into one adaptive loop, so the best possible decision is made at <b>every</b> moment of work.
            </p>
          </div>
        </div>

        {/* RADIAL CANVAS */}
        <div
          className="relative rounded-2xl border"
          style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 660 }}
          onMouseLeave={() => { setHovered(null); setHoveredStream(null); }}
        >
          {/* Connection layer: lines from each competitor to its covered streams + LIZA lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* LIZA → all four streams (always bold, signature move) */}
            {(Object.keys(STREAMS) as StreamKey[]).map((k) => {
              const s = STREAMS[k];
              const active = !hovered && !hoveredStream;
              const highlight = hoveredStream === k;
              return (
                <line
                  key={`liza-${k}`}
                  x1={50} y1={50} x2={s.x} y2={s.y}
                  stroke={`hsl(${s.color})`}
                  strokeWidth={highlight ? 0.9 : active ? 0.7 : 0.4}
                  strokeOpacity={hovered ? 0.25 : 1}
                />
              );
            })}
            {/* Competitor → stream lines */}
            {COMPETITORS.flatMap((c) =>
              c.covers.map((k) => {
                const s = STREAMS[k];
                const dim = isDimmed(c.id, c.covers);
                const highlight = hovered === c.id || hoveredStream === k;
                return (
                  <line
                    key={`${c.id}-${k}`}
                    x1={c.x} y1={c.y} x2={s.x} y2={s.y}
                    stroke={highlight ? `hsl(${s.color})` : `hsl(${RED} / 0.35)`}
                    strokeWidth={highlight ? 0.7 : 0.25}
                    strokeOpacity={dim ? 0.08 : 1}
                    strokeDasharray={highlight ? "0" : "0.6 0.4"}
                  />
                );
              })
            )}
          </svg>

          {/* STREAM CARDS at the four poles */}
          {(Object.keys(STREAMS) as StreamKey[]).map((k) => {
            const s = STREAMS[k];
            const Icon = s.icon;
            const active = hoveredStream === k;
            return (
              <div
                key={k}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-4 py-3 cursor-default transition-all"
                style={{
                  left: `${s.x}%`, top: `${s.y}%`,
                  width: 240,
                  borderColor: `hsl(${s.color} / ${active ? 0.9 : 0.55})`,
                  background: active ? `hsl(${s.color} / 0.12)` : "white",
                  boxShadow: active ? `0 8px 24px hsl(${s.color} / 0.25)` : "0 1px 3px rgba(0,0,0,0.06)",
                  zIndex: 3,
                }}
                onMouseEnter={() => setHoveredStream(k)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={18} style={{ color: `hsl(${s.color})` }} />
                  <p className="font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1 }}>{s.label}</p>
                </div>
                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>{s.sub}</p>
              </div>
            );
          })}

          {/* LIZA CENTER NODE */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 px-6 py-4 text-center"
            style={{
              left: "50%", top: "50%",
              width: 560,
              borderColor: `hsl(${GREEN} / 0.7)`,
              background: "white",
              boxShadow: `0 12px 36px hsl(${GREEN} / 0.18), 0 0 0 6px hsl(${GREEN} / 0.06)`,
              zIndex: 4,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <UserCheck size={20} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1 }}>LIZA · The moment of work</p>
            </div>
            <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.35 }}>
              Operator and agent deciding together under a locked Playbook. Every convergence runs through five live audits before an output is released.
            </p>
            <div className="mt-2.5 mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded border"
              style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: `hsl(${GREEN} / 0.08)` }}>
              <ShieldCheck size={12} style={{ color: `hsl(${GREEN})` }} />
              <span className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>
                Audit & Compliance Container
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-left">
              {[
                { k: "Token & Cost Audit", v: "Prompt envelope, model routing, COGS per call" },
                { k: "Best Practice Audit", v: "Output conforms to the locked Playbook & standard" },
                { k: "Data Security & Governance", v: "PII, residency, role scope, retention" },
                { k: "Decision Audit", v: "Rationale chain, evidence, decision class" },
                { k: "Drift & Standards Audit", v: "Standard freshness, deviation from prior decisions" },
              ].map(a => (
                <div key={a.k} className="flex items-start gap-1.5 rounded px-2 py-1 border"
                  style={{ borderColor: `hsl(${GREEN} / 0.18)`, background: `hsl(${GREEN} / 0.04)` }}>
                  <span className="rounded-full mt-1.5" style={{ width: 5, height: 5, background: `hsl(${GREEN})`, flexShrink: 0 }} />
                  <div className="leading-tight">
                    <span className="font-semibold" style={{ fontSize: 11.5, color: TEXT }}>{a.k}.</span>{" "}
                    <span style={{ fontSize: 11, color: MUTED }}>{a.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPETITOR PILLS */}
          {COMPETITORS.map((c) => {
            const dim = isDimmed(c.id, c.covers);
            const highlight = hovered === c.id;
            return (
              <div
                key={c.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-3 py-2 cursor-default transition-all"
                style={{
                  left: `${c.x}%`, top: `${c.y}%`,
                  width: 220,
                  borderColor: highlight ? `hsl(${RED} / 0.6)` : CHROME_BORDER,
                  opacity: dim ? 0.3 : 1,
                  boxShadow: highlight ? "0 6px 18px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.04)",
                  zIndex: 3,
                }}
                onMouseEnter={() => setHovered(c.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className="font-semibold" style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.15 }}>{c.l}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {(Object.keys(STREAMS) as StreamKey[]).map((k) => (
                      <span key={k} className="rounded-full"
                        style={{
                          width: 6, height: 6,
                          background: c.covers.includes(k) ? `hsl(${STREAMS[k].color})` : `hsl(0 0% 86%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.25 }}>{c.s}</p>
              </div>
            );
          })}

          {/* Legend in corner */}
          <div className="absolute bottom-3 left-3 rounded-lg border bg-white/90 backdrop-blur px-3 py-2 flex items-center gap-3"
            style={{ borderColor: CHROME_BORDER }}>
            <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10, color: SUBTLE }}>Coverage</span>
            {(Object.keys(STREAMS) as StreamKey[]).map((k) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="rounded-full" style={{ width: 8, height: 8, background: `hsl(${STREAMS[k].color})` }} />
                <span style={{ fontSize: 11, color: TEXT }}>{STREAMS[k].label}</span>
              </div>
            ))}
            <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10, color: SUBTLE, marginLeft: 8 }}>Hover any node</span>
          </div>

          {/* Conclusion in opposite corner */}
          <div className="absolute bottom-3 right-3 rounded-lg border-2 px-3 py-2 max-w-md"
            style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: `hsl(${GREEN} / 0.08)` }}>
            <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.35 }}>
              <b style={{ color: `hsl(${GREEN})` }}>LIZA is the only node connected to all four streams</b> inside one audit container. Every competitor covers a slice. We collect the slices, semantically, and govern the convergence.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 07c — NESTED FUNNELS · SIDE VIEW + LIVE PROMPT SCREEN
// ═════════════════════════════════════════════════════════════════════════════
export function S07cFunnel() {
  // Each layer is a nested funnel piece. Top of stack is widest "intake",
  // bottom of stack tapers to the operator's prompt: the moment of work.
  type LayerId = "intent" | "governance" | "standards" | "team" | "preference";
  const LAYERS: {
    id: LayerId; label: string; sub: string; chip: string;
    color: string; icon: typeof Compass; line: string; scaffold: string;
  }[] = [
    { id: "intent",     label: "Strategic Intent",     sub: "CEO mandates · OKRs · thesis",          chip: "C-suite",     color: PURPLE, icon: Compass,       line: "Operate within Q4 expansion thesis · prefer EU-first launches",
      scaffold: "Where the CEO's thesis enters. Sets which bets count and which do not." },
    { id: "governance", label: "Governance & Risk",    sub: "Legal · compliance · data residency",   chip: "Legal/Risk",  color: ACCENT, icon: ShieldCheck,   line: "No PII to vendor models · GDPR · cite source for every external claim",
      scaffold: "Where legal, risk and data rules become non-negotiable. Hard limits live here." },
    { id: "standards",  label: "Domain Standards",     sub: "Playbooks · SOPs · best practice",      chip: "Function lead", color: GOLD, icon: FileSignature, line: "Use the Investor Memo v3.1 structure · house tone · approved benchmarks",
      scaffold: "Where the function lead's playbooks land. House structure, tone and approved benchmarks." },
    { id: "team",       label: "Team Context",         sub: "Prior decisions · artifacts · roles",   chip: "Team",        color: GREEN,  icon: Users,         line: "Reuse the Series-A deck framing · do not contradict last week's board update",
      scaffold: "Where prior decisions, artefacts and roles flow in. Keeps the output consistent with the team." },
    { id: "preference", label: "Personal Preference",  sub: "Operator style · learned signals",      chip: "Operator",    color: GREEN,  icon: UserCheck,     line: "Bullet-first · drop hedging · German English · concise",
      scaffold: "Where the operator's own learned style closes the funnel. The final voice." },
  ];

  const [active, setActive] = useState<Record<LayerId, boolean>>({
    intent: true, governance: true, standards: true, team: true, preference: true,
  });
  const [hovered, setHovered] = useState<LayerId | null>(null);
  const [mode, setMode] = useState<"topdown" | "bottomup">("topdown");

  // ── Progressive reveal: layers fade in one by one on the same canvas. ──
  // 0 = only the prompt exists.
  // 1 = scaffold: split layout appears with empty layer slots + plain-English
  //     notes on what each layer will hold, but no real content yet.
  // 2..6 = layers 1..5 populate one by one.
  const TOTAL_STEPS = LAYERS.length + 1; // 6
  const [revealed, setRevealed] = useState(TOTAL_STEPS);
  const idxOf = (id: LayerId) => LAYERS.findIndex(L => L.id === id);
  const isShown = (i: number) => i < revealed - 1;
  const isScaffold = revealed === 1;
  const REVEAL_CAPTIONS = [
    "Step 0 of 6. One line. That is everything the operator types. What is missing to produce a board-ready answer?",
    "Step 1 of 6. Scaffold only. The funnel exists but is empty. Each slot below shows in plain English what will land there.",
    "Step 2 of 6. Strategic intent enters first. The prompt now knows which thesis it lives inside.",
    "Step 3 of 6. Governance and risk snap in. Legal, residency and citation rules become non-negotiable.",
    "Step 4 of 6. Domain standards land. Structure, tone and approved benchmarks are no longer up for debate.",
    "Step 5 of 6. Team context arrives. Prior decisions, artefacts and roles keep the output consistent with the org.",
    "Step 6 of 6. Personal preference closes the funnel. Compile complete. Click any layer to remove it and watch the output drift.",
  ];
  const fullyRevealed = revealed === TOTAL_STEPS;

  const toggle = (id: LayerId) => setActive(a => ({ ...a, [id]: !a[id] }));

  const enforcedCount = LAYERS.filter((L, i) => isShown(i) && active[L.id]).length;
  const fullyGoverned = fullyRevealed && enforcedCount === LAYERS.length;

  // Funnel geometry — side view, nested trapezoids.
  // Wide intake at top, narrow spout at bottom (the prompt).
  // Each layer's bottom width = next layer's top width => they nest perfectly.
  const WIDTHS = [820, 660, 520, 400, 300, 180]; // 6 anchors for 5 layers
  const LAYER_H = 110;
  const STACK_TOP = 80;
  const CX = 460;

  const orderIndex = (i: number) =>
    mode === "topdown" ? i + 1 : LAYERS.length - i;

  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={8} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />

      <div className="relative z-10">
        <ArcStepper current={1} next="vs RAG, the defence" />
        <Tag label="The atom. Every prompt is a compile." color={GREEN} />
        <h2 className="font-bold leading-[1.02] mb-3" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.028em", maxWidth: 1760 }}>
          Every prompt assembles five layers of <span style={{ color: `hsl(${GREEN})` }}>governed context</span>. Automatically.
        </h2>

        {/* ── Progressive reveal control ── */}
        <div className="flex items-center gap-4 mb-3 rounded-xl border px-4 py-2.5"
          style={{ borderColor: CHROME_BORDER, background: "white" }}>
          <button
            onClick={() => setRevealed(r => Math.max(0, r - 1))}
            disabled={revealed === 0}
            className="rounded-md border px-2 py-1 font-mono uppercase tracking-[0.12em] disabled:opacity-40"
            style={{ fontSize: 10, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}
          >prev</button>

          {/* 5-dot progress: each dot = one revealed layer */}
          <div className="flex items-center gap-2">
            {LAYERS.map((L, i) => {
              const on = i < revealed - 1;
              return (
                <button key={L.id} onClick={() => setRevealed(i + 2)}
                  title={`Reveal up to: ${L.label}`}
                  className="rounded-full transition-all"
                  style={{
                    width: on ? 22 : 10, height: 10,
                    background: on ? `hsl(${L.color})` : CHROME_BG,
                    border: `1px solid hsl(${on ? L.color : SUBTLE} / ${on ? 0.9 : 0.4})`,
                  }}
                />
              );
            })}
            <span className="font-mono uppercase tracking-[0.12em] ml-2" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700 }}>
              {revealed === 0 ? "prompt only" : isScaffold ? "scaffold ready" : `${revealed - 1} / ${LAYERS.length} layers`}
            </span>
          </div>

          <span style={{ fontSize: 12, color: TEXT, lineHeight: 1.35, flex: 1 }}>
            {REVEAL_CAPTIONS[revealed]}
          </span>

          <button
            onClick={() => setRevealed(0)}
            className="rounded-md border px-2 py-1 font-mono uppercase tracking-[0.12em]"
            style={{ fontSize: 10, color: SUBTLE, borderColor: CHROME_BORDER, background: "white" }}
          >reset</button>
          <button
            onClick={() => setRevealed(r => Math.min(TOTAL_STEPS, r + 1))}
            disabled={fullyRevealed}
            className="rounded-md border px-3 py-1 font-mono uppercase tracking-[0.12em] disabled:opacity-40 animate-pulse"
            style={{
              fontSize: 10, fontWeight: 800,
              color: fullyRevealed ? TEXT : "white",
              background: fullyRevealed ? CARD_ALT : `hsl(${GREEN})`,
              borderColor: fullyRevealed ? CHROME_BORDER : `hsl(${GREEN})`,
            }}
          >{fullyRevealed ? "compile complete" : revealed === 0 ? "show scaffold ▸" : "reveal next ▸"}</button>

          {/* Inline mode toggle — only after full reveal, keeps layout height stable */}
          {fullyRevealed && (
            <div className="inline-flex rounded-md border overflow-hidden ml-1" style={{ borderColor: CHROME_BORDER }}>
              {([
                { k: "topdown" as const,  l: "Top-down" },
                { k: "bottomup" as const, l: "Bottom-up" },
              ]).map(o => (
                <button
                  key={o.k}
                  onClick={() => setMode(o.k)}
                  className="px-3 py-1.5 font-mono uppercase tracking-[0.12em] transition-colors"
                  style={{
                    fontSize: 10, fontWeight: 800,
                    background: mode === o.k ? `hsl(${GREEN} / 0.12)` : "white",
                    color: mode === o.k ? `hsl(${GREEN})` : TEXT,
                  }}
                >{o.l}</button>
              ))}
            </div>
          )}
        </div>

        {/* ── Hero prompt card (rendered in two positions: centered at step 0, right-column from step 1+) ── */}
        {(() => {
          const promptCard = (variant: "hero" | "panel") => (
            <motion.div
              layoutId="compile-prompt-card"
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              className="rounded-2xl border-2"
              style={{
                borderColor: `hsl(${GREEN} / 0.55)`,
                background: "white",
                boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
                padding: variant === "hero" ? "28px 32px" : "16px 20px",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono uppercase tracking-[0.14em]"
                  style={{ fontSize: variant === "hero" ? 13 : 11, color: `hsl(${GREEN})`, fontWeight: 800 }}>
                  Operator prompt · the moment of work
                </span>
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded border"
                  style={{ fontSize: 10, color: `hsl(${GREEN})`, borderColor: `hsl(${GREEN} / 0.5)` }}>
                  <Send size={10} /> resolve
                </span>
              </div>
              <p style={{
                fontSize: variant === "hero" ? 34 : 22,
                color: TEXT, fontWeight: 700,
                lineHeight: 1.2, letterSpacing: "-0.015em",
              }}>
                "Draft the Series-B narrative for tomorrow's board."
              </p>
              <p className="mt-2" style={{ fontSize: variant === "hero" ? 13 : 11.5, color: MUTED, lineHeight: 1.4 }}>
                {variant === "hero"
                  ? "One line from the operator. That is everything LIZA receives. What must be true around this line to produce a board-ready answer? Press reveal to find out."
                  : `One line from the operator. The funnel has compiled ${enforcedCount} of ${LAYERS.length} layers so far.`}
              </p>
            </motion.div>
          );

          return (
        <LayoutGroup id="compile-stage">
        <AnimatePresence mode="wait" initial={false}>
        {revealed === 0 ? (
          // ── Stage 0 · Centered hero prompt only ──
          <motion.div
            key="centered"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex items-center justify-center"
            style={{ height: 660 }}
          >
            <div style={{ width: 760 }}>
              {promptCard("hero")}
              <p className="mt-4 text-center font-mono uppercase tracking-[0.14em]"
                style={{ fontSize: 10.5, color: SUBTLE }}>
                ↓ press "reveal next" to compile the five layers of governed context around this prompt
              </p>
            </div>
          </motion.div>
        ) : (
        <motion.div
          key="split"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-12 gap-5 relative"
        >
          {/* LEFT — nested funnel stack */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="col-span-7 rounded-2xl border relative"
            style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 660 }}>
            <svg viewBox="0 0 920 720" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Centerline */}
              <line x1={CX} y1={50} x2={CX} y2={700} stroke={`hsl(${SUBTLE} / 0.18)`} strokeWidth={1} strokeDasharray="2 4" />

              {LAYERS.map((L, i) => {
                const yTop = STACK_TOP + i * LAYER_H;
                const yBot = yTop + LAYER_H;
                const wTop = WIDTHS[i];
                const wBot = WIDTHS[i + 1];
                const shown = isShown(i);
                const on = shown && active[L.id];
                const isHover = hovered === L.id;
                const c = L.color;
                const pts = [
                  [CX - wTop / 2, yTop],
                  [CX + wTop / 2, yTop],
                  [CX + wBot / 2, yBot],
                  [CX - wBot / 2, yBot],
                ].map(p => p.join(",")).join(" ");
                return (
                  <g key={L.id}
                    onMouseEnter={() => shown && setHovered(L.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => shown && fullyRevealed && toggle(L.id)}
                    style={{ cursor: shown && fullyRevealed ? "pointer" : "default", transition: "opacity 0.4s ease" }}
                    opacity={shown ? 1 : isScaffold ? 0.55 : 0.18}
                  >
                    <polygon
                      points={pts}
                      fill={!shown ? "transparent" : on ? `hsl(${c} / ${isHover ? 0.22 : 0.14})` : `hsl(${RED} / 0.06)`}
                      stroke={!shown ? `hsl(${SUBTLE} / 0.55)` : on ? `hsl(${c} / ${isHover ? 0.95 : 0.7})` : `hsl(${RED} / 0.45)`}
                      strokeWidth={isHover ? 2.5 : 1.5}
                      strokeDasharray={!shown ? "3 5" : on ? "0" : "5 4"}
                    />
                    {/* Order badge */}
                    <circle cx={CX - wTop / 2 - 18} cy={yTop + LAYER_H / 2} r={14}
                      fill="white" stroke={!shown ? `hsl(${SUBTLE} / 0.5)` : on ? `hsl(${c})` : `hsl(${RED} / 0.5)`} strokeWidth={1.5} />
                    <text x={CX - wTop / 2 - 18} y={yTop + LAYER_H / 2 + 4}
                      textAnchor="middle" fontSize={12} fontWeight={700}
                      fill={!shown ? SUBTLE : on ? `hsl(${c})` : `hsl(${RED})`}>
                      {orderIndex(i)}
                    </text>
                    {/* Label centered inside the trapezoid */}
                    <text x={CX} y={yTop + LAYER_H / 2 - 4}
                      textAnchor="middle" fontSize={16} fontWeight={800}
                      fill={!shown ? SUBTLE : on ? TEXT : `hsl(${RED})`}>
                      {shown || isScaffold ? L.label : "···"}
                    </text>
                    <text x={CX} y={yTop + LAYER_H / 2 + 16}
                      textAnchor="middle" fontSize={11}
                      fill={!shown ? SUBTLE : on ? MUTED : `hsl(${RED} / 0.85)`}>
                      {!shown ? (isScaffold ? L.scaffold : "not yet revealed") : on ? L.sub : "ungoverned · context leaks"}
                    </text>
                    {/* Right-side chip */}
                    <g transform={`translate(${CX + wTop / 2 + 14}, ${yTop + LAYER_H / 2 - 9})`}>
                      <rect width={92} height={18} rx={4}
                        fill={!shown ? CHROME_BG : on ? `hsl(${c} / 0.12)` : `hsl(${RED} / 0.08)`}
                        stroke={!shown ? `hsl(${SUBTLE} / 0.4)` : on ? `hsl(${c} / 0.5)` : `hsl(${RED} / 0.4)`} strokeWidth={1} />
                      <text x={46} y={13} textAnchor="middle" fontSize={10} fontWeight={700}
                        fill={!shown ? SUBTLE : on ? `hsl(${c})` : `hsl(${RED})`}>{shown || isScaffold ? L.chip : "—"}</text>
                    </g>
                  </g>
                );
              })}

              {/* Spout / moment of work */}
              <g>
                <rect x={CX - 110} y={640} width={220} height={54} rx={10}
                  fill="white" stroke={`hsl(${GREEN} / 0.7)`} strokeWidth={2} />
                <text x={CX} y={663} textAnchor="middle" fontSize={13} fontWeight={800} fill={TEXT}>
                  LIZA · The moment of work
                </text>
                <text x={CX} y={681} textAnchor="middle" fontSize={11} fill={MUTED}>
                  Operator prompt resolves here
                </text>
                {/* Drip dots */}
                {[0, 1, 2].map(d => (
                  <circle key={d} cx={CX} cy={612 + d * 8} r={2.5} fill={`hsl(${GREEN} / ${0.4 + d * 0.2})`} />
                ))}
              </g>
            </svg>

            {/* Intake hint top-left */}
            <div className="absolute top-3 left-4 font-mono uppercase tracking-[0.14em]"
              style={{ fontSize: 10, color: SUBTLE }}>Widest intake · all change enters here</div>
            <div className="absolute bottom-3 left-4 font-mono uppercase tracking-[0.14em]"
              style={{ fontSize: 10, color: SUBTLE }}>Narrowest spout · the prompt</div>
          </motion.div>

          {/* RIGHT — live prompt screen */}
          <div className="col-span-5 flex flex-col gap-3" style={{ height: 660 }}>
            {/* 1 · HERO PROMPT — morphs from centered hero into right column */}
            {promptCard("panel")}

            {/* 2 · OUTCOME PREVIEW — what actually changes when layers snap in/out */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl border flex-1 overflow-hidden flex flex-col"
              style={{ borderColor: CHROME_BORDER, background: "white" }}>
              <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <span className="font-mono" style={{ fontSize: 11, color: SUBTLE, marginLeft: 8 }}>liza · resolved output</span>
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                  style={{
                    fontSize: 10,
                    color: fullyGoverned ? `hsl(${GREEN})` : `hsl(${RED})`,
                    borderColor: fullyGoverned ? `hsl(${GREEN} / 0.4)` : `hsl(${RED} / 0.5)`,
                    background: fullyGoverned ? `hsl(${GREEN} / 0.08)` : `hsl(${RED} / 0.06)`,
                  }}>
                  {fullyGoverned ? <><ShieldCheck size={10} /> Governed</> : <><AlertTriangle size={10} /> Ungoverned · {LAYERS.length - enforcedCount} missing</>}
                </span>
              </div>
              <div className="px-4 py-3 flex-1 overflow-y-auto">
                {/* Inline draft preview · colours each layer's contribution */}
                <p className="font-mono uppercase tracking-[0.14em] mb-1.5" style={{ fontSize: 10, color: SUBTLE }}>
                  Draft preview · each colour is one layer's contribution
                </p>
                {(() => {
                  const FRAGMENTS: { id: LayerId; on: string; off: string }[] = [
                    { id: "standards",  on: "Investor Memo v3.1 structure",        off: "free-form structure" },
                    { id: "intent",     on: "anchored to the Q4 EU-first thesis",  off: "generic growth story" },
                    { id: "governance", on: "every external claim cited, no PII",  off: "uncited claims, PII risk" },
                    { id: "team",       on: "consistent with last board update",   off: "contradicts last board update" },
                    { id: "preference", on: "bullet-first, no hedging",            off: "prose-heavy and hedged" },
                  ];
                  const frag = (id: LayerId) => {
                    const f = FRAGMENTS.find(x => x.id === id)!;
                    const layer = LAYERS.find(L => L.id === id)!;
                    const i = idxOf(id);
                    const shown = isShown(i);
                    const on = shown && active[id];
                    if (!shown) {
                      return (
                        <span
                          title={`${layer.label} (not yet revealed)`}
                          style={{
                            fontWeight: 600,
                            color: SUBTLE,
                            background: CHROME_BG,
                            border: `1px dashed hsl(${SUBTLE} / 0.5)`,
                            padding: "0 6px",
                            borderRadius: 3,
                            fontStyle: "italic",
                          }}
                        >
                          [{layer.label.toLowerCase()} pending]
                        </span>
                      );
                    }
                    return (
                      <span
                        onClick={() => fullyRevealed && toggle(id)}
                        title={layer.label}
                        style={{
                          cursor: fullyRevealed ? "pointer" : "default",
                          fontWeight: 700,
                          color: on ? `hsl(${layer.color})` : `hsl(${RED})`,
                          background: on ? `hsl(${layer.color} / 0.10)` : `hsl(${RED} / 0.08)`,
                          borderBottom: `1.5px solid hsl(${on ? layer.color : RED} / 0.55)`,
                          textDecoration: on ? "none" : "line-through",
                          padding: "0 4px",
                          borderRadius: 3,
                        }}
                      >
                        {on ? f.on : f.off}
                      </span>
                    );
                  };
                  return (
                    <div className="rounded-lg border px-3 py-2.5 mb-3"
                      style={{ borderColor: CHROME_BORDER, background: CHROME_BG, fontSize: 12.5, color: TEXT, lineHeight: 1.7 }}>
                      <div><span style={{ color: SUBTLE, fontWeight: 600 }}>Title.</span> Series-B Narrative · {frag("standards")}.</div>
                      <div><span style={{ color: SUBTLE, fontWeight: 600 }}>Opening.</span> Positioned as {frag("intent")}.</div>
                      <div><span style={{ color: SUBTLE, fontWeight: 600 }}>Evidence.</span> Drafted with {frag("governance")}.</div>
                      <div><span style={{ color: SUBTLE, fontWeight: 600 }}>Continuity.</span> Framing {frag("team")}.</div>
                      <div><span style={{ color: SUBTLE, fontWeight: 600 }}>Voice.</span> Delivered {frag("preference")}.</div>
                    </div>
                  );
                })()}
                <p className="font-mono uppercase tracking-[0.14em] mb-2" style={{ fontSize: 10, color: SUBTLE }}>
                  Per-layer diff · snap a layer out to compare
                </p>
                {(() => {
                  // Each layer toggles a specific visible mutation in the draft output.
                  const lines = [
                    { id: "intent" as LayerId,    on: "Anchored to the Q4 expansion thesis. EU-first framing.",                 off: "Generic growth story. No anchor to current thesis." },
                    { id: "governance" as LayerId, on: "All external claims cited. No PII to vendor model. GDPR safe.",         off: "Uncited claims. Risk of PII leak. Legal must re-review." },
                    { id: "standards" as LayerId,  on: "Investor Memo v3.1 structure. House tone. Approved benchmarks.",       off: "Free-form structure. Off-tone. Mixed benchmark sources." },
                    { id: "team" as LayerId,       on: "Reuses Series-A framing. Consistent with last week's board update.",   off: "Contradicts last board update. Reviewers will catch the drift." },
                    { id: "preference" as LayerId, on: "Bullet-first. No hedging. Concise, German-English voice.",              off: "Prose-heavy. Hedged. Operator must rewrite by hand." },
                  ];
                  return (
                    <div className="space-y-1.5">
                      {lines.map(l => {
                        const layer = LAYERS.find(L => L.id === l.id)!;
                        const i = idxOf(l.id);
                        const shown = isShown(i);
                        const on = shown && active[l.id];
                        if (!shown) {
                          return (
                            <div key={l.id}
                              className="rounded-md border border-dashed px-2.5 py-1.5 flex items-center gap-2"
                              style={{ borderColor: `hsl(${SUBTLE} / 0.4)`, background: CHROME_BG, opacity: isScaffold ? 0.95 : 0.7 }}
                            >
                              <span style={{ fontSize: 12, color: SUBTLE, fontWeight: 800 }}>·</span>
                              <span className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9.5, color: SUBTLE, fontWeight: 700 }}>
                                {layer.label}
                              </span>
                              <span style={{ fontSize: 11, color: SUBTLE, fontStyle: "italic" }}>
                                {isScaffold ? layer.scaffold : "not yet revealed"}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div key={l.id}
                            onClick={() => fullyRevealed && toggle(l.id)}
                            onMouseEnter={() => setHovered(l.id)}
                            onMouseLeave={() => setHovered(null)}
                            className="rounded-md border px-2.5 py-1.5 transition-all flex items-start gap-2"
                            style={{
                              cursor: fullyRevealed ? "pointer" : "default",
                              borderColor: on ? `hsl(${layer.color} / 0.45)` : `hsl(${RED} / 0.45)`,
                              background: on ? `hsl(${layer.color} / 0.05)` : `hsl(${RED} / 0.05)`,
                            }}
                          >
                            <span className="mt-0.5" style={{ fontSize: 12, color: on ? `hsl(${layer.color})` : `hsl(${RED})`, fontWeight: 800 }}>
                              {on ? "✓" : "✗"}
                            </span>
                            <div className="flex-1">
                              <span className="font-mono uppercase tracking-[0.1em] mr-1.5" style={{ fontSize: 9.5, color: on ? `hsl(${layer.color})` : `hsl(${RED})`, fontWeight: 800 }}>
                                {layer.label}
                              </span>
                              <span style={{ fontSize: 12, color: on ? TEXT : `hsl(${RED})`, lineHeight: 1.35 }}>
                                {on ? l.on : l.off}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
              <div className="border-t px-4 py-2.5"
                style={{ borderColor: CHROME_BORDER, background: !fullyRevealed ? CHROME_BG : fullyGoverned ? `hsl(${GREEN} / 0.06)` : `hsl(${RED} / 0.05)` }}>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.4 }}>
                  {!fullyRevealed ? (
                    isScaffold ? (
                      <><b style={{ color: SUBTLE }}>Scaffold ready.</b> The funnel is in place but empty. Press reveal next to start landing each layer of governed context, one at a time.</>
                    ) : (
                      <><b style={{ color: SUBTLE }}>Compile in progress.</b> {LAYERS.length - Math.max(0, revealed - 1)} of {LAYERS.length} layers still to reveal. Each one closes a gap the operator would otherwise have to improvise.</>
                    )
                  ) : fullyGoverned ? (
                    <><b style={{ color: `hsl(${GREEN})` }}>Fully governed compile.</b> The operator writes one line. Everything else is inherited.</>
                  ) : (
                    <><b style={{ color: `hsl(${RED})` }}>Ungoverned compile.</b> The operator must improvise the gap. Every time. Drift compounds silently.</>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        )}
        </AnimatePresence>
        </LayoutGroup>
          );
        })()}
      </div>
      {/* Next-slide handoff */}
      <div className="absolute right-12 bottom-6 flex items-center gap-2 font-mono uppercase tracking-[0.14em]"
        style={{ fontSize: 10, color: SUBTLE }}>
        <span>next</span>
        <ArrowRight size={11} />
        <span style={{ color: TEXT, fontWeight: 700 }}>02 Defend. The compile beats RAG.</span>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 07d — ONE FUNNEL · EVERY OPERATOR · LEARNING UPWARD
// ═════════════════════════════════════════════════════════════════════════════
export function S07dOrgLoop() {
  // 6 operator funnels orbiting a single shared knowledge base. Trace is the
  // default mode: one operator's override propagates through the knowledge base
  // and lands in every other operator's next moment of work.
  const OPERATORS = [
    { role: "CEO",           fn: "Leadership", color: PURPLE, chip: "Q4 raise narrative" },
    { role: "Strategy Lead", fn: "Strategy",   color: PURPLE, chip: "EU-first roadmap" },
    { role: "Sales AE",      fn: "Revenue",    color: GOLD,   chip: "Proposal v3" },
    { role: "Ops Manager",   fn: "Operations", color: GREEN,  chip: "Supplier escalation" },
    { role: "Legal Counsel", fn: "Risk",       color: ACCENT, chip: "DPA redline" },
    { role: "Engineer",      fn: "Build",      color: ACCENT, chip: "API contract" },
  ] as const;

  const PRIMITIVES = [
    { k: "Standards" },
    { k: "Procedures" },
    { k: "Preferences" },
    { k: "Prohibitions" },
    { k: "Facts" },
    { k: "Skills" },
  ];

  // One trace per operator. Pick a small, concrete moment of work that is
  // obvious to a non-developer reader. Click an operator to switch.
  const TRACES: {
    prompt: string; primitive: "Fact" | "Standard" | "Preference" | "Prohibition" | "Procedure" | "Skill";
    update: string; landsIn: string; timing: string;
  }[] = [
    { prompt: "Use 'EU-first' as our default launch framing.",            primitive: "Standard",    update: "Default launch order: EU → US → APAC", landsIn: "every operator's next launch memo",         timing: "3 min from approval to org-wide" },
    { prompt: "Always lead with the customer outcome, not the feature.", primitive: "Preference",  update: "Voice rule: outcome first, feature second", landsIn: "every operator's next external write-up", timing: "2 min from approval to org-wide" },
    { prompt: "Our new Q4 list price is €4,900 per seat.",                primitive: "Fact",        update: "Q4 list price = €4,900 / seat",        landsIn: "every proposal, deck, and quote across the org", timing: "4 min from approval to org-wide" },
    { prompt: "Escalate any supplier delay over 5 days to Ops lead.",    primitive: "Procedure",   update: "Supplier delay > 5d → escalate to Ops lead", landsIn: "every operator's supplier workflow",  timing: "3 min from approval to org-wide" },
    { prompt: "No customer PII in vendor-hosted models. Ever.",          primitive: "Prohibition", update: "Hard block: PII → external model",     landsIn: "every operator's next prompt, enforced at compile", timing: "1 min from approval to org-wide" },
    { prompt: "Standardise our API error envelope on RFC 7807.",          primitive: "Standard",    update: "Error envelope: RFC 7807 (problem+json)", landsIn: "every operator touching the API",        timing: "5 min from approval to org-wide" },
  ];

  const [mode, setMode] = useState<"trace" | "ambient">("trace");
  const [traceIdx, setTraceIdx] = useState<number>(2); // start on Sales AE · Q4 price
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const TRACE = { operatorIdx: traceIdx, ...TRACES[traceIdx] };

  // SVG canvas — left panel
  const VB = 1100;
  const VBH = 820;
  const CX = VB / 2;
  const CY = VBH / 2;
  const RING_R = 130;          // substrate ring radius (clean, no inner chips)
  const PRIM_R = RING_R + 28;  // orbiting primitives outside the ring
  const FUNNEL_R = 330;        // distance of funnels from centre
  const N = OPERATORS.length;

  const opPos = OPERATORS.map((_, i) => {
    const a = (-Math.PI / 2) + (i * 2 * Math.PI) / N;
    return { x: CX + Math.cos(a) * FUNNEL_R, y: CY + Math.sin(a) * FUNNEL_R, a };
  });

  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={9} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />

      <div className="relative z-10">
        <ArcStepper current={3} next="the instrument panel" />
        <Tag label="The network. Every moment of work is a commit." color={GREEN} />
        <h2 className="font-bold leading-[1.02] mb-4" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.028em", maxWidth: 1760 }}>
          The org learns <span style={{ color: `hsl(${GREEN})` }}>laterally</span>. In real time. At the speed of work.
        </h2>
        <p style={{ fontSize: 14, color: SUBTLE, marginBottom: 12 }}>
          Click any operator on the network to trace their commit through the knowledge base.
        </p>

        <div className="grid grid-cols-12 gap-5">
          {/* LEFT — network of funnels around the shared knowledge base */}
          <div className="col-span-9 rounded-2xl border relative"
            style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 760 }}>

            <div className="absolute top-3 left-4 font-mono uppercase tracking-[0.14em]"
              style={{ fontSize: 10, color: SUBTLE, maxWidth: 560 }}>
              {mode === "trace"
                ? `Trace · ${OPERATORS[TRACE.operatorIdx].role} override, promoted to ${TRACE.primitive}, re-enters every other operator`
                : "Ambient flow · every funnel emits into the knowledge base, and it re-enters every funnel"}
            </div>

            <div className="absolute top-3 right-4 flex gap-1 rounded-full border p-0.5"
              style={{ borderColor: CHROME_BORDER, background: "white" }}>
              {(["trace", "ambient"] as const).map(m => (
                <button key={m}
                  onClick={() => setMode(m)}
                  className="px-3 py-1 rounded-full font-mono uppercase tracking-[0.1em]"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: mode === m ? `hsl(${GREEN} / 0.12)` : "transparent",
                    color: mode === m ? `hsl(${GREEN})` : MUTED,
                  }}>
                  {m === "trace" ? "Trace one commit" : "Ambient flow"}
                </button>
              ))}
            </div>

            <svg viewBox={`0 0 ${VB} ${VBH}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="subGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"  stopColor={`hsl(${GREEN} / 0.22)`} />
                  <stop offset="60%" stopColor={`hsl(${GREEN} / 0.07)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0)`} />
                </radialGradient>
              </defs>

              {/* Connectors: funnel ↔ substrate */}
              {opPos.map((p, i) => {
                const op = OPERATORS[i];
                const dim = mode === "trace" && i !== TRACE.operatorIdx;
                const dx = CX - p.x;
                const dy = CY - p.y;
                const d  = Math.hypot(dx, dy);
                const ux = dx / d, uy = dy / d;
                const fx = p.x + ux * 70;
                const fy = p.y + uy * 70;
                const tx = CX - ux * (RING_R + 8);
                const ty = CY - uy * (RING_R + 8);
                return (
                  <g key={`line-${i}`} opacity={dim ? 0.18 : 1}>
                    <line x1={fx} y1={fy} x2={tx} y2={ty}
                      stroke={`hsl(${op.color} / 0.4)`} strokeWidth={1.2} strokeDasharray="3 4" />
                    {mode === "ambient" && (
                      <>
                        <circle r={3.5} fill={`hsl(${op.color})`}>
                          <animate attributeName="cx" from={fx} to={tx} dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                          <animate attributeName="cy" from={fy} to={ty} dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                        </circle>
                        <circle r={2.5} fill={`hsl(${GREEN})`} opacity={0.8}>
                          <animate attributeName="cx" from={tx} to={fx} dur="3.6s" begin={`${i * 0.4 + 1.6}s`} repeatCount="indefinite" />
                          <animate attributeName="cy" from={ty} to={fy} dur="3.6s" begin={`${i * 0.4 + 1.6}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.6s" begin={`${i * 0.4 + 1.6}s`} repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    {mode === "trace" && i === TRACE.operatorIdx && (
                      <circle r={6} fill={`hsl(${op.color})`}>
                        <animate attributeName="cx" from={fx} to={tx} dur="1.8s" begin="0s;loop.end+2.5s" id="traceOut" repeatCount="1" />
                        <animate attributeName="cy" from={fy} to={ty} dur="1.8s" begin="0s;loop.end+2.5s" repeatCount="1" />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="1.8s" begin="0s;loop.end+2.5s" repeatCount="1" />
                      </circle>
                    )}
                    {mode === "trace" && i !== TRACE.operatorIdx && (
                      <circle r={4.5} fill={`hsl(${GREEN})`}>
                        <animate attributeName="cx" from={tx} to={fx} dur="1.6s" begin={`traceOut.end+${0.1 + i * 0.12}s`} id={i === 0 ? "loop" : undefined} repeatCount="1" />
                        <animate attributeName="cy" from={ty} to={fy} dur="1.6s" begin={`traceOut.end+${0.1 + i * 0.12}s`} repeatCount="1" />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="1.6s" begin={`traceOut.end+${0.1 + i * 0.12}s`} repeatCount="1" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Shared substrate ring (centre) — clean, no text collisions */}
              <circle cx={CX} cy={CY} r={RING_R + 50} fill="url(#subGrad)" />
              <circle cx={CX} cy={CY} r={RING_R} fill="white"
                stroke={`hsl(${GREEN} / 0.6)`} strokeWidth={2.2} strokeDasharray="5 5">
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="60s" repeatCount="indefinite" />
              </circle>

              {/* Central labels — clear vertical block, no overlaps */}
              <text x={CX} y={CY - 32} textAnchor="middle" fontSize={11} fontWeight={800}
                fill={`hsl(${GREEN})`} style={{ letterSpacing: "0.22em" }}>
                SHARED KNOWLEDGE BASE
              </text>
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize={28} fontWeight={800}
                fill={TEXT} style={{ letterSpacing: "-0.02em" }}>
                4,820
              </text>
              <text x={CX} y={CY + 12} textAnchor="middle" fontSize={9.5} fill={MUTED}>
                primitives, versioned and audited
              </text>
              <text x={CX} y={CY + 32} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={`hsl(${GREEN})`}>
                +312 this week
              </text>

              {/* Primitive chips orbiting OUTSIDE the ring — no collision with centre text */}
              {PRIMITIVES.map((p, i) => {
                const a = (-Math.PI / 2) + (i * 2 * Math.PI) / PRIMITIVES.length;
                const x = CX + Math.cos(a) * PRIM_R;
                const y = CY + Math.sin(a) * PRIM_R;
                return (
                  <g key={p.k}>
                    <rect x={x - 42} y={y - 11} width={84} height={22} rx={11}
                      fill="white" stroke={`hsl(${GREEN} / 0.55)`} strokeWidth={1} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={TEXT}>{p.k}</text>
                  </g>
                );
              })}

              {/* Each operator funnel — larger, readable */}
              {opPos.map((p, i) => {
                const op = OPERATORS[i];
                const dim = mode === "trace" && i !== TRACE.operatorIdx;
                const highlight = mode === "trace" && i === TRACE.operatorIdx;
                const dx = CX - p.x, dy = CY - p.y;
                const ang = Math.atan2(dy, dx) * 180 / Math.PI;
                return (
                  <g key={`f-${i}`} transform={`translate(${p.x} ${p.y}) rotate(${ang})`} opacity={dim ? 0.34 : 1}
                    onClick={() => { setMode("trace"); setTraceIdx(i); }}
                    style={{ cursor: "pointer" }}>
                    {/* Pulsing ring (moment of work) */}
                    <circle cx={0} cy={0} r={62}
                      fill="none" stroke={`hsl(${op.color} / 0.4)`} strokeWidth={highlight ? 1.8 : 1.2}>
                      <animate attributeName="r" values="56;76;56" dur="3.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0;0.6" dur="3.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
                    </circle>
                    {/* Funnel body — bigger so the 5 layers are visible */}
                    <g transform="rotate(180)">
                      {[0, 1, 2, 3, 4].map(li => {
                        const widths = [120, 104, 86, 68, 50, 32];
                        const layerH = 16;
                        const top0 = -48;
                        const yTop = top0 + li * layerH;
                        const yBot = yTop + layerH;
                        const pts = [
                          [-widths[li] / 2, yTop],
                          [widths[li] / 2, yTop],
                          [widths[li + 1] / 2, yBot],
                          [-widths[li + 1] / 2, yBot],
                        ].map(pp => pp.join(",")).join(" ");
                        return (
                          <polygon key={li} points={pts}
                            fill={`hsl(${op.color} / ${0.08 + li * 0.04})`}
                            stroke={`hsl(${op.color} / 0.65)`} strokeWidth={0.9} />
                        );
                      })}
                      {/* Spout */}
                      <rect x={-26} y={32} width={52} height={16} rx={3}
                        fill="white" stroke={`hsl(${op.color})`} strokeWidth={1.3} />
                      <text x={0} y={43} textAnchor="middle" fontSize={9}
                        fontWeight={800} fill={`hsl(${op.color})`} style={{ letterSpacing: "0.08em" }}>
                        COMMIT
                      </text>
                    </g>
                    {/* Role label */}
                    <g transform={`rotate(${-ang})`}>
                      <rect x={-72} y={78} width={144} height={42} rx={7}
                        fill="white" stroke={highlight ? `hsl(${op.color})` : `hsl(${op.color} / 0.4)`}
                        strokeWidth={highlight ? 2 : 1} />
                      <text x={0} y={94} textAnchor="middle" fontSize={13}
                        fontWeight={800} fill={TEXT}>{op.role}</text>
                      <text x={0} y={110} textAnchor="middle" fontSize={9.5}
                        fill={`hsl(${op.color})`} style={{ letterSpacing: "0.06em" }}>
                        {op.fn.toUpperCase()} · {op.chip}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* ── Numbered route badges · 4 steps along the trace path ── */}
              {mode === "trace" && (() => {
                const sel = opPos[TRACE.operatorIdx];
                const selOp = OPERATORS[TRACE.operatorIdx];
                const dx = CX - sel.x, dy = CY - sel.y;
                const d = Math.hypot(dx, dy);
                const ux = dx / d, uy = dy / d;
                const fx = sel.x + ux * 70;          // funnel exit
                const fy = sel.y + uy * 70;
                const tx = CX - ux * (RING_R + 8);   // ring edge
                const ty = CY - uy * (RING_R + 8);
                // Pick a representative peer (next operator clockwise) for step 04 anchor.
                const peerIdx = (TRACE.operatorIdx + 1) % N;
                const peer = opPos[peerIdx];
                const pdx = peer.x - CX, pdy = peer.y - CY;
                const pd = Math.hypot(pdx, pdy);
                const pux = pdx / pd, puy = pdy / pd;
                const px = CX + pux * (RING_R + 12);
                const py = CY + puy * (RING_R + 12);
                const peerFx = peer.x - pux * 70;
                const peerFy = peer.y - puy * 70;

                const BADGES = [
                  { n: 1, x: (sel.x + fx) / 2, y: (sel.y + fy) / 2, color: selOp.color, label: "COMMIT",   tip: "Override fires inside the operator's funnel." },
                  { n: 2, x: (fx + tx) / 2,     y: (fy + ty) / 2,    color: GOLD,         label: "PROMOTE",  tip: "LIZA proposes a typed primitive update." },
                  { n: 3, x: CX,                y: CY - RING_R - 14, color: GREEN,        label: "WRITE",    tip: "Lead approves. Versioned, audited write to the shared base." },
                  { n: 4, x: (px + peerFx) / 2, y: (py + peerFy) / 2, color: GREEN,       label: "RE-ENTER", tip: "Re-injected into every other operator's next compile." },
                ];
                return (
                  <g>
                    {BADGES.map(b => {
                      const active = hoverStep === b.n;
                      const r = active ? 18 : 14;
                      return (
                        <g key={b.n}
                          onMouseEnter={() => setHoverStep(b.n)}
                          onMouseLeave={() => setHoverStep(null)}
                          style={{ cursor: "pointer" }}>
                          {/* halo when active */}
                          {active && (
                            <circle cx={b.x} cy={b.y} r={r + 6}
                              fill={`hsl(${b.color} / 0.18)`} stroke="none" />
                          )}
                          <circle cx={b.x} cy={b.y} r={r}
                            fill="white"
                            stroke={`hsl(${b.color})`}
                            strokeWidth={active ? 2.5 : 1.8} />
                          <text x={b.x} y={b.y + 4.5}
                            textAnchor="middle"
                            fontSize={active ? 14 : 12}
                            fontWeight={900}
                            fill={`hsl(${b.color})`}>
                            {b.n}
                          </text>
                          {/* always-visible mini label below */}
                          <text x={b.x} y={b.y + r + 11}
                            textAnchor="middle"
                            fontSize={9}
                            fontWeight={800}
                            fill={`hsl(${b.color})`}
                            style={{ letterSpacing: "0.08em" }}>
                            {b.label}
                          </text>
                          {/* tooltip card on hover */}
                          {active && (
                            <g transform={`translate(${b.x + 22}, ${b.y - 28})`}>
                              <rect width={210} height={44} rx={6}
                                fill="white" stroke={`hsl(${b.color} / 0.7)`} strokeWidth={1.5} />
                              <text x={10} y={17} fontSize={10} fontWeight={800}
                                fill={`hsl(${b.color})`} style={{ letterSpacing: "0.08em" }}>
                                STEP 0{b.n} · {b.label}
                              </text>
                              <text x={10} y={33} fontSize={10} fill={TEXT}>
                                {b.tip}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* RIGHT — collapsed to 2 panels: traced event + compound footer */}
          <div className="col-span-3 flex flex-col gap-3" style={{ height: 760 }}>
            <div className="rounded-xl border-2 bg-white p-4 flex-1"
              style={{ borderColor: `hsl(${GOLD} / 0.55)` }}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="rounded-full" style={{ width: 9, height: 9, background: `hsl(${OPERATORS[TRACE.operatorIdx].color})` }} />
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 800, color: TEXT, letterSpacing: "0.1em" }}>
                  {OPERATORS[TRACE.operatorIdx].role.toUpperCase()} · LIVE COMMIT
                </span>
              </div>
              <div className="rounded border px-2.5 py-2 mb-3 flex items-start gap-2"
                style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                <MessageSquare size={12} style={{ color: SUBTLE, marginTop: 2 }} />
                <span style={{ fontSize: 12, color: TEXT, fontStyle: "italic", lineHeight: 1.35 }}>
                  "{TRACE.prompt}"
                </span>
              </div>
              {[
                { n: "01", label: "Moment of work", text: "Override fires inside one operator's funnel.", c: SUBTLE, raw: true },
                { n: "02", label: "Promotion",      text: `LIZA proposes a new ${TRACE.primitive}: ${TRACE.update}.`, c: GOLD },
                { n: "03", label: "Knowledge base write", text: "Lead approves. Lands in shared knowledge base, versioned and audited.", c: GREEN },
                { n: "04", label: "Lateral re-entry", text: `Re-injected into ${TRACE.landsIn}. ${TRACE.timing}.`, c: GREEN },
              ].map((s, si) => (
                <div key={si} className="flex items-start gap-2 py-1.5">
                  <div className="rounded px-1.5 py-0.5 font-mono shrink-0"
                    style={{
                      fontSize: 9.5, fontWeight: 800,
                      color: s.raw ? SUBTLE : `hsl(${s.c})`,
                      background: s.raw ? CHROME_BG : `hsl(${s.c} / 0.12)`,
                    }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9.5, color: s.raw ? SUBTLE : `hsl(${s.c})`, fontWeight: 700 }}>{s.label}</div>
                    <p style={{ fontSize: 11.5, color: TEXT, lineHeight: 1.4 }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border-2 px-3 py-3"
              style={{ borderColor: `hsl(${GREEN} / 0.55)`, background: `hsl(${GREEN} / 0.08)` }}>
              <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.45 }}>
                <b style={{ color: `hsl(${GREEN})` }}>Every commit compounds.</b> Marginal cost per moment of work trends down as the knowledge base grows. Vision and hiring shape the funnels. Moments of work evolve them.
              </p>
            </div>

            {/* Operator picker — explicit clickable list, mirrors the funnel network */}
            <div className="rounded-xl border bg-white px-3 py-2.5"
              style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.14em] mb-1.5" style={{ fontSize: 10, color: SUBTLE }}>
                Try another operator
              </p>
              <div className="flex flex-wrap gap-1.5">
                {OPERATORS.map((op, i) => {
                  const sel = i === traceIdx;
                  return (
                    <button key={op.role}
                      onClick={() => { setMode("trace"); setTraceIdx(i); }}
                      className="rounded-full border px-2 py-1 transition-all"
                      style={{
                        fontSize: 10.5,
                        fontWeight: sel ? 800 : 600,
                        color: sel ? "white" : TEXT,
                        background: sel ? `hsl(${op.color})` : "white",
                        borderColor: sel ? `hsl(${op.color})` : `hsl(${op.color} / 0.35)`,
                      }}>
                      {op.role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-12 bottom-6 flex items-center gap-2 font-mono uppercase tracking-[0.14em]"
        style={{ fontSize: 10, color: SUBTLE }}>
        <span>next</span>
        <ArrowRight size={11} />
        <span style={{ color: TEXT, fontWeight: 700 }}>04 Compound. The governed console.</span>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 07e — THIS IS AACE, NOT RAG
// ═════════════════════════════════════════════════════════════════════════════
export function S07eAaceNotRag() {
  // 2-beat reveal: the argument is contrastive. Beat 1 shows ONLY the RAG path
  // so the audience sits with the failure mode. Beat 2 reveals the AACE column
  // alongside, making the comparison the actual punchline.
  const [revealed, setRevealed] = useState(2);
  const showAace = revealed >= 2;
  const PRIMITIVES = [
    { k: "Standard",    icon: Compass,       color: PURPLE, ex: "EU-first launches this quarter",          why: "Governs scope. Versioned. Auditable." },
    { k: "Procedure",   icon: Workflow,      color: ACCENT, ex: "3-step memo flow: draft → cite → review", why: "Executable, not described." },
    { k: "Preference",  icon: UserCheck,     color: GREEN,  ex: "Bullet-first. Drop hedging. DE English.", why: "Operator style learned and reused." },
    { k: "Prohibition", icon: ShieldCheck,   color: RED,    ex: "No PII to vendor models. Ever.",          why: "Hard block, not a suggestion." },
    { k: "Fact",        icon: Database,      color: GOLD,   ex: "Series-A deck v3.2 · last board update",  why: "Single source of truth. Pinned." },
    { k: "Skill",       icon: Sparkles,      color: GREEN,  ex: "Series-B narrative skill v3",             why: "Reusable. Composable. Compounds." },
  ];

  // Variable-width, distressed retrieved fragments. Each chunk has its own
  // similarity score, source label, a visual treatment (duplicated,
  // contradictory, stale) that mirrors how RAG actually behaves, and an
  // inline `promoteTo` annotation describing the typed AACE primitive the
  // same source becomes on the right side. Read at the source: no floating
  // bridge lines, the mapping lives on each chunk.
  const RAG_FRAGMENTS: {
    text: string; sim: string; src: string; w: number;
    tag?: "dup" | "stale" | "conflict" | "irrelevant";
    promoteTo: { k: string; verb: string; color: string };
  }[] = [
    { text: "…last quarter we shipped EU launches first because of…", sim: "0.82", src: "wiki/eu-launch.md",     w: 92,
      promoteTo: { k: "Standard",    verb: "typed + versioned", color: PURPLE } },
    { text: "…internal memo template circa 2023 mentions bullets…",   sim: "0.71", src: "templates/memo-2023",   w: 80, tag: "stale",
      promoteTo: { k: "Procedure",   verb: "made executable",   color: ACCENT } },
    { text: "…GDPR FAQ doc says vendors must be reviewed…",           sim: "0.68", src: "legal/gdpr-faq.pdf",    w: 86, tag: "irrelevant",
      promoteTo: { k: "Prohibition", verb: "enforced as block", color: RED } },
    { text: "…board update draft v2 references investor pipeline…",   sim: "0.66", src: "decks/board-q3-draft",  w: 74, tag: "dup",
      promoteTo: { k: "Fact",        verb: "deduped + pinned",  color: GOLD } },
    { text: "…board update draft v3 references investor pipeline…",   sim: "0.65", src: "decks/board-q3-final",  w: 76, tag: "dup",
      promoteTo: { k: "Fact",        verb: "deduped + pinned",  color: GOLD } },
    { text: "…sales handbook page 47 about pricing memo style…",      sim: "0.62", src: "handbook/p47",          w: 70, tag: "conflict",
      promoteTo: { k: "Preference",  verb: "resolved + owned",  color: GREEN } },
  ];

  const TAG_STYLE: Record<string, { label: string; color: string }> = {
    dup:        { label: "duplicate",   color: RED },
    stale:      { label: "stale 2023",  color: GOLD },
    conflict:   { label: "conflicts",   color: RED },
    irrelevant: { label: "off-intent",  color: SUBTLE },
  };

  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={10} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />

      <div className="relative z-10">
        <ArcStepper current={2} next="the org learns laterally" />
        <Tag label="The defence · this is not RAG, this is AACE" color={GREEN} />
        <h2 className="font-bold leading-[1.02] mb-2" style={{ fontSize: 58, color: TEXT, letterSpacing: "-0.028em", maxWidth: 1760 }}>
          <span style={{ color: `hsl(${GREEN})` }}>Skills compound.</span> <span style={{ color: `hsl(${RED})` }}>Chunks rent.</span>
        </h2>
        <p style={{ fontSize: 18, color: MUTED, maxWidth: 1640, marginBottom: 14 }}>
          A typed Skill is a versioned org asset written once and reused. A retrieved chunk is per-call rent, paid again on every prompt — and the model has to guess which chunks to trust.
        </p>

        {/* 2-beat reveal control — same pattern as Compile / Instrument */}
        <div className="flex items-center gap-3 mb-3 rounded-xl border px-3 py-2"
          style={{ borderColor: CHROME_BORDER, background: "white" }}>
          <button onClick={() => setRevealed(1)} disabled={revealed === 1}
            className="rounded-md border px-2 py-1 font-mono uppercase tracking-[0.12em] disabled:opacity-40"
            style={{ fontSize: 10, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}>prev</button>
          <div className="flex items-center gap-2">
            {[1, 2].map(n => {
              const on = n <= revealed;
              const c = n === 1 ? RED : GREEN;
              return (
                <button key={n} onClick={() => setRevealed(n)} title={`Beat ${n}`}
                  className="rounded-full transition-all"
                  style={{
                    width: on ? 22 : 10, height: 10,
                    background: on ? `hsl(${c})` : CHROME_BG,
                    border: `1px solid hsl(${on ? c : SUBTLE} / ${on ? 0.9 : 0.4})`,
                  }} />
              );
            })}
            <span className="font-mono uppercase tracking-[0.12em] ml-2" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700 }}>
              {revealed} / 2 beats
            </span>
          </div>
          <span style={{ fontSize: 12, color: TEXT, lineHeight: 1.35, flex: 1 }}>
            {revealed === 1
              ? "Beat 1 of 2. The RAG path. Sit with the failure mode: six chunks, two duplicates, one stale, one conflict — the model improvises the rest."
              : "Beat 2 of 2. The AACE path. Same prompt, typed primitives compiled from the knowledge graph. Provenance signed. Drift caught at the source."}
          </span>
          <button onClick={() => setRevealed(1)}
            className="rounded-md border px-2 py-1 font-mono uppercase tracking-[0.12em]"
            style={{ fontSize: 10, color: SUBTLE, borderColor: CHROME_BORDER, background: "white" }}>reset</button>
          <button onClick={() => setRevealed(2)} disabled={showAace}
            className={cn("rounded-md border px-3 py-1 font-mono uppercase tracking-[0.12em] disabled:opacity-40", !showAace && "animate-pulse")}
            style={{
              fontSize: 10, fontWeight: 800,
              color: showAace ? TEXT : "white",
              background: showAace ? CARD_ALT : `hsl(${GREEN})`,
              borderColor: showAace ? CHROME_BORDER : `hsl(${GREEN})`,
            }}>{showAace ? "fully revealed" : "reveal AACE ▸"}</button>
        </div>

        <div className="grid grid-cols-2 gap-10 relative">
          {/* LEFT — RAG path */}
          <div className="rounded-2xl border-2 p-5 flex flex-col"
            style={{ borderColor: `hsl(${RED} / 0.35)`, background: `hsl(${RED} / 0.03)`, height: 700 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 11, color: `hsl(${RED})`, fontWeight: 800 }}>
                RAG path · what the market ships
              </span>
            </div>

            {/* prompt */}
            <div className="rounded-lg border bg-white px-3 py-2 mb-2 flex items-center gap-2"
              style={{ borderColor: CHROME_BORDER }}>
              <MessageSquare size={14} style={{ color: SUBTLE }} />
              <span style={{ fontSize: 12, color: TEXT }}>"Draft the Series-B narrative for tomorrow's board."</span>
            </div>
            <div className="flex items-center justify-center py-1"><ArrowDown size={16} style={{ color: SUBTLE }} /></div>
            {/* vector search */}
            <div className="rounded-lg border bg-white px-3 py-2 mb-2"
              style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700 }}>Vector search</p>
              <p style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>Embeds the prompt. Returns top-k similar text chunks from a doc index.</p>
            </div>
            <div className="flex items-center justify-center py-1"><ArrowDown size={16} style={{ color: SUBTLE }} /></div>
            {/* chunks */}
            <div className="rounded-lg border bg-white p-2 flex-1 overflow-hidden"
              style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.12em] mb-1.5" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700 }}>
                Retrieved chunks · top-k by cosine similarity
              </p>
              <div className="space-y-1.5">
                {RAG_FRAGMENTS.map((c, i) => {
                  const tag = c.tag ? TAG_STYLE[c.tag] : null;
                  return (
                    <div key={i} className="rounded px-2 py-1.5 border relative"
                      style={{
                        width: `${c.w}%`,
                        marginLeft: i % 2 === 0 ? 0 : `${(100 - c.w) / 2}%`,
                        borderColor: `hsl(${RED} / 0.25)`,
                        background: `hsl(${RED} / 0.04)`,
                        opacity: c.tag === "stale" ? 0.55 : 0.95,
                      }}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono" style={{ fontSize: 8.5, color: SUBTLE, letterSpacing: "0.05em" }}>
                          sim {c.sim}
                        </span>
                        <span className="font-mono" style={{ fontSize: 8.5, color: SUBTLE }}>·</span>
                        <span className="font-mono" style={{ fontSize: 8.5, color: SUBTLE }}>{c.src}</span>
                        {tag && (
                          <span className="ml-auto rounded px-1 py-px font-mono uppercase tracking-[0.08em]"
                            style={{ fontSize: 8, fontWeight: 800, color: `hsl(${tag.color})`, background: `hsl(${tag.color} / 0.10)`, border: `1px solid hsl(${tag.color} / 0.35)` }}>
                            {tag.label}
                          </span>
                        )}
                      </div>
                      <span style={{
                        fontSize: 10.5,
                        color: MUTED,
                        fontStyle: "italic",
                        textDecoration: c.tag === "conflict" ? "line-through" : "none",
                      }}>"{c.text}"</span>
                      {/* Inline promotion annotation · read at the source.
                          Tells the reader exactly which typed AACE primitive
                          this fragment becomes on the right side. */}
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono uppercase tracking-[0.08em]"
                          style={{ fontSize: 8, color: SUBTLE, fontWeight: 700 }}>promotes to</span>
                        <ArrowRight size={9} style={{ color: SUBTLE }} />
                        <span className="font-mono uppercase tracking-[0.08em] rounded px-1.5 py-0.5"
                          style={{
                            fontSize: 8.5, fontWeight: 800,
                            color: `hsl(${c.promoteTo.color})`,
                            background: `hsl(${c.promoteTo.color} / 0.10)`,
                            border: `1px solid hsl(${c.promoteTo.color} / 0.45)`,
                          }}>
                          {c.promoteTo.k}
                        </span>
                        <span style={{ fontSize: 8.5, color: MUTED, fontStyle: "italic" }}>
                          {c.promoteTo.verb}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9, color: `hsl(${RED} / 0.85)`, fontWeight: 700 }}>
                6 chunks. 2 duplicates. 1 stale. 1 conflict. 1 off-intent. Model must guess.
              </p>
            </div>
            <div className="flex items-center justify-center py-1"><ArrowDown size={16} style={{ color: SUBTLE }} /></div>
            <div className="rounded-lg border-2 px-3 py-2"
              style={{ borderColor: `hsl(${RED} / 0.5)`, background: `hsl(${RED} / 0.06)` }}>
              <p style={{ fontSize: 12, color: `hsl(${RED})`, fontWeight: 700 }}>Model improvises the rest.</p>
              <p style={{ fontSize: 10.5, color: MUTED, marginTop: 2 }}>Stale on republish. No enforcement. Per-call rent. Unverifiable provenance. Drift compounds silently.</p>
            </div>
          </div>

          {/* RIGHT — AACE path (hidden until beat 2) */}
          {!showAace ? (
            <button onClick={() => setRevealed(2)}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center px-10 transition-all hover:scale-[1.01]"
              style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.04)`, height: 700 }}>
              <Sparkles size={36} style={{ color: `hsl(${GREEN})` }} />
              <p className="mt-4 font-bold" style={{ fontSize: 26, color: TEXT }}>The AACE path</p>
              <p className="mt-2" style={{ fontSize: 14, color: MUTED, maxWidth: 380 }}>
                Same prompt. Typed primitives compiled from the knowledge graph instead of retrieved chunks.
              </p>
              <span className="mt-5 font-mono uppercase tracking-[0.14em] rounded-md px-3 py-1.5 animate-pulse"
                style={{ fontSize: 11, fontWeight: 800, color: "white", background: `hsl(${GREEN})` }}>
                reveal ▸
              </span>
            </button>
          ) : (
          <div className="rounded-2xl border-2 p-5 flex flex-col"
            style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: `hsl(${GREEN} / 0.04)`, height: 700 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 11, color: `hsl(${GREEN})`, fontWeight: 800 }}>
                AACE path · what LIZA compiles
              </span>
            </div>

            <div className="rounded-lg border bg-white px-3 py-2 mb-2 flex items-center gap-2"
              style={{ borderColor: CHROME_BORDER }}>
              <MessageSquare size={14} style={{ color: SUBTLE }} />
              <span style={{ fontSize: 12, color: TEXT }}>"Draft the Series-B narrative for tomorrow's board."</span>
            </div>
            <div className="flex items-center justify-center py-1"><ArrowDown size={16} style={{ color: `hsl(${GREEN})` }} /></div>

            {/* Typed primitives compile */}
            <div className="rounded-lg border bg-white p-2.5 flex-1"
              style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.12em] mb-2" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700 }}>
                Typed AACE primitives · resolved from the knowledge graph
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {PRIMITIVES.map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.k} className="rounded border px-2 py-1.5"
                      style={{ borderColor: `hsl(${p.color} / 0.4)`, background: `hsl(${p.color} / 0.05)` }}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon size={11} style={{ color: `hsl(${p.color})` }} />
                        <span className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9.5, color: `hsl(${p.color})`, fontWeight: 800 }}>{p.k}</span>
                      </div>
                      <p style={{ fontSize: 10.5, color: TEXT, lineHeight: 1.3 }}>{p.ex}</p>
                      <p style={{ fontSize: 9.5, color: MUTED, lineHeight: 1.25, marginTop: 2 }}>{p.why}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center py-1"><ArrowDown size={16} style={{ color: `hsl(${GREEN})` }} /></div>

            {/* Compiled context object */}
            <div className="rounded-lg border bg-white px-3 py-2.5 mb-2"
              style={{ borderColor: `hsl(${GREEN} / 0.45)` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10, color: `hsl(${GREEN})`, fontWeight: 800 }}>Compiled context object</p>
                <span className="ml-auto font-mono" style={{ fontSize: 9.5, color: SUBTLE }}>ctx@v3.1 · signed · 6 primitives</span>
              </div>
              <pre className="rounded px-2 py-1.5 overflow-hidden"
                style={{ fontSize: 10, lineHeight: 1.4, color: TEXT, background: CARD_ALT, border: `1px solid hsl(${GREEN} / 0.2)`, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>
{`scope:        EU-first launches · Q4 thesis
procedure:    draft → cite → review (3-step memo)
voice:        bullet-first · no hedging
prohibit:     no PII to vendor models
facts:        Series-A deck v3.2 · last board update
skill:        series-b-narrative@v3 (reused 47×)`}
              </pre>
            </div>
            <div className="flex items-center justify-center py-0.5"><ArrowDown size={16} style={{ color: `hsl(${GREEN})` }} /></div>
            <div className="rounded-lg border-2 px-3 py-2"
              style={{ borderColor: `hsl(${GREEN} / 0.6)`, background: `hsl(${GREEN} / 0.08)` }}>
              <p style={{ fontSize: 12, color: `hsl(${GREEN})`, fontWeight: 700 }}>Governed output · five live audits before release.</p>
              <p style={{ fontSize: 10.5, color: MUTED, marginTop: 2 }}>Standards enforced. Prohibitions blocked. Skills reused. Provenance signed. Drift caught at the source.</p>
              {/* Handoff to slide 7: this output writes back to the knowledge base */}
              <div className="mt-2 pt-2 border-t flex items-center gap-1.5"
                style={{ borderColor: `hsl(${GREEN} / 0.25)` }}>
                <GitPullRequest size={11} style={{ color: `hsl(${GREEN})` }} />
                <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 9.5, color: `hsl(${GREEN})`, fontWeight: 700 }}>
                  writes back to knowledge base
                </span>
                <span style={{ fontSize: 10, color: MUTED }}>
                  the same compiled object becomes a reusable org primitive on the next slide.
                </span>
              </div>
            </div>
          </div>
          )}
        </div>

      </div>
      <div className="absolute right-12 bottom-6 flex items-center gap-2 font-mono uppercase tracking-[0.14em]"
        style={{ fontSize: 10, color: SUBTLE }}>
        <span>next</span>
        <ArrowRight size={11} />
        <span style={{ color: TEXT, fontWeight: 700 }}>03 Commit. Every moment writes back.</span>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — DECISION-CLASS CLASSIFIER (How tiering happens technically)
// ═════════════════════════════════════════════════════════════════════════════
function S08bClassifier() {
  const tiers = [
    {
      mult: "1×", label: "Operational Execution", color: GREEN,
      meter: "OD · Operational Decision",
      tag: "exec.*",
      scope: "Single artifact",
      blast: "Reversible · one workflow run",
      approver: "None or peer review",
      example: "exec.memo.draft · exec.meeting.summarise · exec.template.fill",
    },
    {
      mult: "5×", label: "Process Design & Governance", color: ACCENT,
      meter: "GC · Governed Change",
      tag: "governance.* · process.*",
      scope: "Standard · Playbook · Procedure (org rules)",
      blast: "Versioned · affects every future run",
      approver: "Senior owner sign-off",
      example: "governance.playbook.update · process.standard.publish · governance.drift.review",
    },
    {
      mult: "25×", label: "Strategic Simulation", color: PURPLE,
      meter: "SS · Strategic Simulation",
      tag: "strategy.* · simulation.*",
      scope: "No production write · scenario sandbox + memo",
      blast: "Informs investment · market · M&A",
      approver: "Partner / C-level",
      example: "strategy.pivot.wargame · simulation.thesis.stress · strategy.scenario.tree",
    },
  ];

  const signals = [
    { icon: GitBranch, label: "Playbook class tag", note: "Registry metadata on the locked Playbook" },
    { icon: FileText, label: "Write scope", note: "Artifact · Standard · Sandbox-only" },
    { icon: ShieldCheck, label: "Blast radius / reversibility", note: "Run-level · Org-level · Strategic" },
    { icon: Users, label: "Required approver role", note: "Peer · Senior · Partner" },
  ];

  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={10} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" color={GOLD} />
      <div className="relative z-10">
        <Tag label="Decision-Class Classifier · Runtime" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 50, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          How the system knows what tier this run belongs to. <span style={{ color: `hsl(${GOLD})` }}>Deterministically. At Sense. Before State-Lock.</span>
        </h2>
        <p style={{ fontSize: 18, color: MUTED, maxWidth: 1500, marginBottom: 20 }}>
          Tier is read off the locked Playbook's registry metadata. Not inferred from the prompt. Not a model judgement.
        </p>

        {/* Pipeline strip */}
        <div className="rounded-2xl border p-5 mb-5" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
          <div className="flex items-stretch gap-3">
            {/* Step 1 — Request */}
            <div className="flex-1 rounded-xl border bg-white px-4 py-3" style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>01 · Inbound</p>
              <div className="flex items-center gap-2 mt-1.5">
                <MessageSquare size={18} style={{ color: SUBTLE }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>User / agent request</p>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Intent + payload + actor role</p>
            </div>
            <div className="flex items-center"><ArrowRight size={22} style={{ color: SUBTLE }} /></div>

            {/* Step 2 — Sense */}
            <div className="flex-1 rounded-xl border bg-white px-4 py-3" style={{ borderColor: `hsl(${GREEN} / 0.4)` }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>02 · AACE Sense</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Radio size={18} style={{ color: `hsl(${GREEN})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>Intent classifier</p>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Selects candidate Playbook</p>
            </div>
            <div className="flex items-center"><ArrowRight size={22} style={{ color: SUBTLE }} /></div>

            {/* Step 3 — Registry lookup */}
            <div className="flex-1 rounded-xl border bg-white px-4 py-3" style={{ borderColor: `hsl(${GREEN} / 0.4)` }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>03 · Registry</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Database size={18} style={{ color: `hsl(${GREEN})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>Playbook metadata</p>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Reads class tag + 3 signals</p>
            </div>
            <div className="flex items-center"><ArrowRight size={22} style={{ color: `hsl(${GOLD})` }} /></div>

            {/* Step 4 — Classifier */}
            <div className="flex-1 rounded-xl border-2 px-4 py-3" style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.08)` }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: `hsl(${GOLD})` }}>04 · Classify</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Gauge size={18} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>Decision-class</p>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Deterministic rule, no LLM</p>
            </div>
            <div className="flex items-center"><ArrowRight size={22} style={{ color: SUBTLE }} /></div>

            {/* Step 5 — Route */}
            <div className="flex-1 rounded-xl border bg-white px-4 py-3" style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>05 · Meter</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Coins size={18} style={{ color: SUBTLE }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>Tier-priced unit</p>
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>OD · GC · SS written to ledger</p>
            </div>
          </div>
        </div>

        {/* Signal matrix */}
        <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: CHROME_BORDER, background: "white" }}>
          {/* Header row */}
          <div className="grid" style={{ gridTemplateColumns: "340px 1fr 1fr 1fr" }}>
            <div className="px-4 py-3" style={{ background: CARD_ALT, borderRight: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>Observable signal</p>
            </div>
            {tiers.map(t => (
              <div key={t.label} className="px-4 py-3" style={{ background: `hsl(${t.color} / 0.08)`, borderRight: `1px solid ${CHROME_BORDER}` }}>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold" style={{ fontSize: 20, color: `hsl(${t.color})`, lineHeight: 1 }}>{t.mult}</span>
                  <p className="font-bold" style={{ fontSize: 15, color: TEXT }}>{t.label}</p>
                </div>
                <p className="font-mono mt-1" style={{ fontSize: 11, color: `hsl(${t.color})` }}>{t.meter}</p>
              </div>
            ))}
          </div>

          {/* Signal rows */}
          {signals.map((sig, idx) => (
            <div key={sig.label} className="grid border-t" style={{ gridTemplateColumns: "340px 1fr 1fr 1fr", borderColor: CHROME_BORDER }}>
              <div className="px-4 py-3 flex items-start gap-2.5" style={{ background: CARD_ALT, borderRight: `1px solid ${CHROME_BORDER}` }}>
                <sig.icon size={16} style={{ color: SUBTLE, marginTop: 2 }} />
                <div>
                  <p className="font-semibold" style={{ fontSize: 14, color: TEXT, lineHeight: 1.2 }}>{sig.label}</p>
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 2, lineHeight: 1.25 }}>{sig.note}</p>
                </div>
              </div>
              {tiers.map(t => {
                const value = idx === 0 ? t.tag : idx === 1 ? t.scope : idx === 2 ? t.blast : t.approver;
                return (
                  <div key={t.label} className="px-4 py-3" style={{ borderRight: `1px solid ${CHROME_BORDER}` }}>
                    <p style={{ fontSize: idx === 0 ? 13 : 14, color: TEXT, lineHeight: 1.3, fontFamily: idx === 0 ? "ui-monospace, SFMono-Regular, monospace" : undefined }}>
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Example row */}
          <div className="grid border-t" style={{ gridTemplateColumns: "340px 1fr 1fr 1fr", borderColor: CHROME_BORDER }}>
            <div className="px-4 py-3" style={{ background: CARD_ALT, borderRight: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-semibold" style={{ fontSize: 14, color: TEXT }}>Example Playbook IDs</p>
              <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Real registry strings</p>
            </div>
            {tiers.map(t => (
              <div key={t.label} className="px-4 py-3" style={{ borderRight: `1px solid ${CHROME_BORDER}`, background: `hsl(${t.color} / 0.03)` }}>
                <p style={{ fontSize: 12, color: TEXT, lineHeight: 1.45, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>{t.example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing assertion */}
        <div className="mt-5 rounded-2xl border-2 px-6 py-4 flex items-center gap-4"
          style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.06)` }}>
          <Lock size={22} style={{ color: `hsl(${GOLD})` }} />
          <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-bold">Auditable by construction.</span> Every entry in the Rationale Log carries the locked_playbook_id, the class tag, and the meter unit. A CFO can defend the line item by naming the decision it bought.
          </p>
        </div>
      </div>
      <SlideBar from={GOLD} to={PURPLE} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — THE AUGMENTATION ENGINE
// ═════════════════════════════════════════════════════════════════════════════
function S09Augmentation() {
  const human = [
    "Creativity",
    "Self-awareness",
    "Ethical judgment",
    "Re-framing the future of the company",
  ];
  const system = [
    "Encoded senior decision-trees",
    "Governed Playbooks & Standards",
    "State-locked execution (AACE)",
    "Unified Rationale Log",
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={12} total={TOTAL} />
      <PhaseChip phase="Synthesis · Talent + Architecture" color={PURPLE} />
      <div className="relative z-10">
        <Tag label="The Augmentation Engine" color={PURPLE} />
        <h2 className="font-bold leading-[1.05] mb-10" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          We hire humans for what only humans bring. <span style={{ color: `hsl(${PURPLE})` }}>The system carries the rest.</span>
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Human column */}
          <div className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.05)`, minHeight: 460 }}>
            <div className="flex items-center gap-3 mb-4">
              <Users size={26} style={{ color: `hsl(${ACCENT})` }} />
              <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>Human contribution</p>
              <span className="font-mono uppercase tracking-[0.15em] ml-auto px-2 py-1 rounded"
                style={{ fontSize: 11, color: `hsl(${ACCENT})`, background: `hsl(${ACCENT} / 0.12)` }}>irreducible</span>
            </div>
            <p style={{ fontSize: 16, color: MUTED, marginBottom: 16 }}>
              What you hire a junior for. What no LLM provides.
            </p>
            <div className="flex flex-col gap-3">
              {human.map(h => (
                <div key={h} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border" style={{ borderColor: `hsl(${ACCENT} / 0.2)` }}>
                  <Sparkles size={18} style={{ color: `hsl(${ACCENT})` }} />
                  <p className="font-semibold" style={{ fontSize: 19, color: TEXT }}>{h}</p>
                </div>
              ))}
            </div>
            <p className="italic mt-5" style={{ fontSize: 14, color: MUTED }}>
              This is what re-imagines a business at the edge. See slide 2.
            </p>
          </div>

          {/* System column */}
          <div className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)`, minHeight: 460 }}>
            <div className="flex items-center gap-3 mb-4">
              <Brain size={26} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>System contribution</p>
              <span className="font-mono uppercase tracking-[0.15em] ml-auto px-2 py-1 rounded"
                style={{ fontSize: 11, color: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.12)` }}>encoded</span>
            </div>
            <p style={{ fontSize: 16, color: MUTED, marginBottom: 16 }}>
              What used to live in senior heads and eroded when they left.
            </p>
            <div className="flex flex-col gap-3">
              {system.map(s => (
                <div key={s} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border" style={{ borderColor: `hsl(${GREEN} / 0.2)` }}>
                  <Lock size={18} style={{ color: `hsl(${GREEN})` }} />
                  <p className="font-semibold" style={{ fontSize: 19, color: TEXT }}>{s}</p>
                </div>
              ))}
            </div>
            <p className="italic mt-5" style={{ fontSize: 14, color: MUTED }}>
              State-locked at execution. See slide 6. Auditable end to end. See slide 7.
            </p>
          </div>
        </div>

        {/* Bottom loop */}
        <div className="mt-8 rounded-2xl border-2 p-5" style={{ borderColor: `hsl(${PURPLE} / 0.4)`, background: `hsl(${PURPLE} / 0.05)` }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3" style={{ fontSize: 12, color: `hsl(${PURPLE})` }}>The compounding loop</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { l: "Junior intent", c: ACCENT },
              { l: "LIZA Playbook (state-locked)", c: PURPLE },
              { l: "Senior-quality artifact", c: GREEN },
              { l: "Junior internalises", c: ACCENT },
              { l: "Capability compounds", c: GOLD },
            ].map((n, i, arr) => (
              <div key={n.l} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg border-2 font-semibold whitespace-nowrap"
                  style={{ fontSize: 15, color: TEXT, borderColor: `hsl(${n.c} / 0.4)`, background: `hsl(${n.c} / 0.08)` }}>{n.l}</div>
                {i < arr.length - 1 && <ArrowRight size={18} style={{ color: SUBTLE }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={PURPLE} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — AUGMENTATION MECHANICS (Supervision + Edge Intake)
// ═════════════════════════════════════════════════════════════════════════════
export function S09bAugmentationMechanics() {
  const roles = [
    {
      role: "Junior (Day 1)", color: ACCENT, icon: GraduationCap,
      authors: "exec.* runs · Playbook PRs · edge.signals",
      autoMerge: "Operational artifacts only",
      gated: "Any write to governance.* or strategy.*",
      approver: "Senior owner of the Playbook",
    },
    {
      role: "Senior / Owner", color: GREEN, icon: UserCheck,
      authors: "governance.* updates · Playbook merges · standards",
      autoMerge: "Within their domain of ownership",
      gated: "Cross-domain changes · strategy.*",
      approver: "Partner / domain peer review",
    },
    {
      role: "Partner / C-level", color: PURPLE, icon: ShieldCheck,
      authors: "strategy.* scenarios · org-wide directives",
      autoMerge: "Sandbox simulations · directives",
      gated: "Production rollout of new standards",
      approver: "Council sign-off · logged in Rationale Log",
    },
  ];

  const intake = [
    { n: "01", icon: AlertTriangle, label: "Edge signal", note: "Junior flags exception, drift, or new pattern from the daily reality", color: ACCENT },
    { n: "02", icon: FileText, label: "Structured capture", note: "LIZA forms it into a typed delta against the relevant Playbook", color: PURPLE },
    { n: "03", icon: GitPullRequest, label: "Playbook PR", note: "Auto-routed to the senior owner with diff + supporting runs", color: PURPLE },
    { n: "04", icon: CheckCircle2, label: "Merge & lock", note: "Once approved, version bumps and every future run inherits it", color: GREEN },
  ];

  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={13} total={TOTAL} />
      <PhaseChip phase="Synthesis · Talent Architecture" color={PURPLE} />
      <div className="relative z-10">
        <Tag label="Augmentation Mechanics · How juniors operate inside a senior system" color={PURPLE} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 46, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          Junior intent, senior-quality output. <span style={{ color: `hsl(${PURPLE})` }}>Supervision is encoded, not scheduled.</span>
        </h2>
        <p style={{ fontSize: 17, color: MUTED, maxWidth: 1500, marginBottom: 18 }}>
          From day one, a junior can author runs, propose Playbook changes, and surface edge insights. What they cannot do is silently rewrite the system. Every elevation passes a deterministic gate.
        </p>

        {/* Supervised execution pipeline */}
        <div className="rounded-2xl border-2 p-5 mb-5" style={{ borderColor: `hsl(${PURPLE} / 0.3)`, background: `hsl(${PURPLE} / 0.04)` }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3" style={{ fontSize: 11, color: `hsl(${PURPLE})` }}>Supervised execution loop · per run</p>
          <div className="flex items-stretch gap-2">
            {[
              { n: "01", icon: MessageSquare, label: "Junior intent", note: "Free-form ask + role token", color: ACCENT },
              { n: "02", icon: Database, label: "Playbook scaffold", note: "Locked senior procedure loaded", color: PURPLE },
              { n: "03", icon: ShieldCheck, label: "Scope gate", note: "Write target checked vs role", color: GOLD },
              { n: "04", icon: Workflow, label: "AACE execution", note: "State-locked steps + tool calls", color: GREEN },
              { n: "05", icon: GitPullRequest, label: "Review hook", note: "Senior pinged on out-of-scope writes", color: PURPLE },
              { n: "06", icon: CheckCircle2, label: "Artifact + log", note: "Rationale Log records actor + gate", color: GREEN },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-stretch gap-2 flex-1">
                <div className="flex-1 rounded-xl border bg-white px-3 py-3" style={{ borderColor: `hsl(${s.color} / 0.4)` }}>
                  <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 10, color: `hsl(${s.color})` }}>{s.n}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <s.icon size={15} style={{ color: `hsl(${s.color})` }} />
                    <p className="font-bold" style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.15 }}>{s.label}</p>
                  </div>
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 4, lineHeight: 1.3 }}>{s.note}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center"><ArrowRight size={16} style={{ color: SUBTLE }} /></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1.15fr 1fr" }}>
          {/* Permission matrix */}
          <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: CHROME_BORDER, background: "white" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>Permission matrix · who can write what, auto vs gated</p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "150px 1fr 1fr 1fr" }}>
              {["Role", "Authors", "Auto-merge", "Gated · needs approver"].map((h, i) => (
                <div key={h} className="px-3 py-2 border-b" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, borderRight: i < 3 ? `1px solid ${CHROME_BORDER}` : undefined }}>
                  <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 10, color: SUBTLE }}>{h}</p>
                </div>
              ))}
              {roles.map((r, idx) => (
                <div key={r.role} className="contents">
                  <div className="px-3 py-3 flex items-center gap-2" style={{ background: `hsl(${r.color} / 0.06)`, borderRight: `1px solid ${CHROME_BORDER}`, borderBottom: idx < roles.length - 1 ? `1px solid ${CHROME_BORDER}` : undefined }}>
                    <r.icon size={16} style={{ color: `hsl(${r.color})` }} />
                    <p className="font-bold" style={{ fontSize: 13, color: TEXT, lineHeight: 1.15 }}>{r.role}</p>
                  </div>
                  <div className="px-3 py-3" style={{ borderRight: `1px solid ${CHROME_BORDER}`, borderBottom: idx < roles.length - 1 ? `1px solid ${CHROME_BORDER}` : undefined }}>
                    <p style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.3, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>{r.authors}</p>
                  </div>
                  <div className="px-3 py-3" style={{ borderRight: `1px solid ${CHROME_BORDER}`, borderBottom: idx < roles.length - 1 ? `1px solid ${CHROME_BORDER}` : undefined }}>
                    <p style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.3 }}>{r.autoMerge}</p>
                  </div>
                  <div className="px-3 py-3" style={{ borderBottom: idx < roles.length - 1 ? `1px solid ${CHROME_BORDER}` : undefined }}>
                    <p style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.3 }}>{r.gated}</p>
                    <p style={{ fontSize: 11, color: MUTED, marginTop: 3, lineHeight: 1.3 }}>→ {r.approver}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edge-insight intake */}
          <div className="rounded-2xl border-2 p-4" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.04)` }}>
            <div className="flex items-center gap-2 mb-3">
              <Send size={16} style={{ color: `hsl(${ACCENT})` }} />
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: `hsl(${ACCENT})` }}>Edge-insight intake · juniors as system designers</p>
            </div>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.4, marginBottom: 12 }}>
              The junior sits closest to the daily reality. New patterns, exceptions, and customer signals first appear at the edge. We capture them as typed deltas and route them for senior promotion.
            </p>
            <div className="flex flex-col gap-2">
              {intake.map((s, i, arr) => (
                <div key={s.n}>
                  <div className="flex items-start gap-3 rounded-lg bg-white border px-3 py-2.5" style={{ borderColor: `hsl(${s.color} / 0.3)` }}>
                    <div className="flex items-center justify-center rounded-md" style={{ width: 28, height: 28, background: `hsl(${s.color} / 0.12)` }}>
                      <s.icon size={15} style={{ color: `hsl(${s.color})` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono" style={{ fontSize: 10, color: `hsl(${s.color})` }}>{s.n}</span>
                        <p className="font-bold" style={{ fontSize: 13, color: TEXT, lineHeight: 1.15 }}>{s.label}</p>
                      </div>
                      <p style={{ fontSize: 11.5, color: MUTED, marginTop: 2, lineHeight: 1.35 }}>{s.note}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center py-0.5"><ArrowDown size={14} style={{ color: SUBTLE }} /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing assertion */}
        <div className="mt-5 rounded-2xl border-2 px-6 py-3.5 flex items-center gap-4"
          style={{ borderColor: `hsl(${PURPLE} / 0.5)`, background: `hsl(${PURPLE} / 0.06)` }}>
          <Lock size={20} style={{ color: `hsl(${PURPLE})` }} />
          <p style={{ fontSize: 15.5, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-bold">The org chart becomes a permission graph.</span> Seniority is no longer a meeting calendar. It is a signature on a Playbook. Juniors ship from day one; the system makes sure they ship at senior quality.
          </p>
        </div>
      </div>
      <SlideBar from={PURPLE} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — 2030 SKILLS · SOCIETAL IMPACT (Skill-Agent Layer + SDG telemetry)
// ═════════════════════════════════════════════════════════════════════════════
function S12SocietalImpact() {
  // Compact WEF 2030 core-skills quadrant (secondary proof, not the hero).
  const core2030 = [
    { x: 72, y: 88, label: "AI & big data" },
    { x: 56, y: 78, label: "Creative thinking" },
    { x: 78, y: 70, label: "Resilience & agility" },
    { x: 72, y: 60, label: "Analytical thinking" },
    { x: 58, y: 64, label: "Systems thinking" },
    { x: 62, y: 54, label: "Curiosity & learning" },
  ];

  const sdgs = [
    { n: "SDG 4",  label: "Quality Education",       color: RED },
    { n: "SDG 8",  label: "Decent Work & Growth",    color: ACCENT },
    { n: "SDG 9",  label: "Innovation & Infra",      color: GOLD },
    { n: "SDG 10", label: "Reduced Inequalities",    color: PURPLE },
  ];

  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={15} total={TOTAL} />
      <PhaseChip phase="Phase 4 · Societal Impact" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Knowledge Sovereignty · The Portable Career Graph" color={GREEN} />
        <h2 className="font-bold leading-[1.04] mb-3" style={{ fontSize: 46, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1770 }}>
          AI&apos;s missing layer: a knowledge graph the <span style={{ color: `hsl(${GREEN})` }}>human owns and carries</span>.
        </h2>
        <p className="mb-7" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          In the AI era, a person&apos;s career capital is the context graph they encode. LIZA is the infrastructure that lets humans own it, version it, and port it across employers. The consequence is measurable progress on the 2030 skills the WEF says will matter most.
        </p>

        <div className="grid grid-cols-[1.45fr_1fr] gap-8 items-start">
          {/* LEFT — Portability mechanism (the new hero) */}
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>
              Portable Context Bundle · signed to the individual
            </p>

            {/* Person node + Bundle + 3 orgs */}
            <div className="relative rounded-xl p-5" style={{ background: "white", border: `1px solid ${CHROME_BORDER}`, minHeight: 320 }}>
              {/* Person */}
              <div className="absolute" style={{ left: 18, top: "50%", transform: "translateY(-50%)", width: 150 }}>
                <div className="rounded-xl border-2 p-3 flex flex-col items-center text-center" style={{ borderColor: `hsl(${ACCENT} / 0.5)`, background: `hsl(${ACCENT} / 0.06)` }}>
                  <User size={22} style={{ color: `hsl(${ACCENT})` }} />
                  <p className="font-bold mt-1" style={{ fontSize: 13.5, color: TEXT }}>The Individual</p>
                  <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.3 }}>holds the signing key</p>
                </div>
              </div>

              {/* Bundle (center) */}
              <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 230 }}>
                <div className="rounded-xl border-2 p-3 text-center" style={{ borderColor: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.10)`, boxShadow: `0 6px 24px hsl(${GREEN} / 0.18)` }}>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Package size={16} style={{ color: `hsl(${GREEN})` }} />
                    <p className="font-mono font-bold" style={{ fontSize: 11, color: `hsl(${GREEN})`, letterSpacing: "0.1em" }}>CONTEXT BUNDLE</p>
                  </div>
                  <p className="font-bold" style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.25 }}>Playbooks · Skill-Agents · Decisions · Telemetry</p>
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: `hsl(${GREEN} / 0.3)` }}>
                    <KeyRound size={11} style={{ color: `hsl(${GREEN})` }} />
                    <span className="font-mono" style={{ fontSize: 10, color: MUTED }}>signed · versioned · exportable</span>
                  </div>
                </div>
              </div>

              {/* Arrows person ↔ bundle */}
              <div className="absolute" style={{ left: 172, top: "50%", transform: "translateY(-50%)" }}>
                <ArrowLeftRight size={20} style={{ color: `hsl(${ACCENT})` }} />
              </div>

              {/* Three orgs stacked right */}
              <div className="absolute flex flex-col gap-2.5" style={{ right: 18, top: 18, bottom: 18, width: 175, justifyContent: "space-between" }}>
                {[
                  { l: "Employer A · today",   sub: "deploys bundle", c: GOLD },
                  { l: "Employer B · next",    sub: "imports bundle", c: PURPLE },
                  { l: "Own venture · later",  sub: "forks bundle",   c: ACCENT },
                ].map(o => (
                  <div key={o.l} className="rounded-lg border p-2.5 flex items-center gap-2" style={{ borderColor: `hsl(${o.c} / 0.4)`, background: `hsl(${o.c} / 0.05)` }}>
                    <Building2 size={16} style={{ color: `hsl(${o.c})`, flexShrink: 0 }} />
                    <div>
                      <p className="font-semibold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{o.l}</p>
                      <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.2 }}>{o.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrows bundle → orgs */}
              <div className="absolute" style={{ right: 195, top: "50%", transform: "translateY(-50%)" }}>
                <ArrowRight size={20} style={{ color: SUBTLE }} />
              </div>
            </div>

            {/* Three guarantees */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { i: KeyRound,      t: "Person-owned",   s: "Signed to a user identity, not a tenant" },
                { i: FileSignature, t: "Standards-based", s: "Maps to WEF Global Skills Taxonomy" },
                { i: ArrowLeftRight,t: "Zero lock-in",   s: "Export · re-import · fork across orgs" },
              ].map(g => (
                <div key={g.t} className="rounded-lg border p-3" style={{ borderColor: CHROME_BORDER, background: "white" }}>
                  <g.i size={16} style={{ color: `hsl(${GREEN})` }} />
                  <p className="font-bold mt-1" style={{ fontSize: 12.5, color: TEXT }}>{g.t}</p>
                  <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.3 }}>{g.s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — WEF quadrant as proof + SDG outcomes */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border p-5" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 10.5, color: SUBTLE }}>
                Proof of alignment · WEF Future of Jobs 2025
              </p>
              <p className="mb-3" style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.35 }}>
                The skills the bundle exercises sit in the top-right quadrant: <span className="font-semibold" style={{ color: `hsl(${GREEN})` }}>Core Skills 2030</span>.
              </p>
              <div className="relative" style={{ width: "100%", height: 300, background: "white", borderRadius: 10, border: `1px solid ${CHROME_BORDER}` }}>
                <div className="absolute" style={{ left: "50%", top: 0, width: "50%", height: "50%", background: `hsl(${GREEN} / 0.08)` }} />
                <div className="absolute" style={{ left: "50%", top: 0, bottom: 0, width: 1, background: GRID_LINE }} />
                <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: 1, background: GRID_LINE }} />
                <p className="absolute font-semibold" style={{ top: 6, right: 10, fontSize: 10, color: `hsl(${GREEN})`, letterSpacing: "0.1em" }}>CORE 2030</p>
                {core2030.map(s => (
                  <div key={s.label} className="absolute" style={{ left: `${s.x}%`, top: `${100 - s.y}%`, transform: "translate(-50%, -50%)" }}>
                    <div className="rounded-full" style={{ width: 11, height: 11, background: `hsl(${GREEN})`, boxShadow: `0 0 0 4px hsl(${GREEN} / 0.18)` }} />
                    <p className="absolute whitespace-nowrap font-semibold" style={{ left: 16, top: -5, fontSize: 10.5, color: TEXT }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ borderColor: CHROME_BORDER, background: "white" }}>
              <p className="font-mono uppercase tracking-[0.15em] mb-3" style={{ fontSize: 10.5, color: SUBTLE }}>
                Outcomes, not claims · measured per bundle
              </p>
              <div className="flex flex-col gap-2">
                {sdgs.map(s => (
                  <div key={s.n} className="px-3 py-2 rounded-lg border flex items-center gap-2.5"
                    style={{ borderColor: `hsl(${s.color} / 0.35)`, background: `hsl(${s.color} / 0.06)` }}>
                    <Globe size={14} style={{ color: `hsl(${s.color})`, flexShrink: 0 }} />
                    <span className="font-mono font-bold" style={{ fontSize: 11, color: `hsl(${s.color})` }}>{s.n}</span>
                    <span style={{ fontSize: 12, color: TEXT }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 p-4" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.08)` }}>
              <p style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.4 }}>
                <span className="font-bold">For Research Impact Ventures:</span> we are the runtime layer for the WEF Global Skills Passport thesis. Knowledge stops being a hostage of the employer and becomes the individual&apos;s compounding asset.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ─── Deck registry ───────────────────────────────────────────────────────────


// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — UNIT ECONOMICS & SUSTAINABILITY (token-based model)
// ═════════════════════════════════════════════════════════════════════════════
export function S10UnitEconomics() {
  // Per-call trail: token envelope -> COGS (Cost Of Goods Sold) at public model prices ->
  // human work displaced at fully loaded hourly cost -> price as % of displaced cost -> margin.
  // Every term used on the slide is defined in the legend below.
  const tiers = [
    {
      mult: "1×", label: "Operational", color: GREEN,
      tokens: "15,000 input / 4,000 output",
      tokensWhy: "system prompt + locked Playbook + retrieved context + user ask, returning a structured answer",
      cogs: "$0.01 to $0.03",
      displaces: "15 to 30 min of mid-level analyst",
      displacesValue: "approx. €18 to €35  (loaded cost €70/hour)",
      price: "$0.30 to $0.60",
      pricePct: "3% or less of displaced human cost",
      margin: "90 to 95%",
    },
    {
      mult: "5×", label: "Design", color: ACCENT,
      tokens: "60,000 input / 18,000 output",
      tokensWhy: "deeper retrieval, multi-turn synthesis, longer artifact such as a published Playbook update",
      cogs: "$0.10 to $0.25",
      displaces: "1 to 2 hours of senior consultant",
      displacesValue: "approx. €140 to €280  (loaded cost €140/hour)",
      price: "$1.50 to $3.00",
      pricePct: "2% or less of displaced human cost",
      margin: "83 to 93%",
    },
    {
      mult: "25×", label: "Strategic", color: PURPLE,
      tokens: "250,000 input / 60,000 output",
      tokensWhy: "full case file, cross-document reasoning, partner-grade decision artifact",
      cogs: "$0.80 to $2.50",
      displaces: "half to one day of partner-grade work",
      displacesValue: "approx. €1,600 to €3,200  (loaded cost €400/hour)",
      price: "$8 to $14",
      pricePct: "1% or less of displaced human cost",
      margin: "80 to 90%",
    },
  ];
  const legend = [
    { k: "Token", v: "one word-piece processed by the model. Roughly 1 token = 0.75 English words." },
    { k: "Input / output tokens", v: "input = everything sent to the model (instructions + context + question). Output = what the model returns." },
    { k: "p50 / p95", v: "p50 = the typical run (median: half of runs are smaller, half are bigger). p95 = the rare heavy run (only 5% of runs are bigger). Used so the envelope reflects reality, not best-case." },
    { k: "$X / M tokens", v: "the model vendor's price for one million tokens. e.g. GPT-5 mini is $0.25 per million input tokens and $2 per million output tokens (Nov 2025 list prices)." },
    { k: "COGS", v: "Cost Of Goods Sold. Here = what we pay the model vendor per call, plus a small share of retrieval, evals and observability cost." },
    { k: "Loaded cost €X/hour", v: "fully loaded hourly cost of the human being replaced: salary + benefits + overhead, divided by productive hours. Not their billed rate." },
  ];
  const guards = [
    { k: "How the token envelope is built", v: "Input tokens = system prompt + locked Playbook + retrieved context (standards, prior artifacts) + user request. Output tokens = the structured artifact returned: decision, rationale chain, provenance. Envelopes shown are p50 (the typical run) measured from production traces. Each class has a hard ceiling enforced before the model is called (Operational $0.10, Design $0.60, Strategic $5.00), so even the p95 run cannot run away." },
    { k: "COGS uses public, auditable prices", v: "All COGS use the vendor's published per-million-token prices (Nov 2025): GPT-5 mini $0.25 input / $2 output per million; Gemini 2.5 Flash $0.30 / $2.50; Claude Sonnet 4.5 $3 / $15. Operational tier routes mostly to mini / Flash. Strategic tier blends Sonnet for partner-grade reasoning. Margins shown are execution-level; fully loaded margin (including retrieval, evals, observability, on-call) sits 5 to 8 points lower." },
    { k: "Price is anchored to human cost, not tokens", v: "Customer price is set as a small fraction of the fully loaded human cost displaced, not as a markup on tokens. The 1 : 5 : 25 ratio mirrors the loaded-cost-plus-leverage gap between junior, senior and partner work that every CFO already accepts. As inference prices fall over time, margin widens because price stays anchored to human value, not to COGS." },
    { k: "Every line item is verifiable from the bill", v: "Each call logs the envelope, the routed model and the COGS against the vendor's public price. The customer can audit any line item back to the decision class it bought. This is unique to intent-locked execution and impossible in seat-licence or free-form chat tools." },
  ];
  const valueLayers = [
    {
      n: "01", k: "Substitution value",
      mech: "Metered per call",
      v: "What the table above prices. Each call replaces a fraction of a human hour at known, verifiable cost. This is the floor.",
      color: GREEN,
    },
    {
      n: "02", k: "Collaboration value",
      mech: "Platform fee per team",
      v: "One standard, many operators. Every execution sharpens the Playbook, every team member inherits the upgrade, decisions become comparable across people. Not captured in any per-call meter.",
      color: ACCENT,
    },
    {
      n: "03", k: "Infrastructure value",
      mech: "Enterprise floor",
      v: "Standards-as-code, full audit trail, portability across models, regulatory defensibility, unit-economics governance for the CFO. The AI operating layer the org runs on. Removing it removes the OS.",
      color: GOLD,
    },
  ];
  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={11} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" color={GOLD} />
      <div className="relative z-10">
        <Tag label="Unit Economics · Sustainability" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 38, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1780 }}>
          Per-call math is the floor. <span style={{ color: `hsl(${GOLD})` }}>The business is built on three value layers, priced three ways.</span>
        </h2>
        {/* Legend strip: define every piece of jargon used on the slide */}
        <div className="rounded-lg border bg-white px-4 py-2.5 mb-3" style={{ borderColor: CHROME_BORDER }}>
          <div className="grid grid-cols-6 gap-x-4 gap-y-1">
            {legend.map(l => (
              <div key={l.k}>
                <p className="font-mono uppercase tracking-[0.08em]" style={{ fontSize: 9, color: `hsl(${GOLD})` }}>{l.k}</p>
                <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.3 }}>{l.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-6 items-start">
          <div className="rounded-2xl border-2 p-4" style={{ borderColor: `hsl(${GOLD} / 0.4)`, background: `hsl(${GOLD} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 11, color: `hsl(${GOLD})` }}>Per-execution gross margin · verifiable from public model prices</p>
            <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
              <div className="grid grid-cols-[0.85fr_1.15fr_0.75fr_1.25fr_0.95fr_0.55fr] gap-0 px-3 py-2 font-mono uppercase tracking-[0.08em]"
                style={{ fontSize: 9.5, color: SUBTLE, background: CARD_ALT, borderBottom: `1px solid ${CHROME_BORDER}` }}>
                <span>Class</span><span>Token envelope · typical (p50)</span><span>COGS / call</span><span>Human work displaced</span><span>Price / call</span><span>Margin</span>
              </div>
              {tiers.map(t => (
                <div key={t.label} className="grid grid-cols-[0.85fr_1.15fr_0.75fr_1.25fr_0.95fr_0.55fr] gap-0 px-3 py-2.5 items-start"
                  style={{ borderBottom: `1px solid ${CHROME_BORDER}` }}>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold font-mono" style={{ fontSize: 17, color: `hsl(${t.color})` }}>{t.mult}</span>
                      <span className="font-semibold" style={{ fontSize: 12.5, color: TEXT }}>{t.label}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold" style={{ fontSize: 11.5, color: TEXT, lineHeight: 1.2 }}>{t.tokens}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{t.tokensWhy}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: 11.5, color: MUTED }}>{t.cogs}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold" style={{ fontSize: 11.5, color: TEXT, lineHeight: 1.25 }}>{t.displaces}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{t.displacesValue}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold" style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.2 }}>{t.price}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{t.pricePct}</span>
                  </div>
                  <span className="font-bold" style={{ fontSize: 13.5, color: `hsl(${GREEN})` }}>{t.margin}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg px-4 py-3" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px dashed hsl(${GREEN} / 0.35)` }}>
              <p className="font-mono uppercase tracking-[0.1em] mb-1" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>Worked example · one Operational call (1×)</p>
              <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5 }}>
                The model receives 15,000 input tokens and returns 4,000 output tokens. Routed to GPT-5 mini at vendor list price ($0.25 per 1,000,000 input tokens, $2 per 1,000,000 output tokens): <span className="font-mono">15,000 × $0.25 / 1,000,000 + 4,000 × $2 / 1,000,000</span> = <span className="font-mono font-semibold" style={{ color: TEXT }}>$0.012</span> in model cost. Add roughly <span className="font-mono">$0.008</span> for retrieval, evaluation and observability, and the fully loaded cost of the call is <span className="font-mono font-semibold" style={{ color: TEXT }}>$0.020</span>. We charge the customer <span className="font-mono font-semibold" style={{ color: TEXT }}>$0.40</span>. That call replaces about 20 minutes of a mid-level analyst whose fully loaded cost is €70/hour, so it removes roughly <span className="font-mono font-semibold" style={{ color: TEXT }}>€23</span> of human work. The customer pays about <span className="font-mono">1.6%</span> of what they save; we keep <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>around 95% fully loaded gross margin</span> on the call.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>Sustainability guards · why these numbers hold</p>
            {guards.map(g => (
              <div key={g.k} className="rounded-xl border bg-white px-4 py-2.5" style={{ borderColor: CHROME_BORDER }}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={15} style={{ color: `hsl(${GREEN})` }} />
                  <p className="font-bold" style={{ fontSize: 13, color: TEXT }}>{g.k}</p>
                </div>
                <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{g.v}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Three value layers → three pricing mechanics. This is the business-model reframe. */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>Why we are not pure-metered · three value layers, three pricing mechanics</p>
            <p style={{ fontSize: 11, color: SUBTLE, fontStyle: "italic" }}>The table above prices Layer 01. Layers 02 and 03 are where the platform fee and enterprise floor sit.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {valueLayers.map(l => (
              <div key={l.k} className="rounded-xl border-2 p-3.5" style={{ borderColor: `hsl(${l.color} / 0.4)`, background: `hsl(${l.color} / 0.05)` }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${l.color})` }}>{l.n}</span>
                  <p className="font-bold" style={{ fontSize: 14, color: TEXT }}>{l.k}</p>
                </div>
                <p className="font-mono uppercase tracking-[0.1em] mb-1.5" style={{ fontSize: 10, color: `hsl(${l.color})` }}>Priced as: {l.mech}</p>
                <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.4 }}>{l.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — HYPERSCALER RISK & RETURN PATHS
// ═════════════════════════════════════════════════════════════════════════════
function S11HyperscalerRisk() {
  // Nuanced spectrum (Nov 2025) — corrects the assumption that workflow suites are seat-only.
  // Most of the landscape is already moving to metered / consumption pricing. Our wedge is NOT
  // the billing model; it is standards-locked, decision-class-accountable, portable execution.
  const bands = [
    {
      l: "Frontier model labs",
      examples: "OpenAI · Anthropic · Google DeepMind · Mistral",
      risk: 10, posture: "Supplier",
      color: GREEN,
      v: "Race is at the model layer; pure per-token APIs. Org-specific standards + portable execution graph is anti-pattern to their universal-abstraction bet. We consume them and swap models per Playbook step.",
    },
    {
      l: "Hyperscaler workflow suites",
      examples: "MSFT Copilot Studio · Google Agentspace · AWS Bedrock Agents",
      risk: 55, posture: "Channel · partial overlap",
      color: ACCENT,
      v: "Already metered, not seat-only. Copilot Studio runs on pay-as-you-go Copilot Credits + prepaid capacity packs; Bedrock Agents is pure consumption; Agentspace bills per query. The gap is not the billing model — they meter compute, we meter decisions against a locked standard. Distribution partner first, overlap on horizontal internal-agent use cases.",
    },
    {
      l: "Enterprise control-tower platforms",
      examples: "ServiceNow AI Control Tower · Salesforce Agentforce · SAP Joule",
      risk: 75, posture: "Direct overlap · coopetition",
      color: GOLD,
      v: "Hottest zone. ServiceNow + Microsoft (Nov 2025) bet governance + orchestration is where platform value sits; Agentforce charges per conversation. They win inside their own data estate, but every standard authored there is locked to their record model. LIZA's wedge: standards-as-code above any one system of record, portable across stacks.",
    },
    {
      l: "Adjacent peers · capture, memory, retrieval",
      examples: "Established: Glean (FlexCredits) · Writer (per-token API)   ·   Early-stage: Mem0 · Interloom · Edra · Paradox.ai",
      risk: 25, posture: "Adjacent · feeders",
      color: GREEN,
      v: "They sit beside the work: capture tacit knowledge (Interloom, Edra), persist memory across sessions (Mem0), index documents (Glean), or wrap a vertical LLM (Writer, Paradox.ai). LIZA sits inside the work as the runtime that orchestrates action against a locked standard and closes the learning loop on every execution. Edra/Mem0/Interloom/Paradox are early Series A with thin published surface — closer to upstream feeders or future acquisitions than head-to-head competitors.",
    },
    {
      l: "Productized Big-4 / advisory AI",
      examples: "Deloitte Zora · PwC agent OS · McKinsey Lilli · KPMG Clara",
      risk: 65, posture: "Coopetition · channel partner",
      color: GOLD,
      v: "Moving off pure billable hours into productized agents priced per outcome or per engagement. Likely buyers, OEM partners, or implementation channels — competitors only when they push generic horizontal agents. Differentiator: our standards layer is portable and client-owned; theirs is locked to their delivery brand.",
    },
  ];
  const returns = [
    { k: "Strategic acquisition", v: "ServiceNow / Salesforce / Microsoft buying governance depth; Big-4 buying delivery leverage as billable-hour model compresses.", icon: HeartHandshake, color: ACCENT },
    { k: "OEM / white-label", v: "AACE compiler licensed inside larger workflow suites or Big-4 productized stacks under revenue-share.", icon: Package, color: PURPLE },
    { k: "Vertical roll-up", v: "Pharma & regulated industries first. Cash-flow positive vertical SaaS economics from year 2; defensible per-vertical standards library.", icon: Boxes, color: GREEN },
    { k: "Platform IPO", v: "Category-defining 'AI unit-economics layer' once metered consumption is universal (2027+ inflection).", icon: LineChart, color: GOLD },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={14} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" color={GOLD} />
      <div className="relative z-10">
        <Tag label="Hyperscaler Risk · Return Paths" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 46, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          Most named "competitors" sit beside the work. <span style={{ color: `hsl(${GOLD})` }}>LIZA sits inside it: orchestrating action against a locked standard and learning from every execution.</span>
        </h2>
        <div className="grid grid-cols-[1.35fr_1fr] gap-8 items-start">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>Competitive risk · low → high</p>
              <div className="flex items-center gap-2 font-mono uppercase tracking-[0.1em]" style={{ fontSize: 10, color: SUBTLE }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: `hsl(${GREEN})` }} />Supplier
                <span className="inline-block w-2 h-2 rounded-full ml-2" style={{ background: `hsl(${ACCENT})` }} />Channel
                <span className="inline-block w-2 h-2 rounded-full ml-2" style={{ background: `hsl(${GOLD})` }} />Overlap
              </div>
            </div>
            <div className="space-y-2">
              {bands.map(b => (
                <div key={b.l} className="rounded-xl border bg-white px-4 py-2.5" style={{ borderColor: CHROME_BORDER }}>
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold" style={{ fontSize: 14, color: TEXT, lineHeight: 1.2 }}>{b.l}</p>
                      <p className="font-mono" style={{ fontSize: 10, color: SUBTLE, lineHeight: 1.3, marginTop: 1 }}>{b.examples}</p>
                    </div>
                    <span className="font-mono uppercase tracking-[0.08em] whitespace-nowrap" style={{ fontSize: 9.5, color: `hsl(${b.color})`, fontWeight: 700 }}>{b.posture}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 mb-1">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: `hsl(${b.color} / 0.12)` }}>
                      <div className="h-full rounded-full" style={{ width: `${b.risk}%`, background: `linear-gradient(90deg, hsl(${GREEN}), hsl(${b.color}))` }} />
                    </div>
                    <span className="font-mono font-bold" style={{ fontSize: 11, color: `hsl(${b.color})`, width: 32, textAlign: "right" }}>{b.risk}%</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.35 }}>{b.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>Return optionality</p>
            {returns.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.k} className="rounded-xl border-2 px-4 py-3"
                  style={{ borderColor: `hsl(${r.color} / 0.4)`, background: `hsl(${r.color} / 0.05)` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} style={{ color: `hsl(${r.color})` }} />
                    <p className="font-bold" style={{ fontSize: 15, color: TEXT }}>{r.k}</p>
                  </div>
                  <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>{r.v}</p>
                </div>
              );
            })}
            <p style={{ fontSize: 11, color: SUBTLE, lineHeight: 1.4, marginTop: 4 }}>
              Risk %'s are competitive-overlap weights, not market-share forecasts — calibrated against announced product scope (Nov 2025).
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={RED} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 11a — THE SCISSORS · token prices fall, customer AI bills rise
// ═════════════════════════════════════════════════════════════════════════════
function S10aScissors() {
  // Two opposing curves: vendor $/Mtok falling, enterprise AI spend per knowledge worker rising.
  // LIZA cuts through the middle: value floor (priced to displaced human work) +
  // efficiency ceiling (governed context compile keeps the bill flat-to-declining).
  const years = ["2023", "2024", "2025", "2026 E", "2027 E"];
  // Indexed to 100 at 2023 for visual clarity. Sources cited in footer.
  const vendorPrice = [100, 42, 18, 9, 5];          // $/M tokens for frontier-grade output
  const ungovernedBill = [100, 165, 240, 330, 440]; // ungoverned enterprise AI spend per knowledge worker
  const governedBill   = [100, 95, 88, 82, 78];     // LIZA-governed spend per knowledge worker
  const chartW = 760, chartH = 280, padL = 44, padR = 16, padT = 14, padB = 28;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const yMax = 460;
  const xAt = (i: number) => padL + (i / (years.length - 1)) * innerW;
  const yAt = (v: number) => padT + innerH - (v / yMax) * innerH;
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ");
  const bandPath = `${path(vendorPrice)} L ${xAt(years.length - 1).toFixed(1)} ${yAt(ungovernedBill[years.length - 1]).toFixed(1)} ${[...ungovernedBill].reverse().map((v, i) => `L ${xAt(years.length - 1 - i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ")} Z`;

  const legend = [
    { k: "Token", v: "one word-piece the model processes. 1 token ≈ 0.75 English words." },
    { k: "$/M tokens", v: "vendor list price per one million tokens (input + output blended at typical 4:1 ratio, frontier-grade output, indexed to 2023 = 100)." },
    { k: "Ungoverned bill", v: "enterprise AI spend per knowledge worker when teams paste full documents, run agentic loops and stack RAG without a budget gate. Indexed to 2023 = 100. Pattern reported across hyperscaler and analyst guidance (Microsoft, a16z, Menlo Ventures 2024-25)." },
    { k: "Governed bill", v: "same workload run through LIZA: each call is locked to a decision class with a hard COGS ceiling (Op $0.10 · Design $0.60 · Strategic $5.00) and a compiled minimum-sufficient context, not the maximum available." },
    { k: "Decision class", v: "Operational (1×) · Design (5×) · Strategic (25×). Set before the model is called. Determines which model is routed and the maximum spend per call." },
    { k: "Context compile", v: "AACE assembles only the standards, prior artifacts and user input that the locked Playbook step actually needs. Replaces blind RAG, which retrieves everything that looks similar." },
  ];

  const pillars = [
    {
      n: "01", k: "Value floor", color: GREEN,
      mech: "Price anchored to displaced human work",
      v: "Customer price is a small fraction of the loaded human cost the call removes (Slide 10: 1-3% of displaced cost). As inference prices fall, this floor does not move. Margin widens for us; price stays defensible for the buyer because it is a fraction of work removed, not a markup on tokens.",
    },
    {
      n: "02", k: "Efficiency ceiling", color: ACCENT,
      mech: "Governed context compile + per-class spend cap",
      v: "Every call passes through AACE: only the standards and artifacts the locked Playbook step needs are compiled in, and a hard COGS ceiling is enforced before the model is called. The customer cannot accidentally pay for a 250K-token agentic loop on an Operational question.",
    },
    {
      n: "03", k: "Governance is the mechanism", color: GOLD,
      mech: "Decision class + Playbook lock + auditable line items",
      v: "Both the floor and the ceiling exist because every call is intent-locked to a decision class and a Playbook version. Free-form chat and seat licences cannot price this way; they have no unit of work to price against and no gate to enforce.",
    },
  ];

  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={12} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" color={GOLD} />
      <div className="relative z-10">
        <Tag label="Cost Dynamics · The Scissors" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 38, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1780 }}>
          Token prices are falling. Customer AI bills are rising. <span style={{ color: `hsl(${GOLD})` }}>LIZA cuts through the middle.</span>
        </h2>
        <p className="mb-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35, maxWidth: 1500 }}>
          Vendors keep cutting per-token prices, yet enterprise AI spend per knowledge worker keeps climbing because teams paste larger documents, chain longer agentic loops and stack retrieval without a gate. We price to the human work removed (so our margin holds as inference gets cheaper) and we govern the context compile (so the customer's bill stays flat to declining). The two opposing curves close into a defensible operating band.
        </p>

        {/* Legend strip — define every term used on the chart */}
        <div className="rounded-lg border bg-white px-4 py-2.5 mb-3" style={{ borderColor: CHROME_BORDER }}>
          <div className="grid grid-cols-6 gap-x-4 gap-y-1">
            {legend.map(l => (
              <div key={l.k}>
                <p className="font-mono uppercase tracking-[0.08em]" style={{ fontSize: 9, color: `hsl(${GOLD})` }}>{l.k}</p>
                <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.3 }}>{l.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1.15fr_1fr] gap-6 items-start">
          {/* Chart panel */}
          <div className="rounded-2xl border-2 p-4" style={{ borderColor: `hsl(${GOLD} / 0.4)`, background: `hsl(${GOLD} / 0.05)` }}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: `hsl(${GOLD})` }}>The scissors · indexed to 2023 = 100</p>
              <p style={{ fontSize: 10.5, color: SUBTLE, fontStyle: "italic" }}>Lower vendor price · higher ungoverned bill · flat governed bill</p>
            </div>
            <div className="rounded-xl bg-white border p-3" style={{ borderColor: CHROME_BORDER }}>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                {/* y gridlines */}
                {[0, 100, 200, 300, 400].map(g => (
                  <g key={g}>
                    <line x1={padL} x2={chartW - padR} y1={yAt(g)} y2={yAt(g)} stroke={CHROME_BORDER} strokeWidth={1} strokeDasharray={g === 100 ? "" : "2 3"} />
                    <text x={padL - 6} y={yAt(g) + 3} textAnchor="end" fontSize={9} fill={SUBTLE} fontFamily="monospace">{g}</text>
                  </g>
                ))}
                {/* x labels */}
                {years.map((y, i) => (
                  <text key={y} x={xAt(i)} y={chartH - 8} textAnchor="middle" fontSize={10} fill={MUTED} fontFamily="monospace">{y}</text>
                ))}
                {/* Divergence band between vendor price and ungoverned bill */}
                <path d={bandPath} fill={`hsl(${RED} / 0.07)`} stroke="none" />
                {/* Governed band shading around governed line */}
                <path
                  d={`${path(governedBill.map(v => v + 15))} L ${xAt(years.length - 1)} ${yAt(governedBill[governedBill.length - 1] - 15)} ${[...governedBill].reverse().map((v, i) => `L ${xAt(years.length - 1 - i)} ${yAt(v - 15)}`).join(" ")} Z`}
                  fill={`hsl(${GREEN} / 0.10)`} stroke="none"
                />
                {/* Lines */}
                <path d={path(ungovernedBill)} fill="none" stroke={`hsl(${RED})`} strokeWidth={2.2} />
                <path d={path(vendorPrice)} fill="none" stroke={`hsl(${ACCENT})`} strokeWidth={2.2} />
                <path d={path(governedBill)} fill="none" stroke={`hsl(${GREEN})`} strokeWidth={2.6} />
                {/* Endpoints labels */}
                {ungovernedBill.map((v, i) => i === ungovernedBill.length - 1 && (
                  <g key="u">
                    <circle cx={xAt(i)} cy={yAt(v)} r={3} fill={`hsl(${RED})`} />
                    <text x={xAt(i) - 6} y={yAt(v) - 6} textAnchor="end" fontSize={10} fontWeight={700} fill={`hsl(${RED})`}>Ungoverned · 440</text>
                  </g>
                ))}
                {vendorPrice.map((v, i) => i === vendorPrice.length - 1 && (
                  <g key="v">
                    <circle cx={xAt(i)} cy={yAt(v)} r={3} fill={`hsl(${ACCENT})`} />
                    <text x={xAt(i) - 6} y={yAt(v) + 14} textAnchor="end" fontSize={10} fontWeight={700} fill={`hsl(${ACCENT})`}>Vendor $/Mtok · 5</text>
                  </g>
                ))}
                {governedBill.map((v, i) => i === governedBill.length - 1 && (
                  <g key="g">
                    <circle cx={xAt(i)} cy={yAt(v)} r={3.5} fill={`hsl(${GREEN})`} />
                    <text x={xAt(i) - 6} y={yAt(v) - 6} textAnchor="end" fontSize={10} fontWeight={700} fill={`hsl(${GREEN})`}>LIZA-governed · 78</text>
                  </g>
                ))}
                {/* Legend chips */}
                <g transform={`translate(${padL + 4}, ${padT + 6})`}>
                  <rect width="6" height="6" fill={`hsl(${ACCENT})`} y="2" />
                  <text x="12" y="8" fontSize="9.5" fill={MUTED}>Vendor list price ($/M tokens)</text>
                  <rect width="6" height="6" fill={`hsl(${RED})`} y="16" />
                  <text x="12" y="22" fontSize="9.5" fill={MUTED}>Ungoverned enterprise AI bill / knowledge worker</text>
                  <rect width="6" height="6" fill={`hsl(${GREEN})`} y="30" />
                  <text x="12" y="36" fontSize="9.5" fill={MUTED}>LIZA-governed bill / knowledge worker</text>
                </g>
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${ACCENT} / 0.07)`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
                <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9, color: `hsl(${ACCENT})` }}>Vendor price · 2023 → 2027 E</p>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>100 → 5  <span style={{ fontSize: 11, color: SUBTLE, fontWeight: 400 }}>(≈ 20× cheaper)</span></p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${RED} / 0.07)`, border: `1px solid hsl(${RED} / 0.25)` }}>
                <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9, color: `hsl(${RED})` }}>Ungoverned bill · 2023 → 2027 E</p>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>100 → 440  <span style={{ fontSize: 11, color: SUBTLE, fontWeight: 400 }}>(≈ 4.4× more)</span></p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
                <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9, color: `hsl(${GREEN})` }}>LIZA-governed · 2023 → 2027 E</p>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>100 → 78  <span style={{ fontSize: 11, color: SUBTLE, fontWeight: 400 }}>(≈ 22% lower)</span></p>
              </div>
            </div>
          </div>

          {/* Three pillars panel */}
          <div className="flex flex-col gap-2.5">
            <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>How the scissors close · three pillars</p>
            {pillars.map(p => (
              <div key={p.k} className="rounded-xl border-2 px-4 py-3" style={{ borderColor: `hsl(${p.color} / 0.4)`, background: `hsl(${p.color} / 0.05)` }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${p.color})` }}>{p.n}</span>
                  <p className="font-bold" style={{ fontSize: 14, color: TEXT }}>{p.k}</p>
                </div>
                <p className="font-mono uppercase tracking-[0.1em] mb-1.5" style={{ fontSize: 10, color: `hsl(${p.color})` }}>Mechanism: {p.mech}</p>
                <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.4 }}>{p.v}</p>
              </div>
            ))}
            <div className="rounded-xl px-4 py-3" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px dashed hsl(${GOLD} / 0.4)` }}>
              <div className="flex items-center gap-2 mb-1">
                <Scissors size={15} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-bold" style={{ fontSize: 13, color: TEXT }}>Net commercial position</p>
              </div>
              <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.45 }}>
                Pure-metered vendors get squeezed as token prices fall. Seat-licence vendors get squeezed as buyers refuse to keep paying for unused seats. We are anchored above the falling COGS line and below the rising ungoverned-spend line, so the gap between what the customer would otherwise pay and what we charge widens every year. That gap is the wedge.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 font-mono" style={{ fontSize: 10, color: SUBTLE }}>
          Index basis 2023 = 100. Vendor curve: blended frontier-grade output $/M tokens (OpenAI, Anthropic, Google list prices, Nov 2025). Ungoverned curve: pattern of enterprise AI spend growth per knowledge worker reported by Microsoft Work Trend Index, a16z &amp; Menlo Ventures Enterprise AI surveys 2024-25. Governed curve: LIZA modelled outcome with decision-class caps + compiled context. 2026-27 figures are estimates (E).
        </p>
      </div>
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 11b — ACV BRIDGE · top-down meets bottom-up
// ═════════════════════════════════════════════════════════════════════════════
function S10bACVBridge() {
  // Bridges the per-call unit economics (Slide 10) to the three top-down ACV targets
  // ($40K small, $120-150K mid, $250K enterprise). Two halves: bottom-up seat build, then
  // top-down segment build, then a single reconciliation row showing they meet in the middle.
  const seatBuild = [
    {
      profile: "Light seat", color: SUBTLE,
      who: "Occasional operator. About 1 Operational call per workday, a Design call every two weeks, a Strategic run once a quarter.",
      opPerDay: "≈ 1 / workday",
      designPerDay: "≈ 1 / 2 weeks",
      stratPerDay: "≈ 1 / quarter",
      op: 220, design: 20, strat: 2,
      revenue: "~$165 / seat / year",
    },
    {
      profile: "Standard seat", color: ACCENT,
      who: "Daily operator inside a Playbook. About 5 Operational calls per workday, a Design call most workdays, a Strategic run every 6 weeks.",
      opPerDay: "≈ 5 / workday",
      designPerDay: "≈ 1 / 3 days",
      stratPerDay: "≈ 1 / 6 weeks",
      op: 1_100, design: 80, strat: 8,
      revenue: "~$760 / seat / year",
    },
    {
      profile: "Heavy / Strategic seat", color: PURPLE,
      who: "Power user or analyst pod. About 10 Operational calls per workday, a Design call every workday, a Strategic run every 2 weeks.",
      opPerDay: "≈ 10 / workday",
      designPerDay: "≈ 1 / workday",
      stratPerDay: "≈ 1 / 2 weeks",
      op: 2_200, design: 200, strat: 20,
      revenue: "~$1,660 / seat / year",
    },
  ];
  // Prices used (mid of Slide 10 bands): Op $0.45, Design $2.25, Strategic $11
  const segments = [
    {
      seg: "Small / team wedge",
      acv: "$40K",
      color: GREEN,
      who: "20-50 person company, one department live on a few Playbooks.",
      platform: 15_000,
      platformWhy: "fixed annual access fee (Layer 02 + 03): standards, governance, audit trail",
      seats: "20 standard seats × ~$760",
      seatsValue: 15_200,
      strat: "≈ 700 Strategic runs/yr × ~$11 (shared across the org)",
      stratValue: 8_000,
      total: "≈ $38-45K",
      check: "≈ 25 partner-day-equivalents of senior work displaced per year (1 partner-day-equivalent ≈ €1,600 of fully loaded partner time).",
    },
    {
      seg: "Mid-market",
      acv: "$120-150K",
      color: ACCENT,
      who: "200-1,000 person company, 2-3 departments live, one Strategic pod.",
      platform: 40_000,
      platformWhy: "fixed annual access fee (Layer 02 + 03), scaled to org size",
      seats: "60 standard seats × ~$760",
      seatsValue: 45_600,
      strat: "5 Heavy seats × ~$1,660 + ≈ 2,400 shared Strategic runs × ~$11",
      stratValue: 35_000,
      total: "≈ $120-145K",
      check: "≈ 95 partner-day-equivalents of senior work displaced per year.",
    },
    {
      seg: "Enterprise",
      acv: "$250K+",
      color: GOLD,
      who: "1,000+ person company, 4+ departments, multiple Strategic pods.",
      platform: 80_000,
      platformWhy: "fixed annual access fee (Layer 02 + 03), enterprise tier (SSO, regulatory packs, dedicated support)",
      seats: "100 active seats (standard + heavy mix)",
      seatsValue: 110_000,
      strat: "10+ Heavy seats × ~$1,660 + ≈ 4,000 partner-grade Strategic runs × ~$11",
      stratValue: 60_000,
      total: "≈ $230-280K",
      check: "≈ 155 partner-day-equivalents/yr displaced; fewer than 1 partner-day per workday across the org.",
    },
  ];
  const legend = [
    { k: "ACV", v: "Annual Contract Value. The total annual revenue from one customer, including platform fee + metered seats + Strategic pods." },
    { k: "Seat", v: "One named user with active access. Charged via the metered Layer 01 (per call), not as a flat licence." },
    { k: "Workday", v: "One productive day of work. We use 220 workdays per year per seat (52 weeks − holiday, sick, training, public)." },
    { k: "Op / Design / Strat (1× / 5× / 25×)", v: "The three decision classes from Slide 11. Op = ~20 min of analyst work. Design = ~1-2 hr of senior work. Strat = ~half-day of partner-grade work." },
    { k: "Platform fee", v: "Fixed annual fee for Layer 02 (Collaboration: shared Playbooks, governance, comparability) and Layer 03 (Infrastructure: standards-as-code, audit, portability). Independent of usage." },
    { k: "Strategic pod", v: "An analyst team that runs Strategic-class artifacts (board memos, due-diligence files, regulatory submissions) on behalf of the org. Mostly Heavy seats + shared Strategic runs." },
    { k: "Partner-day-equivalent", v: "One day of fully loaded partner time. We use €1,600/day (€400/hr × 4 productive hours), the same loaded cost used on Slide 11." },
    { k: "Activation", v: "How many decision-class calls an active seat actually runs per workday. The only real commercial risk: pricing and margin hold, what varies is whether seats fire 1 or 5 calls/day." },
  ];
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}K`;
  return (
    <div className="w-full h-full relative px-20 pt-20 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={12} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" color={GOLD} />
      <div className="relative z-10">
        <Tag label="ACV Bridge · Bottom-up meets Top-down" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 36, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1780 }}>
          The per-call math (Slide 11) and the top-down ACV targets <span style={{ color: `hsl(${GOLD})` }}>meet in the middle. Here is the arithmetic that joins them.</span>
        </h2>
        <p className="mb-2.5" style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.45, maxWidth: 1780 }}>
          <span className="font-semibold" style={{ color: TEXT }}>How to read this slide:</span> the <span className="font-semibold" style={{ color: `hsl(${ACCENT})` }}>left panel</span> builds revenue <em>bottom-up</em> from one active seat (calls per workday × mid-band price from Slide 11). The <span className="font-semibold" style={{ color: `hsl(${GOLD})` }}>right panel</span> builds revenue <em>top-down</em> for each customer segment (platform fee + metered seats + Strategic pods). The <span className="font-semibold" style={{ color: `hsl(${GREEN})` }}>reconciliation row</span> shows both sides land within ±10% of the published ACV targets. Mid-band prices used: Operational $0.45/call · Design $2.25/call · Strategic $11/call. Workday = 220 productive days/year.
        </p>
        {/* Legend strip: define every piece of jargon used on the slide */}
        <div className="rounded-lg border bg-white px-4 py-2.5 mb-3" style={{ borderColor: CHROME_BORDER }}>
          <div className="grid grid-cols-4 gap-x-4 gap-y-1.5">
            {legend.map(l => (
              <div key={l.k}>
                <p className="font-mono uppercase tracking-[0.08em]" style={{ fontSize: 9, color: `hsl(${GOLD})` }}>{l.k}</p>
                <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.3 }}>{l.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[0.85fr_1.15fr] gap-5 items-start">
          {/* Bottom-up: one seat */}
          <div className="rounded-2xl border-2 p-4" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 11, color: `hsl(${ACCENT})` }}>Bottom-up · revenue per active seat / year</p>
            <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
              <div className="grid grid-cols-[1.1fr_0.55fr_0.55fr_0.55fr_0.85fr] gap-0 px-3 py-2 font-mono uppercase tracking-[0.08em]"
                style={{ fontSize: 9.5, color: SUBTLE, background: CARD_ALT, borderBottom: `1px solid ${CHROME_BORDER}` }}>
                <span>Seat profile</span><span>Op calls / yr<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(1× class)</span></span><span>Design calls / yr<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(5× class)</span></span><span>Strat calls / yr<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(25× class)</span></span><span>Revenue<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(metered, $/yr)</span></span>
              </div>
              {seatBuild.map(s => (
                <div key={s.profile} className="grid grid-cols-[1.1fr_0.55fr_0.55fr_0.55fr_0.85fr] gap-0 px-3 py-2.5 items-start"
                  style={{ borderBottom: `1px solid ${CHROME_BORDER}` }}>
                  <div className="flex flex-col">
                    <span className="font-semibold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{s.profile}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{s.who}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono" style={{ fontSize: 11.5, color: MUTED }}>{s.op.toLocaleString()}</span>
                    <span className="font-mono" style={{ fontSize: 9, color: SUBTLE, lineHeight: 1.2, marginTop: 1 }}>{s.opPerDay}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono" style={{ fontSize: 11.5, color: MUTED }}>{s.design}</span>
                    <span className="font-mono" style={{ fontSize: 9, color: SUBTLE, lineHeight: 1.2, marginTop: 1 }}>{s.designPerDay}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono" style={{ fontSize: 11.5, color: MUTED }}>{s.strat}</span>
                    <span className="font-mono" style={{ fontSize: 9, color: SUBTLE, lineHeight: 1.2, marginTop: 1 }}>{s.stratPerDay}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ fontSize: 12.5, color: `hsl(${s.color === SUBTLE ? ACCENT : s.color})` }}>{s.revenue}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg px-3 py-2.5" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px dashed hsl(${GREEN} / 0.35)` }}>
              <p className="font-mono uppercase tracking-[0.1em] mb-1" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>Worked example · one Standard seat over one year</p>
              <p style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5 }}>
                A Standard seat fires 5 Operational calls/workday × 220 workdays = <span className="font-mono">1,100 Op calls/yr</span>, plus about <span className="font-mono">80 Design</span> and <span className="font-mono">8 Strategic</span>. At mid-band prices from Slide 11: <span className="font-mono">1,100 × $0.45 = $495</span> (Op) + <span className="font-mono">80 × $2.25 = $180</span> (Design) + <span className="font-mono">8 × $11 = $88</span> (Strategic) = <span className="font-mono font-semibold" style={{ color: TEXT }}>$763 / seat / year</span> in metered Layer 01 revenue. This is <em>only</em> the per-call meter — it excludes the fixed platform fee that funds Layers 02 and 03.
              </p>
            </div>
            <p className="mt-3" style={{ fontSize: 11, color: SUBTLE, lineHeight: 1.4 }}>
              <span className="font-semibold" style={{ color: TEXT }}>Why metered alone is not enough:</span> 10 light seats × ~$165 ≈ $1.6K/yr. Below the cost of selling and supporting an account. The fixed platform fee (Layer 02 + 03 from Slide 11) is what makes the small tier viable and what monetises the collaboration and infrastructure value that no per-call meter can capture.
            </p>
          </div>

          {/* Top-down: three segments */}
          <div className="rounded-2xl border-2 p-4" style={{ borderColor: `hsl(${GOLD} / 0.4)`, background: `hsl(${GOLD} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 11, color: `hsl(${GOLD})` }}>Top-down · ACV build per customer segment</p>
            <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
              <div className="grid grid-cols-[0.9fr_0.55fr_0.95fr_1.05fr_1.05fr_0.65fr] gap-0 px-3 py-2 font-mono uppercase tracking-[0.08em]"
                style={{ fontSize: 9.5, color: SUBTLE, background: CARD_ALT, borderBottom: `1px solid ${CHROME_BORDER}` }}>
                <span>Segment</span><span>Target ACV<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>($/yr)</span></span><span>Platform fee<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(Layer 02+03, fixed)</span></span><span>Metered seats<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(Layer 01, per call)</span></span><span>Strategic pods<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>(heavy seats + shared runs)</span></span><span>Total<br/><span style={{ textTransform: "none", letterSpacing: 0, color: SUBTLE }}>built</span></span>
              </div>
              {segments.map(s => (
                <div key={s.seg} className="grid grid-cols-[0.9fr_0.55fr_0.95fr_1.05fr_1.05fr_0.65fr] gap-0 px-3 py-2.5 items-start"
                  style={{ borderBottom: `1px solid ${CHROME_BORDER}` }}>
                  <div className="flex flex-col">
                    <span className="font-semibold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{s.seg}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{s.who}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ fontSize: 14, color: `hsl(${s.color})`, lineHeight: 1.1 }}>{s.acv}</span>
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{fmt(s.platform)}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{s.platformWhy}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{fmt(s.seatsValue)}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{s.seats}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.2 }}>{fmt(s.stratValue)}</span>
                    <span style={{ fontSize: 9.5, color: SUBTLE, lineHeight: 1.25, marginTop: 2 }}>{s.strat}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ fontSize: 12.5, color: `hsl(${GREEN})`, lineHeight: 1.2 }}>{s.total}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {segments.map(s => (
                <div key={s.seg + "-check"} className="rounded-lg px-3 py-2" style={{ background: `hsl(${s.color} / 0.08)`, border: `1px dashed hsl(${s.color} / 0.35)` }}>
                  <p className="font-mono uppercase tracking-[0.1em] mb-1" style={{ fontSize: 9, color: `hsl(${s.color})` }}>Sanity check · what the customer gets back · {s.seg}</p>
                  <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.35 }}>{s.check}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reconciliation strip */}
        <div className="mt-4 rounded-xl border-2 px-5 py-3" style={{ borderColor: `hsl(${GREEN} / 0.35)`, background: `hsl(${GREEN} / 0.05)` }}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} style={{ color: `hsl(${GREEN})` }} />
            <p className="font-bold" style={{ fontSize: 14, color: TEXT }}>Reconciliation</p>
            <span className="font-mono" style={{ fontSize: 11, color: SUBTLE }}>bottom-up totals land within ±10% of the top-down ACV targets ($40K · $120-150K · $250K+)</span>
          </div>
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.45, marginTop: 4 }}>
            ACVs are driven by <span className="font-semibold" style={{ color: TEXT }}>seats × activation × decision-class mix</span>, not by token volume. Unit economics from Slide 11 produce roughly 90% gross margin across the band, so the commercial risk is <em>activation</em> (how many decision-class calls an active seat actually runs per workday), not unit economics. The fixed platform fee de-risks the small tier and monetises Layer 02 (Collaboration: shared Playbooks, comparability) and Layer 03 (Infrastructure: standards-as-code, audit, regulatory defensibility). As inference prices fall over time, margin widens because customer price stays anchored to displaced human cost, not to COGS (Cost Of Goods Sold = what we pay model vendors).
          </p>
        </div>
      </div>
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 07f — EVERY COMMIT COMPOUNDS · THE AI-NATIVE INSTRUMENT PANEL
// ═════════════════════════════════════════════════════════════════════════════
export function S07fInstrument() {
  // Unified instrument console. Top: substrate hero metric + live ticker.
  // Two equal halves: Learning-rate KPIs (left) and Human Control Rails (right).
  // Bottom: compact "vs yesterday" comparator strip. No kicker overflow.
  // 4-beat progressive reveal mirrors the Compile slide. Click any KPI to
  // highlight the lagging metric it replaces in the vs-yesterday strip.
  const [revealed, setRevealed] = useState(1);
  const [activeKpi, setActiveKpi] = useState<number | null>(null);
  const KPIS = [
    { k: "Standards adoption",      v: "94%",   unit: "of moments",          trend: "+6pp vs last month",     icon: ShieldCheck,    color: GREEN,
      tip: "Share of moments of work that resolved against a published org standard." },
    { k: "Promotion velocity",      v: "4 min", unit: "override to standard", trend: "median, last 30 days",   icon: GitPullRequest, color: GOLD,
      tip: "Time from a single operator override to an approved, org-wide reusable update." },
    { k: "Drift rate",              v: "0.7%",  unit: "of outputs",           trend: "down 2.1pp QoQ",         icon: AlertTriangle,  color: GOLD,
      tip: "Outputs that diverged from the standard at the moment they were produced." },
    { k: "Skill reuse ratio",       v: "7.3×",  unit: "per skill",            trend: "library compounding",    icon: Sparkles,       color: GREEN,
      tip: "Average times each promoted skill is reused across the org after publication." },
    { k: "Cost per moment of work", v: "€0.18", unit: "trending down",        trend: "down 38% vs 90 days ago", icon: TrendingDown,  color: GREEN,
      tip: "Marginal token plus orchestration cost per moment. Falls as the knowledge base grows." },
  ];

  const RAILS = [
    { k: "Token cost and ROI",   v: "€41/day",    s: "live spend, hard ceilings per decision class",          icon: Coins,       color: GOLD },
    { k: "Data governance",      v: "EU · in",    s: "residency, classification, vendor routing enforced",     icon: Lock,        color: ACCENT },
    { k: "Replayable audit",     v: "100%",       s: "every commit signed, versioned, diffable end-to-end",    icon: Eye,         color: GREEN },
    { k: "EU AI Act · GDPR",     v: "Class B",    s: "risk class, transparency, human-oversight evidence",     icon: ShieldCheck, color: ACCENT },
    { k: "Human approval rails", v: "3 tiers",    s: "who approves what, kill-switch and rollback per primitive", icon: UserCheck, color: PURPLE },
  ];

  const VS_YESTERDAY = [
    // Each row pairs a lagging board metric (still tracked, still matters)
    // with the leading indicator that predicts it. Read today, act today,
    // see the lag move 1-2 quarters later. Numbers are illustrative.
    {
      lead: "Win-rate on standard sales plays", leadNow: "82% · 47 deals this week", color: GREEN,
      mechanism: "If reps run the standard discovery + pricing play, win-rate holds at 80%+. Drop below 70% this week → revenue softens in Q+1. Act now: re-train the 3 reps off-standard before quarter-end.",
      lag: "Quarterly revenue", lagS: "books in Q+1, reported 3 months late",
    },
    {
      lead: "Time-to-quote", leadNow: "median 11 min · was 3 days", color: GREEN,
      mechanism: "Quotes in minutes → 4× more proposals out the door this month → pipeline coverage lifts 6 weeks later. If median climbs back over 1 hour, expect coverage gap by next QBR.",
      lag: "Pipeline coverage", lagS: "Friday snapshot, 6-week lag",
    },
    {
      lead: "First-contact resolution %", leadNow: "78% · last 7 days", color: GOLD,
      mechanism: "Tickets solved on first touch → no repeat complaints → NPS lifts next survey. Today's 78% (up from 54%) lands as +12 NPS points in the November wave.",
      lag: "NPS survey", lagS: "next wave in 4 months",
    },
    {
      lead: "Drift rate", leadNow: "3.1% of outputs off-standard", color: GOLD,
      mechanism: "Every off-standard output becomes rework in the next sprint. 3% drift today = 3% schedule slip next quarter. Spike to 8% and on-time % drops below 85% in Q+1.",
      lag: "Project on-time %", lagS: "reported end of quarter",
    },
    {
      lead: "Skill reuse ratio", leadNow: "23× per published skill", color: GREEN,
      mechanism: "One skill, written once, reused 23 times across the org = 22 retraining sessions you don't run next year. Training budget request drops accordingly in FY26 planning.",
      lag: "Training hours / FTE", lagS: "annualised, FY26 plan",
    },
    {
      lead: "Cost per moment of work", leadNow: "€0.41 / commit · was €38 manual", color: GREEN,
      mechanism: "Same output volume at 1% of the unit cost → no incremental hires needed for next year's growth plan. Headcount line stays flat while revenue grows; opex/revenue improves trailing-12.",
      lag: "Headcount cost", lagS: "trailing 12 months",
    },
  ];

  // KPI index i maps to VS_YESTERDAY[i+1] (row 0 is the hero substrate metric).
  const linkedVsRow = (kpiIdx: number | null) => kpiIdx === null ? null : kpiIdx + 1;
  const activeVsRow = linkedVsRow(activeKpi);

  const BEATS = [
    "Beat 1 of 4. The hero metric. The size of the knowledge base. Yesterday's dashboard could not see this number.",
    "Beat 2 of 4. Learning-rate KPIs. Each one measures what the org is becoming, not what it did last quarter.",
    "Beat 3 of 4. Human control rails. Token spend, residency, audit, regulation, approval tiers, all in reach.",
    "Beat 4 of 4. Leading indicators for your lagging metrics. The board metrics you already track stay. We add the live signal that moves first.",
  ];
  const fully = revealed === 4;

  return (
    <div className="w-full h-full relative px-20 pt-16 pb-14" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={11} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" color={GREEN} />

      <div className="relative z-10">
        <ArcStepper current={4} />
        <Tag label="Every commit compounds · the instrument panel" color={GREEN} />
        <h2 className="font-bold leading-[1.02] mb-2" style={{ fontSize: 46, color: TEXT, letterSpacing: "-0.028em", maxWidth: 1760 }}>
          Strategy and execution stop being two layers. <span style={{ color: `hsl(${GREEN})` }}>They are the same loop, measured for the first time.</span>
        </h2>
        <p style={{ fontSize: 16, color: MUTED, maxWidth: 1640, marginBottom: 10 }}>
          The whole organisation, running at the speed of AI, with every human control lever in reach.
        </p>

        {/* ── 4-beat reveal control ── */}
        <div className="flex items-center gap-4 mb-3 rounded-xl border px-4 py-2.5"
          style={{ borderColor: CHROME_BORDER, background: "white" }}>
          <button
            onClick={() => setRevealed(r => Math.max(1, r - 1))}
            disabled={revealed === 1}
            className="rounded-md border px-2 py-1 font-mono uppercase tracking-[0.12em] disabled:opacity-40"
            style={{ fontSize: 10, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}
          >prev</button>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(n => {
              const on = n <= revealed;
              return (
                <button key={n} onClick={() => setRevealed(n)}
                  title={`Beat ${n}`}
                  className="rounded-full transition-all"
                  style={{
                    width: on ? 22 : 10, height: 10,
                    background: on ? `hsl(${GREEN})` : CHROME_BG,
                    border: `1px solid hsl(${on ? GREEN : SUBTLE} / ${on ? 0.9 : 0.4})`,
                  }}
                />
              );
            })}
            <span className="font-mono uppercase tracking-[0.12em] ml-2" style={{ fontSize: 10, color: SUBTLE, fontWeight: 700 }}>
              {revealed} / 4 beats
            </span>
          </div>
          <span style={{ fontSize: 12, color: TEXT, lineHeight: 1.35, flex: 1 }}>
            {BEATS[revealed - 1]}
          </span>
          <button
            onClick={() => { setRevealed(1); setActiveKpi(null); }}
            className="rounded-md border px-2 py-1 font-mono uppercase tracking-[0.12em]"
            style={{ fontSize: 10, color: SUBTLE, borderColor: CHROME_BORDER, background: "white" }}
          >reset</button>
          <button
            onClick={() => setRevealed(r => Math.min(4, r + 1))}
            disabled={fully}
            className="rounded-md border px-3 py-1 font-mono uppercase tracking-[0.12em] disabled:opacity-40 animate-pulse"
            style={{
              fontSize: 10, fontWeight: 800,
              color: fully ? TEXT : "white",
              background: fully ? CARD_ALT : `hsl(${GREEN})`,
              borderColor: fully ? CHROME_BORDER : `hsl(${GREEN})`,
            }}
          >{fully ? "console complete" : "reveal next ▸"}</button>
        </div>

        {/* Substrate hero strip */}
        <div className="rounded-2xl border-2 mb-3 flex items-stretch transition-all"
          onClick={() => fully && setActiveKpi(activeKpi === -1 ? null : -1)}
          style={{
            borderColor: `hsl(${GREEN} / ${activeKpi === -1 ? 0.95 : 0.55})`,
            background: `linear-gradient(90deg, hsl(${GREEN} / 0.08), hsl(${GREEN} / 0.02))`,
            cursor: fully ? "pointer" : "default",
            boxShadow: activeKpi === -1 ? `0 0 0 4px hsl(${GREEN} / 0.15)` : "none",
          }}>
          <div className="flex items-center gap-5 px-6 py-4 flex-1">
            <div className="rounded-xl border-2 px-4 py-2 flex items-center gap-3"
              style={{ borderColor: `hsl(${GREEN} / 0.6)`, background: "white" }}>
              <Database size={22} style={{ color: `hsl(${GREEN})` }} />
              <div>
                <p className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10, color: `hsl(${GREEN})`, fontWeight: 800 }}>
                  Knowledge base size · hero metric
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ fontSize: 44, color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>4,820</span>
                  <span style={{ fontSize: 13, color: MUTED }}>primitives</span>
                  <span className="font-mono" style={{ fontSize: 12, color: `hsl(${GREEN})`, fontWeight: 800 }}>+312 this week</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.4, maxWidth: 720 }}>
              <b>The one metric yesterday's dashboard could not see.</b> Standards, procedures, preferences, prohibitions, facts and skills the org has captured. Every other metric on this console is a derivative of this one.
            </p>
          </div>
          <div className="flex items-center gap-2 px-5 border-l" style={{ borderColor: `hsl(${GREEN} / 0.3)` }}>
            <span className="rounded-full" style={{ width: 7, height: 7, background: `hsl(${GREEN})` }} />
            <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10, color: `hsl(${GREEN})`, fontWeight: 800 }}>streaming · last 24h</span>
          </div>
        </div>

        {/* Two equal halves */}
        <div className="grid grid-cols-2 gap-4 mb-3" style={{ minHeight: 340 }}>
          {/* LEFT — Learning-rate KPIs */}
          <div className="rounded-2xl border p-4 transition-opacity"
            style={{
              borderColor: `hsl(${GREEN} / 0.35)`,
              background: `hsl(${GREEN} / 0.03)`,
              opacity: revealed >= 2 ? 1 : 0.12,
              pointerEvents: revealed >= 2 ? "auto" : "none",
            }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 11, color: `hsl(${GREEN})`, fontWeight: 800 }}>
                Learning rate · what the org is becoming
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ fontSize: 10, color: MUTED }}>
                <Activity size={11} /> live
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {KPIS.map((k, i) => {
                const Icon = k.icon;
                const isActive = activeKpi === i;
                const isDim    = activeKpi !== null && activeKpi !== i && activeKpi !== -1;
                return (
                  <div key={k.k}
                    onClick={() => fully && setActiveKpi(isActive ? null : i)}
                    className="rounded-lg border bg-white px-3 py-2 flex items-center gap-3 transition-all"
                    style={{
                      borderColor: `hsl(${k.color} / ${isActive ? 0.95 : 0.4})`,
                      borderWidth: isActive ? 2 : 1,
                      opacity: isDim ? 0.35 : 1,
                      cursor: fully ? "pointer" : "default",
                      boxShadow: isActive ? `0 0 0 3px hsl(${k.color} / 0.15)` : "none",
                    }}>
                    <Icon size={16} style={{ color: `hsl(${k.color})`, flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9.5, color: `hsl(${k.color})`, fontWeight: 800 }}>{k.k}</p>
                      <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.3, marginTop: 2 }}>{k.tip}</p>
                      {isActive && fully && (
                        <p className="font-mono uppercase tracking-[0.08em]" style={{ fontSize: 9, color: `hsl(${k.color})`, fontWeight: 800, marginTop: 3 }}>
                          leading indicator for · {VS_YESTERDAY[i + 1].lag}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0" style={{ minWidth: 110 }}>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1, letterSpacing: "-0.02em" }}>{k.v}</span>
                        <span style={{ fontSize: 9.5, color: MUTED }}>{k.unit}</span>
                      </div>
                      <p style={{ fontSize: 9.5, color: `hsl(${k.color})`, fontWeight: 700, marginTop: 3 }}>{k.trend}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {fully && (
              <p className="font-mono uppercase tracking-[0.1em] mt-2" style={{ fontSize: 9, color: SUBTLE, fontWeight: 700, textAlign: "right" }}>
                click any KPI to see the lagging metric it replaces ▾
              </p>
            )}
          </div>

          {/* RIGHT — Human Control Rails */}
          <div className="rounded-2xl border p-4 transition-opacity"
            style={{
              borderColor: `hsl(${PURPLE} / 0.35)`,
              background: `hsl(${PURPLE} / 0.03)`,
              opacity: revealed >= 3 ? 1 : 0.12,
              pointerEvents: revealed >= 3 ? "auto" : "none",
            }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 11, color: `hsl(${PURPLE})`, fontWeight: 800 }}>
                Human control rails · the levers in reach
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ fontSize: 10, color: MUTED }}>
                <ShieldCheck size={11} /> governed by default
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {RAILS.map(r => {
                const Icon = r.icon;
                return (
                  <div key={r.k} className="rounded-lg border bg-white px-3 py-2 flex items-center gap-3"
                    style={{ borderColor: `hsl(${r.color} / 0.4)` }}>
                    <Icon size={16} style={{ color: `hsl(${r.color})`, flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 9.5, color: `hsl(${r.color})`, fontWeight: 800 }}>{r.k}</p>
                      <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.3, marginTop: 2 }}>{r.s}</p>
                    </div>
                    <div className="text-right flex-shrink-0" style={{ minWidth: 90 }}>
                      <span className="font-bold" style={{ fontSize: 16, color: TEXT, lineHeight: 1 }}>{r.v}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* vs yesterday comparator */}
        <div className="rounded-xl border px-4 py-2.5 transition-opacity"
          style={{
            borderColor: CHROME_BORDER, background: CARD_ALT,
            opacity: revealed >= 4 ? 1 : 0.12,
            pointerEvents: revealed >= 4 ? "auto" : "none",
          }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10, color: SUBTLE, fontWeight: 800 }}>
              Leading indicators · for the lagging metrics you already track
            </span>
            <span style={{ fontSize: 10.5, color: MUTED, fontStyle: "italic" }}>
              <b style={{ color: `hsl(${GREEN})` }}>Every prompt is a compile. Every moment of work is a commit. Every commit compounds.</b>
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {VS_YESTERDAY.map((v, i) => {
              const isMatch = activeVsRow === i || (activeKpi === -1 && i === 0);
              const isDim   = activeKpi !== null && !isMatch;
              return (
                <div key={v.lag} className="rounded-md border bg-white px-2 py-1.5 transition-all"
                  style={{
                    borderColor: isMatch ? `hsl(${v.color} / 0.95)` : CHROME_BORDER,
                    borderWidth: isMatch ? 2 : 1,
                    background: isMatch ? `hsl(${v.color} / 0.08)` : "white",
                    opacity: isDim ? 0.3 : 1,
                    boxShadow: isMatch ? `0 0 0 3px hsl(${v.color} / 0.15)` : "none",
                  }}>
                  {/* Leading indicator (new, live, moves first) */}
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="rounded-full" style={{ width: 5, height: 5, background: `hsl(${v.color})`, flexShrink: 0 }} />
                    <p className="font-mono uppercase tracking-[0.06em]" style={{ fontSize: 7.5, color: `hsl(${v.color})`, fontWeight: 800 }}>leading · live</p>
                  </div>
                  <p style={{ fontSize: 9.5, color: `hsl(${v.color})`, fontWeight: 800, lineHeight: 1.15 }}>{v.lead}</p>
                  <p style={{ fontSize: 8.5, color: MUTED, marginBottom: 4 }}>{v.leadNow}</p>
                  {/* Concrete causal mechanism with example numbers */}
                  <p style={{ fontSize: 8, color: isMatch ? TEXT : SUBTLE, lineHeight: 1.3, marginBottom: 5, fontStyle: "italic" }}>
                    ↓ {v.mechanism}
                  </p>
                  {/* Lagging board metric (still tracked, still matters) */}
                  <div className="flex items-center gap-1 mb-0.5 pt-1 border-t" style={{ borderColor: CHROME_BORDER }}>
                    <span className="rounded-full border" style={{ width: 5, height: 5, borderColor: SUBTLE, flexShrink: 0 }} />
                    <p className="font-mono uppercase tracking-[0.06em]" style={{ fontSize: 7.5, color: SUBTLE, fontWeight: 700 }}>lagging · board</p>
                  </div>
                  <p style={{ fontSize: 9.5, color: TEXT, fontWeight: 700, lineHeight: 1.15 }}>{v.lag}</p>
                  <p style={{ fontSize: 8.5, color: MUTED }}>{v.lagS}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// Resequence: thesis & narrative first (unique-moment, os-map, loop, propagation)
// land BEFORE the four-beat architecture arc so the "why us" frame is set before
// the deep-dive. S09Augmentation removed — superseded by S09bAugmentationMechanics,
// which now sits earlier as part of the architecture cluster.

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — THE LOOP, CLOSED (Closer · ties back to the 5 surfaces)
// ═════════════════════════════════════════════════════════════════════════════
export function S13LoopClosed() {
  const surfaces = [
    { k: "Standards", proof: "Typed playbooks, versioned, enforced at compile time", icon: ShieldCheck },
    { k: "Judgment",  proof: "Senior reasoning encoded as procedures, not lost to chat history", icon: Brain },
    { k: "Memory",    proof: "Owned context graph. Zero vendor lock. Portable in your VPC", icon: Database },
    { k: "Spend",     proof: "$0.40 / decision · every token bound to a named standard", icon: Coins },
    { k: "Exposure",  proof: "Full lineage per decision. EU AI Act and audit ready by default", icon: Lock },
  ];
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ background: DARK_BG }}>
      <DarkGrid />
      <PageNumber dark />
      <div className="relative z-10 px-32 w-full">
        <p className="font-semibold tracking-[0.3em] uppercase text-center mb-6" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>
          The Loop, Closed
        </p>
        <h2 className="font-bold text-center leading-[1.05]" style={{ fontSize: 72, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          Five surfaces. <span style={{ color: `hsl(${GREEN})` }}>One loop.</span> <span style={{ color: `hsl(${ACCENT})` }}>Yours.</span>
        </h2>
        <p className="text-center mt-6 mx-auto" style={{ fontSize: 22, color: DARK_MUTED, maxWidth: 1400, lineHeight: 1.4 }}>
          What the thesis named, the architecture delivers. The same five surfaces, now provable in production.
        </p>

        <div className="grid grid-cols-5 gap-5 mt-14">
          {surfaces.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.k} className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
                <div className="rounded-lg flex items-center justify-center" style={{ width: 44, height: 44, background: `hsl(${GREEN} / 0.15)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
                  <Icon size={22} color={`hsl(${GREEN})`} />
                </div>
                <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT, letterSpacing: "-0.01em" }}>{s.k}</p>
                <p style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.45 }}>{s.proof}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-center gap-10" style={{ fontSize: 20, color: DARK_MUTED }}>
          <span>Model governance watches the AI.</span>
          <span style={{ color: "hsl(0 0% 100% / 0.25)" }}>·</span>
          <span style={{ color: DARK_TEXT, fontWeight: 700 }}>LIZA governs the moment of decision.</span>
        </div>
      </div>
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

const RAW_SLIDES = [
  { id: "cover", title: "Cover", component: <S01Cover /> },
  { id: "horizons", title: "Three Horizons Collapse", component: <S02Horizons /> },
  { id: "category", title: "The Category · The Standard Layer", component: <StandardLayerDeckSlide eyebrow="The category · The missing layer between AI and action" /> },
  { id: "governance-loop", title: "The AI Governance Loop · Thesis", component: <S03GovernanceLoop /> },
  { id: "production-system", title: "The Production System · How the Loop scales", component: <S04ProductionSystem /> },
  { id: "shift", title: "Infrastructure Shift", component: <S03Shift /> },
  { id: "iceberg", title: "Context Gap", component: <S03Iceberg /> },
  { id: "unique-moment", title: "What Makes Us Unique · Moment of Work", component: <S07bUnique /> },
  { id: "os-map", title: "OS Map", component: <S04OSMap /> },
  { id: "loop", title: "AACE Loop", component: <S05Loop /> },
  { id: "propagation", title: "Artifact Graph", component: <S06Propagation /> },
  { id: "funnel-stack", title: "Every Prompt Is A Compile · The Atom", component: <S07cFunnel /> },
  { id: "aace-not-rag", title: "This Is AACE, Not RAG · The Defence", component: <S07eAaceNotRag /> },
  { id: "org-loop", title: "Every Moment Of Work Is A Commit · The Network", component: <S07dOrgLoop /> },
  { id: "instrument-panel", title: "Every Commit Compounds · The AI-Native Instrument Panel", component: <S07fInstrument /> },
  { id: "augmentation-mechanics", title: "Augmentation Mechanics", component: <S09bAugmentationMechanics /> },
  { id: "metering", title: "Pricing Inversion + Metering", component: <S08PricingMetering /> },
  { id: "classifier", title: "Decision-Class Classifier", component: <S08bClassifier /> },
  { id: "unit-economics", title: "Unit Economics & Sustainability", component: <S10UnitEconomics /> },
  { id: "scissors", title: "The Scissors · Cost Dynamics", component: <S10aScissors /> },
  { id: "acv-bridge", title: "Top-down ACV ↔ Bottom-up Unit Economics", component: <S10bACVBridge /> },
  { id: "hyperscaler-risk", title: "Hyperscaler Risk & Return Paths", component: <S11HyperscalerRisk /> },
  { id: "societal-impact", title: "Knowledge Sovereignty · Societal Impact", component: <S12SocietalImpact /> },
  { id: "loop-closed", title: "The Loop, Closed", component: <S13LoopClosed /> },
];
const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: <SlideIndexProvider index={i} total={RAW_SLIDES.length}>{s.component}</SlideIndexProvider>,
}));

// ─── Deck shell ──────────────────────────────────────────────────────────────
export default function TechDDDeck() {
  const [current, setCurrent] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);
  const goTo = useCallback((i: number) => { setCurrent(i); setShowGrid(false); }, []);

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
  }, []);

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
  }, [next, prev, enterFullscreen]);

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
          style={{
            background: "hsl(0 0% 100% / 0.9)", border: `1px solid ${CHROME_BORDER}`, backdropFilter: "blur(8px)",
            opacity: mobileControlsVisible ? 1 : 0, pointerEvents: mobileControlsVisible ? "auto" : "none",
          }}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronLeft size={18} style={{ color: TEXT }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Tech-DD-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GREEN})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Tech Due Diligence Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            Tech DD · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Tech-DD-Deck" slideCount={SLIDES.length} variant="desktop" />
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
                      <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> · {s.title}
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
                      background: i === current ? `hsl(${GREEN})` : CHROME_BORDER,
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

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3, ArrowRight, Users, Boxes, Workflow, Repeat, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideIndexProvider, SlideGrid, SlideBar, PageNumber, Footer, Tag,
  TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  GREEN, BG, ACCENT, RED, GOLD, PURPLE,
} from "@/pages/TechDDDeck";

// ═════════════════════════════════════════════════════════════════════════════
// INVESTOR THESIS DECK — 5 slides. Tomorrow's room.
// Argument: pre-AI-native vs post-AI-native investing → infra bet → four-quadrant
// map (Wonderful / Paradox / Interloom / LIZA) → self-serve is architecture →
// team bet. Council-approved sequence.
// ═════════════════════════════════════════════════════════════════════════════

const ACTS = [
  { short: "Reframe" },
  { short: "Infra Bet" },
  { short: "Map" },
  { short: "Architecture" },
  { short: "Team" },
];

function ActRail({ index }: { index: number }) {
  return (
    <div className="absolute z-30 flex items-center gap-4" style={{ top: 24, left: 96, right: 96, height: 44 }}>
      <span className="font-mono uppercase tracking-[0.3em] font-bold whitespace-nowrap" style={{ fontSize: 11, color: `hsl(${ACCENT})` }}>
        LIZA OS Investor Thesis
      </span>
      <div className="flex-1 grid grid-cols-5 gap-2">
        {ACTS.map((a, i) => {
          const active = i === index;
          const past = i < index;
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-[3px] rounded-full" style={{
                background: active ? `hsl(${ACCENT})` : past ? `hsl(${ACCENT} / 0.35)` : CHROME_BORDER,
              }} />
              <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden" style={{ opacity: active ? 1 : 0.5 }}>
                <span className="font-mono" style={{ fontSize: 10, color: MUTED, letterSpacing: "0.08em" }}>0{i + 1}</span>
                <span className="font-bold" style={{ fontSize: 11, color: active ? TEXT : MUTED }}>{a.short}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full" style={{ background: BG, color: TEXT }}>
      <SlideGrid />
      <PageNumber />
      {children}
      <SlideBar />
    </div>
  );
}

// ─── Slide 01 · Pre-AI-native vs Post-AI-native investing ───────────────────
function S1Reframe() {
  const rows = [
    { k: "Team",      pre: "Headcount × experience",        post: "Operator depth in 4 domains" },
    { k: "Customers", pre: "Logos on a slide",              post: "Co-architects of the loop" },
    { k: "Revenue",   pre: "ARR per seat",                  post: "Metered execution per decision" },
    { k: "Moat",      pre: "Features competitors ship next", post: "Tacit knowledge ↔ org graph loop" },
    { k: "Comp set",  pre: "Vertical SaaS multiples",        post: "Infrastructure category bets" },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Reframe" />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 76, lineHeight: 1.02, color: TEXT, marginBottom: 18 }}>
          You are not buying a SaaS company.
        </h1>
        <p className="font-semibold" style={{ fontSize: 30, color: MUTED, maxWidth: 1500 }}>
          Before you price us, change the lens. The way you underwrote AI <em>apps</em> does not work for the layer that runs an AI-native organization.
        </p>
      </div>

      <div className="absolute" style={{ left: 112, right: 112, top: 460 }}>
        <div className="grid grid-cols-[200px_1fr_1fr] gap-0 rounded-2xl overflow-hidden border" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <div className="px-6 py-5 font-bold uppercase tracking-[0.18em]" style={{ fontSize: 13, color: SUBTLE, background: CARD_ALT }}>Dimension</div>
          <div className="px-7 py-5 font-bold uppercase tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${RED})`, background: "hsl(0 72% 50% / 0.05)", borderLeft: `1px solid ${CHROME_BORDER}` }}>Pre-AI-Native Investing</div>
          <div className="px-7 py-5 font-bold uppercase tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${GREEN})`, background: "hsl(155 72% 38% / 0.05)", borderLeft: `1px solid ${CHROME_BORDER}` }}>Post-AI-Native Investing</div>
          {rows.map((r, i) => (
            <React.Fragment key={r.k}>
              <div className="px-6 py-5 font-bold" style={{ fontSize: 22, color: TEXT, background: CARD_ALT, borderTop: `1px solid ${CHROME_BORDER}` }}>{r.k}</div>
              <div className="px-7 py-5" style={{ fontSize: 22, color: MUTED, borderLeft: `1px solid ${CHROME_BORDER}`, borderTop: `1px solid ${CHROME_BORDER}`, background: i % 2 ? "hsl(0 72% 50% / 0.03)" : "transparent" }}>{r.pre}</div>
              <div className="px-7 py-5 font-semibold" style={{ fontSize: 22, color: TEXT, borderLeft: `1px solid ${CHROME_BORDER}`, borderTop: `1px solid ${CHROME_BORDER}`, background: i % 2 ? "hsl(155 72% 38% / 0.04)" : "transparent" }}>{r.post}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <Footer text="The lens decides the valuation. Choose the lens first." />
    </SlideShell>
  );
}

// ─── Slide 02 · The AI Infrastructure Bet ────────────────────────────────────
function S2InfraBet() {
  const layers = [
    { name: "Models", note: "OpenAI · Anthropic · Google", color: PURPLE, desc: "Raw cognition. Commoditizing fast." },
    { name: "Apps & Tools", note: "Cursor · Harvey · Paradigm", color: GOLD, desc: "Point solutions. Wrap a model, sell a workflow." },
    { name: "Agent Deployment", note: "Wonderful · Sierra · Decagon", color: ACCENT, desc: "Services-led production. Speed-to-launch as a service." },
    { name: "The Operating Layer", note: "LIZA OS", color: GREEN, desc: "The loop where tacit human knowledge enters the org graph and compounds. The only layer the organization keeps." },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Bet" />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 72, lineHeight: 1.04, color: TEXT, marginBottom: 14 }}>
          Not a model. Not a tool. Not a deployment service.
        </h1>
        <p className="font-semibold" style={{ fontSize: 30, color: MUTED, maxWidth: 1500 }}>
          The operating layer of the AI-native organization. The one layer that has to be owned, not rented.
        </p>
      </div>

      <div className="absolute" style={{ left: 112, right: 112, top: 460 }}>
        <div className="flex flex-col gap-3">
          {layers.map((l, i) => {
            const us = i === layers.length - 1;
            return (
              <div key={l.name} className="grid grid-cols-[300px_1fr_auto] items-center gap-8 px-8 py-6 rounded-2xl border"
                style={{
                  borderColor: us ? `hsl(${l.color} / 0.45)` : CHROME_BORDER,
                  background: us ? `hsl(${l.color} / 0.06)` : BG,
                  boxShadow: us ? `0 8px 32px hsl(${l.color} / 0.12)` : "none",
                }}>
                <div>
                  <div className="font-bold" style={{ fontSize: 28, color: us ? `hsl(${l.color})` : TEXT }}>{l.name}</div>
                  <div className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 12, color: SUBTLE, marginTop: 4 }}>{l.note}</div>
                </div>
                <div style={{ fontSize: 22, color: us ? TEXT : MUTED, fontWeight: us ? 600 : 400 }}>{l.desc}</div>
                {us && (
                  <div className="px-4 py-2 rounded-full font-bold uppercase tracking-[0.18em]"
                    style={{ fontSize: 12, color: `hsl(${l.color})`, background: `hsl(${l.color} / 0.12)`, border: `1px solid hsl(${l.color} / 0.3)` }}>
                    Our bet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer text="Apps die when the model under them ships the feature. Infrastructure compounds." />
    </SlideShell>
  );
}

// ─── Slide 03 · Four-Quadrant Map ────────────────────────────────────────────
function S3Map() {
  // axes: X = deployment model (services-led → self-serve), Y = human role (approver → co-author)
  const pts = [
    { name: "Wonderful",  x: 0.15, y: 0.25, color: GOLD,   note: "$286M raised · services-led · agents replace humans" },
    { name: "Paradox",    x: 0.35, y: 0.78, color: PURPLE, note: "Shared world model · research-stage · not in production" },
    { name: "Interloom",  x: 0.55, y: 0.40, color: ACCENT, note: "Agentic workflow infra · humans approve a queue" },
    { name: "LIZA OS",    x: 0.85, y: 0.85, color: GREEN,  note: "Self-serve · human tacit knowledge is the input" },
  ];
  const PLOT = { left: 320, top: 460, w: 1280, h: 540 };
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Map" />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 64, lineHeight: 1.05, color: TEXT, marginBottom: 12 }}>
          Four companies. One quadrant unoccupied.
        </h1>
        <p className="font-semibold" style={{ fontSize: 24, color: MUTED, maxWidth: 1500 }}>
          Human role × deployment model. Top-right is the only position where the loop closes.
        </p>
      </div>

      {/* Y axis label */}
      <div className="absolute font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: SUBTLE, left: 130, top: PLOT.top - 30 }}>
        Human role: Co-author ↑
      </div>
      <div className="absolute font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: SUBTLE, left: 130, top: PLOT.top + PLOT.h - 8 }}>
        Human role: Approver ↓
      </div>
      {/* X axis labels */}
      <div className="absolute font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: SUBTLE, left: PLOT.left, top: PLOT.top + PLOT.h + 18 }}>
        ← Services-led
      </div>
      <div className="absolute font-bold uppercase tracking-[0.2em] text-right" style={{ fontSize: 13, color: SUBTLE, left: PLOT.left + PLOT.w - 200, top: PLOT.top + PLOT.h + 18, width: 200 }}>
        Self-serve →
      </div>

      {/* Plot area */}
      <div className="absolute rounded-2xl border" style={{
        left: PLOT.left, top: PLOT.top, width: PLOT.w, height: PLOT.h,
        borderColor: CHROME_BORDER, background: CARD_ALT,
        backgroundImage: `linear-gradient(${CHROME_BORDER} 1px, transparent 1px), linear-gradient(90deg, ${CHROME_BORDER} 1px, transparent 1px)`,
        backgroundSize: `${PLOT.w / 4}px ${PLOT.h / 4}px`,
      }}>
        {/* quadrant highlight: top-right */}
        <div className="absolute rounded-tr-2xl" style={{
          right: 0, top: 0, width: PLOT.w / 2, height: PLOT.h / 2,
          background: `hsl(${GREEN} / 0.06)`,
          borderLeft: `1px dashed hsl(${GREEN} / 0.4)`,
          borderBottom: `1px dashed hsl(${GREEN} / 0.4)`,
        }} />
        <div className="absolute font-bold uppercase tracking-[0.2em]" style={{
          fontSize: 12, color: `hsl(${GREEN})`, right: 18, top: 14,
        }}>
          The Loop Closes Here
        </div>

        {pts.map((p) => {
          const cx = p.x * PLOT.w;
          const cy = (1 - p.y) * PLOT.h;
          const us = p.name === "LIZA OS";
          return (
            <div key={p.name} className="absolute" style={{ left: cx - 14, top: cy - 14 }}>
              <div className="rounded-full" style={{
                width: us ? 32 : 22, height: us ? 32 : 22,
                background: `hsl(${p.color})`,
                boxShadow: us ? `0 0 0 8px hsl(${p.color} / 0.18)` : `0 0 0 4px hsl(${p.color} / 0.15)`,
                marginLeft: us ? -5 : 0, marginTop: us ? -5 : 0,
              }} />
              <div className="absolute" style={{
                left: cx > PLOT.w - 320 ? -290 : 40, top: -8, width: 280,
                textAlign: cx > PLOT.w - 320 ? "right" : "left",
              }}>
                <div className="font-bold" style={{ fontSize: us ? 24 : 20, color: us ? `hsl(${p.color})` : TEXT }}>{p.name}</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.35, marginTop: 2 }}>{p.note}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer text="Sources: appparadox.com · interloom.com · wonderful.ai · LIZA OS production." />
    </SlideShell>
  );
}

// ─── Slide 04 · Self-serve is the architecture ──────────────────────────────
function S4Architecture() {
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Architecture" color={GREEN} />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 64, lineHeight: 1.05, color: TEXT, marginBottom: 14 }}>
          Self-serve is not a GTM choice. It is the only architecture where the loop compounds.
        </h1>
        <p className="font-semibold" style={{ fontSize: 26, color: MUTED, maxWidth: 1600 }}>
          Every services-led deployment adds a human gate between the operator's tacit knowledge and the organizational graph. The gate is where the compounding dies.
        </p>
      </div>

      {/* Loop diagram */}
      <div className="absolute" style={{ left: 200, right: 200, top: 580, height: 340 }}>
        {[
          { label: "Operator", sub: "Tacit knowledge", icon: Users,    color: ACCENT, x: 0 },
          { label: "LIZA OS",  sub: "Friction-free capture", icon: Repeat, color: GREEN, x: 1 },
          { label: "Org Graph", sub: "Shared context", icon: Boxes,   color: PURPLE, x: 2 },
          { label: "Execution", sub: "Compounded output", icon: Target, color: GOLD,   x: 3 },
        ].map((n, i, arr) => {
          const slot = 1520 / (arr.length - 1);
          return (
            <React.Fragment key={n.label}>
              <div className="absolute" style={{ left: n.x * slot - 100, top: 0, width: 200, textAlign: "center" }}>
                <div className="mx-auto rounded-2xl flex items-center justify-center"
                  style={{
                    width: 110, height: 110,
                    background: `hsl(${n.color} / 0.08)`,
                    border: `2px solid hsl(${n.color} / 0.3)`,
                    color: `hsl(${n.color})`,
                  }}>
                  <n.icon size={48} strokeWidth={1.5} />
                </div>
                <div className="font-bold" style={{ fontSize: 24, color: TEXT, marginTop: 14 }}>{n.label}</div>
                <div style={{ fontSize: 16, color: MUTED, marginTop: 4 }}>{n.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="absolute flex items-center justify-center"
                  style={{ left: n.x * slot + 60, top: 40, width: slot - 120, height: 30 }}>
                  <ArrowRight size={32} color={`hsl(${MUTED})`} strokeWidth={1.8} />
                </div>
              )}
            </React.Fragment>
          );
        })}
        {/* return arrow underneath */}
        <div className="absolute" style={{ left: 0, top: 200, width: 1520, height: 80 }}>
          <div className="absolute" style={{ left: 60, right: 60, top: 30, height: 2, background: `hsl(${GREEN} / 0.35)` }} />
          <div className="absolute" style={{ left: 0, top: 0, width: 60, height: 60, borderLeft: `2px solid hsl(${GREEN} / 0.35)`, borderTop: `2px solid hsl(${GREEN} / 0.35)`, borderTopLeftRadius: 24 }} />
          <div className="absolute" style={{ right: 0, top: 0, width: 60, height: 60, borderRight: `2px solid hsl(${GREEN} / 0.35)`, borderTop: `2px solid hsl(${GREEN} / 0.35)`, borderTopRightRadius: 24 }} />
          <div className="absolute font-bold uppercase tracking-[0.2em]"
            style={{ left: "50%", top: 14, transform: "translateX(-50%)", fontSize: 13, color: `hsl(${GREEN})`, background: BG, padding: "0 12px" }}>
            New input · zero friction · same day
          </div>
        </div>
      </div>

      <Footer text="Wonderful's margin model needs the services layer. Ours breaks if it has one." dark={false} />
    </SlideShell>
  );
}

// ─── Slide 05 · Team Bet ─────────────────────────────────────────────────────
function S5Team() {
  const domains = [
    { name: "Organizational Development", proof: "15+ years scaling AI/data orgs across regulated industries" },
    { name: "Business Model Innovation",  proof: "Designed and shipped metered, decision-priced commercial models" },
    { name: "Technology Architecture",    proof: "Production AI systems in pharma, banking, defence, AEC" },
    { name: "Human Systems",              proof: "Tacit knowledge capture frameworks deployed with operator teams" },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Team Bet" color={GOLD} />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 64, lineHeight: 1.05, color: TEXT, marginBottom: 14 }}>
          The category is not defined yet. The operators who can define it are.
        </h1>
        <p className="font-semibold" style={{ fontSize: 26, color: MUTED, maxWidth: 1600 }}>
          You are underwriting committed operators with shared scars in the four domains this layer requires. Not headcount. Not titles.
        </p>
      </div>

      <div className="absolute grid grid-cols-2 gap-5" style={{ left: 112, right: 112, top: 510 }}>
        {domains.map((d, i) => (
          <div key={d.name} className="rounded-2xl border px-7 py-6" style={{ borderColor: CHROME_BORDER, background: BG }}>
            <div className="flex items-baseline gap-3">
              <span className="font-mono font-bold" style={{ fontSize: 14, color: `hsl(${GOLD})`, letterSpacing: "0.15em" }}>0{i + 1}</span>
              <div className="font-bold" style={{ fontSize: 26, color: TEXT }}>{d.name}</div>
            </div>
            <p style={{ fontSize: 20, color: MUTED, marginTop: 12, lineHeight: 1.4 }}>{d.proof}</p>
          </div>
        ))}
      </div>

      <div className="absolute rounded-2xl px-8 py-6"
        style={{ left: 112, right: 112, bottom: 90, background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
        <div className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
          The valuation question is not "how big is the TAM."
          <span style={{ color: `hsl(${GOLD})` }}> It is "who can be trusted to define it."</span>
        </div>
      </div>
    </SlideShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════

function WithRail({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="w-full h-full relative">
      {children}
      <ActRail index={index} />
    </div>
  );
}

const RAW_SLIDES = [
  { id: "reframe",      title: "01 · The Reframe · Pre-AI vs Post-AI investing",  component: <S1Reframe /> },
  { id: "infra-bet",    title: "02 · The Bet · Not a model, not a tool",          component: <S2InfraBet /> },
  { id: "map",          title: "03 · The Map · Four companies, one quadrant",     component: <S3Map /> },
  { id: "architecture", title: "04 · The Architecture · Self-serve is the loop",  component: <S4Architecture /> },
  { id: "team",         title: "05 · The Team Bet · Operators in four domains",   component: <S5Team /> },
];
const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      <WithRail index={i}>{s.component}</WithRail>
    </SlideIndexProvider>
  ),
}));

export default function InvestorThesisDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Thesis" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Investor Thesis</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${ACCENT} / 0.12)`, color: `hsl(${ACCENT})` }}>
            Tomorrow's room · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Thesis" slideCount={SLIDES.length} variant="desktop" />
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
                {s.title}
              </p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-2 gap-6">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("flex flex-col gap-2 rounded-xl overflow-hidden border-2 transition-all",
                      i === current ? "border-primary" : "border-transparent hover:border-border"
                    )}>
                    <div className="w-full" style={{ aspectRatio: "16/9" }}>
                      <ScaledSlide>{s.component}</ScaledSlide>
                    </div>
                    <p className="text-xs px-2 pb-2" style={{ color: MUTED }}>{s.title}</p>
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
              <div className="flex gap-2 flex-wrap max-w-[60%]">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${ACCENT})` : CHROME_BORDER,
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
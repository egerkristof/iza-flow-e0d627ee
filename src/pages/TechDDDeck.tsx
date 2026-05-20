import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  Database, Cpu, Layers, GitBranch, Workflow, ShieldCheck, Coins, TrendingDown,
  Gauge, Brain, Lock, Network, ArrowRight, ArrowDown, ChevronLeft, ChevronRight,
  Maximize2, X, Grid3x3, AlertCircle, Sparkles, FileText, Boxes, Radio, Zap,
  Eye, Activity, Users, GraduationCap, MessageSquare, Globe, Compass,
  GitPullRequest, CheckCircle2, AlertTriangle, Send, UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";

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
      }}>{children}</div>
    </div>
  );
}

// ─── Tokens ──────────────────────────────────────────────────────────────────
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
const PURPLE = "265 60% 52%";
const DARK_BG = "hsl(222 25% 8%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(215 15% 60%)";

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
  return <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />;
}
function Tag({ label, color = ACCENT }: { label: string; color?: string }) {
  return <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 24, color: `hsl(${color})` }}>{label}</p>;
}
function PhaseChip({ phase, color = ACCENT }: { phase: string; color?: string }) {
  return (
    <div className="absolute top-10 right-12 flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.25)` }}>
      <span className="font-mono tracking-[0.15em] uppercase font-semibold" style={{ fontSize: 13, color: `hsl(${color})` }}>{phase}</span>
    </div>
  );
}
function PageNumber({ n, total, dark = false }: { n: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute top-10 left-12 font-mono" style={{ fontSize: 14, color: dark ? DARK_MUTED : SUBTLE, letterSpacing: "0.15em" }}>
      {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}
function Footer({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div className="absolute left-28 right-28 bottom-7 flex items-center gap-3"
      style={{ color: dark ? DARK_MUTED : SUBTLE, fontSize: 15, letterSpacing: "0.02em" }}>
      <span style={{ width: 32, height: 1, background: dark ? "hsl(0 0% 100% / 0.2)" : CHROME_BORDER }} />
      <span>{text}</span>
    </div>
  );
}

const TOTAL = 11;

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
          Architecture, State &amp; Margin.
        </h1>
        <p className="mt-10 mx-auto" style={{ fontSize: 30, color: DARK_MUTED, maxWidth: 1300, lineHeight: 1.35 }}>
          A walk-through of the LIZA OS cognitive infrastructure: the semantic layer,
          the AACE orchestration loop, the artifact graph, and the value-based metering model.
        </p>
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
        <h2 className="font-bold leading-[1.05]" style={{ fontSize: 64, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The three horizons used to be sequential. <span style={{ color: `hsl(${ACCENT})` }}>They now run simultaneously, at the edge.</span>
        </h2>

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
      <Footer text="Sequential planning cycles and static SOPs cannot hold this state. A runtime can. That is the cognitive infrastructure on the next slide." />
      <SlideBar from={GREEN} to={PURPLE} />
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
function S03Iceberg() {
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
    { l: "Playbooks", s: "Multi-step protocols" },
    { l: "Procedures", s: "Behavior patches" },
    { l: "Directives", s: "Non-negotiable rules" },
    { l: "Knowledge", s: "Authoritative facts" },
    { l: "Artifacts", s: "Versioned outputs" },
    { l: "Preferences", s: "Voice & format" },
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
                Surfaces that get better reading our standard.
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
                  style={{ fontSize: 10, background: `hsl(${GREEN} / 0.15)`, color: `hsl(${GREEN})` }}>AACE v3.3 runtime</span>
              </div>
              <p style={{ fontSize: 13, color: MUTED }}>State-locked · audit-traceable · model-agnostic</p>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {core.map(c => (
                <div key={c.l} className="px-2.5 py-2 rounded-lg border bg-white" style={{ borderColor: `hsl(${GREEN} / 0.3)` }}>
                  <p className="font-semibold" style={{ fontSize: 13, color: TEXT }}>{c.l}</p>
                  <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.25, marginTop: 1 }}>{c.s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Governance bar */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { i: GitBranch, l: "Versioning", s: "Every standard has history, owner, diff" },
              { i: ShieldCheck, l: "Audit trail", s: "Bundle · version · mandate per execution" },
              { i: Lock, l: "Access & roles", s: "Author · execute · override" },
            ].map(g => (
              <div key={g.l} className="rounded-lg border px-3 py-2 flex items-center gap-2.5" style={{ borderColor: CHROME_BORDER, background: "white" }}>
                <g.i size={16} style={{ color: SUBTLE }} />
                <div>
                  <p className="font-semibold" style={{ fontSize: 13, color: TEXT }}>{g.l}</p>
                  <p style={{ fontSize: 11, color: MUTED }}>{g.s}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom — LLM Fabric */}
          <div className="mt-3 rounded-xl border-2 p-3 flex items-center justify-between"
            style={{ borderColor: `hsl(${PURPLE} / 0.4)`, background: `hsl(${PURPLE} / 0.06)` }}>
            <div className="flex items-center gap-2.5">
              <Cpu size={20} style={{ color: `hsl(${PURPLE})` }} />
              <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>Model Fabric</p>
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
        <Tag label="AACE v3.3 · The 4-Step Orchestration Loop" color={GREEN} />
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
function S08PricingMetering() {
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
      <PageNumber n={8} total={TOTAL} />
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
      <PageNumber n={9} total={TOTAL} />
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
      <PageNumber n={10} total={TOTAL} />
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
function S09bAugmentationMechanics() {
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
      <PageNumber n={11} total={TOTAL} />
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

// ─── Deck registry ───────────────────────────────────────────────────────────
const SLIDES = [
  { id: "cover", title: "Cover", component: <S01Cover /> },
  { id: "horizons", title: "Three Horizons Collapse", component: <S02Horizons /> },
  { id: "shift", title: "Infrastructure Shift", component: <S03Shift /> },
  { id: "iceberg", title: "Context Gap", component: <S03Iceberg /> },
  { id: "os-map", title: "OS Map", component: <S04OSMap /> },
  { id: "loop", title: "AACE Loop", component: <S05Loop /> },
  { id: "propagation", title: "Artifact Graph", component: <S06Propagation /> },
  { id: "metering", title: "Pricing Inversion + Metering", component: <S08PricingMetering /> },
  { id: "classifier", title: "Decision-Class Classifier", component: <S08bClassifier /> },
  { id: "augmentation", title: "Augmentation Engine", component: <S09Augmentation /> },
  { id: "augmentation-mechanics", title: "Augmentation Mechanics", component: <S09bAugmentationMechanics /> },
];

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

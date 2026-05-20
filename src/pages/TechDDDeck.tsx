import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  Database, Cpu, Layers, GitBranch, Workflow, ShieldCheck, Coins, TrendingDown,
  Gauge, Brain, Lock, Network, ArrowRight, ArrowDown, ChevronLeft, ChevronRight,
  Maximize2, X, Grid3x3, AlertCircle, Sparkles, FileText, Boxes, Radio, Zap,
  Eye, Activity, Users, GraduationCap,
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
function PhaseChip({ phase, owner, color = ACCENT }: { phase: string; owner: string; color?: string }) {
  return (
    <div className="absolute top-10 right-12 flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.25)` }}>
      <span className="font-mono tracking-[0.15em] uppercase font-semibold" style={{ fontSize: 13, color: `hsl(${color})` }}>{phase}</span>
      <span style={{ fontSize: 13, color: MUTED }}>· Owner: {owner}</span>
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

const TOTAL = 8;

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
// SLIDE 02 — INFRASTRUCTURE SHIFT (Data → Cognitive)
// ═════════════════════════════════════════════════════════════════════════════
function S02Shift() {
  const past = [
    { icon: Database, label: "Database", sub: "Rows, tables, schema" },
    { icon: Layers, label: "ORM / Logic", sub: "Hibernate, services" },
    { icon: Boxes, label: "Application", sub: "Deterministic UI" },
  ];
  const present = [
    { icon: Brain, label: "Language / Strategy", sub: "Intent, policy, judgment" },
    { icon: Network, label: "Semantic Layer", sub: "LIZA OS · executable knowledge" },
    { icon: Cpu, label: "LLM Runtime", sub: "Any model, governed" },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={2} total={TOTAL} />
      <PhaseChip phase="Phase 1 · Paradigm" owner="Kristóf" color={ACCENT} />
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

          {/* Present */}
          <div className="rounded-2xl border-2 p-10 relative" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.04)` }}>
            <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>The AI era</p>
            <p className="font-bold mb-8" style={{ fontSize: 36, color: TEXT }}>Cognitive Infrastructure</p>
            <div className="flex flex-col gap-4">
              {present.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center gap-5 p-5 rounded-xl bg-white border-2" style={{ borderColor: `hsl(${ACCENT} / 0.25)` }}>
                    <s.icon size={32} style={{ color: `hsl(${ACCENT})` }} />
                    <div>
                      <p className="font-semibold" style={{ fontSize: 22, color: TEXT }}>{s.label}</p>
                      <p style={{ fontSize: 17, color: MUTED }}>{s.sub}</p>
                    </div>
                  </div>
                  {i < present.length - 1 && <div className="flex justify-center my-1"><ArrowDown size={20} style={{ color: `hsl(${ACCENT})` }} /></div>}
                </div>
              ))}
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
      <PageNumber n={3} total={TOTAL} />
      <PhaseChip phase="Phase 1 · Paradigm" owner="Kristóf" color={ACCENT} />
      <div className="relative z-10 grid grid-cols-[1fr_900px] gap-16 items-center">
        <div>
          <Tag label="The Context Gap" />
          <h2 className="font-bold leading-[1.05]" style={{ fontSize: 72, color: TEXT, letterSpacing: "-0.025em" }}>
            RAG retrieves the 10%. <br />
            <span style={{ color: `hsl(${ACCENT})` }}>LIZA OS captures the 90%.</span>
          </h2>
          <p className="mt-10" style={{ fontSize: 26, color: MUTED, lineHeight: 1.4, maxWidth: 720 }}>
            Policies and records are visible and indexable. The reasoning that actually
            runs the company — exceptions, client memory, regulatory practice —
            lives in tacit form. LIZA turns it into executable code.
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
            <p className="font-bold mt-2" style={{ fontSize: 28, color: TEXT }}>Policies · Procedures · Records</p>
            <p style={{ fontSize: 16, color: MUTED, marginTop: 6 }}>What RAG retrieves today</p>
          </div>

          {/* Below water */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[26%] w-[760px] bottom-0 rounded-b-[40px] border-2 p-10 flex flex-col items-center justify-center text-center"
            style={{
              borderColor: `hsl(${ACCENT} / 0.4)`,
              background: `linear-gradient(180deg, hsl(${ACCENT} / 0.08), hsl(${ACCENT} / 0.18))`,
              clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
            }}>
            <p className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>Below water · 90%</p>
            <p className="font-bold mt-3" style={{ fontSize: 36, color: TEXT, lineHeight: 1.15 }}>Operating Reasoning</p>
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
      <Footer text="The Context Gap. LIZA OS encodes the 90% as Playbooks, Procedures, Directives, Knowledge and Preferences." />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — THE OS MAP (System Architecture)
// ═════════════════════════════════════════════════════════════════════════════
function S04OSMap() {
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={4} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" owner="Zoltán" color={GREEN} />
      <div className="relative z-10">
        <Tag label="The LIZA OS System Architecture" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-10" style={{ fontSize: 60, color: TEXT, letterSpacing: "-0.025em" }}>
          The Hibernate Pattern for AI — <span style={{ color: `hsl(${GREEN})` }}>organizational intelligence decoupled from the LLM.</span>
        </h2>

        {/* OS Map */}
        <div className="relative rounded-3xl border-2 p-8" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 600 }}>
          {/* Top — Leadership */}
          <div className="absolute left-8 right-8 top-8 rounded-xl border-2 p-4 flex items-center justify-between"
            style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.08)` }}>
            <div className="flex items-center gap-3">
              <Sparkles size={24} style={{ color: `hsl(${GOLD})` }} />
              <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>Leadership</p>
            </div>
            <p style={{ fontSize: 18, color: MUTED }}>Strategy injection ↓ &nbsp; · &nbsp; Telemetry ↑</p>
          </div>

          {/* Middle row: Inputs · Core · Surfaces */}
          <div className="absolute left-8 right-8 top-[120px] bottom-[120px] grid grid-cols-[1fr_1.4fr_1fr] gap-6">
            <div className="rounded-xl border-2 p-5 flex flex-col" style={{ borderColor: CHROME_BORDER, background: "white" }}>
              <div className="flex items-center gap-3 mb-3">
                <Database size={22} style={{ color: SUBTLE }} />
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>Systems of Record</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {["CRM · ERP", "Veeva · LIMS", "Docs · Wikis", "Email · Tickets"].map(s => (
                  <div key={s} className="px-3 py-2 rounded-lg border" style={{ fontSize: 17, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}>{s}</div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 p-5 flex flex-col" style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: `hsl(${GREEN} / 0.06)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Brain size={22} style={{ color: `hsl(${GREEN})` }} />
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>LIZA Decision Core</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { l: "Playbooks", s: "Multi-step protocols" },
                  { l: "Procedures", s: "Behavior patches" },
                  { l: "Directives", s: "Non-negotiable rules" },
                  { l: "Knowledge", s: "Authoritative facts" },
                  { l: "Artifacts", s: "Versioned outputs" },
                  { l: "Preferences", s: "Voice & format" },
                ].map(c => (
                  <div key={c.l} className="px-3 py-2 rounded-lg border bg-white" style={{ borderColor: `hsl(${GREEN} / 0.3)` }}>
                    <p className="font-semibold" style={{ fontSize: 16, color: TEXT }}>{c.l}</p>
                    <p style={{ fontSize: 13, color: MUTED }}>{c.s}</p>
                  </div>
                ))}
              </div>
              <p className="text-center mt-3 font-mono uppercase tracking-[0.15em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>AACE v3.3 runtime</p>
            </div>

            <div className="rounded-xl border-2 p-5 flex flex-col" style={{ borderColor: CHROME_BORDER, background: "white" }}>
              <div className="flex items-center gap-3 mb-3">
                <Eye size={22} style={{ color: SUBTLE }} />
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>AI Tools (Surfaces)</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {["Copilot", "Glean", "ChatGPT Enterprise", "Custom Agents"].map(s => (
                  <div key={s} className="px-3 py-2 rounded-lg border" style={{ fontSize: 17, color: TEXT, borderColor: CHROME_BORDER, background: CARD_ALT }}>{s}</div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: MUTED, marginTop: 8, fontStyle: "italic" }}>
                Not competitors — surfaces that get better reading our standard.
              </p>
            </div>
          </div>

          {/* Bottom — LLM Fabric */}
          <div className="absolute left-8 right-8 bottom-8 rounded-xl border-2 p-4 flex items-center justify-between"
            style={{ borderColor: `hsl(${PURPLE} / 0.4)`, background: `hsl(${PURPLE} / 0.06)` }}>
            <div className="flex items-center gap-3">
              <Cpu size={24} style={{ color: `hsl(${PURPLE})` }} />
              <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>LLM-Agnostic Fabric</p>
            </div>
            <p style={{ fontSize: 18, color: MUTED }}>OpenAI · Anthropic · Google · Mistral · on-prem</p>
          </div>
        </div>
      </div>
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
    { icon: Lock, label: "Decide", sub: "State-Lock. A Playbook is selected; the generalist LLM dies; routing locks the locked_playbook_id.", highlight: true },
    { icon: Zap, label: "Execute", sub: "A restricted micro-agent runs with only the approved Directives, Knowledge, Procedures injected as XML.", highlight: true },
    { icon: GitBranch, label: "Propagate", sub: "Outputs become versioned Artifacts; downstream nodes are flagged; the Rationale Log is written." },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={5} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" owner="Zoltán" color={GREEN} />
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
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{s.sub}</p>
                {s.highlight && (
                  <p className="mt-auto font-mono uppercase tracking-[0.15em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
                    ★ DD focus
                  </p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                  <ArrowRight size={28} style={{ color: SUBTLE }} />
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
function S06Propagation() {
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={6} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Architecture" owner="Zoltán" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Artifact Graph · State Management · Observability" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-10" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          One rule change. <span style={{ color: `hsl(${RED})` }}>Every downstream artifact instantly flagged.</span>
        </h2>

        <div className="grid grid-cols-[1.3fr_1fr] gap-12 items-start">
          {/* Tree */}
          <div className="rounded-2xl border p-10 relative" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 580 }}>
            {/* Root */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 px-6 py-4 rounded-xl border-2 flex items-center gap-3"
              style={{ borderColor: `hsl(${RED} / 0.5)`, background: `hsl(${RED} / 0.1)` }}>
              <ShieldCheck size={24} style={{ color: `hsl(${RED})` }} />
              <div>
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>Standard · GxP Deviation</p>
                <p style={{ fontSize: 14, color: `hsl(${RED})` }}>Rule v2.1 published</p>
              </div>
            </div>

            {/* Requirements row */}
            <div className="absolute left-0 right-0 top-[180px] flex justify-around px-12">
              {["Requirement A", "Requirement B"].map(r => (
                <div key={r} className="px-5 py-3 rounded-xl border-2 flex items-center gap-2"
                  style={{ borderColor: `hsl(${RED} / 0.4)`, background: `hsl(${RED} / 0.06)` }}>
                  <AlertCircle size={18} style={{ color: `hsl(${RED})` }} />
                  <p className="font-semibold" style={{ fontSize: 17, color: TEXT }}>{r}</p>
                </div>
              ))}
            </div>

            {/* Specs row */}
            <div className="absolute left-0 right-0 top-[320px] flex justify-around px-6">
              {["Spec A1", "Spec A2", "Spec B1", "Spec B2"].map(s => (
                <div key={s} className="px-4 py-2 rounded-lg border flex items-center gap-2"
                  style={{ borderColor: `hsl(${RED} / 0.35)`, background: `hsl(${RED} / 0.05)` }}>
                  <AlertCircle size={14} style={{ color: `hsl(${RED})` }} />
                  <p className="font-medium" style={{ fontSize: 15, color: TEXT }}>{s}</p>
                </div>
              ))}
            </div>

            {/* Reports row */}
            <div className="absolute left-0 right-0 bottom-10 flex justify-around px-4">
              {["Report-1", "Report-2", "Report-3", "Report-4"].map(s => (
                <div key={s} className="px-3 py-2 rounded-lg border flex items-center gap-2"
                  style={{ borderColor: `hsl(${RED} / 0.3)`, background: "white" }}>
                  <FileText size={13} style={{ color: `hsl(${RED})` }} />
                  <p style={{ fontSize: 14, color: TEXT }}>{s}</p>
                </div>
              ))}
            </div>

            {/* Connecting lines (decorative) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <g stroke={`hsl(${RED} / 0.3)`} strokeWidth="1.5" fill="none">
                <path d="M 50% 80 L 25% 180" />
                <path d="M 50% 80 L 75% 180" />
                <path d="M 25% 210 L 17% 320" />
                <path d="M 25% 210 L 38% 320" />
                <path d="M 75% 210 L 62% 320" />
                <path d="M 75% 210 L 83% 320" />
              </g>
            </svg>
          </div>

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
// SLIDE 07 — THE MARGIN TRAP
// ═════════════════════════════════════════════════════════════════════════════
function S07MarginTrap() {
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={7} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" owner="István" color={GOLD} />
      <div className="relative z-10">
        <Tag label="The AI Margin Trap" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-10" style={{ fontSize: 60, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Flat seats and OpenAI markups are a <span style={{ color: `hsl(${RED})` }}>race to the bottom.</span>
        </h2>

        <div className="grid grid-cols-[1.4fr_1fr] gap-12 items-stretch">
          {/* Chart */}
          <div className="rounded-2xl border p-8 relative" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 520 }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: 13, color: SUBTLE }}>$ per equivalent task · indexed</p>
            <svg viewBox="0 0 600 380" className="w-full h-[420px]">
              {/* axes */}
              <line x1="60" y1="20" x2="60" y2="340" stroke={GRID_LINE} strokeWidth="1" />
              <line x1="60" y1="340" x2="580" y2="340" stroke={GRID_LINE} strokeWidth="1" />
              {/* gridlines */}
              {[80, 160, 240].map(y => (
                <line key={y} x1="60" y1={y} x2="580" y2={y} stroke={GRID_LINE} strokeWidth="0.5" strokeDasharray="3 4" />
              ))}
              {/* Flat SaaS seat */}
              <line x1="60" y1="100" x2="580" y2="100" stroke={`hsl(${RED})`} strokeWidth="3" />
              <text x="570" y="92" textAnchor="end" fontSize="14" fill={`hsl(${RED})`} fontWeight="600">SaaS Seat Price — flat, getting squeezed</text>
              {/* LLM cost decay */}
              <path d="M 60 120 Q 220 180 360 280 T 580 320" stroke={`hsl(${ACCENT})`} strokeWidth="3" fill="none" />
              <text x="570" y="312" textAnchor="end" fontSize="14" fill={`hsl(${ACCENT})`} fontWeight="600">LLM API cost → 0</text>
              {/* Squeeze zone */}
              <path d="M 360 100 L 360 280 L 580 320 L 580 100 Z" fill={`hsl(${RED} / 0.08)`} />
              <text x="470" y="180" textAnchor="middle" fontSize="13" fill={`hsl(${RED})`} fontStyle="italic">margin compression</text>
              {/* axis labels */}
              <text x="60" y="360" fontSize="12" fill={SUBTLE}>2023</text>
              <text x="320" y="360" fontSize="12" fill={SUBTLE} textAnchor="middle">2025</text>
              <text x="580" y="360" fontSize="12" fill={SUBTLE} textAnchor="end">2027+</text>
            </svg>
          </div>

          {/* CFO callouts */}
          <div className="flex flex-col gap-4">
            {[
              { icon: TrendingDown, c: RED, h: "Tokens → commodity", s: "Frontier model pricing has dropped 10× in 18 months. Markups disappear." },
              { icon: Coins, c: RED, h: "Flat seats lose context", s: "Per-seat pricing makes power users a margin liability — and CFOs notice." },
              { icon: AlertCircle, c: RED, h: "Unanchored consumption", s: "Every token without a governance anchor is the first line a CFO cuts." },
              { icon: Gauge, c: GREEN, h: "The escape hatch", s: "Charge for governed decisions, not raw inference. → Slide 8." },
            ].map(c => (
              <div key={c.h} className="rounded-xl border-2 p-5 flex items-start gap-4"
                style={{ borderColor: `hsl(${c.c} / 0.3)`, background: `hsl(${c.c} / 0.05)` }}>
                <c.icon size={26} style={{ color: `hsl(${c.c})`, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{c.h}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35, marginTop: 4 }}>{c.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={RED} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — VALUE-BASED SEMANTIC METERING
// ═════════════════════════════════════════════════════════════════════════════
function S08Metering() {
  const tiers = [
    {
      mult: "25×", label: "Strategic Simulation", color: PURPLE, w: "60%",
      example: "War-game a market pivot · scenario-stress an investment thesis",
      anchor: "Anchored to a Strategy Playbook with board-level rules",
    },
    {
      mult: "5×", label: "Process Design & Governance", color: ACCENT, w: "80%",
      example: "Update a Playbook · run drift detection · change a Standard",
      anchor: "Anchored to a Governance Playbook with compliance state-lock",
    },
    {
      mult: "1×", label: "Operational Execution", color: GREEN, w: "100%",
      example: "Draft a memo · summarise a meeting · fill a template",
      anchor: "Anchored to an Operational Playbook (single-step Procedure)",
    },
  ];
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={8} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Commercial" owner="István" color={GOLD} />
      <div className="relative z-10">
        <Tag label="Value-Based Semantic Metering" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-8" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          We do not charge for the weight of the tokens. <span style={{ color: `hsl(${GOLD})` }}>We charge for the weight of the decision.</span>
        </h2>

        <div className="grid grid-cols-[1fr_1.1fr] gap-10 items-start">
          {/* Pyramid */}
          <div className="flex flex-col items-center gap-3">
            {tiers.map(t => (
              <div key={t.label} className="rounded-2xl border-2 p-5 flex flex-col items-center"
                style={{
                  width: t.w, minHeight: 130,
                  borderColor: `hsl(${t.color} / 0.5)`,
                  background: `linear-gradient(180deg, hsl(${t.color} / 0.1), hsl(${t.color} / 0.18))`,
                }}>
                <div className="flex items-baseline gap-3">
                  <span className="font-bold font-mono" style={{ fontSize: 44, color: `hsl(${t.color})` }}>{t.mult}</span>
                  <span className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 13, color: MUTED }}>credit multiplier</span>
                </div>
                <p className="font-bold text-center" style={{ fontSize: 22, color: TEXT, marginTop: 4 }}>{t.label}</p>
              </div>
            ))}
          </div>

          {/* Explanations */}
          <div className="flex flex-col gap-4">
            {tiers.map(t => (
              <div key={t.label} className="rounded-xl border-l-4 p-5" style={{ borderColor: `hsl(${t.color})`, background: CARD_ALT }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold font-mono px-3 py-1 rounded" style={{ fontSize: 16, color: `hsl(${t.color})`, background: `hsl(${t.color} / 0.12)` }}>{t.mult}</span>
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{t.label}</p>
                </div>
                <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>{t.example}</p>
                <p style={{ fontSize: 15, color: MUTED, fontStyle: "italic", marginTop: 4 }}>{t.anchor}</p>
              </div>
            ))}
            <div className="rounded-xl border-2 p-5 mt-2" style={{ borderColor: `hsl(${GOLD} / 0.4)`, background: `hsl(${GOLD} / 0.06)` }}>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>
                <span className="font-bold">Because the state is locked to a Playbook</span>, we know the
                exact business value of every execution. Revenue decouples from API cost and scales with strategic ROI.
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
// SLIDE 09 (pocket) — UPSKILLING ENGINE
// ═════════════════════════════════════════════════════════════════════════════
function S09Upskilling() {
  return (
    <div className="w-full h-full relative px-28 pt-28 pb-24" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-10 left-12 font-mono" style={{ fontSize: 14, color: SUBTLE, letterSpacing: "0.15em" }}>
        09 / 09 · POCKET SLIDE
      </div>
      <PhaseChip phase="Reserve · Impact Hurdle" owner="Zsombor" color={PURPLE} />
      <div className="relative z-10">
        <Tag label="The Upskilling Engine" color={PURPLE} />
        <h2 className="font-bold leading-[1.05] mb-14" style={{ fontSize: 64, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Liza prevents the <span style={{ color: `hsl(${PURPLE})` }}>erosion of expertise.</span>
        </h2>

        <div className="flex items-center justify-between gap-8 px-12">
          {/* Junior */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col items-center text-center"
            style={{ borderColor: CHROME_BORDER, background: CARD_ALT, minHeight: 360 }}>
            <Users size={56} style={{ color: SUBTLE }} />
            <p className="font-bold mt-5" style={{ fontSize: 32, color: TEXT }}>Junior employee</p>
            <p style={{ fontSize: 20, color: MUTED, marginTop: 8 }}>Ambitious. Capable. No 15-year scar tissue.</p>
          </div>

          <ArrowRight size={48} style={{ color: `hsl(${PURPLE})` }} />

          {/* Playbook */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col items-center text-center"
            style={{ borderColor: `hsl(${PURPLE} / 0.4)`, background: `hsl(${PURPLE} / 0.06)`, minHeight: 360 }}>
            <Brain size={56} style={{ color: `hsl(${PURPLE})` }} />
            <p className="font-bold mt-5" style={{ fontSize: 32, color: TEXT }}>Liza Playbook</p>
            <p style={{ fontSize: 20, color: MUTED, marginTop: 8 }}>The encoded decision-tree of senior staff. Just-in-time guidance.</p>
          </div>

          <ArrowRight size={48} style={{ color: `hsl(${PURPLE})` }} />

          {/* Senior output */}
          <div className="flex-1 rounded-2xl border-2 p-8 flex flex-col items-center text-center"
            style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.06)`, minHeight: 360 }}>
            <GraduationCap size={56} style={{ color: `hsl(${GREEN})` }} />
            <p className="font-bold mt-5" style={{ fontSize: 32, color: TEXT }}>Senior output</p>
            <p style={{ fontSize: 20, color: MUTED, marginTop: 8 }}>Same quality, same defensibility. Real-time, on-the-job upskilling.</p>
          </div>
        </div>
      </div>
      <Footer text="Reserve slide. Use if the Impact Hurdle (talent erosion, skills loss) comes up." />
      <SlideBar from={PURPLE} to={GREEN} />
    </div>
  );
}

// ─── Deck registry ───────────────────────────────────────────────────────────
const SLIDES = [
  { id: "cover", title: "Cover", component: <S01Cover /> },
  { id: "shift", title: "Infrastructure Shift", component: <S02Shift /> },
  { id: "iceberg", title: "Context Gap", component: <S03Iceberg /> },
  { id: "os-map", title: "OS Map", component: <S04OSMap /> },
  { id: "loop", title: "AACE Loop", component: <S05Loop /> },
  { id: "propagation", title: "Artifact Graph", component: <S06Propagation /> },
  { id: "trap", title: "Margin Trap", component: <S07MarginTrap /> },
  { id: "metering", title: "Semantic Metering", component: <S08Metering /> },
  { id: "upskilling", title: "Upskilling (Pocket)", component: <S09Upskilling /> },
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

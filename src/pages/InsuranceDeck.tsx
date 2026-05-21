import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Scale, ShieldAlert, TrendingDown, Database, Lock, Coins,
  CloudRain, FileSearch, FlaskConical, QrCode, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";

// ─── Scaled slide container with DRAFT / CONFIDENTIAL badges ─────────────────
function ScaledSlide({ children, isCover = false }: { children: React.ReactNode; isCover?: boolean }) {
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
        <div style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 14, zIndex: 50, pointerEvents: "none" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.18em", padding: "10px 20px", borderRadius: 6, background: "hsl(45 95% 42% / 0.18)", color: "hsl(38 90% 24%)", border: "2px solid hsl(45 95% 42% / 0.6)" }}>DRAFT</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.18em", padding: "10px 20px", borderRadius: 6, background: "hsl(0 72% 50% / 0.15)", color: "hsl(0 72% 36%)", border: "2px solid hsl(0 72% 50% / 0.6)" }}>HIGHLY CONFIDENTIAL</span>
        </div>
        {isCover && (
          <div style={{ position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              transform: "rotate(-22deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 220, fontWeight: 900, letterSpacing: "0.12em",
              color: "hsl(0 72% 50% / 0.10)",
              textShadow: "0 0 1px hsl(0 72% 50% / 0.18)",
              whiteSpace: "nowrap", lineHeight: 1, textAlign: "center",
            }}>
              <div>DRAFT</div>
              <div style={{ fontSize: 110, color: "hsl(45 95% 38% / 0.14)", marginTop: 20 }}>HIGHLY CONFIDENTIAL</div>
            </div>
          </div>
        )}
      </div>
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
function SlideBar({ from = GREEN, to = ACCENT }: { from?: string; to?: string }) {
  return <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />;
}
function Tag({ label, color = GREEN }: { label: string; color?: string }) {
  return <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 22, color: `hsl(${color})` }}>{label}</p>;
}
function PhaseChip({ phase, color = GREEN }: { phase: string; color?: string }) {
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
      style={{ color: dark ? DARK_MUTED : SUBTLE, fontSize: 14, letterSpacing: "0.02em" }}>
      <span style={{ width: 32, height: 1, background: dark ? "hsl(0 0% 100% / 0.2)" : CHROME_BORDER }} />
      <span>{text}</span>
    </div>
  );
}

const TOTAL = 10;

// ═════════════════════════════════════════════════════════════════════════════
// 01 · COVER
// ═════════════════════════════════════════════════════════════════════════════
function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-10" style={{ fontSize: 20, color: `hsl(${GREEN})` }}>
          LIZA OS · UAE Insurance · Executive Brief
        </p>
        <h1 className="font-bold leading-[1.02]" style={{ fontSize: 96, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          The Execution <span style={{ color: `hsl(${GREEN})` }}>Infrastructure Mandate.</span>
        </h1>
        <p className="mt-10 mx-auto" style={{ fontSize: 28, color: DARK_MUTED, lineHeight: 1.4, maxWidth: 1280 }}>
          Governing AI in the next era of UAE insurance. A response to <span className="font-semibold" style={{ color: DARK_TEXT }}>CBUAE 2025/2026 digital security mandates</span> and the post-2024 hyper-agility shock.
        </p>
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { i: ShieldAlert, t: "Audit-grade AI", s: "Every decision carries a rationale log" },
            { i: Lock, t: "State-locked playbooks", s: "AI bound to your CBUAE-approved standards" },
            { i: Coins, t: "Value-based metering", s: "Pay for decision weight, not raw tokens" },
          ].map(c => (
            <div key={c.t} className="rounded-xl border p-5 text-left" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.04)" }}>
              <c.i size={22} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold mt-2" style={{ fontSize: 18, color: DARK_TEXT }}>{c.t}</p>
              <p style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.4 }}>{c.s}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Prepared for a leading Middle East insurance group · Internal working draft · Not for distribution." dark />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 02 · THE PARADOX (balance scale)
// ═════════════════════════════════════════════════════════════════════════════
function S02Paradox() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={2} total={TOTAL} />
      <PhaseChip phase="Section 1 · The Pull" color={RED} />
      <div className="relative z-10">
        <Tag label="The UAE Insurance Paradox" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 60, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          A market moving <span style={{ color: `hsl(${RED})` }}>faster than ever</span>. Regulators demanding <span style={{ color: `hsl(${ACCENT})` }}>more traceability than ever.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          You are trying to bridge this gap with AI. The gap is not a tooling problem. It is an infrastructure problem.
        </p>

        <div className="grid grid-cols-[1fr_140px_1fr] gap-8 items-stretch max-w-[1700px]">
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${RED} / 0.4)`, background: `hsl(${RED} / 0.04)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-4" style={{ fontSize: 16, color: `hsl(${RED})` }}>Hyper-agility</p>
            <p className="font-bold mb-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.2 }}>Market shocks the old book cannot price.</p>
            <ul className="space-y-2" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>
              <li>• April 2024 floods: historic P&amp;C risk models broken overnight.</li>
              <li>• Health sector boom: claim volume scaling past manual review.</li>
              <li>• New Takaful and bancassurance products launching quarterly.</li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <Scale size={120} style={{ color: `hsl(${MUTED})` }} strokeWidth={1.2} />
          </div>
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.04)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-4" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>Absolute traceability</p>
            <p className="font-bold mb-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.2 }}>Regulators want every decision evidenced.</p>
            <ul className="space-y-2" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>
              <li>• CBUAE 2025/2026 digital security and AI mandates.</li>
              <li>• Consumer protection rules requiring decision rationale.</li>
              <li>• Cross-border data residency and audit trail enforcement.</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-[1700px]" style={{ fontSize: 22, color: TEXT, lineHeight: 1.45 }}>
          Most firms try to close this with a chatbot. A chatbot is the wrong shape of object. The right shape is <span className="font-semibold">execution infrastructure</span>.
        </p>
      </div>
      <Footer text="Sources: CBUAE regulatory roadmap 2024-2026 · UAE Insurance Authority bulletins · public market commentary." />
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 03 · DIGITAL INSIDER
// ═════════════════════════════════════════════════════════════════════════════
function S03DigitalInsider() {
  const roles = [
    { t: "Chief Underwriter", h: 60 },
    { t: "Claims Director", h: 60 },
    { t: "Compliance Officer", h: 60 },
  ];
  const juniors = [
    "Underwriter", "Claims Handler", "Actuary", "Customer Ops",
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={3} total={TOTAL} />
      <PhaseChip phase="Section 1 · The Pull" color={RED} />
      <div className="relative z-10">
        <Tag label="The Digital Insider Threat" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          You treat AI like a tool. It is acting like an <span style={{ color: `hsl(${RED})` }}>unsupervised insider.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          A junior underwriter would never sign off on a claim without an audit trail. Today, ungoverned generic AI does exactly that, dozens of times per hour, across every desk.
        </p>

        <div className="grid grid-cols-[1.3fr_1fr] gap-10 max-w-[1700px]">
          <div className="rounded-2xl border-2 p-8 relative" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <p className="font-mono uppercase tracking-[0.15em] font-bold mb-6" style={{ fontSize: 14, color: SUBTLE }}>Your organisation</p>
            <div className="flex justify-around mb-8">
              {roles.map(r => (
                <div key={r.t} className="rounded-lg border-2 px-5 py-4 text-center" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.06)` }}>
                  <p className="font-semibold" style={{ fontSize: 16, color: TEXT }}>{r.t}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-around">
              {juniors.map(j => (
                <div key={j} className="rounded-lg border px-4 py-3 text-center" style={{ borderColor: CHROME_BORDER, background: BG }}>
                  <p style={{ fontSize: 15, color: MUTED }}>{j}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 font-mono uppercase tracking-[0.12em]" style={{ fontSize: 13, color: SUBTLE }}>Hierarchy · oversight · audit log</p>
          </div>

          <div className="rounded-2xl border-2 p-8 flex flex-col justify-center relative" style={{ borderColor: `hsl(${RED} / 0.5)`, background: `hsl(${RED} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.15em] font-bold mb-5" style={{ fontSize: 14, color: `hsl(${RED})` }}>Outside the org chart</p>
            <ShieldAlert size={56} style={{ color: `hsl(${RED})` }} className="mb-4" />
            <p className="font-bold mb-3" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>Generic AI chatbot.</p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>
              Sensitive policyholder data pasted in. Decisions returned without provenance, without state-locking to your standards, without a rationale your CBUAE auditor can read.
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-[1700px]" style={{ fontSize: 22, color: TEXT, lineHeight: 1.45 }}>
          The fix is not banning AI. The fix is <span className="font-semibold">putting AI inside the same governance container</span> as every other actor in the firm.
        </p>
      </div>
      <Footer text="Pattern observed across UAE and GCC insurers in 2024-2025 desk research." />
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 04 · CONTEXT GAP TAX & SEMANTIC DEBT
// ═════════════════════════════════════════════════════════════════════════════
function S04Tax() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={4} total={TOTAL} />
      <PhaseChip phase="Section 1 · The Pull" color={RED} />
      <div className="relative z-10">
        <Tag label="The Context Gap Tax & Semantic Debt" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          AI speed without shared team standards is just <span style={{ color: `hsl(${RED})` }}>faster garbage.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          Token costs collapse every quarter. Enterprise AI spend climbs. The delta is rework, contradictions, and silent risk. We call it the <span className="font-semibold">Context Gap Tax</span>.
        </p>

        <div className="grid grid-cols-[1.4fr_1fr] gap-10 max-w-[1700px]">
          {/* Chart */}
          <div className="rounded-2xl border-2 p-8 relative" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 460 }}>
            <p className="font-mono uppercase tracking-[0.15em] font-bold mb-2" style={{ fontSize: 14, color: SUBTLE }}>Token cost vs. enterprise AI spend (illustrative)</p>
            <svg viewBox="0 0 600 320" className="w-full" style={{ height: 360 }}>
              {/* axes */}
              <line x1="60" y1="280" x2="580" y2="280" stroke="hsl(215 15% 75%)" strokeWidth="1.5"/>
              <line x1="60" y1="20" x2="60" y2="280" stroke="hsl(215 15% 75%)" strokeWidth="1.5"/>
              {/* token cost dropping */}
              <path d="M 60 60 Q 200 90 320 180 T 580 250" stroke={`hsl(${ACCENT})`} strokeWidth="3" fill="none"/>
              <text x="320" y="200" fill={`hsl(${ACCENT})`} fontSize="14" fontWeight="700">Token cost ↓</text>
              {/* enterprise spend rising */}
              <path d="M 60 240 Q 220 220 360 130 T 580 50" stroke={`hsl(${RED})`} strokeWidth="3" fill="none"/>
              <text x="380" y="100" fill={`hsl(${RED})`} fontSize="14" fontWeight="700">Enterprise AI spend ↑</text>
              {/* gap shading */}
              <path d="M 360 130 L 580 50 L 580 250 L 320 180 Z" fill={`hsl(${GOLD} / 0.18)`}/>
              <text x="470" y="170" fill="hsl(38 90% 28%)" fontSize="18" fontWeight="800">~40% rework gap</text>
              <text x="60" y="305" fill={SUBTLE} fontSize="11">2023</text>
              <text x="560" y="305" fill={SUBTLE} fontSize="11">2026</text>
            </svg>
          </div>

          <div className="space-y-4">
            {[
              { i: TrendingDown, c: ACCENT, t: "Token deflation",   s: "OpenAI and Google have cut frontier token prices by 80%+ in 24 months." },
              { i: Coins,        c: RED,    t: "Enterprise inflation", s: "Real spend rises because every team reruns the same prompt to chase a different answer." },
              { i: FileSearch,   c: GOLD,   t: "Semantic Debt",     s: "Senior and junior staff use the same words for different things. AI compounds the contradiction at machine speed." },
            ].map(b => (
              <div key={b.t} className="rounded-xl border p-5" style={{ borderColor: `hsl(${b.c} / 0.35)`, background: `hsl(${b.c} / 0.04)` }}>
                <div className="flex items-center gap-3 mb-1">
                  <b.i size={22} style={{ color: `hsl(${b.c})` }} />
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{b.t}</p>
                </div>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{b.s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer text="Context Gap Tax: the hidden rework cost paid when AI scales inconsistent definitions across a firm." />
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 05 · COGNITIVE INFRASTRUCTURE (iceberg)
// ═════════════════════════════════════════════════════════════════════════════
function S05Iceberg() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={5} total={TOTAL} />
      <PhaseChip phase="Section 2 · The Pivot" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="From Data Infrastructure to Cognitive Infrastructure" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Yesterday&apos;s stack stored <span style={{ color: SUBTLE }}>data.</span> Today&apos;s must store <span style={{ color: `hsl(${ACCENT})` }}>reasoning.</span>
        </h2>

        <div className="grid grid-cols-[1fr_1fr] gap-10 max-w-[1700px] mt-8">
          {/* Iceberg visual */}
          <div className="relative rounded-2xl border-2 overflow-hidden" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, height: 480 }}>
            <div className="absolute top-0 left-0 right-0 h-[28%] flex items-center justify-center" style={{ background: `hsl(${ACCENT} / 0.10)` }}>
              <div className="text-center">
                <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>Above water · 10%</p>
                <p className="font-bold mt-2" style={{ fontSize: 30, color: TEXT }}>Data</p>
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.35, maxWidth: 360, margin: "8px auto 0" }}>
                  Policies, claim docs, customer records. Already in your DWH and core systems.
                </p>
              </div>
            </div>
            <div className="absolute left-0 right-0 top-[28%] h-[1px]" style={{ background: `hsl(${ACCENT} / 0.5)` }} />
            <div className="absolute top-[28%] left-0 right-0 bottom-0 flex items-center justify-center" style={{ background: `hsl(222 25% 15%)` }}>
              <div className="text-center">
                <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Below water · 90%</p>
                <p className="font-bold mt-2" style={{ fontSize: 36, color: DARK_TEXT }}>Cognitive layer</p>
                <ul className="mt-4 space-y-1" style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.4 }}>
                  <li>Operating reasoning behind each decision</li>
                  <li>Tacit judgment of your senior underwriters</li>
                  <li>Escalation, exception, and override logic</li>
                  <li>Standards locked to CBUAE compliance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border-2 p-6" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.05)` }}>
              <Database size={26} style={{ color: `hsl(${ACCENT})` }} />
              <p className="font-bold mt-2" style={{ fontSize: 26, color: TEXT }}>LIZA OS is not another chatbot.</p>
              <p className="mt-2" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>
                It is the <span className="font-semibold" style={{ color: TEXT }}>execution infrastructure</span> that sits between your systems of record and your AI models. It compiles your standards into context the model is forced to obey.
              </p>
            </div>
            <div className="rounded-xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
              <p className="font-mono uppercase tracking-[0.15em] font-bold mb-2" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>What this changes</p>
              <ul className="space-y-1" style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }}>
                <li>• AI inherits your firm&apos;s judgment, not the open internet&apos;s.</li>
                <li>• Senior expertise compounds instead of leaving with the person.</li>
                <li>• Every output is auditable by construction, not by hope.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer text="The cognitive layer is the structural majority of insurance work. It has never had its own infrastructure. Until now." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 06 · AACE COMPLIANCE LOOP
// ═════════════════════════════════════════════════════════════════════════════
function S06AACE() {
  const steps = [
    { n: "01", t: "Sense",     s: "Classify intent. Detect which CBUAE-bound playbook applies (claims, underwriting, KYC, complaints).", c: ACCENT },
    { n: "02", t: "Decide · State-Lock", s: "Lock the AI into the approved playbook. No improvisation, no off-standard answers, for the duration of the task.", c: GREEN },
    { n: "03", t: "Execute",   s: "Compile your directives, knowledge, procedures, preferences into the model context. Run the action.", c: GOLD },
    { n: "04", t: "Propagate", s: "Emit a Unified Rationale Log: every input, every standard cited, every output. Auditor-ready by construction.", c: PURPLE },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={6} total={TOTAL} />
      <PhaseChip phase="Section 2 · The Pivot" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="The Compliance Container · AACE v3.1" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Adaptive Agentic Context Engine. <span style={{ color: `hsl(${ACCENT})` }}>Four steps. One audit trail.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          AACE is the runtime that turns your firm&apos;s standards into a context the model is locked to. It is how we make AI 100% auditable for CBUAE.
        </p>

        <div className="grid grid-cols-4 gap-5 max-w-[1700px]">
          {steps.map((s, i) => (
            <div key={s.n} className="rounded-2xl border-2 p-6 relative" style={{ borderColor: `hsl(${s.c} / 0.4)`, background: `hsl(${s.c} / 0.04)`, minHeight: 320 }}>
              <p className="font-mono font-bold" style={{ fontSize: 14, color: `hsl(${s.c})`, letterSpacing: "0.15em" }}>STEP {s.n}</p>
              <p className="font-bold mt-3 mb-3" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>{s.t}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{s.s}</p>
              {i < steps.length - 1 && (
                <ArrowRight size={28} style={{ position: "absolute", right: -20, top: "50%", color: `hsl(${s.c})`, background: BG, borderRadius: 999 }} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border-2 px-6 py-5 max-w-[1700px]" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
          <p className="font-bold mb-1" style={{ fontSize: 22, color: TEXT }}>The Unified Rationale Log.</p>
          <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.45 }}>
            One artefact per decision. Cites the directive, the knowledge, the procedure, and the operator. This is what a CBUAE auditor reads. Not a chat transcript.
          </p>
        </div>
      </div>
      <Footer text="AACE v3.1 master specification on request · State-locked, full-context, just-in-time injection." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 07 · VALUE-BASED METERING
// ═════════════════════════════════════════════════════════════════════════════
function S07Metering() {
  const tiers = [
    { x: "1×",  t: "Operational",  s: "Draft a routine policyholder email. Summarise a call. Retrieve a clause.", c: SUBTLE, ex: "Per-token, low" },
    { x: "5×",  t: "Design",       s: "Underwrite a non-standard SME risk. Triage a complex motor claim with exceptions.", c: ACCENT, ex: "Per decision, mid" },
    { x: "25×", t: "Strategic",    s: "War-game a new Takaful product. Stress-test a bancassurance launch. Re-price a portfolio after a market shock.", c: GREEN, ex: "Per outcome, high" },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={7} total={TOTAL} />
      <PhaseChip phase="Section 2 · The Pivot" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="The CFO Mandate · Value-Based Metering" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Pay for the <span style={{ color: `hsl(${GREEN})` }}>weight of the decision</span>, not for raw compute.
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          By 2027, AI moves from flat seats to metered consumption. Without a governance layer, every token is unanchored. LIZA ties every token to a standard and an outcome. Your unit economics become defensible.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-[1700px]">
          {tiers.map(t => (
            <div key={t.x} className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${t.c} / 0.4)`, background: `hsl(${t.c} / 0.05)`, minHeight: 360 }}>
              <p className="font-mono font-bold" style={{ fontSize: 64, color: `hsl(${t.c})`, lineHeight: 1 }}>{t.x}</p>
              <p className="font-bold mt-3 mb-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.15 }}>{t.t}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>{t.s}</p>
              <div className="mt-5 pt-4 border-t" style={{ borderColor: CHROME_BORDER }}>
                <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 13, color: SUBTLE }}>Meter</p>
                <p className="font-semibold mt-1" style={{ fontSize: 18, color: TEXT }}>{t.ex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Aligned with the 2026-2027 industry shift from flat AI seats to metered consumption." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 08 · THREE CAPABILITIES
// ═════════════════════════════════════════════════════════════════════════════
function S08Capabilities() {
  const caps = [
    {
      i: CloudRain, c: ACCENT, n: "01",
      t: "Commercial P&C Underwriting",
      sub: "Adapting to market shocks.",
      story: "April 2024 floods broke historic risk models. A Senior Underwriter updates the Flood Risk Playbook once. Every junior underwriter, every AI copilot across the firm is instantly locked to the new standard.",
      out: "Knowledge compounds instantly. No more retraining month.",
    },
    {
      i: FileSearch, c: GREEN, n: "02",
      t: "High-Volume Claims & Exceptions",
      sub: "Defensible scaling.",
      story: "On health and motor claim flows, LIZA cross-references the medical report against UAE policy. Instead of a black-box answer, it flags exceptions and produces an audit-grade rationale chain showing exactly why the claim was routed.",
      out: "Throughput up. Hallucination risk replaced with provenance.",
    },
    {
      i: FlaskConical, c: PURPLE, n: "03",
      t: "Actuarial & Strategic Rehearsal",
      sub: "Decision rehearsal, not war-gaming theatre.",
      story: "Launching a new Takaful product. LIZA runs multi-agent simulation against UAE market demographics, regulatory constraints, and your internal capital model. Stress-tests the product before capital is committed.",
      out: "A defensible sounding board for the exco, with a rationale log.",
    },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={8} total={TOTAL} />
      <PhaseChip phase="Section 3 · The Push" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Three Risk Centres. One Infrastructure." color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          What execution infrastructure looks like in your <span style={{ color: `hsl(${GREEN})` }}>most regulated workflows.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          We are vertical-agnostic about which line of business you start in. We are non-negotiable about state-locking, rationale logging, and value-based metering in all three.
        </p>

        <div className="grid grid-cols-3 gap-5 max-w-[1750px]">
          {caps.map(c => (
            <div key={c.n} className="rounded-2xl border-2 p-6 flex flex-col" style={{ borderColor: `hsl(${c.c} / 0.4)`, background: `hsl(${c.c} / 0.04)`, minHeight: 520 }}>
              <div className="flex items-center justify-between mb-3">
                <c.i size={32} style={{ color: `hsl(${c.c})` }} />
                <span className="font-mono font-bold" style={{ fontSize: 14, color: `hsl(${c.c})`, letterSpacing: "0.15em" }}>CAP {c.n}</span>
              </div>
              <p className="font-bold mb-1" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>{c.t}</p>
              <p className="font-mono uppercase tracking-[0.12em] mb-4" style={{ fontSize: 13, color: `hsl(${c.c})` }}>{c.sub}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{c.story}</p>
              <div className="mt-auto pt-5 border-t" style={{ borderColor: `hsl(${c.c} / 0.3)` }}>
                <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 12, color: SUBTLE }}>Outcome</p>
                <p className="font-semibold mt-1" style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>{c.out}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Same infrastructure. Three risk-bearing surfaces. Pick the wedge with the highest CBUAE exposure first." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 09 · THE WEDGE · DIAGNOSTIC + 30-DAY KICKSTART
// ═════════════════════════════════════════════════════════════════════════════
function S09Wedge() {
  const days = [
    { d: "Day 0-3",   t: "Scope a single pod", s: "Pick one workflow. Typically claims exceptions or commercial underwriting." },
    { d: "Day 4-14",  t: "Encode the standard", s: "Capture senior judgment as state-locked playbooks. Wire into LIZA OS." },
    { d: "Day 15-25", t: "Run in shadow", s: "AI runs alongside the team. Every decision logged. Deltas measured." },
    { d: "Day 26-30", t: "ROI readout", s: "Time-to-decision, exception accuracy, audit-readiness deltas. Go/no-go to expand." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={9} total={TOTAL} />
      <PhaseChip phase="Section 4 · The Close" color={GOLD} />
      <div className="relative z-10">
        <Tag label="The Wedge · Diagnostic + 30-Day Kickstart" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          We do not start with a <span style={{ color: `hsl(${RED})` }}>risky enterprise rollout.</span> We start with <span style={{ color: `hsl(${GREEN})` }}>truth.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          Step one: measure the leak. Step two: prove the fix on one pod. Step three: scale only what worked.
        </p>

        <div className="grid grid-cols-[1fr_1.6fr] gap-10 max-w-[1750px]">
          <div className="rounded-2xl border-2 p-7 flex flex-col items-center text-center" style={{ borderColor: `hsl(${GOLD} / 0.45)`, background: `hsl(${GOLD} / 0.06)` }}>
            <QrCode size={120} style={{ color: `hsl(${GOLD})` }} strokeWidth={1.3} />
            <p className="font-bold mt-5" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>90-Second AI Diagnostic</p>
            <p className="mt-3" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>
              Your department heads measure the firm&apos;s current <span className="font-semibold" style={{ color: TEXT }}>Semantic Debt</span> and Context Gap exposure in under two minutes.
            </p>
            <p className="mt-4 font-mono" style={{ fontSize: 15, color: SUBTLE }}>lizaos.ai/diagnostic</p>
          </div>

          <div>
            <p className="font-mono uppercase tracking-[0.15em] font-bold mb-4" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>If the leak is severe → 30-Day Guided Kickstart</p>
            <div className="space-y-3">
              {days.map((d, i) => (
                <div key={d.d} className="rounded-xl border p-5 grid grid-cols-[140px_1fr_2fr] gap-5 items-center" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                  <span className="font-mono font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>{d.d}</span>
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{d.t}</p>
                  <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{d.s}</p>
                </div>
              ))}
            </div>
            <p className="mt-5" style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
              One pod. Thirty days. Measurable deltas. Then we earn the right to expand.
            </p>
          </div>
        </div>
      </div>
      <Footer text="Low-friction entry · High-status outcome · ROI proven in your environment before any platform commitment." />
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 10 · TWO DOORS · DECISION
// ═════════════════════════════════════════════════════════════════════════════
function S10Decision() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: DARK_BG }}>
      <DarkGrid />
      <PageNumber n={10} total={TOTAL} dark />
      <PhaseChip phase="Section 4 · The Close" color={GREEN} />
      <div className="relative z-10">
        <p className="font-semibold tracking-[0.3em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>The Decision · Two Doors</p>
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 60, color: DARK_TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Become a <span style={{ color: `hsl(${GREEN})` }}>customer</span>, or become a <span style={{ color: `hsl(${ACCENT})` }}>design partner</span>.
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: DARK_MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          Both doors start with the same 30-day proof. The difference is whether you also help define the GCC insurance reference architecture for AI execution.
        </p>

        <div className="grid grid-cols-2 gap-8 max-w-[1700px]">
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: "hsl(0 0% 100% / 0.04)", minHeight: 420 }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>Door 1 · Customer</p>
            <p className="font-bold mb-3" style={{ fontSize: 34, color: DARK_TEXT, lineHeight: 1.15 }}>30-Day Guided Kickstart on one pod.</p>
            <ul className="space-y-2 mt-4" style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.45 }}>
              <li>• One workflow, state-locked, audit-grade.</li>
              <li>• Unified Rationale Log live from day 15.</li>
              <li>• ROI readout against your own baseline.</li>
              <li>• Path to firm-wide rollout earned, not assumed.</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${ACCENT} / 0.5)`, background: "hsl(0 0% 100% / 0.04)", minHeight: 420 }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 15, color: `hsl(${ACCENT})` }}>Door 2 · Design Partner</p>
            <p className="font-bold mb-3" style={{ fontSize: 34, color: DARK_TEXT, lineHeight: 1.15 }}>Co-define the CBUAE-grade reference architecture.</p>
            <ul className="space-y-2 mt-4" style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.45 }}>
              <li>• Strategic stake in the insurance memory layer.</li>
              <li>• Co-authorship of the regional standard playbooks.</li>
              <li>• Priority on regulator-facing audit features.</li>
              <li>• First-mover position in the Middle East market.</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-[1700px]" style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>
          Next step: a 60-minute working session with two of your line-of-business heads and our architect. We leave with a scoped pod and a 30-day plan, or we don&apos;t come back.
        </p>
      </div>
      <Footer text="LIZA OS · Execution Infrastructure for AI-native insurance · lizaos.ai" dark />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

const SLIDES = [
  { id: "cover",         title: "Cover · Execution Mandate",       component: <S01Cover /> },
  { id: "paradox",       title: "UAE Insurance Paradox",            component: <S02Paradox /> },
  { id: "insider",       title: "Digital Insider Threat",           component: <S03DigitalInsider /> },
  { id: "tax",           title: "Context Gap Tax",                  component: <S04Tax /> },
  { id: "iceberg",       title: "Cognitive Infrastructure",         component: <S05Iceberg /> },
  { id: "aace",          title: "AACE Compliance Loop",             component: <S06AACE /> },
  { id: "metering",      title: "Value-Based Metering",             component: <S07Metering /> },
  { id: "capabilities",  title: "Three Capabilities",               component: <S08Capabilities /> },
  { id: "wedge",         title: "Diagnostic + 30-Day Kickstart",    component: <S09Wedge /> },
  { id: "decision",      title: "Two Doors · Decision",             component: <S10Decision /> },
];

// ─── Deck shell ──────────────────────────────────────────────────────────────
export default function InsuranceDeck() {
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
        <ScaledSlide isCover={slide.id === "cover"}>{slide.component}</ScaledSlide>
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Insurance-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
        <ScaledSlide isCover={slide.id === "cover"}>{slide.component}</ScaledSlide>
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Insurance Executive Brief</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            UAE · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Draft · Highly Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Insurance-Deck" slideCount={SLIDES.length} variant="desktop" />
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
                <ScaledSlide isCover={s.id === "cover"}>{s.component}</ScaledSlide>
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
                      <ScaledSlide isCover={s.id === "cover"}>{s.component}</ScaledSlide>
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
                <ScaledSlide isCover={slide.id === "cover"}>{slide.component}</ScaledSlide>
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
import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  User, Building2, KeyRound, FileSignature, ArrowLeftRight, Package,
  ArrowRight, ShieldCheck, Globe, Sparkles, Brain, HeartHandshake,
  GraduationCap, LineChart, Target, Scale, HelpCircle, Compass,
  CheckCircle2, AlertTriangle, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";

// ─── Scaled slide container ──────────────────────────────────────────────────
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
              fontSize: 220,
              fontWeight: 900,
              letterSpacing: "0.12em",
              color: "hsl(0 72% 50% / 0.10)",
              textShadow: "0 0 1px hsl(0 72% 50% / 0.18)",
              whiteSpace: "nowrap",
              lineHeight: 1,
              textAlign: "center",
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

const TOTAL = 11;

// ═════════════════════════════════════════════════════════════════════════════
// 01 , COVER
// ═════════════════════════════════════════════════════════════════════════════
function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-10" style={{ fontSize: 20, color: `hsl(${GREEN})` }}>
          LIZA OS · Impact Thesis · Internal Diligence Brief
        </p>
        <h1 className="font-bold leading-[1.02]" style={{ fontSize: 96, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          Why keep humans <span style={{ color: `hsl(${GREEN})` }}>in the age of AI.</span>
        </h1>
        <p className="mt-10 mx-auto" style={{ fontSize: 26, color: DARK_MUTED, lineHeight: 1.4, maxWidth: 1280 }}>
          When AI does the execution, the value moves to <span className="font-semibold" style={{ color: DARK_TEXT }}>judgment, taste, and accountability</span> , and to whoever owns the encoded record of those decisions. This brief explains how LIZA generates measurable impact by giving that record to the individual.
        </p>
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { i: HeartHandshake, t: "Human-centred", s: "Augmentation, not displacement" },
            { i: KeyRound,       t: "Knowledge sovereignty", s: "The individual owns the bundle" },
            { i: LineChart,      t: "Measurable",  s: "IMP-aligned, per-bundle outcomes" },
          ].map(c => (
            <div key={c.t} className="rounded-xl border p-5 text-left" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.04)" }}>
              <c.i size={22} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold mt-2" style={{ fontSize: 18, color: DARK_TEXT }}>{c.t}</p>
              <p style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.4 }}>{c.s}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer text="LIZA OS · Impact thesis for internal investment-committee review · Companion to the Tech DD deck." dark />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 02 , THE CORE QUESTION
// ═════════════════════════════════════════════════════════════════════════════
function S02Question() {
  const layers = [
    { t: "Execution", s: "Drafting, summarising, coding, searching", who: "AI does this , faster, cheaper, every year more so.", color: SUBTLE, w: 30 },
    { t: "Judgment",  s: "Choosing what is right, for whom, under which constraint", who: "Human , but only if it is captured, repeatable, defensible.", color: ACCENT, w: 65 },
    { t: "Accountability", s: "Standing behind the decision when it goes wrong", who: "Human , non-delegable. Law, ethics, and trust live here.", color: GREEN, w: 90 },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={2} total={TOTAL} />
      <PhaseChip phase="Phase 1 · The Question" color={GREEN} />
      <div className="relative z-10">
        <Tag label="The Core Question" />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          If AI does the execution, <span style={{ color: `hsl(${GREEN})` }}>what is the human&apos;s job , and how do we prove it?</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          The honest answer is not &ldquo;everything as before&rdquo;. The work splits into three layers. Two of them collapse onto AI. One does not , and it is the layer where impact, value, and dignity now live.
        </p>

        <div className="grid grid-cols-1 gap-4 max-w-[1600px]">
          {layers.map((l, i) => (
            <div key={l.t} className="rounded-2xl border-2 p-6 grid grid-cols-[260px_1fr_1fr_120px] gap-6 items-center"
              style={{ borderColor: `hsl(${l.color} / 0.4)`, background: `hsl(${l.color} / 0.05)` }}>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold" style={{ fontSize: 18, color: `hsl(${l.color})` }}>L{i+1}</span>
                <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>{l.t}</p>
              </div>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{l.s}</p>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>{l.who}</p>
              <div className="flex flex-col items-end">
                <span className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: 11, color: SUBTLE }}>Human share</span>
                <span className="font-mono font-bold" style={{ fontSize: 28, color: `hsl(${l.color})` }}>{l.w}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border-2 px-6 py-4 max-w-[1600px]" style={{ borderColor: `hsl(${GREEN} / 0.35)`, background: `hsl(${GREEN} / 0.05)` }}>
          <p className="font-bold mb-1" style={{ fontSize: 20, color: TEXT }}>
            Our thesis , in one line.
          </p>
          <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>
            The infrastructure that <span className="font-semibold" style={{ color: TEXT }}>captures, versions, and ports the judgment layer</span> back to the individual is what keeps humans valuable, employable, and accountable in an AI-native economy. That infrastructure is LIZA. That is the impact.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 03 , WHAT IMPACT INVESTING MEANS (IMP framework)
// ═════════════════════════════════════════════════════════════════════════════
function S03IMP() {
  const dims = [
    { d: "WHAT",         q: "What outcome does the enterprise contribute to, and how important is it to the people experiencing it?",
      a: "Workers retain economic agency as AI absorbs execution. WEF 2025 names this as the top systemic risk to labour markets.", color: GREEN, i: Target },
    { d: "WHO",          q: "Who experiences the outcome, and how underserved are they relative to it?",
      a: "Knowledge workers across functions whose tacit judgment is currently uncaptured and non-portable , the structural majority of the workforce.", color: ACCENT, i: User },
    { d: "HOW MUCH",     q: "How much of the outcome occurs in the time period , in scale, depth, and duration?",
      a: "Per active bundle: ≥ 200 captured judgment moments / yr, ≥ 6 Core 2030 skills exercised, lifetime portable record.", color: GOLD, i: LineChart },
    { d: "CONTRIBUTION", q: "Would this outcome occur anyway without the enterprise?",
      a: "No. Without a person-signed standard, the bundle defaults to employer IP. We are the only layer making it individually owned and portable.", color: PURPLE, i: HeartHandshake },
    { d: "RISK",         q: "What is the risk to people and planet that impact does not occur as expected?",
      a: "Two material risks , (1) capture by an employer or platform, (2) measurement gaming. Both are mitigated by signed, audited, open-standard bundles.", color: RED, i: AlertTriangle },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={3} total={TOTAL} />
      <PhaseChip phase="Phase 1 · Frame" color={GREEN} />
      <div className="relative z-10">
        <Tag label="What Impact Investing Actually Asks For" />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The IMP <span style={{ color: `hsl(${GREEN})` }}>five dimensions</span> , the standard the committee will apply.
        </h2>
        <p className="mb-8" style={{ fontSize: 19, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          The Impact Management Project framework (now stewarded by Impact Frontiers, adopted by GIIN, B Lab, and most DFIs) reduces &ldquo;impact&rdquo; to five answerable questions. Anything that does not answer all five is marketing, not impact. Here is how LIZA answers each.
        </p>

        <div className="grid grid-cols-1 gap-3 max-w-[1700px]">
          {dims.map(d => (
            <div key={d.d} className="rounded-xl border-2 p-5 grid grid-cols-[200px_1.1fr_1.4fr] gap-6 items-center"
              style={{ borderColor: `hsl(${d.color} / 0.4)`, background: `hsl(${d.color} / 0.04)` }}>
              <div className="flex items-center gap-3">
                <d.i size={26} style={{ color: `hsl(${d.color})` }} />
                <span className="font-mono font-bold tracking-[0.12em]" style={{ fontSize: 18, color: `hsl(${d.color})` }}>{d.d}</span>
              </div>
              <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4, fontStyle: "italic" }}>{d.q}</p>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>{d.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Source: Impact Management Project (Impact Frontiers, 2023). Aligned with GIIN IRIS+, B Lab, and the EU SFDR Principal Adverse Indicators." />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 04 , STRUCTURAL PROBLEM
// ═════════════════════════════════════════════════════════════════════════════
function S04Problem() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={4} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Problem" color={RED} />
      <div className="relative z-10">
        <Tag label="The Structural Problem" color={RED} />
        <h2 className="font-bold leading-[1.04] mb-3" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          AI is absorbing the work, but <span style={{ color: `hsl(${RED})` }}>the encoded judgment is being captured by employers and platforms.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          Every prompt, correction, playbook, and decision a worker contributes today becomes training data, fine-tuning weight, or proprietary context owned by the employer or the model vendor. The individual leaves empty-handed. The market for their judgment thins.
        </p>

        <div className="grid grid-cols-3 gap-5 max-w-[1700px]">
          {[
            { t: "Career capital evaporates", s: "A decade of judgment, encoded into someone else&rsquo;s system. When you leave, you take a CV, not a context graph.", c: RED, n: "01" },
            { t: "Reskilling becomes brittle", s: "Training programmes target generic skills. The actual reskilling unit , encoded, role-specific judgment , is invisible and untransferable.", c: GOLD, n: "02" },
            { t: "Inequality compounds", s: "Whoever owns the model + the context wins twice. Workers who only supply labour to refine it absorb the downside without the upside.", c: PURPLE, n: "03" },
          ].map(p => (
            <div key={p.t} className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${p.c} / 0.4)`, background: `hsl(${p.c} / 0.05)` }}>
              <span className="font-mono font-bold" style={{ fontSize: 16, color: `hsl(${p.c})`, letterSpacing: "0.15em" }}>{p.n}</span>
              <p className="font-bold mt-2 mb-2" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>{p.t}</p>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: p.s }} />
            </div>
          ))}
        </div>

        <div className="mt-7 rounded-xl border px-6 py-4 max-w-[1700px]" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
          <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
            <span className="font-bold">What good looks like.</span> The unit that needs to become portable is not the CV and not the model , it is the <span className="font-semibold" style={{ color: `hsl(${GREEN})` }}>encoded judgment graph</span>: playbooks, skill-agents, decision rationale, and outcome telemetry, signed to the individual. That object does not exist today. We build it.
          </p>
        </div>
      </div>
      <Footer text="WEF Future of Jobs 2025 · 39% of current skill sets become outdated by 2030; reskilling reaches only ~50% of the affected workforce on current trajectory." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 05 , THE UNIT OF IMPACT: PORTABLE CONTEXT BUNDLE
// ═════════════════════════════════════════════════════════════════════════════
function S05Bundle() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={5} total={TOTAL} />
      <PhaseChip phase="Phase 2 · Mechanism" color={GREEN} />
      <div className="relative z-10">
        <Tag label="The Unit of Impact" />
        <h2 className="font-bold leading-[1.04] mb-3" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          One <span style={{ color: `hsl(${GREEN})` }}>Portable Context Bundle</span> = one human&apos;s encoded judgment, signed and carried.
        </h2>
        <p className="mb-8" style={{ fontSize: 19, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          The bundle is the smallest object that satisfies all five IMP dimensions. It is what we count, what we measure, and what we attribute outcomes to. Mechanically it is the same artefact described in the Tech DD deck (Slide 15) , here, it is reframed as the unit of impact.
        </p>

        <div className="grid grid-cols-[1.5fr_1fr] gap-8 items-start">
          {/* Diagram */}
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
              Person-signed · employer-deployed · zero lock-in
            </p>
            <div className="relative rounded-xl p-6" style={{ background: "white", border: `1px solid ${CHROME_BORDER}`, minHeight: 380 }}>
              <div className="absolute" style={{ left: 24, top: "50%", transform: "translateY(-50%)", width: 170 }}>
                <div className="rounded-xl border-2 p-4 flex flex-col items-center text-center" style={{ borderColor: `hsl(${ACCENT} / 0.5)`, background: `hsl(${ACCENT} / 0.06)` }}>
                  <User size={28} style={{ color: `hsl(${ACCENT})` }} />
                  <p className="font-bold mt-1" style={{ fontSize: 16, color: TEXT }}>The Individual</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.3 }}>holds the signing key</p>
                </div>
              </div>
              <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 280 }}>
                <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.10)`, boxShadow: `0 8px 30px hsl(${GREEN} / 0.18)` }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Package size={18} style={{ color: `hsl(${GREEN})` }} />
                    <p className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${GREEN})`, letterSpacing: "0.1em" }}>CONTEXT BUNDLE</p>
                  </div>
                  <p className="font-bold" style={{ fontSize: 16, color: TEXT, lineHeight: 1.25 }}>Playbooks · Skill-Agents · Decisions · Telemetry</p>
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: `hsl(${GREEN} / 0.3)` }}>
                    <KeyRound size={13} style={{ color: `hsl(${GREEN})` }} />
                    <span className="font-mono" style={{ fontSize: 12, color: MUTED }}>signed · versioned · exportable</span>
                  </div>
                </div>
              </div>
              <div className="absolute" style={{ left: 196, top: "50%", transform: "translateY(-50%)" }}>
                <ArrowLeftRight size={22} style={{ color: `hsl(${ACCENT})` }} />
              </div>
              <div className="absolute flex flex-col gap-3" style={{ right: 24, top: 24, bottom: 24, width: 190, justifyContent: "space-between" }}>
                {[
                  { l: "Employer A · today",   sub: "deploys bundle", c: GOLD },
                  { l: "Employer B · next",    sub: "imports bundle", c: PURPLE },
                  { l: "Own venture · later",  sub: "forks bundle",   c: ACCENT },
                ].map(o => (
                  <div key={o.l} className="rounded-lg border p-3 flex items-center gap-2" style={{ borderColor: `hsl(${o.c} / 0.4)`, background: `hsl(${o.c} / 0.05)` }}>
                    <Building2 size={18} style={{ color: `hsl(${o.c})`, flexShrink: 0 }} />
                    <div>
                      <p className="font-semibold" style={{ fontSize: 14, color: TEXT, lineHeight: 1.2 }}>{o.l}</p>
                      <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.2 }}>{o.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute" style={{ right: 218, top: "50%", transform: "translateY(-50%)" }}>
                <ArrowRight size={22} style={{ color: SUBTLE }} />
              </div>
            </div>
          </div>

          {/* Why it is the right unit */}
          <div className="flex flex-col gap-3">
            {[
              { i: KeyRound,      t: "Owned",      s: "Signed to a personal identity, not a tenant. The individual can revoke, fork, and transfer." },
              { i: FileSignature, t: "Standardised", s: "Maps to the WEF Global Skills Taxonomy and OECD competency frames. Comparable across firms." },
              { i: ArrowLeftRight,t: "Portable",   s: "Export / re-import / fork. Same bundle deploys at the next employer or the worker&rsquo;s own venture." },
              { i: LineChart,     t: "Measurable", s: "Every judgment moment is logged. We can count what was exercised, when, and with what outcome." },
              { i: ShieldCheck,   t: "Audited",    s: "Open schema. Third parties can verify what is inside the bundle. Gaming is detectable." },
            ].map(c => (
              <div key={c.t} className="rounded-xl border p-4 flex gap-3 items-start" style={{ borderColor: CHROME_BORDER, background: "white" }}>
                <c.i size={20} style={{ color: `hsl(${GREEN})`, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>{c.t}</p>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: c.s }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 06 , THEORY OF CHANGE
// ═════════════════════════════════════════════════════════════════════════════
function S06ToC() {
  const cols = [
    { k: "INPUTS",     c: SUBTLE, items: ["Workers using AI daily", "Existing playbooks & SOPs", "AACE loop instrumentation", "Open Context Bundle schema"] },
    { k: "ACTIVITIES", c: ACCENT, items: ["Capture judgment moments", "Encode skill-agents", "Sign bundles to person", "Audit & version every release"] },
    { k: "OUTPUTS",    c: GOLD,   items: ["Active bundles per worker", "Judgment moments captured / yr", "Core 2030 skills exercised", "Portability events (export/import)"] },
    { k: "OUTCOMES",   c: PURPLE, items: ["Wage premium for bundle-holders", "Re-employment time ↓", "Reskilling cost per worker ↓", "Tacit-to-explicit knowledge ratio ↑"] },
    { k: "IMPACT",     c: GREEN,  items: ["Workers retain economic agency in AI-native economy", "Reduced labour-market polarisation", "SDG 4 / 8 / 9 / 10 progress"] },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={6} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Logic" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Theory of Change" />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          From <span style={{ color: `hsl(${ACCENT})` }}>captured judgment</span> to <span style={{ color: `hsl(${GREEN})` }}>retained agency</span> , the causal chain, made explicit.
        </h2>
        <p className="mb-8" style={{ fontSize: 19, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          A theory of change is the contract between mechanism and impact. Each arrow is a falsifiable claim, and each box is something we can count. If any link breaks, the impact claim breaks , and we say so.
        </p>

        <div className="grid grid-cols-5 gap-3 max-w-[1750px]">
          {cols.map((col, idx) => (
            <div key={col.k} className="relative rounded-2xl border-2 p-5"
              style={{ borderColor: `hsl(${col.c} / 0.4)`, background: `hsl(${col.c} / 0.05)`, minHeight: 460 }}>
              <p className="font-mono font-bold tracking-[0.15em] mb-3" style={{ fontSize: 13, color: `hsl(${col.c})` }}>{col.k}</p>
              <div className="flex flex-col gap-2">
                {col.items.map(t => (
                  <div key={t} className="rounded-lg px-3 py-2.5" style={{ background: "white", border: `1px solid ${CHROME_BORDER}` }}>
                    <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>{t}</p>
                  </div>
                ))}
              </div>
              {idx < cols.length - 1 && (
                <div className="absolute" style={{ right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
                  <ArrowRight size={24} style={{ color: SUBTLE }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-3 gap-4 max-w-[1750px]">
          {[
            { t: "Falsifiable",  s: "Each arrow is a metric. If bundle-holders do not show wage/re-employment lift vs. controls within 18 months, the chain fails , we report it." },
            { t: "Attributable", s: "Outcomes attach to a specific bundle, not to LIZA in aggregate. Easy to verify, hard to game." },
            { t: "Comparable",   s: "Schema is open. Other vendors, regulators, and researchers can replicate measurement on their own data." },
          ].map(c => (
            <div key={c.t} className="rounded-xl border px-5 py-3" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-bold mb-1" style={{ fontSize: 16, color: TEXT }}>{c.t}</p>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{c.s}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 07 , MEASUREMENT
// ═════════════════════════════════════════════════════════════════════════════
function S07Measurement() {
  const metrics = [
    { layer: "Outputs", c: GOLD, rows: [
      ["Active bundles",          "# workers with a signed, versioned bundle",                   "Bundle registry"],
      ["Judgment moments / yr",   "Decision-class events logged per active bundle",              "AACE telemetry"],
      ["Core 2030 skills exercised","Distinct WEF skills mapped to bundle events",                "Skills taxonomy"],
    ]},
    { layer: "Outcomes", c: PURPLE, rows: [
      ["Portability events",      "Successful import of a bundle at a new employer / venture",   "Export / import log, signed receipts"],
      ["Re-employment Δ",         "Time-to-next-role for bundle-holders vs. matched controls",   "Self-reported + LinkedIn signal"],
      ["Wage premium Δ",          "Compensation delta vs. matched controls, 18-month window",    "Self-reported, anonymised"],
      ["Reskilling cost / worker","€ to bring a worker to bundle-readiness in a new role",       "Employer programme data"],
    ]},
    { layer: "Impact (lagging)", c: GREEN, rows: [
      ["Labour-market polarisation index","Wage & employment spread within bundle cohorts",       "OECD, Eurostat panels"],
      ["Tacit-to-explicit ratio",        "% of senior judgment encoded as transferable bundle",  "Sector benchmarks"],
    ]},
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={7} total={TOTAL} />
      <PhaseChip phase="Phase 3 · Measurement" color={GREEN} />
      <div className="relative z-10">
        <Tag label="What We Measure , Per Bundle" />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 50, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The metric stack the committee can <span style={{ color: `hsl(${GREEN})` }}>audit, replicate, and benchmark</span>.
        </h2>
        <p className="mb-6" style={{ fontSize: 19, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          Three layers: what we ship (outputs), what changes for the worker (outcomes), and what changes for the labour market (impact). Each row names the metric, its definition, and the source , so an independent assessor can rebuild the number.
        </p>

        <div className="flex flex-col gap-3 max-w-[1750px]">
          {metrics.map(m => (
            <div key={m.layer} className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `hsl(${m.c} / 0.4)`, background: `hsl(${m.c} / 0.04)` }}>
              <div className="px-5 py-2.5 flex items-center gap-3" style={{ background: `hsl(${m.c} / 0.10)` }}>
                <span className="font-mono font-bold tracking-[0.12em]" style={{ fontSize: 14, color: `hsl(${m.c})` }}>{m.layer.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-[280px_1fr_320px] px-5 py-2 font-mono uppercase tracking-[0.1em]" style={{ fontSize: 11, color: SUBTLE, borderBottom: `1px solid ${CHROME_BORDER}` }}>
                <span>Metric</span><span>Definition</span><span>Source / how verified</span>
              </div>
              {m.rows.map(r => (
                <div key={r[0]} className="grid grid-cols-[280px_1fr_320px] px-5 py-3 items-start" style={{ borderBottom: `1px solid ${CHROME_BORDER}` }}>
                  <span className="font-semibold" style={{ fontSize: 16, color: TEXT }}>{r[0]}</span>
                  <span style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{r[1]}</span>
                  <span className="font-mono" style={{ fontSize: 13, color: SUBTLE, lineHeight: 1.4 }}>{r[2]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer text="Alignment: GIIN IRIS+ (WORKFORCE strand) · OECD Skills for Jobs · WEF Reskilling Revolution Initiative. Independent assessor: TBD before Series A." />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 08 , WEF 2030 ALIGNMENT
// ═════════════════════════════════════════════════════════════════════════════
function S08WEF() {
  const core2030 = [
    { x: 74, y: 90, label: "AI & big data" },
    { x: 58, y: 80, label: "Creative thinking" },
    { x: 80, y: 72, label: "Resilience & agility" },
    { x: 72, y: 62, label: "Analytical thinking" },
    { x: 60, y: 66, label: "Systems thinking" },
    { x: 64, y: 56, label: "Curiosity & lifelong learning" },
    { x: 78, y: 50, label: "Leadership & social influence" },
  ];
  const exercises = [
    { skill: "Analytical thinking",      how: "Every decision-class event forces an explicit rationale before output is released." },
    { skill: "Creative thinking",        how: "The system frames the problem; the human supplies the angle , logged as a contribution." },
    { skill: "AI & big data",            how: "Workers operate the model + the bundle daily; fluency compounds on real work, not synthetic courses." },
    { skill: "Resilience & agility",     how: "Bundle portability removes the &ldquo;starting from zero&rdquo; cost of changing role or employer." },
    { skill: "Systems thinking",         how: "Playbooks are graphs of inputs, constraints, and outcomes , the worker reasons in systems by default." },
    { skill: "Curiosity & lifelong learning", how: "Every captured judgment is a self-taught lesson the worker re-uses next time. The bundle is a learning record." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={8} total={TOTAL} />
      <PhaseChip phase="Phase 4 · Alignment" color={GREEN} />
      <div className="relative z-10">
        <Tag label="WEF Future of Jobs 2025 · Core Skills 2030" />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 50, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The bundle exercises the <span style={{ color: `hsl(${GREEN})` }}>same skills the WEF says will define employability in 2030</span>.
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          We did not invent the skill list. WEF surveyed 1,000+ employers across 55 economies. The top-right quadrant , high importance, rising demand , is the Core 2030 set. Below: how the bundle exercises each, on real work, every day.
        </p>

        <div className="grid grid-cols-[1fr_1.2fr] gap-8 items-start">
          <div className="rounded-2xl border-2 p-5" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 12, color: SUBTLE }}>
              Skill demand quadrant
            </p>
            <div className="relative" style={{ width: "100%", height: 420, background: "white", borderRadius: 10, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="absolute" style={{ left: "50%", top: 0, width: "50%", height: "50%", background: `hsl(${GREEN} / 0.08)` }} />
              <div className="absolute" style={{ left: "50%", top: 0, bottom: 0, width: 1, background: GRID_LINE }} />
              <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: 1, background: GRID_LINE }} />
              <p className="absolute font-semibold" style={{ top: 8, right: 14, fontSize: 11, color: `hsl(${GREEN})`, letterSpacing: "0.1em" }}>CORE 2030</p>
              <p className="absolute font-mono" style={{ bottom: 8, left: 14, fontSize: 10, color: SUBTLE }}>← lower importance</p>
              <p className="absolute font-mono" style={{ bottom: 8, right: 14, fontSize: 10, color: SUBTLE }}>higher importance →</p>
              <p className="absolute font-mono" style={{ top: 8, left: 14, fontSize: 10, color: SUBTLE }}>↑ rising</p>
              {core2030.map(s => (
                <div key={s.label} className="absolute" style={{ left: `${s.x}%`, top: `${100 - s.y}%`, transform: "translate(-50%, -50%)" }}>
                  <div className="rounded-full" style={{ width: 12, height: 12, background: `hsl(${GREEN})`, boxShadow: `0 0 0 5px hsl(${GREEN} / 0.18)` }} />
                  <p className="absolute whitespace-nowrap font-semibold" style={{ left: 18, top: -6, fontSize: 12, color: TEXT }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {exercises.map(e => (
              <div key={e.skill} className="rounded-xl border p-3.5 grid grid-cols-[260px_1fr] gap-4 items-start" style={{ borderColor: CHROME_BORDER, background: "white" }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: `hsl(${GREEN})` }} />
                  <span className="font-bold" style={{ fontSize: 15, color: TEXT }}>{e.skill}</span>
                </div>
                <span style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: e.how }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer text="Source: World Economic Forum, Future of Jobs Report 2025 (Davos). Core Skills 2030 = high-importance × rising-demand quadrant." />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 09 , SDG ALIGNMENT
// ═════════════════════════════════════════════════════════════════════════════
function S09SDG() {
  const sdgs = [
    { n: "SDG 4",  label: "Quality Education",         color: RED,
      target: "4.4 , substantially increase the number of youth and adults with relevant skills for employment, decent jobs and entrepreneurship.",
      claim:  "Each bundle is a lifelong, self-owned learning record , encoded on real work, not in a course. Directly increases the count of adults with relevant, certifiable skills." },
    { n: "SDG 8",  label: "Decent Work & Economic Growth", color: ACCENT,
      target: "8.2 / 8.5 , higher productivity through diversification and tech upgrading; full and productive employment and decent work for all.",
      claim:  "Bundles raise individual productivity without displacing the worker, and create a portable economic asset they retain across employers." },
    { n: "SDG 9",  label: "Industry, Innovation & Infra",  color: GOLD,
      target: "9.5 / 9.b , enhance scientific research, upgrade technological capabilities; support domestic technology development.",
      claim:  "The bundle schema is open infrastructure: workers, employers, regulators, and researchers operate on the same standard , without dependency on a single vendor." },
    { n: "SDG 10", label: "Reduced Inequalities",      color: PURPLE,
      target: "10.2 / 10.4 , empower and promote the social, economic and political inclusion of all; adopt policies for greater equality.",
      claim:  "Knowledge sovereignty redistributes the gains of AI from model+platform owners back to the workers whose judgment trains and operates them." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={9} total={TOTAL} />
      <PhaseChip phase="Phase 4 · Alignment" color={GREEN} />
      <div className="relative z-10">
        <Tag label="UN SDG Alignment , with explicit targets and claims" />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 50, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Four SDGs, named by target sub-clause , <span style={{ color: `hsl(${GREEN})` }}>not by colour</span>.
        </h2>
        <p className="mb-7" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          Putting an SDG logo on a deck is rainbow-washing. We name the specific UN sub-target, the contribution claim, and how it is measured. The committee can challenge each line independently.
        </p>

        <div className="grid grid-cols-2 gap-5 max-w-[1750px]">
          {sdgs.map(s => (
            <div key={s.n} className="rounded-2xl border-2 p-5" style={{ borderColor: `hsl(${s.color} / 0.4)`, background: `hsl(${s.color} / 0.05)` }}>
              <div className="flex items-center gap-3 mb-3">
                <Globe size={20} style={{ color: `hsl(${s.color})` }} />
                <span className="font-mono font-bold tracking-[0.12em]" style={{ fontSize: 15, color: `hsl(${s.color})` }}>{s.n}</span>
                <span className="font-bold" style={{ fontSize: 19, color: TEXT }}>{s.label}</span>
              </div>
              <div className="rounded-lg px-4 py-3 mb-3" style={{ background: "white", border: `1px solid ${CHROME_BORDER}` }}>
                <p className="font-mono uppercase tracking-[0.1em] mb-1" style={{ fontSize: 10, color: SUBTLE }}>UN Target</p>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.4, fontStyle: "italic" }} dangerouslySetInnerHTML={{ __html: s.target }} />
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.1em] mb-1" style={{ fontSize: 10, color: `hsl(${s.color})` }}>Our contribution claim</p>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: s.claim }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 10 , ADDITIONALITY & COUNTERFACTUAL
// ═════════════════════════════════════════════════════════════════════════════
function S10Additionality() {
  const rows = [
    { cf: "Big-tech AI platform (OpenAI, Anthropic, Google)",
      who: "Worker uses model; model vendor keeps the context.",
      gap: "Encoded judgment becomes vendor IP. Worker has zero portability.", color: RED },
    { cf: "Employer-internal AI deployment (Copilot, in-house)",
      who: "Worker uses model; employer keeps the context.",
      gap: "Bundle = employer asset. On exit, worker carries nothing. Lock-in by design.", color: GOLD },
    { cf: "Personal AI memory tools (Mem, Rewind, ChatGPT memory)",
      who: "Worker keeps notes; no standard, no judgment record, no portability.",
      gap: "Stores conversation, not encoded judgment. Not auditable, not employable, not transferable.", color: PURPLE },
    { cf: "Public reskilling programmes (govt, NGO)",
      who: "Generic curricula; no real-work signal.",
      gap: "Teaches skill names, not encoded judgment. Drop-off > 50%; outcome lag > 24 months.", color: ACCENT },
    { cf: "LIZA , Portable Context Bundle",
      who: "Worker owns the bundle; employer rents access; standard is open.",
      gap: "Closes all four gaps. This is the additional contribution.", color: GREEN, us: true },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={10} total={TOTAL} />
      <PhaseChip phase="Phase 5 · Additionality" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Additionality , Would This Happen Without Us?" />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 50, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Counterfactual scan , <span style={{ color: `hsl(${GREEN})` }}>no other actor in the stack closes the portability gap</span>.
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45, maxWidth: 1600 }}>
          Impact-investor diligence rejects claims that &ldquo;the market would have done it anyway&rdquo;. Here is the alternative-actor map: who else could produce a Portable Context Bundle, and why none of them will.
        </p>

        <div className="rounded-2xl border-2 overflow-hidden max-w-[1750px]" style={{ borderColor: CHROME_BORDER }}>
          <div className="grid grid-cols-[1.1fr_1.2fr_1.7fr] px-5 py-3 font-mono uppercase tracking-[0.1em]" style={{ fontSize: 11, color: SUBTLE, background: CHROME_BG, borderBottom: `1px solid ${CHROME_BORDER}` }}>
            <span>Counterfactual actor</span><span>What they actually deliver</span><span>Why the gap persists</span>
          </div>
          {rows.map(r => (
            <div key={r.cf} className="grid grid-cols-[1.1fr_1.2fr_1.7fr] px-5 py-4 items-start"
              style={{ background: r.us ? `hsl(${GREEN} / 0.06)` : "white", borderBottom: `1px solid ${CHROME_BORDER}` }}>
              <div className="flex items-center gap-2.5">
                {r.us
                  ? <CheckCircle2 size={18} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
                  : <HelpCircle size={18} style={{ color: `hsl(${r.color})`, flexShrink: 0 }} />}
                <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>{r.cf}</span>
              </div>
              <span style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{r.who}</span>
              <span style={{ fontSize: 15, color: r.us ? TEXT : MUTED, lineHeight: 1.4, fontWeight: r.us ? 600 : 400 }}>{r.gap}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 max-w-[1750px]">
          <div className="rounded-xl border-2 px-5 py-4" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>Why incumbents will not build this</p>
            </div>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>
              A person-owned, exportable bundle directly attacks the business model of every actor in rows 1-3. The lock-in is the moat. Building portability is value-destructive for them.
            </p>
          </div>
          <div className="rounded-xl border-2 px-5 py-4" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.05)` }}>
            <div className="flex items-center gap-2 mb-1">
              <Scale size={18} style={{ color: `hsl(${ACCENT})` }} />
              <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>Why we can</p>
            </div>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>
              Our commercial model (Tech DD, Slide 11) is metered on decision-class value , not on captive context. Portability is aligned with our economics, not against them.
            </p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 11 , DECISION (two-door close)
// ═════════════════════════════════════════════════════════════════════════════
function S11Decision() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <PageNumber n={11} total={TOTAL} dark />
      <div className="relative z-10 flex-1 flex flex-col justify-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-8" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>
          The Decision
        </p>
        <h2 className="font-bold leading-[1.04]" style={{ fontSize: 72, color: DARK_TEXT, letterSpacing: "-0.03em", maxWidth: 1600 }}>
          What an impact-aligned investor is actually <span style={{ color: `hsl(${GREEN})` }}>backing here</span>.
        </h2>
        <p className="mt-8 mb-12" style={{ fontSize: 24, color: DARK_MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          The technology, the unit economics, and the commercial wedge are covered in the Tech DD deck. This deck answers the only question that remains for an impact mandate: <span className="font-semibold" style={{ color: DARK_TEXT }}>is the impact real, additional, and measurable?</span>
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-[1700px]">
          {[
            { i: Target, t: "Outcome",        s: "Workers retain economic agency as AI absorbs execution , via owned, portable, encoded judgment.", c: GREEN },
            { i: Compass, t: "Mechanism",     s: "The Portable Context Bundle. Person-signed. Standards-based. Zero lock-in. Auditable.", c: ACCENT },
            { i: LineChart, t: "Measurement", s: "IMP-aligned, IRIS+ mapped, falsifiable Theory of Change. Independent assessor before Series A.", c: GOLD },
          ].map(c => (
            <div key={c.t} className="rounded-2xl border p-6" style={{ borderColor: `hsl(${c.c} / 0.3)`, background: `hsl(${c.c} / 0.05)` }}>
              <c.i size={26} style={{ color: `hsl(${c.c})` }} />
              <p className="font-bold mt-3" style={{ fontSize: 22, color: DARK_TEXT }}>{c.t}</p>
              <p style={{ fontSize: 16, color: DARK_MUTED, lineHeight: 1.45, marginTop: 4 }} dangerouslySetInnerHTML={{ __html: c.s }} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 max-w-[1700px]">
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: `hsl(${GREEN} / 0.08)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>Door 1 · Capital</p>
            <p className="font-bold mb-2" style={{ fontSize: 24, color: DARK_TEXT }}>Back the infrastructure layer.</p>
            <p style={{ fontSize: 16, color: DARK_MUTED, lineHeight: 1.45 }}>
              Standard impact mandate: capital deployed against the IMP scorecard above, with annual third-party verification of bundle-level outcomes.
            </p>
          </div>
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${ACCENT} / 0.5)`, background: `hsl(${ACCENT} / 0.08)` }}>
            <p className="font-mono uppercase tracking-[0.15em] mb-2" style={{ fontSize: 12, color: `hsl(${ACCENT})` }}>Door 2 · Standard</p>
            <p className="font-bold mb-2" style={{ fontSize: 24, color: DARK_TEXT }}>Co-define the open bundle schema.</p>
            <p style={{ fontSize: 16, color: DARK_MUTED, lineHeight: 1.45 }}>
              Strategic stake + a seat on the standards body. The schema becomes industry-default, and the mandate&apos;s influence compounds.
            </p>
          </div>
        </div>
      </div>
      <Footer text="Companion documents: Tech DD deck (mechanism, economics) · IMP scorecard (on request) · Theory of Change with assumption log (on request)." dark />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

const SLIDES = [
  { id: "cover",          title: "Cover · Why keep humans",       component: <S01Cover /> },
  { id: "question",       title: "The Core Question",              component: <S02Question /> },
  { id: "imp",            title: "IMP Five Dimensions",            component: <S03IMP /> },
  { id: "problem",        title: "Structural Problem",             component: <S04Problem /> },
  { id: "bundle",         title: "Unit of Impact · Bundle",        component: <S05Bundle /> },
  { id: "toc",            title: "Theory of Change",               component: <S06ToC /> },
  { id: "measurement",    title: "Measurement Stack",              component: <S07Measurement /> },
  { id: "wef",            title: "WEF 2030 Alignment",             component: <S08WEF /> },
  { id: "sdg",            title: "SDG Alignment",                  component: <S09SDG /> },
  { id: "additionality",  title: "Additionality & Counterfactual", component: <S10Additionality /> },
  { id: "decision",       title: "The Decision · Two Doors",       component: <S11Decision /> },
];

// ─── Deck shell ──────────────────────────────────────────────────────────────
export default function ImpactDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Impact-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Impact Thesis Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            Impact · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Internal · Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Impact-Deck" slideCount={SLIDES.length} variant="desktop" />
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
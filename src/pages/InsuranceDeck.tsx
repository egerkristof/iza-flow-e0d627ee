import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, ShieldAlert, TrendingDown, BookOpen, Gavel,
  Languages, FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";

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
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.18em", padding: "10px 20px", borderRadius: 6, background: "hsl(0 72% 50% / 0.15)", color: "hsl(0 72% 36%)", border: "2px solid hsl(0 72% 50% / 0.6)" }}>HIGHLY CONFIDENTIAL</span>
        </div>
        {isCover && (
          <div style={{ position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              transform: "rotate(-22deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 160, fontWeight: 900, letterSpacing: "0.12em",
              color: "hsl(0 72% 50% / 0.12)",
              textShadow: "0 0 1px hsl(0 72% 50% / 0.18)",
              whiteSpace: "nowrap", lineHeight: 1, textAlign: "center",
            }}>
              HIGHLY CONFIDENTIAL
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
// 01 · COVER — neutral, no category language, no LIZA name in the headline
// ═════════════════════════════════════════════════════════════════════════════
function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-10" style={{ fontSize: 20, color: `hsl(${GREEN})` }}>
          A working brief · Insurance leadership · 2026
        </p>
        <h1 className="font-bold leading-[1.02]" style={{ fontSize: 92, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          Five questions on the desk of <br/>
          <span style={{ color: `hsl(${GREEN})` }}>every insurance leader this quarter.</span>
        </h1>
        <p className="mt-10 mx-auto" style={{ fontSize: 26, color: DARK_MUTED, lineHeight: 1.45, maxWidth: 1280 }}>
          This brief does not pitch a product. It walks through five concrete situations carriers in the GCC are facing right now,
          and shows what a defensible answer looks like for each one. If any of them is already on your plate, the last page proposes a 30-day way to act on it.
        </p>
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { i: Gavel,    t: "Court-defensible AI", s: "The new bar for any AI touching a claim" },
            { i: Languages, t: "Arabic-safe service",  s: "Customer chat that cannot make up cover" },
            { i: BookOpen, t: "Senior judgment kept", s: "The know-how that walks out at retirement" },
          ].map(c => (
            <div key={c.t} className="rounded-xl border p-5 text-left" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.04)" }}>
              <c.i size={22} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-bold mt-2" style={{ fontSize: 18, color: DARK_TEXT }}>{c.t}</p>
              <p style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.4 }}>{c.s}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 02 · FIVE CONVERSATIONS — composite quotes, the real PULL
// ═════════════════════════════════════════════════════════════════════════════
function S02Conversations() {
  const quotes = [
    { who: "Head of Claims", line: "An adjuster pasted a complex motor file into ChatGPT last week and the summary went out to the customer. It got a coverage clause wrong. Legal is now asking how we'd defend that if it had been a denial." },
    { who: "Chief Risk Officer", line: "After Lokken, every AI output that touches a claim has to be reviewable in court. I cannot sign off on anything that produces a paragraph my adjuster can't reconstruct line by line." },
    { who: "Chief Underwriter", line: "After April 2024 the flood book broke overnight. We took six weeks to update the playbooks, and even after that I had three regional offices quoting three different risk loadings on identical SME files." },
    { who: "Head of Customer", line: "Our Arabic chatbot quoted a benefit we don't sell. We pulled it back in 48 hours. Now the board wants AI for customer service, but nobody wants to be the next headline." },
    { who: "Head of SIU / Fraud", line: "Our two most senior investigators retire in eighteen months. Half the patterns they catch are not written down anywhere. I do not know how we hand that over." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={2} total={TOTAL} />
      <PhaseChip phase="What we keep hearing" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="Five conversations from the past six months" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          None of these are about <span style={{ color: SUBTLE }}>AI strategy.</span> All of them are about <span style={{ color: `hsl(${RED})` }}>this Friday.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          Composite quotes drawn from working sessions with GCC carriers in 2025-2026. Names removed. Substance unchanged.
        </p>

        <div className="grid grid-cols-2 gap-5 max-w-[1750px]">
          {quotes.map(q => (
            <div key={q.who} className="rounded-xl border-l-4 border-2 p-6" style={{ borderLeftColor: `hsl(${ACCENT})`, borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-mono uppercase tracking-[0.15em] font-bold mb-2" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>{q.who}</p>
              <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.45, fontStyle: "italic" }}>&ldquo;{q.line}&rdquo;</p>
            </div>
          ))}
          <div className="rounded-xl border-2 p-6 flex flex-col justify-center" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.06)` }}>
            <p className="font-mono uppercase tracking-[0.15em] font-bold mb-2" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>The pattern</p>
            <p style={{ fontSize: 22, color: TEXT, lineHeight: 1.4, fontWeight: 600 }}>
              Different functions. Same shape of problem. Generic AI gave a fast answer. Nobody can show the reasoning, defend it, or update it once across the firm.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 03 · WHY THIS IS STRUCTURALLY HARDER IN 2026 — third-party evidence
// ═════════════════════════════════════════════════════════════════════════════
function S03Pressure() {
  const forces = [
    { i: Gavel,       c: RED,    h: "Lokken v. UnitedHealth",
      sub: "US Federal court, March 2026",
      s: "AI outputs used in claim denials are now discoverable in bad-faith litigation. If the adjuster cannot prove they reviewed the AI output, the AI output is the decision. Re-insurers and GCC legal teams are already treating this as the new bar." },
    { i: ShieldAlert, c: RED,    h: "Nippon Life v. OpenAI",
      sub: "Filed March 2026",
      s: "A carrier suing a frontier-model vendor, alleging the chatbot acted as a legal adviser and interfered with a settled long-term care claim. The point is not the verdict. The point is that generic AI now creates direct legal exposure for the carrier that deployed it." },
    { i: Languages,   c: GOLD,   h: "Gulf reality: Arabic and dialect",
      sub: "Tawuniya InsurAI accelerator, May 2025",
      s: "The Gulf market has named the five buckets: claims, fraud, pricing, Arabic distribution, risk prevention. Public benchmarks show frontier LLMs hallucinate coverage and policy terms in Arabic far more than English. Most carriers paused customer-facing AI after their first incident." },
    { i: BookOpen,    c: ACCENT, h: "CBUAE 2025-2026 governance",
      sub: "UAE Central Bank regulatory roadmap",
      s: "Digital security, model governance, and consumer protection rules require traceable decision rationale on automated outputs. Grant Thornton's November 2025 read: most insurers are still early stage and blocked by legacy infrastructure." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={3} total={TOTAL} />
      <PhaseChip phase="Why now, why structural" color={RED} />
      <div className="relative z-10">
        <Tag label="What changed in the last twelve months" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Four forces have moved AI in insurance from <span style={{ color: SUBTLE }}>an innovation question</span> to <span style={{ color: `hsl(${RED})` }}>a board-level risk question.</span>
        </h2>

        <div className="grid grid-cols-2 gap-5 max-w-[1750px]">
          {forces.map(f => (
            <div key={f.h} className="rounded-xl border-2 p-6" style={{ borderColor: `hsl(${f.c} / 0.4)`, background: `hsl(${f.c} / 0.04)` }}>
              <div className="flex items-center gap-3 mb-2">
                <f.i size={26} style={{ color: `hsl(${f.c})` }} />
                <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{f.h}</p>
              </div>
              <p className="font-mono uppercase tracking-[0.12em] mb-3" style={{ fontSize: 13, color: `hsl(${f.c})` }}>{f.sub}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{f.s}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[1700px]" style={{ fontSize: 22, color: TEXT, lineHeight: 1.45 }}>
          The carriers that move first will be the ones that have a <span className="font-semibold">defensible answer</span>, not the ones that have the most AI.
        </p>
      </div>
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 04 · USE CASE 1 · CLAIMS-EXCEPTION DECISIONS WITH DEFENSIBLE RATIONALE
// ═════════════════════════════════════════════════════════════════════════════
function S04UC1() {
  const steps = [
    { n: "01", t: "Adjuster opens an exception", s: "Medical claim, ambiguous prior condition. The exception triggers an approved playbook, not a free-form prompt." },
    { n: "02", t: "Model is locked to your standard", s: "Policy wording, medical schedule, recent regulator guidance, and your firm's underwriting bulletins are loaded as the only context the model is allowed to reason over." },
    { n: "03", t: "Output is a decision plus a chain", s: "Recommended action, every clause cited, every conflict flagged, the adjuster's review checkbox, timestamped. One artefact per file." },
    { n: "04", t: "If it goes to court, you can show your work", s: "The rationale chain is the evidence package. Lokken-grade. Your CRO can sign off because the AI never decides alone, but it does the legwork." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={4} total={TOTAL} />
      <PhaseChip phase="Use case 1 of 4 · Claims" color={GREEN} />
      <div className="relative z-10">
        <Tag label="Use case 1 · Claims exceptions with a defensible rationale" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          What it looks like when an <span style={{ color: `hsl(${GREEN})` }}>AI-assisted denial</span> is court-defensible by construction.
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          The Lokken response, in your environment. The adjuster still owns the decision. The AI does the cross-reference. Every output carries its receipts.
        </p>

        <div className="grid grid-cols-4 gap-5 max-w-[1750px]">
          {steps.map((s, i) => (
            <div key={s.n} className="rounded-2xl border-2 p-6 relative" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.04)`, minHeight: 340 }}>
              <p className="font-mono font-bold" style={{ fontSize: 14, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>STEP {s.n}</p>
              <p className="font-bold mt-3 mb-3" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>{s.t}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{s.s}</p>
              {i < steps.length - 1 && (
                <ArrowRight size={28} style={{ position: "absolute", right: -20, top: "50%", color: `hsl(${GREEN})`, background: BG, borderRadius: 999, zIndex: 5 }} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-5 max-w-[1750px]">
          {[
            { k: "Today", v: "Adjuster pastes file into ChatGPT, summary lands in customer email, nobody can reconstruct the reasoning.", c: RED },
            { k: "30 days in", v: "Same workflow, same speed, plus an evidence package per decision your CRO can sign off on.", c: GOLD },
            { k: "Measured deltas", v: "Time-to-decision, exception accuracy versus senior review, % of files with a complete rationale chain.", c: GREEN },
          ].map(b => (
            <div key={b.k} className="rounded-xl border p-5" style={{ borderColor: `hsl(${b.c} / 0.35)`, background: `hsl(${b.c} / 0.05)` }}>
              <p className="font-mono uppercase tracking-[0.12em] font-bold mb-2" style={{ fontSize: 13, color: `hsl(${b.c})` }}>{b.k}</p>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>{b.v}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 05 · USE CASE 2 · UNDERWRITING STANDARD PROPAGATION (POST-SHOCK)
// ═════════════════════════════════════════════════════════════════════════════
function S05UC2() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={5} total={TOTAL} />
      <PhaseChip phase="Use case 2 of 4 · Underwriting" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="Use case 2 · Updating one standard, once, after a market shock" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Senior underwriter changes the rule on <span style={{ color: `hsl(${ACCENT})` }}>Monday morning.</span> By Monday afternoon every branch is quoting it.
        </h2>
        <p className="mb-10" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          The April 2024 floods broke historic flood books. The carriers that took six weeks to re-align lost the spring renewal cycle. The ones that took a day kept the book.
        </p>

        <div className="grid grid-cols-[1fr_1.2fr] gap-10 max-w-[1750px]">
          {/* Before / After diagram */}
          <div className="space-y-5">
            <div className="rounded-xl border-2 p-6" style={{ borderColor: `hsl(${RED} / 0.4)`, background: `hsl(${RED} / 0.05)` }}>
              <p className="font-mono uppercase tracking-[0.15em] font-bold mb-2" style={{ fontSize: 14, color: `hsl(${RED})` }}>Today</p>
              <p className="font-bold mb-2" style={{ fontSize: 22, color: TEXT }}>Six weeks. Three branches. Three answers.</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>
                New flood loading is decided in head office. It propagates through training emails, recorded calls, and PDFs. Branch quotes drift. AI copilots still cite the pre-shock playbook for months.
              </p>
            </div>
            <div className="rounded-xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
              <p className="font-mono uppercase tracking-[0.15em] font-bold mb-2" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>30 days in</p>
              <p className="font-bold mb-2" style={{ fontSize: 22, color: TEXT }}>One change. Locked into the model the same hour.</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>
                Senior underwriter edits the flood-risk playbook. Every junior underwriter and every AI copilot is locked to the new version on the next quote. Old quotes flagged for review.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-2 p-6" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <p className="font-mono uppercase tracking-[0.15em] font-bold mb-4" style={{ fontSize: 14, color: SUBTLE }}>What changes mechanically</p>
            <ul className="space-y-4" style={{ fontSize: 19, color: TEXT, lineHeight: 1.5 }}>
              <li><span className="font-bold">One source of truth.</span> The playbook is the standard. Nothing else is.</li>
              <li><span className="font-bold">Versioned.</span> Every quote carries the playbook version it was generated under.</li>
              <li><span className="font-bold">Locked into the AI.</span> The model cannot quote outside the active version. No "creative" loadings.</li>
              <li><span className="font-bold">Audit-ready.</span> Re-insurer or regulator can see exactly which version applied to which quote on which day.</li>
            </ul>
            <div className="mt-6 pt-5 border-t" style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 13, color: SUBTLE }}>Measured deltas</p>
              <p className="font-semibold mt-1" style={{ fontSize: 19, color: TEXT, lineHeight: 1.4 }}>
                Time from senior decision to branch consistency. % of quotes generated under the current standard. Variance on identical risk files across branches.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 06 · USE CASE 3 · FRAUD / SIU DESK · SENIOR JUDGMENT CAPTURE
// ═════════════════════════════════════════════════════════════════════════════
function S06UC3() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={6} total={TOTAL} />
      <PhaseChip phase="Use case 3 of 4 · Fraud / SIU" color={PURPLE} />
      <div className="relative z-10">
        <Tag label="Use case 3 · Keeping senior investigator judgment when they retire" color={PURPLE} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The two patterns that catch <span style={{ color: `hsl(${PURPLE})` }}>70% of your fraud</span> are <span style={{ color: SUBTLE }}>not in any document.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          They live in the head of two SIU veterans. When those two retire, you do not get a hand-over. You get a generation gap. This use case turns tacit judgment into the firm's standing memory.
        </p>

        <div className="grid grid-cols-3 gap-5 max-w-[1750px]">
          {[
            { i: BookOpen, c: PURPLE, t: "Capture, in their own words",
              s: "Structured working sessions with senior investigators. Each pattern, each tell, each escalation rule, recorded as a playbook the AI can actually use. Not a PDF.",
            },
            { i: FileSearch, c: ACCENT, t: "Apply on every new claim",
              s: "When a claim hits the pipeline, the AI runs it against the senior patterns first. Hits get routed to SIU with the matched patterns annotated. Misses go to standard flow.",
            },
            { i: TrendingDown, c: GREEN, t: "Improve as the team learns",
              s: "Junior investigators add new tells. Veterans review and approve. The playbook compounds instead of decaying. No one person is a single point of failure.",
            },
          ].map(c => (
            <div key={c.t} className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${c.c} / 0.4)`, background: `hsl(${c.c} / 0.05)`, minHeight: 360 }}>
              <c.i size={32} style={{ color: `hsl(${c.c})` }} />
              <p className="font-bold mt-3 mb-3" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>{c.t}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{c.s}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border-2 px-6 py-5 max-w-[1750px]" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
          <p className="font-bold mb-1" style={{ fontSize: 22, color: TEXT }}>The deeper shift.</p>
          <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.45 }}>
            Fraud detection stops being a person. It becomes a firm capability. The senior investigator is still the authority. Their judgment is now a versioned asset, not a hand-shake.
          </p>
        </div>
      </div>
      <SlideBar from={PURPLE} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 07 · USE CASE 4 · ARABIC / DIALECT-SAFE CUSTOMER SERVICE
// ═════════════════════════════════════════════════════════════════════════════
function S07UC4() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={7} total={TOTAL} />
      <PhaseChip phase="Use case 4 of 4 · Customer" color={GOLD} />
      <div className="relative z-10">
        <Tag label="Use case 4 · Customer-facing Arabic AI that cannot invent cover" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Most GCC carriers have already <span style={{ color: `hsl(${RED})` }}>pulled back</span> their Arabic chatbot once. <span style={{ color: `hsl(${GREEN})` }}>Here is how it ships safely.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          Frontier LLMs hallucinate coverage terms in Arabic and Gulf dialects far more than in English. The fix is not a bigger model. The fix is a tighter boundary around what the model is allowed to say.
        </p>

        <div className="grid grid-cols-2 gap-8 max-w-[1750px]">
          <div className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${RED} / 0.4)`, background: `hsl(${RED} / 0.04)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 14, color: `hsl(${RED})` }}>The trap</p>
            <p className="font-bold mb-3" style={{ fontSize: 26, color: TEXT, lineHeight: 1.2 }}>Open chatbot on the policy corpus.</p>
            <ul className="space-y-2" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>
              <li>• Model paraphrases policy terms in Arabic.</li>
              <li>• Paraphrase introduces a benefit you do not sell.</li>
              <li>• Customer screenshots the reply.</li>
              <li>• Legal pulls the chatbot inside the week.</li>
            </ul>
          </div>

          <div className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>The safe pattern</p>
            <p className="font-bold mb-3" style={{ fontSize: 26, color: TEXT, lineHeight: 1.2 }}>Bounded answers, approved phrasing.</p>
            <ul className="space-y-2" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>
              <li>• Approved Arabic phrasings for each policy concept, signed off by compliance.</li>
              <li>• The model is locked to those phrasings. Off-script answers are blocked.</li>
              <li>• Anything outside scope is routed to a human, in seconds.</li>
              <li>• Every conversation carries a log: which approved phrasing was used, by which version of the policy.</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 max-w-[1750px]" style={{ fontSize: 22, color: TEXT, lineHeight: 1.45 }}>
          Result: Arabic service AI you can put on the front page of the app, with a paper trail your CRO and the regulator can both read.
        </p>
      </div>
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 08 · WHICH OF THESE FOUR IS YOUR FRIDAY · matrix
// ═════════════════════════════════════════════════════════════════════════════
function S08Matrix() {
  const rows = [
    { uc: "Claims-exception decisions",  o: "Head of Claims · CRO",   p: "Lokken exposure, bad-faith risk",         e: "30 days, one claim queue",       v: "Audit-grade rationale on every flagged file" },
    { uc: "Underwriting consistency",    o: "Chief Underwriter",      p: "Branch drift after a market shock",       e: "30 days, one line of business",   v: "Same standard quoted everywhere, same day" },
    { uc: "Fraud / SIU memory",          o: "Head of SIU",            p: "Senior retirements within 18 months",     e: "30 days, top two pattern families", v: "Tacit knowledge as a versioned asset" },
    { uc: "Arabic customer service",     o: "Head of Customer · CMO", p: "Past or feared chatbot incident",         e: "30 days, one intent set",         v: "Bounded chatbot you can put on the app" },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={8} total={TOTAL} />
      <PhaseChip phase="Pick the first one" color={GREEN} />
      <div className="relative z-10 h-full flex flex-col">
        <Tag label="Which of these four is your Friday?" color={GREEN} />
        <h2 className="font-bold leading-[1.04] mb-4" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Same operating pattern underneath. <span style={{ color: `hsl(${GREEN})` }}>Different first wedge per carrier.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 21, color: MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
          Four real conversations from the past six months. Each one becomes a clean first 30 days for a different leader. The question is not whether to start. The question is whose Friday looks most like one of these four.
        </p>

        <div className="rounded-2xl border-2 overflow-hidden shrink-0 max-w-[1750px]" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
          <div className="grid grid-cols-[1.4fr_1.1fr_1.5fr_1.1fr_1.6fr] px-6 py-4 font-mono uppercase tracking-[0.12em] font-bold border-b" style={{ fontSize: 14, color: SUBTLE, background: BG, borderColor: CHROME_BORDER }}>
            <div>Use case</div><div>Owner on your side</div><div>Why it's urgent now</div><div>30-day shape</div><div>What you walk away with</div>
          </div>
          {rows.map((r, i) => (
            <div key={r.uc} className={`grid grid-cols-[1.4fr_1.1fr_1.5fr_1.1fr_1.6fr] px-6 pt-5 items-start ${i === rows.length - 1 ? "pb-7" : "pb-5 border-b"}`} style={{ borderColor: CHROME_BORDER, background: i % 2 === 0 ? "transparent" : "hsl(220 15% 99%)" }}>
              <div className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.3 }}>{r.uc}</div>
              <div style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>{r.o}</div>
              <div style={{ fontSize: 19, color: TEXT, lineHeight: 1.45 }}>{r.p}</div>
              <div style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>{r.e}</div>
              <div style={{ fontSize: 19, color: TEXT, lineHeight: 1.45 }}>{r.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-[1.4fr_1fr] gap-6 max-w-[1750px]">
          <div className="rounded-xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.35)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>How to read this</p>
            <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.5 }}>
              We do not pick the wedge. <span className="font-semibold">You do.</span> Whichever of these four lands your team in front of the board with a defensible answer first is the right place to start.
            </p>
          </div>
          <div className="rounded-xl border p-6 flex flex-col justify-center" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-2" style={{ fontSize: 13, color: SUBTLE }}>Same engine underneath</p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>
              The four columns differ. The operating pattern is the same: capture the standard, lock the model, keep the rationale. One choice today, the others stay open for later.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 09 · WHAT THE FIRST 30 DAYS LOOK LIKE · still product-light
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// 9 · WHY US · BUILT FROM REAL INSURANCE DEPLOYMENTS
// ═════════════════════════════════════════════════════════════════════════════
function S09Provenance() {
  const carriers = [
    {
      name: "Generali",
      region: "Hungary / Europe",
      lesson: "Custom agents and Agentspace workshops made it clear: giving employees LLM access is not enough. They needed a central control layer for secure data grounding and enterprise governance.",
      tag: "Governance · Context grounding",
      color: ACCENT,
    },
    {
      name: "Prudential",
      region: "Taiwan",
      lesson: "Built the Unified Data Platform and Master Data Management foundations, with ClaimAI and product recommender on the roadmap. Hit the wall of strict data governance, metadata tagging and compliance encryption at every step.",
      tag: "Claims AI · Data governance",
      color: GREEN,
    },
    {
      name: "MSIG Life",
      region: "Indonesia",
      lesson: "Expanded data and AI infrastructure inside one of APAC's most demanding regulatory environments. Same friction surfaced again: compliance, residency and audit had to be architected, not bolted on.",
      tag: "Regulated AI infrastructure",
      color: GOLD,
    },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={9} total={TOTAL} />
      <PhaseChip phase="Why us · the scars are real" color={PURPLE} />
      <div className="relative z-10">
        <Tag label="Built from the inside of insurance" color={PURPLE} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          We did not design this platform in a vacuum. We built it from the <span style={{ color: `hsl(${GREEN})` }}>scars of deploying AI for major insurers</span>.
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1620 }}>
          Each of these engagements asked us to custom-build the same governance, context and compliance layer from scratch. LIZA OS is that layer, productized, so the next carrier does not have to pay to invent it again.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-[1750px] mb-8">
          {carriers.map(c => (
            <div key={c.name} className="rounded-2xl border-2 p-6 flex flex-col" style={{ borderColor: `hsl(${c.color} / 0.4)`, background: CARD_ALT, minHeight: 340 }}>
              <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${c.color})` }}>{c.tag}</p>
              <p className="font-bold" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1 }}>{c.name}</p>
              <p className="font-semibold mb-4" style={{ fontSize: 15, color: SUBTLE, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.region}</p>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{c.lesson}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border-2 p-6 max-w-[1750px]" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.05)` }}>
          <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>What carries over to your engagement</p>
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.45 }}>
            The use cases on the previous slides are the ones we already lived inside other carriers. The 30-day shape on the next page reflects how we wish those programs had started: one pod, one standard captured, one measurable readout, before anything goes near a customer.
          </p>
        </div>
      </div>
      <SlideBar from={PURPLE} to={GREEN} />
    </div>
  );
}

function S09ThirtyDays() {
  const days = [
    { d: "Day 0-3",   t: "Pick one use case, one pod", s: "From the four on the previous page. We agree the owner, the baseline metrics, and the success bar with your team." },
    { d: "Day 4-14",  t: "Capture your standard",     s: "Two to three working sessions with the senior expert. We turn how they actually decide into a structured, versioned playbook." },
    { d: "Day 15-25", t: "Run the AI in shadow",      s: "AI runs alongside the team on real files. Every output carries its rationale. Nothing customer-facing yet. Deltas measured against the baseline." },
    { d: "Day 26-30", t: "Readout to your CRO",       s: "Time saved, accuracy versus senior review, % of files with a defensible rationale chain. Clear go / no-go to expand or stop." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={10} total={TOTAL} />
      <PhaseChip phase="What you'd actually buy" color={GOLD} />
      <div className="relative z-10">
        <Tag label="The 30-day shape" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          A shared engagement, <span style={{ color: `hsl(${GREEN})` }}>agreed together at day zero</span> so the readout has a clear home on day thirty.
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.45, maxWidth: 1620 }}>
          One pod, one use case, thirty days, a measured readout. The terms below are written down up front out of respect for everyone's time. They give the team room to deliver, and they give your leadership a clean decision at the end.
        </p>

        <div className="space-y-3 max-w-[1750px] mb-8">
          {days.map(d => (
            <div key={d.d} className="rounded-xl border p-4 grid grid-cols-[140px_1fr_2.4fr] gap-5 items-center" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <span className="font-mono font-bold" style={{ fontSize: 17, color: `hsl(${GREEN})` }}>{d.d}</span>
              <p className="font-bold" style={{ fontSize: 19, color: TEXT }}>{d.t}</p>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>{d.s}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 max-w-[1750px]">
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${ACCENT} / 0.45)`, background: `hsl(${ACCENT} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>From your side, in the engagement letter</p>
            <ul className="space-y-2" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              <li>• A <span className="font-bold">named executive sponsor</span> (CRO, CUO or COO) who receives the day-30 readout in person.</li>
              <li>• A <span className="font-bold">modest engagement fee</span>, set so the work sits inside an existing budget line and has a clear internal owner from day one.</li>
              <li>• The <span className="font-bold">pod, the files and the baseline metrics</span> confirmed in the first week, so the team can focus on the work, not on definitions.</li>
              <li>• An <span className="font-bold">agreed scale path</span> outlined in advance, so that if the success bar is met, the next phase can begin without a fresh procurement cycle.</li>
              <li>• A <span className="font-bold">leadership review slot</span> reserved around day 32, regardless of outcome, so the conversation reaches the right room either way.</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>From our side, in the same document</p>
            <ul className="space-y-2" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              <li>• A <span className="font-bold">named senior lead</span> present on site for the engagement, supported by the team behind them.</li>
              <li>• The <span className="font-bold">success bar drafted in your language</span>, using your CRO's metrics, and signed off before any work begins.</li>
              <li>• The <span className="font-bold">engagement fee credited in full</span> against the next phase if the bar is met.</li>
              <li>• <span className="font-bold">Full confidentiality</span> on the work, the readout, and the firm's name, for as long as you prefer.</li>
            </ul>
          </div>
        </div>

      </div>
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 10 · UNDER THE HOOD (ONLY IF ASKED) + TWO DOORS
// ═════════════════════════════════════════════════════════════════════════════
function S10UnderHood() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20" style={{ background: DARK_BG }}>
      <DarkGrid />
      <PageNumber n={11} total={TOTAL} dark />
      <PhaseChip phase="Only if you ask" color={ACCENT} />
      <div className="relative z-10">
        <p className="font-semibold tracking-[0.3em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>Under the hood · one slide · only if you want it</p>
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 56, color: DARK_TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The same engine sits behind <span style={{ color: `hsl(${GREEN})` }}>all four use cases.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.45, maxWidth: 1500 }}>
          You do not have to buy a category to use any of them. But if your CTO or CISO asks, this is the shape of what runs inside.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-[1750px] mb-10">
          {[
            { t: "Your standards are loaded as the only context the model is allowed to reason over.", c: GREEN },
            { t: "The model is locked to the active version of those standards until the task is complete.", c: ACCENT },
            { t: "Every output emits a rationale chain: which standard, which clause, which operator, when.", c: GOLD },
          ].map((b, i) => (
            <div key={i} className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${b.c} / 0.5)`, background: "hsl(0 0% 100% / 0.04)", minHeight: 220 }}>
              <p className="font-mono font-bold" style={{ fontSize: 16, color: `hsl(${b.c})`, letterSpacing: "0.15em" }}>{String(i + 1).padStart(2, "0")}</p>
              <p className="font-semibold mt-3" style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.35 }}>{b.t}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 max-w-[1750px]">
          <div className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${GREEN} / 0.5)`, background: "hsl(0 0% 100% / 0.04)" }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>Door 1 · Use it</p>
            <p className="font-bold mb-2" style={{ fontSize: 28, color: DARK_TEXT, lineHeight: 1.15 }}>30-day proof on one use case from page 8.</p>
            <p style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.4 }}>
              Your team, your data, your CRO's metrics. Measured readout at day 30. Earn the right to scale, or walk away.
            </p>
          </div>
          <div className="rounded-2xl border-2 p-7" style={{ borderColor: `hsl(${ACCENT} / 0.5)`, background: "hsl(0 0% 100% / 0.04)" }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 15, color: `hsl(${ACCENT})` }}>Door 2 · Shape it</p>
            <p className="font-bold mb-2" style={{ fontSize: 28, color: DARK_TEXT, lineHeight: 1.15 }}>Become the GCC reference carrier.</p>
            <p style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.4 }}>
              Same 30-day proof, plus a deeper relationship to co-define the standard playbooks the region will adopt. First-mover position on the regulator-facing audit story.
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-[1750px]" style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>
          Next step: 60 minutes with two of your line-of-business owners. We leave with a chosen use case and a 30-day plan.
        </p>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

const SLIDES = [
  { id: "cover",          title: "Cover · Five questions",          component: <S01Cover /> },
  { id: "conversations",  title: "Five conversations",              component: <S02Conversations /> },
  { id: "pressure",       title: "Why now, why structural",         component: <S03Pressure /> },
  { id: "uc-claims",      title: "UC1 · Claims exceptions",         component: <S04UC1 /> },
  { id: "uc-underwriting",title: "UC2 · Underwriting consistency",  component: <S05UC2 /> },
  { id: "uc-fraud",       title: "UC3 · Fraud / SIU memory",        component: <S06UC3 /> },
  { id: "uc-arabic",      title: "UC4 · Arabic customer AI",        component: <S07UC4 /> },
  { id: "matrix",         title: "Which one is your Friday?",       component: <S08Matrix /> },
  { id: "thirty-days",    title: "The 30-day shape",                component: <S09ThirtyDays /> },
  { id: "under-hood",     title: "Under the hood · Two doors",      component: <S10UnderHood /> },
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
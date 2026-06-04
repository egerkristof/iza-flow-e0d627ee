import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideIndexProvider,
  BG, TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  GREEN, GOLD, RED, ACCENT,
} from "@/pages/TechDDDeck";
import {
  Shell, LensSlide,
  VizModelOutputBare, VizGovernedDecision,
  VizSolutionLoop, VizWrapper,
  VizIceberg,
} from "@/pages/SeedPitchDeckInvestor";
import { StandardLayerDeckSlide } from "@/components/marketing/shared/StandardLayerDeckSlide";

// ═════════════════════════════════════════════════════════════════════════════
// SALES DECK · Head of AI Adoption
// ICP: the person inside an enterprise charged with rolling AI out to a team
// or the whole org. Titles vary (Head of AI Adoption, VP of AI, AI Lead,
// Director of AI Transformation, CAIO, COO sponsor, Chief Digital Officer).
//
// Same Lens grammar as the investor deck, but every slide answers HER question:
//   "How do I make this rollout actually stick — and prove it?"
//
// Left side  (red)   = What the rollout looks like today (pilot purgatory).
// Right side (green) = What a rollout that compounds looks like.
// ═════════════════════════════════════════════════════════════════════════════

const FOOTER_LEFT  = "LIZA OS · For the Head of AI Adoption";
const FOOTER_RIGHT = "From scattered pilots to a rollout that survives audit";

// helper wrapping Shell with our footer
function SH(props: { section: string; n: number; total: number; dark?: boolean; children: React.ReactNode }) {
  return (
    <Shell section={props.section} n={props.n} total={props.total} dark={props.dark}
      footerLeft={FOOTER_LEFT} footerRight={FOOTER_RIGHT}>
      {props.children}
    </Shell>
  );
}

// ─── Sales-native visuals ──────────────────────────────────────────────────

// Scorecard: the KPIs the Head of AI Adoption is measured on
function VizAdoptionScorecard() {
  const rows = [
    { kpi: "% workflows with governed AI in production",  bad: "8%",   good: "60%+" },
    { kpi: "Time from licence purchase → measurable ROI", bad: "18 mo", good: "30 days" },
    { kpi: "Outputs you can replay for Legal / audit",    bad: "0",    good: "100%" },
    { kpi: "Standards owned by the business (not IT)",    bad: "0",    good: "Every team" },
  ];
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}`, background: CARD_ALT }}>
      <div className="grid grid-cols-12 px-6 py-3" style={{ background: CHROME_BG, borderBottom: `1px solid ${CHROME_BORDER}` }}>
        <div className="col-span-6 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>What your board grades you on</div>
        <div className="col-span-3 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 11, color: `hsl(${RED})` }}>Today</div>
        <div className="col-span-3 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>On LIZA</div>
      </div>
      {rows.map((r, i) => (
        <div key={r.kpi} className="grid grid-cols-12 px-6 py-4 items-center"
          style={{ borderBottom: i === rows.length - 1 ? "none" : `1px solid ${CHROME_BORDER}` }}>
          <div className="col-span-6" style={{ fontSize: 16, color: TEXT, lineHeight: 1.3 }}>{r.kpi}</div>
          <div className="col-span-3 text-center font-black" style={{ fontSize: 28, color: `hsl(${RED})`, letterSpacing: "-0.02em" }}>{r.bad}</div>
          <div className="col-span-3 text-center font-black" style={{ fontSize: 28, color: `hsl(${GREEN})`, letterSpacing: "-0.02em" }}>{r.good}</div>
        </div>
      ))}
    </div>
  );
}

// Funnel: where rollouts die today
function VizRolloutFunnel() {
  const SLATE = "215 20% 28%";
  const stages = [
    { label: "Licences bought",     count: "10,000 seats", pct: 100, color: SLATE },
    { label: "Anyone uses weekly",  count: "~1,500",       pct: 15,  color: GOLD },
    { label: "Pilots launched",     count: "14 projects",  pct: 8,   color: GOLD },
    { label: "In real production",  count: "2 projects",   pct: 2,   color: RED },
    { label: "Audit-replayable",    count: "0",            pct: 0,   color: RED },
  ];
  return (
    <div className="w-full flex flex-col gap-2.5">
      {stages.map((s, i) => (
        <div key={s.label} className="flex items-center gap-4">
          <div className="w-[260px] shrink-0 font-mono uppercase tracking-[0.18em]" style={{ fontSize: 12, color: TEXT }}>{s.label}</div>
          <div className="flex-1 h-12 rounded-md relative overflow-hidden" style={{ background: "hsl(0 0% 0% / 0.04)", border: `1px solid ${CHROME_BORDER}` }}>
            <div className="h-full flex items-center px-3"
              style={{ width: `${Math.max(s.pct, 1.5)}%`, background: `hsl(${s.color} / ${s.pct === 0 ? 0.15 : 0.55})`, borderRight: s.pct > 0 ? `2px solid hsl(${s.color})` : "none" }}>
              {s.pct >= 12 && <span className="font-bold text-white" style={{ fontSize: 14 }}>{s.count}</span>}
            </div>
            {s.pct < 12 && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 ml-3 font-bold" style={{ fontSize: 14, color: `hsl(${s.color})`, paddingLeft: `${Math.max(s.pct, 1.5)}%` }}>{s.count}</span>
            )}
          </div>
          <div className="w-[60px] text-right font-mono font-bold" style={{ fontSize: 14, color: `hsl(${s.color})` }}>{s.pct}%</div>
        </div>
      ))}
      <p className="mt-3 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
        Composite of 9 mid-to-large EU enterprises · LIZA OS rollout intake interviews · 2025
      </p>
    </div>
  );
}

// Architecture: where LIZA plugs in, no rip-and-replace
function VizArchitectureFit() {
  const Layer = ({ title, sub, items, accent, dashed }: { title: string; sub: string; items: string[]; accent: string; dashed?: boolean }) => (
    <div className="w-full rounded-xl px-6 py-4 flex items-center gap-6"
      style={{ background: CARD_ALT, border: `${dashed ? "2px dashed" : "1px solid"} ${dashed ? `hsl(${accent})` : CHROME_BORDER}` }}>
      <div className="w-[280px] shrink-0">
        <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: `hsl(${accent})` }}>{sub}</p>
        <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{title}</p>
      </div>
      <div className="flex-1 flex flex-wrap gap-2">
        {items.map(x => (
          <span key={x} className="px-3 py-1.5 rounded-md font-mono" style={{ fontSize: 12, color: TEXT, background: "hsl(0 0% 0% / 0.04)", border: `1px solid ${CHROME_BORDER}` }}>{x}</span>
        ))}
      </div>
    </div>
  );
  return (
    <div className="w-full flex flex-col gap-3">
      <Layer title="Your people, your workflows" sub="Layer 4 · users" accent={GREEN}
        items={["Sales reps", "Underwriters", "Designers", "Analysts", "Ops", "Legal", "Support"]} />
      <Layer title="LIZA OS · the control layer" sub="Layer 3 · what we install" accent={GOLD} dashed
        items={["Standards registry", "AACE runtime", "Signed receipts", "Memory & feedback", "Audit replay"]} />
      <Layer title="Your existing AI tools" sub="Layer 2 · already paid for" accent={GREEN}
        items={["Copilot M365", "ChatGPT Enterprise", "Claude for Work", "Gemini", "your custom RAG"]} />
      <Layer title="Your data, identity & policy" sub="Layer 1 · already in place" accent={GREEN}
        items={["SharePoint / Drive", "SSO / Entra", "DLP & retention", "Snowflake / Databricks", "Sector regs"]} />
      <p className="mt-2 text-center font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
        We slot between your users and the models you already bought. No rip-and-replace. No new model contract required.
      </p>
    </div>
  );
}

// 90-day plan
function Viz90DayPlan() {
  const phases = [
    { p: "Days 0-14",  h: "Scope & wire",      d: "Pick one workflow with you. Install runtime in your environment. SSO + DLP integration. First 5 standards drafted with practitioners.", out: "Standards live · runtime deployed" },
    { p: "Days 15-45", h: "Run with one team", d: "Workflow goes live on LIZA. Every output signed. Decision delta tracked daily. Legal and Finance see receipts.", out: "≥500 signed decisions" },
    { p: "Days 46-75", h: "Measure & defend",  d: "Baseline-vs-LIZA report for your steering group. ROI per decision documented. Audit replay demonstrated.", out: "CFO-ready ROI memo" },
    { p: "Days 76-90", h: "Pick workflow #2",  d: "You decide what scales next. Standards library begins to compound. Second function onboarded under same install.", out: "Next workflow committed" },
  ];
  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full mb-6" style={{ background: "hsl(0 0% 0% / 0.06)" }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "100%", background: `linear-gradient(90deg, hsl(${GOLD}), hsl(${GREEN}))` }} />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {phases.map((s, i) => (
          <div key={s.h} className="rounded-2xl p-5 flex flex-col"
            style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>{s.p}</p>
            <p className="font-black mt-2" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{s.h}</p>
            <p className="mt-3" style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{s.d}</p>
            <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: 10, color: SUBTLE }}>Exit criterion</p>
              <p className="font-bold mt-1" style={{ fontSize: 13, color: `hsl(${GREEN})`, lineHeight: 1.3 }}>{s.out}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Buying committee map
function VizBuyingCommittee() {
  const people = [
    { role: "You · Head of AI Adoption", cares: "Make the rollout actually stick. Defensible numbers per quarter.",       gets: "A 90-day install + a system you can scale workflow by workflow.", color: GREEN },
    { role: "CFO / Finance",             cares: "Per-seat cost without proven outcome. ROI slide that does not hold up.", gets: "Per-decision pricing. Pass-through model cost. Unit econ on day 30.", color: GOLD },
    { role: "Legal / Compliance",        cares: "EU AI Act, sector regulators, internal audit. Cannot show 'how we decided'.", gets: "Signed receipts. Standards with owner + version. Replay on demand.", color: GOLD },
    { role: "CIO / IT / Security",       cares: "Another shadow tool. Vendor lock. Yet another model contract.",          gets: "Runs in your environment. Model-agnostic. SSO + DLP from day one.",   color: GOLD },
  ];
  return (
    <div className="grid grid-cols-2 gap-5 w-full">
      {people.map(p => (
        <div key={p.role} className="rounded-2xl p-6 flex flex-col"
          style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: `hsl(${p.color})` }} />
            <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em" }}>{p.role}</p>
          </div>
          <div className="mt-4">
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${RED})` }}>What keeps them up</p>
            <p className="mt-1.5" style={{ fontSize: 15, color: TEXT, lineHeight: 1.4 }}>{p.cares}</p>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>What LIZA hands them</p>
            <p className="mt-1.5" style={{ fontSize: 15, color: TEXT, lineHeight: 1.4 }}>{p.gets}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Pricing & procurement
function VizPricingProcurement() {
  const lines = [
    { l: "Pricing unit",        v: "Per governed decision",                   sub: "€0.40 / signed output. Volume tiers from 10k/mo." },
    { l: "Model cost",          v: "Pass-through",                            sub: "You keep your existing model contracts. We do not mark up tokens." },
    { l: "Minimum commit",      v: "1 workflow · 90 days",                    sub: "Single PO. Exit at day 30 if exit criteria are not hit." },
    { l: "Deployment",          v: "Your VPC or ours",                        sub: "SOC 2 Type II runtime. EU data residency. SSO / SCIM / DLP standard." },
    { l: "Standards ownership", v: "Yours. Exportable.",                      sub: "Versioned JSON. Lifts to any other runtime. No lock-in clause." },
    { l: "Paper",               v: "MSA · DPA · SCCs ready",                  sub: "Pre-approved by 3 EU enterprise legal teams. Avg. legal cycle: 11 days." },
  ];
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}`, background: CARD_ALT }}>
      {lines.map((r, i) => (
        <div key={r.l} className="grid grid-cols-12 px-6 py-4"
          style={{ borderBottom: i === lines.length - 1 ? "none" : `1px solid ${CHROME_BORDER}` }}>
          <div className="col-span-3 font-mono uppercase tracking-[0.22em] self-center" style={{ fontSize: 11, color: SUBTLE }}>{r.l}</div>
          <div className="col-span-3 font-black self-center" style={{ fontSize: 20, color: `hsl(${GREEN})`, letterSpacing: "-0.02em" }}>{r.v}</div>
          <div className="col-span-6 self-center" style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>{r.sub}</div>
        </div>
      ))}
    </div>
  );
}

// vs alternatives comparison
function VizAlternatives() {
  const cols = [
    { name: "Stay on Copilot only",  tag: "Status quo",         color: RED,   stick: "No",  audit: "No",  speed: "Months",   own: "Vendor"  },
    { name: "Internal build (IT)",   tag: "DIY",                color: GOLD,  stick: "Maybe", audit: "Custom", speed: "6-12 mo", own: "IT squad" },
    { name: "Big-4 consulting",      tag: "Programme",          color: GOLD,  stick: "Until they leave", audit: "Slideware", speed: "9-18 mo", own: "Their PMO" },
    { name: "LIZA OS",               tag: "Control layer",      color: GREEN, stick: "Yes", audit: "Built-in", speed: "30-90 days", own: "Your business" },
  ];
  const rows: { label: string; key: "stick" | "audit" | "speed" | "own" }[] = [
    { label: "Makes adoption stick", key: "stick" },
    { label: "Audit-replayable",     key: "audit" },
    { label: "Time to first ROI",    key: "speed" },
    { label: "Who owns the standards", key: "own" },
  ];
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}`, background: CARD_ALT }}>
      <div className="grid grid-cols-5" style={{ background: CHROME_BG, borderBottom: `1px solid ${CHROME_BORDER}` }}>
        <div className="px-5 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>Dimension</div>
        {cols.map(c => (
          <div key={c.name} className="px-5 py-4" style={{ borderLeft: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${c.color})` }}>{c.tag}</p>
            <p className="font-black mt-1" style={{ fontSize: 16, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{c.name}</p>
          </div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={r.label} className="grid grid-cols-5"
          style={{ borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${CHROME_BORDER}` }}>
          <div className="px-5 py-4 font-bold self-center" style={{ fontSize: 14, color: TEXT }}>{r.label}</div>
          {cols.map(c => (
            <div key={c.name + r.label} className="px-5 py-4 self-center"
              style={{ borderLeft: `1px solid ${CHROME_BORDER}`, background: c.color === GREEN ? `hsl(${GREEN} / 0.06)` : "transparent" }}>
              <p className="font-bold" style={{ fontSize: 15, color: `hsl(${c.color})` }}>{c[r.key]}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Risk-reversed pilot card
function VizRiskReversed() {
  const items = [
    { l: "Day 0",  h: "Signed scope",         d: "One workflow. Three exit criteria written by you. Paper signed." },
    { l: "Day 30", h: "Go / no-go gate",      d: "If we miss any criterion, you exit. No further commitment." },
    { l: "Day 90", h: "Steering review",      d: "Decision delta + ROI memo + audit replay shown to your steering group." },
  ];
  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      {items.map((s, i) => (
        <div key={s.h} className="rounded-2xl p-6 flex flex-col"
          style={{ background: CARD_ALT, border: `1px solid hsl(${GREEN} / 0.4)`, boxShadow: `0 0 0 1px hsl(${GREEN} / 0.1)` }}>
          <p className="font-mono uppercase tracking-[0.24em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>{s.l}</p>
          <p className="font-black mt-2" style={{ fontSize: 26, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{s.h}</p>
          <p className="mt-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>{s.d}</p>
        </div>
      ))}
    </div>
  );
}

// ─── 01 · Cover ─────────────────────────────────────────────────────────────
function S01Cover({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark footerLeft={FOOTER_LEFT} footerRight={FOOTER_RIGHT}>
      <svg className="absolute inset-0 w-full h-full opacity-25" preserveAspectRatio="none" viewBox="0 0 1920 1080">
        {Array.from({ length: 20 }).map((_, r) =>
          Array.from({ length: 32 }).map((_, c) => {
            const x = 100 + c * 56, y = 100 + r * 46;
            const isOp = c > 15;
            const seed = (r * 37 + c * 17) % 100;
            return <circle key={`${r}-${c}`} cx={x} cy={y} r={2.5} fill={isOp ? `hsl(${GREEN})` : `hsl(${RED})`} opacity={0.2 + seed/300} />;
          })
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.32em] mb-8 relative z-10" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          For the Head of AI Adoption
        </p>
        <h1 className="font-black relative z-10" style={{ fontSize: 112, lineHeight: 0.98, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em", maxWidth: 1600 }}>
          Make the rollout<br/>
          <span style={{ color: `hsl(${GREEN})` }}>actually stick.</span>
        </h1>
        <p className="mt-10 relative z-10" style={{ fontSize: 30, lineHeight: 1.3, color: "hsl(0 0% 78%)", maxWidth: 1300 }}>
          LIZA OS is the control layer your AI rollout has been missing. Standards, receipts and memory — built into every workflow, on every model.
        </p>
        <div className="mt-16 relative z-10 rounded-2xl px-10 py-6 flex items-center gap-12"
          style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.12)`, backdropFilter: "blur(6px)" }}>
          <p className="font-mono uppercase tracking-[0.32em]" style={{ fontSize: 13, color: "hsl(0 0% 72%)" }}>
            How to read this deck
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${RED})` }} />
            <p style={{ fontSize: 18, color: "hsl(0 0% 88%)" }}>
              <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>Left</span>: what your rollout looks like today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${GREEN})`, boxShadow: `0 0 12px hsl(${GREEN} / 0.7)` }} />
            <p style={{ fontSize: 18, color: "hsl(0 0% 88%)" }}>
              <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>Right</span>: what a rollout that compounds looks like
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ─── 02 · The reality on your floor (lens) ─────────────────────────────────
function S02Problem({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="The reality on your floor" n={n} total={t}
      topic="What your rollout looks like today"
      framing="You bought the licences. Your team uses AI inconsistently. Nothing the org can replay."
      payload={{
        market: {
          kicker: "What you can already see",
          headline: "Seats handed out. Usage scattered.",
          viz: <VizModelOutputBare />,
          vizLabel: "Diagram · model output with no standard, no receipt, no signer",
          items: [
            { h: "Copilot / ChatGPT Enterprise live", v: "Heavy users 15%. The rest forgot the tab." },
            { h: "Shadow ChatGPT everywhere",         v: "Your real policy is whatever each person types into a free model." },
            { h: "Nothing the org can replay",        v: "When Legal or the regulator asks, the room goes quiet." },
          ],
        },
        operator: {
          kicker: "What stuck adoption actually looks like",
          headline: "Standards, receipts, memory — bound to every workflow.",
          viz: <VizGovernedDecision />,
          vizLabel: "Diagram · same output, wrapped in governance bands",
          items: [
            { h: "Standard bound",   v: "Every workflow runs on the version your team approved." },
            { h: "Receipt signed",   v: "Replayable on demand. Policy, data, model, approver." },
            { h: "Memory compounds", v: "The next call inherits last week's correction. Automatically." },
          ],
          signal: "You stop selling AI internally. The work pulls people in.",
        },
      }}
      bottomLine="A rollout is not a tool deployment. It is a system that makes the new way of working accountable."
    />
  );
}

// ─── 03 · The job you were hired to do ─────────────────────────────────────
function S03Job({ n, t }: { n: number; t: number }) {
  return (
    <SH section="The job you were hired to do" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-8">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            What your board is actually grading
          </p>
          <h2 className="font-black" style={{ fontSize: 56, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            You will be measured on adoption that holds up under audit, not on licences sold.
          </h2>
          <p className="mt-5" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4, maxWidth: 1400 }}>
            Four numbers decide whether next year's AI budget is yours to spend — or someone else's to defend.
          </p>
        </div>
        <div className="flex-1 flex items-center">
          <VizAdoptionScorecard />
        </div>
        <p className="mt-6 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
          Source · 24 Head-of-AI-Adoption discovery interviews · EU mid-to-large enterprises · 2025
        </p>
      </div>
    </SH>
  );
}

// ─── 04 · Where rollouts die today ─────────────────────────────────────────
function S04Funnel({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Where rollouts die" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            The funnel nobody puts in the steering deck
          </p>
          <h2 className="font-black" style={{ fontSize: 52, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Licences in. Production out. The drop-off is not a tool problem — it is a control problem.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizRolloutFunnel />
        </div>
        <p className="mt-5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35, maxWidth: 1500 }}>
          Every step down the funnel is missing the same thing: a standard, a signed receipt, a way to replay the decision next quarter.
        </p>
      </div>
    </SH>
  );
}

// ─── 05 · The accountable unit (lens) ──────────────────────────────────────
function S05Solution({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="What we install" n={n} total={t}
      topic="The unit your rollout is actually missing"
      framing="Most vendors give you a tool. We give you an accountable work unit — and a system that produces it on every model you use."
      payload={{
        market: {
          kicker: "What every other vendor sells",
          headline: "Another chat box. Another seat licence.",
          viz: <VizWrapper />,
          vizLabel: "Diagram · prompt → model → text. No receipt.",
          items: [
            { h: "Per-seat copilots",  v: "Help individuals. Do not change how the team works." },
            { h: "Prompt libraries",   v: "Live in a Notion page. Drift the moment one person edits it." },
            { h: "Per-use-case bots",  v: "20 of them in 18 months. No common audit trail." },
          ],
        },
        operator: {
          kicker: "What LIZA installs in your org",
          headline: "LOCK · COMPILE · SIGN · LEARN. One accountable decision, repeated.",
          viz: <VizSolutionLoop />,
          vizLabel: "Diagram · the 4-station AACE loop, one per call",
          items: [
            { h: "Lock",    v: "Every call binds to your team's versioned playbook." },
            { h: "Compile", v: "Policy, data and rules assembled for that one call." },
            { h: "Sign",    v: "Receipt becomes the next call's context. The org gets smarter, on its own." },
          ],
          signal: "Model-agnostic. Drops in front of Claude, GPT, Gemini, your on-prem model — pick later, switch later.",
        },
      }}
      bottomLine="Adoption follows the unit you measure. We give you a unit that is worth measuring."
    />
  );
}

// ─── 06 · Where LIZA plugs in (architecture) ───────────────────────────────
function S06Architecture({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Where it plugs in" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-16 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            What IT and security need to see first
          </p>
          <h2 className="font-black" style={{ fontSize: 48, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            One layer between your people and the models you already paid for. No rip-and-replace.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizArchitectureFit />
        </div>
      </div>
    </SH>
  );
}

// ─── 07 · 90-day rollout plan ──────────────────────────────────────────────
function S07Plan({ n, t }: { n: number; t: number }) {
  return (
    <SH section="The 90-day plan" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-8 flex items-baseline gap-10">
          <h2 className="font-black" style={{ fontSize: 124, color: `hsl(${GREEN})`, letterSpacing: "-0.05em", lineHeight: 1 }}>90 days</h2>
          <div>
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>From kickoff to a workflow your CFO will defend</p>
            <p className="font-black mt-2" style={{ fontSize: 28, color: TEXT, letterSpacing: "-0.025em", lineHeight: 1.15, maxWidth: 1100 }}>
              One workflow live. One ROI memo. One audit replay. Then you pick what scales next.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <Viz90DayPlan />
        </div>
      </div>
    </SH>
  );
}

// ─── 08 · Proof in production ──────────────────────────────────────────────
function S08Proof({ n, t }: { n: number; t: number }) {
  const stats = [
    { v: "127",       l: "standards live",         s: "Typed playbooks, decision rules and policies running in production across the org's workflows." },
    { v: "3,400 /mo", l: "signed decisions",       s: "Every output bound to a standard, model and approver. Replayable on internal audit." },
    { v: "62%",       l: "drop in time-to-spec",   s: "On the workflows that moved first. Measured against the pre-LIZA baseline. CFO-visible." },
    { v: "0",         l: "audit failures",         s: "Across the regulated AEC deployment to date. Same install pattern available to you." },
  ];
  return (
    <SH section="Proof in production" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-10">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            What another Head of AI Adoption already shipped on LIZA
          </p>
          <h2 className="font-black" style={{ fontSize: 56, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            One regulated enterprise. CTO-sponsored. Live in production. Same install pattern available to you.
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {stats.map((s, i) => (
            <div key={s.l} className="rounded-2xl p-7 flex flex-col"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono" style={{ fontSize: 11, color: SUBTLE, letterSpacing: "0.22em" }}>0{i + 1}</p>
              <p className="font-black mt-3" style={{ fontSize: 60, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.v}</p>
              <p className="font-mono uppercase tracking-[0.22em] mt-4" style={{ fontSize: 12, color: TEXT }}>{s.l}</p>
              <p className="mt-3" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{s.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono uppercase tracking-[0.24em]" style={{ fontSize: 11, color: SUBTLE }}>
          Source: AACE v3.1 runtime · regulated AEC deployment · 12-month rolling window · CTO-sponsored, anonymised on request.
        </p>
      </div>
    </SH>
  );
}

// ─── 09 · Buying committee map ─────────────────────────────────────────────
function S09Committee({ n, t }: { n: number; t: number }) {
  return (
    <SH section="The buying committee" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-7">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            Four people you have to bring along
          </p>
          <h2 className="font-black" style={{ fontSize: 48, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            We give each of them exactly what they need to say yes — and nothing they have to fight you on.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizBuyingCommittee />
        </div>
      </div>
    </SH>
  );
}

// ─── 10 · Pricing & procurement ────────────────────────────────────────────
function S10Pricing({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Pricing & procurement" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-7">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            What your CFO and CISO will ask first
          </p>
          <h2 className="font-black" style={{ fontSize: 48, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Per governed decision. Pass-through tokens. Standards stay yours.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizPricingProcurement />
        </div>
        <p className="mt-5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35, maxWidth: 1500 }}>
          You stop defending seats. You start reporting governed decisions per workflow per month.
        </p>
      </div>
    </SH>
  );
}

// ─── 11 · vs alternatives ──────────────────────────────────────────────────
function S11Alternatives({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Versus your other options" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-7">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            The board will ask why not one of these
          </p>
          <h2 className="font-black" style={{ fontSize: 48, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Stay on Copilot. Build it internally. Hire a Big-4 programme. Install the layer.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizAlternatives />
        </div>
        <p className="mt-5 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
          We do not replace Copilot or your custom builds. We are the control layer they were missing.
        </p>
      </div>
    </SH>
  );
}

// ─── 12 · Risk-reversed pilot ──────────────────────────────────────────────
function S12Pilot({ n, t }: { n: number; t: number }) {
  return (
    <SH section="The pilot, risk-reversed" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-8">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            What you actually sign for
          </p>
          <h2 className="font-black" style={{ fontSize: 52, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Three gates. Your exit criteria, written by you. Walk away at day 30 with no further commitment.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizRiskReversed />
        </div>
        <div className="mt-6 rounded-xl px-7 py-5 flex items-center gap-6"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>What you bring</span>
          <p className="font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
            One executive sponsor. One workflow owner. Access to one model contract. We bring the runtime, the install team and the standards library.
          </p>
        </div>
      </div>
    </SH>
  );
}

function S13Close({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark footerLeft={FOOTER_LEFT} footerRight={FOOTER_RIGHT}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.32em] mb-8" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          One statement
        </p>
        <h2 className="font-black" style={{ fontSize: 92, lineHeight: 1.02, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em", maxWidth: 1600 }}>
          Pilots commoditise.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>The control layer compounds.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 26, color: "hsl(0 0% 78%)", maxWidth: 1280, lineHeight: 1.4 }}>
          You were hired to make AI stick. We build the layer that lets it. One workflow, 30 days, one signed decision — then you scale.
        </p>
        <div className="mt-14 flex items-center gap-6 rounded-2xl px-10 py-5"
          style={{ background: "hsl(0 0% 100% / 0.06)", border: `1px solid hsl(0 0% 100% / 0.16)` }}>
          <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: "hsl(0 0% 72%)" }}>Next step</p>
          <p style={{ fontSize: 20, color: "hsl(0 0% 92%)" }}>
            <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>90-minute scoping call.</span> Pick the workflow. See the install plan. Decide.
          </p>
        </div>
        <p className="mt-10 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: "hsl(0 0% 62%)" }}>
          founder@lizaos.ai
        </p>
      </div>
    </Shell>
  );
}

// ─── Slide registry ────────────────────────────────────────────────────────
const RAW_SLIDES: { id: string; title: string; render: (n: number, t: number) => React.ReactNode }[] = [
  { id: "cover",        title: "Cover",                     render: (n, t) => <S01Cover n={n} t={t} /> },
  { id: "reality",      title: "The reality on your floor", render: (n, t) => <S02Problem n={n} t={t} /> },
  { id: "job",          title: "The job you were hired for",render: (n, t) => <S03Job n={n} t={t} /> },
  { id: "category",     title: "The category · One standard. Every AI surface inherits it.", render: () => <StandardLayerDeckSlide eyebrow="The category · What LIZA installs between AI and action" /> },
  { id: "funnel",       title: "Where rollouts die",        render: (n, t) => <S04Funnel n={n} t={t} /> },
  { id: "solution",     title: "What we install",           render: (n, t) => <S05Solution n={n} t={t} /> },
  { id: "architecture", title: "Where it plugs in",         render: (n, t) => <S06Architecture n={n} t={t} /> },
  { id: "plan",         title: "The 90-day plan",           render: (n, t) => <S07Plan n={n} t={t} /> },
  { id: "proof",        title: "Proof in production",       render: (n, t) => <S08Proof n={n} t={t} /> },
  { id: "committee",    title: "The buying committee",      render: (n, t) => <S09Committee n={n} t={t} /> },
  { id: "pricing",      title: "Pricing & procurement",     render: (n, t) => <S10Pricing n={n} t={t} /> },
  { id: "alternatives", title: "Versus your other options", render: (n, t) => <S11Alternatives n={n} t={t} /> },
  { id: "pilot",        title: "The pilot, risk-reversed",  render: (n, t) => <S12Pilot n={n} t={t} /> },
  { id: "close",        title: "Closing",                   render: (n, t) => <S13Close n={n} t={t} /> },
];

const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      {s.render(i + 1, RAW_SLIDES.length)}
    </SlideIndexProvider>
  ),
}));

// ─── Deck shell (mirrors investor edition) ─────────────────────────────────
export default function SalesDeckAIAdoption() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Sales-AI-Adoption" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Sales Deck · Head of AI Adoption</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            Same lens grammar · operator-led narrative · {SLIDES.length} slides
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Sales-AI-Adoption" slideCount={SLIDES.length} variant="desktop" />
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
              <div className="flex gap-2 flex-wrap max-w-[60%]">
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

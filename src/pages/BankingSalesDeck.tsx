import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideIndexProvider,
  BG, TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  GREEN, GOLD, RED,
} from "@/pages/TechDDDeck";
import {
  Shell, LensSlide,
  VizSolutionLoop, VizWrapper,
} from "@/pages/SeedPitchDeckInvestor";
import { StandardLayerDeckSlide } from "@/components/marketing/shared/StandardLayerDeckSlide";

// ═════════════════════════════════════════════════════════════════════════════
// BANKING SALES DECK
//
// ICP: Head of AI / Digital / Innovation in a bank — including securities
// (sales & trading), capital markets and bank operations. Sponsors who own
// "make AI stick in the bank without blowing up the desk, the brand,
// compliance or audit." Co-buyers: CCO / Legal, CFO, CIO / CISO, Head of
// Trading / Markets, Head of Marketing.
//
// Same StoryBrand grammar as /get-started, generic banking flavor that
// reads cleanly to a Head of AI at a securities house or universal bank:
//   Left  (red)   = what AI in the bank looks like today (shadow tools, no audit).
//   Right (green) = what a governed rollout looks like (one standard, every surface).
// ═════════════════════════════════════════════════════════════════════════════

const FOOTER_LEFT  = "LIZA OS · For Heads of AI, Digital and Compliance in banking — markets, ops, risk";
const FOOTER_RIGHT = "From shadow Copilot to a rollout the desk, audit and the regulator can defend";

function SH(props: { section: string; n: number; total: number; dark?: boolean; children: React.ReactNode }) {
  return (
    <Shell section={props.section} n={props.n} total={props.total} dark={props.dark}
      footerLeft={FOOTER_LEFT} footerRight={FOOTER_RIGHT}>
      {props.children}
    </Shell>
  );
}

// ─── Banking-native visuals ────────────────────────────────────────────────

// A model output a trader, salesperson, RM or KYC analyst would actually paste back into the bank
function VizBankModelOutputBare() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl px-6 py-5 text-center"
        style={{ background: "hsl(0 0% 100%)", border: `1px dashed hsl(${RED} / 0.5)`, minWidth: 280 }}>
        <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 9, color: SUBTLE }}>Draft from ChatGPT · personal account</p>
        <p className="font-black" style={{ fontSize: 20, color: TEXT, lineHeight: 1.15 }}>
          "Here is your<br/>RFQ response / KYC note."
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center" style={{ maxWidth: 320 }}>
        {["no desk standard", "no policy version", "no signer", "no audit replay"].map((x) => (
          <span key={x} className="font-mono px-2 py-1 rounded"
            style={{ fontSize: 10, color: `hsl(${RED})`, background: `hsl(${RED} / 0.08)`, border: `1px solid hsl(${RED} / 0.3)` }}>?{x}</span>
        ))}
      </div>
    </div>
  );
}

// Same draft, but signed inside the bank's Decision Layer
function VizBankGovernedDecision() {
  const tags = [
    { k: "STANDARD",   v: "Credit-RFQ-Quote v4.1" },
    { k: "POLICY",     v: "MiFID II Best Ex · Consumer Duty" },
    { k: "MODEL",      v: "gpt-5 · M365 tenant" },
    { k: "APPROVER",   v: "Desk head + Compliance · 14:02" },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl px-6 py-4 text-center"
        style={{ background: "hsl(0 0% 100%)", border: `2px solid hsl(${GREEN} / 0.5)`, minWidth: 300, boxShadow: `0 0 24px hsl(${GREEN} / 0.15)` }}>
        <p className="font-mono uppercase tracking-[0.22em] mb-1" style={{ fontSize: 9, color: `hsl(${GREEN})` }}>Governed decision · signed receipt</p>
        <p className="font-black" style={{ fontSize: 20, color: TEXT, lineHeight: 1.15 }}>
          "Here is your<br/>RFQ response / KYC note."
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-2" style={{ width: 360 }}>
        {tags.map((t) => (
          <div key={t.k} className="rounded px-2 py-1.5"
            style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 8, color: `hsl(${GREEN})` }}>{t.k}</p>
            <p className="font-mono" style={{ fontSize: 10, color: TEXT, marginTop: 1 }}>{t.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// What the board / regulator actually grades you on
function VizBankScorecard() {
  const rows = [
    { kpi: "AI outputs on an approved standard",       bad: "<10%", good: "60%+" },
    { kpi: "Cycle time, intake to approved output",    bad: "Days", good: "Minutes" },
    { kpi: "Decisions replayable for the regulator",   bad: "0",    good: "100%" },
    { kpi: "Standards owned by the business, not IT",  bad: "0",    good: "Every team" },
  ];
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}`, background: CARD_ALT }}>
      <div className="grid grid-cols-12 px-6 py-3" style={{ background: CHROME_BG, borderBottom: `1px solid ${CHROME_BORDER}` }}>
        <div className="col-span-6 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>What you get graded on</div>
        <div className="col-span-3 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 11, color: `hsl(${RED})` }}>Today</div>
        <div className="col-span-3 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>On LIZA</div>
      </div>
      {rows.map((r, i) => (
        <div key={r.kpi} className="grid grid-cols-12 px-6 py-6 items-center"
          style={{ borderBottom: i === rows.length - 1 ? "none" : `1px solid ${CHROME_BORDER}` }}>
          <div className="col-span-6 font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.25 }}>{r.kpi}</div>
          <div className="col-span-3 text-center font-black" style={{ fontSize: 40, color: `hsl(${RED})`, letterSpacing: "-0.03em" }}>{r.bad}</div>
          <div className="col-span-3 text-center font-black" style={{ fontSize: 40, color: `hsl(${GREEN})`, letterSpacing: "-0.03em" }}>{r.good}</div>
        </div>
      ))}
    </div>
  );
}

// Where AI dies inside the bank today
function VizBankFunnel() {
  const SLATE = "215 20% 28%";
  const stages = [
    { label: "AI licences in the bank",     count: "12,000 seats",   pct: 100, color: SLATE },
    { label: "Anyone uses weekly",          count: "~1,800",         pct: 15,  color: GOLD },
    { label: "Quotes / cases / drafts produced", count: "~600 / month", pct: 5, color: GOLD },
    { label: "Approved by desk + compliance", count: "~120 / month",  pct: 1,   color: RED },
    { label: "Replayable for the regulator", count: "0",             pct: 0,   color: RED },
  ];
  return (
    <div className="w-full flex flex-col gap-2.5">
      {stages.map((s) => (
        <div key={s.label} className="flex items-center gap-4">
          <div className="w-[300px] shrink-0 font-mono uppercase tracking-[0.18em]" style={{ fontSize: 12, color: TEXT }}>{s.label}</div>
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
        Composite of bank AI rollout interviews · retail, capital markets and securities · CEE and Western Europe · 2025
      </p>
    </div>
  );
}

// Where LIZA plugs into a bank stack (no rip-and-replace)
function VizBankArchitecture() {
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
        items={["Traders & Sales", "RFQ desk", "RMs", "KYC analysts", "Underwriters", "Credit memos", "Complaints", "Contact centre", "Marketing", "Compliance", "Surveillance", "Legal"]} />
      <Layer title="LIZA OS · the Decision Layer" sub="Layer 3 · what we install" accent={GOLD} dashed
        items={["Desk, product & brand standards", "Policy registry", "AACE runtime", "Signed receipts", "Audit replay", "Memory & feedback"]} />
      <Layer title="Your existing AI tools" sub="Layer 2 · already paid for" accent={GREEN}
        items={["Copilot M365", "ChatGPT Enterprise", "Gemini", "In-house RAG", "Vendor copilots in core / CRM"]} />
      <Layer title="Your bank stack, data, identity & policy" sub="Layer 1 · already in place" accent={GREEN}
        items={["Core banking", "OMS / EMS", "CRM", "Market data — Bloomberg · Tradeweb · MarketAxess", "Data warehouse", "GRC / AML / Surveillance", "SSO / Entra", "DLP & retention", "MiFID II · EBA · DORA · Consumer Duty"]} />
      <p className="mt-2 text-center font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
        We slot between your people and the models you already bought. No rip-and-replace. No new core contract.
      </p>
    </div>
  );
}

// Trade lifecycle map: 5 stages, named bottleneck, where LIZA plugs in.
// Reads directly to a markets / securities reader (RFQ, pricing, OMS, booking).
function VizTradeLifecycle() {
  const stages = [
    {
      n: "01",
      stage: "Client interaction",
      sub: "RFQ · voice · chat",
      pain: "Fragmented intake. Gut-feel prioritisation.",
      liza: "RFQ triage. One ranked queue, every channel.",
    },
    {
      n: "02",
      stage: "Pricing & quoting",
      sub: "Liquid auto · structured by hand",
      pain: "Trader is the bottleneck. Slow quote = adverse selection.",
      liza: "Auto-draft the standard. Assemble context for the rest.",
    },
    {
      n: "03",
      stage: "Order management",
      sub: "OMS · pre-trade",
      pain: "Limits, best-ex, sanctions still partly manual.",
      liza: "Validate, enrich, limit-check. Signed best-ex receipt.",
    },
    {
      n: "04",
      stage: "Execution & routing",
      sub: "Algos · voice",
      pain: "Latency rules agents out of the hot path.",
      liza: "Carved out by design. Humans keep P&L decisions.",
    },
    {
      n: "05",
      stage: "Trade capture & booking",
      sub: "Middle & back office",
      pain: "Manual capture. Leading source of breaks and rework.",
      liza: "Draft term sheets and confirms. Anomaly flags before booking.",
    },
  ];
  const realities = [
    "Explainable & auditable",
    "Latency carve-out",
    "Information barriers",
    "Model-risk governed",
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3">
        {stages.map((s) => (
          <div key={s.n} className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <div className="px-5 py-4" style={{ background: CHROME_BG, borderBottom: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: SUBTLE }}>Stage {s.n}</p>
              <p className="font-black mt-1" style={{ fontSize: 20, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{s.stage}</p>
              <p className="font-mono uppercase tracking-[0.18em] mt-1" style={{ fontSize: 9, color: SUBTLE }}>{s.sub}</p>
            </div>
            <div className="px-5 py-4 flex-1" style={{ borderBottom: `1px solid ${CHROME_BORDER}`, background: `hsl(${RED} / 0.04)` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 10, color: `hsl(${RED})` }}>Bottleneck</p>
              <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>{s.pain}</p>
            </div>
            <div className="px-5 py-4 flex-1" style={{ background: `hsl(${GREEN} / 0.05)` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>LIZA</p>
              <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>{s.liza}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl px-6 py-4 flex items-center gap-6"
        style={{ background: `hsl(${GOLD} / 0.07)`, border: `1px solid hsl(${GOLD} / 0.35)` }}>
        <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: `hsl(${GOLD})` }}>Designed around</span>
        <div className="flex flex-wrap gap-2.5">
          {realities.map((r) => (
            <span key={r} className="font-mono px-3 py-1.5 rounded-md"
              style={{ fontSize: 12, color: TEXT, background: "hsl(0 0% 100%)", border: `1px solid ${CHROME_BORDER}` }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 90-day banking rollout plan
function Viz90DayBankPlan() {
  const phases = [
    { p: "Days 0-14",  h: "Scope & wire",      d: "One workflow picked with you. Runtime in your environment, SSO + DLP. First 5 standards drafted.",         out: "Standards live · runtime deployed" },
    { p: "Days 15-45", h: "Run with one desk", d: "Workflow live with one team. Every output signed. Desk head and Compliance see receipts daily.",          out: "500+ signed decisions" },
    { p: "Days 46-75", h: "Measure & defend",  d: "Baseline-vs-LIZA report. Response time, hit rate, rework cost. Regulator-ready audit replay demonstrated.", out: "CFO-ready ROI memo" },
    { p: "Days 76-90", h: "Pick workflow #2",  d: "You choose what scales next. Standards library starts compounding across the bank.",                       out: "Next workflow committed" },
  ];
  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full mb-6" style={{ background: "hsl(0 0% 0% / 0.06)" }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "100%", background: `linear-gradient(90deg, hsl(${GOLD}), hsl(${GREEN}))` }} />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {phases.map((s) => (
          <div key={s.h} className="rounded-2xl p-5 flex flex-col"
            style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>{s.p}</p>
            <p className="font-black mt-3" style={{ fontSize: 28, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{s.h}</p>
            <p className="mt-4" style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{s.d}</p>
            <div className="mt-auto pt-4" style={{ borderTop: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: 10, color: SUBTLE }}>Exit criterion</p>
              <p className="font-bold mt-1.5" style={{ fontSize: 15, color: `hsl(${GREEN})`, lineHeight: 1.3 }}>{s.out}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bank buying-committee map
function VizBankCommittee() {
  const people = [
    { role: "Head of AI / Digital",       cares: "Make AI stick. Defensible ROI. Nothing that blows up.",                   gets: "90-day install. Scales workflow by workflow, desk by desk.",       color: GREEN },
    { role: "Chief Compliance / Legal",   cares: "MiFID II, EBA, DORA, Consumer Duty. Today you can't show how AI decided.", gets: "Signed receipts. Versioned standards. Replay on demand.",         color: GOLD },
    { role: "CFO / Head of Markets",      cares: "Per-seat spend, no proven outcome. ROI that doesn't hold up.",            gets: "Per-decision pricing. Pass-through tokens. Unit economics on day 30.", color: GOLD },
    { role: "CIO / CISO",                 cares: "Shadow tools. Vendor lock. Data residency. Information barriers.",        gets: "Runs in your VPC. Model-agnostic. SSO, DLP, barriers, EU residency.", color: GOLD },
  ];
  return (
    <div className="grid grid-cols-2 gap-5 w-full">
      {people.map(p => (
        <div key={p.role} className="rounded-2xl p-7 flex flex-col"
          style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${p.color})` }} />
            <p className="font-black" style={{ fontSize: 26, color: TEXT, letterSpacing: "-0.02em" }}>{p.role}</p>
          </div>
          <div className="mt-5">
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: `hsl(${RED})` }}>Keeps them up</p>
            <p className="mt-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>{p.cares}</p>
          </div>
          <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>LIZA hands them</p>
            <p className="mt-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>{p.gets}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Pricing & procurement (banking flavor)
function VizBankPricing() {
  const lines = [
    { l: "Pricing unit",        v: "Per governed decision",      sub: "€0.40 per signed output. Volume tiers from 10k/month." },
    { l: "Model cost",          v: "Pass-through",               sub: "You keep your existing model contracts. We do not mark up tokens." },
    { l: "Minimum commit",      v: "1 workflow · 90 days",       sub: "Single PO. Exit at day 30 if exit criteria are not hit." },
    { l: "Deployment",          v: "Your VPC or ours",           sub: "SOC 2 Type II runtime. EU data residency. SSO / SCIM / DLP standard." },
    { l: "Standards ownership", v: "Yours. Exportable.",         sub: "Versioned JSON. Lifts to any other runtime. No lock-in clause." },
    { l: "Paper",               v: "MSA · DPA · SCCs ready",     sub: "Pre-approved by EU enterprise legal teams. Avg. legal cycle: 11 days." },
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

// vs alternatives
function VizBankAlternatives() {
  const cols = [
    { name: "Stay on Copilot only",   tag: "Status quo",    color: RED,   stick: "No",    audit: "No",        speed: "Months",     own: "Vendor"      },
    { name: "Internal IT build",      tag: "DIY",           color: GOLD,  stick: "Maybe", audit: "Custom",    speed: "12-18 mo",   own: "IT squad"    },
    { name: "Big-4 transformation",   tag: "Programme",     color: GOLD,  stick: "While they are there", audit: "Slideware", speed: "12-24 mo", own: "Their PMO" },
    { name: "LIZA OS",                tag: "Standard layer", color: GREEN, stick: "Yes",  audit: "Built-in",  speed: "30-90 days", own: "Your bank"   },
  ];
  const rows: { label: string; key: "stick" | "audit" | "speed" | "own" }[] = [
    { label: "Makes adoption stick",       key: "stick" },
    { label: "Audit + regulator replay",   key: "audit" },
    { label: "Time to first ROI",          key: "speed" },
    { label: "Who owns the standards",     key: "own"   },
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

// Risk-reversed pilot
function VizBankRiskReversed() {
  const items = [
    { l: "Day 0",  h: "Signed scope",     d: "One workflow (campaign brief, KYC adjudication or complaint response). Three exit criteria written by you. Paper signed." },
    { l: "Day 30", h: "Go / no-go gate",  d: "If we miss any criterion, you exit. No further commitment, no claw-back fight." },
    { l: "Day 90", h: "Steering review",  d: "Decision delta, ROI memo and regulator-ready audit replay shown to your steering group." },
  ];
  return (
    <div className="grid grid-cols-3 gap-5 w-full">
      {items.map((s) => (
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
          For Heads of AI, Digital and Compliance in banking — markets, ops and risk
        </p>
        <h1 className="font-black relative z-10" style={{ fontSize: 108, lineHeight: 0.98, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em", maxWidth: 1600 }}>
          One standard.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>Every AI surface in your bank inherits it.</span>
        </h1>
        <p className="mt-10 relative z-10" style={{ fontSize: 28, lineHeight: 1.3, color: "hsl(0 0% 78%)", maxWidth: 1320 }}>
          LIZA OS is the Decision Layer between every AI tool your bank already runs and every client-facing, desk-facing, regulator-facing decision that comes out of it — from RFQs and quotes on the trading floor to KYC, credit memos and complaints. Built with Standards Engineering. Governed by your own rules.
        </p>
        <div className="mt-14 relative z-10 rounded-2xl px-10 py-6 flex items-center gap-12"
          style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.12)`, backdropFilter: "blur(6px)" }}>
          <p className="font-mono uppercase tracking-[0.32em]" style={{ fontSize: 13, color: "hsl(0 0% 72%)" }}>
            How to read this deck
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${RED})` }} />
            <p style={{ fontSize: 18, color: "hsl(0 0% 88%)" }}>
              <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>Left</span>: AI in your bank today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${GREEN})`, boxShadow: `0 0 12px hsl(${GREEN} / 0.7)` }} />
            <p style={{ fontSize: 18, color: "hsl(0 0% 88%)" }}>
              <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>Right</span>: AI in a bank that has installed the Decision Layer
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ─── 02 · The reality on your floor ────────────────────────────────────────
function S02Problem({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="The reality on your floor" n={n} total={t}
      topic="What AI on your floor looks like today"
      framing="You bought the licences. Traders, sales, RMs and ops teams use AI inconsistently. Compliance never sees the same draft twice, and the desk head cannot defend it."
      payload={{
        market: {
          kicker: "What you can already see",
          headline: "Seats handed out. Desk, brand and compliance drift everywhere.",
          viz: <VizBankModelOutputBare />,
          vizLabel: "Diagram · AI output with no standard, no receipt, no signer",
          items: [
            { h: "Copilot / ChatGPT Enterprise live", v: "Heavy users 15%. The rest forgot the tab. Real usage is shadow ChatGPT on personal accounts." },
            { h: "Your real desk policy",             v: "Whatever each trader, salesperson, RM or analyst types into a free model between RFQs." },
            { h: "Nothing the bank can replay",       v: "When the desk head, Compliance, internal audit or the regulator asks 'how did AI decide this?', the room goes quiet." },
          ],
        },
        operator: {
          kicker: "What a governed rollout actually looks like",
          headline: "Standards, receipts, memory bound to every workflow — desk by desk.",
          viz: <VizBankGovernedDecision />,
          vizLabel: "Diagram · the same output, wrapped in standards and signed receipts",
          items: [
            { h: "Standard bound",     v: "Every RFQ response, KYC narrative, credit memo and complaint reply runs on the version the desk, Product and Compliance approved." },
            { h: "Receipt signed",     v: "Replayable on demand. Standard version, data, model, approver, desk. MiFID II / Consumer Duty / EBA-ready." },
            { h: "Memory compounds",   v: "The next case inherits last week's correction automatically. The desk gets smarter without retraining anyone." },
          ],
          signal: "You stop selling AI inside the bank. The desk pulls it in because it makes them faster and more defensible.",
        },
      }}
      bottomLine="An AI rollout is not a tool deployment. It is the system that makes the new way of working accountable to your desk, your auditor and your regulator."
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
            What your board and your regulator are actually grading
          </p>
          <h2 className="font-black" style={{ fontSize: 54, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            You will be measured on AI that holds up under audit, not on licences sold.
          </h2>
          <p className="mt-5" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4, maxWidth: 1400 }}>
            Four numbers decide whether next year's AI budget is yours to spend or someone else's to defend.
          </p>
        </div>
        <div className="flex-1 flex items-center">
          <VizBankScorecard />
        </div>
        <p className="mt-6 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
          Source · Discovery interviews with Heads of AI, Digital and Compliance at retail banks · CEE and Western Europe · 2025
        </p>
      </div>
    </SH>
  );
}

// ─── 04 · Where rollouts die ───────────────────────────────────────────────
function S04Funnel({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Where rollouts die" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            The funnel nobody puts in the steering deck
          </p>
          <h2 className="font-black" style={{ fontSize: 50, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Licences in. Approved, audit-ready work out. The drop-off is not a tool problem, it is a control problem.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizBankFunnel />
        </div>
        <p className="mt-5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35, maxWidth: 1500 }}>
          Every step down the funnel is missing the same thing: a standard, a signed receipt, a way to replay the decision next quarter.
        </p>
      </div>
    </SH>
  );
}

// ─── 05 · What we install (lens) ───────────────────────────────────────────
function S05Solution({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="What we install" n={n} total={t}
      topic="The unit your bank's AI rollout is missing"
      framing="Other vendors give you a tool. We install the Decision Layer that produces one accountable, regulator-replayable decision — on every model your bank uses, on every desk and in every workflow."
      payload={{
        market: {
          kicker: "What every other vendor sells",
          headline: "Another chat box. Another seat licence.",
          viz: <VizWrapper />,
          vizLabel: "Diagram · prompt to model to text. No receipt.",
          items: [
            { h: "Per-seat copilots",   v: "Help individuals. Do not change how the bank works." },
            { h: "Prompt libraries",    v: "Live in a Notion page. Drift the moment one trader or marketer edits one line." },
            { h: "Per-use-case bots",   v: "20 of them in 18 months. No common audit trail. No regulator story." },
          ],
        },
        operator: {
          kicker: "What LIZA installs in your bank",
          headline: "LOCK · COMPILE · SIGN · LEARN. One accountable decision, repeated across every surface.",
          viz: <VizSolutionLoop />,
          vizLabel: "Diagram · the 4-station AACE loop, one per call",
          items: [
            { h: "Lock",    v: "Every RFQ response, quote draft, KYC narrative, credit memo or complaint reply binds to the bank's versioned standard." },
            { h: "Compile", v: "Desk policy, product T&Cs, MiFID II best-ex / Consumer Duty rules and the position / customer record assembled for that one decision." },
            { h: "Sign",    v: "Signed receipt: standard version, sources, model, approver. Replayable for internal audit and the regulator." },
            { h: "Learn",   v: "Compliance corrections feed back into the standard. The next case inherits them automatically." },
          ],
          signal: "Model-agnostic. Sits in front of Copilot, ChatGPT, Gemini, your in-house RAG. Pick later, switch later.",
        },
      }}
      bottomLine="Adoption follows the unit you measure. We give your bank a unit the regulator agrees is worth measuring."
    />
  );
}

// ─── 06 · Where it plugs in (architecture) ─────────────────────────────────
function S06Architecture({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Where it plugs in" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-16 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            What CIO, CISO and Compliance need to see first
          </p>
          <h2 className="font-black" style={{ fontSize: 46, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            One layer between your people and the models you already paid for. No rip-and-replace. No new core contract.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizBankArchitecture />
        </div>
      </div>
    </SH>
  );
}

// ─── 07 · 90-day plan ──────────────────────────────────────────────────────
function S07Plan({ n, t }: { n: number; t: number }) {
  return (
    <SH section="The 90-day plan" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-8 flex items-baseline gap-10">
          <h2 className="font-black" style={{ fontSize: 124, color: `hsl(${GREEN})`, letterSpacing: "-0.05em", lineHeight: 1 }}>90 days</h2>
          <div>
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>From kickoff to a workflow your CFO and your regulator can both defend</p>
            <p className="font-black mt-2" style={{ fontSize: 28, color: TEXT, letterSpacing: "-0.025em", lineHeight: 1.15, maxWidth: 1100 }}>
              One workflow live. One ROI memo. One audit replay. Then you pick what scales next.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <Viz90DayBankPlan />
        </div>
      </div>
    </SH>
  );
}

// ─── 06b · Trade lifecycle map ─────────────────────────────────────────────
function S06bLifecycle({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Where it plugs into the trade lifecycle" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-16 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            From client interaction to booking · the five stages, the named bottlenecks, where LIZA does the legwork
          </p>
          <h2 className="font-black" style={{ fontSize: 44, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Agents do the legwork around the trade. Humans keep the P&L decisions. Every step carries a signed receipt.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizTradeLifecycle />
        </div>
      </div>
    </SH>
  );
}


// ─── 08 · Proof in production ──────────────────────────────────────────────
function S08Proof({ n, t }: { n: number; t: number }) {
  const stats = [
    { v: "127",       l: "standards live",          s: "Typed playbooks, desk rules and policy registers in production. The bank equivalent: RFQ / quote standards, KYC narratives, credit memos, complaint templates, campaign briefs." },
    { v: "3,400 /mo", l: "signed decisions",        s: "Every output bound to a standard, model and approver. The same shape your desk head, internal audit and the regulator will ask for, replayable on demand." },
    { v: "62%",       l: "drop in time-to-output",  s: "On the workflows that moved first. CFO- and desk-visible against the pre-LIZA baseline. In banking: RFQ response, KYC adjudication, complaint response and credit-memo cycle time." },
    { v: "0",         l: "audit failures",          s: "Across the regulated reference deployment to date. Same install pattern available for MiFID II, EBA, DORA, Consumer Duty and local regulator scrutiny." },
  ];
  return (
    <SH section="Proof in production" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-10">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            What another regulated enterprise already shipped on LIZA · how it lands inside a bank
          </p>
          <h2 className="font-black" style={{ fontSize: 54, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            CTO-sponsored. Live in production. The same install pattern, mapped to four banking workflows.
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
          Source · AACE v3.1 runtime · regulated reference deployment · 12-month rolling window · CTO-sponsored, anonymised on request · banking workflows mapped 1:1 in pilot scoping.
        </p>
      </div>
    </SH>
  );
}

// ─── 09 · Buying committee ─────────────────────────────────────────────────
function S09Committee({ n, t }: { n: number; t: number }) {
  return (
    <SH section="The buying committee" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-7">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            Four people you have to bring along
          </p>
          <h2 className="font-black" style={{ fontSize: 46, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            We give each of them exactly what they need to say yes, and nothing they have to fight you on.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizBankCommittee />
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
          <VizBankPricing />
        </div>
        <p className="mt-5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35, maxWidth: 1500 }}>
          You stop defending seats. You start reporting governed decisions per workflow per month.
        </p>
      </div>
    </SH>
  );
}

// ─── 11 · Vs alternatives ──────────────────────────────────────────────────
function S11Alternatives({ n, t }: { n: number; t: number }) {
  return (
    <SH section="Versus your other options" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-7">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            The board will ask why not one of these
          </p>
          <h2 className="font-black" style={{ fontSize: 46, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Stay on Copilot. Build it internally. Hire a Big-4 programme. Install the Decision Layer.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizBankAlternatives />
        </div>
        <p className="mt-5 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
          We do not replace Copilot or your in-house RAG. We are the decision layer they were missing.
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
          <h2 className="font-black" style={{ fontSize: 50, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Three gates. Your exit criteria, written by you. Walk away at day 30 with no further commitment.
          </h2>
        </div>
        <div className="flex-1 flex items-center">
          <VizBankRiskReversed />
        </div>
        <div className="mt-6 rounded-xl px-7 py-5 flex items-center gap-6"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>What you bring</span>
          <p className="font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
            One executive sponsor. One workflow owner from the business. Access to one model contract. We bring the runtime, the install team and the standards library.
          </p>
        </div>
      </div>
    </SH>
  );
}

// ─── 13 · Close ────────────────────────────────────────────────────────────
function S13Close({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark footerLeft={FOOTER_LEFT} footerRight={FOOTER_RIGHT}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.32em] mb-8" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          One statement
        </p>
        <h2 className="font-black" style={{ fontSize: 88, lineHeight: 1.02, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em", maxWidth: 1600 }}>
          Pilots commoditise.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>The Decision Layer compounds.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 26, color: "hsl(0 0% 78%)", maxWidth: 1320, lineHeight: 1.4 }}>
          You were hired to make AI stick inside the bank without blowing up the desk, the brand or compliance. We build the layer that lets it. One workflow, 30 days, one signed decision — then you scale across RFQ / quote drafting, KYC, complaints, credit, trade documentation and group governance.
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
  { id: "category",     title: "The category · One standard. Every AI surface inherits it.", render: () => (
    <StandardLayerDeckSlide
      eyebrow="The category · What LIZA installs between AI and action in your bank"
      footnote="Reality → AI Layer → The Decision Layer → Execution → Outcomes."
      stages={[
        {
          title: "Reality",
          sub: "Your bank's signals & data",
          examples: ["Core banking, CRM, payments", "OMS / EMS, market data (Bloomberg, Tradeweb, MarketAxess)", "Inbound RFQs, calls, complaints, tickets", "KYC docs, term sheets, contracts, policies"],
        },
        {
          title: "AI Layer",
          sub: "Models, copilots, agents",
          examples: ["Copilot M365, ChatGPT Ent.", "Gemini, Claude", "In-house RAG, vendor copilots", "Agent frameworks"],
        },
        {
          title: "Execution",
          sub: "Bank teams, systems, agents",
          examples: ["Quote drafts & RFQ responses", "KYC adjudications, credit memos, complaint replies", "Writes to OMS, core, CRM, GRC", "Regulator & desk-head deliverables"],
        },
        {
          title: "Outcomes",
          sub: "Results, audit, learning",
          examples: ["Hit rate, response time, NPS, CSAT", "Signed receipts & lineage", "MiFID II / EBA / DORA / Consumer Duty evidence", "Standards updated for next RFQ / case"],
        },
      ]}
    />
  ) },
  { id: "funnel",       title: "Where rollouts die",        render: (n, t) => <S04Funnel n={n} t={t} /> },
  { id: "solution",     title: "What we install",           render: (n, t) => <S05Solution n={n} t={t} /> },
  { id: "architecture", title: "Where it plugs in",         render: (n, t) => <S06Architecture n={n} t={t} /> },
  { id: "lifecycle",    title: "Where it plugs into the trade lifecycle", render: (n, t) => <S06bLifecycle n={n} t={t} /> },
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

// ─── Deck shell (mirrors get-started edition) ──────────────────────────────
export default function BankingSalesDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Banking-Sales-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Banking Sales Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            Retail banking · Decision Layer narrative · {SLIDES.length} slides
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Banking-Sales-Deck" slideCount={SLIDES.length} variant="desktop" />
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
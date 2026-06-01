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
  VizContextSmall, VizContextHuge,
  VizSolutionLoop, VizWrapper,
  VizFactoryWalkthrough,
  VizCrossingCurves, VizTokenDown,
  VizIceberg, VizWeekendDemo,
  VizGovernanceStack, VizLabExpansion,
  VizValueBar, VizSeatDecay,
  VizMoatLayers,
} from "@/pages/SeedPitchDeckInvestor";

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
const FOOTER_RIGHT = "From pilots to a system that compounds";

// helper wrapping Shell with our footer
function SH(props: { section: string; n: number; total: number; dark?: boolean; children: React.ReactNode }) {
  return (
    <Shell section={props.section} n={props.n} total={props.total} dark={props.dark}
      footerLeft={FOOTER_LEFT} footerRight={FOOTER_RIGHT}>
      {props.children}
    </Shell>
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

// ─── 02 · The rollout problem ──────────────────────────────────────────────
function S02Problem({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="The rollout problem" n={n} total={t}
      topic="What you actually have on the floor"
      framing="Your org bought the licences. The work did not change. Adoption flatlined the moment the demo ended."
      payload={{
        market: {
          kicker: "What your rollout looks like today",
          headline: "Seats handed out. Usage scattered.",
          viz: <VizModelOutputBare />,
          vizLabel: "Diagram · model output with no standard, no receipt, no signer",
          items: [
            { h: "Copilot / ChatGPT Enterprise rolled out", v: "Heavy users 15%. The rest forgot the tab." },
            { h: "Shadow ChatGPT everywhere",              v: "Your real policy is whatever each person types into a free model." },
            { h: "Nothing the org can replay",             v: "When Legal or the regulator asks, the room goes quiet." },
          ],
        },
        operator: {
          kicker: "What a rollout that compounds looks like",
          headline: "Standards, receipts, memory — bound to every workflow.",
          viz: <VizGovernedDecision />,
          vizLabel: "Diagram · same output, wrapped in 4 governance bands",
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

// ─── 03 · Why rollouts get stuck (context explosion) ───────────────────────
function S03Why({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why rollouts stall" n={n} total={t}
      topic="The shape of the problem keeps changing under you"
      framing="Today's pilot fits in a chat. Real adoption spans every team, workflow, policy and handover in the org."
      payload={{
        market: {
          kicker: "What the pilot covered",
          headline: "One team. One use case. One chat.",
          viz: <VizContextSmall />,
          vizLabel: "Diagram · 1 user · 1 chat · ~10k tokens",
          items: [
            { h: "Demo-grade context",  v: "Whatever fit in the prompt that day." },
            { h: "No receipts",         v: "Nothing the next team can reuse." },
            { h: "No compounding",      v: "The pilot ends. The org learns nothing." },
          ],
        },
        operator: {
          kicker: "What scaling AI actually looks like",
          headline: "Every role, every workflow, every policy — all moving at once.",
          viz: <VizContextHuge />,
          vizLabel: "Diagram · context surface across an enterprise",
          items: [
            { h: "Cannot stay siloed",  v: "Sales, ops, legal, support — same standards must reach all of them." },
            { h: "Cannot stay manual",  v: "PDFs and wiki pages will not keep up with the model release calendar." },
            { h: "Must be auditable",   v: "Internal audit, EU AI Act, sector regulators all ask the same question." },
          ],
          signal: "Pilots fail not because the model is wrong. They fail because the org around it never changed shape.",
        },
      }}
      bottomLine="Most rollouts try to scale a chat UI. What actually scales is the control layer underneath."
    />
  );
}

// ─── 04 · Solution unit (governed decision) ────────────────────────────────
function S04Solution({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="What we deploy" n={n} total={t}
      topic="The unit of rollout"
      framing="Most vendors give you a tool. We give you an accountable work unit — and a system that produces it on every model you use."
      payload={{
        market: {
          kicker: "What you get from most vendors today",
          headline: "Another chat box. Another seat licence.",
          viz: <VizWrapper />,
          vizLabel: "Diagram · prompt → model → text. No receipt.",
          items: [
            { h: "Per-seat copilots",    v: "Help individuals. Do not change how the team works." },
            { h: "Prompt libraries",     v: "Live in a Notion page. Drift the moment one person edits it." },
            { h: "Per-use-case bots",    v: "20 of them in 18 months. No common audit trail." },
          ],
        },
        operator: {
          kicker: "What we deploy inside your org",
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

// ─── 05 · How it works (factory walkthrough) ───────────────────────────────
function S05How({ n, t }: { n: number; t: number }) {
  return (
    <SH section="How it works" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-16 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            What changes the day after install
          </p>
          <h2 className="font-black" style={{ fontSize: 52, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            A request comes in. Four stations turn it into a decision your team, your auditor and your CFO can replay.
          </h2>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-6">
          <VizFactoryWalkthrough />
        </div>
        <p className="mt-4 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 12, color: SUBTLE }}>
          AACE v3.1 runtime · sits between your people and any model you choose — Claude · GPT · Gemini · on-prem
        </p>
      </div>
    </SH>
  );
}

// ─── 06 · Why now (board pressure + cheaper tokens) ────────────────────────
function S06WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why this year" n={n} total={t}
      topic="The window is narrow on both sides"
      framing="Tokens get cheaper every quarter. Board patience does not. The cost of staying in pilot mode is no longer abstract."
      payload={{
        market: {
          kicker: "What it feels like inside",
          headline: "Cheaper tokens. Same flat usage chart.",
          viz: <VizTokenDown />,
          vizLabel: "Chart · per-token price falling. Internal adoption is not.",
          items: [
            { h: "Board asks every quarter",  v: "\"Where is our AI ROI?\" — and the slide gets harder to make." },
            { h: "Vendor sprawl grows",       v: "Procurement is now your second job." },
            { h: "Champions burn out",        v: "The people doing the rollout leave. The standards leave with them." },
          ],
        },
        operator: {
          kicker: "What is actually happening to the spend",
          headline: "Tokens cheaper. Governed AI work explodes — if you have a control layer.",
          viz: <VizCrossingCurves />,
          vizLabel: "Chart · token cost ↓ × governed decisions ↑, with crossover",
          items: [
            { h: "100×",          v: "more workflows worth automating once cost drops below decision value." },
            { h: "Audit pressure", v: "EU AI Act, internal risk and sector regulators arrive in the same year." },
            { h: "Replatform risk", v: "If you do not own the standards, you will redo this rollout in 2 years on the next vendor." },
          ],
          signal: "The cheap window for setting your organisational standard closes once the incumbents lock in.",
        },
      }}
      bottomLine="The cost of waiting is not a missed pilot. It is rebuilding the same rollout from scratch in 18 months."
    />
  );
}

// ─── 07 · Objection: "We have Copilot / ChatGPT Enterprise" ────────────────
function S07Copilot({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 01" n={n} total={t}
      topic="'We already bought Copilot / ChatGPT Enterprise'"
      framing="Copilot is a seat. LIZA is the layer that makes those seats do the work the way your org actually approves of."
      payload={{
        market: {
          kicker: "What the seat licence gives you",
          headline: "A faster chat box on every desktop.",
          viz: <VizWeekendDemo />,
          vizLabel: "Code · the demo. Looks like the product.",
          items: [
            { h: "Per-user productivity", v: "Helps individuals draft faster. Does not change team output." },
            { h: "No org standard",       v: "Every person prompts their own way. Your 'method' is 200 styles." },
            { h: "No replay",             v: "Nothing the CFO, Legal or audit can point to as 'how we decided'." },
          ],
        },
        operator: {
          kicker: "What a real rollout sits on",
          headline: "What survives audit, handover and a year of org change.",
          viz: <VizIceberg />,
          vizLabel: "Diagram · iceberg · 10% chat UI, 90% governance plumbing",
          items: [
            { h: "Workflow control",       v: "Across roles, approvals, and the tools your team already uses." },
            { h: "Typed standards",        v: "Owner, expiry, version, change control. Not a Notion page." },
            { h: "Signed receipts",        v: "Survive turnover, audit and the next CIO." },
          ],
          signal: "Copilot drafts the email. LIZA decides whether that email is on-policy, who signed it, and what it changes next time.",
        },
      }}
      bottomLine="LIZA does not replace your Copilot or ChatGPT Enterprise. It is the layer that finally makes those tools defensible."
    />
  );
}

// ─── 08 · Objection: "Our IT / data team will build this" ──────────────────
function S08Build({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 02" n={n} total={t}
      topic="'IT will build this internally'"
      framing="They might. The question is whether you want your team's standards owned by an internal squad — or by a neutral layer your auditor recognises."
      payload={{
        market: {
          kicker: "What the internal build looks like",
          headline: "Two FTEs, six months, a bespoke RAG. Then maintenance.",
          viz: <VizLabExpansion />,
          vizLabel: "Diagram · stack of adjacent tools, none of them the layer",
          items: [
            { h: "Bespoke RAG over SharePoint", v: "Stale within a quarter. Owned by whoever is on call." },
            { h: "Custom prompts in code",       v: "Lives in a repo your business team cannot read or change." },
            { h: "No standards model",           v: "Every change is a code review, not a policy decision." },
          ],
        },
        operator: {
          kicker: "What you get instead",
          headline: "A neutral control layer. Your standards. Their model.",
          viz: <VizGovernanceStack />,
          vizLabel: "Diagram · governance stack · regulator ↑ control ↑ models",
          items: [
            { h: "Neutrality",     v: "Sits above any model vendor. Switch models without losing the rollout." },
            { h: "Sovereignty",    v: "Standards and receipts stay yours. Exportable. Not vendor-trapped." },
            { h: "Velocity",       v: "Your business owners edit playbooks directly. No quarter-long backlog." },
          ],
          signal: "Your IT team should own the platform. They should not also own every standard in every business function.",
        },
      }}
      bottomLine="Internal build is one quote. Total cost is the second rebuild, when the FTEs leave and the standards leave with them."
    />
  );
}

// ─── 09 · Pricing model (per governed decision) ────────────────────────────
function S09Pricing({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="How you pay for it" n={n} total={t}
      topic="The unit you measure becomes the unit you defend"
      framing="Per-seat AI is the reason your last rollout's ROI slide does not work. We price the work, not the desk."
      payload={{
        market: {
          kicker: "How most AI is priced today",
          headline: "Per seat. Pray for adoption. Renew anyway.",
          viz: <VizSeatDecay />,
          vizLabel: "Chart · per-seat revenue decay after rollout",
          items: [
            { h: "Per-seat SaaS",   v: "Cost scales with headcount. Value does not." },
            { h: "Token reseller",  v: "Bill arrives. Nobody owns the line item." },
            { h: "Bundled in suite",v: "Adoption invisible. Renewal a fight." },
          ],
        },
        operator: {
          kicker: "How LIZA priced",
          headline: "Price the accountable decision. Model cost is a pass-through.",
          viz: <VizValueBar />,
          vizLabel: "Chart · value vs. price vs. cost, per governed decision",
          items: [
            { h: "€0.40 per decision",   v: "What you pay per governed output. Visible to Finance from day one." },
            { h: "€0.04 model + infra",  v: "Pass-through. Falls every quarter." },
            { h: "€23 displaced labour", v: "The work unit you are pricing against. Your ROI slide writes itself." },
          ],
          signal: "Cheaper tokens multiply decisions. Your unit cost drops. Your ROI slide gets stronger, not weaker.",
        },
      }}
      bottomLine="You stop defending seats. You start reporting governed decisions per workflow per month."
    />
  );
}

// ─── 10 · Proof (operator framing) ─────────────────────────────────────────
function S10Proof({ n, t }: { n: number; t: number }) {
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
              <svg className="mt-3" width="100" height="22" viewBox="0 0 100 22">
                {i === 0 && [...Array(8)].map((_, k) => <rect key={k} x={k * 12} y={22 - (4 + (k * 2) % 14)} width="8" height={4 + (k * 2) % 14} fill={`hsl(${GREEN} / 0.6)`} />)}
                {i === 1 && <path d="M 0 18 Q 25 5 50 14 T 100 4" stroke={`hsl(${GREEN})`} strokeWidth="2" fill="none" />}
                {i === 2 && <path d="M 0 4 L 100 18" stroke={`hsl(${GREEN})`} strokeWidth="2" />}
                {i === 3 && <circle cx="50" cy="11" r="9" fill="none" stroke={`hsl(${GREEN})`} strokeWidth="2" />}
              </svg>
              <p className="font-mono uppercase tracking-[0.22em] mt-3" style={{ fontSize: 12, color: TEXT }}>{s.l}</p>
              <p className="mt-3" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{s.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-6" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35, maxWidth: 1500 }}>
          Same pattern lifts into your function: pick one workflow, install in 30 days, measure the decision delta, scale to the next.
        </p>
        <p className="mt-3 font-mono uppercase tracking-[0.24em]" style={{ fontSize: 11, color: SUBTLE }}>
          Source: AACE v3.1 runtime · regulated AEC deployment · 12-month rolling window · CTO-sponsored, anonymised on request.
        </p>
      </div>
    </SH>
  );
}

// ─── 11 · What compounds inside your org (moat reframed) ───────────────────
function S11Compounds({ n, t }: { n: number; t: number }) {
  return (
    <SH section="What compounds in your org" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-8">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            What you actually own after 12 months
          </p>
          <h2 className="font-black" style={{ fontSize: 52, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            The rollout's value is not the tool. It is the standards, receipts and memory you accumulate — none of which lift out on a vendor swap.
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[1400px]">
            <VizMoatLayers />
          </div>
        </div>
      </div>
    </SH>
  );
}

// ─── 12 · The 30-day install (the ask) ─────────────────────────────────────
function S12Install({ n, t }: { n: number; t: number }) {
  const steps = [
    { p: "Week 1", h: "Pick one workflow", d: "Highest-volume, highest-judgment task in your function. We scope it together in 90 minutes." },
    { p: "Week 2", h: "Install the layer", d: "AACE v3.1 deploys in your environment. Your existing model contracts stay. We wire LOCK/COMPILE/SIGN/LEARN into the workflow." },
    { p: "Week 3", h: "Turn it on, with one team", d: "Standards drafted with the actual practitioners. First signed decisions produced. Receipts visible to Legal and Finance from day one." },
    { p: "Week 4", h: "Measure & expand", d: "Decision delta, time-to-spec, audit replay all reported. You decide which workflow scales next." },
  ];
  return (
    <SH section="The 30-day install" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        <div className="mb-8 flex items-baseline gap-10">
          <h2 className="font-black" style={{ fontSize: 124, color: `hsl(${GREEN})`, letterSpacing: "-0.05em", lineHeight: 1 }}>30 days</h2>
          <div>
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>From kickoff to first signed decision</p>
            <p className="font-black mt-2" style={{ fontSize: 30, color: TEXT, letterSpacing: "-0.025em", lineHeight: 1.15, maxWidth: 1100 }}>
              One workflow. One team. One measurable delta. Then you scale.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {steps.map((s, i) => (
            <div key={s.h} className="rounded-2xl p-6 flex flex-col"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>{s.p}</p>
              <p className="font-black mt-3" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{s.h}</p>
              <p className="mt-3" style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{s.d}</p>
              <div className="mt-auto pt-4" style={{ borderTop: `1px solid ${CHROME_BORDER}` }}>
                <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: SUBTLE }}>0{i + 1} / 04</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl px-7 py-5 flex items-center gap-6"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>What you bring</span>
          <p className="font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
            One sponsor. One workflow owner. Access to one model contract. We bring the runtime, the install team and the AACE playbook library.
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
  { id: "cover",     title: "Cover",                       render: (n, t) => <S01Cover n={n} t={t} /> },
  { id: "problem",   title: "The rollout problem",         render: (n, t) => <S02Problem n={n} t={t} /> },
  { id: "why",       title: "Why rollouts stall",          render: (n, t) => <S03Why n={n} t={t} /> },
  { id: "solution",  title: "What we deploy",              render: (n, t) => <S04Solution n={n} t={t} /> },
  { id: "how",       title: "How it works",                render: (n, t) => <S05How n={n} t={t} /> },
  { id: "why-now",   title: "Why this year",               render: (n, t) => <S06WhyNow n={n} t={t} /> },
  { id: "copilot",   title: "We already have Copilot",     render: (n, t) => <S07Copilot n={n} t={t} /> },
  { id: "build",     title: "IT will build it",            render: (n, t) => <S08Build n={n} t={t} /> },
  { id: "pricing",   title: "How you pay",                 render: (n, t) => <S09Pricing n={n} t={t} /> },
  { id: "proof",     title: "Proof in production",         render: (n, t) => <S10Proof n={n} t={t} /> },
  { id: "compounds", title: "What compounds in your org",  render: (n, t) => <S11Compounds n={n} t={t} /> },
  { id: "install",   title: "30-day install",              render: (n, t) => <S12Install n={n} t={t} /> },
  { id: "close",     title: "Closing",                     render: (n, t) => <S13Close n={n} t={t} /> },
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
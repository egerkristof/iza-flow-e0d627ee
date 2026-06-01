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

// ═════════════════════════════════════════════════════════════════════════════
// SEED PITCH · INVESTOR EDITION
// For the investor who is tired of AI hype and has seen every chat wrapper.
// Airbnb-simple spine (one idea per slide, big type). The Market vs Operator
// lens is applied ONLY where the contrast does the explaining: Problem,
// Context Explosion, Solution, Why Now, Weekend objection, Lab objection,
// Business Model. Cover, How-it-works, Proof, Moat, Team, Ask and Close are
// plain — concrete numbers, no comparison gymnastics.
// ═════════════════════════════════════════════════════════════════════════════

// ─── Chrome ──────────────────────────────────────────────────────────────────
function Chrome({ section, n, total, dark = false }: { section: string; n: number; total: number; dark?: boolean }) {
  const c = dark ? "hsl(0 0% 60%)" : SUBTLE;
  return (
    <>
      <div className="absolute top-12 left-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 12, color: c }}>
        {section}
      </div>
      <div className="absolute top-12 right-20 font-mono tracking-[0.18em]" style={{ fontSize: 12, color: c }}>
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div className="absolute bottom-10 left-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 10, color: c }}>
        LIZA OS · Seed · Confidential
      </div>
      <div className="absolute bottom-10 right-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 10, color: c }}>
        For investors past the demo
      </div>
    </>
  );
}

function Shell({ section, n, total, children, dark = false }: {
  section: string; n: number; total: number; children: React.ReactNode; dark?: boolean;
}) {
  return (
    <div className="w-full h-full relative" style={{ background: dark ? "hsl(222 25% 8%)" : BG }}>
      <Chrome section={section} n={n} total={total} dark={dark} />
      {children}
    </div>
  );
}

// ─── Lens layout (reused for the 7 comparison slides only) ──────────────────
type LensItem = { h: string; v: string };
type LensPayload = {
  market:   { kicker?: string; headline: string; items: LensItem[] };
  operator: { kicker?: string; headline: string; items: LensItem[]; signal?: string };
};

function LensSlide({
  section, n, total, topic, framing, payload, bottomLine,
}: {
  section: string; n: number; total: number;
  topic: string; framing: string;
  payload: LensPayload; bottomLine?: string;
}) {
  return (
    <Shell section={section} n={n} total={total}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            {topic}
          </p>
          <h2 className="font-black" style={{ fontSize: 50, lineHeight: 1.03, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1640 }}>
            {framing}
          </h2>
        </div>

        <div className="grid grid-cols-[0.78fr_1.22fr] gap-6 flex-1 min-h-0">
          {/* MARKET LENS */}
          <div className="rounded-2xl p-7 flex flex-col"
            style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.25)` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full" style={{ width: 8, height: 8, background: `hsl(${RED})` }} />
              <p className="font-mono uppercase tracking-[0.26em]" style={{ fontSize: 11, color: `hsl(${RED})` }}>
                {payload.market.kicker || "What the market is grading"}
              </p>
            </div>
            <p className="font-black mb-6" style={{ fontSize: 28, color: MUTED, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
              {payload.market.headline}
            </p>
            <div className="flex flex-col gap-3">
              {payload.market.items.map((it, i) => (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="font-mono font-black mt-1" style={{ fontSize: 13, color: `hsl(${RED})`, minWidth: 18 }}>×</span>
                  <div>
                    <p className="font-bold" style={{ fontSize: 17, color: MUTED, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{it.h}</p>
                    <p style={{ fontSize: 15, color: SUBTLE, lineHeight: 1.35 }}>{it.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPERATOR LENS */}
          <div className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: `hsl(${GREEN})`, boxShadow: `0 0 12px hsl(${GREEN} / 0.6)` }} />
              <p className="font-mono uppercase tracking-[0.26em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
                {payload.operator.kicker || "What regulated operators are actually buying"}
              </p>
            </div>
            <p className="font-black mb-6" style={{ fontSize: 36, color: TEXT, lineHeight: 1.06, letterSpacing: "-0.025em" }}>
              {payload.operator.headline}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
              {payload.operator.items.map((it, i) => (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="font-mono font-black mt-1" style={{ fontSize: 14, color: `hsl(${GREEN})`, minWidth: 18 }}>✓</span>
                  <div>
                    <p className="font-black" style={{ fontSize: 18, color: TEXT, lineHeight: 1.18, letterSpacing: "-0.015em" }}>{it.h}</p>
                    <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35, marginTop: 2 }}>{it.v}</p>
                  </div>
                </div>
              ))}
            </div>
            {payload.operator.signal && (
              <div className="mt-5 rounded-xl px-5 py-3" style={{ background: `hsl(${GREEN} / 0.12)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
                <p className="font-mono uppercase tracking-[0.22em] mb-1" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>Signal</p>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT, lineHeight: 1.3 }}>{payload.operator.signal}</p>
              </div>
            )}
          </div>
        </div>

        {bottomLine && (
          <div className="mt-5 rounded-xl px-7 py-4 flex items-center gap-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: SUBTLE }}>Net</span>
            <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.25, letterSpacing: "-0.015em" }}>{bottomLine}</p>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDES
// ═════════════════════════════════════════════════════════════════════════════

// ─── 01 · COVER (Airbnb-simple, dark) ───────────────────────────────────────
function S01Cover({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <h1 className="font-black" style={{ fontSize: 128, lineHeight: 0.98, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          LIZA OS
        </h1>
        <p className="mt-10" style={{ fontSize: 36, lineHeight: 1.3, color: "hsl(0 0% 78%)", maxWidth: 1300 }}>
          The control layer between enterprise AI and the regulator.
        </p>
        <p className="mt-6 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          Seed · €2M · For investors past the demo
        </p>
      </div>
    </Shell>
  );
}

// ─── 02 · PROBLEM (Lens) ────────────────────────────────────────────────────
function S02Problem({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Problem" n={n} total={t}
      topic="What enterprises actually lack"
      framing="Enterprises do not lack models. They lack a way to govern what the models do."
      payload={{
        market: {
          headline: "Enterprises need a smarter assistant.",
          items: [
            { h: "Better prompts", v: "If answers drift, prompt harder." },
            { h: "Better RAG", v: "Drop more PDFs into the vector store." },
            { h: "Better model", v: "Wait for the next foundation release." },
          ],
        },
        operator: {
          headline: "Enterprises need standards, receipts and memory.",
          items: [
            { h: "No standard", v: "Outputs are not bound to the company's approved way of doing the work." },
            { h: "No receipt", v: "Nobody can reconstruct policy version, data, model, approval." },
            { h: "No memory", v: "The workflow disappears when the tab closes." },
            { h: "No accountability", v: "Regulators ask 'who decided this' and the room goes quiet." },
          ],
          signal: "A proposal, risk memo or clinical summary leaves the model. The company cannot prove what shaped it.",
        },
      }}
      bottomLine="The AI readiness problem is operational, not magical. A better chatbot does not fix it."
    />
  );
}

// ─── 03 · CONTEXT EXPLOSION (Lens) ──────────────────────────────────────────
function S03Context({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why the gap exists" n={n} total={t}
      topic="The context explosion"
      framing="Today's context fits in a chat. Tomorrow's spans every employee, workflow, policy and receipt in the company."
      payload={{
        market: {
          headline: "One user. One chat. Ten thousand tokens.",
          items: [
            { h: "One workflow at a time", v: "Whatever fits in the prompt window." },
            { h: "No receipts", v: "No record of which version of which policy shaped the output." },
            { h: "No compounding", v: "The tab closes. The organization learns nothing." },
          ],
        },
        operator: {
          headline: "Every employee × every workflow × every policy × every receipt.",
          items: [
            { h: "Cannot stay siloed", v: "Context spans roles, tools, regions, regulators." },
            { h: "Must be efficient", v: "Inefficient context assembly multiplies the token and latency bill." },
            { h: "Must be auditable", v: "Replayable on demand. Standard, data, approval, model." },
            { h: "Must compound", v: "Receipts become the next context. The org gets sharper." },
          ],
          signal: "Billions of governed tokens per enterprise per year, by 2028. The context layer becomes infrastructure.",
        },
      }}
      bottomLine="A chat UI is a feature of the small reality. The control layer is the only thing that survives the big one."
    />
  );
}

// ─── 04 · SOLUTION (Lens) ───────────────────────────────────────────────────
function S04Solution({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Solution" n={n} total={t}
      topic="The unit we sell"
      framing="The market evaluates the text box. We sell the governed decision underneath it."
      payload={{
        market: {
          headline: "Another agent. Another wrapper.",
          items: [
            { h: "Prompt orchestration", v: "A nicer DAG over the same model call." },
            { h: "Tool use", v: "The model can call APIs. So can everyone else." },
            { h: "Helpful output", v: "Hard to verify. Easy to ship." },
          ],
        },
        operator: {
          headline: "Lock the playbook. Compile the standards. Sign the receipt. Learn.",
          items: [
            { h: "LOCK",    v: "Bind the task to the company's versioned way of doing the work." },
            { h: "COMPILE", v: "Load the policies, decision rules and approved data for that single call." },
            { h: "SIGN",    v: "Issue a replayable receipt: standard, evidence, model, approver." },
            { h: "LEARN",   v: "The receipt feeds back into the standard. The next call is better governed." },
          ],
          signal: "Model-agnostic by design. Claude, GPT, Gemini and on-prem all run inside the same control surface.",
        },
      }}
      bottomLine="One accountable work unit. The unit the customer actually pays for."
    />
  );
}

// ─── 05 · HOW IT WORKS (Airbnb-simple, 4 steps) ─────────────────────────────
function S05How({ n, t }: { n: number; t: number }) {
  const steps = [
    { k: "01", v: "LOCK",    h: "Bind the task to a playbook.",        d: "The company's approved method for this kind of work — typed, versioned, owned." },
    { k: "02", v: "COMPILE", h: "Assemble the context for this call.", d: "Policies, decision rules, approved data and prior receipts, loaded fresh." },
    { k: "03", v: "SIGN",    h: "Emit a replayable receipt.",          d: "Standard version, evidence, model, approver. Auditable on demand." },
    { k: "04", v: "LEARN",   h: "Feed the receipt back.",              d: "Drift, gaps and corrections sharpen the next call. The corpus is the asset." },
  ];
  return (
    <Shell section="How it works" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-8">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            The loop, once
          </p>
          <h2 className="font-black" style={{ fontSize: 64, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Four steps that turn a model call into a governed decision.
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {steps.map((s) => (
            <div key={s.v} className="rounded-2xl p-6 flex flex-col" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono" style={{ fontSize: 13, color: SUBTLE, letterSpacing: "0.2em" }}>{s.k}</p>
              <p className="font-black mt-3" style={{ fontSize: 36, color: `hsl(${GREEN})`, letterSpacing: "-0.02em" }}>{s.v}</p>
              <p className="font-black mt-4" style={{ fontSize: 22, color: TEXT, lineHeight: 1.18, letterSpacing: "-0.015em" }}>{s.h}</p>
              <p className="mt-3" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 13, color: SUBTLE }}>
          AACE v3.1 · live in production · model-agnostic
        </p>
      </div>
    </Shell>
  );
}

// ─── 06 · WHY NOW (Lens) ────────────────────────────────────────────────────
function S06WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why now" n={n} total={t}
      topic="Where the spend moves"
      framing="Cheaper tokens are not bad news. They are the trigger for the control layer to exist."
      payload={{
        market: {
          headline: "Tokens get cheaper. Margins get worse.",
          items: [
            { h: "Race to the bottom", v: "Whoever wraps the cheapest model wins." },
            { h: "Commodity AI", v: "The interesting work moves into the labs." },
            { h: "Seat fatigue", v: "Enterprises stop buying generic copilots." },
          ],
        },
        operator: {
          headline: "Tokens get cheaper. Governed AI work explodes.",
          items: [
            { h: "100×",          v: "more AI tasks per employee once cost drops below decision value." },
            { h: "Policy lag",    v: "Every new task surfaces a missing standard. Demand for the layer compounds." },
            { h: "Audit pressure", v: "EU AI Act, sectoral regulators, internal risk. Replayability is non-optional." },
            { h: "Pass-through",  v: "Model cost becomes a line item inside a higher-margin governed-work bill." },
          ],
          signal: "Spend moves from raw inference to the control surface around every important output.",
        },
      }}
      bottomLine="Foundation models commoditise intelligence. They make the governance layer unavoidable."
    />
  );
}

// ─── 07 · WEEKEND OBJECTION (Lens) ──────────────────────────────────────────
function S07Weekend({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 01" n={n} total={t}
      topic="'Anyone builds this in a weekend'"
      framing="A weekend project automates text. It does not certify work."
      payload={{
        market: {
          kicker: "The weekend demo",
          headline: "Model API plus a chat UI is the product.",
          items: [
            { h: "Clever system prompt", v: "Looks like a method. Is one paragraph." },
            { h: "PDFs in a vector store", v: "Search dressed up as governance." },
            { h: "Helpful answer", v: "No receipt. No approval. No audit." },
            { h: "Manual maintenance", v: "Drifts the moment the team rotates." },
          ],
        },
        operator: {
          kicker: "The production system",
          headline: "A product that survives audit, handover and a year of org change.",
          items: [
            { h: "Workflow control", v: "Across roles, approvals and tools, not one chat." },
            { h: "Typed standards", v: "Ownership, expiry, versioning, change control." },
            { h: "Playbook compilation", v: "Per call, per task, per regulator." },
            { h: "Signed receipts", v: "That survive audit, handover and turnover." },
          ],
          signal: "The visible demo is easy. The production burden is what the customer is paying you to absorb.",
        },
      }}
      bottomLine="If a weekend was enough, the company would have already shipped it. The institution is what blocks the weekend project."
    />
  );
}

// ─── 08 · LAB OBJECTION (Lens) ──────────────────────────────────────────────
function S08Lab({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 02" n={n} total={t}
      topic="'Anthropic / OpenAI absorbs this'"
      framing="Foundation labs are suppliers. They cannot become the customer's auditor."
      payload={{
        market: {
          headline: "The lab ships this feature next quarter.",
          items: [
            { h: "Memory in Claude", v: "Looks adjacent. Solves a different problem." },
            { h: "Custom GPTs", v: "Per-user knobs, not org-wide governance." },
            { h: "Enterprise tier", v: "Same model, bigger contract, no control surface." },
          ],
        },
        operator: {
          headline: "No regulated buyer accepts the vendor as the auditor of the vendor.",
          items: [
            { h: "Business model", v: "Labs sell token volume. We govern decisions on top of any token supplier." },
            { h: "Neutrality", v: "Enterprises run several models. The control layer cannot be owned by one of them." },
            { h: "Sovereignty", v: "Standards, decision rules and receipts are operational IP the buyer must own." },
            { h: "Accountability", v: "The model generates. It cannot certify itself for every department and regulator." },
          ],
          signal: "Claude can be inside the workflow. It cannot certify the workflow for every other model.",
        },
      }}
      bottomLine="Whoever owns the governance position is the one the regulator calls. That role is not for sale to the model vendor."
    />
  );
}

// ─── 09 · BUSINESS MODEL (Lens) ─────────────────────────────────────────────
function S09Model({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Business model" n={n} total={t}
      topic="What we charge for"
      framing="We do not sell tokens or seats. We sell governed decisions."
      payload={{
        market: {
          headline: "Mark up tokens. Charge per seat. Pray for retention.",
          items: [
            { h: "Per-seat SaaS", v: "Decays the moment the org questions adoption." },
            { h: "Token reseller", v: "Margin compresses every quarter." },
            { h: "Usage-only", v: "Invisible until the bill arrives, hated when it does." },
          ],
        },
        operator: {
          headline: "Price the accountable work unit. Model cost is a pass-through.",
          items: [
            { h: "€0.40",         v: "average price per governed decision (proposal, spec, risk memo, summary)." },
            { h: "€0.04",         v: "model + infra cost at current mix." },
            { h: "95%",           v: "platform gross margin target on governed work." },
            { h: "€23",           v: "manual labor displaced per governed decision — the value anchor." },
          ],
          signal: "The cheaper the underlying model gets, the more profitable the layer above becomes.",
        },
      }}
      bottomLine="Value is anchored to displaced labour, not marked-up tokens. Margin expands as tokens fall."
    />
  );
}

// ─── 10 · PROOF (Airbnb-simple, numbers) ────────────────────────────────────
function S10Proof({ n, t }: { n: number; t: number }) {
  const stats = [
    { v: "127",       l: "standards encoded",      s: "Typed playbooks, decision rules and policies in the customer's control layer." },
    { v: "3,400 /mo", l: "signed decisions",       s: "Replayable on audit. Every output bound to a standard, model and approver." },
    { v: "62%",       l: "drop in time-to-spec",   s: "On the workflows that moved first. Measured against the pre-LIZA baseline." },
    { v: "0",         l: "audit failures",         s: "Across the regulated AEC deployment to date." },
  ];
  return (
    <Shell section="Proof" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-10">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            What is already live
          </p>
          <h2 className="font-black" style={{ fontSize: 64, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            One regulated vertical. CTO-sponsored. In production.
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl p-7 flex flex-col" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-black" style={{ fontSize: 68, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.v}</p>
              <p className="font-mono uppercase tracking-[0.22em] mt-4" style={{ fontSize: 13, color: TEXT }}>{s.l}</p>
              <p className="mt-4" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{s.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-8" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35, maxWidth: 1500 }}>
          The wedge is live, not theoretical. The same playbook lifts into pharma, financial services and life sciences next.
        </p>
      </div>
    </Shell>
  );
}

// ─── 11 · MOAT (Airbnb-simple, 4 cards) ─────────────────────────────────────
function S11Moat({ n, t }: { n: number; t: number }) {
  const moats = [
    { h: "Standards corpus",  d: "Typed playbooks, procedures and decision rules, per vertical and per customer. Years of operator judgment, encoded." },
    { h: "Receipt graph",     d: "Proprietary trail of real decisions, evidence, approvals and drift. The customer's accountable memory." },
    { h: "Workflow position", d: "The layer where work is requested, approved, replayed and improved. The system of record for AI work." },
    { h: "Trust pattern",     d: "Neutral control surface. The buyer keeps model optionality and governance ownership. A lab cannot offer this." },
  ];
  return (
    <Shell section="Moat" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-10">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            What cannot be cloned
          </p>
          <h2 className="font-black" style={{ fontSize: 64, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            The moat is not code. It is accumulated governance the customer cannot get back from a vendor swap.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-5 flex-1">
          {moats.map((m, i) => (
            <div key={m.h} className="rounded-2xl p-8 flex flex-col" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono" style={{ fontSize: 12, color: SUBTLE, letterSpacing: "0.22em" }}>0{i + 1}</p>
              <p className="font-black mt-3" style={{ fontSize: 32, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{m.h}</p>
              <p className="mt-4" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ─── 12 · TEAM (Airbnb-simple) ──────────────────────────────────────────────
function S12Team({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="Team" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-6" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
          Why this team
        </p>
        <h2 className="font-black mb-12" style={{ fontSize: 76, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1500 }}>
          15+ years putting data and AI architectures into production inside regulated enterprises.
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { h: "Built it",      d: "Productionised data and AI platforms across pharma, finance and industrial operators. Not a research lab, not a deck." },
            { h: "Sold it",       d: "Closed the first CTO-sponsored regulated deployment with the founding team — same operators we sell to." },
            { h: "Audited it",    d: "Walked auditors, risk and procurement through receipts. The control surface was designed from those rooms." },
          ].map((p) => (
            <div key={p.h} className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-black" style={{ fontSize: 28, color: TEXT, letterSpacing: "-0.02em" }}>{p.h}</p>
              <p className="mt-3" style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ─── 13 · ASK €2M (Airbnb-simple) ───────────────────────────────────────────
function S13Ask({ n, t }: { n: number; t: number }) {
  const buckets = [
    { p: "50%", h: "Vertical corpus",        d: "Deepen AEC. Package pharma and financial standards libraries on the same control surface." },
    { p: "30%", h: "Repeatable install",     d: "Self-serve deploy, metering, integrations, admin controls. Day-30 production, not Day-90 pilot." },
    { p: "20%", h: "Channel + audit kit",    d: "Partner enablement and regulated-buyer material so the second customer does not need the founders in the room." },
  ];
  return (
    <Shell section="The ask" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-10 flex items-baseline gap-10">
          <h2 className="font-black" style={{ fontSize: 132, color: `hsl(${GREEN})`, letterSpacing: "-0.05em", lineHeight: 1 }}>€2M</h2>
          <div>
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>Seed round</p>
            <p className="font-black mt-2" style={{ fontSize: 36, color: TEXT, letterSpacing: "-0.025em", lineHeight: 1.1, maxWidth: 1100 }}>
              Turn one working factory into a repeatable company.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 flex-1">
          {buckets.map((b) => (
            <div key={b.h} className="rounded-2xl p-7 flex flex-col" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-black" style={{ fontSize: 56, color: TEXT, letterSpacing: "-0.03em", lineHeight: 1 }}>{b.p}</p>
              <p className="font-black mt-4" style={{ fontSize: 24, color: TEXT, letterSpacing: "-0.018em" }}>{b.h}</p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>{b.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl px-7 py-5 flex items-center gap-6" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Series A milestone</span>
          <p className="font-bold" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35 }}>
            Three verticals live · Day-30 deploy · metered governed decisions · governance spend grows while model cost falls.
          </p>
        </div>
      </div>
    </Shell>
  );
}

// ─── 14 · CLOSE (Airbnb-simple, dark) ───────────────────────────────────────
function S14Close({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.32em] mb-8" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          One statement
        </p>
        <h2 className="font-black" style={{ fontSize: 96, lineHeight: 1.02, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em", maxWidth: 1600 }}>
          Models commoditise.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>The control layer compounds.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 26, color: "hsl(0 0% 78%)", maxWidth: 1280, lineHeight: 1.4 }}>
          If regulated enterprises use more AI, they will need a neutral system that governs the work. We would rather raise from someone who saw it before the market priced it.
        </p>
        <p className="mt-14 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: "hsl(0 0% 62%)" }}>
          founder@lizaos.ai
        </p>
      </div>
    </Shell>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const RAW_SLIDES: { id: string; title: string; render: (n: number, t: number) => React.ReactNode }[] = [
  { id: "cover",    title: "Cover",                render: (n, t) => <S01Cover n={n} t={t} /> },
  { id: "problem",  title: "Problem · lens",       render: (n, t) => <S02Problem n={n} t={t} /> },
  { id: "context",  title: "Context explosion",    render: (n, t) => <S03Context n={n} t={t} /> },
  { id: "solution", title: "Solution · lens",      render: (n, t) => <S04Solution n={n} t={t} /> },
  { id: "how",      title: "How it works",         render: (n, t) => <S05How n={n} t={t} /> },
  { id: "why-now",  title: "Why now · lens",       render: (n, t) => <S06WhyNow n={n} t={t} /> },
  { id: "weekend",  title: "Weekend objection",    render: (n, t) => <S07Weekend n={n} t={t} /> },
  { id: "labs",     title: "Lab objection",        render: (n, t) => <S08Lab n={n} t={t} /> },
  { id: "model",    title: "Business model",       render: (n, t) => <S09Model n={n} t={t} /> },
  { id: "proof",    title: "Proof",                render: (n, t) => <S10Proof n={n} t={t} /> },
  { id: "moat",     title: "Moat",                 render: (n, t) => <S11Moat n={n} t={t} /> },
  { id: "team",     title: "Team",                 render: (n, t) => <S12Team n={n} t={t} /> },
  { id: "ask",      title: "Ask · €2M",            render: (n, t) => <S13Ask n={n} t={t} /> },
  { id: "close",    title: "Closing",              render: (n, t) => <S14Close n={n} t={t} /> },
];

const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      {s.render(i + 1, RAW_SLIDES.length)}
    </SlideIndexProvider>
  ),
}));

// ─── Deck shell (mirrors lens edition) ──────────────────────────────────────
export default function SeedPitchDeckInvestor() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Investor" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Seed Pitch · Investor Edition</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            Airbnb-simple spine · selective lens · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Confidential · Seed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Investor" slideCount={SLIDES.length} variant="desktop" />
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
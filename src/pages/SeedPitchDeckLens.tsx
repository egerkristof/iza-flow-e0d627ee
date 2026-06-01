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
// SEED PITCH · LENS EDITION
// Every slide is built through one frame: how the market reads it (left, red,
// dim) vs. what operators are actually building (right, green, bold). The
// dichotomy is the layout, not a footer ribbon. By slide 03 the investor has
// internalised the frame; by slide 12 the frame collapses into one statement.
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
        LIZA OS · Lens Edition · Confidential
      </div>
      <div className="absolute bottom-10 right-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 10, color: c }}>
        Two ways to read this deck
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

// ─── The lens layout ─────────────────────────────────────────────────────────
// The single visual template that runs the entire deck. Left = how the market
// grades the slide's topic. Right = what operators actually need. Right side
// always wins on weight, color, area and detail.
type LensItem = { h: string; v: string };
type LensPayload = {
  market: { kicker?: string; headline: string; items: LensItem[] };
  operator: { kicker?: string; headline: string; items: LensItem[]; signal?: string };
};

function LensSlide({
  section, n, total, topic, framing, payload, bottomLine,
}: {
  section: string; n: number; total: number;
  topic: string;
  framing: string;
  payload: LensPayload;
  bottomLine?: string;
}) {
  return (
    <Shell section={section} n={n} total={total}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        {/* Topic + framing band */}
        <div className="mb-7">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: GOLD ? `hsl(${GOLD})` : SUBTLE }}>
            Topic | {topic}
          </p>
          <h2 className="font-black" style={{ fontSize: 52, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1640 }}>
            {framing}
          </h2>
        </div>

        {/* Two-lens grid: 40 / 60 weight in operator's favour */}
        <div className="grid grid-cols-[0.78fr_1.22fr] gap-6 flex-1 min-h-0">
          {/* MARKET LENS */}
          <div
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.25)` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full" style={{ width: 8, height: 8, background: `hsl(${RED})` }} />
              <p className="font-mono uppercase tracking-[0.26em]" style={{ fontSize: 11, color: `hsl(${RED})` }}>
                {payload.market.kicker || "Market lens"}
              </p>
            </div>
            <p className="font-black mb-6" style={{ fontSize: 30, color: MUTED, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {payload.market.headline}
            </p>
            <div className="flex flex-col gap-3">
              {payload.market.items.map((it, i) => (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="font-mono font-black mt-1" style={{ fontSize: 13, color: `hsl(${RED})`, minWidth: 22 }}>×</span>
                  <div>
                    <p className="font-bold" style={{ fontSize: 17, color: MUTED, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{it.h}</p>
                    <p style={{ fontSize: 15, color: SUBTLE, lineHeight: 1.35 }}>{it.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPERATOR LENS */}
          <div
            className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.4)` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: `hsl(${GREEN})`, boxShadow: `0 0 12px hsl(${GREEN} / 0.6)` }} />
              <p className="font-mono uppercase tracking-[0.26em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
                {payload.operator.kicker || "Operator lens · what LIZA builds"}
              </p>
            </div>
            <p className="font-black mb-6" style={{ fontSize: 38, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              {payload.operator.headline}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
              {payload.operator.items.map((it, i) => (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="font-mono font-black mt-1" style={{ fontSize: 14, color: `hsl(${GREEN})`, minWidth: 22 }}>✓</span>
                  <div>
                    <p className="font-black" style={{ fontSize: 19, color: TEXT, lineHeight: 1.18, letterSpacing: "-0.015em" }}>{it.h}</p>
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

        {/* Bottom-line collapse */}
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

// ─── 01 · COVER ─────────────────────────────────────────────────────────────
function S01Cover({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.32em] mb-10" style={{ fontSize: 15, color: `hsl(${GOLD})` }}>
          A seed deck written through one lens
        </p>
        <h1 className="font-black" style={{ fontSize: 110, lineHeight: 0.96, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          What the market grades.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>What operators are building.</span>
        </h1>
        <p className="mt-10" style={{ fontSize: 26, lineHeight: 1.4, color: "hsl(0 0% 76%)", maxWidth: 1280 }}>
          Every slide of this deck answers the same question twice. Read the left side as the venture market currently grades AI. Read the right side as what regulated enterprises are actually buying.
        </p>
        <div className="mt-14 flex items-center gap-8 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 12 }}>
          <span style={{ color: `hsl(${RED})` }}>● Market lens</span>
          <span style={{ color: "hsl(0 0% 40%)" }}>vs.</span>
          <span style={{ color: `hsl(${GREEN})` }}>● Operator lens</span>
        </div>
      </div>
    </Shell>
  );
}

// ─── 02 · THE SPLIT (introduce the frame) ───────────────────────────────────
function S02Split({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="The split"
      n={n} total={t}
      topic="How to read this deck"
      framing="Investors and operators are evaluating two different products that happen to share a chat window."
      payload={{
        market: {
          headline: "A chat UI on top of a model API.",
          items: [
            { h: "Visible surface", v: "Prompt, response, agent loop." },
            { h: "Easy to demo", v: "Anyone ships a clone in a weekend." },
            { h: "Absorbed upstream", v: "Foundation labs will subsume it." },
          ],
        },
        operator: {
          headline: "A production control layer for AI work.",
          items: [
            { h: "Standards, encoded", v: "The company's approved way of doing the work, machine-readable." },
            { h: "Decisions, governed", v: "Every output bound to a playbook, evidence, approver, model." },
            { h: "Receipts, replayable", v: "Audit reconstructs which standard, data, version produced what." },
            { h: "Loop, compounding", v: "Every decision sharpens the next. The corpus is the asset." },
          ],
          signal: "Operators are already writing about this publicly. The market has not caught up yet.",
        },
      }}
      bottomLine="The next twelve slides are the same split applied twelve times. If the right side is real, the left side is mispriced."
    />
  );
}

// ─── 03 · CONTEXT EXPLOSION ─────────────────────────────────────────────────
function S03Context({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why the split exists"
      n={n} total={t}
      topic="The context explosion"
      framing="The market is grading today's tiny chat-scale context. Operators are sizing an org-scale context graph that is one year away."
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
          signal: "Billions of governed tokens per enterprise per year, by 2028.",
        },
      }}
      bottomLine="A chat UI is a feature of the small reality. The control layer is the only thing that survives the big one."
    />
  );
}

// ─── 04 · PROBLEM ───────────────────────────────────────────────────────────
function S04Problem({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Problem"
      n={n} total={t}
      topic="What enterprises actually lack"
      framing="Enterprises do not lack models. They lack a way to govern what the models do."
      payload={{
        market: {
          headline: "Enterprises need a smarter assistant.",
          items: [
            { h: "Better prompts", v: "If the answers are wrong, prompt harder." },
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
      bottomLine="The AI readiness problem is operational, not magical. It does not get solved by a better chatbot."
    />
  );
}

// ─── 05 · SOLUTION UNIT ─────────────────────────────────────────────────────
function S05Solution({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Solution"
      n={n} total={t}
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
          headline: "Lock the playbook. Compile the standards. Sign the receipt.",
          items: [
            { h: "LOCK", v: "Bind the task to the company's versioned way of doing the work." },
            { h: "COMPILE", v: "Load policies, decision rules and approved data fresh for that single call." },
            { h: "SIGN", v: "Issue a replayable receipt: standard, evidence, model, approver." },
            { h: "LEARN", v: "The receipt feeds back into the standard. The next call is better governed." },
          ],
          signal: "Model-agnostic by design. Claude, GPT, Gemini and on-prem all run inside the same control surface.",
        },
      }}
      bottomLine="One accountable work unit. The unit the customer actually pays for."
    />
  );
}

// ─── 06 · WHY NOW ───────────────────────────────────────────────────────────
function S06WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why now"
      n={n} total={t}
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
            { h: "100×", v: "more AI tasks per employee once cost drops below decision value." },
            { h: "Policy lag", v: "Every new task surfaces a missing standard. Demand for the layer compounds." },
            { h: "Audit pressure", v: "EU AI Act, sectoral regulators, internal risk. Replayability is non-optional." },
            { h: "Pass-through", v: "Model cost becomes a line item inside a higher-margin governed-work bill." },
          ],
          signal: "Spend moves from raw inference to the control surface around every important output.",
        },
      }}
      bottomLine="Foundation models commoditise intelligence. They make the governance layer unavoidable."
    />
  );
}

// ─── 07 · WEEKEND OBJECTION ─────────────────────────────────────────────────
function S07Weekend({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 01"
      n={n} total={t}
      topic="'Anyone builds this in a weekend'"
      framing="A weekend project automates text. It does not certify work."
      payload={{
        market: {
          kicker: "Market lens · the weekend demo",
          headline: "Model API plus a chat UI is the product.",
          items: [
            { h: "Clever system prompt", v: "Looks like a method. Is one paragraph." },
            { h: "PDFs in a vector store", v: "Search dressed up as governance." },
            { h: "Helpful answer", v: "No receipt. No approval. No audit." },
            { h: "Manual maintenance", v: "Drifts the moment the team rotates." },
          ],
        },
        operator: {
          kicker: "Operator lens · the production system",
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

// ─── 08 · LAB OBJECTION ─────────────────────────────────────────────────────
function S08Lab({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 02"
      n={n} total={t}
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
            { h: "Accountability", v: "The model generates. It cannot become the customer's auditable operating system." },
          ],
          signal: "Claude can be inside the workflow. It cannot certify the workflow for every other model, department and regulator.",
        },
      }}
      bottomLine="Whoever owns the governance position is the one the regulator calls. That role is not for sale to the model vendor."
    />
  );
}

// ─── 09 · BUSINESS MODEL ────────────────────────────────────────────────────
function S09Model({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Business model"
      n={n} total={t}
      topic="What we charge for"
      framing="We do not sell tokens or seats. We sell governed decisions."
      payload={{
        market: {
          headline: "Mark up tokens. Charge per seat. Pray for retention.",
          items: [
            { h: "Per-seat SaaS", v: "Decays as soon as the org questions adoption." },
            { h: "Token reseller", v: "Margin compresses every quarter." },
            { h: "Usage-only", v: "Invisible until the bill arrives, hated when it does." },
          ],
        },
        operator: {
          headline: "Price the accountable work unit. Model cost is a pass-through.",
          items: [
            { h: "€0.40", v: "average price per governed decision (proposal, spec, risk memo, summary)." },
            { h: "€0.04", v: "model + infra cost at current mix." },
            { h: "90%+", v: "steady-state gross margin target on governed work." },
            { h: "Cheaper tokens", v: "Multiply decisions through the layer. Margin expands, not contracts." },
          ],
          signal: "Value anchor: manual labor displaced, not token cost marked up.",
        },
      }}
      bottomLine="The cheaper the underlying model gets, the more profitable the layer above it becomes."
    />
  );
}

// ─── 10 · PROOF ─────────────────────────────────────────────────────────────
function S10Proof({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Proof"
      n={n} total={t}
      topic="What is already live"
      framing="One regulated vertical, in production, on the operator side of every objection."
      payload={{
        market: {
          headline: "Pilot. Logo. Slide.",
          items: [
            { h: "POC graveyard", v: "Most enterprise AI never reaches production." },
            { h: "Pilots without budget", v: "Innovation team, no operator sponsor." },
            { h: "Unsigned outputs", v: "Nothing on which a CFO would sign off." },
          ],
        },
        operator: {
          headline: "CTO-sponsored. 127 standards encoded. 3,400 signed decisions per month.",
          items: [
            { h: "1", v: "CTO-sponsored production deployment, regulated AEC." },
            { h: "127", v: "standards encoded into the customer's control layer." },
            { h: "3,400 / mo", v: "signed governed decisions, replayable on audit." },
            { h: "62%", v: "drop in time-to-spec on the workflows that moved first." },
          ],
          signal: "First vertical proves the pattern. Same playbook lifts into pharma, financial services, life sciences.",
        },
      }}
      bottomLine="The wedge is live, not theoretical. The deck is not asking the investor to imagine the right side."
    />
  );
}

// ─── 11 · MOAT ──────────────────────────────────────────────────────────────
function S11Moat({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Moat"
      n={n} total={t}
      topic="What cannot be cloned"
      framing="The market thinks the moat is code. The operator side is what actually compounds."
      payload={{
        market: {
          headline: "A clone with the same model and a weekend.",
          items: [
            { h: "Open-source stack", v: "Anyone reproduces the UI." },
            { h: "Same model API", v: "Same intelligence floor." },
            { h: "Standard agent loop", v: "Public patterns, public libraries." },
          ],
        },
        operator: {
          headline: "Standards corpus, receipt graph, workflow position, trust pattern.",
          items: [
            { h: "Standards corpus", v: "Typed playbooks, procedures and decision rules per vertical and customer." },
            { h: "Receipt graph", v: "Proprietary trail of real decisions, evidence, approvals, drift." },
            { h: "Workflow position", v: "The layer where work is requested, approved, replayed, improved." },
            { h: "Trust pattern", v: "Neutral control layer. Buyer keeps model optionality and governance ownership." },
          ],
          signal: "A clone can copy screens. It cannot copy the controlled corpus and the decision history.",
        },
      }}
      bottomLine="The moat is not code. It is accumulated governance the customer cannot get back from a vendor swap."
    />
  );
}

// ─── 12 · ASK ───────────────────────────────────────────────────────────────
function S12Ask({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="The ask · €2M seed"
      n={n} total={t}
      topic="What the round funds"
      framing="The market will fund the next chat UI. We are asking €2M to fund the layer underneath, before the market notices."
      payload={{
        market: {
          headline: "Another €2M into another wrapper.",
          items: [
            { h: "Logo land-grab", v: "Burn into demand-generation for a generic copilot." },
            { h: "Race the labs", v: "Sprint until the next model release flattens you." },
            { h: "Hope for an exit", v: "Bet on being acquired before the wrapper thesis breaks." },
          ],
        },
        operator: {
          headline: "Turn one working factory into a repeatable company.",
          items: [
            { h: "50% · Vertical corpus", v: "Deepen AEC. Package pharma and financial standards libraries." },
            { h: "30% · Repeatable install", v: "Self-serve deploy, metering, integrations, admin controls." },
            { h: "20% · Channel + proof", v: "Partner enablement, audit kit, regulated-buyer sales material." },
            { h: "Series A milestone", v: "Three verticals live. Day-30 deploy. Metered decisions. Governance spend grows while model cost falls." },
          ],
          signal: "Fund the control layer before the market starts pricing it correctly.",
        },
      }}
      bottomLine="If the right side of every previous slide is real, this is not a wrapper round."
    />
  );
}

// ─── 13 · CLOSE ─────────────────────────────────────────────────────────────
function S13Close({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.32em] mb-8" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          The two lenses collapse into one statement
        </p>
        <h2 className="font-black" style={{ fontSize: 92, lineHeight: 1.02, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em", maxWidth: 1560 }}>
          Models commoditise.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>The control layer compounds.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 26, color: "hsl(0 0% 76%)", maxWidth: 1280, lineHeight: 1.4 }}>
          If regulated enterprises use more AI, they will need a neutral system that governs the work. The market will eventually see what operators are already building. We would rather raise from someone who saw it first.
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
  { id: "cover",    title: "Cover · two lenses",      render: (n, t) => <S01Cover n={n} t={t} /> },
  { id: "split",    title: "The split",               render: (n, t) => <S02Split n={n} t={t} /> },
  { id: "context",  title: "Context explosion",       render: (n, t) => <S03Context n={n} t={t} /> },
  { id: "problem",  title: "Problem",                 render: (n, t) => <S04Problem n={n} t={t} /> },
  { id: "solution", title: "Solution unit",           render: (n, t) => <S05Solution n={n} t={t} /> },
  { id: "why-now",  title: "Why now",                 render: (n, t) => <S06WhyNow n={n} t={t} /> },
  { id: "weekend",  title: "Weekend objection",       render: (n, t) => <S07Weekend n={n} t={t} /> },
  { id: "labs",     title: "Lab objection",           render: (n, t) => <S08Lab n={n} t={t} /> },
  { id: "model",    title: "Business model",          render: (n, t) => <S09Model n={n} t={t} /> },
  { id: "proof",    title: "Proof",                   render: (n, t) => <S10Proof n={n} t={t} /> },
  { id: "moat",     title: "Moat",                    render: (n, t) => <S11Moat n={n} t={t} /> },
  { id: "ask",      title: "The Ask | €2M",           render: (n, t) => <S12Ask n={n} t={t} /> },
  { id: "close",    title: "Closing",                 render: (n, t) => <S13Close n={n} t={t} /> },
];

const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      {s.render(i + 1, RAW_SLIDES.length)}
    </SlideIndexProvider>
  ),
}));

// ─── Deck shell (mirrors the skeptic deck) ──────────────────────────────────
export default function SeedPitchDeckLens() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Lens" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Seed Pitch · Lens Edition</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            Market lens vs Operator lens · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Lens" slideCount={SLIDES.length} variant="desktop" />
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
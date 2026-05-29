import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideIndexProvider,
  BG, TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  ACCENT, GREEN, GOLD, RED,
} from "@/pages/TechDDDeck";

// ═════════════════════════════════════════════════════════════════════════════
// SEED PITCH DECK · SKEPTIC EDITION
// Built for the sharp investor who walks in with two objections:
//   (1) "Anyone can build this in two minutes."
//   (2) "Claude / Anthropic will do this anyway."
// The whole deck answers those two questions and nothing else.
// ═════════════════════════════════════════════════════════════════════════════

function Chrome({ section, n, total }: { section: string; n: number; total: number }) {
  return (
    <>
      <div className="absolute top-14 left-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 13, color: SUBTLE }}>
        {section}
      </div>
      <div className="absolute top-14 right-20 font-mono tracking-[0.18em]" style={{ fontSize: 13, color: SUBTLE }}>
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div className="absolute bottom-12 left-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 11, color: SUBTLE }}>
        LIZA OS · Skeptic Edition · Confidential
      </div>
    </>
  );
}

function Slide({ section, n, total, children, dark = false }: {
  section: string; n: number; total: number; children: React.ReactNode; dark?: boolean;
}) {
  return (
    <div className="w-full h-full relative" style={{ background: dark ? "hsl(222 25% 8%)" : BG }}>
      <Chrome section={section} n={n} total={total} />
      {children}
    </div>
  );
}

// ─── 01 · COVER ──────────────────────────────────────────────────────────────
function S01Cover({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-10" style={{ fontSize: 16, color: `hsl(${GOLD})` }}>
          For the investor who already knows the easy objections
        </p>
        <h1 className="font-black" style={{ fontSize: 116, lineHeight: 0.98, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          Why this isn't a<br/>weekend project,<br/>and why Anthropic<br/>won't build it.
        </h1>
      </div>
    </Slide>
  );
}

// ─── 02 · THE TWO OBJECTIONS ────────────────────────────────────────────────
function S02Objections({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="The two objections" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-12" style={{ fontSize: 64, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Sharp investors raise <span style={{ color: `hsl(${RED})` }}>two objections</span> before slide three.
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-2xl p-8" style={{ background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 13, color: `hsl(${RED})` }}>Objection 01</p>
            <p className="font-black mb-5" style={{ fontSize: 38, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              "Anyone builds this in a weekend."
            </p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>
              Prompts, RAG, a vector store, a system prompt. Looks like commodity plumbing.
            </p>
            <p className="mt-6 font-mono uppercase tracking-[0.2em]" style={{ fontSize: 12, color: SUBTLE }}>
              Answered on slide 03 &amp; 04
            </p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 13, color: `hsl(${RED})` }}>Objection 02</p>
            <p className="font-black mb-5" style={{ fontSize: 38, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              "Anthropic ships this next quarter."
            </p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45 }}>
              Claude, OpenAI, Gemini will do organizational readiness as a feature. Game over.
            </p>
            <p className="mt-6 font-mono uppercase tracking-[0.2em]" style={{ fontSize: 12, color: SUBTLE }}>
              Answered on slide 05, 06 &amp; 07
            </p>
          </div>
        </div>
        <p className="mt-12 font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.4, maxWidth: 1400 }}>
          The rest of this deck is the answer. If we are wrong on either point, do not invest.
        </p>
      </div>
    </Slide>
  );
}

// ─── 03 · WHAT A WEEKEND BUILDS vs WHAT WE SELL ─────────────────────────────
function S03WeekendVsAsset({ n, t }: { n: number; t: number }) {
  const rows = [
    { left: "Wire a chat UI to Claude",                    right: "Run a regulated org's standards engine" },
    { left: "Drop PDFs into a vector store",               right: "Type, version and govern every policy, procedure, decision rule" },
    { left: "Write a system prompt",                       right: "Compile a Playbook into the model on every call, then sign the output" },
    { left: "Hope it doesn't hallucinate",                 right: "Replay any output, frame-by-frame, in front of an auditor" },
    { left: "Maintain it yourself, forever",               right: "Closed loop: every receipt sharpens the next standard" },
  ];
  return (
    <Slide section="Objection 01" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          A weekend buys you a <span style={{ color: `hsl(${RED})` }}>demo.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          What an enterprise actually buys is on the right.
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          <div className="grid grid-cols-2" style={{ background: CARD_ALT }}>
            <div className="px-7 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${RED})` }}>
              The weekend project
            </div>
            <div className="px-7 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})`, borderLeft: `1px solid ${CHROME_BORDER}` }}>
              The thing a CTO signs for
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={r.left} className="grid grid-cols-2" style={{ borderTop: `1px solid ${CHROME_BORDER}`, background: i % 2 === 1 ? CARD_ALT : "transparent" }}>
              <div className="px-7 py-5 flex items-baseline gap-4">
                <span className="font-mono font-black" style={{ fontSize: 16, color: `hsl(${RED})` }}>×</span>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.35 }}>{r.left}</p>
              </div>
              <div className="px-7 py-5 flex items-baseline gap-4" style={{ borderLeft: `1px solid ${CHROME_BORDER}` }}>
                <span className="font-mono font-black" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>✓</span>
                <p className="font-bold" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35, letterSpacing: "-0.01em" }}>{r.right}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.4 }}>
          Every regulated buyer has tried the weekend version. None of them shipped it.
        </p>
      </div>
    </Slide>
  );
}

// ─── 04 · WHAT ACTUALLY COMPOUNDS (THE MOAT) ────────────────────────────────
function S04Moat({ n, t }: { n: number; t: number }) {
  const assets = [
    {
      k: "01",
      h: "Vertical standards corpus",
      v: "Per-vertical libraries of typed, versioned playbooks, procedures and decision rules. 127 standards already encoded inside one AEC customer. Not scrape-able. Not promptable.",
    },
    {
      k: "02",
      h: "Receipt &amp; lineage graph",
      v: "Every governed decision ships with a signed, hash-chained receipt. The corpus of receipts is the training set no lab can buy because it lives inside the customer.",
    },
    {
      k: "03",
      h: "Drift loop &amp; updates",
      v: "Receipts feed back into standards. The system gets smarter every week from real production work, not from public data the model already saw.",
    },
    {
      k: "04",
      h: "Regulator-tested install",
      v: "GxP, MiFID, EU AI Act mapped. Audit replay tested with real Big-Four auditors. A weekend project does not survive its first inspection.",
    },
  ];
  return (
    <Slide section="Objection 01 · Moat" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Four assets compound. <span style={{ color: `hsl(${GREEN})` }}>None of them are code.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          A clone copies our repo on Monday. They still ship 18 months behind.
        </p>
        <div className="grid grid-cols-2 gap-5">
          {assets.map((a) => (
            <div key={a.k} className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.04)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono font-black" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>{a.k}</span>
                <p className="font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }} dangerouslySetInnerHTML={{ __html: a.h }} />
              </div>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{a.v}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 05 · WHY ANTHROPIC DOES NOT BUILD THIS ─────────────────────────────────
function S05WhyNotLabs({ n, t }: { n: number; t: number }) {
  const reasons = [
    {
      h: "Wrong business model",
      v: "Labs sell tokens. Tokens get cheaper. We sell governance over tokens. Every cheap token they ship makes our layer worth more, not less.",
    },
    {
      h: "Wrong incentive",
      v: "Anthropic ships a bigger model every six months. They do not ship per-customer policy versioning, audit replay or industry-specific decision rules. That is plumbing the lab cannot productise.",
    },
    {
      h: "Wrong trust position",
      v: "A regulated bank, pharma or AEC firm will not paste its standards, decision rules and IP into a foreign-jurisdiction lab. Sovereignty kills the move before the PoC starts.",
    },
    {
      h: "Wrong surface area",
      v: "Customers run Claude AND OpenAI AND Gemini AND open-source. The governance layer must be model-agnostic. Any lab that owns it is the one product the others refuse to integrate with.",
    },
  ];
  return (
    <Slide section="Objection 02" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Anthropic <span style={{ color: `hsl(${RED})` }}>structurally</span> doesn't build this.
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          Four reasons, all of them business, none of them technical.
        </p>
        <div className="grid grid-cols-2 gap-5">
          {reasons.map((r) => (
            <div key={r.h} className="rounded-2xl p-6" style={{ background: CARD_ALT, borderLeft: `5px solid hsl(${RED})` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${RED})` }}>{r.h}</p>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>{r.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-9 font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.4 }}>
          The same logic kept Salesforce alive next to Oracle and Snowflake alive next to AWS.
        </p>
      </div>
    </Slide>
  );
}

// ─── 06 · THE LAB LANE vs THE LIZA LANE ─────────────────────────────────────
function S06TwoLanes({ n, t }: { n: number; t: number }) {
  const lab = [
    "Sells horizontal tokens",
    "Trains on public data",
    "Owns the model weights",
    "Generic safety, generic memory",
    "One vendor, one jurisdiction",
  ];
  const liza = [
    "Sells governed decisions, priced per outcome",
    "Trains on the customer's own receipt graph",
    "Customer owns the standards. Zero lock-in.",
    "Customer-specific policy, audit, drift",
    "Lab-agnostic. Routes Claude, GPT, Gemini, open-source.",
  ];
  return (
    <Slide section="Two lanes" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-9" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Labs run one lane. We run the <span style={{ color: `hsl(${GREEN})` }}>other.</span>
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 13, color: SUBTLE }}>The lab lane</p>
            <p className="font-black mb-5" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Anthropic, OpenAI, Google
            </p>
            <div className="flex flex-col gap-3">
              {lab.map((x) => (
                <p key={x} className="flex items-baseline gap-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>
                  <span className="font-mono" style={{ color: SUBTLE }}>—</span> {x}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>The governance lane</p>
            <p className="font-black mb-5" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              LIZA OS
            </p>
            <div className="flex flex-col gap-3">
              {liza.map((x) => (
                <p key={x} className="flex items-baseline gap-3 font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
                  <span className="font-mono" style={{ color: `hsl(${GREEN})` }}>✓</span> {x}
                </p>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-8 font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.4 }}>
          Every token Anthropic ships is one more token that needs governance. They are our distribution.
        </p>
      </div>
    </Slide>
  );
}

// ─── 07 · THE BUYER WILL NOT LET A LAB OWN THIS ─────────────────────────────
function S07BuyerVeto({ n, t }: { n: number; t: number }) {
  const quotes = [
    { who: "AEC CTO, EU enterprise",       q: "We will not paste our standards into a US foundation model vendor. Full stop." },
    { who: "Pharma Head of GxP",            q: "If the audit trail lives at the model vendor, the regulator does not accept it. We need to own the record." },
    { who: "Tier-1 bank, AI council",        q: "We run four model vendors today and we will run six tomorrow. Anyone who is one of them cannot be our governance layer." },
  ];
  return (
    <Slide section="Buyer veto" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Even if a lab tried, <span style={{ color: `hsl(${GOLD})` }}>buyers would veto it.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          Direct lines from active discovery calls. Anonymized, available on request.
        </p>
        <div className="flex flex-col gap-5">
          {quotes.map((qq) => (
            <div key={qq.who} className="rounded-2xl p-7" style={{ background: CARD_ALT, borderLeft: `5px solid hsl(${GOLD})` }}>
              <p className="font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.35, letterSpacing: "-0.015em" }}>
                "{qq.q}"
              </p>
              <p className="mt-3 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
                {qq.who}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 08 · PROOF (THE THING NO WEEKEND BUILDS) ───────────────────────────────
function S08Proof({ n, t }: { n: number; t: number }) {
  const stats = [
    { v: "127",  l: "standards encoded inside one customer" },
    { v: "3.4K", l: "governed decisions / month, signed &amp; replayable" },
    { v: "62%",  l: "drop in time-to-spec, CTO-sponsored" },
    { v: "0",    l: "audit failures across 6 months of replay" },
  ];
  return (
    <Slide section="Proof" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Production deployment. <span style={{ color: `hsl(${GREEN})` }}>Not a slide.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          One regulated AEC customer. CTO-sponsored. Pattern repeats into pharma, banking, space.
        </p>
        <div className="grid grid-cols-2 gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl p-8 flex items-baseline gap-7" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <div className="font-black" style={{ fontSize: 88, lineHeight: 0.9, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", minWidth: 200 }}>{s.v}</div>
              <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }} dangerouslySetInnerHTML={{ __html: s.l }} />
            </div>
          ))}
        </div>
        <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.4 }}>
          No prompt template, no RAG stack and no Anthropic feature shipped any of these numbers.
        </p>
      </div>
    </Slide>
  );
}

// ─── 09 · WHAT THE €2M ACTUALLY BUYS ────────────────────────────────────────
function S09Ask({ n, t }: { n: number; t: number }) {
  const uses = [
    { v: "50%", l: "Standards corpus in 3 verticals", note: "AEC depth + pharma + banking. The library a lab cannot copy." },
    { v: "30%", l: "Self-serve install + metered billing", note: "Day-31 metering. PLG entry. €0.40 per governed decision." },
    { v: "20%", l: "Partner channel + audit kit",       note: "Regulator-tested replay. Architect-partner enablement." },
  ];
  return (
    <Slide section="The ask" n={n} total={t} dark>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-7" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          Seed Round · what €2M actually buys
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 132, lineHeight: 0.9, color: "hsl(0 0% 98%)", letterSpacing: "-0.05em" }}>
          €2M
        </h2>
        <div className="grid grid-cols-3 gap-7 mb-9">
          {uses.map((u) => (
            <div key={u.l} className="rounded-2xl p-6" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
              <div className="font-black mb-3" style={{ fontSize: 56, lineHeight: 0.95, color: `hsl(${GREEN})`, letterSpacing: "-0.035em" }}>{u.v}</div>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: "hsl(0 0% 95%)", lineHeight: 1.25 }}>{u.l}</p>
              <p style={{ fontSize: 15, color: "hsl(0 0% 70%)", lineHeight: 1.4 }}>{u.note}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-5" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>Milestone to Series A</p>
          <p style={{ fontSize: 20, color: "hsl(0 0% 92%)", lineHeight: 1.4 }}>
            €3M ARR by month 18. Three vertical corpora live. Audit replay accepted by two Big-Four auditors. The moat is on the customer's hard drive, not in our repo.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 10 · CLOSE ─────────────────────────────────────────────────────────────
function S10Close({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <h2 className="font-black" style={{ fontSize: 80, lineHeight: 1.05, color: "hsl(0 0% 98%)", letterSpacing: "-0.04em", maxWidth: 1500 }}>
          Models commoditise.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>Governance corpora compound.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 26, color: "hsl(0 0% 75%)", maxWidth: 1300, lineHeight: 1.4 }}>
          If you believe Claude will own organizational governance, do not invest. If you believe the customer will, this is the seat.
        </p>
        <p className="mt-14 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 14, color: "hsl(0 0% 60%)" }}>
          founder@lizaos.ai
        </p>
      </div>
    </Slide>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const RAW_SLIDES: { id: string; title: string; render: (n: number, t: number) => React.ReactNode }[] = [
  { id: "cover",        title: "Cover",                       render: (n, t) => <S01Cover n={n} t={t} /> },
  { id: "objections",   title: "The two objections",          render: (n, t) => <S02Objections n={n} t={t} /> },
  { id: "weekend",      title: "Weekend vs Enterprise",       render: (n, t) => <S03WeekendVsAsset n={n} t={t} /> },
  { id: "moat",         title: "Four assets that compound",   render: (n, t) => <S04Moat n={n} t={t} /> },
  { id: "labs",         title: "Why Anthropic doesn't build", render: (n, t) => <S05WhyNotLabs n={n} t={t} /> },
  { id: "lanes",        title: "Two lanes",                   render: (n, t) => <S06TwoLanes n={n} t={t} /> },
  { id: "veto",         title: "Buyer veto",                  render: (n, t) => <S07BuyerVeto n={n} t={t} /> },
  { id: "proof",        title: "Proof",                       render: (n, t) => <S08Proof n={n} t={t} /> },
  { id: "ask",          title: "The Ask · €2M",               render: (n, t) => <S09Ask n={n} t={t} /> },
  { id: "close",        title: "Closing",                     render: (n, t) => <S10Close n={n} t={t} /> },
];

const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      {s.render(i + 1, RAW_SLIDES.length)}
    </SlideIndexProvider>
  ),
}));

// ─── Deck shell ──────────────────────────────────────────────────────────────
export default function SeedPitchDeckSkeptic() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Skeptic" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Seed Pitch · Skeptic Edition</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            For the skeptical investor · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Skeptic" slideCount={SLIDES.length} variant="desktop" />
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
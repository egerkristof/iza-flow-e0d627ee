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

// ─── Recurring thread: the Context Explosion ────────────────────────────────
// A single visual motif that runs through the deck. It encodes the core thesis:
// today's "one chat, small context" reality vs. the org-scale context graph
// that every regulated enterprise is one year away from. Each downstream slide
// highlights which axis of the explosion (silos, efficiency, audit, compounding)
// it answers, so the investor feels one thread instead of twelve arguments.
type ContextAxis = "silos" | "efficiency" | "audit" | "compounding";
const AXES: { id: ContextAxis; label: string; short: string }[] = [
  { id: "silos",       label: "Cannot stay siloed",      short: "Silos break" },
  { id: "efficiency",  label: "Must be efficient",       short: "Cost per call" },
  { id: "audit",       label: "Must be auditable",       short: "Replay & approve" },
  { id: "compounding", label: "Must compound",           short: "Each decision sharpens the next" },
];

function ContextThreadStrip({ active }: { active: ContextAxis }) {
  // Thin recurring strip placed above the footer. Tiny dot → expanding cloud on
  // the left, the four axes on the right with the current one lit in green.
  return (
    <div
      className="absolute left-20 right-20 bottom-[88px] flex items-center gap-6 px-5 py-3 rounded-xl"
      style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 11, color: SUBTLE }}>
          Context explosion
        </span>
        <span className="inline-block rounded-full" style={{ width: 4, height: 4, background: `hsl(${RED} / 0.7)` }} />
        <span className="inline-block" style={{ width: 22, height: 1, background: `linear-gradient(90deg, hsl(${RED} / 0.4), hsl(${GREEN} / 0.7))` }} />
        <span className="inline-block rounded-full" style={{ width: 14, height: 14, background: `radial-gradient(circle, hsl(${GREEN} / 0.55), hsl(${GREEN} / 0.05) 70%)`, border: `1px solid hsl(${GREEN} / 0.5)` }} />
      </div>
      <div className="flex-1 flex items-center justify-end gap-2 flex-wrap">
        {AXES.map((a) => {
          const on = a.id === active;
          return (
            <span
              key={a.id}
              className="font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded"
              style={{
                fontSize: 10,
                color: on ? `hsl(${GREEN})` : SUBTLE,
                background: on ? `hsl(${GREEN} / 0.08)` : "transparent",
                border: `1px solid ${on ? `hsl(${GREEN} / 0.45)` : CHROME_BORDER}`,
                fontWeight: on ? 800 : 500,
              }}
            >
              {a.short}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Recurring lens ribbon ──────────────────────────────────────────────────
// The deck's spine. Every body slide carries the same dichotomy in a thin
// bottom strip: what the market grades vs. what operators are actually
// building. The current slide's axis of the context explosion lights up on
// the right so the investor feels one continuous argument.
function LensRibbon({ market, operator, axis }: { market: string; operator: string; axis: ContextAxis }) {
  return (
    <div
      className="absolute left-20 right-20 bottom-[84px] rounded-xl overflow-hidden"
      style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}
    >
      <div className="grid grid-cols-[1fr_1fr_auto]">
        {/* Market lens */}
        <div className="px-6 py-3" style={{ borderRight: `1px solid ${CHROME_BORDER}`, background: `hsl(${RED} / 0.04)` }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-1" style={{ fontSize: 10, color: `hsl(${RED})` }}>Market lens</p>
          <p className="font-bold" style={{ fontSize: 15, color: MUTED, lineHeight: 1.25 }}>{market}</p>
        </div>
        {/* Operator lens */}
        <div className="px-6 py-3" style={{ borderRight: `1px solid ${CHROME_BORDER}`, background: `hsl(${GREEN} / 0.05)` }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-1" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>Operator lens</p>
          <p className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.25 }}>{operator}</p>
        </div>
        {/* Axis indicator */}
        <div className="px-5 py-3 flex items-center gap-2" style={{ minWidth: 280 }}>
          {AXES.map((a) => {
            const on = a.id === axis;
            return (
              <span
                key={a.id}
                className="rounded-full"
                title={a.short}
                style={{
                  width: on ? 10 : 6, height: on ? 10 : 6,
                  background: on ? `hsl(${GREEN})` : `hsl(${SUBTLE} / 0.4)`,
                  border: on ? `1px solid hsl(${GREEN} / 0.6)` : "none",
                  boxShadow: on ? `0 0 8px hsl(${GREEN} / 0.6)` : "none",
                }}
              />
            );
          })}
          <span className="font-mono uppercase tracking-[0.22em] ml-2" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>
            {AXES.find((a) => a.id === axis)?.short}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 01 · COVER ──────────────────────────────────────────────────────────────
function S01Cover({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-10" style={{ fontSize: 16, color: `hsl(${GOLD})` }}>
          For the investor tired of AI weekend projects
        </p>
        <h1 className="font-black" style={{ fontSize: 126, lineHeight: 0.94, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          The production control layer<br/>
          <span style={{ color: `hsl(${GREEN})` }}>for AI work.</span>
        </h1>
        <p className="mt-12" style={{ fontSize: 31, lineHeight: 1.35, color: "hsl(0 0% 76%)", maxWidth: 1280 }}>
          LIZA OS sits between Claude, GPT, Gemini and regulated enterprise workflows. It turns AI outputs into governed decisions with standards, evidence and receipts.
        </p>
      </div>
    </Slide>
  );
}

// ─── 02 · INVESTOR LENS ─────────────────────────────────────────────────────
function S02InvestorLens({ n, t }: { n: number; t: number }) {
  const rows = [
    { k: "What you see first", v: "A user asks an AI system to do work." },
    { k: "What actually matters", v: "The company can prove which standard shaped the answer, who approved it, which model ran it and why it was safe to ship." },
    { k: "What LIZA sells", v: "That proof layer, packaged as software and priced per governed decision." },
  ];
  return (
    <Slide section="Investor lens" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-4" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Do not evaluate us as <span style={{ color: `hsl(${RED})` }}>another chatbot.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          The product is not the text box. The product is production control.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {rows.map((r, i) => (
            <div key={r.k} className="rounded-2xl p-8" style={{ background: i === 2 ? `hsl(${GREEN} / 0.05)` : CARD_ALT, border: i === 2 ? `1px solid hsl(${GREEN} / 0.35)` : `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 13, color: i === 2 ? `hsl(${GREEN})` : SUBTLE }}>{r.k}</p>
              <p className="font-bold" style={{ fontSize: 27, color: TEXT, lineHeight: 1.28, letterSpacing: "-0.02em" }}>{r.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35, maxWidth: 1360 }}>
          Weekend projects make AI look useful. LIZA makes AI accountable enough for regulated work.
        </p>
      </div>
    </Slide>
  );
}

// ─── 03 · PROBLEM ───────────────────────────────────────────────────────────
function S03Problem({ n, t }: { n: number; t: number }) {
  const failures = [
    { h: "No standard", v: "The model answers from context, not from the company's approved way of doing the work." },
    { h: "No receipt", v: "Nobody can reconstruct the playbook, data, policy version, model and approval path behind the output." },
    { h: "No memory", v: "The workflow disappears when the tab closes. The organization does not learn from the decision." },
  ];
  return (
    <Slide section="Problem" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-4" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Enterprises do not lack models. <span style={{ color: `hsl(${RED})` }}>They lack control.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          The AI readiness problem is operational, not magical.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {failures.map((f, i) => (
            <div key={f.h} className="rounded-2xl p-7" style={{ background: `hsl(${RED} / 0.045)`, border: `1px solid hsl(${RED} / 0.25)` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 13, color: `hsl(${RED})` }}>Failure 0{i + 1}</p>
              <p className="font-black mb-4" style={{ fontSize: 34, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>{f.h}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.42 }}>{f.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-6" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
            Example: a proposal, risk memo or clinical summary leaves the model. The company cannot prove which approved method shaped it, what changed since last week, or why the next version should be better.
          </p>
        </div>
      </div>
      <LensRibbon
        axis="audit"
        market="Enterprises just need better prompts and a chat UI."
        operator="Every output must carry standard, evidence, approver and model — replayable on demand."
      />
    </Slide>
  );
}

// ─── 03b · CONTEXT EXPLOSION (the spine of the deck) ────────────────────────
function SContextExplosion({ n, t }: { n: number; t: number }) {
  const consequences = [
    { k: "Silos break",    v: "Context spans roles, tools, regions and regulators. It cannot live in one team's notebook." },
    { k: "Cost matters",   v: "Every governed task pulls context. Inefficient assembly multiplies token and latency bills." },
    { k: "Audit is law",   v: "Each output must be replayable. Which standard, which data, which approval, which model." },
    { k: "It compounds",   v: "Receipts become the next context. The organization gets sharper with every decision." },
  ];
  return (
    <Slide section="The spine" n={n} total={t}>
      <div className="absolute inset-0 px-32 pt-36 pb-28 flex flex-col">
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          The investor pitch hides one fact. <span style={{ color: `hsl(${GREEN})` }}>Context is about to explode.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-7" style={{ fontSize: 13, color: MUTED }}>
          The thread that runs through every remaining slide of this deck.
        </p>

        {/* Two realities: today vs. coming */}
        <div className="grid grid-cols-2 gap-7 mb-7">
          {/* Today */}
          <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 12, color: `hsl(${RED})` }}>What investors see today</p>
            <p className="font-black mb-5" style={{ fontSize: 28, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              One user. One chat. A handful of files in the prompt.
            </p>
            <div className="relative h-[170px] flex items-center justify-center">
              <div className="rounded-full" style={{
                width: 26, height: 26,
                background: `radial-gradient(circle, hsl(${RED} / 0.7), hsl(${RED} / 0.15) 70%)`,
                border: `1px solid hsl(${RED} / 0.6)`,
              }} />
              <span className="absolute font-mono uppercase tracking-[0.18em]" style={{ fontSize: 10, color: SUBTLE, transform: "translateY(36px)" }}>
                ~10K tokens · one workflow · zero receipts
              </span>
            </div>
          </div>

          {/* Coming */}
          <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>What is actually coming</p>
            <p className="font-black mb-5" style={{ fontSize: 28, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Every employee × every workflow × every policy × every receipt.
            </p>
            <div className="relative h-[170px] flex items-center justify-center">
              {/* layered clouds suggesting explosion */}
              <div className="absolute rounded-full" style={{ width: 200, height: 200, background: `radial-gradient(circle, hsl(${GREEN} / 0.18), hsl(${GREEN} / 0) 70%)` }} />
              <div className="absolute rounded-full" style={{ width: 130, height: 130, background: `radial-gradient(circle, hsl(${GREEN} / 0.35), hsl(${GREEN} / 0) 70%)` }} />
              <div className="absolute rounded-full" style={{ width: 70, height: 70, background: `radial-gradient(circle, hsl(${GREEN} / 0.6), hsl(${GREEN} / 0.1) 70%)`, border: `1px solid hsl(${GREEN} / 0.55)` }} />
              <span className="absolute font-mono uppercase tracking-[0.18em]" style={{ fontSize: 10, color: SUBTLE, transform: "translateY(96px)" }}>
                org-scale context graph · billions of governed tokens
              </span>
            </div>
          </div>
        </div>

        {/* Four consequences — the axes carried through the deck */}
        <div className="grid grid-cols-4 gap-4">
          {consequences.map((c, i) => (
            <div key={c.k} className="rounded-xl p-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}`, borderTop: `3px solid hsl(${GREEN})` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>0{i + 1}</p>
              <p className="font-black mb-2" style={{ fontSize: 19, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{c.k}</p>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{c.v}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 03c · INVESTOR BLIND SPOT (operator-side evidence) ─────────────────────
// The context-explosion is not a LIZA thesis. Enterprise data leaders are
// already writing about it publicly. This slide turns that into an investor
// problem: the venture market is grading chat UIs while operators race to
// build the governed semantic / control layer that LIZA is the productised
// vertical version of.
function SInvestorBlindSpot({ n, t }: { n: number; t: number }) {
  const investorView = [
    { h: "Chat UI", v: "Pretty, demoable, undifferentiated." },
    { h: "Model wrapper", v: "Anyone can build it in a weekend." },
    { h: "Foundation labs", v: "Will absorb it anyway." },
  ];
  const operatorView = [
    { h: "Semantic layer", v: "Encoded, governed, machine-readable business definitions." },
    { h: "Federated data products", v: "Domain teams own definitions. A central platform governs them." },
    { h: "Metric registry & owners", v: "Every metric has a named owner, validated SQL, review cadence, audit trail." },
    { h: "Agents query the layer", v: "AI runs against governed definitions. Reactive dashboards get wound down." },
  ];
  const signals = [
    { v: "5×",   l: "decision-consumers served per analyst FTE in 12 months" },
    { v: "11% → 330%", l: "ROIC trajectory once the layer compounds" },
    { v: "≈0",  l: "marginal cost to serve the next decision-maker" },
  ];
  return (
    <Slide section="Investor blind spot" n={n} total={t}>
      <div className="absolute inset-0 px-32 pt-36 pb-28 flex flex-col">
        <h2 className="font-black mb-3" style={{ fontSize: 58, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Investors are grading chat UIs. <span style={{ color: `hsl(${GREEN})` }}>Operators are racing to build the layer underneath.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-7" style={{ fontSize: 13, color: MUTED }}>
          Independent industry signal. Data-leadership commentary, May 2026.
        </p>

        {/* Two columns: market lens vs. operator lens */}
        <div className="grid grid-cols-[0.85fr_1.15fr] gap-6 mb-6">
          {/* Market lens (RED) */}
          <div className="rounded-2xl p-7" style={{ background: `hsl(${RED} / 0.045)`, border: `1px solid hsl(${RED} / 0.28)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 12, color: `hsl(${RED})` }}>What the venture market evaluates</p>
            <p className="font-black mb-5" style={{ fontSize: 26, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              The visible product. The hype surface.
            </p>
            <div className="flex flex-col gap-3">
              {investorView.map((r) => (
                <div key={r.h} className="rounded-lg px-4 py-3 flex items-baseline gap-3" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
                  <span className="font-mono font-black" style={{ fontSize: 13, color: `hsl(${RED})`, minWidth: 130 }}>{r.h}</span>
                  <span style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operator lens (GREEN) — directly mirrors the article's future-state org */}
          <div className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.38)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>What data leaders are quietly building</p>
            <p className="font-black mb-5" style={{ fontSize: 26, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              The governed layer between AI and the business.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {operatorView.map((r) => (
                <div key={r.h} className="rounded-lg px-4 py-3" style={{ background: BG, border: `1px solid hsl(${GREEN} / 0.3)` }}>
                  <p className="font-black mb-1" style={{ fontSize: 15, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{r.h}</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.35 }}>{r.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signals strip + LIZA framing */}
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-xl p-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 11, color: SUBTLE }}>Operator-side signals already on the record</p>
            <div className="grid grid-cols-3 gap-3">
              {signals.map((s) => (
                <div key={s.l}>
                  <p className="font-black" style={{ fontSize: 28, lineHeight: 1.0, color: `hsl(${GREEN})`, letterSpacing: "-0.03em" }}>{s.v}</p>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.3, marginTop: 4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: `hsl(${GREEN} / 0.07)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>The LIZA position</p>
            <p className="font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1.35 }}>
              Every enterprise needs this layer. Most will not staff a curator guild to build it from scratch. LIZA OS ships it as a product, vertical by vertical, with the receipts and ownership model already wired in.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── 04 · SOLUTION UNIT ─────────────────────────────────────────────────────
function S04ProductUnit({ n, t }: { n: number; t: number }) {
  const steps = [
    { k: "LOCK", h: "Bind the task to a playbook", v: "Intent is matched to the company's versioned way of doing the work." },
    { k: "COMPILE", h: "Load the right standards", v: "Policies, procedures, decision rules and approved data are compiled fresh for that single call." },
    { k: "SIGN", h: "Issue a replayable receipt", v: "Every output carries the evidence needed to audit, approve and improve the decision." },
  ];
  return (
    <Slide section="Solution" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          LIZA turns each AI task into <span style={{ color: `hsl(${GREEN})` }}>a governed decision.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          One unit. Three controls. Model agnostic by design.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {steps.map((s, i) => (
            <div key={s.k} className="rounded-2xl p-8" style={{ background: `hsl(${GREEN} / 0.045)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
              <div className="flex items-center gap-4 mb-5">
                <span className="font-mono font-black flex items-center justify-center rounded-full" style={{ width: 34, height: 34, fontSize: 15, color: BG, background: `hsl(${GREEN})` }}>{i + 1}</span>
                <span className="font-mono font-black uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>{s.k}</span>
              </div>
              <p className="font-black mb-4" style={{ fontSize: 32, color: TEXT, lineHeight: 1.08, letterSpacing: "-0.025em" }}>{s.h}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.42 }}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-6" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
          <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
            The receipt feeds back into the standards layer. The next decision is not just faster. It is better governed.
          </p>
        </div>
      </div>
      <ContextThreadStrip active="compounding" />
    </Slide>
  );
}

// ─── 05 · WHY NOW ───────────────────────────────────────────────────────────
function S05WhyNow({ n, t }: { n: number; t: number }) {
  const moves = [
    { label: "Token price", value: "Down", color: RED },
    { label: "AI usage", value: "Up", color: GOLD },
    { label: "Governance need", value: "Explodes", color: GREEN },
  ];
  return (
    <Slide section="Why now" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-4" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Tokens get cheaper. <span style={{ color: `hsl(${GREEN})` }}>AI work gets bigger.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          The spend moves from raw model calls to the control layer around them.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-9">
          {moves.map((m) => (
            <div key={m.label} className="rounded-2xl p-8 text-center" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 13, color: SUBTLE }}>{m.label}</p>
              <p className="font-black" style={{ fontSize: 64, lineHeight: 0.95, color: `hsl(${m.color})`, letterSpacing: "-0.04em" }}>{m.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <p className="font-black mb-4" style={{ fontSize: 34, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.025em" }}>LIZA captures the layer in between.</p>
            <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.4 }}>
              Foundation models commoditise intelligence. Enterprises still need policy, audit, routing, receipts and improvement loops around every important output.
            </p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <div className="h-36 relative mt-2">
              <div className="absolute left-2 right-2 bottom-8 h-px" style={{ background: CHROME_BORDER }} />
              <div className="absolute left-2 bottom-10 w-[42%] h-2 rounded-full" style={{ background: `hsl(${RED} / 0.45)`, transform: "rotate(-17deg)", transformOrigin: "left center" }} />
              <div className="absolute left-2 bottom-8 w-[78%] h-2 rounded-full" style={{ background: `hsl(${GREEN} / 0.9)`, transform: "rotate(-20deg)", transformOrigin: "left center" }} />
              <p className="absolute left-0 bottom-0 font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11, color: `hsl(${RED})` }}>Model cost</p>
              <p className="absolute right-0 top-0 font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Governed work</p>
            </div>
          </div>
        </div>
      </div>
      <ContextThreadStrip active="efficiency" />
    </Slide>
  );
}

// ─── 06 · WEEKEND OBJECTION ─────────────────────────────────────────────────
function S06WeekendObjection({ n, t }: { n: number; t: number }) {
  const rows = [
    { left: "Chat UI plus model API", right: "Workflow control across roles, approvals and tools" },
    { left: "PDFs in a vector store", right: "Typed standards, ownership, expiry, versioning and change control" },
    { left: "A clever system prompt", right: "Playbook compilation on every governed decision" },
    { left: "Helpful answer", right: "Signed receipt that survives audit and handover" },
    { left: "Manual maintenance", right: "Closed loop where receipts sharpen the standard" },
  ];
  return (
    <Slide section="Objection 01" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          A weekend project automates text. <span style={{ color: `hsl(${RED})` }}>It does not certify work.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          The visible demo is easy. The production burden is the company.
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          <div className="grid grid-cols-2" style={{ background: CARD_ALT }}>
            <div className="px-7 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${RED})` }}>Weekend demo</div>
            <div className="px-7 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})`, borderLeft: `1px solid ${CHROME_BORDER}` }}>Production system</div>
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
      </div>
    </Slide>
  );
}

// ─── 07 · LAB OBJECTION ─────────────────────────────────────────────────────
function S07LabObjection({ n, t }: { n: number; t: number }) {
  const reasons = [
    { h: "Business model", v: "Labs sell token volume. LIZA governs decisions that sit on top of any token supplier." },
    { h: "Neutrality", v: "Enterprises will run several models. The control layer cannot be owned by one of the vendors being controlled." },
    { h: "Sovereignty", v: "Company standards, decision rules and receipts are operational IP. Buyers need to own that record." },
    { h: "Accountability", v: "The model can generate. It cannot become the customer's auditable operating system." },
  ];
  return (
    <Slide section="Objection 02" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Foundation labs are suppliers. <span style={{ color: `hsl(${GREEN})` }}>Not the control layer.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          They can add features. They cannot own the customer's governance position.
        </p>
        <div className="grid grid-cols-2 gap-5 mb-9">
          {reasons.map((r) => (
            <div key={r.h} className="rounded-2xl p-7" style={{ background: CARD_ALT, borderLeft: `5px solid hsl(${GREEN})` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>{r.h}</p>
              <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }}>{r.v}</p>
            </div>
          ))}
        </div>
        <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
          Claude can be inside the workflow. It cannot credibly certify the workflow for every other model, department and regulator.
        </p>
      </div>
    </Slide>
  );
}

// ─── 08 · BUSINESS MODEL ────────────────────────────────────────────────────
function S08BusinessModel({ n, t }: { n: number; t: number }) {
  const economics = [
    { v: "€0.40", l: "average governed decision price" },
    { v: "€0.04", l: "model plus infra cost at current mix" },
    { v: "90%+", l: "steady-state gross margin target" },
  ];
  return (
    <Slide section="Business model" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          We do not sell tokens. <span style={{ color: `hsl(${GREEN})` }}>We sell governed decisions.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          The cheaper tokens become, the more decisions customers run through the control layer.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {economics.map((e) => (
            <div key={e.v} className="rounded-2xl p-8" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <p className="font-black mb-4" style={{ fontSize: 62, lineHeight: 0.95, color: `hsl(${GREEN})`, letterSpacing: "-0.04em" }}>{e.v}</p>
              <p className="font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.3 }}>{e.l}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <p className="font-black mb-4" style={{ fontSize: 34, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            The value anchor is manual labor displaced, not token cost marked up.
          </p>
          <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.42 }}>
            Customers pay for accountable work units: proposals checked, specs drafted, risk memos reviewed, clinical summaries governed. The model cost becomes a pass-through input inside a higher-margin control layer.
          </p>
        </div>
      </div>
      <ContextThreadStrip active="efficiency" />
    </Slide>
  );
}

// ─── 09 · PROOF ─────────────────────────────────────────────────────────────
function S09Proof({ n, t }: { n: number; t: number }) {
  const stats = [
    { v: "1", l: "CTO-sponsored production deployment" },
    { v: "127", l: "standards encoded inside one AEC customer" },
    { v: "3,400", l: "signed governed decisions per month" },
    { v: "62%", l: "drop in time-to-spec" },
  ];
  return (
    <Slide section="Proof" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          The wedge is live. <span style={{ color: `hsl(${GREEN})` }}>Not theoretical.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          One regulated AEC deployment. Anonymized details available under NDA.
        </p>
        <div className="grid grid-cols-2 gap-6 mb-9">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl p-8 flex items-baseline gap-7" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <div className="font-black" style={{ fontSize: 82, lineHeight: 0.9, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", minWidth: 210 }}>{s.v}</div>
              <p className="font-bold" style={{ fontSize: 21, color: TEXT, lineHeight: 1.35 }}>{s.l}</p>
            </div>
          ))}
        </div>
        <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
          The first vertical proves the pattern: encode standards, govern decisions, price the work unit, expand into adjacent regulated functions.
        </p>
      </div>
    </Slide>
  );
}

// ─── 10 · MOAT ──────────────────────────────────────────────────────────────
function S10Moat({ n, t }: { n: number; t: number }) {
  const assets = [
    { k: "01", h: "Standards corpus", v: "Typed playbooks, procedures and decision rules by vertical and customer." },
    { k: "02", h: "Receipt graph", v: "A proprietary trail of real decisions, evidence, approvals and drift." },
    { k: "03", h: "Workflow position", v: "The layer that sits where work is requested, approved, replayed and improved." },
    { k: "04", h: "Trust pattern", v: "A neutral control layer that lets buyers keep model optionality and governance ownership." },
  ];
  return (
    <Slide section="Moat" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          The moat is not code. <span style={{ color: `hsl(${GREEN})` }}>It is accumulated governance.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          A clone can copy screens. It cannot copy the controlled corpus and decision history.
        </p>
        <div className="grid grid-cols-2 gap-5">
          {assets.map((a) => (
            <div key={a.k} className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.045)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono font-black" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>{a.k}</span>
                <p className="font-black" style={{ fontSize: 29, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.025em" }}>{a.h}</p>
              </div>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>{a.v}</p>
            </div>
          ))}
        </div>
      </div>
      <ContextThreadStrip active="compounding" />
    </Slide>
  );
}

// ─── 11 · ASK ───────────────────────────────────────────────────────────────
function S11Ask({ n, t }: { n: number; t: number }) {
  const uses = [
    { v: "50%", l: "Vertical corpus expansion", note: "Deepen AEC. Package pharma and banking standards libraries." },
    { v: "30%", l: "Repeatable deployment", note: "Self-serve install, metering, integrations and admin controls." },
    { v: "20%", l: "Channel and proof", note: "Partner enablement, audit kit and enterprise sales material." },
  ];
  return (
    <Slide section="Seed round" n={n} total={t} dark>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-7" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          €2M seed | turn one working factory into a repeatable company
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 112, lineHeight: 0.95, color: "hsl(0 0% 98%)", letterSpacing: "-0.05em" }}>
          Fund the control layer<br/>
          before it becomes obvious.
        </h2>
        <div className="grid grid-cols-3 gap-7 mb-9">
          {uses.map((u) => (
            <div key={u.l} className="rounded-2xl p-6" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
              <div className="font-black mb-3" style={{ fontSize: 52, lineHeight: 0.95, color: `hsl(${GREEN})`, letterSpacing: "-0.035em" }}>{u.v}</div>
              <p className="font-bold mb-2" style={{ fontSize: 21, color: "hsl(0 0% 95%)", lineHeight: 1.25 }}>{u.l}</p>
              <p style={{ fontSize: 16, color: "hsl(0 0% 70%)", lineHeight: 1.4 }}>{u.note}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-5" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>Series A milestone</p>
          <p style={{ fontSize: 20, color: "hsl(0 0% 92%)", lineHeight: 1.4 }}>
            Three regulated verticals live. Repeatable day-30 deployment. Metered governed decisions. Clear proof that governance spend grows while model cost falls.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 12 · CLOSE ─────────────────────────────────────────────────────────────
function S12Close({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <h2 className="font-black" style={{ fontSize: 86, lineHeight: 1.04, color: "hsl(0 0% 98%)", letterSpacing: "-0.04em", maxWidth: 1480 }}>
          Models commoditise.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>The control layer compounds.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 27, color: "hsl(0 0% 76%)", maxWidth: 1280, lineHeight: 1.4 }}>
          If regulated enterprises use more AI, they will need a neutral system that governs the work. LIZA OS is that system.
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
  { id: "lens",         title: "Investor lens",               render: (n, t) => <S02InvestorLens n={n} t={t} /> },
  { id: "explosion",    title: "Context explosion",           render: (n, t) => <SContextExplosion n={n} t={t} /> },
  { id: "blindspot",    title: "Investor blind spot",         render: (n, t) => <SInvestorBlindSpot n={n} t={t} /> },
  { id: "problem",      title: "Problem",                     render: (n, t) => <S03Problem n={n} t={t} /> },
  { id: "solution",     title: "Solution unit",               render: (n, t) => <S04ProductUnit n={n} t={t} /> },
  { id: "why-now",      title: "Why now",                     render: (n, t) => <S05WhyNow n={n} t={t} /> },
  { id: "weekend",      title: "Weekend objection",           render: (n, t) => <S06WeekendObjection n={n} t={t} /> },
  { id: "labs",         title: "Lab objection",               render: (n, t) => <S07LabObjection n={n} t={t} /> },
  { id: "model",        title: "Business model",              render: (n, t) => <S08BusinessModel n={n} t={t} /> },
  { id: "proof",        title: "Proof",                       render: (n, t) => <S09Proof n={n} t={t} /> },
  { id: "moat",         title: "Moat",                        render: (n, t) => <S10Moat n={n} t={t} /> },
  { id: "ask",          title: "The Ask | €2M",               render: (n, t) => <S11Ask n={n} t={t} /> },
  { id: "close",        title: "Closing",                     render: (n, t) => <S12Close n={n} t={t} /> },
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
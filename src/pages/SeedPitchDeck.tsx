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
// SEED PITCH DECK — Airbnb-style. One idea per slide. No prerequisites.
// 14 slides, ~30 seconds each, total reading time under 8 minutes cold.
// Investor opens the file alone and gets the thread in one pass.
// ═════════════════════════════════════════════════════════════════════════════

// ─── Slide chrome (light, minimal, repeats every slide) ─────────────────────
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
        LIZA OS · Seed · Confidential
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
        <p className="font-mono uppercase tracking-[0.4em] mb-12" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          The Production System for AI Work
        </p>
        <h1 className="font-black" style={{ fontSize: 132, lineHeight: 0.98, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          LIZA OS
        </h1>
        <p className="mt-12" style={{ fontSize: 36, lineHeight: 1.3, color: "hsl(0 0% 75%)", maxWidth: 1200 }}>
          Run AI like a factory, not a workshop.
        </p>
      </div>
      <div className="absolute bottom-14 right-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 12, color: "hsl(0 0% 55%)" }}>
        Seed Round · €2M
      </div>
    </Slide>
  );
}

// ─── 02 · PROBLEM ────────────────────────────────────────────────────────────
function S02Problem({ n, t }: { n: number; t: number }) {
  const lines = [
    "Every prompt is hand-crafted by one person.",
    "Every output ships without a receipt.",
    "Every workflow dies when the tab closes.",
  ];
  return (
    <Slide section="Problem" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-16" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Companies run AI like a{" "}
          <span style={{ color: `hsl(${RED})` }}>workshop of artisans.</span>
        </h2>
        <div className="flex flex-col gap-7">
          {lines.map((l) => (
            <div key={l} className="flex items-baseline gap-6">
              <span className="font-mono" style={{ fontSize: 22, color: `hsl(${RED})` }}>—</span>
              <p style={{ fontSize: 36, color: TEXT, lineHeight: 1.25 }}>{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-16 font-mono uppercase tracking-[0.2em]" style={{ fontSize: 16, color: MUTED }}>
          Brilliance does not compound. It does not transfer. It does not survive Monday.
        </p>
      </div>
    </Slide>
  );
}

// ─── 03 · SOLUTION ───────────────────────────────────────────────────────────
function S03Solution({ n, t }: { n: number; t: number }) {
  const items = [
    { k: "LOCK",   v: "Every prompt locks to a playbook." },
    { k: "COMPILE", v: "Every call compiles against typed standards." },
    { k: "SIGN",   v: "Every output ships with a signed receipt." },
  ];
  return (
    <Slide section="Solution" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-16" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          We run a{" "}
          <span style={{ color: `hsl(${GREEN})` }}>system around the model.</span>
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {items.map((i) => (
            <div key={i.k} className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.04)` }}>
              <div className="font-mono font-black uppercase tracking-[0.2em] mb-4" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
                {i.k}
              </div>
              <p className="font-bold" style={{ fontSize: 26, color: TEXT, lineHeight: 1.25 }}>{i.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-14" style={{ fontSize: 26, color: MUTED, maxWidth: 1300, lineHeight: 1.35 }}>
          The chat surface looks the same. Underneath, every decision is governed, typed, and replayable. Knowledge compounds inside the company instead of dying with the session.
        </p>
      </div>
    </Slide>
  );
}

// ─── 04 · WHY NOW ────────────────────────────────────────────────────────────
function S04WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Why Now" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-16" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Two shifts. <span style={{ color: `hsl(${ACCENT})` }}>One collision.</span>
        </h2>
        <div className="grid grid-cols-2 gap-10">
          <div className="rounded-2xl p-10" style={{ background: CARD_ALT, borderLeft: `6px solid hsl(${ACCENT})` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 15, color: `hsl(${ACCENT})` }}>
              Shift 1
            </p>
            <p className="font-black mb-3" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              AI is in every workflow.
            </p>
            <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.35 }}>
              ChatGPT, Copilot, Gemini are inside every team. Adoption is solved. Governance is not.
            </p>
          </div>
          <div className="rounded-2xl p-10" style={{ background: CARD_ALT, borderLeft: `6px solid hsl(${GOLD})` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 15, color: `hsl(${GOLD})` }}>
              Shift 2
            </p>
            <p className="font-black mb-3" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Audit is now law.
            </p>
            <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.35 }}>
              EU AI Act, SOC 2, GxP, MiFID II. Every AI decision must be explainable, signed, replayable.
            </p>
          </div>
        </div>
        <p className="mt-14 font-bold" style={{ fontSize: 28, color: TEXT, maxWidth: 1300, lineHeight: 1.3 }}>
          The market has a chat surface and an audit deadline. Nothing bridges the two.
        </p>
      </div>
    </Slide>
  );
}

// ─── 05 · MARKET VALIDATION ─────────────────────────────────────────────────
function S05Validation({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Market Validation" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-16" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          The cost is already showing up.
        </h2>
        <div className="grid grid-cols-3 gap-10">
          {[
            { v: "€550K", l: "average yearly rework cost per mid-size org", sub: "from undefined AI context — measured across pilots" },
            { v: "73%",   l: "of AI outputs reworked before they ship",       sub: "operators escalate to senior staff to clean up" },
            { v: "6",     l: "regulated verticals validated to date",         sub: "pharma, banking, AEC, space, advisory, gov" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-black" style={{ fontSize: 110, lineHeight: 0.95, color: `hsl(${ACCENT})`, letterSpacing: "-0.04em" }}>
                {s.v}
              </div>
              <p className="font-bold mt-4" style={{ fontSize: 22, color: TEXT, lineHeight: 1.25 }}>{s.l}</p>
              <p className="mt-2" style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 06 · MARKET SIZE ────────────────────────────────────────────────────────
function S06Market({ n, t }: { n: number; t: number }) {
  const tiers = [
    { v: "$280B",  l: "AI software market",        s: "Total Available Market",     c: SUBTLE, w: 100 },
    { v: "$48B",   l: "AI governance & ops",       s: "Serviceable Available Market", c: ACCENT, w: 65 },
    { v: "$4.2B",  l: "Standards-engine wedge",    s: "Initial Market Share",       c: GREEN,  w: 28 },
  ];
  return (
    <Slide section="Market Size" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-16" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          The window opens here.
        </h2>
        <div className="flex flex-col gap-8">
          {tiers.map((tier) => (
            <div key={tier.l} className="flex items-center gap-10">
              <div className="flex-shrink-0" style={{ width: 320 }}>
                <div className="font-black" style={{ fontSize: 88, lineHeight: 0.95, color: `hsl(${tier.c})`, letterSpacing: "-0.04em" }}>
                  {tier.v}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold mb-2" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>{tier.l}</p>
                <p className="font-mono uppercase tracking-[0.18em] mb-3" style={{ fontSize: 14, color: SUBTLE }}>{tier.s}</p>
                <div className="rounded-full" style={{ height: 14, background: CARD_ALT }}>
                  <div className="h-full rounded-full" style={{ width: `${tier.w}%`, background: `hsl(${tier.c})` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 07 · PRODUCT ────────────────────────────────────────────────────────────
function S07Product({ n, t }: { n: number; t: number }) {
  const steps = [
    { k: "1", h: "Operator asks", v: "A prompt arrives. It looks like ChatGPT." },
    { k: "2", h: "System locks", v: "LIZA matches it to a playbook and compiles typed standards into context." },
    { k: "3", h: "Receipt issued", v: "Output ships with a signed, hash-chained, replayable record." },
  ];
  return (
    <Slide section="Product" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-14" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Three steps. <span style={{ color: `hsl(${GREEN})` }}>Same chat box.</span>
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.k} className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="font-black mb-4" style={{ fontSize: 88, lineHeight: 0.9, color: `hsl(${GREEN})`, letterSpacing: "-0.04em" }}>
                {s.k}
              </div>
              <p className="font-black mb-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{s.h}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.35 }}>{s.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 font-mono uppercase tracking-[0.2em]" style={{ fontSize: 15, color: MUTED }}>
          The interface looks ordinary. The control plane underneath is the product.
        </p>
      </div>
    </Slide>
  );
}

// ─── 08 · BUSINESS MODEL ─────────────────────────────────────────────────────
function S08BusinessModel({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Business Model" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-14" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Metered per <span style={{ color: `hsl(${GREEN})` }}>governed decision.</span>
        </h2>
        <div className="grid grid-cols-3 gap-10 mb-10">
          {[
            { v: "€0.40", l: "platform price per governed decision" },
            { v: "€23",   l: "manual labour cost it displaces" },
            { v: "95%",   l: "platform gross margin at steady state" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-black" style={{ fontSize: 132, lineHeight: 0.9, color: TEXT, letterSpacing: "-0.045em" }}>
                {s.v}
              </div>
              <p className="mt-4" style={{ fontSize: 20, color: MUTED, lineHeight: 1.3 }}>{s.l}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-6" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
          <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
            Customers move spend from headcount (CapEx of expertise) to metered tokens tied to a standard. Every receipt is a billable unit and an audit artefact at the same time.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 09 · TRACTION / ADOPTION ───────────────────────────────────────────────
function S09Adoption({ n, t }: { n: number; t: number }) {
  const channels = [
    { h: "Hero vertical",  v: "AEC", sub: "Nemetschek-scale partner in pipeline. Pattern repeats into pharma, banking, space." },
    { h: "Geography",      v: "DACH", sub: "Regulated, audit-first market. 4-step founder-led outreach to Heads of AI." },
    { h: "Install motion", v: "30 days", sub: "Co-build sprint, metered from Day 31. Self-serve PLG behind the wedge." },
    { h: "Network",        v: "Architects", sub: "Trained delivery partners deploy standards. Margin on top of platform." },
  ];
  return (
    <Slide section="Adoption" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-14" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          One wedge. <span style={{ color: `hsl(${ACCENT})` }}>Four channels.</span>
        </h2>
        <div className="grid grid-cols-2 gap-8">
          {channels.map((c) => (
            <div key={c.h} className="flex items-baseline gap-8">
              <div className="font-mono uppercase tracking-[0.22em] flex-shrink-0" style={{ fontSize: 14, color: SUBTLE, width: 180 }}>
                {c.h}
              </div>
              <div className="flex-1">
                <p className="font-black" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>{c.v}</p>
                <p className="mt-2" style={{ fontSize: 19, color: MUTED, lineHeight: 1.35 }}>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 10 · COMPETITION ────────────────────────────────────────────────────────
function S10Competition({ n, t }: { n: number; t: number }) {
  const rivals = [
    { who: "ChatGPT, Copilot, Gemini", what: "Chat surface. No standards. No signed receipt. No memory across sessions." },
    { who: "RAG copilots (Glean, Guru)", what: "Search-and-stuff. Retrieval is not governance. No replayable audit chain." },
    { who: "Workflow tools (n8n, Zapier)", what: "Brittle macros built by one person. No typed knowledge. No compounding." },
    { who: "Internal builds",             what: "Two engineers, one Notion page, breaks at Q2. The buyer has tried this." },
  ];
  return (
    <Slide section="Competition" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-12" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          What the market sells today.
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          {rivals.map((r, i) => (
            <div
              key={r.who}
              className="grid grid-cols-[1fr_2fr] gap-10 px-8 py-6"
              style={{
                background: i % 2 === 0 ? "transparent" : CARD_ALT,
                borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}`,
              }}
            >
              <p className="font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.2, letterSpacing: "-0.015em" }}>{r.who}</p>
              <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.35 }}>{r.what}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 font-bold" style={{ fontSize: 26, color: TEXT }}>
          None of them ship a <span style={{ color: `hsl(${GREEN})` }}>signed, replayable standard</span> behind every output.
        </p>
      </div>
    </Slide>
  );
}

// ─── 11 · COMPETITIVE ADVANTAGES ────────────────────────────────────────────
function S11Edge({ n, t }: { n: number; t: number }) {
  const edges = [
    { h: "Standards engine",    v: "Typed knowledge compiled into every call. Not retrieved, assembled." },
    { h: "Signed receipts",     v: "Hash-chained, replayable proof per decision. Audit substrate, not log line." },
    { h: "Closed loop",         v: "Every receipt feeds the graph. Standards improve with use, not decay." },
    { h: "Sovereignty",         v: "Customer owns the bundles. Portable schema. Zero vendor lock-in." },
    { h: "Architect network",   v: "Trained delivery partners. Scales without scaling the founder." },
    { h: "Regulated-first",     v: "Built for EU AI Act, SOC 2, GxP, MiFID II from day one." },
  ];
  return (
    <Slide section="Competitive Advantage" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-12" style={{ fontSize: 76, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Six things they can't ship in a quarter.
        </h2>
        <div className="grid grid-cols-3 gap-7">
          {edges.map((e) => (
            <div key={e.h} className="rounded-xl p-6" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-black mb-3" style={{ fontSize: 24, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.015em" }}>{e.h}</p>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>{e.v}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 12 · TEAM ───────────────────────────────────────────────────────────────
function S12Team({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Team" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-12" style={{ fontSize: 88, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Practitioners, not theorists.
        </h2>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 14, color: SUBTLE }}>Founder</p>
            <p className="font-black mb-4" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              15+ years
            </p>
            <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.4 }}>
              shipping data and AI architecture into production at enterprise scale. Operator, not consultant. The methodology is the muscle memory.
            </p>
          </div>
          <div>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 14, color: SUBTLE }}>Delivery network</p>
            <p className="font-black mb-4" style={{ fontSize: 44, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Architect partners
            </p>
            <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.4 }}>
              Trained delivery firms install LIZA inside regulated customers. The platform scales without scaling the team.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── 13 · THE ASK ────────────────────────────────────────────────────────────
function S13Ask({ n, t }: { n: number; t: number }) {
  const uses = [
    { v: "40%", l: "Product & platform engineering" },
    { v: "35%", l: "DACH GTM and Architect network" },
    { v: "25%", l: "Regulated-vertical certifications" },
  ];
  return (
    <Slide section="The Ask" n={n} total={t} dark>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-8" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          Seed Round
        </p>
        <h2 className="font-black mb-14" style={{ fontSize: 156, lineHeight: 0.9, color: "hsl(0 0% 98%)", letterSpacing: "-0.05em" }}>
          €2M
        </h2>
        <div className="grid grid-cols-3 gap-10 mb-12">
          {uses.map((u) => (
            <div key={u.l}>
              <div className="font-black" style={{ fontSize: 64, lineHeight: 0.95, color: "hsl(0 0% 98%)", letterSpacing: "-0.035em" }}>
                {u.v}
              </div>
              <p className="mt-3" style={{ fontSize: 20, color: "hsl(0 0% 70%)", lineHeight: 1.3 }}>{u.l}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-5" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
          <p className="font-mono uppercase tracking-[0.2em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Milestone to Series A</p>
          <p style={{ fontSize: 24, color: "hsl(0 0% 92%)", lineHeight: 1.35 }}>
            10 anchor customers across 3 regulated verticals. €2M ARR. Architect network live in DACH and UK.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 14 · CLOSING ────────────────────────────────────────────────────────────
function S14Close({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <h2 className="font-black" style={{ fontSize: 104, lineHeight: 1.0, color: "hsl(0 0% 98%)", letterSpacing: "-0.04em" }}>
          The chat surface is a commodity.
          <br />
          <span style={{ color: `hsl(${GREEN})` }}>The system around it is the company.</span>
        </h2>
        <p className="mt-14 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 16, color: "hsl(0 0% 65%)" }}>
          Thank you · let's build the production system
        </p>
      </div>
    </Slide>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const RAW_SLIDES: { id: string; title: string; render: (n: number, t: number) => React.ReactNode }[] = [
  { id: "cover",       title: "Cover",                  render: (n, t) => <S01Cover n={n} t={t} /> },
  { id: "problem",     title: "Problem",                render: (n, t) => <S02Problem n={n} t={t} /> },
  { id: "solution",    title: "Solution",               render: (n, t) => <S03Solution n={n} t={t} /> },
  { id: "why-now",     title: "Why Now",                render: (n, t) => <S04WhyNow n={n} t={t} /> },
  { id: "validation",  title: "Market Validation",      render: (n, t) => <S05Validation n={n} t={t} /> },
  { id: "market",      title: "Market Size",            render: (n, t) => <S06Market n={n} t={t} /> },
  { id: "product",     title: "Product",                render: (n, t) => <S07Product n={n} t={t} /> },
  { id: "model",       title: "Business Model",         render: (n, t) => <S08BusinessModel n={n} t={t} /> },
  { id: "adoption",    title: "Adoption",               render: (n, t) => <S09Adoption n={n} t={t} /> },
  { id: "competition", title: "Competition",            render: (n, t) => <S10Competition n={n} t={t} /> },
  { id: "edge",        title: "Competitive Advantage",  render: (n, t) => <S11Edge n={n} t={t} /> },
  { id: "team",        title: "Team",                   render: (n, t) => <S12Team n={n} t={t} /> },
  { id: "ask",         title: "The Ask · €2M Seed",     render: (n, t) => <S13Ask n={n} t={t} /> },
  { id: "close",       title: "Closing",                render: (n, t) => <S14Close n={n} t={t} /> },
];

const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      {s.render(i + 1, RAW_SLIDES.length)}
    </SlideIndexProvider>
  ),
}));

// ─── Deck shell (same pattern as FactoryDeck) ────────────────────────────────
export default function SeedPitchDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Pitch" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Seed Pitch</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            Airbnb-style · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Seed-Pitch" slideCount={SLIDES.length} variant="desktop" />
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
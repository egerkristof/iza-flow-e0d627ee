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
  const stats = [
    { v: "€0.40", l: "per governed decision" },
    { v: "95%",   l: "platform gross margin" },
    { v: "€23",   l: "displaced labour cost / decision" },
  ];
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
        <p className="mt-8" style={{ fontSize: 22, lineHeight: 1.45, color: "hsl(0 0% 60%)", maxWidth: 1100 }}>
          Every knowledge worker became a brilliant artisan with ChatGPT. The method dies with the session. That is the disease. LIZA is the line.
        </p>
        <div className="mt-16 flex items-center gap-14">
          {stats.map((s, i) => (
            <React.Fragment key={s.l}>
              {i > 0 && <div className="w-px h-12" style={{ background: "hsl(0 0% 100% / 0.15)" }} />}
              <div className="text-center">
                <div className="font-black" style={{ fontSize: 54, lineHeight: 0.95, color: "hsl(0 0% 98%)", letterSpacing: "-0.03em" }}>{s.v}</div>
                <p className="mt-2 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: "hsl(0 0% 55%)" }}>{s.l}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
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
    { l: "Every prompt is hand-crafted.",       r: "Same question, two operators, two answers." },
    { l: "Every output ships unsigned.",        r: "No record of which standard, data or model produced it." },
    { l: "Every workflow dies at tab close.",   r: "Method, reasoning, fix — gone. Monday restarts from zero." },
  ];
  const defects = ["wrong honorific", "stale timeline", "fabricated 30% savings", "missing attachment", "wrong SLA", "no audit trail"];
  return (
    <Slide section="Problem" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-10" style={{ fontSize: 76, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Companies run AI like a{" "}
          <span style={{ color: `hsl(${RED})` }}>workshop of artisans.</span>
        </h2>
        <div className="rounded-2xl overflow-hidden mb-10" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          {lines.map((row, i) => (
            <div
              key={row.l}
              className="grid grid-cols-[1fr_1fr] items-center px-8 py-6"
              style={{
                background: i % 2 === 0 ? "transparent" : CARD_ALT,
                borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}`,
              }}
            >
              <div className="flex items-baseline gap-5">
                <span className="font-mono font-black" style={{ fontSize: 22, color: `hsl(${RED})` }}>×</span>
                <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{row.l}</p>
              </div>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.3 }}>{row.r}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <div className="font-mono uppercase tracking-[0.22em] whitespace-nowrap" style={{ fontSize: 13, color: `hsl(${RED})` }}>
            1 email · 6 defects shipped
          </div>
          <div className="flex flex-wrap gap-2">
            {defects.map((d) => (
              <span key={d} className="font-mono px-3 py-1 rounded-md" style={{ fontSize: 14, color: TEXT, background: `hsl(${RED} / 0.08)`, border: `1px solid hsl(${RED} / 0.3)` }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── 03 · SOLUTION ───────────────────────────────────────────────────────────
function S03Solution({ n, t }: { n: number; t: number }) {
  const items = [
    {
      k: "LOCK",
      v: "Every prompt locks to a playbook.",
      d: "Playbook = a versioned, named company method. \"How we price an enterprise quote.\" \"How we draft a clinical summary.\" Not a prompt template — an executable standard.",
    },
    {
      k: "COMPILE",
      v: "Typed standards compile into context, per call.",
      d: "Typed standards = your company policies, best-practice procedures, decision rules, approved data. Compiled fresh into the model for every call, not retrieved blindly.",
    },
    {
      k: "SIGN",
      v: "Every output ships with a signed receipt.",
      d: "Receipt = a cryptographically signed, hash-chained record of which playbook, standards, data and model produced the output. Replayable. Auditable. The unit of trust.",
    },
  ];
  return (
    <Slide section="Solution" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-8" style={{ fontSize: 68, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          We run a{" "}
          <span style={{ color: `hsl(${GREEN})` }}>system around the model.</span>
        </h2>
        <div className="grid grid-cols-3 gap-7 mb-6">
          {items.map((i) => (
            <div key={i.k} className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.04)` }}>
              <div className="font-mono font-black uppercase tracking-[0.2em] mb-3" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>
                {i.k}
              </div>
              <p className="font-bold mb-4" style={{ fontSize: 22, color: TEXT, lineHeight: 1.2 }}>{i.v}</p>
              <div className="mt-auto pt-3" style={{ borderTop: `1px solid hsl(${GREEN} / 0.25)` }}>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{i.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-6" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
          <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
            Every signed receipt feeds back into the graph. Standards improve with every call. <span style={{ color: `hsl(${GREEN})` }}>The factory learns.</span>
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 04 · WHY NOW ────────────────────────────────────────────────────────────
function S04WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Why Now" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-12" style={{ fontSize: 76, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Three shifts. <span style={{ color: `hsl(${ACCENT})` }}>One collision.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-8" style={{ fontSize: 14, color: MUTED }}>
          Shifts 1 &amp; 3 push AI into every workflow. Shift 2 demands governance. Companies are still artisanal.
        </p>
        <div className="grid grid-cols-3 gap-7">
          <div className="rounded-2xl p-7" style={{ background: CARD_ALT, borderLeft: `6px solid hsl(${ACCENT})` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>
              Shift 1
            </p>
            <p className="font-black mb-3" style={{ fontSize: 34, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              AI is in every workflow.
            </p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>
              ChatGPT, Copilot, Gemini are inside every team. Adoption is solved. Governance is not.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: CARD_ALT, borderLeft: `6px solid hsl(${GOLD})` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
              Shift 2
            </p>
            <p className="font-black mb-3" style={{ fontSize: 34, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Compliance is now law.
            </p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>
              EU AI Act, SOC 2, GxP, MiFID II. Every AI decision must be explainable, signed, replayable.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: CARD_ALT, borderLeft: `6px solid hsl(${GREEN})` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
              Shift 3
            </p>
            <p className="font-black mb-3" style={{ fontSize: 34, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              AI pricing is going metered.
            </p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>
              Copilot pay-as-you-go GA 2025. Anthropic usage tiers. Bedrock per-token. Every AI call becomes a P&L line.
            </p>
          </div>
        </div>
        <p className="mt-12 font-bold" style={{ fontSize: 26, color: TEXT, maxWidth: 1400, lineHeight: 1.35 }}>
          Chat surface. Audit deadline. Metered bill. Nothing on the market bridges the three. We are the layer that makes those tokens defensible.
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
        <h2 className="font-black mb-3" style={{ fontSize: 64, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          The cost is already showing up.
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4, maxWidth: 1400 }}>
          The €550K is just the rework tax. The full bill stacks four ways.
        </p>
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="rounded-2xl p-8" style={{ background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.25)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${RED})` }}>
              Layer 1 · Rework tax (quantified today)
            </p>
            <div className="font-black" style={{ fontSize: 84, lineHeight: 0.95, color: `hsl(${RED})`, letterSpacing: "-0.04em" }}>€550K</div>
            <p className="font-bold mt-2" style={{ fontSize: 20, color: TEXT, lineHeight: 1.25 }}>per year, per 100 knowledge workers.</p>
            <p className="mt-2 font-mono" style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
              4 h/week × €55/h × 46 wks × 100 = €1.01M raw, discounted 46% to €550K.<br/>
              HBR &amp; McKinsey 2024 rework data.
            </p>
            <div className="mt-5 pt-4 grid grid-cols-3 gap-3" style={{ borderTop: `1px solid hsl(${RED} / 0.25)` }}>
              <div>
                <p className="font-mono uppercase tracking-[0.18em] mb-1" style={{ fontSize: 11, color: `hsl(${RED})` }}>Layer 2</p>
                <p className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.25 }}>Lost knowledge</p>
                <p className="mt-1" style={{ fontSize: 12, color: MUTED, lineHeight: 1.35 }}>Method dies with the tab.</p>
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.18em] mb-1" style={{ fontSize: 11, color: `hsl(${RED})` }}>Layer 3</p>
                <p className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.25 }}>Sovereignty leak</p>
                <p className="mt-1" style={{ fontSize: 12, color: MUTED, lineHeight: 1.35 }}>Crown-jewel IP pasted into public LLMs.</p>
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.18em] mb-1" style={{ fontSize: 11, color: `hsl(${RED})` }}>Layer 4</p>
                <p className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.25 }}>Token bill</p>
                <p className="mt-1" style={{ fontSize: 12, color: MUTED, lineHeight: 1.35 }}>Metered AI scales linearly with usage.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
              First production deployment · AEC (anonymized)
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="font-black" style={{ fontSize: 64, lineHeight: 0.95, color: `hsl(${GREEN})`, letterSpacing: "-0.035em" }}>127</div>
                <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>standards encoded</p>
              </div>
              <div>
                <div className="font-black" style={{ fontSize: 64, lineHeight: 0.95, color: `hsl(${GREEN})`, letterSpacing: "-0.035em" }}>3.4K</div>
                <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>governed decisions / month</p>
              </div>
              <div>
                <div className="font-black" style={{ fontSize: 64, lineHeight: 0.95, color: `hsl(${GREEN})`, letterSpacing: "-0.035em" }}>62%</div>
                <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>time-to-spec drop</p>
              </div>
            </div>
            <p className="mt-6 font-bold" style={{ fontSize: 19, color: TEXT, lineHeight: 1.35 }}>
              CTO-sponsored. Pattern repeats into pharma, banking, space.
            </p>
          </div>
        </div>
        <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 14, color: SUBTLE }}>
          6 regulated verticals scoped · pharma · banking · AEC · space · advisory · public sector
        </p>
      </div>
    </Slide>
  );
}

// ─── 06 · PRODUCT ────────────────────────────────────────────────────────────
function S07Product({ n, t }: { n: number; t: number }) {
  const steps = [
    { k: "1", h: "Operator asks", v: "A prompt arrives. The surface looks like ChatGPT — that is the point. Zero behavioural change for the user." },
    { k: "2", h: "System locks to a playbook", v: "LIZA matches the intent to a versioned company playbook (\"price an enterprise quote\"), then compiles the typed standards — policies, procedures, decision rules, approved data — fresh into the model for that call." },
    { k: "3", h: "Signed receipt issued", v: "Output ships with a hash-chained, cryptographically signed record of which playbook, standards, data and model produced it. Replayable by any auditor in one click." },
  ];
  return (
    <Slide section="Product" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 13, color: SUBTLE }}>Product</p>
        <h2 className="font-black mb-10" style={{ fontSize: 64, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1500 }}>
          The interface looks ordinary. <span style={{ color: `hsl(${GREEN})` }}>The control plane underneath is the product.</span>
        </h2>
        <div className="grid grid-cols-3 gap-7 mb-8">
          {steps.map((s) => (
            <div key={s.k} className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="font-black mb-3" style={{ fontSize: 72, lineHeight: 0.9, color: `hsl(${GREEN})`, letterSpacing: "-0.04em" }}>
                {s.k}
              </div>
              <p className="font-black mb-3" style={{ fontSize: 26, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{s.h}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-6" style={{ background: "hsl(222 25% 8%)", border: `1px solid hsl(${GREEN} / 0.3)` }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
            One real signed receipt
          </p>
          <p className="font-mono" style={{ fontSize: 16, color: "hsl(0 0% 88%)", lineHeight: 1.55, wordBreak: "break-all" }}>
            liza://call/7f2c91ae · operator: a.morales@client · outcome: pricing.quote.enterprise<br/>
            standards: [STD-4471@v17, STD-1208@v04] · model: gpt-4o · prompt_hash: 9b…c2<br/>
            parent_hash: 41…d8 · signed: ed25519:b0c4…ffa1 · ts: 2026-05-14T09:42Z
          </p>
          <p className="mt-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>
            Not a log line. A hash-chained, replayable record. The auditor reads the same receipt the operator ran.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 07 · BUSINESS MODEL ─────────────────────────────────────────────────────
function S08BusinessModel({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Business Model" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 64, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Three layers. <span style={{ color: `hsl(${GREEN})` }}>One meter.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, lineHeight: 1.4, maxWidth: 1400 }}>
          A platform fee carries the learning layer. Metered decisions monetise usage. Enterprise tier prices the deep audit surface.
        </p>
        <div className="grid grid-cols-3 gap-7 mb-7">
          <div className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: SUBTLE }}>Platform fee</p>
            <div className="font-black" style={{ fontSize: 56, lineHeight: 0.95, color: TEXT, letterSpacing: "-0.035em" }}>per seat</div>
            <p className="mt-3" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>
              Funds the learning layer: playbooks, the standards graph, the receipt store. The factory itself.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Metered usage</p>
            <div className="font-black" style={{ fontSize: 72, lineHeight: 0.9, color: `hsl(${GREEN})`, letterSpacing: "-0.04em" }}>€0.40<span style={{ fontSize: 22, color: MUTED, marginLeft: 8 }}>est. avg</span></div>
            <p className="mt-3" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>
              Per governed decision. Indicative blend across verticals — final pricing tuned per workload. Displaces €23 of manual labour.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: SUBTLE }}>Enterprise tier</p>
            <div className="font-black" style={{ fontSize: 56, lineHeight: 0.95, color: TEXT, letterSpacing: "-0.035em" }}>annual</div>
            <p className="mt-3" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>
              Advanced audit: regulator-grade replay, SSO, residency, custom standards engines, advisory access.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10 mb-5">
          {[
            { v: "95%", l: "platform gross margin at steady state" },
            { v: "<6mo", l: "payback at typical enterprise volume" },
            { v: "2×",  l: "billable unit and audit artefact at once" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-black" style={{ fontSize: 64, lineHeight: 0.9, color: TEXT, letterSpacing: "-0.04em" }}>
                {s.v}
              </div>
              <p className="mt-2" style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{s.l}</p>
            </div>
          ))}
        </div>
        <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: SUBTLE }}>
          $4.2B standards-engine wedge inside a $48B AI governance market
        </p>
      </div>
    </Slide>
  );
}

// ─── 08 · TRACTION / ADOPTION ───────────────────────────────────────────────
function S09Adoption({ n, t }: { n: number; t: number }) {
  const rows = [
    {
      h: "Wedge",
      v: "€15K · 30 days",
      sub: "AgOps Design Sprint. Standing line in 30 days. Metered from Day 31. First production deployment: 127 standards, 3,400+ decisions/month, 62% time-to-spec drop.",
    },
    {
      h: "Geography",
      v: "DACH first",
      sub: "Regulated, audit-first market. 4-step founder-led outreach to Heads of AI. Pattern then repeats into UK and Benelux.",
    },
    {
      h: "Scale lever",
      v: "PLG self-serve",
      sub: "30-day sprint becomes a guided wizard. Funded by this round. Removes the founder from the install path.",
    },
    {
      h: "Network",
      v: "Architects",
      sub: "Trained delivery partners deploy standards inside regulated customers. Margin on top of platform. Scales without scaling the team.",
    },
  ];
  return (
    <Slide section="Adoption" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-10" style={{ fontSize: 64, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1500 }}>
          <span style={{ color: `hsl(${ACCENT})` }}>€15K sprint.</span> 30 days to a running line. Metered from Day 31.
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          {rows.map((c, i) => (
            <div
              key={c.h}
              className="grid grid-cols-[180px_280px_1fr] gap-8 px-7 py-5 items-baseline"
              style={{
                background: i % 2 === 0 ? "transparent" : CARD_ALT,
                borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}`,
              }}
            >
              <div className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: SUBTLE }}>{c.h}</div>
              <div className="font-black" style={{ fontSize: 32, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>{c.v}</div>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 09 · COMPETITION + EDGE (merged) ───────────────────────────────────────
function S10Competition({ n, t }: { n: number; t: number }) {
  const rivals = [
    { who: "ChatGPT, Copilot, Gemini",   what: "Chat surface. No standards. No signed receipt. No memory across sessions." },
    { who: "RAG copilots (Glean, Guru)", what: "Search-and-stuff. Retrieval is not governance. No replayable audit chain." },
    { who: "Workflow tools (n8n, Zapier)", what: "Brittle macros built by one person. No typed knowledge. No compounding." },
    { who: "Internal builds",            what: "Two engineers, one Notion page, breaks at Q2. The buyer has tried this." },
  ];
  const edges = [
    { h: "Standards engine", v: "Context compiled, not retrieved." },
    { h: "Signed receipts",  v: "Hash-chained, replayable, audit-native." },
    { h: "Closed loop",      v: "Every receipt improves the standards." },
  ];
  return (
    <Slide section="Competition + Edge" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-8" style={{ fontSize: 64, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em" }}>
          Same surface. <span style={{ color: `hsl(${GREEN})` }}>Different category of software.</span>
        </h2>
        <div className="rounded-2xl overflow-hidden mb-7" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          {rivals.map((r, i) => (
            <div
              key={r.who}
              className="grid grid-cols-[1fr_2fr] gap-8 px-7 py-4"
              style={{
                background: i % 2 === 0 ? "transparent" : CARD_ALT,
                borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}`,
              }}
            >
              <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.2, letterSpacing: "-0.015em" }}>{r.who}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>{r.what}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {edges.map((e) => (
            <div key={e.h} className="rounded-xl p-5" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>{e.h}</p>
              <p className="font-bold" style={{ fontSize: 19, color: TEXT, lineHeight: 1.3 }}>{e.v}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── 10 · TEAM ───────────────────────────────────────────────────────────────
function S12Team({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Team" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-12" style={{ fontSize: 76, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.04em" }}>
          Practitioners, not theorists.
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: SUBTLE }}>Founders</p>
            <p className="font-black mb-3" style={{ fontSize: 36, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              15+ years
            </p>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>
              Shipping data and AI architecture into production at enterprise scale. Operators, not consultants. The methodology is the muscle memory.
            </p>
          </div>
          <div>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: SUBTLE }}>Delivery network</p>
            <p className="font-black mb-3" style={{ fontSize: 36, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Architect partners
            </p>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>
              Trained delivery firms install LIZA inside regulated customers. The platform scales without scaling the team.
            </p>
          </div>
          <div className="rounded-2xl p-6" style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>Advisory bench</p>
            <p className="font-black mb-3" style={{ fontSize: 36, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Regulated CTOs
            </p>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>
              Active advisors from AEC software incumbents, pharma compliance, and tier-one consulting. The buyers of the next 18 months sit on our advisory bench.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── 11 · THE ASK ────────────────────────────────────────────────────────────
function S13Ask({ n, t }: { n: number; t: number }) {
  const uses = [
    { v: "60%", l: "Self-serve install productisation" },
    { v: "25%", l: "AEC depth + 2 adjacent verticals" },
    { v: "15%", l: "Metered billing, telemetry, standards engine" },
  ];
  return (
    <Slide section="The Ask" n={n} total={t} dark>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-8" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          Seed Round
        </p>
        <h2 className="font-black mb-12" style={{ fontSize: 156, lineHeight: 0.9, color: "hsl(0 0% 98%)", letterSpacing: "-0.05em" }}>
          €2M
        </h2>
        <div className="grid grid-cols-3 gap-10 mb-10">
          {uses.map((u) => (
            <div key={u.l}>
              <div className="font-black" style={{ fontSize: 64, lineHeight: 0.95, color: "hsl(0 0% 98%)", letterSpacing: "-0.035em" }}>
                {u.v}
              </div>
              <p className="mt-3" style={{ fontSize: 19, color: "hsl(0 0% 70%)", lineHeight: 1.35 }}>{u.l}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-8 py-5 mb-6" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>Milestone to Series A</p>
          <p style={{ fontSize: 22, color: "hsl(0 0% 92%)", lineHeight: 1.4 }}>
            €3M ARR by month 18. 50% self-serve. AEC pattern proven. Two adjacent regulated verticals validated through partners.
          </p>
        </div>
        <p className="font-black" style={{ fontSize: 32, color: "hsl(0 0% 98%)", letterSpacing: "-0.02em" }}>
          Models commoditise. <span style={{ color: `hsl(${GREEN})` }}>Factories compound.</span>
        </p>
      </div>
    </Slide>
  );
}

// ─── 12 · CLOSING ────────────────────────────────────────────────────────────
function S14Close({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="LIZA OS" n={n} total={t} dark>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 text-center">
        <h2 className="font-black" style={{ fontSize: 92, lineHeight: 1.05, color: "hsl(0 0% 98%)", letterSpacing: "-0.04em", maxWidth: 1500 }}>
          Every receipt that ships<br/>
          <span style={{ color: `hsl(${GREEN})` }}>makes the factory smarter.</span>
        </h2>
        <p className="mt-10" style={{ fontSize: 28, color: "hsl(0 0% 75%)", maxWidth: 1300, lineHeight: 1.35 }}>
          The question is whether yours is running.
        </p>
        <p className="mt-14 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 14, color: "hsl(0 0% 60%)" }}>
          Book a 30-Day Sprint · founder@lizaos.ai
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
  { id: "product",     title: "Product",                render: (n, t) => <S07Product n={n} t={t} /> },
  { id: "model",       title: "Business Model",         render: (n, t) => <S08BusinessModel n={n} t={t} /> },
  { id: "adoption",    title: "Adoption",               render: (n, t) => <S09Adoption n={n} t={t} /> },
  { id: "competition", title: "Competition + Edge",     render: (n, t) => <S10Competition n={n} t={t} /> },
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
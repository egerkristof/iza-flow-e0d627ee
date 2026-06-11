import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3, Network, ShieldCheck, UserCog, FileSearch, RefreshCw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideIndexProvider, SlideGrid, SlideBar, PageNumber, Footer, Tag,
  TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  GREEN, BG, ACCENT, RED, GOLD, PURPLE,
} from "@/pages/TechDDDeck";

// ═════════════════════════════════════════════════════════════════════════════
// INVESTOR THESIS DECK — 6 slides. Council v2.
// Known frame vs Unknown frame → Four investable layers → What good infra
// looks like → Competitive map → Human-first is the moat → Valuation logic.
// ═════════════════════════════════════════════════════════════════════════════

const ACTS = [
  { short: "Reframe" },
  { short: "The Bet" },
  { short: "Infra Spec" },
  { short: "Map" },
  { short: "Moat" },
  { short: "Valuation" },
];

function ActRail({ index }: { index: number }) {
  return (
    <div className="absolute z-30 flex items-center gap-4" style={{ top: 24, left: 96, right: 96, height: 44 }}>
      <span className="font-mono uppercase tracking-[0.3em] font-bold whitespace-nowrap" style={{ fontSize: 11, color: `hsl(${ACCENT})` }}>
        LIZA OS Investor Thesis
      </span>
      <div className="flex-1 grid grid-cols-6 gap-2">
        {ACTS.map((a, i) => {
          const active = i === index;
          const past = i < index;
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-[3px] rounded-full" style={{
                background: active ? `hsl(${ACCENT})` : past ? `hsl(${ACCENT} / 0.35)` : CHROME_BORDER,
              }} />
              <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden" style={{ opacity: active ? 1 : 0.5 }}>
                <span className="font-mono" style={{ fontSize: 10, color: MUTED, letterSpacing: "0.08em" }}>0{i + 1}</span>
                <span className="font-bold" style={{ fontSize: 11, color: active ? TEXT : MUTED }}>{a.short}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full" style={{ background: BG, color: TEXT }}>
      <SlideGrid />
      <PageNumber />
      {children}
      <SlideBar />
    </div>
  );
}

// ─── Slide 01 · Known frame vs Unknown frame ────────────────────────────────
function S1Reframe() {
  const rows = [
    { k: "What you put money into", pre: "Models. Vertical apps. Copilots. Services firms wrapped around them.",      post: "The part of the company that has to keep working no matter which model wins." },
    { k: "Why it can be priced",    pre: "There is a comp set. Multiples are known.",                                  post: "No comp set yet. You are pricing the team that can actually build this part." },
    { k: "What you are betting on", pre: "The product wins its category.",                                             post: "The team holds the firm core steady while everything else around it keeps changing." },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Reframe" />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 58, lineHeight: 1.06, color: TEXT, marginBottom: 0, maxWidth: 1680 }}>
          What is worth investing in now is the part that has to work inside the enterprise.
        </h1>
      </div>

      <div className="absolute" style={{ left: 112, right: 112, top: 360 }}>
        <div className="grid grid-cols-[240px_1fr_1fr] gap-0 rounded-2xl overflow-hidden border" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <div className="px-7 py-6 font-bold uppercase tracking-[0.18em]" style={{ fontSize: 14, color: SUBTLE, background: CARD_ALT }}>Dimension</div>
          <div className="px-8 py-6 font-bold uppercase tracking-[0.18em]" style={{ fontSize: 14, color: `hsl(${RED})`, background: "hsl(0 72% 50% / 0.05)", borderLeft: `1px solid ${CHROME_BORDER}` }}>Known world · Pre AI native</div>
          <div className="px-8 py-6 font-bold uppercase tracking-[0.18em]" style={{ fontSize: 14, color: `hsl(${GREEN})`, background: "hsl(155 72% 38% / 0.05)", borderLeft: `1px solid ${CHROME_BORDER}` }}>Unknown world · AI native</div>
          {rows.map((r, i) => (
            <React.Fragment key={r.k}>
              <div className="px-7 py-7 font-bold" style={{ fontSize: 24, color: TEXT, background: CARD_ALT, borderTop: `1px solid ${CHROME_BORDER}` }}>{r.k}</div>
              <div className="px-8 py-7" style={{ fontSize: 24, color: MUTED, borderLeft: `1px solid ${CHROME_BORDER}`, borderTop: `1px solid ${CHROME_BORDER}`, background: i % 2 ? "hsl(0 72% 50% / 0.03)" : "transparent" }}>{r.pre}</div>
              <div className="px-8 py-7 font-semibold" style={{ fontSize: 24, color: TEXT, borderLeft: `1px solid ${CHROME_BORDER}`, borderTop: `1px solid ${CHROME_BORDER}`, background: i % 2 ? "hsl(155 72% 38% / 0.04)" : "transparent" }}>{r.post}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <Footer text="The lens decides the valuation. Choose the lens first." />
    </SlideShell>
  );
}

// ─── Slide 02 · The Bet · Four investable layers ─────────────────────────────
function S2InfraBet() {
  const layers = [
    { name: "Models",               color: PURPLE, why: "Sits outside the customer. Capex war. Winner takes the table." },
    { name: "Apps and copilots",    color: GOLD,   why: "Sits outside the customer. Eaten by the next model release." },
    { name: "Services firms",       color: ACCENT, why: "Sits outside the customer. Scales linearly with humans for hire." },
    { name: "The enterprise core",  color: GREEN,  why: "Sits inside the customer. The company's own people are the scale unit. This is the only bet that compounds where it has to compound." },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Bet" />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 60, lineHeight: 1.06, color: TEXT, marginBottom: 14, maxWidth: 1680 }}>
          Three of these live outside the customer. Only one lives inside it.
        </h1>
        <p className="font-semibold" style={{ fontSize: 24, color: MUTED, maxWidth: 1600 }}>
          That inside part is what has to work for AI to actually run at scale in an enterprise. It is the only one that compounds where the work happens.
        </p>
      </div>

      <div className="absolute" style={{ left: 112, right: 112, top: 360 }}>
        <div className="flex flex-col gap-3">
          {layers.map((l, i) => {
            const us = i === layers.length - 1;
            return (
              <div key={l.name} className="grid grid-cols-[340px_1fr_auto] items-center gap-8 px-8 py-7 rounded-2xl border"
                style={{
                  borderColor: us ? `hsl(${l.color} / 0.45)` : CHROME_BORDER,
                  background: us ? `hsl(${l.color} / 0.06)` : BG,
                  boxShadow: us ? `0 8px 32px hsl(${l.color} / 0.12)` : "none",
                }}>
                <div className="font-bold" style={{ fontSize: 30, color: us ? `hsl(${l.color})` : TEXT }}>{l.name}</div>
                <div style={{ fontSize: 23, color: us ? TEXT : MUTED, fontWeight: us ? 600 : 400, lineHeight: 1.35 }}>{l.why}</div>
                {us && (
                  <div className="px-5 py-2 rounded-full font-bold uppercase tracking-[0.18em] whitespace-nowrap"
                    style={{ fontSize: 13, color: `hsl(${l.color})`, background: `hsl(${l.color} / 0.12)`, border: `1px solid hsl(${l.color} / 0.3)` }}>
                    Our bet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer text="The first three stay on our side of the boundary. The enterprise core lives on theirs." />
    </SlideShell>
  );
}

// ─── Slide 03 · What good infrastructure looks like ──────────────────────────
function S3InfraSpec() {
  const parts = [
    { icon: Network,     name: "One source of truth",        liza: "Knowledge graph",            why: "A single place where what the company knows and decides actually lives. So AI is not guessing every time." },
    { icon: ShieldCheck, name: "Rules of the house",         liza: "Governance layer",           why: "What is allowed, by whom, when. Encoded once so every AI action plays by them." },
    { icon: UserCog,     name: "The human stays in the loop",liza: "Oversight UX",               why: "The person works with AI on the same screen, without handing over their judgment." },
    { icon: FileSearch,  name: "A record of every decision", liza: "Decision log",               why: "The company can see how AI got to an answer, audit it, and learn from itself." },
    { icon: RefreshCw,   name: "Swap the model, keep the work", liza: "Model portability",       why: "Tomorrow's model plugs in. Yesterday's work, rules and knowledge do not get thrown away." },
    { icon: Unplug,      name: "Knowledge belongs to the company", liza: "Sovereignty",          why: "Not to the vendor. Not to the model provider. The company can walk and keep its asset." },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Enterprise Core" color={ACCENT} />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 60, lineHeight: 1.06, color: TEXT, marginBottom: 14 }}>
          What an AI native company has to have. Six things.
        </h1>
        <p className="font-semibold" style={{ fontSize: 24, color: MUTED, maxWidth: 1600 }}>
          Plain English on the left. The name we use for it in LIZA OS on the right. If any of these six is missing, you have a feature, not the foundation.
        </p>
      </div>

      <div className="absolute grid grid-cols-3 gap-5" style={{ left: 112, right: 112, top: 470 }}>
        {parts.map((p, i) => (
          <div key={p.name} className="rounded-2xl border px-7 py-6" style={{ borderColor: CHROME_BORDER, background: BG, minHeight: 230 }}>
            <div className="flex items-center gap-4">
              <div className="rounded-xl flex items-center justify-center"
                style={{ width: 56, height: 56, background: `hsl(${ACCENT} / 0.08)`, color: `hsl(${ACCENT})`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
                <p.icon size={28} strokeWidth={1.7} />
              </div>
              <div className="font-mono font-bold" style={{ fontSize: 14, color: SUBTLE, letterSpacing: "0.15em" }}>0{i + 1}</div>
            </div>
            <div className="font-bold" style={{ fontSize: 22, color: TEXT, marginTop: 14, lineHeight: 1.2 }}>{p.name}</div>
            <div className="font-mono uppercase tracking-[0.16em] font-bold" style={{ fontSize: 11, color: `hsl(${ACCENT})`, marginTop: 4 }}>
              LIZA OS · {p.liza}
            </div>
            <p style={{ fontSize: 17, color: MUTED, marginTop: 8, lineHeight: 1.4 }}>{p.why}</p>
          </div>
        ))}
      </div>
      <Footer text="These six are what we build. Together they are the enterprise core." />
    </SlideShell>
  );
}

// ─── Slide 04 · Four-Quadrant Map ────────────────────────────────────────────
function S4Map() {
  // axes: X = deployment model (services-led → self-serve), Y = human role (approver → co-author)
  const pts = [
    { name: "Wonderful",  x: 0.12, y: 0.20, color: GOLD,   note: "Forward-deployed engineers + McKinsey alliance. Agents replace humans." },
    { name: "Paradox",    x: 0.30, y: 0.78, color: PURPLE, note: "EU research-stage. Human-first clarity papers. Not in production." },
    { name: "Interloom",  x: 0.60, y: 0.38, color: ACCENT, note: "SME-led no-code back-office. Humans design and approve flows." },
    { name: "LIZA OS",    x: 0.85, y: 0.85, color: GREEN,  note: "Self-serve · human tacit knowledge is the input" },
  ];
  const PLOT = { left: 320, top: 460, w: 1280, h: 540 };
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Map" />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, marginBottom: 12 }}>
          The human role decides the moat. The quadrant top-right is open.
        </h1>
        <p className="font-semibold" style={{ fontSize: 24, color: MUTED, maxWidth: 1600 }}>
          Other infrastructure players solve scale to some degree. None of them design for the human as a co-author the system gets smarter from.
        </p>
      </div>

      {/* Y axis label */}
      <div className="absolute font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: SUBTLE, left: 130, top: PLOT.top - 30 }}>
        Human role: Co-author ↑
      </div>
      <div className="absolute font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: SUBTLE, left: 130, top: PLOT.top + PLOT.h - 8 }}>
        Human role: Approver ↓
      </div>
      {/* X axis labels */}
      <div className="absolute font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: SUBTLE, left: PLOT.left, top: PLOT.top + PLOT.h + 18 }}>
        ← Services-led
      </div>
      <div className="absolute font-bold uppercase tracking-[0.2em] text-right" style={{ fontSize: 13, color: SUBTLE, left: PLOT.left + PLOT.w - 200, top: PLOT.top + PLOT.h + 18, width: 200 }}>
        Self-serve →
      </div>

      {/* Plot area */}
      <div className="absolute rounded-2xl border" style={{
        left: PLOT.left, top: PLOT.top, width: PLOT.w, height: PLOT.h,
        borderColor: CHROME_BORDER, background: CARD_ALT,
        backgroundImage: `linear-gradient(${CHROME_BORDER} 1px, transparent 1px), linear-gradient(90deg, ${CHROME_BORDER} 1px, transparent 1px)`,
        backgroundSize: `${PLOT.w / 4}px ${PLOT.h / 4}px`,
      }}>
        {/* quadrant highlight: top-right */}
        <div className="absolute rounded-tr-2xl" style={{
          right: 0, top: 0, width: PLOT.w / 2, height: PLOT.h / 2,
          background: `hsl(${GREEN} / 0.06)`,
          borderLeft: `1px dashed hsl(${GREEN} / 0.4)`,
          borderBottom: `1px dashed hsl(${GREEN} / 0.4)`,
        }} />
        <div className="absolute font-bold uppercase tracking-[0.2em]" style={{
          fontSize: 12, color: `hsl(${GREEN})`, right: 18, top: 14,
        }}>
          The Loop Closes Here
        </div>

        {pts.map((p) => {
          const cx = p.x * PLOT.w;
          const cy = (1 - p.y) * PLOT.h;
          const us = p.name === "LIZA OS";
          return (
            <div key={p.name} className="absolute" style={{ left: cx - 14, top: cy - 14 }}>
              <div className="rounded-full" style={{
                width: us ? 32 : 22, height: us ? 32 : 22,
                background: `hsl(${p.color})`,
                boxShadow: us ? `0 0 0 8px hsl(${p.color} / 0.18)` : `0 0 0 4px hsl(${p.color} / 0.15)`,
                marginLeft: us ? -5 : 0, marginTop: us ? -5 : 0,
              }} />
              <div className="absolute" style={{
                left: cx > PLOT.w - 320 ? -290 : 40, top: -8, width: 280,
                textAlign: cx > PLOT.w - 320 ? "right" : "left",
              }}>
                <div className="font-bold" style={{ fontSize: us ? 24 : 20, color: us ? `hsl(${p.color})` : TEXT }}>{p.name}</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.35, marginTop: 2 }}>{p.note}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer text="Sources: appparadox.com · interloom.com · wonderful.ai · LIZA OS production." />
    </SlideShell>
  );
}

// ─── Slide 05 · Old mode → New mode ─────────────────────────────────────────
function S5Moat() {
  const oldMode = [
    { k: "Where the advantage came from", v: "Execution at scale. Doing the same thing well, in volume." },
    { k: "What you needed for it",        v: "Lots of people. Process. Throughput." },
    { k: "What got rewarded",             v: "Cost per unit. Cycle time. Coverage." },
  ];
  const newMode = [
    { k: "Where the advantage comes from", v: "Judgment and accountability. Deciding what to do, and standing behind it." },
    { k: "What you need for it",           v: "Fewer, better people. Infrastructure that makes their judgment compound." },
    { k: "What gets rewarded",             v: "Quality of the call. Speed of the loop. Auditability of the decision." },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Moat" color={GREEN} />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 72, lineHeight: 1.05, color: TEXT, marginBottom: 0 }}>
          When execution gets commoditized, the human becomes the advantage.
        </h1>
      </div>

      <div className="absolute grid grid-cols-2 gap-6" style={{ left: 112, right: 112, top: 360 }}>
        {/* Old mode */}
        <div className="rounded-2xl border" style={{ borderColor: CHROME_BORDER, background: CARD_ALT, overflow: "hidden" }}>
          <div className="px-7 py-5 font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${RED})`, background: "hsl(0 72% 50% / 0.05)", borderBottom: `1px solid ${CHROME_BORDER}` }}>Old mode · Execution as the advantage</div>
          <div className="px-7 py-6">
            {oldMode.map((r, i) => (
              <div key={r.k} className="py-4" style={{ borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}` }}>
                <div className="font-bold" style={{ fontSize: 17, color: SUBTLE, marginBottom: 6 }}>{r.k}</div>
                <div style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
        {/* New mode */}
        <div className="rounded-2xl border" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.04)`, overflow: "hidden", boxShadow: `0 8px 32px hsl(${GREEN} / 0.10)` }}>
          <div className="px-7 py-5 font-bold uppercase tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.08)`, borderBottom: `1px solid hsl(${GREEN} / 0.25)` }}>New mode · Judgment as the advantage</div>
          <div className="px-7 py-6">
            {newMode.map((r, i) => (
              <div key={r.k} className="py-4" style={{ borderTop: i === 0 ? "none" : `1px solid hsl(${GREEN} / 0.18)` }}>
                <div className="font-bold" style={{ fontSize: 17, color: `hsl(${GREEN})`, marginBottom: 6 }}>{r.k}</div>
                <div style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory anchor */}
      <div className="absolute rounded-2xl px-7 py-5 flex items-center gap-6"
        style={{ left: 112, right: 112, bottom: 100, background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
        <div className="font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap" style={{ fontSize: 12, color: SUBTLE }}>Regulation agrees</div>
        <div style={{ fontSize: 19, color: TEXT, lineHeight: 1.35 }}>
          <span className="font-bold">EU AI Act, GDPR and sector regulators</span> all put responsibility on a named human. Approving a clinical protocol, signing off a credit decision, releasing a financial statement. The accountable person does not get automated away. The infrastructure has to make them faster, not replace them.
        </div>
      </div>

      <Footer text="Execution gets cheaper. Judgment gets scarcer. We build for the side that still matters." />
    </SlideShell>
  );
}

// ─── Slide 06 · Valuation Logic ─────────────────────────────────────────────
function S6Valuation() {
  const steps = [
    { k: "01", t: "New category. No comp set.",                    d: "There are no precedents to multiply against. Pre AI native maths does not price what is being built here." },
    { k: "02", t: "So the bet is on who can build the core.",      d: "Few people understand this new space and have a reasonable chance of actually building it. That is what gets underwritten." },
    { k: "03", t: "Rarity sets the price, not a comp.",            d: "The valuation reflects how thin that talent layer is, not a salary line or a revenue multiple." },
    { k: "04", t: "The round is sized to hold the team.",          d: "Enough capital to hold the firm core and run the experimental shell around it through the next 18 months." },
  ];
  return (
    <SlideShell>
      <div className="absolute" style={{ left: 112, right: 112, top: 140 }}>
        <Tag label="The Valuation" color={GOLD} />
        <h1 className="font-bold tracking-tight" style={{ fontSize: 68, lineHeight: 1.05, color: TEXT, marginBottom: 0 }}>
          If you accept the frame, the number is the conclusion.
        </h1>
      </div>

      <div className="absolute grid grid-cols-2 gap-5" style={{ left: 112, right: 112, top: 360 }}>
        {steps.map((s) => (
          <div key={s.k} className="rounded-2xl border px-7 py-6" style={{ borderColor: CHROME_BORDER, background: BG, minHeight: 180 }}>
            <div className="flex items-baseline gap-3">
              <span className="font-mono font-bold" style={{ fontSize: 14, color: `hsl(${GOLD})`, letterSpacing: "0.15em" }}>{s.k}</span>
              <div className="font-bold" style={{ fontSize: 24, color: TEXT }}>{s.t}</div>
            </div>
            <p style={{ fontSize: 19, color: MUTED, marginTop: 10, lineHeight: 1.4 }}>{s.d}</p>
          </div>
        ))}
      </div>

      {/* The ask, anchored on financials */}
      <div className="absolute rounded-2xl px-8 py-6 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-6"
        style={{ left: 112, right: 112, bottom: 90, background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
        <div>
          <div className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 12, color: SUBTLE }}>Seed round</div>
          <div className="font-bold" style={{ fontSize: 34, color: TEXT, marginTop: 4 }}>$2.0M</div>
          <div style={{ fontSize: 16, color: MUTED }}>at $15.38M post · 13% to investor</div>
        </div>
        <div className="font-mono" style={{ fontSize: 28, color: SUBTLE }}>→</div>
        <div>
          <div className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 12, color: SUBTLE }}>Milestone · Q1'28</div>
          <div className="font-bold" style={{ fontSize: 34, color: TEXT, marginTop: 4 }}>~$3M ARR</div>
          <div style={{ fontSize: 16, color: MUTED }}>operator-funded growth, no services dependency</div>
        </div>
        <div className="font-mono" style={{ fontSize: 28, color: SUBTLE }}>→</div>
        <div>
          <div className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>Series A target</div>
          <div className="font-bold" style={{ fontSize: 34, color: `hsl(${GOLD})`, marginTop: 4 }}>$10M @ $50M</div>
          <div style={{ fontSize: 16, color: MUTED }}>20% dilution · 15× forward ARR</div>
        </div>
      </div>
    </SlideShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════

function WithRail({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="w-full h-full relative">
      {children}
      <ActRail index={index} />
    </div>
  );
}

const RAW_SLIDES = [
  { id: "reframe",      title: "01 · Known world vs unknown world",         component: <S1Reframe /> },
  { id: "infra-bet",    title: "02 · Only one bet lives inside the customer", component: <S2InfraBet /> },
  { id: "infra-spec",   title: "03 · What the enterprise core has to have",  component: <S3InfraSpec /> },
  { id: "map",          title: "04 · Where the others sit. Where we sit.",   component: <S4Map /> },
  { id: "moat",         title: "05 · Execution gets cheap. Judgment does not.", component: <S5Moat /> },
  { id: "valuation",    title: "06 · The number is the conclusion",          component: <S6Valuation /> },
];
const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: (
    <SlideIndexProvider index={i} total={RAW_SLIDES.length}>
      <WithRail index={i}>{s.component}</WithRail>
    </SlideIndexProvider>
  ),
}));

export default function InvestorThesisDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Thesis" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Investor Thesis</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${ACCENT} / 0.12)`, color: `hsl(${ACCENT})` }}>
            Tomorrow's room · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Thesis" slideCount={SLIDES.length} variant="desktop" />
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
                {s.title}
              </p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-2 gap-6">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("flex flex-col gap-2 rounded-xl overflow-hidden border-2 transition-all",
                      i === current ? "border-primary" : "border-transparent hover:border-border"
                    )}>
                    <div className="w-full" style={{ aspectRatio: "16/9" }}>
                      <ScaledSlide>{s.component}</ScaledSlide>
                    </div>
                    <p className="text-xs px-2 pb-2" style={{ color: MUTED }}>{s.title}</p>
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
                      background: i === current ? `hsl(${ACCENT})` : CHROME_BORDER,
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
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3, Lock, Cog, FileCheck2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideIndexProvider,
  BG, TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  GREEN, GOLD, RED, ACCENT,
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
export function Chrome({ section, n, total, dark = false, footerLeft, footerRight }: { section: string; n: number; total: number; dark?: boolean; footerLeft?: string; footerRight?: string }) {
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
        {footerLeft ?? "LIZA OS · Seed · Confidential"}
      </div>
      <div className="absolute bottom-10 right-20 font-mono uppercase tracking-[0.28em]" style={{ fontSize: 10, color: c }}>
        {footerRight ?? "For investors past the demo"}
      </div>
    </>
  );
}

export function Shell({ section, n, total, children, dark = false, footerLeft, footerRight }: {
  section: string; n: number; total: number; children: React.ReactNode; dark?: boolean;
  footerLeft?: string; footerRight?: string;
}) {
  return (
    <div className="w-full h-full relative" style={{ background: dark ? "hsl(222 25% 8%)" : BG }}>
      <Chrome section={section} n={n} total={total} dark={dark} footerLeft={footerLeft} footerRight={footerRight} />
      {children}
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// VISUAL PRIMITIVES — small, reusable SVG diagrams used by every slide.
// Same visual grammar across the deck: dots, bars, arrows, layered stacks.
// ═════════════════════════════════════════════════════════════════════════════

function VizFrame({ tone = "operator", children, label }: {
  tone?: "market" | "operator"; children: React.ReactNode; label?: string;
}) {
  const isOp = tone === "operator";
  const c = isOp ? GREEN : RED;
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
      style={{
        background: isOp ? `hsl(${GREEN} / 0.06)` : `hsl(${RED} / 0.04)`,
        border: `1px solid hsl(${c} / ${isOp ? 0.35 : 0.22})`,
      }}>
      {children}
      {label && (
        <p className="absolute bottom-3 left-4 font-mono uppercase tracking-[0.24em]"
          style={{ fontSize: 10, color: `hsl(${c})` }}>{label}</p>
      )}
    </div>
  );
}

// Stable dot grid (deterministic shimmer based on r×c hash)
function DotGrid({ rows, cols, color, size = 5, gap = 12, density = 1 }: {
  rows: number; cols: number; color: string; size?: number; gap?: number; density?: number;
}) {
  const w = cols * gap, h = rows * gap;
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * 73 + c * 31) % 100;
      if (seed / 100 > density) continue;
      const op = 0.35 + (seed % 60) / 100;
      dots.push(
        <circle key={`${r}-${c}`} cx={c * gap + gap / 2} cy={r * gap + gap / 2} r={size / 2}
          fill={color} opacity={op} />
      );
    }
  }
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{dots}</svg>;
}

// ─── S02 · gap diagram ──────────────────────────────────────────────────────
// Market viz: a model output with red "?" stamps where governance metadata is missing.
// Operator viz: same output, but wrapped in 4 metadata bands (STANDARD/EVIDENCE/MODEL/APPROVER).
export function VizModelOutputBare() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl px-6 py-5 text-center"
        style={{ background: BG, border: `1px dashed hsl(${RED} / 0.5)`, minWidth: 240 }}>
        <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 9, color: SUBTLE }}>Model output</p>
        <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.1 }}>"Here is the<br/>proposal."</p>
      </div>
      <div className="flex gap-2">
        {["no standard", "no receipt", "no memory", "no signer"].map((x) => (
          <span key={x} className="font-mono px-2 py-1 rounded"
            style={{ fontSize: 10, color: `hsl(${RED})`, background: `hsl(${RED} / 0.08)`, border: `1px solid hsl(${RED} / 0.3)` }}>?{x}</span>
        ))}
      </div>
    </div>
  );
}
export function VizGovernedDecision() {
  const tags = [
    { k: "STANDARD",  v: "AEC-PROP v3.2" },
    { k: "EVIDENCE",  v: "12 sources, hashed" },
    { k: "MODEL",     v: "claude-3.5 · 2025-04" },
    { k: "APPROVER",  v: "M. Schäfer · 14:02" },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl px-6 py-4 text-center"
        style={{ background: BG, border: `2px solid hsl(${GREEN} / 0.5)`, minWidth: 260, boxShadow: `0 0 24px hsl(${GREEN} / 0.15)` }}>
        <p className="font-mono uppercase tracking-[0.22em] mb-1" style={{ fontSize: 9, color: `hsl(${GREEN})` }}>Governed decision</p>
        <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.1 }}>"Here is the<br/>proposal."</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-2" style={{ width: 320 }}>
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

// ─── S03 · context explosion ────────────────────────────────────────────────
export function VizContextSmall() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DotGrid rows={4} cols={4} color={`hsl(${RED})`} size={6} gap={14} />
      <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: SUBTLE }}>1 user · 1 chat · ~10k tokens</p>
    </div>
  );
}
export function VizContextHuge() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DotGrid rows={18} cols={34} color={`hsl(${GREEN})`} size={4} gap={9} density={0.92} />
      <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>
        employees × workflows × policies × receipts
      </p>
    </div>
  );
}

// ─── S04 · solution loop ────────────────────────────────────────────────────
export function VizSolutionLoop() {
  // 4 stations in a ring with arrows; LEARN curves back to LOCK
  const stations = [
    { k: "LOCK",    a: "−45deg" },
    { k: "COMPILE", a: "45deg"  },
    { k: "SIGN",    a: "135deg" },
    { k: "LEARN",   a: "225deg" },
  ];
  return (
    <div className="relative" style={{ width: 320, height: 280 }}>
      <svg width="320" height="280" viewBox="0 0 320 280" className="absolute inset-0">
        <circle cx="160" cy="140" r="100" fill="none" stroke={`hsl(${GREEN} / 0.25)`} strokeWidth="1.5" strokeDasharray="3 5" />
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={`hsl(${GREEN})`} />
          </marker>
        </defs>
        <path d="M 160 40 A 100 100 0 0 1 260 140" stroke={`hsl(${GREEN})`} strokeWidth="2" fill="none" markerEnd="url(#arr)" />
        <path d="M 260 140 A 100 100 0 0 1 160 240" stroke={`hsl(${GREEN})`} strokeWidth="2" fill="none" markerEnd="url(#arr)" />
        <path d="M 160 240 A 100 100 0 0 1 60 140"  stroke={`hsl(${GREEN})`} strokeWidth="2" fill="none" markerEnd="url(#arr)" />
        <path d="M 60 140 A 100 100 0 0 1 160 40"   stroke={`hsl(${GREEN})`} strokeWidth="2" fill="none" markerEnd="url(#arr)" />
      </svg>
      {stations.map((s, i) => {
        const pos = [
          { top: 10, left: 130 }, // top
          { top: 120, left: 250 }, // right
          { top: 230, left: 130 }, // bottom
          { top: 120, left: 10 },  // left
        ][i];
        return (
          <div key={s.k} className="absolute rounded-full px-3 py-2 font-mono font-black"
            style={{
              ...pos, fontSize: 13, color: TEXT,
              background: BG, border: `2px solid hsl(${GREEN})`, letterSpacing: "0.15em",
              boxShadow: `0 0 14px hsl(${GREEN} / 0.25)`,
            }}>{s.k}</div>
        );
      })}
      <div className="absolute font-mono uppercase tracking-[0.2em]"
        style={{ top: 132, left: 116, fontSize: 11, color: SUBTLE }}>
        per call
      </div>
    </div>
  );
}
export function VizWrapper() {
  return (
    <div className="rounded-xl px-5 py-4 text-center"
      style={{ background: BG, border: `1px dashed hsl(${RED} / 0.4)`, minWidth: 220 }}>
      <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 9, color: SUBTLE }}>Wrapper</p>
      <p className="font-mono" style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
        prompt → model → text<br/>
        loop → tool → text<br/>
        text → user
      </p>
      <p className="font-mono uppercase tracking-[0.22em] mt-3" style={{ fontSize: 9, color: `hsl(${RED})` }}>no receipt</p>
    </div>
  );
}

// ─── S05 · factory line ─────────────────────────────────────────────────────
export function VizFactoryLine() {
  const stations = [
    { k: "01", v: "LOCK",    icon: Lock,        d: "bind to the playbook" },
    { k: "02", v: "COMPILE", icon: Cog,         d: "assemble the call" },
    { k: "03", v: "SIGN",    icon: FileCheck2,  d: "emit the receipt" },
    { k: "04", v: "LEARN",   icon: RefreshCw,   d: "sharpen the next call" },
  ];
  return (
    <div className="relative w-full">
      <div className="grid grid-cols-4 gap-6 relative z-10">
        {stations.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.v} className="rounded-2xl p-6 flex flex-col items-center text-center"
              style={{ background: BG, border: `2px solid hsl(${GREEN} / 0.4)`, boxShadow: `0 0 22px hsl(${GREEN} / 0.08)` }}>
              <p className="font-mono" style={{ fontSize: 11, color: SUBTLE, letterSpacing: "0.22em" }}>{s.k}</p>
              <div className="my-4 rounded-full flex items-center justify-center"
                style={{ width: 56, height: 56, background: `hsl(${GREEN} / 0.1)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
                <Icon size={26} style={{ color: `hsl(${GREEN})` }} />
              </div>
              <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "0.05em" }}>{s.v}</p>
              <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.3 }}>{s.d}</p>
            </div>
          );
        })}
      </div>
      {/* connector arrows */}
      <svg className="absolute" style={{ top: 80, left: 0, width: '100%', height: 30, pointerEvents: 'none' }}>
        <defs>
          <marker id="far" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={`hsl(${GREEN})`} />
          </marker>
        </defs>
      </svg>
      {/* LEARN loop arrow back to LOCK */}
      <div className="mt-8 flex items-center justify-center gap-3 font-mono uppercase tracking-[0.24em]"
        style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
        <span style={{ color: SUBTLE }}>04 LEARN</span>
        <span>↻ feeds back into</span>
        <span style={{ color: SUBTLE }}>01 LOCK</span>
        <span style={{ color: SUBTLE }}>· the corpus is the asset</span>
      </div>
    </div>
  );
}

// ─── S05 · concrete walk-through ────────────────────────────────────────────
// Shows ONE real request travelling through the 4 stations, producing a receipt.
// Designed so a zero-context reader understands what LIZA does in 5 seconds.
export function VizFactoryWalkthrough() {
  const stations = [
    {
      n: "01",
      k: "LOCK",
      icon: Lock,
      what: "Pick the company's approved way of doing this work.",
      shows: "Playbook: AEC-PROP v3.2",
      meta: "owner · M. Schäfer · expires 2026-Q1",
    },
    {
      n: "02",
      k: "COMPILE",
      icon: Cog,
      what: "Assemble only what this one call needs.",
      shows: "12 standards · 4 prior receipts · current pricing",
      meta: "no blind RAG dump · cost capped before the call",
    },
    {
      n: "03",
      k: "SIGN",
      icon: FileCheck2,
      what: "Bind the output to a signed, replayable receipt.",
      shows: "model · claude-3.5 · approver · M. Schäfer · 14:02",
      meta: "hash of inputs, outputs and policy version",
    },
    {
      n: "04",
      k: "LEARN",
      icon: RefreshCw,
      what: "Feed the correction back into the playbook.",
      shows: "Δ 'cooling load assumption' · pushed to v3.3",
      meta: "next call inherits it · the corpus compounds",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      {/* TOP ROW · the worked example, end-to-end */}
      <div className="grid grid-cols-[1fr_3.4fr_1.2fr] gap-5 items-stretch">
        {/* INPUT */}
        <div className="rounded-xl p-5 flex flex-col justify-center"
          style={{ background: CARD_ALT, border: `1px dashed ${CHROME_BORDER}` }}>
          <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 14, color: SUBTLE }}>Input</p>
          <p className="font-black mt-2" style={{ fontSize: 22, color: TEXT, lineHeight: 1.2 }}>
            "Draft a proposal for the Munich school project."
          </p>
          <p className="mt-3 font-mono" style={{ fontSize: 13, color: MUTED }}>
            sender · project lead<br/>
            channel · workbook · 14:01
          </p>
        </div>

        {/* 4 STATIONS */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-3 relative z-10 h-full">
            {stations.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.k} className="rounded-xl p-4 flex flex-col"
                  style={{ background: BG, border: `2px solid hsl(${GREEN} / 0.4)`, boxShadow: `0 0 18px hsl(${GREEN} / 0.08)` }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono" style={{ fontSize: 14, color: SUBTLE, letterSpacing: "0.22em" }}>{s.n}</p>
                    <div className="rounded-full flex items-center justify-center"
                      style={{ width: 40, height: 40, background: `hsl(${GREEN} / 0.1)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
                      <Icon size={22} style={{ color: `hsl(${GREEN})` }} />
                    </div>
                  </div>
                  <p className="font-black" style={{ fontSize: 28, color: TEXT, letterSpacing: "0.04em", lineHeight: 1 }}>{s.k}</p>
                  <p className="mt-2" style={{ fontSize: 16, color: TEXT, lineHeight: 1.3 }}>{s.what}</p>
                  <div className="mt-3 pt-3 flex-1" style={{ borderTop: `1px solid hsl(${GREEN} / 0.2)` }}>
                    <p className="font-mono" style={{ fontSize: 12, color: `hsl(${GREEN})`, letterSpacing: "0.16em" }}>WHAT IT EMITS</p>
                    <p className="font-mono mt-1.5" style={{ fontSize: 14, color: TEXT, lineHeight: 1.4 }}>{s.shows}</p>
                    <p className="font-mono mt-2" style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.4 }}>{s.meta}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OUTPUT — the receipt */}
        <div className="rounded-xl p-5 flex flex-col justify-center"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `2px solid hsl(${GREEN})`, boxShadow: `0 0 22px hsl(${GREEN} / 0.18)` }}>
          <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Output</p>
          <p className="font-black mt-2" style={{ fontSize: 22, color: TEXT, lineHeight: 1.15 }}>
            Signed proposal<br/>+ receipt
          </p>
          <p className="mt-3 font-mono" style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
            replay anytime<br/>
            policy + data + model<br/>
            + approver, hashed
          </p>
        </div>
      </div>

      {/* feedback loop arrow under the row */}
      <div className="flex items-center justify-center gap-4 font-mono uppercase tracking-[0.24em] -mt-1"
        style={{ fontSize: 12, color: `hsl(${GREEN})` }}>
        <span style={{ color: SUBTLE }}>04 LEARN</span>
        <span>↻ feeds the next call's 01 LOCK</span>
        <span style={{ color: SUBTLE }}>· the corpus is the asset</span>
      </div>
    </div>
  );
}

// ─── S06 · crossing curves ──────────────────────────────────────────────────
export function VizCrossingCurves() {
  return (
    <svg viewBox="0 0 480 240" className="w-full h-full">
      {/* axes */}
      <line x1="40" y1="200" x2="460" y2="200" stroke={CHROME_BORDER} strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="200" stroke={CHROME_BORDER} strokeWidth="1" />
      {/* gridlines */}
      {[1,2,3].map(i => (
        <line key={i} x1="40" y1={50*i+50} x2="460" y2={50*i+50} stroke={CHROME_BORDER} strokeWidth="0.5" strokeDasharray="2 4" />
      ))}
      {/* token cost line, going down */}
      <path d="M 50 40 Q 200 90 460 180" stroke={`hsl(${RED})`} strokeWidth="3" fill="none" />
      <circle cx="50" cy="40" r="4" fill={`hsl(${RED})`} />
      <circle cx="460" cy="180" r="4" fill={`hsl(${RED})`} />
      {/* governed decisions line, going up */}
      <path d="M 50 180 Q 200 130 460 30" stroke={`hsl(${GREEN})`} strokeWidth="3" fill="none" />
      <circle cx="50" cy="180" r="4" fill={`hsl(${GREEN})`} />
      <circle cx="460" cy="30" r="5" fill={`hsl(${GREEN})`} stroke={BG} strokeWidth="2" />
      {/* crossover */}
      <circle cx="255" cy="110" r="6" fill={GOLD ? `hsl(${GOLD})` : "#fa0"} />
      {/* labels */}
      <text x="50" y="225" fontSize="11" fill={MUTED} fontFamily="ui-monospace,monospace">2024</text>
      <text x="240" y="225" fontSize="11" fill={MUTED} fontFamily="ui-monospace,monospace" textAnchor="middle">2026 · the crossover</text>
      <text x="455" y="225" fontSize="11" fill={MUTED} fontFamily="ui-monospace,monospace" textAnchor="end">2028</text>
      <text x="70" y="35" fontSize="12" fill={`hsl(${RED})`} fontWeight="700">$ token cost ↓</text>
      <text x="455" y="22" fontSize="12" fill={`hsl(${GREEN})`} fontWeight="700" textAnchor="end">governed decisions ↑</text>
      {/* axis titles + crossover annotation, so the chart reads alone */}
      <text x="250" y="244" fontSize="10" fill={SUBTLE} fontFamily="ui-monospace,monospace" textAnchor="middle">time →</text>
      <text x="14" y="110" fontSize="10" fill={SUBTLE} fontFamily="ui-monospace,monospace" textAnchor="middle" transform="rotate(-90 14 110)">volume / $</text>
      <text x="255" y="100" fontSize="10" fill={`hsl(${GOLD})`} fontWeight="700" textAnchor="middle">cost &lt; decision value</text>
      <text x="255" y="128" fontSize="9" fill={SUBTLE} fontFamily="ui-monospace,monospace" textAnchor="middle">100× more AI work unlocked</text>
    </svg>
  );
}
export function VizTokenDown() {
  return (
    <svg viewBox="0 0 220 200" className="w-full h-full">
      <line x1="20" y1="170" x2="200" y2="170" stroke={CHROME_BORDER} />
      <path d="M 30 30 Q 100 100 195 165" stroke={`hsl(${RED})`} strokeWidth="3" fill="none" />
      <circle cx="30" cy="30" r="4" fill={`hsl(${RED})`} />
      <circle cx="195" cy="165" r="4" fill={`hsl(${RED})`} />
      <text x="35" y="22" fontSize="11" fill={`hsl(${RED})`} fontWeight="700">$ token</text>
      <text x="110" y="190" fontSize="10" fill={MUTED} textAnchor="middle" fontFamily="ui-monospace,monospace">race to the bottom</text>
    </svg>
  );
}

// ─── S07 · iceberg ──────────────────────────────────────────────────────────
export function VizIceberg() {
  return (
    <svg viewBox="0 0 360 320" className="w-full h-full">
      {/* tip */}
      <polygon points="180,30 230,110 130,110" fill={`hsl(${RED} / 0.25)`} stroke={`hsl(${RED})`} strokeWidth="1.5" />
      <text x="180" y="80" fontSize="13" fill={TEXT} fontWeight="800" textAnchor="middle">Chat UI</text>
      <text x="180" y="98" fontSize="9" fill={MUTED} textAnchor="middle" fontFamily="ui-monospace,monospace">the demo</text>
      {/* waterline */}
      <line x1="20" y1="120" x2="340" y2="120" stroke={`hsl(${GREEN})`} strokeWidth="1" strokeDasharray="4 4" />
      <text x="335" y="115" fontSize="9" fill={`hsl(${GREEN})`} textAnchor="end" fontFamily="ui-monospace,monospace">PROD WATERLINE</text>
      {/* submerged mass */}
      <polygon points="60,120 300,120 270,300 90,300" fill={`hsl(${GREEN} / 0.12)`} stroke={`hsl(${GREEN})`} strokeWidth="1.5" />
      {[
        "Workflow control across roles",
        "Typed standards · owners · expiry",
        "Per-call playbook compilation",
        "Signed receipts · audit replay",
        "Drift detection · version control",
        "Change management · approvals",
        "Regulator-tested install",
      ].map((t, i) => (
        <text key={t} x="180" y={155 + i*22} fontSize="12" fill={TEXT} textAnchor="middle" fontWeight="600">{t}</text>
      ))}
    </svg>
  );
}
export function VizWeekendDemo() {
  return (
    <div className="rounded-xl p-5" style={{ background: BG, border: `1px dashed hsl(${RED} / 0.4)` }}>
      <div className="font-mono text-xs" style={{ color: SUBTLE, marginBottom: 8 }}>weekend.py</div>
      <pre className="font-mono" style={{ fontSize: 11, color: MUTED, lineHeight: 1.55 }}>
{`prompt = '''You are a helpful
assistant. Use these PDFs.'''

response = client.chat(
  prompt + user_input + docs
)
print(response)`}
      </pre>
      <p className="mt-3 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 9, color: `hsl(${RED})` }}>looks like the product</p>
    </div>
  );
}

// ─── S08 · governance triangle ──────────────────────────────────────────────
export function VizGovernanceStack() {
  return (
    <div className="flex flex-col items-center gap-2" style={{ width: 360 }}>
      {/* Regulator */}
      <div className="rounded-lg px-6 py-3 text-center"
        style={{ width: 200, background: `hsl(${GOLD} / 0.1)`, border: `1.5px solid hsl(${GOLD})` }}>
        <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${GOLD})` }}>Top of the stack</p>
        <p className="font-black" style={{ fontSize: 18, color: TEXT, letterSpacing: "-0.01em" }}>Regulator</p>
        <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>"who decided this?"</p>
      </div>
      <div className="font-mono" style={{ fontSize: 18, color: SUBTLE, lineHeight: 0.8 }}>↓</div>
      {/* Control layer */}
      <div className="rounded-lg px-6 py-4 text-center"
        style={{ width: 320, background: `hsl(${GREEN} / 0.1)`, border: `2px solid hsl(${GREEN})`, boxShadow: `0 0 18px hsl(${GREEN} / 0.18)` }}>
        <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>Neutral, auditable</p>
        <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.015em" }}>Control layer · LIZA</p>
        <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>standards · receipts · approvers</p>
      </div>
      <div className="font-mono" style={{ fontSize: 18, color: SUBTLE, lineHeight: 0.8 }}>↑</div>
      {/* Model suppliers */}
      <div className="grid grid-cols-3 gap-2" style={{ width: 320 }}>
        {["Claude", "GPT", "Gemini"].map(m => (
          <div key={m} className="rounded-md py-2 text-center"
            style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono" style={{ fontSize: 11, color: MUTED }}>{m}</p>
          </div>
        ))}
      </div>
      <p className="font-mono uppercase tracking-[0.22em] mt-1" style={{ fontSize: 9, color: SUBTLE }}>
        Suppliers cannot certify themselves
      </p>
    </div>
  );
}
export function VizLabExpansion() {
  return (
    <div className="rounded-xl p-5 text-center"
      style={{ background: BG, border: `1px dashed hsl(${RED} / 0.4)` }}>
      <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${RED})` }}>What the market sees</p>
      <p className="font-black mt-3" style={{ fontSize: 20, color: TEXT, lineHeight: 1.15 }}>
        Claude<br/>
        <span style={{ color: MUTED, fontWeight: 700 }}>+ memory</span><br/>
        <span style={{ color: MUTED, fontWeight: 700 }}>+ custom GPT</span><br/>
        <span style={{ color: MUTED, fontWeight: 700 }}>+ enterprise tier</span>
      </p>
      <p className="font-mono mt-3" style={{ fontSize: 10, color: SUBTLE }}>= the platform</p>
    </div>
  );
}

// ─── S09 · cost / value bar ─────────────────────────────────────────────────
export function VizValueBar() {
  // 3 horizontal bars, scaled visually for storytelling clarity
  return (
    <div className="flex flex-col gap-4 w-full">
      {[
        { v: "€23.00", l: "manual labour displaced",  w: "100%", c: `hsl(${GOLD})`, bg: `hsl(${GOLD} / 0.12)`, note: "value anchor" },
        { v: "€0.40",  l: "price per governed decision", w: "55%",  c: `hsl(${GREEN})`, bg: `hsl(${GREEN} / 0.18)`, note: "what the customer pays" },
        { v: "€0.04",  l: "model + infra cost",        w: "8%",   c: MUTED, bg: `hsl(${RED} / 0.1)`, note: "pass-through" },
      ].map((r) => (
        <div key={r.l}>
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-3">
              <span className="font-black" style={{ fontSize: 26, color: r.c, letterSpacing: "-0.02em" }}>{r.v}</span>
              <span className="font-bold" style={{ fontSize: 14, color: TEXT }}>{r.l}</span>
            </div>
            <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: SUBTLE }}>{r.note}</span>
          </div>
          <div className="rounded-full h-5 w-full" style={{ background: `hsl(220 15% 95%)` }}>
            <div className="h-full rounded-full" style={{ width: r.w, background: r.bg, border: `1px solid ${r.c}` }} />
          </div>
        </div>
      ))}
      <div className="rounded-lg px-4 py-3 mt-2"
        style={{ background: `hsl(${GREEN} / 0.1)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
        <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>Margin geometry</p>
        <p className="font-bold mt-1" style={{ fontSize: 14, color: TEXT }}>
          90%+ gross margin. As token cost falls, margin expands.
        </p>
        <p className="font-mono mt-2" style={{ fontSize: 11, color: MUTED, lineHeight: 1.45 }}>
          Derivation: 20-min analyst task @ €70/hr fully loaded ≈ <b style={{ color: TEXT }}>€23</b> displaced. Customer pays <b style={{ color: TEXT }}>€0.40</b> (≈1.6% of value). Model + infra <b style={{ color: TEXT }}>€0.04</b>. Pass-through. ≈ <b style={{ color: `hsl(${GREEN})` }}>95% fully loaded gross margin</b>.
        </p>
      </div>
    </div>
  );
}
export function VizSeatDecay() {
  return (
    <svg viewBox="0 0 220 200" className="w-full h-full">
      <line x1="20" y1="170" x2="200" y2="170" stroke={CHROME_BORDER} />
      <path d="M 30 50 L 70 60 L 110 90 L 150 130 L 195 165" stroke={`hsl(${RED})`} strokeWidth="3" fill="none" />
      {[30,70,110,150,195].map((x, i) => (
        <circle key={i} cx={x} cy={[50,60,90,130,165][i]} r="4" fill={`hsl(${RED})`} />
      ))}
      <text x="35" y="42" fontSize="11" fill={`hsl(${RED})`} fontWeight="700">per-seat $</text>
      <text x="110" y="190" fontSize="10" fill={MUTED} textAnchor="middle" fontFamily="ui-monospace,monospace">decay after rollout</text>
    </svg>
  );
}

// ─── S11 · moat sediment ────────────────────────────────────────────────────
export function VizMoatLayers() {
  const layers = [
    { h: "Standards corpus",  d: "Typed playbooks, decision rules, owners, expiry. Per vertical, per customer.", op: 1.0 },
    { h: "Receipt graph",     d: "Real decisions, evidence, approvals, drift. The customer's accountable memory.", op: 0.85 },
    { h: "Workflow position", d: "The layer where work is requested, approved, replayed, improved.", op: 0.7 },
    { h: "Trust pattern",     d: "Neutral surface. Buyer keeps model optionality and governance ownership.", op: 0.55 },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      {layers.map((l, i) => (
        <div key={l.h} className="rounded-lg px-6 py-4 flex items-center gap-5"
          style={{ background: `hsl(${GREEN} / ${0.06 + i*0.02})`, border: `1px solid hsl(${GREEN} / ${l.op * 0.4})`, marginLeft: i * 18, marginRight: i * 18 }}>
          <span className="font-mono" style={{ fontSize: 11, color: SUBTLE, letterSpacing: "0.18em", minWidth: 24 }}>0{i + 1}</span>
          <div className="flex-1">
            <p className="font-black" style={{ fontSize: 20, color: TEXT, letterSpacing: "-0.018em" }}>{l.h}</p>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.35, marginTop: 2 }}>{l.d}</p>
          </div>
        </div>
      ))}
      <p className="font-mono uppercase tracking-[0.22em] text-center mt-1" style={{ fontSize: 10, color: SUBTLE }}>
        Each layer compounds on the one below. None lifts out on vendor swap.
      </p>
    </div>
  );
}

// ─── S13 · ask stacked bar ──────────────────────────────────────────────────
export function VizAskBar() {
  const seg = [
    { p: 50, h: "Vertical corpus",     d: "Deepen AEC. Package pharma + finance.", c: `hsl(${GREEN})`,  bg: `hsl(${GREEN} / 0.15)` },
    { p: 30, h: "Repeatable install",  d: "Self-serve deploy, metering, admin.",   c: `hsl(${ACCENT})`, bg: `hsl(${ACCENT} / 0.15)` },
    { p: 20, h: "Channel + audit kit", d: "Partner enablement, regulated material.", c: `hsl(${GOLD})`,   bg: `hsl(${GOLD} / 0.18)` },
  ];
  return (
    <div className="w-full flex flex-col gap-6">
      {/* the bar */}
      <div className="flex w-full rounded-xl overflow-hidden" style={{ height: 60, border: `1px solid ${CHROME_BORDER}` }}>
        {seg.map((s) => (
          <div key={s.h} className="flex items-center justify-center font-black"
            style={{ width: `${s.p}%`, background: s.bg, borderRight: `1px solid ${CHROME_BORDER}`, fontSize: 22, color: s.c }}>
            {s.p}%
          </div>
        ))}
      </div>
      {/* legend */}
      <div className="grid grid-cols-3 gap-5">
        {seg.map((s) => (
          <div key={s.h} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: s.c }} />
              <p className="font-mono" style={{ fontSize: 11, color: SUBTLE, letterSpacing: "0.18em" }}>{s.p}%</p>
            </div>
            <p className="font-black" style={{ fontSize: 20, color: TEXT, letterSpacing: "-0.018em" }}>{s.h}</p>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// VISUAL LENS SLIDE — framing → hero visual band → compact caption bullets
// The hero is the unit of comprehension. Bullets only annotate the visual.
// ═════════════════════════════════════════════════════════════════════════════

export type LensItem = { h: string; v: string };
export type LensSide = { kicker?: string; headline: string; viz: React.ReactNode; vizLabel?: string; items: LensItem[] };
export type LensPayload = { market: LensSide; operator: LensSide & { signal?: string } };

export function LensSlide({
  section, n, total, topic, framing, payload, bottomLine,
}: {
  section: string; n: number; total: number;
  topic: string; framing: string;
  payload: LensPayload; bottomLine?: string;
}) {
  return (
    <Shell section={section} n={n} total={total}>
      <div className="absolute inset-0 px-20 pt-24 pb-20 flex flex-col">
        {/* framing */}
        <div className="mb-5">
          <p className="font-mono uppercase tracking-[0.3em] mb-2" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
            {topic}
          </p>
          <h2 className="font-black" style={{ fontSize: 44, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.033em", maxWidth: 1640 }}>
            {framing}
          </h2>
        </div>

        {/* hero visual band — 2 columns */}
        <div className="grid grid-cols-[0.7fr_1.3fr] gap-7 flex-1 min-h-0">
          {/* MARKET LENS */}
          <div className="rounded-2xl p-7 flex flex-col"
            style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.25)` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block rounded-full" style={{ width: 8, height: 8, background: `hsl(${RED})` }} />
              <p className="font-mono uppercase tracking-[0.26em]" style={{ fontSize: 12, color: `hsl(${RED})` }}>
                {payload.market.kicker || "What you are being sold today"}
              </p>
            </div>
            <p className="font-black mb-4" style={{ fontSize: 26, color: MUTED, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              {payload.market.headline}
            </p>
            {payload.market.vizLabel && (
              <p className="font-mono uppercase tracking-[0.22em] mb-3 text-center" style={{ fontSize: 11, color: SUBTLE }}>
                {payload.market.vizLabel}
              </p>
            )}
            {/* viz */}
            <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
              {payload.market.viz}
            </div>
            {/* compact captions */}
            <div className="flex flex-col gap-2.5 pt-4" style={{ borderTop: `1px solid hsl(${RED} / 0.2)` }}>
              {payload.market.items.slice(0, 3).map((it, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="font-mono" style={{ fontSize: 13, color: `hsl(${RED})`, minWidth: 14 }}>×</span>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>
                    <span className="font-bold" style={{ color: MUTED }}>{it.h}.</span> {it.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* OPERATOR LENS */}
          <div className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: `hsl(${GREEN})`, boxShadow: `0 0 12px hsl(${GREEN} / 0.6)` }} />
              <p className="font-mono uppercase tracking-[0.26em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
                {payload.operator.kicker || "What companies actually need"}
              </p>
            </div>
            <p className="font-black mb-5" style={{ fontSize: 38, color: TEXT, lineHeight: 1.06, letterSpacing: "-0.025em" }}>
              {payload.operator.headline}
            </p>
            {payload.operator.vizLabel && (
              <p className="font-mono uppercase tracking-[0.22em] mb-3 text-center" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>
                {payload.operator.vizLabel}
              </p>
            )}
            {/* viz */}
            <div className="flex-1 flex items-center justify-center min-h-0 mb-5">
              {payload.operator.viz}
            </div>
            {/* compact captions */}
            <div className="flex flex-col gap-2.5 pt-4" style={{ borderTop: `1px solid hsl(${GREEN} / 0.3)` }}>
              {payload.operator.items.slice(0, 3).map((it, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="font-mono" style={{ fontSize: 14, color: `hsl(${GREEN})`, minWidth: 16 }}>✓</span>
                  <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.35 }}>
                    <span className="font-black">{it.h}.</span>{" "}
                    <span style={{ color: MUTED }}>{it.v}</span>
                  </p>
                </div>
              ))}
            </div>
            {payload.operator.signal && (
              <div className="mt-4 rounded-lg px-5 py-3" style={{ background: `hsl(${GREEN} / 0.12)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
                <p className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>{payload.operator.signal}</p>
              </div>
            )}
          </div>
        </div>

        {bottomLine && (
          <div className="mt-5 rounded-xl px-7 py-4 flex items-center gap-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 12, color: SUBTLE }}>The point</span>
            <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.25, letterSpacing: "-0.014em" }}>{bottomLine}</p>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDES
// ═════════════════════════════════════════════════════════════════════════════

// 01 · Cover ───────────────────────────────────────────────────────────────
function S01Cover({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark>
      {/* faint two-tone dot field background */}
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
        <h1 className="font-black relative z-10" style={{ fontSize: 128, lineHeight: 0.98, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          LIZA OS
        </h1>
        <p className="mt-10 relative z-10" style={{ fontSize: 36, lineHeight: 1.3, color: "hsl(0 0% 78%)", maxWidth: 1300 }}>
          The control layer between enterprise AI and the regulator.
        </p>
        <p className="mt-6 font-mono uppercase tracking-[0.3em] relative z-10" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>
          Seed · €2M · For investors past the demo
        </p>
        {/* Reading key — every slide in this deck is split this way */}
        <div className="mt-16 relative z-10 rounded-2xl px-10 py-6 flex items-center gap-12"
          style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.12)`, backdropFilter: "blur(6px)" }}>
          <p className="font-mono uppercase tracking-[0.32em]" style={{ fontSize: 13, color: "hsl(0 0% 72%)" }}>
            How to read this deck
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${RED})` }} />
            <p style={{ fontSize: 18, color: "hsl(0 0% 88%)" }}>
              <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>Left side</span>: what you are being sold today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: `hsl(${GREEN})`, boxShadow: `0 0 12px hsl(${GREEN} / 0.7)` }} />
            <p style={{ fontSize: 18, color: "hsl(0 0% 88%)" }}>
              <span className="font-bold" style={{ color: "hsl(0 0% 98%)" }}>Right side</span>: what companies actually need
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// 02 · Problem (Lens + governance gap viz) ─────────────────────────────────
function S02Problem({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Problem" n={n} total={t}
      topic="What enterprises actually lack"
      framing="Enterprises do not lack models. They lack a way to govern what the models do."
      payload={{
        market: {
          kicker: "What you are being sold today",
          headline: "A smarter assistant.",
          viz: <VizModelOutputBare />,
          vizLabel: "Diagram · raw model output, no metadata",
          items: [
            { h: "Better prompts",  v: "If outputs drift, prompt harder." },
            { h: "More PDFs in RAG", v: "Search dressed up as governance." },
            { h: "Wait for the next model", v: "Defer the operational problem." },
          ],
        },
        operator: {
          kicker: "What companies actually need",
          headline: "Standards, receipts, memory, accountability.",
          viz: <VizGovernedDecision />,
          vizLabel: "Diagram · same output, wrapped in 4 governance bands",
          items: [
            { h: "Standard bound",   v: "The company's approved way of doing the work." },
            { h: "Receipt signed",   v: "Replayable on demand. Policy, data, model, approver." },
            { h: "Memory compounds", v: "The next call inherits the last one's correction." },
          ],
          signal: "Regulators ask 'who decided this'. Today, the room goes quiet.",
        },
      }}
      bottomLine="The AI readiness problem is operational, not magical. A better chatbot does not fix it."
    />
  );
}

// 03 · Context explosion (Lens + dot-bloom viz) ────────────────────────────
function S03Context({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why the gap exists" n={n} total={t}
      topic="The context explosion"
      framing="Today's context fits in a chat. Tomorrow's spans every employee, workflow, policy and receipt in the company."
      payload={{
        market: {
          kicker: "What you are being sold today",
          headline: "One chat at a time.",
          viz: <VizContextSmall />,
          vizLabel: "Diagram · 1 user · 1 chat · ~10k tokens",
          items: [
            { h: "Prompt window",  v: "Whatever fits in 10k tokens." },
            { h: "No receipts",    v: "Nothing the regulator can replay." },
            { h: "No compounding", v: "The tab closes. The org learns nothing." },
          ],
        },
        operator: {
          kicker: "What companies actually need",
          headline: "An organisation-scale context graph.",
          viz: <VizContextHuge />,
          vizLabel: "Diagram · context surface across an enterprise",
          items: [
            { h: "Cannot stay siloed", v: "Spans roles, tools, regions, regulators." },
            { h: "Must be efficient",  v: "Inefficient assembly multiplies the token + latency bill." },
            { h: "Must be auditable",  v: "Standard, data, approval, model. Replayable on demand." },
          ],
          signal: "Billions of governed tokens per enterprise per year, by 2028.",
        },
      }}
      bottomLine="A chat UI is a feature of the small reality. The control layer is the only thing that survives the big one."
    />
  );
}

// 04 · Solution (Lens + loop viz) ──────────────────────────────────────────
function S04Solution({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Solution" n={n} total={t}
      topic="The unit we sell"
      framing="The market evaluates the text box. We sell the governed decision underneath it."
      payload={{
        market: {
          kicker: "What you are being sold today",
          headline: "Another wrapper.",
          viz: <VizWrapper />,
          vizLabel: "Diagram · prompt → model → text. No receipt.",
          items: [
            { h: "Prompt orchestration", v: "A nicer DAG over the same call." },
            { h: "Tool use",             v: "Public patterns, public libraries." },
            { h: "Helpful output",       v: "Hard to verify. Easy to ship." },
          ],
        },
        operator: {
          kicker: "What companies actually need",
          headline: "LOCK · COMPILE · SIGN · LEARN. One accountable decision.",
          viz: <VizSolutionLoop />,
          vizLabel: "Diagram · the 4-station AACE loop, one per call",
          items: [
            { h: "Lock",    v: "Bind the task to the versioned playbook." },
            { h: "Compile", v: "Assemble policy, data, rules for that one call." },
            { h: "Sign",    v: "Receipt becomes the next call's context." },
          ],
          signal: "Model-agnostic by design. Claude, GPT, Gemini, on-prem.",
        },
      }}
      bottomLine="One accountable work unit. The unit the customer actually pays for."
    />
  );
}

// 05 · How it works (factory line) ─────────────────────────────────────────
function S05How({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="How it works" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-24 pb-16 flex flex-col">
        <div className="mb-6">
          <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
            How one call actually works
          </p>
          <h2 className="font-black" style={{ fontSize: 56, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            A request comes in. Four stations turn it into a decision the regulator can replay.
          </h2>
        </div>

        {/* Walk-through: INPUT → 4 stations → RECEIPT */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <VizFactoryWalkthrough />
        </div>

        <p className="mt-4 font-mono uppercase tracking-[0.22em] text-center" style={{ fontSize: 12, color: SUBTLE }}>
          AACE v3.1 runtime · live in production · model-agnostic (Claude · GPT · Gemini · on-prem)
        </p>
      </div>
    </Shell>
  );
}

// 06 · Why now (Lens + crossing curves) ────────────────────────────────────
function S06WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Why now" n={n} total={t}
      topic="Where the spend moves"
      framing="Cheaper tokens are not bad news. They are the trigger for the control layer to exist."
      payload={{
        market: {
          kicker: "What the market is reading",
          headline: "Tokens cheaper. Margins worse.",
          viz: <VizTokenDown />,
          vizLabel: "Chart · per-token price, 2024 → 2028",
          items: [
            { h: "Race to the bottom", v: "Whoever wraps the cheapest model wins." },
            { h: "Commodity AI",       v: "The interesting work moves into labs." },
            { h: "Seat fatigue",       v: "Buyers stop renewing generic copilots." },
          ],
        },
        operator: {
          kicker: "What actually happens to the spend",
          headline: "Tokens cheaper. Governed AI work explodes.",
          viz: <VizCrossingCurves />,
          vizLabel: "Chart · token cost ↓ × governed decisions ↑, with crossover",
          items: [
            { h: "100×",          v: "more AI tasks once cost drops below decision value." },
            { h: "Policy lag",    v: "Each new task surfaces a missing standard. Demand compounds." },
            { h: "Audit pressure", v: "EU AI Act, sectoral regulators. Replayability is non-optional." },
          ],
          signal: "Spend moves from raw inference to the control surface around every important output.",
        },
      }}
      bottomLine="Foundation models commoditise intelligence. They make the governance layer unavoidable."
    />
  );
}

// 07 · Weekend objection (Lens + iceberg) ──────────────────────────────────
function S07Weekend({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 01" n={n} total={t}
      topic="'Anyone builds this in a weekend'"
      framing="The weekend project automates text. It does not certify work."
      payload={{
        market: {
          kicker: "What looks like the product",
          headline: "Model API plus a chat UI is the product.",
          viz: <VizWeekendDemo />,
          vizLabel: "Code · 6 lines that look like the product",
          items: [
            { h: "Clever system prompt", v: "Looks like a method. Is one paragraph." },
            { h: "PDFs in a vector store", v: "Search dressed up as governance." },
            { h: "Manual maintenance",   v: "Drifts the moment the team rotates." },
          ],
        },
        operator: {
          kicker: "What survives a year in production",
          headline: "What survives audit, handover, and a year of org change.",
          viz: <VizIceberg />,
          vizLabel: "Diagram · iceberg · 10% chat UI, 90% governance plumbing",
          items: [
            { h: "Workflow control",       v: "Across roles, approvals and tools." },
            { h: "Typed standards",        v: "Ownership, expiry, versioning, change control." },
            { h: "Signed receipts",        v: "That survive turnover and audit." },
          ],
          signal: "The visible demo is easy. The institution is what blocks the weekend project.",
        },
      }}
      bottomLine="If a weekend was enough, the company would have already shipped it."
    />
  );
}

// 08 · Lab objection (Lens + governance triangle) ──────────────────────────
function S08Lab({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Objection 02" n={n} total={t}
      topic="'Anthropic / OpenAI absorbs this'"
      framing="Foundation labs are suppliers. They cannot become the customer's auditor."
      payload={{
        market: {
          kicker: "What the lab roadmap looks like",
          headline: "The lab ships this feature next quarter.",
          viz: <VizLabExpansion />,
          vizLabel: "Diagram · adjacent lab features, none of them the layer",
          items: [
            { h: "Memory in Claude",   v: "Looks adjacent. Solves a different problem." },
            { h: "Custom GPTs",        v: "Per-user knobs, not org-wide governance." },
            { h: "Enterprise tier",    v: "Same model, bigger contract, no control surface." },
          ],
        },
        operator: {
          kicker: "Why the regulator does not accept that",
          headline: "No regulated buyer accepts the vendor as the auditor of the vendor.",
          viz: <VizGovernanceStack />,
          vizLabel: "Diagram · governance stack · regulator ↑ control ↑ models",
          items: [
            { h: "Neutrality",     v: "Buyers run several models. The layer cannot be owned by one." },
            { h: "Sovereignty",    v: "Standards and receipts are the buyer's operational IP." },
            { h: "Accountability", v: "The model generates. It cannot certify itself." },
          ],
          signal: "Whoever owns the governance position is the one the regulator calls.",
        },
      }}
      bottomLine="That role is not for sale to the model vendor."
    />
  );
}

// 09 · Business model (Lens + value bar) ───────────────────────────────────
function S09Model({ n, t }: { n: number; t: number }) {
  return (
    <LensSlide
      section="Business model" n={n} total={t}
      topic="What we charge for"
      framing="We do not sell tokens or seats. We sell governed decisions."
      payload={{
        market: {
          kicker: "How AI is priced today",
          headline: "Mark up tokens. Charge per seat. Pray for retention.",
          viz: <VizSeatDecay />,
          vizLabel: "Chart · per-seat revenue decay after rollout",
          items: [
            { h: "Per-seat SaaS",  v: "Decays the moment the org questions adoption." },
            { h: "Token reseller", v: "Margin compresses every quarter." },
            { h: "Usage-only",     v: "Invisible until the bill arrives." },
          ],
        },
        operator: {
          kicker: "How we price it",
          headline: "Price the accountable work unit. Model cost is a pass-through.",
          viz: <VizValueBar />,
          vizLabel: "Chart · value vs. price vs. cost, per governed decision",
          items: [
            { h: "€0.40 / decision",     v: "What the customer pays per governed output." },
            { h: "€0.04 model + infra", v: "Pass-through. Falls every quarter." },
            { h: "€23 displaced labour", v: "The value anchor. What we are pricing against." },
          ],
          signal: "Cheaper tokens multiply decisions. Margin expands, not contracts.",
        },
      }}
      bottomLine="Value is anchored to displaced labour, not marked-up tokens."
    />
  );
}

// 10 · Proof (big numbers + tiny sparklines) ───────────────────────────────
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
          <h2 className="font-black" style={{ fontSize: 60, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            One regulated vertical. CTO-sponsored. In production.
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {stats.map((s, i) => (
            <div key={s.l} className="rounded-2xl p-7 flex flex-col"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-mono" style={{ fontSize: 11, color: SUBTLE, letterSpacing: "0.22em" }}>0{i + 1}</p>
              <p className="font-black mt-3" style={{ fontSize: 64, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.v}</p>
              {/* tiny sparkline / glyph per stat */}
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
          The wedge is live, not theoretical. The same playbook lifts into pharma, financial services and life sciences next.
        </p>
        <p className="mt-3 font-mono uppercase tracking-[0.24em]" style={{ fontSize: 11, color: SUBTLE }}>
          Source: AACE v3.1 runtime · regulated AEC deployment · 12-month rolling window · CTO-sponsored, anonymised on request.
        </p>
      </div>
    </Shell>
  );
}

// 11 · Moat (sediment layers) ──────────────────────────────────────────────
function S11Moat({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="Moat" n={n} total={t}>
      <AtomMoatBody />
    </Shell>
  );
}

function AtomMoatBody() {
  const cards = [
    {
      vendor: "RAG chunk",
      kind: "Vector-retrieved passage",
      atom: "A text chunk",
      good: "Surfaces what a document says when a query looks similar.",
      gap: "Descriptive, not prescriptive. No owner, no version, no approval, no cost attribution. The model still decides what to do with it.",
      tone: "muted" as const,
    },
    {
      vendor: "Notion / Confluence page",
      kind: "Wiki documentation",
      atom: "A page",
      good: "Human-readable reference. Easy to author, easy to share.",
      gap: "AI-opaque. No machine-readable trigger, no enforcement, no audit lineage from page to decision. Read once, ignored under pressure.",
      tone: "muted" as const,
    },
    {
      vendor: "Agent prompt",
      kind: "LangChain / system prompt",
      atom: "A prompt string",
      good: "Tells one LLM call how to behave. Fast to ship for engineers.",
      gap: "Lives in a git commit. No business owner, no approval gate, no expiry, no token budget. Drifts silently between releases.",
      tone: "muted" as const,
    },
    {
      vendor: "LIZA",
      kind: "The AI Governance Loop",
      atom: "A Block",
      good: "Typed (Directive · Knowledge · Procedure · Preference). Owner-signed, versioned, compiled JIT into every AI moment, audited on the way out. Blocks compose into Playbooks. Playbooks compose into Org-as-Code.",
      gap: "Carries the rule, the judgment, the memory, the cost and the audit trail in one governed unit. Pages, prompts and chunks all collapse into it.",
      tone: "win" as const,
    },
  ];
  return (
    <div className="absolute inset-0 px-20 pt-24 pb-16 flex flex-col">
      <div className="mb-6">
        <p className="font-mono uppercase tracking-[0.3em] mb-3" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>
          The atom · the Block
        </p>
        <h2 className="font-black" style={{ fontSize: 50, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
          Every AI org has a smallest unit. Most picked something the org cannot govern. We picked the Block.
        </h2>
        <p className="mt-4" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
          A Block is the smallest typed, owner-signed unit of how your org thinks: one Directive, Knowledge item, Procedure, or Preference. Blocks compose into Playbooks. Playbooks compose into Org-as-Code. Every AI moment of work compiles from that corpus, just in time, with a receipt.
        </p>
      </div>
      <div className="flex-1 grid grid-cols-4 gap-5 min-h-0">
        {cards.map((c) => {
          const isWin = c.tone === "win";
          return (
            <div
              key={c.vendor}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: isWin ? `hsl(${GREEN} / 0.08)` : CARD_ALT,
                border: `1px solid ${isWin ? `hsl(${GREEN} / 0.45)` : CHROME_BORDER}`,
              }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-black" style={{ fontSize: 26, color: isWin ? `hsl(${GREEN})` : TEXT, letterSpacing: "-0.02em" }}>
                  {c.vendor}
                </p>
                {isWin && (
                  <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 9, color: `hsl(${GREEN})` }}>
                    Our atom
                  </span>
                )}
              </div>
              <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 10, color: SUBTLE }}>
                {c.kind}
              </p>
              <div className="mb-4">
                <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 10, color: isWin ? `hsl(${GREEN})` : `hsl(${GOLD})` }}>
                  Atom
                </p>
                <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.015em" }}>
                  {c.atom}
                </p>
              </div>
              <div className="mb-4">
                <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 10, color: SUBTLE }}>
                  Carries
                </p>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{c.good}</p>
              </div>
              <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${isWin ? `hsl(${GREEN} / 0.3)` : CHROME_BORDER}` }}>
                <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 10, color: isWin ? `hsl(${GREEN})` : `hsl(${RED})` }}>
                  {isWin ? "Why it nests everything else" : "What it cannot carry"}
                </p>
                <p style={{ fontSize: 14, color: isWin ? TEXT : MUTED, lineHeight: 1.4 }}>{c.gap}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl px-7 py-4 flex items-center gap-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
        <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 12, color: SUBTLE }}>The moat</span>
        <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.25, letterSpacing: "-0.014em" }}>
          Chunks recall. Pages reference. Prompts instruct. A Block governs and proves it ran. The customer accumulates Blocks, compounds them into Playbooks, and cannot get that corpus back from a vendor swap.
        </p>
      </div>
    </div>
  );
}

// 12 · Team ────────────────────────────────────────────────────────────────
function S12Team({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="Team" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <p className="font-mono uppercase tracking-[0.3em] mb-6" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>
          Why this team
        </p>
        <h2 className="font-black mb-12" style={{ fontSize: 72, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1500 }}>
          15+ years putting data and AI architectures into production inside regulated enterprises.
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { h: "Built it",   d: "Productionised data and AI platforms across pharma, finance and industrial operators. Not a research lab, not a deck.", glyph: <svg width="40" height="40" viewBox="0 0 40 40"><rect x="6" y="20" width="8" height="14" fill={`hsl(${GREEN})`}/><rect x="16" y="12" width="8" height="22" fill={`hsl(${GREEN})`}/><rect x="26" y="6" width="8" height="28" fill={`hsl(${GREEN})`}/></svg> },
            { h: "Sold it",    d: "Closed the first CTO-sponsored regulated deployment with the founding team — same operators we sell to.", glyph: <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke={`hsl(${GREEN})`} strokeWidth="2"/><path d="M 12 20 L 18 26 L 28 14" stroke={`hsl(${GREEN})`} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { h: "Audited it", d: "Walked auditors, risk and procurement through receipts. The control surface was designed from those rooms.", glyph: <svg width="40" height="40" viewBox="0 0 40 40"><path d="M 20 4 L 32 10 L 32 22 Q 32 32 20 36 Q 8 32 8 22 L 8 10 Z" fill="none" stroke={`hsl(${GREEN})`} strokeWidth="2"/></svg> },
          ].map((p) => (
            <div key={p.h} className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              {p.glyph}
              <p className="font-black mt-4" style={{ fontSize: 28, color: TEXT, letterSpacing: "-0.02em" }}>{p.h}</p>
              <p className="mt-3" style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// 13 · Ask (stacked bar) ───────────────────────────────────────────────────
function S13Ask({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="The ask" n={n} total={t}>
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col">
        <div className="mb-8 flex items-baseline gap-10">
          <h2 className="font-black" style={{ fontSize: 128, color: `hsl(${GREEN})`, letterSpacing: "-0.05em", lineHeight: 1 }}>€2M</h2>
          <div>
            <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>Seed round</p>
            <p className="font-black mt-2" style={{ fontSize: 34, color: TEXT, letterSpacing: "-0.025em", lineHeight: 1.1, maxWidth: 1100 }}>
              Turn one working factory into a repeatable company.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <VizAskBar />
        </div>
        <div className="rounded-xl px-7 py-5 flex items-center gap-6"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Series A milestone</span>
          <p className="font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>
            3 verticals live · Day-30 deploy · metered governed decisions · governance spend grows while model cost falls.
          </p>
        </div>
      </div>
    </Shell>
  );
}

// 14 · Close ───────────────────────────────────────────────────────────────
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

// ═════════════════════════════════════════════════════════════════════════════
// 9-slide investor spine. Every slide carries ONE idea, anchored by ONE diagram.
// Visual grammar is consistent across the deck:
//   • the ladder       Block → Playbook → Org-as-Code     (the unit)
//   • the loop         Lock → Compile → Sign → Learn      (the runtime)
//   • the moment       request → corpus → model → receipt (the product)
// ═════════════════════════════════════════════════════════════════════════════

function StoryBadge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" | "red" }) {
  const color = tone === "green" ? GREEN : tone === "red" ? RED : GOLD;
  return (
    <span className="font-mono uppercase tracking-[0.28em] rounded-full px-5 py-2"
      style={{ fontSize: 14, color: `hsl(${color})`, background: `hsl(${color} / 0.09)`, border: `1px solid hsl(${color} / 0.28)` }}>
      {children}
    </span>
  );
}

// Frame: badge + headline (no subline by default). Visual carries the meaning.
function StorySlide({ section, n, t, badge, headline, dark = false, children, footnote }: {
  section: string; n: number; t: number; badge: string; headline: React.ReactNode;
  dark?: boolean; children: React.ReactNode; footnote?: string;
}) {
  return (
    <Shell section={section} n={n} total={t} dark={dark}>
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <div className="mb-8">
          <StoryBadge>{badge}</StoryBadge>
          <h2 className="font-black mt-6"
            style={{ fontSize: 64, lineHeight: 1.02, color: dark ? "hsl(0 0% 98%)" : TEXT, letterSpacing: "-0.04em", maxWidth: 1620 }}>
            {headline}
          </h2>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
        {footnote && (
          <p className="mt-5 font-mono uppercase tracking-[0.24em]" style={{ fontSize: 12, color: SUBTLE }}>{footnote}</p>
        )}
      </div>
    </Shell>
  );
}

// ─── Shared visual primitives ────────────────────────────────────────────────

// The concept ladder. Reused on Cover, Block and Compounding slides so the
// reader always sees the same shape (atom → molecule → corpus).
function ConceptLadder({ active = "all", dark = false }: { active?: "block" | "playbook" | "org" | "all"; dark?: boolean }) {
  const text = dark ? "hsl(0 0% 96%)" : TEXT;
  const muted = dark ? "hsl(0 0% 68%)" : MUTED;
  const rows = [
    { k: "block",    label: "BLOCK",       title: "the atom",     copy: "one Directive · Knowledge · Procedure · Preference", w: 360,  color: GREEN },
    { k: "playbook", label: "PLAYBOOK",    title: "the molecule", copy: "Blocks composed into how a workflow gets done",       w: 620,  color: GOLD  },
    { k: "org",      label: "ORG-AS-CODE", title: "the corpus",   copy: "every Playbook the company runs, versioned",          w: 880,  color: ACCENT },
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      {rows.map((r) => {
        const on = active === "all" || active === r.k;
        return (
          <div key={r.k} className="rounded-xl flex items-center gap-5 px-6 py-4"
            style={{
              width: r.w,
              background: on ? `hsl(${r.color} / 0.10)` : `hsl(${r.color} / 0.03)`,
              border: `1.5px solid hsl(${r.color} / ${on ? 0.55 : 0.18})`,
              boxShadow: on ? `0 0 22px hsl(${r.color} / 0.18)` : "none",
              opacity: on ? 1 : 0.55,
            }}>
            <p className="font-mono uppercase tracking-[0.22em] shrink-0"
              style={{ fontSize: 11, color: `hsl(${r.color})`, minWidth: 110 }}>{r.label}</p>
            <div className="flex-1 flex items-baseline gap-3">
              <p className="font-black" style={{ fontSize: 22, color: text, letterSpacing: "-0.015em" }}>{r.title}</p>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.3 }}>· {r.copy}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Compounding curve. Time on x, accumulated Blocks on y, with milestone markers.
function CompoundingCurve() {
  return (
    <svg viewBox="0 0 720 360" className="w-full h-full">
      <line x1="60" y1="320" x2="700" y2="320" stroke={CHROME_BORDER} strokeWidth="1" />
      <line x1="60" y1="30"  x2="60"  y2="320" stroke={CHROME_BORDER} strokeWidth="1" />
      {[1,2,3,4].map(i => (
        <line key={i} x1="60" y1={320 - i*60} x2="700" y2={320 - i*60} stroke={CHROME_BORDER} strokeWidth="0.5" strokeDasharray="2 5" />
      ))}
      {/* compounding curve */}
      <path d="M 60 310 Q 240 305 360 240 T 700 50"
        stroke={`hsl(${GREEN})`} strokeWidth="3.5" fill="none" />
      <path d="M 60 310 Q 240 305 360 240 T 700 50 L 700 320 L 60 320 Z"
        fill={`hsl(${GREEN} / 0.08)`} stroke="none" />
      {/* milestone markers */}
      {[
        { x: 150, y: 300, k: "01", label: "First Blocks", note: "captured from real corrections" },
        { x: 360, y: 240, k: "02", label: "Playbooks form", note: "workflows compile from the corpus" },
        { x: 600, y: 90,  k: "03", label: "Org-as-Code",   note: "company runs from its own corpus" },
      ].map((m) => (
        <g key={m.k}>
          <circle cx={m.x} cy={m.y} r="7" fill={`hsl(${GREEN})`} stroke={BG} strokeWidth="3" />
          <text x={m.x + 14} y={m.y - 10} fontSize="14" fontWeight="800" fill={TEXT}>{m.label}</text>
          <text x={m.x + 14} y={m.y + 8}  fontSize="11" fill={MUTED} fontFamily="ui-monospace,monospace">{m.note}</text>
        </g>
      ))}
      {/* axis labels */}
      <text x="380" y="350" fontSize="11" fill={SUBTLE} textAnchor="middle" fontFamily="ui-monospace,monospace">months of operation →</text>
      <text x="30"  y="180" fontSize="11" fill={SUBTLE} textAnchor="middle" fontFamily="ui-monospace,monospace" transform="rotate(-90 30 180)">accumulated operational IP →</text>
      {/* dashed competitor line */}
      <path d="M 60 310 L 700 280" stroke={`hsl(${RED})`} strokeWidth="2" fill="none" strokeDasharray="6 6" opacity="0.7" />
      <text x="700" y="272" fontSize="11" fill={`hsl(${RED})`} textAnchor="end" fontWeight="700">ungoverned AI · flat learning</text>
    </svg>
  );
}

// ─── Slides ──────────────────────────────────────────────────────────────────

// 01 · Cover. One title. One sentence. The concept ladder so the reader sees
// the unit before they read any slide.
function S01StoryCover({ n, t }: { n: number; t: number }) {
  return (
    <Shell section="LIZA OS" n={n} total={t} dark>
      {/* faint dot field */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 1920 1080">
        {Array.from({ length: 18 }).map((_, r) =>
          Array.from({ length: 30 }).map((_, c) => {
            const seed = (r * 37 + c * 17) % 100;
            return <circle key={`${r}-${c}`} cx={120 + c * 58} cy={120 + r * 50} r={2.2}
              fill={c % 5 === 0 ? `hsl(${GREEN})` : "hsl(0 0% 100%)"} opacity={0.25 + seed / 400} />;
          })
        )}
      </svg>
      <div className="absolute inset-0 px-28 py-24 flex flex-col justify-between">
        <div className="flex justify-between items-start relative z-10">
          <StoryBadge>Seed · €2M · Investor deck</StoryBadge>
          <p className="font-mono uppercase tracking-[0.28em]" style={{ fontSize: 13, color: "hsl(0 0% 62%)" }}>Confidential</p>
        </div>
        <div className="relative z-10">
          <h1 className="font-black" style={{ fontSize: 168, lineHeight: 0.92, color: "hsl(0 0% 98%)", letterSpacing: "-0.06em" }}>LIZA OS</h1>
          <p className="mt-8" style={{ fontSize: 42, color: "hsl(0 0% 82%)", lineHeight: 1.15, maxWidth: 1340 }}>
            The governance layer that turns enterprise AI into accountable work.
          </p>
        </div>
        <div className="relative z-10 flex justify-center">
          <ConceptLadder dark />
        </div>
      </div>
    </Shell>
  );
}

// 02 · Problem. The shift: from one chat to a thousand AI moments per day.
// Visual: one chat box on the left, swarm of governed moments on the right.
function S02StoryScale({ n, t }: { n: number; t: number }) {
  return (
    <StorySlide section="Problem" n={n} t={t}
      badge="The shift · one chat to a thousand AI moments"
      headline="Enterprise AI is no longer about model access. It is about governing a thousand AI moments a day.">
      <div className="grid grid-cols-[0.7fr_1.3fr] gap-7 h-full">
        {/* TODAY · one isolated chat */}
        <div className="rounded-2xl p-8 flex flex-col"
          style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.28)` }}>
          <div className="rounded-full px-5 py-2 self-start font-mono uppercase tracking-[0.24em]"
            style={{ fontSize: 22, color: `hsl(${RED})`, background: `hsl(${RED} / 0.12)`, border: `1.5px solid hsl(${RED} / 0.5)` }}>
            Yesterday
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="rounded-2xl px-8 py-7 text-center"
              style={{ background: BG, border: `1.5px dashed hsl(${RED} / 0.5)`, minWidth: 280 }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 11, color: SUBTLE }}>one chat</p>
              <p className="font-black" style={{ fontSize: 44, color: TEXT, lineHeight: 1 }}>1 person<br/>1 prompt<br/>1 reply</p>
              <p className="mt-4 font-mono" style={{ fontSize: 11, color: `hsl(${RED})` }}>nothing the org keeps</p>
            </div>
          </div>
          <p className="mt-4" style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>
            Useful for the individual. Impossible to audit, improve, or compound for the organization.
          </p>
        </div>
        {/* TODAY/TOMORROW · a swarm of governed moments */}
        <div className="rounded-2xl p-8 flex flex-col"
          style={{ background: `hsl(${GREEN} / 0.07)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
          <div className="rounded-full px-5 py-2 self-start font-mono uppercase tracking-[0.24em]"
            style={{ fontSize: 22, color: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.14)`, border: `1.5px solid hsl(${GREEN} / 0.55)`, boxShadow: `0 0 14px hsl(${GREEN} / 0.25)` }}>
            Today &nbsp;·&nbsp; and from now on
          </div>
          <div className="flex-1 flex items-center justify-center py-3">
            <div className="grid grid-cols-14 gap-1.5" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))", width: "100%" }}>
              {Array.from({ length: 14 * 9 }).map((_, i) => {
                const isPolicy   = i % 17 === 0;
                const isApprover = i % 11 === 0;
                const isReceipt  = i % 5 === 0;
                const c = isPolicy ? GOLD : isApprover ? ACCENT : isReceipt ? GREEN : GREEN;
                const op = isPolicy || isApprover ? 0.85 : 0.22 + ((i * 7) % 5) * 0.12;
                return <span key={i} className="rounded-sm" style={{ height: 22, background: `hsl(${c} / ${op})`, border: `1px solid hsl(${c} / 0.35)` }} />;
              })}
            </div>
          </div>
          <p className="font-black mt-4" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            employees × workflows × policies × approvals × receipts
          </p>
          <div className="mt-3 flex gap-5 font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11 }}>
            <span style={{ color: `hsl(${GREEN})` }}>■ governed moment</span>
            <span style={{ color: `hsl(${GOLD})` }}>■ policy in play</span>
            <span style={{ color: `hsl(${ACCENT})` }}>■ approver signed</span>
          </div>
        </div>
      </div>
    </StorySlide>
  );
}

// 03 · Failure. Without governance every AI call invents the company again.
// Visual: one model output with 4 missing-band stamps (concrete, not abstract).
function S03StoryFailure({ n, t }: { n: number; t: number }) {
  const gaps = [
    { k: "no context",   d: "the model uses whatever the user remembers, not the approved way of working" },
    { k: "no owner",     d: "nobody can name the business rule used, who approved it, or when it expires" },
    { k: "no receipt",   d: "the output cannot be replayed with inputs, policy, model and approver attached" },
    { k: "no learning",  d: "the correction stays trapped in the thread; the next employee repeats the gap" },
  ];
  return (
    <StorySlide section="Failure mode" n={n} t={t}
      badge="Why ungoverned AI fails at scale"
      headline="Every ungoverned AI call invents the company again.">
      <div className="grid grid-cols-[1fr_1.3fr] gap-8 h-full">
        {/* the bare output */}
        <div className="rounded-2xl p-10 flex flex-col items-center justify-center"
          style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.28)` }}>
          <div className="rounded-full px-6 py-2.5 mb-8 font-mono uppercase tracking-[0.24em]"
            style={{ fontSize: 22, color: `hsl(${RED})`, background: `hsl(${RED} / 0.12)`, border: `1.5px solid hsl(${RED} / 0.5)` }}>
            One AI output · no governance
          </div>
          <div className="rounded-xl px-5 py-3 mb-5 w-full"
            style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 11, color: SUBTLE }}>The request</p>
            <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.25 }}>
              "Prepare our response to the €40M RFP from the city of Hamburg."
            </p>
          </div>
          <div className="rounded-2xl px-8 py-7 w-full"
            style={{ background: BG, border: `2px dashed hsl(${RED} / 0.55)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 12, color: SUBTLE }}>model output, 4 seconds later</p>
            <p className="font-black" style={{ fontSize: 32, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              A 12-page response.<br/>
              <span style={{ color: `hsl(${RED})` }}>Confident. Coherent. Unaccountable.</span>
            </p>
            <p className="mt-4 font-mono" style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
              · cites pricing that expired last quarter<br/>
              · uses a compliance clause we no longer offer<br/>
              · references a case study legal redacted<br/>
              · nobody signed it; nobody can find out who didn't
            </p>
          </div>
          <p className="mt-6 text-center font-bold" style={{ fontSize: 18, color: `hsl(${RED})`, maxWidth: 480, lineHeight: 1.35 }}>
            Reads like the company. Carries nothing the company can stand on.
          </p>
        </div>
        {/* the four missing bands */}
        <div className="flex flex-col gap-3 justify-center">
          {gaps.map((g, i) => (
            <div key={g.k} className="rounded-xl px-6 py-4 flex items-center gap-5"
              style={{ background: CARD_ALT, border: `1px solid hsl(${RED} / 0.28)` }}>
              <span className="font-mono" style={{ fontSize: 12, color: SUBTLE, letterSpacing: "0.22em", minWidth: 28 }}>0{i + 1}</span>
              <div className="rounded-md px-3 py-1.5 font-mono uppercase tracking-[0.18em] shrink-0"
                style={{ fontSize: 12, color: `hsl(${RED})`, background: `hsl(${RED} / 0.1)`, border: `1px solid hsl(${RED} / 0.4)`, minWidth: 150, textAlign: "center" }}>
                {g.k}
              </div>
              <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.35 }}>{g.d}</p>
            </div>
          ))}
        </div>
      </div>
    </StorySlide>
  );
}

// 04 · Guide · LIZA. The actual loop diagram. Plain-English captions under it.
function S04StoryGuide({ n, t }: { n: number; t: number }) {
  return (
    <StorySlide section="Guide · meet LIZA" n={n} t={t}
      badge="What LIZA actually does"
      headline="LIZA sits between the person and the model. Same request, two very different outputs.">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-8 h-full items-stretch">
        {/* WITHOUT */}
        <div className="rounded-2xl p-8 flex flex-col"
          style={{ background: `hsl(${RED} / 0.04)`, border: `1px solid hsl(${RED} / 0.3)` }}>
          <div className="rounded-full px-5 py-2 self-start font-mono uppercase tracking-[0.24em] mb-6"
            style={{ fontSize: 18, color: `hsl(${RED})`, background: `hsl(${RED} / 0.12)`, border: `1.5px solid hsl(${RED} / 0.5)` }}>
            Without LIZA
          </div>
          <div className="rounded-xl px-5 py-4 mb-5" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 11, color: SUBTLE }}>The request</p>
            <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.25 }}>"Draft a proposal for the Munich school project."</p>
          </div>
          <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 11, color: SUBTLE }}>Goes straight to the model</p>
          <div className="rounded-xl p-6 flex-1 flex flex-col justify-center"
            style={{ background: BG, border: `2px dashed hsl(${RED} / 0.5)` }}>
            <p className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.1 }}>A plausible draft.</p>
            <p className="mt-4" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>
              Uses whatever the user remembers. No source. No approval. No receipt. The next person starts from scratch.
            </p>
          </div>
        </div>

        {/* LIZA arrow */}
        <div className="flex flex-col items-center justify-center gap-4 px-2">
          <div className="rounded-2xl px-6 py-8 text-center"
            style={{ background: BG, border: `2px solid hsl(${GREEN})`, boxShadow: `0 0 24px hsl(${GREEN} / 0.25)` }}>
            <p className="font-mono uppercase tracking-[0.28em] mb-2" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>LIZA</p>
            <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1, letterSpacing: "-0.02em" }}>LOCK</p>
            <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1, letterSpacing: "-0.02em" }}>COMPILE</p>
            <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1, letterSpacing: "-0.02em" }}>SIGN</p>
            <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1, letterSpacing: "-0.02em" }}>LEARN</p>
            <p className="mt-3 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: SUBTLE }}>once, per call</p>
          </div>
          <p className="font-mono" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>→</p>
        </div>

        {/* WITH */}
        <div className="rounded-2xl p-8 flex flex-col"
          style={{ background: `hsl(${GREEN} / 0.07)`, border: `1.5px solid hsl(${GREEN} / 0.5)`, boxShadow: `0 0 22px hsl(${GREEN} / 0.12)` }}>
          <div className="rounded-full px-5 py-2 self-start font-mono uppercase tracking-[0.24em] mb-6"
            style={{ fontSize: 18, color: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.14)`, border: `1.5px solid hsl(${GREEN} / 0.55)` }}>
            With LIZA
          </div>
          <div className="rounded-xl px-5 py-4 mb-5" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 11, color: SUBTLE }}>Same request</p>
            <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.25 }}>"Draft a proposal for the Munich school project."</p>
          </div>
          <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Routed through the governance loop</p>
          <div className="rounded-xl p-6 flex-1 flex flex-col justify-center"
            style={{ background: BG, border: `2px solid hsl(${GREEN})` }}>
            <p className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.1 }}>The same draft &mdash; with a receipt.</p>
            <div className="mt-4 grid grid-cols-1 gap-1.5 font-mono" style={{ fontSize: 14, color: TEXT }}>
              <p>· standard: AEC-PROP v3.2</p>
              <p>· evidence: 12 hashed sources</p>
              <p>· model: claude-3.5</p>
              <p>· approver: M. Schäfer · 14:02</p>
            </div>
            <p className="mt-4 font-bold" style={{ fontSize: 16, color: `hsl(${GREEN})`, lineHeight: 1.35 }}>
              Replayable. Owned. The next call inherits the correction.
            </p>
          </div>
        </div>
      </div>
    </StorySlide>
  );
}

// 05 · The Block. Anatomy of one Block on the left. Ladder on the right so the
// reader sees how Blocks compose upward.
function S05StoryBlock({ n, t }: { n: number; t: number }) {
  return (
    <StorySlide section="The unit · the Block" n={n} t={t}
      badge="The atom"
      headline="A Block is one rule the company has agreed on, written down, signed, and version-controlled.">
      <div className="grid grid-cols-[1fr_1fr] gap-12 h-full items-center">
        {/* ONE concrete Block — looks like a card, not a spec sheet */}
        <div className="rounded-2xl p-10"
          style={{ background: `hsl(${GREEN} / 0.07)`, border: `2px solid hsl(${GREEN})`, boxShadow: `0 0 30px hsl(${GREEN} / 0.18)` }}>
          <div className="rounded-full px-5 py-2 self-start font-mono uppercase tracking-[0.24em] inline-block mb-6"
            style={{ fontSize: 18, color: `hsl(${GREEN})`, background: `hsl(${GREEN} / 0.14)`, border: `1.5px solid hsl(${GREEN} / 0.5)` }}>
            One Block
          </div>
          <p className="font-black" style={{ fontSize: 38, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            "Proposals for school projects use AEC-PROP v3.2 cooling-load tables.<br/>
            <span style={{ color: `hsl(${GREEN})` }}>Do not interpolate above 35°C.</span>"
          </p>
          <div className="mt-7 pt-5 grid grid-cols-3 gap-4" style={{ borderTop: `1px solid hsl(${GREEN} / 0.3)` }}>
            <div>
              <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: SUBTLE }}>Owner</p>
              <p className="font-bold mt-1" style={{ fontSize: 18, color: TEXT }}>M. Schäfer</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: SUBTLE }}>Version</p>
              <p className="font-bold mt-1" style={{ fontSize: 18, color: TEXT }}>v3 · signed</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: SUBTLE }}>Expires</p>
              <p className="font-bold mt-1" style={{ fontSize: 18, color: TEXT }}>2026-Q1</p>
            </div>
          </div>
        </div>

        {/* How Blocks scale up — the ladder, but with bigger plain-English labels */}
        <div className="flex flex-col gap-5">
          <p className="font-mono uppercase tracking-[0.24em]" style={{ fontSize: 14, color: SUBTLE }}>Blocks scale into bigger things</p>
          {[
            { k: "BLOCK",       size: 30, title: "one rule",        copy: "what you just saw on the left", color: GREEN },
            { k: "PLAYBOOK",    size: 30, title: "a workflow",      copy: "many Blocks composed to get one job done", color: GOLD },
            { k: "ORG-AS-CODE", size: 30, title: "the whole company", copy: "every Playbook the company runs, versioned", color: ACCENT },
          ].map((r, i) => (
            <div key={r.k} className="rounded-xl p-6 flex items-center gap-6"
              style={{ background: `hsl(${r.color} / 0.07)`, border: `1.5px solid hsl(${r.color} / 0.4)` }}>
              <p className="font-black tracking-[0.08em]" style={{ fontSize: r.size, color: `hsl(${r.color})`, minWidth: 240 }}>{r.k}</p>
              <div>
                <p className="font-black" style={{ fontSize: 24, color: TEXT, letterSpacing: "-0.02em" }}>{r.title}</p>
                <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35, marginTop: 2 }}>{r.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StorySlide>
  );
}

// 06 · The Moment. The product is the moment. Use the factory walk-through:
// one request → 4 stations → signed receipt. This is the deepest "how" slide.
function S06StoryMoment({ n, t }: { n: number; t: number }) {
  return (
    <StorySlide section="The product · the moment" n={n} t={t}
      badge="What we actually ship"
      headline="A request comes in. Four stations turn it into one accountable, replayable work unit."
      footnote="AACE v3.1 runtime · live in production · regulated AEC deployment">
      <div className="h-full flex flex-col justify-center">
        <VizFactoryWalkthrough />
      </div>
    </StorySlide>
  );
}

// 07 · Compounding. What the customer accumulates over time. Curve + ladder.
function S07StorySuccess({ n, t }: { n: number; t: number }) {
  return (
    <StorySlide section="What compounds" n={n} t={t}
      badge="The success state"
      headline="The customer does not just use AI. They accumulate the operational IP that makes AI work for them.">
      <div className="grid grid-cols-[1.4fr_1fr] gap-10 h-full items-center">
        <div className="h-full rounded-2xl p-6 flex flex-col"
          style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <p className="font-mono uppercase tracking-[0.26em] mb-2" style={{ fontSize: 12, color: SUBTLE }}>Accumulated operational IP over time</p>
          <div className="flex-1 min-h-0">
            <CompoundingCurve />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-xl px-6 py-5" style={{ background: `hsl(${GREEN} / 0.07)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>First Blocks form</p>
            <p className="font-black mt-2" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>Governance gets established.</p>
            <p className="mt-2" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>The company finally has typed, signed rules that AI must obey. Every output carries a receipt.</p>
          </div>
          <div className="rounded-xl px-6 py-5" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>Playbooks form</p>
            <p className="font-black mt-2" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>AI work scales — and token spend stops bleeding.</p>
            <p className="mt-2" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>Every call compiles only the context it needs. Token-optimised, repeatable, faster with every run.</p>
          </div>
          <div className="rounded-xl px-6 py-5" style={{ background: `hsl(${ACCENT} / 0.07)`, border: `1px solid hsl(${ACCENT} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>Org-as-Code</p>
            <p className="font-black mt-2" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>Your IP is protected in the AI-native era.</p>
            <p className="mt-2" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>The company's setup, judgment and standards live in a corpus you own. Models come and go; the corpus stays.</p>
          </div>
        </div>
      </div>
    </StorySlide>
  );
}

// 08 · Model + Moat. Two paired visuals: pricing geometry + governance stack.
function S08StoryModelMoat({ n, t }: { n: number; t: number }) {
  return (
    <StorySlide section="Business model + moat" n={n} t={t}
      badge="The business model"
      headline="We get paid every time AI does a piece of work the company can stand behind.">
      <div className="flex flex-col gap-7 h-full">
        {/* THREE BIG NUMBERS — the pricing story in one row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GOLD} / 0.1)`, border: `2px solid hsl(${GOLD} / 0.5)` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 14, color: `hsl(${GOLD})` }}>Value to the customer</p>
            <p className="font-black mt-3" style={{ fontSize: 76, color: `hsl(${GOLD})`, letterSpacing: "-0.04em", lineHeight: 1 }}>€23</p>
            <p className="font-bold mt-3" style={{ fontSize: 18, color: TEXT, lineHeight: 1.3 }}>per governed decision</p>
            <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>The analyst hour LIZA replaces.</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GREEN} / 0.1)`, border: `2px solid hsl(${GREEN})`, boxShadow: `0 0 22px hsl(${GREEN} / 0.18)` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>We charge</p>
            <p className="font-black mt-3" style={{ fontSize: 76, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", lineHeight: 1 }}>€0.40</p>
            <p className="font-bold mt-3" style={{ fontSize: 18, color: TEXT, lineHeight: 1.3 }}>per governed decision</p>
            <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>1-2% of the value we unlock. Easy yes.</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 14, color: SUBTLE }}>Our cost</p>
            <p className="font-black mt-3" style={{ fontSize: 76, color: MUTED, letterSpacing: "-0.04em", lineHeight: 1 }}>€0.04</p>
            <p className="font-bold mt-3" style={{ fontSize: 18, color: TEXT, lineHeight: 1.3 }}>model + infra, pass-through</p>
            <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>Falls every quarter. Our margin expands.</p>
          </div>
        </div>

        {/* THE PUNCHLINE — single statement, big */}
        <div className="rounded-2xl p-7 flex items-center gap-8"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `2px solid hsl(${GREEN})` }}>
          <p className="font-black" style={{ fontSize: 88, color: `hsl(${GREEN})`, letterSpacing: "-0.04em", lineHeight: 1 }}>~90%</p>
          <div className="flex-1">
            <p className="font-black" style={{ fontSize: 30, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Gross margin per governed decision. Metered, not seat-priced. Spend scales with AI usage, not headcount.
            </p>
          </div>
        </div>

        {/* MOAT — single line below */}
        <div className="rounded-xl px-7 py-5 flex items-center gap-5"
          style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 14, color: SUBTLE }}>The moat</span>
          <p className="font-bold" style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }}>
            We sit above Claude · GPT · Gemini as the neutral control layer. Models are suppliers; the receipts, standards and corpus belong to the customer — and to us as the system that runs them.
          </p>
        </div>
      </div>
    </StorySlide>
  );
}

// 09 · Team + Ask. €2M, allocation, and the one-line team credibility.
function S09StoryAsk({ n, t }: { n: number; t: number }) {
  const alloc = [
    { p: "50%", h: "Vertical corpus",    d: "deepen AEC; package regulated playbooks for pharma and finance", color: GREEN },
    { p: "30%", h: "Repeatable install", d: "Day-30 deployment, metering, admin, self-serve configuration",   color: GOLD  },
    { p: "20%", h: "Channel + audit kit", d: "partner enablement, regulated buyer proof, audit material",      color: ACCENT },
  ];
  return (
    <StorySlide section="Team + Ask" n={n} t={t}
      badge="€2M seed"
      headline="Fund the repeatable governance layer for AI-native organisations.">
      <div className="grid grid-cols-[0.9fr_1.4fr] gap-10 h-full items-center">
        <div className="rounded-2xl p-9 flex flex-col"
          style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.4)`, boxShadow: `0 0 30px hsl(${GREEN} / 0.15)` }}>
          <p className="font-black" style={{ fontSize: 144, color: `hsl(${GREEN})`, letterSpacing: "-0.07em", lineHeight: 0.85 }}>€2M</p>
          <p className="font-black mt-4" style={{ fontSize: 26, color: TEXT, lineHeight: 1.1 }}>One working wedge → repeatable install motion.</p>
          <div className="mt-7 pt-5" style={{ borderTop: `1px solid hsl(${GREEN} / 0.25)` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-2" style={{ fontSize: 11, color: SUBTLE }}>Team</p>
            <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
              15+ years building data and AI systems inside regulated enterprises. Built it, sold it, walked auditors through it.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {alloc.map((a) => (
            <div key={a.h} className="rounded-xl p-6 flex items-center gap-6"
              style={{ background: `hsl(${a.color} / 0.06)`, border: `1px solid hsl(${a.color} / 0.35)` }}>
              <p className="font-black" style={{ fontSize: 56, color: `hsl(${a.color})`, letterSpacing: "-0.03em", minWidth: 130, lineHeight: 1 }}>{a.p}</p>
              <div className="flex-1">
                <p className="font-black" style={{ fontSize: 24, color: TEXT, letterSpacing: "-0.02em" }}>{a.h}</p>
                <p className="mt-1.5" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{a.d}</p>
              </div>
            </div>
          ))}
          <div className="rounded-xl px-6 py-4 mt-1"
            style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <p className="font-mono uppercase tracking-[0.24em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>Series A milestone</p>
            <p className="font-bold mt-1" style={{ fontSize: 16, color: TEXT, lineHeight: 1.35 }}>
              3 verticals live · Day-30 deploy · metered governed decisions · governance spend rises while model cost falls.
            </p>
          </div>
        </div>
      </div>
    </StorySlide>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const RAW_SLIDES: { id: string; title: string; render: (n: number, t: number) => React.ReactNode }[] = [
  // StoryBrand 9-slide spine. Character → Problem → Guide → Plan → Success → Failure-avoided → Model/Moat → Team → Ask.
  { id: "cover",    title: "Cover · Character",                 render: (n, t) => <S01StoryCover n={n} t={t} /> },
  { id: "problem",  title: "Problem · single chat → 1000 chats", render: (n, t) => <S02StoryScale n={n} t={t} /> },
  { id: "context",  title: "Failure mode · context explosion",  render: (n, t) => <S03StoryFailure n={n} t={t} /> },
  { id: "solution", title: "Guide · meet LIZA, the AI Governance Loop", render: (n, t) => <S04StoryGuide n={n} t={t} /> },
  { id: "block",    title: "Plan A · the Block (the atom)",     render: (n, t) => <S05StoryBlock n={n} t={t} /> },
  { id: "moment",   title: "Plan B · the governed moment",      render: (n, t) => <S06StoryMoment n={n} t={t} /> },
  { id: "success",  title: "Success · what compounds",          render: (n, t) => <S07StorySuccess n={n} t={t} /> },
  { id: "model",    title: "Business model + moat",             render: (n, t) => <S08StoryModelMoat n={n} t={t} /> },
  { id: "ask",      title: "Team + Ask · €2M",                  render: (n, t) => <S09StoryAsk n={n} t={t} /> },
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Investor Deck</span>
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
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
          For the investor tired of AI weekend projects
        </p>
        <h1 className="font-black" style={{ fontSize: 126, lineHeight: 0.94, color: "hsl(0 0% 98%)", letterSpacing: "-0.045em" }}>
          The production control layer<br/>
          <span style={{ color: `hsl(${GREEN})` }}>for AI work.</span>
        </h1>
        <p className="mt-12" style={{ fontSize: 31, lineHeight: 1.35, color: "hsl(0 0% 76%)", maxWidth: 1280 }}>
          LIZA OS sits between Claude, GPT, Gemini and regulated enterprise workflows. It turns AI outputs into governed decisions with standards, evidence and receipts.
        </p>
        <div className="mt-14 flex items-center gap-3 font-mono uppercase tracking-[0.24em]" style={{ fontSize: 13, color: "hsl(0 0% 70%)" }}>
          <span className="px-4 py-2 rounded-full" style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.18)" }}>Prompt</span>
          <span style={{ color: "hsl(0 0% 45%)" }}>→</span>
          <span className="px-4 py-2 rounded-full" style={{ background: `hsl(${GREEN} / 0.12)`, border: `1px solid hsl(${GREEN} / 0.45)`, color: `hsl(${GREEN})` }}>LIZA OS · control layer</span>
          <span style={{ color: "hsl(0 0% 45%)" }}>→</span>
          <span className="px-4 py-2 rounded-full" style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.18)" }}>Governed decision</span>
        </div>
      </div>
    </Slide>
  );
}

// ─── 02 · INVESTOR LENS ─────────────────────────────────────────────────────
function S02InvestorLens({ n, t }: { n: number; t: number }) {
  const belowWater = [
    { k: "Approved method", v: "The company's versioned playbook shaped the answer, not the model's training data. CIOs can finally point to the standard that was applied." },
    { k: "Approval", v: "A named risk officer signed off the flagged section, with timestamp and scope. The CDO has a single source of who approved what." },
    { k: "Model", v: "Multiple models can run, get compared and swapped without losing the audit trail. The CTO keeps optionality across vendors." },
    { k: "Safety", v: "PII redaction, jurisdictional rules and data scope enforced before the call. The CISO gets a controlled perimeter, not a policy PDF." },
    { k: "Cost", v: "Model spend tied to the work unit produced. The CFO finally sees AI as a line item with a denominator, not a runaway invoice." },
  ];
  return (
    <Slide section="Investor lens" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-4" style={{ fontSize: 60, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Every AI pitch sells one chat session. <span style={{ color: `hsl(${GREEN})` }}>We sell the foundation that makes thousands of them scale.</span>
        </h2>

        {/* Above the waterline — what every AI pitch shows */}
        <div className="mt-8 rounded-2xl px-7 py-5 mb-2" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 12, color: SUBTLE }}>What every investor has seen 100 times · a wrapper around one big LLM, one prompt at a time</p>
          <div className="flex items-stretch gap-3 font-mono" style={{ fontSize: 14 }}>
            <div className="flex-1 px-4 py-3 rounded-lg" style={{ background: BG, border: `1px solid ${CHROME_BORDER}`, color: MUTED }}>
              <span className="uppercase tracking-[0.2em] block mb-1" style={{ fontSize: 10, color: SUBTLE }}>Prompt</span>
              "Draft a Q4 underwriting risk memo for client Acme."
            </div>
            <div className="flex items-center" style={{ color: SUBTLE }}>→</div>
            <div className="px-4 py-3 rounded-lg flex items-center" style={{ background: BG, border: `1px solid ${CHROME_BORDER}`, color: MUTED, fontSize: 13 }}>
              ChatGPT · Claude · Copilot
            </div>
            <div className="flex items-center" style={{ color: SUBTLE }}>→</div>
            <div className="flex-1 px-4 py-3 rounded-lg" style={{ background: BG, border: `1px solid ${CHROME_BORDER}`, color: MUTED }}>
              <span className="uppercase tracking-[0.2em] block mb-1" style={{ fontSize: 10, color: SUBTLE }}>Answer</span>
              "Here is the memo. 3 risks identified."
            </div>
          </div>
        </div>

        {/* The waterline */}
        <div className="relative h-5 my-1">
          <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: `hsl(${GREEN} / 0.45)` }} />
          <span className="absolute right-0 -top-1 font-mono uppercase tracking-[0.22em] px-2" style={{ fontSize: 11, color: `hsl(${GREEN})`, background: BG }}>waterline</span>
        </div>

        {/* Below the waterline — what LIZA sells */}
        <div className="rounded-2xl px-7 py-6" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
          <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>What the CFO, CIO, CDO, CTO and CISO need before they let one chat session become ten thousand · this is what LIZA sells</p>
          <div className="grid grid-cols-5 gap-4">
            {belowWater.map((b) => (
              <div key={b.k} className="rounded-xl p-4" style={{ background: BG, border: `1px solid hsl(${GREEN} / 0.3)` }}>
                <p className="font-black mb-2" style={{ fontSize: 22, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{b.k}</p>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{b.v}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-7 font-bold" style={{ fontSize: 22, color: TEXT, lineHeight: 1.35 }}>
          Every other AI company is selling the prompt. LIZA is selling the foundation that lets a company run AI at scale: approved methods, named approvals, model optionality, enforced safety and a cost per work unit.
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
    </Slide>
  );
}

// ─── 04 · SOLUTION UNIT ─────────────────────────────────────────────────────
function S04ProductUnit({ n, t }: { n: number; t: number }) {
  const steps = [
    { k: "BIND", h: "Bind the prompt to a playbook", v: "The user's intent is matched to the company's versioned way of doing the work before any model runs." },
    { k: "EXECUTE", h: "Run the prompt with the right standards", v: "Policies, procedures, decision rules and approved data are compiled fresh into the call. The model executes against the standard, not against its training data." },
    { k: "SIGN", h: "Finalise an auditable output", v: "Every output ships with the evidence behind it: playbook version, data, model, approver and cost. Replayable on demand." },
    { k: "LEARN", h: "Feed what's new back into the standard", v: "Anything new learned in the session updates the playbook. The next prompt starts from a sharper standard." },
  ];
  return (
    <Slide section="Solution" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          LIZA turns each AI task into <span style={{ color: `hsl(${GREEN})` }}>a governed decision.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          One unit. Four steps. A closed loop, model agnostic by design.
        </p>
        <div className="relative grid grid-cols-4 gap-4 mb-2">
          {steps.map((s, i) => (
            <div key={s.k} className="rounded-2xl p-6" style={{ background: `hsl(${GREEN} / 0.045)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono font-black flex items-center justify-center rounded-full" style={{ width: 30, height: 30, fontSize: 13, color: BG, background: `hsl(${GREEN})` }}>{i + 1}</span>
                <span className="font-mono font-black uppercase tracking-[0.22em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>{s.k}</span>
              </div>
              <p className="font-black mb-3" style={{ fontSize: 22, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{s.h}</p>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.42 }}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Feedback loop visualization: arrow from LEARN back to BIND */}
        <div className="relative mt-6 mb-4" style={{ height: 140 }}>
          <svg viewBox="0 0 1000 140" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <marker id="loopArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={`hsl(${GREEN})`} />
              </marker>
            </defs>
            {/* curved arrow from the LEARN card (right) back up to the BIND card (left) */}
            <path d="M 920 5 C 940 130, 60 130, 80 5" fill="none" stroke={`hsl(${GREEN})`} strokeWidth="2.5" strokeDasharray="7 6" markerEnd="url(#loopArrow)" />
          </svg>
          <div className="absolute left-1/2 -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-3"
               style={{ top: 60, background: BG, border: `1.5px solid hsl(${GREEN})` }}>
            <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Every session</span>
            <span style={{ color: SUBTLE }}>→</span>
            <span className="font-bold" style={{ fontSize: 17, color: TEXT, letterSpacing: "-0.01em" }}>sharpens the standard</span>
            <span style={{ color: SUBTLE }}>→</span>
            <span className="font-bold" style={{ fontSize: 17, color: TEXT, letterSpacing: "-0.01em" }}>next prompt starts smarter</span>
          </div>
        </div>

        <div className="rounded-xl px-7 py-4 flex items-center gap-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <span className="font-mono uppercase tracking-[0.22em] px-3 py-1.5 rounded" style={{ fontSize: 11, color: `hsl(${GOLD})`, background: `hsl(${GOLD} / 0.1)`, border: `1px solid hsl(${GOLD} / 0.35)` }}>Example</span>
          <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>
            <span style={{ color: TEXT, fontWeight: 700 }}>Risk memo.</span> Prompt bound to the firm's underwriting playbook. Executed with this quarter's policy. Signed with model, approver, evidence and cost. What the analyst learned about the new client segment is fed back into the playbook for the next memo.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── 05 · WHY NOW ───────────────────────────────────────────────────────────
function S05WhyNow({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Why now" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-4" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          AI spend is rising. <span style={{ color: `hsl(${GREEN})` }}>So is the bill for not governing it.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          The CFO question for 2026: we are spending more on AI every quarter. Where is the control.
        </p>
        <div className="grid grid-cols-[1.25fr_1fr] gap-7 items-stretch">
          {/* The scissors chart */}
          <div className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-1" style={{ fontSize: 12, color: SUBTLE }}>The CFO chart</p>
            <p className="font-bold mb-3" style={{ fontSize: 20, color: TEXT, lineHeight: 1.3, letterSpacing: "-0.015em" }}>
              Tokens get cheaper. Enterprise AI spend keeps climbing.
            </p>
            <svg viewBox="0 0 600 320" className="w-full" style={{ height: 290 }}>
              <defs>
                <linearGradient id="gapFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(${GREEN})`} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={`hsl(${GREEN})`} stopOpacity="0.06" />
                </linearGradient>
                <marker id="arrUp" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,10 L5,0 L10,10 z" fill={`hsl(${GREEN})`}/></marker>
                <marker id="arrDown" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L5,10 L10,0 z" fill={`hsl(${GREEN})`}/></marker>
              </defs>
              {/* plot area: x 70..560, y 60..260 */}
              {/* axes */}
              <line x1="70" y1="40" x2="70" y2="260" stroke={CHROME_BORDER} strokeWidth="1"/>
              <line x1="70" y1="260" x2="560" y2="260" stroke={CHROME_BORDER} strokeWidth="1"/>
              {/* gap area between rising enterprise spend (top curve) and falling model cost (bottom curve) */}
              <path d="M 70 200 C 220 170, 380 100, 560 60 L 560 220 C 380 210, 220 230, 70 235 Z" fill="url(#gapFill)" />
              {/* enterprise AI spend — rising */}
              <path d="M 70 200 C 220 170, 380 100, 560 60" fill="none" stroke={`hsl(${GREEN})`} strokeWidth="3"/>
              {/* model cost per token — falling */}
              <path d="M 70 235 C 220 230, 380 210, 560 220" fill="none" stroke={`hsl(${RED})`} strokeWidth="3" strokeDasharray="6 4"/>
              {/* gap arrow on the right — two clean segments around the callout */}
              <line x1="475" y1="78" x2="475" y2="118" stroke={`hsl(${GREEN})`} strokeWidth="1.8" markerStart="url(#arrDown)"/>
              <line x1="475" y1="172" x2="475" y2="216" stroke={`hsl(${GREEN})`} strokeWidth="1.8" markerEnd="url(#arrUp)"/>
              {/* callout */}
              <rect x="408" y="120" width="134" height="50" rx="8" fill={BG} stroke={`hsl(${GREEN})`} strokeWidth="1.25"/>
              <text x="475" y="140" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="2" fill={`hsl(${GREEN})`}>NEW SPEND</text>
              <text x="475" y="158" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="1.5" fill={TEXT} fontWeight="700">LIZA captures</text>
              {/* line labels — placed above/below the curves with clear background, no overlap */}
              <g>
                <rect x="78" y="20" width="232" height="22" rx="4" fill={BG} />
                <text x="84" y="35" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="2" fill={`hsl(${GREEN})`} fontWeight="700">ENTERPRISE AI SPEND ↑</text>
              </g>
              <g>
                <rect x="78" y="270" width="248" height="22" rx="4" fill={BG} />
                <text x="84" y="285" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="2" fill={`hsl(${RED})`} fontWeight="700">MODEL COST PER TOKEN ↓</text>
              </g>
              {/* x-axis years */}
              <text x="70" y="310" fontFamily="ui-monospace, monospace" fontSize="10" fill={SUBTLE}>2023</text>
              <text x="560" y="310" textAnchor="end" fontFamily="ui-monospace, monospace" fontSize="10" fill={SUBTLE}>2027</text>
            </svg>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: SUBTLE }}>Three forces hitting at once</p>
            {[
              { k: "01 · Spend", h: "AI line item keeps growing", v: "More teams, more agents, more workflows. The bill goes up even as tokens go down." },
              { k: "02 · Audit", h: "Compliance is catching up", v: "EU AI Act, internal audit, regulators. Every output must be explainable, replayable, owned." },
              { k: "03 · Trust", h: "The CRO will not sign", v: "No buyer ships AI into regulated work without proof of method, approver, model and evidence." },
            ].map((d) => (
              <div key={d.k} className="rounded-xl p-5" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
                <p className="font-mono uppercase tracking-[0.22em] mb-1.5" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>{d.k}</p>
                <p className="font-black mb-1.5" style={{ fontSize: 22, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{d.h}</p>
                <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{d.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── 06 · WEEKEND OBJECTION ─────────────────────────────────────────────────
function S06WeekendObjection({ n, t }: { n: number; t: number }) {
  const rows = [
    { left: "Makes one analyst faster", right: "Makes the whole function execute the same way" },
    { left: "One person's clever prompt", right: "The company's approved method, versioned and owned" },
    { left: "PDFs dropped in a vector store", right: "Typed standards with ownership, expiry, change control" },
    { left: "A helpful answer this time", right: "A signed receipt that survives audit and handover" },
    { left: "Maintained by the user", right: "Closed loop where every receipt sharpens the standard" },
  ];
  return (
    <Slide section="Objection 01" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Most AI tools improve <span style={{ color: `hsl(${RED})` }}>individual artisanal work.</span><br/>
          We certify <span style={{ color: `hsl(${GREEN})` }}>organisation-wide AI execution.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          A weekend project helps one person. A control layer holds an entire function to one standard.
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CHROME_BORDER}` }}>
          <div className="grid grid-cols-2" style={{ background: CARD_ALT }}>
            <div className="px-7 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${RED})` }}>Artisanal AI · individual work</div>
            <div className="px-7 py-4 font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})`, borderLeft: `1px solid ${CHROME_BORDER}` }}>Certified AI · organisation execution</div>
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
    { h: "Business model", v: "LLM providers sell token volume; their incentive is more generation, not less. LIZA monetises governed decisions, so the more work is certified, the more value the buyer gets." },
    { h: "Neutrality", v: "Enterprises will run several models and switch them often. LIZA is the model-agnostic layer that scores, routes and certifies output across every vendor — something no single LLM provider can credibly do for its competitors." },
    { h: "Sovereignty", v: "Company standards, decision rules and receipts are operational IP and must not flow into a vendor's training set. LIZA keeps that corpus inside the customer's perimeter, owned and portable." },
    { h: "Accountability", v: "A model can generate an answer; it cannot sign for it. LIZA produces the auditable receipt — policy version, approver, data lineage, cost — that turns AI output into a defensible decision." },
  ];
  return (
    <Slide section="Objection 02" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          LLM providers are suppliers. <span style={{ color: `hsl(${GREEN})` }}>Not the control layer.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          They can add features. They cannot own the customer's governance position.
        </p>
        {/* Lane diagram: LLM providers lane vs control lane */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl px-6 py-4 flex items-center justify-between" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: SUBTLE }}>LLM provider lane</p>
            <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11, color: MUTED }}>
              <span className="px-3 py-1 rounded-full" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>Claude</span>
              <span className="px-3 py-1 rounded-full" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>GPT</span>
              <span className="px-3 py-1 rounded-full" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>Gemini</span>
            </div>
          </div>
          <div className="rounded-xl px-6 py-4 flex items-center justify-between" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
            <p className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>Governance lane</p>
            <span className="px-3 py-1 rounded-full font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11, color: `hsl(${GREEN})`, background: BG, border: `1px solid hsl(${GREEN} / 0.4)` }}>LIZA OS · model-agnostic</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-9">
          {reasons.map((r) => (
            <div key={r.h} className="rounded-2xl p-7" style={{ background: CARD_ALT, borderLeft: `5px solid hsl(${GREEN})` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>{r.h}</p>
              <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.4 }}>{r.v}</p>
            </div>
          ))}
        </div>
        <p className="font-bold" style={{ fontSize: 24, color: TEXT, lineHeight: 1.35 }}>
          Any LLM can sit inside the workflow. None can credibly certify the workflow for every other model, department and regulator.
        </p>
      </div>
    </Slide>
  );
}

// ─── 08 · BUSINESS MODEL ────────────────────────────────────────────────────
function S08BusinessModel({ n, t }: { n: number; t: number }) {
  return (
    <Slide section="Business model" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Tokens get cheap. <span style={{ color: `hsl(${GREEN})` }}>Context gets expensive.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          The cost of a token keeps falling. The cost of getting the right context into that token is what now decides whether the work is usable.
        </p>
        <div className="grid grid-cols-[1.2fr_1fr] gap-7 items-stretch">
          {/* Visualization: token cost line falling, context cost line rising, LIZA captures the gap */}
          <div className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p className="font-mono uppercase tracking-[0.22em] mb-5" style={{ fontSize: 12, color: SUBTLE }}>Cost per usable AI decision · indexed</p>
            <svg viewBox="0 0 540 300" className="w-full" style={{ height: 300 }}>
              {/* axes */}
              <line x1="60" y1="240" x2="510" y2="240" stroke={CHROME_BORDER} strokeWidth="1" />
              <line x1="60" y1="40" x2="60" y2="240" stroke={CHROME_BORDER} strokeWidth="1" />
              {/* x labels */}
              {(["2023", "2025", "2027"] as const).map((year, i) => {
                const x = 110 + i * 180;
                return (
                  <text key={year} x={x} y={260} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="1.5" fill={SUBTLE}>{year}</text>
                );
              })}
              {/* token cost: falling */}
              <path d="M 110 90 Q 200 160 290 200 T 470 225" fill="none" stroke={`hsl(${RED} / 0.7)`} strokeWidth="2.5" strokeDasharray="6 4" />
              {/* context cost: rising */}
              <path d="M 110 215 Q 200 180 290 130 T 470 60" fill="none" stroke={`hsl(${GREEN})`} strokeWidth="3" />
              {/* gap shading between the two lines on the right */}
              <path d="M 290 130 T 470 60 L 470 225 T 290 200 Z" fill={`hsl(${GREEN} / 0.08)`} stroke="none" />
              {/* end-point dots */}
              <circle cx="470" cy="225" r="4" fill={`hsl(${RED} / 0.8)`} />
              <circle cx="470" cy="60" r="5" fill={`hsl(${GREEN})`} />
              {/* line labels */}
              <text x="478" y="228" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.2" fill={MUTED}>TOKEN COST</text>
              <text x="478" y="63" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.2" fill={`hsl(${GREEN})`}>CONTEXT COST</text>
              {/* LIZA capture band callout */}
              <g transform="translate(330, 110)">
                <rect x="0" y="0" width="118" height="26" rx="13" fill={BG} stroke={`hsl(${GREEN} / 0.5)`} />
                <text x="59" y="17" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10.5" letterSpacing="1.5" fill={`hsl(${GREEN})`}>LIZA CAPTURES THIS</text>
              </g>
              {/* legend */}
              <g>
                <line x1="70" y1="22" x2="92" y2="22" stroke={`hsl(${RED} / 0.7)`} strokeWidth="2.5" strokeDasharray="6 4" />
                <text x="100" y="26" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.2" fill={MUTED}>TOKENS · COMMODITY</text>
                <line x1="290" y1="22" x2="312" y2="22" stroke={`hsl(${GREEN})`} strokeWidth="3" />
                <text x="320" y="26" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.2" fill={TEXT}>CONTEXT · RELEVANT, SAFE, EFFICIENT</text>
              </g>
            </svg>
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.35)` }}>
              <p className="font-black mb-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.025em" }}>LIZA shapes the context.</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.42 }}>
                Relevant, safe and token-efficient. Every prompt arrives with the right standards, the right data scope and the right guardrails attached.
              </p>
            </div>
            <div className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p className="font-black mb-3" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.025em" }}>We charge token plus value.</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.42 }}>
                Tokens pass through at cost. Our margin is the usable, accountable decision the business actually gets out of them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── 09 · PROOF ─────────────────────────────────────────────────────────────
function S09Proof({ n, t }: { n: number; t: number }) {
  const proof = [
    { k: "Live", h: "First production deployment", v: "A regulated AEC customer is running governed decisions through LIZA today. CTO-sponsored. Details under NDA." },
    { k: "Encoded", h: "Standards captured", v: "The customer's approved playbooks, procedures and decision rules are encoded as typed standards inside LIZA." },
    { k: "Compounding", h: "Receipts accumulating", v: "Every signed decision feeds the standards layer. The corpus and the receipt graph grow with use." },
  ];
  return (
    <Slide section="Proof" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          The wedge is live. <span style={{ color: `hsl(${GREEN})` }}>Not theoretical.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-10" style={{ fontSize: 14, color: MUTED }}>
          One regulated vertical in production. Anonymized customer reference available on request.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {proof.map((p) => (
            <div key={p.k} className="rounded-2xl p-7" style={{ background: `hsl(${GREEN} / 0.05)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <p className="font-mono uppercase tracking-[0.22em] mb-4" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>{p.k}</p>
              <p className="font-black mb-4" style={{ fontSize: 30, color: TEXT, lineHeight: 1.08, letterSpacing: "-0.025em" }}>{p.h}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.42 }}>{p.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-7 py-5 flex items-center gap-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <span className="font-mono uppercase tracking-[0.22em] px-3 py-1.5 rounded" style={{ fontSize: 11, color: `hsl(${GOLD})`, background: `hsl(${GOLD} / 0.1)`, border: `1px solid hsl(${GOLD} / 0.35)` }}>Pattern</span>
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.4, fontWeight: 700 }}>
          The first vertical proves the pattern: encode standards, govern decisions, price the work unit, expand into adjacent regulated functions.
        </p>
        </div>
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
    <Slide section="Our moat" n={n} total={t}>
      <div className="absolute inset-0 px-32 flex flex-col justify-center">
        <h2 className="font-black mb-3" style={{ fontSize: 66, lineHeight: 1.0, color: TEXT, letterSpacing: "-0.035em" }}>
          Our moat is not the code. <span style={{ color: `hsl(${GREEN})` }}>It is what compounds inside LIZA.</span>
        </h2>
        <p className="font-mono uppercase tracking-[0.22em] mb-9" style={{ fontSize: 14, color: MUTED }}>
          Four assets that LIZA accumulates with every customer and every signed decision. A clone can copy screens. It cannot copy these.
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
          We are raising €2M · seed
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 112, lineHeight: 0.95, color: "hsl(0 0% 98%)", letterSpacing: "-0.05em" }}>
          €2M to fund the control layer<br/>
          <span style={{ color: `hsl(${GREEN})` }}>before it becomes obvious.</span>
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
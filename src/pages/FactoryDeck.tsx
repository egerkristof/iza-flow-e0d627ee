import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Factory, Cpu, Building2, Users,
  Workflow, Coins, Sparkles, Mail, CheckCircle2, Layers,
  ArrowDown, ArrowRight, Magnet, Megaphone, Clock, AlertTriangle, Gauge,
  Hammer, Wrench, Flame, FileText, GitBranch, Zap, ShieldCheck,
  Lightbulb, UserCog, Package, Cog, Wind, Skull, Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideGrid, DarkGrid, SlideBar, Tag, PageNumber, Footer,
  SlideIndexProvider,
  BG, TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  ACCENT, GREEN, GOLD, RED, PURPLE, DARK_BG, DARK_TEXT, DARK_MUTED,
  S03GovernanceLoop, S07cFunnel,
  S07eAaceNotRag, S07dOrgLoop,
  S10UnitEconomics, S13LoopClosed,
} from "@/pages/TechDDDeck";

// ═════════════════════════════════════════════════════════════════════════════
// FACTORY DECK — Production-system spine
// Toyota named ONCE on F02. The rest of the deck demonstrates the factory
// without naming it. Lead with the math, anchor with the machine-without-a-factory
// frame, then walk investors station by station through the floor.
// ═════════════════════════════════════════════════════════════════════════════

// ─── F01 · COVER ─────────────────────────────────────────────────────────────
function F01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32 max-w-[1500px]">
        <p className="font-mono uppercase tracking-[0.4em] mb-10" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          LIZA OS · Seed Round · Confidential
        </p>
        <h1 className="font-black tracking-tight mb-8" style={{ fontSize: 96, lineHeight: 1.02, color: DARK_TEXT, letterSpacing: "-0.04em" }}>
          Your org is a workshop.<br />
          <span style={{ color: `hsl(${GREEN})` }}>We make it a production system.</span>
        </h1>
        <p className="mx-auto mb-14" style={{ fontSize: 30, lineHeight: 1.35, color: DARK_MUTED, maxWidth: 1180 }}>
          Every knowledge worker became a brilliant artisan with ChatGPT. Hand-crafted prompts. Private workflows. Disposable expertise. Brilliance that does not compound, does not transfer, does not survive Monday. That is the disease. LIZA is the line.
        </p>
        <div className="flex items-center justify-center gap-12">
          {[
            { v: "$0.40", l: "per governed decision" },
            { v: "95%", l: "platform gross margin" },
            { v: "€23", l: "displaced labour cost / decision" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center">
              <span className="font-black" style={{ fontSize: 64, color: DARK_TEXT, letterSpacing: "-0.03em" }}>{s.v}</span>
              <span className="font-mono uppercase tracking-[0.18em] mt-2" style={{ fontSize: 14, color: DARK_MUTED }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.35)` }}>
          €2M Seed · The Production System for AI Work
      </div>
    </div>
  );
}

// ─── SPINE INDICATOR · Persistent red-thread across slides 3-8 ───────────────
const SPINE_BEATS = [
  "Sessions die",
  "You patch",
  "They push seats",
  "Both unconscious",
  "Era IV exit",
  "Substrate ships",
];
function SpineIndicator({ current }: { current: number }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5"
         style={{ bottom: 72, zIndex: 5 }}>
      <span className="font-mono uppercase tracking-[0.22em] font-bold mr-2" style={{ fontSize: 10, color: SUBTLE }}>
        Red thread
      </span>
      {SPINE_BEATS.map((label, i) => {
        const beat = i + 1;
        const isCurrent = beat === current;
        const isPast = beat < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full transition-all"
                   style={{
                     width: isCurrent ? 11 : 7,
                     height: isCurrent ? 11 : 7,
                     background: isCurrent ? `hsl(${GREEN})` : isPast ? `hsl(${GREEN} / 0.45)` : `hsl(215 15% 75%)`,
                     boxShadow: isCurrent ? `0 0 0 4px hsl(${GREEN} / 0.18)` : "none",
                   }} />
              <span className="font-mono uppercase tracking-[0.1em]" style={{
                fontSize: 9,
                color: isCurrent ? `hsl(${GREEN})` : SUBTLE,
                fontWeight: isCurrent ? 700 : 500,
                whiteSpace: "nowrap",
              }}>
                {beat}. {label}
              </span>
            </div>
            {i < SPINE_BEATS.length - 1 && (
              <div className="h-px" style={{ width: 18, background: beat < current ? `hsl(${GREEN} / 0.45)` : `hsl(215 15% 80%)` }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── F_WORKSHOP · The workshop you already run ───────────────────────────────
function FWorkshop() {
  const artisans = [
    { i: Hammer,    role: "The Prompt Whisperer", who: "Only one PM can brief the model. Knows the magic words. Off Monday." },
    { i: FileText,  role: "The Folder Grimoire", who: "Analyst's personal ChatGPT folder. Three years of prompts. Encrypted in their head." },
    { i: Wrench,    role: "The Re-Briefer", who: "Senior rewrites every junior's AI output before it ships. Calls it \"quality.\"" },
    { i: Cog,       role: "The Macro Smith", who: "Hand-tuned automations in Make, Zapier, n8n. Owned by one person. Brittle." },
    { i: Flame,     role: "The Firefighter", who: "Fixes hallucinations after the email is sent. Apologises to the client every quarter." },
    { i: Lightbulb, role: "The Inventor", who: "Builds a new GPT every week. Nobody uses last week's. Nothing accumulates." },
    { i: UserCog,   role: "The Personal Methodologist", who: "Has a system. Won't write it down. \"Easier to just do it myself.\"" },
    { i: Package,   role: "The Hoarder", who: "Saves every prompt, every output. Nobody can find anything when they leave." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-28 pb-24 flex flex-col">
        <Tag label="The Workshop You Already Run" color={GOLD} />
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em" }}>
          Your best people became <span style={{ color: `hsl(${GOLD})` }}>brilliant artisans</span>.
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1280, lineHeight: 1.4 }}>
          ChatGPT did not industrialise your org. It minted craftspeople. Every senior built a private method. Every method dies with them. You recognise these people. They sit on your floor today.
        </p>
        <div className="grid grid-cols-4 gap-4 flex-1">
          {artisans.map((a, i) => {
            const Icon = a.i;
            return (
              <div key={i} className="rounded-xl border p-5 flex flex-col" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
                    <Icon size={20} />
                  </div>
                  <span className="font-mono font-black" style={{ fontSize: 14, color: SUBTLE }}>0{i + 1}</span>
                </div>
                <p className="font-bold mb-2" style={{ fontSize: 19, color: TEXT, lineHeight: 1.2 }}>{a.role}</p>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{a.who}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 px-7 py-4 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${GOLD} / 0.05)`, borderColor: `hsl(${GOLD})` }}>
          <span className="font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>The pattern</span>
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.45 }}>
            Pre-industrial knowledge work. Talented, irreplaceable, uncompounded. The output ships. The method does not.
          </p>
        </div>
      </div>
      <Footer text="Eight roles. Same org. Brilliance trapped in eight private heads." />
      <SlideBar from={GOLD} to={RED} />
    </div>
  );
}

// ─── F_DISPOSABLE · Disposable expertise ─────────────────────────────────────
function FDisposable() {
  const dies = [
    { k: "Sessions opened today", v: "12,847", note: "Per 500-person org. Real telemetry from a customer deployment." },
    { k: "Surviving tomorrow", v: "0", note: "No standard captured. No bundle written. No method retained." },
    { k: "Re-asked next week", v: "78%", note: "Same question, different prompt, different answer, different worker." },
  ];
  const symptoms = [
    { i: Wind,       t: "Vacation paralysis", d: "Your best prompter is off. The team's quality drops 40%. Nobody can replicate the method." },
    { i: Skull,      t: "Onboarding amnesia", d: "New hire gets a Notion doc and a Slack channel. The actual craft lives in nobody's hands but the seniors'." },
    { i: Ban,        t: "Audit blindness", d: "\"Why did AI say that?\" Nobody knows. The session is gone. The reasoning was never written down." },
    { i: GitBranch,  t: "Method drift", d: "Three people do the same task three ways. None of them know the others exist. The org has no canonical anything." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-28 pb-24 flex flex-col">
        <Tag label="Disposable Expertise" color={RED} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Every session is a spark. <span style={{ color: `hsl(${RED})` }}>None of them survive the day.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 22, color: MUTED, maxWidth: 1280, lineHeight: 1.4 }}>
          A workshop produces parts, not factories. Today's AI sessions are exactly that. Brilliant for an hour. Gone by Monday. Nothing compounds. Nothing transfers. Nothing is auditable.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-7">
          {dies.map((s, i) => (
            <div key={i} className="rounded-2xl border p-6" style={{ background: i === 1 ? `hsl(${RED} / 0.05)` : CARD_ALT, borderColor: i === 1 ? `hsl(${RED} / 0.35)` : CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.15em] mb-3" style={{ fontSize: 12, color: SUBTLE }}>{s.k}</p>
              <p className="font-black mb-3" style={{ fontSize: 56, color: i === 1 ? `hsl(${RED})` : TEXT, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.v}</p>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.35 }}>{s.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 flex-1">
          {symptoms.map((s, i) => {
            const Icon = s.i;
            return (
              <div key={i} className="rounded-xl border p-5 flex flex-col" style={{ background: "white", borderColor: CHROME_BORDER }}>
                <Icon size={24} style={{ color: `hsl(${RED})` }} className="mb-3" />
                <p className="font-bold mb-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.2 }}>{s.t}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{s.d}</p>
              </div>
            );
          })}
        </div>

        {/* Bridge line — the causal link to Era I */}
        <div className="mt-5 px-7 py-3 rounded-xl border-l-4 flex items-center gap-4"
             style={{ background: `hsl(${GOLD} / 0.07)`, borderColor: `hsl(${GOLD})`, animation: "chain-pop 0.6s 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
          <span className="font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap" style={{ fontSize: 12, color: `hsl(${GOLD})` }}>The link</span>
          <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-black">This is why you are still in Era I.</span> No artefact survives the session, so every fix is hand-crafted, every craft is private, every method is disposable. The next slide names the four eras.
          </p>
        </div>
        <style>{`@keyframes chain-pop { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
      <Footer text="The artifact ships. The method dies with the session. This is the workshop tax." />
      <SpineIndicator current={1} />
      <SlideBar from={RED} to={GOLD} />
    </div>
  );
}

// ─── F_THREESTAGES · Coachbuilder → Ford → Toyota (the aha) ──────────────────
function FThreeStages() {
  // Four Eras of production · ported to knowledge work
  const eras = [
    {
      n: "I", era: "1800s", name: "Artisanal", icon: Hammer, color: GOLD,
      mfg: "One craftsman per object. Brilliant, slow, unrepeatable.",
      kw: "One expert per answer. Hand-built prompts. Disposable expertise.",
      tag: "WHERE YOU ARE (UNCONSCIOUSLY)",
    },
    {
      n: "II", era: "1910s", name: "Fordism", icon: Megaphone, color: RED,
      mfg: "Assembly line. Identical Model T. Worker crushed into throughput.",
      kw: "LLM seats pushed to every desk. Identical generic output. Worker as prompt-typist.",
      tag: "WHERE THEY PUSH YOU (UNCONSCIOUSLY)",
    },
    {
      n: "III", era: "1950s", name: "Toyotaism", icon: Factory, color: ACCENT,
      mfg: "Pull, kanban, kaizen. Workers redesign the line. Quality built in.",
      kw: "Standards pull tokens. Workers improve their own stations. Craft scales.",
      tag: "THE BRIDGE (MECHANICS WE STEAL)",
    },
    {
      n: "IV", era: "Today", name: "AI-Driven · Industry 4.0", icon: Cpu, color: GREEN,
      mfg: "Software-defined assembly. Predictive. Per-unit customization at line speed.",
      kw: "Every prompt assembled from standards, per outcome, predictively governed. LIZA.",
      tag: "WHERE LIZA INSTALLS YOU (CONSCIOUSLY)",
    },
  ];
  const rows = [
    { label: "Product variety", vals: ["Unique",        "Identical",        "Limited options",  "Mass customised"] },
    { label: "Driver",          vals: ["Human skill",   "Assembly line",    "Waste elimination","Autonomous standards"] },
    { label: "Inventory style", vals: ["Made to order", "Mass stockpile",   "Just-in-time",     "Predictive & instant"] },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag label="Four Eras of Production · Knowledge Work Today" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 54, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          You are in <span style={{ color: `hsl(${GOLD})` }}>Era I</span>. The market is pushing you into <span style={{ color: `hsl(${RED})` }}>Era II</span>. <span style={{ color: `hsl(${GREEN})` }}>Neither side knows it.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 19, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          Industry took 150 years to walk this ladder. Knowledge work is still on the bench. Your half-baked improvements stay in Era I. Vendors selling seats land you in Era II. LIZA is the conscious third path: install Era IV directly on top of Era I. Toyota was the bridge, not the destination.
        </p>

        {/* Two unconscious motions + conscious third path */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { tag: "YOUR MOTION (UNCONSCIOUS)", color: GOLD, icon: Hammer,
              line: "Half-baked workshop fixes.",
              body: "Better prompts. Shared docs. Prompt libraries. Stays in Era I." },
            { tag: "THEIR MOTION (UNCONSCIOUS)", color: RED, icon: Megaphone,
              line: "Vendors push more seats.",
              body: "Copilot to 5,000 desks. Called transformation. Lands you in Era II." },
            { tag: "THE CONSCIOUS THIRD PATH", color: GREEN, icon: Cpu,
              line: "LIZA installs Era IV.",
              body: "Skip Era II entirely. Toyota mechanics, Era IV substrate, on top of Era I." },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.tag} className="rounded-xl border-l-4 px-4 py-3 flex gap-3 items-start"
                   style={{ background: `hsl(${m.color} / 0.05)`, borderColor: `hsl(${m.color})` }}>
                <Icon size={20} style={{ color: `hsl(${m.color})`, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-mono uppercase tracking-[0.15em] font-bold mb-1" style={{ fontSize: 10, color: `hsl(${m.color})` }}>{m.tag}</p>
                  <p className="font-bold mb-0.5" style={{ fontSize: 15, color: TEXT, lineHeight: 1.2 }}>{m.line}</p>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.35 }}>{m.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Four era cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {eras.map((e) => {
            const Icon = e.icon;
            return (
              <div key={e.n} className="rounded-2xl border-2 p-4 flex flex-col"
                   style={{ background: `hsl(${e.color} / 0.05)`, borderColor: `hsl(${e.color} / 0.45)` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black tracking-tight" style={{ fontSize: 20, color: `hsl(${e.color})` }}>ERA {e.n}</span>
                  <Icon size={20} style={{ color: `hsl(${e.color})` }} />
                </div>
                <p className="font-mono uppercase tracking-[0.15em] mb-1" style={{ fontSize: 11, color: MUTED }}>{e.era}</p>
                <p className="font-bold mb-2" style={{ fontSize: 19, color: TEXT, lineHeight: 1.15 }}>{e.name}</p>
                <p className="mb-1.5" style={{ fontSize: 13, color: MUTED, lineHeight: 1.3 }}><span className="font-semibold" style={{ color: SUBTLE }}>Mfg:</span> {e.mfg}</p>
                <p className="flex-1" style={{ fontSize: 13, color: TEXT, lineHeight: 1.3 }}><span className="font-semibold" style={{ color: `hsl(${e.color})` }}>Knowledge work:</span> {e.kw}</p>
                <div className="mt-2 pt-2 border-t text-center" style={{ borderColor: `hsl(${e.color} / 0.2)` }}>
                  <span className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 10, color: `hsl(${e.color})` }}>{e.tag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact comparison row */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
          {rows.map((r, i) => (
            <div key={r.label} className="grid grid-cols-[180px_1fr_1fr_1fr_1fr] items-center"
                 style={{ background: i % 2 === 0 ? "white" : CARD_ALT, borderTop: i === 0 ? "none" : `1px solid ${CHROME_BORDER}` }}>
              <span className="px-5 py-2 font-mono uppercase tracking-[0.14em] font-bold" style={{ fontSize: 12, color: MUTED }}>{r.label}</span>
              {r.vals.map((v, j) => (
                <span key={j} className="px-4 py-2" style={{ fontSize: 14, color: j === 3 ? TEXT : MUTED, fontWeight: j === 3 ? 700 : 500 }}>{v}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer text="Source frame: industrial production eras (Artisanal · Fordism · Toyotaism · Industry 4.0). Ported to knowledge work." />
      <SpineIndicator current={4} />
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ─── F_SKIPMIDDLE · Skip the failed middle stage ─────────────────────────────
function FSkipMiddle() {
  const rows = [
    { dim: "Direction of flow",   ford: "Top-down push of tools and seats", toyota: "Pull from outcome through standard",       era4: "Outcome compiles context, predictively" },
    { dim: "Worker role",         ford: "Execute uniform throughput",       toyota: "Design and stop the stations",             era4: "Author standards. The system runs them." },
    { dim: "Quality control",     ford: "Inspect at the end",               toyota: "Built in at every station",                era4: "Regression-tested on every commit" },
    { dim: "When something fails",ford: "Ship the defect, fix later",       toyota: "Andon cord. Stop the line. Fix.",          era4: "Failure rewrites the standard, instantly" },
    { dim: "What compounds",      ford: "Nothing. Replace the line.",       toyota: "Standards, rationale, method",             era4: "Every token. Every decision. Forever." },
    { dim: "Where craft lives",   ford: "Outside the line. Lost.",          toyota: "Encoded by the workers themselves",        era4: "Encoded once. Executed per prompt." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag label="Why We Skip the Middle" color={GREEN} />
        <h2 className="font-black mb-3" style={{ fontSize: 54, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Buying more seats <span style={{ color: `hsl(${RED})` }}>is the Ford rollout</span>. We take you <span style={{ color: `hsl(${GREEN})` }}>past Toyota</span>.
        </h2>
        <p className="mb-6" style={{ fontSize: 19, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          Most buyers think rolling out Copilot to five thousand desks is transformation. It is the Ford rollout. Toyota is the mechanic we steal. Era IV is the destination. Three columns, six rows, one trajectory.
        </p>

        {/* Flip-card equivalence: Copilot seats = Ford 1913. Hover to flip. */}
        <div className="mb-5 flex justify-center" style={{ perspective: 1400 }}>
          <div className="group relative" style={{ width: 760, height: 92, transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0 rounded-xl border-2 flex items-center gap-4 px-6 transition-transform duration-700"
                 style={{
                   background: "white",
                   borderColor: `hsl(${RED} / 0.5)`,
                   backfaceVisibility: "hidden",
                   transformStyle: "preserve-3d",
                   transform: "rotateY(0deg)",
                 }}>
              <Megaphone size={26} style={{ color: `hsl(${RED})`, flexShrink: 0 }} />
              <div className="flex-1">
                <p className="font-mono uppercase tracking-[0.18em] font-bold mb-0.5" style={{ fontSize: 11, color: `hsl(${RED})` }}>Today · the trap they call transformation</p>
                <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  Microsoft Copilot · $30 / seat / month · 50,000 desks
                </p>
              </div>
              <span className="font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded-md" style={{ background: CARD_ALT, fontSize: 10, color: MUTED }}>hover to flip</span>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 flex items-center gap-4 px-6 transition-transform duration-700"
                 style={{
                   background: `hsl(${RED} / 0.06)`,
                   borderColor: `hsl(${RED})`,
                   backfaceVisibility: "hidden",
                   transform: "rotateY(180deg)",
                 }}>
              <Factory size={26} style={{ color: `hsl(${RED})`, flexShrink: 0 }} />
              <div className="flex-1">
                <p className="font-mono uppercase tracking-[0.18em] font-bold mb-0.5" style={{ fontSize: 11, color: `hsl(${RED})` }}>1913 · the same move, last century</p>
                <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  Ford Highland Park · one motion · one worker · one wage
                </p>
              </div>
              <span className="font-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded-md" style={{ background: `hsl(${RED} / 0.12)`, fontSize: 10, color: `hsl(${RED})` }}>same trap</span>
            </div>
            <style>{`
              .group:hover > div:first-child { transform: rotateY(-180deg); }
              .group:hover > div:nth-child(2) { transform: rotateY(0deg); }
            `}</style>
          </div>
        </div>

        {/* Three column headers */}
        <div className="grid grid-cols-[1fr_1.3fr_1.3fr_1.3fr] gap-0 rounded-t-2xl border border-b-0 overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
          <div className="px-5 py-3 font-mono uppercase tracking-[0.15em] font-bold" style={{ background: CARD_ALT, fontSize: 12, color: MUTED }}>Dimension</div>
          <div className="px-5 py-3 font-mono uppercase tracking-[0.15em] font-bold border-l" style={{ background: `hsl(${RED} / 0.06)`, color: `hsl(${RED})`, fontSize: 12, borderColor: CHROME_BORDER }}>Ford · the trap they push</div>
          <div className="px-5 py-3 font-mono uppercase tracking-[0.15em] font-bold border-l" style={{ background: `hsl(${ACCENT} / 0.06)`, color: `hsl(${ACCENT})`, fontSize: 12, borderColor: CHROME_BORDER }}>Toyota · the bridge mechanic</div>
          <div className="px-5 py-3 font-mono uppercase tracking-[0.15em] font-bold border-l" style={{ background: `hsl(${GREEN} / 0.08)`, color: `hsl(${GREEN})`, fontSize: 12, borderColor: CHROME_BORDER }}>Era IV · where LIZA installs you</div>
        </div>
        <div className="rounded-b-2xl border border-t-0 overflow-hidden flex-1" style={{ borderColor: CHROME_BORDER }}>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.3fr_1.3fr_1.3fr] border-t items-center"
                 style={{ borderColor: CHROME_BORDER, background: i % 2 === 0 ? "white" : CARD_ALT }}>
              <span className="px-5 py-3 font-semibold" style={{ fontSize: 15, color: TEXT }}>{r.dim}</span>
              <span className="px-5 py-3 flex items-center gap-2 border-l" style={{ fontSize: 14, color: MUTED, borderColor: CHROME_BORDER }}>
                <X size={13} style={{ color: `hsl(${RED})`, flexShrink: 0 }} />
                <span>{r.ford}</span>
              </span>
              <span className="px-5 py-3 flex items-center gap-2 border-l" style={{ fontSize: 14, color: TEXT, borderColor: CHROME_BORDER }}>
                <CheckCircle2 size={13} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
                <span>{r.toyota}</span>
              </span>
              <span className="px-5 py-3 flex items-center gap-2 border-l font-semibold" style={{ fontSize: 14, color: TEXT, borderColor: CHROME_BORDER, background: `hsl(${GREEN} / 0.04)` }}>
                <Sparkles size={13} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
                <span>{r.era4}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Spine line */}
        <div className="mt-5 px-7 py-3 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${GREEN} / 0.06)`, borderColor: `hsl(${GREEN})` }}>
          <span className="font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>The spine</span>
          <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
            Ford is the trap. Toyota is the bridge. Era IV is the destination. The next two slides explain why nobody has shipped it, and the substrate that does.
          </p>
        </div>
      </div>
      <Footer text="Toyota was the most-studied operations design of the 20th century. We borrowed the mechanics. We did not borrow the ceiling." />
      <SpineIndicator current={5} />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── F_PILLAR1 · Push vs Pull (demoted from arrowhead to pillar) ─────────────
function FPillarPull() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-28 pb-24 flex flex-col">
        <Tag label="Pillar 1 · Pull, Not Push" color={GREEN} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Outcomes <span style={{ color: `hsl(${GREEN})` }}>pull</span> the work.<br />
          Vendors no longer <span style={{ color: `hsl(${RED})` }}>push</span> the seat.
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, maxWidth: 1280, lineHeight: 1.4 }}>
          The mechanic that makes Toyota work. Demand pulls each part through a standard, just-in-time. We do the same with tokens: every prompt is called by a named outcome through a named standard, not pushed by a vendor licence.
        </p>

        <div className="grid grid-cols-2 gap-10 flex-1">
          {/* PUSH column */}
          <div className="rounded-2xl p-8 border relative overflow-hidden" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.35)` }}>
            {/* push arrows raining down */}
            <div className="absolute inset-x-0 top-0 flex justify-around opacity-50 pointer-events-none">
              {[0,1,2,3,4,5,6].map(i => (
                <ArrowDown key={i} size={20} style={{ color: `hsl(${RED})`, marginTop: (i % 3) * 6 }} />
              ))}
            </div>
            <div className="flex items-center gap-3 mb-5 mt-6">
              <Megaphone size={28} style={{ color: `hsl(${RED})` }} />
              <span className="font-mono uppercase tracking-[0.2em] font-bold" style={{ fontSize: 17, color: `hsl(${RED})` }}>Push motion · today</span>
            </div>
            <p className="font-bold mb-5" style={{ fontSize: 28, color: TEXT, lineHeight: 1.2 }}>
              "Here is AI. Use it. Everywhere. Now."
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {["Copilot","ChatGPT","Claude","Gemini","Agents","More agents"].map(t => (
                <div key={t} className="px-3 py-2 rounded-md border text-center font-mono" style={{ fontSize: 14, color: MUTED, borderColor: `hsl(${RED} / 0.25)`, background: "white" }}>{t}</div>
              ))}
            </div>
            <ul className="space-y-2" style={{ fontSize: 18, color: MUTED, lineHeight: 1.35 }}>
              <li>· Undefined usage. No standard, no audit trail.</li>
              <li>· Drift between teams. Same prompt, different answer.</li>
              <li>· Every token unanchored from outcome.</li>
              <li>· Pilots stall. Trust erodes. Spend questioned.</li>
            </ul>
          </div>

          {/* PULL column */}
          <div className="rounded-2xl p-8 border-2 relative overflow-hidden" style={{ background: `hsl(${GREEN} / 0.04)`, borderColor: `hsl(${GREEN} / 0.45)` }}>
            <div className="absolute top-6 right-6 opacity-40">
              <Magnet size={64} style={{ color: `hsl(${GREEN})` }} />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <Factory size={28} style={{ color: `hsl(${GREEN})` }} />
              <span className="font-mono uppercase tracking-[0.2em] font-bold" style={{ fontSize: 17, color: `hsl(${GREEN})` }}>Pull motion · the factory</span>
            </div>
            <p className="font-bold mb-5" style={{ fontSize: 28, color: TEXT, lineHeight: 1.2 }}>
              "Standard calls the token. Just-in-time."
            </p>
            <div className="flex items-center gap-2 mb-5 px-3 py-3 rounded-md border" style={{ background: "white", borderColor: `hsl(${GREEN} / 0.3)` }}>
              <span className="font-mono font-bold whitespace-nowrap" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>OUTCOME</span>
              <ArrowRight size={14} style={{ color: SUBTLE }} />
              <span className="font-mono whitespace-nowrap" style={{ fontSize: 13, color: MUTED }}>STANDARD</span>
              <ArrowRight size={14} style={{ color: SUBTLE }} />
              <span className="font-mono whitespace-nowrap" style={{ fontSize: 13, color: MUTED }}>STATION</span>
              <ArrowRight size={14} style={{ color: SUBTLE }} />
              <span className="font-mono whitespace-nowrap" style={{ fontSize: 13, color: MUTED }}>TOKEN</span>
            </div>
            <ul className="space-y-2" style={{ fontSize: 18, color: MUTED, lineHeight: 1.35 }}>
              <li>· Every prompt compiled against a standard.</li>
              <li>· Every decision logged with rationale.</li>
              <li>· Every token tied to a named outcome.</li>
              <li>· Compounds. The machine depreciates; the factory does not.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 px-7 py-4 rounded-xl border-l-4 flex items-center gap-4" style={{ background: CARD_ALT, borderColor: `hsl(${ACCENT})` }}>
          <span className="font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>Pillar 1 of 4</span>
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.45 }}>
            Pull motion is the supply-chain mechanic. The next pillar wires it into stations on the floor.
          </p>
        </div>
      </div>
      <Footer text="Pillar 1: outcomes pull tokens through standards. The seat licence stops being the unit of value." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ─── F03 · ANNOTATED AI EMAIL (the moment of failure) ────────────────────────
function F03AnnotatedEmail() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="The Moment of Failure" color={RED} />
        <h2 className="font-black mb-4" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          One ungoverned prompt. <span style={{ color: `hsl(${RED})` }}>Six hidden defects.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1100, lineHeight: 1.4 }}>
          A senior consultant asks AI to draft a client update. Nothing stops the line. Every defect ships.
        </p>
        <div className="grid grid-cols-[1.1fr_1fr] gap-8 flex-1">
          <div className="rounded-2xl border p-8 relative font-serif" style={{ background: "white", borderColor: CHROME_BORDER }}>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b" style={{ borderColor: CHROME_BORDER }}>
              <Mail size={18} style={{ color: SUBTLE }} />
              <span className="font-mono" style={{ fontSize: 14, color: SUBTLE }}>To: client · Re: Q3 update · Drafted by AI</span>
            </div>
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.55 }}>
              <p className="mb-3">Dear <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>Mr. Tanaka</mark>,</p>
              <p className="mb-3">
                We are pleased to share that engagement <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>delivery is on track for the original September timeline</mark>.
                Our methodology aligns with <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>best-in-class industry frameworks</mark> and we anticipate
                <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}> savings of approximately 30%</mark>.
              </p>
              <p className="mb-3">
                Attached please find the <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>detailed cost breakdown</mark>.
                We remain committed to delivering against the <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>SLA agreed in our master agreement</mark>.
              </p>
              <p>Kind regards,<br />The team</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { d: "Wrong honorific", w: "Client switched to Ms. last quarter. CRM has it. AI did not." },
              { d: "Stale timeline", w: "Engagement re-baselined to October. Memo not in training data." },
              { d: "Vague claim", w: "\"Best-in-class\" violates the firm's no-superlatives policy." },
              { d: "Fabricated number", w: "30% has no source. AI hallucinated a plausible figure." },
              { d: "Missing attachment", w: "AI cannot attach files but wrote as if it could." },
              { d: "Wrong SLA reference", w: "MSA was amended in May. AI cited the original." },
            ].map((x, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.25)` }}>
                <span className="font-mono font-black mt-0.5" style={{ fontSize: 14, color: `hsl(${RED})` }}>0{i + 1}</span>
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.2 }}>{x.d}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{x.w}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer text="A factory floor would have caught all six. Without one, all six ship to the client." />
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ─── F_PILLAR2 · Standards as Stations ───────────────────────────────────────
function FPillarStations() {
  const stations = [
    { n: "01", t: "Intake", desc: "Outcome named. Standard called. Context bundle loaded.", icon: FileText },
    { n: "02", t: "Compile", desc: "Every prompt compiled against the standard. Drift caught at the gate.", icon: Cog },
    { n: "03", t: "Execute", desc: "Tokens flow. Rationale logged. Quality built in, not bolted on.", icon: Zap },
    { n: "04", t: "Audit", desc: "Andon cord. Stop the line. Improve the standard. Compound the asset.", icon: ShieldCheck },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-28 pb-24 flex flex-col">
        <Tag label="Pillar 2 · Standards as Stations" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em" }}>
          Every standard <span style={{ color: `hsl(${ACCENT})` }}>becomes a station</span> on the line.
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1280, lineHeight: 1.4 }}>
          Toyota's jidoka, ported. Quality is engineered into each station, not inspected at the end. Workers built the stations; they can stop them. LIZA installs four canonical stations and lets the org add more.
        </p>

        <div className="grid grid-cols-[1fr_24px_1fr_24px_1fr_24px_1fr] gap-0 items-stretch flex-1">
          {stations.map((s, i) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.n}>
                <div className="rounded-2xl border-2 p-6 flex flex-col"
                     style={{ background: `hsl(${ACCENT} / 0.05)`, borderColor: `hsl(${ACCENT} / 0.35)` }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-black" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>{s.n}</span>
                    <Icon size={28} style={{ color: `hsl(${ACCENT})` }} />
                  </div>
                  <p className="font-bold mb-3" style={{ fontSize: 28, color: TEXT, lineHeight: 1.1 }}>{s.t}</p>
                  <p className="flex-1" style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{s.desc}</p>
                  <div className="mt-4 pt-3 border-t flex items-center justify-center gap-2" style={{ borderColor: `hsl(${ACCENT} / 0.2)` }}>
                    <span className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>standard governs</span>
                  </div>
                </div>
                {i < stations.length - 1 && (
                  <div className="flex items-center justify-center">
                    <ArrowRight size={20} style={{ color: SUBTLE }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-6 px-7 py-4 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${GREEN} / 0.06)`, borderColor: `hsl(${GREEN})` }}>
          <span className="font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Pillar 2 of 4</span>
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.45 }}>
            Each station is a gate. Each gate enforces a standard. The next pillar is the governance loop that improves the standards over time.
          </p>
        </div>
      </div>
      <Footer text="Pillar 2: standards become physical stops on the line. Quality is engineered in, not inspected later." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F_TAX · The Artisanal Tax (reframed from F04 Math) ──────────────────────
function FArtisanalTax() {
  const derivation = [
    { icon: Clock, label: "Reconstructing context from scratch", hrs: "1.5 h / wk", note: "Hunting decisions, prior versions, who decided what" },
    { icon: AlertTriangle, label: "Checking AI output for hallucinations", hrs: "1.0 h / wk", note: "Re-verifying numbers, sources, claims before sending" },
    { icon: Users, label: "Re-doing work the senior would have caught", hrs: "1.0 h / wk", note: "Judgment gap — junior ships, senior rewrites" },
    { icon: CheckCircle2, label: "Audit, compliance, version reconciliation", hrs: "0.5 h / wk", note: "\"Which version is approved? Who signed off?\"" },
  ];
  const rows = [
    { label: "100-person team still in the workshop", count: "100", waste: "€5.5K", total: "€550K / yr", grow: false },
    { label: "500-person knowledge org", count: "500", waste: "€5.5K", total: "€2.75M / yr", grow: false },
    { label: "10,000-person enterprise", count: "10,000", waste: "€5.5K", total: "€55M / yr", grow: true },
    { label: "Global knowledge economy (TAM proxy)", count: "~470M", waste: "€5.5K", total: "$2.6B SAM", grow: true },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-28 pb-24 flex flex-col">
        <Tag label="The Artisanal Tax" color={GOLD} />
        <h2 className="font-black mb-3" style={{ fontSize: 54, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          The cost of staying a workshop: <span style={{ color: `hsl(${GOLD})` }}>€5,500 per worker per year</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 20, color: MUTED, maxWidth: 1280, lineHeight: 1.4 }}>
          Hand-crafted context is expensive at scale. Every worker reconstructs the same context, checks the same outputs, redoes the same work, every session. AI accelerated the artisan. It did not industrialise the work. Here is the per-worker tax hiding on every P&L.
        </p>

        {/* Derivation panel */}
        <div className="rounded-2xl border p-6 mb-6" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 13, color: SUBTLE }}>How €5,500 / worker is built</span>
            <span className="font-mono" style={{ fontSize: 13, color: SUBTLE }}>Senior loaded rate ≈ €55 / h · 46 working weeks</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {derivation.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="rounded-lg border p-4" style={{ background: "white", borderColor: CHROME_BORDER }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} style={{ color: `hsl(${RED})` }} />
                    <span className="font-mono font-black" style={{ fontSize: 18, color: TEXT }}>{d.hrs}</span>
                  </div>
                  <p className="font-bold mb-1" style={{ fontSize: 15, color: TEXT, lineHeight: 1.25 }}>{d.label}</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.3 }}>{d.note}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 pt-3 border-t font-mono" style={{ borderColor: CHROME_BORDER, fontSize: 16, color: MUTED }}>
            <span>4 h / wk</span>
            <span style={{ color: SUBTLE }}>×</span>
            <span>€55 / h</span>
            <span style={{ color: SUBTLE }}>×</span>
            <span>46 wk</span>
            <span style={{ color: SUBTLE }}>=</span>
            <span className="font-black" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>€10,120 raw</span>
            <span style={{ color: SUBTLE }}>· conservative discount →</span>
            <span className="font-black" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>€5,500</span>
          </div>
        </div>

        {/* Scaling table */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] px-8 py-3 font-mono uppercase tracking-[0.15em] font-bold" style={{ background: CARD_ALT, fontSize: 13, color: MUTED }}>
            <span>Scope</span>
            <span>Workers</span>
            <span>Tax / worker</span>
            <span className="text-right">Annual waste</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1.2fr] px-8 py-4 items-center border-t"
                 style={{ borderColor: CHROME_BORDER, background: r.grow ? `hsl(${GOLD} / 0.06)` : "white" }}>
              <span className="font-semibold" style={{ fontSize: 20, color: TEXT }}>{r.label}</span>
              <span className="font-mono" style={{ fontSize: 18, color: MUTED }}>{r.count}</span>
              <span className="font-mono" style={{ fontSize: 18, color: MUTED }}>{r.waste}</span>
              <span className="font-black text-right" style={{ fontSize: 24, color: r.grow ? `hsl(${GOLD})` : TEXT, letterSpacing: "-0.02em" }}>{r.total}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 px-6 py-3 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${GREEN} / 0.05)`, borderColor: `hsl(${GREEN})` }}>
          <Gauge size={22} style={{ color: `hsl(${GREEN})` }} />
          <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>
            LIZA captures <span className="font-black" style={{ color: `hsl(${GREEN})` }}>5-8%</span> of the artisanal tax = <span className="font-black">€2.75M ACV</span> at 500 ppl · <span className="font-black">95% platform GM</span> · <span className="font-black">&lt; 6 mo payback</span>.
          </p>
        </div>
      </div>
      <Footer text="Derivation: senior-loaded rate, 4 h/wk artisanal overhead. Cross-validated with HBR & McKinsey 2024 rework data, internal 100-worker study." />
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ─── F13 · THE INSTALL (30-day → metered → self-serve) ───────────────────────
function F13Install() {
  const lanes = [
    {
      n: "01", d: "Days 0–30",
      t: "Install the production line",
      desc: "Co-build sprint. We deploy with you. Standards captured, surfaces wired, first 3 workflows live by day 30.",
      tag: "€15K Sprint", color: ACCENT,
    },
    {
      n: "02", d: "Day 31 onwards",
      t: "Metered. Every token tied to a standard.",
      desc: "Production. The line runs. You pay per governed decision, not per seat. 95% platform GM.",
      tag: "Metered", color: GREEN,
    },
    {
      n: "03", d: "Quarter 2 onwards",
      t: "Self-serve install (post-Seed)",
      desc: "The 30-day install itself becomes a guided self-serve wizard. PLG motion compounds the wedge.",
      tag: "Funded by this round", color: GOLD,
    },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="Go-to-Market" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          30-day install. <span style={{ color: `hsl(${GREEN})` }}>Metered from day 31.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          A factory is installed once and runs forever. We install the line in 30 days. The Seed round turns the install itself into a self-serve product.
        </p>
        <div className="space-y-5 flex-1">
          {lanes.map((l) => (
            <div key={l.n} className="grid grid-cols-[80px_180px_1fr_auto] gap-6 items-center rounded-2xl border p-7"
                 style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
              <span className="font-mono font-black" style={{ fontSize: 36, color: `hsl(${l.color})` }}>{l.n}</span>
              <span className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 15, color: MUTED }}>{l.d}</span>
              <div>
                <p className="font-bold mb-1" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>{l.t}</p>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>{l.desc}</p>
              </div>
              <span className="px-4 py-2 rounded-full font-mono uppercase tracking-[0.15em] font-bold whitespace-nowrap"
                    style={{ fontSize: 13, background: `hsl(${l.color} / 0.12)`, color: `hsl(${l.color})`, border: `1px solid hsl(${l.color} / 0.3)` }}>
                {l.tag}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 px-8 py-5 rounded-xl border-l-4" style={{ background: `hsl(${GREEN} / 0.05)`, borderColor: `hsl(${GREEN})` }}>
          <p style={{ fontSize: 22, color: TEXT, lineHeight: 1.45 }}>
            <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>By 2027,</span> AI pricing shifts from flat seats to metered tokens. Microsoft Copilot pay-as-you-go (GA 2025), Anthropic usage-based enterprise tiers, AWS Bedrock per-token billing. Every token becomes a P&L line. We are the layer that makes those tokens defensible.
          </p>
        </div>
      </div>
      <Footer text="Sources: Microsoft Copilot metered messages (announced 2024, GA 2025) · Anthropic enterprise usage tiers · AWS Bedrock per-token pricing." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F14 · HERO VERTICAL: AEC (and the pattern repeats) ──────────────────────
function F14Vertical() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="Hero Vertical · Pattern Repeats" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          AEC is the first floor. <span style={{ color: `hsl(${ACCENT})` }}>The factory pattern is universal.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          We picked AEC because the artifact is concrete (drawings, specs, BIM models), the regulator is unforgiving, and the partner is a global incumbent. Once the line runs there, the same line runs everywhere.
        </p>
        <div className="grid grid-cols-[1.3fr_1fr] gap-8 flex-1">
          <div className="rounded-2xl border-2 p-9" style={{ background: `hsl(${ACCENT} / 0.04)`, borderColor: `hsl(${ACCENT} / 0.4)` }}>
            <div className="flex items-center gap-3 mb-5">
              <Building2 size={26} style={{ color: `hsl(${ACCENT})` }} />
              <span className="font-mono uppercase tracking-[0.2em] font-bold" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>AEC · Live deployment</span>
            </div>
            <p className="font-bold mb-6" style={{ fontSize: 32, color: TEXT, lineHeight: 1.2 }}>
              CTO-sponsored SaaS deployment at a global AEC software leader. Partnership in motion with Nemetschek-scale incumbent.
            </p>
            <div className="grid grid-cols-3 gap-5 mb-6">
              {[
                { k: "Standards encoded", v: "127" },
                { k: "Decisions / month", v: "3,400+" },
                { k: "Time-to-spec drop", v: "62%" },
              ].map((s) => (
                <div key={s.k} className="text-center p-4 rounded-xl bg-white border" style={{ borderColor: CHROME_BORDER }}>
                  <p className="font-black mb-1" style={{ fontSize: 32, color: `hsl(${ACCENT})`, letterSpacing: "-0.02em" }}>{s.v}</p>
                  <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>{s.k}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
              <li>· Drawing review standards enforced at every prompt.</li>
              <li>· Specification compounding into a portable bundle.</li>
              <li>· Rationale log audited by partner QA, not by us.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-mono uppercase tracking-[0.2em] font-bold mb-3" style={{ fontSize: 14, color: MUTED }}>The pattern repeats in</p>
            {[
              { i: <Workflow size={20} />, t: "Professional Services", d: "Engagement methodology, deliverable quality bar, knowledge harvest." },
              { i: <Layers size={20} />, t: "Pharma & Life Sciences", d: "GxP procedures, lab governance, regulatory submissions." },
              { i: <CheckCircle2 size={20} />, t: "Insurance Underwriting", d: "Risk standards, loss-history checks, audit lineage." },
              { i: <Sparkles size={20} />, t: "Banking & Compliance", d: "KYC, AML, model validation, second-line review." },
            ].map((v) => (
              <div key={v.t} className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
                <div className="p-2 rounded-lg" style={{ background: `hsl(${ACCENT} / 0.1)`, color: `hsl(${ACCENT})` }}>{v.i}</div>
                <div>
                  <p className="font-bold mb-0.5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.2 }}>{v.t}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer text="One floor proves the architecture. Every regulated artifact vertical reuses the same line." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F16 · TEAM (data/AI architecture in production) ─────────────────────────
function F16Team() {
  const team = [
    {
      name: "Founding team",
      role: "Architects of data and AI systems in production",
      bio: "15+ years building enterprise data platforms, knowledge architectures, and AI systems that had to ship and survive regulators. Pre-LLM, the same work was called \"semantic layer\" and \"master data\". The factory is the natural next layer.",
    },
    {
      name: "Delivery network",
      role: "Partner consultancies with operations DNA",
      bio: "200+ enterprise engagements through partner delivery. Pharma QA, AEC delivery teams, automotive R&D, financial controls. Operations credibility comes through the partner stack; we build the line they run on.",
    },
    {
      name: "Advisory bench",
      role: "Regulated-industry CTOs and Chief AI Officers",
      bio: "Active advisors from AEC software incumbents, pharma compliance, and tier-one consulting. The buyers of the next 18 months sit on our advisory bench, not in our pipeline.",
    },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="Team" color={PURPLE} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          We have built <span style={{ color: `hsl(${PURPLE})` }}>data and AI architectures in production for 15 years.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          The factory floor is not a metaphor we discovered. It is the natural next layer on top of the work we have done since before LLMs existed.
        </p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {team.map((t) => (
            <div key={t.name} className="rounded-2xl border p-8 flex flex-col" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                   style={{ background: `hsl(${PURPLE} / 0.12)`, color: `hsl(${PURPLE})` }}>
                <Users size={26} />
              </div>
              <p className="font-bold mb-1" style={{ fontSize: 24, color: TEXT, lineHeight: 1.2 }}>{t.name}</p>
              <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: 13, color: `hsl(${PURPLE})` }}>{t.role}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Operations credibility ships through the partner network. We build the line the operators run on." />
      <SlideBar from={PURPLE} to={ACCENT} />
    </div>
  );
}

// ─── F17 · THE ASK ───────────────────────────────────────────────────────────
function F17Ask() {
  return (
    <div className="w-full h-full relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-10 left-12 font-mono" style={{ fontSize: 14, color: DARK_MUTED, letterSpacing: "0.15em" }}>
        <PageNumber dark />
      </div>
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <p className="font-mono uppercase tracking-[0.3em] mb-8" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>The Ask</p>
        <h2 className="font-black mb-4" style={{ fontSize: 84, lineHeight: 1.04, color: DARK_TEXT, letterSpacing: "-0.035em" }}>
          €2M Seed.<br />
          <span style={{ color: `hsl(${GREEN})` }}>This round funds the factory floor.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          We are live in production with paying customers. The round productises the install, scales the partner network, and locks the metered pricing model before AI consumption pricing becomes the default.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { k: "Self-serve install", v: "60%", d: "of €2M · the 30-day install becomes a guided wizard. Removes the human bottleneck in onboarding." },
            { k: "Vertical depth", v: "25%", d: "of €2M · AEC pattern fully dressed, two adjacent verticals validated through partners." },
            { k: "Metered economics", v: "15%", d: "of €2M · the billing, telemetry and standards engine that makes per-decision pricing defensible at audit." },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl p-7 border" style={{ background: "hsl(0 0% 100% / 0.04)", borderColor: "hsl(0 0% 100% / 0.12)" }}>
              <p className="font-mono uppercase tracking-[0.15em] mb-3" style={{ fontSize: 13, color: DARK_MUTED }}>{s.k}</p>
              <p className="font-black mb-3" style={{ fontSize: 56, color: `hsl(${GREEN})`, letterSpacing: "-0.03em" }}>{s.v}</p>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.45 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-8 border-2" style={{ background: `hsl(${GREEN} / 0.06)`, borderColor: `hsl(${GREEN} / 0.35)` }}>
          <div className="grid grid-cols-3 gap-8 items-center">
            <div>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Milestone at month 18</p>
              <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.2 }}>€3M ARR, 50% self-serve.</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Setup for Series A</p>
              <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.2 }}>Metered economics proven. Vertical pattern repeatable.</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>The bet</p>
              <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.2 }}>Models commoditise. Factories compound.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-7 left-28 right-28 flex items-center gap-3" style={{ color: DARK_MUTED, fontSize: 15 }}>
        <span style={{ width: 32, height: 1, background: "hsl(0 0% 100% / 0.2)" }} />
        <span>The machine is now commodity. The production system is the moat.</span>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DECK COMPOSITION
// ═════════════════════════════════════════════════════════════════════════════

// ─── F_CHAIN · The Red Thread · Single canvas, 6 reveals auto-staggered ──────
function FChain() {
  const beats = [
    { n: 1, color: RED,    icon: Skull,    title: "Every session dies",          body: "ChatGPT closes. The method evaporates. Nothing compounds." },
    { n: 2, color: GOLD,   icon: Hammer,   title: "You patch with workshop fixes", body: "Prompt libraries. Shared docs. Slack channels. Stays in Era I." },
    { n: 3, color: RED,    icon: Megaphone, title: "Vendors push more seats",     body: "Copilot to five thousand desks. Called transformation. Lands you in Era II." },
    { n: 4, color: SUBTLE, icon: AlertTriangle, title: "Both moves are unconscious", body: "Buyer reflex and vendor reflex. Neither side names the trap they are in." },
    { n: 5, color: ACCENT, icon: ArrowRight, title: "Era IV is the only exit",   body: "Skip the Ford rollout. Toyota was the bridge mechanic, not the destination." },
    { n: 6, color: GREEN,  icon: Sparkles, title: "Here is the substrate that ships it", body: "Typed standards. Compiled context. Versioned intent. Governed loop." },
  ];
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <style>{`
        @keyframes chain-pop { 0% { opacity: 0; transform: translateY(14px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes chain-line { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
        .chain-card { opacity: 0; animation: chain-pop 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
        .chain-connector { stroke-dasharray: 200; stroke-dashoffset: 200; animation: chain-line 0.45s ease-out forwards; }
      `}</style>
      <div className="absolute inset-0 px-24 pt-24 pb-32 flex flex-col">
        <Tag label="The Red Thread · One Sentence, Six Beats" color={GREEN} />
        <h2 className="font-black mb-3" style={{ fontSize: 56, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          The whole deck in one chain. <span style={{ color: `hsl(${GREEN})` }}>Everything else is a zoom-in.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          The disposable session is the disease. The workshop patch and the vendor seat are the two unconscious reflexes. Era IV is the exit. The next eight slides build it out. Keep this chain in your head.
        </p>

        {/* The 6-beat chain: 2 rows of 3, with SVG connectors drawn between */}
        <div className="relative flex-1">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1700 540" preserveAspectRatio="none">
            {/* row 1: 1 → 2 → 3 */}
            <line x1="540"  y1="125" x2="600"  y2="125" className="chain-connector" stroke={`hsl(${SUBTLE})`} strokeWidth="2.5" style={{ animationDelay: "0.55s" }} />
            <line x1="1100" y1="125" x2="1160" y2="125" className="chain-connector" stroke={`hsl(${SUBTLE})`} strokeWidth="2.5" style={{ animationDelay: "1.10s" }} />
            {/* row 1 → row 2 (3 → 4) */}
            <path d="M 1490 220 Q 1620 270, 1490 320" className="chain-connector" stroke={`hsl(${SUBTLE})`} strokeWidth="2.5" fill="none" style={{ animationDelay: "1.65s" }} />
            {/* row 2: 4 → 5 → 6 (reversed visual flow) */}
            <line x1="1160" y1="415" x2="1100" y2="415" className="chain-connector" stroke={`hsl(${SUBTLE})`} strokeWidth="2.5" style={{ animationDelay: "2.20s" }} />
            <line x1="600"  y1="415" x2="540"  y2="415" className="chain-connector" stroke={`hsl(${ACCENT})`} strokeWidth="2.5" style={{ animationDelay: "2.75s" }} />
          </svg>

          <div className="grid grid-cols-3 gap-6">
            {beats.slice(0, 3).map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={b.n} className="chain-card rounded-2xl border-2 p-5 bg-white"
                     style={{ borderColor: `hsl(${b.color} / 0.5)`, animationDelay: `${i * 0.55}s` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center font-mono font-black"
                         style={{ background: `hsl(${b.color} / 0.12)`, color: `hsl(${b.color})`, fontSize: 16 }}>
                      {b.n}
                    </div>
                    <Icon size={20} style={{ color: `hsl(${b.color})` }} />
                  </div>
                  <p className="font-black mb-1.5" style={{ fontSize: 22, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{b.title}</p>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{b.body}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10">
            {/* row 2 reversed so the chain flows ←: beat 6 right? Actually flow 3→4→5→6: keep left→right with 4,5,6 */}
            {beats.slice(3, 6).map((b, i) => {
              const Icon = b.icon;
              const idx = i + 3;
              const isFinale = b.n === 6;
              return (
                <div key={b.n} className="chain-card rounded-2xl border-2 p-5"
                     style={{
                       borderColor: `hsl(${b.color} / 0.5)`,
                       background: isFinale ? `hsl(${GREEN} / 0.08)` : "white",
                       animationDelay: `${1.65 + i * 0.55}s`,
                     }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center font-mono font-black"
                         style={{ background: `hsl(${b.color} / 0.12)`, color: `hsl(${b.color})`, fontSize: 16 }}>
                      {b.n}
                    </div>
                    <Icon size={20} style={{ color: `hsl(${b.color})` }} />
                  </div>
                  <p className="font-black mb-1.5" style={{ fontSize: 22, color: TEXT, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{b.title}</p>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{b.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer text="Six beats. One thread. Every other slide in this deck is a zoom-in on one beat." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ─── F_WHYHARD · Why nobody has built Era IV for knowledge work ──────────────
function FWhyHard() {
  const walls = [
    { k: "Meaning is unstructured",     v: "Knowledge lives in docs, threads, heads. No schema. Nothing to assemble against.",         icon: FileText },
    { k: "Standards drift hourly",      v: "Policy, pricing, playbook all change. A frozen RAG index is wrong by Tuesday.",            icon: Wind },
    { k: "Retrieval pollutes context",  v: "Top-k chunks pull in stale, contradictory, off-brand text. The model averages the mess.",  icon: Skull },
    { k: "No version control of intent",v: "Who said what, when, under which rule? No git for meaning. No diff. No rollback.",         icon: GitBranch },
    { k: "Evaluation is theatre",       v: "Vibes-based QA. No regression suite. A 'better' prompt silently breaks 40 use cases.",      icon: AlertTriangle },
    { k: "Governance is a PDF",         v: "Audit lives in Confluence, not in the call path. Compliance cannot prove what fired.",      icon: Ban },
    { k: "Org incentives push Ford",    v: "Vendors sell seats. Buyers count licences. Nobody is paid to build the line.",              icon: Megaphone },
    { k: "Talent is artisanal",         v: "The people who could build this are busy answering tickets, one hand-crafted prompt at a time.", icon: Hammer },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag label="The Wall · Why Era IV Is Not Already Built" color={RED} />
        <h2 className="font-black mb-3" style={{ fontSize: 56, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          If this were easy, <span style={{ color: `hsl(${RED})` }}>Microsoft would have shipped it.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 20, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          Toyota took fifty years and a culture rebuild. For knowledge work the wall is steeper. Meaning is unstructured. Standards drift. Retrieval pollutes context. The org is paid to buy seats, not build lines. Eight structural reasons nobody has done this yet.
        </p>
        <div className="grid grid-cols-4 gap-4 flex-1">
          {walls.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.k} className="rounded-xl border p-5 flex flex-col" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.3)` }}>
                <Icon size={22} style={{ color: `hsl(${RED})` }} />
                <p className="font-bold mt-3 mb-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.2 }}>{w.k}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{w.v}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 px-7 py-4 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${RED} / 0.06)`, borderColor: `hsl(${RED})` }}>
          <Skull size={22} style={{ color: `hsl(${RED})` }} />
          <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
            <span className="font-black">Toyota was the bridge. Era IV is the destination.</span> The shortcut is to push more seats and call it strategy. The next slide is the substrate that breaks every wall above.
          </p>
        </div>
      </div>
      <Footer text="No incumbent ships a typed standards engine with audit-grade context assembly. The wall is structural." />
      <SpineIndicator current={6} />
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ─── F_HOWWEBREAK · The stack that breaks the wall ───────────────────────────
function FHowWeBreak() {
  const layers = [
    { n: "01", name: "Typed Knowledge Graph", icon: GitBranch, color: ACCENT,
      breaks: "Meaning unstructured · Standards drift",
      what: "Every concept, rule, role, asset and outcome is a typed node with provenance, owner, version and effective date. Not a doc store. A schema for the business." },
    { n: "02", name: "Context Compiler", icon: Cog, color: GREEN,
      breaks: "Retrieval pollutes context",
      what: "Outcomes do not search. They compile. The outcome declares which standards it needs, the compiler assembles the exact context from primary sources. No top-k. No averaging." },
    { n: "03", name: "Standards as Code", icon: FileText, color: PURPLE,
      breaks: "No version control of intent",
      what: "Every policy, playbook and decision rule is a versioned artefact. Diffs, rollbacks, pull requests. The Andon cord is a commit, not a meeting." },
    { n: "04", name: "Evaluation Harness", icon: ShieldCheck, color: GOLD,
      breaks: "Evaluation is theatre",
      what: "Every standard ships with regression cases. A change to one rule replays against every use case that touches it. Quality measured on every commit." },
    { n: "05", name: "Governance Loop", icon: Workflow, color: ACCENT,
      breaks: "Governance is a PDF",
      what: "Every token call is logged with the standard that fired it. Audit is generated, not assembled. Compliance reads the same loop the operator runs." },
    { n: "06", name: "Outcome Router", icon: Coins, color: GREEN,
      breaks: "Org incentives push Ford",
      what: "Spend ties to outcomes, not seats. Every token is called by a named outcome through a named standard. The CFO sees cost per decision, not licences per head." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag label="The Stack · How LIZA Breaks the Wall" color={GREEN} />
        <h2 className="font-black mb-3" style={{ fontSize: 54, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Six layers. <span style={{ color: `hsl(${GREEN})` }}>Each one removes a reason nobody has done this.</span>
        </h2>

        {/* Objection-kill banner */}
        <div className="mb-5 px-6 py-3 rounded-xl border flex items-start gap-3" style={{ background: `hsl(${ACCENT} / 0.06)`, borderColor: `hsl(${ACCENT} / 0.35)` }}>
          <Zap size={18} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 3 }} />
          <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-bold" style={{ color: `hsl(${ACCENT})` }}>"Isn't this just a chat with better RAG?"</span> The surface is a chat. So is a Tesla dashboard. This slide is the line underneath. Six layers. Not retrieval. Not vibes.
          </p>
        </div>

        <p className="mb-5" style={{ fontSize: 18, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          The wall is the absence of a substrate. We built the substrate. A typed knowledge graph holds the meaning. A context compiler assembles it on demand. Standards live as versioned code. The harness regression-tests every change. The loop logs every call. The router ties every token to an outcome.
        </p>
        <div className="grid grid-cols-3 gap-4 flex-1">
          {layers.map((l) => {
            const Icon = l.icon;
            return (
              <div key={l.n} className="rounded-2xl border-2 p-5 flex flex-col" style={{ background: `hsl(${l.color} / 0.05)`, borderColor: `hsl(${l.color} / 0.45)` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black" style={{ fontSize: 20, color: `hsl(${l.color})` }}>L{l.n}</span>
                  <Icon size={22} style={{ color: `hsl(${l.color})` }} />
                </div>
                <p className="font-bold mb-2" style={{ fontSize: 20, color: TEXT, lineHeight: 1.15 }}>{l.name}</p>
                <p className="font-mono uppercase tracking-[0.13em] mb-3" style={{ fontSize: 10, color: `hsl(${RED})` }}>Breaks: {l.breaks}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{l.what}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 px-7 py-4 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${GREEN} / 0.06)`, borderColor: `hsl(${GREEN})` }}>
          <Zap size={22} style={{ color: `hsl(${GREEN})` }} />
          <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
            <span className="font-black">This is the substrate.</span> The next four slides run the line station by station: Pull, Stations, Governance, Compile. Not metaphors. What the stack does on every call.
          </p>
        </div>
      </div>
      <Footer text="Knowledge graph + context compiler + standards-as-code + eval harness + governance loop + outcome router. The missing substrate for Era IV." />
      <SpineIndicator current={6} />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// F_STORYFILM · One cinematic canvas replacing slides 3–8.
// Spine left · Stage center · Drawer right. Six beats. ←/→ step beats first,
// only spill to deck nav at boundaries. Space toggles autoplay. D toggles drawer.
// ═════════════════════════════════════════════════════════════════════════════

const FILM_BEATS = [
  {
    n: 1,
    color: GOLD,
    label: "Workshop",
    title: "Your workshop today",
    line: "Three artisans. Three private methods. Brilliance that does not transfer.",
    drawerTitle: "Eight artisan archetypes already on your floor",
    drawer: [
      { t: "The Prompt Whisperer", d: "Only one PM can brief the model. Off Monday." },
      { t: "The Folder Grimoire", d: "Three years of prompts encrypted in one head." },
      { t: "The Re-Briefer", d: "Senior rewrites every junior's AI output. Calls it quality." },
      { t: "The Macro Smith", d: "Hand-tuned Zapier flows owned by one person. Brittle." },
      { t: "The Firefighter", d: "Fixes hallucinations after the email is sent." },
      { t: "The Inventor", d: "Builds a new GPT every week. Nothing accumulates." },
      { t: "The Personal Methodologist", d: "Has a system. Will not write it down." },
      { t: "The Hoarder", d: "Saves every prompt. Nobody can find anything when they leave." },
    ],
  },
  {
    n: 2,
    color: RED,
    label: "Sessions die",
    title: "Every session evaporates",
    line: "12,847 sessions opened today. Zero survive Monday. Nothing compounds.",
    drawerTitle: "What the workshop tax actually costs you",
    drawer: [
      { t: "Vacation paralysis", d: "Best prompter is off. Team quality drops 40%. Nobody replicates the method." },
      { t: "Onboarding amnesia", d: "New hire gets a Notion doc. The craft lives in seniors' hands, not the doc." },
      { t: "Audit blindness", d: "\"Why did AI say that?\" Session is gone. Reasoning was never written down." },
      { t: "Method drift", d: "Three people, same task, three ways. None know the others exist." },
      { t: "Sessions opened today", d: "12,847 per 500-person org. Real telemetry from a customer deployment." },
      { t: "Surviving tomorrow", d: "Zero. No standard captured. No bundle written. No method retained." },
      { t: "Re-asked next week", d: "78%. Same question, different prompt, different answer, different worker." },
    ],
  },
  {
    n: 3,
    color: GOLD,
    label: "You patch",
    title: "You patch from below",
    line: "Prompt libraries. Shared docs. AI champions. All half-conscious. All stays in Era I.",
    drawerTitle: "Bottom-up reflexes that look like progress",
    drawer: [
      { t: "Prompt libraries", d: "Notion page of \"good prompts.\" Nobody updates it. Nobody finds the one they need." },
      { t: "AI champions program", d: "Volunteer evangelists. No mandate, no budget, no leverage on the line." },
      { t: "Internal GPT bots", d: "Each team builds one. None talk to each other. None survive a re-org." },
      { t: "Slack #ai-tips channel", d: "Tips scroll past. No taxonomy. No version. No regression." },
      { t: "Lunch-and-learns", d: "Tribal knowledge transfer at human bandwidth. Cannot scale past 50 seats." },
      { t: "Shadow workflows", d: "Macros, Zapier, Make. Owned by one person. Break when they leave." },
    ],
  },
  {
    n: 4,
    color: RED,
    label: "They push",
    title: "They push from above",
    line: "Copilot to 50,000 desks. RAG retrofits. Agent frameworks. Called transformation.",
    drawerTitle: "Top-down push that looks like strategy",
    drawer: [
      { t: "Microsoft Copilot", d: "$30/seat/month × 50,000 desks. $18M/yr for identical generic output." },
      { t: "Enterprise ChatGPT", d: "Same prompt, different answer. No standard. No audit trail." },
      { t: "RAG retrofits", d: "Bolt vector search onto SharePoint. Top-k pulls in stale and contradictory chunks." },
      { t: "Agent frameworks", d: "Quarterly new abstraction. Last quarter's POC is already legacy." },
      { t: "Per-seat pricing", d: "CFO sees licences per head, not cost per decision. Cannot measure ROI." },
      { t: "\"AI strategy\" decks", d: "Vendor-shaped slideware. Procurement signs. Frontline never notices." },
    ],
  },
  {
    n: 5,
    color: SUBTLE,
    label: "The trap",
    title: "Both arrows collide. Era II.",
    line: "You did not choose this. Buyer reflex and vendor reflex pushed you into the Ford rollout together.",
    drawerTitle: "Ford 1913, in different clothes",
    drawer: [
      { t: "Direction of flow", d: "Ford: top-down push of tools and seats. Toyota: pull from outcome through standard." },
      { t: "Worker role", d: "Ford: execute uniform throughput. Toyota: design and stop the stations." },
      { t: "Quality control", d: "Ford: inspect at the end. Toyota: built in at every station." },
      { t: "When something fails", d: "Ford: ship the defect, fix later. Toyota: andon cord. Stop the line. Fix." },
      { t: "What compounds", d: "Ford: nothing. Replace the line. Toyota: standards, rationale, method." },
      { t: "Where craft lives", d: "Ford: outside the line. Lost. Toyota: encoded by the workers themselves." },
    ],
  },
  {
    n: 6,
    color: GREEN,
    label: "Era IV",
    title: "Manufacture the context right in the first place",
    line: "Skip Era II entirely. Era IV substrate, installed on top of Era I, using Toyota mechanics.",
    drawerTitle: "Six layers that break every wall above",
    drawer: [
      { t: "L01 · Typed Knowledge Graph", d: "Concept, rule, role, asset, outcome as typed nodes with provenance and version. Not a doc store." },
      { t: "L02 · Context Compiler", d: "Outcomes do not search. They compile context from primary sources. No top-k. No averaging." },
      { t: "L03 · Standards as Code", d: "Every policy and decision rule is a versioned artefact. Diffs, rollbacks, pull requests." },
      { t: "L04 · Evaluation Harness", d: "Every standard ships with regression cases. A rule change replays across every use case." },
      { t: "L05 · Governance Loop", d: "Every token call logged with the standard that fired it. Audit is generated, not assembled." },
      { t: "L06 · Outcome Router", d: "Spend ties to outcomes, not seats. CFO sees cost per decision." },
    ],
  },
] as const;

/* Center-stage scene per beat. SVG vector storytelling, cross-faded. */
function FilmStage({ beat }: { beat: number }) {
  return (
    <div className="relative w-full h-full">
      {FILM_BEATS.map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{ opacity: i === beat ? 1 : 0, pointerEvents: i === beat ? "auto" : "none" }}
        >
          {renderScene(i)}
        </div>
      ))}
    </div>
  );
}

function renderScene(i: number) {
  switch (i) {
    case 0: return <SceneWorkshop />;
    case 1: return <SceneEvaporate />;
    case 2: return <ScenePatchUp />;
    case 3: return <ScenePushDown />;
    case 4: return <SceneCollision />;
    case 5: return <SceneEraIV />;
    default: return null;
  }
}

/* Reusable artisan figure: head, body, workbench, optional thought bubble. */
function Artisan({ x, color, bubble, evaporate = false, delay = 0 }: { x: number; color: string; bubble?: string; evaporate?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x}, 360)`}>
      {/* bench */}
      <rect x={-70} y={80} width={140} height={10} rx={2} fill={`hsl(${SUBTLE})`} opacity={0.5} />
      <rect x={-60} y={90} width={6} height={48} fill={`hsl(${SUBTLE})`} opacity={0.4} />
      <rect x={54} y={90} width={6} height={48} fill={`hsl(${SUBTLE})`} opacity={0.4} />
      {/* body */}
      <circle cx={0} cy={20} r={26} fill={`hsl(${color} / 0.85)`} />
      <path d={`M -42 78 Q 0 36 42 78 L 42 80 L -42 80 Z`} fill={`hsl(${color} / 0.85)`} />
      {/* head */}
      <circle cx={0} cy={-14} r={22} fill="white" stroke={`hsl(${color})`} strokeWidth={3} />
      {/* thought bubble */}
      {bubble && (
        <g style={{
          animation: evaporate
            ? `bubble-evap 1.4s ${delay}s cubic-bezier(0.4,0,0.6,1) forwards`
            : `bubble-in 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1) both`,
          transformOrigin: "0px -90px",
        }}>
          <ellipse cx={0} cy={-90} rx={92} ry={32} fill="white" stroke={`hsl(${color})`} strokeWidth={2.5} />
          <circle cx={-22} cy={-58} r={6} fill="white" stroke={`hsl(${color})`} strokeWidth={2} />
          <circle cx={-30} cy={-44} r={3.5} fill="white" stroke={`hsl(${color})`} strokeWidth={1.5} />
          <text x={0} y={-86} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={14} fontWeight={700} fill={`hsl(${color})`}>
            {bubble}
          </text>
        </g>
      )}
    </g>
  );
}

function SceneWorkshop() {
  return (
    <svg viewBox="0 0 1100 540" className="w-full h-full">
      <style>{`
        @keyframes bubble-in { 0% { opacity: 0; transform: translateY(8px) scale(0.85); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      <text x={550} y={64} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={20} fontWeight={700} fill={`hsl(${MUTED})`} letterSpacing="0.18em">
        THREE OF YOUR PEOPLE. THREE PRIVATE METHODS.
      </text>
      <Artisan x={220} color={GOLD} bubble="my prompt" delay={0.05} />
      <Artisan x={550} color={GOLD} bubble="my folder" delay={0.35} />
      <Artisan x={880} color={GOLD} bubble="my macro" delay={0.65} />
      <text x={550} y={500} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={16} fontWeight={500} fill={`hsl(${SUBTLE})`}>
        The output ships. The method does not.
      </text>
    </svg>
  );
}

function SceneEvaporate() {
  return (
    <svg viewBox="0 0 1100 540" className="w-full h-full">
      <style>{`
        @keyframes bubble-evap { 0% { opacity: 1; transform: translateY(0) scale(1); } 60% { opacity: 0.4; transform: translateY(-30px) scale(1.1); } 100% { opacity: 0; transform: translateY(-80px) scale(1.3); } }
        @keyframes counter-flip-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Artisan x={220} color={RED} bubble="my prompt" evaporate delay={0.1} />
      <Artisan x={550} color={RED} bubble="my folder" evaporate delay={0.35} />
      <Artisan x={880} color={RED} bubble="my macro" evaporate delay={0.6} />
      <g style={{ animation: "counter-flip-in 0.6s 1.4s both" }}>
        <text x={550} y={130} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={64} fontWeight={900} fill={`hsl(${RED})`} letterSpacing="-0.04em">
          12,847 <tspan fill={`hsl(${SUBTLE})`}>→</tspan> 0
        </text>
        <text x={550} y={160} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={18} fontWeight={600} fill={`hsl(${MUTED})`} letterSpacing="0.15em">
          SESSIONS OPENED · SURVIVING MONDAY
        </text>
      </g>
    </svg>
  );
}

function ScenePatchUp() {
  return (
    <svg viewBox="0 0 1100 540" className="w-full h-full">
      <style>{`
        @keyframes arrow-up { 0% { stroke-dashoffset: 600; opacity: 0; } 30% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes wobble { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes ceiling-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
      `}</style>
      {/* ceiling line · "Era I ceiling" */}
      <line x1={120} y1={120} x2={980} y2={120} stroke={`hsl(${GOLD})`} strokeWidth={2} strokeDasharray="6 6" style={{ animation: "ceiling-pulse 2.4s ease-in-out infinite" }} />
      <text x={550} y={104} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={14} fontWeight={700} fill={`hsl(${GOLD})`} letterSpacing="0.2em">
        ERA I CEILING · WORKSHOP
      </text>
      {/* wobbly up-arrow from artisans toward ceiling */}
      <g style={{ animation: "wobble 2.4s ease-in-out infinite" }}>
        <path
          d="M 550 440 C 540 360, 560 280, 550 180"
          stroke={`hsl(${GOLD})`}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="600"
          style={{ animation: "arrow-up 1.6s cubic-bezier(0.6,0,0.3,1) forwards" }}
        />
        <path d="M 538 192 L 550 168 L 562 192" stroke={`hsl(${GOLD})`} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Artisan x={550} color={GOLD} />
      {/* tag */}
      <g>
        <rect x={690} y={290} width={250} height={68} rx={10} fill="white" stroke={`hsl(${GOLD})`} strokeWidth={2} />
        <text x={815} y={318} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={12} fontWeight={700} fill={`hsl(${GOLD})`} letterSpacing="0.18em">YOUR REFLEX</text>
        <text x={815} y={342} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={16} fontWeight={700} fill={`hsl(${TEXT})`}>Half-baked workshop fixes</text>
      </g>
    </svg>
  );
}

function ScenePushDown() {
  const tags = ["$30/seat", "Copilot", "RAG", "Agents", "$30/seat", "Copilot"];
  return (
    <svg viewBox="0 0 1100 540" className="w-full h-full">
      <style>{`
        @keyframes rain-down { 0% { transform: translateY(-40px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(360px); opacity: 0; } }
      `}</style>
      {/* vendor cloud */}
      <g>
        <ellipse cx={550} cy={80} rx={260} ry={36} fill={`hsl(${RED} / 0.12)`} stroke={`hsl(${RED})`} strokeWidth={2} />
        <text x={550} y={86} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={16} fontWeight={800} fill={`hsl(${RED})`} letterSpacing="0.2em">VENDOR PUSH</text>
      </g>
      {/* raining tags */}
      {tags.map((t, i) => (
        <g key={i} style={{ animation: `rain-down 2.2s ${i * 0.25}s cubic-bezier(0.4,0,0.6,1) infinite` }}>
          <rect x={170 + i * 130} y={110} width={104} height={32} rx={6} fill="white" stroke={`hsl(${RED})`} strokeWidth={1.5} />
          <text x={170 + i * 130 + 52} y={131} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={13} fontWeight={700} fill={`hsl(${RED})`}>{t}</text>
        </g>
      ))}
      {/* desks */}
      <Artisan x={220} color={SUBTLE} />
      <Artisan x={550} color={SUBTLE} />
      <Artisan x={880} color={SUBTLE} />
      <text x={550} y={500} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={16} fontWeight={600} fill={`hsl(${MUTED})`}>
        Identical generic output. Worker as prompt-typist.
      </text>
    </svg>
  );
}

function SceneCollision() {
  return (
    <svg viewBox="0 0 1100 540" className="w-full h-full">
      <style>{`
        @keyframes arrow-collide-up   { 0% { transform: translateY(120px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes arrow-collide-down { 0% { transform: translateY(-120px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes crumple { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
      `}</style>
      {/* up arrow (your reflex) */}
      <g style={{ animation: "arrow-collide-up 1s cubic-bezier(0.6,0,0.3,1) forwards", transformOrigin: "550px 270px" }}>
        <path d="M 550 450 L 550 290" stroke={`hsl(${GOLD})`} strokeWidth={6} strokeLinecap="round" />
        <path d="M 535 305 L 550 280 L 565 305" stroke={`hsl(${GOLD})`} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* down arrow (vendor push) */}
      <g style={{ animation: "arrow-collide-down 1s cubic-bezier(0.6,0,0.3,1) forwards", transformOrigin: "550px 270px" }}>
        <path d="M 550 90 L 550 250" stroke={`hsl(${RED})`} strokeWidth={6} strokeLinecap="round" />
        <path d="M 535 235 L 550 260 L 565 235" stroke={`hsl(${RED})`} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* flash at collision */}
      <circle cx={550} cy={270} r={42} fill={`hsl(${SUBTLE} / 0.4)`} style={{ animation: "flash 0.6s 1.0s ease-in-out" }} />
      {/* assembly-line silhouette */}
      <g style={{ animation: "crumple 0.7s 1.3s cubic-bezier(0.16,1,0.3,1) both", transformOrigin: "550px 380px" }}>
        <rect x={200} y={360} width={700} height={50} rx={6} fill={`hsl(${SUBTLE} / 0.18)`} stroke={`hsl(${SUBTLE})`} strokeWidth={2} />
        {[260, 360, 460, 560, 660, 760, 860].map(cx => (
          <circle key={cx} cx={cx} cy={385} r={14} fill="white" stroke={`hsl(${SUBTLE})`} strokeWidth={2} />
        ))}
        <text x={550} y={342} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={16} fontWeight={800} fill={`hsl(${SUBTLE})`} letterSpacing="0.2em">
          ERA II · FORD ROLLOUT, REPACKAGED
        </text>
        <text x={550} y={450} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={18} fontWeight={700} fill={`hsl(${TEXT})`}>
          You did not choose this. Both sides pushed you here.
        </text>
      </g>
    </svg>
  );
}

function SceneEraIV() {
  const layers = [
    { n: "L06", t: "Outcome Router" },
    { n: "L05", t: "Governance Loop" },
    { n: "L04", t: "Evaluation Harness" },
    { n: "L03", t: "Standards as Code" },
    { n: "L02", t: "Context Compiler" },
    { n: "L01", t: "Typed Knowledge Graph" },
  ];
  const [typed, setTyped] = useState("");
  const full = "Manufacture the context right in the first place.";
  useEffect(() => {
    setTyped("");
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(timer);
    }, 36);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <svg viewBox="0 0 1100 540" className="w-full h-full">
      <style>{`
        @keyframes layer-stack { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
      {layers.map((l, i) => (
        <g key={l.n} style={{ animation: `layer-stack 0.55s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1) both`, transformOrigin: `550px ${130 + i * 52}px` }}>
          <rect x={260} y={130 + i * 52} width={580} height={42} rx={8}
            fill={`hsl(${GREEN} / 0.08)`} stroke={`hsl(${GREEN})`} strokeWidth={1.5} />
          <text x={282} y={158 + i * 52} fontFamily="ui-monospace, monospace" fontSize={14} fontWeight={800} fill={`hsl(${GREEN})`}>{l.n}</text>
          <text x={344} y={158 + i * 52} fontFamily="ui-sans-serif, system-ui" fontSize={16} fontWeight={700} fill={`hsl(${TEXT})`}>{l.t}</text>
        </g>
      ))}
      <text x={550} y={510} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize={22} fontWeight={900} fill={`hsl(${GREEN})`} letterSpacing="-0.01em">
        {typed}<tspan opacity={0.6}>▌</tspan>
      </text>
    </svg>
  );
}

function FStoryFilm() {
  const [beat, setBeat] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Reset on mount so re-entering the slide always restarts the film.
  useEffect(() => {
    setBeat(0);
    setDrawerOpen(false);
    setPlaying(false);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    if (beat >= FILM_BEATS.length - 1) { setPlaying(false); return; }
    const t = window.setTimeout(() => setBeat(b => Math.min(b + 1, FILM_BEATS.length - 1)), 5200);
    return () => window.clearTimeout(t);
  }, [playing, beat]);

  // Intercept arrow keys at capture phase. Only spill to deck at boundaries.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (beat < FILM_BEATS.length - 1) {
          e.preventDefault(); e.stopPropagation();
          setBeat(b => b + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (beat > 0) {
          e.preventDefault(); e.stopPropagation();
          setBeat(b => b - 1);
        }
      } else if (e.key.toLowerCase() === "d") {
        e.preventDefault(); e.stopPropagation();
        setDrawerOpen(o => !o);
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault(); e.stopPropagation();
        setPlaying(p => !p);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [beat]);

  const b = FILM_BEATS[beat];

  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />

      {/* Title strip top */}
      <div className="absolute top-0 left-0 right-0 px-20 pt-16 pb-4 flex items-end justify-between" style={{ zIndex: 4 }}>
        <div>
          <Tag label="The Red Thread · One Film" color={GREEN} />
          <h2 className="font-black mt-2" style={{ fontSize: 44, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
            <span style={{ color: `hsl(${b.color})` }}>Beat {b.n} of 6.</span> {b.title}.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying(p => !p)}
            className="px-4 py-2 rounded-lg border font-mono uppercase tracking-[0.18em] font-bold transition-colors"
            style={{ fontSize: 11, color: playing ? `hsl(${GREEN})` : MUTED, borderColor: playing ? `hsl(${GREEN})` : CHROME_BORDER, background: playing ? `hsl(${GREEN} / 0.06)` : "white" }}
          >
            {playing ? "Pause" : "Autoplay"}
          </button>
          <button
            onClick={() => setDrawerOpen(o => !o)}
            className="px-4 py-2 rounded-lg border font-mono uppercase tracking-[0.18em] font-bold transition-colors"
            style={{ fontSize: 11, color: drawerOpen ? `hsl(${ACCENT})` : MUTED, borderColor: drawerOpen ? `hsl(${ACCENT})` : CHROME_BORDER, background: drawerOpen ? `hsl(${ACCENT} / 0.06)` : "white" }}
          >
            {drawerOpen ? "Hide depth" : "Show depth"}
          </button>
        </div>
      </div>

      {/* Three-column layout: spine · stage · drawer */}
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: drawerOpen ? "260px 1fr 520px" : "260px 1fr 0px", paddingTop: 200, paddingBottom: 120, transition: "grid-template-columns 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
        {/* SPINE — left */}
        <div className="pl-20 pr-6 flex flex-col gap-2 justify-center">
          <p className="font-mono uppercase tracking-[0.22em] font-bold mb-4" style={{ fontSize: 10, color: SUBTLE }}>Red thread</p>
          {FILM_BEATS.map((fb, i) => {
            const active = i === beat;
            const past = i < beat;
            return (
              <button
                key={i}
                onClick={() => setBeat(i)}
                className="text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: active ? `hsl(${fb.color} / 0.08)` : "transparent",
                  borderLeft: `3px solid ${active ? `hsl(${fb.color})` : past ? `hsl(${fb.color} / 0.35)` : `hsl(215 15% 88%)`}`,
                }}
              >
                <span className="font-mono font-black mt-0.5" style={{ fontSize: 14, color: active ? `hsl(${fb.color})` : past ? `hsl(${fb.color} / 0.55)` : SUBTLE, width: 16 }}>
                  {fb.n}
                </span>
                <span className="font-bold" style={{ fontSize: 14, color: active ? TEXT : past ? MUTED : SUBTLE, lineHeight: 1.25 }}>
                  {fb.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* STAGE — center */}
        <div className="relative px-8 flex flex-col">
          <div className="flex-1 relative">
            <FilmStage beat={beat} />
          </div>
          <div className="mt-4 px-6 py-3 rounded-xl border-l-4 mx-2" style={{ background: `hsl(${b.color} / 0.05)`, borderColor: `hsl(${b.color})` }}>
            <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>{b.line}</p>
          </div>
        </div>

        {/* DRAWER — right (the 80%, on demand) */}
        <div className="overflow-hidden pr-20 pl-2">
          <div className="h-full rounded-2xl border flex flex-col" style={{ background: "white", borderColor: CHROME_BORDER, opacity: drawerOpen ? 1 : 0, transition: "opacity 0.35s ease 0.15s" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.18em] font-bold mb-1" style={{ fontSize: 10, color: `hsl(${b.color})` }}>Depth · Beat {b.n}</p>
              <p className="font-bold" style={{ fontSize: 17, color: TEXT, lineHeight: 1.2 }}>{b.drawerTitle}</p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {b.drawer.map((item, i) => (
                <div key={i} className="pb-3 border-b last:border-b-0" style={{ borderColor: CHROME_BORDER }}>
                  <p className="font-bold mb-1" style={{ fontSize: 14, color: TEXT, lineHeight: 1.25 }}>{item.t}</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6" style={{ zIndex: 4 }}>
        <span className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: 11, color: SUBTLE }}>
          ← / →  step beat
        </span>
        <span className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: 11, color: SUBTLE }}>
          P  autoplay
        </span>
        <span className="font-mono uppercase tracking-[0.2em]" style={{ fontSize: 11, color: SUBTLE }}>
          D  depth drawer
        </span>
      </div>

      <Footer text="One canvas. Six beats. The full deck in one cinematic chain — depth available on demand, never forced." />
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

const RAW_SLIDES = [
  // ACT I — Arrowhead: workshop → production system (skip Ford)
  { id: "cover",            title: "Cover · Your workshop becomes a production system", component: <F01Cover /> },
  { id: "workshop",         title: "The Workshop You Already Run · Artisan portraits", component: <FWorkshop /> },
  // ACT I — One cinematic canvas replaces six static frames. Depth on demand.
  { id: "story-film",       title: "The Red Thread · One Film · Six Beats",            component: <FStoryFilm /> },
  // ACT II — Pillars holding it up (push/pull demoted from arrowhead)
  { id: "pillar-pull",       title: "Pillar 1 · Pull, Not Push",                        component: <FPillarPull /> },
  { id: "pillar-stations",   title: "Pillar 2 · Standards as Stations",                 component: <FPillarStations /> },
  { id: "pillar-governance", title: "Pillar 3 · Governance Loop · Stop the Line",       component: <S03GovernanceLoop /> },
  { id: "pillar-compile",    title: "Pillar 4 · Every Prompt Is a Compile",             component: <S07cFunnel /> },
  // ACT III — Proof
  { id: "artisanal-tax",     title: "The Artisanal Tax · €550K → $2.6B",                component: <FArtisanalTax /> },
  { id: "aace-not-rag",      title: "This Is AACE, Not RAG · The Defence",              component: <S07eAaceNotRag /> },
  { id: "org-loop",          title: "Every Commit Compounds · The Network",             component: <S07dOrgLoop /> },
  // ACT IV — Path & ask
  { id: "install",           title: "30-Day Install · Metered from Day 31",             component: <F13Install /> },
  { id: "vertical",          title: "Hero Vertical · AEC · Pattern Repeats",            component: <F14Vertical /> },
  { id: "unit-economics",    title: "Unit Economics · 95% Platform GM",                 component: <S10UnitEconomics /> },
  { id: "team",              title: "Team · Data & AI Architecture in Production",      component: <F16Team /> },
  { id: "ask",               title: "The Ask · €2M Seed",                               component: <F17Ask /> },
  { id: "closer",            title: "The Loop, Closed",                                 component: <S13LoopClosed /> },
];
const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: <SlideIndexProvider index={i} total={RAW_SLIDES.length}>{s.component}</SlideIndexProvider>,
}));

// ─── Deck shell (same pattern as TechDDDeck) ─────────────────────────────────
export default function FactoryDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Factory-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Factory Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            Production-system spine · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Factory-Deck" slideCount={SLIDES.length} variant="desktop" />
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
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Factory, Cpu, Building2, Users,
  Workflow, Coins, Sparkles, Mail, CheckCircle2, Layers,
  ArrowDown, ArrowRight, Magnet, Megaphone, Clock, AlertTriangle, Gauge,
  Hammer, Wrench, Flame, FileText, GitBranch, Zap, ShieldCheck,
  Lightbulb, UserCog, Package, Cog, Wind, Skull, Ban,
  Hash, FileCheck2, Lock, Fingerprint, ScrollText, Scale, Database, Eye,
  Boxes, Network, GitCompare, GitMerge, Filter, Radar, Crosshair, Binary,
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
import { StandardLayerDeckSlide } from "@/components/marketing/shared/StandardLayerDeckSlide";

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
      </div>
      <Footer text="The artifact ships. The method dies with the session. This is the workshop tax." />
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
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── F_HOOD · Trabant vs Ferrari · Open the hood ────────────────────────────
function FOpenTheHood() {
  const trabantParts = [
    { name: "Single LLM call", what: "One prompt in, one answer out. No memory of which process is in flight." },
    { name: "Top-k vector RAG", what: "Cosine-similar chunks pasted in. Averages, hallucinates, pollutes." },
    { name: "Static system prompt", what: "A 400-line .txt file. Same context for every user, every task, every risk level." },
    { name: "Free-text notes", what: "Confluence pages. Notion docs. No types, no actions, no overrides." },
    { name: "Re-uploaded duplicates", what: "Every import piles on. No dedupe. The methodology deck enters six times." },
    { name: "Edit and pray", what: "Change the prompt. No diff. No regression. No idea what just broke downstream." },
  ];
  const ferrariParts = [
    { name: "Intent-Lock State Machine", what: "Classifier reads the prompt, locks the session to a Playbook, refuses to drift until STOP/RESET." },
    { name: "JIT XML Context Compiler", what: "Hundreds of items filtered by scope, security, priority. Assembled into a typed XML kernel on every call." },
    { name: "5-Category Typed Ontology", what: "Directive · Knowledge · Procedure · Playbook · Preference. Plus Action Logic: APPEND / OVERRIDE / BLOCK." },
    { name: "5-Layer Context Stack", what: "Org → Domain → Workbook → Chat → User. Inheritance with override arbitration, visualised live." },
    { name: "Content-Hash Dedup + Jaccard Match", what: "SHA-256 trigger on write. Near-duplicates surfaced. Merge / Replace / Keep — never silent collisions." },
    { name: "Two-Pass Structural Extraction", what: "Structure analyst maps the document skeleton. Advisor persona biases category precision on extraction." },
    { name: "Semantic Bundle Matcher", what: "New imports scored against the existing graph on four dimensions. Auto-merge above 0.9. User-confirm 0.7-0.9." },
    { name: "Gutter Diff + Sync Manifest", what: "Edit a canonical doc → line-by-line diff → typed SyncOperation list → cherry-pick before commit. Logged forever." },
    { name: "Mandate Enforcement Gates", what: "Advisory · Required-ACK · Blocking. Status transitions and chats are gated by acknowledged compliance." },
    { name: "Protocol Execution Engine", what: "Playbooks compile to ordered steps with gates. Every run scored on drift and compliance, persisted, queryable." },
    { name: "Impact Simulator (Pre-Commit)", what: "Before any edit ships: how many workbooks affected, how many actively locked, soft-push vs broadcast." },
    { name: "Knowledge Graph Auditor", what: "Background agent: recategorize · split · merge · enrich · promote_mandate · archive. The graph audits itself." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-20 pt-20 pb-16 flex flex-col">
        <Tag label="Open the Hood · Trabant vs Ferrari" color={ACCENT} />
        <h2 className="font-black mb-2" style={{ fontSize: 50, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          From a chat window, both look the same.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>Lift the hood. They are not the same machine.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 16, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          You do not need to be a mechanic to know which car is engineered. The Trabant is a cardboard box on four wheels with a two-stroke engine. The Ferrari is an artisanal masterwork. Same road. Different machine. The market is selling Trabants with leather seats. This is what is actually under our hood.
        </p>

        <div className="grid grid-cols-2 gap-5 flex-1">
          {/* TRABANT */}
          <div className="rounded-2xl border-2 p-5 flex flex-col" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.4)` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skull size={20} style={{ color: `hsl(${RED})` }} />
                <span className="font-mono font-black uppercase tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${RED})` }}>Trabant · chat + RAG</span>
              </div>
              <span className="font-mono" style={{ fontSize: 11, color: SUBTLE }}>2-stroke · cardboard body</span>
            </div>
            <p className="font-bold mb-3" style={{ fontSize: 19, color: TEXT, lineHeight: 1.2 }}>
              Six moving parts. None of them know each other.
            </p>
            <div className="grid grid-cols-1 gap-2 flex-1">
              {trabantParts.map((p) => (
                <div key={p.name} className="rounded-lg border p-2.5" style={{ background: `hsl(${RED} / 0.03)`, borderColor: `hsl(${RED} / 0.25)` }}>
                  <p className="font-bold" style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.2 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.35 }}>{p.what}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FERRARI */}
          <div className="rounded-2xl border-2 p-5 flex flex-col" style={{ background: `hsl(${GREEN} / 0.05)`, borderColor: `hsl(${GREEN} / 0.5)` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cog size={20} style={{ color: `hsl(${GREEN})` }} />
                <span className="font-mono font-black uppercase tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>LIZA · AACE v3.1 engine</span>
              </div>
              <span className="font-mono" style={{ fontSize: 11, color: SUBTLE }}>12 engineered subsystems · one runtime</span>
            </div>
            <p className="font-bold mb-3" style={{ fontSize: 19, color: TEXT, lineHeight: 1.2 }}>
              Adaptive Agentic Context Engine. <span style={{ color: `hsl(${GREEN})` }}>Twelve subsystems. One synchronised loop.</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              {[
                "Intent-Lock State Machine",
                "JIT XML Context Compiler",
                "5-Category Typed Ontology",
                "5-Layer Context Stack",
                "SHA-256 Dedup + Jaccard Match",
                "Two-Pass Structural Extraction",
                "Semantic Bundle Matcher",
                "Gutter Diff + Sync Manifest",
                "Mandate Enforcement Gates",
                "Protocol Execution Engine",
                "Pre-Commit Impact Simulator",
                "Knowledge Graph Auditor",
              ].map((n, i) => (
                <div key={n} className="rounded-md border px-2.5 py-1.5 flex items-center gap-2" style={{ background: `hsl(${GREEN} / 0.04)`, borderColor: `hsl(${GREEN} / 0.3)` }}>
                  <span className="font-mono font-black" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-bold" style={{ fontSize: 12, color: TEXT, lineHeight: 1.15 }}>{n}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10.5, color: `hsl(${GREEN})` }}>
              → Next slide: each subsystem, exposed.
            </p>
          </div>
        </div>
      </div>
      <Footer text="Same surface. Different machine. The hood is open for the next 90 seconds." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ─── F_SHAPE · Architecture-shape contrast · pipe vs system ─────────────────
function FShapeContrast() {
  // Visual-first shapes with the detail tucked into each node.
  const ragSteps = [
    { name: "User prompt",       note: "free text, no intent type" },
    { name: "Embed",             note: "one vector, model-dependent" },
    { name: "Top-K vector search", note: "cosine over chunked docs" },
    { name: "Stuff into context", note: "string concatenation" },
    { name: "LLM call",          note: "model picks an answer" },
    { name: "Text output",       note: "no provenance, no replay" },
  ];
  const lizaPlanes = [
    { key: "INTENT",  icon: Crosshair,   parts: "Classifier · Playbook Registry · Session Lock",
      gist: "Every prompt is matched to a process. Session locks to that process until done." },
    { key: "COMPILE", icon: Layers,      parts: "Typed Graph · 5-Layer Stack · JIT XML Kernel · Snapshot",
      gist: "Context is assembled, not retrieved. Filtered by security, scope, priority, version." },
    { key: "GOVERN",  icon: ShieldCheck, parts: "Policy Engine · Mandate Gates · Impact Simulator",
      gist: "Every call passes a typed policy. Blocking mandates refuse before a token is spent." },
    { key: "EXECUTE", icon: Cpu,         parts: "Model Gateway · Prompt-by-Hash · Structured Output · Validator",
      gist: "Model pinned by version. Prompt fetched by hash. Output schema-validated, never free text." },
    { key: "AUDIT",   icon: Fingerprint, parts: "Signed Receipt · Append-Only Log · Provenance Graph · Replay",
      gist: "Every decision signed and chained. Replay reconstructs the exact answer two years later." },
  ];
  const compareRows = [
    { prop: "State",           rag: "Stateless",         liza: "Locked playbook, durable workflow" },
    { prop: "Types",           rag: "Free text in & out", liza: "Typed in, typed out, typed across" },
    { prop: "Governance",      rag: "None",              liza: "Policy + mandate gates per call" },
    { prop: "Audit",           rag: "Log line, maybe",   liza: "Signed receipt, hash-chained" },
    { prop: "Reproducibility", rag: "Not possible",      liza: "Byte-reproducible on snapshot" },
    { prop: "Loop",            rag: "Open, one-shot",    liza: "Closed, feedback into the graph" },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-20 pt-20 pb-16 flex flex-col">
        <Tag label="The Shape · Pipe vs System" color={ACCENT} />
        <h2 className="font-black mb-6" style={{ fontSize: 54, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em" }}>
          They feed a model.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>We run a system around it.</span>
        </h2>

        {/* Two shapes side by side — detail lives inside each node */}
        <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
          {/* LEFT · RAG pipe */}
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono font-black uppercase tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${RED})` }}>
                RAG · the pipe
              </span>
              <span className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11, color: SUBTLE }}>
                1 plane · open loop
              </span>
            </div>
            <div className="flex-1 flex flex-col" style={{ gap: 4 }}>
              {ragSteps.map((s, i) => (
                <React.Fragment key={s.name}>
                  <div
                    className="rounded-lg border flex items-center gap-3 px-4"
                    style={{
                      background: `hsl(${RED} / 0.04)`,
                      borderColor: `hsl(${RED} / 0.4)`,
                      minHeight: 50,
                    }}
                  >
                    <span className="font-mono font-black" style={{ fontSize: 12, color: `hsl(${RED})`, width: 22 }}>
                      0{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold" style={{ fontSize: 15, color: TEXT, lineHeight: 1.15 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.2 }}>{s.note}</div>
                    </div>
                  </div>
                  {i < ragSteps.length - 1 && (
                    <div className="flex justify-center"><ArrowDown size={12} style={{ color: `hsl(${RED} / 0.55)` }} /></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="mt-3 font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10, color: `hsl(${RED})` }}>
              Stateless · untyped · ungoverned · unsigned · unrepeatable
            </p>
          </div>

          {/* RIGHT · LIZA loop */}
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono font-black uppercase tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
                LIZA · the loop
              </span>
              <span className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 11, color: SUBTLE }}>
                5 planes · closed loop
              </span>
            </div>
            <div className="flex-1 flex" style={{ gap: 10 }}>
              <div className="flex-1 flex flex-col" style={{ gap: 6 }}>
                {lizaPlanes.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.key}
                      className="rounded-lg border-2 flex items-start gap-3 px-4 py-2 flex-1"
                      style={{
                        background: `hsl(${GREEN} / 0.05)`,
                        borderColor: `hsl(${GREEN} / 0.5)`,
                      }}
                    >
                      <Icon size={20} style={{ color: `hsl(${GREEN})`, flexShrink: 0, marginTop: 4 }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-mono font-black tracking-[0.18em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
                            {p.key}
                          </span>
                          <span className="font-mono" style={{ fontSize: 10.5, color: SUBTLE }}>{p.parts}</span>
                        </div>
                        <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.25 }}>{p.gist}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Feedback arrow back to top */}
              <svg width="46" preserveAspectRatio="none" viewBox="0 0 46 400" style={{ overflow: "visible", height: "100%" }}>
                <defs>
                  <marker id="arrowEnd2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill={`hsl(${ACCENT})`} />
                  </marker>
                </defs>
                <path
                  d="M 0,380 C 40,380 40,20 0,20"
                  fill="none"
                  stroke={`hsl(${ACCENT})`}
                  strokeWidth="2.5"
                  strokeDasharray="6 5"
                  markerEnd="url(#arrowEnd2)"
                />
                <text x="38" y="200" fontSize="11" fontFamily="ui-monospace, monospace" fill={`hsl(${ACCENT})`} textAnchor="middle" transform="rotate(90 38 200)" letterSpacing="2">
                  RECEIPTS FEED THE GRAPH
                </text>
              </svg>
            </div>
            <p className="mt-3 font-mono uppercase tracking-[0.14em]" style={{ fontSize: 10, color: `hsl(${GREEN})` }}>
              Stateful · typed · governed · signed · replayable
            </p>
          </div>
        </div>

        {/* Compact 6-row comparison */}
        <div className="mt-5 rounded-xl border overflow-hidden" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
          <div className="grid" style={{ gridTemplateColumns: "150px 1fr 1fr", background: `hsl(${ACCENT} / 0.05)` }}>
            <div className="px-4 py-2 font-mono uppercase tracking-[0.16em]" style={{ fontSize: 11, color: SUBTLE }}>Property</div>
            <div className="px-4 py-2 font-mono font-black uppercase tracking-[0.16em]" style={{ fontSize: 11, color: `hsl(${RED})` }}>RAG pipe</div>
            <div className="px-4 py-2 font-mono font-black uppercase tracking-[0.16em]" style={{ fontSize: 11, color: `hsl(${GREEN})` }}>LIZA system</div>
          </div>
          {compareRows.map((r, i) => (
            <div
              key={r.prop}
              className="grid border-t"
              style={{ gridTemplateColumns: "150px 1fr 1fr", borderColor: CHROME_BORDER, background: i % 2 === 1 ? `hsl(${ACCENT} / 0.02)` : "transparent" }}
            >
              <div className="px-4 py-2 font-mono uppercase tracking-[0.14em]" style={{ fontSize: 11, color: TEXT }}>{r.prop}</div>
              <div className="px-4 py-2" style={{ fontSize: 13, color: MUTED, lineHeight: 1.2 }}>{r.rag}</div>
              <div className="px-4 py-2 font-bold" style={{ fontSize: 13, color: TEXT, lineHeight: 1.2 }}>{r.liza}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Same chat surface. Different category of software." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ─── F_ENGINE · The 12 engineered subsystems, exposed ───────────────────────
function FEngineBay() {
  const parts = [
    { i: Crosshair,  name: "Intent-Lock State Machine",
      breaks: "Stateless chat drifts mid-task",
      what: "Pre-flight classifier matches the prompt against the Playbook Registry. On match, session enters Locked State (locked_playbook_id). The agent follows the playbook strictly until STOP / RESET." },
    { i: Layers,     name: "JIT XML Context Compiler",
      breaks: "Static system prompt for all",
      what: "Hundreds of items filtered by security clearance, domain match, priority. Assembled into a hierarchical XML kernel — <critical_directives>, <playbook_registry>, <knowledge_base>, <memory_index> — prepended just-in-time. Zero summarisation." },
    { i: Boxes,      name: "5-Category Typed Ontology",
      breaks: "Free-text knowledge soup",
      what: "DIRECTIVE · KNOWLEDGE · PROCEDURE · PLAYBOOK · PREFERENCE. Each carries an Action Logic (APPEND / OVERRIDE / BLOCK) and an Operation Mode risk tier. The category controls the XML container and the LLM behavioural instruction." },
    { i: Network,    name: "5-Layer Context Stack",
      breaks: "Flat blob, no scope",
      what: "Org → Domain → Workbook → Active Chat → User Preference. Resolved top-down with OVERRIDE / BLOCK arbitration. The Context Stack Viewer shows every item, origin, version, and shadow state inline." },
    { i: Fingerprint, name: "Content-Hash Dedup",
      breaks: "Same doc imported six times",
      what: "Postgres trigger computes SHA-256(title || content) on every write. Composite (owner_id, content_hash) index makes exact dedup O(1). Jaccard runs a second pass for near-duplicates with merge / replace / keep resolution." },
    { i: Radar,      name: "Two-Pass Structural Extraction",
      breaks: "Chunk-and-embed shallow read",
      what: "Pass 1: a Structure Analyst maps the document skeleton — TOC, phases, hierarchy, density per section. Pass 2: an Advisor Persona generated from metadata biases category precision. 7-rule decision tree, coverage gap analysis, completeness scoring." },
    { i: GitCompare, name: "Semantic Bundle Matcher",
      breaks: "Every import = orphan pile",
      what: "match-bundles scores new bundles against the existing graph on four dimensions: title, description, item content, phase identity. Exact ≥0.9 auto-merges, likely 0.7–0.89 prompts, possible 0.5–0.69 surfaces. Cross-bundle consolidation runs first." },
    { i: GitMerge,   name: "Gutter Diff + Sync Manifest",
      breaks: "Edit + paste, no propagation",
      what: "Canonical doc edits render a live line-by-line gutter diff against the baseline. sync-document-to-playbooks emits a typed SyncOperation manifest (create / update / delete with prev/next). User cherry-picks. document_sync_logs records every event." },
    { i: ShieldCheck, name: "Mandate Enforcement Gates",
      breaks: "Rules in the prompt, maybe followed",
      what: "Directives elevate to mandates with three enforcement tiers. Advisory: soft inject. Required-ACK: pinned, workbook cannot complete without acknowledgment row. Blocking: agent refuses, status transitions blocked, violations escalate." },
    { i: Workflow,   name: "Protocol Execution Engine",
      breaks: "Chat 'suggests next steps'",
      what: "Bundles compile to workbook_protocols. Procedures become ordered action steps; directives become gate steps with enforcement levels. Every execution writes step_executions rows with drift_score and compliance_score (0–1). Queryable for oversight." },
    { i: Filter,     name: "Pre-Commit Impact Simulator",
      breaks: "Silent breakage downstream",
      what: "Before any item change ships: blast-radius preview — workbooks affected, sessions actively locked, distinct users impacted. Soft-Push (shields active locks) vs Broadcast (force, destructive-confirm). The Andon cord, with telemetry." },
    { i: Binary,     name: "Knowledge Graph Auditor",
      breaks: "Graph quality decays silently",
      what: "Background agent runs an 8-pattern audit over the corpus: recategorize · enrich · split · merge (with merge_with_id) · promote_mandate · archive. Detects BANT-as-PLAYBOOK, orphan PROCEDUREs, missing step_order_hint. The graph cleans itself." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-20 pt-20 pb-16 flex flex-col">
        <Tag label="The Engine Bay · AACE v3.1, exposed" color={GREEN} />
        <h2 className="font-black mb-2" style={{ fontSize: 48, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Twelve engineered subsystems.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Each one is a thing the market does not have.</span>
        </h2>
        <p className="mb-4" style={{ fontSize: 15.5, color: MUTED, maxWidth: 1400, lineHeight: 1.4 }}>
          Adaptive Agentic Context Engine, version 3.1. Specification: 1,200 lines. Implementation: live in this app and the smartphone client. This is not a roadmap. This is the runtime today. Every panel below names a real component, what it breaks, and how it works.
        </p>

        <div className="grid grid-cols-4 gap-2.5 flex-1">
          {parts.map((p, i) => {
            const Icon = p.i;
            return (
              <div key={p.name} className="rounded-xl border-2 p-3 flex flex-col" style={{ background: `hsl(${GREEN} / 0.04)`, borderColor: `hsl(${GREEN} / 0.32)` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black" style={{ fontSize: 12, color: `hsl(${GREEN})` }}>L{String(i + 1).padStart(2, "0")}</span>
                  <Icon size={16} style={{ color: `hsl(${GREEN})` }} />
                </div>
                <p className="font-bold mb-1.5" style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.18 }}>{p.name}</p>
                <p className="font-mono uppercase tracking-[0.1em] mb-1.5" style={{ fontSize: 8.5, color: `hsl(${RED})` }}>Breaks: {p.breaks}</p>
                <p style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.35 }}>{p.what}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 px-6 py-3 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${ACCENT} / 0.06)`, borderColor: `hsl(${ACCENT})` }}>
          <Cog size={20} style={{ color: `hsl(${ACCENT})` }} />
          <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-black">The Ferrari piece.</span> Twelve subsystems, one synchronised loop, all running on every call. The Trabant ships you a chat. We ship you a factory floor with its own nervous system.
          </p>
        </div>
      </div>
      <Footer text="AACE v3.1 · State-Locked & Full-Context · spec live, runtime shipping, app and mobile." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── F_AUDITRECEIPTS · Auditable compliance capabilities, in detail ─────────
function FAuditReceipts() {
  const capabilities = [
    { icon: Fingerprint, name: "Signed call records",
      detail: "Every model call writes an immutable record: who triggered it, which standard fired, which graph nodes were compiled in, the prompt hash, the model+version, the response, the cost. SHA-256 chained, append-only." },
    { icon: Hash, name: "Standards as content-addressed code",
      detail: "Each policy, playbook, and rule has a versioned ID and a content hash. Diff, rollback, blame, pull request. The exact rule that fired on Tuesday at 14:03 is reproducible byte-for-byte." },
    { icon: FileCheck2, name: "Regression evidence on every change",
      detail: "Standards ship with test cases. A diff triggers replay across every dependent use case. The deploy record stores the eval delta — pass, fail, drift — before the change is allowed to ship." },
    { icon: Eye, name: "Provenance graph per output",
      detail: "Click any AI answer. See the standards stack, the source nodes, the operator who approved them, the timestamp they were last verified. No black box. No 'the model said so.'" },
    { icon: Lock, name: "Role-scoped context boundaries",
      detail: "The compiler enforces who can read what at assembly time, not at the UI. PII, MNPI, GxP-controlled, customer-confidential — each tagged, each filtered before the token leaves the perimeter." },
    { icon: ScrollText, name: "One-click evidence pack",
      detail: "Auditor asks for the last 90 days of decisions on Standard #4471. Export a signed bundle: every call, every input, every output, every approver, hash-verified. Hours, not weeks." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag label="Audit-Grade Receipts · The Compliance Substrate" color={PURPLE} />
        <h2 className="font-black mb-3" style={{ fontSize: 52, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Every AI decision is a <span style={{ color: `hsl(${PURPLE})` }}>signed, reproducible, regulator-ready record.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 17, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          Most stacks log a prompt and a response. We log the entire causal chain: the operator, the outcome, the standards stack at version, the compiled context nodes, the model build, the output, the cost, the approver. Chained hashes. Append-only. Built into the runtime — not bolted on by Confluence.
        </p>

        {/* Sample receipt mock */}
        <div className="mb-5 rounded-xl border p-4 font-mono" style={{ background: `hsl(${PURPLE} / 0.04)`, borderColor: `hsl(${PURPLE} / 0.35)`, fontSize: 12, color: TEXT, lineHeight: 1.55 }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${PURPLE})` }}>
            <Database size={14} /> <span className="font-bold tracking-[0.12em] uppercase" style={{ fontSize: 10 }}>Receipt · liza://call/2a9f…b71c</span>
          </div>
          <div style={{ color: MUTED }}>
            <span style={{ color: `hsl(${ACCENT})` }}>operator</span>: a.morales@client &nbsp;·&nbsp;
            <span style={{ color: `hsl(${ACCENT})` }}>outcome</span>: pricing.quote.enterprise &nbsp;·&nbsp;
            <span style={{ color: `hsl(${ACCENT})` }}>standards</span>: [STD-4471@v17, STD-1208@v04, STD-0099@v31] &nbsp;·&nbsp;
            <span style={{ color: `hsl(${ACCENT})` }}>context_nodes</span>: 14 &nbsp;·&nbsp;
            <span style={{ color: `hsl(${ACCENT})` }}>model</span>: claude-sonnet-4.5@2026-04-12 &nbsp;·&nbsp;
            <span style={{ color: `hsl(${ACCENT})` }}>prompt_hash</span>: 7f2c…91ae &nbsp;·&nbsp;
            <span style={{ color: `hsl(${ACCENT})` }}>parent_hash</span>: 4d18…02ff &nbsp;·&nbsp;
            <span style={{ color: `hsl(${GREEN})` }}>signed</span>: ed25519:b0c4…
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 flex-1">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.name} className="rounded-xl border p-4 flex flex-col" style={{ background: `hsl(${PURPLE} / 0.04)`, borderColor: `hsl(${PURPLE} / 0.3)` }}>
                <Icon size={20} style={{ color: `hsl(${PURPLE})` }} />
                <p className="font-bold mt-2 mb-2" style={{ fontSize: 16, color: TEXT, lineHeight: 1.2 }}>{c.name}</p>
                <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>{c.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer text="Append-only chained receipts · content-addressed standards · regression evidence · provenance graph · role-scoped compile · one-click evidence pack." />
      <SlideBar from={PURPLE} to={ACCENT} />
    </div>
  );
}

// ─── F_COMPLIANCEMAP · Maps to every regulator ───────────────────────────────
function FComplianceMap() {
  const frameworks = [
    { name: "EU AI Act", scope: "High-risk AI systems · Art. 12, 13, 14",
      reqs: ["Automatic logging of operation", "Traceability of outputs", "Human oversight at decision point", "Technical documentation on demand"],
      maps: "Signed receipts + provenance graph + standards@version + evidence pack." },
    { name: "SOC 2 Type II", scope: "CC7 · CC8 · Change management",
      reqs: ["Change traceability", "Authorized approvals", "Logging & monitoring", "Access boundaries"],
      maps: "Standards-as-code PRs + role-scoped context + immutable call log + replay-on-deploy." },
    { name: "GDPR / DSGVO", scope: "Art. 22, 30, 32",
      reqs: ["No purely automated decisions without trace", "Records of processing", "Data minimisation"],
      maps: "Receipt = record of processing. Compiler only assembles in-scope nodes. Operator-in-loop is structural." },
    { name: "HIPAA / GxP / MiFID II", scope: "PHI · Computer-system validation · Investment advice trail",
      reqs: ["Audit trail per access", "Validated state of system", "Reproducible advice"],
      maps: "Per-call receipts with hash-chained inputs. Standard versions pinned. Reproducible by replay." },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag label="Maps to Every Regulator · One Substrate, Many Frameworks" color={GOLD} />
        <h2 className="font-black mb-3" style={{ fontSize: 52, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          The receipts are the compliance work. <span style={{ color: `hsl(${GOLD})` }}>The framework is the formatter.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 17, color: MUTED, maxWidth: 1380, lineHeight: 1.4 }}>
          Most teams treat each regulation as a separate project — a new policy doc, a new audit binder, a new tool. We treat them as queries against the same substrate. Build the receipts once. Generate the binder per framework. The same call log answers the EU AI Act, SOC 2, GDPR, HIPAA, and GxP auditor — formatted to their template.
        </p>
        <div className="grid grid-cols-2 gap-4 flex-1">
          {frameworks.map((f) => (
            <div key={f.name} className="rounded-xl border p-5 flex flex-col" style={{ background: `hsl(${GOLD} / 0.04)`, borderColor: `hsl(${GOLD} / 0.35)` }}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-black" style={{ fontSize: 22, color: TEXT, letterSpacing: "-0.02em" }}>{f.name}</p>
                <Scale size={18} style={{ color: `hsl(${GOLD})` }} />
              </div>
              <p className="font-mono uppercase tracking-[0.1em] mb-3" style={{ fontSize: 10, color: `hsl(${GOLD})` }}>{f.scope}</p>
              <div className="flex gap-4 flex-1">
                <div className="flex-1">
                  <p className="font-bold mb-1" style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Requires</p>
                  <ul className="space-y-1">
                    {f.reqs.map((r) => (
                      <li key={r} className="flex gap-1.5" style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.35 }}>
                        <CheckCircle2 size={12} style={{ color: `hsl(${GREEN})`, flexShrink: 0, marginTop: 3 }} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t" style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4, borderColor: `hsl(${GOLD} / 0.25)` }}>
                <span className="font-bold" style={{ color: `hsl(${ACCENT})` }}>LIZA delivers: </span>{f.maps}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 px-7 py-4 rounded-xl border-l-4 flex items-center gap-4" style={{ background: `hsl(${ACCENT} / 0.06)`, borderColor: `hsl(${ACCENT})` }}>
          <ShieldCheck size={22} style={{ color: `hsl(${ACCENT})` }} />
          <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.45 }}>
            <span className="font-black">Buy seats, get a chat. Buy LIZA, get the audit trail.</span> The same substrate that makes AI accurate is the substrate that makes it defensible.
          </p>
        </div>
      </div>
      <Footer text="EU AI Act · SOC 2 · GDPR · HIPAA · GxP · MiFID II — one receipt log, every binder." />
      <SlideBar from={GOLD} to={PURPLE} />
    </div>
  );
}

// ─── F_ATOM · The smallest unit of an AI-native org ─────────────────────────
function FAtom() {
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
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute inset-0 px-20 pt-20 pb-16 flex flex-col">
        <div className="mb-5">
          <Tag color={GOLD} label="The atom · the Block" />
          <h2 className="font-black mt-4" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1640 }}>
            Every AI org has a smallest unit. Most picked something the org cannot govern. We picked the Block.
          </h2>
          <p className="mt-3" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
            A Block is the smallest typed, owner-signed unit of how your org thinks: one Directive, Knowledge item, Procedure, or Preference. Blocks compose into Playbooks. The factory compiles them into every AI moment of work, just in time, with a receipt.
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
          <span className="font-mono uppercase tracking-[0.26em] shrink-0" style={{ fontSize: 12, color: SUBTLE }}>The factory point</span>
          <p className="font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.25, letterSpacing: "-0.014em" }}>
            Chunks recall. Pages reference. Prompts instruct. A Block governs and proves it ran. The factory is built around the atom — that is why the loop is real, and why Playbooks compound into Org-as-Code.
          </p>
        </div>
      </div>
      <Footer text="The Block · the smallest governable unit of an AI-native organization. Blocks compose Playbooks. Playbooks compose Org-as-Code." />
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// THESIS FOLD · "Organization as Code" 6-slide arc
// Folded into the spine (not appended). Replaces category / aace-not-rag /
// engine-bay / unit-economics, and inserts auto-repair + moat.
// ═════════════════════════════════════════════════════════════════════════════

// ─── F_THESIS · The infrastructure layer for the agentic workforce ───────────
export function FThesis() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag color={ACCENT} label="Thesis · The category we are building" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 76, lineHeight: 1.02, color: TEXT, letterSpacing: "-0.04em", maxWidth: 1700 }}>
          The AI assistant era is ending.<br/>
          <span style={{ color: `hsl(${ACCENT})` }}>The agentic enterprise needs an OS.</span>
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { k: "What everyone is shipping", v: "Better chat. Better agents. Better demos.", tone: "muted" as const, icon: Sparkles },
            { k: "What enterprises need", v: "A substrate that makes any agent governed and compliant.", tone: "win" as const, icon: Cpu },
            { k: "What we are building", v: "LIZA OS. The infrastructure for the agentic workforce.", tone: "win" as const, icon: Layers },
          ].map((c) => {
            const Icon = c.icon;
            const win = c.tone === "win";
            return (
              <div key={c.k} className="rounded-2xl p-7 flex flex-col"
                style={{ background: win ? `hsl(${ACCENT} / 0.06)` : CARD_ALT, border: `1px solid ${win ? `hsl(${ACCENT} / 0.4)` : CHROME_BORDER}` }}>
                <Icon size={28} style={{ color: win ? `hsl(${ACCENT})` : SUBTLE }} />
                <p className="font-mono uppercase tracking-[0.18em] mt-4 mb-3" style={{ fontSize: 13, color: win ? `hsl(${ACCENT})` : SUBTLE }}>{c.k}</p>
                <p className="font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{c.v}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-auto rounded-xl px-9 py-7 border-l-4 flex items-center gap-6" style={{ background: `hsl(${ACCENT} / 0.06)`, borderColor: `hsl(${ACCENT})` }}>
          <Workflow size={32} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 26, color: TEXT, lineHeight: 1.35 }}>
            <span className="font-black">We are not building another AI agent.</span> We are building the OS that turns any model into a governed, auditable member of your workforce.
          </p>
        </div>
      </div>
      <Footer text="The agentic enterprise is the next platform shift. LIZA OS is its execution substrate." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F_ORG_AS_CODE · Terraform for organizations (Legacy AI vs LIZA) ─────────
export function FOrgAsCode() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag color={GREEN} label="Organization as Code · Terraform for orgs" />
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 68, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1700 }}>
          Plain-English strategy in.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>Executable logic gates out.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Legacy */}
          <div className="rounded-2xl p-8 flex flex-col" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-black" style={{ fontSize: 36, color: TEXT, letterSpacing: "-0.025em" }}>Legacy AI</p>
              <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${RED})` }}>RAG + prompting</span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { i: FileText, t: "Unstructured PDFs, slides, wiki pages" },
                { i: Filter,   t: "Vector similarity. No governance." },
                { i: Megaphone,t: "Open chat. No owner, no policy." },
                { i: Ban,      t: "Hallucinations and silent non-compliance." },
              ].map((r) => {
                const Icon = r.i;
                return (
                  <div key={r.t} className="flex items-start gap-4 rounded-lg px-4 py-3.5" style={{ background: `hsl(0 0% 0% / 0.03)` }}>
                    <Icon size={22} style={{ color: `hsl(${RED})`, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 21, color: TEXT, lineHeight: 1.3 }}>{r.t}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 pt-4 border-t font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 15, color: `hsl(${RED})`, borderColor: CHROME_BORDER }}>
              Documents in. Guesses out.
            </p>
          </div>

          {/* LIZA */}
          <div className="rounded-2xl p-8 flex flex-col" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.45)` }}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-black" style={{ fontSize: 36, color: `hsl(${GREEN})`, letterSpacing: "-0.025em" }}>LIZA OS</p>
              <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Organization as Code</span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { i: Network,     t: "Typed graph of Vision, Bets, Teams, Roles." },
                { i: Binary,      t: "AACE compiles narrative into typed Playbooks." },
                { i: Workflow,    t: "Runtime enforces owners and budgets at the call site." },
                { i: CheckCircle2,t: "Deterministic, signed, regulator-ready receipts." },
              ].map((r) => {
                const Icon = r.i;
                return (
                  <div key={r.t} className="flex items-start gap-4 rounded-lg px-4 py-3.5" style={{ background: `hsl(${GREEN} / 0.08)` }}>
                    <Icon size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 21, color: TEXT, lineHeight: 1.3 }}>{r.t}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 pt-4 border-t font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 15, color: `hsl(${GREEN})`, borderColor: `hsl(${GREEN} / 0.3)` }}>
              Policy in. Auditable decisions out.
            </p>
          </div>
        </div>
      </div>
      <Footer text="Corporate policy becomes executable code. Every AI call is a compiled, governed function." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── F_VSM_ARCHITECTURE · Brain / Spine / Sensors ────────────────────────────
export function FVsmArchitecture() {
  const layers = [
    {
      role: "Brain",
      name: "Knowledge Graph & LVT",
      desc: "The org's reality, machine-readable. Vision, Bets, Teams, Roles, Domains.",
      hl: ACCENT,
      icon: Cpu,
      payload: ["VISION → BET → INITIATIVE", "TEAM → ROLE → DOMAIN", "Authority and budget edges"],
    },
    {
      role: "Spine",
      name: "AACE v3.1 Runtime",
      desc: "Compiler and execution gate. Every AI call passes through here.",
      hl: GREEN,
      icon: Workflow,
      payload: ["[PLAYBOOK] compilation", "<precondition> evaluation", "Role-scoped, JIT context"],
    },
    {
      role: "Sensors",
      name: "Edge Execution Loop",
      desc: "Where work happens. Errors flow back as [FINDINGS] into the graph.",
      hl: GOLD,
      icon: Radar,
      payload: ["Live agent calls", "[FINDINGS] back to brain", "Continuous feedback signal"],
    },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag color={ACCENT} label="Architecture · A Viable System Model for the agentic enterprise" />
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 68, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1700 }}>
          The whole organization is one <span style={{ color: `hsl(${ACCENT})` }}>nervous system.</span><br/>
          Brain. Spine. Sensors.
        </h2>

        <div className="grid grid-cols-3 gap-6 flex-1">
          {layers.map((l, idx) => {
            const Icon = l.icon;
            return (
              <div key={l.role} className="rounded-2xl p-7 flex flex-col relative" style={{ background: `hsl(${l.hl} / 0.05)`, border: `1px solid hsl(${l.hl} / 0.4)` }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono uppercase tracking-[0.24em]" style={{ fontSize: 13, color: `hsl(${l.hl})` }}>Layer {idx + 1} · {l.role}</span>
                  <Icon size={28} style={{ color: `hsl(${l.hl})` }} />
                </div>
                <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT, letterSpacing: "-0.025em", lineHeight: 1.1 }}>{l.name}</p>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>{l.desc}</p>
                <div className="mt-5 pt-4 border-t flex flex-col gap-2" style={{ borderColor: `hsl(${l.hl} / 0.25)` }}>
                  {l.payload.map((p) => (
                    <p key={p} className="font-mono" style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>· {p}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-5">
          <div className="rounded-xl px-6 py-5 flex items-start gap-4" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
            <Lock size={26} style={{ color: `hsl(${ACCENT})`, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }}>
              <span className="font-black">Dynamic Sandboxing.</span> Security is graph relationships, not jailbreakable if-statements.
            </p>
          </div>
          <div className="rounded-xl px-6 py-5 flex items-start gap-4" style={{ background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
            <Filter size={26} style={{ color: `hsl(${GREEN})`, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }}>
              <span className="font-black">Progressive Disclosure.</span> Agents pull context only when the Procedure demands. Token cost down, hallucinations down.
            </p>
          </div>
        </div>
      </div>
      <Footer text="Brain reasons. Spine compiles and gates. Sensors feed back. The graph is the substrate." />
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ─── F_TOKENOMICS · CFO-grade FinOps · cost-per-decision ─────────────────────
export function FTokenomics() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag color={GOLD} label="Tokenomics by design · the CFO finally sees the bill" />
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 66, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1700 }}>
          AI stops being opaque OpEx.<br/>
          <span style={{ color: `hsl(${GOLD})` }}>Every decision has a price, an owner, a budget.</span>
        </h2>

        {/* Top: three pillars */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { icon: Gauge, k: "Design-time budgeting",
              v: "Projected token cost of a Playbook is shown before deploy." },
            { icon: Scale, k: "Distributed governance",
              v: "CFO sets budgets. Each Domain gets a quota. Runtime auto-enforces." },
            { icon: Hash, k: "Chargeback per decision",
              v: "Every [DECISION] is a graph node with cost attached. Line-item chargeback." },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.k} className="rounded-2xl p-6 flex flex-col" style={{ background: `hsl(${GOLD} / 0.05)`, border: `1px solid hsl(${GOLD} / 0.35)` }}>
                <Icon size={26} style={{ color: `hsl(${GOLD})` }} />
                <p className="font-mono uppercase tracking-[0.18em] mt-3 mb-2 font-bold" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>{c.k}</p>
                <p style={{ fontSize: 20, color: TEXT, lineHeight: 1.35 }}>{c.v}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom: dashboard mock */}
        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
          <div className="rounded-2xl p-5 flex flex-col" style={{ background: `hsl(${ACCENT} / 0.04)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.2em] mb-3 font-bold" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>AI budget allocation · Q4</p>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-black" style={{ fontSize: 52, color: TEXT, letterSpacing: "-0.03em" }}>$10,000</span>
              <span className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: 13, color: MUTED }}>compute envelope</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { d: "DOMAIN: Sales",       a: "$4,000", pct: 40, used: 28 },
                { d: "DOMAIN: Operations",  a: "$3,000", pct: 30, used: 19 },
                { d: "DOMAIN: Legal",       a: "$2,000", pct: 20, used: 11 },
                { d: "DOMAIN: Marketing",   a: "$1,000", pct: 10, used: 6  },
              ].map((b) => (
                <div key={b.d}>
                  <div className="flex justify-between mb-1.5" style={{ fontSize: 16, color: TEXT }}>
                    <span className="font-mono">{b.d}</span>
                    <span className="font-mono"><span style={{ color: MUTED }}>{b.used}% used · </span>{b.a}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `hsl(${ACCENT} / 0.12)` }}>
                    <div style={{ width: `${b.used}%`, height: "100%", background: `hsl(${ACCENT})` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 flex flex-col" style={{ background: `hsl(${GREEN} / 0.04)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
            <p className="font-mono uppercase tracking-[0.2em] mb-3 font-bold" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Chargeback ledger · per-decision</p>
            <div className="flex flex-col gap-2.5 font-mono" style={{ fontSize: 15, color: TEXT, lineHeight: 1.45 }}>
              <div className="rounded-lg px-4 py-3" style={{ background: `hsl(${GREEN} / 0.06)` }}>
                <div className="flex justify-between"><span style={{ color: `hsl(${GREEN})` }}>DECISION #A43F1</span><span className="font-black">$0.07</span></div>
                <div style={{ color: MUTED }}>deal_qualification · 1.2M tokens · sales/q4-pipeline</div>
              </div>
              <div className="rounded-lg px-4 py-3" style={{ background: `hsl(${GREEN} / 0.06)` }}>
                <div className="flex justify-between"><span style={{ color: `hsl(${GREEN})` }}>DECISION #A43F2</span><span className="font-black">$0.41</span></div>
                <div style={{ color: MUTED }}>contract_review · 6.8M tokens · legal/master-template</div>
              </div>
              <div className="rounded-lg px-4 py-3" style={{ background: `hsl(${GREEN} / 0.06)` }}>
                <div className="flex justify-between"><span style={{ color: `hsl(${GREEN})` }}>INITIATIVE: Q4 Launch</span><span className="font-black">$1,452.19</span></div>
                <div style={{ color: MUTED }}>3,841 decisions · rolled-up · owner: VP Marketing</div>
              </div>
              <div className="rounded-lg px-4 py-3" style={{ background: `hsl(${GREEN} / 0.06)` }}>
                <div className="flex justify-between"><span style={{ color: `hsl(${GREEN})` }}>TEAM: Sales · auto-qual</span><span className="font-black">$798.20</span></div>
                <div style={{ color: MUTED }}>11,400 qualification decisions · Q4 to date</div>
              </div>
            </div>
            <p className="mt-4 pt-3 border-t" style={{ fontSize: 16, color: MUTED, lineHeight: 1.4, borderColor: `hsl(${GREEN} / 0.25)` }}>
              Platform unit economics: <span className="font-black" style={{ color: TEXT }}>$0.40</span> per governed decision · <span className="font-black" style={{ color: TEXT }}>95%</span> platform GM · <span className="font-black" style={{ color: TEXT }}>€23</span> displaced labour cost per decision.
            </p>
          </div>
        </div>
      </div>
      <Footer text="From opaque OpEx to fully auditable, project-based capital allocation. AI spend becomes legible." />
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ─── F_AUTO_REPAIR · Metacognitive auto-repair (Ghost Protocol) ──────────────
export function FAutoRepair() {
  const steps = [
    { i: AlertTriangle, k: "Edge detects failure",        v: "Sensory layer clusters errors. \"Sales playbook now has a 15% error rate. CRM API changed.\"", hl: RED },
    { i: GitBranch,     k: "[FINDINGS] enter the graph",  v: "Failure cluster becomes a typed node. Linked to the affected Playbook, Initiative, and Owner.", hl: GOLD },
    { i: Sparkles,      k: "Ghost Protocol wakes",        v: "An agent loads its own system Playbook to analyze its own failing code. Reads the failure context.", hl: ACCENT },
    { i: Wrench,        k: "Structural fix proposed",     v: "Generates a <repair_strategy> block to handle the new edge case. Writes it as a typed patch.", hl: ACCENT },
    { i: GitMerge,      k: "Human approves in one click", v: "Pushed as a pull request to the owning manager. Single approval merges into the live Playbook.", hl: GREEN },
    { i: CheckCircle2,  k: "Playbook self-heals",         v: "Error rate drops. New rule is now versioned, signed, auditable. The system has learned, not crashed.", hl: GREEN },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag color={ACCENT} label="Metacognitive auto-repair · Double-loop learning, in production" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1620 }}>
          Writing this executable code by hand is hard. <span style={{ color: `hsl(${ACCENT})` }}>So the system writes it for itself.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.4 }}>
          Terraform for infrastructure is static. Organization-as-Code is a living, autonomic system. When a Playbook starts failing, LIZA does not file a bug. It clusters the failure as a [FINDING], wakes the Ghost Protocol, drafts a structural fix, and ships a one-click pull request to the human owner.
        </p>

        <div className="grid grid-cols-3 gap-4 flex-1">
          {steps.map((s, idx) => {
            const Icon = s.i;
            return (
              <div key={s.k} className="rounded-2xl p-5 flex flex-col" style={{ background: `hsl(${s.hl} / 0.05)`, border: `1px solid hsl(${s.hl} / 0.35)` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: 10, color: `hsl(${s.hl})` }}>Step {idx + 1}</span>
                  <Icon size={20} style={{ color: `hsl(${s.hl})` }} />
                </div>
                <p className="font-black mb-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.2, letterSpacing: "-0.015em" }}>{s.k}</p>
                <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.4 }}>{s.v}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl px-7 py-5 border-l-4 flex items-center gap-5" style={{ background: `hsl(${ACCENT} / 0.06)`, borderColor: `hsl(${ACCENT})` }}>
          <GitMerge size={24} style={{ color: `hsl(${ACCENT})` }} />
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-black">The code fixes the code.</span> Every customer's failures train every customer's repair agent. The system gets smarter about its own technical debt without our engineers in the loop.
          </p>
        </div>
      </div>
      <Footer text="Ghost Protocol · the system reads its own failing logic and proposes a typed structural fix." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F_MOAT · Why we win ─────────────────────────────────────────────────────
export function FMoat() {
  const pillars = [
    {
      icon: Ban,
      headline: "LLM Agnostic",
      subhead: "Zero Big Tech lock-in",
      body: "We own the organizational logic and the Context Compiler. AACE routes parsing to a cheap local model and routes legal analysis to the frontier. Models swap. The org's code does not.",
      hl: ACCENT,
    },
    {
      icon: ShieldCheck,
      headline: "Compliance as native infrastructure",
      subhead: "EU AI Act ready on day one",
      body: "Every action flows through the AACE graph. The result is a mathematically perfect, immutable audit trail for every agentic decision. Compliance is a query against the substrate, not a separate project.",
      hl: GOLD,
    },
    {
      icon: Coins,
      headline: "Compound margins through metacognition",
      subhead: "The OS handles its own technical debt",
      body: "Because the system autonomously repairs its own operational logic, we will not need an army of forward-deployed engineers to support customer workflows. Margins compound as the install base grows.",
      hl: GREEN,
    },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-24 pt-24 pb-20 flex flex-col">
        <Tag color={GREEN} label="The moat · Why we win this market" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.035em", maxWidth: 1620 }}>
          We are not building a better model. <span style={{ color: `hsl(${GREEN})` }}>We are building the substrate that commoditizes every model.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 19, color: MUTED, maxWidth: 1500, lineHeight: 1.4 }}>
          Three structural moats compound the longer we run: vendor independence, compliance-as-substrate, and self-repair economics. None of them depend on a model release.
        </p>

        <div className="grid grid-cols-3 gap-5 flex-1">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.headline} className="rounded-2xl p-6 flex flex-col" style={{ background: `hsl(${p.hl} / 0.06)`, border: `1px solid hsl(${p.hl} / 0.4)` }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: `hsl(${p.hl} / 0.15)`, border: `1px solid hsl(${p.hl} / 0.4)` }}>
                  <Icon size={26} style={{ color: `hsl(${p.hl})` }} />
                </div>
                <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 11, color: `hsl(${p.hl})` }}>{p.subhead}</p>
                <p className="font-black mb-3" style={{ fontSize: 26, color: TEXT, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{p.headline}</p>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>{p.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl px-7 py-5 border-l-4 flex items-center gap-5" style={{ background: `hsl(${GREEN} / 0.07)`, borderColor: `hsl(${GREEN})` }}>
          <Layers size={24} style={{ color: `hsl(${GREEN})` }} />
          <p style={{ fontSize: 19, color: TEXT, lineHeight: 1.4 }}>
            <span className="font-black">This is not a productivity app.</span> It is a new category of enterprise software: an instruction-set architecture for human-agent collaboration.
          </p>
        </div>
      </div>
      <Footer text="LLM-agnostic. Compliance-native. Self-repairing. Three structural moats, all independent of the next model release." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

const RAW_SLIDES = [
  // ACT I — Arrowhead: workshop → production system (skip Ford)
  { id: "cover",            title: "Cover · Your workshop becomes a production system", component: <F01Cover /> },
  { id: "thesis",           title: "Thesis · The Infrastructure Layer for the Agentic Workforce", component: <FThesis /> },
  { id: "workshop",         title: "The Workshop You Already Run · Artisan portraits", component: <FWorkshop /> },
  { id: "disposable",       title: "Disposable Expertise · Every session dies",         component: <FDisposable /> },
  { id: "atom",             title: "The Atom · The Block is the smallest unit of an AI-native org", component: <FAtom /> },
  { id: "four-eras",        title: "Four Eras of Production · The aha",                 component: <FThreeStages /> },
  { id: "skip-middle",      title: "Why We Skip the Middle · Ford vs Toyota",           component: <FSkipMiddle /> },
  // ACT I.5 — The wall and the substrate that breaks it
  { id: "why-hard",          title: "The Wall · Why Era IV Is Not Already Built",        component: <FWhyHard /> },
  { id: "how-we-break",      title: "The Stack · How LIZA Breaks the Wall",              component: <FHowWeBreak /> },

  { id: "open-the-hood",     title: "Open the Hood · Trabant vs Ferrari",                component: <FOpenTheHood /> },
  { id: "shape-contrast",    title: "The Shape · Pipe vs System",                        component: <FShapeContrast /> },
  { id: "vsm-architecture",  title: "Architecture · The Agentic Nervous System (Brain · Spine · Sensors)", component: <FVsmArchitecture /> },
  // ACT II — Pillars holding it up (push/pull demoted from arrowhead)
  { id: "pillar-pull",       title: "Pillar 1 · Pull, Not Push",                        component: <FPillarPull /> },
  { id: "pillar-stations",   title: "Pillar 2 · Standards as Stations",                 component: <FPillarStations /> },
  { id: "pillar-governance", title: "Pillar 3 · Governance Loop · Stop the Line",       component: <S03GovernanceLoop /> },
  { id: "audit-receipts",    title: "Audit-Grade Receipts · The Compliance Substrate", component: <FAuditReceipts /> },
  { id: "compliance-map",    title: "Maps to Every Regulator · EU AI Act, SOC2, HIPAA, GxP", component: <FComplianceMap /> },
  { id: "pillar-compile",    title: "Pillar 4 · Every Prompt Is a Compile",             component: <S07cFunnel /> },
  // ACT III — Proof
  { id: "artisanal-tax",     title: "The Artisanal Tax · €550K → $2.6B",                component: <FArtisanalTax /> },
  { id: "org-as-code",       title: "Organization as Code · Terraform for Organizations", component: <FOrgAsCode /> },
  { id: "auto-repair",       title: "Metacognitive Auto-Repair · The Code Fixes the Code", component: <FAutoRepair /> },
  { id: "org-loop",          title: "Every Commit Compounds · The Network",             component: <S07dOrgLoop /> },
  { id: "moat",              title: "The Moat · Why We Win",                            component: <FMoat /> },
  // ACT IV — Path & ask
  { id: "install",           title: "30-Day Install · Metered from Day 31",             component: <F13Install /> },
  { id: "vertical",          title: "Hero Vertical · AEC · Pattern Repeats",            component: <F14Vertical /> },
  { id: "tokenomics",        title: "Tokenomics by Design · Cost-Per-Decision FinOps",  component: <FTokenomics /> },
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
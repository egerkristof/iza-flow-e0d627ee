import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, Compass, Sparkles, Workflow,
  ArrowRight, ArrowLeft, Play, Pause, Bot, Search,
  CheckCircle2, TrendingDown, Users, FileText, Activity,
  Briefcase, Scale, Headphones, Cog, UserCheck, Wallet, Globe, Newspaper, AlertCircle, Link2, Plug,
} from "lucide-react";

/* Mobile-only auto-playing "Stories" video of the Liza architecture.
   6 scenes, ~4.5s each. Tap right/left half to skip. Tap-and-hold to pause. */

const PRIMARY = "hsl(var(--primary))";
const MUTED = "hsl(var(--muted-foreground))";
const RED = "hsl(0 70% 55%)";

type Scene = {
  kicker: string;
  headline: string;
  duration: number; // ms
  render: (p: number) => JSX.Element; // p = 0..1 progress within scene
  /** Narrated beats: each appears once progress crosses `at` (0..1).
      Use these to give the viewer time to read the scene before moving on. */
  beats?: { at: number; text: string }[];
};

/* ---------- helpers ---------- */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const between = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function MiniWindow({
  label, accent, children, glow = false,
}: { label: string; accent: string; children: React.ReactNode; glow?: boolean }) {
  return (
    <div
      className="rounded-xl border overflow-hidden w-full"
      style={{
        background: glow ? "hsl(var(--primary) / 0.05)" : "hsl(var(--background))",
        borderColor: accent + "55",
        boxShadow: glow ? `0 16px 40px -22px ${accent}` : "0 8px 22px -18px hsl(var(--foreground) / 0.25)",
      }}
    >
      <div
        className="flex items-center gap-1 px-2.5 py-1.5 border-b"
        style={{ borderColor: accent + "33", background: "hsl(var(--card))" }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent + "88" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: MUTED + "55" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: MUTED + "55" }} />
        <span className="ml-1.5 text-[9px] font-black tracking-[0.16em] uppercase" style={{ color: accent }}>
          {label}
        </span>
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  );
}

function Chip({ icon, label, accent = MUTED, dim = false }: { icon: React.ReactNode; label: string; accent?: string; dim?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border w-full"
      style={{
        background: "hsl(var(--background))",
        borderColor: accent + (dim ? "22" : "44"),
        opacity: dim ? 0.5 : 1,
      }}
    >
      <span style={{ color: accent }}>{icon}</span>
      <span className="text-[10.5px] font-bold text-foreground/85 truncate">{label}</span>
    </div>
  );
}

/* ---------- SCENES (StoryBrand arc) ----------
   1. Hero      — You already shipped AI everywhere.
   2. Problem   — Every tool answers differently.
   3. Stakes    — Decisions drift. Risk compounds.
   4. Guide     — Meet Liza: one standard your company decides by.
   5. Plan      — Liza plugs into your data + your AI tools. Nothing moves.
   6. Success   — Every AI, every team, aligned. + CTA
----------------------------------------------- */

/* 1. HERO — "You already shipped AI everywhere" */
function SceneHero(p: number) {
  const teams = [
    { dept: "Sales",   tool: "Copilot",       sub: "Drafting proposals",  icon: <Briefcase className="w-3.5 h-3.5" /> },
    { dept: "Legal",   tool: "Claude",        sub: "Reviewing MSAs",      icon: <Scale className="w-3.5 h-3.5" /> },
    { dept: "Support", tool: "Glean",         sub: "Answering tickets",   icon: <Headphones className="w-3.5 h-3.5" /> },
    { dept: "Ops",     tool: "Custom agent",  sub: "Triaging incidents",  icon: <Cog className="w-3.5 h-3.5" /> },
    { dept: "HR",      tool: "ChatGPT",       sub: "Screening candidates",icon: <UserCheck className="w-3.5 h-3.5" /> },
    { dept: "Finance", tool: "Custom GPT",    sub: "Closing the books",   icon: <Wallet className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          A Tuesday at your company
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {teams.map((t, i) => {
          const a = between(p, 0.05 + i * 0.08, 0.25 + i * 0.08);
          return (
            <div
              key={t.dept}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border"
              style={{
                opacity: a,
                transform: `translateY(${(1 - a) * 6}px)`,
                borderColor: PRIMARY + "33",
                background: "hsl(var(--background))",
              }}
            >
              <span style={{ color: PRIMARY }}>{t.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-foreground/85 truncate">{t.dept} · {t.tool}</p>
                <p className="text-[8.5px] text-muted-foreground truncate">{t.sub}</p>
              </div>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PRIMARY, boxShadow: `0 0 6px ${PRIMARY}` }} />
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 text-center text-[11px] font-bold text-foreground/80 leading-snug"
        style={{ opacity: between(p, 0.65, 0.9) }}
      >
        Six teams. A dozen tools. <span style={{ color: PRIMARY }}>Nobody told any of them what "we" means.</span>
      </div>
    </div>
  );
}

/* 2. PROBLEM — knowledge silos + shifting external reality + tool drift */
function SceneProblem(p: number) {
  const externals = [
    { icon: <Newspaper className="w-3 h-3" />, l: "New EU AI Act clause" },
    { icon: <Globe className="w-3 h-3" />,     l: "Competitor cuts price 18%" },
    { icon: <AlertCircle className="w-3 h-3" />, l: "CFO tightens approval rules" },
  ];
  const tools = [
    { who: "Maya · AE",        tool: "Copilot",   answer: "Up to 15% is fine",     ctx: "saw last quarter's deck" },
    { who: "Tom · Deal desk",  tool: "Claude",    answer: "25% on multi-year",     ctx: "read an old playbook" },
    { who: "Priya · CS",       tool: "Glean",     answer: "No policy found",       ctx: "policy lives in Legal's drive" },
  ];
  const extIn = between(p, 0.0, 0.18);
  const qIn = between(p, 0.2, 0.32);
  return (
    <div className="w-full max-w-[320px] mx-auto">
      {/* External pressure layer */}
      <div className="mb-2" style={{ opacity: extIn }}>
        <p className="text-[8.5px] font-black uppercase tracking-[0.14em] text-muted-foreground text-center mb-1">
          This week, the world changed three times
        </p>
        <div className="grid grid-cols-3 gap-1">
          {externals.map((e) => (
            <div key={e.l} className="flex items-center gap-1 px-1.5 py-1 rounded border"
              style={{ borderColor: RED + "33", background: RED + "06" }}>
              <span style={{ color: RED }}>{e.icon}</span>
              <span className="text-[8px] font-bold text-foreground/80 leading-tight">{e.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-2" style={{ opacity: qIn }}>
        <span className="text-[9.5px] font-black uppercase tracking-[0.16em]" style={{ color: RED }}>
          Slack · #deal-desk · 14:02
        </span>
        <p className="text-[11px] font-bold text-foreground/85 mt-1 leading-snug">
          "What's our max discount on a 3-year renewal?"
        </p>
      </div>
      <div className="space-y-1.5">
        {tools.map((t, i) => {
          const enter = between(p, 0.32 + i * 0.12, 0.5 + i * 0.12);
          const shake = p > 0.82 ? Math.sin((p - 0.82) * 60) * 2 : 0;
          return (
            <motion.div
              key={t.who}
              style={{
                opacity: enter,
                transform: `translateX(${(1 - enter) * -12 + shake}px)`,
                borderColor: RED + "55",
                background: RED + "06",
              }}
              className="rounded-lg border px-2.5 py-1.5"
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] font-black text-foreground/85 truncate">{t.who}</span>
                <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">asks {t.tool}</span>
              </div>
              <p className="text-[11px] font-bold" style={{ color: RED }}>"{t.answer}"</p>
              <p className="text-[8.5px] text-muted-foreground italic mt-0.5">{t.ctx}</p>
            </motion.div>
          );
        })}
      </div>
      <div
        className="mt-2.5 text-center text-[10px] font-black uppercase tracking-[0.14em] leading-snug"
        style={{ opacity: between(p, 0.82, 0.95), color: RED }}
      >
        Siloed teams. Shifting reality. Tools left to guess.
      </div>
    </div>
  );
}

/* 3. STAKES — what it costs you when nobody's in charge */
function SceneStakes(p: number) {
  const stakes = [
    { label: "Maya closes at 22%",         sub: "Discounts drift quarter over quarter", icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { label: "Audit flags 3 contracts",    sub: "PII pasted into a public LLM",         icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { label: "Tom stops trusting the tool", sub: "Goes back to asking on Slack",        icon: <Users className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[300px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: RED }}>
          Three weeks later
        </span>
      </div>
      <div className="space-y-1.5">
        {stakes.map((s, i) => {
          const a = between(p, 0.1 + i * 0.18, 0.35 + i * 0.18);
          return (
            <div
              key={s.label}
              className="flex items-start gap-2 px-2.5 py-2 rounded-lg border"
              style={{
                opacity: a,
                transform: `translateY(${(1 - a) * 8}px)`,
                borderColor: RED + "44",
                background: RED + "08",
              }}
            >
              <span className="mt-0.5 flex-shrink-0" style={{ color: RED }}>{s.icon}</span>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-foreground/90 leading-tight">{s.label}</p>
                <p className="text-[9.5px] text-muted-foreground mt-0.5 leading-snug">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 text-center text-[10.5px] font-bold text-foreground/80 leading-snug"
        style={{ opacity: between(p, 0.75, 0.95) }}
      >
        Nobody made a bad call. Nobody made the rules either.
      </div>
    </div>
  );
}

/* 4. GUIDE — "Meet Liza" — the standard, plus people working with it */
function SceneGuide(p: number) {
  const lines = [
    { k: "Discount cap",     v: "15% · 20% multi-yr" },
    { k: "Approval > €50k",  v: "CFO + Legal" },
    { k: "PII in prompts",   v: "Blocked" },
  ];
  const docIn = between(p, 0.0, 0.3);
  const usersIn = between(p, 0.3, 0.55);
  const liveIn = between(p, 0.55, 0.85);
  return (
    <div className="w-full max-w-[320px] mx-auto space-y-2">
      {/* The standard itself */}
      <div style={{ opacity: docIn }}>
        <MiniWindow label="Liza · Decision Standard" accent={PRIMARY} glow>
          <div className="flex items-start gap-2 mb-1.5">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: PRIMARY + "1a", color: PRIMARY, border: `1px solid ${PRIMARY}33` }}
            >
              <Compass className="w-3.5 h-3.5" />
            </span>
            <div className="flex-1">
              <p className="text-[11.5px] font-black text-foreground leading-tight">How your company decides.</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">v2.4 · Sarah (CRO) · 2d ago</p>
            </div>
          </div>
          <div className="space-y-1">
            {lines.map((l) => (
              <div key={l.k} className="flex items-center justify-between gap-2 px-1.5 py-0.5 rounded">
                <span className="text-[10px] text-foreground/85 font-semibold truncate">{l.k}</span>
                <span className="text-[9.5px] font-mono font-bold flex-shrink-0" style={{ color: PRIMARY }}>{l.v}</span>
              </div>
            ))}
          </div>
        </MiniWindow>
      </div>

      {/* People at work, side by side */}
      <div className="grid grid-cols-2 gap-2" style={{ opacity: usersIn }}>
        {/* Sarah authors a rule */}
        <div className="rounded-lg border p-2" style={{ borderColor: PRIMARY + "44", background: PRIMARY + "06" }}>
          <div className="flex items-center gap-1 mb-1">
            <Compass className="w-3 h-3" style={{ color: PRIMARY }} />
            <span className="text-[8.5px] font-black uppercase tracking-[0.1em]" style={{ color: PRIMARY }}>Sarah · CRO</span>
          </div>
          <p className="text-[9.5px] font-bold text-foreground/85 leading-tight mb-1">Edits "Discount cap"</p>
          <div className="text-[8.5px] font-mono text-muted-foreground leading-tight">
            <span className="line-through">15%</span>{" "}
            <span style={{ color: PRIMARY }} className="font-black">→ 20% multi-yr</span>
          </div>
          <p className="text-[8px] text-muted-foreground mt-1 italic">Diff sent to 2 reviewers.</p>
        </div>
        {/* Maya uses Liza in the workspace */}
        <div className="rounded-lg border p-2" style={{ borderColor: PRIMARY + "44", background: PRIMARY + "06" }}>
          <div className="flex items-center gap-1 mb-1">
            <Briefcase className="w-3 h-3" style={{ color: PRIMARY }} />
            <span className="text-[8.5px] font-black uppercase tracking-[0.1em]" style={{ color: PRIMARY }}>Maya · AE</span>
          </div>
          <p className="text-[9.5px] font-bold text-foreground/85 leading-tight mb-1">Drafts a renewal</p>
          <div className="flex items-center gap-1 text-[8.5px] text-foreground/80">
            <CheckCircle2 className="w-2.5 h-2.5" style={{ color: PRIMARY }} />
            Liza injects v2.5 §3
          </div>
          <p className="text-[8px] text-muted-foreground mt-0.5 italic">Cited in the proposal.</p>
        </div>
      </div>

      {/* Live signal coming back */}
      <div
        className="rounded-lg border px-2 py-1.5 flex items-center gap-2"
        style={{ opacity: liveIn, borderColor: PRIMARY + "33", background: "hsl(var(--background))" }}
      >
        <Activity className="w-3 h-3 flex-shrink-0" style={{ color: PRIMARY }} />
        <p className="text-[9.5px] text-foreground/85 leading-tight">
          <span className="font-black">3 deals</span> just closed citing v2.5 ·{" "}
          <span className="font-black" style={{ color: PRIMARY }}>1 edge case</span> flagged for Sarah
        </p>
      </div>

      <p
        className="text-center text-[9.5px] text-muted-foreground leading-snug px-2"
        style={{ opacity: between(p, 0.7, 0.95) }}
      >
        Leaders write the rules. Teams work with them. Liza keeps both in sync.
      </p>
    </div>
  );
}

/* 5. PLAN — 3 steps to start with Liza, plus the outcome */
function ScenePlan(p: number) {
  const steps = [
    {
      n: "1",
      title: "Connect",
      time: "Day 1",
      body: "Plug Liza into your stack. Read-only.",
      meta: ["SharePoint", "Salesforce", "Notion", "Gmail"],
      icon: <Plug className="w-3.5 h-3.5" />,
    },
    {
      n: "2",
      title: "Co-author the standard",
      time: "Week 1",
      body: "Liza drafts rules from real decisions. Leaders edit and approve.",
      meta: ["Liza drafts", "Sarah edits", "CFO signs"],
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      n: "3",
      title: "Wire to every AI tool",
      time: "Week 2",
      body: "Copilot, Claude, Glean, your custom agents. All cite the same source.",
      meta: ["Copilot", "Claude", "Glean", "Agents"],
      icon: <Link2 className="w-3.5 h-3.5" />,
    },
  ];
  return (
    <div className="w-full max-w-[320px] mx-auto space-y-1.5">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground text-center mb-1">
        Three steps. Two weeks.
      </p>
      {steps.map((s, i) => {
        const a = between(p, 0.05 + i * 0.18, 0.3 + i * 0.18);
        return (
          <div
            key={s.n}
            className="rounded-lg border p-2"
            style={{
              opacity: a,
              transform: `translateY(${(1 - a) * 8}px)`,
              borderColor: PRIMARY + "44",
              background: PRIMARY + "06",
            }}
          >
            <div className="flex items-start gap-2">
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 font-black text-[12px]"
                style={{ background: PRIMARY, color: "hsl(var(--primary-foreground))" }}
              >
                {s.n}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10.5px] font-black text-foreground leading-tight">{s.title}</p>
                  <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex-shrink-0">{s.time}</span>
                </div>
                <p className="text-[9.5px] text-muted-foreground leading-snug mt-0.5">{s.body}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.meta.map((m) => (
                    <span key={m} className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: PRIMARY + "12", color: PRIMARY }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Outcome */}
      <div
        className="rounded-lg border-2 border-dashed p-2 mt-1.5 flex items-center gap-2"
        style={{
          opacity: between(p, 0.68, 0.9),
          borderColor: PRIMARY,
          background: PRIMARY + "10",
        }}
      >
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: PRIMARY }} />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: PRIMARY }}>
            By Day 14
          </p>
          <p className="text-[10px] font-bold text-foreground/90 leading-tight">
            Every AI tool gives the same answer. Leaders own the rules.
          </p>
        </div>
      </div>
    </div>
  );
}

/* 6. SUCCESS — adjustment over time, with metrics + what's happening */
function SceneSuccess(p: number) {
  const timeline = [
    {
      when: "Week 2",
      event: "Same answer everywhere",
      detail: "Copilot, Claude, Glean all cite Pricing Policy v2.5 §3",
      metric: { k: "Conflicting answers", v: "−92%" },
    },
    {
      when: "Week 6",
      event: "EU AI Act clause lands",
      detail: "Sarah edits the standard once. Every AI tool updates by morning.",
      metric: { k: "Time to roll out", v: "1 day" },
    },
    {
      when: "Week 12",
      event: "The standard sharpens itself",
      detail: "23 edge cases surfaced from real deals. 17 became new rules.",
      metric: { k: "Rules approved", v: "+17" },
    },
  ];
  const headerIn = between(p, 0, 0.15);
  const summary = [
    { k: "Decisions logged",   v: "1,840" },
    { k: "Audit ready",        v: "100%" },
    { k: "Rework on proposals", v: "−64%" },
  ];
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="text-center mb-2" style={{ opacity: headerIn }}>
        <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: PRIMARY }}>
          The standard adjusts as you do
        </span>
      </div>

      <div className="relative pl-4 space-y-1.5 mb-2">
        <div className="absolute left-1 top-1 bottom-1 w-px" style={{ background: PRIMARY + "44" }} />
        {timeline.map((t, i) => {
          const a = between(p, 0.1 + i * 0.18, 0.32 + i * 0.18);
          return (
            <div
              key={t.when}
              className="relative rounded-lg border p-2"
              style={{
                opacity: a,
                transform: `translateX(${(1 - a) * 6}px)`,
                borderColor: PRIMARY + "44",
                background: PRIMARY + "06",
              }}
            >
              <span
                className="absolute -left-[14px] top-2 w-2 h-2 rounded-full"
                style={{ background: PRIMARY, boxShadow: `0 0 8px ${PRIMARY}` }}
              />
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[8.5px] font-black uppercase tracking-[0.12em]" style={{ color: PRIMARY }}>{t.when}</span>
                <span className="text-[9px] font-mono font-black" style={{ color: PRIMARY }}>
                  {t.metric.v} <span className="text-muted-foreground font-bold">{t.metric.k}</span>
                </span>
              </div>
              <p className="text-[10px] font-black text-foreground/90 leading-tight">{t.event}</p>
              <p className="text-[8.5px] text-muted-foreground leading-snug mt-0.5">{t.detail}</p>
            </div>
          );
        })}
      </div>

      <div
        className="grid grid-cols-3 gap-1 rounded-lg border p-1.5"
        style={{
          opacity: between(p, 0.7, 0.9),
          borderColor: PRIMARY + "55",
          background: PRIMARY + "10",
        }}
      >
        {summary.map((s) => (
          <div key={s.k} className="text-center">
            <p className="text-[12px] font-black leading-none" style={{ color: PRIMARY }}>{s.v}</p>
            <p className="text-[7.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground mt-0.5 leading-tight">{s.k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- scenes config ---------- */
const SCENES: Scene[] = [
  {
    kicker: "01 · You", headline: "You shipped AI everywhere.", duration: 11000, render: SceneHero,
    beats: [
      { at: 0.00, text: "It's a Tuesday. Six teams are already working with AI." },
      { at: 0.45, text: "Sales, Legal, Support, Ops, HR, Finance — each picked their own tool." },
      { at: 0.72, text: "A dozen assistants are running. Nobody told them what your company stands for." },
    ],
  },
  {
    kicker: "02 · Problem", headline: "But every tool answers differently.", duration: 12000, render: SceneProblem,
    beats: [
      { at: 0.00, text: "And the world won't sit still — regulation, competitors and policy shift every week." },
      { at: 0.30, text: "One question lands in #deal-desk. Three people, three tools, three answers." },
      { at: 0.78, text: "It's not the AI failing. It's the silos and the missing standard." },
    ],
  },
  {
    kicker: "03 · Stakes", headline: "And it's costing you.", duration: 11000, render: SceneStakes,
    beats: [
      { at: 0.00, text: "Three weeks later, the drift becomes visible." },
      { at: 0.55, text: "Discounts slip. Audit flags real risk. People stop trusting the tools." },
      { at: 0.80, text: "Nobody made a bad call. Nobody made the rules either." },
    ],
  },
  {
    kicker: "04 · Meet Liza", headline: "Liza writes how your company decides.", duration: 13000, render: SceneGuide,
    beats: [
      { at: 0.00, text: "Liza holds one living document: how your company actually decides." },
      { at: 0.40, text: "Leaders author rules. Teams draft work that cites them automatically." },
      { at: 0.70, text: "Every decision flows back as signal — closed deals, edge cases, gaps." },
    ],
  },
  {
    kicker: "05 · The plan", headline: "Liza learns, then governs.", duration: 14000, render: ScenePlan,
    beats: [
      { at: 0.00, text: "Day 1 — connect Liza to the systems where work already happens. Read-only." },
      { at: 0.35, text: "Week 1 — Liza drafts rules from real decisions. Leaders edit and sign." },
      { at: 0.65, text: "Week 2 — wire the standard into Copilot, Claude, Glean and your agents." },
    ],
  },
  {
    kicker: "06 · Success", headline: "One answer. Audited. Always improving.", duration: 13000, render: SceneSuccess,
    beats: [
      { at: 0.00, text: "Week 2 — every AI tool cites the same source." },
      { at: 0.35, text: "Week 6 — regulation lands. One edit; the whole company updates by morning." },
      { at: 0.70, text: "Week 12 — edge cases sharpen the standard. The OS compounds." },
    ],
  },
];

/* ---------- player ---------- */
export function ArchitectureWalkthrough() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current scene
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number>(performance.now());
  const elapsedRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Pause when off-screen to save battery
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive timeline
  useEffect(() => {
    if (paused || !inView) {
      cancelAnimationFrame(rafRef.current);
      startRef.current = performance.now() - elapsedRef.current;
      return;
    }
    const tick = () => {
      const now = performance.now();
      elapsedRef.current = now - startRef.current;
      const dur = SCENES[index].duration;
      const p = elapsedRef.current / dur;
      if (p >= 1) {
        if (index < SCENES.length - 1) {
          setIndex((i) => i + 1);
          startRef.current = performance.now();
          elapsedRef.current = 0;
          setProgress(0);
        } else {
          setProgress(1);
          return; // stop at end
        }
      } else {
        setProgress(p);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index, paused, inView]);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(SCENES.length - 1, i));
    setIndex(clamped);
    startRef.current = performance.now();
    elapsedRef.current = 0;
    setProgress(0);
  };

  const restart = () => goTo(0);

  // Tap zones: left third = back, right third = forward
  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.33) goTo(index - 1);
    else if (x > rect.width * 0.66) goTo(index + 1);
    else setPaused((v) => !v);
  };

  const scene = SCENES[index];
  const isFinal = index === SCENES.length - 1 && progress >= 0.98;

  // Active narrator beat — the last one whose `at` has been crossed.
  const activeBeat = (() => {
    const beats = scene.beats ?? [];
    let current: { at: number; text: string } | null = null;
    for (const b of beats) if (progress >= b.at) current = b;
    return current;
  })();

  return (
    <div ref={wrapRef} className="w-full md:max-w-3xl md:mx-auto">
      <div
        className="relative rounded-2xl border overflow-hidden select-none h-[560px] md:h-[640px]"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
          boxShadow: "0 16px 40px -28px hsl(var(--foreground) / 0.3)",
        }}
        onClick={onTap}
      >
        {/* Progress bars (top) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">
          {SCENES.map((_, i) => {
            const fill = i < index ? 1 : i === index ? progress : 0;
            return (
              <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "hsl(var(--foreground) / 0.12)" }}>
                <div className="h-full" style={{ width: `${fill * 100}%`, background: PRIMARY }} />
              </div>
            );
          })}
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Scene */}
        <div className="absolute inset-0 pt-9 pb-16 px-5 md:px-10 md:pt-12 md:pb-20 flex flex-col">
          <div className="mb-2 md:mb-3">
            <span className="text-[10px] md:text-[12px] font-black tracking-[0.22em] uppercase" style={{ color: PRIMARY }}>
              {scene.kicker}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.h3
              key={`h-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="text-[20px] md:text-[34px] font-black leading-[1.15] tracking-tight text-foreground mb-4 md:mb-6 md:max-w-2xl"
            >
              {scene.headline}
            </motion.h3>
          </AnimatePresence>
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`v-${index}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {scene.render(progress)}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Narrator caption — gives the viewer time to process each beat */}
          <div className="mt-3 md:mt-5 min-h-[48px] md:min-h-[56px] flex items-start justify-center">
            <AnimatePresence mode="wait">
              {activeBeat && (
                <motion.p
                  key={`beat-${index}-${activeBeat.at}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.45 }}
                  className="text-[12px] md:text-[14px] leading-snug text-foreground/80 text-center max-w-[28ch] md:max-w-[52ch] font-medium"
                >
                  {activeBeat.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pause indicator (center) */}
        <AnimatePresence>
          {paused && !isFinal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--background) / 0.85)", border: `1px solid ${PRIMARY}55` }}
              >
                <Play className="w-5 h-5" style={{ color: PRIMARY }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card) / 0.85)" }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(index - 1); }}
            disabled={index === 0}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground disabled:opacity-30"
            aria-label="Previous scene"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPaused((v) => !v); }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-foreground/80"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {paused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); isFinal ? restart() : goTo(index + 1); }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground"
            aria-label={isFinal ? "Replay" : "Next scene"}
          >
            {isFinal ? "Replay" : "Next"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* End-card CTA overlay */}
        <AnimatePresence>
          {isFinal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
              style={{ background: "hsl(var(--background) / 0.92)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[11px] font-black tracking-[0.22em] uppercase mb-3" style={{ color: PRIMARY }}>That's the OS.</p>
              <h4 className="text-[22px] font-black leading-tight mb-5">Now see where you stand.</h4>
              <Link
                to="/diagnostic"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold w-full justify-center"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
                }}
              >
                Score your AI execution
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={restart}
                className="mt-4 text-[12px] font-bold text-muted-foreground"
              >
                Replay the story
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

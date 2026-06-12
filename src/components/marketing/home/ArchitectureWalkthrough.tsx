import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, Compass, Sparkles, Workflow,
  ArrowRight, ArrowLeft, Play, Pause, Bot, Search,
  CheckCircle2, TrendingDown, Users, FileText, Activity,
  Briefcase, Scale, Headphones, Cog, UserCheck, Wallet, Globe, Newspaper, AlertCircle, Link2, Plug,
  Gauge,
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
  /** Single caption shown at the bottom — one line that names what the
      visual above is showing. Same principle as ProductFilm. */
  caption: string;
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

/* 2a. SHIFTING REALITY — the world keeps changing under you */
function SceneShiftingReality(p: number) {
  const externals = [
    { icon: <Newspaper className="w-3.5 h-3.5" />, l: "New EU AI Act clause", sub: "Compliance must update prompts" },
    { icon: <Globe className="w-3.5 h-3.5" />,     l: "Competitor cuts price 18%", sub: "Sales needs new discount logic" },
    { icon: <AlertCircle className="w-3.5 h-3.5" />, l: "CFO tightens approval rules", sub: "Deal desk thresholds change" },
  ];
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: RED }}>
          This week alone
        </span>
      </div>
      <div className="space-y-1.5">
        {externals.map((e, i) => {
          const a = between(p, 0.05 + i * 0.18, 0.3 + i * 0.18);
          return (
            <div
              key={e.l}
              className="flex items-start gap-2 px-2.5 py-2 rounded-lg border"
              style={{
                opacity: a,
                transform: `translateX(${(1 - a) * -10}px)`,
                borderColor: RED + "44",
                background: RED + "06",
              }}
            >
              <span className="mt-0.5 flex-shrink-0" style={{ color: RED }}>{e.icon}</span>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-foreground/90 leading-tight">{e.l}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{e.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 text-center text-[10px] font-bold text-foreground/80 leading-snug"
        style={{ opacity: between(p, 0.7, 0.95) }}
      >
        Three external shifts. Zero of your AI tools knew about any of them.
      </div>
    </div>
  );
}

/* 2b. TOOL DRIFT — same question, different answer */
function SceneToolDrift(p: number) {
  const tools = [
    { who: "Maya · AE",        tool: "Copilot",   answer: "Up to 15% is fine",     ctx: "saw last quarter's deck" },
    { who: "Tom · Deal desk",  tool: "Claude",    answer: "25% on multi-year",     ctx: "read an old playbook" },
    { who: "Priya · CS",       tool: "Glean",     answer: "No policy found",       ctx: "policy lives in Legal's drive" },
  ];
  const qIn = between(p, 0, 0.18);
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="text-center mb-2.5" style={{ opacity: qIn }}>
        <span className="text-[9.5px] font-black uppercase tracking-[0.16em]" style={{ color: RED }}>
          Slack · #deal-desk · 14:02
        </span>
        <p className="text-[12px] font-bold text-foreground/85 mt-1 leading-snug">
          "What's our max discount on a 3-year renewal?"
        </p>
      </div>
      <div className="space-y-1.5">
        {tools.map((t, i) => {
          const enter = between(p, 0.2 + i * 0.18, 0.42 + i * 0.18);
          const shake = p > 0.85 ? Math.sin((p - 0.85) * 60) * 2 : 0;
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
              <p className="text-[11.5px] font-bold" style={{ color: RED }}>"{t.answer}"</p>
              <p className="text-[8.5px] text-muted-foreground italic mt-0.5">{t.ctx}</p>
            </motion.div>
          );
        })}
      </div>
      <div
        className="mt-2.5 text-center text-[10px] font-black uppercase tracking-[0.14em] leading-snug"
        style={{ opacity: between(p, 0.85, 0.97), color: RED }}
      >
        Same question. Three answers. None of them yours.
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

/* 4a. GUIDE — "Meet Liza" — the standard itself */
function SceneStandard(p: number) {
  const lines = [
    { k: "Discount cap",     v: "15% · 20% multi-yr" },
    { k: "Approval > €50k",  v: "CFO + Legal" },
    { k: "PII in prompts",   v: "Blocked" },
  ];
  const docIn = between(p, 0.0, 0.35);
  const linesIn = (i: number) => between(p, 0.35 + i * 0.12, 0.55 + i * 0.12);
  return (
    <div className="w-full max-w-[320px] mx-auto">
      {/* The standard itself */}
      <div style={{ opacity: docIn }}>
        <MiniWindow label="Liza · Decision Standard" accent={PRIMARY} glow>
          <div className="flex items-start gap-2 mb-2">
            <span
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: PRIMARY + "1a", color: PRIMARY, border: `1px solid ${PRIMARY}33` }}
            >
              <Compass className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <p className="text-[12.5px] font-black text-foreground leading-tight">How your company decides.</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">v2.4 · Sarah (CRO) · 2d ago</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {lines.map((l, i) => (
              <div
                key={l.k}
                className="flex items-center justify-between gap-2 px-2 py-1.5 rounded border"
                style={{
                  opacity: linesIn(i),
                  transform: `translateX(${(1 - linesIn(i)) * -8}px)`,
                  borderColor: PRIMARY + "22",
                  background: PRIMARY + "06",
                }}
              >
                <span className="text-[10.5px] text-foreground/85 font-semibold truncate">{l.k}</span>
                <span className="text-[10px] font-mono font-bold flex-shrink-0" style={{ color: PRIMARY }}>{l.v}</span>
              </div>
            ))}
          </div>
        </MiniWindow>
      </div>
      <p
        className="text-center text-[10px] text-muted-foreground leading-snug px-2 mt-3"
        style={{ opacity: between(p, 0.75, 0.95) }}
      >
        One living document. Versioned. Owned by leaders.
      </p>
    </div>
  );
}

/* 4c. METER — AI is moving from flat seats to metered consumption */
function SceneMeter(p: number) {
  // Two side-by-side meters: "Today" (flat seats) → "By 2027" (metered tokens)
  const todayIn = between(p, 0.05, 0.3);
  const arrowIn = between(p, 0.3, 0.45);
  const meterIn = between(p, 0.4, 0.7);
  const fill = between(p, 0.45, 0.85); // animate the meter filling
  const callouts = [
    { k: "Sales draft",  v: "12,400 tok"  },
    { k: "Legal review", v: "38,900 tok"  },
    { k: "Support reply", v: "4,100 tok"  },
    { k: "Agent loop",   v: "210,500 tok" },
  ];
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: RED }}>
          The pricing model is changing
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* TODAY — flat seats */}
        <div
          className="rounded-lg border p-2"
          style={{
            opacity: todayIn,
            transform: `translateY(${(1 - todayIn) * 8}px)`,
            borderColor: MUTED + "44",
            background: "hsl(var(--background))",
          }}
        >
          <p className="text-[8.5px] font-black uppercase tracking-[0.14em] text-muted-foreground">Today</p>
          <p className="text-[14px] font-black text-foreground leading-tight mt-1">$30 / seat</p>
          <p className="text-[8.5px] text-muted-foreground leading-snug mt-1">
            Flat. Predictable. Disconnected from value.
          </p>
        </div>

        <div style={{ opacity: arrowIn }}>
          <ArrowRight className="w-4 h-4" style={{ color: RED }} />
        </div>

        {/* 2027 — metered tokens */}
        <div
          className="rounded-lg border p-2"
          style={{
            opacity: meterIn,
            transform: `translateY(${(1 - meterIn) * 8}px)`,
            borderColor: RED + "55",
            background: RED + "08",
          }}
        >
          <p className="text-[8.5px] font-black uppercase tracking-[0.14em]" style={{ color: RED }}>By 2027</p>
          <p className="text-[14px] font-black text-foreground leading-tight mt-1">$ / million tokens</p>
          <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: RED + "1a" }}>
            <div className="h-full" style={{ width: `${fill * 100}%`, background: RED, transition: "width 80ms linear" }} />
          </div>
          <p className="text-[8.5px] text-muted-foreground leading-snug mt-1">
            Every call is a line item.
          </p>
        </div>
      </div>

      {/* Itemised consumption callouts */}
      <div
        className="mt-3 rounded-lg border p-2"
        style={{
          opacity: between(p, 0.55, 0.8),
          borderColor: RED + "33",
          background: "hsl(var(--background))",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Gauge className="w-3 h-3" style={{ color: RED }} />
          <span className="text-[8.5px] font-black uppercase tracking-[0.14em]" style={{ color: RED }}>
            Yesterday's bill · sample
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {callouts.map((c) => (
            <div key={c.k} className="flex items-center justify-between gap-2">
              <span className="text-[9px] text-foreground/85 truncate">{c.k}</span>
              <span className="text-[9px] font-mono font-black" style={{ color: RED }}>{c.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-3 text-center text-[10px] font-bold text-foreground/85 leading-snug"
        style={{ opacity: between(p, 0.75, 0.95) }}
      >
        If you can't tie every token to a standard, you can't defend the bill.
      </div>
    </div>
  );
}

/* 4b. THE LOOP — leaders edit, teams cite, signal flows back */
function SceneLoop(p: number) {
  const editIn = between(p, 0.0, 0.25);
  const useIn = between(p, 0.25, 0.5);
  const liveIn = between(p, 0.5, 0.78);
  return (
    <div className="w-full max-w-[320px] mx-auto space-y-2">
      {/* People at work, side by side */}
      <div className="grid grid-cols-2 gap-2">
        {/* Sarah authors a rule */}
        <div
          className="rounded-lg border p-2"
          style={{
            opacity: editIn,
            transform: `translateY(${(1 - editIn) * 8}px)`,
            borderColor: PRIMARY + "44",
            background: PRIMARY + "06",
          }}
        >
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
        <div
          className="rounded-lg border p-2"
          style={{
            opacity: useIn,
            transform: `translateY(${(1 - useIn) * 8}px)`,
            borderColor: PRIMARY + "44",
            background: PRIMARY + "06",
          }}
        >
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
        style={{ opacity: between(p, 0.78, 0.95) }}
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
    kicker: "01 · You", headline: "You shipped AI everywhere.", duration: 7500, render: SceneHero,
    caption: "Six teams. A dozen assistants. None of them know what your company stands for.",
  },
  {
    kicker: "02 · Pressure", headline: "The world keeps changing under you.", duration: 7000, render: SceneShiftingReality,
    caption: "Regulation, market and policy shift weekly. None of your AI tools find out.",
  },
  {
    kicker: "03 · Drift", headline: "Every tool answers differently.", duration: 7500, render: SceneToolDrift,
    caption: "One question. Three tools. Three answers. The AI is fine. The standard is missing.",
  },
  {
    kicker: "04 · Stakes", headline: "And it is costing you.", duration: 7500, render: SceneStakes,
    caption: "Discounts drift. Audit flags real risk. Nobody made a bad call. Nobody made the rules either.",
  },
  {
    kicker: "05 · The bill", headline: "And the bill is about to be itemised.", duration: 7500, render: SceneMeter,
    caption: "AI is shifting from flat seats to metered tokens. Every call becomes a P&L line. Without a standard, every token is unanchored consumption.",
  },
  {
    kicker: "06 · Meet Liza", headline: "One standard your company decides by.", duration: 7500, render: SceneStandard,
    caption: "A living document. Versioned. Owned by leaders. Read by every AI tool.",
  },
  {
    kicker: "07 · The loop", headline: "Leaders write. Teams cite. Signal flows back.", duration: 8000, render: SceneLoop,
    caption: "Sarah edits a rule. Maya cites it on a deal. Liza flags the next edge case for Sarah.",
  },
  {
    kicker: "08 · The plan", headline: "Liza learns, then governs.", duration: 8500, render: ScenePlan,
    caption: "Connect, co-author, wire to every AI tool. Two weeks to a common source of truth.",
  },
  {
    kicker: "09 · Success", headline: "One answer. Audited. Compounding.", duration: 9000, render: SceneSuccess,
    caption: "Same answer in every tool. Regulation rolls out in a day. Every token tied to a standard you can defend.",
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

  return (
    <div ref={wrapRef} className="w-full md:max-w-3xl md:mx-auto">
      <div
        className="relative rounded-2xl border-2 overflow-hidden select-none md:max-w-5xl md:mx-auto"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--primary) / 0.35)",
          boxShadow: "0 24px 60px -24px hsl(var(--primary) / 0.4)",
        }}
      >
        {/* Frame chrome — matches ProductFilm */}
        <div
          className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 border-b"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full ml-1.5" style={{ background: "hsl(var(--brand-green, var(--primary)) / 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full ml-1.5" style={{ background: "hsl(var(--primary) / 0.7)" }} />
          <span className="ml-3 text-[9px] sm:text-[10px] font-black tracking-[0.18em] uppercase text-primary truncate">
            LIZA · The story
          </span>
        </div>
        <div
          className="relative h-[640px] md:h-[620px]"
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
        <div className="absolute inset-0 pt-9 pb-16 px-5 md:px-8 md:pt-12 md:pb-20 flex flex-col">
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
              className="text-[20px] md:text-[28px] font-black leading-[1.15] tracking-tight text-foreground mb-4 md:mb-5"
            >
              {scene.headline}
            </motion.h3>
          </AnimatePresence>

          {/* Stage: single full-width visual, ProductFilm style */}
          <div className="flex-1 relative min-h-0 flex items-center justify-center">
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

          {/* Single caption — one line that names what the visual is showing */}
          <div className="mt-3 md:mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`cap-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl mx-auto rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 backdrop-blur-md"
                style={{
                  background: "hsl(var(--background) / 0.9)",
                  border: "1px solid hsl(var(--primary) / 0.35)",
                }}
              >
                <p className="text-center text-[12px] sm:text-sm md:text-base font-bold text-foreground leading-snug">
                  {scene.caption}
                </p>
              </motion.div>
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
    </div>
  );
}

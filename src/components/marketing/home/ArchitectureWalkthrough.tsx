import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, Compass, Database, Sparkles, Workflow,
  ArrowDown, ArrowUp, ArrowRight, Play, Pause, Cloud, Mail, FileSpreadsheet, Bot, Search,
  CheckCircle2, TrendingDown, Users, FileText, GitBranch, BookOpen, Stamp, Activity, Eye,
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
  const tools = [
    { name: "Copilot", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { name: "Claude",  icon: <Bot className="w-3.5 h-3.5" /> },
    { name: "Glean",   icon: <Search className="w-3.5 h-3.5" /> },
    { name: "Agents",  icon: <Workflow className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Your company, today
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((t, i) => {
          const a = between(p, 0.05 + i * 0.12, 0.3 + i * 0.12);
          return (
            <div key={t.name} style={{ opacity: a, transform: `scale(${0.9 + a * 0.1})` }}>
              <Chip icon={t.icon} label={t.name} accent={PRIMARY} />
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 text-center text-[11px] font-bold text-foreground/80"
        style={{ opacity: between(p, 0.65, 0.9) }}
      >
        AI is everywhere. <span style={{ color: PRIMARY }}>It's working.</span>
      </div>
    </div>
  );
}

/* 2. PROBLEM — same question, conflicting answers */
function SceneProblem(p: number) {
  const tools = [
    { name: "Copilot", answer: "Discount cap: 15%" },
    { name: "Claude", answer: "Discount cap: 25%" },
    { name: "Glean", answer: "No policy found" },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: RED }}>
          One question. Three answers.
        </span>
      </div>
      <div className="space-y-2">
        {tools.map((t, i) => {
          const enter = between(p, 0.05 + i * 0.15, 0.25 + i * 0.15);
          const shake = p > 0.75 ? Math.sin((p - 0.75) * 60) * 2 : 0;
          return (
            <motion.div
              key={t.name}
              style={{
                opacity: enter,
                transform: `translateX(${(1 - enter) * -16 + shake}px)`,
              }}
              className="rounded-lg border-2 px-3 py-2 flex items-center justify-between gap-2"
            >
              <span className="text-[11px] font-black" style={{ color: PRIMARY }}>{t.name}</span>
              <span className="text-[11px] font-bold" style={{ color: RED }}>{t.answer}</span>
            </motion.div>
          );
        })}
      </div>
      <div
        className="mt-3 text-center text-[11px] font-black uppercase tracking-[0.18em]"
        style={{ opacity: between(p, 0.7, 0.9), color: RED }}
      >
        Nobody's in charge.
      </div>
    </div>
  );
}

/* 3. STAKES — what it costs you when nobody's in charge */
function SceneStakes(p: number) {
  const stakes = [
    { label: "Decisions drift",     icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { label: "Risk compounds",      icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { label: "Teams lose trust",    icon: <Users className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[280px] mx-auto">
      <div className="text-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: RED }}>
          The hidden cost
        </span>
      </div>
      <div className="space-y-2">
        {stakes.map((s, i) => {
          const a = between(p, 0.1 + i * 0.18, 0.35 + i * 0.18);
          return (
            <div
              key={s.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border"
              style={{
                opacity: a,
                transform: `translateY(${(1 - a) * 8}px)`,
                borderColor: RED + "44",
                background: RED + "08",
              }}
            >
              <span style={{ color: RED }}>{s.icon}</span>
              <span className="text-[11.5px] font-bold text-foreground/85">{s.label}</span>
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 text-center text-[11px] font-bold text-foreground/80"
        style={{ opacity: between(p, 0.75, 0.95) }}
      >
        You can't scale what you can't govern.
      </div>
    </div>
  );
}

/* 4. GUIDE — "Meet Liza" — a single Decision Standard doc materializes */
function SceneGuide(p: number) {
  const scale = 0.85 + ease(between(p, 0, 0.35)) * 0.15;
  const lines = [
    { k: "Pricing rules",        v: "Discount cap 15%" },
    { k: "Approval thresholds",  v: "> €50k → CFO" },
    { k: "Risk appetite",        v: "No PII to public LLMs" },
    { k: "Tone of voice",        v: "Direct, no hedging" },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto" style={{ transform: `scale(${scale})` }}>
      <MiniWindow label="Liza · Decision Standard" accent={PRIMARY} glow>
        <div className="flex items-start gap-2 mb-2">
          <span
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: PRIMARY + "1a", color: PRIMARY, border: `1px solid ${PRIMARY}33` }}
          >
            <Compass className="w-4 h-4" />
          </span>
          <div className="flex-1">
            <p className="text-[12px] font-black text-foreground leading-tight">How your company decides.</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">v2.4 · Owned by leadership · Machine-readable</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {lines.map((l, i) => {
            const a = between(p, 0.25 + i * 0.12, 0.45 + i * 0.12);
            return (
              <div
                key={l.k}
                className="flex items-center justify-between gap-2 px-2 py-1 rounded"
                style={{ opacity: a, transform: `translateX(${(1 - a) * -8}px)` }}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: PRIMARY }} />
                  <span className="text-[10.5px] text-foreground/85 font-semibold truncate">{l.k}</span>
                </div>
                <span className="text-[10px] font-mono font-bold flex-shrink-0" style={{ color: PRIMARY }}>{l.v}</span>
              </div>
            );
          })}
        </div>
        <div
          className="mt-2 pt-2 border-t flex items-center gap-1.5"
          style={{ borderColor: PRIMARY + "22", opacity: between(p, 0.75, 0.95) }}
        >
          <GitBranch className="w-3 h-3" style={{ color: PRIMARY }} />
          <span className="text-[9px] font-bold text-muted-foreground">Versioned · Auditable · Editable in plain English</span>
        </div>
      </MiniWindow>
    </div>
  );
}

/* 5. PLAN — Liza connects, learns, and produces artifacts. */
function ScenePlan(p: number) {
  const records = [
    { label: "SharePoint",  icon: <Cloud className="w-3 h-3" /> },
    { label: "Databases",   icon: <Database className="w-3 h-3" /> },
    { label: "Docs",        icon: <FileSpreadsheet className="w-3 h-3" /> },
    { label: "Email",       icon: <Mail className="w-3 h-3" /> },
  ];
  const tools = [
    { label: "Copilot", icon: <Sparkles className="w-3 h-3" /> },
    { label: "Claude",  icon: <Bot className="w-3 h-3" /> },
    { label: "Glean",   icon: <Search className="w-3 h-3" /> },
    { label: "Agents",  icon: <Workflow className="w-3 h-3" /> },
  ];
  const topIn = between(p, 0.0, 0.22);
  const learnIn = between(p, 0.22, 0.45);
  const center = between(p, 0.4, 0.6);
  const botIn = between(p, 0.6, 0.8);
  return (
    <div className="w-full max-w-[290px] mx-auto">
      {/* Top: your data */}
      <div className="mb-1" style={{ opacity: topIn }}>
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground text-center mb-1">
          1 · Connect your data
        </p>
        <div className="grid grid-cols-4 gap-1">
          {records.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-0.5 px-1 py-1 rounded border"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
              <span style={{ color: MUTED }}>{r.icon}</span>
              <span className="text-[8px] font-bold text-foreground/75 truncate">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center my-0.5" style={{ opacity: between(p, 0.18, 0.3) }}>
        <ArrowDown className="w-3 h-3" style={{ color: PRIMARY }} />
      </div>

      {/* Learn step */}
      <div
        className="mb-1 rounded-lg border px-2 py-1.5"
        style={{
          opacity: learnIn,
          borderColor: PRIMARY + "44",
          background: PRIMARY + "08",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Activity className="w-3 h-3" style={{ color: PRIMARY }} />
          <span className="text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: PRIMARY }}>
            2 · Liza learns how you actually decide
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { i: <BookOpen className="w-3 h-3" />, l: "Reads docs" },
            { i: <Eye className="w-3 h-3" />,      l: "Watches calls" },
            { i: <FileText className="w-3 h-3" />, l: "Drafts rules" },
          ].map((x, i) => {
            const a = between(p, 0.25 + i * 0.05, 0.4 + i * 0.05);
            return (
              <div key={x.l} className="flex flex-col items-center gap-0.5" style={{ opacity: a }}>
                <span style={{ color: PRIMARY }}>{x.i}</span>
                <span className="text-[8px] font-bold text-foreground/80 text-center leading-tight">{x.l}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center my-0.5" style={{ opacity: between(p, 0.42, 0.55) }}>
        <ArrowDown className="w-3 h-3" style={{ color: PRIMARY }} />
      </div>

      {/* Center: Standard + artifacts */}
      <div style={{ opacity: center, transform: `scale(${0.94 + center * 0.06})` }}>
        <MiniWindow label="3 · Liza · Decision Standard" accent={PRIMARY} glow>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Compass className="w-3.5 h-3.5 flex-shrink-0" style={{ color: PRIMARY }} />
            <p className="text-[10.5px] font-bold text-foreground/85">
              Standard + living artifacts
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { l: "Policies",  i: <FileText className="w-3 h-3" /> },
              { l: "Playbooks", i: <BookOpen className="w-3 h-3" /> },
              { l: "Approvals", i: <Stamp className="w-3 h-3" /> },
            ].map((a) => (
              <div key={a.l} className="flex items-center gap-1 px-1.5 py-1 rounded border"
                style={{ borderColor: PRIMARY + "33", background: "hsl(var(--background))" }}>
                <span style={{ color: PRIMARY }}>{a.i}</span>
                <span className="text-[8.5px] font-bold text-foreground/80 truncate">{a.l}</span>
              </div>
            ))}
          </div>
        </MiniWindow>
      </div>

      <div className="flex justify-center my-0.5" style={{ opacity: between(p, 0.58, 0.7) }}>
        <ArrowDown className="w-3 h-3" style={{ color: PRIMARY }} />
      </div>

      {/* Bottom: your AI tools */}
      <div style={{ opacity: botIn }}>
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground text-center mb-1">
          4 · Your AI tools read the standard
        </p>
        <div className="grid grid-cols-4 gap-1">
          {tools.map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-0.5 px-1 py-1 rounded border"
              style={{ borderColor: PRIMARY + "44", background: PRIMARY + "0a" }}>
              <span style={{ color: PRIMARY }}>{t.icon}</span>
              <span className="text-[8px] font-bold text-foreground/85 truncate">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 6. SUCCESS — concrete before/after with proof signals */
function SceneSuccess(p: number) {
  const tools = ["Copilot", "Claude", "Glean"];
  const lineIn = between(p, 0.05, 0.25);
  const wins = [
    { k: "Same answer, every tool", v: "Discount cap: 15%" },
    { k: "Every action, audited",   v: "147 decisions / wk" },
    { k: "Standard improves itself", v: "+12 rules this month" },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto">
      <div className="text-center mb-2" style={{ opacity: between(p, 0, 0.2) }}>
        <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: PRIMARY }}>
          With Liza in place
        </span>
      </div>

      {/* Same question, same answer */}
      <div
        className="rounded-lg border px-2.5 py-2 mb-2"
        style={{ opacity: lineIn, borderColor: PRIMARY + "44", background: PRIMARY + "08" }}
      >
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
          One question
        </p>
        <div className="space-y-1">
          {tools.map((t, i) => {
            const a = between(p, 0.1 + i * 0.06, 0.25 + i * 0.06);
            return (
              <div key={t} className="flex items-center justify-between" style={{ opacity: a }}>
                <span className="text-[10.5px] font-black" style={{ color: PRIMARY }}>{t}</span>
                <span className="text-[10.5px] font-bold text-foreground/85 font-mono">Discount cap: 15%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        {wins.map((w, i) => {
          const a = between(p, 0.35 + i * 0.15, 0.55 + i * 0.15);
          return (
            <div
              key={w.k}
              className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border"
              style={{
                opacity: a,
                transform: `translateY(${(1 - a) * 6}px)`,
                borderColor: PRIMARY + "44",
                background: PRIMARY + "0a",
              }}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: PRIMARY }} />
                <span className="text-[10.5px] font-bold text-foreground/90 truncate">{w.k}</span>
              </div>
              <span className="text-[10px] font-mono font-black flex-shrink-0" style={{ color: PRIMARY }}>{w.v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- scenes config ---------- */
const SCENES: Scene[] = [
  { kicker: "01 · You",        headline: "You shipped AI everywhere.",          duration: 3800, render: SceneHero },
  { kicker: "02 · Problem",    headline: "But every tool answers differently.", duration: 4400, render: SceneProblem },
  { kicker: "03 · Stakes",     headline: "And it's costing you.",                duration: 4200, render: SceneStakes },
  { kicker: "04 · Meet Liza",  headline: "Liza writes how your company decides.", duration: 5200, render: SceneGuide },
  { kicker: "05 · The plan",   headline: "Liza learns, then governs.",          duration: 6200, render: ScenePlan },
  { kicker: "06 · Success",    headline: "One answer. Audited. Always improving.", duration: 5200, render: SceneSuccess },
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
    <div ref={wrapRef} className="md:hidden">
      <div
        className="relative rounded-2xl border overflow-hidden select-none"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
          boxShadow: "0 16px 40px -28px hsl(var(--foreground) / 0.3)",
          height: 560,
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
        <div className="absolute inset-0 pt-9 pb-16 px-5 flex flex-col">
          <div className="mb-2">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: PRIMARY }}>
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
              className="text-[20px] font-black leading-[1.15] tracking-tight text-foreground mb-4"
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
            onClick={(e) => { e.stopPropagation(); setPaused((v) => !v); }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {paused ? "Play" : "Pause"}
          </button>
          <span className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground">TAP TO SKIP</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); restart(); }}
            className="text-[11px] font-bold text-muted-foreground"
          >
            Replay
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

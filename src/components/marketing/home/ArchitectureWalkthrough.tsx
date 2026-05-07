import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, Compass, Database, Sparkles, Workflow,
  ArrowDown, ArrowUp, ArrowRight, Play, Pause, Cloud, Mail, FileSpreadsheet, Bot, Search,
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

/* ---------- SCENES ---------- */

/* 1. The problem — 3 AI tools spit out 3 different conflicting answers */
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
          One question. Three AIs.
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
        Conflict.
      </div>
    </div>
  );
}

/* 2. The fix — a single "Decision Standard" doc materializes */
function SceneFix(p: number) {
  const scale = 0.85 + ease(between(p, 0, 0.35)) * 0.15;
  const lines = [
    "Pricing rules",
    "Approval thresholds",
    "Risk appetite",
    "Tone of voice",
  ];
  return (
    <div className="w-full max-w-[280px] mx-auto" style={{ transform: `scale(${scale})` }}>
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
            <p className="text-[10px] text-muted-foreground mt-0.5">v2.4 · Owned by leadership</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {lines.map((l, i) => {
            const a = between(p, 0.25 + i * 0.12, 0.45 + i * 0.12);
            return (
              <div
                key={l}
                className="flex items-center gap-2"
                style={{ opacity: a, transform: `translateX(${(1 - a) * -8}px)` }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: PRIMARY }} />
                <span className="text-[11px] text-foreground/85 font-semibold">{l}</span>
              </div>
            );
          })}
        </div>
      </MiniWindow>
    </div>
  );
}

/* 3. Records — files fly in toward a central standard */
function SceneRecords(p: number) {
  const items = [
    { label: "SharePoint", icon: <Cloud className="w-3.5 h-3.5" /> },
    { label: "Veeva / databases", icon: <Database className="w-3.5 h-3.5" /> },
    { label: "Documents", icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { label: "Email & chat", icon: <Mail className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto">
      <div className="grid grid-cols-2 gap-2 mb-3">
        {items.map((it, i) => {
          const a = between(p, 0.05 + i * 0.08, 0.3 + i * 0.08);
          const tx = (1 - a) * (i % 2 === 0 ? -20 : 20);
          return (
            <div key={it.label} style={{ opacity: a, transform: `translateX(${tx}px)` }}>
              <Chip icon={it.icon} label={it.label} accent={MUTED} />
            </div>
          );
        })}
      </div>
      {/* Arrows down + up */}
      <div className="flex justify-center items-center gap-3 my-1.5" style={{ opacity: between(p, 0.5, 0.7) }}>
        <ArrowDown className="w-4 h-4" style={{ color: PRIMARY }} />
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Read · Write</span>
        <ArrowUp className="w-4 h-4" style={{ color: PRIMARY }} />
      </div>
      <div style={{ opacity: between(p, 0.6, 0.85), transform: `scale(${0.9 + between(p, 0.6, 0.85) * 0.1})` }}>
        <MiniWindow label="Liza" accent={PRIMARY} glow>
          <p className="text-[11px] font-bold text-foreground/85 text-center">Your records stay where they are.</p>
        </MiniWindow>
      </div>
    </div>
  );
}

/* 4. AI tools — Copilot/Claude/Glean change their answer to match the standard */
function SceneTools(p: number) {
  const tools = [
    { name: "Copilot", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { name: "Claude", icon: <Bot className="w-3.5 h-3.5" /> },
    { name: "Glean", icon: <Search className="w-3.5 h-3.5" /> },
    { name: "Vendor RAG", icon: <Bot className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto">
      {/* Standard pulse on top */}
      <div className="mb-2.5" style={{ opacity: between(p, 0, 0.2) }}>
        <MiniWindow label="Standard" accent={PRIMARY} glow>
          <p className="text-[10.5px] font-bold text-foreground/85 text-center">Discount cap: 20%. Approved.</p>
        </MiniWindow>
      </div>
      {/* Beam down */}
      <div className="flex justify-center my-1.5" style={{ opacity: between(p, 0.2, 0.35) }}>
        <ArrowDown className="w-4 h-4" style={{ color: PRIMARY }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((t, i) => {
          const a = between(p, 0.35 + i * 0.08, 0.55 + i * 0.08);
          const aligned = p > 0.75;
          return (
            <div
              key={t.name}
              className="rounded-lg border px-2 py-2 flex flex-col gap-1"
              style={{
                opacity: a,
                borderColor: aligned ? PRIMARY + "55" : "hsl(var(--border))",
                background: aligned ? PRIMARY + "0d" : "hsl(var(--background))",
                transition: "border-color 220ms, background 220ms",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span style={{ color: aligned ? PRIMARY : MUTED }}>{t.icon}</span>
                <span className="text-[10.5px] font-black text-foreground">{t.name}</span>
              </div>
              <span className="text-[10px] font-bold" style={{ color: aligned ? PRIMARY : MUTED }}>
                {aligned ? "20%" : "…"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 5. Workspace — tabs typing, output appearing */
function SceneWorkspace(p: number) {
  const tabs = ["Workbook", "Agents", "Capture", "Oversight"];
  const lines = [0.95, 0.78, 0.62, 0.5];
  return (
    <div className="w-full max-w-[300px] mx-auto" style={{ transform: `scale(${0.9 + ease(between(p, 0, 0.3)) * 0.1})` }}>
      <MiniWindow label="Liza · Workspace" accent={PRIMARY} glow>
        <div className="flex gap-1 mb-2">
          {tabs.map((t, i) => {
            const a = between(p, 0.1 + i * 0.06, 0.25 + i * 0.06);
            return (
              <span
                key={t}
                className="text-[9px] font-bold px-1.5 py-1 rounded border"
                style={{
                  opacity: a,
                  color: i === 0 ? PRIMARY : MUTED,
                  borderColor: i === 0 ? PRIMARY + "55" : "hsl(var(--border))",
                  background: i === 0 ? PRIMARY + "12" : "transparent",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
        <div className="space-y-1.5">
          {lines.map((w, i) => {
            const a = between(p, 0.4 + i * 0.1, 0.7 + i * 0.1);
            return (
              <div key={i} className="h-1.5 rounded-full" style={{ width: `${ease(a) * w * 100}%`, background: PRIMARY + "33" }} />
            );
          })}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5" style={{ opacity: between(p, 0.78, 0.95) }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: PRIMARY }} />
          <p className="text-[10px] font-bold text-foreground/85">Output approved · standard inherited</p>
        </div>
      </MiniWindow>
    </div>
  );
}

/* 6. The loop — leadership <-> execution, traveling pulses */
function SceneLoop(p: number) {
  return (
    <div className="w-full max-w-[290px] mx-auto space-y-2 relative">
      <div style={{ opacity: between(p, 0, 0.25), transform: `translateY(${(1 - between(p, 0, 0.25)) * -8}px)` }}>
        <MiniWindow label="Leadership" accent={PRIMARY} glow>
          <p className="text-[11px] font-bold text-foreground/85 text-center">Mandate. Strategy. Standard.</p>
        </MiniWindow>
      </div>
      <div className="relative h-12 grid grid-cols-2 gap-3 px-6">
        <div className="relative flex items-center justify-end">
          <span className="text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground mr-1.5">Push down</span>
          <div className="relative w-4 h-12 rounded-full overflow-hidden" style={{ background: PRIMARY + "22" }}>
            <span
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                background: PRIMARY,
                boxShadow: `0 0 8px ${PRIMARY}`,
                top: `${between(p, 0.2, 0.6) * 100}%`,
                opacity: between(p, 0.2, 0.7),
              }}
            />
          </div>
        </div>
        <div className="relative flex items-center justify-start">
          <div className="relative w-4 h-12 rounded-full overflow-hidden" style={{ background: PRIMARY + "22" }}>
            <span
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                background: PRIMARY,
                boxShadow: `0 0 8px ${PRIMARY}`,
                top: `${(1 - between(p, 0.5, 0.9)) * 100}%`,
                opacity: between(p, 0.5, 0.95),
              }}
            />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground ml-1.5">Signal up</span>
        </div>
      </div>
      <div style={{ opacity: between(p, 0.3, 0.55), transform: `translateY(${(1 - between(p, 0.3, 0.55)) * 8}px)` }}>
        <MiniWindow label="Execution" accent={PRIMARY} glow>
          <p className="text-[11px] font-bold text-foreground/85 text-center">Workspace · records · AI tools.</p>
        </MiniWindow>
      </div>
    </div>
  );
}

/* ---------- scenes config ---------- */
const SCENES: Scene[] = [
  { kicker: "01 · The problem",    headline: "Same question. Different answers.", duration: 4200, render: SceneProblem },
  { kicker: "02 · The fix",        headline: "One Decision Standard.",            duration: 4200, render: SceneFix },
  { kicker: "03 · Your data",      headline: "Records stay. Liza connects.",      duration: 4400, render: SceneRecords },
  { kicker: "04 · Your AI tools",  headline: "Copilot and Claude align.",         duration: 4400, render: SceneTools },
  { kicker: "05 · Workspace",      headline: "Where governed work happens.",      duration: 4400, render: SceneWorkspace },
  { kicker: "06 · The loop",       headline: "Strategy meets execution. Live.",   duration: 4600, render: SceneLoop },
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

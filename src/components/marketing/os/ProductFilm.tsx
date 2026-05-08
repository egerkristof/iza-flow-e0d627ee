import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Database, Workflow, Sparkles, ShieldCheck, Compass, Network, FileText, Brain, AlertTriangle, Lock, GitBranch, Zap } from "lucide-react";

/* Cinematic product film for /os.
   A real movie about the architecture: each beat is a mini-scene with
   motion, connecting lines, conflict and resolution. Faster pacing,
   stronger visual storytelling than the architectural walkthrough below. */

type Visual =
  | "chaos"        // tools spitting conflicting answers
  | "rag-decay"    // RAG snapshot freezing while world moves on
  | "trapped"      // knowledge locked in people and silos
  | "forge"        // fragments converging into the Decision Standard
  | "broadcast"    // standard radiating into agents in workspace
  | "loop"         // strategy down, signal up
  | "aligned";     // every tool same answer, sharpening over time

type Beat = {
  duration: number; // ms
  caption: string;
  visual: Visual;
};

const BEATS: Beat[] = [
  { duration: 7000,  caption: "Every AI tool you bought answers from generic training data. Different tool, different answer.", visual: "chaos" },
  { duration: 8000,  caption: "RAG bolts on a snapshot. Documents freeze. Reality moves on. Your decision logic is not in there.", visual: "rag-decay" },
  { duration: 11000, caption: "Tools and docs are the tip. Your real standards live below the waterline: tacit logic, tribal know-how, decisions never written down.", visual: "trapped" },
  { duration: 12000, caption: "LIZA forges the Decision Standard. Fragments become a living knowledge graph. Nodes, relationships, governed logic.", visual: "forge" },
  { duration: 8000,  caption: "One workspace. Your AI agents execute inside, every action checked against the standard.", visual: "broadcast" },
  { duration: 8000,  caption: "Strategy pushes down. Signal flows up. Same week, not next quarter.", visual: "loop" },
  { duration: 8000,  caption: "Same answer in every tool. Standards that sharpen every week.", visual: "aligned" },
];

const TOTAL = BEATS.reduce((a, b) => a + b.duration, 0);

export function ProductFilm() {
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(performance.now());
  const accumRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    startRef.current = performance.now();
    const tick = () => {
      const t = accumRef.current + (performance.now() - startRef.current);
      setElapsed(t % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      accumRef.current = accumRef.current + (performance.now() - startRef.current);
    };
  }, [playing]);

  // Determine current beat
  let cum = 0;
  let beatIdx = 0;
  for (let i = 0; i < BEATS.length; i++) {
    if (elapsed < cum + BEATS[i].duration) { beatIdx = i; break; }
    cum += BEATS[i].duration;
  }
  const beat = BEATS[beatIdx];
  const progress = elapsed / TOTAL;

  const beatStart = (idx: number) => BEATS.slice(0, idx).reduce((a, b) => a + b.duration, 0);
  const seekTo = (ms: number) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, ms));
    accumRef.current = clamped;
    startRef.current = performance.now();
    setElapsed(clamped);
  };
  const goPrev = () => seekTo(beatStart(Math.max(0, beatIdx - 1)));
  const goNext = () => seekTo(beatStart(Math.min(BEATS.length - 1, beatIdx + 1)));
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekTo(ratio * TOTAL);
  };

  return (
    <div
      className="relative rounded-2xl border-2 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
        borderColor: "hsl(var(--primary) / 0.35)",
        boxShadow: "0 24px 60px -24px hsl(var(--primary) / 0.4)",
      }}
    >
      {/* Frame chrome */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b gap-2"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-green, var(--primary)) / 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.7)" }} />
          <span className="ml-2 sm:ml-3 text-[9px] sm:text-[10px] font-black tracking-[0.14em] sm:tracking-[0.18em] uppercase text-primary truncate">
            <span className="hidden sm:inline">LIZA · The architecture, in motion</span>
            <span className="sm:hidden">LIZA · The film</span>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous beat"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next beat"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative aspect-[4/5] sm:aspect-video bg-background">
        {/* Dot grid backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.3]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={beatIdx}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 pt-12 sm:pt-14 pb-24 sm:pb-20"
          >
            <BeatVisual visual={beat.visual} />
          </motion.div>
        </AnimatePresence>

        {/* Caption track */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={beatIdx + "-cap"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto rounded-xl px-3 sm:px-5 py-2.5 sm:py-3.5 backdrop-blur-md"
              style={{
                background: "hsl(var(--background) / 0.85)",
                border: "1px solid hsl(var(--primary) / 0.25)",
              }}
            >
              <p className="text-center text-[12px] sm:text-sm md:text-base font-bold text-foreground leading-snug">
                {beat.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scrubber */}
      <div
        className="relative h-2 bg-muted cursor-pointer group"
        onClick={handleScrub}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{
            width: `${progress * 100}%`,
            background: "var(--gradient-brand-btn, hsl(var(--primary)))",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-full flex pointer-events-none">
          {BEATS.map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r last:border-r-0"
              style={{ borderColor: "hsl(var(--background) / 0.6)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BeatVisual({ visual }: { visual: Beat["visual"] }) {
  const tone = "hsl(var(--primary))";
  const green = "hsl(var(--brand-green, var(--primary)))";
  const amber = "hsl(var(--brand-amber, var(--primary)))";
  switch (visual) {
    case "chaos":
      return (
        <div className="relative w-full max-w-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {[
              { name: "Copilot", ans: "Discount: 12%" },
              { name: "Claude", ans: "Discount: 8%" },
              { name: "Glean", ans: "Discount: 15%" },
              { name: "ChatGPT", ans: "Escalate" },
              { name: "Vendor RAG", ans: "Discount: 10%" },
              { name: "Internal bot", ans: "No policy" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 14, rotate: -2 + i * 0.6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="px-2.5 sm:px-3 py-2 rounded-lg border bg-card"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase">{t.name}</span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="text-[11px] sm:text-[13px] font-black mt-1 text-destructive"
                >
                  {t.ans}
                </motion.p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute -top-3 -right-2 sm:-right-4 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-destructive-foreground"
            style={{ background: "hsl(var(--destructive))" }}
          >
            <AlertTriangle className="w-3 h-3 inline mr-1" />Same question. Six answers.
          </motion.div>
        </div>
      );
    case "rag-decay":
      return (
        <div className="relative w-full max-w-xl flex flex-col items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-black uppercase tracking-widest"
            style={{ borderColor: "hsl(var(--border))", color: tone }}
          >
            RAG snapshot · indexed Mar 14
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-2 p-3 sm:p-4 w-full bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {["policy_v2.pdf", "pricing_2024.xlsx", "playbook_draft.docx"].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 py-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] sm:text-[12px] font-bold flex-1 truncate">{f}</span>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground"
                >
                  frozen
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="w-full flex items-center gap-2"
          >
            <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">meanwhile, reality</span>
            <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
          </motion.div>
          <div className="flex gap-2 flex-wrap justify-center">
            {["Pricing changed", "New regulation", "Customer churned", "Policy v3 drafted"].map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
                className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold border"
                style={{ borderColor: amber + "/0.5", background: amber + "/0.1", color: amber }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      );
    case "trapped":
      return <TrappedIceberg tone={tone} amber={amber} />;
    case "forge":
      return <ForgeKnowledgeGraph tone={tone} green={green} amber={amber} />;
    case "broadcast":
      return (
        <div className="relative w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border-2 p-3 sm:p-5 w-full"
            style={{
              background: green + "/0.08",
              borderColor: green + "/0.5",
            }}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Workflow className="w-4 h-4" style={{ color: green }} />
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: green }}>
                Workspace · live
              </span>
            </div>
            <p className="text-sm sm:text-base font-black mb-2 sm:mb-3">Workbook · Account renewal Q4</p>
            <div className="space-y-1.5">
              {[
                "Pricing rule v3.2 enforced",
                "Approval threshold checked",
                "Output cited Playbook PB-014",
              ].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.4 }}
                  className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.4, type: "spring", damping: 10 }}
                    style={{ color: green }}
                  >
                    ✓
                  </motion.span>
                  <span className="text-muted-foreground">{line}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Pulse from standard above */}
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
            style={{ background: tone, color: "hsl(var(--background))" }}
          >
            ↓ Standard enforced
          </motion.div>
        </div>
      );
    case "loop":
      return (
        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-xl border flex items-center gap-2 w-full justify-center"
            style={{ background: amber + "/0.1", borderColor: amber + "/0.5" }}
          >
            <Compass className="w-4 h-4" style={{ color: amber }} />
            <span className="font-black text-xs sm:text-sm">Leadership · sets direction</span>
          </motion.div>
          <div className="relative h-14 w-10">
            <motion.div
              animate={{ y: [-6, 14, -6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute left-1 top-0 text-lg font-black"
              style={{ color: amber }}
            >
              ↓
            </motion.div>
            <motion.div
              animate={{ y: [14, -6, 14] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute right-1 top-0 text-lg font-black"
              style={{ color: green }}
            >
              ↑
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-2 rounded-xl border-2 flex items-center gap-2 w-full justify-center"
            style={{ background: "hsl(var(--primary) / 0.08)", borderColor: tone }}
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-black text-xs sm:text-sm">Decision Standard · live</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-4 py-2 rounded-xl border flex items-center gap-2 w-full justify-center"
            style={{ background: green + "/0.1", borderColor: green + "/0.5" }}
          >
            <Zap className="w-4 h-4" style={{ color: green }} />
            <span className="font-black text-xs sm:text-sm">Workforce · returns signal</span>
          </motion.div>
        </div>
      );
    case "aligned":
      return (
        <div className="w-full max-w-2xl flex flex-col items-center gap-3 sm:gap-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
            {["Copilot", "Claude", "Glean"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="rounded-xl border-2 p-2.5 sm:p-4 text-center"
                style={{ background: "hsl(var(--primary) / 0.06)", borderColor: tone + "/0.45" }}
              >
                <p className="text-[9px] sm:text-[10px] font-black tracking-[0.22em] uppercase text-primary mb-1">{t}</p>
                <p className="text-[11px] sm:text-[13px] font-black leading-tight">Same answer.</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">cited PB-014 · v3.2</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: green + "/0.1", borderColor: green + "/0.5", color: green }}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">v3.2 → v3.3 → v3.4 · sharpening weekly</span>
          </motion.div>
        </div>
      );
  }
}

/* ----------------------------- Forge: simple knowledge graph ----------------------------- */

function ForgeKnowledgeGraph({ tone, green, amber }: { tone: string; green: string; amber: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      setT(performance.now() - start);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 4 satellites around 1 core. Positions in % of a 320x220 box.
  const cx = 50;
  const cy = 50;
  const satellites = [
    { id: "policy", label: "Policy", angle: -90, appear: 600, color: amber, edge: "enforces" },
    { id: "pricing", label: "Pricing", angle: 0, appear: 1100, color: tone, edge: "uses" },
    { id: "playbook", label: "Playbook", angle: 90, appear: 1600, color: green, edge: "executes" },
    { id: "risk", label: "Risk", angle: 180, appear: 2100, color: "hsl(var(--destructive))", edge: "guards" },
  ];
  const r = 32; // radius in viewBox %

  return (
    <div className="relative w-full max-w-md aspect-[4/3] mx-auto">
      <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="coreGlow2">
            <stop offset="0%" stopColor={`hsl(${tone} / 0.35)`} />
            <stop offset="100%" stopColor={`hsl(${tone} / 0)`} />
          </radialGradient>
        </defs>
        {/* glow */}
        <ellipse cx={cx} cy={cy * 0.75} rx={18} ry={14} fill="url(#coreGlow2)">
          <animate attributeName="rx" values="16;20;16" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* edges */}
        {satellites.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const sx = cx + Math.cos(rad) * r;
          const sy = cy * 0.75 + Math.sin(rad) * r * 0.7;
          const visible = t > s.appear;
          const progress = Math.min(1, Math.max(0, (t - s.appear) / 500));
          const x2 = cx + (sx - cx) * progress;
          const y2 = cy * 0.75 + (sy - cy * 0.75) * progress;
          return (
            <g key={"e" + i} opacity={visible ? 1 : 0}>
              <line
                x1={cx}
                y1={cy * 0.75}
                x2={x2}
                y2={y2}
                stroke={s.color}
                strokeOpacity={0.55}
                strokeWidth={0.5}
                strokeLinecap="round"
              />
              {progress >= 1 && (
                <circle r={0.7} fill={s.color}>
                  <animateMotion
                    dur="2.5s"
                    repeatCount="indefinite"
                    path={`M ${cx} ${cy * 0.75} L ${sx} ${sy}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Core node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 12 }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "50%", top: "50%" }}
      >
        <div
          className="rounded-xl border-2 px-3.5 py-2 bg-card text-center whitespace-nowrap"
          style={{
            borderColor: tone,
            background: `hsl(${tone} / 0.08)`,
            boxShadow: `0 16px 36px -12px ${tone}`,
          }}
        >
          <div className="flex items-center gap-1.5 justify-center">
            <Network className="w-3.5 h-3.5" style={{ color: tone }} />
            <span className="text-[10px] sm:text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: tone }}>
              Decision Standard
            </span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-muted-foreground font-bold mt-0.5">v3.2 · governed</div>
        </div>
      </motion.div>

      {/* Satellite nodes */}
      {satellites.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const sx = 50 + Math.cos(rad) * 32;
        const sy = 50 + Math.sin(rad) * 32;
        const visible = t > s.appear + 200;
        return (
          <motion.div
            key={s.id}
            initial={false}
            animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, type: "spring", damping: 14 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${sx}%`, top: `${sy}%` }}
          >
            <div
              className="rounded-lg border px-2.5 py-1 bg-card whitespace-nowrap"
              style={{
                borderColor: s.color,
                boxShadow: `0 6px 16px -6px ${s.color}`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color }}
                />
                <span
                  className="text-[9px] sm:text-[10px] font-black tracking-[0.16em] uppercase"
                  style={{ color: s.color }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function TrappedIceberg({ tone, amber }: { tone: string; amber: string }) {
  const above = [
    { t: "RAG index", icon: Database },
    { t: "Wiki / SharePoint", icon: FileText },
    { t: "Vendor copilots", icon: Sparkles },
  ];
  const below = [
    "Pricing exceptions never written down",
    "How deals actually get approved",
    "Risk thresholds carried in senior heads",
    "Why last quarter's playbook changed",
    "Customer-specific tone and red lines",
    "Trade-offs behind every \"it depends\"",
    "Edge cases solved once, then forgotten",
    "Decision rationale lost in Slack threads",
  ];
  return (
    <div className="relative w-full max-w-2xl mx-auto h-full max-h-[460px]">
      {/* Waterline */}
      <div className="absolute left-0 right-0 top-[34%] h-px" style={{ background: "hsl(var(--border))" }} />
      <div className="absolute left-2 top-[34%] -translate-y-1/2 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded" style={{ background: "hsl(var(--background))", color: "hsl(var(--muted-foreground))" }}>
        Waterline
      </div>

      {/* Iceberg shape */}
      <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ice-above" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--card))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--card))" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="ice-below" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone} stopOpacity="0.10" />
            <stop offset="100%" stopColor={tone} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* tip */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          points="42,4 58,4 64,25.5 36,25.5"
          fill="url(#ice-above)"
          stroke="hsl(var(--border))"
          strokeWidth="0.4"
        />
        {/* mass below */}
        <motion.polygon
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          points="36,25.5 64,25.5 86,46 78,66 50,72 22,66 14,46"
          fill="url(#ice-below)"
          stroke={tone}
          strokeOpacity="0.35"
          strokeWidth="0.4"
          strokeDasharray="1.2 0.8"
        />
      </svg>

      {/* Above water labels */}
      <div className="absolute top-[2%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <span className="text-[8px] sm:text-[9px] font-black tracking-[0.22em] uppercase text-muted-foreground">What AI sees</span>
        <div className="flex gap-1.5 sm:gap-2">
          {above.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.t}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="px-1.5 py-1 rounded border bg-card flex items-center gap-1"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <Icon className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[8px] sm:text-[9px] font-bold">{it.t}</span>
                <Lock className="w-2 h-2" style={{ color: amber }} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Below water labels */}
      <div className="absolute inset-x-0 top-[40%] bottom-[2%] flex flex-col items-center gap-1 sm:gap-1.5 z-10 px-4">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[8px] sm:text-[9px] font-black tracking-[0.22em] uppercase"
          style={{ color: tone }}
        >
          What runs your business
        </motion.span>
        <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1 w-full max-w-md">
          {below.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: i % 2 === 0 ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.12 }}
              className="flex items-start gap-1 text-[8.5px] sm:text-[10px] leading-tight"
            >
              <span className="mt-0.5" style={{ color: tone }}>•</span>
              <span className="font-semibold text-muted-foreground">{line}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
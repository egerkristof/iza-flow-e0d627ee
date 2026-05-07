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
  { duration: 8000,  caption: "Your real standards stay trapped in records, threads and senior heads. Not retrievable text. Human knowledge.", visual: "trapped" },
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
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pb-24 sm:pb-20"
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
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl">
          {[
            { t: "SharePoint", icon: Database },
            { t: "Salesforce", icon: Database },
            { t: "ELN records", icon: Database },
            { t: "ERP exports", icon: Database },
            { t: "Email threads", icon: FileText },
            { t: "Senior heads", icon: Brain },
          ].map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.t}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="relative px-2.5 sm:px-3 py-2 sm:py-3 rounded-lg border bg-card flex items-center gap-1.5 sm:gap-2 overflow-hidden"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                <span className="text-[10px] sm:text-[12px] font-bold truncate flex-1">{it.t}</span>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  <Lock className="w-3 h-3" style={{ color: amber }} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      );
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

/* ----------------------------- Forge: Knowledge Graph ----------------------------- */

type GNode = {
  id: string;
  label: string;
  sub?: string;
  x: number; // 0-100 viewBox %
  y: number;
  cluster: "policy" | "pricing" | "approval" | "risk" | "tone" | "playbook";
  appear: number; // ms within scene
};

type GEdge = { from: string; to: string; label?: string; appear: number };

const CLUSTER_COLOR: Record<GNode["cluster"], string> = {
  policy: "var(--brand-amber, var(--primary))",
  pricing: "var(--primary)",
  approval: "var(--brand-green, var(--primary))",
  risk: "var(--destructive)",
  tone: "var(--primary)",
  playbook: "var(--brand-green, var(--primary))",
};

const NODES: GNode[] = [
  { id: "core", label: "Decision Standard", sub: "v3.2 · governed", x: 50, y: 50, cluster: "policy", appear: 0 },

  // Policy cluster (top-left)
  { id: "pol", label: "Policy", sub: "POL-007", x: 22, y: 18, cluster: "policy", appear: 600 },
  { id: "reg", label: "Regulation", sub: "EU AI Act", x: 8, y: 32, cluster: "policy", appear: 900 },

  // Pricing cluster (top-right)
  { id: "pri", label: "Pricing rule", sub: "v3.2", x: 78, y: 18, cluster: "pricing", appear: 1200 },
  { id: "disc", label: "Discount tier", sub: "Tier B", x: 92, y: 32, cluster: "pricing", appear: 1500 },

  // Approval cluster (right)
  { id: "apr", label: "Approval", sub: "≥ €50k", x: 90, y: 60, cluster: "approval", appear: 1800 },
  { id: "thr", label: "Threshold", sub: "auto", x: 84, y: 78, cluster: "approval", appear: 2100 },

  // Playbook cluster (bottom)
  { id: "pb", label: "Playbook", sub: "PB-014", x: 50, y: 86, cluster: "playbook", appear: 2400 },
  { id: "step", label: "Step library", sub: "12 steps", x: 32, y: 82, cluster: "playbook", appear: 2700 },

  // Risk cluster (left)
  { id: "risk", label: "Risk control", sub: "RC-03", x: 10, y: 60, cluster: "risk", appear: 3000 },
  { id: "esc", label: "Escalation", sub: "L2 · 4h", x: 18, y: 76, cluster: "risk", appear: 3300 },

  // Tone cluster (top center)
  { id: "tone", label: "Tone of voice", sub: "Formal", x: 50, y: 12, cluster: "tone", appear: 3600 },
];

const EDGES: GEdge[] = [
  { from: "core", to: "pol", label: "enforces", appear: 700 },
  { from: "pol", to: "reg", label: "derived from", appear: 1000 },
  { from: "core", to: "pri", label: "enforces", appear: 1300 },
  { from: "pri", to: "disc", label: "uses", appear: 1600 },
  { from: "core", to: "apr", label: "requires", appear: 1900 },
  { from: "apr", to: "thr", label: "checks", appear: 2200 },
  { from: "core", to: "pb", label: "executes", appear: 2500 },
  { from: "pb", to: "step", label: "contains", appear: 2800 },
  { from: "core", to: "risk", label: "guards", appear: 3100 },
  { from: "risk", to: "esc", label: "triggers", appear: 3400 },
  { from: "core", to: "tone", label: "applies", appear: 3700 },
  // Cross-links to show graph density
  { from: "pri", to: "apr", label: "gates", appear: 4000 },
  { from: "pol", to: "pb", label: "constrains", appear: 4200 },
  { from: "risk", to: "apr", label: "raises", appear: 4400 },
];

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

  const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ background: `hsl(${tone} / 0.1)`, color: tone, border: `1px solid hsl(${tone} / 0.4)` }}
        >
          LIZA · forging the standard
        </motion.span>
      </div>

      <div className="relative w-full" style={{ aspectRatio: "16 / 10", maxHeight: "100%" }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="coreGlow">
              <stop offset="0%" stopColor={`hsl(${tone} / 0.35)`} />
              <stop offset="100%" stopColor={`hsl(${tone} / 0)`} />
            </radialGradient>
          </defs>
          {/* core glow */}
          <circle cx={50} cy={50} r={22} fill="url(#coreGlow)">
            <animate attributeName="r" values="20;24;20" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Edges */}
          {EDGES.map((e, i) => {
            const a = nodeById(e.from);
            const b = nodeById(e.to);
            const visible = t > e.appear;
            const progress = Math.min(1, Math.max(0, (t - e.appear) / 600));
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const x2 = a.x + dx * progress;
            const y2 = a.y + dy * progress;
            const stroke = e.from === "core" ? `hsl(${tone} / 0.6)` : `hsl(var(--foreground) / 0.18)`;
            return (
              <g key={i} opacity={visible ? 1 : 0}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={e.from === "core" ? 0.35 : 0.2}
                  strokeLinecap="round"
                />
                {/* Pulse along edge from core */}
                {e.from === "core" && progress >= 1 && (
                  <circle r={0.6} fill={`hsl(${tone})`}>
                    <animateMotion dur="2.5s" repeatCount="indefinite" path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
                  </circle>
                )}
                {e.label && progress >= 1 && (
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 0.6}
                    fontSize={1.6}
                    fill={`hsl(var(--muted-foreground))`}
                    textAnchor="middle"
                    style={{ fontWeight: 700, letterSpacing: 0.1 }}
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes (HTML overlay for crisp text) */}
        {NODES.map((n) => {
          const visible = t > n.appear;
          const isCore = n.id === "core";
          const color = `hsl(${CLUSTER_COLOR[n.cluster]})`;
          return (
            <motion.div
              key={n.id}
              initial={false}
              animate={
                visible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{ duration: 0.4, type: "spring", damping: 14 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div
                className={`rounded-lg border ${isCore ? "border-2 px-3 py-2" : "px-2 py-1"} bg-card text-center whitespace-nowrap`}
                style={{
                  borderColor: color,
                  background: isCore ? `hsl(${CLUSTER_COLOR[n.cluster]} / 0.12)` : "hsl(var(--card))",
                  boxShadow: isCore
                    ? `0 12px 30px -10px ${color}`
                    : `0 4px 10px -4px ${color}`,
                }}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <span
                    className="inline-block rounded-full"
                    style={{ width: isCore ? 6 : 4, height: isCore ? 6 : 4, background: color }}
                  />
                  <span
                    className={`font-black tracking-wider uppercase ${isCore ? "text-[10px] sm:text-[11px]" : "text-[8px] sm:text-[9px]"}`}
                    style={{ color }}
                  >
                    {n.label}
                  </span>
                </div>
                {n.sub && (
                  <div className={`text-muted-foreground font-bold mt-0.5 ${isCore ? "text-[9px] sm:text-[10px]" : "text-[7px] sm:text-[8px]"}`}>
                    {n.sub}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom legend / counters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: t > 4500 ? 1 : 0, y: t > 4500 ? 0 : 8 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 px-3 py-1.5 rounded-full backdrop-blur-md"
        style={{ background: "hsl(var(--background) / 0.85)", border: "1px solid hsl(var(--border))" }}
      >
        <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest" style={{ color: tone }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: tone }} />
          {NODES.length} nodes
        </span>
        <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="inline-block w-3 h-px" style={{ background: "hsl(var(--muted-foreground))" }} />
          {EDGES.length} relationships
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color: green }}>
          <GitBranch className="w-3 h-3" />
          versioned
        </span>
      </motion.div>
    </div>
  );
}
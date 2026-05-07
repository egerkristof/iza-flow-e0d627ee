import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Database, Workflow, Sparkles, ShieldCheck, Compass, Network } from "lucide-react";

/* 90-second autoplaying product film for /os.
   Visual sequence (no external video file): 6 captioned beats that build the
   architecture as the user watches. Plays muted by default with captions,
   click to unmute (audio hook left for later TTS integration). */

type Beat = {
  duration: number; // ms
  caption: string;
  visual: "tools" | "records" | "core" | "workspace" | "leadership" | "result";
};

const BEATS: Beat[] = [
  { duration: 14000, caption: "Every AI tool you bought answers from generic training data.", visual: "tools" },
  { duration: 14000, caption: "Your standards exist. They are trapped in records, docs, senior interviews.", visual: "records" },
  { duration: 16000, caption: "LIZA writes the Decision Standard. Versioned, owned, governed.", visual: "core" },
  { duration: 15000, caption: "One workspace. Your AI agents run inside, against the standard.", visual: "workspace" },
  { duration: 15000, caption: "Strategy pushes down. Signal flows up. Same week, not next quarter.", visual: "leadership" },
  { duration: 16000, caption: "Same answer in every tool. Standards that sharpen every week.", visual: "result" },
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
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-green, var(--primary)) / 0.7)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.7)" }} />
          <span className="ml-3 text-[10px] font-black tracking-[0.18em] uppercase text-primary">
            LIZA · 90-second product film
          </span>
        </div>
        <div className="flex items-center gap-3">
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
      <div className="relative aspect-video bg-background">
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
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <BeatVisual visual={beat.visual} />
          </motion.div>
        </AnimatePresence>

        {/* Caption track */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={beatIdx + "-cap"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto rounded-xl px-5 py-3.5 backdrop-blur-md"
              style={{
                background: "hsl(var(--background) / 0.85)",
                border: "1px solid hsl(var(--primary) / 0.25)",
              }}
            >
              <p className="text-center text-sm md:text-base font-bold text-foreground leading-snug">
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
  switch (visual) {
    case "tools":
      return (
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
          {["Copilot", "Claude", "Glean", "ChatGPT", "Vendor RAG"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="px-4 py-3 rounded-lg border bg-card flex items-center gap-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold">{t}</span>
            </motion.div>
          ))}
        </div>
      );
    case "records":
      return (
        <div className="grid grid-cols-3 gap-3 max-w-2xl">
          {["SharePoint", "Salesforce", "ELN", "ERP", "Email", "Senior interviews"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="px-3 py-3 rounded-lg border bg-card flex items-center gap-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-[12px] font-bold">{t}</span>
            </motion.div>
          ))}
        </div>
      );
    case "core":
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="rounded-2xl border-2 p-8 max-w-md text-center"
          style={{
            background: "hsl(var(--primary) / 0.08)",
            borderColor: tone,
            boxShadow: `0 24px 50px -20px ${tone}`,
          }}
        >
          <Network className="w-10 h-10 mx-auto mb-3" style={{ color: tone }} />
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-1.5" style={{ color: tone }}>
            The Decision Standard
          </p>
          <p className="text-base font-black text-foreground leading-tight">
            Mandates · Playbooks · Decision logic
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">Versioned. Owned. Governed.</p>
        </motion.div>
      );
    case "workspace":
      return (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border-2 p-6 max-w-xl w-full"
          style={{
            background: "hsl(var(--brand-green, var(--primary)) / 0.08)",
            borderColor: "hsl(var(--brand-green, var(--primary)) / 0.5)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Workflow className="w-5 h-5" style={{ color: "hsl(var(--brand-green, var(--primary)))" }} />
            <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "hsl(var(--brand-green, var(--primary)))" }}>
              Where work happens
            </span>
          </div>
          <p className="text-base font-black mb-2">Workbook · Account renewal Q4</p>
          <ul className="space-y-1.5 text-[12px] text-muted-foreground">
            <li>✓ Pricing rule v3.2 enforced</li>
            <li>✓ Approval threshold checked</li>
            <li>✓ Output cited Playbook PB-014</li>
          </ul>
        </motion.div>
      );
    case "leadership":
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="px-5 py-3 rounded-xl border flex items-center gap-2"
            style={{
              background: "hsl(var(--brand-amber, var(--primary)) / 0.1)",
              borderColor: "hsl(var(--brand-amber, var(--primary)) / 0.5)",
            }}
          >
            <Compass className="w-4 h-4" style={{ color: "hsl(var(--brand-amber, var(--primary)))" }} />
            <span className="font-black text-sm">Leadership view</span>
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
            style={{ color: tone }}
          >
            ⇅
          </motion.div>
          <div
            className="px-5 py-3 rounded-xl border flex items-center gap-2"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              borderColor: "hsl(var(--primary) / 0.5)",
            }}
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-black text-sm">Decision Standard</span>
          </div>
        </motion.div>
      );
    case "result":
      return (
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          {["Copilot", "Claude", "Glean"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border-2 p-4 text-center"
              style={{
                background: "hsl(var(--primary) / 0.06)",
                borderColor: "hsl(var(--primary) / 0.4)",
              }}
            >
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-primary mb-1.5">{t}</p>
              <p className="text-[13px] font-black leading-tight">Same answer.</p>
              <p className="text-[10px] text-muted-foreground mt-1">cited PB-014 · v3.2</p>
            </motion.div>
          ))}
        </div>
      );
  }
}
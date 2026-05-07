import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, Compass, Database, Sparkles, Workflow,
  ArrowDown, ArrowUp, ArrowRight, ChevronLeft, ChevronRight, Cloud, Mail, FileSpreadsheet, Bot, Search,
  Plus, Minus,
} from "lucide-react";

/* Mobile-only "Stories" walkthrough of the Liza architecture.
   Renders 6 swipe-snap screens, each animating on view. */

type Screen = {
  kicker: string;
  title: string;
  sub: string;
  exampleLabel: string;
  example: string;
  visual: (active: boolean) => JSX.Element;
};

const PRIMARY = "hsl(var(--primary))";
const MUTED = "hsl(var(--muted-foreground))";
const GREEN = "hsl(var(--brand-green, var(--primary)))";

function MiniWindow({
  label, accent, children, glow = false,
}: { label: string; accent: string; children: React.ReactNode; glow?: boolean }) {
  return (
    <div
      className="rounded-xl border overflow-hidden w-full"
      style={{
        background: glow ? `${accent.replace("hsl(", "hsla(").replace(")", ", 0.06)")}` : "hsl(var(--background))",
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

function IconChip({ icon, label, accent }: { icon: React.ReactNode; label: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border"
      style={{ background: "hsl(var(--background))", borderColor: accent + "33" }}
    >
      <span style={{ color: accent }}>{icon}</span>
      <span className="text-[10.5px] font-bold text-foreground/85 truncate">{label}</span>
    </div>
  );
}

/* ---------- Per-screen visuals ---------- */

function VisualProblem({ active }: { active: boolean }) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", damping: 14, stiffness: 140 }}
        className="rounded-2xl border-2 p-4"
        style={{ borderColor: "hsl(0 70% 55% / 0.4)", background: "hsl(0 70% 55% / 0.05)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4" style={{ color: "hsl(0 70% 55%)" }} />
          <span className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: "hsl(0 70% 55%)" }}>
            Today
          </span>
        </div>
        <div className="space-y-1.5">
          {["Copilot answers from generic data", "Claude invents its own logic", "Every team gets a different reply"].map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={active ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
              className="flex items-center gap-2 text-[11px] text-foreground/80"
            >
              <span className="w-1 h-1 rounded-full" style={{ background: "hsl(0 70% 55%)" }} />
              {line}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function VisualFix({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", damping: 14 }}
      className="w-full max-w-[280px] mx-auto"
    >
      <MiniWindow label="Liza · Decision Standard" accent={PRIMARY} glow>
        <div className="flex items-start gap-2">
          <span
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: PRIMARY + "1a", color: PRIMARY, border: `1px solid ${PRIMARY}33` }}
          >
            <Compass className="w-4 h-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-black text-foreground leading-tight">How your company decides.</p>
            <p className="text-[10.5px] text-muted-foreground mt-1 leading-snug">
              Mandates, playbooks, policy. Versioned. Owned by leadership.
            </p>
          </div>
        </div>
        <div className="mt-2.5 space-y-1">
          {[0.95, 0.7, 0.45].map((w, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={active ? { width: `${w * 100}%` } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
              className="h-1.5 rounded-full"
              style={{ background: PRIMARY + "33" }}
            />
          ))}
        </div>
      </MiniWindow>
    </motion.div>
  );
}

function VisualRecords({ active }: { active: boolean }) {
  const items = [
    { label: "Drive / SharePoint", icon: <Cloud className="w-3.5 h-3.5" /> },
    { label: "Databases", icon: <Database className="w-3.5 h-3.5" /> },
    { label: "Documents", icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { label: "Email & chat", icon: <Mail className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto space-y-2.5">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, x: -16 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.1, type: "spring", damping: 16 }}
        >
          <IconChip icon={it.icon} label={it.label} accent={MUTED} />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 0.55 }}
        className="flex items-center justify-center pt-1"
      >
        <ArrowDown className="w-4 h-4" style={{ color: PRIMARY }} />
        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Read in. Write back.
        </span>
      </motion.div>
    </div>
  );
}

function VisualTools({ active }: { active: boolean }) {
  const items = [
    { label: "Microsoft Copilot", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: "Glean", icon: <Search className="w-3.5 h-3.5" /> },
    { label: "Claude / ChatGPT", icon: <Bot className="w-3.5 h-3.5" /> },
    { label: "Vendor RAG", icon: <Bot className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[290px] mx-auto">
      <div className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={active ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.08, type: "spring", damping: 14 }}
          >
            <IconChip icon={it.icon} label={it.label} accent={MUTED} />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center pt-3 gap-1.5"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Now answer in your standard
        </span>
      </motion.div>
    </div>
  );
}

function VisualWorkspace({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", damping: 14 }}
      className="w-full max-w-[300px] mx-auto"
    >
      <MiniWindow label="Liza · Workspace" accent={PRIMARY} glow>
        <div className="flex gap-1 mb-2 overflow-hidden">
          {["Workbook", "Agents", "Capture", "Oversight"].map((tab, i) => (
            <motion.span
              key={tab}
              initial={{ opacity: 0, y: -4 }}
              animate={active ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="text-[9px] font-bold px-1.5 py-1 rounded border"
              style={{
                color: i === 0 ? PRIMARY : MUTED,
                borderColor: i === 0 ? PRIMARY + "55" : "hsl(var(--border))",
                background: i === 0 ? PRIMARY + "12" : "transparent",
              }}
            >
              {tab}
            </motion.span>
          ))}
        </div>
        <div className="space-y-1.5">
          {[0.95, 0.78, 0.62, 0.5].map((w, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={active ? { width: `${w * 100}%` } : {}}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="h-1.5 rounded-full"
              style={{ background: PRIMARY + "26" }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-2.5 text-[10px] text-muted-foreground"
        >
          Every output inherits the standard.
        </motion.div>
      </MiniWindow>
    </motion.div>
  );
}

function VisualLoop({ active }: { active: boolean }) {
  return (
    <div className="w-full max-w-[290px] mx-auto space-y-2">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, type: "spring", damping: 16 }}
      >
        <MiniWindow label="Leadership" accent={PRIMARY} glow>
          <p className="text-[11px] font-bold text-foreground/85 leading-snug">
            Mandates. Playbooks. Strategy.
          </p>
        </MiniWindow>
      </motion.div>
      <div className="relative h-9 grid grid-cols-2 gap-3 px-6">
        <div className="flex items-center justify-end gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Push down</span>
          <ArrowDown className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
        </div>
        <div className="flex items-center justify-start gap-1.5">
          <ArrowUp className="w-3.5 h-3.5" style={{ color: GREEN }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Flow up</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, type: "spring", damping: 16 }}
      >
        <MiniWindow label="Execution" accent={GREEN} glow>
          <p className="text-[11px] font-bold text-foreground/85 leading-snug">
            Workspace, records, AI tools. Live signal.
          </p>
        </MiniWindow>
      </motion.div>
    </div>
  );
}

/* ---------- Screens config ---------- */

const SCREENS: Screen[] = [
  {
    kicker: "The problem",
    title: "Your AI runs without a standard.",
    sub: "Copilot, Claude, every vendor agent — each one invents its own logic from generic training data. Same question, three answers, zero accountability.",
    exampleLabel: "What this looks like",
    example: "Sales asks Copilot for the discount policy. It guesses. Legal asks Claude. It guesses differently. Neither matches what leadership actually approved last quarter.",
    visual: (a) => <VisualProblem active={a} />,
  },
  {
    kicker: "The fix",
    title: "One Decision Standard, owned by you.",
    sub: "Liza turns your mandates, playbooks and policies into machine-readable logic. Versioned. Auditable. The single source AI must obey.",
    exampleLabel: "What gets encoded",
    example: "Pricing rules. Approval thresholds. Risk appetite. Tone of voice. Compliance constraints. Anything you'd put in a leadership memo — now enforceable across every AI tool.",
    visual: (a) => <VisualFix active={a} />,
  },
  {
    kicker: "Your data stays put",
    title: "Liza connects, never replaces.",
    sub: "Your records — SharePoint, Veeva, Salesforce, your databases — stay where they are. Liza reads context in and writes governed outputs back.",
    exampleLabel: "How it plugs in",
    example: "Read-only by default. Write access scoped to the standard. Zero migration. Zero lock-in. Your IT team approves every connector.",
    visual: (a) => <VisualRecords active={a} />,
  },
  {
    kicker: "Your AI tools",
    title: "Copilot and Claude finally agree.",
    sub: "The AI tools your teams already use stop inventing. They read your standard before answering. One enterprise truth, every surface.",
    exampleLabel: "Tools that inherit",
    example: "Microsoft Copilot. Glean. Claude. ChatGPT Enterprise. Vendor RAG. In-house agents. If it accepts context, Liza governs it.",
    visual: (a) => <VisualTools active={a} />,
  },
  {
    kicker: "Where work happens",
    title: "The Liza Workspace.",
    sub: "Workbooks, agents, capture and oversight — built for high-stakes execution. Every output inherits the standard automatically.",
    exampleLabel: "What teams do here",
    example: "Draft a regulatory submission. Run a deviation investigation. Write a credit memo. Triage RFIs. Each task pulls the right standard, the right data, the right tone.",
    visual: (a) => <VisualWorkspace active={a} />,
  },
  {
    kicker: "The loop closes",
    title: "Strategy meets execution. Live.",
    sub: "Leadership pushes the standard down. Execution signal flows back up. The standard improves with every decision — your operating system, compounding.",
    exampleLabel: "What changes for leadership",
    example: "You see where the standard is followed, where it's bent, and where it's missing. You update once. Every team, every tool, every workflow updates with you.",
    visual: (a) => <VisualLoop active={a} />,
  },
];

export function ArchitectureWalkthrough() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track active screen via scroll position
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const i = Math.round(el.scrollLeft / w);
        setIndex(Math.max(0, Math.min(SCREENS.length - 1, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-6 px-6 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {SCREENS.map((s, i) => (
          <div
            key={s.title}
            className="snap-center shrink-0 w-full pr-3 last:pr-0"
            style={{ flex: "0 0 100%" }}
          >
            <ScreenCard screen={s} index={i} active={index === i} total={SCREENS.length} isLast={i === SCREENS.length - 1} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
          className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 transition-opacity"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {SCREENS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to screen ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 18 : 6,
                background: i === index ? PRIMARY : "hsl(var(--border))",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(Math.min(SCREENS.length - 1, index + 1))}
          disabled={index === SCREENS.length - 1}
          className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-30 transition-opacity"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ScreenCard({
  screen, index, active, total, isLast,
}: { screen: Screen; index: number; active: boolean; total: number; isLast: boolean }) {
  return (
    <div
      className="relative rounded-2xl border p-5 min-h-[460px] flex flex-col overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        boxShadow: "0 12px 30px -22px hsl(var(--foreground) / 0.25)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.05) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: PRIMARY }}>
          {screen.kicker}
        </span>
        <span className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={`copy-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10"
          >
            <h3 className="text-[22px] font-black leading-[1.15] tracking-tight text-foreground">
              {screen.title}
            </h3>
            <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{screen.sub}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-5">
        {screen.visual(active)}
      </div>

      {/* Final CTA */}
      {isLast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex justify-center"
        >
          <Link
            to="/diagnostic"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold w-full justify-center"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Score your AI execution
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
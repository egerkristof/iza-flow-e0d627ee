import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, FileSpreadsheet, Mail, MessagesSquare, Cloud,
  Network, ShieldCheck, GitBranch, History, KeySquare,
  Workflow, Eye, Layers as LayersIcon, BookOpen,
  Bot, Sparkles, Search, FileCheck2, Plus, Cpu, ArrowLeftRight,
  Boxes, RefreshCw, Compass, Radar, Target, LineChart, ArrowDown, ArrowUp,
  ChevronRight, ChevronDown, ArrowRight, ArrowLeft, TrendingUp, X, Monitor,
} from "lucide-react";
import { Link } from "react-router-dom";
import { INDUSTRIES, INDUSTRY_BY_KEY, type IndustryKey, type IndustryLexicon, type Kpi } from "./industryLexicon";
import { GuidedTour, PlayTourButton } from "./GuidedTour";
import { Play } from "lucide-react";
import { toast } from "sonner";

/* ---------- types ---------- */
type Tone = "data" | "core" | "native" | "apps" | "fabric" | "graph-sys" | "graph-art" | "strategy";
type Item = { label: string; icon: React.ReactNode; tag?: string; detail: string };
type Layer = {
  id: string;
  kicker: string;
  title: string;
  sub: string;
  expanded: string;
  tone: Tone;
  items: Item[];
};

/* ---------- data ---------- */

/* CENTER — Native Surfaces. Where work actually happens. */
const NATIVE_SURFACES: Layer = {
  id: "native",
  kicker: "Center — where work happens",
  title: "Where work happens",
  sub: "One workspace for guided work, knowledge capture, and live oversight. Your AI agents run inside, against the right governed standard.",
  expanded: "This is where the work moves to. Teams stop bouncing between vendor chats, wikis, and trackers. Every action runs against the Decision Standard, and every output is kept in sync across the systems where it lives.",
  tone: "native",
  items: [
    { label: "Guided work", icon: <Workflow className="w-4 h-4" />, tag: "Do", detail: "The room where teams execute. Each Workbook hosts your AI agents, all reading the governed bundle that matches the job." },
    { label: "AI agents inside", icon: <Bot className="w-4 h-4" />, tag: "Inside", detail: "ChatGPT, Claude, and custom agents run inside the workspace. They never see raw context, only the bundle that fits the task." },
    { label: "Knowledge capture", icon: <Sparkles className="w-4 h-4" />, tag: "Capture", detail: "Pulls tacit judgment out of process docs, transcripts, and senior interviews. Expertise that was never written down becomes a structured asset." },
    { label: "Live oversight", icon: <Eye className="w-4 h-4" />, tag: "Govern", detail: "See what teams execute, where drift happens, what needs re-encoding. The control surface for the standard." },
  ],
};

/* LEFT — Source Systems. Bidirectional. */
const SOURCE_SYSTEMS: Layer = {
  id: "data",
  kicker: "Left — systems of record",
  title: "Your systems of record",
  sub: "The estate you already own. Read in for context. Governed updates written back so the canonical record stays current.",
  expanded: "Liza does not replace your systems of record. It pulls context in, structures the judgment that lives across them, and pushes governed outputs and artifact updates back. Your standards become portable. Your data does not move homes.",
  tone: "data",
  items: [
    { label: "Drive / SharePoint", icon: <Cloud className="w-4 h-4" />, detail: "Document estate read in for context, with governed updates written back so the canonical doc stays current." },
    { label: "Databases", icon: <Database className="w-4 h-4" />, detail: "Operational and analytical data feeds context. Outputs from Workbooks can be written back as records." },
    { label: "Documents", icon: <FileSpreadsheet className="w-4 h-4" />, detail: "Process docs, SOPs, decks, models. Read for extraction; updated when the artifact graph changes." },
    { label: "Email & chat", icon: <Mail className="w-4 h-4" />, detail: "Where decisions actually happen. Captured, so judgment is recovered, not lost." },
    { label: "Senior interviews", icon: <MessagesSquare className="w-4 h-4" />, detail: "The tacit layer. The thinking your best people never wrote down, externalised before they leave." },
  ],
};

/* RIGHT — Connected Tools. Bidirectional. */
const CONNECTED_TOOLS: Layer = {
  id: "apps",
  kicker: "Right — your AI tools",
  title: "Your AI tools",
  sub: "Copilot, Glean, vendor RAG, ChatGPT. Connected so they answer in your standards instead of generic training data.",
  expanded: "These tools each invent answers from generic training data today. Connect them and they read your standards, mandates, and the artifact graph. When something changes in the core, it propagates outward; when work happens in them, it flows back.",
  tone: "apps",
  items: [
    { label: "Microsoft Copilot", icon: <Sparkles className="w-4 h-4" />, detail: "Copilot stops sounding generic. It answers in your standards because Liza feeds it governed bundles instead of raw SharePoint sprawl." },
    { label: "Glean", icon: <Search className="w-4 h-4" />, detail: "Enterprise search ranks by judgment, filtered by your current mandates and playbooks." },
    { label: "Veeva / NesGPT", icon: <FileCheck2 className="w-4 h-4" />, detail: "Industry stacks consume the same standards. GxP and risk constraints execute consistently across vendors." },
    { label: "Notion AI", icon: <BookOpen className="w-4 h-4" />, detail: "Workspace AI answers from your Judgment Core, not from arbitrary pages." },
  ],
};

/* CORE — Judgment Core. Two motions. */
const JUDGMENT_CORE_DESC = {
  kicker: "The core — your decision standard",
  title: "The Decision Standard",
  sub: "Two graphs running in parallel. One holds how your company decides. The other holds what your company produces. Both governed together. We call this the Judgment Core.",
  expanded: "Most knowledge tools track one thing. Liza tracks two motions in lockstep: the standards that govern decisions, and the artifacts those decisions produce. When a standard changes, the artifacts that depend on it know. When an artifact changes anywhere, in your systems of record or in your AI tools, the graph stays consistent.",
};

/* Two sub-graphs inside the Judgment Core */
const SYSTEMIC_GRAPH: Item[] = [
  { label: "Decision logic & playbooks", icon: <Network className="w-4 h-4" />, detail: "How your company decides. Concepts, standards, decisions, and the relationships between them." },
  { label: "Mandates & directives", icon: <ShieldCheck className="w-4 h-4" />, detail: "Non-negotiable constraints enforced at execution time. Policy stops being a PDF and becomes a runtime check." },
  { label: "Process intelligence", icon: <Workflow className="w-4 h-4" />, detail: "How work actually flows. Captured from your systems and your people, not assumed." },
];

const ARTIFACT_GRAPH: Item[] = [
  { label: "Native artifacts (inside Liza)", icon: <Boxes className="w-4 h-4" />, detail: "Outputs produced inside Workbooks. Versioned, governed, linked back to the standard that produced them." },
  { label: "Non-native artifacts (in your stack)", icon: <RefreshCw className="w-4 h-4" />, detail: "Files in Drive, records in databases, pages in Notion, drafts in Copilot. Tracked, synced, and propagated so updates land everywhere they need to." },
  { label: "Sync & propagation across the estate", icon: <ArrowLeftRight className="w-4 h-4" />, detail: "Two-way sync plus active propagation. When a standard changes, every dependent artifact — native or in your stack — is updated, not just flagged. When the source changes, Liza catches it." },
];

const GOVERNANCE_BAR: Item[] = [
  { label: "Versioning", icon: <GitBranch className="w-4 h-4" />, detail: "Knowledge as code. Every standard and artifact has a history, an owner, a diff." },
  { label: "Audit trail", icon: <History className="w-4 h-4" />, detail: "Every execution records which bundle, which version, which mandate. Auditing happens in execution." },
  { label: "Access & roles", icon: <KeySquare className="w-4 h-4" />, detail: "Who can author, who can execute, who can override. Governed like infrastructure, not a wiki." },
];

/* BOTTOM — Model Fabric */
const MODEL_FABRIC: Layer = {
  id: "fabric",
  kicker: "Foundation — model fabric",
  title: "Model Fabric",
  sub: "LLM-agnostic substrate. Route any frontier or private model. Swap providers without rewriting your standards.",
  expanded: "OpenAI, Anthropic, Google, open-source, on-prem. Interchangeable. Your Judgment Core is the asset; the model is a runtime choice that can change every quarter without disrupting how your company decides.",
  tone: "fabric",
  items: [
    { label: "OpenAI", icon: <Cpu className="w-4 h-4" />, detail: "Routed when frontier reasoning matters." },
    { label: "Anthropic", icon: <Cpu className="w-4 h-4" />, detail: "Routed for long-context and safety-sensitive tasks." },
    { label: "Google", icon: <Cpu className="w-4 h-4" />, detail: "Routed for multimodal and cost-sensitive workloads." },
    { label: "Open-source / on-prem", icon: <Cpu className="w-4 h-4" />, detail: "For sovereign, regulated, air-gapped environments." },
  ],
};

/* TOP — Strategic Control Tower */
const CONTROL_TOWER: Layer = {
  id: "strategy",
  kicker: "Top — leadership view",
  title: "Leadership view",
  sub: "Where leaders set direction and see reality. Push governance, mandates, and playbooks down. Live signal flows up from execution. Strategy and execution stop being two timelines.",
  expanded: "Strategy and execution stop being two timelines. Leadership sets the constraints — mandates, playbooks, sensing engine jobs — and pushes them into the Judgment Core. Execution feeds back transcripts, client signals, drift, and outcome metrics. Business-model innovation becomes a live loop, not a yearly offsite.",
  tone: "strategy",
  items: [
    { label: "Push: governance & mandates", icon: <ShieldCheck className="w-4 h-4" />, tag: "Down", detail: "Non-negotiables and policy enter the Judgment Core as runtime constraints. Every surface inherits them the moment they ship." },
    { label: "Push: strategic playbooks", icon: <Compass className="w-4 h-4" />, tag: "Down", detail: "New strategic moves become executable playbooks. The org runs the new plan the day it is approved, not the quarter after." },
    { label: "Push: sensing engine jobs", icon: <Radar className="w-4 h-4" />, tag: "Down", detail: "Standing research and signal-detection jobs deployed across markets, accounts, and the regulatory landscape." },
    { label: "Up: execution telemetry", icon: <LineChart className="w-4 h-4" />, tag: "Up", detail: "Transcripts, client emails, win/loss, drift signals, outcome metrics flow back from execution surfaces in real time." },
    { label: "Up: live business-model loop", icon: <Target className="w-4 h-4" />, tag: "Up", detail: "Strategy designs the system; execution updates the system. The business model becomes a continuously tuned object." },
  ],
};

/* ---------- tone tokens ---------- */
const TONE: Record<Tone, { ring: string; bg: string; chipBg: string; chipBorder: string; accent: string; kicker: string }> = {
  apps:        { ring: "hsl(var(--muted-foreground) / 0.25)", bg: "hsl(var(--muted) / 0.4)",       chipBg: "hsl(var(--background))",          chipBorder: "hsl(var(--border))",                accent: "hsl(var(--muted-foreground))",  kicker: "hsl(var(--muted-foreground))" },
  native:      { ring: "hsl(var(--brand-green) / 0.45)",      bg: "hsl(var(--brand-green) / 0.06)",chipBg: "hsl(var(--brand-green) / 0.10)",  chipBorder: "hsl(var(--brand-green) / 0.30)",    accent: "hsl(var(--brand-green))",       kicker: "hsl(var(--brand-green))" },
  core:        { ring: "hsl(var(--primary) / 0.55)",          bg: "hsl(var(--primary) / 0.08)",    chipBg: "hsl(var(--primary) / 0.12)",       chipBorder: "hsl(var(--primary) / 0.35)",        accent: "hsl(var(--primary))",           kicker: "hsl(var(--primary))" },
  data:        { ring: "hsl(var(--foreground) / 0.15)",       bg: "hsl(var(--card))",              chipBg: "hsl(var(--background))",           chipBorder: "hsl(var(--border))",                accent: "hsl(var(--foreground) / 0.7)",  kicker: "hsl(var(--muted-foreground))" },
  fabric:      { ring: "hsl(var(--foreground) / 0.18)",       bg: "hsl(var(--foreground) / 0.04)", chipBg: "hsl(var(--background))",           chipBorder: "hsl(var(--foreground) / 0.18)",     accent: "hsl(var(--foreground) / 0.75)", kicker: "hsl(var(--muted-foreground))" },
  "graph-sys": { ring: "hsl(var(--primary) / 0.40)",          bg: "hsl(var(--primary) / 0.06)",    chipBg: "hsl(var(--primary) / 0.10)",       chipBorder: "hsl(var(--primary) / 0.30)",        accent: "hsl(var(--primary))",           kicker: "hsl(var(--primary))" },
  "graph-art": { ring: "hsl(var(--brand-green) / 0.40)",      bg: "hsl(var(--brand-green) / 0.05)",chipBg: "hsl(var(--brand-green) / 0.10)",  chipBorder: "hsl(var(--brand-green) / 0.30)",    accent: "hsl(var(--brand-green))",       kicker: "hsl(var(--brand-green))" },
  strategy:    { ring: "hsl(var(--brand-amber, var(--primary)) / 0.45)", bg: "hsl(var(--brand-amber, var(--primary)) / 0.07)", chipBg: "hsl(var(--brand-amber, var(--primary)) / 0.10)", chipBorder: "hsl(var(--brand-amber, var(--primary)) / 0.32)", accent: "hsl(var(--brand-amber, var(--primary)))", kicker: "hsl(var(--brand-amber, var(--primary)))" },
};

/* ---------- chip ---------- */
function Chip({ item, tone, open, onToggle }: { item: Item; tone: Tone; open: boolean; onToggle: () => void; }) {
  const t = TONE[tone];
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-left transition-all hover:-translate-y-0.5"
        style={{
          background: open ? t.chipBorder : t.chipBg,
          borderColor: t.chipBorder,
          color: t.accent,
          boxShadow: open ? `0 6px 20px -10px ${t.accent}` : "none",
        }}
      >
        <span className="opacity-90">{item.icon}</span>
        <span className="text-foreground/85 flex-1">{item.label}</span>
        {item.tag ? (
          <span
            className="text-[9px] tracking-widest font-black uppercase px-1.5 py-0.5 rounded"
            style={{ background: "hsl(var(--background))", color: t.accent, border: `1px solid ${t.chipBorder}` }}
          >
            {item.tag}
          </span>
        ) : (
          <Plus className="w-3 h-3 transition-transform" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }} />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p
              className="text-[11.5px] leading-relaxed mt-2 px-3 py-2.5 rounded-md border-l-2"
              style={{
                color: "hsl(var(--foreground) / 0.8)",
                background: "hsl(var(--background) / 0.7)",
                borderColor: t.accent,
              }}
            >
              {item.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- side panel (peripheral, vertical) ---------- */
function SidePanel({ layer, align }: { layer: Layer; align: "left" | "right" }) {
  const t = TONE[layer.tone];
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -18 : 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative rounded-2xl border p-5 h-full flex flex-col"
      style={{ background: t.bg, borderColor: t.ring }}
    >
      <div
        className={`absolute top-0 bottom-0 w-[2px] ${align === "left" ? "right-0" : "left-0"}`}
        style={{ background: t.accent, opacity: 0.55 }}
      />
      <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>
        {layer.kicker}
      </p>
      <h3 className="text-base md:text-lg font-black leading-tight mb-1 text-foreground">{layer.title}</h3>
      <p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-3 inline-flex items-center gap-1" style={{ color: t.accent }}>
        <ChevronDown className="w-3 h-3" /> tap any row to expand
      </p>
      {/* Endpoint tiles — looks like an integration wall, not a feature list */}
      <div className="flex flex-col gap-1.5 flex-1">
        {layer.items.map((it) => {
          const isOpen = openItem === it.label;
          return (
            <div key={it.label} className="rounded-lg border overflow-hidden"
              style={{
                background: isOpen ? t.chipBorder : "hsl(var(--background) / 0.7)",
                borderColor: t.ring,
              }}
            >
              <button
                type="button"
                onClick={() => setOpenItem(isOpen ? null : it.label)}
                aria-expanded={isOpen}
                className="group w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-all hover:translate-x-[1px]"
              >
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: t.chipBg, color: t.accent, border: `1px solid ${t.chipBorder}` }}
                >
                  {it.icon}
                </span>
                <span className="flex-1 text-[12px] font-bold text-foreground/90 leading-tight">{it.label}</span>
                {isOpen ? (
                  <X className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.accent }} />
                ) : (
                  <Plus className="w-3.5 h-3.5 flex-shrink-0 opacity-70" style={{ color: t.accent }} />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p
                      className="text-[11.5px] leading-relaxed px-3 py-2.5 border-t"
                      style={{
                        color: "hsl(var(--foreground) / 0.8)",
                        background: "hsl(var(--background) / 0.7)",
                        borderColor: t.ring,
                      }}
                    >
                      {it.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80 self-start"
        style={{ color: t.accent }}
      >
        <Plus className="w-3 h-3 transition-transform" style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }} />
        {expanded ? "Less" : "Why this matters"}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.p
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden text-[12px] leading-relaxed text-foreground/80"
          >
            {layer.expanded}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- center block (Native Surfaces, prominent) ---------- */
function CenterNativeSurfaces({ layer }: { layer: Layer }) {
  const t = TONE[layer.tone];
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const active = layer.items[activeIdx];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative rounded-2xl border-2 overflow-hidden"
      style={{
        background: t.bg,
        borderColor: t.ring,
        boxShadow: `0 20px 60px -30px ${t.accent}`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: t.accent, opacity: 0.7 }} />
      <div className="p-6 md:p-8">
        <div className="text-center mb-5">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>
            {layer.kicker}
          </p>
          <h3 className="text-2xl md:text-3xl font-black leading-tight text-foreground">{layer.title}</h3>
        </div>
        {/* Workspace mock: tabs + a content pane. Visually says "this is a place where work happens". */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "hsl(var(--background))", borderColor: t.ring }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 border-b"
            style={{ borderColor: t.ring, background: "hsl(var(--card))" }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.5)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent + "55" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.35)" }} />
            <span className="ml-3 text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
              Liza workspace
            </span>
          </div>
          {/* Tabs */}
          <div className="flex items-stretch border-b overflow-x-auto" style={{ borderColor: t.ring }}>
            {layer.items.map((it, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={it.label}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[11.5px] font-bold whitespace-nowrap border-b-2 transition-colors"
                  style={{
                    borderColor: isActive ? t.accent : "transparent",
                    color: isActive ? t.accent : "hsl(var(--muted-foreground))",
                    background: isActive ? t.bg : "transparent",
                  }}
                >
                  <span className="opacity-90">{it.icon}</span>
                  {it.label}
                </button>
              );
            })}
          </div>
          {/* Active pane */}
          <div className="p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: t.chipBg, color: t.accent, border: `1px solid ${t.chipBorder}` }}
              >
                {active.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-black text-foreground">{active.label}</p>
                  {active.tag && (
                    <span
                      className="text-[9px] tracking-widest font-black uppercase px-1.5 py-0.5 rounded"
                      style={{ background: t.chipBg, color: t.accent, border: `1px solid ${t.chipBorder}` }}
                    >
                      {active.tag}
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] leading-relaxed text-foreground/80">{active.detail}</p>
              </div>
            </div>
            {/* Faux content rows for "workspace" feel */}
            <div className="mt-4 space-y-1.5">
              {[0.9, 0.7, 0.55].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full"
                  style={{ width: `${w * 100}%`, background: t.accent + "22" }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80"
            style={{ color: t.accent }}
          >
            <Plus className="w-3 h-3 transition-transform" style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }} />
            {expanded ? "Less" : "Why this matters"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden text-[12.5px] leading-relaxed text-foreground/80 max-w-2xl mx-auto"
              >
                {layer.expanded}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- bidirectional sync arrow between center and a side ---------- */
function SyncArrow({ label }: { label: string }) {
  return (
    <div className="hidden lg:flex items-center justify-center px-1">
      <div
        className="flex flex-col items-center gap-1 p-1.5 rounded-full border bg-background"
        style={{ borderColor: "hsl(var(--primary) / 0.25)" }}
        title={label}
        aria-label={label}
      >
        <ArrowLeftRight className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
      </div>
    </div>
  );
}

/* ---------- Judgment Core block — two motions ---------- */
function JudgmentCoreBlock({
  systemicSub, artifactsSub, systemicItems, artifactItems, chain,
}: {
  systemicSub?: string;
  artifactsSub?: string;
  systemicItems?: Item[];
  artifactItems?: Item[];
  chain?: { trigger: string; nodes: string[]; outcome: string };
} = {}) {
  const t = TONE.core;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative"
    >
      <div className="text-center mb-5">
        <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>
          {JUDGMENT_CORE_DESC.kicker}
        </p>
        <h3 className="text-2xl md:text-3xl font-black leading-tight text-foreground">{JUDGMENT_CORE_DESC.title}</h3>
      </div>
      {/* Framed surface — window chrome wraps the actual content boxes */}
      <div
        className="rounded-2xl border-2 overflow-hidden"
        style={{ background: t.bg, borderColor: t.ring, boxShadow: `0 20px 60px -30px ${t.accent}` }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-2 border-b"
          style={{ borderColor: t.ring, background: "hsl(var(--card))" }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.5)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent + "55" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.35)" }} />
          <span className="ml-3 text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
            Liza Decision Core
          </span>
        </div>
        <div className="p-5 md:p-6">
        {/* Two parallel knowledge graphs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <SubGraph
            tone="graph-sys"
            label="Motion 1"
            title="How we decide"
            sub={systemicSub ?? "The logic of how your company decides."}
            items={systemicItems ?? SYSTEMIC_GRAPH}
            openItem={openItem}
            setOpenItem={setOpenItem}
          />
          <SubGraph
            tone="graph-art"
            label="Motion 2"
            title="What we produce"
            sub={artifactsSub ?? "Every artifact, native or not, kept in sync."}
            items={artifactItems ?? ARTIFACT_GRAPH}
            openItem={openItem}
            setOpenItem={setOpenItem}
          />
        </div>

        {/* Propagation chain — when one node changes, the whole chain updates */}
        {chain && <PropagationChain chain={chain} />}

        {/* Shared governance bar */}
        <div
          className="rounded-xl border p-4 mt-4"
          style={{ background: "hsl(var(--background) / 0.6)", borderColor: t.ring }}
        >
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-3 text-center" style={{ color: t.kicker }}>
            Shared governance services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {GOVERNANCE_BAR.map((it) => (
              <Chip
                key={it.label}
                item={it}
                tone="core"
                open={openItem === it.label}
                onToggle={() => setOpenItem(openItem === it.label ? null : it.label)}
              />
            ))}
          </div>
        </div>

        </div>
      </div>
      <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80"
            style={{ color: t.accent }}
          >
            <Plus className="w-3 h-3 transition-transform" style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }} />
            {expanded ? "Less" : "Why this matters"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden text-[12.5px] leading-relaxed text-foreground/80 max-w-2xl mx-auto"
              >
                {JUDGMENT_CORE_DESC.expanded}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
    </motion.div>
  );
}

function SubGraph({
  tone, label, title, sub, items, openItem, setOpenItem,
}: {
  tone: Tone; label: string; title: string; sub: string; items: Item[];
  openItem: string | null; setOpenItem: (v: string | null) => void;
}) {
  const t = TONE[tone];
  return (
    <div
      className="relative rounded-xl border p-4"
      style={{ background: "hsl(var(--background) / 0.55)", borderColor: t.ring }}
    >
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[9px] font-black tracking-[0.22em] uppercase" style={{ color: t.kicker }}>
          {label}
        </p>
      </div>
      <h4 className="text-base font-black text-foreground leading-tight">{title}</h4>
      <p className="text-[12px] text-muted-foreground mb-3">{sub}</p>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <Chip
            key={it.label}
            item={it}
            tone={tone}
            open={openItem === it.label}
            onToggle={() => setOpenItem(openItem === it.label ? null : it.label)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Model Fabric (compact bottom row) ---------- */
function ModelFabricRow() {
  const t = TONE[MODEL_FABRIC.tone];
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative rounded-2xl border overflow-hidden"
      style={{ background: t.bg, borderColor: t.ring }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: t.accent, opacity: 0.55 }} />
      <div className="grid md:grid-cols-[240px_1fr] gap-6 p-6">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>
            {MODEL_FABRIC.kicker}
          </p>
          <h3 className="text-lg md:text-xl font-black leading-tight mb-2 text-foreground">{MODEL_FABRIC.title}</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{MODEL_FABRIC.sub}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80"
            style={{ color: t.accent }}
          >
            <Plus className="w-3 h-3 transition-transform" style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }} />
            {expanded ? "Less" : "Why this matters"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden text-[12px] leading-relaxed text-foreground/80"
              >
                {MODEL_FABRIC.expanded}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 self-start">
          {MODEL_FABRIC.items.map((it) => (
            <Chip
              key={it.label}
              item={it}
              tone={MODEL_FABRIC.tone}
              open={openItem === it.label}
              onToggle={() => setOpenItem(openItem === it.label ? null : it.label)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- connector ---------- */
function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3 px-2">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)" }} />
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)" }} />
    </div>
  );
}

/* ---------- vertical bidirectional connector (strategy <-> execution) ---------- */
function VerticalSyncConnector({ downLabel, upLabel }: { downLabel: string; upLabel: string }) {
  return (
    <div className="flex items-stretch justify-center py-3">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <ArrowDown className="w-4 h-4" style={{ color: "hsl(var(--primary) / 0.75)" }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{downLabel}</span>
        </div>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--border)), transparent)" }} />
        <div className="flex flex-col items-center gap-1">
          <ArrowUp className="w-4 h-4" style={{ color: "hsl(var(--brand-green) / 0.8)" }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{upLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tablet: two arrows funneling Records + Tools down into Workspace ---------- */
function FeedDownArrows({ leftLabel, rightLabel }: { leftLabel: string; rightLabel: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 py-3">
      {[leftLabel, rightLabel].map((lbl) => (
        <div key={lbl} className="flex flex-col items-center gap-1">
          <ArrowDown className="w-4 h-4" style={{ color: "hsl(var(--primary) / 0.75)" }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            {lbl}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Strategic Control Tower (top block) ---------- */
function PropagationChain({ chain }: { chain: { trigger: string; nodes: string[]; outcome: string } }) {
  const accent = "hsl(var(--primary))";
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "hsl(var(--background) / 0.6)", borderColor: "hsl(var(--primary) / 0.35)" }}
    >
      <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-3 text-center" style={{ color: accent }}>
        Native artifact chain — change one, update all
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
        <span
          className="px-2.5 py-1 rounded-md font-bold border"
          style={{ background: "hsl(var(--primary) / 0.12)", borderColor: "hsl(var(--primary) / 0.4)", color: accent }}
        >
          {chain.trigger}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        {chain.nodes.map((n, i) => (
          <span key={n} className="inline-flex items-center gap-1.5">
            <span
              className="px-2.5 py-1 rounded-md font-semibold border text-foreground/85"
              style={{ background: "hsl(var(--brand-green) / 0.08)", borderColor: "hsl(var(--brand-green) / 0.35)" }}
            >
              {n}
            </span>
            {i < chain.nodes.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
          </span>
        ))}
      </div>
      <p className="text-[11.5px] text-center mt-3 text-foreground/75 leading-snug">
        {chain.outcome}
      </p>
    </div>
  );
}

function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <div
      className="rounded-xl border p-3 mb-4"
      style={{ background: "hsl(var(--background) / 0.6)", borderColor: "hsl(var(--brand-amber, var(--primary)) / 0.32)" }}
    >
      <div className="flex items-center gap-1.5 mb-2.5 justify-center">
        <TrendingUp className="w-3.5 h-3.5" style={{ color: "hsl(var(--brand-amber, var(--primary)))" }} />
        <p className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "hsl(var(--brand-amber, var(--primary)))" }}>
          Live KPIs leadership sees
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-lg border p-2.5 text-center"
            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          >
            <p
              className="text-lg font-black leading-none mb-1"
              style={{ color: k.positive ? "hsl(var(--brand-green))" : "hsl(var(--brand-amber, var(--primary)))" }}
            >
              {k.value}
            </p>
            <p className="text-[10px] font-bold text-foreground/85 leading-tight mb-0.5">{k.label}</p>
            <p className="text-[9px] tracking-wide uppercase text-muted-foreground">{k.delta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlTowerBlock({
  layer, leadership,
}: {
  layer: Layer;
  leadership?: {
    sub: string;
    pushItems: { label: string; detail: string }[];
    upItems: { label: string; detail: string }[];
    kpis: Kpi[];
  };
}) {
  const t = TONE[layer.tone];
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const baseDown = layer.items.filter((i) => i.tag === "Down");
  const baseUp = layer.items.filter((i) => i.tag === "Up");
  const downItems: Item[] = leadership
    ? leadership.pushItems.map((it, i) => ({
        ...baseDown[i % baseDown.length],
        label: it.label,
        detail: it.detail,
      }))
    : baseDown;
  const upItems: Item[] = leadership
    ? leadership.upItems.map((it, i) => ({
        ...baseUp[i % baseUp.length],
        label: it.label,
        detail: it.detail,
      }))
    : baseUp;
  const sub = leadership?.sub ?? layer.sub;
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative"
    >
      <div className="text-center mb-5">
        <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>{layer.kicker}</p>
        <h3 className="text-2xl md:text-3xl font-black leading-tight text-foreground">{layer.title}</h3>
      </div>
      {/* Framed surface — window chrome wraps the actual KPI / push-down / flow-up boxes */}
      <div
        className="rounded-2xl border-2 overflow-hidden"
        style={{ background: t.bg, borderColor: t.ring, boxShadow: `0 20px 60px -30px ${t.accent}` }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-2 border-b"
          style={{ borderColor: t.ring, background: "hsl(var(--card))" }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.5)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent + "55" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.35)" }} />
          <span className="ml-3 text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
            Liza Leadership View
          </span>
        </div>
        <div className="p-5 md:p-6">
        {leadership && <KpiStrip kpis={leadership.kpis} />}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4" style={{ background: "hsl(var(--background) / 0.55)", borderColor: t.ring }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <ArrowDown className="w-3.5 h-3.5" style={{ color: t.accent }} />
              <p className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: t.kicker }}>Push down — strategy as system constraints</p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-2 inline-flex items-center gap-1" style={{ color: t.accent }}>
              <ChevronDown className="w-3 h-3" /> tap any row to expand
            </p>
            <div className="flex flex-col gap-1.5">
              {downItems.map((it) => {
                const isOpen = openItem === it.label;
                return (
                  <button
                    key={it.label}
                    type="button"
                    onClick={() => setOpenItem(isOpen ? null : it.label)}
                    aria-expanded={isOpen}
                    className="text-left rounded-lg border px-3 py-2.5 transition-all hover:translate-y-[-1px] flex items-start gap-2"
                    style={{
                      background: isOpen ? t.chipBorder : "hsl(var(--background))",
                      borderColor: t.ring,
                    }}
                  >
                    <span className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-foreground/90 leading-tight">{it.label}</p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 6 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden text-[11px] leading-relaxed text-foreground/75"
                        >
                          {it.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    </span>
                    {isOpen ? (
                      <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: t.accent }} />
                    ) : (
                      <Plus className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-70" style={{ color: t.accent }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "hsl(var(--background) / 0.55)", borderColor: t.ring }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <ArrowUp className="w-3.5 h-3.5" style={{ color: t.accent }} />
              <p className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: t.kicker }}>Flow up — live signal from execution</p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-2 inline-flex items-center gap-1" style={{ color: t.accent }}>
              <ChevronDown className="w-3 h-3" /> tap any row to expand
            </p>
            <div className="flex flex-col gap-1.5">
              {upItems.map((it) => {
                const isOpen = openItem === it.label;
                return (
                  <button
                    key={it.label}
                    type="button"
                    onClick={() => setOpenItem(isOpen ? null : it.label)}
                    aria-expanded={isOpen}
                    className="text-left rounded-lg border px-3 py-2.5 transition-all hover:translate-y-[-1px] flex items-center gap-2"
                    style={{
                      background: isOpen ? t.chipBorder : "hsl(var(--background))",
                      borderColor: t.ring,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "hsl(var(--brand-green))", boxShadow: "0 0 6px hsl(var(--brand-green))" }}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12px] font-bold text-foreground/90 leading-tight">{it.label}</span>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.span
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="block overflow-hidden text-[11px] leading-relaxed text-foreground/75 mt-1"
                          >
                            {it.detail}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    {isOpen ? (
                      <X className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.accent }} />
                    ) : (
                      <Plus className="w-3.5 h-3.5 flex-shrink-0 opacity-70" style={{ color: t.accent }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </div>
      <div className="text-center mt-5">
          <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80"
            style={{ color: t.accent }}>
            <Plus className="w-3 h-3 transition-transform" style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }} />
            {expanded ? "Less" : "Why this matters"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden text-[12.5px] leading-relaxed text-foreground/80 max-w-2xl mx-auto"
              >
                {layer.expanded}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
    </motion.div>
  );
}

/* ---------- main stack ---------- */
export function LizaOSStack() {
  const [industryKey, setIndustryKey] = useState<IndustryKey>("generic");
  const industry = INDUSTRY_BY_KEY[industryKey];
  const isGeneric = industryKey === "generic";
  const [tourOpen, setTourOpen] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const nudgedRef = useRef(false);

  // Scroll-triggered nudge: when the architecture section has been on screen
  // for ~6s in generic mode, suggest picking an industry + playing the tour.
  useEffect(() => {
    if (!isGeneric || tourOpen || nudgedRef.current) return;
    const el = stackRef.current;
    if (!el) return;
    let timer: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            if (timer == null) {
              timer = window.setTimeout(() => {
                if (nudgedRef.current) return;
                nudgedRef.current = true;
                toast(
                  "Want to see how this works for your industry?",
                  {
                    description:
                      "Pick your industry above, then play the 6-step guided tour through the architecture.",
                    duration: 9000,
                    action: {
                      label: "Jump to selector",
                      onClick: () => {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      },
                    },
                  },
                );
              }, 6000);
            }
          } else if (timer != null) {
            window.clearTimeout(timer);
            timer = null;
          }
        }
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer != null) window.clearTimeout(timer);
    };
  }, [isGeneric, tourOpen]);

  // Industry-overridden layers
  const sourceLayer = useMemo<Layer>(() => ({
    ...SOURCE_SYSTEMS,
    title: industry.sourceSystems.title,
    sub: industry.sourceSystems.sub,
    items: industry.sourceSystems.items.map((label, i) => ({
      ...SOURCE_SYSTEMS.items[i % SOURCE_SYSTEMS.items.length],
      label,
    })),
  }), [industry]);

  const toolsLayer = useMemo<Layer>(() => ({
    ...CONNECTED_TOOLS,
    title: industry.connectedTools.title,
    sub: industry.connectedTools.sub,
    items: industry.connectedTools.items.map((label, i) => ({
      ...CONNECTED_TOOLS.items[i % CONNECTED_TOOLS.items.length],
      label,
    })),
  }), [industry]);

  const nativeLayer = useMemo<Layer>(() => ({
    ...NATIVE_SURFACES,
    sub: industry.nativeSurfaces.sub,
  }), [industry]);

  const systemicItems = useMemo<Item[]>(
    () => industry.judgmentCore.systemicItems.map((it, i) => ({
      ...SYSTEMIC_GRAPH[i % SYSTEMIC_GRAPH.length],
      label: it.label,
      detail: it.detail,
    })),
    [industry],
  );
  const artifactItems = useMemo<Item[]>(
    () => industry.judgmentCore.artifactItems.map((it, i) => ({
      ...ARTIFACT_GRAPH[i % ARTIFACT_GRAPH.length],
      label: it.label,
      detail: it.detail,
    })),
    [industry],
  );

  return (
    <div className="relative" ref={stackRef}>
      {/* Industry tab strip — Rolodex */}
      <IndustryRolodex
        active={industryKey}
        onChange={setIndustryKey}
        onPlayTour={() => setTourOpen(true)}
        showPlayTour={!isGeneric}
      />

      <motion.div
        key={industryKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* MOBILE: simplified vertical stack */}
        <div className="md:hidden">
          <MobileStack
            industry={industry}
            industryKey={industryKey}
            onIndustryChange={setIndustryKey}
            sourceLayer={sourceLayer}
            toolsLayer={toolsLayer}
            nativeLayer={nativeLayer}
            isGeneric={isGeneric}
          />
        </div>

        {/* DESKTOP / TABLET: full diagram */}
        <div className="hidden md:block">
        {/* TOP: Leadership view */}
        <div data-tour="leadership">
          <ControlTowerBlock layer={CONTROL_TOWER} leadership={industry.leadership} />
        </div>

        <VerticalSyncConnector downLabel="strategy → system" upLabel="execution → signal" />

        {/* DESKTOP (lg+): Records | Workspace | Tools side by side */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.7fr)_auto_minmax(0,2.4fr)_auto_minmax(0,0.7fr)] gap-3 items-stretch">
          <div data-tour="records" className="contents"><SidePanel layer={sourceLayer} align="left" /></div>
          <SyncArrow label="read & write" />
          <div className="relative" data-tour="workspace">
            <CenterNativeSurfaces layer={nativeLayer} />
            {!isGeneric && <ScenarioFlipCard industry={industry} />}
          </div>
          <SyncArrow label="sync & propagate" />
          <div data-tour="tools" className="contents"><SidePanel layer={toolsLayer} align="right" /></div>
        </div>

        {/* TABLET (md, not lg): Records + Tools feed DOWN into Workspace */}
        <div className="md:block lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <div data-tour="records"><SidePanel layer={sourceLayer} align="left" /></div>
            <div data-tour="tools"><SidePanel layer={toolsLayer} align="right" /></div>
          </div>
          <FeedDownArrows leftLabel="read & write" rightLabel="sync & propagate" />
          <div className="relative" data-tour="workspace">
            <CenterNativeSurfaces layer={nativeLayer} />
            {!isGeneric && <ScenarioFlipCard industry={industry} />}
          </div>
        </div>

        <Connector label="every surface above runs against the Decision Standard" />

        {/* JUDGMENT CORE — two motions */}
        <div data-tour="core">
        <JudgmentCoreBlock
          systemicSub={industry.judgmentCore.systemic}
          artifactsSub={industry.judgmentCore.artifacts}
          systemicItems={systemicItems}
          artifactItems={artifactItems}
          chain={industry.judgmentCore.chain}
        />
        </div>

        <Connector label="runs on top of any model" />

        {/* MODEL FABRIC */}
        <div data-tour="fabric">
          <ModelFabricRow />
        </div>

        {!isGeneric && (
          <div className="mt-6 text-center">
            <Link
              to={industry.href}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80"
            >
              See the full {industry.label} view
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        </div>
      </motion.div>

      <GuidedTour open={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}

/* ---------- Mobile-only: vertical loop SVG + three expandable sections ---------- */
function MobileStack({
  industry, industryKey, onIndustryChange, sourceLayer, toolsLayer, nativeLayer, isGeneric,
}: {
  industry: IndustryLexicon;
  industryKey: IndustryKey;
  onIndustryChange: (k: IndustryKey) => void;
  sourceLayer: Layer;
  toolsLayer: Layer;
  nativeLayer: Layer;
  isGeneric: boolean;
}) {
  const sections: { id: string; tone: Tone; kicker: string; title: string; sub: string; icon: React.ReactNode; items: { label: string; detail: string }[] }[] = [
    {
      id: "leadership",
      tone: "strategy",
      kicker: "Leadership",
      title: "What leadership controls",
      sub: "Set the standards, see the signals. Strategy and execution become one loop.",
      icon: <Compass className="w-4 h-4" />,
      items: [
        ...industry.leadership.pushItems.slice(0, 3).map((i) => ({ label: i.label, detail: i.detail })),
        ...industry.leadership.upItems.slice(0, 2).map((i) => ({ label: i.label, detail: i.detail })),
      ],
    },
    {
      id: "core",
      tone: "core",
      kicker: "Liza · Decision Standard",
      title: "The governed core",
      sub: "Liza captures how your company decides and delivers work, then enforces it on every AI request.",
      icon: <ShieldCheck className="w-4 h-4" />,
      items: [
        ...industry.judgmentCore.systemicItems.slice(0, 3).map((i) => ({ label: i.label, detail: i.detail })),
        ...industry.judgmentCore.artifactItems.slice(0, 2).map((i) => ({ label: i.label, detail: i.detail })),
      ],
    },
    {
      id: "native",
      tone: "native",
      kicker: "Where work happens",
      title: "One governed workspace",
      sub: nativeLayer.sub,
      icon: <Workflow className="w-4 h-4" />,
      items: nativeLayer.items.map((i) => ({ label: i.label, detail: i.detail })),
    },
    {
      id: "systems",
      tone: "data",
      kicker: "Systems of record",
      title: sourceLayer.title,
      sub: sourceLayer.sub,
      icon: <Database className="w-4 h-4" />,
      items: sourceLayer.items.map((i) => ({ label: i.label, detail: i.detail })),
    },
    {
      id: "tools",
      tone: "apps",
      kicker: "Your AI tools",
      title: toolsLayer.title,
      sub: toolsLayer.sub,
      icon: <Bot className="w-4 h-4" />,
      items: toolsLayer.items.map((i) => ({ label: i.label, detail: i.detail })),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mobile industry selector */}
      <MobileIndustrySelector active={industryKey} onChange={onIndustryChange} />

      {/* Click-driven guided tour + section list */}
      <MobileGuidedTour sections={sections} industry={industry} isGeneric={isGeneric} />

      {!isGeneric && (
        <div className="pt-2 text-center">
          <Link
            to={industry.href}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            See the full {industry.label} view
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

/* Mobile industry selector — compact pill rolodex */
function MobileIndustrySelector({
  active, onChange,
}: { active: IndustryKey; onChange: (k: IndustryKey) => void }) {
  return (
    <div
      className="rounded-2xl border-2 p-3"
      style={{
        background: "hsl(var(--card))",
        borderColor: active === "generic" ? "hsl(var(--primary) / 0.55)" : "hsl(var(--primary) / 0.25)",
        boxShadow: "0 12px 30px -18px hsl(var(--primary) / 0.4)",
      }}
    >
      <p className="text-[10px] font-black tracking-[0.22em] uppercase text-primary mb-1">
        Step 1 of 2
      </p>
      <p className="text-[14px] font-black text-foreground leading-tight mb-2.5">
        Pick your industry, then play the tour.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {INDUSTRIES.map((ind) => {
          const isActive = ind.key === active;
          return (
            <button
              key={ind.key}
              type="button"
              onClick={() => onChange(ind.key)}
              className="text-[12px] font-bold px-3 py-2 rounded-lg transition-all"
              style={{
                background: isActive ? "hsl(var(--primary))" : "hsl(var(--background))",
                color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground) / 0.85)",
                border: isActive ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
              }}
            >
              {ind.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* (Old MobileLoopDiagram removed — replaced by industry-aware guided tour.) */
function _MobileLoopDiagramUnused() {
  const PRIMARY = "hsl(var(--primary))";
  const GREEN = "hsl(var(--brand-green))";
  const AMBER = "hsl(var(--brand-amber, var(--primary)))";
  const steps = [
    {
      kicker: "Leadership",
      title: "Defines how the company decides",
      body: "Owners write the playbooks, mandates, and policies that say what good output looks like. These become machine-readable rules.",
      tone: AMBER,
      isLiza: true,
    },
    {
      kicker: "Decision Core",
      title: "Liza checks every AI request against those rules",
      body: "Before any AI tool answers, Liza injects the right policy, vocabulary, and context. Off-policy answers are blocked or rewritten.",
      tone: PRIMARY,
      isLiza: true,
    },
    {
      kicker: "Workspace",
      title: "Teams draft, review, and ship inside Liza",
      body: "Workbooks for memos, RFIs, deviations, complaints, communications. Every artifact is versioned, attributable, and audit-ready.",
      tone: PRIMARY,
      isLiza: true,
    },
    {
      kicker: "Records + AI tools",
      title: "Pulled in for context, written back as truth",
      body: "Liza reads from your systems (Vault, Procore, ERP, Drive) and pushes approved outputs back. Your existing AI tools (Copilot, Claude, vendor agents) call Liza to stay on policy.",
      tone: GREEN,
      isLiza: false,
    },
  ];
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <p className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground text-center mb-3">
        How the loop works
      </p>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.kicker} className="flex items-stretch gap-3">
            <div className="flex flex-col items-center pt-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                style={{ background: s.tone + "1f", color: s.tone, border: `1px solid ${s.tone}55` }}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 w-px mt-1" style={{ background: s.tone + "44" }} />
              )}
            </div>
            <div
              className="flex-1 rounded-lg px-3 py-2"
              style={{
                background: s.isLiza ? s.tone + "0d" : "hsl(var(--background))",
                border: `1px solid ${s.tone}${s.isLiza ? "55" : "33"}`,
              }}
            >
              <div className="flex items-center gap-1.5">
                {s.isLiza && (
                  <span
                    className="text-[8px] font-black tracking-[0.18em] uppercase px-1.5 py-0.5 rounded"
                    style={{ background: s.tone, color: "hsl(var(--primary-foreground))" }}
                  >
                    Liza
                  </span>
                )}
                <p className="text-[9.5px] font-black tracking-[0.16em] uppercase leading-tight" style={{ color: s.tone }}>
                  {s.kicker}
                </p>
              </div>
              <p className="text-[12.5px] font-bold leading-snug text-foreground mt-0.5">
                {s.title}
              </p>
              <p className="text-[11.5px] leading-relaxed text-muted-foreground mt-1">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div
        className="mt-3 rounded-md px-3 py-2 flex items-center gap-2"
        style={{ background: GREEN + "14", border: `1px solid ${GREEN}55` }}
      >
        <ArrowUp className="w-3.5 h-3.5" style={{ color: GREEN }} />
        <p className="text-[11px] leading-snug font-semibold" style={{ color: GREEN }}>
          Every approved output, exception, and override flows back up so leadership sees how the standard is performing in real work.
        </p>
      </div>
    </div>
  );
}

function NodeBox({
  kicker, title, tone, accent, small,
}: { kicker: string; title: string; tone: string; accent?: boolean; small?: boolean }) {
  return (
    <div
      className={`w-full h-full rounded-lg flex flex-col justify-center ${small ? "px-2 py-2 gap-1" : "px-3 py-1.5"}`}
      style={{
        background: accent ? `${tone}14` : small ? `${tone}0d` : "hsl(var(--background))",
        border: `${accent ? "2px" : "1px"} solid ${tone}${accent ? "66" : small ? "55" : "44"}`,
      }}
    >
      <p
        className={`font-black tracking-[0.14em] uppercase leading-tight ${small ? "text-[9px]" : "text-[8.5px] truncate"}`}
        style={{ color: tone }}
      >
        {kicker}
      </p>
      <p
        className={`font-black leading-tight text-foreground ${small ? "text-[11px]" : "text-[12.5px] truncate"}`}
      >
        {title}
      </p>
    </div>
  );
}

function MobileSection({
  section, open, onToggle, sectionRef,
}: {
  section: { id: string; tone: Tone; kicker: string; title: string; sub: string; icon: React.ReactNode; items: { label: string; detail: string }[] };
  open: boolean;
  onToggle: () => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}) {
  const t = TONE[section.tone];
  return (
    <div
      ref={sectionRef}
      className="rounded-xl border overflow-hidden"
      style={{ background: t.bg, borderColor: t.ring }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3.5 text-left"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: t.accent + "22", color: t.accent }}
        >
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[9.5px] font-black tracking-[0.18em] uppercase truncate"
            style={{ color: t.kicker }}
          >
            {section.kicker}
          </p>
          <p className="text-[13px] font-black text-foreground leading-tight truncate">
            {section.title}
          </p>
        </div>
        <ChevronDown
          className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 space-y-2">
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                {section.sub}
              </p>
              <ul className="space-y-2">
                {section.items.map((i) => (
                  <li
                    key={i.label}
                    className="rounded-lg border p-2.5"
                    style={{
                      background: "hsl(var(--background))",
                      borderColor: t.ring,
                    }}
                  >
                    <p className="text-[12px] font-bold text-foreground leading-tight">
                      {i.label}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground leading-relaxed mt-0.5">
                      {i.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Industry rolodex tab strip ---------- */
function IndustryRolodex({
  active, onChange, onPlayTour, showPlayTour,
}: {
  active: IndustryKey;
  onChange: (k: IndustryKey) => void;
  onPlayTour: () => void;
  showPlayTour: boolean;
}) {
  return (
    <div className="mb-8 hidden md:block">
      <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-black tracking-[0.28em] uppercase text-primary mb-1.5">
            Step 1 of 2
          </p>
          <h3 className="text-[22px] md:text-[26px] font-black leading-tight text-foreground">
            Pick your industry to see this run on your stack.
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            Then hit <span className="font-bold text-foreground">Play 6-step tour</span> for a guided walk-through of the architecture.
          </p>
        </div>
        {active === "generic" && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px] font-black tracking-[0.22em] uppercase text-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "hsl(var(--primary) / 0.12)",
              border: "1px solid hsl(var(--primary) / 0.35)",
            }}
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            Select one below
          </motion.span>
        )}
      </div>
      <motion.div
        animate={
          active === "generic"
            ? {
                boxShadow: [
                  "0 12px 40px -20px hsl(var(--primary) / 0.35)",
                  "0 16px 50px -16px hsl(var(--primary) / 0.6)",
                  "0 12px 40px -20px hsl(var(--primary) / 0.35)",
                ],
              }
            : { boxShadow: "0 12px 40px -20px hsl(var(--primary) / 0.35)" }
        }
        transition={{ duration: 2.4, repeat: active === "generic" ? Infinity : 0 }}
        className="flex flex-wrap items-center gap-2.5 p-4 rounded-2xl border-2"
        style={{
          background: "hsl(var(--card))",
          borderColor: active === "generic" ? "hsl(var(--primary) / 0.55)" : "hsl(var(--primary) / 0.25)",
        }}
      >
        {INDUSTRIES.map((ind) => {
          const isActive = ind.key === active;
          return (
            <button
              key={ind.key}
              type="button"
              onClick={() => onChange(ind.key)}
              className="text-[14px] font-bold px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5"
              style={{
                background: isActive ? "hsl(var(--primary))" : "hsl(var(--background))",
                color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground) / 0.85)",
                border: isActive ? "1px solid hsl(var(--primary))" : "1.5px solid hsl(var(--border))",
                boxShadow: isActive ? "0 10px 28px -10px hsl(var(--primary))" : "none",
              }}
            >
              {ind.label}
            </button>
          );
        })}
        <div className="flex-1" />
        {showPlayTour && (
          <PlayTourButton onClick={onPlayTour} />
        )}
      </motion.div>
    </div>
  );
}

/* ---------- Flip card scenario for an industry ---------- */
function ScenarioFlipCard({ industry }: { industry: IndustryLexicon }) {
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="hidden lg:block mt-4 ml-auto w-[280px] h-[170px]"
      style={{ perspective: 1000 }}
    >
      <motion.button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="relative w-full h-full text-left"
        style={{ transformStyle: "preserve-3d" }}
        aria-label="Flip scenario card"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border-2 p-4 flex flex-col justify-between"
          style={{
            background: "hsl(var(--background))",
            borderColor: "hsl(var(--brand-green) / 0.45)",
            boxShadow: "0 20px 40px -20px hsl(var(--brand-green) / 0.5)",
            backfaceVisibility: "hidden",
          }}
        >
          <div>
            <p className="text-[9px] font-black tracking-[0.22em] uppercase mb-1.5" style={{ color: "hsl(var(--brand-green))" }}>
              {industry.label} · scenario
            </p>
            <p className="text-[13px] font-bold leading-tight text-foreground">
              {industry.scenario.front}
            </p>
          </div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground inline-flex items-center gap-1">
            tap to see outcome <ArrowRight className="w-3 h-3" />
          </p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border-2 p-4 flex flex-col justify-between"
          style={{
            background: "hsl(var(--background))",
            borderColor: "hsl(var(--brand-green) / 0.55)",
            boxShadow: "0 20px 40px -20px hsl(var(--brand-green) / 0.5)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex-1 min-h-0">
            <p className="text-[9px] font-black tracking-[0.22em] uppercase mb-1.5" style={{ color: "hsl(var(--brand-green))" }}>
              outcome
            </p>
            <p className="text-[12.5px] font-black leading-tight text-foreground mb-1.5">
              {industry.scenario.backOutcome}
            </p>
            <p className="text-[10.5px] leading-snug text-foreground/80 line-clamp-3">
              {industry.scenario.backDetail}
            </p>
          </div>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); setOpen(true); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setOpen(true); } }}
            className="text-[10px] font-bold tracking-[0.18em] uppercase inline-flex items-center gap-1 self-start mt-1.5 hover:opacity-80 cursor-pointer"
            style={{ color: "hsl(var(--brand-green))" }}
          >
            read full scenario <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </motion.button>
    </motion.div>

    {open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "hsl(0 0% 0% / 0.6)" }}
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-xl w-full rounded-2xl border-2 p-6 md:p-7"
          style={{
            background: "hsl(var(--background))",
            borderColor: "hsl(var(--brand-green) / 0.55)",
            boxShadow: "0 30px 80px -20px hsl(var(--brand-green) / 0.45)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-muted"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: "hsl(var(--brand-green))" }}>
            {industry.label} · full scenario
          </p>
          <h4 className="text-lg font-black text-foreground leading-tight mb-1.5">
            {industry.scenario.front}
          </h4>
          <p className="text-sm font-black mb-4" style={{ color: "hsl(var(--brand-green))" }}>
            {industry.scenario.backOutcome}
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            {industry.scenario.backLong}
          </p>
        </div>
      </div>
    )}
    </>
  );
}

/* ---------- Mobile Guided Tour ----------
   Auto-walks each section: opens it, scrolls into view, shows a narration
   bubble. Tap right/left to skip, tap card to pause. */
type MobileTourSection = { id: string; tone: Tone; kicker: string; title: string; sub: string; icon: React.ReactNode; items: { label: string; detail: string }[] };

const TOUR_NARRATION: Record<string, { headline: string; body: string }> = {
  leadership: {
    headline: "Start with leadership.",
    body: "Owners write the playbooks, mandates and policies. These become the rules every AI request runs against.",
  },
  core: {
    headline: "Liza enforces those rules.",
    body: "Every AI request — from any tool — gets checked against the standard before it answers. Off-policy outputs are blocked or rewritten.",
  },
  native: {
    headline: "Work happens inside Liza.",
    body: "Workbooks for memos, RFIs, deviations, complaints. Every artifact is versioned, attributable and audit-ready.",
  },
  systems: {
    headline: "It reads from your stack.",
    body: "Vault, Procore, ERP, Drive, SharePoint. Liza pulls context in and pushes approved outputs back as truth.",
  },
  tools: {
    headline: "Your AI tools stay on policy.",
    body: "Copilot, Claude, vendor agents — they all call Liza so every team gets the same governed answer.",
  },
};

function MobileGuidedTour({ sections }: { sections: MobileTourSection[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [tourActive, setTourActive] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const STEP_MS = 6500;

  // Drive the tour
  useEffect(() => {
    if (!tourActive || paused) return;
    const current = sections[step];
    if (!current) return;
    // open this section, close others
    setOpen(() => ({ [current.id]: true }));
    // scroll into view (with offset for sticky header)
    requestAnimationFrame(() => {
      const el = refs.current[current.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = window.scrollY + rect.top - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
    const t = window.setTimeout(() => {
      if (step < sections.length - 1) setStep((s) => s + 1);
      else setTourActive(false);
    }, STEP_MS);
    return () => window.clearTimeout(t);
  }, [tourActive, step, paused, sections]);

  const startTour = () => {
    setStep(0);
    setPaused(false);
    setTourActive(true);
  };

  const stopTour = () => {
    setTourActive(false);
    setPaused(false);
  };

  const current = tourActive ? sections[step] : null;
  const narration = current ? TOUR_NARRATION[current.id] : null;
  const tone = current ? TONE[current.tone] : null;

  return (
    <>
      {/* Tour CTA */}
      <div
        className="rounded-xl border-2 p-3.5 flex items-center gap-3"
        style={{
          background: "hsl(var(--primary) / 0.08)",
          borderColor: "hsl(var(--primary) / 0.45)",
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
        >
          <Play className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-black text-foreground leading-tight">
            Take the 5-step guided tour
          </p>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            We'll walk you through every layer of the platform with narration.
          </p>
        </div>
        <button
          type="button"
          onClick={startTour}
          className="text-[11px] font-black uppercase tracking-[0.12em] px-3 py-2 rounded-lg flex-shrink-0"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Play
        </button>
      </div>

      {/* The sections */}
      <div className="space-y-2.5 mt-3">
        {sections.map((s, i) => (
          <MobileSection
            key={s.id}
            section={s}
            open={!!open[s.id]}
            onToggle={() =>
              setOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
            }
            sectionRef={(el) => { refs.current[s.id] = el; }}
          />
        ))}
      </div>

      {/* Narration overlay (sticky bottom) while tour is active */}
      <AnimatePresence>
        {tourActive && current && narration && tone && (
          <motion.div
            key="m-tour-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 pointer-events-none"
          >
            <div
              className="rounded-2xl border-2 p-3.5 pointer-events-auto"
              style={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--primary) / 0.55)",
                boxShadow: "0 20px 50px -16px hsl(var(--primary) / 0.5)",
              }}
            >
              {/* progress dots */}
              <div className="flex gap-1 mb-2">
                {sections.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-[3px] rounded-full"
                    style={{
                      background: i <= step ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.12)",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p
                  className="text-[10px] font-black tracking-[0.18em] uppercase"
                  style={{ color: tone.kicker }}
                >
                  Step {step + 1} / {sections.length} · {current.kicker}
                </p>
                <button
                  type="button"
                  onClick={stopTour}
                  aria-label="Close tour"
                  className="text-muted-foreground -mt-1 -mr-1 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[14px] font-black text-foreground leading-tight mb-1">
                {narration.headline}
              </p>
              <p className="text-[12.5px] text-muted-foreground leading-snug">
                {narration.body}
              </p>
              <div className="flex items-center justify-between gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground disabled:opacity-30"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="text-[11px] font-bold text-foreground/80"
                >
                  {paused ? "Resume" : "Pause"}
                </button>
                {step < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black"
                    style={{
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopTour}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black"
                    style={{
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

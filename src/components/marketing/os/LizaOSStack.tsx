import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, FileSpreadsheet, Mail, MessagesSquare, Cloud,
  Network, ShieldCheck, GitBranch, History, KeySquare,
  Workflow, Eye, Layers as LayersIcon, BookOpen,
  Bot, Sparkles, Search, FileCheck2, Plus, Cpu, ArrowLeftRight,
  Boxes, RefreshCw,
} from "lucide-react";

/* ---------- types ---------- */
type Tone = "data" | "core" | "native" | "apps" | "fabric" | "graph-sys" | "graph-art";
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
  kicker: "Center — where you work",
  title: "Liza Native Surfaces",
  sub: "Your primary execution space. Workbooks, Extraction, Oversight. ChatGPT, Claude, and custom agents run inside them against the right governed bundle.",
  expanded: "This is where the work moves to. Teams stop bouncing between vendor chats, wikis, and trackers. They execute inside Liza, with the Judgment Core supplying the standards and the artifact graph keeping every output in sync everywhere it needs to live.",
  tone: "native",
  items: [
    { label: "Workbooks", icon: <Workflow className="w-4 h-4" />, tag: "Execute", detail: "Where work happens. Each Workbook hosts ChatGPT, Claude, and custom agents, all reading the governed bundle for that workflow." },
    { label: "ChatGPT · Claude · Agents", icon: <Bot className="w-4 h-4" />, tag: "Inside", detail: "Frontier models and custom agents run inside Workbooks. They never see raw context, only the bundle that matches the job." },
    { label: "Extraction Engine", icon: <Sparkles className="w-4 h-4" />, tag: "Capture", detail: "Pulls tacit judgment out of process docs, transcripts, senior interviews. Expertise that was never written down becomes a structured asset." },
    { label: "Oversight", icon: <Eye className="w-4 h-4" />, tag: "Govern", detail: "See what teams execute, where drift happens, what needs re-encoding. The control surface for the standards layer." },
  ],
};

/* LEFT — Source Systems. Bidirectional. */
const SOURCE_SYSTEMS: Layer = {
  id: "data",
  kicker: "Left — your source systems",
  title: "Source Systems",
  sub: "Your existing estate. Liza reads from them and writes back to them. Your data stays where it lives.",
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
  kicker: "Right — connected AI tools",
  title: "Connected AI Tools",
  sub: "Third-party AI you already own. Liza feeds them governed context and syncs artifacts back, so their answers stay consistent with everything else.",
  expanded: "These tools each invent answers from generic training data today. Connect them to Liza and they read your standards, mandates, and the artifact graph. When something changes inside Liza, it propagates outward; when work happens in them, it flows back.",
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
  kicker: "The center — Judgment Core",
  title: "Judgment Core",
  sub: "Two knowledge graphs running in parallel. One holds the systemic logic of how your company decides. The other holds the live artifacts that work produces — wherever they live.",
  expanded: "Most knowledge tools track one thing. Liza tracks two motions in lockstep: the standards that govern decisions, and the artifacts those decisions produce. When a standard changes, the artifacts that depend on it know. When an artifact changes anywhere — inside Liza, in your source systems, in your third-party tools — the graph stays consistent.",
};

/* Two sub-graphs inside the Judgment Core */
const SYSTEMIC_GRAPH: Item[] = [
  { label: "Decision logic & playbooks", icon: <Network className="w-4 h-4" />, detail: "How your company decides. Concepts, standards, decisions, and the relationships between them." },
  { label: "Mandates & directives", icon: <ShieldCheck className="w-4 h-4" />, detail: "Non-negotiable constraints enforced at execution time. Policy stops being a PDF and becomes a runtime check." },
  { label: "Process intelligence", icon: <Workflow className="w-4 h-4" />, detail: "How work actually flows. Captured from your systems and your people, not assumed." },
];

const ARTIFACT_GRAPH: Item[] = [
  { label: "Native artifacts (inside Liza)", icon: <Boxes className="w-4 h-4" />, detail: "Outputs produced inside Workbooks. Versioned, governed, linked back to the standard that produced them." },
  { label: "Non-native artifacts (in your stack)", icon: <RefreshCw className="w-4 h-4" />, detail: "Files in Drive, records in databases, pages in Notion, drafts in Copilot. Tracked and synced so updates propagate." },
  { label: "Live sync across the estate", icon: <ArrowLeftRight className="w-4 h-4" />, detail: "Two-way. When Liza updates an artifact, the source system reflects it. When the source changes, Liza catches it." },
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

/* ---------- tone tokens ---------- */
const TONE: Record<Tone, { ring: string; bg: string; chipBg: string; chipBorder: string; accent: string; kicker: string }> = {
  apps:        { ring: "hsl(var(--muted-foreground) / 0.25)", bg: "hsl(var(--muted) / 0.4)",       chipBg: "hsl(var(--background))",          chipBorder: "hsl(var(--border))",                accent: "hsl(var(--muted-foreground))",  kicker: "hsl(var(--muted-foreground))" },
  native:      { ring: "hsl(var(--brand-green) / 0.45)",      bg: "hsl(var(--brand-green) / 0.06)",chipBg: "hsl(var(--brand-green) / 0.10)",  chipBorder: "hsl(var(--brand-green) / 0.30)",    accent: "hsl(var(--brand-green))",       kicker: "hsl(var(--brand-green))" },
  core:        { ring: "hsl(var(--primary) / 0.55)",          bg: "hsl(var(--primary) / 0.08)",    chipBg: "hsl(var(--primary) / 0.12)",       chipBorder: "hsl(var(--primary) / 0.35)",        accent: "hsl(var(--primary))",           kicker: "hsl(var(--primary))" },
  data:        { ring: "hsl(var(--foreground) / 0.15)",       bg: "hsl(var(--card))",              chipBg: "hsl(var(--background))",           chipBorder: "hsl(var(--border))",                accent: "hsl(var(--foreground) / 0.7)",  kicker: "hsl(var(--muted-foreground))" },
  fabric:      { ring: "hsl(var(--foreground) / 0.18)",       bg: "hsl(var(--foreground) / 0.04)", chipBg: "hsl(var(--background))",           chipBorder: "hsl(var(--foreground) / 0.18)",     accent: "hsl(var(--foreground) / 0.75)", kicker: "hsl(var(--muted-foreground))" },
  "graph-sys": { ring: "hsl(var(--primary) / 0.40)",          bg: "hsl(var(--primary) / 0.06)",    chipBg: "hsl(var(--primary) / 0.10)",       chipBorder: "hsl(var(--primary) / 0.30)",        accent: "hsl(var(--primary))",           kicker: "hsl(var(--primary))" },
  "graph-art": { ring: "hsl(var(--brand-green) / 0.40)",      bg: "hsl(var(--brand-green) / 0.05)",chipBg: "hsl(var(--brand-green) / 0.10)",  chipBorder: "hsl(var(--brand-green) / 0.30)",    accent: "hsl(var(--brand-green))",       kicker: "hsl(var(--brand-green))" },
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
      <h3 className="text-base md:text-lg font-black leading-tight mb-2 text-foreground">{layer.title}</h3>
      <p className="text-[12px] leading-relaxed text-muted-foreground mb-4">{layer.sub}</p>
      <div className="flex flex-col gap-2 flex-1">
        {layer.items.map((it) => (
          <Chip
            key={it.label}
            item={it}
            tone={layer.tone}
            open={openItem === it.label}
            onToggle={() => setOpenItem(openItem === it.label ? null : it.label)}
          />
        ))}
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
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
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
          <h3 className="text-2xl md:text-3xl font-black leading-tight mb-2 text-foreground">{layer.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto">{layer.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {layer.items.map((it) => (
            <Chip
              key={it.label}
              item={it}
              tone={layer.tone}
              open={openItem === it.label}
              onToggle={() => setOpenItem(openItem === it.label ? null : it.label)}
            />
          ))}
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
    <div className="hidden lg:flex items-center justify-center">
      <div className="flex flex-col items-center gap-1.5">
        <ArrowLeftRight className="w-5 h-5" style={{ color: "hsl(var(--primary) / 0.7)" }} />
        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground text-center leading-tight whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ---------- Judgment Core block — two motions ---------- */
function JudgmentCoreBlock() {
  const t = TONE.core;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative rounded-2xl border-2 overflow-hidden"
      style={{ background: t.bg, borderColor: t.ring, boxShadow: `0 20px 60px -30px ${t.accent}` }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: t.accent, opacity: 0.7 }} />
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>
            {JUDGMENT_CORE_DESC.kicker}
          </p>
          <h3 className="text-2xl md:text-3xl font-black leading-tight mb-2 text-foreground">{JUDGMENT_CORE_DESC.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto">{JUDGMENT_CORE_DESC.sub}</p>
        </div>

        {/* Two parallel knowledge graphs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <SubGraph
            tone="graph-sys"
            label="Motion 1"
            title="Systemic knowledge graph"
            sub="The logic of how your company decides."
            items={SYSTEMIC_GRAPH}
            openItem={openItem}
            setOpenItem={setOpenItem}
          />
          <SubGraph
            tone="graph-art"
            label="Motion 2"
            title="Artifact knowledge graph"
            sub="Every artifact, native or not, kept in sync."
            items={ARTIFACT_GRAPH}
            openItem={openItem}
            setOpenItem={setOpenItem}
          />
        </div>

        {/* Shared governance bar */}
        <div
          className="rounded-xl border p-4"
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

/* ---------- main stack ---------- */
export function LizaOSStack() {
  return (
    <div className="relative">
      {/* TOP ROW: Source Systems  <->  Native Surfaces (center)  <->  Connected Tools */}
      <div className="grid lg:grid-cols-[1fr_28px_1.6fr_28px_1fr] gap-3 items-stretch">
        <SidePanel layer={SOURCE_SYSTEMS} align="left" />
        <SyncArrow label="read & write" />
        <CenterNativeSurfaces layer={NATIVE_SURFACES} />
        <SyncArrow label="sync both ways" />
        <SidePanel layer={CONNECTED_TOOLS} align="right" />
      </div>

      <Connector label="every surface above executes against the Judgment Core" />

      {/* JUDGMENT CORE — two motions */}
      <JudgmentCoreBlock />

      <Connector label="runs on top of any model" />

      {/* MODEL FABRIC */}
      <ModelFabricRow />
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, FileSpreadsheet, Mail, MessagesSquare, Cloud,
  Network, ShieldCheck, GitBranch, History, KeySquare,
  Workflow, Eye, Layers as LayersIcon, BookOpen,
  Bot, Sparkles, Search, FileCheck2, Plus,
} from "lucide-react";

/* ---------- types ---------- */
type Item = { label: string; icon: React.ReactNode; tag?: string; detail: string };
type Layer = {
  id: string;
  kicker: string;
  title: string;
  sub: string;
  expanded: string;
  tone: "data" | "kernel" | "native" | "apps";
  items: Item[];
};

/* ---------- data ---------- */
const LAYERS: Layer[] = [
  {
    id: "apps",
    kicker: "Layer 04",
    title: "Application layer",
    sub: "Every AI tool you already own becomes an app on top of LIZA OS. Same governed knowledge. Consistent behaviour everywhere.",
    expanded: "Today these tools each invent their own answers from generic training data. Plugged into LIZA OS, they inherit your standards, mandates, and audit trail. The kernel decides what they are allowed to know and say. Procurement stops being a feature comparison and starts being a layering decision.",
    tone: "apps",
    items: [
      { label: "Microsoft Copilot", icon: <Sparkles className="w-4 h-4" />, detail: "Copilot answers stop being generic. It speaks your company's standards because the kernel feeds it your governed bundles instead of raw SharePoint sprawl." },
      { label: "Glean", icon: <Search className="w-4 h-4" />, detail: "Search results carry judgment, not just relevance. The kernel ranks and filters by your mandates and current playbooks." },
      { label: "ChatGPT / Claude", icon: <Bot className="w-4 h-4" />, detail: "Frontier models read from the same governed context as every other surface. No more prompt-by-prompt reinvention." },
      { label: "Veeva / NesGPT", icon: <FileCheck2 className="w-4 h-4" />, detail: "Industry stacks (life sciences, banking) consume the same standards layer. GxP and risk constraints execute consistently across vendors." },
      { label: "Notion AI", icon: <BookOpen className="w-4 h-4" />, detail: "Workspace AI answers from the kernel, not from arbitrary pages. The wiki stops being the source of truth and becomes a surface." },
      { label: "Custom agents", icon: <Workflow className="w-4 h-4" />, detail: "Internal agents and copilots get a single API for governed knowledge. You build agents instead of re-building context." },
    ],
  },
  {
    id: "native",
    kicker: "Layer 03",
    title: "Native applications",
    sub: "The applications LIZA ships with the OS. Built directly on the kernel, designed to run executable knowledge end to end.",
    expanded: "These are LIZA's first-party apps. They show what the kernel makes possible when an application is designed for governed execution from day one. They are also where the loop closes: capture, compose, execute, oversee.",
    tone: "native",
    items: [
      { label: "Workbooks", icon: <Workflow className="w-4 h-4" />, tag: "Execute", detail: "Where work happens. Each workbook runs against a specific bundle, so the AI inside operates with the right standard for that workflow." },
      { label: "Extraction Engine", icon: <Sparkles className="w-4 h-4" />, tag: "Capture", detail: "Pulls tacit judgment out of process docs, transcripts, and senior interviews. The expertise that was never written down becomes a structured asset." },
      { label: "Oversight", icon: <Eye className="w-4 h-4" />, tag: "Govern", detail: "See what teams execute, where drift happens, what needs re-encoding. The control surface for the standards layer." },
      { label: "Context Bundles", icon: <LayersIcon className="w-4 h-4" />, tag: "Compose", detail: "Playbooks, Procedures, Directives, Principles, Knowledge composed into deployable units. Versioned, governed, portable." },
    ],
  },
  {
    id: "kernel",
    kicker: "Layer 02",
    title: "The kernel",
    sub: "The knowledge graph and governance services every AI surface above must consume to act with judgment. One source of truth. Versioned, mandated, audited.",
    expanded: "The kernel is what makes this an OS rather than a product. It governs which knowledge is current, who can use it, how it is enforced, and what was done with it. Everything above it inherits the same definition of how the company decides.",
    tone: "kernel",
    items: [
      { label: "Knowledge graph", icon: <Network className="w-4 h-4" />, detail: "The structured map of how your company decides. Concepts, standards, decisions, and the relationships between them. Every AI surface reads from here." },
      { label: "Mandates & directives", icon: <ShieldCheck className="w-4 h-4" />, detail: "Non-negotiable constraints enforced at execution time. Compliance and policy stop being a PDF and become a runtime check." },
      { label: "Versioning", icon: <GitBranch className="w-4 h-4" />, detail: "Knowledge as code. Every standard has a history, an owner, a diff, and a release. Drift becomes visible instead of silent." },
      { label: "Audit trail", icon: <History className="w-4 h-4" />, detail: "Every execution records which bundle, which version, which mandate. Auditing happens in execution, not after." },
      { label: "Access & roles", icon: <KeySquare className="w-4 h-4" />, detail: "Who can author, who can execute, who can override. The standards layer is governed like infrastructure, not like a wiki." },
    ],
  },
  {
    id: "data",
    kicker: "Layer 01",
    title: "Your sources",
    sub: "The systems and people the kernel reads from. Liza absorbs them. They stay where they are.",
    expanded: "LIZA does not replace your systems of record. It absorbs from them, structures the judgment that lives across them, and gives that judgment back to every surface that needs it. Your data stays where it is. Your standards become portable.",
    tone: "data",
    items: [
      { label: "Drive / SharePoint", icon: <Cloud className="w-4 h-4" />, detail: "Your existing document estate. The kernel reads it for context but does not depend on its structure for governance." },
      { label: "Databases", icon: <Database className="w-4 h-4" />, detail: "Operational and analytical data. The kernel grounds standards in real numbers, not abstract policy." },
      { label: "Documents", icon: <FileSpreadsheet className="w-4 h-4" />, detail: "Process docs, SOPs, decks, models. Source material for the extraction engine to turn into structured knowledge." },
      { label: "Email & chat", icon: <Mail className="w-4 h-4" />, detail: "Where decisions actually happen. Captured, not stored, so judgment is recovered, not lost." },
      { label: "Senior interviews", icon: <MessagesSquare className="w-4 h-4" />, detail: "The tacit layer. The thinking your best people never wrote down, externalised into bundles before they leave." },
    ],
  },
];

/* ---------- tone tokens ---------- */
const TONE: Record<Layer["tone"], { ring: string; bg: string; chipBg: string; chipBorder: string; accent: string; kicker: string }> = {
  apps:   { ring: "hsl(var(--muted-foreground) / 0.25)", bg: "hsl(var(--muted) / 0.4)",      chipBg: "hsl(var(--background))",            chipBorder: "hsl(var(--border))",                accent: "hsl(var(--muted-foreground))", kicker: "hsl(var(--muted-foreground))" },
  native: { ring: "hsl(var(--brand-green) / 0.45)",      bg: "hsl(var(--brand-green) / 0.06)",chipBg: "hsl(var(--brand-green) / 0.10)",   chipBorder: "hsl(var(--brand-green) / 0.30)",    accent: "hsl(var(--brand-green))",      kicker: "hsl(var(--brand-green))" },
  kernel: { ring: "hsl(var(--primary) / 0.55)",          bg: "hsl(var(--primary) / 0.08)",    chipBg: "hsl(var(--primary) / 0.12)",        chipBorder: "hsl(var(--primary) / 0.35)",        accent: "hsl(var(--primary))",          kicker: "hsl(var(--primary))" },
  data:   { ring: "hsl(var(--foreground) / 0.15)",       bg: "hsl(var(--card))",              chipBg: "hsl(var(--background))",            chipBorder: "hsl(var(--border))",                accent: "hsl(var(--foreground) / 0.7)", kicker: "hsl(var(--muted-foreground))" },
};

/* ---------- chip ---------- */
function Chip({
  item,
  tone,
  open,
  onToggle,
}: {
  item: Item;
  tone: Layer["tone"];
  open: boolean;
  onToggle: () => void;
}) {
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
          <Plus
            className="w-3 h-3 transition-transform"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          />
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

/* ---------- layer block ---------- */
function LayerBlock({ layer, index }: { layer: Layer; index: number }) {
  const t = TONE[layer.tone];
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="relative rounded-2xl border overflow-hidden transition-colors"
      style={{ background: t.bg, borderColor: t.ring }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: t.accent, opacity: 0.55 }} />
      <div className="grid md:grid-cols-[260px_1fr] gap-6 p-6 md:p-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: t.kicker }}>
            {layer.kicker}
          </p>
          <h3 className="text-xl md:text-2xl font-black leading-tight mb-2 text-foreground">{layer.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{layer.sub}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80"
            style={{ color: t.accent }}
          >
            <Plus
              className="w-3 h-3 transition-transform"
              style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}
            />
            {expanded ? "Less" : "Why this layer"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden text-[12.5px] leading-relaxed text-foreground/80"
              >
                {layer.expanded}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 self-start content-start">
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
      </div>
    </motion.div>
  );
}

/* ---------- connector ---------- */
function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-2">
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
      <LayerBlock layer={LAYERS[0]} index={0} />
      <Connector label="consume governed context" />
      <LayerBlock layer={LAYERS[1]} index={1} />
      <Connector label="run on the kernel" />
      <LayerBlock layer={LAYERS[2]} index={2} />
      <Connector label="reads from" />
      <LayerBlock layer={LAYERS[3]} index={3} />
    </div>
  );
}
import { motion } from "framer-motion";
import {
  Database, FileSpreadsheet, Mail, MessagesSquare, Cloud,
  Network, ShieldCheck, GitBranch, History, KeySquare,
  Workflow, Eye, Layers as LayersIcon, BookOpen,
  Bot, Sparkles, Search, FileCheck2,
} from "lucide-react";

/* ---------- types ---------- */
type Item = { label: string; icon: React.ReactNode; tag?: string };
type Layer = {
  id: string;
  kicker: string;
  title: string;
  sub: string;
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
    tone: "apps",
    items: [
      { label: "Microsoft Copilot", icon: <Sparkles className="w-4 h-4" /> },
      { label: "Glean", icon: <Search className="w-4 h-4" /> },
      { label: "ChatGPT / Claude", icon: <Bot className="w-4 h-4" /> },
      { label: "Veeva / NesGPT", icon: <FileCheck2 className="w-4 h-4" /> },
      { label: "Notion AI", icon: <BookOpen className="w-4 h-4" /> },
      { label: "Custom agents", icon: <Workflow className="w-4 h-4" /> },
    ],
  },
  {
    id: "native",
    kicker: "Layer 03",
    title: "Native applications",
    sub: "The applications LIZA ships with the OS. Built directly on the kernel, designed to run executable knowledge end to end.",
    tone: "native",
    items: [
      { label: "Workbooks", icon: <Workflow className="w-4 h-4" />, tag: "Execute" },
      { label: "Extraction Engine", icon: <Sparkles className="w-4 h-4" />, tag: "Capture" },
      { label: "Oversight", icon: <Eye className="w-4 h-4" />, tag: "Govern" },
      { label: "Context Bundles", icon: <LayersIcon className="w-4 h-4" />, tag: "Compose" },
    ],
  },
  {
    id: "kernel",
    kicker: "Layer 02",
    title: "The kernel",
    sub: "The knowledge graph and governance services every AI surface above must consume to act with judgment. One source of truth. Versioned, mandated, audited.",
    tone: "kernel",
    items: [
      { label: "Knowledge graph", icon: <Network className="w-4 h-4" /> },
      { label: "Mandates & directives", icon: <ShieldCheck className="w-4 h-4" /> },
      { label: "Versioning", icon: <GitBranch className="w-4 h-4" /> },
      { label: "Audit trail", icon: <History className="w-4 h-4" /> },
      { label: "Access & roles", icon: <KeySquare className="w-4 h-4" /> },
    ],
  },
  {
    id: "data",
    kicker: "Layer 01",
    title: "Your sources",
    sub: "The systems and people the kernel reads from. Liza absorbs them. They stay where they are.",
    tone: "data",
    items: [
      { label: "Drive / SharePoint", icon: <Cloud className="w-4 h-4" /> },
      { label: "Databases", icon: <Database className="w-4 h-4" /> },
      { label: "Documents", icon: <FileSpreadsheet className="w-4 h-4" /> },
      { label: "Email & chat", icon: <Mail className="w-4 h-4" /> },
      { label: "Senior interviews", icon: <MessagesSquare className="w-4 h-4" /> },
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
function Chip({ item, tone }: { item: Item; tone: Layer["tone"] }) {
  const t = TONE[tone];
  return (
    <div
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"
      style={{ background: t.chipBg, borderColor: t.chipBorder, color: t.accent }}
    >
      <span className="opacity-90">{item.icon}</span>
      <span className="text-foreground/85">{item.label}</span>
      {item.tag && (
        <span
          className="ml-auto text-[9px] tracking-widest font-black uppercase px-1.5 py-0.5 rounded"
          style={{ background: "hsl(var(--background))", color: t.accent, border: `1px solid ${t.chipBorder}` }}
        >
          {item.tag}
        </span>
      )}
    </div>
  );
}

/* ---------- layer block ---------- */
function LayerBlock({ layer, index }: { layer: Layer; index: number }) {
  const t = TONE[layer.tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="relative rounded-2xl border overflow-hidden"
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
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 self-center">
          {layer.items.map((it) => <Chip key={it.label} item={it} tone={layer.tone} />)}
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
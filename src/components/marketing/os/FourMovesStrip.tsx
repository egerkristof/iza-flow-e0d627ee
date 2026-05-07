import { motion } from "framer-motion";
import {
  Radar, Scale, Workflow as WorkflowIcon, Share2,
  FileText, Database, Mic, ArrowRight, ShieldCheck, AlertTriangle,
  CheckCircle2, Sparkles, GitBranch, RefreshCw,
} from "lucide-react";
import { SectionTag, GradientText } from "@/components/marketing/home/shared";

/**
 * FourMovesStrip
 * Sense -> Decide -> Execute -> Propagate
 * Each move ships with a mini diagram so the abstract verbs become tangible
 * before the user reaches the interactive stack below.
 */

const TOKEN_BG = "hsl(var(--primary) / 0.04)";
const TOKEN_PILL = "hsl(var(--primary) / 0.1)";
const PRIMARY = "hsl(var(--primary))";
const SUCCESS = "hsl(var(--success, 142 71% 45%))";
const DANGER = "hsl(var(--destructive))";

function MoveFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full h-32 mb-4 overflow-hidden rounded-xl"
      style={{ background: TOKEN_BG }}
    >
      {children}
    </div>
  );
}

function Pill({
  icon, label, x, y, delay = 0, tone = "primary",
}: {
  icon: React.ReactNode; label: string; x: string; y: string; delay?: number;
  tone?: "primary" | "success" | "danger";
}) {
  const color =
    tone === "success" ? SUCCESS : tone === "danger" ? DANGER : PRIMARY;
  return (
    <motion.div
      className="absolute flex items-center gap-1 px-1.5 py-1 rounded-md text-[9px] font-bold"
      style={{
        left: x, top: y,
        background: `${color.replace(")", " / 0.1)").replace("hsl(", "hsl(")}`,
        color,
      }}
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35 }}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

/* ---- Visual 1: SENSE ---------------------------------------------------- */
function SenseVisual() {
  return (
    <MoveFrame>
      {/* sources on the left */}
      <Pill icon={<FileText className="w-2.5 h-2.5" />} label="SOPs" x="10px" y="14px" delay={0.1} />
      <Pill icon={<Database className="w-2.5 h-2.5" />} label="Veeva / LIMS" x="10px" y="48px" delay={0.2} />
      <Pill icon={<Mic className="w-2.5 h-2.5" />} label="Expert tacit" x="10px" y="82px" delay={0.3} />

      {/* converging arrows */}
      {[14, 48, 82].map((y, i) => (
        <motion.div
          key={y}
          className="absolute"
          style={{ left: 92, top: y + 6, color: PRIMARY }}
          initial={{ opacity: 0, x: -4 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>
      ))}

      {/* unified context object on the right */}
      <motion.div
        className="absolute right-3 top-4 bottom-4 w-[110px] rounded-lg border-2 flex flex-col items-center justify-center"
        style={{ borderColor: `${PRIMARY}40`, background: "hsl(var(--background))" }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <Sparkles className="w-4 h-4 mb-1" style={{ color: PRIMARY }} />
        <span className="text-[9px] font-black" style={{ color: PRIMARY }}>UNIFIED CONTEXT</span>
        <span className="text-[8px] text-muted-foreground mt-0.5">structured + tacit</span>
      </motion.div>
    </MoveFrame>
  );
}

/* ---- Visual 2: DECIDE --------------------------------------------------- */
function DecideVisual() {
  return (
    <MoveFrame>
      {/* Incoming request */}
      <motion.div
        className="absolute left-3 top-1/2 -translate-y-1/2 px-2 py-1.5 rounded-md text-[9px] font-bold border"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        AI request
      </motion.div>

      {/* Standard checkpoint */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: PRIMARY, background: "hsl(var(--background))" }}
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <ShieldCheck className="w-6 h-6" style={{ color: PRIMARY }} />
      </motion.div>
      <span
        className="absolute left-1/2 -translate-x-1/2 bottom-1 text-[8px] font-bold tracking-wide"
        style={{ color: PRIMARY }}
      >
        STANDARD
      </span>

      {/* Two outcomes */}
      <motion.div
        className="absolute right-3 top-3 flex items-center gap-1 px-1.5 py-1 rounded-md text-[9px] font-bold"
        style={{ background: "hsl(var(--success, 142 71% 45%) / 0.12)", color: SUCCESS }}
        initial={{ opacity: 0, x: 6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.3 }}
      >
        <CheckCircle2 className="w-2.5 h-2.5" /> Allowed
      </motion.div>
      <motion.div
        className="absolute right-3 bottom-7 flex items-center gap-1 px-1.5 py-1 rounded-md text-[9px] font-bold"
        style={{ background: "hsl(var(--destructive) / 0.12)", color: DANGER }}
        initial={{ opacity: 0, x: 6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        <AlertTriangle className="w-2.5 h-2.5" /> Blocked
      </motion.div>
    </MoveFrame>
  );
}

/* ---- Visual 3: EXECUTE -------------------------------------------------- */
function ExecuteVisual() {
  return (
    <MoveFrame>
      {/* surface frame */}
      <motion.div
        className="absolute inset-3 rounded-lg border flex flex-col"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div
          className="flex items-center justify-between px-2 py-1 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <span className="text-[8px] font-bold text-muted-foreground tracking-wide">WORKBOOK · BATCH 0421</span>
          <span
            className="text-[8px] font-bold px-1 py-0.5 rounded"
            style={{ background: TOKEN_PILL, color: PRIMARY }}
          >
            GxP BUNDLE
          </span>
        </div>
        <div className="flex-1 flex">
          {/* agents column */}
          <div className="flex-1 px-2 py-1.5 space-y-1 border-r" style={{ borderColor: "hsl(var(--border))" }}>
            {["Copilot", "Claude", "Internal agent"].map((a, i) => (
              <motion.div
                key={a}
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: SUCCESS }} />
                <span className="text-[9px] text-muted-foreground">{a}</span>
              </motion.div>
            ))}
          </div>
          {/* output column */}
          <div className="flex-1 px-2 py-1.5">
            <motion.div
              className="text-[8px] font-bold mb-1"
              style={{ color: PRIMARY }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              Native artifact
            </motion.div>
            <div className="space-y-0.5">
              {[1, 0.7, 0.85].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full"
                  style={{ background: "hsl(var(--muted-foreground) / 0.18)", width: `${w * 100}%` }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </MoveFrame>
  );
}

/* ---- Visual 4: PROPAGATE ----------------------------------------------- */
function PropagateVisual() {
  const NODES = [
    { id: "src", label: "SOP v3.2", x: 14, y: 50, root: true },
    { id: "a", label: "CAPA", x: 100, y: 18 },
    { id: "b", label: "Deviation", x: 100, y: 50 },
    { id: "c", label: "Batch record", x: 100, y: 82 },
    { id: "d", label: "Dossier", x: 200, y: 50 },
  ];
  const LINKS: [string, string][] = [
    ["src", "a"], ["src", "b"], ["src", "c"], ["b", "d"],
  ];
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  return (
    <MoveFrame>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 110" preserveAspectRatio="none">
        {LINKS.map(([from, to], i) => (
          <motion.line
            key={`${from}-${to}`}
            x1={byId[from].x + 22}
            y1={byId[from].y + 6}
            x2={byId[to].x}
            y2={byId[to].y + 6}
            stroke={PRIMARY}
            strokeOpacity={0.5}
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <motion.div
          key={n.id}
          className="absolute px-1.5 py-1 rounded-md text-[9px] font-bold flex items-center gap-1"
          style={{
            left: n.x, top: n.y,
            background: n.root ? PRIMARY : TOKEN_PILL,
            color: n.root ? "hsl(var(--primary-foreground))" : PRIMARY,
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
        >
          {n.root ? <GitBranch className="w-2.5 h-2.5" /> : <RefreshCw className="w-2.5 h-2.5" />}
          <span className="whitespace-nowrap">{n.label}</span>
        </motion.div>
      ))}
      <span
        className="absolute right-2 bottom-1 text-[8px] font-bold tracking-wide"
        style={{ color: PRIMARY }}
      >
        AUTO-UPDATED
      </span>
    </MoveFrame>
  );
}

const MOVES = [
  {
    icon: <Radar className="w-5 h-5" />,
    title: "Sense",
    sub: "Capture context that was never written down.",
    body: "Pull from your systems and your people. Tacit judgment, SOPs, and live operational data become one structured context surface.",
    example: "Pharma: SOPs + Veeva data + QA expert review converge into a single GxP context bundle.",
    visual: <SenseVisual />,
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Decide",
    sub: "Policy stops being a PDF.",
    body: "Standards, mandates, and playbooks become a runtime check that every AI request must pass. Decisions are inspectable, auditable, versioned.",
    example: "Banking: a pricing AI cannot publish a quote that violates the credit policy. The block is logged.",
    visual: <DecideVisual />,
  },
  {
    icon: <WorkflowIcon className="w-5 h-5" />,
    title: "Execute",
    sub: "Teams and AI agents working in one space.",
    body: "Copilot, Claude, internal agents, and your people all operate inside the same governed workbook. The right bundle is loaded automatically.",
    example: "Aerospace: a mission engineer and three agents collaborate on a flight readiness brief, all bound to the same standard.",
    visual: <ExecuteVisual />,
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Propagate",
    sub: "Change once. Update everywhere.",
    body: "When a standard or upstream artifact changes, every dependent output is regenerated, not just flagged. Contradictions resolve across the chain.",
    example: "Pharma: revising one SOP cascades through CAPAs, deviations, batch records, and dossier sections.",
    visual: <PropagateVisual />,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" as const },
  }),
};

export function FourMovesStrip() {
  return (
    <section className="py-16 md:py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="What the system actually does" />
          <h2 className="text-3xl md:text-4xl font-black">
            Four moves.{" "}
            <GradientText>Run continuously.</GradientText>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            One closed loop. The diagram below is this loop, made interactive for your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOVES.map((m, i) => (
            <motion.div
              key={m.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              className="rounded-2xl border p-5 flex flex-col"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: TOKEN_PILL, color: PRIMARY }}
                >
                  {m.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-black mb-1">{m.title}</h3>
              <p className="text-[12px] font-bold text-foreground/80 mb-3">{m.sub}</p>

              {m.visual}

              <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-3">
                {m.body}
              </p>
              <div
                className="mt-auto rounded-md px-2.5 py-2 text-[11px] leading-snug"
                style={{ background: TOKEN_BG, color: "hsl(var(--foreground))" }}
              >
                <span className="font-bold" style={{ color: PRIMARY }}>Example. </span>
                {m.example}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import {
  Globe2,
  BrainCircuit,
  ShieldCheck,
  Rocket,
  RefreshCw,
  BookOpen,
  Gauge,
  DoorOpen,
  Scale,
  Workflow,
} from "lucide-react";

/**
 * StandardLayerDiagram
 *
 * 1:1 logical adaptation of Regen AI's "Decision Layer" infographic, rebuilt
 * in LIZA's vocabulary and design tokens.
 *
 * Vertical 5-block flow:
 *   Reality  ->  AI Layer  ->  [THE STANDARD LAYER + 5 pillars]  ->  Execution  ->  Outcomes & Learning
 *
 * The middle band is the lit, primary-tinted "missing layer" claim.
 * Side captions echo Regen's annotation pattern.
 */

type Pillar = {
  label: string;
  icon: React.ReactNode;
  sub: string;
};

const PILLARS: Pillar[] = [
  {
    label: "Standards",
    icon: <BookOpen className="w-7 h-7" />,
    sub: "Structure and context for every decision.",
  },
  {
    label: "Context Quality",
    icon: <Gauge className="w-7 h-7" />,
    sub: "Measure how complete your standard is, continuously.",
  },
  {
    label: "Governance",
    icon: <DoorOpen className="w-7 h-7" />,
    sub: "Ensure policy, risk and regulator rules are met.",
  },
  {
    label: "Admissibility",
    icon: <Scale className="w-7 h-7" />,
    sub: "Validate every output is defensible.",
  },
  {
    label: "Orchestration",
    icon: <Workflow className="w-7 h-7" />,
    sub: "Constrain and release work to agents, people, systems.",
  },
];

const VALUES = ["Trustworthy", "Accountable", "Admissible", "Adaptive", "Impactful"];

export function StandardLayerDiagram() {
  return (
    <div
      className="relative w-full rounded-3xl border p-6 md:p-12"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none rounded-3xl"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header */}
      <div className="relative text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <h2
          className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tight"
          style={{ color: "hsl(var(--primary))" }}
        >
          The Standard Layer
        </h2>
        <p className="mt-5 text-lg md:text-xl font-semibold leading-snug text-foreground">
          Everyone is talking about it.
          <br />
          <span style={{ color: "hsl(var(--primary))" }}>
            Standards Engineering explains how to build it.
          </span>
        </p>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">
          From AI outputs to governed action.
        </p>
      </div>

      {/* Stack */}
      <div className="relative max-w-3xl mx-auto">
        <FlowBlock
          icon={<Globe2 className="w-7 h-7" />}
          title="Reality"
          body="Signals, data, events"
          examples={[
            "CRM, ERP, EHR",
            "Data warehouse",
            "Email, tickets, calls",
            "Sensors, telemetry",
            "Documents and contracts",
          ]}
          caption={{
            head: "The world",
            body: "Continuously generating signals and events.",
          }}
          index={0}
        />
        <Arrow />

        <FlowBlock
          icon={<BrainCircuit className="w-7 h-7" />}
          title="AI Layer"
          body="Models, predictions, agents"
          examples={[
            "ChatGPT, Gemini, Claude",
            "Copilot, Glean",
            "Vendor RAG and copilots",
            "In-house agents",
          ]}
          caption={{
            head: "AI processes reality",
            body: "Turning signals into predictions and options.",
          }}
          index={1}
        />
        <Arrow />

        {/* THE STANDARD LAYER — lit middle band */}
        <StandardBand index={2} />
        <Arrow />

        <FlowBlock
          icon={<Rocket className="w-7 h-7" />}
          title="Execution"
          body="People, systems, agents"
          examples={[
            "Approved drafts and decisions",
            "Workflow actions in Jira, ServiceNow",
            "Writes back to Veeva, LIMS, ERP",
            "Customer and regulator deliverables",
          ]}
          caption={{
            head: "Standards become action",
            body: "Executed in the real world through aligned resources.",
          }}
          index={3}
        />
        <Arrow />

        <FlowBlock
          icon={<RefreshCw className="w-7 h-7" />}
          title="Outcomes & Learning"
          body="Results, feedback, audit, adaptation"
          examples={[
            "KPIs and business outcomes",
            "Audit trail and lineage",
            "Regulator and board evidence",
            "Updates back into the standard",
          ]}
          caption={{
            head: "Improve and adapt",
            body: "Feedback closes the loop and updates the standard.",
          }}
          index={4}
        />
      </div>

      {/* Footer signature */}
      <div className="relative max-w-3xl mx-auto mt-10 md:mt-14">
        <div
          className="rounded-2xl border-2 p-5 md:p-6 flex items-center gap-4"
          style={{
            borderColor: "hsl(var(--primary) / 0.4)",
            background: "hsl(var(--primary) / 0.04)",
          }}
        >
          <span
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "hsl(var(--primary) / 0.12)",
              color: "hsl(var(--primary))",
              border: "1px solid hsl(var(--primary) / 0.35)",
            }}
          >
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <p
              className="text-base md:text-lg font-black leading-tight"
              style={{ color: "hsl(var(--primary))" }}
            >
              Standards Engineering
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 leading-snug">
              The science and infrastructure for governed AI at enterprise scale.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {VALUES.map((v, i) => (
            <span key={v} className="flex items-center gap-3">
              <span
                className="text-[11px] md:text-xs font-black tracking-[0.22em] uppercase"
                style={{ color: "hsl(var(--primary))" }}
              >
                {v}
              </span>
              {i < VALUES.length - 1 && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "hsl(var(--primary) / 0.4)" }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function FlowBlock({
  icon,
  title,
  body,
  examples,
  caption,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  examples?: string[];
  caption: { head: string; body: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: 0.05 * index, ease: "easeOut" }}
      className="relative grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 md:gap-6 items-center"
    >
      <div
        className="rounded-2xl border px-5 md:px-7 py-5 md:py-6 flex items-center gap-4 md:gap-5"
        style={{
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--border))",
          boxShadow: "0 8px 24px -18px hsl(var(--foreground) / 0.2)",
        }}
      >
        <span
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "hsl(var(--muted) / 0.5)",
            color: "hsl(var(--primary))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="text-lg md:text-xl font-black tracking-tight"
            style={{ color: "hsl(var(--primary))" }}
          >
            {title}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
          {examples && examples.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <span
                  key={ex}
                  className="text-[10.5px] md:text-[11px] font-semibold px-2 py-1 rounded-md"
                  style={{
                    background: "hsl(var(--primary) / 0.07)",
                    color: "hsl(var(--primary))",
                    border: "1px solid hsl(var(--primary) / 0.18)",
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side caption (hidden on small screens) */}
      <div className="hidden md:block relative pl-5">
        <span
          className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full"
          style={{ background: "hsl(var(--primary))" }}
        />
        <p
          className="text-[12px] font-black leading-tight"
          style={{ color: "hsl(var(--primary))" }}
        >
          {caption.head}
        </p>
        <p className="text-[12px] text-muted-foreground mt-1 leading-snug">
          {caption.body}
        </p>
      </div>
    </motion.div>
  );
}

function StandardBand({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: 0.05 * index, ease: "easeOut" }}
      className="relative grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 md:gap-6 items-stretch"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          border: "1px solid hsl(var(--primary) / 0.5)",
          boxShadow:
            "0 30px 80px -30px hsl(var(--primary) / 0.45), 0 0 60px -20px hsl(var(--primary) / 0.35)",
        }}
      >
        {/* Header strip */}
        <div
          className="px-6 md:px-8 py-5 text-center"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          <p className="text-xl md:text-3xl font-black tracking-tight uppercase">
            The Standard Layer
          </p>
          <p className="text-xs md:text-sm font-semibold opacity-90 mt-1">
            The missing layer between AI and action.
          </p>
        </div>

        {/* Pillars */}
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-px"
          style={{ background: "hsl(var(--primary) / 0.18)" }}
        >
          {PILLARS.map((p, i) => (
            <div
              key={p.label}
              className="px-3 py-5 flex flex-col items-center text-center"
              style={{ background: "hsl(var(--background))" }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--primary) / 0.25)",
                }}
              >
                {p.icon}
              </motion.span>
              <p
                className="text-[10.5px] md:text-[12px] font-black leading-tight uppercase tracking-[0.02em] break-words"
                style={{ color: "hsl(var(--primary))" }}
              >
                {p.label}
              </p>
              <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1.5 leading-snug">
                {p.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Side caption */}
      <div className="hidden md:block relative pl-5 self-center">
        <span
          className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full"
          style={{ background: "hsl(var(--primary))" }}
        />
        <p
          className="text-[12px] font-black leading-tight"
          style={{ color: "hsl(var(--primary))" }}
        >
          LIZA makes AI defensible
        </p>
        <p className="text-[12px] text-muted-foreground mt-1 leading-snug">
          Structure. Quality. Governance. Admissibility. Control.
        </p>
      </div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="relative my-3 md:my-4 flex justify-center md:justify-start md:pl-[3.5rem]">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <span
          className="w-px h-6"
          style={{ background: "hsl(var(--primary) / 0.5)" }}
        />
        <span
          className="w-0 h-0"
          style={{
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "6px solid hsl(var(--primary))",
          }}
        />
      </motion.div>
    </div>
  );
}
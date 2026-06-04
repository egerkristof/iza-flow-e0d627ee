import {
  Globe2,
  BrainCircuit,
  Rocket,
  RefreshCw,
  BookOpen,
  Gauge,
  DoorOpen,
  Scale,
  Workflow,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

/**
 * Canonical category slide for ScaledSlide (1920x1080) decks.
 * The Decision Layer — the missing layer between AI and action.
 *
 * Accepts optional `stages` override so vertical decks (banking, pharma, etc.)
 * can show their own real-world systems in Reality / AI / Execution / Outcomes
 * without forking the component.
 */

const PRIMARY = "hsl(200 90% 42%)";
const PRIMARY_SOFT = "hsl(200 90% 42% / 0.08)";
const PRIMARY_BORDER = "hsl(200 90% 42% / 0.28)";
const INK = "hsl(222 47% 11%)";
const MUTED = "hsl(215 15% 42%)";
const BORDER = "hsl(215 20% 88%)";

export type StageOverride = {
  title?: string;
  sub?: string;
  examples?: string[];
};

const DEFAULT_STAGES = [
  {
    title: "Reality",
    sub: "Signals, data, events",
    icon: <Globe2 className="w-7 h-7" />,
    examples: ["CRM, ERP, data warehouse", "Email, tickets, calls", "Documents, contracts", "Sensors, telemetry"],
  },
  {
    title: "AI Layer",
    sub: "Models, copilots, agents",
    icon: <BrainCircuit className="w-7 h-7" />,
    examples: ["ChatGPT, Gemini, Claude", "Copilot, Glean", "Vendor RAG", "In-house agents"],
  },
  {
    title: "Execution",
    sub: "People, systems, agents",
    icon: <Rocket className="w-7 h-7" />,
    examples: ["Approved decisions", "Jira, ServiceNow", "Writes to core systems", "Regulator deliverables"],
  },
  {
    title: "Outcomes",
    sub: "Results, audit, learning",
    icon: <RefreshCw className="w-7 h-7" />,
    examples: ["KPIs", "Audit trail & lineage", "Board / regulator evidence", "Feedback into standard"],
  },
];

const PILLARS = [
  { label: "Standards", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Context Quality", icon: <Gauge className="w-5 h-5" /> },
  { label: "Governance", icon: <DoorOpen className="w-5 h-5" /> },
  { label: "Admissibility", icon: <Scale className="w-5 h-5" /> },
  { label: "Orchestration", icon: <Workflow className="w-5 h-5" /> },
];

export function StandardLayerDeckSlide({
  eyebrow = "The category · One standard. Every AI surface inherits it.",
  footnote = "Reality → AI Layer → The Decision Layer → Execution → Outcomes.",
  stages,
}: {
  eyebrow?: string;
  footnote?: string;
  stages?: [StageOverride, StageOverride, StageOverride, StageOverride];
}) {
  const merged = DEFAULT_STAGES.map((s, i) => ({
    ...s,
    title: stages?.[i]?.title ?? s.title,
    sub: stages?.[i]?.sub ?? s.sub,
    examples: stages?.[i]?.examples ?? s.examples,
  }));

  return (
    <div
      className="w-full h-full flex flex-col relative"
      style={{ background: "hsl(0 0% 100%)", padding: "48px 64px 40px", color: INK }}
    >
      {/* Eyebrow */}
      <p
        className="font-mono uppercase"
        style={{ fontSize: 13, letterSpacing: "0.32em", color: PRIMARY, marginBottom: 14 }}
      >
        {eyebrow}
      </p>

      {/* Title */}
      <h2 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.025em", marginBottom: 6 }}>
        The Decision Layer
      </h2>
      <p style={{ fontSize: 19, color: MUTED, maxWidth: 1280, marginBottom: 24, lineHeight: 1.35 }}>
        The missing layer between your AI and real action — where standards, governance and orchestration live.
      </p>

      {/* Top row: 4 stage cards in a horizontal flow */}
      <div className="flex items-stretch gap-3 flex-1 min-h-0" style={{ marginBottom: 18 }}>
        <StageCard stage={merged[0]} />
        <FlowArrow />
        <StageCard stage={merged[1]} />
        <FlowArrow lit />
        <StageCard stage={merged[2]} />
        <FlowArrow />
        <StageCard stage={merged[3]} />
      </div>

      {/* Decision Layer band: full-width below the flow, visually "underneath" AI→Execution */}
      <div
        className="rounded-2xl flex flex-col overflow-hidden"
        style={{
          border: `1.5px solid hsl(200 90% 42% / 0.55)`,
          boxShadow:
            "0 30px 70px -30px hsl(200 90% 42% / 0.55), 0 0 50px -18px hsl(200 90% 42% / 0.35)",
        }}
      >
        <div
          className="flex items-center justify-between px-7 py-3"
          style={{ background: PRIMARY, color: "white" }}
        >
          <div>
            <p style={{ fontSize: 11, opacity: 0.85, letterSpacing: "0.28em", textTransform: "uppercase" }}>
              What LIZA installs
            </p>
            <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              The Decision Layer
            </p>
          </div>
          <p style={{ fontSize: 13, opacity: 0.9, maxWidth: 520, textAlign: "right", lineHeight: 1.3 }}>
            Sits between every AI tool and every governed action. Same standard everywhere.
          </p>
        </div>
        <div
          className="grid grid-cols-5"
          style={{ background: "hsl(200 90% 42% / 0.18)", gap: 1 }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center justify-center text-center"
              style={{ background: "hsl(0 0% 100%)", padding: "12px 8px" }}
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                style={{
                  background: PRIMARY_SOFT,
                  color: PRIMARY,
                  border: `1px solid ${PRIMARY_BORDER}`,
                }}
              >
                {p.icon}
              </span>
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 900,
                  color: PRIMARY,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1.15,
                }}
              >
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer signature row */}
      <div
        className="mt-5 flex items-center justify-between gap-6 rounded-xl px-6 py-3"
        style={{ background: PRIMARY_SOFT, border: `1px solid ${PRIMARY_BORDER}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(200 90% 42% / 0.15)", color: PRIMARY }}
          >
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: PRIMARY, lineHeight: 1.1 }}>
              Standards Engineering
            </p>
            <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
              The science and infrastructure for governed AI at enterprise scale.
            </p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: MUTED, textAlign: "right" }}>{footnote}</p>
      </div>

      {/* Gradient rule */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 4,
          background: "linear-gradient(90deg, hsl(200 90% 42%), hsl(155 72% 38%))",
        }}
      />
    </div>
  );
}

function StageCard({ stage }: { stage: { title: string; sub: string; icon: React.ReactNode; examples: string[] } }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-xl flex flex-col"
      style={{
        background: "hsl(0 0% 100%)",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 8px 24px -18px hsl(222 47% 11% / 0.18)",
        padding: "22px 22px",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(215 20% 96%)", color: PRIMARY, border: `1px solid ${BORDER}` }}
        >
          {stage.icon}
        </span>
        <div className="min-w-0">
          <p style={{ fontSize: 24, fontWeight: 900, color: PRIMARY, lineHeight: 1.1 }}>
            {stage.title}
          </p>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 2, lineHeight: 1.2 }}>{stage.sub}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {stage.examples.map((ex) => (
          <li
            key={ex}
            style={{
              fontSize: 15,
              color: INK,
              lineHeight: 1.35,
              paddingLeft: 14,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                width: 6,
                height: 6,
                borderRadius: 999,
                background: PRIMARY,
              }}
            />
            {ex}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowArrow({ lit = false }: { lit?: boolean }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 24 }}>
      <ArrowRight
        className="w-6 h-6"
        style={{ color: lit ? PRIMARY : "hsl(215 20% 70%)" }}
      />
    </div>
  );
}

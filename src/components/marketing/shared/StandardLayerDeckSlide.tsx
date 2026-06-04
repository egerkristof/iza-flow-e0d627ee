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
 * Compact 5-stage horizontal flow sized to fit a single 16:9 slide.
 * Mirrors the StandardLayerDiagram on marketing pages but in deck layout.
 * Do NOT remix per deck — update here, propagates everywhere.
 */

const PRIMARY = "hsl(200 90% 42%)";
const PRIMARY_SOFT = "hsl(200 90% 42% / 0.08)";
const PRIMARY_BORDER = "hsl(200 90% 42% / 0.25)";
const INK = "hsl(222 47% 11%)";
const MUTED = "hsl(215 15% 42%)";
const BORDER = "hsl(215 20% 88%)";

type Stage = {
  title: string;
  sub: string;
  icon: React.ReactNode;
  examples: string[];
};

const STAGES: Stage[] = [
  {
    title: "Reality",
    sub: "Signals, data, events",
    icon: <Globe2 className="w-6 h-6" />,
    examples: ["CRM, ERP, EHR", "Data warehouse", "Email, tickets, calls", "Sensors, documents"],
  },
  {
    title: "AI Layer",
    sub: "Models, copilots, agents",
    icon: <BrainCircuit className="w-6 h-6" />,
    examples: ["ChatGPT, Gemini, Claude", "Copilot, Glean", "Vendor RAG", "In-house agents"],
  },
  {
    title: "Execution",
    sub: "People, systems, agents",
    icon: <Rocket className="w-6 h-6" />,
    examples: ["Approved decisions", "Jira, ServiceNow", "Veeva, LIMS, ERP writes", "Regulator deliverables"],
  },
  {
    title: "Outcomes & Learning",
    sub: "Results, audit, adaptation",
    icon: <RefreshCw className="w-6 h-6" />,
    examples: ["KPIs", "Audit trail & lineage", "Board / regulator evidence", "Updates back into standard"],
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
}: {
  eyebrow?: string;
  footnote?: string;
}) {
  return (
    <div
      className="w-full h-full flex flex-col relative"
      style={{ background: "hsl(0 0% 100%)", padding: "56px 80px 48px", color: INK }}
    >
      {/* Eyebrow */}
      <p
        className="font-mono uppercase"
        style={{ fontSize: 13, letterSpacing: "0.32em", color: PRIMARY, marginBottom: 16 }}
      >
        {eyebrow}
      </p>

      {/* Title */}
      <div className="flex items-baseline justify-between gap-8" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          The Decision Layer
        </h2>
        <p style={{ fontSize: 16, color: MUTED, maxWidth: 540, textAlign: "right" }}>
          The missing layer between your AI and real action — where standards, governance and orchestration live.
        </p>
      </div>

      {/* Flow row: Reality → AI → [DECISION LAYER] → Execution → Outcomes */}
      <div className="flex-1 min-h-0 flex items-stretch gap-3">
        <StageCard stage={STAGES[0]} />
        <FlowArrow />
        <StageCard stage={STAGES[1]} />
        <FlowArrow lit />
        <StandardLayerCard />
        <FlowArrow lit />
        <StageCard stage={STAGES[2]} />
        <FlowArrow />
        <StageCard stage={STAGES[3]} />
      </div>

      {/* Footer signature row */}
      <div
        className="mt-6 flex items-center justify-between gap-6 rounded-xl px-6 py-3"
        style={{ background: PRIMARY_SOFT, border: `1px solid ${PRIMARY_BORDER}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(200 90% 42% / 0.15)", color: PRIMARY }}
          >
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 900, color: PRIMARY, lineHeight: 1.1 }}>
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

function StageCard({ stage }: { stage: Stage }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-xl flex flex-col"
      style={{
        background: "hsl(0 0% 100%)",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 8px 24px -18px hsl(222 47% 11% / 0.18)",
        padding: "18px 16px",
      }}
    >
      <span
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: "hsl(215 20% 96%)", color: PRIMARY, border: `1px solid ${BORDER}` }}
      >
        {stage.icon}
      </span>
      <p style={{ fontSize: 18, fontWeight: 900, color: PRIMARY, marginTop: 12, lineHeight: 1.1 }}>
        {stage.title}
      </p>
      <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{stage.sub}</p>
      <ul className="mt-3 space-y-1.5">
        {stage.examples.map((ex) => (
          <li
            key={ex}
            style={{
              fontSize: 11,
              color: INK,
              lineHeight: 1.3,
              paddingLeft: 10,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 6,
                width: 4,
                height: 4,
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

function StandardLayerCard() {
  return (
    <div
      className="rounded-xl flex flex-col overflow-hidden"
      style={{
        flex: "1.6 1 0",
        minWidth: 0,
        border: `1px solid hsl(200 90% 42% / 0.55)`,
        boxShadow:
          "0 24px 60px -30px hsl(200 90% 42% / 0.55), 0 0 50px -18px hsl(200 90% 42% / 0.35)",
      }}
    >
      <div
        style={{
          background: PRIMARY,
          color: "white",
          padding: "14px 18px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.1 }}>
          The Decision Layer
        </p>
        <p style={{ fontSize: 11, opacity: 0.9, marginTop: 4 }}>
          The missing layer between AI and action.
        </p>
      </div>
      <div
        className="grid grid-cols-5 flex-1"
        style={{ background: "hsl(200 90% 42% / 0.18)", gap: 1 }}
      >
        {PILLARS.map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center justify-center text-center"
            style={{ background: "hsl(0 0% 100%)", padding: "12px 6px" }}
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
                fontSize: 10.5,
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
  );
}

function FlowArrow({ lit = false }: { lit?: boolean }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 24 }}>
      <ArrowRight
        className="w-5 h-5"
        style={{ color: lit ? PRIMARY : "hsl(215 20% 70%)" }}
      />
    </div>
  );
}


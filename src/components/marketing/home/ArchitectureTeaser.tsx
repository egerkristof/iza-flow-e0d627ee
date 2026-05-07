import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Workflow, Sparkles, ScrollText } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

type IndustryView = {
  label: string;
  decisionStandard: string;
  workspace: string;
  records: string;
  tools: string;
};

const INDUSTRIES: IndustryView[] = [
  {
    label: "Industry-agnostic",
    decisionStandard: "Mandates, playbooks, policy. Versioned and auditable.",
    workspace: "Governed workspace, workbooks, agents. Every output inherits the standard.",
    records: "Drive, databases, docs, email, ticketing",
    tools: "Copilot, Glean, Claude, vendor RAG",
  },
  {
    label: "Pharma & Life Sciences",
    decisionStandard: "GxP playbooks, SOPs, lab and CSV policy. 21 CFR Part 11 ready.",
    workspace: "Governed workbooks for protocols, deviations, CAPAs, and submissions.",
    records: "Veeva Vault, LIMS, ELN, eTMF, Quality Docs",
    tools: "Copilot, Claude, internal GPTs, vendor RAG",
  },
  {
    label: "Space Engineering & Operations",
    decisionStandard: "Mission assurance rules, ECSS standards, anomaly response playbooks. Versioned per program.",
    workspace: "Governed workbooks for mission ops procedures, anomaly reports, design reviews, and flight readiness.",
    records: "PLM, MBSE models, telemetry archives, ECSS doc library, ground-segment systems",
    tools: "Copilot, Claude, engineering copilots, vendor RAG",
  },
  {
    label: "AEC",
    decisionStandard: "Owner standards, ISO 19650, project mandates. Submittal logic versioned.",
    workspace: "Governed workbooks for RFIs, submittals, change orders, BIM context.",
    records: "Procore, BIM 360, Revit, SharePoint, project email",
    tools: "Copilot, Claude, AEC vendor copilots",
  },
  {
    label: "Regulated Manufacturing",
    decisionStandard: "GMP, ISO 9001, AS9100 quality playbooks. Engineering judgment encoded.",
    workspace: "Workbooks for NCRs, change control, supplier quality, engineering reviews.",
    records: "ERP, MES, QMS, PLM, supplier portals",
    tools: "Copilot, Claude, engineering copilots",
  },
  {
    label: "Financial Services",
    decisionStandard: "Risk appetite, conduct, product rules. Regulator wording locked.",
    workspace: "Workbooks for KYC, complaints, credit memos, and segment communications.",
    records: "Core banking, CRM, AML, policy library, contracts",
    tools: "Copilot, Claude, in-house assistants, vendor RAG",
  },
  {
    label: "Enterprise IT & AI",
    decisionStandard: "Architecture standards, security policy, AI usage mandates.",
    workspace: "Workbooks for design reviews, vendor evals, runbooks, incident comms.",
    records: "ServiceNow, Jira, Confluence, Git, security tooling",
    tools: "Copilot, Glean, Claude, in-house agents",
  },
];

export function ArchitectureTeaser() {
  const [active, setActive] = useState(0);
  const view = INDUSTRIES[active];
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <SectionTag label="Where Liza fits" />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.08] tracking-tight">
            One standard.{" "}
            <GradientText>Every surface inherits it.</GradientText>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Liza sits between your records, your work, and every AI tool you already use. Nothing gets ripped out.
          </p>
        </div>

        {/* Industry toggle */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {INDUSTRIES.map((ind, i) => {
            const isActive = active === i;
            return (
              <button
                key={ind.label}
                type="button"
                onClick={() => setActive(i)}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border"
                style={{
                  background: isActive ? "hsl(var(--primary))" : "hsl(var(--background))",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}
              >
                {ind.label}
              </button>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-muted-foreground mb-5">
          Same architecture across every industry. The standard inside is yours.
        </p>

        <ArchitectureDiagram view={view} />

        <div className="mt-8 flex justify-center">
          <Link
            to="/os"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Explore the full platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Animated four-screen architecture diagram ---------- */
function ArchitectureDiagram({ view }: { view: IndustryView }) {
  return (
    <div
      className="relative max-w-4xl mx-auto rounded-2xl border p-6 md:p-10"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      {/* Industry tag */}
      <div className="flex justify-center mb-5">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.18em] uppercase"
          style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
        >
          Liza · {view.label}
        </div>
      </div>

      {/* Connection layer (SVG) — only on >=md so we can rely on grid layout */}
      <ConnectionLayer />

      {/* Top row: the two Liza-owned screens */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14 z-10">
        <ScreenWindow
          chromeLabel="Liza · Decision Standard"
          icon={<ScrollText className="w-3.5 h-3.5" />}
          title="How your company decides and delivers work."
          body={view.decisionStandard}
          tone="liza"
        />
        <ScreenWindow
          chromeLabel="Liza · Workspace"
          icon={<Workflow className="w-3.5 h-3.5" />}
          title="Governed workspace, workbooks, agents."
          body={view.workspace}
          tone="liza"
        />
      </div>

      {/* Bottom row: external surfaces */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 z-10">
        <ScreenWindow
          chromeLabel="Systems of record"
          icon={<Database className="w-3.5 h-3.5" />}
          title="Your existing source of truth."
          body={view.records}
          tone="external"
        />
        <ScreenWindow
          chromeLabel="Your AI tools"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          title="Whatever assistants your teams already use."
          body={view.tools}
          tone="external"
        />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Nothing gets ripped out. Liza governs the work; your records and AI tools stay where they are.
      </p>
    </div>
  );
}

function ScreenWindow({
  chromeLabel, icon, title, body, tone,
}: {
  chromeLabel: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "liza" | "external";
}) {
  const isLiza = tone === "liza";
  const accent = isLiza ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  const ring = isLiza ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border))";
  const bg = isLiza ? "hsl(var(--primary) / 0.05)" : "hsl(var(--background))";
  return (
    <div
      className="relative rounded-xl border overflow-hidden"
      style={{
        background: bg,
        borderColor: ring,
        boxShadow: isLiza
          ? "0 18px 40px -28px hsl(var(--primary) / 0.55)"
          : "0 12px 30px -24px hsl(var(--foreground) / 0.25)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 border-b"
        style={{ borderColor: ring, background: "hsl(var(--card))" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-amber, var(--primary)) / 0.55)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: isLiza ? accent + "88" : "hsl(var(--muted-foreground) / 0.45)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.35)" }} />
        <span className="ml-2 text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: accent }}>
          {chromeLabel}
        </span>
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-1.5" style={{ color: accent }}>
          {icon}
          <p className="text-[11px] font-black uppercase tracking-wider">{chromeLabel.replace(/^Liza · /, "")}</p>
        </div>
        <p className="text-[12.5px] text-foreground font-semibold leading-snug">{title}</p>
        <p className="text-[11.5px] text-muted-foreground mt-1.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* Animated dotted connection lines + traveling pulses between the four screens */
function ConnectionLayer() {
  const stroke = "hsl(var(--primary) / 0.45)";
  const pulse = "hsl(var(--primary))";
  // Coordinates in a 100x100 viewBox. Top row centers ~y=22, bottom ~y=78. Left col x=25, right col x=75.
  // We connect every top to every bottom (Decision <-> Records, Decision <-> Tools, Workspace <-> Records, Workspace <-> Tools).
  const lines: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [
    { x1: 25, y1: 28, x2: 25, y2: 72, delay: 0 },     // Decision -> Records
    { x1: 25, y1: 28, x2: 75, y2: 72, delay: 0.6 },   // Decision -> Tools
    { x1: 75, y1: 28, x2: 25, y2: 72, delay: 1.2 },   // Workspace -> Records
    { x1: 75, y1: 28, x2: 75, y2: 72, delay: 1.8 },   // Workspace -> Tools
  ];
  return (
    <svg
      className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {lines.map((l, i) => (
        <g key={i}>
          <line
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={stroke}
            strokeWidth="0.35"
            strokeDasharray="1.2 1.2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Pulse traveling top -> bottom (read in) */}
          <motion.circle
            r="0.9"
            fill={pulse}
            initial={{ opacity: 0 }}
            animate={{
              cx: [l.x1, l.x2],
              cy: [l.y1, l.y2],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              delay: l.delay,
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1],
            }}
          />
          {/* Pulse traveling bottom -> top (write back) */}
          <motion.circle
            r="0.9"
            fill="hsl(var(--brand-green, var(--primary)))"
            initial={{ opacity: 0 }}
            animate={{
              cx: [l.x2, l.x1],
              cy: [l.y2, l.y1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              delay: l.delay + 1.2,
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1],
            }}
          />
        </g>
      ))}
      {/* Center horizontal sync line between the two Liza screens */}
      <line
        x1={36} y1={22} x2={64} y2={22}
        stroke={stroke}
        strokeWidth="0.35"
        strokeDasharray="1.2 1.2"
        vectorEffect="non-scaling-stroke"
      />
      {/* Legend dots */}
      <g>
        <circle cx="50" cy="50" r="0.8" fill={pulse} opacity="0.9" />
      </g>
    </svg>
  );
}

/* Re-export for type clarity above */
type _IndustryView = IndustryView;
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Workflow, Sparkles, Compass } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import { ArchitectureWalkthrough } from "./ArchitectureWalkthrough";

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

        {/* Same Stories-style narrative on every device. */}
        <ArchitectureWalkthrough />

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

/* ---------- Three-tier architecture diagram with directional flow labels ---------- */
function ArchitectureDiagram({ view }: { view: IndustryView }) {
  return (
    <div
      className="relative max-w-4xl mx-auto rounded-2xl border p-6 md:p-10"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      {/* Industry tag */}
      <div className="flex justify-center mb-6">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.18em] uppercase"
          style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
        >
          Liza · {view.label}
        </div>
      </div>

      {/* TIER 1 — Leadership View (top, single, narrower) */}
      <div className="max-w-2xl mx-auto">
        <ScreenWindow
          chromeLabel="Liza · Leadership View"
          icon={<Compass className="w-3.5 h-3.5" />}
          title="The Decision Standard. How your company decides and delivers work."
          body={view.decisionStandard}
          tone="liza"
        />
      </div>

      {/* Flow 1: Leadership <-> Workspace */}
      <FlowConnector
        downLabel="Standards constrain the workspace"
        upLabel="Workspace signal updates the standard"
      />

      {/* TIER 2 — Workspace (center, wide) */}
      <ScreenWindow
        chromeLabel="Liza · Workspace"
        icon={<Workflow className="w-3.5 h-3.5" />}
        title="Where work happens. Workbooks, agents, every output inherits the standard."
        body={view.workspace}
        tone="liza"
      />

      {/* Flow 2: Workspace <-> Records / Tools */}
      <FlowConnector
        downLabel="Read context in"
        upLabel="Write approved outputs back"
      />

      {/* TIER 3 — Systems of record + AI tools (bottom row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

/* Vertical bidirectional flow connector — explicit labels, animated pulses */
function FlowConnector({ downLabel, upLabel }: { downLabel: string; upLabel: string }) {
  const primary = "hsl(var(--primary))";
  const green = "hsl(var(--brand-green, var(--primary)))";
  return (
    <div className="relative my-3 md:my-4 grid grid-cols-2 gap-4 md:gap-8 px-2 md:px-12">
      {/* DOWN lane */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground text-right leading-tight">
          {downLabel}
        </span>
        <div
          className="relative w-5 h-12 md:h-16 rounded-full overflow-hidden"
          style={{ background: `linear-gradient(to bottom, ${primary}33, ${primary}11)` }}
          aria-hidden="true"
        >
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: primary, boxShadow: `0 0 8px ${primary}` }}
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
          />
        </div>
      </div>
      {/* UP lane */}
      <div className="flex items-center gap-2 justify-start">
        <div
          className="relative w-5 h-12 md:h-16 rounded-full overflow-hidden"
          style={{ background: `linear-gradient(to top, ${green}33, ${green}11)` }}
          aria-hidden="true"
        >
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: green, boxShadow: `0 0 8px ${green}` }}
            initial={{ top: "100%", opacity: 0 }}
            animate={{ top: ["100%", "0%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.9, 1], delay: 0.9 }}
          />
        </div>
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground text-left leading-tight">
          {upLabel}
        </span>
      </div>
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
        <div className="flex items-start gap-2.5">
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: accent + "1a", color: accent, border: `1px solid ${accent}33` }}
          >
            {icon}
          </span>
          <p className="text-[13px] text-foreground font-bold leading-snug">{title}</p>
        </div>
        <p className="text-[11.5px] text-muted-foreground mt-1.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

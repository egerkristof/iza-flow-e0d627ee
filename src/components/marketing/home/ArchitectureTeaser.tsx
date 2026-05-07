import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Workflow, Sparkles, ScrollText, ArrowLeftRight } from "lucide-react";
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

        {/* Mini teaser diagram */}
        <div className="relative max-w-4xl mx-auto rounded-2xl border p-6 md:p-8"
          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
        >
          {/* Liza core — Decision Standard + Where work happens */}
          <div
            className="mx-auto max-w-2xl rounded-xl px-5 py-5 text-center"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              border: "1px solid hsl(var(--primary) / 0.35)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.18em] uppercase mb-2"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Liza · {view.label}
            </div>

            {/* Two halves of Liza */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-left">
              <div
                className="rounded-lg p-3"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--primary) / 0.25)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ScrollText className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                  <p className="text-[12px] font-black uppercase tracking-wider" style={{ color: "hsl(var(--primary))" }}>Decision Standard</p>
                </div>
                <p className="text-[12px] text-foreground font-semibold leading-snug">
                  How your company decides and delivers work.
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {view.decisionStandard}
                </p>
              </div>
              <div
                className="rounded-lg p-3"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--primary) / 0.25)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Workflow className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                  <p className="text-[12px] font-black uppercase tracking-wider" style={{ color: "hsl(var(--primary))" }}>Where work happens</p>
                </div>
                <p className="text-[12px] text-foreground font-semibold leading-snug">
                  Governed workspace, workbooks, agents.
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {view.workspace}
                </p>
              </div>
            </div>
          </div>

          {/* Connector label */}
          <div className="flex items-center justify-center gap-2 my-4">
            <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">
              Read in · Write back · Propagate everywhere
            </p>
          </div>

          {/* Side surfaces — what Liza connects to (industry-specific) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div
              className="rounded-xl border p-4 text-center"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
              >
                <Database className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-foreground leading-tight">Systems of record</p>
              <p className="text-[11px] text-muted-foreground mt-1">{view.records}</p>
            </div>
            <div
              className="rounded-xl border p-4 text-center"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-foreground leading-tight">Your AI tools</p>
              <p className="text-[11px] text-muted-foreground mt-1">{view.tools}</p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Nothing gets ripped out. Liza governs the work; your records and AI tools stay where they are.
          </p>
        </div>

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
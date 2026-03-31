import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowDown, Building2,
  UserPlus, Target, Handshake, MessageSquare, ShieldCheck, FileText,
  Sparkles, Briefcase, Rocket, Microscope, Brain, Cpu, Users
} from "lucide-react";
import { SectionTag, CAL_URL } from "./shared";

/* ── Data ─────────────────────────────────────────────────────── */

const CAPABILITIES = [
  { id: "onboarding", label: "Onboarding", icon: <UserPlus className="w-3.5 h-3.5" />, color: "200 75% 48%" },
  { id: "sales", label: "Sales", icon: <Target className="w-3.5 h-3.5" />, color: "155 65% 42%" },
  { id: "account", label: "Account Mgmt", icon: <Handshake className="w-3.5 h-3.5" />, color: "42 85% 50%" },
  { id: "marketing", label: "Marketing", icon: <Sparkles className="w-3.5 h-3.5" />, color: "280 60% 55%" },
  { id: "meetings", label: "Meetings", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "340 65% 50%" },
  { id: "audit", label: "Compliance", icon: <ShieldCheck className="w-3.5 h-3.5" />, color: "12 75% 55%" },
  { id: "briefs", label: "Briefs", icon: <FileText className="w-3.5 h-3.5" />, color: "200 45% 55%" },
  { id: "services", label: "Delivery", icon: <Briefcase className="w-3.5 h-3.5" />, color: "155 45% 35%" },
];

const capMap = new Map(CAPABILITIES.map(c => [c.id, c]));

const LIFECYCLES = [
  { key: "consulting", label: "Professional Services", icon: <Briefcase className="w-3.5 h-3.5" />, chain: ["onboarding", "briefs", "meetings", "services", "account"] },
  { key: "saas", label: "SaaS & Tech", icon: <Rocket className="w-3.5 h-3.5" />, chain: ["marketing", "sales", "onboarding", "meetings", "account"] },
  { key: "regulated", label: "Regulated Industries", icon: <Microscope className="w-3.5 h-3.5" />, chain: ["audit", "briefs", "services", "meetings", "onboarding"] },
  { key: "enterprise", label: "Enterprise Ops", icon: <Building2 className="w-3.5 h-3.5" />, chain: ["onboarding", "sales", "account", "services", "audit", "marketing"] },
];

/* ── Component ────────────────────────────────────────────────── */

export function CapabilitiesSection() {
  const [hoveredLC, setHoveredLC] = useState<string | null>(null);

  const activeChain = hoveredLC
    ? new Set(LIFECYCLES.find(l => l.key === hoveredLC)?.chain ?? [])
    : null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionTag label="The missing layer" />
          <h2 className="text-2xl md:text-3xl font-black mb-3 text-foreground">
            No AI tool has solved<br />
            <span className="text-muted-foreground font-bold text-xl md:text-2xl">how to define knowledge well.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Current tools help you chat, search, or automate — but none of them capture
            what your organization actually knows: the playbooks, the judgment calls,
            the compliance rules, the hard-won expertise. LIZA turns all of that into
            executable knowledge — structured, governed, and ready to compound.
          </p>
        </div>

        {/* ── Three-layer funnel ── */}
        <div className="flex flex-col items-center gap-0">

          {/* Layer 1: Domain expertise — the centerpiece */}
          <div
            className="w-full rounded-xl border px-6 py-5 relative overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "var(--gradient-brand, hsl(var(--primary)))" }}
            />
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Your domain expertise</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">The knowledge that drives everything</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Playbooks", "Tribal knowledge", "Compliance frameworks", "Decision logic", "Quality standards"].map(k => (
                <span
                  key={k}
                  className="text-xs px-2.5 py-1 rounded-md"
                  style={{ background: "hsl(var(--primary) / 0.06)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.12)" }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Connector */}
          <div className="py-2 flex flex-col items-center gap-0.5">
            <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
            <p className="text-[10px] text-muted-foreground/60 font-medium">encoded into</p>
          </div>

          {/* Layer 2: Modular capabilities */}
          <div
            className="w-full rounded-xl border px-6 py-5"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Modular capabilities</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Executed by humans + AI together</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CAPABILITIES.map(c => {
                const dimmed = activeChain && !activeChain.has(c.id);
                return (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500"
                    style={{
                      background: `hsl(${c.color} / 0.08)`,
                      color: `hsl(${c.color})`,
                      border: `1px solid hsl(${c.color} / 0.15)`,
                      opacity: dimmed ? 0.2 : 1,
                    }}
                  >
                    {c.icon}
                    {c.label}
                  </span>
                );
              })}
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  border: "1px dashed hsl(var(--border))",
                  opacity: activeChain ? 0.2 : 1,
                }}
              >
                + yours
              </span>
            </div>
          </div>

          {/* Connector */}
          <div className="py-2 flex flex-col items-center gap-0.5">
            <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
            <p className="text-[10px] text-muted-foreground/60 font-medium">composed into</p>
          </div>

          {/* Layer 3: End-to-end lifecycles */}
          <div
            className="w-full rounded-xl border px-6 py-5"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
              >
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">End-to-end lifecycles</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Governed, auditable, compounding</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {LIFECYCLES.map(lc => {
                const isHovered = hoveredLC === lc.key;
                return (
                  <div
                    key={lc.key}
                    className="flex items-start gap-3 px-4 py-3 rounded-lg cursor-default transition-all duration-300"
                    onMouseEnter={() => setHoveredLC(lc.key)}
                    onMouseLeave={() => setHoveredLC(null)}
                    style={{
                      background: isHovered ? "hsl(var(--primary) / 0.06)" : "transparent",
                      border: `1px solid ${isHovered ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border) / 0.5)"}`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300"
                      style={{
                        background: isHovered ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                        color: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {lc.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{lc.label}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {lc.chain.map(id => {
                          const cap = capMap.get(id);
                          if (!cap) return null;
                          return (
                            <span
                              key={id}
                              className="text-[10px] px-1.5 py-0.5 rounded transition-colors duration-300"
                              style={{
                                background: isHovered ? `hsl(${cap.color} / 0.1)` : "hsl(var(--muted))",
                                color: isHovered ? `hsl(${cap.color})` : "hsl(var(--muted-foreground))",
                              }}
                            >
                              {cap.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-track CTA — bottom-up vs top-down */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Link
            to="/use-cases"
            className="flex items-center justify-between gap-3 rounded-xl border px-5 py-4 group transition-colors hover:border-primary/30"
            style={{
              borderColor: "hsl(155 65% 42% / 0.2)",
              background: "hsl(155 65% 42% / 0.03)",
            }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">Bottom-up: build capabilities</p>
              <p className="text-xs text-muted-foreground">Start encoding expertise, grow as you go</p>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(155 65% 42%)" }} />
          </Link>

          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border px-5 py-4 group transition-colors hover:border-primary/30"
            style={{
              borderColor: "hsl(200 75% 48% / 0.2)",
              background: "hsl(200 75% 48% / 0.03)",
            }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">Top-down: design lifecycles</p>
              <p className="text-xs text-muted-foreground">Assessment, change management, rollout</p>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(200 75% 48%)" }} />
          </a>
        </div>
      </div>
    </section>
  );
}

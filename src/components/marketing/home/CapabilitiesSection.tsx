import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Building2, Rocket,
  UserPlus, Target, Handshake, MessageSquare, ShieldCheck, FileText,
  Sparkles, Briefcase, Microscope, ChevronRight
} from "lucide-react";
import { SectionTag, CAL_URL } from "./shared";

/* ── Capability atoms ────────────────────────────────────────────────── */

interface Capability {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortDesc: string;
  color: string;
}

const ALL_CAPABILITIES: Capability[] = [
  { id: "onboarding", icon: <UserPlus className="w-4 h-4" />, label: "Onboarding Playbooks", shortDesc: "New hires execute at senior level from day one.", color: "200 75% 48%" },
  { id: "sales", icon: <Target className="w-4 h-4" />, label: "Sales Playbooks", shortDesc: "Same winning methodology, every rep, every deal.", color: "155 65% 42%" },
  { id: "account", icon: <Handshake className="w-4 h-4" />, label: "Account Management", shortDesc: "Consistent client delivery without senior oversight.", color: "42 85% 50%" },
  { id: "marketing", icon: <Sparkles className="w-4 h-4" />, label: "Marketing Playbooks", shortDesc: "Brand voice enforced across every piece of content.", color: "280 60% 55%" },
  { id: "meetings", icon: <MessageSquare className="w-4 h-4" />, label: "Meeting Intelligence", shortDesc: "Structured prep, live context, automated follow-through.", color: "340 65% 50%" },
  { id: "audit", icon: <ShieldCheck className="w-4 h-4" />, label: "Security Audit Engine", shortDesc: "Framework compliance checked in hours, not weeks.", color: "12 75% 55%" },
  { id: "briefs", icon: <FileText className="w-4 h-4" />, label: "Smart Briefs", shortDesc: "AI-generated briefs grounded in your team's actual context.", color: "200 45% 55%" },
  { id: "services", icon: <Briefcase className="w-4 h-4" />, label: "Services Delivery", shortDesc: "Repeatable delivery playbooks that compound across engagements.", color: "155 45% 35%" },
];

const capMap = new Map(ALL_CAPABILITIES.map(c => [c.id, c]));

/* ── Lifecycle chains — end-to-end industry views ────────────────────── */

interface LifecycleChain {
  key: string;
  label: string;
  icon: React.ReactNode;
  subtitle: string;
  /** Ordered capability IDs forming this lifecycle */
  chain: string[];
  /** What LIZA adds on top */
  lizaValue: string;
}

const LIFECYCLE_CHAINS: LifecycleChain[] = [
  {
    key: "consulting",
    label: "Professional Services",
    icon: <Briefcase className="w-4 h-4" />,
    subtitle: "From engagement kick-off to compounding delivery",
    chain: ["onboarding", "briefs", "meetings", "services", "account", "marketing"],
    lizaValue: "Every engagement compounds — what you learn on one project raises the bar for the next.",
  },
  {
    key: "saas",
    label: "SaaS Revenue Engine",
    icon: <Rocket className="w-4 h-4" />,
    subtitle: "From first touch to expansion",
    chain: ["marketing", "sales", "onboarding", "meetings", "account", "briefs"],
    lizaValue: "Your sales methodology and product knowledge flow seamlessly from marketing to CS.",
  },
  {
    key: "regulated",
    label: "Regulated Lifecycles",
    icon: <Microscope className="w-4 h-4" />,
    subtitle: "From R&D to compliant release",
    chain: ["audit", "briefs", "services", "meetings", "onboarding", "account"],
    lizaValue: "Turn compliance documentation into executable, auditable workflows.",
  },
  {
    key: "enterprise",
    label: "Enterprise Operations",
    icon: <Building2 className="w-4 h-4" />,
    subtitle: "Cross-functional governance at scale",
    chain: ["onboarding", "sales", "account", "services", "audit", "marketing", "meetings", "briefs"],
    lizaValue: "One management layer across every team, every lifecycle, every geography.",
  },
];

/* ── Component ───────────────────────────────────────────────────────── */

export function CapabilitiesSection() {
  const [activeChain, setActiveChain] = useState<string | null>(null);

  const highlighted = activeChain
    ? new Set(LIFECYCLE_CHAINS.find(l => l.key === activeChain)?.chain ?? [])
    : null;

  const activeLifecycle = LIFECYCLE_CHAINS.find(l => l.key === activeChain);

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <SectionTag label="Capabilities" />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Doing things the right way. At any scale.
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            If your team has domain expertise, LIZA can turn it into a governed capability.
            These are the building blocks — and they chain into full end-to-end lifecycles.
          </p>
        </div>

        {/* All capabilities — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {ALL_CAPABILITIES.map((c) => {
            const dimmed = highlighted && !highlighted.has(c.id);
            const lit = highlighted?.has(c.id);
            return (
              <div
                key={c.id}
                className="rounded-xl border p-4 transition-all duration-300"
                style={{
                  borderColor: lit
                    ? `hsl(${c.color} / 0.5)`
                    : "hsl(var(--border))",
                  background: lit
                    ? `hsl(${c.color} / 0.06)`
                    : "hsl(var(--card))",
                  opacity: dimmed ? 0.35 : 1,
                  transform: lit ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: `hsl(${c.color} / 0.1)`,
                    color: `hsl(${c.color})`,
                  }}
                >
                  {c.icon}
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{c.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.shortDesc}</p>
              </div>
            );
          })}
        </div>

        {/* Lifecycle chains — shows how capabilities form end-to-end value */}
        <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            How capabilities chain into end-to-end lifecycles
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {LIFECYCLE_CHAINS.map((lc) => {
              const isActive = activeChain === lc.key;
              return (
                <button
                  key={lc.key}
                  onClick={() => setActiveChain(isActive ? null : lc.key)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-xs font-semibold"
                  style={
                    isActive
                      ? {
                          background: "hsl(var(--primary) / 0.1)",
                          color: "hsl(var(--primary))",
                          border: "1px solid hsl(var(--primary) / 0.25)",
                        }
                      : {
                          background: "transparent",
                          color: "hsl(var(--muted-foreground))",
                          border: "1px solid hsl(var(--border))",
                        }
                  }
                >
                  {lc.icon}
                  <div>
                    <span className="block">{lc.label}</span>
                    <span className="block font-normal text-[10px] opacity-70">{lc.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active chain visualization */}
          {activeLifecycle && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
              {/* Chain flow */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {activeLifecycle.chain.map((id, i) => {
                  const cap = capMap.get(id);
                  if (!cap) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold"
                        style={{
                          background: `hsl(${cap.color} / 0.1)`,
                          color: `hsl(${cap.color})`,
                          border: `1px solid hsl(${cap.color} / 0.2)`,
                        }}
                      >
                        {cap.icon}
                        {cap.label}
                      </span>
                      {i < activeLifecycle.chain.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                      )}
                    </span>
                  );
                })}
              </div>

              {/* LIZA value add */}
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "hsl(var(--primary) / 0.05)",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                }}
              >
                <span className="font-bold text-primary text-xs">What LIZA adds →</span>{" "}
                <span className="text-muted-foreground text-xs">{activeLifecycle.lizaValue}</span>
              </div>
            </div>
          )}
        </div>

        {/* Two tracks */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <Link
            to="/use-cases"
            className="flex items-center justify-between gap-3 rounded-xl border px-5 py-4 group transition-colors hover:border-primary/30"
            style={{
              borderColor: "hsl(155 65% 42% / 0.2)",
              background: "hsl(155 65% 42% / 0.03)",
            }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">I want to get started now</p>
              <p className="text-xs text-muted-foreground">Pick capabilities, self-serve, grow as you go</p>
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
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 shrink-0" style={{ color: "hsl(200 75% 48%)" }} />
              <div>
                <p className="text-sm font-bold text-foreground">I need end-to-end deployment</p>
                <p className="text-xs text-muted-foreground">Assessment, change management, lifecycle rollout</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(200 75% 48%)" }} />
          </a>
        </div>
      </div>
    </section>
  );
}

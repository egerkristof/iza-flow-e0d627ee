import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Building2, Rocket, Globe,
  UserPlus, Target, Handshake, MessageSquare, ShieldCheck, FileText,
  Sparkles, Briefcase, Microscope, Scale, Factory
} from "lucide-react";
import { SectionTag, CAL_URL } from "./shared";

/* ── All capability modules ──────────────────────────────────────────── */

interface Capability {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
}

const ALL_CAPABILITIES: Capability[] = [
  { id: "onboarding", icon: <UserPlus className="w-4 h-4" />, label: "Onboarding Playbooks", desc: "New hires execute at senior level from day one.", color: "200 75% 48%" },
  { id: "sales", icon: <Target className="w-4 h-4" />, label: "Sales Playbooks", desc: "Same winning methodology, every rep, every deal.", color: "155 65% 42%" },
  { id: "account", icon: <Handshake className="w-4 h-4" />, label: "Account Management", desc: "Consistent client delivery without senior oversight on every call.", color: "42 85% 50%" },
  { id: "marketing", icon: <Sparkles className="w-4 h-4" />, label: "Marketing Playbooks", desc: "Brand voice and strategy enforced across every piece of content.", color: "280 60% 55%" },
  { id: "meetings", icon: <MessageSquare className="w-4 h-4" />, label: "Meeting Intelligence", desc: "Structured prep, live context, automated follow-through.", color: "340 65% 50%" },
  { id: "audit", icon: <ShieldCheck className="w-4 h-4" />, label: "Security Audit Engine", desc: "Framework compliance checked in hours, not weeks.", color: "12 75% 55%" },
  { id: "briefs", icon: <FileText className="w-4 h-4" />, label: "Smart Briefs", desc: "AI-generated briefs grounded in your team's actual context.", color: "200 45% 55%" },
  { id: "services", icon: <Briefcase className="w-4 h-4" />, label: "Services Delivery", desc: "Repeatable delivery playbooks that compound across engagements.", color: "155 45% 35%" },
];

/* ── Industry filters: each selects a subset + reorders ──────────────── */

interface IndustryFilter {
  key: string;
  label: string;
  icon: React.ReactNode;
  ids: string[]; // capability IDs shown (in order) for this filter
}

const FILTERS: IndustryFilter[] = [
  { key: "all", label: "All capabilities", icon: <Globe className="w-3.5 h-3.5" />, ids: ALL_CAPABILITIES.map(c => c.id) },
  { key: "consulting", label: "Professional Services", icon: <Briefcase className="w-3.5 h-3.5" />, ids: ["services", "onboarding", "account", "meetings", "briefs", "marketing"] },
  { key: "saas", label: "SaaS & Tech", icon: <Rocket className="w-3.5 h-3.5" />, ids: ["sales", "onboarding", "marketing", "meetings", "account", "briefs"] },
  { key: "regulated", label: "Regulated Industries", icon: <Microscope className="w-3.5 h-3.5" />, ids: ["audit", "services", "onboarding", "briefs", "meetings", "account"] },
  { key: "enterprise", label: "Enterprise Operations", icon: <Building2 className="w-3.5 h-3.5" />, ids: ["onboarding", "sales", "account", "services", "audit", "marketing", "meetings", "briefs"] },
];

const capMap = new Map(ALL_CAPABILITIES.map(c => [c.id, c]));

export function CapabilitiesSection() {
  const [active, setActive] = useState("all");

  const activeFilter = FILTERS.find(f => f.key === active) || FILTERS[0];
  const visibleCaps = activeFilter.ids
    .map(id => capMap.get(id))
    .filter(Boolean) as Capability[];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <SectionTag label="Capabilities" />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Doing things the right way. At any scale.
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Every capability is built on the same principle: your expertise becomes the standard AI follows.
            Pick what fits your team, or deploy across an entire workflow.
          </p>
        </div>

        {/* Industry filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTERS.map((f) => {
            const isActive = active === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
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
                {f.icon}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Capability cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 transition-all">
          {visibleCaps.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border p-4 transition-all hover:border-primary/20"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--card))",
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
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Two tracks below */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
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

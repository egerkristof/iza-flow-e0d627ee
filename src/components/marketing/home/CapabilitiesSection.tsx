import { Link } from "react-router-dom";
import {
  ArrowRight, Building2,
  UserPlus, Target, Handshake, MessageSquare, ShieldCheck, FileText,
  Sparkles, Briefcase
} from "lucide-react";
import { SectionTag, CAL_URL } from "./shared";

const CAPABILITIES = [
  {
    icon: <UserPlus className="w-4 h-4" />,
    label: "Onboarding Playbooks",
    desc: "New hires execute at senior level from day one.",
    color: "200 75% 48%",
  },
  {
    icon: <Target className="w-4 h-4" />,
    label: "Sales Playbooks",
    desc: "Same winning methodology, every rep, every deal.",
    color: "155 65% 42%",
  },
  {
    icon: <Handshake className="w-4 h-4" />,
    label: "Account Management",
    desc: "Consistent client delivery without senior oversight on every call.",
    color: "42 85% 50%",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Marketing Playbooks",
    desc: "Brand voice and strategy enforced across every piece of content.",
    color: "280 60% 55%",
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    label: "Meeting Intelligence",
    desc: "Structured prep, live context, automated follow-through.",
    color: "340 65% 50%",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: "Security Audit Engine",
    desc: "Framework compliance checked in hours, not weeks.",
    color: "12 75% 55%",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Smart Briefs",
    desc: "AI-generated briefs grounded in your team's actual context.",
    color: "200 45% 55%",
  },
  {
    icon: <Briefcase className="w-4 h-4" />,
    label: "Services Delivery",
    desc: "Repeatable delivery playbooks that compound across engagements.",
    color: "155 45% 35%",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Capabilities" />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Pick one. Get started this week.
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Every capability runs on the same engine: your expertise, enforced by AI, compounding over time.
            Start with what matters most to your team.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAPABILITIES.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border p-4 transition-colors hover:border-primary/20"
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

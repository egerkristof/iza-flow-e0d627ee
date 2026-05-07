import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Briefcase, Megaphone, TrendingUp, Users, Target,
  Handshake, GraduationCap, Radio,
} from "lucide-react";
import { SectionTag } from "@/components/marketing/home/shared";

const FUNCTIONS = [
  {
    slug: "sales",
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Sales",
    lifecycle: "Deal Execution Lifecycle",
    description:
      "Qualification, objection handling, pricing judgment, competitive positioning. Your best seller's instincts running on every deal.",
    tags: ["Pipeline", "Win/Loss", "Playbooks"],
    col: "38 92% 50%",
  },
  {
    slug: "gtm",
    icon: <Target className="w-6 h-6" />,
    title: "Go-to-Market",
    lifecycle: "Launch & Expansion Lifecycle",
    description:
      "Market entry sequencing, ICP refinement, channel strategy, and expansion playbooks. Governed execution from first signal to scaled motion.",
    tags: ["ICP", "Channel Strategy", "Launch Playbooks"],
    col: "200 90% 52%",
  },
  {
    slug: "marketing",
    icon: <Megaphone className="w-6 h-6" />,
    title: "Marketing",
    lifecycle: "Positioning & Campaign Lifecycle",
    description:
      "Positioning logic, segment messaging, campaign judgment. Stop guessing which message lands. Encode what works.",
    tags: ["Positioning", "Content Ops", "Segment Logic"],
    col: "330 70% 55%",
  },
  {
    slug: "business-development",
    icon: <Handshake className="w-6 h-6" />,
    title: "Business Development",
    lifecycle: "Partnership & Pipeline Lifecycle",
    description:
      "Partner evaluation, deal structuring, relationship cadence, and alliance governance. Systematic expansion beyond direct sales.",
    tags: ["Partnerships", "Alliance Mgmt", "Deal Structure"],
    col: "155 72% 46%",
  },
  {
    slug: "account-management",
    icon: <Users className="w-6 h-6" />,
    title: "Account Management",
    lifecycle: "Retention & Growth Lifecycle",
    description:
      "Renewal signals, expansion timing, risk detection. Protect revenue before the data tells you it's at risk.",
    tags: ["Renewals", "Health Scoring", "Expansion"],
    col: "180 65% 45%",
  },
  {
    slug: "onboarding",
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Onboarding & Enablement",
    lifecycle: "Knowledge Transfer Lifecycle",
    description:
      "Encode your best people's judgment into protocols that make every new hire perform like a veteran in weeks, not months.",
    tags: ["Ramp Time", "Tribal Knowledge", "Playbooks"],
    col: "45 85% 55%",
  },
  {
    slug: "meetings",
    icon: <Radio className="w-6 h-6" />,
    title: "Meeting Intelligence",
    lifecycle: "Decision Capture Lifecycle",
    description:
      "From 1:1s to team syncs. Extract decisions, detect drift, drive follow-through. Every meeting builds organisational memory.",
    tags: ["Decisions", "Drift Detection", "Follow-through"],
    col: "15 80% 55%",
  },
  {
    slug: "professional-services",
    icon: <Briefcase className="w-6 h-6" />,
    title: "Professional Services",
    lifecycle: "Engagement Delivery Lifecycle",
    description:
      "From scoping to delivery to knowledge harvest. Encode your best consultant's methodology into every engagement.",
    tags: ["Scoping", "Delivery Playbooks", "ISO 20700"],
    col: "270 60% 65%",
  },
];

export default function ByFunctionPage() {
  return (
    <MarketingLayout>
      <section className="pt-16 pb-10 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionTag label="LIZA By Function" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            Pick your function. See LIZA in action.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Every function runs a lifecycle of repeatable decisions. LIZA encodes how your best people make those decisions, then runs the standard on every AI output.
          </p>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {FUNCTIONS.map((fn) => (
              <Link
                key={fn.slug}
                to={`/industries/${fn.slug}`}
                className="group rounded-2xl border p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `hsl(${fn.col} / 0.12)`,
                      color: `hsl(${fn.col})`,
                    }}
                  >
                    {fn.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
                      {fn.lifecycle}
                    </p>
                    <h3 className="text-base font-bold text-foreground">{fn.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {fn.description}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {fn.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{
                        background: `hsl(${fn.col} / 0.08)`,
                        color: `hsl(${fn.col})`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:underline">
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Don't see your function? The lifecycle pattern applies everywhere standards meet execution.
          </p>
          <Link
            to="/diagnostic"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Take the Diagnostic
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  Pill, Building2, ArrowRight, Lock,
  Rocket, Satellite, Landmark, Car,
} from "lucide-react";
import { SectionTag } from "@/components/marketing/home/shared";

const REGULATED_INDUSTRIES = [
  {
    slug: "regulated",
    icon: <Pill className="w-6 h-6" />,
    title: "Regulated Science & Manufacturing",
    lifecycle: "Product & Quality Lifecycle Management",
    description:
      "From R&D through post-market surveillance, from lab governance to food safety: govern AI across GxP and ISO-regulated processes without losing speed or traceability.",
    tags: ["GMP", "ISO 17025", "GLP", "GAMP 5", "21 CFR Part 11"],
    available: true,
  },
  {
    slug: "aec",
    icon: <Building2 className="w-6 h-6" />,
    title: "Architecture, Engineering & Construction",
    lifecycle: "Built-Environment Project Lifecycle",
    description:
      "RFIs, submittals, owner standards, and BIM context governed across project delivery. Stop paying for the same rework twice.",
    tags: ["ISO 19650", "BIM", "RFI", "Submittals"],
    available: true,
  },
  {
    slug: "space",
    icon: <Rocket className="w-6 h-6" />,
    title: "Space Engineering & Mission Operations",
    lifecycle: "Mission Lifecycle Management",
    description:
      "Capture chief-engineer judgment and mission heritage before it retires. Govern AI across trade studies, reviews, and AIT.",
    tags: ["ECSS", "AS9100", "PDR/CDR", "Heritage"],
    available: true,
  },
  {
    slug: "space-defense",
    icon: <Rocket className="w-6 h-6" />,
    title: "Space & Defence Holdings",
    lifecycle: "Programme Lifecycle · Capture · Engineering · Sustainment",
    description:
      "For consolidating Space & Defence groups: one context layer from RFP and capture, through engineering and qualification, to sustainment and ILS. Govern AQAP, AS9100, ISO 27001, and ECSS as one stack across the federation. Come on board as a customer, an investor, or both.",
    tags: ["NATO AQAP", "AS9100", "ECSS", "ISO 27001", "M&A Integration"],
    available: true,
  },
  {
    slug: "satcom",
    icon: <Satellite className="w-6 h-6" />,
    title: "Satellite Operators & Fleet Operations",
    lifecycle: "Operator & Fleet Lifecycle",
    description:
      "15-year fleet memory, procurement governance, and spectrum continuity. The operator memory layer for satcom.",
    tags: ["ITU-R", "FCC Part 25", "SLA", "LEOP"],
    available: true,
  },
  {
    slug: "banking",
    icon: <Landmark className="w-6 h-6" />,
    title: "Retail Banking & Financial Services",
    lifecycle: "Brand · Conduct · Lifecycle",
    description:
      "Brand voice, product rules, regulator wording, and segment judgment governed across every AI output. Starts at the marketing wedge, extends across KYC, complaints, credit, and group governance.",
    tags: ["EBA", "Consumer Duty", "DORA", "AML6"],
    available: true,
  },
  {
    slug: "automotive",
    icon: <Car className="w-6 h-6" />,
    title: "Automotive R&D & Functional Safety",
    lifecycle: "Engineering V-Cycle · Cross-Border R&D",
    description:
      "Chassis-control IP, HQ design intent, and ISO 26262 / ASPICE judgment governed across cross-border engineering sites. Starts at HQ → Europe onboarding, extends across safety case, ASPICE, and group engineering memory.",
    tags: ["ISO 26262", "ASPICE", "ISO 21434", "AUTOSAR"],
    available: true,
  },
];

export default function IndustriesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionTag label="Where LIZA Works" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            One pattern. Every lifecycle.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            From regulated industries to revenue-critical functions, the challenge is the same: 
            AI makes work faster, but without governance it makes work inconsistent. 
            LIZA is the operating layer that fixes that.
          </p>
        </div>
      </section>

      {/* The Lifecycle Thesis */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border p-8 md:p-10 mb-16"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-3 text-primary">
              The Lifecycle Thesis
            </p>
            <p className="text-lg md:text-xl font-semibold text-foreground mb-3 leading-snug">
              Every team runs a lifecycle: a repeating chain of decisions where human judgment 
              and standards determine quality.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI makes these processes faster, but without governance it makes them 
              inconsistent and unauditable. LIZA sits between your people and their AI tools, 
              ensuring every output meets your standards.
            </p>
          </div>

          {/* Regulated Industries */}
          <div className="mb-16">
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-6 text-muted-foreground">
              Regulated Industries
            </p>
            <div className="grid gap-5">
              {REGULATED_INDUSTRIES.map((ind) => (
                <div
                  key={ind.slug}
                  className="group rounded-2xl border p-7 transition-all relative overflow-hidden"
                  style={{
                    borderColor: ind.available
                      ? "hsl(var(--primary) / 0.2)"
                      : "hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                >
                  {!ind.available && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      Coming soon
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: ind.available
                          ? "hsl(var(--primary) / 0.1)"
                          : "hsl(var(--muted))",
                        color: ind.available
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {ind.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                        {ind.lifecycle}
                      </p>
                      <h3 className="text-xl font-bold text-foreground mb-2">{ind.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {ind.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {ind.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                            style={{
                              background: "hsl(var(--muted))",
                              color: "hsl(var(--muted-foreground))",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {ind.available && (
                          <Link
                            to={`/industries/${ind.slug}`}
                            className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                          >
                            Explore <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Functional Lifecycles moved to /by-function */}
          <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            <p className="text-sm text-muted-foreground mb-3">
              Looking for a function rather than an industry?
            </p>
            <Link
              to="/by-function"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Browse LIZA By Function <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
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
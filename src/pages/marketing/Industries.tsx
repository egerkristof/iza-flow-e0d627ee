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
      "Govern AI across GxP and ISO-regulated processes without losing speed or traceability.",
    tags: ["GMP", "ISO 17025", "GLP", "GAMP 5", "21 CFR Part 11"],
    available: true,
  },
  {
    slug: "aec",
    icon: <Building2 className="w-6 h-6" />,
    title: "Architecture, Engineering & Construction",
    lifecycle: "Built-Environment Project Lifecycle",
    description:
      "RFIs, submittals, owner standards, and BIM context governed across project delivery.",
    tags: ["ISO 19650", "BIM", "RFI", "Submittals"],
    available: true,
  },
  {
    slug: "space",
    icon: <Rocket className="w-6 h-6" />,
    title: "Space Engineering & Mission Operations",
    lifecycle: "Mission Lifecycle Management",
    description:
      "Capture chief-engineer judgment and mission heritage. Govern AI across trade studies, reviews, and AIT.",
    tags: ["ECSS", "AS9100", "PDR/CDR", "Heritage"],
    available: true,
  },
  {
    slug: "space-defense",
    icon: <Rocket className="w-6 h-6" />,
    title: "Space & Defence Holdings",
    lifecycle: "Programme Lifecycle · Capture · Engineering · Sustainment",
    description:
      "One context layer from capture, through engineering, to sustainment. Govern AQAP, AS9100, ISO 27001, and ECSS as one stack.",
    tags: ["NATO AQAP", "AS9100", "ECSS", "ISO 27001", "M&A Integration"],
    available: true,
  },
  {
    slug: "satcom",
    icon: <Satellite className="w-6 h-6" />,
    title: "Satellite Operators & Fleet Operations",
    lifecycle: "Operator & Fleet Lifecycle",
    description:
      "15-year fleet memory, procurement governance, and spectrum continuity.",
    tags: ["ITU-R", "FCC Part 25", "SLA", "LEOP"],
    available: true,
  },
  {
    slug: "banking",
    icon: <Landmark className="w-6 h-6" />,
    title: "Retail Banking & Financial Services",
    lifecycle: "Brand · Conduct · Lifecycle",
    description:
      "Brand voice, product rules, and regulator wording governed across KYC, complaints, credit, and group governance.",
    tags: ["EBA", "Consumer Duty", "DORA", "AML6"],
    available: true,
  },
  {
    slug: "automotive",
    icon: <Car className="w-6 h-6" />,
    title: "Automotive R&D & Functional Safety",
    lifecycle: "Engineering V-Cycle · Cross-Border R&D",
    description:
      "Chassis-control IP, HQ design intent, and ISO 26262 / ASPICE judgment governed across cross-border engineering sites.",
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REGULATED_INDUSTRIES.map((ind) => {
                const card = (
                  <div
                    className="group h-full rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      borderColor: ind.available
                        ? "hsl(var(--primary) / 0.2)"
                        : "hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  >
                    {!ind.available && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        Soon
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
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
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5 leading-tight">
                          {ind.lifecycle}
                        </p>
                        <h3 className="text-[15px] font-bold text-foreground leading-snug">
                          {ind.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">
                      {ind.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {ind.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {ind.tags.length > 3 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 text-muted-foreground">
                          +{ind.tags.length - 3}
                        </span>
                      )}
                    </div>
                    {ind.available && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
                return ind.available ? (
                  <Link key={ind.slug} to={`/industries/${ind.slug}`} className="block">
                    {card}
                  </Link>
                ) : (
                  <div key={ind.slug}>{card}</div>
                );
              })}
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
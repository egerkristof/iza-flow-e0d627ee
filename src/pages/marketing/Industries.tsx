import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import { Pill, Building2, Briefcase, ArrowRight, Lock } from "lucide-react";
import { SectionTag } from "@/components/marketing/home/shared";

const INDUSTRIES = [
  {
    slug: "pharma",
    icon: <Pill className="w-6 h-6" />,
    title: "Pharma & Life Sciences",
    lifecycle: "Medicine Lifecycle Management",
    description:
      "From R&D through post-market surveillance — govern AI across GxP-regulated processes without losing speed or traceability.",
    tags: ["GAMP 5", "21 CFR Part 11", "ALCOA+"],
    available: true,
  },
  {
    slug: "financial-services",
    icon: <Building2 className="w-6 h-6" />,
    title: "Financial Services",
    lifecycle: "Risk & Compliance Lifecycle",
    description:
      "Model validation, regulatory reporting, and audit readiness — AI execution governed by your compliance frameworks.",
    tags: ["MaRisk", "DORA", "Basel III"],
    available: false,
  },
  {
    slug: "professional-services",
    icon: <Briefcase className="w-6 h-6" />,
    title: "Professional Services",
    lifecycle: "Engagement Delivery Lifecycle",
    description:
      "From scoping to delivery to knowledge harvest — make every engagement as good as your best team's last one.",
    tags: ["ISO 20700", "Delivery Playbooks"],
    available: false,
  },
];

export default function IndustriesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionTag label="Industry Solutions" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            Every regulated industry has a lifecycle.
            <br />
            <span className="text-primary">LIZA governs the AI inside it.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Where documentation meets execution, where compliance meets speed — LIZA is the operating system 
            that ensures AI-assisted work stays accurate, traceable, and audit-ready.
          </p>
        </div>
      </section>

      {/* The Lifecycle Thesis */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border p-8 md:p-10 mb-12"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-3 text-primary">
              The Lifecycle Thesis
            </p>
            <p className="text-lg md:text-xl font-semibold text-foreground mb-3 leading-snug">
              Regulated industries share a pattern: complex lifecycles where human judgment 
              and documentation standards determine quality.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI makes these processes faster — but without governance, it makes them 
              inconsistent and unauditable. LIZA sits between your people and their AI tools, 
              ensuring every output meets your standards. Think of it as ALM 
              (Application Lifecycle Management) — but for your industry's core processes.
            </p>
          </div>

          {/* Industry Cards */}
          <div className="grid gap-6">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.slug}
                className="group rounded-2xl border p-8 transition-all relative overflow-hidden"
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

                <div className="flex flex-col md:flex-row md:items-start gap-6">
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
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {ind.title}
                    </h3>
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
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Don't see your industry? The lifecycle pattern applies everywhere standards meet execution.
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

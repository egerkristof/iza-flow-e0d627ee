import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import ContextGapCalculator from "@/components/marketing/ContextGapCalculator";
import { ArrowRight } from "lucide-react";

export default function CalculatorPage() {
  useEffect(() => {
    document.title = "What Is Your Context Gap Costing You? | LIZA OS";
  }, []);

  return (
    <MarketingLayout>

      {/* Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-primary/30" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-primary/70">
              30-second cost check
            </span>
            <div className="h-px w-8 bg-primary/30" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.08]">
            Your AI isn't broken.
            <br />
            It's missing your context.
            <br />
            <span className="brand-gradient-text">Here's what that costs you.</span>
          </h1>
        </div>
      </section>

      {/* Calculator */}
      <ContextGapCalculator />

      {/* Methodology */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <details className="group">
            <summary
              className="cursor-pointer text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors list-none flex items-center gap-2"
            >
              <span className="transition-transform group-open:rotate-90">›</span>
              Methodology and sources
            </summary>
            <div
              className="mt-4 rounded-2xl border p-6"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The anchor metric (direct AI rework hours per week) is sourced from the
                  <strong className="text-foreground"> Zapier AI Workslop Report</strong> (January 2026, n=1,100 enterprise users),
                  cross-referenced with the <strong className="text-foreground">Workday Global AI Impact Study</strong> (2026).
                </p>
                <p>
                  Department-specific tax profiles are calibrated to each function's structural
                  characteristics. Engineering teams experience higher duplication from siloed
                  problem-solving. Sales teams face higher handoff friction at the delivery boundary.
                  Legal teams generate disproportionate shadow governance costs across the organization.
                </p>
                <p>
                  The 65% recovery rate represents the midpoint of reported reductions in organizations
                  that have implemented a governed context layer at infrastructure level.
                </p>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* CTA to Diagnostic */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl border p-8 md:p-10"
            style={{
              borderColor: "hsl(var(--primary) / 0.2)",
              background: "hsl(var(--primary) / 0.03)",
            }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              You've seen the cost. Now find the cause.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              The calculator quantifies what you're losing. The diagnostic shows you exactly
              where the context gaps are in your team's AI execution.
              Five minutes. No signup required.
            </p>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Find the cause
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-5">
              <a
                href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground"
              >
                Or skip ahead — book a 20-min call
              </a>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

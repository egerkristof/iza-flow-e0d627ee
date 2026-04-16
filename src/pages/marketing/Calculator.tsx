import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import InstructionGapCalculator from "@/components/marketing/InstructionGapCalculator";
import { ArrowRight } from "lucide-react";

export default function CalculatorPage() {
  useEffect(() => {
    document.title = "What Is Unstructured AI Costing You? | LIZA OS";
  }, []);

  return (
    <MarketingLayout>

      {/* Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Your team is fixing AI outputs every week.
            <br />
            <span className="text-muted-foreground">How much is that actually costing you?</span>
          </h1>
        </div>
      </section>

      {/* Calculator */}
      <InstructionGapCalculator />

      {/* Context bridge */}
      <section className="px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl border p-6 md:p-8"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <h2 className="text-lg font-bold text-foreground mb-3">Why these numbers exist</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Every AI tool your team uses today was built to be general-purpose. It doesn't know
                your standards, your terminology, your quality bar, or how your department hands work
                to the next one. So your people fill that gap manually, every single time.
              </p>
              <p>
                That's not a training problem. It's an infrastructure problem. The knowledge that
                should govern how AI executes in your organization doesn't exist in a form AI can use.
                So every prompt starts from zero, every output needs human correction, and every
                new hire rebuilds the wheel.
              </p>
              <p>
                The taxes above aren't theoretical. They're what happens structurally when expertise
                stays locked in individual heads instead of becoming organizational infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                  that have implemented governed AI instruction sets at infrastructure level.
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
              The calculator quantifies what you're losing. The diagnostic tells you exactly
              where the instruction gaps are in your team's AI execution.
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
              Take the Diagnostic
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

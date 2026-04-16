import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import InstructionGapCalculator from "@/components/marketing/InstructionGapCalculator";
import { ArrowRight } from "lucide-react";

export default function CalculatorPage() {
  useEffect(() => {
    document.title = "Instruction Gap Tax Calculator | LIZA OS";
  }, []);

  return (
    <MarketingLayout>

      {/* Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
            The Instruction Gap Tax
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every team using AI without governed instruction sets pays an invisible tax.
            Rework is just the surface. The structural costs underneath are what compound.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <InstructionGapCalculator />

      {/* Methodology */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl border p-6 md:p-8"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Methodology</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                The anchor metric (direct AI rework hours per week) is sourced from the
                <strong className="text-foreground"> Zapier AI Workslop Report</strong> (January 2026, n=1,100 enterprise users),
                cross-referenced with the <strong className="text-foreground">Workday Global AI Impact Study</strong> (2026).
              </p>
              <p>
                Department-specific tax profiles (duplication rates, inconsistency rates, turnover impact, governance overhead)
                are calibrated to each function's structural characteristics. Engineering teams experience higher duplication
                from siloed problem-solving; Sales teams face higher handoff friction at the delivery boundary; Legal teams
                generate disproportionate shadow governance costs across the organization.
              </p>
              <p>
                The 65% recovery rate represents the midpoint of reported reductions in organizations that have implemented
                governed AI instruction sets at infrastructure level, based on early adopter data from structured governance programs.
              </p>
            </div>
          </div>
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
              Now see where your gaps are
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              The calculator shows the cost. The diagnostic shows the cause.
              Take the 5-minute AI Execution Assessment to pinpoint your team's specific instruction gaps.
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

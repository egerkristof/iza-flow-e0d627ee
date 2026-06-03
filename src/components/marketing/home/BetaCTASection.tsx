import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GradientText, CAL_URL } from "./shared";

export function BetaCTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-12 md:p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)" }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-5 leading-[1.15]">
              You were hired to make the rollout stick.
              <br />
              <GradientText>We build the layer that does.</GradientText>
            </h2>
            <p className="text-base mb-8 text-muted-foreground max-w-md mx-auto">
              One call. We map your current rollout against the governance gaps
              and show you exactly where the leverage is.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
                }}
              >
                Book a call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/diagnostic"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-semibold border transition-colors"
                style={{
                  borderColor: "hsl(var(--primary) / 0.3)",
                  color: "hsl(var(--primary))",
                }}
              >
                Score your AI execution <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

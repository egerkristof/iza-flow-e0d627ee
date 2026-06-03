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
            <h2 className="text-3xl font-black mb-4">
              You were hired to make AI stick.
              <br />
              <GradientText>We build the layer that lets it.</GradientText>
            </h2>
            <p className="text-base mb-2 text-muted-foreground">
              One call. We map your rollout against the governance loop and
              show you where the leverage is.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-8">
              Not ready for a call? Score your AI execution first.
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
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
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

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GradientText, CAL_URL } from "./shared";

export function BetaCTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)" }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Your team is already fast.
              <br />
              <GradientText>Make them compound.</GradientText>
            </h2>
            <p className="text-base mb-2 text-muted-foreground">
              Private Beta · 1 month free · Limited to 10 teams per cohort.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-2">
              For teams of 5–30 where AI speed needs to become team-level intelligence.
            </p>
            <p className="text-xs text-muted-foreground/50 mb-6">
              Built by a team that has run 200+ consulting engagements across 4 continents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/beta"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
                }}
              >
                Join the Private Beta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Or <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">book a discovery call</a> if you'd rather talk first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

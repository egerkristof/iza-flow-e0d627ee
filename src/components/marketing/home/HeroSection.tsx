import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GradientText } from "./shared";

export function HeroSection() {
  return (
    <section className="relative py-28 md:py-40 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-6">Knowledge infrastructure for teams</p>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.05]">
          Do the right thing.
          <br />
          <GradientText>At the right moment.</GradientText>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Teams have always needed practical wisdom to execute well. Now, for the first time, AI can help — if it's built on knowledge infrastructure, not just data.
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
          <button
            onClick={() => document.getElementById("the-problem")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            See why this matters ↓
          </button>
        </div>
      </div>
    </section>
  );
}

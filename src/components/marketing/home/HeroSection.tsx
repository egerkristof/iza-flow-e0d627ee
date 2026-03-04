import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GradientText } from "./shared";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-5">
          For the person responsible for team output
        </p>

        <h1 className="text-5xl md:text-7xl font-black mb-5 leading-[1.05]">
          Manage how your team
          <br />
          <GradientText>actually executes.</GradientText>
        </h1>

        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
          Your team should execute from the best available knowledge, learn from every engagement,
          and evolve together. In the age of AI, keeping those reins together has never been harder —
          or more important.
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
            onClick={() => document.getElementById("maturity-ladder")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Where is your team? ↓
          </button>
        </div>
      </div>
    </section>
  );
}

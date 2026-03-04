import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-primary mb-8">
          <Shield className="w-3 h-3" />
          For leaders who own execution quality
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.08]">
          AI without team governance
          <br />
          <span className="text-muted-foreground">only scales chaos.</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12">
          LIZA OS lets you scale your team's AI execution
          <span className="relative inline font-semibold text-foreground">
            {" "}by defining, enforcing, and continuously improving how work gets done.
            <span className="absolute bottom-0 left-0 w-full h-[2px] rounded-full" style={{ background: "var(--gradient-brand-btn)" }} />
          </span>
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
            onClick={() => document.getElementById("three-reasons")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            See the three gaps ↓
          </button>
        </div>
      </div>
    </section>
  );
}

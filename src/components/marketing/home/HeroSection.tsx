import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { GradientText } from "./shared";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-primary mb-5">
          <Shield className="w-3 h-3" />
          For leaders whose team output is their reputation
        </p>

        <h1 className="text-5xl md:text-7xl font-black mb-5 leading-[1.05]">
          Enforce how your team
          <br />
          <GradientText>actually executes.</GradientText>
        </h1>

        <p className="text-base text-muted-foreground max-w-sm mx-auto mb-8">
          Your standards, enforced in every AI session. Always current. Always followed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
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
            Where is your team? ↓
          </button>
        </div>

        {/* Product glimpse */}
        <div
          className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border"
          style={{ borderColor: "hsl(var(--border))", boxShadow: "0 20px 60px -15px hsl(var(--primary) / 0.15)" }}
        >
          <img
            src="/images/product-execute-protocol.png"
            alt="LIZA OS — Protocol execution with pre-loaded team context"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

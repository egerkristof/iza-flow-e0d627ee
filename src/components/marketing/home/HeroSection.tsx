import { ArrowRight, Shield } from "lucide-react";
import { CAL_URL } from "./shared";

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
          Define, scale, and improve
          <br />
          <span className="text-muted-foreground">how your team executes with AI.</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12">
          Your team already uses AI. But everyone does it differently, and{" "}
          <span className="font-semibold text-foreground">nothing compounds.</span>
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
            Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => document.getElementById("three-reasons")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            See why this happens ↓
          </button>
        </div>
      </div>
    </section>
  );
}

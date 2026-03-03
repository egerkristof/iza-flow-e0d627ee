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
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-5">Team AI for consulting &amp; professional services</p>

        <h1 className="text-5xl md:text-7xl font-black mb-5 leading-[1.05]">
          Your team's AI.
          <br />
          <GradientText>One shared brain.</GradientText>
        </h1>

        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
          LIZA loads your methodology, your client knowledge, and your team's judgment into every AI session — so anyone can execute like your best people.
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
            See why ↓
          </button>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CAL_URL } from "./shared";

export function HeroSection() {
  return (
    <section className="relative pt-14 pb-16 md:pt-20 md:pb-24 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)",
          transform: "translate(20%, -20%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-black mb-4 leading-[1.1] tracking-tight">
          No AI tool was built to
          <br />
          <span className="text-primary">execute with your knowledge.</span>
        </h1>

        <p className="text-base md:text-lg font-semibold mb-8 text-muted-foreground max-w-xl mx-auto">
          LIZA OS captures your organization's best practices and turns them into executable knowledge, so every AI workflow your team runs is governed by proven standards.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
          <Link
            to="/diagnostic"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Take the 90s Diagnostic
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Book a Discovery Call <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          15 years of methodology · 15+ clients across 8 countries
        </p>
      </div>
    </section>
  );
}

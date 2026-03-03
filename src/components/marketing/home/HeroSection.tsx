import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const AI_TOOLS = [
  { name: "ChatGPT", feature: "Memory" },
  { name: "Claude", feature: "Projects" },
  { name: "Gemini", feature: "Gems" },
  { name: "Copilot", feature: "Notebooks" },
];

export function HeroSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <SectionTag label="Execution infrastructure" icon={<Zap className="w-3 h-3" />} />

        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-[1.08]">
          Everyone has AI.
          <br />
          <GradientText>Nobody has context.</GradientText>
        </h1>

        <p className="text-lg leading-relaxed mb-6 text-muted-foreground max-w-2xl mx-auto">
          Your team uses {AI_TOOLS.map((t, i) => (
            <span key={t.name}>
              {i > 0 && (i === AI_TOOLS.length - 1 ? ", and " : ", ")}
              <span className="font-semibold text-foreground">{t.name}</span>
              <span className="text-muted-foreground"> {t.feature}</span>
            </span>
          ))}. Each person works in their own silo. Knowledge stays personal. Results depend on who runs it.
        </p>

        <p className="text-base font-semibold text-foreground mb-8 max-w-xl mx-auto">
          LIZA turns individual AI into <GradientText>team intelligence</GradientText> — live context that's shared, structured, and executable.
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
            onClick={() => document.getElementById("liza-loop")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            See how it works ↓
          </button>
        </div>
      </div>
    </section>
  );
}

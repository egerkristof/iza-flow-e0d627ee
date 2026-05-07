import { Link } from "react-router-dom";
import { ArrowRight, Database, Workflow, Sparkles, Compass } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const TILES = [
  { label: "Systems of record", sub: "Drive, DBs, docs, email", icon: <Database className="w-4 h-4" /> },
  { label: "Where work happens", sub: "Guided workspace + agents", icon: <Workflow className="w-4 h-4" /> },
  { label: "Your AI tools", sub: "Copilot, Glean, vendor RAG", icon: <Sparkles className="w-4 h-4" /> },
];

export function ArchitectureTeaser() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <SectionTag label="Where Liza fits" />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.08] tracking-tight">
            One standard.{" "}
            <GradientText>Every surface inherits it.</GradientText>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Sits between your records, your work, and every AI tool you already use. Nothing gets ripped out.
          </p>
        </div>

        {/* Mini teaser diagram */}
        <div className="relative max-w-3xl mx-auto rounded-2xl border p-6 md:p-8"
          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
        >
          {/* Decision Standard core */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-[0.18em] uppercase"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                border: "1px solid hsl(var(--primary) / 0.3)",
              }}
            >
              <Compass className="w-3.5 h-3.5" /> Decision Standard
            </div>
            <p className="text-xs text-muted-foreground mt-2">The governed core your leadership owns</p>
          </div>

          {/* Three connected surfaces */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {TILES.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border p-4 text-center"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
                >
                  {t.icon}
                </div>
                <p className="text-sm font-bold text-foreground leading-tight">{t.label}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{t.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Read in. Write back. Propagate everywhere.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/os"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            See the full architecture
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
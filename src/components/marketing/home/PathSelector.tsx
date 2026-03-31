import { Link } from "react-router-dom";
import { Building2, Zap, ArrowRight } from "lucide-react";

const TRACKS = [
  {
    icon: <Building2 className="w-6 h-6" />,
    label: "Enterprise",
    headline: "Scaling a regulated operation?",
    desc: "End-to-end lifecycle solutions for teams that need governed AI execution across departments and compliance frameworks.",
    cta: "Explore industry solutions",
    to: "/industries",
    col: "200 90% 52%",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    label: "Teams",
    headline: "Building with a lean team?",
    desc: "Pick the capabilities you need today. Living playbooks, team-wide AI consistency, and compounding knowledge — no lifecycle required.",
    cta: "See what you can do",
    to: "/use-cases",
    col: "155 72% 46%",
  },
];

export function PathSelector() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs font-black tracking-[0.25em] uppercase mb-8 text-muted-foreground">
          Two ways to start
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {TRACKS.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group relative rounded-2xl border p-8 transition-all duration-200 hover:shadow-lg"
              style={{
                borderColor: `hsl(${t.col} / 0.2)`,
                background: `hsl(${t.col} / 0.03)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-opacity duration-200 opacity-60 group-hover:opacity-100"
                style={{ background: `hsl(${t.col})` }}
              />

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${t.col} / 0.12)`, color: `hsl(${t.col})` }}
                >
                  {t.icon}
                </div>
                <span
                  className="text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                  style={{ background: `hsl(${t.col} / 0.1)`, color: `hsl(${t.col})` }}
                >
                  {t.label}
                </span>
              </div>

              <h3 className="text-xl font-black mb-2 text-foreground">{t.headline}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t.desc}</p>

              <span
                className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                style={{ color: `hsl(${t.col})` }}
              >
                {t.cta} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

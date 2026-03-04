import { Link } from "react-router-dom";
import { BookOpen, FolderOpen, ArrowRight } from "lucide-react";

const CARDS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Our Manifesto",
    desc: "The philosophy behind LIZA — why judgment can't be automated, only amplified.",
    to: "/manifesto",
  },
  {
    icon: <FolderOpen className="w-5 h-5" />,
    title: "Use Cases",
    desc: "See how consulting, sales, and strategy teams use LIZA to compound team knowledge.",
    to: "/use-cases",
  },
];

export function LearnMoreSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-8">
          Go deeper
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-xl border p-6 flex items-start gap-4 transition-colors hover:border-primary/30"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <div className="shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }}>{c.icon}</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-1 flex items-center gap-1.5">
                  {c.title}
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

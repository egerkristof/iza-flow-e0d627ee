import { Link } from "react-router-dom";
import {
  ArrowRight, Rocket, Building2,
  Target, Sparkles, BookOpen, MessageSquare, ShieldCheck, Brain, Users,
  Microscope, Factory, Truck, Scale, Briefcase
} from "lucide-react";
import { SectionTag, CAL_URL } from "./shared";

/* ── Capability modules (agile teams pick these) ─────────────────────── */

const CAPABILITIES = [
  { icon: <BookOpen className="w-4 h-4" />, label: "Onboarding Playbooks", color: "200 75% 48%" },
  { icon: <Target className="w-4 h-4" />, label: "Sales Consistency", color: "155 65% 42%" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Meeting Intelligence", color: "42 85% 50%" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Marketing Playbooks", color: "280 60% 55%" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Security Audits", color: "12 75% 55%" },
  { icon: <Brain className="w-4 h-4" />, label: "Smart Briefs", color: "340 65% 50%" },
];

/* ── Lifecycle verticals (enterprise deploys these) ──────────────────── */

const LIFECYCLES = [
  { icon: <Microscope className="w-4 h-4" />, label: "Regulated Science", color: "200 75% 48%" },
  { icon: <Factory className="w-4 h-4" />, label: "Manufacturing & QA", color: "12 75% 55%" },
  { icon: <Briefcase className="w-4 h-4" />, label: "Professional Services", color: "155 65% 42%" },
  { icon: <Truck className="w-4 h-4" />, label: "Supply Chain", color: "280 60% 55%" },
  { icon: <Scale className="w-4 h-4" />, label: "Compliance & Legal", color: "42 85% 50%" },
];

export function TwoEntryPoints() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="Two ways in, one platform" />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Same engine. Different starting points.
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Whether you pick a single capability or deploy across an entire lifecycle,
            you're building on the same Define, Execute, Compound loop.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Agile / Capabilities track ────────────────────────────── */}
          <div
            className="rounded-2xl border p-7 relative overflow-hidden"
            style={{
              borderColor: "hsl(155 65% 42% / 0.2)",
              background: "hsl(155 65% 42% / 0.03)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "hsl(155 65% 42%)" }}
            />

            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-4 h-4" style={{ color: "hsl(155 65% 42%)" }} />
              <p
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color: "hsl(155 65% 42%)" }}
              >
                Start with capabilities
              </p>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1">
              For agile teams and startups
            </h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Pick one capability, get started this week. Add more as you grow.
              No consultancy required.
            </p>

            {/* Capability boxes */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CAPABILITIES.map((c) => (
                <div
                  key={c.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium"
                  style={{
                    borderColor: "hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                >
                  <span style={{ color: `hsl(${c.color})` }}>{c.icon}</span>
                  <span className="text-foreground">{c.label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/use-cases"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
              style={{ color: "hsl(155 65% 42%)" }}
            >
              Explore capabilities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Enterprise / Lifecycle track ──────────────────────────── */}
          <div
            className="rounded-2xl border p-7 relative overflow-hidden"
            style={{
              borderColor: "hsl(200 75% 48% / 0.2)",
              background: "hsl(200 75% 48% / 0.03)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "hsl(200 75% 48%)" }}
            />

            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4" style={{ color: "hsl(200 75% 48%)" }} />
              <p
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color: "hsl(200 75% 48%)" }}
              >
                Deploy across a lifecycle
              </p>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1">
              For organisations with established processes
            </h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              We assess your workflows, change-manage the transition, and deploy
              LIZA end-to-end through our AI-Native Operations Program.
            </p>

            {/* Lifecycle boxes */}
            <div className="flex flex-wrap gap-2 mb-6">
              {LIFECYCLES.map((l) => (
                <div
                  key={l.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium"
                  style={{
                    borderColor: "hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                >
                  <span style={{ color: `hsl(${l.color})` }}>{l.icon}</span>
                  <span className="text-foreground">{l.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/industries"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
                style={{ color: "hsl(200 75% 48%)" }}
              >
                Explore industries <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Book assessment call <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

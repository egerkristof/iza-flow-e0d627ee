import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Shield, Zap, RefreshCw,
  AlertTriangle, Clock, Eye,
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";
import { ReactNode } from "react";
import ContextGapCalculator from "@/components/marketing/ContextGapCalculator";

export interface LifecycleStage {
  icon: ReactNode;
  label: string;
  color: string;
}

export interface PainPoint {
  icon: ReactNode;
  title: string;
  desc: string;
}

export interface UseCase {
  icon: ReactNode;
  title: string;
  desc: string;
  tags: string[];
}

export interface FunctionalLifecycleConfig {
  tag: string;
  tagIcon: ReactNode;
  headline: string;
  headlineAccent: string;
  subtitle: string;
  lifecycleLabel: string;
  stages: LifecycleStage[];
  lifecycleNote: string;
  painHeadline: string;
  pains: PainPoint[];
  howItWorksNote: string;
  howItWorks?: { icon: ReactNode; step: string; title: string; desc: string }[];
  useCaseHeadline: string;
  useCaseNote: string;
  useCases: UseCase[];
  ctaHeadline: string;
  ctaNote: string;
  showCalculator?: boolean;
  deckHref?: string;
  deckLabel?: string;
}

const DEFAULT_HOW = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Capture",
    desc: "Your best practices, playbooks, and tribal knowledge become structured, reusable context.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "Context is organised into governed bundles scoped to roles, teams, and processes.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Execute",
    desc: "AI-assisted workflows run with quality gates ensuring human review at every critical step.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Exceptions, feedback, and successful patterns feed back into the knowledge base automatically.",
  },
];

export default function FunctionalLifecyclePage({ config }: { config: FunctionalLifecycleConfig }) {
  const howItWorks = config.howItWorks ?? DEFAULT_HOW;

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label={config.tag} icon={config.tagIcon} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            {config.headline}
            <br />
            <span className="text-primary">{config.headlineAccent}</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            {config.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Book a Discovery Call <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Take the Diagnostic
            </Link>
          </div>
        </div>
      </section>

      {/* Lifecycle stages */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-center mb-6 text-primary">
            {config.lifecycleLabel}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {config.stages.map((stage, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <span style={{ color: `hsl(${stage.color})` }}>{stage.icon}</span>
                <span className="font-medium text-foreground">{stage.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">{config.lifecycleNote}</p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            {config.painHeadline}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {config.pains.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl border p-6"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Context Gap Tax Calculator */}
      {config.showCalculator !== false && <ContextGapCalculator />}

      {/* How LIZA works */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            How LIZA governs AI across your {config.tag.toLowerCase()}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            {config.howItWorksNote}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border p-6 relative"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <span className="text-[10px] font-black tracking-widest text-primary mb-3 block">
                  STEP {step.step}
                </span>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {step.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            {config.useCaseHeadline}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            {config.useCaseNote}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {config.useCases.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border p-6"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-foreground">{v.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{v.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            {config.ctaHeadline}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">{config.ctaNote}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Book a Discovery Call <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Take the Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            {config.deckHref && (
              <Link
                to={config.deckHref}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                {config.deckLabel ?? "View the Deck"} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

import { Link } from "react-router-dom";
import {
  ArrowRight, Radar, Scale, Workflow as WorkflowIcon, Share2,
  Beaker, Landmark, Rocket, Car, Building2, Briefcase, Target, Users,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SectionTag, GradientText, CAL_URL } from "@/components/marketing/home/shared";
import { LizaOSStack } from "@/components/marketing/os/LizaOSStack";

const MOVES = [
  {
    icon: <Radar className="w-5 h-5" />,
    title: "Sense",
    body: "Pull context from your systems and your people. Capture the judgment that was never written down.",
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Decide",
    body: "Standards, mandates, and playbooks become a runtime check. Policy stops being a PDF.",
  },
  {
    icon: <WorkflowIcon className="w-5 h-5" />,
    title: "Execute",
    body: "Teams work inside one space. Your AI agents run there, against the right governed bundle.",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Propagate",
    body: "When a standard or artifact changes, every dependent output is updated, not just flagged.",
  },
];

const INDUSTRY_CARDS = [
  { label: "Pharma & Life Sciences", href: "/industries/regulated", icon: <Beaker className="w-5 h-5" /> },
  { label: "Banking & Insurance", href: "/industries/banking", icon: <Landmark className="w-5 h-5" /> },
  { label: "Space & Defense", href: "/industries/space-defense", icon: <Rocket className="w-5 h-5" /> },
  { label: "Automotive", href: "/industries/automotive", icon: <Car className="w-5 h-5" /> },
  { label: "AEC & Construction", href: "/industries/aec", icon: <Building2 className="w-5 h-5" /> },
  { label: "Professional Services", href: "/industries/professional-services", icon: <Briefcase className="w-5 h-5" /> },
  { label: "GTM & Sales", href: "/industries/gtm", icon: <Target className="w-5 h-5" /> },
  { label: "Account Management", href: "/industries/account-management", icon: <Users className="w-5 h-5" /> },
];

export default function OSPage() {
  return (
    <MarketingLayout>
      {/* Hero — short, punchy, statement-led */}
      <section className="relative pt-20 pb-10 md:pt-28 md:pb-14 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.07) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, hsl(var(--primary) / 0.08) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <SectionTag label="The Liza framework" />
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            The system of record for how your company decides.
            <br />
            <GradientText>So every AI tool executes to your standard.</GradientText>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
            Your standards, playbooks, and live artifacts become one governed core.
            Copilot, Glean, ChatGPT, and the workspace your teams operate in all run against it.
            Consistent behaviour, everywhere AI executes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#stack"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              See it for my industry
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Book a mapping call
            </a>
          </div>
        </div>
      </section>

      {/* The interactive stack */}
      <section id="stack" className="py-8 md:py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <LizaOSStack />
        </div>
      </section>

      {/* The four moves */}
      <section className="py-16 md:py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionTag label="What the system actually does" />
            <h2 className="text-3xl md:text-4xl font-black">
              Four moves.{" "}
              <GradientText>Run continuously.</GradientText>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {MOVES.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border p-5"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {m.icon}
                </div>
                <h3 className="text-base font-black mb-1.5">{m.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry grid */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <SectionTag label="See it in your world" />
            <h2 className="text-3xl md:text-4xl font-black">
              Same architecture.{" "}
              <GradientText>Your vocabulary.</GradientText>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              The diagram above already relabels in your language. Click through for the full industry view.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {INDUSTRY_CARDS.map((c) => (
              <Link
                key={c.href}
                to={c.href}
                className="group rounded-xl border p-4 transition-all hover:-translate-y-0.5"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {c.icon}
                </div>
                <p className="text-sm font-bold text-foreground leading-tight mb-1">{c.label}</p>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary inline-flex items-center gap-1 opacity-70 group-hover:opacity-100">
                  Open <ArrowRight className="w-3 h-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="py-16 md:py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto text-center">
          <SectionTag label="The reframe" />
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-5">
            Copilot, Glean, vendor RAG are not competitors.
            <br />
            <GradientText>They are surfaces that get better when they read from the standard.</GradientText>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            None of them define how your company decides. Liza does. Connect them and they
            inherit your standards, your mandates, and your audit trail.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-5">
            Ready to map your stack?
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-7">
            A 30-minute call. We sketch where the standard would live, what surfaces would inherit it,
            and what the first 30 days would look like.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Map your stack
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Score your AI execution
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

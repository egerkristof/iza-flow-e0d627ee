import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, Zap, Users, Building2,
  Gauge, CreditCard, Sparkles, HelpCircle, Rocket,
} from "lucide-react";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";
const GRN = "155 72% 46%";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function SectionTag({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
      style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
    >
      {icon}{label}
    </p>
  );
}

/* ── TIERS DATA ─────────────────────────────────────────────────────────── */

const TIERS = [
  {
    name: "Starter",
    price: "€99",
    unit: "/user/mo",
    description: "For individuals and small teams getting started with structured execution.",
    credits: "500",
    creditsLabel: "credits/mo",
    overage: "€0.05/credit",
    cta: "Start Free Trial",
    ctaHref: "/auth",
    highlight: false,
    features: [
      "Build & run your own playbooks",
      "Personal knowledge base",
      "AI copilot assistance",
      "Extraction engine access",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: "€199",
    unit: "/user/mo",
    description: "For teams that need shared playbooks, delegation, and oversight.",
    credits: "2,000",
    creditsLabel: "credits/user/mo",
    overage: "€0.04/credit",
    cta: "Start Free Trial",
    ctaHref: "/auth",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Shared context bundles",
      "Delegation & task assignment",
      "Oversight dashboard",
      "Protocol execution tracking",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    description: "For organisations scaling expertise across departments.",
    credits: "Custom",
    creditsLabel: "credit pool",
    overage: "Negotiated",
    cta: "Talk to Us",
    ctaHref: CAL_URL,
    ctaExternal: true,
    highlight: false,
    features: [
      "Everything in Team",
      "SSO & advanced security",
      "Audit trails & compliance",
      "Custom domains & scoping",
      "Dedicated onboarding",
      "SLA & priority engineering",
    ],
  },
] as const;

/* ── CREDIT PACKS ──────────────────────────────────────────────────────── */

const CREDIT_PACKS = [
  { amount: "500", price: "€20", perCredit: "€0.04" },
  { amount: "2,000", price: "€60", perCredit: "€0.03", popular: true },
  { amount: "5,000", price: "€125", perCredit: "€0.025" },
];

/* ── HERO ──────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <SectionTag label="Pricing" icon={<CreditCard className="w-3 h-3" />} />
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.08]">
          Simple pricing.
          <br />
          <GradientText>Visible credits.</GradientText>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          Pick a plan, see exactly what you use, buy more when you need it. No hidden fees, no surprises.
        </p>
      </div>
    </section>
  );
}

/* ── TIER CARDS ─────────────────────────────────────────────────────────── */

function TierCards() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="relative rounded-2xl border overflow-hidden flex flex-col"
            style={{
              background: tier.highlight ? "hsl(var(--card))" : "hsl(var(--background))",
              borderColor: tier.highlight ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
              boxShadow: tier.highlight ? "0 0 40px -8px hsl(var(--primary) / 0.2)" : "none",
            }}
          >
            {/* Top accent */}
            {tier.highlight && (
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient-brand)" }} />
            )}

            <div className="p-8 flex-1 flex flex-col">
              {/* Badge */}
              {"badge" in tier && tier.badge && (
                <span
                  className="self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {tier.badge}
                </span>
              )}

              {/* Name & Price */}
              <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black">{tier.price}</span>
                {tier.unit && <span className="text-sm text-muted-foreground">{tier.unit}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{tier.description}</p>

              {/* Credits */}
              <div
                className="rounded-xl p-4 mb-6"
                style={{ background: "hsl(var(--primary) / 0.04)", border: "1px solid hsl(var(--primary) / 0.12)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">AI Credits</span>
                </div>
                <p className="text-lg font-black" style={{ color: "hsl(var(--primary))" }}>
                  {tier.credits} <span className="text-xs font-medium text-muted-foreground">{tier.creditsLabel}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Overage: {tier.overage}
                </p>
              </div>

              {/* Features */}
              <div className="flex-1 space-y-3 mb-8">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {"ctaExternal" in tier && tier.ctaExternal ? (
                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3.5 rounded-xl text-sm font-semibold transition-all border"
                  style={{
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {tier.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
                </a>
              ) : (
                <Link
                  to={tier.ctaHref}
                  className="block text-center px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={
                    tier.highlight
                      ? {
                          background: "var(--gradient-brand-btn)",
                          color: "hsl(var(--primary-foreground))",
                          boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.35)",
                        }
                      : {
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--foreground))",
                        }
                  }
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── HARD LIMIT EXPLAINER ──────────────────────────────────────────────── */

function CreditsExplainer() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="How Credits Work" icon={<Gauge className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Transparent usage.
            <br />
            <GradientText>Always in control.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "What costs credits",
              items: ["AI copilot messages", "Extraction runs", "Research queries", "Protocol agent steps"],
            },
            {
              icon: <CheckCircle2 className="w-5 h-5" />,
              title: "What's always free",
              items: ["Editing playbooks & bundles", "Task management", "Manual protocol steps", "Viewing & navigation"],
            },
            {
              icon: <Gauge className="w-5 h-5" />,
              title: "Visible fuel gauge",
              items: ["Live counter in-app", "Green → amber → red", "Usage breakdown by feature", "Auto-refill option"],
            },
          ].map((col, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                {col.icon}
              </div>
              <h3 className="font-bold text-base mb-3">{col.title}</h3>
              <div className="space-y-2">
                {col.items.map((item, j) => (
                  <p key={j} className="text-sm text-muted-foreground">• {item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hard limit callout */}
        <div
          className="rounded-2xl border p-6 flex items-start gap-4"
          style={{ background: "hsl(var(--destructive) / 0.04)", borderColor: "hsl(var(--destructive) / 0.2)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
          >
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1">What happens at zero?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI features pause until you buy more credits or your monthly allowance renews. Everything else (editing, viewing, tasks, manual steps) keeps working normally. One-click top-up from the banner, back online instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CREDIT PACKS ──────────────────────────────────────────────────────── */

function CreditPacks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Top Up" icon={<Zap className="w-3 h-3" />} />
          <h2 className="text-3xl font-black mb-3">
            Need more? <GradientText>Buy credit packs.</GradientText>
          </h2>
          <p className="text-muted-foreground text-sm">Pre-paid. Never expire. Volume discounts.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.amount}
              className="relative rounded-2xl border p-6 text-center"
              style={{
                background: pack.popular ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
                borderColor: pack.popular ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))",
                boxShadow: pack.popular ? "0 0 24px -8px hsl(var(--primary) / 0.15)" : "none",
              }}
            >
              {pack.popular && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full"
                  style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                >
                  Best Value
                </span>
              )}
              <p className="text-3xl font-black mb-1">{pack.amount}</p>
              <p className="text-xs text-muted-foreground mb-3">credits</p>
              <p className="text-xl font-bold mb-1">{pack.price}</p>
              <p className="text-xs text-muted-foreground">{pack.perCredit}/credit</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SPRINT BRIDGE ─────────────────────────────────────────────────────── */

function SprintBridge() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto">
        <div
          className="relative rounded-3xl border-2 overflow-hidden p-10 md:p-14"
          style={{ borderColor: `hsl(${GRN} / 0.3)`, background: "hsl(var(--background))" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(${GRN}))` }} />
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
            style={{ background: `radial-gradient(circle, hsl(${GRN} / 0.06), transparent 65%)`, transform: "translate(30%, -30%)" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(${GRN} / 0.1)`, color: `hsl(${GRN})` }}
              >
                <Rocket className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: `hsl(${GRN})` }}>
                The Fast Lane
              </p>
            </div>

            <h2 className="text-3xl font-black mb-3">
              Start with the Protocol Sprint
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-lg leading-relaxed">
              Don't want to start from scratch? For <span className="text-foreground font-semibold">€5,000</span>, we extract and codify your first critical process in 5 days — and you get <span className="font-semibold" style={{ color: `hsl(${GRN})` }}>3,000 bonus credits + 3 months of Team tier included</span>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { label: "Sprint", value: "5 Days" },
                { label: "Bonus Credits", value: "3,000" },
                { label: "Team Tier", value: "3 Months" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border p-4 text-center"
                  style={{ background: `hsl(${GRN} / 0.04)`, borderColor: `hsl(${GRN} / 0.15)` }}
                >
                  <p className="text-xs text-muted-foreground font-bold tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="text-2xl font-black" style={{ color: `hsl(${GRN})` }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/sprint"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--primary)), hsl(${GRN}))`,
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: `0 0 32px -4px hsl(${GRN} / 0.4)`,
                }}
              >
                Learn About the Sprint <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "Can I try LIZA before committing?",
    a: "Yes. Every plan starts with a free trial. You can also try the Extraction Engine for free, no account needed.",
  },
  {
    q: "What counts as a credit?",
    a: "Any AI-powered action: copilot messages, extraction runs, research queries, and automated protocol steps. Non-AI features (editing, viewing, tasks) are always free.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Monthly plan credits reset each billing cycle. Purchased credit packs never expire.",
  },
  {
    q: "Can I set up auto-refill?",
    a: "Yes. You can enable auto-refill to purchase a credit pack automatically when your balance drops below a threshold you set.",
  },
  {
    q: "What happens when I hit zero credits?",
    a: "AI features pause. Everything else keeps working. Buy a credit pack and you're back online instantly.",
  },
  {
    q: "How does the Sprint convert to a subscription?",
    a: "The Protocol Sprint includes 3 months of Team tier + 3,000 bonus credits. After 3 months, you continue on whatever plan you choose.",
  },
];

function FAQ() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="FAQ" icon={<HelpCircle className="w-3 h-3" />} />
          <h2 className="text-3xl font-black">Common questions</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border p-6"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FINAL CTA ─────────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Ready to turn judgment
          <br />
          <GradientText>into infrastructure?</GradientText>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Start with a free trial, or talk to us about the Protocol Sprint.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/auth"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            Book a Discovery Call
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── PAGE ───────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <TierCards />
      <CreditsExplainer />
      <CreditPacks />
      <SprintBridge />
      <FAQ />
      <FinalCTA />
    </MarketingLayout>
  );
}

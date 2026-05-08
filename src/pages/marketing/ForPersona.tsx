import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, Cpu, Banknote, Building2, Server } from "lucide-react";
import { motion } from "framer-motion";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CAL_URL } from "@/components/marketing/home/shared";

type PersonaContent = {
  slug: string;
  label: string;
  icon: typeof Cpu;
  hero: { eyebrow: string; headline: string; sub: string };
  bruises: string[];
  proof: { value: string; label: string }[];
  outcome: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
};

const PERSONAS: Record<string, PersonaContent> = {
  "head-of-ai": {
    slug: "head-of-ai",
    label: "For Heads of AI",
    icon: Cpu,
    hero: {
      eyebrow: "Head of AI / VP AI",
      headline: "You shipped the tools. Nobody owns the standard.",
      sub: "Copilot, Claude, vendor RAG, internal GPTs. Three answers to the same question. LIZA gives you one executable standard every AI surface reads before it answers.",
    },
    bruises: [
      "Every team forks its own prompts. You can't audit which version produced what.",
      "New models ship weekly. Your governance can't ship weekly with them.",
      "Leadership asks for AI ROI. You can show usage, not outcome.",
    ],
    proof: [
      { value: "1", label: "executable standard across every AI tool" },
      { value: "Days", label: "not quarters, to update policy in production" },
      { value: "100%", label: "of generations traceable to a versioned standard" },
    ],
    outcome: "You stop being the AI tooling buyer. You become the AI standards owner.",
    ctaPrimary: "Score your AI execution",
    ctaPrimaryHref: "/diagnostic",
  },
  cfo: {
    slug: "cfo",
    label: "For CFOs",
    icon: Banknote,
    hero: {
      eyebrow: "CFO / FP&A",
      headline: "AI is moving from flat seats to metered tokens. Your P&L isn't ready.",
      sub: "By 2027 every token is a P&L line. Without a standard, every token is unanchored spend. LIZA ties every token to a policy, workflow, or outcome you can defend.",
    },
    bruises: [
      "AI run-rate climbs every quarter. Nobody can tell you ROI per token.",
      "Vendors price by consumption. You're buying it by seat.",
      "Auditors will ask what your AI generated and why. You'll have logs, not lineage.",
    ],
    proof: [
      { value: "ROI / token", label: "instead of cost / seat" },
      { value: "P&L line", label: "for every AI workflow you run" },
      { value: "Audit-ready", label: "lineage from token back to standard" },
    ],
    outcome: "You stop buying AI tools. You start owning AI unit economics.",
    ctaPrimary: "Model your AI unit economics",
    ctaPrimaryHref: "/calculator",
  },
  "business-lead": {
    slug: "business-lead",
    label: "For Business Leads",
    icon: Building2,
    hero: {
      eyebrow: "Function Owner / GM",
      headline: "Your team uses AI like a Ouija board.",
      sub: "Confident output. Drifts from policy. New hires take months because the standard lives in people's heads. LIZA encodes how your function actually decides, so AI executes to it on day one.",
    },
    bruises: [
      "Two senior people leave. Their judgement leaves with them.",
      "AI drafts look polished and miss the rule that actually matters.",
      "You can't scale headcount-light because the playbook isn't executable.",
    ],
    proof: [
      { value: "Days", label: "not months, to ramp on your standard" },
      { value: "1 playbook", label: "every team and tool executes against" },
      { value: "0", label: "tribal knowledge required to deliver consistently" },
    ],
    outcome: "Your standard stops being a PDF nobody reads. It becomes what AI runs on.",
    ctaPrimary: "See it on your function",
    ctaPrimaryHref: CAL_URL,
  },
  infra: {
    slug: "infra",
    label: "For Platform & Infra",
    icon: Server,
    hero: {
      eyebrow: "Platform / Infra Lead",
      headline: "Vendor lock-in is the new technical debt.",
      sub: "You sit on top of LLMs that change weekly. Your governance can't depend on any one of them. LIZA is the model-agnostic standards layer your platform team owns, not a vendor.",
    },
    bruises: [
      "Every vendor wants to be the system of record. None can be.",
      "Standards encoded in vendor prompts die when the vendor pivots.",
      "Your platform team gets blamed for AI behaviour they don't control.",
    ],
    proof: [
      { value: "Zero lock-in", label: "swap models, keep the standard" },
      { value: "Owned by you", label: "not a vendor, not a model provider" },
      { value: "Versioned", label: "every standard, every tool, every output" },
    ],
    outcome: "It becomes the only piece of your AI stack you'd refuse to rip out.",
    ctaPrimary: "See the architecture",
    ctaPrimaryHref: "/os",
  },
};

export default function ForPersonaPage() {
  const { slug } = useParams<{ slug: string }>();
  const persona = slug ? PERSONAS[slug] : undefined;
  if (!persona) return <Navigate to="/" replace />;
  const Icon = persona.icon;

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card mb-6"
          >
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {persona.hero.eyebrow}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black mb-5 leading-[1.08] tracking-tight"
          >
            {persona.hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed mb-9 max-w-xl mx-auto"
          >
            {persona.hero.sub}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={persona.ctaPrimaryHref}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              {persona.ctaPrimary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/os"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              See the architecture <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bruises */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[11px] font-black tracking-[0.25em] uppercase mb-8 text-center"
            style={{ color: "hsl(var(--primary))" }}
          >
            What you live with today
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {persona.bruises.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="text-3xl font-black text-primary/30 mb-3">0{i + 1}</div>
                <p className="text-sm font-medium text-foreground leading-relaxed">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[11px] font-black tracking-[0.25em] uppercase mb-3 text-center"
            style={{ color: "hsl(var(--primary))" }}
          >
            What changes with LIZA
          </p>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-center mb-12 max-w-2xl mx-auto">
            {persona.outcome}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {persona.proof.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-7 text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                  {p.value}
                </div>
                <div className="text-sm text-muted-foreground">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-black mb-5 tracking-tight">
            Ready to see it on your standard?
          </h3>
          <p className="text-muted-foreground mb-8">
            Bring one playbook, policy, or workflow. We'll show you LIZA executing it against your real AI tools.
          </p>
          <Link
            to={persona.ctaPrimaryHref}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            {persona.ctaPrimary}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
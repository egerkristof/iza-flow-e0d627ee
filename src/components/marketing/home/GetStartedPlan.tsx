import { motion } from "framer-motion";
import { Settings, Workflow, TrendingUp, ArrowRight } from "lucide-react";
import { SectionTag, GradientText, CAL_URL } from "./shared";
import { MockStandardEditor, MockRun, MockDashboard } from "./StepMocks";

const STEPS = [
  {
    n: "01",
    icon: Settings,
    title: "Map your compliance perimeter",
    body: "Encode your rules once. Regulatory lines (SOC 2, ISO, EU AI Act, GDPR). Financial lines (CFO token ROI, budget caps). Operational lines (data scope, brand, best practice). Every AI tool in your org has to obey them.",
    tag: "Days 0–14 · co-built",
    mock: MockStandardEditor,
    caption: "One playbook. Enforced across ChatGPT, Copilot, Claude, internal LLMs.",
  },
  {
    n: "02",
    icon: Workflow,
    title: "Wire your first workflows",
    body: "Pick one team. Encode the playbook for their work: what good output looks like, what it must include, what it can never say. Put real work through it. Every output signed. Legal sees the receipts. Finance sees cost per outcome.",
    tag: "Days 15–45 · one team live",
    mock: MockRun,
    caption: "Every output stamped with the playbook, the model, the cost, the version.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Measure it. Then scale.",
    body: "Cost per outcome. Percent of outputs replayable. Policy drift rate. The numbers your CFO and board are asking for surface automatically. You pick workflow two, team two, function two. The library compounds.",
    tag: "Days 46–90 · org rollout",
    mock: MockDashboard,
    caption: "The metrics your CFO and board already keep asking for. Live.",
  },
];

export function GetStartedPlan() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="How it works" />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            Three steps. We build the{" "}
            <GradientText>first one with you.</GradientText>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            One workflow. One team. A standard in production within fourteen days.
            Then you scale.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24 mb-16">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const Mock = s.mock;
            const reverse = i % 2 === 1;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Copy side */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl md:text-5xl font-black text-muted-foreground/15 leading-none">
                      {s.n}
                    </span>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: "hsl(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-black tracking-[0.18em] uppercase text-primary">
                      {s.tag}
                    </p>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3 leading-[1.15]">
                    {s.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {s.body}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80 border-l-2 pl-3" style={{ borderColor: "hsl(var(--primary))" }}>
                    {s.caption}
                  </p>
                </div>

                {/* Mock side */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="relative"
                >
                  <div
                    className="absolute -inset-4 rounded-3xl pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, hsl(var(--primary) / 0.08), transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <Mock />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a call to start
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
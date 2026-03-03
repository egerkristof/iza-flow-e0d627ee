import { Target, Users, ShieldCheck, Briefcase } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Delegate your thinking, not just your tasks",
    desc: "The loop captures your judgment. When you brief someone, they receive your intent, your standards, and the context that matters — not a task description. Zero check-ins needed.",
    col: "var(--primary)",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Onboard in weeks, not months",
    desc: "Because the loop has been running, new hires inherit months of accumulated team intelligence. The playbook isn't a PDF — it's live context loaded into their first session.",
    col: "var(--warning)",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Every rep sells like your best",
    desc: "Every objection response, pricing judgment, and deal qualification pattern that the loop has captured is available — in the conversation, in the moment. Not after the deal is lost.",
    col: "var(--success)",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Protect revenue before dashboards turn red",
    desc: "Risk signals and expansion cues the loop detected across previous engagements are cross-referenced in real-time. Every account manager works with institutional memory, not just their own.",
    col: "270 60% 65%",
  },
];

export function DelegateSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Because the loop runs" />
          <h2 className="text-4xl font-black mb-4">
            Your team executes at your level. <GradientText>Without you in the room.</GradientText>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Each of these outcomes is a direct result of the Collaborate → Learn → Execute loop compounding over time.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {CASES.map((c, i) => {
            const colVal = c.col.includes("--") ? c.col.replace("var(", "").replace(")", "") : c.col;
            return (
              <div
                key={i}
                className="relative rounded-2xl p-7 border overflow-hidden"
                style={{ background: `hsl(${colVal} / 0.03)`, borderColor: `hsl(${colVal} / 0.2)` }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${colVal})` }} />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `hsl(${colVal} / 0.12)`, color: `hsl(${colVal})` }}
                >
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link to="/use-cases" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>
            See all use cases in detail <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
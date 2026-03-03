import { Target, Users, ShieldCheck, Briefcase } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Delegate your thinking, not just your tasks",
    desc: "Generate briefs that carry your intent, judgment, and standards. People execute correctly because they have the full context. Zero check-ins needed.",
    col: "var(--primary)",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Onboard in weeks, not months",
    desc: "New hires run on senior-level judgment from week one. The playbook carries the expertise, the context engine loads it, the system coaches through execution.",
    col: "var(--warning)",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Every rep sells like your best",
    desc: "Deal qualification, objection handling, pricing judgment. Encoded and live for every rep. Not in a PDF — in the conversation, in the moment.",
    col: "var(--success)",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Protect revenue before dashboards turn red",
    desc: "Risk signals, renewal timing, expansion cues. Available to every AM in real-time, cross-referenced with what worked last quarter.",
    col: "270 60% 65%",
  },
];

export function DelegateSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="In practice" />
          <h2 className="text-4xl font-black mb-4">
            Your team executes at your level. <GradientText>Without you in the room.</GradientText>
          </h2>
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

import { Upload, Wand2, Play } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const STEPS = [
  {
    num: "1",
    icon: <Upload className="w-5 h-5" />,
    title: "Upload your knowledge",
    desc: "Drop in your existing docs, templates, and best practices. LIZA extracts the structure automatically.",
  },
  {
    num: "2",
    icon: <Wand2 className="w-5 h-5" />,
    title: "Review & enforce",
    desc: "Approve extracted standards and set enforcement levels. Your playbook is live in minutes, not months.",
  },
  {
    num: "3",
    icon: <Play className="w-5 h-5" />,
    title: "Execute as a team",
    desc: "Your team starts working with governed AI sessions. Every engagement makes your standards sharper.",
  },
];

export function GettingStartedStrip() {
  return (
    <section id="getting-started" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Getting started" />
          <h2 className="text-2xl md:text-3xl font-black">
            Live in <GradientText>three steps.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="relative rounded-xl border p-6 text-center"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
              >
                <span className="text-sm font-black">{s.num}</span>
              </div>
              <div className="flex justify-center mb-3" style={{ color: "hsl(var(--primary))" }}>
                {s.icon}
              </div>
              <h3 className="text-sm font-bold mb-1.5">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

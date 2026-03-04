import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, Users } from "lucide-react";
import { GradientText, CAL_URL } from "./shared";

const STEPS = [
  {
    num: "1",
    icon: <Play className="w-4 h-4" />,
    title: "Start working",
    desc: "Upload existing docs or start from scratch. LIZA extracts structure automatically.",
  },
  {
    num: "2",
    icon: <Sparkles className="w-4 h-4" />,
    title: "Define your standards",
    desc: "Capture best practices, edge cases, quality criteria. Set enforcement levels.",
  },
  {
    num: "3",
    icon: <Users className="w-4 h-4" />,
    title: "Your team compounds",
    desc: "Every session makes your playbooks sharper. New hires execute at team level from week one.",
  },
];

export function BetaCTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-12 md:p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)" }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Make your team's best thinking
              <br />
              <GradientText>the default for everyone.</GradientText>
            </h2>
            <p className="text-base mb-8 text-muted-foreground">
              Private Beta · 1 month free · Limited to 10 teams per cohort.
            </p>

            {/* Inline getting started steps */}
            <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
              {STEPS.map((s) => (
                <div key={s.num} className="text-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                  >
                    <span className="text-xs font-black">{s.num}</span>
                  </div>
                  <h3 className="text-xs font-bold mb-0.5">{s.title}</h3>
                  <p className="text-[10px] text-muted-foreground leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/beta"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
                }}
              >
                Join the Private Beta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Or <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">book a discovery call</a> if you'd rather talk first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

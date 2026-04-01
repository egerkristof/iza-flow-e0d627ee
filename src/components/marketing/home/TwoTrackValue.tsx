import { Link } from "react-router-dom";
import { ArrowRight, Shield, Workflow, Brain, Repeat, Target, Sparkles, BookOpen } from "lucide-react";
import { SectionTag } from "./shared";

const ENTERPRISE_ITEMS = [
  { icon: <Shield className="w-4 h-4" />, title: "Regulatory compliance built in", desc: "GMP, ISO 17025, 21 CFR Part 11. Your standards become executable playbooks" },
  { icon: <Workflow className="w-4 h-4" />, title: "End-to-end lifecycle governance", desc: "From research to release, every phase connected through living context" },
  { icon: <Brain className="w-4 h-4" />, title: "Institutional knowledge preserved", desc: "Senior expertise encoded, not lost when people leave" },
  { icon: <Repeat className="w-4 h-4" />, title: "Continuous improvement loops", desc: "Every execution feeds back into the system. Your organisation compounds" },
];

const TEAM_ITEMS = [
  { icon: <Target className="w-4 h-4" />, title: "Consistent AI execution", desc: "Same quality output regardless of who runs the session" },
  { icon: <Sparkles className="w-4 h-4" />, title: "Living playbooks", desc: "Stop copy-pasting prompts. Define once, enforce everywhere, update continuously" },
  { icon: <BookOpen className="w-4 h-4" />, title: "Onboard in days, not months", desc: "New team members execute at senior level from day one" },
  { icon: <Repeat className="w-4 h-4" />, title: "Team learning on autopilot", desc: "What one person discovers becomes everyone's advantage next session" },
];

export function TwoTrackValue() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="One platform, two entry points" />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Whether you're governing a lifecycle
            <br />
            <span className="text-muted-foreground">or accelerating a team.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Enterprise track */}
          <div
            className="rounded-2xl border p-7 relative overflow-hidden"
            style={{
              borderColor: "hsl(200 90% 52% / 0.2)",
              background: "hsl(200 90% 52% / 0.03)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "hsl(200 90% 52%)" }} />
            <p
              className="text-[10px] font-black tracking-[0.2em] uppercase mb-5"
              style={{ color: "hsl(200 90% 52%)" }}
            >
              Enterprise & Consulting
            </p>

            <div className="space-y-4 mb-6">
              {ENTERPRISE_ITEMS.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "hsl(200 90% 52% / 0.1)", color: "hsl(200 90% 52%)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/industries"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
              style={{ color: "hsl(200 90% 52%)" }}
            >
              Explore industry solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Teams track */}
          <div
            className="rounded-2xl border p-7 relative overflow-hidden"
            style={{
              borderColor: "hsl(155 72% 46% / 0.2)",
              background: "hsl(155 72% 46% / 0.03)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "hsl(155 72% 46%)" }} />
            <p
              className="text-[10px] font-black tracking-[0.2em] uppercase mb-5"
              style={{ color: "hsl(155 72% 46%)" }}
            >
              Small & Self-Serve Teams
            </p>

            <div className="space-y-4 mb-6">
              {TEAM_ITEMS.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "hsl(155 72% 46% / 0.1)", color: "hsl(155 72% 46%)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/use-cases"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
              style={{ color: "hsl(155 72% 46%)" }}
            >
              See capabilities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Briefcase, Users, Headphones, GraduationCap, Pill, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const FUNCTIONS = [
  { icon: <Briefcase className="w-5 h-5" />, label: "Sales", desc: "Playbooks that close" },
  { icon: <Headphones className="w-5 h-5" />, label: "Consulting", desc: "Delivery at scale" },
  { icon: <Users className="w-5 h-5" />, label: "Account Mgmt", desc: "Consistent service" },
  { icon: <GraduationCap className="w-5 h-5" />, label: "Onboarding", desc: "Ramp in days, not months" },
];

const INDUSTRIES = [
  { icon: <Pill className="w-4 h-4" />, label: "Pharma & Biotech" },
  { icon: <Building2 className="w-4 h-4" />, label: "Lab Governance" },
  { icon: <Building2 className="w-4 h-4" />, label: "Food Safety" },
  { icon: <Briefcase className="w-4 h-4" />, label: "Professional Services" },
];

export function WhoItsForStrip() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-[11px] font-black tracking-[0.25em] uppercase mb-3"
          style={{ color: "hsl(var(--primary))" }}
        >
          For teams that hit the AI ceiling
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          Your people already use AI. The problem is they each use it differently — especially in industries where the stakes are too high for inconsistent AI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {FUNCTIONS.map((fn, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl border transition-colors hover:border-primary/30"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            >
              <span style={{ color: "hsl(var(--primary))" }}>{fn.icon}</span>
              <span className="text-sm font-semibold text-foreground">{fn.label}</span>
              <span className="text-xs text-muted-foreground">{fn.desc}</span>
            </div>
          ))}
        </div>

        {/* Industry lifecycle signal */}
        <div
          className="inline-flex items-center gap-4 px-5 py-3 rounded-xl border mb-6"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            Built for regulated lifecycles
          </span>
          <span className="w-px h-4" style={{ background: "hsl(var(--border))" }} />
          {INDUSTRIES.map((ind, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span style={{ color: "hsl(var(--primary))" }}>{ind.icon}</span>
              {ind.label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/use-cases"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            See all use cases →
          </Link>
          <Link
            to="/industries"
            className="text-sm font-medium text-primary hover:underline transition-colors"
          >
            Explore industries →
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AI_TOOL_OPTIONS = [
  "ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "Other",
];

const TEAM_SIZE_OPTIONS = [
  { label: "2-5 people", value: "2-5" },
  { label: "5-15 people", value: "5-15" },
  { label: "15-30 people", value: "15-30" },
  { label: "30+ people", value: "30+" },
];

const GRN = "155 72% 46%";

export default function BetaPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [frustration, setFrustration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTool = (tool: string) => {
    setAiTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !teamSize) return;

    setSubmitting(true);
    try {
      const roleDescription = [
        name && `Name: ${name}`,
        company && `Company: ${company}`,
        `Team size: ${teamSize}`,
        aiTools.length > 0 && `AI tools: ${aiTools.join(", ")}`,
        frustration && `Frustration: ${frustration}`,
      ].filter(Boolean).join(" | ");

      const { error } = await supabase.from("beta_signups").insert({
        email,
        role_description: roleDescription,
      });

      if (error) throw error;

      // Send notification email to founders
      supabase.functions.invoke("notify-signup", {
        body: { email, role_description: roleDescription },
      }).catch((err) => console.error("Notification error:", err));

      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <MarketingLayout>
        <section className="py-32 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: `hsl(${GRN} / 0.1)`, color: `hsl(${GRN})` }}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black mb-4">You're in.</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We'll reach out within 48 hours to set up your onboarding session.
            </p>
            <div className="rounded-xl border p-6 text-left space-y-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
              <p className="text-sm font-semibold">Here's what we'll do together:</p>
              {[
                "A guided onboarding call where we walk you through LIZA OS (30 min)",
                "We help you configure your workspace for your first real use case",
                "Your team's existing methodology gets imported as living playbooks",
                "We explain the trial, answer questions, and get you running",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground/70 mt-6">
              Need a guided architecture exercise before going self-serve?{" "}
              <a href="/audit" className="font-semibold text-primary hover:underline">
                See the AI Execution Blueprint →
              </a>
            </p>
          </div>
        </section>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <section className="py-32 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase mb-6"
              style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}>
              <Sparkles className="w-3 h-3" /> Private Beta
            </div>
            <h1 className="text-4xl font-black mb-4 leading-tight">
              Join the Private Beta.
            </h1>
            <p className="text-base text-muted-foreground mb-2 max-w-md mx-auto">
              LIZA OS is the management layer that lets your team define, enforce, and continuously improve how they execute with AI, so your best thinking becomes the default for everyone.
            </p>
            <p className="text-lg text-muted-foreground">
              For teams of 5–30. 1 month free, then €2,000/mo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground"
                  style={{ borderColor: "hsl(var(--border))" }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground"
                  style={{ borderColor: "hsl(var(--border))" }}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground"
                style={{ borderColor: "hsl(var(--border))" }}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Team size *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTeamSize(opt.value)}
                    className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      borderColor: teamSize === opt.value ? "hsl(var(--primary))" : "hsl(var(--border))",
                      background: teamSize === opt.value ? "hsl(var(--primary) / 0.08)" : "transparent",
                      color: teamSize === opt.value ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Which AI tools does your team use?
              </label>
              <div className="flex flex-wrap gap-2">
                {AI_TOOL_OPTIONS.map((tool) => {
                  const selected = aiTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className="px-4 py-2 rounded-full border text-sm font-medium transition-all"
                      style={{
                        borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
                        background: selected ? "hsl(var(--primary) / 0.08)" : "transparent",
                        color: selected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                What's your biggest AI frustration? (optional)
              </label>
              <textarea
                value={frustration}
                onChange={(e) => setFrustration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground resize-none"
                style={{ borderColor: "hsl(var(--border))" }}
                rows={3}
                placeholder="E.g. everyone uses different tools and nothing is consistent..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !email || !teamSize}
              className="w-full py-4 rounded-xl text-base font-semibold transition-all disabled:opacity-50"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              {submitting ? "Submitting..." : "Request Beta Access"}
            </button>
          </form>
        </div>
      </section>
    </MarketingLayout>
  );
}

import { useState } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CheckCircle2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_OPTIONS = [
  { label: "C-Level / Founder", value: "c-level" },
  { label: "VP / Director", value: "vp-director" },
  { label: "Manager / Team Lead", value: "manager" },
  { label: "Individual Contributor", value: "ic" },
];

const TEAM_SIZE_OPTIONS = [
  { label: "2–5", value: "2-5" },
  { label: "5–15", value: "5-15" },
  { label: "15–30", value: "15-30" },
  { label: "30+", value: "30+" },
];

const INTEREST_OPTIONS = [
  {
    value: "governance",
    emoji: "🧠",
    title: "Standardize AI execution",
    description: "Define how your team should use AI — and enforce it",
  },
  {
    value: "playbooks",
    emoji: "📋",
    title: "Turn methodology into playbooks",
    description: "Make your best practices repeatable and living",
  },
  {
    value: "oversight",
    emoji: "🔍",
    title: "Get execution visibility",
    description: "See how AI is actually being used across the team",
  },
  {
    value: "all",
    emoji: "🚀",
    title: "All of the above",
    description: "Full platform — governance, playbooks, and oversight",
  },
];

export default function PlatformSignupPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [interest, setInterest] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canProceedStep1 = name.trim() && email.trim() && role;
  const canProceedStep2 = teamSize && interest;

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        role,
        team_size: teamSize,
        primary_interest: interest,
        additional_notes: notes.trim() || null,
      };

      const { error } = await supabase.from("platform_signups").insert(payload);
      if (error) throw error;

      // Notification email to founders
      const roleDescription = [
        `Name: ${name}`,
        company && `Company: ${company}`,
        `Role: ${role}`,
        `Team size: ${teamSize}`,
        `Interest: ${interest}`,
        notes && `Notes: ${notes}`,
      ].filter(Boolean).join(" | ");

      supabase.functions.invoke("notify-signup", {
        body: { email: email.trim(), role_description: roleDescription },
      }).catch((err) => console.error("Notification error:", err));

      setSubmitted(true);
    } catch (err: any) {
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black mb-4">You're on the list.</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We'll reach out within 48 hours to schedule your onboarding session.
            </p>
            <div
              className="rounded-xl border p-6 text-left space-y-4"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <p className="text-sm font-semibold text-foreground">Here's what happens next:</p>
              {[
                "A guided onboarding call where we walk you through LIZA OS (30 min)",
                "We help you configure your workspace for your first real use case",
                "Your team's existing methodology gets imported as living playbooks",
                "We explain the trial, answer questions, and get you running",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "hsl(var(--success))" }} />
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                color: "hsl(var(--primary))",
                borderColor: "hsl(var(--primary) / 0.25)",
                background: "hsl(var(--primary) / 0.06)",
              }}
            >
              <Sparkles className="w-3 h-3" /> Early Access
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight text-foreground">
              Get early access to LIZA OS.
            </h1>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              The management layer for teams that want to define, enforce, and improve how they execute with AI.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: s === step ? "2rem" : "0.75rem",
                  background: s <= step ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step 1 of 3 — About you</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Name *</label>
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Work email *</label>
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Your role *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left"
                        style={{
                          borderColor: role === opt.value ? "hsl(var(--primary))" : "hsl(var(--border))",
                          background: role === opt.value ? "hsl(var(--primary) / 0.08)" : "transparent",
                          color: role === opt.value ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-xl text-base font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{
                    background: "var(--gradient-brand-btn)",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: canProceedStep1 ? "0 0 24px -4px hsl(var(--primary) / 0.4)" : "none",
                  }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Context */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step 2 of 3 — Your team</p>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Team size *</label>
                  <div className="grid grid-cols-4 gap-2">
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">What interests you most? *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTEREST_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setInterest(opt.value)}
                        className="p-4 rounded-xl border text-left transition-all"
                        style={{
                          borderColor: interest === opt.value ? "hsl(var(--primary))" : "hsl(var(--border))",
                          background: interest === opt.value ? "hsl(var(--primary) / 0.06)" : "hsl(var(--card))",
                        }}
                      >
                        <span className="text-xl mb-1 block">{opt.emoji}</span>
                        <span
                          className="text-sm font-semibold block mb-0.5"
                          style={{ color: interest === opt.value ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
                        >
                          {opt.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-2"
                    style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    disabled={!canProceedStep2}
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-xl text-base font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--gradient-brand-btn)",
                      color: "hsl(var(--primary-foreground))",
                      boxShadow: canProceedStep2 ? "0 0 24px -4px hsl(var(--primary) / 0.4)" : "none",
                    }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Optional + Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step 3 of 3 — Almost done</p>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Anything else we should know? (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground resize-none"
                    style={{ borderColor: "hsl(var(--border))" }}
                    rows={4}
                    placeholder="E.g. specific use case, pain point, or timeline..."
                  />
                </div>

                {/* Summary */}
                <div
                  className="rounded-xl border p-4 space-y-2"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
                  <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground font-medium">{name}</span>
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground font-medium">{email}</span>
                    {company && (
                      <>
                        <span className="text-muted-foreground">Company</span>
                        <span className="text-foreground font-medium">{company}</span>
                      </>
                    )}
                    <span className="text-muted-foreground">Role</span>
                    <span className="text-foreground font-medium">{ROLE_OPTIONS.find(o => o.value === role)?.label}</span>
                    <span className="text-muted-foreground">Team size</span>
                    <span className="text-foreground font-medium">{teamSize}</span>
                    <span className="text-muted-foreground">Interest</span>
                    <span className="text-foreground font-medium">{INTEREST_OPTIONS.find(o => o.value === interest)?.title}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-2"
                    style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-xl text-base font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--gradient-brand-btn)",
                      color: "hsl(var(--primary-foreground))",
                      boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.4)",
                    }}
                  >
                    {submitting ? "Submitting..." : "Request Early Access"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </MarketingLayout>
  );
}

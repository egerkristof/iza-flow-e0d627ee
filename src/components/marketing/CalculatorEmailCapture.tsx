import { useState } from "react";
import { Mail, Loader2, CheckCircle2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { attachLeadToCalcSession, type CalcSnapshot } from "@/lib/calculator-tracking";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  name: z.string().trim().max(100).optional(),
  company: z.string().trim().max(150).optional(),
});

interface Props {
  sessionId: string;
  totalGap: number;
  locked?: boolean;
  onUnlock?: () => void;
  snapshot?: CalcSnapshot;
}

export default function CalculatorEmailCapture({
  sessionId,
  totalGap,
  locked,
  onUnlock,
  snapshot,
}: Props) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, name, company });
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: "Check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await attachLeadToCalcSession(
      sessionId,
      {
        email: parsed.data.email,
        name: parsed.data.name,
        company: parsed.data.company,
      },
      snapshot,
    );
    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Could not send", description: error });
      return;
    }
    setDone(true);
    onUnlock?.();
    toast({
      title: "Breakdown unlocked",
      description: "Per-tax detail revealed below + full report sent to your inbox.",
    });
  };

  if (done) {
    return (
      <div
        className="rounded-2xl border p-6 md:p-8 text-center"
        style={{
          borderColor: "hsl(var(--primary) / 0.25)",
          background: "hsl(var(--primary) / 0.05)",
        }}
      >
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: "hsl(var(--primary))" }} />
        <p className="text-base font-bold text-foreground">Full breakdown unlocked</p>
        <p className="text-sm text-muted-foreground mt-1">
          The per-tax detail is now revealed above. We've also sent the full report — with department-specific
          interpretation and recovery sequence — to your inbox.
        </p>
      </div>
    );
  }

  const eur = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(totalGap);

  return (
    <div
      className="rounded-2xl border p-6 md:p-8"
      style={{
        borderColor: locked ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border))",
        background: locked ? "hsl(var(--primary) / 0.04)" : "hsl(var(--card))",
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--primary) / 0.1)" }}
        >
          {locked ? (
            <Lock className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          ) : (
            <Mail className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          )}
        </div>
        <div>
          <p className="text-base font-bold text-foreground">
            {locked
              ? `Unlock the per-tax breakdown of your ${eur}/year gap`
              : "Email me the full report"}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {locked
              ? "See exactly where the cost leaks across all 6 taxes — plus a department-specific interpretation and recovery sequence sent to your inbox."
              : "Per-tax detail, department interpretation, and the recovery playbook."}
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
        />
        <Input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
        <Input
          type="text"
          placeholder="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          maxLength={150}
        />
        <Button type="submit" disabled={submitting || !email}>
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : locked ? (
            "Unlock"
          ) : (
            "Send"
          )}
        </Button>
      </form>
      <p className="text-[11px] text-muted-foreground mt-3">
        No spam. We use this to send your report and follow up if you book a call.
      </p>
    </div>
  );
}

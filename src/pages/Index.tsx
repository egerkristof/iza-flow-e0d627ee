import { useState } from "react";
import { BookOpen, Library, BarChart3, Shield, Zap, ChevronRight, AlertTriangle, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MandatesDashboard } from "@/components/mandates/MandatesDashboard";
import { NerveCenterFeed } from "@/components/oversight/NerveCenterFeed";
import { WeeklyProgressWidget } from "@/components/oversight/WeeklyProgressWidget";
import { QuickActionsBar } from "@/components/oversight/QuickActionsBar";
import { PlanMyTime } from "@/components/oversight/PlanMyTime";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  const { activeRole, user } = useAuth();
  const isLeader = activeRole === "manager";
  const isOperator = activeRole === "operator";
  const [mandatesOpen, setMandatesOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);

  // Fetch active mandate count for the notification badge
  const { data: activeMandateCount = 0 } = useQuery({
    queryKey: ["active-mandate-count", user?.id],
    enabled: !!user && isOperator,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("context_items")
        .select("id", { count: "exact", head: true })
        .eq("is_mandate", true)
        .eq("mandate_status", "active")
        .is("deleted_at", null);
      if (error) throw error;
      return count ?? 0;
    },
  });

  // ─── Operator Dashboard ───
  if (isOperator) {
    return (
      <div
        className="flex flex-col gap-6 p-6 lg:p-8 relative min-h-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsl(200 90% 52% / 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 20%, hsl(155 72% 46% / 0.03) 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.04) 1px, transparent 0)
          `,
          backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        }}
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">Your Organisational Intelligence</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight brand-gradient-text">Good to have you back.</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your operational context — active mandates, sessions, and priorities.
          </p>
        </div>

        {/* Active Mandates — top of dashboard */}
        <Collapsible open={mandatesOpen} onOpenChange={setMandatesOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-3 hover:border-primary/30 transition-colors text-left">
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${mandatesOpen ? "rotate-90" : ""}`} />
            <Shield className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium uppercase tracking-widest text-[11px]">Active Mandates</span>
            {activeMandateCount > 0 && (
              <Badge className="ml-1.5 text-[9px] bg-warning/20 text-warning border-warning/30">
                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                {activeMandateCount} active
              </Badge>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <MandatesDashboard compact />
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Actions */}
        <QuickActionsBar />

        {/* Weekly Progress — collapsed by default */}
        <Collapsible open={weekOpen} onOpenChange={setWeekOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-3 hover:border-primary/30 transition-colors text-left">
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${weekOpen ? "rotate-90" : ""}`} />
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm font-medium uppercase tracking-widest text-[11px]">Weekly Metrics</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <WeeklyProgressWidget />
          </CollapsibleContent>
        </Collapsible>

        {/* Plan My Time (includes Priority Map tab) */}
        <PlanMyTime />

        {/* Priority Feed — collapsed by default */}
        <Collapsible open={feedOpen} onOpenChange={setFeedOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-3 hover:border-primary/30 transition-colors text-left">
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${feedOpen ? "rotate-90" : ""}`} />
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium uppercase tracking-widest text-[11px]">Priority Feed</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <NerveCenterFeed />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  // ─── Leader / Process Owner Dashboard ───
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">Your Organisational Intelligence</p>
        <h1 className="text-3xl font-bold tracking-tight brand-gradient-text">Good to have you back.</h1>
        <p className="mt-2 text-muted-foreground">
          Your team's best thinking, made executable. Not just documentation — working systems.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          label="EXECUTE"
          title="Workbooks"
          description="Where expertise meets action. Run protocol-guided work and capture what you learn."
          href="/workbooks"
        />
        <QuickCard
          icon={<Library className="h-5 w-5 text-success" />}
          label="DESIGN"
          title="Playbooks"
          description="Combine explicit knowledge into reusable systems your whole team can execute with."
          href="/context"
        />
        <QuickCard
          icon={<BarChart3 className="h-5 w-5 text-warning" />}
          label="OVERSEE"
          title="Oversight"
          description="See the full picture — workbook progress, drift, and strategic intent in one view."
          href="/oversight"
        />
      </div>

      {isLeader && (
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-5">
          <MandatesDashboard compact />
        </div>
      )}
    </div>
  );
};

function QuickCard({ icon, title, description, href, label }: { icon: React.ReactNode; title: string; description: string; href: string; label?: string }) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:glow-sm relative overflow-hidden"
    >
      {label && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">
          {label}
        </span>
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </a>
  );
}

export default Index;

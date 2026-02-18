import { useState } from "react";
import { ChevronDown, ChevronRight, Target, Settings2, Lightbulb, PenLine } from "lucide-react";
import { PersonalGoals } from "@/components/knowledge/PersonalGoals";
import { WorkingPreferences } from "@/components/knowledge/WorkingPreferences";
import { CapturesInbox } from "@/components/knowledge/CapturesInbox";
import { KnowledgeSources } from "@/components/knowledge/KnowledgeSources";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function MyKnowledgePage() {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [capturesOpen, setCapturesOpen] = useState(false);

  const { data: draftCount = 0 } = useQuery({
    queryKey: ["captures-inbox-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("context_items")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user!.id)
        .is("deleted_at", null)
        .filter("capture_status", "eq", "draft");
      if (error) throw error;
      return count ?? 0;
    },
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">Learn</p>
        <h1 className="text-2xl font-bold tracking-tight brand-gradient-text">My Knowledge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your source thinking hub. Create and evolve knowledge sources, then extract playbooks from them.
        </p>
      </div>

      {/* ── Profile Section (collapsed by default) ── */}
      <Collapsible open={profileOpen} onOpenChange={setProfileOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start text-muted-foreground hover:text-foreground">
            {profileOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <Target className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Profile — Goals, KPIs & Working Style</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <Tabs defaultValue="goals" className="space-y-3">
            <TabsList className="bg-muted/50 h-8">
              <TabsTrigger value="goals" className="gap-1.5 text-xs h-7">
                <Target className="h-3 w-3" /> Goals & KPIs
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-1.5 text-xs h-7">
                <Settings2 className="h-3 w-3" /> Working Style
              </TabsTrigger>
            </TabsList>
            <TabsContent value="goals">
              <PersonalGoals />
            </TabsContent>
            <TabsContent value="preferences">
              <WorkingPreferences />
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>

      {/* ── Captures Inbox Strip ── */}
      <Collapsible open={capturesOpen} onOpenChange={setCapturesOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 w-full justify-start ${draftCount > 0 ? "text-primary border-primary/30 bg-primary/5 hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
          >
            {capturesOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <Lightbulb className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Captures Inbox</span>
            {draftCount > 0 && (
              <Badge variant="default" className="ml-1 h-4 min-w-[16px] px-1 text-[9px] leading-none">
                {draftCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <CapturesInbox />
        </CollapsibleContent>
      </Collapsible>

      {/* ── My Sources (Hero Section) ── */}
      <div>
        <KnowledgeSources />
      </div>
    </div>
  );
}

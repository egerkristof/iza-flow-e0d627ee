import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Target, Settings2, BookOpen, Lightbulb } from "lucide-react";
import { PersonalDocuments } from "@/components/knowledge/PersonalDocuments";
import { PersonalGoals } from "@/components/knowledge/PersonalGoals";
import { WorkingPreferences } from "@/components/knowledge/WorkingPreferences";
import { MyContextItems } from "@/components/knowledge/MyContextItems";
import { CapturesInbox } from "@/components/knowledge/CapturesInbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function MyKnowledgePage() {
  const { user } = useAuth();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Knowledge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your profiles, set goals & KPIs, and customize how you work. This shapes your personal knowledge graph.
        </p>
      </div>

      <Tabs defaultValue={draftCount > 0 ? "captures" : "documents"} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="captures" className="gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" /> Captures
            {draftCount > 0 && (
              <Badge variant="default" className="ml-1 h-4 min-w-[16px] px-1 text-[9px] leading-none">
                {draftCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Documents
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1.5">
            <Target className="h-3.5 w-3.5" /> Goals & KPIs
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" /> Working Style
          </TabsTrigger>
          <TabsTrigger value="context-items" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> My Context Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="captures">
          <CapturesInbox />
        </TabsContent>
        <TabsContent value="documents">
          <PersonalDocuments />
        </TabsContent>
        <TabsContent value="goals">
          <PersonalGoals />
        </TabsContent>
        <TabsContent value="preferences">
          <WorkingPreferences />
        </TabsContent>
        <TabsContent value="context-items">
          <MyContextItems />
        </TabsContent>
      </Tabs>
    </div>
  );
}

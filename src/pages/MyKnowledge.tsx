import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Target, Settings2, Upload } from "lucide-react";
import { PersonalDocuments } from "@/components/knowledge/PersonalDocuments";
import { PersonalGoals } from "@/components/knowledge/PersonalGoals";
import { WorkingPreferences } from "@/components/knowledge/WorkingPreferences";

export default function MyKnowledgePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Knowledge</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your profiles, set goals & KPIs, and customize how you work. This shapes your personal knowledge graph.
        </p>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Documents
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1.5">
            <Target className="h-3.5 w-3.5" /> Goals & KPIs
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" /> Working Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <PersonalDocuments />
        </TabsContent>
        <TabsContent value="goals">
          <PersonalGoals />
        </TabsContent>
        <TabsContent value="preferences">
          <WorkingPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}

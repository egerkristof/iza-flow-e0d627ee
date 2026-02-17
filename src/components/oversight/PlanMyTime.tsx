import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Clock, Calendar, CalendarDays, Sparkles, Plus, GripVertical,
  Check, Trash2, ChevronRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Horizon = "next_hour" | "today" | "this_week";

interface PlanItem {
  id: string;
  title: string;
  description: string | null;
  source_type: string;
  source_id: string | null;
  time_horizon: string;
  planned_date: string | null;
  sort_order: number;
  is_completed: boolean;
  ai_suggested: boolean;
  created_at: string;
}

const HORIZON_CONFIG: Record<Horizon, { label: string; icon: React.ReactNode; description: string }> = {
  next_hour: { label: "Next Hour", icon: <Clock className="h-4 w-4" />, description: "Focus on 1-3 items right now" },
  today: { label: "Today", icon: <Calendar className="h-4 w-4" />, description: "Your plan for the day" },
  this_week: { label: "This Week", icon: <CalendarDays className="h-4 w-4" />, description: "Weekly overview" },
};

export function PlanMyTime() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeHorizon, setActiveHorizon] = useState<Horizon>("today");
  const [isOpen, setIsOpen] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState("");

  // Fetch plan items
  const { data: planItems = [], isLoading } = useQuery({
    queryKey: ["operator-plan", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operator_plan_items")
        .select("*")
        .eq("user_id", user!.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as PlanItem[];
    },
  });

  // AI generate plan
  const generatePlan = useMutation({
    mutationFn: async (horizon: Horizon) => {
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { time_horizon: horizon },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["operator-plan"] });
      toast({
        title: "Plan generated",
        description: `${data.count} items suggested by AI for your ${HORIZON_CONFIG[activeHorizon].label.toLowerCase()}.`,
      });
    },
    onError: (e: any) => {
      toast({ title: "Failed to generate plan", description: e.message, variant: "destructive" });
    },
  });

  // Toggle complete
  const toggleComplete = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("operator_plan_items")
        .update({
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operator-plan"] }),
  });

  // Delete item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("operator_plan_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operator-plan"] }),
  });

  // Add custom item
  const addCustomItem = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("operator_plan_items")
        .insert({
          user_id: user.id,
          title,
          source_type: "custom",
          time_horizon: activeHorizon,
          planned_date: new Date().toISOString().split("T")[0],
          sort_order: filteredItems.length,
          ai_suggested: false,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator-plan"] });
      setNewItemTitle("");
    },
  });

  const filteredItems = planItems.filter(i => i.time_horizon === activeHorizon);
  const pendingItems = filteredItems.filter(i => !i.is_completed);
  const completedItems = filteredItems.filter(i => i.is_completed);
  const totalForHorizon = (h: Horizon) => planItems.filter(i => i.time_horizon === h).length;
  const completedForHorizon = (h: Horizon) => planItems.filter(i => i.time_horizon === h && i.is_completed).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-3 hover:border-primary/30 transition-colors text-left">
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Plan My Time</span>
        {planItems.length > 0 && (
          <Badge variant="secondary" className="text-[9px] ml-1.5">
            {planItems.filter(i => !i.is_completed).length} pending
          </Badge>
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2">
        <div className="rounded-lg border border-border/50 bg-card p-4 space-y-4">
          {/* Horizon tabs */}
          <Tabs value={activeHorizon} onValueChange={v => setActiveHorizon(v as Horizon)}>
            <div className="flex items-center justify-between">
              <TabsList>
                {(Object.keys(HORIZON_CONFIG) as Horizon[]).map(h => (
                  <TabsTrigger key={h} value={h} className="text-xs gap-1.5">
                    {HORIZON_CONFIG[h].icon}
                    {HORIZON_CONFIG[h].label}
                    {totalForHorizon(h) > 0 && (
                      <Badge variant="secondary" className="text-[8px] ml-1">
                        {completedForHorizon(h)}/{totalForHorizon(h)}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5"
                disabled={generatePlan.isPending}
                onClick={() => generatePlan.mutate(activeHorizon)}
              >
                {generatePlan.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                AI Suggest
              </Button>
            </div>

            {(Object.keys(HORIZON_CONFIG) as Horizon[]).map(h => (
              <TabsContent key={h} value={h} className="mt-3 space-y-2">
                {isLoading ? (
                  <div className="text-center text-sm text-muted-foreground py-6">Loading plan…</div>
                ) : pendingItems.length === 0 && completedItems.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      No items planned for {HORIZON_CONFIG[h].label.toLowerCase()}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click <strong>AI Suggest</strong> to get recommendations or add items manually below.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Pending items */}
                    {pendingItems.map(item => (
                      <PlanItemRow
                        key={item.id}
                        item={item}
                        onToggle={() => toggleComplete.mutate({ id: item.id, completed: true })}
                        onDelete={() => deleteItem.mutate(item.id)}
                      />
                    ))}

                    {/* Completed items */}
                    {completedItems.length > 0 && (
                      <div className="pt-2 border-t border-border/30">
                        <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">
                          Completed ({completedItems.length})
                        </p>
                        {completedItems.map(item => (
                          <PlanItemRow
                            key={item.id}
                            item={item}
                            onToggle={() => toggleComplete.mutate({ id: item.id, completed: false })}
                            onDelete={() => deleteItem.mutate(item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Add custom item */}
                <div className="flex items-center gap-2 pt-2">
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder="Add a custom item…"
                    value={newItemTitle}
                    onChange={e => setNewItemTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && newItemTitle.trim()) {
                        addCustomItem.mutate(newItemTitle.trim());
                      }
                    }}
                    className="h-8 text-sm"
                  />
                  {newItemTitle.trim() && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 text-xs"
                      onClick={() => addCustomItem.mutate(newItemTitle.trim())}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function PlanItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: PlanItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const sourceIcon = item.source_type === "session"
    ? "🎯"
    : item.source_type === "task"
      ? "📋"
      : "✏️";

  return (
    <div className={`flex items-start gap-3 rounded-md px-3 py-2.5 group transition-colors ${
      item.is_completed ? "opacity-50" : "hover:bg-secondary/50"
    }`}>
      <button
        onClick={onToggle}
        className={`mt-0.5 shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
          item.is_completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
      >
        {item.is_completed && <Check className="h-3 w-3" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${item.is_completed ? "line-through text-muted-foreground" : "font-medium"}`}>
          {sourceIcon} {item.title}
        </p>
        {item.description && (
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          {item.ai_suggested && (
            <Badge variant="secondary" className="text-[8px] gap-0.5">
              <Sparkles className="h-2 w-2" /> AI
            </Badge>
          )}
          {item.planned_date && item.time_horizon === "this_week" && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(item.planned_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

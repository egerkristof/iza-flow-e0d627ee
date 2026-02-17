import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Clock, Calendar, CalendarDays, Sparkles, Plus, Brain,
  Check, Trash2, ChevronRight, Loader2, ListPlus, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PriorityGraph } from "./PriorityGraph";
import { PlanPreferencesPanel } from "./PlanPreferencesPanel";
import type { PlanPreferences } from "./PlanPreferencesPanel";

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
  const [activeTab, setActiveTab] = useState<string>("today");
  const [isOpen, setIsOpen] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [showFeedPicker, setShowFeedPicker] = useState(false);
  const [feedPickerSearch, setFeedPickerSearch] = useState("");
  const [showPrefsPanel, setShowPrefsPanel] = useState(false);

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

  // Fetch feed items for picker
  const { data: myTasks = [] } = useQuery({
    queryKey: ["plan-feed-tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, workbook_id, title, status, priority, assigned_to, created_by")
        .or(`assigned_to.eq.${user!.id},created_by.eq.${user!.id}`)
        .not("status", "in", '("done","cancelled")');
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: mySessions = [] } = useQuery({
    queryKey: ["plan-feed-sessions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_executions")
        .select("id, workbook_id, status, workbook_protocols(title)")
        .eq("executed_by", user!.id)
        .in("status", ["in_progress", "paused", "not_started"]);
      if (error) throw error;
      return (data ?? []).map(s => ({
        id: s.id,
        title: (s as any).workbook_protocols?.title ?? "Session",
        status: s.status,
        sourceType: "session" as const,
      }));
    },
  });

  // Already-planned source IDs
  const plannedSourceIds = useMemo(() => {
    const activeHorizon = activeTab as Horizon;
    if (!["next_hour", "today", "this_week"].includes(activeTab)) return new Set<string>();
    return new Set(
      planItems
        .filter(p => p.time_horizon === activeHorizon && !p.is_completed && p.source_id)
        .map(p => p.source_id!)
    );
  }, [planItems, activeTab]);

  // Feed items available for picking
  const pickableFeedItems = useMemo(() => {
    const items: { id: string; title: string; sourceType: string; status: string; priority?: string }[] = [];
    myTasks.forEach(t => {
      if (!plannedSourceIds.has(t.id)) {
        items.push({ id: t.id, title: t.title, sourceType: "task", status: t.status, priority: t.priority });
      }
    });
    mySessions.forEach(s => {
      if (!plannedSourceIds.has(s.id)) {
        items.push({ id: s.id, title: s.title, sourceType: "session", status: s.status });
      }
    });
    if (feedPickerSearch) {
      const q = feedPickerSearch.toLowerCase();
      return items.filter(i => i.title.toLowerCase().includes(q));
    }
    return items;
  }, [myTasks, mySessions, plannedSourceIds, feedPickerSearch]);

  // AI generate plan — passes existing plans from other horizons as context
  const generatePlan = useMutation({
    mutationFn: async ({ horizon, preferences }: { horizon: Horizon; preferences?: PlanPreferences }) => {
      const otherHorizonItems = planItems
        .filter(p => p.time_horizon !== horizon && !p.is_completed)
        .map(p => ({ title: p.title, horizon: p.time_horizon, source_type: p.source_type }));

      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: {
          time_horizon: horizon,
          existing_plans: otherHorizonItems,
          preferences: preferences ?? null,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["operator-plan"] });
      setShowPrefsPanel(false);
      const horizon = activeTab as Horizon;
      toast({
        title: "Plan generated",
        description: `${data.count} items suggested by AI for your ${HORIZON_CONFIG[horizon]?.label?.toLowerCase() ?? activeTab}.`,
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
        .update({ is_completed: completed, completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operator-plan"] }),
  });

  // Delete item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("operator_plan_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operator-plan"] }),
  });

  // Add custom item
  const addCustomItem = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("Not authenticated");
      const horizon = activeTab as Horizon;
      const { error } = await supabase.from("operator_plan_items").insert({
        user_id: user.id,
        title,
        source_type: "custom",
        time_horizon: horizon,
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

  // Add from feed
  const addFromFeed = useMutation({
    mutationFn: async (item: { id: string; title: string; sourceType: string }) => {
      if (!user) throw new Error("Not authenticated");
      const horizon = activeTab as Horizon;
      const { error } = await supabase.from("operator_plan_items").insert({
        user_id: user.id,
        title: item.title,
        source_type: item.sourceType,
        source_id: item.id,
        time_horizon: horizon,
        planned_date: new Date().toISOString().split("T")[0],
        sort_order: filteredItems.length,
        ai_suggested: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator-plan"] });
      toast({ title: "Added to plan" });
    },
  });

  const isHorizonTab = ["next_hour", "today", "this_week"].includes(activeTab);
  const activeHorizon = activeTab as Horizon;
  const filteredItems = isHorizonTab ? planItems.filter(i => i.time_horizon === activeTab) : [];
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <TabsTrigger value="priority_map" className="text-xs gap-1.5">
                  <Brain className="h-4 w-4" />
                  Priority Map
                </TabsTrigger>
              </TabsList>
              {isHorizonTab && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5"
                    onClick={() => setShowFeedPicker(true)}
                  >
                    <ListPlus className="h-3 w-3" />
                    From Feed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5"
                    disabled={generatePlan.isPending}
                    onClick={() => setShowPrefsPanel(prev => !prev)}
                  >
                    {generatePlan.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    AI Suggest
                  </Button>
                </div>
              )}
            </div>

            {/* Preferences panel (inline, shown when AI Suggest clicked) */}
            {showPrefsPanel && isHorizonTab && (
              <div className="mt-3">
                <PlanPreferencesPanel
                  horizon={activeHorizon}
                  onGenerate={(prefs) => generatePlan.mutate({ horizon: activeHorizon, preferences: prefs })}
                  isGenerating={generatePlan.isPending}
                />
              </div>
            )}

            {/* Horizon tab contents */}
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
                      Click <strong>AI Suggest</strong> to get recommendations, <strong>From Feed</strong> to pick from your tasks, or add items manually below.
                    </p>
                  </div>
                ) : (
                  <>
                    {pendingItems.map(item => (
                      <PlanItemRow
                        key={item.id}
                        item={item}
                        onToggle={() => toggleComplete.mutate({ id: item.id, completed: true })}
                        onDelete={() => deleteItem.mutate(item.id)}
                      />
                    ))}
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
                    placeholder={`Add a custom item to ${HORIZON_CONFIG[h].label.toLowerCase()}…`}
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
                    <Button size="sm" variant="ghost" className="shrink-0 text-xs" onClick={() => addCustomItem.mutate(newItemTitle.trim())}>
                      Add
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground pl-8">
                  Custom items are saved to your plan. They are not linked to any workbook task.
                </p>
              </TabsContent>
            ))}

            {/* Priority Map tab */}
            <TabsContent value="priority_map" className="mt-3">
              <PriorityGraph />
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>

      {/* Feed Picker Dialog */}
      <Dialog open={showFeedPicker} onOpenChange={setShowFeedPicker}>
        <DialogContent className="max-w-md max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base">Add from Priority Feed → {isHorizonTab ? HORIZON_CONFIG[activeHorizon]?.label : ""}</DialogTitle>
          </DialogHeader>
          <div className="relative mb-2">
            <Input
              placeholder="Search tasks & sessions…"
              value={feedPickerSearch}
              onChange={e => setFeedPickerSearch(e.target.value)}
              className="h-8 text-sm"
            />
            {feedPickerSearch && (
              <button onClick={() => setFeedPickerSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {pickableFeedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {feedPickerSearch ? "No matching items." : "All feed items are already planned."}
              </p>
            ) : (
              pickableFeedItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-secondary/50 cursor-pointer transition-colors group"
                  onClick={() => {
                    addFromFeed.mutate({ id: item.id, title: item.title, sourceType: item.sourceType });
                  }}
                >
                  <span className="text-sm">
                    {item.sourceType === "session" ? "🎯" : "📋"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[8px] capitalize">{item.sourceType}</Badge>
                      <Badge variant="secondary" className="text-[8px] capitalize">{item.status.replace("_", " ")}</Badge>
                      {item.priority && (
                        <Badge className={`text-[8px] ${
                          item.priority === "critical" ? "bg-destructive/10 text-destructive"
                          : item.priority === "high" ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                        }`}>{item.priority}</Badge>
                      )}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
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
  const sourceIcon = item.source_type === "session" ? "🎯" : item.source_type === "task" ? "📋" : "✏️";

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
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          {item.ai_suggested && (
            <Badge variant="secondary" className="text-[8px] gap-0.5">
              <Sparkles className="h-2 w-2" /> AI
            </Badge>
          )}
          {item.source_type !== "custom" && (
            <Badge variant="outline" className="text-[8px] capitalize">{item.source_type}</Badge>
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

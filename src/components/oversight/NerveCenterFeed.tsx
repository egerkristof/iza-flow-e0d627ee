import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListTodo, Target, Users, Filter, ArrowUpDown, LayoutGrid, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedItem } from "./FeedItem";
import { SessionResumeCard } from "./SessionResumeCard";
import { DelegationTracker } from "./DelegationTracker";
import { WhereYouLeftOff } from "./WhereYouLeftOff";
import {
  computePriorityScore, sortByScore, groupByWorkbook,
  type ScoredFeedItem,
} from "@/lib/priority-scoring";

interface NerveCenterFeedProps {
  /** External filter state */
  statusFilter?: string;
}

export function NerveCenterFeed({ statusFilter }: NerveCenterFeedProps) {
  const { user } = useAuth();
  const [grouping, setGrouping] = useState<"priority" | "workbook">("priority");
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tasks assigned to me or created by me
  const { data: myTasks = [] } = useQuery({
    queryKey: ["nerve-center-tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, workbook_id, title, status, priority, assigned_to, created_by, parent_task_id, due_date, updated_at, source_protocol_id")
        .or(`assigned_to.eq.${user!.id},created_by.eq.${user!.id}`);
      if (error) throw error;
      return data;
    },
  });

  // Fetch workbooks for titles
  const { data: workbooks = [] } = useQuery({
    queryKey: ["nerve-center-workbooks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbooks")
        .select("id, title, status, drift_score, strategic_outcome, updated_at");
      if (error) throw error;
      return data;
    },
  });

  // Fetch active sessions I'm executing
  const { data: mySessions = [] } = useQuery({
    queryKey: ["nerve-center-sessions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_executions")
        .select(`
          id, workbook_id, protocol_id, status, drift_score, updated_at,
          current_step_id, session_summary, notes,
          workbook_protocols(title)
        `)
        .eq("executed_by", user!.id)
        .in("status", ["in_progress", "paused", "not_started"]);
      if (error) throw error;
      return data;
    },
  });

  // Fetch step counts for sessions
  const sessionIds = mySessions.map(s => s.protocol_id);
  const { data: stepCounts = [] } = useQuery({
    queryKey: ["nerve-center-step-counts", sessionIds],
    enabled: sessionIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_steps")
        .select("protocol_id")
        .in("protocol_id", sessionIds);
      if (error) throw error;
      return data;
    },
  });

  const { data: stepExecs = [] } = useQuery({
    queryKey: ["nerve-center-step-execs", mySessions.map(s => s.id)],
    enabled: mySessions.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("step_executions")
        .select("execution_id, status")
        .in("execution_id", mySessions.map(s => s.id));
      if (error) throw error;
      return data;
    },
  });

  // Fetch profiles for delegation display
  const delegatedTaskUserIds = useMemo(() => {
    const ids = new Set<string>();
    myTasks.forEach(t => {
      if (t.created_by === user?.id && t.assigned_to && t.assigned_to !== user?.id) {
        ids.add(t.assigned_to);
      }
    });
    return Array.from(ids);
  }, [myTasks, user?.id]);

  const { data: profiles = [] } = useQuery({
    queryKey: ["nerve-center-profiles", delegatedTaskUserIds],
    enabled: delegatedTaskUserIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", delegatedTaskUserIds);
      if (error) throw error;
      return data;
    },
  });

  const profileMap = useMemo(() => {
    const map: Record<string, string> = {};
    profiles.forEach(p => { map[p.user_id] = p.display_name ?? "Unknown"; });
    return map;
  }, [profiles]);

  const workbookMap = useMemo(() => {
    const map: Record<string, string> = {};
    workbooks.forEach(wb => { map[wb.id] = wb.title; });
    return map;
  }, [workbooks]);

  // Build step count maps
  const totalStepsByProtocol = useMemo(() => {
    const map: Record<string, number> = {};
    stepCounts.forEach(s => {
      map[s.protocol_id] = (map[s.protocol_id] ?? 0) + 1;
    });
    return map;
  }, [stepCounts]);

  const completedStepsByExecution = useMemo(() => {
    const map: Record<string, number> = {};
    stepExecs.forEach(se => {
      if (se.status === "completed") {
        map[se.execution_id] = (map[se.execution_id] ?? 0) + 1;
      }
    });
    return map;
  }, [stepExecs]);

  // Build scored feed items
  const feedItems = useMemo((): ScoredFeedItem[] => {
    const items: ScoredFeedItem[] = [];

    // Tasks assigned TO me (not delegated)
    myTasks
      .filter(t => t.assigned_to === user?.id && t.status !== "done" && t.status !== "cancelled")
      .forEach(t => {
        const item: ScoredFeedItem = {
          id: t.id,
          type: "task",
          title: t.title,
          workbookId: t.workbook_id,
          workbookTitle: workbookMap[t.workbook_id] ?? "Workbook",
          status: t.status,
          priority: t.priority,
          updatedAt: t.updated_at,
          dueDate: t.due_date,
          assignedTo: t.assigned_to,
          createdBy: t.created_by,
          parentTaskId: t.parent_task_id,
          score: 0,
        };
        item.score = computePriorityScore(item);
        items.push(item);
      });

    // Sessions
    mySessions.forEach(s => {
      const protocolTitle = (s as any).workbook_protocols?.title ?? "Session";
      const item: ScoredFeedItem = {
        id: s.id,
        type: "session",
        title: protocolTitle,
        workbookId: s.workbook_id,
        workbookTitle: workbookMap[s.workbook_id] ?? "Workbook",
        status: s.status,
        updatedAt: s.updated_at,
        driftScore: Number(s.drift_score ?? 0),
        totalSteps: totalStepsByProtocol[s.protocol_id] ?? 0,
        completedSteps: completedStepsByExecution[s.id] ?? 0,
        sessionSummary: (s as any).session_summary ?? null,
        executionId: s.id,
        protocolTitle,
        score: 0,
      };
      item.score = computePriorityScore(item);
      items.push(item);
    });

    return items;
  }, [myTasks, mySessions, user?.id, workbookMap, totalStepsByProtocol, completedStepsByExecution]);

  // Delegation items (tasks created by me, assigned to someone else)
  const delegationItems = useMemo((): ScoredFeedItem[] => {
    return myTasks
      .filter(t => t.created_by === user?.id && t.assigned_to && t.assigned_to !== user?.id && t.status !== "cancelled")
      .map(t => {
        const item: ScoredFeedItem = {
          id: t.id,
          type: "delegation",
          title: t.title,
          workbookId: t.workbook_id,
          workbookTitle: workbookMap[t.workbook_id] ?? "Workbook",
          status: t.status,
          priority: t.priority,
          updatedAt: t.updated_at,
          dueDate: t.due_date,
          assigneeName: profileMap[t.assigned_to!] ?? "Someone",
          score: 0,
        };
        item.score = computePriorityScore(item);
        return item;
      });
  }, [myTasks, user?.id, workbookMap, profileMap]);

  // Search filter
  const filterBySearch = (items: ScoredFeedItem[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.workbookTitle.toLowerCase().includes(q) ||
      (item.assigneeName?.toLowerCase().includes(q)) ||
      (item.sessionSummary?.toLowerCase().includes(q)) ||
      (item.protocolTitle?.toLowerCase().includes(q)) ||
      item.type.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  };

  const filteredFeed = filterBySearch(sortByScore(feedItems));
  const filteredDelegations = filterBySearch(delegationItems);
  const groupedFeed = groupByWorkbook(filteredFeed);
  const heroItem = filteredFeed[0] ?? null;

  // Stats
  const myActiveTasks = feedItems.filter(i => i.type === "task").length;
  const myActiveSessions = feedItems.filter(i => i.type === "session").length;
  const blockedCount = feedItems.filter(i => i.status === "blocked").length;
  const delegationNeedingAttention = delegationItems.filter(i => i.status === "blocked" || i.status === "done").length;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Active Tasks" value={myActiveTasks} icon={<ListTodo className="h-4 w-4 text-info" />} />
        <MiniStat label="Live Sessions" value={myActiveSessions} icon={<Target className="h-4 w-4 text-primary" />} />
        <MiniStat label="Blocked" value={blockedCount} icon={<Filter className="h-4 w-4 text-destructive" />} />
        <MiniStat label="Delegations" value={delegationNeedingAttention} icon={<Users className="h-4 w-4 text-warning" />} />
      </div>

      {/* Hero: Where You Left Off */}
      {heroItem && <WhereYouLeftOff item={heroItem} />}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks, sessions, people, workbooks…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="feed">
              <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />Priority Feed
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Target className="mr-1.5 h-3.5 w-3.5" />Sessions
            </TabsTrigger>
            <TabsTrigger value="delegations">
              <Users className="mr-1.5 h-3.5 w-3.5" />Delegations
              {delegationNeedingAttention > 0 && (
                <Badge className="ml-1.5 text-[9px] bg-warning/20 text-warning">{delegationNeedingAttention}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          {activeTab === "feed" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setGrouping(g => g === "priority" ? "workbook" : "priority")}
            >
              <LayoutGrid className="mr-1 h-3 w-3" />
              {grouping === "priority" ? "Group by Workbook" : "Sort by Priority"}
            </Button>
          )}
        </div>

        {/* Priority Feed */}
        <TabsContent value="feed" className="mt-4">
          {filteredFeed.length === 0 ? (
            <div className="rounded-lg border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No results match your search." : "No active tasks or sessions. Start a workbook session to begin!"}
            </div>
          ) : grouping === "priority" ? (
            <div className="space-y-2">
              {filteredFeed.map(item => (
                <FeedItem key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedFeed).map(([wbId, items]) => (
                <div key={wbId}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {items[0]?.workbookTitle ?? "Workbook"}
                  </h4>
                  <div className="space-y-2">
                    {items.map(item => (
                      <FeedItem key={`${item.type}-${item.id}`} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Sessions */}
        <TabsContent value="sessions" className="mt-4">
          {filteredFeed.filter(i => i.type === "session").length === 0 ? (
            <div className="rounded-lg border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No sessions match your search." : "No active sessions. Start a playbook session from a workbook."}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredFeed.filter(i => i.type === "session").sort((a, b) => b.score - a.score).map(item => (
                <SessionResumeCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Delegations */}
        <TabsContent value="delegations" className="mt-4">
          <DelegationTracker items={filteredDelegations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

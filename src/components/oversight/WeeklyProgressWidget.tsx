import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, CheckCircle, Clock, Minus } from "lucide-react";
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";

export function WeeklyProgressWidget() {
  const { user } = useAuth();

  const { data: recentTasks = [] } = useQuery({
    queryKey: ["weekly-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const twoWeeksAgo = subWeeks(new Date(), 2).toISOString();
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, status, completed_at, updated_at")
        .or(`assigned_to.eq.${user!.id},created_by.eq.${user!.id}`)
        .gte("updated_at", twoWeeksAgo);
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const thisWeek = recentTasks.filter(t =>
      t.completed_at && isWithinInterval(new Date(t.completed_at), { start: thisWeekStart, end: thisWeekEnd })
    ).length;

    const lastWeek = recentTasks.filter(t =>
      t.completed_at && isWithinInterval(new Date(t.completed_at), { start: lastWeekStart, end: lastWeekEnd })
    ).length;

    const trend = thisWeek - lastWeek;
    return { thisWeek, lastWeek, trend };
  }, [recentTasks]);

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">My Week</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-semibold">{stats.thisWeek}</p>
          <p className="text-[10px] text-muted-foreground">Completed this week</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-muted-foreground">{stats.lastWeek}</p>
          <p className="text-[10px] text-muted-foreground">Last week</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            {stats.trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : stats.trend < 0 ? (
              <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={`text-2xl font-semibold ${stats.trend > 0 ? "text-success" : stats.trend < 0 ? "text-destructive" : "text-muted-foreground"}`}>
              {stats.trend > 0 ? `+${stats.trend}` : stats.trend}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Trend</p>
        </div>
      </div>
    </div>
  );
}

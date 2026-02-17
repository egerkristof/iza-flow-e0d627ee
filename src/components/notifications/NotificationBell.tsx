import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Bell, Check, CheckCheck, ListTodo, Users, Zap, Shield, Clock, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  source_type: string;
  source_id: string;
  workbook_id: string | null;
  actor_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  task_assigned: <ListTodo className="h-4 w-4 text-info" />,
  task_status_change: <Zap className="h-4 w-4 text-warning" />,
  mention: <Users className="h-4 w-4 text-primary" />,
  session_event: <Clock className="h-4 w-4 text-accent-foreground" />,
  mandate_published: <Shield className="h-4 w-4 text-destructive" />,
};

export function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Notification[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user!.id)
        .eq("is_read", false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => markAllRead.mutate()}
              >
                <CheckCheck className="mr-1 h-3 w-3" /> Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>
        <NotificationList
          notifications={notifications}
          onMarkRead={(id) => markRead.mutate(id)}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

function NotificationList({
  notifications,
  onMarkRead,
  onClose,
}: {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? notifications
    : notifications.filter(n => {
        if (filter === "tasks") return n.type === "task_assigned" || n.type === "task_status_change";
        if (filter === "mentions") return n.type === "mention";
        if (filter === "sessions") return n.type === "session_event";
        return true;
      });

  // Group by time period
  const now = new Date();
  const today = filtered.filter(n => {
    const d = new Date(n.created_at);
    return d.toDateString() === now.toDateString();
  });
  const yesterday = filtered.filter(n => {
    const d = new Date(n.created_at);
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return d.toDateString() === y.toDateString();
  });
  const earlier = filtered.filter(n => {
    const d = new Date(n.created_at);
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return d < new Date(y.toDateString());
  });

  const sections = [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "Earlier", items: earlier },
  ].filter(s => s.items.length > 0);

  const handleClick = (n: Notification) => {
    if (!n.is_read) onMarkRead(n.id);
    if (n.workbook_id) {
      navigate(`/workbooks/${n.workbook_id}`);
      onClose();
    }
  };

  return (
    <div>
      <div className="px-4 pb-2">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-7">
            <TabsTrigger value="all" className="text-[10px] px-2 h-6">All</TabsTrigger>
            <TabsTrigger value="tasks" className="text-[10px] px-2 h-6">Tasks</TabsTrigger>
            <TabsTrigger value="mentions" className="text-[10px] px-2 h-6">Mentions</TabsTrigger>
            <TabsTrigger value="sessions" className="text-[10px] px-2 h-6">Sessions</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="h-[calc(100vh-120px)]">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="px-2 pb-4">
            {sections.map(section => (
              <div key={section.label}>
                <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
                {section.items.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-colors ${
                      n.is_read ? "opacity-60 hover:opacity-80" : "hover:bg-secondary/50"
                    }`}
                    onClick={() => handleClick(n)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {typeIcons[n.type] ?? <Bell className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.is_read ? "" : "font-medium"}`}>{n.title}</p>
                      {n.body && <p className="text-[11px] text-muted-foreground mt-0.5">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

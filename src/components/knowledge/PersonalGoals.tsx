import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target, TrendingUp, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PersonalGoals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", goal_type: "goal", target_value: "", current_value: "", unit: "" });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["personal-goals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("personal_goals").insert({
        user_id: user!.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        goal_type: form.goal_type,
        target_value: form.target_value.trim() || null,
        current_value: form.current_value.trim() || null,
        unit: form.unit.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personal-goals"] });
      setForm({ title: "", description: "", goal_type: "goal", target_value: "", current_value: "", unit: "" });
      setOpen(false);
      toast({ title: "Goal created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("personal_goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personal-goals"] });
      toast({ title: "Goal removed" });
    },
  });

  const progress = (goal: any) => {
    const t = parseFloat(goal.target_value);
    const c = parseFloat(goal.current_value);
    if (isNaN(t) || isNaN(c) || t === 0) return null;
    return Math.min(100, Math.round((c / t) * 100));
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">Goals & KPIs</CardTitle>
          <CardDescription>Define what you're working toward. These shape how context is prioritized for you.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Goal / KPI</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description (optional)" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.goal_type} onValueChange={(v) => setForm({ ...form, goal_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="goal">Goal</SelectItem>
                  <SelectItem value="kpi">KPI</SelectItem>
                  <SelectItem value="okr">OKR</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Target" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} />
                <Input placeholder="Current" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: e.target.value })} />
                <Input placeholder="Unit (e.g. %)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending}>
                  {createMutation.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-6">Loading…</p>
        ) : goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No goals yet. Add your first goal or KPI above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((g) => {
              const p = progress(g);
              return (
                <div key={g.id} className="rounded-md border border-border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{g.title}</span>
                        <Badge variant="outline" className="text-xs">{g.goal_type.toUpperCase()}</Badge>
                        <Badge variant={g.status === "active" ? "default" : "secondary"} className="text-xs">{g.status}</Badge>
                      </div>
                      {g.description && <p className="text-xs text-muted-foreground mt-1">{g.description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(g.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {p !== null && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{g.current_value} / {g.target_value} {g.unit}</span>
                        <span>{p}%</span>
                      </div>
                      <Progress value={p} className="h-1.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

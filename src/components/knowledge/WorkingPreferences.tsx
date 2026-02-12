import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PRESET_KEYS = [
  { key: "communication_style", label: "Communication Style", hint: "e.g. concise, detailed, bullet-points" },
  { key: "response_depth", label: "Response Depth", hint: "e.g. executive summary, deep-dive, actionable steps" },
  { key: "focus_areas", label: "Focus Areas", hint: "e.g. cost optimization, compliance, innovation" },
  { key: "excluded_topics", label: "Topics to Skip", hint: "e.g. historical context, competitor analysis" },
  { key: "preferred_frameworks", label: "Preferred Frameworks", hint: "e.g. MECE, Jobs-to-be-Done, OKR" },
  { key: "tone", label: "Tone", hint: "e.g. formal, casual, coaching" },
  { key: "custom", label: "Custom Preference", hint: "Define your own key" },
];

export function WorkingPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ preset: "communication_style", custom_key: "", value: "", description: "", scope_type: "global" });

  const { data: prefs = [], isLoading } = useQuery({
    queryKey: ["working-preferences", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("working_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const key = form.preset === "custom" ? form.custom_key.trim() : form.preset;
      if (!key) throw new Error("Key is required");
      const { error } = await supabase.from("working_preferences").insert({
        user_id: user!.id,
        preference_key: key,
        preference_value: form.value.trim(),
        description: form.description.trim() || null,
        scope_type: form.scope_type,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      setForm({ preset: "communication_style", custom_key: "", value: "", description: "", scope_type: "global" });
      setOpen(false);
      toast({ title: "Preference saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("working_preferences").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["working-preferences"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("working_preferences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      toast({ title: "Preference removed" });
    },
  });

  const keyLabel = (key: string) => PRESET_KEYS.find((p) => p.key === key)?.label ?? key;
  const selectedPreset = PRESET_KEYS.find((p) => p.key === form.preset);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">Working Style Preferences</CardTitle>
          <CardDescription>Customize how the system works with you — per topic, workbook, or globally.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Working Preference</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Select value={form.preset} onValueChange={(v) => setForm({ ...form, preset: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRESET_KEYS.map((p) => (
                    <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.preset === "custom" && (
                <Input placeholder="Preference key name" value={form.custom_key} onChange={(e) => setForm({ ...form, custom_key: e.target.value })} />
              )}
              <Textarea
                placeholder={selectedPreset?.hint ?? "Value"}
                rows={2}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
              <Input placeholder="Note (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.scope_type} onValueChange={(v) => setForm({ ...form, scope_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">🌍 Global — applies everywhere</SelectItem>
                  <SelectItem value="workbook">📗 Workbook-specific</SelectItem>
                  <SelectItem value="chat">💬 Chat-specific</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={() => createMutation.mutate()} disabled={!form.value.trim() || createMutation.isPending}>
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
        ) : prefs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No preferences yet. Set your first working style preference above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {prefs.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{keyLabel(p.preference_key)}</span>
                    <Badge variant="outline" className="text-xs">{p.scope_type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.preference_value}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={p.is_active}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: p.id, is_active: checked })}
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

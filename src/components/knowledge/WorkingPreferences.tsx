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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Settings2, Trash2, Zap, Hash, BookOpen, ChevronDown, ChevronRight, Filter, Tag, BookUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PreferenceTemplateGallery } from "./PreferenceTemplateGallery";
import { PromoteToContextDialog } from "./PromoteToContextDialog";

// ── Preference types ──
const PRESET_KEYS = [
  { key: "tone", label: "Tone & Voice", hint: "e.g. professional yet warm, authoritative, casual" },
  { key: "communication_style", label: "Communication Style", hint: "e.g. concise bullet-points, narrative, data-driven" },
  { key: "response_depth", label: "Response Depth", hint: "e.g. executive summary, deep-dive, actionable steps only" },
  { key: "focus_areas", label: "Focus Areas", hint: "e.g. ROI metrics, compliance, user experience" },
  { key: "excluded_topics", label: "Topics to Skip", hint: "e.g. competitor mentions, historical context" },
  { key: "preferred_frameworks", label: "Preferred Frameworks", hint: "e.g. MECE, Jobs-to-be-Done, OKR" },
  { key: "output_format", label: "Output Format", hint: "e.g. Markdown table, numbered list, narrative paragraph" },
  { key: "principles", label: "Principles", hint: "e.g. always lead with data, transparency first, user-centric" },
  { key: "prohibitions", label: "Prohibitions", hint: "e.g. never guarantee outcomes, avoid jargon, no speculation" },
  { key: "expertise", label: "Expertise", hint: "e.g. enterprise SaaS, regulatory compliance, M&A advisory" },
  { key: "past_experiences", label: "Past Experiences", hint: "e.g. led APAC expansion at Acme, managed $50M portfolio" },
  { key: "custom", label: "Custom Preference", hint: "Define your own" },
];

// ── Mock playbooks for binding ──
const AVAILABLE_PLAYBOOKS = [
  { id: "presales_intro_intel", title: "Draft Proposal" },
  { id: "client_research", title: "Client Research" },
  { id: "deal_review", title: "Deal Review" },
  { id: "pricing_analysis", title: "Pricing Analysis" },
  { id: "competitive_intel", title: "Competitive Intel" },
  { id: "onboarding_setup", title: "Onboarding Setup" },
];

// ── Example intents ──
const SUGGESTED_INTENTS = [
  "create social media post", "write proposal", "draft email", "prepare report",
  "analyze pricing", "build presentation", "summarize meeting", "create listing",
];

const EMPTY_FORM = {
  preset: "tone",
  custom_key: "",
  value: "",
  description: "",
  scope_type: "global",
  condition_label: "",
  trigger_intents: [] as string[],
  trigger_keywords: [] as string[],
  bound_playbook_ids: [] as string[],
  newIntent: "",
  newKeyword: "",
};

export function WorkingPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [promotePref, setPromotePref] = useState<{ title: string; content: string } | null>(null);

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
        condition_label: form.condition_label.trim() || null,
        trigger_intents: form.trigger_intents.length > 0 ? form.trigger_intents : [],
        trigger_keywords: form.trigger_keywords.length > 0 ? form.trigger_keywords : [],
        bound_playbook_ids: form.bound_playbook_ids.length > 0 ? form.bound_playbook_ids : [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      setForm({ ...EMPTY_FORM });
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
  const playbookName = (id: string) => AVAILABLE_PLAYBOOKS.find((p) => p.id === id)?.title ?? id;

  const addChip = (field: "trigger_intents" | "trigger_keywords", value: string) => {
    const v = value.trim().toLowerCase();
    if (!v || form[field].includes(v)) return;
    setForm({ ...form, [field]: [...form[field], v], ...(field === "trigger_intents" ? { newIntent: "" } : { newKeyword: "" }) });
  };

  const removeChip = (field: "trigger_intents" | "trigger_keywords", value: string) => {
    setForm({ ...form, [field]: form[field].filter((x) => x !== value) });
  };

  const togglePlaybook = (id: string) => {
    setForm({
      ...form,
      bound_playbook_ids: form.bound_playbook_ids.includes(id)
        ? form.bound_playbook_ids.filter((x) => x !== id)
        : [...form.bound_playbook_ids, id],
    });
  };

  const hasConditions = (p: any) => {
    return (p.trigger_intents?.length > 0) || (p.trigger_keywords?.length > 0) || (p.bound_playbook_ids?.length > 0) || p.condition_label;
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">Working Style Preferences</CardTitle>
          <CardDescription>
            Set contextual preferences that activate based on what you're doing — by intent, keywords, or playbook.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Rule</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Preference Rule</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">Define what to change and when it should activate.</p>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {/* ── WHAT: the preference ── */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Settings2 className="h-3 w-3" /> What to adjust
                </label>
                <Select value={form.preset} onValueChange={(v) => setForm({ ...form, preset: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRESET_KEYS.map((p) => (
                      <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.preset === "custom" && (
                  <Input placeholder="Custom preference name" value={form.custom_key} onChange={(e) => setForm({ ...form, custom_key: e.target.value })} />
                )}
                <Textarea
                  placeholder={selectedPreset?.hint ?? "Value"}
                  rows={2}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>

              {/* ── WHEN: condition label ── */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Filter className="h-3 w-3" /> When to activate
                </label>
                <Input
                  placeholder='e.g. "luxury listings", "cold outreach", "Q1 planning"'
                  value={form.condition_label}
                  onChange={(e) => setForm({ ...form, condition_label: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">Give this rule a name so you can identify when it kicks in.</p>
              </div>

              {/* ── TRIGGERS: intents ── */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Zap className="h-3 w-3" /> Trigger Intents
                </label>
                <p className="text-[11px] text-muted-foreground">Actions or intents that activate this preference.</p>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {form.trigger_intents.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs gap-1 pr-1">
                      <Zap className="h-2.5 w-2.5" />{t}
                      <button onClick={() => removeChip("trigger_intents", t)} className="ml-0.5 hover:text-destructive">×</button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type intent or pick below…"
                    value={form.newIntent}
                    onChange={(e) => setForm({ ...form, newIntent: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip("trigger_intents", form.newIntent); }}}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => addChip("trigger_intents", form.newIntent)} disabled={!form.newIntent.trim()}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_INTENTS.filter((s) => !form.trigger_intents.includes(s)).slice(0, 5).map((s) => (
                    <button key={s} onClick={() => addChip("trigger_intents", s)} className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── TRIGGERS: keywords ── */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Hash className="h-3 w-3" /> Trigger Keywords
                </label>
                <p className="text-[11px] text-muted-foreground">Keywords in the conversation that activate this rule.</p>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {form.trigger_keywords.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs gap-1 pr-1">
                      <Hash className="h-2.5 w-2.5" />{t}
                      <button onClick={() => removeChip("trigger_keywords", t)} className="ml-0.5 hover:text-destructive">×</button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder='e.g. "luxury", "budget", "enterprise"'
                    value={form.newKeyword}
                    onChange={(e) => setForm({ ...form, newKeyword: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip("trigger_keywords", form.newKeyword); }}}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => addChip("trigger_keywords", form.newKeyword)} disabled={!form.newKeyword.trim()}>Add</Button>
                </div>
              </div>

              {/* ── BOUND PLAYBOOKS ── */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3" /> Bound Playbooks
                </label>
                <p className="text-[11px] text-muted-foreground">Only activate during these playbooks. Leave empty for all.</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVAILABLE_PLAYBOOKS.map((pb) => {
                    const selected = form.bound_playbook_ids.includes(pb.id);
                    return (
                      <button
                        key={pb.id}
                        onClick={() => togglePlaybook(pb.id)}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-left transition-colors ${
                          selected ? "border-primary/30 bg-primary/10 text-primary" : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border"
                        }`}
                      >
                        <BookOpen className={`h-3 w-3 shrink-0 ${selected ? "text-primary" : ""}`} />
                        {pb.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── SCOPE ── */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="h-3 w-3" /> Scope
                </label>
                <Select value={form.scope_type} onValueChange={(v) => setForm({ ...form, scope_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">🌍 Global — applies everywhere</SelectItem>
                    <SelectItem value="workbook">📗 Workbook-specific</SelectItem>
                    <SelectItem value="chat">💬 Chat-specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ── Note ── */}
              <Input
                placeholder="Internal note (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={() => createMutation.mutate()} disabled={!form.value.trim() || createMutation.isPending}>
                  {createMutation.isPending ? "Saving…" : "Save Rule"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Template Gallery */}
        <PreferenceTemplateGallery />

        {/* Divider */}
        <div className="border-t border-border/50" />

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-6">Loading…</p>
        ) : prefs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No preferences yet.</p>
            <p className="text-xs mt-1">Add your first rule — e.g. "Use formal tone when creating proposals for enterprise clients"</p>
          </div>
        ) : (
          <div className="space-y-2">
            {prefs.map((p) => {
              const expanded = expandedId === p.id;
              const hasCond = hasConditions(p);
              return (
                <div key={p.id} className="rounded-md border border-border bg-muted/20 overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <button
                      className="flex items-center gap-2 min-w-0 flex-1 text-left"
                      onClick={() => setExpandedId(expanded ? null : p.id)}
                    >
                      {hasCond ? (
                        expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <Settings2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{keyLabel(p.preference_key)}</span>
                          {p.condition_label && (
                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{p.condition_label}</Badge>
                          )}
                          <Badge variant="outline" className="text-[10px]">{p.scope_type}</Badge>
                          {hasCond && <Badge variant="secondary" className="text-[10px] gap-0.5"><Zap className="h-2 w-2" />conditional</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.preference_value}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-primary hover:text-primary"
                        title="Promote to Context Item"
                        onClick={() => setPromotePref({
                          title: `${keyLabel(p.preference_key)}${p.condition_label ? ` — ${p.condition_label}` : ""}`,
                          content: p.preference_value,
                        })}
                      >
                        <BookUp className="h-3.5 w-3.5" />
                      </Button>
                      <Switch
                        checked={p.is_active}
                        onCheckedChange={(checked) => toggleMutation.mutate({ id: p.id, is_active: checked })}
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {expanded && hasCond && (
                    <div className="border-t border-border/50 bg-muted/10 px-4 py-3 space-y-2">
                      {p.trigger_intents && p.trigger_intents.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Zap className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[11px] font-medium text-muted-foreground">Intents: </span>
                            <span className="text-[11px]">{p.trigger_intents.join(", ")}</span>
                          </div>
                        </div>
                      )}
                      {p.trigger_keywords && p.trigger_keywords.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Hash className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[11px] font-medium text-muted-foreground">Keywords: </span>
                            <span className="text-[11px]">{p.trigger_keywords.join(", ")}</span>
                          </div>
                        </div>
                      )}
                      {p.bound_playbook_ids && p.bound_playbook_ids.length > 0 && (
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[11px] font-medium text-muted-foreground">Playbooks: </span>
                            <span className="text-[11px]">{p.bound_playbook_ids.map(playbookName).join(", ")}</span>
                          </div>
                        </div>
                      )}
                      {p.description && (
                        <p className="text-[11px] text-muted-foreground italic">Note: {p.description}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <PromoteToContextDialog
          open={!!promotePref}
          onOpenChange={(v) => { if (!v) setPromotePref(null); }}
          defaultTitle={promotePref?.title ?? ""}
          defaultContent={promotePref?.content ?? ""}
          sourceLabel="Preference"
        />
      </CardContent>
    </Card>
  );
}

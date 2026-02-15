import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Microscope, Plus, Pencil, Trash2, Copy, GripVertical,
  Sparkles, Clock, Tag, ChevronDown, ChevronRight, Globe, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResearchStep {
  title: string;
  instruction: string;
  output_format?: string;
  tool_hints?: string[];
}

interface ResearchTemplate {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  research_type: string;
  agent_model: string;
  agent_system_prompt: string | null;
  steps: ResearchStep[];
  tags: string[];
  estimated_minutes: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

const RESEARCH_TYPES = [
  { value: "competitor_analysis", label: "Competitor Analysis", icon: "🏢" },
  { value: "market_research", label: "Market Research", icon: "📊" },
  { value: "trend_analysis", label: "Trend Analysis", icon: "📈" },
  { value: "technical_research", label: "Technical Research", icon: "🔬" },
  { value: "customer_research", label: "Customer Research", icon: "👥" },
  { value: "general", label: "General Research", icon: "🔍" },
];

const MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (fast)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro (best)" },
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5", label: "GPT-5 (powerful)" },
];

const EMPTY_STEP: ResearchStep = { title: "", instruction: "", output_format: "", tool_hints: [] };

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ResearchTemplatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<ResearchTemplate | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState("general");
  const [formModel, setFormModel] = useState("google/gemini-2.5-flash");
  const [formPrompt, setFormPrompt] = useState("");
  const [formSteps, setFormSteps] = useState<ResearchStep[]>([{ ...EMPTY_STEP }]);
  const [formTags, setFormTags] = useState("");
  const [formMinutes, setFormMinutes] = useState("");
  const [formPublic, setFormPublic] = useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["research-templates", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_templates")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as ResearchTemplate[]).map(t => ({
        ...t,
        steps: Array.isArray(t.steps) ? t.steps : [],
        tags: Array.isArray(t.tags) ? t.tags : [],
      }));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        owner_id: user!.id,
        title: formTitle,
        description: formDesc || null,
        research_type: formType,
        agent_model: formModel,
        agent_system_prompt: formPrompt || null,
        steps: formSteps.filter(s => s.title.trim() || s.instruction.trim()),
        tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
        estimated_minutes: formMinutes ? parseInt(formMinutes) : null,
        is_public: formPublic,
      };

      if (editTemplate) {
        const { error } = await supabase
          .from("research_templates")
          .update(payload as any)
          .eq("id", editTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("research_templates")
          .insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-templates"] });
      toast({ title: editTemplate ? "Template updated" : "Template created" });
      setEditOpen(false);
    },
    onError: (e: any) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("research_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-templates"] });
      toast({ title: "Template deleted" });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (t: ResearchTemplate) => {
      const { error } = await supabase.from("research_templates").insert({
        owner_id: user!.id,
        title: `${t.title} (copy)`,
        description: t.description,
        research_type: t.research_type,
        agent_model: t.agent_model,
        agent_system_prompt: t.agent_system_prompt,
        steps: t.steps as any,
        tags: t.tags,
        estimated_minutes: t.estimated_minutes,
        is_public: false,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-templates"] });
      toast({ title: "Template duplicated" });
    },
  });

  const openNew = () => {
    setEditTemplate(null);
    setFormTitle("");
    setFormDesc("");
    setFormType("general");
    setFormModel("google/gemini-2.5-flash");
    setFormPrompt("");
    setFormSteps([{ ...EMPTY_STEP }]);
    setFormTags("");
    setFormMinutes("");
    setFormPublic(false);
    setEditOpen(true);
  };

  const openEdit = (t: ResearchTemplate) => {
    setEditTemplate(t);
    setFormTitle(t.title);
    setFormDesc(t.description || "");
    setFormType(t.research_type);
    setFormModel(t.agent_model);
    setFormPrompt(t.agent_system_prompt || "");
    setFormSteps(t.steps.length > 0 ? t.steps : [{ ...EMPTY_STEP }]);
    setFormTags(t.tags.join(", "));
    setFormMinutes(t.estimated_minutes?.toString() || "");
    setFormPublic(t.is_public);
    setEditOpen(true);
  };

  const updateStep = (idx: number, field: keyof ResearchStep, value: string) => {
    setFormSteps(prev => prev.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    ));
  };

  const addStep = () => setFormSteps(prev => [...prev, { ...EMPTY_STEP }]);
  const removeStep = (idx: number) => setFormSteps(prev => prev.filter((_, i) => i !== idx));

  const typeInfo = (type: string) => RESEARCH_TYPES.find(t => t.value === type) || RESEARCH_TYPES[5];

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading research templates…</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Microscope className="h-5 w-5 text-primary" />
              Research Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Define reusable multi-step research agent configurations for protocol steps.
            </p>
          </div>
          <Button onClick={openNew} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Template
          </Button>
        </div>

        {/* Template List */}
        {templates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Microscope className="h-10 w-10 text-primary/20 mb-3" />
              <p className="text-sm font-medium">No research templates yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create templates for competitor analysis, market research, and more.
              </p>
              <Button onClick={openNew} variant="outline" className="mt-4 gap-1.5" size="sm">
                <Plus className="h-3.5 w-3.5" /> Create First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {templates.map(t => {
              const info = typeInfo(t.research_type);
              const isExpanded = expandedId === t.id;
              return (
                <Card key={t.id} className="transition-colors hover:border-primary/20">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : t.id)}
                        className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">{info.icon}</span>
                          <CardTitle className="text-sm">{t.title}</CardTitle>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {info.label}
                          </Badge>
                          {t.is_public && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                              <Globe className="h-2.5 w-2.5" /> Public
                            </Badge>
                          )}
                          {t.steps.length > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              {t.steps.length} step{t.steps.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {t.estimated_minutes && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" /> ~{t.estimated_minutes}m
                            </span>
                          )}
                        </div>
                        {t.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{t.description}</p>
                        )}
                        {t.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {t.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateMutation.mutate(t)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="px-4 pb-4 pt-0 ml-7">
                      <div className="space-y-3">
                        <div className="text-[10px] text-muted-foreground">
                          Model: <span className="text-foreground">{MODELS.find(m => m.value === t.agent_model)?.label || t.agent_model}</span>
                        </div>
                        {t.agent_system_prompt && (
                          <div>
                            <p className="text-[10px] font-medium text-muted-foreground mb-1">System Prompt</p>
                            <div className="bg-muted/50 rounded-md p-2 text-xs whitespace-pre-wrap max-h-24 overflow-auto">
                              {t.agent_system_prompt}
                            </div>
                          </div>
                        )}
                        {t.steps.length > 0 && (
                          <div>
                            <p className="text-[10px] font-medium text-muted-foreground mb-1">Steps</p>
                            <div className="space-y-1.5">
                              {t.steps.map((step, i) => (
                                <div key={i} className="flex gap-2 items-start bg-muted/30 rounded-md p-2">
                                  <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium">{step.title || "Untitled step"}</p>
                                    <p className="text-[10px] text-muted-foreground line-clamp-2">{step.instruction}</p>
                                    {step.output_format && (
                                      <p className="text-[9px] text-muted-foreground mt-0.5">
                                        Output: {step.output_format}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Microscope className="h-4 w-4 text-primary" />
              {editTemplate ? "Edit Template" : "New Research Template"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4" style={{ maxHeight: "60vh" }}>
            <div className="space-y-4 py-2">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Title</Label>
                  <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Competitor SWOT Analysis" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What does this research template do?" rows={2} />
                </div>
                <div>
                  <Label className="text-xs">Research Type</Label>
                  <Select value={formType} onValueChange={setFormType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RESEARCH_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">AI Model</Label>
                  <Select value={formModel} onValueChange={setFormModel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MODELS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* System prompt */}
              <div>
                <Label className="text-xs">Agent System Prompt (optional)</Label>
                <Textarea
                  value={formPrompt}
                  onChange={e => setFormPrompt(e.target.value)}
                  placeholder="Custom instructions for the research agent persona…"
                  rows={3}
                />
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-medium">Research Steps</Label>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={addStep}>
                    <Plus className="h-3 w-3" /> Add Step
                  </Button>
                </div>
                <div className="space-y-3">
                  {formSteps.map((step, idx) => (
                    <div key={idx} className="relative border border-border/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <span className="text-[10px] font-mono text-muted-foreground">Step {idx + 1}</span>
                        {formSteps.length > 1 && (
                          <Button
                            variant="ghost" size="icon" className="h-5 w-5 ml-auto text-destructive"
                            onClick={() => removeStep(idx)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Step title"
                        value={step.title}
                        onChange={e => updateStep(idx, "title", e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Textarea
                        placeholder="Detailed instruction for this research step…"
                        value={step.instruction}
                        onChange={e => updateStep(idx, "instruction", e.target.value)}
                        rows={2}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Expected output format (e.g., 'SWOT table', 'bullet list')"
                        value={step.output_format || ""}
                        onChange={e => updateStep(idx, "output_format", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Tags (comma-separated)</Label>
                  <Input value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="saas, b2b, enterprise" className="h-8 text-xs" />
                </div>
                <div>
                  <Label className="text-xs">Est. Minutes</Label>
                  <Input type="number" value={formMinutes} onChange={e => setFormMinutes(e.target.value)} placeholder="5" className="h-8 text-xs" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={formPublic} onCheckedChange={setFormPublic} id="is-public" />
                <Label htmlFor="is-public" className="text-xs flex items-center gap-1.5">
                  {formPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {formPublic ? "Public — visible to all users" : "Private — only you can see this"}
                </Label>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!formTitle.trim() || saveMutation.isPending}
              className="gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {editTemplate ? "Update" : "Create"} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

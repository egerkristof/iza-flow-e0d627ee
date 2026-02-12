import { useState } from "react";
import { Bot, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface AgentConfig {
  id: string;
  modelId: string;
  label: string;
  provider: string;
  isEnabled: boolean;
  maxTokens: number;
  temperature: number;
  notes: string;
}

const AVAILABLE_MODELS = [
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google" },
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", provider: "Google" },
  { id: "openai/gpt-5", label: "GPT-5", provider: "OpenAI" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", provider: "OpenAI" },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", provider: "OpenAI" },
];

const MOCK_CONFIGS: AgentConfig[] = [
  { id: "a1", modelId: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", isEnabled: true, maxTokens: 4096, temperature: 0.7, notes: "Default for quick tasks" },
  { id: "a2", modelId: "openai/gpt-5", label: "GPT-5", provider: "OpenAI", isEnabled: true, maxTokens: 8192, temperature: 0.5, notes: "Complex reasoning tasks" },
  { id: "a3", modelId: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", isEnabled: false, maxTokens: 4096, temperature: 0.7, notes: "" },
];

export function WorkbookAgentConfig({ workbookId }: { workbookId: string }) {
  const [configs, setConfigs] = useState(MOCK_CONFIGS);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");

  const toggleModel = (id: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, isEnabled: !c.isEnabled } : c));
  };

  const removeModel = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id));
  };

  const addModel = () => {
    const model = AVAILABLE_MODELS.find(m => m.id === selectedModel);
    if (!model || configs.some(c => c.modelId === model.id)) return;
    setConfigs(prev => [...prev, { id: `a${Date.now()}`, modelId: model.id, label: model.label, provider: model.provider, isEnabled: true, maxTokens: 4096, temperature: 0.7, notes: "" }]);
    setAddOpen(false);
    setSelectedModel("");
  };

  const usedModels = new Set(configs.map(c => c.modelId));
  const availableToAdd = AVAILABLE_MODELS.filter(m => !usedModels.has(m.id));

  return (
    <div className="rounded-lg border border-border/50 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" /> Agents & LLMs
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Configure which AI models are available in this workbook.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{configs.filter(c => c.isEnabled).length} active</Badge>
          {availableToAdd.length > 0 && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setAddOpen(true)}>
              <Plus className="h-3 w-3" /> Add Model
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {configs.map(c => (
          <div key={c.id} className={`flex items-center justify-between rounded-md border px-4 py-3 transition-colors ${c.isEnabled ? "border-primary/20 bg-primary/5" : "border-border/50 bg-muted/20 opacity-60"}`}>
            <div className="flex items-center gap-3 min-w-0">
              <Bot className={`h-4 w-4 shrink-0 ${c.isEnabled ? "text-primary" : "text-muted-foreground"}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px]">{c.provider}</Badge>
                  <span className="text-[10px] text-muted-foreground">Max {c.maxTokens} tokens · Temp {c.temperature}</span>
                </div>
                {c.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{c.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch checked={c.isEnabled} onCheckedChange={() => toggleModel(c.id)} />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeModel(c.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add AI Model</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger><SelectValue placeholder="Select a model…" /></SelectTrigger>
                <SelectContent>
                  {availableToAdd.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.label} ({m.provider})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addModel} disabled={!selectedModel}>Add Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Compact agent list for the right sidebar */
export function AgentsSidebarPanel({ workbookId }: { workbookId: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-muted-foreground">Active Models</p>
      {MOCK_CONFIGS.filter(c => c.isEnabled).map(c => (
        <div key={c.id} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5 text-xs">
          <Bot className="h-3 w-3 text-primary" />
          <span className="flex-1 truncate">{c.label}</span>
          <Badge variant="outline" className="text-[9px]">{c.provider}</Badge>
        </div>
      ))}
    </div>
  );
}

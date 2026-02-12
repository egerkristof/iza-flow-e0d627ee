import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings2, BookUp, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedPreference {
  preference_key: string;
  preference_value: string;
  condition_label?: string;
}

interface ExtractedContextItem {
  title: string;
  content: string;
  category: "KNOWLEDGE" | "RESEARCH" | "DIRECTIVE";
}

interface ExtractionResult {
  preferences: ExtractedPreference[];
  context_items: ExtractedContextItem[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExtractionResult | null;
  documentName: string;
}

const KEY_LABELS: Record<string, string> = {
  tone: "Tone & Voice",
  communication_style: "Communication Style",
  response_depth: "Response Depth",
  focus_areas: "Focus Areas",
  excluded_topics: "Topics to Skip",
  preferred_frameworks: "Preferred Frameworks",
  output_format: "Output Format",
  principles: "Principles",
  prohibitions: "Prohibitions",
  expertise: "Expertise",
  past_experiences: "Past Experiences",
};

export function ExtractionReviewDialog({ open, onOpenChange, data, documentName }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedPrefs, setSelectedPrefs] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Select all by default when data changes
  const initSelections = () => {
    if (data) {
      setSelectedPrefs(new Set(data.preferences.map((_, i) => i)));
      setSelectedItems(new Set(data.context_items.map((_, i) => i)));
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (v && data) initSelections();
    onOpenChange(v);
  };

  const togglePref = (i: number) => {
    setSelectedPrefs(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleItem = (i: number) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !data) return;

      // Save selected preferences
      const prefsToSave = data.preferences.filter((_, i) => selectedPrefs.has(i));
      if (prefsToSave.length > 0) {
        const { error } = await supabase.from("working_preferences").insert(
          prefsToSave.map(p => ({
            user_id: user.id,
            preference_key: p.preference_key,
            preference_value: p.preference_value,
            condition_label: p.condition_label || null,
            description: `Extracted from ${documentName}`,
            scope_type: "global",
          }))
        );
        if (error) throw error;
      }

      // Save selected context items
      const itemsToSave = data.context_items.filter((_, i) => selectedItems.has(i));
      if (itemsToSave.length > 0) {
        const { error } = await supabase.from("context_items").insert(
          itemsToSave.map(ci => ({
            owner_id: user.id,
            title: ci.title,
            content_full: ci.content,
            category: ci.category as any,
            action_type: "APPEND" as any,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      const prefCount = selectedPrefs.size;
      const itemCount = selectedItems.size;
      toast({
        title: "Extraction saved",
        description: `${prefCount} preference${prefCount !== 1 ? "s" : ""} and ${itemCount} context item${itemCount !== 1 ? "s" : ""} added.`,
      });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!data) return null;

  const totalSelected = selectedPrefs.size + selectedItems.size;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Review Extracted Items — {documentName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            AI extracted {data.preferences.length} preferences and {data.context_items.length} context items. Select what to keep.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 -mx-6 px-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
          {/* Preferences section */}
          {data.preferences.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" /> Working Preferences ({data.preferences.length})
              </h3>
              {data.preferences.map((p, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedPrefs.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <Checkbox
                    checked={selectedPrefs.has(i)}
                    onCheckedChange={() => togglePref(i)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {KEY_LABELS[p.preference_key] ?? p.preference_key}
                      </Badge>
                      {p.condition_label && (
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                          {p.condition_label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs mt-1 text-foreground">{p.preference_value}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Context Items section */}
          {data.context_items.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookUp className="h-3 w-3" /> Context Items ({data.context_items.length})
              </h3>
              {data.context_items.map((ci, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedItems.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <Checkbox
                    checked={selectedItems.has(i)}
                    onCheckedChange={() => toggleItem(i)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{ci.title}</span>
                      <Badge variant="outline" className="text-[10px]">{ci.category}</Badge>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground line-clamp-3">{ci.content}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/50 pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={totalSelected === 0 || saveMutation.isPending}
            className="gap-1.5"
          >
            {saveMutation.isPending ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
            ) : (
              <>Save {totalSelected} item{totalSelected !== 1 ? "s" : ""}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { ExtractionResult };

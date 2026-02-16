import { useState, useCallback, useEffect, useMemo, type DragEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, BookUp, Loader2, Sparkles, Package, ChevronDown, ChevronRight, FolderPlus, Pencil, Check, Brain, Globe, Users, User, RefreshCw, MessageSquare, Send, GripVertical, Lightbulb, Shield, AlertTriangle, CheckCircle2, CircleDashed, Eye, EyeOff, GitMerge, ArrowRight, ScanSearch, Scissors, Undo2, ArrowRightLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  type ExtractionResult,
  type ExtractedPreference,
  type ExtractedContextItem,
  type ExtractedBundle,
  type ImportCopilotProps,
  type ContextCategory,
  type AdvisorPersona,
  type BundleReadiness,
  type BundleMatch,
  type DocumentStructureSkeleton,
  type SkeletonSection,
  type ConsolidationDecision,
  CONTEXT_CATEGORIES,
  CATEGORY_COLORS,
  PREFERENCE_KEY_LABELS,
  EXTRACTION_DEPTH_META,
  BUNDLE_READINESS_META,
  computeBundleReadiness,
} from "@/lib/knowledge-schema";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { cn } from "@/lib/utils";

// ─── Smart Suggestion Engine ─────────────────────────────────────────────────
interface SmartSuggestion {
  label: string;
  instruction: string;
  /** Which scope to use for the refine call */
  scope: "all" | "selected";
  /** If set, this is a local action (no AI call needed) */
  localAction?: "promote-to-mandate";
}

/** Protocol role icons for bundle items */
const PROTOCOL_ROLE_META: Record<string, { label: string; color: string; icon: string }> = {
  PLAYBOOK: { label: "Protocol Driver", color: "text-orange-400 bg-orange-500/10 border-orange-500/30", icon: "🎯" },
  PROCEDURE: { label: "Execution Step", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", icon: "▶" },
  DIRECTIVE: { label: "Compliance Gate", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: "⚡" },
  KNOWLEDGE: { label: "Context", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: "📘" },
  RESEARCH: { label: "Context", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: "🔬" },
  PRINCIPLE: { label: "Context", color: "text-purple-400 bg-purple-500/10 border-purple-500/30", icon: "🧭" },
  PREFERENCE: { label: "Personalization", color: "text-pink-400 bg-pink-500/10 border-pink-500/30", icon: "🎨" },
};

function generateSmartSuggestions(data: ExtractionResult | null): SmartSuggestion[] {
  if (!data) return [];
  const suggestions: SmartSuggestion[] = [];
  const allItems = [
    ...data.context_items,
    ...(data.bundles || []).flatMap(b => b.items),
  ];

  // 1. PLAYBOOKs that contain step-by-step content → split into PLAYBOOK (strategy) + PROCEDUREs (steps)
  const playbooks = allItems.filter(i => i.category === "PLAYBOOK");
  const stepPatterns = playbooks.filter(p => /\d[.)]\s|step\s*\d|first.*then|phase\s*\d/i.test(p.content));
  if (stepPatterns.length > 0) {
    suggestions.push({
      label: `Decompose ${stepPatterns.length} PLAYBOOK${stepPatterns.length > 1 ? "s" : ""} into protocol steps`,
      instruction: `These PLAYBOOKs contain step-by-step instructions and should be decomposed for protocol execution: ${stepPatterns.slice(0, 2).map(p => `"${p.title}"`).join(", ")}. For each: keep the PLAYBOOK as a strategic overview (the WHAT and WHY), then extract each discrete step as a separate PROCEDURE item (the HOW). Each PROCEDURE should be one atomic action. Also extract any rules/constraints as DIRECTIVE items (compliance gates).`,
      scope: "all",
    });
  } else if (playbooks.length > 0) {
    suggestions.push({
      label: `Add execution steps for ${playbooks.length} PLAYBOOK${playbooks.length > 1 ? "s" : ""}`,
      instruction: `The following PLAYBOOKs are protocol drivers but lack explicit PROCEDURE steps: ${playbooks.slice(0, 2).map(p => `"${p.title}"`).join(", ")}. Analyze each playbook's content and extract specific, ordered execution steps as individual PROCEDURE items. Each PROCEDURE should be one clear, atomic action. Also identify any rules/constraints and extract them as DIRECTIVE items (compliance gates).`,
      scope: "all",
    });
  }

  // 2. PROCEDUREs with multiple actions → should be atomic steps
  const multiActionProcs = allItems.filter(
    i => i.category === "PROCEDURE" && (
      (i.content.match(/\d[.)]\s/g) || []).length >= 3 ||
      i.content.length > 500
    )
  );
  if (multiActionProcs.length > 0) {
    suggestions.push({
      label: `Split ${multiActionProcs.length} multi-step PROCEDURE${multiActionProcs.length > 1 ? "s" : ""} into atomic steps`,
      instruction: `These PROCEDUREs contain multiple actions and should be split into individual atomic steps for protocol execution: ${multiActionProcs.slice(0, 2).map(p => `"${p.title}"`).join(", ")}. Each resulting PROCEDURE should be ONE clear action that an operator can complete and check off.`,
      scope: "all",
    });
  }

  // 3. Items with very short content (< 60 chars) — likely need more detail
  const thinItems = allItems.filter(i => i.content.length < 60);
  if (thinItems.length >= 2) {
    suggestions.push({
      label: `Expand ${thinItems.length} thin items with more detail`,
      instruction: `${thinItems.length} items have very brief content (under 60 characters). Expand each with specific details, numbers, conditions, and context to make them self-contained and actionable. Don't pad with filler — add real substance from the source.`,
      scope: "all",
    });
  }

  // 4. Potential category mismatches — KNOWLEDGE items that sound like DIRECTIVEs
  const possibleDirectives = allItems.filter(
    i => i.category === "KNOWLEDGE" && /\b(must|never|always|shall|required|prohibited|mandatory)\b/i.test(i.content)
  );
  if (possibleDirectives.length > 0) {
    suggestions.push({
      label: `Review ${possibleDirectives.length} KNOWLEDGE item${possibleDirectives.length > 1 ? "s" : ""} that may be compliance gates`,
      instruction: `These KNOWLEDGE items contain directive language (must, never, always, required): ${possibleDirectives.slice(0, 3).map(i => `"${i.title}"`).join(", ")}. Re-examine each: if it's a rule or constraint that must be enforced, recategorize to DIRECTIVE (it will become a compliance gate in protocol execution). If it's truly factual info, keep as KNOWLEDGE.`,
      scope: "all",
    });
  }

  // 5. Bundles without a PLAYBOOK driver
  const bundlesWithoutPlaybook = (data.bundles || []).filter(b => !b.items.some(i => i.category === "PLAYBOOK"));
  if (bundlesWithoutPlaybook.length > 0) {
    suggestions.push({
      label: `Add protocol drivers to ${bundlesWithoutPlaybook.length} domain${bundlesWithoutPlaybook.length > 1 ? "s" : ""}`,
      instruction: `These domains lack a PLAYBOOK item to drive protocol execution: ${bundlesWithoutPlaybook.slice(0, 2).map(b => `"${b.title}"`).join(", ")}. Create a PLAYBOOK item for each that describes the strategic intent, goals, and approach. This becomes the protocol template when the domain is deployed to a workbook.`,
      scope: "all",
    });
  }

  // 5b. Skeleton bundles that need content
  const skeletonBundles = (data.bundles || []).filter(b => b.content_completeness === "skeleton");
  if (skeletonBundles.length > 0) {
    suggestions.push({
      label: `Expand ${skeletonBundles.length} skeleton domain${skeletonBundles.length > 1 ? "s" : ""} with inferred content`,
      instruction: `These domains were detected from the document structure but lack content: ${skeletonBundles.slice(0, 3).map(b => `"${b.title}"`).join(", ")}. Based on the context of surrounding well-documented domains and the domain, infer and generate likely PROCEDUREs, DIRECTIVEs, and KNOWLEDGE items for each. Mark inferred items clearly in their content.`,
      scope: "all",
    });
  }

  // 6. Standalone items that could form a bundle (3+ items share words in title)
  if (data.context_items.length >= 3 && (data.bundles || []).length === 0) {
    suggestions.push({
      label: "Group related items into executable domains",
      instruction: `There are ${data.context_items.length} standalone items but no domains. Analyze them for thematic clusters. Create domains with proper protocol structure: a PLAYBOOK as the strategic driver, PROCEDUREs as ordered execution steps, DIRECTIVEs as compliance gates, and other items as context.`,
      scope: "all",
    });
  }

  // 7. DIRECTIVE items that could be promoted to mandates
  const directives = allItems.filter(i => i.category === "DIRECTIVE");
  if (directives.length > 0) {
    suggestions.push({
      label: `Promote ${directives.length} DIRECTIVE${directives.length > 1 ? "s" : ""} to compliance gate${directives.length > 1 ? "s" : ""}`,
      instruction: "",
      scope: "all",
      localAction: "promote-to-mandate",
    });
  }

  // 8. Duplicate-looking titles
  const titles = allItems.map(i => i.title.toLowerCase().replace(/[^a-z0-9]/g, " ").trim());
  const seen = new Map<string, number>();
  for (const t of titles) {
    const key = t.split(" ").slice(0, 3).join(" ");
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  const dupeCount = [...seen.values()].filter(c => c > 1).reduce((a, b) => a + b, 0);
  if (dupeCount >= 2) {
    suggestions.push({
      label: `Merge ~${dupeCount} similar/duplicate items`,
      instruction: "Several items have very similar titles and likely overlap. Merge duplicates into single, comprehensive items. Keep the richest content and discard redundancy.",
      scope: "all",
    });
  }

  // Fill up to minimum suggestions
  if (suggestions.length < 4) {
    suggestions.push({
      label: "Restructure for protocol execution",
      instruction: "Review all items and ensure they follow the protocol execution model: PLAYBOOKs define strategy (protocol drivers), PROCEDUREs are atomic execution steps, DIRECTIVEs are compliance gates, and other categories provide context. Restructure any items that don't fit this model.",
      scope: "all",
    });
  }
  if (suggestions.length < 5) {
    suggestions.push({
      label: "Recategorize — fix wrong categories",
      instruction: "Fix any miscategorized items according to the protocol model: strategic overviews should be PLAYBOOK, step-by-step actions should be PROCEDURE, rules/constraints should be DIRECTIVE, facts should be KNOWLEDGE.",
      scope: "all",
    });
  }

  return suggestions.slice(0, 5);
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  document: "Document",
  chat: "Chat",
  task: "Task",
  research: "Research",
  manual: "Manual",
  loom: "Knowledge Loom",
};

export function ImportCopilotDialog({ open, onOpenChange, data: initialData, sourceName, sourceType }: ImportCopilotProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  // Mutable extraction data — updated when AI refines items
  const normalizeData = (d: ExtractionResult | null): ExtractionResult | null =>
    d ? { ...d, preferences: d.preferences || [], context_items: d.context_items || [], bundles: d.bundles || [] } : null;
  const [data, setData] = useState<ExtractionResult | null>(() => normalizeData(initialData));
  // Sync when parent passes new data
  useEffect(() => { setData(normalizeData(initialData)); }, [initialData]);

  const [selectedPrefs, setSelectedPrefs] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedBundles, setSelectedBundles] = useState<Set<number>>(new Set());
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());
  const [itemBundleAssignment, setItemBundleAssignment] = useState<Record<number, string>>({});

  const [itemEdits, setItemEdits] = useState<Record<number, Partial<ExtractedContextItem>>>({});
  const [bundleItemEdits, setBundleItemEdits] = useState<Record<string, Partial<ExtractedContextItem>>>({});
  const [prefEdits, setPrefEdits] = useState<Record<number, Partial<ExtractedPreference>>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Mandate promotion tracking — keys are "standalone-{idx}" or "bundle-{bi}-{ji}"
  const [mandateFlags, setMandateFlags] = useState<Record<string, { is_mandate: boolean; enforcement_level: "advisory" | "required_ack" | "blocking" }>>({});
  const [hideSuggestions, setHideSuggestions] = useState(false);
  // Manual override: bundle index → existing bundle ID (or "new" to create fresh)
  const [bundleMergeOverrides, setBundleMergeOverrides] = useState<Record<number, string>>({});

  const resolveItem = (original: ExtractedContextItem, edits?: Partial<ExtractedContextItem>): ExtractedContextItem => ({
    ...original,
    ...edits,
  });

  // Drag-and-drop state
  const [dragSource, setDragSource] = useState<{ type: "standalone"; idx: number } | { type: "bundle"; bundleIdx: number; itemIdx: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleDragStart = useCallback((e: DragEvent, source: typeof dragSource) => {
    setDragSource(source);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(source));
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  }, []);

  const handleDragEnd = useCallback((e: DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDragSource(null);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(targetId);
    // Auto-expand bundles when hovering over them during drag
    const bundleMatch = targetId.match(/^bundle-(\d+)$/);
    if (bundleMatch) {
      const bi = Number(bundleMatch[1]);
      setExpandedBundles(prev => prev.has(bi) ? prev : new Set([...prev, bi]));
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent, targetId: string) => {
    // Only clear if we're actually leaving (not entering a child)
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDropTarget(prev => prev === targetId ? null : prev);
    }
  }, []);

  const handleDropOnBundle = useCallback((e: DragEvent, targetBundleIdx: number, targetItemIdx?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
    if (!data || !dragSource) return;

    const newData = { ...data, context_items: [...data.context_items], bundles: (data.bundles || []).map(b => ({ ...b, items: [...b.items] })) };

    let movedItem: ExtractedContextItem | null = null;
    let insertAt = targetItemIdx ?? newData.bundles[targetBundleIdx].items.length;

    if (dragSource.type === "standalone") {
      const idx = dragSource.idx;
      movedItem = resolveItem(data.context_items[idx], itemEdits[idx]);
      newData.context_items.splice(idx, 1);
      const newItemEdits: typeof itemEdits = {};
      const newSelectedItems = new Set<number>();
      const newAssignments: typeof itemBundleAssignment = {};
      for (const [k, v] of Object.entries(itemEdits)) {
        const ki = Number(k);
        if (ki < idx) { newItemEdits[ki] = v; }
        else if (ki > idx) { newItemEdits[ki - 1] = v; }
      }
      selectedItems.forEach(si => {
        if (si < idx) newSelectedItems.add(si);
        else if (si > idx) newSelectedItems.add(si - 1);
      });
      for (const [k, v] of Object.entries(itemBundleAssignment)) {
        const ki = Number(k);
        if (ki < idx) newAssignments[ki] = v;
        else if (ki > idx) newAssignments[ki - 1] = v;
      }
      setItemEdits(newItemEdits);
      setSelectedItems(newSelectedItems);
      setItemBundleAssignment(newAssignments);
    } else if (dragSource.type === "bundle") {
      const { bundleIdx, itemIdx } = dragSource;

      if (bundleIdx === targetBundleIdx) {
        // Same-bundle reorder
        if (targetItemIdx === undefined || targetItemIdx === itemIdx || targetItemIdx === itemIdx + 1) return;
        const items = newData.bundles[bundleIdx].items;
        const [removed] = items.splice(itemIdx, 1);
        const adjustedIdx = targetItemIdx > itemIdx ? targetItemIdx - 1 : targetItemIdx;
        items.splice(adjustedIdx, 0, removed);

        // Remap bundle item edits for this bundle
        const oldEdits = { ...bundleItemEdits };
        const newBundleEdits: typeof bundleItemEdits = {};
        // Copy non-affected bundle edits
        for (const [k, v] of Object.entries(oldEdits)) {
          const [bi] = k.split("-").map(Number);
          if (bi !== bundleIdx) newBundleEdits[k] = v;
        }
        // Remap indices for this bundle
        const reorderMap = new Map<number, number>();
        for (let idx = 0; idx < items.length; idx++) {
          // The item at idx was originally at some position — we track via the edit
          // Simpler: just clear edits for the reordered bundle since item objects moved
        }
        // Since we moved actual item objects (not just indices), edits keyed by old indices are stale.
        // Rebuild: the removed item's edit goes to adjustedIdx, others shift.
        for (const [k, v] of Object.entries(oldEdits)) {
          const [bi, ji] = k.split("-").map(Number);
          if (bi !== bundleIdx) continue;
          let newJi: number;
          if (ji === itemIdx) {
            newJi = adjustedIdx;
          } else if (itemIdx < targetItemIdx!) {
            // moved forward: items between (itemIdx, adjustedIdx] shift back by 1
            if (ji > itemIdx && ji <= adjustedIdx) newJi = ji - 1;
            else newJi = ji;
          } else {
            // moved backward: items between [adjustedIdx, itemIdx) shift forward by 1
            if (ji >= adjustedIdx && ji < itemIdx) newJi = ji + 1;
            else newJi = ji;
          }
          newBundleEdits[`${bi}-${newJi}`] = v;
        }
        setBundleItemEdits(newBundleEdits);
        setData(newData);
        setDragSource(null);
        return;
      }

      movedItem = resolveItem(data.bundles![bundleIdx].items[itemIdx], bundleItemEdits[`${bundleIdx}-${itemIdx}`]);
      newData.bundles[bundleIdx].items.splice(itemIdx, 1);
      const newBundleEdits: typeof bundleItemEdits = {};
      for (const [k, v] of Object.entries(bundleItemEdits)) {
        const [bi, ji] = k.split("-").map(Number);
        if (bi === bundleIdx && ji > itemIdx) {
          newBundleEdits[`${bi}-${ji - 1}`] = v;
        } else if (bi === bundleIdx && ji < itemIdx) {
          newBundleEdits[k] = v;
        } else if (bi !== bundleIdx) {
          newBundleEdits[k] = v;
        }
      }
      setBundleItemEdits(newBundleEdits);
    }

    if (movedItem) {
      newData.bundles[targetBundleIdx].items.splice(insertAt, 0, movedItem);
      setExpandedBundles(prev => new Set([...prev, targetBundleIdx]));
    }

    setData(newData);
    setDragSource(null);
  }, [data, dragSource, itemEdits, bundleItemEdits, selectedItems, itemBundleAssignment, resolveItem]);

  const handleDropOnStandalone = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDropTarget(null);
    if (!data || !dragSource || dragSource.type !== "bundle") return;

    const { bundleIdx, itemIdx } = dragSource;
    const movedItem = resolveItem(data.bundles![bundleIdx].items[itemIdx], bundleItemEdits[`${bundleIdx}-${itemIdx}`]);

    const newData = { ...data, context_items: [...data.context_items], bundles: (data.bundles || []).map(b => ({ ...b, items: [...b.items] })) };
    newData.bundles[bundleIdx].items.splice(itemIdx, 1);
    newData.context_items.push(movedItem);

    // Clean up bundle item edits
    const newBundleEdits: typeof bundleItemEdits = {};
    for (const [k, v] of Object.entries(bundleItemEdits)) {
      const [bi, ji] = k.split("-").map(Number);
      if (bi === bundleIdx && ji > itemIdx) {
        newBundleEdits[`${bi}-${ji - 1}`] = v;
      } else if (bi === bundleIdx && ji < itemIdx) {
        newBundleEdits[k] = v;
      } else if (bi !== bundleIdx) {
        newBundleEdits[k] = v;
      }
    }
    setBundleItemEdits(newBundleEdits);

    // Select the newly added standalone item
    setSelectedItems(prev => new Set([...prev, newData.context_items.length - 1]));
    setData(newData);
    setDragSource(null);
  }, [data, dragSource, bundleItemEdits, resolveItem]);

  const handleDropCreateBundle = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDropTarget(null);
    if (!data || !dragSource) return;

    const newData = { ...data, context_items: [...data.context_items], bundles: (data.bundles || []).map(b => ({ ...b, items: [...b.items] })) };

    let movedItem: ExtractedContextItem | null = null;

    if (dragSource.type === "standalone") {
      const idx = dragSource.idx;
      movedItem = resolveItem(data.context_items[idx], itemEdits[idx]);
      newData.context_items.splice(idx, 1);
      // Reindex standalone edits/selections
      const newItemEdits: typeof itemEdits = {};
      const newSelectedItems = new Set<number>();
      const newAssignments: typeof itemBundleAssignment = {};
      for (const [k, v] of Object.entries(itemEdits)) {
        const ki = Number(k);
        if (ki < idx) newItemEdits[ki] = v;
        else if (ki > idx) newItemEdits[ki - 1] = v;
      }
      selectedItems.forEach(si => {
        if (si < idx) newSelectedItems.add(si);
        else if (si > idx) newSelectedItems.add(si - 1);
      });
      for (const [k, v] of Object.entries(itemBundleAssignment)) {
        const ki = Number(k);
        if (ki < idx) newAssignments[ki] = v;
        else if (ki > idx) newAssignments[ki - 1] = v;
      }
      setItemEdits(newItemEdits);
      setSelectedItems(newSelectedItems);
      setItemBundleAssignment(newAssignments);
    } else if (dragSource.type === "bundle") {
      const { bundleIdx, itemIdx } = dragSource;
      movedItem = resolveItem(data.bundles![bundleIdx].items[itemIdx], bundleItemEdits[`${bundleIdx}-${itemIdx}`]);
      newData.bundles[bundleIdx].items.splice(itemIdx, 1);
      const newBundleEdits: typeof bundleItemEdits = {};
      for (const [k, v] of Object.entries(bundleItemEdits)) {
        const [bi, ji] = k.split("-").map(Number);
        if (bi === bundleIdx && ji > itemIdx) newBundleEdits[`${bi}-${ji - 1}`] = v;
        else if (bi === bundleIdx && ji < itemIdx) newBundleEdits[k] = v;
        else if (bi !== bundleIdx) newBundleEdits[k] = v;
      }
      setBundleItemEdits(newBundleEdits);
    }

    if (movedItem) {
      const newBundle: ExtractedBundle = {
        title: `New Bundle (${movedItem.title})`,
        description: "Created from drag-and-drop",
        items: [movedItem],
      };
      newData.bundles.push(newBundle);
      const newBundleIdx = newData.bundles.length - 1;
      setSelectedBundles(prev => new Set([...prev, newBundleIdx]));
      setExpandedBundles(prev => new Set([...prev, newBundleIdx]));
    }

    setData(newData);
    setDragSource(null);
  }, [data, dragSource, itemEdits, bundleItemEdits, selectedItems, itemBundleAssignment, resolveItem]);

function SmartSuggestionChips({ data, onSelect, onLocalAction }: { 
  data: ExtractionResult; 
  onSelect: (instruction: string, scope: "all" | "selected") => void;
  onLocalAction?: (action: string) => void;
}) {
  const suggestions = useMemo(() => generateSmartSuggestions(data), [data]);

  return (
    <div className="flex gap-1.5 flex-wrap">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => {
            if (s.localAction && onLocalAction) {
              onLocalAction(s.localAction);
            } else {
              onSelect(s.instruction, s.scope);
            }
          }}
          className="text-[10px] px-2 py-1 rounded-full border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          {s.localAction === "promote-to-mandate" && <Shield className="h-2.5 w-2.5 text-amber-400" />}
          {!s.localAction && i === 0 && <Lightbulb className="h-2.5 w-2.5 text-amber-400" />}
          {s.label}
        </button>
      ))}
    </div>
  );
}


  const [refineOpen, setRefineOpen] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [refineScope, setRefineScope] = useState<"all" | "selected">("selected");
  const [refining, setRefining] = useState(false);
  const [refineNotes, setRefineNotes] = useState<string | null>(null);

  const { data: existingBundles = [] } = useQuery({
    queryKey: ["bundles", user?.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("id, title, scope_level")
        .eq("owner_id", user!.id)
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  // resolveItem is declared earlier, before DnD handlers

  const initSelections = (d: ExtractionResult | null = data) => {
    if (d) {
      setSelectedPrefs(new Set(d.preferences.map((_, i) => i)));
      setSelectedItems(new Set(d.context_items.map((_, i) => i)));
      setSelectedBundles(new Set((d.bundles || []).map((_, i) => i)));
      setExpandedBundles(new Set());
      setItemBundleAssignment({});
      setItemEdits({});
      setBundleItemEdits({});
      setPrefEdits({});
      setEditingKey(null);
      setRefineOpen(false);
      setRefineInstruction("");
      setRefineNotes(null);
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (v && initialData) {
      setData(initialData);
      initSelections(initialData);
    }
    onOpenChange(v);
  };

  const handlePromoteToMandate = useCallback(() => {
    if (!data) return;
    const newFlags = { ...mandateFlags };
    // Promote all DIRECTIVE standalone items
    data.context_items.forEach((ci, i) => {
      const resolved = resolveItem(ci, itemEdits[i]);
      if (resolved.category === "DIRECTIVE") {
        newFlags[`standalone-${i}`] = { is_mandate: true, enforcement_level: "required_ack" };
      }
    });
    // Promote all DIRECTIVE bundle items
    (data.bundles || []).forEach((b, bi) => {
      b.items.forEach((ci, ji) => {
        const resolved = resolveItem(ci, bundleItemEdits[`${bi}-${ji}`]);
        if (resolved.category === "DIRECTIVE") {
          newFlags[`bundle-${bi}-${ji}`] = { is_mandate: true, enforcement_level: "required_ack" };
        }
      });
    });
    setMandateFlags(newFlags);
    toast({ title: "Directives promoted", description: "All DIRECTIVE items marked as Mandates with 'Required Acknowledgment'. You can adjust enforcement per-item." });
  }, [data, mandateFlags, itemEdits, bundleItemEdits, resolveItem, toast]);

  const togglePref = (i: number) => {
    setSelectedPrefs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const toggleItem = (i: number) => {
    setSelectedItems(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const toggleBundle = (i: number) => {
    setSelectedBundles(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const toggleBundleExpand = (i: number) => {
    setExpandedBundles(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const setItemAssignment = (itemIdx: number, value: string) => {
    setItemBundleAssignment(prev => ({ ...prev, [itemIdx]: value }));
  };

  const updateItemEdit = (idx: number, field: keyof ExtractedContextItem, value: string) => {
    setItemEdits(prev => ({ ...prev, [idx]: { ...prev[idx], [field]: value } }));
  };

  const updateBundleItemEdit = (bundleIdx: number, itemIdx: number, field: keyof ExtractedContextItem, value: string) => {
    const key = `${bundleIdx}-${itemIdx}`;
    setBundleItemEdits(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  // ── Refine handler ──────────────────────────────────────────────────────
  const handleRefine = async () => {
    if (!data || !refineInstruction.trim()) return;
    setRefining(true);
    try {
      const itemsToRefine: any[] = [];

      if (refineScope === "all" || selectedPrefs.size > 0) {
        const prefIndices = refineScope === "all"
          ? data.preferences.map((_, i) => i)
          : [...selectedPrefs];
        for (const i of prefIndices) {
          const p = data.preferences[i];
          if (!p) continue;
          itemsToRefine.push({
            type: "preference", title: p.preference_key, content: p.preference_value,
            category: "PREFERENCE", preference_key: p.preference_key,
            condition_label: p.condition_label, original_index: i,
          });
        }
      }

      if (refineScope === "all" || selectedItems.size > 0) {
        const itemIndices = refineScope === "all"
          ? data.context_items.map((_, i) => i) : [...selectedItems];
        for (const i of itemIndices) {
          const ci = data.context_items[i];
          if (!ci) continue;
          const resolved = resolveItem(ci, itemEdits[i]);
          itemsToRefine.push({
            type: "context_item", title: resolved.title, content: resolved.content,
            category: resolved.category, original_index: i,
          });
        }
      }

      const currentBundles = data.bundles || [];
      if (refineScope === "all" || selectedBundles.size > 0) {
        const bundleIndices = refineScope === "all"
          ? currentBundles.map((_, i) => i) : [...selectedBundles];
        for (const bi of bundleIndices) {
          const bundle = currentBundles[bi];
          if (!bundle) continue;
          for (const [ji, item] of bundle.items.entries()) {
            const resolved = resolveItem(item, bundleItemEdits[`${bi}-${ji}`]);
            itemsToRefine.push({
              type: "bundle_item", title: resolved.title, content: resolved.content,
              category: resolved.category, original_index: ji,
              bundle_index: bi, bundle_item_index: ji,
            });
          }
        }
      }

      if (itemsToRefine.length === 0) {
        toast({ title: "Nothing to refine", description: "Select items first.", variant: "destructive" });
        setRefining(false);
        return;
      }

      const { data: result, error } = await supabase.functions.invoke("refine-extraction", {
        body: { items: itemsToRefine, instruction: refineInstruction },
      });
      if (error) throw error;
      if (result.error) throw new Error(result.error);

      const refined = result.items || [];
      const newPrefs = [...data.preferences];
      const newContextItems = [...data.context_items];
      const newBundles = [...(data.bundles || [])].map(b => ({ ...b, items: [...b.items] }));
      const newItemEdits = { ...itemEdits };
      const newBundleItemEdits = { ...bundleItemEdits };

      for (const r of refined) {
        if (r.type === "preference") {
          if (r.original_index >= 0 && r.original_index < newPrefs.length) {
            newPrefs[r.original_index] = {
              preference_key: r.preference_key || r.title,
              preference_value: r.content,
              condition_label: r.condition_label,
            };
          } else {
            newPrefs.push({ preference_key: r.preference_key || r.title, preference_value: r.content, condition_label: r.condition_label });
          }
        } else if (r.type === "context_item") {
          if (r.original_index >= 0 && r.original_index < newContextItems.length) {
            newContextItems[r.original_index] = { title: r.title, content: r.content, category: r.category };
            delete newItemEdits[r.original_index];
          } else {
            newContextItems.push({ title: r.title, content: r.content, category: r.category });
          }
        } else if (r.type === "bundle_item") {
          const bi = r.bundle_index ?? 0;
          const ji = r.bundle_item_index ?? r.original_index ?? 0;
          if (bi < newBundles.length && ji >= 0 && ji < newBundles[bi].items.length) {
            newBundles[bi].items[ji] = { title: r.title, content: r.content, category: r.category };
            delete newBundleItemEdits[`${bi}-${ji}`];
          } else if (bi < newBundles.length) {
            newBundles[bi].items.push({ title: r.title, content: r.content, category: r.category });
          }
        }
      }

      const newData: ExtractionResult = {
        ...data,
        preferences: newPrefs,
        context_items: newContextItems,
        bundles: newBundles,
        analysis_notes: result.analysis_notes || data.analysis_notes,
      };

      setData(newData);
      setItemEdits(newItemEdits);
      setBundleItemEdits(newBundleItemEdits);
      setRefineNotes(result.analysis_notes || null);
      setSelectedPrefs(new Set(newPrefs.map((_, i) => i)));
      setSelectedItems(new Set(newContextItems.map((_, i) => i)));
      setSelectedBundles(new Set(newBundles.map((_, i) => i)));
      setRefineInstruction("");
      toast({ title: "Items refined", description: `${refined.length} item${refined.length !== 1 ? "s" : ""} updated by the Knowledge Architect.` });
    } catch (err: any) {
      toast({ title: "Refinement failed", description: err.message, variant: "destructive" });
    } finally {
      setRefining(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !data) return;

      const prefEntries = data.preferences.map((p, i) => ({ p, i })).filter(({ i }) => selectedPrefs.has(i));
      if (prefEntries.length > 0) {
        const { error } = await supabase.from("working_preferences").insert(
          prefEntries.map(({ p, i }) => {
            const edits = prefEdits[i];
            return {
              user_id: user.id,
              preference_key: p.preference_key,
              preference_value: edits?.preference_value ?? p.preference_value,
              condition_label: (edits?.condition_label ?? p.condition_label) || null,
              description: `Extracted from ${sourceType}: ${sourceName}`,
              scope_type: "global",
            };
          })
        );
        if (error) throw error;
      }

      const createdBundleIds: Record<number, string> = {};
      const extractedBundles = data.bundles || [];
      const bundleMatches = data.bundle_matches || [];

      for (const [i, bundle] of extractedBundles.entries()) {
        if (!selectedBundles.has(i)) continue;

        // Check manual override first, then AI match
        const manualOverride = bundleMergeOverrides[i];
        const match = bundleMatches.find(m => m.extracted_index === i);
        // Validate target_bundle_id is a real UUID (not a hallucinated placeholder)
        const isValidUuid = (id?: string) => id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const autoMerge = match && 
          (match.match_type === "exact" || match.match_type === "absorb") && 
          match.confidence >= 0.9 && 
          isValidUuid(match.target_bundle_id);

        const mergeTargetId = (manualOverride && manualOverride !== "new" && isValidUuid(manualOverride))
          ? manualOverride
          : (autoMerge ? match.target_bundle_id : null);

        if (mergeTargetId) {
          // Use existing bundle ID — items will be added to it
          createdBundleIds[i] = mergeTargetId;
        } else {
          const { data: newBundle, error: bundleErr } = await supabase
            .from("bundles")
            .insert({
              owner_id: user.id,
              title: bundle.title,
              description: bundle.description,
              scope_level: bundle.scope_suggestion || "draft",
            })
            .select("id")
            .single();
          if (bundleErr) throw bundleErr;
          createdBundleIds[i] = newBundle.id;
        }

        if (bundle.items.length > 0) {
          // Insert items one-by-one to handle duplicate hash conflicts gracefully
          const createdItems: { id: string; idx: number }[] = [];
          let skippedDupes = 0;
          for (let j = 0; j < bundle.items.length; j++) {
            const resolved = resolveItem(bundle.items[j], bundleItemEdits[`${i}-${j}`]);
            const mandate = mandateFlags[`bundle-${i}-${j}`];
            const sourceItem = bundle.items[j];
            const sourceMetadata = sourceItem.source_pages
              ? { pages: sourceItem.source_pages, source_document: sourceName }
              : null;
            const row = {
              owner_id: user.id,
              title: resolved.title,
              content_full: resolved.content,
              category: resolved.category as any,
              action_type: "APPEND" as any,
              bundle_id: createdBundleIds[i],
              ...(sourceMetadata ? { source_metadata: sourceMetadata } : {}),
              ...(mandate?.is_mandate ? {
                is_mandate: true,
                enforcement_level: mandate.enforcement_level as any,
                mandate_status: "draft" as any,
                priority: "CRITICAL" as any,
              } : {}),
            };
            const { data: created, error: itemErr } = await supabase
              .from("context_items")
              .insert(row)
              .select("id")
              .maybeSingle();
            if (itemErr) {
              if (itemErr.message?.includes("idx_context_items_owner_hash")) {
                skippedDupes++;
                continue;
              }
              throw itemErr;
            }
            if (created) createdItems.push({ id: created.id, idx: j });
          }
          if (skippedDupes > 0) {
            console.log(`Skipped ${skippedDupes} duplicate items in bundle "${bundle.title}"`);
          }

          // Build a map of playbook title -> created ID for parent_playbook_id resolution
          const playbookTitleToId: Record<string, string> = {};
          for (const { id, idx } of createdItems) {
            const resolved = resolveItem(bundle.items[idx], bundleItemEdits[`${i}-${idx}`]);
            if (resolved.category === "PLAYBOOK") {
              playbookTitleToId[resolved.title] = id;
            }
          }

          // Persist many-to-many junction links with parent_playbook_id and sort_order
          if (createdItems.length > 0) {
            const junctionRows = createdItems.map(({ id, idx }) => {
              const resolved = resolveItem(bundle.items[idx], bundleItemEdits[`${i}-${idx}`]);
              const parentPlaybookId = resolved.parent_playbook_title
                ? playbookTitleToId[resolved.parent_playbook_title] || null
                : null;
              return {
                context_item_id: id,
                bundle_id: createdBundleIds[i],
                sort_order: idx,
                ...(parentPlaybookId ? { parent_playbook_id: parentPlaybookId } : {}),
              };
            });
            const { error: junctionErr } = await supabase
              .from("context_item_bundles")
              .insert(junctionRows as any);
            if (junctionErr) throw junctionErr;
          }
        }
      }

      const itemsToSave = data.context_items
        .map((ci, i) => ({ ci, i }))
        .filter(({ i }) => selectedItems.has(i));

      if (itemsToSave.length > 0) {
        const createdStandalone: { id: string; originalIdx: number }[] = [];
        let skippedStandalone = 0;
        for (const { ci, i: originalIdx } of itemsToSave) {
          const resolved = resolveItem(ci, itemEdits[originalIdx]);
          const assignment = itemBundleAssignment[originalIdx];
          let bundleId: string | null = null;
          if (assignment && assignment !== "none") {
            if (assignment.startsWith("new-")) {
              const bundleIdx = parseInt(assignment.replace("new-", ""), 10);
              bundleId = createdBundleIds[bundleIdx] || null;
            } else {
              bundleId = assignment;
            }
          }
          const mandate = mandateFlags[`standalone-${originalIdx}`];
          const sourceItem = ci;
          const sourceMetadata = sourceItem.source_pages
            ? { pages: sourceItem.source_pages, source_document: sourceName }
            : null;
          const row = {
            owner_id: user.id,
            title: resolved.title,
            content_full: resolved.content,
            category: resolved.category as any,
            action_type: "APPEND" as any,
            bundle_id: bundleId,
            ...(sourceMetadata ? { source_metadata: sourceMetadata } : {}),
            ...(mandate?.is_mandate ? {
              is_mandate: true,
              enforcement_level: mandate.enforcement_level as any,
              mandate_status: "draft" as any,
              priority: "CRITICAL" as any,
            } : {}),
          };
          const { data: created, error } = await supabase
            .from("context_items")
            .insert(row)
            .select("id")
            .maybeSingle();
          if (error) {
            if (error.message?.includes("idx_context_items_owner_hash")) {
              skippedStandalone++;
              continue;
            }
            throw error;
          }
          if (created) createdStandalone.push({ id: created.id, originalIdx });
        }
        if (skippedStandalone > 0) {
          console.log(`Skipped ${skippedStandalone} duplicate standalone items`);
        }

        // Persist junction links for standalone items assigned to bundles
        const junctionRows: { context_item_id: string; bundle_id: string }[] = [];
        for (const { id, originalIdx } of createdStandalone) {
          const assignment = itemBundleAssignment[originalIdx];
          let bundleId: string | null = null;
          if (assignment && assignment !== "none") {
            if (assignment.startsWith("new-")) {
              const bundleIdx = parseInt(assignment.replace("new-", ""), 10);
              bundleId = createdBundleIds[bundleIdx] || null;
            } else {
              bundleId = assignment;
            }
          }
          if (bundleId) {
            junctionRows.push({ context_item_id: id, bundle_id: bundleId });
          }
        }
        if (junctionRows.length > 0) {
          const { error: jErr } = await supabase
            .from("context_item_bundles")
            .insert(junctionRows);
          if (jErr) throw jErr;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      qc.invalidateQueries({ queryKey: ["context-items-all"] });
      qc.invalidateQueries({ queryKey: ["bundles"] });
      qc.invalidateQueries({ queryKey: ["bundles-all"] });
      qc.invalidateQueries({ queryKey: ["context-item-bundles-all"] });
      qc.invalidateQueries({ queryKey: ["mandates"] });
      const parts: string[] = [];
      if (selectedPrefs.size > 0) parts.push(`${selectedPrefs.size} preference${selectedPrefs.size !== 1 ? "s" : ""}`);
      if (selectedItems.size > 0) parts.push(`${selectedItems.size} context item${selectedItems.size !== 1 ? "s" : ""}`);
      if (selectedBundles.size > 0) parts.push(`${selectedBundles.size} bundle${selectedBundles.size !== 1 ? "s" : ""}`);
      toast({ title: "Import complete", description: `${parts.join(", ")} added to your knowledge graph.` });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Count AI suggestions across all items
  const suggestionCount = useMemo(() => {
    if (!data) return 0;
    let count = 0;
    const bs = data.bundles || [];
    data.context_items.forEach(ci => { if (ci.is_suggestion) count++; });
    bs.forEach(b => b.items.forEach(it => { if (it.is_suggestion) count++; }));
    return count;
  }, [data]);

  // Filtered items based on hideSuggestions toggle
  const visibleStandaloneItems = useMemo(() => {
    if (!data) return [];
    if (!hideSuggestions) return data.context_items.map((ci, i) => ({ ci, i }));
    return data.context_items.map((ci, i) => ({ ci, i })).filter(({ ci, i }) => {
      const resolved = resolveItem(ci, itemEdits[i]);
      return !resolved.is_suggestion;
    });
  }, [data, hideSuggestions, itemEdits, resolveItem]);

  const getVisibleBundleItems = useCallback((bundle: ExtractedBundle, bundleIdx: number) => {
    if (!hideSuggestions) return bundle.items.map((item, j) => ({ item, j }));
    return bundle.items.map((item, j) => ({ item, j })).filter(({ item, j }) => {
      const resolved = resolveItem(item, bundleItemEdits[`${bundleIdx}-${j}`]);
      return !resolved.is_suggestion;
    });
  }, [hideSuggestions, bundleItemEdits, resolveItem]);

  if (!data) return null;

  const preferences = data.preferences || [];
  const contextItems = data.context_items || [];
  const bundles = data.bundles || [];

  const totalSelected = selectedPrefs.size + selectedItems.size + selectedBundles.size;
  const totalBundleItems = bundles.reduce((sum, b, i) => sum + (selectedBundles.has(i) ? b.items.length : 0), 0);
  const assignedCount = Object.entries(itemBundleAssignment).filter(
    ([idx, val]) => selectedItems.has(Number(idx)) && val && val !== "none"
  ).length;

  const renderEditableItem = (
    item: ExtractedContextItem,
    edits: Partial<ExtractedContextItem> | undefined,
    editKey: string,
    onUpdate: (field: keyof ExtractedContextItem, value: string) => void,
    compact?: boolean,
  ) => {
    const resolved = resolveItem(item, edits);
    const isEditing = editingKey === editKey;
    const textSize = compact ? "text-xs" : "text-sm";
    const contentSize = compact ? "text-[11px]" : "text-xs";

    if (isEditing) {
      return (
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Input
              value={resolved.title}
              onChange={e => onUpdate("title", e.target.value)}
              className="h-7 text-xs"
              placeholder="Title"
            />
            <Select
              value={resolved.category}
              onValueChange={v => onUpdate("category", v)}
            >
              <SelectTrigger className="h-7 text-[11px] w-36 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTEXT_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingKey(null); }}
            >
              <Check className="h-3 w-3 text-primary" />
            </Button>
          </div>
          <Textarea
            value={resolved.content}
            onChange={e => onUpdate("content", e.target.value)}
            rows={2}
            className="text-xs resize-none"
            placeholder="Content"
          />
        </div>
      );
    }

    return (
      <div className="min-w-0 flex-1 group/edit">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${textSize} font-medium`}>{resolved.title}</span>
          {/* Inline category switcher */}
          <Select
            value={resolved.category}
            onValueChange={v => onUpdate("category", v)}
          >
            <SelectTrigger className={`h-auto border-0 p-0 shadow-none focus:ring-0 w-auto ${compact ? "text-[9px]" : "text-[10px]"}`}>
              <CategoryBadge category={resolved.category} compact={compact} className={`${compact ? "text-[9px]" : ""} cursor-pointer hover:opacity-80`} />
            </SelectTrigger>
            <SelectContent>
              {CONTEXT_CATEGORIES.map(c => {
                const role = PROTOCOL_ROLE_META[c];
                return (
                  <SelectItem key={c} value={c} className="text-xs">
                    <span className="flex items-center gap-1.5">
                      <span>{role?.icon || "📄"}</span>
                      <span>{c}</span>
                      <span className="text-muted-foreground text-[10px]">— {role?.label || "Item"}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {resolved.step_order_hint && resolved.category === "PROCEDURE" && (
            <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-cyan-500/30 text-cyan-400">
              Step {resolved.step_order_hint}
            </Badge>
          )}
          {resolved.is_suggestion && (
            <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-yellow-500/30 text-yellow-400 bg-yellow-500/5">
              <Lightbulb className="h-2 w-2 mr-0.5" />
              AI suggestion
            </Badge>
          )}
          {edits && Object.keys(edits).length > 0 && (
            <Badge variant="secondary" className="text-[9px]">edited</Badge>
          )}
          {mandateFlags[editKey]?.is_mandate && (
            <Select
              value={mandateFlags[editKey].enforcement_level}
              onValueChange={(v: "advisory" | "required_ack" | "blocking") => {
                setMandateFlags(prev => ({ ...prev, [editKey]: { ...prev[editKey], enforcement_level: v } }));
              }}
            >
              <SelectTrigger className="h-5 w-auto text-[9px] border-amber-500/30 bg-amber-500/10 text-amber-400 gap-1 px-1.5 py-0 rounded-full">
                <Shield className="h-2 w-2 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advisory" className="text-xs">Advisory</SelectItem>
                <SelectItem value="required_ack" className="text-xs">Required Ack</SelectItem>
                <SelectItem value="blocking" className="text-xs">Blocking</SelectItem>
              </SelectContent>
            </Select>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingKey(editKey); }}
            className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary/50"
            title="Edit"
          >
            <Pencil className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
        <p className={`${contentSize} mt-1 text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
          {resolved.content}
        </p>
      </div>
    );
  };

  const sourceLabel = SOURCE_TYPE_LABELS[sourceType] || sourceType;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Import Copilot — {sourceName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            <Badge variant="secondary" className="text-[9px] mr-1.5">{sourceLabel}</Badge>
            AI extracted {preferences.length} preferences, {contextItems.length} standalone items, and {bundles.length} bundles.
            {" "}
            {(() => {
              const readinessCounts = bundles.reduce((acc, b, i) => {
                const r = computeBundleReadiness(
                  b.items.map((it, j) => resolveItem(it, bundleItemEdits[`${i}-${j}`])),
                  b.content_completeness,
                );
                acc[r] = (acc[r] || 0) + 1;
                return acc;
              }, {} as Record<BundleReadiness, number>);
              const parts: string[] = [];
              if (readinessCounts["protocol-ready"]) parts.push(`🟢 ${readinessCounts["protocol-ready"]} protocol-ready`);
              if (readinessCounts["needs-steps"]) parts.push(`🟡 ${readinessCounts["needs-steps"]} need steps`);
              if (readinessCounts["context-only"]) parts.push(`🔵 ${readinessCounts["context-only"]} context-only`);
              if (readinessCounts["skeleton"]) parts.push(`⚪ ${readinessCounts["skeleton"]} skeleton`);
              return parts.length > 0 ? parts.join(" · ") + "." : "";
            })()}
            {" "}Click any category badge to re-categorize. Drag to reorder steps.
          </p>
          {/* AI Suggestion filter toggle */}
          {suggestionCount > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => setHideSuggestions(!hideSuggestions)}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-colors",
                  hideSuggestions
                    ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                    : "border-border/50 text-muted-foreground hover:border-yellow-500/30 hover:text-yellow-400"
                )}
              >
                {hideSuggestions ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <Lightbulb className="h-2.5 w-2.5" />
                {hideSuggestions ? `${suggestionCount} AI suggestions hidden` : `${suggestionCount} AI suggestion${suggestionCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 -mx-6 px-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
          {/* Document Structure Detection Banner */}
          {data.document_structure && (() => {
            const ds = data.document_structure!;
            const hasSkeleton = ds.skeleton && ds.skeleton.length > 0;
            const [structureExpanded, setStructureExpanded] = [
              expandedBundles.has(-999),
              (v: boolean) => setExpandedBundles(prev => {
                const next = new Set(prev);
                v ? next.add(-999) : next.delete(-999);
                return next;
              }),
            ];
            const densityIcon: Record<string, string> = { rich: "█", moderate: "▓", sparse: "░", empty: "·" };
            const densityColor: Record<string, string> = { rich: "text-emerald-400", moderate: "text-cyan-400", sparse: "text-amber-400", empty: "text-muted-foreground" };

            return (
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                <button
                  type="button"
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left"
                  onClick={() => hasSkeleton && setStructureExpanded(!structureExpanded)}
                >
                  <ScanSearch className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <span className="text-[11px] font-medium text-cyan-400">Structure Detected</span>
                    <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-400 capitalize">
                      {ds.structure_type === "toc" ? "Table of Contents" : ds.structure_type}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[9px]",
                      ds.confidence === "high"
                        ? "border-emerald-500/30 text-emerald-400"
                        : "border-amber-500/30 text-amber-400"
                    )}>
                      {ds.confidence === "high" ? "✓ Mandatory blueprint" : "~ Suggested guide"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {ds.total_sections_detected} sections mapped
                    </span>
                  </div>
                  {hasSkeleton && (
                    structureExpanded
                      ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {structureExpanded && hasSkeleton && (
                   <div className="px-3 pb-2.5 pt-0 space-y-0.5">
                     <div className="border-t border-cyan-500/10 pt-2 space-y-0.5 max-h-48 overflow-y-auto overscroll-contain">
                      {ds.skeleton!.map((section, si) => (
                        <div
                          key={si}
                          className="flex items-start gap-1.5 text-[10px]"
                          style={{ paddingLeft: `${(section.level - 1) * 14}px` }}
                        >
                          <span className={cn("font-mono text-[9px] shrink-0 mt-px", densityColor[section.content_density] || "text-muted-foreground")}>
                            {densityIcon[section.content_density] || "·"}
                          </span>
                          <span className={cn(
                            "flex-1 min-w-0 truncate",
                            section.is_bundle_candidate ? "font-semibold text-cyan-300" : "text-muted-foreground"
                          )}>
                            {section.label}
                          </span>
                          {section.is_bundle_candidate && (
                            <Badge variant="outline" className="text-[8px] border-cyan-500/30 text-cyan-400 shrink-0 py-0 h-3.5">
                              bundle
                            </Badge>
                          )}
                          {section.child_count > 0 && (
                            <span className="text-[9px] text-muted-foreground shrink-0">
                              {section.child_count} sub
                            </span>
                          )}
                          {section.page_or_slide_range && (
                            <span className="text-[9px] text-muted-foreground shrink-0">
                              {section.page_or_slide_range}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {ds.notes && (
                      <p className="text-[10px] text-muted-foreground pt-1.5 border-t border-cyan-500/10 mt-1.5 italic">
                        {ds.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Optimization Decisions Panel */}
          {data.document_structure?.consolidation_decisions && data.document_structure.consolidation_decisions.length > 0 && (() => {
            const decisions = data.document_structure!.consolidation_decisions!;
            const mergeDecisions = decisions.filter(d => d.action === "merge" || d.original_labels.length > 1);
            const reclassDecisions = decisions.filter(d => d.action !== "merge" && d.action !== "keep_as_is" && d.original_labels.length <= 1);
            const optExpanded = expandedBundles.has(-998);
            const setOptExpanded = (v: boolean) => setExpandedBundles(prev => {
              const next = new Set(prev);
              v ? next.add(-998) : next.delete(-998);
              return next;
            });

            const handleUndoMerge = (decision: typeof decisions[0]) => {
              if (!data) return;
              const bundleIdx = (data.bundles || []).findIndex(b =>
                b.title.toLowerCase().includes(decision.result_label.toLowerCase()) ||
                decision.result_label.toLowerCase().includes(b.title.toLowerCase())
              );
              if (bundleIdx === -1) {
                toast({ title: "Cannot split", description: "Could not find the merged bundle.", variant: "destructive" });
                return;
              }
              const bundle = data.bundles![bundleIdx];
              const playbooks = bundle.items
                .map((it, j) => ({ it: resolveItem(it, bundleItemEdits[`${bundleIdx}-${j}`]), j }))
                .filter(({ it }) => it.category === "PLAYBOOK");

              const newBundles = [...(data.bundles || [])].map(b => ({ ...b, items: [...b.items] }));

              if (playbooks.length <= 1) {
                const midpoint = Math.ceil(bundle.items.length / 2);
                const keepItems = bundle.items.slice(0, midpoint);
                const splitItems = bundle.items.slice(midpoint);
                if (splitItems.length === 0) {
                  toast({ title: "Cannot split", description: "Not enough items to split.", variant: "destructive" });
                  return;
                }
                newBundles[bundleIdx] = { ...bundle, items: keepItems };
                const splitTitle = decision.original_labels.length > 1
                  ? decision.original_labels[decision.original_labels.length - 1]
                  : `${decision.result_label} (Split)`;
                newBundles.push({
                  title: splitTitle,
                  description: `Split from "${bundle.title}" — originally: ${decision.original_labels.join(" + ")}`,
                  items: splitItems,
                });
              } else {
                const lastPb = playbooks[playbooks.length - 1];
                const ownedIndices = bundle.items
                  .map((it, j) => ({ it: resolveItem(it, bundleItemEdits[`${bundleIdx}-${j}`]), j }))
                  .filter(({ it }) => it.parent_playbook_title === lastPb.it.title)
                  .map(({ j }) => j);
                const indicesToMove = new Set([lastPb.j, ...ownedIndices]);
                newBundles[bundleIdx] = { ...bundle, items: bundle.items.filter((_, j) => !indicesToMove.has(j)) };
                newBundles.push({
                  title: lastPb.it.title,
                  description: `Split from "${bundle.title}"`,
                  items: bundle.items.filter((_, j) => indicesToMove.has(j)),
                });
              }

              const newStructure = { ...data.document_structure };
              newStructure.consolidation_decisions = decisions.filter(d => d !== decision);
              const newData = { ...data, bundles: newBundles, document_structure: newStructure };
              setData(newData);
              const newIdx = newBundles.length - 1;
              setSelectedBundles(prev => new Set([...prev, newIdx]));
              setExpandedBundles(prev => new Set([...prev, newIdx]));
              toast({ title: "Split applied", description: `"${decision.result_label}" split back into separate items.` });
            };

            const handleUndoReclassify = (decision: typeof decisions[0]) => {
              if (!data) return;
              let found = false;
              for (let bi = 0; bi < (data.bundles || []).length; bi++) {
                for (let ji = 0; ji < data.bundles![bi].items.length; ji++) {
                  const resolved = resolveItem(data.bundles![bi].items[ji], bundleItemEdits[`${bi}-${ji}`]);
                  if (decision.original_labels.some(l =>
                    resolved.title.toLowerCase().includes(l.toLowerCase()) ||
                    l.toLowerCase().includes(resolved.title.toLowerCase())
                  )) {
                    const revertCategory = decision.action === "reclassify_as_procedure" ? "PLAYBOOK" : resolved.category;
                    updateBundleItemEdit(bi, ji, "category", revertCategory);
                    found = true;
                  }
                }
              }
              if (!found) {
                toast({ title: "Item not found", description: "Could not locate the reclassified item.", variant: "destructive" });
                return;
              }
              const newStructure = { ...data.document_structure };
              newStructure.consolidation_decisions = decisions.filter(d => d !== decision);
              setData(prev => prev ? { ...prev, document_structure: newStructure } : prev);
              toast({ title: "Reclassification reverted" });
            };

            const actionIcons: Record<string, string> = {
              merge: "🔗", demote_to_playbook: "⬇", promote_to_bundle: "⬆",
              reclassify_as_procedure: "↩", keep_as_is: "✓",
            };
            const actionLabels: Record<string, string> = {
              merge: "Merged", demote_to_playbook: "Demoted → Playbook",
              promote_to_bundle: "Promoted → Bundle", reclassify_as_procedure: "Reclassified → Procedure",
              keep_as_is: "Kept as-is",
            };

            return (
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5">
                <button
                  type="button"
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left"
                  onClick={() => setOptExpanded(!optExpanded)}
                >
                  <GitMerge className="h-4 w-4 text-violet-400 shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <span className="text-[11px] font-medium text-violet-400">Structure Optimized</span>
                    {mergeDecisions.length > 0 && (
                      <Badge variant="outline" className="text-[9px] border-violet-500/30 text-violet-400">
                        {mergeDecisions.length} merge{mergeDecisions.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    {reclassDecisions.length > 0 && (
                      <Badge variant="outline" className="text-[9px] border-violet-500/30 text-violet-400">
                        {reclassDecisions.length} reclassif.
                      </Badge>
                    )}
                    {data.document_structure?.optimization_stats && (
                      <span className="text-[10px] text-muted-foreground">
                        {data.document_structure.optimization_stats.final_bundles} bundles · {data.document_structure.optimization_stats.final_playbooks} playbooks
                      </span>
                    )}
                  </div>
                  {optExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  }
                </button>

                {optExpanded && (
                  <div className="px-3 pb-3 pt-0 space-y-1.5">
                    {data.document_structure?.optimization_summary && (
                      <p className="text-[10px] text-muted-foreground italic border-t border-violet-500/10 pt-2">
                        {data.document_structure.optimization_summary}
                      </p>
                    )}
                    <div className="space-y-1.5 max-h-64 overflow-y-auto overscroll-contain">
                      {decisions.filter(d => d.action !== "keep_as_is").map((decision, di) => (
                        <div
                          key={di}
                          className="flex items-start gap-2 rounded border border-border/30 bg-background/50 p-2 text-[10px] group/decision"
                        >
                          <span className="shrink-0 mt-0.5" title={actionLabels[decision.action] || decision.action}>
                            {actionIcons[decision.action] || "•"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="outline" className="text-[8px] border-violet-500/20 text-violet-400 py-0 h-3.5">
                                {actionLabels[decision.action] || decision.action}
                              </Badge>
                              <span className="font-medium text-foreground">{decision.result_label}</span>
                              <Badge variant="secondary" className="text-[8px] py-0 h-3.5">
                                {decision.result_role}
                              </Badge>
                              <span className={cn("text-[8px] ml-auto shrink-0",
                                decision.semantic_confidence >= 0.8 ? "text-emerald-400" :
                                decision.semantic_confidence >= 0.6 ? "text-amber-400" : "text-red-400"
                              )}>
                                {Math.round(decision.semantic_confidence * 100)}%
                              </span>
                            </div>
                            {decision.original_labels.length > 1 && (
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                <span className="text-muted-foreground">From:</span>
                                {decision.original_labels.map((label, li) => (
                                  <span key={li} className="text-foreground/70">
                                    {li > 0 && <span className="text-muted-foreground mx-0.5">+</span>}
                                    "{label}"
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-muted-foreground mt-0.5">{decision.rationale}</p>
                          </div>
                          {decision.action === "merge" && decision.original_labels.length > 1 && (
                            <button
                              onClick={() => handleUndoMerge(decision)}
                              className="opacity-0 group-hover/decision:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 shrink-0"
                              title="Undo merge — split back into separate items"
                            >
                              <Scissors className="h-3 w-3 text-destructive" />
                            </button>
                          )}
                          {(decision.action === "demote_to_playbook" || decision.action === "promote_to_bundle" || decision.action === "reclassify_as_procedure") && (
                            <button
                              onClick={() => handleUndoReclassify(decision)}
                              className="opacity-0 group-hover/decision:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 shrink-0"
                              title="Undo reclassification"
                            >
                              <Undo2 className="h-3 w-3 text-destructive" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Advisor Persona Banner */}
          {data.advisor && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex gap-2.5">
              <span className="text-lg shrink-0">{data.advisor.icon_suggestion || "🎯"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-semibold text-amber-400">Domain Advisor</h4>
                  <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">{data.advisor.persona_title}</Badge>
                  {data.extraction_depth && (
                    <Badge variant="secondary" className="text-[9px]">
                      {EXTRACTION_DEPTH_META[data.extraction_depth]?.icon} {EXTRACTION_DEPTH_META[data.extraction_depth]?.label}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{data.advisor.extraction_guidance}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {data.advisor.expertise_areas?.map((area, i) => (
                    <Badge key={i} variant="secondary" className="text-[9px]">{area}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Notes */}
          {data.analysis_notes && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex gap-2.5">
              <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-primary mb-1">Knowledge Architect Analysis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis_notes}</p>
              </div>
            </div>
          )}

          {/* Empty state when nothing was extracted */}
          {data.preferences.length === 0 && data.context_items.length === 0 && bundles.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <Package className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">No items extracted</p>
                <p className="text-xs text-muted-foreground/70 mt-1 max-w-sm mx-auto">
                  The AI couldn't extract structured knowledge from this content. Try using the Refine panel below to provide specific instructions, or check that the source file contains readable text.
                </p>
              </div>
            </div>
          )}

          {/* Preferences section */}
          {data.preferences.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Settings2 className="h-3 w-3" /> Working Preferences ({data.preferences.length})
                </h3>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={data.preferences.length > 0 && selectedPrefs.size === data.preferences.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPrefs(new Set(data.preferences.map((_, i) => i)));
                      } else {
                        setSelectedPrefs(new Set());
                      }
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">Select all</span>
                </label>
              </div>
              {data.preferences.map((p, i) => {
                const editedValue = prefEdits[i]?.preference_value ?? p.preference_value;
                const editedCondition = prefEdits[i]?.condition_label ?? p.condition_label;
                const isPrefEditing = editingKey === `pref-${i}`;
                const hasEdits = prefEdits[i] && Object.keys(prefEdits[i]).length > 0;

                return (
                <label
                  key={i}
                  className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedPrefs.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <Checkbox checked={selectedPrefs.has(i)} onCheckedChange={() => togglePref(i)} className="mt-0.5" />
                  <div className="min-w-0 flex-1 group/prefedit">
                    {isPrefEditing ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {PREFERENCE_KEY_LABELS[p.preference_key as keyof typeof PREFERENCE_KEY_LABELS] ?? p.preference_key}
                          </Badge>
                          <Input
                            value={editedCondition || ""}
                            onChange={e => setPrefEdits(prev => ({ ...prev, [i]: { ...prev[i], condition_label: e.target.value || undefined } }))}
                            className="h-7 text-xs flex-1"
                            placeholder="Condition label (optional)"
                            onClick={e => e.stopPropagation()}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingKey(null); }}
                          >
                            <Check className="h-3 w-3 text-primary" />
                          </Button>
                        </div>
                        <Textarea
                          value={editedValue}
                          onChange={e => setPrefEdits(prev => ({ ...prev, [i]: { ...prev[i], preference_value: e.target.value } }))}
                          rows={2}
                          className="text-xs resize-none"
                          placeholder="Preference value"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-[10px]">
                            {PREFERENCE_KEY_LABELS[p.preference_key as keyof typeof PREFERENCE_KEY_LABELS] ?? p.preference_key}
                          </Badge>
                          {editedCondition && (
                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                              {editedCondition}
                            </Badge>
                          )}
                          {hasEdits && (
                            <Badge variant="secondary" className="text-[9px]">edited</Badge>
                          )}
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingKey(`pref-${i}`); }}
                            className="opacity-0 group-hover/prefedit:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary/50"
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-xs mt-1 text-foreground">{editedValue}</p>
                      </>
                    )}
                  </div>
                </label>
                );
              })}
            </div>
          )}

          {/* Bundles section */}
          {bundles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Package className="h-3 w-3" /> Bundles ({bundles.length})
                  {dragSource?.type === "standalone" && (
                    <span className="text-[10px] text-primary font-normal ml-1">↓ Drop items onto a bundle</span>
                  )}
                </h3>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={bundles.length > 0 && selectedBundles.size === bundles.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBundles(new Set(bundles.map((_, i) => i)));
                      } else {
                        setSelectedBundles(new Set());
                      }
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">Select all</span>
                </label>
              </div>
              {bundles.map((bundle, i) => (
                <div
                  key={i}
                  onDragOver={(e) => handleDragOver(e, `bundle-${i}`)}
                  onDragLeave={(e) => handleDragLeave(e, `bundle-${i}`)}
                  onDrop={(e) => handleDropOnBundle(e, i)}
                  className={`rounded-md border transition-colors ${
                    dropTarget === `bundle-${i}` ? "border-primary bg-primary/10 ring-2 ring-primary/20" :
                    selectedBundles.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3 p-3">
                    <Checkbox
                      checked={selectedBundles.has(i)}
                      onCheckedChange={() => toggleBundle(i)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-sm font-medium">{bundle.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {bundle.items.length} item{bundle.items.length !== 1 ? "s" : ""}
                        </Badge>
                        {/* Bundle Readiness Badge */}
                        {(() => {
                          const readiness = computeBundleReadiness(
                            bundle.items.map((it, j) => resolveItem(it, bundleItemEdits[`${i}-${j}`])),
                            bundle.content_completeness,
                          );
                          const meta = BUNDLE_READINESS_META[readiness];
                          return (
                            <Badge
                              variant="outline"
                              className={`text-[9px] gap-0.5 ${meta.color}`}
                              title={meta.description}
                            >
                              <span className="text-[8px]">{meta.icon}</span>
                              {meta.label}
                            </Badge>
                          );
                        })()}
                        {bundle.scope_suggestion && (
                          <Badge variant="secondary" className="text-[9px] gap-0.5">
                            {bundle.scope_suggestion === "organization" ? <Globe className="h-2.5 w-2.5" /> : bundle.scope_suggestion === "team" ? <Users className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                            {bundle.scope_suggestion}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{bundle.description}</p>
                      {/* Bundle Match Suggestion */}
                      {(() => {
                        const match = (data.bundle_matches || []).find(m => m.extracted_index === i);
                        if (!match || match.match_type === "new") return null;

                        const confidenceColor = match.confidence >= 0.9
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : match.confidence >= 0.7
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-blue-500/30 bg-blue-500/10 text-blue-400";

                        return (
                          <div className={`mt-2 rounded-md border p-2 flex items-center gap-2 ${confidenceColor}`}>
                            <GitMerge className="h-3.5 w-3.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {match.match_type === "exact" || match.match_type === "absorb" ? (
                                  <>
                                    <span className="text-[10px] font-medium">
                                      {match.confidence >= 0.9 ? "Will merge into" : "Suggested merge with"}
                                    </span>
                                    <Badge variant="outline" className="text-[9px] border-current/30">
                                      {match.target_bundle_title || "existing bundle"}
                                    </Badge>
                                  </>
                                ) : match.match_type === "consolidate" ? (
                                  <>
                                    <span className="text-[10px] font-medium">
                                      {match.confidence >= 0.9 ? "Auto-consolidated" : "Consider merging"} with
                                    </span>
                                    {(match.consolidate_with || []).map(ci => (
                                      <Badge key={ci} variant="outline" className="text-[9px] border-current/30">
                                        {bundles[ci]?.title || `Bundle ${ci}`}
                                      </Badge>
                                    ))}
                                  </>
                                ) : null}
                                <Badge variant="secondary" className="text-[8px] ml-auto">
                                  {Math.round(match.confidence * 100)}% match
                                </Badge>
                              </div>
                              <p className="text-[10px] opacity-80 mt-0.5">{match.reason}</p>
                            </div>
                          </div>
                        );
                      })()}
                      {bundle.coverage_gaps && bundle.coverage_gaps.length > 0 && (
                        <div className="mt-1.5 flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {bundle.coverage_gaps.map((gap, gi) => (
                              <Badge key={gi} variant="outline" className="text-[9px] border-amber-500/20 text-amber-400/80 bg-amber-500/5">
                                {gap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Manual merge-into-existing dropdown */}
                      {existingBundles.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <GitMerge className="h-3 w-3 text-muted-foreground shrink-0" />
                          <Select
                            value={bundleMergeOverrides[i] || "new"}
                            onValueChange={(v) => setBundleMergeOverrides(prev => ({ ...prev, [i]: v }))}
                          >
                            <SelectTrigger className="h-7 text-[11px] w-56">
                              <SelectValue placeholder="Create new bundle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new" className="text-xs">✨ Create new bundle</SelectItem>
                              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Merge into existing
                              </div>
                              {existingBundles.map(eb => (
                                <SelectItem key={eb.id} value={eb.id} className="text-xs">
                                  {eb.title}
                                  <span className="text-muted-foreground ml-1">({eb.scope_level})</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleBundleExpand(i); }}
                      className="p-1 rounded hover:bg-secondary/50 shrink-0"
                    >
                      {expandedBundles.has(i) ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {expandedBundles.has(i) && (
                    <div className="border-t border-border/30 px-3 pb-3 pt-2 space-y-0 ml-8">
                      {/* Protocol structure hint */}
                      {(() => {
                        const resolvedItems = bundle.items.map((it, j) => resolveItem(it, bundleItemEdits[`${i}-${j}`]));
                        const playbooks = resolvedItems.filter(it => it.category === "PLAYBOOK");
                        const procedures = resolvedItems.filter(it => it.category === "PROCEDURE");
                        const directives = resolvedItems.filter(it => it.category === "DIRECTIVE");
                        const contextCount = resolvedItems.length - playbooks.length - procedures.length - directives.length;
                        
                        // Group items: playbooks as headers, their owned items nested, shared items at bottom
                        const playbookIndices = bundle.items.map((it, j) => ({ it: resolvedItems[j], j })).filter(({ it }) => it.category === "PLAYBOOK");
                        const getVisItems = getVisibleBundleItems(bundle, i);
                        const hiddenCount = bundle.items.length - getVisItems.length;

                        // Build ownership map from parent_playbook_title
                        const ownedByPlaybook = new Map<string, { item: ExtractedContextItem; j: number }[]>();
                        const sharedItems: { item: ExtractedContextItem; j: number }[] = [];
                        
                        for (const { item, j } of getVisItems) {
                          const resolved = resolveItem(item, bundleItemEdits[`${i}-${j}`]);
                          if (resolved.category === "PLAYBOOK") continue; // playbooks rendered as headers
                          if (resolved.parent_playbook_title) {
                            const existing = ownedByPlaybook.get(resolved.parent_playbook_title) || [];
                            existing.push({ item, j });
                            ownedByPlaybook.set(resolved.parent_playbook_title, existing);
                          } else {
                            sharedItems.push({ item, j });
                          }
                        }

                        return (
                          <>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 flex-wrap">
                              <span className="font-medium">Protocol structure:</span>
                              <span className="text-orange-400">🎯 {playbooks.length} protocol{playbooks.length !== 1 ? "s" : ""}</span>
                              <span className="text-cyan-400">▶ {procedures.length} step{procedures.length !== 1 ? "s" : ""}</span>
                              {directives.length > 0 && <span className="text-amber-400">⚡ {directives.length} gate{directives.length !== 1 ? "s" : ""}</span>}
                              {contextCount > 0 && <span className="text-blue-400">📘 {contextCount} shared context</span>}
                            </div>

                            {/* Render playbooks as collapsible groups */}
                            {playbookIndices.map(({ it: pbItem, j: pbJ }) => {
                              const resolved = resolveItem(bundle.items[pbJ], bundleItemEdits[`${i}-${pbJ}`]);
                              const roleMeta = PROTOCOL_ROLE_META[resolved.category] || PROTOCOL_ROLE_META.KNOWLEDGE;
                              const owned = ownedByPlaybook.get(resolved.title) || [];

                              return (
                                <div key={`pb-${pbJ}`} className="mb-2">
                                  {/* Playbook header */}
                                  <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, { type: "bundle", bundleIdx: i, itemIdx: pbJ })}
                                    onDragEnd={handleDragEnd}
                                    className="rounded border border-orange-500/20 bg-orange-500/5 p-2.5 cursor-grab active:cursor-grabbing flex items-start gap-2"
                                  >
                                    <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
                                      <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                                      <span className="text-[9px] leading-none" title={roleMeta.label}>{roleMeta.icon}</span>
                                    </div>
                                    {renderEditableItem(
                                      bundle.items[pbJ],
                                      bundleItemEdits[`${i}-${pbJ}`],
                                      `bundle-${i}-${pbJ}`,
                                      (field, value) => updateBundleItemEdit(i, pbJ, field, value),
                                      true,
                                    )}
                                  </div>
                                  {/* Owned items nested under playbook */}
                                  {owned.length > 0 && (
                                    <div className="ml-4 border-l-2 border-orange-500/15 pl-2 mt-1 space-y-1">
                                      {owned.map(({ item, j }) => {
                                        const itemResolved = resolveItem(item, bundleItemEdits[`${i}-${j}`]);
                                        const itemRoleMeta = PROTOCOL_ROLE_META[itemResolved.category] || PROTOCOL_ROLE_META.KNOWLEDGE;
                                        return (
                                          <div key={`owned-${j}`}>
                                            <div
                                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, `bundle-${i}-item-${j}`); }}
                                              onDragLeave={(e) => handleDragLeave(e, `bundle-${i}-item-${j}`)}
                                              onDrop={(e) => { e.stopPropagation(); handleDropOnBundle(e, i, j); }}
                                              className={`h-0.5 -mx-1 rounded transition-all ${
                                                dropTarget === `bundle-${i}-item-${j}` ? "h-1.5 bg-primary/30 my-0.5" : ""
                                              }`}
                                            />
                                            <div
                                              draggable
                                              onDragStart={(e) => handleDragStart(e, { type: "bundle", bundleIdx: i, itemIdx: j })}
                                              onDragEnd={handleDragEnd}
                                              className="rounded border border-border/30 bg-background/50 p-2 cursor-grab active:cursor-grabbing flex items-start gap-2 group/owneditem"
                                            >
                                              <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
                                                <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                                                <span className="text-[9px] leading-none" title={itemRoleMeta.label}>{itemRoleMeta.icon}</span>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                {renderEditableItem(
                                                  item,
                                                  bundleItemEdits[`${i}-${j}`],
                                                  `bundle-${i}-${j}`,
                                                  (field, value) => updateBundleItemEdit(i, j, field, value),
                                                  true,
                                                )}
                                              </div>
                                              {/* Move to playbook action */}
                                              {playbookIndices.length > 0 && (
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <button
                                                      className="opacity-0 group-hover/owneditem:opacity-100 transition-opacity p-1 rounded hover:bg-secondary/50 shrink-0"
                                                      title="Move to another playbook"
                                                      onClick={(e) => e.stopPropagation()}
                                                    >
                                                      <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                                    </button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end" className="min-w-[180px]">
                                                    <DropdownMenuLabel className="text-[10px] text-muted-foreground">Move to playbook</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {playbookIndices.map(({ it: pb, j: pbIdx }) => {
                                                      const pbResolved = resolveItem(bundle.items[pbIdx], bundleItemEdits[`${i}-${pbIdx}`]);
                                                      const isCurrent = itemResolved.parent_playbook_title === pbResolved.title;
                                                      return (
                                                        <DropdownMenuItem
                                                          key={pbIdx}
                                                          disabled={isCurrent}
                                                          className={cn("text-xs gap-2", isCurrent && "opacity-50")}
                                                          onClick={() => updateBundleItemEdit(i, j, "parent_playbook_title", pbResolved.title)}
                                                        >
                                                          <span className="text-orange-400">🎯</span>
                                                          {pbResolved.title}
                                                          {isCurrent && <span className="text-[9px] text-muted-foreground ml-auto">current</span>}
                                                        </DropdownMenuItem>
                                                      );
                                                    })}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                      className="text-xs gap-2"
                                                      onClick={() => updateBundleItemEdit(i, j, "parent_playbook_title", undefined)}
                                                    >
                                                      <span className="text-blue-400">📘</span>
                                                      Shared context (no playbook)
                                                    </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  {owned.length === 0 && (
                                    <div className="ml-4 border-l-2 border-orange-500/15 pl-2 mt-1">
                                      <p className="text-[10px] text-muted-foreground/50 italic py-1">No steps assigned to this protocol yet</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Shared context items (no parent playbook) */}
                            {sharedItems.length > 0 && (
                              <div className="mt-2">
                                {playbookIndices.length > 0 && (
                                  <div className="text-[10px] text-blue-400/70 font-medium mb-1 flex items-center gap-1">
                                    📘 Shared context (injected into all protocols)
                                  </div>
                                )}
                                <div className="space-y-1">
                                  {sharedItems.map(({ item, j }) => {
                                    const resolved = resolveItem(item, bundleItemEdits[`${i}-${j}`]);
                                    const roleMeta = PROTOCOL_ROLE_META[resolved.category] || PROTOCOL_ROLE_META.KNOWLEDGE;
                                    return (
                                      <div key={`shared-${j}`}>
                                        <div
                                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, `bundle-${i}-item-${j}`); }}
                                          onDragLeave={(e) => handleDragLeave(e, `bundle-${i}-item-${j}`)}
                                          onDrop={(e) => { e.stopPropagation(); handleDropOnBundle(e, i, j); }}
                                          className={`h-0.5 -mx-1 rounded transition-all ${
                                            dropTarget === `bundle-${i}-item-${j}` ? "h-1.5 bg-primary/30 my-0.5" : ""
                                          }`}
                                        />
                                        <div
                                          draggable
                                          onDragStart={(e) => handleDragStart(e, { type: "bundle", bundleIdx: i, itemIdx: j })}
                                          onDragEnd={handleDragEnd}
                                          className="rounded border border-border/30 bg-background/50 p-2 cursor-grab active:cursor-grabbing flex items-start gap-2 group/shareditem"
                                        >
                                          <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
                                            <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                                            <span className="text-[9px] leading-none" title={roleMeta.label}>{roleMeta.icon}</span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            {renderEditableItem(
                                              item,
                                              bundleItemEdits[`${i}-${j}`],
                                              `bundle-${i}-${j}`,
                                              (field, value) => updateBundleItemEdit(i, j, field, value),
                                              true,
                                            )}
                                          </div>
                                          {/* Move to playbook action */}
                                          {playbookIndices.length > 0 && (
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button
                                                  className="opacity-0 group-hover/shareditem:opacity-100 transition-opacity p-1 rounded hover:bg-secondary/50 shrink-0"
                                                  title="Assign to a playbook"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] text-muted-foreground">Assign to playbook</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {playbookIndices.map(({ it: pb, j: pbIdx }) => {
                                                  const pbResolved = resolveItem(bundle.items[pbIdx], bundleItemEdits[`${i}-${pbIdx}`]);
                                                  return (
                                                    <DropdownMenuItem
                                                      key={pbIdx}
                                                      className="text-xs gap-2"
                                                      onClick={() => updateBundleItemEdit(i, j, "parent_playbook_title", pbResolved.title)}
                                                    >
                                                      <span className="text-orange-400">🎯</span>
                                                      {pbResolved.title}
                                                    </DropdownMenuItem>
                                                  );
                                                })}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* No items at all (no playbooks either) */}
                            {playbookIndices.length === 0 && sharedItems.length === 0 && getVisItems.length === 0 && (
                              <p className="text-[10px] text-muted-foreground/50 italic py-1">No items in this bundle</p>
                            )}

                            {hiddenCount > 0 && (
                              <div className="text-[10px] text-yellow-400/70 flex items-center gap-1 py-1 px-2">
                                <Lightbulb className="h-2.5 w-2.5" />
                                {hiddenCount} AI suggestion{hiddenCount !== 1 ? "s" : ""} hidden
                              </div>
                            )}
                          </>
                        );
                      })()}
                      {/* Drop zone after last item */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, `bundle-${i}-after-last`); }}
                        onDragLeave={(e) => handleDragLeave(e, `bundle-${i}-after-last`)}
                        onDrop={(e) => { e.stopPropagation(); handleDropOnBundle(e, i, bundle.items.length); }}
                        className={`h-1 -mx-1 rounded transition-all ${
                          dropTarget === `bundle-${i}-after-last` ? "h-2 bg-primary/30 my-1" : "my-0.5"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create New Bundle drop zone */}
          {dragSource && (
            <div
              onDragOver={(e) => handleDragOver(e, "create-bundle")}
              onDragLeave={(e) => handleDragLeave(e, "create-bundle")}
              onDrop={handleDropCreateBundle}
              className={`rounded-lg border-2 border-dashed p-4 flex items-center justify-center gap-2 transition-all ${
                dropTarget === "create-bundle"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              <FolderPlus className={`h-4 w-4 ${dropTarget === "create-bundle" ? "text-primary" : ""}`} />
              <span className="text-xs font-medium">Drop here to create a new bundle</span>
            </div>
          )}

          {(data.context_items.length > 0 || dragSource?.type === "bundle") && (
            <div
              className={`space-y-2 rounded-lg p-2 -m-2 transition-colors ${
                dropTarget === "standalone" ? "bg-primary/10 ring-2 ring-primary/20 ring-inset" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, "standalone")}
              onDragLeave={(e) => handleDragLeave(e, "standalone")}
              onDrop={handleDropOnStandalone}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookUp className="h-3 w-3" /> Standalone Context Items ({visibleStandaloneItems.length}{hideSuggestions && visibleStandaloneItems.length !== data.context_items.length ? `/${data.context_items.length}` : ""})
                  {dragSource?.type === "bundle" && (
                    <span className="text-[10px] text-primary font-normal ml-1">↓ Drop here to make standalone</span>
                  )}
                </h3>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={data.context_items.length > 0 && selectedItems.size === data.context_items.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems(new Set(data.context_items.map((_, i) => i)));
                      } else {
                        setSelectedItems(new Set());
                      }
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">Select all</span>
                </label>
              </div>
              {visibleStandaloneItems.map(({ ci, i }) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type: "standalone", idx: i })}
                  onDragEnd={handleDragEnd}
                  className={`rounded-md border p-3 transition-colors cursor-grab active:cursor-grabbing ${
                    selectedItems.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                    <Checkbox checked={selectedItems.has(i)} onCheckedChange={() => toggleItem(i)} className="mt-0.5" />
                    {renderEditableItem(
                      ci,
                      itemEdits[i],
                      `standalone-${i}`,
                      (field, value) => updateItemEdit(i, field, value),
                    )}
                  </div>

                  {selectedItems.has(i) && (existingBundles.length > 0 || bundles.length > 0) && (
                    <div className="mt-2 ml-8 flex items-center gap-2">
                      <FolderPlus className="h-3 w-3 text-muted-foreground shrink-0" />
                      <Select
                        value={itemBundleAssignment[i] || "none"}
                        onValueChange={(v) => setItemAssignment(i, v)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-56">
                          <SelectValue placeholder="No bundle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-xs">No bundle (standalone)</SelectItem>
                          {existingBundles.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Existing Bundles
                              </div>
                              {existingBundles.map(b => (
                                <SelectItem key={b.id} value={b.id} className="text-xs">
                                  {b.title}
                                  <span className="text-muted-foreground ml-1">({b.scope_level})</span>
                                </SelectItem>
                              ))}
                            </>
                          )}
                          {bundles.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                New Bundles (from this extraction)
                              </div>
                              {bundles.map((b, bi) => (
                                <SelectItem key={`new-${bi}`} value={`new-${bi}`} className="text-xs">
                                  ✨ {b.title}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refine Copilot Panel */}
        <div className="border-t border-border/30">
          {!refineOpen ? (
            <button
              onClick={() => setRefineOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Ask the Knowledge Architect to refine items…</span>
            </button>
          ) : (
            <div className="p-3 space-y-2.5">
              {refineNotes && (
                <div className="rounded border border-primary/20 bg-primary/5 p-2 flex gap-2">
                  <Brain className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{refineNotes}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Select value={refineScope} onValueChange={(v: "all" | "selected") => setRefineScope(v)}>
                  <SelectTrigger className="h-7 text-[11px] w-28 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selected" className="text-xs">Selected</SelectItem>
                    <SelectItem value="all" className="text-xs">All items</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <MessageSquare className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={refineInstruction}
                    onChange={e => setRefineInstruction(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !refining) { e.preventDefault(); handleRefine(); } }}
                    placeholder="e.g. 'Split vague items into specific ones', 'Recategorize research items', 'Make content more detailed'…"
                    className="h-7 text-xs pl-7 pr-8"
                    disabled={refining}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={handleRefine}
                    disabled={refining || !refineInstruction.trim()}
                  >
                    {refining ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 text-primary" />}
                  </Button>
                </div>
              </div>
              <SmartSuggestionChips 
                data={data} 
                onSelect={(instruction, scope) => { setRefineInstruction(instruction); setRefineScope(scope); }}
                onLocalAction={(action) => {
                  if (action === "promote-to-mandate") handlePromoteToMandate();
                }}
              />
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 flex-1 text-[10px] text-muted-foreground">
            {totalBundleItems > 0 && (
              <span>{selectedBundles.size} bundle{selectedBundles.size !== 1 ? "s" : ""} ({totalBundleItems} items)</span>
            )}
            {assignedCount > 0 && (
              <span>· {assignedCount} item{assignedCount !== 1 ? "s" : ""} assigned to bundles</span>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={totalSelected === 0 || saveMutation.isPending || refining}
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

import { useState, useCallback, useEffect, type DragEvent } from "react";
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
import { Settings2, BookUp, Loader2, Sparkles, Package, ChevronDown, ChevronRight, FolderPlus, Pencil, Check, Brain, Globe, Users, User, RefreshCw, MessageSquare, Send, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  type ExtractionResult,
  type ExtractedPreference,
  type ExtractedContextItem,
  type ExtractedBundle,
  type ImportCopilotProps,
  type ContextCategory,
  CONTEXT_CATEGORIES,
  CATEGORY_COLORS,
  PREFERENCE_KEY_LABELS,
} from "@/lib/knowledge-schema";

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
  const [data, setData] = useState<ExtractionResult | null>(initialData);
  // Sync when parent passes new data
  useEffect(() => { setData(initialData); }, [initialData]);

  const [selectedPrefs, setSelectedPrefs] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedBundles, setSelectedBundles] = useState<Set<number>>(new Set());
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());
  const [itemBundleAssignment, setItemBundleAssignment] = useState<Record<number, string>>({});

  const [itemEdits, setItemEdits] = useState<Record<number, Partial<ExtractedContextItem>>>({});
  const [bundleItemEdits, setBundleItemEdits] = useState<Record<string, Partial<ExtractedContextItem>>>({});
  const [prefEdits, setPrefEdits] = useState<Record<number, Partial<ExtractedPreference>>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

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
      for (const [i, bundle] of extractedBundles.entries()) {
        if (!selectedBundles.has(i)) continue;

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

        if (bundle.items.length > 0) {
          const { error: itemsErr } = await supabase.from("context_items").insert(
            bundle.items.map((ci, j) => {
              const resolved = resolveItem(ci, bundleItemEdits[`${i}-${j}`]);
              return {
                owner_id: user.id,
                title: resolved.title,
                content_full: resolved.content,
                category: resolved.category as any,
                action_type: "APPEND" as any,
                bundle_id: newBundle.id,
              };
            })
          );
          if (itemsErr) throw itemsErr;
        }
      }

      const itemsToSave = data.context_items
        .map((ci, i) => ({ ci, i }))
        .filter(({ i }) => selectedItems.has(i));

      if (itemsToSave.length > 0) {
        const rows = itemsToSave.map(({ ci, i }) => {
          const resolved = resolveItem(ci, itemEdits[i]);
          const assignment = itemBundleAssignment[i];
          let bundleId: string | null = null;
          if (assignment && assignment !== "none") {
            if (assignment.startsWith("new-")) {
              const bundleIdx = parseInt(assignment.replace("new-", ""), 10);
              bundleId = createdBundleIds[bundleIdx] || null;
            } else {
              bundleId = assignment;
            }
          }
          return {
            owner_id: user.id,
            title: resolved.title,
            content_full: resolved.content,
            category: resolved.category as any,
            action_type: "APPEND" as any,
            bundle_id: bundleId,
          };
        });
        const { error } = await supabase.from("context_items").insert(rows);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      qc.invalidateQueries({ queryKey: ["bundles"] });
      const parts: string[] = [];
      if (selectedPrefs.size > 0) parts.push(`${selectedPrefs.size} preference${selectedPrefs.size !== 1 ? "s" : ""}`);
      if (selectedItems.size > 0) parts.push(`${selectedItems.size} context item${selectedItems.size !== 1 ? "s" : ""}`);
      if (selectedBundles.size > 0) parts.push(`${selectedBundles.size} bundle${selectedBundles.size !== 1 ? "s" : ""}`);
      toast({ title: "Import complete", description: `${parts.join(", ")} added to your knowledge graph.` });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!data) return null;

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
          <Badge variant="outline" className={`text-[${compact ? "9" : "10"}px] ${CATEGORY_COLORS[resolved.category] || ""}`}>
            {resolved.category}
          </Badge>
          {edits && Object.keys(edits).length > 0 && (
            <Badge variant="secondary" className="text-[9px]">edited</Badge>
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
            AI extracted {data.preferences.length} preferences, {data.context_items.length} standalone items, and {bundles.length} bundles.
            Select what to keep — hover any item to edit.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 -mx-6 px-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" /> Working Preferences ({data.preferences.length})
              </h3>
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Package className="h-3 w-3" /> Bundles ({bundles.length})
                {dragSource?.type === "standalone" && (
                  <span className="text-[10px] text-primary font-normal ml-1">↓ Drop items onto a bundle</span>
                )}
              </h3>
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
                        {bundle.scope_suggestion && (
                          <Badge variant="secondary" className="text-[9px] gap-0.5">
                            {bundle.scope_suggestion === "organization" ? <Globe className="h-2.5 w-2.5" /> : bundle.scope_suggestion === "team" ? <Users className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                            {bundle.scope_suggestion}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{bundle.description}</p>
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
                      {bundle.items.map((item, j) => (
                        <div key={j}>
                          {/* Drop zone before this item */}
                          <div
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, `bundle-${i}-before-${j}`); }}
                            onDragLeave={(e) => handleDragLeave(e, `bundle-${i}-before-${j}`)}
                            onDrop={(e) => { e.stopPropagation(); handleDropOnBundle(e, i, j); }}
                            className={`h-1 -mx-1 rounded transition-all ${
                              dropTarget === `bundle-${i}-before-${j}` ? "h-2 bg-primary/30 my-1" : "my-0.5"
                            }`}
                          />
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, { type: "bundle", bundleIdx: i, itemIdx: j })}
                            onDragEnd={handleDragEnd}
                            className="rounded border border-border/30 bg-background/50 p-2.5 cursor-grab active:cursor-grabbing flex items-start gap-2"
                          >
                            <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0 mt-1" />
                            {renderEditableItem(
                              item,
                              bundleItemEdits[`${i}-${j}`],
                              `bundle-${i}-${j}`,
                              (field, value) => updateBundleItemEdit(i, j, field, value),
                              true,
                            )}
                          </div>
                        </div>
                      ))}
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookUp className="h-3 w-3" /> Standalone Context Items ({data.context_items.length})
                {dragSource?.type === "bundle" && (
                  <span className="text-[10px] text-primary font-normal ml-1">↓ Drop here to make standalone</span>
                )}
              </h3>
              {data.context_items.map((ci, i) => (
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
              <div className="flex gap-1.5 flex-wrap">
                {["Make items more specific and detailed", "Split broad items into atomic pieces", "Recategorize — fix wrong categories", "Merge similar items together"].map(q => (
                  <button
                    key={q}
                    onClick={() => setRefineInstruction(q)}
                    className="text-[10px] px-2 py-1 rounded-full border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
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

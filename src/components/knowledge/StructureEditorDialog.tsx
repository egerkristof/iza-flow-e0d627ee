import { useState, useEffect, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight, ChevronDown, Layers, BookOpen, ListCheck,
  Merge, Trash2, Edit2, Check, X, ArrowRight, Sparkles,
  Info, AlertTriangle, MoveRight, GripVertical,
  Eye, Hash, Layout, Table2, GitBranch, Presentation, Brain,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ── Types ────────────────────────────────────────────────────────────────────

interface BlueprintProcedure {
  label: string;
  original_skeleton_label?: string;
}

interface BlueprintPlaybook {
  playbook_title: string;
  original_skeleton_labels: string[];
  procedures: BlueprintProcedure[];
  shared_knowledge_labels?: string[];
}

interface BlueprintBundle {
  bundle_title: string;
  bundle_description: string;
  original_skeleton_labels: string[];
  playbooks: BlueprintPlaybook[];
}

interface ConsolidationDecision {
  action: string;
  original_labels: string[];
  result_label: string;
  result_role: string;
  rationale: string;
  semantic_confidence: number;
}

interface OptimizationStats {
  original_sections: number;
  final_bundles: number;
  final_playbooks: number;
  merges_performed: number;
  reclassifications: number;
}

interface PrunedLabel {
  label: string;
  level: number;
  content_density: string;
}

interface PruningStats {
  raw_skeleton_count: number;
  pruned_to: number;
  pruned_labels?: PrunedLabel[];
}

export interface StructureEditorData {
  optimized_blueprint: BlueprintBundle[];
  consolidation_decisions?: ConsolidationDecision[];
  optimization_summary?: string;
  optimization_stats?: OptimizationStats;
  pruning_stats?: PruningStats;
  structure_type?: string;
  confidence?: string;
  total_sections_detected?: number;
  total_markers_detected?: number;
  markers_beyond_preview?: number;
  skeleton_layout_types?: Record<string, string>;
  notes?: string;
}

interface StructureEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: StructureEditorData | null;
  fileName: string;
  onConfirm: (editedData: StructureEditorData) => void;
  onSkip: () => void;
}

// ── Layout type helpers ──────────────────────────────────────────────────────

const LAYOUT_TYPE_META: Record<string, { icon: typeof Eye; label: string; color: string }> = {
  heading: { icon: Hash, label: "Text heading", color: "text-blue-400" },
  numbered: { icon: ListCheck, label: "Numbered section", color: "text-emerald-400" },
  visual_group: { icon: Eye, label: "Visual grouping", color: "text-violet-400" },
  table: { icon: Table2, label: "Table/matrix", color: "text-amber-400" },
  diagram: { icon: GitBranch, label: "Diagram/flowchart", color: "text-pink-400" },
  slide_divider: { icon: Presentation, label: "Slide divider", color: "text-cyan-400" },
  implicit: { icon: Brain, label: "Semantically inferred", color: "text-orange-400" },
};

function getLayoutTypesForPlaybook(
  skeletonLabels: string[],
  layoutTypes?: Record<string, string>,
): string[] {
  if (!layoutTypes) return [];
  const types = new Set<string>();
  for (const label of skeletonLabels) {
    const lt = layoutTypes[label];
    if (lt) types.add(lt);
  }
  return Array.from(types);
}

// ── Component ────────────────────────────────────────────────────────────────

export function StructureEditorDialog({
  open, onOpenChange, data, fileName, onConfirm, onSkip,
}: StructureEditorDialogProps) {
  const [blueprint, setBlueprint] = useState<BlueprintBundle[]>([]);
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());
  const [editingTitle, setEditingTitle] = useState<{ type: "bundle" | "playbook"; bundleIdx: number; playbookIdx?: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dragState, setDragState] = useState<{ bundleIdx: number; playbookIdx: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ bundleIdx: number; playbookIdx: number } | null>(null);

  useEffect(() => {
    if (data?.optimized_blueprint) {
      setBlueprint(JSON.parse(JSON.stringify(data.optimized_blueprint)));
      // Expand first 3 bundles by default
      setExpandedBundles(new Set(data.optimized_blueprint.map((_, i) => i).slice(0, 3)));
    }
  }, [data]);

  const stats = useMemo(() => {
    const totalPlaybooks = blueprint.reduce((sum, b) => sum + b.playbooks.length, 0);
    const totalProcedures = blueprint.reduce(
      (sum, b) => sum + b.playbooks.reduce((s, p) => s + p.procedures.length, 0), 0,
    );
    return { bundles: blueprint.length, playbooks: totalPlaybooks, procedures: totalProcedures };
  }, [blueprint]);

  const toggleBundle = (idx: number) => {
    setExpandedBundles(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // ── Merge two bundles ──────────────────────────────────────────────────────
  const mergeBundles = (sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    setBlueprint(prev => {
      const next = [...prev];
      const source = next[sourceIdx];
      const target = next[targetIdx];
      // Merge playbooks from source into target
      target.playbooks = [...target.playbooks, ...source.playbooks];
      target.original_skeleton_labels = [...target.original_skeleton_labels, ...source.original_skeleton_labels];
      target.bundle_description += ` ${source.bundle_description}`;
      // Remove source
      next.splice(sourceIdx, 1);
      return next;
    });
  };

  // ── Remove a bundle ────────────────────────────────────────────────────────
  const removeBundle = (idx: number) => {
    setBlueprint(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Remove a playbook ──────────────────────────────────────────────────────
  const removePlaybook = (bundleIdx: number, playbookIdx: number) => {
    setBlueprint(prev => {
      const next = [...prev];
      next[bundleIdx] = {
        ...next[bundleIdx],
        playbooks: next[bundleIdx].playbooks.filter((_, i) => i !== playbookIdx),
      };
      return next;
    });
  };

  // ── Rename ─────────────────────────────────────────────────────────────────
  const startEdit = (type: "bundle" | "playbook", bundleIdx: number, playbookIdx?: number) => {
    const val = type === "bundle"
      ? blueprint[bundleIdx].bundle_title
      : blueprint[bundleIdx].playbooks[playbookIdx!].playbook_title;
    setEditingTitle({ type, bundleIdx, playbookIdx });
    setEditValue(val);
  };

  const confirmEdit = () => {
    if (!editingTitle || !editValue.trim()) return;
    setBlueprint(prev => {
      const next = [...prev];
      if (editingTitle.type === "bundle") {
        next[editingTitle.bundleIdx] = { ...next[editingTitle.bundleIdx], bundle_title: editValue.trim() };
      } else {
        const playbooks = [...next[editingTitle.bundleIdx].playbooks];
        playbooks[editingTitle.playbookIdx!] = { ...playbooks[editingTitle.playbookIdx!], playbook_title: editValue.trim() };
        next[editingTitle.bundleIdx] = { ...next[editingTitle.bundleIdx], playbooks };
      }
      return next;
    });
    setEditingTitle(null);
  };

  const cancelEdit = () => setEditingTitle(null);

  // ── Move playbook between bundles ──────────────────────────────────────────
  const movePlaybook = (fromBundle: number, playbookIdx: number, toBundle: number) => {
    if (fromBundle === toBundle) return;
    setBlueprint(prev => {
      const next = [...prev];
      const pb = next[fromBundle].playbooks[playbookIdx];
      next[fromBundle] = {
        ...next[fromBundle],
        playbooks: next[fromBundle].playbooks.filter((_, i) => i !== playbookIdx),
      };
      next[toBundle] = {
        ...next[toBundle],
        playbooks: [...next[toBundle].playbooks, pb],
      };
      return next;
    });
  };

  // ── Reorder playbooks within a bundle via drag-and-drop ────────────────
  const reorderPlaybook = (bundleIdx: number, fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    setBlueprint(prev => {
      const next = [...prev];
      const playbooks = [...next[bundleIdx].playbooks];
      const [moved] = playbooks.splice(fromIdx, 1);
      playbooks.splice(toIdx, 0, moved);
      next[bundleIdx] = { ...next[bundleIdx], playbooks };
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, bundleIdx: number, playbookIdx: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${bundleIdx}:${playbookIdx}`);
    setDragState({ bundleIdx, playbookIdx });
  };

  const handleDragOver = (e: React.DragEvent, bundleIdx: number, playbookIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget({ bundleIdx, playbookIdx });
  };

  const handleDrop = (e: React.DragEvent, bundleIdx: number, playbookIdx: number) => {
    e.preventDefault();
    if (!dragState) return;
    if (dragState.bundleIdx === bundleIdx) {
      reorderPlaybook(bundleIdx, dragState.playbookIdx, playbookIdx);
    } else {
      // Cross-bundle: move playbook then reinsert at drop position
      setBlueprint(prev => {
        const next = [...prev];
        const pb = next[dragState.bundleIdx].playbooks[dragState.playbookIdx];
        next[dragState.bundleIdx] = {
          ...next[dragState.bundleIdx],
          playbooks: next[dragState.bundleIdx].playbooks.filter((_, i) => i !== dragState.playbookIdx),
        };
        const targetPlaybooks = [...next[bundleIdx].playbooks];
        targetPlaybooks.splice(playbookIdx, 0, pb);
        next[bundleIdx] = { ...next[bundleIdx], playbooks: targetPlaybooks };
        return next;
      });
    }
    setDragState(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDragState(null);
    setDropTarget(null);
  };

  const handleConfirm = () => {
    if (!data) return;
    onConfirm({
      ...data,
      optimized_blueprint: blueprint,
      optimization_stats: {
        ...(data.optimization_stats || { original_sections: 0, merges_performed: 0, reclassifications: 0 }),
        final_bundles: stats.bundles,
        final_playbooks: stats.playbooks,
      },
    });
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col border-border/50 bg-card overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-primary" />
            Review Structure Blueprint
          </DialogTitle>
          <DialogDescription className="text-xs">
            The AI detected and optimized the document structure below. You can rename, merge, or remove bundles and playbooks before extraction begins.
          </DialogDescription>
        </DialogHeader>

        {/* Summary bar */}
        <div className="flex flex-wrap items-center gap-3 px-1">
          <Badge variant="secondary" className="text-xs gap-1">
            <Layers className="h-3 w-3" /> {stats.bundles} bundles
          </Badge>
          <Badge variant="secondary" className="text-xs gap-1">
            <BookOpen className="h-3 w-3" /> {stats.playbooks} playbooks
          </Badge>
          <Badge variant="secondary" className="text-xs gap-1">
            <ListCheck className="h-3 w-3" /> {stats.procedures} procedures
          </Badge>
          {data.optimization_stats?.merges_performed ? (
            <Badge variant="outline" className="text-xs gap-1 border-amber-500/30 text-amber-400">
              <Merge className="h-3 w-3" /> {data.optimization_stats.merges_performed} merges applied
            </Badge>
          ) : null}
          {data.pruning_stats && data.pruning_stats.pruned_to < data.pruning_stats.raw_skeleton_count && (
            <Badge variant="outline" className="text-xs gap-1 border-orange-500/30 text-orange-400">
              <AlertTriangle className="h-3 w-3" /> {data.pruning_stats.raw_skeleton_count - data.pruning_stats.pruned_to} pruned
            </Badge>
          )}
          {(data.markers_beyond_preview ?? 0) > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs gap-1 border-primary/30 text-primary">
                    <Info className="h-3 w-3" /> {data.markers_beyond_preview} markers beyond preview
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{data.markers_beyond_preview} structural headings were detected beyond the content preview window ({data.total_markers_detected} total markers across the full document)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto truncate max-w-[200px]">{fileName}</span>
        </div>

        {/* Consolidation decisions summary */}
        {data.consolidation_decisions && data.consolidation_decisions.filter(d => d.action !== "keep_as_is").length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-1">
              <Info className="h-3 w-3" />
              <span>{data.consolidation_decisions.filter(d => d.action !== "keep_as_is").length} optimization decisions made</span>
              <ChevronRight className="h-3 w-3" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1.5 px-1">
              <div className="rounded-md border border-border/50 bg-muted/20 p-2 space-y-1.5 max-h-32 overflow-y-auto">
                {data.consolidation_decisions.filter(d => d.action !== "keep_as_is").map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px]">
                    <Badge variant="outline" className="text-[9px] shrink-0 mt-0.5">{d.action}</Badge>
                    <span className="text-muted-foreground">
                      {d.original_labels.join(" + ")} <ArrowRight className="h-2.5 w-2.5 inline mx-0.5" /> 
                      <span className="text-foreground font-medium">{d.result_label}</span>
                      <span className="text-muted-foreground/70"> — {d.rationale}</span>
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Pruned sections detail */}
        {data.pruning_stats?.pruned_labels && data.pruning_stats.pruned_labels.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors px-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{data.pruning_stats.pruned_labels.length} sections pruned before optimization</span>
              <ChevronRight className="h-3 w-3" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1.5 px-1">
              <div className="rounded-md border border-orange-500/20 bg-orange-500/5 p-2 space-y-1 max-h-40 overflow-y-auto">
                <p className="text-[10px] text-muted-foreground mb-1.5">
                  Raw skeleton had {data.pruning_stats.raw_skeleton_count} entries — capped to {data.pruning_stats.pruned_to} for AI context limits. These low-density deep sections were excluded:
                </p>
                {data.pruning_stats.pruned_labels.map((pl, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground/60 w-4 text-right shrink-0">L{pl.level}</span>
                    <span className="text-foreground/80 truncate flex-1">{pl.label}</span>
                    <Badge variant="outline" className="text-[8px] shrink-0 h-4 px-1">{pl.content_density}</Badge>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Blueprint tree */}
        <ScrollArea className="flex-1 min-h-0 -mx-6 px-6" style={{ overflow: 'auto' }}>
          <div className="space-y-2 pb-4">
            {blueprint.map((bundle, bi) => (
              <div key={bi} className="rounded-lg border border-border/50 bg-muted/10">
                <Collapsible open={expandedBundles.has(bi)} onOpenChange={() => toggleBundle(bi)}>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0">
                        {expandedBundles.has(bi) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </Button>
                    </CollapsibleTrigger>

                    <Layers className="h-3.5 w-3.5 text-primary shrink-0" />

                    {editingTitle?.type === "bundle" && editingTitle.bundleIdx === bi ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="h-6 text-xs"
                          autoFocus
                          onKeyDown={e => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") cancelEdit(); }}
                        />
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={confirmEdit}><Check className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={cancelEdit}><X className="h-3 w-3" /></Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium flex-1 truncate">{bundle.bundle_title}</span>
                    )}

                    <Badge variant="secondary" className="text-[9px]">{bundle.playbooks.length} PB</Badge>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => startEdit("bundle", bi)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p className="text-xs">Rename bundle</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {blueprint.length > 1 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive/60 hover:text-destructive" onClick={() => removeBundle(bi)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top"><p className="text-xs">Remove bundle</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {blueprint.length > 1 && bi > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-amber-400/60 hover:text-amber-400"
                              onClick={() => mergeBundles(bi, bi - 1)}
                            >
                              <Merge className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top"><p className="text-xs">Merge into "{blueprint[bi - 1].bundle_title}"</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  <CollapsibleContent>
                    <div className="border-t border-border/30 px-3 py-1.5">
                      <p className="text-[10px] text-muted-foreground mb-2">{bundle.bundle_description}</p>
                      <div className="space-y-1.5">
                        {bundle.playbooks.map((pb, pi) => (
                          <div
                            key={pi}
                            draggable
                            onDragStart={e => handleDragStart(e, bi, pi)}
                            onDragOver={e => handleDragOver(e, bi, pi)}
                            onDrop={e => handleDrop(e, bi, pi)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 group cursor-grab active:cursor-grabbing transition-all ${
                              dropTarget?.bundleIdx === bi && dropTarget?.playbookIdx === pi
                                ? "ring-1 ring-primary/50 bg-primary/5"
                                : ""
                            } ${
                              dragState?.bundleIdx === bi && dragState?.playbookIdx === pi
                                ? "opacity-40"
                                : ""
                            }`}
                          >
                            <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                            <BookOpen className="h-3 w-3 text-orange-400 shrink-0" />

                            {editingTitle?.type === "playbook" && editingTitle.bundleIdx === bi && editingTitle.playbookIdx === pi ? (
                              <div className="flex items-center gap-1 flex-1">
                                <Input
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  className="h-5 text-[11px]"
                                  autoFocus
                                  onKeyDown={e => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") cancelEdit(); }}
                                />
                                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={confirmEdit}><Check className="h-2.5 w-2.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={cancelEdit}><X className="h-2.5 w-2.5" /></Button>
                              </div>
                            ) : (
                              <span className="text-xs flex-1 truncate">{pb.playbook_title}</span>
                            )}

                            <Badge variant="outline" className="text-[9px]">{pb.procedures.length} steps</Badge>
                            {getLayoutTypesForPlaybook(pb.original_skeleton_labels, data.skeleton_layout_types).map(lt => {
                              const meta = LAYOUT_TYPE_META[lt];
                              if (!meta) return null;
                              const Icon = meta.icon;
                              return (
                                <TooltipProvider key={lt}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className={`${meta.color}`}><Icon className="h-3 w-3" /></span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top"><p className="text-xs">{meta.label}</p></TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}

                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => startEdit("playbook", bi, pi)}>
                                <Edit2 className="h-2.5 w-2.5" />
                              </Button>
                              {blueprint.length > 1 && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary/60 hover:text-primary">
                                      <MoveRight className="h-2.5 w-2.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent side="right" align="start" className="z-50 bg-popover border-border min-w-[160px]">
                                    {blueprint.map((targetBundle, ti) =>
                                      ti !== bi ? (
                                        <DropdownMenuItem
                                          key={ti}
                                          className="text-xs gap-2 cursor-pointer"
                                          onClick={() => movePlaybook(bi, pi, ti)}
                                        >
                                          <Layers className="h-3 w-3 text-primary shrink-0" />
                                          <span className="truncate">{targetBundle.bundle_title}</span>
                                        </DropdownMenuItem>
                                      ) : null,
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              {bundle.playbooks.length > 1 && (
                                <Button variant="ghost" size="icon" className="h-4 w-4 text-destructive/60 hover:text-destructive" onClick={() => removePlaybook(bi, pi)}>
                                  <Trash2 className="h-2.5 w-2.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        {bundle.playbooks.length === 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 px-2">
                            <AlertTriangle className="h-3 w-3" />
                            <span>No playbooks — this bundle will be context-only</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row justify-between gap-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={onSkip}>
            Skip review
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => {
              if (data?.optimized_blueprint) {
                setBlueprint(JSON.parse(JSON.stringify(data.optimized_blueprint)));
              }
            }}>
              Reset
            </Button>
            <Button size="sm" className="text-xs gap-1" onClick={handleConfirm}>
              <Sparkles className="h-3 w-3" /> Confirm & Extract
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

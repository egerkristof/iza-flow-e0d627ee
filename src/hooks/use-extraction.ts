import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ExtractionResult, ExtractionDepth, AdvisorPersona, BundleMatch } from "@/lib/knowledge-schema";
import type { StructureEditorData } from "@/components/knowledge/StructureEditorDialog";

interface UseExtractionOptions {
  onResult: (data: ExtractionResult, sourceName: string) => void;
}

/**
 * Hook that encapsulates the full extraction flow:
 * - Quick Scan: direct extraction
 * - Guided Extract: generate advisor → extract with advisor context
 * - Deep Analysis: generate advisor → extract with advisor + deep mode
 * 
 * After structure optimization, pauses to let the user review/edit
 * the blueprint via the StructureEditorDialog before proceeding.
 *
 * After extraction, runs the bundle matcher to find existing bundle overlaps.
 * High-confidence matches (≥0.9) auto-tag bundles; lower ones show as suggestions.
 */
export function useExtraction({ onResult }: UseExtractionOptions) {
  const { toast } = useToast();
  const [extracting, setExtracting] = useState(false);
  const [depth, setDepth] = useState<ExtractionDepth>("guided");
  const [advisorPhase, setAdvisorPhase] = useState<"idle" | "detecting-structure" | "optimizing-structure" | "generating-advisor" | "extracting" | "matching">("idle");
  const [chunkProgress, setChunkProgress] = useState<{ current: number; total: number } | null>(null);

  // Structure editor pause state
  const [pendingStructure, setPendingStructure] = useState<StructureEditorData | null>(null);
  const [pendingFileName, setPendingFileName] = useState("");
  const [structureEditorOpen, setStructureEditorOpen] = useState(false);

  // Stash extraction context so we can resume after editor confirmation
  const pendingExtraction = useRef<{
    body: Record<string, any>;
    sourceName: string;
    advisorPersona: AdvisorPersona | null;
    rawStructure: any;
  } | null>(null);

  // ── Resume extraction after structure editor confirm/skip ────────────
  const resumeExtraction = useCallback(async (
    editedStructure: StructureEditorData | null,
  ) => {
    setStructureEditorOpen(false);
    setPendingStructure(null);

    const pending = pendingExtraction.current;
    if (!pending) return;
    pendingExtraction.current = null;

    const { body, sourceName, advisorPersona, rawStructure } = pending;

    // Build final documentStructure from edited or raw
    const documentStructure = editedStructure
      ? {
          ...rawStructure,
          optimized_blueprint: editedStructure.optimized_blueprint,
          consolidation_decisions: editedStructure.consolidation_decisions,
          optimization_summary: editedStructure.optimization_summary,
          optimization_stats: editedStructure.optimization_stats,
        }
      : rawStructure;

    try {
      await runExtraction(body, sourceName, advisorPersona, documentStructure);
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      setExtracting(false);
      setAdvisorPhase("idle");
      setChunkProgress(null);
    }
  }, [toast]);

  const handleStructureConfirm = useCallback((edited: StructureEditorData) => {
    resumeExtraction(edited);
  }, [resumeExtraction]);

  const handleStructureSkip = useCallback(() => {
    resumeExtraction(null);
  }, [resumeExtraction]);

  // ── Core extraction (advisor → extract → match) ─────────────────────
  const runExtraction = async (
    body: Record<string, any>,
    sourceName: string,
    advisorPersona: AdvisorPersona | null,
    documentStructure: any,
  ) => {
    // For guided/deep: generate advisor if not already done
    if (depth !== "quick" && !advisorPersona) {
      setAdvisorPhase("generating-advisor");
      const contentPreview = body.content || body.documentId || "";
      const { data: advisorData, error: advisorError } = await supabase.functions.invoke("generate-advisor", {
        body: {
          content: typeof contentPreview === "string" ? contentPreview : sourceName,
          meta: body.meta || { title: sourceName },
        },
      });
      if (!advisorError && advisorData && !advisorData.error) {
        advisorPersona = advisorData as AdvisorPersona;
      }
    }

    setAdvisorPhase("extracting");
    setChunkProgress(null);

    const session = (await supabase.auth.getSession()).data.session;
    const extractBody = {
      ...body,
      extraction_depth: depth,
      ...(advisorPersona ? { advisor_persona: advisorPersona } : {}),
      ...(documentStructure ? { document_structure: documentStructure } : {}),
    };

    const extractRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-knowledge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(extractBody),
      },
    );

    if (!extractRes.ok) {
      const errText = await extractRes.text();
      throw new Error(errText || `Extraction failed (${extractRes.status})`);
    }

    let extracted: ExtractionResult;
    const contentType = extractRes.headers.get("content-type") || "";

    if (contentType.includes("text/event-stream")) {
      const reader = extractRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let result: ExtractionResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const jsonStr = part.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === "chunk_progress") {
              setChunkProgress({ current: parsed.current, total: parsed.total });
            } else if (parsed.type === "result") {
              result = parsed.data as ExtractionResult;
            } else if (parsed.type === "error") {
              throw new Error(parsed.error);
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== jsonStr) throw parseErr;
            console.warn("Failed to parse SSE event:", jsonStr);
          }
        }
      }

      if (!result) throw new Error("No extraction result received");
      extracted = result;
    } else {
      const data = await extractRes.json();
      if (data?.error) throw new Error(data.error);
      extracted = data as ExtractionResult;
    }

    if (documentStructure) {
      extracted.document_structure = documentStructure;
    }

    // ── Bundle Matching Pass ──────────────────────────────────────────
    if (extracted.bundles && extracted.bundles.length > 0) {
      setAdvisorPhase("matching");
      try {
        const { data: matchResult, error: matchErr } = await supabase.functions.invoke("match-bundles", {
          body: {
            extracted_bundles: extracted.bundles.map(b => ({
              title: b.title,
              description: b.description,
              items: b.items.map(it => ({ title: it.title, category: it.category })),
            })),
          },
        });

        if (!matchErr && matchResult && !matchResult.error && matchResult.matches) {
          extracted.bundle_matches = matchResult.matches as BundleMatch[];

          const consolidations = (matchResult.matches as BundleMatch[])
            .filter(m => m.match_type === "consolidate" && m.confidence >= 0.9 && m.consolidate_with?.length);

          if (consolidations.length > 0) {
            const merged = new Set<number>();
            const newBundles = [...extracted.bundles];
            
            for (const c of consolidations) {
              if (merged.has(c.extracted_index)) continue;
              const targets = (c.consolidate_with || []).filter(i => !merged.has(i));
              if (targets.length === 0) continue;

              for (const t of targets) {
                if (t < newBundles.length) {
                  newBundles[c.extracted_index] = {
                    ...newBundles[c.extracted_index],
                    title: c.suggested_merged_title || newBundles[c.extracted_index].title,
                    items: [...newBundles[c.extracted_index].items, ...newBundles[t].items],
                  };
                  merged.add(t);
                }
              }
            }

            const mergedIndices = [...merged].sort((a, b) => b - a);
            for (const idx of mergedIndices) {
              newBundles.splice(idx, 1);
            }

            if (merged.size > 0) {
              extracted.bundles = newBundles;
              extracted.bundle_matches = (matchResult.matches as BundleMatch[])
                .filter(m => !merged.has(m.extracted_index));
            }
          }
        }
      } catch (matchError) {
        console.warn("Bundle matching failed (non-fatal):", matchError);
      }
    }

    onResult(extracted, sourceName);
  };

  const extract = useCallback(async (
    body: Record<string, any>,
    sourceName: string,
  ) => {
    setExtracting(true);
    setAdvisorPhase("idle");
    setChunkProgress(null);

    try {
      let advisorPersona: AdvisorPersona | null = null;
      let documentStructure: any = null;

      // ── Pass 1: Structure Detection ──────────────────────────────────
      const isDocumentSource = !body.source_type || body.source_type === "document" || body.source_type === "loom";
      if (isDocumentSource) {
        setAdvisorPhase("detecting-structure");
        try {
          const structureBody: Record<string, any> = {};
          if (body.documentId) structureBody.documentId = body.documentId;
          else if (body.content) structureBody.content = body.content;

          const session = (await supabase.auth.getSession()).data.session;
          const STRUCTURE_TIMEOUT = 5 * 60 * 1000; // 5 minutes for large PDFs

          // Use raw fetch with extended timeout — supabase.functions.invoke times out on large PDFs
          const structController = new AbortController();
          const structTimer = setTimeout(() => structController.abort(), STRUCTURE_TIMEOUT);

          const structRes = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-structure`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              },
              body: JSON.stringify(structureBody),
              signal: structController.signal,
            },
          );
          clearTimeout(structTimer);

          const structData = structRes.ok ? await structRes.json() : null;
          const structError = !structRes.ok || !structData || structData.error;
          if (!structError && structData && !structData.error && structData.confidence !== "low") {
            console.log(`Structure detected: type=${structData.structure_type}, confidence=${structData.confidence}, sections=${structData.total_sections_detected}`);

            // ── Pass 1.5: Semantic Structure Optimization ──────────────────
            setAdvisorPhase("optimizing-structure");
            try {
              const optimizeBody: Record<string, any> = { skeleton: structData };
              if (body.content) {
                optimizeBody.content_preview = typeof body.content === "string"
                  ? body.content.slice(0, 60000)
                  : "";
              }
              // For PDF documents, pass documentId so optimizer can fetch content
              if (body.documentId) {
                optimizeBody.documentId = body.documentId;
              }

              const optController = new AbortController();
              const optTimer = setTimeout(() => optController.abort(), STRUCTURE_TIMEOUT);

              const optRes = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/optimize-structure`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                  },
                  body: JSON.stringify(optimizeBody),
                  signal: optController.signal,
                },
              );
              clearTimeout(optTimer);

              const optData = optRes.ok ? await optRes.json() : null;
              const optError = !optRes.ok || !optData || optData.error;

              if (!optError && optData && !optData.error && !optData.fallback) {
                documentStructure = {
                  ...structData,
                  optimized_blueprint: optData.optimized_blueprint,
                  consolidation_decisions: optData.consolidation_decisions,
                  optimization_summary: optData.optimization_summary,
                  optimization_stats: optData.stats,
                };
                console.log(`Structure optimized: bundles=${optData.stats?.final_bundles}, playbooks=${optData.stats?.final_playbooks}, merges=${optData.stats?.merges_performed}`);

                // ── Pause for Structure Editor ──────────────────────────────
                // Generate advisor in parallel while user reviews structure
                if (depth !== "quick") {
                  setAdvisorPhase("generating-advisor");
                  const contentPreview = body.content || body.documentId || "";
                  const { data: advisorData, error: advisorError } = await supabase.functions.invoke("generate-advisor", {
                    body: {
                      content: typeof contentPreview === "string" ? contentPreview : sourceName,
                      meta: body.meta || { title: sourceName },
                    },
                  });
                  if (!advisorError && advisorData && !advisorData.error) {
                    advisorPersona = advisorData as AdvisorPersona;
                  }
                }

                // Stash context and show editor
                pendingExtraction.current = {
                  body,
                  sourceName,
                  advisorPersona,
                  rawStructure: structData,
                };

                // Build layout_type map from raw skeleton
                const skeletonLayoutTypes: Record<string, string> = {};
                if (structData.skeleton && Array.isArray(structData.skeleton)) {
                  for (const entry of structData.skeleton) {
                    if (entry.label && entry.layout_type) {
                      skeletonLayoutTypes[entry.label] = entry.layout_type;
                    }
                  }
                }

                const editorData: StructureEditorData = {
                  optimized_blueprint: optData.optimized_blueprint,
                  consolidation_decisions: optData.consolidation_decisions,
                  optimization_summary: optData.optimization_summary,
                  optimization_stats: optData.stats,
                  pruning_stats: optData.pruning_stats || undefined,
                  structure_type: structData.structure_type,
                  confidence: structData.confidence,
                  total_sections_detected: structData.total_sections_detected,
                  total_markers_detected: structData.total_markers_detected,
                  markers_beyond_preview: structData.markers_beyond_preview,
                  skeleton_layout_types: skeletonLayoutTypes,
                  notes: structData.notes,
                };

                setPendingStructure(editorData);
                setPendingFileName(sourceName);
                setStructureEditorOpen(true);
                // Don't setExtracting(false) — keep spinner state; 
                // resumeExtraction will handle cleanup
                return;
              } else {
                documentStructure = structData;
                console.log("Structure optimization returned fallback — using raw skeleton");
              }
            } catch (optErr) {
              documentStructure = structData;
              console.warn("Structure optimization failed (non-fatal):", optErr);
            }
          } else {
            console.log("Structure detection returned low confidence or failed — using heuristic extraction");
          }
        } catch (structErr) {
          console.warn("Structure detection failed (non-fatal):", structErr);
        }
      }

      // No structure editor pause — proceed directly
      await runExtraction(body, sourceName, advisorPersona, documentStructure);
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      // Only clean up if we're not waiting for structure editor
      if (!pendingExtraction.current) {
        setExtracting(false);
        setAdvisorPhase("idle");
        setChunkProgress(null);
      }
    }
  }, [depth, onResult, toast]);

  return {
    extract,
    extracting,
    depth,
    setDepth,
    advisorPhase,
    chunkProgress,
    // Structure editor state
    structureEditorOpen,
    setStructureEditorOpen,
    pendingStructure,
    pendingFileName,
    handleStructureConfirm,
    handleStructureSkip,
  };
}

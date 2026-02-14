import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ExtractionResult, ExtractionDepth, AdvisorPersona, BundleMatch } from "@/lib/knowledge-schema";

interface UseExtractionOptions {
  onResult: (data: ExtractionResult, sourceName: string) => void;
}

/**
 * Hook that encapsulates the full extraction flow:
 * - Quick Scan: direct extraction
 * - Guided Extract: generate advisor → extract with advisor context
 * - Deep Analysis: generate advisor → extract with advisor + deep mode
 * 
 * After extraction, runs the bundle matcher to find existing bundle overlaps.
 * High-confidence matches (≥0.9) auto-tag bundles; lower ones show as suggestions.
 */
export function useExtraction({ onResult }: UseExtractionOptions) {
  const { toast } = useToast();
  const [extracting, setExtracting] = useState(false);
  const [depth, setDepth] = useState<ExtractionDepth>("guided");
  const [advisorPhase, setAdvisorPhase] = useState<"idle" | "generating-advisor" | "extracting" | "matching">("idle");

  const extract = useCallback(async (
    body: Record<string, any>,
    sourceName: string,
  ) => {
    setExtracting(true);
    setAdvisorPhase("idle");

    try {
      let advisorPersona: AdvisorPersona | null = null;

      // For guided/deep: generate advisor first
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
        // Advisor generation is best-effort — continue even if it fails
      }

      setAdvisorPhase("extracting");
      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          ...body,
          extraction_depth: depth,
          ...(advisorPersona ? { advisor_persona: advisorPersona } : {}),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const extracted = data as ExtractionResult;

      // ── Bundle Matching Pass ──────────────────────────────────────────
      // Run the matcher if we have extracted bundles
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

            // Auto-apply high-confidence matches: merge extracted bundles that 
            // the AI says should be consolidated (confidence ≥ 0.9)
            const consolidations = (matchResult.matches as BundleMatch[])
              .filter(m => m.match_type === "consolidate" && m.confidence >= 0.9 && m.consolidate_with?.length);

            if (consolidations.length > 0) {
              // Build merge groups
              const merged = new Set<number>();
              const newBundles = [...extracted.bundles];
              
              for (const c of consolidations) {
                if (merged.has(c.extracted_index)) continue;
                const targets = (c.consolidate_with || []).filter(i => !merged.has(i));
                if (targets.length === 0) continue;

                // Merge items from target bundles into the primary
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

              // Remove merged bundles (iterate in reverse to preserve indices)
              const mergedIndices = [...merged].sort((a, b) => b - a);
              for (const idx of mergedIndices) {
                newBundles.splice(idx, 1);
              }

              if (merged.size > 0) {
                extracted.bundles = newBundles;
                // Reindex matches after consolidation
                extracted.bundle_matches = (matchResult.matches as BundleMatch[])
                  .filter(m => !merged.has(m.extracted_index));
              }
            }
          }
        } catch (matchError) {
          // Bundle matching is best-effort — don't fail the extraction
          console.warn("Bundle matching failed (non-fatal):", matchError);
        }
      }

      onResult(extracted, sourceName);
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      setExtracting(false);
      setAdvisorPhase("idle");
    }
  }, [depth, onResult, toast]);

  return {
    extract,
    extracting,
    depth,
    setDepth,
    advisorPhase,
  };
}

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ExtractionResult, ExtractionDepth, AdvisorPersona } from "@/lib/knowledge-schema";

interface UseExtractionOptions {
  onResult: (data: ExtractionResult, sourceName: string) => void;
}

/**
 * Hook that encapsulates the full extraction flow:
 * - Quick Scan: direct extraction
 * - Guided Extract: generate advisor → extract with advisor context
 * - Deep Analysis: generate advisor → extract with advisor + deep mode
 */
export function useExtraction({ onResult }: UseExtractionOptions) {
  const { toast } = useToast();
  const [extracting, setExtracting] = useState(false);
  const [depth, setDepth] = useState<ExtractionDepth>("guided");
  const [advisorPhase, setAdvisorPhase] = useState<"idle" | "generating-advisor" | "extracting">("idle");

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

      onResult(data as ExtractionResult, sourceName);
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

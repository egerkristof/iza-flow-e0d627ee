import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ExtractionResult {
  analysis_notes: string;
  preferences: any[];
  context_items: any[];
  bundles: any[];
  advisor?: any;
  extraction_depth?: string;
  chunk_info?: { total: number; processed: number };
  document_structure?: any;
}

function mergeExtractionResults(results: ExtractionResult[]): ExtractionResult {
  if (results.length === 1) return results[0];

  const merged: ExtractionResult = {
    analysis_notes: results.map((r, i) => `[Chunk ${i + 1}] ${r.analysis_notes}`).join("\n\n"),
    preferences: [],
    context_items: [],
    bundles: [],
  };

  // Deduplicate preferences by key+value
  const prefSet = new Set<string>();
  for (const r of results) {
    for (const p of (r.preferences || [])) {
      const key = `${p.preference_key}::${p.preference_value}`;
      if (!prefSet.has(key)) {
        prefSet.add(key);
        merged.preferences.push(p);
      }
    }
  }

  // Deduplicate standalone items by title
  const itemTitleSet = new Set<string>();
  for (const r of results) {
    for (const item of (r.context_items || [])) {
      const normTitle = item.title.toLowerCase().trim();
      if (!itemTitleSet.has(normTitle)) {
        itemTitleSet.add(normTitle);
        merged.context_items.push(item);
      }
    }
  }

  // Merge bundles: combine bundles with matching titles
  const bundleMap = new Map<string, any>();

  for (const r of results) {
    for (const bundle of (r.bundles || [])) {
      const normTitle = bundle.title.toLowerCase().trim();
      
      if (bundleMap.has(normTitle)) {
        const existing = bundleMap.get(normTitle)!;
        const existingItemTitles = new Set(
          existing.items.map((it: any) => it.title.toLowerCase().trim())
        );
        
        for (const item of (bundle.items || [])) {
          if (!existingItemTitles.has(item.title.toLowerCase().trim())) {
            existing.items.push(item);
            existingItemTitles.add(item.title.toLowerCase().trim());
          }
        }

        // Upgrade completeness if later chunk had more
        const completenessRank: Record<string, number> = { skeleton: 0, partial: 1, full: 2 };
        if ((completenessRank[bundle.content_completeness] || 0) > (completenessRank[existing.content_completeness] || 0)) {
          existing.content_completeness = bundle.content_completeness;
        }

        // Merge coverage gaps
        const gapSet = new Set(existing.coverage_gaps || []);
        for (const gap of (bundle.coverage_gaps || [])) {
          gapSet.add(gap);
        }
        existing.coverage_gaps = [...gapSet];

        // Append description if different
        if (bundle.description && !existing.description.includes(bundle.description)) {
          existing.description += " " + bundle.description;
        }
      } else {
        bundleMap.set(normTitle, { ...bundle });
      }
    }
  }

  merged.bundles = [...bundleMap.values()];

  // Copy advisor and depth from first result
  if (results[0].advisor) merged.advisor = results[0].advisor;
  if (results[0].extraction_depth) merged.extraction_depth = results[0].extraction_depth;

  return merged;
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { chunk_results, advisor_persona, extraction_depth, total_chunks } = body;

    if (!chunk_results || !Array.isArray(chunk_results) || chunk_results.length === 0) {
      throw new Error("chunk_results array required");
    }

    const merged = mergeExtractionResults(chunk_results);
    if (advisor_persona) merged.advisor = advisor_persona;
    if (extraction_depth) merged.extraction_depth = extraction_depth;
    merged.analysis_notes = `[Chunked extraction: ${chunk_results.length} chunks processed (of ${total_chunks || chunk_results.length} total)]\n\n${merged.analysis_notes}`;
    merged.chunk_info = { total: total_chunks || chunk_results.length, processed: chunk_results.length };

    return new Response(JSON.stringify(merged), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("merge-extraction error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

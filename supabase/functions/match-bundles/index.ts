import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * match-bundles — Semantic bundle matching engine.
 * 
 * Given a set of extracted bundles (from extraction or chat capture),
 * compares them against the user's existing bundles and returns match
 * suggestions with confidence scores.
 * 
 * High-confidence matches (≥0.9) can be auto-merged by the client.
 * Lower-confidence matches are shown as suggestions in Import Copilot.
 */

const SYSTEM_PROMPT = `You are a **Bundle Matching Engine** for a knowledge management system. Your job is to compare newly extracted bundles against a user's existing bundles and determine semantic matches.

## TASK
For each extracted bundle, determine if it semantically overlaps with any existing bundle. Consider:
1. **Title similarity** — Do the titles describe the same domain/phase/topic?
2. **Description overlap** — Do descriptions cover the same scope?
3. **Item content alignment** — Would the items naturally belong together?
4. **Phase/stage identity** — Do they represent the same phase in a process?

## MATCHING RULES
- **confidence ≥ 0.9**: Strong match — the bundles describe the SAME topic/phase and should be merged
- **confidence 0.7–0.89**: Likely match — similar enough to suggest merging but needs user confirmation
- **confidence 0.5–0.69**: Possible match — related but may be intentionally separate
- **confidence < 0.5**: No match — different topics

## CONSOLIDATION SUGGESTIONS
When multiple extracted bundles match the SAME existing bundle, suggest consolidating them into one.
When multiple extracted bundles should merge with each other (even without an existing match), suggest that too.

## OUTPUT
For each extracted bundle, return:
- match_type: "exact" (merge into existing), "consolidate" (merge extracted bundles together), "new" (create new), "absorb" (existing bundle fully covers this)
- target_bundle_id: ID of the existing bundle to merge into (if applicable)
- consolidate_with: indices of other extracted bundles to merge with (if applicable)
- confidence: 0.0-1.0
- reason: brief explanation`;

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const extractedBundles: any[] = body.extracted_bundles || [];
    
    if (extractedBundles.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's existing bundles with their items
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    
    const { data: existingBundles, error: bundleErr } = await serviceClient
      .from("bundles")
      .select("id, title, description, scope_level")
      .eq("owner_id", user.id)
      .order("title");
    if (bundleErr) throw bundleErr;

    // If no existing bundles, check for inter-extracted consolidation only
    const existingContext = (existingBundles || []).map(b => ({
      id: b.id,
      title: b.title,
      description: b.description || "",
    }));

    // Fetch item summaries for existing bundles (top 5 items per bundle for context)
    const bundleIds = existingContext.map(b => b.id);
    let existingItemSummaries: Record<string, string[]> = {};
    
    if (bundleIds.length > 0) {
      const { data: items } = await serviceClient
        .from("context_item_bundles")
        .select("bundle_id, context_items!context_item_bundles_context_item_id_fkey(title, category)")
        .in("bundle_id", bundleIds);
      
      if (items) {
        for (const item of items) {
          const bid = item.bundle_id;
          if (!existingItemSummaries[bid]) existingItemSummaries[bid] = [];
          const ci = item.context_items as any;
          if (ci && existingItemSummaries[bid].length < 8) {
            existingItemSummaries[bid].push(`[${ci.category}] ${ci.title}`);
          }
        }
      }
    }

    const enrichedExisting = existingContext.map(b => ({
      ...b,
      sample_items: existingItemSummaries[b.id] || [],
    }));

    const extractedSummary = extractedBundles.map((b: any, i: number) => ({
      index: i,
      title: b.title,
      description: b.description || "",
      item_count: (b.items || []).length,
      sample_items: (b.items || []).slice(0, 8).map((it: any) => `[${it.category}] ${it.title}`),
    }));

    const userPrompt = `## EXISTING BUNDLES (user's knowledge graph)
${enrichedExisting.length === 0 ? "No existing bundles." : JSON.stringify(enrichedExisting, null, 2)}

## EXTRACTED BUNDLES (from new extraction)
${JSON.stringify(extractedSummary, null, 2)}

For each extracted bundle (by index), determine the best match action. Return results via the match_bundles tool.`;

    const toolDef = {
      type: "function",
      function: {
        name: "match_bundles",
        description: "Return matching results for extracted bundles",
        parameters: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  extracted_index: { type: "integer", description: "Index of the extracted bundle" },
                  match_type: { type: "string", enum: ["exact", "consolidate", "new", "absorb"] },
                  target_bundle_id: { type: "string", description: "ID of existing bundle to merge into (for exact/absorb)" },
                  target_bundle_title: { type: "string", description: "Title of the target bundle (for display)" },
                  consolidate_with: { type: "array", items: { type: "integer" }, description: "Indices of other extracted bundles to merge with" },
                  confidence: { type: "number", description: "0.0-1.0 confidence score" },
                  reason: { type: "string", description: "Brief explanation" },
                  suggested_merged_title: { type: "string", description: "Suggested title if bundles are consolidated" },
                },
                required: ["extracted_index", "match_type", "confidence", "reason"],
                additionalProperties: false,
              },
            },
          },
          required: ["matches"],
          additionalProperties: false,
        },
      },
    };

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [toolDef],
          tool_choice: { type: "function", function: { name: "match_bundles" } },
        }),
      },
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      // Return empty matches on AI failure — graceful degradation
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    // Strip non-UUID target_bundle_ids (AI sometimes hallucinates placeholder strings)
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (result.matches && Array.isArray(result.matches)) {
      for (const m of result.matches) {
        if (m.target_bundle_id && !uuidRe.test(m.target_bundle_id)) {
          console.warn(`Stripping invalid target_bundle_id: ${m.target_bundle_id}`);
          delete m.target_bundle_id;
          delete m.target_bundle_title;
          if (m.match_type === "exact" || m.match_type === "absorb") {
            m.match_type = "new";
          }
        }
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("match-bundles error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", matches: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

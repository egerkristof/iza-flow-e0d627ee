import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { loadPrompt } from "../_shared/load-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * optimize-structure — Pass 1.5 of the extraction pipeline.
 *
 * Takes the raw skeleton from detect-structure + document content preview,
 * and produces a semantically optimized bundle→playbook→procedure blueprint.
 *
 * Key behaviors:
 * - Merges semantically overlapping sections (e.g. "Negotiation Techniques" +
 *   "Negotiation Sins" → single playbook under a shared bundle)
 * - Reclassifies hierarchy: promotes/demotes sections based on the PLAYBOOK Test
 * - Uses adaptive consolidation: merges aggressively only when semantic similarity
 *   is high; preserves distinct sections when they represent genuinely different
 *   strategic drivers
 * - Outputs a mandatory blueprint that extraction follows exactly
 */

const SYSTEM_PROMPT = `You are a **Knowledge Architecture Optimizer**. You receive a raw document skeleton (from structural detection) plus a content preview. Your job is to produce the OPTIMAL bundle→playbook→procedure hierarchy by understanding the SEMANTICS of the content — not just its headings.

## CONTEXT
The system extracts knowledge from documents into a graph with three key levels:
- **BUNDLE** = A domain container (e.g., "Sales Methodology", "Client Engagement"). Think of it as a strategic THEME. A document typically produces 4-8 bundles.
- **PLAYBOOK** = A distinct strategic action an operator would CHOOSE to activate (e.g., "Run Discovery Meeting", "Handle Objections"). Each playbook lives inside a bundle. A playbook MUST pass the "Selection Test": would a frontline user look at a list of playbooks and deliberately pick THIS one to guide their work?
- **PROCEDURE** = An atomic step or instruction within a playbook. These are the granular "how-to" items.

## YOUR TASK
Given the raw skeleton and content preview:

1. **Identify semantic overlaps** — Find sections that cover the SAME topic from different angles and should be merged:
   - Example: "Negotiation Techniques" + "Negotiation Sins" + "Negotiation Best Practices" → ONE playbook called "Negotiation Mastery" under a "Deal Execution" bundle
   - Example: "Discovery Questions" + "Qualifying Leads" → could be one playbook "Discovery & Qualification"

2. **Apply the PLAYBOOK Test** to every section:
   - Would an operator SELECT this as a distinct action? → PLAYBOOK
   - Is it a sub-step within a larger action? → PROCEDURE (nest under parent playbook)
   - Is it a broad thematic container? → BUNDLE (should contain multiple playbooks)
   - Is it a rule/constraint/principle? → DIRECTIVE or KNOWLEDGE (not a playbook)

3. **Reclassify the hierarchy:**
   - Sections marked as bundles that are too narrow → demote to playbook under a broader bundle
   - Sections marked as playbooks that are too broad → promote to bundle
   - Related playbooks scattered across different bundles → consolidate into the same bundle

4. **Adaptive consolidation:**
   - HIGH semantic similarity between sections → MERGE (combine into one playbook/bundle)
   - CLEAR semantic distinction → PRESERVE as separate
   - AMBIGUOUS → Keep separate but group under the same parent bundle
   - Target: **6-12 bundles** with well-defined playbooks (2-5 per bundle). Documents with 50+ skeleton sections should produce at LEAST 6 bundles. Collapsing everything into 2-3 mega-bundles destroys the navigability of the knowledge graph.

5. **Produce the optimized blueprint** with explicit assignments for every section.

## RULES
- Every section from the raw skeleton must appear in the output — nothing gets dropped.
- Merged sections must list ALL original section labels that were combined.
- The blueprint must preserve the document's sequential order within each bundle.
- Each playbook must have a clear, action-oriented title (verb-led when possible).
- Bundle titles should be thematic/domain-oriented (noun-led).
- Include a "semantic_confidence" score per merge decision (0.0-1.0) so downstream can audit.
- Be THOROUGH — this blueprint becomes the mandatory extraction guide.
- **CRITICAL: MAXIMIZE INCLUSION.** Every skeleton section MUST appear as either a bundle, playbook, or procedure in the output. Even sections with sparse or no content are valuable — the label itself carries strategic meaning for the user. NEVER drop, skip, or omit a section because it seems empty or thin. An empty playbook with a meaningful title is far more valuable than a missing one.
- **CRITICAL: Every bundle MUST contain at least one playbook.** If a bundle would end up with zero playbooks, either: (a) create a playbook from the bundle's own content/label, or (b) promote sub-sections to playbook level. A bundle with no playbooks is invalid.
- **CRITICAL: NEVER reclassify a level-1 or level-2 section as a PROCEDURE.** Top-level sections represent major strategic domains. If they seem small, they should become a PLAYBOOK at minimum, or remain a BUNDLE. Demoting them to procedure destroys all sub-content.
- **CRITICAL: Sections that represent fundamentally different STRATEGIC APPROACHES (e.g., "Account Management / Farming" vs "Sales / Hunting") must NEVER be merged into a single procedure.** They are distinct operational domains and should each be at least a PLAYBOOK, ideally separate BUNDLES with their own playbooks underneath.
- When two sections describe contrasting or complementary strategies (hunting vs farming, inbound vs outbound, new business vs retention), keep them as separate playbooks or bundles — do NOT collapse them into a single "differentiate X and Y" procedure.
- **PREFER OVER-INCLUSION over consolidation.** When in doubt, keep a section as its own playbook rather than merging it. Users can always merge later, but they cannot recover dropped sections.

Return results via the optimize_structure tool.`;

const TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "optimize_structure",
    description: "Return the semantically optimized document blueprint",
    parameters: {
      type: "object",
      properties: {
        optimization_summary: {
          type: "string",
          description: "2-4 sentence summary of what was optimized: merges made, reclassifications, overall strategy.",
        },
        consolidation_decisions: {
          type: "array",
          description: "List of merge/consolidation decisions made, for transparency",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: ["merge", "demote_to_playbook", "promote_to_bundle", "reclassify_as_procedure", "keep_as_is"],
                description: "What was done to this group of sections",
              },
              original_labels: {
                type: "array",
                items: { type: "string" },
                description: "The original section labels from the skeleton that were affected",
              },
              result_label: {
                type: "string",
                description: "The new label after optimization",
              },
              result_role: {
                type: "string",
                enum: ["bundle", "playbook", "procedure", "directive", "knowledge"],
                description: "The assigned role in the hierarchy",
              },
              rationale: {
                type: "string",
                description: "Brief explanation of why this decision was made (1-2 sentences)",
              },
              semantic_confidence: {
                type: "number",
                description: "Confidence in this decision (0.0-1.0). Higher = more certain the merge/reclassification is correct.",
              },
            },
            required: ["action", "original_labels", "result_label", "result_role", "rationale", "semantic_confidence"],
          },
        },
        optimized_blueprint: {
          type: "array",
          description: "The final optimized hierarchy — ordered list of bundles with their playbooks and procedures",
          items: {
            type: "object",
            properties: {
              bundle_title: {
                type: "string",
                description: "Thematic title for this bundle (domain container)",
              },
              bundle_description: {
                type: "string",
                description: "1-2 sentence description of what this bundle covers",
              },
              original_skeleton_labels: {
                type: "array",
                items: { type: "string" },
                description: "Which raw skeleton sections map into this bundle",
              },
              playbooks: {
                type: "array",
                description: "Playbooks within this bundle — each a distinct activatable action",
                items: {
                  type: "object",
                  properties: {
                    playbook_title: {
                      type: "string",
                      description: "Action-oriented title for this playbook",
                    },
                    original_skeleton_labels: {
                      type: "array",
                      items: { type: "string" },
                      description: "Which raw skeleton sections were merged/mapped into this playbook",
                    },
                    procedures: {
                      type: "array",
                      description: "Expected procedure items under this playbook",
                      items: {
                        type: "object",
                        properties: {
                          label: {
                            type: "string",
                            description: "Procedure label from the document",
                          },
                          original_skeleton_label: {
                            type: "string",
                            description: "Original skeleton section this maps to (if any)",
                          },
                        },
                        required: ["label"],
                      },
                    },
                    shared_knowledge_labels: {
                      type: "array",
                      items: { type: "string" },
                      description: "Sections that should become shared KNOWLEDGE/DIRECTIVE items at bundle level rather than playbook-specific procedures",
                    },
                  },
                  required: ["playbook_title", "original_skeleton_labels", "procedures"],
                },
              },
            },
            required: ["bundle_title", "bundle_description", "original_skeleton_labels", "playbooks"],
          },
        },
        stats: {
          type: "object",
          properties: {
            original_sections: { type: "integer", description: "Number of sections in raw skeleton" },
            final_bundles: { type: "integer", description: "Number of bundles in optimized blueprint" },
            final_playbooks: { type: "integer", description: "Total playbooks across all bundles" },
            merges_performed: { type: "integer", description: "Number of merge operations" },
            reclassifications: { type: "integer", description: "Number of role reclassifications" },
          },
          required: ["original_sections", "final_bundles", "final_playbooks", "merges_performed", "reclassifications"],
        },
      },
      required: ["optimization_summary", "consolidation_decisions", "optimized_blueprint", "stats"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    // Verify auth
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const { skeleton, content_preview, documentId } = body;

    if (!skeleton || !skeleton.skeleton || skeleton.skeleton.length === 0) {
      throw new Error("skeleton (from detect-structure) is required");
    }

    // ── Resolve content preview ─────────────────────────────────────
    // For PDF documents, content_preview won't be available from the client.
    // If documentId is provided, fetch the document and extract text for context.
    let resolvedContentPreview = content_preview || "";

    if (!resolvedContentPreview && documentId) {
      console.log("No content_preview provided — fetching document text for PDF context");
      try {
        const adminClient = createClient(supabaseUrl, supabaseKey);
        const { data: doc } = await adminClient
          .from("personal_documents")
          .select("*")
          .eq("id", documentId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (doc) {
          const isPdf = doc.file_type === "application/pdf" || doc.file_name.toLowerCase().endsWith(".pdf");
          const { data: fileData, error: dlError } = await adminClient.storage
            .from("personal-documents")
            .download(doc.file_path);

          if (!dlError && fileData) {
            if (isPdf) {
              // For PDFs, send the PDF itself to the AI for content understanding
              // We'll include skeleton labels as context since we can't easily extract PDF text in Deno
              const skeletonLabels = (skeleton.skeleton || [])
                .map((e: any, i: number) => `${i + 1}. ${"  ".repeat((e.level || 1) - 1)}${e.label} [${e.content_density || "unknown"}]`)
                .join("\n");
              resolvedContentPreview = `[PDF Document: ${doc.file_name}]\n\nStructural outline:\n${skeletonLabels}`;
            } else {
              const text = await fileData.text();
              resolvedContentPreview = text.slice(0, 60000);
            }
          }
        }
      } catch (fetchErr) {
        console.warn("Failed to fetch document for content preview (non-fatal):", fetchErr);
      }
    }

    // Safety: prune skeleton if still too large for reliable AI processing
    // Use a higher cap (150) to avoid dropping important sections like "Farming"
    const SKELETON_CAP = 150;
    let skeletonForPrompt = { ...skeleton };
    if (skeleton.skeleton.length > SKELETON_CAP) {
      console.log(`Pruning skeleton from ${skeleton.skeleton.length} to ≤${SKELETON_CAP} entries for optimization`);
      const entries = [...skeleton.skeleton];
      const important = entries.filter((e: any) => (e.level || 1) <= 2 || e.is_bundle_candidate);
      const medium = entries.filter((e: any) => (e.level || 1) === 3 && !e.is_bundle_candidate);
      const low = entries.filter((e: any) => (e.level || 1) >= 4 && !e.is_bundle_candidate);
      const densityRank: Record<string, number> = { rich: 3, moderate: 2, sparse: 1, empty: 0 };
      medium.sort((a: any, b: any) => (densityRank[b.content_density] ?? 0) - (densityRank[a.content_density] ?? 0));
      low.sort((a: any, b: any) => (densityRank[b.content_density] ?? 0) - (densityRank[a.content_density] ?? 0));
      const remaining = SKELETON_CAP - important.length;
      const mediumSlice = medium.slice(0, Math.max(0, remaining));
      const lowRemaining = SKELETON_CAP - important.length - mediumSlice.length;
      const lowSlice = low.slice(0, Math.max(0, lowRemaining));
      const kept = new Set([...important, ...mediumSlice, ...lowSlice]);
      const prunedEntries = entries.filter((e: any) => !kept.has(e));
      skeletonForPrompt = {
        ...skeleton,
        skeleton: [...kept],
        total_sections_detected: skeleton.skeleton.length,
        _pruned_to: kept.size,
        _pruned_labels: prunedEntries.map((e: any) => ({
          label: e.label,
          level: e.level || 1,
          content_density: e.content_density || "unknown",
        })),
      };
    }

    // Build the user prompt with both skeleton and content
    const skeletonText = JSON.stringify(skeletonForPrompt, null, 2);
    const contentSection = resolvedContentPreview
      ? `\n\n## DOCUMENT CONTENT PREVIEW (first ~60K chars)\n${resolvedContentPreview}`
      : "";

    const userPrompt = `## RAW SKELETON (from structure detection)
\`\`\`json
${skeletonText}
\`\`\`
${contentSection}

Analyze the semantic relationships between these sections. Identify overlaps, misclassifications, and opportunities to create a cleaner bundle→playbook→procedure hierarchy. Apply the PLAYBOOK Test to every section and produce the optimized blueprint.`;

    const activePrompt = await loadPrompt("optimize-structure-system", SYSTEM_PROMPT);

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
            { role: "system", content: activePrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [TOOL_DEFINITION],
          tool_choice: { type: "function", function: { name: "optimize_structure" } },
        }),
      },
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("Structure optimization failed: " + aiResponse.status);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      console.error("No tool call returned for structure optimization");
      // Return the original skeleton as fallback (no optimization)
      return new Response(JSON.stringify({
        optimization_summary: "Optimization could not be performed. Using raw skeleton as-is.",
        consolidation_decisions: [],
        optimized_blueprint: [],
        stats: {
          original_sections: skeleton.total_sections_detected || 0,
          final_bundles: 0,
          final_playbooks: 0,
          merges_performed: 0,
          reclassifications: 0,
        },
        fallback: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    // Attach pruning stats if pruning occurred
    const rawCount = skeleton.skeleton?.length || 0;
    const prunedTo = skeletonForPrompt._pruned_to || rawCount;
    if (prunedTo < rawCount) {
      result.pruning_stats = {
        raw_skeleton_count: rawCount,
        pruned_to: prunedTo,
        pruned_labels: skeletonForPrompt._pruned_labels || [],
      };
      console.log(`Skeleton pruned: ${rawCount} → ${prunedTo} entries (${result.pruning_stats.pruned_labels.length} labels)`);
    }
    console.log(`Structure optimized: bundles=${result.stats?.final_bundles}, playbooks=${result.stats?.final_playbooks}, merges=${result.stats?.merges_performed}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("optimize-structure error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

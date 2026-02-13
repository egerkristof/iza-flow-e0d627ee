import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a **Knowledge Graph Auditor** for the AACE context management system. You analyze existing context items and produce actionable improvement suggestions.

## CONTEXT ITEM CATEGORIES
- DIRECTIVE — Explicit rules/mandates that MUST be followed
- KNOWLEDGE — Factual information, domain expertise, institutional memory
- PROCEDURE — Step-by-step processes, workflows, checklists
- PLAYBOOK — Strategic approaches bundling multiple elements
- PREFERENCE — Working style, communication tone, operational defaults
- RESEARCH — Findings, analyses, competitive intelligence
- PRINCIPLE — Core beliefs, values, guiding tenets

## YOUR TASK
Analyze the provided context items and return suggestions for improvements. Each suggestion should be one of:
- **recategorize** — The item's category is wrong. Suggest the correct one with reasoning.
- **enrich** — The item's content is thin or vague. Provide enriched content.
- **split** — The item covers multiple concerns. Suggest how to split it.
- **merge** — Two or more items are semantically similar or redundant. Suggest merging them. ALWAYS provide the merge_with_id field pointing to the other item.
- **promote_mandate** — A DIRECTIVE item should be elevated to a formal mandate.
- **archive** — The item appears stale, redundant, or superseded.

## DEDUPLICATION FOCUS
Pay special attention to **semantic duplicates**: items that say the same thing in different words, cover the same topic with overlapping content, or have near-identical titles. When you find such pairs, emit a "merge" suggestion for one of them with merge_with_id pointing to the other.

Be specific and actionable. Only suggest changes that would genuinely improve the knowledge graph. Don't suggest changes for items that are already well-structured.`;

const TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "audit_suggestions",
    description: "Return audit suggestions for improving existing context items",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Brief overall assessment of the knowledge graph health (2-3 sentences)",
        },
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              item_id: {
                type: "string",
                description: "The ID of the context item this suggestion applies to",
              },
              type: {
                type: "string",
                enum: ["recategorize", "enrich", "split", "merge", "promote_mandate", "archive"],
              },
              reason: {
                type: "string",
                description: "Clear explanation of why this change is recommended",
              },
              suggested_category: {
                type: "string",
                enum: ["DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"],
                description: "For recategorize: the suggested new category",
              },
              suggested_content: {
                type: "string",
                description: "For enrich: the improved content. For split: description of how to split.",
              },
              merge_with_id: {
                type: "string",
                description: "For merge: the ID of the item to merge with",
              },
              enforcement_level: {
                type: "string",
                enum: ["advisory", "required_ack", "blocking"],
                description: "For promote_mandate: suggested enforcement level",
              },
            },
            required: ["item_id", "type", "reason"],
            additionalProperties: false,
          },
        },
      },
      required: ["summary", "suggestions"],
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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const { action, items, item_id } = body;

    // action: "audit" (bulk) | "suggest_single" (per-item)
    if (action === "audit" || !action) {
      // Bulk audit: analyze all provided items
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("items array required for audit");
      }

      const itemsSummary = items.map((i: any) => 
        `[ID: ${i.id}] Category: ${i.category} | Priority: ${i.priority} | Title: "${i.title}" | Content: "${(i.content_full || "").slice(0, 500)}"`
      ).join("\n\n");

      const userPrompt = `Analyze these ${items.length} context items from a user's knowledge graph and suggest improvements:

${itemsSummary}

Return actionable suggestions. Focus on:
1. **Semantic duplicates** — Items that cover the same topic, say the same thing in different words, or have very similar titles. Emit "merge" suggestions with merge_with_id.
2. Items with wrong categories (e.g. rules categorized as KNOWLEDGE instead of DIRECTIVE)
3. Items with thin/vague content that need enrichment
4. Items that should be split into multiple focused items
5. DIRECTIVE items that should be promoted to formal mandates
6. Stale or superseded items that could be archived

Only suggest genuinely valuable improvements — don't force suggestions.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
          tools: [TOOL_DEFINITION],
          tool_choice: { type: "function", function: { name: "audit_suggestions" } },
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("AI error:", aiResponse.status, errText);
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("AI request failed");
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");

      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "apply_enrich") {
      // Apply an enrichment suggestion to an item
      const { enriched_content } = body;
      if (!item_id || !enriched_content) throw new Error("item_id and enriched_content required");

      const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { error } = await adminClient
        .from("context_items")
        .update({ content_full: enriched_content })
        .eq("id", item_id)
        .eq("owner_id", user.id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "apply_recategorize") {
      const { new_category } = body;
      if (!item_id || !new_category) throw new Error("item_id and new_category required");

      const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { error } = await adminClient
        .from("context_items")
        .update({ category: new_category })
        .eq("id", item_id)
        .eq("owner_id", user.id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "apply_promote_mandate") {
      const { enforcement_level } = body;
      if (!item_id) throw new Error("item_id required");

      const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { error } = await adminClient
        .from("context_items")
        .update({
          is_mandate: true,
          mandate_status: "draft",
          enforcement_level: enforcement_level || "required_ack",
          priority: "CRITICAL",
        })
        .eq("id", item_id)
        .eq("owner_id", user.id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      throw new Error("Unknown action: " + action);
    }
  } catch (err) {
    console.error("audit-context error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { loadPrompt } from "../_shared/load-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a **Knowledge Graph Auditor** for the AACE context management system. You analyze existing context items and produce actionable improvement suggestions.

## PROTOCOL EXECUTION MODEL
When bundles are deployed to workbooks, they generate executable protocols:
- **PLAYBOOK** = Protocol Template (strategic driver — defines WHAT and WHY)
- **PROCEDURE** = Executable Steps (ordered actions — each is a discrete step operators follow)
- **DIRECTIVE** = Compliance Gates (rules requiring acknowledgment before proceeding)
- **KNOWLEDGE/RESEARCH/PRINCIPLE/PREFERENCE** = Context Injections (fed to AI during execution)

## CONTEXT ITEM CATEGORIES
- DIRECTIVE — Explicit rules/mandates → become compliance gates in execution
- KNOWLEDGE — Factual information, domain expertise → context injection
- PROCEDURE — Step-by-step actions → become executable protocol steps (should be atomic: ONE step per item)
- PLAYBOOK — Strategic approaches → become protocol templates that DRIVE execution
- PREFERENCE — Working style, communication tone → personalization context
- RESEARCH — Findings, analyses, competitive intelligence → reference context
- PRINCIPLE — Core beliefs, values, guiding tenets → decision-making context

## YOUR TASK
Analyze the provided context items and return suggestions for improvements. Each suggestion should be one of:
- **recategorize** — The item's category is wrong per the protocol model. E.g. a step-by-step process labeled PLAYBOOK should be PROCEDURE; a strategic overview labeled PROCEDURE should be PLAYBOOK.
- **enrich** — The item's content is thin or vague. Provide enriched content.
- **split** — The item covers multiple concerns or multiple steps. Especially flag PLAYBOOKs that contain step-by-step instructions (should be split into individual PROCEDUREs). Flag PROCEDUREs that contain multiple actions (should be split into atomic steps).
- **merge** — Two or more items are semantically similar or redundant. ALWAYS provide the merge_with_id field.
- **promote_mandate** — A DIRECTIVE item should be elevated to a formal mandate (compliance gate).
- **archive** — The item appears stale, redundant, or superseded.

## KEY AUDIT PATTERNS
1. **PLAYBOOKs with step-by-step content** → Should be split: keep the PLAYBOOK as strategic overview, extract each step as a separate PROCEDURE
2. **PROCEDUREs with multiple actions** → Should be split into atomic, single-step PROCEDUREs
3. **KNOWLEDGE items with imperative language** → May actually be DIRECTIVEs (compliance gates)
4. **Orphan PROCEDUREs without a PLAYBOOK** → Flag for bundling with a strategic driver
5. **Semantic duplicates** — Items that cover the same topic in different words

Be specific and actionable. Only suggest genuinely valuable improvements.`;

const CHAT_SYSTEM_PROMPT = `You are a **Knowledge Graph Copilot** for the AACE context management system. You help users understand, audit, and improve their knowledge graph.

## PROTOCOL EXECUTION MODEL
When bundles are deployed to workbooks, they generate executable protocols:
- **PLAYBOOK** = Protocol Template (strategic driver — defines WHAT and WHY)  
- **PROCEDURE** = Executable Steps (ordered actions operators follow — one step per item)
- **DIRECTIVE** = Compliance Gates (rules requiring acknowledgment)
- **KNOWLEDGE/RESEARCH/PRINCIPLE/PREFERENCE** = Context Injections (fed to AI during execution)

You can discuss:
- How to structure bundles for optimal protocol execution (PLAYBOOK drives, PROCEDUREs are steps, DIRECTIVEs are gates)
- When to split PLAYBOOKs into granular PROCEDUREs for better execution tracking
- How to organize and categorize context items within the protocol model
- When to split, merge, or archive items
- Best practices for knowledge graph health and protocol readiness
- How to interpret audit results and suggestions
- Strategies for re-auditing after changes
- When to promote directives to mandates (compliance gates)
- How to improve content quality and reduce duplication
- How bundles map to protocol execution in workbooks

## IMPORTANT: RE-AUDIT TRIGGER
When the user asks you to re-audit, run an audit, re-analyze, rescan, or otherwise requests a fresh audit of their knowledge graph, you MUST include the exact token **[TRIGGER_REAUDIT]** at the very end of your response. This token will be detected by the system to automatically trigger a re-audit. Provide a brief confirmation message before the token, e.g. "Sure, I'll kick off a fresh audit now. [TRIGGER_REAUDIT]"

Be concise, practical, and specific. Reference the user's actual items when relevant. Format responses with markdown.`;

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

    if (action === "chat") {
      // Conversational chat about the knowledge graph
      const { messages, graph_context } = body;
      if (!messages || !Array.isArray(messages)) throw new Error("messages array required for chat");

      const activeChatPrompt = await loadPrompt("audit-context-chat", CHAT_SYSTEM_PROMPT);

      const contextBlock = graph_context
        ? `\n\nCurrent knowledge graph snapshot (${graph_context.length} items):\n${graph_context.map((i: any) => `- [${i.category}] "${i.title}"`).join("\n")}`
        : "";

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: activeChatPrompt + contextBlock },
            ...messages,
          ],
          stream: true,
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("AI chat error:", aiResponse.status, errText);
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("AI request failed");
      }

      return new Response(aiResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });

    } else if (action === "audit" || !action) {
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

      const activeAuditPrompt = await loadPrompt("audit-context-system", SYSTEM_PROMPT);

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: activeAuditPrompt },
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

    } else if (action === "apply_merge") {
      const { merge_with_id } = body;
      if (!item_id || !merge_with_id) throw new Error("item_id and merge_with_id required");

      const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

      // Fetch both items
      const { data: sourceItem } = await adminClient.from("context_items").select("*").eq("id", item_id).eq("owner_id", user.id).single();
      const { data: targetItem } = await adminClient.from("context_items").select("*").eq("id", merge_with_id).eq("owner_id", user.id).single();
      if (!sourceItem || !targetItem) throw new Error("Could not find both items to merge");

      // Merge content into target, soft-delete source
      const mergedContent = targetItem.content_full + "\n\n---\n\n" + sourceItem.content_full;
      const { error: updateErr } = await adminClient.from("context_items")
        .update({ content_full: mergedContent })
        .eq("id", merge_with_id)
        .eq("owner_id", user.id);
      if (updateErr) throw updateErr;

      const { error: deleteErr } = await adminClient.from("context_items")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", item_id)
        .eq("owner_id", user.id);
      if (deleteErr) throw deleteErr;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "apply_split") {
      const { suggested_content } = body;
      if (!item_id) throw new Error("item_id required");

      const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

      // Fetch the original item
      const { data: original } = await adminClient.from("context_items").select("*").eq("id", item_id).eq("owner_id", user.id).single();
      if (!original) throw new Error("Item not found");

      // Create a second item as a split-off with the suggested content
      const { error: insertErr } = await adminClient.from("context_items").insert({
        owner_id: user.id,
        title: original.title + " (Split)",
        content_full: suggested_content || "Split from: " + original.title,
        category: original.category,
        priority: original.priority,
        security_level: original.security_level,
        action_type: original.action_type,
        bundle_id: original.bundle_id,
        domain_scope: original.domain_scope,
      });
      if (insertErr) throw insertErr;

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

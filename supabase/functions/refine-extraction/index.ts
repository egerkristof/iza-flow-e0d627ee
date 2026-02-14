import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { loadPrompt } from "../_shared/load-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const { items, instruction } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) throw new Error("items required");
    if (!instruction) throw new Error("instruction required");

    const itemsSummary = items.map((it: any, i: number) =>
      `[${i + 1}] (${it.type}) Title: "${it.title}" | Category: ${it.category || "N/A"}${it.is_suggestion ? " | ⚠️ AI-Suggested" : ""} | Content: "${(it.content || it.preference_value || "").slice(0, 300)}"`
    ).join("\n");

    const FALLBACK_PROMPT = `You are a Senior Knowledge Architect helping a user refine extracted knowledge items within the AACE protocol execution system.

## PROTOCOL EXECUTION MODEL
When bundles are deployed to workbooks, each PLAYBOOK generates a SEPARATE executable protocol:
- **PLAYBOOK** = Protocol Driver (activatable action — multiple per bundle allowed)
- **PROCEDURE** = Executable Steps (owned by a specific PLAYBOOK — ordered actions)
- **DIRECTIVE** = Compliance Gates (owned by a specific PLAYBOOK — rules requiring acknowledgment)
- **KNOWLEDGE/RESEARCH/PRINCIPLE/PREFERENCE** = Shared Context (injected into ALL protocols)

## ITEM OWNERSHIP
- Every PROCEDURE and DIRECTIVE should have a parent_playbook_title indicating which PLAYBOOK owns it
- KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE are shared (no parent_playbook_title)
- A PLAYBOOK itself does NOT have a parent_playbook_title

## CATEGORY DECISION RULES — follow this checklist IN ORDER:
1. Is it a RULE/CONSTRAINT/MANDATE? → DIRECTIVE
2. Is it a STEP/CHECKLIST/ACTION? → PROCEDURE (set step_order_hint for execution order)
3. Is it a STRATEGY/ACTIVATABLE ACTION? → PLAYBOOK (multiple per bundle OK)
4. Is it a CORE BELIEF/VALUE? → PRINCIPLE
5. Is it RESEARCH/ANALYSIS/DATA? → RESEARCH
6. Is it a WORKING STYLE/PREFERENCE? → PREFERENCE
7. Everything else → KNOWLEDGE

## Rules
- Preserve all meaningful information — don't lose content during refinement
- If the user asks to split an item, create multiple items from it
- If the user asks to merge items, combine them intelligently  
- When splitting a PLAYBOOK into steps, keep the PLAYBOOK as strategic overview, extract PROCEDUREs with step_order_hint and set their parent_playbook_title to the PLAYBOOK's title
- PROCEDUREs should be atomic, ordered actions — one step per item
- Always return items with title, content, category, and type fields
- Preserve parent_playbook_title when present
- Return a brief analysis_notes explaining what you changed`;

    const activePrompt = await loadPrompt("refine-extraction-system", FALLBACK_PROMPT);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: activePrompt,
          },
          {
            role: "user",
            content: `Here are the items to refine:\n\n${itemsSummary}\n\n**User instruction:** ${instruction}\n\nApply the instruction and return the refined items via the refine_items tool.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "refine_items",
              description: "Return refined knowledge items after applying user instructions",
              parameters: {
                type: "object",
                properties: {
                  analysis_notes: {
                    type: "string",
                    description: "Brief explanation of what was changed and why (1-3 sentences)",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["preference", "context_item", "bundle_item"] },
                        title: { type: "string" },
                        content: { type: "string", description: "Main content (or preference_value for preferences)" },
                        category: {
                          type: "string",
                          enum: ["KNOWLEDGE", "RESEARCH", "DIRECTIVE", "PRINCIPLE", "PROCEDURE", "PLAYBOOK", "PREFERENCE"],
                        },
                        preference_key: { type: "string", description: "Only for preference type items" },
                        condition_label: { type: "string", description: "Only for preference type items" },
                        step_order_hint: { type: "integer", description: "Execution order (1-based). REQUIRED for PROCEDURE items to preserve sequence." },
                        original_index: { type: "number", description: "Original item index (0-based) this came from, or -1 if new" },
                        bundle_index: { type: "number", description: "For bundle items: which bundle this belongs to" },
                        bundle_item_index: { type: "number", description: "For bundle items: original position within the bundle" },
                        is_suggestion: { type: "boolean", description: "True if this content was AI-generated to fill a gap, not from the source document. Preserve from original items when present." },
                        parent_playbook_title: { type: "string", description: "EXACT title of the parent PLAYBOOK this item belongs to within the same bundle. REQUIRED for PROCEDURE and DIRECTIVE items. Preserve from original items." },
                      },
                      required: ["type", "title", "content", "category", "original_index"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["analysis_notes", "items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "refine_items" } },
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
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI refinement failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No refinement result");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("refine-extraction error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

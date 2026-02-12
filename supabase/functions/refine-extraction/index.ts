import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      `[${i + 1}] (${it.type}) Title: "${it.title}" | Category: ${it.category || "N/A"} | Content: "${(it.content || it.preference_value || "").slice(0, 300)}"`
    ).join("\n");

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
            content: `You are a Senior Knowledge Architect helping a user refine extracted knowledge items. The user has extracted items from a document and wants you to improve them based on their instructions.

You will receive a list of items (preferences, context items, or bundle items) and a user instruction. Apply the instruction to refine, restructure, split, merge, recategorize, or improve the items.

Categories available: DIRECTIVE, KNOWLEDGE, PROCEDURE, PLAYBOOK, PREFERENCE, RESEARCH, PRINCIPLE.

Rules:
- Preserve all meaningful information — don't lose content during refinement
- If the user asks to split an item, create multiple items from it
- If the user asks to merge items, combine them intelligently
- If the user asks to recategorize, change the category
- If the user asks to improve/enrich, add more detail and specificity
- Always return items with title, content, category, and type fields
- Return a brief analysis_notes explaining what you changed and why`,
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
                        original_index: { type: "number", description: "Original item index (0-based) this came from, or -1 if new" },
                        bundle_index: { type: "number", description: "For bundle items: which bundle this belongs to" },
                        bundle_item_index: { type: "number", description: "For bundle items: original position within the bundle" },
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

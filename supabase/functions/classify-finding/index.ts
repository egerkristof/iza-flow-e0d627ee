import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { loadPrompt } from "../_shared/load-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a knowledge-capture AI for a workbook-based collaboration platform.

Your job: Given a chat message (or user-highlighted text), classify it as a reusable finding and match it against the user's existing knowledge graph.

## PROTOCOL EXECUTION MODEL
When bundles are deployed to workbooks, they generate executable protocols:
- **PLAYBOOK** = Protocol Template (strategic driver — defines WHAT and WHY). Each PLAYBOOK generates a SEPARATE protocol.
- **PROCEDURE** = Executable Steps (ordered actions — each is a discrete step operators follow)
- **DIRECTIVE** = Compliance Gates (rules requiring acknowledgment before proceeding)
- **KNOWLEDGE/RESEARCH/PRINCIPLE/PREFERENCE** = Context Injections (fed to AI during execution)

## CATEGORY DECISION RULES (follow IN ORDER)
1. Is it a RULE/CONSTRAINT/MANDATE? → DIRECTIVE
2. Is it a STEP/CHECKLIST/ACTION? → PROCEDURE
3. Is it a STRATEGY/METHODOLOGY? → PLAYBOOK (apply PLAYBOOK Test below)
4. Is it a CORE BELIEF/VALUE? → PRINCIPLE
5. Is it RESEARCH/ANALYSIS/DATA? → RESEARCH
6. Is it a WORKING STYLE/PREFERENCE? → PREFERENCE
7. Everything else → KNOWLEDGE

## THE PLAYBOOK TEST (apply to EVERY PLAYBOOK candidate)
Ask THREE questions:
1. _"Does this define the STRATEGIC INTENT of a specific action an operator can take?"_ — If NO → not a PLAYBOOK
2. _"Would an operator select this from a menu of available actions?"_ — If NO → not a PLAYBOOK
3. _"Does it describe the WHAT & WHY at a high level, leaving HOW to PROCEDUREs?"_ — If NO → not a PLAYBOOK

**Is NOT a PLAYBOOK — COMMON MISTAKES:**
- ❌ An analytical FRAMEWORK or MODEL (BANT, DISK, Porter's 5 Forces) → **KNOWLEDGE**
- ❌ A CHECKLIST of actions → **PROCEDURE** (ordered steps)
- ❌ A step-by-step SEQUENCE → **PROCEDURE** (with step_order_hint)
- ❌ A decision PROCESS → **PROCEDURE**
- ❌ A process DESCRIPTION or FLOW diagram → **KNOWLEDGE**
- ❌ Competitive strategy REFERENCE material → **KNOWLEDGE**

## Your Task
1. Classify the finding into the best category using the CATEGORY DECISION RULES above
2. Extract a clear, concise title (max 10 words)
3. Rewrite the content as a clean, reusable knowledge statement
4. Extract any principles or best practices embedded in the text
5. Suggest related existing items from the user's knowledge (by ID) that overlap or conflict
6. Flag if this is likely a duplicate of an existing item

Be precise and actionable. The captured finding should be useful out of context.`;`

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { message_text, workbook_id, chat_id } = await req.json();
    if (!message_text?.trim()) {
      return new Response(JSON.stringify({ error: "message_text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's existing context items for dedup/relation matching
    const { data: existingItems } = await supabase
      .from("context_items")
      .select("id, title, category, content_full")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false })
      .limit(100);

    const existingSummary = (existingItems || [])
      .map((i: any) => `[${i.id}] ${i.category}: "${i.title}" — ${i.content_full.slice(0, 120)}`)
      .join("\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `## Chat message to classify:
"${message_text}"

## User's existing knowledge items (for dedup & relation matching):
${existingSummary || "(none yet)"}

${workbook_id ? `Workbook ID: ${workbook_id}` : ""}
${chat_id ? `Chat ID: ${chat_id}` : ""}

Classify this finding using the classify_finding tool.`;

    // Load prompt from DB with fallback
    const activePrompt = await loadPrompt("classify-finding-system", SYSTEM_PROMPT);

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: activePrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "classify_finding",
                description:
                  "Classify a chat message as a reusable knowledge finding",
                parameters: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      enum: [
                        "DIRECTIVE",
                        "KNOWLEDGE",
                        "PROCEDURE",
                        "PLAYBOOK",
                        "PREFERENCE",
                        "RESEARCH",
                        "PRINCIPLE",
                      ],
                      description: "Best-fit category for this finding",
                    },
                    title: {
                      type: "string",
                      description:
                        "Clear, concise title (max 10 words)",
                    },
                    content: {
                      type: "string",
                      description:
                        "Clean reusable knowledge statement rewritten from the original",
                    },
                    principles: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Extracted principles or best practices (0-3 items)",
                    },
                    related_item_ids: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "IDs of existing items that are related or overlapping",
                    },
                    is_duplicate: {
                      type: "boolean",
                      description:
                        "True if this is essentially a duplicate of an existing item",
                    },
                    duplicate_of_id: {
                      type: "string",
                      description:
                        "ID of the existing item this duplicates (if is_duplicate is true)",
                    },
                    confidence: {
                      type: "number",
                      description:
                        "Confidence score 0-1 for the classification",
                    },
                  },
                  required: [
                    "category",
                    "title",
                    "content",
                    "principles",
                    "related_item_ids",
                    "is_duplicate",
                    "confidence",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "classify_finding" },
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call in AI response");
    }

    const classification = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ classification }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-finding error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

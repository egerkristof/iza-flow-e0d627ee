import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a **Senior AI Operating Model Architect**. Given extracted knowledge elements (bundles with playbooks, procedures, directives, and knowledge items), your task is to generate a realistic preview of what it would look like to OPERATE on this knowledge in a structured AI-assisted system.

You must generate:

1. **protocols** — For each PLAYBOOK, generate a protocol preview showing how it would become an executable workflow. Include the protocol title, a brief description of the execution flow, the ordered steps (derived from PROCEDUREs), and which DIRECTIVEs would serve as compliance gates.

2. **coaching_questions** — 5-8 targeted questions that a knowledge architect would ask to refine and deepen this extracted knowledge. These should identify gaps, ambiguities, and areas where tacit knowledge needs to be made explicit. Each question should reference specific items or bundles.

3. **workbook_preview** — A realistic preview of how a team workbook would look when these protocols are deployed. Include: workbook title, team members (realistic roles, 2-4 people), active protocols list, and a sample "current session" showing a team member mid-execution on one protocol step with a realistic AI-generated draft output for that step.

4. **projected_learnings** — 4-6 realistic learnings that LIZA would typically capture after a team has executed these protocols 3-5 times. Each learning should have a title, insight text, category (efficiency, quality, compliance, collaboration), and what refinement it would trigger (e.g., "Add step to procedure X", "Strengthen directive Y").

Return results via the generate_experience_preview tool.`;

const TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "generate_experience_preview",
    description: "Generate a full experience preview showing how extracted knowledge operates in the LIZA system",
    parameters: {
      type: "object",
      properties: {
        protocols: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              source_playbook: { type: "string" },
              description: { type: "string" },
              estimated_duration: { type: "string" },
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    order: { type: "integer" },
                    title: { type: "string" },
                    type: { type: "string", enum: ["action", "gate", "ai_assist"] },
                    description: { type: "string" },
                    output_type: { type: "string" },
                  },
                  required: ["order", "title", "type", "description"],
                  additionalProperties: false,
                },
              },
              compliance_gates: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["title", "source_playbook", "description", "steps", "compliance_gates"],
            additionalProperties: false,
          },
        },
        coaching_questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              context: { type: "string" },
              targets: { type: "string" },
            },
            required: ["question", "context", "targets"],
            additionalProperties: false,
          },
        },
        workbook_preview: {
          type: "object",
          properties: {
            title: { type: "string" },
            team_members: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  role: { type: "string" },
                },
                required: ["name", "role"],
                additionalProperties: false,
              },
            },
            active_protocols: {
              type: "array",
              items: { type: "string" },
            },
            current_session: {
              type: "object",
              properties: {
                executor_name: { type: "string" },
                protocol_title: { type: "string" },
                current_step: { type: "string" },
                step_number: { type: "integer" },
                total_steps: { type: "integer" },
                ai_draft_output: { type: "string" },
                compliance_score: { type: "number" },
              },
              required: ["executor_name", "protocol_title", "current_step", "step_number", "total_steps", "ai_draft_output"],
              additionalProperties: false,
            },
          },
          required: ["title", "team_members", "active_protocols", "current_session"],
          additionalProperties: false,
        },
        projected_learnings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              insight: { type: "string" },
              category: { type: "string", enum: ["efficiency", "quality", "compliance", "collaboration"] },
              refinement_action: { type: "string" },
            },
            required: ["title", "insight", "category", "refinement_action"],
            additionalProperties: false,
          },
        },
      },
      required: ["protocols", "coaching_questions", "workbook_preview", "projected_learnings"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { extraction_result } = await req.json();

    if (!extraction_result) {
      return new Response(JSON.stringify({ error: "extraction_result is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a concise summary of the extraction for the AI
    const extractionSummary = JSON.stringify({
      analysis_notes: extraction_result.analysis_notes,
      bundles: (extraction_result.bundles ?? []).map((b: any) => ({
        title: b.title,
        description: b.description,
        items: b.items.map((i: any) => ({
          title: i.title,
          category: i.category,
          content: i.content?.slice(0, 300),
          step_order_hint: i.step_order_hint,
          parent_playbook_title: i.parent_playbook_title,
          output_type: i.output_type,
          output_description: i.output_description,
        })),
      })),
      context_items: (extraction_result.context_items ?? []).map((i: any) => ({
        title: i.title,
        category: i.category,
        content: i.content?.slice(0, 200),
      })),
    });

    const userPrompt = `Based on the following extracted knowledge elements, generate a complete experience preview showing how this knowledge would operate in the LIZA AI Operating System.

**Extracted Knowledge:**
${extractionSummary}

**CRITICAL INSTRUCTIONS:**
1. Generate protocols that directly derive from the PLAYBOOKs and PROCEDUREs in the extraction
2. Coaching questions should be specific to THIS content — reference actual items by name
3. The workbook preview should feel realistic — use plausible team member names and roles appropriate to this domain
4. The AI draft output in the current session should be a realistic ~150-word draft that an AI would generate for that specific step, using the actual directives and knowledge from the extraction
5. Projected learnings should feel like genuine operational insights from running these specific protocols`;

    console.log("Calling AI gateway for experience simulation...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [TOOL_DEFINITION],
        tool_choice: { type: "function", function: { name: "generate_experience_preview" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "AI service is busy. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway returned ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("simulate-experience error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

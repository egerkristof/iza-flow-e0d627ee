import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * The Brief v3: AI Operating Model diagnosis.
 *
 * Input:  { goal, tools[], limitations[], free_text }
 * Output: structured diagnosis mapped to the LIZA grid (Intent / Knowledge / Execution).
 */

const VOICE = `Voice rules (hard):
- No em-dashes, no en-dashes. Ever.
- Statement-oriented. No hedging, no flattery, no "great question".
- Specific to what they said. Quote their own words back when it sharpens the point.
- Senior operator voice. Not consultant pitch, not vendor pitch.
- Never refer to "AI strategy". AI is an input to the operating model.`;

const GRID = `The LIZA grid has three layers stacked top to bottom:
- INTENT: what the leader is trying to achieve. The goal, the standard, the policy.
- KNOWLEDGE LAYER: the executable context that turns intent into instructions every AI surface inherits. Decision rules, playbooks, standards, written in one place, versioned, governed.
- EXECUTION: the AI tools, copilots, agents, and humans that actually do the work in the moment.

Most teams have INTENT (in their head) and EXECUTION (tools) but no KNOWLEDGE LAYER. That is the gap. Without it, every tool reinvents the standard, every prompt restarts the conversation, and no learning compounds.`;

const SYSTEM = `You are diagnosing a leader's AI Operating Model.

You receive: a goal, the AI tools they use today, the limitations they report, and optional free text.

You return a structured diagnosis with five parts:
1. current_model_read: one short paragraph naming what they are actually running today, in their register. Quote their goal back. Be specific.
2. tool_limitations: for each tool they named, the structural limitation that matters for their goal. Grounded in what that tool actually is. Do not invent tools they did not mention.
3. grid_status: status of each LIZA grid layer for them today. Status is "missing", "partial", or "working". Add a one-line why. The Knowledge Layer is almost always "missing" or "partial" for first-time leaders. Be honest.
4. blind_spots: 2 to 3 things the leader has probably not thought about, given the tools and limits they listed. Each has a title and a why. These should land as "I had not considered that."
5. correction: the one move that closes the biggest gap. What gets built, what changes, and which LIZA capability does it (knowledge layer / context bundles / executable playbooks / governed agents).

${VOICE}

${GRID}

Return via the tool call.`;

const DIAGNOSE_TOOL = {
  type: "function" as const,
  function: {
    name: "diagnose_operating_model",
    description: "Return the AI Operating Model diagnosis mapped to the LIZA grid.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short declarative title naming the diagnosis." },
        current_model_read: { type: "string", description: "One paragraph. What they actually run today." },
        tool_limitations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              tool: { type: "string" },
              limitation: { type: "string" },
            },
            required: ["tool", "limitation"],
          },
        },
        grid_status: {
          type: "object",
          properties: {
            intent: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["missing", "partial", "working"] },
                why: { type: "string" },
              },
              required: ["status", "why"],
            },
            knowledge: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["missing", "partial", "working"] },
                why: { type: "string" },
              },
              required: ["status", "why"],
            },
            execution: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["missing", "partial", "working"] },
                why: { type: "string" },
              },
              required: ["status", "why"],
            },
          },
          required: ["intent", "knowledge", "execution"],
        },
        blind_spots: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              why: { type: "string" },
            },
            required: ["title", "why"],
          },
        },
        correction: {
          type: "object",
          properties: {
            move: { type: "string", description: "The single move that closes the gap." },
            scope: { type: "string", description: "Who, how long, what gets produced." },
            liza_capability: { type: "string", description: "Which LIZA capability delivers it." },
          },
          required: ["move", "scope", "liza_capability"],
        },
      },
      required: ["title", "current_model_read", "tool_limitations", "grid_status", "blind_spots", "correction"],
    },
  },
};

async function callGateway(body: unknown) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const team: string | null = payload.team || null;
    const teamSub: string | null = payload.team_sub || null;
    const useCases: string[] = Array.isArray(payload.use_cases) ? payload.use_cases : [];
    const goal: string = (payload.goal || "").toString().trim();
    const tools: string[] = Array.isArray(payload.tools) ? payload.tools : [];
    const limitations: string[] = Array.isArray(payload.limitations) ? payload.limitations : [];
    const freeText: string = (payload.free_text || "").toString().trim();

    if (!goal && useCases.length === 0) {
      return new Response(JSON.stringify({ error: "use_cases or goal is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `TEAM
${team ? `${team}${teamSub ? ` (${teamSub})` : ""}` : "(not specified)"}

USE CASES THEY SELECTED
${useCases.length ? useCases.map((u) => `- ${u}`).join("\n") : "(none selected)"}

GOAL
${goal}

TOOLS IN USE TODAY
${tools.length ? tools.map((t) => `- ${t}`).join("\n") : "(none reported)"}

LIMITATIONS THEY ARE HITTING
${limitations.length ? limitations.map((l) => `- ${l}`).join("\n") : "(none reported)"}

ADDITIONAL CONTEXT
${freeText || "(none)"}

Diagnose their AI Operating Model for this specific team. Be specific to ${team || "their function"}. Reference their actual use cases and tool stack.`;

    const response = await callGateway({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      tools: [DIAGNOSE_TOOL],
      tool_choice: { type: "function", function: { name: "diagnose_operating_model" } },
      max_tokens: 3000,
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Generation failed." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const diagnosis = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-brief error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
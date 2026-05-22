import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are writing a single working brief for a business or team leader who already thinks in systems. They have just answered four prompts about their patch.

Your job: turn their four answers into a one-screen working brief their boss would read. Statement-oriented, quiet, specific. No filler, no flattery, no hedging. No em-dashes or en-dashes.

Return a JSON object with this exact shape:

{
  "title": "A brief on [their function or patch, inferred] over the next 18 months.",
  "shape_of_the_patch": "Two to three sentences synthesising what their function is and what the org is trying to become. Concrete, specific to what they wrote.",
  "what_is_coming": "Two to three sentences synthesising market movement and AI reality that will hit this function.",
  "ai_shaped_future": [
    "Paragraph 1: a concrete picture of one part of this function operating in an AI-shaped way. Specific to their inputs.",
    "Paragraph 2: a second concrete shift, somewhere else in the function.",
    "Paragraph 3: what the leader's role looks like in that version."
  ],
  "what_it_takes": [
    "Foundation 1: a defined version of the context this function runs on (strategy, decisions, taxonomy).",
    "Foundation 2: standards captured from the people doing the work, so the AI does not invent them.",
    "Foundation 3: a system that holds the context and standards in one place and feeds them to every tool."
  ]
}

Rules:
- Be specific to what they wrote. Do not produce generic AI-strategy language.
- Each field is plain prose. No markdown, no bullets inside fields.
- Keep total output under ~500 words.
- Never use em-dashes or en-dashes.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { inputs } = await req.json();
    if (!inputs || typeof inputs !== "object") {
      return new Response(JSON.stringify({ error: "inputs required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { strategy, market, team, ai } = inputs as Record<string, string>;
    if (!strategy || !market || !team || !ai) {
      return new Response(JSON.stringify({ error: "All four inputs are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `STRATEGY (what the org is trying to become over 18 months):
${strategy}

MARKET REALITY (what is moving in the market that will hit this function):
${market}

TEAM REALITY (what the team does day to day, where the work breaks):
${team}

AI REALITY (AI already in and around this patch, what it does or fails to do):
${ai}

Write the brief now.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "render_brief",
              description: "Return the structured working brief.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  shape_of_the_patch: { type: "string" },
                  what_is_coming: { type: "string" },
                  ai_shaped_future: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3,
                  },
                  what_it_takes: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3,
                  },
                },
                required: ["title", "shape_of_the_patch", "what_is_coming", "ai_shaped_future", "what_it_takes"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "render_brief" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
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

    const brief = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ brief }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
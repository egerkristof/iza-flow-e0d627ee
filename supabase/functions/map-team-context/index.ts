import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const KNOWN_INDUSTRIES = ["pharma", "profservices", "tech", "manufacturing"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { industry, team } = await req.json();
    if (!industry || !team) {
      return new Response(JSON.stringify({ error: "industry and team are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You map custom industry/team combinations to the closest matching predefined industry context for an AI execution diagnostic assessment. The available industry contexts are: "pharma" (Pharma & Life Sciences - R&D, regulatory, clinical, quality), "profservices" (Professional Services - consulting, legal, accounting, advisory), "tech" (Tech & SaaS - engineering, product, data, DevOps), "manufacturing" (Manufacturing & Engineering - quality, supply chain, design). Choose the one whose work patterns and AI usage scenarios most closely match the given industry and team.`,
          },
          {
            role: "user",
            content: `Industry: "${industry}"\nTeam/Function: "${team}"\n\nWhich predefined industry context is the closest match?`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "map_context",
              description: "Map to the closest predefined industry context",
              parameters: {
                type: "object",
                properties: {
                  mapped_industry: {
                    type: "string",
                    enum: KNOWN_INDUSTRIES,
                    description: "The closest matching predefined industry key",
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation of why this mapping was chosen",
                  },
                },
                required: ["mapped_industry", "reasoning"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "map_context" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fallback to profservices as a safe default
      return new Response(JSON.stringify({ mapped_industry: "profservices", reasoning: "Fallback default" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ mapped_industry: "profservices", reasoning: "No AI response, using default" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("map-team-context error:", e);
    return new Response(
      JSON.stringify({ mapped_industry: "profservices", reasoning: "Error fallback" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

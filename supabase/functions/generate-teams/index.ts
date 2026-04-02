import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { industry } = await req.json();
    if (!industry || typeof industry !== "string" || industry.trim().length < 2) {
      return new Response(JSON.stringify({ error: "industry is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
            content: `You are an organizational structure expert. Given an industry, return 5-7 common team/function names that would exist in companies in that industry. Return teams that are specific enough to be meaningful but broad enough to cover most companies. Always include an "Other" option as the last item.`,
          },
          {
            role: "user",
            content: `Industry: "${industry.trim()}"\n\nReturn the teams as a JSON array of objects with "key" (lowercase slug) and "label" (display name). Example: [{"key":"operations","label":"Operations"}]. Include 5-7 teams plus "Other" at the end.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_teams",
              description: "Return the list of teams for the given industry",
              parameters: {
                type: "object",
                properties: {
                  teams: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        key: { type: "string", description: "Lowercase slug identifier" },
                        label: { type: "string", description: "Display name" },
                      },
                      required: ["key", "label"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["teams"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_teams" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to generate teams" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No structured response from AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    let teams = parsed.teams || [];

    // Ensure "other" is always last
    teams = teams.filter((t: any) => t.key !== "other");
    teams.push({ key: "other", label: "Other" });

    return new Response(JSON.stringify({ teams }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-teams error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

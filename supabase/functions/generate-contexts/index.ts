import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Generic (role-neutral) context texts keyed by question id.
 * These serve as the structural template the AI rewrites.
 */
const GENERIC_CONTEXTS: Record<string, string> = {
  si1: "Picture this: a team member sits down to work on an important deliverable with AI. They open a new chat window.",
  si2: "Your team has a defined way of doing a key task, a methodology you've refined over years.",
  oc1: "Two people on your team receive the same brief. Both use AI to produce the deliverable.",
  oc2: "Your strongest AI user is on holiday for two weeks. The work continues without them.",
  kc1: "Last month, someone on your team discovered a significantly better way to handle a recurring task with AI.",
  kc2: "Think about how your team used AI six months ago versus today.",
  cv1: "A junior team member wants to learn how a senior colleague navigates ambiguity during an AI session.",
  cv2: "You're deciding who should use AI for which parts of a project.",
  lv1: "A major project just wrapped. The team used AI extensively throughout.",
  lv2: "A new AI technique emerges that's directly relevant to your team's work.",
};

const QUESTION_IDS = ["si1", "si2", "oc1", "oc2", "kc1", "kc2", "cv1", "cv2", "lv1", "lv2"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { industry, team } = await req.json();
    if (!industry || !team) {
      return new Response(JSON.stringify({ error: "industry and team are required" }), {
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
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are rewriting scene-setting story contexts for a team AI execution maturity diagnostic. The user works in the "${industry}" industry in the "${team}" role/team.

Your job: rewrite each of the 10 generic context paragraphs so they feel specific, vivid, and immediately recognisable to someone in that exact role and industry. Use realistic job-specific language, tools, deliverables, and scenarios they would encounter daily.

Rules:
- Each context must be 1-2 sentences, under 40 words
- Use second person ("you") or third person that feels relatable to the role
- Do NOT mention "AI execution diagnostic" or break the fourth wall
- Do NOT use em-dashes
- Keep the same underlying theme as the generic version (it tests the same dimension)
- Make the persona feel seen: reference their actual work, not generic business language`,
          },
          {
            role: "user",
            content: `Rewrite these 10 context paragraphs for a ${team} professional in ${industry}:\n\n${QUESTION_IDS.map(
              (id) => `${id}: "${GENERIC_CONTEXTS[id]}"`
            ).join("\n\n")}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_contexts",
              description: "Set all 10 rewritten context paragraphs",
              parameters: {
                type: "object",
                properties: Object.fromEntries(
                  QUESTION_IDS.map((id) => [
                    id,
                    { type: "string", description: `Rewritten context for question ${id}` },
                  ])
                ),
                required: QUESTION_IDS,
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "set_contexts" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      // Return generic contexts as fallback
      return new Response(JSON.stringify({ contexts: GENERIC_CONTEXTS }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(JSON.stringify({ contexts: GENERIC_CONTEXTS }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contexts = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ contexts }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-contexts error:", e);
    return new Response(JSON.stringify({ contexts: null, error: "Failed to generate contexts" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

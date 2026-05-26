import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// extract-brief
// ─────────────
// Narrative-first input for The Brief.
//
// Input:
//   {
//     narrative: string,    // 2-4 sentences from the user describing a recent
//                           // AI-in-the-loop decision and what was hard about it
//     follow_up_answer?: string  // optional answer to the previous follow-up
//     prior?: Extraction         // prior extraction to refine, if any
//   }
//
// Output:
//   {
//     extraction: Extraction,
//     follow_up: { question: string; focus: string } | null
//   }
//
// The LLM does the structured listening so the user can write one paragraph
// instead of clicking through 25 chips.

const TEAM_IDS = [
  "sales",
  "marketing",
  "customer_success",
  "operations",
  "product_engineering",
  "rnd",
  "finance",
  "people",
  "strategy",
  "general",
] as const;

const SYSTEM = `You are a senior operator listening to a leader describe how AI shows up in their org. From a short paragraph (and an optional follow-up answer), you produce a structured extraction the diagnostic engine can use.

You are NOT writing the diagnosis. You are listening carefully and naming what you heard.

Output rules:
- Be conservative. If a field is not clearly implied by what they wrote, leave it null or an empty array. The user will confirm.
- For streams (strategy/market/state/signal) and audits (cost/best_practice/security/decision/drift), only mark "lit"/"green" if they describe it as actually in place. Mark "dark"/"red" if they describe the absence. Mark "partial"/"amber" if mixed.
- Tools: extract concrete product names mentioned (ChatGPT, Claude, Copilot, Notion, Custom GPTs, Cursor, GitHub Copilot, Glean, internal RAG, agent frameworks, etc.). If they say "consumer AI" or similar, leave it.
- Handoff: who else touches the AI output before it lands (e.g. legal, deal desk, sales engineering, the customer, brand).
- Bruise: the single sentence that names what is actually painful. Paraphrase tightly, do not embellish.
- Vantage: "operator" if they run the function, "enabler" if they set the standard across many functions.
- Team: pick the closest from the enum. Use "general" only if truly cross-functional.

Follow-up question rules:
- Return ONE short follow-up question that will most sharpen the read. Aim for the most ambiguous or most-impactful gap in the extraction.
- Make it specific and answerable in one sentence. Not a survey question.
- Focus must be the JSON key you are trying to disambiguate (e.g. "audits.decision", "streams.signal", "handoff", "bundle.directive").
- If the extraction is already strong, return null for follow_up.

Voice: senior, no jargon, no em-dashes, no hedging.`;

const STREAM_STATUS = { type: ["string", "null"], enum: ["lit", "partial", "dark", null] } as const;
const AUDIT_STATUS = { type: ["string", "null"], enum: ["green", "amber", "red", null] } as const;

const EXTRACT_TOOL = {
  type: "function" as const,
  function: {
    name: "extract_brief",
    description: "Return a structured extraction of the user's narrative plus one follow-up question.",
    parameters: {
      type: "object",
      properties: {
        extraction: {
          type: "object",
          properties: {
            team: { type: ["string", "null"], enum: [...TEAM_IDS, null] },
            vantage: { type: ["string", "null"], enum: ["operator", "enabler", null] },
            tools: { type: "array", items: { type: "string" } },
            handoff: { type: "array", items: { type: "string" } },
            bruise: { type: ["string", "null"] },
            streams: {
              type: "object",
              properties: {
                strategy: STREAM_STATUS,
                market: STREAM_STATUS,
                state: STREAM_STATUS,
                signal: STREAM_STATUS,
              },
              required: ["strategy", "market", "state", "signal"],
            },
            audits: {
              type: "object",
              properties: {
                cost: AUDIT_STATUS,
                best_practice: AUDIT_STATUS,
                security: AUDIT_STATUS,
                decision: AUDIT_STATUS,
                drift: AUDIT_STATUS,
              },
              required: ["cost", "best_practice", "security", "decision", "drift"],
            },
            confidence_note: {
              type: "string",
              description: "One short sentence naming what you heard most clearly and what you are guessing at.",
            },
          },
          required: ["team", "vantage", "tools", "handoff", "bruise", "streams", "audits", "confidence_note"],
        },
        follow_up: {
          type: ["object", "null"],
          properties: {
            question: { type: "string" },
            focus: { type: "string" },
          },
          required: ["question", "focus"],
        },
      },
      required: ["extraction", "follow_up"],
    },
  },
};

async function callGateway(body: unknown) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
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
    const { narrative, follow_up_answer, prior } = await req.json();
    if (!narrative || typeof narrative !== "string" || narrative.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Narrative must be at least a sentence." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = `NARRATIVE
${narrative.trim()}
${prior ? `\nPRIOR EXTRACTION (refine it, do not start from scratch)\n${JSON.stringify(prior)}` : ""}
${follow_up_answer ? `\nFOLLOW-UP ANSWER\n${follow_up_answer.trim()}` : ""}

Extract the structured fields. Return one follow-up question only if it materially sharpens the diagnosis. If everything is already clearly named, return follow_up = null.`;

    const response = await callGateway({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      tools: [EXTRACT_TOOL],
      tool_choice: { type: "function", function: { name: "extract_brief" } },
      max_tokens: 2500,
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
      console.error("extract-brief gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("extract-brief: no tool call", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Extraction failed." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-brief error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
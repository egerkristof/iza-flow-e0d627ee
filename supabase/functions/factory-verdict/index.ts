// Generates the Factory Floor verdict letter from 3 free-text answers.
// Uses Lovable AI Gateway (google/gemini-2.5-flash).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a senior AI operations advisor writing a one-page verdict letter to a Head of AI at a DACH enterprise (Allianz, Bosch, Henkel, Munich Re tier).

You have THREE inputs from them:
1. PROMISE: what their CEO or board has promised about AI for next quarter.
2. WORKFLOW: the one real AI workflow they would point to if asked tomorrow.
3. GRADING: who graded its last output, and against what.

Your job: write a sober, surgical letter in their language. Second person. Signed.

TONE: German-precise. Declarative. No American sales energy. No "amazing", "exciting", "imagine if". No emoji. No em-dashes or en-dashes. No exclamation marks.

FRAME: The gap between what was promised and what can be governed is the entire story. The cost is not the tokens. The cost is that nobody can name what one output costs, who graded it, or against what standard. Seat rollouts and license deals do not solve this. Governance and unit economics do.

STRUCTURE: Return strict JSON with these fields:
- headline: ONE sentence, max 18 words. The verdict in their words. Quotable in a board deck.
- gap_named: 2 sentences. The specific structural gap their three answers reveal. Name it precisely.
- breaks_next_quarter: array of exactly 3 strings. Each is one sentence. Each names a concrete consequence that lands in the next 90 days if the gap stays open. Reference their workflow by name where it sharpens.
- the_call: 2 sentences. What a 20 minute call would specifically resolve for them. Not generic. Tied to their answers.
- signoff_quote: ONE short line. Maximum 12 words. The aphorism they carry into Monday.

RULES:
- Use the user's own nouns from their PROMISE and WORKFLOW answers. If they said "contract review", say "contract review", not "your AI workflow".
- Do not invent metrics or numbers they did not provide.
- Do not use the words "factory", "workshop", "standards engineering". Earn the metaphor through specifics, not labels.
- If their grading answer is vague ("nobody really", "the team"), name that as the structural exposure.
- Do not mention LIZA, vendors, products, or platforms. The letter sells the conversation, not the tool.
- Output ONLY valid JSON. No prose around it. No markdown fences.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { promise, workflow, grading } = await req.json();
    if (!promise || !workflow || !grading) {
      return new Response(JSON.stringify({ error: "promise, workflow, grading required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMsg = `PROMISE: ${promise}\n\nWORKFLOW: ${workflow}\n\nGRADING: ${grading}\n\nWrite the letter.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const body = await aiRes.text();
      console.error("AI gateway error", aiRes.status, body);
      return new Response(JSON.stringify({ error: "AI generation failed", status: aiRes.status }), {
        status: aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let verdict: unknown;
    try {
      verdict = JSON.parse(raw);
    } catch {
      console.error("Bad JSON from model", raw);
      return new Response(JSON.stringify({ error: "model returned invalid JSON" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ verdict }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("factory-verdict error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * The Brief v2: function-specific operating diagnosis across four decision domains.
 *
 * Modes:
 *   "score_domain"         -> score one domain (tier 0..3 + bridge + effort + unlock)
 *   "synthesize_diagnosis" -> takes all 4 domain scores + seat, returns token-economics ranking
 *                             and the "start here" call, plus the one-page leader narrative.
 */

const VOICE = `Voice rules (hard):
- No em-dashes, no en-dashes. Ever.
- Statement-oriented. No hedging, no flattery, no "great question", no "sounds like".
- Specific to what they said. Quote their own words back when it sharpens the point.
- Senior operator voice. Not consultant, not vendor.
- AI is an input to the function. Never refer to "AI strategy" as the thing being built.`;

const TIER_LEGEND = `Maturity tiers (use these exact names):
- Tier 0 Tacit: decision lives in someone's head, cannot be handed off.
- Tier 1 Recorded: exists in scattered files, decks, or people. Not one source.
- Tier 2 Standardised: one place, one version, everyone references it.
- Tier 3 Executable: runs as code or AI can use it directly. The system can make routine calls.`;

const SCORE_DOMAIN_SYSTEM = `You are scoring one decision domain for a specific operating leader, on a 4-tier maturity scale.

${TIER_LEGEND}

You receive: the leader's seat (function, unit shape, scale), the domain being scored, and their two answers (the signal they trust + the substrate that produces it).

Your job:
1. Pick the tier (0, 1, 2, or 3) the answers actually describe. Be honest. "I ask Maria" is Tier 0. "Spreadsheet I update" is Tier 1. "Live dashboard everyone uses" is Tier 2. "System makes the routine call itself" is Tier 3.
2. Pick a target tier they should reach. Usually current+1 or current+2 if the leap is realistic for their scale.
3. Write the bridge: the one move that closes the gap. Name what gets built, who owns it. No "explore" verbs.
4. Estimate effort: weeks + headcount role.
5. Name the unlock: the concrete thing that changes for the leader if this gets done.
6. Write a one-line justification quoting their own words.

${VOICE}

Return via the tool call.`;

const SYNTHESIZE_SYSTEM = `You are synthesising a one-page operating diagnosis for a leader, after scoring four decision domains: Demand, Capacity, Quality, Economics.

You receive: the seat (function, unit shape, scale), and the four domain scores with their bridges.

Your job:
1. Write the leader narrative: 3 to 5 short paragraphs naming the unit as it actually runs today, in the leader's own register. Specific. No template feel.
2. Rank the four domains for AI economic return in this leader's unit. Use "high", "medium", or "low". Anchor to the substrate: a domain at Tier 0 or 1 with no data is "low" today even if structurally high. A domain at Tier 2 with high-volume decisions is "high".
3. Pick the single START HERE domain. The one where tokens convert to margin fastest given current substrate. Justify in one sentence.
4. Write the trade-off: the one thing the leader is avoiding that has to give. Direct.

${VOICE}
${TIER_LEGEND}

Return via the tool call.`;

function formatSeat(seat: Record<string, string>): string {
  return `Function: ${seat.function_label || seat.function_id || "(?)"}
Unit shape: ${seat.unit_shape || "(?)"}
Scale: ${seat.scale || "(?)"}`;
}

async function callGateway(body: unknown) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

const SCORE_DOMAIN_TOOL = {
  type: "function" as const,
  function: {
    name: "score_domain",
    description: "Return tier, target, bridge, effort, unlock, justification.",
    parameters: {
      type: "object",
      properties: {
        current_tier: { type: "integer", enum: [0, 1, 2, 3] },
        target_tier: { type: "integer", enum: [0, 1, 2, 3] },
        justification: { type: "string", description: "One line. Quote their words." },
        bridge: { type: "string", description: "The one move that closes the gap. What gets built, who owns it." },
        effort_weeks: { type: "integer", minimum: 1, maximum: 26 },
        effort_role: { type: "string", description: "Headcount role required, e.g. 'one ops analyst plus a sponsor'." },
        unlock: { type: "string", description: "What changes for the leader if this gets done. Specific." },
      },
      required: ["current_tier", "target_tier", "justification", "bridge", "effort_weeks", "effort_role", "unlock"],
      additionalProperties: false,
    },
  },
};

const SYNTHESIZE_TOOL = {
  type: "function" as const,
  function: {
    name: "synthesize_diagnosis",
    description: "Return narrative, AI ROI ranking, start-here pick, and the trade-off.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short declarative title naming the unit." },
        narrative: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
        ai_ranking: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              domain: { type: "string", enum: ["demand", "capacity", "quality", "economics"] },
              roi: { type: "string", enum: ["high", "medium", "low"] },
              why: { type: "string", description: "One line, unit-specific." },
            },
            required: ["domain", "roi", "why"],
            additionalProperties: false,
          },
        },
        start_here: {
          type: "object",
          properties: {
            domain: { type: "string", enum: ["demand", "capacity", "quality", "economics"] },
            reason: { type: "string" },
          },
          required: ["domain", "reason"],
          additionalProperties: false,
        },
        trade_off: { type: "string", description: "The thing they are avoiding that has to give." },
      },
      required: ["title", "narrative", "ai_ranking", "start_here", "trade_off"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const mode: "score_domain" | "synthesize_diagnosis" = payload.mode;

    if (mode !== "score_domain" && mode !== "synthesize_diagnosis") {
      return new Response(JSON.stringify({ error: "mode must be score_domain or synthesize_diagnosis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const seat = payload.seat ?? {};
    let userPrompt = "";
    let tool;
    let toolName: string;
    let systemPrompt: string;

    if (mode === "score_domain") {
      const domain = payload.domain;
      const probe = payload.probe ?? {};
      const answers = payload.answers ?? {};
      if (!domain || !answers.signal || !answers.substrate) {
        return new Response(JSON.stringify({ error: "domain, probe, answers.signal, answers.substrate required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      systemPrompt = SCORE_DOMAIN_SYSTEM;
      tool = SCORE_DOMAIN_TOOL;
      toolName = "score_domain";
      userPrompt = `SEAT
${formatSeat(seat)}

DOMAIN: ${domain}

SIGNAL QUESTION: ${probe.signal_prompt || "(signal)"}
SIGNAL ANSWER: ${answers.signal}

SUBSTRATE QUESTION: ${probe.substrate_prompt || "(substrate)"}
SUBSTRATE ANSWER: ${answers.substrate}

Score this domain. Tier choice should be honest, not generous.`;
    } else {
      const scores = payload.scores;
      if (!scores || typeof scores !== "object") {
        return new Response(JSON.stringify({ error: "scores object required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      systemPrompt = SYNTHESIZE_SYSTEM;
      tool = SYNTHESIZE_TOOL;
      toolName = "synthesize_diagnosis";
      userPrompt = `SEAT
${formatSeat(seat)}

DOMAIN SCORES
${(["demand", "capacity", "quality", "economics"] as const)
  .map((d) => {
    const s = scores[d];
    if (!s) return `${d.toUpperCase()}: (no score)`;
    return `${d.toUpperCase()}
  current tier: ${s.current_tier} -> target tier: ${s.target_tier}
  why: ${s.justification}
  bridge: ${s.bridge}
  effort: ${s.effort_weeks} weeks, ${s.effort_role}
  unlock: ${s.unlock}`;
  })
  .join("\n\n")}

RAW ANSWERS (for narrative voice)
${JSON.stringify(payload.raw_answers || {}, null, 2)}

Synthesise the diagnosis.`;
    }

    const response = await callGateway({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [tool],
      tool_choice: { type: "function", function: { name: toolName } },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Try again shortly." }), {
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

    const parsed = JSON.parse(toolCall.function.arguments);
    const body =
      mode === "score_domain" ? { score: parsed } : { diagnosis: parsed };

    return new Response(JSON.stringify(body), {
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
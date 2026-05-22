import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * The Brief, GM edition.
 *
 * One edge function, two modes:
 *   mode: "next_question"  -> returns the next sharp question to ask, given intake + history
 *   mode: "final_brief"    -> returns the asymmetric brief, given intake + full history
 *
 * Audience is locked: Head of a Business Unit / GM / P&L owner of a slice of the company.
 * Not abstract architects. Not chiefs of staff. The seat that owns numbers.
 */

const SHARED_VOICE = `Voice rules (hard):
- No em-dashes, no en-dashes. Ever.
- Statement-oriented. No hedging, no flattery, no "great question", no "it sounds like".
- Specific to what they said. Quote their own words back when it sharpens the point.
- Talk like a senior operator who has run a P&L, not a strategy consultant pitching.
- Never say "AI strategy" as a noun. AI is an input to the function, not the function.`;

const PERSONA_CONTEXT = `Who you are talking to:
A GM or Head of a Business Unit. They own a P&L slice. Region, product line, segment, BU. 200 to 2,000 people under them. They get measured every quarter on a small set of numbers. They already run a private model in their head of how the unit should work. They have not written it down. Their boss has not asked them to. They want to.

They do not need:
- a generic AI primer
- a framework lecture
- another vendor pitch
- vague encouragement

They need:
- someone who engages with their actual unit
- pushback that names the trade-off they are dodging
- a frame they can put in front of their boss next week`;

const NEXT_QUESTION_SYSTEM = `You are a sparring partner for a GM, working through a 10 minute session to externalise their private model of how their business unit should run over the next 18 months.

${PERSONA_CONTEXT}

Your job in this turn: produce the single next question, given intake and prior answers.

Question design rules:
1. Each question must be specific to their unit, their KPI, and their prior answers. Never generic.
2. Reference what they already said. If their last answer was thin or evasive, push on that.
3. Mix the question types across the session:
   - a numbers question (what moves the KPI, what blocks it, where margin leaks)
   - a people/work question (where the work breaks, where knowledge sits in heads, who carries the unit on their back)
   - a market question (what is shifting that they will have to absorb in 12 to 18 months)
   - a pushback question (name a trade-off they are avoiding, ask them to confront it)
   - a future-state question (what the unit looks like in 18 months if they get to design it)
4. Exactly one of the questions in the session must be explicit pushback. Phrase it bluntly. Example shape: "You said X. You did not mention Y. In a unit like yours that usually means Z. Is Z true here, or are you protecting something?"
5. Never ask two questions at once. One clean question per turn.
6. Keep it under 45 words. Punchy. No preamble.

${SHARED_VOICE}

Return via the tool call.`;

const FINAL_BRIEF_SYSTEM = `You are writing The Brief: a one-page working document for a GM, synthesised from a 10 minute sparring session you just ran with them.

${PERSONA_CONTEXT}

The Brief is what they will put in front of their boss, their peers, or their own leadership team. It must read like a senior operator wrote it, not a consultant deck. Specific to their unit. Asymmetric, shaped by what they said. No template feel.

Output shape (return via tool call):

- title: short, declarative, names their unit. Example: "A working brief on the EMEA mid-market unit, next 18 months." No colons or dashes, plain prose.
- the_unit_today: 3 to 5 sentences. The unit as it actually runs today. Concrete: what it sells, to whom, how the work moves, what the number is. Use their own language.
- the_number: 2 to 3 sentences. The KPI their boss tracks them on, what currently moves it, what currently blocks it. Name the blocker directly.
- the_eighteen_month_picture: 3 to 5 short paragraphs. The version of the unit in 18 months if their private model gets built. Concrete shifts, not principles. Each paragraph picks one part of the unit and shows it operating differently. At least one paragraph must describe how the leader's own week changes.
- the_three_moves: array of exactly 3 items. Each item is one specific move that closes the gap between today and the 18 month picture. Each move names: what gets built, who owns it, what it changes about the number. Sharp. No "explore" or "consider" verbs.
- the_trade_off: 2 to 3 sentences. Name the trade-off they are avoiding. The thing that has to give for this picture to be real. Be direct. This is the part their boss will respect.
- what_it_takes_underneath: array of exactly 3 items. The foundation that has to exist for the three moves to compound instead of evaporate. Frame as: a defined context for the unit, captured standards from the people doing the work, one system that holds both and feeds every tool. Tie each item to something specific they said. Do not say "LIZA". The handoff happens in the UI, not in the brief.

${SHARED_VOICE}

Total length: 450 to 700 words across all fields. Tight. No filler.`;

function formatHistory(history: Array<{ question: string; answer: string }>): string {
  if (!history.length) return "(no prior questions yet)";
  return history
    .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
    .join("\n\n");
}

function formatIntake(intake: Record<string, string>): string {
  return `Unit type: ${intake.unit || "(not given)"}
Scope and size: ${intake.scope || "(not given)"}
The number they are measured on: ${intake.kpi || "(not given)"}`;
}

async function callGateway(body: unknown) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const mode: "next_question" | "final_brief" = payload.mode;
    const intake = payload.intake ?? {};
    const history: Array<{ question: string; answer: string }> = payload.history ?? [];

    if (!mode || (mode !== "next_question" && mode !== "final_brief")) {
      return new Response(JSON.stringify({ error: "mode must be next_question or final_brief" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!intake.unit || !intake.scope || !intake.kpi) {
      return new Response(JSON.stringify({ error: "intake.unit, intake.scope, intake.kpi are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `INTAKE
${formatIntake(intake)}

SESSION SO FAR
${formatHistory(history)}

${
  mode === "next_question"
    ? `Produce the next question. This is question ${history.length + 1} of 5. ${
        history.length + 1 === 5
          ? "This is the final question, make it the future-state question: what the unit looks like in 18 months if they get to design it."
          : history.length + 1 === 3 || history.length + 1 === 4
            ? "If you have not yet produced an explicit pushback question this session, this is the turn to do it."
            : ""
      }`
    : "Write The Brief now. Use everything they said. Be specific. Be asymmetric. No template feel."
}`;

    const tools =
      mode === "next_question"
        ? [
            {
              type: "function",
              function: {
                name: "next_question",
                description: "Return the next single question for the GM.",
                parameters: {
                  type: "object",
                  properties: {
                    label: {
                      type: "string",
                      description:
                        "One or two word category, e.g. 'The number', 'Where it breaks', 'Pushback', 'Eighteen months out'.",
                    },
                    question: { type: "string", description: "The question itself, under 45 words." },
                    helper: {
                      type: "string",
                      description: "One short line of context or framing. Optional but preferred. Max 20 words.",
                    },
                  },
                  required: ["label", "question"],
                  additionalProperties: false,
                },
              },
            },
          ]
        : [
            {
              type: "function",
              function: {
                name: "render_brief",
                description: "Return the asymmetric working brief for the GM.",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    the_unit_today: { type: "string" },
                    the_number: { type: "string" },
                    the_eighteen_month_picture: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 3,
                      maxItems: 5,
                    },
                    the_three_moves: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 3,
                      maxItems: 3,
                    },
                    the_trade_off: { type: "string" },
                    what_it_takes_underneath: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 3,
                      maxItems: 3,
                    },
                  },
                  required: [
                    "title",
                    "the_unit_today",
                    "the_number",
                    "the_eighteen_month_picture",
                    "the_three_moves",
                    "the_trade_off",
                    "what_it_takes_underneath",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ];

    const toolName = mode === "next_question" ? "next_question" : "render_brief";

    const response = await callGateway({
      model: "google/gemini-2.5-pro",
      messages: [
        {
          role: "system",
          content: mode === "next_question" ? NEXT_QUESTION_SYSTEM : FINAL_BRIEF_SYSTEM,
        },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: { type: "function", function: { name: toolName } },
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

    const parsed = JSON.parse(toolCall.function.arguments);
    const responseBody = mode === "next_question" ? { question: parsed } : { brief: parsed };

    return new Response(JSON.stringify(responseBody), {
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
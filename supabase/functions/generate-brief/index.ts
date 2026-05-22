import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * The Brief v4 — LIZA Operator Framework diagnosis.
 *
 * Input:  { team, team_sub, use_cases[], tools[],
 *           streams: { strategy|market|state|signal: "lit"|"partial"|"dark" },
 *           audits:  { cost|best_practice|security|decision|drift: "green"|"amber"|"red" },
 *           free_text }
 *
 * Output: structured diagnosis covering streams, audits, bundle gaps,
 *         decision class read, blind spots, and correction.
 */

const VOICE = `Voice rules (hard):
- No em-dashes, no en-dashes. Ever.
- Statement-oriented. No hedging, no flattery, no "great question".
- Specific to the team's actual stack and answers. Quote their selections back when it sharpens the point.
- Senior operator voice. Not consultant pitch, not vendor pitch.
- Never refer to "AI strategy". AI is an input to the operating model.`;

const FRAMEWORK = `LIZA Operator Framework — the dominant logic.

THE MOMENT OF WORK
Every decision requires four streams of context to converge inside one governed container:
- STRATEGY (top): mandates, OKRs, policy, risk. What leadership has decided.
- MARKET (left): external signals. Regulation, competitor moves, best practice.
- STATE (right): prior artifacts, dependencies, decisions already taken.
- SIGNAL (bottom): KPIs, drift, anomalies, incidents.
Most teams' AI sees one or two streams. The operator's job is to fuse all four.

THE GOVERNANCE CONTAINER
Five live audits run on every output before it ships:
1. Token & Cost: COGS per call, model routing, prompt envelope.
2. Best Practice: output conforms to the locked standard or playbook.
3. Data Security: PII, residency, role scope, retention.
4. Decision Audit: rationale chain, evidence, decision class.
5. Drift & Standards: standard freshness, deviation from prior decisions.

THE KNOWLEDGE BUNDLE (six types, between intent and execution)
- Playbook: strategic driver, what the work is and why.
- Procedure: atomic executable steps with gate logic.
- Directive: non-negotiable compliance constraint.
- Principle: judgment heuristic for ambiguous decisions.
- Preference: style, voice, format.
- Knowledge: reference context that informs but does not direct.

THREE DECISION CLASSES (priced by weight of decision, not tokens)
- OD (Operational Decision, 1x): single artifact, reversible, peer review.
- GC (Governed Change, 5x): standard or playbook change, affects every future run, senior sign-off.
- SS (Strategic Simulation, 25x): sandbox, informs investment or M&A, partner approval.
Most teams govern OD by default. GC and SS run free or get the same oversight as OD.

THE GAP
Most teams have INTENT (in heads) and EXECUTION (tools) but no executable knowledge bundle between them, no convergence of all four streams, and no live governance container. That is what LIZA installs.`;

const SYSTEM = `You are diagnosing a leader's AI Operating Model using the LIZA Operator Framework.

The user has already self-reported their stream coverage (lit/partial/dark) and audit coverage (green/amber/red). Treat these as ground truth. Your job is to interpret them, surface what they imply, and prescribe the one correction that closes the biggest gap.

Return a structured diagnosis:
1. title: short declarative line naming the operating model state.
2. current_model_read: one short paragraph naming what they actually run today, grounded in their team, tools, and stream/audit answers.
3. stream_coverage: echo back each stream with the user's status and a one-line why specific to their team.
4. audit_coverage: echo back each audit with the user's status and a one-line why specific to their team.
5. bundle_gaps: for each of the six bundle types (playbook, procedure, directive, principle, preference, knowledge), state status (have/partial/missing) and one-line why. Infer from their answers. Most teams will be missing most of these.
6. decision_class_read: which classes they currently govern (governed_today) and one paragraph (exposed) naming what they are exposed on.
7. blind_spots: 2 to 3 things the leader has probably not thought about. Each lands as "I had not considered that."
8. correction: the one move that closes the biggest gap. Name the move, the scope (owner, weeks, output), and which LIZA capability delivers it (knowledge bundle, state-locked playbook, governance container, decision-class router, etc.).

${VOICE}

${FRAMEWORK}

Return via the tool call.`;

const STREAM_STATUS = { type: "string", enum: ["lit", "partial", "dark"] } as const;
const AUDIT_STATUS = { type: "string", enum: ["green", "amber", "red"] } as const;
const BUNDLE_STATUS = { type: "string", enum: ["have", "partial", "missing"] } as const;
const DECISION_CLASS = { type: "string", enum: ["od", "gc", "ss"] } as const;

const streamProp = {
  type: "object",
  properties: { status: STREAM_STATUS, why: { type: "string" } },
  required: ["status", "why"],
};
const auditProp = {
  type: "object",
  properties: { status: AUDIT_STATUS, why: { type: "string" } },
  required: ["status", "why"],
};

const DIAGNOSE_TOOL = {
  type: "function" as const,
  function: {
    name: "diagnose_operator_framework",
    description: "Return the LIZA Operator Framework diagnosis.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        current_model_read: { type: "string" },
        stream_coverage: {
          type: "object",
          properties: {
            strategy: streamProp,
            market: streamProp,
            state: streamProp,
            signal: streamProp,
          },
          required: ["strategy", "market", "state", "signal"],
        },
        audit_coverage: {
          type: "object",
          properties: {
            cost: auditProp,
            best_practice: auditProp,
            security: auditProp,
            decision: auditProp,
            drift: auditProp,
          },
          required: ["cost", "best_practice", "security", "decision", "drift"],
        },
        bundle_gaps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["playbook", "procedure", "directive", "principle", "preference", "knowledge"],
              },
              status: BUNDLE_STATUS,
              why: { type: "string" },
            },
            required: ["type", "status", "why"],
          },
        },
        decision_class_read: {
          type: "object",
          properties: {
            governed_today: { type: "array", items: DECISION_CLASS },
            exposed: { type: "string" },
          },
          required: ["governed_today", "exposed"],
        },
        blind_spots: {
          type: "array",
          items: {
            type: "object",
            properties: { title: { type: "string" }, why: { type: "string" } },
            required: ["title", "why"],
          },
        },
        correction: {
          type: "object",
          properties: {
            move: { type: "string" },
            scope: { type: "string" },
            liza_capability: { type: "string" },
          },
          required: ["move", "scope", "liza_capability"],
        },
      },
      required: [
        "title",
        "current_model_read",
        "stream_coverage",
        "audit_coverage",
        "bundle_gaps",
        "decision_class_read",
        "blind_spots",
        "correction",
      ],
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
    const tools: string[] = Array.isArray(payload.tools) ? payload.tools : [];
    const streams = (payload.streams || {}) as Record<string, string>;
    const audits = (payload.audits || {}) as Record<string, string>;
    const freeText: string = (payload.free_text || "").toString().trim();

    const streamKeys = ["strategy", "market", "state", "signal"];
    const auditKeys = ["cost", "best_practice", "security", "decision", "drift"];
    if (!streamKeys.every((k) => streams[k]) || !auditKeys.every((k) => audits[k])) {
      return new Response(
        JSON.stringify({ error: "All four streams and five audits must be answered." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = `TEAM
${team ? `${team}${teamSub ? ` (${teamSub})` : ""}` : "(not specified)"}

USE CASES THEY SELECTED
${useCases.length ? useCases.map((u) => `- ${u}`).join("\n") : "(none selected)"}

TOOLS IN USE TODAY
${tools.length ? tools.map((t) => `- ${t}`).join("\n") : "(none reported)"}

STREAM COVERAGE (self-reported)
${streamKeys.map((k) => `- ${k}: ${streams[k]}`).join("\n")}

GOVERNANCE AUDITS (self-reported)
${auditKeys.map((k) => `- ${k}: ${audits[k]}`).join("\n")}

ADDITIONAL CONTEXT
${freeText || "(none)"}

Diagnose their LIZA Operator Framework state for ${team || "this team"}. Echo their stream and audit answers back with a why specific to their function and tool stack. Infer the bundle gaps. Read the decision-class exposure. Name two or three blind spots. End with one correction.`;

    const response = await callGateway({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      tools: [DIAGNOSE_TOOL],
      tool_choice: { type: "function", function: { name: "diagnose_operator_framework" } },
      max_tokens: 4000,
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
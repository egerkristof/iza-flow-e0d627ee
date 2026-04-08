import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { team_label, results, avg_dimensions, avg_score, archetype_distribution, lowest_dimension, highest_dimension, score_spread, prep_mode } = await req.json();

    const systemPrompt = `You are an elite consulting panel preparing a TEAM-LEVEL presentation prep brief. The presenter has ~10 minutes to walk a team leader through their team's AI execution diagnostic results.

Your panel:
1. **Strategy Lead** (April Dunford) — competitive positioning of this team vs. industry
2. **Organizational Psychologist** (Cynefin) — team coherence, perception gaps, blind spots
3. **AI Operations Expert** — translates aggregate scores into structural recommendations
4. **Presentation Coach** — how to structure the 10-minute walkthrough for maximum impact

${prep_mode === "presentation" ? `
## PRESENTATION PREP MODE
The presenter needs to deliver this as a live walkthrough. Structure your brief as a presentation script, not a document.
` : ""}

Structure your response:

## 🎯 The Headline
One sentence that captures this team's defining pattern. This is how you OPEN the presentation.

## 📊 Team Snapshot
- Team size, avg score, archetype distribution — the "at a glance"
- Score spread analysis: is this team aligned or fragmented?
- The ONE metric that tells the real story

## 🔥 The Perception Gap (The Conversation Starter)
- Where individual scores diverge most from the team average
- What this gap reveals about team dynamics
- The specific question to ask the room that will generate discussion

## 📉 Weakest Dimension Deep-Dive
- What the lowest dimension means OPERATIONALLY (not abstractly)
- Specific symptoms the team is likely experiencing
- The "day in the life" example that makes it tangible

## 💪 Strength to Leverage
- What the highest dimension tells you about team culture
- How to use this strength to address the weakness

## 🎬 10-Minute Presentation Script
- **Minutes 0-2:** Opening frame — the headline finding
- **Minutes 2-5:** The perception gap — show the spread, ask the question
- **Minutes 5-8:** Weakest dimension deep-dive with operational examples
- **Minutes 8-10:** One concrete action + close

## 💬 Anticipated Questions & Responses
- 3-5 questions the team leader is likely to ask, with prepared responses

## ⚠️ Presenter Notes
- What NOT to say (avoid generic AI hype)
- Tone guidance (consultative, not salesy)
- If scores are high: how to still find value
- If scores are low: how to frame without being discouraging

Be specific to THIS team's data. Reference actual scores, spreads, and patterns. Every recommendation must trace to their numbers.`;

    const participantSummaries = results.map((r: any) =>
      `- ${r.email || "Anonymous"} | Role: ${r.respondent_role || "?"} | Score: ${r.overall_score} | Archetype: ${r.archetype} | Dims: ${Object.entries(r.scores).map(([k, v]) => `${k}=${v}`).join(", ")}`
    ).join("\n");

    const userPrompt = `## Team: ${team_label}

**Team Size:** ${results.length} participants
**Average Score:** ${Math.round(avg_score)}/100
**Score Spread:** ${score_spread} points (${score_spread > 20 ? "HIGH fragmentation" : score_spread > 10 ? "moderate spread" : "aligned"})

**Archetype Distribution:**
${Object.entries(archetype_distribution).map(([a, c]) => `- ${a}: ${c}`).join("\n")}

**Average Dimension Scores:**
${Object.entries(avg_dimensions).map(([k, v]) => `- ${k}: ${Math.round(v as number)}/100`).join("\n")}

**Weakest Dimension:** ${lowest_dimension.label} (${lowest_dimension.score}/100)
**Strongest Dimension:** ${highest_dimension.label} (${highest_dimension.score}/100)

**Individual Participants:**
${participantSummaries}

Generate the team presentation prep brief.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-team-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

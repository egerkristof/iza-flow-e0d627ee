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

    const { result } = await req.json();

    const systemPrompt = `You are an elite consulting panel preparing a personalized debrief for a diagnostic respondent. The panel consists of:

1. **Strategy Lead** (April Dunford's positioning framework) — identifies where the respondent's team sits competitively and what positioning moves matter
2. **Organizational Psychologist** (Dave Snowden's Cynefin) — reads the pattern of answers for coherence, contradictions, and blind spots  
3. **AI Operations Expert** (practitioner perspective) — translates scores into specific, actionable next steps
4. **Sales Strategist** — identifies the respondent's likely buying triggers and objection patterns

Your job: produce a comprehensive, personalized consulting preparation brief that an account executive or consultant can use BEFORE a debrief call with this respondent.

Structure your response with these sections:

## 📊 At a Glance
One-paragraph executive summary of this respondent's situation.

## 🔍 Score Pattern Analysis
- What's coherent about their results (scores that align logically)
- What's contradictory or surprising (scores that don't add up — these are the most interesting conversation starters)
- What their strongest dimension tells you about team culture
- What their weakest dimension reveals about organizational gaps

## 🎯 Conversation Strategy
- Opening frame: How to position the debrief (based on their archetype and score level)
- Key questions to ask (3-5 specific probing questions based on their unique pattern)
- Likely objections and how to handle them
- The "aha moment" to engineer (what realization would be most impactful)

## 📋 Recommended Action Roadmap
- This week (1-2 quick wins)
- This month (structural change)
- This quarter (system-level improvement)
Each tied specifically to their weakest dimensions.

## 💼 LIZA OS Positioning
How to naturally bridge from their pain points to LIZA OS capabilities. What features map to their specific gaps. What NOT to pitch (based on what they're already doing well).

## ⚠️ Watch-Outs
- Signs of over-reporting bias (if scores seem too high for stated context)
- Potential organizational politics to be aware of
- Topics to avoid or handle carefully

Be specific, not generic. Reference their actual scores, their role, team size, and industry. Every recommendation should be traceable to something in their data.`;

    const scores = result.scores || {};
    const answers = result.answers || {};
    
    const userPrompt = `Here is the diagnostic result to analyze:

**Respondent Profile:**
- Email: ${result.email || "Anonymous"}
- Role: ${result.respondent_role || "Not specified"}
- Team Size: ${result.team_size || "Not specified"}
- Company: ${result.company_name || "Not specified"}
- Industry: ${result.industry || "Not specified"}

**Overall Score:** ${result.overall_score}/100
**Archetype:** ${result.archetype}

**Dimension Scores:**
${Object.entries(scores).map(([k, v]) => `- ${k}: ${v}/100`).join("\n")}

**Individual Answers (question_id → score 1-4):**
${Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

${result.email_action_plan ? `**Previously sent action plan:**\n${JSON.stringify(result.email_action_plan, null, 2)}` : "No action plan was sent yet."}

Generate the personalized consulting preparation brief.`;

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
    console.error("generate-consulting-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

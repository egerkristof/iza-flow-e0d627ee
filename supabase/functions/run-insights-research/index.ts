import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate user is architect
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check architect role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "architect")
      .single();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { category, aggregate_data } = await req.json();

    if (!category || !aggregate_data) {
      return new Response(JSON.stringify({ error: "category and aggregate_data required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ICP_CONTEXT = `Our ICP is operational and revenue leaders (VP Go-To-Market, Head of RevOps, VP Sales, VP Operations, CRO) at 50-200 employee organizations — IT consulting firms, B2B SaaS companies, and professional services teams in the DACH region scaling to 1,000. These are NOT enterprise Fortune 500 companies. These are mid-market teams where the VP of Operations personally feels the chaos of uncoordinated AI usage across 8-15 team members. They buy tools that solve team-level coordination problems, not individual productivity.`;

    const categoryPrompts: Record<string, string> = {
      icp_reality_check: `You are a sharp market intelligence analyst who deeply understands how 50-150 person B2B teams actually work with AI today. ${ICP_CONTEXT}

Based on the aggregate diagnostic data below, paint the REAL picture of what these teams are doing:

Focus on:
- What tools are these teams ACTUALLY using day-to-day? (Not what LinkedIn says — the messy reality: shared ChatGPT accounts, copy-pasting between tools, no version control on prompts)
- Where are the specific breakdowns happening when a team of 12 consultants all use AI differently?
- What does the "Monday morning standup" look like when everyone's AI outputs are inconsistent?
- What are the hidden costs that don't show up in any ROI calculation? (rework, client confusion, knowledge loss when someone leaves)

Be specific and visceral. Use concrete scenarios a VP of Operations at a 80-person consulting firm would immediately recognize.

Format your response as 3-5 "Content Angles" — each with:
1. **Angle Title** (a headline that would make our ICP stop scrolling on LinkedIn)
2. **The Reality** (2-3 sentences of the raw, unvarnished truth — be specific about team size, tool names, scenarios)
3. **Data Connection** (how our diagnostic data proves or quantifies this reality)
4. **Content Hook** (the polarizing opening line for a LinkedIn post or blog — make it provocative)
5. **Call-to-Action Angle** (how this naturally leads to "you need a system for this")`,

      contrarian_positioning: `You are a provocative thought leadership strategist who specializes in contrarian positioning for B2B SaaS. ${ICP_CONTEXT}

Based on the aggregate diagnostic data below, generate POLARIZING takes that challenge the mainstream AI narrative. The mainstream says "AI boosts productivity." We say "AI without team governance only scales chaos."

Focus on:
- Takes that directly contradict popular AI influencer advice (name the specific narrative you're countering)
- Angles where the data reveals uncomfortable truths that AI vendors don't want to talk about
- Positions that would make a McKinsey consultant uncomfortable but make a VP of Operations at a 100-person firm nod vigorously
- "Hot takes" that are actually backed by our data — not clickbait, but genuinely contrarian AND defensible

The tone should be: confident, slightly confrontational, deeply informed. Like a trusted advisor who tells you what you need to hear, not what you want to hear.

Format your response as 3-5 "Contrarian Angles" — each with:
1. **The Mainstream Narrative** (the popular view you're challenging — quote it)
2. **Our Contrarian Take** (the polarizing headline — must be shareable)
3. **Why This Matters for 50-150 Person Teams** (make it specific to our ICP's reality)
4. **Data Proof Point** (the specific diagnostic finding that backs this up)
5. **The Uncomfortable Question** (a question that forces the reader to confront their own situation)`,

      execution_stack_shifts: `You are an AI execution intelligence analyst specializing in mid-market B2B teams. ${ICP_CONTEXT}

Based on the aggregate diagnostic data below, research the latest shifts in AI execution tools, agent frameworks, and workflow orchestration platforms that are relevant to how 50-150 person teams actually work.

Focus on:
- New tools or platforms specifically relevant to teams of this size (not enterprise tools that require a 6-month implementation)
- Agent framework developments (LangChain, CrewAI, AutoGen, etc.) — but through the lens of "would a VP of Operations at an 80-person consulting firm actually adopt this?"
- Workflow automation that addresses the specific weaknesses in our diagnostic data
- The gap between what AI tool vendors promise and what mid-market teams can actually implement

Format your response as 3-5 "Research Angles" — each with:
1. **Angle Title** (compelling, content-worthy headline relevant to our ICP)
2. **Key Finding** (2-3 sentences of the insight — grounded in the mid-market reality)
3. **Data Connection** (how this relates to our diagnostic aggregate data)
4. **Content Hook** (a provocative take for social/blog content — make it polarizing)
5. **ICP Relevance** (why a 100-person consulting firm should care about this specifically)`,

      maturity_benchmarks: `You are an AI maturity benchmarking analyst who focuses on mid-market teams, NOT enterprise. ${ICP_CONTEXT}

Based on the aggregate diagnostic data below, research the latest industry reports, maturity studies, and enterprise AI adoption benchmarks — then CONTRAST them with our proprietary data to reveal the gap between enterprise reports and mid-market reality.

Focus on:
- Recent maturity reports (McKinsey, Gartner, Deloitte, ServiceNow) — but expose how they DON'T apply to 50-150 person teams
- The specific gap between "reported AI adoption" (what companies tell analysts) and actual execution maturity (what our diagnostic reveals)
- Studies about team-level AI usage (not organizational spend or CEO surveys)
- Where mid-market teams are actually AHEAD of enterprise (scrappiness, speed of adoption) and where they're dangerously behind (governance, knowledge sharing)

Format your response as 3-5 "Research Angles" — each with:
1. **Angle Title** (compelling, content-worthy headline)
2. **Key Finding** (2-3 sentences of the insight)
3. **Data Connection** (how our proprietary data either confirms or contradicts this — be specific)
4. **Content Hook** (a provocative "our data shows..." framing that positions us as having insider knowledge)
5. **The Blind Spot** (what the industry report missed that our data reveals)`,
    };

    const systemPrompt = categoryPrompts[category] || categoryPrompts.icp_reality_check;

    const userMessage = `Here is our current aggregate diagnostic data from ${aggregate_data.totalSubmissions} submissions across ${aggregate_data.orgCount} organizations:

**Overall Average Score:** ${aggregate_data.overallAvg}/100
**Confidence Tier:** ${aggregate_data.confidenceTier}

**Dimension Averages:**
- Standards Adoption (Do teams use structured methodologies vs. blank prompts?): ${aggregate_data.dimensions?.standard_internalization ?? "N/A"}/100
- Delivery Consistency (How much does output quality vary person-to-person?): ${aggregate_data.dimensions?.output_consistency ?? "N/A"}/100
- Knowledge Sharing (Are learnings trapped in individual chat histories?): ${aggregate_data.dimensions?.knowledge_compounding ?? "N/A"}/100
- Team Visibility (Can leaders see how AI is actually being used?): ${aggregate_data.dimensions?.collective_visibility ?? "N/A"}/100
- Improvement Speed (How fast do teams adopt better prompting and workflows?): ${aggregate_data.dimensions?.learning_velocity ?? "N/A"}/100

**Weakest Dimension:** ${aggregate_data.weakestDimension}
**Strongest Dimension:** ${aggregate_data.strongestDimension}
**Most Common Archetype:** ${aggregate_data.topArchetype}

Generate research and content angles. Today's date is ${new Date().toISOString().split("T")[0]}. Remember: our audience is NOT enterprise. They are 50-150 person teams where the leader personally feels every inefficiency. Be specific, be provocative, be useful.`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: `AI error (${status})` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Save to DB
    const { data: saved, error: saveErr } = await supabase
      .from("insights_research")
      .insert({
        category,
        query: userMessage.slice(0, 500),
        result_content: content,
        aggregate_snapshot: aggregate_data,
        submission_count: aggregate_data.totalSubmissions,
        triggered_by: user.id,
      })
      .select()
      .single();

    if (saveErr) {
      console.error("Save error:", saveErr);
    }

    return new Response(
      JSON.stringify({ content, id: saved?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("run-insights-research error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

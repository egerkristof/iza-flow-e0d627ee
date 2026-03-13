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

    const categoryPrompts: Record<string, string> = {
      execution_stack_shifts: `You are an AI execution intelligence analyst. Based on the aggregate diagnostic data below, research the latest shifts in AI execution tools, agent frameworks, and workflow orchestration platforms that are relevant to the patterns we're seeing.

Focus on:
- New tools or platforms that address the weakest dimensions in our data
- Workflow automation shifts that relate to our diagnostic findings
- Agent framework developments (LangChain, CrewAI, AutoGen, etc.) relevant to team AI execution
- Enterprise AI tool consolidation or fragmentation trends

Format your response as 3-5 "Research Angles" — each with:
1. **Angle Title** (compelling, content-worthy headline)
2. **Key Finding** (2-3 sentences of the insight)
3. **Data Connection** (how this relates to our diagnostic aggregate data)
4. **Content Hook** (a provocative take for social/blog content)`,

      maturity_benchmarks: `You are an AI maturity benchmarking analyst. Based on the aggregate diagnostic data below, research the latest industry reports, maturity studies, and enterprise AI adoption benchmarks that we can contrast with our proprietary data.

Focus on:
- Recent maturity reports (McKinsey, Gartner, Deloitte, ServiceNow, etc.)
- Enterprise AI adoption statistics we can compare against
- Team-level AI usage studies (not just organizational spend)
- Gaps between reported AI adoption and actual execution maturity

Format your response as 3-5 "Research Angles" — each with:
1. **Angle Title** (compelling, content-worthy headline)
2. **Key Finding** (2-3 sentences of the insight)
3. **Data Connection** (how our proprietary data either confirms or contradicts this)
4. **Content Hook** (a provocative "our data shows..." framing for content)`,
    };

    const systemPrompt = categoryPrompts[category] || categoryPrompts.execution_stack_shifts;

    const userMessage = `Here is our current aggregate diagnostic data from ${aggregate_data.totalSubmissions} submissions across ${aggregate_data.orgCount} organizations:

**Overall Average Score:** ${aggregate_data.overallAvg}/100
**Confidence Tier:** ${aggregate_data.confidenceTier}

**Dimension Averages:**
- Standards Adoption: ${aggregate_data.dimensions?.standard_internalization ?? "N/A"}/100
- Delivery Consistency: ${aggregate_data.dimensions?.output_consistency ?? "N/A"}/100
- Knowledge Sharing: ${aggregate_data.dimensions?.knowledge_compounding ?? "N/A"}/100
- Team Visibility: ${aggregate_data.dimensions?.collective_visibility ?? "N/A"}/100
- Improvement Speed: ${aggregate_data.dimensions?.learning_velocity ?? "N/A"}/100

**Weakest Dimension:** ${aggregate_data.weakestDimension}
**Strongest Dimension:** ${aggregate_data.strongestDimension}
**Most Common Archetype:** ${aggregate_data.topArchetype}

Generate research angles based on current ${category === "execution_stack_shifts" ? "AI tool and workflow" : "maturity benchmark and industry report"} trends that I can use for thought leadership content. Today's date is ${new Date().toISOString().split("T")[0]}.`;

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate the calling user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { execution_id, what_worked, what_didnt, would_do_differently } = await req.json();
    if (!execution_id) throw new Error("execution_id required");

    // Fetch execution context for AI
    const { data: execution, error: execError } = await supabase
      .from("protocol_executions")
      .select(`
        id, status, drift_score, notes,
        workbook_protocols(title),
        workbooks!protocol_executions_workbook_id_fkey(title)
      `)
      .eq("id", execution_id)
      .single();
    if (execError) throw execError;

    // Fetch step executions for context
    const { data: stepExecs = [] } = await supabase
      .from("step_executions")
      .select("status, output_notes, step_id, protocol_steps(title, step_order)")
      .eq("execution_id", execution_id)
      .order("created_at", { ascending: true });

    // Fetch any existing captures
    const { data: existingCaptures = [] } = await supabase
      .from("execution_captures")
      .select("capture_type, title, content")
      .eq("execution_id", execution_id)
      .limit(20);

    const protocolTitle = (execution as any).workbook_protocols?.title ?? "Session";
    const workbookTitle = (execution as any).workbooks?.title ?? "Workbook";
    const completedSteps = stepExecs.filter((s: any) => s.status === "completed");

    // Build context for AI
    const contextText = `
Protocol: "${protocolTitle}" in workbook "${workbookTitle}"
Drift Score: ${execution.drift_score ?? 0}
Steps completed: ${completedSteps.length}/${stepExecs.length}

OPERATOR AFTER-ACTION REVIEW:

Q1 — What worked well?
${what_worked || "Not provided"}

Q2 — What didn't work or caused friction?
${what_didnt || "Not provided"}

Q3 — What would you do differently next time?
${would_do_differently || "Not provided"}

Existing captures from this session (${existingCaptures.length}):
${existingCaptures.map((c: any) => `- [${c.capture_type}] ${c.title}: ${c.content?.substring(0, 100)}`).join("\n") || "None"}
    `.trim();

    // Call AI to synthesize learnings
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are an organizational learning specialist. Analyze an operator's After-Action Review and extract 2-4 specific, actionable knowledge items from it.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Short, specific title (max 80 chars)",
    "content": "Detailed, actionable description (2-4 sentences)",
    "capture_type": "learning|friction|best_practice|enhancement",
    "severity": "info|warning|critical"
  }
]

Rules:
- Only extract items that are specific and actionable, not generic
- capture_type "friction" for problems, "best_practice" for what worked, "enhancement" for improvement ideas, "learning" for insights
- severity "critical" only for blockers, "warning" for risks, "info" for everything else
- Do not include pleasantries or explanations outside the JSON array`,
          },
          { role: "user", content: contextText },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content ?? "[]";

    // Parse synthesized captures, strip markdown code fences if present
    let synthesizedItems: Array<{ title: string; content: string; capture_type: string; severity: string }> = [];
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      synthesizedItems = JSON.parse(cleaned);
      if (!Array.isArray(synthesizedItems)) synthesizedItems = [];
    } catch {
      console.error("Failed to parse AI synthesis:", rawContent);
      synthesizedItems = [];
    }

    // Save the session review first
    const { data: review, error: reviewError } = await supabase
      .from("session_reviews")
      .insert({
        execution_id,
        user_id: user.id,
        what_worked: what_worked ?? "",
        what_didnt: what_didnt ?? "",
        would_do_differently: would_do_differently ?? "",
        ai_synthesis: rawContent,
        synthesis_generated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (reviewError) throw reviewError;

    // Create execution_captures from synthesized items
    const captureIds: string[] = [];
    if (synthesizedItems.length > 0) {
      const captureInserts = synthesizedItems.map(item => ({
        execution_id,
        captured_by: user.id,
        capture_type: item.capture_type || "learning",
        title: item.title,
        content: item.content,
        severity: item.severity || "info",
        resolution_status: "open",
        metadata: { source: "aar", review_id: review.id },
      }));

      const { data: createdCaptures, error: captureError } = await supabase
        .from("execution_captures")
        .insert(captureInserts as any)
        .select("id");

      if (!captureError && createdCaptures) {
        captureIds.push(...createdCaptures.map((c: any) => c.id));

        // Update review with promoted capture IDs
        await supabase
          .from("session_reviews")
          .update({ promoted_capture_ids: captureIds })
          .eq("id", review.id);
      }
    }

    return new Response(
      JSON.stringify({
        review_id: review.id,
        synthesized_captures: synthesizedItems,
        capture_ids: captureIds,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("submit-aar error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

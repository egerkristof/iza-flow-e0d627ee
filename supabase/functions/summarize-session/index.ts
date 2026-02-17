import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { execution_id } = await req.json();
    if (!execution_id) throw new Error("execution_id required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch execution details
    const { data: execution, error: execError } = await supabase
      .from("protocol_executions")
      .select(`
        id, status, drift_score, updated_at, notes, session_summary, summary_generated_at,
        workbook_protocols(title),
        workbooks!protocol_executions_workbook_id_fkey(title)
      `)
      .eq("id", execution_id)
      .single();
    if (execError) throw execError;

    // Check cache: only regenerate if data changed since last summary
    if (
      execution.session_summary &&
      execution.summary_generated_at &&
      new Date(execution.updated_at) <= new Date(execution.summary_generated_at)
    ) {
      return new Response(
        JSON.stringify({ summary: execution.session_summary, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch step executions with step info
    const { data: stepExecs = [] } = await supabase
      .from("step_executions")
      .select("status, output_notes, step_id, protocol_steps(title, step_order)")
      .eq("execution_id", execution_id)
      .order("created_at", { ascending: true });

    // Fetch tasks created in this session's workbook
    const { data: tasks = [] } = await supabase
      .from("workbook_tasks")
      .select("title, status, priority")
      .eq("source_protocol_id", execution_id)
      .limit(20);

    // Fetch recent chat messages if any
    const { data: chats = [] } = await supabase
      .from("workbook_chats")
      .select("id, title")
      .eq("workbook_id", execution.workbooks?.id ?? "")
      .limit(5);

    // Build context for AI
    const protocolTitle = (execution as any).workbook_protocols?.title ?? "Session";
    const workbookTitle = (execution as any).workbooks?.title ?? "Workbook";
    const completedSteps = stepExecs.filter((s: any) => s.status === "completed");
    const pendingSteps = stepExecs.filter((s: any) => s.status === "pending" || s.status === "in_progress");
    const blockedTasks = tasks.filter((t: any) => t.status === "blocked");

    const contextText = `
Session: "${protocolTitle}" in workbook "${workbookTitle}"
Status: ${execution.status}
Drift Score: ${execution.drift_score ?? 0}

Steps completed (${completedSteps.length}/${stepExecs.length}):
${completedSteps.map((s: any) => `- ${(s as any).protocol_steps?.title ?? "Step"}: ${s.output_notes ?? "completed"}`).join("\n") || "None"}

Pending/In-progress steps:
${pendingSteps.map((s: any) => `- ${(s as any).protocol_steps?.title ?? "Step"}`).join("\n") || "None"}

Tasks (${tasks.length}):
${tasks.map((t: any) => `- [${t.status}] ${t.title}`).join("\n") || "None"}

Blocked: ${blockedTasks.length} task(s)
Notes: ${execution.notes ?? "None"}
    `.trim();

    // Call Lovable AI
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
            content: `You are a concise work assistant. Generate a 2-3 sentence summary for an operator returning to a work session. Format:
1. What was accomplished so far
2. What's pending or blocked
3. Suggested next action

Be specific and actionable. No pleasantries.`,
          },
          { role: "user", content: contextText },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices?.[0]?.message?.content ?? "Unable to generate summary.";

    // Save to DB
    await supabase
      .from("protocol_executions")
      .update({
        session_summary: summary,
        summary_generated_at: new Date().toISOString(),
      })
      .eq("id", execution_id);

    return new Response(
      JSON.stringify({ summary, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("summarize-session error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

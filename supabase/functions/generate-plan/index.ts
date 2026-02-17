import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth token
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Invalid auth token");

    const { time_horizon } = await req.json();
    const horizon = time_horizon || "today";

    // Fetch user's active tasks
    const { data: tasks = [] } = await supabase
      .from("workbook_tasks")
      .select("id, title, status, priority, due_date, workbook_id, updated_at")
      .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
      .in("status", ["todo", "in_progress", "blocked"])
      .order("updated_at", { ascending: false })
      .limit(50);

    // Fetch active sessions
    const { data: sessions = [] } = await supabase
      .from("protocol_executions")
      .select(`
        id, status, drift_score, updated_at, session_summary,
        workbook_protocols(title),
        workbooks!protocol_executions_workbook_id_fkey(title)
      `)
      .eq("executed_by", user.id)
      .in("status", ["in_progress", "paused", "not_started"])
      .limit(20);

    // Fetch workbook titles for tasks
    const wbIds = [...new Set(tasks.map((t: any) => t.workbook_id))];
    const { data: workbooks = [] } = await supabase
      .from("workbooks")
      .select("id, title")
      .in("id", wbIds.length > 0 ? wbIds : ["none"]);
    const wbMap: Record<string, string> = {};
    workbooks.forEach((w: any) => { wbMap[w.id] = w.title; });

    // Build context
    const taskSummary = tasks.map((t: any) =>
      `- [${t.priority}/${t.status}] "${t.title}" (Workbook: ${wbMap[t.workbook_id] ?? "Unknown"}${t.due_date ? `, Due: ${t.due_date}` : ""})`
    ).join("\n");

    const sessionSummary = sessions.map((s: any) =>
      `- [${s.status}] "${s.workbook_protocols?.title ?? "Session"}" in "${s.workbooks?.title ?? "Workbook"}" (Drift: ${s.drift_score ?? 0}${s.session_summary ? `, Summary: ${s.session_summary}` : ""})`
    ).join("\n");

    const today = new Date().toISOString().split("T")[0];
    const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });

    const prompt = `You are a productivity assistant for a professional operator. Today is ${dayOfWeek}, ${today}.

The operator has the following active work items:

TASKS (${tasks.length}):
${taskSummary || "No active tasks"}

SESSIONS (${sessions.length}):
${sessionSummary || "No active sessions"}

Generate a focused plan for time horizon: "${horizon}".
- "next_hour": Pick 1-3 most urgent items to focus on right now
- "today": Pick 3-7 items ordered by importance for the full day
- "this_week": Pick 5-10 items spread across the week with suggested days

For each item, provide:
1. A clear action-oriented title (what to DO, not just the item name)
2. A brief description of why this should be done now and how to approach it
3. The source type ("task" or "session") and source_id if applicable`;

    // Call AI with tool calling for structured output
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a concise productivity planner. Return structured plans only." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_plan",
            description: "Create a time-boxed work plan for the operator",
            parameters: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Action-oriented title" },
                      description: { type: "string", description: "Why and how to approach" },
                      source_type: { type: "string", enum: ["task", "session", "custom"] },
                      source_id: { type: "string", description: "UUID of source task/session if applicable" },
                      planned_date: { type: "string", description: "YYYY-MM-DD for weekly plans" },
                    },
                    required: ["title", "description", "source_type"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["items"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_plan" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error: " + aiResponse.status);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let planItems: any[] = [];

    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        planItems = parsed.items ?? [];
      } catch {
        console.error("Failed to parse AI tool call");
      }
    }

    // Persist plan items
    // First clear existing items for this horizon
    await supabase
      .from("operator_plan_items")
      .delete()
      .eq("user_id", user.id)
      .eq("time_horizon", horizon)
      .eq("is_completed", false);

    // Insert new items
    const inserts = planItems.map((item: any, idx: number) => ({
      user_id: user.id,
      source_type: item.source_type || "custom",
      source_id: item.source_id || null,
      title: item.title,
      description: item.description,
      time_horizon: horizon,
      planned_date: item.planned_date || today,
      sort_order: idx,
      ai_suggested: true,
    }));

    if (inserts.length > 0) {
      await supabase.from("operator_plan_items").insert(inserts);
    }

    return new Response(
      JSON.stringify({ items: planItems, count: planItems.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-plan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

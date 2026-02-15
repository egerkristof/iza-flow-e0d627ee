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

    // Validate user
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
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

    const {
      research_template_id,
      query,
      step_context,
      protocol_context,
    } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load research template if provided
    let systemPrompt =
      "You are a thorough research assistant. Gather, analyze, and synthesize information on the user's query. " +
      "Structure your response with clear headings, bullet points, and citations where possible. " +
      "Be comprehensive yet concise.";
    let model = "google/gemini-3-flash-preview";
    let templateSteps: any[] = [];
    let templateTitle = "";

    if (research_template_id) {
      const { data: template, error: tplErr } = await supabase
        .from("research_templates")
        .select("*")
        .eq("id", research_template_id)
        .single();

      if (!tplErr && template) {
        templateTitle = template.title;
        model = template.agent_model || model;
        if (template.agent_system_prompt) {
          systemPrompt = template.agent_system_prompt;
        }
        if (template.steps && Array.isArray(template.steps)) {
          templateSteps = template.steps;
        }
      }
    }

    // Build messages
    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Inject protocol context if provided
    if (protocol_context && protocol_context.length > 0) {
      const contextBlock = protocol_context
        .map((c: any) => `[${c.category}] ${c.title}: ${c.content}`)
        .join("\n\n");
      messages.push({
        role: "system",
        content:
          "The following knowledge context is active for this protocol execution:\n\n" +
          contextBlock,
      });
    }

    // Inject step context
    if (step_context) {
      messages.push({
        role: "system",
        content: `Current protocol step: "${step_context.title}"\nStep description: ${step_context.description || "N/A"}\nStep prompt: ${step_context.agent_prompt || "N/A"}`,
      });
    }

    // If template has structured steps, include them as guidance
    if (templateSteps.length > 0) {
      const stepsGuide = templateSteps
        .map((s: any, i: number) => `${i + 1}. ${s.title || s.label || s.name}: ${s.description || s.prompt || ""}`)
        .join("\n");
      messages.push({
        role: "system",
        content: `Follow this research methodology:\n${stepsGuide}`,
      });
    }

    messages.push({ role: "user", content: query });

    // Call Lovable AI Gateway with streaming
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      return new Response(
        JSON.stringify({ error: `AI gateway error (${status})` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream through to client
    return new Response(aiResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("run-research error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

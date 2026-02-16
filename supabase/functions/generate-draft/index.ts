import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OUTPUT_TYPE_INSTRUCTIONS: Record<string, string> = {
  email_draft: "Generate a professional email draft. Include subject line, greeting, body, and sign-off. Match the tone specified in context.",
  slide_outline: "Generate a structured slide outline with slide titles, key bullet points per slide, and speaker notes. Use clear hierarchy.",
  document_section: "Generate a well-structured document section with headings, paragraphs, and supporting details.",
  checklist: "Generate a comprehensive checklist with actionable items. Use checkbox format (- [ ] item). Group related items.",
  analysis_brief: "Generate an analysis brief with executive summary, key findings, data points, and recommendations.",
  call_prep: "Generate a call preparation brief with agenda, talking points, key questions to ask, and anticipated objections/responses.",
  proposal_section: "Generate a proposal section with clear value proposition, scope, deliverables, and next steps.",
  free_text: "Generate a well-structured response addressing the step's requirements.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { step_context, protocol_context, user_input, conversation_history } = await req.json();

    if (!step_context) {
      return new Response(JSON.stringify({ error: "step_context required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const outputType = step_context.output_type || "free_text";
    const outputDesc = step_context.output_description || "";
    const typeInstruction = OUTPUT_TYPE_INSTRUCTIONS[outputType] || OUTPUT_TYPE_INSTRUCTIONS.free_text;

    // Build context injection from protocol context items
    const contextBlock = (protocol_context || [])
      .map((ci: any) => `### ${ci.category}: ${ci.title}\n${ci.content}`)
      .join("\n\n");

    const systemPrompt = `You are an expert Draft Generator operating within a structured protocol execution system.

## YOUR ROLE
You produce high-quality first drafts based on the operator's organizational knowledge, preferences, and step specifications.

## OUTPUT SPECIFICATION
**Output Type**: ${outputType.replace(/_/g, " ").toUpperCase()}
${outputDesc ? `**What to produce**: ${outputDesc}` : ""}

## FORMAT INSTRUCTIONS
${typeInstruction}

## STEP CONTEXT
**Step**: ${step_context.title}
${step_context.description ? `**Description**: ${step_context.description}` : ""}
${step_context.agent_prompt ? `**Detailed Instructions**: ${step_context.agent_prompt}` : ""}

${contextBlock ? `## ORGANIZATIONAL KNOWLEDGE & CONTEXT\nThe following knowledge items from the organization's context graph are relevant to this step:\n\n${contextBlock}` : ""}

## RULES
1. Produce a COMPLETE, ready-to-use draft — not a template with [placeholders]
2. Use specific details from the organizational context when available
3. Match the tone and style from any PREFERENCE items in the context
4. Follow any DIRECTIVE items as hard constraints
5. If the user asks for refinements, update the draft accordingly — show the FULL updated draft, not just the changes
6. Keep the draft professional, actionable, and aligned with the step's purpose`;

    // Build messages array
    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history for refinement
    if (conversation_history && conversation_history.length > 0) {
      for (const msg of conversation_history) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text || msg.content,
        });
      }
    }

    // Add current user input
    if (user_input) {
      messages.push({ role: "user", content: user_input });
    }

    // Stream the response
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    console.error("generate-draft error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

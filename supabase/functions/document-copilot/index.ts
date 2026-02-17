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
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { selected_text, full_document, user_instruction, bundle_context, action } = await req.json();

    if (!selected_text || !user_instruction) {
      return new Response(JSON.stringify({ error: "selected_text and user_instruction required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bundleCtx = bundle_context
      ? `## BUNDLE CONTEXT\n**Bundle**: ${bundle_context.title}\n${bundle_context.description || ""}\n\n**Items in this bundle:**\n${(bundle_context.items || []).map((i: any) => `- [${i.category}] ${i.title}: ${i.content_preview || ""}`).join("\n")}\n\n**Other bundles the user has:**\n${(bundle_context.other_bundles || []).map((b: any) => `- ${b.title}: ${b.description || ""}`).join("\n")}`
      : "";

    const systemPrompt = `You are an expert Knowledge Editor operating within a structured playbook management system. You help users refine, improve, and rewrite selected portions of their canonical documents.

${bundleCtx}

## YOUR ROLE
- Rewrite or improve the selected text based on the user's instruction
- Maintain consistency with the bundle's context and other organizational knowledge
- Preserve the markdown formatting conventions (## for playbooks, ### for sections, numbered lists for procedures, blockquotes for directives/principles)
- Be aware of cross-bundle relationships and terminology

## RULES
1. Return ONLY the replacement text — no explanations or wrappers
2. Match the formatting style of the surrounding document
3. If the action is "improve", make the text clearer, more actionable, and better structured
4. If the action is "expand", add more detail and depth
5. If the action is "simplify", make it more concise
6. If the action is "rewrite", completely rephrase while keeping the meaning
7. Preserve any structural markers (headings, lists, blockquotes)`;

    const userPrompt = `## SELECTED TEXT
\`\`\`
${selected_text}
\`\`\`

## FULL DOCUMENT (for context)
${full_document ? full_document.substring(0, 4000) : "Not provided"}

## INSTRUCTION
Action: ${action || "edit"}
User request: ${user_instruction}

Return ONLY the replacement text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
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
    console.error("document-copilot error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

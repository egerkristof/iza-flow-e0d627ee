import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Generate a domain-specific expert advisor persona based on content analysis.
 * This persona advises the Knowledge Architect on categorization and extraction depth.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const { content, meta } = await req.json();
    if (!content) throw new Error("content required");

    // Use a fast model for classification
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a content domain classifier. Analyze the provided content and determine what type of professional domain expertise it falls under, then generate a specific expert advisor persona who would be best positioned to guide knowledge extraction from this content.

The advisor will consult with a Knowledge Architect to improve extraction quality — advising on:
- Whether items are categorized correctly for the domain
- What granularity is appropriate (e.g., a sales expert knows deal stages need atomic steps)
- What implicit knowledge might be missing that someone in this domain would know to extract
- Domain-specific terminology and priority signals

Return the advisor persona via the generate_advisor tool.`,
          },
          {
            role: "user",
            content: `Analyze this content and generate the ideal domain expert advisor persona:

**Source metadata:** ${JSON.stringify(meta || {})}

**Content preview (first 3000 chars):**
${(content || "").slice(0, 3000)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_advisor",
              description: "Generate a domain expert advisor persona for knowledge extraction",
              parameters: {
                type: "object",
                properties: {
                  persona_title: {
                    type: "string",
                    description: "Professional title of the advisor, e.g. 'Senior Enterprise Sales Strategist', 'Principal Technical Recruiter', 'Chief Compliance Officer'",
                  },
                  domain: {
                    type: "string",
                    description: "The primary knowledge domain, e.g. 'Enterprise Sales', 'Technical Recruiting', 'Product Management', 'Legal Compliance'",
                  },
                  expertise_areas: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 specific areas of expertise relevant to the content",
                  },
                  extraction_guidance: {
                    type: "string",
                    description: "2-4 sentences of specific guidance for the Knowledge Architect: what to pay attention to, common categorization mistakes in this domain, what implicit knowledge to surface, and how granular the procedures should be.",
                  },
                  category_hints: {
                    type: "object",
                    properties: {
                      likely_playbooks: {
                        type: "string",
                        description: "What kinds of content should be PLAYBOOK in this domain",
                      },
                      likely_procedures: {
                        type: "string",
                        description: "What kinds of content should be PROCEDURE in this domain",
                      },
                      likely_directives: {
                        type: "string",
                        description: "What kinds of content should be DIRECTIVE in this domain",
                      },
                      likely_knowledge: {
                        type: "string",
                        description: "What kinds of content should be KNOWLEDGE in this domain",
                      },
                    },
                    required: ["likely_playbooks", "likely_procedures", "likely_directives", "likely_knowledge"],
                    additionalProperties: false,
                  },
                  icon_suggestion: {
                    type: "string",
                    description: "A single emoji that best represents this advisor's domain, e.g. 💼 for sales, 🔧 for engineering, ⚖️ for legal",
                  },
                },
                required: ["persona_title", "domain", "expertise_areas", "extraction_guidance", "category_hints", "icon_suggestion"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_advisor" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Advisor generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No advisor result");

    const advisor = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(advisor), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-advisor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

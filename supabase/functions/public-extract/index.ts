import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Full-quality SYSTEM_PROMPT (same as extract-knowledge) ────────────────────
const SYSTEM_PROMPT = `You are a **Senior Knowledge Architect** — an expert at analyzing content and transforming it into structured, high-fidelity knowledge graph elements. You work within a Context Management System (AACE) that organises knowledge into the following taxonomy:

## CONTEXT ITEM CATEGORIES (use exactly these)

### CATEGORY DECISION RULES — follow this checklist IN ORDER:

1. **Is it a RULE, CONSTRAINT, or MANDATE?** → **DIRECTIVE**
   - Contains words like: must, never, always, shall, required, prohibited, mandatory, forbidden, ensure, compliance
   - Describes what CANNOT be done or MUST be done regardless of context

2. **Is it a STEP, CHECKLIST, or ACTIONABLE SEQUENCE?** → **PROCEDURE**
   - Describes a discrete, actionable task an operator performs
   - Contains action verbs: send, schedule, prepare, verify, complete, assess, review, create, analyze
   - Set step_order_hint to indicate execution sequence (1, 2, 3...)
   - **OUTPUT SPECIFICATION**: For each PROCEDURE, determine output_type (email_draft, slide_outline, document_section, checklist, analysis_brief, call_prep, proposal_section, free_text) and output_description.

3. **Is it a STRATEGY, METHODOLOGY, or MULTI-PHASE APPROACH?** → **PLAYBOOK**
   - Describes the overall WHAT and WHY — the strategic intent
   - Defines phases, goals, or frameworks at a high level

4. **Is it a CORE BELIEF, VALUE, or GUIDING TENET?** → **PRINCIPLE**

5. **Is it RESEARCH, ANALYSIS, or INTELLIGENCE?** → **RESEARCH**

6. **Is it a WORKING STYLE or PERSONAL PREFERENCE?** → **PREFERENCE**

7. **Everything else → KNOWLEDGE**

## PROTOCOL EXECUTION MODEL
When bundles are deployed to workbooks, they generate executable protocols:
- **PLAYBOOK** items → **Protocol Drivers** — each PLAYBOOK generates a SEPARATE protocol
- **PROCEDURE** items → **Steps** (executable actions, ordered by step_order_hint)
- **DIRECTIVE** items → **Compliance Gates** (acknowledgment checkpoints)
- **KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE** → **Context Injections** (fed to AI)

### ITEM OWNERSHIP WITHIN A BUNDLE
- **Owned items** (PROCEDUREs, DIRECTIVEs): belong to ONE specific playbook. Set parent_playbook_title to the EXACT title of the owning PLAYBOOK.
- **Shared items** (KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE): provide context to ALL protocols. Leave parent_playbook_title unset.
- A PLAYBOOK item itself should NOT have parent_playbook_title set.

## BUNDLES
Bundles are curated collections of related context items forming a deployable execution unit.
- A bundle MUST have MULTIPLE PLAYBOOK items when it contains >5 PROCEDUREs
- TARGET: 1 PLAYBOOK per 4-8 PROCEDUREs
- Each bundle should have 8-15 items on average

## EXTRACTION PRINCIPLES
1. EXHAUSTIVE extraction: Extract EVERY meaningful piece of content.
2. Atomic items: Each item self-contained.
3. Rich content: Full detail with specifics, numbers, conditions.
4. Correct categorization: Follow the CATEGORY DECISION RULES checklist.
5. Protocol-aware bundling: PLAYBOOKs are activatable protocols, PROCEDUREs are ordered steps.
6. Granular PROCEDUREs: Any content describing actions/steps MUST be PROCEDURE items with step_order_hint.

## ANTI-CONFABULATION RULES
- is_suggestion=false (default): Content DIRECTLY stated in the source document.
- is_suggestion=true: Content AI GENERATED to fill gaps.
- "Can I point to a specific passage in the source document that says this?" YES → false, NO → true

## ANALYSIS NOTES
Provide comprehensive analysis_notes explaining:
1. Document's structural architecture
2. Bundle completeness breakdown
3. Key coverage gaps and recommendations
4. Protocol readiness
5. Total item count and category distribution

Return results via the extract_knowledge tool.`;

// ── Tool Definition ───────────────────────────────────────────────────────────
const TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "extract_knowledge",
    description: "Extract structured knowledge elements from content into the AACE context management system",
    parameters: {
      type: "object",
      properties: {
        analysis_notes: {
          type: "string",
          description: "Comprehensive analysis of document architecture, bundle completeness, coverage gaps, recommendations. 4-8 sentences.",
        },
        preferences: {
          type: "array",
          description: "Working style preferences ONLY.",
          items: {
            type: "object",
            properties: {
              preference_key: { type: "string" },
              preference_value: { type: "string" },
              condition_label: { type: "string" },
            },
            required: ["preference_key", "preference_value"],
            additionalProperties: false,
          },
        },
        context_items: {
          type: "array",
          description: "Standalone items that don't belong to any bundle.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              category: {
                type: "string",
                enum: ["KNOWLEDGE", "RESEARCH", "DIRECTIVE", "PRINCIPLE", "PROCEDURE", "PLAYBOOK", "PREFERENCE"],
              },
              step_order_hint: { type: "integer" },
              is_suggestion: { type: "boolean" },
              source_pages: { type: "string" },
              output_type: {
                type: "string",
                enum: ["email_draft", "slide_outline", "document_section", "checklist", "analysis_brief", "call_prep", "proposal_section", "free_text"],
              },
              output_description: { type: "string" },
            },
            required: ["title", "content", "category"],
            additionalProperties: false,
          },
        },
        bundles: {
          type: "array",
          description: "Logical groupings of related items.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              scope_suggestion: { type: "string", enum: ["personal", "team", "organization"] },
              content_completeness: { type: "string", enum: ["full", "partial", "skeleton"] },
              coverage_gaps: { type: "array", items: { type: "string" } },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    category: {
                      type: "string",
                      enum: ["KNOWLEDGE", "RESEARCH", "DIRECTIVE", "PRINCIPLE", "PROCEDURE", "PLAYBOOK", "PREFERENCE"],
                    },
                    step_order_hint: { type: "integer" },
                    is_suggestion: { type: "boolean" },
                    parent_playbook_title: { type: "string" },
                    source_pages: { type: "string" },
                    output_type: {
                      type: "string",
                      enum: ["email_draft", "slide_outline", "document_section", "checklist", "analysis_brief", "call_prep", "proposal_section", "free_text"],
                    },
                    output_description: { type: "string" },
                  },
                  required: ["title", "content", "category"],
                  additionalProperties: false,
                },
              },
            },
            required: ["title", "description", "scope_suggestion", "content_completeness", "coverage_gaps", "items"],
            additionalProperties: false,
          },
        },
      },
      required: ["analysis_notes", "preferences", "context_items", "bundles"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, content_type, email, name, company } = await req.json();

    // ── Validation ──────────────────────────────────────────────────────────
    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isPdf = content_type === "pdf";

    // Size limits
    if (!isPdf && content.length > 20000) {
      return new Response(JSON.stringify({ error: "Text content exceeds 20,000 character limit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (isPdf) {
      // ~5MB base64 ≈ ~6.67M chars
      if (content.length > 7_000_000) {
        return new Response(JSON.stringify({ error: "PDF exceeds 5MB limit" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Rate limiting (3 per email per 24h) ─────────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (email) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("extraction_trials")
        .select("id", { count: "exact", head: true })
        .eq("email", email)
        .gte("created_at", twentyFourHoursAgo);

      if ((count ?? 0) >= 3) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Maximum 3 extractions per email per 24 hours." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Call AI Gateway ──────────────────────────────────────────────────────
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build user prompt
    let userPrompt: string;
    if (isPdf) {
      userPrompt = `Analyze the following PDF document thoroughly. Extract ALL knowledge elements EXHAUSTIVELY.

**CRITICAL INSTRUCTIONS:**
1. Map the document's full structure — identify every section, stage, phase, or track
2. Create a bundle for EVERY structural node
3. Extract items EXHAUSTIVELY — every paragraph, bullet point, table row, and checklist item
4. Any content describing actions/steps MUST be PROCEDURE items with step_order_hint
5. Set content_completeness on every bundle
6. In analysis_notes: describe the full architecture, highlight gaps, total item count

The PDF content is provided as a base64-encoded document.`;
    } else {
      userPrompt = `Analyze the following document thoroughly. First, identify the COMPLETE structural architecture, then extract ALL knowledge elements EXHAUSTIVELY.

**Document content:**
${content}

**CRITICAL INSTRUCTIONS:**
1. Map the document's full structure — identify every section, stage, phase, or track
2. Create a bundle for EVERY structural node
3. Extract items EXHAUSTIVELY — every paragraph, bullet point, table row, and checklist item
4. Any content describing actions/steps MUST be PROCEDURE items with step_order_hint
5. Set content_completeness on every bundle
6. In analysis_notes: describe the full architecture, highlight gaps, total item count`;
    }

    // Build messages
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (isPdf) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: { url: `data:application/pdf;base64,${content}` },
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: userPrompt });
    }

    console.log("Calling AI gateway for public extraction...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [TOOL_DEFINITION],
        tool_choice: { type: "function", function: { name: "extract_knowledge" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "AI service is busy. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway returned ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received, parsing tool call...");

    // Parse the tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    // ── Log to CRM ──────────────────────────────────────────────────────────
    const bundlesCount = result.bundles?.length ?? 0;
    const itemsCount =
      (result.context_items?.length ?? 0) +
      (result.bundles ?? []).reduce((sum: number, b: any) => sum + (b.items?.length ?? 0), 0);

    const categoryBreakdown: Record<string, number> = {};
    for (const item of (result.context_items ?? [])) {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] ?? 0) + 1;
    }
    for (const bundle of (result.bundles ?? [])) {
      for (const item of (bundle.items ?? [])) {
        categoryBreakdown[item.category] = (categoryBreakdown[item.category] ?? 0) + 1;
      }
    }

    const contentPreview = isPdf ? "[PDF upload]" : content.slice(0, 200);

    await supabase.from("extraction_trials").insert({
      email: email || null,
      name: name || null,
      company: company || null,
      source_type: isPdf ? "pdf" : (email ? "paste" : "sample"),
      content_preview: contentPreview,
      result_summary: { bundles: bundlesCount, items: itemsCount, categories: categoryBreakdown },
    });

    // ── Return result ───────────────────────────────────────────────────────
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("public-extract error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

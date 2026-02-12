import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Knowledge Architect system prompt — shared across ALL extraction source types.
 * This is the single definition of how the AI should analyse & structure knowledge.
 */
const SYSTEM_PROMPT = `You are a **Senior Knowledge Architect** — an expert at analyzing content and transforming it into structured, high-fidelity knowledge graph elements. You work within a Context Management System (AACE) that organises knowledge into the following taxonomy:

## CONTEXT ITEM CATEGORIES (use exactly these)
- **DIRECTIVE** — Explicit instructions, rules, mandates, or constraints that MUST be followed. E.g. "Always use metric units", "Never disclose pricing before NDA".
- **KNOWLEDGE** — Factual information, domain expertise, reference data, definitions, or institutional memory. E.g. "Our SLA guarantees 99.9% uptime", "Target market is mid-enterprise 200-2000 employees".
- **PROCEDURE** — Step-by-step processes, workflows, checklists, or operational sequences. E.g. "Onboarding checklist: 1. Send welcome email, 2. Schedule kick-off…"
- **PLAYBOOK** — Strategic approaches, methodologies, or multi-step strategies for achieving outcomes. A playbook bundles related procedures, directives, and knowledge into a coherent action plan. E.g. "Enterprise Sales Playbook", "Incident Response Playbook".
- **PREFERENCE** — Working style preferences, communication tone, formatting choices, or personal operational defaults. E.g. "Prefers bullet points over prose", "Communicates in formal English".
- **RESEARCH** — Findings, analyses, competitive intelligence, market data, or investigative insights. E.g. "Competitor X launched feature Y in Q3", "Market analysis shows 15% YoY growth".
- **PRINCIPLE** — Core beliefs, values, philosophical stances, or guiding tenets that shape decision-making. E.g. "Customer trust over short-term revenue", "Transparency by default".

## BUNDLES
Bundles are **curated collections** of related context items that belong together as a coherent knowledge unit. When you detect content that represents a cohesive topic (e.g. a playbook, a domain expertise area, a project brief), create a bundle and assign its items into it.

**Bundle types to consider:**
- A Playbook document → Create a PLAYBOOK-type bundle with PROCEDURE, DIRECTIVE, and KNOWLEDGE items inside
- A domain expertise document → Create a KNOWLEDGE bundle grouping related facts
- A policy/governance document → Create a bundle of DIRECTIVE and PRINCIPLE items
- A research report → Create a RESEARCH bundle with findings as items
- A conversation extract → Create a bundle if 3+ items from the same discussion topic

## EXTRACTION PRINCIPLES
1. **Deep extraction**: Don't be superficial. Extract EVERY meaningful, actionable, or referenceable piece of knowledge. A 5-page document should yield 10-30+ items, not 3-5 vague summaries.
2. **Atomic items**: Each context item should be self-contained and independently useful. Don't create items that are too broad ("Communication skills") — instead create specific ones ("Prefers async Slack communication over meetings for status updates").
3. **Rich content**: The \`content\` field should contain the full, detailed information — not a one-line summary. Include specifics, numbers, names, conditions, and context.
4. **Correct categorization**: Be precise about which category each item belongs to. A rule is a DIRECTIVE, not KNOWLEDGE. A process is a PROCEDURE, not a DIRECTIVE.
5. **Intent-aware bundling**: If the content IS a playbook, create it as a single bundle with all its components. If the content covers multiple topics, create multiple bundles. Standalone items that don't fit a bundle should remain standalone.
6. **Preserve hierarchy**: If the content has sections/chapters/threads, use them to inform bundle structure.
7. **Working preferences**: Extract ONLY genuine style/working preferences (tone, format, tools, communication style). Don't force general knowledge into preferences.

## ANALYSIS NOTES
Provide a brief \`analysis_notes\` string explaining what you found, what structure you chose, and any recommendations for the user about how to organize the extracted items in their knowledge graph.

Return results via the extract_knowledge tool.`;

/**
 * Source-specific user prompts — tailored instructions per extraction context.
 */
function buildUserPrompt(
  sourceType: string,
  content: string,
  meta: Record<string, string>,
): string {
  const truncated = content.slice(0, 30000);
  const overflow = content.length > 30000
    ? "\n\n[... content truncated at 30,000 characters ...]"
    : "";

  switch (sourceType) {
    case "chat":
      return `Analyze the following chat conversation and extract ALL knowledge elements — decisions made, preferences expressed, procedures discussed, principles stated, and any actionable insights.

**Chat metadata:**
- Chat title: ${meta.title || "Untitled"}
- Workbook: ${meta.workbook || "N/A"}
- Participants: ${meta.participants || "N/A"}

**Conversation content:**
${truncated}${overflow}

Now extract every meaningful element. Pay special attention to decisions, action items, and implicit preferences expressed by participants.`;

    case "task":
      return `Analyze the following task output/notes and extract ALL knowledge elements — procedures followed, lessons learned, research findings, and reusable knowledge.

**Task metadata:**
- Task title: ${meta.title || "Untitled"}
- Workbook: ${meta.workbook || "N/A"}
- Status: ${meta.status || "N/A"}

**Task content:**
${truncated}${overflow}

Extract every piece of reusable knowledge, procedure, or finding.`;

    case "research":
      return `Analyze the following research content and extract ALL knowledge elements — findings, data points, competitive intelligence, and actionable insights.

**Research metadata:**
- Title: ${meta.title || "Untitled"}
- Source: ${meta.source || "N/A"}

**Research content:**
${truncated}${overflow}

Focus on creating well-structured RESEARCH items with specific data points and findings. Bundle related findings together.`;

    case "document":
    case "loom":
    default:
      return `Analyze the following document thoroughly and extract ALL knowledge elements. Be exhaustive — every actionable fact, rule, process, insight, or preference should become a context item.

**Document metadata:**
- File name: ${meta.file_name || "Unknown"}
- Category: ${meta.category || "other"}
- Type: ${meta.file_type || "text"}

**Document content:**
${truncated}${overflow}

Now extract every meaningful element. Remember:
- Create bundles when items naturally group together (especially for playbooks, topic areas, or document sections)
- Each item must be specific and self-contained with rich content
- Use the correct category for each item
- Extract working preferences ONLY when they genuinely describe working style
- Provide analysis_notes with your reasoning and recommendations`;
  }
}

const TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "extract_knowledge",
    description:
      "Extract structured knowledge elements from content into the AACE context management system",
    parameters: {
      type: "object",
      properties: {
        analysis_notes: {
          type: "string",
          description:
            "Brief analysis of what was found, the structure chosen, and recommendations for organizing in the knowledge graph. 2-4 sentences.",
        },
        preferences: {
          type: "array",
          description:
            "Working style preferences ONLY — tone, communication style, formatting, tool preferences. NOT general knowledge.",
          items: {
            type: "object",
            properties: {
              preference_key: {
                type: "string",
                enum: [
                  "tone",
                  "communication_style",
                  "response_depth",
                  "focus_areas",
                  "excluded_topics",
                  "preferred_frameworks",
                  "output_format",
                  "principles",
                  "prohibitions",
                  "expertise",
                  "past_experiences",
                  "tools_and_platforms",
                  "collaboration_style",
                  "decision_style",
                ],
              },
              preference_value: {
                type: "string",
                description: "Specific, detailed preference value",
              },
              condition_label: {
                type: "string",
                description:
                  "Optional: when this preference applies (e.g. 'client meetings', 'technical writing')",
              },
            },
            required: ["preference_key", "preference_value"],
            additionalProperties: false,
          },
        },
        context_items: {
          type: "array",
          description:
            "Standalone items that don't belong to any bundle. Each must be specific and self-contained.",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description:
                  "Clear, specific title (not vague). E.g. 'SLA Response Time Tiers' not 'Performance'",
              },
              content: {
                type: "string",
                description:
                  "Full, detailed content with specifics, numbers, conditions. Multiple sentences minimum.",
              },
              category: {
                type: "string",
                enum: [
                  "KNOWLEDGE",
                  "RESEARCH",
                  "DIRECTIVE",
                  "PRINCIPLE",
                  "PROCEDURE",
                  "PLAYBOOK",
                  "PREFERENCE",
                ],
              },
            },
            required: ["title", "content", "category"],
            additionalProperties: false,
          },
        },
        bundles: {
          type: "array",
          description:
            "Logical groupings of related items. Create a bundle when 3+ items naturally belong together.",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description:
                  "Descriptive bundle name, e.g. 'Enterprise Onboarding Playbook'",
              },
              description: {
                type: "string",
                description:
                  "What this bundle covers and when it should be activated in the context graph",
              },
              scope_suggestion: {
                type: "string",
                enum: ["personal", "team", "organization"],
                description: "Suggested scope level for this bundle",
              },
              items: {
                type: "array",
                description: "Context items belonging to this bundle",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    category: {
                      type: "string",
                      enum: [
                        "KNOWLEDGE",
                        "RESEARCH",
                        "DIRECTIVE",
                        "PRINCIPLE",
                        "PROCEDURE",
                        "PLAYBOOK",
                        "PREFERENCE",
                      ],
                    },
                  },
                  required: ["title", "content", "category"],
                  additionalProperties: false,
                },
              },
            },
            required: ["title", "description", "scope_suggestion", "items"],
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
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const {
      data: { user },
      error: authError,
    } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const sourceType: string = body.source_type || "document";

    let textContent = "";
    let meta: Record<string, string> = {};

    // ── Route by source type ──────────────────────────────────────────────
    if (sourceType === "document" || sourceType === "loom") {
      const { documentId } = body;
      if (!documentId) throw new Error("documentId required");

      const adminClient = createClient(supabaseUrl, supabaseKey);
      const { data: doc, error: docError } = await adminClient
        .from("personal_documents")
        .select("*")
        .eq("id", documentId)
        .eq("user_id", user.id)
        .single();
      if (docError || !doc) throw new Error("Document not found");

      const { data: fileData, error: dlError } = await adminClient.storage
        .from("personal-documents")
        .download(doc.file_path);
      if (dlError || !fileData) throw new Error("Failed to download file");

      textContent = await fileData.text();
      meta = {
        file_name: doc.file_name,
        category: doc.document_category,
        file_type: doc.file_type,
      };

      // Update parsed status
      await adminClient
        .from("personal_documents")
        .update({ parsed_status: "parsed" })
        .eq("id", documentId);

    } else if (sourceType === "chat" || sourceType === "task" || sourceType === "research") {
      // Direct content extraction — content & meta passed in the body
      textContent = body.content || "";
      meta = body.meta || {};
      if (!textContent) throw new Error("content required for " + sourceType);

    } else if (sourceType === "manual") {
      textContent = body.content || "";
      meta = body.meta || {};
      if (!textContent) throw new Error("content required");
    }

    // ── Call AI ──────────────────────────────────────────────────────────
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: buildUserPrompt(sourceType, textContent, meta),
            },
          ],
          tools: [TOOL_DEFINITION],
          tool_choice: {
            type: "function",
            function: { name: "extract_knowledge" },
          },
        }),
      },
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Please add credits.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw new Error("AI extraction failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No extraction result");

    const extracted = JSON.parse(toolCall.function.arguments);
    if (!extracted.bundles) extracted.bundles = [];
    if (!extracted.analysis_notes) extracted.analysis_notes = "";

    return new Response(JSON.stringify(extracted), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-knowledge error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

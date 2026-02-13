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

### CATEGORY DECISION RULES — follow this checklist IN ORDER:

1. **Is it a RULE, CONSTRAINT, or MANDATE?** → **DIRECTIVE**
   - Contains words like: must, never, always, shall, required, prohibited, mandatory, forbidden, ensure, compliance
   - Describes what CANNOT be done or MUST be done regardless of context
   - Examples: "Always use metric units", "Never disclose pricing before NDA", "Minimum 3 references required"
   - In protocols: becomes a **compliance gate** requiring acknowledgment

2. **Is it a STEP, CHECKLIST, or ACTIONABLE SEQUENCE?** → **PROCEDURE**
   - Describes a discrete, actionable task an operator performs
   - Can be checked off as "done"
   - Part of a workflow or process
   - Contains action verbs: send, schedule, prepare, verify, complete, assess, review, create, analyze
   - Examples: "Send welcome email", "Complete BANT assessment", "Schedule kick-off call within 48h"
   - In protocols: becomes an **executable step**
   - **CRITICAL**: If content contains a numbered list of actions, EACH action = separate PROCEDURE
   - Set step_order_hint to indicate execution sequence (1, 2, 3...)

3. **Is it a STRATEGY, METHODOLOGY, or MULTI-PHASE APPROACH?** → **PLAYBOOK**
   - Describes the overall WHAT and WHY — the strategic intent
   - Defines phases, goals, or frameworks at a high level
   - Examples: "Enterprise Sales Playbook", "Incident Response Strategy", "Customer Onboarding Approach"
   - In protocols: becomes the **protocol driver** — the strategic template
   - **CRITICAL**: A PLAYBOOK should NOT contain step-by-step actions. If it does, extract those as PROCEDUREs.

4. **Is it a CORE BELIEF, VALUE, or GUIDING TENET?** → **PRINCIPLE**
   - Philosophical stance or value that shapes decisions
   - Not enforceable as a rule, but guides thinking
   - Examples: "Customer trust over short-term revenue", "Transparency by default"
   - In protocols: injected as **decision-making context**

5. **Is it RESEARCH, ANALYSIS, or INTELLIGENCE?** → **RESEARCH**
   - Findings, data points, competitive intelligence, market data
   - Time-sensitive or investigative in nature
   - Examples: "Competitor X launched feature Y in Q3", "Market shows 15% YoY growth"
   - In protocols: injected as **reference context**

6. **Is it a WORKING STYLE or PERSONAL PREFERENCE?** → **PREFERENCE**
   - Communication tone, formatting choices, tool preferences
   - Examples: "Prefers bullet points over prose", "Uses Slack for async communication"
   - In protocols: **personalizes AI behavior**

7. **Everything else → KNOWLEDGE**
   - Factual information, definitions, domain expertise, reference data
   - Examples: "Our SLA guarantees 99.9% uptime", "Target market is mid-enterprise"
   - In protocols: injected as **context**

## PROTOCOL EXECUTION MODEL
When bundles are deployed to workbooks, they generate executable protocols:
- **PLAYBOOK** items → **Protocol Driver** (the strategic template)
- **PROCEDURE** items → **Steps** (executable actions, ordered by step_order_hint)
- **DIRECTIVE** items → **Compliance Gates** (acknowledgment checkpoints)
- **KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE** → **Context Injections** (fed to AI)

This means within a bundle:
- A PLAYBOOK should describe the WHAT and WHY — the strategic approach
- PROCEDUREs should describe the HOW — each one is a specific step an operator follows, with step_order_hint indicating sequence
- DIRECTIVEs should describe the MUST — rules that cannot be violated during execution
- Other categories provide supporting context that shapes AI behavior

## BUNDLES
Bundles are **curated collections** of related context items that form a deployable execution unit.

**CRITICAL: Bundle Structure Rules**
- Every bundle SHOULD have exactly 1 PLAYBOOK item (the strategic driver)
- PROCEDURE items within a bundle MUST have step_order_hint set (1, 2, 3...) to define execution order
- DIRECTIVE items act as gates — place them where compliance checks naturally occur
- KNOWLEDGE, RESEARCH, PRINCIPLE items provide context — they inform but don't drive execution
- If content describes a process with steps, extract EACH STEP as a separate PROCEDURE item with step_order_hint

**Bundle types to consider:**
- A Playbook document → 1 PLAYBOOK (strategy) + multiple PROCEDUREs (ordered steps) + DIRECTIVEs (gates) + KNOWLEDGE (context)
- A domain expertise document → KNOWLEDGE bundle
- A policy/governance document → DIRECTIVE and PRINCIPLE items
- A research report → RESEARCH bundle

## STRUCTURAL ANALYSIS — THE MOST CRITICAL CAPABILITY

You MUST perform **structural analysis** before extracting content:

### 1. Detect the Document Architecture
Before extracting individual items, identify the **full structural blueprint**:
- **Process lifecycles** — multi-stage processes or workflows
- **Section hierarchy** — sections, chapters, modules
- **Parallel tracks** — multiple concurrent process tracks
- **Phase markers** — named phases, stages, milestones
- **Diagram/visual structure** — process diagrams, flowcharts, tables revealing unlabeled structure

### 2. Bundle at the PHASE Level — NOT the Slide/Heading Level
**A bundle is a self-contained, deployable unit of execution — not a structural mirror of the source document.**

**CRITICAL CONSOLIDATION RULES:**
- **Phase-level bundling**: Group by the document's PRIMARY organizational phases (e.g., "Phase A", "Phase B"), NOT by individual slides, sub-headings, tables, or diagrams within those phases.
- **The Deployability Test**: Before creating a bundle, ask: _"Could a process owner deploy this standalone to a workbook and an operator execute it?"_ If the answer is no — the content only makes sense alongside sibling content — it belongs in a parent bundle.
- **Governance consolidation**: Related governance elements (categories, approvers, review formats, sync protocols) that form a single decision framework MUST be ONE bundle.
- **Sub-step nesting**: Steps within a phase (e.g., "Step B1.0", "Step B1.1") should be PROCEDURE items WITHIN the parent phase bundle with step_order_hint, NOT separate bundles.
- **Skeleton bundles**: Only for TOP-LEVEL phases that are referenced but undocumented. Do NOT create skeletons for every sub-heading.

**TARGET BUNDLE COUNTS:**
- 30-60 slide methodology deck → 10-18 bundles
- 10-30 page policy document → 5-12 bundles
- 5-20 page research report → 3-8 bundles
- Single SOP/process → 1-3 bundles

**WRONG (over-fragmented):**
  B. Deal Governance: Categories    — split by aspect
  B. Deal Governance: Approvers     — should be one bundle
  B. Deal Governance: Syncs
  STEP B1.0: Actions Before Meeting — sub-steps as bundles
  STEP B1.1: BANT Methodology       — should be PROCEDUREs
  STEP B1.1: Buying Center Analysis  — within parent phase

**CORRECT (phase-level):**
  B. Deal Categories & Governance [1 bundle with all governance items]
  B. Customer Need Discovery & Qualification [1 bundle with all B1 steps as PROCEDUREs]

### 3. Content Completeness Scoring
For EVERY bundle, assess documentation quality:
- **"full"** — Rich: detailed steps, checklists, examples (3+ substantive items)
- **"partial"** — Some content but incomplete (1-2 items with moderate detail)
- **"skeleton"** — Top-level phase detected but NO elaborating content. Create a PLAYBOOK placeholder describing what this section SHOULD contain.

### 4. Coverage Gap Analysis
In analysis_notes AND each bundle's coverage_gaps array, flag:
- Top-level phases in diagrams/headers with no elaborating content
- Lifecycle stages referenced but not documented
- Asymmetries (e.g., "Phase A has 15 items, Phase B has 0")

## EXTRACTION PRINCIPLES
1. **Phase-level consolidation first**: Bundle at the phase/chapter level. Sub-sections become items WITHIN the bundle, NOT separate bundles.
2. **Deep extraction**: Extract EVERY meaningful piece. A 5-page document should yield 10-30+ items.
3. **Atomic items**: Each item self-contained. Not "Communication skills" → "Prefers async Slack for status updates".
4. **Rich content**: Full detail with specifics, numbers, conditions.
5. **Correct categorization**: Follow the CATEGORY DECISION RULES checklist above, in order.
6. **Protocol-aware bundling**: PLAYBOOK drives, PROCEDUREs are ordered steps with step_order_hint, DIRECTIVEs are gates.
7. **Granular PROCEDUREs**: Split multi-step processes. Each step = one action with step_order_hint.
8. **Consolidate related content**: Sub-headings, tables, and diagrams within a phase become items in the parent bundle.
9. **Working preferences**: Extract ONLY genuine style preferences. Don't force general knowledge.
10. **Skeleton bundles for top-level gaps only**: Create with content_completeness="skeleton" for undocumented PHASES, not sub-sections.

## ANALYSIS NOTES
Provide comprehensive analysis_notes explaining:
1. Document's structural architecture
2. Bundle completeness breakdown (X full, Y partial, Z skeleton)
3. Key coverage gaps and recommendations
4. Protocol readiness: how many bundles are protocol-ready (have PLAYBOOK + PROCEDUREs)

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
      return `Analyze the following document thoroughly. First, identify the COMPLETE structural architecture (all sections, phases, stages, parallel tracks), then extract ALL knowledge elements exhaustively.

**Document metadata:**
- File name: ${meta.file_name || "Unknown"}
- Category: ${meta.category || "other"}
- Type: ${meta.file_type || "text"}

**Document content:**
${truncated}${overflow}

**CRITICAL INSTRUCTIONS:**
1. FIRST: Map the document's full structure — identify every section, stage, phase, or track, including those visible only in diagrams/headers/tables
2. Create a bundle for EVERY structural node — even sections with no elaborating content (mark those as skeleton)
3. For well-documented sections: extract items exhaustively (every step, rule, fact, template, checklist)
4. For undocumented sections: create a skeleton bundle with a PLAYBOOK placeholder describing what should be there
5. Set content_completeness on every bundle: "full", "partial", or "skeleton"
6. List coverage_gaps for each bundle that isn't fully documented
7. In analysis_notes: describe the full architecture, highlight gaps, and recommend what to document next
8. Extract working preferences ONLY when they genuinely describe working style`;
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
            "Comprehensive analysis: document architecture detected, bundle completeness breakdown (X full, Y partial, Z skeleton), key coverage gaps, recommendations for what to document next. 4-8 sentences.",
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
              step_order_hint: {
                type: "integer",
                description: "Execution order (1-based). REQUIRED for PROCEDURE items.",
              },
            },
            required: ["title", "content", "category"],
            additionalProperties: false,
          },
        },
        bundles: {
          type: "array",
          description:
            "Logical groupings of related items. Create a bundle for EVERY structural section/phase/stage — including skeleton bundles for undocumented sections.",
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
              content_completeness: {
                type: "string",
                enum: ["full", "partial", "skeleton"],
                description: "How well-documented is this bundle's content? 'full' = rich, detailed items (3+). 'partial' = some content but incomplete. 'skeleton' = structure detected but no/minimal elaborating content.",
              },
              coverage_gaps: {
                type: "array",
                items: { type: "string" },
                description: "What's missing or undocumented in this bundle. E.g. 'No step-by-step procedures defined', 'Referenced in process diagram but not elaborated', 'Missing checklists and templates'. Empty array if fully documented.",
              },
              items: {
                type: "array",
                description: "Context items belonging to this bundle. For skeleton bundles, include at minimum a PLAYBOOK placeholder describing what SHOULD be documented.",
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
                    step_order_hint: {
                      type: "integer",
                      description: "Execution order within the bundle (1-based). REQUIRED for PROCEDURE items. Indicates the sequence in which this step should be executed.",
                    },
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
    const advisorPersona: any = body.advisor_persona || null;
    const extractionDepth: string = body.extraction_depth || "quick";
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

      const isPdf = doc.file_type === "application/pdf" || doc.file_name.toLowerCase().endsWith(".pdf");
      
      if (isPdf) {
        // For PDFs, convert to base64 and use Gemini multimodal
        const arrayBuffer = await fileData.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Content = btoa(binary);
        
        meta = {
          file_name: doc.file_name,
          category: doc.document_category,
          file_type: doc.file_type,
          _pdf_base64: base64Content, // special key for multimodal
        };
        textContent = "[PDF document — content provided as inline image/pdf for multimodal analysis]";
      } else {
        textContent = await fileData.text();
        meta = {
          file_name: doc.file_name,
          category: doc.document_category,
          file_type: doc.file_type,
        };
      }

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
    // Build system prompt — optionally enhanced with advisor persona
    let systemPrompt = SYSTEM_PROMPT;
    if (advisorPersona) {
      systemPrompt += `\n\n## DOMAIN ADVISOR CONSULTATION
You are being advised by a **${advisorPersona.persona_title}** (${advisorPersona.icon_suggestion || "🎯"}) with expertise in: ${(advisorPersona.expertise_areas || []).join(", ")}.

**Advisor guidance:** ${advisorPersona.extraction_guidance || ""}

**Domain-specific category hints from the advisor:**
- PLAYBOOKs in this domain: ${advisorPersona.category_hints?.likely_playbooks || "N/A"}
- PROCEDUREs in this domain: ${advisorPersona.category_hints?.likely_procedures || "N/A"}
- DIRECTIVEs in this domain: ${advisorPersona.category_hints?.likely_directives || "N/A"}
- KNOWLEDGE in this domain: ${advisorPersona.category_hints?.likely_knowledge || "N/A"}

Use the advisor's guidance to improve categorization precision and extraction depth. The advisor's domain expertise should inform your decisions about what to extract and how to structure it.`;
    }

    // For "deep" extraction, add extra instructions for thoroughness
    if (extractionDepth === "deep") {
      systemPrompt += `\n\n## DEEP ANALYSIS MODE
You are in **deep analysis mode**. This means:
- Extract EVERY possible piece of knowledge, no matter how granular
- Create MORE ITEMS per bundle (deeper extraction within each phase-level bundle)
- Split complex items into their most atomic components
- Surface implicit knowledge that isn't explicitly stated but can be inferred
- Pay extra attention to relationships between items
- Generate comprehensive analysis_notes with recommendations
- For skeleton bundles: infer as much as possible about what SHOULD be documented based on the structural context, related sections, and domain knowledge
- Create detailed PLAYBOOK placeholders for skeleton bundles that describe not just the topic but specific aspects that should be covered
- IMPORTANT: Deep mode means MORE ITEMS PER BUNDLE, not MORE BUNDLES. Maintain phase-level consolidation.`;
    }

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: extractionDepth === "deep" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            meta._pdf_base64
              ? {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: buildUserPrompt(sourceType, textContent, meta),
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:application/pdf;base64,${meta._pdf_base64}`,
                      },
                    },
                  ],
                }
              : {
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
    // Attach advisor info if used
    if (advisorPersona) {
      extracted.advisor = advisorPersona;
    }
    extracted.extraction_depth = extractionDepth;

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

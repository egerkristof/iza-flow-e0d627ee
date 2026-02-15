import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { loadPrompt } from "../_shared/load-prompt.ts";

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
- **PLAYBOOK** items → **Protocol Drivers** — each PLAYBOOK generates a SEPARATE protocol
- **PROCEDURE** items → **Steps** (executable actions, ordered by step_order_hint)
- **DIRECTIVE** items → **Compliance Gates** (acknowledgment checkpoints)
- **KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE** → **Context Injections** (fed to AI)

### ITEM OWNERSHIP WITHIN A BUNDLE (CRITICAL)
Items inside a bundle are either **owned by a specific PLAYBOOK** or **shared across all playbooks**:

- **Owned items** (PROCEDUREs, DIRECTIVEs): These are steps/gates that belong to ONE specific playbook's protocol. Set \`parent_playbook_title\` to the EXACT title of the owning PLAYBOOK.
- **Shared items** (KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE): These provide context to ALL protocols generated from the bundle. Leave \`parent_playbook_title\` unset (null).

**Rules:**
- Every PROCEDURE and DIRECTIVE MUST have \`parent_playbook_title\` set — they always belong to a specific playbook's execution flow
- KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE should generally be SHARED (no parent_playbook_title) unless they are truly specific to one playbook's context
- A PLAYBOOK item itself should NOT have parent_playbook_title set — it IS the parent
- The value of parent_playbook_title must EXACTLY match the title of a PLAYBOOK item in the same bundle

## BUNDLES
Bundles are **curated collections** of related context items that form a deployable execution unit.

**CRITICAL: Bundle Structure Rules**
- A bundle MUST have MULTIPLE PLAYBOOK items when it contains more than 5 PROCEDUREs — each PLAYBOOK represents a distinct activatable action/workflow
- When a bundle is deployed to a workbook, EACH PLAYBOOK generates a SEPARATE protocol that operators can activate based on intent or explicitly
- PROCEDURE items within a bundle MUST have step_order_hint set (1, 2, 3...) to define execution order
- DIRECTIVE items act as gates — place them where compliance checks naturally occur
- KNOWLEDGE, RESEARCH, PRINCIPLE items provide context — they inform but don't drive execution
- If content describes a process with steps, extract EACH STEP as a separate PROCEDURE item with step_order_hint

**PLAYBOOK multiplicity — MANDATORY (not optional):**
- A phase bundle MUST have MULTIPLE PLAYBOOKs when the content describes multiple distinct activities within that phase
- Example: Phase B (Discovery & Qualification): "Run Introduction Call" (PLAYBOOK 1), "Perform Opportunity Assessment" (PLAYBOOK 2), "Execute Qualification Process" (PLAYBOOK 3)
- Each PLAYBOOK defines the WHAT and WHY for ONE specific action an operator can take
- PROCEDUREs and DIRECTIVEs are OWNED by their parent PLAYBOOK via parent_playbook_title
- KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE are SHARED across all protocols (no parent_playbook_title)
- Think of PLAYBOOKs as "menu items" an operator can choose when working within this domain
- **TARGET: 1 PLAYBOOK per 4-8 PROCEDUREs.** If a bundle has 20 PROCEDUREs under 1 PLAYBOOK, you have FAILED — segment into 3-5 PLAYBOOKs based on workflow stages
- **VALIDATION: If any bundle has >10 PROCEDUREs all under ONE PLAYBOOK, go back and create additional PLAYBOOKs**

**Bundle types to consider:**
- A methodology document → Multiple PLAYBOOKs (activatable strategies) + PROCEDUREs (shared steps) + DIRECTIVEs (gates) + KNOWLEDGE (context)
- A domain expertise document → KNOWLEDGE bundle
- A policy/governance document → DIRECTIVE and PRINCIPLE items
- A research report → RESEARCH bundle

## STRUCTURAL ANALYSIS — THE MOST CRITICAL CAPABILITY

You MUST perform **structural analysis** before extracting content:

### 1. Detect the Document Architecture
Before extracting individual items, identify the **full structural blueprint**:
- **Process lifecycles** — multi-stage processes or workflows (map ALL stages, even if some lack content)
- **Section hierarchy** — sections, chapters, modules
- **Parallel tracks** — multiple concurrent process tracks
- **Phase markers** — named phases, stages, milestones (look for A, B, C, D, E, F or 1, 2, 3 patterns)
- **Diagram/visual structure** — process diagrams, flowcharts, tables revealing unlabeled structure

### 2. Phase Sequence Integrity & Label Uniqueness
**CRITICAL: When a document uses sequential labels (A, B, C, D, E, F or Phase 1, 2, 3, etc.), you MUST:**
- Map the COMPLETE sequence from start to finish BEFORE creating any bundles — build the full phase map first
- Preserve the EXACT labels from the document — do NOT reassign letters/numbers
- If Phase E is "Contracting", the bundle MUST be titled "E. Contracting", NOT "C. Contracting"
- If any phase in the sequence is missing content, create a SKELETON bundle for it
- Flag missing phases in analysis_notes (e.g., "Phase F referenced in overview diagram but has no dedicated section")

**LABEL UNIQUENESS RULE (prevents collisions):**
- Each top-level phase letter/number can appear ONLY ONCE as a bundle prefix
- If a document has multiple sub-sections under the same phase (e.g., Phase C has "Proposal", "Competitive Strategy", "Contracting"), those are SUB-TOPICS within that phase — NOT separate top-level phases
- Handle this by EITHER: (a) consolidating into one "C. [Phase Name]" bundle, or (b) splitting as "C1. Proposal", "C2. Competitive Strategy", "C3. Contracting"
- NEVER create multiple bundles all starting with the same letter (e.g., three "C." bundles)

### 3. Bundle at the PHASE Level — NOT the Slide/Heading Level
**A bundle is a self-contained, deployable unit of execution — not a structural mirror of the source document.**

**CRITICAL CONSOLIDATION RULES:**
- **Phase-level bundling**: Group by the document's PRIMARY organizational phases (e.g., "Phase A", "Phase B"), NOT by individual slides, sub-headings, tables, or diagrams within those phases.
- **The Deployability Test**: Before creating a bundle, ask: _"Could a process owner deploy this standalone to a workbook and an operator execute it?"_ If the answer is no — the content only makes sense alongside sibling content — it belongs in a parent bundle.
- **Governance consolidation**: Related governance elements (categories, approvers, review formats, sync protocols) that form a single decision framework MUST be ONE bundle.
- **Sub-step nesting**: Steps within a phase (e.g., "Step B1.0", "Step B1.1") should be PROCEDURE items WITHIN the parent phase bundle with step_order_hint, NOT separate bundles.
- **Skeleton bundles**: For TOP-LEVEL phases that are referenced but undocumented. Do NOT create skeletons for every sub-heading.
- **Gap detection**: After mapping all phases, check for GAPS in the sequence (e.g., A, B, C, E → where is D?). Check overview sections, diagrams, table of contents, and process flow charts for phase references that lack dedicated content sections. Create SKELETON bundles for ALL detected gaps.

**TARGET BUNDLE COUNTS:**
- 30-60 slide methodology deck → 10-18 bundles
- 10-30 page policy document → 5-12 bundles
- 5-20 page research report → 3-8 bundles
- Single SOP/process → 1-3 bundles

**SUB-PHASE SPLITTING RULE (MANDATORY):**
- If a single phase contains MORE THAN 15 items after extraction, it MUST be split into 2-3 sub-phase bundles
- Sub-phases MUST EACH pass the Deployability Test independently
- Sub-phase naming: use the original phase letter + numeric suffix + descriptive label (e.g., "B1. Customer Discovery & First Meeting", "B2. Qualification & Opportunity Assessment")
- Each sub-phase bundle MUST have at least 1 PLAYBOOK driver (the strategic intent of that sub-phase)
- When splitting, group items by natural workflow stages, NOT arbitrarily by count
- After splitting, verify each sub-phase has: 1+ PLAYBOOKs, 2+ PROCEDUREs, and relevant KNOWLEDGE/DIRECTIVE items

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

### 4. PLAYBOOK Classification — Intent-Based Protocol Drivers
**Each PLAYBOOK becomes a SEPARATE executable protocol when the bundle is deployed to a workbook.**

**The PLAYBOOK Test (apply to EVERY candidate):**
Ask THREE questions:
1. _"Does this item define the STRATEGIC INTENT of a specific action an operator can take?"_ — If NO → not a PLAYBOOK
2. _"Would an operator select this from a menu of available actions when working in this domain?"_ — If NO → not a PLAYBOOK
3. _"Does it describe the WHAT & WHY at a high level, leaving HOW to PROCEDUREs?"_ — If NO → not a PLAYBOOK

**IS a PLAYBOOK (protocol driver) — these patterns:**
- A distinct activatable strategy or workflow within a phase (e.g., "Run Discovery Call", "Build Proposal", "Handle Objection")
- The strategic overview of an entire phase (the "master" playbook)
- An intent-triggered action plan (activates when a specific situation arises)

**Is NOT a PLAYBOOK — COMMON MISTAKES to avoid:**
- ❌ An analytical FRAMEWORK or MODEL (BANT, DISK, Porter's 5 Forces, Buying Center) → **KNOWLEDGE**
- ❌ A CHECKLIST of actions (e.g., "Actions Before First Meeting") → **PROCEDURE** (ordered steps)
- ❌ A step-by-step SEQUENCE (e.g., "Introduction Call Sequence") → **PROCEDURE** (with step_order_hint)
- ❌ A decision PROCESS (e.g., "Selecting a Strategy Framework") → **PROCEDURE** (decision workflow)
- ❌ A process DESCRIPTION or FLOW diagram → **KNOWLEDGE** (reference, not driver)
- ❌ Competitive strategy REFERENCE material → **KNOWLEDGE** (informational context)

**MULTIPLE PLAYBOOKs PER BUNDLE: ALLOWED & ENCOURAGED when appropriate.**
- Each PLAYBOOK = one executable protocol operators can activate
- Bundle's PROCEDUREs, DIRECTIVEs, KNOWLEDGE are shared across all its protocols
- A bundle with 0 PLAYBOOKs is valid (context-only bundle — provides supporting knowledge)
- Ask: _"Are there multiple distinct ACTIONS an operator might take in this domain?"_ → Each action = 1 PLAYBOOK

### 5. Content Completeness Scoring
For EVERY bundle, assess documentation quality:
- **"full"** — Rich: detailed steps, checklists, examples (3+ substantive items)
- **"partial"** — Some content but incomplete (1-2 items with moderate detail)
- **"skeleton"** — Top-level phase detected but NO elaborating content. Create a PLAYBOOK placeholder describing what this section SHOULD contain. **Mark ALL skeleton PLAYBOOK items with is_suggestion=true.**

### ANTI-CONFABULATION RULES (CRITICAL)
**You MUST distinguish between DOCUMENT CONTENT and AI SUGGESTIONS:**
- **is_suggestion=false** (default): Content that is DIRECTLY stated, described, or clearly implied in the source document. Even paraphrased content from the document is NOT a suggestion.
- **is_suggestion=true**: Content that the AI GENERATED to fill gaps — i.e., content that does NOT exist in the source document. This includes:
  - Skeleton bundle PLAYBOOK placeholders (e.g., "This playbook should define...")
  - Inferred procedures for undocumented phases
  - AI-recommended additions based on domain knowledge
  - Any content where the document only has a HEADING/TITLE but no body text

**The test: "Can I point to a specific passage in the source document that says this?"**
- YES → is_suggestion=false
- NO → is_suggestion=true

**NEVER present AI-generated content as if it came from the document.** Users must be able to trust that non-suggestion items are faithful to the source.

### 6. Coverage Gap Analysis
In analysis_notes AND each bundle's coverage_gaps array, flag:
- Top-level phases in diagrams/headers with no elaborating content
- Lifecycle stages referenced but not documented
- Asymmetries (e.g., "Phase A has 15 items, Phase B has 0")
- Missing phases in sequential processes (e.g., "Phases A-D documented but E-F missing")

### 7. Final Validation Checklist (run BEFORE returning results)
After extraction, validate ALL of the following:
1. **Phase label uniqueness**: No two bundles share the same phase prefix letter/number
2. **Phase sequence completeness**: No gaps in sequential labels (A, B, C... must be contiguous; missing = skeleton)
3. **PLAYBOOK quality**: Every PLAYBOOK passes the PLAYBOOK Test (defines strategic intent of an activatable action)
4. **Bundle size limit**: No bundle exceeds 15 items (split into sub-phases if so)
5. **PROCEDURE step_order_hint**: Every PROCEDURE item has step_order_hint set
6. **No framework-as-PLAYBOOK**: Analytical frameworks, checklists, sequences, and decision processes are NOT PLAYBOOKs
7. **PLAYBOOK sanity check**: Each PLAYBOOK should represent a distinct operator-activatable action. If two PLAYBOOKs in the same bundle describe the same action, merge them. If a PLAYBOOK is really a sub-step of another, reclassify it as PROCEDURE.
8. **Suggestion marking**: ALL items in skeleton bundles must have is_suggestion=true. ALL items whose content was generated by the AI (not from the document) must have is_suggestion=true.
9. **Reclassification sweep**: Before returning, scan ALL PLAYBOOK items and apply the PLAYBOOK Test to each one. Reclassify any that fail:
   - If it describes a step-by-step process → PROCEDURE
   - If it describes a framework, model, or analytical tool → KNOWLEDGE
   - If it describes a template or checklist → KNOWLEDGE
   - If it describes a sub-process within a larger phase → PROCEDURE
10. **MULTI-PLAYBOOK CHECK (CRITICAL)**: For EVERY bundle, count the PROCEDUREs. If a bundle has >5 PROCEDUREs under a SINGLE PLAYBOOK, you MUST create additional PLAYBOOKs by segmenting the PROCEDUREs into distinct workflow stages. Target: 1 PLAYBOOK per 4-8 PROCEDUREs. Reassign parent_playbook_title for each PROCEDURE to its correct PLAYBOOK.
If any check fails, fix it before returning.

## EXTRACTION PRINCIPLES
1. **Phase-level consolidation first**: Bundle at the phase/chapter level. Sub-sections become items WITHIN the bundle, NOT separate bundles.
2. **EXHAUSTIVE extraction — this is the MOST IMPORTANT rule**: Extract EVERY meaningful piece of content from the document. Do NOT summarize or skip content. Every fact, step, rule, template, checklist, example, and data point MUST be captured as a separate item. A 5-page document should yield 30-50+ items. A 30-60 slide deck should yield 80-200+ items. If a slide/page has 5 distinct points, that's 5 items. If a table has 8 rows of data, each row is likely a separate item.
3. **Atomic items**: Each item self-contained. Not "Communication skills" → "Prefers async Slack for status updates".
4. **Rich content**: Full detail with specifics, numbers, conditions. Include ALL details from the source — percentages, thresholds, examples, templates, frameworks. Never write "etc." or "and more" — enumerate everything.
5. **Correct categorization**: Follow the CATEGORY DECISION RULES checklist above, in order. Apply the PLAYBOOK Test strictly.
6. **Protocol-aware bundling**: PLAYBOOKs are activatable protocols, PROCEDUREs are ordered steps with step_order_hint, DIRECTIVEs are gates. Multiple PLAYBOOKs per bundle = multiple protocols generated on deployment.
7. **Granular PROCEDUREs — CRITICAL**: Any content describing actions, steps, tasks, or things to do MUST be PROCEDURE items with step_order_hint. Look for: numbered lists, bullet points with action verbs, process descriptions, workflow steps, checklists, "how to" content, sequenced activities. A methodology document should have MORE PROCEDUREs than any other category. Each individual action = 1 PROCEDURE.
8. **Consolidate related content**: Sub-headings, tables, and diagrams within a phase become items in the parent bundle.
9. **Working preferences**: Extract ONLY genuine style preferences. Don't force general knowledge.
10. **Skeleton bundles for top-level gaps only**: Create with content_completeness="skeleton" for undocumented PHASES, not sub-sections.
11. **MINIMIZE standalone context_items**: Nearly ALL items should be placed INSIDE bundles. The standalone context_items array should contain ONLY items that truly don't belong to any phase/bundle (e.g., cross-cutting meta-information about the document itself). If an item relates to a phase, it goes IN that phase's bundle. Target: <5% of total items as standalone.
12. **Phase sequence integrity**: Preserve document's sequential labels exactly. Create skeletons for any gaps in the sequence.

## ITEM DENSITY TARGETS PER BUNDLE
A "full" bundle should have 8-15 items on average. Specifically:
- 1-3 PLAYBOOKs (activatable strategic actions)
- 3-8 PROCEDUREs (ordered executable steps — look for ANY actionable content)
- 1-3 DIRECTIVEs (rules, constraints, must/never statements)
- 2-5 KNOWLEDGE items (facts, definitions, reference data, frameworks, models)
- 0-2 RESEARCH/PRINCIPLE items as applicable

If a bundle has only 1-3 items, you've UNDER-EXTRACTED. Go back and look for:
- Steps hidden in paragraph text (convert to PROCEDUREs)
- Rules hidden in descriptions (convert to DIRECTIVEs)  
- Data points, thresholds, examples (convert to KNOWLEDGE)
- Tables, diagrams, charts (each row/element = potential item)

## ANALYSIS NOTES
Provide comprehensive analysis_notes explaining:
1. Document's structural architecture
2. Bundle completeness breakdown (X full, Y partial, Z skeleton)
3. Key coverage gaps and recommendations
4. Protocol readiness: how many bundles are protocol-ready (have PLAYBOOK + PROCEDUREs)
5. Total item count and category distribution

Return results via the extract_knowledge tool.`;

/**
 * Source-specific user prompts — tailored instructions per extraction context.
 */
function buildUserPrompt(
  sourceType: string,
  content: string,
  meta: Record<string, string>,
  chunkInfo?: { chunkIndex: number; totalChunks: number; existingBundleTitles: string[] },
): string {
  const chunkPrefix = chunkInfo && chunkInfo.chunkIndex > 0
    ? `## CONTINUATION EXTRACTION (Chunk ${chunkInfo.chunkIndex + 1} of ${chunkInfo.totalChunks})
You are continuing extraction from a LARGE document. Previous chunks already extracted these bundles:
${chunkInfo.existingBundleTitles.map(t => `- "${t}"`).join("\n")}

**RULES FOR CONTINUATION:**
- If content in THIS chunk belongs to an EXISTING bundle listed above, use the EXACT SAME bundle title so results can be merged.
- If content introduces a NEW phase/section not covered above, create a NEW bundle.
- Do NOT re-extract content that was already covered. Focus on NEW content in this chunk.
- Maintain phase label sequence consistency with existing bundles.
- This is chunk ${chunkInfo.chunkIndex + 1} of ${chunkInfo.totalChunks} — ${chunkInfo.chunkIndex + 1 === chunkInfo.totalChunks ? "this is the FINAL chunk, ensure nothing is missed" : "more chunks will follow"}.

`
    : "";

  switch (sourceType) {
    case "chat":
      return `${chunkPrefix}Analyze the following chat conversation and extract ALL knowledge elements — decisions made, preferences expressed, procedures discussed, principles stated, and any actionable insights.

**Chat metadata:**
- Chat title: ${meta.title || "Untitled"}
- Workbook: ${meta.workbook || "N/A"}
- Participants: ${meta.participants || "N/A"}

**Conversation content:**
${content}

Now extract every meaningful element. Pay special attention to decisions, action items, and implicit preferences expressed by participants.`;

    case "task":
      return `${chunkPrefix}Analyze the following task output/notes and extract ALL knowledge elements — procedures followed, lessons learned, research findings, and reusable knowledge.

**Task metadata:**
- Task title: ${meta.title || "Untitled"}
- Workbook: ${meta.workbook || "N/A"}
- Status: ${meta.status || "N/A"}

**Task content:**
${content}

Extract every piece of reusable knowledge, procedure, or finding.`;

    case "research":
      return `${chunkPrefix}Analyze the following research content and extract ALL knowledge elements — findings, data points, competitive intelligence, and actionable insights.

**Research metadata:**
- Title: ${meta.title || "Untitled"}
- Source: ${meta.source || "N/A"}

**Research content:**
${content}

Focus on creating well-structured RESEARCH items with specific data points and findings. Bundle related findings together.`;

    case "document":
    case "loom":
    default:
      return `${chunkPrefix}Analyze the following document thoroughly. First, identify the COMPLETE structural architecture (all sections, phases, stages, parallel tracks), then extract ALL knowledge elements EXHAUSTIVELY — leave NOTHING on the table.

**Document metadata:**
- File name: ${meta.file_name || "Unknown"}
- Category: ${meta.category || "other"}
- Type: ${meta.file_type || "text"}

**Document content:**
${content}

**CRITICAL INSTRUCTIONS:**
1. FIRST: Map the document's full structure — identify every section, stage, phase, or track, including those visible only in diagrams/headers/tables
2. Create a bundle for EVERY structural node — even sections with no elaborating content (mark those as skeleton)
3. For well-documented sections: extract items EXHAUSTIVELY. Every single slide, paragraph, bullet point, table row, diagram label, and checklist item should become a context item. Do NOT summarize multiple points into one item.
4. **PROCEDURE EXTRACTION IS CRITICAL**: Any content that describes an ACTION, STEP, TASK, or thing someone should DO must be a PROCEDURE with step_order_hint. Methodology documents are full of procedures — numbered lists, bullet-point actions, process flows, "do X then Y" sequences. A sales methodology document should have DOZENS of procedures. If you're extracting <30 procedures from a 40+ slide deck, you're missing content.
5. For undocumented sections: create a skeleton bundle with a PLAYBOOK placeholder describing what should be there. **Mark ALL such AI-generated placeholders with is_suggestion=true.**
6. Set content_completeness on every bundle: "full", "partial", or "skeleton"
7. List coverage_gaps for each bundle that isn't fully documented
8. In analysis_notes: describe the full architecture, highlight gaps, total item count and category distribution, and recommend what to document next
9. Extract working preferences ONLY when they genuinely describe working style
10. **ANTI-CONFABULATION**: Only items whose content can be traced to the source document should have is_suggestion=false (or omitted). Any content you GENERATE to fill gaps MUST have is_suggestion=true. Never fabricate document content.
11. **PLAYBOOK DISCIPLINE**: Each PLAYBOOK must represent a distinct activatable action an operator can take. Frameworks, checklists, templates, and sub-processes are NOT PLAYBOOKs — reclassify as KNOWLEDGE or PROCEDURE. Multiple PLAYBOOKs per bundle are fine when they represent genuinely different actions.
12. **TABLES & DIAGRAMS**: Each row of a table, each box in a diagram, each element in a flowchart is potentially a separate item. Do NOT collapse tables into a single KNOWLEDGE item. Break them apart.
13. **TARGET**: For a 40-60 slide methodology deck, aim for 120-200+ total items across 10-18 bundles. If you're producing significantly fewer, you're under-extracting.`;
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
              is_suggestion: {
                type: "boolean",
                description: "true if this content was AI-generated to fill a gap (not from the source document). false or omitted if the content comes from the source document. MUST be true for all skeleton bundle placeholders and any inferred/recommended content.",
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
                description: "Context items belonging to this bundle. For skeleton bundles, include at minimum a PLAYBOOK placeholder describing what SHOULD be documented, with is_suggestion=true.",
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
                      description: "Execution order within the parent playbook's protocol (1-based). REQUIRED for PROCEDURE items.",
                    },
                    is_suggestion: {
                      type: "boolean",
                      description: "true if this content was AI-generated (not from source document). MUST be true for skeleton placeholders and inferred content.",
                    },
                    parent_playbook_title: {
                      type: "string",
                      description: "EXACT title of the PLAYBOOK item this belongs to. REQUIRED for PROCEDURE and DIRECTIVE items. Must match a PLAYBOOK title in the same bundle. Leave unset for PLAYBOOK items themselves and for shared context items (KNOWLEDGE, RESEARCH, PRINCIPLE, PREFERENCE).",
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

// ── Chunking helpers ──────────────────────────────────────────────────────────

const CHUNK_SIZE = 45000; // 45K chars per chunk
const CHUNK_OVERLAP = 3000; // 3K overlap to avoid cutting mid-section

function splitIntoChunks(content: string): string[] {
  if (content.length <= CHUNK_SIZE) return [content];

  const chunks: string[] = [];
  let start = 0;

  while (start < content.length) {
    let end = start + CHUNK_SIZE;

    // Try to break at a natural boundary (double newline, heading, etc.)
    if (end < content.length) {
      // Look backward from `end` for a good break point (within 5K chars)
      const searchWindow = content.slice(Math.max(start, end - 5000), end);
      
      // Prefer breaking at section boundaries
      const sectionBreaks = [
        searchWindow.lastIndexOf("\n\n## "),
        searchWindow.lastIndexOf("\n\n### "),
        searchWindow.lastIndexOf("\n\n---"),
        searchWindow.lastIndexOf("\n\nSlide "),
        searchWindow.lastIndexOf("\n\nPage "),
        searchWindow.lastIndexOf("\n\n"),
      ];

      for (const breakPos of sectionBreaks) {
        if (breakPos > 0) {
          end = (end - 5000 + breakPos) + (breakPos > 0 ? breakPos : 0);
          // Recalculate: offset is relative to searchWindow start
          end = Math.max(start, end - 5000) + breakPos;
          break;
        }
      }
    }

    end = Math.min(end, content.length);
    chunks.push(content.slice(start, end));

    // Next chunk starts with overlap
    start = end - CHUNK_OVERLAP;
    if (start >= content.length) break;
    // Prevent infinite loop
    if (end >= content.length) break;
  }

  return chunks;
}

interface ExtractionResult {
  analysis_notes: string;
  preferences: any[];
  context_items: any[];
  bundles: any[];
  advisor?: any;
  extraction_depth?: string;
}

function mergeExtractionResults(results: ExtractionResult[]): ExtractionResult {
  if (results.length === 1) return results[0];

  const merged: ExtractionResult = {
    analysis_notes: results.map((r, i) => `[Chunk ${i + 1}] ${r.analysis_notes}`).join("\n\n"),
    preferences: [],
    context_items: [],
    bundles: [],
  };

  // Deduplicate preferences by key+value
  const prefSet = new Set<string>();
  for (const r of results) {
    for (const p of (r.preferences || [])) {
      const key = `${p.preference_key}::${p.preference_value}`;
      if (!prefSet.has(key)) {
        prefSet.add(key);
        merged.preferences.push(p);
      }
    }
  }

  // Deduplicate standalone items by title
  const itemTitleSet = new Set<string>();
  for (const r of results) {
    for (const item of (r.context_items || [])) {
      const normTitle = item.title.toLowerCase().trim();
      if (!itemTitleSet.has(normTitle)) {
        itemTitleSet.add(normTitle);
        merged.context_items.push(item);
      }
    }
  }

  // Merge bundles: combine bundles with matching titles
  const bundleMap = new Map<string, any>();

  for (const r of results) {
    for (const bundle of (r.bundles || [])) {
      const normTitle = bundle.title.toLowerCase().trim();
      
      if (bundleMap.has(normTitle)) {
        // Merge items into existing bundle
        const existing = bundleMap.get(normTitle)!;
        const existingItemTitles = new Set(
          existing.items.map((it: any) => it.title.toLowerCase().trim())
        );
        
        for (const item of (bundle.items || [])) {
          if (!existingItemTitles.has(item.title.toLowerCase().trim())) {
            existing.items.push(item);
            existingItemTitles.add(item.title.toLowerCase().trim());
          }
        }

        // Upgrade completeness if later chunk had more
        const completenessRank: Record<string, number> = { skeleton: 0, partial: 1, full: 2 };
        if ((completenessRank[bundle.content_completeness] || 0) > (completenessRank[existing.content_completeness] || 0)) {
          existing.content_completeness = bundle.content_completeness;
        }

        // Merge coverage gaps
        const gapSet = new Set(existing.coverage_gaps || []);
        for (const gap of (bundle.coverage_gaps || [])) {
          gapSet.add(gap);
        }
        existing.coverage_gaps = [...gapSet];

        // Append description if different
        if (bundle.description && !existing.description.includes(bundle.description)) {
          existing.description += " " + bundle.description;
        }
      } else {
        bundleMap.set(normTitle, { ...bundle });
      }
    }
  }

  merged.bundles = [...bundleMap.values()];

  // Copy advisor and depth from first result
  if (results[0].advisor) merged.advisor = results[0].advisor;
  if (results[0].extraction_depth) merged.extraction_depth = results[0].extraction_depth;

  return merged;
}

// ── Single-chunk AI extraction call ───────────────────────────────────────────

async function extractChunk(
  systemPrompt: string,
  userPrompt: string,
  model: string,
  lovableApiKey: string,
  pdfBase64?: string,
): Promise<ExtractionResult | null> {
  const messages: any[] = [
    { role: "system", content: systemPrompt },
  ];

  if (pdfBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userPrompt },
        {
          type: "image_url",
          image_url: { url: `data:application/pdf;base64,${pdfBase64}` },
        },
      ],
    });
  } else {
    messages.push({ role: "user", content: userPrompt });
  }

  const requestBody = JSON.stringify({
    model,
    messages,
    tools: [TOOL_DEFINITION],
    tool_choice: { type: "function", function: { name: "extract_knowledge" } },
  });

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      console.log(`Retry attempt ${attempt}...`);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      },
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429 || aiResponse.status === 402) {
        throw new Error(aiResponse.status === 429
          ? "Rate limit exceeded. Please try again in a moment."
          : "AI credits exhausted. Please add credits.");
      }
      continue; // retry on other errors
    }

    const aiData = await aiResponse.json();
    const message = aiData.choices?.[0]?.message;
    const toolCall = message?.tool_calls?.[0];

    if (toolCall) {
      const extracted = JSON.parse(toolCall.function.arguments);
      if (!extracted.bundles) extracted.bundles = [];
      if (!extracted.analysis_notes) extracted.analysis_notes = "";
      return extracted;
    }

    // Try to recover from content fallback
    if (message?.content) {
      const jsonMatch = message.content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                        message.content.match(/(\{[\s\S]*\})/);
      if (jsonMatch?.[1]) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.bundles) {
            console.log("Recovered extraction from content fallback");
            if (!parsed.analysis_notes) parsed.analysis_notes = "";
            return parsed;
          }
        } catch {}
      }
    }

    console.error(`Attempt ${attempt + 1}: No tool call. finish_reason: ${aiData.choices?.[0]?.finish_reason}`);
  }

  return null; // all retries failed for this chunk
}

// ── Main handler ──────────────────────────────────────────────────────────────

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
    const documentStructure: any = body.document_structure || null;
    const extractionDepth: string = body.extraction_depth || "quick";
    let textContent = "";
    let meta: Record<string, string> = {};
    let pdfBase64: string | undefined;

    // ── Route by source type ──────────────────────────────────────────────
    if (sourceType === "document" || sourceType === "loom") {
      const { documentId } = body;
      if (!documentId) throw new Error("documentId required");

      const adminClient = createClient(supabaseUrl, supabaseKey);

      // Retry document lookup
      let doc: any = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, error: docError } = await adminClient
          .from("personal_documents")
          .select("*")
          .eq("id", documentId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) { doc = data; break; }
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
      }
      if (!doc) throw new Error(`Document not found (id=${documentId}, user=${user.id})`);

      const { data: fileData, error: dlError } = await adminClient.storage
        .from("personal-documents")
        .download(doc.file_path);
      if (dlError || !fileData) throw new Error("Failed to download file");

      const isPdf = doc.file_type === "application/pdf" || doc.file_name.toLowerCase().endsWith(".pdf");
      
      if (isPdf) {
        // PDFs: use multimodal (no chunking needed — Gemini handles full PDFs)
        const arrayBuffer = await fileData.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        pdfBase64 = btoa(binary);
        meta = {
          file_name: doc.file_name,
          category: doc.document_category,
          file_type: doc.file_type,
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
      textContent = body.content || "";
      meta = body.meta || {};
      if (!textContent) throw new Error("content required for " + sourceType);

    } else if (sourceType === "manual") {
      textContent = body.content || "";
      meta = body.meta || {};
      if (!textContent) throw new Error("content required");
    }

    // ── Build system prompt ──────────────────────────────────────────────
    let systemPrompt = await loadPrompt("extract-knowledge-system", SYSTEM_PROMPT);
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

    // ── Inject document structure skeleton if detected ─────────────────
    if (documentStructure && documentStructure.confidence !== "low") {
      const isMandatory = documentStructure.confidence === "high";
      const skeletonJson = JSON.stringify(documentStructure.skeleton, null, 2);
      
      systemPrompt += `\n\n## DOCUMENT STRUCTURE BLUEPRINT (${isMandatory ? "MANDATORY" : "SUGGESTED"})
A structural analysis pass has detected this document's organizational blueprint.
Structure type: **${documentStructure.structure_type}** | Confidence: **${documentStructure.confidence}** | Sections: ${documentStructure.total_sections_detected}

${isMandatory 
  ? `**THIS IS A MANDATORY BLUEPRINT.** The document has clear, explicit structure. You MUST use it:
- Create ONE BUNDLE for each skeleton entry where is_bundle_candidate=true
- Use the EXACT labels from the skeleton as bundle titles
- Create PLAYBOOKs matching the playbook_candidates listed for each section
- Do NOT invent additional bundles beyond what the skeleton defines (unless you find major sections it missed)
- Do NOT merge or rename skeleton sections — preserve the document's own organization
- Content density hints tell you what to expect: "rich" sections should yield many items, "sparse"/"empty" sections should be skeleton bundles`
  : `**THIS IS A SUGGESTED BLUEPRINT.** The document has some detectable structure. Use it as guidance:
- Prefer the skeleton's section labels as bundle titles where they align with the content
- Use playbook_candidates as hints for PLAYBOOK items, but apply the PLAYBOOK Test to each
- You may adjust, merge, or add bundles if the content justifies it
- Content density hints help you calibrate extraction depth per section`
}

### Detected Skeleton:
\`\`\`json
${skeletonJson}
\`\`\`

${documentStructure.notes ? `**Structural notes:** ${documentStructure.notes}` : ""}`;
    }

    if (extractionDepth === "deep") {
      systemPrompt += `\n\n## DEEP ANALYSIS MODE
You are in **deep analysis mode**. This means:
- Extract EVERY possible piece of knowledge, no matter how granular
- Create MORE ITEMS per bundle (deeper extraction within each phase-level bundle)
- Split complex items into their most atomic components
- Surface implicit knowledge that isn't explicitly stated but can be inferred — but mark ALL inferred content with is_suggestion=true
- Pay extra attention to relationships between items
- Generate comprehensive analysis_notes with recommendations
- For skeleton bundles: infer as much as possible about what SHOULD be documented based on the structural context, related sections, and domain knowledge — mark ALL such inferred content with is_suggestion=true
- Create detailed PLAYBOOK placeholders for skeleton bundles that describe not just the topic but specific aspects that should be covered — ALWAYS with is_suggestion=true
- IMPORTANT: Deep mode means MORE ITEMS PER BUNDLE, not MORE BUNDLES. Maintain phase-level consolidation.
- IMPORTANT: Deep mode may surface additional PLAYBOOKs (activatable actions) within bundles — this is expected. But each PLAYBOOK must still pass the PLAYBOOK Test and represent a distinct operator action.`;
    }

    const model = extractionDepth === "deep" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";

    // ── Chunked extraction ──────────────────────────────────────────────
    if (pdfBase64) {
      // PDF: single extraction (multimodal handles full document)
      const userPrompt = buildUserPrompt(sourceType, textContent, meta);
      const result = await extractChunk(systemPrompt, userPrompt, model, lovableApiKey, pdfBase64);
      if (!result) throw new Error("Extraction failed after retries");

      if (advisorPersona) result.advisor = advisorPersona;
      result.extraction_depth = extractionDepth;

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Text content: chunk if needed
    const chunks = splitIntoChunks(textContent);
    console.log(`Document length: ${textContent.length} chars → ${chunks.length} chunk(s)`);

    // If multiple chunks, use SSE streaming to report progress
    if (chunks.length > 1) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const chunkResults: ExtractionResult[] = [];
            const existingBundleTitles: string[] = [];

            // Send initial chunk info
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "chunk_progress", current: 0, total: chunks.length })}\n\n`));

            for (let i = 0; i < chunks.length; i++) {
              const chunkInfo = { chunkIndex: i, totalChunks: chunks.length, existingBundleTitles: [...existingBundleTitles] };
              const userPrompt = buildUserPrompt(sourceType, chunks[i], meta, chunkInfo);
              console.log(`Extracting chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);

              // Send progress event
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "chunk_progress", current: i + 1, total: chunks.length })}\n\n`));

              const result = await extractChunk(systemPrompt, userPrompt, model, lovableApiKey);
              if (!result) {
                console.error(`Chunk ${i + 1} failed — skipping`);
                continue;
              }

              chunkResults.push(result);
              for (const b of (result.bundles || [])) {
                if (!existingBundleTitles.includes(b.title)) {
                  existingBundleTitles.push(b.title);
                }
              }
            }

            if (chunkResults.length === 0) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", error: "Extraction failed — no chunks produced results" })}\n\n`));
              controller.close();
              return;
            }

            const merged = mergeExtractionResults(chunkResults);
            if (advisorPersona) merged.advisor = advisorPersona;
            merged.extraction_depth = extractionDepth;
            merged.analysis_notes = `[Chunked extraction: ${chunks.length} chunks processed, ${textContent.length} total chars]\n\n${merged.analysis_notes}`;
            merged.chunk_info = { total: chunks.length, processed: chunkResults.length };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "result", data: merged })}\n\n`));
            controller.close();
          } catch (err) {
            console.error("Streaming extraction error:", err);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", error: err instanceof Error ? err.message : "Unknown error" })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Single chunk — no streaming needed
    const chunkResults: ExtractionResult[] = [];
    const existingBundleTitles: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkInfo = chunks.length > 1
        ? { chunkIndex: i, totalChunks: chunks.length, existingBundleTitles: [...existingBundleTitles] }
        : undefined;

      const userPrompt = buildUserPrompt(sourceType, chunks[i], meta, chunkInfo);
      console.log(`Extracting chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);

      const result = await extractChunk(systemPrompt, userPrompt, model, lovableApiKey);
      if (!result) {
        console.error(`Chunk ${i + 1} failed — skipping`);
        continue;
      }

      chunkResults.push(result);
      for (const b of (result.bundles || [])) {
        if (!existingBundleTitles.includes(b.title)) {
          existingBundleTitles.push(b.title);
        }
      }
    }

    if (chunkResults.length === 0) {
      throw new Error("Extraction failed — no chunks produced results");
    }

    const merged = mergeExtractionResults(chunkResults);
    if (advisorPersona) merged.advisor = advisorPersona;
    merged.extraction_depth = extractionDepth;

    return new Response(JSON.stringify(merged), {
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

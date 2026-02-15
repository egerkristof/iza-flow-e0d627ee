import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { loadPrompt } from "../_shared/load-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * detect-structure — Pass 1 of two-pass extraction.
 * 
 * For PDFs, uses a chunked strategy: splits the document into page-range
 * chunks, analyzes each in parallel, then merges the skeleton results.
 * This ensures sections in the latter half of large documents (e.g.,
 * "Farming" / Account Management) are detected with the same depth
 * as early sections.
 */

const SYSTEM_PROMPT = `You are a **Document Structure Analyst**. Your ONLY job is to analyze a document's organizational structure and return a JSON skeleton. You do NOT extract content — you map architecture.

## YOUR TASK
Analyze the document and identify its structural blueprint:

1. **Detect structure type** — classify the document's organization:
   - "toc" — Has an explicit Table of Contents, index, or outline
   - "presentation" — Slide deck with section dividers, agenda slides, or overview slides
   - "hierarchical" — Clear header hierarchy (H1 > H2 > H3 or Part > Chapter > Section)
   - "phased" — Sequential phases/stages (Phase A, B, C or Stage 1, 2, 3)
   - "tabular" — Primarily organized through tables/matrices
   - "flat" — No clear hierarchical structure (prose, single-topic, conversational)

2. **Map the FULL skeleton** — return ALL levels of hierarchy as flat entries in the skeleton array:
   - Level 1 = top-level sections (bundle candidates)
   - Level 2 = sub-sections within a level-1 section (playbook/procedure candidates)
   - Level 3+ = sub-sub-sections, steps, detailed breakdowns
   - IMPORTANT: Do NOT stop at level 1. Include ALL sub-sections, steps, and sub-topics you can detect.
   - Each entry should have its exact label from the document and its hierarchy level.
   - Order entries in the same sequence as they appear in the document.
   - For each entry include:
     * Title (exact label from the document)
     * Hierarchy level (1, 2, 3, etc.)
     * Whether it's a bundle candidate (typically level 1 sections only)
     * Content density estimate: "rich" (lots of detail), "moderate", "sparse" (just a heading), "empty" (referenced but no content)
     * Child count (how many direct sub-entries it has)

3. **Classify layout type** for each entry — HOW was this section detected?
   - "heading" — Text-based header (H1, H2, #, bold heading)
   - "numbered" — Numbered section (1.1, A.2, Phase 1)
   - "visual_group" — Spatial/visual grouping (items arranged in a circle, quadrant, radial layout, grouped in a box)
   - "table" — Table or matrix structure
   - "diagram" — Flow diagram, process chart, decision tree
   - "slide_divider" — Presentation section divider slide
   - "implicit" — Inferred from content semantics, no explicit visual or textual marker

4. **Assess confidence** — how reliable is this structure?
   - "high" — Clear, explicit structure (ToC, numbered phases, slide sections). Use as MANDATORY blueprint.
   - "medium" — Implicit structure detectable (consistent headers, logical sections). Use as SUGGESTED blueprint.
   - "low" — Minimal structure. Fall back to heuristic extraction.

## RULES
- Do NOT extract content. Only identify STRUCTURE.
- Preserve EXACT labels/titles from the document.
- Include ALL hierarchy levels in the skeleton array — not just top-level sections.
- For presentations: agenda/overview slides define the skeleton. Section divider slides mark bundle boundaries.
- For ToC documents: ToC entries ARE the skeleton — include ALL levels from the ToC.
- For hierarchical: H1/Part = bundle (level 1), H2/Chapter = level 2, H3 = level 3, etc.
- If structure is ambiguous or flat, return confidence="low" with minimal skeleton.
- Be thorough but FAST — this is a pre-pass, not deep analysis.

Return results via the detect_structure tool.`;

const TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "detect_structure",
    description: "Return the detected document structure skeleton",
    parameters: {
      type: "object",
      properties: {
        structure_type: {
          type: "string",
          enum: ["toc", "presentation", "hierarchical", "phased", "tabular", "flat"],
          description: "The primary organizational pattern of the document",
        },
        confidence: {
          type: "string",
          enum: ["high", "medium", "low"],
          description: "How reliable is this structural detection? high = explicit structure found, use as mandatory blueprint. medium = implicit structure, use as suggestion. low = minimal structure, fall back to heuristics.",
        },
        total_sections_detected: {
          type: "integer",
          description: "Total number of major sections/phases/topics found",
        },
        skeleton: {
          type: "array",
          description: "The structural skeleton — ordered list of detected sections",
          items: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "Exact section label/title from the document",
              },
              level: {
                type: "integer",
                description: "Hierarchy level: 1 = top-level, 2 = sub-section, 3+ = sub-sub-section",
              },
              layout_type: {
                type: "string",
                enum: ["heading", "numbered", "visual_group", "table", "diagram", "slide_divider", "implicit"],
                description: "How this section was detected",
              },
              is_bundle_candidate: {
                type: "boolean",
                description: "Should this section become its own bundle?",
              },
              playbook_candidates: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    rationale: { type: "string" },
                  },
                  required: ["title", "rationale"],
                },
                description: "Sub-sections that represent distinct activatable actions (PLAYBOOK candidates)",
              },
              content_density: {
                type: "string",
                enum: ["rich", "moderate", "sparse", "empty"],
              },
              child_count: {
                type: "integer",
              },
              page_or_slide_range: {
                type: "string",
                description: "Approximate page/slide range. Optional.",
              },
            },
            required: ["label", "level", "layout_type", "is_bundle_candidate", "playbook_candidates", "content_density", "child_count"],
          },
        },
        notes: {
          type: "string",
          description: "Brief notes about the document architecture. 2-4 sentences max.",
        },
      },
      required: ["structure_type", "confidence", "total_sections_detected", "skeleton", "notes"],
      additionalProperties: false,
    },
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

/** Call the AI with a specific prompt and optional PDF, return parsed skeleton result */
async function callStructureAI(
  lovableApiKey: string,
  systemPrompt: string,
  userPrompt: string,
  pdfBase64?: string,
): Promise<any | null> {
  const messages: any[] = [{ role: "system", content: systemPrompt }];

  if (pdfBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${pdfBase64}` } },
      ],
    });
  } else {
    messages.push({ role: "user", content: userPrompt });
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
        model: "google/gemini-2.5-flash",
        messages,
        tools: [TOOL_DEFINITION],
        tool_choice: { type: "function", function: { name: "detect_structure" } },
      }),
    },
  );

  if (!aiResponse.ok) {
    const errText = await aiResponse.text();
    console.error("AI chunk error:", aiResponse.status, errText);
    return null;
  }

  const aiData = await aiResponse.json();
  const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) return null;

  return JSON.parse(toolCall.function.arguments);
}

/** Merge multiple skeleton results into one consolidated result */
function mergeSkeletons(results: any[]): any {
  const valid = results.filter(Boolean);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];

  // Use the first result as the base for metadata
  const base = valid[0];
  const seenLabels = new Set<string>();
  const mergedSkeleton: any[] = [];

  // Merge all skeleton entries, deduplicating by normalized label
  for (const result of valid) {
    for (const entry of (result.skeleton || [])) {
      const key = entry.label?.toLowerCase().trim();
      if (key && !seenLabels.has(key)) {
        seenLabels.add(key);
        mergedSkeleton.push(entry);
      } else if (key && seenLabels.has(key)) {
        // If duplicate but the new one has richer data, replace
        const existingIdx = mergedSkeleton.findIndex(
          (e) => e.label?.toLowerCase().trim() === key
        );
        if (existingIdx >= 0) {
          const existing = mergedSkeleton[existingIdx];
          const densityRank: Record<string, number> = { rich: 3, moderate: 2, sparse: 1, empty: 0 };
          const existingRank = densityRank[existing.content_density] ?? 0;
          const newRank = densityRank[entry.content_density] ?? 0;
          if (newRank > existingRank || entry.child_count > existing.child_count) {
            mergedSkeleton[existingIdx] = entry;
          }
        }
      }
    }
  }

  // Pick highest confidence across all chunks
  const confRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
  let bestConf = "low";
  for (const r of valid) {
    if ((confRank[r.confidence] ?? 0) > (confRank[bestConf] ?? 0)) {
      bestConf = r.confidence;
    }
  }

  return {
    structure_type: base.structure_type,
    confidence: bestConf,
    total_sections_detected: mergedSkeleton.length,
    skeleton: mergedSkeleton,
    notes: valid.map((r) => r.notes).filter(Boolean).join(" | "),
  };
}

/** Extract structural markers from full text (headings, numbered sections, etc.) */
function extractStructuralMarkers(fullText: string): string[] {
  const markers: string[] = [];
  const lines = fullText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (/^#{1,4}\s+\S/.test(line)) { markers.push(line); continue; }
    if (/^(?:\d+\.[\d.]*|[A-Z]\.)\s+\S/.test(line) && line.length < 200) { markers.push(line); continue; }
    if (/^(?:Phase|Stage|Part|Chapter|Section|Module|Unit|Appendix|Step)\s+[\dIVXA-Z]/i.test(line) && line.length < 200) { markers.push(line); continue; }
    if (/^[A-Z][A-Z\s\d&:,\-–—/()]{4,119}$/.test(line) && /[A-Z]{2}/.test(line) && !/[a-z]/.test(line)) { markers.push(line); continue; }
    if (line.length < 120 && line.length > 3 && /^[A-Z][a-zA-Z\s\d&:,\-–—/()]+$/.test(line) && !/[.!?;]$/.test(line)) {
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
      if (!nextLine || /^[-─═#*]/.test(nextLine)) { markers.push(line); continue; }
    }
    if (/^[=\-─]{3,}$/.test(line) && i > 0) {
      const prevLine = lines[i - 1].trim();
      if (prevLine && prevLine.length < 200 && !markers.includes(prevLine)) { markers.push(prevLine); }
    }
  }
  const seen = new Set<string>();
  return markers.filter(m => { if (seen.has(m)) return false; seen.add(m); return true; });
}

// ── Main handler ─────────────────────────────────────────────────────────

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

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    let textContent = "";
    let pdfBase64: string | undefined;

    // ── Get document content ──────────────────────────────────────────
    if (body.documentId) {
      const adminClient = createClient(supabaseUrl, supabaseKey);
      const { data: doc } = await adminClient
        .from("personal_documents")
        .select("*")
        .eq("id", body.documentId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!doc) throw new Error("Document not found");

      const { data: fileData, error: dlError } = await adminClient.storage
        .from("personal-documents")
        .download(doc.file_path);
      if (dlError || !fileData) throw new Error("Failed to download file");

      const isPdf = doc.file_type === "application/pdf" || doc.file_name.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        const arrayBuffer = await fileData.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        pdfBase64 = btoa(binary);
      } else {
        textContent = await fileData.text();
      }
    } else if (body.content) {
      textContent = body.content;
    } else {
      throw new Error("documentId or content required");
    }

    const activePrompt = await loadPrompt("detect-structure-system", SYSTEM_PROMPT);

    // ── PDF path: chunked analysis ────────────────────────────────────
    if (pdfBase64) {
      // Estimate page count from base64 size (~50KB per page for presentations)
      const fileSizeBytes = (pdfBase64.length * 3) / 4;
      const estimatedPages = Math.max(1, Math.round(fileSizeBytes / (50 * 1024)));
      // Cap at 3 chunks max to stay within edge function timeout (~60s)
      const MAX_CHUNKS = 3;
      const CHUNK_SIZE = Math.max(10, Math.ceil(estimatedPages / MAX_CHUNKS));

      console.log(`PDF analysis: estimated ${estimatedPages} pages, file size ${Math.round(fileSizeBytes / 1024)}KB`);

      if (estimatedPages <= 15) {
        // Small PDF — single pass
        const userPrompt = `Analyze the structure of this document and return its organizational skeleton.

[PDF document provided as inline image for analysis]

**FOCUS ON:**
- Table of contents, agenda slides, overview sections
- Section headers and their hierarchy
- Phase/stage labels and sequences
- Section dividers or transition markers
- How content is organized (by topic, by phase, by role, etc.)
- ALL pages of the document — ensure no sections are missed

Return the structural skeleton. Do NOT extract content — only map architecture.`;

        const result = await callStructureAI(lovableApiKey, activePrompt, userPrompt, pdfBase64);

        if (!result) {
          return new Response(JSON.stringify({
            structure_type: "flat", confidence: "low", total_sections_detected: 0,
            skeleton: [], notes: "Structure detection did not produce results.",
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        result.total_markers_detected = 0;
        result.markers_beyond_preview = 0;
        console.log(`Structure detected (single pass): type=${result.structure_type}, confidence=${result.confidence}, sections=${result.total_sections_detected}`);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Large PDF — chunked parallel analysis
      const chunks: { start: number; end: number }[] = [];
      for (let start = 1; start <= estimatedPages; start += CHUNK_SIZE) {
        chunks.push({ start, end: Math.min(start + CHUNK_SIZE - 1, estimatedPages) });
      }

      console.log(`Chunked PDF analysis: ${chunks.length} chunks for ~${estimatedPages} pages`);

      const chunkPromises = chunks.map((chunk, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === chunks.length - 1;
        const rangeLabel = `pages ${chunk.start}-${isLast ? "end" : chunk.end}`;

        const userPrompt = `Analyze the structure of this document. You MUST focus **exclusively on ${rangeLabel}** of this document. Ignore content outside this page range.

[PDF document provided as inline image for analysis]

**YOUR PAGE RANGE: ${rangeLabel}**

**FOCUS ON:**
- Section headers, phase labels, and hierarchy within ${rangeLabel}
- Visual groupings, diagrams, and spatial layouts on these pages
- Sub-sections, steps, checklists, and detailed breakdowns
- Section dividers or transition markers
${isFirst ? "- Any Table of Contents, agenda, or overview that maps the FULL document" : ""}
${isLast ? "- Appendices, summary sections, backup slides, and any final sections" : ""}

**IMPORTANT:** Be thorough for YOUR page range. Every section, sub-section, and visual group on ${rangeLabel} must appear in your skeleton. Do NOT skip sections because they seem minor.

Return the structural skeleton for ${rangeLabel}. Do NOT extract content — only map architecture.`;

        return callStructureAI(lovableApiKey, activePrompt, userPrompt, pdfBase64);
      });

      const chunkResults = await Promise.all(chunkPromises);
      const result = mergeSkeletons(chunkResults);

      if (!result) {
        return new Response(JSON.stringify({
          structure_type: "flat", confidence: "low", total_sections_detected: 0,
          skeleton: [], notes: "Chunked structure detection did not produce results.",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      result.total_markers_detected = 0;
      result.markers_beyond_preview = 0;
      result.chunks_used = chunks.length;
      console.log(`Structure detected (chunked, ${chunks.length} chunks): type=${result.structure_type}, confidence=${result.confidence}, sections=${result.total_sections_detected}`);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Text path (unchanged) ─────────────────────────────────────────
    const contentPreview = textContent.length > 60000
      ? textContent.slice(0, 60000) + "\n\n[... document continues for " + (textContent.length - 60000) + " more characters ...]"
      : textContent;

    const allMarkers = extractStructuralMarkers(textContent);
    const markersFromBeyondPreview = textContent.length > 60000
      ? extractStructuralMarkers(textContent.slice(60000))
      : [];

    let structuralIndexNote = "";
    if (markersFromBeyondPreview.length > 0) {
      const markerList = markersFromBeyondPreview.map((m, i) => `${i + 1}. ${m}`).join("\n");
      structuralIndexNote = "\n\n---\n**IMPORTANT — STRUCTURAL MARKERS FROM BEYOND THE PREVIEW:**\n" +
        `The content preview was truncated. These ${markersFromBeyondPreview.length} headings/sections appear in the REMAINDER of the document. You MUST include them in your skeleton:\n\n` +
        markerList + "\n";
    }

    let fullIndexNote = "";
    if (allMarkers.length > 0 && textContent.length > 30000) {
      const fullList = allMarkers.map((m, i) => `${i + 1}. ${m}`).join("\n");
      fullIndexNote = `\n\n---\n**COMPLETE STRUCTURAL INDEX (${allMarkers.length} markers across full document):**\n` + fullList + "\n";
    }

    const userPrompt = `Analyze the structure of this document and return its organizational skeleton.

${contentPreview}${structuralIndexNote}${fullIndexNote}

**FOCUS ON:**
- Table of contents, agenda slides, overview sections
- Section headers and their hierarchy
- Phase/stage labels and sequences
- Section dividers or transition markers
- How content is organized (by topic, by phase, by role, etc.)
- ALL sections listed in the structural index above — even those beyond the content preview

Return the structural skeleton. Do NOT extract content — only map architecture.`;

    const result = await callStructureAI(lovableApiKey, activePrompt, userPrompt);

    if (!result) {
      return new Response(JSON.stringify({
        structure_type: "flat", confidence: "low", total_sections_detected: 0,
        skeleton: [], notes: "Structure detection did not produce results. Falling back to heuristic extraction.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    result.total_markers_detected = allMarkers.length;
    result.markers_beyond_preview = markersFromBeyondPreview.length;
    console.log(`Structure detected: type=${result.structure_type}, confidence=${result.confidence}, sections=${result.total_sections_detected}, markers=${allMarkers.length}, beyond_preview=${markersFromBeyondPreview.length}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("detect-structure error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

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
 * Performs a lightweight structural analysis of a document to detect its
 * organizational blueprint BEFORE the heavy extraction pass.
 * 
 * Returns a skeleton that guides the extraction engine with explicit
 * bundle boundaries, playbook candidates, and hierarchy info.
 * 
 * If the document is well-structured (ToC, slides with section dividers,
 * clear headers), the skeleton is "high-confidence" and extraction will
 * use it as a MANDATORY blueprint.
 * 
 * If the document is unstructured prose, the skeleton is "low-confidence"
 * and extraction falls back to heuristic phase-based grouping.
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
                description: "Exact section label/title from the document (e.g., 'Phase B: Discovery & Qualification', 'Chapter 3: Risk Management')",
              },
              level: {
                type: "integer",
                description: "Hierarchy level: 1 = top-level section (bundle candidate), 2 = sub-section (playbook candidate), 3+ = sub-sub-section (item-level)",
              },
              layout_type: {
                type: "string",
                enum: ["heading", "numbered", "visual_group", "table", "diagram", "slide_divider", "implicit"],
                description: "How this section was detected: 'heading' = text header (H1/H2/#), 'numbered' = numbered section (1.1, A.2), 'visual_group' = spatial/visual grouping (circle, quadrant, radial layout), 'table' = table or matrix structure, 'diagram' = flow diagram or process chart, 'slide_divider' = presentation section divider slide, 'implicit' = inferred from content semantics rather than explicit formatting",
              },
              is_bundle_candidate: {
                type: "boolean",
                description: "Should this section become its own bundle? true for level-1 sections and significant level-2 sections that pass the deployability test.",
              },
              playbook_candidates: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Exact title of the sub-section that could become a PLAYBOOK",
                    },
                    rationale: {
                      type: "string",
                      description: "Brief reason why this is an activatable action (1 sentence)",
                    },
                  },
                  required: ["title", "rationale"],
                },
                description: "Sub-sections within this section that represent distinct activatable actions (PLAYBOOK candidates)",
              },
              content_density: {
                type: "string",
                enum: ["rich", "moderate", "sparse", "empty"],
                description: "Estimate of how much content is under this section",
              },
              child_count: {
                type: "integer",
                description: "Number of sub-sections or sub-items detected under this section",
              },
              page_or_slide_range: {
                type: "string",
                description: "Approximate page/slide range (e.g., 'slides 12-18', 'pages 15-22'). Optional.",
              },
            },
            required: ["label", "level", "layout_type", "is_bundle_candidate", "playbook_candidates", "content_density", "child_count"],
          },
        },
        notes: {
          type: "string",
          description: "Brief notes about the document architecture: gaps detected, asymmetries, special patterns. 2-4 sentences max.",
        },
      },
      required: ["structure_type", "confidence", "total_sections_detected", "skeleton", "notes"],
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

    // Verify auth
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    let textContent = "";
    let pdfBase64: string | undefined;

    // ── Get document content ────────────────────────────────────────────
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

    // ── Extract structural markers from the FULL document ──────────────
    // Scan entire text for headings, numbered sections, phase labels so
    // sections beyond the 30K preview are still visible to the AI.
    const extractStructuralMarkers = (fullText: string): string[] => {
      const markers: string[] = [];
      const lines = fullText.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Markdown headings
        if (/^#{1,4}\s+\S/.test(line)) { markers.push(line); continue; }

        // Numbered sections: "1.", "1.1", "A."
        if (/^(?:\d+\.[\d.]*|[A-Z]\.)\s+\S/.test(line) && line.length < 200) { markers.push(line); continue; }

        // Phase/Stage/Part/Chapter/Section labels
        if (/^(?:Phase|Stage|Part|Chapter|Section|Module|Unit|Appendix|Step)\s+[\dIVXA-Z]/i.test(line) && line.length < 200) { markers.push(line); continue; }

        // ALL-CAPS headings (≥5 chars, no lowercase)
        if (/^[A-Z][A-Z\s\d&:,\-–—/()]{4,119}$/.test(line) && /[A-Z]{2}/.test(line) && !/[a-z]/.test(line)) { markers.push(line); continue; }

        // Title-case lines that look like headings (short, no trailing punctuation)
        if (line.length < 120 && line.length > 3 && /^[A-Z][a-zA-Z\s\d&:,\-–—/()]+$/.test(line) && !/[.!?;]$/.test(line)) {
          const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
          if (!nextLine || /^[-─═#*]/.test(nextLine)) { markers.push(line); continue; }
        }

        // Underline-style headings (=== or ---)
        if (/^[=\-─]{3,}$/.test(line) && i > 0) {
          const prevLine = lines[i - 1].trim();
          if (prevLine && prevLine.length < 200 && !markers.includes(prevLine)) { markers.push(prevLine); }
        }
      }
      // Deduplicate preserving order
      const seen = new Set<string>();
      return markers.filter(m => { if (seen.has(m)) return false; seen.add(m); return true; });
    };

    // ── Build content for the AI ────────────────────────────────────────
    const contentPreview = textContent.length > 60000
      ? textContent.slice(0, 60000) + "\n\n[... document continues for " + (textContent.length - 60000) + " more characters ...]"
      : textContent;

    // Extract markers from the FULL document
    const allMarkers = textContent ? extractStructuralMarkers(textContent) : [];
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

    const mainContent = pdfBase64 ? "[PDF document provided as inline image for analysis]" : contentPreview;
    const userPrompt = `Analyze the structure of this document and return its organizational skeleton.

${mainContent}${structuralIndexNote}${fullIndexNote}

**FOCUS ON:**
- Table of contents, agenda slides, overview sections
- Section headers and their hierarchy
- Phase/stage labels and sequences
- Section dividers or transition markers
- How content is organized (by topic, by phase, by role, etc.)
- ALL sections listed in the structural index above — even those beyond the content preview

Return the structural skeleton. Do NOT extract content — only map architecture.`;

    // ── Call AI (use fast model — this is lightweight) ───────────────────
    const activePrompt = await loadPrompt("detect-structure-system", SYSTEM_PROMPT);

    const messages: any[] = [
      { role: "system", content: activePrompt },
    ];

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
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("Structure detection failed: " + aiResponse.status);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      console.error("No tool call returned for structure detection");
      // Return a low-confidence fallback
      return new Response(JSON.stringify({
        structure_type: "flat",
        confidence: "low",
        total_sections_detected: 0,
        skeleton: [],
        notes: "Structure detection did not produce results. Falling back to heuristic extraction.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    // Attach marker stats to the response
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

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

// ── Manifest pre-scan tool definition ────────────────────────────────
const MANIFEST_TOOL = {
  type: "function",
  function: {
    name: "extract_manifest",
    description: "Return the structural manifest — all top-level sections/phases/domains visible in overview slides, ToC, diagrams, or process maps",
    parameters: {
      type: "object",
      properties: {
        manifest_sections: {
          type: "array",
          description: "ALL top-level sections, phases, or strategic domains found in overview/ToC/diagram slides",
          items: {
            type: "object",
            properties: {
              label: { type: "string", description: "Section/phase/domain label exactly as shown" },
              source_type: {
                type: "string",
                enum: ["toc_entry", "agenda_item", "diagram_label", "process_phase", "overview_heading", "section_divider"],
                description: "How was this section identified?"
              },
              parent_group: { type: "string", description: "If this section belongs to a larger group/side (e.g., 'Hunting', 'Farming'), state the group name. Otherwise null." },
              approximate_page: { type: "string", description: "Approximate page/slide where this was found" },
            },
            required: ["label", "source_type"],
          },
        },
        structural_patterns: {
          type: "array",
          description: "High-level structural patterns detected (e.g., 'Document has two major domains: Hunting and Farming')",
          items: { type: "string" },
        },
        has_toc: { type: "boolean", description: "Does the document have an explicit Table of Contents?" },
        has_overview_diagram: { type: "boolean", description: "Does the document have overview/process diagrams showing the full structure?" },
        has_agenda: { type: "boolean", description: "Does the document have an agenda slide?" },
      },
      required: ["manifest_sections", "structural_patterns", "has_toc", "has_overview_diagram", "has_agenda"],
      additionalProperties: false,
    },
  },
};

const MANIFEST_SYSTEM_PROMPT = `You are a **Document Structure Scout**. Your ONLY job is to quickly scan a document and identify ALL structural overview information — Tables of Contents, agenda slides, overview diagrams, process maps, section dividers, and any visual or textual element that reveals the FULL structure of the document.

## YOUR TASK
Scan the ENTIRE document and find:

1. **Tables of Contents / Agendas** — Any page that lists all sections, topics, or phases
2. **Overview diagrams** — Process maps, circular diagrams, flowcharts, quadrant charts that show the document's major domains or phases (e.g., a "Sales Cycle" wheel showing all stages)
3. **Section dividers** — Slides or pages that mark the beginning of a new major section
4. **Structural labels from visuals** — Labels inside diagrams, process flows, or infographics that name strategic domains (these are often the MOST important structural markers)

## CRITICAL RULES
- Extract EVERY label you can see in overview diagrams — even small ones
- If a diagram shows two "sides" or "domains" (e.g., left side = "Farming", right side = "Hunting"), capture BOTH sides and ALL their sub-labels
- Include labels from circular process diagrams, radial layouts, quadrant charts
- Do NOT extract detailed content — only structural markers
- Be EXHAUSTIVE — missing a label here means an entire section gets skipped later

Return results via the extract_manifest tool.`;

/** Perform a quick pre-scan of the full PDF to extract structural manifest (ToC, overview diagrams, agendas) */
async function callManifestScan(
  lovableApiKey: string,
  pdfBase64: string,
): Promise<any | null> {
  const userPrompt = `Quickly scan this ENTIRE document. Find ALL structural overview information: Tables of Contents, agenda slides, overview/process diagrams, section dividers, and any visual element that maps out the document's full structure.

[PDF document provided for structural manifest extraction]

Pay special attention to:
- Circular diagrams, process wheels, or flow charts that show ALL phases/stages
- Diagrams that show contrasting domains (e.g., left side vs right side, with different labels for each)
- Agenda or overview slides that list ALL topics
- Section divider slides

Extract EVERY label visible in these structural overview elements.`;

  const messages: any[] = [
    { role: "system", content: MANIFEST_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${pdfBase64}` } },
      ],
    },
  ];

  try {
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
          tools: [MANIFEST_TOOL],
          tool_choice: { type: "function", function: { name: "extract_manifest" } },
        }),
      },
    );

    if (!aiResponse.ok) {
      console.error("Manifest scan failed:", aiResponse.status, await aiResponse.text());
      return null;
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return null;

    const manifest = JSON.parse(toolCall.function.arguments);
    console.log(`Manifest pre-scan: ${manifest.manifest_sections?.length || 0} sections found, patterns: ${(manifest.structural_patterns || []).join(" | ")}`);
    if (manifest.manifest_sections?.length > 0) {
      const labels = manifest.manifest_sections.map((s: any) => 
        `${s.label}${s.parent_group ? ` [${s.parent_group}]` : ""} (${s.source_type})`
      );
      console.log(`Manifest labels: ${labels.join(" | ")}`);
    }
    return manifest;
  } catch (err) {
    console.error("Manifest scan error (non-fatal):", err);
    return null;
  }
}

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

/** Normalize a label for deduplication: lowercase, collapse whitespace, strip punctuation */
function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[\s\-–—_:,;.!?()\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Check if two normalized labels are near-duplicates (one contains the other or high overlap) */
function areNearDuplicates(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  // Check word overlap: if 80%+ words match, consider duplicate
  const wordsA = new Set(a.split(" ").filter(w => w.length > 2));
  const wordsB = new Set(b.split(" ").filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return false;
  const overlap = [...wordsA].filter(w => wordsB.has(w)).length;
  const minSize = Math.min(wordsA.size, wordsB.size);
  return minSize > 0 && overlap / minSize >= 0.8;
}

/** Merge multiple skeleton results into one consolidated result, with aggressive pruning */
function mergeSkeletons(results: any[]): any {
  const valid = results.filter(Boolean);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];

  const base = valid[0];
  const mergedSkeleton: any[] = [];
  const seenNormalized: string[] = [];
  const deduped: string[] = []; // track what got deduped for diagnostics

  // Merge all skeleton entries with near-duplicate detection
  for (const result of valid) {
    for (const entry of (result.skeleton || [])) {
      const norm = normalizeLabel(entry.label || "");
      if (!norm) continue;

      const existingIdx = seenNormalized.findIndex(s => areNearDuplicates(s, norm));

      if (existingIdx < 0) {
        seenNormalized.push(norm);
        mergedSkeleton.push(entry);
      } else {
        deduped.push(`"${entry.label}" (L${entry.level || 1}) ≈ "${mergedSkeleton[existingIdx].label}"`);
        // Keep the richer version
        const existing = mergedSkeleton[existingIdx];
        const densityRank: Record<string, number> = { rich: 3, moderate: 2, sparse: 1, empty: 0 };
        const existingRank = densityRank[existing.content_density] ?? 0;
        const newRank = densityRank[entry.content_density] ?? 0;
        if (newRank > existingRank || entry.child_count > (existing.child_count || 0)) {
          mergedSkeleton[existingIdx] = entry;
          seenNormalized[existingIdx] = norm;
        }
      }
    }
  }

  if (deduped.length > 0) {
    console.log(`Dedup decisions (${deduped.length}): ${deduped.join(" | ")}`);
  }

  // Log all level-1 and level-2 labels for diagnostics
  const topLabels = mergedSkeleton
    .filter(e => (e.level || 1) <= 2)
    .map(e => `[L${e.level || 1}] ${e.label}`);
  console.log(`Level 1-2 labels after merge (${topLabels.length}): ${topLabels.join(" | ")}`);

  // Prune: drop sparse/empty entries at level 4+ to keep skeleton manageable
  const pruned = mergedSkeleton.filter(entry => {
    if ((entry.level || 1) >= 4 && (entry.content_density === "sparse" || entry.content_density === "empty")) {
      return false;
    }
    return true;
  });

  // Hard cap — but NEVER drop level 1-2 entries
  const HARD_CAP = 150;
  let final = pruned;
  if (final.length > HARD_CAP) {
    const high = final.filter(e => (e.level || 1) <= 2);
    const mid = final.filter(e => (e.level || 1) === 3);
    const low = final.filter(e => (e.level || 1) >= 4);
    const densitySort = (a: any, b: any) => {
      const rank: Record<string, number> = { rich: 3, moderate: 2, sparse: 1, empty: 0 };
      return (rank[b.content_density] ?? 0) - (rank[a.content_density] ?? 0);
    };
    mid.sort(densitySort);
    low.sort(densitySort);
    // Always keep ALL level 1-2, then fill remaining with level 3+
    const remaining = HARD_CAP - high.length;
    const midSlice = mid.slice(0, Math.max(0, remaining));
    const lowRemaining = HARD_CAP - high.length - midSlice.length;
    const lowSlice = low.slice(0, Math.max(0, lowRemaining));
    final = [...high, ...midSlice, ...lowSlice];
    const dropped = pruned.length - final.length;
    if (dropped > 0) {
      console.log(`Hard cap: dropped ${dropped} level-3+ entries (kept all ${high.length} level-1/2 entries)`);
    }
  }

  // Pick highest confidence
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
    total_sections_detected: final.length,
    skeleton: final,
    notes: valid.map((r) => r.notes).filter(Boolean).join(" | "),
    _merge_stats: {
      raw_entries: valid.reduce((sum, r) => sum + (r.skeleton?.length || 0), 0),
      after_dedup: mergedSkeleton.length,
      after_prune: pruned.length,
      after_cap: final.length,
    },
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
      const MAX_CHUNKS = 3;
      const CHUNK_SIZE = Math.max(10, Math.ceil(estimatedPages / MAX_CHUNKS));

      console.log(`PDF analysis: estimated ${estimatedPages} pages, file size ${Math.round(fileSizeBytes / 1024)}KB`);

      // ── Phase 1: Manifest pre-scan ──────────────────────────────────
      // Quick scan of the FULL PDF to extract structural overview info
      // (ToC entries, overview diagrams, agenda items, process maps)
      const manifest = await callManifestScan(lovableApiKey, pdfBase64);

      // Build manifest hint text to inject into chunk prompts
      let manifestHint = "";
      if (manifest && manifest.manifest_sections?.length > 0) {
        const sectionList = manifest.manifest_sections
          .map((s: any, i: number) => {
            let entry = `${i + 1}. "${s.label}" (detected from: ${s.source_type})`;
            if (s.parent_group) entry += ` [part of: ${s.parent_group}]`;
            return entry;
          })
          .join("\n");
        const patterns = (manifest.structural_patterns || []).join("; ");
        manifestHint = `\n\n---\n**STRUCTURAL MANIFEST (from document overview/ToC/diagrams):**\nThe document's own overview elements reveal these sections and domains:\n${sectionList}\n\nStructural patterns: ${patterns || "none detected"}\n\n**YOU MUST look for content matching ALL of these sections in your page range.** If you find pages covering any of these sections, include them in your skeleton — even if they use visual layouts rather than text headings. Missing a manifest section means losing an entire knowledge domain.\n---\n`;
      }

      if (estimatedPages <= 15) {
        // Small PDF — single pass (still benefits from manifest context)
        const userPrompt = `Analyze the structure of this document and return its organizational skeleton.

[PDF document provided as inline image for analysis]
${manifestHint}
**FOCUS ON:**
- Table of contents, agenda slides, overview sections
- Section headers and their hierarchy
- Phase/stage labels and sequences
- Section dividers or transition markers
- How content is organized (by topic, by phase, by role, etc.)
- ALL pages of the document — ensure no sections are missed
- **VISUAL ELEMENTS:** Diagrams, process flows, circular layouts — these often represent major sections

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
        if (manifest) result._manifest = manifest;
        console.log(`Structure detected (single pass): type=${result.structure_type}, confidence=${result.confidence}, sections=${result.total_sections_detected}`);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ── Phase 2: Chunked parallel analysis with manifest context ────
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
${manifestHint}
**YOUR PAGE RANGE: ${rangeLabel}**

**FOCUS ON:**
- Section headers, phase labels, and hierarchy within ${rangeLabel}
- **VISUAL ELEMENTS:** Diagrams, process flows, circular layouts, quadrant charts, radial groupings, infographics — these often represent major strategic sections that have NO text heading but ARE top-level sections
- Sub-sections, steps, checklists, and detailed breakdowns
- Section dividers or transition markers
- **Content that introduces a fundamentally different ROLE or STRATEGY** — these are always separate level-1 sections even if visually subtle
${isFirst ? "- Any Table of Contents, agenda, or overview that maps the FULL document" : ""}
${isLast ? "- Appendices, summary sections, backup slides, and any final sections" : ""}

**IMPORTANT:** 
- Be thorough for YOUR page range. Every section, sub-section, and visual group on ${rangeLabel} must appear in your skeleton. 
- Do NOT skip sections because they seem minor or because they use visual layout instead of text headings.
- Sections communicated through **diagrams, graphics, or spatial layouts** are EQUALLY important as text-based headings. Mark them with layout_type="visual_group" or "diagram".
- Cross-reference against the STRUCTURAL MANIFEST above — if any manifest section falls within your page range, it MUST appear in your skeleton.

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
      if (manifest) result._manifest = manifest;
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

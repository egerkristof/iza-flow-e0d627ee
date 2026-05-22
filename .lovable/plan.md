# The Brief — Page Spec

A single-page guided experience for the proto-architects hiding inside middle management. They already think holistically about what comes next in their patch. The Brief gives them a frame to externalise that thinking into a one-screen document their boss will read.

## Route

- **Path:** `/the-brief`
- **Access:** Public, no signup until the final share/save step
- **Audience:** Self-selecting. The page does not explain itself in HR language. People who recognise themselves will start; people who don't, won't.

## Page Structure (single scroll, four movements)

### 1. Intro (above the fold)

- **Headline:** *"A working brief on what comes next, for the patch you actually run."*
- **Sub:** One sentence naming the reader without flattering them. Example: *"For the people in the org who already think in foundations, end to end, and need a frame to put it down."*
- **Primary CTA:** "Start the Brief" (scrolls into prompt 1)
- **No nav chrome, no testimonials, no logos.** Quiet page.

### 2. The Four Prompts (the frame)

Sequential, one prompt visible at a time, soft scroll between them. Each prompt is a short question plus a textarea. No character limits shown. Optional helper text below each input as a single example line in muted tone.

1. **Strategy** — *"What is the organisation actually trying to become over the next 18 months?"*
2. **Market reality** — *"What is moving in your market that your function will have to absorb?"*
3. **Team reality** — *"What does your team actually do day to day, and where does the work currently break?"*
4. **AI reality** — *"What AI is already in and around your patch, and what is it doing or failing to do?"*

Progress indicator: small "1 of 4" in a corner. No gamification.

### 3. The Brief (rendered output, one screen)

Generated from the four answers. Rendered as a real document, not a dashboard.

Sections, in order:
- **Title line:** auto-generated from inputs. Example: *"A brief on [Function] in the next 18 months."*
- **The shape of the patch** — two or three sentences synthesising strategy + team reality.
- **What is coming for it** — synthesis of market + AI reality.
- **What an AI-shaped version of this function looks like** — three short paragraphs. Concrete, specific to the four inputs. This is the centre of gravity.
- **What it would take to make this real** — three bullets. Each bullet names a foundation that has to exist: defined context, captured standards, a system that holds them.

Style: serif body, generous line height, looks like a memo, not a SaaS screen. Printable. Shareable as a link.

### 4. The Handoff (bottom of the brief)

A single quiet block under the brief, not a hard sell.

- **Line:** *"The brief points at a system underneath it. That system is what LIZA is."*
- **Secondary line:** one sentence on why a context layer is the thing the brief is implicitly asking for.
- **CTA:** "See LIZA" (link to existing positioning page) and "Save and share this brief" (gated: email required to keep the brief at a permanent URL).

## Generation

- Use Lovable AI Gateway. Default model: `google/gemini-2.5-pro` for synthesis quality on long-form input.
- Single prompt template assembles the four inputs into the five brief sections.
- Output streamed into the rendered brief section as it generates, no spinner theatre.

## Persistence

- Briefs are only stored when the user gates with email at the share step.
- Stored row: `briefs` table with `id`, `email`, `inputs jsonb`, `output jsonb`, `created_at`.
- Public read by `id` for the shareable URL. RLS: insert open, select by `id` open, update/delete locked.

## Out of Scope (for v1)

- No editing the rendered brief inline. Regenerate or accept.
- No multi-user / team version.
- No PDF export in v1. Shareable URL is the artefact.
- No A/B of prompts. One frame, ship it.

## Naming and Voice

- Product name in UI: **The Brief**.
- No em-dashes or en-dashes anywhere in copy.
- Voice: statement-oriented, quiet, assumes the reader is already thinking.

## Technical Notes

- New page component at `src/pages/TheBrief.tsx`, registered in the router.
- Generation via a new edge function `generate-brief` calling the AI Gateway.
- Save/share via a second edge function `save-brief` writing to the `briefs` table.
- Light theme, white background per the project's presentation standard. Serif for the rendered brief, sans for the prompts and chrome.
- Framer Motion pinned at `^10.18.0` for any prompt transitions.

## Success Signal

A user finishes the four prompts, reads the rendered brief, and either saves it with their email or sends the link to someone in their org. Save rate and share rate are the only two metrics that matter for v1.



# Extraction Engine — Public Mini-App

## Overview
Build a public-facing "Extraction Engine" at `/extract` that lets visitors experience LIZA's **full-quality** knowledge extraction. Two modes: try with curated sample content (no login) or paste/upload your own content (email required). A lightweight CRM table tracks all trial leads. Admin access uses the existing auth system with your user manually added via Lovable Cloud.

---

## 1. Database: `extraction_trials` CRM Table

Create a new table to track every public extraction attempt:

- `id` (uuid, PK)
- `email` (text, nullable — null for sample-mode trials)
- `name` (text, nullable)
- `company` (text, nullable)
- `source_type` (text: 'sample' | 'paste' | 'pdf')
- `content_preview` (text — first 200 chars)
- `result_summary` (jsonb — bundles count, items count, category breakdown)
- `created_at` (timestamptz)

RLS policies:
- **Anon INSERT**: anyone can create a trial record (public feature)
- **Authenticated SELECT**: only logged-in users (you) can view trials

---

## 2. New Edge Function: `public-extract`

A new backend function that wraps the **full extraction logic** (same SYSTEM_PROMPT, same tool definition, same AI model) but without requiring authentication.

Key differences from `extract-knowledge`:
- `verify_jwt = false` in config.toml — no auth required
- Accepts raw text content OR base64 PDF directly in the request body (no document storage lookup)
- **PDF support**: client sends the file as base64; function passes it to Gemini multimodal just like the existing PDF path
- **Size limits**: 20,000 characters for text, 5MB for PDF uploads (prevents abuse)
- **Rate limit**: max 3 extractions per email per 24h (checked via DB query against `extraction_trials`)
- Uses `google/gemini-2.5-flash` for speed (same as "guided" depth in the main app)
- Logs every attempt to `extraction_trials` table
- Full quality — same SYSTEM_PROMPT, same TOOL_DEFINITION, same structural analysis

---

## 3. New Page: `/extract` (ExtractionEngine.tsx)

A marketing-quality page wrapped in `MarketingLayout` with three states:

### State 1: Choose Your Path
Two cards side by side:
- **"Try with Sample Content"** — no email needed, uses a pre-loaded ~1,500 word "Enterprise Client Onboarding Methodology" embedded in the component
- **"Upload Your Own"** — shows email form, then a text area (paste) or PDF upload (drag-and-drop, max 5MB)

### State 2: Processing
Animated extraction progress with phase indicators (Analyzing structure... Extracting knowledge... Organizing bundles...). Matches the marketing aesthetic with gradient accents.

### State 3: Results
A read-only, high-fidelity visualization:
- **Summary stats**: X bundles, Y items, category distribution bar
- **Bundle cards**: expandable, showing items grouped by category with color-coded badges (reusing `CATEGORY_COLORS` and `PROTOCOL_ROLE_META` from the existing schema)
- **Analysis notes** from the AI
- **Bottom CTA**: "Want to deploy these protocols?" with Book a Discovery Call button
- **"Try again"** button to restart

### PDF Upload Handling
- Client-side: accept `.pdf` files up to 5MB via drag-and-drop or file picker
- Convert to base64 in-browser, send to `public-extract` edge function
- The edge function passes the PDF to Gemini multimodal (same path as existing extraction)

---

## 4. Results Display Component (ExtractionResultsView.tsx)

A new component in `src/components/marketing/` — simplified, read-only version of the ImportCopilotDialog's bundle display:
- Bundle cards with item counts, readiness badges, content completeness indicators
- Expandable items within each bundle, color-coded by category
- Protocol role labels (Protocol Driver, Execution Step, Compliance Gate, Context)
- Lightbox-style detail view for individual items
- Mobile-responsive
- No import/save/edit functionality (that is the full platform)

---

## 5. Admin CRM View

Add a new route `/admin/trials` (behind existing auth, architect role only):
- Simple table showing: email, name, company, source type, result summary, timestamp
- Sortable by date
- Accessible from the existing admin sidebar navigation
- No public signup — your user is already created in the system. You manage additional users via Lovable Cloud backend directly.

---

## 6. Navigation & CTA Updates

- **Homepage Hero CTA**: "Try the Extraction Engine" links to `/extract` (already partially done)
- **Marketing footer**: add small "Team Login" text link pointing to `/auth`
- **App.tsx**: add `/extract` public route and `/admin/trials` protected route

---

## 7. Sample Content

Embed a curated ~1,500 word sample document in the codebase:

**"Enterprise Client Onboarding Methodology"** — designed to showcase extraction quality:
- 4 phases (Discovery, Scoping, Onboarding, Handoff)
- Clear PLAYBOOKs, PROCEDUREs with action verbs, DIRECTIVEs with "must/never" language
- KNOWLEDGE items with specific data points
- This will produce an impressive ~30-50 item extraction across 4-5 bundles

---

## Implementation Sequence

1. Create `extraction_trials` table with RLS policies (migration)
2. Create `public-extract` edge function (reuses core extraction logic)
3. Build `ExtractionResultsView.tsx` component
4. Build `ExtractionEngine.tsx` page with sample content
5. Add admin trials view
6. Update routing (App.tsx), footer (MarketingLayout.tsx), hero CTA
7. Test end-to-end with sample content and a test PDF

---

## Technical Details

### File Changes

| File | Action |
|------|--------|
| `supabase/functions/public-extract/index.ts` | **New** — public extraction endpoint |
| `supabase/config.toml` | Add `verify_jwt = false` for `public-extract` |
| `src/pages/marketing/ExtractionEngine.tsx` | **New** — main page |
| `src/components/marketing/ExtractionResultsView.tsx` | **New** — results display |
| `src/data/sampleContent.ts` | **New** — embedded sample document |
| `src/pages/AdminTrials.tsx` | **New** — CRM admin view |
| `src/App.tsx` | Add routes |
| `src/components/marketing/MarketingLayout.tsx` | Add footer login link |
| `src/components/AppSidebar.tsx` | Add trials link for architects |
| Database migration | Create `extraction_trials` table |

### Security
- Public extract function has no JWT validation but enforces size limits and rate limits
- CRM data only visible to authenticated users
- Admin trials view restricted to architect role
- PDF files are never stored — processed in-memory and discarded


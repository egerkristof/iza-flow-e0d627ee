# LIZA GTM Rebuild — Build Plan

**Status:** Approved for build  
**Date:** 2026-03-03  
**Core narrative:** "Your team's AI isn't a team."

---

## Phase 1 — Homepage Repositioning (Priority: NOW)

### 1.1 Hero Section
- **Headline:** "Your team's AI isn't a team."
- **Sub:** Tool-agnostic — acknowledge ChatGPT, Claude, Gemini, Copilot. Name the fragmentation problem.
- **Primary CTA:** "Join the Private Beta" → `/beta`
- **Secondary CTA:** "See where your team sits ↓" → scroll to maturity section

### 1.2 AI Fragmentation Problem Section
- Visual: 5 people × 5 AI tools = 25 knowledge silos
- Before/After: Individual AI brilliance → collective intelligence
- Non-adversarial tone — celebrate the tools, name the gap

### 1.3 SECI Gap Visualization (Compact)
- 4-quadrant showing what tools do (Externalisation partial) vs what's missing (Socialisation, Combination, Internalisation)
- Keep it visual, not academic — no jargon on the page itself

### 1.4 Maturity Ladder (Revised Language)
- L1: "Everyone uses their own AI tool"
- L2: "Teams share prompts and templates"
- L3: "AI is embedded but knowledge is siloed per person"
- L4: "Knowledge is shared, governed, and composable" ← LIZA takes you here
- L5: "AI executes your methodology — not just your prompts"

### 1.5 Social Proof / Use Cases
- Reframe existing use cases around Level 1-2 pain
- Keep 7-step flywheel but lead with "AI fragmentation" language

### 1.6 Footer CTA
- "Join the Private Beta" — reinforcement

---

## Phase 2 — Private Beta Signup (`/beta`)

### 2.1 Signup Page
- Fields: Name, Email, Company, Team size (dropdown: 2-5, 5-15, 15-30, 30+)
- Multi-select: "Which AI tools does your team use?" (ChatGPT, Claude, Gemini, Copilot, Perplexity, Other)
- Optional: "What's your biggest AI frustration?" (free text)
- Store in `beta_signups` table (extend existing or new)

### 2.2 Post-Signup
- Confirmation page with expectation setting: "1 month free trial, then EUR 2,000/mo"
- Link to Notion-style onboarding guide (or in-app guided flow)
- Email notification via existing `notify-signup` edge function

### 2.3 Onboarding Simplification
- Remove taxonomy tree from first-run experience
- Replace with guided flow: "Create workspace, invite teammate, try a shared chat"
- Pre-loaded sample workspace with example content

---

## Phase 3 — Lead Gen Experience

### Option A (Recommended, smallest build): AI Fragmentation Calculator
- Single page component on homepage or `/assess`
- Input: team size + number of AI tools used
- Output: "You have X knowledge silos. Estimated consistency cost: EUR Y/year"
- Gate: "Get your full report" → email capture
- Ties to maturity model (shows which level they are at)

### Option B (Medium): Click-Through Demo
- 3 interactive screens showing: Solo AI → Shared workspace → Knowledge compound
- Screenshots or guided walkthrough, no live product needed
- CTA at end → beta signup

### Option C (Keep existing, reframe): Extraction Engine
- Simplify to 1-path flow (upload OR sample, not both)
- Simple results shown immediately
- Detailed results gated behind email
- Reframe: "See how LIZA converts one person's AI knowledge into team infrastructure"

---

## Phase 4 — Content & Funnel Pages

### 4.1 Use Cases Page
- Reframe intros around "AI fragmentation" pain per vertical
- Keep the 7-step flywheel structure
- Add "Which AI tools they use today" context per use case

### 4.2 Extraction Engine Page
- Simplify UI to single-path
- Position as "advanced" / thought-leadership, not primary CTA
- Move down in navigation hierarchy

### 4.3 Sprint Page
- Stays as-is (already conversion-optimized)
- Update copy to reference "AI operating model" instead of "knowledge OS"

### 4.4 Manifesto Page
- Stays as-is (thought leadership asset)
- Consider adding SECI/Cynefin visual to strengthen academic credibility

---

## Phase 5 — Navigation & Information Architecture

### 5.1 Top Nav (Revised)
- LIZA OS (Home)
- Use Cases
- Manifesto
- **Join Beta** (CTA button, highlighted)

### 5.2 Marketing Layout Footer
- Remove Pricing link (already done)
- Add Beta signup link
- Keep Sprint, Extraction Engine as secondary links

---

## What Stays Untouched
- All app internals (workbooks, context management, oversight)
- All edge functions and backend
- Database schema (except possible beta_signups extension)
- Decks (pitch, investor, sales)

---

## Technical Notes
- Homepage changes: modify `src/pages/marketing/Home.tsx`
- Beta page: new `src/pages/marketing/Beta.tsx` + route in `App.tsx`
- Calculator: new component in `src/components/marketing/`
- Maturity data: already exists in `EnterpriseDeck.tsx`, extract to shared data file
- Beta signups: extend existing `beta_signups` table with `ai_tools` and `team_size` columns

---

## Success Metrics
- Beta signup conversion rate from homepage
- Number of qualified signups (team size 5-30, 2+ AI tools)
- Time to first workspace creation after signup
- Upgrade rate from free month to paid (EUR 2,000/mo)

---

## Previous Plan: Use Cases Page (Reference)

### The 7 Use Cases
1. **The Onboarding Accelerator** — Onboard anyone in weeks, not months.
2. **Sales Playbooks** — Your best seller's instincts, running on every deal.
3. **Account Management Playbooks** — Protect revenue before the data tells you it's at risk.
4. **Marketing Playbooks** — Stop guessing which message lands. Encode what works.
5. **Professional Services Delivery Playbooks** — Deliver every engagement like your best consultant ran it.
6. **The Meeting Intelligence Engine** — Every meeting builds your organisation's memory.
7. **The Smart Brief** — Don't delegate tasks. Generate briefs.

### Colour Assignments (HSL)
1. Onboarding: `200 90% 52%`
2. Sales: `38 92% 50%`
3. Account Management: `155 72% 46%`
4. Marketing: `330 70% 55%`
5. Professional Services: `270 60% 65%`
6. Meeting Intelligence: `180 65% 45%`
7. Smart Brief: `15 80% 55%`

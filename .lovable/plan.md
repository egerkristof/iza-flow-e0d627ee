

# Plan: AI Execution Diagnostic Tool

## What We're Building
A standalone marketing page at `/diagnostic` — an interactive, no-signup-required questionnaire (10-12 questions, ~90 seconds) that produces an **AI Execution Score** with breakdowns across 5 dimensions. Results page includes personalized insights and a CTA to book a discovery call.

## Architecture

```text
/diagnostic
  ┌─────────────────────────────┐
  │  Intro screen (hook + CTA)  │
  ├─────────────────────────────┤
  │  Question stepper (10-12 Q) │  ← one question at a time, progress bar
  ├─────────────────────────────┤
  │  Optional: name + email     │  ← gate before results (light capture)
  ├─────────────────────────────┤
  │  Results dashboard          │  ← score + 5 dimension breakdown
  │  • Radar/bar chart          │
  │  • Personalized insights    │
  │  • "Book a call" CTA        │
  └─────────────────────────────┘
```

## Five Scoring Dimensions
1. **Playbook Enforcement** — Are standards defined and used in AI sessions?
2. **Consistency** — Do team members get similar outputs for the same task?
3. **Knowledge Compounding** — Do learnings feed back into future work?
4. **Team Coordination** — Is AI usage shared or siloed?
5. **Learning Velocity** — How fast does the team improve its approach?

## Questions (10-12, multiple choice)
Each question maps to one dimension. Answers scored 1-4. Examples:
- "Where do your team's best prompts/playbooks live?" (Personal notes / Shared doc nobody reads / Enforced in tools / Continuously updated) → Playbook Enforcement
- "When someone finds a better way to do something with AI, what happens?" (Nothing / They share it once / It gets documented / It updates the team's default process) → Knowledge Compounding
- "If your best AI user is out sick, what happens to output quality?" (Drops significantly / Drops somewhat / No change / Others already use their methods) → Consistency

## Scoring Logic
- Pure client-side calculation — no edge function needed for scoring
- Each answer maps to 1-4 points per dimension
- Overall score = weighted average normalized to 0-100
- Dimension scores also 0-100

## Archetype Labels (based on overall score)
- **0-30**: "AI Soloists" — *Your team is fast individually but dumb collectively.*
- **31-55**: "Scattered Effort" — *AI is used, but knowledge resets every week.*
- **56-75**: "Emerging System" — *You have pieces, but no compounding loop.*
- **76-100**: "AI Team" — *Your team's best thinking is everyone's default.*

## Lead Capture
- After questions, before results: optional name + email field
- Store in existing `beta_signups` table with `role_description` = "diagnostic" + score summary
- No signup required to see results (reduce friction), but email unlocks "Get detailed PDF report" or similar nudge

## Database
- New table `diagnostic_results` to store: email (nullable), answers JSON, scores JSON, archetype, created_at
- No RLS needed — public inserts, no reads from client

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/marketing/Diagnostic.tsx` | **Create** — main page with stepper, scoring, results |
| `src/components/marketing/diagnostic/DiagnosticQuestion.tsx` | **Create** — single question card component |
| `src/components/marketing/diagnostic/DiagnosticResults.tsx` | **Create** — results dashboard with score, radar chart, insights, CTA |
| `src/lib/diagnostic-scoring.ts` | **Create** — questions data, scoring logic, archetype mapping |
| `src/App.tsx` | **Modify** — add `/diagnostic` route |
| `supabase/migrations/` | **Create** — `diagnostic_results` table |

## Visual Style
- Matches existing marketing pages (MarketingLayout, same card/border styling)
- One question per screen with smooth transitions
- Progress bar at top
- Results use recharts radar chart for the 5 dimensions
- Same CTA styling as hero (gradient brand button → CAL_URL)

## No Edge Function Needed
Scoring is deterministic math — all client-side. We only need the database for lead capture.


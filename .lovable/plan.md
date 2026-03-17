

# Plan: Merge Maturity Ladder + Problem Section, Move After Hero

## Core Insight
The user wants the maturity ladder to work as a standalone scroll-hook right after the hero, but the current ladder is too AI-centric. The real demand (standardizing/scaling know-how) predates AI. The problem section is also too long. Solution: **merge the ladder and problem section into one compact section** that tells the full story.

## Architecture Change (Home.tsx)
```
Hero
→ NEW merged section (MaturityLadder with problem context baked in)
→ LizaLoopSection
→ TransformationSection
→ BetaCTASection
```
Remove `AIFragmentationSection` as a separate component — fold its best elements (the "Sound familiar?" scenarios and the "What's missing" callout) into the new MaturityLadder.

## Maturity Ladder Rewrite

**New level descriptions — behavioral, pre-AI problems first, AI nuance second:**

| Level | Label | Description |
|-------|-------|-------------|
| L1 | "It lives in their heads" | Your best people just *know*. When they're unavailable, quality drops. There's nothing written down that actually helps. |
| L2 | "We wrote it down once" | There are SOPs, playbooks, maybe a wiki. They were accurate when someone wrote them. Nobody updates them. Nobody reads them. |
| L3 | "Everyone has their own AI now" | Individuals are fast — but everyone prompts differently, uses different shortcuts, gets different results. The team is more fragmented than before. |
| L4 | "One living playbook for the whole team" | The team's accumulated judgment runs in every session. New hires perform like veterans. Always current. *(LIZA)* |
| L5 | "The system gets smarter every week" | Every engagement improves the playbook. Methodology leads see what's working and evolve it. The team compounds. |

Key change: L1-L2 are **pre-AI pain** (recognizable to anyone). L3 is the **AI twist** (makes it worse). L4-L5 are the resolution.

## Section Structure

1. **Header**: "Where does your team sit?" (punchy, diagnostic)
2. **Subtitle**: Short bridge — "Every team hits the same wall. Most just hit it faster now."
3. **Horizontal ladder** (desktop) / **vertical climb** (mobile) — same visual treatment as now
4. **Below the ladder**: The 3 "Sound familiar?" scenario cards (promoted from the old problem section) — these ground the ladder in real moments
5. **"What's missing" callout** — the single strongest line, compact: "A system where your team's know-how stays current and runs in every session."

## Files Changed

1. **`MaturityLadder.tsx`** — Rewrite LEVELS data, add "Sound familiar?" scenarios and "What's missing" callout below the ladder
2. **`Home.tsx`** — Remove `AIFragmentationSection` import, place `MaturityLadder` directly after `HeroSection`
3. **`HeroSection.tsx`** — Update the "See the problem ↓" button to scroll to the ladder's `id`

## What We're Cutting
- `AIFragmentationSection` as a standalone section (its best content moves into the ladder)
- The three "escalating cards" (Judgment gap / AI solved it / Now it's worse) — their story is now told by the ladder levels themselves
- Redundant copy that made the problem section feel long


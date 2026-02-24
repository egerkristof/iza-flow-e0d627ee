

# Merge the Two "Sound Familiar?" Sections

## The Problem

Two sections on the Enterprise page serve the same narrative purpose — "here's why AI isn't working." The original `Proof` section (4 quotes + 3 gap cards) and the new `TransformationFramework` (7 demand cards) overlap and dilute each other.

## The Solution

Merge them into one powerful section. The 7 demand-driven cards are the stronger framing. The executive quotes from `Proof` are useful social proof — they validate the demands. The 3 abstract gap cards (visibility, governance, adoption) are redundant since the 7 demands cover all of those more concretely.

## What Changes

### 1. Remove the standalone `Proof` component

Delete the entire `Proof()` function (lines 316-365) and its usage in the page composition. The 3 gap cards ("Same brief, 14 outputs", "Accountable but blind", "You paid. It should work.") are fully covered by demands 1, 3, and 7.

### 2. Add the best quotes into the TransformationFramework section

Move 2-3 of the strongest executive quotes into the `TransformationFramework` as a compact row above the 7 cards. This gives the section real-world validation before presenting the framework. Suggested quotes to keep:

- "We all use AI, but we get completely different results for the same brief." (Head of Strategy)
- "We bought Copilot for everyone. Three months later, adoption is 20% and quality is patchy." (COO)

These two directly map to demands 1 and 3, creating a natural "you've said this... here's why" flow.

### 3. Update the section heading

Change from the duplicate "Sound familiar?" tag to something that flows from the Maturity Ladder above it. New structure:

- Tag: "The 7 barriers"
- Heading: "Sound familiar?" (keep as the main heading -- it's strong)
- Subheading: "Every organisation hits these when they try to scale AI. We've built the answer to each one."

### 4. Update page composition

Remove `<Proof />` from the page render. The flow becomes:

```
Hero -> MaturityInfographic -> TransformationFramework (with quotes) -> LizaDifferentiator -> ...
```

This eliminates the repetition while making the single combined section stronger.

## Technical Details

| File | Change |
|---|---|
| `src/pages/EnterpriseDeck.tsx` | Delete `Proof()` function (~50 lines). Add 2 quote cards to `TransformationFramework` above the grid. Remove `<Proof />` from page composition. Update section tag from "Sound familiar?" to "The 7 barriers". |

No new files or dependencies needed. Single file edit.

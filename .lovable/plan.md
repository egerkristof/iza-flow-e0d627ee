## Goal

Fold the 6-slide "Organization as Code" thesis into `/factory` without bloating it. Replace existing slides where the new material is a sharper version, and insert only the genuinely new slides.

## Slot mapping

| Thesis slide | Action in `/factory` | Why |
|---|---|---|
| 1. Thesis · Infrastructure for Agentic Workforce | **Replace** S02 `category` | Sharper category statement; current `category` slide is the weakest opener |
| 2. Terraform for Organizations (Legacy AI vs LizaOS) | **Replace** `aace-not-rag` | Same argument, stronger frame (Terraform / Organization as Code) |
| 3. VSM Architecture (Brain / Spine / Sensors) | **Replace** `engine-bay` | Cleaner architectural diagram than current AACE-exposed slide |
| 4. Tokenomics by Design (cost-per-decision, design-time budgets, chargeback) | **Replace** `unit-economics` | Big upgrade: adds CFO-grade FinOps (design-time budgeting + per-decision chargeback) on top of current $0.40/decision economics |
| 5. Metacognitive Auto-Repair (Ghost Protocol) | **Insert NEW** before `org-loop` | Net-new defensible moat material; pairs naturally with the compounding network slide |
| 6. The Moat (LLM-agnostic, compliance, margins) | **Insert NEW** after `org-loop`, before `install` | Net-new explicit moat slide; current deck has no single moat slide |

Net change: 27 → 29 slides. Four replacements, two insertions.

## Voice & visual conformance

- No em-dashes / en-dashes (core rule). Use periods, mid-dots, or colons.
- High-contrast white theme (core rule).
- GRN for success, RED/NEU for gaps (core rule).
- Reuse existing slide component patterns and typography (`.slide-title`, `.slide-body`, etc.).
- Keep "moment of work with AI" lexicon where it appears.
- AACE locked to v3.1.

## Implementation

All work in `src/pages/FactoryDeck.tsx`. New slide components co-located in the same file (matching existing pattern of `F01Cover`, `FAtom`, etc.). Slide IDs:

- `thesis` (replaces `category`)
- `org-as-code` (replaces `aace-not-rag`)
- `vsm-architecture` (replaces `engine-bay`)
- `tokenomics` (replaces `unit-economics`)
- `auto-repair` (new)
- `moat` (new)

## Technical notes

- `RAW_SLIDES` array order updated in one edit.
- Old components (`StandardLayerDeckSlide` import for category, `FEngineBay`, `S07eAaceNotRag`, `S10UnitEconomics`) stay defined but are no longer referenced from `/factory` (other decks may use them — verified by ripgrep before removing imports).
- New components built with existing visual primitives (badges, grids, two-column layouts) already used in the file.

## Out of scope

- No changes to `/investor`, `/tech-dd`, or other decks.
- No new route. No standalone thesis deck.
- No memory updates yet (will update `mem://features/lifecycle-investor-deck` or equivalent after build if you want).

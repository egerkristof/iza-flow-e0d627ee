---
name: Vertical Deck Context-Gap Retrofit
description: Shared module + per-deck retrofit pattern that aligns vertical investor decks with the new pyramid/Organizational Intelligence narrative from /investor
type: feature
---

# Context-Gap Narrative Retrofit

The new `/investor` deck (`LifecycleInvestorDeckV2.tsx`) introduced three structural upgrades over the old artifact-triptych logic:

1. **Iceberg Context Gap** (replaces old Slide02 input → "?" → output triptych): one big iceberg with 4 above-waterline artifact chips and 4 below-waterline organizational-intelligence buckets (Operating Reasoning, Account Memory, Cross-Functional Decisions, Regulatory Practice).
2. **Exemplified Artifact** (new slide): annotated artifact specimen (email/deviation report/RFI/etc.) with 4 numbered pin-marks showing why each highlighted phrase is wrong. Right rail = margin notes (JUST CHANGED / OPEN ISSUE / CONTRADICTION / UNWRITTEN RULE).
3. **Single Vertical Pyramid** (replaces old Slide03 gap-cases): one large vertical-specific iceberg with above (artifacts AI sees) and below (organizational intelligence AI misses), red "what breaks" strip, and "same pattern in…" tag row. Old multi-card gap-cases layout is retired.
4. **Organizational Intelligence Unpacked** (new slide, after the architecture slide): hub-and-spoke knowledge-graph SVG with 6 facet cards that name what's actually inside the substrate.

## Shared module

All four slides are implemented as configurable components in `src/components/decks/ContextGapShared.tsx`:
- `IcebergContextGap` — `IcebergContextGapConfig`
- `ExemplifiedArtifact` — `ExemplifiedArtifactConfig` (with `BodyLine` segments supporting `{ mark, n }` highlighted phrases)
- `SinglePyramid` — `SinglePyramidConfig`
- `OrgIntelligenceUnpacked` — `OrgIntelligenceUnpackedConfig`

Each accepts a `DeckPalette` (TEAL/WARM/GREEN/RED/ACCENT). All vertical decks already share these palette HSL constants verbatim, so the module drops in cleanly.

## Per-deck retrofit recipe

For each of: PharmaInvestorDeck, AECInvestorDeck, BankingInvestorDeck, AutomotiveInvestorDeck, SatcomDeck, SpaceDeck:
1. Import the 4 components from `@/components/decks/ContextGapShared`.
2. Replace the body of `Slide02` to render `<IcebergContextGap config={{ palette, kicker, headline, subheadline, above, buckets }} />` with vertical-tailored above/buckets content.
3. Add a new `Slide02Exemplified` function rendering `<ExemplifiedArtifact />` with vertical-tailored artifact + 4 annotations (e.g. pharma = deviation report, AEC = RFI response, banking = campaign brief, automotive = ECU release note, satcom = mission ops directive, space = mission test report).
4. Replace the body of `Slide03` (the multi-card gap-cases layout) with `<SinglePyramid />` showing one large vertical iceberg.
5. Add a new `Slide06OrgIntel` function rendering `<OrgIntelligenceUnpacked />` with 6 vertical-reframed facets.
6. Insert both new slides into the `SLIDES` array: Exemplified right after Slide02, OrgIntel right after the Context Layer / architecture slide. Renumber `id` fields accordingly.

## Status

- ✅ PharmaInvestorDeck — retrofitted (reference implementation).
- ⏳ AEC, Banking, Automotive, Satcom, Space — pending; pattern locked, ready for mechanical application.

## Constraints

- Vertical-specific pyramid only (one iceberg per vertical deck), never the three-pyramid /investor layout.
- Old Slide02 triptych and old Slide03 gap-cases are replaced in place, not kept alongside.
- No em/en-dashes anywhere in the new copy.

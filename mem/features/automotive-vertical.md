---
name: Automotive R&D Vertical (VIE)
description: Automotive R&D / functional-safety vertical targeting VIE Technology Europe — industry page at /industries/automotive and 20-slide deck at /investor-automotive
type: feature
---

# Automotive R&D Vertical

Targets VIE Technology Europe (Budapest greenfield R&D for Zhejiang VIE Group) and analogous cross-border automotive R&D centers.

## Pages
- `/industries/automotive` → `src/pages/marketing/IndustryAutomotive.tsx` (lifecycle landing, mirrors IndustryBanking)
- `/investor-automotive` → `src/pages/AutomotiveInvestorDeck.tsx` (20-slide deck, cloned from BankingInvestorDeck → mirrors AEC/Pharma structure)

## Wedge (selected via expert-council pass)
**HQ → Europe engineering onboarding.** Codify chassis-control IP (EMB, wheel-hub motors), HQ design intent, and ISO 26262 / ASPICE judgment so Budapest hires reach productivity in weeks instead of 9–12 months. Highest-ROI surface in a greenfield site; clearest "no hallucination" story; lowest risk to pilot.

## Lifecycle
Concept & HARA → Requirements → Architecture → Design & Implementation → V&V → Safety Case & Release → SOP & Field Learning.

## Two-door CTA (consistent with Pharma / Banking / Satcom)
- **Option A — Customer:** 30-day onboarding pilot for a Budapest engineering team on one chassis-control or functional-safety workflow.
- **Option B — Strategic stake:** €3M minority to co-define the cross-border engineering reference architecture across Diankou, Beijing, Shanghai, Budapest.

## Standards anchored
ISO 26262, ASPICE, ISO 21434 (cybersecurity), ISO/PAS 21448 (SOTIF), IATF 16949, UNECE R155/R156, AUTOSAR, GDPR.

## Adjacent expansion surfaces
1. Functional safety & safety-case authoring (HARA, ASIL decomposition).
2. ASPICE & software process governance (traceability, V&V evidence).
3. OEM RFQ / supplier memory (Tier-1 bids across the four sites).

## Wiring
- Route in `src/App.tsx`.
- Registry entry in `src/data/presentationRegistry.ts` (id `investor-automotive`).
- Card on `/industries` hub under Regulated Industries.

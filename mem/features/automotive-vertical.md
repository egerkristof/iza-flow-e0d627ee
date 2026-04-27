---
name: Automotive R&D Vertical
description: Generic automotive R&D / functional-safety vertical for cross-border Tier-1 R&D centers — industry page at /industries/automotive and 20-slide deck at /investor-automotive
type: feature
---

# Automotive R&D Vertical

Generic vertical for cross-border automotive R&D organizations: an HQ engineering center plus one or more regional / greenfield R&D sites. Originally inspired by VIE Technology Europe; now positioned as a reusable deck for any Tier-1 with a similar HQ↔site topology.

## Pages
- `/industries/automotive` → `src/pages/marketing/IndustryAutomotive.tsx`
- `/investor-automotive` → `src/pages/AutomotiveInvestorDeck.tsx` (20-slide; cloned from BankingInvestorDeck → mirrors AEC/Pharma structure)

## Wedge
**HQ → site engineering onboarding.** Codify chassis-control IP, HQ design intent, and ISO 26262 / ASPICE judgment so new R&D engineers reach productivity in weeks instead of 9-12 months. Highest-ROI surface in any greenfield site; clearest "no hallucination" story; lowest risk to pilot.

## Lifecycle
Concept & HARA → Requirements → Architecture → Design & Implementation → V&V → Safety Case & Release → SOP & Field Learning.

## Two-door CTA (consistent with Pharma / Banking / Satcom)
- **Option A — Customer:** 30-day onboarding pilot for a single R&D team at one site, on one chassis-control or functional-safety workflow.
- **Option B — Strategic stake:** €3M minority to co-define the cross-border engineering reference architecture across HQ and regional R&D sites.

## Standards anchored
ISO 26262, ASPICE, ISO 21434 (cybersecurity), ISO/PAS 21448 (SOTIF), IATF 16949, UNECE R155/R156, AUTOSAR, GDPR.

## Genericization rules (do not re-add)
- No mention of Budapest, Diankou, Beijing, Shanghai, Zhejiang, or "VIE" in copy. Use "HQ", "regional R&D sites", "greenfield Tier-1 site", "new R&D site/team/hires" instead.
- Keep one architecture, every site framing for group-level expansion.

## Wiring
- Route in `src/App.tsx`.
- Registry entry in `src/data/presentationRegistry.ts` (id `investor-automotive`).
- Card on `/industries` hub under Regulated Industries.

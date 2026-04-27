---
name: banking-vertical
description: Retail banking lifecycle vertical (industry page + investor deck) with marketing wedge entry framing
type: feature
---
The Banking vertical was built to pitch retail-bank marketing leaders (initial target: OTP Hungary). Two artifacts:

1. **Industry page** at `/industries/banking` (`src/pages/marketing/IndustryBanking.tsx`) — mirrors the Pharma/AEC/Space industry-page structure: hero, retail-banking lifecycle strip (Policy → Brand → KYC → Underwriting → Servicing → Complaints → Audit), pain points framed for marketing leaders (campaign re-litigation, multi-country brand drift, no campaign memory), 4-step Capture/Govern/Execute/Learn loop, EBA/DORA/Consumer Duty/AML6 standards block, expansion-path cards (Marketing wedge → KYC → Credit → Group), two-door CTA.

2. **Investor deck** at `/investor-banking` (`src/pages/BankingInvestorDeck.tsx`) — full 20-slide clone of the AEC/Pharma deck structure (identical SlideShape, Slide02 context gap, Slide03 gap cases, Slide04Cost, SlideWhyNow, SlideArchitecture, SlideVerticalization, SlideExecutionChallenge, Slide09Partnership, etc.). Content reframed for retail-banking marketing leaders: brand book / product rules / regulator guidelines as inputs; campaign briefs / landing pages / disclosures as outputs; gap cases for Marketing & Brand, Compliance & Legal, Customer Servicing & Onboarding. **Slide13 = Two-Door Conversation** (Door 1 customer / 30-day marketing pilot, Door 2 €3M strategic stake) — same pattern as Pharma deck, NOT the single-outcome AEC ask.

**Palette**: deep navy `220 70% 22%` (primary), teal `190 85% 32%` (accent), warm gold `38 92% 50%` (Option B / co-invest). Distinct from Pharma's TEAL/MINT.

**Two-door CTA wording (consistent with other verticals)**: Option A = come on board as a customer (30-day pilot); Option B = co-invest in the category.

Registered in `presentationRegistry.ts` as `investor-banking` and in `App.tsx` route table. Surfaced on `/industries` hub under Regulated Industries with `Landmark` icon.

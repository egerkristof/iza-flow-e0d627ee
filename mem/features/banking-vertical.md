---
name: banking-vertical
description: Retail banking lifecycle vertical (industry page + investor deck) with marketing wedge entry framing
type: feature
---
The Banking vertical was built to pitch retail-bank marketing leaders (initial target: OTP Hungary). Two artifacts:

1. **Industry page** at `/industries/banking` (`src/pages/marketing/IndustryBanking.tsx`) — mirrors the Pharma/AEC/Space industry-page structure: hero, retail-banking lifecycle strip (Policy → Brand → KYC → Underwriting → Servicing → Complaints → Audit), pain points framed for marketing leaders (campaign re-litigation, multi-country brand drift, no campaign memory), 4-step Capture/Govern/Execute/Learn loop, EBA/DORA/Consumer Duty/AML6 standards block, expansion-path cards (Marketing wedge → KYC → Credit → Group), two-door CTA.

2. **Investor deck** at `/investor-banking` (`src/pages/BankingInvestorDeck.tsx`) — 12-slide focused deck (not a full Pharma-style 20-slide clone). Slide arc: Cover → Context Gap (banking inputs/outputs) → Where Gap Shows Up (5 banking pains, marketing flagged as WEDGE) → What It Costs (4 stat callouts) → Why Now → LIZA OS Loop → 30-Day Marketing Pilot → Expansion Path (lifecycle with marketing flagged as START HERE) → Category Moat (vs Glean/Copilot/MarTech/GRC) → What's Built → Shape of Company (Banking as spear) → Two-Door Conversation.

**Palette**: deep navy `220 70% 22%` (primary), teal `190 85% 32%` (accent), warm gold `38 92% 50%` (Option B / co-invest). Distinct from Pharma's TEAL/MINT.

**Two-door CTA wording (consistent with other verticals)**: Option A = come on board as a customer (30-day pilot); Option B = co-invest in the category.

Registered in `presentationRegistry.ts` as `investor-banking` and in `App.tsx` route table. Surfaced on `/industries` hub under Regulated Industries with `Landmark` icon.

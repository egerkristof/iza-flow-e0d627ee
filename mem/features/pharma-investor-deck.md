---
name: Pharma Investor Deck
description: Life sciences variant of the lifecycle investor deck at /investor-pharma, mirrors AEC structure but anchored in GxP/sponsor language
type: feature
---
The Pharma Investor Deck (`/investor-pharma`, `src/pages/PharmaInvestorDeck.tsx`) is a 20-slide life-sciences variant of the AEC investor deck. Same structural narrative reframed for pharma sponsors and CROs. Slide 02 is the "Shape of the Company" slide (`SlideShape`) — pharma framing of the spear-and-shield story (one OS, vertical-by-vertical deployment, pharma highlighted as the active vertical). The same component name `SlideShape` exists in the AEC and Lifecycle decks with different framings.

Key pharma anchors:
- Cost benchmarks: $2.6B per drug (Tufts), ~10% Phase I → approval rate, 30–40% repeat deviation rate.
- Competitors: Veeva Vault AI, Saama / Tempus AI, MasterControl / TrackWise, generic LLM stacks.
- Market: $15B+ TAM, $3-4B SAM, $200-300M SOM.
- Wedge: Deviation & CAPA Lifecycle Sprint (30-day Extract → Execute → Prove).
- Partnership ladder: Co-Sell → Joint Pilots → Embedded Layer under Veeva / eQMS.
- Verticals: Discovery & Trials → Manufacturing & Release → Pharmacovigilance.
- Advisors: Pharma Quality Advisor + Clinical Operations Advisor.

Registered in `src/data/presentationRegistry.ts` as `investor-pharma`. Default export `PharmaInvestorDeck`. Export filename `LIZA-OS-Pharma-Investor-Deck`.

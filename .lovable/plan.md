# Update Investor Deck and Sales Deck

Both slide decks need to be aligned with the current marketing site narrative and updated with correct specifics.

## Investor Deck (InvestorDeck.tsx) -- 14 slides



This affects:


| &nbsp; | &nbsp; | &nbsp; |
| ------ | ------ | ------ |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; |


### Narrative alignment with marketing site

Update slide copy to match the "standardisation" narrative and the AI Operating Model framing used across the website:

- **Slide 01 Cover**: Subtitle updated to match the home page hero -- "standardise senior judgment across every team"
- **Slide 02 Problem**: Tighten the three cards to match the "7 barriers" framing from the enterprise page (inconsistency, knowledge loss, AI making it worse)
- **Slide 04 Solution**: Subtitle "Knowledge-Activated Execution Engine" stays, but body copy aligned with the SECI flywheel language from the marketing site
- **Slide 06 Traction**: Update "3 Verticals" language to be clearer and more specific
- **Slide 08 GTM**: Phase 1 entry hook updated to match the "AI Operating Model Programme" language from the enterprise page

Market research numbers (TAM $47B, SAM $12B, SOM $800M, 23% CAGR) remain untouched.

---

## Sales/Consulting Deck (ConsultingDeck.tsx) -- 11 slides

### Align with marketing site narrative

The consulting deck currently leads with "Clients won't pay for what ChatGPT can do" which is strong but slightly disconnected from the enterprise page's "AI Operating Model Programme" framing. Updates:

- **Slide 01 Cover**: Keep the provocative hook but add the "DriveImpact x LIZA OS" branding chip and tighten the "4-Week Engagement" chip to match "4-week sprint" language from the site
- **Slide 02 Reality**: Update the three-column descriptions to be crisper and match the language used on the home page ("standardise judgment", "executable protocols")
- **Slide 05 Root Cause**: Tighten to match the "tacit vs explicit" framing from the enterprise page Maturity Ladder section
- **Slide 06 Mechanism**: Update the step descriptions to mirror the "Surface / Structure / Embed" three-phase language used consistently on the enterprise page
- **Slide 07 Deliverables**: Sharpen deliverable descriptions to match what the enterprise page promises
- **Slide 10 Who Built This**: Update bios to be consistent with the TeamSection component used on the marketing site (same role titles and descriptions)
- **Slide 11 CTA**: Update "driveimpact.ai" to use the actual calendar link and contact info from the marketing site ([kristof.eger@lizaos.ai](mailto:kristof.eger@lizaos.ai))

### Text clarity pass

Both decks get a clarity pass on all body copy:

- Remove jargon where possible
- Shorten sentences that run too long
- Make every slide's "so what" immediately obvious
- Ensure consistent terminology (e.g., always "playbooks" not sometimes "instruction sets")

---

## Technical Details


| File                           | Changes                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/InvestorDeck.tsx`   | Align narrative copy with marketing site. Tighten body text throughout.                                                   |
| `src/pages/ConsultingDeck.tsx` | Align slide copy with marketing site narrative. Update team bios. Update CTA contact info. Clarity pass on all body text. |


No new files, dependencies, or structural changes. Pure content updates within existing slide components.
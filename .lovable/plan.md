# /os as the homepage — expert council review and proposed structure

## Expert council assembled (for this review)

- **B2B SaaS positioning lead** (April Dunford school) — clarity for C-level buyers
- **Enterprise narrative designer** (Andy Raskin school) — story arc and stakes
- **Information architect / cognitive load specialist** — scrollability, scannability
- **Industry SMEs** — Pharma/Life Sciences, Financial Services, Space & Defense, Automotive, AEC, Professional Services, GTM/Sales (mapped to your existing `/industries/*` pages)
- **Interaction designer** (tactile metaphors — Rolodex, tabbed dividers, card flip)

## Verdict on the page as-is

Strong concept, but as a **homepage** it has three problems:

1. **Insider vocabulary**. "Judgment Core", "Native Surfaces", "Model Fabric", "Sensing Jobs", "Artifact Graph", "Workbooks", "Extraction", "Oversight" — every term needs translation for a CDO / Head of Digitalization on first read. They will not climb the ladder; they will leave.
2. **One-size diagram**. A pharma QA director and a sales ops VP need the *same architecture* explained in *their* objects (SOPs/CAPAs vs. accounts/playbooks). Generic labels make both feel it's "not for me".
3. **Linear scroll**. Hero → diagram → 5 principles → reframe. A visionary buyer wants to *land on their industry in one click*, not scroll-read theory.

## Proposed homepage structure

```text
┌────────────────────────────────────────────────────────────┐
│ 1. HERO — plain-English promise (1 sentence + sub)         │
│    "The system of record for how your company decides      │
│     — so every AI tool executes to your standard."         │
│    [ See it for my industry ↓ ]   [ Book a mapping call ]  │
├────────────────────────────────────────────────────────────┤
│ 2. THE DIAGRAM — interactive, industry-aware               │
│    Default = generic plain-English labels                  │
│    Right edge = Rolodex tabs: [Pharma][Banking][Space]…    │
│    Click a tab → entire diagram relabels in that industry  │
│    + a small card flips in showing 1 concrete scenario     │
├────────────────────────────────────────────────────────────┤
│ 3. THE FOUR MOVES — what the system actually does          │
│    Sense · Decide · Execute · Propagate (4 short cards)    │
├────────────────────────────────────────────────────────────┤
│ 4. INDUSTRY GRID — 6–8 cards, click → /industries/<slug>   │
├────────────────────────────────────────────────────────────┤
│ 5. THE REFRAME — Copilot/Glean/RAG inherit the standard    │
├────────────────────────────────────────────────────────────┤
│ 6. CTA — Map your stack (Cal link) + Score your AI exec   │
└────────────────────────────────────────────────────────────┘
```

The diagram becomes the **center of gravity**, not an illustration. You scroll less, *interact* more.

## Language revision (generic default)

| Today | Proposed default label | Why |
|---|---|---|
| Judgment Core | **Decision Standard** | Plain-English; "this is how we decide" |
| Systemic graph | **How we decide** (rules, playbooks, mandates) | Verb-led |
| Artifact graph | **What we produce** (every output, kept in sync) | Concrete |
| Native Surfaces | **Where work happens** (your AI workspace) | Spatial |
| Workbooks | **Guided work** | Outcome, not feature name |
| Extraction | **Knowledge capture** | Plain |
| Oversight | **Live oversight** | Plain |
| Source Systems | **Your systems of record** (Drive, ERP, LIMS…) | Buyer language |
| Connected Tools | **Your AI tools** (Copilot, Glean, ChatGPT…) | Buyer language |
| Strategic Control Tower | **Leadership view** (set direction, see reality) | Plain |
| Model Fabric | **Model layer** (LLM-agnostic) | Already common |
| Sync & propagate | **Updates ripple everywhere** | Plain |

Industry tabs override these labels with the industry's own nouns (e.g., Pharma: "How we decide" → "SOPs, CAPAs, Quality Mandates"; "What we produce" → "Batch records, deviation reports, dossiers").

## The interaction (your Rolodex idea)

Right edge of the diagram = vertical tab strip with industry chips:
**Pharma · Banking · Space & Defense · Automotive · AEC · Pro Services · GTM/Sales · Marketing**

- Hover a tab → tab nudges out, mini-preview of one renamed node
- Click a tab → all labels in the diagram cross-fade to that industry's vocabulary; a small **flip card** appears anchored to the most relevant block, front = "A real scenario in <industry>", back = 3-line outcome ("→ Approved batch release in 4h vs 3d", etc.)
- A subtle "→ Full <industry> view" link routes to `/industries/<slug>`

Default state on load = **Generic** (so first-time visitors get the architecture in plain English). A small "Pick your industry →" pulse points at the tab strip.

## What I'd build (scope of next iteration)

1. **Rewrite labels** in `LizaOSStack.tsx` to the plain-English defaults above (keep "Judgment Core" etc. as a hover/secondary line — "we call this the Judgment Core").
2. **Add an `industry` prop** to `LizaOSStack` plus an `INDUSTRY_LEXICON` map (8 industries × ~12 label overrides). Cross-fade with framer-motion on switch.
3. **Vertical Rolodex tabs** on the right edge of the diagram, sticky inside the diagram container.
4. **One flip card** per industry (front: scenario; back: outcome metric), anchored near the Native Surfaces block.
5. **Trim the page**: collapse the 5 Principles into the 4 Moves strip; keep the Reframe; cut hero length.
6. **Industry grid section** below, reusing existing `/industries/*` routes for click-through.

Out of scope for this iteration: rewriting industry pages themselves; new copy on `/industries/*`.

## Open question for you

Pick one for the **default hero sentence** so I can lock the voice:

- A) "The system of record for how your company decides — so every AI tool executes to your standard."
- B) "One decision standard. Every AI tool inherits it."
- C) "Your company's judgment, made executable across every AI tool you own."

Tell me A / B / C (or your own), and I'll ship the rebuild.

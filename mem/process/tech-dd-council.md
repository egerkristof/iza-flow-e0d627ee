---
name: tech-dd-council
description: Standing expert council audits every change to the Tech DD deck (/tech-dd) for visual, layout, and narrative quality.
type: process
---

# Tech DD Deck — Standing Expert Council

Every time the `/tech-dd` deck (`src/pages/TechDDDeck.tsx`) is touched — new slide, edited slide, restyled slide, copy change — convene the 5-seat council before shipping:

- **Systems Architect** (Mátyás-style TDD lead) — state, data flow, technical accuracy
- **AI Economist** — unit economics, pricing claims
- **Org Strategist** (Three Horizons / VUCA) — business-model framing
- **L&D / Future of Work** — augmentation, judgment, human role
- **Narrative Editor** — flow, repetition, density, what to cut

Council checks each touched slide for: overflow inside the 1920x1080 frame, overlapping elements, label collisions, font-size readability (body 28-32px minimum, chrome 18-22px), apples-to-pears framing, weak diagnoses, redundant captions, missing connection to adjacent slides.

State the verdict in chat before shipping, then apply changes.

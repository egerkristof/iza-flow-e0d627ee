# Tech DD Deck — Expert Council Review & Next Iteration

You asked for a plan, not a build. Apologies for jumping ahead last round. Below is the council review of the current `/tech-dd` deck plus the proposed next iteration, before any code changes.

---

## 1. The Council (composition)

A 5-seat virtual council, each with a distinct lens. They review the deck together; I synthesise.

| Seat | Lens | Reviews |
|---|---|---|
| **Systems Architect** (Mátyás-style TDD lead) | State management, data flow, failure modes | Slides 4, 5, 6 |
| **AI Economist** | Unit economics of inference, pricing evolution | Slides 7, 8 |
| **Org Strategist** (Three Horizons / VUCA) | Business-model context, why-now | Opener, Slide 2 |
| **L&D / Future of Work** | Talent, judgment, augmentation | Slide 9 (Upskilling) |
| **Narrative Editor** | Flow, repetition, what to cut | Whole deck |

---

## 2. Council Verdict on Current Deck

### What works
- **Slides 4–6** (OS Map, AACE Loop, Artifact Graph + Rationale Log): keep as-is. This is the architectural spine TDD teams want to see.
- **Slide 3** (Iceberg / Context Gap): keep. Clean handoff from paradigm to product.
- **Slide 8** (Semantic Metering pyramid 1× / 5× / 25×): keep. This is the punchline.

### What is wrong or weak

**Slide 7 — Margin Trap (your correction, accepted).**
The current framing — "LLM API cost is dropping, flat SaaS seats get squeezed" — is **the wrong diagnosis**. The truth is the opposite movement:

- The whole industry (OpenAI, Anthropic, Google, Microsoft) is migrating *toward* usage/API-based pricing, not away from it.
- Per-seat is the legacy model. API-metered is the new floor.
- The real risk is not falling token cost. The real risk is **unanchored consumption**: tokens billed without a link to the business value they produced. CFOs will cut that line first.
- The right mental model is the **human labour market**: a company already prices a junior hour differently from a partner hour. LIZA reproduces this — different decision classes carry different value, and our metering reflects that.

**Slide 9 — Upskilling.**
Good intent, too soft, not technical enough. It currently reads like an HR slide. Needs to connect to the architecture: *what* the human brings (creativity, self-awareness, ethical judgment) vs. *what* the system carries (encoded senior decision-trees, governed execution). That is a technical separation-of-concerns argument, not a feel-good one.

**Missing — a context-setting opener.**
The deck currently opens on the infrastructure shift (data → cognitive). The council says we are missing one step before that: *why* infrastructure has to change at all. The **Three Horizons collapse** — the McKinsey model where Horizon 1 (run), 2 (improve), 3 (transform) used to be sequential and now run concurrently at the edge — is the business-model truth that forces the cognitive-infrastructure conclusion. Without this, the architecture answer arrives before the question.

---

## 3. Proposed Next Iteration (slide list)

9 slides total. Same three-phase arc, one slide added at the front, slide 7 reframed, slide 9 hardened.

| # | Title | Owner | Change |
|---|---|---|---|
| 1 | Cover — Architecture, State & Margin | Kristóf | Keep |
| 2 | **NEW · The Three Horizons Collapse** | Kristóf | **Add** |
| 3 | Infrastructure Shift (Data → Cognitive) | Kristóf | Keep, light edit |
| 4 | The Context Gap (Iceberg) | Kristóf | Keep |
| 5 | LIZA OS System Architecture | Zoltán | Keep |
| 6 | AACE v3.3 · 4-Step Loop · State-Locking | Zoltán | Keep |
| 7 | Artifact Propagation & Rationale Log | Zoltán | Keep |
| 8 | **REFRAMED · The Pricing Inversion → Value-Based Metering** | István | **Merge old 7 + 8 into one** |
| 9 | **HARDENED · The Augmentation Engine** (was Upskilling) | Zsombor | **Rewrite** |

Net: −1 slide (old margin trap), +1 slide (Three Horizons), +1 reframe, +1 rewrite. Still 9 total.

---

## 4. Detail of the three changed slides

### Slide 2 (NEW) — The Three Horizons Collapse

**Headline.** "The three horizons used to be sequential. They now run simultaneously, at the edge."

**Visual.** Two diagrams side by side.
- *Left (the past):* three stacked time-bands — H1 Run, H2 Improve, H3 Transform — drawn as a clean staircase across years.
- *Right (today):* the same three bands collapsed into a single overlapping zone labelled "permanent edge state", with arrows pointing inward.

**Talking point.** "Every business is now running, improving, and transforming on the same calendar week. You cannot solve that with sequential planning cycles or static SOPs. You solve it with a runtime that holds the company's reasoning and updates it continuously. That runtime is the cognitive infrastructure on slide 3."

**Why this slide.** Gives the TDD team the business-model premise that justifies all the architecture that follows. Without it, slides 3–7 feel like a technology in search of a problem.

---

### Slide 8 (REFRAMED) — The Pricing Inversion → Value-Based Metering

Replaces both the current Slide 7 (Margin Trap) and Slide 8 (Pyramid). One slide, two halves.

**Headline.** "Every AI vendor is converging on usage-based pricing. The question is *what* you meter."

**Left half — The Pricing Inversion.**
- Short timeline: per-seat SaaS → hybrid → usage-based API.
- One line of body: "The industry is moving the right direction. Per-token billing aligns cost with consumption. But raw tokens are not a business unit. A CFO cannot defend them."
- Failure mode in red: **unanchored consumption**.

**Right half — Value-Based Semantic Metering.**
- Direct analogy to the human labour market — this is the framing you gave me, kept verbatim in spirit:
  - A company already prices a **junior hour** ≠ a **senior hour** ≠ a **partner hour**.
  - It does that because the *decision weight* differs, not because the human "costs more electricity".
  - LIZA reproduces the same structure for machine work.
- Then the pyramid (kept from old slide 8):
  - **1× — Operational Execution** (draft, summarise, fill template) ≈ junior hour.
  - **5× — Process Design & Governance** (update Playbook, run drift detection) ≈ senior hour.
  - **25× — Strategic Simulation** (war-game a pivot) ≈ partner hour.
- Closing line: "Because the state is locked to a Playbook, we know the *decision class* of every execution. We charge for the weight of the decision, not the weight of the tokens. Revenue tracks strategic ROI, not API price."

**Why this works.** It accepts the industry truth (everything is going API-metered), removes the wrong "race to the bottom" diagnosis, and uses the human-labour analogy as the bridge to our metering model. One slide, one argument.

---

### Slide 9 (HARDENED) — The Augmentation Engine

Rename "Upskilling Engine" → "Augmentation Engine" and rebuild it as a technical separation-of-concerns slide.

**Headline.** "We hire humans for what only humans bring. The system carries the rest."

**Visual.** Two columns rendered as architecture, not HR:
- *Left column — Human contribution* (irreducible): Creativity · Self-awareness · Ethical judgment · Re-framing the future of the company. Note: *"This is why a junior is worth hiring. It is not what the LLM provides."*
- *Right column — System contribution* (encoded): Senior decision-trees · Governed Playbooks · Standards · Rationale Log · State-locked execution. Note: *"This is what eroded when senior staff left. LIZA holds it now."*

**Bottom band — the loop.** A small horizontal diagram:
`Junior intent → LIZA Playbook (senior knowledge, state-locked) → Senior-quality artifact → Junior internalises → Capability compounds`

**Talking point.** "A junior brings the creative, ethical, self-aware judgment that lets a company re-imagine itself at the edge — slide 2. They cannot bring 20 years of governed decision-making on day one. Historically that meant either a 10-year ramp or institutional memory loss when seniors left. The Augmentation Engine resolves this: the human provides judgment, the system provides governed execution. Together they ship senior-quality output from day one."

**Why this works.** Connects directly back to slide 2 (three horizons collapse demands constant re-imagination → only humans do that) and to slide 6 (State-Locking is what makes the junior's output safe). It is now load-bearing, not optional.

---

## 5. Open question for you before I build

Two small calls I want you to make before I touch code:

1. **Slide 9 (Augmentation Engine):** main deck or still a "pocket" reserve slide? The council recommends **promoting it into the main deck** because it now resolves a tension the new opener creates. Your call.
2. **Three Horizons attribution:** do you want the slide to credit the Three Horizons model (McKinsey / Baghai-Coley-White) explicitly, or stay un-attributed and frame it as our own observation? Either is defensible.

Once you confirm, I will implement: add slide 2, replace old slides 7+8 with the new merged slide, rewrite slide 9, and re-export.

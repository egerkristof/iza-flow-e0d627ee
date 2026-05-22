# Lifecycle Investor Deck V2 — Council Review & Restructure

You asked for a council to review the current V2 deck (`/investor`, `src/pages/LifecycleInvestorDeck.tsx`, 20 slides) and propose a new structure built around **one core thesis**:

> The operator's moment of decision is the new unit of work. LIZA brings every standard, prior decision, and governance constraint into that moment — and executes the chosen action with full traceability. Pricing follows the same logic: we meter the **weight of the decision**, not the weight of the tokens.

This is a plan, not a build. No code changes yet.

---

## 1. The Council

Same 5-seat council we use for `/tech-dd`, plus one rotating seat (Investor Lens) because this is a fundraising artifact, not an engineering doc.

| Seat | Lens |
|---|---|
| **Systems Architect** | Is the architecture story load-bearing for the thesis? |
| **AI Economist** | Does the metering / unit-economics story land? |
| **Org Strategist** | Is the operator-moment frame defensible as a category? |
| **L&D / Future of Work** | Is the human-in-the-loop story honest and specific? |
| **Narrative Editor** | Flow, repetition, what to cut |
| **Investor Lens** (Seed / Series A partner) | Would I lean in at slide 2? |

---

## 2. Verdict on the current V2 (20 slides)

Current order (paraphrased): Cover → Context Gap → Where it shows up → What it costs → Persona Reality → Early Validation → Why Now → Context Layer → Strategic Shift → Category Thesis → Expansion → Shape of Company → What's Built → Business Model → 30-Day Challenge → Team → Ask → Appendix (How It Works, Architecture).

**What's working — keep:**
- *Early Validation* (slide 7) — four anonymised paid/design engagements. This is the most under-leveraged slide in the deck. Stays.
- *What's Built / 30-Day Challenge / Team / Ask* — operationally required. Stays.
- *Shape of the Company* (spear-and-shield) — keeps, but moves earlier.
- *Cost of Context Gap* (slide 5) — the €550K/yr number is the only quantified pain. Stays, tightened.

**What's wrong — the diagnosis:**

1. **The thesis is missing from the first 90 seconds.** Slides 2–6 are all *problem statement* (Context Gap × 5 variations). An investor reads "you have a real pain to point at" but does not yet know *what you believe about the world*. The operator-moment thesis never appears as its own slide; it's diffused across 8 slides as architecture vocabulary ("Context Engine", "Context Layer", "AACE", "intent-locking").
2. **Infrastructure language buries the category bet.** "Context Layer / Context Engine / Standards Engineering" is *what we build*. The investor wants *what we believe* first, *what we build* second. Today it's reversed.
3. **The pricing story is absent.** Slide 16 ("Business Model") describes seats / tiers, not the **pricing inversion → value-based semantic metering** argument that the Tech DD deck makes. This is the single biggest piece of investor-grade IP we have and it doesn't appear in the investor deck.
4. **The Impact Deck's "moment of action" governance view is also absent.** That summary slide is the visual proof that the thesis is shippable today — it should be one of the first three slides, not absent.
5. **Five flavours of the same pain.** Slides 2, 3, 4, 5, 6 all restate the Context Gap. Investors get it by slide 3. The other two should be doing different work (thesis, proof).
6. **"Why Now" arrives at slide 8, too late, and is generic.** It should fuse with the *Three Horizons Collapse* + *Pricing Inversion* arguments from Tech DD — both are sharper "why now" claims than what's there.
7. **30-Day Challenge is buried at slide 17.** It's our strongest commercial wedge. It should sit next to the business model, not after the team slide.

**Investor Lens, blunt:** *"I read 'context gap' five times before I read what you actually do. By the time I get to your pricing slide I've stopped listening for category and started listening for ARR."* That has to flip.

---

## 3. The new spine — one thesis, five movements

```text
ACT I  — THE BET        (what we believe)
ACT II — THE WORLD      (why now, why this shape)
ACT III— THE PRODUCT    (what we built that proves it)
ACT IV — THE ECONOMICS  (how it makes money, defensibly)
ACT V  — THE COMPANY    (validation, team, ask)
```

Each act has 3–4 slides. **Total: 17 main + 3 appendix = 20.** Same length, completely different centre of gravity.

---

## 4. Proposed slide list (V3)

| # | Title | Source | Change |
|---|---|---|---|
| **Act I — The Bet** | | | |
| 1 | Cover | existing | keep |
| 2 | **The Operator's Moment is the New Unit of Work** | NEW (built from DD slide) | **add** — single thesis sentence + the DD "operator in the middle" visual |
| 3 | **The Moment of Action, Governed** | NEW (built from Impact deck summary slide) | **add** — the visual proof: standards + prior decisions + governance converging into the operator's decision, then executed |
| 4 | The Context Gap (Iceberg) | existing Slide02 | keep, recast as *what's missing from the moment today* |
| **Act II — The World** | | | |
| 5 | **Why Now — Three Horizons Collapse + Pricing Inversion** | NEW (port from Tech DD) | **add** — merges "Why Now" and the world-is-changing argument |
| 6 | Where Missing Context Shows Up | existing Slide03 | keep, compressed |
| 7 | What Missing Context Costs (€550K/yr) | existing Slide03Cost | keep |
| **Act III — The Product** | | | |
| 8 | The Context Layer (what we built) | existing Slide05 | keep, reframed as *the substrate for the moment* |
| 9 | **Shape of the Company** (spear-and-shield) | existing SlideShape | **move earlier** (was 14 → now 9) |
| 10 | What's Built Today | existing Slide10 | keep |
| 11 | Strategic Shift (modular → lifecycle) | existing Slide06Shift | keep, tighter |
| **Act IV — The Economics** | | | |
| 12 | **Pricing Inversion → Value-Based Semantic Metering** | NEW (port from Tech DD slide 8) | **add** — junior/senior/partner-hour analogy; 1× / 5× / 25× |
| 13 | Business Model | existing Slide11 | keep, but now *consequence of slide 12*, not standalone |
| 14 | 30-Day Execution Challenge | existing | **move up** from 17 → 14, now the commercial wedge proof |
| **Act V — The Company** | | | |
| 15 | Early Validation (four engagements) | existing Slide08 | keep, promote visually |
| 16 | Category Thesis & Moat | existing Slide06 | keep, tightened — moat = state-locking + standards as portable container |
| 17 | Team + The Ask | merge Slide12 + Slide13 | **merge** — one slide, two halves |
| **Appendix** | | | |
| A1 | Appendix divider | existing | keep |
| A2 | How It Works (AACE loop) | existing Slide07 | keep |
| A3 | Architecture | existing SlideArchitecture | keep |

**Net:** −5 (compression of Context Gap variants + Team/Ask merge), +5 (Thesis, Moment-of-Action, Why-Now-fused, Pricing Inversion, Persona-Reality folded into Slide 6). 17 main + 3 appendix = 20 — same length, new gravity.

---

## 5. The three load-bearing new slides (detail)

### Slide 2 — The Operator's Moment is the New Unit of Work
- **Headline:** "The unit of work is no longer the task. It is the operator's moment of decision."
- **Visual:** the Tech DD "operator in the middle" diagram — operator at centre, four arrows converging (standards, prior decisions, governance, live context), one arrow leaving (executed action with audit trail).
- **Body (one paragraph, 3 lines):** "In the AI age, value is created or destroyed at the moment an operator decides what to do. LIZA is the system that makes that moment the highest-leverage moment in the company — by bringing every relevant standard, every prior decision, and every governance constraint into it, and then executing the chosen action with full traceability."
- **Footer line:** "Everything that follows is a consequence of this bet."

### Slide 3 — The Moment of Action, Governed
- **Source:** the Impact deck summary slide (the governance view around the action point).
- **Headline:** "We don't sell AI. We sell governed moments of action."
- **Visual:** the Impact deck slide, reused.
- **Talking point:** "This is the first artefact in market that makes the thesis visible — a moment of decision wrapped in standards, with the human on top and the AI executing inside the bounded standard. It already runs in four paid engagements (slide 15)."

### Slide 12 — Pricing Inversion → Value-Based Semantic Metering
- Port verbatim from the Tech DD reframed slide 8.
- **Left half:** the industry is moving per-seat → API-metered. Raw tokens are not a defensible unit. *Unanchored consumption* is the failure mode every CFO will cut first.
- **Right half:** human-labour analogy — junior hour ≠ senior hour ≠ partner hour. LIZA reproduces this with **decision class**, because state is locked to a Playbook. Pyramid: **1× Operational / 5× Process & Governance / 25× Strategic Simulation.**
- **Closing line:** "We charge for the weight of the decision, not the weight of the tokens. Revenue tracks strategic ROI, not API price."

---

## 6. What I am NOT proposing

- Not renaming the product.
- Not touching the homepage. The thesis gets tested in 3–5 live investor conversations first (per prior council guidance).
- Not removing the Context Gap material — just compressing 5 slides to 2.
- Not touching AEC / Pharma / Banking / Automotive variants yet. They inherit once V3 is validated.
- Not building anything in this turn. Once you approve the spine, I'll implement slide-by-slide.

---

## 7. Two calls I need from you before building

1. **Slide 3 visual** — do I lift the Impact deck summary slide as-is (fastest, proven), or rebuild it native to the investor deck's visual system (cleaner, slower)? Council recommends **lift as-is** for V3.0, rebuild for V3.1 after investor reactions.
2. **Appendix or main deck for AACE loop?** Today it's appendix. With the operator-moment thesis as slide 2, the AACE loop becomes the *mechanism* of the moment. Council split: Architect + Investor Lens want it promoted to slide 11; Narrative Editor wants it kept in appendix to protect the 17-slide spine. **Default if you don't choose: keep in appendix.**

Once you confirm the spine and the two calls, I'll implement: add slides 2 / 3 / 5 / 12, compress the Context Gap block, move Shape + 30-Day Challenge, merge Team+Ask, and re-export.

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
